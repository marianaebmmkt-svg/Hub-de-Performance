
import { PerformanceData, ActionLog, Account, User, PagePerformance, FormPerformanceData } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc_01', name: 'Empresta Bem Melhor - Pesquisa', provider: 'Google' },
  { id: 'acc_02', name: 'Empresta Bem Melhor - Performance Max', provider: 'Google' },
  { id: 'acc_03', name: 'Empresta Facebook - Retargeting', provider: 'Meta' },
  { id: 'acc_04', name: 'Portal Institucional', provider: 'SearchConsole' },
];

export const MOCK_PERFORMANCE: PerformanceData[] = [
  { campaign_id: 'cmp_01', account_id: 'acc_01', provider_name: 'Google', date: '2026-01-01', state: 'current', conversions: 45, cost: 1200, clicks: 850, impressions: 12000, source: 'mock', timestamp: 0, dimension_name: 'Busca - FGTS' },
  { campaign_id: 'cmp_01', account_id: 'acc_01', provider_name: 'Google', date: '2026-01-05', state: 'current', conversions: 52, cost: 1350, clicks: 920, impressions: 13500, source: 'mock', timestamp: 0, dimension_name: 'Busca - FGTS' },
  { campaign_id: 'cmp_02', account_id: 'acc_02', provider_name: 'Google', date: '2026-01-10', state: 'current', conversions: 48, cost: 1100, clicks: 880, impressions: 11000, source: 'mock', timestamp: 0, dimension_name: 'PMax - Consignado' },
  { campaign_id: 'cmp_03', account_id: 'acc_03', provider_name: 'Meta', date: '2026-01-12', state: 'current', conversions: 62, cost: 1500, clicks: 1100, impressions: 18000, source: 'mock', timestamp: 0, dimension_name: 'Facebook - Retargeting' },
  { campaign_id: 'cmp_01', account_id: 'acc_01', provider_name: 'Google', date: '2026-01-15', state: 'current', conversions: 75, cost: 1800, clicks: 1400, impressions: 21000, source: 'mock', timestamp: 0, dimension_name: 'Busca - FGTS' },
];

export const MOCK_TOP_PAGES: PagePerformance[] = [
  { path: '/fgts', title: 'Saque Aniversário FGTS', views: 12500, conversions: 450, convRate: 3.6 },
  { path: '/consignado', title: 'Empréstimo Consignado INSS', views: 8900, conversions: 310, convRate: 3.48 },
  { path: '/blog/dicas', title: 'Dicas Financeiras', views: 4200, conversions: 45, convRate: 1.07 },
];

export const MOCK_FORMS: FormPerformanceData[] = [
  { id: 'form_lead_fgts', name: 'Lead Principal FGTS', views: 5400, submissions: 450, convRate: 8.33 },
  { id: 'form_lead_inss', name: 'Lead Consignado INSS', views: 3200, submissions: 280, convRate: 8.75 },
];

export const ACTIONS_LOG: ActionLog[] = [
  { account_id: 'acc_01', provider_name: 'Google', date: '2026-01-05', action: 'Lançamento de criativos focados em FGTS', category: 'ads' },
  { account_id: 'acc_01', provider_name: 'Google', date: '2026-01-15', action: 'Implementação de Script de Lances', category: 'ads' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'coordenador@hub.com', role: 'admin', status: 'active' },
];

export const COLORS = {
  primary: '#1e293b', // Slate 800 - Executivo
  secondary: '#334155', // Slate 700
  accent: '#6366f1', // Indigo 500
  danger: '#e11d48', // Rose 600
  background: '#f8fafc',
  paid: '#0f172a', // Quase preto para pago
  organic: '#10b981', // Emerald para orgânico
  grid: '#e2e8f0',
  text: '#64748b'
};
