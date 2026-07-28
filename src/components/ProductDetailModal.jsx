import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { getTranslation } from '../lib/getTranslation';

export default function ProductDetailModal({ product, open, onClose }) {
  const { addItem } = useCart();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'fr';
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const touchRef = useRef({ startX: 0, startY: 0 });

  // Build gallery with fallback
  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.images?.length > 0) return product.images;
    if (product.image_url) return [product.image_url];
    return [];
  }, [product]);

  // Reset state when product changes
  useEffect(() => {
    if (product && open) {
      setQuantity(1);
      setSelectedOptions({});
      setIsClosing(false);
      setSlideIdx(0);
    }
  }, [product, open]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Compute selected options flat array
  const flatOptions = useMemo(() => {
    const opts = [];
    Object.values(selectedOptions).forEach(groupSelections => {
      if (Array.isArray(groupSelections)) {
        groupSelections.forEach(opt => opts.push(opt));
      } else if (groupSelections) {
        opts.push(groupSelections);
      }
    });
    return opts;
  }, [selectedOptions]);

  // Compute total
  const optionsModifier = flatOptions.reduce((sum, o) => sum + o.price_modifier, 0);
  const unitPrice = product ? product.price + optionsModifier : 0;
  const totalPrice = unitPrice * quantity;

  function handleOptionToggle(group, item) {
    setSelectedOptions(prev => {
      const next = { ...prev };
      const maxSel = group.max_selections || 0; // 0 = unlimited

      if (group.type === 'single') {
        // Radio behavior: select one or deselect
        if (next[group.id]?.id === item.id) {
          delete next[group.id];
        } else {
          next[group.id] = item;
        }
      } else {
        // Checkbox behavior with max enforcement
        const current = next[group.id] || [];
        const exists = current.find(o => o.id === item.id);
        if (exists) {
          next[group.id] = current.filter(o => o.id !== item.id);
          if (next[group.id].length === 0) delete next[group.id];
        } else {
          // Enforce max_selections limit
          if (maxSel > 0 && current.length >= maxSel) {
            return prev; // Block: already at max
          }
          next[group.id] = [...current, item];
        }
      }

      return next;
    });
  }

  function isOptionSelected(group, item) {
    const sel = selectedOptions[group.id];
    if (!sel) return false;
    if (Array.isArray(sel)) return sel.some(o => o.id === item.id);
    return sel.id === item.id;
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity, flatOptions);
    handleClose();
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }

  if (!open || !product) return null;

  const groups = product.option_groups || [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center ${isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal Content */}
      <div
        className={`relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl ${
          isClosing ? 'animate-[sheetDown_0.3s_ease-out_forwards]' : 'animate-[sheetUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]'
        } sm:animate-none sm:scale-100`}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Product Media Carousel */}
          <div className="relative bg-brand-card-bg aspect-[16/10] overflow-hidden">
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${slideIdx * 100}%)` }}
              onTouchStart={e => { touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY }; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchRef.current.startX;
                const dy = e.changedTouches[0].clientY - touchRef.current.startY;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                  if (dx < 0 && slideIdx < gallery.length - 1) setSlideIdx(i => i + 1);
                  if (dx > 0 && slideIdx > 0) setSlideIdx(i => i - 1);
                }
              }}
            >
              {gallery.map((url, i) => {
                const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) || url.includes('/video/upload/');
                return (
                  <div key={i} className="w-full h-full flex-shrink-0">
                    {isVideo ? (
                      <video src={url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    ) : (
                      <img src={url} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Arrows (desktop) */}
            {gallery.length > 1 && slideIdx > 0 && (
              <button
                onClick={() => setSlideIdx(i => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {gallery.length > 1 && slideIdx < gallery.length - 1 && (
              <button
                onClick={() => setSlideIdx(i => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Dots */}
            {gallery.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="px-5 pt-4 pb-2">
            <h2 className="font-display font-bold text-xl text-brand-dark mb-1">{getTranslation(product.name_i18n || product.name, lang)}</h2>
            <p className="text-sm text-brand-gray leading-relaxed mb-1">{getTranslation(product.description_i18n || product.description, lang)}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-2xl text-brand-red">{product.price}</span>
              <span className="text-sm font-semibold text-brand-red">{t('product.currency')}</span>
            </div>
          </div>

          {/* Option Groups */}
          {groups.length > 0 && (
            <div className="px-5 pb-4 space-y-4">
              {groups.map(group => (
                <div key={group.id}>
                  {/* Group Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-sm text-brand-dark">{group.name}</h3>
                    <span className="text-[10px] text-brand-gray font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                      {group.type === 'single'
                        ? 'Choisir 1'
                        : (group.max_selections && group.max_selections > 0)
                          ? `Jusqu'à ${group.max_selections} choix`
                          : 'Plusieurs choix'}
                      {group.required && ' • Obligatoire'}
                    </span>
                  </div>

                  {/* Option Items */}
                  <div className="space-y-1.5">
                    {(group.option_items || []).map(item => {
                      const selected = isOptionSelected(group, item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleOptionToggle(group, item)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                            selected
                              ? 'border-brand-red bg-red-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Checkbox / Radio indicator */}
                            <div
                              className={`w-5 h-5 flex items-center justify-center border-2 transition-all duration-200 ${
                                group.type === 'single' ? 'rounded-full' : 'rounded-md'
                              } ${
                                selected
                                  ? 'border-brand-red bg-brand-red'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${selected ? 'text-brand-dark' : 'text-gray-700'}`}>
                              {item.name}
                            </span>
                          </div>
                          {item.price_modifier > 0 && (
                            <span className="text-xs font-semibold text-brand-red">+{item.price_modifier} DA</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar: Quantity + Add to Cart (or Unavailable) */}
        <div className="border-t border-gray-100 px-5 py-3 bg-white">
          {product.is_available === false ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="text-sm font-semibold text-gray-500">{t('product.unavailableMessage')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-brand-dark hover:bg-gray-100 transition active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-8 text-center font-display font-bold text-sm text-brand-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-brand-dark hover:bg-gray-100 transition active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-brand-red hover:bg-brand-red-dark active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl shadow-btn transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t('detail.addToCart')} — {totalPrice} {t('product.currency')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
