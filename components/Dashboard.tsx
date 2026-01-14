
import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell 
} from 'recharts';
import { ACTIONS_LOG, COLORS } from '../constants';
import { MetricCard, PerformanceData, DateRange } from '../types';
import { fetchPerformanceData } from '../services/api';
import DateFilter from './DateFilter';

const Metric: React.FC<MetricCard & { showCompare?: boolean }> = ({ label, value, change, suffix = '', showCompare, previousValue }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline space-x-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}{suffix}</h3>
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </span>
    </div>
    {showCompare && previousValue && (
      <p className="text-[10px] text-slate-400 mt-2">
        Anterior: <span className="font-semibold">{previousValue}{suffix}</span>
      </p>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-lg">
        <p className="text-sm font-bold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex justify-between space-x-4 text-xs mb-1">
            <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
            <span className="font-bold text-slate-900">{p.value.toLocaleString()}</span>
          </div>
        ))}
        {data.event && (
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold text-amber-600 uppercase">Marco:</p>
            <p className="text-xs italic text-slate-600">{data.event}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PerformanceData[]>([]);
  const [range, setRange] = useState<DateRange>({
    label: 'Últimos 30 dias',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    compare: false
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchPerformanceData('all', range);
      setData(result);
      setLoading(false);
    };
    loadData();
  }, [range]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <DateFilter onFilterChange={setRange} />
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm flex items-center">
            <span className="mr-2">📥</span> Baixar Relatório
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 h-24 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Metric label="Leads Totais" value="1.240" change={12.5} showCompare={range.compare} previousValue="1.102" />
          <Metric label="Investimento" value="R$ 45k" change={5.2} showCompare={range.compare} previousValue="R$ 42k" />
          <Metric label="CPA Médio" value="R$ 36,5" change={-8.4} showCompare={range.compare} previousValue="R$ 39,8" />
          <Metric label="Taxa de Conv." value="12.8" change={2.1} suffix="%" showCompare={range.compare} previousValue="12.5" />
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
             <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest">Sincronizando Dados...</p>
             </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Desempenho no Período</h3>
            <p className="text-xs text-slate-500">Visualização de tendência e eventos de otimização</p>
          </div>
          <div className="flex space-x-6">
            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm mr-2"></span> Atual
            </div>
            {range.compare && (
              <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase">
                <span className="w-2.5 h-2.5 bg-slate-300 rounded-sm mr-2"></span> Anterior
              </div>
            )}
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              {range.compare && (
                <Area 
                  type="monotone" 
                  dataKey="conversions_prev" 
                  name="Período Anterior"
                  stroke="#cbd5e1" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent" 
                />
              )}
              <Area 
                type="monotone" 
                dataKey="conversions" 
                name="Conversões"
                stroke={COLORS.primary} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCurrent)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Ações Estratégicas</h3>
          <div className="space-y-4">
            {ACTIONS_LOG.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0 group">
                <div className="bg-slate-100 p-2 rounded-lg text-lg group-hover:bg-indigo-50 transition-colors">
                  {item.category === 'ads' ? '🎯' : item.category === 'seo' ? '🔍' : '📱'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.action}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{item.date} • {item.provider_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Conversão por Canal</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { name: 'Google', count: 850 },
                 { name: 'Meta', count: 320 },
                 { name: 'Direct', count: 120 },
                 { name: 'SEO', count: 45 },
               ]}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                 <Tooltip />
                 <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                   { [0,1,2,3].map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.primary : COLORS.secondary} fillOpacity={0.8} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
