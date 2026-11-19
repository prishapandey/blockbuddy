import React, { useState } from 'react';
import { CheckCircle2, Clock, MapPin, Send, ShieldCheck, User, X } from 'lucide-react';
import { CorridorPing, RentalBooking, StudentProfile } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  pings: CorridorPing[];
  bookings: RentalBooking[];
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onUpdateProfile,
  pings,
  bookings,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'pings' | 'rentals'>('profile');
  const [name, setName] = useState(currentStudent.name);
  const [hostel, setHostel] = useState(currentStudent.hostel);
  const [wing, setWing] = useState(currentStudent.wing);
  const [room, setRoom] = useState(currentStudent.room);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentStudent,
      name,
      hostel,
      wing,
      room,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-md rounded-xl p-6 space-y-4 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4d8eff]/20 border border-[#4d8eff]/30 flex items-center justify-center text-[#4d8eff]">
              <User className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Student Account</h3>
              <p className="text-[11px] text-[#94a3b8] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#3ecf8e]" />
                <span>Verified IITB Student</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0a0a0c] border border-[#22252b] rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#121316] text-white font-medium border border-[#22252b]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            My Room &amp; Wing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pings')}
            className={`py-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'pings'
                ? 'bg-[#121316] text-white font-medium border border-[#22252b]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Pings</span>
            {pings.length > 0 && (
              <span className="bg-[#4d8eff] text-white text-[9px] px-1 rounded-full">
                {pings.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rentals')}
            className={`py-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'rentals'
                ? 'bg-[#121316] text-white font-medium border border-[#22252b]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Rentals</span>
            {bookings.length > 0 && (
              <span className="bg-[#4d8eff] text-white text-[9px] px-1 rounded-full">
                {bookings.length}
              </span>
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Student Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Campus Email (Verified):</label>
              <input
                type="email"
                disabled
                value={currentStudent.email}
                className="w-full bg-[#0a0a0c]/60 border border-[#22252b] rounded-md text-[#94a3b8] p-2.5 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[#94a3b8] block font-medium">Hostel:</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
                >
                  <option value="H-12">H-12</option>
                  <option value="H-13">H-13</option>
                  <option value="H-14">H-14</option>
                  <option value="H-15">H-15</option>
                  <option value="H-16">H-16</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[#94a3b8] block font-medium">Wing:</label>
                <input
                  type="text"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#94a3b8] block font-medium">Room #:</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Save Room Details
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#1a1c22] hover:bg-[#252830] text-[#94a3b8] text-xs font-medium px-4 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Pings Tab */}
        {activeTab === 'pings' && (
          <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
            {pings.length === 0 ? (
              <div className="text-center py-8 text-[#64748b]">
                <Send className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p>No recent corridor pings sent.</p>
                <p className="text-[11px] mt-1">Tap "Ping for Pickup" on any item to initiate.</p>
              </div>
            ) : (
              pings.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#0a0a0c] border border-[#22252b] rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{p.itemTitle}</span>
                    <span className="text-[10px] text-[#3ecf8e] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sent to Wing
                    </span>
                  </div>
                  <p className="text-[#94a3b8] text-[11px]">"{p.message}"</p>
                  <div className="flex items-center justify-between text-[10px] text-[#64748b] pt-1 border-t border-[#22252b]/60">
                    <span>To: {p.sellerName}</span>
                    <span>{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-[#64748b]">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p>No active rental reservations.</p>
                <p className="text-[11px] mt-1">Rent kettles, calculators or fans for exams.</p>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#0a0a0c] border border-[#22252b] rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{b.itemTitle}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4d8eff]/15 text-[#4d8eff] font-medium">
                      Active Rental
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#94a3b8] text-[11px]">
                    <span>Rate: ₹{b.totalAmount}</span>
                    <span>Pickup: {b.pickupTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
