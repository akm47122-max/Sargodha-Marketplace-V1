import React, { useState } from 'react';
import { X, Package, Truck, MapPin, Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LoadRequest, UserProfile, VehicleType } from '../types';

interface PostLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitLoad: (loadData: Omit<LoadRequest, 'id' | 'status' | 'createdAt'>) => void;
}

export const PostLoadModal: React.FC<PostLoadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitLoad,
}) => {
  const [pickupProvince, setPickupProvince] = useState('Punjab');
  const [pickupCity, setPickupCity] = useState(currentUser.city || 'Sargodha');
  const [pickupArea, setPickupArea] = useState(currentUser.area || '');

  const [destinationProvince, setDestinationProvince] = useState('Sindh');
  const [destinationCity, setDestinationCity] = useState('Karachi');
  const [destinationArea, setDestinationArea] = useState('');

  const [cargoName, setCargoName] = useState('');
  const [cargoDescription, setCargoDescription] = useState('');
  const [totalWeightKg, setTotalWeightKg] = useState<number>(5000);
  const [packageCount, setPackageCount] = useState<number>(100);
  const [cargoCategory, setCargoCategory] = useState('Agricultural Produce');
  const [isFragile, setIsFragile] = useState(false);
  const [isTemperatureControlled, setIsTemperatureControlled] = useState(false);

  const [requiredVehicleType, setRequiredVehicleType] = useState<VehicleType>('10-wheeler');
  const [requiredMinCapacityTons, setRequiredMinCapacityTons] = useState<number>(10);
  const [loadType, setLoadType] = useState<'FTL' | 'PTL'>('FTL');

  const [loadingDate, setLoadingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [budgetPKR, setBudgetPKR] = useState<number>(45000);
  const [isBudgetNegotiable, setIsBudgetNegotiable] = useState(true);
  const [loadingUnloadingCostBy, setLoadingUnloadingCostBy] = useState<'CUSTOMER' | 'TRANSPORTER' | 'SHARED'>('CUSTOMER');

  const [customerPhone, setCustomerPhone] = useState(currentUser.mobile || '');
  const [customerWhatsapp, setCustomerWhatsapp] = useState(currentUser.mobile || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cargoName.trim() || !pickupCity.trim() || !destinationCity.trim()) {
      setError('Please provide cargo name, pickup city, and destination city.');
      return;
    }

    onSubmitLoad({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: customerPhone.trim() || currentUser.mobile,
      customerWhatsapp: customerWhatsapp.trim() || currentUser.mobile,
      pickupProvince,
      pickupCity: pickupCity.trim(),
      pickupArea: pickupArea.trim() || undefined,
      destinationProvince,
      destinationCity: destinationCity.trim(),
      destinationArea: destinationArea.trim() || undefined,
      cargoName: cargoName.trim(),
      cargoDescription: cargoDescription.trim(),
      totalWeightKg: Number(totalWeightKg) || 1000,
      packageCount: Number(packageCount) || undefined,
      cargoCategory,
      isFragile,
      isTemperatureControlled,
      requiredVehicleType,
      requiredMinCapacityTons: Number(requiredMinCapacityTons) || 1,
      loadType,
      truckCountRequired: 1,
      loadingDate,
      budgetPKR: Number(budgetPKR) || undefined,
      isBudgetNegotiable,
      loadingUnloadingCostBy,
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
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Post Load Request (مال بھیجنے کی درخواست)</h2>
            <p className="text-xs text-slate-500 font-medium">
              Publish your cargo shipment details across Pakistan so transporters can submit freight quotations
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Route */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Origin & Destination Route
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Pickup City</label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  placeholder="e.g. Sargodha, Sillanwali, Bhalwal"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Destination City</label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="e.g. Karachi, Lahore, Faisalabad, Rawalpindi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Cargo Details */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" /> Cargo & Goods Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Cargo Name</label>
                <input
                  type="text"
                  value={cargoName}
                  onChange={(e) => setCargoName(e.target.value)}
                  placeholder="e.g. Kinnow Crates, Cotton Bales, Wanda"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Total Weight (Kilograms)</label>
                <input
                  type="number"
                  value={totalWeightKg}
                  onChange={(e) => setTotalWeightKg(Number(e.target.value))}
                  placeholder="e.g. 10000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Cargo Description / Special Instructions</label>
              <textarea
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                placeholder="Number of packages, packaging type, fragile handling notes..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          </div>

          {/* 3. Truck Specifications Needed */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-600" /> Truck Requirement & Budget
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Required Truck Type</label>
                <select
                  value={requiredVehicleType}
                  onChange={(e) => setRequiredVehicleType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                >
                  <option value="Shehzore">Shehzore (up to 3.5 Tons)</option>
                  <option value="Mazda">Mazda (up to 7 Tons)</option>
                  <option value="6-wheeler">6-wheeler (up to 12 Tons)</option>
                  <option value="10-wheeler">10-wheeler (up to 25 Tons)</option>
                  <option value="14-wheeler">14-wheeler (up to 35 Tons)</option>
                  <option value="18-wheeler">18-wheeler Multi-Axle</option>
                  <option value="Container truck">Container truck</option>
                  <option value="Refrigerated truck">Refrigerated truck</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Loading Date</label>
                <input
                  type="date"
                  value={loadingDate}
                  onChange={(e) => setLoadingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Budget (PKR)</label>
                <input
                  type="number"
                  value={budgetPKR}
                  onChange={(e) => setBudgetPKR(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-amber-500 font-medium text-xs"
                />
              </div>
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
              Publish Load Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
