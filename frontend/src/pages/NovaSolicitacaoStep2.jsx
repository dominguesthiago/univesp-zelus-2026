import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import ilustracaoBuraco from '../assets/images/solicitacao-buraco.jpg';
import ilustracaoBueiro from '../assets/images/solicitacao-bueiro.jpg';
import './NovaSolicitacaoStep2.scss';

// ==============================================================
// Ícones Vetoriais Neobrutalistas para a Categoria Asfalto
// ==============================================================
const IconeRecapeamento = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    <rect x="14" y="58" width="62" height="18" rx="4" fill="#374151" stroke="#1a1a24" strokeWidth="3" />
    <line x1="22" y1="67" x2="36" y2="67" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
    <line x1="44" y1="67" x2="58" y2="67" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
    <line x1="66" y1="67" x2="70" y2="67" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
    <circle cx="34" cy="52" r="14" fill="#6b7280" stroke="#1a1a24" strokeWidth="3.5" />
    <circle cx="34" cy="52" r="5" fill="#1a1a24" />
    <rect x="34" y="32" width="30" height="18" rx="4" fill="#f59e0b" stroke="#1a1a24" strokeWidth="3.5" />
    <circle cx="64" cy="52" r="10" fill="#4b5563" stroke="#1a1a24" strokeWidth="3" />
    <rect x="42" y="20" width="16" height="14" rx="2" fill="#bfdbfe" stroke="#1a1a24" strokeWidth="2.5" />
  </svg>
);

const IconePinturaFaixa = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    <rect x="15" y="16" width="60" height="58" rx="8" fill="#374151" stroke="#1a1a24" strokeWidth="3.5" />
    <rect x="23" y="24" width="10" height="42" rx="2" fill="#ffffff" stroke="#1a1a24" strokeWidth="2" />
    <rect x="40" y="24" width="10" height="42" rx="2" fill="#ffffff" stroke="#1a1a24" strokeWidth="2" />
    <rect x="57" y="24" width="10" height="42" rx="2" fill="#ffffff" stroke="#1a1a24" strokeWidth="2" />
    <rect x="36" y="12" width="22" height="8" rx="2" fill="#fbbf24" stroke="#1a1a24" strokeWidth="2.5" />
    <path d="M47 20L47 30L60 30L60 38" stroke="#1a1a24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const IconeLombada = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    <rect x="14" y="60" width="62" height="14" rx="2" fill="#374151" stroke="#1a1a24" strokeWidth="3" />
    <path
      d="M18 60C26 60 30 42 45 42C60 42 64 60 72 60"
      fill="#f59e0b"
      stroke="#1a1a24"
      strokeWidth="3.5"
    />
    <line x1="36" y1="46" x2="33" y2="58" stroke="#1a1a24" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="45" y1="44" x2="45" y2="58" stroke="#1a1a24" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="54" y1="46" x2="57" y2="58" stroke="#1a1a24" strokeWidth="3.5" strokeLinecap="round" />
    <polygon points="45,16 62,34 28,34" fill="#fbbf24" stroke="#1a1a24" strokeWidth="3" strokeLinejoin="round" />
    <path d="M38 29C41 24 49 24 52 29" stroke="#1a1a24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ==============================================================
// Ícones Vetoriais Neobrutalistas para a Categoria Bueiro
// ==============================================================
const IconeBueiroQuebrado = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    {/* Meio-fio e calçada */}
    <rect x="14" y="20" width="62" height="14" rx="2" fill="#9ca3af" stroke="#1a1a24" strokeWidth="3" />
    {/* Vão do bueiro / buraco aberto */}
    <rect x="20" y="34" width="50" height="26" rx="4" fill="#1f2937" stroke="#1a1a24" strokeWidth="3" />
    {/* Tampa quebrada deslocada */}
    <g transform="rotate(-15 45 45)">
      <rect x="24" y="30" width="42" height="16" rx="2" fill="#4b5563" stroke="#1a1a24" strokeWidth="2.5" />
      <line x1="32" y1="30" x2="32" y2="46" stroke="#1a1a24" strokeWidth="2" />
      <line x1="45" y1="30" x2="45" y2="46" stroke="#1a1a24" strokeWidth="2" />
      <line x1="58" y1="30" x2="58" y2="46" stroke="#1a1a24" strokeWidth="2" />
    </g>
    {/* Placa de alerta com exclamação */}
    <polygon points="66,54 80,78 52,78" fill="#ef4444" stroke="#1a1a24" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="66" y1="62" x2="66" y2="70" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="66" cy="74" r="1.5" fill="#ffffff" />
  </svg>
);

