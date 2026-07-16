import { useCart } from '../context/CartContext';

export default function CartBar({ onCartClick, onCheckout }) {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-bottom cart-bar-animate">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Cart Info (clickable to open drawer) */}
        <button
          onClick={onCartClick}
          className="flex items-center gap-3 min-w-0 group"
        >
          {/* Bag Icon */}
          <div className="relative flex-shrink-0">
            <svg className="w-7 h-7 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center badge-animate">
              {totalItems}
            </span>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-brand-dark truncate group-hover:text-brand-red transition">
              Mon Panier: {totalItems} article{totalItems > 1 ? 's' : ''}
            </p>
            <p className="text-sm font-bold text-brand-red">({totalPrice} DA)</p>
          </div>
        </button>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="flex-shrink-0 bg-brand-red hover:bg-brand-red-dark active:scale-95 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-btn transition-all duration-200 whitespace-nowrap"
        >
          VALIDER LA COMMANDE
        </button>
      </div>
    </div>
  );
}
