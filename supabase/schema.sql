-- BlockBuddy persistent database schema
-- Run this once in Supabase Dashboard -> SQL Editor.
-- Public insert/read policies are suitable only for a classroom demo. Add auth-based
-- policies before using this with real student personal information.

CREATE TABLE IF NOT EXISTS public.blockbuddy_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('rental', 'urgent', 'marketplace')),
  price_display TEXT NOT NULL DEFAULT '',
  price_value NUMERIC NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT '',
  secondary_price TEXT,
  deposit TEXT,
  location_tag TEXT NOT NULL DEFAULT 'Campus',
  hostel TEXT NOT NULL DEFAULT 'H-12',
  wing_or_room TEXT NOT NULL DEFAULT '',
  seller_name TEXT NOT NULL DEFAULT 'Campus Student',
  image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available',
  badge_note TEXT,
  quick_tag TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blockbuddy_pings (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  item_title TEXT,
  seller_name TEXT,
  sender_name TEXT,
  sender_hostel TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blockbuddy_bookings (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  item_title TEXT,
  renter_name TEXT,
  renter_hostel TEXT,
  renter_room TEXT,
  duration_type TEXT,
  duration_count NUMERIC,
  total_amount NUMERIC,
  deposit_amount NUMERIC,
  pickup_time TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.blockbuddy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockbuddy_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockbuddy_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read blockbuddy_items" ON public.blockbuddy_items;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_items" ON public.blockbuddy_items;
DROP POLICY IF EXISTS "Allow public read blockbuddy_pings" ON public.blockbuddy_pings;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_pings" ON public.blockbuddy_pings;
DROP POLICY IF EXISTS "Allow public insert blockbuddy_bookings" ON public.blockbuddy_bookings;

CREATE POLICY "Allow public read blockbuddy_items" ON public.blockbuddy_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_items" ON public.blockbuddy_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read blockbuddy_pings" ON public.blockbuddy_pings FOR SELECT USING (true);
CREATE POLICY "Allow public insert blockbuddy_pings" ON public.blockbuddy_pings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert blockbuddy_bookings" ON public.blockbuddy_bookings FOR INSERT WITH CHECK (true);
