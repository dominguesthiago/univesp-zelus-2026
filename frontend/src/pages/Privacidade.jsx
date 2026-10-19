import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Privacidade.scss';

/**
 * Página Política de Privacidade e Cookies (rota "/politica-privacidade")
 * Texto PROVISÓRIO: será substituído pela política oficial.
 * Descreve apenas o que o app faz hoje (chave 'zelus_termo_aceito').
 */
const Privacidade = () => {
  useEffect(() => {
    document.title = 'Política de Privacidade e Cookies | ZELUS';
  }, []);

  return (
    <div className="privacidade container">
      <h1 className="privacidade__title">Política de Privacidade e Cookies</h1>

      <p className="privacidade__aviso">
        <strong>Texto provisório.</strong> Este conteúdo é um resumo inicial e será
        substituído pela política oficial do ZELUS.
      </p>

      <section className="privacidade__section">
        <h2>O que é armazenamento local</h2>
        <p>
          O armazenamento local (<code>localStorage</code>) é um espaço do seu navegador
          em que um site pode guardar pequenas informações. Elas ficam no seu
          dispositivo e só são lidas pelo próprio site.
        </p>
      </section>

      <section className="privacidade__section">
        <h2>O que o ZELUS armazena</h2>
        <p>Atualmente, o ZELUS guarda no seu navegador apenas:</p>
        <ul>
          <li>
            <code>zelus_termo_aceito</code>: registra que você leu e aceitou o aviso de
            privacidade, para que ele não seja exibido novamente.
          </li>
        </ul>
        <p>
          Quando houver login e preferências de acessibilidade, informações como a
          sessão de acesso e o tema escolhido poderão ser guardadas da mesma forma. Esta
          página será atualizada nesse momento.
        </p>
      </section>

      <section className="privacidade__section">
        <h2>O que não fazemos</h2>
        <ul>
          <li>Não usamos cookies de publicidade.</li>
          <li>Não fazemos rastreamento comercial.</li>
          <li>Não compartilhamos seus dados para fins de marketing.</li>
        </ul>
      </section>

      <section className="privacidade__section">
        <h2>Como limpar esses dados</h2>
        <p>
          Você pode apagar os dados guardados pelo ZELUS a qualquer momento nas
          configurações de privacidade do seu navegador, na opção de limpar dados de
          navegação ou dados de sites.
        </p>
      </section>

      <Link to="/" className="privacidade__back">
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default Privacidade;
