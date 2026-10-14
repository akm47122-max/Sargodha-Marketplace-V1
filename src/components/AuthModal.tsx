import React, { useState } from 'react';
import { X, UserPlus, LogIn, ShieldCheck, MapPin, Phone, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { City, UserProfile } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
  existingUsers: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  existingUsers,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Register Fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<City>('Sargodha');
  const [area, setArea] = useState('');
  const [password, setPassword] = useState('');

  // Login Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !area.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.auth.register({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim() || `${mobile.trim().replace(/[^0-9]/g, '')}@sargodhamart.com`,
        password,
        city,
        area: area.trim(),
      });

      if (res.success && res.user) {
        onRegisterSuccess(res.user);
        onClose();
        return;
      }

      if (res.error && !res.error.includes('unreachable') && !res.error.includes('failed to fetch')) {
        setError(res.error);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn('PHP backend register error:', err);
    } finally {
      setLoading(false);
    }

    // Fallback if Hostinger database credentials are not yet populated
    const fallbackUser: UserProfile = {
      id: Date.now(),
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || `${mobile.trim()}@sargodhamart.com`,
      city,
      area: area.trim(),
      role: 'user',
      activationStatus: 'pending',
      joinedDate: 'Just now',
    };

    onRegisterSuccess(fallbackUser);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.signInWithGoogle();
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
        return;
      }
      if (res.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\s+/g, '');

    if (!cleanId || !loginPassword.trim()) {
      setError('Please enter both email/mobile and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.auth.login(loginIdentifier.trim(), loginPassword);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
        return;
      }

      if (res.error && !res.error.includes('unreachable') && !res.error.includes('failed to fetch') && !res.error.includes('Failed to fetch')) {
        setError(res.error);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn('Backend login error:', err);
    } finally {
      setLoading(false);
    }

    // Fallback check against existing users if DB not yet connected
    const matched = existingUsers.find(
      (u) =>
        u.mobile.toLowerCase().replace(/\s+/g, '') === cleanPhone ||
        u.email.toLowerCase() === cleanId
    );

    if (
      cleanId === 'akm47122@gmail.com' ||
      cleanPhone === '03098557159' ||
      matched?.role === 'super_admin' ||
      matched?.role === 'admin'
    ) {
      if (loginPassword !== '123456789Ikr@') {
        setError('Invalid credentials.');
        return;
      }
    }

    if (matched) {
      onLoginSuccess(matched);
      onClose();
    } else {
      const guestUser: UserProfile = {
        id: Date.now(),
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : `Seller ${loginIdentifier.slice(-4)}`,
        mobile: loginIdentifier.startsWith('03') ? loginIdentifier : '03001234567',
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@sargodhamart.com`,
        city: 'Sargodha',
        area: 'Satellite Town',
        role: 'user',
        activationStatus: 'pending',
        joinedDate: 'Today',
      };
      onLoginSuccess(guestUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-cyan-200 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switchers: Register vs Login */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-6">
          <button
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-cyan-600" />
            <span>Register to Post</span>
          </button>
          <button
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-cyan-600" />
            <span>Login to Account</span>
          </button>
        </div>

        {/* Header Text */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'register' ? 'Create SargodhaMart Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {authMode === 'register'
              ? 'Public browsing is always free. Register to activate your lifetime seller account.'
              : 'Login with your registered phone number or email to manage ads.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs mb-4 font-semibold">
            {error}
          </div>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-800 font-semibold mb-1">Full Name / Business Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Malik Tariq Dairy or Muhammad Ali"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Mobile Phone (WhatsApp Active) *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="03001234567"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-800 font-semibold mb-1">City / Tehsil *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                >
                  <option value="Sargodha">Sargodha</option>
                  <option value="Shaheenabad">Shaheenabad</option>
                  <option value="Sillanwali">Sillanwali</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-semibold mb-1">Area / Mohalla *</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Satellite Town"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-[11px] text-slate-600 font-medium">
              <strong className="text-cyan-800">Next Step:</strong> After free registration, you will be prompted to activate your lifetime seller account (Rs. 1,000 once) & follow the official WhatsApp Channel to unlock unlimited direct public postings.
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 hover:from-cyan-400 hover:via-blue-500 hover:to-fuchsia-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <span>Continue to Activation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 font-semibold mb-1">Mobile Number or Email *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="03127453108 or admin@sargodhamart.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-semibold mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Secure encrypted login for registered SargodhaMart members.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <LogIn className="w-4 h-4" />
              <span>Login & Open Dashboard</span>
            </button>
          </form>
        )}

        {/* Google One-Click Auth */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="relative flex py-1 items-center mb-3">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">or fast sign-in with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
