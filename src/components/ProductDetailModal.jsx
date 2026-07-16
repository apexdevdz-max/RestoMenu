import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, open, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product && open) {
      setQuantity(1);
      setSelectedOptions({});
      setIsClosing(false);
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

      if (group.type === 'single') {
        // Radio behavior: select one or deselect
        if (next[group.id]?.id === item.id) {
          delete next[group.id];
        } else {
          next[group.id] = item;
        }
      } else {
        // Checkbox behavior
        const current = next[group.id] || [];
        const exists = current.find(o => o.id === item.id);
        if (exists) {
          next[group.id] = current.filter(o => o.id !== item.id);
          if (next[group.id].length === 0) delete next[group.id];
        } else {
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
          {/* Product Media */}
          <div className="bg-brand-card-bg aspect-[16/10] overflow-hidden">
            {product.media_type === 'video' ? (
              <video
                src={product.image_url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="px-5 pt-4 pb-2">
            <h2 className="font-display font-bold text-xl text-brand-dark mb-1">{product.name}</h2>
            <p className="text-sm text-brand-gray leading-relaxed mb-1">{product.description}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-2xl text-brand-red">{product.price}</span>
              <span className="text-sm font-semibold text-brand-red">DA</span>
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
                      {group.type === 'single' ? 'Choisir 1' : 'Plusieurs choix'}
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

        {/* Bottom Bar: Quantity + Add to Cart */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-3 bg-white">
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
            Ajouter — {totalPrice} DA
          </button>
        </div>
      </div>
    </div>
  );
}
