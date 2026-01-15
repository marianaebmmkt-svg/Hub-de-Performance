
import { PerformanceData, DateRange, ConnectionStatus } from '../types';

/**
 * ENGINE DE SINCRONIZAÇÃO OAUTH2 PADRÃO
 */
export const fetchPerformanceData = async (accountId: string, dateRange: DateRange): Promise<PerformanceData[]> => {
  const stored = localStorage.getItem('mari_hub_connections');
  const connections: ConnectionStatus[] = stored ? JSON.parse(stored) : [];
  
  const adsConn = connections.find(c => c.provider === 'google_ads' && c.isConnected);
  const ga4Conn = connections.find(c => c.provider === 'ga4' && c.isConnected);

  if (!adsConn?.accessToken && !ga4Conn?.accessToken) {
    // Retorna vazio para que o Dashboard use os dados de demonstração (Mock)
    return [];
  }

  // Aqui entrariam as chamadas reais de API usando adsConn.accessToken ou ga4Conn.accessToken
  // Por enquanto, mantemos a estrutura preparada para a integração de dados
  return [];
};
