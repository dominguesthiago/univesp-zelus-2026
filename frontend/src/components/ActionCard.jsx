import React from 'react';
import './ActionCard.scss';

/**
 * Componente ActionCard
 * Card de ação estruturado com a tag semântica <article> envolvendo o botão interativo <button>.
 * Fiel aos mockups oficiais Desktop e Mobile, com suporte a teclado e leitores de tela.
 *
 * Props:
 * @param {string}   title       Título do card (renderizado em <h2>).
 * @param {string}   description Descrição do serviço com ícone/emoji.
 * @param {string}   imageSrc    Origem da ilustração temática.
 * @param {string}   [altText]   Texto alternativo da imagem. Vazio = decorativa.
 * @param {string}   [colorClass] Classe de cor ('card-citizen' | 'card-admin').
 * @param {Function} onClick     Ação de navegação ou clique.
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
      <button
        type="button"
        className="action-card__button"
        onClick={onClick}
        aria-label={`Acessar ${title}`}
      >
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
        </div>
      </button>
    </article>
  );
};

export default ActionCard;
