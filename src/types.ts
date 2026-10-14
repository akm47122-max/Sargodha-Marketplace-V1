export type City = 'Sargodha' | 'Shaheenabad' | 'Sillanwali' | 'Lahore' | 'Faisalabad' | 'Rawalpindi' | 'Islamabad' | 'Multan' | 'Karachi' | 'Hyderabad' | 'Sukkur' | 'Peshawar' | 'Quetta' | 'Bhalwal' | 'Kot Momin' | 'Bhera' | 'Sahiwal' | 'Shahpur' | 'Khushab' | 'Mianwali' | 'Bhakkar' | string;
export type Condition = 'New' | 'Used' | 'Refurbished' | 'Like New';
export type ActivationStatus = 'pending' | 'active' | 'rejected' | 'suspended';
export type JobPostType = 'need_job' | 'need_worker';

// ==========================================
// Business / Shop Profile
// ==========================================
export interface BusinessShop {
  id: number;
  userId: number;
  ownerName: string;
  name: string;
  slug: string;
  logo: string;
  coverImage?: string;
  description: string;
  city: City;
  area: string;
  address?: string;
  phone: string;
  whatsapp: string;
  openingHours?: string;
  services?: string[];
  socialLinks?: { platform: string; url: string }[];
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  views: number;
  callClicks: number;
  whatsappClicks: number;
  followersCount?: number;
  createdAt: string;
}

// ==========================================
// Recently Viewed History
// ==========================================
export type RecentlyViewedType = 'PRODUCT' | 'SHOP' | 'JOB' | 'SKILL';

export interface RecentlyViewedItem {
  id: string; // e.g. "product-1"
  type: RecentlyViewedType;
  entityId: number;
  title: string;
  subtitle?: string;
  price?: number;
  imageUrl?: string;
  location?: string;
  viewedAt: string;
}

// ==========================================
// Saved Searches & Alerts
// ==========================================
export interface SavedSearch {
  id: number;
  userId: number;
  name?: string;
  query: string;
  categoryName?: string;
  subCategoryName?: string;
  cityName?: string;
  areaName?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  alertsEnabled?: boolean;
  lastAlertAt?: string;
  createdAt: string;
}

// ==========================================
// Followed Sellers & Shops
// ==========================================
export interface SellerFollow {
  id: number;
  userId: number; // The follower
  targetType: 'SELLER' | 'SHOP';
  targetId: number; // sellerId or shopId
  targetName: string;
  targetLocation?: string;
  targetRating?: number;
  alertsEnabled: boolean;
  followedAt: string;
}

// ==========================================
// User Notifications Center
// ==========================================
export type NotificationType =
  | 'ACTIVATION'
  | 'PRODUCT'
  | 'JOB'
  | 'SKILL'
  | 'PROMOTION'
  | 'VERIFICATION'
  | 'REVIEW'
  | 'ADVERTISEMENT'
  | 'SAVED_SEARCH'
  | 'SELLER_FOLLOW'
  | 'TRANSPORT_LOAD'
  | 'TRANSPORT_QUOTATION'
  | 'TRANSPORT_BOOKING'
  | 'SYSTEM';

export interface UserNotification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  targetId?: number;
  targetType?: string;
  createdAt: string;
}

// ==========================================
// Seller & Shop Detailed Analytics Metrics
// ==========================================
export interface ListingInsights {
  listingId: number;
  views: number;
  uniqueViews: number;
  favorites: number;
  callClicks: number;
  whatsappClicks: number;
  shares: number;
  comparisonAdds: number;
  searchAppearances: number;
  promotionImpressions: number;
  promotionClicks: number;
  status: string;
  expiresAt?: string;
}

// ==========================================
// Seller Reviews & Ratings
// ==========================================
export interface SellerReview {
  id: number;
  sellerId: number;
  reviewerId: number;
  reviewerName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  sellerResponse?: string;
  sellerRespondedAt?: string;
  isReported?: boolean;
  status: 'pending' | 'published' | 'rejected';
  createdAt: string;
  listingId?: number;
  reviewerCity?: string;
  reviewerPhone?: string;
  isVerifiedCustomer?: boolean;
  helpfulCount?: number;
  tags?: string[];
}

