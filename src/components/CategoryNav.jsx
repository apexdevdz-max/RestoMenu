import { useCategories } from '../hooks/useCategories';
import CategoryIcon from './CategoryIcon';

export default function CategoryNav({ activeCategoryId, onCategoryChange }) {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <nav className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="category-nav flex items-center gap-1 px-3 py-2.5 overflow-x-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton w-24 h-8 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto">
        <div className="category-nav flex items-center gap-1 px-3 py-2.5 overflow-x-auto">
          {/* TOUT (all) */}
          <button
            onClick={() => onCategoryChange(null)}
            className={`cat-btn flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategoryId === null ? 'cat-active' : 'text-brand-gray hover:bg-gray-100'
            }`}
          >
            <CategoryIcon name="LayoutGrid" className="w-4 h-4" />
            TOUT
          </button>

          {/* Dynamic categories */}
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`cat-btn flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategoryId === cat.id ? 'cat-active' : 'text-brand-gray hover:bg-gray-100'
              }`}
            >
              <CategoryIcon
                name={cat.icon_name}
                iconType={cat.icon_type}
                imageUrl={cat.image_url}
                className="w-4 h-4"
                active={activeCategoryId === cat.id}
              />
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
