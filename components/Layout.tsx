
import React from 'react';
import { ViewType, Account } from '../types';
import { MOCK_ACCOUNTS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedAccount: Account;
  onAccountChange: (acc: Account) => void;
  onToggleChat: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onViewChange, 
  selectedAccount, 
  onAccountChange,
  onToggleChat
}) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard Geral', icon: '📊' },
    { id: ViewType.GOOGLE_ADS, label: 'Google Ads', icon: '🎯' },
    { id: ViewType.META_ADS, label: 'Meta Ads', icon: '📱' },
    { id: ViewType.SEARCH_CONSOLE, label: 'SEO & Search', icon: '🔍' },
    { id: ViewType.ANALYTICS, label: 'Analytics', icon: '📈' },
    { id: ViewType.LEAD_TOOLS, label: 'Ferramentas', icon: '⚡' },
    { id: ViewType.INSIGHTS, label: 'Insights AI', icon: '✨' },
    { id: ViewType.ADMIN, label: 'Gestão de Acessos', icon: '👤' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-indigo-400 leading-tight">
            Hub de Performance <span className="text-white">da Mari</span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">BI & IA Intelligence</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onToggleChat}
             className="w-full flex items-center justify-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 py-2 rounded-lg hover:bg-indigo-500/20 transition-all text-xs font-bold"
           >
              <span>✨ Chat IA Analista</span>
           </button>
        </div>

        <div className="p-4 border-t border-slate-800 text-slate-500 text-[10px] flex justify-between items-center">
          <span>v3.0.0 PRO</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase">Propriedade Ativa</span>
               <select 
                 className="text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                 value={selectedAccount.id}
                 onChange={(e) => onAccountChange(MOCK_ACCOUNTS.find(a => a.id === e.target.value)!)}
               >
                 {MOCK_ACCOUNTS.map(acc => (
                   <option key={acc.id} value={acc.id}>{acc.name} ({acc.provider})</option>
                 ))}
               </select>
            </div>
          </div>

          <div className="flex items-center space-x-6">
             <div className="flex space-x-2">
                <button title="Exportar CSV" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">📄</button>
                <button title="Exportar PDF" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">📊</button>
             </div>
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex items-center space-x-3">
               <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">Admin Master</p>
                  <p className="text-[10px] text-slate-500 uppercase">Mari Hub Core</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">M</div>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
