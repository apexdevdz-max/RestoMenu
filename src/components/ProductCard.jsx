import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { getTranslation } from '../lib/getTranslation';

export default function ProductCard({ product, onOpenDetail }) {
  const { addItem, getProductCount } = useCart();
  const { t, i18n } = useTranslation();
  const [flashing, setFlashing] = useState(false);
  const cardRef = useRef(null);

  const qty = getProductCount(product.id);
  const unavailable = product.is_available === false;
  const lang = i18n.language?.slice(0, 2) || 'fr';

  const name = getTranslation(product.name_i18n || product.name, lang);
  const description = getTranslation(product.description_i18n || product.description, lang);

  // Quick-add: 1 unit, no options
  function handleQuickAdd(e) {
    e.stopPropagation();
    if (unavailable) return;
    addItem(product, 1, []);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 500);
  }

  return (
    <div
      ref={cardRef}
      className={`product-card bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 cursor-pointer ${
        unavailable ? 'opacity-60 grayscale' : 'hover:shadow-card-hover'
      } ${flashing ? 'flash-add' : ''}`}
      onClick={() => onOpenDetail(product)}
    >
      {/* Media Container */}
      <div className="relative bg-brand-card-bg aspect-[4/3] overflow-hidden">
        {(() => {
          const url = product.images?.[0] || product.image_url;
          const isVideo = url && (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) || url.includes('/video/upload/'));
          return isVideo ? (
            <video
              src={url}
              className="product-img w-full h-full object-cover transition-transform duration-500"
              autoPlay loop muted playsInline
            />
          ) : url ? (
            <img
              src={url}
              alt={name}
              className="product-img w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          );
        })()}

        {/* Unavailable badge */}
        {unavailable && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm z-10">
            {t('product.unavailable')}
          </div>
        )}

        {product.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            +{product.images.length - 1}
          </span>
        )}
        {qty > 0 && !unavailable && (
          <span className="absolute top-2 right-2 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center badge-animate">
            {qty}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 pb-3.5">
        <h3 className={`font-display font-bold text-sm leading-snug mb-1 line-clamp-2 ${unavailable ? 'text-gray-400' : 'text-brand-dark'}`}>
          {name}
        </h3>
        <p className={`text-[11px] leading-relaxed mb-3 line-clamp-3 ${unavailable ? 'text-gray-400' : 'text-brand-gray'}`}>
          {description}
        </p>

        {/* Price + Add */}
        <div className="flex items-end justify-between">
          <div>
            <span className={`font-display font-extrabold text-lg ${unavailable ? 'text-gray-400' : 'text-brand-red'}`}>{product.price}</span>
            <span className={`text-[11px] font-semibold ms-0.5 ${unavailable ? 'text-gray-400' : 'text-brand-red'}`}>{t('product.currency')}</span>
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={unavailable}
            className={`btn-plus relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              unavailable
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-brand-red hover:bg-brand-red-dark text-white shadow-btn active:scale-90'
            }`}
            aria-label={unavailable ? t('product.unavailable') : `${t('product.add')} ${name}`}
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
