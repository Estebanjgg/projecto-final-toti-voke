-- =====================================================
-- MIGRACIÓN COMPLETA A SUPABASE
-- Script SQL para crear tablas e insertar datos
-- =====================================================

-- Eliminar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =====================================================
-- CREAR TABLA CATEGORIES
-- =====================================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREAR TABLA PRODUCTS
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  original_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  discount INTEGER DEFAULT 0,
  installments JSONB,
  image TEXT,
  description TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  condition VARCHAR(50) DEFAULT 'new',
  warranty VARCHAR(100),
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREAR ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(current_price);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_offer ON products(is_offer);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_products_condition ON products(condition);

-- =====================================================
-- INSERTAR CATEGORÍAS BÁSICAS
-- =====================================================
INSERT INTO categories (name, description) VALUES
('Electrónicos', 'Dispositivos electrónicos y tecnología'),
('Tablet', 'Tablets y dispositivos móviles'),
('Smartphone', 'Teléfonos inteligentes'),
('Notebook', 'Computadoras portátiles'),
('Hogar', 'Artículos para el hogar y decoración'),
('Ropa', 'Vestimenta y accesorios'),
('Deportes', 'Artículos deportivos y fitness'),
('Libros', 'Libros y material de lectura'),
('Juguetes', 'Juguetes y entretenimiento');

-- =====================================================
-- INSERTAR PRODUCTOS (MIGRACIÓN DE DATOS)
-- =====================================================

-- Producto 1: Apple iPad
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Apple iPad A A2429 32GB - Cinza Espacial',
  'Apple',
  'Tablet',
  1799.99,
  1547.55,
  14,
  '{"times": "10x", "value": "154,76"}',
  '/api/placeholder/200/200',
  'iPad Apple com tela de 10.2 polegadas, processador A10 Fusion e 32GB de armazenamento.',
  15,
  true,
  true,
  true,
  false,
  'Seminovo',
  '90 días',
  '{"tela": "10.2 polegadas", "processador": "A10 Fusion", "armazenamento": "32GB", "cor": "Cinza Espacial"}'
);

-- Produto 2: Samsung Galaxy S21
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Samsung Galaxy S21 128GB - Phantom Gray',
  'Samsung',
  'Smartphone',
  2499.99,
  1999.99,
  20,
  '{"times": "12x", "value": "166,67"}',
  '/api/placeholder/200/200',
  'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, câmera tripla e tela Dynamic AMOLED.',
  25,
  true,
  true,
  true,
  true,
  'Novo',
  '1 ano',
  '{"tela": "6.2 polegadas", "processador": "Exynos 2100", "armazenamento": "128GB", "camera": "64MP + 12MP + 12MP"}'
);

-- Produto 3: MacBook Air M1
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'MacBook Air M1 256GB - Prata',
  'Apple',
  'Notebook',
  7999.99,
  6999.99,
  13,
  '{"times": "12x", "value": "583,33"}',
  '/api/placeholder/200/200',
  'MacBook Air com chip M1, 8GB de RAM e 256GB de SSD. Performance excepcional e bateria de longa duração.',
  8,
  true,
  true,
  true,
  true,
  'Novo',
  '1 ano',
  '{"processador": "Apple M1", "memoria": "8GB", "armazenamento": "256GB SSD", "tela": "13.3 polegadas"}'
);

-- Produto 4: iPhone 13
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'iPhone 13 128GB - Azul',
  'Apple',
  'Smartphone',
  4999.99,
  4299.99,
  14,
  '{"times": "12x", "value": "358,33"}',
  '/api/placeholder/200/200',
  'iPhone 13 com chip A15 Bionic, sistema de câmera dupla avançado e tela Super Retina XDR.',
  20,
  true,
  true,
  true,
  true,
  'Novo',
  '1 ano',
  '{"processador": "A15 Bionic", "armazenamento": "128GB", "camera": "12MP dupla", "tela": "6.1 polegadas"}'
);

-- Produto 5: Dell Inspiron 15
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Notebook Dell Inspiron 15 3000 - Intel i5',
  'Dell',
  'Notebook',
  2899.99,
  2499.99,
  14,
  '{"times": "10x", "value": "250,00"}',
  '/api/placeholder/200/200',
  'Notebook Dell Inspiron com processador Intel Core i5, 8GB RAM e 256GB SSD.',
  12,
  true,
  false,
  true,
  false,
  'Novo',
  '1 ano',
  '{"processador": "Intel Core i5", "memoria": "8GB", "armazenamento": "256GB SSD", "tela": "15.6 polegadas"}'
);

-- Produto 6: Samsung Galaxy Tab S7
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Samsung Galaxy Tab S7 128GB - Mystic Black',
  'Samsung',
  'Tablet',
  2199.99,
  1899.99,
  14,
  '{"times": "10x", "value": "190,00"}',
  '/api/placeholder/200/200',
  'Tablet Samsung Galaxy Tab S7 com S Pen incluída, tela de 11 polegadas e 128GB de armazenamento.',
  18,
  true,
  true,
  true,
  false,
  'Novo',
  '1 ano',
  '{"tela": "11 polegadas", "processador": "Snapdragon 865+", "armazenamento": "128GB", "acessorios": "S Pen incluída"}'
);

-- Produto 7: Xiaomi Redmi Note 11
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Xiaomi Redmi Note 11 128GB - Graphite Gray',
  'Xiaomi',
  'Smartphone',
  1299.99,
  999.99,
  23,
  '{"times": "10x", "value": "100,00"}',
  '/api/placeholder/200/200',
  'Smartphone Xiaomi Redmi Note 11 com câmera quádrupla de 50MP e bateria de 5000mAh.',
  30,
  true,
  false,
  true,
  true,
  'Novo',
  '1 ano',
  '{"camera": "50MP quádrupla", "bateria": "5000mAh", "armazenamento": "128GB", "tela": "6.43 polegadas"}'
);

-- Produto 8: Lenovo IdeaPad 3
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES (
  'Notebook Lenovo IdeaPad 3 - AMD Ryzen 5',
  'Lenovo',
  'Notebook',
  2599.99,
  2199.99,
  15,
  '{"times": "12x", "value": "183,33"}',
  '/api/placeholder/200/200',
  'Notebook Lenovo IdeaPad 3 com processador AMD Ryzen 5, 8GB RAM e 512GB SSD.',
  10,
  true,
  false,
  true,
  false,
  'Novo',
  '1 ano',
  '{"processador": "AMD Ryzen 5", "memoria": "8GB", "armazenamento": "512GB SSD", "tela": "15.6 polegadas"}'
);

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================

-- Contar produtos por categoria
SELECT category, COUNT(*) as total_produtos
FROM products 
WHERE is_active = true
GROUP BY category
ORDER BY total_produtos DESC;

-- Contar produtos em oferta
SELECT COUNT(*) as produtos_em_oferta
FROM products 
WHERE is_offer = true AND is_active = true;

-- Contar produtos em destaque
SELECT COUNT(*) as produtos_em_destaque
FROM products 
WHERE is_featured = true AND is_active = true;

-- Verificar total de produtos
SELECT COUNT(*) as total_produtos
FROM products 
WHERE is_active = true;

-- =====================================================
-- SCRIPT COMPLETO - PRONTO PARA EXECUTAR
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Copie todo este script
-- 2. Vá para Supabase Dashboard > SQL Editor
-- 3. Cole o script completo
-- 4. Execute o script
-- 5. Verifique os resultados das consultas no final
-- 
-- =====================================================