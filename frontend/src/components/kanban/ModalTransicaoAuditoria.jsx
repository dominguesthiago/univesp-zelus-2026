import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Check,
  X,
  UserCheck,
  FileText,
} from 'lucide-react';
import './ModalTransicaoAuditoria.scss';

/**
 * Modal de Justificativa de Auditoria para Movimentação via Drag and Drop
 * Intercepta a soltura do cartão em uma nova coluna e exige a justificativa formal
 * antes de persistir a alteração de status no estado da aplicação.
 */
const ModalTransicaoAuditoria = ({ movimentoPendente, onConfirm, onCancel }) => {
  const [motivo, setMotivo] = useState('');
  const [erroValidacao, setErroValidacao] = useState('');
  const textareaRef = useRef(null);

  const solicitacao = movimentoPendente?.solicitacao;
  const statusAnterior = movimentoPendente?.statusAnterior || solicitacao?.status;
  const novoStatus = movimentoPendente?.novoStatus;

  // Foco automático no textarea ao abrir o modal
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Fechamento e cancelamento via tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (!movimentoPendente || !solicitacao) return null;

  // Identificação do servidor responsável
  let nomeFuncionario = 'Servidor Municipal (Matrícula: 4892)';
  try {
    const funcSalvo = localStorage.getItem('zelus_funcionario');
    if (funcSalvo) {
      const parsed = JSON.parse(funcSalvo);
      if (parsed.nome_completo || parsed.nomeCompleto) {
        nomeFuncionario = `${parsed.nome_completo || parsed.nomeCompleto} (Servidor Responsável)`;
      }
    }
  } catch (err) {
    // fallback padrão
  }

  const getStatusSlug = (st) => {
    switch (st) {
      case 'Pendente':
        return 'pendente';
      case 'Em análise':
        return 'analise';
      case 'Em execução':
        return 'execucao';
      case 'Concluída':
        return 'concluida';
      case 'Descartada':
        return 'descartada';
      default:
        return 'default';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!motivo || motivo.trim().length < 5) {
      setErroValidacao('O preenchimento do motivo é obrigatório (mínimo de 5 caracteres) para auditoria.');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    onConfirm(motivo.trim(), nomeFuncionario);
  };

  return (
    <div
      className="modal-transicao-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="presentation"
    >
      <div
        className="modal-transicao-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-transicao-titulo"
      >
        {/* Cabeçalho */}
        <header className="modal-transicao-header">
          <div className="modal-transicao-header__icone-box">
            <ShieldAlert size={22} className="modal-transicao-header__icone" aria-hidden="true" />
          </div>
          <div className="modal-transicao-header__titulos">
            <h2 id="modal-transicao-titulo" className="modal-transicao-header__titulo">
              Auditoria de Movimentação de Status
            </h2>
            <p className="modal-transicao-header__subtitulo">
              A movimentação de coluna exige justificativa formal para rastreabilidade pública.
            </p>
          </div>
          <button
            type="button"
            className="modal-transicao-header__fechar"
            onClick={onCancel}
            aria-label="Cancelar e fechar janela de justificativa"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Resumo da Ocorrência e Transição de Status */}
        <div className="modal-transicao-resumo">
          <div className="modal-transicao-detalhes-item">
            <span className="detalhe-protocolo">{solicitacao.protocolo}</span>
            <strong className="detalhe-subcategoria">{solicitacao.subcategoria}</strong>
            <span className="detalhe-endereco">
              {solicitacao.endereco?.rua}, {solicitacao.endereco?.numero} • {solicitacao.endereco?.bairro}
            </span>
          </div>

          {/* Transição Visual entre os dois status */}
          <div className="modal-transicao-fluxo" aria-label={`Transição de ${statusAnterior} para ${novoStatus}`}>
            <div className={`status-pill status-pill--${getStatusSlug(statusAnterior)}`}>
              <span className="status-pill__rotulo">Status Anterior</span>
              <span className="status-pill__nome">{statusAnterior}</span>
            </div>

            <div className="status-fluxo__seta" aria-hidden="true">
              <ArrowRight size={20} />
            </div>

            <div className={`status-pill status-pill--${getStatusSlug(novoStatus)} status-pill--destaque`}>
              <span className="status-pill__rotulo">Novo Status</span>
              <span className="status-pill__nome">{novoStatus}</span>
            </div>
          </div>
        </div>

        {/* Formulário de Justificativa Obrigatória */}
        <form onSubmit={handleSubmit} className="modal-transicao-form">
          <div className="modal-transicao-aviso">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>
              Ao confirmar, a solicitação será transferida para a coluna <strong>{novoStatus}</strong> e
              este evento será gravado de forma imutável no histórico de auditoria.
            </span>
          </div>

          <div className="modal-transicao-campo">
            <label htmlFor="motivo-transicao-textarea" className="modal-transicao-label">
              Motivo da Mudança de Status <span className="campo-obrigatorio">*</span>:
            </label>
            <textarea
              id="motivo-transicao-textarea"
              ref={textareaRef}
              rows={3}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (erroValidacao) setErroValidacao('');
              }}
              placeholder="Ex: Ordem de serviço aberta e despachada para equipe de campo / Ocorrência duplicada conferida..."
              className={`modal-transicao-textarea ${erroValidacao ? 'tem-erro' : ''}`}
              required
            />
            {erroValidacao && (
              <p className="modal-transicao-erro" role="alert">
                {erroValidacao}
              </p>
            )}
          </div>

          {/* Identificação do Operador */}
          <div className="modal-transicao-servidor">
            <UserCheck size={15} aria-hidden="true" />
            <span>Responsável pelo registro: <strong>{nomeFuncionario}</strong></span>
          </div>

          {/* Ações do Modal */}
          <footer className="modal-transicao-acoes">
            <button
              type="button"
              className="btn-transicao-cancelar"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-transicao-confirmar"
            >
              <Check size={16} aria-hidden="true" />
              <span>Confirmar e Mover</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalTransicaoAuditoria;

