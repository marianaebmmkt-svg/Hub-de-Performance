
import React, { useState } from 'react';
import { ConnectionStatus, PerformanceData, ReportType, DataState } from '../types';
import { processCSVWithMapping, FIELD_MAP_HINTS, mergeDataSources } from '../services/dataProcessor';

interface ConnectionsManagerProps {
  connections: ConnectionStatus[];
  onConnect: (provider: string, token: string, accountId?: string, webhookUrl?: string) => void;
  onDisconnect: (provider: string) => void;
}

const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({ connections, onConnect, onDisconnect }) => {
  const [dataState, setDataState] = useState<DataState>('current');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [csvFile, setCsvFile] = useState<{ content: string; name: string; type: ReportType } | null>(null);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [showConfigModal, setShowConfigModal] = useState(false);

  const requiredCSVs = [
    { type: ReportType.CAMPAIGN, label: 'Google Ads: Performance 2026', file: 'GADS_EXPORT.csv', desc: 'Dados de Busca, PMax e Display' },
    { type: ReportType.META_CAMPAIGN, label: 'Meta Ads: Resultados', file: 'META_EXPORT.csv', desc: 'Instagram e Facebook Ads' },
    { type: ReportType.PAGES, label: 'GA4: Engajamento Web', file: 'GA4_WEB.csv', desc: 'Retenção e Eventos de Página' },
    { type: ReportType.SEARCH_PERFORMANCE, label: 'Search Console: Orgânico', file: 'GSC_DATA.csv', desc: 'Clicks, Impressões e Posição' }
  ];

  const handleFileSelect = (file: File, type: ReportType) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const headers = content.split('\n')[0].toLowerCase().split(',').map(h => h.trim());
      const autoMap: any = {};
      Object.keys(FIELD_MAP_HINTS).forEach(metric => {
        const idx = headers.findIndex(h => FIELD_MAP_HINTS[metric].some(hint => h.includes(hint)));
        if (idx !== -1) autoMap[metric] = idx;
      });
      setCsvFile({ content, name: file.name, type });
      setMapping(autoMap);
    };
    reader.readAsText(file);
  };

  const finalizeCsv = () => {
    if (!csvFile) return;
    const provider = csvFile.type === ReportType.META_CAMPAIGN ? 'Meta_Ads' : 'Google_BI';
    const processed = processCSVWithMapping(csvFile.content, provider, mapping, dataState === 'closed' ? `${selectedMonth}-01` : undefined, csvFile.type, dataState);
    const existing = JSON.parse(localStorage.getItem('consolidated_performance_db') || '[]');
    localStorage.setItem('consolidated_performance_db', JSON.stringify(mergeDataSources(existing, processed)));
    window.dispatchEvent(new Event('storage_updated'));
    setCsvFile(null);
    alert('Dados consolidados com sucesso!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 p-16 rounded-[60px] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight uppercase italic">Ingestão <br/> <span className="text-indigo-400 not-italic">de Dados</span></h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
            Carregue suas bases de marketing para análise. O motor de BI cuidará da unificação histórica 
            e remoção de duplicidades em bases do Google e Meta.
          </p>
          <div className="flex items-center space-x-4">
             <button onClick={() => setShowConfigModal(true)} className="px-8 py-4 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                Configurar Período: {selectedMonth}
             </button>
          </div>
        </div>
        <span className="absolute top-0 right-0 p-10 text-[200px] opacity-10 pointer-events-none select-none">📁</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-4 italic">Fontes Autorizadas</h3>
          {requiredCSVs.map(csv => (
            <div key={csv.type} className="bg-white p-8 rounded-[32px] border border-slate-200 flex items-center justify-between group hover:border-indigo-400 hover:shadow-xl transition-all duration-300">
              <div className="flex-1">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{csv.label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{csv.desc}</p>
              </div>
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = (e: any) => handleFileSelect(e.target.files[0], csv.type);
                  input.click();
                }}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                Importar
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[50px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl shadow-inner">📊</div>
           <div className="max-w-xs">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-2">Monitor de Sincronização Histórica</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Sua base de dados cresce a cada importação. O Hub cruza IDs de campanhas passadas com os nomes atuais.</p>
           </div>
        </div>
      </div>

      {csvFile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
           <div className="bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mapeamento de Colunas AI</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Identificando métricas em {csvFile.name}</p>
                 </div>
                 <button onClick={() => setCsvFile(null)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all">✕</button>
              </div>
              <div className="p-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-h-[50vh] overflow-y-auto">
                {Object.keys(FIELD_MAP_HINTS).map(metric => (
                  <div key={metric} className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{metric}</label>
                    <select 
                      value={mapping[metric] ?? ''}
                      onChange={e => setMapping({...mapping, [metric]: parseInt(e.target.value)})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    >
                      <option value="">Ignorar Campo</option>
                      {csvFile.content.split('\n')[0].split(',').map((h, i) => <option key={i} value={i}>{h.replace(/"/g, '')}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="p-12 border-t border-slate-100 flex flex-col items-center">
                 <button onClick={finalizeCsv} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[32px] uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300">Consolidar Base {selectedMonth}</button>
              </div>
           </div>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Configurar Período de Importação</h4>
                <button onClick={() => setShowConfigModal(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all">✕</button>
              </div>
              <div className="p-10 space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Referência (Mês/Ano)</label>
                   <input 
                    type="month" 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)} 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Estado da Base</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setDataState('current')} 
                        className={`p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${dataState === 'current' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400'}`}
                      >Acompanhamento</button>
                      <button 
                        onClick={() => setDataState('closed')} 
                        className={`p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${dataState === 'closed' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400'}`}
                      >Fechamento</button>
                   </div>
                 </div>
                 <button onClick={() => setShowConfigModal(false)} className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-xl mt-4">Confirmar Configuração</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsManager;
