<template>
  <div class="admin">
    <header class="admin-header">
      <div class="header-content">
        <h1>Panel de Administración</h1>
        <router-link to="/dashboard" class="btn-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver al Dashboard
        </router-link>
      </div>
    </header>

    <div class="admin-container">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
        >
          {{ tab.name }}
        </button>
      </div>

      <div v-if="loading" class="loading">Cargando...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-show="activeTab === 'categories'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Categorías</h2>
          <button @click="openCategoryModal()" class="btn-add">+ Nueva Categoría</button>
        </div>

        <div class="items-grid">
          <div v-for="category in categories" :key="category.id" class="item-card">
            <div class="item-icon">{{ category.icon }}</div>
            <div class="item-info">
              <h3>{{ category.name }}</h3>
              <p class="item-slug">{{ category.slug }}</p>
              <p class="item-description">{{ category.description }}</p>
            </div>
            <div class="item-actions">
              <button @click="openCategoryModal(category)" class="btn-edit">Editar</button>
              <button @click="confirmDeleteCategory(category.id)" class="btn-delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'plans'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Planes</h2>
          <button @click="openPlanModal()" class="btn-add">+ Nuevo Plan</button>
        </div>

        <div v-for="category in categories" :key="category.id" class="category-section">
          <h3 class="category-title">{{ category.icon }} {{ category.name }}</h3>
          <div class="items-grid">
            <div v-for="plan in categoryPlans(category.id)" :key="plan.id" class="item-card">
              <div class="item-info">
                <h4>{{ plan.name }}</h4>
                <div class="price-group">
                  <p class="plan-price">${{ plan.price_cop.toLocaleString() }} COP</p>
                  <p class="plan-price-alt">{{ getPriceDisplay(plan.price_cop, plan.price_usd) }}</p>
                </div>
                <ul class="features-preview">
                  <li v-for="(feature, index) in plan.features.slice(0, 3)" :key="index">{{ feature }}</li>
                  <li v-if="plan.features.length > 3">...y {{ plan.features.length - 3 }} más</li>
                </ul>
              </div>
              <div class="item-actions">
                <button @click="openPlanModal(plan)" class="btn-edit">Editar</button>
                <button @click="confirmDeletePlan(plan.id)" class="btn-delete">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'copys'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Plantillas de Texto</h2>
          <button @click="openCopyModal()" class="btn-add">+ Nueva Plantilla</button>
        </div>

        <div v-for="category in categories" :key="category.id" class="category-section">
          <h3 class="category-title">{{ category.icon }} {{ category.name }}</h3>
          <div class="copys-list">
            <div v-for="copy in categoryCopys(category.id)" :key="copy.id" class="copy-card">
              <div class="copy-header">
                <h4>{{ copy.stage_name }}</h4>
                <div class="item-actions">
                  <button @click="openCopyModal(copy)" class="btn-edit">Editar</button>
                  <button @click="confirmDeleteCopy(copy.id)" class="btn-delete">Eliminar</button>
                </div>
              </div>
              <p class="copy-preview">{{ copy.template_text.substring(0, 150) }}...</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'extras'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Servicios Adicionales (Genéricos)</h2>
          <button @click="openExtraModal()" class="btn-add">+ Nuevo Adicional</button>
        </div>

        <div class="items-grid">
          <div v-for="extra in extras" :key="extra.id" class="item-card">
            <div class="item-info">
              <h4>{{ extra.name }}</h4>
              <p class="item-description">{{ extra.description }}</p>
              <div class="price-group">
                <p class="plan-price">${{ extra.price_cop.toLocaleString() }} COP</p>
                <p class="plan-price-alt">{{ getPriceDisplay(extra.price_cop, extra.price_usd) }}</p>
              </div>
            </div>
            <div class="item-actions">
              <button @click="openExtraModal(extra)" class="btn-edit">Editar</button>
              <button @click="confirmDeleteExtra(extra.id)" class="btn-delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'cotizacion'" class="tab-content">
        <div class="section-header">
          <h2>📊 Cotización del Dólar (USD/COP)</h2>
          <p class="subtitle">Actualiza automáticamente o configura manualmente la tasa de cambio</p>
        </div>

        <div class="exchange-rate-container">
          <div v-if="exchangeRateError" class="error-box">
            {{ exchangeRateError }}
          </div>

          <div class="exchange-rate-card">
            <div class="rate-display">
              <div class="rate-value">
                <span class="currency-label">1 USD =</span>
                <span class="rate-number">{{ exchangeRate.toLocaleString('es-CO', { maximumFractionDigits: 0 }) }}</span>
                <span class="currency-label">COP</span>
              </div>
              <div v-if="exchangeRateLastUpdate" class="rate-timestamp">
                Última actualización: {{ exchangeRateLastUpdate }}
              </div>
            </div>

            <div class="rate-actions">
              <button 
                @click="fetchExchangeRate" 
                :disabled="loadingExchangeRate"
                class="btn-refresh"
              >
                <svg v-if="!loadingExchangeRate" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36"></path>
                </svg>
                <span v-if="loadingExchangeRate">Actualizando...</span>
                <span v-else>Obtener Cotización Automática</span>
              </button>
              <p class="help-text">Se obtiene de API de cotización en tiempo real</p>
            </div>
          </div>

          <div class="manual-update-section">
            <h3>O actualiza manualmente</h3>
            <div class="form-group">
              <label>Ingresa el valor del dólar (USD) en pesos colombianos (COP)</label>
              <div class="input-group">
                <span class="input-prefix">1 USD =</span>
                <input 
                  v-model="exchangeRateInput" 
                  type="number" 
                  step="1"
                  min="0"
                  placeholder="Ej: 4300"
                  class="exchange-input"
                />
                <span class="input-suffix">COP</span>
              </div>
              <button @click="saveExchangeRate" class="btn-save">Guardar Cotización Manual</button>
            </div>
          </div>

          <div class="info-box">
            <h4>ℹ️ Cómo funciona</h4>
            <ul>
              <li>Al actualizar la cotización, los precios mostrados en las propuestas se ajustarán automáticamente</li>
              <li>Puedes usar la cotización automática (API) o establecer un valor manual</li>
              <li>La cotización está en caché para evitar demasiadas solicitudes. Se actualiza cada hora automáticamente</li>
              <li>Todos los cálculos de conversión se basan en esta tasa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCategoryModal" class="modal-overlay" @click="showCategoryModal = false">
      <div class="modal" @click.stop>
        <h3>{{ editingCategory ? 'Editar' : 'Nueva' }} Categoría</h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="categoryForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Slug (URL)</label>
            <input v-model="categoryForm.slug" type="text" required />
          </div>
          <div class="form-group">
            <label>Icono (Emoji)</label>
            <input v-model="categoryForm.icon" type="text" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="categoryForm.description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label>Orden</label>
            <input v-model.number="categoryForm.order_index" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showCategoryModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showPlanModal" class="modal-overlay" @click="showPlanModal = false">
      <div class="modal" @click.stop>
        <h3>{{ editingPlan ? 'Editar' : 'Nuevo' }} Plan</h3>
        <form @submit.prevent="savePlan">
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="planForm.category_id" required>
              <option value="">Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="planForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Slug (URL)</label>
            <input v-model="planForm.slug" type="text" required />
          </div>
          <div class="form-group">
            <label>Precio en COP (Pesos Colombianos)</label>
            <input v-model.number="planForm.price_cop" type="number" required />
          </div>
          <div class="form-group">
            <label>Precio en USD (Dólares)</label>
            <input v-model.number="planForm.price_usd" type="number" required />
          </div>
          <div class="form-group">
            <label>Características (una por línea)</label>
            <textarea v-model="featuresText" rows="6" required></textarea>
          </div>
          <div class="form-group">
            <label>Orden</label>
            <input v-model.number="planForm.order_index" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showPlanModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showCopyModal" class="modal-overlay" @click="showCopyModal = false">
      <div class="modal modal-large" @click.stop>
        <h3>{{ editingCopy ? 'Editar' : 'Nueva' }} Plantilla</h3>
        <form @submit.prevent="saveCopy">
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="copyForm.category_id" required>
              <option value="">Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Etapa</label>
            <select v-model="copyForm.stage" required>
              <option value="contacto">Contacto Frío</option>
              <option value="demo">Envío Demo</option>
              <option value="cierre">Cierre/Onboarding</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre de la Etapa</label>
            <input v-model="copyForm.stage_name" type="text" required />
          </div>
          <div class="form-group">
            <label>Texto de la Plantilla</label>
            <p class="help-text">Usa {{ "{{" }}cliente}}, {{ "{{" }}nicho}} y {{ "{{" }}link_propuesta}} como variables</p>
            <textarea v-model="copyForm.template_text" rows="12" required></textarea>
          </div>
          <div class="form-group">
            <label>Orden</label>
            <input v-model.number="copyForm.order_index" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showCopyModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showExtraModal" class="modal-overlay" @click="showExtraModal = false">
      <div class="modal" @click.stop>
        <h3>{{ editingExtra ? 'Editar' : 'Nuevo' }} Servicio Adicional</h3>
        <form @submit.prevent="saveExtra">
          <div class="form-group">
            <label>Nombre del Servicio</label>
            <input v-model="extraForm.name" type="text" placeholder="Ej: Branding, Fotografía, Publicidad Digital" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="extraForm.description" rows="4" placeholder="Describe el servicio adicional"></textarea>
          </div>
          <div class="form-group">
            <label>Precio en COP (Pesos Colombianos)</label>
            <input v-model.number="extraForm.price_cop" type="number" required />
          </div>
          <div class="form-group">
            <label>Precio en USD (Dólares)</label>
            <input v-model.number="extraForm.price_usd" type="number" required />
          </div>
          <div class="form-group">
            <label>Orden</label>
            <input v-model.number="extraForm.order_index" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showExtraModal = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useData } from '../composables/useData';
