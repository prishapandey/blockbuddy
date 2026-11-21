import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Database, LogOut, Save, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import { getCurrentSupabaseConfig, updateSupabaseUrl } from '../lib/supabase';

type Tab = 'profile' | 'notifications' | 'database' | 'privacy';

export const SettingsPage: React.FC = () => {
  const { student, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('profile');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  // Profile fields
  const [name, setName] = useState(student?.name || '');
  const [hostel, setHostel] = useState(student?.hostel || 'A Block');
  const [room, setRoom] = useState(student?.room || '');
  const [wing, setWing] = useState(student?.wing || '');
  const [dept, setDept] = useState(student?.department || '');

  // Notification prefs
  const [notifPings, setNotifPings] = useState(true);
  const [notifRentals, setNotifRentals] = useState(true);
  const [notifNewListings, setNotifNewListings] = useState(false);

  // DB
  const cfg = getCurrentSupabaseConfig();
  const [supaUrl, setSupaUrl] = useState(cfg.url);
  const [dbSaved, setDbSaved] = useState(false);

  const handleSaveProfile = () => {
    if (!student) return;
    updateProfile({ ...student, name, hostel, room, wing, department: dept });
    showToast('Profile updated.');
  };

  const handleSaveDb = () => {
    updateSupabaseUrl(supaUrl);
    setDbSaved(true);
    showToast('Supabase URL updated. Refresh to sync.');
    setTimeout(() => setDbSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'database', label: 'Database', icon: Database },
    { key: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-[#CDCBD6]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-[#9fa293] mt-1">Manage your account, preferences and database connection.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-[#202115] border border-[#434630] rounded-xl overflow-x-auto shadow">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              tab === key
                ? 'bg-[#D96846] text-white shadow'
                : 'text-[#CDCBD6] hover:text-white hover:bg-[#2b2d1e]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ---- Profile ---- */}
      {tab === 'profile' && (
        <div className="bg-[#26271a] border border-[#434630] rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-sm font-semibold text-white">Account Details</h2>

          <div className="flex items-center gap-4 p-4 bg-[#1e1f14] border border-[#434630] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#596235]/40 border border-[#596235] flex items-center justify-center text-[#D96846] font-bold text-lg">
              {(student?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{student?.name}</p>
              <p className="text-xs text-[#9fa293]">{student?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Full Name', value: name, setter: setName, type: 'text' },
              { label: 'Department', value: dept, setter: setDept, type: 'text' },
            ].map(({ label, value, setter, type }) => (
              <div key={label} className="space-y-1">
                <label className="text-[#CDCBD6] font-medium">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#D96846] text-sm"
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-[#CDCBD6] font-medium">Hostel</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#D96846] text-sm"
              >
                {['A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block'].map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#CDCBD6] font-medium">Wing</label>
              <input
                type="text"
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                placeholder="e.g. Wing B"
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#D96846] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#CDCBD6] font-medium">Room Number</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204"
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#D96846] text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="flex items-center gap-1.5 bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-[#202115] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-[#434630] text-[#CDCBD6] text-xs font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ---- Notifications ---- */}
      {tab === 'notifications' && (
        <div className="bg-[#26271a] border border-[#434630] rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-sm font-semibold text-white">Notification Preferences</h2>
          {[
            { label: 'Corridor Pings', desc: 'When someone pings you for an item you listed.', value: notifPings, setter: setNotifPings },
            { label: 'Rental Requests', desc: 'When someone sends you a rental booking request.', value: notifRentals, setter: setNotifRentals },
            { label: 'New Listings', desc: 'When new items are listed in your hostel.', value: notifNewListings, setter: setNotifNewListings },
          ].map(({ label, desc, value, setter }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-[#434630] last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-[#9fa293] mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setter((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${
                  value ? 'bg-[#D96846]' : 'bg-[#434630]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => showToast('Notification preferences saved.')}
            className="flex items-center gap-1.5 bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer mt-2 shadow"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      )}

      {/* ---- Database ---- */}
      {tab === 'database' && (
        <div className="bg-[#26271a] border border-[#434630] rounded-2xl p-6 space-y-4 shadow-lg">
          <div>
            <h2 className="text-sm font-semibold text-white">Supabase Connection</h2>
            <p className="text-xs text-[#9fa293] mt-0.5">
              Connect your own Supabase project for persistent listings, bookings, and student profiles.
            </p>
          </div>

          <div className="p-4 bg-[#1e1f14] border border-[#434630] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#596235]" />
              <span className="font-semibold text-white">Status: Connected / Configured</span>
            </div>
            <p className="text-[#9fa293] text-[11px] leading-relaxed">
              BlockBuddy automatically synchronizes listing updates, corridor pings, and rental escrow bookings to your Supabase tables.
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[#CDCBD6] font-medium">Supabase Project URL:</label>
            <input
              type="text"
              value={supaUrl}
              onChange={(e) => setSupaUrl(e.target.value)}
              className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-white px-3 py-2 text-xs focus:outline-none focus:border-[#D96846]"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveDb}
            className="flex items-center gap-1.5 bg-[#D96846] hover:bg-[#c45735] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow"
          >
            <Save className="w-3.5 h-3.5" />
            Update Supabase Config
          </button>
        </div>
      )}

      {/* ---- Privacy ---- */}
      {tab === 'privacy' && (
        <div className="bg-[#26271a] border border-[#434630] rounded-2xl p-6 space-y-4 shadow-lg text-xs">
          <h2 className="text-sm font-semibold text-white">Privacy &amp; Data Scope</h2>
          <div className="space-y-2 text-[#CDCBD6]/90 leading-relaxed">
            <p>
              • <strong>Campus Domain Gating:</strong> Your account is validated exclusively via institutional email domains. External commercial crawlers or non-student accounts are prohibited.
            </p>
            <p>
              • <strong>Corridor Visibility:</strong> Counterparties only see your registered hostel block and first name to arrange safe corridor pickups.
            </p>
            <p>
              • <strong>Direct Payments:</strong> All monetary handoffs are settled peer-to-peer via UPI or cash. BlockBuddy never takes custody of fiat funds.
            </p>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
};
