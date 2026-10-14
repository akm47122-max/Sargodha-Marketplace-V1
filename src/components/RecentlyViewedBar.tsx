import React from 'react';
import { History, X, Sparkles, Store, Briefcase, FileText, ShoppingBag } from 'lucide-react';
import { RecentlyViewedItem } from '../types';

interface RecentlyViewedBarProps {
  items: RecentlyViewedItem[];
  onSelectItem: (item: RecentlyViewedItem) => void;
  onClearHistory: () => void;
}

export const RecentlyViewedBar: React.FC<RecentlyViewedBarProps> = ({
  items,
  onSelectItem,
  onClearHistory,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Recently Viewed
          </h3>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/40 bg-slate-50/60 cursor-pointer shrink-0 transition-all max-w-[240px]"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                {item.type === 'SHOP' ? (
                  <Store className="w-5 h-5" />
                ) : item.type === 'JOB' ? (
                  <Briefcase className="w-5 h-5" />
                ) : item.type === 'SKILL' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
              </div>
            )}

            <div className="min-w-0 pr-1">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                {item.type}
              </div>
              <div className="text-xs font-black text-slate-900 truncate">
                {item.title}
              </div>
              {item.price !== undefined && (
                <div className="text-[11px] font-bold text-cyan-800">
                  Rs. {item.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
