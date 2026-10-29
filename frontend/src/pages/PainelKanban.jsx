import React, { useState, useMemo, useEffect } from 'react';
import Footer from '../components/Footer';
import { MOCK_SOLICITACOES, COLUNAS_KANBAN } from '../data/mockSolicitacoes';
import KanbanColumn from '../components/kanban/KanbanColumn';
import SolicitacaoModal from '../components/kanban/SolicitacaoModal';
import ModalTransicaoAuditoria from '../components/kanban/ModalTransicaoAuditoria';
import './PainelKanban.scss';

/**
 * Painel de Solicitações (Kanban) — Back-office ZELUS
 * Interface minimalista com 5 colunas estritas e color-coding pastel nos cartões.
 * Barra superior centralizada e expandida com todas as métricas em ordem exata:
 * TOTAL, PENDENTES, EM ANÁLISE, EM EXECUÇÃO, CONCLUÍDAS e DESCARTADAS.
 *
 * Suporte a Drag and Drop com Custom Drag Layer (100% Sólido):
 * - Imagem de arraste nativa transparente é anulada com pixel 1x1.
 * - Um clone flutuante fixo rastreia continuamente o cursor do mouse com 100% de opacidade.
 * - Slot original permanece como moldura oca tracejada indicativa.
 * - Interceptação obrigatória de auditoria com justificativa ao soltar em nova coluna.
 */
