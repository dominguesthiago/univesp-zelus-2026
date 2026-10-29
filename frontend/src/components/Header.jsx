import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, LogOut, Info, X, Shield, CheckCircle } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './Header.scss';

/**
 * Encerra a sessão local do cidadão.
 */
const limparSessaoCidadao = () => {
  localStorage.removeItem('zelus_token');
  localStorage.removeItem('zelus_cidadao');
};

/**
 * Componente Header Global
 * Suporta os modos:
 * 1. Back-office da Prefeitura (/painel):
 *    - Link ativo "Painel de Solicitações"
 *    - Link futuro/inativo "Dashboard de Dados" (com badge "Em breve")
 *    - Link informativo "Sobre o ZELUS"
 *    - Botão "Sair" com encerramento de sessão administrativa
 * 2. Área do Cidadão (mostrarSair = true):
 *    - Botão "Sair" no canto esquerdo
 * 3. Rotas Institucionais / Públicas:
 *    - Marca centralizada ou padrão com botão de acessibilidade
 */
const Header = ({ mostrarSair = false, painelAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalSobreAberto, setModalSobreAberto] = useState(false);

  // Identifica se a rota atual é o painel administrativo da prefeitura
  const isBackoffice =
    painelAdmin ||
    location.pathname === '/painel' ||
    location.pathname.startsWith('/prefeitura/painel');

  // Encerramento de sessão do servidor municipal
  const handleLogoutPrefeitura = () => {
    localStorage.removeItem('zelus_admin_token');
    localStorage.removeItem('zelus_funcionario');
    localStorage.removeItem('zelus_token');
    navigate('/login/prefeitura');
  };

  return (
    <>
      <header
        className={`header${mostrarSair ? ' header--com-sair' : ''}${
          isBackoffice ? ' header--backoffice' : ''
        }`}
        role="banner"
      >
        <div className="header__container">
          {/* Ação Sair do Cidadão (se aplicável) */}
          {mostrarSair && !isBackoffice && (
            <Link
              to="/login/cidadao"
              onClick={limparSessaoCidadao}
              className="header__sair"
              aria-label="Sair da conta e encerrar sessão"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Sair</span>
            </Link>
          )}

          {/* Marca / Identidade ZELUS */}
          <Link
            to={isBackoffice ? '/painel' : '/'}
            className="header__brand"
            aria-label="ZELUS — Página inicial"
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
              <span
                className="header__brand-subtitle auth-header__subtitle"
                style={{ color: '#ffffff' }}
              >
                {isBackoffice ? 'Gestão Municipal' : 'Zeladoria Urbana'}
              </span>
            </div>
          </Link>

          {/* Navegação Dedicada do Back-office (Prefeitura) */}
          {isBackoffice ? (
            <nav className="header__nav header__nav--backoffice" aria-label="Navegação administrativa">
              <Link
                to="/painel"
                className="header__link header__link--ativo"
                aria-current="page"
              >
                Painel de Solicitações
              </Link>

              <span
                className="header__link header__link--inativo"
                title="Módulo de indicadores em desenvolvimento"
                tabIndex={0}
                role="link"
                aria-disabled="true"
              >
                <span>Dashboard de Dados</span>
                <span className="header__badge-futuro">Em breve</span>
              </span>

              <button
                type="button"
                onClick={() => setModalSobreAberto(true)}
                className="header__link header__link--btn"
              >
                <Info size={15} aria-hidden="true" />
                <span>Sobre o ZELUS</span>
              </button>

              <button
                type="button"
                onClick={handleLogoutPrefeitura}
                className="header__btn-sair-admin"
                aria-label="Encerrar sessão de trabalho e sair do painel"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Sair</span>
              </button>
            </nav>
          ) : (
            /* Navegação Padrão para Visitantes e Cidadão */
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
          )}
        </div>
      </header>

      {/* Modal Acessível "Sobre o ZELUS" */}
      {modalSobreAberto && (
        <div
          className="modal-sobre-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalSobreAberto(false);
          }}
          role="presentation"
        >
          <div
            className="modal-sobre-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-sobre-zelus"
          >
            <div className="modal-sobre-header">
              <div className="modal-sobre-titulo-bloco">
                <Shield size={22} className="modal-sobre-icone" aria-hidden="true" />
                <h2 id="titulo-sobre-zelus">Sobre a Plataforma ZELUS</h2>
              </div>
              <button
                type="button"
                className="modal-sobre-close"
                onClick={() => setModalSobreAberto(false)}
                aria-label="Fechar janela Sobre o ZELUS"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="modal-sobre-body">
              <p className="modal-sobre-destaque">
                O <strong>ZELUS</strong> é o ecossistema integrado de zeladoria urbana inteligente,
                conectando as demandas reais da população diretamente às equipes operacionais e de fiscalização da Prefeitura.
              </p>

              <div className="modal-sobre-pontos">
                <div className="modal-sobre-ponto">
                  <CheckCircle size={16} className="modal-sobre-ponto-icone" />
                  <div>
                    <strong>Triagem Transparente:</strong> Fluxo em 5 etapas estritas, garantindo que nenhum chamado fique sem resposta.
                  </div>
                </div>
                <div className="modal-sobre-ponto">
                  <CheckCircle size={16} className="modal-sobre-ponto-icone" />
                  <div>
                    <strong>Auditoria Imutável:</strong> Toda e qualquer movimentação exige justificativa formal com registro temporal e identificação de servidor.
                  </div>
                </div>
                <div className="modal-sobre-ponto">
                  <CheckCircle size={16} className="modal-sobre-ponto-icone" />
                  <div>
                    <strong>Acessibilidade Plena:</strong> Interface desenvolvida em estrita observância às diretrizes WCAG 2.1 (AA) e eMAG.
                  </div>
                </div>
              </div>

              <div className="modal-sobre-versao">
                <span>Versão do Sistema: <strong>1.0.0 (Release 2026)</strong></span>
                <span>Ambiente: <strong>Back-office Operacional</strong></span>
              </div>
            </div>

            <div className="modal-sobre-footer">
              <button
                type="button"
                className="modal-sobre-btn-fechar"
                onClick={() => setModalSobreAberto(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
