import React from 'react';
import { HelpCircle } from 'lucide-react';
import logoZelus from '../assets/images/logo-zelus.png';
import './Header.scss';

/**
 * Componente Header
 * Cabeçalho global do ZELUS com logotipo acessível e botão de ajuda/acessibilidade.
 * Estrutura semântica: <header> (landmark banner) + <nav> (navegação principal).
 */
const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header__container">
        <a
          href="/"
          className="header__brand"
          aria-label="ZELUS — Ir para a página inicial"
        >
          <img
            src={logoZelus}
            alt="ZELUS - Zeladoria Urbana"
            width="160"
            height="48"
            className="header__logo"
          />
        </a>

        <nav className="header__nav" aria-label="Navegação principal">
          <button
            type="button"
            className="header__help-button"
            aria-label="Abrir ajuda e recursos de acessibilidade"
          >
            <HelpCircle size={20} aria-hidden="true" />
            <span className="header__help-label">Ajuda</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
