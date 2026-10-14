import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Settings,
  ExternalLink,
  ShieldCheck,
  Eye,
  Trash2,
  Calendar,
  Building2,
  FileText,
  Search,
  Filter,
  Check,
  Info
} from 'lucide-react';
import { CollegeAd, CollegeAdStatus, SiteSettings } from '../types';

interface AdminCollegesManagerProps {
  collegeAds: CollegeAd[];
  settings?: SiteSettings;
  onApproveAd: (id: number) => void;
  onRejectAd: (id: number, reason: string) => void;
  onSuspendAd: (id: number) => void;
  onDeleteAd: (id: number) => void;
  onUpdateSettings?: (updated: SiteSettings) => void;
  onShowToast: (msg: string) => void;
}

export const AdminCollegesManager: React.FC<AdminCollegesManagerProps> = ({
  collegeAds,
  settings,
  onApproveAd,
  onRejectAd,
  onSuspendAd,
  onDeleteAd,
  onUpdateSettings,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'settings'>('ads');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalAd, setRejectModalAd] = useState<CollegeAd | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewAd, setPreviewAd] = useState<CollegeAd | null>(null);

  // Settings State
  const [packagePrice, setPackagePrice] = useState<number>(settings?.collegeAdPackagePrice || 3500);
  const [durationDays, setDurationDays] = useState<number>(settings?.collegeAdDurationDays || 30);
  const [isModuleEnabled, setIsModuleEnabled] = useState<boolean>(
    settings?.isCollegesModuleEnabled !== undefined ? settings.isCollegesModuleEnabled : true
  );

  // Stats
  const totalAds = collegeAds.length;
  const pendingAds = collegeAds.filter((a) => a.status === 'PENDING').length;
  const approvedAds = collegeAds.filter((a) => a.status === 'APPROVED').length;
  const totalRevenue = collegeAds
    .filter((a) => a.status === 'APPROVED')
    .reduce((acc, a) => acc + (a.packagePrice || 3500), 0);

  const filteredAds = collegeAds.filter((ad) => {
    if (filterStatus !== 'ALL' && ad.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ad.instituteName.toLowerCase().includes(q) ||
        ad.location.toLowerCase().includes(q) ||
        ad.transactionReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSettings && settings) {
      onUpdateSettings({
        ...settings,
        collegeAdPackagePrice: packagePrice,
        collegeAdDurationDays: durationDays,
        isCollegesModuleEnabled: isModuleEnabled,
      });
      onShowToast('College Advertising Settings updated successfully!');
    }
  };

  const handleConfirmReject = () => {
    if (rejectModalAd) {
      onRejectAd(rejectModalAd.id, rejectReason || 'Payment verification failed or guidelines not met.');
      setRejectModalAd(null);
      setRejectReason('');
      onShowToast('College advertisement marked as rejected.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Counter Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] font-black uppercase text-slate-400">Total Campus Ads</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalAds}</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
          <div className="text-[10px] font-black uppercase text-amber-800">Pending Review</div>
          <div className="text-xl font-black text-amber-900 mt-1">{pendingAds}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <div className="text-[10px] font-black uppercase text-emerald-800">Active Approved</div>
          <div className="text-xl font-black text-emerald-900 mt-1">{approvedAds}</div>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 shadow-sm">
          <div className="text-[10px] font-black uppercase text-cyan-800">Campus Ad Revenue</div>
          <div className="text-xl font-black text-cyan-950 mt-1">
            Rs. {totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ads'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Advertisements Review ({collegeAds.length})</span>
          {pendingAds > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {pendingAds}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Package &amp; Pricing Settings</span>
        </button>
      </div>

      {/* TAB 1: Advertisements List */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college name, area, or TRX ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === st
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Advertisements Table / Cards */}
          <div className="space-y-3">
            {filteredAds.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No college advertisements matching this filter.
              </div>
            ) : (
              filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {ad.logoImage ? (
                        <img src={ad.logoImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-950 text-sm">{ad.instituteName}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {ad.instituteType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            ad.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ad.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ad.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span>📍 {ad.location}</span>
                        <span>📞 {ad.phone} / WA: {ad.whatsapp}</span>
                        <span>📅 Deadline: {ad.applicationDeadline}</span>
                      </div>

                      {/* Payment TRX ID and Package Info */}
                      <div className="text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 inline-flex items-center gap-2 text-slate-700">
                        <span>💰 Package: Rs. {(ad.packagePrice || 3500).toLocaleString()} ({ad.durationDays || 30} Days)</span>
                        <span className="text-slate-300">|</span>
                        <span>TRX ID: <strong className="text-blue-700">{ad.transactionReference}</strong></span>
                      </div>

                      {/* External Form Link Preview */}
                      <div className="text-[11px] text-cyan-800 flex items-center gap-1.5 pt-0.5">
                        <span className="font-bold">Application Form:</span>
                        <a
                          href={ad.applicationFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 truncate max-w-xs font-mono"
                        >
                          <span className="truncate">{ad.applicationFormUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => setPreviewAd(ad)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    {ad.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => {
                            onApproveAd(ad.id);
                            onShowToast(`Approved and published ad for ${ad.instituteName}!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify &amp; Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectModalAd(ad)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {ad.status === 'APPROVED' && (
                      <button
                        onClick={() => {
                          onSuspendAd(ad.id);
                          onShowToast(`Suspended admission ad for ${ad.instituteName}.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors"
                      >
                        Suspend Ad
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ad for ${ad.instituteName}?`)) {
                          onDeleteAd(ad.id);
                          onShowToast(`Deleted ad for ${ad.instituteName}.`);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Settings & Configuration */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Colleges, Admissions &amp; Campus Ads Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure package pricing, display duration, and payment guidelines for educational institutes in Sargodha.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-cyan-950">Enable Colleges &amp; Campus Ads Module</div>
                <div className="text-[11px] text-cyan-800">
                  When enabled, shows the Colleges tab in the navigation bar and home portal.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isModuleEnabled}
                onChange={(e) => setIsModuleEnabled(e.target.checked)}
                className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Premium Package Price (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(Number(e.target.value))}
                    min={500}
                    step={100}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Default standard rate: Rs. 3,500</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Package Duration (Days)
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  min={7}
                  max={180}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Default standard duration: 30 days</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security &amp; External Link Safety Policy:</span>
              </div>
              <p>
                • Only HTTP and HTTPS URLs are permitted for student Google Forms or application portals.
              </p>
              <p>
                • Sargodha Marketplace provides an intermediate notice reminding students not to share passwords or financial credentials.
              </p>
              <p>
                • Payment is manually verified via EasyPaisa (03127453108) or JazzCash (03098557159) before activation.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save College Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalAd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900">
              Reject Admission Ad: {rejectModalAd.instituteName}
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Invalid TRX ID, payment receipt not found in EasyPaisa account, or invalid application link."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalAd(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poster Preview Modal */}
      {previewAd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{previewAd.instituteName} - Poster</h4>
              <button
                onClick={() => setPreviewAd(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-950">
              <img
                src={previewAd.posterImage}
                alt=""
                className="w-full h-full object-contain mx-auto"
              />
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Form URL:</strong> {previewAd.applicationFormUrl}</div>
              <div><strong>Deadline:</strong> {previewAd.applicationDeadline}</div>
              <div><strong>TRX ID:</strong> {previewAd.transactionReference}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
