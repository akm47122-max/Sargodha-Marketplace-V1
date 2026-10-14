import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Briefcase,
  Zap,
  MapPin,
  Compass,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Truck,
  Package,
  Phone,
  CheckCircle2,
  ChevronRight,
  User,
  ExternalLink,
  Calendar,
  Eye,
  AlertCircle,
  Clock,
  Tag,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  UserProfile,
  SiteSettings,
  AdvertisingPackage,
  Advertisement,
  Listing,
  JobPost,
  DigitalSkillProfile,
  TruckListing,
  LoadRequest,
  PromotionPayment,
} from '../types';

export interface AIAssistantWidgetProps {
  currentUser: UserProfile | null;
  settings?: SiteSettings;
  listings?: Listing[];
  jobs?: JobPost[];
  skills?: DigitalSkillProfile[];
  trucks?: TruckListing[];
  loads?: LoadRequest[];
  advertisingPackages?: AdvertisingPackage[];
  advertisements?: Advertisement[];
  promotionPayments?: PromotionPayment[];
  onNavigate: (view: 'home' | 'jobs' | 'skills' | 'transport' | 'dashboard' | 'admin', subTab?: string) => void;
  onSelectListing?: (listing: Listing) => void;
  onSelectJob?: (job: JobPost) => void;
  onSelectSkill?: (skill: DigitalSkillProfile) => void;
  onSelectTruck?: (truck: TruckListing) => void;
  onSelectLoad?: (load: LoadRequest) => void;
  onOpenPostAd?: () => void;
  onOpenPostJob?: () => void;
  onOpenPostTruck?: () => void;
  onOpenPostLoad?: () => void;
  onOpenActivation?: () => void;
  onOpenPromoteModal?: () => void;
  onOpenCreateAd?: () => void;
  onOpenAuth?: () => void;
}

export type ResultType = 'product' | 'job' | 'skill' | 'truck' | 'load' | 'ad';

