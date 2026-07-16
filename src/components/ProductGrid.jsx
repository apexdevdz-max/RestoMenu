import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

export default function ProductGrid({ categoryId, onOpenDetail }) {
  const { products, loading } = useProducts(categoryId);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="skeleton aspect-[4/3]" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
              <div className="flex justify-between items-end pt-1">
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-9 w-9 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-sm text-brand-gray font-medium">Aucun produit disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="opacity-0 translate-y-4 animate-[fadeInUp_0.4s_ease-out_forwards]"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ProductCard product={product} onOpenDetail={onOpenDetail} />
        </div>
      ))}

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
