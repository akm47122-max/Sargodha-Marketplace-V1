import React, { useState } from 'react';
import {
  Truck,
  Package,
  Search,
  MapPin,
  Calendar,
  Weight,
  Phone,
  MessageCircle,
  ShieldCheck,
  PlusCircle,
  FileText,
  DollarSign,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Building,
  RotateCcw,
  Sparkles,
  AlertCircle,
  LayoutDashboard,
  Shield,
  Check,
  X
} from 'lucide-react';
import {
  TruckListing,
  LoadRequest,
  TransporterProfile,
  FreightQuotation,
  TransportBooking,
  UserProfile,
  VehicleType,
  TransporterSubscriptionPlan,
  TransporterSubscriptionPurchase,
} from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { INITIAL_TRANSPORTER_PLANS, INITIAL_SUBSCRIPTION_PURCHASES } from '../data/transportData';

interface TransportSectionProps {
  currentUser: UserProfile | null;
  trucks: TruckListing[];
  loads: LoadRequest[];
  transporters: TransporterProfile[];
  quotations: FreightQuotation[];
  bookings: TransportBooking[];
  subscriptionPlans?: TransporterSubscriptionPlan[];
  subscriptionPurchases?: TransporterSubscriptionPurchase[];
  onOpenAuth: () => void;
  onPostLoadClick: () => void;
  onPostTruckClick: () => void;
  onSelectTruck: (truck: TruckListing) => void;
  onSelectLoad: (load: LoadRequest) => void;
  onSubmitQuotation?: (quotationData: Omit<FreightQuotation, 'id' | 'createdAt'>) => void;
  onAcceptQuotation?: (quotationId: number) => void;
  onPurchaseSubscription?: (planId: string, trxId: string, paymentMethod: string, proofUrl?: string) => void;
  selectedCity?: string;
}