export interface AssistantCardItem {
  type: ResultType;
  id: number | string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  priceOrSalary?: string;
  location?: string;
  imageUrl?: string;
  phone?: string;
  whatsapp?: string;
  data: any;
}

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  cards?: AssistantCardItem[];
  action?: {
    label: string;
    onClick: () => void;
  };
  followUps?: string[];
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  currentUser,
  settings,
  listings = [],
  jobs = [],
  skills = [],
  trucks = [],
  loads = [],
  advertisingPackages = [],
  advertisements = [],
  promotionPayments = [],
  onNavigate,
  onSelectListing,
  onSelectJob,
  onSelectSkill,
  onSelectTruck,
  onSelectLoad,
  onOpenPostAd,
  onOpenPostJob,
  onOpenPostTruck,
  onOpenPostLoad,
  onOpenActivation,
  onOpenPromoteModal,
  onOpenCreateAd,
  onOpenAuth,
}) => {
  const isEnabled = settings?.isAIAssistantEnabled ?? true;
  const isVoiceEnabled = settings?.isAIAssistantVoiceEnabled ?? true;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const promoPrice = settings?.promoProductPrice || 1000;
  const activationFee = settings?.activationFee || 1000;

  // Initial welcome message tailored to user
  const initialBotMessage: AssistantMessage = useMemo(() => {
    const greeting = currentUser ? `Assalam-o-Alaikum ${currentUser.name}! 👋` : `Assalam-o-Alaikum! 👋 Khush Amdeed.`;
    return {
      id: 'welcome',
      sender: 'bot',
      text: `${greeting}\n\nMain **SargodhaMart AI Assistant** hoon. Main aapko poore platform par:\n• **Products & Classifieds** (Laptops, Mobiles, Bikes, Wanda)\n• **Jobs & Workers** (Mujhe Job Chahiye / Banda Chahiye)\n• **Digital Skills** (Freelancers, Developers, Designers)\n• **Truck & Freight** (All-Pakistan transport & cargo)\n• **🌟 Homepage Spotlight** (Sponsored showcase & promotion)\n• **Seller Views & Expiry** status\n\nUrdu, Roman Urdu, ya English mein live guide kar sakta hoon!`,
      timestamp: 'Just now',
      followUps: [
        'Homepage spotlight kya hai?',
        'Sargodha mein used laptop dhoondo',
        'Truck Sargodha se Lahore ke liye available hai?',
        'Animal feed aur wanda ki listings dikhao',
      ],
    };
  }, [currentUser]);

  const [messages, setMessages] = useState<AssistantMessage[]>([initialBotMessage]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'ur-PK';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
            handleSend(transcript);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch (e) {
          setSpeechSupported(false);
        }
      }
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '').slice(0, 200);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Main Intent Resolution & Natural Language Marketplace Matching
  const processQuery = (rawQuery: string): { replyText: string; cards?: AssistantCardItem[]; actionObj?: any; followUps?: string[] } => {
    const q = rawQuery.trim();
    const qLower = q.toLowerCase();

    // =========================================================================
    // 1. Logged-in Seller Metrics: "Mere products kitne logon ne dekhe?"
    // =========================================================================
    if (
      qLower.includes('dekhe') ||
      qLower.includes('view') ||
      qLower.includes('kitne logon') ||
      qLower.includes('views') ||
      qLower.includes('impressions') ||
      qLower.includes('stats')
    ) {
      if (!currentUser) {
        return {
          replyText: `Aapke products ke live view counts dekhne ke liye baraye meharbani pehle login karein. Login ke baad aap apne dashboard aur listings ke stats check kar sakte hain.`,
          actionObj: {
            label: '🔑 Login to View Metrics',
            onClick: () => {
              if (onOpenAuth) onOpenAuth();
              setIsOpen(false);
            },
          },
          followUps: ['Sargodha mein used laptop dhoondo', 'Truck Sargodha se Lahore'],
        };
      }

      const myProducts = listings.filter((l) => l.userId === currentUser.id);
      if (myProducts.length === 0) {
        return {
          replyText: `Assalam-o-Alaikum ${currentUser.name}! Aap ne abhi tak koi product listing publish nahi ki.\n\nAap "Post Ad" par click kar ke Sargodha, Shaheenabad ya Sillanwali mein apna pehla ad post kar saktay hain!`,
          actionObj: {
            label: '➕ Post Your First Ad',
            onClick: () => {
              if (onOpenPostAd) onOpenPostAd();
              setIsOpen(false);
            },
          },
          followUps: ['Seller activation fee kitni hai?', 'Jobs portal dikhao'],
        };
      }

      const totalViews = myProducts.reduce((acc, p) => acc + (p.views || 0), 0);
      const breakdown = myProducts
        .slice(0, 5)
        .map((p) => `• **${p.title}**: 👁️ ${p.views || 0} views (${p.city || 'Sargodha'})`)
        .join('\n');

      return {
        replyText: `📊 **Aapke Products ke Live View Analytics:**\n\nAssalam-o-Alaikum ${currentUser.name}! Aapki **${myProducts.length}** published listings ko kul milakar **${totalViews.toLocaleString()} logon** ne dekha hai.\n\n${breakdown}\n\n*Tip: Product ko zyada views dilane ke liye aap usay FEATURED promote kar saktay hain.*`,
        actionObj: {
          label: '⭐ Promote for More Views',
          onClick: () => {
            if (onOpenPromoteModal) onOpenPromoteModal();
            setIsOpen(false);
          },
        },
        followUps: ['Meri featured listing kab expire hogi?', 'Mere ads ka status kya hai?'],
      };
    }

    // =========================================================================
    // 2. Logged-in Seller Expiry: "Meri featured listing kab expire hogi?"
    // =========================================================================
    if (
      qLower.includes('expire') ||
      qLower.includes('expiry') ||
      qLower.includes('kab khatam') ||
      qLower.includes('validity') ||
      qLower.includes('featured listing kab')
    ) {
      if (!currentUser) {
        return {
          replyText: `Apni featured listing aur ad validity check karne ke liye baraye meharbani login karein.`,
          actionObj: {
            label: '🔑 Login',
            onClick: () => {
              if (onOpenAuth) onOpenAuth();
              setIsOpen(false);
            },
          },
          followUps: ['Promote system rules kya hain?', 'Used laptop dhoondo'],
        };
      }

      const myFeatured = listings.filter((l) => l.userId === currentUser.id && l.isFeatured);
      const myPromos = promotionPayments.filter((p) => p.userId === currentUser.id && p.status === 'APPROVED');

      if (myFeatured.length === 0 && myPromos.length === 0) {
        return {
          replyText: `Aap ki is waqt koi active ⭐ FEATURED listing nahi hai.\n\nAap kisi bhi product ko **Rs. ${promoPrice.toLocaleString()}** mein 15 din ke liye feature karwa saktay hain jis se woh homepage ke top par aur Telegram channel par broadcast hota hai!`,
          actionObj: {
            label: '⭐ Feature a Listing Now',
            onClick: () => {
              if (onOpenPromoteModal) onOpenPromoteModal();
              setIsOpen(false);
            },
          },
          followUps: ['Promote fee kitni hai?', 'Mere products kitne logon ne dekhe?'],
        };
      }

      let promoDetails = '';
      if (myFeatured.length > 0) {
        promoDetails = myFeatured
          .map(
            (item) =>
              `• ⭐ **${item.title}**: Status **ACTIVE FEATURED**\n  Duration: Standard 15 Days window.`
          )
          .join('\n\n');
      }

      return {
        replyText: `⏳ **Aap ki Featured Listings ki Tafseelat:**\n\n${promoDetails}\n\n*Notice: Feature duration mukammal hone ke baad ad aam regular listing ke taur par active rehta hai jab tak aap usay dobara promote na karein.*`,
        actionObj: {
          label: '📂 Open User Dashboard',
          onClick: () => {
            onNavigate('dashboard');
            setIsOpen(false);
          },
        },
        followUps: ['Mere products kitne logon ne dekhe?', 'Advertising packages kya hain?'],
      };
    }

    // =========================================================================
    // 3. User Account / Activation Queries
    // =========================================================================
    if (
      qLower.includes('mera status') ||
      qLower.includes('meri activation') ||
      qLower.includes('mera account') ||
      qLower.includes('activation status')
    ) {
      if (!currentUser) {
        return {
          replyText: `Apna account aur seller activation status check karne ke liye please login karein.`,
          actionObj: {
            label: '🔑 Login to Account',
            onClick: () => {
              if (onOpenAuth) onOpenAuth();
              setIsOpen(false);
            },
          },
        };
      }

      const isAct = currentUser.activationStatus === 'active';
      const isPen = currentUser.activationStatus === 'pending';
      const statusDesc = isAct
        ? `✅ **ACTIVE (Verified Lifetime Seller)**\nAap SargodhaMart par unlimited products aur digital skills bina kisi rukawat post kar saktay hain!`
        : isPen
        ? `⏳ **PENDING ADMIN VERIFICATION**\nAap ki Rs. 1,000 activation request hamari admin team ke pas under-review hai. Payment tasdeeq ke baad furan active ho jayegi.`
        : `⚠️ **INACTIVE / STANDARD MEMBER**\nProducts ya Skills post karne ke liye Rs. ${activationFee.toLocaleString()} one-time lifetime seller activation lazmi hai.`;

      return {
        replyText: `👤 **Account Overview — ${currentUser.name}:**\n\n${statusDesc}\n\n• Mobile: ${currentUser.mobile || 'N/A'}\n• City: ${currentUser.city || 'Sargodha'}\n• Role: ${currentUser.role}`,
        actionObj:
          !isAct && onOpenActivation
            ? {
                label: '🛡️ Activate Lifetime Account',
                onClick: () => {
                  onOpenActivation();
                  setIsOpen(false);
                },
              }
            : undefined,
        followUps: ['Mere products kitne logon ne dekhe?', 'Meri featured listing kab expire hogi?'],
      };
    }

    // =========================================================================
    // 4. Truck & Freight / Transport Search
    // =========================================================================
    if (
      qLower.includes('truck') ||
      qLower.includes('freight') ||
      qLower.includes('load') ||
      qLower.includes('mal baradari') ||
      qLower.includes('mazda') ||
      qLower.includes('shahzore') ||
      qLower.includes('trailer') ||
      qLower.includes('bedford') ||
      qLower.includes('transport') ||
      qLower.includes('kiraya') ||
      qLower.includes('gari chahie') ||
      qLower.includes('mal bhejna') ||
      (qLower.includes('lahore') && (qLower.includes('se') || qLower.includes('ke liye') || qLower.includes('truck')))
    ) {
      const originMatch = qLower.includes('sargodha')
        ? 'Sargodha'
        : qLower.includes('lahore')
        ? 'Lahore'
        : qLower.includes('bhalwal')
        ? 'Bhalwal'
        : qLower.includes('karachi')
        ? 'Karachi'
        : '';
      const destMatch = qLower.includes('lahore')
        ? 'Lahore'
        : qLower.includes('karachi')
        ? 'Karachi'
        : qLower.includes('rawalpindi')
        ? 'Rawalpindi'
        : qLower.includes('faisalabad')
        ? 'Faisalabad'
        : '';

      const matchedTrucks = trucks.filter((t) => {
        if (t.status === 'disabled') return false;
        if (
          destMatch &&
          t.destinationsServed &&
          t.destinationsServed.some((r: string) => r.toLowerCase().includes(destMatch.toLowerCase()))
        ) {
          return true;
        }
        if (originMatch && t.currentCity.toLowerCase().includes(originMatch.toLowerCase())) {
          return true;
        }
        if (qLower.includes('shahzore') && t.vehicleType.toLowerCase().includes('shahzore')) return true;
        if (qLower.includes('mazda') && t.vehicleType.toLowerCase().includes('mazda')) return true;
        if (qLower.includes('trailer') && t.vehicleType.toLowerCase().includes('trailer')) return true;
        return true;
      });

      const matchedLoads = loads.filter((l) => {
        if (originMatch && l.pickupCity.toLowerCase().includes(originMatch.toLowerCase())) return true;
        if (destMatch && l.destinationCity.toLowerCase().includes(destMatch.toLowerCase())) return true;
        if (qLower.includes('kinnow') || qLower.includes('citrus') || qLower.includes('fruit')) {
          return l.cargoCategory.toLowerCase().includes('citrus') || l.cargoName.toLowerCase().includes('kinnow');
        }
        return true;
      });

      const cards: AssistantCardItem[] = [];

      // Add top matching trucks
      matchedTrucks.slice(0, 3).forEach((tr) => {
        cards.push({
          type: 'truck',
          id: tr.id,
          title: `${tr.title} • ${tr.payloadCapacityTons} Tons`,
          subtitle: `Routes: ${tr.destinationsServed?.slice(0, 3).join(', ') || 'Nationwide'} • ${tr.transporterName}`,
          badge: tr.status === 'available' ? '✅ Available' : 'On Trip',
          badgeColor: tr.status === 'available' ? 'emerald' : 'amber',
          priceOrSalary: tr.freightRateDescription || 'Rate Negotiable',
          location: `Current City: ${tr.currentCity}`,
          imageUrl: tr.images?.[0] || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
          phone: tr.transporterPhone,
          whatsapp: tr.transporterWhatsapp || tr.transporterPhone,
          data: tr,
        });
      });

      // Add top matching freight loads
      matchedLoads.slice(0, 2).forEach((ld) => {
        cards.push({
          type: 'load',
          id: ld.id,
          title: ld.cargoName,
          subtitle: `${ld.pickupCity} ➔ ${ld.destinationCity} • ${ld.cargoCategory} (${(ld.totalWeightKg / 1000).toFixed(1)} Tons)`,
          badge: '📦 Freight Cargo',
          badgeColor: 'blue',
          priceOrSalary: ld.budgetPKR ? `Budget: Rs. ${ld.budgetPKR.toLocaleString()}` : 'Budget Negotiable',
          location: `${ld.pickupCity} to ${ld.destinationCity}`,
          phone: ld.customerPhone,
          whatsapp: ld.customerWhatsapp || ld.customerPhone,
          data: ld,
        });
      });

      const count = cards.length;
      const reply =
        count > 0
          ? `🚛 **Truck & Freight Services (Nationwide Pakistan):**\n\nAap ke matlooba transport search ke mutabiq **${matchedTrucks.length} trucks** aur **${matchedLoads.length} freight loads** dastiab hain.\n\n*Aap bina kisi login ke in listings ki tafseelat dekh saktay hain aur driver / transporter se direct Call ya WhatsApp par rabta kar saktay hain!*`
          : `🚛 **Truck & Freight Hub:**\n\nIs waqt SargodhaMart par All-Pakistan commercial trucks (Mazda, Shahzore, 10 Wheeler, Flatbed Trailers) aur seasonal cargo loads (Kinnow, fertilizer, cement) listed hain.\n\nAap transport section mein visit karke nationwide listings browse kar saktay hain.`;

      return {
        replyText: reply,
        cards: cards,
        actionObj: {
          label: '🚚 Open Nationwide Transport Portal',
          onClick: () => {
            onNavigate('transport');
            setIsOpen(false);
          },
        },
        followUps: [
          'Post cargo load',
          'Sargodha to Lahore Mazada truck rate',
          'Shahzore truck available in Sargodha',
        ],
      };
    }

    // =========================================================================
    // 5. Jobs & Rozgar Search: "Mujhe graphic designer ki job chahiye"
    // =========================================================================
    if (
      qLower.includes('job') ||
      qLower.includes('naukri') ||
      qLower.includes('kaam') ||
      qLower.includes('banda') ||
      qLower.includes('rozgar') ||
      qLower.includes('worker') ||
      qLower.includes('mulazmat') ||
      qLower.includes('hiring') ||
      qLower.includes('electrician') ||
      qLower.includes('driver') ||
      qLower.includes('labor') ||
      qLower.includes('accountant') ||
      qLower.includes('salesman')
    ) {
      const isSeekingJob =
        qLower.includes('mujhe job') ||
        qLower.includes('job chahiye') ||
        qLower.includes('naukri chahiye') ||
        qLower.includes('kaam chahiye');
      const isHiring =
        qLower.includes('banda chahiye') ||
        qLower.includes('worker chahiye') ||
        qLower.includes('hiring') ||
        qLower.includes('labor chahiye');

      const targetType = isSeekingJob ? 'need_job' : isHiring ? 'need_worker' : null;

      // Filter real jobs
      const matchedJobs = jobs.filter((j) => {
        if (j.status !== 'published') return false;
        if (targetType && j.postType !== targetType) return false;

        const skillsStr = (j.skills || '').toLowerCase();
        if (qLower.includes('graphic designer') || qLower.includes('designer')) {
          return (
            j.title.toLowerCase().includes('design') ||
            skillsStr.includes('design') ||
            skillsStr.includes('graphic') ||
            j.category.toLowerCase().includes('design')
          );
        }
        if (qLower.includes('driver')) {
          return j.title.toLowerCase().includes('driver') || skillsStr.includes('driver');
        }
        if (qLower.includes('electrician')) {
          return j.title.toLowerCase().includes('electrician') || skillsStr.includes('electric');
        }
        if (qLower.includes('sargodha') && j.city !== 'Sargodha') return false;
        if (qLower.includes('shaheenabad') && j.city !== 'Shaheenabad') return false;
        if (qLower.includes('sillanwali') && j.city !== 'Sillanwali') return false;
        return true;
      });

      const cards: AssistantCardItem[] = matchedJobs.slice(0, 4).map((j) => ({
        type: 'job',
        id: j.id,
        title: j.title,
        subtitle: `${j.posterName || 'Direct Employer'} • ${j.category}`,
        badge: j.postType === 'need_worker' ? 'Hiring (Banda Chahiye)' : 'Worker Seeking Job',
        badgeColor: j.postType === 'need_worker' ? 'rose' : 'cyan',
        priceOrSalary: j.salaryOrPayment || 'Negotiable Salary',
        location: `${j.city} (${j.area || 'Main City'})`,
        phone: j.phone,
        whatsapp: j.whatsapp,
        data: j,
      }));

      const reply =
        cards.length > 0
          ? `💼 **Jobs Hub — Live Approved Opportunities:**\n\nAap ki talash ke mutabiq yeh live jobs dastiab hain:\n\n*Kisi bhi job par click kar ke pori tafseelat dekh saktay hain aur employer ya candidate se direct rabta kar saktay hain:*`
          : `💼 **Jobs & Rozgar Hub:**\n\nIs waqt aap ke exact keyword par direct matching nahi mili, lekin Jobs portal par dono categories (I Need a Job & I Need a Worker) mein mutaddid ads rozana aatay hain!\n\nAap apna job ad bhi bilkul muft post kar saktay hain.`;

      return {
        replyText: reply,
        cards: cards,
        actionObj: {
          label: '💼 Open Jobs & Rozgar Hub',
          onClick: () => {
            onNavigate('jobs');
            setIsOpen(false);
          },
        },
        followUps: [
          'Mujhe Graphic Designer chahiye',
          'I Need a Worker in Sargodha',
          'Post a Job Advertisement',
        ],
      };
    }

    // =========================================================================
    // 6. Digital Skills & Portfolios: Developers, Graphic Designers, Video Editors
    // =========================================================================
    if (
      qLower.includes('developer') ||
      qLower.includes('designer') ||
      qLower.includes('graphic') ||
      qLower.includes('video editor') ||
      qLower.includes('seo') ||
      qLower.includes('freelance') ||
      qLower.includes('digital skill') ||
      qLower.includes('digital cv') ||
      qLower.includes('programmer') ||
      qLower.includes('website')
    ) {
      const matchedSkills = skills.filter((s) => {
        if (s.status !== 'approved') return false;
        if (qLower.includes('graphic') || qLower.includes('designer')) {
          return (
            s.mainSkill.toLowerCase().includes('design') ||
            s.professionalTitle.toLowerCase().includes('design') ||
            s.skills.some((sk: string) => sk.toLowerCase().includes('design') || sk.toLowerCase().includes('photoshop'))
          );
        }
        if (qLower.includes('developer') || qLower.includes('website') || qLower.includes('programmer')) {
          return (
            s.mainSkill.toLowerCase().includes('develop') ||
            s.professionalTitle.toLowerCase().includes('develop') ||
            s.skills.some((sk: string) => sk.toLowerCase().includes('react') || sk.toLowerCase().includes('web') || sk.toLowerCase().includes('php'))
          );
        }
        if (qLower.includes('video')) {
          return s.mainSkill.toLowerCase().includes('video') || s.skills.some((sk: string) => sk.toLowerCase().includes('video'));
        }
        if (qLower.includes('seo')) {
          return s.mainSkill.toLowerCase().includes('seo') || s.skills.some((sk: string) => sk.toLowerCase().includes('seo'));
        }
        return true;
      });

      const cards: AssistantCardItem[] = matchedSkills.slice(0, 3).map((sk) => ({
        type: 'skill',
        id: sk.id,
        title: sk.fullName,
        subtitle: `${sk.professionalTitle} • ${sk.experience} Experience`,
        badge: sk.isFeatured ? '⭐ FEATURED PRO' : 'Verified Talent',
        badgeColor: sk.isFeatured ? 'amber' : 'emerald',
        priceOrSalary: sk.startingRate ? `Starting: Rs. ${sk.startingRate.toLocaleString()}` : 'Affordable Rates',
        location: `${sk.tehsilName || 'Sargodha'} Division`,
        imageUrl: sk.profilePhoto,
        phone: sk.phone,
        whatsapp: sk.whatsapp,
        data: sk,
      }));

      return {
        replyText: `💻 **Digital Skills & Freelancer Profiles:**\n\nSargodha Division ke verified local digital creators aur developers dastiab hain:\n\n• Verified portfolios & completed projects\n• Direct WhatsApp & Call contact\n• Online Digital CV inspection`,
        cards: cards,
        actionObj: {
          label: '💼 Browse All Digital Talents',
          onClick: () => {
            onNavigate('skills');
            setIsOpen(false);
          },
        },
        followUps: [
          'Digital skill promote karne ka tareeqa',
          'Sargodha mein used laptop dhoondo',
          'Graphic designer job chahiye',
        ],
      };
    }

    // =========================================================================
    // 7. Agriculture & Livestock (Wanda, Citrus, Feed, Animals, Mandi Rates)
    // =========================================================================
    if (
      qLower.includes('wanda') ||
      qLower.includes('feed') ||
      qLower.includes('animal feed') ||
      qLower.includes('khal') ||
      qLower.includes('chara') ||
      qLower.includes('citrus') ||
      qLower.includes('kinnow') ||
      qLower.includes('kinu') ||
      qLower.includes('wheat') ||
      qLower.includes('gandum') ||
      qLower.includes('mandi') ||
      qLower.includes('gai') ||
      qLower.includes('bhains') ||
      qLower.includes('bakra') ||
      qLower.includes('cow') ||
      qLower.includes('buffalo') ||
      qLower.includes('goat') ||
      qLower.includes('cattle') ||
      qLower.includes('livestock')
    ) {
      const matchedAgri = listings.filter((l) => {
        if (l.status !== 'published') return false;
        const text = `${l.title} ${l.description} ${l.categoryName} ${l.subcategory || ''}`.toLowerCase();
        if (qLower.includes('wanda') && text.includes('wanda')) return true;
        if (qLower.includes('feed') && (text.includes('feed') || text.includes('khal') || text.includes('wanda'))) return true;
        if ((qLower.includes('citrus') || qLower.includes('kinnow') || qLower.includes('kinu')) && (text.includes('citrus') || text.includes('kinnow') || text.includes('kinu') || text.includes('fruit'))) return true;
        if (qLower.includes('gai') || qLower.includes('cow') || qLower.includes('bhains') || qLower.includes('buffalo') || qLower.includes('bakra')) {
          return text.includes('gai') || text.includes('cow') || text.includes('bhains') || text.includes('buffalo') || text.includes('bakra') || text.includes('livestock') || text.includes('janwar');
        }
        return l.categoryId === 7 || l.categoryId === 8 || text.includes('agri') || text.includes('livestock');
      });

      const cards: AssistantCardItem[] = matchedAgri.slice(0, 4).map((p) => ({
        type: 'product',
        id: p.id,
        title: p.title,
        subtitle: `${p.categoryName} • ${p.condition || 'Fresh'}`,
        badge: p.isFeatured ? '⭐ FEATURED' : 'Verified Listing',
        badgeColor: p.isFeatured ? 'amber' : 'emerald',
        priceOrSalary: `Rs. ${p.price.toLocaleString()}`,
        location: `${p.city} (${p.area || 'Local Mandi'})`,
        imageUrl: p.images?.[0],
        phone: p.sellerPhone,
        whatsapp: p.sellerPhone,
        data: p,
      }));

      return {
        replyText: `🌾 **Agriculture & Livestock Listings (Sargodha Division):**\n\nSargodha, Shaheenabad aur Sillanwali ki mandis ke mutabiq livestock, animal feed (wanda), aur citrus ki live listings:\n\n*Aap seller se direct WhatsApp ya Call par rabta karke mandi rate aur delivery tay kar saktay hain:*`,
        cards: cards,
        actionObj: {
          label: '🌾 View Agricultural Products',
          onClick: () => {
            onNavigate('home');
            setIsOpen(false);
          },
        },
        followUps: [
          'Truck Sargodha se Lahore ke liye available hai?',
          'Animal feed aur wanda ki listings dikhao',
          'Sillanwali Citrus season deals',
        ],
      };
    }

    // =========================================================================
    // 8. General Products Search: Laptops, Mobiles, Bikes, Electronics, etc.
    // =========================================================================
    if (
      qLower.includes('laptop') ||
      qLower.includes('mobile') ||
      qLower.includes('phone') ||
      qLower.includes('bike') ||
      qLower.includes('motorcycle') ||
      qLower.includes('car') ||
      qLower.includes('gari') ||
      qLower.includes('used') ||
      qLower.includes('naya') ||
      qLower.includes('sasta') ||
      qLower.includes('dhoondo') ||
      qLower.includes('kharidna') ||
      qLower.includes('chahiye') ||
      qLower.includes('search') ||
      qLower.includes('product')
    ) {
      const searchTerms = qLower
        .replace(/(dhoondo|chahiye|mujhe|dikhao|sargodha|mein|ki|ke|ka|batao|rate|price|kharidna)/g, '')
        .trim();

      const matchedProducts = listings.filter((l) => {
        if (l.status !== 'published') return false;
        const fullText = `${l.title} ${l.description} ${l.categoryName} ${l.subcategory || ''}`.toLowerCase();

        // City filter
        if (qLower.includes('shaheenabad') && l.city !== 'Shaheenabad') return false;
        if (qLower.includes('sillanwali') && l.city !== 'Sillanwali') return false;
        if (qLower.includes('sargodha') && l.city !== 'Sargodha') return false;

        // Condition filter
        if (qLower.includes('used') && l.condition !== 'Used' && l.condition !== 'Like New') return false;
        if (qLower.includes('new') && l.condition !== 'New') return false;

        // Keywords
        if (qLower.includes('laptop') && !fullText.includes('laptop') && !fullText.includes('computer')) return false;
        if (qLower.includes('mobile') && !fullText.includes('mobile') && !fullText.includes('phone')) return false;
        if (qLower.includes('bike') && !fullText.includes('bike') && !fullText.includes('honda') && !fullText.includes('motorcycle')) return false;

        if (searchTerms.length > 2) {
          const terms = searchTerms.split(' ').filter((t) => t.length > 2);
          if (terms.length > 0 && !terms.some((t) => fullText.includes(t))) return false;
        }

        return true;
      });

      const cards: AssistantCardItem[] = matchedProducts.slice(0, 4).map((p) => ({
        type: 'product',
        id: p.id,
        title: p.title,
        subtitle: `${p.categoryName} • Condition: ${p.condition || 'Used'}`,
        badge: p.isFeatured ? '⭐ FEATURED' : 'Active Listing',
        badgeColor: p.isFeatured ? 'amber' : 'cyan',
        priceOrSalary: `Rs. ${p.price.toLocaleString()}`,
        location: `${p.city} (${p.area || 'Local Area'})`,
        imageUrl: p.images?.[0],
        phone: p.sellerPhone,
        whatsapp: p.sellerPhone,
        data: p,
      }));

      const reply =
        cards.length > 0
          ? `🔍 **SargodhaMart Live Listings:**\n\nAap ki talash ke mutabiq yeh live approved products dastiab hain:\n\n*Kisi bhi card par click karke mukammal photo aur seller ke verified number par direct Call / WhatsApp karein:*`
          : `🔍 **Marketplace Search:**\n\nAap ke matlooba item par is waqt koi exact active ad nahi mila. Aap filters tabdeel karke dobara talash kar saktay hain ya All Products browse kar saktay hain.`;

      return {
        replyText: reply,
        cards: cards,
        actionObj: {
          label: '🛒 Explore All Products',
          onClick: () => {
            onNavigate('home');
            setIsOpen(false);
          },
        },
        followUps: [
          'Sargodha mein used laptop dhoondo',
          'Animal feed aur wanda ki listings dikhao',
          'Truck Sargodha se Lahore ke liye available hai?',
        ],
      };
    }

    // =========================================================================
    // 8.5. Homepage Spotlight & Sponsored Placements ("Spotlight kya hai / rates")
    // =========================================================================
    if (
      qLower.includes('spotlight') ||
      qLower.includes('spot light') ||
      qLower.includes('top banner') ||
      qLower.includes('sponsored ad') ||
      (qLower.includes('front page') && (qLower.includes('ad') || qLower.includes('lagwana') || qLower.includes('showcase')))
    ) {
      // Find active homepage spotlight ads & featured listings
      const activeSpotlightAds = advertisements.filter(
        (a) =>
          a.status === 'ACTIVE' &&
          (a.placements.includes('Homepage') || a.placements.includes('Multiple Website Locations'))
      );
      const featuredItems = listings.filter((l) => l.status === 'published' && l.isFeatured);

      const spotlightCards: AssistantCardItem[] = [];

      // Add active spotlight ads first
      activeSpotlightAds.forEach((ad) => {
        spotlightCards.push({
          type: 'ad',
          id: ad.id,
          title: ad.title,
          subtitle: `${ad.packageName || 'Homepage Spotlight Sponsor'} • Verified Partner`,
          badge: '🌟 SPOTLIGHT SPONSOR',
          badgeColor: 'amber',
          priceOrSalary: `Rs. ${ad.amountPaid?.toLocaleString() || '1,500'} (${ad.durationDays}d)`,
          location: ad.location || 'Sargodha Division',
          imageUrl: ad.imageUrl,
          phone: ad.phone,
          whatsapp: ad.whatsapp,
          data: ad,
        });
      });

      // Add featured products
      featuredItems.slice(0, Math.max(1, 4 - spotlightCards.length)).forEach((p) => {
        spotlightCards.push({
          type: 'product',
          id: p.id,
          title: p.title,
          subtitle: `${p.categoryName} • Featured Showcase`,
          badge: '⭐ FEATURED SPOTLIGHT',
          badgeColor: 'amber',
          priceOrSalary: `Rs. ${p.price.toLocaleString()}`,
          location: `${p.city} (${p.area || 'Local Area'})`,
          imageUrl: p.images?.[0],
          phone: p.sellerPhone,
          whatsapp: p.sellerPhone,
          data: p,
        });
      });

      return {
        replyText: `🌟 **SargodhaMart Homepage Spotlight Tafseelat (English & Urdu):**\n\n**Homepage Spotlight** SargodhaMart ka premier top-of-page showcase hai jahan aapka ad ya business hazaron local sarfeen (Sargodha, Shaheenabad, Sillanwali) ke samne sab se numayan nazar aata hai!\n\n📋 **Spotlight ke 2 Barray Tareeqay:**\n\n1. **⭐ Product & Skill Featured Spotlight (Rs. ${promoPrice.toLocaleString()} / 15 Din):**\n   • Ad ko ⭐ FEATURED badge aur Homepage Spotlight showcase milta hai.\n   • Direct Call & WhatsApp buttons.\n   • Official Telegram Channel broadcast shamil hai.\n\n2. **🚀 Official Homepage Sponsored Spotlight (Ad Packages):**\n   • **Homepage Sponsored Product:** Rs. 1,500 / 15 Days\n   • **Homepage Full-Width Banner:** Rs. 2,000 / 15 Days\n   • **💎 Premium Homepage Domination:** Rs. 2,500 – 3,500 / 30 Days\n   • Custom graphics banner, VIP sponsor badge, official Telegram sponsored post, aur direct leads routing!\n\n*Neeche live approved spotlight showcase dekhein:*`,
        cards: spotlightCards,
        actionObj: {
          label: '📢 Book Homepage Spotlight Now',
          onClick: () => {
            if (currentUser) {
              if (onOpenCreateAd) onOpenCreateAd();
              else onNavigate('dashboard');
            } else {
              if (onOpenAuth) onOpenAuth();
            }
            setIsOpen(false);
          },
        },
        followUps: [
          'Promote fee kitni hai?',
          'Meri featured listing kab expire hogi?',
          'Mere products kitne logon ne dekhe?',
          'Sargodha mein used laptop dhoondo',
        ],
      };
    }

    // =========================================================================
    // 9. Advertising Packages & Official Sponsored Campaigns
    // =========================================================================
    if (
      qLower.includes('advertis') ||
      qLower.includes('ishtehar') ||
      qLower.includes('banner') ||
      qLower.includes('campaign') ||
      qLower.includes('package')
    ) {
      const activePkgs = advertisingPackages.filter((p) => p.isActive);
      const pkgLines = activePkgs
        .map(
          (p) =>
            `• **${p.name}**: Rs. ${p.price.toLocaleString()} / ${p.durationDays} Days ` +
            `(${p.placements.join(', ')})${p.telegramEnabled ? ' + 📲 Telegram Broadcast' : ''}`
        )
        .join('\n');

      return {
        replyText: `📢 **SargodhaMart Official Advertising Packages:**\n\n${pkgLines}\n\n⭐ **Top Recommended:**\n**SargodhaMart Business Promotion** (Rs. 2,000 / 15 Days) jis mein Homepage, Category Pages aur official Telegram Channel sponsored alert sab shamil hain!\n\n*Dashboard → Advertising mein ja kar apna banner aur EasyPaisa/JazzCash slip submit karein.*`,
        actionObj: {
          label: '📢 Book Advertisement Now',
          onClick: () => {
            onNavigate('dashboard');
            if (onOpenCreateAd) onOpenCreateAd();
            setIsOpen(false);
          },
        },
        followUps: ['Promote fee kitni hai?', 'Lifetime seller activation farq'],
      };
    }

    // =========================================================================
    // 10. Activation vs Promotion Rules & Fee Separation
    // =========================================================================
    if (
      qLower.includes('promote') ||
      qLower.includes('activation') ||
      qLower.includes('farq') ||
      qLower.includes('difference') ||
      qLower.includes('1000') ||
      qLower.includes('mashhoor')
    ) {
      return {
        replyText: `⚖️ **Seller Activation vs Product Promotion (Fee Separation):**\n\n1. **Lifetime Seller Activation (Rs. ${activationFee.toLocaleString()}):**\n   • Sirf ek dafa pay karni hoti hai.\n   • Marketplace par ads aur digital skills post karne ke liye lazmi hai.\n   • EasyPaisa / JazzCash payment slip + WhatsApp channel follow proof.\n\n2. **Product / Skill Promotion (Rs. ${promoPrice.toLocaleString()} / 15 Days):**\n   • Optional visibility booster.\n   • Aap ke ad ko ⭐ FEATURED badge, homepage spotlight aur Telegram broadcast milta hai.\n   • Activation aur Promotion kabhi ek sath jama nahi hotay.`,
        actionObj:
          currentUser?.activationStatus !== 'active' && onOpenActivation
            ? {
                label: '🛡️ Activate Seller Account',
                onClick: () => {
                  onOpenActivation();
                  setIsOpen(false);
                },
              }
            : {
                label: '⭐ Promote an Item',
                onClick: () => {
                  if (onOpenPromoteModal) onOpenPromoteModal();
                  setIsOpen(false);
                },
              },
        followUps: [
          'Mere products kitne logon ne dekhe?',
          'Meri featured listing kab expire hogi?',
          'Truck Sargodha se Lahore',
        ],
      };
    }

    // =========================================================================
    // 10.5. Official Verified Seller & Business Badge ("Verified badge / Blue tick")
    // =========================================================================
    if (
      qLower.includes('verified') ||
      qLower.includes('blue tick') ||
      qLower.includes('verification') ||
      qLower.includes('tasdeeq') ||
      qLower.includes('verify')
    ) {
      const verifFee = settings?.verifiedBadgeFee || 6999;
      const verifMode = settings?.verifiedBadgeDurationMode || 'lifetime';
      const isUserVerif = currentUser?.isVerified;

      return {
        replyText: `🛡️ **SargodhaMart Official Blue Verified Badge (✓) System:**\n\n${
          isUserVerif
            ? '✅ **Aap ka Account Pehle Se VERIFIED Hai!**\nAap ke tamaam ads, digital skills aur shop par official blue checkmark (✓) active hai.'
            : `Aap apne account, local shop ya freight fleet ke liye **Official Blue Verified Badge** hasil kar saktay hain!\n\n• **Application Fee:** Rs. ${verifFee.toLocaleString()} (${verifMode === 'lifetime' ? 'Lifetime Verification' : 'Monthly Subscription'})\n• **Trust Boost:** 3x ziyada kharidar rabta kartay hain aur search results mein top priority milti hai.\n• **Blue Checkmark (✓):** Tamaam product cards, seller profile aur shop par shandar blue badge lagta hai.\n• **Tariqa:** Dashboard mein ja kar "Get Verified Seller" tab open karein aur EasyPaisa/JazzCash slip submit karein.`
        }`,
        actionObj: {
          label: isUserVerif ? '📂 View My Verified Dashboard' : '🛡️ Apply for Verified Badge Now',
          onClick: () => {
            onNavigate('dashboard', 'verification');
            setIsOpen(false);
          },
        },
        followUps: [
          'Lifetime seller activation farq',
          'Promote fee kitni hai?',
          'Homepage spotlight kya hai?',
        ],
      };
    }

    // =========================================================================
    // 11. Locations & Hierarchy
    // =========================================================================
    if (qLower.includes('location') || qLower.includes('area') || qLower.includes('tehsil') || qLower.includes('shehr')) {
      return {
        replyText: `📍 **Sargodha Division 4-Level Location Hierarchy:**\n\n1. **Division:** Sargodha Division\n2. **Districts:** Sargodha, Khushab, Mianwali, Bhakkar\n3. **Primary Tehsils:** Sargodha Tehsil, Sillanwali, Shaheenabad, Bhalwal, Kot Momin, Sahiwal, Shahpur\n4. **Local Areas:** Satellite Town, University Road, Citrus Mandi, Canal Colony, Kutchery Bazaar, Fatima Jinnah Road.\n\nAap tamaam products aur jobs ko tehsil ya area ke lehaaz se filter kar saktay hain.`,
        followUps: ['Sargodha mein used laptop dhoondo', 'Truck Sargodha se Lahore'],
      };
    }

    // =========================================================================
    // Default Fallback
    // =========================================================================
    return {
      replyText: `Assalam-o-Alaikum! Main aapki in chezon mein madad kar sakta hoon:\n\n1. **Products:** "Sargodha mein used laptop dhoondo"\n2. **Jobs:** "Mujhe graphic designer ki job chahiye" ya "Worker chahiye"\n3. **Transport:** "Truck Sargodha se Lahore ke liye available hai?"\n4. **Agriculture:** "Animal feed aur wanda ki listings dikhao"\n5. **Seller Analytics:** "Mere products kitne logon ne dekhe?" aur "Meri featured listing kab expire hogi?"\n\nNiche diye gaye options mein se select karein ya apna sawal type karein!`,
      followUps: [
        'Sargodha mein used laptop dhoondo',
        'Mujhe graphic designer ki job chahiye',
        'Truck Sargodha se Lahore ke liye available hai?',
        'Animal feed aur wanda ki listings dikhao',
      ],
    };
  };

  const handleSend = (userQuery?: string) => {
    const q = (userQuery || input).trim();
    if (!q) return;

    const userMsg: AssistantMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userQuery) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { replyText, cards, actionObj, followUps } = processQuery(q);

      const botMsg: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cards: cards,
        action: actionObj,
        followUps: followUps,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (ttsEnabled) {
        speakText(replyText);
      }
    }, 400);
  };

  const handleCardClick = (card: AssistantCardItem) => {
    if (card.type === 'product' && onSelectListing) {
      onSelectListing(card.data);
      setIsOpen(false);
    } else if (card.type === 'job' && onSelectJob) {
      onSelectJob(card.data);
      setIsOpen(false);
    } else if (card.type === 'skill' && onSelectSkill) {
      onSelectSkill(card.data);
      setIsOpen(false);
    } else if (card.type === 'truck' && onSelectTruck) {
      onSelectTruck(card.data);
      setIsOpen(false);
    } else if (card.type === 'load' && onSelectLoad) {
      onSelectLoad(card.data);
      setIsOpen(false);
    } else if (card.type === 'ad') {
      const cleanWa = (card.whatsapp || card.phone || '').replace(/[^0-9]/g, '');
      if (cleanWa) {
        window.open(`https://wa.me/92${cleanWa.startsWith('0') ? cleanWa.slice(1) : cleanWa}`, '_blank');
      } else if (card.phone) {
        window.location.href = `tel:${card.phone}`;
      }
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Persistent Floating AI Launcher Button - Bottom Right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open SargodhaMart AI Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white border-2 border-cyan-400/80 shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:shadow-[0_15px_45px_rgba(6,182,212,0.65)] hover:scale-105 transition-all duration-300 active:scale-95"
          >
            {/* Glowing ring animation */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300 animate-pulse" />

            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-inner">
              <Bot className="w-5 h-5 animate-wiggle" />
            </div>

            <div className="relative text-left hidden sm:block">
              <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                AI Assistant
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </div>
              <div className="text-xs font-bold text-white leading-tight">Ask SargodhaMart</div>
            </div>

            <span className="relative sm:hidden text-xs font-bold text-cyan-300">AI Help</span>
          </button>
        )}

        {/* Floating Chat Modal Window */}
        {isOpen && (
          <div className="w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh] flex flex-col rounded-3xl bg-slate-950/95 backdrop-blur-2xl border-2 border-cyan-400/70 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(6,182,212,0.3)] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                  <Bot className="w-6 h-6" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    SargodhaMart AI Assistant
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/40">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-cyan-200/80 font-medium">
                    Urdu • Roman Urdu • English
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice audio narration toggle */}
                {isVoiceEnabled && (
                  <button
                    onClick={() => {
                      setTtsEnabled(!ttsEnabled);
                      if (ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    title={ttsEnabled ? 'Disable Voice Speech' : 'Enable Voice Speech Output'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                      ttsEnabled
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                    }`}
                  >
                    {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20'
                        : 'bg-slate-900 border border-cyan-500/20 text-slate-200 rounded-tl-none shadow-md shadow-black/40'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Interactive Result Cards */}
                    {m.cards && m.cards.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-cyan-500/20">
                        {m.cards.map((c, i) => (
                          <div
                            key={i}
                            className="bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-2.5 transition-all text-left shadow-xs flex flex-col gap-2"
                          >
                            <div className="flex items-start gap-2.5">
                              {c.imageUrl ? (
                                <img
                                  src={c.imageUrl}
                                  alt={c.title}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center shrink-0">
                                  {c.type === 'truck' ? (
                                    <Truck className="w-5 h-5 text-amber-400" />
                                  ) : c.type === 'load' ? (
                                    <Package className="w-5 h-5 text-blue-400" />
                                  ) : c.type === 'job' ? (
                                    <Briefcase className="w-5 h-5 text-rose-400" />
                                  ) : c.type === 'ad' ? (
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                  ) : (
                                    <ShoppingBag className="w-5 h-5 text-cyan-400" />
                                  )}
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-white text-xs truncate">{c.title}</h4>
                                  {c.badge && (
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                                        c.badgeColor === 'amber'
                                          ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30'
                                          : c.badgeColor === 'rose'
                                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      }`}
                                    >
                                      {c.badge}
                                    </span>
                                  )}
                                </div>

                                {c.subtitle && (
                                  <div className="text-[11px] text-slate-400 line-clamp-1">{c.subtitle}</div>
                                )}

                                <div className="flex items-center gap-2 mt-1 text-[11px]">
                                  {c.priceOrSalary && (
                                    <span className="font-bold text-cyan-300">{c.priceOrSalary}</span>
                                  )}
                                  {c.location && (
                                    <span className="text-slate-400 flex items-center gap-0.5 truncate">
                                      <MapPin className="w-3 h-3 text-slate-500" />
                                      {c.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Quick Actions */}
                            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-900">
                              <button
                                onClick={() => handleCardClick(c)}
                                className="flex-1 py-1 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Details</span>
                              </button>

                              {c.whatsapp && (
                                <a
                                  href={`https://wa.me/92${c.whatsapp.replace(/[^0-9]/g, '').slice(-10)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                                  title="WhatsApp"
                                >
                                  <span>WhatsApp</span>
                                </a>
                              )}

                              {c.phone && (
                                <a
                                  href={`tel:${c.phone}`}
                                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] flex items-center gap-1 transition-all"
                                  title="Call"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    {m.action && (
                      <div className="mt-3 pt-2.5 border-t border-cyan-500/30">
                        <button
                          onClick={m.action.onClick}
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-[11px] shadow-md shadow-cyan-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {m.action.label}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Follow-up suggestions */}
                    {m.followUps && m.followUps.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {m.followUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fu)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 hover:bg-cyan-950 text-cyan-200 border border-slate-700 hover:border-cyan-500 transition-all text-left cursor-pointer"
                          >
                            💬 {fu}
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 font-mono ${
                        m.sender === 'user' ? 'text-cyan-200 text-right' : 'text-slate-500'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl rounded-tl-none p-3 text-xs text-cyan-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-slate-400 ml-1">Searching live marketplace data...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Recording Active Banner */}
            {isListening && (
              <div className="px-4 py-2 bg-rose-950/80 border-t border-rose-500/50 flex items-center justify-between text-rose-200 text-xs animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold">Listening... بولیے (Urdu / English)</span>
                </div>
                <button
                  onClick={toggleListening}
                  className="text-[10px] font-bold underline hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              {/* Voice Mic Button */}
              {isVoiceEnabled && speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  aria-label="Voice input"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                  title="Speak your question in Urdu / English"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in Urdu / Roman Urdu / English..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-cyan-400 transition-colors"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
