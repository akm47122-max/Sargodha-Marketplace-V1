import React, { useState } from 'react';
import {
  Trophy,
  Star,
  ShieldCheck,
  MapPin,
  Package,
  UserCheck,
  UserPlus,
  Store,
  Phone,
  MessageCircle,
  ExternalLink,
  Award
} from 'lucide-react';
import { UserProfile, BusinessShop, Listing, SellerReview, SellerFollow } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface TopSellersSectionProps {
  sellers: UserProfile[];
  shops: BusinessShop[];
  listings: Listing[];
  reviews: SellerReview[];
  currentUser: UserProfile | null;
  follows?: SellerFollow[];
  onToggleFollow?: (targetType: 'SELLER' | 'SHOP', targetId: number, targetName: string) => void;
  onViewShop?: (shop: BusinessShop) => void;
  onOpenAuth: () => void;
}

export const TopSellersSection: React.FC<TopSellersSectionProps> = ({
  sellers,
  shops,
  listings,
  reviews,
  currentUser,
  follows = [],
  onToggleFollow,
  onViewShop,
  onOpenAuth,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'shops'>('all');

  // Compute legitimate organic reputation score (ratings, genuine review count, active listings, verified status)
  // Strict rule: Paid promotion does NOT artificially boost organic top seller rank
  const scoredSellers = sellers
    .filter((s) => s.activationStatus === 'active')
    .map((seller) => {
      const sellerListings = listings.filter((l) => l.userId === seller.id && l.status === 'published');
      const sellerReviews = reviews.filter((r) => r.sellerId === seller.id && r.status === 'published');
      const avgRating =
        sellerReviews.length > 0
          ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length
          : 5.0;
      const associatedShop = shops.find((sh) => sh.userId === seller.id);

      // Score weight: reviews count * 10 + active listings * 5 + (isVerified ? 60 : 0) + (avgRating * 20)
      const organicScore =
        sellerReviews.length * 15 +
        sellerListings.length * 8 +
        ((seller.isVerified || associatedShop?.isVerified) ? 60 : 0) +
        avgRating * 20;

      const isFollowed = follows.some(
        (f) => f.userId === currentUser?.id && f.targetType === 'SELLER' && f.targetId === seller.id
      );

      return {
        ...seller,
        sellerListingsCount: sellerListings.length,
        sellerReviewsCount: sellerReviews.length,
        avgRating: Number(avgRating.toFixed(1)),
        associatedShop,
        organicScore,
        isFollowed,
      };
    })
    .sort((a, b) => b.organicScore - a.organicScore);

  const filtered = scoredSellers.filter((s) => {
    if (filterType === 'verified') return s.isVerified || s.associatedShop?.isVerified;
    if (filterType === 'shops') return !!s.associatedShop;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Organic Trust & Reputation Leaderboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Top Sellers & Verified Businesses (اعلیٰ درجہ کے فروخت کنندگان)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Ranked strictly by customer reviews, product inventory, and genuine marketplace reliability. Paid promotions are strictly separated from organic reputation rankings.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Top Sellers
          </button>
          <button
            onClick={() => setFilterType('verified')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'verified'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Verified Only
          </button>
          <button
            onClick={() => setFilterType('shops')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'shops'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            With Business Shop
          </button>
        </div>
      </div>

      {/* Sellers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((seller, index) => {
          const rank = index + 1;
          const cleanPhone = seller.mobile.replace(/[^0-9+]/g, '');

          return (
            <div
              key={seller.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 transition-all shadow-xs hover:shadow-md p-5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Badge for Rank */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                    rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : rank === 2
                      ? 'bg-slate-200 text-slate-800'
                      : rank === 3
                      ? 'bg-amber-700/20 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Award className="w-3 h-3" /> #{rank} Top Rank
                </span>
              </div>

              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="min-w-0 pr-16">
                    <h3 className="font-black text-sm text-slate-900 truncate">{seller.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-600" />
                      <span className="truncate">{seller.city} ({seller.area})</span>
                    </div>
                    {(seller.isVerified || seller.associatedShop?.isVerified) && (
                      <div className="mt-1">
                        <VerifiedBadge size="xs" tooltip="Verified Seller by SargodhaMart Administrators" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Score & Inventory Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs mb-3">
                  <div>
                    <div className="font-black text-slate-900">{seller.sellerListingsCount}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Products</div>
                  </div>
                  <div>
                    <div className="font-black text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {seller.avgRating}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{seller.sellerReviewsCount} Reviews</div>
                  </div>
                  <div>
                    <div className="font-black text-cyan-800">{seller.joinedDate}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Member</div>
                  </div>
                </div>

                {seller.associatedShop && (
                  <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-100 text-[11px] text-cyan-900 flex items-center justify-between mb-3">
                    <span className="truncate font-semibold flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-cyan-700" /> {seller.associatedShop.name}
                    </span>
                    {onViewShop && (
                      <button
                        onClick={() => onViewShop(seller.associatedShop!)}
                        className="text-[10px] text-cyan-800 font-black hover:underline shrink-0"
                      >
                        View Shop
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: Follow + Direct Contact */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else if (onToggleFollow) onToggleFollow('SELLER', seller.id, seller.name);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    seller.isFollowed
                      ? 'bg-rose-50 text-rose-700 border border-rose-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{seller.isFollowed ? 'Following' : 'Follow'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
                    title="Call Seller"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                    title="WhatsApp Seller"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
