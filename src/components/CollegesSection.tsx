import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  MapPin,
  Calendar,
  ExternalLink,
  Phone,
  MessageCircle,
  PlusCircle,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  School,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CollegeAd, UserProfile, SiteSettings } from '../types';
import { CollegeDetailModal } from './CollegeDetailModal';

interface CollegesSectionProps {
  collegeAds: CollegeAd[];
  currentUser: UserProfile | null;
  settings?: SiteSettings;
  onOpenPostAd: () => void;
  onOpenAuth: () => void;
  onTrackAction?: (type: 'apply' | 'call' | 'whatsapp', adId: number) => void;
}

export const CollegesSection: React.FC<CollegesSectionProps> = ({
  collegeAds,
  currentUser,
  settings,
  onOpenPostAd,
  onOpenAuth,
  onTrackAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'open'>('all');
  const [selectedAd, setSelectedAd] = useState<CollegeAd | null>(null);
  const [redirectAd, setRedirectAd] = useState<CollegeAd | null>(null);

  const packagePrice = settings?.collegeAdPackagePrice || 3500;
  const packageDuration = settings?.collegeAdDurationDays || 30;

  // Filter approved ads
  const filteredAds = useMemo(() => {
    return collegeAds.filter((ad) => {
      // Must be approved unless previewing own
      const isApproved = ad.status === 'APPROVED' || (currentUser && ad.userId === currentUser.id);
      if (!isApproved) return false;

      // Filter by type
      if (selectedType !== 'All' && ad.instituteType !== selectedType) {
        return false;
      }

      // Filter by open admissions status
      if (selectedStatusFilter === 'open' && ad.applicationDeadline) {
        const isExpired = new Date(ad.applicationDeadline) < new Date(new Date().setHours(0, 0, 0, 0));
        if (isExpired) return false;
      }

      // Search query in institute name, courses, or location
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ad.instituteName.toLowerCase().includes(q);
        const matchesLocation = ad.location.toLowerCase().includes(q);
        const matchesCourses = ad.coursesOffered.some((c) => c.toLowerCase().includes(q));
        const matchesDesc = ad.description.toLowerCase().includes(q);
        return matchesName || matchesLocation || matchesCourses || matchesDesc;
      }

      return true;
    });
  }, [collegeAds, selectedType, selectedStatusFilter, searchQuery, currentUser]);

  const handleApplyClick = (ad: CollegeAd) => {
    if (onTrackAction) onTrackAction('apply', ad.id);
    setRedirectAd(ad);
  };

  const proceedRedirect = () => {
    if (redirectAd) {
      const url = redirectAd.applicationFormUrl;
      setRedirectAd(null);
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleCall = (ad: CollegeAd) => {
    if (onTrackAction) onTrackAction('call', ad.id);
  };

  const handleWhatsApp = (ad: CollegeAd) => {
    if (onTrackAction) onTrackAction('whatsapp', ad.id);
  };

  const instituteTypes = ['All', 'University', 'College', 'Academy', 'Institute', 'Polytechnic'];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Admission Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-500/20">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide">
              <GraduationCap className="w-4 h-4 text-cyan-300" />
              <span>Sargodha Division Education &amp; Admissions Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Colleges, Admissions &amp; Campus Ads
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Explore undergraduate degrees, intermediate colleges, medical technologies, computer science programs, and skill bootcamps across Sargodha, Sillanwali &amp; Shaheenabad.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Google Forms &amp; Official Portals</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Direct WhatsApp Inquiries</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Educational Ads</span>
              </span>
            </div>
          </div>

          {/* Call-to-action for College Administrators */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 w-full md:w-auto text-center md:text-left space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-bold">
              Educational Institutes &amp; Academies
            </div>
            <div className="text-lg font-black text-white">
              Promote Admissions for <span className="text-emerald-300">Rs. {packagePrice.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              30 Days Guaranteed Visibility • 50,000+ Local Reach
            </div>
            <button
              onClick={onOpenPostAd}
              className="w-full mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post College Admission Ad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by degree (e.g. BSCS, FSc, DPT, IELTS) or college name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Ads ({collegeAds.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('open')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'open'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Admissions Open Only
            </button>
          </div>
        </div>

        {/* Institute Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Type:</span>
          </span>
          {instituteTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* College Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
          <School className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Admission Advertisements Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or institute type filter, or submit your college's admission announcement now.
          </p>
          <button
            onClick={onOpenPostAd}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First College Ad</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAds.map((ad) => {
            const isExpired = ad.applicationDeadline
              ? new Date(ad.applicationDeadline) < new Date(new Date().setHours(0, 0, 0, 0))
              : false;

            const daysLeft = ad.applicationDeadline
              ? Math.ceil((new Date(ad.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
              : null;

            // WhatsApp link
            const cleanPhoneDigits = ad.whatsapp.replace(/\D/g, '');
            const internationalWhatsApp = cleanPhoneDigits.startsWith('92')
              ? cleanPhoneDigits
              : cleanPhoneDigits.startsWith('0')
              ? `92${cleanPhoneDigits.slice(1)}`
              : `92${cleanPhoneDigits}`;
            const whatsAppUrl = `https://wa.me/${internationalWhatsApp}?text=${encodeURIComponent(
              `Assalam-o-Alaikum! I saw your ${ad.instituteName} admission ad on Sargodha Marketplace. I want to inquire about admissions & courses.`
            )}`;
            const callUrl = `tel:${ad.phone.replace(/\s+/g, '')}`;

            return (
              <div
                key={ad.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Poster Top Image */}
                <div
                  onClick={() => setSelectedAd(ad)}
                  className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={ad.posterImage}
                    alt={ad.instituteName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-white/20">
                      {ad.instituteType}
                    </span>

                    {isExpired ? (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black">
                        Admissions Closed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{daysLeft !== null && daysLeft > 0 ? `${daysLeft}d Left` : 'Closing Today'}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom overlay with Institute Logo & Name */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md overflow-hidden shrink-0">
                      <img
                        src={ad.logoImage || ad.posterImage}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black text-white truncate drop-shadow">
                        {ad.instituteName}
                      </div>
                      <div className="text-[10px] text-cyan-200 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{ad.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {ad.tagline && (
                      <p className="text-[11px] text-slate-600 font-medium italic line-clamp-1 mb-2">
                        "{ad.tagline}"
                      </p>
                    )}

                    {/* Courses preview pills */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Courses &amp; Degrees:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ad.coursesOffered.slice(0, 3).map((course, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                          >
                            {course}
                          </span>
                        ))}
                        {ad.coursesOffered.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-800 text-[10px] font-bold">
                            +{ad.coursesOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Deadline info */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Deadline: <strong className="text-slate-900">{ad.applicationDeadline}</strong></span>
                      </span>
                      <button
                        onClick={() => setSelectedAd(ad)}
                        className="text-cyan-700 hover:text-cyan-800 font-bold hover:underline"
                      >
                        View Poster
                      </button>
                    </div>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {/* CRITICAL: Prominent "Apply for Admission" Button */}
                    <button
                      onClick={() => handleApplyClick(ad)}
                      disabled={isExpired}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                        isExpired
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-emerald-600/20'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{isExpired ? 'Admissions Closed' : 'Apply for Admission'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Call & WhatsApp Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={callUrl}
                        onClick={() => handleCall(ad)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Call Desk</span>
                      </a>

                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleWhatsApp(ad)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* College Detail Modal */}
      <CollegeDetailModal
        ad={selectedAd}
        isOpen={!!selectedAd}
        onClose={() => setSelectedAd(null)}
        onApplyClick={(ad) => handleApplyClick(ad)}
        onCallClick={(ad) => handleCall(ad)}
        onWhatsAppClick={(ad) => handleWhatsApp(ad)}
      />

      {/* External Student Application Safety Modal */}
      {redirectAd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Opening Official College Form
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You are leaving Sargodha Marketplace to access <strong>{redirectAd.instituteName}</strong>'s online application form:
              </p>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-100 font-mono text-[11px] text-cyan-800 break-all select-all border border-slate-200">
                {redirectAd.applicationFormUrl}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-[11px] text-cyan-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                <span>Student Privacy &amp; Security Notice:</span>
              </p>
              <p>
                Sargodha Marketplace does not collect admission passwords, fee slips, or personal documents directly. You will submit them on the institute’s verified official form.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRedirectAd(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={proceedRedirect}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Continue to Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
