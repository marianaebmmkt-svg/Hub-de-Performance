
import { PerformanceData, ActionLog, Account, User, PagePerformance, FormPerformanceData } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc_01', name: 'Empresta Bem Melhor - Pesquisa', provider: 'Google' },
  { id: 'acc_02', name: 'Empresta Bem Melhor - Performance Max', provider: 'Google' },
  { id: 'acc_03', name: 'Empresta Facebook - Retargeting', provider: 'Meta' },
  { id: 'acc_04', name: 'Portal Institucional', provider: 'SearchConsole' },
];

export const MOCK_PERFORMANCE: PerformanceData[] = [
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-01', conversions: 45, conversions_prev: 40, cost: 1200, cost_prev: 1100, clicks: 850, clicks_prev: 800, impressions: 12000, impressions_prev: 11000, engagement_rate: 65 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-05', conversions: 52, conversions_prev: 48, cost: 1350, cost_prev: 1250, clicks: 920, clicks_prev: 880, impressions: 13500, impressions_prev: 13000, engagement_rate: 68, event: 'Novo Criativo Vídeo' },
  { account_id: 'acc_02', provider_name: 'Google', date: '2023-10-10', conversions: 48, conversions_prev: 44, cost: 1100, cost_prev: 1050, clicks: 880, clicks_prev: 840, impressions: 11000, impressions_prev: 10500, engagement_rate: 62 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-15', conversions: 75, conversions_prev: 70, cost: 1800, cost_prev: 1700, clicks: 1400, clicks_prev: 1300, impressions: 21000, impressions_prev: 20000, engagement_rate: 72, event: 'Ajuste de Lance Automático' },
  { account_id: 'acc_03', provider_name: 'Meta', date: '2023-10-20', conversions: 62, conversions_prev: 58, cost: 1500, cost_prev: 1450, clicks: 1100, clicks_prev: 1050, impressions: 18000, impressions_prev: 17500, engagement_rate: 58 },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-25', conversions: 88, conversions_prev: 80, cost: 2200, cost_prev: 2100, clicks: 1750, clicks_prev: 1600, impressions: 25000, impressions_prev: 24000, engagement_rate: 75, event: 'Campanha Black Friday Antecipada' },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-30', conversions: 95, conversions_prev: 90, cost: 2400, cost_prev: 2300, clicks: 1900, clicks_prev: 1850, impressions: 28000, impressions_prev: 27000, engagement_rate: 78 },
];

export const MOCK_TOP_PAGES: PagePerformance[] = [
  { path: '/fgts', title: 'Saque Aniversário FGTS', views: 12500, conversions: 450, convRate: 3.6 },
  { path: '/consignado', title: 'Empréstimo Consignado INSS', views: 8900, conversions: 310, convRate: 3.48 },
  { path: '/blog/como-economizar', title: 'Como economizar no dia a dia', views: 4200, conversions: 45, convRate: 1.07 },
  { path: '/contato', title: 'Fale Conosco', views: 2100, conversions: 85, convRate: 4.05 },
];

export const MOCK_FORMS: FormPerformanceData[] = [
  { id: 'form_lead_fgts', name: 'Lead Principal FGTS', views: 5400, submissions: 450, convRate: 8.33 },
  { id: 'form_lead_inss', name: 'Lead Consignado INSS', views: 3200, submissions: 280, convRate: 8.75 },
  { id: 'form_newsletter', name: 'Inscrição Newsletter', views: 1500, submissions: 45, convRate: 3.0 },
];

export const ACTIONS_LOG: ActionLog[] = [
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-05', action: 'Lançamento de criativos focados em FGTS', category: 'ads' },
  { account_id: 'acc_04', provider_name: 'SearchConsole', date: '2023-10-12', action: 'Otimização de Meta Titles do blog', category: 'seo' },
  { account_id: 'acc_01', provider_name: 'Google', date: '2023-10-15', action: 'Implementação de Script de Lances', category: 'ads' },
  { account_id: 'acc_03', provider_name: 'Meta', date: '2023-10-25', action: 'Início da Promoção Outubro Rosa', category: 'meta' },
];

// Added MOCK_USERS to support AdminManagement component
export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'mari@hubperformance.com', role: 'admin', status: 'active' },
  { id: 'u2', email: 'analista@hubperformance.com', role: 'viewer', status: 'active' },
  { id: 'u3', email: 'colaborador@hubperformance.com', role: 'viewer', status: 'pending' },
];

export const COLORS = {
  primary: '#4f46e5', // Indigo - Pago
  secondary: '#10b981', // Emerald - Orgânico
  accent: '#f59e0b',
  danger: '#ef4444',
  background: '#f8fafc',
  paid: '#6366f1',
  organic: '#10b981',
};