// ==========================================
// Verified Seller Application
// ==========================================
export interface VerificationRequest {
  id: number;
  userId: number;
  userName: string;
  fee: number;
  durationDays: number;
  transactionReference: string;
  paymentScreenshot: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  rejectionReason?: string;
  submittedAt: string;
  approvedAt?: string;
  expiresAt?: string;
}

// ==========================================
// User Telegram Number & Verification Status
// ==========================================
export type TelegramVerificationStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type TelegramVisibility = 'VISIBLE' | 'HIDDEN';
export type ContactPrivacy = 'SHOW_ALL' | 'WHATSAPP_ONLY' | 'CALL_WHATSAPP' | 'HIDE_PHONE';

export interface UserTelegramAuditLog {
  id: number;
  userId: number;
  userName: string;
  telegramNumber: string;
  status: TelegramVerificationStatus;
  actionType: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REVOKE' | 'CHANGE_INVALIDATED';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  timestamp: string;
}

// ==========================================
// Location Hierarchy: Division → District → Tehsil → Area
// ==========================================
export interface Division {
  id: number;
  name: string;
  isActive: boolean;
}

export interface District {
  id: number;
  divisionId: number;
  name: string;
  isActive: boolean;
}

export interface Tehsil {
  id: number;
  districtId: number;
  name: string;
  isActive: boolean;
}

export interface AreaLocation {
  id: number;
  tehsilId: number;
  name: string;
  isActive: boolean;
}

export interface UserProfile {
  id: number;
  uid?: string;
  name: string;
  mobile: string;
  email: string;
  city: City;
  area: string;
  role: 'user' | 'admin' | 'super_admin';
  activationStatus: ActivationStatus;
  joinedDate: string;
  // User Telegram Number & Verification
  telegramNumber?: string;
  telegramStatus?: TelegramVerificationStatus;
  telegramSubmittedAt?: string;
  telegramReviewedBy?: string;
  telegramReviewedAt?: string;
  telegramRejectionReason?: string;
  telegramVisibility?: TelegramVisibility;
  contactPrivacy?: ContactPrivacy;

  // Verified Seller / Business Badge
  isVerified?: boolean;
  verifiedBadgeExpiresAt?: string;
  verifiedShopName?: string;
}

export interface Category {
  id: number;
  name: string;
  nameUrdu?: string;
  slug: string;
  icon: string;
  image?: string;
  subcategories: string[];
}

export interface Listing {
  id: number;
  userId: number;
  sellerName: string;
  sellerPhone: string;
  sellerCity: City;
  sellerArea: string;
  sellerWhatsappGroup?: string;
  sellerTelegramNumber?: string;
  sellerTelegramStatus?: TelegramVerificationStatus;
  sellerTelegramVisibility?: TelegramVisibility;
  sellerContactPrivacy?: ContactPrivacy;
  sellerVerified?: boolean;
  title: string;
  categoryId: number;
  categoryName: string;
  subcategory?: string;
  price: number;
  condition: Condition;
  description: string;
  city: City;
  area: string;
  exactLocation?: string;
  divisionId?: number;
  districtId?: number;
  tehsilId?: number;
  areaId?: number;
  districtName?: string;
  tehsilName?: string;
  areaName?: string;
  telegramPublished?: boolean;
  telegramMessageId?: string;
  status: 'published' | 'pending' | 'rejected' | 'disabled' | 'expired';
  isFeatured: boolean;
  isPromoted?: boolean;
  promotedBadge?: string;
  shopId?: number;
  callClicks?: number;
  whatsappClicks?: number;
  expiresAt?: string;
  isExpired?: boolean;
  images: string[];
  views: number;
  createdAt: string;

  // Dedicated Clothing & Cloth Selling Attributes
  clothingSizes?: string[];
  clothingColors?: string[];
  clothingVarieties?: string;
  clothingStock?: number;
  isWholesaleAvailable?: boolean;
  minWholesaleQty?: number;
  salePrice?: number;
  deliveryInfo?: string;
  sellerRating?: number;
  sellerReviewCount?: number;
  rating?: number;
  reviewCount?: number;
  favoritesCount?: number;
  comparisonAdds?: number;
  sharesCount?: number;
}

