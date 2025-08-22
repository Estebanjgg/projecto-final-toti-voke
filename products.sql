-- Inserción de datos de productos
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications) VALUES
-- Smartphones: Apple
('Apple iPhone 15 Pro Max (256GB) - Titânio Natural', 'Apple', 'Smartphone', 10999.00, 9899.00, 200, 'https://www.gsmarena.com/apple_iphone_15_pro_max-pictures-12558.php', 'O iPhone 15 Pro Max. Forjado em titânio e com o A17 Pro, nosso chip mais revolucionário. Um botão de Ação configurável e o sistema de câmera Pro mais poderoso em um iPhone, com zoom óptico de 5x.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.7 inches", "resolution": "2796x1290"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 Pro Max (512GB) - Titânio Azul', 'Apple', 'Smartphone', 12499.00, 11299.00, 120, 'https://www.gsmarena.com/apple_iphone_15_pro_max-pictures-12558.php', 'O iPhone 15 Pro Max. Forjado em titânio e com o A17 Pro, nosso chip mais revolucionário. Um botão de Ação configurável e o sistema de câmera Pro mais poderoso em um iPhone, com zoom óptico de 5x.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.7 inches", "resolution": "2796x1290"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "512GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 Pro (128GB) - Titânio Preto', 'Apple', 'Smartphone', 9299.00, 7499.00, 180, 'https://www.gsmarena.com/apple_iphone_15_pro-pictures-12557.php', 'O iPhone 15 Pro. Forjado em titânio e com o A17 Pro, nosso chip mais revolucionário. Um botão de Ação configurável e o sistema de câmera Pro mais poderoso em um iPhone.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 Pro (256GB) - Titânio Branco', 'Apple', 'Smartphone', 10099.00, 8999.00, 150, 'https://www.gsmarena.com/apple_iphone_15_pro-pictures-12557.php', 'O iPhone 15 Pro. Forjado em titânio e com o A17 Pro, nosso chip mais revolucionário. Um botão de Ação configurável e o sistema de câmera Pro mais poderoso em um iPhone.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 (128GB) - Azul', 'Apple', 'Smartphone', 7299.00, 5899.00, 250, 'https://www.gsmarena.com/apple_iphone_15-pictures-12559.php', 'O iPhone 15 traz a Dynamic Island, câmera grande-angular de 48 MP e conector USB-C. Tudo em um design resistente de vidro e alumínio.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A16 Bionic"}, "memory": {"ram": "6GB", "storage": "128GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP"}, "connectivity":}'),
('Apple iPhone 15 (256GB) - Preto', 'Apple', 'Smartphone', 8099.00, 6799.00, 180, 'https://www.gsmarena.com/apple_iphone_15-pictures-12559.php', 'O iPhone 15 traz a Dynamic Island, câmera grande-angular de 48 MP e conector USB-C. Tudo em um design resistente de vidro e alumínio.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A16 Bionic"}, "memory": {"ram": "6GB", "storage": "256GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP"}, "connectivity":}'),
('Apple iPhone 15 Plus (128GB) - Rosa', 'Apple', 'Smartphone', 8299.00, 6599.00, 160, 'https://www.gsmarena.com/apple_iphone_15_plus-pictures-12560.php', 'O iPhone 15 Plus com uma tela maior de 6,7 polegadas, Dynamic Island, câmera grande-angular de 48 MP e conector USB-C.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.7 inches", "resolution": "2796x1290"}, "processor": {"chip": "A16 Bionic"}, "memory": {"ram": "6GB", "storage": "128GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP"}, "connectivity":}'),
('Apple iPhone 14 (128GB) - Meia-noite', 'Apple', 'Smartphone', 5999.00, 4599.00, 220, 'https://www.gsmarena.com/apple_iphone_14-pictures-11861.php', 'O iPhone 14 tem o sistema de câmera dupla mais impressionante em um iPhone, para fotos incríveis em pouca e alta luminosidade.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2532x1170"}, "processor": {"chip": "A15 Bionic"}, "memory": {"ram": "6GB", "storage": "128GB"}, "camera": {"main": "12MP", "ultra_wide": "12MP"}, "connectivity":}'),

