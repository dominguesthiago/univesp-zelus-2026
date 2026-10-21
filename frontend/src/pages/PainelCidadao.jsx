import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, LogOut, PlusCircle, List, User } from 'lucide-react';
import './PainelCidadao.scss';

/**
 * Painel Provisório do Cidadão (PainelCidadao.jsx)
 * Destino pós-autenticação contendo a sessão ativa e dados do munícipe.
 */
const PainelCidadao = () => {
  const navigate = useNavigate();
  const [cidadao, setCidadao] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('zelus_token');
    const dadosSalvos = localStorage.getItem('zelus_cidadao');

    if (dadosSalvos) {
      try {
        setCidadao(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error('Erro ao interpretar dados do cidadão:', e);
      }
    }

    // Se não houver token, permite navegação ou fallback seguro
    if (!token) {
      // Caso não esteja autenticado, pode optar por redirecionar
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('zelus_token');
    localStorage.removeItem('zelus_cidadao');
    navigate('/login/cidadao');
  };

  const primeiroNome = cidadao?.nome_completo
    ? cidadao.nome_completo.split(' ')[0]
    : 'Cidadão';

  return (
    <main id="conteudo-principal" className="painel-cidadao" tabIndex={-1}>
      <div className="painel-cidadao__container">
        {/* Cabeçalho de Boas-Vindas */}
        <header className="painel-cidadao__header">
          <div className="painel-cidadao__greeting">
            <h1 className="painel-cidadao__title">
              Olá, <span className="painel-cidadao__highlight">{primeiroNome}</span>!
            </h1>
            <p className="painel-cidadao__subtitle">
              Bem-vindo ao seu espaço de colaboração e zeladoria urbana no ZELUS.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="painel-cidadao__logout-btn"
            aria-label="Sair da conta e encerrar sessão"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Sair</span>
          </button>
        </header>

        {/* Cartão de Pontuação / Cidadania Ativa */}
        <section
          className="painel-cidadao__score-card"
          aria-labelledby="score-card-title"
        >
          <div className="painel-cidadao__score-icon-wrap" aria-hidden="true">
            <Award size={32} />
          </div>
          <div className="painel-cidadao__score-info">
            <h2 id="score-card-title" className="painel-cidadao__score-title">
              Pontuação de Cidadania
            </h2>
            <p className="painel-cidadao__score-desc">
              Você acumula pontos a cada zeladoria reportada e validada pela prefeitura.
            </p>
          </div>
          <div className="painel-cidadao__score-badge" aria-label={`${cidadao?.pontos || 0} pontos acumulados`}>
            <span className="painel-cidadao__score-number">{cidadao?.pontos || 0}</span>
            <span className="painel-cidadao__score-label">pontos</span>
          </div>
        </section>

        {/* Grade de Ações Rápidas */}
        <section
          className="painel-cidadao__actions-section"
          aria-labelledby="actions-section-title"
        >
          <h2 id="actions-section-title" className="painel-cidadao__section-title">
            Serviços Disponíveis
          </h2>

          <div className="painel-cidadao__cards-grid">
            <div className="painel-card">
              <div className="painel-card__icon painel-card__icon--blue" aria-hidden="true">
                <PlusCircle size={28} />
              </div>
              <h3 className="painel-card__title">Nova Solicitação</h3>
              <p className="painel-card__desc">
                Reporte buracos, iluminação apagada, descarte irregular de entulho e mais.
              </p>
              <button
                type="button"
                className="painel-card__button"
                onClick={() => alert('Módulo de Abertura de Solicitação em desenvolvimento.')}
              >
                Abrir Chamado
              </button>
            </div>

            <div className="painel-card">
              <div className="painel-card__icon painel-card__icon--green" aria-hidden="true">
                <List size={28} />
              </div>
              <h3 className="painel-card__title">Minhas Solicitações</h3>
              <p className="painel-card__desc">
                Acompanhe o andamento das solicitações que você abriu na sua comunidade.
              </p>
              <button
                type="button"
                className="painel-card__button"
                onClick={() => alert('Módulo de Acompanhamento em desenvolvimento.')}
              >
                Ver Histórico
              </button>
            </div>

            <div className="painel-card">
              <div className="painel-card__icon painel-card__icon--orange" aria-hidden="true">
                <User size={28} />
              </div>
              <h3 className="painel-card__title">Meus Dados</h3>
              <p className="painel-card__desc">
                Gerencie suas informações cadastrais, e-mail de contato e telefone WhatsApp.
              </p>
              <button
                type="button"
                className="painel-card__button"
                onClick={() => alert('Módulo de Perfil em desenvolvimento.')}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PainelCidadao;
