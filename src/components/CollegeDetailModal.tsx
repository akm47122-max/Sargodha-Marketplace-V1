import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  ExternalLink,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Share2,
  Check,
  BookOpen,
  Award,
  Globe,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import { CollegeAd } from '../types';

interface CollegeDetailModalProps {
  ad: CollegeAd | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyClick?: (ad: CollegeAd) => void;
  onCallClick?: (ad: CollegeAd) => void;
  onWhatsAppClick?: (ad: CollegeAd) => void;
}

export const CollegeDetailModal: React.FC<CollegeDetailModalProps> = ({
  ad,
  isOpen,
  onClose,
  onApplyClick,
  onCallClick,
  onWhatsAppClick,
}) => {
  if (!isOpen || !ad) return null;

  const [copied, setCopied] = useState(false);
  const [showRedirectWarning, setShowRedirectWarning] = useState(false);

  // Check deadline
  const isExpired = ad.applicationDeadline
    ? new Date(ad.applicationDeadline) < new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  const daysLeft = ad.applicationDeadline
    ? Math.ceil((new Date(ad.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : null;

  // Pakistan international WhatsApp format: https://wa.me/923098557159
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

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyNow = () => {
    // Show redirect safety warning first
    setShowRedirectWarning(true);
  };

  const proceedToExternalForm = () => {
    setShowRedirectWarning(false);
    if (onApplyClick) onApplyClick(ad);
    // Open in new tab
    if (typeof window !== 'undefined') {
      window.open(ad.applicationFormUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900 px-6 py-5 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md p-1 border border-white/20 shrink-0 overflow-hidden flex items-center justify-center">
              {ad.logoImage ? (
                <img src={ad.logoImage} alt={ad.instituteName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <GraduationCap className="w-8 h-8 text-cyan-200" />
              )}
            </div>

            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                  {ad.instituteType}
                </span>
                {isExpired ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    Admissions Closed
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Admissions Open • {daysLeft !== null && daysLeft > 0 ? `${daysLeft} days left` : 'Deadline Today'}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-cyan-200">
                  Verified Campus Ad
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {ad.instituteName}
              </h2>

              {ad.tagline && (
                <p className="text-xs text-cyan-100 font-medium italic mt-0.5">{ad.tagline}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Poster Image Hero Preview */}
          {ad.posterImage && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-72 bg-slate-950">
              <img
                src={ad.posterImage}
                alt={`${ad.instituteName} Admission Poster`}
                className="w-full h-full object-contain max-h-72 mx-auto"
              />
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                  Official Admission Poster
                </span>
              </div>
            </div>
          )}

          {/* Key Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-600 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-cyan-800">Application Deadline</div>
                <div className="text-xs font-black text-cyan-950">
                  {ad.applicationDeadline || 'Open for Session'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-800">Campus Location</div>
                <div className="text-xs font-black text-blue-950">{ad.location}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800">Verification Status</div>
                <div className="text-xs font-black text-emerald-950">Approved Educational Ad</div>
              </div>
            </div>
          </div>

          {/* Courses Offered */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Courses &amp; Degrees Offered</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {ad.coursesOffered.map((course, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-sm"
                >
                  🎓 {course}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          {ad.eligibilityCriteria && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Eligibility Criteria &amp; Merit Requirements</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {ad.eligibilityCriteria}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Campus Facilities &amp; Admission Details
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium bg-white p-4 rounded-2xl border border-slate-200">
              {ad.description}
            </p>
          </div>

          {/* Institute Contacts Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-cyan-300">
                Official Campus Admission Desk
              </div>
              <span className="text-[11px] text-slate-400">{ad.address}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={callUrl}
                onClick={() => onCallClick && onCallClick(ad)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold text-white border border-white/10"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call: {ad.phone}</span>
              </a>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onWhatsAppClick && onWhatsAppClick(ad)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 transition-all text-xs font-bold text-emerald-200 border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {ad.whatsapp}</span>
              </a>

              {ad.officialWebsite && (
                <a
                  href={ad.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 transition-all text-xs font-bold text-blue-200 border border-blue-500/30 truncate"
                >
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Official Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer: PROMINENT "Apply for Admission" BUTTON */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Ad'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>

            {/* Prominent Apply for Admission Button */}
            <button
              onClick={handleApplyNow}
              disabled={isExpired}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black tracking-wide shadow-lg transition-all ${
                isExpired
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-95 text-white shadow-emerald-600/30'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isExpired ? 'Admissions Closed' : 'Apply for Admission Online'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* External Form Redirect Safety Modal */}
      {showRedirectWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">
                Leaving Sargodha Marketplace
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You are being redirected to <strong>{ad.instituteName}</strong>'s official application portal:
              </p>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-100 font-mono text-[11px] text-cyan-800 break-all select-all border border-slate-200">
                {ad.applicationFormUrl}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-[11px] text-cyan-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                <span>Student Privacy &amp; Security Notice:</span>
              </p>
              <p>
                Sargodha Marketplace does not collect admission passwords, payment pin codes, or CNIC copies directly. All applications are processed directly through the college’s secure form.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRedirectWarning(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={proceedToExternalForm}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Continue to College Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
