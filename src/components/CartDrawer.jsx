import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center ${isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Drawer */}
      <div
        className={`relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl ${
          isClosing ? 'animate-[sheetDown_0.3s_ease-out_forwards]' : 'animate-[sheetUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]'
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="font-display font-bold text-lg text-brand-dark">
              Mon Panier ({totalItems})
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm text-brand-gray font-medium">Votre panier est vide</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartItemId} className="flex gap-3 bg-brand-gray-light rounded-xl p-3">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-brand-card-bg flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-semibold text-sm text-brand-dark line-clamp-1">{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 transition"
                    >
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Selected options */}
                  {item.selectedOptions.length > 0 && (
                    <p className="text-[10px] text-brand-gray mt-0.5 line-clamp-1">
                      {item.selectedOptions.map(o => o.name).join(', ')}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-gray-100 transition"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-6 text-center font-display font-bold text-xs text-brand-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-gray-100 transition"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="font-display font-bold text-sm text-brand-red">{item.lineTotal} DA</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-3 space-y-3 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm text-brand-dark">Total</span>
              <span className="font-display font-bold text-xl text-brand-red">{totalPrice} DA</span>
            </div>

            {/* Checkout */}
            <button
              onClick={() => {
                handleClose();
                setTimeout(onCheckout, 350);
              }}
              className="w-full bg-brand-red hover:bg-brand-red-dark active:scale-[0.98] text-white font-bold text-sm py-3.5 rounded-xl shadow-btn transition-all duration-200"
            >
              VALIDER LA COMMANDE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
