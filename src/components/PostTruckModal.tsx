import React, { useState } from 'react';
import { X, Truck, MapPin, AlertCircle } from 'lucide-react';
import { TruckListing, UserProfile, VehicleType } from '../types';

interface PostTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitTruck: (truckData: Omit<TruckListing, 'id' | 'status' | 'isVerified' | 'createdAt'>) => void;
}

export const PostTruckModal: React.FC<PostTruckModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitTruck,
}) => {
  const [title, setTitle] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('10-wheeler');
  const [wheelCount, setWheelCount] = useState<number>(10);
  const [bodyType, setBodyType] = useState('High-Sided Rigid Body');
  const [bodyLengthFeet, setBodyLengthFeet] = useState<number>(22);
  const [payloadCapacityTons, setPayloadCapacityTons] = useState<number>(25);

  const [currentCity, setCurrentCity] = useState(currentUser.city || 'Sargodha');
  const [currentArea, setCurrentArea] = useState(currentUser.area || '');
  const [destinationsInput, setDestinationsInput] = useState('Karachi, Lahore, Faisalabad, Multan');
  const [preferredRoutesInput, setPreferredRoutesInput] = useState('Sargodha -> Karachi, Sargodha -> Lahore');
  const [returnRoutesInput, setReturnRoutesInput] = useState('Karachi -> Sargodha (Return Load)');
  const [freightRateDescription, setFreightRateDescription] = useState('Competitive market rates. Negotiable per trip.');
  const [cargoAcceptedInput, setCargoAcceptedInput] = useState('General Goods, Agricultural Produce, Fertilizer, Machinery');

  const [transporterPhone, setTransporterPhone] = useState(currentUser.mobile || '');
  const [transporterWhatsapp, setTransporterWhatsapp] = useState(currentUser.mobile || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentCity.trim()) {
      setError('Please provide truck title and current city.');
      return;
    }

    const destinations = destinationsInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const routes = preferredRoutesInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const returnRoutes = returnRoutesInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const cargo = cargoAcceptedInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSubmitTruck({
      transporterId: 1,
      userId: currentUser.id,
      transporterName: currentUser.name,
      transporterPhone: transporterPhone.trim() || currentUser.mobile,
      transporterWhatsapp: transporterWhatsapp.trim() || currentUser.mobile,
      title: title.trim(),
      vehicleType,
      wheelCount: Number(wheelCount) || 6,
      bodyType,
      bodyLengthFeet: Number(bodyLengthFeet) || 16,
      payloadCapacityTons: Number(payloadCapacityTons) || 10,
      currentCity: currentCity.trim(),
      currentArea: currentArea.trim() || undefined,
      pickupAreasServed: [currentCity.trim()],
      destinationsServed: destinations.length > 0 ? destinations : ['Karachi', 'Lahore'],
      preferredRoutes: routes.length > 0 ? routes : [`${currentCity} -> Lahore`],
      returnRoutes: returnRoutes.length > 0 ? returnRoutes : undefined,
      loadTypeAvailability: 'BOTH',
      cargoAccepted: cargo.length > 0 ? cargo : ['General Freight'],
      availableDate: 'Ready for loading',
      freightRateDescription,
      images: [
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-600 flex items-center justify-center font-black">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">List Available Truck (ٹرک شامل کریں)</h2>
            <p className="text-xs text-slate-500 font-medium">
              Register your vehicle specifications and active Pakistani routes to receive customer cargo requests
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Truck Title / Listing Description</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10-Wheeler 22ft Hino (25 Ton Legal Capacity) - Karachi & Lahore"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                >
                  <option value="Pickup">Pickup</option>
                  <option value="Shehzore">Shehzore</option>
                  <option value="Mazda">Mazda</option>
                  <option value="6-wheeler">6-wheeler</option>
                  <option value="10-wheeler">10-wheeler</option>
                  <option value="14-wheeler">14-wheeler</option>
                  <option value="18-wheeler">18-wheeler Multi-Axle</option>
                  <option value="Container truck">Container truck</option>
                  <option value="Refrigerated truck">Refrigerated truck</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Wheel Count</label>
                <input
                  type="number"
                  value={wheelCount}
                  onChange={(e) => setWheelCount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Legal Payload (Tons)</label>
                <input
                  type="number"
                  value={payloadCapacityTons}
                  onChange={(e) => setPayloadCapacityTons(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Current Station & Served Routes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Current Base City</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Sargodha, Sillanwali"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Destinations Served (Comma separated)</label>
                <input
                  type="text"
                  value={destinationsInput}
                  onChange={(e) => setDestinationsInput(e.target.value)}
                  placeholder="Karachi, Lahore, Faisalabad, Rawalpindi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Return-Load Opportunities (Return Routes)</label>
              <input
                type="text"
                value={returnRoutesInput}
                onChange={(e) => setReturnRoutesInput(e.target.value)}
                placeholder="Karachi -> Sargodha (Return Load)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/25"
            >
              List My Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
