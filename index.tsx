
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Sistema de monitoramento de credenciais integradas
const CLIENT_ID = "204998073953-6s7flgav0p5u10v619iag22mkq5rfnvn.apps.googleusercontent.com";
console.log('Hub da Mari: Sistema OAuth2 inicializado com ID:', CLIENT_ID.substring(0, 15) + '...');

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
