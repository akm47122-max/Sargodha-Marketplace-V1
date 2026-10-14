import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  ShoppingBag,
  Briefcase,
  Store,
  Sparkles,
  Phone,
  MessageCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  Listing,
  JobPost,
  BusinessShop,
  DigitalSkillProfile,
  District,
  Tehsil,
  AreaLocation,
  City,
} from '../types';

interface NearbySectionProps {
  listings: Listing[];
  jobs: JobPost[];
  shops: BusinessShop[];
  skills: DigitalSkillProfile[];
  districts: District[];
  tehsils: Tehsil[];
  areas: AreaLocation[];
  onSelectListing: (listing: Listing) => void;
  onSelectJob: (job: JobPost) => void;
  onViewShop?: (shop: BusinessShop) => void;
  onSelectSkill?: (skill: DigitalSkillProfile) => void;
}

export const NearbySection: React.FC<NearbySectionProps> = ({
  listings,
  jobs,
  shops,
  skills,
  districts,
  tehsils,
  areas,
  onSelectListing,
  onSelectJob,
  onViewShop,
  onSelectSkill,
}) => {
  const [selectedLocationCity, setSelectedLocationCity] = useState<string>('Sargodha');
  const [selectedSubArea, setSelectedSubArea] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<'all' | 'products' | 'jobs' | 'shops' | 'skills'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // Filter listings by selected city / area (privacy safe: area & city level only, never exact street/home)
  const nearbyListings = listings.filter((l) => {
    if (l.status !== 'published') return false;
    const matchCity = l.city.toLowerCase() === selectedLocationCity.toLowerCase();
    const matchArea = selectedSubArea === 'All' || l.area.toLowerCase().includes(selectedSubArea.toLowerCase());
    const matchPrice = maxPrice > 0 ? l.price <= maxPrice : true;
    return matchCity && matchArea && matchPrice;
  });

  const nearbyJobs = jobs.filter((j) => {
    if (j.status !== 'published') return false;
    const matchCity = j.city.toLowerCase() === selectedLocationCity.toLowerCase();
    const matchArea = selectedSubArea === 'All' || j.area.toLowerCase().includes(selectedSubArea.toLowerCase());
    return matchCity && matchArea;
  });

  const nearbyShops = shops.filter((s) => {
    if (s.status !== 'APPROVED') return false;
    const matchCity = s.city.toLowerCase() === selectedLocationCity.toLowerCase();
    const matchArea = selectedSubArea === 'All' || s.area.toLowerCase().includes(selectedSubArea.toLowerCase());
    return matchCity && matchArea;
  });

  const nearbySkills = skills.filter((sk) => {
    if (sk.status !== 'approved') return false;
    const matchCity = (sk.tehsilName || '').toLowerCase().includes(selectedLocationCity.toLowerCase());
    return matchCity;
  });

  const CITIES_LIST = [
    'Sargodha',
    'Shaheenabad',
    'Sillanwali',
    'Bhalwal',
    'Kot Momin',
    'Bhera',
    'Sahiwal',
    'Shahpur',
    'Khushab',
    'Mianwali',
    'Bhakkar',
    'Faisalabad',
    'Lahore',
    'Rawalpindi',
    'Islamabad',
    'Multan',
    'Karachi'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/20 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> Privacy-Safe Proximity Discovery
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white">
            Nearby Marketplace Listings & Services (قریبی اشتہارات)
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 leading-relaxed">
            Discover verified products, local shops, job opportunities, and talent around your tehsil or city. Exact home addresses are strictly kept confidential for seller safety.
          </p>
        </div>

        {/* Location Selector Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-cyan-300 mb-1">
              Select Your City / District:
            </label>
            <select
              value={selectedLocationCity}
              onChange={(e) => {
                setSelectedLocationCity(e.target.value);
                setSelectedSubArea('All');
              }}
              className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-cyan-400/40 font-bold outline-none text-xs"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-cyan-300 mb-1">
              Filter by Area / Tehsil:
            </label>
            <input
              type="text"
              placeholder="e.g. Satellite Town, Mandi, University Rd..."
              value={selectedSubArea === 'All' ? '' : selectedSubArea}
              onChange={(e) => setSelectedSubArea(e.target.value || 'All')}
              className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-cyan-400/40 font-medium outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-cyan-300 mb-1">
              Max Price Budget (Optional):
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl bg-slate-900/90 text-white border border-cyan-400/40 font-medium outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterCategory === 'all'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Nearby ({nearbyListings.length + nearbyJobs.length + nearbyShops.length + nearbySkills.length})
        </button>

        <button
          onClick={() => setFilterCategory('products')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            filterCategory === 'products'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Products ({nearbyListings.length})</span>
        </button>

        <button
          onClick={() => setFilterCategory('jobs')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            filterCategory === 'jobs'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Jobs ({nearbyJobs.length})</span>
        </button>

        <button
          onClick={() => setFilterCategory('shops')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            filterCategory === 'shops'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Shops ({nearbyShops.length})</span>
        </button>

        <button
          onClick={() => setFilterCategory('skills')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            filterCategory === 'skills'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Digital Skills ({nearbySkills.length})</span>
        </button>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. Products */}
        {(filterCategory === 'all' || filterCategory === 'products') &&
          nearbyListings.map((listing) => (
            <div
              key={`prod-${listing.id}`}
              onClick={() => onSelectListing(listing)}
              className="bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 transition-all shadow-xs hover:shadow-md cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/75 text-white font-black text-xs">
                  Rs. {listing.price.toLocaleString()}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-slate-800 text-[10px] font-bold">
                  {listing.categoryName}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{listing.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                  <span className="truncate">{listing.city} ({listing.area})</span>
                </div>
              </div>
            </div>
          ))}

        {/* 2. Jobs */}
        {(filterCategory === 'all' || filterCategory === 'jobs') &&
          nearbyJobs.map((job) => (
            <div
              key={`job-${job.id}`}
              onClick={() => onSelectJob(job)}
              className="bg-white rounded-3xl border border-blue-200 p-4 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-800">
                  {job.postType === 'need_job' ? 'Mujhe Job Chahiye' : 'Mujhe Banda Chahiye'}
                </span>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-1 mt-1.5">{job.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{job.skills}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-0.5 text-cyan-700 font-bold">
                  <MapPin className="w-3 h-3" /> {job.city}
                </span>
                <span className="font-semibold text-slate-900">{job.salaryOrPayment || 'Negotiable'}</span>
              </div>
            </div>
          ))}

        {/* 3. Shops */}
        {(filterCategory === 'all' || filterCategory === 'shops') &&
          nearbyShops.map((shop) => (
            <div
              key={`shop-${shop.id}`}
              onClick={() => onViewShop && onViewShop(shop)}
              className="bg-white rounded-3xl border border-purple-200 p-4 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">{shop.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-cyan-600" />
                    <span className="truncate">{shop.city} ({shop.area})</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{shop.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
