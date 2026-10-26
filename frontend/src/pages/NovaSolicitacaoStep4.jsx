import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pencil, Camera } from 'lucide-react';
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
 * - Botão "CONFIRMAR" no verde-menta padronizado e link "Cancelar" acessível.
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
  };

  // Clique no botão "CONFIRMAR": Loga os dados finais no console e atualiza o rascunho
  const handleConfirmar = () => {
    // 1. Gera protocolo visual provisório (ex: #1543-2026)
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    const anoAtual = new Date().getFullYear();
    const protocoloGerado = `#${numeroAleatorio}-${anoAtual}`;

    const dadosFinais = {
      ...dadosIniciais,
      rua: endereco.rua,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      enderecoConfirmado: {
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
      },
      protocolo: protocoloGerado,
      confirmadoEm: new Date().toISOString(),
    };

    console.log('[ZELUS Etapa 4] Dados finais da solicitação confirmados:', dadosFinais);

    // 2. Salva no histórico de chamados e atualiza rascunho no localStorage
    try {
      const historicoAnterior = JSON.parse(localStorage.getItem('zelus_historico_chamados') || '[]');
      const novoHistorico = [dadosFinais, ...historicoAnterior];
      localStorage.setItem('zelus_historico_chamados', JSON.stringify(novoHistorico));
      localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify(dadosFinais));
    } catch (e) {
      console.warn('Erro ao salvar no histórico de chamados do localStorage:', e);
    }

    // 3. Redireciona para a Tela de Sucesso (Etapa 5 / Conclusão)
    navigate('/solicitacao/sucesso', {
      state: dadosFinais,
    });
  };

  // Clique no botão/link "Cancelar solicitação" com confirmação explícita
  const handleCancelar = () => {
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
                />
              </label>
              <Pencil size={18} className="step4-input-icon" aria-hidden="true" />
            </div>

            {/* Ações: Botão CONFIRMAR e Link Cancelar solicitação */}
            <div className="step4-actions">
              <button
                type="button"
                className="step4-btn-confirmar"
                onClick={handleConfirmar}
                aria-label="Confirmar localização e prosseguir"
              >
                CONFIRMAR
              </button>

              <button
                type="button"
                className="step4-btn-cancelar"
                onClick={handleCancelar}
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
