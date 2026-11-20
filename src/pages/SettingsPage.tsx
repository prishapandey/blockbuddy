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
  const [hostel, setHostel] = useState(student?.hostel || 'H-12');
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Manage your account, preferences and database connection.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-[#121316] border border-[#22252b] rounded-xl overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${tab === key ? 'bg-[#1e2128] text-white border border-[#353945]' : 'text-[#94a3b8] hover:text-white'}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ---- Profile ---- */}
      {tab === 'profile' && (
        <div className="bg-[#121316] border border-[#22252b] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Account Details</h2>

          <div className="flex items-center gap-4 p-4 bg-[#0f1013] border border-[#22252b] rounded-lg">
            <div className="w-12 h-12 rounded-full bg-[#4d8eff]/20 border border-[#4d8eff]/30 flex items-center justify-center text-[#4d8eff] font-bold text-lg">
              {(student?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{student?.name}</p>
              <p className="text-xs text-[#64748b]">{student?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Full Name', value: name, setter: setName, type: 'text' },
              { label: 'Department', value: dept, setter: setDept, type: 'text' },
            ].map(({ label, value, setter, type }) => (
              <div key={label} className="space-y-1">
                <label className="text-[#94a3b8] font-medium">{label}</label>
                <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#4d8eff] text-sm" />
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-[#94a3b8] font-medium">Hostel</label>
              <select value={hostel} onChange={(e) => setHostel(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#4d8eff] text-sm">
                {['H-12','H-13','H-14','H-15','H-16'].map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#94a3b8] font-medium">Wing</label>
              <input type="text" value={wing} onChange={(e) => setWing(e.target.value)}
                placeholder="e.g. Wing B"
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#4d8eff] text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-[#94a3b8] font-medium">Room Number</label>
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204"
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#4d8eff] text-sm" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={handleSaveProfile}
              className="flex items-center gap-1.5 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
            <button type="button" onClick={handleLogout}
              className="flex items-center gap-1.5 bg-[#1a1c22] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-[#22252b] text-[#94a3b8] text-xs font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ---- Notifications ---- */}
      {tab === 'notifications' && (
        <div className="bg-[#121316] border border-[#22252b] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Notification Preferences</h2>
          {[
            { label: 'Corridor Pings', desc: 'When someone pings you for an item you listed.', value: notifPings, setter: setNotifPings },
            { label: 'Rental Requests', desc: 'When someone sends you a rental booking request.', value: notifRentals, setter: setNotifRentals },
            { label: 'New Listings', desc: 'When new items are listed in your hostel.', value: notifNewListings, setter: setNotifNewListings },
          ].map(({ label, desc, value, setter }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-[#22252b] last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
              </div>
              <button type="button" onClick={() => setter((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${value ? 'bg-[#4d8eff]' : 'bg-[#22252b]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => showToast('Notification preferences saved.')}
            className="flex items-center gap-1.5 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer mt-2">
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      )}

      {/* ---- Database ---- */}
      {tab === 'database' && (
        <div className="bg-[#121316] border border-[#22252b] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Supabase Connection</h2>
            <span className="text-[11px] text-[#3ecf8e] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
              Connected
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#94a3b8] font-medium">Project URL</label>
            <input type="text" value={supaUrl} onChange={(e) => setSupaUrl(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-lg text-sm text-white px-3 py-2.5 font-mono focus:outline-none focus:border-[#4d8eff]" />
          </div>

          <div className="p-3 bg-[#0f1013] border border-[#22252b] rounded-lg text-xs text-[#64748b] space-y-1">
            <p><span className="text-[#94a3b8]">Anon Key:</span> {cfg.publishableKey.slice(0, 20)}••••</p>
            <p className="text-[11px]">Set <code className="bg-[#1a1c22] px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-[#1a1c22] px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in Vercel environment variables for production.</p>
          </div>

          <button type="button" onClick={handleSaveDb}
            className="flex items-center gap-1.5 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
            {dbSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {dbSaved ? 'Saved!' : 'Save URL'}
          </button>
        </div>
      )}

      {/* ---- Privacy ---- */}
      {tab === 'privacy' && (
        <div className="bg-[#121316] border border-[#22252b] rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Privacy & Safety</h2>
          <div className="space-y-3 text-xs text-[#94a3b8]">
            {[
              ['Campus-only access', 'Only @iitb.ac.in emails can create an account. Your listings are never visible outside the campus network.'],
              ['No data sold', 'BlockBuddy does not sell or share your data with any third party.'],
              ['Direct P2P payments', 'All payments are via UPI directly between students. BlockBuddy never handles money.'],
              ['Corridor handoffs', 'All trades happen in person on campus. No couriers, no strangers.'],
            ].map(([title, desc]) => (
              <div key={String(title)} className="flex gap-3 p-3 bg-[#0f1013] border border-[#22252b] rounded-lg">
                <Shield className="w-4 h-4 text-[#3ecf8e] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-xs">{title}</p>
                  <p className="mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out & Clear Session
          </button>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
};
