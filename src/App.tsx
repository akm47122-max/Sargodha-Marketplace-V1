import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Briefcase,
  LayoutDashboard,
  Shield,
  PlusCircle,
  Flag,
  X,
  CheckCircle2,
  Sparkles,
  LogIn,
  UserCheck,
  Megaphone,
  Wrench,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Download,
  Bell,
  Trophy,
  Compass,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Package,
  Search,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Server,
  Lock,
  GraduationCap,
} from 'lucide-react';
import {
  Listing,
  JobPost,
  UserProfile,
  ActivationPayment,
  ReportItem,
  City,
  SiteSettings,
  AnnouncementItem,
  TelegramLogItem,
  Division,
  District,
  Tehsil,
  AreaLocation,
  DigitalSkillProfile,
  PromotionPayment,
  AdvertisingPackage,
  Advertisement,
  AdvertisingPayment,
  UserTelegramAuditLog,
  TelegramVisibility,
  ContactPrivacy,
  PaymentMethod,
  BusinessShop,
  SellerReview,
  SellerVerificationRecord,
  VerifiedBadgeDurationMode,
  UserNotification,
  SavedSearch,
  SellerFollow,
  TruckListing,
  LoadRequest,
  TransporterProfile,
  FreightQuotation,
  TransportBooking,
  TransporterSubscriptionPlan,
  TransporterSubscriptionPurchase,
  BookingStatus,
  CollegeAd,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_JOBS,
  INITIAL_PAYMENTS,
  INITIAL_REPORTS,
  INITIAL_DIGITAL_SKILLS,
  INITIAL_PROMOTIONS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_SHOPS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SAVED_SEARCHES,
  INITIAL_COLLEGE_ADS,
} from './data/mockData';
import {
  DEFAULT_ADVERTISING_PACKAGES,
  INITIAL_ADVERTISEMENTS,
  INITIAL_ADVERTISING_PAYMENTS,
} from './data/advertisingData';
import { DEFAULT_SITE_SETTINGS, INITIAL_ANNOUNCEMENTS } from './data/defaultSettings';
import { INITIAL_DIVISIONS, INITIAL_DISTRICTS, INITIAL_TEHSILS, INITIAL_AREAS } from './data/locationData';
import {
  INITIAL_TRUCKS,
  INITIAL_LOADS,
  INITIAL_TRANSPORTERS,
  INITIAL_QUOTATIONS,
  INITIAL_BOOKINGS,
  INITIAL_TRANSPORTER_PLANS,
  INITIAL_SUBSCRIPTION_PURCHASES,
  INITIAL_VERIFICATIONS as INITIAL_SELLER_VERIFICATIONS,
} from './data/transportData';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { JobsSection } from './components/JobsSection';
import { DigitalSkillsSection } from './components/DigitalSkillsSection';
import { SkillProfileModal } from './components/SkillProfileModal';
import { PostSkillModal } from './components/PostSkillModal';
import { PromoteModal } from './components/PromoteModal';
import { CreateAdModal } from './components/CreateAdModal';
import { SponsoredBanner } from './components/SponsoredBanner';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { ProductDetailModal } from './components/ProductDetailModal';
import { JobDetailModal } from './components/JobDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { PostJobModal } from './components/PostJobModal';
import { ActivationModal } from './components/ActivationModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { UserDashboard } from './components/UserDashboard';
import { NearbySection } from './components/NearbySection';
import { TopSellersSection } from './components/TopSellersSection';
import { TransportSection } from './components/TransportSection';
import { ShopProfileView } from './components/ShopProfileView';
import { PostLoadModal } from './components/PostLoadModal';
import { PostTruckModal } from './components/PostTruckModal';
import { LoadDetailModal } from './components/LoadDetailModal';
import { TruckDetailModal } from './components/TruckDetailModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { VerifiedBadge } from './components/VerifiedBadge';
import { FoodSection } from './components/FoodSection';
import { HostingerDeployModal } from './components/HostingerDeployModal';
import { IntroScreen } from './components/IntroScreen';
import { CollegesSection } from './components/CollegesSection';
import { PostCollegeAdModal } from './components/PostCollegeAdModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { updatePageSEO, getProductSEO, getJobSEO, resetDefaultSEO } from './utils/seo';
import { getActiveAnnouncements } from './utils/settings';
import { broadcastToTelegram } from './utils/telegram';
import { api } from './services/api';

