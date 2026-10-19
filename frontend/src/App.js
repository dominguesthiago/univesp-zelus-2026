import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Privacidade from './pages/Privacidade';
import NotFound from './pages/NotFound';

/**
 * Componente Raiz da Aplicação ZELUS
 * Define o roteamento e a casca semântica de layout:
 * skip link -> <header> -> <main> (rotas) -> <footer>, mais componentes transversais.
 * Header e Footer ficam fora do <main> para preservar os landmarks
 * banner / main / contentinfo.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>

        <Header />

        {/* Área principal onde as páginas das rotas são renderizadas */}
        <main id="conteudo-principal" className="app-main" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/politica-privacidade" element={<Privacidade />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {/* Pop-up global de privacidade e cookies */}
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}

export default App;