import { getExchangeRate, setExchangeRate, getSavedExchangeRate } from '../lib/exchangeRate';
import type { Category, Plan, CopyTemplate, Extra } from '../lib/supabase';

const {
  categories,
  plans,
  copyTemplates,
  extras,
  loading,
  error,
  loadAll,
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
  deleteExtra
} = useData();

const activeTab = ref('categories');
const tabs = [
  { id: 'cotizacion', name: 'Cotización del Dólar' },
  { id: 'categories', name: 'Categorías' },
  { id: 'plans', name: 'Planes' },
  { id: 'copys', name: 'Plantillas de Texto' },
  { id: 'extras', name: 'Servicios Adicionales' }
];

const showCategoryModal = ref(false);
const showPlanModal = ref(false);
const showCopyModal = ref(false);

const editingCategory = ref<Category | null>(null);
const editingPlan = ref<Plan | null>(null);
const editingCopy = ref<CopyTemplate | null>(null);

const categoryForm = ref({
  name: '',
  slug: '',
  icon: '📁',
  description: '',
  order_index: 0
});

const planForm = ref({
  category_id: '',
  name: '',
  slug: '',
  price_cop: 0,
  price_usd: 0,
  currency: 'COP',
  features: [] as string[],
  order_index: 0
});

const featuresText = ref('');

