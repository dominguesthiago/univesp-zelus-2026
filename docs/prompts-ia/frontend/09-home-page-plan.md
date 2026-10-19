# Registro de Rastreabilidade de Prompt de IA — Montagem da Home e Roteamento

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `09-home-page-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Montagem da Tela Inicial (Home) e configuração de rotas  
**Data/Hora do Registro:** 19 de outubro de 2026 - 18:52 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HOME-PAGE-009`
* **Módulo:** Páginas, Layout Global e Roteamento
* **Objetivo:** Montar a tela inicial (`Header`, `h1`, dois `ActionCard`, `Footer`) e configurar o `react-router-dom` no `App.js`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior

---

## 2. Prompts Originais Transcritos

### 2.1 Prompt de Planejamento

```text
Atuando como Engenheiro de Frontend Sênior, nosso próximo passo é a Montagem da Tela Inicial (HomePage) e a configuração das rotas.

Sua Tarefa Agora:
NÃO gere o código final ainda. Elabore apenas um Plano de Ação detalhando a arquitetura desta montagem.

Mapeamento para o Plano de Ação:

frontend/src/components/Footer.jsx e .scss: Detalhe a criação de um rodapé simples (tag <footer>) com o texto 'ZELUS • Acessível e inclusivo para todos', centralizado e com margens adequadas.

frontend/src/pages/Home.jsx e .scss: Detalhe a estrutura da página. Ela importará o <Header/> no topo (fora da tag principal, se preferir), uma tag <h1> com o texto 'Como deseja acessar o ZELUS?' para hierarquia de acessibilidade, e uma área de conteúdo (Grid ou Flexbox) colocando as duas instâncias do <ActionCard/> (passando as props corretas para Cidadão e Prefeitura) lado a lado no desktop e empilhadas no mobile. O <Footer/> vai no final.

Atualização do frontend/src/App.js: Explique como você envolverá a aplicação com o <BrowserRouter> e usará <Routes> e <Route> do react-router-dom para renderizar a página <Home/> na rota /, inserindo-a dentro da nossa atual tag <main id="conteudo-principal">.

docs/prompts-ia/frontend/09-home-page-plan.md: Confirme a criação deste arquivo para registro deste planejamento.

Devolva estritamente o Plano de Ação. Termine sua resposta perguntando se o plano está aprovado para a geração do código.
```

### 2.2 Prompt de Execução (Aprovação)

```text
O Plano de Ação está 100% aprovado, incluindo as sugestões de arquitetura.

Definições para a execução:

Header e Footer DEVEM ficar no App.js (fora do <main>), conforme sua estrutura proposta.

O onClick dos ActionCards usará handlers provisórios (Opção A) com console.log.

Está autorizado alterar o frontend/src/components/Header.jsx substituindo a tag <a> por <Link to="/"> do react-router-dom.

Sua Tarefa Agora:
Execute fisicamente as seguintes ações na ordem:

Crie os arquivos Footer.jsx e Footer.scss em frontend/src/components/.

Crie os arquivos Home.jsx e Home.scss em frontend/src/pages/.

Modifique o Header.jsx para usar <Link>.

Modifique o App.js para incluir o <BrowserRouter>, as <Routes>, a <Route> da Home e o posicionamento correto do Header e Footer.

Crie fisicamente o arquivo docs/prompts-ia/frontend/09-home-page-plan.md com o registro deste planejamento.

Rode o comando de build (npm run build na pasta frontend/) para garantir que tudo compila sem erros.

Me avise apenas quando todas as alterações, criações e a verificação do build forem concluídas com sucesso.
```

---

## 3. Decisões Arquiteturais e Entregas

### 3.1 Artefatos
1. [Footer.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Footer.jsx) e [Footer.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Footer.scss): `<footer>` com o texto "ZELUS • Acessível e inclusivo para todos", centralizado.
2. [Home.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.jsx) e [Home.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.scss): `<h1>` "Como deseja acessar o ZELUS?" e grid com dois `ActionCard` (1 coluna no mobile, 2 a partir de `$breakpoint-md`).
3. [Header.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Header.jsx): `<a href="/">` substituído por `<Link to="/">`.
4. [App.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js): `BrowserRouter` > skip link > `Header` > `<main>` com `Routes`/`Route "/"` > `Footer` > `CookieBanner`.
5. [global.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/global.scss): adicionadas as regras `.app-layout` (coluna flex, `min-height: 100vh`) e `.app-main` (`flex: 1`) previstas no plano, para manter o rodapé na base. *Não estavam na lista de ações do prompt de execução, mas faziam parte do plano aprovado.*

### 3.2 Decisões
* `Header` e `Footer` ficam no `App`, fora do `<main>`, preservando os landmarks `banner`, `main` e `contentinfo` e a eficácia do skip link.
* `onClick` dos cards: handlers provisórios com `console.log` (TODO: `useNavigate` quando existirem `/cidadao` e `/prefeitura`).
* `altText=""` nas duas ilustrações (decorativas; o título do card as descreve).
* Textos dos cards definidos pelo agente e aprovados no plano.
* Divergência de convenção: o `LEIA-ME-ARQUITETURA.md` sugere `HomePage.js`; foi usado `Home.jsx` conforme solicitado.

### 3.3 Pendências Conhecidas
* O link do `CookieBanner` aponta para `/politica-privacidade`, que **não é rota**: renderiza `<main>` vazio.
* Só existe a rota `/`; não há rota curinga/404.
* Os botões dos cards apenas registram no console.
* O botão de ajuda do Header ainda não tem ação.
* O `CookieBanner` (fixo) cobre o `Footer` enquanto não for aceito.
* Logo e ilustrações continuam sendo placeholders.

---

## 4. Verificação

* **Build (`npm run build`):** concluído com sucesso (código de saída 0, "Compiled successfully"), sem erros ou warnings de compilação/lint. Bundle gzip: `main.js` ≈ 73,87 kB e `main.css` ≈ 2,14 kB. Houve apenas um aviso de depreciação do Node (`fs.F_OK`), alheio ao projeto. O build valida imports, SCSS e rotas; **não** valida o comportamento visual.
* **Verificação visual no navegador:** não realizada.
