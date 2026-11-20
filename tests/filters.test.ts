/**
 * Tests for the filter logic used in App.tsx (extracted as pure functions).
 *
 * Run: npm test
 */

import { describe, expect, it } from 'vitest';
import { INITIAL_ITEMS } from '../src/data/initialData';
import type { ListingItem } from '../src/types';

// ---- Pure filter helpers (mirrors App.tsx logic) ------------------

function filterRentals(
  items: ListingItem[],
  {
    activeQuickTag = '',
    searchQuery = '',
    selectedHostelFilter = 'all',
  }: { activeQuickTag?: string; searchQuery?: string; selectedHostelFilter?: string }
): ListingItem[] {
  return items.filter((item) => {
    if (item.category !== 'rental') return false;
    if (activeQuickTag && item.quickTag !== activeQuickTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locationTag.toLowerCase().includes(q) ||
        (item.quickTag && item.quickTag.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedHostelFilter === 'H-12 & 14') {
      return ['H-12', 'H-13', 'H-14', 'H-15'].includes(item.hostel);
    }
    if (selectedHostelFilter !== 'all' && selectedHostelFilter) {
      return item.hostel === selectedHostelFilter;
    }
    return true;
  });
}

function filterUrgent(
  items: ListingItem[],
  {
    activeQuickTag = '',
    searchQuery = '',
    urgentHostelFilter = 'all',
    selectedHostelFilter = 'all',
  }: {
    activeQuickTag?: string;
    searchQuery?: string;
    urgentHostelFilter?: string;
    selectedHostelFilter?: string;
  }
): ListingItem[] {
  return items.filter((item) => {
    if (item.category !== 'urgent') return false;
    if (activeQuickTag && item.quickTag !== activeQuickTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locationTag.toLowerCase().includes(q) ||
        (item.quickTag && item.quickTag.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (urgentHostelFilter !== 'all') return item.hostel === urgentHostelFilter;
    if (selectedHostelFilter === 'H-12 & 14') {
      return ['H-12', 'H-14', 'H-15', 'H-16'].includes(item.hostel);
    }
    if (selectedHostelFilter !== 'all' && selectedHostelFilter) {
      return item.hostel === selectedHostelFilter;
    }
    return true;
  });
}

function filterMarketplace(
  items: ListingItem[],
  {
    activeQuickTag = '',
    searchQuery = '',
    selectedHostelFilter = 'all',
  }: { activeQuickTag?: string; searchQuery?: string; selectedHostelFilter?: string }
): ListingItem[] {
  return items.filter((item) => {
    if (item.category !== 'marketplace') return false;
    if (activeQuickTag && item.quickTag !== activeQuickTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locationTag.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedHostelFilter !== 'all' && selectedHostelFilter !== 'H-12 & 14') {
      return item.hostel === selectedHostelFilter;
    }
    return true;
  });
}

// ---- Tests -------------------------------------------------------

describe('filterRentals', () => {
  it('returns only rental-category items', () => {
    const result = filterRentals(INITIAL_ITEMS, {});
    result.forEach((item) => expect(item.category).toBe('rental'));
  });

  it('all 4 initial rental items appear by default', () => {
    expect(filterRentals(INITIAL_ITEMS, {})).toHaveLength(4);
  });

  it('filters by quickTag', () => {
    const result = filterRentals(INITIAL_ITEMS, { activeQuickTag: 'Scientific Calculators' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('rent-1');
  });

  it('filters by exact hostel', () => {
    const result = filterRentals(INITIAL_ITEMS, { selectedHostelFilter: 'H-13' });
    result.forEach((item) => expect(item.hostel).toBe('H-13'));
  });

  it('search is case-insensitive', () => {
    const a = filterRentals(INITIAL_ITEMS, { searchQuery: 'kettle' });
    const b = filterRentals(INITIAL_ITEMS, { searchQuery: 'KETTLE' });
    expect(a.map((i) => i.id)).toEqual(b.map((i) => i.id));
  });

  it('search query matches title', () => {
    const result = filterRentals(INITIAL_ITEMS, { searchQuery: 'casio' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('rent-1');
  });

  it('unknown search returns empty', () => {
    expect(filterRentals(INITIAL_ITEMS, { searchQuery: 'zyxnonexistent' })).toHaveLength(0);
  });

  it('H-12 & 14 preset includes H-12, H-13, H-14, H-15', () => {
    const result = filterRentals(INITIAL_ITEMS, { selectedHostelFilter: 'H-12 & 14' });
    result.forEach((item) => {
      expect(['H-12', 'H-13', 'H-14', 'H-15']).toContain(item.hostel);
    });
  });
});

describe('filterUrgent', () => {
  it('returns only urgent-category items', () => {
    filterUrgent(INITIAL_ITEMS, {}).forEach((item) => expect(item.category).toBe('urgent'));
  });

  it('all 4 initial urgent items appear by default', () => {
    expect(filterUrgent(INITIAL_ITEMS, {})).toHaveLength(4);
  });

  it('urgentHostelFilter overrides global hostel filter', () => {
    // urgentHostelFilter = H-12, selectedHostelFilter = H-14
    const result = filterUrgent(INITIAL_ITEMS, {
      urgentHostelFilter: 'H-12',
      selectedHostelFilter: 'H-14',
    });
    result.forEach((item) => expect(item.hostel).toBe('H-12'));
  });

  it('filters by quickTag', () => {
    const result = filterUrgent(INITIAL_ITEMS, { activeQuickTag: 'Midnight Snacks' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('urgent-1');
  });
});

describe('filterMarketplace', () => {
  it('returns only marketplace-category items', () => {
    filterMarketplace(INITIAL_ITEMS, {}).forEach((item) =>
      expect(item.category).toBe('marketplace')
    );
  });

  it('all 4 initial marketplace items appear by default', () => {
    expect(filterMarketplace(INITIAL_ITEMS, {})).toHaveLength(4);
  });

  it('filters by hostel (not "all" or "H-12 & 14")', () => {
    const result = filterMarketplace(INITIAL_ITEMS, { selectedHostelFilter: 'H-13' });
    result.forEach((item) => expect(item.hostel).toBe('H-13'));
  });

  it('"H-12 & 14" preset returns all marketplace items', () => {
    // H-12 & 14 preset is ignored for marketplace (shows all)
    expect(filterMarketplace(INITIAL_ITEMS, { selectedHostelFilter: 'H-12 & 14' })).toHaveLength(4);
  });

  it('search matches title and description', () => {
    const title = filterMarketplace(INITIAL_ITEMS, { searchQuery: 'cycle' });
    expect(title.length).toBeGreaterThan(0);
    title.forEach((item) => {
      const combined = (item.title + item.description + item.locationTag).toLowerCase();
      expect(combined).toMatch(/cycle/);
    });
  });
});
