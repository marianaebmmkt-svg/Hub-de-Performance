
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

  const CLIENT_ID = "204998073953-6s7flgav0p5u10v619iag22mkq5rfnvn.apps.googleusercontent.com";

  const initOAuth = (providerId: string) => {
    setLoading(providerId);
    setAuthError(null);
    
    try {
      if (!google?.accounts?.oauth2) {
        setAuthError("Biblioteca do Google não carregada corretamente.");
        setLoading(null);
        return;
      }

      const scopes = [
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/webmasters.readonly'
      ].join(' ');

      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: scopes,
        ux_mode: 'popup',
        callback: (response: any) => {
          if (response.access_token) {
            const defaultIds: Record<string, string> = {
              'google_ads': '6316307698',
              'ga4': '375210574',
              'gsc': 'https://emprestabemmelhor.com.br/'
            };
            
            onConnect(providerId, response.access_token, defaultIds[providerId]);
          } else if (response.error) {
            setAuthError(`Erro na autenticação: ${response.error}`);
          }
          setLoading(null);
        }
      });
      
      client.requestAccessToken({ prompt: 'consent' });
    } catch (e: any) {
      setAuthError("Falha ao iniciar o fluxo de login.");
      setLoading(null);
    }
  };

  const providers = [
    { id: 'google_ads', name: 'Google Ads', icon: '🎯', description: 'Performance de PMAX e Pesquisa.' },
    { id: 'ga4', name: 'Analytics GA4', icon: '📈', description: 'Dados de site e comportamento.' },
    { id: 'gsc', name: 'Search Console', icon: '🔍', description: 'Tráfego orgânico e keywords.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Conectar Canais de Performance</h3>
        <p className="text-slate-500 text-sm mb-8">Autorize o Hub da Mari a ler seus dados para gerar insights automatizados.</p>
        
        {authError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>{authError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((p) => {
            const status = connections.find(c => c.provider === p.id);
            const isConnected = status?.isConnected;

            return (
              <div key={p.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-4">
                <span className="text-4xl">{p.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-800">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{p.description}</p>
                </div>
                
                {isConnected ? (
                  <div className="w-full space-y-2">
                    <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold py-1 rounded-full">CONECTADO</div>
                    <button onClick={() => onDisconnect(p.id)} className="text-[10px] text-rose-500 hover:underline">Desconectar</button>
                  </div>
                ) : (
                  <button 
                    disabled={loading !== null}
                    onClick={() => initOAuth(p.id)}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    {loading === p.id ? 'Conectando...' : 'Conectar'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsManager;
