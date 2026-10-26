import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoStep1, { CATEGORIAS } from '../pages/NovaSolicitacaoStep1';
import PainelCidadao from '../pages/PainelCidadao';
import * as api from '../services/api';

jest.mock('../services/api');

const mockCategoriasDb = {
  sucesso: true,
  dados: [
    {
      id: 'a1b2c3d4-0001-4000-8000-000000000001',
      nome: 'Asfalto',
      subcategorias: [
        { id: 'b1b2c3d4-0001-4000-8000-000000000001', nome: 'Buraco' },
      ],
    },
    {
      id: 'a1b2c3d4-0002-4000-8000-000000000002',
      nome: 'Bueiro / Boca de lobo',
      subcategorias: [
        { id: 'b1b2c3d4-0002-4000-8000-000000000002', nome: 'Entupido' },
        { id: 'b1b2c3d4-0003-4000-8000-000000000003', nome: 'Tampa quebrada / sem tampa' },
      ],
    },
  ],
};

const renderStep1 = () =>
  render(
    <MemoryRouter initialEntries={['/solicitacao/etapa-1']}>
      <Routes>
        <Route path="/solicitacao/etapa-1" element={<NovaSolicitacaoStep1 />} />
        <Route path="/cidadao/painel" element={<div>Painel do Cidadão</div>} />
        <Route path="/solicitacao/etapa-2" element={<div>Etapa 2 - Subcategorias</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Nova Solicitação - Etapa 1: Categorias Dinâmicas (NovaSolicitacaoStep1.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    api.listarCategorias.mockResolvedValue(mockCategoriasDb);
  });

  test('deve renderizar o cabeçalho institucional com marca ZELUS e botão "< Voltar" para o painel', async () => {
    renderStep1();

    const linkVoltar = screen.getByRole('link', { name: /Voltar para o Painel do Cidadão/i });
    expect(linkVoltar).toBeInTheDocument();
    expect(linkVoltar).toHaveAttribute('href', '/cidadao/painel');

    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toHaveStyle({ color: '#ffffff' });
  });

  test('deve renderizar o título da pergunta e a indicação textual "Etapa 1 de 4"', async () => {
    renderStep1();

    const tituloPrincipal = screen.getByRole('heading', {
      level: 1,
      name: /Qual solicitação deseja criar\?/i,
    });
    expect(tituloPrincipal).toBeInTheDocument();
    expect(screen.getByText('Etapa 1 de 4')).toBeInTheDocument();
  });

  test('CT-CAT.2: deve renderizar estado de carregamento com Skeletons e acessibilidade enquanto busca categorias', async () => {
    // Promise pendente simulando latência de rede
    api.listarCategorias.mockImplementation(() => new Promise(() => {}));

    renderStep1();

    const statusCarregando = screen.getByRole('status', {
      name: /Carregando categorias disponíveis\.\.\./i,
    });
    expect(statusCarregando).toBeInTheDocument();
    expect(screen.getByText('Carregando categorias...')).toBeInTheDocument();

    const skeletons = document.querySelectorAll('.categoria-card--skeleton');
    expect(skeletons.length).toBe(3);
  });

  test('CT-CAT.1: deve carregar dados da API e renderizar categorias com assets visuais e badges de construção', async () => {
    renderStep1();

    // Aguarda o término do carregamento
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Asfalto')).toBeInTheDocument();
    expect(screen.getByText('Bueiro / Boca de lobo')).toBeInTheDocument();
    expect(screen.getByText('Iluminação Pública')).toBeInTheDocument();
    expect(screen.getByText('Lixo / Entulho')).toBeInTheDocument();
    expect(screen.getByText('Sinalização')).toBeInTheDocument();

    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBe(5);

    const badges = screen.getAllByText('EM CONSTRUÇÃO');
    expect(badges.length).toBe(3);
  });

  test('CT-CAT.3: deve tratar falha na API, exibir mensagem de erro acessível com alerta e permitir nova tentativa (Retry)', async () => {
    api.listarCategorias.mockRejectedValueOnce(new Error('Falha de rede'));

    renderStep1();

    // Aguarda a exibição da mensagem de erro
    const alertaErro = await screen.findByRole('alert');
    expect(alertaErro).toBeInTheDocument();
    expect(
      screen.getByText('Não foi possível carregar as categorias. Verifique sua conexão e tente novamente.')
    ).toBeInTheDocument();

    const btnRetry = screen.getByRole('button', { name: /Tentar carregar as categorias novamente/i });
    expect(btnRetry).toBeInTheDocument();

    // Prepara sucesso para o clique em tentar novamente
    api.listarCategorias.mockResolvedValueOnce(mockCategoriasDb);
    fireEvent.click(btnRetry);

    // Aguarda sucesso pós-retry e renderização das categorias
    const itemAsfalto = await screen.findByText('Asfalto');
    expect(itemAsfalto).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('CT-CAT.4: ao clicar em uma categoria da API, deve persistir o UUID real no localStorage e navegar para a Etapa 2', async () => {
    renderStep1();

    const btnAsfalto = await screen.findByRole('button', { name: /Selecionar categoria Asfalto/i });
    fireEvent.click(btnAsfalto);

    // Verifica persistência no localStorage com o UUID do Supabase
    const salvo = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao'));
    expect(salvo).toBeDefined();
    expect(salvo.categoriaId).toBe('a1b2c3d4-0001-4000-8000-000000000001');
    expect(salvo.categoria).toBe('asfalto');
    expect(salvo.categoriaTitulo).toBe('Asfalto');
    expect(salvo.subcategorias).toEqual([
      { id: 'b1b2c3d4-0001-4000-8000-000000000001', nome: 'Buraco' },
    ]);

    // Verifica navegação para a etapa 2
    expect(screen.getByText('Etapa 2 - Subcategorias')).toBeInTheDocument();
  });

  test('não deve conter estilos inline de backgroundColor nos cartões (cor gerida 100% pelo CSS)', async () => {
    renderStep1();

    const botoes = await screen.findAllByRole('button');
    botoes.forEach((botao) => {
      expect(botao).toHaveClass('categoria-card');
      expect(botao.style.backgroundColor).toBe('');
    });

    CATEGORIAS.forEach((cat) => {
      expect(cat.corFundo).toBeUndefined();
    });
  });

  test('deve renderizar o rodapé institucional acessível ancorado na base', async () => {
    renderStep1();

    expect(screen.getByText('ZELUS • Acessível e inclusivo para todos')).toBeInTheDocument();
  });

  test('integração: o botão "+ NOVA SOLICITAÇÃO 📱" no Painel deve navegar para a Etapa 1', async () => {
    render(
      <MemoryRouter initialEntries={['/cidadao/painel']}>
        <Routes>
          <Route path="/cidadao/painel" element={<PainelCidadao />} />
          <Route path="/solicitacao/etapa-1" element={<div>Página Etapa 1 Montada com Sucesso</div>} />
        </Routes>
      </MemoryRouter>
    );

    const botaoNovaSolicitacao = screen.getByRole('button', { name: /\+ NOVA SOLICITAÇÃO 📱/ });
    expect(botaoNovaSolicitacao).toBeInTheDocument();

    fireEvent.click(botaoNovaSolicitacao);
    expect(screen.getByText('Página Etapa 1 Montada com Sucesso')).toBeInTheDocument();
  });
});
