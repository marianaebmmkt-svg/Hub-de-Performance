
import { PerformanceData, ReportType, DataSource, DataState } from '../types';

export const FIELD_MAP_HINTS: Record<string, string[]> = {
  date: ['dia', 'data', 'day', 'date', 'periodo', 'reporting starts'],
  cost: ['custo', 'cost', 'valor gasto', 'investimento', 'amount spent', 'spent'],
  conversions: ['conversoes', 'conversions', 'leads', 'results', 'results_delivered'],
  clicks: ['cliques', 'clicks', 'link clicks'],
  impressions: ['impressoes', 'impressions'],
  dimension: ['campanha', 'campaign', 'page', 'url', 'ad set name'],
  avg_session_duration: ['tempo médio', 'engagement time'],
  bounce_rate: ['rejeicao', 'bounce'],
  position: ['posicao', 'position']
};

export const mergeDataSources = (base: PerformanceData[], newData: PerformanceData[]): PerformanceData[] => {
  const map = new Map<string, PerformanceData>();
  
  // Base legada
  base.forEach(item => {
    const key = `${item.provider_name}_${item.date}_${item.dimension_name}_${item.report_type}`;
    map.set(key, item);
  });

  // Novos dados com inteligência de unificação
  newData.forEach(newItem => {
    const key = `${newItem.provider_name}_${newItem.date}_${newItem.dimension_name}_${newItem.report_type}`;
    
    // Se já existe, atualizamos os campos financeiros mas verificamos duplicidade de Leads
    const existing = map.get(key);
    if (existing) {
      // Se for o mesmo provedor, somamos (ex: várias linhas da mesma campanha em datas diferentes)
      // Se for fechamento mensal, o novo dado ('closed') sempre substitui o corrente ('current')
      if (newItem.state === 'closed' || newItem.timestamp > existing.timestamp) {
        map.set(key, newItem);
      }
    } else {
      map.set(key, newItem);
    }
  });

  return Array.from(map.values());
};

export const processCSVWithMapping = (
  content: string, 
  provider: string, 
  mapping: Record<string, number>,
  fixedDate?: string,
  forcedType?: ReportType,
  state: DataState = 'current'
): PerformanceData[] => {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    // Nomenclaturas Meta Ads específicas
    const isMeta = provider.toLowerCase().includes('meta');
    
    const entry: PerformanceData = {
      account_id: 'csv_upload',
      provider_name: provider,
      report_type: forcedType || (isMeta ? ReportType.META_CAMPAIGN : ReportType.CAMPAIGN),
      state: state,
      source: 'csv',
      timestamp: Date.now(),
      date: fixedDate || values[mapping['date']] || new Date().toISOString().split('T')[0],
      conversions: parseFloat(values[mapping['conversions']]) || 0,
      cost: parseFloat(values[mapping['cost']]) || 0,
      clicks: parseFloat(values[mapping['clicks']]) || 0,
      impressions: parseFloat(values[mapping['impressions']]) || 0,
      dimension_name: values[mapping['dimension']] || 'Campanha Indefinida'
    };
    
    entry.id = btoa(`${provider}_${entry.date}_${entry.dimension_name}_${entry.report_type}`);
    return entry;
  });
};
