import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalAvisoBloqueio from '../components/kanban/ModalAvisoBloqueio';

describe('Componente ModalAvisoBloqueio', () => {
  test('deve renderizar a mensagem de bloqueio dinâmica para o status Concluída', () => {
    render(<ModalAvisoBloqueio status="Concluída" onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Ação Bloqueada')).toBeInTheDocument();
    expect(
      screen.getByText(/Esta solicitação já consta como/i)
    ).toHaveTextContent(
      'Ação bloqueada: Esta solicitação já consta como Concluída (Estado terminal) e não pode ser movimentada para outra etapa.'
    );
    expect(screen.getByRole('button', { name: /Entendi/i })).toBeInTheDocument();
  });

  test('deve renderizar a mensagem de bloqueio dinâmica para o status Descartada', () => {
    render(<ModalAvisoBloqueio status="Descartada" onClose={jest.fn()} />);

    expect(
      screen.getByText(/Esta solicitação já consta como/i)
    ).toHaveTextContent(
      'Ação bloqueada: Esta solicitação já consta como Descartada (Estado terminal) e não pode ser movimentada para outra etapa.'
    );
  });

  test('deve disparar onClose ao clicar no botão "Entendi"', () => {
    const handleClose = jest.fn();
    render(<ModalAvisoBloqueio status="Concluída" onClose={handleClose} />);

    const btnEntendi = screen.getByRole('button', { name: /Entendi/i });
    fireEvent.click(btnEntendi);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('deve disparar onClose ao clicar no botão de fechar (X)', () => {
    const handleClose = jest.fn();
    render(<ModalAvisoBloqueio status="Descartada" onClose={handleClose} />);

    const btnFechar = screen.getByRole('button', { name: /Fechar aviso de bloqueio/i });
    fireEvent.click(btnFechar);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('deve disparar onClose ao pressionar a tecla Escape', () => {
    const handleClose = jest.fn();
    render(<ModalAvisoBloqueio status="Concluída" onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('não deve renderizar nada quando visivel ou isOpen for falso', () => {
    const { container } = render(
      <ModalAvisoBloqueio visivel={false} status="Concluída" onClose={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });
});

