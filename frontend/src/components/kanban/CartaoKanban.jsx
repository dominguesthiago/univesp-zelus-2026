import React, { useState, useRef } from 'react';
import './CartaoKanban.scss';

/**
 * Componente de Cartão Minimalista do Kanban com Color-Coding Pastel e Drag and Drop
 * Paleta Categórica Dinâmica:
 * - Pendente: #EDE194
 * - Em análise: #BCDCF4
 * - Em execução: #F9B188
 * - Concluída: #D4E4BC
 * - Descartada: #ECC4BC
 *
 * Integração com Custom Drag Layer (100% Sólido):
 * - Ghost image nativa desabilitada com pixel transparente 1x1.
 * - Disparo de evento onDragStart transmitindo coordenadas e dimensões para o Drag Layer global.
 * - Slot de origem transformado em moldura oca ("buraco vazio"), ocultando todo o conteúdo interno.
 * - Proteção contra disparo acidental de clique pós-arraste.
 */
const CartaoKanban = ({ solicitacao, onClick, onDragStart, onDragEnd }) => {
  const {
    protocolo,
    status,
    subcategoria,
    endereco,
    created_at,
  } = solicitacao;

  const [isDragging, setIsDragging] = useState(false);
  const wasDraggedRef = useRef(false);

  // Formatação de data em pt-BR (ex: 29/10/2026)
  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    try {
      const data = new Date(dataIso);
      if (isNaN(data.getTime())) return dataIso;
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataIso;
    }
  };

  // Mapeamento para classe semântica de cor pastel
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

  const handleDragStart = (e) => {
    wasDraggedRef.current = true;
    e.dataTransfer.setData('text/plain', solicitacao.id);
    e.dataTransfer.effectAllowed = 'move';

    // 1. Desabilita completamente a imagem fantasma nativa transparente injetando um pixel transparente
    const dragImg = new Image();
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImg, 0, 0);

    // Calcula dimensões e deslocamento relativo para compensar a posição do cursor
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Notifica o Custom Drag Layer global com dados e dimensões exatas do cartão
    onDragStart?.(solicitacao, {
      x: e.clientX,
      y: e.clientY,
      offsetX: offsetX,
      offsetY: offsetY,
      width: rect.width,
    });

    // Transforma o slot de origem em moldura oca vazia
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    onDragEnd?.(solicitacao);
    // Suprime o clique se o evento disparar logo após soltar o cartão
    setTimeout(() => {
      wasDraggedRef.current = false;
    }, 120);
  };

  const handleClick = (e) => {
    if (wasDraggedRef.current) return;
    onClick?.(solicitacao);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(solicitacao);
    }
  };

  const statusSlug = getStatusSlug(status);

  return (
    <article
      className={`cartao-kanban cartao-kanban--${statusSlug} ${
        isDragging ? 'cartao-kanban--dragging' : ''
      }`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Solicitação ${protocolo}: ${subcategoria} em ${endereco?.rua || 'endereço não informado'}. Status: ${status}. Arraste para mover de coluna ou clique para abrir detalhes e auditoria.`}
    >
      {/* Topo: Apenas Protocolo */}
      <div className="cartao-kanban__topo">
        <span className="cartao-kanban__protocolo">{protocolo}</span>
      </div>

      {/* Conteúdo: Subcategoria e Endereço Resumido */}
      <div className="cartao-kanban__conteudo">
        <h3 className="cartao-kanban__subcategoria" title={subcategoria}>
          {subcategoria}
        </h3>
        <p
          className="cartao-kanban__endereco"
          title={`${endereco?.rua}, ${endereco?.numero} - ${endereco?.bairro}`}
        >
          {endereco?.rua}, {endereco?.numero} • {endereco?.bairro}
        </p>
      </div>

      {/* Base: Data de Registro (Alinhada à direita) */}
      <div className="cartao-kanban__base">
        <time className="cartao-kanban__data" dateTime={created_at}>
          {formatarData(created_at)}
        </time>
      </div>
    </article>
  );
};

export default CartaoKanban;
