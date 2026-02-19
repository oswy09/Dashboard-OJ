import type { Category, Plan, CopyTemplate, Extra } from '../lib/supabase';

export const getDefaultCategories = (): Category[] => [
  {
    id: 'cat-hoteles',
    name: 'Hoteles',
    slug: 'hoteles',
    icon: '🏨',
    description: 'Gestión completa de marketing para hoteles',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-spa',
    name: 'Spa',
    slug: 'spa',
    icon: '💆',
    description: 'Marketing especializado para spas y centros de bienestar',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-gastronomico',
    name: 'Gastronómico',
    slug: 'gastronomico',
    icon: '🍽️',
    description: 'Soluciones de marketing para restaurantes y establecimientos gastronómicos',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getDefaultPlans = (): Plan[] => [
  {
    id: 'plan-hotel-basico',
    category_id: 'cat-hoteles',
    name: 'Plan Básico',
    slug: 'hotel-basico',
    price_cop: 800000,
    price_usd: 200,
    currency: 'COP',
    features: ['15 publicaciones mensuales', 'Diseño de contenido', 'Gestión de 3 redes sociales', 'Respuesta a comentarios'],
    description: 'Ideal para hoteles boutique',
    result: 'Mayor visibilidad online y engagement con huéspedes',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-hotel-premium',
    category_id: 'cat-hoteles',
    name: 'Plan Premium',
    slug: 'hotel-premium',
    price_cop: 1500000,
    price_usd: 375,
    currency: 'COP',
    features: ['30 publicaciones mensuales', 'Fotografía profesional', 'Gestión de 5 redes', 'Campañas publicitarias', 'Reportes detallados'],
    description: 'Para hoteles de lujo',
    result: 'Incremento en reservas directas y presencia de marca premium',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-spa-basico',
    category_id: 'cat-spa',
    name: 'Plan Wellness',
    slug: 'spa-wellness',
    price_cop: 600000,
    price_usd: 150,
    currency: 'COP',
    features: ['12 publicaciones mensuales', 'Diseño relajante', 'Gestión de 2 redes', 'Promociones especiales'],
    description: 'Perfecto para spas locales',
    result: 'Aumento en reservas de tratamientos',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-gastronomico-basico',
    category_id: 'cat-gastronomico',
    name: 'Plan Degustación',
    slug: 'gastronomico-degustacion',
    price_cop: 700000,
    price_usd: 175,
    currency: 'COP',
    features: ['20 publicaciones mensuales', 'Fotografía gastronómica', 'Stories diarias', 'Gestión de reservas online'],
    description: 'Ideal para restaurantes',
    result: 'Mayor afluencia de comensales',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getDefaultCopyTemplates = (): CopyTemplate[] => [
  {
    id: 'copy-hotel-intro',
    category_id: 'cat-hoteles',
    stage: 'intro',
    stage_name: 'Introducción',
    template_text: 'Estimado/a {{client_name}},\n\nNos complace presentarle nuestra propuesta de marketing digital especializada para {{hotel_name}}.',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'copy-spa-intro',
    category_id: 'cat-spa',
    stage: 'intro',
    stage_name: 'Introducción',
    template_text: 'Hola {{client_name}},\n\nQueremos ayudar a {{spa_name}} a alcanzar la paz y el equilibrio también en su presencia digital.',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'copy-gastro-intro',
    category_id: 'cat-gastronomico',
    stage: 'intro',
    stage_name: 'Introducción',
    template_text: 'Querido/a {{client_name}},\n\nTe presentamos una propuesta deliciosa para hacer crecer {{restaurant_name}} en el mundo digital.',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getDefaultExtras = (): Extra[] => [
  {
    id: 'extra-video',
    name: 'Video Promocional',
    description: 'Video profesional de 30-60 segundos',
    price_cop: 400000,
    price_usd: 100,
    currency: 'COP',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'extra-fotografia',
    name: 'Sesión Fotográfica',
    description: 'Sesión profesional de 2 horas con edición incluida',
    price_cop: 600000,
    price_usd: 150,
    currency: 'COP',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockCategories = getDefaultCategories();
export const mockPlans = getDefaultPlans();
export const mockCopyTemplates = getDefaultCopyTemplates();
export const mockExtras = getDefaultExtras();
