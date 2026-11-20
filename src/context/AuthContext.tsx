import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { clearSession, getSession, saveSession } from '../lib/auth';
import { StudentProfile } from '../types';

interface AuthContextValue {
  student: StudentProfile | null;
  isLoggedIn: boolean;
  login: (student: StudentProfile) => void;
  logout: () => void;
  updateProfile: (updated: StudentProfile) => void;
}

const AuthContext = createContext<AuthContextValue>({
  student: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => getSession()?.student ?? null);

  const login = useCallback((s: StudentProfile) => {
    setStudent(s);
    saveSession({ student: s, loggedInAt: new Date().toISOString() });
  }, []);

  const logout = useCallback(() => {
    setStudent(null);
    clearSession();
  }, []);

  const updateProfile = useCallback((updated: StudentProfile) => {
    setStudent(updated);
    const session = getSession();
    if (session) saveSession({ ...session, student: updated });
  }, []);

  return (
    <AuthContext.Provider value={{ student, isLoggedIn: Boolean(student), login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
