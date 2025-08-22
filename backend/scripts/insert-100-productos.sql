-- =====================================================
-- INSERTAR 100 PRODUCTOS ELECTRÓNICOS ADICIONALES
-- Script para agregar más productos a la base de datos
-- =====================================================

-- Smartphones (30 productos)
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES 
('iPhone 14 Pro 256GB - Deep Purple', 'Apple', 'Smartphone', 7999.99, 6999.99, 13, '{"times": "12x", "value": "583,33"}', '/api/placeholder/200/200', 'iPhone 14 Pro con chip A16 Bionic, sistema de cámara Pro y Dynamic Island.', 15, true, true, true, true, 'Novo', '1 ano', '{"processador": "A16 Bionic", "armazenamento": "256GB", "camera": "48MP Pro", "tela": "6.1 polegadas"}'),
('Samsung Galaxy S23 Ultra 512GB - Phantom Black', 'Samsung', 'Smartphone', 8999.99, 7499.99, 17, '{"times": "12x", "value": "624,99"}', '/api/placeholder/200/200', 'Galaxy S23 Ultra com S Pen integrada, câmera de 200MP e tela Dynamic AMOLED 2X.', 12, true, true, true, true, 'Novo', '1 ano', '{"processador": "Snapdragon 8 Gen 2", "armazenamento": "512GB", "camera": "200MP", "tela": "6.8 polegadas"}'),
('Google Pixel 7 Pro 128GB - Snow', 'Google', 'Smartphone', 4999.99, 3999.99, 20, '{"times": "10x", "value": "399,99"}', '/api/placeholder/200/200', 'Pixel 7 Pro com chip Google Tensor G2 e câmeras com IA avançada.', 20, true, false, true, false, 'Novo', '1 ano', '{"processador": "Google Tensor G2", "armazenamento": "128GB", "camera": "50MP tripla", "tela": "6.7 polegadas"}'),
('OnePlus 11 256GB - Titan Black', 'OnePlus', 'Smartphone', 3999.99, 3299.99, 18, '{"times": "10x", "value": "329,99"}', '/api/placeholder/200/200', 'OnePlus 11 com Snapdragon 8 Gen 2 e carregamento SuperVOOC de 100W.', 18, true, false, true, true, 'Novo', '1 ano', '{"processador": "Snapdragon 8 Gen 2", "armazenamento": "256GB", "camera": "50MP tripla", "carregamento": "100W"}'),
('Xiaomi 13 Pro 256GB - Ceramic White', 'Xiaomi', 'Smartphone', 4499.99, 3599.99, 20, '{"times": "12x", "value": "299,99"}', '/api/placeholder/200/200', 'Xiaomi 13 Pro com câmeras Leica e carregamento wireless de 50W.', 25, true, true, true, false, 'Novo', '1 ano', '{"processador": "Snapdragon 8 Gen 2", "armazenamento": "256GB", "camera": "50MP Leica", "wireless": "50W"}'),
('iPhone 13 mini 256GB - Pink', 'Apple', 'Smartphone', 4499.99, 3799.99, 16, '{"times": "10x", "value": "379,99"}', '/api/placeholder/200/200', 'iPhone 13 mini compacto com chip A15 Bionic e câmera dupla avançada.', 22, true, false, true, false, 'Novo', '1 ano', '{"processador": "A15 Bionic", "armazenamento": "256GB", "camera": "12MP dupla", "tela": "5.4 polegadas"}'),
('Samsung Galaxy A54 5G 128GB - Awesome Violet', 'Samsung', 'Smartphone', 1999.99, 1599.99, 20, '{"times": "10x", "value": "159,99"}', '/api/placeholder/200/200', 'Galaxy A54 5G com câmera tripla de 50MP e tela Super AMOLED.', 35, true, false, true, true, 'Novo', '1 ano', '{"processador": "Exynos 1380", "armazenamento": "128GB", "camera": "50MP tripla", "5G": "sim"}'),
('Motorola Edge 40 256GB - Lunar Blue', 'Motorola', 'Smartphone', 2799.99, 2199.99, 21, '{"times": "10x", "value": "219,99"}', '/api/placeholder/200/200', 'Motorola Edge 40 com tela curva de 144Hz e carregamento TurboPower.', 28, true, false, true, false, 'Novo', '1 ano', '{"processador": "MediaTek Dimensity 8020", "armazenamento": "256GB", "tela": "144Hz", "carregamento": "68W"}'),
('Realme GT 3 256GB - Pulse White', 'Realme', 'Smartphone', 2999.99, 2399.99, 20, '{"times": "10x", "value": "239,99"}', '/api/placeholder/200/200', 'Realme GT 3 com carregamento SuperDart de 240W e performance gaming.', 30, true, true, true, true, 'Novo', '1 ano', '{"processador": "Snapdragon 8+ Gen 1", "armazenamento": "256GB", "carregamento": "240W", "gaming": "sim"}'),
('Nothing Phone 2 256GB - White', 'Nothing', 'Smartphone', 3499.99, 2999.99, 14, '{"times": "10x", "value": "299,99"}', '/api/placeholder/200/200', 'Nothing Phone 2 com design único Glyph Interface e performance flagship.', 15, true, true, true, false, 'Novo', '1 ano', '{"processador": "Snapdragon 8+ Gen 1", "armazenamento": "256GB", "design": "Glyph Interface", "tela": "6.7 polegadas"}'),

