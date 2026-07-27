/**
 * CategoryIcon — renders a culinary SVG icon by name.
 * Pure SVG, zero external dependencies.
 *
 * Usage: <CategoryIcon name="Pizza" className="w-4 h-4" />
 */

const ICONS = {
  // ── Default (4 squares grid) ──
  LayoutGrid: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  ),

  // ── Utensils (fork + knife) ──
  Utensils: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path strokeLinecap="round" d="M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </>
  ),

  // ── Pizza ──
  Pizza: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11h.01M11 15h.01M16 16h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 16.5A10.5 10.5 0 0112 2a10.5 10.5 0 0110 14.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 16.5l10 5.5 10-5.5L12 2z" />
    </>
  ),

  // ── Sandwich / Burger ──
  Sandwich: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18M3 17h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l1.5 2.5h15L21 17" />
    </>
  ),

  // ── Coffee ──
  Coffee: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h1a4 4 0 110 8h-1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      <path strokeLinecap="round" d="M6 2v3M10 2v3M14 2v3" />
    </>
  ),

  // ── IceCream / Dessert ──
  IceCream: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17l-2 5h4l-2-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V9a4 4 0 118 0v2" />
    </>
  ),

  // ── Flame / Grill ──
  Flame: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 2-6.5 0 3.5 2.5 4 3.5 7.5.67 2.33 0 4.5-2.5 6a2.5 2.5 0 01-4.5-1.5z" />
  ),

  // ── Beer / Drink ──
  Beer: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 11h1a3 3 0 010 6h-1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 11h12v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z" />
      <path strokeLinecap="round" d="M9 7V5m3 2V4m3 3V5" />
    </>
  ),

  // ── Soup ──
  Soup: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a8 8 0 01-8 8h16a8 8 0 01-8-8z" />
      <path strokeLinecap="round" d="M12 4v4M8 5v3M16 5v3" />
    </>
  ),

  // ── Fish ──
  Fish: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 12c4-5 9-5 14-1-5 4-10 4-14-1z" />
      <path strokeLinecap="round" d="M3.5 12l-1-2m1 2l-1 2M16 10.5h.01" />
    </>
  ),

  // ── Salad / Leaf ──
  Salad: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 7 20 7s2.1 4.5.1 10.1A7 7 0 0111 20z" />
      <path strokeLinecap="round" d="M11 20V7" />
      <path strokeLinecap="round" d="M4 14a5 5 0 017-4.5" />
    </>
  ),

  // ── Beef / Steak ──
  Beef: (
    <>
      <circle cx="12.5" cy="8.5" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 2C6.5 2 2 6.5 2 11c0 .9.2 1.8.5 2.6C4 17 7.5 19 12 22c4.5-3 8-5 9.5-8.4.3-.8.5-1.7.5-2.6 0-4.5-4.5-9-9.5-9z" />
    </>
  ),

  // ── Cake ──
  Cake: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1.5-2 4-2 4.5 2 8 2 4-2 4-2" />
      <path strokeLinecap="round" d="M2 21h20M12 7V4m-2 3h4a2 2 0 012 2v2H8V9a2 2 0 012-2z" />
    </>
  ),

  // ── Egg / Breakfast ──
  Egg: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c6.23-.05 7.87-5.57 7.5-9-.36-3.34-3.26-11-7.5-11S5.36 9.66 5 13c-.37 3.43 1.27 8.95 7 9z" />
  ),

  // ── Bottle / Wine ──
  Wine: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 22h8M7 10h10M12 15v7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6l1 8a5 5 0 01-8 0l1-8z" />
    </>
  ),
};

// Icon name labels in French for the picker
export const ICON_OPTIONS = [
  { name: 'LayoutGrid', label: 'Par défaut' },
  { name: 'Utensils', label: 'Couverts' },
  { name: 'Sandwich', label: 'Burger' },
  { name: 'Pizza', label: 'Pizza' },
  { name: 'Coffee', label: 'Café' },
  { name: 'Beer', label: 'Boisson' },
  { name: 'IceCream', label: 'Dessert' },
  { name: 'Cake', label: 'Gâteau' },
  { name: 'Flame', label: 'Grillades' },
  { name: 'Soup', label: 'Soupe' },
  { name: 'Fish', label: 'Poisson' },
  { name: 'Salad', label: 'Salade' },
  { name: 'Beef', label: 'Viande' },
  { name: 'Egg', label: 'Petit-déj' },
  { name: 'Wine', label: 'Vin' },
];

export default function CategoryIcon({ name, iconType, imageUrl, className = 'w-4 h-4', active = false }) {
  // Image mode: render a round <img>
  if (iconType === 'image' && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={`w-5 h-5 min-w-[20px] rounded-full object-cover shadow-sm flex-shrink-0 ${active ? 'ring-1 ring-white/50' : ''}`}
      />
    );
  }

  // Lucide mode (default): render SVG paths
  const paths = ICONS[name] || ICONS.LayoutGrid;
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      {paths}
    </svg>
  );
}