const copyForm = ref({
  category_id: '',
  stage: 'contacto',
  stage_name: '',
  template_text: '',
  order_index: 0
});

const showExtraModal = ref(false);
const editingExtra = ref<Extra | null>(null);

const extraForm = ref({
  name: '',
  description: '',
  price_cop: 0,
  price_usd: 0,
  currency: 'COP',
  order_index: 0
});

// Exchange rate state
const exchangeRate = ref(getSavedExchangeRate());
const exchangeRateInput = ref(exchangeRate.value.toString());
const loadingExchangeRate = ref(false);
const exchangeRateError = ref('');
const exchangeRateLastUpdate = ref<string>('');

const fetchExchangeRate = async () => {
  loadingExchangeRate.value = true;
  exchangeRateError.value = '';
  
  try {
    const data = await getExchangeRate(true); // force refresh
    exchangeRate.value = data.rate;
    exchangeRateInput.value = data.rate.toString();
    
    // Update last update time
    const date = new Date(data.timestamp);
    exchangeRateLastUpdate.value = date.toLocaleString('es-CO');
  } catch (error) {
    exchangeRateError.value = 'No se pudo obtener la cotización automáticamente. Intenta más tarde.';
    console.error('Error fetching exchange rate:', error);
  } finally {
    loadingExchangeRate.value = false;
  }
};

const saveExchangeRate = () => {
  try {
    const rate = parseFloat(exchangeRateInput.value);
    
    if (isNaN(rate) || rate <= 0) {
      exchangeRateError.value = 'Por favor ingresa un valor válido mayor a 0';
      return;
    }
    
    setExchangeRate(rate);
    exchangeRate.value = rate;
    exchangeRateError.value = '';
    
    const date = new Date();
    exchangeRateLastUpdate.value = date.toLocaleString('es-CO');
    
    alert('Cotización actualizada exitosamente');
  } catch (error) {
    exchangeRateError.value = 'Error al guardar la cotización';
    console.error('Error saving exchange rate:', error);
  }
};

// Utilities for currency conversion
const getConvertedPrice = (priceCop: number): number => {
  return Math.round((priceCop / exchangeRate.value) * 100) / 100;
};

