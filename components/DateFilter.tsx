
import React, { useState, useEffect } from 'react';
import { DateRange } from '../types';

interface DateFilterProps {
  initialRange: DateRange;
  onFilterChange: (range: DateRange) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ initialRange, onFilterChange, isOpen, onClose }) => {
  const [tempRange, setTempRange] = useState<DateRange>(initialRange);

  useEffect(() => {
    if (isOpen) {
      setTempRange(initialRange);
    }
  }, [isOpen, initialRange]);

  if (!isOpen) return null;

  const handleSave = () => {
    const isValid = (d: any) => d && !isNaN(new Date(d).getTime());
    
    if (!isValid(tempRange.start) || !isValid(tempRange.end)) {
      alert("Por favor, selecione datas válidas para o período principal.");
      return;
    }

    onFilterChange(tempRange);
    onClose();
  };

  const formatDateForInput = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (field: 'start' | 'end' | 'compareStart' | 'compareEnd', value: string) => {
    if (!value) return;
    const newDate = new Date(value + 'T00:00:00');
    setTempRange({ ...tempRange, [field]: newDate });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Calendário de Performance</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Defina livremente os intervalos de análise</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all">✕</button>
        </div>

        <div className="p-10 space-y-8">
          {/* Primary Range */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Intervalo de Datas Principal</h5>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Início</label>
                <input 
                  type="date" 
                  value={formatDateForInput(tempRange.start)}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Fim</label>
                <input 
                  type="date" 
                  value={formatDateForInput(tempRange.end)}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase">Habilitar Comparação</p>
              <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-tight">Visualizar dados sobrepostos nos gráficos</p>
            </div>
            <button 
              onClick={() => {
                const isComparing = !tempRange.compare;
                const newCompareRange = isComparing ? {
                  compareStart: tempRange.compareStart || new Date(new Date(tempRange.start).setDate(new Date(tempRange.start).getDate() - 30)),
                  compareEnd: tempRange.compareEnd || new Date(new Date(tempRange.end).setDate(new Date(tempRange.end).getDate() - 30)),
                } : {};
                setTempRange({ ...tempRange, compare: isComparing, ...newCompareRange });
              }}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${tempRange.compare ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${tempRange.compare ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Comparison Range */}
          {tempRange.compare && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-200">
              <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Período de Comparação</h5>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Início (Comparativo)</label>
                  <input 
                    type="date" 
                    value={formatDateForInput(tempRange.compareStart)}
                    onChange={(e) => handleDateChange('compareStart', e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Fim (Comparativo)</label>
                  <input 
                    type="date" 
                    value={formatDateForInput(tempRange.compareEnd)}
                    onChange={(e) => handleDateChange('compareEnd', e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleSave}
            className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all"
          >
            Sincronizar BI com novas datas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
