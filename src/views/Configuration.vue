<template>
  <div class="config">
    <header class="config-header">
      <div class="header-content">
        <h1>Configuración</h1>
        <router-link to="/dashboard" class="btn-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver al Dashboard
        </router-link>
      </div>
    </header>

    <div class="config-container">
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div class="section">
        <div class="section-header">
          <h2>Categorías</h2>
          <button @click="saveAllChanges" class="btn-save" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
        <div class="table-container">
          <table class="config-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Icono</th>
                <th>Descripción</th>
                <th>Orden</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categoriesLocal" :key="category.id">
                <td>
                  <input
                    v-model="category.name"
                    type="text"
                    class="table-input"
                    @input="markAsModified()"
                  />
                </td>
                <td class="icon-cell">
                  <input
                    v-model="category.icon"
                    type="text"
                    class="table-input icon-input"
                    @input="markAsModified()"
                  />
                </td>
                <td>
                  <input
                    v-model="category.description"
                    type="text"
                    class="table-input"
                    @input="markAsModified()"
                  />
                </td>
                <td class="order-cell">
                  <input
                    v-model.number="category.order_index"
                    type="number"
                    class="table-input order-input"
                    @input="markAsModified()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Planes y Precios</h2>
        </div>

        <div v-for="category in categoriesLocal" :key="category.id" class="category-group">
          <h3 class="category-subtitle">{{ category.icon }} {{ category.name }}</h3>
          <div class="table-container">
            <table class="config-table">
              <thead>
                <tr>
                  <th>Nombre del Plan</th>
                  <th>Precio COP</th>
                  <th>Precio USD</th>
                  <th>Orden</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in getCategoryPlans(category.id)" :key="plan.id">
                  <td>
                    <input
                      v-model="plan.name"
                      type="text"
                      class="table-input"
                      @input="markAsModified()"
                    />
                  </td>
                  <td class="price-cell">
                    <div class="price-input-wrapper">
                      <span class="currency">$</span>
                      <input
                        v-model.number="plan.price_cop"
                        type="number"
                        class="table-input price-input"
                        @input="markAsModified()"
                      />
                    </div>
                  </td>
                  <td class="price-cell">
                    <div class="price-input-wrapper">
                      <span class="currency">$</span>
                      <input
                        v-model.number="plan.price_usd"
                        type="number"
                        class="table-input price-input"
                        @input="markAsModified()"
                      />
                    </div>
                  </td>
                  <td class="order-cell">
                    <input
                      v-model.number="plan.order_index"
                      type="number"
                      class="table-input order-input"
                      @input="markAsModified()"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Plantillas de Mensajes</h2>
        </div>

        <div v-for="category in categoriesLocal" :key="category.id" class="category-group">
          <h3 class="category-subtitle">{{ category.icon }} {{ category.name }}</h3>

          <div v-for="template in getCategoryCopyTemplates(category.id)" :key="template.id" class="template-card">
            <div class="template-header">
              <h4>{{ template.stage_name }}</h4>
              <span class="template-stage">{{ getStageLabel(template.stage) }}</span>
            </div>
            <textarea
              v-model="template.template_text"
              class="template-textarea"
              rows="8"
              @input="markAsModified()"
              placeholder="Escribe tu plantilla aquí. Usa {{cliente}}, {{nicho}} y {{link_propuesta}} como variables."
            ></textarea>
            <div class="template-hint">
              Variables disponibles: <code>&lbrace;&lbrace;cliente&rbrace;&rbrace;</code>, <code>&lbrace;&lbrace;nicho&rbrace;&rbrace;</code>, <code>&lbrace;&lbrace;link_propuesta&rbrace;&rbrace;</code>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Servicios Adicionales</h2>
        </div>

        <div class="table-container">
          <table class="config-table">
            <thead>
              <tr>
                <th>Nombre del Servicio</th>
                <th>Descripción</th>
                <th>Precio COP</th>
                <th>Precio USD</th>
                <th>Orden</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="extra in extrasLocal" :key="extra.id">
                <td>
                  <input
                    v-model="extra.name"
                    type="text"
                    class="table-input"
                    @input="markAsModified()"
                  />
                </td>
                <td>
                  <input
                    v-model="extra.description"
                    type="text"
                    class="table-input"
                    @input="markAsModified()"
                  />
                </td>
                <td class="price-cell">
                  <div class="price-input-wrapper">
                    <span class="currency">$</span>
                    <input
                      v-model.number="extra.price_cop"
                      type="number"
                      class="table-input price-input"
                      @input="markAsModified()"
                    />
                  </div>
                </td>
                <td class="price-cell">
                  <div class="price-input-wrapper">
                    <span class="currency">$</span>
                    <input
                      v-model.number="extra.price_usd"
                      type="number"
                      class="table-input price-input"
                      @input="markAsModified()"
                    />
                  </div>
                </td>
                <td class="order-cell">
                  <input
                    v-model.number="extra.order_index"
                    type="number"
                    class="table-input order-input"
                    @input="markAsModified()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="hasModifications" class="save-banner">
        <div class="save-banner-content">
          <span>Tienes cambios sin guardar</span>
          <button @click="saveAllChanges" class="btn-save-banner" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar Ahora' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useData } from '../composables/useData';
