
import { PerformanceData, DateRange, ConnectionStatus } from '../types';
import { MOCK_PERFORMANCE } from '../constants';

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * GOOGLE ADS API - Relatório de Performance de Campanha
 */
export const fetchAdsRealData = async (token: string, customerId: string, range: DateRange) => {
  const customer = customerId.replace(/-/g, '');
  const query = `
    SELECT 
      metrics.cost_micros, 
      metrics.clicks, 
      metrics.conversions, 
      metrics.impressions,
      segments.date 
    FROM campaign 
    WHERE segments.date BETWEEN '${formatDate(range.start)}' AND '${formatDate(range.end)}'
  `;

  const response = await fetch(`https://googleads.googleapis.com/v17/customers/${customer}/googleAds:search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      // 'developer-token': 'SEU_DEVELOPER_TOKEN' // Nota: Necessário em produção real do Google Ads API
    },
    body: JSON.stringify({ query })
  });

  if (response.status === 401) throw new Error('AUTH_EXPIRED');
  return response.json();
};

/**
 * GOOGLE ANALYTICS 4 - Conversões e Engajamento
 */
export const fetchGA4RealData = async (token: string, propertyId: string, range: DateRange) => {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: formatDate(range.start), endDate: formatDate(range.end) }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'conversions' },
        { name: 'engagementRate' }
      ],
      dimensions: [{ name: 'date' }]
    })
  });

  if (response.status === 401) throw new Error('AUTH_EXPIRED');
  return response.json();
};

/**
 * SEARCH CONSOLE - Performance Orgânica
 */
export const fetchGSCRealData = async (token: string, siteUrl: string, range: DateRange) => {
  const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: formatDate(range.start),
      endDate: formatDate(range.end),
      dimensions: ['date']
    })
  });

  if (response.status === 401) throw new Error('AUTH_EXPIRED');
  return response.json();
};

/**
 * ORQUESTRADOR DE DADOS
 */
export const fetchPerformanceData = async (accountId: string, dateRange: DateRange): Promise<PerformanceData[]> => {
  const stored = localStorage.getItem('mari_hub_connections');
  const connections: ConnectionStatus[] = stored ? JSON.parse(stored) : [];
  
  const ads = connections.find(c => c.provider === 'google_ads' && c.isConnected);
  const ga4 = connections.find(c => c.provider === 'ga4' && c.isConnected);
  const gsc = connections.find(c => c.provider === 'gsc' && c.isConnected);

  // Se não houver tokens, mantém o fallback Mock para a demonstração
  if (!ads?.accessToken && !ga4?.accessToken) {
    return MOCK_PERFORMANCE;
  }

  const results: PerformanceData[] = [];

  try {
    // Busca dados reais do GA4 (Conversões de Leads via GTM/GA4)
    if (ga4?.accessToken && ga4?.accountId) {
      const ga4Data = await fetchGA4RealData(ga4.accessToken, ga4.accountId, dateRange);
      ga4Data.rows?.forEach((row: any) => {
        results.push({
          account_id: accountId,
          provider_name: 'Analytics',
          date: row.dimensionValues[0].value,
          conversions: parseFloat(row.metricValues[1].value),
          conversions_prev: 0,
          cost: 0,
          cost_prev: 0,
          clicks: 0,
          clicks_prev: 0,
          impressions: 0,
          impressions_prev: 0,
          engagement_rate: parseFloat(row.metricValues[2].value) * 100
        });
      });
    }

    // Busca dados reais do Google Ads
    if (ads?.accessToken && ads?.accountId) {
      const adsData = await fetchAdsRealData(ads.accessToken, ads.accountId, dateRange);
      adsData.results?.forEach((row: any) => {
        results.push({
          account_id: accountId,
          provider_name: 'Google Ads',
          date: row.segments.date,
          conversions: parseFloat(row.metrics.conversions),
          conversions_prev: 0,
          cost: parseFloat(row.metrics.costMicros) / 1000000,
          cost_prev: 0,
          clicks: parseFloat(row.metrics.clicks),
          clicks_prev: 0,
          impressions: parseFloat(row.metrics.impressions),
          impressions_prev: 0
        });
      });
    }

    return results.length > 0 ? results : MOCK_PERFORMANCE;
  } catch (error: any) {
    if (error.message === 'AUTH_EXPIRED') throw error;
    console.warn("Usando fallback de dados mock devido a erro na API:", error);
    return MOCK_PERFORMANCE;
  }
};
