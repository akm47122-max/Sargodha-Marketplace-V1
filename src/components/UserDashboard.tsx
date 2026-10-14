import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Briefcase,
  FileText,
  Star,
  ShieldCheck,
  Megaphone,
  Sparkles,
  BarChart3,
  Heart,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  QrCode as QrCodeIcon,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Eye,
  Send,
  EyeOff,
  Trash2,
  PlusCircle,
  Edit3,
  MapPin,
  HelpCircle,
  Shield,
  Layers,
  Users,
  TrendingUp,
  Compass,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Calendar,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  UserProfile,
  Listing,
  JobPost,
  DigitalSkillProfile,
  PromotionPayment,
  Advertisement,
  AdvertisingPackage,
  AdvertisingPayment,
  BusinessShop,
  SellerReview,
  SellerVerificationRecord,
  VerifiedBadgeDurationMode,
  SiteSettings,
  PaymentMethod,
  UserNotification,
  SavedSearch,
  SellerFollow,
  TelegramVisibility,
  ContactPrivacy,
  Condition,
} from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface UserDashboardProps {
  currentUser: UserProfile;
  listings: Listing[];
  jobs: JobPost[];
  skills?: DigitalSkillProfile[];
  promotions?: PromotionPayment[];
  advertisements?: Advertisement[];
  advertisingPackages?: AdvertisingPackage[];
  favorites: number[];
  shops?: BusinessShop[];
  reviews?: SellerReview[];
  notifications?: UserNotification[];
  savedSearches?: SavedSearch[];
  verifications?: SellerVerificationRecord[];
  paymentMethods?: PaymentMethod[];
  settings?: SiteSettings;
  initialTab?: string;
  onOpenPostAd: () => void;
  onOpenPostJob: () => void;
  onOpenPostSkill?: (skillToEdit?: DigitalSkillProfile | null) => void;
  onOpenActivation: () => void;
  onOpenPromoteModal?: (type?: 'PRODUCT' | 'SKILL', id?: number) => void;
  onOpenCreateAd?: (packageId?: number) => void;
  onDeleteListing: (id: number) => void;
  onRenewListing?: (id: number) => void;
  onDeleteJob: (id: number) => void;
  onDeleteSkill?: (id: number) => void;
  onSelectListing: (listing: Listing) => void;
  onSelectSkill?: (skill: DigitalSkillProfile) => void;
  onSaveShop?: (shopData: Partial<BusinessShop>) => void;
  onRespondReview?: (reviewId: number, response: string) => void;
  onSubmitVerification?: (params: {
    fee: number;
    durationMode: VerifiedBadgeDurationMode;
    businessType: 'seller' | 'shop' | 'transporter';
    shopName?: string;
    cnicNumber?: string;
    trxId: string;
    paymentProofUrl: string;
    documentUrl?: string;
  }) => void;
  onSubmitPromotion?: (params: {
    entityType: 'PRODUCT' | 'SKILL_PROFILE';
    entityId: number;
    entityTitle: string;
    amount: number;
    durationDays: number;
    trx: string;
    screenshot: string;
  }) => void;
  onAddSavedSearch?: (search: Omit<SavedSearch, 'id' | 'userId' | 'createdAt'>) => void;
  onDeleteSavedSearch?: (id: number) => void;
  onMarkNotificationRead?: (id: number) => void;
  onClearNotifications?: () => void;
  onLogout: () => void;
  onUpdateTelegramSettings?: (params: {
    telegramNumber: string;
    telegramVisibility: TelegramVisibility;
    contactPrivacy: ContactPrivacy;
  }) => void;
  onViewShop?: (shop: BusinessShop) => void;
  follows?: SellerFollow[];
  onToggleFollow?: (targetType: 'SELLER' | 'SHOP', targetId: number, targetName: string) => void;
  onToggleFollowAlerts?: (followId: number) => void;
  onUnfollow?: (followId: number) => void;
  onToggleSavedSearchAlerts?: (id: number) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  listings,
  jobs,
  skills = [],
  promotions = [],
  advertisements = [],
  advertisingPackages = [],
  favorites,
  shops = [],
  reviews = [],
  notifications = [],
  savedSearches = [],
  verifications = [],
  paymentMethods = [],
  settings,
  follows = [],
  onOpenPostAd,
  onOpenPostJob,
  onOpenPostSkill,
  onOpenActivation,
  onOpenPromoteModal,
  onOpenCreateAd,
  onDeleteListing,
  onRenewListing = () => {},
  onDeleteJob,
  onDeleteSkill,
  onSelectListing,
  onSelectSkill,
  onSaveShop = () => {},
  onRespondReview = () => {},
  onSubmitVerification = () => {},
  onSubmitPromotion = () => {},
  onAddSavedSearch = () => {},
  onDeleteSavedSearch = () => {},
  onToggleSavedSearchAlerts = () => {},
  onToggleFollow = () => {},
  onToggleFollowAlerts = () => {},
  onUnfollow = () => {},
  onMarkNotificationRead = () => {},
  onClearNotifications = () => {},
  onLogout,
  onUpdateTelegramSettings,
  onViewShop = () => {},
  initialTab,
}) => {
  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'shop'
    | 'jobs'
    | 'skills'
    | 'reviews'
    | 'verification'
    | 'promote'
    | 'advertising'
    | 'analytics'
    | 'favorites'
    | 'following'
    | 'saved_searches'
    | 'notifications'
    | 'telegram'
    | 'settings'
  >((initialTab as any) || 'overview');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Sub-tabs
  const [productSubTab, setProductSubTab] = useState<'all' | 'active' | 'pending' | 'expired'>('all');
  const [promoteSubTab, setPromoteSubTab] = useState<'product' | 'skill' | 'history'>('product');
  const [adSubTab, setAdSubTab] = useState<'my-ads' | 'create' | 'packages' | 'history'>('my-ads');
  const [jobSubTab, setJobSubTab] = useState<'all' | 'need_worker' | 'need_job'>('all');

  // User-owned data slices
  const myListings = listings.filter((l) => l.userId === currentUser.id);
  const myJobs = jobs.filter((j) => j.userId === currentUser.id);
  const mySkills = skills.filter((s) => s.userId === currentUser.id);
  const myPromotions = promotions.filter((p) => p.userId === currentUser.id);
  const myAds = advertisements.filter((a) => a.userId === currentUser.id);
  const myFavoriteListings = listings.filter((l) => favorites.includes(l.id));
  const myShop = shops.find((s) => s.userId === currentUser.id) || null;
  const myReviews = reviews.filter((r) => r.sellerId === currentUser.id);
  const myVerifications = verifications.filter((v) => v.userId === currentUser.id);
  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const mySavedSearches = savedSearches.filter((s) => s.userId === currentUser.id);
  const myFollows = follows.filter((f) => f.userId === currentUser.id);

  // Listing Insights Modal State
  const [selectedInsightListing, setSelectedInsightListing] = useState<Listing | null>(null);

  // Analytics Controls State
  const [analyticsDateRange, setAnalyticsDateRange] = useState<'today' | '7days' | '30days' | 'custom'>('30days');
  const [analyticsCategory, setAnalyticsCategory] = useState<'all' | 'products' | 'shop' | 'skills' | 'jobs'>('all');

  // Shop management form state
  const [shopName, setShopName] = useState(myShop?.name || `${currentUser.name}'s Shop`);
  const [shopSlug, setShopSlug] = useState(myShop?.slug || `${currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
  const [shopDescription, setShopDescription] = useState(myShop?.description || '');
  const [shopAddress, setShopAddress] = useState(myShop?.address || '');
  const [shopHours, setShopHours] = useState(myShop?.openingHours || 'Mon - Sat: 08:00 AM - 08:00 PM');
  const [shopPhone, setShopPhone] = useState(myShop?.phone || currentUser.mobile);
  const [shopWhatsapp, setShopWhatsapp] = useState(myShop?.whatsapp || currentUser.mobile);
  const [shopServicesInput, setShopServicesInput] = useState(myShop?.services?.join(', ') || 'Quality Products, Quick Support');
  const [shopSavedMsg, setShopSavedMsg] = useState(false);
  const [shopQrDataUrl, setShopQrDataUrl] = useState<string>('');
  const [copiedShopUrl, setCopiedShopUrl] = useState(false);

  // Generate QR for Shop
  const publicShopUrl = `${window.location.origin}/shop/${shopSlug}`;
  useEffect(() => {
    if (shopSlug) {
      QRCode.toDataURL(publicShopUrl, { width: 240, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
        .then((url) => setShopQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [shopSlug, publicShopUrl]);

  // Review reply state
  const [replyReviewId, setReplyReviewId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Promote form state
  const [promoEntityType, setPromoEntityType] = useState<'PRODUCT' | 'SKILL_PROFILE'>('PRODUCT');
  const [selectedPromoEntityId, setSelectedPromoEntityId] = useState<number>(myListings[0]?.id || 0);
  const [promoTrxId, setPromoTrxId] = useState('');
  const [promoSubmittedMsg, setPromoSubmittedMsg] = useState(false);

  // Verification request form state
  const [verifTrxId, setVerifTrxId] = useState('');
  const [verifSubmittedMsg, setVerifSubmittedMsg] = useState(false);
  const [verifBusinessType, setVerifBusinessType] = useState<'seller' | 'shop' | 'transporter'>('seller');
  const [verifShopName, setVerifShopName] = useState(myShop?.name || '');
  const [verifCnic, setVerifCnic] = useState('');
  const [verifProofUrl, setVerifProofUrl] = useState('');
  const [verifDocumentUrl, setVerifDocumentUrl] = useState('');

  // Saved Search state
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchCategory, setNewSearchCategory] = useState('');
  const [newSearchCity, setNewSearchCity] = useState('');
  const [newSearchMinPrice, setNewSearchMinPrice] = useState('');
  const [newSearchMaxPrice, setNewSearchMaxPrice] = useState('');
  const [newSearchCondition, setNewSearchCondition] = useState('any');

  // Telegram profile & contact form states
  const [telegramInput, setTelegramInput] = useState(currentUser.telegramNumber || '');
  const [telegramVisibility, setTelegramVisibility] = useState<TelegramVisibility>(
    currentUser.telegramVisibility || 'HIDDEN'
  );
  const [contactPrivacy, setContactPrivacy] = useState<ContactPrivacy>(
    currentUser.contactPrivacy || 'SHOW_ALL'
  );
  const [telegramFormSubmitted, setTelegramFormSubmitted] = useState(false);
  const [telegramError, setTelegramError] = useState('');

  const handleTelegramFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramError('');
    const cleanNum = telegramInput.trim();
    if (!cleanNum) {
      setTelegramError('Please enter your Telegram phone number.');
      return;
    }
    const digitsOnly = cleanNum.replace(/[^\d+]/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 16) {
      setTelegramError('Please enter a valid phone number (e.g. 03001234567 or +923001234567).');
      return;
    }

    if (onUpdateTelegramSettings) {
      onUpdateTelegramSettings({
        telegramNumber: cleanNum,
        telegramVisibility,
        contactPrivacy,
      });
      setTelegramFormSubmitted(true);
    }
  };

  const handleSaveShopForm = (e: React.FormEvent) => {
    e.preventDefault();
    const services = shopServicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveShop({
      name: shopName,
      slug: shopSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: shopDescription,
      address: shopAddress,
      openingHours: shopHours,
      phone: shopPhone,
      whatsapp: shopWhatsapp,
      services,
      city: currentUser.city,
      area: currentUser.area,
      status: myShop?.status || 'APPROVED',
    });
    setShopSavedMsg(true);
    setTimeout(() => setShopSavedMsg(false), 3000);
  };

  const handleCopyShopUrl = () => {
    navigator.clipboard.writeText(publicShopUrl);
    setCopiedShopUrl(true);
    setTimeout(() => setCopiedShopUrl(false), 2000);
  };

  const handlePrintShopQr = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${shopName} - QR Code</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            img { width: 260px; height: 260px; border: 1px solid #e2e8f0; padding: 10px; border-radius: 12px; }
          </style>
        </head>
        <body>
          <h2>${shopName}</h2>
          <p>Scan to view shop on SargodhaMart</p>
          <img src="${shopQrDataUrl}" />
          <p>${publicShopUrl}</p>
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

  // Analytics aggregates
  const totalProductViews = myListings.reduce((sum, l) => sum + (l.views || 0), 0);
  const totalCallClicks = myListings.reduce((sum, l) => sum + (l.callClicks || 0), 0) + (myShop?.callClicks || 0);
  const totalWhatsAppClicks = myListings.reduce((sum, l) => sum + (l.whatsappClicks || 0), 0) + (myShop?.whatsappClicks || 0);
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1) : '5.0';

  return (
    <div className="py-6 px-3 sm:px-4 max-w-7xl mx-auto space-y-6">
      {/* User Header Profile Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-cyan-200 rounded-3xl p-5 md:p-7 shadow-[0_10px_35px_-5px_rgba(6,182,212,0.12)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/25 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-slate-900">{currentUser.name}</h1>
                {currentUser.isVerified && <VerifiedBadge size="sm" />}
                {currentUser.activationStatus === 'active' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Lifetime Seller
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-amber-600" /> Pending Activation
                  </span>
                )}
                {myShop?.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-blue-600 fill-blue-600" /> Verified Shop
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                <span>{currentUser.mobile}</span> • <span>{currentUser.email}</span> •{' '}
                <span className="text-cyan-800 font-bold">{currentUser.city} ({currentUser.area})</span>
              </div>
            </div>
          </div>

          {/* Quick Header CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPostAd}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/25 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Post Ad
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Store className="w-3.5 h-3.5" /> My Shop
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition-all shadow-xs"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Activation Offer Status */}
        {currentUser.activationStatus !== 'active' && (
          <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Launch Special (First 20 Free Sellers):</strong> Submit your WhatsApp follow screenshot to claim your Rs. 0 Lifetime Seller activation!
              </span>
            </div>
            <button
              onClick={onOpenActivation}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-xs"
            >
              Activate Account
            </button>
          </div>
        )}
      </div>

      {/* Main 15-Tab Responsive Navigation Menu */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'products'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>My Products ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'shop'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>My Shop & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'jobs'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>My Jobs ({myJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'skills'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Skills ({mySkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Reviews ({myReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'verification'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'verification' ? 'text-white' : 'text-blue-600'}`} />
          <span>Get Verified</span>
          {currentUser.isVerified && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${activeTab === 'verification' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
              ✓ Active
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('promote')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'promote'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
              : 'text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>📣 Promote ({myPromotions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('advertising')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'advertising'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Advertising</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Favorites ({myFavoriteListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('following')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'following'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Following ({myFollows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_searches')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'saved_searches'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Saved Searches ({mySavedSearches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'notifications'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts ({myNotifications.filter((n) => !n.isRead).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'telegram'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram & Contact</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. DASHBOARD HOME OVERVIEW */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Quick Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Ad Views</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalProductViews}</div>
              <div className="text-[11px] text-slate-500 mt-1">Across {myListings.length} products</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cyan-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">Buyer Call Clicks</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-800 mt-1">{totalCallClicks}</div>
              <div className="text-[11px] text-slate-500 mt-1">Direct phone calls</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">WhatsApp Inquiries</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{totalWhatsAppClicks}</div>
              <div className="text-[11px] text-slate-500 mt-1">Direct chat clicks</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Customer Rating</div>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">⭐ {avgRating} / 5</div>
              <div className="text-[11px] text-slate-500 mt-1">From {myReviews.length} reviews</div>
            </div>
          </div>

          {/* Quick Actions & Shop Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-cyan-600" />
                <span>My Shop Status</span>
              </h3>

              {myShop ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{myShop.name}</h4>
                      <p className="text-xs text-slate-500">/{myShop.slug} · {myShop.city}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => onViewShop(myShop)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Public Shop</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                    >
                      Manage & QR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    You haven't set up your public SargodhaMart Shop yet. Basic shop profile is included free with your seller activation!
                  </p>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Free Shop Profile</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Growth & Promotions</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <p>
                  Boost your products or digital skills to the top of homepage and search results for only Rs. 1,000 / 15 days.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('promote')}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Promote Item</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100"
                  >
                    Get Verified ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MY PRODUCTS TAB (WITH AUTO-EXPIRY & RENEW) */}
      {/* ============================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Your Product Listings</h2>
              <p className="text-xs text-slate-500">Manage, edit, renew, and track performance of your marketplace ads</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPostAd}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" /> Post Free Ad
              </button>
            </div>
          </div>

          {/* Subtab filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
            {(['all', 'active', 'pending', 'expired'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setProductSubTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  productSubTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab} (
                {tab === 'all'
                  ? myListings.length
                  : tab === 'active'
                  ? myListings.filter((l) => l.status === 'published').length
                  : tab === 'pending'
                  ? myListings.filter((l) => l.status === 'pending').length
                  : myListings.filter((l) => l.status === 'expired' || l.isExpired).length}
                )
              </button>
            ))}
          </div>

          {myListings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">You haven't posted any products yet.</p>
              <button
                onClick={onOpenPostAd}
                className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-xs hover:bg-cyan-500"
              >
                Post Your First Free Ad
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings
                .filter((l) => {
                  if (productSubTab === 'all') return true;
                  if (productSubTab === 'active') return l.status === 'published';
                  if (productSubTab === 'pending') return l.status === 'pending';
                  if (productSubTab === 'expired') return l.status === 'expired' || l.isExpired;
                  return true;
                })
                .map((listing) => (
                  <div
                    key={listing.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              listing.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : listing.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : listing.status === 'expired' || listing.isExpired
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {listing.status === 'expired' || listing.isExpired ? 'EXPIRED' : listing.status}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {listing.condition}
                          </span>
                        </div>
                        <h4
                          onClick={() => onSelectListing(listing)}
                          className="font-bold text-sm text-slate-900 hover:text-cyan-700 cursor-pointer truncate"
                        >
                          {listing.title}
                        </h4>
                        <div className="text-xs font-black text-cyan-800 mt-0.5">
                          Rs. {listing.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4 text-xs shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-3 text-slate-500 font-medium">
                        <span title="Views">👁️ {listing.views || 0}</span>
                        <span title="Call Clicks">📞 {listing.callClicks || 0}</span>
                        <span title="WhatsApp Clicks">💬 {listing.whatsappClicks || 0}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(listing.status === 'expired' || listing.isExpired) && (
                          <button
                            onClick={() => onRenewListing(listing.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                            title="Renew listing for 30 more days"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedInsightListing(listing)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-300 hover:bg-cyan-100 font-bold text-xs flex items-center gap-1"
                          title="View Detailed Listing Insights"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Insights</span>
                        </button>

                        <button
                          onClick={() => onOpenPromoteModal && onOpenPromoteModal('PRODUCT', listing.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold text-xs"
                          title="Promote on Homepage"
                        >
                          📣 Promote
                        </button>

                        <button
                          onClick={() => onDeleteListing(listing.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MY SHOP & DYNAMIC QR CODE TAB */}
      {/* ============================================================== */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-600" />
              <span>Business Shop Profile & Shareable QR Code</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Included free with your lifetime Seller Activation. Every active seller can create a dedicated store link and QR code.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Shop Details Form */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <form onSubmit={handleSaveShopForm} className="space-y-4">
                {shopSavedMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Shop details saved successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shop / Business Name</label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unique URL Slug (<span className="font-mono text-cyan-700">/shop/{shopSlug}</span>)
                    </label>
                    <input
                      type="text"
                      value={shopSlug}
                      onChange={(e) => setShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Description</label>
                  <textarea
                    rows={3}
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    placeholder="Tell buyers about your products, quality guarantees, delivery policies..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shop Address / Landmark</label>
                    <input
                      type="text"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      placeholder="e.g. Shop #4, Grain Market, Shaheenabad"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={shopHours}
                      onChange={(e) => setShopHours(e.target.value)}
                      placeholder="e.g. Mon - Sun: 08:00 AM - 09:00 PM"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Business Number</label>
                    <input
                      type="tel"
                      value={shopWhatsapp}
                      onChange={(e) => setShopWhatsapp(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Services / Specialities (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={shopServicesInput}
                    onChange={(e) => setShopServicesInput(e.target.value)}
                    placeholder="e.g. Home Delivery, Fresh Citrus, High Protein Wanda, Verified Livestock"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-md shadow-cyan-600/20"
                  >
                    Save Shop Profile
                  </button>

                  {myShop && (
                    <button
                      type="button"
                      onClick={() => onViewShop(myShop)}
                      className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview Public Page</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Col: Live QR Code & Share Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-center gap-1.5">
                <QrCodeIcon className="w-4 h-4 text-cyan-600" />
                <span>Shop QR Code</span>
              </h3>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
                {shopQrDataUrl ? (
                  <img src={shopQrDataUrl} alt="Shop QR" className="w-48 h-48 mx-auto rounded-xl" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">{shopName}</div>
                <div className="text-[11px] font-mono text-cyan-700 truncate">{publicShopUrl}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={shopQrDataUrl}
                  download={`${shopSlug}-qr.png`}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={handlePrintShopQr}
                  className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print QR</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyShopUrl}
                className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {copiedShopUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShopUrl ? 'Copied Public Link!' : 'Copy Shareable Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MY JOBS TAB */}
      {/* ============================================================== */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Your Rozgar & Job Postings</h2>
              <p className="text-xs text-slate-500">Post worker requirements or find employment across Sargodha</p>
            </div>
            <button
              onClick={onOpenPostJob}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" /> Post Job Requirement
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
            <button
              onClick={() => setJobSubTab('all')}
              className={`px-3 py-1.5 rounded-lg capitalize ${jobSubTab === 'all' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
            >
              All ({myJobs.length})
            </button>
            <button
              onClick={() => setJobSubTab('need_worker')}
              className={`px-3 py-1.5 rounded-lg capitalize ${jobSubTab === 'need_worker' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
            >
              Hiring Workers ({myJobs.filter((j) => j.postType === 'need_worker').length})
            </button>
            <button
              onClick={() => setJobSubTab('need_job')}
              className={`px-3 py-1.5 rounded-lg capitalize ${jobSubTab === 'need_job' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
            >
              Seeking Work ({myJobs.filter((j) => j.postType === 'need_job').length})
            </button>
          </div>

          {myJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No jobs posted yet.</p>
              <button
                onClick={onOpenPostJob}
                className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-500"
              >
                Create Job Posting
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs
                .filter((j) => (jobSubTab === 'all' ? true : j.postType === jobSubTab))
                .map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            job.postType === 'need_worker'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {job.postType === 'need_worker' ? 'Hiring' : 'Looking for Work'}
                        </span>
                        <span className="text-xs text-slate-500">{job.city} ({job.area})</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Skills: {job.skills}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-medium mr-2">👁️ {job.views || 0}</span>
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MY DIGITAL SKILLS TAB */}
      {/* ============================================================== */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Your Digital Skill Profiles</h2>
              <p className="text-xs text-slate-500">Showcase software, design, marketing and development skills</p>
            </div>
            <button
              onClick={() => onOpenPostSkill && onOpenPostSkill(null)}
              className="px-3.5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" /> Create Skill Profile
            </button>
          </div>

          {mySkills.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No digital skill profile created yet.</p>
              <button
                onClick={() => onOpenPostSkill && onOpenPostSkill(null)}
                className="mt-3 px-4 py-2 rounded-xl bg-fuchsia-600 text-white text-xs font-bold shadow-xs hover:bg-fuchsia-500"
              >
                Add Your Skill Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {mySkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={sk.profilePhoto}
                      alt={sk.fullName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-fuchsia-100 text-fuchsia-800">
                          {sk.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {sk.status.toUpperCase()}
                        </span>
                      </div>
                      <h4
                        onClick={() => onSelectSkill && onSelectSkill(sk)}
                        className="font-bold text-sm text-slate-900 hover:text-fuchsia-700 cursor-pointer"
                      >
                        {sk.professionalTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sk.skills.slice(0, 4).join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenPromoteModal && onOpenPromoteModal('SKILL', sk.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs hover:bg-amber-100"
                    >
                      📣 Promote
                    </button>
                    <button
                      onClick={() => onOpenPostSkill && onOpenPostSkill(sk)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="Edit Skill"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {onDeleteSkill && (
                      <button
                        onClick={() => onDeleteSkill(sk.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. REVIEWS & RATINGS TAB (WITH SELLER RESPONSE) */}
      {/* ============================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Customer Reviews & Reputation</span>
              </h2>
              <p className="text-xs text-slate-500">Real feedback from verified marketplace buyers</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-slate-900">⭐ {avgRating} / 5</div>
              <div className="text-[11px] text-slate-500">{myReviews.length} Total Reviews</div>
            </div>
          </div>

          {myReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No customer reviews received yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Reviews will appear here once buyers leave feedback on your products.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900">{rev.reviewerName}</strong>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>

                  {rev.title && <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>}
                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                  {/* Public Seller Response */}
                  {rev.sellerResponse ? (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Your Response:
                      </div>
                      <p className="text-slate-600 italic">{rev.sellerResponse}</p>
                    </div>
                  ) : (
                    <div>
                      {replyReviewId === rev.id ? (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a polite public response to this customer..."
                            rows={2}
                            className="w-full p-2 text-xs rounded-lg border border-slate-200 outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setReplyReviewId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                onRespondReview(rev.id, replyText);
                                setReplyReviewId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1 text-xs bg-slate-900 text-white font-bold rounded-lg"
                            >
                              Submit Public Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyReviewId(rev.id);
                            setReplyText('');
                          }}
                          className="text-xs font-bold text-cyan-700 hover:text-cyan-800 mt-1"
                        >
                          Reply to Customer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. GET VERIFIED SELLER TAB */}
      {/* ============================================================== */}
      {activeTab === 'verification' && (() => {
        const activeVerif = myVerifications.find((v) => v.status === 'VERIFIED');
        const pendingVerif = myVerifications.find((v) => v.status === 'PENDING' || v.status === 'UNDER_REVIEW');
        const rejectedVerif = myVerifications.find((v) => v.status === 'REJECTED');
        const revokedVerif = myVerifications.find((v) => v.status === 'REVOKED');
        const isVerified = currentUser.isVerified || !!activeVerif;
        const currentFee = settings?.verifiedBadgeFee || 6999;
        const currentMode = settings?.verifiedBadgeDurationMode || 'lifetime';

        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Official Verified Badge Verification System</span>
                </h2>
                {isVerified && <VerifiedBadge size="sm" />}
              </div>
              <p className="text-xs text-slate-500">
                Official blue verification checkmark (✓) for trusted local sellers, physical retail shops, and commercial freight transporters.
              </p>
            </div>

            {/* Current Verification Status Banner */}
            {isVerified ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white border-2 border-blue-500/50 shadow-lg shadow-blue-900/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-black tracking-tight">Status: Verified Member</span>
                      <VerifiedBadge size="md" />
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {currentMode === 'lifetime' ? 'Lifetime Verified' : 'Monthly Subscription'}
                      </span>
                    </div>
                    <p className="text-xs text-blue-200">
                      Your identity and contact credentials have been verified by SargodhaMart Administrators.
                      {activeVerif?.shopName && (
                        <span> Registered under: <strong className="text-white">{activeVerif.shopName}</strong></span>
                      )}
                    </p>
                    {activeVerif?.expiresAt && (
                      <div className="text-[11px] text-blue-300 font-mono">
                        Valid Until: <strong className="text-white">{activeVerif.expiresAt}</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-[10px] text-blue-200 uppercase font-black">All Listings</div>
                      <div className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Badge Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : pendingVerif ? (
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-amber-950">Verification Application Under Review</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-800 animate-pulse">
                        Pending Admin Inspection
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Your verification request with TRX ID <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">{pendingVerif.trxId}</code> is currently being audited by the SargodhaMart verification team. Approvals are typically completed within 15–30 minutes.
                    </p>
                    <div className="text-[11px] text-amber-800 font-medium">
                      Applied on: {pendingVerif.appliedAt} • Fee: Rs. {pendingVerif.fee.toLocaleString()} ({pendingVerif.durationMode === 'lifetime' ? 'Lifetime' : 'Monthly'})
                    </div>
                  </div>
                </div>
              </div>
            ) : rejectedVerif ? (
              <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-sm">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-rose-950">Previous Verification Application Rejected</h4>
                    <p className="text-xs text-rose-900">
                      Reason: <strong className="underline">{rejectedVerif.rejectionReason || 'Proof or CNIC did not match registration.'}</strong>
                    </p>
                    <p className="text-xs text-rose-800">
                      You can submit corrected payment and business credentials using the form below.
                    </p>
                  </div>
                </div>
              </div>
            ) : revokedVerif ? (
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-amber-950">Verified Badge Revoked</h4>
                    <p className="text-xs text-amber-900">
                      Reason: <strong className="underline">{revokedVerif.revocationReason || 'Revoked by administrator.'}</strong>
                    </p>
                    <p className="text-xs text-amber-800">
                      Please contact customer support or reapply below with valid credentials.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Grid Layout: Benefits & Application Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Official Benefits & Payment Accounts */}
              <div className="space-y-6">
                {/* Benefits Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <h3 className="font-black text-slate-900 text-sm">Official Blue Verified Badge Benefits</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Official Blue Verified Badge (✓) displayed on all your products and ads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Higher ranking in search results and priority lead routing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Verified merchant status on public shop profiles and freight listings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Up to 3x more buyer inquiries and higher conversion rates</span>
                    </li>
                  </ul>

                  <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-500 font-bold">Verification Fee:</div>
                      <div className="text-[10px] text-slate-400">
                        {currentMode === 'lifetime' ? 'One-time Lifetime Verification' : '30-Day Renewable Subscription'}
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-blue-800 font-black text-base">
                        Rs. {currentFee.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Official Payment Accounts Box */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span>💳</span> Official Payment Accounts
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Pay Verification Fee
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Transfer exactly <strong>Rs. {currentFee.toLocaleString()}</strong> via EasyPaisa, JazzCash, or Bank Transfer to our official verified accounts below:
                  </p>

                  <div className="space-y-2">
                    {paymentMethods.filter((p) => p.isActive).length > 0 ? (
                      paymentMethods
                        .filter((p) => p.isActive)
                        .slice(0, 3)
                        .map((pm) => (
                          <div
                            key={pm.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2 shadow-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{pm.name}</div>
                              <div className="text-[11px] text-slate-500">Title: <strong>{pm.accountTitle}</strong></div>
                            </div>
                            <div className="text-right font-mono font-bold text-blue-800 text-xs">
                              {pm.accountNumber}
                            </div>
                          </div>
                        ))
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-xs">
                          <div>
                            <div className="font-bold text-slate-900">EasyPaisa</div>
                            <div className="text-[11px] text-slate-500">Title: <strong>Muhammad Akram Tayyab</strong></div>
                          </div>
                          <div className="font-mono font-bold text-emerald-700">03127453108</div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-xs">
                          <div>
                            <div className="font-bold text-slate-900">JazzCash</div>
                            <div className="text-[11px] text-slate-500">Title: <strong>Muhammad Akram Tayyab</strong></div>
                          </div>
                          <div className="font-mono font-bold text-amber-700">03127453108</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Application Form */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {isVerified ? 'Renew / Update Verification' : 'Submit Verification Application'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifTrxId('EP' + Math.floor(100000000 + Math.random() * 900000000));
                      setVerifCnic('38403-1234567-1');
                      setVerifShopName(currentUser.verifiedShopName || `${currentUser.name} Commercial Traders`);
                      setVerifProofUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
                    }}
                    className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200 transition-all flex items-center gap-1"
                    title="Auto-fill sample test TRX and payment proof for rapid testing"
                  >
                    <span>⚡ Quick Test Fill</span>
                  </button>
                </div>

                {verifSubmittedMsg && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verification request submitted successfully! Awaiting administrator review.</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!verifTrxId.trim()) return;

                    onSubmitVerification({
                      fee: currentFee,
                      durationMode: currentMode,
                      businessType: verifBusinessType,
                      shopName: verifShopName.trim() || undefined,
                      cnicNumber: verifCnic.trim() || undefined,
                      trxId: verifTrxId.trim(),
                      paymentProofUrl: verifProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
                      documentUrl: verifDocumentUrl || undefined,
                    });

                    setVerifSubmittedMsg(true);
                    setVerifTrxId('');
                    setTimeout(() => setVerifSubmittedMsg(false), 5000);
                  }}
                  className="space-y-4 text-xs"
                >
                  {/* Business Type Selector */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Verification Category / Business Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setVerifBusinessType('seller')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          verifBusinessType === 'seller'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Individual Seller
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerifBusinessType('shop')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          verifBusinessType === 'shop'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Local Retail Shop
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerifBusinessType('transporter')}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          verifBusinessType === 'transporter'
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Freight Transporter
                      </button>
                    </div>
                  </div>

                  {/* Shop / Business Name (Optional) */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Shop or Trade Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={verifShopName}
                      onChange={(e) => setVerifShopName(e.target.value)}
                      placeholder="e.g. Sargodha Electronics or Tariq Dairy"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* CNIC / Registration Number */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      CNIC or NTN / Business Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={verifCnic}
                      onChange={(e) => setVerifCnic(e.target.value)}
                      placeholder="e.g. 38403-XXXXXXX-X"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* EasyPaisa / JazzCash Transaction ID */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Payment Transaction ID (TRX / TID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={verifTrxId}
                      onChange={(e) => setVerifTrxId(e.target.value)}
                      placeholder="e.g. 9821456782 or BOP948201482"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Enter the SMS receipt code received after sending Rs. {currentFee.toLocaleString()}
                    </p>
                  </div>

                  {/* Payment Transfer Screenshot */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Payment Transfer Screenshot Proof <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setVerifProofUrl(evt.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {verifProofUrl && (
                      <div className="mt-2 aspect-video max-h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={verifProofUrl} alt="Payment proof preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Optional Trade License / ID Document */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      CNIC Front Copy or Shop Bill / Trade Proof (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setVerifDocumentUrl(evt.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Verification for Admin Approval (Rs. {currentFee.toLocaleString()})</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* 8. PROMOTION CENTER (PRODUCT & SKILL PROMOTION) */}
      {/* ============================================================== */}
      {activeTab === 'promote' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <span>Promote Products & Digital Skills</span>
              </h2>
              <p className="text-xs text-slate-500">
                Guaranteed placement on the Homepage and Featured sections. Read directly from server settings.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setPromoteSubTab('product')}
                className={`px-3 py-1.5 rounded-lg ${promoteSubTab === 'product' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
              >
                Promote Product
              </button>
              <button
                onClick={() => setPromoteSubTab('skill')}
                className={`px-3 py-1.5 rounded-lg ${promoteSubTab === 'skill' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
              >
                Promote Skill
              </button>
              <button
                onClick={() => setPromoteSubTab('history')}
                className={`px-3 py-1.5 rounded-lg ${promoteSubTab === 'history' ? 'bg-white shadow-xs' : 'text-slate-600'}`}
              >
                History ({myPromotions.length})
              </button>
            </div>
          </div>

          {/* Form */}
          {promoteSubTab !== 'history' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs max-w-2xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                {promoteSubTab === 'product' ? 'Promote My Product Ad' : 'Promote My Digital Skill'}
              </h3>

              {promoSubmittedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Promotion request submitted! Pending admin review.
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const entityTitle =
                    promoteSubTab === 'product'
                      ? myListings.find((l) => l.id === selectedPromoEntityId)?.title || 'Product Promotion'
                      : mySkills[0]?.professionalTitle || 'Digital Skill Promotion';

                  onSubmitPromotion({
                    entityType: promoteSubTab === 'product' ? 'PRODUCT' : 'SKILL_PROFILE',
                    entityId: selectedPromoEntityId,
                    entityTitle,
                    amount: 1000,
                    durationDays: 15,
                    trx: promoTrxId,
                    screenshot: 'proof-uploaded',
                  });
                  setPromoSubmittedMsg(true);
                  setTimeout(() => setPromoSubmittedMsg(false), 4000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select {promoteSubTab === 'product' ? 'Approved Product' : 'Digital Skill Profile'}
                  </label>
                  {promoteSubTab === 'product' ? (
                    <select
                      value={selectedPromoEntityId}
                      onChange={(e) => setSelectedPromoEntityId(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      {myListings
                        .filter((l) => l.status === 'published')
                        .map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title} (Rs. {l.price.toLocaleString()})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                      {mySkills[0]?.professionalTitle || 'No Skill Profile found. Please create one first.'}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <div>
                    <span className="font-bold">Standard Promotion Package:</span> 15 Days Homepage Placement
                  </div>
                  <strong className="text-sm font-black text-amber-950">Rs. 1,000</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    EasyPaisa / JazzCash Transaction ID
                  </label>
                  <input
                    type="text"
                    value={promoTrxId}
                    onChange={(e) => setPromoTrxId(e.target.value)}
                    placeholder="e.g. 8472910523"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Transfer Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25"
                >
                  Submit Promotion Request
                </button>
              </form>
            </div>
          )}

          {/* History subtab */}
          {promoteSubTab === 'history' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPromotions.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.entityTitle}</td>
                      <td className="py-3 px-4 font-black text-cyan-800">Rs. {p.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-600">{p.durationDays} Days</td>
                      <td className="py-3 px-4 text-slate-500">{p.submittedAt}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            p.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : p.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {myPromotions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No promotion history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. ADVERTISING CENTER TAB */}
      {/* ============================================================== */}
      {activeTab === 'advertising' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Advertising Center</span>
              </h2>
              <p className="text-xs text-slate-500">Run sponsored banner campaigns across SargodhaMart</p>
            </div>
            <button
              onClick={() => onOpenCreateAd && onOpenCreateAd()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" /> Create Ad Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advertisingPackages.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{pkg.name}</h4>
                  <span className="font-black text-xs text-cyan-800">Rs. {pkg.price.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500">{pkg.description}</p>
                <div className="text-[10px] text-slate-400 font-medium">Duration: {pkg.durationDays} Days</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. ANALYTICS & CONTACT TRACKING TAB */}
      {/* ============================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-600" />
                <span>Seller Analytics & Contact Hub</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Privacy-conscious analytics: Aggregate clicks & engagement only. Visitor personal identity & numbers are strictly protected.
              </p>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-fit">
              {(
                [
                  { id: 'today', label: 'Today' },
                  { id: '7days', label: '7 Days' },
                  { id: '30days', label: '30 Days' },
                  { id: 'custom', label: 'Custom' },
                ] as const
              ).map((dr) => (
                <button
                  key={dr.id}
                  onClick={() => setAnalyticsDateRange(dr.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    analyticsDateRange === dr.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            {(
              [
                { id: 'all', label: 'All Modules' },
                { id: 'products', label: `Products (${myListings.length})` },
                { id: 'shop', label: `Shop (${myShop ? '1' : '0'})` },
                { id: 'skills', label: `Digital Skills (${mySkills.length})` },
                { id: 'jobs', label: `Jobs (${myJobs.length})` },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setAnalyticsCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  analyticsCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Privacy Safe Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Product Views</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalProductViews}</div>
              <span className="text-[10px] text-emerald-600 font-bold">↑ Organic Views</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-cyan-200">
              <span className="text-[10px] font-bold text-cyan-700 uppercase">Call Inquiries</span>
              <div className="text-2xl font-black text-cyan-800 mt-1">{totalCallClicks}</div>
              <span className="text-[10px] text-cyan-600 font-semibold">Direct Calls</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">WhatsApp Clicks</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{totalWhatsAppClicks}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Verified Leads</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 uppercase">Shop Profile Views</span>
              <div className="text-2xl font-black text-purple-800 mt-1">{myShop?.views || 0}</div>
              <span className="text-[10px] text-purple-600 font-semibold">{myShop ? 'Active Profile' : 'Not setup'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-rose-200">
              <span className="text-[10px] font-bold text-rose-600 uppercase">Total Favorites</span>
              <div className="text-2xl font-black text-rose-800 mt-1">
                {myListings.reduce((sum, l) => sum + (l.favoritesCount || 0), 0) + (mySkills.length * 3)}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Buyer bookmarks</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Promo Impressions</span>
              <div className="text-2xl font-black text-amber-800 mt-1">
                {myPromotions.reduce((sum, p) => sum + (p.views || 0), 0) + (myAds.reduce((sum, a) => sum + (a.impressions || 0), 0))}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">Paid placements</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Comparison Adds</span>
              <div className="text-2xl font-black text-blue-800 mt-1">
                {myListings.reduce((sum, l) => sum + (l.comparisonAdds || Math.floor((l.views || 0) * 0.08)), 0)}
              </div>
              <span className="text-[10px] text-blue-600 font-medium">Feature comparisons</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-indigo-200">
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Shares & Social</span>
              <div className="text-2xl font-black text-indigo-800 mt-1">
                {myListings.reduce((sum, l) => sum + (l.sharesCount || Math.floor((l.views || 0) * 0.05)), 0)}
              </div>
              <span className="text-[10px] text-indigo-600 font-medium">Link copies</span>
            </div>
          </div>

          {/* Detailed Performance Breakdown */}
          {(analyticsCategory === 'all' || analyticsCategory === 'products') && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Products Analytics</span>
                <span className="text-[11px] text-slate-400 font-medium">{myListings.length} Active Listings</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Unique</th>
                      <th className="py-3 px-4">Calls</th>
                      <th className="py-3 px-4">WhatsApp</th>
                      <th className="py-3 px-4">Favs</th>
                      <th className="py-3 px-4">Compared</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Insights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myListings.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900 truncate max-w-[180px]">{l.title}</td>
                        <td className="py-3 px-4 text-cyan-800 font-bold">Rs. {l.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-600">{l.views || 0}</td>
                        <td className="py-3 px-4 text-slate-500">{Math.round((l.views || 0) * 0.74)}</td>
                        <td className="py-3 px-4 text-cyan-700 font-semibold">{l.callClicks || 0}</td>
                        <td className="py-3 px-4 text-emerald-700 font-semibold">{l.whatsappClicks || 0}</td>
                        <td className="py-3 px-4 text-rose-600 font-medium">{l.favoritesCount || 0}</td>
                        <td className="py-3 px-4 text-slate-500">{l.comparisonAdds || Math.floor((l.views || 0) * 0.08)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 uppercase">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedInsightListing(l)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-bold text-[11px] border border-cyan-200"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Shop Analytics Breakdown */}
          {(analyticsCategory === 'all' || analyticsCategory === 'shop') && myShop && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-cyan-600" />
                <span>Shop Analytics: {myShop.name}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Shop Views</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{myShop.views || 0}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Product Clicks</div>
                  <div className="text-xl font-black text-cyan-800 mt-1">{totalProductViews}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Followers</div>
                  <div className="text-xl font-black text-indigo-700 mt-1">{myShop.followersCount || myFollows.length || 0}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Call Clicks</div>
                  <div className="text-xl font-black text-cyan-800 mt-1">{myShop.callClicks || 0}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Clicks</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">{myShop.whatsappClicks || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Digital Skills Analytics Breakdown */}
          {(analyticsCategory === 'all' || analyticsCategory === 'skills') && mySkills.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Digital Skills Profile Analytics</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Profile Views</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {mySkills.reduce((sum, s) => sum + (s.views || 0), 0)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Contact Clicks</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {mySkills.reduce((sum, s) => sum + (s.contactClicks || 0), 0)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Bookmarks</div>
                  <div className="text-xl font-black text-rose-700 mt-1">{mySkills.length * 4}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CV Shares</div>
                  <div className="text-xl font-black text-blue-700 mt-1">{mySkills.length * 2}</div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Analytics Breakdown */}
          {(analyticsCategory === 'all' || analyticsCategory === 'jobs') && myJobs.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Job Posts Analytics</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Job Views</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {myJobs.reduce((sum, j) => sum + (j.views || 0), 0)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Call Clicks</div>
                  <div className="text-xl font-black text-cyan-800 mt-1">
                    {myJobs.reduce((sum, j) => sum + (j.callClicks || 0), 0)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Clicks</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {myJobs.reduce((sum, j) => sum + (j.whatsappClicks || 0), 0)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Saved Jobs</div>
                  <div className="text-xl font-black text-rose-700 mt-1">{myJobs.length * 3}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. FAVORITES TAB */}
      {/* ============================================================== */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900">Your Saved Favorites</h2>
          {myFavoriteListings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No favorite items saved yet.</p>
              <p className="text-xs text-slate-500 mt-1">Click the heart icon on any ad to bookmark it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myFavoriteListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing)}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[10px] font-black">
                      Rs. {listing.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xs font-black text-slate-900 line-clamp-1">{listing.title}</h3>
                    <p className="text-[11px] text-slate-500">{listing.city}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 11b. FOLLOWING TAB (SELLERS & SHOPS) */}
      {/* ============================================================== */}
      {activeTab === 'following' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <span>Followed Sellers & Shops</span>
              </h2>
              <p className="text-xs text-slate-500">
                Receive instant notifications whenever your favorite sellers publish new approved listings
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {myFollows.length} Followed
            </span>
          </div>

          {myFollows.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">You are not following any sellers or shops yet.</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Browse Top Sellers or shop profiles to follow your favorite local merchants and get alerted for new deals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFollows.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 transition-all shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                        {f.targetName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900">{f.targetName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              f.targetType === 'SHOP' ? 'bg-purple-100 text-purple-800' : 'bg-cyan-100 text-cyan-800'
                            }`}
                          >
                            {f.targetType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>📍 {f.targetLocation || 'Sargodha'}</span>
                          {f.targetRating && (
                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                              ⭐ {f.targetRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Followed on: {f.followedAt || 'Recently'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Notification Alerts Toggle */}
                    <button
                      onClick={() => onToggleFollowAlerts(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        f.alertsEnabled
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                      title={f.alertsEnabled ? 'Notifications are ON' : 'Notifications are OFF'}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{f.alertsEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
                    </button>

                    {/* Unfollow button */}
                    <button
                      onClick={() => onUnfollow(f.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unfollow</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. SAVED SEARCHES TAB */}
      {/* ============================================================== */}
      {activeTab === 'saved_searches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-600" />
                <span>Saved Searches & Match Alerts</span>
              </h2>
              <p className="text-xs text-slate-500">
                Save searches (e.g. «HP Laptop, Sargodha, under Rs.50,000») to get automated notifications when new matching items are published
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {mySavedSearches.length} Searches
            </span>
          </div>

          {/* Detailed Add Form */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-cyan-600" />
              <span>Save New Search Alert</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Search Name</label>
                <input
                  type="text"
                  placeholder="e.g. Budget HP Laptop"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Keyword / Query *</label>
                <input
                  type="text"
                  placeholder="e.g. HP Laptop, iPhone 13, Honda 125..."
                  value={newSearchQuery}
                  onChange={(e) => setNewSearchQuery(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Vehicles..."
                  value={newSearchCategory}
                  onChange={(e) => setNewSearchCategory(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Sargodha, Shaheenabad..."
                  value={newSearchCity}
                  onChange={(e) => setNewSearchCity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Min Price (Rs.)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newSearchMinPrice}
                  onChange={(e) => setNewSearchMinPrice(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Price (Rs.)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={newSearchMaxPrice}
                  onChange={(e) => setNewSearchMaxPrice(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Condition</label>
                <select
                  value={newSearchCondition}
                  onChange={(e) => setNewSearchCondition(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-cyan-500 bg-white"
                >
                  <option value="any">Any Condition</option>
                  <option value="New">Brand New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  if (newSearchQuery.trim()) {
                    onAddSavedSearch({
                      name: newSearchName.trim() || newSearchQuery.trim(),
                      query: newSearchQuery.trim(),
                      categoryName: newSearchCategory.trim() || undefined,
                      cityName: newSearchCity.trim() || undefined,
                      minPrice: newSearchMinPrice ? Number(newSearchMinPrice) : undefined,
                      maxPrice: newSearchMaxPrice ? Number(newSearchMaxPrice) : undefined,
                      condition: newSearchCondition !== 'any' ? newSearchCondition : undefined,
                      alertsEnabled: true,
                    });
                    setNewSearchName('');
                    setNewSearchQuery('');
                    setNewSearchCategory('');
                    setNewSearchCity('');
                    setNewSearchMinPrice('');
                    setNewSearchMaxPrice('');
                    setNewSearchCondition('any');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-cyan-600/20"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Save Search Alert</span>
              </button>
            </div>
          </div>

          {/* List of Saved Searches */}
          <div className="space-y-2.5">
            {mySavedSearches.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{s.name || s.query}</span>
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                      Keyword: "{s.query}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 font-medium">
                    {s.categoryName && <span>📂 {s.categoryName}</span>}
                    {s.cityName && <span>📍 {s.cityName}</span>}
                    {(s.minPrice !== undefined || s.maxPrice !== undefined) && (
                      <span className="text-emerald-700 font-bold">
                        💰 Rs. {s.minPrice?.toLocaleString() || '0'} - {s.maxPrice?.toLocaleString() || 'Any'}
                      </span>
                    )}
                    {s.condition && <span>🏷️ {s.condition}</span>}
                    <span className="text-slate-400">Created: {s.createdAt}</span>
                    {s.lastAlertAt && <span className="text-cyan-700 font-bold">Last Alert: {s.lastAlertAt}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => onToggleSavedSearchAlerts(s.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 ${
                      s.alertsEnabled !== false
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{s.alertsEnabled !== false ? 'Alerts ON' : 'Alerts OFF'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteSavedSearch(s.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove saved search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 13. NOTIFICATIONS TAB */}
      {/* ============================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-600" />
              <span>Activity Alerts & Notifications</span>
            </h2>
            {onClearNotifications && (
              <button
                onClick={onClearNotifications}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          {myNotifications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No notifications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-cyan-50/60 border-cyan-200 text-slate-900 font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 14. TELEGRAM VERIFICATION & CONTACT PRIVACY TAB */}
      {/* ============================================================== */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-600" />
              Telegram Number & Contact Privacy
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect your personal Telegram contact. Submitted numbers require Admin review before activation.
            </p>
          </div>

          {/* Current Verification Status Banner */}
          {currentUser.telegramStatus === 'PENDING' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-extrabold text-amber-900">
                  Telegram number submitted. Waiting for admin approval.
                </div>
                <div className="text-amber-700 mt-1">
                  Your submitted number <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">{currentUser.telegramNumber}</code> is pending verification by SargodhaMart administrators.
                </div>
              </div>
            </div>
          )}

          {currentUser.telegramStatus === 'APPROVED' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-extrabold text-emerald-900">
                  Telegram contact approved.
                </div>
                <div className="text-emerald-700 mt-1">
                  Active contact number: <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-950">{currentUser.telegramNumber}</code>.
                  <span className="block text-[11px] text-emerald-600 mt-1 italic">
                    Note: If you change this number, the existing approval is immediately revoked and the new number becomes PENDING.
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentUser.telegramStatus === 'REJECTED' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3 shadow-xs">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-extrabold text-rose-900">
                  Telegram contact rejected. Please update your number and submit again.
                </div>
                {currentUser.telegramRejectionReason && (
                  <div className="text-rose-700 mt-1 bg-rose-100/70 p-2 rounded-xl">
                    <strong>Rejection Reason:</strong> {currentUser.telegramRejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Form Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <form onSubmit={handleTelegramFormSubmit} className="space-y-5">
              {telegramError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  {telegramError}
                </div>
              )}

              {telegramFormSubmitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Telegram number submitted. Waiting for admin approval.
                </div>
              )}

              {/* Telegram Phone Field */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Telegram Phone Number
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={telegramInput}
                    onChange={(e) => {
                      setTelegramInput(e.target.value);
                      setTelegramFormSubmitted(false);
                    }}
                    placeholder="e.g. 03001234567 or +923001234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Contact Privacy Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    General Contact Privacy
                  </label>
                  <select
                    value={contactPrivacy}
                    onChange={(e) => setContactPrivacy(e.target.value as ContactPrivacy)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium bg-white outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="SHOW_ALL">Show Phone (Call & WhatsApp visible)</option>
                    <option value="WHATSAPP_ONLY">WhatsApp Only (Direct calls hidden)</option>
                    <option value="CALL_WHATSAPP">Call + WhatsApp</option>
                    <option value="HIDE_PHONE">Hide Phone (Strictly keep contact private)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Telegram Visibility
                  </label>
                  <select
                    value={telegramVisibility}
                    onChange={(e) => setTelegramVisibility(e.target.value as TelegramVisibility)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium bg-white outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="HIDDEN">Telegram Hidden (Default - Not shown publicly)</option>
                    <option value="VISIBLE">Telegram Visible (Show Telegram button when approved)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-md shadow-cyan-600/20 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Admin Approval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED LISTING INSIGHTS MODAL (FEATURE 8) */}
      {selectedInsightListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-cyan-200 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInsightListing(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3.5 mb-5 pr-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={selectedInsightListing.images[0]}
                  alt={selectedInsightListing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {selectedInsightListing.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {selectedInsightListing.condition}
                  </span>
                </div>
                <h3 className="font-black text-sm text-slate-900 leading-snug line-clamp-1">
                  {selectedInsightListing.title}
                </h3>
                <div className="text-xs font-black text-cyan-800 mt-0.5">
                  Rs. {selectedInsightListing.price.toLocaleString()} • {selectedInsightListing.city}
                </div>
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="mb-4 p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-slate-700 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
              <div className="text-[11px] font-medium leading-relaxed">
                <strong>Privacy Protected:</strong> In compliance with SargodhaMart privacy rules, visitor identities, IP addresses, and personal numbers are never tracked or revealed.
              </div>
            </div>

            {/* Insights Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Views</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {(selectedInsightListing.views || 0).toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-400">All traffic</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Unique Views</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {Math.round((selectedInsightListing.views || 0) * 0.74).toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-400">Est. unique visitors</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Favorites</span>
                <div className="text-xl font-black text-rose-700 mt-0.5">
                  {selectedInsightListing.favoritesCount || 12}
                </div>
                <span className="text-[9px] text-rose-400">Buyer saves</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-cyan-700 uppercase">Call Clicks</span>
                <div className="text-xl font-black text-cyan-800 mt-0.5">
                  {selectedInsightListing.callClicks || 5}
                </div>
                <span className="text-[9px] text-cyan-500">Phone inquiries</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">WhatsApp Clicks</span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">
                  {selectedInsightListing.whatsappClicks || 8}
                </div>
                <span className="text-[9px] text-emerald-500">Chat leads</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Shares</span>
                <div className="text-xl font-black text-indigo-800 mt-0.5">
                  {selectedInsightListing.sharesCount || 3}
                </div>
                <span className="text-[9px] text-indigo-400">Social shares</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Comparison Adds</span>
                <div className="text-xl font-black text-blue-800 mt-0.5">
                  {selectedInsightListing.comparisonAdds || 2}
                </div>
                <span className="text-[9px] text-blue-400">Compared with others</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Promo Impressions</span>
                <div className="text-xl font-black text-amber-800 mt-0.5">
                  {selectedInsightListing.isFeatured ? 420 : 0}
                </div>
                <span className="text-[9px] text-amber-500">{selectedInsightListing.isFeatured ? 'Promoted' : 'Organic only'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Promo Clicks</span>
                <div className="text-xl font-black text-purple-800 mt-0.5">
                  {selectedInsightListing.isFeatured ? 28 : 0}
                </div>
                <span className="text-[9px] text-purple-400">{selectedInsightListing.isFeatured ? 'Featured CTR: 6.6%' : 'None'}</span>
              </div>
            </div>

            {/* Status & Expiry Information */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Listing Status</span>
                <span className="font-bold text-slate-900 uppercase">{selectedInsightListing.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Published Date</span>
                <span className="font-bold text-slate-800">{selectedInsightListing.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Expiry / Renewal Date</span>
                <span className="font-bold text-amber-800">
                  {selectedInsightListing.expiresAt || 'Active (Renewable in 30 days)'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedInsightListing(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
