<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="logo">
        <h2>Oswal Brand</h2>
      </div>

      <div class="currency-selector">
        <label>📊 Moneda:</label>
        <div class="currency-buttons">
          <button
            @click="() => { selectedCurrency = 'COP'; onCurrencyChange(); }"
            :class="['currency-btn', { active: selectedCurrency === 'COP' }]"
          >
            COP
          </button>
          <button
            @click="() => { selectedCurrency = 'USD'; onCurrencyChange(); }"
            :class="['currency-btn', { active: selectedCurrency === 'USD' }]"
          >
            USD
          </button>
        </div>
      </div>

      <div class="admin-buttons">
        <router-link to="/admin" class="btn-admin">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 10C9.65685 10 11 8.65685 11 7C11 5.34315 9.65685 4 8 4C6.34315 4 5 5.34315 5 7C5 8.65685 6.34315 10 8 10Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13.6 13.5C13.6 11.5118 11.0928 9.9 8 9.9C4.90721 9.9 2.4 11.5118 2.4 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Ir al Admin
        </router-link>
      </div>

      <nav class="nav">
        <h3 class="nav-title">Categorías</h3>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategoryId = category.id"
          :class="['nav-item', { active: selectedCategoryId === category.id }]"
        >
          <span class="icon">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <div class="section">
          <span class="badge">Paso 1</span>
          <h1 class="title">Selecciona tu Categoría</h1>
          <p class="subtitle">Elige el nicho de tu negocio para ver planes personalizados</p>
        </div>

        <div class="section" v-if="currentCategory">
          <span class="badge">Paso 2</span>
          <h2 class="section-title">Planes para {{ currentCategory.name }}</h2>
          <div class="plans-grid">
            <button
              v-for="plan in categoryPlans"
              :key="plan.id"
              @click="selectedPlanId = plan.id"
              :class="['plan-card', { selected: selectedPlanId === plan.id }]"
            >
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <div class="price">
                  <span class="amount">{{ formatPrice(plan.price_cop, plan.price_usd, selectedCurrency) }}</span>
                </div>
              </div>
              <ul class="features-list">
                <li v-for="(feature, index) in plan.features" :key="index">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </button>
          </div>
        </div>

        <div class="section" v-if="currentPlan">
          <span class="badge">Paso 3</span>
          <h2 class="section-title">Personaliza tu Propuesta</h2>
          <div class="input-group">
            <label for="clientName">Nombre del Cliente</label>
            <input
              id="clientName"
              v-model="clientName"
              type="text"
              placeholder="Ej: Hotel Sol del Mar"
              class="input"
            />
          </div>
        </div>

        <div class="section" v-if="categoryCopyTemplates.length > 0 && clientName">
          <span class="badge">Copys</span>
          <h2 class="section-title">Textos Persuasivos</h2>

          <div class="segmented-control">
            <button
              v-for="template in categoryCopyTemplates"
              :key="template.id"
              @click="selectedCopyId = template.id"
              :class="['segment-button', { active: selectedCopyId === template.id }]"
            >
              {{ template.stage_name }}
            </button>
          </div>

          <div class="copy-container" v-if="currentCopyTemplate">
            <div class="copy-text">
              {{ processedCopyText }}
            </div>
            <button @click="copyCopyText" class="btn-copy-message">
              <svg v-if="!copiedMessage" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.3333 10.75V14.0833C13.3333 15.2339 12.4005 16.1667 11.25 16.1667H5.91667C4.76607 16.1667 3.83333 15.2339 3.83333 14.0833V8.75C3.83333 7.59941 4.76607 6.66667 5.91667 6.66667H9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M16.1667 3.83333V10.5833C16.1667 11.0515 15.7849 11.4333 15.3167 11.4333H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M16.1667 3.83333H11M16.1667 3.83333V8.16667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ copiedMessage ? '¡Copiado!' : 'Copiar Mensaje' }}
            </button>
          </div>
        </div>
      </div>

      <div class="preview-panel" v-if="currentPlan && clientName">
        <div class="preview-header">
          <h3>Vista Previa de la Propuesta</h3>
        </div>
        <div class="preview-content">
          <div class="proposal-card">
            <h1 class="proposal-title">
              Propuesta de Diseño Web para {{ clientName }}
            </h1>
            <p class="proposal-description">{{ currentCategory?.description }}</p>

            <div class="proposal-plan">
              <div class="plan-info">
                <span class="plan-badge">Plan {{ currentPlan.name }}</span>
                <div class="plan-price">
                  <span class="price-label">Inversión Total</span>
                  <span class="price-value">{{ formatPrice(currentPlan.price_cop, currentPlan.price_usd, selectedCurrency) }}</span>
                </div>
              </div>

              <div class="plan-features">
                <h4>Incluye:</h4>
                <ul>
                  <li v-for="(feature, index) in currentPlan.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="actions">
              <button @click="generateProposal" class="btn-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2.5V17.5M10 17.5L15 12.5M10 17.5L5 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Generar Propuesta
              </button>
            </div>

            <div v-if="generatedLink" class="generated-link">
              <label>Enlace Generado</label>
              <div class="link-container">
                <input
                  :value="generatedLink"
                  readonly
                  class="link-input"
                  ref="linkInput"
                />
                <button @click="copyToClipboard" class="btn-copy">
                  <svg v-if="!copied" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.3333 10.75V14.0833C13.3333 15.2339 12.4005 16.1667 11.25 16.1667H5.91667C4.76607 16.1667 3.83333 15.2339 3.83333 14.0833V8.75C3.83333 7.59941 4.76607 6.66667 5.91667 6.66667H9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M16.1667 3.83333V10.5833C16.1667 11.0515 15.7849 11.4333 15.3167 11.4333H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M16.1667 3.83333H11M16.1667 3.83333V8.16667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ copied ? 'Copiado' : 'Copiar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useData } from '../composables/useData';