export interface JobPost {
  id: number;
  userId: number;
  posterName: string;
  postType: JobPostType;
  title: string;
  category: string;
  skills: string;
  experience?: string;
  workingHours?: string;
  salaryOrPayment?: string;
  city: City;
  area: string;
  divisionId?: number;
  districtId?: number;
  tehsilId?: number;
  areaId?: number;
  districtName?: string;
  tehsilName?: string;
  areaName?: string;
  telegramPublished?: boolean;
  telegramMessageId?: string;
  description: string;
  phone: string;
  whatsapp: string;
  callClicks?: number;
  whatsappClicks?: number;
  status: 'published' | 'disabled';
  views: number;
  createdAt: string;
}

export interface ActivationPayment {
  id: number;
  userId: number;
  userName: string;
  userCity: City;
  userPhone: string;
  amount: number;
  method: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer' | string;
  senderNumber: string;
  transactionId: string;
  paymentScreenshot: string;
  whatsappScreenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  activationType?: 'FREE' | 'PAID';
  isFreeSlot?: boolean;
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface ReportItem {
  id: number;
  targetType: 'listing' | 'job' | 'seller' | 'shop' | 'skill' | 'truck' | 'load';
  targetId: number;
  targetTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  adminNotes?: string;
  moderationAction?: 'none' | 'warned' | 'hidden' | 'suspended' | 'deleted';
  status: 'new' | 'under_review' | 'resolved' | 'rejected' | 'escalated' | 'pending';
  createdAt: string;
  resolvedAt?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  message: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  displayLocation: 'top_bar' | 'homepage_banner' | 'popup';
  isHighlighted: boolean;
  isActive: boolean;
  startDate?: string;
  expiryDate?: string;
  telegramPublished?: boolean;
  telegramMessageId?: string;
  createdAt: string;
}

export interface SocialLink {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok' | 'WhatsApp Channel' | 'Other';
  title: string;
  url: string;
  isEnabled: boolean;
  displayOrder: number;
}

export interface SiteSettings {
  // 1. General Settings
  websiteName: string;
  logoText: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  tagline: string;
  websiteDescription: string;
  contactEmail: string;
  officialPhone: string;
  officialWhatsapp: string;
  officialAddress: string;
  copyrightText: string;

  // 2. WhatsApp & Contact Settings
  whatsappChannelUrl: string;
  whatsappGroupUrl: string;
  officialWhatsappNumber: string;
  officialCallNumber: string;
  whatsappChannelName: string;
  whatsappGroupName: string;
  whatsappBtnText: string;
  callBtnText: string;
  followChannelBtnText: string;
  joinGroupBtnText: string;
  isWhatsappChannelEnabled: boolean;
  isWhatsappGroupEnabled: boolean;
  isWhatsappContactEnabled: boolean;
  isCallButtonEnabled: boolean;

  // 3. Social Media Settings
  socialLinks: SocialLink[];

  // 4. SEO Settings
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;

  // 5. Homepage Settings
  heroHeading: string;
  heroHeadingHighlight: string;
  heroDescription: string;
  heroBannerImageUrl?: string;
  heroButtonText: string;
  isFeaturedProductsEnabled: boolean;
  isLatestProductsEnabled: boolean;
  isJobsSectionEnabled: boolean;
  isCategoriesSectionEnabled: boolean;
  isWorkflowGuideEnabled: boolean;
  whatsappCtaText: string;

  // 6. Marketplace Settings
  maxImagesPerListing: number;
  allowPriceNegotiable: boolean;
  defaultListingDurationDays: number;
  listingRulesText: string;
  reportReasons: string[];

  // 7. Jobs Settings
  isNeedJobEnabled: boolean;
  isNeedWorkerEnabled: boolean;
  jobRulesText: string;
  jobSalaryGuidance: string;
  jobSeoPattern: string;

  // 8. Seller Activation Settings
  activationFee: number;
  freeSellerActivationLimit: number;
  isFreeSellerOfferActive: boolean;
  paymentAccountTitle: string;
  easyPaisaNumber: string;
  jazzCashNumber: string;
  bankDetails: string;
  paymentInstructions: string;
  transactionIdInstructions: string;
  isPaymentScreenshotRequired: boolean;
  isWhatsappFollowScreenshotRequired: boolean;
  activationUnderReviewNotice: string;

