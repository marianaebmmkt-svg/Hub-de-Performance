
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onToggleChat: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onToggleChat }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, label: 'Visão Consolidada', icon: '🌐' },
    { id: ViewType.GOOGLE_ADS, label: 'Google Ads 2026', icon: '🎯' },
    { id: ViewType.META_ADS, label: 'Meta Ads 2026', icon: '📱' },
    { id: ViewType.INSIGHTS, label: 'Agente Estratégico', icon: '✨' },
    { id: ViewType.CONNECTIONS, label: 'Ingestão de Dados', icon: '📥' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-inter">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight italic">Hub de <span className="text-indigo-400 not-italic">Performance</span></h1>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">BI Executive Engine • 2026</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
             <p className="text-[8px] text-slate-500 font-black uppercase">Status do Sistema</p>
             <p className="text-[10px] text-emerald-400 font-bold">JAN/2026 • Live</p>
          </div>
          <button onClick={onToggleChat} className="w-full bg-slate-800 border border-slate-700 text-slate-300 py-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
            <span>🤖</span>
            <span>Análise IA</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm relative z-10">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Integrado: Jan 15, 2026</span>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <p className="text-xs font-black text-slate-900 uppercase">Performance Manager</p>
                <p className="text-[9px] text-indigo-600 font-bold uppercase">Acesso Estratégico</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black">G</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-slate-50/30 p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
