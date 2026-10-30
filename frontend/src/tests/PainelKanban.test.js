import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import PainelKanban from '../pages/PainelKanban';
import * as apiService from '../services/api';

jest.mock('../services/api');

const MOCK_API_SOLICITACOES = [
  {
    id: 'sol-001',
    protocolo: 'ZEL-2026-0101',
    status: 'Pendente',
    descricao: 'Buraco no Asfalto na faixa da direita',
    rua: 'Av. Paulista',
    numero: '1578',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    latitude: -23.561414,
    longitude: -46.655881,
    created_at: '2026-10-29T08:15:00.000Z',
    subcategorias: { nome: 'Buraco no Asfalto' },
    cidadaos: {
      nome_completo: 'Mariana Silveira Ramos',
      cpf: '342.***.***-18',
      whatsapp: '(11) 98712-3456',
      email: 'mariana@email.com',
    },
  },
  {
    id: 'sol-011',
    protocolo: 'ZEL-2026-0111',
    status: 'Em análise',
    descricao: 'Vistoria técnica em andamento',
    rua: 'Rua Augusta',
    numero: '500',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    latitude: -23.553924,
    longitude: -46.657012,
    created_at: '2026-10-29T08:30:00.000Z',
    subcategorias: { nome: 'Vistoria de Bueiro' },
    cidadaos: {
      nome_completo: 'Carlos Eduardo',
      cpf: '123.***.***-00',
      whatsapp: '(11) 91234-5678',
      email: 'carlos@email.com',
    },
  },
  {
    id: 'sol-021',
    protocolo: 'ZEL-2026-0121',
    status: 'Em execução',
    descricao: 'Equipe em campo executando reparo',
    rua: 'Rua Bela Cintra',
    numero: '200',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    latitude: -23.55214,
    longitude: -46.65321,
    created_at: '2026-10-29T09:00:00.000Z',
    subcategorias: { nome: 'Recapeamento' },
    cidadaos: {
      nome_completo: 'Ana Paula',
      cpf: '456.***.***-11',
      whatsapp: '(11) 99887-7665',
      email: 'ana@email.com',
    },
  },
  {
    id: 'sol-031',
    protocolo: 'ZEL-2026-0131',
    status: 'Concluída',
    descricao: 'Serviço finalizado com sucesso',
    rua: 'Alameda Santos',
    numero: '780',
    bairro: 'Cerqueira César',
    cidade: 'São Paulo',
    latitude: -23.56789,
    longitude: -46.65342,
    created_at: '2026-10-29T09:25:00.000Z',
    subcategorias: { nome: 'Poda com Risco na Fiação' },
    cidadaos: {
      nome_completo: 'Patricia Mendes Prado',
      cpf: '301.***.***-70',
      whatsapp: '(11) 99221-5544',
      email: 'patricia.prado@email.com',
    },
  },
  {
    id: 'sol-041',
    protocolo: 'ZEL-2026-0141',
    status: 'Descartada',
    descricao: 'Solicitação duplicada descartada',
    rua: 'Rua Teodoro Sampaio',
    numero: '1420',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    latitude: -23.560124,
    longitude: -46.681145,
    created_at: '2026-10-29T10:00:00.000Z',
    subcategorias: { nome: 'Descarte Irregular de Entulho' },
    cidadaos: {
      nome_completo: 'Clara Beatriz Vasconcelos',
      cpf: '215.***.***-89',
      whatsapp: '(11) 99120-4478',
      email: 'clara@email.com',
    },
  },
];

