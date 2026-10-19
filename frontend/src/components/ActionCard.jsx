import React from 'react';
import './ActionCard.scss';

/**
 * Componente ActionCard
 * Card reutilizável de ação principal da tela inicial (Cidadão e Prefeitura).
 * O elemento interativo é um <button> nativo, garantindo foco e ativação por
 * teclado (Enter/Espaço) sem ARIA adicional.
 *
 * Props:
 * @param {string}   title       Título do card (renderizado como <h2>).
 * @param {string}   description Texto de apoio do card.
 * @param {string}   imageSrc    Origem da ilustração (importada pelo componente pai).
 * @param {string}   [altText]   Texto alternativo. Vazio = imagem decorativa.
 * @param {string}   [colorClass] Modificador de tema ('card-citizen' | 'card-admin').
 * @param {Function} onClick     Ação disparada ao ativar o card.
 */
const ActionCard = ({
  title,
  description,
  imageSrc,
  altText = '',
  colorClass = '',
  onClick,
}) => {
  const decorativa = altText === '';

  return (
    <article className={`action-card ${colorClass}`.trim()}>
      <img
        src={imageSrc}
        alt={altText}
        aria-hidden={decorativa ? 'true' : undefined}
        width="600"
        height="450"
        className="action-card__image"
      />

      <div className="action-card__body">
        <h2 className="action-card__title">{title}</h2>
        <p className="action-card__description">{description}</p>

        <button
          type="button"
          className="action-card__button"
          onClick={onClick}
          aria-label={`Acessar ${title}`}
        >
          Acessar
        </button>
      </div>
    </article>
  );
};

export default ActionCard;
