import React from 'react';
import { Phone, MessageCircle, Heart, MapPin, Sparkles, Eye, ShieldCheck, Share2, Layers, Check, User, Star } from 'lucide-react';
import { Listing } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface ProductCardProps {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: () => void;
  onShare?: (listing: Listing, e: React.MouseEvent) => void;
  isCompared?: boolean;
  onToggleCompare?: (listing: Listing, e: React.MouseEvent) => void;
  onTrackCallClick?: (listingId: number) => void;
  onTrackWhatsAppClick?: (listingId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  listing,
  isFavorite,
  onToggleFavorite,
  onClick,
  onShare = () => {},
  isCompared = false,
  onToggleCompare = () => {},
  onTrackCallClick = () => {},
  onTrackWhatsAppClick = () => {},
}) => {
  const isPrivate = listing.sellerContactPrivacy === 'HIDE_PHONE';
  const waOnly = listing.sellerContactPrivacy === 'WHATSAPP_ONLY';

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/95 backdrop-blur-md border border-cyan-200/90 rounded-2xl overflow-hidden hover:border-cyan-400 hover:shadow-[0_12px_30px_rgba(6,182,212,0.2)] transition-all cursor-pointer flex flex-col h-full transform hover:-translate-y-1 shadow-sm"
    >
      {/* Image Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

        {/* Featured / Promoted Badges */}
        {listing.isPromoted ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/30 z-10">
            <span>📣</span>
            SPONSORED
          </div>
        ) : listing.isFeatured ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/30 z-10">
            <span>⭐</span>
            PROMOTED
          </div>
        ) : null}

        {/* Blue Verified Badge Overlay on Image */}
        {listing.sellerVerified && (
          <div
            className={`absolute ${
              listing.isPromoted || listing.isFeatured ? 'top-10' : 'top-2.5'
            } left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-600/95 text-white shadow-md shadow-blue-600/30 backdrop-blur-xs`}
            title="Verified Seller by SargodhaMart"
          >
            <svg className="w-2.5 h-2.5 fill-current text-white shrink-0" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Verified</span>
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
          {listing.condition}
        </div>

        {/* Photos Count */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
          📷 {listing.images.length}/3
        </div>

        {/* Top Right Action Buttons: Compare, Share, Favorite */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
          {/* Add to Compare */}
          <button
            onClick={(e) => onToggleCompare(listing, e)}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
              isCompared
                ? 'bg-cyan-600 border-cyan-700 text-white shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200 shadow-xs hover:text-cyan-700'
            }`}
            title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
          </button>

          {/* Share */}
          <button
            onClick={(e) => onShare(listing, e)}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center border border-slate-200 shadow-xs transition-all hover:text-cyan-700"
            title="Share Product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="Add to Favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {listing.salePrice ? (
                <>
                  <div className="text-lg font-black text-emerald-600">
                    <span className="text-xs font-bold mr-0.5">Rs.</span>
                    {listing.salePrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 line-through">
                    Rs. {listing.price.toLocaleString()}
                  </div>
                </>
              ) : (
                <div className="text-lg font-black text-slate-900">
                  <span className="text-cyan-700 text-xs font-bold mr-1">Rs.</span>
                  {listing.price.toLocaleString()}
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>{listing.city}</span>
            </div>
          </div>

          {/* Seller Name & Verified Badge Row */}
          <div className="flex items-center justify-between gap-1 mb-2 text-xs">
            <div className="flex items-center gap-1 text-slate-600 font-medium truncate min-w-0">
              <User className="w-3 h-3 text-cyan-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate text-[11px]">
                {listing.sellerName || 'Local Seller'}
              </span>
            </div>
            {listing.sellerVerified ? (
              <VerifiedBadge size="xs" />
            ) : (
              <span className="text-[9px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                Community
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-cyan-700 line-clamp-2 transition-colors mb-1.5">
            {listing.title}
          </h3>

          {/* Clothing Specific Snippets */}
          {(listing.clothingSizes || listing.clothingVarieties || listing.isWholesaleAvailable) && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2 text-[10px]">
              {listing.clothingSizes && listing.clothingSizes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-fuchsia-50 text-fuchsia-800 font-bold border border-fuchsia-200">
                  Sizes: {listing.clothingSizes.slice(0, 3).join(', ')}{listing.clothingSizes.length > 3 ? '...' : ''}
                </span>
              )}
              {listing.isWholesaleAvailable && (
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-extrabold border border-amber-200">
                  Wholesale
                </span>
              )}
            </div>
          )}

          {/* Category, Rating & Views */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 font-medium">
            <span className="truncate">{listing.categoryName}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-0.5 text-amber-500 font-black text-[11px]" title="Customer Rating">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{listing.rating ? listing.rating.toFixed(1) : '5.0'}</span>
                {listing.reviewCount ? (
                  <span className="text-slate-400 font-normal text-[10px]">({listing.reviewCount})</span>
                ) : null}
              </span>
              <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                <Eye className="w-3 h-3 text-cyan-600" /> {listing.views}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Call & WhatsApp with Contact Privacy enforcement */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {isPrivate ? (
            <div className="w-full py-1.5 px-2 rounded-xl text-[11px] text-center text-slate-400 bg-slate-50 border border-slate-100 font-medium italic">
              🔒 Contact Details Private
            </div>
          ) : (
            <>
              {!waOnly && (
                <a
                  href={`tel:${listing.sellerPhone}`}
                  onClick={() => onTrackCallClick(listing.id)}
                  className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Call</span>
                </a>
              )}
              {(() => {
                const digits = listing.sellerPhone.replace(/\D/g, '');
                const waNum = digits.startsWith('0') ? '92' + digits.slice(1) : (digits.startsWith('92') ? digits : '92' + digits);
                return (
                  <a
                    href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Salam! I saw your listing "${listing.title}" on SargodhaMart. Is it still available?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onTrackWhatsAppClick(listing.id)}
                    className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
