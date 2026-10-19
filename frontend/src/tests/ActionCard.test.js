import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionCard from '../components/ActionCard';

describe('Componente ActionCard', () => {
  const defaultProps = {
    title: 'Sou Cidadão',
    description: 'Registre ocorrências de zeladoria urbana e acompanhe o andamento no seu bairro.',
    imageSrc: '/assets/images/ilustracao-cidadao.png',
    altText: '',
    colorClass: 'card-citizen',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o título em <h2> e a descrição informada', () => {
    render(<ActionCard {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 2, name: 'Sou Cidadão' });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(defaultProps.description);
    expect(description).toBeInTheDocument();
  });

  test('deve renderizar imagem decorativa com alt="" e aria-hidden="true" quando altText for vazio', () => {
    const { container } = render(<ActionCard {...defaultProps} />);

    const image = container.querySelector('.action-card__image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(image).toHaveAttribute('src', defaultProps.imageSrc);
  });

  test('deve disparar a função onClick mockada ao clicar na tag <button>', () => {
    const mockOnClick = jest.fn();
    render(<ActionCard {...defaultProps} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: /Acessar Sou Cidadão/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('deve aplicar a classe de cor temática informada na tag <article>', () => {
    const { container } = render(<ActionCard {...defaultProps} colorClass="card-admin" />);

    const article = container.querySelector('.action-card');
    expect(article).toHaveClass('card-admin');
  });
});
