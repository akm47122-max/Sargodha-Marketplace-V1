import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  ShieldCheck,
  Check,
  ArrowRight,
  Trash2,
  Send,
  Layers,
} from 'lucide-react';
import { Listing } from '../types';

interface ProductComparisonModalProps {
  comparedProducts: Listing[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: number) => void;
  onClearAll: () => void;
  onSelectProduct: (listing: Listing) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  comparedProducts,
  isOpen,
  onClose,
  onRemoveProduct,
  onClearAll,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-600/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Product Comparison ({comparedProducts.length}/4)
              </h2>
              <p className="text-[11px] text-slate-500">
                Compare side-by-side specs, condition, pricing, and seller trust indicators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-grow">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No products added for comparison</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Add to Compare" on any product card in the marketplace to compare up to 4 items side-by-side.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-xs min-w-[640px]">
              <thead>
                <tr>
                  <th className="w-36 py-3 px-3 text-left font-bold text-slate-400 uppercase tracking-wider text-[10px] bg-slate-50 rounded-l-xl">
                    Product
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="py-3 px-3 text-left bg-slate-50">
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                          #{p.id}
                        </span>
                        <button
                          onClick={() => onRemoveProduct(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="cursor-pointer group"
                      >
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="font-black text-slate-900 group-hover:text-cyan-700 line-clamp-2 text-xs">
                          {p.title}
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty slots */}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="py-3 px-3 text-center bg-slate-50/40 text-slate-300 font-normal">
                      <div className="border border-dashed border-slate-200 rounded-xl h-44 flex flex-col items-center justify-center gap-1">
                        <span className="text-xl">+</span>
                        <span className="text-[10px]">Empty Slot</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Price Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Price</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3">
                      <div className="text-base font-black text-emerald-700">
                        Rs. {p.price.toLocaleString()}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-price-${i}`} className="py-3 px-3" />
                  ))}
                </tr>

                {/* Condition Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Condition</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.condition === 'New'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.condition === 'Like New'
                          ? 'bg-cyan-100 text-cyan-800'
                          : p.condition === 'Refurbished'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.condition}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-cond-${i}`} className="py-3 px-3" />
                  ))}
                </tr>

                {/* Category Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Category</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 font-medium text-slate-700">
                      {p.categoryName} {p.subcategory ? `• ${p.subcategory}` : ''}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-cat-${i}`} className="py-3 px-3" />
                  ))}
                </tr>

                {/* Location Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Location</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3 font-medium text-slate-700">
                      {p.area}, {p.city}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-loc-${i}`} className="py-3 px-3" />
                  ))}
                </tr>

                {/* Seller Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Seller</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-3 px-3">
                      <div className="font-bold text-slate-900">{p.sellerName}</div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Active Seller</span>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-seller-${i}`} className="py-3 px-3" />
                  ))}
                </tr>

                {/* Contact Options Row */}
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-500">Contact Seller</td>
                  {comparedProducts.map((p) => {
                    const isPrivate = p.sellerContactPrivacy === 'HIDE_PHONE';
                    const waOnly = p.sellerContactPrivacy === 'WHATSAPP_ONLY';
                    const hasTg =
                      p.sellerTelegramNumber &&
                      p.sellerTelegramStatus === 'APPROVED' &&
                      p.sellerTelegramVisibility === 'VISIBLE';

                    return (
                      <td key={p.id} className="py-3 px-3">
                        {isPrivate ? (
                          <span className="text-[11px] text-slate-400 italic">Private Contact</span>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {!waOnly && (
                              <a
                                href={`tel:${p.sellerPhone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-cyan-600" />
                                <span>Call</span>
                              </a>
                            )}
                            <a
                              href={`https://wa.me/92${p.sellerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                                `Salam! I saw your listing "${p.title}" on SargodhaMart comparison.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            {hasTg && (
                              <a
                                href={`https://t.me/+${p.sellerTelegramNumber!.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Send className="w-3 h-3" />
                                <span>Telegram</span>
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => (
                    <td key={`empty-contact-${i}`} className="py-3 px-3" />
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
