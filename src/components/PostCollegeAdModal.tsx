import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Upload,
  Calendar,
  Link,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Globe,
  Plus
} from 'lucide-react';
import { UserProfile, City, SiteSettings, CollegeAd } from '../types';

interface PostCollegeAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  settings?: SiteSettings;
  onSubmit: (adData: Omit<CollegeAd, 'id' | 'views' | 'applyClicks' | 'callClicks' | 'whatsappClicks' | 'submittedAt' | 'status'>) => void;
  onOpenAuth: () => void;
}

export const PostCollegeAdModal: React.FC<PostCollegeAdModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  settings,
  onSubmit,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const packagePrice = settings?.collegeAdPackagePrice || 3500;
  const packageDuration = settings?.collegeAdDurationDays || 30;

  const [instituteName, setInstituteName] = useState('');
  const [instituteType, setInstituteType] = useState<'University' | 'College' | 'Academy' | 'Institute' | 'Polytechnic'>('College');
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState<City>('Sargodha');
  const [area, setArea] = useState('University Road');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.mobile || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [applicationFormUrl, setApplicationFormUrl] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState<string[]>([
    'BS Computer Science',
    'F.Sc Pre-Medical',
    'ICS'
  ]);
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [posterImage, setPosterImage] = useState(
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'
  );
  const [logoImage, setLogoImage] = useState(
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'
  );
  const [transactionReference, setTransactionReference] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [urlWarning, setUrlWarning] = useState('');

  // Validate URL strictly for HTTP/HTTPS
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddCourse = () => {
    if (courseInput.trim() && !courses.includes(courseInput.trim())) {
      setCourses([...courses, courseInput.trim()]);
      setCourseInput('');
    }
  };

  const handleRemoveCourse = (courseToRemove: string) => {
    setCourses(courses.filter((c) => c !== courseToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setUrlWarning('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!instituteName.trim()) {
      setErrorMessage('Please enter the educational institute name.');
      return;
    }

    if (!phone.trim() || !whatsapp.trim()) {
      setErrorMessage('Please provide both official Phone and WhatsApp numbers.');
      return;
    }

    if (!applicationDeadline) {
      setErrorMessage('Please specify the admission application deadline.');
      return;
    }

    if (!applicationFormUrl.trim()) {
      setErrorMessage('Please provide a student application URL (Google Forms or official website portal).');
      return;
    }

    if (!validateUrl(applicationFormUrl)) {
      setErrorMessage('Invalid Application Form URL. Only secure http:// or https:// URLs are allowed (e.g. Google Forms or your college portal).');
      return;
    }

    if (officialWebsite && !validateUrl(officialWebsite)) {
      setErrorMessage('Invalid Official Website URL. Must begin with http:// or https://');
      return;
    }

    if (courses.length === 0) {
      setErrorMessage('Please specify at least one course or degree offered.');
      return;
    }

    if (!transactionReference.trim()) {
      setErrorMessage(`Please enter your EasyPaisa / JazzCash TRX ID for Rs. ${packagePrice.toLocaleString()} payment verification.`);
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        userId: currentUser.id,
        instituteName: instituteName.trim(),
        instituteType,
        tagline: tagline.trim() || undefined,
        location: `${area}, ${city}`,
        city,
        area,
        address: address.trim() || `${area}, ${city}`,
        contactPerson: contactPerson.trim() || undefined,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        officialWebsite: officialWebsite.trim() || undefined,
        applicationFormUrl: applicationFormUrl.trim(),
        applicationDeadline,
        coursesOffered: courses,
        eligibilityCriteria: eligibilityCriteria.trim() || undefined,
        description: description.trim() || `Admissions Open for ${instituteName} in Sargodha.`,
        posterImage,
        logoImage,
        packagePrice,
        durationDays: packageDuration,
        transactionReference: transactionReference.trim(),
        paymentProofUrl: paymentProofUrl || undefined,
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit admission ad. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Colleges & Campus Ads</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                  Premium Package
                </span>
              </div>
              <p className="text-xs text-cyan-100 font-medium">
                Promote admissions to 50,000+ local Sargodha students • Rs. {packagePrice.toLocaleString()} for {packageDuration} days
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Institute Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>1. Educational Institute Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institute / College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="e.g. University of Sargodha, Punjab College, SMC"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institute Type</label>
                <select
                  value={instituteType}
                  onChange={(e: any) => setInstituteType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none font-medium"
                >
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Academy">Academy / Tuition Center</option>
                  <option value="Institute">Technical Institute</option>
                  <option value="Polytechnic">Polytechnic / DAE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motto / Tagline (Optional)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Producing Board Toppers & Future Doctors"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e: any) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Sargodha">Sargodha</option>
                  <option value="Sillanwali">Sillanwali</option>
                  <option value="Shaheenabad">Shaheenabad</option>
                  <option value="Kot Momin">Kot Momin</option>
                  <option value="Bhalwal">Bhalwal</option>
                  <option value="Sahiwal">Sahiwal</option>
                  <option value="Shahpur">Shahpur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Campus Location</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. University Road, Club Road, 49 Tail"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Stadium Chowk, Sargodha"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Contact & Admission Links */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>2. Contact &amp; Student Application Portals</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0483722201 / 03098557159"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="03098557159"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admissions@college.edu.pk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* CRITICAL: Student Application Form Link */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-2">
              <label className="block text-xs font-black text-cyan-950 flex items-center gap-1.5">
                <Link className="w-4 h-4 text-cyan-700" />
                <span>Online Admission Form / Google Forms URL <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="url"
                required
                value={applicationFormUrl}
                onChange={(e) => setApplicationFormUrl(e.target.value)}
                placeholder="https://forms.gle/xyz or https://admissions.college.edu.pk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-300 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <div className="flex items-start gap-1.5 text-[11px] text-cyan-800">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-600" />
                <span>
                  Students clicking <strong>“Apply for Admission”</strong> will be safely redirected to this link.
                  Must begin with <code>https://</code> or <code>http://</code>. Sensitive student passwords are never stored on Sargodha Marketplace.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Website (Optional)</label>
                <input
                  type="url"
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  placeholder="https://uos.edu.pk or https://pgc.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admission Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Courses & Description */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>3. Courses, Eligibility &amp; Poster</span>
            </h3>

            {/* Courses Tag input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Courses &amp; Degrees Offered <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCourse();
                    }
                  }}
                  placeholder="e.g. BS Software Engineering, DPT, F.Sc"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {courses.map((course) => (
                  <span
                    key={course}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold"
                  >
                    <span>{course}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course)}
                      className="text-blue-500 hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
              <input
                type="text"
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                placeholder="e.g. Minimum 60% in Matric / Intermediate. Special fee concessions available."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admission Poster Image URL</label>
              <input
                type="url"
                value={posterImage}
                onChange={(e) => setPosterImage(e.target.value)}
                placeholder="https://... image URL for poster"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description &amp; Highlights</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about campus facilities, air-conditioned labs, faculty, transport, and scholarship quotas..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* 4. Payment Verification for Rs. 3,500 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-700" />
                <div>
                  <div className="text-xs font-black uppercase text-amber-950">
                    College Advertising Package: Rs. {packagePrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    Duration: {packageDuration} Days Active Showcase • Verified Campus Ad Badge
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-amber-600 text-white font-black text-xs">
                Rs. {packagePrice.toLocaleString()}
              </div>
            </div>

            <div className="text-[11px] text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/60">
              <p className="font-bold text-slate-900 mb-1">How to pay via EasyPaisa / JazzCash:</p>
              <p>• <strong>EasyPaisa:</strong> 03127453108 (Muhammad Akram Tayyab)</p>
              <p>• <strong>JazzCash:</strong> 03098557159 (Muhammad Akram Tayyab)</p>
              <p className="mt-1 text-slate-500">
                After transferring, enter the Transaction ID (TRX ID / TID) below. The admin will verify and activate your ad within minutes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-amber-950 mb-1">
                Transaction ID (TRX ID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="e.g. 8472910348 or TRX-102934"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white text-xs font-black tracking-wide shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting Ad...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit College Ad (Rs. {packagePrice.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