const getPriceDisplay = (priceCop: number, priceUsd: number): string => {
  const converted = getConvertedPrice(priceCop);
  const difference = Math.abs(converted - priceUsd);
  
  if (difference > 5) {
    return `$${converted.toLocaleString('es-CO')} USD (convertido automáticamente)`;
  }
  
  return `$${priceUsd.toLocaleString('es-CO')} USD`;
};

onMounted(() => {
  loadAll();
  
  // Cargar la cotización inicial
  getExchangeRate().then(data => {
    exchangeRate.value = data.rate;
    exchangeRateInput.value = data.rate.toString();
    const date = new Date(data.timestamp);
    exchangeRateLastUpdate.value = date.toLocaleString('es-CO');
  }).catch(error => {
    console.error('Error loading initial exchange rate:', error);
  });
});

const categoryPlans = (categoryId: string) => {
  return plans.value.filter(p => p.category_id === categoryId);
};

const categoryCopys = (categoryId: string) => {
  return copyTemplates.value.filter(c => c.category_id === categoryId);
};

const openCategoryModal = (category?: Category) => {
  if (category) {
    editingCategory.value = category;
    categoryForm.value = {
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      order_index: category.order_index
    };
  } else {
    editingCategory.value = null;
    categoryForm.value = {
      name: '',
      slug: '',
      icon: '📁',
      description: '',
      order_index: categories.value.length
    };
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, categoryForm.value);
    } else {
      await addCategory(categoryForm.value);
    }
    showCategoryModal.value = false;
  } catch (e) {
    alert('Error al guardar la categoría');
  }
};

const confirmDeleteCategory = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta categoría? Se borrarán también sus planes y plantillas.')) {
    await deleteCategory(id);
  }
};

const openPlanModal = (plan?: Plan) => {
  if (plan) {
    editingPlan.value = plan;
    planForm.value = {
      category_id: plan.category_id,
      name: plan.name,
      slug: plan.slug,
      price_cop: plan.price_cop,
      price_usd: plan.price_usd,
      currency: plan.currency,
      features: plan.features,
      order_index: plan.order_index
    };
    featuresText.value = plan.features.join('\n');
  } else {
    editingPlan.value = null;
    planForm.value = {
      category_id: '',
      name: '',
      slug: '',
      price_cop: 0,
      price_usd: 0,
      currency: 'COP',
      features: [],
      order_index: 0
    };
    featuresText.value = '';
  }
  showPlanModal.value = true;
};

const savePlan = async () => {
  try {
    planForm.value.features = featuresText.value
      .split('\n')
      .filter(f => f.trim())
      .map(f => f.trim());

    if (editingPlan.value) {
      await updatePlan(editingPlan.value.id, planForm.value);
    } else {
      await addPlan(planForm.value);
    }
    showPlanModal.value = false;
  } catch (e) {
    console.error('Error saving plan:', e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    alert('Error al guardar el plan: ' + msg);
  }
};

const confirmDeletePlan = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este plan?')) {
    await deletePlan(id);
  }
};

const openCopyModal = (copy?: CopyTemplate) => {
  if (copy) {
    editingCopy.value = copy;
    copyForm.value = {
      category_id: copy.category_id,
      stage: copy.stage,
      stage_name: copy.stage_name,
      template_text: copy.template_text,
      order_index: copy.order_index
    };
  } else {
    editingCopy.value = null;
    copyForm.value = {
      category_id: '',
      stage: 'contacto',
      stage_name: '',
      template_text: '',
      order_index: 0
    };
  }
  showCopyModal.value = true;
};

const saveCopy = async () => {
  try {
    if (editingCopy.value) {
      await updateCopyTemplate(editingCopy.value.id, copyForm.value);
    } else {
      await addCopyTemplate(copyForm.value);
    }
    showCopyModal.value = false;
  } catch (e) {
    alert('Error al guardar la plantilla');
  }
};

const confirmDeleteCopy = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
    await deleteCopyTemplate(id);
  }
};

const openExtraModal = (extra?: Extra) => {
  if (extra) {
    editingExtra.value = extra;
    extraForm.value = {
      name: extra.name,
      description: extra.description,
      price_cop: extra.price_cop,
      price_usd: extra.price_usd,
      currency: extra.currency,
      order_index: extra.order_index
    };
  } else {
    editingExtra.value = null;
    extraForm.value = {
      name: '',
      description: '',
      price_cop: 0,
      price_usd: 0,
      currency: 'COP',
      order_index: 0
    };
  }
  showExtraModal.value = true;
};

