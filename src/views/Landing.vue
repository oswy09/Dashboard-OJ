<template>
  <div class="landing">
    <!-- Bio Header -->
    <div class="bio-header">
      <div class="bio-container">
        <div class="bio-profile">
          <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1759897392/Oswal_jaimes_perfil_ozajmv.jpg" alt="Profile" class="bio-avatar" />
          <div class="bio-info">
            <h2 class="bio-name">Oswal Jaimes</h2>
            <p class="bio-line">🏨 Ecosistemas de reservas directas y experiencias Hospitality</p>
            <p class="bio-line">⚡ Web estratégica + Atracción + Automatización</p>
            <p class="bio-line">📍 Hoteles | Spas | Gastronómicos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- (Price sticky removed to avoid overlay) -->

    <div class="container">
      <div class="hero">
        <h1 class="hero-title">
          Propuesta de Diseño Web para <span class="highlight">{{ clientName }}</span>
        </h1>
        <p class="hero-description">{{ nicho?.description }}</p>
      </div>

      <!-- Plan Selection -->
      <div class="customization-section" v-if="availablePlans.length > 1">
        <h2 class="section-title">Personaliza tu Propuesta</h2>
        <div class="plans-selector">
          <button
            v-for="p in availablePlans"
            :key="p.id"
            @click="selectedPlanId = p.id"
            :class="['plan-btn', { active: selectedPlanId === p.id }]"
          >
            <span class="plan-name">{{ p.name }}</span>
            <span class="plan-price">{{ formatPrice(p.price_cop, p.price_usd, selectedCurrency) }}</span>
          </button>
        </div>

        <!-- Plan Details Summary -->
        <div class="plan-summary" v-if="plan">
          <h3 class="summary-title">Lo que incluye el plan {{ plan.name }}</h3>
          <p class="plan-description" v-if="plan.description">{{ plan.description }}</p>
          <div class="summary-features">
            <div v-for="(feature, index) in plan.features" :key="index" class="summary-feature">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ feature }}</span>
            </div>
          </div>
          <div class="plan-result" v-if="plan.result">
            <h4 class="result-title">💡 Resultado:</h4>
            <p class="result-text">{{ plan.result }}</p>
          </div>
        </div>
      </div>

      <!-- Available Services to add -->
      <div class="available-extras" v-if="availableExtras.length > 0">
        <h2 class="section-title">Servicios Adicionales</h2>
        <div class="extras-list-simple">
          <label
            v-for="extra in availableExtras"
            :key="extra.id"
            class="extra-list-item"
          >
            <div class="list-item-left">
              <input
                type="checkbox"
                :checked="selectedExtrasIds.includes(extra.id)"
                @change="toggleExtra(extra.id)"
                class="extra-checkbox"
              />
              <div class="list-item-content">
                <span class="list-item-name">{{ extra.name }}</span>
                <p class="list-item-description">{{ extra.description }}</p>
              </div>
            </div>
            <span class="list-item-price">+{{ formatPrice(extra.price_cop, extra.price_usd, selectedCurrency) }}</span>
          </label>
        </div>
      </div>

      <div class="proposal-section" v-if="currentPlan">
        <div class="plan-header">
          <div class="plan-badge-container">
            <span class="plan-badge">📦 Plan {{ plan?.name }}</span>
          </div>
          <div class="price-container">
            <span class="price-label">Inversión Total</span>
            <div class="price">
              <span class="amount">{{ formatTotalPrice }}</span>
            </div>
          </div>
        </div>

        <!-- Features: Qué incluye tu proyecto -->
        <div class="features-section">
          <h2 class="features-title">✓ Qué incluye tu proyecto</h2>
          <div class="features-grid">
            <div
              v-for="(feature, index) in plan?.features"
              :key="index"
              class="feature-card"
            >
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Available Services to add -->
        <div class="available-extras" v-if="availableExtras.length > 0">
          <h2 class="section-title">➕ Servicios Adicionales</h2>
          <div class="extras-checklist">
            <label
              v-for="extra in availableExtras"
              :key="extra.id"
              class="extra-check-item"
            >
              <input
                type="checkbox"
                :checked="selectedExtrasIds.includes(extra.id)"
                @change="toggleExtra(extra.id)"
                class="extra-checkbox"
              />
              <div class="check-content">
                <span class="check-name">{{ extra.name }}</span>
                <span class="check-price">+{{ formatPrice(extra.price_cop, extra.price_usd, selectedCurrency) }}</span>
              </div>
              <p class="check-description">{{ extra.description }}</p>
            </label>
          </div>
        </div>

        <!-- Selected Extras Summary -->
        <div class="selected-extras" v-if="selectedExtras.length > 0">
          <h3 class="extras-title">Servicios Adicionales Incluidos</h3>
          <div class="extras-list">
            <div v-for="extra in selectedExtras" :key="extra.id" class="extra-item">
              <span>{{ extra.name }}</span>
              <span class="extra-item-price">+{{ formatPrice(extra.price_cop, extra.price_usd, selectedCurrency) }}</span>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <button @click="acceptProposal" class="btn-accept">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Aceptar Presupuesto
          </button>
          <p class="cta-note">
            Al aceptar, nos pondremos en contacto contigo en las próximas 24 horas
          </p>
        </div>

        <div v-if="accepted" class="success-message">
          <div class="success-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#10B981" opacity="0.1"/>
              <path d="M21.3333 12L14 19.3333L10.6667 16" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>¡Propuesta Aceptada!</h3>
          <p>Nos pondremos en contacto contigo pronto. Gracias por confiar en nosotros.</p>
        </div>
      </div>

      <footer class="footer">
        <div class="footer-content-contact">
          <div class="footer-section">
            <h4 class="footer-section-title">Contacto</h4>
            <a href="https://wa.me/573057502790" target="_blank" class="contact-link">📱 WhatsApp: 305 750 2790</a>
            <a href="mailto:web@oswal.com.co" class="contact-link">✉️ web@oswal.com.co</a>
          </div>
          <div class="footer-section">
            <h4 class="footer-section-title">Social</h4>
            <a href="https://www.linkedin.com/in/oswaldo-jaimes/" target="_blank" class="contact-link">💼 LinkedIn</a>
          </div>
          <div class="footer-section">
            <h4 class="footer-section-title">Ubicación</h4>
            <p class="footer-location">📍 Bogotá, Colombia</p>
          </div>
        </div>
      </footer>
    </div>

    <!-- Price Total Fixed Footer -->
    <div class="price-footer-fixed" v-if="plan">
      <div class="footer-content">
        <div class="footer-labels">
          <span class="footer-label">Inversión Total</span>
        </div>
        <div class="footer-price">{{ formatTotalPrice }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useData } from '../composables/useData';
