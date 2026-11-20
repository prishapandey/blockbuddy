/**
 * Tests for src/data/initialData.ts
 *
 * Run: npm test
 */

import { describe, expect, it } from 'vitest';
import { INITIAL_ITEMS, INITIAL_STUDENT } from '../src/data/initialData';

describe('INITIAL_STUDENT', () => {
  it('has a non-empty name', () => {
    expect(INITIAL_STUDENT.name.trim().length).toBeGreaterThan(0);
  });

  it('email ends with @iitb.ac.in', () => {
    expect(INITIAL_STUDENT.email).toMatch(/@iitb\.ac\.in$/);
  });

  it('hostel is a known hostel code', () => {
    expect(['H-12', 'H-13', 'H-14', 'H-15', 'H-16']).toContain(INITIAL_STUDENT.hostel);
  });
});

describe('INITIAL_ITEMS', () => {
  it('has exactly 40 items (12 rental + 12 urgent + 16 marketplace)', () => {
    expect(INITIAL_ITEMS).toHaveLength(40);
  });

  it('has 12 rental items', () => {
    expect(INITIAL_ITEMS.filter((i) => i.category === 'rental')).toHaveLength(12);
  });

  it('has 12 urgent items', () => {
    expect(INITIAL_ITEMS.filter((i) => i.category === 'urgent')).toHaveLength(12);
  });

  it('has 16 marketplace items', () => {
    expect(INITIAL_ITEMS.filter((i) => i.category === 'marketplace')).toHaveLength(16);
  });

  it('every item has a unique id', () => {
    const ids = INITIAL_ITEMS.map((i) => i.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every item has a non-empty title', () => {
    INITIAL_ITEMS.forEach((item) => {
      expect(item.title.trim().length).toBeGreaterThan(0);
    });
  });

  it('every item has a valid status', () => {
    const valid = new Set(['available', 'rented', 'reserved']);
    INITIAL_ITEMS.forEach((item) => {
      expect(valid.has(item.status)).toBe(true);
    });
  });

  it('every item has a non-negative priceValue', () => {
    INITIAL_ITEMS.forEach((item) => {
      expect(item.priceValue).toBeGreaterThanOrEqual(0);
    });
  });

  it('every item has a known hostel code', () => {
    const valid = new Set(['H-12', 'H-13', 'H-14', 'H-15', 'H-16']);
    INITIAL_ITEMS.forEach((item) => {
      expect(valid.has(item.hostel)).toBe(true);
    });
  });

  it('rental items have a priceUnit set', () => {
    INITIAL_ITEMS.filter((i) => i.category === 'rental').forEach((item) => {
      expect(item.priceUnit.trim().length).toBeGreaterThan(0);
    });
  });

  it('every item has a non-empty imageUrl', () => {
    INITIAL_ITEMS.forEach((item) => {
      expect(item.imageUrl.trim().length).toBeGreaterThan(0);
    });
  });
});
