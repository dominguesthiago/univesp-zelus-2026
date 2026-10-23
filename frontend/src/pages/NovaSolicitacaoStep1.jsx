import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import ilustracaoBuraco from '../assets/images/solicitacao-buraco.jpg';
import ilustracaoBueiro from '../assets/images/solicitacao-bueiro.jpg';
import ilustracaoEntulho from '../assets/images/solicitacao-entulho.jpg';
import './NovaSolicitacaoStep1.scss';

// Ícone SVG personalizado em estilo cartum para Iluminação Pública (Placeholder 90x90)
const IconeIluminacao = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#eff0da" />
    {/* Base do poste */}
    <rect x="36" y="74" width="18" height="6" rx="2" fill="#1a1a24" />
    {/* Coluna do poste */}
    <line x1="45" y1="26" x2="45" y2="74" stroke="#1a1a24" strokeWidth="5" strokeLinecap="round" />
    {/* Braço curvado */}
    <path d="M45 26C45 15 58 13 62 17" stroke="#1a1a24" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Cúpula da luminária */}
    <path d="M53 19L71 19L67 26L57 26Z" fill="#3b5998" stroke="#1a1a24" strokeWidth="2.5" />
    {/* Foco de luz */}
    <ellipse cx="62" cy="27" rx="4" ry="2" fill="#ffd15c" />
    <path d="M49 36L42 49" stroke="#eab308" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M62 36L62 52" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M75 36L82 49" stroke="#eab308" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

// Ícone SVG personalizado em estilo cartum para Sinalização (Placeholder 90x90)
const IconeSinalizacao = () => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="categoria-card__imagem categoria-card__svg"
    aria-hidden="true"
  >
    <rect width="90" height="90" rx="14" fill="#eff0da" />
    {/* Base do suporte */}
    <rect x="36" y="74" width="18" height="6" rx="2" fill="#1a1a24" />
    {/* Haste do poste */}
    <line x1="45" y1="46" x2="45" y2="74" stroke="#1a1a24" strokeWidth="5" strokeLinecap="round" />
    {/* Placa triangular de trânsito / alerta */}
    <polygon
      points="45,14 76,64 14,64"
      fill="#fbc02d"
      stroke="#1a1a24"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <polygon
      points="45,24 67,58 23,58"
      fill="#fbc02d"
      stroke="#1a1a24"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Símbolo de exclamação */}
    <line x1="45" y1="31" x2="45" y2="45" stroke="#1a1a24" strokeWidth="4" strokeLinecap="round" />
    <circle cx="45" cy="52" r="2.5" fill="#1a1a24" />
  </svg>
);

/**
 * Categorias disponíveis na Etapa 1 do fluxo de Nova Solicitação.
 * Cor gerenciada 100% pelo CSS (.categoria-card com background-color: #eff0da).
 * Inclui opções adicionais para teste de limite de scroll e overflow.
 */
export const CATEGORIAS = [
  {
    id: 'asfalto-rua',
    titulo: 'Asfalto / Rua',
    imagem: ilustracaoBuraco,
    alt: 'Ilustração de rua asfaltada com buraco, rachaduras e cones de trânsito',
    emConstrucao: false,
  },
  {
    id: 'bueiro-boca-de-lobo',
    titulo: 'Bueiro / Boca-de-lobo',
    imagem: ilustracaoBueiro,
    alt: 'Ilustração de bueiro metálico com acúmulo de lixo e escoamento de água',
    emConstrucao: false,
  },
  {
    id: 'iluminacao-publica',
    titulo: 'Iluminação Pública',
    imagemComponente: IconeIluminacao,
    alt: 'Ícone de poste de iluminação pública com lâmpada acesa',
    emConstrucao: true,
  },
  {
    id: 'lixo-entulho',
    titulo: 'Lixo / Entulho',
    imagem: ilustracaoEntulho,
    alt: 'Ilustração de descarte irregular de entulho e resíduos na calçada',
    emConstrucao: true,
  },
  {
    id: 'sinalizacao',
    titulo: 'Sinalização',
    imagemComponente: IconeSinalizacao,
    alt: 'Ícone de placa triangular de sinalização e advertência de trânsito',
    emConstrucao: true,
  },
];

export const CATEGORIAS_SOLICITACAO = CATEGORIAS;

/**
 * Página: Nova Solicitação — Etapa 1 (Escolha de Categoria)
 * Arquitetura de 3 camadas com moldura mobile/smartphone:
 * 1. Header institucional azul com botão "< Voltar" SVG e respiro anti-colisão.
 * 2. Main com topo fixo ("Qual o tipo de problema..." / "Etapa 1 de 4") e scroll isolado exclusivamente nos botões de categoria.
 * 3. Footer institucional ancorado na base ("ZELUS • Acessível e inclusivo para todos").
 */
const NovaSolicitacaoStep1 = () => {
  const navigate = useNavigate();

  const handleSelecionarCategoria = (categoria) => {
    // Persistência local do estado da solicitação para as etapas subsequentes
    const dadosAtuais = {
      categoriaId: categoria.id,
      categoriaTitulo: categoria.titulo,
      emConstrucao: Boolean(categoria.emConstrucao),
      atualizadoEm: new Date().toISOString(),
    };
    try {
      localStorage.setItem('zelus_rascunho_solicitacao', JSON.stringify(dadosAtuais));
    } catch (e) {
      console.warn('Não foi possível salvar rascunho da solicitação:', e);
    }

    // Navega para a Etapa 2 passando o contexto selecionado
    navigate('/solicitacao/etapa-2', {
      state: {
        categoria: categoria.id,
        categoriaTitulo: categoria.titulo,
        emConstrucao: Boolean(categoria.emConstrucao),
      },
    });
  };

  return (
    <div className="nova-solicitacao-wrapper">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div
        className="nova-solicitacao-card-mobile"
        role="region"
        aria-label="Nova Solicitação - Etapa 1: Escolha da Categoria"
      >
        {/* Cabeçalho azul institucional fiel ao padrão validado */}
        <header className="nova-solicitacao-header">
          <Link
            to="/cidadao/painel"
            className="nova-solicitacao-header__back-link"
            aria-label="Voltar para o Painel do Cidadão"
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
            <h1 id="etapa1-heading" className="nova-solicitacao-titulo">
              Qual solicitação deseja criar?
            </h1>
            <p className="nova-solicitacao-etapa">Etapa 1 de 4</p>
          </div>

          {/* Contêiner com Scroll Isolado e Expansível APENAS para os botões */}
          <div
            className="nova-solicitacao-lista-categorias"
            role="group"
            aria-labelledby="etapa1-heading"
          >
            {CATEGORIAS.map((categoria) => {
              const ImagemComp = categoria.imagemComponente;

              return (
                <button
                  key={categoria.id}
                  type="button"
                  className="categoria-card"
                  onClick={() => handleSelecionarCategoria(categoria)}
                  aria-label={`Selecionar categoria ${categoria.titulo}${
                    categoria.emConstrucao ? ' (EM CONSTRUÇÃO)' : ''
                  }`}
                >
                  <div className="categoria-card__icone-wrapper">
                    {ImagemComp ? (
                      <ImagemComp />
                    ) : (
                      <img
                        src={categoria.imagem}
                        alt={categoria.alt}
                        className="categoria-card__imagem"
                        width="90"
                        height="90"
                      />
                    )}
                  </div>
                  <div className="categoria-card__textos">
                    <span className="categoria-card__titulo">{categoria.titulo}</span>
                    {categoria.emConstrucao && (
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

export default NovaSolicitacaoStep1;
