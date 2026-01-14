
import { PerformanceData, ActionLog, Account, User } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc_01', name: 'Empresta Bem Melhor - Pesquisa', provider: 'Google' },
  { id: 'acc_02', name: 'Empresta Bem Melhor - Performance Max', provider: 'Google' },
  { id: 'acc_03', name: 'Empresta Facebook - Retargeting', provider: 'Meta' },
  { id: 'acc_04', name: 'Portal Institucional', provider: 'SearchConsole' },
];

export const MOCK_PERFORMANCE: PerformanceData[] = [
  // Fix: Added missing comparison metrics (conversions_prev, cost_prev, clicks_prev, impressions_prev) to match PerformanceData interface
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-01', conversions: 45, conversions_prev: 40, cost: 1200, cost_prev: 1100, clicks: 850, clicks_prev: 800, impressions: 12000, impressions_prev: 11000 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-05', conversions: 52, conversions_prev: 48, cost: 1350, cost_prev: 1250, clicks: 920, clicks_prev: 880, impressions: 13500, impressions_prev: 13000, event: 'Novo Criativo Vídeo' },
  { account_id: 'acc_02', provider_name: 'Google', date: '2023-10-10', conversions: 48, conversions_prev: 44, cost: 1100, cost_prev: 1050, clicks: 880, clicks_prev: 840, impressions: 11000, impressions_prev: 10500 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-15', conversions: 75, conversions_prev: 70, cost: 1800, cost_prev: 1700, clicks: 1400, clicks_prev: 1300, impressions: 21000, impressions_prev: 20000, event: 'Ajuste de Lance Automático' },
  { account_id: 'acc_03', provider_name: 'Meta', date: '2023-10-20', conversions: 62, conversions_prev: 58, cost: 1500, cost_prev: 1450, clicks: 1100, clicks_prev: 1050, impressions: 18000, impressions_prev: 17500 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-25', conversions: 88, conversions_prev: 80, cost: 2200, cost_prev: 2100, clicks: 1750, clicks_prev: 1600, impressions: 25000, impressions_prev: 24000, event: 'Campanha Black Friday Antecipada' },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-30', conversions: 95, conversions_prev: 90, cost: 2400, cost_prev: 2300, clicks: 1900, clicks_prev: 1850, impressions: 28000, impressions_prev: 27000 },
];

export const ACTIONS_LOG: ActionLog[] = [
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-05', action: 'Lançamento de criativos focados em FGTS', category: 'ads' },
  { account_id: 'acc_04', provider_name: 'SearchConsole', date: '2023-10-12', action: 'Otimização de Meta Titles do blog', category: 'seo' },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-15', action: 'Implementação de Script de Lances', category: 'ads' },
  { account_id: 'acc_03', provider_name: 'Meta', date: '2023-10-25', action: 'Início da Promoção Outubro Rosa', category: 'meta' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@mari.hub', role: 'admin', status: 'active' },
  { id: 'u2', email: 'gestor@emprestabem.com.br', role: 'viewer', status: 'active' },
  { id: 'u3', email: 'analista@marketing.com', role: 'viewer', status: 'pending' },
];

export const COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  background: '#f8fafc',
};
