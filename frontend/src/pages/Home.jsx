import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '../components/ActionCard';
import ilustracaoCidadao from '../assets/images/ilustracao-cidadao.png';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';
import './Home.scss';

/**
 * Página Inicial (Home.jsx)
 * Estrutura 100% semântica com <main>, <header>, <section> e <footer>.
 * Os cards de ação internos utilizam a tag semântica <article>.
 * Alinhada fielmente com os mockups oficiais de Desktop e Mobile.
 */
const Home = () => {
  const navigate = useNavigate();

  const handleAcessoCidadao = () => {
    navigate('/login/cidadao');
  };

  const handleAcessoPrefeitura = () => {
    navigate('/login/prefeitura');
  };


  return (
    <main className="home container" id="conteudo-principal">
      <header className="home__header">
        <h1 className="home__title">Como deseja acessar o ZELUS?</h1>
      </header>

      <section className="home__cards" aria-label="Opções de acesso ao sistema ZELUS">
        <ActionCard
          title="SOU CIDADÃO"
          description="Relatar buracos, bueiros, lixo e acompanhar meus chamados. 📱"
          imageSrc={ilustracaoCidadao}
          altText="Ilustração do portal do cidadão com munícipes e casas"
          colorClass="card-citizen"
          onClick={handleAcessoCidadao}
        />

        <ActionCard
          title="ACESSO PREFEITURA"
          description="Painel administrativo, gestão de ocorrências e auditoria. 💻"
          imageSrc={ilustracaoPrefeitura}
          altText="Ilustração da prefeitura e servidor público com gráficos"
          colorClass="card-admin"
          onClick={handleAcessoPrefeitura}
        />
      </section>

      <footer className="home__footer">
        <p className="home__tagline">ZELUS • Acessível e inclusivo para todos</p>
      </footer>
    </main>
  );
};

export default Home;
