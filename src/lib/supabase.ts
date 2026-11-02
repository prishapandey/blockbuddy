import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ListingItem, CorridorPing, RentalBooking } from '../types';
import { INITIAL_ITEMS } from '../data/initialData';

// User provided Supabase publishable key
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_waGGp1r3T9kK8aBphEb0GA_2J8uQZkg';

// Stored or environment Supabase Project URL
const getStoredSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('blockbuddy_supabase_url');
    if (saved && saved.trim()) return saved.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://qyjgjycqsuhgechvwoha.supabase.co';
};

let currentUrl = getStoredSupabaseUrl();
let supabaseInstance: SupabaseClient | null = null;

try {
  if (currentUrl && SUPABASE_PUBLISHABLE_KEY) {
    supabaseInstance = createClient(currentUrl, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('Initial Supabase client setup notice:', err);
}

export const getSupabaseClient = (): SupabaseClient | null => supabaseInstance;

export const updateSupabaseUrl = (newUrl: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blockbuddy_supabase_url', newUrl);
  }
  currentUrl = newUrl;
  try {
    supabaseInstance = createClient(newUrl, SUPABASE_PUBLISHABLE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to initialize client with new URL:', e);
    return false;
  }
};

export const getCurrentSupabaseConfig = () => ({
  url: currentUrl,
  publishableKey: SUPABASE_PUBLISHABLE_KEY,
  isKeyConnected: Boolean(SUPABASE_PUBLISHABLE_KEY),
});

// Local Storage Cache Keys
const STORAGE_ITEMS_KEY = 'blockbuddy_listings_cache';
const STORAGE_PINGS_KEY = 'blockbuddy_pings_cache';
const STORAGE_BOOKINGS_KEY = 'blockbuddy_bookings_cache';

// Helper to get cached items
export const getLocalItems = (): ListingItem[] => {
  if (typeof window === 'undefined') return INITIAL_ITEMS;
  try {
    const cached = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading local listings:', e);
  }
  return INITIAL_ITEMS;
};

export const setLocalItems = (items: ListingItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local listings:', e);
  }
};

// Fetch listings. When the database responds successfully, it is the source of truth
// for user-created listings. Demo items are added for a usable first-time experience,
// but browser-cache-only listings are never mistaken for database-persisted records.
export async function fetchAllListings(): Promise<{
  items: ListingItem[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  const localItems = getLocalItems();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { items: localItems, source: 'local', error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('blockbuddy_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { items: localItems, source: 'local', error: error.message };
    }

    const remoteItems: ListingItem[] = (data || []).map((d: any) => ({
      id: String(d.id),
      title: d.title,
      description: d.description || '',
      category: d.category || 'marketplace',
      priceDisplay: d.price_display || `₹${d.price_value || 0}`,
      priceValue: Number(d.price_value) || 0,
      priceUnit: d.price_unit || '',
      secondaryPrice: d.secondary_price || undefined,
      deposit: d.deposit || undefined,
      locationTag: d.location_tag || 'Campus',
      hostel: d.hostel || 'H-12',
      wingOrRoom: d.wing_or_room || '',
      sellerName: d.seller_name || 'Campus Student',
      imageUrl: d.image_url || '',
      status: d.status || 'available',
      badgeNote: d.badge_note || undefined,
      quickTag: d.quick_tag || undefined,
      createdAt: d.created_at || undefined,
    }));

    // Preserve the built-in sample cards without allowing stale local-only listings
    // to masquerade as shared listings after a cache reset.
    const merged = [...remoteItems];
    INITIAL_ITEMS.forEach((sample) => {
      if (!merged.some((item) => item.id === sample.id)) merged.push(sample);
    });

    setLocalItems(merged);
    return { items: merged, source: 'supabase' };
  } catch (err: any) {
    console.warn('Supabase query error, relying on local storage cache:', err);
    return { items: localItems, source: 'local', error: err?.message || 'Supabase query failed.' };
  }
}

// Save to the shared database first-class, then update the local cache as a convenience.
// A local cache is not durable storage: clearing browser data removes it.
export async function addListingItem(item: ListingItem): Promise<{
  success: boolean;
  savedToSupabase: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { error } = await supabase.from('blockbuddy_items').insert([{
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        price_display: item.priceDisplay,
        price_value: item.priceValue,
        price_unit: item.priceUnit,
        secondary_price: item.secondaryPrice ?? null,
        deposit: item.deposit ?? null,
        location_tag: item.locationTag,
        hostel: item.hostel,
        wing_or_room: item.wingOrRoom,
        seller_name: item.sellerName,
        image_url: item.imageUrl,
        status: item.status,
        badge_note: item.badgeNote ?? null,
        quick_tag: item.quickTag ?? null,
      }]);

      if (error) {
        console.warn('Supabase listing insert failed:', error.message);
        const cached = getLocalItems();
        setLocalItems([item, ...cached.filter((existing) => existing.id !== item.id)]);
        return { success: false, savedToSupabase: false, error: error.message };
      }

      const cached = getLocalItems();
      setLocalItems([item, ...cached.filter((existing) => existing.id !== item.id)]);
      return { success: true, savedToSupabase: true };
    } catch (err: any) {
      const cached = getLocalItems();
      setLocalItems([item, ...cached.filter((existing) => existing.id !== item.id)]);
      return { success: false, savedToSupabase: false, error: err?.message || 'Database request failed.' };
    }
  }

  const cached = getLocalItems();
  setLocalItems([item, ...cached.filter((existing) => existing.id !== item.id)]);
  return { success: false, savedToSupabase: false, error: 'Supabase client is not configured.' };
}

