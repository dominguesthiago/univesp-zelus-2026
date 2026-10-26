import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoSucesso from '../pages/NovaSolicitacaoSucesso';

// Componente mock para verificar navegação final para o Painel do Cidadão
const MockPainel = () => <div data-testid="painel-screen">Painel do Cidadão</div>;

const renderSucesso = (initialState = null) => {
  const entry = initialState
    ? { pathname: '/solicitacao/sucesso', state: initialState }
    : '/solicitacao/sucesso';

  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/solicitacao/sucesso" element={<NovaSolicitacaoSucesso />} />
        <Route path="/cidadao/painel" element={<MockPainel />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Nova Solicitação - Tela de Sucesso (NovaSolicitacaoSucesso.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Mock seguro da Clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('deve renderizar o cabeçalho institucional ZELUS e NÃO exibir o link/botão "Voltar"', () => {
    renderSucesso({ protocolo: '#1543-2026' });

    // Ausência estrita do botão/link voltar (segurança do fluxo concluído)
    const linkVoltar = screen.queryByRole('link', { name: /voltar/i });
    expect(linkVoltar).not.toBeInTheDocument();

    const botaoVoltar = screen.queryByRole('button', { name: /voltar para a etapa/i });
    expect(botaoVoltar).not.toBeInTheDocument();

    // Presença da marca e identidade
    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();

    // Título e rodapé institucional
    expect(screen.getByRole('heading', { level: 1, name: /Chamado enviado!/i })).toBeInTheDocument();
    expect(screen.getByText(/Obrigado! Seu chamado foi enviado para a Prefeitura./i)).toBeInTheDocument();
    expect(screen.getByText(/ZELUS • Acessível e inclusivo para todos/i)).toBeInTheDocument();
  });

  test('deve renderizar o número de protocolo recebido via location.state', () => {
    renderSucesso({ protocolo: '#7890-2026' });

    const protocoloEl = screen.getByTestId('protocolo-numero');
    expect(protocoloEl).toBeInTheDocument();
    expect(protocoloEl).toHaveTextContent('#7890-2026');
  });

  test('deve gerar e renderizar um protocolo fallback no formato "#XXXX-YYYY" se não houver state', () => {
    renderSucesso();

    const protocoloEl = screen.getByTestId('protocolo-numero');
    expect(protocoloEl).toBeInTheDocument();
    // Valida padrão #4dígitos-anoAtual (ex: #1543-2026)
    expect(protocoloEl.textContent).toMatch(/^#\d{4}-\d{4}$/);
  });

  test('deve disparar a Clipboard API e exibir feedback "Copiado com sucesso!" ao clicar em copiar', async () => {
    renderSucesso({ protocolo: '#1543-2026' });

    const btnCopiar = screen.getByRole('button', { name: /Copiar número do protocolo/i });
    expect(btnCopiar).toBeInTheDocument();

    fireEvent.click(btnCopiar);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#1543-2026');

    // Feedback visual acessível deve ser exibido
    await waitFor(() => {
      expect(screen.getByText('Copiado com sucesso!')).toBeInTheDocument();
    });
  });

  test('deve limpar o rascunho do localStorage e redirecionar para /cidadao/painel ao clicar em "VOLTAR AO INÍCIO"', () => {
    localStorage.setItem(
      'zelus_rascunho_solicitacao',
      JSON.stringify({ categoria: 'asfalto', subcategoria: 'buraco' })
    );

    renderSucesso({ protocolo: '#1543-2026' });

    const btnInicio = screen.getByRole('button', {
      name: /Voltar para a tela inicial do Painel do Cidadão/i,
    });
    expect(btnInicio).toBeInTheDocument();

    fireEvent.click(btnInicio);

    // Deve limpar o rascunho
    expect(localStorage.getItem('zelus_rascunho_solicitacao')).toBeNull();

    // Deve navegar para a rota /cidadao/painel
    expect(screen.getByTestId('painel-screen')).toBeInTheDocument();
  });
});
