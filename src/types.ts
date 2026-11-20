export type ItemCategory = 'rental' | 'urgent' | 'marketplace';

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  priceDisplay: string;
  priceValue: number;
  priceUnit: string; // e.g., "/ exam", "/ hour", "/ day", ""
  secondaryPrice?: string; // e.g., "or ₹40 / day"
  deposit?: string; // e.g., "Deposit: ₹200 (refundable)"
  locationTag: string; // e.g., "B Block · ECE", "A Block · Floor 3"
  hostel: string; // e.g., "A Block", "B Block", "C Block", "D Block", "E Block", "F Block"
  wingOrRoom: string;
  sellerName: string;
  imageUrl: string;
  status: 'available' | 'rented' | 'reserved';
  badgeNote?: string; // e.g., "Clean & Descaled", "Silent 3-speed", "Ready in Wing B"
  quickTag?: string; // e.g., "Scientific Calculators", "Electric Kettles", etc.
  createdAt?: string;
}

export interface CorridorPing {
  id: string;
  itemId: string;
  itemTitle: string;
  sellerName: string;
  senderName: string;
  senderHostel: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'replied' | 'completed';
}

export interface RentalBooking {
  id: string;
  itemId: string;
  itemTitle: string;
  renterName: string;
  renterHostel: string;
  renterRoom: string;
  durationType: 'exam' | 'hour' | 'day' | 'week';
  durationCount: number;
  totalAmount: number;
  depositAmount: number;
  pickupTime: string;
  status: 'confirmed' | 'active' | 'returned';
  createdAt: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  hostel: string;
  room: string;
  wing: string;
  department: string;
}
