import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NovaSolicitacaoStep4 from '../pages/NovaSolicitacaoStep4';
import * as api from '../services/api';
import * as storageService from '../services/supabaseStorage';

jest.mock('../services/api');
jest.mock('../services/supabaseStorage');

// Componentes auxiliares de rota para capturar a navegação
const MockPainel = () => <div data-testid="painel-screen">Painel do Cidadão</div>;
const MockEtapa3 = () => <div data-testid="etapa-3-screen">Etapa 3 - Captura de Foto</div>;
const MockSucesso = () => <div data-testid="sucesso-screen">Tela de Sucesso</div>;

const renderStep4 = (initialState = null) => {
  const entry = initialState
    ? { pathname: '/solicitacao/etapa-4', state: initialState }
    : '/solicitacao/etapa-4';

  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/solicitacao/etapa-4" element={<NovaSolicitacaoStep4 />} />
        <Route path="/solicitacao/etapa-3" element={<MockEtapa3 />} />
        <Route path="/solicitacao/sucesso" element={<MockSucesso />} />
        <Route path="/cidadao/painel" element={<MockPainel />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Nova Solicitação - Etapa 4: Confirme o Local & Envio Real (NovaSolicitacaoStep4.jsx)', () => {
  const mockFotoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
  const mockFotoPublicUrl = 'https://supabase.co/storage/v1/object/public/solicitacoes-fotos/foto-teste.jpg';
  const mockSubcategoriaId = 'b1b2c3d4-0001-4000-8000-000000000001';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    storageService.uploadFotoSolicitacao.mockImplementation((foto) => {
      if (typeof foto === 'string' && foto.startsWith('http')) return Promise.resolve(foto);
      return Promise.resolve(mockFotoPublicUrl);
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        address: {
          road: 'Rua das Flores',
          suburb: 'Centro',
          city: 'Pradópolis',
        },
      }),
    });
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

    expect(screen.getByLabelText(/Nome do bairro/i).value).toBe('Centro');
    expect(screen.getByLabelText(/Nome da cidade/i).value).toBe('Pradópolis');
    expect(screen.getByLabelText(/Número predial ou de referência/i).value).toBe('');
  });

  test('deve permitir que o usuário edite todos os campos livremente', () => {
    renderStep4({
      foto: mockFotoBase64,
      rua: 'Rua Antiga',
      numero: '100',
      bairro: 'Bairro Antigo',
      cidade: 'Cidade Antiga',
    });

    const inputRua = screen.getByLabelText(/Nome da rua/i);
    const inputNumero = screen.getByLabelText(/Número predial ou de referência/i);
    const inputBairro = screen.getByLabelText(/Nome do bairro/i);
    const inputCidade = screen.getByLabelText(/Nome da cidade/i);

    fireEvent.change(inputRua, { target: { value: 'Rua Manual' } });
    fireEvent.change(inputNumero, { target: { value: '789' } });
    fireEvent.change(inputBairro, { target: { value: 'Bairro Manual' } });
    fireEvent.change(inputCidade, { target: { value: 'Cidade Manual' } });

    expect(inputRua.value).toBe('Rua Manual');
    expect(inputNumero.value).toBe('789');
    expect(inputBairro.value).toBe('Bairro Manual');
    expect(inputCidade.value).toBe('Cidade Manual');
  });

  test('CT-ENV.1: deve enviar dados reais para criarSolicitacao(), limpar rascunho e navegar para Etapa 5 com o protocolo oficial', async () => {
    api.criarSolicitacao.mockResolvedValueOnce({
      sucesso: true,
      mensagem: 'Solicitação criada com sucesso.',
      protocolo: 'ZELUS-20261026-X8Y9',
      dados: {
        id: 'sol-uuid-1234',
        created_at: '2026-10-26T16:00:00.000Z',
      },
    });

    localStorage.setItem(
      'zelus_rascunho_solicitacao',
      JSON.stringify({
        subcategoria_id: mockSubcategoriaId,
        subcategoriaTitulo: 'Buraco na via',
        categoriaTitulo: 'Asfalto / Rua',
      })
    );

    renderStep4({
      foto: mockFotoBase64,
      subcategoria_id: mockSubcategoriaId,
      subcategoriaTitulo: 'Buraco na via',
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Rua São Paulo',
      numero: '500',
      bairro: 'Jardim Paulista',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    // Valida chamada à API com o payload completo e normalizado
    await waitFor(() => {
      expect(api.criarSolicitacao).toHaveBeenCalledWith({
        subcategoria_id: mockSubcategoriaId,
        latitude: -21.3589,
        longitude: -48.0678,
        descricao: 'Buraco na via',
        rua: 'Rua São Paulo',
        numero: '500',
        ponto_referencia: null,
        bairro: 'Jardim Paulista',
        cidade: 'Pradópolis',
        foto_url: mockFotoPublicUrl,
      });
    });

    // Valida limpeza do rascunho pós-sucesso
    expect(localStorage.getItem('zelus_rascunho_solicitacao')).toBeNull();

    // Valida transição para a tela de sucesso
    const telaSucesso = await screen.findByTestId('sucesso-screen');
    expect(telaSucesso).toBeInTheDocument();
  });

  test('CT-ENV.2: deve aplicar estado de carregamento e desabilitar botão para prevenir submissões duplicadas (Anti-Double Submit)', async () => {
    let resolverChamada;
    api.criarSolicitacao.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolverChamada = resolve;
        })
    );

    renderStep4({
      foto: mockFotoBase64,
      subcategoria_id: mockSubcategoriaId,
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Avenida Brasil',
      numero: '10',
      bairro: 'Centro',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    // Valida feedback visual de loading
    expect(screen.getByText('ENVIANDO...')).toBeInTheDocument();
    expect(btnConfirmar).toBeDisabled();
    expect(btnConfirmar).toHaveClass('step4-btn-confirmar--loading');

    // Tenta novo clique com o botão desabilitado
    fireEvent.click(btnConfirmar);

    // Valida que a API só foi acionada exatamente 1 vez
    await waitFor(() => {
      expect(api.criarSolicitacao).toHaveBeenCalledTimes(1);
    });

    // Conclui a promise para finalizar o ciclo assíncrono de forma limpa
    resolverChamada({ sucesso: true, protocolo: 'ZELUS-TEST' });
    await waitFor(() => {
      expect(screen.getByTestId('sucesso-screen')).toBeInTheDocument();
    });
  });

  test('CT-ENV.3: deve tratar erro HTTP 409 (Filtro Espacial Anti-Spam Haversine) exibindo alerta acessível', async () => {
    const erro409 = new Error('Já existe um problema deste tipo registado a menos de 10 metros daqui.');
    erro409.status = 409;
    api.criarSolicitacao.mockRejectedValueOnce(erro409);

    renderStep4({
      foto: mockFotoBase64,
      subcategoria_id: mockSubcategoriaId,
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Rua Duplicada',
      numero: '20',
      bairro: 'Centro',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    // Aguarda exibição do alerta acessível
    const alerta = await screen.findByRole('alert');
    expect(alerta).toBeInTheDocument();
    expect(
      screen.getByText('Já existe um problema deste tipo registado a menos de 10 metros daqui.')
    ).toBeInTheDocument();

    // Munícipe permanece na Etapa 4 e botão é reabilitado
    expect(screen.queryByTestId('sucesso-screen')).not.toBeInTheDocument();
    expect(btnConfirmar).not.toBeDisabled();
  });

  test('CT-ENV.4: deve tratar falha genérica de rede exibindo mensagem amigável e permitindo nova tentativa', async () => {
    const erroRede = new Error('Falha de rede');
    erroRede.status = 0;
    erroRede.message = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    api.criarSolicitacao.mockRejectedValueOnce(erroRede);

    renderStep4({
      foto: mockFotoBase64,
      subcategoria_id: mockSubcategoriaId,
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Rua Sem Sinal',
      numero: '99',
      bairro: 'Interior',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toBeInTheDocument();
    expect(
      screen.getByText('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
    ).toBeInTheDocument();
    expect(btnConfirmar).not.toBeDisabled();
  });

  test('CT-ENV.5: não deve cancelar solicitação quando o cidadão recusar o window.confirm', () => {
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
    expect(api.criarSolicitacao).not.toHaveBeenCalled();
  });

  test('CT-ENV.5: deve limpar rascunho e redirecionar para o painel quando o cidadão aceitar o cancelamento', () => {
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
    expect(api.criarSolicitacao).not.toHaveBeenCalled();
  });

  test('CT-ENV.6: deve tratar erro no upload da foto para o Supabase Storage sem enviar a solicitação', async () => {
    storageService.uploadFotoSolicitacao.mockRejectedValueOnce(
      new Error('Erro de permissão no bucket Supabase Storage')
    );

    renderStep4({
      foto: mockFotoBase64,
      subcategoria_id: mockSubcategoriaId,
      latitude: -21.3589,
      longitude: -48.0678,
      rua: 'Rua do Teste',
      bairro: 'Centro',
      cidade: 'Pradópolis',
    });

    const btnConfirmar = screen.getByRole('button', { name: /Confirmar localização e prosseguir/i });
    fireEvent.click(btnConfirmar);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toBeInTheDocument();
    expect(
      screen.getByText('Erro de permissão no bucket Supabase Storage')
    ).toBeInTheDocument();
    expect(api.criarSolicitacao).not.toHaveBeenCalled();
    expect(btnConfirmar).not.toBeDisabled();
  });
});
