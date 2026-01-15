
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InsightsSection from './components/InsightsSection';
import AIChatSidebar from './components/AIChatSidebar';
import ConnectionsManager from './components/ConnectionsManager';
import { ViewType, ConnectionStatus, DateRange, PerformanceData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const env = (import.meta as any).env;
  const hasAdsKey = !!(env?.VITE_GOOGLE_ADS_ACCESS_TOKEN || process.env?.VITE_GOOGLE_ADS_ACCESS_TOKEN);
  const hasGA4Key = !!(env?.VITE_GA4_ACCESS_TOKEN || process.env?.VITE_GA4_ACCESS_TOKEN);

  const [connections, setConnections] = useLocalStorage<ConnectionStatus[]>('mari_hub_connections', [
    { provider: 'google_ads', isConnected: hasAdsKey, type: 'oauth' },
    { provider: 'meta_ads', isConnected: false, type: 'oauth' },
    { provider: 'ga4', isConnected: hasGA4Key, type: 'oauth' },
    { provider: 'gsc', isConnected: false, type: 'oauth' },
  ]);

  // Busca a última data disponível nos dados para definir o range inicial
  const lastDataDate = useMemo(() => {
    const stored = localStorage.getItem('consolidated_performance_db');
    if (stored) {
      const data: PerformanceData[] = JSON.parse(stored);
      if (data.length > 0) {
        const dates = data.map(d => new Date(d.date).getTime());
        return new Date(Math.max(...dates));
      }
    }
    return new Date(2026, 0, 15); // Fallback padrão caso não haja dados
  }, []);

  const defaultStart = new Date(lastDataDate.getFullYear(), lastDataDate.getMonth(), 1);
  const defaultEnd = lastDataDate;

  const [persistentRange, setPersistentRange] = useLocalStorage<DateRange>('mari_hub_daterange', {
    label: 'Intervalo Personalizado',
    start: defaultStart,
    end: defaultEnd,
    compare: false
  });

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 600);
    return () => clearTimeout(timer);
  }, [activeView, persistentRange]);

  const handleConnect = (providerId: string, accessToken: string, accountId?: string, webhookUrl?: string) => {
    setConnections(prev => prev.map(c => 
      c.provider === providerId ? { ...c, isConnected: true, accessToken, accountId, webhookUrl, lastSync: new Date().toLocaleString() } : c
    ));
  };

  const handleDisconnect = (providerId: string) => {
    setConnections(prev => prev.map(c => 
      c.provider === providerId ? { ...c, isConnected: false, accessToken: undefined } : c
    ));
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard persistentRange={persistentRange} onRangeChange={setPersistentRange} viewType={ViewType.DASHBOARD} />;
      case ViewType.GOOGLE_ADS:
        return <Dashboard persistentRange={persistentRange} onRangeChange={setPersistentRange} viewType={ViewType.GOOGLE_ADS} />;
      case ViewType.META_ADS:
        return <Dashboard persistentRange={persistentRange} onRangeChange={setPersistentRange} viewType={ViewType.META_ADS} />;
      case ViewType.INSIGHTS:
        return <InsightsSection />;
      case ViewType.CONNECTIONS:
        return <ConnectionsManager connections={connections} onConnect={handleConnect} onDisconnect={handleDisconnect} />;
      default:
        return <Dashboard persistentRange={persistentRange} onRangeChange={setPersistentRange} viewType={ViewType.DASHBOARD} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-inter">
      <div className={`fixed top-4 right-4 z-[60] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl border ${
        isSyncing ? 'bg-indigo-600 border-indigo-400 text-white scale-110' : 'bg-emerald-500 border-emerald-400 text-white opacity-0 scale-90 translate-y-[-20px]'
      }`}>
        {isSyncing ? '⌛ Sincronizando BI...' : '✅ Online 2026'}
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Layout 
          activeView={activeView} 
          onViewChange={setActiveView}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
        >
          {renderContent()}
        </Layout>
      </div>
      
      {isChatOpen && (
        <div className="w-[350px] shrink-0 h-full z-20 animate-in slide-in-from-right duration-300">
          <AIChatSidebar onClose={() => setIsChatOpen(false)} currentRange={persistentRange} />
        </div>
      )}
    </div>
  );
};

export default App;
