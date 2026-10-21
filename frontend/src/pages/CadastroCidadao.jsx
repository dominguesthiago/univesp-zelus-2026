import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Smartphone } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import './CadastroCidadao.scss';

// Ícone personalizado de Usuário / Nome Completo (estilo cartum do mockup)
const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cadastro-input-icon"
    aria-hidden="true"
  >
    <circle cx="12" cy="7.5" r="4" fill="#f5c6a5" stroke="#1a1a24" strokeWidth="2" />
    <path
      d="M4.5 20.5C4.5 16.5 8 14 12 14C16 14 19.5 16.5 19.5 20.5"
      fill="#4a90e2"
      stroke="#1a1a24"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Ícone personalizado de cartão de identificação / CPF
const IdCardIcon = () => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cadastro-input-icon"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="22" height="16" rx="3" fill="#6ba4d9" stroke="#1a1a24" strokeWidth="2" />
    <circle cx="7" cy="7.5" r="2.2" fill="#1a1a24" />
    <path d="M4 14C4 11.8 5.5 11 7 11C8.5 11 10 11.8 10 14" stroke="#1a1a24" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="7" x2="20" y2="7" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <line x1="13" y1="11" x2="18" y2="11" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone personalizado de envelope / E-mail (requisito crítico de backend)
const EnvelopeIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cadastro-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="3" fill="#6ba4d9" stroke="#1a1a24" strokeWidth="2" />
    <path d="M2.5 4.5L12 11.5L21.5 4.5" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Ícone personalizado de Smartphone / Telefone
