-- =====================================================
-- POLÍTICAS RLS PARA SUPABASE
-- Script para habilitar RLS y crear políticas de acceso
-- =====================================================

-- Habilitar RLS en las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABLA CATEGORIES
-- =====================================================

-- Política para permitir lectura pública de categorías
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT
  USING (true);

-- Política para permitir inserción pública de categorías (opcional)
CREATE POLICY "Allow public insert on categories" ON categories
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir actualización pública de categorías (opcional)
CREATE POLICY "Allow public update on categories" ON categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA TABLA PRODUCTS
-- =====================================================

-- Política para permitir lectura pública de productos activos
CREATE POLICY "Allow public read access on active products" ON products
  FOR SELECT
  USING (is_active = true);

-- Política para permitir lectura completa de productos (incluyendo inactivos)
CREATE POLICY "Allow public read access on all products" ON products
  FOR SELECT
  USING (true);

-- Política para permitir inserción pública de productos
CREATE POLICY "Allow public insert on products" ON products
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir actualización pública de productos
CREATE POLICY "Allow public update on products" ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política para permitir eliminación pública de productos
CREATE POLICY "Allow public delete on products" ON products
  FOR DELETE
  USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CREADAS
-- =====================================================

-- Ver políticas de la tabla categories
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'categories';

-- Ver políticas de la tabla products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 
-- 1. Ve a Supabase Dashboard > SQL Editor
-- 2. Copia y pega este script completo
-- 3. Ejecuta el script
-- 4. Verifica que las políticas se crearon correctamente
-- 5. Prueba las consultas desde tu aplicación
-- 
-- NOTA: Estas políticas permiten acceso público completo.
-- En producción, considera implementar autenticación y
-- políticas más restrictivas basadas en roles de usuario.
-- =====================================================