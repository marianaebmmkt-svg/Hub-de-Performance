
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Uso de optional chaining para evitar erro caso import.meta.env não esteja definido
// Adicionado cast para any para satisfazer o TypeScript ao usar variáveis de ambiente do Vite
const env = (import.meta as any).env;
console.log('Hub da Mari: Sistema de Chaves Ativo', !!(env?.VITE_GOOGLE_CLIENT_ID || "204998073953-6s7flgav0p5u10v619iag22mkq5rfnvn.apps.googleusercontent.com"));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
