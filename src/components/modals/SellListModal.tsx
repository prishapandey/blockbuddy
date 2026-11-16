import React, { useState } from 'react';
import { Camera, Plus, Sparkles, X } from 'lucide-react';
import { ItemCategory, ListingItem, StudentProfile } from '../../types';

interface SellListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: ListingItem) => void;
  currentStudent: StudentProfile;
}

export const SellListModal: React.FC<SellListModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentStudent,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<ItemCategory>('rental');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceValue, setPriceValue] = useState<string>('30');
  const [rentalUnit, setRentalUnit] = useState<string>('/ day');
  const [deposit, setDeposit] = useState<string>('Deposit: ₹150 (refundable)');
  const [hostel, setHostel] = useState<string>(currentStudent.hostel || 'H-12');
  const [wingOrRoom, setWingOrRoom] = useState<string>(
    `${currentStudent.wing}, ${currentStudent.room}`
  );
  const [imageUrl, setImageUrl] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDllvskdLkt9jCBso5ZEn27Zu2YH5gwBoMU_ttrC5pOewNorongGSLu4KKZSCVkE8AoP4kOuumKb4DLLLwYFWjbMlPl-ktE4QF2NtLewa9ipDw9c9oGOrqtyaemX8Q3hGNgNImMAKb9jfFdcwiiTVfC3aDhoQ0DjFlk7FS6BRM_cZ3SDFYlYsh8kxbHkeRAMvq4pDD_MCLwQ7cxNbDHeA2ij1K0kua60JHsQGU1oHBbyOP_UdnKOD6gAg'
  );
  const [badgeNote, setBadgeNote] = useState<string>('Clean & Working');

  const presetImages = [
    {
      label: 'Kettle / Cooking',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDllvskdLkt9jCBso5ZEn27Zu2YH5gwBoMU_ttrC5pOewNorongGSLu4KKZSCVkE8AoP4kOuumKb4DLLLwYFWjbMlPl-ktE4QF2NtLewa9ipDw9c9oGOrqtyaemX8Q3hGNgNImMAKb9jfFdcwiiTVfC3aDhoQ0DjFlk7FS6BRM_cZ3SDFYlYsh8kxbHkeRAMvq4pDD_MCLwQ7cxNbDHeA2ij1K0kua60JHsQGU1oHBbyOP_UdnKOD6gAg',
    },
    {
      label: 'Calculator',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD12UeXydACFaEn82qPO_LLwle0B7ilTqdbbwgvbBEOJy7y46TaZ_69Qf8kajaTHnSEfjvXQTWrzFHRO1DpX91vws_mmAE56GFzqU_fJXxi0ajXc0oOBhyOCEflMK8epxgRvGcA08OWI7AFNF7AcDLu2h2E3wLT-ITIgqsMxL20ssq85RojxR7gSnNRhGW1a0AyLDgTlEBx5R07TqFcFzf0hefhwLZFs1SH_qnkhHmdJ4ek3vquwazI2w',
    },
    {
      label: 'Iron',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqV-Ikqb--YqUb6xdnlIPD6u9wHIGOvZc2rhsAim5m2GaTK9cqpyoV7qbzfzLrFfgoD0EVDziugV7KgZFWXWMydDcoZ-fXeOf-noN1hYdmp6U4xaRZooEvZ_MddYjkiO_O5z7FhETyOliBIeqVuTx3tp5ScSFcHrM9V_10wTKpmAN0-ygoJw5j4p7mXAndHoKa8Jh1_PS_Oc4TxAQF-3GV0yTI7sF23q9-v-JxUs1EQOJO8mrnsFfWxw',
    },
    {
      label: 'Charger Cable',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbmpKqdz3p1hyaavhH-Rq9B6TmrlaOPXDOxL3w34kvGpWBtZcPY-1tm8ZkwVYTMYRsqH3ZNHmrbu-yZ4iyD8AZf06hZXuVqbC25mlaC3Az8JN2p18aSIAgYKhTXIzIUSc09WCIXPdNcIq6CUzHUKyvJr2WV6iHm6nwZvoj3xcZKCRFZNsrNsm7wda7uUJi13PwHqYmSKWF2qW-ejgRtcGjG-ghWmz53biGZy9SpkiDgdqiX51wYDYN9Q',
    },
    {
      label: 'Stationery / Pen',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd7WibILZIrCx2IfZnH5hgQqCfsJecrZ808-fIDZRRA2X6icvBPX5QfqxPDQwF3nLu1DsX6K8sFSIEjfvB7zYXyxxtslJCCkD5TgDfcgBFx3NieRJiSIX-uHBE5NufHD1vtEc84JK0ziG7Stf_FqgYR1k8TKLbIC3ycUuZP4ahZWTQiFurlwMvhihJ-Rt-Bd2o2RaFCH_h7FnX8weZse3-o9zq0jEHH2Wm7bcQZArdqFreePClfZ13_w',
    },
    {
      label: 'Notebook Register',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZJW7_MFT7N8QbpxpRxSDxodhtpzRXSJnHF8IwlJGGNpAoR9c_ohkDBOoRItNTkR-IiYUc4D6OXroTI1ysKftyGexPCX0ZHh2wO43VkxbJrx-oxCht1CBna_ZXjHV91QzQ38K85L_ELpGrAySgPyy4rqnB0JKJ-qLeWLNZCR9MngXqcyKzfL-UI1Ta-cc3Pa7h5kSR29hVvRsxXydlmXsFHTuurRzFjEZd-wQtSTphgGpnknfeXSnJg',
    },
    {
      label: 'Noodles / Snacks',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcelmayIJLgyIJqndLfVeE_6nEMUWnbkkKOSqA-9fQ7fQcf9XQ5l6-Q0ztsj89A68V1JRZt8tjzM7Lbp9BPV7CI-aKDXZl5VBe3Lc2DIXgeqs-KFyR3KTFNpyNzzln7ToHIgm7Uaj-1mcABLL0CJDpWt4nHLNBU0qG41lr-g38LRTbrSfXLdrc30WiRjCWHQinv-oe3WdAwrud35akY_8YqUKs0gOPa6dQcB3sZNNUix3G4c4PHV1ZjA',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !priceValue) return;

    const numVal = parseFloat(priceValue) || 0;
    const priceDisplay = `₹${numVal.toLocaleString()}`;
    const locationTag = `Hostel ${hostel.replace('H-', '')} · ${wingOrRoom.split(',')[0] || 'Campus'}`;

    const newItem: ListingItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Available for hostel wing corridor handoff.',
      category,
      priceDisplay,
      priceValue: numVal,
      priceUnit: category === 'rental' ? rentalUnit : '',
      deposit: category === 'rental' ? deposit : undefined,
      locationTag,
      hostel,
      wingOrRoom,
      sellerName: `${currentStudent.name} (${hostel})`,
      imageUrl: imageUrl.trim() || presetImages[0].url,
      status: 'available',
      badgeNote: badgeNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sell-modal-title">
      <div className="modal-container max-w-lg">
        <header className="flex items-center justify-between border-b border-faint p-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-accent">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h3 id="sell-modal-title" className="text-body text-ink">List Campus Item</h3>
              <p className="text-caption text-muted">Direct peer-to-peer exchange with zero fees</p>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-caption">
          {/* Category Tabs */}
          <fieldset className="space-y-3">
            <legend className="text-caption text-muted">Listing Type</legend>
            <div className="tab-pills w-full">
              <button
                type="button"
                onClick={() => {
                  setCategory('rental');
                  setRentalUnit('/ day');
                }}
                className={`tab-pill flex-1 flex flex-col items-center gap-1 ${category === 'rental' ? 'tab-pill-active' : ''}`}
                aria-selected={category === 'rental'}
              >
                <span>Rent Gear</span>
                <span className={`text-[10px] ${category === 'rental' ? 'text-white/80' : 'text-accent'}`}>Hourly/Daily</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('urgent');
                  setRentalUnit('');
                }}
                className={`tab-pill flex-1 flex flex-col items-center gap-1 ${category === 'urgent' ? 'tab-pill-active' : ''}`}
                aria-selected={category === 'urgent'}
              >
                <span>Need It Now</span>
                <span className={`text-[10px] ${category === 'urgent' ? 'text-white/80' : 'text-muted'}`}>15m Corridor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('marketplace');
                  setRentalUnit('');
                }}
                className={`tab-pill flex-1 flex flex-col items-center gap-1 ${category === 'marketplace' ? 'tab-pill-active' : ''}`}
                aria-selected={category === 'marketplace'}
              >
                <span>Marketplace</span>
                <span className={`text-[10px] ${category === 'marketplace' ? 'text-white/80' : 'text-muted'}`}>Thrift & Gear</span>
              </button>
            </div>
          </fieldset>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-caption text-muted block">Item Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Philips 1000W Iron, Casio fx-991EX, Maggi Pack..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-pill"
            />
          </div>

          {/* Price & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-caption text-muted block">Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="input-pill"
              />
            </div>
            {category === 'rental' ? (
              <div className="space-y-2">
                <label className="text-caption text-muted block">Rate Period</label>
                <select
                  value={rentalUnit}
                  onChange={(e) => setRentalUnit(e.target.value)}
                  className="input-pill appearance-none bg-surface cursor-pointer"
                >
                  <option value="/ hour">/ hour</option>
                  <option value="/ day">/ day</option>
                  <option value="/ exam">/ exam</option>
                  <option value="/ week">/ week</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-caption text-muted block">Condition Note</label>
                <input
                  type="text"
                  placeholder="e.g. Sealed pack, Mint condition..."
                  value={badgeNote}
                  onChange={(e) => setBadgeNote(e.target.value)}
                  className="input-pill"
                />
              </div>
            )}
          </div>

          {/* Deposit for Rental */}
          {category === 'rental' && (
            <div className="space-y-2">
              <label className="text-caption text-muted block">Security Deposit / Note</label>
              <input
                type="text"
                placeholder="Deposit: ₹150 (refundable) or Ready in Wing B"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="input-pill"
              />
            </div>
          )}

          {/* Location / Hostel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-caption text-muted block">Hostel Block</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="input-pill appearance-none bg-surface cursor-pointer"
              >
                <option value="H-12">Hostel 12</option>
                <option value="H-13">Hostel 13</option>
                <option value="H-14">Hostel 14</option>
                <option value="H-15">Hostel 15</option>
                <option value="H-16">Hostel 16</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-caption text-muted block">Wing / Room</label>
              <input
                type="text"
                placeholder="e.g. Wing B, Room 204"
                value={wingOrRoom}
                onChange={(e) => setWingOrRoom(e.target.value)}
                className="input-pill"
              />
            </div>
          </div>

          {/* Image Presets & URL */}
          <fieldset className="space-y-3">
            <legend className="text-caption text-muted flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span>Product Photo</span>
              </span>
              <span className="text-[10px] text-muted">Select preset or paste URL</span>
            </legend>
            <div className="flex gap-2 overflow-x-auto py-1" role="group" aria-label="Image presets">
              {presetImages.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`image-preset ${imageUrl === p.url ? 'image-preset-active' : ''}`}
                  aria-pressed={imageUrl === p.url}
                >
                  <img src={p.url} alt={p.label} className="image-preset-img" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or enter custom image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-pill"
            />
          </fieldset>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-caption text-muted block">Short Description</label>
            <textarea
              rows={3}
              placeholder="Fresh condition, clean descaled, working batteries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface border border-faint rounded-inner text-body text-ink placeholder-muted px-4 py-3 focus:outline-none focus:border-accent resize-none font-gt-standard"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 border-t border-faint">
            <button
              type="submit"
              className="flex-1 btn-pill btn-pill-primary justify-center py-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Listing</span>
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
      </div>
    </div>
  );
};