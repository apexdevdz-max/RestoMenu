import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOpenDetail }) {
  const { addItem, getProductCount } = useCart();
  const [flashing, setFlashing] = useState(false);
  const cardRef = useRef(null);

  const qty = getProductCount(product.id);

  // Quick-add: 1 unit, no options
  function handleQuickAdd(e) {
    e.stopPropagation();
    addItem(product, 1, []);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 500);
  }

  return (
    <div
      ref={cardRef}
      className={`product-card bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover cursor-pointer ${flashing ? 'flash-add' : ''}`}
      onClick={() => onOpenDetail(product)}
    >
      {/* Media Container */}
      <div className="relative bg-brand-card-bg aspect-[4/3] overflow-hidden">
        {product.media_type === 'video' ? (
          <video
            src={product.image_url}
            className="product-img w-full h-full object-cover transition-transform duration-500"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />
        )}
        {qty > 0 && (
          <span className="absolute top-2 right-2 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center badge-animate">
            {qty}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 pb-3.5">
        <h3 className="font-display font-bold text-sm leading-snug text-brand-dark mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[11px] leading-relaxed text-brand-gray mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Price + Add */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display font-extrabold text-lg text-brand-red">{product.price}</span>
            <span className="text-[11px] font-semibold text-brand-red ml-0.5">DA</span>
          </div>
          <button
            onClick={handleQuickAdd}
            className="btn-plus relative w-9 h-9 bg-brand-red hover:bg-brand-red-dark text-white rounded-full flex items-center justify-center shadow-btn transition-all duration-200 active:scale-90"
            aria-label={`Ajouter ${product.name}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
