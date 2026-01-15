
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InsightsSection from './components/InsightsSection';
import Tools from './components/Tools';
import AIChatSidebar from './components/AIChatSidebar';
import AdminManagement from './components/AdminManagement';
import ConnectionsManager from './components/ConnectionsManager';
import { ViewType, Account, ConnectionStatus, DateRange } from './types';
import { MOCK_ACCOUNTS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [selectedAccount, setSelectedAccount] = useState<Account>(MOCK_ACCOUNTS[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Detecção de chaves de ambiente
  const env = (import.meta as any).env;
  const hasAdsKey = !!(env?.VITE_GOOGLE_ADS_ACCESS_TOKEN || process.env?.VITE_GOOGLE_ADS_ACCESS_TOKEN);
  const hasGA4Key = !!(env?.VITE_GA4_ACCESS_TOKEN || process.env?.VITE_GA4_ACCESS_TOKEN);

  const [connections, setConnections] = useLocalStorage<ConnectionStatus[]>('mari_hub_connections', [
    { provider: 'google_ads', isConnected: hasAdsKey },
    { provider: 'meta_ads', isConnected: false },
    { provider: 'ga4', isConnected: hasGA4Key },
    { provider: 'gsc', isConnected: false },
  ]);

  const [persistentRange, setPersistentRange] = useLocalStorage<DateRange>('mari_hub_daterange', {
    label: 'Últimos 7 dias',
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
    compare: false
  });

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [connections, persistentRange, activeView]);

  const handleConnect = (providerId: string, accessToken: string, accountId?: string) => {
    setConnections(prev => prev.map(c => 
      c.provider === providerId 
        ? { 
            ...c, 
            isConnected: true, 
            accessToken, 
            accountId,
            lastSync: new Date().toLocaleString('pt-BR') 
          } 
        : c
    ));
    setActiveView(ViewType.DASHBOARD);
  };

  const handleDisconnect = (providerId: string) => {
    if (window.confirm(`Deseja desconectar a conta do ${providerId}?`)) {
      setConnections(prev => prev.map(c => 
        c.provider === providerId ? { ...c, isConnected: false, accessToken: undefined, accountId: undefined, lastSync: undefined } : c
      ));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja limpar todos os dados de conexão?")) {
      localStorage.removeItem('mari_hub_connections');
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewType.DASHBOARD:
        return (
          <Dashboard 
            persistentRange={persistentRange} 
            onRangeChange={setPersistentRange} 
            onViewChange={setActiveView}
          />
        );
      case ViewType.INSIGHTS:
        return <InsightsSection />;
      case ViewType.LEAD_TOOLS:
        return <Tools />;
      case ViewType.ADMIN:
        return <AdminManagement />;
      case ViewType.CONNECTIONS:
        return (
          <ConnectionsManager 
            connections={connections}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        );
      default:
        return <Dashboard persistentRange={persistentRange} onRangeChange={setPersistentRange} onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-inter">
      <div className={`fixed top-4 right-4 z-[60] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-xl border ${
        isSyncing 
          ? 'bg-indigo-600 border-indigo-400 text-white scale-110' 
          : 'bg-emerald-500 border-emerald-400 text-white opacity-0 scale-90 translate-y-[-20px]'
      }`}>
        {isSyncing ? '⌛ Sincronizando...' : '✅ Conectado'}
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Layout 
          activeView={activeView} 
          onViewChange={setActiveView}
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
        >
          {renderContent()}
        </Layout>
      </div>
      
      {isChatOpen && (
        <div className="w-[320px] shrink-0 h-full z-20">
          <AIChatSidebar 
            onClose={() => setIsChatOpen(false)} 
            currentRange={persistentRange}
          />
        </div>
      )}

      <button 
        onClick={handleLogout}
        className="fixed bottom-4 left-4 z-50 p-2 bg-slate-800 text-slate-400 rounded-full hover:text-rose-500 hover:bg-slate-700 transition-all opacity-20 hover:opacity-100"
        title="Limpar Conexões"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default App;
