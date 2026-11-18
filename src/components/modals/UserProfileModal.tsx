import React, { useState } from 'react';
import { CheckCircle2, Clock, Send, ShieldCheck, User, X } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      <div className="modal-container max-w-md">
        <header className="flex items-center justify-between border-b border-faint p-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-accent-wash/50 border border-accent/20 flex items-center justify-center text-accent">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 id="profile-modal-title" className="text-body text-ink">Student Account</h3>
              <p className="text-caption text-muted flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-accent" aria-hidden="true" />
                <span>Verified IITB Student</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas hover:bg-faint text-muted hover:text-ink transition-colors cursor-pointer flex items-center justify-center"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Tab Switcher */}
        <div className="tab-pills px-5 mb-2 w-full" role="tablist" aria-label="Account sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className={`tab-pill flex-1 ${activeTab === 'profile' ? 'tab-pill-active' : ''}`}
          >
            My Room & Wing
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pings'}
            onClick={() => setActiveTab('pings')}
            className={`tab-pill flex-1 flex items-center justify-center gap-1 ${activeTab === 'pings' ? 'tab-pill-active' : ''}`}
          >
            <span>Pings</span>
            {pings.length > 0 && (
              <span className="bg-accent text-white text-[9px] px-1.5 rounded-full">{pings.length}</span>
            )}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rentals'}
            onClick={() => setActiveTab('rentals')}
            className={`tab-pill flex-1 flex items-center justify-center gap-1 ${activeTab === 'rentals' ? 'tab-pill-active' : ''}`}
          >
            <span>Rentals</span>
            {bookings.length > 0 && (
              <span className="bg-accent text-white text-[9px] px-1.5 rounded-full">{bookings.length}</span>
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="px-5 pb-5 space-y-4 text-caption">
            <div className="space-y-2">
              <label className="text-caption text-muted block">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-pill"
              />
            </div>

            <div className="space-y-2">
              <label className="text-caption text-muted block">Campus Email (Verified)</label>
              <input
                type="email"
                disabled
                value={currentStudent.email}
                className="input-pill bg-canvas/60 text-muted cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <label className="text-caption text-muted block">Hostel</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="input-pill appearance-none bg-surface cursor-pointer"
                >
                  <option value="H-12">H-12</option>
                  <option value="H-13">H-13</option>
                  <option value="H-14">H-14</option>
                  <option value="H-15">H-15</option>
                  <option value="H-16">H-16</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-caption text-muted block">Wing</label>
                <input
                  type="text"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="input-pill"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption text-muted block">Room #</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="input-pill"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-faint">
              <button
                type="submit"
                className="flex-1 btn-pill btn-pill-primary justify-center py-3"
              >
                Save Room Details
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-pill btn-pill-secondary py-3 px-6"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Pings Tab */}
        {activeTab === 'pings' && (
          <div className="px-5 pb-5 space-y-2 max-h-60 overflow-y-auto text-caption">
            {pings.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <Send className="w-8 h-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
                <p className="text-body">No recent corridor pings sent.</p>
                <p className="text-[10px] mt-1">Tap "Ping for Pickup" on any item to initiate.</p>
              </div>
            ) : (
              pings.map((p) => (
                <article
                  key={p.id}
                  className="card-elevated p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-ink truncate">{p.itemTitle}</span>
                    <span className="text-[10px] text-accent flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      Sent to Wing
                    </span>
                  </div>
                  <p className="text-muted text-[10px]">"{p.message}"</p>
                  <div className="flex items-center justify-between text-[10px] text-muted pt-2 border-t border-faint">
                    <span>To: {p.sellerName}</span>
                    <span>{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="px-5 pb-5 space-y-2 max-h-60 overflow-y-auto text-caption">
            {bookings.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
                <p className="text-body">No active rental reservations.</p>
                <p className="text-[10px] mt-1">Rent kettles, calculators or fans for exams.</p>
              </div>
            ) : (
              bookings.map((b) => (
                <article
                  key={b.id}
                  className="card-elevated p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-ink truncate">{b.itemTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-wash/50 text-accent">
                      Active Rental
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted text-[10px]">
                    <span>Rate: ₹{b.totalAmount}</span>
                    <span>Pickup: {b.pickupTime}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};