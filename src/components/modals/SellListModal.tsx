import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  HelpCircle,
  Image as ImageIcon,
  Info,
  MapPin,
  Plus,
  Shield,
  ShoppingBag,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import { ItemCategory, ListingItem, StudentProfile } from '../../types';

interface SellListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newItem: ListingItem) => void;
  currentStudent: StudentProfile;
}

interface PresetOption {
  label: string;
  category: ItemCategory;
  title: string;
  price: string;
  unit: string;
  deposit?: string;
  badge: string;
  url: string;
}

const PRESETS: PresetOption[] = [
  {
    label: 'Casio 991CW / EX',
    category: 'rental',
    title: 'Casio fx-991CW Scientific Calculator',
    price: '25',
    unit: '/ exam',
    deposit: 'Deposit: ₹150 (refundable)',
    badge: 'Exam Approved · Fresh Battery',
    url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Electric Kettle',
    category: 'rental',
    title: 'Pigeon 1.5L Electric Kettle',
    price: '40',
    unit: '/ day',
    deposit: 'Deposit: ₹200 (refundable)',
    badge: 'Clean & Descaled',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Midnight Snack Pack',
    category: 'urgent',
    title: 'Maggi Noodles 4-Pack + Chips',
    price: '60',
    unit: '',
    badge: 'Unopened · Ready in Floor 2',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: '65W Fast Charger',
    category: 'urgent',
    title: 'Type-C 65W GaN Laptop Charger',
    price: '50',
    unit: '/ day',
    badge: 'Multi-port · Pickup now',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Engineering Textbook',
    category: 'marketplace',
    title: 'Engineering Mechanics (Beer & Johnston)',
    price: '350',
    unit: '',
    badge: 'No Marks · Like New',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Mini Room Fan',
    category: 'marketplace',
    title: 'Rechargeable 3-Speed Desk Fan',
    price: '450',
    unit: '',
    badge: 'Silent · 8h Battery',
    url: 'https://images.unsplash.com/photo-1618944847823-1d07c030d922?auto=format&fit=crop&w=600&q=80',
  },
];

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
  const [priceValue, setPriceValue] = useState('');
  const [rentalUnit, setRentalUnit] = useState('/ day');
  const [deposit, setDeposit] = useState('');
  const [badgeNote, setBadgeNote] = useState('');
  const [hostel, setHostel] = useState(currentStudent.hostel || 'A Block');
  const [wingOrRoom, setWingOrRoom] = useState(
    currentStudent.wing && currentStudent.room
      ? `${currentStudent.wing}, ${currentStudent.room}`
      : 'Floor 2, Room 204'
  );
  const [imageUrl, setImageUrl] = useState(PRESETS[0].url);
  const [submitting, setSubmitting] = useState(false);

  const applyPreset = (preset: PresetOption) => {
    setCategory(preset.category);
    setTitle(preset.title);
    setPriceValue(preset.price);
    setRentalUnit(preset.unit || '/ day');
    setDeposit(preset.deposit || '');
    setBadgeNote(preset.badge);
    setImageUrl(preset.url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const numPrice = Number(priceValue) || 0;
    const priceDisplay = `₹${numPrice}`;
    const id = `listing-${Date.now()}`;
    const locationTag = `${hostel} • ${wingOrRoom || 'Corridor'}`;

    let quickTag = '';
    if (category === 'rental') {
      quickTag = title.toLowerCase().includes('calc')
        ? 'Scientific Calculators'
        : title.toLowerCase().includes('kettle')
        ? 'Electric Kettles'
        : 'Electronics';
    } else if (category === 'urgent') {
      quickTag = 'Midnight Snacks';
    } else {
      quickTag = 'Textbooks';
    }

    const newItem: ListingItem = {
      id,
      title: title.trim() || 'Untitled Item',
      description: description.trim() || 'Available for immediate corridor handoff.',
      category,
      priceDisplay,
      priceValue: numPrice,
      priceUnit: category === 'rental' ? rentalUnit : '',
      deposit: category === 'rental' && deposit.trim() ? deposit.trim() : undefined,
      badgeNote: badgeNote.trim() || undefined,
      locationTag,
      hostel,
      wingOrRoom,
      sellerName: currentStudent.name || 'Campus Peer',
      imageUrl,
      status: 'available',
      quickTag,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSubmit(newItem);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#242519]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto text-[#CDCBD6]">
      <div className="bg-[#26271a] border border-[#434630] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#434630] bg-[#202115] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#D96846] flex items-center justify-center text-white font-bold text-sm shadow">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create Campus Listing</h3>
              <p className="text-xs text-[#9fa293]">
                Share, rent, or sell items within your residential hostel with zero fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9fa293] hover:text-white hover:bg-[#2b2d1e] rounded-xl transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Form Inputs (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-5 border-r border-[#434630]/60">
            {/* Quick Inspiration Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CDCBD6] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D96846]" />
                <span>Quick-Fill Templates:</span>
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-[#202115] hover:bg-[#353826] text-[#CDCBD6] hover:text-white border border-[#434630] transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Type / Zone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CDCBD6]">Select Listing Zone:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'rental',
                    label: 'Rent Gear',
                    sub: 'Hourly / Daily',
                    icon: Calendar,
                    desc: 'Calculators, kettles, irons',
                  },
                  {
                    id: 'urgent',
                    label: 'Need It Now',
                    sub: '15m Corridor',
                    icon: Zap,
                    desc: 'Emergency snacks, cords',
                  },
                  {
                    id: 'marketplace',
                    label: 'Marketplace',
                    sub: 'Buy & Sell',
                    icon: ShoppingBag,
                    desc: 'Textbooks, cycle, dorm gear',
                  },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id as ItemCategory);
                        if (cat.id === 'rental' && !rentalUnit) setRentalUnit('/ day');
                        if (cat.id !== 'rental') setRentalUnit('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#D96846] border-[#D96846] text-white shadow-lg scale-[1.02]'
                          : 'bg-[#202115] border-[#434630] text-[#CDCBD6] hover:border-[#D96846]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#D96846]'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-black/20 text-white' : 'bg-[#26271a] text-[#9fa293]'
                        }`}>
                          {cat.sub}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <p className="font-bold text-xs">{cat.label}</p>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-[#9fa293]'}`}>
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#CDCBD6]">Item Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Casio fx-991EX Calculator, Electric Kettle, Maggi 4-Pack..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-sm text-white placeholder-[#9fa293]/60 px-3.5 py-2.5 focus:outline-none focus:border-[#D96846] transition-colors"
              />
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#CDCBD6]">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D96846]">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="25"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-sm font-semibold text-white pl-8 pr-3.5 py-2.5 focus:outline-none focus:border-[#D96846]"
                  />
                </div>
              </div>

              {category === 'rental' ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#CDCBD6]">Rental Billing Period</label>
                  <select
                    value={rentalUnit}
                    onChange={(e) => setRentalUnit(e.target.value)}
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white px-3 py-2.5 focus:outline-none focus:border-[#D96846]"
                  >
                    <option value="/ exam">/ exam (Mid-sem / End-sem)</option>
                    <option value="/ hour">/ hour</option>
                    <option value="/ day">/ day (24 hours)</option>
                    <option value="/ week">/ week (Semester projects)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#CDCBD6]">Item Condition Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Like New, Unopened, 8/10"
                    value={badgeNote}
                    onChange={(e) => setBadgeNote(e.target.value)}
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white px-3.5 py-2.5 focus:outline-none focus:border-[#D96846]"
                  />
                </div>
              )}
            </div>

            {/* Security Deposit (Rental Only) */}
            {category === 'rental' && (
              <div className="p-3 bg-[#1e1f14] border border-[#434630] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#CDCBD6] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#596235]" />
                    <span>Security Deposit (Refundable Escrow):</span>
                  </label>
                  <span className="text-[10px] text-[#596235] font-semibold">Protected on-chain</span>
                </div>
                <div className="flex gap-2">
                  {[
                    'Deposit: ₹100 (refundable)',
                    'Deposit: ₹150 (refundable)',
                    'Deposit: ₹200 (refundable)',
                    'No Deposit Required',
                  ].map((depOption) => (
                    <button
                      key={depOption}
                      type="button"
                      onClick={() => setDeposit(depOption === 'No Deposit Required' ? '' : depOption)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        deposit === depOption || (depOption === 'No Deposit Required' && !deposit)
                          ? 'bg-[#596235] border-[#596235] text-white font-semibold'
                          : 'bg-[#26271a] border-[#434630] text-[#CDCBD6] hover:text-white'
                      }`}
                    >
                      {depOption.replace('Deposit: ', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hostel Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#CDCBD6]">Hostel Block</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-[#D96846]"
                >
                  {['A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block'].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#CDCBD6]">Floor / Wing / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Floor 2, Room 204"
                  value={wingOrRoom}
                  onChange={(e) => setWingOrRoom(e.target.value)}
                  className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white p-2.5 focus:outline-none focus:border-[#D96846]"
                />
              </div>
            </div>

            {/* Photo Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CDCBD6] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#D96846]" />
                  <span>Product Image:</span>
                </span>
                <span className="text-[10px] text-[#9fa293]">Choose a photo or paste a custom URL</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      imageUrl === p.url
                        ? 'border-[#D96846] ring-2 ring-[#D96846]/40 scale-105'
                        : 'border-[#434630] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    {imageUrl === p.url && (
                      <div className="absolute inset-0 bg-[#D96846]/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Or paste external image URL (Unsplash, Imgur, Supabase Storage...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white placeholder-[#9fa293]/60 px-3 py-2 focus:outline-none focus:border-[#D96846]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#CDCBD6]">Short Description</label>
              <textarea
                rows={2}
                placeholder="Mention item condition, battery status, pickup instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1e1f14] border border-[#434630] rounded-xl text-xs text-white placeholder-[#9fa293]/60 px-3 py-2 focus:outline-none focus:border-[#D96846]"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex gap-2.5 pt-3 border-t border-[#434630]">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#D96846] hover:bg-[#c45735] disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing to Campus...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Listing to {hostel}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#202115] hover:bg-[#2b2d1e] text-[#CDCBD6] text-xs font-medium px-5 py-3 rounded-xl border border-[#434630] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Right Column: Live Card Preview Studio (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#202115] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#D96846]" />
                  <span>Live Student Feed Preview</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#596235]/40 text-[#CDCBD6] border border-[#596235]">
                  Instant Preview
                </span>
              </div>
              <p className="text-[11px] text-[#9fa293] mb-4">
                This is exactly how your listing will appear to corridor wingmates.
              </p>

              {/* Live Preview Card */}
              <div className="bg-[#26271a] border border-[#434630] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group hover:border-[#D96846]">
                <div className="aspect-[16/10] bg-[#1e1f14] relative overflow-hidden">
                  <img
                    src={imageUrl || PRESETS[0].url}
                    alt={title || 'Preview item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESETS[0].url;
                    }}
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#242519]/90 backdrop-blur text-[10px] font-semibold text-white px-2 py-0.5 rounded-md border border-[#434630]">
                    {hostel} • {wingOrRoom || 'Corridor'}
                  </span>
                  {category === 'urgent' && (
                    <span className="absolute top-2.5 right-2.5 bg-[#596235] text-[9px] text-white font-bold px-2 py-0.5 rounded shadow">
                      LIVE
                    </span>
                  )}
                  {badgeNote && (
                    <span className="absolute top-2.5 right-2.5 bg-[#D96846] text-[9px] text-white font-semibold px-2 py-0.5 rounded shadow truncate max-w-[140px]">
                      {badgeNote}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {title || 'Your Item Title Goes Here'}
                    </h4>
                  </div>

                  <p className="text-xs text-[#CDCBD6]/80 line-clamp-2">
                    {description || 'Item description, specs, and corridor handoff instructions will be displayed here.'}
                  </p>

                  <div className="pt-2 border-t border-[#434630] flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-extrabold text-[#D96846]">
                        ₹{priceValue || '0'}
                      </span>
                      {category === 'rental' && (
                        <span className="text-xs text-[#9fa293]"> {rentalUnit}</span>
                      )}
                    </div>
                    {category === 'rental' && deposit && (
                      <span className="text-[10px] text-[#9fa293] bg-[#202115] px-2 py-0.5 rounded border border-[#434630]">
                        {deposit}
                      </span>
                    )}
                  </div>

                  {/* Simulated Action Button */}
                  <div className="pt-1">
                    <div className="w-full py-2 rounded-lg bg-[#2b2d1e] text-center text-xs font-semibold text-[#CDCBD6] border border-[#434630]/80">
                      {category === 'rental' ? 'Rent Now (Preview)' : category === 'urgent' ? 'Ping for Pickup' : 'Chat with Seller'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Protocol Tip */}
            <div className="p-3.5 bg-[#1e1f14] border border-[#434630] rounded-xl text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-[#596235] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#596235]" />
                <span>Zero Platform Fees Guarantee</span>
              </div>
              <p className="text-[#9fa293] leading-relaxed">
                You retain 100% of the rent or purchase price. Buyers and renters transfer funds directly to your UPI ID upon inspecting the item in person.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
