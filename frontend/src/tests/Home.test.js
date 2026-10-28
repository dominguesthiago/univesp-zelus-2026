import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Página Inicial (Home.jsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a estrutura semântica principal com <main id="conteudo-principal">', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const main = container.querySelector('main#conteudo-principal');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('home');
  });

  test('deve renderizar o título principal <h1> dentro do <header>', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', { level: 1, name: /Como deseja acessar o ZELUS\?/i });
    expect(heading).toBeInTheDocument();
  });

  test('deve renderizar os cartões de ação com botões acessíveis para Cidadão e Prefeitura', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const btnCidadao = screen.getByRole('button', { name: /Acessar SOU CIDADÃO/i });
    expect(btnCidadao).toBeInTheDocument();

    const btnPrefeitura = screen.getByRole('button', { name: /Acessar ACESSO PREFEITURA/i });
    expect(btnPrefeitura).toBeInTheDocument();
  });

  test('deve navegar para a tela de login do cidadão (/login/cidadao) ao clicar no cartão Sou Cidadão', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const btnCidadao = screen.getByRole('button', { name: /Acessar SOU CIDADÃO/i });
    fireEvent.click(btnCidadao);

    expect(mockedNavigate).toHaveBeenCalledWith('/login/cidadao');
  });

  test('deve navegar para a tela de login da prefeitura (/login/prefeitura) ao clicar no cartão Acesso Prefeitura', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const btnPrefeitura = screen.getByRole('button', { name: /Acessar ACESSO PREFEITURA/i });
    fireEvent.click(btnPrefeitura);

    expect(mockedNavigate).toHaveBeenCalledWith('/login/prefeitura');
  });


  test('deve renderizar o rodapé semântico da home com a tagline inclusiva', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const tagline = screen.getByText(/ZELUS • Acessível e inclusivo para todos/i);
    expect(tagline).toBeInTheDocument();
  });
});
