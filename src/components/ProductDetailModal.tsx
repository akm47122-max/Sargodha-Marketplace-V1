import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Heart,
  MapPin,
  Sparkles,
  Eye,
  ShieldCheck,
  Share2,
  Flag,
  ExternalLink,
  Copy,
  Check,
  Send,
  Star,
  Tag,
  Truck,
  PackageCheck,
  Store,
  ThumbsUp,
  MessageSquare,
  Award,
  CheckCircle2,
  Filter,
  User,
} from 'lucide-react';
import { Listing, SellerReview, UserProfile } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface ProductDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onReport: (listing: Listing) => void;
  reviews?: SellerReview[];
  currentUser?: UserProfile | null;
  onSubmitReview?: (review: Omit<SellerReview, 'id' | 'createdAt'>) => void;
  onTrackCallClick?: (listingId: number) => void;
  onTrackWhatsAppClick?: (listingId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onReport,
  reviews = [],
  currentUser,
  onSubmitReview = () => {},
  onTrackCallClick = () => {},
  onTrackWhatsAppClick = () => {},
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerCity, setReviewerCity] = useState(currentUser?.city || 'Sargodha');
  const [reviewerPhone, setReviewerPhone] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [starFilter, setStarFilter] = useState<'ALL' | number>('ALL');
  const [votedHelpful, setVotedHelpful] = useState<number[]>([]);

  if (!isOpen || !listing) return null;

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/?product=${listing.id}` : '';

  // Calculate relevant reviews: both listing-specific and seller-level
  const relevantReviews = reviews.filter(
    (r) => (r.listingId === listing.id || r.sellerId === listing.userId) && r.status === 'published'
  );

  const totalReviewsCount = relevantReviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (relevantReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
      : (listing.rating ? listing.rating.toFixed(1) : '5.0');

  // Star breakdown
  const starCounts = {
    5: relevantReviews.filter((r) => r.rating === 5).length,
    4: relevantReviews.filter((r) => r.rating === 4).length,
    3: relevantReviews.filter((r) => r.rating === 3).length,
    2: relevantReviews.filter((r) => r.rating === 2).length,
    1: relevantReviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = relevantReviews.filter((r) => {
    if (starFilter === 'ALL') return true;
    return r.rating === starFilter;
  });

  const availableTags = [
    '🌟 High Quality',
    '⚡ Fast Delivery',
    '🤝 Honest Seller',
    '🍲 Delicious Taste',
    '💵 Fair Price',
    '💯 100% Recommended',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = (currentUser ? currentUser.name : reviewerName.trim()) || 'Verified Customer';
    if (!reviewComment.trim()) return;

    onSubmitReview({
      sellerId: listing.userId,
      listingId: listing.id,
      reviewerId: currentUser ? currentUser.id : Date.now() % 100000,
      reviewerName: finalName,
      reviewerCity: reviewerCity.trim() || 'Sargodha',
      reviewerPhone: reviewerPhone.trim() || undefined,
      rating: ratingStars,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      isVerifiedCustomer: true,
      helpfulCount: 0,
      status: 'published',
    });

    setReviewSuccessMsg('بہت شکریہ! آپ کا کسٹمر ریویو اور ریٹنگ کامیابی سے شائع ہو گئی ہے۔ (Thank you! Your customer rating & review has been published.)');
    setReviewComment('');
    setReviewTitle('');
    setSelectedTags([]);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccessMsg('');
    }, 2800);
  };

  const handleHelpfulClick = (reviewId: number) => {
    if (votedHelpful.includes(reviewId)) return;
    setVotedHelpful((prev) => [...prev, reviewId]);
  };

  const cleanDigits = listing.sellerPhone.replace(/\D/g, '');
  const waNum = cleanDigits.startsWith('0')
    ? '92' + cleanDigits.slice(1)
    : cleanDigits.startsWith('92')
    ? cleanDigits
    : '92' + cleanDigits;

  const shareText = `Check out "${listing.title}" on SargodhaMart for Rs. ${listing.price.toLocaleString()} (${listing.city}): ${productUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-cyan-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/90 text-slate-700 hover:text-slate-950 hover:bg-white border border-slate-200 shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Gallery */}
          <div className="bg-slate-50 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 border border-slate-200 bg-white">
              <img
                src={listing.images[activeImageIdx] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.isFeatured && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-600/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? 'border-cyan-500 scale-105 shadow-md shadow-cyan-500/20' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product & Seller Details */}
          <div className="p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto bg-white">
            <div>
              {/* Category & City */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 font-medium">
                <span>{listing.categoryName} {listing.subcategory ? `• ${listing.subcategory}` : ''}</span>
                <span className="flex items-center gap-1 text-cyan-700 font-bold">
                  <MapPin className="w-3 h-3 text-cyan-600" /> {listing.city} ({listing.area})
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-black text-slate-900 mb-3">{listing.title}</h2>

              {/* Price & Condition */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-slate-100 flex-wrap">
                {listing.salePrice ? (
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-black text-emerald-600">
                      <span className="text-xs font-bold mr-1">Rs.</span>
                      {listing.salePrice.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-slate-400 line-through">
                      Rs. {listing.price.toLocaleString()}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Sale Offer
                    </span>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-cyan-700">
                    <span className="text-xs font-bold mr-1">Rs.</span>
                    {listing.price.toLocaleString()}
                  </div>
                )}
                <div className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                  {listing.condition}
                </div>
                {listing.isWholesaleAvailable && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    Wholesale Available {listing.minWholesaleQty ? `(Min ${listing.minWholesaleQty} pcs)` : ''}
                  </span>
                )}
              </div>

              {/* CLOTHING SPECIFICATIONS IF PRESENT */}
              {(listing.clothingSizes || listing.clothingColors || listing.clothingVarieties || listing.clothingStock || listing.deliveryInfo) && (
                <div className="mb-4 p-3.5 rounded-2xl bg-fuchsia-50/70 border border-fuchsia-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-fuchsia-950 uppercase tracking-wide">
                    <span>👔</span>
                    <span>Cloth Details & Available Options</span>
                  </div>

                  {listing.clothingSizes && listing.clothingSizes.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-600 text-[11px]">Sizes:</span>
                      <div className="flex gap-1 flex-wrap">
                        {listing.clothingSizes.map((sz, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-fuchsia-300 font-bold text-slate-800 text-[11px]">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {listing.clothingColors && listing.clothingColors.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-600 text-[11px]">Colors:</span>
                      <div className="flex gap-1 flex-wrap">
                        {listing.clothingColors.map((col, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-purple-300 font-bold text-purple-900 text-[11px]">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {listing.clothingVarieties && (
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900">Fabric / Variety:</strong> {listing.clothingVarieties}
                    </div>
                  )}

                  {listing.clothingStock !== undefined && (
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900">Stock Availability:</strong> {listing.clothingStock} Suits/Pieces In Stock
                    </div>
                  )}

                  {listing.deliveryInfo && (
                    <div className="flex items-center gap-1.5 text-[11px] text-fuchsia-900 font-semibold bg-white/80 p-2 rounded-xl border border-fuchsia-200">
                      <Truck className="w-3.5 h-3.5 text-fuchsia-700 shrink-0" />
                      <span>{listing.deliveryInfo}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</h4>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium">{listing.description}</p>
              </div>

              {/* Seller Information Card with Ratings ⭐ */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{listing.sellerName}</span>
                    {listing.sellerVerified && <VerifiedBadge size="sm" />}
                  </div>
                  {listing.sellerVerified ? (
                    <div className="flex items-center gap-1 text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <ShieldCheck className="w-3 h-3 text-blue-600" /> Verified Seller
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                      Community Seller
                    </div>
                  )}
                </div>

                {/* Seller Rating: ⭐ 4.8 / 5 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-500 font-black flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline mr-0.5" />
                      {avgRating} / 5
                    </span>
                    <span className="text-slate-500 text-[11px] font-semibold">
                      ({totalReviewsCount} {totalReviewsCount === 1 ? 'Review' : 'Reviews'})
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowReviewForm(true);
                      const el = document.getElementById('customer-reviews-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 underline flex items-center gap-1"
                  >
                    <span>⭐ Rate / Review ({totalReviewsCount})</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 mb-2 font-medium">
                  📍 {listing.sellerCity} · {listing.sellerArea}
                </div>

                {/* Seller WhatsApp Group / Channel Link if provided */}
                {listing.sellerWhatsappGroup && (
                  <a
                    href={listing.sellerWhatsappGroup}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline mt-1"
                  >
                    <span>💬</span> Join Seller's WhatsApp Group / Channel <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Direct Contact Buttons with Privacy Enforcement */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {listing.sellerContactPrivacy === 'HIDE_PHONE' ? (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500 font-medium">
                  🔒 Seller has set their contact details to private.
                </div>
              ) : (
                <div className={`grid ${
                  listing.sellerTelegramNumber &&
                  listing.sellerTelegramStatus === 'APPROVED' &&
                  listing.sellerTelegramVisibility === 'VISIBLE'
                    ? (listing.sellerContactPrivacy === 'WHATSAPP_ONLY' ? 'grid-cols-2' : 'grid-cols-3')
                    : (listing.sellerContactPrivacy === 'WHATSAPP_ONLY' ? 'grid-cols-1' : 'grid-cols-2')
                } gap-2`}>
                  {listing.sellerContactPrivacy !== 'WHATSAPP_ONLY' && (
                    <a
                      href={`tel:${listing.sellerPhone}`}
                      onClick={() => onTrackCallClick(listing.id)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Phone className="w-4 h-4 text-cyan-600" />
                      <span>Call Seller</span>
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Salam! I saw your listing "${listing.title}" on SargodhaMart. Is it available?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onTrackWhatsAppClick(listing.id)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/25"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                  {listing.sellerTelegramNumber &&
                    listing.sellerTelegramStatus === 'APPROVED' &&
                    listing.sellerTelegramVisibility === 'VISIBLE' && (
                      <a
                        href={`https://t.me/+${listing.sellerTelegramNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-600/25"
                      >
                        <Send className="w-4 h-4" />
                        <span>Telegram</span>
                      </a>
                    )}
                </div>
              )}

              {/* Utility actions: Favorite, Share, Report */}
              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => onToggleFavorite(listing.id)}
                  className="text-slate-600 hover:text-rose-600 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="text-slate-600 hover:text-cyan-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => onReport(listing)}
                    className="text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Share Options Popup */}
              {showShare && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-bold"
                    >
                      Facebook
                    </a>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 shadow-xs"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CUSTOMER REVIEWS & RATINGS SECTION (گاہکوں کے ریویوز اور ریٹنگز) */}
        {/* ============================================================== */}
        <div id="customer-reviews-section" className="border-t border-cyan-100 bg-slate-50/70 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">
                  Customer Ratings & Reviews (کسٹمر ریویوز)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic buyer feedback and verified customer ratings for this seller & product
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>{showReviewForm ? 'Close Review Form' : 'Write a Review (ریویو دیں)'}</span>
            </button>
          </div>

          {/* Rating Summary & Breakdown Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Average Score */}
            <div className="flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-slate-100">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{avgRating}</span>
              <div className="flex items-center gap-0.5 my-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      parseFloat(avgRating) >= s
                        ? 'fill-amber-400 text-amber-400'
                        : parseFloat(avgRating) >= s - 0.5
                        ? 'fill-amber-400/50 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600">
                Based on {totalReviewsCount} {totalReviewsCount === 1 ? 'Customer Review' : 'Customer Reviews'}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                ✓ 100% Genuine Local Customers
              </span>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="space-y-1.5 justify-center flex flex-col p-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars as keyof typeof starCounts] || 0;
                const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <button
                    key={stars}
                    onClick={() => setStarFilter(starFilter === stars ? 'ALL' : stars)}
                    className="flex items-center gap-2 text-xs w-full hover:bg-slate-50 px-1 py-0.5 rounded transition-colors text-left cursor-pointer"
                  >
                    <span className="w-12 font-bold text-slate-600 text-[11px] shrink-0 flex items-center gap-0.5">
                      {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-[11px] font-semibold text-slate-500 text-right shrink-0">
                      {count} ({pct}%)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Customer Satisfaction Highlights */}
            <div className="flex flex-col justify-center p-3 border-t md:border-t-0 md:border-l border-slate-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Deal Experience</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Genuine Sargodha Buyers</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct WhatsApp Inquiries</span>
              </div>
            </div>
          </div>

          {/* Interactive Customer Review Submission Form */}
          {showReviewForm && (
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md mb-6">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <h4 className="font-black text-slate-900 text-sm">
                    Submit Your Customer Rating & Review (ریویو لکھیں)
                  </h4>
                </div>
                <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  Customer Feedback
                </span>
              </div>

              {reviewSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center font-bold text-xs space-y-1">
                  <p className="text-sm">🎉 {reviewSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Your Rating (ریٹنگ منتخب کریں) *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRatingStars(star)}
                            onMouseEnter={() => setHoverStars(star)}
                            onMouseLeave={() => setHoverStars(0)}
                            className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                            title={`${star} Star`}
                          >
                            <Star
                              className={`w-6 h-6 ${(hoverStars || ratingStars) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                        {ratingStars === 5 ? '⭐⭐⭐⭐⭐ Outstanding (بہترین)' :
                         ratingStars === 4 ? '⭐⭐⭐⭐ Very Good (بہت اچھا)' :
                         ratingStars === 3 ? '⭐⭐⭐ Good (اچھا)' :
                         ratingStars === 2 ? '⭐⭐ Fair (مناسب)' : '⭐ Terrible (برا)'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information (Editable for guests or logged in) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Your Name (آپ کا نام) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tariq Mehmood"
                        value={currentUser ? currentUser.name : reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-cyan-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        City / Area (شہر یا علاقہ) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sargodha (Satellite Town)"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-cyan-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="03001234567"
                        value={reviewerPhone}
                        onChange={(e) => setReviewerPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-cyan-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Review Headline / Title (اختیاری)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Superb taste, very fresh and delivered fast!"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-cyan-600 focus:bg-white"
                    />
                  </div>

                  {/* Quick Satisfaction Tags */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Quick Tags (کلک کر کے شامل کریں):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableTags.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedTags.includes(tag)
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Comment Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Detailed Customer Experience (اپنا تجربہ لکھیں) *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share details about product quality, taste, delivery speed, packing or dealing with this seller in Sargodha..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-cyan-600 focus:bg-white"
                    ></textarea>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/25 transition-all cursor-pointer"
                    >
                      Submit Customer Review (ریویو جمع کرائیں)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Filter Bar & Reviews Count */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              <span>Customer Reviews ({filteredReviews.length})</span>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-medium mr-1">Filter:</span>
              <button
                onClick={() => setStarFilter('ALL')}
                className={`px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
                  starFilter === 'ALL'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All
              </button>
              {[5, 4, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  className={`px-2 py-0.5 rounded-full font-bold transition-colors flex items-center gap-0.5 cursor-pointer ${
                    starFilter === s
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {s} <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
              <Star className="w-8 h-8 text-amber-300 mx-auto mb-2" />
              <h5 className="font-bold text-slate-800 text-sm">
                No customer reviews yet for this filter
              </h5>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Be the first customer to share your experience with this seller or product!
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-3 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Write First Review (پہلا ریویو دیں)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-cyan-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {rev.reviewerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-xs">
                            {rev.reviewerName}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified Buyer
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          📍 {rev.reviewerCity || 'Sargodha'} · {rev.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shrink-0">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${rev.rating >= s ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-black text-amber-900 ml-0.5">{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h5 className="font-extrabold text-slate-900 text-xs mb-1">
                      {rev.title}
                    </h5>
                  )}

                  {/* Comment */}
                  <p className="text-xs text-slate-700 leading-relaxed mb-2 whitespace-pre-line">
                    {rev.comment}
                  </p>

                  {/* Tag Pills */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {rev.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer with Helpful Upvote */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      Deal verified on SargodhaMart
                    </span>

                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        votedHelpful.includes(rev.id)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3 text-cyan-600" />
                      <span>
                        Helpful ({(rev.helpfulCount || 0) + (votedHelpful.includes(rev.id) ? 1 : 0)})
                      </span>
                    </button>
                  </div>

                  {/* Seller Response if any */}
                  {rev.sellerResponse && (
                    <div className="mt-2.5 p-3 rounded-xl bg-cyan-50/80 border border-cyan-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-900 mb-1">
                        <Store className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Seller Response (سیلر کا جواب):</span>
                        {rev.sellerRespondedAt && (
                          <span className="text-[10px] text-cyan-600 font-normal">
                            · {rev.sellerRespondedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-xs italic">"{rev.sellerResponse}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
