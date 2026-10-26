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
import NovaSolicitacaoStep1 from './pages/NovaSolicitacaoStep1';
import NovaSolicitacaoStep2 from './pages/NovaSolicitacaoStep2';
import NovaSolicitacaoStep3 from './pages/NovaSolicitacaoStep3';
import NovaSolicitacaoStep4 from './pages/NovaSolicitacaoStep4';
import NovaSolicitacaoSucesso from './pages/NovaSolicitacaoSucesso';
import Privacidade from './pages/Privacidade';
import NotFound from './pages/NotFound';

/**
 * Componente Interno de Conteúdo e Layout
 * Controla a convivência harmônica de cabeçalhos:
 * - Rotas institucionais exibem o Header e Footer globais.
 * - Rotas de autenticação e fluxo mobile (/login/..., /cadastro/..., /recuperar-senha/..., /solicitacao/...) usam seu cabeçalho próprio dedicado.
 */
function AppContent() {
  const location = useLocation();
  const isAuthRoute =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/cadastro') ||
    location.pathname.startsWith('/recuperar-senha') ||
    location.pathname.startsWith('/solicitacao') ||
    location.pathname.startsWith('/nova-solicitacao');
  const isHomeRoute = location.pathname === '/';
  const isPainelRoute = location.pathname.startsWith('/cidadao/painel');

  if (isPainelRoute) {
    return (
      <div className="app-layout app-layout--auth">
        {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>

        <div className="app-main app-main--auth">
          <div className="painel-cidadao-wrapper">
            <div className="painel-card-mobile" role="region" aria-label="Painel do Cidadão">
              <Header mostrarSair={true} />
              <Routes>
                <Route path="/cidadao/painel" element={<PainelCidadao />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </div>

        <CookieBanner />
      </div>
    );
  }

  return (
    <div className={`app-layout ${isAuthRoute ? 'app-layout--auth' : ''} ${isHomeRoute ? 'app-layout--home' : ''}`}>
      {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho global (omitido em telas de login/cadastro com cabeçalho próprio) */}
      {!isAuthRoute && <Header mostrarSair={isPainelRoute} />}

      {/* Área onde as páginas das rotas são renderizadas (cada página possui seu landmark <main>) */}
      <div className={`app-main ${isAuthRoute ? 'app-main--auth' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/cidadao" element={<LoginCidadao />} />
          <Route path="/cadastro/cidadao" element={<CadastroCidadao />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaCidadao />} />
          <Route path="/recuperar-senha/cidadao" element={<RecuperarSenhaCidadao />} />
          <Route path="/cidadao/painel" element={<PainelCidadao />} />
          <Route path="/solicitacao/etapa-1" element={<NovaSolicitacaoStep1 />} />
          <Route path="/solicitacao/etapa-2" element={<NovaSolicitacaoStep2 />} />
          <Route path="/solicitacao/etapa-3" element={<NovaSolicitacaoStep3 />} />
          <Route path="/solicitacao/etapa-4" element={<NovaSolicitacaoStep4 />} />
          <Route path="/solicitacao/sucesso" element={<NovaSolicitacaoSucesso />} />
          <Route path="/solicitacao/nova" element={<NovaSolicitacaoStep1 />} />
          <Route path="/nova-solicitacao" element={<NovaSolicitacaoStep1 />} />
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
