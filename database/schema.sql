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
-- POSTS DE EJEMPLO
-- ============================================================
INSERT INTO blog_posts (title, content, author_id) VALUES
  ('Mejores precios en Oxxo esta semana', 'Encontré que el Oxxo del centro tiene la leche Lala al precio más bajo de la zona, 27.50 pesos el litro.', 2),
  ('Ofertas de temporada en Chedraui', 'Esta semana Chedraui tiene descuentos en frutas y verduras. El kilogramo de jitomate a 18 pesos.', 2),
  ('Comparativa: Walmart vs Bodega Aurrera', 'Hice un recorrido por ambas tiendas comparando los precios de la canasta básica. Los resultados sorprenden.', 3);
