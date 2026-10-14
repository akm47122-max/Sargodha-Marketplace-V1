import React from 'react';
import { ShoppingBag, Briefcase, LayoutDashboard, Shield, PlusCircle, User, Check, LogIn, LogOut, Sparkles, Megaphone, ExternalLink, MapPin, Truck, Trophy, Compass, Download, Utensils, Server, GraduationCap, Play } from 'lucide-react';
import { UserProfile, City, SiteSettings, AnnouncementItem, District, Tehsil, AreaLocation } from '../types';
import { getActiveAnnouncements } from '../utils/settings';
import { INITIAL_DISTRICTS, INITIAL_TEHSILS, INITIAL_AREAS } from '../data/locationData';
import { VerifiedBadge } from './VerifiedBadge';

interface NavbarProps {
  currentView: 'home' | 'food' | 'jobs' | 'skills' | 'transport' | 'colleges' | 'top-sellers' | 'nearby' | 'dashboard' | 'admin' | 'post-ad' | 'post-job';
  setCurrentView: (view: 'home' | 'food' | 'jobs' | 'skills' | 'transport' | 'colleges' | 'top-sellers' | 'nearby' | 'dashboard' | 'admin' | 'post-ad' | 'post-job') => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  pendingActivationsCount: number;
  onPostClick: () => void;
  selectedCity?: City | 'All';
  setSelectedCity?: (city: City | 'All') => void;
  settings?: SiteSettings;
  announcements?: AnnouncementItem[];
  districts?: District[];
  tehsils?: Tehsil[];
  areas?: AreaLocation[];
  selectedDistrictId?: number | 'all';
  setSelectedDistrictId?: (id: number | 'all') => void;
  selectedTehsilId?: number | 'all';
  setSelectedTehsilId?: (id: number | 'all') => void;
  selectedArea?: string;
  setSelectedArea?: (area: string) => void;
  onInstallPwa?: () => void;
  isPwaInstalled?: boolean;
  onOpenHostingerGuide?: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  users,
  onSwitchUser,
  onLogout,
  onOpenAuth,
  pendingActivationsCount,
  onPostClick,
  selectedCity = 'All',
  setSelectedCity,
  settings,
  announcements = [],
  districts = INITIAL_DISTRICTS,
  tehsils = INITIAL_TEHSILS,
  areas = INITIAL_AREAS,
  selectedDistrictId = 'all',
  setSelectedDistrictId,
  selectedTehsilId = 'all',
  setSelectedTehsilId,
  selectedArea = 'all',
  setSelectedArea,
  onInstallPwa,
  isPwaInstalled = false,
  onOpenHostingerGuide,
  onReplayIntro,
}) => {
  const topBarAnnouncements = getActiveAnnouncements(announcements, 'top_bar');
  const activeTopAnnouncement = topBarAnnouncements[0];

  const brandName = settings?.websiteName || 'SargodhaMart';
  const tagline = settings?.tagline || 'Buy • Sell • Jobs • Grow';
  const feeFormatted = `Rs. ${(settings?.activationFee || 1000).toLocaleString()}`;
  const channelUrl = settings?.whatsappChannelUrl || 'https://whatsapp.com/channel/0029Vb8bmhAGk1Fzze6iTX0g';
  const isChannelEnabled = settings ? settings.isWhatsappChannelEnabled : true;

  // Active district tehsils
  const currentDistrictTehsils = tehsils.filter(
    (t) => selectedDistrictId !== 'all' && t.districtId === selectedDistrictId && t.isActive
  );

  // Active tehsil areas
  const currentTehsilAreas = areas.filter(
    (a) => selectedTehsilId !== 'all' && a.tehsilId === selectedTehsilId && a.isActive
  );

  const handleSelectDistrict = (dId: number | 'all') => {
    if (setSelectedDistrictId) setSelectedDistrictId(dId);
    if (setSelectedTehsilId) setSelectedTehsilId('all');
    if (setSelectedArea) setSelectedArea('all');
    if (setSelectedCity) {
      if (dId === 'all') setSelectedCity('All');
      else {
        const found = districts.find((d) => d.id === dId);
        if (found) setSelectedCity(found.name as City);
      }
    }
  };

  const handleSelectTehsil = (tId: number | 'all') => {
    if (setSelectedTehsilId) setSelectedTehsilId(tId);
    if (setSelectedArea) setSelectedArea('all');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.06)]">
      {/* Optional Top Bar Announcement Strip (Managed via Admin Settings) */}
      {activeTopAnnouncement && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold px-4 py-1.5 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <Megaphone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <span className="font-extrabold">{activeTopAnnouncement.title}</span>
              <span className="hidden sm:inline font-medium text-slate-900">• {activeTopAnnouncement.message}</span>
            </div>
            {activeTopAnnouncement.buttonText && activeTopAnnouncement.buttonUrl && (
              <a
                href={activeTopAnnouncement.buttonUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-lg bg-black text-white hover:bg-slate-900 text-[11px] font-black shrink-0 flex items-center gap-1 transition-all"
              >
                <span>{activeTopAnnouncement.buttonText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Regional Location Hierarchy Strip: Division -> District -> Tehsil -> Area */}
      <div className="bg-slate-50/95 border-b border-cyan-100/70 px-4 py-2 text-[11px] text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Districts & Tehsils selector */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            <span className="inline-flex items-center gap-1 font-bold text-slate-800 text-[11px] shrink-0 mr-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>Sargodha Division:</span>
            </span>

            {/* All Districts Button */}
            <button
              onClick={() => handleSelectDistrict('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                selectedDistrictId === 'all'
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              All Districts
            </button>

            {/* 4 Districts: Sargodha, Khushab, Mianwali, Bhakkar */}
            {districts.filter((d) => d.isActive).map((d) => (
              <button
                key={d.id}
                onClick={() => handleSelectDistrict(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  selectedDistrictId === d.id
                    ? 'bg-cyan-50 text-cyan-800 font-extrabold border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                }`}
              >
                {d.name}
              </button>
            ))}

            {/* Tehsils row for selected District (e.g. 7 Tehsils for Sargodha) */}
            {selectedDistrictId !== 'all' && currentDistrictTehsils.length > 0 && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-300 ml-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Tehsils:</span>
                <button
                  onClick={() => handleSelectTehsil('all')}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                    selectedTehsilId === 'all'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  All Tehsils
                </button>
                {currentDistrictTehsils.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTehsil(t.id)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                      selectedTehsilId === t.id
                        ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}

            {/* Key Areas (e.g. Shaheenabad for Sillanwali) */}
            {selectedTehsilId !== 'all' && currentTehsilAreas.length > 0 && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-300 ml-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Areas:</span>
                <button
                  onClick={() => setSelectedArea && setSelectedArea('all')}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                    selectedArea === 'all'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  All Areas
                </button>
                {currentTehsilAreas.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArea && setSelectedArea(a.name)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                      selectedArea === a.name
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-600 shrink-0">
            <span>
              Lifetime Seller Activation: <strong className="text-cyan-700 font-bold">{feeFormatted}</strong>
            </span>
            {isChannelEnabled && (
              <>
                <span>•</span>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>📲</span> {settings?.whatsappChannelName || 'Official WhatsApp Channel'}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div onClick={() => setCurrentView('home')} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-1">
              SARGODHA<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent">MART</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-700">
              {tagline}
            </div>
          </div>
        </div>

        {/* Portal Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-cyan-100 shadow-inner">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'home'
                ? 'bg-white text-cyan-800 border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
            Marketplace
          </button>

          <button
            onClick={() => setCurrentView('food')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'food'
                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                : 'text-amber-900 bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100/80'
            }`}
            title="Sargodha Food Hub & Restaurants | کھانا اور ڈیلز"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Food & Deals (کھانا)</span>
          </button>

          <button
            onClick={() => setCurrentView('jobs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'jobs'
                ? 'bg-white text-blue-800 border border-blue-300 shadow-[0_0_15px_rgba(37,99,235,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Jobs & Work
          </button>

          <button
            onClick={() => setCurrentView('skills')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'skills'
                ? 'bg-white text-emerald-800 border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Digital Skills
          </button>

          <button
            onClick={() => setCurrentView('transport')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'transport'
                ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-amber-900 bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70'
            }`}
            title="Pakistan-Wide Trucking, Freight & Load Matching | ٹرک اور مال برداری"
          >
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            <span>Truck & Freight | ٹرک اور مال برداری</span>
          </button>

          <button
            onClick={() => setCurrentView('colleges')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'colleges'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                : 'text-indigo-950 bg-indigo-50/80 border border-indigo-200/80 hover:bg-indigo-100/80'
            }`}
            title="Sargodha Colleges, Admissions & Campus Ads | کالج اور داخلے"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Colleges &amp; Admissions (داخلے)</span>
          </button>

          <button
            onClick={() => setCurrentView('top-sellers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'top-sellers'
                ? 'bg-white text-amber-900 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Top Sellers
          </button>

          <button
            onClick={() => setCurrentView('nearby')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'nearby'
                ? 'bg-white text-cyan-800 border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            Nearby
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setCurrentView('dashboard');
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'dashboard'
                ? 'bg-white text-fuchsia-800 border border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.18)]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-fuchsia-600" />
            Dashboard
          </button>

          {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentView === 'admin'
                  ? 'bg-white text-rose-800 border border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.18)]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              Admin Panel
              {pendingActivationsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  {pendingActivationsCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            /* Logged in User Menu */
            <div className="flex items-center gap-1.5">
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-cyan-200 text-slate-800 text-xs hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all">
                  <User className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-bold max-w-[120px] truncate">{currentUser.name}</span>
                  {currentUser.isVerified && <VerifiedBadge size="xs" />}
                  {currentUser.activationStatus === 'active' ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                      Pending
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-cyan-200 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Logged In User</div>
                    <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                    <div className="text-slate-500 text-[11px]">
                      {currentUser.mobile} · {currentUser.city}
                    </div>
                  </div>
                  <div className="px-3 py-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Switch Account Profile
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSwitchUser(u)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                        currentUser.id === u.id
                          ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="truncate font-semibold flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.isVerified && <VerifiedBadge size="xs" />}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {u.city} · {u.role === 'super_admin' ? 'Super Admin' : u.activationStatus === 'active' ? 'Active Seller' : 'Pending Activation'}
                        </div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out (Browse as Guest)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Quick Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition-all shadow-xs"
                title="Log Out (Browse as Guest)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Guest Mode - Login / Register button */
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-cyan-200 text-slate-800 text-xs font-bold shadow-xs hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-600" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Hostinger Guide Button */}
          {onOpenHostingerGuide && (
            <button
              onClick={onOpenHostingerGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Hostinger cPanel, PHP & MySQL Hosting Guide"
            >
              <Server className="w-3.5 h-3.5 text-purple-600" />
              <span>Hostinger Guide</span>
            </button>
          )}

          {/* 3D Intro Replay Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Replay Cinematic 3D Intro & Akraam TechForge Showcase"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>3D Intro</span>
            </button>
          )}

          {/* Install SargodhaMart App */}
          {onInstallPwa && !isPwaInstalled && (
            <button
              onClick={onInstallPwa}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-xs"
              title="Install SargodhaMart App on Android or Desktop"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Install App</span>
            </button>
          )}

          {/* Post Ad / Job Button */}
          <button
            onClick={onPostClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 hover:from-cyan-400 hover:via-blue-500 hover:to-fuchsia-500 text-white shadow-lg shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Ad</span>
            <span className="hidden sm:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-extrabold text-white">
              {currentUser?.activationStatus === 'active' ? 'FREE' : feeFormatted}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
