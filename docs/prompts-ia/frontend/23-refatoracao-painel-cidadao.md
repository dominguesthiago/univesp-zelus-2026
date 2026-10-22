# Registro de Rastreabilidade de Prompt de IA — Refatoração do Painel do Cidadão (Scroll Isolado, Ilustrações IA e Sair no Header)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `23-refatoracao-painel-cidadao`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Refatoração do Dashboard do Cidadão (`PainelCidadao`), geração de ilustrações com IA e refatoração do `<Header>` para acomodar o botão "Sair"  
**Data/Hora do Registro:** 22 de outubro de 2026 - 11:20 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-PAINEL-CIDADAO-023`
* **Módulo:** Painel do Cidadão, Design System Pop Cartum, Cabeçalho Global, Assets Visuais e Testes
* **Commits vinculados:**
  1. `6a50e38` — `feat(frontend): refatoracao do painel do cidadao com scroll isolado e nova linguagem colaborativa`
  2. `36a0efa` — `fix(frontend): alinhamento visual do painel, badges e geracao de ilustracoes dos cartoes`
* **Objetivo:**
  1. Refatorar `PainelCidadao.jsx` e `PainelCidadao.scss` com a arquitetura de **scroll isolado** (tela sem rolagem; somente a lista "Minhas Solicitações Recentes" rola).
  2. Adotar linguagem colaborativa nos textos e remover a "Pontuação de Cidadania" e os "Serviços Disponíveis" da versão provisória.
  3. **Gerar com Inteligência Artificial** e integrar 3 ilustrações em estilo cartum para os cartões de solicitação.
  4. Refatorar o `<Header>` para acomodar o link "Sair 🚪" (com limpeza de sessão) e corrigir os desvios visuais (clipping da lista e posição das badges).
  5. Criar/atualizar as suítes de testes (`PainelCidadao.test.js` e nova `Header.test.js`).
* **Ferramenta de IA:** Antigravity AI Assistant (texto/código) e geração de imagens por IA (ilustrações)
* **Persona:** Engenheiro de Frontend Sênior, Especialista em UI/UX Mobile e Tech Lead
* **Fluxo de trabalho:** a partir da segunda interação, adotou-se a regra *"analisar → apresentar plano → aguardar aprovação → executar"*.

---

## 2. Prompts Originais Transcritos (Resumo Fiel)

### 2.1 Prompt 1 — Refatoração Completa do Painel (Commit `6a50e38`)

```text
Atuando como Engenheiro de Frontend Sênior e Especialista em UI/UX Mobile, refatorar completamente
PainelCidadao.jsx e PainelCidadao.scss, transformando-a na versão definitiva do Dashboard do Cidadão.

1. Regra de Ouro (Scroll Isolado):
   - html, body e wrapper principal sem rolagem (overflow: hidden).
   - Header, texto de boas-vindas e botão principal FIXOS no topo; rodapé FIXO na base.
   - APENAS o contêiner da lista "Minhas Solicitações Recentes" com overflow-y: auto.
