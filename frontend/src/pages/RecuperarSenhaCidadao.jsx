import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Info, ChevronLeft } from 'lucide-react';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import { redefinirSenhaCidadao } from '../services/api';
import './RecuperarSenhaCidadao.scss';

// Ícone personalizado de cartão de identificação (fiel ao design system ZELUS)
const IdCardIcon = () => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="recuperar-input-icon"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="22" height="16" rx="3" fill="#6ba4d9" stroke="#1a1a24" strokeWidth="2" />
    <circle cx="7" cy="7.5" r="2.2" fill="#1a1a24" />
    <path d="M4 14C4 11.8 5.5 11 7 11C8.5 11 10 11.8 10 14" stroke="#1a1a24" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="7" x2="20" y2="7" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <line x1="13" y1="11" x2="18" y2="11" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone personalizado de e-mail (fiel ao design system ZELUS)
const MailIcon = () => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="recuperar-input-icon"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="18" height="14" rx="2" fill="#75c0e0" stroke="#1a1a24" strokeWidth="2" />
    <path d="M2 3L10 9L18 3" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Ícone personalizado de cadeado (fiel ao design system ZELUS)
const LockIcon = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="recuperar-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="8" width="14" height="11" rx="2" fill="#4a90e2" stroke="#1a1a24" strokeWidth="2" />
    <path d="M5 8V5C5 2.79 6.79 1 9 1C11.21 1 13 2.79 13 5V8" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.3" fill="#1a1a24" />
    <path d="M9 14.3V16" stroke="#1a1a24" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * Tela de Recuperação de Senha do Cidadão (RecuperarSenhaCidadao.jsx)
 * Fecha o ciclo de autenticação do munícipe no ZELUS.
 */