import { getCurrencySettings, formatPrice, getPrice, type Currency } from '../lib/currency';

const route = useRoute();
const accepted = ref(false);
const selectedExtrasIds = ref<string[]>([]);
const selectedPlanId = ref<string>('');

const { categories, plans, extras, loadAll } = useData();

// Leer la moneda del localStorage guardada por el Dashboard
const selectedCurrency = computed(() => {
  const currencySettings = getCurrencySettings();
  return currencySettings.currency;
});

const clientName = computed(() => route.query.cliente as string || 'Tu Negocio');
const categoryId = computed(() => route.query.categoryId as string);

const nicho = computed(() => categories.value.find(c => c.id === categoryId.value));
const availablePlans = computed(() => plans.value.filter(p => p.category_id === categoryId.value));
const availableExtras = computed(() => extras.value);

const plan = computed(() => plans.value.find(p => p.id === selectedPlanId.value));

const selectedExtras = computed(() =>
  extras.value.filter(e => selectedExtrasIds.value.includes(e.id))
);

const totalPrice = computed(() => {
  let total = plan.value ? getPrice(plan.value.price_cop, plan.value.price_usd, selectedCurrency.value) : 0;
  selectedExtras.value.forEach(extra => {
    total += getPrice(extra.price_cop, extra.price_usd, selectedCurrency.value);
  });
  return total;
});

const formatTotalPrice = computed(() => {
  const symbol = selectedCurrency.value === 'COP' ? '$' : '$';
  const suffix = selectedCurrency.value === 'COP' ? ' COP' : ' USD';
  return `${symbol}${totalPrice.value.toLocaleString('es-CO')}${suffix}`;
});

const toggleExtra = (extraId: string) => {
  const index = selectedExtrasIds.value.indexOf(extraId);
  if (index > -1) {
    selectedExtrasIds.value.splice(index, 1);
  } else {
    selectedExtrasIds.value.push(extraId);
  }
};

