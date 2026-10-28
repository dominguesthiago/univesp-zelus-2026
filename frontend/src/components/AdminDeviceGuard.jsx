import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, ArrowLeft, Home } from 'lucide-react';
import './AdminDeviceGuard.scss';

/**
 * AdminDeviceGuard (Mobile/Tablet Guard)
 * Garante que a área administrativa da Prefeitura seja acessada exclusivamente em Desktops/Notebooks.
 * Caso o dispositivo seja móvel ou tablet (< 1024px), exibe tela explicativa neobrutalista amigável.
 */
const AdminDeviceGuard = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-device-guard">
      {/* Tela de aviso exclusiva para Mobile / Tablet */}
      <div
        className={`admin-device-guard__fallback ${!isDesktop ? 'is-visible' : ''}`}
        role="region"
        aria-label="Aviso de compatibilidade de dispositivo"
      >
        <div className="admin-device-guard__card">
          <div className="admin-device-guard__badge">
            <Monitor size={18} aria-hidden="true" />
            <span>ACESSO RESTRITO</span>
          </div>

          <div className="admin-device-guard__icon-wrapper">
            <Monitor size={54} strokeWidth={2.2} className="admin-device-guard__icon" aria-hidden="true" />
          </div>

          <h1 className="admin-device-guard__title">Acesso Exclusivo Desktop</h1>

          <p className="admin-device-guard__message">
            A área administrativa é de uso exclusivo em computadores (Desktop/Notebook).
          </p>

          <p className="admin-device-guard__hint">
            O painel de gestão da Prefeitura requer resolução ampla para visualização de relatórios,
            tabelas de ocorrências e mapas de auditoria.
          </p>

          <div className="admin-device-guard__actions">
            <Link to="/login/cidadao" className="admin-device-guard__btn admin-device-guard__btn--citizen">
              <Smartphone size={18} aria-hidden="true" />
              <span>Ir para o Portal do Cidadão</span>
            </Link>

            <Link to="/" className="admin-device-guard__btn admin-device-guard__btn--home">
              <Home size={18} aria-hidden="true" />
              <span>Voltar para a Página Inicial</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo Desktop Renderizado */}
      <div className={`admin-device-guard__content ${isDesktop ? 'is-visible' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminDeviceGuard;
