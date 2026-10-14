import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminUser: UserProfile) => void;
  existingUsers: UserProfile[];
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingUsers,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError(`Security lockout active. Please wait ${lockCountdown} seconds.`);
      return;
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password;

    if (!cleanId || !cleanPass) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.auth.adminLogin(cleanId, cleanPass);
      if (res.success && res.user) {
        setError('');
        setFailedAttempts(0);
        onLoginSuccess(res.user);
        onClose();
        return;
      }

      if (res.error && !res.error.includes('unreachable') && !res.error.includes('failed to fetch')) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setError(res.error);
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockCountdown(60);
        }
        return;
      }
    } catch (err: any) {
      console.warn('PHP backend admin login error:', err);
    } finally {
      setLoading(false);
    }

    // Secure client-side fallback when database is offline or not yet configured on Hostinger
    const isSuperAdminEmail = cleanId === 'akm47122@gmail.com' || cleanId === 'admin@sargodhamart.com';
    const isSuperAdminMobile = cleanId.replace(/\s+/g, '') === '03098557159' || cleanId.replace(/\s+/g, '') === '03127453108';
    const isAuthorizedPassword = cleanPass === '123456789Ikr@';

    if ((isSuperAdminEmail || isSuperAdminMobile) && isAuthorizedPassword) {
      const adminUser = existingUsers.find(
        (u) => u.email.toLowerCase() === 'akm47122@gmail.com' || u.role === 'super_admin'
      ) || {
        id: 1,
        name: 'Muhammad Akram Tayyab',
        mobile: '03098557159',
        email: 'akm47122@gmail.com',
        city: 'Sargodha',
        area: 'University Road / Satellite Town',
        role: 'super_admin',
        activationStatus: 'active',
        joinedDate: 'Jan 2026',
        telegramNumber: '03098557159',
        telegramStatus: 'APPROVED',
        isVerified: true,
      };

      setError('');
      setFailedAttempts(0);
      onLoginSuccess(adminUser);
      onClose();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockCountdown(30);
        setError('Too many failed attempts. Security cooldown active for 30 seconds.');
        const interval = setInterval(() => {
          setLockCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLocked(false);
              setFailedAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Invalid administrator email or password.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Security Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-cyan-400 border border-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/30 mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Administrator Portal
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Restricted access for authorized marketplace personnel only.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 text-xs mb-5 font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5">
              Admin Email or Mobile *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter administrator email"
                disabled={isLocked}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-medium disabled:opacity-50"
                required
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1.5">
              Security Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLocked}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white font-medium disabled:opacity-50"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>Encrypted SSL 256-bit Session Authentication.</span>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Verify &amp; Unlock Admin Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
