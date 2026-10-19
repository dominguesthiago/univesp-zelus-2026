import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

/**
 * Página 404 (rota curinga "*")
 * Exibida quando o endereço não corresponde a nenhuma rota.
 * Observação: em SPA a resposta HTTP continua 200; um 404 real depende do servidor.
 */
const NotFound = () => {
  useEffect(() => {
    document.title = 'Página não encontrada | ZELUS';
  }, []);

  return (
    <div className="not-found container">
      {/* Numeral decorativo: o título abaixo já comunica o erro */}
      <p className="not-found__code" aria-hidden="true">
        404
      </p>

      <h1 className="not-found__title">Página não encontrada</h1>

      <p className="not-found__text">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>

      <Link to="/" className="not-found__back">
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;
