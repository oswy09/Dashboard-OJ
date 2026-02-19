import type { Category, Plan, CopyTemplate, Extra } from './supabase';
import type { BookingMode } from '../composables/useData';

const STORAGE_KEYS = {
  CATEGORIES: 'proposal_categories',
  PLANS: 'proposal_plans',
  COPY_TEMPLATES: 'proposal_copy_templates',
  EXTRAS: 'proposal_extras',
  BOOKING_MODES: 'proposal_booking_modes',
  INITIALIZED: 'proposal_initialized'
};

export const localStorageDB = {
  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  setCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getPlans(): Plan[] {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    return data ? JSON.parse(data) : [];
  },

  setPlans(plans: Plan[]): void {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  getCopyTemplates(): CopyTemplate[] {
    const data = localStorage.getItem(STORAGE_KEYS.COPY_TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  setCopyTemplates(templates: CopyTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.COPY_TEMPLATES, JSON.stringify(templates));
  },

  getExtras(): Extra[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXTRAS);
    return data ? JSON.parse(data) : [];
  },

  setExtras(extras: Extra[]): void {
    localStorage.setItem(STORAGE_KEYS.EXTRAS, JSON.stringify(extras));
  },

  getBookingModes(): BookingMode[] {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKING_MODES);
    return data ? JSON.parse(data) : [];
  },

  setBookingModes(bookingModes: BookingMode[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKING_MODES, JSON.stringify(bookingModes));
  },

  isInitialized(): boolean {
    return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
  },

  setInitialized(): void {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};