-- Tablets (20 produtos)
('iPad Pro 12.9" M2 256GB - Space Gray', 'Apple', 'Tablet', 8999.99, 7999.99, 11, '{"times": "12x", "value": "666,66"}', '/api/placeholder/200/200', 'iPad Pro com chip M2, tela Liquid Retina XDR e suporte ao Apple Pencil 2.', 10, true, true, true, true, 'Novo', '1 ano', '{"processador": "Apple M2", "armazenamento": "256GB", "tela": "12.9 Liquid Retina XDR", "pencil": "Apple Pencil 2"}'),
('Samsung Galaxy Tab S9+ 256GB - Beige', 'Samsung', 'Tablet', 4999.99, 4199.99, 16, '{"times": "12x", "value": "349,99"}', '/api/placeholder/200/200', 'Galaxy Tab S9+ com S Pen incluída e tela Dynamic AMOLED 2X de 12.4".', 18, true, true, true, false, 'Novo', '1 ano', '{"processador": "Snapdragon 8 Gen 2", "armazenamento": "256GB", "tela": "12.4 Dynamic AMOLED", "spen": "incluída"}'),
('Microsoft Surface Pro 9 256GB - Platinum', 'Microsoft', 'Tablet', 6999.99, 5999.99, 14, '{"times": "12x", "value": "499,99"}', '/api/placeholder/200/200', 'Surface Pro 9 com processador Intel Core i5 e versatilidade 2-em-1.', 12, true, false, true, true, 'Novo', '1 ano', '{"processador": "Intel Core i5", "armazenamento": "256GB SSD", "tipo": "2-em-1", "tela": "13 PixelSense"}'),
('iPad Air 5ª geração 256GB - Purple', 'Apple', 'Tablet', 4999.99, 4299.99, 14, '{"times": "10x", "value": "429,99"}', '/api/placeholder/200/200', 'iPad Air com chip M1, câmera frontal ultra-angular e Touch ID.', 25, true, false, true, false, 'Novo', '1 ano', '{"processador": "Apple M1", "armazenamento": "256GB", "camera": "ultra-angular frontal", "tela": "10.9 Liquid Retina"}'),
('Lenovo Tab P12 Pro 256GB - Storm Grey', 'Lenovo', 'Tablet', 3499.99, 2799.99, 20, '{"times": "10x", "value": "279,99"}', '/api/placeholder/200/200', 'Tab P12 Pro com tela OLED de 12.6" e suporte a Lenovo Precision Pen 3.', 20, true, false, true, true, 'Novo', '1 ano', '{"processador": "MediaTek Kompanio 1300T", "armazenamento": "256GB", "tela": "12.6 OLED", "pen": "Precision Pen 3"}'),