import { getCurrencySettings, saveCurrencySettings, formatPrice, type Currency } from '../lib/currency';

const {
  categories,
  plans,
  copyTemplates,
  loadAll,
  processTemplate
} = useData();

const currencySettings = getCurrencySettings();
const selectedCurrency = ref<Currency>(currencySettings.currency);
const selectedCategoryId = ref<string>('');
const selectedPlanId = ref<string>('');
const selectedCopyId = ref<string>('');
const clientName = ref<string>('');
const generatedLink = ref<string>('');
const copied = ref(false);
const copiedMessage = ref(false);
const linkInput = ref<HTMLInputElement | null>(null);

const onCurrencyChange = () => {
  saveCurrencySettings({
    currency: selectedCurrency.value,
    exchangeRate: currencySettings.exchangeRate
  });
};

onMounted(() => {
  loadAll();
});

const currentCategory = computed(() => {
  return categories.value.find(c => c.id === selectedCategoryId.value);
});

const categoryPlans = computed(() => {
  return plans.value.filter(p => p.category_id === selectedCategoryId.value);
});

const categoryCopyTemplates = computed(() => {
  return copyTemplates.value.filter(c => c.category_id === selectedCategoryId.value);
});

const currentPlan = computed(() => {
  return plans.value.find(p => p.id === selectedPlanId.value);
});

const currentCopyTemplate = computed(() => {
  return copyTemplates.value.find(c => c.id === selectedCopyId.value);
});

const processedCopyText = computed(() => {
  if (!currentCopyTemplate.value) return '';

  return processTemplate(currentCopyTemplate.value.template_text, {
    cliente: clientName.value,
    nicho: currentCategory.value?.name || '',
    link_propuesta: generatedLink.value || '[Genera primero la propuesta]'
  });
});

watch(categoryCopyTemplates, (templates) => {
  if (templates.length > 0 && !selectedCopyId.value) {
    selectedCopyId.value = templates[0].id;
  }
}, { immediate: true });

const generateProposal = () => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    cliente: clientName.value,
    categoryId: selectedCategoryId.value,
    planId: selectedPlanId.value
  });
  generatedLink.value = `${baseUrl}/propuesta?${params.toString()}`;
  copied.value = false;
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};

