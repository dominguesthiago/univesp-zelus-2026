import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdminDeviceGuard from '../components/AdminDeviceGuard';

describe('Componente AdminDeviceGuard (Mobile/Tablet Guard)', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  test('deve renderizar o conteúdo infantil quando a resolução for de Desktop (>= 1024px)', () => {
    window.innerWidth = 1200;

    render(
      <MemoryRouter>
        <AdminDeviceGuard>
          <div data-testid="conteudo-admin">Painel Administrativo Autorizado</div>
        </AdminDeviceGuard>
      </MemoryRouter>
    );

    const conteudo = screen.getByTestId('conteudo-admin');
    expect(conteudo).toBeInTheDocument();
  });

  test('deve exibir mensagem amigável de bloqueio quando a resolução for inferior a 1024px', () => {
    window.innerWidth = 768;

    render(
      <MemoryRouter>
        <AdminDeviceGuard>
          <div data-testid="conteudo-admin">Painel Administrativo Autorizado</div>
        </AdminDeviceGuard>
      </MemoryRouter>
    );

    // Deve conter a mensagem estrita exigida nos requisitos
    const mensagem = screen.getByText(
      /A área administrativa é de uso exclusivo em computadores \(Desktop\/Notebook\)\./i
    );
    expect(mensagem).toBeInTheDocument();

    const titulo = screen.getByRole('heading', { name: /Acesso Exclusivo Desktop/i });
    expect(titulo).toBeInTheDocument();

    // Links de apoio para cidadão e página inicial
    expect(screen.getByRole('link', { name: /Ir para o Portal do Cidadão/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar para a Página Inicial/i })).toBeInTheDocument();
  });

  test('deve reagir a eventos de redimensionamento da janela (resize)', () => {
    window.innerWidth = 1280;

    render(
      <MemoryRouter>
        <AdminDeviceGuard>
          <div data-testid="conteudo-admin">Painel Administrativo Autorizado</div>
        </AdminDeviceGuard>
      </MemoryRouter>
    );

    // Redimensiona para mobile
    act(() => {
      window.innerWidth = 600;
      window.dispatchEvent(new Event('resize'));
    });

    expect(
      screen.getByText(/A área administrativa é de uso exclusivo em computadores \(Desktop\/Notebook\)\./i)
    ).toBeInTheDocument();
  });
});
