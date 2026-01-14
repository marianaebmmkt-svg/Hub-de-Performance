
import React, { useState, useEffect } from 'react';
import { getMarketInsights } from '../services/gemini';

const InsightsSection: React.FC = () => {
  const [insights, setInsights] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getMarketInsights();
      setInsights(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <span className="mr-2">✨</span> Insights Estratégicos (AI Intelligence)
          </h2>
          <p className="opacity-80">Análise de mercado em tempo real usando Gemini 3 & Google Search para a Empresta Bem melhor.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 animate-pulse">Consultando o mercado e cruzando dados de busca...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm leading-relaxed prose prose-slate prose-indigo max-w-none">
            {insights?.text.split('\n').map((line, i) => (
              <p key={i} className="mb-2 text-slate-700">{line}</p>
            ))}
          </div>

          {insights?.sources && insights.sources.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center uppercase tracking-wider">
                <span className="mr-2">🔗</span> Fontes Consultadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.sources.map((chunk: any, i: number) => (
                  <a 
                    key={i} 
                    href={chunk.web?.uri || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="truncate flex-1">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {chunk.web?.title || 'Referência de Mercado'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{chunk.web?.uri}</p>
                    </div>
                    <span className="text-slate-300 group-hover:text-indigo-400">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
             <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-indigo-500 text-lg font-bold">💡</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-indigo-700">
                    <strong>Dica de Gestão:</strong> Com base na análise acima, considere aumentar o lance em palavras-chave "fundo de funil" nas próximas 48h para capitalizar sobre a tendência detectada.
                  </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