  // 8. Notifications & Messages
  registrationSuccessMsg: string;
  activationSubmittedMsg: string;
  activationApprovedMsg: string;
  activationRejectedMsg: string;
  listingPublishedMsg: string;
  jobPublishedMsg: string;

  // 9. Maintenance Settings
  isMaintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  isNewRegistrationEnabled: boolean;
  isNewListingEnabled: boolean;
  isJobPostingEnabled: boolean;

  // 10. Telegram Automation Settings
  telegramEnabled: boolean;
  telegramChannelId: string;
  telegramAutoPublishProducts: boolean;
  telegramAutoPublishJobs: boolean;
  telegramAutoPublishAnnouncements: boolean;
  telegramTokenConfigured: boolean;

  // 11. Promotion & Feature Settings
  promoProductEnabled: boolean;
  promoProductPrice: number;
  promoProductDuration: number;
  promoProductTitle: string;
  promoProductDesc: string;
  promoSkillEnabled: boolean;
  promoSkillPrice: number;
  promoSkillDuration: number;
  promoSkillTitle: string;
  promoSkillDesc: string;
  telegramAutoPublishPromotions: boolean;
  jobEmailNotificationsEnabled: boolean;

  // 12. Verified Seller & Badge Settings
  verifiedBadgeFee: number;
  verifiedBadgeDurationMode: 'lifetime' | 'monthly';
  verifiedBadgeMonthlyRenewalPrice: number;
  verifiedBadgeRenewalReminders: boolean;
  verifiedBadgeGraceDays: number;
  freightGracePeriodDays: number;

  // 13. Nationwide Truck & Freight Settings
  isTruckFreightEnabled?: boolean;
  isTruckPostingEnabled?: boolean;
  isLoadPostingEnabled?: boolean;
  freightDisclaimerText?: string;

  // 14. SargodhaMart AI Assistant Settings
  isAIAssistantEnabled?: boolean;
  isAIAssistantVoiceEnabled?: boolean;
  aiAssistantRateLimitPerUser?: number;

  // 15. Homepage Spotlight & Showcase Settings
  isHomepageSpotlightEnabled?: boolean;

  // 16. Cinematic 3D Intro & Branding Settings
  isIntroAnimationEnabled?: boolean;
  adminSupportPhone?: string;
  adminSupportWhatsApp?: string;

