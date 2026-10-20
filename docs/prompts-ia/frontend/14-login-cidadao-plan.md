# Registro de Rastreabilidade de Prompt de IA — Tela de Login do Cidadão

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `14-login-cidadao-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Autenticação do Cidadão (Mobile-First / Opção B)  
**Data/Hora do Registro:** 20 de outubro de 2026 - 16:45 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-LOGIN-CIDADAO-014`
* **Módulo:** Autenticação e Acesso do Munícipe
* **Objetivo:** Projetar e implementar a tela de login do cidadão (`LoginCidadao.jsx`) com abordagem Mobile-First e simulação de smartphone no PC (Opção B, largura máxima contida em 440px), cabeçalho dedicado com botão de retorno, formulário acessível com máscara de CPF e alternância de visibilidade de senha, asset gráfico provisório e integração ao roteamento principal.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior

---

## 2. Prompts Originais Transcritos

### 2.1 Prompt de Planejamento

```text
Atuando como Engenheiro de Frontend Sênior, vamos iniciar a construção do ecrã de Login do Cidadão (LoginCidadao.jsx) para o projeto ZELUS, seguindo rigorosamente o design do mockup e o comportamento mobile-first com simulação em PC (Opção B).

A Tua Tarefa Agora:
NÃO geres o código final dos componentes ainda. Elabora apenas um Plano de Ação detalhado contendo a arquitetura desta entrega.

Mapeamento para o Plano de Ação:

Script de Placeholder: Listar a criação do asset gráfico provisório frontend/src/assets/images/login-cidadao.png (ilustração do casal a acenar com o balão 'Olá!') via script, mantendo o padrão.

frontend/src/pages/LoginCidadao.jsx e .scss: Detalhar a estrutura do ecrã:

Cabeçalho próprio com botão < Voltar (ligado à rota /) e o título 'ZELUS - Cidadão / Zeladoria Urbana'.

Envoltório responsivo (MobileWrapper ou classe de simulação de PC) que centraliza a interface com largura máxima de 440px em monitores largos, exibindo um aviso discreto de otimização mobile.

Formulário de acesso com o título 'Acesse sua conta', inputs para CPF (com máscara numérica) e Senha (com botão de alternância de visibilidade/ícone de olho).

Links de navegação secundária ('Esqueci minha senha' e 'Não tem conta? Cadastre-se aqui') e o botão de submissão 'ENTRAR' com borda espessa e ícone.

Configuração de Rota (App.js): Listar a inclusão da rota /login/cidadao apontando para este ecrã.

Rastreabilidade: Confirmar a criação do ficheiro docs/prompts-ia/frontend/14-login-cidadao-plan.md.

Devolve estritamente o Plano de Ação. Termina perguntando se o plano está aprovado para a geração do código.
```

### 2.2 Prompt de Execução (Aprovação)

```text
O Plano de Ação para o ecrã de Login do Cidadão está 100% aprovado. Pode prosseguir com a execução exata.

A tua tarefa agora:

Executa a criação do asset gráfico provisório frontend/src/assets/images/login-cidadao.png via script.

Cria os ficheiros frontend/src/pages/LoginCidadao.jsx e frontend/src/pages/LoginCidadao.scss conforme a arquitetura planejada (Mobile-first, wrapper de simulação PC com largura máxima de 440px, campos formatados e toggle de senha).

Atualiza o frontend/src/App.js para registar a rota /login/cidadao e ajustar a convivência dos cabeçalhos.

Atualiza o frontend/src/pages/Home.jsx para que o clique no card 'Sou Cidadão' navegue corretamente para /login/cidadao.

Cria fisicamente o ficheiro de registo docs/prompts-ia/frontend/14-login-cidadao-plan.md.

Realiza as criações e alterações, compila o projeto e avisa-me assim que estiver concluído para validarmos!
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados e Modificados

1. [login-cidadao.png](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/login-cidadao.png) e [logo-zelus-icon.png](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/logo-zelus-icon.png)
   * Extraídos e alinhados diretamente da arte oficial do mockup: ilustração do casal acenando com balão 'Olá!' e o cubo isométrico azul com a letra 'Z'.
2. [LoginCidadao.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/LoginCidadao.jsx)
   * Reprodução pixel-perfect do mockup:
     * **Cabeçalho:** Fundo `#1a3458` com `< Voltar` no canto superior esquerdo e bloco centralizado com ícone ZELUS, título `ZELUS - Cidadão` e subtítulo `Zeladoria Urbana`.
     * **Inputs:** Caixas com borda preta espessa de 2px, raio de 12px, ícone personalizado de crachá/ID azul no CPF e cadeado azul na Senha, com olho de alternância de visibilidade.
     * **Ações:** Link *"Esqueci minha senha"* alinhado à direita, botão **ENTRAR** em formato pílula azul escuro (`#1a3458`) com borda espessa e ícone de smartphone branco, link *"Não tem conta? Cadastre-se aqui"* e rodapé *"ZELUS • Acessível e inclusivo para todos"*.
3. [LoginCidadao.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/LoginCidadao.scss)
   * Implementação das cores, tipografia, bordas e distribuição vertical harmoniosa (`overflow: hidden` e zero scroll no mobile, simulador centralizado de smartphone no desktop).
4. [App.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js) e [global.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/global.scss)
   * Integração de rotas com layout limpo e desacoplado (`.app-layout--auth` e `.app-main--auth`).
5. [Home.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.jsx)
   * Navegação do card "Sou Cidadão" para `/login/cidadao`.
6. [LEIA-ME-ASSETS.md](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/LEIA-ME-ASSETS.md)
   * Tabela de assets atualizada.
7. [14-login-cidadao-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/14-login-cidadao-plan.md)
   * Este documento de governança e rastreabilidade.

---

## 4. Conformidade de Acessibilidade (WCAG 2.1 AA)

1. **Rótulos e Identificação:** Todos os inputs possuem elementos `<label>` associados explicitamente via atributo `htmlFor`.
2. **Máscara e Entrada Numérica:** O campo de CPF utiliza `inputMode="numeric"` para acionar automaticamente o teclado numérico em dispositivos móveis.
3. **Controle de Senha Acessível:** O botão de alternância possui `type="button"`, ícones com `aria-hidden="true"` e rótulo dinâmico em `aria-label` ("Exibir senha em texto claro" / "Ocultar senha").
4. **Alvos de Toque:** Botões e controles interativos respeitam a dimensão mínima recomendada de 44×44 px.
5. **Navegação por Teclado:** Foco visível preservado e destacado em todos os links e botões.

---

## 5. Verificação e Compilação

* Verificação de compilação via `npm run build` na pasta `frontend/`.
