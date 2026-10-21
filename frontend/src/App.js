import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import LoginCidadao from './pages/LoginCidadao';
import CadastroCidadao from './pages/CadastroCidadao';
import PainelCidadao from './pages/PainelCidadao';
import RecuperarSenhaCidadao from './pages/RecuperarSenhaCidadao';
import Privacidade from './pages/Privacidade';
import NotFound from './pages/NotFound';

/**
 * Componente Interno de Conteúdo e Layout
 * Controla a convivência harmônica de cabeçalhos:
 * - Rotas institucionais exibem o Header e Footer globais.
 * - Rotas de autenticação/fluxo mobile (/login/..., /cadastro/..., /recuperar-senha/...) usam seu cabeçalho próprio dedicado.
 */
function AppContent() {
  const location = useLocation();
  const isAuthRoute =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/cadastro') ||
    location.pathname.startsWith('/recuperar-senha');
  const isHomeRoute = location.pathname === '/';

  return (
    <div className={`app-layout ${isAuthRoute ? 'app-layout--auth' : ''} ${isHomeRoute ? 'app-layout--home' : ''}`}>
      {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho global (omitido em telas de login/cadastro com cabeçalho próprio) */}
      {!isAuthRoute && <Header />}

      {/* Área onde as páginas das rotas são renderizadas (cada página possui seu landmark <main>) */}
      <div className={`app-main ${isAuthRoute ? 'app-main--auth' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/cidadao" element={<LoginCidadao />} />
          <Route path="/cadastro/cidadao" element={<CadastroCidadao />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaCidadao />} />
          <Route path="/recuperar-senha/cidadao" element={<RecuperarSenhaCidadao />} />
          <Route path="/cidadao/painel" element={<PainelCidadao />} />
          <Route path="/politica-privacidade" element={<Privacidade />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Rodapé global nas páginas auxiliares (Home e Login possuem seu próprio footer semântico) */}
      {!isAuthRoute && !isHomeRoute && <Footer />}

      {/* Pop-up global de privacidade e cookies */}
      <CookieBanner />
    </div>
  );
}

/**
 * Componente Raiz da Aplicação ZELUS
 */
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
