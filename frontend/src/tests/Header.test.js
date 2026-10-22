import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';

const renderHeader = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/cidadao/painel']}>
      <Routes>
        <Route path="/cidadao/painel" element={<Header {...props} />} />
        <Route path="/login/cidadao" element={<div>Tela de Login</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Header global (Header.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('zelus_token', 'token-teste');
    localStorage.setItem('zelus_cidadao', JSON.stringify({ nome_completo: 'Maria' }));
  });

  test('não deve exibir o link "Sair" por padrão', () => {
    renderHeader();

    expect(screen.queryByRole('link', { name: /Sair/i })).not.toBeInTheDocument();
    expect(screen.getByText('ZELUS')).toBeInTheDocument();
  });

  test('deve exibir o link "Sair" quando mostrarSair é verdadeiro', () => {
    const { container } = renderHeader({ mostrarSair: true });

    const sair = screen.getByRole('link', { name: /Sair da conta/i });
    expect(sair).toHaveClass('header__sair');
    expect(sair).toHaveTextContent('Sair');
    expect(container.querySelector('.header')).toHaveClass('header--com-sair');
  });

  test('deve encerrar a sessão e navegar para o login ao clicar em "Sair"', () => {
    renderHeader({ mostrarSair: true });

    fireEvent.click(screen.getByRole('link', { name: /Sair da conta/i }));

    expect(localStorage.getItem('zelus_token')).toBeNull();
    expect(localStorage.getItem('zelus_cidadao')).toBeNull();
    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
  });
});