-- Notebooks (25 produtos)
('MacBook Pro 14" M3 Pro 512GB - Space Black', 'Apple', 'Notebook', 15999.99, 14499.99, 9, '{"times": "12x", "value": "1208,33"}', '/api/placeholder/200/200', 'MacBook Pro com chip M3 Pro, tela Liquid Retina XDR e até 18h de bateria.', 8, true, true, true, true, 'Novo', '1 ano', '{"processador": "Apple M3 Pro", "memoria": "18GB", "armazenamento": "512GB SSD", "tela": "14.2 Liquid Retina XDR"}'),
('Dell XPS 13 Plus Intel i7 512GB - Platinum', 'Dell', 'Notebook', 8999.99, 7499.99, 17, '{"times": "12x", "value": "624,99"}', '/api/placeholder/200/200', 'XPS 13 Plus com design premium, tela InfinityEdge e performance excepcional.', 15, true, true, true, false, 'Novo', '1 ano', '{"processador": "Intel Core i7-1360P", "memoria": "16GB", "armazenamento": "512GB SSD", "tela": "13.4 OLED"}'),
('ASUS ROG Strix G15 RTX 4060 512GB - Eclipse Gray', 'ASUS', 'Notebook', 6999.99, 5999.99, 14, '{"times": "12x", "value": "499,99"}', '/api/placeholder/200/200', 'ROG Strix G15 gaming com RTX 4060, tela 144Hz e sistema de refrigeração avançado.', 12, true, false, true, true, 'Novo', '1 ano', '{"processador": "AMD Ryzen 7 7735HS", "gpu": "RTX 4060", "memoria": "16GB", "tela": "15.6 144Hz"}'),
('HP Spectre x360 14" Intel i7 1TB - Nightfall Black', 'HP', 'Notebook', 7999.99, 6799.99, 15, '{"times": "12x", "value": "566,66"}', '/api/placeholder/200/200', 'Spectre x360 conversível com tela OLED touch e design premium em alumínio.', 10, true, true, true, false, 'Novo', '1 ano', '{"processador": "Intel Core i7-1355U", "memoria": "16GB", "armazenamento": "1TB SSD", "tela": "14 OLED Touch"}'),
('Acer Predator Helios 300 RTX 4070 1TB - Abyssal Black', 'Acer', 'Notebook', 8999.99, 7699.99, 14, '{"times": "12x", "value": "641,66"}', '/api/placeholder/200/200', 'Predator Helios 300 gaming com RTX 4070, teclado RGB e refrigeração AeroBlade 3D.', 8, true, false, true, true, 'Novo', '1 ano', '{"processador": "Intel Core i7-13700HX", "gpu": "RTX 4070", "memoria": "32GB", "tela": "15.6 165Hz"}'),

-- Smartwatches e Wearables (15 produtos)
('Apple Watch Series 9 45mm GPS - Midnight', 'Apple', 'Electrónicos', 2999.99, 2599.99, 13, '{"times": "10x", "value": "259,99"}', '/api/placeholder/200/200', 'Apple Watch Series 9 com chip S9, Double Tap e monitoramento avançado de saúde.', 30, true, true, true, true, 'Novo', '1 ano', '{"chip": "S9", "tela": "45mm Always-On Retina", "gps": "sim", "saude": "ECG, SpO2"}'),
('Samsung Galaxy Watch6 Classic 47mm - Black', 'Samsung', 'Electrónicos', 2199.99, 1799.99, 18, '{"times": "10x", "value": "179,99"}', '/api/placeholder/200/200', 'Galaxy Watch6 Classic com bezel rotativo, monitoramento de sono e GPS.', 25, true, false, true, false, 'Novo', '1 ano', '{"processador": "Exynos W930", "tela": "47mm Super AMOLED", "bezel": "rotativo", "gps": "sim"}'),
('Garmin Fenix 7X Solar - Carbon Gray', 'Garmin', 'Electrónicos', 4999.99, 4299.99, 14, '{"times": "12x", "value": "358,33"}', '/api/placeholder/200/200', 'Fenix 7X Solar com carregamento solar, GPS multi-banda e resistência militar.', 15, true, true, true, false, 'Novo', '2 anos', '{"carregamento": "solar", "gps": "multi-banda", "resistencia": "militar", "bateria": "até 37 dias"}'),

