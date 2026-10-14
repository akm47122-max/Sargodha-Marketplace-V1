import React, { useState } from 'react';
import { X, Package, MapPin, Calendar, DollarSign, Phone, MessageCircle, ArrowRight, Send, Check } from 'lucide-react';
import { LoadRequest, UserProfile, FreightQuotation } from '../types';

interface LoadDetailModalProps {
  load: LoadRequest | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmitQuotation?: (quotationData: Omit<FreightQuotation, 'id' | 'createdAt'>) => void;
}

export const LoadDetailModal: React.FC<LoadDetailModalProps> = ({
  load,
  currentUser,
  onClose,
  onSubmitQuotation,
}) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quotePrice, setQuotePrice] = useState<number>(load?.budgetPKR || 45000);
  const [pickupDate, setPickupDate] = useState(load?.loadingDate || '');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [quoteSubmittedMsg, setQuoteSubmittedMsg] = useState(false);

  if (!load) return null;

  const cleanPhone = load.customerPhone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = load.customerWhatsapp.replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Assalam-o-Alaikum! I saw your load request "${load.cargoName}" (${load.pickupCity} to ${load.destinationCity}) on SargodhaMart.`
  )}`;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (onSubmitQuotation) {
      onSubmitQuotation({
        loadRequestId: load.id,
        transporterId: 1,
        transporterUserId: currentUser.id,
        transporterName: currentUser.name,
        transporterPhone: currentUser.mobile,
        freightPrice: Number(quotePrice) || 0,
        currency: 'PKR',
        estimatedPickupDate: pickupDate,
        estimatedDeliveryDate: deliveryDate || 'Within 24 Hours',
        includedServices: 'Certified driver, fuel, toll taxes, safety ropes & tarpaulin',
        loadingUnloadingIncluded: false,
        paymentTerms: '50% loading advance, 50% upon safe arrival & bilty clearance',
        validUntil: 'Within 3 days',
        notes: notes.trim() || undefined,
        status: 'PENDING',
      });
      setQuoteSubmittedMsg(true);
      setTimeout(() => {
        setQuoteSubmittedMsg(false);
        setShowQuoteForm(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <span className="text-cyan-700">{load.pickupCity}</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
              <span className="text-emerald-700">{load.destinationCity}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-cyan-100 text-cyan-800">
              {load.loadType} • {load.status.toUpperCase()}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900">{load.cargoName}</h2>
            <p className="text-xs text-slate-600 mt-1">{load.cargoDescription}</p>
          </div>

          {/* Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Weight</span>
              <span className="font-black text-slate-900">{(load.totalWeightKg / 1000).toFixed(1)} Tons</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Needed</span>
              <span className="font-bold text-slate-800">{load.requiredVehicleType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Loading Date</span>
              <span className="font-bold text-slate-800">{load.loadingDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Budget</span>
              <span className="font-black text-emerald-700">
                {load.budgetPKR ? `Rs. ${load.budgetPKR.toLocaleString()}` : 'Negotiable'}
              </span>
            </div>
          </div>

          {/* Customer info */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div>
              <span className="font-bold">Customer:</span> {load.customerName}
              {load.pickupArea && <span className="text-slate-600 block text-[11px]">Pickup Area: {load.pickupArea}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${cleanPhone}`}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Call
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Submit Quotation Section */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100">
              {!showQuoteForm ? (
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Freight Quotation (کرایہ کوٹیشن بھیجیں)</span>
                </button>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Transporter Freight Quotation
                  </h4>

                  {quoteSubmittedMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Quotation submitted successfully to customer!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Total Freight Price (PKR)</label>
                      <input
                        type="number"
                        value={quotePrice}
                        onChange={(e) => setQuotePrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold outline-none text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Guaranteed Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium outline-none text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Notes / Terms</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. 10-wheeler ready for immediate loading with weather protection"
                      rows={2}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white outline-none text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQuoteForm(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs"
                    >
                      Confirm Quotation
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
