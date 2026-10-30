import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  Navigation,
} from 'lucide-react';
import './SolicitacaoModal.scss';

/**
 * Modal de Detalhes da Solicitação e Auditoria Operacional
 * - Layout Superior: Foto da solicitação e mapa georreferenciado compactos lado a lado (com link externo para Google Maps).
 * - Layout Central: Dados essenciais de endereço e solicitante (sem campos redundantes).
 * - Interface de Auditoria: Histórico imutável de transições realizadas exclusivamente via Drag and Drop.
 */
const SolicitacaoModal = ({ solicitacao, onClose }) => {
  // Fechamento via tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!solicitacao) return null;

  const {
    protocolo,
    status: statusAtual,
    subcategoria,
    foto_url,
    endereco,
    coordenadas,
    cidadao,
    created_at,
    historico_auditoria = [],
  } = solicitacao;

  // Formatação de data e hora
  const formatarDataHora = (dataIso) => {
    if (!dataIso) return '';
    try {
      const data = new Date(dataIso);
      if (isNaN(data.getTime())) return dataIso;
      return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return dataIso;
    }
  };

  // URL direta para o Google Maps com coordenadas GPS
  const googleMapsUrl = `https://www.google.com/maps?q=${coordenadas?.latitude},${coordenadas?.longitude}`;

  const getBadgeClass = (st) => {
    switch (st) {
      case 'Pendente':
        return 'modal-badge--pendente';
      case 'Em análise':
        return 'modal-badge--analise';
      case 'Em execução':
        return 'modal-badge--execucao';
      case 'Concluída':
        return 'modal-badge--concluida';
      case 'Descartada':
        return 'modal-badge--descartada';
      default:
        return '';
    }
  };

  return (
    <div
      className="solicitacao-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="solicitacao-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-solicitacao-titulo"
      >
        {/* Cabeçalho do Modal - Fundo Claro e Texto Escuro */}
        <header className="solicitacao-modal-header">
          <div className="solicitacao-modal-header__info">
            <span className="solicitacao-modal-header__protocolo">{protocolo}</span>
            <span className={`solicitacao-modal-header__badge ${getBadgeClass(statusAtual)}`}>
              {statusAtual}
            </span>
          </div>

          <h1 id="modal-solicitacao-titulo" className="solicitacao-modal-header__titulo">
            {subcategoria}
          </h1>

          <button
            type="button"
            className="solicitacao-modal-header__close"
            onClick={onClose}
            aria-label="Fechar janela de detalhes"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Conteúdo com Layout Compacto (Sem Rolagem em Telas Padrão) */}
        <div className="solicitacao-modal-body">
          {/* 1. LAYOUT SUPERIOR: FOTO E MAPA LADO A LADO */}
          <section className="modal-secao modal-secao--midia" aria-label="Evidência fotográfica e localização">
            {/* Esquerda: Foto da Solicitação */}
            <div className="modal-painel-midia">
              <div className="modal-painel-midia__header">
                <span className="modal-painel-midia__tag">Foto da Solicitação</span>
              </div>
              <div className="modal-painel-midia__imagem-wrapper">
                <img
                  src={foto_url}
                  alt={`Evidência fotográfica para ${subcategoria}`}
                  className="modal-painel-midia__imagem"
                />
              </div>
            </div>

            {/* Direita: Mapa */}
            <div className="modal-painel-midia modal-painel-midia--mapa">
              <div className="modal-painel-midia__header">
                <span className="modal-painel-midia__tag">Localização no Mapa</span>
                <span className="modal-painel-midia__coords">
                  {coordenadas?.latitude?.toFixed(5)}, {coordenadas?.longitude?.toFixed(5)}
                </span>
              </div>

              {/* Simulação visual cartográfica neobrutalista compacta com botão externo */}
              <div className="modal-mapa-preview">
                <div className="modal-mapa-grid" aria-hidden="true">
                  <div className="modal-mapa-rua modal-mapa-rua--h" />
                  <div className="modal-mapa-rua modal-mapa-rua--v" />
                  <div className="modal-mapa-pin-pulse" />
                  <div className="modal-mapa-pin">
                    <MapPin size={22} className="modal-mapa-pin-icon" />
                  </div>
                </div>

                <div className="modal-mapa-overlay">
                  <div className="modal-mapa-endereco-resumo">
                    <strong>{endereco?.rua}, {endereco?.numero}</strong>
                    <span>{endereco?.bairro} • {endereco?.cidade}</span>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-mapa-btn"
                    aria-label={`Abrir localização de ${endereco?.rua} no Google Maps em nova aba`}
                  >
                    <Navigation size={14} aria-hidden="true" />
                    <span>Abrir no Maps</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. LAYOUT CENTRAL: DADOS ESSENCIAIS DO ENDEREÇO E SOLICITANTE */}
          <section className="modal-secao modal-secao--dados" aria-label="Dados do endereço e solicitante">
            <div className="modal-grid-dados">
              {/* Coluna 1: Endereço da Solicitação (Estrutura Estritamente Preservada) */}
              <div className="modal-card-dados">
                <div className="modal-card-dados__titulo">
                  <MapPin size={16} className="modal-card-dados__icone" aria-hidden="true" />
                  <h2>Endereço da Solicitação</h2>
                </div>

                <div className="modal-dados-lista">
                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">Logradouro:</span>
                    <span className="modal-dado-valor">
                      {endereco?.rua}, nº {endereco?.numero}
                    </span>
                  </div>

                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">Bairro / Cidade:</span>
                    <span className="modal-dado-valor">
                      {endereco?.bairro} — {endereco?.cidade} (CEP: {endereco?.cep})
                    </span>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Dados do Solicitante (Layout em 3 Linhas Limpas) */}
              <div className="modal-card-dados modal-card-dados--solicitante">
                {/* Linha 1: Solicitante e Nome Completo na mesma linha horizontal (Inline) */}
                <div className="modal-solicitante-linha-topo">
                  <User size={15} className="modal-solicitante-icone" aria-hidden="true" />
                  <span className="modal-solicitante-rotulo">Solicitante:</span>
                  <span className="modal-dado-valor modal-dado-valor--destaque modal-solicitante-nome-destaque">
                    {cidadao?.nome}
                  </span>
                </div>

                {/* Linha 2 (Flexbox/Grid 50/50): CPF Registrado e WhatsApp/Telefone */}
                <div className="modal-solicitante-linha-dupla">
                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">CPF Registrado:</span>
                    <span className="modal-dado-valor">{cidadao?.cpf}</span>
                  </div>

                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">WhatsApp / Telefone:</span>
                    <span className="modal-dado-valor">
                      <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {cidadao?.telefone}
                    </span>
                  </div>
                </div>

                {/* Linha 3 (Centralizada): Abertura da Solicitação */}
                <div className="modal-solicitante-linha-data">
                  <div className="modal-dado-item modal-dado-item--centralizado">
                    <span className="modal-dado-rotulo">Abertura da Solicitação:</span>
                    <span className="modal-dado-valor">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {formatarDataHora(created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. INTERFACE DE AUDITORIA: HISTÓRICO LIMPO (SEM FRASE EXCEDENTE) */}
          <section className="modal-secao modal-secao--auditoria" aria-labelledby="auditoria-titulo">
            <div className="modal-card-auditoria">
              {/* Título Limpo sem frases explicativas */}
              <div className="modal-card-auditoria__header">
                <ShieldCheck size={18} className="modal-card-auditoria__icone" aria-hidden="true" />
                <h2 id="auditoria-titulo" className="modal-card-auditoria__titulo">
                  Histórico de Auditoria
                </h2>
              </div>

              {/* Linha do tempo de movimentações anteriores (Audit Log) */}
              <div className="modal-historico-wrapper">
                <div className="modal-historico-header">
                  <Clock size={15} aria-hidden="true" />
                  <h3>Movimentações Anteriores ({historico_auditoria.length})</h3>
                </div>

                <div className="modal-timeline">
                  {historico_auditoria.length === 0 ? (
                    <p className="modal-timeline-vazio">Nenhuma movimentação registrada.</p>
                  ) : (
                    [...historico_auditoria].reverse().map((item, idx) => (
                      <div key={item.id || idx} className="modal-timeline-item">
                        <div className="modal-timeline-marcador" aria-hidden="true" />
                        <div className="modal-timeline-conteudo">
                          <div className="modal-timeline-topo">
                            <span className="modal-timeline-data">
                              {formatarDataHora(item.data_hora)}
                            </span>
                            <span className="modal-timeline-transicao">
                              <span className={`transicao-status ${getBadgeClass(item.status_anterior)}`}>
                                {item.status_anterior}
                              </span>
                              <span className="transicao-seta" aria-hidden="true">➔</span>
                              <span className={`transicao-status ${getBadgeClass(item.novo_status)}`}>
                                {item.novo_status}
                              </span>
                            </span>
                          </div>

                          <div className="modal-timeline-servidor">
                            <strong>Responsável:</strong> {item.funcionario}
                          </div>

                          {item.motivo && (
                            <div className="modal-timeline-motivo">
                              "{item.motivo}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SolicitacaoModal;
