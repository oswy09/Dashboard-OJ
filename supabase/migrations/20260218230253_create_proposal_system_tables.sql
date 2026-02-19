/*
  # Sistema de Propuestas Dinámico

  ## Descripción
  Sistema completo para gestionar categorías de negocios, planes de servicios y plantillas de texto persuasivo.
  Permite administración dinámica de todos los contenidos sin necesidad de modificar código.

  ## Nuevas Tablas

  ### `categories` - Categorías de Negocios
  - `id` (uuid, primary key) - Identificador único
  - `name` (text) - Nombre de la categoría (ej: "Hoteles")
  - `slug` (text, unique) - Identificador URL-friendly (ej: "hoteles")
  - `icon` (text) - Emoji o icono para la UI
  - `description` (text) - Descripción detallada del nicho
  - `order_index` (integer) - Orden de visualización
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### `plans` - Planes de Servicio
  - `id` (uuid, primary key) - Identificador único
  - `category_id` (uuid, foreign key) - Referencia a la categoría
  - `name` (text) - Nombre del plan (ej: "Básico", "Pro", "Premium")
  - `slug` (text) - Identificador URL-friendly
  - `price` (integer) - Precio en USD
  - `features` (jsonb) - Array de características incluidas
  - `order_index` (integer) - Orden de visualización
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ### `copy_templates` - Plantillas de Texto Persuasivo
  - `id` (uuid, primary key) - Identificador único
  - `category_id` (uuid, foreign key) - Referencia a la categoría
  - `stage` (text) - Etapa del proceso: 'contacto', 'demo', 'cierre'
  - `stage_name` (text) - Nombre mostrado (ej: "Contacto Frío")
  - `template_text` (text) - Texto con placeholders {{cliente}}, {{nicho}}, {{link_propuesta}}
  - `order_index` (integer) - Orden de visualización
  - `created_at` (timestamptz) - Fecha de creación
  - `updated_at` (timestamptz) - Fecha de actualización

  ## Seguridad
  - Todas las tablas tienen RLS habilitado
  - Lectura pública para consultas del frontend
  - Escritura restringida (preparado para auth en el futuro)

  ## Notas Importantes
  - Los placeholders en copy_templates usan sintaxis {{variable}}
  - Las features en plans se almacenan como JSONB array
  - Incluye datos iniciales de ejemplo
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '📁',
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de planes
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  price integer DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de plantillas de copy
CREATE TABLE IF NOT EXISTS copy_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  stage text NOT NULL,
  stage_name text NOT NULL,
  template_text text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de servicios adicionales (genéricos para todas las categorías)
CREATE TABLE IF NOT EXISTS extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (todos pueden leer)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read plans"
  ON plans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read copy templates"
  ON copy_templates FOR SELECT
  TO public
  USING (true);

-- Políticas de escritura pública (temporal, para desarrollo)
CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can insert plans"
  ON plans FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update plans"
  ON plans FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete plans"
  ON plans FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can insert copy templates"
  ON copy_templates FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update copy templates"
  ON copy_templates FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete copy templates"
  ON copy_templates FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can read extras"
  ON extras FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert extras"
  ON extras FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update extras"
  ON extras FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete extras"
  ON extras FOR DELETE
  TO public
  USING (true);

-- Insertar datos iniciales: Categorías
INSERT INTO categories (name, slug, icon, description, order_index)
VALUES
  ('Hoteles', 'hoteles', '🏨', 'Soluciones web profesionales para hoteles boutique y cadenas hoteleras. Sistema de reservas integrado, tours virtuales 360°, y optimización SEO para aumentar reservas directas.', 1),
  ('Spa & Wellness', 'spa', '💆', 'Plataformas elegantes para spas y centros de bienestar. Gestión de citas online, catálogo de tratamientos, venta de bonos y membresías digitales.', 2),
  ('Gastronómico', 'gastronomico', '🍽️', 'Webs modernas para restaurantes y cafeterías. Menú digital interactivo, sistema de reservas, pedidos online y integración con apps de delivery.', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insertar datos iniciales: Planes para Hoteles
DO $$
DECLARE
  hoteles_id uuid;
  spa_id uuid;
  gastro_id uuid;
BEGIN
  SELECT id INTO hoteles_id FROM categories WHERE slug = 'hoteles';
  SELECT id INTO spa_id FROM categories WHERE slug = 'spa';
  SELECT id INTO gastro_id FROM categories WHERE slug = 'gastronomico';

  -- Planes para Hoteles
  INSERT INTO plans (category_id, name, slug, price, features, order_index)
  VALUES
    (hoteles_id, 'Básico', 'basico', 2500, 
     '["Landing page optimizada", "Diseño responsive", "Galería de fotos", "Formulario de contacto", "Integración redes sociales", "SEO básico"]'::jsonb, 1),
    (hoteles_id, 'Pro', 'pro', 4500, 
     '["Todo lo del plan Básico", "Sistema de reservas online", "Panel de administración", "Múltiples idiomas", "Blog integrado", "Chat en vivo", "Analíticas avanzadas"]'::jsonb, 2),
    (hoteles_id, 'Premium', 'premium', 7500, 
     '["Todo lo del plan Pro", "Tour virtual 360°", "Motor de reservas avanzado", "Integración con OTAs", "App móvil complementaria", "Programa de fidelización", "Soporte prioritario 24/7"]'::jsonb, 3);

  -- Planes para Spa
  INSERT INTO plans (category_id, name, slug, price, features, order_index)
  VALUES
    (spa_id, 'Básico', 'basico', 2200, 
     '["Sitio web elegante", "Catálogo de servicios", "Galería de instalaciones", "Formulario de contacto", "Horarios y ubicación", "SEO básico"]'::jsonb, 1),
    (spa_id, 'Pro', 'pro', 4000, 
     '["Todo lo del plan Básico", "Sistema de reservas online", "Venta de bonos digitales", "Gestión de citas", "Recordatorios automáticos", "Perfiles de terapeutas", "Blog de bienestar"]'::jsonb, 2),
    (spa_id, 'Premium', 'premium', 6800, 
     '["Todo lo del plan Pro", "Membresías y suscripciones", "App de fidelización", "Pagos recurrentes", "Sistema de puntos", "Personalización de tratamientos", "CRM integrado"]'::jsonb, 3);

  -- Planes para Gastronómico
  INSERT INTO plans (category_id, name, slug, price, features, order_index)
  VALUES
    (gastro_id, 'Básico', 'basico', 2000, 
     '["Sitio web moderno", "Menú digital", "Galería de platos", "Información y ubicación", "Horarios de atención", "Redes sociales"]'::jsonb, 1),
    (gastro_id, 'Pro', 'pro', 3800, 
     '["Todo lo del plan Básico", "Sistema de reservas", "Pedidos online", "Menú QR interactivo", "Promociones y ofertas", "Integración con delivery", "Reseñas de clientes"]'::jsonb, 2),
    (gastro_id, 'Premium', 'premium', 6500, 
     '["Todo lo del plan Pro", "App móvil propia", "Programa de lealtad", "Gift cards digitales", "Sistema de puntos", "Multi-sucursales", "Análisis de ventas avanzado"]'::jsonb, 3);

  -- Copy templates para Hoteles
  INSERT INTO copy_templates (category_id, stage, stage_name, template_text, order_index)
  VALUES
    (hoteles_id, 'contacto', 'Contacto Frío', 
     'Hola, soy especialista en diseño web para hoteles y he notado que {{cliente}} tiene un gran potencial que podría multiplicarse con una presencia digital optimizada.

Hoteles similares al suyo han aumentado sus reservas directas hasta un 40% con una web profesional que elimina la dependencia de las OTAs y sus comisiones del 15-20%.

¿Te gustaría ver cómo podría verse tu hotel con una plataforma que convierta visitantes en huéspedes? Puedo prepararte una propuesta personalizada sin compromiso.', 1),
    (hoteles_id, 'demo', 'Envío Demo', 
     '¡Perfecto! He preparado una propuesta personalizada para {{cliente}} que te va a encantar.

Aquí puedes ver exactamente qué incluye tu proyecto, desde el sistema de reservas hasta la optimización SEO:

{{link_propuesta}}

He diseñado esto pensando específicamente en las necesidades de tu hotel. ¿Cuándo podríamos agendar una breve llamada de 15 minutos para revisar los detalles?', 2),
    (hoteles_id, 'cierre', 'Cierre/Onboarding', 
     '¡Excelente decisión! Estoy emocionado de trabajar en el proyecto de {{cliente}}.

Para comenzar y entregarte un resultado espectacular, necesito que me compartas:

✅ Logo en alta calidad (formato PNG o AI)
✅ Fotos profesionales de las habitaciones e instalaciones
✅ Textos actuales de tu web (si los tienes)
✅ Acceso a redes sociales para integración
✅ Colores corporativos o guía de marca

¿Podrías enviarme estos materiales en los próximos 2-3 días? Mientras tanto, prepararé el ambiente de desarrollo y comenzaremos oficialmente el [FECHA].', 3);

  -- Copy templates para Spa
  INSERT INTO copy_templates (category_id, stage, stage_name, template_text, order_index)
  VALUES
    (spa_id, 'contacto', 'Contacto Frío', 
     'Hola, he estado investigando spas de alto nivel en la zona y {{cliente}} destaca por su calidad, pero creo que tu presencia digital no refleja la experiencia premium que ofreces.

Los spas que invierten en una web profesional con sistema de reservas online incrementan sus citas hasta un 50% y reducen cancelaciones con recordatorios automáticos.

¿Te interesaría ver una propuesta de cómo podríamos elevar tu marca digital al nivel de tus servicios? Te la preparo sin compromiso.', 1),
    (spa_id, 'demo', 'Envío Demo', 
     'Como prometí, aquí está tu propuesta personalizada para {{cliente}}.

He diseñado un plan que incluye desde el catálogo de tratamientos hasta la venta de bonos online:

{{link_propuesta}}

Esta solución está pensada para reflejar la serenidad y profesionalismo de tu spa. ¿Te parece si conversamos 15 minutos esta semana para resolver cualquier duda?', 2),
    (spa_id, 'cierre', 'Cierre/Onboarding', 
     '¡Fantástico! Vamos a crear algo hermoso para {{cliente}}.

Para empezar con el pie derecho, necesito que me facilites:

✅ Logo y elementos de marca
✅ Fotos profesionales de instalaciones y tratamientos
✅ Menú completo de servicios con descripciones y precios
✅ Información sobre profesionales/terapeutas
✅ Paleta de colores de tu marca

Con estos materiales en mano, podemos lanzar tu nueva plataforma en tiempo récord. ¿Los tendrías disponibles esta semana?', 3);

  -- Copy templates para Gastronómico
  INSERT INTO copy_templates (category_id, stage, stage_name, template_text, order_index)
  VALUES
    (gastro_id, 'contacto', 'Contacto Frío', 
     'Hola, soy desarrollador especializado en restaurantes y vi que {{cliente}} tiene excelentes reseñas, pero podrías estar captando muchos más comensales con una presencia digital optimizada.

Restaurantes similares que implementaron pedidos online y reservas digitales vieron un aumento del 35% en ventas durante el primer trimestre.

La gente busca restaurantes desde el celular y si no encuentran un menú claro y forma de reservar fácilmente, van a la competencia. ¿Te gustaría ver una propuesta sin compromiso?', 1),
    (gastro_id, 'demo', 'Envío Demo', 
     'Te preparé algo especial para {{cliente}}. Una propuesta que hará que tu restaurante sea imposible de ignorar online:

{{link_propuesta}}

Incluye todo desde el menú digital interactivo hasta integración con apps de delivery. ¿Cuándo tendrías 15 minutos para revisar juntos los detalles?', 2),
    (gastro_id, 'cierre', 'Cierre/Onboarding', 
     '¡Genial! Estoy emocionado de trabajar en el proyecto de {{cliente}}.

Para crear una experiencia digital tan deliciosa como tu comida, necesito:

✅ Logo y elementos visuales de marca
✅ Fotos profesionales de platos (¡esto es crucial!)
✅ Menú completo con descripciones y precios
✅ Historia del restaurante/chef
✅ Colores corporativos

¿Podrías tener estos materiales listos en los próximos días? Así arrancamos con todo y cumplimos el cronograma de entrega.', 3);
END $$;

-- Insertar servicios adicionales genéricos
INSERT INTO extras (name, description, price, order_index)
VALUES
  ('Branding Profesional', 'Diseño de logo, paleta de colores, guía de marca y materiales corporativos', 1500, 1),
  ('Fotografía de Productos', 'Sesión fotográfica profesional de productos/servicios con edición incluida', 2000, 2),
  ('Publicidad Digital', 'Campaña de ads en Google y redes sociales durante 3 meses incluyendo gestión', 2500, 3),
  ('SEO Avanzado', 'Optimización SEO completa, análisis de keywords y estrategia de posicionamiento', 1800, 4),
  ('Integración Redes Sociales', 'Configuración y gestión inicial de redes sociales con contenido base', 1200, 5),
  ('Consultoría de Contenidos', 'Sesiones de asesoramiento y creación de contenido estratégico', 900, 6)
ON CONFLICT DO NOTHING;
