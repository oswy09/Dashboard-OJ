export interface ExchangeRateData {
  rate: number;
  timestamp: number;
  source: string;
}

const EXCHANGE_RATE_KEY = 'dolar_exchange_rate';
const EXCHANGE_RATE_TIMESTAMP_KEY = 'dolar_exchange_rate_timestamp';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

// Función para obtener la cotización desde una API gratuita
const fetchFromPublicAPI = async (): Promise<number> => {
  try {
    // Usando Open Exchange Rates API (requiere estar en línea)
    // Alternativa gratuita sin key para consultas básicas
    const response = await fetch(
      'https://open.er-api.com/v6/latest/USD'
    );
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const rate = data.rates?.COP;
    
    if (!rate) throw new Error('Rate not found');
    
    return rate;
  } catch (error) {
    console.warn('Error fetching from primary API, trying fallback...', error);
    
    // Fallback a otra API
    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (!response.ok) throw new Error('Fallback API error');
      
      const data = await response.json();
      const rate = data.rates?.COP;
      
      if (!rate) throw new Error('Rate not found');
      
      return rate;
    } catch (fallbackError) {
      console.error('All APIs failed:', fallbackError);
      throw new Error('No se pudo obtener la cotización del dólar');
    }
  }
};

// Obtener la cotización en caché o desde la API
export const getExchangeRate = async (forceRefresh = false): Promise<ExchangeRateData> => {
  const cached = localStorage.getItem(EXCHANGE_RATE_KEY);
  const cachedTimestamp = localStorage.getItem(EXCHANGE_RATE_TIMESTAMP_KEY);
  const now = Date.now();
  
  // Si no forzamos refresh y tenemos caché válido, lo retornamos
  if (!forceRefresh && cached && cachedTimestamp) {
    const timestamp = parseInt(cachedTimestamp);
    if (now - timestamp < CACHE_DURATION) {
      return {
        rate: parseFloat(cached),
        timestamp,
        source: 'cache'
      };
    }
  }
  
  try {
    // Obtener de la API
    const rate = await fetchFromPublicAPI();
    
    // Guardar en caché
    localStorage.setItem(EXCHANGE_RATE_KEY, rate.toString());
    localStorage.setItem(EXCHANGE_RATE_TIMESTAMP_KEY, now.toString());
    
    return {
      rate,
      timestamp: now,
      source: 'api'
    };
  } catch (error) {
    // Si falla la API y tenemos caché expirado, usamos el caché de todas formas
    if (cached) {
      console.warn('Using expired cache due to API failure');
      return {
        rate: parseFloat(cached),
        timestamp: cachedTimestamp ? parseInt(cachedTimestamp) : 0,
        source: 'cache_expired'
      };
    }
    
    throw error;
  }
};

// Función para establecer manualmente la cotización
export const setExchangeRate = (rate: number): void => {
  localStorage.setItem(EXCHANGE_RATE_KEY, rate.toString());
  localStorage.setItem(EXCHANGE_RATE_TIMESTAMP_KEY, Date.now().toString());
};

// Obtener el valor guardado
export const getSavedExchangeRate = (): number => {
  const saved = localStorage.getItem(EXCHANGE_RATE_KEY);
  return saved ? parseFloat(saved) : 4300; // Default
};

// Convertir COP a USD
export const copToUsd = (cop: number, rate: number): number => {
  return Math.round((cop / rate) * 100) / 100;
};

// Convertir USD a COP
export const usdToCop = (usd: number, rate: number): number => {
  return Math.round(usd * rate);
};
