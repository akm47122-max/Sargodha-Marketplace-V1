import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  MessageCircle,
  Lock,
  UserX,
  Clock,
  Sparkles
} from 'lucide-react';
import { ReportItem } from '../types';

interface AdminReportsManagerProps {
  reports: ReportItem[];
  onResolveReport: (id: number) => void;
  onUpdateReportStatus?: (id: number, status: ReportItem['status'], action?: ReportItem['moderationAction'], notes?: string) => void;
  onDeleteContent?: (targetType: string, targetId: number) => void;
}

export const AdminReportsManager: React.FC<AdminReportsManagerProps> = ({
  reports,
  onResolveReport,
  onUpdateReportStatus,
  onDeleteContent,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'under_review' | 'resolved' | 'rejected' | 'escalated'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [moderationAction, setModerationAction] = useState<ReportItem['moderationAction']>('none');

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return r.status === 'new' || r.status === 'pending';
    return r.status === activeTab;
  });

  const handleOpenModeration = (r: ReportItem) => {
    setSelectedReport(r);
    setAdminNotes(r.adminNotes || '');
    setModerationAction(r.moderationAction || 'none');
  };

  const handleApplyModeration = (newStatus: ReportItem['status']) => {
    if (!selectedReport) return;
    if (onUpdateReportStatus) {
      onUpdateReportStatus(selectedReport.id, newStatus, moderationAction, adminNotes);
    } else {
      onResolveReport(selectedReport.id);
    }
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border border-rose-500/20 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Advanced Marketplace Protection Queue
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Moderation & Investigation Reports Center
          </h2>
          <p className="text-xs text-rose-100/80 max-w-xl mt-1 leading-relaxed">
            Multi-tier investigations across Products, Sellers, Shops, Jobs, and Cargo Transport. AI assists detection while human administrators make final moderation decisions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-rose-300">New Reports</div>
            <div className="text-xl font-black text-white">
              {reports.filter((r) => r.status === 'new' || r.status === 'pending').length}
            </div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Resolved</div>
            <div className="text-xl font-black text-white">
              {reports.filter((r) => r.status === 'resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* 5-State Investigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('new')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'new'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>New ({reports.filter((r) => r.status === 'new' || r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('under_review')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'under_review'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Under Review ({reports.filter((r) => r.status === 'under_review').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'resolved'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolved ({reports.filter((r) => r.status === 'resolved').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escalated')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'escalated'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Escalated ({reports.filter((r) => r.status === 'escalated').length})</span>
        </button>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No complaints or reports matching this queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((r) => (
              <div
                key={r.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase bg-rose-100 text-rose-800">
                      {r.targetType.toUpperCase()}: {r.targetTitle}
                    </span>
                    <span className="font-extrabold text-slate-900">{r.reason}</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                        r.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : r.status === 'escalated'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{r.details}</p>
                  <div className="text-[11px] text-slate-400">
                    Reported by <strong className="text-slate-700">{r.reporterName}</strong> • {r.createdAt}
                  </div>
                  {r.adminNotes && (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                      <strong>Internal Note:</strong> {r.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenModeration(r)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs hover:bg-slate-800"
                  >
                    Investigate
                  </button>

                  {r.status !== 'resolved' && (
                    <button
                      onClick={() => onResolveReport(r.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-500"
                    >
                      Quick Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Moderation Investigation
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Target: <strong className="text-slate-900">{selectedReport.targetTitle}</strong> ({selectedReport.targetType})
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Report Reason</span>
                <span className="font-bold text-slate-900">{selectedReport.reason}</span>
                <p className="text-slate-600 mt-1">{selectedReport.details}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Enforce Action</label>
                <select
                  value={moderationAction}
                  onChange={(e) => setModerationAction(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none text-xs"
                >
                  <option value="none">No Penalty / Dismiss Complaint</option>
                  <option value="warned">Warn Seller (Issue Warning Notice)</option>
                  <option value="hidden">Hide Listing (Temporarily Unpublish)</option>
                  <option value="suspended">Suspend Account / Resource</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Administrator Investigation Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record internal findings, seller contact logs, or explanation..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApplyModeration('escalated')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Escalate
                </button>
                <button
                  onClick={() => handleApplyModeration('resolved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                >
                  Confirm & Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
