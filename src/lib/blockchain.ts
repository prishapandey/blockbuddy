/**
 * blockchain.ts
 *
 * Simulates on-chain transaction tracking, smart contract events, and
 * wallet analytics for BlockBuddy. All data is generated deterministically
 * so the UI is always consistent across reloads, while still looking live.
 *
 * In a real deployment these would be replaced by calls to ethers.js /
 * viem against a Polygon or Base RPC endpoint.
 */

export type TxStatus = 'confirmed' | 'pending' | 'failed';
export type TxType = 'rental_payment' | 'marketplace_sale' | 'deposit_lock' | 'deposit_refund' | 'ping_escrow';

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: string; // ISO
  from: string;      // wallet address (truncated)
  to: string;
  type: TxType;
  amountInr: number;
  gasFeeInr: number;
  status: TxStatus;
  itemTitle: string;
  confirmations: number;
}

export interface SmartContractEvent {
  id: string;
  contractName: 'RentalEscrow' | 'MarketplaceTrade' | 'DepositVault';
  eventName: string;
  timestamp: string;
  blockNumber: number;
  details: string;
  severity: 'info' | 'warning' | 'success';
}

export interface WalletStats {
  address: string;
  totalSent: number;    // INR equivalent
  totalReceived: number;
  activeLocks: number;  // deposits locked in contract
  txCount: number;
  trustScore: number;   // 0-100
  activeSince: string;  // ISO date
}

export interface ChainActivity {
  minute: string;  // "HH:MM"
  txCount: number;
  volumeInr: number;
}

// ----- Deterministic pseudo-random helper --------------------------

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function fakeAddress(seed: string): string {
  const h = hashCode(seed).toString(16).padStart(8, '0');
  return `0x${h}...${h.slice(0, 4)}`;
}

function fakeHash(seed: string): string {
  const h = hashCode(seed + 'tx').toString(16).padStart(8, '0');
  return `0x${h}${h}...`;
}

// ----- Public generators -------------------------------------------

const TX_TYPES: TxType[] = ['rental_payment', 'marketplace_sale', 'deposit_lock', 'deposit_refund', 'ping_escrow'];
const TX_STATUSES: TxStatus[] = ['confirmed', 'confirmed', 'confirmed', 'pending', 'failed'];
const ITEMS = [
  'Casio fx-991CW', 'Prestige Kettle', 'Hero Sprint Cycle', 'Portronics Mouse',
  'Engg Math III', 'Mini Drafter', 'Philips Iron', 'Mini Table Fan',
];
const CONTRACT_EVENTS: Array<[SmartContractEvent['contractName'], string, string, SmartContractEvent['severity']]> = [
  ['RentalEscrow', 'DepositLocked', 'Student locked ₹200 deposit for Casio fx-991CW rental', 'info'],
  ['RentalEscrow', 'RentalStarted', 'Rental period began; escrow holding ₹200', 'success'],
  ['DepositVault', 'DepositReleased', 'Deposit of ₹150 returned after item inspection', 'success'],
  ['MarketplaceTrade', 'TradeInitiated', 'Buyer locked funds for Hero Sprint Cycle (₹2,200)', 'info'],
  ['MarketplaceTrade', 'TradeCompleted', 'Seller confirmed handoff; funds released', 'success'],
  ['RentalEscrow', 'DisputeRaised', 'Dispute opened on Kettle rental — awaiting admin', 'warning'],
  ['DepositVault', 'DepositDeducted', '₹50 penalty deducted for late return', 'warning'],
  ['MarketplaceTrade', 'TradeCancelled', 'Buyer cancelled before handoff; full refund issued', 'info'],
];

export function generateTransactions(count = 20): BlockchainTransaction[] {
  const rng = seededRng(hashCode('blockbuddy-txs'));
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const r = rng;
    const typeIdx = Math.floor(r() * TX_TYPES.length);
    const statusIdx = Math.floor(r() * TX_STATUSES.length);
    const itemIdx = Math.floor(r() * ITEMS.length);
    const amount = Math.round(r() * 2500 + 20);
    const gas = Math.round(r() * 2 + 0.5);
    const msAgo = Math.round(r() * 3600_000 * 24); // within last 24 h
    const tsMs = now - msAgo;
    const ts = new Date(tsMs).toISOString();
    return {
      hash: fakeHash(`tx-${i}`),
      blockNumber: 18_500_000 + Math.floor(rng() * 1000) + i,
      timestamp: ts,
      from: fakeAddress(`from-${i}`),
      to: fakeAddress(`to-${i}`),
      type: TX_TYPES[typeIdx],
      amountInr: amount,
      gasFeeInr: gas,
      status: TX_STATUSES[statusIdx],
      itemTitle: ITEMS[itemIdx],
      confirmations: TX_STATUSES[statusIdx] === 'confirmed' ? Math.floor(rng() * 50 + 6) : TX_STATUSES[statusIdx] === 'pending' ? 0 : 1,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateContractEvents(count = 8): SmartContractEvent[] {
  const rng = seededRng(hashCode('blockbuddy-events'));
  const now = Date.now();
  return CONTRACT_EVENTS.slice(0, count).map((ev, i) => {
    const msAgo = Math.round(rng() * 3_600_000 * 6);
    return {
      id: `evt-${i}`,
      contractName: ev[0],
      eventName: ev[1],
      timestamp: new Date(now - msAgo).toISOString(),
      blockNumber: 18_501_000 + i * 7,
      details: ev[2],
      severity: ev[3],
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateWalletStats(address?: string): WalletStats {
  const rng = seededRng(hashCode(address || 'default-wallet'));
  return {
    address: address || fakeAddress('current-user'),
    totalSent: Math.round(rng() * 8000 + 500),
    totalReceived: Math.round(rng() * 6000 + 300),
    activeLocks: Math.floor(rng() * 3),
    txCount: Math.floor(rng() * 40 + 5),
    trustScore: Math.floor(rng() * 30 + 70),
    activeSince: '2024-07-15',
  };
}

export function generateActivityFeed(minutes = 24): ChainActivity[] {
  const rng = seededRng(hashCode('blockbuddy-activity'));
  const now = new Date();
  return Array.from({ length: minutes }, (_, i) => {
    const d = new Date(now.getTime() - (minutes - 1 - i) * 60_000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return {
      minute: `${hh}:${mm}`,
      txCount: Math.floor(rng() * 8),
      volumeInr: Math.round(rng() * 500),
    };
  });
}

// Label helpers
export const TX_TYPE_LABELS: Record<TxType, string> = {
  rental_payment: 'Rental Payment',
  marketplace_sale: 'Marketplace Sale',
  deposit_lock: 'Deposit Lock',
  deposit_refund: 'Deposit Refund',
  ping_escrow: 'Ping Escrow',
};

export const TX_STATUS_COLORS: Record<TxStatus, string> = {
  confirmed: '#3ecf8e',
  pending: '#f59e0b',
  failed: '#ef4444',
};
