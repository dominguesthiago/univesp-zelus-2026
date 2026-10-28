# Registro de Rastreabilidade de IA — Épico Back-office: Autenticação da Prefeitura

**Documento:** Registro de Governança de Prompt e Desenvolvimento  
**ID do Registro:** `38-autenticacao-prefeitura-backoffice`  
**Fase do Projeto:** Épico do Painel da Prefeitura (Back-office)  
**Etapa:** Fluxo de Autenticação, Proteção de Dispositivo e Telas Administrativas Neobrutalistas  
**Data/Hora:** 27 de outubro de 2026 - 21:05 (UTC-03:00)  
**Status:** Implementado, Aprovado em Testes Unitários e Integrado.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-PREFEITURA-AUTH-038`
* **Módulos Criados/Atualizados:**
  * Componente Guarda: `AdminDeviceGuard.jsx` e `AdminDeviceGuard.scss`
  * Telas de Autenticação:
    * `LoginPrefeitura.jsx` e `LoginPrefeitura.scss` (`/login/prefeitura`)
    * `CadastroPrefeitura.jsx` e `CadastroPrefeitura.scss` (`/cadastro/prefeitura`)
    * `RecuperarSenhaPrefeitura.jsx` e `RecuperarSenhaPrefeitura.scss` (`/esqueci-senha/prefeitura`)
  * Rotas e Navegação: `App.js` e `Home.jsx`
  * Camada de Serviços: `api.js` (`loginFuncionario`, `registrarFuncionario`, `redefinirSenhaFuncionario`)
  * Suítes de Testes: `AdminDeviceGuard.test.js`, `LoginPrefeitura.test.js`, `CadastroPrefeitura.test.js`, `RecuperarSenhaPrefeitura.test.js`, `Home.test.js`

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Bloqueio de Dispositivo (`AdminDeviceGuard`)
* **Regra de Negócio:** A área administrativa é de uso exclusivo em computadores (Desktop/Notebook). Dispositivos móveis e tablets (< 1024px) são bloqueados com mensagem explicativa e botões de atalho para o portal do munícipe ou página inicial.
* **Resiliência Visual:** Combinação de verificação reativa via `window.innerWidth` e media queries CSS (`@media (max-width: 1023px)` e `@media (min-width: 1024px)`) para garantia de ausência de oscilação visual (*zero layout shift*).

### 2.2 Padronização Neobrutalista de Duas Colunas
* **Estrutura de Grid:** Todas as três telas do Back-office (`LoginPrefeitura`, `CadastroPrefeitura`, `RecuperarSenhaPrefeitura`) compartilham o mesmo layout simétrico e consistente em cartão Neobrutalista de duas colunas:
  * **Coluna Esquerda (Banner Institucional Amarelo):**
    * Fundo amarelo institucional (`$color-accent: #fbd362`).
    * Título principal (`<h1>`) centralizado (`text-align: center`).
    * Subtítulo explicativo centralizado.
    * Ilustração oficial do servidor municipal com borda e sombra sólida.
    * Badge de segurança inferior centralizada (*"Ambiente restrito e monitorado"*).
    * Remoção de botões ou links redundantes de "Voltar" dentro do banner, promovendo uma apresentação limpa e minimalista.
  * **Coluna Direita (Formulário Administrativo):**
    * Fundo branco Neobrutalista com títulos e parágrafos explicativos centralizados.
    * Inputs estruturados com contornos firmes de 2.5px a 3px e sombras sólidas.
    * Botões de ação em amarelo institucional (`$color-accent`) com elevação ativa.
* **Viewport 100vh sem Rolagem (Zero Scrollbar):**
  * As classes `.app-layout--prefeitura` e `.app-main--prefeitura` fixam a altura da tela em `100vh` / `100dvh` com `overflow: hidden`.
  * Header e Footer globais possuem `flex-shrink: 0 !important` e o container central ocupa `flex: 1`, mantendo o cartão perfeitamente centralizado verticalmente e horizontalmente.
  * O tamanho dos cartões foi ajustado (`max-width: 880px` a `920px`, `min-height: 450px` a `490px`) para acomodar com segurança todas as mensagens e alertas de erro sem provocar estouro de viewport.

### 2.3 Exigência da Chave de Acesso Administrativa
* **Segurança de Borda do Back-office:**
  * O cadastro de novo servidor e a redefinição de credenciais administrativas exigem o fornecimento da Chave Administrativa oficial da gestão municipal.
  * Impede que munícipes ou agentes não autorizados criem contas com privilégios de funcionário público ou alterem senhas do quadro administrativo.
* **Alternância de Visibilidade (Eye Toggle):**
  * Tanto no campo de senha quanto no campo de "Chave Administrativa", foi implementado o botão acessível de alternância de visibilidade com ícones dinâmicos `Eye` e `EyeOff` da biblioteca `lucide-react`.
  * Inclusão de `minWidth: 0` nos inputs internos para evitar que o navegador aplique larguras mínimas padrão do HTML dentro do contêiner Flexbox, prevenindo cortes indesejados em resoluções compactas.

---

## 3. Validação e Qualidade dos Testes Unitários

### 3.1 Atualização da Suíte de Testes
* As suítes `LoginPrefeitura.test.js`, `CadastroPrefeitura.test.js` e `RecuperarSenhaPrefeitura.test.js` foram refatoradas:
  1. Remoção de asserções obsoletas que procuravam links de navegação redundantes ("Voltar").
  2. Validação da estrutura em duas colunas (banner institucional à esquerda e formulário à direita).
  3. Cobertura da alternância de tipo de input (`password` <-> `text`) ao clicar no botão de visibilidade da Chave Administrativa e da Nova Senha.
  4. Validação de mensagens de erro amigáveis, alertas acessíveis (`role="alert"`), máscaras de CPF e bloqueio de múltiplos envios durante loading.

### 3.2 Resultado da Execução
* **Total de Suítes Executadas:** 19
* **Suítes Aprovadas:** 19 (100%)
* **Total de Testes Unitários:** 142
* **Testes Aprovados:** 142 (100%)
* **Taxa de Sucesso:** 100% de conformidade com os critérios de aceitação e acessibilidade digital.
