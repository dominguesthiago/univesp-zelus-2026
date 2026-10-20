import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './Header.scss';

/**
 * Componente Header Global
 * Reproduz fielmente o cabeçalho azul marinho com cubo 3D e 'ZELUS / Zeladoria Urbana',
 * exibindo 'Acessibilidade (?)' no desktop e marca centralizada no mobile conforme mockups.
 */
const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header__container">
        <Link
          to="/"
          className="header__brand"
          aria-label="ZELUS — Ir para a página inicial"
        >
          <img
            src={logoZelusIcon}
            alt="Ícone ZELUS"
            width="32"
            height="32"
            className="header__logo-icon"
          />
          <div className="header__brand-text">
            <span className="header__brand-title">ZELUS</span>
            <span className="header__brand-subtitle">Zeladoria Urbana</span>
          </div>
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <button
            type="button"
            className="header__help-button"
            aria-label="Abrir recursos de acessibilidade"
          >
            <span className="header__help-label">Acessibilidade</span>
            <HelpCircle size={18} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
