import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import NovaSolicitacaoStep3 from '../pages/NovaSolicitacaoStep3';

// Componente auxiliar para capturar o state repassado para a Etapa 4
const MockEtapa4 = () => {
  const location = useLocation();
  return (
    <div data-testid="etapa-4-screen" data-state={JSON.stringify(location.state || {})}>
      Etapa 4 - Confirmação
    </div>
  );
};

const renderStep3 = (initialState = null) => {
  const entry = initialState
    ? { pathname: '/solicitacao/etapa-3', state: initialState }
    : '/solicitacao/etapa-3';

  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/solicitacao/etapa-3" element={<NovaSolicitacaoStep3 />} />
        <Route path="/solicitacao/etapa-2" element={<div>Etapa 2 - Subcategorias</div>} />
        <Route path="/solicitacao/etapa-4" element={<MockEtapa4 />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Nova Solicitação - Etapa 3: Captura de Foto e GPS (NovaSolicitacaoStep3.jsx)', () => {
  let mockStream;
  let mockTrack;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Mock do track de vídeo
    mockTrack = {
      stop: jest.fn(),
    };

    // Mock do MediaStream
    mockStream = {
      getTracks: jest.fn(() => [mockTrack]),
    };

    // Mock de navigator.mediaDevices.getUserMedia
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue(mockStream),
      },
      writable: true,
      configurable: true,
    });

    // Mock de HTMLMediaElement.prototype.play
    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);

    // Mock de navigator.geolocation.getCurrentPosition
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: jest.fn((success) => {
          success({
            coords: {
              latitude: -23.55052,
              longitude: -46.633308,
              accuracy: 12,
            },
          });
        }),
      },
      writable: true,
      configurable: true,
    });

    // Mock de HTMLCanvasElement.prototype.getContext e toDataURL
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      drawImage: jest.fn(),
    }));
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/jpeg;base64,mockBase64String');
  });

  test('deve renderizar o cabeçalho institucional com marca ZELUS e botão "< Voltar" para a Etapa 2', () => {
    renderStep3();

    const linkVoltar = screen.getByRole('link', { name: /Voltar para a Etapa 2/i });
    expect(linkVoltar).toBeInTheDocument();
    expect(linkVoltar).toHaveAttribute('href', '/solicitacao/etapa-2');

    expect(screen.getByText('ZELUS')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toBeInTheDocument();
    expect(screen.getByText('Zeladoria Urbana')).toHaveStyle({ color: '#ffffff' });
  });

  test('deve renderizar o título e a indicação de etapa conforme a especificação oficial', () => {
    renderStep3();

    const titulo = screen.getByRole('heading', {
      level: 1,
      name: /Tire a foto da solicitação/i,
    });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveClass('nova-solicitacao-titulo');
    expect(screen.getByText('Etapa 3 de 4')).toBeInTheDocument();
  });

  test('deve renderizar o visor da câmera com as classes de isolamento de CSS e elementos de viewfinder', () => {
    const { container } = renderStep3();

    expect(container.querySelector('.nova-solicitacao-wrapper--step3')).toBeInTheDocument();
    expect(container.querySelector('.nova-solicitacao-card-mobile--step3')).toBeInTheDocument();
    expect(container.querySelector('.step3-main-container')).toBeInTheDocument();
    expect(container.querySelector('.step3-camera-area')).toBeInTheDocument();

    const cameraViewport = container.querySelector('.step3-camera-viewport');
    expect(cameraViewport).toBeInTheDocument();

    expect(container.querySelector('.step3-viewfinder-overlay')).toBeInTheDocument();
    expect(container.querySelector('.step3-vf-rec-label')).toHaveTextContent('REC');
  });

  test('deve renderizar o botão "TIRAR FOTO" com a classe neobrutalista padronizada', () => {
    const { container } = renderStep3();

    const botaoCapturarTexto = screen.getByText(/TIRAR FOTO/i);
    expect(botaoCapturarTexto).toBeInTheDocument();

    const elementoBotaoOuLabel = container.querySelector('.step3-btn-capturar');
    expect(elementoBotaoOuLabel).toBeInTheDocument();
    expect(elementoBotaoOuLabel).toHaveClass('step3-btn-capturar');
  });

  test('ao clicar em "TIRAR FOTO" com a câmera ativa, deve capturar o frame em base64, obter o GPS e navegar para a Etapa 4', async () => {
    renderStep3({
      categoria: 'asfalto',
      categoriaTitulo: 'Asfalto / Rua',
      subcategoriaId: 'buraco-na-via',
      subcategoriaTitulo: 'Buraco na via',
    });

    // Aguarda o botão no estado 'ready'
    const botao = await screen.findByRole('button', {
      name: /Tirar foto e capturar coordenadas GPS/i,
    });
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);

    // Aguarda transição para a Etapa 4
    const telaEtapa4 = await screen.findByTestId('etapa-4-screen');
    expect(telaEtapa4).toBeInTheDocument();

    const stateRecebido = JSON.parse(telaEtapa4.getAttribute('data-state'));
    expect(stateRecebido.categoria).toBe('asfalto');
    expect(stateRecebido.subcategoriaId).toBe('buraco-na-via');
    expect(stateRecebido.foto).toBe('data:image/jpeg;base64,mockBase64String');
    expect(stateRecebido.latitude).toBe(-23.55052);
    expect(stateRecebido.longitude).toBe(-46.633308);

    // Verifica persistência no localStorage
    const rascunhoSalvo = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
    expect(rascunhoSalvo.foto).toBe('data:image/jpeg;base64,mockBase64String');
    expect(rascunhoSalvo.latitude).toBe(-23.55052);
    expect(rascunhoSalvo.longitude).toBe(-46.633308);
  });

  test('no modo fallback (câmera inline indisponível), o input nativo deve possuir accept="image/*" e capture="environment" e navegar no onChange', async () => {
    // Força falha no getUserMedia para acionar o modo fallback/erro em todas as tentativas
    navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error('Permission Denied'));

    class MockFileReader {
      readAsDataURL() {
        this.onload({ target: { result: 'data:image/jpeg;base64,mockFotoNativa' } });
      }
    }
    const originalFileReader = window.FileReader;
    window.FileReader = MockFileReader;

    const { container } = renderStep3({
      categoria: 'bueiro',
      subcategoriaId: 'entupido-transbordando',
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Toque no botão "TIRAR FOTO" abaixo para fotografar com seu celular/i)
      ).toBeInTheDocument();
    });

    const inputNativo = container.querySelector('#step3-camera-input');
    expect(inputNativo).toBeInTheDocument();
    expect(inputNativo).toHaveAttribute('type', 'file');
    expect(inputNativo).toHaveAttribute('accept', 'image/*');
    expect(inputNativo).toHaveAttribute('capture', 'environment');

    // Simula a seleção de arquivo fotográfico no input
    const file = new File(['mock-image-content'], 'foto.jpg', { type: 'image/jpeg' });
    fireEvent.change(inputNativo, { target: { files: [file] } });

    // Verifica se navegou para a Etapa 4 com os dados capturados
    const telaEtapa4 = await screen.findByTestId('etapa-4-screen');
    expect(telaEtapa4).toBeInTheDocument();

    const stateRecebido = JSON.parse(telaEtapa4.getAttribute('data-state'));
    expect(stateRecebido.foto).toBe('data:image/jpeg;base64,mockFotoNativa');
    expect(stateRecebido.latitude).toBe(-23.55052);
    expect(stateRecebido.longitude).toBe(-46.633308);

    window.FileReader = originalFileReader;
  });
});
