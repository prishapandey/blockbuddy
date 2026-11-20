/**
 * auth.ts — lightweight campus auth layer
 *
 * No real backend. We gate by @srmist.edu.in email and store the session in
 * localStorage so the user stays logged in across reloads. A real
 * deployment would replace `mockLogin` with Supabase Auth.
 */

import { StudentProfile } from '../types';

const SESSION_KEY = 'blockbuddy_session';

export interface AuthSession {
  student: StudentProfile;
  loggedInAt: string;
}

export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/** Validates an SRM email and "logs in" with a default profile. */
export function mockLogin(email: string, name: string): { ok: boolean; error?: string; session?: AuthSession } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.endsWith('@srmist.edu.in')) {
    return { ok: false, error: 'Only @srmist.edu.in email addresses are accepted.' };
  }
  if (!name.trim()) {
    return { ok: false, error: 'Please enter your name.' };
  }

  const student: StudentProfile = {
    name: name.trim(),
    email: trimmed,
    hostel: 'A Block',
    room: 'Room 101',
    wing: 'Floor 1',
    department: 'Computer Science & Engineering',
  };

  const session: AuthSession = { student, loggedInAt: new Date().toISOString() };
  saveSession(session);
  return { ok: true, session };
}