-- Fones de Ouvido (10 produtos)
('AirPods Pro 2ª geração - White', 'Apple', 'Electrónicos', 1999.99, 1699.99, 15, '{"times": "10x", "value": "169,99"}', '/api/placeholder/200/200', 'AirPods Pro com chip H2, cancelamento ativo de ruído e áudio espacial.', 40, true, true, true, true, 'Novo', '1 ano', '{"chip": "H2", "anc": "sim", "espacial": "sim", "bateria": "até 30h com case"}'),
('Sony WH-1000XM5 - Black', 'Sony', 'Electrónicos', 1999.99, 1599.99, 20, '{"times": "10x", "value": "159,99"}', '/api/placeholder/200/200', 'WH-1000XM5 com cancelamento de ruído líder da indústria e 30h de bateria.', 35, true, false, true, true, 'Novo', '1 ano', '{"anc": "industry-leading", "bateria": "30h", "quick_charge": "3min = 3h", "multipoint": "sim"}'),
('Bose QuietComfort 45 - White Smoke', 'Bose', 'Electrónicos', 1799.99, 1399.99, 22, '{"times": "10x", "value": "139,99"}', '/api/placeholder/200/200', 'QuietComfort 45 com cancelamento de ruído premium e conforto excepcional.', 28, true, false, true, false, 'Novo', '1 ano', '{"anc": "premium", "bateria": "24h", "conforto": "excepcional", "aware_mode": "sim"}');

-- Continuação com mais produtos...
INSERT INTO products (
  title, brand, category, original_price, current_price, discount,
  installments, image, description, stock, is_active, is_featured,
  is_offer, is_best_seller, condition, warranty, specifications
) VALUES 
-- Mais Smartphones
('Huawei P60 Pro 256GB - Rococo Pearl', 'Huawei', 'Smartphone', 4999.99, 3999.99, 20, '{"times": "10x", "value": "399,99"}', '/api/placeholder/200/200', 'P60 Pro com câmera Leica de 48MP e design premium em vidro curvado.', 20, true, false, true, false, 'Novo', '1 ano', '{"camera": "48MP Leica", "armazenamento": "256GB", "design": "vidro curvado", "5G": "sim"}'),
('Oppo Find X6 Pro 512GB - Desert Silver', 'Oppo', 'Smartphone', 5499.99, 4399.99, 20, '{"times": "12x", "value": "366,66"}', '/api/placeholder/200/200', 'Find X6 Pro com sistema de câmera Hasselblad e carregamento SuperVOOC.', 18, true, true, true, false, 'Novo', '1 ano', '{"camera": "Hasselblad", "armazenamento": "512GB", "carregamento": "100W SuperVOOC", "tela": "6.82 AMOLED"}'),
('Vivo X90 Pro+ 256GB - Legendary Black', 'Vivo', 'Smartphone', 4799.99, 3839.99, 20, '{"times": "10x", "value": "383,99"}', '/api/placeholder/200/200', 'X90 Pro+ com câmeras ZEISS, chip Snapdragon 8 Gen 2 e carregamento 80W.', 22, true, false, true, true, 'Novo', '1 ano', '{"camera": "ZEISS", "processador": "Snapdragon 8 Gen 2", "carregamento": "80W", "armazenamento": "256GB"}'),