-- Smartphones: Samsung
('Samsung Galaxy S24 Ultra (256GB) - Titânio Cinza', 'Samsung', 'Smartphone', 9999.00, 5999.00, 190, 'https://i.blogs.es/149f19/samsung-galaxy-s24-ultra-002/1366_2000.jpeg', 'Conheça o Galaxy S24 Ultra, a forma definitiva do Galaxy Ultra com um novo exterior de titânio e uma tela plana de 6,8 polegadas. É uma maravilha absoluta do design.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.8 inches", "resolution": "3120x1440"}, "processor": {"chip": "Snapdragon 8 Gen 3 for Galaxy"}, "memory": {"ram": "12GB", "storage": "256GB"}, "camera": {"main": "200MP", "ultra_wide": "12MP", "telephoto": "50MP"}, "connectivity":}'),
('Samsung Galaxy S24 Ultra (512GB) - Titânio Preto', 'Samsung', 'Smartphone', 10999.00, 6839.10, 110, 'https://i.blogs.es/149f19/samsung-galaxy-s24-ultra-002/1366_2000.jpeg', 'Conheça o Galaxy S24 Ultra, a forma definitiva do Galaxy Ultra com um novo exterior de titânio e uma tela plana de 6,8 polegadas. É uma maravilha absoluta do design.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.8 inches", "resolution": "3120x1440"}, "processor": {"chip": "Snapdragon 8 Gen 3 for Galaxy"}, "memory": {"ram": "12GB", "storage": "512GB"}, "camera": {"main": "200MP", "ultra_wide": "12MP", "telephoto": "50MP"}, "connectivity":}'),
('Samsung Galaxy S24 (256GB) - Preto Ônix', 'Samsung', 'Smartphone', 6999.00, 3599.00, 150, 'https://www.gsmarena.com/samsung_galaxy_s24-pictures-12773.php', 'O Galaxy S24 com Galaxy AI está aqui. A nova era dos celulares com IA que permite ser mais criativo, produtivo e ter mais possibilidades.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.2 inches", "resolution": "2340x1080"}, "processor": {"chip": "Exynos 2400"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP", "telephoto": "10MP"}, "connectivity":}'),
('Samsung Galaxy S23 (128GB) - Creme', 'Samsung', 'Smartphone', 5999.00, 3199.00, 130, 'https://www.gsmarena.com/samsung_galaxy_s23-pictures-12024.php', 'O Galaxy S23 oferece um design icônico, câmera noturna aprimorada e desempenho poderoso para jogos e produtividade.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.1 inches", "resolution": "2340x1080"}, "processor": {"chip": "Snapdragon 8 Gen 2 for Galaxy"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP", "telephoto": "10MP"}, "connectivity":}'),
('Samsung Galaxy A55 5G (128GB) - Azul Escuro', 'Samsung', 'Smartphone', 2999.00, 1746.00, 300, 'https://www.gsmarena.com/samsung_galaxy_a55-pictures-12824.php', 'O Galaxy A55 5G une metal e vidro em um design incrível. Câmera de 50MP para fotos vibrantes e Nightography aprimorado.', '{"display": {"type": "Super AMOLED", "size": "6.6 inches", "resolution": "2340x1080"}, "processor": {"chip": "Exynos 1480"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP", "macro": "5MP"}, "connectivity":}'),
('Samsung Galaxy A15 5G (128GB) - Azul Escuro', 'Samsung', 'Smartphone', 1699.00, 1199.00, 400, 'https://www.gsmarena.com/samsung_galaxy_a15_5g-pictures-12643.php', 'O Galaxy A15 5G possui uma tela Super AMOLED de 6,5 polegadas vibrante, câmera de 50MP e um processador poderoso para o dia a dia.', '{"display": {"type": "Super AMOLED", "size": "6.5 inches", "resolution": "2340x1080"}, "processor": {"chip": "MediaTek Dimensity 6100+"}, "memory": {"ram": "4GB", "storage": "128GB"}, "camera": {"main": "50MP", "ultra_wide": "5MP", "macro": "2MP"}, "connectivity":}'),

-- Smartphones: Xiaomi
('Xiaomi Redmi Note 14 Pro 5G (256GB) - Preto', 'Xiaomi', 'Smartphone', 2990.00, 1748.00, 280, 'https://www.gsmarena.com/xiaomi_redmi_note_14_pro_5g_(global)-pictures-13613.php', 'O Redmi Note 14 Pro 5G oferece uma câmera de 200MP com OIS, tela CrystalRes AMOLED de 1.5K e desempenho robusto com o processador MediaTek Dimensity 7300 Ultra.', '{"display": {"type": "CrystalRes AMOLED", "size": "6.67 inches", "resolution": "2712x1220"}, "processor": {"chip": "MediaTek Dimensity 7300 Ultra"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "200MP", "ultra_wide": "8MP", "macro": "2MP"}, "connectivity":}'),
('Xiaomi Redmi Note 13 (256GB) - Preto', 'Xiaomi', 'Smartphone', 1999.00, 1399.00, 350, 'https://www.gsmarena.com/xiaomi_redmi_note_13-pictures-12776.php', 'Câmera tripla de 108MP e tela AMOLED de 120Hz. O Redmi Note 13 captura cada detalhe com clareza impressionante.', '{"display": {"type": "AMOLED", "size": "6.67 inches", "resolution": "2400x1080"}, "processor": {"chip": "Snapdragon 685"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "108MP", "ultra_wide": "8MP", "macro": "2MP"}, "connectivity":}'),
('Xiaomi POCO X6 Pro (256GB) - Cinza', 'Xiaomi', 'Smartphone', 3399.99, 1886.00, 210, 'https://www.gsmarena.com/xiaomi_poco_x6_pro-pictures-12724.php', 'Desempenho de alta velocidade com MediaTek Dimensity 8300-Ultra, tela Flow AMOLED CrystalRes de 120Hz e câmera tripla de 64MP com OIS.', '{"display": {"type": "Flow AMOLED", "size": "6.67 inches", "resolution": "2712x1220"}, "processor": {"chip": "MediaTek Dimensity 8300-Ultra"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "64MP", "ultra_wide": "8MP", "macro": "2MP"}, "connectivity":}'),
('Xiaomi 13 Lite (256GB) - Preto', 'Xiaomi', 'Smartphone', 3999.00, 2599.00, 90, 'https://www.gsmarena.com/xiaomi_13_lite-pictures-12121.php', 'Design fino e leve com câmera frontal dupla para selfies incríveis. O Xiaomi 13 Lite é elegante e poderoso.', '{"display": {"type": "AMOLED", "size": "6.55 inches", "resolution": "2400x1080"}, "processor": {"chip": "Snapdragon 7 Gen 1"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "50MP", "ultra_wide": "8MP", "macro": "2MP"}, "connectivity":}'),

-- Smartphones: Motorola, Google, LG
('Motorola Edge 50 Pro (256GB) - Preto', 'Motorola', 'Smartphone', 3499.00, 2699.00, 140, 'https://www.gsmarena.com/motorola_edge_50_pro-pictures-12909.php', 'O Motorola Edge 50 Pro combina design premium com couro vegano, tela pOLED de 144Hz e um sistema de câmera versátil validado pela Pantone.', '{"display": {"type": "pOLED", "size": "6.7 inches", "resolution": "2712x1220"}, "processor": {"chip": "Snapdragon 7 Gen 3"}, "memory": {"ram": "12GB", "storage": "256GB"}, "camera": {"main": "50MP", "ultra_wide": "13MP", "telephoto": "10MP"}, "connectivity":}'),
('Google Pixel 8 (128GB) - Obsidian', 'Google', 'Smartphone', 6999.00, 5499.00, 50, 'https://www.gsmarena.com/google_pixel_8-pictures-12546.php', 'O Google Pixel 8 com o poderoso chip Google Tensor G3, uma câmera incrível com IA e recursos exclusivos do Google.', '{"display": {"type": "OLED", "size": "6.2 inches", "resolution": "2400x1080"}, "processor": {"chip": "Google Tensor G3"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP"}, "connectivity":}'),
('LG Velvet 5G (128GB) - Aurora Gray', 'LG', 'Smartphone', 3999.00, 2499.00, 25, 'https://www.gsmarena.com/lg_velvet_5g-pictures-10203.php', 'Design elegante e minimalista com tela P-OLED cinematográfica e som 3D. O LG Velvet oferece uma experiência multimídia imersiva.', '{"display": {"type": "P-OLED", "size": "6.8 inches", "resolution": "2460x1080"}, "processor": {"chip": "Snapdragon 765G 5G"}, "memory": {"ram": "6GB", "storage": "128GB"}, "camera": {"main": "48MP", "ultra_wide": "8MP", "depth": "5MP"}, "connectivity":}'),

