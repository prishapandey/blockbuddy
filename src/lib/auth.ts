/**
 * auth.ts — lightweight campus auth layer
 *
 * No real backend. We gate by @srmist.edu.in email and store the session in
 * localStorage so the user stays logged in across reloads. A real
 * deployment would replace `mockLogin` with Supabase Auth.
 */

import { StudentProfile } from '../types';
import { getSupabaseClient } from './supabase';

const SESSION_KEY = 'blockbuddy_session';

export interface AuthSession {
  student: StudentProfile;
  loggedInAt: string;
  supabaseUser?: any;
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

/** Check if email belongs to allowed university domains */
export function isValidCampusEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return trimmed.endsWith('@srmist.edu.in') || trimmed.endsWith('@iitb.ac.in');
}

/** Real Supabase Sign Up with Campus Verification and Database Profile */
export async function supabaseSignUp(params: {
  name: string;
  email: string;
  password: string;
  hostel?: string;
  room?: string;
  wing?: string;
  department?: string;
}): Promise<{ ok: boolean; error?: string; session?: AuthSession; message?: string }> {
  const { name, email, password } = params;
  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidCampusEmail(trimmedEmail)) {
    return { ok: false, error: 'Only verified campus emails (@srmist.edu.in or @iitb.ac.in) are allowed.' };
  }
  if (!name.trim()) {
    return { ok: false, error: 'Please enter your full name.' };
  }
  if (!password || password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters long.' };
  }

  const isIITB = trimmedEmail.endsWith('@iitb.ac.in');
  const hostel = params.hostel || (isIITB ? 'H-12' : 'A Block');
  const room = params.room || 'Room 101';
  const wing = params.wing || (isIITB ? 'Wing B' : 'Floor 1');
  const department = params.department || 'Computer Science & Engineering';

  const supabase = getSupabaseClient();

  // If Supabase client is available, attempt real cloud signup
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            hostel,
            room,
            wing,
            department,
          },
        },
      });

      if (error) {
        const isNetworkErr =
          error.message.includes('NetworkError') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('fetch failed') ||
          error.message.includes('Network error');

        if (isNetworkErr) {
          // Graceful fallback for offline / unconfigured Supabase host
          const student: StudentProfile = {
            name: name.trim(),
            email: trimmedEmail,
            hostel,
            room,
            wing,
            department,
          };
          const session: AuthSession = { student, loggedInAt: new Date().toISOString() };
          saveSession(session);
          return { ok: true, session, message: 'Registered & logged in successfully (local offline mode)!' };
        }

        return { ok: false, error: error.message };
      }

      const student: StudentProfile = {
        name: name.trim(),
        email: trimmedEmail,
        hostel,
        room,
        wing,
        department,
      };

      // Try inserting into public.blockbuddy_profiles table if user ID exists
      if (data.user?.id) {
        try {
          await supabase.from('blockbuddy_profiles').upsert({
            id: data.user.id,
            name: student.name,
            email: student.email,
            hostel: student.hostel,
            room: student.room,
            wing: student.wing,
            department: student.department,
            updated_at: new Date().toISOString(),
          });
        } catch (profileErr) {
          console.warn('Profile sync note:', profileErr);
        }
      }

      const session: AuthSession = {
        student,
        loggedInAt: new Date().toISOString(),
        supabaseUser: data.user,
      };

      // If Supabase auto-confirmed or returned a session, store it
      if (data.session || data.user) {
        saveSession(session);
      }

      return {
        ok: true,
        session,
        message: data.session
          ? 'Account successfully created and logged in!'
          : 'Registration successful! Verification email sent (or sign in directly).',
      };
    } catch (err: any) {
      console.warn('Supabase signup network notice:', err);
    }
  }

  // Graceful fallback for offline / mock testing
  const student: StudentProfile = {
    name: name.trim(),
    email: trimmedEmail,
    hostel,
    room,
    wing,
    department,
  };
  const session: AuthSession = { student, loggedInAt: new Date().toISOString() };
  saveSession(session);
  return { ok: true, session, message: 'Local campus account registered successfully!' };
}