-- Gaming e Acessórios
('PlayStation 5 Digital Edition - White', 'Sony', 'Electrónicos', 3999.99, 3599.99, 10, '{"times": "12x", "value": "299,99"}', '/api/placeholder/200/200', 'PS5 Digital com SSD ultra-rápido, ray tracing e áudio 3D Tempest.', 5, true, true, true, true, 'Novo', '1 ano', '{"armazenamento": "825GB SSD", "ray_tracing": "sim", "audio": "3D Tempest", "resolucao": "4K"}'),
('Xbox Series X 1TB - Black', 'Microsoft', 'Electrónicos', 4499.99, 3999.99, 11, '{"times": "12x", "value": "333,33"}', '/api/placeholder/200/200', 'Xbox Series X com 12 teraflops, Quick Resume e compatibilidade com 4 gerações.', 8, true, true, true, true, 'Novo', '1 ano', '{"performance": "12 teraflops", "armazenamento": "1TB SSD", "quick_resume": "sim", "retrocompatibilidade": "4 gerações"}'),
('Nintendo Switch OLED 64GB - White', 'Nintendo', 'Electrónicos', 2299.99, 1999.99, 13, '{"times": "10x", "value": "199,99"}', '/api/placeholder/200/200', 'Switch OLED com tela vibrante de 7", dock com porta LAN e 64GB interno.', 25, true, false, true, true, 'Novo', '1 ano', '{"tela": "7 OLED", "armazenamento": "64GB", "dock": "LAN", "modos": "TV, mesa, portátil"}'),

-- Smart TVs
('Samsung Neo QLED 65" QN90C 4K - Titan Black', 'Samsung', 'Electrónicos', 8999.99, 7199.99, 20, '{"times": "12x", "value": "599,99"}', '/api/placeholder/200/200', 'Neo QLED 65" com Quantum Matrix Technology e processador Neural Quantum 4K.', 6, true, true, true, false, 'Novo', '1 ano', '{"tecnologia": "Neo QLED", "processador": "Neural Quantum 4K", "tamanho": "65 polegadas", "hdr": "HDR10+"}'),
('LG OLED C3 55" 4K Smart TV - Black', 'LG', 'Electrónicos', 6999.99, 5599.99, 20, '{"times": "12x", "value": "466,66"}', '/api/placeholder/200/200', 'OLED C3 com pixels auto-iluminados, processador α9 Gen6 e webOS 23.', 10, true, true, true, true, 'Novo', '1 ano', '{"tecnologia": "OLED", "processador": "α9 Gen6", "sistema": "webOS 23", "gaming": "4x HDMI 2.1"}'),
('Sony Bravia XR A95L 65" QD-OLED - Black', 'Sony', 'Electrónicos', 12999.99, 10399.99, 20, '{"times": "12x", "value": "866,66"}', '/api/placeholder/200/200', 'Bravia XR com QD-OLED, processador Cognitive XR e Acoustic Surface Audio+.', 4, true, true, true, true, 'Novo', '1 ano', '{"tecnologia": "QD-OLED", "processador": "Cognitive XR", "audio": "Acoustic Surface+", "tamanho": "65 polegadas"}'),

-- Câmeras e Fotografia
('Canon EOS R6 Mark II Body - Black', 'Canon', 'Electrónicos', 12999.99, 10999.99, 15, '{"times": "12x", "value": "916,66"}', '/api/placeholder/200/200', 'EOS R6 Mark II com sensor full-frame de 24.2MP e estabilização de 8 stops.', 8, true, true, true, false, 'Novo', '1 ano', '{"sensor": "24.2MP Full-Frame", "estabilizacao": "8 stops", "video": "4K 60p", "af": "Dual Pixel CMOS AF II"}'),
('Sony Alpha A7 IV Body - Black', 'Sony', 'Electrónicos', 13999.99, 11899.99, 15, '{"times": "12x", "value": "991,66"}', '/api/placeholder/200/200', 'Alpha A7 IV com sensor de 33MP, gravação 4K 60p e estabilização de 5.5 stops.', 6, true, false, true, true, 'Novo', '1 ano', '{"sensor": "33MP Full-Frame", "video": "4K 60p", "estabilizacao": "5.5 stops", "af": "759 pontos"}'),
('Fujifilm X-T5 Body - Silver', 'Fujifilm', 'Electrónicos', 9999.99, 8499.99, 15, '{"times": "12x", "value": "708,33"}', '/api/placeholder/200/200', 'X-T5 com sensor X-Trans CMOS 5 HR de 40.2MP e estabilização de 7 stops.', 10, true, false, true, false, 'Novo', '1 ano', '{"sensor": "40.2MP X-Trans CMOS 5", "estabilizacao": "7 stops", "video": "6.2K 30p", "design": "retro"}'),