const acceptProposal = () => {
  accepted.value = true;
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, 100);
};

onMounted(async () => {
  await loadAll();
  // Set initial plan from query or first available
  if (route.query.planId) {
    selectedPlanId.value = route.query.planId as string;
  } else if (availablePlans.value.length > 0) {
    selectedPlanId.value = availablePlans.value[0].id;
  }
  
  if (!nicho.value || !plan.value) {
    console.error('Datos de propuesta no encontrados');
  }
});
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, #FAFAFA 0%, #F8F9FC 100%);
  padding: 0;
  margin: 0;
  padding-bottom: 100px;
}

/* Bio Header - Instagram style */
.bio-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bio-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.bio-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bio-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #5D3FD3;
}

.bio-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bio-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.bio-line {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

/* Price sticky removed */

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
  margin-top: 60px;
}

.header {
  margin-bottom: 48px;
  display: flex;
  justify-content: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.icon {
  font-size: 28px;
}

.category {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.hero {
  text-align: center;
  margin-bottom: 64px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.highlight {
  color: #5D3FD3;
  position: relative;
}

.hero-description {
  font-size: 20px;
  color: #6B7280;
  margin: 0;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
}

.customization-section {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.plans-selector {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.plan-btn {
  flex: 1;
  min-width: 150px;
  padding: 20px 24px;
  border: 2px solid #E5E7EB;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.plan-btn:hover {
  border-color: #5D3FD3;
  box-shadow: 0 4px 12px rgba(93, 63, 211, 0.1);
}

.plan-btn.active {
  border-color: #5D3FD3;
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F3FF 100%);
  box-shadow: 0 8px 24px rgba(93, 63, 211, 0.15);
}

.plan-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.plan-price {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #5D3FD3;
}

/* Plan Summary */
.plan-summary {
  margin-top: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #F5F3FF 0%, #FAFAFA 100%);
  border-radius: 16px;
  border: 1px solid #E5E7EB;
}

.summary-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.summary-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.summary-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.summary-feature svg {
  flex-shrink: 0;
  color: #5D3FD3;
}

/* Plan description and result */
.plan-description {
  font-size: 15px;
  color: #374151;
  margin: 8px 0 12px 0;
}

.plan-result {
  margin-top: 14px;
  padding: 12px 16px;
  background: #FEF3C7;
  border-radius: 10px;
  border: 1px solid #FDE68A;
}

.result-title {
  margin: 0 0 6px 0;
  font-size: 14px;
  color: #92400E;
}

.result-text {
  margin: 0;
  color: #7C2D12;
}

/* Available Extras List */
.available-extras {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.extras-list-simple {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.extra-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #F9FAFB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 16px;
}

.extra-list-item:hover {
  background: #F5F3FF;
}

.list-item-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.extra-checkbox {
  width: 18px;
  height: 18px;
  margin-top: 3px;
  cursor: pointer;
  accent-color: #5D3FD3;
  flex-shrink: 0;
}

.list-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list-item-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.list-item-description {
  font-size: 12px;
  color: #6B7280;
  margin: 0;
  line-height: 1.3;
}

.list-item-price {
  font-size: 13px;
  font-weight: 700;
  color: #5D3FD3;
  white-space: nowrap;
  flex-shrink: 0;
}

.features-section {
  margin-bottom: 48px;
}

.features-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 14px;
  transition: all 0.2s ease;
}

.feature-card:hover {
  background: #F5F3FF;
  transform: translateX(4px);
}

.feature-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #5D3FD3 0%, #7C3AED 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-text {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  line-height: 1.5;
  padding-top: 6px;
}

/* Available Extras Section */
.available-extras {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 2px solid #E5E7EB;
}

.available-extras .section-title {
  font-size: 20px;
  margin-bottom: 20px;
}

.extras-checklist {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.extra-check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #F9FAFB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.extra-check-item:hover {
  background: #F5F3FF;
  border-color: #5D3FD3;
}

.extra-checkbox {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 3px;
  cursor: pointer;
  accent-color: #5D3FD3;
}

.check-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.check-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.check-price {
  font-size: 14px;
  font-weight: 700;
  color: #5D3FD3;
  white-space: nowrap;
}

.check-description {
  grid-column: 2;
  font-size: 12px;
  color: #9CA3AF;
  margin: 4px 0 0 0;
}

.proposal-section {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 48px;
  margin-bottom: 32px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
  margin-bottom: 40px;
  border-bottom: 2px solid #F3F4F6;
}

.plan-badge-container {
  flex: 1;
}

.plan-badge {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #5D3FD3 0%, #7C3AED 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

.price-container {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 14px;
  color: #6B7280;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;
}

.amount {
  font-size: 48px;
  font-weight: 700;
  color: #5D3FD3;
  line-height: 1;
}

.cta-section {
  text-align: center;
  padding-top: 32px;
  border-top: 2px solid #F3F4F6;
}

.btn-accept {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 48px;
  background: linear-gradient(135deg, #5D3FD3 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(93, 63, 211, 0.3);
}

.btn-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(93, 63, 211, 0.4);
}

.btn-accept:active {
  transform: translateY(0);
}

.cta-note {
  margin-top: 16px;
  font-size: 14px;
  color: #6B7280;
}

.success-message {
  margin-top: 32px;
  padding: 32px;
  background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
  border-radius: 16px;
  text-align: center;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.success-message h3 {
  font-size: 24px;
  font-weight: 700;
  color: #065F46;
  margin: 0 0 8px 0;
}

.success-message p {
  font-size: 16px;
  color: #047857;
  margin: 0;
}

.footer {
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  padding: 48px 24px;
  margin-top: 60px;
  border-top: 3px solid #5D3FD3;
}

.footer-content-contact {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #5D3FD3;
  margin: 0;
}

.contact-link {
  color: #E5E7EB;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-block;
}

.contact-link:hover {
  color: #5D3FD3;
  transform: translateX(4px);
}

.footer-location {
  color: #E5E7EB;
  font-size: 14px;
  margin: 0;
}

.footer strong {
  color: #5D3FD3;
  font-weight: 700;
}

.customization-section {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.plans-selector {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.plan-btn {
  flex: 1;
  min-width: 150px;
  padding: 20px 24px;
  border: 2px solid #E5E7EB;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.plan-btn:hover {
  border-color: #5D3FD3;
  box-shadow: 0 4px 12px rgba(93, 63, 211, 0.1);
}

.plan-btn.active {
  border-color: #5D3FD3;
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F3FF 100%);
  box-shadow: 0 8px 24px rgba(93, 63, 211, 0.15);
}

.plan-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.plan-price {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #5D3FD3;
}

.selected-extras {
  background: #F9FAFB;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0 24px 0;
}

.extras-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.extras-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extra-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #5D3FD3;
}

.extra-item-price {
  font-weight: 700;
  color: #5D3FD3;
}

/* Price Footer Fixed */
.price-footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 3px solid #5D3FD3;
  padding: 16px 0;
  z-index: 50;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.footer-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-label {
  font-size: 12px;
  color: #6B7280;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.footer-price {
  font-size: 28px;
  font-weight: 700;
  color: #5D3FD3;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .bio-header {
    padding: 16px 0;
  }

  .bio-container {
    padding: 0 16px;
  }

  .bio-avatar {
    width: 70px;
    height: 70px;
  }

  .bio-name {
    font-size: 14px;
  }

  .bio-line {
    font-size: 11px;
  }

  /* removed top sticky adjustments */

  .container {
    padding: 24px 16px;
    margin-top: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-description {
    font-size: 16px;
  }

  .proposal-section {
    padding: 24px 16px;
  }

  .plan-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .amount {
    font-size: 40px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .extra-check-item {
    flex-wrap: wrap;
  }

  .check-content {
    width: 100%;
  }

  .check-description {
    width: 100%;
    margin-top: 8px;
  }

  .btn-accept {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
  }

  .plans-selector {
    flex-direction: column;
  }

  .plan-btn {
    min-width: unset;
  }

  .extras-grid {
    grid-template-columns: 1fr;
  }

  .price-footer-fixed {
    padding: 12px 0;
  }

  .footer-content {
    padding: 0 16px;
    gap: 16px;
  }

  .footer-price {
    font-size: 22px;
  }

  .footer-label {
    font-size: 10px;
  }

  .footer {
    padding: 32px 16px;
  }

  .footer-content-contact {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-section-title {
    font-size: 12px;
  }

  .contact-link {
    font-size: 13px;
  }

  .footer-location {
    font-size: 13px;
  }
}
</style>