// Save corridor ping
export async function saveCorridorPing(ping: CorridorPing): Promise<{
  success: boolean;
  savedToSupabase: boolean;
}> {
  // Local storage
  try {
    const raw = localStorage.getItem(STORAGE_PINGS_KEY);
    const pings: CorridorPing[] = raw ? JSON.parse(raw) : [];
    pings.unshift(ping);
    localStorage.setItem(STORAGE_PINGS_KEY, JSON.stringify(pings));
  } catch (e) {
    console.error('Local ping error:', e);
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: true, savedToSupabase: false };

  try {
    const { error } = await supabase.from('blockbuddy_pings').insert([
      {
        id: ping.id,
        item_id: ping.itemId,
        item_title: ping.itemTitle,
        seller_name: ping.sellerName,
        sender_name: ping.senderName,
        sender_hostel: ping.senderHostel,
        message: ping.message,
        created_at: ping.timestamp,
        status: ping.status,
      },
    ]);
    if (!error) return { success: true, savedToSupabase: true };
  } catch (e) {
    // Graceful fallback
  }

  return { success: true, savedToSupabase: false };
}

// Save rental booking
export async function saveRentalBooking(booking: RentalBooking): Promise<{
  success: boolean;
  savedToSupabase: boolean;
}> {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    const bookings: RentalBooking[] = raw ? JSON.parse(raw) : [];
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Local booking error:', e);
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: true, savedToSupabase: false };

  try {
    const { error } = await supabase.from('blockbuddy_bookings').insert([
      {
        id: booking.id,
        item_id: booking.itemId,
        item_title: booking.itemTitle,
        renter_name: booking.renterName,
        renter_hostel: booking.renterHostel,
        renter_room: booking.renterRoom,
        duration_type: booking.durationType,
        duration_count: booking.durationCount,
        total_amount: booking.totalAmount,
        deposit_amount: booking.depositAmount,
        pickup_time: booking.pickupTime,
        status: booking.status,
      },
    ]);
    if (!error) return { success: true, savedToSupabase: true };
  } catch (e) {
    // Graceful fallback
  }

  return { success: true, savedToSupabase: false };
}

export function getLocalPings(): CorridorPing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLocalBookings(): RentalBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