const saveExtra = async () => {
  try {
    if (editingExtra.value) {
      await updateExtra(editingExtra.value.id, extraForm.value);
    } else {
      await addExtra(extraForm.value);
    }
    showExtraModal.value = false;
  } catch (e) {
    alert('Error al guardar el servicio adicional');
  }
};

const confirmDeleteExtra = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este servicio adicional?')) {
    await deleteExtra(id);
  }
};
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: #F9FAFB;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #5D3FD3;
  border: 2px solid #5D3FD3;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #5D3FD3;
  color: white;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
}

.tab {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  background: #F3F4F6;
  color: #374151;
}

.tab.active {
  background: #5D3FD3;
  color: white;
  box-shadow: 0 2px 8px rgba(93, 63, 211, 0.2);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-add {
  padding: 12px 24px;
  background: #5D3FD3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: #4C2FC4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 63, 211, 0.3);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.item-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s ease;
}

.item-card:hover {
  border-color: #5D3FD3;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.item-icon {
  font-size: 40px;
  text-align: center;
}

.item-info h3,
.item-info h4 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.item-slug {
  font-size: 13px;
  color: #6B7280;
  font-family: monospace;
  margin: 0 0 8px 0;
}

.item-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

.price-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.plan-price {
  font-size: 20px;
  font-weight: 700;
  color: #5D3FD3;
  margin: 0;
}

.plan-price-alt {
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}

.features-preview {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: #6B7280;
}

.features-preview li {
  padding: 4px 0;
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn-edit {
  flex: 1;
  padding: 8px 16px;
  background: white;
  color: #5D3FD3;
  border: 2px solid #5D3FD3;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: #5D3FD3;
  color: white;
}

.btn-delete {
  flex: 1;
  padding: 8px 16px;
  background: white;
  color: #EF4444;
  border: 2px solid #EF4444;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #EF4444;
  color: white;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
  padding: 12px 0;
  border-bottom: 2px solid #E5E7EB;
}

.copys-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.copy-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.2s ease;
}

.copy-card:hover {
  border-color: #5D3FD3;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.copy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.copy-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.copy-preview {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 800px;
}

.modal h3 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5D3FD3;
  box-shadow: 0 0 0 3px rgba(93, 63, 211, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.help-text {
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 8px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  flex: 1;
  padding: 12px 24px;
  background: white;
  color: #6B7280;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  border-color: #9CA3AF;
  color: #374151;
}

.btn-save {
  flex: 1;
  padding: 12px 24px;
  background: #5D3FD3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: #4C2FC4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 63, 211, 0.3);
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #6B7280;
}

.error {
  color: #EF4444;
  background: #FEF2F2;
  border-radius: 10px;
}

/* Exchange Rate Styles */
.section-header .subtitle {
  color: #6B7280;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.exchange-rate-container {
  max-width: 600px;
  margin: 0 auto;
}

.error-box {
  background: #FEE2E2;
  border: 2px solid #EF4444;
  color: #DC2626;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
}

.exchange-rate-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.rate-display {
  text-align: center;
  margin-bottom: 24px;
}

.rate-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.rate-number {
  font-size: 48px;
  font-weight: 700;
  color: #5D3FD3;
  font-family: 'Monaco', 'Menlo', monospace;
}

.currency-label {
  font-size: 16px;
  color: #6B7280;
  font-weight: 600;
}

.rate-timestamp {
  font-size: 12px;
  color: #6B7280;
  margin-top: 8px;
}

.rate-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-text {
  font-size: 12px;
  color: #9CA3AF;
  margin: 0;
  text-align: center;
}

.manual-update-section {
  background: #F3F4F6;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.manual-update-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #111827;
}

.manual-update-section .form-group {
  margin-bottom: 16px;
}

.manual-update-section label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 12px;
  border: 2px solid #D1D5DB;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.input-prefix,
.input-suffix {
  padding: 12px 16px;
  background: #E5E7EB;
  color: #6B7280;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.exchange-input {
  flex: 1;
  padding: 12px;
  border: none !important;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #111827;
}

.exchange-input:focus {
  outline: none;
  background: #F9FAFB;
}

.manual-update-section .btn-save {
  width: 100%;
}

.info-box {
  background: #DBEAFE;
  border-left: 4px solid #3B82F6;
  border-radius: 8px;
  padding: 16px;
  color: #1E40AF;
  font-size: 14px;
}

.info-box h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  margin: 8px 0;
  line-height: 1.5;
}
</style>
