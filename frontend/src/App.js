import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import LoginCidadao from './pages/LoginCidadao';
import CadastroCidadao from './pages/CadastroCidadao';
import PainelCidadao from './pages/PainelCidadao';
import RecuperarSenhaCidadao from './pages/RecuperarSenhaCidadao';
import LoginPrefeitura from './pages/LoginPrefeitura';
import CadastroPrefeitura from './pages/CadastroPrefeitura';
import RecuperarSenhaPrefeitura from './pages/RecuperarSenhaPrefeitura';
import AdminDeviceGuard from './components/AdminDeviceGuard';
import PainelKanban from './pages/PainelKanban';
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
 * - Rotas institucionais e rotas da Prefeitura exibem o Header e Footer globais padronizados.
 * - Rotas de autenticação móvel do Cidadão (/login/cidadao, /cadastro/cidadao, etc.) usam o cabeçalho dedicado do simulador mobile.
 */
function AppContent() {
  const location = useLocation();

  const isKanbanRoute =
    location.pathname === '/painel' ||
    location.pathname.startsWith('/prefeitura/painel');

  // Rotas da Prefeitura (Back-office Desktop) que utilizam Header e Footer globais
  const isPrefeituraRoute =
    location.pathname.startsWith('/login/prefeitura') ||
    location.pathname.startsWith('/cadastro/prefeitura') ||
    location.pathname.startsWith('/esqueci-senha/prefeitura') ||
    location.pathname.startsWith('/recuperar-senha/prefeitura') ||
    isKanbanRoute;

  // Rotas móveis do Cidadão (possuem cabeçalho próprio dentro do smartphone)
  const isCidadaoAuthRoute =
    location.pathname.startsWith('/login/cidadao') ||
    location.pathname.startsWith('/cadastro/cidadao') ||
    location.pathname.startsWith('/recuperar-senha/cidadao') ||
    location.pathname === '/recuperar-senha' ||
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
                <Route
                  path="/cidadao/painel"
                  element={
                    <PrivateRoute>
                      <PainelCidadao />
                    </PrivateRoute>
                  }
                />
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
    <div
      className={`app-layout ${isCidadaoAuthRoute ? 'app-layout--auth' : ''} ${
        isHomeRoute ? 'app-layout--home' : ''
      } ${isPrefeituraRoute ? 'app-layout--prefeitura' : ''}`}
    >
      {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho global (exibido em rotas institucionais e na Prefeitura) */}
      {!isCidadaoAuthRoute && (
        <Header mostrarSair={isPainelRoute} painelAdmin={isKanbanRoute} />
      )}

      {/* Área onde as páginas das rotas são renderizadas */}
      <div
        className={`app-main ${isCidadaoAuthRoute ? 'app-main--auth' : ''} ${
          isPrefeituraRoute ? 'app-main--prefeitura' : ''
        } ${isKanbanRoute ? 'app-main--kanban' : ''}`}
      >

        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login/cidadao" element={<LoginCidadao />} />
          <Route path="/cadastro/cidadao" element={<CadastroCidadao />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaCidadao />} />
          <Route path="/recuperar-senha/cidadao" element={<RecuperarSenhaCidadao />} />

          {/* Rotas Públicas da Prefeitura (Uso exclusivo Desktop via AdminDeviceGuard) */}
          <Route
            path="/login/prefeitura"
            element={
              <AdminDeviceGuard>
                <LoginPrefeitura />
              </AdminDeviceGuard>
            }
          />
          <Route
            path="/cadastro/prefeitura"
            element={
              <AdminDeviceGuard>
                <CadastroPrefeitura />
              </AdminDeviceGuard>
            }
          />
          <Route
            path="/esqueci-senha/prefeitura"
            element={
              <AdminDeviceGuard>
                <RecuperarSenhaPrefeitura />
              </AdminDeviceGuard>
            }
          />
          <Route
            path="/recuperar-senha/prefeitura"
            element={
              <AdminDeviceGuard>
                <RecuperarSenhaPrefeitura />
              </AdminDeviceGuard>
            }
          />

          {/* Painel de Solicitações (Kanban) do Back-office */}
          <Route
            path="/painel"
            element={
              <AdminDeviceGuard>
                <PainelKanban />
              </AdminDeviceGuard>
            }
          />
          <Route
            path="/prefeitura/painel"
            element={
              <AdminDeviceGuard>
                <PainelKanban />
              </AdminDeviceGuard>
            }
          />


          {/* Rotas Privadas do Cidadão (Blindadas com PrivateRoute) */}
          <Route
            path="/cidadao/painel"
            element={
              <PrivateRoute>
                <PainelCidadao />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/etapa-1"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/etapa-2"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep2 />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/etapa-3"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep3 />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/etapa-4"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep4 />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/sucesso"
            element={
              <PrivateRoute>
                <NovaSolicitacaoSucesso />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacao/nova"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/nova-solicitacao"
            element={
              <PrivateRoute>
                <NovaSolicitacaoStep1 />
              </PrivateRoute>
            }
          />

          {/* Rotas Públicas Institucionais */}
          <Route path="/politica-privacidade" element={<Privacidade />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Rodapé global nas páginas institucionais e rotas públicas da Prefeitura (omitido no Kanban para layout 100% de tela) */}
      {!isCidadaoAuthRoute && !isHomeRoute && !isKanbanRoute && <Footer />}

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
