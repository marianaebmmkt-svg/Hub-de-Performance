
import React from 'react';
import { MOCK_FORMS } from '../constants';

const FormPerformance: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Performance de Formulários (GTM)</h3>
          <p className="text-xs text-slate-500">Monitoramento de envios e taxa de preenchimento</p>
        </div>
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">Ao Vivo</span>
      </div>

      <div className="space-y-4">
        {MOCK_FORMS.map((form) => (
          <div key={form.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-bold text-slate-800">{form.name}</h4>
              <span className="text-xs font-bold text-indigo-600">{form.convRate}% Conv.</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Visualizações</span>
                <span className="text-sm font-bold">{form.views.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Envios (Leads)</span>
                <span className="text-sm font-bold">{form.submissions.toLocaleString()}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${form.convRate * 10}%` }} // Scale for visual effect
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormPerformance;
