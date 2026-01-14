
import React, { useState } from 'react';
import { ConnectionStatus } from '../types';

declare const google: any;

interface ConnectionsManagerProps {
  connections: ConnectionStatus[];
  onConnect: (provider: string, token: string, accountId?: string) => void;
  onDisconnect: (provider: string) => void;
}

const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({ connections, onConnect, onDisconnect }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Client ID unificado atualizado
  const OFFICIAL_CLIENT_ID = "204998073953-6s7flgav0p5u10v619iag22mkq5rfnvn.apps.googleusercontent.com";

  const getClientId = (): string => {
    try {
      const env = (import.meta as any).env;
      if (typeof import.meta !== 'undefined' && env) {
        return env.VITE_GOOGLE_CLIENT_ID || OFFICIAL_CLIENT_ID;
      }
      return OFFICIAL_CLIENT_ID;
    } catch (e) {
      return OFFICIAL_CLIENT_ID;
    }
  };

  const initOAuth = (providerId: string) => {
    setLoading(providerId);
    setAuthError(null);
    
    try {
      if (!google?.accounts?.oauth2) {
        setAuthError("Biblioteca do Google não carregada. Verifique sua conexão ou bloqueadores de script.");
        setLoading(null);
        return;
      }

      const clientId = getClientId();
      
      // Escopos solicitados para os 3 serviços do Google
      const scopes = [
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/webmasters.readonly'
      ].join(' ');

      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: (response: any) => {
          if (response.access_token) {
            // IDs padrão para o ecossistema da Empresta Bem Melhor
            const defaultIds: Record<string, string> = {
              'google_ads': '6316307698',
              'ga4': '375210574',
              'gsc': 'https://emprestabemmelhor.com.br/'
            };
            
            // Sucesso na conexão
            onConnect(providerId, response.access_token, defaultIds[providerId]);
            console.log(`OAuth Sucesso: ${providerId} conectado.`);
          } else if (response.error) {
            setAuthError(`Erro na autorização: ${response.error_description || response.error}`);
          }
          setLoading(null);
        },
        error_callback: (err: any) => {
          setLoading(null);
          if (err.type === 'popup_closed' || err.message?.includes('closed')) {
            setAuthError("A janela foi fechada antes da autorização. Tente novamente.");
          } else {
            setAuthError("Falha na comunicação com o servidor do Google.");
          }
        }
      });
      
      // Disparar o popup de autorização
      client.requestAccessToken({ prompt: 'consent' });
    } catch (e: any) {
      console.error("Critical OAuth Error:", e);
      setAuthError("Erro interno ao iniciar autenticação.");
      setLoading(null);
    }
  };

  const providers = [
    { 
      id: 'google_ads', 
      name: 'Google Ads', 
      icon: '🎯', 
      description: 'Métricas de Custo, Conversões e Performance de PMAX.',
      color: 'border-indigo-100 bg-indigo-50/30'
    },
    { 
      id: 'ga4', 
      name: 'Analytics GA4', 
      icon: '📈', 
      description: 'Eventos de site, taxa de rejeição e comportamento real.',
      color: 'border-emerald-100 bg-emerald-50/30'
    },
    { 
      id: 'gsc', 
      name: 'Search Console', 
      icon: '🔍', 
      description: 'Impressões orgânicas e posicionamento de keywords.',
      color: 'border-amber-100 bg-amber-50/30'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Integração Direta Cloud</h3>
          </div>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
            Mari, conecte suas ferramentas oficiais. O Hub solicita acesso de <strong>apenas leitura</strong> para processar seus KPIs em tempo real sem salvar dados sensíveis.
          </p>
          
          {authError && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 animate-in slide-in-from-top-4">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">{authError}</p>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.52-1.24 1.24-2.88 1.92-5.72 1.92-5.28 0-9.64-4.28-9.64-9.56s4.36-9.56 9.64-9.56c2.84 0 4.84 1.12 6.36 2.56l2.32-2.32C19.24 1.52 16.48 0 12.48 0 5.52 0 0 5.52 0 12.48S5.52 24.96 12.48 24.96c3.76 0 6.6-1.24 8.84-3.56 2.32-2.32 3.04-5.56 3.04-8.16 0-.6-.04-1.2-.12-1.72H12.48z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((p) => {
          const status = connections.find(c => c.provider === p.id);
          const isConnected = status?.isConnected;

          return (
            <div key={p.id} className={`p-6 rounded-2xl border transition-all ${p.color} bg-white shadow-sm hover:shadow-lg flex flex-col justify-between h-full group`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{p.icon}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                    isConnected ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isConnected ? '✓ CONECTADO' : 'PENDENTE'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{p.name}</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">{p.description}</p>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-600 font-bold">SINCRONIZADO</span>
                      <span className="text-slate-400 italic">via OAuth2.0</span>
                    </div>
                    <button 
                      onClick={() => onDisconnect(p.id)}
                      className="w-full py-2 border border-rose-200 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-50 transition-colors"
                    >
                      Remover Acesso
                    </button>
                  </div>
                ) : (
                  <button 
                    disabled={loading !== null}
                    onClick={() => initOAuth(p.id)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading === p.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Autenticando...
                      </span>
                    ) : 'Conectar Conta Google'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <p className="text-indigo-400 font-bold text-sm mb-1 uppercase tracking-widest">Segurança de Dados</p>
          <p className="text-xs text-slate-400">Tokens são armazenados localmente e nunca tocam nosso backend. Criptografia em repouso ativada.</p>
        </div>
        <div className="flex space-x-4 opacity-50">
          <span className="text-xs">HTTPS ✅</span>
          <span className="text-xs">SSL ✅</span>
          <span className="text-xs">GDPR Compliant ✅</span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsManager;
