-- ============================================
-- El-Mawid Restaurant Ordering System
-- Initial Schema + Seed Data
-- ============================================

-- ===================== TABLES =====================

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_svg TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INT NOT NULL,  -- in DA (Dinar Algérien)
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Option Groups (e.g. "Suppléments", "Retirer", "Taille")
CREATE TABLE option_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'multi' CHECK (type IN ('single', 'multi')),
  required BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Option Items (e.g. "Extra fromage +100 DA", "Sans oignons")
CREATE TABLE option_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INT NOT NULL,
  customer_name TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  total INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL,
  subtotal INT NOT NULL
);

-- Order Item Options
CREATE TABLE order_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL,
  price_modifier INT DEFAULT 0
);

-- ===================== INDEXES =====================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_option_groups_product ON option_groups(product_id);
CREATE INDEX idx_option_items_group ON option_items(group_id);
CREATE INDEX idx_orders_table ON orders(table_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_item_options_item ON order_item_options(order_item_id);

-- ===================== RLS POLICIES =====================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;

-- Public read access for menu data
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read option_groups" ON option_groups FOR SELECT USING (true);
CREATE POLICY "Public read option_items" ON option_items FOR SELECT USING (true);

-- Public insert for orders (customers can create orders)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);

CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

CREATE POLICY "Public insert order_item_options" ON order_item_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order_item_options" ON order_item_options FOR SELECT USING (true);


-- ===================== SEED DATA =====================

-- Categories
INSERT INTO categories (id, name, slug, icon_svg, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Burgers', 'burgers', '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 13v-1c0-3.87-3.13-7-7-7h-6c-3.87 0-7 3.13-7 7v1H1v2h1.22c.54 1.95 2.32 3 4.28 3h11c1.96 0 3.74-1.05 4.28-3H23v-2h-1zM4 13v-1c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5v1H4zm0 4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1H4zM2 20h20v2H2z"/></svg>', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Boissons', 'boissons', '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 2h6l1 7H8l1-7zm-1 7v11a2 2 0 002 2h4a2 2 0 002-2V9"/></svg>', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Desserts', 'desserts', '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm-5 6v1a5 5 0 0010 0v-1H7zm5-10v2m-4.5.5l1 1m7 0l1-1"/></svg>', 3);

-- Products
INSERT INTO products (id, category_id, name, description, price, image_url, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Le Grand Burger Double', 'Double steak haché, cheddar, salade, tomate, oignons, sauce maison.', 1200, '/images/burger_double.png', 1),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Pizza Tunisienne', 'Sauce tomate, thon, poivrons, olives noires, oignons, fromage mozzarella.', 1100, '/images/pizza_tunisienne.png', 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Chicken Burger', 'Poulet croustillant, laitue, tomate, cornichons, sauce crémeuse.', 900, '/images/chicken_burger.png', 3),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Pizza Margherita', 'Sauce tomate, mozzarella fraîche, basilic, huile d''olive.', 950, '/images/pizza_tunisienne.png', 4),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Selecto', 'Boisson gazeuse aux extraits de fruits, 33cl.', 200, '/images/selecto_drink.png', 1),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Tiramisu Maison', 'Mascarpone onctueux, biscuits imbibés de café, cacao.', 500, '/images/tiramisu_dessert.png', 1);

-- Option Groups for Burgers
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Suppléments', 'multi', false, 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Retirer', 'multi', false, 2),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Sauce', 'single', false, 3);

-- Option Groups for Pizza Tunisienne
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Suppléments', 'multi', false, 1),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Retirer', 'multi', false, 2);

-- Option Groups for Chicken Burger
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', 'Suppléments', 'multi', false, 1),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'Retirer', 'multi', false, 2);

-- Option Groups for Pizza Margherita
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000004', 'Suppléments', 'multi', false, 1);

-- Option Groups for Selecto
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000005', 'Taille', 'single', false, 1);

-- Option Groups for Tiramisu
INSERT INTO option_groups (id, product_id, name, type, required, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000006', 'Suppléments', 'multi', false, 1);

-- Option Items for Le Grand Burger Double - Suppléments
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Extra fromage', 100, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Double viande', 200, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Bacon', 150, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Oeuf', 50, 4);

-- Option Items for Le Grand Burger Double - Retirer
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000002', 'Sans oignons', 0, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Sans tomate', 0, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Sans salade', 0, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Sans sauce', 0, 4);

-- Option Items for Le Grand Burger Double - Sauce
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000003', 'Sauce maison', 0, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Ketchup', 0, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Mayonnaise', 0, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Moutarde', 0, 4),
  ('c1000000-0000-0000-0000-000000000003', 'Algérienne', 0, 5);

-- Option Items for Pizza Tunisienne - Suppléments
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000004', 'Double fromage', 150, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Supplément thon', 200, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Oeuf', 50, 3);

-- Option Items for Pizza Tunisienne - Retirer
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000005', 'Sans olives', 0, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Sans oignons', 0, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Sans poivrons', 0, 3);

-- Option Items for Chicken Burger - Suppléments
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000006', 'Extra fromage', 100, 1),
  ('c1000000-0000-0000-0000-000000000006', 'Bacon', 150, 2),
  ('c1000000-0000-0000-0000-000000000006', 'Oeuf', 50, 3);

-- Option Items for Chicken Burger - Retirer
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000007', 'Sans cornichons', 0, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Sans tomate', 0, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Sans sauce', 0, 3);

-- Option Items for Pizza Margherita - Suppléments
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000008', 'Double mozzarella', 150, 1),
  ('c1000000-0000-0000-0000-000000000008', 'Supplément basilic', 0, 2);

-- Option Items for Selecto - Taille
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000009', '33cl', 0, 1),
  ('c1000000-0000-0000-0000-000000000009', '1L', 150, 2);

-- Option Items for Tiramisu - Suppléments
INSERT INTO option_items (group_id, name, price_modifier, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000010', 'Chantilly', 50, 1),
  ('c1000000-0000-0000-0000-000000000010', 'Double cacao', 30, 2),
  ('c1000000-0000-0000-0000-000000000010', 'Supplément café', 40, 3);