const RecuperarSenhaCidadao = () => {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de feedback e requisição
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Máscara numérica para CPF (000.000.000-00)
  const formatarCPF = (valor) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11);
    if (apenasDigitos.length <= 3) return apenasDigitos;
    if (apenasDigitos.length <= 6) return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`;
    if (apenasDigitos.length <= 9) return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`;
    return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9, 11)}`;
  };

  const handleCpfChange = (e) => {
    setCpf(formatarCPF(e.target.value));
    if (erros.cpf) setErros((prev) => ({ ...prev, cpf: '' }));
    if (erroApi) setErroApi('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (erros.email) setErros((prev) => ({ ...prev, email: '' }));
    if (erroApi) setErroApi('');
  };

  const handleNovaSenhaChange = (e) => {
    setNovaSenha(e.target.value);
    if (erros.novaSenha) setErros((prev) => ({ ...prev, novaSenha: '' }));
    if (erroApi) setErroApi('');
  };

  const validarFormulario = () => {
    const novosErros = {};

    // 1. CPF (exatamente 14 caracteres com a máscara)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (!cpf || cpf.trim().length === 0) {
      novosErros.cpf = 'Informe o seu CPF.';
    } else if (cpf.length !== 14 || cpfLimpo.length !== 11) {
      novosErros.cpf = 'O CPF deve estar totalmente preenchido com 14 caracteres.';
    }

    // 2. E-mail (formato válido padrão)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim().length === 0) {
      novosErros.email = 'Informe o seu e-mail.';
    } else if (!emailRegex.test(email.trim())) {
      novosErros.email = 'Informe um e-mail válido contendo @ e domínio.';
    }

    // 3. Nova Senha (mínimo 8 caracteres, pelo menos uma letra e um número)
    if (!novaSenha) {
      novosErros.novaSenha = 'Informe a sua nova senha.';
    } else {
      const temTamanhoMinimo = novaSenha.length >= 8;
      const temLetra = /[A-Za-z]/.test(novaSenha);
      const temNumero = /\d/.test(novaSenha);

      if (!temTamanhoMinimo || !temLetra || !temNumero) {
        novosErros.novaSenha = 'A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra e um número.';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErroApi('');
    setSucesso('');

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    const payload = {
      cpf: cpf.replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
      nova_senha: novaSenha,
    };

    try {
      const resposta = await redefinirSenhaCidadao(payload);

      setSucesso(resposta?.mensagem || 'Senha redefinida com sucesso!');

      // Redireciona para o login com mensagem de confirmação
      setTimeout(() => {
        navigate('/login/cidadao', {
          state: {
            mensagemSucesso: 'Senha redefinida com sucesso! Faça login com suas novas credenciais.',
          },
        });
      }, 600);
    } catch (erro) {
      setErroApi(
        erro?.message || 'Erro ao redefinir senha. Verifique seus dados e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="recuperar-senha-wrapper">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div className="recuperar-card-mobile" role="region" aria-label="Tela de Recuperação de Senha do Cidadão">
        {/* Cabeçalho azul institucional */}
        <header className="recuperar-header">
          <Link
            to="/login/cidadao"
            className="recuperar-header__back-link"
            aria-label="Voltar para a página de login"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Voltar</span>
          </Link>

          <div className="recuperar-header__brand">
            <div className="recuperar-header__title-row">
              <img
                src={logoZelusIcon}
                alt="Ícone ZELUS"
                className="recuperar-header__logo-icon"
                width="22"
                height="22"
              />
              <span className="recuperar-header__title">ZELUS - Cidadão</span>
            </div>
            <span className="recuperar-header__subtitle auth-header__subtitle" style={{ color: '#ffffff' }}>Zeladoria Urbana</span>
          </div>
        </header>

        {/* Área Branca Principal com zero scroll */}
        <main className="recuperar-main-container" id="conteudo-principal">
          {/* Título de chamada */}
          <h1 id="recuperar-heading" className="recuperar-title">
            Recuperar Senha
          </h1>

          {/* Aviso Acadêmico (role="note") */}
          <div className="recuperar-aviso-academico" role="note" aria-label="Aviso sobre ambiente acadêmico">
            <Info size={20} className="recuperar-aviso-academico__icon" aria-hidden="true" />
            <p className="recuperar-aviso-academico__text">
              <strong>Ambiente Acadêmico:</strong> Como não há envio real de e-mails, confirme seus dados abaixo para redefinir sua senha de forma segura.
            </p>
          </div>

          {/* Mensagem de sucesso */}
          {sucesso && (
            <div
              id="recuperar-sucesso"
              className="recuperar-alert recuperar-alert--success"
              role="status"
              aria-live="polite"
            >
              {sucesso}
            </div>
          )}

          {/* Mensagem de erro da API */}
          {erroApi && (
            <div
              id="recuperar-erro-api"
              className="recuperar-alert"
              role="alert"
              aria-live="polite"
            >
              {erroApi}
            </div>
          )}

          {/* Formulário com bordas grossas estilo cartum */}
          <form
            className="recuperar-form"
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="recuperar-heading"
          >
            {/* Campo 1: CPF */}
            <div className="recuperar-field">
              <label htmlFor="recuperar-cpf" className="recuperar-field__label">
                CPF (apenas números)
              </label>
              <div
                className={`recuperar-input-box ${
                  erros.cpf ? 'recuperar-input-box--invalid' : ''
                }`}
              >
                <IdCardIcon />
                <input
                  id="recuperar-cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="recuperar-input-box__field"
                  maxLength={14}
                  required
                  aria-required="true"
                  aria-invalid={erros.cpf ? 'true' : 'false'}
                  aria-describedby={erros.cpf ? 'erro-recuperar-cpf' : undefined}
                />
              </div>
              {erros.cpf && (
                <span
                  id="erro-recuperar-cpf"
                  className="recuperar-field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {erros.cpf}
                </span>
              )}
            </div>

            {/* Campo 2: E-mail */}
            <div className="recuperar-field">
              <label htmlFor="recuperar-email" className="recuperar-field__label">
                E-mail
              </label>
              <div
                className={`recuperar-input-box ${
                  erros.email ? 'recuperar-input-box--invalid' : ''
                }`}
              >
                <MailIcon />
                <input
                  id="recuperar-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seuemail@exemplo.com"
                  className="recuperar-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={erros.email ? 'true' : 'false'}
                  aria-describedby={erros.email ? 'erro-recuperar-email' : undefined}
                />
              </div>
              {erros.email && (
                <span
                  id="erro-recuperar-email"
                  className="recuperar-field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {erros.email}
                </span>
              )}
            </div>

            {/* Campo 3: Nova Senha */}
            <div className="recuperar-field">
              <label htmlFor="recuperar-senha" className="recuperar-field__label">
                Nova Senha
              </label>
              <div
                className={`recuperar-input-box ${
                  erros.novaSenha ? 'recuperar-input-box--invalid' : ''
                }`}
              >
                <LockIcon />
                <input
                  id="recuperar-senha"
                  name="novaSenha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={novaSenha}
                  onChange={handleNovaSenhaChange}
                  placeholder="Mínimo 8 caracteres"
                  className="recuperar-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={erros.novaSenha ? 'true' : 'false'}
                  aria-describedby={erros.novaSenha ? 'erro-recuperar-senha' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="recuperar-input-box__eye-btn"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  aria-controls="recuperar-senha"
                  aria-pressed={mostrarSenha}
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} color="#1a3458" aria-hidden="true" />
                  ) : (
                    <Eye size={19} color="#1a3458" aria-hidden="true" />
                  )}
                </button>
              </div>
              {erros.novaSenha && (
                <span
                  id="erro-recuperar-senha"
                  className="recuperar-field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {erros.novaSenha}
                </span>
              )}
            </div>

            {/* Botão Redefinir Senha */}
            <button
              type="submit"
              disabled={carregando}
              className="recuperar-submit-button"
              aria-label="Redefinir senha da conta do cidadão"
              aria-busy={carregando}
            >
              <span>{carregando ? 'Redefinindo...' : 'Redefinir Senha'}</span>
              <KeyRound size={20} color="#ffffff" strokeWidth={2.5} aria-hidden="true" />
            </button>

            {/* Link Lembrou a senha? Voltar ao Login */}
            <div className="recuperar-login-row">
              <span>Lembrou a senha? </span>
              <Link to="/login/cidadao" className="recuperar-login-link">
                Voltar ao Login
              </Link>
            </div>
          </form>
        </main>

        {/* Rodapé institucional */}
        <footer className="recuperar-footer-tagline">
          <span>ZELUS • Acessível e inclusivo para todos</span>
        </footer>
      </div>
    </div>
  );
};

export default RecuperarSenhaCidadao;