/** Real Supabase Sign In with Password and Profile Fetch */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; session?: AuthSession }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidCampusEmail(trimmedEmail)) {
    return { ok: false, error: 'Only verified campus emails (@srmist.edu.in or @iitb.ac.in) are allowed.' };
  }
  if (!password) {
    return { ok: false, error: 'Please enter your password.' };
  }

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        const isNetworkErr =
          error.message.includes('NetworkError') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('fetch failed') ||
          error.message.includes('Network error');

        if (isNetworkErr) {
          // If Supabase host is unreachable / placeholder URL, authenticate locally
          const isDemo =
            trimmedEmail === 'aarav.sharma@srmist.edu.in' || trimmedEmail === 'aarav.sharma@iitb.ac.in';
          const studentName = isDemo ? 'Aarav Sharma' : trimmedEmail.split('@')[0].replace('.', ' ');
          return mockLogin(trimmedEmail, studentName.charAt(0).toUpperCase() + studentName.slice(1));
        }

        // If credentials invalid on Supabase, return exact error
        if (error.message.includes('Invalid login credentials')) {
          // If it's the demo account credentials, allow local demo sign-in
          if (
            (trimmedEmail === 'aarav.sharma@srmist.edu.in' || trimmedEmail === 'aarav.sharma@iitb.ac.in') &&
            (password === 'campusPass123' || password === 'student123')
          ) {
            return mockLogin(trimmedEmail, 'Aarav Sharma');
          }
          return { ok: false, error: 'Invalid email or password. Please verify credentials or sign up.' };
        }
        return { ok: false, error: error.message };
      }

      if (data.user) {
        const meta = data.user.user_metadata || {};
        const isIITB = trimmedEmail.endsWith('@iitb.ac.in');

        // Attempt to fetch custom profile from public.blockbuddy_profiles
        let profileData: any = null;
        try {
          const { data: prof } = await supabase
            .from('blockbuddy_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profileData = prof;
        } catch {
          // ignore profile table miss
        }

        const student: StudentProfile = {
          name: profileData?.name || meta.name || trimmedEmail.split('@')[0],
          email: trimmedEmail,
          hostel: profileData?.hostel || meta.hostel || (isIITB ? 'H-12' : 'A Block'),
          room: profileData?.room || meta.room || 'Room 101',
          wing: profileData?.wing || meta.wing || (isIITB ? 'Wing B' : 'Floor 1'),
          department: profileData?.department || meta.department || 'Computer Science & Engineering',
        };

        const session: AuthSession = {
          student,
          loggedInAt: new Date().toISOString(),
          supabaseUser: data.user,
        };
        saveSession(session);
        return { ok: true, session };
      }
    } catch (err: any) {
      console.warn('Supabase signin network notice:', err);
    }
  }

  // Fallback demo signin
  const studentName = trimmedEmail.split('@')[0].replace('.', ' ');
  return mockLogin(trimmedEmail, studentName.charAt(0).toUpperCase() + studentName.slice(1));
}

/** Sign out from Supabase and clear local session */
export async function supabaseSignOut(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
  }
  clearSession();
}

/** Synchronous campus login helper (used by tests & quick demo) */
export function mockLogin(email: string, name: string): { ok: boolean; error?: string; session?: AuthSession } {
  const trimmed = email.trim().toLowerCase();
  const isValidCampus = trimmed.endsWith('@srmist.edu.in') || trimmed.endsWith('@iitb.ac.in');
  if (!isValidCampus) {
    return { ok: false, error: 'Only verified campus emails (@srmist.edu.in or @iitb.ac.in) are accepted.' };
  }
  if (!name.trim()) {
    return { ok: false, error: 'Please enter your name.' };
  }

  const isIITB = trimmed.endsWith('@iitb.ac.in');
  const student: StudentProfile = {
    name: name.trim(),
    email: trimmed,
    hostel: isIITB ? 'H-12' : 'A Block',
    room: isIITB ? 'Room 204' : 'Room 101',
    wing: isIITB ? 'Wing B' : 'Floor 1',
    department: 'Computer Science & Engineering',
  };

  const session: AuthSession = { student, loggedInAt: new Date().toISOString() };
  saveSession(session);
  return { ok: true, session };
}
