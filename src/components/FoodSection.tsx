import React, { useState } from 'react';
import {
  Utensils,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Clock,
  Sparkles,
  Tag,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShoppingBag,
  Flame,
  ThumbsUp,
  Award,
  Filter,
  X,
  PlusCircle,
  ShieldCheck,
  Store,
} from 'lucide-react';
import {
  FoodDealCategory,
  FoodDeal,
  RestaurantProfile,
  DigitalCoupon,
  RestaurantReview,
  UserProfile,
  FoodMenuItem,
} from '../types';
import {
  INITIAL_FOOD_CATEGORIES,
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_DEALS,
  INITIAL_DIGITAL_COUPONS as INITIAL_FOOD_COUPONS,
  INITIAL_RESTAURANT_REVIEWS,
} from '../data/foodDealsData';
import { VerifiedBadge } from './VerifiedBadge';

interface FoodSectionProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onPostFoodClick: () => void;
}

export const FoodSection: React.FC<FoodSectionProps> = ({
  currentUser,
  onOpenAuth,
  onPostFoodClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDiningType, setSelectedDiningType] = useState<'ALL' | 'DELIVERY' | 'DINE_IN' | 'TAKEAWAY' | 'DEALS' | 'TOP_RATED'>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');

  // Interactive Coupon State
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Modals
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState<RestaurantProfile | null>(null);
  const [selectedRestaurantForReview, setSelectedRestaurantForReview] = useState<RestaurantProfile | null>(null);

  // Reviews state with localStorage persistence
  const [foodReviews, setFoodReviews] = useState<RestaurantReview[]>(() => {
    const saved = localStorage.getItem('sargodha_food_reviews');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_REVIEWS;
  });

  // Review Form state
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerPhone, setReviewerPhone] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter restaurants
  const filteredRestaurants = INITIAL_RESTAURANTS.filter((rest) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rest.name.toLowerCase().includes(q);
      const matchDesc = rest.description.toLowerCase().includes(q);
      const matchArea = rest.area.toLowerCase().includes(q);
      const matchMenu = rest.menuItems?.some((m) => m.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchArea && !matchMenu) return false;
    }

    // Category
    if (selectedCategory !== 'ALL') {
      if (!rest.foodCategories.includes(selectedCategory)) return false;
    }

    // Dining type
    if (selectedDiningType === 'TOP_RATED' && rest.rating < 4.7) return false;

    // Area
    if (selectedArea !== 'ALL') {
      if (!rest.area.toLowerCase().includes(selectedArea.toLowerCase()) && !rest.city.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Filter deals
  const deals = INITIAL_FOOD_DEALS.filter((d) => {
    if (selectedCategory !== 'ALL' && d.categoryName !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!d.title.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurantForReview) return;
    if (!reviewComment.trim()) return;

    const newRev: RestaurantReview = {
      id: Date.now(),
      restaurantId: selectedRestaurantForReview.id,
      userName: currentUser ? currentUser.name : (reviewerName.trim() || 'Food Lover'),
      userPhone: reviewerPhone.trim() || '03001234567',
      rating: reviewStars,
      comment: reviewComment.trim(),
      isVerifiedCustomer: true,
      status: 'APPROVED',
      createdAt: 'Just now',
    };

    const updated = [newRev, ...foodReviews];
    setFoodReviews(updated);
    localStorage.setItem('sargodha_food_reviews', JSON.stringify(updated));

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setSelectedRestaurantForReview(null);
      setReviewComment('');
    }, 2000);
  };

  const areasList = [
    'ALL',
    'Club Road',
    'Satellite Town',
    'University Road',
    'Kutchery Bazaar',
    'Fatima Jinnah Road',
    'Sillanwali',
    'Shaheenabad',
  ];

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 p-6 md:p-10 text-white shadow-xl shadow-orange-600/20">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-9xl">
          🍔
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Sargodha Food Hub · سرگودھا کے لذیذ کھانے اور ریسٹورنٹ</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Order Famous Sargodha Food & Exclusive Deals!
          </h1>
          <p className="text-sm md:text-base text-amber-100 font-medium leading-relaxed">
            Authentic taste of Sargodha: Crispy Zingers, Shinwari Desi Karahi, Sillanwali Samnak Sohan Halwa, Shaheenabad Biryani, and fresh bakery deals with verified customer ratings and direct WhatsApp delivery!
          </p>

          {/* Search Box */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search food, burger, karahi, sohan halwa, pizza, or restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs md:text-sm font-semibold placeholder:text-slate-400 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={onPostFoodClick}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Restaurant / Food Stall</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Selector Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Food Categories (کھانوں کی کیٹیگریز)</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {INITIAL_FOOD_CATEGORIES.length} Categories Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🍽️ All Food (تمام کھانے)
          </button>

          {INITIAL_FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dining Type & Area Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        {/* Dining Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          <button
            onClick={() => setSelectedDiningType('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedDiningType === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setSelectedDiningType('TOP_RATED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              selectedDiningType === 'TOP_RATED'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3 h-3 fill-current" /> Top Rated (4.7+)
          </button>
        </div>

        {/* Area dropdown */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
          >
            {areasList.map((a) => (
              <option key={a} value={a}>
                {a === 'ALL' ? '📍 All Sargodha Areas' : `📍 ${a}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Hot Deals of the Day Carousel / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Deal of the Day & Vouchers (آج کی اسپیشل ڈیلز)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Limited-time discounts on family platters, burgers, and karahi in Sargodha
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            ⚡ Hot Discounts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.slice(0, 3).map((deal) => {
            const origPrice = deal.originalPrice || Math.round(deal.offerPrice * 1.25);
            const discPct = deal.discountPercentage || Math.round(((origPrice - deal.offerPrice) / origPrice) * 100);
            const dealImage = deal.images && deal.images.length > 0 ? deal.images[0] : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600';
            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={dealImage}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {discPct}% OFF
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold">
                    {deal.categoryName}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-[11px] font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <Store className="w-3 h-3 text-amber-600" />
                      <span>{deal.restaurantName}</span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-700 line-clamp-1 transition-colors mb-1">
                      {deal.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  <div>
                    {/* Price & Savings */}
                    <div className="flex items-baseline justify-between mb-3 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-lg font-black text-emerald-600">
                          Rs. {deal.offerPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-semibold ml-2">
                          Rs. {origPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        Save Rs. {(origPrice - deal.offerPrice).toLocaleString()}
                      </span>
                    </div>

                    {/* WhatsApp Order Action */}
                    <a
                      href={`https://wa.me/923127453108?text=${encodeURIComponent(`Salam! I want to order the deal "${deal.title}" (Rs. ${deal.offerPrice}) from ${deal.restaurantName} on SargodhaMart.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order Deal on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Digital Vouchers & Promo Codes */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h4 className="font-black text-slate-900 text-base">
              Digital Discount Vouchers (ڈسکاؤنٹ کوڈز)
            </h4>
          </div>
          <span className="text-xs font-bold text-amber-800">
            Show code or send on WhatsApp to claim
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INITIAL_FOOD_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `Rs. ${coupon.discountValue} OFF`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Expires {coupon.expiryDate}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 text-xs mb-1">
                  {coupon.title}
                </h5>
                <p className="text-[11px] text-slate-500 mb-2">
                  {coupon.restaurantName} · Min order Rs. {coupon.minOrderValue}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCoupon === coupon.code ? (
                    <>
                      <Check className="w-3 h-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Restaurants Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-600" />
              <span>Sargodha Restaurants & Home Chefs (ریسٹورنٹس)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredRestaurants.length} verified dining spots in Sargodha
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-black text-slate-800 text-base">
              No restaurants match your search or filter
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try resetting your search query or choosing "All Food" to view all Sargodha food listings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedDiningType('ALL');
                setSelectedArea('ALL');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors cursor-pointer"
            >
              Reset Filters (فلٹر صاف کریں)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((rest) => {
              const reviewsForThis = foodReviews.filter((r) => r.restaurantId === rest.id);
              const avgScore = reviewsForThis.length > 0
                ? (reviewsForThis.reduce((s, r) => s + r.rating, 0) / reviewsForThis.length).toFixed(1)
                : rest.rating.toFixed(1);

              return (
                <div
                  key={rest.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Cover & Logo */}
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={rest.coverImage}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Verified Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {rest.isVerified && (
                        <div className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <ShieldCheck className="w-3 h-3" /> Verified Restaurant
                        </div>
                      )}
                      {rest.isSpotlight && (
                        <div className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                          Spotlight
                        </div>
                      )}
                    </div>

                    {/* Logo Overlay */}
                    <div className="absolute -bottom-3 right-4 w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                      <img src={rest.logo} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 pt-4 flex flex-col justify-between flex-1">
                    <div>
                      {/* Name & Area */}
                      <h4 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors mb-1 pr-12">
                        {rest.name}
                      </h4>

                      <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{rest.address}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {rest.description}
                      </p>

                      {/* Food category pills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {rest.foodCategories.slice(0, 3).map((fc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold"
                          >
                            {fc}
                          </span>
                        ))}
                      </div>

                      {/* Rating & Reviews row */}
                      <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-amber-500 font-black">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{avgScore} / 5</span>
                          <span className="text-slate-400 font-semibold text-[11px] ml-1">
                            ({reviewsForThis.length + rest.reviewCount} Reviews)
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedRestaurantForReview(rest)}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                        >
                          Write Customer Review
                        </button>
                      </div>

                      {/* Timing & Contact */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-4">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{rest.openingHours}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRestaurantForMenu(rest)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>View Menu</span>
                      </button>

                      <a
                        href={`https://wa.me/92${rest.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`Salam! I saw "${rest.name}" on SargodhaMart. Can I see your current menu & order food?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
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

      {/* 7. Full Menu Modal */}
      {selectedRestaurantForMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-2xl my-8">
            <button
              onClick={() => setSelectedRestaurantForMenu(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/90 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRestaurantForMenu.logo}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md bg-white"
                />
                <div>
                  <h3 className="text-xl font-black">{selectedRestaurantForMenu.name}</h3>
                  <p className="text-xs text-amber-100 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {selectedRestaurantForMenu.address}
                  </p>
                  <p className="text-[11px] text-amber-200 mt-1">
                    📞 {selectedRestaurantForMenu.phone} · 🕒 {selectedRestaurantForMenu.openingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Featured Dishes & Special Menu (خاص کھانے)</span>
              </h4>

              <div className="space-y-3">
                {selectedRestaurantForMenu.menuItems?.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-slate-900 text-sm">{item.name}</h5>
                          {item.isSpecial && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                              Chef Special
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <span className="text-base font-black text-emerald-600">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <a
                        href={`https://wa.me/92${selectedRestaurantForMenu.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`Salam! I want to order "${item.name}" (Rs. ${item.price}) from ${selectedRestaurantForMenu.name} on SargodhaMart.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Order via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Fresh preparation · Fast delivery in Sargodha
              </span>
              <button
                onClick={() => setSelectedRestaurantForMenu(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Restaurant Review Submission Modal */}
      {selectedRestaurantForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-2xl p-6">
            <button
              onClick={() => setSelectedRestaurantForReview(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h4 className="text-base font-black text-slate-900">
                Rate & Review {selectedRestaurantForReview.name}
              </h4>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Help Sargodha foodies know about the taste, quality, packing, and service of this restaurant!
            </p>

            {reviewSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-black text-emerald-900 text-base">Review Published!</h5>
                <p className="text-xs text-emerald-700">
                  Thank you for rating {selectedRestaurantForReview.name}. Your review is now visible to customers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                {/* Star rating */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Your Rating (ریٹنگ منتخب کریں) *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setReviewStars(s)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star className={`w-7 h-7 ${reviewStars >= s ? 'fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg">
                      {reviewStars === 5 ? '5 Stars - Outstanding!' : `${reviewStars} Stars`}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (آپ کا نام) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asad Farooq"
                    value={currentUser ? currentUser.name : reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / City (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 03001234567 · Satellite Town Sargodha"
                    value={reviewerPhone}
                    onChange={(e) => setReviewerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Honest Food Review (کھانے کے بارے میں ریویو) *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the taste, crispiness, delivery timing, packing..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRestaurantForReview(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors"
                  >
                    Submit Customer Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