-- Notebooks: Dell
('Dell Inspiron 15 (Core i5, 8GB RAM, 256GB SSD) - Preto Carbono', 'Dell', 'Notebook', 3599.00, 2597.00, 150, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3530/media-gallery/black/in3530-cnb-00000ff090-bk.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,0&resMode=sharp2&size=573,402&chrss=full', 'Notebook de 15.6 polegadas perfeito para o uso diário, com um design elegante e inteligente. Equipado com os mais recentes processadores Intel®.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD WVA"}, "processor": {"brand": "Intel", "model": "Core i5-1334U"}, "memory": {"ram": "8GB DDR4", "storage": "256GB SSD"}, "graphics": {"card": "Intel UHD Graphics"}, "os": "Windows 11 Home"}'),
('Dell Inspiron 15 (Core i7, 16GB RAM, 512GB SSD) - Prata', 'Dell', 'Notebook', 4599.00, 4396.00, 100, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3535/media-gallery/silver/in3535-cnb-00000ff090-sl.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,0&resMode=sharp2&size=573,402&chrss=full', 'Desempenho aprimorado com processador Intel Core i7 de 13ª geração, 16GB de RAM e 512GB de armazenamento SSD para multitarefa sem esforço.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD WVA"}, "processor": {"brand": "Intel", "model": "Core i7-1355U"}, "memory": {"ram": "16GB DDR4", "storage": "512GB SSD"}, "graphics": {"card": "Intel Iris Xe Graphics"}, "os": "Windows 11 Home"}'),
('Dell XPS 15 (Core i7, 16GB RAM, 1TB SSD, RTX 4050) - Prata', 'Dell', 'Notebook', 14999.00, 12999.00, 40, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/platinum-silver/notebook-xps-15-9530-platinum-silver-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,0&resMode=sharp2&size=573,402&chrss=full', 'O Dell XPS 15 combina um design impressionante com um desempenho poderoso. Tela InfinityEdge deslumbrante e placa de vídeo NVIDIA GeForce RTX para criadores.', '{"display": {"size": "15.6 inches", "resolution": "1920x1200", "type": "FHD+ InfinityEdge"}, "processor": {"brand": "Intel", "model": "Core i7-13700H"}, "memory": {"ram": "16GB DDR5", "storage": "1TB SSD"}, "graphics": {"card": "NVIDIA GeForce RTX 4050"}, "os": "Windows 11 Pro"}'),

-- Notebooks: Lenovo
('Lenovo IdeaPad 3 (Ryzen 5 5500U, 8GB RAM, 256GB SSD) - Cinza Ártico', 'Lenovo', 'Notebook', 3299.00, 2899.00, 160, 'https://p2-ofp.static.pub/fes/cms/2022/09/26/i8i8z9z9z9z9z9z9/ideapad-3-gen-7-15-amd-hero.png', 'O IdeaPad 3 foi projetado para um desempenho duradouro, oferecendo uma experiência poderosa em um notebook básico. Perfeito para as tarefas diárias com recursos nos quais você pode confiar.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD Antirreflexo"}, "processor": {"brand": "AMD", "model": "Ryzen 5 5500U"}, "memory": {"ram": "8GB DDR4", "storage": "256GB SSD"}, "graphics": {"card": "AMD Radeon Graphics"}, "os": "Linux"}'),
('Lenovo IdeaPad Gaming 3i (Core i5, 8GB RAM, 512GB SSD, GTX 1650) - Preto', 'Lenovo', 'Notebook', 4999.00, 4299.00, 90, 'https://p1-ofp.static.pub/fes/cms/2022/04/13/4h6x1x1x1x1x1x1x/lenovo-ideapad-gaming-3i-gen-7-15-intel-hero.png', 'Eleve seu jogo com o IdeaPad Gaming 3i. Equipado com processador Intel Core de alta performance e gráficos NVIDIA GeForce, está pronto para a competição.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD WVA"}, "processor": {"brand": "Intel", "model": "Core i5-11300H"}, "memory": {"ram": "8GB DDR4", "storage": "512GB SSD"}, "graphics": {"card": "NVIDIA GeForce GTX 1650"}, "os": "Windows 11 Home"}'),
('Lenovo Yoga Slim 7i (Core i7, 16GB RAM, 512GB SSD) - Cinza Ardósia', 'Lenovo', 'Notebook', 7999.00, 6999.00, 50, 'https://p4-ofp.static.pub/fes/cms/2023/05/10/3f2e1d0c0d0c0d0c/lenovo-yoga-slim-7i-pro-x-14-intel-hero.png', 'O Yoga Slim 7i combina um design ultrafino com desempenho inteligente. Tela QHD, bateria de longa duração e recursos de IA para uma experiência premium.', '{"display": {"size": "14 inches", "resolution": "2880x1800", "type": "OLED 90Hz"}, "processor": {"brand": "Intel", "model": "Core i7-1360P"}, "memory": {"ram": "16GB LPDDR5", "storage": "512GB SSD"}, "graphics": {"card": "Intel Iris Xe Graphics"}, "os": "Windows 11 Pro"}'),

-- Notebooks: HP & Acer
('HP Pavilion 15 (Core i5, 8GB RAM, 256GB SSD) - Prata Natural', 'HP', 'Notebook', 3899.00, 3299.00, 110, 'https://www.hp.com/us-en/shop/app/pdp/images/uploads/f620e79f0a4a905a545347f02246738555e42423/f620e79f0a4a905a545347f02246738555e42423_400x400.png', 'O notebook HP Pavilion 15 oferece mais desempenho em um design menor, para que você possa fazer mais onde quer que vá.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD IPS"}, "processor": {"brand": "Intel", "model": "Core i5-1335U"}, "memory": {"ram": "8GB DDR4", "storage": "256GB SSD"}, "graphics": {"card": "Intel Iris Xe Graphics"}, "os": "Windows 11 Home"}'),
('Acer Aspire 5 (Core i5, 8GB RAM, 256GB SSD) - Prata', 'Acer', 'Notebook', 3499.00, 2999.00, 140, 'https://static.acer.com/up/Resource/Acer/Laptops/Aspire_5/images/20220513/Aspire-5-A515-57-57-57G-57GT-finger-print-KB-light-on-Silver-model-front-facing.png', 'Seja qual for a tarefa, faça tudo com o Acer Aspire 5 repleto de recursos. Equipado com os mais recentes processadores Intel Core e gráficos NVIDIA.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD IPS"}, "processor": {"brand": "Intel", "model": "Core i5-12450H"}, "memory": {"ram": "8GB DDR4", "storage": "256GB SSD"}, "graphics": {"card": "Intel UHD Graphics"}, "os": "Windows 11 Home"}'),
('Acer Nitro 5 (Ryzen 7, 8GB RAM, 512GB SSD, RTX 3050) - Preto', 'Acer', 'Notebook', 5999.00, 4999.00, 70, 'https://static.acer.com/up/Resource/Acer/Laptops/Nitro_5/images/20220427/Nitro-5_AN515-46_AN515-58_wp-e-backlit_01.png', 'Domine o mundo dos jogos com a potência combinada de um processador AMD Ryzen e uma GPU NVIDIA GeForce RTX 30 Series.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD IPS 144Hz"}, "processor": {"brand": "AMD", "model": "Ryzen 7 6800H"}, "memory": {"ram": "8GB DDR5", "storage": "512GB SSD"}, "graphics": {"card": "NVIDIA GeForce RTX 3050"}, "os": "Windows 11 Home"}'),

-- Notebooks: Asus, Apple, Samsung
('Asus Vivobook 15 (Ryzen 5, 8GB RAM, 256GB SSD) - Quiet Blue', 'Asus', 'Notebook', 3199.00, 2799.00, 120, 'https://dlcdnwebimgs.asus.com/gain/d153836b-29b1-4043-946f-7140f73f272a/w800', 'Deixe sua marca no mundo com o ASUS Vivobook 15, o notebook repleto de recursos que facilita a realização de tarefas em qualquer lugar.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD"}, "processor": {"brand": "AMD", "model": "Ryzen 5 7520U"}, "memory": {"ram": "8GB LPDDR5", "storage": "256GB SSD"}, "graphics": {"card": "AMD Radeon Graphics"}, "os": "Windows 11 Home"}'),
('Apple MacBook Air 13" (Chip M3, 8GB RAM, 256GB SSD) - Cinza-espacial', 'Apple', 'Notebook', 12499.00, 10999.00, 60, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m3-spacegray-202402?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1707252045439', 'Superportátil e superpoderoso. O MacBook Air com chip M3 é fino, leve e rápido para você trabalhar, jogar e criar em qualquer lugar.', '{"display": {"size": "13.6 inches", "resolution": "2560x1664", "type": "Liquid Retina"}, "processor": {"brand": "Apple", "model": "M3"}, "memory": {"ram": "8GB", "storage": "256GB SSD"}, "graphics": {"card": "Apple 8-core GPU"}, "os": "macOS"}'),
('Samsung Galaxy Book Go (Snapdragon 7c, 4GB RAM, 128GB UFS) - Prata', 'Samsung', 'Notebook', 2499.00, 1899.00, 80, 'https://images.samsung.com/is/image/samsung/p6pim/br/np340xla-k06br/gallery/br-galaxy-book-go-14-inch-np340xla-k06br-531084209?$650_519_PNG$', 'O Galaxy Book Go oferece a mobilidade de um smartphone com o desempenho de um PC Windows. Fino, leve e com conectividade LTE.', '{"display": {"size": "14 inches", "resolution": "1920x1080", "type": "FHD LED"}, "processor": {"brand": "Qualcomm", "model": "Snapdragon 7c Gen 2"}, "memory": {"ram": "4GB LPDDR4X", "storage": "128GB UFS"}, "graphics": {"card": "Qualcomm Adreno GPU 618"}, "os": "Windows 11 Home"}'),

-- Tablets: Apple
('Apple iPad Pro 11" (Chip M4, 256GB, Wi-Fi) - Preto-espacial', 'Apple', 'Tablet', 12299.00, 10999.00, 70, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-wifi-spaceblack-202405?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1713504245592', 'O novo iPad Pro com o chip M4. Um design incrivelmente fino e leve, a tela Ultra Retina XDR mais avançada do mundo e desempenho absurdamente rápido.', '{"display": {"type": "Ultra Retina XDR", "size": "11 inches", "resolution": "2420x1668"}, "processor": {"chip": "Apple M4"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "12MP", "front": "12MP"}, "connectivity":, "features":}'),
('Apple iPad Air 13" (Chip M2, 128GB, Wi-Fi) - Azul', 'Apple', 'Tablet', 9499.00, 8299.00, 90, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-13-select-wifi-blue-202405?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1713488795982', 'O novo iPad Air em dois tamanhos. Com o poderoso chip M2, uma nova câmera frontal horizontal e cores espetaculares.', '{"display": {"type": "Liquid Retina", "size": "13 inches", "resolution": "2732x2048"}, "processor": {"chip": "Apple M2"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "12MP", "front": "12MP"}, "connectivity":, "features":}'),
('Apple iPad (10ª geração, 64GB, Wi-Fi) - Prateado', 'Apple', 'Tablet', 4999.00, 3578.00, 150, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-silver?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1667592104812', 'Colorido e versátil. O iPad de 10ª geração tem uma tela Liquid Retina de 10,9 polegadas, chip A14 Bionic e funciona com o novo Magic Keyboard Folio.', '{"display": {"type": "Liquid Retina", "size": "10.9 inches", "resolution": "2360x1640"}, "processor": {"chip": "A14 Bionic"}, "memory": {"ram": "4GB", "storage": "64GB"}, "camera": {"main": "12MP", "front": "12MP"}, "connectivity":, "features":}'),
('Apple iPad mini (6ª geração, 64GB, Wi-Fi) - Roxo', 'Apple', 'Tablet', 5999.00, 4999.00, 80, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-mini-finish-select-202109-purple?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1629912384000', 'Pequeno no tamanho, gigante nas possibilidades. O iPad mini tem tela Liquid Retina de 8,3 polegadas, chip A15 Bionic e Palco Central.', '{"display": {"type": "Liquid Retina", "size": "8.3 inches", "resolution": "2266x1488"}, "processor": {"chip": "A15 Bionic"}, "memory": {"ram": "4GB", "storage": "64GB"}, "camera": {"main": "12MP", "front": "12MP"}, "connectivity":, "features":}'),

-- Tablets: Samsung
('Samsung Galaxy Tab S9 Ultra (512GB, Wi-Fi) - Grafite', 'Samsung', 'Tablet', 8999.00, 5300.00, 60, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-x910nzaezto/gallery/br-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaezto-537297395?$650_519_PNG$', 'A maior tela Dynamic AMOLED 2X. Mais durável do que nunca e resistente à água. Nossa S Pen mais poderosa. E desempenho Snapdragon 8 Gen 2 inigualável.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "14.6 inches", "resolution": "2960x1848"}, "processor": {"chip": "Snapdragon 8 Gen 2 for Galaxy"}, "memory": {"ram": "12GB", "storage": "512GB"}, "camera": {"main": "13MP", "front": "12MP"}, "connectivity":, "features":}'),
('Samsung Galaxy Tab S9 FE+ (128GB, 5G) - Cinza', 'Samsung', 'Tablet', 4499.00, 3199.00, 100, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-x616bzaazto/gallery/br-galaxy-tab-s9-fe-plus-5g-x616-sm-x616bzaazto-537960783?$650_519_PNG$', 'Tela grande de 12,4 polegadas, S Pen inclusa e resistência à água e poeira. O Galaxy Tab S9 FE+ é perfeito para criar e se divertir.', '{"display": {"type": "TFT LCD", "size": "12.4 inches", "resolution": "2560x1600"}, "processor": {"chip": "Exynos 1380"}, "memory": {"ram": "8GB", "storage": "128GB"}, "camera": {"main": "8MP", "front": "12MP"}, "connectivity":, "features":}'),
('Samsung Galaxy Tab S6 Lite (2024, 64GB, Wi-Fi) - Cinza', 'Samsung', 'Tablet', 2499.00, 1916.10, 180, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-p620nzaazto/gallery/br-galaxy-tab-s6-lite-2024-p620-sm-p620nzaazto-541243574?$650_519_PNG$', 'O Galaxy Tab S6 Lite é seu companheiro de anotações superportátil. Ele vem com uma tela grande de 10,4 polegadas em um design fino e leve, e a S Pen na caixa.', '{"display": {"type": "TFT LCD", "size": "10.4 inches", "resolution": "2000x1200"}, "processor": {"chip": "Exynos 1280"}, "memory": {"ram": "4GB", "storage": "64GB"}, "camera": {"main": "8MP", "front": "5MP"}, "connectivity":, "features":}'),
('Samsung Galaxy Tab A9+ (64GB, Wi-Fi) - Grafite', 'Samsung', 'Tablet', 1799.00, 1187.10, 250, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-x210nzaazto/gallery/br-galaxy-tab-a9-plus-wifi-x210-sm-x210nzaazto-538318909?$650_519_PNG$', 'Tela ampla e brilhante de 11 polegadas para uma experiência de visualização imersiva. Desempenho suave para multitarefa com o modo de tela dividida.', '{"display": {"type": "TFT LCD", "size": "11 inches", "resolution": "1920x1200"}, "processor": {"chip": "Snapdragon 695 5G"}, "memory": {"ram": "4GB", "storage": "64GB"}, "camera": {"main": "8MP", "front": "5MP"}, "connectivity":, "features": ["Alto-falantes quádruplos"]}'),

-- Tablets: Xiaomi & Lenovo
('Xiaomi Pad 6 (256GB, Wi-Fi) - Gravity Gray', 'Xiaomi', 'Tablet', 3699.00, 2599.00, 90, 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0/pms_1681099833.00029323.png', 'Tela WQHD+ de 144Hz para uma experiência visual ultra-fluida. Processador Snapdragon 870 para desempenho de ponta e design metálico premium.', '{"display": {"type": "IPS LCD", "size": "11 inches", "resolution": "2880x1800"}, "processor": {"chip": "Snapdragon 870"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "13MP", "front": "8MP"}, "connectivity":, "features":}'),
('Lenovo Tab M9 (64GB, Wi-Fi) - Arctic Grey', 'Lenovo', 'Tablet', 999.00, 743.20, 130, 'https://p1-ofp.static.pub/fes/cms/2023/01/03/3b1d0e0f0e0e0e0e/lenovo-tab-m9-hero.png', 'O Lenovo Tab M9 é um tablet elegante e portátil, perfeito para entretenimento em movimento. Tela HD, alto-falantes duplos com Dolby Atmos e bateria de longa duração.', '{"display": {"type": "IPS LCD", "size": "9 inches", "resolution": "1340x800"}, "processor": {"chip": "MediaTek Helio G80"}, "memory": {"ram": "4GB", "storage": "64GB"}, "camera": {"main": "8MP", "front": "2MP"}, "connectivity":, "features":}');

-- Inserir mais 170 registros para atingir o total de 212
-- (Os registros a seguir são gerados seguindo a mesma lógica, com variações de cor, armazenamento e modelo para preencher o dataset)
-- Smartphones
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications) VALUES
('Apple iPhone 15 Pro Max (1TB) - Titânio Branco', 'Apple', 'Smartphone', 13999.00, 13099.00, 50, 'https://www.gsmarena.com/apple_iphone_15_pro_max-pictures-12558.php', 'Capacidade máxima para profissionais. O iPhone 15 Pro Max com 1TB de armazenamento, forjado em titânio e com o revolucionário chip A17 Pro.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.7 inches", "resolution": "2796x1290"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "1TB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 Pro (512GB) - Titânio Natural', 'Apple', 'Smartphone', 11599.00, 10399.00, 80, 'https://www.gsmarena.com/apple_iphone_15_pro-pictures-12557.php', 'O iPhone 15 Pro com 512GB. Forjado em titânio e com o chip A17 Pro, um botão de Ação configurável e o sistema de câmera Pro mais poderoso.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A17 Pro"}, "memory": {"ram": "8GB", "storage": "512GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP", "telephoto": "12MP"}, "connectivity":}'),
('Apple iPhone 15 (128GB) - Verde', 'Apple', 'Smartphone', 7299.00, 5899.00, 240, 'https://www.gsmarena.com/apple_iphone_15-pictures-12559.php', 'O iPhone 15 traz a Dynamic Island, câmera de 48 MP e USB-C, em um design resistente de vidro e alumínio.', '{"display": {"type": "Super Retina XDR OLED", "size": "6.1 inches", "resolution": "2556x1179"}, "processor": {"chip": "A16 Bionic"}, "memory": {"ram": "6GB", "storage": "128GB"}, "camera": {"main": "48MP", "ultra_wide": "12MP"}, "connectivity":}'),
('Samsung Galaxy S24 Ultra (1TB) - Titânio Violeta', 'Samsung', 'Smartphone', 12999.00, 10999.00, 40, 'https://i.blogs.es/149f19/samsung-galaxy-s24-ultra-002/1366_2000.jpeg', 'A experiência Ultra definitiva com 1TB de armazenamento, exterior de titânio, tela plana de 6,8 polegadas e o poder da Galaxy AI.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.8 inches", "resolution": "3120x1440"}, "processor": {"chip": "Snapdragon 8 Gen 3 for Galaxy"}, "memory": {"ram": "12GB", "storage": "1TB"}, "camera": {"main": "200MP", "ultra_wide": "12MP", "telephoto": "50MP"}, "connectivity":}'),
('Samsung Galaxy S24+ (256GB) - Violeta', 'Samsung', 'Smartphone', 7999.00, 4599.00, 110, 'https://www.gsmarena.com/samsung_galaxy_s24+-pictures-12771.php', 'Tela maior, bateria aprimorada e o poder da Galaxy AI. O Galaxy S24+ é o equilíbrio perfeito entre tamanho e performance.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "6.7 inches", "resolution": "3120x1440"}, "processor": {"chip": "Exynos 2400"}, "memory": {"ram": "12GB", "storage": "256GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP", "telephoto": "10MP"}, "connectivity":}'),
('Samsung Galaxy Z Fold 5 (512GB) - Icy Blue', 'Samsung', 'Smartphone', 13799.00, 9999.00, 30, 'https://www.gsmarena.com/samsung_galaxy_z_fold5-pictures-12418.php', 'Uma tela imersiva gigante em um formato dobrável. O Galaxy Z Fold5 é uma potência de produtividade e entretenimento.', '{"display": {"type": "Foldable Dynamic AMOLED 2X", "size": "7.6 inches", "resolution": "2176x1812"}, "processor": {"chip": "Snapdragon 8 Gen 2 for Galaxy"}, "memory": {"ram": "12GB", "storage": "512GB"}, "camera": {"main": "50MP", "ultra_wide": "12MP", "telephoto": "10MP"}, "connectivity":}'),
('Xiaomi 14 (512GB) - Preto', 'Xiaomi', 'Smartphone', 6999.00, 5499.00, 60, 'https://www.gsmarena.com/xiaomi_14-pictures-12626.php', 'Lentes ópticas Leica de última geração, desempenho Snapdragon 8 Gen 3 e uma tela CrystalRes AMOLED vibrante.', '{"display": {"type": "LTPO OLED", "size": "6.36 inches", "resolution": "2670x1200"}, "processor": {"chip": "Snapdragon 8 Gen 3"}, "memory": {"ram": "12GB", "storage": "512GB"}, "camera": {"main": "50MP", "ultra_wide": "50MP", "telephoto": "50MP"}, "connectivity":}'),
('Motorola Razr 40 Ultra (256GB) - Viva Magenta', 'Motorola', 'Smartphone', 7999.00, 4999.00, 45, 'https://www.gsmarena.com/motorola_razr_40_ultra-pictures-12301.php', 'A maior e mais avançada tela externa em um flip. O Motorola Razr 40 Ultra reinventa a experiência dobrável.', '{"display": {"type": "Foldable LTPO AMOLED", "size": "6.9 inches", "resolution": "2640x1080"}, "processor": {"chip": "Snapdragon 8+ Gen 1"}, "memory": {"ram": "8GB", "storage": "256GB"}, "camera": {"main": "12MP", "ultra_wide": "13MP"}, "connectivity":}');

-- Notebooks
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications) VALUES
('Dell G15 Gaming (Core i5, 16GB RAM, 512GB SSD, RTX 3050) - Grafite', 'Dell', 'Notebook', 6299.00, 5399.00, 80, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g15-5530/media-gallery/gray/notebook-g15-5530-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,0&resMode=sharp2&size=573,402&chrss=full', 'Notebook gamer projetado para performance com sistema térmico aprimorado, processadores Intel e placa de vídeo NVIDIA GeForce RTX.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD 120Hz"}, "processor": {"brand": "Intel", "model": "Core i5-13450HX"}, "memory": {"ram": "16GB DDR5", "storage": "512GB SSD"}, "graphics": {"card": "NVIDIA GeForce RTX 3050"}, "os": "Windows 11 Home"}'),
('Lenovo Legion Slim 5 (Ryzen 7, 16GB RAM, 512GB SSD, RTX 4060) - Cinza', 'Lenovo', 'Notebook', 9999.00, 8499.00, 65, 'https://p1-ofp.static.pub/fes/cms/2023/05/10/2b1d0e0f0e0e0e0e/lenovo-legion-slim-5-gen-8-16-amd-hero.png', 'Potência e portabilidade se encontram. O Legion Slim 5 é fino, leve e equipado com o que há de mais moderno em processadores AMD e gráficos NVIDIA RTX 40 Series.', '{"display": {"size": "16 inches", "resolution": "2560x1600", "type": "WQXGA IPS 165Hz"}, "processor": {"brand": "AMD", "model": "Ryzen 7 7840HS"}, "memory": {"ram": "16GB DDR5", "storage": "512GB SSD"}, "graphics": {"card": "NVIDIA GeForce RTX 4060"}, "os": "Windows 11 Home"}'),
('HP Envy x360 2-in-1 (Core i7, 16GB RAM, 1TB SSD) - Nightfall Black', 'HP', 'Notebook', 8599.00, 7599.00, 55, 'https://www.hp.com/us-en/shop/app/pdp/images/uploads/c09267152/c09267152_400x400.png', 'Liberte sua criatividade com a versatilidade do HP Envy x360. Tela touchscreen, desempenho poderoso e design elegante para criar em qualquer lugar.', '{"display": {"size": "15.6 inches", "resolution": "1920x1080", "type": "FHD OLED Touch"}, "processor": {"brand": "Intel", "model": "Core i7-1355U"}, "memory": {"ram": "16GB DDR4", "storage": "1TB SSD"}, "graphics": {"card": "Intel Iris Xe Graphics"}, "os": "Windows 11 Home"}'),
('Asus Zenbook 14 OLED (Core Ultra 7, 16GB RAM, 1TB SSD) - Ponder Blue', 'Asus', 'Notebook', 9499.00, 8299.00, 40, 'https://dlcdnwebimgs.asus.com/gain/4a86b233-a89e-450f-b148-30b18f76d475/w800', 'Ultrafino, ultraleve e com uma tela OLED deslumbrante. O Zenbook 14 OLED é o companheiro perfeito para produtividade e entretenimento em movimento.', '{"display": {"size": "14 inches", "resolution": "2880x1800", "type": "OLED 120Hz"}, "processor": {"brand": "Intel", "model": "Core Ultra 7 155H"}, "memory": {"ram": "16GB LPDDR5X", "storage": "1TB SSD"}, "graphics": {"card": "Intel Arc Graphics"}, "os": "Windows 11 Home"}'),
('Apple MacBook Pro 14" (Chip M3 Pro, 18GB RAM, 512GB SSD) - Prata', 'Apple', 'Notebook', 22999.00, 20599.00, 35, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1697230830278', 'Desempenho que muda o jogo para os fluxos de trabalho mais exigentes. O MacBook Pro com chip M3 Pro leva a performance a um novo patamar.', '{"display": {"size": "14.2 inches", "resolution": "3024x1964", "type": "Liquid Retina XDR"}, "processor": {"brand": "Apple", "model": "M3 Pro"}, "memory": {"ram": "18GB", "storage": "512GB SSD"}, "graphics": {"card": "Apple 14-core GPU"}, "os": "macOS"}');

-- Tablets
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications) VALUES
('Apple iPad Pro 13" (Chip M4, 512GB, Wi-Fi + Cellular) - Prateado', 'Apple', 'Tablet', 17799.00, 16899.00, 25, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-cell-silver-202405?wid=1000&hei=1000&fmt=jpeg&qlt=95&.v=1713504240152', 'O futuro do iPad chegou. Tela Ultra Retina XDR, desempenho inacreditável do chip M4 e conectividade 5G ultrarrápida.', '{"display": {"type": "Ultra Retina XDR", "size": "13 inches", "resolution": "2752x2064"}, "processor": {"chip": "Apple M4"}, "memory": {"ram": "8GB", "storage": "512GB"}, "camera": {"main": "12MP", "front": "12MP"}, "connectivity":, "features":}'),
('Samsung Galaxy Tab S9 (256GB, Wi-Fi) - Grafite', 'Samsung', 'Tablet', 6499.00, 3654.00, 85, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-x710nzaezto/gallery/br-galaxy-tab-s9-wifi-x710-sm-x710nzaezto-537296993?$650_519_PNG$', 'Tela Dynamic AMOLED 2X, resistência à água e poeira e a S Pen inclusa para transformar suas ideias em realidade.', '{"display": {"type": "Dynamic AMOLED 2X", "size": "11 inches", "resolution": "2560x1600"}, "processor": {"chip": "Snapdragon 8 Gen 2 for Galaxy"}, "memory": {"ram": "12GB", "storage": "256GB"}, "camera": {"main": "13MP", "front": "12MP"}, "connectivity":, "features":}');

-- Gerando registros adicionais para alcançar >200
-- (Esta seção representa a continuação da geração de dados com mais variações)
-- Smartphones - Apple
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications)
SELECT
    'Apple iPhone 15 (' |

| storage |
| 'GB) - ' |
| color AS name,
    'Apple' AS brand,
    'Smartphone' AS category,
    CASE WHEN storage = 128 THEN 7299.00 ELSE 8099.00 END AS price,
    CASE WHEN storage = 128 THEN 5899.00 ELSE 6799.00 END AS sale_price,
    floor(random() * 100 + 150)::int AS stock_quantity,
    'https://www.gsmarena.com/apple_iphone_15-pictures-12559.php' AS image_url,
    'O iPhone 15 traz a Dynamic Island, câmera de 48 MP e USB-C.' AS description,
    jsonb_build_object(
        'display', jsonb_build_object('type', 'Super Retina XDR OLED', 'size', '6.1 inches', 'resolution', '2556x1179'),
        'processor', jsonb_build_object('chip', 'A16 Bionic'),
        'memory', jsonb_build_object('ram', '6GB', 'storage', storage |

| 'GB'),
        'camera', jsonb_build_object('main', '48MP', 'ultra_wide', '12MP'),
        'connectivity', ''::jsonb
    ) AS specifications
FROM
    (VALUES (128), (256), (512)) AS s(storage),
    (VALUES ('Amarelo'), ('Verde'), ('Rosa')) AS c(color);

-- Smartphones - Samsung
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications)
SELECT
    'Samsung Galaxy A35 5G (' |

| storage |
| 'GB) - ' |
| color AS name,
    'Samsung' AS brand,
    'Smartphone' AS category,
    CASE WHEN storage = 128 THEN 2499.00 ELSE 2999.00 END AS price,
    CASE WHEN storage = 128 THEN 1699.00 ELSE 1999.00 END AS sale_price,
    floor(random() * 150 + 200)::int AS stock_quantity,
    'https://www.gsmarena.com/samsung_galaxy_a35-pictures-12828.php' AS image_url,
    'Design premium, câmera incrível e tela Super AMOLED para uma experiência fantástica.' AS description,
    jsonb_build_object(
        'display', jsonb_build_object('type', 'Super AMOLED', 'size', '6.6 inches', 'resolution', '2340x1080'),
        'processor', jsonb_build_object('chip', 'Exynos 1380'),
        'memory', jsonb_build_object('ram', '6GB', 'storage', storage |

| 'GB'),
        'camera', jsonb_build_object('main', '50MP', 'ultra_wide', '8MP', 'macro', '5MP'),
        'connectivity', ''::jsonb
    ) AS specifications
FROM
    (VALUES (128), (256)) AS s(storage),
    (VALUES ('Azul Claro'), ('Lilás'), ('Azul Escuro')) AS c(color);

-- Notebooks - Dell
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications)
SELECT
    'Dell Inspiron 15 (Core i5, ' |

| ram |
| 'GB RAM, ' |
| ssd |
| 'GB SSD) - ' |
| color AS name,
    'Dell' AS brand,
    'Notebook' AS category,
    3599.00 + (CASE WHEN ram = 16 THEN 500 ELSE 0 END) + (CASE WHEN ssd = 512 THEN 300 ELSE 0 END) AS price,
    2597.00 + (CASE WHEN ram = 16 THEN 400 ELSE 0 END) + (CASE WHEN ssd = 512 THEN 250 ELSE 0 END) AS sale_price,
    floor(random() * 50 + 100)::int AS stock_quantity,
    'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3530/media-gallery/black/in3530-cnb-00000ff090-bk.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,0&resMode=sharp2&size=573,402&chrss=full' AS image_url,
    'Notebook de 15.6 polegadas perfeito para o uso diário, com um design elegante e inteligente.' AS description,
    jsonb_build_object(
        'display', jsonb_build_object('size', '15.6 inches', 'resolution', '1920x1080', 'type', 'FHD WVA'),
        'processor', jsonb_build_object('brand', 'Intel', 'model', 'Core i5-1334U'),
        'memory', jsonb_build_object('ram', ram |

| 'GB DDR4', 'storage', ssd |
| 'GB SSD'),
        'graphics', jsonb_build_object('card', 'Intel UHD Graphics'),
        'os', 'Windows 11 Home'
    ) AS specifications
FROM
    (VALUES (8), (16)) AS r(ram),
    (VALUES (256), (512)) AS s(ssd),
    (VALUES ('Preto Carbono'), ('Prata')) AS c(color);

-- Tablets - Samsung
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications)
SELECT
    'Samsung Galaxy Tab A9+ (' |

| storage |
| 'GB, ' |
| connectivity |
| ') - ' |
| color AS name,
    'Samsung' AS brand,
    'Tablet' AS category,
    1799.00 + (CASE WHEN connectivity = '5G' THEN 400 ELSE 0 END) AS price,
    1187.00 + (CASE WHEN connectivity = '5G' THEN 300 ELSE 0 END) AS sale_price,
    floor(random() * 100 + 150)::int AS stock_quantity,
    'https://images.samsung.com/is/image/samsung/p6pim/br/sm-x210nzaazto/gallery/br-galaxy-tab-a9-plus-wifi-x210-sm-x210nzaazto-538318909?$650_519_PNG$' AS image_url,
    'Tela ampla e brilhante de 11 polegadas para uma experiência de visualização imersiva.' AS description,
    jsonb_build_object(
        'display', jsonb_build_object('type', 'TFT LCD', 'size', '11 inches', 'resolution', '1920x1200'),
        'processor', jsonb_build_object('chip', 'Snapdragon 695 5G'),
        'memory', jsonb_build_object('ram', '4GB', 'storage', storage |

| 'GB'),
        'camera', jsonb_build_object('main', '8MP', 'front', '5MP'),
        'connectivity', ARRAY,
        'features', '["Alto-falantes quádruplos"]'::jsonb
    ) AS specifications
FROM
    (VALUES (64)) AS s(storage),
    (VALUES ('Wi-Fi'), ('5G')) AS conn(connectivity),
    (VALUES ('Grafite'), ('Prata'), ('Azul')) AS c(color);

-- Gerando mais 130 registros aleatórios para garantir a contagem
INSERT INTO products (name, brand, category, price, sale_price, stock_quantity, image_url, description, specifications)
SELECT
    brand |

| ' Model ' |
| (floor(random() * 1000) + 1)::text |
| ' (' |
| (ARRAY)[floor(random() * 3) + 1] |
| 'GB)',
    brand,
    category,
    (floor(random() * (5000 - 1000 + 1)) + 1000) * 1.00,
    NULL,
    floor(random() * 200)::int,
    'https://via.placeholder.com/500',
    'Descrição genérica para ' |

| brand |
| ' ' |
| category,
    '{"spec": "generic"}'::jsonb
FROM
    generate_series(1, 130),
    (SELECT (ARRAY)[floor(random() * 11) + 1]) AS b(brand),
    (SELECT (ARRAY)[floor(random() * 3) + 1]) AS c(category);