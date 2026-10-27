import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pencil, Camera, AlertTriangle } from 'lucide-react';
import { criarSolicitacao } from '../services/api';
import { uploadFotoSolicitacao } from '../services/supabaseStorage';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './NovaSolicitacaoStep4.scss';

/**
 * Página: Nova Solicitação — Etapa 4 (Confirme o local)
 *
 * Arquitetura e Decisões de UI/UX:
 * - Herança estrita do Design System Neobrutalista das Etapas 1, 2 e 3.
 * - Cabeçalho: Link < Voltar para Etapa 3, logotipo ZELUS e subtítulo "Zeladoria Urbana".
 * - Miniatura: Renderiza a foto em Base64 obtida na Etapa 3 com borda e sombra cartoon.
 * - Geocodificação Reversa: Chamada assíncrona para API do Nominatim (OpenStreetMap)
 *   preenchendo automaticamente Rua, Bairro e Cidade.
 * - Campo Número: Mantido obrigatoriamente vazio para digitação ativa do munícipe.
 * - Todos os 4 campos são inputs controlados (editáveis livremente).
 * - Integração Transacional: Submissão real para POST /api/solicitacoes via criarSolicitacao().
 * - Gestão de Estado: Anti-double-submit com estado enviando, feedback de spinner,
 *   tratamento de erro 409 (Filtro Espacial Haversine) e limpeza do rascunho pós-sucesso.
 * - Sucesso: Transição para a Etapa 5 repassando o protocolo oficial emitido pelo backend.
 */
