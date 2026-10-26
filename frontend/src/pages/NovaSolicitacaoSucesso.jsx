import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './NovaSolicitacaoSucesso.scss';

/**
 * Página: Nova Solicitação — Tela de Sucesso (Etapa 5 / Conclusão)
 *
 * Características Arquiteturais:
 * - Cabeçalho: Fundo azul institucional ZELUS sem link de retorno (fluxo transacional concluído).
 * - Hero de Confirmação: Círculo verde com checkmark e confetes neobrutalistas ao redor.
 * - Bloco de Protocolo: Card amarelo com borda sólida cartoon (3.5px), sombra (6px) e
 *   caixa de ticket interna tracejada, com botão para copiar para a área de transferência.
 * - Ação Final: Botão azul escuro "VOLTAR AO INÍCIO 🏠" que limpa o rascunho do localStorage
 *   e redireciona o cidadão de volta para o Painel.
 */
const NovaSolicitacaoSucesso = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Resgate dos dados da solicitação enviados via navegação
  const dadosSolicitacao = location.state || {};

  // Protocolo: obtido do estado ou fallback gerado com ano corrente
  const [protocolo] = useState(() => {
    if (dadosSolicitacao.protocolo) {
      return dadosSolicitacao.protocolo;
    }
    try {
      const rascunho = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
      if (rascunho.protocolo) return rascunho.protocolo;
    } catch {
      // Ignora erro de JSON
    }
    const numAleatorio = Math.floor(1000 + Math.random() * 9000);
    return `#${numAleatorio}-${new Date().getFullYear()}`;
  });

  const [copiado, setCopiado] = useState(false);

  // Copia o protocolo para o clipboard com fallback resiliente
  const handleCopiarProtocolo = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(protocolo);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = protocolo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.warn('[ZELUS Sucesso] Erro ao copiar protocolo:', err);
    }
  };

  // Botão "VOLTAR AO INÍCIO": limpa o rascunho e navega para o painel
  const handleVoltarAoInicio = () => {
    try {
      localStorage.removeItem('zelus_rascunho_solicitacao');
    } catch (e) {
      console.warn('[ZELUS Sucesso] Erro ao limpar rascunho:', e);
    }
    navigate('/cidadao/painel');
  };

  return (
    <div className="nova-solicitacao-wrapper nova-solicitacao-wrapper--sucesso">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div
        className="nova-solicitacao-card-mobile nova-solicitacao-card-mobile--sucesso"
        role="region"
        aria-label="Nova Solicitação Concluída com Sucesso"
      >
        {/* Cabeçalho azul institucional sem botão de voltar (fluxo finalizado) */}
        <header className="nova-solicitacao-header nova-solicitacao-header--sucesso">
          <div className="nova-solicitacao-header__brand nova-solicitacao-header__brand--centered">
            <div className="nova-solicitacao-header__title-row">
              <img
                src={logoZelusIcon}
                alt=""
                className="nova-solicitacao-header__logo-icon"
                width="22"
                height="22"
                aria-hidden="true"
              />
              <span className="nova-solicitacao-header__title">ZELUS</span>
            </div>
            <span
              className="nova-solicitacao-header__subtitle auth-header__subtitle"
              style={{ color: '#ffffff' }}
            >
              Zeladoria Urbana
            </span>
          </div>
        </header>

        {/* Área Central: Hero de Sucesso + Card de Protocolo + Botão de Retorno */}
        <main className="nova-solicitacao-main-container sucesso-main-container" id="conteudo-principal">
          {/* Hero de Sucesso com ícone comemorativo e confetes */}
          <div className="sucesso-hero-wrapper">
            <div className="sucesso-icone-badge" aria-hidden="true">
              {/* Confetes decorativos ao redor do checklist */}
              <span className="sucesso-confete sucesso-confete--top-left" />
              <span className="sucesso-confete sucesso-confete--top-right" />
              <span className="sucesso-confete sucesso-confete--mid-left" />
              <span className="sucesso-confete sucesso-confete--mid-right" />
              <span className="sucesso-confete sucesso-confete--bottom-left" />
              <span className="sucesso-confete sucesso-confete--bottom-right" />

              {/* Círculo verde neobrutalista com checkmark */}
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sucesso-svg-badge"
              >
                {/* Círculo verde de fundo com borda cartoon sólida */}
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="#4ade80"
                  stroke="#1a1a24"
                  strokeWidth="4"
                />
                {/* Linha pontilhada interna */}
                <circle
                  cx="48"
                  cy="48"
                  r="35"
                  stroke="#1a1a24"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                {/* Checkmark em traço grosso */}
                <path
                  d="M32 49L43 60L65 37"
                  stroke="#1a1a24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 id="sucesso-heading" className="sucesso-titulo">
              Chamado enviado!
            </h1>
            <p className="sucesso-subtitulo">
              Obrigado! Seu chamado foi enviado para a Prefeitura.
            </p>
          </div>

          {/* Card Amarelo Neobrutalista do Protocolo */}
          <section
            className="sucesso-protocolo-card"
            aria-label="Informações do protocolo de atendimento"
          >
            <h2 className="sucesso-protocolo-rotulo">
              PROTOCOLO DE ATENDIMENTO:
            </h2>

            <div className="sucesso-protocolo-ticket">
              <span className="sucesso-protocolo-numero" data-testid="protocolo-numero">
                {protocolo}
              </span>
              <button
                type="button"
                className={`sucesso-btn-copiar ${copiado ? 'sucesso-btn-copiar--copiado' : ''}`}
                onClick={handleCopiarProtocolo}
                aria-label={copiado ? 'Protocolo copiado para a área de transferência' : 'Copiar número do protocolo'}
                title="Copiar protocolo"
              >
                {copiado ? (
                  <Check size={20} className="sucesso-icon-check" aria-hidden="true" />
                ) : (
                  <Copy size={20} className="sucesso-icon-copy" aria-hidden="true" />
                )}
              </button>
            </div>

            {copiado && (
              <span className="sucesso-copiado-badge" role="status" aria-live="polite">
                Copiado com sucesso!
              </span>
            )}
          </section>

          {/* Texto de orientação sobre acompanhamento */}
          <p className="sucesso-info-historico">
            O chamado foi salvo no seu histórico. Você pode acompanhar o andamento a qualquer momento.
          </p>

          {/* Ação Principal: Botão Voltar ao Início */}
          <div className="sucesso-actions">
            <button
              type="button"
              className="sucesso-btn-inicio"
              onClick={handleVoltarAoInicio}
              aria-label="Voltar para a tela inicial do Painel do Cidadão"
            >
              <span>VOLTAR AO INÍCIO</span>
              <span className="sucesso-btn-emoji" role="img" aria-label="Casa">🏠</span>
            </button>
          </div>
        </main>

        {/* Rodapé institucional ancorado na base */}
        <footer className="nova-solicitacao-footer-tagline">
          <span>ZELUS • Acessível e inclusivo para todos</span>
        </footer>
      </div>
    </div>
  );
};

export default NovaSolicitacaoSucesso;
