import React from 'react';
import { render, screen, within, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PainelCidadao from '../pages/PainelCidadao';
import * as api from '../services/api';

jest.mock('../services/api');

const mockListaVazia = {
  sucesso: true,
  dados: [],
};

const mockSolicitacoesReais = {
  sucesso: true,
  dados: [
    {
      id: 'sol-uuid-001',
      protocolo: 'ZELUS-20261026-AAAA',
      descricao: 'Buraco na via',
      subcategorias: { nome: 'Buraco' },
      status: 'Pendente',
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Pradópolis',
      foto_url: null,
      created_at: '2026-10-26T14:00:00.000Z',
    },
    {
      id: 'sol-uuid-002',
      protocolo: 'ZELUS-20261020-BBBB',
      descricao: 'Bueiro entupido',
      subcategorias: { nome: 'Entupido' },
      status: 'Concluído',
      rua: 'Avenida Brasil',
      numero: '456',
      bairro: 'Jardim Paulista',
      cidade: 'Pradópolis',
      foto_url: 'data:image/jpeg;base64,mockfoto',
      created_at: '2026-10-20T10:00:00.000Z',
    },
  ],
};

const renderPainel = () =>
  render(
    <MemoryRouter initialEntries={['/cidadao/painel']}>
      <Routes>
        <Route path="/cidadao/painel" element={<PainelCidadao />} />
        <Route path="/solicitacao/etapa-1" element={<div>Etapa 1 - Categorias</div>} />
        <Route path="/login/cidadao" element={<div>Tela de Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Painel do Cidadão Dinâmico (PainelCidadao.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    localStorage.setItem('zelus_token', 'token-teste');
    localStorage.setItem(
      'zelus_cidadao',
      JSON.stringify({ nome_completo: 'Maria da Silva' })
    );
    api.listarMinhasSolicitacoes.mockResolvedValue(mockSolicitacoesReais);
  });

  test('CT-PNL.1: deve renderizar a lista dinâmica de solicitações da API com protocolos, status e endereços', async () => {
    renderPainel();

    // Aguarda o término do carregamento
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Minhas Solicitações Recentes' })
    ).toBeInTheDocument();

    const lista = screen.getByTestId('lista-solicitacoes');
    const cartoes = within(lista).getAllByRole('listitem');
    expect(cartoes.length).toBe(2);

    // Valida dados da 1ª solicitação (Pendente)
    expect(screen.getByText('Buraco')).toBeInTheDocument();
    expect(screen.getByText('ZELUS-20261026-AAAA')).toBeInTheDocument();
    expect(screen.getByText(/Rua das Flores, 123 - Centro/i)).toBeInTheDocument();

    const badgePendente = screen.getByText(/Pendente/i);
    expect(badgePendente).toHaveClass('badge', 'badge--pendente');

    // Valida dados da 2ª solicitação (Concluído com foto)
    expect(screen.getByText('Entupido')).toBeInTheDocument();
    expect(screen.getByText('ZELUS-20261020-BBBB')).toBeInTheDocument();
    expect(screen.getByText(/Avenida Brasil, 456 - Jardim Paulista/i)).toBeInTheDocument();

    const badgeConcluido = screen.getByText(/Concluído/i);
    expect(badgeConcluido).toHaveClass('badge', 'badge--concluido');
  });

  test('CT-PNL.2: deve renderizar estado de carregamento com Skeletons neobrutalistas enquanto busca solicitações', async () => {
    let resolverPromise;
    api.listarMinhasSolicitacoes.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolverPromise = resolve;
        })
    );

    renderPainel();

    const statusLoading = screen.getByRole('status', {
      name: /Carregando suas solicitações\.\.\./i,
    });
    expect(statusLoading).toBeInTheDocument();

    const skeletons = document.querySelectorAll('.solicitacao-card--skeleton');
    expect(skeletons.length).toBe(3);

    // Conclui promise para finalizar ciclo
    await act(async () => {
      resolverPromise(mockSolicitacoesReais);
    });
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('CT-PNL.3: deve renderizar o Empty State acessível quando a API retornar array vazio e navegar para Etapa 1', async () => {
    api.listarMinhasSolicitacoes.mockResolvedValueOnce(mockListaVazia);

    renderPainel();

    // Aguarda término do loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const regiaoVazia = screen.getByRole('region', { name: /Nenhuma solicitação registrada/i });
    expect(regiaoVazia).toBeInTheDocument();

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeInTheDocument();
    expect(
      screen.getByText(/Você ainda não registrou nenhum chamado de zeladoria urbana/i)
    ).toBeInTheDocument();

    const btnPrimeiraSolicitacao = screen.getByRole('button', {
      name: /Criar minha primeira solicitação de zeladoria/i,
    });
    expect(btnPrimeiraSolicitacao).toBeInTheDocument();

    // Clica no botão e valida navegação para Etapa 1
    fireEvent.click(btnPrimeiraSolicitacao);
    expect(screen.getByText('Etapa 1 - Categorias')).toBeInTheDocument();
  });

  test('CT-PNL.4: deve exibir alerta de erro acessível em falhas de conexão e permitir nova tentativa funcional (Retry)', async () => {
    api.listarMinhasSolicitacoes.mockRejectedValueOnce(new Error('Falha de conexão'));

    renderPainel();

    // Aguarda exibição do alerta
    const alertaErro = await screen.findByRole('alert');
    expect(alertaErro).toBeInTheDocument();
    expect(
      screen.getByText('Não foi possível carregar suas solicitações. Verifique sua conexão e tente novamente.')
    ).toBeInTheDocument();

    const btnRetry = screen.getByRole('button', {
      name: /Tentar carregar solicitações novamente/i,
    });
    expect(btnRetry).toBeInTheDocument();

    // Prepara sucesso pós-retry
    api.listarMinhasSolicitacoes.mockResolvedValueOnce(mockSolicitacoesReais);
    fireEvent.click(btnRetry);

    // Aguarda renderização dos itens após o retry
    const itemCarregado = await screen.findByText('ZELUS-20261026-AAAA');
    expect(itemCarregado).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('CT-PNL.5: deve renderizar a saudação personalizada e botão principal navegando para a Etapa 1', async () => {
    renderPainel();

    expect(
      screen.getByRole('heading', { level: 1, name: /Olá, Maria! 👋/ })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Acompanhe suas solicitações ou abra uma nova.')
    ).toBeInTheDocument();

    const botaoNova = screen.getByRole('button', { name: /\+ NOVA SOLICITAÇÃO 📱/ });
    expect(botaoNova).toBeInTheDocument();

    fireEvent.click(botaoNova);
    expect(screen.getByText('Etapa 1 - Categorias')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('CT-PNL.5: deve usar "Cidadão" como nome padrão quando não houver dados salvos no localStorage', async () => {
    localStorage.removeItem('zelus_cidadao');
    renderPainel();

    expect(
      screen.getByRole('heading', { level: 1, name: /Olá, Cidadão! 👋/ })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('deve aplicar e remover a trava de rolagem do documento (Regra de Ouro)', async () => {
    const { unmount } = renderPainel();

    expect(document.body).toHaveClass('painel-cidadao-ativo');
    expect(document.documentElement).toHaveClass('painel-cidadao-ativo');

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    unmount();
    expect(document.body).not.toHaveClass('painel-cidadao-ativo');
    expect(document.documentElement).not.toHaveClass('painel-cidadao-ativo');
  });
});
