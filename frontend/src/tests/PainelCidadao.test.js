import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PainelCidadao from '../pages/PainelCidadao';

const renderPainel = () =>
  render(
    <MemoryRouter initialEntries={['/cidadao/painel']}>
      <Routes>
        <Route path="/cidadao/painel" element={<PainelCidadao />} />
        <Route path="/login/cidadao" element={<div>Tela de Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Painel do Cidadão (PainelCidadao.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('zelus_token', 'token-teste');
    localStorage.setItem(
      'zelus_cidadao',
      JSON.stringify({ nome_completo: 'Maria da Silva' })
    );
  });

  test('deve renderizar a saudação com o primeiro nome do localStorage e o subtítulo', () => {
    renderPainel();

    expect(
      screen.getByRole('heading', { level: 1, name: /Olá, Maria! 👋/ })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Acompanhe suas solicitações ou abra uma nova.')
    ).toBeInTheDocument();
  });

  test('deve usar "Cidadão" como nome padrão quando não houver dados salvos', () => {
    localStorage.clear();
    renderPainel();

    expect(
      screen.getByRole('heading', { level: 1, name: /Olá, Cidadão! 👋/ })
    ).toBeInTheDocument();
  });

  test('deve renderizar o botão principal "+ NOVA SOLICITAÇÃO 📱"', () => {
    renderPainel();

    const botao = screen.getByRole('button', { name: /\+ NOVA SOLICITAÇÃO 📱/ });
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveClass('painel-cidadao__cta');
  });

  test('deve renderizar o título e a lista estática de solicitações recentes', () => {
    renderPainel();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Minhas Solicitações Recentes' })
    ).toBeInTheDocument();

    const lista = screen.getByTestId('lista-solicitacoes');
    const cartoes = within(lista).getAllByRole('listitem');
    expect(cartoes.length).toBeGreaterThanOrEqual(2);
    cartoes.forEach((c) => expect(c).toHaveClass('solicitacao-card'));

    expect(screen.getByText('Buraco na Rua / Asfalto')).toBeInTheDocument();
    expect(screen.getByText('#3842')).toBeInTheDocument();
    expect(screen.getByText(/10\/11\/2026/)).toBeInTheDocument();
  });

  test('deve exibir os badges de status com as classes corretas e alinhados ao título', () => {
    renderPainel();

    const pendente = screen.getAllByText('Pendente')[0];
    expect(pendente).toHaveClass('badge', 'badge--pendente');
    expect(pendente.parentElement).toHaveClass('solicitacao-card__topo');

    const concluido = screen.getAllByText('Concluído')[0];
    expect(concluido).toHaveClass('badge', 'badge--concluido');
    expect(concluido.parentElement).toHaveClass('solicitacao-card__topo');
  });

  test('deve renderizar uma ilustração (imagem) em cada cartão de solicitação', () => {
    renderPainel();

    const lista = screen.getByTestId('lista-solicitacoes');
    const cartoes = within(lista).getAllByRole('listitem');
    cartoes.forEach((c) => {
      expect(c.querySelector('img.solicitacao-card__imagem')).toBeInTheDocument();
    });
  });

  test('não deve renderizar o "Sair" dentro da página (fica no Header)', () => {
    renderPainel();

    expect(screen.queryByRole('link', { name: /Sair/i })).not.toBeInTheDocument();
  });

  test('não deve exibir mais a Pontuação de Cidadania nem os Serviços Disponíveis', () => {
    renderPainel();

    expect(screen.queryByText(/Pontuação de Cidadania/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Serviços Disponíveis/i)).not.toBeInTheDocument();
  });

  test('deve aplicar e remover a trava de rolagem do documento', () => {
    const { unmount } = renderPainel();

    expect(document.body).toHaveClass('painel-cidadao-ativo');
    expect(document.documentElement).toHaveClass('painel-cidadao-ativo');

    unmount();
    expect(document.body).not.toHaveClass('painel-cidadao-ativo');
    expect(document.documentElement).not.toHaveClass('painel-cidadao-ativo');
  });
});
