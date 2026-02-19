import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
