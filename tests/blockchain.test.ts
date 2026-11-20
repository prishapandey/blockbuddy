/**
 * Tests for src/lib/blockchain.ts
 *
 * Run: npm test
 */

import { describe, expect, it } from 'vitest';
import {
  TX_TYPE_LABELS,
  TX_STATUS_COLORS,
  generateActivityFeed,
  generateContractEvents,
  generateTransactions,
  generateWalletStats,
} from '../src/lib/blockchain';

// ---- generateTransactions ----------------------------------------

describe('generateTransactions', () => {
  it('returns the requested number of records', () => {
    expect(generateTransactions(10)).toHaveLength(10);
    expect(generateTransactions(5)).toHaveLength(5);
  });

  it('defaults to 20 records', () => {
    expect(generateTransactions()).toHaveLength(20);
  });

  it('returns records sorted newest-first', () => {
    const txs = generateTransactions(15);
    for (let i = 1; i < txs.length; i++) {
      const prev = new Date(txs[i - 1].timestamp).getTime();
      const curr = new Date(txs[i].timestamp).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('every record has a valid status', () => {
    const valid = new Set(['confirmed', 'pending', 'failed']);
    generateTransactions(20).forEach((tx) => {
      expect(valid.has(tx.status)).toBe(true);
    });
  });

  it('every record has a positive amountInr', () => {
    generateTransactions(20).forEach((tx) => {
      expect(tx.amountInr).toBeGreaterThan(0);
    });
  });

  it('every record has a non-empty hash', () => {
    generateTransactions(20).forEach((tx) => {
      expect(tx.hash.length).toBeGreaterThan(0);
    });
  });

  it('is deterministic — two calls with same count match', () => {
    const a = generateTransactions(10);
    const b = generateTransactions(10);
    expect(a.map((t) => t.hash)).toEqual(b.map((t) => t.hash));
  });

  it('pending txs have 0 confirmations', () => {
    const txs = generateTransactions(20);
    txs.filter((t) => t.status === 'pending').forEach((t) => {
      expect(t.confirmations).toBe(0);
    });
  });

  it('confirmed txs have ≥6 confirmations', () => {
    const txs = generateTransactions(20);
    txs.filter((t) => t.status === 'confirmed').forEach((t) => {
      expect(t.confirmations).toBeGreaterThanOrEqual(6);
    });
  });
});

// ---- generateContractEvents --------------------------------------

describe('generateContractEvents', () => {
  it('returns at most 8 records by default', () => {
    expect(generateContractEvents()).toHaveLength(8);
  });

  it('respects the count argument', () => {
    expect(generateContractEvents(3)).toHaveLength(3);
  });

  it('every event has a known contractName', () => {
    const valid = new Set(['RentalEscrow', 'MarketplaceTrade', 'DepositVault']);
    generateContractEvents(8).forEach((ev) => {
      expect(valid.has(ev.contractName)).toBe(true);
    });
  });

  it('every event has a known severity', () => {
    const valid = new Set(['info', 'warning', 'success']);
    generateContractEvents(8).forEach((ev) => {
      expect(valid.has(ev.severity)).toBe(true);
    });
  });

  it('is sorted newest-first', () => {
    const evs = generateContractEvents(8);
    for (let i = 1; i < evs.length; i++) {
      expect(new Date(evs[i - 1].timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(evs[i].timestamp).getTime()
      );
    }
  });
});

// ---- generateWalletStats -----------------------------------------

describe('generateWalletStats', () => {
  it('returns a trust score between 0 and 100', () => {
    const w = generateWalletStats();
    expect(w.trustScore).toBeGreaterThanOrEqual(0);
    expect(w.trustScore).toBeLessThanOrEqual(100);
  });

  it('totalSent and totalReceived are positive', () => {
    const w = generateWalletStats();
    expect(w.totalSent).toBeGreaterThan(0);
    expect(w.totalReceived).toBeGreaterThan(0);
  });

  it('txCount is a non-negative integer', () => {
    const w = generateWalletStats();
    expect(w.txCount).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(w.txCount)).toBe(true);
  });

  it('address is a non-empty string', () => {
    const w = generateWalletStats();
    expect(w.address.length).toBeGreaterThan(0);
  });

  it('two calls with the same address return the same stats', () => {
    const a = generateWalletStats('0xABCD');
    const b = generateWalletStats('0xABCD');
    expect(a.trustScore).toBe(b.trustScore);
    expect(a.totalSent).toBe(b.totalSent);
  });

  it('different addresses return different stats', () => {
    const a = generateWalletStats('0xAAAA');
    const b = generateWalletStats('0xBBBB');
    // At least one field should differ
    const same =
      a.trustScore === b.trustScore &&
      a.totalSent === b.totalSent &&
      a.totalReceived === b.totalReceived;
    expect(same).toBe(false);
  });
});

// ---- generateActivityFeed ----------------------------------------

describe('generateActivityFeed', () => {
  it('returns the requested number of data points', () => {
    expect(generateActivityFeed(12)).toHaveLength(12);
    expect(generateActivityFeed(24)).toHaveLength(24);
  });

  it('defaults to 24 data points', () => {
    expect(generateActivityFeed()).toHaveLength(24);
  });

  it('every entry has a minute string in HH:MM format', () => {
    const feed = generateActivityFeed(10);
    feed.forEach((entry) => {
      expect(entry.minute).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  it('txCount and volumeInr are non-negative', () => {
    generateActivityFeed(24).forEach((entry) => {
      expect(entry.txCount).toBeGreaterThanOrEqual(0);
      expect(entry.volumeInr).toBeGreaterThanOrEqual(0);
    });
  });
});

// ---- Label / color maps ------------------------------------------

describe('TX_TYPE_LABELS', () => {
  it('has a label for every type', () => {
    const types = ['rental_payment', 'marketplace_sale', 'deposit_lock', 'deposit_refund', 'ping_escrow'];
    types.forEach((t) => {
      expect(TX_TYPE_LABELS[t as keyof typeof TX_TYPE_LABELS]).toBeTruthy();
    });
  });
});

describe('TX_STATUS_COLORS', () => {
  it('has a hex color for every status', () => {
    (['confirmed', 'pending', 'failed'] as const).forEach((s) => {
      expect(TX_STATUS_COLORS[s]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
