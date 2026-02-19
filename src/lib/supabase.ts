import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
let isSupabaseAvailable = false;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseAvailable = true;
    console.log('Supabase conectado correctamente');
  } else {
    console.warn('Variables de entorno de Supabase no encontradas. Usando datos mock.');
  }
} catch (error) {
  console.error('Error al conectar con Supabase:', error);
  console.warn('Usando datos mock como fallback.');
}

export { supabase, isSupabaseAvailable };

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price_cop: number;
  price_usd: number;
  currency: string;
  features: string[];
  description?: string;
  result?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CopyTemplate {
  id: string;
  category_id: string;
  stage: string;
  stage_name: string;
  template_text: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price_cop: number;
  price_usd: number;
  currency: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