describe('Página PainelKanban - Integração Assíncrona e Regras de Negócio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiService.listarSolicitacoesAdmin.mockResolvedValue({
      sucesso: true,
      mensagem: 'Solicitações listadas com sucesso.',
      dados: MOCK_API_SOLICITACOES,
    });
    apiService.atualizarStatusSolicitacao.mockResolvedValue({
      sucesso: true,
      mensagem: 'Status atualizado com sucesso.',
      dados: { id: 'sol-001', status: 'Em análise' },
    });
  });

  test('deve exibir indicador de carregamento inicial (loading state)', () => {
    apiService.listarSolicitacoesAdmin.mockReturnValue(new Promise(() => {}));
    render(<PainelKanban />);

    expect(screen.getByText('Carregando solicitações do painel...')).toBeInTheDocument();
  });

  test('deve exibir mensagem de erro amigável se a requisição à API falhar', async () => {
    apiService.listarSolicitacoesAdmin.mockRejectedValueOnce(
      new Error('Erro de conexão com o banco de dados')
    );

    render(<PainelKanban />);

    await waitFor(() => {
      expect(
        screen.getByText('Erro de conexão com o banco de dados')
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument();
  });

  test('deve renderizar o quadro Kanban com as 5 colunas estritas e dados reais após carregamento', async () => {
    render(<PainelKanban />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando solicitações do painel...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getByText('PENDENTES')).toBeInTheDocument();
    expect(screen.getByText('EM ANÁLISE')).toBeInTheDocument();
    expect(screen.getByText('EM EXECUÇÃO')).toBeInTheDocument();
    expect(screen.getByText('CONCLUÍDAS')).toBeInTheDocument();
    expect(screen.getByText('DESCARTADAS')).toBeInTheDocument();

    // Verifica presença dos cartões mockados da API
    expect(screen.getByText('ZEL-2026-0101')).toBeInTheDocument();
    expect(screen.getByText('ZEL-2026-0131')).toBeInTheDocument();
  });

  test('deve bloquear a transição via Drop de uma solicitação com status "Concluída" e exibir o ModalAvisoBloqueio', async () => {
    render(<PainelKanban />);

    await waitFor(() => {
      expect(screen.getByText('ZEL-2026-0131')).toBeInTheDocument();
    });

    // Localiza a coluna de destino "Em execução"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Em execução/i);

    // Simula a soltura (drop) do chamado "sol-031" (Concluída)
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

  test('deve bloquear a transição via Drop de uma solicitação com status "Descartada" e exibir o ModalAvisoBloqueio', async () => {
    render(<PainelKanban />);

    await waitFor(() => {
      expect(screen.getByText('ZEL-2026-0141')).toBeInTheDocument();
    });

    // Localiza a coluna de destino "Pendente"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Pendente/i);

    // Simula a soltura (drop) do chamado "sol-041" (Descartada)
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

  test('deve permitir a transição via Drop para status não-terminais e chamar a API PATCH ao confirmar', async () => {
    render(<PainelKanban />);

    await waitFor(() => {
      expect(screen.getByText('ZEL-2026-0101')).toBeInTheDocument();
    });

    // Localiza a coluna de destino "Em análise"
    const colunaDestino = screen.getByLabelText(/Coluna de status: Em análise/i);

    // Simula a soltura (drop) do chamado "sol-001" (Pendente)
    fireEvent.drop(colunaDestino, {
      dataTransfer: {
        getData: (key) => (key === 'text/plain' ? 'sol-001' : ''),
      },
    });

    // O modal focado de auditoria deve ser aberto
    expect(screen.getByText('Auditoria de Movimentação de Status')).toBeInTheDocument();

    // Preenche o motivo de auditoria no textarea
    const textarea = screen.getByLabelText(/Motivo da Mudança de Status/i);
    fireEvent.change(textarea, {
      target: { value: 'Iniciando análise técnica da solicitação de buraco' },
    });

    // Clica no botão "Confirmar e Mover"
    const btnConfirmar = screen.getByRole('button', { name: /Confirmar e Mover/i });
    fireEvent.click(btnConfirmar);

    // Garante que a API PATCH foi acionada com os parâmetros corretos
    await waitFor(() => {
      expect(apiService.atualizarStatusSolicitacao).toHaveBeenCalledWith(
        'sol-001',
        expect.objectContaining({
          status: 'Em análise',
          justificativa_status: 'Iniciando análise técnica da solicitação de buraco',
        })
      );
    });
  });

  test('deve preservar a visualização (abrir SolicitacaoModal) ao clicar em um cartão com status Concluída', async () => {
    render(<PainelKanban />);

    await waitFor(() => {
      expect(screen.getByText('ZEL-2026-0131')).toBeInTheDocument();
    });

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
