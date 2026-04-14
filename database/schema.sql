-- ============================================================
-- RAPITI - Schema de base de datos
-- ============================================================

CREATE DATABASE IF NOT EXISTS rapiti
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rapiti;

-- ============================================================
-- TABLA: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          ENUM('admin', 'user', 'tienda') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(300) NOT NULL,
  content     TEXT NOT NULL,
  author_id   INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- USUARIOS DE PRUEBA
-- Contraseñas hasheadas con bcrypt (cost factor 10)
-- admin@rapiti.com   → admin123
-- user@rapiti.com    → user123
-- tienda@rapiti.com  → 12345678
-- ============================================================
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@rapiti.com',  '$2b$10$9QfhWlMiAcOPNSYeo4Qmxu5p8M4.Ko3jBIRYacr4aaJnRV4X28lN2', 'Administrador', 'admin'),
  ('user@rapiti.com',   '$2b$10$hkpUS5H2WGoKfF7ecU0rMeitWg9u0uYzFzLs5I2B4Iwh5.RYiCLWu', 'Usuario Común', 'user'),
  ('tienda@rapiti.com', '$2b$10$WVYHM21i4NdOnTUXRLoVhe4i5CETcK92SlTzCKnuzUbvyvUnoDGHS', 'Tienda Rapiti',  'tienda');

-- ============================================================
-- PRODUCTOS DE EJEMPLO
-- ============================================================
INSERT INTO products (name, price, image_url) VALUES
  ('Leche Lala 1L',          28.50, 'https://arteli.vtexassets.com/arquivos/ids/258200/7501020526066_02.jpg?v=638635810988400000'),
  ('Pan Bimbo Grande',       45.00, 'https://www.mayoreototal.mx/cdn/shop/files/Capturadepantalla2024-11-04ala_s_6.29.48a.m._1024x1024@2x.png?v=1730723418'),
  ('Huevo San Juan 12pz',    52.90, 'https://res.cloudinary.com/riqra/image/upload/v1668469336/sellers/7/ackv0tvbffgnzzres4pw.jpg'),
  ('Aceite 123 1L',          38.00, 'https://carritolatino.com/cdn/shop/files/1_25cb48a4-380d-4a40-9a01-d81b0b13d4ee.png?v=1756873015'),
  ('Arroz Verde Valle 1kg',  29.50, 'https://superlavioleta.com/cdn/shop/files/PrecoMexicana140g.png?v=1753108914'),
  ('Frijoles La Costeña 560g', 22.00, 'https://www.pidefacilraul.com/cms/wp-content/uploads/2022/09/12-098.jpg');

-- ============================================================
-- TABLA: stores
-- ============================================================
CREATE TABLE IF NOT EXISTS stores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(200) NOT NULL,
  categoria   VARCHAR(100) NOT NULL,
  direccion   VARCHAR(300) NOT NULL,
  horario     VARCHAR(200),
  abierto     BOOLEAN DEFAULT true,
  lat         DECIMAL(10, 8),
  lng         DECIMAL(11, 8),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: store_products
