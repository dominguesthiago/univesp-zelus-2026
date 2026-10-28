import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';
import { loginFuncionario } from '../services/api';
import './LoginPrefeitura.scss';

// Ícone personalizado de Identificação / CPF (estilo Neobrutalista)
const IdCardIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="admin-input-icon"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="22" height="16" rx="3" fill="#fbd362" stroke="#1a1a24" strokeWidth="2" />
    <circle cx="7" cy="7.5" r="2.2" fill="#1a1a24" />
    <path d="M4 14C4 11.8 5.5 11 7 11C8.5 11 10 11.8 10 14" stroke="#1a1a24" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="7" x2="20" y2="7" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <line x1="13" y1="11" x2="18" y2="11" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Ícone personalizado de Cadeado / Senha
const LockIcon = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="admin-input-icon"
    aria-hidden="true"
  >
    <rect x="2" y="8" width="14" height="11" rx="2" fill="#fbd362" stroke="#1a1a24" strokeWidth="2" />
    <path d="M5 8V5C5 2.79 6.79 1 9 1C11.21 1 13 2.79 13 5V8" stroke="#1a1a24" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.3" fill="#1a1a24" />
    <path d="M9 14.3V16" stroke="#1a1a24" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * Página de Login da Prefeitura (Back-office)
 * Rota: /login/prefeitura
 * Visual Neobrutalista adaptado estritamente para Desktop com paleta amarela
 */
const LoginPrefeitura = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(location.state?.mensagemSucesso || '');
  const [carregando, setCarregando] = useState(false);

  // Máscara dinâmica de CPF (000.000.000-00)
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

    const apenasDigitosCpf = cpf.replace(/\D/g, '');
    if (!apenasDigitosCpf || apenasDigitosCpf.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!senha || senha.trim().length === 0) {
      setMensagemErro('Informe a sua senha de acesso.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');
    setErroApi('');
    setMensagemSucesso('');

    try {
      const resposta = await loginFuncionario({
        cpf: apenasDigitosCpf,
        senha,
      });

      if (resposta?.token) {
        localStorage.setItem('zelus_admin_token', resposta.token);
        localStorage.setItem('zelus_token', resposta.token);
      }
      if (resposta?.dados) {
        localStorage.setItem('zelus_funcionario', JSON.stringify(resposta.dados));
      }

      const rotaDestino = location.state?.from?.pathname || '/prefeitura/painel';
      navigate(rotaDestino);
    } catch (erro) {
      const msg = erro?.message || 'Erro ao realizar login. Verifique suas credenciais de servidor.';
      setErroApi(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-prefeitura-container">
      {/* Card Principal Neobrutalista Desktop */}
      <main className="login-prefeitura-card" id="conteudo-principal">
        {/* Coluna Esquerda: Apresentação Institucional Amarela */}
        <div className="login-prefeitura-card__banner">
          <h1 className="login-prefeitura-card__heading">
            Acesso do Servidor Municipal
          </h1>


          <p className="login-prefeitura-card__subheading">
            Gestão operacional, triagem de ocorrências urbanas e auditoria de zeladoria em tempo real.
          </p>

          <div className="login-prefeitura-card__art">
            <img
              src={ilustracaoPrefeitura}
              alt="Servidor público em frente ao prédio da Prefeitura municipal"
              className="login-prefeitura-card__art-img"
            />
          </div>

          <div className="login-prefeitura-card__security-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Ambiente restrito e monitorado</span>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Autenticação */}
        <div className="login-prefeitura-card__form-col">
          <header className="login-prefeitura-form-header">
            <h2 className="login-prefeitura-form-header__title">Entrar com credenciais</h2>
            <p className="login-prefeitura-form-header__desc">
              Utilize seu CPF e senha institucional cadastrados.
            </p>
          </header>

          {/* Banner de Sucesso */}
          {mensagemSucesso && !erroApi && !mensagemErro && (
            <div className="admin-alert admin-alert--success" role="status" aria-live="polite">
              {mensagemSucesso}
            </div>
          )}

          {/* Banner de Erro */}
          {(erroApi || mensagemErro) && (
            <div className="admin-alert admin-alert--error" role="alert" aria-live="polite">
              {erroApi || mensagemErro}
            </div>
          )}

          <form className="login-prefeitura-form" onSubmit={handleSubmit} noValidate>
            {/* Campo CPF */}
            <div className="admin-field">
              <label htmlFor="login-cpf" className="admin-field__label">
                CPF do Servidor
              </label>
              <div className="admin-input-box">
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
                  className="admin-input-box__input"
                  maxLength={14}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="admin-field">
              <div className="admin-field__header-row">
                <label htmlFor="login-senha" className="admin-field__label">
                  Senha
                </label>
                <Link to="/esqueci-senha/prefeitura" className="admin-field__link-inline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="admin-input-box">
                <LockIcon />
                <input
                  id="login-senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={handleSenhaChange}
                  placeholder="••••••••"
                  className="admin-input-box__input"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="admin-input-box__toggle-btn"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  aria-controls="login-senha"
                  aria-pressed={mostrarSenha}
                >
                  {mostrarSenha ? (
                    <EyeOff size={18} color="#1a1a24" aria-hidden="true" />
                  ) : (
                    <Eye size={18} color="#1a1a24" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={carregando}
              className="admin-submit-btn"
              aria-label="Acessar o painel da prefeitura"
              aria-busy={carregando}
            >
              <span>{carregando ? 'Validando acesso...' : 'ENTRAR NO PAINEL'}</span>
              <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </form>

          {/* Rodapé do Form com Link de Cadastro */}
          <footer className="login-prefeitura-form-footer">
            <span>Novo servidor na administração? </span>
            <Link to="/cadastro/prefeitura" className="admin-link-highlight">
              Cadastrar novo acesso
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPrefeitura;
