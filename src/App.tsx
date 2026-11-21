import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { RentalsPage } from './pages/RentalsPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { NeedItNowPage } from './pages/NeedItNowPage';
import { BlockchainPage } from './pages/BlockchainPage';
import { SettingsPage } from './pages/SettingsPage';
import { AppNavbar } from './components/AppNavbar';
import { Footer } from './components/Footer';

// ---- Protected layout -----------------------------------------------

const AppLayout: React.FC = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-[#D96846] selection:text-white bg-[#2F3020] text-[#CDCBD6]">
      <AppNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer onOpenSafetyModal={() => {}} onOpenSupabaseModal={() => {}} />
    </div>
  );
};

// ---- Root -----------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rentals" element={<RentalsPage />} />
            <Route path="need-it-now" element={<NeedItNowPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="blockchain" element={<BlockchainPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
