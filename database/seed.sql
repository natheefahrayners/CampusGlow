-- CampusGlow Seed Data

USE campusglow;

-- Insert categories
INSERT INTO categories (category_id, name, icon, description) VALUES
(1, 'Stationery', '📚', 'Everything you need for studying, writing, and organizing.'),
(2, 'Homeware', '🏠', 'Stylish decor and essentials for dorms, bedrooms & shared spaces.'),
(3, 'Kitchenware', '🍳', 'Everything from cutlery to cleaning — your kitchen sorted.');

-- Insert subcategories
INSERT INTO subcategories (subcategory_id, category_id, name, icon) VALUES
(1, 1, 'Books & Notebooks', '📓'),
(2, 1, 'Pens & Markers', '🖊️'),
(3, 1, 'Pencil Cases', '🖍️'),
(4, 1, 'Desk Organizers', '🗂️'),
(5, 2, 'Dorm Decorations', '🪴'),
(6, 2, 'Bedroom Accessories', '🛏️'),
(7, 2, 'Dorm Accessories', '🪣'),
(8, 2, 'Electrical Appliances', '💡'),
(9, 3, 'Cutlery & Utensils', '🍴'),
(10, 3, 'Cleaning Supplies', '🧹'),
(11, 3, 'Pots & Pans', '🥘'),
(12, 3, 'Food Storage', '🫙'),
(13, 3, 'Cups & Plates', '🍽️');

-- Insert sample products
INSERT INTO products (product_id, category_id, subcategory_id, name, description, price, image, emoji, stock_status) VALUES
(1, 1, 1, 'A4 Hardcover Notebook', '200 pages, ruled, lay-flat binding.', 89.99, 'images/book2.jpg', '📓', 'in'),
(2, 1, 1, 'Spiral Sketchbook A3', '160gsm cartridge paper, 80 sheets.', 149.99, 'images/book3.jpg', '📔', 'low'),
(3, 1, 1, 'Spiral Notebook', '199 pages, ruled, soft-cover.', 59.99, 'images/book4.jpg', '📕', 'in'),
(4, 1, 1, 'Spiral Planner', 'Weekly layout, undated, compact.', 59.99, 'images/book5.jpg', '📕', 'in'),
(5, 1, 2, 'Ballpoint Pen Set (10)', 'Smooth-write, 9mm ball-point.', 49.99, 'images/pens12.jpg', '🖊️', 'in'),
(6, 1, 2, 'Fountain Pen — Black', 'Cartridge ink, stainless nib.', 199.99, 'images/pens11.jpg', '✒️', 'low'),
(7, 1, 2, 'Highlighter Set (8)', 'Pastel & bright, chisel tip.', 69.99, 'images/highlighter.jpg', '🖍️', 'in'),
(8, 1, 2, 'Marker Set (12)', 'Dual-tip, water-based ink.', 129.99, 'images/pens5.jpg', '🎨', 'in'),
(9, 1, 3, 'Canvas Roll Pencil Case', 'Rolling Pencil Holder, Holds up to 109 Pens.', 79.99, 'images/pencilcase1.jpg', '🎒', 'in'),
(10, 1, 3, 'Plain Black Pencil Case', 'Plain black Polyester Pencil Case.', 79.99, 'images/pencilcase2.jpg', '🎒', 'in'),
(11, 1, 4, 'Bamboo Desk Organizer', '6 compartments, eco material.', 219.99, 'images/organizer.jpg', '🗂️', 'low'),
(12, 1, 4, 'Sticky Note Set (400)', '5-piece, pastel/bright colors.', 39.99, 'images/stickynotes1.jpg', '📋', 'in'),
(13, 2, 5, 'Black/White Art Poster A2', 'Black/White Art Poster A2.', 129.99, 'images/poster2.jpg', '🖼️', 'in'),
(14, 2, 5, 'Mini Artificial Plant', '360° starry sky projection.', 349.99, 'images/plant1.jpg', '🌟', 'low'),
(15, 2, 6, 'Black/Grey Duvet Set', 'Single, 3-piece.', 499.99, 'images/bedset2.jpg', '🛏️', 'in'),
(16, 2, 6, 'Adhesive Round Mirror', 'Shatter-proof, peel & stick.', 159.99, 'images/mirror2.jpg', '🪞', 'in'),
(17, 2, 7, 'Laundry Basket', 'Pop-up, 45L, with handles.', 129.99, 'images/laundrybacket.jpg', '🧺', 'in'),
(18, 2, 8, 'LED Strip Lights (5m)', 'RGB, remote control, USB powered.', 199.99, 'images/LED.jpg', '💡', 'in'),
(19, 3, 9, '12-Piece Utensil Set', 'Stainless steel, dishwasher safe.', 249.99, 'images/utensils.jpg', '🍴', 'in'),
(20, 3, 10, 'Cellulose Sponges (6)', 'Heavy duty, no-scratch.', 39.99, 'images/sponge.jpg', '🧽', 'in'),
(21, 3, 11, 'Non-Stick Frying Pan Set (3)', 'Granite coating, induction ready.', 349.99, 'images/pans.jpg', '🥘', 'in'),
(22, 3, 12, 'Glass Jar Set (3)', 'Airtight Jars for Sugar, Coffee, Teabags', 189.99, 'images/jars.jpg', '🫙', 'in'),
(23, 3, 13, 'Coffee Mugs', '350ml ceramic mug, microwave & dishwasher safe, 6 colours.', 25.22, 'images/mugs2.jpg', '🍨', 'in');

-- Insert sample users (passwords are hashed versions of the passwords)
INSERT INTO users (user_id, first_name, last_name, email, password_hash, avatar, color, orders_count) VALUES
(1, 'Ayesha', 'Patel', 'ayesha@example.com', '$2b$10$rQZ8ZGQZQZQZQZQZQZQZQuZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '👩', '#1a4a3a', 4),
(2, 'Liam', 'Adams', 'liam@example.com', '$2b$10$rQZ8ZGQZQZQZQZQZQZQZQuZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '🧑', '#2e8b57', 2),
(3, 'Zoe', 'Van Der Berg', 'zoe@example.com', '$2b$10$rQZ8ZGQZQZQZQZQZQZQZQuZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '🌿', '#40916c', 7);
