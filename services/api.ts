
import { PerformanceData, DateRange, ConnectionStatus } from '../types';

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getEnvVar = (key: string): string => {
  // Added cast to any for import.meta to resolve property access error in TypeScript
  return ((import.meta as any).env?.[key] as string) || (process.env?.[key] as string) || '';
};

/**
 * GOOGLE ADS API - Extração Real via GAQL
 */
export const fetchAdsRealData = async (token: string, customerId: string, range: DateRange) => {
  const customer = customerId.replace(/-/g, '');
  const devToken = getEnvVar('VITE_GOOGLE_ADS_DEVELOPER_TOKEN');
  
  const query = `
    SELECT 
      metrics.cost_micros, 
      metrics.clicks, 
      metrics.conversions, 
      metrics.impressions,
      segments.date 
    FROM campaign 
    WHERE segments.date BETWEEN '${formatDate(range.start)}' AND '${formatDate(range.end)}'
    ORDER BY segments.date ASC
  `;

  try {
    const response = await fetch(`https://googleads.googleapis.com/v17/customers/${customer}/googleAds:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'developer-token': devToken || ''
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) throw new Error('AUTH_EXPIRED');
      if (result.error?.details?.some((d: any) => d.error_code?.authorization_error === 'DEVELOPER_TOKEN_NOT_APPROVED')) {
        throw new Error('DEV_TOKEN_UNAUTHORIZED');
      }
      throw new Error('ADS_API_ERROR');
    }
    
    return result;
  } catch (e) {
    console.error("Ads API Error:", e);
    throw e;
  }
};

/**
 * GA4 DATA API - Extração Real
 */
export const fetchGA4RealData = async (token: string, propertyId: string, range: DateRange) => {
  try {
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
          { name: 'sessions' },
          { name: 'conversions' },
          { name: 'engagementRate' }
        ],
        dimensions: [{ name: 'date' }]
      })
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error("GA4 API Error:", e);
    return null;
  }
};

/**
 * ENGINE DE SINCRONIZAÇÃO OAUTH2
 */
export const fetchPerformanceData = async (accountId: string, dateRange: DateRange): Promise<PerformanceData[]> => {
  const stored = localStorage.getItem('mari_hub_connections');
  const connections: ConnectionStatus[] = stored ? JSON.parse(stored) : [];
  
  const adsConn = connections.find(c => c.provider === 'google_ads' && c.isConnected);
  const ga4Conn = connections.find(c => c.provider === 'ga4' && c.isConnected);

  if (!adsConn?.accessToken && !ga4Conn?.accessToken) {
    throw new Error('NO_CONNECTIONS');
  }

  const results: PerformanceData[] = [];

  try {
    if (adsConn?.accessToken) {
      const adsData = await fetchAdsRealData(
        adsConn.accessToken, 
        getEnvVar('VITE_GOOGLE_ADS_CUSTOMER_ID') || adsConn.accountId || '6316307698', 
        dateRange
      );
      if (adsData?.results) {
        adsData.results.forEach((row: any) => {
          results.push({
            account_id: 'ads_real',
            provider_name: 'Google Ads',
            date: row.segments.date,
            conversions: parseFloat(row.metrics.conversions) || 0,
            conversions_prev: 0,
            cost: (parseFloat(row.metrics.costMicros) / 1000000) || 0,
            cost_prev: 0,
            clicks: parseFloat(row.metrics.clicks) || 0,
            clicks_prev: 0,
            impressions: parseFloat(row.metrics.impressions) || 0,
            impressions_prev: 0
          });
        });
      }
    }

    if (ga4Conn?.accessToken) {
      const ga4Data = await fetchGA4RealData(
        ga4Conn.accessToken, 
        getEnvVar('VITE_GA4_PROPERTY_ID') || ga4Conn.accountId || '375210574', 
        dateRange
      );
      if (ga4Data?.rows) {
        ga4Data.rows.forEach((row: any) => {
          results.push({
            account_id: 'ga4_real',
            provider_name: 'Analytics',
            date: row.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
            conversions: parseFloat(row.metricValues[2].value) || 0,
            conversions_prev: 0,
            cost: 0,
            cost_prev: 0,
            clicks: parseFloat(row.metricValues[1].value) || 0,
            clicks_prev: 0,
            impressions: 0,
            impressions_prev: 0,
            engagement_rate: (parseFloat(row.metricValues[3].value) * 100) || 0
          });
        });
      }
    }

    return results;
  } catch (error: any) {
    console.error("Critical API Sync Error:", error);
    throw error;
  }
};