export function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<
    'home' | 'food' | 'jobs' | 'skills' | 'transport' | 'colleges' | 'top-sellers' | 'nearby' | 'dashboard' | 'admin' | 'post-ad' | 'post-job'
  >('home');

  // Central Website Settings State with localStorage persistence
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sargodha_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Announcements State with localStorage persistence
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('sargodha_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [dismissedPopupId, setDismissedPopupId] = useState<number | null>(null);

  // Core Data States with localStorage persistence
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('sargodha_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Website opens as Public Marketplace by default (Guest mode)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sargodha_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null; // Public marketplace first
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('sargodha_listings');
    const rawListings: Listing[] = saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    return rawListings.map((l) => {
      const isSellerVerified = l.sellerVerified || INITIAL_USERS.some((u) => u.id === l.userId && u.isVerified);
      return isSellerVerified ? { ...l, sellerVerified: true } : l;
    });
  });

  const [dashboardInitialTab, setDashboardInitialTab] = useState<string>('overview');

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('sargodha_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [payments, setPayments] = useState<ActivationPayment[]>(() => {
    const saved = localStorage.getItem('sargodha_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('sargodha_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Digital Skills State with localStorage persistence
  const [skills, setSkills] = useState<DigitalSkillProfile[]>(() => {
    const saved = localStorage.getItem('sargodha_skills');
    return saved ? JSON.parse(saved) : INITIAL_DIGITAL_SKILLS;
  });

  // Separate Promotions State with localStorage persistence
  const [promotions, setPromotions] = useState<PromotionPayment[]>(() => {
    const saved = localStorage.getItem('sargodha_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  // Separate Advertising System States with localStorage persistence
  const [advertisingPackages, setAdvertisingPackages] = useState<AdvertisingPackage[]>(() => {
    const saved = localStorage.getItem('sargodha_ad_packages');
    return saved ? JSON.parse(saved) : DEFAULT_ADVERTISING_PACKAGES;
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('sargodha_advertisements');
    return saved ? JSON.parse(saved) : INITIAL_ADVERTISEMENTS;
  });

  const [advertisingPayments, setAdvertisingPayments] = useState<AdvertisingPayment[]>(() => {
    const saved = localStorage.getItem('sargodha_ad_payments');
    return saved ? JSON.parse(saved) : INITIAL_ADVERTISING_PAYMENTS;
  });

  // Central Payment Methods State with localStorage persistence
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('sargodha_payment_methods');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PAYMENT_METHODS;
  });

  const handleSavePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => {
      const exists = prev.some((m) => m.id === method.id);
      const updated = exists ? prev.map((m) => (m.id === method.id ? method : m)) : [...prev, method];
      try {
        localStorage.setItem('sargodha_payment_methods', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Payment method "${method.name}" successfully updated.`);
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('sargodha_payment_methods', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Payment method removed.');
  };

  const handleTogglePaymentMethodStatus = (id: number) => {
    setPaymentMethods((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m));
      try {
        localStorage.setItem('sargodha_payment_methods', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Payment method status toggled.');
  };

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('sargodha_favorites');
    return saved ? JSON.parse(saved) : [1];
  });

  // Shops State with localStorage persistence
  const [shops, setShops] = useState<BusinessShop[]>(() => {
    const saved = localStorage.getItem('sargodha_shops');
    return saved ? JSON.parse(saved) : INITIAL_SHOPS;
  });

  // Reviews State with localStorage persistence
  const [reviews, setReviews] = useState<SellerReview[]>(() => {
    const saved = localStorage.getItem('sargodha_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Seller Verifications State with localStorage persistence
  const [verifications, setVerifications] = useState<SellerVerificationRecord[]>(() => {
    const saved = localStorage.getItem('sargodha_seller_verifications');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_VERIFICATIONS;
  });

  // Notifications State with localStorage persistence
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem('sargodha_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Saved Searches State with localStorage persistence
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('sargodha_saved_searches');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_SEARCHES;
  });

  // Seller & Shop Follows State with localStorage persistence
  const [follows, setFollows] = useState<SellerFollow[]>(() => {
    const saved = localStorage.getItem('sargodha_follows');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        userId: 2,
        targetType: 'SHOP',
        targetId: 1,
        targetName: 'Al-Madina Agro & Kinnow Mandi Traders',
        targetLocation: 'Sargodha',
        targetRating: 4.9,
        alertsEnabled: true,
        followedAt: '2026-02-15',
      },
    ];
  });

  // Multi-City Location Hierarchy State
  const [divisions, setDivisions] = useState<Division[]>(() => {
    const saved = localStorage.getItem('sargodha_divisions');
    return saved ? JSON.parse(saved) : INITIAL_DIVISIONS;
  });
  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem('sargodha_districts');
    return saved ? JSON.parse(saved) : INITIAL_DISTRICTS;
  });
  const [tehsils, setTehsils] = useState<Tehsil[]>(() => {
    const saved = localStorage.getItem('sargodha_tehsils');
    return saved ? JSON.parse(saved) : INITIAL_TEHSILS;
  });
  const [areas, setAreas] = useState<AreaLocation[]>(() => {
    const saved = localStorage.getItem('sargodha_areas');
    return saved ? JSON.parse(saved) : INITIAL_AREAS;
  });

  // Nationwide Freight & Transport Logistics State
  const [trucks, setTrucks] = useState<TruckListing[]>(() => {
    const saved = localStorage.getItem('sargodha_trucks');
    return saved ? JSON.parse(saved) : INITIAL_TRUCKS;
  });
  const [loads, setLoads] = useState<LoadRequest[]>(() => {
    const saved = localStorage.getItem('sargodha_loads');
    return saved ? JSON.parse(saved) : INITIAL_LOADS;
  });
  const [transporters, setTransporters] = useState<TransporterProfile[]>(() => {
    const saved = localStorage.getItem('sargodha_transporters');
    return saved ? JSON.parse(saved) : INITIAL_TRANSPORTERS;
  });
  const [quotations, setQuotations] = useState<FreightQuotation[]>(() => {
    const saved = localStorage.getItem('sargodha_quotations');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });
  const [bookings, setBookings] = useState<TransportBooking[]>(() => {
    const saved = localStorage.getItem('sargodha_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState<TransporterSubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('sargodha_subscription_plans');
    return saved ? JSON.parse(saved) : INITIAL_TRANSPORTER_PLANS;
  });
  const [subscriptionPurchases, setSubscriptionPurchases] = useState<TransporterSubscriptionPurchase[]>(() => {
    const saved = localStorage.getItem('sargodha_subscription_purchases');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_PURCHASES;
  });
  const [pendingPostAction, setPendingPostAction] = useState<'post-truck' | 'post-load' | null>(null);
  const [transportExploreFilter, setTransportExploreFilter] = useState<'all' | 'trucks' | 'loads'>('all');
  const [transportExploreSearch, setTransportExploreSearch] = useState('');

  // Modals for Shop, Transport & PWA
  const [selectedShop, setSelectedShop] = useState<BusinessShop | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<TruckListing | null>(null);
  const [selectedLoad, setSelectedLoad] = useState<LoadRequest | null>(null);
  const [isPostTruckOpen, setIsPostTruckOpen] = useState(false);
  const [isPostLoadOpen, setIsPostLoadOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // Telegram Publication Logs
  const [telegramLogs, setTelegramLogs] = useState<TelegramLogItem[]>(() => {
    const saved = localStorage.getItem('sargodha_telegram_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        contentType: 'announcement',
        title: '📢 Official WhatsApp Channel Now Live!',
        status: 'success',
        messageId: '108',
        timestamp: 'Today, 10:15 AM',
      },
    ];
  });

  const handleAddTelegramLog = (log: TelegramLogItem) => {
    setTelegramLogs((prev) => {
      const updated = [log, ...prev].slice(0, 50);
      try {
        localStorage.setItem('sargodha_telegram_logs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // User Telegram Verification Audit Logs
  const [telegramAuditLogs, setTelegramAuditLogs] = useState<UserTelegramAuditLog[]>(() => {
    const saved = localStorage.getItem('sargodha_telegram_audits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        userId: 2,
        userName: 'Ahmed Raza',
        telegramNumber: '03009876543',
        status: 'APPROVED',
        actionType: 'APPROVE',
        reviewedBy: 'Admin (System)',
        reviewedAt: '2026-10-04 14:30:00',
        timestamp: '2026-10-04 14:30:00',
      },
    ];
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<DigitalSkillProfile | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isPostSkillOpen, setIsPostSkillOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<DigitalSkillProfile | null>(null);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [promotePreselectedType, setPromotePreselectedType] = useState<'PRODUCT' | 'SKILL'>('PRODUCT');
  const [promotePreselectedId, setPromotePreselectedId] = useState<number | undefined>(undefined);
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [createAdPreselectedPkgId, setCreateAdPreselectedPkgId] = useState<number | undefined>(undefined);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'listing' | 'job'; item: Listing | JobPost } | null>(null);
  const [reportReason, setReportReason] = useState('Scam / Fake');
  const [reportDetails, setReportDetails] = useState('');
  const [isHostingerModalOpen, setIsHostingerModalOpen] = useState(false);

  // 3D Intro Screen state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const seen = sessionStorage.getItem('sargodha_intro_seen');
      return !seen;
    } catch {
      return false;
    }
  });

  // Colleges, Admissions & Campus Ads State
  const [collegeAds, setCollegeAds] = useState<CollegeAd[]>(() => {
    const saved = localStorage.getItem('sargodha_college_ads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_COLLEGE_ADS;
  });
  const [isPostCollegeAdModalOpen, setIsPostCollegeAdModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Secure Admin Portal routing handler (checks if current user is admin, else prompts login)
  const handleAdminPortalClick = () => {
    if (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sargodha_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sargodha_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('sargodha_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sargodha_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sargodha_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sargodha_college_ads', JSON.stringify(collegeAds));
  }, [collegeAds]);

  // Keep currentUser synchronized with fresh user attributes (isVerified, activation, etc.)
  useEffect(() => {
    if (currentUser) {
      const fresh = users.find((u) => u.id === currentUser.id);
      if (
        fresh &&
        (fresh.isVerified !== currentUser.isVerified ||
          fresh.activationStatus !== currentUser.activationStatus ||
          fresh.verifiedShopName !== currentUser.verifiedShopName ||
          fresh.role !== currentUser.role)
      ) {
        setCurrentUser(fresh);
      }
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sargodha_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('sargodha_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('sargodha_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('sargodha_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sargodha_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('sargodha_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('sargodha_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('sargodha_ad_packages', JSON.stringify(advertisingPackages));
  }, [advertisingPackages]);

  useEffect(() => {
    localStorage.setItem('sargodha_advertisements', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('sargodha_ad_payments', JSON.stringify(advertisingPayments));
  }, [advertisingPayments]);

  useEffect(() => {
    localStorage.setItem('sargodha_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('sargodha_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sargodha_seller_verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('sargodha_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sargodha_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    localStorage.setItem('sargodha_follows', JSON.stringify(follows));
  }, [follows]);

  useEffect(() => {
    localStorage.setItem('sargodha_districts', JSON.stringify(districts));
  }, [districts]);

  useEffect(() => {
    localStorage.setItem('sargodha_tehsils', JSON.stringify(tehsils));
  }, [tehsils]);

  useEffect(() => {
    localStorage.setItem('sargodha_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('sargodha_trucks', JSON.stringify(trucks));
  }, [trucks]);

  useEffect(() => {
    localStorage.setItem('sargodha_loads', JSON.stringify(loads));
  }, [loads]);

  useEffect(() => {
    localStorage.setItem('sargodha_transporters', JSON.stringify(transporters));
  }, [transporters]);

  useEffect(() => {
    localStorage.setItem('sargodha_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('sargodha_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Synchronize authentication session and live data with PHP backend (Native Hostinger session & MySQL)
  useEffect(() => {
    let isMounted = true;

    // Check active PHP session on server
    api.auth.getCurrentUser().then((res) => {
      if (!isMounted) return;
      if (res.success && res.authenticated && res.user) {
        setCurrentUser(res.user);
      }
    }).catch(() => {});

    // Sync published listings from PHP MySQL database
    api.listings.getListings().then((res) => {
      if (!isMounted) return;
      if (res.success && Array.isArray(res.listings) && res.listings.length > 0) {
        setListings((prev) => {
          const apiListings: Listing[] = res.listings.map((l: any) => ({
            id: Number(l.id),
            title: l.title,
            price: Number(l.price) || 0,
            categoryId: Number(l.category_id) || 1,
            categoryName: l.category_name || 'Marketplace',
            description: l.description || '',
            images: Array.isArray(l.images) && l.images.length > 0 ? l.images : (l.primary_image ? [l.primary_image] : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600']),
            city: (l.city as City) || 'Sargodha',
            area: l.area || '',
            condition: (l.item_condition as any) || 'Used',
            createdAt: l.created_at ? new Date(l.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : 'Recently',
            views: Number(l.views_count) || 1,
            featured: Boolean(l.is_featured),
            userId: Number(l.user_id) || 1,
            sellerName: l.seller_name || 'Seller',
            sellerMobile: l.seller_mobile || '',
            sellerVerified: l.seller_activation === 'active' || l.seller_role === 'super_admin',
            isCallAllowed: true,
            isChatAllowed: true,
            isWhatsAppAllowed: true,
            contactPreference: (l.contact_preference as any) || 'Both',
            phone: l.phone_number || l.seller_mobile || '',
            whatsapp: l.whatsapp_number || l.seller_mobile || '',
            exactLocation: l.exact_location || '',
          }));

          const existingIds = new Set(apiListings.map((x) => x.id));
          const nonConflicting = prev.filter((x) => !existingIds.has(x.id));
          return [...apiListings, ...nonConflicting];
        });
      }
    }).catch(() => {});

    // Sync employment listings from Firestore
    api.jobs.getJobs().then((res) => {
      if (!isMounted) return;
      if (res.success && Array.isArray(res.jobs) && res.jobs.length > 0) {
        setJobs((prev) => {
          const apiJobIds = new Set(res.jobs.map((j: any) => j.id));
          const nonConflicting = prev.filter((j) => !apiJobIds.has(j.id));
          return [...res.jobs, ...nonConflicting];
        });
      }
    }).catch(() => {});

    // Sync colleges from Firestore
    api.colleges.getColleges().then((res) => {
      if (!isMounted) return;
      if (res.success && Array.isArray(res.ads) && res.ads.length > 0) {
        setCollegeAds((prev) => {
          const apiAdIds = new Set(res.ads.map((a: any) => a.id));
          const nonConflicting = prev.filter((a) => !apiAdIds.has(a.id));
          return [...res.ads, ...nonConflicting];
        });
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // PWA beforeinstallprompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true);
      setDeferredInstallPrompt(null);
      showToast('SargodhaMart PWA App installed successfully!');
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) {
      showToast('To install SargodhaMart, choose "Add to Home screen" in your browser settings.');
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Installing SargodhaMart App...');
    }
    setDeferredInstallPrompt(null);
  };

  // Automatic Promotion & Advertisement Expiration Routine
  // Promoted items automatically expire after their configured duration.
  // After expiration: status = EXPIRED, product/skill remains on website (NOT deleted),
  // featured badge is removed, normal listing/profile visibility remains.
  // Advertisements automatically stop appearing on the website when duration ends.
  useEffect(() => {
    const now = new Date();
    let hasExpiredChanges = false;

    const updatedPromotions = promotions.map((p) => {
      if (p.status === 'APPROVED' && p.endAt) {
        const endDate = new Date(p.endAt);
        if (now > endDate) {
          hasExpiredChanges = true;
          return { ...p, status: 'EXPIRED' as const };
        }
      }
      return p;
    });

    if (hasExpiredChanges) {
      setPromotions(updatedPromotions);

      // Remove featured badge from expired listings
      setListings((prevListings) =>
        prevListings.map((l) => {
          const hasActivePromo = updatedPromotions.some(
            (p) => p.status === 'APPROVED' && (p.promotionType === 'PRODUCT' || p.entityType === 'PRODUCT') && p.entityId === l.id
          );
          if (!hasActivePromo && l.isFeatured) {
            return { ...l, isFeatured: false };
          }
          return l;
        })
      );

      // Remove featured badge from expired skills
      setSkills((prevSkills) =>
        prevSkills.map((s) => {
          const hasActivePromo = updatedPromotions.some(
            (p) => p.status === 'APPROVED' && (p.promotionType === 'SKILL' || p.entityType === 'SKILL_PROFILE') && p.entityId === s.id
          );
          if (!hasActivePromo && s.isFeatured) {
            return { ...s, isFeatured: false };
          }
          return s;
        })
      );
    }

    // Check Advertisement Expiry
    let hasExpiredAdChanges = false;
    const updatedAds = advertisements.map((ad) => {
      if (ad.status === 'ACTIVE' && ad.endAt) {
        const endDate = new Date(ad.endAt);
        if (now > endDate) {
          hasExpiredAdChanges = true;
          return { ...ad, status: 'EXPIRED' as const };
        }
      }
      return ad;
    });

    if (hasExpiredAdChanges) {
      setAdvertisements(updatedAds);
    }

    // Check Verification Expiry
    let hasExpiredVerifChanges = false;
    const updatedVerifs = verifications.map((v) => {
      if (v.status === 'VERIFIED' && v.expiresAt) {
        const expDate = new Date(v.expiresAt);
        if (now > expDate) {
          hasExpiredVerifChanges = true;
          return { ...v, status: 'EXPIRED' as const };
        }
      }
      return v;
    });

    if (hasExpiredVerifChanges) {
      setVerifications(updatedVerifs);
    }
  }, []);

  // Handle URL parameters for initial load & deep links (?product=123, ?job=123, ?skill=username or /skills/profile/username)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product') || params.get('p');
    const jobId = params.get('job') || params.get('j');
    const skillParam = params.get('skill') || params.get('s') || params.get('profile');

    const path = window.location.pathname;
    let pathUsername = '';
    if (path.includes('/skills/profile/')) {
      pathUsername = path.split('/skills/profile/')[1]?.replace(/\/$/, '');
    }
    const targetSkillUser = skillParam || pathUsername;

    if (productId) {
      const matchProduct = listings.find((l) => l.id.toString() === productId);
      if (matchProduct) {
        setSelectedListing(matchProduct);
        setCurrentView('home');
        return;
      }
    }

    if (jobId) {
      const matchJob = jobs.find((j) => j.id.toString() === jobId);
      if (matchJob) {
        setSelectedJob(matchJob);
        setCurrentView('jobs');
        return;
      }
    }

    if (targetSkillUser) {
      const matchSkill = skills.find(
        (s) => s.username.toLowerCase() === targetSkillUser.toLowerCase() || s.id.toString() === targetSkillUser
      );
      if (matchSkill) {
        setSelectedSkill(matchSkill);
        setCurrentView('skills');
        return;
      }
    }
  }, []);

  // Dynamically update document title, OpenGraph meta tags, Twitter cards, and Schema.org structured data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;

    if (selectedListing) {
      const seo = getProductSEO(selectedListing, origin, settings.websiteName || 'SargodhaMart');
      updatePageSEO(seo);
      window.history.replaceState({ product: selectedListing.id }, '', `${window.location.pathname}?product=${selectedListing.id}`);
    } else if (selectedJob) {
      const seo = getJobSEO(selectedJob, origin, settings.websiteName || 'SargodhaMart');
      updatePageSEO(seo);
      window.history.replaceState({ job: selectedJob.id }, '', `${window.location.pathname}?job=${selectedJob.id}`);
    } else if (selectedSkill) {
      updatePageSEO({
        title: `${selectedSkill.fullName} - ${selectedSkill.professionalTitle} | SargodhaMart Digital Skills`,
        description: selectedSkill.about.slice(0, 160),
        image: selectedSkill.profilePhoto,
        url: `${origin}/skills/profile/${selectedSkill.username}`,
        type: 'profile',
      });
      window.history.replaceState({ skill: selectedSkill.username }, '', `/skills/profile/${selectedSkill.username}`);
    } else {
      if (currentView === 'jobs') {
        updatePageSEO({
          title: `Jobs & Employment in Sargodha, Shaheenabad & Sillanwali | ${settings.websiteName}`,
          description: 'Explore local job vacancies or find skilled workers across Sargodha district. Direct WhatsApp and phone contact without agent commissions.',
          url: `${origin}/?view=jobs`,
          type: 'website',
        });
        window.history.replaceState({}, '', `${window.location.pathname}`);
      } else if (currentView === 'skills') {
        updatePageSEO({
          title: `Digital Skills & Freelancers Directory in Sargodha | ${settings.websiteName}`,
          description: 'Discover verified Website Designers, Video Editors, Developers, and Digital Marketers in Sargodha, Shaheenabad and Sillanwali. Direct contact.',
          url: `${origin}/?view=skills`,
          type: 'website',
        });
        window.history.replaceState({}, '', `${window.location.pathname}`);
      } else {
        updatePageSEO({
          title: settings.defaultSeoTitle,
          description: settings.defaultSeoDescription,
          image: settings.ogImageUrl,
          url: origin,
          type: 'website',
        });
        window.history.replaceState({}, '', `${window.location.pathname}`);
      }
    }
  }, [selectedListing, selectedJob, selectedSkill, currentView, settings]);

  // Account Switcher / Logout
  const handleSwitchUser = (user: UserProfile) => {
    const freshUser = users.find((u) => u.id === user.id) || user;
    setCurrentUser(freshUser);
    showToast(
      `Switched account to: ${freshUser.name} (${freshUser.isVerified ? '✓ Blue Verified' : 'Standard Seller'})`
    );
  };

  const handleLogout = () => {
    api.auth.logout().catch(() => {});
    setCurrentUser(null);
    showToast('Logged out. Browsing as public guest.');
  };

  const handleForceLogoutUser = (userId: number) => {
    const targetUser = users.find((u) => u.id === userId);
    const targetName = targetUser ? targetUser.name : `User #${userId}`;

    if (currentUser?.id === userId) {
      setCurrentUser(null);
      showToast(`User session for "${targetName}" was terminated by Administrator.`);
    } else {
      showToast(`Administrator successfully terminated active session for "${targetName}".`);
    }
  };

  // Colleges & Campus Ads Handlers
  const handleCreateCollegeAd = (
    adData: Omit<CollegeAd, 'id' | 'views' | 'applyClicks' | 'callClicks' | 'whatsappClicks' | 'submittedAt' | 'status'>
  ) => {
    const newAd: CollegeAd = {
      ...adData,
      id: Date.now(),
      views: 0,
      applyClicks: 0,
      callClicks: 0,
      whatsappClicks: 0,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    const updated = [newAd, ...collegeAds];
    setCollegeAds(updated);
    localStorage.setItem('sargodha_college_ads', JSON.stringify(updated));
    showToast(`Admission Ad for ${newAd.instituteName} submitted! Awaiting payment verification (TRX ID: ${newAd.transactionReference}).`);
  };

  const handleApproveCollegeAd = (id: number) => {
    const updated = collegeAds.map((a) => {
      if (a.id === id) {
        const exp = new Date();
        exp.setDate(exp.getDate() + (a.durationDays || 30));
        return {
          ...a,
          status: 'APPROVED' as const,
          approvedAt: new Date().toISOString().split('T')[0],
          expiresAt: exp.toISOString().split('T')[0],
        };
      }
      return a;
    });
    setCollegeAds(updated);
    localStorage.setItem('sargodha_college_ads', JSON.stringify(updated));
    showToast('College advertisement approved and published!');
  };

  const handleRejectCollegeAd = (id: number, reason: string) => {
    const updated = collegeAds.map((a) =>
      a.id === id ? { ...a, status: 'REJECTED' as const, rejectionReason: reason } : a
    );
    setCollegeAds(updated);
    localStorage.setItem('sargodha_college_ads', JSON.stringify(updated));
    showToast('College advertisement marked as rejected.');
  };

  const handleSuspendCollegeAd = (id: number) => {
    const updated = collegeAds.map((a) =>
      a.id === id ? { ...a, status: 'SUSPENDED' as const } : a
    );
    setCollegeAds(updated);
    localStorage.setItem('sargodha_college_ads', JSON.stringify(updated));
    showToast('College advertisement suspended.');
  };

  const handleDeleteCollegeAd = (id: number) => {
    const updated = collegeAds.filter((a) => a.id !== id);
    setCollegeAds(updated);
    localStorage.setItem('sargodha_college_ads', JSON.stringify(updated));
    showToast('College advertisement deleted.');
  };

  const handleTrackCollegeAction = (type: 'apply' | 'call' | 'whatsapp', adId: number) => {
    setCollegeAds((prev) =>
      prev.map((a) => {
        if (a.id === adId) {
          return {
            ...a,
            applyClicks: type === 'apply' ? a.applyClicks + 1 : a.applyClicks,
            callClicks: type === 'call' ? a.callClicks + 1 : a.callClicks,
            whatsappClicks: type === 'whatsapp' ? a.whatsappClicks + 1 : a.whatsappClicks,
          };
        }
        return a;
      })
    );
  };

  // Settings Management Handlers
  const handleSaveSettings = (updated: SiteSettings) => {
    setSettings(updated);
    showToast('Website Settings updated successfully!');
  };

  const handleAddAnnouncement = (item: Omit<AnnouncementItem, 'id' | 'createdAt'>) => {
    const newAnn: AnnouncementItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([newAnn, ...announcements]);
    showToast('New announcement published!');

    if (newAnn.isActive && settings.telegramEnabled && settings.telegramAutoPublishAnnouncements) {
      broadcastToTelegram('announcement', newAnn, settings.telegramChannelId, window.location.origin)
        .then((res) => {
          if (res.success) {
            handleAddTelegramLog({
              id: Date.now(),
              contentType: 'announcement',
              contentId: newAnn.id,
              title: newAnn.title,
              status: 'success',
              messageId: res.messageId ? String(res.messageId) : undefined,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            showToast('📢 Announcement broadcasted to Telegram Channel!');
          }
        })
        .catch(() => {});
    }
  };

  const handleUpdateAnnouncement = (id: number, updates: Partial<AnnouncementItem>) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Announcement updated.');
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    showToast('Announcement removed.');
  };

  // The Guided User Flow
  const handlePostAdClick = () => {
    if (!settings.isNewListingEnabled) {
      showToast('New product listings are temporarily paused for maintenance.');
      return;
    }
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Step 1: Please register or login to post an ad.');
      return;
    }
    if (currentUser.activationStatus !== 'active') {
      setIsActivationOpen(true);
      showToast(`Step 2: Rs. ${settings.activationFee.toLocaleString()} lifetime activation required.`);
      return;
    }
    setIsPostAdOpen(true);
  };

  const handlePostJobClick = () => {
    if (!settings.isJobPostingEnabled) {
      showToast('New job postings are temporarily paused for maintenance.');
      return;
    }
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Step 1: Please register or login to post jobs.');
      return;
    }
    if (currentUser.activationStatus !== 'active') {
      setIsActivationOpen(true);
      showToast(`Step 2: Rs. ${settings.activationFee.toLocaleString()} lifetime activation required.`);
      return;
    }
    setIsPostJobOpen(true);
  };

  // Auth Callbacks
  const handleRegisterSuccess = (newUser: UserProfile) => {
    if (!settings.isNewRegistrationEnabled) {
      showToast('New account registrations are temporarily paused.');
      return;
    }
    setUsers([newUser, ...users]);
    setCurrentUser(newUser);

    // Redirect back to pending transport action if clicked earlier
    if (pendingPostAction === 'post-truck') {
      setPendingPostAction(null);
      setCurrentView('transport');
      setIsPostTruckOpen(true);
      showToast(`Welcome ${newUser.name}! Proceeding to list your truck.`);
      return;
    }
    if (pendingPostAction === 'post-load') {
      setPendingPostAction(null);
      setCurrentView('transport');
      setIsPostLoadOpen(true);
      showToast(`Welcome ${newUser.name}! Proceeding to post your cargo load (Free of charge).`);
      return;
    }

    showToast(settings.registrationSuccessMsg || `Account created for ${newUser.name}! Proceeding to lifetime activation.`);
    setIsActivationOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);

    // Redirect back to pending transport action if clicked earlier
    if (pendingPostAction === 'post-truck') {
      setPendingPostAction(null);
      setCurrentView('transport');
      setIsPostTruckOpen(true);
      showToast(`Logged in! Opening truck listing form.`);
      return;
    }
    if (pendingPostAction === 'post-load') {
      setPendingPostAction(null);
      setCurrentView('transport');
      setIsPostLoadOpen(true);
      showToast(`Logged in! Opening cargo load posting form (Free for customers).`);
      return;
    }

    if (user.activationStatus !== 'active') {
      setIsActivationOpen(true);
    } else {
      setCurrentView('dashboard');
    }
  };

  // Favorites handler
  const handleToggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
      showToast('Removed from favorites.');
    } else {
      setFavorites([...favorites, id]);
      showToast('Saved to your favorites.');
    }
  };

  // Add Product Handler (Direct Public Listing) with Saved Search & Follow Notifications
  const handleAddListing = (adData: Omit<Listing, 'id' | 'views' | 'createdAt'>) => {
    const isSellerVerified = !!(currentUser?.isVerified || users.some((u) => u.id === currentUser?.id && u.isVerified));
    const newListing: Listing = {
      ...adData,
      sellerVerified: isSellerVerified,
      id: Date.now(),
      views: 1,
      createdAt: 'Just now',
    };
    setListings([newListing, ...listings]);
    showToast(settings.listingPublishedMsg || 'Your product is now LIVE directly in SargodhaMart!');

    // Persist to PHP MySQL database on Hostinger
    api.listings.createListing({
      title: newListing.title,
      price: newListing.price,
      category_id: newListing.categoryId,
      description: newListing.description,
      city: newListing.city,
      area: newListing.area,
      phone_number: newListing.sellerPhone || '',
      whatsapp_number: newListing.sellerPhone || '',
      item_condition: newListing.condition,
      images: newListing.images,
      user_id: currentUser?.id,
    }).then((res) => {
      if (res.success && res.listing_id) {
        setListings((prev) => prev.map((l) => l.id === newListing.id ? { ...l, id: res.listing_id } : l));
      }
    }).catch(() => {});

    // 1. Trigger Saved Search Match Alerts
    savedSearches.forEach((s) => {
      if (s.alertsEnabled === false) return;
      let isMatch = false;

      if (s.query && newListing.title.toLowerCase().includes(s.query.toLowerCase())) {
        isMatch = true;
      }
      if (s.categoryName && newListing.categoryName && s.categoryName !== 'All') {
        if (!newListing.categoryName.toLowerCase().includes(s.categoryName.toLowerCase())) {
          isMatch = false;
        }
      }
      if (s.cityName && s.cityName !== 'All' && newListing.city) {
        if (newListing.city.toLowerCase() !== s.cityName.toLowerCase()) {
          isMatch = false;
        }
      }
      if (s.minPrice !== undefined && newListing.price < s.minPrice) isMatch = false;
      if (s.maxPrice !== undefined && newListing.price > s.maxPrice) isMatch = false;

      if (isMatch) {
        const notif: UserNotification = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          userId: s.userId,
          type: 'SAVED_SEARCH',
          title: `🔔 Saved Search Alert: ${s.name || s.query}`,
          message: `New match "${newListing.title}" in ${newListing.city} for Rs. ${newListing.price.toLocaleString()}!`,
          targetId: newListing.id,
          targetType: 'PRODUCT',
          isRead: false,
          createdAt: 'Just now',
        };
        setNotifications((prev) => [notif, ...prev]);
        setSavedSearches((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, lastAlertAt: 'Just now' } : item))
        );
      }
    });

    // 2. Notify Followers of this Seller
    follows
      .filter((f) => f.targetType === 'SELLER' && f.targetId === newListing.userId && f.alertsEnabled)
      .forEach((f) => {
        const notif: UserNotification = {
          id: Date.now() + Math.floor(Math.random() * 1000) + 1,
          userId: f.userId,
          type: 'SELLER_FOLLOW',
          title: `⭐ New listing from followed seller: ${f.targetName}`,
          message: `${f.targetName} just published "${newListing.title}" in ${newListing.city}!`,
          targetId: newListing.id,
          targetType: 'PRODUCT',
          isRead: false,
          createdAt: 'Just now',
        };
        setNotifications((prev) => [notif, ...prev]);
      });
  };

  // Follow / Unfollow Handlers
  const handleToggleFollow = (targetType: 'SELLER' | 'SHOP', targetId: number, targetName: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please login to follow sellers and shops.');
      return;
    }
    const existing = follows.find(
      (f) => f.userId === currentUser.id && f.targetType === targetType && f.targetId === targetId
    );
    if (existing) {
      setFollows(follows.filter((f) => f.id !== existing.id));
      showToast(`Unfollowed ${targetName}.`);
    } else {
      const newFollow: SellerFollow = {
        id: Date.now(),
        userId: currentUser.id,
        targetType,
        targetId,
        targetName,
        alertsEnabled: true,
        followedAt: new Date().toISOString().split('T')[0],
      };
      setFollows([newFollow, ...follows]);
      showToast(`Now following ${targetName}! You will receive notifications when they post new listings.`);
    }
  };

  const handleToggleFollowAlerts = (followId: number) => {
    setFollows((prev) =>
      prev.map((f) => (f.id === followId ? { ...f, alertsEnabled: !f.alertsEnabled } : f))
    );
    showToast('Follow alert preferences updated.');
  };

  const handleUnfollow = (followId: number) => {
    setFollows((prev) => prev.filter((f) => f.id !== followId));
    showToast('Unfollowed successfully.');
  };

  // Saved Search Handlers
  const handleAddSavedSearch = (searchData: Omit<SavedSearch, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please login to save search alerts.');
      return;
    }
    const newSearch: SavedSearch = {
      ...searchData,
      id: Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
      alertsEnabled: searchData.alertsEnabled !== false,
    };
    setSavedSearches([newSearch, ...savedSearches]);
    showToast(`Search alert "${newSearch.name || newSearch.query}" saved successfully!`);
  };

  const handleDeleteSavedSearch = (id: number) => {
    setSavedSearches(savedSearches.filter((s) => s.id !== id));
    showToast('Saved search alert removed.');
  };

  const handleToggleSavedSearchAlerts = (id: number) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alertsEnabled: s.alertsEnabled === false } : s))
    );
    showToast('Saved search notification status toggled.');
  };

  // Notification Center Handlers
  const handleMarkNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearNotifications = () => {
    if (currentUser) {
      setNotifications((prev) => prev.filter((n) => n.userId !== currentUser.id));
      showToast('All notifications cleared.');
    }
  };

  // Shop Profile & Review Handlers
  const handleSaveShop = (shopData: Partial<BusinessShop>) => {
    if (!currentUser) return;
    setShops((prev) => {
      const existing = prev.find((s) => s.userId === currentUser.id);
      if (existing) {
        return prev.map((s) => (s.userId === currentUser.id ? { ...s, ...shopData } : s));
      } else {
        const newShop: BusinessShop = {
          id: Date.now(),
          userId: currentUser.id,
          ownerName: currentUser.name,
          name: shopData.name || currentUser.name,
          slug: (shopData.name || currentUser.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logo: shopData.logo || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop&q=80',
          city: currentUser.city,
          area: currentUser.area,
          phone: currentUser.mobile,
          whatsapp: currentUser.mobile,
          description: shopData.description || 'Verified local shop in Sargodha',
          isVerified: currentUser.isVerified,
          status: 'APPROVED',
          views: 1,
          callClicks: 0,
          whatsappClicks: 0,
          createdAt: new Date().toISOString().split('T')[0],
          ...shopData,
        } as BusinessShop;
        return [...prev, newShop];
      }
    });
    showToast(`Shop profile saved successfully.`);
  };

  const handleRespondReview = (reviewId: number, responseText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              sellerResponse: responseText,
              sellerRespondedAt: 'Just now',
            }
          : r
      )
    );
    showToast('Reply to customer review published.');
  };

  const handleCreateReview = (newReview: Omit<SellerReview, 'id' | 'createdAt'>) => {
    const rev: SellerReview = {
      ...newReview,
      id: Date.now(),
      createdAt: 'Just now',
    };
    setReviews((prev) => [rev, ...prev]);

    // Also update listing average rating if listingId exists
    if (newReview.listingId) {
      setListings((prevListings) =>
        prevListings.map((l) => {
          if (l.id === newReview.listingId) {
            const currentRevCount = (l.reviewCount || 0) + 1;
            const currentAvg = l.rating || 5;
            const newAvg = parseFloat(((currentAvg * (currentRevCount - 1) + newReview.rating) / currentRevCount).toFixed(1));
            return {
              ...l,
              rating: newAvg,
              reviewCount: currentRevCount,
            };
          }
          return l;
        })
      );
    }
    showToast('Customer rating & review published successfully! (کسٹمر ریویو شائع ہو گیا)');
  };

  // Moderation & Reports Handler
  const handleUpdateReportStatus = (
    id: number,
    status: ReportItem['status'],
    action?: ReportItem['moderationAction'],
    notes?: string
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, moderationAction: action, adminNotes: notes } : r
      )
    );
    showToast(`Report #${id} marked as ${status.toUpperCase()} (${action || 'no penalty'}).`);
  };

  // Location Hierarchy Management Handlers (Admin)
  const handleAddDistrict = (name: string) => {
    const newDistrict: District = { id: Date.now(), divisionId: 1, name, isActive: true };
    setDistricts([...districts, newDistrict]);
    showToast(`District/City "${name}" added to location database!`);
  };

  const handleUpdateDistrict = (id: number, updates: Partial<District>) => {
    setDistricts(districts.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('District updated.');
  };

  const handleDeleteDistrict = (id: number) => {
    setDistricts(districts.filter((d) => d.id !== id));
    showToast('District deleted.');
  };

  const handleAddTehsil = (name: string, districtId: number) => {
    const newTehsil: Tehsil = { id: Date.now(), districtId, name, isActive: true };
    setTehsils([...tehsils, newTehsil]);
    showToast(`Tehsil "${name}" added.`);
  };

  const handleUpdateTehsil = (id: number, updates: Partial<Tehsil>) => {
    setTehsils(tehsils.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Tehsil updated.');
  };

  const handleDeleteTehsil = (id: number) => {
    setTehsils(tehsils.filter((t) => t.id !== id));
    showToast('Tehsil deleted.');
  };

  const handleAddArea = (name: string, tehsilId: number) => {
    const newArea: AreaLocation = { id: Date.now(), tehsilId, name, isActive: true };
    setAreas([...areas, newArea]);
    showToast(`Area "${name}" added.`);
  };

  const handleUpdateArea = (id: number, updates: Partial<AreaLocation>) => {
    setAreas(areas.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Area updated.');
  };

  const handleDeleteArea = (id: number) => {
    setAreas(areas.filter((a) => a.id !== id));
    showToast('Area deleted.');
  };

  // Freight & Transport Handlers
  const handlePostLoad = (
    loadData: Omit<LoadRequest, 'id' | 'createdAt'> | Omit<LoadRequest, 'id' | 'status' | 'createdAt'>
  ) => {
    const newLoad: LoadRequest = {
      ...loadData,
      id: Date.now(),
      status: ('status' in loadData ? (loadData as any).status : 'open') || 'open',
      createdAt: 'Just now',
    };
    setLoads([newLoad, ...loads]);
    setIsPostLoadOpen(false);
    showToast('Freight cargo load posted! Registered transporters will submit quotations.');
  };

  const handlePostTruck = (
    truckData: Omit<TruckListing, 'id' | 'createdAt'> | Omit<TruckListing, 'id' | 'status' | 'isVerified' | 'createdAt'>
  ) => {
    const newTruck: TruckListing = {
      ...truckData,
      id: Date.now(),
      isVerified: 'isVerified' in truckData ? (truckData as any).isVerified : false,
      status: ('status' in truckData ? (truckData as any).status : 'available') || 'available',
      createdAt: 'Just now',
    };
    setTrucks([newTruck, ...trucks]);
    setIsPostTruckOpen(false);
    showToast('Truck & vehicle listing posted to nationwide freight board!');
  };

  const handleSubmitQuotation = (quotationData: Omit<FreightQuotation, 'id' | 'createdAt'>) => {
    const newQuotation: FreightQuotation = {
      ...quotationData,
      id: Date.now(),
      createdAt: 'Just now',
    };
    setQuotations([newQuotation, ...quotations]);
    showToast(`Quotation of Rs. ${(quotationData.freightPrice || 0).toLocaleString()} submitted to cargo shipper.`);
  };

  const handleAcceptQuotation = (quotationId: number) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'ACCEPTED' as const } : q))
    );
    showToast('Quotation accepted! Contact details exchanged for loading.');
  };

  const handlePurchaseSubscription = (
    planId: string,
    trxId: string,
    paymentMethod: string,
    proofUrl?: string
  ) => {
    if (!currentUser) return;
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return;
    const newPurchase: TransporterSubscriptionPurchase = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.mobile || '',
      transporterName: currentUser.name,
      planId: plan.id,
      planName: plan.name,
      planSnapshot: plan,
      amount: plan.price,
      paymentMethod,
      trxId,
      paymentProofUrl: proofUrl,
      status: 'PAYMENT_UNDER_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newPurchase, ...subscriptionPurchases];
    setSubscriptionPurchases(updated);
    try {
      localStorage.setItem('sargodha_subscription_purchases', JSON.stringify(updated));
    } catch (e) {}
    showToast('Transporter subscription submitted! Verification team will review TID.');
  };

  const handleApproveSubscription = (id: number) => {
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 30);
    const updated = subscriptionPurchases.map((p) =>
      p.id === id
        ? {
            ...p,
            status: 'ACTIVE' as const,
            startDate: today.toISOString().split('T')[0],
            expiryDate: expiry.toISOString().split('T')[0],
          }
        : p
    );
    setSubscriptionPurchases(updated);
    try {
      localStorage.setItem('sargodha_subscription_purchases', JSON.stringify(updated));
    } catch (e) {}
    showToast('Transporter subscription APPROVED and active!');
  };

  const handleRejectSubscription = (id: number, reason: string) => {
    const updated = subscriptionPurchases.map((p) =>
      p.id === id ? { ...p, status: 'REJECTED' as const, rejectionReason: reason } : p
    );
    setSubscriptionPurchases(updated);
    try {
      localStorage.setItem('sargodha_subscription_purchases', JSON.stringify(updated));
    } catch (e) {}
    showToast('Transporter subscription rejected.');
  };

  const handleSaveSubscriptionPlan = (plan: TransporterSubscriptionPlan) => {
    setSubscriptionPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id);
      let updated: TransporterSubscriptionPlan[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = plan;
      } else {
        updated = [...prev, plan];
      }
      try {
        localStorage.setItem('sargodha_subscription_plans', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Transporter plan "${plan.name}" saved!`);
  };

  const handleDeleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans((prev) => {
      const updated = prev.filter((p) => p.id !== planId);
      try {
        localStorage.setItem('sargodha_subscription_plans', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Subscription plan removed.');
  };

  const handleToggleTransporterStatus = (
    id: number,
    status: 'APPROVED' | 'REJECTED' | 'PENDING'
  ) => {
    setTransporters((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isVerified: status === 'APPROVED',
              verificationStatus: status,
            }
          : t
      );
      try {
        localStorage.setItem('sargodha_transporters', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Transporter fleet status updated to ${status}.`);
  };

  const handleUpdateDealStatus = (
    bookingId: number,
    status: BookingStatus,
    notes?: string
  ) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId ? { ...b, status, statusNotes: notes } : b
      );
      try {
        localStorage.setItem('sargodha_bookings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Consignment deal status updated to ${status}.`);
  };

  // Add Job Handler (Direct Public Listing)
  const handleAddJob = (jobData: Omit<JobPost, 'id' | 'views' | 'createdAt'>) => {
    const newJob: JobPost = {
      ...jobData,
      id: Date.now(),
      views: 1,
      createdAt: 'Just now',
    };
    setJobs([newJob, ...jobs]);
    showToast(settings.jobPublishedMsg || 'Your job requirement / work post is now directly published!');

    // Persist to PHP MySQL database
    api.jobs.createJob({
      title: newJob.title,
      post_type: newJob.postType,
      category: newJob.category,
      skills: newJob.skills,
      salary_or_payment: newJob.salaryOrPayment || '',
      city: newJob.city,
      area: newJob.area,
      description: newJob.description,
      phone_number: newJob.phone,
      whatsapp_number: newJob.whatsapp,
      user_id: currentUser?.id,
    }).then((res) => {
      if (res.success && res.job_id) {
        setJobs((prev) => prev.map((j) => j.id === newJob.id ? { ...j, id: res.job_id } : j));
      }
    }).catch(() => {});
  };

  // Submit Activation Request (Configurable Fee + WhatsApp Follow)
  const handleSubmitActivation = (data: {
    method: string;
    senderNumber: string;
    transactionId: string;
    paymentScreenshot: string;
    whatsappScreenshot: string;
  }) => {
    if (!currentUser) return;
    const newPayment: ActivationPayment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userCity: currentUser.city,
      userPhone: currentUser.mobile,
      amount: settings.activationFee,
      method: data.method,
      senderNumber: data.senderNumber,
      transactionId: data.transactionId,
      paymentScreenshot: data.paymentScreenshot,
      whatsappScreenshot: data.whatsappScreenshot,
      status: 'pending',
      createdAt: 'Just now',
    };

    setPayments([newPayment, ...payments]);
    showToast(settings.activationSubmittedMsg || 'Payment & WhatsApp follow proofs submitted! Awaiting admin verification.');

    // Persist to PHP MySQL database
    api.activation.submitProof({
      user_id: currentUser.id,
      payment_method: data.method,
      sender_number: data.senderNumber,
      transaction_id: data.transactionId,
      payment_screenshot: data.paymentScreenshot,
      whatsapp_screenshot: data.whatsappScreenshot,
    }).catch(() => {});
  };

  // Admin approves payment & activates account
  const handleApprovePayment = (paymentId: number, userId: number) => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status: 'approved' } : p))
    );
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, activationStatus: 'active' } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, activationStatus: 'active' });
    }
    api.activation.approve(String(paymentId), String(userId)).catch(() => {});
    showToast(settings.activationApprovedMsg || 'Account ACTIVATED! User can now post unlimited free ads directly.');
  };

  const handleRejectPayment = (paymentId: number) => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status: 'rejected' } : p))
    );
    showToast(settings.activationRejectedMsg || 'Payment marked as rejected.');
  };

  // User submits or updates personal Telegram number & privacy settings
  const handleUpdateTelegramSettings = (params: {
    telegramNumber: string;
    telegramVisibility: TelegramVisibility;
    contactPrivacy: ContactPrivacy;
  }) => {
    if (!currentUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Security Rule: Changing number invalidates any previous approval
    const updatedUser: UserProfile = {
      ...currentUser,
      telegramNumber: params.telegramNumber,
      telegramStatus: 'PENDING',
      telegramVisibility: params.telegramVisibility,
      contactPrivacy: params.contactPrivacy,
      telegramSubmittedAt: now,
      telegramReviewedBy: undefined,
      telegramReviewedAt: undefined,
      telegramRejectionReason: undefined,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    try {
      localStorage.setItem('sargodha_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('sargodha_users', JSON.stringify(users.map((u) => (u.id === currentUser.id ? updatedUser : u))));
    } catch (e) {}

    const newAuditLog: UserTelegramAuditLog = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      telegramNumber: params.telegramNumber,
      status: 'PENDING',
      actionType: currentUser.telegramNumber ? 'CHANGE_INVALIDATED' : 'SUBMIT',
      timestamp: now,
    };

    setTelegramAuditLogs((prev) => {
      const updated = [newAuditLog, ...prev];
      try {
        localStorage.setItem('sargodha_telegram_audits', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast('Telegram number submitted. Waiting for admin approval.');
  };

  // Admin approves user Telegram contact
  const handleApproveUserTelegram = (userId: number) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const adminName = currentUser?.name || 'Administrator';

    const updatedUser: UserProfile = {
      ...targetUser,
      telegramStatus: 'APPROVED',
      telegramReviewedBy: adminName,
      telegramReviewedAt: now,
      telegramRejectionReason: undefined,
    };

    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? updatedUser : u));
      try {
        localStorage.setItem('sargodha_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('sargodha_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    const newAuditLog: UserTelegramAuditLog = {
      id: Date.now(),
      userId,
      userName: targetUser.name,
      telegramNumber: targetUser.telegramNumber || '',
      status: 'APPROVED',
      actionType: 'APPROVE',
      reviewedBy: adminName,
      reviewedAt: now,
      timestamp: now,
    };

    setTelegramAuditLogs((prev) => {
      const updated = [newAuditLog, ...prev];
      try {
        localStorage.setItem('sargodha_telegram_audits', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`Telegram contact approved for ${targetUser.name}.`);
  };

  // Admin rejects user Telegram contact
  const handleRejectUserTelegram = (userId: number, reason: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const adminName = currentUser?.name || 'Administrator';

    const updatedUser: UserProfile = {
      ...targetUser,
      telegramStatus: 'REJECTED',
      telegramReviewedBy: adminName,
      telegramReviewedAt: now,
      telegramRejectionReason: reason,
    };

    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? updatedUser : u));
      try {
        localStorage.setItem('sargodha_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('sargodha_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    const newAuditLog: UserTelegramAuditLog = {
      id: Date.now(),
      userId,
      userName: targetUser.name,
      telegramNumber: targetUser.telegramNumber || '',
      status: 'REJECTED',
      actionType: 'REJECT',
      reviewedBy: adminName,
      reviewedAt: now,
      rejectionReason: reason,
      timestamp: now,
    };

    setTelegramAuditLogs((prev) => {
      const updated = [newAuditLog, ...prev];
      try {
        localStorage.setItem('sargodha_telegram_audits', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`Telegram contact rejected for ${targetUser.name}.`);
  };

  // Admin revokes / unverifies user Telegram contact
  const handleRevokeUserTelegram = (userId: number) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const adminName = currentUser?.name || 'Administrator';

    const updatedUser: UserProfile = {
      ...targetUser,
      telegramStatus: 'PENDING',
      telegramReviewedBy: adminName,
      telegramReviewedAt: now,
      telegramRejectionReason: 'Approval revoked by administrator.',
    };

    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === userId ? updatedUser : u));
      try {
        localStorage.setItem('sargodha_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('sargodha_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }

    const newAuditLog: UserTelegramAuditLog = {
      id: Date.now(),
      userId,
      userName: targetUser.name,
      telegramNumber: targetUser.telegramNumber || '',
      status: 'PENDING',
      actionType: 'REVOKE',
      reviewedBy: adminName,
      reviewedAt: now,
      rejectionReason: 'Verification revoked by admin',
      timestamp: now,
    };

    setTelegramAuditLogs((prev) => {
      const updated = [newAuditLog, ...prev];
      try {
        localStorage.setItem('sargodha_telegram_audits', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`Telegram approval revoked for ${targetUser.name}.`);
  };

  // Telegram Publication Handler (Manual or Retries)
  const handlePublishToTelegram = async (
    type: 'product' | 'job' | 'announcement',
    id: number,
    force = false
  ): Promise<boolean> => {
    let item: any = null;
    let title = '';

    if (type === 'product') {
      item = listings.find((l) => l.id === id);
      if (!item) return false;
      if (item.status !== 'published') {
        showToast('Only published products can be broadcasted to Telegram.');
        return false;
      }
      title = item.title;
    } else if (type === 'job') {
      item = jobs.find((j) => j.id === id);
      if (!item) return false;
      if (item.status !== 'published') {
        showToast('Only published jobs can be broadcasted to Telegram.');
        return false;
      }
      title = item.title;
    } else if (type === 'announcement') {
      item = announcements.find((a) => a.id === id);
      if (!item) return false;
      title = item.title;
    }

    if (item.telegramPublished && !force) {
      showToast(`Already broadcasted to Telegram (Message ID: ${item.telegramMessageId || 'recorded'}).`);
      return false;
    }

    showToast(`Broadcasting "${title}" to Telegram Channel...`);

    try {
      const res = await broadcastToTelegram(type, item, settings.telegramChannelId, window.location.origin);
      if (res.success) {
        const msgId = res.messageId ? String(res.messageId) : String(Date.now());
        if (type === 'product') {
          setListings((prev) => {
            const updated = prev.map((l) => (l.id === id ? { ...l, telegramPublished: true, telegramMessageId: msgId } : l));
            try { localStorage.setItem('sargodha_listings', JSON.stringify(updated)); } catch (e) {}
            return updated;
          });
        } else if (type === 'job') {
          setJobs((prev) => {
            const updated = prev.map((j) => (j.id === id ? { ...j, telegramPublished: true, telegramMessageId: msgId } : j));
            try { localStorage.setItem('sargodha_jobs', JSON.stringify(updated)); } catch (e) {}
            return updated;
          });
        }

        handleAddTelegramLog({
          id: Date.now(),
          contentType: type,
          contentId: id,
          title: title,
          status: 'success',
          messageId: msgId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        showToast(`✅ Successfully published "${title}" to Telegram Channel (ID: ${msgId})!`);
        return true;
      } else {
        handleAddTelegramLog({
          id: Date.now(),
          contentType: type,
          contentId: id,
          title: title,
          status: 'failed',
          errorMessage: res.error || 'Failed to publish to Telegram',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        showToast(`⚠️ Telegram API: ${res.error || 'Broadcast failed. Check Bot Token & Channel.'}`);
        return false;
      }
    } catch (err: any) {
      showToast(`⚠️ Network error contacting Telegram API.`);
      return false;
    }
  };

  // Moderation Handlers
  const handleToggleListingStatus = (id: number) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    const isNowPublished = listing.status !== 'published';
    const nextStatus: 'published' | 'disabled' = isNowPublished ? 'published' : 'disabled';

    setListings((prev) => {
      const updated = prev.map((l) =>
        l.id === id ? { ...l, status: nextStatus } : l
      );
      try { localStorage.setItem('sargodha_listings', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    showToast(isNowPublished ? 'Product published.' : 'Product disabled.');

    // Auto-publish to Telegram if enabled and not already published
    if (isNowPublished && settings.telegramEnabled && settings.telegramAutoPublishProducts && !listing.telegramPublished) {
      setTimeout(() => {
        handlePublishToTelegram('product', id);
      }, 500);
    }
  };

  const handleToggleListingFeatured = (id: number) => {
    setListings(
      listings.map((l) => (l.id === id ? { ...l, isFeatured: !l.isFeatured } : l))
    );
    showToast('Featured status updated.');
  };

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter((l) => l.id !== id));
    api.listings.deleteListing(id).catch(() => {});
    showToast('Product listing removed.');
  };

  const handleToggleJobStatus = (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const isNowPublished = job.status !== 'published';
    const nextStatus: 'published' | 'disabled' = isNowPublished ? 'published' : 'disabled';

    setJobs((prev) => {
      const updated = prev.map((j) =>
        j.id === id ? { ...j, status: nextStatus } : j
      );
      try { localStorage.setItem('sargodha_jobs', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    showToast(isNowPublished ? 'Job published.' : 'Job disabled.');

    // Auto-publish to Telegram if enabled and not already published
    if (isNowPublished && settings.telegramEnabled && settings.telegramAutoPublishJobs && !job.telegramPublished) {
      setTimeout(() => {
        handlePublishToTelegram('job', id);
      }, 500);
    }
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter((j) => j.id !== id));
    showToast('Job posting removed.');
  };

  // Digital Skills Handlers
  const handleOpenPostSkill = (skillToEdit?: DigitalSkillProfile | null) => {
    if (!settings.isNewListingEnabled) {
      showToast('Posting features are temporarily paused for maintenance.');
      return;
    }
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Step 1: Please register or login to create your Digital Skill Profile.');
      return;
    }
    if (currentUser.activationStatus !== 'active') {
      setIsActivationOpen(true);
      showToast(`Step 2: Rs. ${settings.activationFee.toLocaleString()} lifetime seller activation required.`);
      return;
    }
    setEditingSkill(skillToEdit || null);
    setIsPostSkillOpen(true);
  };

  const handleSaveSkill = (skillData: Omit<DigitalSkillProfile, 'id' | 'createdAt'>, skillId?: number) => {
    if (skillId) {
      // Server-side ownership verification: verify current user owns this skill profile
      const existing = skills.find((s) => s.id === skillId);
      if (!existing || (existing.userId !== currentUser?.id && currentUser?.role !== 'super_admin' && currentUser?.role !== 'admin')) {
        showToast('Unauthorized: You can only edit your own skill profile.');
        return;
      }
      setSkills(skills.map((s) => (s.id === skillId ? { ...s, ...skillData } : s)));
      showToast('Digital Skill Profile updated successfully!');
    } else {
      const newSkill: DigitalSkillProfile = {
        ...skillData,
        id: Date.now(),
        userId: currentUser!.id,
        status: 'approved', // Auto approved for verified activated members
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSkills([newSkill, ...skills]);
      showToast('Digital Skill Profile published successfully!');
    }
    setIsPostSkillOpen(false);
    setEditingSkill(null);
  };

  const handleDeleteSkill = (skillId: number) => {
    const existing = skills.find((s) => s.id === skillId);
    if (!existing || (existing.userId !== currentUser?.id && currentUser?.role !== 'super_admin' && currentUser?.role !== 'admin')) {
      showToast('Unauthorized: You can only delete your own skill profile.');
      return;
    }
    setSkills(skills.filter((s) => s.id !== skillId));
    showToast('Digital Skill Profile removed.');
  };

  const handleToggleSkillStatus = (skillId: number) => {
    setSkills(
      skills.map((s) => {
        if (s.id === skillId) {
          const next = s.status === 'approved' ? 'rejected' : 'approved';
          showToast(`Skill profile status changed to ${next.toUpperCase()}`);
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  // Promotion Handlers (Completely separate from lifetime activation)
  const handleOpenPromoteModal = (type: 'PRODUCT' | 'SKILL' = 'PRODUCT', id?: number) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please login to promote your products or digital skills.');
      return;
    }
    setPromotePreselectedType(type);
    setPromotePreselectedId(id);
    setIsPromoteOpen(true);
  };

  const handleSubmitPromotion = (paymentData: Omit<PromotionPayment, 'id' | 'createdAt'>) => {
    const newPromo: PromotionPayment = {
      ...paymentData,
      id: Date.now(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setPromotions([newPromo, ...promotions]);
    setIsPromoteOpen(false);
    showToast('Your promotion request has been submitted and is waiting for Admin verification.');
  };

  const handleApprovePromotion = (promoId: number) => {
    const promo = promotions.find((p) => p.id === promoId);
    if (!promo) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (promo.durationDays || 15));

    const startAtStr = startDate.toISOString().split('T')[0];
    const endAtStr = endDate.toISOString().split('T')[0];

    // 1. Update promotion record
    setPromotions(
      promotions.map((p) =>
        p.id === promoId
          ? {
              ...p,
              status: 'APPROVED',
              startAt: startAtStr,
              endAt: endAtStr,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Administrator',
            }
          : p
      )
    );

    // 2. Mark entity as featured
    if (promo.promotionType === 'PRODUCT' || promo.entityType === 'PRODUCT') {
      setListings((prev) =>
        prev.map((l) => (l.id === promo.entityId ? { ...l, isFeatured: true } : l))
      );
      if (settings.telegramEnabled && settings.telegramAutoPublishPromotions) {
        const item = listings.find((l) => l.id === promo.entityId);
        if (item) {
          handlePublishToTelegram('product', item.id, true);
        }
      }
    } else {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === promo.entityId
            ? { ...s, isFeatured: true, featuredStartAt: startAtStr, featuredEndAt: endAtStr }
            : s
        )
      );
    }

    showToast(`Promotion approved! Entity is now ⭐ FEATURED until ${endAtStr}.`);
  };

  const handleRejectPromotion = (promoId: number, reason: string) => {
    setPromotions(
      promotions.map((p) =>
        p.id === promoId
          ? {
              ...p,
              status: 'REJECTED',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Administrator',
            }
          : p
      )
    );
    showToast(`Promotion rejected. Rejection reason logged.`);
  };

  // ==========================================
  // Advertising System Handlers (Price Security Enforced Server-Side)
  // ==========================================
  const handleSaveAdvertisingPackage = (pkg: AdvertisingPackage) => {
    setAdvertisingPackages((prev) => {
      const exists = prev.some((p) => p.id === pkg.id);
      if (exists) {
        return prev.map((p) => (p.id === pkg.id ? pkg : p));
      } else {
        return [...prev, pkg];
      }
    });
    showToast(`Package "${pkg.name}" updated successfully!`);
  };

  const handleDeleteAdvertisingPackage = (pkgId: number) => {
    setAdvertisingPackages((prev) => prev.filter((p) => p.id !== pkgId));
    showToast('Advertising package removed.');
  };

  const handleSubmitAdvertisement = (
    adData: Omit<Advertisement, 'id' | 'status' | 'amountPaid' | 'durationDays' | 'createdAt' | 'updatedAt'>,
    packageId: number
  ) => {
    // IMPORTANT PRICE SECURITY:
    // Determine the current price and duration from the server/admin package definition!
    const targetPkg = advertisingPackages.find((p) => p.id === packageId) || DEFAULT_ADVERTISING_PACKAGES[0];
    const authoritativePrice = targetPkg.price;
    const authoritativeDuration = targetPkg.durationDays;

    const newAdId = Date.now();
    const newAd: Advertisement = {
      ...adData,
      id: newAdId,
      packageId: targetPkg.id,
      packageName: targetPkg.name,
      adType: targetPkg.adType,
      placements: targetPkg.placements,
      status: 'PENDING',
      amountPaid: authoritativePrice,
      durationDays: authoritativeDuration,
      telegramEnabled: targetPkg.telegramEnabled,
      telegramStatus: targetPkg.telegramEnabled ? 'pending' : 'not_applicable',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    // Separate advertising payment record
    const newPayment: AdvertisingPayment = {
      id: Date.now(),
      advertisementId: newAdId,
      userId: currentUser!.id,
      userName: currentUser!.name,
      packageId: targetPkg.id,
      packageName: targetPkg.name,
      amount: authoritativePrice,
      durationDays: authoritativeDuration,
      transactionReference: adData.transactionReference,
      paymentScreenshot: adData.paymentScreenshot,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setAdvertisements([newAd, ...advertisements]);
    setAdvertisingPayments([newPayment, ...advertisingPayments]);
    setIsCreateAdOpen(false);
    showToast('Your advertisement request has been submitted with PENDING status for Admin verification.');
  };

  const handleApproveAdvertisement = (adId: number) => {
    const ad = advertisements.find((a) => a.id === adId);
    if (!ad) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (ad.durationDays || 15));

    const startAtStr = startDate.toISOString().split('T')[0];
    const endAtStr = endDate.toISOString().split('T')[0];

    // Update Ad status
    setAdvertisements((prev) =>
      prev.map((a) => {
        if (a.id === adId) {
          return {
            ...a,
            status: 'ACTIVE',
            startAt: startAtStr,
            endAt: endAtStr,
            telegramStatus: a.telegramEnabled ? 'pending' : 'not_applicable',
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    // Update Separate Advertising Payment
    setAdvertisingPayments((prev) =>
      prev.map((p) =>
        p.advertisementId === adId
          ? {
              ...p,
              status: 'APPROVED',
              reviewedBy: currentUser?.name || 'Administrator',
              reviewedAt: new Date().toISOString(),
            }
          : p
      )
    );

    // If package includes Telegram: automatically broadcast sponsored post
    if (ad.telegramEnabled && settings.telegramEnabled) {
      const origin = window.location.origin;
      broadcastToTelegram('announcement', {
        id: ad.id,
        title: `📢 [SPONSORED] ${ad.title}`,
        message: `${ad.description}\n\n📍 Location: ${ad.location}\n📞 Call: ${ad.phone}\n💬 WhatsApp: https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}`,
      } as any, settings.telegramChannelId, origin)
        .then((res) => {
          if (res.success) {
            const msgId = String(res.messageId || '901');
            setAdvertisements((prev) =>
              prev.map((a) =>
                a.id === adId
                  ? {
                      ...a,
                      telegramStatus: 'published',
                      telegramMessageId: msgId,
                      telegramPublishedAt: new Date().toLocaleString(),
                    }
                  : a
              )
            );
            handleAddTelegramLog({
              id: Date.now(),
              contentType: 'advertisement',
              contentId: ad.id,
              title: `Sponsored Ad: ${ad.title}`,
              status: 'success',
              messageId: msgId,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            showToast('✅ Advertisement approved & broadcasted to Telegram Channel!');
          } else {
            setAdvertisements((prev) =>
              prev.map((a) =>
                a.id === adId
                  ? {
                      ...a,
                      telegramStatus: 'failed',
                      telegramError: res.error || 'Failed to post',
                    }
                  : a
              )
            );
            showToast(`Advertisement active. Telegram broadcast: ${res.error || 'failed'}`);
          }
        })
        .catch(() => {});
    } else {
      showToast(`Advertisement approved! Active until ${endAtStr}.`);
    }
  };

  const handleRejectAdvertisement = (adId: number, reason: string) => {
    setAdvertisements((prev) =>
      prev.map((a) =>
        a.id === adId
          ? {
              ...a,
              status: 'REJECTED',
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );

    setAdvertisingPayments((prev) =>
      prev.map((p) =>
        p.advertisementId === adId
          ? {
              ...p,
              status: 'REJECTED',
              rejectionReason: reason,
              reviewedBy: currentUser?.name || 'Administrator',
              reviewedAt: new Date().toISOString(),
            }
          : p
      )
    );

    showToast('Advertisement rejected. Rejection reason logged for the client.');
  };

  const handleToggleAdSuspension = (adId: number) => {
    setAdvertisements((prev) =>
      prev.map((a) => {
        if (a.id === adId) {
          const next = a.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showToast(`Ad campaign is now ${next}.`);
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  const handleRetryAdTelegram = async (adId: number): Promise<boolean> => {
    const ad = advertisements.find((a) => a.id === adId);
    if (!ad) return false;
    const origin = window.location.origin;
    const res = await broadcastToTelegram('announcement', {
      id: ad.id,
      title: `📢 [SPONSORED] ${ad.title}`,
      message: `${ad.description}\n\n📍 Location: ${ad.location}\n📞 Call: ${ad.phone}\n💬 WhatsApp: https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}`,
    } as any, settings.telegramChannelId, origin);

    if (res.success) {
      const msgId = String(res.messageId || '902');
      setAdvertisements((prev) =>
        prev.map((a) =>
          a.id === adId
            ? {
                ...a,
                telegramStatus: 'published',
                telegramMessageId: msgId,
                telegramPublishedAt: new Date().toLocaleString(),
              }
            : a
        )
      );
      handleAddTelegramLog({
        id: Date.now(),
        contentType: 'advertisement',
        contentId: ad.id,
        title: `Sponsored Ad: ${ad.title}`,
        status: 'success',
        messageId: msgId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      showToast('Telegram sponsored broadcast published successfully!');
      return true;
    } else {
      showToast(`Telegram retry failed: ${res.error || 'Network error'}`);
      return false;
    }
  };

  // Submit Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget) return;

    const newReport: ReportItem = {
      id: Date.now(),
      targetType: reportTarget.type,
      targetId: reportTarget.item.id,
      targetTitle: reportTarget.item.title,
      reporterName: currentUser ? currentUser.name : 'Public Buyer',
      reason: reportReason,
      details: reportDetails,
      status: 'pending',
      createdAt: 'Just now',
    };

    setReports([newReport, ...reports]);
    setReportTarget(null);
    setReportDetails('');
    showToast('Thank you! Report received for administrator investigation.');
  };

  // ==========================================
  // Verified Badge & Seller Verification Handlers
  // ==========================================
  const handleCreateVerification = (data: {
    fee: number;
    durationMode: VerifiedBadgeDurationMode;
    businessType: 'seller' | 'shop' | 'transporter';
    shopName?: string;
    cnicNumber?: string;
    trxId: string;
    paymentProofUrl: string;
    documentUrl?: string;
  }) => {
    if (!currentUser) return;
    const newRecord: SellerVerificationRecord = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.mobile,
      userCity: currentUser.city,
      shopName: data.shopName,
      businessType: data.businessType,
      fee: data.fee,
      durationMode: data.durationMode,
      trxId: data.trxId,
      paymentProofUrl:
        data.paymentProofUrl ||
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      cnicNumber: data.cnicNumber,
      documentUrl: data.documentUrl,
      status: 'PENDING',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    setVerifications((prev) => [newRecord, ...prev]);
    const submitNotif: UserNotification = {
      id: Date.now(),
      userId: currentUser.id,
      type: 'VERIFICATION',
      title: 'Verification Request Under Review',
      message: `Your verified seller application (TRX ID: ${data.trxId}) has been received for Rs. ${data.fee.toLocaleString()}. Review is typically completed within 15–30 minutes.`,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [submitNotif, ...prev]);
    showToast('Verification application submitted! Awaiting administrator review.');
  };

  const handleApproveVerification = (id: number) => {
    const record = verifications.find((v) => v.id === id);
    if (!record) return;

    const todayStr = new Date().toISOString().split('T')[0];
    let expiresAtStr: string | undefined = undefined;
    if (record.durationMode === 'monthly') {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      expiresAtStr = expDate.toISOString().split('T')[0];
    }

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'VERIFIED',
              approvedAt: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              reviewedBy: currentUser?.name || 'Administrator',
              expiresAt: expiresAtStr,
            }
          : v
      )
    );

    // Update users: grant verified status
    setUsers((prev) =>
      prev.map((u) =>
        u.id === record.userId
          ? {
              ...u,
              isVerified: true,
              verifiedBadgeExpiresAt: expiresAtStr,
              verifiedShopName: record.shopName,
            }
          : u
      )
    );

    // If current logged-in user is the one being approved
    if (currentUser && currentUser.id === record.userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              isVerified: true,
              verifiedBadgeExpiresAt: expiresAtStr,
              verifiedShopName: record.shopName,
            }
          : null
      );
    }

    // Update listings for this seller: set sellerVerified = true
    setListings((prev) =>
      prev.map((l) => (l.userId === record.userId ? { ...l, sellerVerified: true } : l))
    );

    // Update shops if applicable
    setShops((prev) =>
      prev.map((s) => (s.userId === record.userId ? { ...s, isVerified: true } : s))
    );

    // Update transporters if applicable
    setTransporters((prev) =>
      prev.map((t) =>
        t.userId === record.userId ? { ...t, isVerified: true, verificationStatus: 'APPROVED' } : t
      )
    );

    // Update trucks
    setTrucks((prev) =>
      prev.map((t) => (t.userId === record.userId ? { ...t, isVerified: true } : t))
    );

    // Update digital skills
    setSkills((prev) =>
      prev.map((s) => (s.userId === record.userId ? { ...s, isVerified: true } : s))
    );

    const approveNotif: UserNotification = {
      id: Date.now(),
      userId: record.userId,
      type: 'VERIFICATION',
      title: '🎉 Blue Verified Badge Approved!',
      message: `Congratulations! Your verification application has been approved. The official blue checkmark is now active across all your listings, profile, and shop!`,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [approveNotif, ...prev]);

    showToast(`Verification approved! Blue Verified badge granted to ${record.userName}.`);
  };

  const handleRejectVerification = (id: number, reason: string) => {
    const record = verifications.find((v) => v.id === id);
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'REJECTED',
              rejectionReason:
                reason || 'Application documents or payment proof did not match verification criteria.',
              reviewedBy: currentUser?.name || 'Administrator',
            }
          : v
      )
    );

    if (record) {
      const rejectNotif: UserNotification = {
        id: Date.now(),
        userId: record.userId,
        type: 'VERIFICATION',
        title: 'Verification Request Update',
        message: `Your verification application could not be verified. Reason: ${reason || 'Application details did not match criteria.'}. You can resubmit anytime from your dashboard.`,
        isRead: false,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [rejectNotif, ...prev]);
    }

    showToast('Verification application rejected.');
  };

  const handleRevokeVerification = (id: number, reason: string) => {
    const record = verifications.find((v) => v.id === id);
    if (!record) return;

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'REVOKED',
              revocationReason: reason || 'Verified badge revoked by administrator.',
            }
          : v
      )
    );

    // Remove verified status from user
    setUsers((prev) =>
      prev.map((u) => (u.id === record.userId ? { ...u, isVerified: false } : u))
    );

    if (currentUser && currentUser.id === record.userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isVerified: false } : null));
    }

    setListings((prev) =>
      prev.map((l) => (l.userId === record.userId ? { ...l, sellerVerified: false } : l))
    );

    setShops((prev) =>
      prev.map((s) => (s.userId === record.userId ? { ...s, isVerified: false } : s))
    );

    setTransporters((prev) =>
      prev.map((t) =>
        t.userId === record.userId ? { ...t, isVerified: false, verificationStatus: 'REJECTED' } : t
      )
    );

    setTrucks((prev) =>
      prev.map((t) => (t.userId === record.userId ? { ...t, isVerified: false } : t))
    );

    setSkills((prev) =>
      prev.map((s) => (s.userId === record.userId ? { ...s, isVerified: false } : s))
    );

    const revokeNotif: UserNotification = {
      id: Date.now(),
      userId: record.userId,
      type: 'VERIFICATION',
      title: 'Verified Badge Revoked',
      message: `Your verified seller badge has been revoked. Reason: ${reason || 'Revoked by administrator.'}`,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [revokeNotif, ...prev]);

    showToast('Verified badge revoked.');
  };

  const handleToggleUserVerified = (userId: number) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newStatus = !target.isVerified;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: newStatus } : u))
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isVerified: newStatus } : null));
    }

    setListings((prev) =>
      prev.map((l) => (l.userId === userId ? { ...l, sellerVerified: newStatus } : l))
    );

    setShops((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, isVerified: newStatus } : s))
    );

    setTransporters((prev) =>
      prev.map((t) => (t.userId === userId ? { ...t, isVerified: newStatus } : t))
    );

    setTrucks((prev) =>
      prev.map((t) => (t.userId === userId ? { ...t, isVerified: newStatus } : t))
    );

    setSkills((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, isVerified: newStatus } : s))
    );

    if (newStatus) {
      setVerifications((prev) => {
        const existing = prev.find((v) => v.userId === userId);
        if (existing) {
          return prev.map((v) =>
            v.userId === userId
              ? {
                  ...v,
                  status: 'VERIFIED',
                  approvedAt: new Date().toISOString().split('T')[0],
                  reviewedBy: currentUser?.name || 'Administrator',
                }
              : v
          );
        } else {
          const manualRecord: SellerVerificationRecord = {
            id: Date.now(),
            userId: target.id,
            userName: target.name,
            userPhone: target.mobile,
            userCity: target.city,
            businessType: 'seller',
            fee: settings.verifiedBadgeFee || 6999,
            durationMode: settings.verifiedBadgeDurationMode || 'lifetime',
            trxId: 'ADMIN-DIRECT-GRANT',
            paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
            status: 'VERIFIED',
            appliedAt: new Date().toISOString().split('T')[0],
            approvedAt: new Date().toISOString().split('T')[0],
            reviewedBy: currentUser?.name || 'Administrator',
          };
          return [manualRecord, ...prev];
        }
      });
      showToast(`Blue Verified Badge granted to ${target.name}!`);
    } else {
      setVerifications((prev) =>
        prev.map((v) =>
          v.userId === userId
            ? { ...v, status: 'REVOKED', revocationReason: 'Revoked by administrator from Users management panel.' }
            : v
        )
      );
      showToast(`Verified badge revoked from ${target.name}.`);
    }
  };

  // Filtering Listings
  const filteredListings = listings.filter((l) => {
    if (l.status !== 'published') return false;
    if (selectedCategory !== 'all' && l.categoryId !== selectedCategory) return false;
    if (selectedCity !== 'All' && l.city !== selectedCity) return false;
    if (verifiedOnly) {
      const isSellerVerified = l.sellerVerified || users.some((u) => u.id === l.userId && u.isVerified);
      if (!isSellerVerified) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.categoryName.toLowerCase().includes(q) ||
        (l.subcategory && l.subcategory.toLowerCase().includes(q)) ||
        l.area.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const featuredListings = filteredListings.filter((l) => l.isFeatured);
  const regularListings = filteredListings.filter((l) => !l.isFeatured);
  const activeHomepageAds = advertisements.filter(
    (ad) =>
      ad.status === 'ACTIVE' &&
      (ad.placements.includes('Homepage') || ad.placements.includes('Multiple Website Locations'))
  );

  // Check if current user has an active pending payment
  const userPendingPayment = currentUser
    ? payments.find((p) => p.userId === currentUser.id && p.status === 'pending')
    : null;

  // Maintenance Mode Check (Admins retain access)
  const isUserAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const showMaintenance = settings.isMaintenanceMode && currentView !== 'admin' && !isUserAdmin;

  // Popup Announcement Check
  const popupAnnouncements = getActiveAnnouncements(announcements, 'popup');
  const activePopup = popupAnnouncements.find((a) => a.id !== dismissedPopupId);

  return (
    <div className="min-h-screen bg-[#f8fafc] neon-white-bg text-slate-800 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-cyan-400 text-cyan-900 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        pendingActivationsCount={payments.filter((p) => p.status === 'pending').length}
        onPostClick={handlePostAdClick}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        settings={settings}
        announcements={announcements}
        onInstallPwa={handleInstallPwa}
        isPwaInstalled={isPwaInstalled}
        onOpenHostingerGuide={() => setIsHostingerModalOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Maintenance Mode Screen (Active when enabled in Settings, bypassable for Admin) */}
      {showMaintenance ? (
        <div className="flex-1 flex items-center justify-center p-6 py-24 text-center">
          <div className="max-w-lg bg-white border border-amber-300 rounded-3xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-300 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{settings.maintenanceTitle}</h2>
            <p className="text-slate-600 text-xs leading-relaxed mb-6 font-medium">
              {settings.maintenanceMessage}
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('admin')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all"
              >
                Administrator Login / Portal
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Content Routing */
        <main className="flex-1 pb-16 md:pb-8">
          {/* VIEW 1: HOME MARKETPLACE */}
          {currentView === 'home' && (
            <div>
              <HeroSection
                categories={INITIAL_CATEGORIES}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  if (cat === 40) {
                    setCurrentView('transport');
                  } else if (cat === 50) {
                    setCurrentView('food');
                  } else {
                    setSelectedCategory(cat);
                  }
                }}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                onPostClick={handlePostAdClick}
                onViewJobsClick={() => setCurrentView('jobs')}
                onViewTransportClick={() => setCurrentView('transport')}
                onViewFoodClick={() => setCurrentView('food')}
                onViewCollegesClick={() => setCurrentView('colleges')}
                settings={settings}
                announcements={announcements}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
              />

              <div className="max-w-7xl mx-auto px-4 py-10">
                {/* 🌟 Homepage Spotlight & Sponsored Showcase */}
                {(settings.isHomepageSpotlightEnabled ?? true) && (
                  <div className="mb-14 bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-cyan-500/10 rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                              Homepage Spotlight
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                              ⭐ Verified Sponsors
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs font-medium">
                            Premium sponsored businesses & top local highlights in Sargodha Division
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (currentUser) {
                            setIsCreateAdOpen(true);
                          } else {
                            setIsAuthOpen(true);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                      >
                        <Megaphone className="w-4 h-4" />
                        <span>Get Featured in Spotlight</span>
                      </button>
                    </div>

                    {activeHomepageAds.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeHomepageAds.map((ad) => {
                          const cleanWa = (ad.whatsapp || ad.phone || '').replace(/[^0-9]/g, '');
                          const cleanPhone = (ad.phone || ad.whatsapp || '').replace(/[^0-9]/g, '');
                          return (
                            <div
                              key={ad.id}
                              className="group relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                            >
                              <div>
                                {ad.imageUrl && (
                                  <div className="relative h-44 overflow-hidden bg-slate-100">
                                    <img
                                      src={ad.imageUrl}
                                      alt={ad.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-300 backdrop-blur-md border border-amber-400/30">
                                      <Sparkles className="w-3 h-3 text-amber-400" />
                                      {ad.packageName || 'Spotlight Partner'}
                                    </div>
                                    {ad.location && (
                                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/70 text-white backdrop-blur-md">
                                        <MapPin className="w-3 h-3 text-cyan-400" />
                                        {ad.location}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="p-4 sm:p-5">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-amber-600 transition-colors line-clamp-1">
                                      {ad.title}
                                    </h3>
                                  </div>
                                  <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
                                    {ad.description}
                                  </p>
                                </div>
                              </div>

                              <div className="p-4 pt-0 flex items-center gap-2">
                                {cleanPhone && (
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Call</span>
                                  </a>
                                )}
                                {cleanWa && (
                                  <a
                                    href={`https://wa.me/92${cleanWa.startsWith('0') ? cleanWa.slice(1) : cleanWa}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs shadow-emerald-600/30"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 bg-white/70 backdrop-blur-xs rounded-2xl border border-amber-300/40 text-center flex flex-col items-center justify-center">
                        <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
                        <h4 className="font-bold text-sm text-slate-900 mb-1">
                          Be the First Business in Homepage Spotlight!
                        </h4>
                        <p className="text-slate-500 text-xs max-w-md mb-4">
                          Get maximum local reach across Sargodha, Shaheenabad & Sillanwali with guaranteed top homepage placement and official Telegram broadcast.
                        </p>
                        <button
                          onClick={() => {
                            if (currentUser) {
                              setIsCreateAdOpen(true);
                            } else {
                              setIsAuthOpen(true);
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                        >
                          Book Spotlight Banner (From Rs. 1,500)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Featured Products Section */}
                {settings.isFeaturedProductsEnabled && featuredListings.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">Featured Local Products</h2>
                          <p className="text-slate-500 text-xs font-medium">High-priority listings in Sargodha, Shaheenabad & Sillanwali</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {featuredListings.map((item) => (
                        <ProductCard
                          key={item.id}
                          listing={{
                            ...item,
                            sellerVerified: item.sellerVerified || users.some((u) => u.id === item.userId && u.isVerified),
                          }}
                          isFavorite={favorites.includes(item.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onClick={() => setSelectedListing(item)}
                          onShare={(l) => {
                            const shareUrl = `${window.location.origin}/?product=${l.id}`;
                            navigator.clipboard.writeText(shareUrl);
                            showToast(`Direct link copied for "${l.title}"!`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest Products Section */}
                {settings.isLatestProductsEnabled && (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <span>Latest Product Listings</span>
                          {verifiedOnly && <VerifiedBadge size="xs" />}
                        </h2>
                        <p className="text-slate-500 text-xs font-medium">Direct public ads from verified local sellers</p>
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        Showing <strong className="text-cyan-700">{filteredListings.length}</strong> products
                      </div>
                    </div>

                    {verifiedOnly && (
                      <div className="mb-4 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>
                            Filtering by: <strong>Blue Verified Sellers Only (تصدیق شدہ سیلرز)</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => setVerifiedOnly(false)}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-100 text-blue-700 font-bold border border-blue-300 text-[11px] shrink-0"
                        >
                          Show All Sellers
                        </button>
                      </div>
                    )}

                    {filteredListings.length === 0 ? (
                      <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 mb-1">No products found</h3>
                        <p className="text-slate-500 text-xs mb-4">Try clearing your filters or post the first ad!</p>
                        <button
                          onClick={handlePostAdClick}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20"
                        >
                          Post an Ad
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {regularListings.map((item) => (
                          <ProductCard
                            key={item.id}
                            listing={{
                              ...item,
                              sellerVerified: item.sellerVerified || users.some((u) => u.id === item.userId && u.isVerified),
                            }}
                            isFavorite={favorites.includes(item.id)}
                            onToggleFavorite={handleToggleFavorite}
                            onClick={() => setSelectedListing(item)}
                            onShare={(l) => {
                              const shareUrl = `${window.location.origin}/?product=${l.id}`;
                              navigator.clipboard.writeText(shareUrl);
                              showToast(`Direct link copied for "${l.title}"!`);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Featured Digital Talents Spotlight */}
                {skills.filter((s) => s.status === 'approved' && s.isFeatured).length > 0 && (
                  <div className="mt-14 pt-10 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span>Featured Digital Talents</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                              Verified Pros
                            </span>
                          </h2>
                          <p className="text-slate-500 text-xs font-medium">Top promoted website designers, video editors, and digital marketers</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentView('skills')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Explore All Freelancers</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {skills
                        .filter((s) => s.status === 'approved' && s.isFeatured)
                        .slice(0, 3)
                        .map((skill) => (
                          <div
                            key={skill.id}
                            className="bg-white border-2 border-amber-200 hover:border-amber-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start gap-3 mb-3">
                                <img
                                  src={skill.profilePhoto}
                                  alt={skill.fullName}
                                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-sm font-black text-slate-900">{skill.fullName}</h4>
                                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                      ⭐ FEATURED
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-cyan-800">{skill.professionalTitle}</div>
                                  <div className="text-[11px] text-slate-500">{skill.tehsilName || 'Sargodha'} • {skill.experience} Exp</div>
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                                {skill.about}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {skill.skills.slice(0, 3).map((sk, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-700">{skill.startingRate || 'Affordable Rates'}</span>
                              <button
                                onClick={() => setSelectedSkill(skill)}
                                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                              >
                                View Digital CV
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Nationwide Truck & Freight Spotlight Section on Explore */}
                {(settings.isTruckFreightEnabled ?? true) && (
                  <div className="mt-14 pt-10 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-900">Truck & Freight | ٹرک اور مال برداری</h2>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                              Pakistan Nationwide
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs font-medium">
                            Explore available commercial trucks, freight rates, and post cargo loads with direct driver contact.
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              setPendingPostAction('post-load');
                              setIsAuthOpen(true);
                              showToast('Please login or register to post a freight load (Free of charge).');
                            } else {
                              setIsPostLoadOpen(true);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Package className="w-3.5 h-3.5 text-amber-700" />
                          <span>Post a Load (Free)</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!currentUser) {
                              setPendingPostAction('post-truck');
                              setIsAuthOpen(true);
                              showToast('Please login or register to list your truck.');
                            } else {
                              setIsPostTruckOpen(true);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>List Your Truck</span>
                        </button>

                        <button
                          onClick={() => setCurrentView('transport')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                        >
                          <span>Explore Full Freight Board</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs & Search Bar on Explore */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        <button
                          onClick={() => setTransportExploreFilter('all')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            transportExploreFilter === 'all'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                          }`}
                        >
                          All Transport ({trucks.length + loads.length})
                        </button>
                        <button
                          onClick={() => setTransportExploreFilter('trucks')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                            transportExploreFilter === 'trucks'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Available Trucks ({trucks.length})</span>
                        </button>
                        <button
                          onClick={() => setTransportExploreFilter('loads')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                            transportExploreFilter === 'loads'
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                          }`}
                        >
                          <Package className="w-3.5 h-3.5 text-amber-700" />
                          <span>Cargo Loads ({loads.length})</span>
                        </button>
                      </div>

                      <div className="relative min-w-[220px]">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={transportExploreSearch}
                          onChange={(e) => setTransportExploreSearch(e.target.value)}
                          placeholder="Search route, city, truck type..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Listings Grid: Responsive on Mobile & Desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* TRUCKS */}
                      {(transportExploreFilter === 'all' || transportExploreFilter === 'trucks') &&
                        trucks
                          .filter((truck) => {
                            if (!transportExploreSearch.trim()) return true;
                            const q = transportExploreSearch.toLowerCase();
                            return (
                              truck.title.toLowerCase().includes(q) ||
                              truck.vehicleType.toLowerCase().includes(q) ||
                              truck.currentCity.toLowerCase().includes(q) ||
                              (truck.preferredRoutes || []).some((r: string) => r.toLowerCase().includes(q)) ||
                              (truck.destinationsServed || []).some((d: string) => d.toLowerCase().includes(q))
                            );
                          })
                          .slice(0, transportExploreFilter === 'trucks' ? 6 : 3)
                          .map((truck) => {
                            const cleanPhone = truck.transporterPhone.replace(/[^0-9+]/g, '');
                            const cleanWhatsapp = truck.transporterWhatsapp.replace(/[^0-9+]/g, '');
                            const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                              `Assalam-o-Alaikum! I am contacting you regarding your truck "${truck.title}" listed on SargodhaMart.`
                            )}`;

                            return (
                              <div
                                key={`truck-${truck.id}`}
                                className="bg-white border-2 border-amber-200 hover:border-amber-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                                    <img
                                      src={truck.images[0]}
                                      alt={truck.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-300 font-black text-[10px] uppercase border border-amber-400/30">
                                        {truck.vehicleType}
                                      </span>
                                      {truck.isVerified && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] uppercase">
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-[11px] flex items-center justify-between">
                                      <span className="flex items-center gap-1 truncate font-medium">
                                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> {truck.currentCity}
                                      </span>
                                      <span className="text-amber-300 font-bold shrink-0">
                                        {truck.payloadCapacityTons} Tons Legal
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-4 space-y-2">
                                    <h4 className="font-black text-sm text-slate-900 line-clamp-1">{truck.title}</h4>
                                    <div className="text-xs text-slate-600 flex items-center gap-1">
                                      <span className="font-semibold text-slate-800">Routes:</span>
                                      <span className="truncate">{truck.preferredRoutes.slice(0, 2).join(' • ') || 'Nationwide Pakistan'}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium">
                                      Body: {truck.bodyLengthFeet}ft {truck.bodyType} • {truck.wheelCount} Wheeler
                                    </div>
                                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-bold">
                                      {truck.freightRateDescription || 'Direct market rate with driver. Zero platform cut.'}
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 pt-0">
                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <a
                                        href={`tel:${cleanPhone}`}
                                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                                        title={`Call Transporter: ${cleanPhone}`}
                                      >
                                        <Phone className="w-4 h-4" />
                                      </a>
                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-xs"
                                        title="WhatsApp Transporter"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                      </a>
                                    </div>

                                    <button
                                      onClick={() => setSelectedTruck(truck)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                                    >
                                      Vehicle Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                      {/* LOADS */}
                      {(transportExploreFilter === 'all' || transportExploreFilter === 'loads') &&
                        loads
                          .filter((load) => {
                            if (!transportExploreSearch.trim()) return true;
                            const q = transportExploreSearch.toLowerCase();
                            return (
                              load.cargoName.toLowerCase().includes(q) ||
                              load.pickupCity.toLowerCase().includes(q) ||
                              load.destinationCity.toLowerCase().includes(q) ||
                              load.requiredVehicleType.toLowerCase().includes(q)
                            );
                          })
                          .slice(0, transportExploreFilter === 'loads' ? 6 : 3)
                          .map((load) => {
                            const cleanPhone = load.customerPhone.replace(/[^0-9+]/g, '');
                            const cleanWhatsapp = load.customerWhatsapp.replace(/[^0-9+]/g, '');
                            const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                              `Assalam-o-Alaikum! I saw your load request "${load.cargoName}" (${load.pickupCity} to ${load.destinationCity}) on SargodhaMart.`
                            )}`;

                            return (
                              <div
                                key={`load-${load.id}`}
                                className="bg-white border-2 border-cyan-200 hover:border-cyan-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-100 text-cyan-900">
                                      {load.loadType} • {load.requiredVehicleType}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                      Date: {load.loadingDate}
                                    </span>
                                  </div>

                                  <h4 className="font-black text-sm text-slate-900">{load.cargoName}</h4>
                                  <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span className="text-cyan-800">{load.pickupCity}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-emerald-800">{load.destinationCity}</span>
                                  </div>

                                  <div className="mt-2 text-xs text-slate-600 line-clamp-2">
                                    {load.cargoDescription || `${(load.totalWeightKg / 1000).toFixed(1)} tons payload (${load.packageCount} packages).`}
                                  </div>

                                  <div className="mt-3 text-xs flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Shipper Budget:</span>
                                    <span className="font-black text-emerald-700">
                                      Rs. {load.budgetPKR?.toLocaleString() || 'Negotiable'}
                                    </span>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                                  <div className="flex items-center gap-1.5">
                                    <a
                                      href={`tel:${cleanPhone}`}
                                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                                      title={`Call Shipper: ${cleanPhone}`}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white"
                                      title="WhatsApp Shipper"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </a>
                                  </div>

                                  <button
                                    onClick={() => setSelectedLoad(load)}
                                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                                  >
                                    View & Quote
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                    </div>

                    {/* Platform Disclaimer Banner */}
                    <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                        ⚖️
                      </div>
                      <p className="font-medium text-[11px] leading-relaxed">
                        {settings.freightDisclaimerText ||
                          'Freight charges are paid directly by the customer to the transporter. Sargodha Marketplace collects subscription fees for platform services and is not the recipient of the freight payment.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: FOOD & DINING HUB */}
          {currentView === 'food' && (
            <div className="max-w-7xl mx-auto px-4">
              <FoodSection
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthOpen(true)}
                onPostFoodClick={() => {
                  if (!currentUser) {
                    setIsAuthOpen(true);
                  } else {
                    setIsPostAdOpen(true);
                  }
                }}
              />
            </div>
          )}

          {/* VIEW 2: JOBS & WORK HUB */}
          {currentView === 'jobs' && (
            <JobsSection
              jobs={jobs}
              onPostJobClick={handlePostJobClick}
              onReportJob={(j) => setReportTarget({ type: 'job', item: j })}
              onSelectJob={setSelectedJob}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          )}

          {/* VIEW 3: DIGITAL SKILLS & TALENT DIRECTORY */}
          {currentView === 'skills' && (
            <DigitalSkillsSection
              skills={skills}
              currentUser={currentUser}
              onSelectSkill={setSelectedSkill}
              onOpenPostSkill={() => handleOpenPostSkill()}
              onOpenPromoteSkill={(s) => handleOpenPromoteModal('SKILL', s.id)}
            />
          )}

          {/* VIEW 4: USER DASHBOARD (WITH PROMOTE & DIGITAL SKILLS) */}
          {currentView === 'dashboard' && (
            currentUser ? (
              <UserDashboard
                currentUser={currentUser}
                listings={listings}
                jobs={jobs}
                skills={skills}
                promotions={promotions}
                advertisements={advertisements}
                advertisingPackages={advertisingPackages}
                favorites={favorites}
                onOpenPostAd={handlePostAdClick}
                onOpenPostJob={handlePostJobClick}
                onOpenPostSkill={handleOpenPostSkill}
                onOpenActivation={() => setIsActivationOpen(true)}
                onOpenPromoteModal={handleOpenPromoteModal}
                onOpenCreateAd={() => setIsCreateAdOpen(true)}
                onDeleteListing={handleDeleteListing}
                onDeleteJob={handleDeleteJob}
                onDeleteSkill={handleDeleteSkill}
                onSelectListing={setSelectedListing}
                onSelectSkill={setSelectedSkill}
                onLogout={handleLogout}
                onUpdateTelegramSettings={handleUpdateTelegramSettings}
                verifications={verifications}
                onSubmitVerification={handleCreateVerification}
                paymentMethods={paymentMethods}
                settings={settings}
                shops={shops}
                reviews={reviews}
                notifications={notifications}
                savedSearches={savedSearches}
                follows={follows}
                onSaveShop={handleSaveShop}
                onRespondReview={handleRespondReview}
                onMarkNotificationRead={handleMarkNotificationRead}
                onClearNotifications={handleClearNotifications}
                onAddSavedSearch={handleAddSavedSearch}
                onDeleteSavedSearch={handleDeleteSavedSearch}
                onToggleSavedSearchAlerts={handleToggleSavedSearchAlerts}
                onViewShop={(shop) => setSelectedShop(shop)}
                initialTab={dashboardInitialTab}
              />
            ) : (
              <div className="py-20 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-cyan-50 border border-cyan-300 text-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <LogIn className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Seller Dashboard</h2>
                <p className="text-slate-500 text-xs mb-6 font-medium">
                  Please login or create an account to view your listed products, active jobs, digital skills, and promote requests.
                </p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs shadow-lg shadow-cyan-500/25 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Login / Register
                </button>
              </div>
            )
          )}

          {/* VIEW 5: ADMIN PORTAL (SECURE ACCESS ONLY) */}
          {currentView === 'admin' && (
            currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin') ? (
              <AdminPanel
                currentUser={currentUser}
                users={users}
                listings={listings}
                jobs={jobs}
                payments={payments}
                promotions={promotions}
                onApprovePromotion={handleApprovePromotion}
                onRejectPromotion={handleRejectPromotion}
                skills={skills}
                onToggleSkillStatus={handleToggleSkillStatus}
                onDeleteSkill={handleDeleteSkill}
                reports={reports}
                settings={settings}
                onSaveSettings={handleSaveSettings}
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
                onUpdateAnnouncement={handleUpdateAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
                onToggleListingStatus={handleToggleListingStatus}
                onToggleListingFeatured={handleToggleListingFeatured}
                onDeleteListing={handleDeleteListing}
                onToggleJobStatus={handleToggleJobStatus}
                onDeleteJob={handleDeleteJob}
                onResolveReport={(repId) => {
                  setReports(
                    reports.map((r) => (r.id === repId ? { ...r, status: 'resolved' } : r))
                  );
                  showToast('Report marked as investigated & resolved.');
                }}
                onForceLogoutUser={handleForceLogoutUser}
                telegramLogs={telegramLogs}
                onPublishToTelegram={handlePublishToTelegram}
                onAddTelegramLog={handleAddTelegramLog}
                onApproveUserTelegram={handleApproveUserTelegram}
                onRejectUserTelegram={handleRejectUserTelegram}
                onRevokeUserTelegram={handleRevokeUserTelegram}
                telegramAuditLogs={telegramAuditLogs}
                advertisingPackages={advertisingPackages}
                advertisements={advertisements}
                onSaveAdvertisingPackage={handleSaveAdvertisingPackage}
                onDeleteAdvertisingPackage={handleDeleteAdvertisingPackage}
                onApproveAdvertisement={handleApproveAdvertisement}
                onRejectAdvertisement={handleRejectAdvertisement}
                onToggleAdSuspension={handleToggleAdSuspension}
                onRetryAdTelegram={handleRetryAdTelegram}
                paymentMethods={paymentMethods}
                onSavePaymentMethod={handleSavePaymentMethod}
                onDeletePaymentMethod={handleDeletePaymentMethod}
                onTogglePaymentMethodStatus={handleTogglePaymentMethodStatus}
                trucks={trucks}
                loads={loads}
                transporters={transporters}
                quotations={quotations}
                bookings={bookings}
                subscriptionPlans={subscriptionPlans}
                subscriptionPurchases={subscriptionPurchases}
                onApproveSubscription={handleApproveSubscription}
                onRejectSubscription={handleRejectSubscription}
                onSaveSubscriptionPlan={handleSaveSubscriptionPlan}
                onDeleteSubscriptionPlan={handleDeleteSubscriptionPlan}
                onToggleTransporterStatus={handleToggleTransporterStatus}
                onUpdateDealStatus={handleUpdateDealStatus}
                verifications={verifications}
                onApproveVerification={handleApproveVerification}
                onRejectVerification={handleRejectVerification}
                onRevokeVerification={handleRevokeVerification}
                onToggleUserVerified={handleToggleUserVerified}
                collegeAds={collegeAds}
                onApproveCollegeAd={handleApproveCollegeAd}
                onRejectCollegeAd={handleRejectCollegeAd}
                onSuspendCollegeAd={handleSuspendCollegeAd}
                onDeleteCollegeAd={handleDeleteCollegeAd}
                onOpenHostingerGuide={() => setIsHostingerModalOpen(true)}
              />
            ) : (
              <div className="py-20 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 text-cyan-400 border border-slate-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-900/30">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Administrator Access Required</h2>
                <p className="text-slate-500 text-xs mb-6 font-medium">
                  This portal is reserved exclusively for Sargodha Marketplace administrators. Please authenticate with your administrator credentials to access system controls.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAdminLoginOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span>Enter Administrator Credentials</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-200 cursor-pointer"
                  >
                    <span>Back to Marketplace</span>
                  </button>
                </div>
              </div>
            )
          )}

          {/* VIEW 6: NATIONWIDE TRUCK & FREIGHT LOGISTICS */}
          {currentView === 'transport' && (
            <TransportSection
              currentUser={currentUser}
              trucks={trucks.filter((t) => t.status === 'available' || t.status === 'busy' || t.userId === currentUser?.id)}
              loads={loads.filter((l) => l.status === 'open' || l.status === 'quoted' || l.customerId === currentUser?.id)}
              transporters={transporters}
              quotations={quotations}
              bookings={bookings}
              subscriptionPlans={subscriptionPlans}
              subscriptionPurchases={subscriptionPurchases}
              onOpenAuth={() => setIsAuthOpen(true)}
              onPostLoadClick={() => {
                if (!currentUser) {
                  setPendingPostAction('post-load');
                  setIsAuthOpen(true);
                  showToast('Please login or register to post a freight load (Free for customers).');
                } else {
                  setIsPostLoadOpen(true);
                }
              }}
              onPostTruckClick={() => {
                if (!currentUser) {
                  setPendingPostAction('post-truck');
                  setIsAuthOpen(true);
                  showToast('Please login or register to list your commercial truck.');
                } else {
                  setIsPostTruckOpen(true);
                }
              }}
              onSelectTruck={setSelectedTruck}
              onSelectLoad={setSelectedLoad}
              onSubmitQuotation={handleSubmitQuotation}
              onAcceptQuotation={handleAcceptQuotation}
              onPurchaseSubscription={handlePurchaseSubscription}
              selectedCity={selectedCity}
            />
          )}

          {/* VIEW 7: TOP SELLERS */}
          {currentView === 'top-sellers' && (
            <TopSellersSection
              sellers={users}
              shops={INITIAL_SHOPS}
              listings={listings}
              reviews={INITIAL_REVIEWS}
              currentUser={currentUser}
              onViewShop={setSelectedShop}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}

          {/* VIEW 8: NEARBY */}
          {currentView === 'nearby' && (
            <NearbySection
              listings={listings}
              jobs={jobs}
              shops={INITIAL_SHOPS}
              skills={skills}
              districts={districts}
              tehsils={tehsils}
              areas={areas}
              onSelectListing={setSelectedListing}
              onSelectJob={setSelectedJob}
              onViewShop={setSelectedShop}
              onSelectSkill={setSelectedSkill}
            />
          )}

          {/* VIEW 9: COLLEGES, ADMISSIONS & CAMPUS ADS */}
          {currentView === 'colleges' && (
            <div className="max-w-7xl mx-auto px-4 pt-6">
              <CollegesSection
                collegeAds={collegeAds}
                currentUser={currentUser}
                settings={settings}
                onOpenPostAd={() => {
                  if (!currentUser) {
                    setIsAuthOpen(true);
                  } else {
                    setIsPostCollegeAdModalOpen(true);
                  }
                }}
                onOpenAuth={() => setIsAuthOpen(true)}
                onTrackAction={handleTrackCollegeAction}
              />
            </div>
          )}
        </main>
      )}

      {/* Footer - White Neon Dynamic from Settings */}
      <footer className="bg-white border-t border-cyan-100 py-10 px-4 text-xs text-slate-600 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-black text-slate-950 mb-2 flex items-center gap-1">
              SARGODHA<span className="text-cyan-700">MART</span>
            </div>
            <p className="text-slate-500 text-xs mb-3 font-medium">
              {settings.websiteDescription}
            </p>
            <div className="text-slate-700 text-[11px] font-semibold mb-3">
              One-Time Lifetime Seller Activation: <strong className="text-cyan-800 font-bold">Rs. {settings.activationFee.toLocaleString()}</strong>
            </div>

            {/* Admin Portal Button in About Section */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleAdminPortalClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                title="Sargodha Marketplace Admin Portal"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Login / Portal</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Local Hubs</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><button onClick={() => { setSelectedCity('Sargodha'); setCurrentView('home'); }} className="hover:text-cyan-700">Sargodha City</button></li>
              <li><button onClick={() => { setSelectedCity('Shaheenabad'); setCurrentView('home'); }} className="hover:text-cyan-700">Shaheenabad Mandi</button></li>
              <li><button onClick={() => { setSelectedCity('Sillanwali'); setCurrentView('home'); }} className="hover:text-cyan-700">Sillanwali Citrus Belt</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Community & Trust</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              {settings.isWhatsappChannelEnabled && (
                <li>
                  <a href={settings.whatsappChannelUrl} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">
                    {settings.whatsappChannelName}
                  </a>
                </li>
              )}
              {settings.isCallButtonEnabled && (
                <li>
                  <a href={`tel:${settings.officialPhone}`} className="hover:text-slate-900 font-semibold">
                    Support: {settings.officialPhone}
                  </a>
                </li>
              )}
              <li className="font-medium">Account Title: {settings.paymentAccountTitle}</li>
              <li className="text-[11px] text-slate-400">{settings.officialAddress}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Social Media Channels</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.socialLinks
                .filter((s) => s.isEnabled)
                .map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center gap-1"
                  >
                    <span>{soc.platform}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </a>
                ))}
            </div>
            <p className="text-[10px] text-slate-400">
              Verified local updates & community trading notices.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-medium">
          <div>{settings.copyrightText}</div>
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => setCurrentView('home')} className="hover:text-slate-900">Marketplace</button>
            <button onClick={() => setCurrentView('food')} className="hover:text-slate-900">Food Deals</button>
            <button onClick={() => setCurrentView('jobs')} className="hover:text-slate-900">Jobs</button>
            <button onClick={() => setCurrentView('colleges')} className="hover:text-indigo-900 font-bold text-indigo-700">Colleges &amp; Admissions</button>
            <button onClick={() => setCurrentView('transport')} className="hover:text-slate-900">Truck Freight</button>
            <button onClick={() => setCurrentView('top-sellers')} className="hover:text-slate-900">Top Sellers</button>
            <button onClick={() => setCurrentView('nearby')} className="hover:text-slate-900">Nearby</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-slate-900">Dashboard</button>
            <button onClick={handleAdminPortalClick} className="hover:text-slate-900 font-semibold">Admin Portal</button>
            {!isPwaInstalled && (
              <button
                onClick={handleInstallPwa}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span>Install SargodhaMart</span>
              </button>
            )}
          </div>
        </div>

        {/* AKRAAM TECHFORGE BRANDING & ADMIN SUPPORT 0309 8557159 */}
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-0.5">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900">
              SARGODHA MARKETPLACE — Your City. Your Marketplace.
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              DESIGNED &amp; DEVELOPED BY <strong className="text-cyan-700 font-extrabold">AKRAAM TECHFORGE</strong> (Ideas • Code • Future)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-600" />
              <span>Admin Support: <strong className="text-slate-900 font-bold">{settings.adminSupportPhone || '0309 8557159'}</strong></span>
            </div>
            <a
              href={`tel:${(settings.adminSupportPhone || '03098557159').replace(/\s+/g, '')}`}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>Call</span>
            </a>
            <a
              href="https://wa.me/923098557159"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setShowIntro(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Replay 3D Intro</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First PWA Install Banner */}
      {!isPwaInstalled && (
        <div className="md:hidden fixed bottom-16 left-3 right-3 z-30 bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black truncate">Install SargodhaMart</div>
              <div className="text-[10px] text-slate-400 truncate">Add to phone home screen</div>
            </div>
          </div>
          <button
            onClick={handleInstallPwa}
            className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 shadow-md"
          >
            Install
          </button>
        </div>
      )}

      {/* Mobile-First Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-cyan-100 px-4 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-cyan-700 font-black' : 'text-slate-500'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Market</span>
        </button>

        <button
          onClick={() => setCurrentView('food')}
          className={`flex flex-col items-center gap-1 ${currentView === 'food' ? 'text-amber-600 font-black' : 'text-slate-500'}`}
        >
          <Utensils className="w-5 h-5 text-amber-500" />
          <span>Food</span>
        </button>

        <button
          onClick={() => setCurrentView('jobs')}
          className={`flex flex-col items-center gap-1 ${currentView === 'jobs' ? 'text-blue-700 font-black' : 'text-slate-500'}`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Jobs</span>
        </button>

        <button
          onClick={() => setCurrentView('skills')}
          className={`flex flex-col items-center gap-1 ${currentView === 'skills' ? 'text-emerald-700 font-black' : 'text-slate-500'}`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Skills</span>
        </button>

        <button
          onClick={() => setCurrentView('transport')}
          className={`flex flex-col items-center gap-1 ${currentView === 'transport' ? 'text-amber-700 font-black' : 'text-slate-500'}`}
        >
          <Truck className="w-5 h-5 text-amber-600" />
          <span>Freight</span>
        </button>

        <button
          onClick={handlePostAdClick}
          className="flex flex-col items-center gap-1 text-white bg-gradient-to-tr from-cyan-500 to-fuchsia-600 p-2.5 rounded-full -mt-6 shadow-xl shadow-cyan-500/30"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            if (!currentUser) setIsAuthOpen(true);
            else setCurrentView('dashboard');
          }}
          className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-fuchsia-700 font-black' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView('colleges')}
          className={`flex flex-col items-center gap-1 shrink-0 ${currentView === 'colleges' ? 'text-indigo-700 font-black' : 'text-slate-500'}`}
        >
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span>Colleges</span>
        </button>
      </div>

      {/* Popup Announcement Notice (Dismissable) */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white border border-amber-300 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDismissedPopupId(activePopup.id)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 text-center mb-1">{activePopup.title}</h3>
            <p className="text-xs text-slate-600 text-center font-medium leading-relaxed mb-6">
              {activePopup.message}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDismissedPopupId(activePopup.id)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Dismiss
              </button>
              {activePopup.buttonText && activePopup.buttonUrl && (
                <a
                  href={activePopup.buttonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1"
                >
                  <span>{activePopup.buttonText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Register / Login) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
        existingUsers={users}
      />

      {/* Admin Login Modal (Restricted Admin Authentication) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(adminUser) => {
          setCurrentUser(adminUser);
          setCurrentView('admin');
          showToast('Administrator authenticated. Admin Panel unlocked.');
        }}
        existingUsers={users}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        listing={
          selectedListing
            ? {
                ...selectedListing,
                sellerVerified: selectedListing.sellerVerified || users.some((u) => u.id === selectedListing.userId && u.isVerified),
              }
            : null
        }
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        isFavorite={selectedListing ? favorites.includes(selectedListing.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onReport={(l) => setReportTarget({ type: 'listing', item: l })}
        reviews={reviews}
        currentUser={currentUser}
        onSubmitReview={handleCreateReview}
      />

      {/* Hostinger Production Deployment Guide Modal */}
      <HostingerDeployModal
        isOpen={isHostingerModalOpen}
        onClose={() => setIsHostingerModalOpen(false)}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onReport={(j) => setReportTarget({ type: 'job', item: j })}
      />

      {/* Post Ad Modal */}
      {currentUser && (
        <PostAdModal
          currentUser={currentUser}
          categories={INITIAL_CATEGORIES}
          isOpen={isPostAdOpen}
          onClose={() => setIsPostAdOpen(false)}
          onSubmitAd={handleAddListing}
          onOpenActivation={() => setIsActivationOpen(true)}
          settings={settings}
        />
      )}

      {/* Post Job Modal */}
      {currentUser && (
        <PostJobModal
          currentUser={currentUser}
          isOpen={isPostJobOpen}
          onClose={() => setIsPostJobOpen(false)}
          onSubmitJob={handleAddJob}
          onOpenActivation={() => setIsActivationOpen(true)}
          settings={settings}
        />
      )}

      {/* Lifetime Activation Modal */}
      {currentUser && (
        <ActivationModal
          currentUser={currentUser}
          isOpen={isActivationOpen}
          onClose={() => setIsActivationOpen(false)}
          onSubmitActivation={handleSubmitActivation}
          existingPendingPayment={userPendingPayment}
          onOpenAdminPanel={
            currentUser.role === 'super_admin' || currentUser.role === 'admin'
              ? () => setCurrentView('admin')
              : undefined
          }
          settings={settings}
          paymentMethods={paymentMethods}
        />
      )}

      {/* Report Modal */}
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setReportTarget(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-600" /> Report {reportTarget.type === 'listing' ? 'Product' : 'Job Post'}
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate font-medium">{reportTarget.item.title}</p>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-800 font-semibold mb-1">Reason for report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-400"
                >
                  {(settings.reportReasons || ['Scam / Fake', 'Wrong Price / Misleading', 'Other']).map((reason, idx) => (
                    <option key={idx} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-semibold mb-1">Additional details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe the issue for the admin team..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-400"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Skill Profile Modal (Digital CV View) */}
      <SkillProfileModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onPromoteClick={(s) => handleOpenPromoteModal('SKILL', s.id)}
        isOwner={currentUser ? currentUser.id === selectedSkill?.userId : false}
      />

      {/* Post / Edit Digital Skill Profile Modal */}
      {currentUser && (
        <PostSkillModal
          isOpen={isPostSkillOpen}
          onClose={() => {
            setIsPostSkillOpen(false);
            setEditingSkill(null);
          }}
          currentUser={currentUser}
          initialSkill={editingSkill}
          onSaveSkill={handleSaveSkill}
        />
      )}

      {/* Promote Modal (Product & Skill Promotion - Fee Separation from Lifetime Activation) */}
      {currentUser && (
        <PromoteModal
          isOpen={isPromoteOpen}
          onClose={() => setIsPromoteOpen(false)}
          currentUser={currentUser}
          listings={listings}
          skills={skills}
          settings={settings}
          paymentMethods={paymentMethods}
          preselectedType={promotePreselectedType}
          preselectedId={promotePreselectedId}
          onSubmitPromotion={handleSubmitPromotion}
        />
      )}

      {/* Create Advertisement Modal (Admin-configurable Packages & Payment Methods) */}
      {currentUser && (
        <CreateAdModal
          isOpen={isCreateAdOpen}
          onClose={() => setIsCreateAdOpen(false)}
          currentUser={currentUser}
          packages={advertisingPackages}
          settings={settings}
          paymentMethods={paymentMethods}
          onSubmitAd={handleSubmitAdvertisement}
        />
      )}

      {/* Truck Detail Modal (Public access without login) */}
      <TruckDetailModal
        truck={selectedTruck}
        onClose={() => setSelectedTruck(null)}
        onBookOrQuote={() => {
          setSelectedTruck(null);
          setCurrentView('transport');
        }}
      />

      {/* Load Detail Modal (Public access without login) */}
      <LoadDetailModal
        load={selectedLoad}
        currentUser={currentUser}
        onClose={() => setSelectedLoad(null)}
        onSubmitQuotation={handleSubmitQuotation}
      />

      {/* Post Truck Modal (Requires login) */}
      {currentUser && (
        <PostTruckModal
          isOpen={isPostTruckOpen}
          onClose={() => setIsPostTruckOpen(false)}
          currentUser={currentUser}
          onSubmitTruck={handlePostTruck}
        />
      )}

      {/* Post Load Modal (Requires login - Free for customer) */}
      {currentUser && (
        <PostLoadModal
          isOpen={isPostLoadOpen}
          onClose={() => setIsPostLoadOpen(false)}
          currentUser={currentUser}
          onSubmitLoad={handlePostLoad}
        />
      )}

      {/* Shop Profile Modal */}
      {selectedShop && (
        <ShopProfileView
          shop={selectedShop}
          listings={listings.filter((l) => l.userId === selectedShop.userId)}
          onBack={() => setSelectedShop(null)}
          onSelectListing={setSelectedListing}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          reviews={INITIAL_REVIEWS}
          currentUser={currentUser}
        />
      )}

      {/* Persistent Floating AI Assistant Button (Bottom Right Corner) */}
      <AIAssistantWidget
        currentUser={currentUser}
        settings={settings}
        listings={listings}
        jobs={jobs}
        skills={skills}
        trucks={trucks}
        loads={loads as any}
        advertisingPackages={advertisingPackages}
        advertisements={advertisements}
        promotionPayments={promotions}
        onNavigate={(view, subTab) => {
          setCurrentView(view);
          if (subTab) setDashboardInitialTab(subTab);
        }}
        onSelectListing={(listing) => setSelectedListing(listing)}
        onSelectJob={(job) => setSelectedJob(job)}
        onSelectSkill={(skill) => setSelectedSkill(skill)}
        onSelectTruck={(truck) => setSelectedTruck(truck)}
        onSelectLoad={(load) => setSelectedLoad(load as any)}
        onOpenPostAd={handlePostAdClick}
        onOpenPostJob={handlePostJobClick}
        onOpenPostTruck={() => {
          if (!currentUser) {
            setPendingPostAction('post-truck');
            setIsAuthOpen(true);
            showToast('Please login or register to register and post a commercial truck.');
          } else {
            setIsPostTruckOpen(true);
          }
        }}
        onOpenPostLoad={() => {
          if (!currentUser) {
            setPendingPostAction('post-load');
            setIsAuthOpen(true);
            showToast('Please login or register to post a freight load (Free).');
          } else {
            setIsPostLoadOpen(true);
          }
        }}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenPromoteModal={() => handleOpenPromoteModal('PRODUCT')}
        onOpenCreateAd={() => setIsCreateAdOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Post College / Campus Admission Ad Modal */}
      <PostCollegeAdModal
        isOpen={isPostCollegeAdModalOpen}
        onClose={() => setIsPostCollegeAdModalOpen(false)}
        currentUser={currentUser}
        settings={settings}
        onSubmit={handleCreateCollegeAd}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Cinematic 3D Intro Screen (Runs once per session with skip, auto-open, and configurable support buttons) */}
      {showIntro && settings.isIntroAnimationEnabled !== false && (
        <IntroScreen
          settings={settings}
          onComplete={() => setShowIntro(false)}
        />
      )}
    </div>
  );
}

export default App;
