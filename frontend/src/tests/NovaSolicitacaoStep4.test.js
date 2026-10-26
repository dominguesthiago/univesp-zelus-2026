import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoStep4 from '../pages/NovaSolicitacaoStep4';

// Componentes auxiliares de rota para capturar a navegação
const MockPainel = () => <div data-testid="painel-screen">Painel do Cidadão</div>;
const MockEtapa3 = () => <div data-testid="etapa-3-screen">Etapa 3 - Captura de Foto</div>;

const renderStep4 = (initialState = null) => {
  const entry = initialState
    ? { pathname: '/solicitacao/etapa-4', state: initialState }
    : '/solicitacao/etapa-4';

  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/solicitacao/etapa-4" element={<NovaSolicitacaoStep4 />} />
        <Route path="/solicitacao/etapa-3" element={<MockEtapa3 />} />
        <Route path="/solicitacao/sucesso" element={<div data-testid="sucesso-screen">Tela de Sucesso</div>} />
        <Route path="/cidadao/painel" element={<MockPainel />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Nova Solicitação - Etapa 4: Confirme o Local (NovaSolicitacaoStep4.jsx)', () => {
  const mockFotoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('deve renderizar o cabeçalho institucional com marca ZELUS, botão "< Voltar" e rodapé', () => {
    renderStep4();

    // Link Voltar
    const linkVoltar = screen.getByRole('link', { name: /Voltar para a Etapa 3: Captura de Foto/i });
    expect(linkVoltar).toBeInTheDocument();
    expect(linkVoltar).toHaveAttribute('href', '/solicitacao/etapa-3');

    // Marca e subtítulo
    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();

    // Título e indicador de etapa
    expect(screen.getByRole('heading', { level: 1, name: /Confirme o local/i })).toBeInTheDocument();
    expect(screen.getByText('Etapa 4 de 4')).toBeInTheDocument();

    // Rodapé
    expect(screen.getByText(/ZELUS • Acessível e inclusivo para todos/i)).toBeInTheDocument();
  });

  test('deve renderizar a miniatura da foto quando recebida via state', () => {
    renderStep4({
      foto: mockFotoBase64,
      latitude: -21.3589,
      longitude: -48.0678,
    });

    const imgFoto = screen.getByAltText(/Foto registrada da ocorrência urbana/i);
    expect(imgFoto).toBeInTheDocument();
    expect(imgFoto).toHaveAttribute('src', mockFotoBase64);
  });

  test('deve exibir placeholder "Sem foto" quando nenhuma imagem for fornecida', () => {
    renderStep4({});

    expect(screen.getByText('Sem foto')).toBeInTheDocument();
    expect(screen.queryByAltText(/Foto registrada da ocorrência urbana/i)).not.toBeInTheDocument();
  });

  test('deve preencher Rua, Bairro e Cidade via Nominatim e manter Número vazio', async () => {
    const mockNominatimResponse = {
      address: {
        road: 'Rua das Flores',
        suburb: 'Centro',
        city: 'Pradópolis',
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockNominatimResponse),
    });

    renderStep4({
      foto: mockFotoBase64,
      latitude: -21.3589,
      longitude: -48.0678,
    });

    // Aguarda o preenchimento automático
    await waitFor(() => {
      const inputRua = screen.getByLabelText(/Nome da rua/i);
      expect(inputRua.value).toBe('Rua das Flores');
    });

    const inputBairro = screen.getByLabelText(/Nome do bairro/i);
    const inputCidade = screen.getByLabelText(/Nome da cidade/i);
    const inputNumero = screen.getByLabelText(/Número predial ou de referência/i);

    expect(inputBairro.value).toBe('Centro');
    expect(inputCidade.value).toBe('Pradópolis');
    // Número deve permanecer estritamente em branco para digitação ativa
    expect(inputNumero.value).toBe('');
  });

  test('deve permitir que o cidadão digite o número e edite qualquer campo manualmente', async () => {
    const mockNominatimResponse = {
      address: {
        road: 'Rua das Flores',
        suburb: 'Centro',
        city: 'Pradópolis',
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockNominatimResponse),
    });

    renderStep4({
      foto: mockFotoBase64,
      latitude: -21.3589,
      longitude: -48.0678,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome da rua/i).value).toBe('Rua das Flores');
    });

    const inputNumero = screen.getByLabelText(/Número predial ou de referência/i);
    const inputRua = screen.getByLabelText(/Nome da rua/i);

    // Cidadão digita o número
    fireEvent.change(inputNumero, { target: { value: '123' } });
    expect(inputNumero.value).toBe('123');

    // Cidadão ajusta a rua
    fireEvent.change(inputRua, { target: { value: 'Avenida Brasil' } });
    expect(inputRua.value).toBe('Avenida Brasil');
  });

  test('deve exibir placeholders explícitos e permitir edição quando a API do Nominatim falhar', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Erro de conexão ou timeout'));

    renderStep4({
      foto: mockFotoBase64,
      latitude: -21.3589,
      longitude: -48.0678,
    });

    // Aguarda o término da tentativa assíncrona do fetch
    await waitFor(() => {
      expect(screen.queryByText(/Localizando endereço via GPS.../i)).not.toBeInTheDocument();
    });

    const inputRua = screen.getByLabelText(/Nome da rua/i);
    const inputNumero = screen.getByLabelText(/Número predial ou de referência/i);
    const inputBairro = screen.getByLabelText(/Nome do bairro/i);
    const inputCidade = screen.getByLabelText(/Nome da cidade/i);

    expect(inputRua).toHaveAttribute('placeholder', 'Digite o nome da rua');
    expect(inputNumero).toHaveAttribute('placeholder', 'Digite o número');
    expect(inputBairro).toHaveAttribute('placeholder', 'Digite o bairro');
    expect(inputCidade).toHaveAttribute('placeholder', 'Digite a cidade');

    // Cidadão digita manualmente todos os dados
    fireEvent.change(inputRua, { target: { value: 'Rua Manual' } });
    fireEvent.change(inputNumero, { target: { value: '789' } });
    fireEvent.change(inputBairro, { target: { value: 'Bairro Manual' } });
    fireEvent.change(inputCidade, { target: { value: 'Cidade Manual' } });

    expect(inputRua.value).toBe('Rua Manual');
    expect(inputNumero.value).toBe('789');
    expect(inputBairro.value).toBe('Bairro Manual');
    expect(inputCidade.value).toBe('Cidade Manual');
  });

  test('deve logar dados e salvar rascunho no localStorage ao clicar em "CONFIRMAR"', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    renderStep4({
      foto: mockFotoBase64,
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Rua São Paulo',
      numero: '500',
      bairro: 'Jardim Paulista',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[ZELUS Etapa 4] Dados finais da solicitação confirmados:'),
      expect.objectContaining({
        rua: 'Rua São Paulo',
        numero: '500',
        bairro: 'Jardim Paulista',
        cidade: 'Pradópolis',
      })
    );

    const rascunho = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
    expect(rascunho.rua).toBe('Rua São Paulo');
    expect(rascunho.numero).toBe('500');
  });

  test('não deve cancelar solicitação quando o cidadão recusar o window.confirm', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify({ rascunho: true }));

    renderStep4({ foto: mockFotoBase64 });

    const btnCancelar = screen.getByRole('button', { name: /Cancelar solicitação e voltar ao painel/i });
    fireEvent.click(btnCancelar);

    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja cancelar esta solicitação? Todos os dados serão perdidos.'
    );

    // Não deve limpar o localStorage nem navegar
    expect(localStorage.getItem('zelus_rascunho_solicitacao')).not.toBeNull();
    expect(screen.queryByTestId('painel-screen')).not.toBeInTheDocument();
  });

  test('deve limpar rascunho e redirecionar para o painel quando o cidadão aceitar o cancelamento', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify({ rascunho: true }));

    renderStep4({ foto: mockFotoBase64 });

    const btnCancelar = screen.getByRole('button', { name: /Cancelar solicitação e voltar ao painel/i });
    fireEvent.click(btnCancelar);

    expect(window.confirm).toHaveBeenCalledWith(
      'Tem certeza que deseja cancelar esta solicitação? Todos os dados serão perdidos.'
    );

    // Deve limpar o rascunho no localStorage
    expect(localStorage.getItem('zelus_rascunho_solicitacao')).toBeNull();

    // Deve navegar para /cidadao/painel
    expect(screen.getByTestId('painel-screen')).toBeInTheDocument();
  });
});