-- ============================================================
CREATE TABLE IF NOT EXISTS store_products (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  store_id  INT NOT NULL,
  nombre    VARCHAR(200) NOT NULL,
  precio    DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- ============================================================
-- TIENDAS DE EJEMPLO
-- ============================================================
INSERT INTO stores (nombre, categoria, direccion, horario, abierto, lat, lng) VALUES
  ('Abarrotes Don José',        'Abarrotes',  'Calle 5 de Mayo #123, Centro, Tehuacán',       'Lun-Sáb 8:00–20:00, Dom 9:00–14:00', true,  18.4653, -97.3925),
  ('Farmacia San Rafael',       'Farmacia',   'Av. Independencia #456, Tehuacán',              'Lun-Dom 7:00–22:00',                  true,  18.4660, -97.3930),
  ('Papelería El Estudiante',   'Papelería',  'Blvd. Las Torres #78, Tehuacán',                'Lun-Vie 9:00–18:00',                  false, 18.4640, -97.3910),
  ('Mini Super La Esquina',     'Abarrotes',  'Calle Morelos #34, Tehuacán',                   'Lun-Dom 6:00–23:00',                  true,  18.4670, -97.3940),
  ('Ferretería El Tornillo',    'Ferretería', 'Av. Reforma #210, Tehuacán',                    'Lun-Sáb 8:00–18:00',                  false, 18.4650, -97.3950),
  ('Verduras y Frutas Lupita',  'Verdulería', 'Mercado Municipal Local 12, Tehuacán',          'Lun-Dom 6:00–15:00',                  true,  18.4655, -97.3920),
  ('Carnicería El Rancho',      'Carnicería', 'Calle Hidalgo #89, Col. Centro, Tehuacán',      'Lun-Sáb 7:00–18:00',                  true,  18.4648, -97.3935),
  ('Tortillería Doña Martha',   'Tortillería','Calle Revolución #12, Col. Reforma, Tehuacán',  'Lun-Sáb 6:00–14:00',                  true,  18.4662, -97.3918),
  ('Dulcería y Botanas Lupillo','Dulcería',   'Mercado Municipal Local 45, Tehuacán',           'Lun-Dom 8:00–20:00',                  true,  18.4657, -97.3922),
  ('Farmacia del Ahorro Centro','Farmacia',   'Av. Reforma #345, Centro, Tehuacán',             'Lun-Dom 8:00–22:00',                  true,  18.4665, -97.3928);

INSERT INTO store_products (store_id, nombre, precio) VALUES
  (1, 'Leche Lala 1L', 28.50),
  (1, 'Pan Bimbo Grande', 45.00),
  (1, 'Arroz Verde Valle 1kg', 29.50),
  (1, 'Frijoles La Costeña 560g', 22.00),
  (1, 'Aceite 123 1L', 38.00),
  (1, 'Huevo San Juan 12pz', 52.90),
  (1, 'Azúcar Estándar 1kg', 24.00),
  (1, 'Sal La Fina 1kg', 12.00),
  (1, 'Café Nescafé 200g', 89.00),
  (1, 'Atún Dolores 140g', 18.50),
  (2, 'Paracetamol 500mg', 25.00),
  (2, 'Ibuprofeno 400mg', 30.00),
  (2, 'Vitamina C 1g', 45.00),
  (2, 'Alcohol 70% 500ml', 35.00),
  (2, 'Omeprazol 20mg', 55.00),
  (3, 'Cuaderno Profesional', 22.00),
  (3, 'Bolígrafos Bic x3', 15.00),
  (3, 'Tijeras escolares', 28.00),
  (4, 'Coca Cola 600ml', 18.00),
  (4, 'Sabritas Clásicas 45g', 16.00),
  (4, 'Agua Bonafont 1L', 12.00),
  (4, 'Galletas Marías 200g', 19.50),
  (4, 'Jabón Zote', 14.00),
  (5, 'Foco LED 9W', 45.00),
  (5, 'Cinta canela 48mm', 22.00),
  (5, 'Tornillos x100', 35.00),
  (6, 'Jitomate por kg', 18.00),
  (6, 'Aguacate pz', 12.00),
  (6, 'Cebolla por kg', 14.00),
  (6, 'Chile serrano por kg', 25.00),
  (6, 'Limón por kg', 20.00),
  (6, 'Papa por kg', 16.00),
  (7, 'Bistec de res por kg', 180.00),
  (7, 'Pollo entero por kg', 75.00),
  (7, 'Chorizo por kg', 95.00),
  (7, 'Costilla de cerdo por kg', 120.00),
  (8, 'Tortillas de maíz 1kg', 18.00),
  (8, 'Tortillas de harina 12pz', 22.00),
  (8, 'Tostadas 200g', 25.00),
  (9, 'Palomitas microondas', 24.00),
  (9, 'Gansito', 16.00),
  (9, 'Churrumais 65g', 18.00),
  (9, 'Takis Fuego 62g', 20.00),
  (10, 'Omeprazol 20mg x14', 48.00),
  (10, 'Antigripal x10', 65.00),
  (10, 'Crema hidratante 200ml', 89.00),
  (10, 'Shampoo Head & Shoulders 400ml', 98.00);

-- ============================================================
-- POSTS DE EJEMPLO
-- ============================================================
INSERT INTO blog_posts (title, content, author_id) VALUES
  ('Mejores precios en Oxxo esta semana', 'Encontré que el Oxxo del centro tiene la leche Lala al precio más bajo de la zona, 27.50 pesos el litro.', 2),
  ('Ofertas de temporada en Chedraui', 'Esta semana Chedraui tiene descuentos en frutas y verduras. El kilogramo de jitomate a 18 pesos.', 2),
  ('Comparativa: Walmart vs Bodega Aurrera', 'Hice un recorrido por ambas tiendas comparando los precios de la canasta básica. Los resultados sorprenden.', 3);
