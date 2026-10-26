import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RentGearSection } from './components/RentGearSection';
import { NeedItNowSection } from './components/NeedItNowSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { CampusTrustSection } from './components/CampusTrustSection';
import { Footer } from './components/Footer';
import { RentModal } from './components/modals/RentModal';
import { ChatModal } from './components/modals/ChatModal';
import { SellListModal } from './components/modals/SellListModal';
import { SupabaseSettingsModal } from './components/modals/SupabaseSettingsModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { SafetyModal } from './components/modals/SafetyModal';
import { Toast } from './components/Toast';

import { ListingItem, StudentProfile, CorridorPing, RentalBooking } from './types';
import { INITIAL_ITEMS, INITIAL_STUDENT } from './data/initialData';
import {
  fetchAllListings,
  addListingItem,
  saveCorridorPing,
  saveRentalBooking,
  getLocalItems,
  getLocalPings,
  getLocalBookings,
  getCurrentSupabaseConfig,
} from './lib/supabase';

export default function App() {
  const [items, setItems] = useState<ListingItem[]>(getLocalItems);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('blockbuddy_student_profile');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT;
    } catch {
      return INITIAL_STUDENT;
    }
  });

  const [pings, setPings] = useState<CorridorPing[]>(getLocalPings);
  const [bookings, setBookings] = useState<RentalBooking[]>(getLocalBookings);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHostelFilter, setSelectedHostelFilter] = useState('H-12 & 14');
  const [activeQuickTag, setActiveQuickTag] = useState('');
  const [urgentHostelFilter, setUrgentHostelFilter] = useState('all');
  const [activeNavTab, setActiveNavTab] = useState('home');

  // Supabase Sync Status
  const [sourceType, setSourceType] = useState<'supabase' | 'local'>('local');
  const [supabaseConnected, setSupabaseConnected] = useState(
    () => getCurrentSupabaseConfig().isKeyConnected
  );

  // Modals
  const [rentModalItem, setRentModalItem] = useState<ListingItem | null>(null);
  const [chatModalItem, setChatModalItem] = useState<ListingItem | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Load from Supabase on mount
  const loadData = async () => {
    try {
      const res = await fetchAllListings();
      if (res.items && res.items.length > 0) {
        setItems(res.items);
      }
      setSourceType(res.source);
      if (res.source === 'supabase') {
        setSupabaseConnected(true);
      }
    } catch (e) {
      console.warn('Listing sync:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStudentProfile = (updated: StudentProfile) => {
    setCurrentStudent(updated);
    try {
      localStorage.setItem('blockbuddy_student_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`Profile updated to ${updated.hostel} · ${updated.room}`);
  };

  // Filter items logic
  const filteredRentals = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== 'rental') return false;

      // Quick Tag
      if (activeQuickTag && item.quickTag !== activeQuickTag) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.locationTag.toLowerCase().includes(q) ||
          (item.quickTag && item.quickTag.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Hostel Filter
      if (selectedHostelFilter === 'H-12 & 14') {
        return item.hostel === 'H-12' || item.hostel === 'H-14' || item.hostel === 'H-13' || item.hostel === 'H-15';
      }
      if (selectedHostelFilter !== 'all' && selectedHostelFilter) {
        return item.hostel === selectedHostelFilter;
      }

      return true;
    });
  }, [items, activeQuickTag, searchQuery, selectedHostelFilter]);

  const filteredUrgentItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== 'urgent') return false;

      // Quick Tag
      if (activeQuickTag && item.quickTag !== activeQuickTag) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.locationTag.toLowerCase().includes(q) ||
          (item.quickTag && item.quickTag.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Specific Need-it-now hostel filter
      if (urgentHostelFilter !== 'all') {
        return item.hostel === urgentHostelFilter;
      }

      // Global hostel filter
      if (selectedHostelFilter === 'H-12 & 14') {
        return item.hostel === 'H-12' || item.hostel === 'H-14' || item.hostel === 'H-15' || item.hostel === 'H-16';
      }
      if (selectedHostelFilter !== 'all' && selectedHostelFilter) {
        return item.hostel === selectedHostelFilter;
      }

      return true;
    });
  }, [items, activeQuickTag, searchQuery, urgentHostelFilter, selectedHostelFilter]);

  const filteredMarketplaceItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== 'marketplace') return false;

      if (activeQuickTag && item.quickTag !== activeQuickTag) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.locationTag.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedHostelFilter !== 'all' && selectedHostelFilter !== 'H-12 & 14') {
        return item.hostel === selectedHostelFilter;
      }

      return true;
    });
  }, [items, activeQuickTag, searchQuery, selectedHostelFilter]);

  // Actions
  const handleRentSubmit = async (data: {
    item: ListingItem;
    durationType: 'exam' | 'hour' | 'day' | 'week';
    durationCount: number;
    pickupTime: string;
    message: string;
    totalAmount: number;
  }) => {
    const booking: RentalBooking = {
      id: `booking-${Date.now()}`,
      itemId: data.item.id,
      itemTitle: data.item.title,
      renterName: currentStudent.name,
      renterHostel: currentStudent.hostel,
      renterRoom: currentStudent.room,
      durationType: data.durationType,
      durationCount: data.durationCount,
      totalAmount: data.totalAmount,
      depositAmount: 150,
      pickupTime: data.pickupTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const ping: CorridorPing = {
      id: `ping-${Date.now()}`,
      itemId: data.item.id,
      itemTitle: data.item.title,
      sellerName: data.item.sellerName,
      senderName: currentStudent.name,
      senderHostel: currentStudent.hostel,
      message: data.message,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setBookings((prev) => [booking, ...prev]);
    setPings((prev) => [ping, ...prev]);
    setRentModalItem(null);

    await saveRentalBooking(booking);
    await saveCorridorPing(ping);

    showToast(`Rent request sent to ${data.item.sellerName.split(' ')[0]}! (${data.pickupTime})`);
  };

  const handleChatSubmit = async (data: { item: ListingItem; message: string }) => {
    const ping: CorridorPing = {
      id: `ping-${Date.now()}`,
      itemId: data.item.id,
      itemTitle: data.item.title,
      sellerName: data.item.sellerName,
      senderName: currentStudent.name,
      senderHostel: currentStudent.hostel,
      message: data.message,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setPings((prev) => [ping, ...prev]);
    setChatModalItem(null);

    await saveCorridorPing(ping);

    showToast(
      data.item.category === 'urgent'
        ? 'Ping sent! Seller notified via corridor messenger.'
        : `Message sent to ${data.item.sellerName.split(' ')[0]}!`
    );
  };

  const handleCreateListing = async (newItem: ListingItem) => {
    setItems((prev) => [newItem, ...prev]);
    const res = await addListingItem(newItem);
    if (res.savedToSupabase) {
      showToast(`Item published and synced to Supabase database!`);
    } else {
      showToast(`Item listed in ${newItem.hostel}! Available immediately.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-[#4d8eff] selection:text-white bg-[#0a0a0c] text-[#94a3b8]">
      {/* Top Navbar */}
      <Navbar
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
        currentStudent={currentStudent}
        supabaseConnected={supabaseConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-16">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedHostelFilter={selectedHostelFilter}
          onHostelFilterChange={setSelectedHostelFilter}
          onQuickFilter={setActiveQuickTag}
          activeQuickTag={activeQuickTag}
        />

        {/* Section 1: Rent Campus Equipment */}
        <RentGearSection
          items={filteredRentals}
          onRentClick={(item) => setRentModalItem(item)}
          onSwitchToBuy={() => {
            const el = document.getElementById('marketplace');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 2: Need It Now (Immediate Corridor Handoff) */}
        <NeedItNowSection
          items={filteredUrgentItems}
          selectedHostel={urgentHostelFilter}
          onSelectHostel={setUrgentHostelFilter}
          onPingClick={(item) => setChatModalItem(item)}
        />

        {/* Section 3: Fresh on Marketplace */}
        <MarketplaceSection
          items={filteredMarketplaceItems}
          onChatClick={(item) => setChatModalItem(item)}
        />

        {/* Section 4: Campus Safety & Simple Trade Flow */}
        <CampusTrustSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Interactive Modals */}
      <RentModal
        item={rentModalItem}
        isOpen={Boolean(rentModalItem)}
        onClose={() => setRentModalItem(null)}
        onSubmit={handleRentSubmit}
        currentStudent={currentStudent}
      />

      <ChatModal
        item={chatModalItem}
        isOpen={Boolean(chatModalItem)}
        onClose={() => setChatModalItem(null)}
        onSubmit={handleChatSubmit}
        currentStudent={currentStudent}
      />

      <SellListModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmit={handleCreateListing}
        currentStudent={currentStudent}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentStudent={currentStudent}
        onUpdateProfile={handleUpdateStudentProfile}
        pings={pings}
        bookings={bookings}
      />

      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefreshData={loadData}
        sourceType={sourceType}
      />

      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
