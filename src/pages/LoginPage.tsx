import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Home,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { mockLogin, supabaseSignIn, supabaseSignUp } from '../lib/auth';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hostel, setHostel] = useState('A Block');
  const [room, setRoom] = useState('Room 101');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const result = await supabaseSignUp({
          name,
          email,
          password,
          hostel,
          room,
          department,
        });

        if (!result.ok) {
          setError(result.error || 'Failed to create account.');
          setLoading(false);
          return;
        }

        if (result.session) {
          login(result.session.student);
          setSuccessMsg(result.message || 'Account created successfully!');
          setTimeout(() => navigate('/'), 600);
        } else {
          setSuccessMsg(result.message || 'Registration submitted! Please verify your email or sign in.');
          setLoading(false);
        }
      } else {
        const result = await supabaseSignIn(email, password);
        if (!result.ok || !result.session) {
          setError(result.error || 'Login failed. Check your email and password.');
          setLoading(false);
          return;
        }

        login(result.session.student);
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    // 1-Click instant login without network dependency
    const result = mockLogin('aarav.sharma@srmist.edu.in', 'Aarav Sharma');
    if (result.ok && result.session) {
      login(result.session.student);
      navigate('/');
    }
  };

  const handlePrefillCredentials = () => {
    setName('Aarav Sharma');
    setEmail('aarav.sharma@srmist.edu.in');
    setPassword('campusPass123');
    setHostel('A Block');
    setRoom('Room 204');
    setDepartment('Computer Science & Engineering');
    setError('');
  };

  const features = [
    { icon: Users, text: 'Trade exclusively with verified university peers' },
    { icon: ShieldCheck, text: '0% platform commission — direct peer UPI exchange' },
    { icon: Zap, text: '5–15 min door-to-door handoffs within your hostel blocks' },
  ];

  return (
    <div className="min-h-screen bg-[#2F3020] flex flex-col lg:flex-row text-[#CDCBD6]">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#242519] to-[#2F3020] border-r border-[#434630] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#D96846] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              BB
            </span>
            <span className="text-[#CDCBD6] font-bold text-xl tracking-tight">BlockBuddy</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#596235]/40 text-[#CDCBD6] border border-[#596235]">
              Campus Escrow
            </span>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              The peer marketplace<br />
              <span className="text-[#D96846]">built for university hostels.</span>
            </h1>
            <p className="text-[#CDCBD6]/80 text-base mt-4 leading-relaxed max-w-sm">
              Buy, sell, and rent gear across campus blocks. Verified students only, 0% commission, and blockchain-backed security deposits.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#596235]/30 border border-[#596235]/50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#D96846]" />
                </div>
                <span className="text-sm text-[#CDCBD6]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '800+', label: 'Verified Students' },
            { value: '6 Blocks', label: 'Hostel Coverage' },
            { value: '₹0', label: 'Platform Fees' },
          ].map((s) => (
            <div key={s.label} className="bg-[#242519] border border-[#434630] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-[#9fa293] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login / Sign Up form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#2F3020]">
        <div className="w-full max-w-md bg-[#26271a] border border-[#434630] p-8 rounded-2xl shadow-2xl">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <span className="w-9 h-9 rounded-xl bg-[#D96846] flex items-center justify-center text-white font-bold shadow-lg">
              BB
            </span>
            <span className="text-white font-bold text-lg tracking-tight">BlockBuddy</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#202115] border border-[#434630] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#D96846] text-white shadow'
                  : 'text-[#CDCBD6] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#D96846] text-white shadow'
                  : 'text-[#CDCBD6] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create campus account'}
          </h2>
          <p className="text-xs text-[#9fa293] mt-1">
            Gated strictly by verified <span className="text-[#D96846] font-medium">@srmist.edu.in</span> or{' '}
            <span className="text-[#D96846] font-medium">@iitb.ac.in</span> domains.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {/* Name (for sign up or editable) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#CDCBD6]">Full Name</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa293]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Aarav Sharma"
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-sm text-white placeholder-[#9fa293]/60 pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#D96846] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#CDCBD6]">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa293]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@srmist.edu.in"
                  className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-sm text-white placeholder-[#9fa293]/60 pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#D96846] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#CDCBD6]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9fa293]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-sm text-white placeholder-[#9fa293]/60 pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#D96846] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9fa293] hover:text-white cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign up extra fields */}
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#CDCBD6]">Hostel Block</label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-[#D96846]"
                  >
                    {['A Block', 'B Block', 'C Block', 'D Block', 'E Block', 'F Block', 'H-12', 'H-13', 'H-14'].map(
                      (h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#CDCBD6]">Room / Floor</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room 101"
                    className="w-full bg-[#1e1f14] border border-[#434630] rounded-lg text-xs text-white placeholder-[#9fa293]/60 p-2.5 focus:outline-none focus:border-[#D96846]"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/40 rounded-lg px-3 py-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-center gap-2 bg-[#596235]/30 border border-[#596235] rounded-lg px-3 py-2 text-xs text-[#CDCBD6]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D96846]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D96846] hover:bg-[#c45735] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In with Campus ID' : 'Create & Verify Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* 1-Click Instant Demo Login */}
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-[#596235] hover:bg-[#4d552e] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Zap className="w-4 h-4 text-[#D96846]" />
              <span>⚡ 1-Click Instant Demo Login (Aarav Sharma)</span>
            </button>

            {/* Pre-fill Credentials button */}
            <button
              type="button"
              onClick={handlePrefillCredentials}
              className="w-full text-center text-[11px] text-[#9fa293] hover:text-white underline cursor-pointer py-1"
            >
              Prefill Form with Demo Student Credentials
            </button>
          </form>

          <div className="mt-5 p-3 bg-[#202115] border border-[#434630] rounded-lg">
            <p className="text-[11px] text-[#9fa293] text-center leading-relaxed">
              🔒 Connected to Supabase Auth &amp; Database. Verified student email domains ensure campus accountability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
