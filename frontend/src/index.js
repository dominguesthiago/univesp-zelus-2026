import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss';

// Ponto de entrada do frontend ZELUS
// Conecta a aplicação React ao elemento raiz do HTML e aplica os estilos globais
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
