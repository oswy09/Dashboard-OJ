import type { Category, Plan, CopyTemplate, Extra } from '../lib/supabase';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Redes Sociales',
    slug: 'redes-sociales',
    icon: '📱',
    description: 'Gestión completa de redes sociales',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Publicidad Digital',
    slug: 'publicidad-digital',
    icon: '🎯',
    description: 'Campañas publicitarias digitales',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockPlans: Plan[] = [
  {
    id: '1',
    category_id: '1',
    name: 'Plan Básico',
    slug: 'basico',
    price_cop: 500000,
    price_usd: 125,
    currency: 'COP',
    features: ['10 publicaciones mensuales', 'Diseño de contenido', 'Gestión de 2 redes'],
    description: 'Ideal para emprendimientos',
    result: 'Mayor presencia en redes sociales',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    category_id: '1',
    name: 'Plan Premium',
    slug: 'premium',
    price_cop: 1200000,
    price_usd: 300,
    currency: 'COP',
    features: ['30 publicaciones mensuales', 'Diseño premium', 'Gestión de 5 redes', 'Reportes mensuales'],
    description: 'Para empresas establecidas',
    result: 'Crecimiento significativo en engagement',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockCopyTemplates: CopyTemplate[] = [
  {
    id: '1',
    category_id: '1',
    stage: 'intro',
    stage_name: 'Introducción',
    template_text: 'Hola {{client_name}}, te presentamos nuestra propuesta para {{service_name}}.',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockExtras: Extra[] = [
  {
    id: '1',
    name: 'Video Promocional',
    description: 'Video profesional de 30 segundos',
    price_cop: 300000,
    price_usd: 75,
    currency: 'COP',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
