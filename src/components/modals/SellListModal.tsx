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
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd7WibILZIrCx2IfZnH5hgQqCfsJecrZ808-fIDZRRA2X6icvBPX5QfqxPDQwF3nLu1DsX6K8sFSIEjfvB7zYXyxxtslJCCkD5TgDfcgBFx3NieRJiSIX-uHBe5NufHD1vtEc84JK0ziG7Stf_FqgYR1k8TKLbIC3ycUuZP4ahZWTQiFurlwMvhihJ-Rt-Bd2o2RaFCH_h7FnX8weZse3-o9zq0jEHH2Wm7bcQZArdqFreePClfZ13_w',
    },
    {
      label: 'Notebook Register',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZJW7_MFT7N8QbpxpRxSDxodhtpzRXSJnHF8IwlJGGNpAoR9c_ohkDBOoRItNTkR-IiYUc4D6OXroTI1ysKftyGexPCX0ZHh2wO43VkxbJrx-oxCht1CBna_ZXjHV91QzQ38K85L_ELpGrAySgPyy4_rnqB0JKJ-qLeWLNZCR9MngXqcyKzfL-UI1Ta-cc3Pa7h5kSR29hVvRsxXydlmXsFHTuurRzFjEZd-wQtSTphgGpnknfeXSnJg',
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
    <div className="fixed inset-0 z-50 bg-[#0a0a0c]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121316] border border-[#22252b] w-full max-w-lg rounded-xl p-6 space-y-4 shadow-2xl my-6">
        <div className="flex items-center justify-between border-b border-[#22252b] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4d8eff] flex items-center justify-center text-white font-bold text-xs">
              <Plus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">List Campus Item</h3>
              <p className="text-[11px] text-[#94a3b8]">Direct peer-to-peer exchange with zero fees</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category Tabs */}
          <div>
            <label className="text-[#94a3b8] mb-1.5 block font-medium">Listing Type:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('rental');
                  setRentalUnit('/ day');
                }}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  category === 'rental'
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-semibold'
                    : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                <span>Rent Gear</span>
                <span className="block text-[10px] text-[#4d8eff] font-normal">Hourly/Daily</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('urgent');
                  setRentalUnit('');
                }}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  category === 'urgent'
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-semibold'
                    : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                <span>Need It Now</span>
                <span className="block text-[10px] text-amber-400 font-normal">15m Corridor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('marketplace');
                  setRentalUnit('');
                }}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  category === 'marketplace'
                    ? 'bg-[#4d8eff]/15 border-[#4d8eff] text-white font-semibold'
                    : 'bg-[#0a0a0c] border-[#22252b] text-[#94a3b8] hover:text-white'
                }`}
              >
                <span>Marketplace</span>
                <span className="block text-[10px] text-[#94a3b8] font-normal">Thrift &amp; Gear</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[#94a3b8] block font-medium">Item Title:</label>
            <input
              type="text"
              required
              placeholder="e.g. Philips 1000W Iron, Casio fx-991EX, Maggi Pack..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          {/* Price & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Price (₹):</label>
              <input
                type="number"
                required
                min="0"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
              />
            </div>
            {category === 'rental' ? (
              <div className="space-y-1">
                <label className="text-[#94a3b8] block font-medium">Rate Period:</label>
                <select
                  value={rentalUnit}
                  onChange={(e) => setRentalUnit(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
                >
                  <option value="/ hour">/ hour</option>
                  <option value="/ day">/ day</option>
                  <option value="/ exam">/ exam</option>
                  <option value="/ week">/ week</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[#94a3b8] block font-medium">Condition Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Sealed pack, Mint condition..."
                  value={badgeNote}
                  onChange={(e) => setBadgeNote(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
                />
              </div>
            )}
          </div>

          {/* Deposit for Rental */}
          {category === 'rental' && (
            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Security Deposit / Note:</label>
              <input
                type="text"
                placeholder="Deposit: ₹150 (refundable) or Ready in Wing B"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
              />
            </div>
          )}

          {/* Location / Hostel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Hostel Block:</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
              >
                <option value="H-12">Hostel 12</option>
                <option value="H-13">Hostel 13</option>
                <option value="H-14">Hostel 14</option>
                <option value="H-15">Hostel 15</option>
                <option value="H-16">Hostel 16</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#94a3b8] block font-medium">Wing / Room:</label>
              <input
                type="text"
                placeholder="e.g. Wing B, Room 204"
                value={wingOrRoom}
                onChange={(e) => setWingOrRoom(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
              />
            </div>
          </div>

          {/* Image Presets & URL */}
          <div className="space-y-1.5">
            <label className="text-[#94a3b8] block font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#4d8eff]" />
                <span>Product Photo:</span>
              </span>
              <span className="text-[10px] text-[#64748b]">Select preset or paste URL</span>
            </label>
            <div className="flex gap-2 overflow-x-auto py-1">
              {presetImages.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] transition-colors cursor-pointer ${
                    imageUrl === p.url
                      ? 'border-[#4d8eff] bg-[#4d8eff]/10 text-white'
                      : 'border-[#22252b] bg-[#0a0a0c] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-4 h-4 object-cover rounded" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or enter custom image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2 text-xs focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[#94a3b8] block font-medium">Short Description:</label>
            <textarea
              rows={2}
              placeholder="Fresh condition, clean descaled, working batteries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#22252b] rounded-md text-white p-2.5 focus:outline-none focus:border-[#4d8eff]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-[#22252b]">
            <button
              type="submit"
              className="flex-1 bg-[#4d8eff] hover:bg-[#3b7cee] text-white text-xs font-semibold py-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Listing</span>
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
      </div>
    </div>
  );
};