  // 17. Colleges, Admissions & Campus Ads Settings
  isCollegesModuleEnabled?: boolean;
  collegeAdPackagePrice?: number;
  collegeAdDurationDays?: number;
}

// ==========================================
// Colleges, Admissions & Campus Ads
// ==========================================
export type CollegeAdStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'SUSPENDED';

export interface CollegeAd {
  id: number;
  userId: number;
  instituteName: string;
  instituteType: 'University' | 'College' | 'Academy' | 'Institute' | 'Polytechnic';
  tagline?: string;
  location: string;
  city: City;
  area: string;
  address: string;
  contactPerson?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  officialWebsite?: string;
  applicationFormUrl: string; // Google Forms / Online Portal URL
  applicationDeadline: string; // e.g. 2026-11-15
  coursesOffered: string[];
  eligibilityCriteria?: string;
  description: string;
  posterImage: string;
  logoImage?: string;
  packagePrice: number;
  durationDays: number;
  transactionReference: string;
  paymentProofUrl?: string;
  status: CollegeAdStatus;
  views: number;
  applyClicks: number;
  callClicks: number;
  whatsappClicks: number;
  submittedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export type PromotionType = 'PRODUCT' | 'SKILL';
export type PromotionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface PromotionPayment {
  id: number;
  userId: number;
  userName: string;
  userPhone?: string;
  promotionType: PromotionType;
  entityType: 'PRODUCT' | 'SKILL_PROFILE';
  entityId: number;
  entityTitle: string;
  amount: number;
  durationDays: number;
  transactionReference: string;
  paymentScreenshot: string;
  status: PromotionStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  startAt?: string;
  endAt?: string;
  views?: number;
  createdAt: string;
}

export interface DigitalSkillProfile {
  id: number;
  userId: number;
  fullName: string;
  username: string;
  profilePhoto: string;
  professionalTitle: string;
  mainSkill: string;
  category: string;
  skills: string[];
  experience: string;
  about: string;
  divisionId?: number;
  districtId?: number;
  tehsilId?: number;
  areaId?: number;
  divisionName?: string;
  districtName?: string;
  tehsilName?: string;
  areaName?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  showEmail?: boolean;
  portfolioLinks?: { label: string; url: string }[];
  servicesOffered: string[];
  startingRate?: number;
  availability: 'Full-time' | 'Part-time' | 'Freelance' | 'Hourly';
  cvFilePath?: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  isVerified?: boolean;
  featuredStartAt?: string;
  featuredEndAt?: string;
  views?: number;
  contactClicks?: number;
  createdAt: string;
}

export interface TelegramLogItem {
  id: number;
  contentType: 'product' | 'job' | 'announcement' | 'test' | 'advertisement';
  contentId?: number;
  title: string;
  status: 'success' | 'failed';
  messageId?: string;
  errorMessage?: string;
  timestamp: string;
}

// ==========================================
// Advertising Pricing & Management System
// ==========================================
export type AdPlacement =
  | 'Homepage'
  | 'Category Page'
  | 'Product Page'
  | 'Jobs Page'
  | 'Digital Skills Page'
  | 'Search Results'
  | 'Location Page'
  | 'Telegram Channel'
  | 'Multiple Website Locations';

export interface AdvertisingPackage {
  id: number;
  name: string;
  adType: string;
  description: string;
  price: number;
  durationDays: number;
  placements: AdPlacement[];
  telegramEnabled: boolean;
  recommended: boolean;
  isActive: boolean;
  displayOrder: number;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type AdStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_UNDER_REVIEW'
  | 'PAYMENT_VERIFIED'
  | 'AD_UNDER_REVIEW'
  | 'PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REJECTED'
  | 'SUSPENDED';

export interface Advertisement {
  id: number;
  userId: number;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  packageId: number;
  packageName: string;
  adType: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl?: string;
  phone: string;
  whatsapp: string;
  location: string;
  placements: AdPlacement[];
  status: AdStatus;
  amountPaid: number;
  durationDays: number;
  transactionReference: string;
  paymentScreenshot: string;
  paymentMethod?: string;
  // Sponsored Product(s) linkages
  productId?: number;
  productIds?: number[];
  categoryName?: string;
  rejectionReason?: string;
  startAt?: string;
  endAt?: string;
  impressions?: number;
  clicks?: number;
  telegramEnabled: boolean;
  telegramStatus?: 'pending' | 'published' | 'failed' | 'not_applicable';
  telegramMessageId?: string;
  telegramPublishedAt?: string;
  telegramError?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// Dynamic Admin Payment Methods
// ==========================================
export interface PaymentMethod {
  id: number;
  name: string; // e.g. EasyPaisa, JazzCash, Meezan Bank, Raast ID
  accountTitle: string;
  accountNumber: string;
  merchantDetails?: string;
  instructions: string;
  qrCodeUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvertisingPayment {
  id: number;
  advertisementId: number;
  userId: number;
  userName: string;
  packageId: number;
  packageName: string;
  amount: number;
  durationDays: number;
  transactionReference: string;
  paymentScreenshot: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// ==========================================
// Pakistan-Wide Trucking, Transport & Freight System
// ==========================================
export type VehicleType =
  | 'Pickup'
  | 'Shehzore'
  | 'Mazda'
  | 'Light commercial truck'
  | '6-wheeler'
  | '10-wheeler'
  | '12-wheeler'
  | '14-wheeler'
  | '18-wheeler'
  | '22-wheeler'
  | 'Container truck'
  | 'Flatbed truck'
  | 'Trailer'
  | 'Dumper'
  | 'Refrigerated truck'
  | 'Tanker'
  | string;

export type LoadType = 'FTL' | 'PTL'; // Full Truckload or Partial Truckload

export type BookingStatus =
  | 'REQUEST_PUBLISHED'
  | 'QUOTATIONS_RECEIVED'
  | 'QUOTATION_ACCEPTED'
  | 'BOOKING_CONFIRMED'
  | 'TRUCK_ASSIGNED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'DISPUTED';

export interface TransporterProfile {
  id: number;
  userId: number;
  name: string;
  companyName?: string;
  phone: string;
  whatsapp: string;
  address?: string;
  operatingCities: string[];
  description: string;
  vehicleCount: number;
  vehicleCategories: string[];
  preferredRoutes: string[];
  operatingSchedule?: string;
  registrationNumber?: string;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  reviewsCount: number;
  completedTrips: number;
  logoUrl?: string;
  createdAt: string;
}

export interface TruckListing {
  id: number;
  transporterId: number;
  userId: number;
  transporterName: string;
  transporterPhone: string;
  transporterWhatsapp: string;
  title: string;
  vehicleType: VehicleType;
  wheelCount: number;
  bodyType: string;
  bodyLengthFeet: number;
  bodyWidthFeet?: number;
  bodyHeightFeet?: number;
  payloadCapacityTons: number; // Legal payload capacity in tons
  currentCity: string;
  currentArea?: string;
  pickupAreasServed: string[];
  destinationsServed: string[];
  preferredRoutes: string[];
  returnRoutes?: string[];
  loadTypeAvailability: 'BOTH' | 'FTL_ONLY' | 'PTL_ONLY';
  cargoAccepted: string[];
  cargoRestrictions?: string;
  availableDate: string;
  freightRateDescription?: string;
  isVerified: boolean;
  status: 'available' | 'busy' | 'maintenance' | 'disabled';
  images: string[];
  createdAt: string;
}

export interface LoadRequest {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  
  // Route
  pickupProvince: string;
  pickupCity: string;
  pickupArea?: string;
  destinationProvince: string;
  destinationCity: string;
  destinationArea?: string;
  intermediateStops?: string[];

  // Cargo
  cargoName: string;
  cargoDescription: string;
  totalWeightKg: number;
  packageCount?: number;
  cargoCategory: string;
  isFragile?: boolean;
  isTemperatureControlled?: boolean;
  specialHandlingNotes?: string;

  // Truck Requirements
  requiredVehicleType: VehicleType;
  requiredWheels?: number;
  requiredBodyLengthFeet?: number;
  requiredMinCapacityTons: number;
  loadType: LoadType;
  truckCountRequired: number;

  // Schedule & Budget
  loadingDate: string;
  deliveryDeadline?: string;
  budgetPKR?: number;
  isBudgetNegotiable: boolean;
  loadingUnloadingCostBy: 'CUSTOMER' | 'TRANSPORTER' | 'SHARED';
  
  status: 'open' | 'quoted' | 'booked' | 'in_transit' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FreightQuotation {
  id: number;
  loadRequestId: number;
  transporterId: number;
  transporterUserId: number;
  transporterName: string;
  transporterPhone: string;
  truckListingId?: number;
  truckTitle?: string;
  freightPrice: number;
  currency: string; // 'PKR'
  estimatedPickupDate: string;
  estimatedDeliveryDate: string;
  includedServices: string;
  loadingUnloadingIncluded: boolean;
  paymentTerms: string;
  validUntil: string;
  notes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  createdAt: string;
}

export interface TransportBooking {
  id: number;
  loadRequestId: number;
  quotationId: number;
  customerId: number;
  transporterId: number;
  truckListingId?: number;
  cargoName: string;
  pickupCity: string;
  destinationCity: string;
  agreedPrice: number;
  loadingDate: string;
  biltyNumber?: string;
  status: BookingStatus;
  statusNotes?: string;
  loadingReceiptUrl?: string;
  deliveryReceiptUrl?: string;
  customerRating?: number;
  customerReview?: string;
  transporterRating?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Transporter Monthly Subscription Plans & Purchases
// ==========================================
export type TransporterSubscriptionPlanId = 'basic' | 'business' | 'fleet' | string;

export type TransporterSubscriptionStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_UNDER_REVIEW'
  | 'ACTIVE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface TransporterSubscriptionPlan {
  id: string;
  name: string;
  price: number; // PKR 999, 1999, 3999
  durationDays: number; // 30
  maxTruckListings: number; // 1, 5, 15
  features: string[];
  badge?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface TransporterSubscriptionPurchase {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  transporterName: string;
  planId: string;
  planName: string;
  planSnapshot: TransporterSubscriptionPlan;
  amount: number;
  paymentMethod: string;
  trxId: string;
  paymentProofUrl?: string;
  status: TransporterSubscriptionStatus;
  startDate?: string;
  expiryDate?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// ==========================================
// Verified Seller / Business Application
// ==========================================
export type VerifiedBadgeDurationMode = 'lifetime' | 'monthly';

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'REVOKED';

export interface SellerVerificationRecord {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  userCity: string;
  shopName?: string;
  businessType: 'seller' | 'shop' | 'transporter';
  fee: number; // PKR 6,999
  durationMode: VerifiedBadgeDurationMode;
  trxId: string;
  paymentProofUrl: string;
  cnicNumber?: string;
  documentUrl?: string;
  status: VerificationStatus;
  appliedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  revocationReason?: string;
}

// ==========================================
// Food Deals & Restaurant Marketplace Types
// ==========================================
export interface FoodDealCategory {
  id: number;
  name: string;
  nameUrdu: string;
  slug: string;
  icon: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export type FoodDealStatus = 'approved' | 'pending' | 'rejected' | 'expired' | 'disabled';

export interface FoodMenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isSpecial?: boolean;
}

export interface FoodDeal {
  id: number;
  restaurantId: number;
  restaurantName: string;
  restaurantPhone: string;
  restaurantAddress: string;
  city: City;
  area: string;
  title: string;
  description: string;
  images: string[];
  originalPrice?: number;
  offerPrice: number;
  discountPercentage: number;
  categoryId: number;
  categoryName: string;
  startDate: string;
  expiryDate: string;
  availableDays?: string;
  availableHours?: string;
  terms?: string;
  isPickupAvailable: boolean;
  isDeliveryAvailable: boolean;
  deliveryFee?: number;
  status: FoodDealStatus;
  isDealOfTheDay?: boolean;
  isSpotlight?: boolean;
  views: number;
  whatsappClicks: number;
  callClicks: number;
  createdAt: string;
}

export interface RestaurantProfile {
  id: number;
  userId: number;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  address: string;
  city: City;
  area: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  foodCategories: string[];
  isVerified: boolean;
  verificationStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  verifiedAt?: string;
  isSpotlight: boolean;
  spotlightExpiry?: string;
  membershipStatus: 'NONE' | 'ACTIVE' | 'EXPIRED' | 'PENDING';
  membershipPrice?: number;
  membershipExpiry?: string;
  rating: number;
  reviewCount: number;
  isActivated: boolean;
  activationPaid: boolean;
  qrCodeUrl?: string;
  shareUrl?: string;
  views: number;
  contactClicks: number;
  menuItems: FoodMenuItem[];
}

export interface DigitalCoupon {
  id: number;
  restaurantId: number;
  restaurantName: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  timesUsed: number;
  terms: string;
  qrCode?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED' | 'DISABLED';
}

export interface DealReport {
  id: number;
  dealId: number;
  dealTitle: string;
  restaurantName: string;
  reporterName: string;
  reporterPhone: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface RestaurantReview {
  id: number;
  restaurantId: number;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  isVerifiedCustomer: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface FoodMembershipSettings {
  activationFee: number; // default PKR 1,000 one-time
  verifiedBadgeFee: number; // default PKR 6,999 one-time lifetime
  spotlightMonthlyFee: number; // default PKR 2,500/month
  membershipPrice: number; // default PKR 2,500
  membershipDuration: number;
  membershipDurationUnit: 'days' | 'weeks' | 'months' | 'years';
  isSpotlightHomepageEnabled: boolean;
  isSpotlightFoodDealsEnabled: boolean;
  isSpotlightRestaurantPageEnabled: boolean;
  isFoodDealsEnabled: boolean;
  dealOfTheDayEnabled: boolean;
  isFirst20FreePromoEnabled: boolean;
}

export interface FoodPaymentRecord {
  id: number;
  restaurantId: number;
  restaurantName: string;
  userId: number;
  paymentType: 'ACTIVATION' | 'MEMBERSHIP' | 'SPOTLIGHT' | 'VERIFICATION' | 'COUPON_PROMO';
  amount: number;
  trxId: string;
  paymentMethod: string;
  paymentProofUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approvedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}


