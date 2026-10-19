import React from 'react';
import './Footer.scss';

/**
 * Componente Footer
 * Rodapé global do ZELUS. Renderizado fora do <main> para expor
 * o landmark "contentinfo" corretamente a tecnologias assistivas.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__text">ZELUS • Acessível e inclusivo para todos</p>
    </footer>
  );
};

export default Footer;
