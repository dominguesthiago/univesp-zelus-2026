import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CookieBanner from '../components/CookieBanner';

describe('Componente CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('deve renderizar o aviso de privacidade e LGPD quando o termo não foi aceito', () => {
    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    const bannerRegion = screen.getByRole('region', {
      name: /Aviso de Privacidade e Armazenamento Local/i,
    });
    expect(bannerRegion).toBeInTheDocument();

    expect(bannerRegion).toHaveTextContent(
      /O ZELUS utiliza armazenamento local essencial/i
    );

    const linkPolitica = screen.getByRole('link', {
      name: /Conheça a nossa Política de Privacidade/i,
    });
    expect(linkPolitica).toHaveAttribute('href', '/politica-privacidade');

    const botaoAceitar = screen.getByRole('button', {
      name: /Aceitar e dispensar aviso de privacidade e armazenamento local/i,
    });
    expect(botaoAceitar).toBeInTheDocument();
  });

  test('deve gravar "zelus_termo_aceito" no localStorage e remover o banner da tela ao clicar em Aceitar', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    const botaoAceitar = screen.getByRole('button', {
      name: /Aceitar e dispensar aviso de privacidade e armazenamento local/i,
    });

    fireEvent.click(botaoAceitar);

    expect(setItemSpy).toHaveBeenCalledWith('zelus_termo_aceito', 'true');

    const bannerRegion = screen.queryByRole('region', {
      name: /Aviso de Privacidade e Armazenamento Local/i,
    });
    expect(bannerRegion).not.toBeInTheDocument();
  });

  test('não deve renderizar o banner quando o consentimento já foi previamente registrado', () => {
    localStorage.setItem('zelus_termo_aceito', 'true');

    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    const bannerRegion = screen.queryByRole('region', {
      name: /Aviso de Privacidade e Armazenamento Local/i,
    });
    expect(bannerRegion).not.toBeInTheDocument();
  });

  test('não deve renderizar o banner na rota /politica-privacidade', () => {
    render(
      <MemoryRouter initialEntries={['/politica-privacidade']}>
        <CookieBanner />
      </MemoryRouter>
    );

    const bannerRegion = screen.queryByRole('region', {
      name: /Aviso de Privacidade e Armazenamento Local/i,
    });
    expect(bannerRegion).not.toBeInTheDocument();
  });
});
