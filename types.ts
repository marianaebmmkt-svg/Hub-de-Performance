
export enum ViewType {
  DASHBOARD = 'dashboard', // Visão Consolidada
  GOOGLE_ADS = 'google_ads',
  META_ADS = 'meta_ads',
  CONNECTIONS = 'connections',
  INSIGHTS = 'insights'
}

export type DataSource = 'oauth' | 'webhook' | 'csv' | 'mock';
export type DataState = 'closed' | 'current';

export enum ReportType {
  CAMPAIGN = 'campaign',
  KEYWORDS = 'keywords',
  PAGES = 'pages', 
  TRAFFIC_SOURCES = 'traffic_sources',
  SEARCH_PERFORMANCE = 'search_performance',
  META_CAMPAIGN = 'meta_campaign',
  UNKNOWN = 'unknown'
}

export interface PerformanceData {
  id?: string;
  campaign_id?: string; 
  account_id: string;
  provider_name: string;
  date: string;
  state: DataState;
  report_type?: ReportType;
  dimension_name?: string; 
  conversions: number;
  cost: number;
  clicks: number;
  impressions: number;
  avg_session_duration?: number;
  bounce_rate?: number;
  position?: number;
  source: DataSource;
  timestamp: number;
  reach?: number;
  frequency?: number;
}

export interface DateRange {
  label: string;
  start: Date;
  end: Date;
  compare: boolean;
  compareStart?: Date;
  compareEnd?: Date;
}

// Added missing ActionLog interface for constants.tsx
export interface ActionLog {
  account_id: string;
  provider_name: string;
  date: string;
  action: string;
  category: string;
}

// Added missing Account interface for constants.tsx
export interface Account {
  id: string;
  name: string;
  provider: string;
}

// Added missing User interface for constants.tsx and AdminManagement.tsx
export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

// Added missing PagePerformance interface for constants.tsx
export interface PagePerformance {
  path: string;
  title: string;
  views: number;
  conversions: number;
  convRate: number;
}

// Added missing FormPerformanceData interface for constants.tsx
export interface FormPerformanceData {
  id: string;
  name: string;
  views: number;
  submissions: number;
  convRate: number;
}

// Added missing ConnectionStatus interface for App.tsx and ConnectionsManager.tsx
export interface ConnectionStatus {
  provider: string;
  isConnected: boolean;
  type: DataSource;
  accessToken?: string;
  accountId?: string;
  webhookUrl?: string;
  lastSync?: string;
}

// Added missing DataEngineState interface for services/api.ts
export interface DataEngineState {
  activeSource: DataSource[];
  isFallback: boolean;
  confidenceScore: number;
}
