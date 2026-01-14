
export enum ViewType {
  DASHBOARD = 'dashboard',
  GOOGLE_ADS = 'ads',
  META_ADS = 'meta',
  SEARCH_CONSOLE = 'seo',
  ANALYTICS = 'analytics',
  LEAD_TOOLS = 'tools',
  INSIGHTS = 'insights',
  ADMIN = 'admin'
}

export interface Account {
  id: string;
  name: string;
  provider: 'Google' | 'Meta' | 'SearchConsole' | 'Analytics';
}

export interface DateRange {
  label: string;
  start: Date;
  end: Date;
  compare: boolean;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  suffix?: string;
  previousValue?: string | number;
}

export interface PerformanceData {
  account_id: string;
  provider_name: string;
  date: string;
  conversions: number;
  conversions_prev: number;
  cost: number;
  cost_prev: number;
  clicks: number;
  clicks_prev: number;
  impressions: number;
  impressions_prev: number;
  event?: string;
}

export interface ActionLog {
  account_id: string;
  provider_name: string;
  date: string;
  action: string;
  category: 'ads' | 'seo' | 'content' | 'tech' | 'meta';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  status: 'active' | 'pending';
}
