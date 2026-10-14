import React from 'react';
import { ShoppingBag, Briefcase, FileText, Layers, User, LogIn, Truck, Utensils, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
  currentUser: UserProfile | null;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  currentUser,
  compareCount,
  onOpenCompare,
  onOpenAuth,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 px-1 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-7 items-center justify-around text-center">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'home' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Market</span>
        </button>

        {/* 2. Food & Deals */}
        <button
          onClick={() => onNavigate('food')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'food' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-500" />
          <span className="text-[9px] mt-0.5">Food</span>
        </button>

        {/* 3. Jobs */}
        <button
          onClick={() => onNavigate('jobs')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'jobs' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Jobs</span>
        </button>

        {/* 4. Transport */}
        <button
          onClick={() => onNavigate('transport')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'transport' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-500" />
          <span className="text-[8px] sm:text-[9px] mt-0.5">Trucks</span>
        </button>

        {/* 5. Colleges & Admissions */}
        <button
          onClick={() => onNavigate('colleges')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'colleges' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <span className="text-[8px] sm:text-[9px] mt-0.5">Colleges</span>
        </button>

        {/* 6. Skills */}
        <button
          onClick={() => onNavigate('skills')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'skills' ? 'text-fuchsia-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[8px] sm:text-[9px] mt-0.5">Skills</span>
        </button>

        {/* 6. User / Dashboard */}
        {currentUser ? (
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              currentView === 'dashboard' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Portal</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center py-1 text-cyan-600 font-bold hover:text-cyan-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};
