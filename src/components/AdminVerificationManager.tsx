import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Eye,
  Settings,
  DollarSign,
  Search,
  UserCheck,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { SellerVerificationRecord, SiteSettings, VerificationStatus, VerifiedBadgeDurationMode } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface AdminVerificationManagerProps {
  verifications: SellerVerificationRecord[];
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
  onApproveVerification?: (id: number) => void;
  onRejectVerification?: (id: number, reason: string) => void;
  onRevokeVerification?: (id: number, reason: string) => void;
}

export const AdminVerificationManager: React.FC<AdminVerificationManagerProps> = ({
  verifications,
  settings,
  onSaveSettings,
  onApproveVerification,
  onRejectVerification,
  onRevokeVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'settings'>('queue');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REVOKED'>('PENDING');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  // Rejection & Revocation modals
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [revocationReason, setRevocationReason] = useState('');

  // Settings form state
  const [verifiedFee, setVerifiedFee] = useState<number>(settings.verifiedBadgeFee || 6999);
  const [durationMode, setDurationMode] = useState<VerifiedBadgeDurationMode>(
    settings.verifiedBadgeDurationMode || 'lifetime'
  );
  const [monthlyRenewalPrice, setMonthlyRenewalPrice] = useState<number>(
    settings.verifiedBadgeMonthlyRenewalPrice || 2499
  );
  const [renewalReminders, setRenewalReminders] = useState<boolean>(
    settings.verifiedBadgeRenewalReminders !== undefined ? settings.verifiedBadgeRenewalReminders : true
  );
  const [graceDays, setGraceDays] = useState<number>(settings.verifiedBadgeGraceDays || 0);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const pendingCount = verifications.filter((v) => v.status === 'PENDING' || v.status === 'UNDER_REVIEW').length;
  const verifiedCount = verifications.filter((v) => v.status === 'VERIFIED').length;

  const filteredVerifications = verifications.filter((v) => {
    if (statusFilter === 'PENDING') return v.status === 'PENDING' || v.status === 'UNDER_REVIEW';
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    return true;
  });

  const handleSaveDurationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      verifiedBadgeFee: verifiedFee,
      verifiedBadgeDurationMode: durationMode,
      verifiedBadgeMonthlyRenewalPrice: monthlyRenewalPrice,
      verifiedBadgeRenewalReminders: renewalReminders,
      verifiedBadgeGraceDays: graceDays,
    });
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleConfirmReject = () => {
    if (rejectingId && onRejectVerification) {
      onRejectVerification(rejectingId, rejectionReason || 'Verification documents or fee transfer could not be verified.');
    }
    setRejectingId(null);
    setRejectionReason('');
  };

  const handleConfirmRevoke = () => {
    if (revokingId && onRevokeVerification) {
      onRevokeVerification(revokingId, revocationReason || 'Verified status revoked by administrator due to policy non-compliance.');
    }
    setRevokingId(null);
    setRevocationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Official Blue Verified Badge System
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Verified Seller & Business Badge Management</span>
            <VerifiedBadge size="sm" />
          </h2>
          <p className="text-xs text-blue-100/80 max-w-xl mt-1 leading-relaxed">
            Administer the official blue verified badge with white checkmark (✓). Manage duration modes (Lifetime vs Monthly), review applicant payment proofs (Default: PKR {settings.verifiedBadgeFee || 6999}), and control badge revocation.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-blue-300">Pending Review</div>
            <div className="text-2xl font-black text-white">{pendingCount}</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Active Verified</div>
            <div className="text-2xl font-black text-emerald-400">{verifiedCount}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verification Applications Queue ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Verified Badge Duration Mode Settings</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. VERIFICATION APPLICATIONS QUEUE */}
      {/* ======================================================== */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto text-xs bg-white p-3 rounded-2xl border border-slate-200">
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending & Under Review ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('VERIFIED')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'REJECTED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setStatusFilter('REVOKED')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'REVOKED'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Revoked Badges
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredVerifications.map((v) => {
                const isPending = v.status === 'PENDING' || v.status === 'UNDER_REVIEW';
                const isVerified = v.status === 'VERIFIED';
                return (
                  <div key={v.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{v.userName}</span>
                        {v.shopName && <span className="text-slate-500 font-semibold">• {v.shopName}</span>}
                        {isVerified ? (
                          <VerifiedBadge size="sm" />
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : v.status === 'REVOKED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {v.status}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                          {v.durationMode === 'lifetime' ? 'Lifetime Mode' : 'Monthly Mode'}
                        </span>
                      </div>

                      <div className="text-slate-600 font-medium">
                        City: <strong className="text-slate-900">{v.userCity}</strong> • Phone:{' '}
                        <strong className="text-slate-900">{v.userPhone}</strong> • Type: {v.businessType}
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                        <span>TRX ID: <strong className="text-blue-800 font-bold">{v.trxId}</strong></span>
                        <span>•</span>
                        <span>Fee Paid: <strong className="text-emerald-800 font-bold">Rs. {v.fee.toLocaleString()}</strong></span>
                        {v.cnicNumber && (
                          <>
                            <span>•</span>
                            <span>CNIC / Reg: {v.cnicNumber}</span>
                          </>
                        )}
                      </div>

                      {v.approvedAt && (
                        <div className="text-[11px] text-emerald-700">
                          Approved on: {v.approvedAt} by {v.reviewedBy} {v.expiresAt && `(Expires: ${v.expiresAt})`}
                        </div>
                      )}

                      {v.rejectionReason && (
                        <div className="text-[11px] text-rose-700 italic">
                          Rejection Reason: {v.rejectionReason}
                        </div>
                      )}

                      {v.revocationReason && (
                        <div className="text-[11px] text-amber-800 italic">
                          Revocation Reason: {v.revocationReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {v.paymentProofUrl && (
                        <button
                          onClick={() => setSelectedProofUrl(v.paymentProofUrl)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Proof</span>
                        </button>
                      )}

                      {isPending && (
                        <>
                          <button
                            onClick={() => onApproveVerification && onApproveVerification(v.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Award Badge</span>
                          </button>

                          <button
                            onClick={() => setRejectingId(v.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {isVerified && (
                        <button
                          onClick={() => setRevokingId(v.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1"
                          title="Revoke Verified Badge"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Revoke Badge</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredVerifications.length === 0 && (
                <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
                    🛡️
                  </div>
                  <div className="font-bold text-slate-800">No verification applications found in "{statusFilter}" filter</div>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    {statusFilter === 'PENDING'
                      ? 'All submitted seller verifications have been reviewed. Click "Verified" or "All Records" above to see awarded badges, or manage verification directly in the Users tab.'
                      : 'No verification records currently match this filter criteria.'}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs"
                    >
                      View All Records ({verifications.length})
                    </button>
                    {statusFilter !== 'VERIFIED' && (
                      <button
                        onClick={() => setStatusFilter('VERIFIED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-all"
                      >
                        View Verified Badges ({verifiedCount})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADMIN-CONFIGURABLE VERIFIED BADGE DURATION SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Verified Badge Duration Mode Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select whether the official blue verification badge operates as a one-time lifetime verification or requires recurring monthly subscription renewal.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified badge duration and pricing settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveDurationSettings} className="space-y-5 text-xs">
            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Verified Badge Duration Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-1 cursor-pointer transition-all ${
                    durationMode === 'lifetime'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">Lifetime Mode</span>
                    <input
                      type="radio"
                      name="durationMode"
                      value="lifetime"
                      checked={durationMode === 'lifetime'}
                      onChange={() => setDurationMode('lifetime')}
                      className="text-blue-600 w-4 h-4"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    One-time fee of PKR {verifiedFee.toLocaleString()}. Badge remains active for the account's lifetime unless revoked by Admin.
                  </p>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-1 cursor-pointer transition-all ${
                    durationMode === 'monthly'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">Monthly Mode</span>
                    <input
                      type="radio"
                      name="durationMode"
                      value="monthly"
                      checked={durationMode === 'monthly'}
                      onChange={() => setDurationMode('monthly')}
                      className="text-blue-600 w-4 h-4"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Recurring monthly verification. Badge expires at the end of each 30-day paid period unless renewed and re-approved.
                  </p>
                </label>
              </div>
            </div>

            {/* Verification Fee */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Initial Verification Application Fee (PKR)
              </label>
              <input
                type="number"
                required
                min={0}
                value={verifiedFee}
                onChange={(e) => setVerifiedFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Default suggested fee: PKR 6,999. Displayed to users prior to submission.
              </span>
            </div>

            {/* Monthly Renewal Price (Only active if monthly mode) */}
            {durationMode === 'monthly' && (
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Monthly Renewal Fee (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={monthlyRenewalPrice}
                  onChange={(e) => setMonthlyRenewalPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Amount charged for subsequent monthly renewals.
                </span>
              </div>
            )}

            {/* Reminders & Grace Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Expiry Grace Period (Days)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={graceDays}
                  onChange={(e) => setGraceDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 0 days.</span>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={renewalReminders}
                    onChange={(e) => setRenewalReminders(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Send Resend Email Renewal Reminders</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-md shadow-blue-600/25 transition-all"
              >
                Save Verification Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW PROOF MODAL */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Verification Payment / Document Proof</h3>
            <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-slate-100 flex items-center justify-center border border-slate-200">
              <img src={selectedProofUrl} alt="Proof" className="w-full object-contain" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Reject Verification Application</h3>
            <p className="text-xs text-slate-500">
              Enter reason for rejection. This will be recorded and shown to the seller.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Invalid bank transfer receipt, incorrect CNIC provided..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 rounded-xl text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVOKE MODAL */}
      {revokingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-rose-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Revoke Verified Badge
            </h3>
            <p className="text-xs text-slate-500">
              State the reason for removing the verified badge from this account.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. User violated trade policies, fraudulent listing reported..."
              value={revocationReason}
              onChange={(e) => setRevocationReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRevokingId(null)}
                className="px-3 py-1.5 rounded-xl text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
              >
                Revoke Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
