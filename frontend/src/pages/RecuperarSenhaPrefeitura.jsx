import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';
import { redefinirSenhaFuncionario } from '../services/api';
import './RecuperarSenhaPrefeitura.scss';

// Ícone personalizado de Identificação / CPF
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
 * Página de Recuperação de Senha da Prefeitura (Back-office)
 * Rota: /esqueci-senha/prefeitura
 * Exige Chave de Acesso Administrativa para autorizar a redefinição de senha do servidor
 */
const RecuperarSenhaPrefeitura = () => {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarChave, setMostrarChave] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erroApi, setErroApi] = useState('');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apenasDigitosCpf = cpf.replace(/\D/g, '');
    if (!apenasDigitosCpf || apenasDigitosCpf.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!novaSenha || novaSenha.trim().length < 6) {
      setMensagemErro('A nova senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (!chaveAcesso || chaveAcesso.trim().length === 0) {
      setMensagemErro('A Chave de Acesso Administrativa é obrigatória para validar a alteração.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');
    setErroApi('');

    try {
      await redefinirSenhaFuncionario({
        cpf: apenasDigitosCpf,
        nova_senha: novaSenha,
        chave_acesso: chaveAcesso.trim(),
      });

      // Redireciona para o login com mensagem de confirmação
      navigate('/login/prefeitura', {
        state: {
          mensagemSucesso: 'Senha redefinida com sucesso! Entre com sua nova senha de servidor.',
        },
      });
    } catch (erro) {
      const msg = erro?.message || 'Erro ao redefinir senha. Verifique o CPF e a chave administrativa.';
      setErroApi(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="recuperar-prefeitura-container">
      {/* Card Principal Neobrutalista Desktop em Duas Colunas */}
      <main className="recuperar-prefeitura-card" id="conteudo-principal">
        {/* Coluna Esquerda: Apresentação Institucional Amarela */}
        <div className="recuperar-prefeitura-card__banner">
          <h1 className="recuperar-prefeitura-card__heading">
            Recuperação de Senha
          </h1>

          <p className="recuperar-prefeitura-card__subheading">
            Redefinição segura de credenciais de acesso para servidores da administração municipal.
          </p>

          <div className="recuperar-prefeitura-card__art">
            <img
              src={ilustracaoPrefeitura}
              alt="Servidor público em frente ao prédio da Prefeitura municipal"
              className="recuperar-prefeitura-card__art-img"
            />
          </div>

          <div className="recuperar-prefeitura-card__security-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Ambiente restrito e monitorado</span>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Redefinição */}
        <div className="recuperar-prefeitura-card__form-col">
          <header className="recuperar-prefeitura-form-header">
            <h2 className="recuperar-prefeitura-form-header__title">Redefinir credenciais</h2>
            <p className="recuperar-prefeitura-form-header__desc">
              Informe seu CPF, nova senha e a Chave de Acesso Administrativa.
            </p>
          </header>

          {/* Banners de Alerta */}
          {(erroApi || mensagemErro) && (
            <div className="admin-alert admin-alert--error" role="alert" aria-live="polite">
              {erroApi || mensagemErro}
            </div>
          )}

          <form className="recuperar-prefeitura-form" onSubmit={handleSubmit} noValidate>
            {/* Campo CPF */}
            <div className="admin-field">
              <label htmlFor="rec-cpf" className="admin-field__label">
                CPF do Servidor
              </label>
              <div className="admin-input-box">
                <IdCardIcon />
                <input
                  id="rec-cpf"
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

            {/* Campo Nova Senha */}
            <div className="admin-field">
              <label htmlFor="rec-senha" className="admin-field__label">
                Nova Senha (mínimo 6 caracteres)
              </label>
              <div className="admin-input-box">
                <LockIcon />
                <input
                  id="rec-senha"
                  name="novaSenha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={novaSenha}
                  onChange={(e) => {
                    setNovaSenha(e.target.value);
                    if (mensagemErro) setMensagemErro('');
                  }}
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
                  aria-controls="rec-senha"
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

            {/* Campo Chave de Acesso Administrativa */}
            <div className="admin-field">
              <label htmlFor="rec-chave" className="admin-field__label admin-field__label--highlight">
                Chave de Acesso Administrativa 🔒
              </label>
              <div className="admin-input-box admin-input-box--highlight">
                <Key size={18} className="admin-input-icon text-dark" aria-hidden="true" />
                <input
                  id="rec-chave"
                  name="chave_acesso"
                  type={mostrarChave ? 'text' : 'password'}
                  autoComplete="off"
                  value={chaveAcesso}
                  onChange={(e) => {
                    setChaveAcesso(e.target.value);
                    if (mensagemErro) setMensagemErro('');
                  }}
                  placeholder="Chave secreta municipal"
                  className="admin-input-box__input"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setMostrarChave((prev) => !prev)}
                  className="admin-input-box__toggle-btn"
                  aria-label={mostrarChave ? 'Ocultar chave' : 'Exibir chave'}
                  aria-controls="rec-chave"
                  aria-pressed={mostrarChave}
                >
                  {mostrarChave ? (
                    <EyeOff size={18} color="#1a1a24" aria-hidden="true" />
                  ) : (
                    <Eye size={18} color="#1a1a24" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de Redefinição */}
            <button
              type="submit"
              disabled={carregando}
              className="admin-submit-btn"
              aria-label="Confirmar alteração de senha do servidor"
              aria-busy={carregando}
            >
              <span>{carregando ? 'Validando chave e alterando...' : 'REDEFINIR SENHA'}</span>
              <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </form>

          {/* Rodapé com Link para Login */}
          <footer className="recuperar-prefeitura-form-footer">
            <span>Lembrou de sua senha? </span>
            <Link to="/login/prefeitura" className="admin-link-highlight">
              Voltar para o login
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default RecuperarSenhaPrefeitura;
