import React from 'react';
import CookieBanner from './components/CookieBanner';

/**
 * Componente Raiz da Aplicação ZELUS
 * Fornece a casca semântica de layout com atalhos de acessibilidade (Skip Link)
 * e injeta componentes transversais como o CookieBanner.
 */
function App() {
  return (
    <div className="app-layout">
      {/* Skip Link para navegação por teclado (WCAG 2.4.1 / eMAG) */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Área principal onde as rotas e páginas serão inseridas */}
      <main id="conteudo-principal" className="app-main" tabIndex="-1">
        {/* Próximos passos: Roteador e HomePage */}
      </main>

      {/* Pop-up global de privacidade e cookies */}
      <CookieBanner />
    </div>
  );
}

export default App;