const IconeLimpezaPreventiva = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    {/* Grade metálica do bueiro */}
    <rect x="16" y="44" width="58" height="28" rx="4" fill="#4b5563" stroke="#1a1a24" strokeWidth="3" />
    <line x1="28" y1="44" x2="28" y2="72" stroke="#1a1a24" strokeWidth="2.5" />
    <line x1="45" y1="44" x2="45" y2="72" stroke="#1a1a24" strokeWidth="2.5" />
    <line x1="62" y1="44" x2="62" y2="72" stroke="#1a1a24" strokeWidth="2.5" />
    {/* Mangueira de sucção e água de alta pressão */}
    <path d="M22 18C30 18 36 28 48 30L68 32" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" fill="none" />
    <polygon points="68,26 80,32 68,38" fill="#38bdf8" stroke="#1a1a24" strokeWidth="2" />
    {/* Gotas de água */}
    <circle cx="34" cy="36" r="3" fill="#38bdf8" />
    <circle cx="56" cy="40" r="2.5" fill="#38bdf8" />
    {/* Estrela de brilho / limpo */}
    <path d="M72 14L74 20L80 22L74 24L72 30L70 24L64 22L70 20Z" fill="#fbbf24" stroke="#1a1a24" strokeWidth="1.5" />
  </svg>
);

const IconeDesinsetizacao = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    {/* Bueiro ao fundo */}
    <rect x="18" y="52" width="54" height="22" rx="3" fill="#6b7280" stroke="#1a1a24" strokeWidth="3" />
    <line x1="32" y1="52" x2="32" y2="74" stroke="#1a1a24" strokeWidth="2" />
    <line x1="45" y1="52" x2="45" y2="74" stroke="#1a1a24" strokeWidth="2" />
    <line x1="58" y1="52" x2="58" y2="74" stroke="#1a1a24" strokeWidth="2" />
    {/* Pulverizador / Spray */}
    <rect x="22" y="24" width="20" height="22" rx="4" fill="#10b981" stroke="#1a1a24" strokeWidth="2.5" />
    <rect x="27" y="18" width="10" height="6" fill="#1a1a24" />
    <path d="M37 20L50 20" stroke="#1a1a24" strokeWidth="3" strokeLinecap="round" />
    {/* Névoa de spray */}
    <circle cx="56" cy="18" r="2" fill="#10b981" />
    <circle cx="64" cy="20" r="3" fill="#10b981" />
    <circle cx="58" cy="26" r="2.5" fill="#10b981" />
    {/* Inseto / Praga sob controle */}
    <ellipse cx="62" cy="40" rx="7" ry="5" fill="#b45309" stroke="#1a1a24" strokeWidth="2" />
    <circle cx="56" cy="40" r="3" fill="#1a1a24" />
    <line x1="58" y1="35" x2="54" y2="30" stroke="#1a1a24" strokeWidth="1.5" />
    <line x1="58" y1="45" x2="54" y2="50" stroke="#1a1a24" strokeWidth="1.5" />
  </svg>
);

const IconeReparoEstrutural = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#F4ECDC" />
    {/* Tijolos e bloco de alvenaria */}
    <rect x="14" y="44" width="30" height="14" rx="2" fill="#ea580c" stroke="#1a1a24" strokeWidth="2.5" />
    <rect x="46" y="44" width="30" height="14" rx="2" fill="#ea580c" stroke="#1a1a24" strokeWidth="2.5" />
    <rect x="22" y="60" width="46" height="14" rx="2" fill="#9ca3af" stroke="#1a1a24" strokeWidth="2.5" />
    <line x1="45" y1="60" x2="45" y2="74" stroke="#1a1a24" strokeWidth="2" />
    {/* Colher de pedreiro / Ferramenta de reparo */}
    <polygon points="45,16 62,32 36,32" fill="#d1d5db" stroke="#1a1a24" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M45 32L45 38L52 42" stroke="#1a1a24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="53" cy="43" r="3" fill="#b45309" stroke="#1a1a24" strokeWidth="1.5" />
  </svg>
);

