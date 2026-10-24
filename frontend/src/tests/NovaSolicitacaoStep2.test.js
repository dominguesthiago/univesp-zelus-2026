import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoStep2, { CONFIG_CATEGORIAS } from '../pages/NovaSolicitacaoStep2';

const renderStep2 = (initialState = null) => {
  const entry = initialState
    ? { pathname: '/solicitacao/etapa-2', state: initialState }
    : '/solicitacao/etapa-2';

  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/solicitacao/etapa-2" element={<NovaSolicitacaoStep2 />} />
        <Route path="/solicitacao/etapa-1" element={<div>Etapa 1 - Categorias</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Nova Solicitação - Etapa 2: Subcategorias (NovaSolicitacaoStep2.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('deve renderizar o cabeçalho institucional com marca ZELUS e botão "< Voltar" para a Etapa 1', () => {
    renderStep2();

    const linkVoltar = screen.getByRole('link', { name: /Voltar para a Etapa 1: Categorias/i });
    expect(linkVoltar).toBeInTheDocument();
    expect(linkVoltar).toHaveAttribute('href', '/solicitacao/etapa-1');

    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toHaveStyle({ color: '#ffffff' });
  });

  test('deve renderizar o cenário de "Asfalto / Rua" com título, 1 botão funcional e 3 mocks em construção', () => {
    renderStep2({ categoria: 'asfalto' });

    const titulo = screen.getByRole('heading', {
      level: 1,
      name: /Qual serviço de Asfalto \/ Rua deseja solicitar\?/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(screen.getByText('Etapa 2 de 4')).toBeInTheDocument();

    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBe(4);

    expect(screen.getByText('Buraco na via')).toBeInTheDocument();
    expect(screen.getByText('Recapeamento')).toBeInTheDocument();
    expect(screen.getByText('Pintura de Faixa')).toBeInTheDocument();
    expect(screen.getByText('Lombada')).toBeInTheDocument();

    const badgesConstrucao = screen.getAllByText('EM CONSTRUÇÃO');
    expect(badgesConstrucao.length).toBe(3);

    const imgBuraco = screen.getByAltText(/buraco no asfalto com cones de sinalização/i);
    expect(imgBuraco).toBeInTheDocument();
    expect(imgBuraco).toHaveClass('categoria-card__imagem');
  });

  test('deve renderizar o cenário de "Bueiro / Boca-de-lobo" com título, 2 botões funcionais e 3 mocks em construção', () => {
    renderStep2({ categoria: 'bueiro' });

    const titulo = screen.getByRole('heading', {
      level: 1,
      name: /Qual serviço de Bueiro \/ Boca-de-lobo deseja solicitar\?/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(screen.getByText('Etapa 2 de 4')).toBeInTheDocument();

    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBe(5);

    expect(screen.getByText('Entupido / Transbordando')).toBeInTheDocument();
    expect(screen.getByText('Sem Tampa / Quebrado')).toBeInTheDocument();
    expect(screen.getByText('Limpeza Preventiva')).toBeInTheDocument();
    expect(screen.getByText('Desinsetização')).toBeInTheDocument();
    expect(screen.getByText('Reparo Estrutural')).toBeInTheDocument();

    const badgesConstrucao = screen.getAllByText('EM CONSTRUÇÃO');
    expect(badgesConstrucao.length).toBe(3);

    const imgBueiro = screen.getByAltText(/bueiro metálico com escoamento de água e resíduos/i);
    expect(imgBueiro).toBeInTheDocument();
    expect(imgBueiro).toHaveClass('categoria-card__imagem');
  });

  test('deve assumir fallback seguro para "Asfalto" caso o estado da rota seja nulo ou indefinido', () => {
    renderStep2(null);

    const titulo = screen.getByRole('heading', {
      level: 1,
      name: /Qual serviço de Asfalto \/ Rua deseja solicitar\?/i,
    });
    expect(titulo).toBeInTheDocument();

    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBe(4);
    expect(screen.getByText('Buraco na via')).toBeInTheDocument();
  });

  test('todos os botões de subcategoria devem possuir a classe base e o modificador de isolamento CSS categoria-card--step2', () => {
    renderStep2({ categoria: 'asfalto' });

    const botoes = screen.getAllByRole('button');
    botoes.forEach((botao) => {
      expect(botao).toHaveClass('categoria-card');
      expect(botao).toHaveClass('categoria-card--step2');
    });
  });

  test('ao clicar em uma subcategoria, deve persistir os dados no localStorage com as informações atualizadas', () => {
    localStorage.setItem(
      'zelus_rascunho_solicitacao',
      JSON.stringify({ categoriaId: 'asfalto-rua', categoriaTitulo: 'Asfalto / Rua' })
    );

    renderStep2({ categoria: 'asfalto' });

    const botaoBuraco = screen.getByRole('button', {
      name: /Selecionar subcategoria Buraco na via/i,
    });
    fireEvent.click(botaoBuraco);

    const rascunhoSalvo = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
    expect(rascunhoSalvo.subcategoriaId).toBe('buraco-na-via');
    expect(rascunhoSalvo.subcategoriaTitulo).toBe('Buraco na via');
    expect(rascunhoSalvo.emConstrucao).toBe(false);
    expect(rascunhoSalvo.atualizadoEm).toBeDefined();
    expect(rascunhoSalvo.categoriaTitulo).toBe('Asfalto / Rua');
  });
});
