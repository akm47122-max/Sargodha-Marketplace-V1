import React, { useState } from 'react';
import {
  Truck,
  CreditCard,
  Building,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Shield,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';
import {
  TruckListing,
  LoadRequest,
  TransporterProfile,
  FreightQuotation,
  TransportBooking,
  TransporterSubscriptionPlan,
  TransporterSubscriptionPurchase,
  BookingStatus,
  SiteSettings,
} from '../types';

interface AdminFreightManagerProps {
  trucks: TruckListing[];
  loads: LoadRequest[];
  transporters: TransporterProfile[];
  quotations: FreightQuotation[];
  bookings: TransportBooking[];
  subscriptionPlans: TransporterSubscriptionPlan[];
  subscriptionPurchases: TransporterSubscriptionPurchase[];
  onApproveSubscription?: (id: number) => void;
  onRejectSubscription?: (id: number, reason: string) => void;
  onSaveSubscriptionPlan?: (plan: TransporterSubscriptionPlan) => void;
  onDeleteSubscriptionPlan?: (planId: string) => void;
  onToggleTransporterStatus?: (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => void;
  onUpdateDealStatus?: (bookingId: number, status: BookingStatus, notes?: string) => void;
  settings?: SiteSettings;
  onSaveSettings?: (settings: SiteSettings) => void;
}

export const AdminFreightManager: React.FC<AdminFreightManagerProps> = ({
  trucks,
  loads,
  transporters,
  quotations,
  bookings,
  subscriptionPlans,
  subscriptionPurchases,
  onApproveSubscription,
  onRejectSubscription,
  onSaveSubscriptionPlan,
  onDeleteSubscriptionPlan,
  onToggleTransporterStatus,
  onUpdateDealStatus,
  settings,
  onSaveSettings,
}) => {
  const [subTab, setSubTab] = useState<'payments' | 'plans' | 'transporters' | 'trucks' | 'loads' | 'deals' | 'reports' | 'settings'>('payments');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PENDING_PAYMENT' | 'ACTIVE' | 'REJECTED' | 'EXPIRED'>('PENDING_PAYMENT');
  
  // Modals state
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [rejectingPurchaseId, setRejectingPurchaseId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Plan Edit Modal
  const [editingPlan, setEditingPlan] = useState<TransporterSubscriptionPlan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);

  // Status updating for Deals
  const [updatingDealId, setUpdatingDealId] = useState<number | null>(null);
  const [selectedDealStatus, setSelectedDealStatus] = useState<BookingStatus>('IN_TRANSIT');
  const [dealNotes, setDealNotes] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations for reports (Subscriptions only - strictly excludes freight!)
  const approvedPurchases = subscriptionPurchases.filter((p) => p.status === 'ACTIVE');
  const totalSubscriptionRevenue = approvedPurchases.reduce((sum, p) => sum + p.amount, 0);
  const pendingPaymentsCount = subscriptionPurchases.filter(
    (p) => p.status === 'PENDING_PAYMENT' || p.status === 'PAYMENT_UNDER_REVIEW'
  ).length;

  const filteredPurchases = subscriptionPurchases.filter((p) => {
    if (paymentFilter === 'PENDING_PAYMENT') {
      return p.status === 'PENDING_PAYMENT' || p.status === 'PAYMENT_UNDER_REVIEW';
    }
    if (paymentFilter !== 'ALL' && p.status !== paymentFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.userName.toLowerCase().includes(q) ||
        p.transporterName.toLowerCase().includes(q) ||
        p.trxId.toLowerCase().includes(q) ||
        p.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSavePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    if (onSaveSubscriptionPlan) {
      onSaveSubscriptionPlan(editingPlan);
    }
    setEditingPlan(null);
  };

  const handleConfirmReject = () => {
    if (rejectingPurchaseId && onRejectSubscription) {
      onRejectSubscription(rejectingPurchaseId, rejectionReason || 'Payment transfer could not be verified.');
    }
    setRejectingPurchaseId(null);
    setRejectionReason('');
  };

  const handleDealStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingDealId && onUpdateDealStatus) {
      onUpdateDealStatus(updatingDealId, selectedDealStatus, dealNotes);
    }
    setUpdatingDealId(null);
    setDealNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 border border-amber-500/30 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" /> Nationwide Freight & Transporter Subscription Hub
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Freight Fleet Operations & Monthly Subscriptions
          </h2>
          <p className="text-xs text-amber-100/80 max-w-xl mt-1 leading-relaxed">
            Manage database-driven monthly transporter plans (PKR 999, PKR 1,999, PKR 3,999), review payment verification proofs, enforce vehicle limits, and monitor cargo deals throughout Pakistan.
          </p>
          <div className="mt-3 text-[11px] text-amber-200/90 font-medium">
            ⚠️ <em>Notice: Platform revenue counts monthly subscriptions only. Freight payments are settled directly between shipper and transporter.</em>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-amber-300">Pending Review</div>
            <div className="text-2xl font-black text-white">{pendingPaymentsCount}</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Total Subscriptions</div>
            <div className="text-2xl font-black text-emerald-400">Rs. {totalSubscriptionRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setSubTab('payments')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'payments'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Subscription Payments Queue ({pendingPaymentsCount})</span>
        </button>

        <button
          onClick={() => setSubTab('plans')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'plans'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Subscription Plans ({subscriptionPlans.length})</span>
        </button>

        <button
          onClick={() => setSubTab('transporters')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'transporters'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Registered Fleets ({transporters.length})</span>
        </button>

        <button
          onClick={() => setSubTab('loads')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'loads'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Cargo Loads ({loads.length})</span>
        </button>

        <button
          onClick={() => setSubTab('deals')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'deals'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Active Consignments & Deals ({bookings.length})</span>
        </button>

        <button
          onClick={() => setSubTab('trucks')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'trucks'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Truck Listings ({trucks.length})</span>
        </button>

        <button
          onClick={() => setSubTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'reports'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Subscription Revenue Reports</span>
        </button>

        <button
          onClick={() => setSubTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            subTab === 'settings'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Freight Settings & Notice</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SUBSCRIPTION PAYMENTS VERIFICATION QUEUE */}
      {/* ======================================================== */}
      {subTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Status:</span>
              <button
                onClick={() => setPaymentFilter('PENDING_PAYMENT')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentFilter === 'PENDING_PAYMENT'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Under Review ({pendingPaymentsCount})
              </button>
              <button
                onClick={() => setPaymentFilter('ACTIVE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentFilter === 'ACTIVE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Approved & Active ({approvedPurchases.length})
              </button>
              <button
                onClick={() => setPaymentFilter('REJECTED')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentFilter === 'REJECTED'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setPaymentFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Records
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by Transporter, TRX ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:border-amber-500 w-full sm:w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredPurchases.map((purchase) => {
                const isPending =
                  purchase.status === 'PENDING_PAYMENT' || purchase.status === 'PAYMENT_UNDER_REVIEW';
                return (
                  <div key={purchase.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          {purchase.transporterName || purchase.userName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                          {purchase.planName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            purchase.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : purchase.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </div>

                      <div className="text-slate-600 font-medium">
                        User: <strong className="text-slate-900">{purchase.userName}</strong> ({purchase.userPhone}) • Method:{' '}
                        <strong className="text-slate-900">{purchase.paymentMethod}</strong>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                        <span>TRX ID: <strong className="text-cyan-800 font-bold">{purchase.trxId}</strong></span>
                        <span>•</span>
                        <span>Amount: <strong className="text-emerald-800 font-bold">Rs. {purchase.amount.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Submitted: {purchase.createdAt}</span>
                      </div>

                      {purchase.startDate && (
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Active Validity: {purchase.startDate} to {purchase.expiryDate} (Reviewed by: {purchase.reviewedBy})
                        </div>
                      )}

                      {purchase.rejectionReason && (
                        <div className="text-[11px] text-rose-700 italic">
                          Rejection Reason: {purchase.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {purchase.paymentProofUrl && (
                        <button
                          onClick={() => setSelectedProofUrl(purchase.paymentProofUrl || null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-700" />
                          <span>View Proof</span>
                        </button>
                      )}

                      {isPending && (
                        <>
                          <button
                            onClick={() => onApproveSubscription && onApproveSubscription(purchase.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1 transition-all shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve (30 Days)</span>
                          </button>

                          <button
                            onClick={() => setRejectingPurchaseId(purchase.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredPurchases.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No subscription records found for this filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DATABASE-DRIVEN SUBSCRIPTION PLANS MANAGEMENT */}
      {/* ======================================================== */}
      {subTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Configurable Transporter Monthly Plans</h3>
              <p className="text-xs text-slate-500">
                Modify monthly pricing (PKR), vehicle listing limits, and plan features without touching code.
              </p>
            </div>

            <button
              onClick={() => {
                setIsNewPlan(true);
                setEditingPlan({
                  id: `plan_${Date.now()}`,
                  name: 'Custom Transporter Plan',
                  price: 2499,
                  durationDays: 30,
                  maxTruckListings: 8,
                  features: ['Active truck listings', 'Submit quotations', 'Direct WhatsApp contact'],
                  badge: 'Custom',
                  isActive: true,
                  displayOrder: subscriptionPlans.length + 1,
                });
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                      {plan.badge || 'Plan'}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        plan.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900">{plan.name}</h4>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    Rs. {plan.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                    Vehicle Limit: <strong className="text-slate-900 font-black">{plan.maxTruckListings} Trucks</strong>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setIsNewPlan(false);
                      setEditingPlan({ ...plan });
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-600" /> Edit Plan
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Disable or remove plan "${plan.name}"?`)) {
                        onDeleteSubscriptionPlan && onDeleteSubscriptionPlan(plan.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all"
                    title="Delete / Disable Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TRANSPORTER FLEETS MANAGEMENT */}
      {/* ======================================================== */}
      {subTab === 'transporters' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {transporters.map((tr) => (
                <div key={tr.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{tr.name}</span>
                      {tr.companyName && (
                        <span className="text-slate-500 font-semibold">• {tr.companyName}</span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tr.isVerified ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tr.isVerified ? 'Verified Fleet' : tr.verificationStatus}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium">
                      Operating: <strong className="text-slate-900">{tr.operatingCities.join(', ')}</strong> • Fleet Size:{' '}
                      <strong className="text-slate-900">{tr.vehicleCount} Vehicles</strong>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Phone: <span className="text-slate-800 font-semibold">{tr.phone}</span> • Completed Trips:{' '}
                      <strong className="text-emerald-700">{tr.completedTrips}</strong> • Rating: ⭐ {tr.rating} ({tr.reviewsCount} reviews)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        onToggleTransporterStatus &&
                        onToggleTransporterStatus(tr.id, tr.isVerified ? 'REJECTED' : 'APPROVED')
                      }
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        tr.isVerified
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                      }`}
                    >
                      {tr.isVerified ? 'Revoke Fleet Verification' : 'Verify Fleet Badge'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CARGO LOADS MODERATION */}
      {/* ======================================================== */}
      {subTab === 'loads' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {loads.map((load) => (
                <div key={load.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{load.cargoName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-100 text-cyan-800">
                        {load.requiredVehicleType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {load.status}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium">
                      Route: <strong className="text-slate-900">{load.pickupCity} → {load.destinationCity}</strong> • Weight:{' '}
                      <strong className="text-slate-900">{(load.totalWeightKg / 1000).toFixed(1)} Tons</strong> • Loading:{' '}
                      {load.loadingDate}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Shipper: <strong className="text-slate-800">{load.customerName}</strong> ({load.customerPhone}) • Budget:{' '}
                      <span className="font-bold text-emerald-700">Rs. {load.budgetPKR?.toLocaleString() || 'Negotiable'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${load.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                    >
                      Call Shipper
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ACTIVE CONSIGNMENTS & DEALS LIFECYCLE */}
      {/* ======================================================== */}
      {subTab === 'deals' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{booking.cargoName}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        {booking.status}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium">
                      Route: <strong className="text-slate-900">{booking.pickupCity} → {booking.destinationCity}</strong> • Agreed Freight:{' '}
                      <strong className="text-emerald-800">Rs. {booking.agreedPrice.toLocaleString()}</strong>
                    </div>

                    {booking.biltyNumber && (
                      <div className="text-[11px] text-cyan-800 font-mono font-bold">
                        Bilty #: {booking.biltyNumber}
                      </div>
                    )}

                    {booking.statusNotes && (
                      <div className="text-[11px] text-slate-500 italic">{booking.statusNotes}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setUpdatingDealId(booking.id);
                        setSelectedDealStatus(booking.status);
                        setDealNotes(booking.statusNotes || '');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Update Lifecycle</span>
                    </button>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active consignments or confirmed deals found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUBSCRIPTION REVENUE REPORTS */}
      {/* ======================================================== */}
      {subTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Total Subscription Revenue
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                Rs. {totalSubscriptionRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Verified platform receipts only (Excludes freight amounts)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Active Paid Fleets
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {approvedPurchases.length}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">
                Currently licensed transporters
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Active Truck Capacity
              </div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {trucks.length} Trucks
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Across {transporters.length} registered freight companies
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <h4 className="font-black text-sm text-amber-900">Platform Financial Integrity Guidelines:</h4>
            <p className="leading-relaxed">
              1. <strong>Direct Settlements:</strong> All freight prices are negotiated and exchanged strictly between the customer and the transporter via cash, bank transfer, or bilty terms.
            </p>
            <p className="leading-relaxed">
              2. <strong>Subscription Accounts:</strong> Sargodha Marketplace retains 0% commission on cargo values, earning solely through the monthly transporter software plans (Basic PKR 999, Business PKR 1,999, Fleet PKR 3,999).
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ALL TRUCK LISTINGS MODERATION */}
      {/* ======================================================== */}
      {subTab === 'trucks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Registered Trucks & Commercial Fleets</h3>
              <p className="text-xs text-slate-500">
                View, verify, and monitor active commercial vehicles listed on the nationwide freight network.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs">
              {trucks.length} Trucks Registered
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {trucks.map((truck) => (
                <div key={truck.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={truck.images[0]}
                      alt={truck.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{truck.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                          {truck.vehicleType} • {truck.wheelCount} Wheeler
                        </span>
                        {truck.isVerified && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Verified Transporter
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {truck.status || 'APPROVED'}
                        </span>
                      </div>

                      <div className="text-slate-600 font-medium">
                        Station: <strong className="text-slate-900">{truck.currentCity}</strong> • Capacity:{' '}
                        <strong className="text-amber-800">{truck.payloadCapacityTons} Tons</strong> • Body: {truck.bodyLengthFeet}ft ({truck.bodyType})
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Routes: <span className="font-semibold text-slate-700">{truck.preferredRoutes.join(', ') || 'Nationwide'}</span> • Phone:{' '}
                        <strong className="text-slate-800">{truck.transporterPhone}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${truck.transporterPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${truck.transporterWhatsapp.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}

              {trucks.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No trucks registered yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. SUPER ADMIN FREIGHT SETTINGS & NOTICE */}
      {/* ======================================================== */}
      {subTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Super Admin Truck & Freight Configuration</h3>
              <p className="text-xs text-slate-500">
                Control the public visibility of the Truck & Freight category, posting permissions, and compliance notices.
              </p>
            </div>

            <div className="space-y-4">
              {/* Toggle 1: Enable Public Freight Section */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Enable Public Truck & Freight on Explore & Homepage
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Show the Truck & Freight category, navigation button, and listings to all public visitors without login.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (settings && onSaveSettings) {
                      onSaveSettings({
                        ...settings,
                        isTruckFreightEnabled: !(settings.isTruckFreightEnabled ?? true),
                      });
                    }
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    (settings?.isTruckFreightEnabled ?? true) ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform"></div>
                </button>
              </div>

              {/* Toggle 2: Free Customer Load Postings */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Free Cargo Load Postings for Customers
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Customers can register and post load requests completely free of charge.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (settings && onSaveSettings) {
                      onSaveSettings({
                        ...settings,
                        isLoadPostingEnabled: !(settings.isLoadPostingEnabled ?? true),
                      });
                    }
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    (settings?.isLoadPostingEnabled ?? true) ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform"></div>
                </button>
              </div>

              {/* Toggle 3: Commercial Truck Listings */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Allow Commercial Truck Submissions
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Allow transporters to submit new trucks subject to monthly subscription plan limits.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (settings && onSaveSettings) {
                      onSaveSettings({
                        ...settings,
                        isTruckPostingEnabled: !(settings.isTruckPostingEnabled ?? true),
                      });
                    }
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    (settings?.isTruckPostingEnabled ?? true) ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform"></div>
                </button>
              </div>

              {/* Platform Disclaimer Notice Textarea */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Mandatory Platform Freight Notice
                </label>
                <p className="text-[11px] text-slate-500">
                  Displayed on the public freight page, explore spotlight, and quotation screens to clarify that freight charges are settled directly.
                </p>
                <textarea
                  rows={3}
                  value={
                    settings?.freightDisclaimerText ||
                    'Freight charges are paid directly by the customer to the transporter. Sargodha Marketplace collects subscription fees for platform services and is not the recipient of the freight payment.'
                  }
                  onChange={(e) => {
                    if (settings && onSaveSettings) {
                      onSaveSettings({
                        ...settings,
                        freightDisclaimerText: e.target.value,
                      });
                    }
                  }}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white border border-amber-300 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {isNewPlan ? 'Create New Subscription Plan' : `Edit Plan: ${editingPlan.name}`}
            </h3>

            <form onSubmit={handleSavePlanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Monthly Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Truck Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingPlan.maxTruckListings}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, maxTruckListings: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Plan Badge Tag (e.g. Popular, Basic)
                </label>
                <input
                  type="text"
                  value={editingPlan.badge || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Features (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={editingPlan.features.join(', ')}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Plan Active for New Subscriptions</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PAYMENT SCREENSHOT PROOF MODAL */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Subscription Payment Screenshot / Proof</h3>
            <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-slate-100 flex items-center justify-center border border-slate-200">
              <img src={selectedProofUrl} alt="Payment Proof" className="w-full object-contain" />
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
      {rejectingPurchaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Reject Subscription Payment</h3>
            <p className="text-xs text-slate-500">
              Please state why this transfer verification failed. The transporter will be notified immediately.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. TRX ID invalid, amount mismatch, screenshot blurry..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingPurchaseId(null)}
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

      {/* UPDATE DEAL LIFECYCLE MODAL */}
      {updatingDealId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Update Shipment Lifecycle</h3>
            <form onSubmit={handleDealStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Deal Status
                </label>
                <select
                  value={selectedDealStatus}
                  onChange={(e) => setSelectedDealStatus(e.target.value as BookingStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-slate-50"
                >
                  <option value="ACCEPTED">ACCEPTED (Deal Confirmed)</option>
                  <option value="PICKUP_SCHEDULED">PICKUP_SCHEDULED (Truck Assigned)</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (On the Road)</option>
                  <option value="DELIVERED">DELIVERED (Destination Reached)</option>
                  <option value="COMPLETED">COMPLETED (Bilty Cleared)</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="DISPUTED">DISPUTED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Status Update Notes
                </label>
                <textarea
                  rows={3}
                  value={dealNotes}
                  onChange={(e) => setDealNotes(e.target.value)}
                  placeholder="e.g. Truck departed Faisalabad bypass, expected delivery tomorrow 02:00 PM."
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingDealId(null)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