// ==============================================================
// Configurações Dinâmicas por Categoria
// ==============================================================
export const CONFIG_CATEGORIAS = {
  asfalto: {
    titulo: 'Qual serviço de Asfalto / Rua deseja solicitar?',
    subcategorias: [
      {
        id: 'buraco-na-via',
        titulo: 'Buraco na via',
        imagem: ilustracaoBuraco,
        alt: 'Ilustração de buraco no asfalto com cones de sinalização',
        emConstrucao: false,
      },
      {
        id: 'recapeamento',
        titulo: 'Recapeamento',
        imagemComponente: IconeRecapeamento,
        alt: 'Ícone de recapeamento asfáltico',
        emConstrucao: true,
      },
      {
        id: 'pintura-de-faixa',
        titulo: 'Pintura de Faixa',
        imagemComponente: IconePinturaFaixa,
        alt: 'Ícone de pintura de faixa de pedestres na via',
        emConstrucao: true,
      },
      {
        id: 'lombada',
        titulo: 'Lombada',
        imagemComponente: IconeLombada,
        alt: 'Ícone de redutor de velocidade e lombada na via',
        emConstrucao: true,
      },
    ],
  },
  bueiro: {
    titulo: 'Qual serviço de Bueiro / Boca-de-lobo deseja solicitar?',
    subcategorias: [
      {
        id: 'entupido-transbordando',
        titulo: 'Entupido / Transbordando',
        imagem: ilustracaoBueiro,
        alt: 'Ilustração de bueiro metálico com escoamento de água e resíduos',
        emConstrucao: false,
      },
      {
        id: 'sem-tampa-quebrado',
        titulo: 'Sem Tampa / Quebrado',
        imagemComponente: IconeBueiroQuebrado,
        alt: 'Ícone de bueiro aberto sem tampa e com placa de alerta',
        emConstrucao: false,
      },
      {
        id: 'limpeza-preventiva',
        titulo: 'Limpeza Preventiva',
        imagemComponente: IconeLimpezaPreventiva,
        alt: 'Ícone de limpeza e desobstrução preventiva do bueiro',
        emConstrucao: true,
      },
      {
        id: 'desinsetizacao',
        titulo: 'Desinsetização',
        imagemComponente: IconeDesinsetizacao,
        alt: 'Ícone de controle de pragas e desinsetização de bueiro',
        emConstrucao: true,
      },
      {
        id: 'reparo-estrutural',
        titulo: 'Reparo Estrutural',
        imagemComponente: IconeReparoEstrutural,
        alt: 'Ícone de reparo e alvenaria estrutural na boca-de-lobo',
        emConstrucao: true,
      },
    ],
  },
};