const copyCopyText = async () => {
  try {
    await navigator.clipboard.writeText(processedCopyText.value);
    copiedMessage.value = true;
    setTimeout(() => {
      copiedMessage.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #F8F9FC;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #E5E7EB;
  padding: 32px 20px;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.logo {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 2px solid #F3F4F6;
}

.logo h2 {
  font-size: 24px;
  font-weight: 700;
  color: #5D3FD3;
  margin: 0;
}

.currency-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
}

.currency-selector label {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.currency-buttons {
  display: flex;
  gap: 8px;
}

.currency-btn {
  flex: 1;
  padding: 10px 12px;
  background: white;
  color: #6B7280;
  border: 2px solid #D1D5DB;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.currency-btn:hover {
  border-color: #5D3FD3;
  color: #5D3FD3;
}

.currency-btn.active {
  background: #5D3FD3;
  border-color: #5D3FD3;
  color: white;
  box-shadow: 0 2px 8px rgba(93, 63, 211, 0.25);
}

.admin-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
}

.btn-admin {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #F9FAFB;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-admin:hover {
  background: #5D3FD3;
  color: white;
  border-color: #5D3FD3;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9CA3AF;
  margin: 0 0 16px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 8px;
  text-align: left;
}

.nav-item .icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background: #F3F4F6;
  color: #374151;
}

.nav-item.active {
  background: #5D3FD3;
  color: white;
  box-shadow: 0 4px 12px rgba(93, 63, 211, 0.25);
}

.main-content {
  margin-left: 280px;
  flex: 1;
  padding: 48px;
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 32px;
  max-width: 1800px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  background: #EDE9FE;
  color: #5D3FD3;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.plan-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.plan-card:hover {
  border-color: #5D3FD3;
  box-shadow: 0 8px 24px rgba(93, 63, 211, 0.12);
  transform: translateY(-2px);
}

.plan-card.selected {
  border-color: #5D3FD3;
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F3FF 100%);
  box-shadow: 0 8px 24px rgba(93, 63, 211, 0.15);
}

.plan-header {
  margin-bottom: 20px;
}

.plan-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 20px;
  color: #5D3FD3;
  font-weight: 600;
}

.amount {
  font-size: 32px;
  font-weight: 700;
  color: #5D3FD3;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #4B5563;
  line-height: 1.5;
}

.features-list svg {
  flex-shrink: 0;
  color: #5D3FD3;
  margin-top: 2px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.input {
  padding: 14px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
  color: #111827;
}

.input:focus {
  outline: none;
  border-color: #5D3FD3;
  box-shadow: 0 0 0 3px rgba(93, 63, 211, 0.1);
}

.preview-panel {
  position: sticky;
  top: 48px;
  height: fit-content;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.preview-header {
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.preview-content {
  padding: 24px;
}

.proposal-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.proposal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.proposal-description {
  font-size: 15px;
  color: #6B7280;
  margin: 0;
  line-height: 1.6;
}

.proposal-plan {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 20px;
}

.plan-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E7EB;
}

.plan-badge {
  padding: 6px 12px;
  background: #5D3FD3;
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.plan-price {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
}

.price-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #5D3FD3;
}

.plan-features h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-features li {
  font-size: 14px;
  color: #4B5563;
  padding-left: 20px;
  position: relative;
}

.plan-features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #5D3FD3;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: #5D3FD3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #4C2FC4;
  box-shadow: 0 6px 20px rgba(93, 63, 211, 0.3);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.generated-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.generated-link label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.link-container {
  display: flex;
  gap: 8px;
}

.link-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 13px;
  color: #6B7280;
  background: #F9FAFB;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  border-color: #5D3FD3;
  color: #5D3FD3;
  background: #F5F3FF;
}

.segmented-control {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 24px;
}

.segment-button {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-button:hover {
  background: #F3F4F6;
  color: #374151;
}

.segment-button.active {
  background: #5D3FD3;
  color: white;
  box-shadow: 0 2px 8px rgba(93, 63, 211, 0.2);
}

.copy-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.copy-text {
  padding: 24px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
  min-height: 200px;
}

.btn-copy-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background: #5D3FD3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(93, 63, 211, 0.25);
}

.btn-copy-message:hover {
  background: #4C2FC4;
  box-shadow: 0 6px 20px rgba(93, 63, 211, 0.35);
  transform: translateY(-2px);
}

.btn-copy-message:active {
  transform: translateY(0);
}
</style>
