
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
  
  // Estados Persistentes (Tokens e Status)
  const [connections, setConnections] = useLocalStorage<ConnectionStatus[]>('mari_hub_connections', [
    { provider: 'google_ads', isConnected: false },
    { provider: 'meta_ads', isConnected: false },
    { provider: 'ga4', isConnected: false },
    { provider: 'gsc', isConnected: false },
  ]);

  const [persistentRange, setPersistentRange] = useLocalStorage<DateRange>('mari_hub_daterange', {
    label: 'Últimos 30 dias',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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
    // Se conectou, volta para o dashboard para ver os dados reais
    setActiveView(ViewType.DASHBOARD);
  };

  const handleDisconnect = (providerId: string) => {
    if (window.confirm(`Tem certeza que deseja remover o acesso do ${providerId}?`)) {
      setConnections(prev => prev.map(c => 
        c.provider === providerId ? { ...c, isConnected: false, accessToken: undefined, accountId: undefined, lastSync: undefined } : c
      ));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair e limpar os dados da sessão?")) {
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
      <div className={`fixed top-4 right-4 z-[60] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-lg ${
        isSyncing ? 'bg-indigo-600 text-white scale-110' : 'bg-emerald-500 text-white opacity-0 scale-90 translate-y-[-20px]'
      }`}>
        {isSyncing ? '☁️ Sincronizando APIs...' : '✅ Dados Atualizados'}
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
        title="Limpar Sessão"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
};

export default App;
