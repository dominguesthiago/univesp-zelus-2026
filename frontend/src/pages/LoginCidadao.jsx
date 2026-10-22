import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Smartphone } from 'lucide-react';
import loginCidadaoImg from '../assets/images/login-cidadao.png';
import logoZelusIcon from '../assets/images/logo-zelus-icon.png';
import { loginCidadao } from '../services/api';
import './LoginCidadao.scss';

// Ícone personalizado de cartão de identificação (fiel ao mockup)
const IdCardIcon = () => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="login-input-icon"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="22" height="16" rx="3" fill="#6ba4d9" stroke="#1a1a24" strokeWidth="2" />
    <circle cx="7" cy="7.5" r="2.2" fill="#1a1a24" />
    <path d="M4 14C4 11.8 5.5 11 7 11C8.5 11 10 11.8 10 14" stroke="#1a1a24" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="7" x2="20" y2="7" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <line x1="13" y1="11" x2="18" y2="11" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone personalizado de cadeado (fiel ao mockup)
const LockIcon = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="login-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="8" width="14" height="11" rx="2" fill="#4a90e2" stroke="#1a1a24" strokeWidth="2" />
    <path d="M5 8V5C5 2.79 6.79 1 9 1C11.21 1 13 2.79 13 5V8" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.3" fill="#1a1a24" />
    <path d="M9 14.3V16" stroke="#1a1a24" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * Página de Login do Cidadão (LoginCidadao.jsx)
 * Reprodução rigorosa e pixel-perfect do mockup mobile do ZELUS.
 */
const LoginCidadao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(location.state?.mensagemSucesso || '');
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
    if (mensagemErro) setMensagemErro('');
    if (erroApi) setErroApi('');
    if (mensagemSucesso) setMensagemSucesso('');
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
    if (mensagemErro) setMensagemErro('');
    if (erroApi) setErroApi('');
    if (mensagemSucesso) setMensagemSucesso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apenasNumerosCpf = cpf.replace(/\D/g, '');
    if (!apenasNumerosCpf || apenasNumerosCpf.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!senha || senha.trim().length === 0) {
      setMensagemErro('Informe a sua senha.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');
    setErroApi('');
    setMensagemSucesso('');

    try {
      const resposta = await loginCidadao({
        cpf: apenasNumerosCpf,
        senha,
      });

      if (resposta?.token) {
        localStorage.setItem('zelus_token', resposta.token);
      }
      if (resposta?.dados) {
        localStorage.setItem('zelus_cidadao', JSON.stringify(resposta.dados));
      }

      setMensagemErro('');
      setErroApi('');
      navigate('/cidadao/painel');
    } catch (erro) {
      const msg = erro?.message || 'Erro ao realizar login. Verifique suas credenciais.';
      setErroApi(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-cidadao-wrapper">
      {/* Moldura de Smartphone / Card Centralizado */}
      <div className="login-card-mobile" role="region" aria-label="Tela de Login do Cidadão">
        {/* Cabeçalho azul institucional fiel ao mockup */}
        <header className="login-header">
          <Link
            to="/"
            className="login-header__back-link"
            aria-label="Voltar para a página inicial"
          >
            <span className="login-header__back-chevron">&lsaquo;</span>
            <span>Voltar</span>
          </Link>

          <div className="login-header__brand">
            <div className="login-header__title-row">
              <img
                src={logoZelusIcon}
                alt="Ícone ZELUS"
                className="login-header__logo-icon"
                width="28"
                height="28"
              />
              <span className="login-header__title">ZELUS - Cidadão</span>
            </div>
            <span className="login-header__subtitle auth-header__subtitle">Zeladoria Urbana</span>
          </div>
        </header>

        {/* Área Branca Principal com zero scroll */}
        <main className="login-main-container" id="conteudo-principal">
          {/* Ilustração original do casal acenando com balão 'Olá!' */}
          <div className="login-hero">
            <img
              src={loginCidadaoImg}
              alt="Casal acenando com balão de fala Olá!"
              className="login-hero__image"
              width="170"
              height="102"
            />
          </div>

          {/* Título de chamada */}
          <h1 id="login-heading" className="login-title">
            Acesse sua conta
          </h1>

          {/* Mensagem de sucesso (ex: redirecionamento após cadastro bem-sucedido) */}
          {mensagemSucesso && !erroApi && !mensagemErro && (
            <div id="login-sucesso" className="login-alert login-alert--success" role="status" aria-live="polite">
              {mensagemSucesso}
            </div>
          )}

          {/* Mensagem de alerta se houver erro de validação local ou da API */}
          {(erroApi || mensagemErro) && (
            <div id="login-erro" className="login-alert" role="alert" aria-live="polite">
              {erroApi || mensagemErro}
            </div>
          )}

          {/* Formulário com bordas grossas estilo cartum */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="login-heading"
          >
            {/* Campo CPF */}
            <div className="login-field">
              <label htmlFor="login-cpf" className="login-field__label">
                CPF (apenas números)
              </label>
              <div className="login-input-box">
                <IdCardIcon />
                <input
                  id="login-cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="login-input-box__field"
                  maxLength={14}
                  required
                  aria-required="true"
                  aria-invalid={erroApi || mensagemErro ? 'true' : 'false'}
                  aria-describedby={erroApi || mensagemErro ? 'login-erro' : undefined}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="login-field">
              <label htmlFor="login-senha" className="login-field__label">
                Senha
              </label>
              <div className="login-input-box">
                <LockIcon />
                <input
                  id="login-senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={handleSenhaChange}
                  placeholder="••••••••"
                  className="login-input-box__field"
                  required
                  aria-required="true"
                  aria-invalid={erroApi || mensagemErro ? 'true' : 'false'}
                  aria-describedby={erroApi || mensagemErro ? 'login-erro' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="login-input-box__eye-btn"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  aria-controls="login-senha"
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

            {/* Link Esqueci minha senha */}
            <div className="login-forgot-row">
              <Link to="/recuperar-senha/cidadao" className="login-forgot-link">
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão ENTRAR com borda espessa e ícone de smartphone */}
            <button
              type="submit"
              disabled={carregando}
              className="login-submit-button"
              aria-label="Entrar na conta do cidadão"
              aria-busy={carregando}
            >
              <span>{carregando ? 'Entrando...' : 'ENTRAR'}</span>
              <Smartphone size={22} color="#ffffff" strokeWidth={2.5} aria-hidden="true" />
            </button>

            {/* Link Não tem conta? Cadastre-se aqui */}
            <div className="login-signup-row">
              <span>Não tem conta? </span>
              <Link to="/cadastro/cidadao" className="login-signup-link">
                Cadastre-se aqui
              </Link>
            </div>
          </form>

          {/* Rodapé institucional sutil */}
          <footer className="login-footer-tagline">
            <span>ZELUS • Acessível e inclusivo para todos</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LoginCidadao;
