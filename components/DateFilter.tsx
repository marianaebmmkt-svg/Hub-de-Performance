
import React, { useState } from 'react';
import { DateRange } from '../types';

interface DateFilterProps {
  onFilterChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState<DateRange>({
    label: 'Últimos 30 dias',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    compare: false
  });

  const presets = [
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Este mês', isMonth: true },
    { label: 'Mês passado', isPrevMonth: true },
    { label: 'Personalizado', custom: true },
  ];

  const handlePresetSelect = (preset: any) => {
    let start = new Date();
    let end = new Date();
    
    if (preset.days) {
      start = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000);
    } else if (preset.isMonth) {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
    } else if (preset.isPrevMonth) {
      start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    }

    const newRange = { ...currentRange, label: preset.label, start, end };
    setCurrentRange(newRange);
    onFilterChange(newRange);
    setIsOpen(false);
  };

  const toggleCompare = () => {
    const newRange = { ...currentRange, compare: !currentRange.compare };
    setCurrentRange(newRange);
    onFilterChange(newRange);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm"
        >
          <span className="mr-2">📅</span>
          {currentRange.label}
          <span className="ml-2 text-[10px] text-slate-400">▼</span>
        </button>
        
        <button 
          onClick={toggleCompare}
          className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm ${
            currentRange.compare 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {currentRange.compare ? '✅ Comparando' : 'Comparar'}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-slate-100">
          <div className="py-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetSelect(preset)}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 border-b border-slate-50 last:border-0"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
