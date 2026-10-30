import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Footer from '../components/Footer';
import { COLUNAS_KANBAN, normalizarStatus, normalizarSolicitacao } from '../utils/statusMapper';
import { listarSolicitacoesAdmin, atualizarStatusSolicitacao } from '../services/api';
import KanbanColumn from '../components/kanban/KanbanColumn';
import SolicitacaoModal from '../components/kanban/SolicitacaoModal';
import ModalTransicaoAuditoria from '../components/kanban/ModalTransicaoAuditoria';
import ModalAvisoBloqueio from '../components/kanban/ModalAvisoBloqueio';
import './PainelKanban.scss';

/**
 * Painel de Solicitações (Kanban) — Back-office ZELUS
 * Interface minimalista com 5 colunas estritas e color-coding pastel nos cartões.
 * Barra superior centralizada e expandida com todas as métricas em ordem exata:
 * TOTAL, PENDENTES, EM ANÁLISE, EM EXECUÇÃO, CONCLUÍDAS e DESCARTADAS.
 *
 * Integração com API REST e Supabase:
 * - Leitura em tempo real das solicitações da prefeitura.
 * - Normalizador resiliente de status (escudo contra inconsistências de banco).
 * - Suporte a Drag and Drop com Custom Drag Layer (100% Sólido).
 * - Interceptação obrigatória de auditoria com justificativa e persistência PATCH no backend.
 */
const PainelKanban = () => {
  // Estado principal com os dados reais de solicitações
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [, setAtualizandoId] = useState(null);

  const [solicitacaoAtiva, setSolicitacaoAtiva] = useState(null);

  // Estado para armazenar intenção temporária de movimento via Drag and Drop
  const [movimentoPendente, setMovimentoPendente] = useState(null);

  // Estado para controlar o modal estilizado de aviso de bloqueio em estados terminais
  const [avisoBloqueio, setAvisoBloqueio] = useState({ visivel: false, status: '' });

  // Estados para o Custom Drag Layer (rastreamento do mouse e cartão segurado)
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 20, y: 20, width: 220 });

  // Carregamento de dados reais da API
  const carregarSolicitacoes = useCallback(async () => {
    try {
      setCarregando(true);
      setErroCarregamento(null);
      const resposta = await listarSolicitacoesAdmin();
      const listaBruta = Array.isArray(resposta?.dados) ? resposta.dados : [];
      const listaNormalizada = listaBruta.map(normalizarSolicitacao);
      setSolicitacoes(listaNormalizada);
    } catch (err) {
      console.error('Erro ao carregar solicitações reais do Kanban:', err);
      setErroCarregamento(
        err.message || 'Não foi possível carregar as solicitações do servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

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
      const statusFinal = normalizarStatus(item.status);
      if (mapa[statusFinal]) {
        mapa[statusFinal].push(item);
      } else {
        mapa.Pendente.push(item);
      }
    });

    return mapa;
  }, [solicitacoes]);

  // Atualização auditada de status via PATCH na API
  const handleUpdateStatus = async (solicitacaoId, novoStatus, motivo, funcionario) => {
    try {
      setAtualizandoId(solicitacaoId);
      const statusNormalizado = normalizarStatus(novoStatus);

      // Chamada real ao backend via PATCH
      await atualizarStatusSolicitacao(solicitacaoId, {
        status: statusNormalizado,
        justificativa_status: motivo,
        justificativa: motivo,
      });

      // Sucesso: atualiza o estado local do Kanban
      setSolicitacoes((prev) =>
        prev.map((item) => {
          if (item.id !== solicitacaoId) return item;

          const novoRegistroAuditoria = {
            id: `aud-${Date.now()}`,
            data_hora: new Date().toISOString(),
            funcionario: funcionario || 'Servidor Municipal (Matrícula: 4892)',
            status_anterior: item.status,
            novo_status: statusNormalizado,
            motivo: motivo,
          };

          const atualizado = {
            ...item,
            status: statusNormalizado,
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
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status da solicitação:', err);
      window.alert(
        `Falha ao atualizar o status da solicitação: ${
          err.message || 'Erro de comunicação com o servidor.'
        }`
      );
      return false;
    } finally {
      setAtualizandoId(null);
    }
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

  // Interceptação do Drop: Valida regras de negócio e solicita justificativa
  const handleDropCard = (solicitacaoId, novoStatus) => {
    setDraggedCard(null);
    setDragPosition(null);

    const item = solicitacoes.find((s) => s.id === solicitacaoId);
    if (!item) return;

    // Se soltar na mesma coluna de origem, não executa transição
    if (item.status === novoStatus) return;

    // Regra de Integridade: Bloqueio de Estados Terminais ("Concluída" ou "Descartada")
    if (item.status === 'Concluída' || item.status === 'Descartada') {
      setAvisoBloqueio({ visivel: true, status: item.status });
      return;
    }

    // Intercepta a transição e abre o modal de auditoria
    setMovimentoPendente({
      solicitacao: item,
      novoStatus: novoStatus,
      statusAnterior: item.status,
    });
  };

  // Confirmação do movimento após preenchimento do motivo no modal
  const handleConfirmarTransicao = async (motivo, funcionario) => {
    if (!movimentoPendente) return;
    const { solicitacao, novoStatus } = movimentoPendente;

    setMovimentoPendente(null);
    await handleUpdateStatus(solicitacao.id, novoStatus, motivo, funcionario);
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

      {/* Banner de Erro de Conexão com o Servidor */}
      {erroCarregamento && (
        <div className="kanban-error-banner" role="alert">
          <div className="kanban-error-banner__content">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{erroCarregamento}</span>
          </div>
          <button
            type="button"
            className="kanban-error-banner__btn"
            onClick={carregarSolicitacoes}
          >
            <RefreshCw size={13} aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Quadro Kanban Estrito de 5 Colunas (Zero rolagem na janela principal) */}
      <main className="kanban-quadro-wrapper" tabIndex={-1}>
        {carregando ? (
          <div className="kanban-loading-state" role="status" aria-live="polite">
            <Loader2 size={32} className="kanban-spinner" aria-hidden="true" />
            <span>Carregando solicitações do painel...</span>
          </div>
        ) : (
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
        )}
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

      {/* Modal Estilizado de Aviso para Bloqueio de Estados Terminais */}
      {avisoBloqueio.visivel && (
        <ModalAvisoBloqueio
          status={avisoBloqueio.status}
          onClose={() => setAvisoBloqueio({ visivel: false, status: '' })}
        />
      )}
    </div>
  );
};

export default PainelKanban;
