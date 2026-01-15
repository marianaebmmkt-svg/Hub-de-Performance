
import { PerformanceData, DateRange, ConnectionStatus, DataSource, DataEngineState } from '../types';
import { MOCK_PERFORMANCE } from '../constants';
import { mergeDataSources } from './dataProcessor';

export const fetchPerformanceData = async (
  accountId: string, 
  dateRange: DateRange
): Promise<{ data: PerformanceData[], state: DataEngineState }> => {
  let consolidatedData: PerformanceData[] = [];
  const activeSources: DataSource[] = [];
  
  const stored = localStorage.getItem('mari_hub_connections');
  const connections: ConnectionStatus[] = stored ? JSON.parse(stored) : [];
  
  // 1. CARREGA DADOS DO OAUTH (Se disponível)
  const adsConn = connections.find(c => c.provider === 'google_ads' && c.isConnected && c.accessToken);
  if (adsConn) {
    // Simulação de resposta da API - Em um app real, aqui haveria um fetch real
    const oauthData: PerformanceData[] = MOCK_PERFORMANCE.map(d => ({ 
      ...d, 
      id: btoa(`google_oauth_${d.date}_total`),
      source: 'oauth',
      state: 'current', // APIs em tempo real costumam ser estado 'current'
      timestamp: Date.now() 
    }));
    consolidatedData = mergeDataSources(consolidatedData, oauthData);
    activeSources.push('oauth');
  }

  // 2. CARREGA DADOS DO STORAGE (CSV / WEBHOOK / FECHAMENTOS)
  const localDataKey = 'consolidated_performance_db';
  const savedLocalData = localStorage.getItem(localDataKey);
  if (savedLocalData) {
    const localEntries: PerformanceData[] = JSON.parse(savedLocalData);
    
    // Filtro inteligente por range de data
    const filteredLocal = localEntries.filter(d => {
      const dDate = new Date(d.date);
      return dDate >= dateRange.start && dDate <= dateRange.end;
    });
    
    if (filteredLocal.length > 0) {
      consolidatedData = mergeDataSources(consolidatedData, filteredLocal);
      if (!activeSources.includes('csv')) activeSources.push('csv');
    }
  }

  // 3. SE VAZIO, USA MOCK PARA TESTES
  if (consolidatedData.length === 0) {
    consolidatedData = MOCK_PERFORMANCE.map(d => ({ 
      ...d, 
      id: btoa(`mock_${d.date}`),
      source: 'mock', 
      timestamp: 0 
    }));
    activeSources.push('mock');
  }

  // Ordenação por data
  consolidatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { 
    data: consolidatedData, 
    state: { 
      activeSource: activeSources, 
      isFallback: activeSources.includes('mock') || activeSources.includes('csv'),
      confidenceScore: activeSources.includes('oauth') ? 100 : activeSources.includes('csv') ? 95 : 50
    } 
  };
};