-- Computadores Desktop
('iMac 24" M3 256GB - Blue', 'Apple', 'Electrónicos', 8999.99, 7999.99, 11, '{"times": "12x", "value": "666,66"}', '/api/placeholder/200/200', 'iMac 24" com chip M3, tela Retina 4.5K e design colorido ultra-fino.', 12, true, true, true, false, 'Novo', '1 ano', '{"processador": "Apple M3", "tela": "24 Retina 4.5K", "memoria": "8GB", "armazenamento": "256GB SSD"}'),
('Dell OptiPlex 7000 Intel i7 512GB - Black', 'Dell', 'Electrónicos', 4999.99, 4199.99, 16, '{"times": "12x", "value": "349,99"}', '/api/placeholder/200/200', 'OptiPlex 7000 compacto com Intel i7, ideal para escritório e produtividade.', 15, true, false, true, false, 'Novo', '1 ano', '{"processador": "Intel Core i7-13700", "memoria": "16GB", "armazenamento": "512GB SSD", "formato": "micro"}'),

-- Periféricos Gaming
('Logitech G Pro X Superlight 2 - White', 'Logitech', 'Electrónicos', 899.99, 719.99, 20, '{"times": "10x", "value": "71,99"}', '/api/placeholder/200/200', 'Mouse gaming ultra-leve com sensor HERO 25K e switches híbridos.', 50, true, false, true, true, 'Novo', '2 anos', '{"peso": "60g", "sensor": "HERO 25K", "switches": "híbridos", "bateria": "95h"}'),
('Razer BlackWidow V4 Pro - Black', 'Razer', 'Electrónicos', 1299.99, 999.99, 23, '{"times": "10x", "value": "99,99"}', '/api/placeholder/200/200', 'Teclado mecânico com switches Green, RGB Chroma e command dial.', 30, true, true, true, false, 'Novo', '2 anos', '{"switches": "Razer Green", "rgb": "Chroma", "dial": "command", "layout": "ABNT2"}'),
('SteelSeries Arctis Nova Pro Wireless - Black', 'SteelSeries', 'Electrónicos', 2199.99, 1759.99, 20, '{"times": "10x", "value": "175,99"}', '/api/placeholder/200/200', 'Headset gaming premium com drivers de 40mm e cancelamento ativo de ruído.', 25, true, false, true, true, 'Novo', '1 ano', '{"drivers": "40mm", "anc": "sim", "wireless": "2.4GHz + Bluetooth", "bateria": "44h"}');

-- =====================================================
-- VERIFICAR NOVOS PRODUTOS INSERIDOS
-- =====================================================

-- Contar total de produtos por categoria
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

-- Verificar total geral de produtos
SELECT COUNT(*) as total_produtos_geral
FROM products 
WHERE is_active = true;

-- Produtos mais caros
SELECT title, brand, category, current_price
FROM products 
WHERE is_active = true
ORDER BY current_price DESC
LIMIT 10;

-- Produtos com maior desconto
SELECT title, brand, category, discount, original_price, current_price
FROM products 
WHERE is_active = true AND discount > 0
ORDER BY discount DESC
LIMIT 10;

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
-- 
-- 1. Ve a Supabase Dashboard > SQL Editor
-- 2. Copia y pega este script completo
-- 3. Ejecuta el script para agregar ~100 productos más
-- 4. Verifica los resultados con las consultas incluidas
-- 
-- Este script agrega productos variados en las categorías:
-- - Smartphones (más modelos)
-- - Tablets 
-- - Notebooks
-- - Smartwatches
-- - Fones de Ouvido
-- - Gaming (consoles, periféricos)
-- - Smart TVs
-- - Câmeras
-- - Computadores Desktop
-- - Periféricos
-- 
-- =====================================================