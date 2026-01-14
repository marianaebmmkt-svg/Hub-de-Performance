
import React, { useState } from 'react';

const Tools: React.FC = () => {
  const [utm, setUtm] = useState({ url: '', source: '', medium: '', campaign: '' });
  const [generatedUtm, setGeneratedUtm] = useState('');

  const generateUtm = () => {
    if (!utm.url) return;
    const separator = utm.url.includes('?') ? '&' : '?';
    const params = new URLSearchParams({
      utm_source: utm.source || 'google',
      utm_medium: utm.medium || 'cpc',
      utm_campaign: utm.campaign || 'leads_consignado'
    });
    setGeneratedUtm(`${utm.url}${separator}${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* UTM Builder */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Construtor de UTM Seguro</h3>
          <p className="text-sm text-slate-500">Mantenha a padronização dos seus dados no GA4.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL da Landing Page</label>
            <input 
              type="text" 
              placeholder="https://emprestabemmelhor.com.br/fgts" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={utm.url}
              onChange={(e) => setUtm({...utm, url: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Source</label>
              <input type="text" placeholder="google" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={utm.source} onChange={(e) => setUtm({...utm, source: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medium</label>
              <input type="text" placeholder="cpc" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={utm.medium} onChange={(e) => setUtm({...utm, medium: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campaign</label>
              <input type="text" placeholder="search_fgts" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={utm.campaign} onChange={(e) => setUtm({...utm, campaign: e.target.value})} />
            </div>
          </div>
          <button 
            onClick={generateUtm}
            className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Gerar Link Rastreado
          </button>

          {generatedUtm && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">URL Gerada:</p>
              <p className="text-xs break-all text-indigo-600 font-mono">{generatedUtm}</p>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedUtm)}
                className="mt-2 text-[10px] text-indigo-600 font-bold hover:underline"
              >
                Copiar para área de transferência
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Naming Tool */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Padronizador de Nomenclatura</h3>
          <p className="text-sm text-slate-500">Gere nomes de campanhas claros para relatórios perfeitos.</p>
        </div>
        
        <div className="space-y-4">
           <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700 italic">
                "Uma nomenclatura correta economiza 20 horas de limpeza de dados por mês."
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <select className="p-2 border border-slate-200 rounded-lg text-sm">
                <option>REDE DE PESQUISA</option>
                <option>PMAX</option>
                <option>DISPLAY</option>
                <option>YOUTUBE</option>
              </select>
              <select className="p-2 border border-slate-200 rounded-lg text-sm">
                <option>CONVERSÃO</option>
                <option>TRÁFEGO</option>
                <option>BRANDING</option>
              </select>
           </div>
           
           <input type="text" placeholder="Nome do Produto (ex: Consignado)" className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
           
           <div className="p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-sm">
              SEARCH_CONV_CONSIGNADO_BR_2023-11
           </div>
        </div>
      </div>

      {/* Ad Copy Checklist */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Checklist de Otimização Semanal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Google Ads', tasks: ['Negativação de termos', 'Ajuste de lances (CPA)', 'Teste A/B de Headlines'] },
             { title: 'SEO', tasks: ['Check de Search Console (Erros)', 'Review de posições do blog', 'Link Building interno'] },
             { title: 'Landing Page', tasks: ['Teste de velocidade (PSI)', 'Check de formulário leads', 'Análise de mapa de calor'] }
           ].map((col, i) => (
             <div key={i} className="space-y-3">
               <h4 className="font-bold text-sm text-indigo-600 uppercase tracking-wider">{col.title}</h4>
               <ul className="space-y-2">
                 {col.tasks.map((task, j) => (
                   <li key={j} className="flex items-center text-sm text-slate-600">
                     <input type="checkbox" className="mr-3 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                     {task}
                   </li>
                 ))}
               </ul>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