export const TransportSection: React.FC<TransportSectionProps> = ({
  currentUser,
  trucks,
  loads,
  transporters,
  quotations,
  bookings,
  subscriptionPlans = INITIAL_TRANSPORTER_PLANS,
  subscriptionPurchases = INITIAL_SUBSCRIPTION_PURCHASES,
  onOpenAuth,
  onPostLoadClick,
  onPostTruckClick,
  onSelectTruck,
  onSelectLoad,
  onSubmitQuotation,
  onAcceptQuotation,
  onPurchaseSubscription,
  selectedCity = 'All',
}) => {
  const [activeTab, setActiveTab] = useState<
    'trucks' | 'loads' | 'transporters' | 'bookings' | 'plans' | 'dashboard'
  >('trucks');

  // Subscription Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState<TransporterSubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Bank of Punjab'>('EasyPaisa');
  const [trxIdInput, setTrxIdInput] = useState('');
  const [subSuccessMsg, setSubSuccessMsg] = useState(false);

  // Current user subscription status check
  const mySubscription = currentUser
    ? subscriptionPurchases.find((p) => p.userId === currentUser.id && p.status === 'ACTIVE')
    : null;
  const myPendingSubscription = currentUser
    ? subscriptionPurchases.find(
        (p) =>
          p.userId === currentUser.id &&
          (p.status === 'PENDING_PAYMENT' || p.status === 'PAYMENT_UNDER_REVIEW')
      )
    : null;
  const myTrucks = currentUser ? trucks.filter((t) => t.userId === currentUser.id) : [];
  const myLoads = currentUser ? loads.filter((l) => l.customerId === currentUser.id) : [];
  const myBookings = currentUser
    ? bookings.filter((b) => b.customerId === currentUser.id || b.transporterId === currentUser.id)
    : [];

  const handleOpenTruckPost = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    // Subscription limit check:
    if (!mySubscription) {
      alert(
        'A monthly transporter subscription (starting from PKR 999/month) is required to list trucks on the nationwide freight network. You can view our subscription plans below.'
      );
      setActiveTab('plans');
      return;
    }
    if (myTrucks.length >= mySubscription.planSnapshot.maxTruckListings) {
      alert(
        `You have reached the maximum vehicle limit (${mySubscription.planSnapshot.maxTruckListings} trucks) for your current "${mySubscription.planName}" plan. Please upgrade to a higher plan to add more vehicles.`
      );
      setActiveTab('plans');
      return;
    }
    onPostTruckClick();
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan || !trxIdInput.trim()) return;
    if (onPurchaseSubscription) {
      onPurchaseSubscription(checkoutPlan.id, trxIdInput.trim(), paymentMethod);
    }
    setSubSuccessMsg(true);
    setTimeout(() => {
      setSubSuccessMsg(false);
      setCheckoutPlan(null);
      setTrxIdInput('');
    }, 3000);
  };
  
  // Search and filter states
  const [searchPickup, setSearchPickup] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('All');
  const [selectedLoadType, setSelectedLoadType] = useState<'ALL' | 'FTL' | 'PTL'>('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Filter Trucks
  const filteredTrucks = trucks.filter((truck) => {
    if (truck.status !== 'available') return false;
    if (onlyVerified && !truck.isVerified) return false;
    if (selectedVehicleType !== 'All' && truck.vehicleType !== selectedVehicleType) return false;
    
    if (searchPickup.trim()) {
      const q = searchPickup.toLowerCase();
      const matchCity = truck.currentCity.toLowerCase().includes(q);
      const matchPickups = truck.pickupAreasServed.some((a) => a.toLowerCase().includes(q));
      if (!matchCity && !matchPickups) return false;
    }

    if (searchDestination.trim()) {
      const q = searchDestination.toLowerCase();
      const matchDest = truck.destinationsServed.some((d) => d.toLowerCase().includes(q));
      const matchRoutes = truck.preferredRoutes.some((r) => r.toLowerCase().includes(q));
      if (!matchDest && !matchRoutes) return false;
    }

    return true;
  });

  // Filter Loads
  const filteredLoads = loads.filter((load) => {
    if (load.status !== 'open' && load.status !== 'quoted') return false;
    if (selectedVehicleType !== 'All' && load.requiredVehicleType !== selectedVehicleType) return false;
    if (selectedLoadType !== 'ALL' && load.loadType !== selectedLoadType) return false;

    if (searchPickup.trim()) {
      const q = searchPickup.toLowerCase();
      const matchCity = load.pickupCity.toLowerCase().includes(q);
      const matchArea = load.pickupArea?.toLowerCase().includes(q) || false;
      if (!matchCity && !matchArea) return false;
    }

    if (searchDestination.trim()) {
      const q = searchDestination.toLowerCase();
      const matchDest = load.destinationCity.toLowerCase().includes(q);
      const matchArea = load.destinationArea?.toLowerCase().includes(q) || false;
      if (!matchDest && !matchArea) return false;
    }

    return true;
  });

  const VEHICLE_OPTIONS = [
    'All',
    'Pickup',
    'Shehzore',
    'Mazda',
    'Light commercial truck',
    '6-wheeler',
    '10-wheeler',
    '12-wheeler',
    '14-wheeler',
    '18-wheeler',
    'Container truck',
    'Refrigerated truck',
    'Trailer',
  ];

  return (
    <div className="space-y-6">
      {/* Hero Freight Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-10 shadow-xl border border-amber-500/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" /> Pakistan-Wide Trucking & Freight Marketplace
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Find Trucks or Post Cargo Loads <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              ٹرک اور گڈز ٹرانسپورٹ نیٹ ورک
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            Directly connect Sargodha, Shaheenabad, Lahore, Karachi, and nationwide transporters with manufacturers, citrus growers, wholesalers, and traders. Zero hidden broker markups.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={currentUser ? onPostLoadClick : onOpenAuth}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-transform hover:scale-102"
            >
              <Package className="w-4 h-4" />
              <span>Post a Load (مال بھیجیں)</span>
            </button>

            <button
              onClick={currentUser ? onPostTruckClick : onOpenAuth}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>List Available Truck (ٹرک شامل کریں)</span>
            </button>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-amber-400">{trucks.length}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Available Trucks</div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400">{loads.length}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Cargo Loads</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{transporters.length}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Registered Fleets</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-400">100%</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Contacts</div>
          </div>
        </div>
      </div>

      {/* Platform & Freight Disclaimers Notice */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase tracking-wide text-xs block text-amber-900">
            Important Freight Notice & Platform Role (ٹرانسپورٹ اور کرایہ کی اہم وضاحت):
          </span>
          <p className="mt-1 text-amber-900/90 leading-relaxed text-xs">
            Freight charges are paid directly by the customer to the transporter. Sargodha Marketplace collects monthly subscription fees for platform services and is not the recipient of the freight payment. Sargodha Marketplace does not guarantee or insure vehicles, cargo, or individual transactions. Please inspect vehicles and exchange verifiable bilty documents prior to dispatch.
          </p>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveTab('trucks')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'trucks'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Find a Truck ({filteredTrucks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loads')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'loads'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Find Loads ({filteredLoads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transporters')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'transporters'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Transporters ({transporters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations & Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'plans'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-amber-50 text-amber-900 hover:text-slate-950 border border-amber-300'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-700" />
            <span>Subscription Plans</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                  : 'bg-cyan-50 text-cyan-900 hover:text-slate-950 border border-cyan-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-600" />
              <span>My Freight Dashboard</span>
            </button>
          )}
        </div>

        {/* Quick Post CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenTruckPost}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> List Your Truck
          </button>
          <button
            onClick={currentUser ? onPostLoadClick : onOpenAuth}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm"
          >
            <Package className="w-3.5 h-3.5" /> Post a Load (Free)
          </button>
        </div>
      </div>

      {/* Two-Sided Route & Vehicle Search Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Pickup City */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              📍 Pickup City / Area
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Sargodha, Sillanwali..."
                value={searchPickup}
                onChange={(e) => setSearchPickup(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium text-xs"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Destination City */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              🎯 Destination City / Route
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Karachi, Lahore, Rawalpindi..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium text-xs"
              />
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              🚚 Vehicle Type
            </label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium text-xs"
            >
              {VEHICLE_OPTIONS.map((vt) => (
                <option key={vt} value={vt}>
                  {vt}
                </option>
              ))}
            </select>
          </div>

          {/* Load Capacity / Type */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              📦 Full / Partial Load (FTL / PTL)
            </label>
            <select
              value={selectedLoadType}
              onChange={(e) => setSelectedLoadType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium text-xs"
            >
              <option value="ALL">All Load Formats</option>
              <option value="FTL">Full Truckload (FTL)</option>
              <option value="PTL">Partial Load (PTL / Shehzore)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                onlyVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Fleets Only</span>
            </button>

            {(searchPickup || searchDestination || selectedVehicleType !== 'All' || selectedLoadType !== 'ALL' || onlyVerified) && (
              <button
                onClick={() => {
                  setSearchPickup('');
                  setSearchDestination('');
                  setSelectedVehicleType('All');
                  setSelectedLoadType('ALL');
                  setOnlyVerified(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{activeTab === 'trucks' ? filteredTrucks.length : filteredLoads.length}</strong> matching entries across Pakistan
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. AVAILABLE TRUCKS GRID */}
      {/* ========================================================= */}
      {activeTab === 'trucks' && (
        <div>
          {filteredTrucks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No trucks matching this route right now</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Be the first to list a truck for this destination, or post your load request so fleet owners can quote!
              </p>
              <button
                onClick={currentUser ? onPostLoadClick : onOpenAuth}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Post Your Load Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredTrucks.map((truck) => {
                const cleanPhone = truck.transporterPhone.replace(/[^0-9+]/g, '');
                const cleanWhatsapp = truck.transporterWhatsapp.replace(/[^0-9+]/g, '');
                const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum! I saw your truck "${truck.title}" on SargodhaMart. Is it available for transport?`
                )}`;

                return (
                  <div
                    key={truck.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Truck Image & Badges */}
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <img
                          src={truck.images[0]}
                          alt={truck.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-extrabold text-[10px] uppercase border border-amber-400/40">
                            {truck.vehicleType} ({truck.wheelCount} Wheeler)
                          </span>
                          {truck.isVerified && (
                            <VerifiedBadge size="xs" tooltip="Verified Truck & Documents (تصدیق شدہ)" />
                          )}
                        </div>

                        <div className="absolute bottom-2 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" /> Current: <strong>{truck.currentCity}</strong>
                          </span>
                          <span className="text-amber-300 font-bold">
                            Legal Payload: {truck.payloadCapacityTons} Tons
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 line-clamp-1">{truck.title}</h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Transporter: <strong className="text-slate-800">{truck.transporterName}</strong>
                          </p>
                        </div>

                        {/* Specifications Chips */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Body Length</span>
                            <span className="font-bold text-slate-800">{truck.bodyLengthFeet} Feet ({truck.bodyType})</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Capacity Type</span>
                            <span className="font-bold text-slate-800">
                              {truck.loadTypeAvailability === 'BOTH' ? 'Full & Partial Loads' : truck.loadTypeAvailability}
                            </span>
                          </div>
                        </div>

                        {/* Served Destinations */}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Confirmed Routes Served:
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {truck.destinationsServed.map((dest, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold"
                              >
                                → {dest}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Return Routes & Cargo accepted */}
                        {truck.returnRoutes && truck.returnRoutes.length > 0 && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                            <strong>🔄 Return Load Routes:</strong> {truck.returnRoutes.join(', ')}
                          </div>
                        )}

                        {truck.freightRateDescription && (
                          <div className="text-[11px] text-slate-600 font-medium">
                            <strong className="text-slate-900">Indicative Rate:</strong> {truck.freightRateDescription}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectTruck(truck)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        Inspect Specifications
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                          title="Call Transporter"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                          title="WhatsApp Transporter"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CUSTOMER LOAD REQUESTS GRID */}
      {/* ========================================================= */}
      {activeTab === 'loads' && (
        <div>
          {filteredLoads.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No active cargo load requests found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Be the first to post a cargo load request between Pakistani cities!
              </p>
              <button
                onClick={currentUser ? onPostLoadClick : onOpenAuth}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Post Load Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLoads.map((load) => {
                const cleanPhone = load.customerPhone.replace(/[^0-9+]/g, '');
                const cleanWhatsapp = load.customerWhatsapp.replace(/[^0-9+]/g, '');
                const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum! I saw your cargo load request "${load.cargoName}" (${load.pickupCity} to ${load.destinationCity}) on SargodhaMart. I have a truck available.`
                )}`;

                return (
                  <div
                    key={load.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 transition-all shadow-xs p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Route Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <span className="text-cyan-700">{load.pickupCity}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-emerald-700">{load.destinationCity}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-100 text-cyan-800">
                          {load.loadType}
                        </span>
                      </div>

                      {/* Cargo Title */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 line-clamp-1">{load.cargoName}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">{load.cargoDescription}</p>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Weight</span>
                          <span className="font-black text-slate-900">
                            {(load.totalWeightKg / 1000).toFixed(1)} Tons ({load.totalWeightKg.toLocaleString()} kg)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Truck Needed</span>
                          <span className="font-bold text-amber-900">{load.requiredVehicleType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Loading Date</span>
                          <span className="font-bold text-slate-800">{load.loadingDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Customer Budget</span>
                          <span className="font-black text-emerald-700">
                            {load.budgetPKR ? `Rs. ${load.budgetPKR.toLocaleString()}` : 'Negotiable'}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Customer: <strong className="text-slate-800">{load.customerName}</strong>
                      </div>
                    </div>

                    {/* Transporter actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                      <button
                        onClick={() => onSelectLoad(load)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                      >
                        Details
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. REGISTERED TRANSPORTERS DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'transporters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transporters.map((tr) => (
            <div
              key={tr.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={tr.logoUrl}
                  alt={tr.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 truncate">{tr.name}</h3>
                    {tr.isVerified && (
                      <VerifiedBadge size="sm" />
                    )}
                  </div>
                  {tr.companyName && (
                    <div className="text-xs font-bold text-cyan-800 mt-0.5">{tr.companyName}</div>
                  )}
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{tr.description}</p>
                </div>
              </div>

              {/* Stats & Routes */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-black text-slate-900">{tr.vehicleCount} Trucks</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Fleet Size</div>
                </div>
                <div>
                  <div className="font-black text-amber-600">⭐ {tr.rating} ({tr.reviewsCount})</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Customer Rating</div>
                </div>
                <div>
                  <div className="font-black text-emerald-700">{tr.completedTrips} Trips</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Delivered</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Frequent Operating Routes:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {tr.preferredRoutes.map((route, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold"
                    >
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 truncate">
                  📍 {tr.address || tr.operatingCities.join(', ')}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${tr.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${tr.whatsapp.replace(/[^0-9+]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. QUOTATIONS & BOOKINGS STATUS HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
              <span>Freight Quotations & Active Consignments</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Transparent 10-step dispatch to delivery lifecycle
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-slate-900">{b.cargoName}</span>
                      <span className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">
                      Route: <strong className="text-slate-900">{b.pickupCity} → {b.destinationCity}</strong> • Loading: {b.loadingDate}
                    </div>
                    {b.biltyNumber && (
                      <div className="text-[11px] text-cyan-800 font-mono font-bold mt-0.5">
                        Consignment / Bilty #: {b.biltyNumber}
                      </div>
                    )}
                    {b.statusNotes && (
                      <div className="text-[11px] text-slate-500 mt-1 italic">{b.statusNotes}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Agreed Freight</div>
                      <div className="text-lg font-black text-cyan-800">Rs. {b.agreedPrice.toLocaleString()}</div>
                    </div>
                    {b.customerRating && (
                      <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs text-center">
                        ⭐ {b.customerRating}/5 Rated
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active or past bookings recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MONTHLY TRANSPORTER SUBSCRIPTION PLANS */}
      {/* ========================================================= */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase">
              <DollarSign className="w-3.5 h-3.5 text-amber-700" />
              <span>Transporter Software Subscriptions (ٹرانسپورٹر ماہانہ پلانز)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Affordable Monthly Plans for Truck Owners & Fleets
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Customers and shippers post load requests completely free of charge. Truck owners and transporters subscribe monthly to list vehicles and quote for high-value cargo deals across Pakistan.
            </p>
          </div>

          {/* Current Subscription Status Banner if Logged In */}
          {currentUser && (
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Your Transporter Status:{' '}
                    {mySubscription ? (
                      <span className="text-emerald-700 font-black">
                        Active ({mySubscription.planName})
                      </span>
                    ) : myPendingSubscription ? (
                      <span className="text-amber-700 font-black">
                        Payment Under Admin Review ({myPendingSubscription.planName})
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">No Active Subscription</span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {mySubscription
                      ? `Valid until ${mySubscription.expiryDate} • Capacity: ${myTrucks.length} of ${mySubscription.planSnapshot.maxTruckListings} trucks used`
                      : 'Choose a monthly plan below to list your vehicles and submit quotations.'}
                  </div>
                </div>
              </div>

              {mySubscription && (
                <button
                  onClick={() => setCheckoutPlan(mySubscription.planSnapshot)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-xs"
                >
                  Renew Subscription
                </button>
              )}
            </div>
          )}

          {/* Pricing Grid (Basic PKR 999, Business PKR 1,999, Fleet Partner PKR 3,999) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const isCurrent = mySubscription?.planId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl p-6 border-2 flex flex-col justify-between transition-all shadow-sm ${
                    plan.badge === 'Popular'
                      ? 'border-amber-400 shadow-amber-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        Rs. {plan.price.toLocaleString()}
                        <span className="text-xs text-slate-400 font-normal"> / month</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        30-day billing cycle • Manual bank / wallet verification
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                      <span className="text-amber-800 font-bold">Vehicle Capacity:</span>{' '}
                      <strong className="text-amber-950 font-black">
                        Up to {plan.maxTruckListings} Active {plan.maxTruckListings === 1 ? 'Truck' : 'Trucks'}
                      </strong>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth();
                        } else {
                          setCheckoutPlan(plan);
                        }
                      }}
                      className={`w-full py-3 rounded-2xl font-black text-xs transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : plan.badge === 'Popular'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isCurrent ? 'Renew Current Plan' : `Subscribe to ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed max-w-3xl mx-auto text-center font-medium">
            💡 <strong>Transparency Policy:</strong> Freight charges are paid directly by the customer to the transporter. Sargodha Marketplace collects subscription fees for platform services and is not the recipient of the freight payment. A paid software subscription does not claim to verify or insure individual cargo items.
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MY FREIGHT DASHBOARD (TRANSPORTER & SHIPPER HUB) */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && currentUser && (
        <div className="space-y-6">
          {/* Dashboard Header Banner */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-black text-slate-900">
                  {currentUser.name}'s Freight Dashboard
                </span>
                {mySubscription && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Active Transporter
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Track your posted cargo loads, truck listings, received quotations, and shipment consignments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPostLoadClick}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Package className="w-3.5 h-3.5" /> Post Load (Free)
              </button>
              <button
                onClick={handleOpenTruckPost}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" /> List a Truck
              </button>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">My Listed Trucks</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{myTrucks.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {mySubscription
                  ? `${myTrucks.length} of ${mySubscription.planSnapshot.maxTruckListings} capacity`
                  : '0 of 0 (No Plan)'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">My Load Requests</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{myLoads.length}</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Free Posting</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">My Deals & Bilty</div>
              <div className="text-2xl font-black text-cyan-800 mt-1">{myBookings.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Active & Completed</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Subscription Status</div>
              <div className="text-base font-black text-emerald-700 mt-2">
                {mySubscription ? mySubscription.planName : 'Free Account'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {mySubscription ? `Valid: ${mySubscription.expiryDate}` : 'No active fleet plan'}
              </div>
            </div>
          </div>

          {/* My Listed Trucks List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>My Vehicles ({myTrucks.length})</span>
              </h3>
              <button
                onClick={handleOpenTruckPost}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                + Add Another Truck
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {myTrucks.map((truck) => (
                <div key={truck.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{truck.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {truck.vehicleType} • Legal Payload: {truck.payloadCapacityTons} Tons • Current:{' '}
                      {truck.currentCity}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {truck.status}
                  </span>
                </div>
              ))}

              {myTrucks.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  You have not listed any trucks yet. Click "List Your Truck" to start getting cargo inquiries.
                </div>
              )}
            </div>
          </div>

          {/* My Posted Load Requests List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-600" />
                <span>My Posted Load Requests ({myLoads.length})</span>
              </h3>
              <button
                onClick={onPostLoadClick}
                className="text-xs text-cyan-700 font-bold hover:underline"
              >
                + Post New Load
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {myLoads.map((load) => (
                <div key={load.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{load.cargoName}</div>
                    <div className="text-[11px] text-slate-500">
                      Route: {load.pickupCity} → {load.destinationCity} • Loading: {load.loadingDate}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-100 text-cyan-800">
                    {load.status}
                  </span>
                </div>
              ))}

              {myLoads.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  You have not posted any cargo loads yet. Post a load request free of charge!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCheckoutPlan(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900">
                Monthly Subscription Checkout
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {checkoutPlan.name}
              </h3>
              <div className="text-2xl font-black text-amber-900 mt-1">
                Rs. {checkoutPlan.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ 30 Days</span>
              </div>
            </div>

            {/* Plan Snapshot summary */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900">Included Vehicle Limit:</div>
              <div className="text-slate-700">
                Up to <strong>{checkoutPlan.maxTruckListings} active truck listings</strong>, view eligible shipper loads, and quote nationwide.
              </div>
            </div>

            {/* Manual Payment Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-black text-slate-900">Payment Accounts & Verification:</div>
              <div className="space-y-1 text-slate-700">
                <div>
                  <strong>EasyPaisa:</strong> 03127453108 (Title: Muhammad Akram Tayyab)
                </div>
                <div>
                  <strong>JazzCash:</strong> 03127453108 (Title: Muhammad Akram Tayyab)
                </div>
                <div>
                  <strong>Bank of Punjab:</strong> Sargodha Main Branch | A/C: 03127453108
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic mt-1">
                Transfer exactly Rs. {checkoutPlan.price.toLocaleString()} and enter the 10-12 digit TRX ID below.
              </p>
            </div>

            {subSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Subscription submitted successfully! Administrator review will activate your account shortly.
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method Used
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 outline-none focus:border-amber-500"
                >
                  <option value="EasyPaisa">EasyPaisa (03127453108)</option>
                  <option value="JazzCash">JazzCash (03127453108)</option>
                  <option value="Bank of Punjab">Bank of Punjab (BOP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction ID / TRX ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EP8492019482 or TID..."
                  value={trxIdInput}
                  onChange={(e) => setTrxIdInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Transfer Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutPlan(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20"
                >
                  Submit Payment for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
