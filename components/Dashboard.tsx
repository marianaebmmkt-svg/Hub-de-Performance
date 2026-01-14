
import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, Legend
} from 'recharts';
import { ACTIONS_LOG, COLORS, MOCK_TOP_PAGES } from '../constants';
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

const Dashboard: React.FC<DashboardProps> = ({ persistentRange, onRangeChange, onViewChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPerformanceData('all', persistentRange);
        setData(result);
      } catch (err: any) {
        if (err.message === 'AUTH_EXPIRED') {
          setError('Sua conexão com o Google expirou.');
        } else {
          setError('Ocorreu um erro ao buscar dados das APIs.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [persistentRange]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-3xl shadow-inner">⚠️</div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{error}</h2>
          <p className="text-slate-500 max-w-md mx-auto mt-2">
            O acesso aos dados reais foi interrompido. Mari, você precisa renovar as permissões de acesso nas configurações de integração.
          </p>
        </div>
        <button 
          onClick={() => onViewChange?.(ViewType.CONNECTIONS)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          Reconectar Contas Oficiais
        </button>
      </div>
    );
  }

  // Atribuição Simética para o Dashboard
  const attributionData = [
    { channel: 'Pago (Ads/Meta)', leads: 850, cost: 32000, cpl: 37.64, color: COLORS.paid },
    { channel: 'Orgânico (SEO)', leads: 320, cost: 4500, cpl: 14.06, color: COLORS.organic },
    { channel: 'Direto', leads: 70, cost: 0, cpl: 0, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <DateFilter initialRange={persistentRange} onFilterChange={onRangeChange} />
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm flex items-center transition-all hover:shadow-md active:scale-95">
            <span className="mr-2">📥</span> Exportar Atribuição
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 h-24 animate-pulse shadow-sm"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Metric label="Leads Totais (GTM)" value="1.240" change={12.5} showCompare={persistentRange.compare} previousValue="1.102" />
          <Metric label="CPL Geral" value="R$ 36,5" change={-8.4} showCompare={persistentRange.compare} previousValue="R$ 39,8" />
          <Metric label="CAC (Pago)" value="R$ 52,10" change={4.2} showCompare={persistentRange.compare} previousValue="R$ 50,00" />
          <Metric label="Engajamento (GA4)" value="72.4" change={3.1} suffix="%" showCompare={persistentRange.compare} previousValue="70.2" />
        </div>
      )}

      {/* Visão de Atribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Atribuição por Canal</h3>
            <div className="flex space-x-4">
              <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> Pago</span>
              <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Orgânico</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Canal</th>
                  <th className="pb-3 text-center">Leads</th>
                  <th className="pb-3 text-center">Investimento</th>
                  <th className="pb-3 text-center">CPL / CAC</th>
                  <th className="pb-3 text-right">Market Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attributionData.map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold flex items-center">
                      <div className="w-1.5 h-6 rounded-full mr-3" style={{ backgroundColor: row.color }}></div>
                      {row.channel}
                    </td>
                    <td className="py-4 text-center font-medium">{row.leads}</td>
                    <td className="py-4 text-center text-slate-500">R$ {row.cost.toLocaleString()}</td>
                    <td className={`py-4 text-center font-bold ${row.cpl > 30 ? 'text-rose-600' : 'text-emerald-600'}`}>R$ {row.cpl}</td>
                    <td className="py-4 text-right">
                       <div className="inline-block w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: row.color, width: `${(row.leads / 1240) * 100}%` }}></div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <FormPerformance />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Fluxo Cross-Channel</h3>
            <p className="text-xs text-slate-500">Comparativo entre Cliques Pagos (Ads) e Impressões Orgânicas (GSC)</p>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.paid} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.paid} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
              <YAxis hide />
              <Tooltip />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="clicks" name="Cliques Pagos" stroke={COLORS.paid} strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" />
              <Area type="monotone" dataKey="impressions" name="Impressões SEO" stroke={COLORS.secondary} strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
