import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, LogOut } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './Header.scss';

/**
 * Encerra a sessão local do cidadão.
 */
const limparSessao = () => {
  localStorage.removeItem('zelus_token');
  localStorage.removeItem('zelus_cidadao');
};

/**
 * Componente Header Global
 * Reproduz fielmente o cabeçalho azul marinho com cubo 3D e 'ZELUS / Zeladoria Urbana',
 * exibindo 'Acessibilidade (?)' no desktop e marca centralizada no mobile conforme mockups.
 * Quando `mostrarSair` é verdadeiro (área logada do cidadão), exibe o link discreto
 * "Sair" com ícone LogOut no canto superior esquerdo.
 */
const Header = ({ mostrarSair = false }) => {
  return (
    <header
      className={`header${mostrarSair ? ' header--com-sair' : ''}`}
      role="banner"
    >
      <div className="header__container">
        {mostrarSair && (
          <Link
            to="/login/cidadao"
            onClick={limparSessao}
            className="header__sair"
            aria-label="Sair da conta e encerrar sessão"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sair</span>
          </Link>
        )}

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
            <span className="header__brand-subtitle auth-header__subtitle">Zeladoria Urbana</span>
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
