import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend
} from 'recharts';
import { COLORS } from '../constants';
import { MetricCard, PerformanceData, DateRange, ViewType } from '../types';
import { fetchPerformanceData } from '../services/api';
import DateFilter from './DateFilter';
import FormPerformance from './FormPerformance';

interface DashboardProps {
  persistentRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  onViewChange?: (view: ViewType) => void;
}

const Metric: React.FC<MetricCard & { showCompare?: boolean; color?: string }> = ({ label, value, change, suffix = '', showCompare, previousValue, color = 'bg-white' }) => (
  <div className={`${color} p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
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
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPerformanceData('all', persistentRange);
        setData(result);
      } catch (err: any) {
        if (err.message === 'NO_CONNECTIONS') {
          setError(
            <div className="space-y-4">
              <p>Mari, você ainda não conectou suas contas de marketing.</p>
              <button 
                onClick={() => onViewChange?.(ViewType.CONNECTIONS)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
              >
                Configurar Integradora
              </button>
            </div>
          );
        } else if (err.message === 'DEV_TOKEN_UNAUTHORIZED') {
          setError('Mari, seu Token de Desenvolvedor Google Ads precisa de aprovação no Google Cloud.');
        } else if (err.message === 'AUTH_EXPIRED') {
          setError('Sua sessão expirou. Por favor, faça login novamente na aba Integradora.');
        } else {
          setError('Erro ao sincronizar dados reais. Verifique as chaves API.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [persistentRange, onViewChange]);

  const metrics = useMemo(() => {
    if (data.length === 0) return { conversions: 0, cost: 0, clicks: 0, engagement: 0, cpl: 0 };
    
    const totalConversions = data.reduce((acc, curr) => acc + curr.conversions, 0);
    const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
    const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
    const avgEngagement = data.filter(d => d.engagement_rate).length > 0 
      ? data.reduce((acc, curr) => acc + (curr.engagement_rate || 0), 0) / data.filter(d => d.engagement_rate).length
      : 0;

    const cpl = totalConversions > 0 ? totalCost / totalConversions : 0;
    
    return {
      conversions: totalConversions,
      cost: totalCost,
      clicks: totalClicks,
      engagement: avgEngagement,
      cpl: cpl
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="text-slate-500 font-medium animate-pulse">Buscando dados reais via OAuth2...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-2xl">⚠️</div>
        <div className="max-w-sm text-slate-600">{error}</div>
      </div>
    );
  }

  const attributionData = [
    { channel: 'Google Ads', leads: metrics.conversions, cost: metrics.cost, cpl: metrics.cpl.toFixed(2), color: COLORS.paid },
    { channel: 'Outros Canais', leads: 0, cost: 0, cpl: '0.00', color: COLORS.organic },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <DateFilter initialRange={persistentRange} onFilterChange={onRangeChange} />
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-emerald-700 uppercase">Dados em Tempo Real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric label="Leads Totais" value={metrics.conversions.toLocaleString()} change={0} />
        <Metric label="CPL Médio" value={`R$ ${metrics.cpl.toFixed(2)}`} change={0} />
        <Metric label="Investimento" value={`R$ ${metrics.cost.toLocaleString()}`} change={0} />
        <Metric label="Engajamento" value={metrics.engagement.toFixed(1)} change={0} suffix="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Mix de Atribuição Real</h3>
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
                  <tr key={i}>
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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} dy={10} />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="clicks" name="Cliques" stroke={COLORS.paid} fill={COLORS.paid} fillOpacity={0.1} />
            <Area type="monotone" dataKey="conversions" name="Conversões" stroke={COLORS.secondary} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;