
import { PerformanceData, DateRange } from '../types';
import { MOCK_PERFORMANCE } from '../constants';

const API_BASE_URL = 'https://api.mari-performance.hub'; // Placeholder

/**
 * Simula uma chamada de API para buscar dados de performance.
 * Em produção, isso usaria fetch com Bearer tokens OAuth2.
 */
export const fetchPerformanceData = async (
  accountId: string, 
  dateRange: DateRange
): Promise<PerformanceData[]> => {
  // Simula latência de rede
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simula o filtro e a busca
  console.log(`[API] Buscando dados para ${accountId} entre ${dateRange.start.toLocaleDateString()} e ${dateRange.end.toLocaleDateString()}`);
  
  // Em um cenário real, o backend retornaria os dados calculados com o "prev" 
  // com base no período de comparação solicitado.
  return MOCK_PERFORMANCE.filter(data => data.account_id === accountId || accountId === 'all');
};

/**
 * Esqueleto para integração futura com Google Ads API
 */
export const syncGoogleAds = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/v1/google-ads/sync`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

/**
 * Esqueleto para integração futura com Meta Marketing API
 */
export const syncMetaAds = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/v1/meta-ads/sync`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
