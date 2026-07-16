import { useCategories } from '../hooks/useCategories';

// Fallback SVG icons by slug (used when icon_svg from DB fails)
const ICON_FALLBACKS = {
  burgers: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 13v-1c0-3.87-3.13-7-7-7h-6c-3.87 0-7 3.13-7 7v1H1v2h1.22c.54 1.95 2.32 3 4.28 3h11c1.96 0 3.74-1.05 4.28-3H23v-2h-1zM4 13v-1c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5v1H4zm0 4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1H4zM2 20h20v2H2z" />
    </svg>
  ),
  boissons: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6l1 7H8l1-7zm-1 7v11a2 2 0 002 2h4a2 2 0 002-2V9" />
    </svg>
  ),
  desserts: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm-5 6v1a5 5 0 0010 0v-1H7zm5-10v2m-4.5.5l1 1m7 0l1-1" />
    </svg>
  ),
};

const ALL_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

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
            {ALL_ICON}
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
              {ICON_FALLBACKS[cat.slug] || ALL_ICON}
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