const PainelKanban = () => {
  // Estado local com os dados mockados de solicitações (reativo a transições)
  const [solicitacoes, setSolicitacoes] = useState(MOCK_SOLICITACOES);
  const [solicitacaoAtiva, setSolicitacaoAtiva] = useState(null);

  // Estado para armazenar intenção temporária de movimento via Drag and Drop
  const [movimentoPendente, setMovimentoPendente] = useState(null);

  // Estados para o Custom Drag Layer (rastreamento do mouse e cartão segurado)
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 20, y: 20, width: 220 });

  // Agrupamento estrito por coluna de status
  const solicitacoesPorColuna = useMemo(() => {
    const mapa = {
      Pendente: [],
      'Em análise': [],
      'Em execução': [],
      Concluída: [],
      Descartada: [],
    };

    solicitacoes.forEach((item) => {
      if (mapa[item.status]) {
        mapa[item.status].push(item);
      } else {
        mapa.Pendente.push(item);
      }
    });

    return mapa;
  }, [solicitacoes]);

  // Atualização auditada de status
  const handleUpdateStatus = (solicitacaoId, novoStatus, motivo, funcionario) => {
    setSolicitacoes((prev) =>
      prev.map((item) => {
        if (item.id !== solicitacaoId) return item;

        const novoRegistroAuditoria = {
          id: `aud-${Date.now()}`,
          data_hora: new Date().toISOString(),
          funcionario: funcionario || 'Servidor Municipal (Matrícula: 4892)',
          status_anterior: item.status,
          novo_status: novoStatus,
          motivo: motivo,
        };

        const atualizado = {
          ...item,
          status: novoStatus,
          historico_auditoria: [
            ...(item.historico_auditoria || []),
            novoRegistroAuditoria,
          ],
        };

        // Atualiza a solicitação ativa no modal de detalhes se for a mesma
        if (solicitacaoAtiva && solicitacaoAtiva.id === solicitacaoId) {
          setSolicitacaoAtiva(atualizado);
        }

        return atualizado;
      })
    );
  };

  // Início do arraste: registra dados para o Custom Drag Layer
  const handleCardDragStart = (solicitacao, meta) => {
    setDraggedCard(solicitacao);
    setDragPosition({ x: meta.x, y: meta.y });
    setDragOffset({
      x: meta.offsetX,
      y: meta.offsetY,
      width: meta.width,
    });
  };

  // Término do arraste: limpa o Custom Drag Layer
  const handleCardDragEnd = () => {
    setDraggedCard(null);
    setDragPosition(null);
  };

  // Rastreamento contínuo do mouse durante o arraste
  useEffect(() => {
    if (!draggedCard) return;

    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalDragEnd = () => {
      setDraggedCard(null);
      setDragPosition(null);
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [draggedCard]);

  // Interceptação do Drop: Valida se a coluna é diferente e solicita justificativa
  const handleDropCard = (solicitacaoId, novoStatus) => {
    setDraggedCard(null);
    setDragPosition(null);

    const item = solicitacoes.find((s) => s.id === solicitacaoId);
    if (!item) return;

    // Se soltar na mesma coluna de origem, não executa transição
    if (item.status === novoStatus) return;

    // Intercepta a transição e abre o modal de auditoria
    setMovimentoPendente({
      solicitacao: item,
      novoStatus: novoStatus,
      statusAnterior: item.status,
    });
  };

  // Confirmação do movimento após preenchimento do motivo no modal
  const handleConfirmarTransicao = (motivo, funcionario) => {
    if (!movimentoPendente) return;
    const { solicitacao, novoStatus } = movimentoPendente;

    handleUpdateStatus(solicitacao.id, novoStatus, motivo, funcionario);
    setMovimentoPendente(null);
  };

  // Cancelamento do movimento (cartão permanece na coluna original)
  const handleCancelarTransicao = () => {
    setMovimentoPendente(null);
  };

  // Mapeamento auxiliar para classe semântica de cor pastel
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

  // Formatação de data em pt-BR
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

  // Contadores de totais globais (únicos responsáveis pela contagem no painel)
  const totalGeral = solicitacoes.length;
  const totalPendentes = solicitacoesPorColuna['Pendente']?.length || 0;
  const totalAnalise = solicitacoesPorColuna['Em análise']?.length || 0;
  const totalExecucao = solicitacoesPorColuna['Em execução']?.length || 0;
  const totalConcluidas = solicitacoesPorColuna['Concluída']?.length || 0;
  const totalDescartadas = solicitacoesPorColuna['Descartada']?.length || 0;

  return (
    <div
      className="painel-kanban-page"
      id="conteudo-principal"
      onDragOver={(e) => {
        e.preventDefault();
        if (draggedCard) {
          setDragPosition({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {/* Barra de Totais Globais Centralizada e Expandida */}
      <aside className="kanban-toolbar" aria-label="Resumo operacional de ocorrências">
        <div className="kanban-toolbar__container">
          <div className="kanban-toolbar__metricas">
            <div className="metrica-item metrica-item--total">
              <span className="metrica-rotulo">TOTAL</span>
              <span className="metrica-valor">{totalGeral}</span>
            </div>
            <div className="metrica-item metrica-item--pendente">
              <span className="metrica-rotulo">PENDENTES</span>
              <span className="metrica-valor">{totalPendentes}</span>
            </div>
            <div className="metrica-item metrica-item--analise">
              <span className="metrica-rotulo">EM ANÁLISE</span>
              <span className="metrica-valor">{totalAnalise}</span>
            </div>
            <div className="metrica-item metrica-item--execucao">
              <span className="metrica-rotulo">EM EXECUÇÃO</span>
              <span className="metrica-valor">{totalExecucao}</span>
            </div>
            <div className="metrica-item metrica-item--concluida">
              <span className="metrica-rotulo">CONCLUÍDAS</span>
              <span className="metrica-valor">{totalConcluidas}</span>
            </div>
            <div className="metrica-item metrica-item--descartada">
              <span className="metrica-rotulo">DESCARTADAS</span>
              <span className="metrica-valor">{totalDescartadas}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Quadro Kanban Estrito de 5 Colunas (Zero rolagem na janela principal) */}
      <main className="kanban-quadro-wrapper" tabIndex={-1}>
        <div
          className="kanban-quadro"
          role="region"
          aria-label="Quadro Kanban de solicitações operacionais"
        >
          {COLUNAS_KANBAN.map((coluna) => (
            <KanbanColumn
              key={coluna.id}
              coluna={coluna}
              solicitacoes={solicitacoesPorColuna[coluna.id] || []}
              onCardClick={(solicitacao) => setSolicitacaoAtiva(solicitacao)}
              onDropCard={handleDropCard}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
            />
          ))}
        </div>
      </main>

      {/* Rodapé Global */}
      <Footer />

      {/* Custom Drag Layer: Clone Flutuante 100% Sólido preso ao cursor */}
      {draggedCard && dragPosition && (
        <div
          className="kanban-drag-overlay"
          style={{
            position: 'fixed',
            left: `${dragPosition.x - dragOffset.x}px`,
            top: `${dragPosition.y - dragOffset.y}px`,
            width: `${dragOffset.width}px`,
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          aria-hidden="true"
        >
          <article
            className={`cartao-kanban cartao-kanban--${getStatusSlug(draggedCard.status)} cartao-kanban--flutuante`}
          >
            {/* Topo: Protocolo */}
            <div className="cartao-kanban__topo">
              <span className="cartao-kanban__protocolo">{draggedCard.protocolo}</span>
            </div>

            {/* Conteúdo: Subcategoria e Endereço Resumido */}
            <div className="cartao-kanban__conteudo">
              <h3 className="cartao-kanban__subcategoria" title={draggedCard.subcategoria}>
                {draggedCard.subcategoria}
              </h3>
              <p
                className="cartao-kanban__endereco"
                title={`${draggedCard.endereco?.rua}, ${draggedCard.endereco?.numero} - ${draggedCard.endereco?.bairro}`}
              >
                {draggedCard.endereco?.rua}, {draggedCard.endereco?.numero} • {draggedCard.endereco?.bairro}
              </p>
            </div>

            {/* Base: Data de Registro (Alinhada à direita) */}
            <div className="cartao-kanban__base">
              <time className="cartao-kanban__data">
                {formatarData(draggedCard.created_at)}
              </time>
            </div>
          </article>
        </div>
      )}

      {/* Modal Focado de Auditoria para Movimentação via Drag and Drop */}
      {movimentoPendente && (
        <ModalTransicaoAuditoria
          movimentoPendente={movimentoPendente}
          onConfirm={handleConfirmarTransicao}
          onCancel={handleCancelarTransicao}
        />
      )}

      {/* Modal Acessível de Detalhes Completos e Auditoria */}
      {solicitacaoAtiva && (
        <SolicitacaoModal
          solicitacao={solicitacaoAtiva}
          onClose={() => setSolicitacaoAtiva(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default PainelKanban;