import type { Category, Plan, CopyTemplate, Extra } from '../lib/supabase';

const {
  categories,
  plans,
  copyTemplates,
  extras,
  loading,
  error,
  loadAll,
  updateCategory,
  updatePlan,
  updateCopyTemplate,
  updateExtra
} = useData();

const categoriesLocal = ref<Category[]>([]);
const plansLocal = ref<Plan[]>([]);
const copyTemplatesLocal = ref<CopyTemplate[]>([]);
const extrasLocal = ref<Extra[]>([]);
const hasModifications = ref(false);
const saving = ref(false);

onMounted(async () => {
  await loadAll();
  categoriesLocal.value = JSON.parse(JSON.stringify(categories.value));
  plansLocal.value = JSON.parse(JSON.stringify(plans.value));
  copyTemplatesLocal.value = JSON.parse(JSON.stringify(copyTemplates.value));
  extrasLocal.value = JSON.parse(JSON.stringify(extras.value));
});

const getCategoryPlans = (categoryId: string) => {
  return plansLocal.value.filter(p => p.category_id === categoryId);
};

const getCategoryCopyTemplates = (categoryId: string) => {
  return copyTemplatesLocal.value.filter(c => c.category_id === categoryId);
};

const getStageLabel = (stage: string) => {
  const labels: Record<string, string> = {
    'contacto': 'Contacto Frío',
    'demo': 'Envío Demo',
    'cierre': 'Cierre/Onboarding'
  };
  return labels[stage] || stage;
};

const markAsModified = () => {
  hasModifications.value = true;
};

const saveAllChanges = async () => {
  saving.value = true;
  try {
    for (const category of categoriesLocal.value) {
      await updateCategory(category.id, {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        order_index: category.order_index
      });
    }

    for (const plan of plansLocal.value) {
      await updatePlan(plan.id, {
        category_id: plan.category_id,
        name: plan.name,
        slug: plan.slug,
        price_cop: plan.price_cop,
        price_usd: plan.price_usd,
        currency: plan.currency,
        features: plan.features,
        order_index: plan.order_index
      });
    }

    for (const template of copyTemplatesLocal.value) {
      await updateCopyTemplate(template.id, {
        category_id: template.category_id,
        stage: template.stage,
        stage_name: template.stage_name,
        template_text: template.template_text,
        order_index: template.order_index
      });
    }

    for (const extra of extrasLocal.value) {
      await updateExtra(extra.id, {
        name: extra.name,
        description: extra.description,
        price_cop: extra.price_cop,
        price_usd: extra.price_usd,
        currency: extra.currency,
        order_index: extra.order_index
      });
    }

    hasModifications.value = false;
    alert('Cambios guardados correctamente');
  } catch (e) {
    alert('Error al guardar los cambios');
    console.error(e);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.config {
  min-height: 100vh;
  background: #F9FAFB;
  padding-bottom: 80px;
}

.config-header {
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

.config-header h1 {
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
  color: #2563EB;
  border: 2px solid #2563EB;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #2563EB;
  color: white;
}

.config-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 2px solid #E5E7EB;
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

.category-group {
  margin-bottom: 32px;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #E5E7EB;
}

.table-container {
  overflow-x: auto;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
}

.config-table thead {
  background: #F9FAFB;
}

.config-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #E5E7EB;
}

.config-table tbody tr {
  border-bottom: 1px solid #E5E7EB;
  transition: background 0.2s ease;
}

.config-table tbody tr:hover {
  background: #F9FAFB;
}

.config-table td {
  padding: 12px 16px;
}

.table-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  transition: all 0.2s ease;
  font-family: inherit;
}

.table-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.icon-cell {
  width: 80px;
}

.icon-input {
  text-align: center;
  font-size: 20px;
}

.order-cell {
  width: 100px;
}

.order-input {
  text-align: center;
}

.price-cell {
  width: 150px;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  pointer-events: none;
}

.price-input {
  padding-left: 28px;
  font-weight: 600;
}

.template-card {
  background: #F9FAFB;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #2563EB;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.template-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.template-stage {
  padding: 4px 12px;
  background: #DBEAFE;
  color: #1E40AF;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.template-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s ease;
}

.template-textarea:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.template-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #6B7280;
}

.template-hint code {
  background: #E5E7EB;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.btn-save {
  padding: 12px 24px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 2px solid #E5E7EB;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  z-index: 90;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.save-banner-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save-banner-content span {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.btn-save-banner {
  padding: 12px 32px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save-banner:hover:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-save-banner:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  margin-bottom: 24px;
}
</style>
