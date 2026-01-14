
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InsightsSection from './components/InsightsSection';
import Tools from './components/Tools';
import AIChatSidebar from './components/AIChatSidebar';
import AdminManagement from './components/AdminManagement';
import { ViewType, Account } from './types';
import { MOCK_ACCOUNTS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [selectedAccount, setSelectedAccount] = useState<Account>(MOCK_ACCOUNTS[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard />;
      case ViewType.INSIGHTS:
        return <InsightsSection />;
      case ViewType.LEAD_TOOLS:
        return <Tools />;
      case ViewType.ADMIN:
        return <AdminManagement />;
      case ViewType.GOOGLE_ADS:
        return (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Google Ads Manager</h3>
            <p className="text-slate-500">Dados filtrados para a conta: <span className="font-bold text-indigo-600">{selectedAccount.name}</span></p>
            <div className="mt-8 flex justify-center space-x-4">
               <div className="p-6 border border-slate-100 rounded-lg shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">CTR Atual</p>
                 <p className="text-xl font-bold">4.2%</p>
               </div>
               <div className="p-6 border border-slate-100 rounded-lg shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">CPC Médio</p>
                 <p className="text-xl font-bold">R$ 1.25</p>
               </div>
               <div className="p-6 border border-slate-100 rounded-lg shadow-sm">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Conversão</p>
                 <p className="text-xl font-bold">12.8%</p>
               </div>
            </div>
          </div>
        );
      case ViewType.META_ADS:
        return (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Meta Ads (Facebook/Instagram)</h3>
            <p className="text-slate-500 italic">Monitorando engajamento e conversão de leads sociais para {selectedAccount.name}.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg mx-auto">
               <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                 <p className="text-xs font-bold text-rose-600 uppercase">Alcance Total</p>
                 <p className="text-xl font-bold">45.2k</p>
               </div>
               <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                 <p className="text-xs font-bold text-indigo-600 uppercase">Lead Ads</p>
                 <p className="text-xl font-bold">285</p>
               </div>
            </div>
          </div>
        );
      case ViewType.SEARCH_CONSOLE:
        return (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
             <div className="mb-6 inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600 text-3xl">🔍</div>
             <h3 className="text-xl font-bold text-slate-800">SEO & Visibilidade</h3>
             <p className="text-slate-500 mt-2 max-w-md mx-auto">Estratégias de rankeamento para <strong>{selectedAccount.name}</strong>.</p>
             <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-indigo-600 transition-all">Sincronizar Dados</button>
          </div>
        );
      case ViewType.ANALYTICS:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="text-lg font-bold mb-4">Fluxo de Usuários (GA4)</h3>
               <div className="h-64 flex items-end justify-between space-x-2">
                 {[85, 55, 100, 40, 75].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-indigo-500 rounded-t-lg relative group" style={{ height: `${h}%` }}>
                        <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                      </div>
                      <span className="text-[10px] mt-2 font-bold text-slate-400 uppercase">
                        {['Direct', 'Organic', 'Paid', 'Social', 'Email'][i]}
                      </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-inter">
      {/* Container Principal com Layout BI */}
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
      
      {/* Barra Lateral de Chat IA (Reservando 320px à direita conforme solicitado) */}
      {isChatOpen && (
        <div className="w-[320px] shrink-0 h-full z-20">
          <AIChatSidebar 
            onClose={() => setIsChatOpen(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default App;