// ==============================================================
// Mapeamento e Associação de Subcategorias Reais (UUIDs)
// ==============================================================
const normalizarTexto = (texto) =>
  (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const associarSubcategoriasReais = (subcategoriasConfig, subcategoriasDb = []) => {
  if (!Array.isArray(subcategoriasDb) || subcategoriasDb.length === 0) {
    return subcategoriasConfig;
  }

  return subcategoriasConfig.map((subConfig) => {
    const tituloConfig = normalizarTexto(subConfig.titulo);

    // Tenta encontrar correspondência por similaridade de nome com o banco
    const match = subcategoriasDb.find((sDb) => {
      const nomeDb = normalizarTexto(sDb.nome || sDb.titulo);
      if (!nomeDb) return false;
      return (
        tituloConfig.includes(nomeDb) ||
        nomeDb.includes(tituloConfig) ||
        (tituloConfig.includes('tampa') && nomeDb.includes('tampa')) ||
        (tituloConfig.includes('buraco') && nomeDb.includes('buraco')) ||
        (tituloConfig.includes('entupido') && nomeDb.includes('entupido'))
      );
    });

    if (match && match.id) {
      return {
        ...subConfig,
        id: match.id,
        subcategoria_id: match.id,
      };
    }

    return subConfig;
  });
};

/**
 * Página: Nova Solicitação — Etapa 2 (Subcategorias Dinâmicas)
 * Renderização dinâmica baseada no estado de navegação (useLocation):
 * - Suporta 'asfalto' e 'bueiro'
 * - Fallback automático para 'asfalto' caso location.state seja nulo
 * - Mantém a moldura mobile simulada e botões neobrutalistas com cor #F4ECDC
 */
const NovaSolicitacaoStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera rascunho anterior para fallback seguro
  const rascunhoLocal = (() => {
    try {
      return JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
    } catch {
      return {};
    }
  })();

  // Leitura do estado recebido via react-router-dom com fallback para localStorage
  const categoriaRecebida =
    location.state?.categoria ||
    rascunhoLocal?.categoria ||
    location.state?.categoriaTitulo ||
    rascunhoLocal?.categoriaTitulo;

  // Condicional de seleção da configuração da categoria com fallback para 'asfalto'
  let categoriaKey = 'asfalto';
  if (
    typeof categoriaRecebida === 'string' &&
    (categoriaRecebida.toLowerCase().includes('bueiro') ||
      categoriaRecebida.toLowerCase().includes('boca'))
  ) {
    categoriaKey = 'bueiro';
  } else {
    categoriaKey = 'asfalto';
  }

  const { titulo, subcategorias } = CONFIG_CATEGORIAS[categoriaKey] || CONFIG_CATEGORIAS.asfalto;
  const subcategoriasDb = location.state?.subcategorias || rascunhoLocal?.subcategorias || [];
  const subcategoriasParaExibicao = associarSubcategoriasReais(subcategorias, subcategoriasDb);

  const handleSelecionarSubcategoria = (subcategoria) => {
    // Persistência local do estado da solicitação com o UUID real
    let dadosAtualizados = null;
    try {
      const rascunhoAnterior = JSON.parse(localStorage.getItem('zelus_rascunho_solicitacao') || '{}');
      dadosAtualizados = {
        ...rascunhoAnterior,
        categoria: categoriaKey,
        categoriaId: location.state?.categoriaId || rascunhoAnterior.categoriaId,
        categoriaTitulo:
          location.state?.categoriaTitulo ||
          rascunhoAnterior.categoriaTitulo ||
          (categoriaKey === 'bueiro' ? 'Bueiro / Boca-de-lobo' : 'Asfalto / Rua'),
        subcategoriaId: subcategoria.id,
        subcategoria_id: subcategoria.id,
        subcategoriaTitulo: subcategoria.titulo,
        emConstrucao: Boolean(subcategoria.emConstrucao),
        atualizadoEm: new Date().toISOString(),
      };
      localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify(dadosAtualizados));
    } catch (e) {
      console.warn('Não foi possível salvar o rascunho da subcategoria:', e);
    }

    if (!subcategoria.emConstrucao) {
      // Rota funcional ativa: Navega para a Etapa 3 (Captura de Foto e GPS)
      navigate('/solicitacao/etapa-3', {
        state: dadosAtualizados || {
          ...location.state,
          categoria: categoriaKey,
          categoriaTitulo:
            location.state?.categoriaTitulo ||
            (categoriaKey === 'bueiro' ? 'Bueiro / Boca-de-lobo' : 'Asfalto / Rua'),
          subcategoriaId: subcategoria.id,
          subcategoria_id: subcategoria.id,
          subcategoriaTitulo: subcategoria.titulo,
        },
      });
    }
  };

  return (
    <div className="nova-solicitacao-wrapper">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div
        className="nova-solicitacao-card-mobile"
        role="region"
        aria-label={`Nova Solicitação - Etapa 2: Subcategorias de ${categoriaKey}`}
      >
        {/* Cabeçalho azul institucional fiel ao padrão validado */}
        <header className="nova-solicitacao-header">
          <Link
            to="/solicitacao/etapa-1"
            className="nova-solicitacao-header__back-link"
            aria-label="Voltar para a Etapa 1: Categorias"
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

        {/* Área Central: Topo Fixo + Scroll Isolado dos Botões */}
        <main className="nova-solicitacao-main-container" id="conteudo-principal">
          {/* Topo fixo com título e indicador de etapa */}
          <div className="nova-solicitacao-topo">
            <h1 id="etapa2-heading" className="nova-solicitacao-titulo">
              {titulo}
            </h1>
            <p className="nova-solicitacao-etapa">Etapa 2 de 4</p>
          </div>

          {/* Contêiner com Scroll Isolado e Expansível APENAS para os botões */}
          <div
            className="nova-solicitacao-lista-categorias"
            role="group"
            aria-labelledby="etapa2-heading"
          >
            {subcategoriasParaExibicao.map((subcategoria) => {
              const ImagemComp = subcategoria.imagemComponente;

              return (
                <button
                  key={subcategoria.id}
                  type="button"
                  className="categoria-card categoria-card--step2"
                  onClick={() => handleSelecionarSubcategoria(subcategoria)}
                  aria-label={`Selecionar subcategoria ${subcategoria.titulo}${
                    subcategoria.emConstrucao ? ' (EM CONSTRUÇÃO)' : ''
                  }`}
                >
                  <div className="categoria-card__icone-wrapper">
                    {ImagemComp ? (
                      <ImagemComp />
                    ) : (
                      <img
                        src={subcategoria.imagem}
                        alt={subcategoria.alt}
                        className="categoria-card__imagem"
                        width="90"
                        height="90"
                      />
                    )}
                  </div>
                  <div className="categoria-card__textos">
                    <span className="categoria-card__titulo">{subcategoria.titulo}</span>
                    {subcategoria.emConstrucao && (
                      <span className="categoria-card__badge-construcao">EM CONSTRUÇÃO</span>
                    )}
                  </div>
                </button>
              );
            })}
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

export default NovaSolicitacaoStep2;
