import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  QrCode as QrCodeIcon,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Star,
  MessageSquare,
} from 'lucide-react';
import { BusinessShop, Listing, SellerReview, UserProfile } from '../types';
import { ProductCard } from './ProductCard';

interface ShopProfileViewProps {
  shop: BusinessShop;
  listings: Listing[];
  onBack: () => void;
  onSelectListing: (listing: Listing) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
  reviews?: SellerReview[];
  currentUser?: UserProfile | null;
  onSubmitReview?: (review: Omit<SellerReview, 'id' | 'createdAt'>) => void;
  onSubmitSellerResponse?: (reviewId: number, response: string) => void;
  onTrackCallClick?: (shopId: number) => void;
  onTrackWhatsAppClick?: (shopId: number) => void;
}

export const ShopProfileView: React.FC<ShopProfileViewProps> = ({
  shop,
  listings,
  onBack,
  onSelectListing,
  onToggleFavorite,
  favorites,
  reviews = [],
  currentUser,
  onSubmitReview = () => {},
  onSubmitSellerResponse = () => {},
  onTrackCallClick = () => {},
  onTrackWhatsAppClick = () => {},
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Seller response state
  const [respondingReviewId, setRespondingReviewId] = useState<number | null>(null);
  const [sellerResponseText, setSellerResponseText] = useState('');

  // Filter listings belonging to this shop/user
  const shopListings = listings.filter(
    (l) => (l.shopId === shop.id || l.userId === shop.userId) && l.status === 'published'
  );

  const shopUrl = `${window.location.origin}/shop/${shop.slug}`;

  // Filter reviews belonging to this shop owner
  const shopReviews = reviews.filter((r) => r.sellerId === shop.userId && r.status === 'published');
  const avgRating =
    shopReviews.length > 0
      ? (shopReviews.reduce((acc, r) => acc + r.rating, 0) / shopReviews.length).toFixed(1)
      : '4.8';

  const hasAlreadyReviewed =
    currentUser && shopReviews.some((r) => r.reviewerId === currentUser.id);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!currentUser) {
      setReviewError('Please login to leave a rating for this seller.');
      return;
    }
    if (currentUser.id === shop.userId) {
      setReviewError('Sellers cannot leave reviews for their own shop.');
      return;
    }
    if (hasAlreadyReviewed) {
      setReviewError('You have already submitted a review for this seller.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write your review feedback.');
      return;
    }

    onSubmitReview({
      sellerId: shop.userId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      rating: reviewStars,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      status: 'published',
    });

    setReviewSuccess('Your review has been successfully published!');
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccess('');
    }, 2000);
  };

  const handleSendSellerResponse = (reviewId: number) => {
    if (!sellerResponseText.trim()) return;
    onSubmitSellerResponse(reviewId, sellerResponseText.trim());
    setRespondingReviewId(null);
    setSellerResponseText('');
  };

  useEffect(() => {
    QRCode.toDataURL(shopUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [shopUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${shop.name} - Official SargodhaMart QR Code</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            h2 { margin-bottom: 5px; color: #0f172a; }
            p { color: #64748b; margin-top: 0; font-size: 14px; }
            img { width: 280px; height: 280px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 12px; }
            .url { font-family: monospace; font-size: 13px; color: #0891b2; margin-top: 15px; }
          </style>
        </head>
        <body>
          <h2>${shop.name}</h2>
          <p>${shop.area}, ${shop.city} · Verified SargodhaMart Shop</p>
          <img src="${qrDataUrl}" alt="Shop QR Code" />
          <div class="url">${shopUrl}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const cleanPhone = shop.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = shop.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-cyan-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-all shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Shop Cover & Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover banner */}
        <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-900 relative">
          {shop.coverImage && (
            <img
              src={shop.coverImage}
              alt={shop.name}
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="p-6 md:p-8 -mt-16 sm:-mt-20 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Logo and title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{shop.name}</h1>
                  {shop.isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Business
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ⭐ {avgRating} / 5 ({shopReviews.length} {shopReviews.length === 1 ? 'Review' : 'Reviews'})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{shop.area}, {shop.city}</span>
                  {shop.address && <span>• {shop.address}</span>}
                </div>

                {shop.openingHours && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1 font-medium">
                    <Clock className="w-3 h-3 text-cyan-600" />
                    <span>{shop.openingHours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Call, WhatsApp, Share, QR */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${shop.phone}`}
                onClick={() => onTrackCallClick(shop.id)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Call ({shop.phone})</span>
              </a>

              <a
                href={`https://wa.me/92${cleanWhatsApp.replace(/^0/, '')}?text=${encodeURIComponent(
                  `Salam! I visited your shop "${shop.name}" on SargodhaMart. I am interested in your products.`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => onTrackWhatsAppClick(shop.id)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md shadow-emerald-600/25 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Shop</span>
              </a>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                title="Share Shop Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="p-2.5 rounded-xl border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-800 transition-colors"
                title="Shop QR Code"
              >
                <QrCodeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Services */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">About the Business</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {shop.description}
              </p>

              {shop.services && shop.services.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Services & Specialities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {shop.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Meta Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Live Products:</span>
                <strong className="text-cyan-800 font-bold">{shopListings.length} Ads</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Total Views:</span>
                <strong className="text-slate-900 font-bold">{shop.views}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shop Slug:</span>
                <code className="text-cyan-700 font-mono text-[11px]">/shop/{shop.slug}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-600" />
            <span>Products Available at {shop.name} ({shopListings.length})</span>
          </h2>
        </div>

        {shopListings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No active listings available right now.</p>
            <p className="text-xs text-slate-500 mt-1">Check back later or contact the seller via WhatsApp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {shopListings.map((listing) => (
              <ProductCard
                key={listing.id}
                listing={{
                  ...listing,
                  sellerVerified: listing.sellerVerified || shop.isVerified,
                }}
                onClick={() => onSelectListing(listing)}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Customer Ratings & Reviews</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                ({shopReviews.length} Verified {shopReviews.length === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Real marketplace ratings from verified buyers in Sargodha division
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-xl font-black text-amber-700 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{avgRating}</span>
                <span className="text-xs text-slate-400 font-medium">/ 5</span>
              </div>
              <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">
                Seller Rating
              </div>
            </div>

            {currentUser && !hasAlreadyReviewed && currentUser.id !== shop.userId && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-700 hover:bg-cyan-600 text-white shadow-sm transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Review Submission Form */}
        {showReviewForm && (
          <form
            onSubmit={handleCreateReview}
            className="p-5 bg-gradient-to-br from-cyan-50/60 to-slate-50 rounded-2xl border border-cyan-200 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Review & Rate {shop.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select your star rating and write brief feedback
                </p>
              </div>

              {/* Star selector */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewStars(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        reviewStars >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Review Title (Optional, e.g. Genuine product, 100% recommended)"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              />
              <textarea
                rows={3}
                placeholder="Write your genuine experience with this seller / shop..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                required
              />
            </div>

            {reviewError && <p className="text-xs font-bold text-rose-600">{reviewError}</p>}
            {reviewSuccess && <p className="text-xs font-bold text-emerald-600">{reviewSuccess}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-700/20"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {shopReviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100">
            <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No reviews published yet for this seller.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Be the first buyer to review after interacting with {shop.name}!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {shopReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{rev.reviewerName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">· {rev.createdAt}</span>
                    </div>
                    {rev.title && (
                      <h5 className="text-xs font-extrabold text-slate-800 mt-0.5">{rev.title}</h5>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">{rev.comment}</p>

                {/* Seller Public Response */}
                {rev.sellerResponse ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-white border border-cyan-100 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-800 flex items-center gap-1">
                      <span>🏪</span> Seller Response ({shop.name})
                    </span>
                    <p className="text-xs text-slate-600 italic">"{rev.sellerResponse}"</p>
                  </div>
                ) : (
                  currentUser &&
                  currentUser.id === shop.userId && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                      {respondingReviewId === rev.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Write your public response (e.g. Thank you for your feedback!)..."
                            value={sellerResponseText}
                            onChange={(e) => setSellerResponseText(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setRespondingReviewId(null)}
                              className="px-2.5 py-1 rounded text-[11px] font-bold text-slate-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendSellerResponse(rev.id)}
                              className="px-3 py-1 rounded bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800"
                            >
                              Post Response
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRespondingReviewId(rev.id);
                            setSellerResponseText('');
                          }}
                          className="text-[11px] font-bold text-cyan-700 hover:underline"
                        >
                          + Reply to this review
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-600" />
                Share {shop.name}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Share this shop link directly with customers on WhatsApp, Facebook, or copy the direct link.
            </p>

            {/* URL Box */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <input
                type="text"
                readOnly
                value={shopUrl}
                className="bg-transparent text-xs text-slate-800 font-mono w-full outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out ${shop.name} on SargodhaMart! Direct verified shop in ${shop.city}: ${shopUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Share</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-500 shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Facebook Share</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <QrCodeIcon className="w-4 h-4 text-cyan-600" />
                Official Shop QR Code
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm">{shop.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{shop.area}, {shop.city}</p>
            </div>

            {/* QR Image Display */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`${shop.name} QR Code`}
                  className="w-56 h-56 mx-auto rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Customers can scan this QR code with their mobile camera to open your SargodhaMart shop profile instantly.
            </p>

            {/* QR Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={qrDataUrl}
                download={`${shop.slug}-sargodhamart-qr.png`}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </a>

              <button
                onClick={handlePrintQr}
                className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
