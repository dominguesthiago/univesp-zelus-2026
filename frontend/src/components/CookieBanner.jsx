import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import './CookieBanner.scss';

/**
 * Componente CookieBanner
 * Exibe um banner fixo de rodapé para ciência e consentimento sobre o uso
 * estrito de armazenamento local (tokens JWT e preferências de UI) sob a LGPD.
 * Persiste a decisão no localStorage sob a chave 'zelus_termo_aceito'.
 */
const CookieBanner = () => {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      const consentimento = localStorage.getItem('zelus_termo_aceito');
      if (consentimento !== 'true') {
        setVisivel(true);
      }
    } catch (error) {
      // Fallback gracioso caso o localStorage esteja bloqueado pelo navegador
      console.warn('Acesso ao localStorage restrito:', error);
      setVisivel(true);
    }
  }, []);

  const handleAceitar = () => {
    try {
      localStorage.setItem('zelus_termo_aceito', 'true');
    } catch (error) {
      console.warn('Não foi possível gravar no localStorage:', error);
    }
    setVisivel(false);
  };

  if (!visivel) {
    return null;
  }

  return (
    <aside
      className="cookie-banner"
      role="region"
      aria-label="Aviso de Privacidade e Armazenamento Local"
    >
      <div className="cookie-banner__container">
        <div className="cookie-banner__content">
          <div className="cookie-banner__icon-wrapper" aria-hidden="true">
            <ShieldCheck className="cookie-banner__icon" size={24} />
          </div>
          <div className="cookie-banner__text">
            <p className="cookie-banner__message">
              O <strong>ZELUS</strong> utiliza armazenamento local essencial (tokens de sessão e preferências de acessibilidade)
              para garantir a segurança e o pleno funcionamento da plataforma de zeladoria urbana municipal, em conformidade com a 
              Lei Geral de Proteção de Dados (LGPD). Não utilizamos cookies de terceiros ou rastreamento comercial.{' '}
              <a
                href="/politica-privacidade"
                className="cookie-banner__link"
                title="Acessar a Política de Privacidade e Proteção de Dados do ZELUS"
              >
                Conheça a nossa Política de Privacidade
              </a>.
            </p>
          </div>
        </div>

        <div className="cookie-banner__actions">
          <button
            type="button"
            className="cookie-banner__button"
            onClick={handleAceitar}
            aria-label="Aceitar e dispensar aviso de privacidade e armazenamento local"
          >
            Entendido e Concordar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieBanner;
