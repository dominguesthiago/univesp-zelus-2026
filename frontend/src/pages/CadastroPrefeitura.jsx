import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import ilustracaoPrefeitura from '../assets/images/ilustracao-prefeitura.png';
import { cadastrarPrefeitura } from '../services/api';
import './CadastroPrefeitura.scss';

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
 * Página de Cadastro de Novo Servidor da Prefeitura
 * Rota: /cadastro/prefeitura
 * Exige Chave de Acesso Administrativa para barrar cadastros de cidadãos comuns
 */
const CadastroPrefeitura = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nomeFormatado = nome.trim();
    if (!nomeFormatado || nomeFormatado.length < 3) {
      setMensagemErro('Informe o nome completo do servidor.');
      return;
    }

    const apenasDigitosCpf = cpf.replace(/\D/g, '');
    if (!apenasDigitosCpf || apenasDigitosCpf.length !== 11) {
      setMensagemErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    if (!senha || senha.trim().length < 6) {
      setMensagemErro('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (!chaveAcesso || chaveAcesso.trim().length === 0) {
      setMensagemErro('A Chave de Acesso Administrativa é obrigatória.');
      return;
    }

    setCarregando(true);
    setMensagemErro('');
    setErroApi('');
    setMensagemSucesso('');

    try {
      const resposta = await cadastrarPrefeitura({
        nomeCompleto: nomeFormatado,
        cpf: apenasDigitosCpf,
        senha,
        chaveAdministrativa: chaveAcesso.trim(),
      });

      // Sucesso (201): Limpa formulário, exibe alerta verde e redireciona
      const msgSucesso = resposta?.mensagem || resposta?.message || 'Servidor cadastrado com sucesso! Acesse sua conta com CPF e senha.';
      setNome('');
      setCpf('');
      setSenha('');
      setChaveAcesso('');
      setMensagemSucesso(msgSucesso);

      navigate('/login/prefeitura', {
        state: {
          mensagemSucesso: msgSucesso,
        },
      });
    } catch (erro) {
      const msg = erro?.data?.error || erro?.data?.mensagem || erro?.message || 'Erro ao realizar o cadastro. Verifique os dados informados.';
      setErroApi(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-prefeitura-container">
      {/* Card Principal Neobrutalista Desktop em Duas Colunas */}
      <main className="cadastro-prefeitura-card" id="conteudo-principal">
        {/* Coluna Esquerda: Apresentação Institucional Amarela */}
        <div className="cadastro-prefeitura-card__banner">
          <h1 className="cadastro-prefeitura-card__heading">
            Novo Acesso Administrativo
          </h1>

          <p className="cadastro-prefeitura-card__subheading">
            Cadastramento oficial de servidores municipais para triagem de ocorrências e gestão urbana.
          </p>

          <div className="cadastro-prefeitura-card__art">
            <img
              src={ilustracaoPrefeitura}
              alt="Servidor público em frente ao prédio da Prefeitura municipal"
              className="cadastro-prefeitura-card__art-img"
            />
          </div>

          <div className="cadastro-prefeitura-card__security-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Ambiente restrito e monitorado</span>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Cadastro */}
        <div className="cadastro-prefeitura-card__form-col">
          <header className="cadastro-prefeitura-form-header">
            <h2 className="cadastro-prefeitura-form-header__title">Cadastrar servidor</h2>
            <p className="cadastro-prefeitura-form-header__desc">
              Preencha seus dados e informe a Chave Administrativa oficial.
            </p>
          </header>

          {/* Banners de Alerta */}
          {mensagemSucesso && !erroApi && !mensagemErro && (
            <div className="admin-alert admin-alert--success" role="status" aria-live="polite">
              {mensagemSucesso}
            </div>
          )}

          {(erroApi || mensagemErro) && (
            <div className="admin-alert admin-alert--error" role="alert" aria-live="polite">
              {erroApi || mensagemErro}
            </div>
          )}

          {/* Formulário em Grid Desktop */}
          <form className="cadastro-prefeitura-form" onSubmit={handleSubmit} noValidate>
            <div className="cadastro-prefeitura-form__grid">
              {/* Campo Nome Completo */}
              <div className="admin-field">
                <label htmlFor="cad-nome" className="admin-field__label">
                  Nome Completo
                </label>
                <div className="admin-input-box">
                  <User size={18} className="admin-input-icon text-muted" aria-hidden="true" />
                  <input
                    id="cad-nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (mensagemErro) setMensagemErro('');
                    }}
                    placeholder="Ex: João da Silva"
                    className="admin-input-box__input"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Campo CPF */}
              <div className="admin-field">
                <label htmlFor="cad-cpf" className="admin-field__label">
                  CPF do Servidor
                </label>
                <div className="admin-input-box">
                  <IdCardIcon />
                  <input
                    id="cad-cpf"
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
                <label htmlFor="cad-senha" className="admin-field__label">
                  Senha (mínimo 6 caracteres)
                </label>
                <div className="admin-input-box">
                  <LockIcon />
                  <input
                    id="cad-senha"
                    name="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      if (mensagemErro) setMensagemErro('');
                    }}
                    placeholder="••••••••"
                    className="admin-input-box__input"
                    style={{ minWidth: 0 }}
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((prev) => !prev)}
                    className="admin-input-box__toggle-btn"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                    aria-controls="cad-senha"
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
                <label htmlFor="cad-chave" className="admin-field__label admin-field__label--highlight">
                  Chave Administrativa 🔒
                </label>
                <div className="admin-input-box admin-input-box--highlight">
                  <Key size={18} className="admin-input-icon text-dark" aria-hidden="true" />
                  <input
                    id="cad-chave"
                    name="chave_acesso"
                    type={showAdminKey ? 'text' : 'password'}
                    autoComplete="off"
                    value={chaveAcesso}
                    onChange={(e) => {
                      setChaveAcesso(e.target.value);
                      if (mensagemErro) setMensagemErro('');
                    }}
                    placeholder="Chave secreta municipal"
                    className="admin-input-box__input"
                    style={{ minWidth: 0 }}
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey((prev) => !prev)}
                    className="admin-input-box__toggle-btn"
                    aria-label={showAdminKey ? 'Ocultar chave' : 'Exibir chave'}
                    aria-controls="cad-chave"
                    aria-pressed={showAdminKey}
                  >
                    {showAdminKey ? (
                      <EyeOff size={18} color="#1a1a24" aria-hidden="true" />
                    ) : (
                      <Eye size={18} color="#1a1a24" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={carregando}
              className="admin-submit-btn"
              aria-label="Concluir cadastro de servidor público"
              aria-busy={carregando}
            >
              <span>{carregando ? 'Validando chave e cadastrando...' : 'CADASTRAR SERVIDOR'}</span>
              <ArrowRight size={20} strokeWidth={2.6} aria-hidden="true" />
            </button>
          </form>

          {/* Rodapé com Link para Login */}
          <footer className="cadastro-prefeitura-form-footer">
            <span>Já possui um usuário cadastrado? </span>
            <Link to="/login/prefeitura" className="admin-link-highlight">
              Fazer login no painel
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default CadastroPrefeitura;
