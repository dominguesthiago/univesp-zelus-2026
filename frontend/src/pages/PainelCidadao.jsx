import React, { useEffect, useState } from 'react';
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
 * Dashboard colaborativo: boas-vindas, botão de nova solicitação e
 * lista rolável (scroll isolado) de "Minhas Solicitações Recentes".
 * O Header e o Footer institucionais são renderizados globalmente pelo App.js.
 */
const PainelCidadao = () => {
  const [cidadao, setCidadao] = useState(null);

  // Mock de dados (simulação até a integração com a API de solicitações)
  const solicitacoes = [
    { id: 1, tipo: 'Buraco na Rua / Asfalto', protocolo: '#3842', data: '10/11/2026', status: 'Pendente', imagem: ilustracaoBuraco },
    { id: 2, tipo: 'Bueiro / Boca-de-lobo', protocolo: '#1542', data: '08/11/2026', status: 'Concluído', imagem: ilustracaoBueiro },
    { id: 3, tipo: 'Descarte Irregular de Entulho', protocolo: '#3407', data: '25/10/2026', status: 'Pendente', imagem: ilustracaoEntulho },
  ];

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

  const primeiroNome = cidadao?.nome_completo
    ? cidadao.nome_completo.split(' ')[0]
    : 'Cidadão';

  const classeBadge = (status) =>
    status === 'Concluído' ? 'badge badge--concluido' : 'badge badge--pendente';

  return (
    <main id="conteudo-principal" className="painel-cidadao" tabIndex={-1}>
      {/* Área fixa: boas-vindas + botão principal (o "Sair" fica no Header) */}
      <div className="painel-cidadao__topo">
        <section className="painel-cidadao__boas-vindas" aria-labelledby="painel-titulo">
          <h1 id="painel-titulo" className="painel-cidadao__titulo">
            Olá, {primeiroNome}! 👋
          </h1>
          <p className="painel-cidadao__subtitulo">
            Acompanhe suas solicitações ou abra uma nova.
          </p>
        </section>

        <button type="button" className="painel-cidadao__cta">
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

        <ul className="painel-cidadao__lista" data-testid="lista-solicitacoes">
          {solicitacoes.map((item) => (
            <li key={item.id} className="solicitacao-card">
              <div className="solicitacao-card__icone">
                <img
                  src={item.imagem}
                  alt=""
                  aria-hidden="true"
                  className="solicitacao-card__imagem"
                  width="72"
                  height="72"
                />
              </div>
              <div className="solicitacao-card__info">
                <div className="solicitacao-card__topo">
                  <h3 className="solicitacao-card__tipo">{item.tipo}</h3>
                  <span className={classeBadge(item.status)}>
                    {item.status}{' '}
                    <span aria-hidden="true">{item.status === 'Concluído' ? '✓' : '⏳'}</span>
                  </span>
                </div>
                <p className="solicitacao-card__meta">
                  Protocolo: <strong>{item.protocolo}</strong>
                </p>
                <p className="solicitacao-card__meta">Data: {item.data}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default PainelCidadao;