const NovaSolicitacaoStep4 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Resgate dos dados das etapas anteriores (location.state com fallback de localStorage)
  const dadosIniciais = (() => {
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

  // Estados locais controlados dos campos de endereço
  const [endereco, setEndereco] = useState({
    rua: dadosIniciais.rua || '',
    numero: dadosIniciais.numero || '', // Obrigatoriamente em branco por padrão
    bairro: dadosIniciais.bairro || '',
    cidade: dadosIniciais.cidade || '',
  });

  const [carregandoEndereco, setCarregandoEndereco] = useState(false);
  const [fotoPreview] = useState(dadosIniciais.foto || null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  // Efeito para buscar o endereço reverso via Nominatim caso haja latitude e longitude
  useEffect(() => {
    // Se a rua já tiver sido preenchida previamente no rascunho, preserva a edição do usuário
    if (endereco.rua) {
      return;
    }

    const lat = dadosIniciais.latitude || (dadosIniciais.coordenadas && dadosIniciais.coordenadas.latitude);
    const lon = dadosIniciais.longitude || (dadosIniciais.coordenadas && dadosIniciais.coordenadas.longitude);

    if (!lat || !lon) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const buscarEnderecoReverso = async () => {
      setCarregandoEndereco(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'pt-BR,pt;q=0.9',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na API Nominatim: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (isMounted && data && data.address) {
          const addr = data.address;
          const ruaEncontrada =
            addr.road ||
            addr.pedestrian ||
            addr.street ||
            addr.footway ||
            addr.path ||
            addr.residential ||
            '';

          const bairroEncontrado =
            addr.suburb ||
            addr.neighbourhood ||
            addr.city_district ||
            addr.quarter ||
            addr.district ||
            '';

          const cidadeEncontrada =
            addr.city ||
            addr.town ||
            addr.municipality ||
            addr.village ||
            addr.county ||
            '';

          setEndereco((prev) => ({
            ...prev,
            rua: ruaEncontrada,
            numero: '', // Sempre vazio para validação humana
            bairro: bairroEncontrado,
            cidade: cidadeEncontrada,
          }));
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('[ZELUS Step4] Não foi possível obter o endereço reverso automaticamente:', err);
        }
      } finally {
        if (isMounted) {
          setCarregandoEndereco(false);
        }
      }
    };

    buscarEnderecoReverso();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []); // Executa apenas na montagem

  // Manipulador genérico para atualização dos inputs controlados
  const handleInputChange = (campo, valor) => {
    setEndereco((prev) => ({
      ...prev,
      [campo]: valor,
    }));
    // Limpa mensagem de erro ao editar campos
    if (erroEnvio) {
      setErroEnvio(null);
    }
  };

  // Clique no botão "CONFIRMAR": Envia a solicitação real para o backend
  const handleConfirmar = async () => {
    if (enviando) return;

    // Validação mínima dos campos obrigatórios no frontend
    if (!endereco.rua.trim() || !endereco.bairro.trim() || !endereco.cidade.trim()) {
      setErroEnvio('Por favor, preencha os campos obrigatórios (Rua, Bairro e Cidade).');
      return;
    }

    setEnviando(true);
    setErroEnvio(null);

    // 1. Upload da foto para o Supabase Storage (se houver foto capturada)
    let urlFotoPublica = null;
    if (dadosIniciais.foto) {
      try {
        urlFotoPublica = await uploadFotoSolicitacao(dadosIniciais.foto);
      } catch (uploadErr) {
        console.error('Erro no upload da foto para o Supabase Storage:', uploadErr);
        setErroEnvio(
          uploadErr.message ||
            'Não foi possível enviar a foto para o armazenamento. Verifique sua conexão e tente novamente.'
        );
        setEnviando(false);
        return;
      }
    }

    // 2. Monta o payload conforme contrato com backend POST /api/solicitacoes
    const subcategoriaId = dadosIniciais.subcategoria_id || dadosIniciais.subcategoriaId;
    const lat = Number(dadosIniciais.latitude || dadosIniciais.coordenadas?.latitude || 0);
    const lon = Number(dadosIniciais.longitude || dadosIniciais.coordenadas?.longitude || 0);
    const descricao = (
      dadosIniciais.subcategoriaTitulo ||
      dadosIniciais.categoriaTitulo ||
      'Solicitação de Zeladoria Urbana'
    ).trim();

    const payloadEnvio = {
      subcategoria_id: subcategoriaId,
      latitude: lat,
      longitude: lon,
      descricao: descricao,
      rua: endereco.rua.trim(),
      numero: endereco.numero ? endereco.numero.trim() : 'S/N',
      ponto_referencia: endereco.ponto_referencia ? endereco.ponto_referencia.trim() : null,
      bairro: endereco.bairro.trim(),
      cidade: endereco.cidade.trim(),
      foto_url: urlFotoPublica,
    };

    try {
      const resposta = await criarSolicitacao(payloadEnvio);

      if (resposta && resposta.sucesso) {
        const protocoloServidor = resposta.protocolo;
        const dadosFinais = {
          ...dadosIniciais,
          ...payloadEnvio,
          protocolo: protocoloServidor,
          id: resposta.dados?.id,
          criadoEm: resposta.dados?.created_at || new Date().toISOString(),
        };

        // Limpa o rascunho temporário após submissão bem-sucedida
        try {
          localStorage.removeItem('zelus_rascunho_solicitacao');
        } catch (e) {
          console.warn('Erro ao limpar rascunho temporário pós-criação:', e);
        }

        // Redireciona para a Tela de Sucesso com o protocolo oficial
        navigate('/solicitacao/sucesso', {
          state: dadosFinais,
        });
      } else {
        setErroEnvio(resposta?.mensagem || 'Não foi possível registrar a solicitação. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao submeter solicitação:', err);
      // Tratamento específico de status HTTP do backend
      if (err.status === 409) {
        setErroEnvio(err.message || 'Já existe um problema deste tipo registado a menos de 10 metros daqui.');
      } else if (err.status === 400) {
        setErroEnvio(err.message || 'Dados incompletos. Faltam parâmetros obrigatórios.');
      } else {
        setErroEnvio(err.message || 'Falha na comunicação com o servidor. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  // Clique no botão/link "Cancelar solicitação" com confirmação explícita
  const handleCancelar = () => {
    if (enviando) return;

    const confirmou = window.confirm(
      'Tem certeza que deseja cancelar esta solicitação? Todos os dados serão perdidos.'
    );

    if (confirmou) {
      try {
        localStorage.removeItem('zelus_rascunho_solicitacao');
      } catch (e) {
        console.warn('Erro ao remover rascunho de solicitação:', e);
      }
      navigate('/cidadao/painel');
    }
  };

  return (
    <div className="nova-solicitacao-wrapper nova-solicitacao-wrapper--step4">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div
        className="nova-solicitacao-card-mobile nova-solicitacao-card-mobile--step4"
        role="region"
        aria-label="Nova Solicitação - Etapa 4 de 4: Confirme o Local"
      >
        {/* Cabeçalho azul institucional fiel ao padrão validado */}
        <header className="nova-solicitacao-header">
          <Link
            to="/solicitacao/etapa-3"
            state={dadosIniciais}
            className="nova-solicitacao-header__back-link"
            aria-label="Voltar para a Etapa 3: Captura de Foto"
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

        {/* Área Central: Topo Fixo + Miniatura + 4 Inputs Controlados */}
        <main className="nova-solicitacao-main-container step4-main-container" id="conteudo-principal">
          {/* Topo fixo com título e indicador de etapa rigorosamente idêntico às Etapas 1, 2 e 3 */}
          <div className="nova-solicitacao-topo">
            <h1 id="etapa4-heading" className="nova-solicitacao-titulo">
              Confirme o local
            </h1>
            <p className="nova-solicitacao-etapa">Etapa 4 de 4</p>
          </div>

          {/* Miniatura da foto capturada na Etapa 3 */}
          <div className="step4-thumbnail-container">
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Foto registrada da ocorrência urbana"
                className="step4-thumbnail-img"
              />
            ) : (
              <div className="step4-thumbnail-placeholder" aria-label="Nenhuma foto registrada">
                <Camera size={32} className="step4-thumbnail-placeholder-icon" aria-hidden="true" />
                <span>Sem foto</span>
              </div>
            )}
          </div>

          {/* Indicador discreto de busca de endereço */}
          {carregandoEndereco && (
            <div className="step4-status-feedback" role="status" aria-live="polite">
              <span className="step4-status-spinner" aria-hidden="true" />
              <span>Localizando endereço via GPS...</span>
            </div>
          )}

          {/* Formulário com os 4 campos neobrutalistas com ícone de lápis */}
          <form className="step4-form" onSubmit={(e) => e.preventDefault()}>
            {/* Campo 1: Rua */}
            <div className="step4-input-group">
              <label htmlFor="campo-rua" className="step4-input-label">
                <span className="step4-input-prefix">Rua:</span>
                <input
                  id="campo-rua"
                  type="text"
                  className="step4-input-field"
                  value={endereco.rua}
                  onChange={(e) => handleInputChange('rua', e.target.value)}
                  placeholder="Digite o nome da rua"
                  aria-label="Nome da rua"
                  disabled={enviando}
                />
              </label>
              <Pencil size={18} className="step4-input-icon" aria-hidden="true" />
            </div>

            {/* Campo 2: Número (em branco e com foco acessível) */}
            <div className="step4-input-group">
              <label htmlFor="campo-numero" className="step4-input-label">
                <span className="step4-input-prefix">Número:</span>
                <input
                  id="campo-numero"
                  type="text"
                  className="step4-input-field"
                  value={endereco.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder="Digite o número"
                  aria-label="Número predial ou de referência"
                  disabled={enviando}
                />
              </label>
              <Pencil size={18} className="step4-input-icon" aria-hidden="true" />
            </div>

            {/* Campo 3: Bairro */}
            <div className="step4-input-group">
              <label htmlFor="campo-bairro" className="step4-input-label">
                <span className="step4-input-prefix">Bairro:</span>
                <input
                  id="campo-bairro"
                  type="text"
                  className="step4-input-field"
                  value={endereco.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder="Digite o bairro"
                  aria-label="Nome do bairro"
                  disabled={enviando}
                />
              </label>
              <Pencil size={18} className="step4-input-icon" aria-hidden="true" />
            </div>

            {/* Campo 4: Cidade */}
            <div className="step4-input-group">
              <label htmlFor="campo-cidade" className="step4-input-label">
                <span className="step4-input-prefix">Cidade:</span>
                <input
                  id="campo-cidade"
                  type="text"
                  className="step4-input-field"
                  value={endereco.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder="Digite a cidade"
                  aria-label="Nome da cidade"
                  disabled={enviando}
                />
              </label>
              <Pencil size={18} className="step4-input-icon" aria-hidden="true" />
            </div>

            {/* Ações: Feedback de Erro + Botão CONFIRMAR e Link Cancelar */}
            <div className="step4-actions">
              {erroEnvio && (
                <div role="alert" className="step4-erro" aria-live="assertive">
                  <AlertTriangle size={20} className="step4-erro__icone" aria-hidden="true" />
                  <p className="step4-erro__texto">{erroEnvio}</p>
                </div>
              )}

              <button
                type="button"
                className={`step4-btn-confirmar ${enviando ? 'step4-btn-confirmar--loading' : ''}`}
                onClick={handleConfirmar}
                disabled={enviando}
                aria-label={enviando ? 'Enviando solicitação ao servidor...' : 'Confirmar localização e prosseguir'}
              >
                {enviando ? (
                  <>
                    <span className="step4-btn-spinner" aria-hidden="true" />
                    <span>ENVIANDO...</span>
                  </>
                ) : (
                  'CONFIRMAR'
                )}
              </button>

              <button
                type="button"
                className="step4-btn-cancelar"
                onClick={handleCancelar}
                disabled={enviando}
                aria-label="Cancelar solicitação e voltar ao painel"
              >
                Cancelar solicitação
              </button>
            </div>
          </form>
        </main>

        {/* Rodapé institucional ancorado na base */}
        <footer className="nova-solicitacao-footer-tagline">
          <span>ZELUS • Acessível e inclusivo para todos</span>
        </footer>
      </div>
    </div>
  );
};

export default NovaSolicitacaoStep4;
