import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCw, Inbox } from 'lucide-react';
import { listarMinhasSolicitacoes } from '../services/api';
import ilustracaoBuraco from '../assets/images/solicitacao-buraco.jpg';
import ilustracaoBueiro from '../assets/images/solicitacao-bueiro.jpg';
import ilustracaoEntulho from '../assets/images/solicitacao-entulho.jpg';
import './PainelCidadao.scss';

/**
 * Classe aplicada em <html> e <body> enquanto o painel está montado.
 * Garante a "Regra de Ouro": a tela não rola; apenas a lista de solicitações.
 */
const CLASSE_TELA_TRAVADA = 'painel-cidadao-ativo';

/**
 * Painel do Cidadão (PainelCidadao.jsx)
 * Dashboard colaborativo com consumo da API REST (GET /api/solicitacoes/minhas):
 * - Boas-vindas personalizadas resgatando dados do cidadão autenticado.
 * - Botão "+ NOVA SOLICITAÇÃO 📱" para início do fluxo transacional.
 * - Lista dinâmica com estados de carga (Skeletons), resiliência (Retry) e Empty State.
 * - Preservação da "Regra de Ouro" de isolamento estrito de rolagem.
 */
const PainelCidadao = () => {
  const navigate = useNavigate();
  const [cidadao, setCidadao] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca do perfil do cidadão salvo no localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('zelus_cidadao');
    if (dadosSalvos) {
      try {
        setCidadao(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error('Erro ao interpretar dados do cidadão:', e);
      }
    }
  }, []);

  // Trava a rolagem do documento enquanto o painel estiver ativo
  useEffect(() => {
    document.documentElement.classList.add(CLASSE_TELA_TRAVADA);
    document.body.classList.add(CLASSE_TELA_TRAVADA);
    return () => {
      document.documentElement.classList.remove(CLASSE_TELA_TRAVADA);
      document.body.classList.remove(CLASSE_TELA_TRAVADA);
    };
  }, []);

  // Busca as solicitações reais do cidadão autenticado
  const carregarSolicitacoes = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await listarMinhasSolicitacoes();
      if (resposta && Array.isArray(resposta.dados)) {
        setSolicitacoes(resposta.dados);
      } else {
        setSolicitacoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar solicitações do cidadão:', err);
      setErro('Não foi possível carregar suas solicitações. Verifique sua conexão e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  const primeiroNome = cidadao?.nome_completo
    ? cidadao.nome_completo.split(' ')[0]
    : 'Cidadão';

  // Resolvedor de imagem com fallback inteligente
  const obterImagemSolicitacao = (item) => {
    if (item.foto_url) {
      return item.foto_url;
    }
    const texto = (item.subcategorias?.nome || item.descricao || '').toLowerCase();
    if (texto.includes('bueiro') || texto.includes('boca')) {
      return ilustracaoBueiro;
    }
    if (texto.includes('lixo') || texto.includes('entulho')) {
      return ilustracaoEntulho;
    }
    return ilustracaoBuraco;
  };

  // Mapeamento semântico de status e ícones
  const formatarStatus = (status) => {
    switch (status) {
      case 'Concluído':
        return { classe: 'badge badge--concluido', icone: '✓' };
      case 'Em Andamento':
        return { classe: 'badge badge--andamento', icone: '⚙️' };
      case 'Descartada':
        return { classe: 'badge badge--descartada', icone: '✕' };
      case 'Pendente':
      default:
        return { classe: 'badge badge--pendente', icone: '⏳' };
    }
  };

  // Formatação de data em pt-BR
  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    try {
      const data = new Date(dataIso);
      if (isNaN(data.getTime())) return dataIso;
      return data.toLocaleDateString('pt-BR');
    } catch {
      return dataIso;
    }
  };

  return (
    <main id="conteudo-principal" className="painel-cidadao" tabIndex={-1}>
      {/* Área fixa: boas-vindas + botão principal */}
      <div className="painel-cidadao__topo">
        <section className="painel-cidadao__boas-vindas" aria-labelledby="painel-titulo">
          <h1 id="painel-titulo" className="painel-cidadao__titulo">
            Olá, {primeiroNome}! 👋
          </h1>
          <p className="painel-cidadao__subtitulo">
            Acompanhe suas solicitações ou abra uma nova.
          </p>
        </section>

        <button
          type="button"
          className="painel-cidadao__cta"
          onClick={() => navigate('/solicitacao/etapa-1')}
        >
          + NOVA SOLICITAÇÃO 📱
        </button>
      </div>

      {/* Área flexível: único contêiner com rolagem */}
      <section
        className="painel-cidadao__solicitacoes"
        aria-labelledby="solicitacoes-titulo"
      >
        <h2 id="solicitacoes-titulo" className="painel-cidadao__secao-titulo">
          Minhas Solicitações Recentes
        </h2>

        {/* 1. Estado de Carregamento (Skeletons) */}
        {carregando && (
          <div
            role="status"
            aria-label="Carregando suas solicitações..."
            className="painel-cidadao__lista painel-cidadao__lista--loading"
          >
            <span className="sr-only">Carregando suas solicitações...</span>
            {[1, 2, 3].map((n) => (
              <div key={n} className="solicitacao-card solicitacao-card--skeleton" aria-hidden="true">
                <div className="solicitacao-card__icone">
                  <div className="skeleton-box" style={{ width: '72px', height: '72px' }} />
                </div>
                <div className="solicitacao-card__info" style={{ gap: '8px' }}>
                  <div className="skeleton-box" style={{ width: '60%', height: '18px' }} />
                  <div className="skeleton-box" style={{ width: '40%', height: '14px' }} />
                  <div className="skeleton-box" style={{ width: '30%', height: '14px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Estado de Erro com Retry */}
        {!carregando && erro && (
          <div role="alert" className="painel-erro">
            <AlertTriangle size={32} color="#991b1b" aria-hidden="true" />
            <p className="painel-erro__texto">{erro}</p>
            <button
              type="button"
              className="painel-erro__btn-retry"
              onClick={carregarSolicitacoes}
              aria-label="Tentar carregar solicitações novamente"
            >
              <RotateCw size={16} aria-hidden="true" />
              <span>TENTAR NOVAMENTE</span>
            </button>
          </div>
        )}

        {/* 3. Estado de Lista Vazia (Empty State) */}
        {!carregando && !erro && solicitacoes.length === 0 && (
          <div
            className="painel-empty-state"
            role="region"
            aria-label="Nenhuma solicitação registrada"
          >
            <Inbox size={42} className="painel-empty-state__icone" aria-hidden="true" />
            <h3 className="painel-empty-state__titulo">Nenhuma solicitação encontrada</h3>
            <p className="painel-empty-state__texto">
              Você ainda não registrou nenhum chamado de zeladoria urbana. Quando abrir uma solicitação,
              ela aparecerá aqui para você acompanhar o andamento da equipe da prefeitura.
            </p>
            <button
              type="button"
              className="painel-empty-state__cta"
              onClick={() => navigate('/solicitacao/etapa-1')}
              aria-label="Criar minha primeira solicitação de zeladoria"
            >
              + CRIAR MINHA PRIMEIRA SOLICITAÇÃO 📱
            </button>
          </div>
        )}

        {/* 4. Lista Dinâmica de Solicitações Reais */}
        {!carregando && !erro && solicitacoes.length > 0 && (
          <ul className="painel-cidadao__lista" data-testid="lista-solicitacoes">
            {solicitacoes.map((item) => {
              const { classe: statusClasse, icone: statusIcone } = formatarStatus(item.status);
              const imagemSrc = obterImagemSolicitacao(item);
              const tipoTitulo = item.subcategorias?.nome || item.descricao || 'Solicitação';
              const dataFormatada = formatarData(item.created_at || item.data);
              const enderecoLinha = item.rua
                ? `${item.rua}${item.numero ? `, ${item.numero}` : ''}${item.bairro ? ` - ${item.bairro}` : ''}`
                : null;

              return (
                <li key={item.id} className="solicitacao-card">
                  <div className="solicitacao-card__icone">
                    <img
                      src={imagemSrc}
                      alt=""
                      aria-hidden="true"
                      className="solicitacao-card__imagem"
                      width="72"
                      height="72"
                    />
                  </div>
                  <div className="solicitacao-card__info">
                    <div className="solicitacao-card__topo">
                      <h3 className="solicitacao-card__tipo">{tipoTitulo}</h3>
                      <span className={statusClasse}>
                        {item.status || 'Pendente'}{' '}
                        <span aria-hidden="true">{statusIcone}</span>
                      </span>
                    </div>
                    <p className="solicitacao-card__meta">
                      Protocolo: <strong>{item.protocolo}</strong>
                    </p>
                    {enderecoLinha && (
                      <p className="solicitacao-card__meta">
                        {enderecoLinha}
                      </p>
                    )}
                    {dataFormatada && (
                      <p className="solicitacao-card__meta">Data: {dataFormatada}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};

export default PainelCidadao;
