import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, AlertCircle } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './NovaSolicitacaoStep3.scss';

/**
 * Página: Nova Solicitação — Etapa 3 (Captura de Foto e Coordenadas GPS)
 *
 * Ajustes de UI e Consistência Global:
 * - Cabeçalho: Título e subtítulo ("Etapa 3 de 4") com as propriedades globais idênticas às Etapas 1 e 2.
 * - Visor Expandido: Contêiner da câmera aproveitando o espaço útil via Flexbox, perfeitamente centralizado.
 * - Botão no Padrão Home: Fundo verde-menta (#aaebd3), tipografia preta (#1a1a24) e borda/sombra neobrutalista sólida.
 * - Câmera Nativa / Fallback: Bloqueio de vídeo via accept="image/*" com capture="environment".
 * - Geolocalização Garantida: Captura do GPS realizada imediatamente no onChange da foto.
 */
const NovaSolicitacaoStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Referências para os elementos DOM de vídeo, input nativo e stream
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Estados locais para controle da câmera e do processo de captura
  const [cameraStatus, setCameraStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isCapturando, setIsCapturando] = useState(false);
  const [statusTexto, setStatusTexto] = useState('');

  // Resgate dos dados da etapa anterior com fallback do localStorage
  const dadosEtapaAnterior = (() => {
    try {
      const rascunho = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
      return {
        ...rascunho,
        ...(location.state || {}),
      };
    } catch {
      return location.state || {};
    }
  })();

  /**
   * Inicializa o feed de vídeo da câmera traseira (environment)
   */
  const iniciarCamera = async () => {
    setCameraStatus('loading');
    setErrorMessage('');

    // Encerra qualquer stream anterior caso exista
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Verifica compatibilidade com a API de MediaDevices (bloqueada em HTTP não-localhost em smartphones)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('error');
      setErrorMessage('Câmera em tempo real indisponível nesta conexão.');
      return;
    }

    try {
      // 1ª Tentativa: Solicita câmera traseira (environment)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStatus('ready');
        videoRef.current
          .play()
          .catch((err) => console.warn('Autoplay do vídeo não pôde ser iniciado:', err));
      }
    } catch (err1) {
      console.warn('Erro ao acessar câmera traseira com restrição ideal, tentando fallback geral:', err1);
      try {
        // 2ª Tentativa: Fallback para qualquer câmera disponível
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        streamRef.current = fallbackStream;

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          setCameraStatus('ready');
          videoRef.current
            .play()
            .catch((err) => console.warn('Autoplay do vídeo não pôde ser iniciado:', err));
        }
      } catch (err2) {
        console.error('Falha geral ao acessar a câmera:', err2);
        setCameraStatus('error');
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          setErrorMessage('Permissão da câmera bloqueada nas configurações.');
        } else {
          setErrorMessage('Não foi possível iniciar a câmera em tempo real.');
        }
      }
    }
  };

  // Inicializa a câmera ao montar o componente e garante limpeza no unmount
  useEffect(() => {
    iniciarCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /**
   * Captura o frame de vídeo atual do elemento <video> e converte para base64 JPEG
   */
  const capturarFrameBase64 = () => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement('canvas');
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 640;

    // Recorta o quadrado central idêntico ao visor
    const size = Math.min(vw, vh);
    const startX = (vw - size) / 2;
    const startY = (vh - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  /**
   * Obtém a geolocalização do usuário via navigator.geolocation com Promise resiliente
   */
  const obterGeolocalizacao = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocalização não suportada');
        resolve({ latitude: null, longitude: null, erro: 'Não suportado' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            acuracia: pos.coords.accuracy,
            erro: null,
          });
        },
        (err) => {
          console.warn('Erro ao capturar geolocalização:', err.message);
          resolve({
            latitude: null,
            longitude: null,
            erro: err.message,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        }
      );
    });
  };

  /**
   * Dispara a Captura Dupla quando a câmera inline está ativa: Foto Base64 + Coordenadas GPS
   */
  const handleCapturarFotoEPosicao = async () => {
    if (isCapturando) return;

    try {
      setIsCapturando(true);
      setStatusTexto('Capturando foto...');

      // 1. Extração do frame da câmera inline
      let fotoBase64 = capturarFrameBase64();

      if (!fotoBase64) {
        // Fallback emergencial: aciona o seletor nativo
        if (fileInputRef.current) {
          fileInputRef.current.click();
          setIsCapturando(false);
          return;
        }
      }

      // 2. Extração das coordenadas GPS
      setStatusTexto('Obtendo localização GPS...');
      const coords = await obterGeolocalizacao();

      // Encerra a transmissão de vídeo para liberar o hardware
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // 3. Montagem do pacote de estado completo
      const estadoCompleto = {
        ...dadosEtapaAnterior,
        foto: fotoBase64,
        latitude: coords.latitude,
        longitude: coords.longitude,
        coordenadas: coords,
        capturadoEm: new Date().toISOString(),
      };

      // Persistência no localStorage
      try {
        localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify(estadoCompleto));
      } catch (e) {
        console.warn('Não foi possível salvar rascunho completo:', e);
      }

      // 4. Navegação para a Etapa 4
      navigate('/solicitacao/etapa-4', {
        state: estadoCompleto,
      });
    } catch (error) {
      console.error('Erro durante a captura dupla:', error);
      setIsCapturando(false);
      setStatusTexto('');
    }
  };

  /**
   * Fallback nativo: captura fotográfica nativa do smartphone (onChange do input)
   * Garante a conversão para Base64 e a extração imediata das coordenadas GPS
   */
  const handleArquivoFallback = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      setIsCapturando(true);
      setStatusTexto('Processando foto...');

      // 1. Converte o arquivo para Base64
      const fotoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      // 2. Captura obrigatória da geolocalização do usuário via GPS
      setStatusTexto('Obtendo localização GPS...');
      const coords = await obterGeolocalizacao();

      // 3. Monta o pacote com o estado completo da solicitação
      const estadoCompleto = {
        ...dadosEtapaAnterior,
        foto: fotoBase64,
        latitude: coords.latitude,
        longitude: coords.longitude,
        coordenadas: coords,
        capturadoEm: new Date().toISOString(),
      };

      // 4. Salva no localStorage para persistência do rascunho
      try {
        localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify(estadoCompleto));
      } catch (err) {
        console.warn('Erro ao persistir rascunho:', err);
      }

      // 5. Navega imediatamente para a Etapa 4 repassando o estado
      navigate('/solicitacao/etapa-4', {
        state: estadoCompleto,
      });
    } catch (error) {
      console.error('Erro no processamento da foto e GPS:', error);
      setIsCapturando(false);
      setStatusTexto('');
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="nova-solicitacao-wrapper nova-solicitacao-wrapper--step3">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div
        className="nova-solicitacao-card-mobile nova-solicitacao-card-mobile--step3"
        role="region"
        aria-label="Nova Solicitação - Etapa 3: Captura de Foto"
      >
        {/* Cabeçalho azul institucional fiel ao padrão validado */}
        <header className="nova-solicitacao-header">
          <Link
            to="/solicitacao/etapa-2"
            state={location.state}
            className="nova-solicitacao-header__back-link"
            aria-label="Voltar para a Etapa 2"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Voltar</span>
          </Link>

          <div className="nova-solicitacao-header__brand">
            <div className="nova-solicitacao-header__title-row">
              <img
                src={logoZelusIcon}
                alt=""
                className="nova-solicitacao-header__logo-icon"
                width="22"
                height="22"
                aria-hidden="true"
              />
              <span className="nova-solicitacao-header__title">ZELUS</span>
            </div>
            <span
              className="nova-solicitacao-header__subtitle auth-header__subtitle"
              style={{ color: '#ffffff' }}
            >
              Zeladoria Urbana
            </span>
          </div>
        </header>

        {/* Área Central: Topo com Título + Câmera Expandida + Botão de Captura */}
        <main className="nova-solicitacao-main-container step3-main-container" id="conteudo-principal">
          {/* Topo fixo com título e indicador de etapa rigorosamente idêntico às Etapas 1 e 2 */}
          <div className="nova-solicitacao-topo">
            <h1 id="etapa3-heading" className="nova-solicitacao-titulo">
              Tire a foto da solicitação
            </h1>
            <p className="nova-solicitacao-etapa">Etapa 3 de 4</p>
          </div>

          {/* Área Flexbox que centraliza e expande o visor da câmera no espaço útil */}
          <div className="step3-camera-area">
            <div
              className="step3-camera-viewport"
              role="region"
              aria-label="Visor da câmera para foto da solicitação"
            >
              {/* Feed de vídeo HTML5 da Câmera Traseira (quando disponível) */}
              <video
                ref={videoRef}
                className={`step3-camera-video ${cameraStatus === 'ready' ? 'step3-camera-video--visible' : ''}`}
                autoPlay
                playsInline
                muted
                aria-label="Feed de vídeo em tempo real"
              />

              {/* Overlay Estilizado: Elementos de Visor Fotográfico (Viewfinder) */}
              <div className="step3-viewfinder-overlay" aria-hidden="true">
                {/* Barra superior do visor */}
                <div className="step3-vf-top-bar">
                  <div className="step3-vf-rec-indicator">
                    <span className="step3-vf-rec-dot" />
                    <span className="step3-vf-rec-label">REC</span>
                  </div>
                  <div className="step3-vf-battery">
                    <span className="step3-vf-battery-fill" />
                  </div>
                  <div className="step3-vf-cam-icon">
                    <Camera size={14} color="#ffffff" />
                  </div>
                </div>

                {/* Cantos Neobrutalistas do Visor (Brackets) */}
                <div className="step3-vf-bracket step3-vf-bracket--tl" />
                <div className="step3-vf-bracket step3-vf-bracket--tr" />
                <div className="step3-vf-bracket step3-vf-bracket--bl" />
                <div className="step3-vf-bracket step3-vf-bracket--br" />

                {/* Retículo Central de Foco */}
                <div className="step3-vf-crosshair">
                  <div className="step3-vf-corner-cross step3-vf-corner-cross--tl" />
                  <div className="step3-vf-corner-cross step3-vf-corner-cross--tr" />
                  <div className="step3-vf-corner-cross step3-vf-corner-cross--bl" />
                  <div className="step3-vf-corner-cross step3-vf-corner-cross--br" />
                </div>
              </div>

              {/* Estado de Carregamento / Aguardando Inicialização */}
              {cameraStatus === 'loading' && (
                <div className="step3-camera-state step3-camera-state--loading">
                  <div className="step3-camera-spinner" aria-hidden="true" />
                  <p className="step3-camera-state__texto">Aguardando permissão da câmera...</p>
                </div>
              )}

              {/* Estado de Erro / HTTP / Permissão Bloqueada (Limpo, sem botões secundários) */}
              {cameraStatus === 'error' && (
                <div className="step3-camera-state step3-camera-state--error">
                  <AlertCircle size={36} className="step3-camera-state__icon" aria-hidden="true" />
                  <p className="step3-camera-state__texto">{errorMessage}</p>
                  <p className="step3-camera-state__subtexto">
                    Toque no botão "TIRAR FOTO" abaixo para fotografar com seu celular.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Input nativo com accept="image/*" e capture="environment" obrigatórios para forçar foto */}
          <input
            id="step3-camera-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="step3-file-input-hidden"
            onChange={handleArquivoFallback}
            disabled={isCapturando}
            aria-label="Capturar foto usando a câmera fotográfica do dispositivo"
          />

          {/* Área Inferior: Botão TIRAR FOTO no padrão Home (+ NOVA SOLICITAÇÃO) */}
          <div className="step3-action-container">
            {cameraStatus === 'ready' ? (
              // Câmera inline ativa: clique dispara a captura via canvas + GPS
              <button
                type="button"
                className="step3-btn-capturar"
                onClick={handleCapturarFotoEPosicao}
                disabled={isCapturando}
                aria-label="Tirar foto e capturar coordenadas GPS"
              >
                {isCapturando ? (
                  <div className="step3-btn-capturando-wrapper">
                    <span className="step3-btn-spinner" aria-hidden="true" />
                    <span className="step3-btn-label">
                      {statusTexto || 'PROCESSANDO...'}
                    </span>
                  </div>
                ) : (
                  <div className="step3-btn-label-wrapper">
                    <span className="step3-btn-label">TIRAR FOTO</span>
                    <span className="step3-btn-camera-emoji" aria-hidden="true">📸</span>
                  </div>
                )}
              </button>
            ) : (
              // Câmera inline indisponível (HTTP/Permissão): botão se torna a label/gatilho para o input nativo
              <label
                htmlFor={isCapturando ? undefined : "step3-camera-input"}
                className={`step3-btn-capturar ${isCapturando ? 'step3-btn-capturar--disabled' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isCapturando && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }
                }}
                aria-label="Tirar foto com a câmera do celular e capturar localização GPS"
              >
                {isCapturando ? (
                  <div className="step3-btn-capturando-wrapper">
                    <span className="step3-btn-spinner" aria-hidden="true" />
                    <span className="step3-btn-label">
                      {statusTexto || 'PROCESSANDO...'}
                    </span>
                  </div>
                ) : (
                  <div className="step3-btn-label-wrapper">
                    <span className="step3-btn-label">TIRAR FOTO</span>
                    <span className="step3-btn-camera-emoji" aria-hidden="true">📸</span>
                  </div>
                )}
              </label>
            )}
          </div>
        </main>

        {/* Rodapé institucional ancorado na base */}
        <footer className="nova-solicitacao-footer-tagline">
          <span>ZELUS • Acessível e inclusivo para todos</span>
        </footer>
      </div>
    </div>
  );
};

export default NovaSolicitacaoStep3;
