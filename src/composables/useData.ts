import { ref, computed } from 'vue';
import { supabase, isSupabaseAvailable, type Category, type Plan, type CopyTemplate, type Extra } from '../lib/supabase';
import { getDefaultCategories, getDefaultPlans, getDefaultCopyTemplates, getDefaultExtras } from '../data/mockData';
import { localStorageDB } from '../lib/localStorage';

const categories = ref<Category[]>([]);
const plans = ref<Plan[]>([]);
const copyTemplates = ref<CopyTemplate[]>([]);
const extras = ref<Extra[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const usingLocalStorage = ref(!isSupabaseAvailable);

const initializeLocalStorage = () => {
  if (!localStorageDB.isInitialized()) {
    console.log('Inicializando datos por defecto en localStorage');
    localStorageDB.setCategories(getDefaultCategories());
    localStorageDB.setPlans(getDefaultPlans());
    localStorageDB.setCopyTemplates(getDefaultCopyTemplates());
    localStorageDB.setExtras(getDefaultExtras());
    localStorageDB.setInitialized();
  }
};

export function useData() {
  const loadCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        initializeLocalStorage();
        categories.value = localStorageDB.getCategories();
        usingLocalStorage.value = true;
        return;
      }

      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

      if (err) throw err;
      categories.value = data || [];
      usingLocalStorage.value = false;
    } catch (e) {
      console.error('Error loading categories:', e);
      initializeLocalStorage();
      categories.value = localStorageDB.getCategories();
      usingLocalStorage.value = true;
    } finally {
      loading.value = false;
    }
  };

  const loadPlans = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        initializeLocalStorage();
        plans.value = localStorageDB.getPlans();
        usingLocalStorage.value = true;
        return;
      }

      const { data, error: err } = await supabase
        .from('plans')
        .select('*')
        .order('order_index');

      if (err) throw err;
      plans.value = data || [];
      usingLocalStorage.value = false;
    } catch (e) {
      console.error('Error loading plans:', e);
      initializeLocalStorage();
      plans.value = localStorageDB.getPlans();
      usingLocalStorage.value = true;
    } finally {
      loading.value = false;
    }
  };

  const loadCopyTemplates = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        initializeLocalStorage();
        copyTemplates.value = localStorageDB.getCopyTemplates();
        usingLocalStorage.value = true;
        return;
      }

      const { data, error: err } = await supabase
        .from('copy_templates')
        .select('*')
        .order('order_index');

      if (err) throw err;
      copyTemplates.value = data || [];
      usingLocalStorage.value = false;
    } catch (e) {
      console.error('Error loading copy templates:', e);
      initializeLocalStorage();
      copyTemplates.value = localStorageDB.getCopyTemplates();
      usingLocalStorage.value = true;
    } finally {
      loading.value = false;
    }
  };

  const loadExtras = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        initializeLocalStorage();
        extras.value = localStorageDB.getExtras();
        usingLocalStorage.value = true;
        return;
      }

      const { data, error: err } = await supabase
        .from('extras')
        .select('*')
        .order('order_index');

      if (err) throw err;
      extras.value = data || [];
      usingLocalStorage.value = false;
    } catch (e) {
      console.error('Error loading extras:', e);
      initializeLocalStorage();
      extras.value = localStorageDB.getExtras();
      usingLocalStorage.value = true;
    } finally {
      loading.value = false;
    }
  };

  const loadAll = async () => {
    await Promise.all([
      loadCategories(),
      loadPlans(),
      loadCopyTemplates(),
      loadExtras()
    ]);
  };

  const getPlansByCategory = (categoryId: string) => {
    return computed(() =>
      plans.value.filter(p => p.category_id === categoryId)
    );
  };

  const getCopyTemplatesByCategory = (categoryId: string) => {
    return computed(() =>
      copyTemplates.value.filter(c => c.category_id === categoryId)
    );
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const newCategory: Category = {
          ...category,
          id: localStorageDB.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const allCategories = localStorageDB.getCategories();
        allCategories.push(newCategory);
        localStorageDB.setCategories(allCategories);
        categories.value = allCategories;
        return newCategory;
      }

      const { data, error: err } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (err) throw err;
      if (data) {
        categories.value.push(data);
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error adding category';
      console.error('Error adding category:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allCategories = localStorageDB.getCategories();
        const index = allCategories.findIndex(c => c.id === id);
        if (index !== -1) {
          allCategories[index] = {
            ...allCategories[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorageDB.setCategories(allCategories);
          categories.value = allCategories;
          return allCategories[index];
        }
        throw new Error('Category not found');
      }

      const { data, error: err } = await supabase
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (data) {
        const index = categories.value.findIndex(c => c.id === id);
        if (index !== -1) {
          categories.value[index] = data;
        }
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error updating category';
      console.error('Error updating category:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allCategories = localStorageDB.getCategories();
        const filtered = allCategories.filter(c => c.id !== id);
        localStorageDB.setCategories(filtered);
        categories.value = filtered;
        return;
      }

      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;
      categories.value = categories.value.filter(c => c.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error deleting category';
      console.error('Error deleting category:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addPlan = async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const newPlan: Plan = {
          ...plan,
          id: localStorageDB.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const allPlans = localStorageDB.getPlans();
        allPlans.push(newPlan);
        localStorageDB.setPlans(allPlans);
        plans.value = allPlans;
        return newPlan;
      }

      const { data, error: err } = await supabase
        .from('plans')
        .insert([plan])
        .select()
        .single();

      if (err) throw err;
      if (data) {
        plans.value.push(data);
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error adding plan';
      console.error('Error adding plan:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allPlans = localStorageDB.getPlans();
        const index = allPlans.findIndex(p => p.id === id);
        if (index !== -1) {
          allPlans[index] = {
            ...allPlans[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorageDB.setPlans(allPlans);
          plans.value = allPlans;
          return allPlans[index];
        }
        throw new Error('Plan not found');
      }

      const { data, error: err } = await supabase
        .from('plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (data) {
        const index = plans.value.findIndex(p => p.id === id);
        if (index !== -1) {
          plans.value[index] = data;
        }
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error updating plan';
      console.error('Error updating plan:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deletePlan = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allPlans = localStorageDB.getPlans();
        const filtered = allPlans.filter(p => p.id !== id);
        localStorageDB.setPlans(filtered);
        plans.value = filtered;
        return;
      }

      const { error: err } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (err) throw err;
      plans.value = plans.value.filter(p => p.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error deleting plan';
      console.error('Error deleting plan:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addCopyTemplate = async (template: Omit<CopyTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const newTemplate: CopyTemplate = {
          ...template,
          id: localStorageDB.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const allTemplates = localStorageDB.getCopyTemplates();
        allTemplates.push(newTemplate);
        localStorageDB.setCopyTemplates(allTemplates);
        copyTemplates.value = allTemplates;
        return newTemplate;
      }

      const { data, error: err } = await supabase
        .from('copy_templates')
        .insert([template])
        .select()
        .single();

      if (err) throw err;
      if (data) {
        copyTemplates.value.push(data);
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error adding copy template';
      console.error('Error adding copy template:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateCopyTemplate = async (id: string, updates: Partial<CopyTemplate>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allTemplates = localStorageDB.getCopyTemplates();
        const index = allTemplates.findIndex(c => c.id === id);
        if (index !== -1) {
          allTemplates[index] = {
            ...allTemplates[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorageDB.setCopyTemplates(allTemplates);
          copyTemplates.value = allTemplates;
          return allTemplates[index];
        }
        throw new Error('Template not found');
      }

      const { data, error: err } = await supabase
        .from('copy_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (data) {
        const index = copyTemplates.value.findIndex(c => c.id === id);
        if (index !== -1) {
          copyTemplates.value[index] = data;
        }
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error updating copy template';
      console.error('Error updating copy template:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteCopyTemplate = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allTemplates = localStorageDB.getCopyTemplates();
        const filtered = allTemplates.filter(c => c.id !== id);
        localStorageDB.setCopyTemplates(filtered);
        copyTemplates.value = filtered;
        return;
      }

      const { error: err } = await supabase
        .from('copy_templates')
        .delete()
        .eq('id', id);

      if (err) throw err;
      copyTemplates.value = copyTemplates.value.filter(c => c.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error deleting copy template';
      console.error('Error deleting copy template:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addExtra = async (extra: Omit<Extra, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const newExtra: Extra = {
          ...extra,
          id: localStorageDB.generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const allExtras = localStorageDB.getExtras();
        allExtras.push(newExtra);
        localStorageDB.setExtras(allExtras);
        extras.value = allExtras;
        return newExtra;
      }

      const { data, error: err } = await supabase
        .from('extras')
        .insert([extra])
        .select()
        .single();

      if (err) throw err;
      if (data) {
        extras.value.push(data);
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error adding extra';
      console.error('Error adding extra:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateExtra = async (id: string, updates: Partial<Extra>) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allExtras = localStorageDB.getExtras();
        const index = allExtras.findIndex(e => e.id === id);
        if (index !== -1) {
          allExtras[index] = {
            ...allExtras[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          localStorageDB.setExtras(allExtras);
          extras.value = allExtras;
          return allExtras[index];
        }
        throw new Error('Extra not found');
      }

      const { data, error: err } = await supabase
        .from('extras')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (data) {
        const index = extras.value.findIndex(e => e.id === id);
        if (index !== -1) {
          extras.value[index] = data;
        }
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error updating extra';
      console.error('Error updating extra:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteExtra = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      if (!isSupabaseAvailable || !supabase) {
        const allExtras = localStorageDB.getExtras();
        const filtered = allExtras.filter(e => e.id !== id);
        localStorageDB.setExtras(filtered);
        extras.value = filtered;
        return;
      }

      const { error: err } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (err) throw err;
      extras.value = extras.value.filter(e => e.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error deleting extra';
      console.error('Error deleting extra:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const processTemplate = (template: string, replacements: Record<string, string>): string => {
    let processed = template;
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  };

  return {
    categories: computed(() => categories.value),
    plans: computed(() => plans.value),
    copyTemplates: computed(() => copyTemplates.value),
    extras: computed(() => extras.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    usingLocalStorage: computed(() => usingLocalStorage.value),
    loadCategories,
    loadPlans,
    loadCopyTemplates,
    loadExtras,
    loadAll,
    getPlansByCategory,
    getCopyTemplatesByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addPlan,
    updatePlan,
    deletePlan,
    addCopyTemplate,
    updateCopyTemplate,
    deleteCopyTemplate,
    addExtra,
    updateExtra,
    deleteExtra,
    processTemplate
  };
}
