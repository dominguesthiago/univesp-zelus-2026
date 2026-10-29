import React, { useState, useRef } from 'react';
import CartaoKanban from './CartaoKanban';
import './KanbanColumn.scss';

/**
 * Componente de Coluna Minimalista do Kanban com Drop Zone Interativa
 * - Cabeçalho limpo com título perfeitamente centralizado
 * - Zona de soltura (Drop Zone) com feedback visual sutil de hover
 * - Rolagem vertical exclusiva no corpo de cartões (scroll invisível)
 * - Encaminhamento de eventos de drag para o Custom Drag Layer global
 */
const KanbanColumn = ({
  coluna,
  solicitacoes = [],
  onCardClick,
  onDropCard,
  onCardDragStart,
  onCardDragEnd,
}) => {
  const { id, titulo } = coluna;
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const solicitacaoId = e.dataTransfer.getData('text/plain');
    if (solicitacaoId) {
      onDropCard?.(solicitacaoId, id);
    }
  };

  return (
    <section
      className={`kanban-coluna ${isDragOver ? 'kanban-coluna--drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={`Coluna de status: ${titulo}. Contém ${solicitacoes.length} solicitações.`}
    >
      {/* Cabeçalho Limpo e Fixo (Apenas Título Centralizado) */}
      <header className="kanban-coluna__header">
        <h2 className="kanban-coluna__titulo">{titulo}</h2>
      </header>

      {/* Lista de Cartões com Rolagem Interna Invisível */}
      <div className="kanban-coluna__cards" role="feed" aria-busy="false">
        {solicitacoes.length === 0 ? (
          <div className="kanban-coluna__vazio">
            <p>Nenhuma solicitação</p>
          </div>
        ) : (
          solicitacoes.map((item) => (
            <CartaoKanban
              key={item.id}
              solicitacao={item}
              onClick={onCardClick}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default KanbanColumn;
