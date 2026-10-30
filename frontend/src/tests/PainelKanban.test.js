import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import PainelKanban from '../pages/PainelKanban';

describe('Página PainelKanban - Regras de Integridade e Estados Terminais', () => {
  test('deve renderizar o quadro Kanban com as 5 colunas estritas', () => {
    render(<PainelKanban />);

    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getByText('PENDENTES')).toBeInTheDocument();
    expect(screen.getByText('EM ANÁLISE')).toBeInTheDocument();
    expect(screen.getByText('EM EXECUÇÃO')).toBeInTheDocument();
    expect(screen.getByText('CONCLUÍDAS')).toBeInTheDocument();
    expect(screen.getByText('DESCARTADAS')).toBeInTheDocument();
  });

  test('deve bloquear a transição via Drop de uma solicitação com status "Concluída" e exibir o ModalAvisoBloqueio', () => {
    render(<PainelKanban />);

    // Localiza a coluna de destino "Em execução"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Em execução/i);

    // Simula a soltura (drop) do chamado "sol-031" (que possui status Concluída)
    fireEvent.drop(colunaDestino, {
      dataTransfer: {
        getData: (key) => (key === 'text/plain' ? 'sol-031' : ''),
      },
    });

    // O modal de aviso estilizado deve ser exibido com a mensagem dinâmica de bloqueio
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Ação Bloqueada')).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      'Ação bloqueada: Esta solicitação já consta como Concluída (Estado terminal) e não pode ser movimentada para outra etapa.'
    );

    // O modal de auditoria NÃO deve ser aberto
    expect(screen.queryByText('Auditoria de Movimentação de Status')).not.toBeInTheDocument();

    // Fecha o modal pelo botão "Entendi"
    fireEvent.click(screen.getByRole('button', { name: /Entendi/i }));
    expect(screen.queryByText('Ação Bloqueada')).not.toBeInTheDocument();
  });

  test('deve bloquear a transição via Drop de uma solicitação com status "Descartada" e exibir o ModalAvisoBloqueio', () => {
    render(<PainelKanban />);

    // Localiza a coluna de destino "Pendente"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Pendente/i);

    // Simula a soltura (drop) do chamado "sol-041" (que possui status Descartada)
    fireEvent.drop(colunaDestino, {
      dataTransfer: {
        getData: (key) => (key === 'text/plain' ? 'sol-041' : ''),
      },
    });

    // O modal de aviso estilizado deve ser exibido com a mensagem dinâmica para Descartada
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Ação Bloqueada')).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      'Ação bloqueada: Esta solicitação já consta como Descartada (Estado terminal) e não pode ser movimentada para outra etapa.'
    );

    // O modal de auditoria NÃO deve ser aberto
    expect(screen.queryByText('Auditoria de Movimentação de Status')).not.toBeInTheDocument();
  });

  test('deve permitir a transição via Drop para status não-terminais, abrindo o modal de auditoria', () => {
    render(<PainelKanban />);

    // Localiza a coluna de destino "Em análise"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Em análise/i);

    // Simula a soltura (drop) do chamado "sol-001" (status Pendente)
    fireEvent.drop(colunaDestino, {
      dataTransfer: {
        getData: (key) => (key === 'text/plain' ? 'sol-001' : ''),
      },
    });

    // O modal focado de auditoria deve ser aberto para justificar o movimento
    expect(screen.getByText('Auditoria de Movimentação de Status')).toBeInTheDocument();
    expect(screen.queryByText('Ação Bloqueada')).not.toBeInTheDocument();
  });

  test('deve preservar a visualização (abrir SolicitacaoModal) ao clicar em um cartão com status Concluída', () => {
    render(<PainelKanban />);

    // Localiza o cartão pelo protocolo ZEL-2026-0131 (Concluída)
    const cartaoConcluido = screen.getByLabelText(/Solicitação ZEL-2026-0131.*Status: Concluída/i);
    fireEvent.click(cartaoConcluido);

    // O modal de detalhes da solicitação deve ser aberto normalmente para consulta
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('ZEL-2026-0131')).toBeInTheDocument();
    expect(within(dialog).getByText('Endereço da Solicitação')).toBeInTheDocument();
    expect(within(dialog).getByText('Solicitante:')).toBeInTheDocument();
  });
});
