import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  User,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  Navigation,
  Check,
} from 'lucide-react';
import './SolicitacaoModal.scss';

/**
 * Modal de Detalhes da Solicitação e Auditoria Operacional
 * - Layout Superior: Foto da ocorrência e mapa georreferenciado lado a lado (com link externo para Google Maps).
 * - Layout Central: Dados completos de endereço, cidadão, categoria e descrição.
 * - Interface de Auditoria: Dropdown com 5 status, textarea obrigatório para o motivo e histórico imutável.
 */
const SolicitacaoModal = ({ solicitacao, onClose, onUpdateStatus }) => {
  const [novoStatus, setNovoStatus] = useState(solicitacao?.status || 'Pendente');
  const [motivo, setMotivo] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');
  const [sucessoFeedback, setSucessoFeedback] = useState('');

  // Sincroniza estado quando a solicitação muda
  useEffect(() => {
    if (solicitacao) {
      setNovoStatus(solicitacao.status);
      setMotivo('');
      setErroValidacao('');
      setSucessoFeedback('');
    }
  }, [solicitacao]);

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
    id,
    protocolo,
    status: statusAtual,
    categoria,
    subcategoria,
    descricao,
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

  const isStatusAlterado = novoStatus !== statusAtual;

  const handleSalvarStatus = (e) => {
    e.preventDefault();

    if (!motivo || motivo.trim().length < 5) {
      setErroValidacao('O preenchimento do motivo é obrigatório (mínimo de 5 caracteres) para auditoria.');
      return;
    }

    // Identificação do funcionário logado
    let nomeFuncionario = 'Servidor Municipal (Matrícula: 4892)';
    try {
      const funcSalvo = localStorage.getItem('zelus_funcionario');
      if (funcSalvo) {
        const parsed = JSON.parse(funcSalvo);
        if (parsed.nome_completo || parsed.nomeCompleto) {
          nomeFuncionario = `${parsed.nome_completo || parsed.nomeCompleto} (Servidor Responsável)`;
        }
      }
    } catch (e) {
      // fallback padrão
    }

    onUpdateStatus?.(id, novoStatus, motivo.trim(), nomeFuncionario);

    setSucessoFeedback(`Status atualizado com sucesso para "${novoStatus}" e registrado na auditoria!`);
    setMotivo('');
    setErroValidacao('');

    setTimeout(() => {
      setSucessoFeedback('');
    }, 4000);
  };

  const handleCancelarAlteracao = () => {
    setNovoStatus(statusAtual);
    setMotivo('');
    setErroValidacao('');
  };

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
        {/* Cabeçalho do Modal */}
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

        {/* Conteúdo com rolagem interna */}
        <div className="solicitacao-modal-body">
          {/* 1. LAYOUT SUPERIOR: FOTO E MAPA LADO A LADO */}
          <section className="modal-secao modal-secao--midia" aria-label="Evidência fotográfica e localização">
            {/* Esquerda: Foto */}
            <div className="modal-painel-midia">
              <div className="modal-painel-midia__header">
                <span className="modal-painel-midia__tag">Foto da Ocorrência</span>
                <span className="modal-painel-midia__sub">Enviada pelo Munícipe</span>
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

              {/* Simulação visual cartográfica neobrutalista com botão externo */}
              <div className="modal-mapa-preview">
                <div className="modal-mapa-grid" aria-hidden="true">
                  <div className="modal-mapa-rua modal-mapa-rua--h" />
                  <div className="modal-mapa-rua modal-mapa-rua--v" />
                  <div className="modal-mapa-pin-pulse" />
                  <div className="modal-mapa-pin">
                    <MapPin size={24} className="modal-mapa-pin-icon" />
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
                    <Navigation size={16} aria-hidden="true" />
                    <span>Abrir no Google Maps</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. LAYOUT CENTRAL: DADOS COMPLETOS DO ENDEREÇO E CIDADÃO */}
          <section className="modal-secao modal-secao--dados" aria-label="Dados do endereço e solicitante">
            <div className="modal-grid-dados">
              {/* Coluna 1: Endereço e Ocorrência */}
              <div className="modal-card-dados">
                <div className="modal-card-dados__titulo">
                  <MapPin size={17} className="modal-card-dados__icone" aria-hidden="true" />
                  <h2>Endereço e Ocorrência</h2>
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

                  {endereco?.ponto_referencia && (
                    <div className="modal-dado-item">
                      <span className="modal-dado-rotulo">Ponto de Referência:</span>
                      <span className="modal-dado-valor">{endereco.ponto_referencia}</span>
                    </div>
                  )}

                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">Categoria Geral:</span>
                    <span className="modal-dado-valor modal-dado-valor--categoria">
                      {categoria}
                    </span>
                  </div>

                  <div className="modal-dado-item modal-dado-item--descricao">
                    <span className="modal-dado-rotulo">Relato do Munícipe:</span>
                    <p className="modal-dado-texto">{descricao}</p>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Dados do Munícipe Solicitante */}
              <div className="modal-card-dados">
                <div className="modal-card-dados__titulo">
                  <User size={17} className="modal-card-dados__icone" aria-hidden="true" />
                  <h2>Dados do Cidadão Solicitante</h2>
                </div>

                <div className="modal-dados-lista">
                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">Nome Completo:</span>
                    <span className="modal-dado-valor modal-dado-valor--destaque">
                      {cidadao?.nome}
                    </span>
                  </div>

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

                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">E-mail de Contato:</span>
                    <span className="modal-dado-valor">
                      <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {cidadao?.email}
                    </span>
                  </div>

                  <div className="modal-dado-item">
                    <span className="modal-dado-rotulo">Abertura do Chamado:</span>
                    <span className="modal-dado-valor">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {formatarDataHora(created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. INTERFACE DE AUDITORIA: ALTERAÇÃO DE STATUS COM MOTIVO OBRIGATÓRIO */}
          <section className="modal-secao modal-secao--auditoria" aria-labelledby="auditoria-titulo">
            <div className="modal-card-auditoria">
              <div className="modal-card-auditoria__header">
                <ShieldCheck size={20} className="modal-card-auditoria__icone" aria-hidden="true" />
                <div>
                  <h2 id="auditoria-titulo" className="modal-card-auditoria__titulo">
                    Auditoria e Gestão de Status
                  </h2>
                  <p className="modal-card-auditoria__sub">
                    Toda alteração de etapa gera um registro auditável imutável com data, hora e servidor responsável.
                  </p>
                </div>
              </div>

              {sucessoFeedback && (
                <div className="modal-auditoria-feedback" role="alert">
                  <CheckCircle2 size={18} />
                  <span>{sucessoFeedback}</span>
                </div>
              )}

              {/* Formulário de Alteração de Status */}
              <form onSubmit={handleSalvarStatus} className="modal-auditoria-form">
                <div className="modal-auditoria-campo">
                  <label htmlFor="select-status-kanban" className="modal-auditoria-label">
                    Alterar Status da Solicitação:
                  </label>
                  <select
                    id="select-status-kanban"
                    value={novoStatus}
                    onChange={(e) => {
                      setNovoStatus(e.target.value);
                      if (erroValidacao) setErroValidacao('');
                    }}
                    className="modal-auditoria-select"
                  >
                    <option value="Pendente">⏳ Pendente</option>
                    <option value="Em análise">🔍 Em análise</option>
                    <option value="Em execução">⚙️ Em execução</option>
                    <option value="Concluída">✓ Concluída</option>
                    <option value="Descartada">✕ Descartada</option>
                  </select>
                </div>

                {/* Bloco Condicional de Motivo Obrigatório */}
                {isStatusAlterado && (
                  <div className="modal-auditoria-motivo-box">
                    <div className="modal-auditoria-motivo-aviso">
                      <AlertTriangle size={18} aria-hidden="true" />
                      <span>
                        Você está alterando o status de <strong>{statusAtual}</strong> para <strong>{novoStatus}</strong>.
                        O preenchimento do motivo é <u>estritamente obrigatório</u> para auditoria pública.
                      </span>
                    </div>

                    <label htmlFor="textarea-motivo-mudanca" className="modal-auditoria-label">
                      Motivo da Mudança de Status <span className="campo-obrigatorio">*</span>:
                    </label>
                    <textarea
                      id="textarea-motivo-mudanca"
                      rows={3}
                      value={motivo}
                      onChange={(e) => {
                        setMotivo(e.target.value);
                        if (erroValidacao) setErroValidacao('');
                      }}
                      placeholder="Ex: Equipe de drenagem despachada em campo / Solicitação duplicada com protocolo ZEL-0060..."
                      className={`modal-auditoria-textarea ${erroValidacao ? 'tem-erro' : ''}`}
                      required
                    />

                    {erroValidacao && (
                      <p className="modal-auditoria-erro" role="alert">
                        {erroValidacao}
                      </p>
                    )}

                    <div className="modal-auditoria-acoes">
                      <button
                        type="submit"
                        className="modal-btn-confirmar"
                      >
                        <Check size={16} aria-hidden="true" />
                        <span>Confirmar Alteração de Status</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelarAlteracao}
                        className="modal-btn-cancelar"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* 4. HISTÓRICO DE MOVIMENTAÇÕES ANTERIORES (AUDIT LOG) */}
              <div className="modal-historico-wrapper">
                <div className="modal-historico-header">
                  <Clock size={16} aria-hidden="true" />
                  <h3>Histórico de Movimentações Anteriores ({historico_auditoria.length})</h3>
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
                              <span className="transicao-anterior">{item.status_anterior}</span>
                              <span className="transicao-seta">➔</span>
                              <span className="transicao-novo">{item.novo_status}</span>
                            </span>
                          </div>

                          <div className="modal-timeline-servidor">
                            <strong>Responsável:</strong> {item.funcionario}
                          </div>

                          <div className="modal-timeline-motivo">
                            "{item.motivo}"
                          </div>
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

