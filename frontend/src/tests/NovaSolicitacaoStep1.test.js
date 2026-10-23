import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoStep1, { CATEGORIAS } from '../pages/NovaSolicitacaoStep1';
import PainelCidadao from '../pages/PainelCidadao';

const renderStep1 = () =>
  render(
    <MemoryRouter initialEntries={['/solicitacao/etapa-1']}>
      <Routes>
        <Route path="/solicitacao/etapa-1" element={<NovaSolicitacaoStep1 />} />
        <Route path="/cidadao/painel" element={<div>Painel do Cidadão</div>} />
        <Route path="/solicitacao/etapa-2" element={<div>Etapa 2 - Localização</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Nova Solicitação - Etapa 1: Escolha de Categoria (NovaSolicitacaoStep1.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('deve renderizar o cabeçalho institucional com marca ZELUS e botão "< Voltar" para o painel', () => {
    renderStep1();

    const linkVoltar = screen.getByRole('link', { name: /Voltar para o Painel do Cidadão/i });
    expect(linkVoltar).toBeInTheDocument();
    expect(linkVoltar).toHaveAttribute('href', '/cidadao/painel');

    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toHaveStyle({ color: '#ffffff' });
  });

  test('deve renderizar o título da pergunta e a indicação textual "Etapa 1 de 4"', () => {
    renderStep1();

    const tituloPrincipal = screen.getByRole('heading', {
      level: 1,
      name: /Qual solicitação deseja criar\?/i,
    });
    expect(tituloPrincipal).toBeInTheDocument();
    expect(screen.getByText('Etapa 1 de 4')).toBeInTheDocument();
  });

  test('não deve conter estilos inline de backgroundColor nos cartões (cor gerida 100% pelo CSS)', () => {
    renderStep1();

    const botoes = screen.getAllByRole('button');
    botoes.forEach((botao) => {
      expect(botao).toHaveClass('categoria-card');
      expect(botao.style.backgroundColor).toBe('');
    });

    CATEGORIAS.forEach((cat) => {
      expect(cat.corFundo).toBeUndefined();
    });
  });

  test('deve renderizar todas as 5 categorias para teste de scroll e overflow da tela', () => {
    renderStep1();

    expect(screen.getByText('Asfalto / Rua')).toBeInTheDocument();
    expect(screen.getByText('Bueiro / Boca-de-lobo')).toBeInTheDocument();
    expect(screen.getByText('Iluminação Pública')).toBeInTheDocument();
    expect(screen.getByText('Lixo / Entulho')).toBeInTheDocument();
    expect(screen.getByText('Sinalização')).toBeInTheDocument();

    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBe(5);
  });

  test('deve exibir a etiqueta visual "EM CONSTRUÇÃO" nas 3 novas categorias', () => {
    renderStep1();

    const badges = screen.getAllByText('EM CONSTRUÇÃO');
    expect(badges.length).toBe(3);

    const categoriasEmConstrucao = CATEGORIAS.filter((c) => c.emConstrucao);
    expect(categoriasEmConstrucao.length).toBe(3);
    expect(categoriasEmConstrucao.map((c) => c.id)).toEqual([
      'iluminacao-publica',
      'lixo-entulho',
      'sinalizacao',
    ]);
  });

  test('deve possuir ilustrações acessíveis para as categorias que possuem imagem', () => {
    renderStep1();

    const categoriasComImagem = CATEGORIAS.filter((c) => c.imagem);
    categoriasComImagem.forEach((cat) => {
      const img = screen.getByAltText(cat.alt);
      expect(img).toBeInTheDocument();
      expect(img).toHaveClass('categoria-card__imagem');
    });
  });

  test('ao clicar em uma categoria, deve persistir a escolha no localStorage e navegar para a Etapa 2', () => {
    renderStep1();

    const btnAsfalto = screen.getByRole('button', { name: /Selecionar categoria Asfalto \/ Rua/i });
    fireEvent.click(btnAsfalto);

    // Verifica persistência no localStorage
    const salvo = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao'));
    expect(salvo).toBeDefined();
    expect(salvo.categoriaId).toBe('asfalto-rua');
    expect(salvo.categoriaTitulo).toBe('Asfalto / Rua');

    // Verifica navegação para a etapa 2
    expect(screen.getByText('Etapa 2 - Localização')).toBeInTheDocument();
  });

  test('deve renderizar o rodapé institucional acessível ancorado na base', () => {
    renderStep1();

    expect(screen.getByText('ZELUS • Acessível e inclusivo para todos')).toBeInTheDocument();
  });

  test('integração: o botão "+ NOVA SOLICITAÇÃO 📱" no Painel deve navegar para a Etapa 1', () => {
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
