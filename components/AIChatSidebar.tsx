
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/gemini';
import { COLORS } from '../constants';

interface AIChatSidebarProps {
  onClose: () => void;
  currentRange?: any; // Recebe o contexto do filtro atual
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ onClose, currentRange }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Olá! Sou sua analista Mari AI. Estou pronta para analisar seus dados de performance. O que deseja saber sobre os resultados atuais?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));
      
      // Adiciona contexto do filtro atual no envio
      const contextAugmentedMsg = `[Filtro Ativo: ${currentRange?.label || 'Período Atual'}${currentRange?.compare ? ' com Comparação Ativa' : ''}] ${userMsg}`;
      
      const aiResponse = await getChatResponse(contextAugmentedMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'Sem resposta no momento.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um erro ao processar sua análise.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl font-inter">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
            <span className="text-sm">✨</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">Mari AI Analista</h3>
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">BI Intelligence</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Como variou o CPA comparado ao mês passado?"
            className="w-full p-3 pr-12 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 min-h-[44px] overflow-hidden bg-white shadow-inner"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatSidebar;