2. PainelCidadao.jsx:
   - Manter <Header>; link "Sair ->" no canto superior esquerdo.
   - "Olá, [Nome]! 👋" (H1 azul escuro) + "Acompanhe suas solicitações ou abra uma nova."
   - Botão gigante "+ NOVA SOLICITAÇÃO 📱" (#00c853, texto branco grosso, borda preta cartum).
   - Remover "Pontuação de Cidadania" e "Serviços Disponíveis".
   - Mock com 2-3 solicitações e listagem via map.
3. PainelCidadao.scss (Pop Cartum): .solicitacao-card (borda 3px solid #1a1a24, flex),
   .badge--pendente e .badge--concluido.
4. Atualizar testes, validar compilação e commitar:
   feat(frontend): refatoracao do painel do cidadao com scroll isolado e nova linguagem colaborativa
```

### 2.2 Prompt 2 — Análise dos Desvios Visuais frente ao Mockup (Plano, sem alteração de código)

```text
O último commit implementou a estrutura correta, mas a execução visual falhou em relação ao mockup.
Nova regra de trabalho: PRIMEIRO analisar, apresentar plano com as classes exatas e AGUARDAR aprovação.

1. Botão "Sair": mover para DENTRO do <Header>, canto superior esquerdo (fundo transparente, texto claro).
2. Clipping na lista: o primeiro cartão ficava cortado sob o título; ajustar padding/margin do contêiner.
3. Badges: mover para o canto superior direito do cartão; melhorar alinhamento e respiro do ícone/textos.

Terminar perguntando: "Posso prosseguir com a refatoração?"
```

### 2.3 Prompt 3 — Aprovação e Diretrizes de Execução (Commit `36a0efa`)

```text
Plano aprovado. Diretrizes finais:
1. Textos: IGNORAR os textos do mockup; MANTER os textos colaborativos
   ("Acompanhe suas solicitações ou abra uma nova.", "+ NOVA SOLICITAÇÃO 📱",
   "Minhas Solicitações Recentes").
2. Ícones: GERAR as ilustrações para os cartões (buraco no asfalto, bueiro etc.) com a estética do mockup,
   salvando em assets. NÃO usar emojis genéricos para os problemas. Badges (⏳, ✓) e Sair (🚪) podem usar emojis/SVG.
3. Header (mobile): ao colocar "Sair 🚪" na linha de cima, ajustar padding e altura para não ficar alto;
   link discreto (font-size pequeno), alinhado ao topo-esquerdo.
Ação: executar, gerar/importar imagens, rodar testes e build e commitar:
   fix(frontend): alinhamento visual do painel, badges e geracao de ilustracoes dos cartoes
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Layout com Scroll Isolado (`PainelCidadao.jsx` e `PainelCidadao.scss`)
* **Trava de rolagem do documento:** `PainelCidadao.jsx` adiciona a classe `painel-cidadao-ativo` em `<html>` e `<body>` ao montar e a remove ao desmontar (`useEffect` com *cleanup*). O SCSS aplica `height: 100dvh; overflow: hidden;` somente enquanto a classe existe, sem afetar as demais rotas.
* **Casca da aplicação:** `App.js` passou a aplicar a classe `app-layout--painel` na rota `/cidadao/painel` (`height: 100dvh; overflow: hidden;`), mantendo o Header no topo e o Footer global fixo na base.
* **Único contêiner rolável:** `.painel-cidadao__lista` com `flex: 1; min-height: 0; overflow-y: auto;`. A seção pai usa `display: flex; flex-direction: column; min-height: 0;` para repassar a rolagem à lista. O bloco superior (`.painel-cidadao__topo`) usa `flex-shrink: 0`.
* **Correção do clipping:** folga no topo da lista (`padding: 8px 8px 16px 4px`, `scroll-padding-top: 8px`, `margin-top: 4px`) e `z-index`/margem inferior no título `.painel-cidadao__secao-titulo`.
* **Linguagem colaborativa:** saudação `Olá, [Nome]! 👋` (nome obtido de `zelus_cidadao` no `localStorage`), subtítulo "Acompanhe suas solicitações ou abra uma nova.", botão `+ NOVA SOLICITAÇÃO 📱` (`#00c853`, borda cartum e sombra sólida) e título "Minhas Solicitações Recentes".
* **Cartões (`.solicitacao-card`):** fundo branco, `border: 3px solid #1a1a24`, cantos arredondados e sombra cartum. A linha superior (`.solicitacao-card__topo`) reúne título e badge (`.badge--pendente` / `.badge--concluido`) alinhada ao canto superior direito, com ⏳ (pendente) e ✓ (concluído) marcados como `aria-hidden`.
* **Dados simulados (mock):** 3 solicitações estáticas dentro do componente (Buraco na Rua / Asfalto, Bueiro / Boca-de-lobo, Descarte Irregular de Entulho) até a integração com a API.

### 3.2 Geração e Integração de Ilustrações por Inteligência Artificial
* **Geração:** 3 ilustrações em estilo cartum vetorial (contorno preto espesso, cores chapadas, fundo branco), geradas por IA a partir de *prompts* descritivos:
  1. Buraco no asfalto com cones de sinalização;
  2. Bueiro / boca-de-lobo com água e lixo;
  3. Entulho descartado irregularmente na calçada.
* **Armazenamento:** `frontend/src/assets/images/solicitacao-buraco.jpg`, `solicitacao-bueiro.jpg` e `solicitacao-entulho.jpg`.
* **Otimização:** redimensionadas de 1024 px para 320 px (JPEG, qualidade 85), reduzindo cada arquivo de ~300–400 KB para ~13–20 KB.
* **Integração:** importadas em `PainelCidadao.jsx` e renderizadas via `<img className="solicitacao-card__imagem" alt="" aria-hidden="true">`, por serem decorativas (o conteúdo é transmitido pelo título, protocolo e status).
* **Observação de governança:** as ilustrações são produto de IA generativa e aproximam — não replicam pixel a pixel — as artes do mockup oficial.

### 3.3 Refatoração do `<Header>` (Botão "Sair" e Limpeza de Sessão)
* **API do componente:** `Header` recebe a prop opcional `mostrarSair` (padrão `false`). `App.js` a ativa somente na rota do painel (`<Header mostrarSair={isPainelRoute} />`).
* **Comportamento:** o `<Link to="/login/cidadao" className="header__sair">Sair 🚪</Link>` executa `limparSessao()` no clique, removendo `zelus_token` e `zelus_cidadao` do `localStorage` e redirecionando ao login. O antigo botão "Sair ->" foi removido do corpo do painel.
* **Estilo (`Header.scss`):** fundo transparente, texto branco, `font-size: 0.78rem`, `line-height: 1`. No mobile, o modificador `.header--com-sair` ativa `flex-wrap` e reduz o padding do contêiner (`6px 14px 8px`), de modo que "Sair" ocupe uma linha fina no topo-esquerdo sem inflar o cabeçalho; a partir de `768px` o link volta a ficar inline à esquerda.

### 3.4 Qualidade de Software e Governança de Testes
* **Criação de [`PainelCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/PainelCidadao.test.js):** 9 casos (saudação com nome do `localStorage`, nome padrão, botão principal, lista estática, badges alinhadas ao título, ilustração em cada cartão, ausência do "Sair" no corpo da página, remoção dos blocos antigos e trava/liberação da rolagem).
* **Criação de [`Header.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Header.test.js):** 3 casos (sem "Sair" por padrão; "Sair" visível com `mostrarSair`; limpeza do `localStorage` e navegação ao login no clique).
* **Painel Consolidado:** 8 suítes executadas e **66 testes aprovados** (100% de sucesso); build de produção compilado com sucesso.

---

## 4. Evidências de Execução dos Testes e Compilação

```
PASS  src/tests/Home.test.js (5 testes)
PASS  src/tests/LoginCidadao.test.js (14 testes)
PASS  src/tests/CadastroCidadao.test.js (14 testes)
PASS  src/tests/RecuperarSenhaCidadao.test.js (13 testes)
PASS  src/tests/ActionCard.test.js (4 testes)
PASS  src/tests/CookieBanner.test.js (4 testes)
PASS  src/tests/PainelCidadao.test.js (9 testes)
PASS  src/tests/Header.test.js (3 testes)

Test Suites: 8 passed, 8 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Ran all test suites.

Creating an optimized production build...
Compiled successfully.
```
