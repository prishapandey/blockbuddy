import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, Users, Zap } from 'lucide-react';
import { mockLogin } from '../lib/auth';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const result = mockLogin(email, name);
    if (!result.ok || !result.session) {
      setError(result.error || 'Login failed.');
      setLoading(false);
      return;
    }

    login(result.session.student);
    navigate('/');
  };

  const features = [
    { icon: Users, text: 'Trade with verified IITB students only' },
    { icon: ShieldCheck, text: '0% commission — direct UPI transfers' },
    { icon: Zap, text: '5–15 min corridor handoffs within your hostel' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col lg:flex-row">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0d1117] to-[#0a0a0c] border-r border-[#22252b] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#4d8eff] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              BB
            </span>
            <span className="text-white font-bold text-xl tracking-tight">BlockBuddy</span>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              The campus marketplace<br />
              <span className="text-[#4d8eff]">built for IITB.</span>
            </h1>
            <p className="text-[#94a3b8] text-base mt-4 leading-relaxed max-w-sm">
              Buy, sell, and rent gear across Hostels 12–16. Zero fees, instant
              corridor pickups, verified students only.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4d8eff]/15 border border-[#4d8eff]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#4d8eff]" />
                </div>
                <span className="text-sm text-[#94a3b8]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '800+', label: 'Students' },
            { value: '5', label: 'Hostels' },
            { value: '₹0', label: 'Platform fees' },
          ].map((s) => (
            <div key={s.label} className="bg-[#121316] border border-[#22252b] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <span className="w-9 h-9 rounded-xl bg-[#4d8eff] flex items-center justify-center text-white font-bold shadow-lg">
              BB
            </span>
            <span className="text-white font-bold text-lg tracking-tight">BlockBuddy</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Use your <span className="text-[#4d8eff] font-medium">@iitb.ac.in</span> email to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#94a3b8]">Full Name</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Aarav Sharma"
                  className="w-full bg-[#121316] border border-[#22252b] rounded-lg text-sm text-white placeholder-[#64748b] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#4d8eff] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#94a3b8]">IITB Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yourname@iitb.ac.in"
                  className="w-full bg-[#121316] border border-[#22252b] rounded-lg text-sm text-white placeholder-[#64748b] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#4d8eff] transition-colors"
                />
              </div>
            </div>

            {/* Password (cosmetic — no backend) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#94a3b8]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#121316] border border-[#22252b] rounded-lg text-sm text-white placeholder-[#64748b] pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#4d8eff] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4d8eff] hover:bg-[#3b7cee] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>Sign in with IITB</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 bg-[#121316] border border-[#22252b] rounded-lg">
            <p className="text-[11px] text-[#64748b] text-center">
              🔒 &nbsp;Only <span className="text-white">@iitb.ac.in</span> addresses are accepted.
              Your data stays on campus.
            </p>
          </div>

          <p className="text-center text-xs text-[#64748b] mt-4">
            BlockBuddy · Campus Peer Exchange · Zero fees
          </p>
        </div>
      </div>
    </div>
  );
};
