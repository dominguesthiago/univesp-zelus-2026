import React, { useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';
import './ModalAvisoBloqueio.scss';

/**
 * Modal de Aviso Estilizado para Bloqueio de Estados Terminais
 * Exibido quando o operador tenta arrastar solicitações com status "Concluída" ou "Descartada".
 */
const ModalAvisoBloqueio = ({ isOpen = true, visivel = true, onClose, status }) => {
  const btnRef = useRef(null);

  // Foco automático no botão de fechamento
  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.focus();
    }
  }, []);

  // Fechamento via tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !visivel) return null;

  return (
    <div
      className="modal-aviso-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <div
        className="modal-aviso-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-aviso-titulo"
      >
        {/* Cabeçalho */}
        <header className="modal-aviso-header">
          <div className="modal-aviso-header__icone-box">
            <AlertCircle size={22} className="modal-aviso-header__icone" aria-hidden="true" />
          </div>

          <div className="modal-aviso-header__titulos">
            <h2 id="modal-aviso-titulo" className="modal-aviso-header__titulo">
              Ação Bloqueada
            </h2>
            <p className="modal-aviso-header__subtitulo">
              Regra de integridade do fluxo de solicitações
            </p>
          </div>

          <button
            type="button"
            className="modal-aviso-header__fechar"
            onClick={onClose}
            aria-label="Fechar aviso de bloqueio"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Corpo do Modal com a Mensagem Dinâmica */}
        <div className="modal-aviso-body">
          <div className="modal-aviso-mensagem-box">
            <p className="modal-aviso-texto">
              Ação bloqueada: Esta solicitação já consta como <strong>{status}</strong> (Estado terminal) e não pode ser movimentada para outra etapa.
            </p>
          </div>

          {/* Botão Centralizado "Entendi" */}
          <div className="modal-aviso-acoes">
            <button
              ref={btnRef}
              type="button"
              className="modal-aviso-btn-entendi"
              onClick={onClose}
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAvisoBloqueio;

