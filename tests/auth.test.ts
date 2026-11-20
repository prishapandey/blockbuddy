/**
 * Tests for src/lib/auth.ts
 *
 * Covers session management, authentication gating, and student profile validation.
 * Run: npm test
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { clearSession, getSession, mockLogin, saveSession } from '../src/lib/auth';

// In-memory mock for localStorage in Node test environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

describe('auth.ts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('mockLogin', () => {
    it('accepts valid @srmist.edu.in email addresses', () => {
      const res = mockLogin('priya.patel@srmist.edu.in', 'Priya Patel');
      expect(res.ok).toBe(true);
      expect(res.session).toBeDefined();
      expect(res.session?.student.name).toBe('Priya Patel');
      expect(res.session?.student.email).toBe('priya.patel@srmist.edu.in');
    });

    it('rejects external non-campus emails (e.g. gmail.com)', () => {
      const res = mockLogin('attacker@gmail.com', 'Malicious User');
      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/srmist\.edu\.in/);
      expect(res.session).toBeUndefined();
    });

    it('rejects empty or whitespace-only names', () => {
      const res = mockLogin('student@srmist.edu.in', '   ');
      expect(res.ok).toBe(false);
      expect(res.error).toMatch(/name/i);
    });

    it('normalizes email to lowercase and trims whitespace', () => {
      const res = mockLogin('  Test.User@SRMIST.EDU.IN  ', 'Test User');
      expect(res.ok).toBe(true);
      expect(res.session?.student.email).toBe('test.user@srmist.edu.in');
    });

    it('assigns default campus hostel and department', () => {
      const res = mockLogin('aarav@srmist.edu.in', 'Aarav');
      expect(res.ok).toBe(true);
      expect(res.session?.student.hostel).toBeDefined();
      expect(res.session?.student.department).toBeDefined();
    });
  });

  describe('session persistence', () => {
    it('saves and retrieves an active session from storage', () => {
      const sampleSession = {
        student: {
          name: 'Kabir Verma',
          email: 'kabir@srmist.edu.in',
          hostel: 'C Block',
          room: 'Room 302',
          wing: 'Floor 3',
          department: 'Mechanical Engineering',
        },
        loggedInAt: new Date().toISOString(),
      };

      saveSession(sampleSession);
      const retrieved = getSession();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.student.name).toBe('Kabir Verma');
      expect(retrieved?.student.hostel).toBe('C Block');
    });

    it('clears session successfully on logout', () => {
      mockLogin('rohit@srmist.edu.in', 'Rohit');
      expect(getSession()).not.toBeNull();
      clearSession();
      expect(getSession()).toBeNull();
    });

    it('returns null when storage is corrupted or empty', () => {
      localStorage.setItem('blockbuddy_session', '{ malformed json: true');
      expect(getSession()).toBeNull();
    });
  });
});
