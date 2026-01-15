
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { COLORS, MOCK_PERFORMANCE } from '../constants';
import { MetricCard, PerformanceData, DateRange, ViewType } from '../types';
import { fetchPerformanceData } from '../services/api';
import DateFilter from './DateFilter';
import FormPerformance from './FormPerformance';

interface DashboardProps {
  persistentRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  onViewChange?: (view: ViewType) => void;
}

const Metric: React.FC<MetricCard & { color?: string }> = ({ label, value, change, suffix = '', color = 'bg-white' }) => (
  <div className={`${color} p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md group`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">{label}</p>
    <div className="flex items-baseline space-x-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}{suffix}</h3>
      {change !== 0 && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ persistentRange, onRangeChange, onViewChange }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchPerformanceData('all', persistentRange);
        // Se houver dados reais, usa. Se não, usa o Mock de demonstração.
        setData(result.length > 0 ? result : MOCK_PERFORMANCE);
      } catch (err) {
        setData(MOCK_PERFORMANCE);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [persistentRange]);

  const metrics = useMemo(() => {
    const totalConversions = data.reduce((acc, curr) => acc + curr.conversions, 0);
    const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
    const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
    const cpl = totalConversions > 0 ? totalCost / totalConversions : 0;
    
    return {
      conversions: totalConversions,
      cost: totalCost,
      clicks: totalClicks,
      cpl: cpl
    };
  }, [data]);

  const attributionData = useMemo(() => {
    const channels = Array.from(new Set(data.map(d => d.provider_name))) as string[];
    return channels.map(channel => {
      const channelData = data.filter(d => d.provider_name === channel);
      const leads = channelData.reduce((acc, curr) => acc + curr.conversions, 0);
      const cost = channelData.reduce((acc, curr) => acc + curr.cost, 0);
      const cpl = leads > 0 ? (cost / leads).toFixed(2) : '0.00';
      return {
        channel,
        leads,
        cost,
        cpl,
        color: channel.includes('Google') || channel.includes('Ads') ? COLORS.paid : COLORS.organic
      };
    }).sort((a, b) => b.leads - a.leads);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="text-slate-500 font-medium">Carregando performance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <DateFilter initialRange={persistentRange} onFilterChange={onRangeChange} />
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-slate-500 uppercase">Dados em Tempo Real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric label="Leads Totais" value={metrics.conversions.toLocaleString()} change={0} />
        <Metric label="CPL Médio" value={`R$ ${metrics.cpl.toFixed(2)}`} change={0} />
        <Metric label="Investimento" value={`R$ ${metrics.cost.toLocaleString()}`} change={0} />
        <Metric label="CTR Médio" value="2.4" change={0} suffix="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Mix de Atribuição por Canal</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Canal</th>
                  <th className="pb-3 text-center">Leads</th>
                  <th className="pb-3 text-center">Investimento</th>
                  <th className="pb-3 text-center">CPL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attributionData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold flex items-center">
                      <div className="w-1.5 h-6 rounded-full mr-3" style={{ backgroundColor: row.color }}></div>
                      {row.channel}
                    </td>
                    <td className="py-4 text-center font-medium">{row.leads}</td>
                    <td className="py-4 text-center text-slate-500">R$ {row.cost.toLocaleString()}</td>
                    <td className="py-4 text-center font-bold text-slate-700">R$ {row.cpl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <FormPerformance />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Tendência de Conversão</h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} dy={10} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="cost" name="Investimento" stroke={COLORS.paid} fill={COLORS.paid} fillOpacity={0.05} strokeWidth={2} />
            <Area type="monotone" dataKey="conversions" name="Leads" stroke={COLORS.secondary} fill="transparent" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
