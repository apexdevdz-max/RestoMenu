/**
 * Fallback data used when Supabase is not configured.
 * Mirrors the seed data from 001_initial_schema.sql exactly.
 */

export const FALLBACK_CATEGORIES = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Burgers',
    slug: 'burgers',
    icon_svg: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 13v-1c0-3.87-3.13-7-7-7h-6c-3.87 0-7 3.13-7 7v1H1v2h1.22c.54 1.95 2.32 3 4.28 3h11c1.96 0 3.74-1.05 4.28-3H23v-2h-1zM4 13v-1c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5v1H4zm0 4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1H4zM2 20h20v2H2z"/></svg>',
    sort_order: 1,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Boissons',
    slug: 'boissons',
    icon_svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 2h6l1 7H8l1-7zm-1 7v11a2 2 0 002 2h4a2 2 0 002-2V9"/></svg>',
    sort_order: 2,
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Desserts',
    slug: 'desserts',
    icon_svg: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm-5 6v1a5 5 0 0010 0v-1H7zm5-10v2m-4.5.5l1 1m7 0l1-1"/></svg>',
    sort_order: 3,
  },
];

export const FALLBACK_PRODUCTS = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    category_id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Le Grand Burger Double',
    description: 'Double steak haché, cheddar, salade, tomate, oignons, sauce maison.',
    price: 1200,
    image_url: '/images/burger_double.png',
    is_available: true,
    sort_order: 1,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000001',
        name: 'Suppléments',
        type: 'multi',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-1', name: 'Extra fromage', price_modifier: 100, sort_order: 1 },
          { id: 'oi-2', name: 'Double viande', price_modifier: 200, sort_order: 2 },
          { id: 'oi-3', name: 'Bacon', price_modifier: 150, sort_order: 3 },
          { id: 'oi-4', name: 'Oeuf', price_modifier: 50, sort_order: 4 },
        ],
      },
      {
        id: 'c1000000-0000-0000-0000-000000000002',
        name: 'Retirer',
        type: 'multi',
        required: false,
        sort_order: 2,
        option_items: [
          { id: 'oi-5', name: 'Sans oignons', price_modifier: 0, sort_order: 1 },
          { id: 'oi-6', name: 'Sans tomate', price_modifier: 0, sort_order: 2 },
          { id: 'oi-7', name: 'Sans salade', price_modifier: 0, sort_order: 3 },
          { id: 'oi-8', name: 'Sans sauce', price_modifier: 0, sort_order: 4 },
        ],
      },
      {
        id: 'c1000000-0000-0000-0000-000000000003',
        name: 'Sauce',
        type: 'single',
        required: false,
        sort_order: 3,
        option_items: [
          { id: 'oi-9', name: 'Sauce maison', price_modifier: 0, sort_order: 1 },
          { id: 'oi-10', name: 'Ketchup', price_modifier: 0, sort_order: 2 },
          { id: 'oi-11', name: 'Mayonnaise', price_modifier: 0, sort_order: 3 },
          { id: 'oi-12', name: 'Moutarde', price_modifier: 0, sort_order: 4 },
          { id: 'oi-13', name: 'Algérienne', price_modifier: 0, sort_order: 5 },
        ],
      },
    ],
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    category_id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Pizza Tunisienne',
    description: 'Sauce tomate, thon, poivrons, olives noires, oignons, fromage mozzarella.',
    price: 1100,
    image_url: '/images/pizza_tunisienne.png',
    is_available: true,
    sort_order: 2,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000004',
        name: 'Suppléments',
        type: 'multi',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-14', name: 'Double fromage', price_modifier: 150, sort_order: 1 },
          { id: 'oi-15', name: 'Supplément thon', price_modifier: 200, sort_order: 2 },
          { id: 'oi-16', name: 'Oeuf', price_modifier: 50, sort_order: 3 },
        ],
      },
      {
        id: 'c1000000-0000-0000-0000-000000000005',
        name: 'Retirer',
        type: 'multi',
        required: false,
        sort_order: 2,
        option_items: [
          { id: 'oi-17', name: 'Sans olives', price_modifier: 0, sort_order: 1 },
          { id: 'oi-18', name: 'Sans oignons', price_modifier: 0, sort_order: 2 },
          { id: 'oi-19', name: 'Sans poivrons', price_modifier: 0, sort_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    category_id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Chicken Burger',
    description: 'Poulet croustillant, laitue, tomate, cornichons, sauce crémeuse.',
    price: 900,
    image_url: '/images/chicken_burger.png',
    is_available: true,
    sort_order: 3,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000006',
        name: 'Suppléments',
        type: 'multi',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-20', name: 'Extra fromage', price_modifier: 100, sort_order: 1 },
          { id: 'oi-21', name: 'Bacon', price_modifier: 150, sort_order: 2 },
          { id: 'oi-22', name: 'Oeuf', price_modifier: 50, sort_order: 3 },
        ],
      },
      {
        id: 'c1000000-0000-0000-0000-000000000007',
        name: 'Retirer',
        type: 'multi',
        required: false,
        sort_order: 2,
        option_items: [
          { id: 'oi-23', name: 'Sans cornichons', price_modifier: 0, sort_order: 1 },
          { id: 'oi-24', name: 'Sans tomate', price_modifier: 0, sort_order: 2 },
          { id: 'oi-25', name: 'Sans sauce', price_modifier: 0, sort_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    category_id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Pizza Margherita',
    description: "Sauce tomate, mozzarella fraîche, basilic, huile d'olive.",
    price: 950,
    image_url: '/images/pizza_tunisienne.png',
    is_available: true,
    sort_order: 4,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000008',
        name: 'Suppléments',
        type: 'multi',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-26', name: 'Double mozzarella', price_modifier: 150, sort_order: 1 },
          { id: 'oi-27', name: 'Supplément basilic', price_modifier: 0, sort_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'b1000000-0000-0000-0000-000000000005',
    category_id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Selecto',
    description: 'Boisson gazeuse aux extraits de fruits, 33cl.',
    price: 200,
    image_url: '/images/selecto_drink.png',
    is_available: true,
    sort_order: 1,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000009',
        name: 'Taille',
        type: 'single',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-28', name: '33cl', price_modifier: 0, sort_order: 1 },
          { id: 'oi-29', name: '1L', price_modifier: 150, sort_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'b1000000-0000-0000-0000-000000000006',
    category_id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Tiramisu Maison',
    description: 'Mascarpone onctueux, biscuits imbibés de café, cacao.',
    price: 500,
    image_url: '/images/tiramisu_dessert.png',
    is_available: true,
    sort_order: 1,
    option_groups: [
      {
        id: 'c1000000-0000-0000-0000-000000000010',
        name: 'Suppléments',
        type: 'multi',
        required: false,
        sort_order: 1,
        option_items: [
          { id: 'oi-30', name: 'Chantilly', price_modifier: 50, sort_order: 1 },
          { id: 'oi-31', name: 'Double cacao', price_modifier: 30, sort_order: 2 },
          { id: 'oi-32', name: 'Supplément café', price_modifier: 40, sort_order: 3 },
        ],
      },
    ],
  },
];
