import React from 'react';
import ActionCard from '../components/ActionCard';
import ilustracaoCidadao from '../assets/images/ilustracao-cidadao.png';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';
import './Home.scss';

/**
 * Página Home (rota "/")
 * Contém apenas o conteúdo principal: <h1> e os dois cards de acesso.
 * Header e Footer são renderizados pelo App, fora do <main>.
 */
const Home = () => {
  // TODO: substituir por navegação (useNavigate) quando as rotas /cidadao e /prefeitura existirem.
  const handleAcessoCidadao = () => {
    console.log('ActionCard clicado: acesso Cidadão');
  };

  const handleAcessoPrefeitura = () => {
    console.log('ActionCard clicado: acesso Prefeitura');
  };

  return (
    <div className="home container">
      <h1 className="home__title">Como deseja acessar o ZELUS?</h1>

      <div className="home__cards">
        <ActionCard
          title="Sou Cidadão"
          description="Registre ocorrências de zeladoria urbana e acompanhe o andamento no seu bairro."
          imageSrc={ilustracaoCidadao}
          altText=""
          colorClass="card-citizen"
          onClick={handleAcessoCidadao}
        />

        <ActionCard
          title="Sou da Prefeitura"
          description="Gerencie solicitações, organize equipes e acompanhe os serviços da cidade."
          imageSrc={ilustracaoPrefeitura}
          altText=""
          colorClass="card-admin"
          onClick={handleAcessoPrefeitura}
        />
      </div>
    </div>
  );
};

export default Home;
