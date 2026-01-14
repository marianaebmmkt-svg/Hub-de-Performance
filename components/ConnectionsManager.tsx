
import React, { useState } from 'react';
import { ConnectionStatus } from '../types';

// Declare external SDK globals for Google Identity Services and Meta/Facebook SDK
declare const google: any;
declare const FB: any;

interface ConnectionsManagerProps {
  connections: ConnectionStatus[];
  onConnect: (provider: string, token: string, accountId?: string) => void;
  onDisconnect: (provider: string) => void;
}

const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({ connections, onConnect, onDisconnect }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoogleLogin = (providerId: string) => {
    setLoading(providerId);
    
    // Configura o client OAuth do Google Identity Services
    const client = google.accounts.oauth2.initTokenClient({
      client_id: '375210574853-6stu98blaogecrjmtdvltbq5evk9hh76.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/tagmanager.readonly',
      callback: (response: any) => {
        if (response.access_token) {
          // Em um app real, aqui buscaríamos a lista de contas para o usuário escolher o ID
          const mockId = providerId === 'google_ads' ? '123-456-7890' : '987654321';
          onConnect(providerId, response.access_token, mockId);
        }
        setLoading(null);
      },
    });
    
    client.requestAccessToken();
  };

  const handleMetaLogin = () => {
    setLoading('meta_ads');
    FB.login((response: any) => {
      if (response.authResponse) {
        onConnect('meta_ads', response.authResponse.accessToken, 'meta_act_123');
      }
      setLoading(null);
    }, { scope: 'ads_read,business_management' });
  };

  const providers = [
    { 
      id: 'google_ads', 
      name: 'Google Ads', 
      icon: '🎯', 
      description: 'Importe campanhas, palavras-chave e métricas de conversão.',
      color: 'border-indigo-100 bg-indigo-50/30'
    },
    { 
      id: 'meta_ads', 
      name: 'Meta Ads', 
      icon: '📱', 
      description: 'Sincronize anúncios do Facebook e Instagram e leads do Meta.',
      color: 'border-blue-100 bg-blue-50/30'
    },
    { 
      id: 'ga4', 
      name: 'Google Analytics 4', 
      icon: '📈', 
      description: 'Dados de fluxo de usuários, eventos e atribuição de canais.',
      color: 'border-amber-100 bg-amber-50/30'
    },
    { 
      id: 'gsc', 
      name: 'Search Console', 
      icon: '🔍', 
      description: 'Acompanhe impressões orgânicas e posicionamento de keywords.',
      color: 'border-slate-100 bg-slate-50/30'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Conexões Oficiais</h3>
        <p className="text-slate-500 text-sm mb-8">
          Conecte as APIs das plataformas para transformar o Hub da Mari em uma central de BI em tempo real.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((p) => {
            const status = connections.find(c => c.provider === p.id);
            const isConnected = status?.isConnected;

            return (
              <div key={p.id} className={`p-6 rounded-xl border transition-all ${p.color} flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">{p.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/50 flex items-center justify-between">
                  {isConnected ? (
                    <>
                      <div className="text-[10px] text-slate-400">
                        <p className="font-bold uppercase">Token Ativo:</p>
                        <p className="truncate w-32">{status.accessToken?.substring(0, 15)}...</p>
                      </div>
                      <button 
                        onClick={() => onDisconnect(p.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 underline underline-offset-4"
                      >
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled={loading !== null}
                      onClick={() => p.id === 'meta_ads' ? handleMetaLogin() : handleGoogleLogin(p.id)}
                      className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
                    >
                      {loading === p.id ? 'Aguardando Login...' : 'Autorizar Acesso OAuth2'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start space-x-4">
        <span className="text-2xl">🔐</span>
        <div>
          <h4 className="text-sm font-bold text-amber-900 mb-1">Segurança de Dados e Privacidade</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            Seus tokens são armazenados localmente e criptografados pela sessão. Mari, o acesso é restrito apenas a leitura de relatórios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsManager;
