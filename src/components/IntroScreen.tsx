import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Shirt,
  ShoppingBasket,
  Truck
} from 'lucide-react';
import { SiteSettings } from '../types';

interface IntroScreenProps {
  onComplete: () => void;
  settings?: SiteSettings;
  forceShow?: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onComplete,
  settings,
}) => {
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const finishedRef = useRef(false);

  const adminPhone = settings?.adminSupportPhone || '0309 8557159';
  const rawWhatsApp = settings?.adminSupportWhatsApp || '0309 8557159';
  // Standard Pakistan international WhatsApp format: https://wa.me/923098557159
  const cleanPhoneDigits = rawWhatsApp.replace(/\D/g, '');
  const internationalWhatsApp = cleanPhoneDigits.startsWith('92')
    ? cleanPhoneDigits
    : cleanPhoneDigits.startsWith('0')
    ? `92${cleanPhoneDigits.slice(1)}`
    : `92${cleanPhoneDigits}`;
  const whatsAppUrl = `https://wa.me/${internationalWhatsApp}`;
  const callUrl = `tel:${adminPhone.replace(/\s+/g, '')}`;

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('sargodha_intro_seen', 'true');
      } catch (e) {
        // storage disabled fallback
      }
    }
    onComplete();
  }, [onComplete]);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Animate progress bar over 6.5 seconds
  useEffect(() => {
    // If reduced motion is preferred and not forced, allow fast pass
    const duration = isReducedMotion ? 2000 : 6500;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isReducedMotion]);

  // Trigger completion safely when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      handleFinish();
    }
  }, [progress, handleFinish]);

  const floatingCategories = [
    {
      id: 'tech',
      title: 'Mobiles, Laptops & Tech',
      subtitle: 'iPhone, Dell, HP & Accessories',
      icon: <Laptop className="w-4 h-4 text-cyan-400" />,
      tag: '0% Middleman',
      color: 'from-cyan-500/20 to-blue-600/30 border-cyan-500/40 text-cyan-200',
      delay: '0s',
      pos: 'top-8 left-4 md:top-14 md:left-12',
    },
    {
      id: 'fashion',
      title: 'Clothing, Shoes & Cosmetics',
      subtitle: 'Boutiques, Lawn & Leather',
      icon: <Shirt className="w-4 h-4 text-emerald-400" />,
      tag: 'Local Mandi',
      color: 'from-emerald-500/20 to-teal-600/30 border-emerald-500/40 text-emerald-200',
      delay: '0.6s',
      pos: 'top-8 right-4 md:top-16 md:right-12',
    },
    {
      id: 'grocery',
      title: 'Groceries & Kinnow Fruit',
      subtitle: 'Sillanwali Citrus & Daily Needs',
      icon: <ShoppingBasket className="w-4 h-4 text-amber-400" />,
      tag: 'Direct Farm',
      color: 'from-amber-500/20 to-orange-600/30 border-amber-500/40 text-amber-200',
      delay: '1.2s',
      pos: 'bottom-28 left-3 md:bottom-28 md:left-16',
    },
    {
      id: 'freight',
      title: 'Truck & Freight + Food Deals',
      subtitle: 'Nationwide Cargo & Royal Chef Deals',
      icon: <Truck className="w-4 h-4 text-rose-400" />,
      tag: 'Live Booking',
      color: 'from-rose-500/20 to-pink-600/30 border-rose-500/40 text-rose-200',
      delay: '1.8s',
      pos: 'bottom-28 right-3 md:bottom-28 md:right-16',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0c1a30 0%, #050b14 65%, #020509 100%)',
      }}
    >
      {/* Dynamic 3D Neon Ambient Lights & Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        {/* Subtle grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Header: Brand Tagline + Skip Button */}
      <header className="relative z-20 flex items-center justify-between p-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sargodha Live Network</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Skip Intro Button */}
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs md:text-sm font-bold tracking-wide backdrop-blur-md transition-all shadow-lg hover:border-cyan-400/50 hover:shadow-cyan-500/20"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Floating 3D Product Elements (Hidden on tiny screens to avoid clutter) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
        {floatingCategories.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.pos} transition-transform duration-700`}
            style={{
              animation: isReducedMotion ? 'none' : `floatSlow 6s ease-in-out infinite alternate`,
              animationDelay: item.delay,
            }}
          >
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r ${item.color} backdrop-blur-md border shadow-xl shadow-black/40`}
            >
              <div className="p-1.5 rounded-xl bg-white/10">{item.icon}</div>
              <div>
                <div className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
                  {item.title}
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-white/15 font-extrabold text-cyan-200">
                    {item.tag}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">{item.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Center Stage: Cinematic 3D Shopping Bag Logo & Typography */}
      <main className="relative z-20 flex flex-col items-center justify-center my-auto px-4 text-center max-w-4xl mx-auto w-full">
        {/* 3D Shopping Bag Container */}
        <div
          className="relative group mb-6"
          style={{
            perspective: '1200px',
          }}
        >
          {/* Outer Neon Glow Rings */}
          <div className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-emerald-500/30 to-blue-600/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* 3D Model Bag Representation */}
          <div
            className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl p-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-emerald-400 shadow-[0_20px_50px_rgba(6,182,212,0.4)] transition-transform duration-700 ease-out"
            style={{
              transform: isReducedMotion
                ? 'none'
                : 'rotateX(8deg) rotateY(-8deg) translateZ(20px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Bag Body Glossy Reflection Layer */}
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden border border-white/20">
              {/* Glossy Diagonal Specular Highlight */}
              <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 transform pointer-events-none translate-x-12 translate-y-4" />

              {/* Shopping Bag Handles (3D Arc) */}
              <div
                className="absolute -top-3 w-12 md:w-16 h-8 border-4 border-cyan-300 rounded-t-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                style={{
                  transform: 'translateZ(15px)',
                }}
              />

              {/* Shopping Bag Center Hologram Icon */}
              <div
                className="relative z-10 flex flex-col items-center justify-center"
                style={{
                  transform: 'translateZ(30px)',
                }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(6,182,212,0.8)]">
                  <ShoppingBag className="w-8 h-8 md:w-9 md:h-9 drop-shadow" />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-cyan-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Verified 3D</span>
                </div>
              </div>

              {/* Neon Floor Shadow */}
              <div className="absolute -bottom-6 w-24 h-4 bg-cyan-400/40 rounded-full blur-md" />
            </div>
          </div>
        </div>

        {/* Brand Name & Taglines */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[11px] font-bold tracking-wider uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            The Official City Trading & Employment Portal
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
            <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]">SARGODHA</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]">
              MARKETPLACE
            </span>
          </h1>

          <p className="text-base sm:text-xl font-semibold text-slate-300 tracking-wide">
            Your City. Your Marketplace.
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed pt-1">
            Mobiles • Laptops • Groceries • Farm Cattle • Truck Freight • Food Deals • Campus Admissions & Digital Jobs
          </p>
        </div>

        {/* Developer Credit Branding */}
        <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 border border-cyan-500/20 backdrop-blur-md max-w-md w-full">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            DESIGNED &amp; DEVELOPED BY
          </div>
          <div className="text-sm font-black tracking-wider text-transparent bg-gradient-to-r from-cyan-300 via-emerald-300 to-blue-300 bg-clip-text">
            AKRAAM TECHFORGE
          </div>
          <div className="text-[11px] font-medium text-slate-300 tracking-widest flex items-center justify-center gap-2 pt-0.5">
            <span>Ideas</span>
            <span className="text-cyan-400">•</span>
            <span>Code</span>
            <span className="text-emerald-400">•</span>
            <span>Future</span>
          </div>
        </div>

        {/* Admin Support Contact Prominent Box with Call & WhatsApp buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-md">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Admin Support: <strong className="text-white font-bold">{adminPhone}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Call Button */}
            <a
              href={callUrl}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
              title="Call Admin Support"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            {/* WhatsApp Button with International Pakistan URL format */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              title="Chat on WhatsApp (wa.me/923098557159)"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      {/* Bottom Footer: Loading Bar & Auto Navigation */}
      <footer className="relative z-20 w-full max-w-2xl mx-auto px-4 pb-6 pt-2">
        <div className="space-y-2">
          {/* Progress Bar Container */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Opening Marketplace...
            </span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(progress)}%</span>
          </div>

          {/* Smooth Neon Animated Progress Bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-1">
            <span>Powered by Hostinger &amp; Akraam TechForge</span>
            <button
              onClick={handleFinish}
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors"
            >
              Enter Now
            </button>
          </div>
        </div>
      </footer>

      {/* Global CSS keyframes for floating animations */}
      <style>{`
        @keyframes floatSlow {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
};
