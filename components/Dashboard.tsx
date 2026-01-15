
import React, { useState, useMemo, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart, Legend
} from 'recharts';
import { PerformanceData, DateRange, ViewType } from '../types';
import { fetchPerformanceData } from '../services/api';
import { COLORS } from '../constants';
import DateFilter from './DateFilter';

interface DashboardProps {
  persistentRange: DateRange;
  onRangeChange: (r: DateRange) => void;
  viewType?: ViewType;
}

const Dashboard: React.FC<DashboardProps> = ({ persistentRange, onRangeChange, viewType = ViewType.DASHBOARD }) => {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [compareData, setCompareData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [hoveredData, setHoveredData] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    
    // Carrega dados principais
    const result = await fetchPerformanceData('all', persistentRange);
    let raw = result.data;
    if (viewType === ViewType.GOOGLE_ADS) raw = raw.filter(d => d.provider_name.toLowerCase().includes('google'));
    if (viewType === ViewType.META_ADS) raw = raw.filter(d => d.provider_name.toLowerCase().includes('meta'));
    setData(raw);

    // Carrega dados de comparação se habilitado
    if (persistentRange.compare && persistentRange.compareStart && persistentRange.compareEnd) {
      const compareResult = await fetchPerformanceData('all', {
        ...persistentRange,
        start: persistentRange.compareStart,
        end: persistentRange.compareEnd,
        compare: false
      });
      let cRaw = compareResult.data;
      if (viewType === ViewType.GOOGLE_ADS) cRaw = cRaw.filter(d => d.provider_name.toLowerCase().includes('google'));
      if (viewType === ViewType.META_ADS) cRaw = cRaw.filter(d => d.provider_name.toLowerCase().includes('meta'));
      setCompareData(cRaw);
    } else {
      setCompareData([]);
    }
    
    setLoading(false);
  };

  useEffect(() => { load(); }, [persistentRange, viewType]);

  const campaignOptions = useMemo(() => {
    const unique = new Map<string, string>();
    data.forEach(d => { if (d.campaign_id && d.dimension_name) unique.set(d.campaign_id, d.dimension_name); });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  // Prepara dados para o gráfico em modo comparação (X-axis relativo por offset de dias)
  const chartDataCombined = useMemo(() => {
    const isComparing = persistentRange.compare && compareData.length > 0;
    
    const filteredMain = selectedCampaignIds.length === 0 
      ? data 
      : data.filter(d => d.campaign_id && selectedCampaignIds.includes(d.campaign_id));
      
    const filteredCompare = selectedCampaignIds.length === 0 
      ? compareData 
      : compareData.filter(d => d.campaign_id && selectedCampaignIds.includes(d.campaign_id));

    // Agrupa por data para somar métricas
    const groupByDate = (arr: PerformanceData[]) => {
      const map = new Map();
      arr.forEach(d => {
        const dateKey = d.date;
        if (!map.has(dateKey)) map.set(dateKey, { clicks: 0, cost: 0, conversions: 0, impressions: 0, date: d.date });
        const entry = map.get(dateKey);
        entry.clicks += d.clicks;
        entry.cost += d.cost;
        entry.conversions += d.conversions;
        entry.impressions += d.impressions;
      });
      return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const mainGrouped = groupByDate(filteredMain);
    const compareGrouped = groupByDate(filteredCompare);

    if (!isComparing) {
      return mainGrouped.map(d => ({ ...d, label: d.date }));
    }

    // Se estiver comparando, criamos uma lista baseada em índices para sobrepor os dias
    const maxLength = Math.max(mainGrouped.length, compareGrouped.length);
    const combined = [];
    for (let i = 0; i < maxLength; i++) {
      const mainDay = mainGrouped[i];
      const compDay = compareGrouped[i];
      combined.push({
        index: i + 1,
        label: mainDay ? mainDay.date : `Dia ${i + 1}`,
        clicks: mainDay?.clicks || 0,
        cost: mainDay?.cost || 0,
        conversions: mainDay?.conversions || 0,
        impressions: mainDay?.impressions || 0,
        compareClicks: compDay?.clicks || 0,
        compareCost: compDay?.cost || 0,
        compareConversions: compDay?.conversions || 0,
        compareImpressions: compDay?.impressions || 0,
        compareLabel: compDay?.date || ''
      });
    }
    return combined;
  }, [data, compareData, selectedCampaignIds, persistentRange]);

  const filteredDataSimple = useMemo(() => {
    if (selectedCampaignIds.length === 0) return data;
    return data.filter(d => d.campaign_id && selectedCampaignIds.includes(d.campaign_id));
  }, [data, selectedCampaignIds]);

  const dateFormatter = (val: string) => {
    if (typeof val === 'number') return `Dia ${val}`;
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-3xl shadow-2xl border border-slate-700">
          <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest">{dateFormatter(label)}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex justify-between items-center space-x-6 mb-1">
              <span className={`text-[10px] font-bold uppercase ${p.name.includes('Anterior') ? 'text-slate-500 italic' : 'text-slate-400'}`}>
                {p.name}
              </span>
              <span className={`text-xs font-black ${p.name.includes('Anterior') ? 'text-slate-300' : 'text-white'}`}>
                {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-indigo-600 font-black tracking-widest uppercase">⚙️ Sincronizando Dados 2026...</div>;

  const isComparing = persistentRange.compare;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <DateFilter 
        initialRange={persistentRange} 
        onFilterChange={onRangeChange} 
        isOpen={isDateModalOpen} 
        onClose={() => setIsDateModalOpen(false)} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center space-x-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
            >
              <span>🎯 Campanhas ({selectedCampaignIds.length || 'Todas'})</span>
              <span>{isDropdownOpen ? '▴' : '▾'}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 p-4 animate-in zoom-in-95">
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {campaignOptions.map(opt => (
                    <label key={opt.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCampaignIds.includes(opt.id)}
                        onChange={() => {
                          setSelectedCampaignIds(prev => prev.includes(opt.id) ? prev.filter(i => i !== opt.id) : [...prev, opt.id]);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-[11px] font-bold text-slate-700 truncate">{opt.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsDateModalOpen(true)}
            className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase transition-all flex items-center space-x-2 ${isComparing ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
             <span>📅</span>
             <span>{isComparing ? 'Análise Comparativa Ativa' : 'Filtro de Calendário'}</span>
          </button>
        </div>
        <div className="text-right">
           <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
             {viewType === ViewType.DASHBOARD ? 'Hub Integrado' : viewType === ViewType.GOOGLE_ADS ? 'Google Performance' : 'Meta Performance'}
           </h2>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">BI EXECUTIVE • {isComparing ? 'MODO COMPARAÇÃO' : 'VISÃO REAL-TIME'}</p>
        </div>
      </div>

      {/* BOXES DE INSIGHTS E OPORTUNIDADES AI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Oportunidade de Lance', desc: 'Sugerido +15% no Consignado INSS para aumentar share de 45% para 55%.', status: 'Urgent', icon: '📈' },
          { title: 'Alerta de Criativo', desc: 'Campanha Meta FB-02 está com CTR 20% abaixo do benchmark. Trocar criativo.', status: 'Alert', icon: '🎨' },
          { title: 'Check de Conversão', desc: 'Volume de leads orgânicos estável, mas CPL pago subiu 8% no mobile.', status: 'Normal', icon: '✅' },
          { title: 'Teto de Budget', desc: 'PMax Google está consumindo 98% da verba diária antes das 16h.', status: 'Review', icon: '💰' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.status === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{item.status}</span>
            </div>
            <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-tight mb-2">{item.title}</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* GRÁFICO 1: ACESSOS */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="mb-8 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Volume de Acessos</h3>
            {isComparing && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black uppercase">Tracejado = Período Anterior</span>}
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartDataCombined}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tickFormatter={dateFormatter} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{fontSize: 10, fontWeight: 'black', textTransform: 'uppercase', marginTop: 20}} />
                
                <Bar dataKey="clicks" name="Acessos Atuais" fill={COLORS.paid} radius={[6, 6, 0, 0]} barSize={isComparing ? 20 : 40} />
                {isComparing && <Bar dataKey="compareClicks" name="Acessos Anterior" fill={COLORS.paid} opacity={0.2} radius={[6, 6, 0, 0]} barSize={20} />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: PERFORMANCE DE CONVERSÃO */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="mb-8 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Tendência de Leads</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataCombined}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tickFormatter={dateFormatter} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{fontSize: 10, fontWeight: 'black', textTransform: 'uppercase', marginTop: 20}} />
                
                <Area type="monotone" dataKey="conversions" name="Leads Atuais" stroke={COLORS.organic} fill={COLORS.organic} fillOpacity={0.1} strokeWidth={4} />
                {isComparing && <Area type="monotone" dataKey="compareConversions" name="Leads Anterior" stroke={COLORS.organic} strokeDasharray="5 5" fill="transparent" strokeWidth={2} opacity={0.4} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 3: CURVA FINANCEIRA */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-rose-500 pl-3">Fluxo de Investimento (Spent)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataCombined}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tickFormatter={dateFormatter} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{fontSize: 10, fontWeight: 'black', textTransform: 'uppercase', marginTop: 20}} />
                
                <Line type="stepAfter" dataKey="cost" name="Gasto Atual" stroke={COLORS.danger} strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                {isComparing && <Line type="stepAfter" dataKey="compareCost" name="Gasto Anterior" stroke={COLORS.danger} strokeDasharray="8 4" strokeWidth={2} dot={false} opacity={0.3} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 4: IMPACTO (IMPRESSÕES) */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-amber-500 pl-3">Impacto Digital (Impressões)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataCombined}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tickFormatter={dateFormatter} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="impressions" name="Impressões Atuais" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                {isComparing && <Bar dataKey="compareImpressions" name="Impressões Anterior" fill={COLORS.accent} opacity={0.2} radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