const PhoneIcon = () => (
  <svg
    width="18"
    height="22"
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cadastro-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="14" height="20" rx="3" fill="#6ba4d9" stroke="#1a1a24" strokeWidth="2" />
    <rect x="4.5" y="5" width="9" height="11" rx="1" fill="#ffffff" stroke="#1a1a24" strokeWidth="1.2" />
    <circle cx="9" cy="19" r="1.2" fill="#1a1a24" />
    <line x1="7" y1="3.5" x2="11" y2="3.5" stroke="#1a1a24" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Ícone personalizado de cadeado / Senha
const LockIcon = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cadastro-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="8" width="14" height="11" rx="2" fill="#4a90e2" stroke="#1a1a24" strokeWidth="2" />
    <path d="M5 8V5C5 2.79 6.79 1 9 1C11.21 1 13 2.79 13 5V8" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.3" fill="#1a1a24" />
    <path d="M9 14.3V16" stroke="#1a1a24" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * Página de Cadastro do Cidadão (CadastroCidadao.jsx)
 * Reprodução rigorosa do mockup do ZELUS com inclusão do campo de e-mail e semântica WCAG 2.1 AA.
 */
const CadastroCidadao = () => {
  const navigate = useNavigate();

  // Estado único para armazenamento dos 5 campos do formulário
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    email: '',
    whatsapp: '',
    senha: '',
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Máscara numérica para CPF (000.000.000-00)
  const formatarCPF = (valor) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11);
    if (apenasDigitos.length <= 3) return apenasDigitos;
    if (apenasDigitos.length <= 6) return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`;
    if (apenasDigitos.length <= 9) return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`;
    return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9, 11)}`;
  };

  // Máscara para Telefone / WhatsApp: (00) 90000-0000 ou (00) 0000-0000
  const formatarTelefone = (valor) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11);
    if (apenasDigitos.length <= 2) return apenasDigitos;
    if (apenasDigitos.length <= 6) return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
    if (apenasDigitos.length <= 10) {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`;
    }
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatarCPF(value);
    } else if (name === 'whatsapp') {
      formattedValue = formatarTelefone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (mensagemErro) setMensagemErro('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validação de Nome Completo
    if (!formData.nome_completo.trim()) {
      setMensagemErro('Informe o seu nome completo.');
      return;
    }

    // 2. Validação de CPF (11 dígitos)
    const apenasNumerosCpf = formData.cpf.replace(/\D/g, '');
    if (!apenasNumerosCpf || apenasNumerosCpf.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    // 3. Validação de E-mail (requisito do backend)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !regexEmail.test(formData.email.trim())) {
      setMensagemErro('Informe um endereço de e-mail válido.');
      return;
    }

    // 4. Validação de Telefone / WhatsApp
    const apenasNumerosTel = formData.whatsapp.replace(/\D/g, '');
    if (!apenasNumerosTel || apenasNumerosTel.length < 10) {
      setMensagemErro('Informe um número de telefone com DDD válido.');
      return;
    }

    // 5. Validação de Senha
    if (!formData.senha || formData.senha.length < 6) {
      setMensagemErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setMensagemErro('');
    setCarregando(true);

    // Payload estruturado em conformidade com o backend ZELUS
    const payload = {
      nome_completo: formData.nome_completo.trim(),
      cpf: apenasNumerosCpf,
      email: formData.email.trim().toLowerCase(),
      whatsapp: apenasNumerosTel,
      senha: formData.senha,
    };

    console.log('Dados do Cadastro do Cidadão:', JSON.stringify(payload, null, 2));

    setTimeout(() => {
      setCarregando(false);
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert('Cadastro realizado com sucesso! Faça login para continuar.');
      }
      navigate('/login/cidadao');
    }, 500);
  };

  return (
    <div className="cadastro-cidadao-wrapper">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div className="cadastro-card-mobile" role="region" aria-label="Tela de Cadastro do Cidadão">
        {/* Cabeçalho azul institucional fiel ao mockup */}
        <header className="cadastro-header">
          <div className="cadastro-header__top">
            <Link
              to="/login/cidadao"
              className="cadastro-header__back-link"
              aria-label="Voltar para a página de login"
            >
              <span className="cadastro-header__back-chevron" aria-hidden="true">&lsaquo;</span>
              <span>Voltar</span>
            </Link>
          </div>

          <div className="cadastro-header__brand">
            <div className="cadastro-header__title-row">
              <img
                src={logoZelusIcon}
                alt=""
                className="cadastro-header__logo-icon"
                width="28"
                height="28"
                aria-hidden="true"
              />
              <span className="cadastro-header__title">ZELUS - Cadastro</span>
            </div>
            <span className="cadastro-header__subtitle">Zeladoria Urbana</span>
          </div>
        </header>

        {/* Área Branca Principal com landmark <main> */}
        <main className="cadastro-main-container" id="conteudo-principal">
          {/* Título de chamada com ícone de bloco de notas */}
          <div className="cadastro-hero">
            <h1 id="cadastro-heading" className="cadastro-title">
              Crie sua conta <span className="cadastro-title__emoji" role="img" aria-label="Prancheta de anotações">📝</span>
            </h1>
          </div>

          {/* Mensagem de alerta se houver erro */}
          {mensagemErro && (
            <div id="cadastro-erro" className="cadastro-alert" role="alert" aria-live="polite">
              {mensagemErro}
            </div>
          )}

          {/* Formulário com bordas grossas estilo cartum */}
          <form
            className="cadastro-form"
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="cadastro-heading"
          >
            {/* 1. Campo Nome Completo */}
            <div className="cadastro-field">
              <label htmlFor="cadastro-nome" className="cadastro-field__label">
                Nome Completo
              </label>
              <div className="cadastro-input-box">
                <UserIcon />
                <input
                  id="cadastro-nome"
                  name="nome_completo"
                  type="text"
                  autoComplete="name"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="cadastro-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={mensagemErro ? 'true' : 'false'}
                  aria-describedby={mensagemErro ? 'cadastro-erro' : undefined}
                />
              </div>
            </div>

            {/* 2. Campo CPF (apenas números) */}
            <div className="cadastro-field">
              <label htmlFor="cadastro-cpf" className="cadastro-field__label">
                CPF (apenas números)
              </label>
              <div className="cadastro-input-box">
                <IdCardIcon />
                <input
                  id="cadastro-cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="cadastro-input-box__field"
                  maxLength={14}
                  required
                  aria-required="true"
                  aria-invalid={mensagemErro ? 'true' : 'false'}
                  aria-describedby={mensagemErro ? 'cadastro-erro' : undefined}
                />
              </div>
            </div>

            {/* 3. Campo E-mail (Ajuste Crítico de Backend) */}
            <div className="cadastro-field">
              <label htmlFor="cadastro-email" className="cadastro-field__label">
                E-mail
              </label>
              <div className="cadastro-input-box">
                <EnvelopeIcon />
                <input
                  id="cadastro-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu.email@exemplo.com"
                  className="cadastro-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={mensagemErro ? 'true' : 'false'}
                  aria-describedby={mensagemErro ? 'cadastro-erro' : undefined}
                />
              </div>
            </div>

            {/* 4. Campo Telefone */}
            <div className="cadastro-field">
              <label htmlFor="cadastro-telefone" className="cadastro-field__label">
                Telefone
              </label>
              <div className="cadastro-input-box">
                <PhoneIcon />
                <input
                  id="cadastro-telefone"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 90000-0000"
                  className="cadastro-input-box__field"
                  maxLength={15}
                  required
                  aria-required="true"
                  aria-invalid={mensagemErro ? 'true' : 'false'}
                  aria-describedby={mensagemErro ? 'cadastro-erro' : undefined}
                />
              </div>
            </div>

            {/* 5. Campo Senha */}
            <div className="cadastro-field">
              <label htmlFor="cadastro-senha" className="cadastro-field__label">
                Senha
              </label>
              <div className="cadastro-input-box">
                <LockIcon />
                <input
                  id="cadastro-senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="cadastro-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={mensagemErro ? 'true' : 'false'}
                  aria-describedby={mensagemErro ? 'cadastro-erro' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="cadastro-input-box__eye-btn"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  aria-controls="cadastro-senha"
                  aria-pressed={mostrarSenha}
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} color="#1a3458" aria-hidden="true" />
                  ) : (
                    <Eye size={19} color="#1a3458" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão CADASTRAR com borda espessa e ícone de smartphone */}
            <button
              type="submit"
              disabled={carregando}
              className="cadastro-submit-button"
              aria-label="Cadastrar nova conta do cidadão"
              aria-busy={carregando}
            >
              <span>{carregando ? 'CADASTRANDO...' : 'CADASTRAR'}</span>
              <Smartphone size={22} color="#ffffff" strokeWidth={2.5} aria-hidden="true" />
            </button>

            {/* Link Já tem uma conta? Entrar aqui */}
            <div className="cadastro-signin-row">
              <span>Já tem uma conta? </span>
              <Link to="/login/cidadao" className="cadastro-signin-link">
                Entrar aqui
              </Link>
            </div>
          </form>

          {/* Rodapé institucional sutil */}
          <footer className="cadastro-footer-tagline">
            <span>ZELUS • Acessível e inclusivo para todos</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default CadastroCidadao;
