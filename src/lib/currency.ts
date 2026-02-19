import { getSavedExchangeRate, copToUsd } from './exchangeRate';

export type Currency = 'COP' | 'USD';

export interface CurrencySettings {
  currency: Currency;
  exchangeRate: number;
}

const CURRENCY_KEY = 'proposal_currency_settings';

export const getDefaultCurrencySettings = (): CurrencySettings => {
  return {
    currency: 'COP',
    exchangeRate: getSavedExchangeRate()
  };
};

export const getCurrencySettings = (): CurrencySettings => {
  const stored = localStorage.getItem(CURRENCY_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Siempre usar la tasa de cambio actual
      parsed.exchangeRate = getSavedExchangeRate();
      return parsed;
    } catch {
      return getDefaultCurrencySettings();
    }
  }
  return getDefaultCurrencySettings();
};

export const saveCurrencySettings = (settings: CurrencySettings): void => {
  localStorage.setItem(CURRENCY_KEY, JSON.stringify(settings));
};

export const formatPrice = (priceCOP: number, priceUSD: number, currency: Currency): string => {
  let price: number;
  
  if (currency === 'COP') {
    price = priceCOP;
  } else {
    // Convertir automáticamente de COP a USD usando la cotización actual
    const rate = getSavedExchangeRate();
    price = copToUsd(priceCOP, rate);
  }
  
  const symbol = '$';
  const suffix = currency === 'COP' ? ' COP' : ' USD';

  return `${symbol}${price.toLocaleString('es-CO')}${suffix}`;
};

export const getPrice = (priceCOP: number, priceUSD: number, currency: Currency): number => {
  if (currency === 'COP') {
    return priceCOP;
  } else {
    // Convertir automáticamente de COP a USD usando la cotización actual
    const rate = getSavedExchangeRate();
    return copToUsd(priceCOP, rate);
  }
};
