import React from 'react';
import { X, Truck, MapPin, ShieldCheck, Phone, MessageCircle, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { TruckListing } from '../types';

interface TruckDetailModalProps {
  truck: TruckListing | null;
  onClose: () => void;
  onBookOrQuote?: (truck: TruckListing) => void;
}

export const TruckDetailModal: React.FC<TruckDetailModalProps> = ({
  truck,
  onClose,
  onBookOrQuote,
}) => {
  if (!truck) return null;

  const cleanPhone = truck.transporterPhone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = truck.transporterWhatsapp.replace(/[^0-9+]/g, '');
  const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Assalam-o-Alaikum! I am contacting you regarding your truck "${truck.title}" on SargodhaMart.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 text-slate-700 hover:text-slate-950 hover:bg-white border border-slate-200 shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Image */}
        <div className="relative h-60 bg-slate-900 overflow-hidden">
          <img
            src={truck.images[0]}
            alt={truck.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-extrabold text-xs uppercase border border-amber-400/40">
              {truck.vehicleType} • {truck.wheelCount} Wheeler
            </span>
            {truck.isVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Transporter
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 px-3 py-2 rounded-xl bg-slate-950/70 backdrop-blur-md text-white text-xs flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Current Station: <strong>{truck.currentCity}</strong>
            </span>
            <span className="text-amber-300 font-bold">
              Legal Payload: {truck.payloadCapacityTons} Tons
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <h2 className="text-lg font-black text-slate-900">{truck.title}</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Fleet Provider: <strong className="text-slate-800">{truck.transporterName}</strong>
            </p>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Body Length</span>
              <span className="font-bold text-slate-800">{truck.bodyLengthFeet} Feet</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Body Type</span>
              <span className="font-bold text-slate-800">{truck.bodyType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Wheel Count</span>
              <span className="font-bold text-slate-800">{truck.wheelCount} Wheeler</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Load Format</span>
              <span className="font-bold text-slate-800">{truck.loadTypeAvailability}</span>
            </div>
          </div>

          {/* Dest Routes */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Confirmed Operating Destinations:</h4>
            <div className="flex gap-1.5 flex-wrap">
              {truck.destinationsServed.map((d, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
                >
                  → {d}
                </span>
              ))}
            </div>
          </div>

          {truck.returnRoutes && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <strong>🔄 Return Load Opportunities:</strong> {truck.returnRoutes.join(', ')}
            </div>
          )}

          {truck.cargoAccepted && (
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase mb-1">Cargo Types Accepted:</h4>
              <p className="text-xs text-slate-600">{truck.cargoAccepted.join(', ')}</p>
            </div>
          )}

          {truck.freightRateDescription && (
            <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950">
              <strong className="block mb-0.5">Indicative Freight Price Guidance:</strong>
              {truck.freightRateDescription}
            </div>
          )}
        </div>

        {/* Footer Contact */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Direct Transporter Contact:
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call Transporter
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
