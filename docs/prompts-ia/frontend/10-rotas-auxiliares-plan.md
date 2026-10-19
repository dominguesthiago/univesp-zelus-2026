# Registro de Rastreabilidade de Prompt de IA — Páginas Auxiliares e Rotas

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `10-rotas-auxiliares-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Páginas auxiliares (Privacidade e 404) e rotas  
**Data/Hora do Registro:** 19 de outubro de 2026 - 19:03 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-AUX-ROUTES-010`
* **Módulo:** Páginas e Roteamento
* **Objetivo:** Tratar as pontas soltas do roteamento: criar a página de Política de Privacidade e Cookies (alvo do link do `CookieBanner`) e a página 404 (rota curinga).
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior

---

## 2. Prompts Originais Transcritos

> **Nota sobre a sintaxe de rota:** nos dois prompts abaixo, os trechos `<Route element="{<Privacidade" path="..."/>} />` e `<Route element="{<NotFound" path="*"/>} />` chegaram **corrompidos** (não são JSX válido). Na execução foi usada a sintaxe padrão do React Router v6: `<Route path="..." element={<Componente />} />`. A transcrição abaixo preserva o texto exatamente como recebido.

### 2.1 Prompt de Planejamento

```text
Atuando como Engenheiro de Frontend Sênior, nosso próximo passo é tratar as pontas soltas do roteamento criando as páginas auxiliares do ZELUS.

Sua Tarefa Agora:
NÃO gere o código final ainda. Elabore apenas um Plano de Ação detalhando a arquitetura desta etapa.

Mapeamento para o Plano de Ação:

frontend/src/pages/Privacidade.jsx e .scss: Detalhe a criação de uma página simples e acessível contendo o título 'Política de Privacidade e Cookies' (em tag <h1>) e um texto estruturado provisório explicando o uso do localStorage, além de um botão/link para voltar à Home.

frontend/src/pages/NotFound.jsx e .scss: Detalhe a criação da página de Erro 404. Deve conter uma mensagem amigável (ex: 'Página não encontrada') e um botão claro usando <Link to="/"> para retornar ao início.

Atualização do frontend/src/App.js: Explique a inclusão de <Route element="{<Privacidade" path="/politica-privacidade"/>} /> e da rota curinga <Route element="{<NotFound" path="*"/>} /> dentro do <Routes>.

docs/prompts-ia/frontend/10-rotas-auxiliares-plan.md: Confirme a criação deste arquivo para o registro de governança.

Devolva estritamente o Plano de Ação. Termine perguntando se o plano está aprovado para a geração do código.
```

### 2.2 Prompt de Execução (Aprovação)

```text
O Plano de Ação das páginas auxiliares e rotas está 100% aprovado.

Confirmações:

Use a sintaxe oficial <Route element="{<Component" path="..."/>} />.

Substitua o <a href> por <Link to...> no arquivo CookieBanner.jsx.

Sua Tarefa Agora:
Execute fisicamente as seguintes ações na ordem:

Crie os arquivos Privacidade.jsx e Privacidade.scss em frontend/src/pages/, estruturados com o texto provisório, a tag <h1> e a alteração do document.title.

Crie os arquivos NotFound.jsx e NotFound.scss em frontend/src/pages/, com o visual 404 e botão de retorno.

Modifique frontend/src/App.js para incluir as duas novas rotas (/politica-privacidade e *).

Modifique frontend/src/components/CookieBanner.jsx para usar o componente <Link>.

Crie fisicamente o arquivo docs/prompts-ia/frontend/10-rotas-auxiliares-plan.md com o registro deste planejamento.

Rode o comando de build (npm run build na pasta frontend/) para garantir que as rotas e os links compilam sem erros.

Me avise apenas quando todas as alterações e a verificação do build forem concluídas com sucesso.
```

---

## 3. Decisões Arquiteturais e Entregas

### 3.1 Artefatos
1. [Privacidade.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Privacidade.jsx) e [Privacidade.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Privacidade.scss): `<h1>` "Política de Privacidade e Cookies", aviso de texto provisório, seções `<h2>`, `<Link to="/">` estilizado como botão e `document.title` definido por `useEffect`.
2. [NotFound.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NotFound.jsx) e [NotFound.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NotFound.scss): `<h1>` "Página não encontrada", numeral "404" decorativo (`aria-hidden`), `<Link to="/">` estilizado como botão e `document.title` definido por `useEffect`.
3. [App.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js): rotas `/politica-privacidade` e `*` adicionadas ao `<Routes>`.
4. [CookieBanner.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/CookieBanner.jsx): `<a href>` substituído por `<Link to="/politica-privacidade">`.
5. [10-rotas-auxiliares-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/10-rotas-auxiliares-plan.md): este registro.

### 3.2 Decisões
* O texto da página de Privacidade descreve **apenas o que o app faz hoje** (chave `zelus_termo_aceito`). Sessão e tema aparecem como "previstos". Detalhes específicos dos documentos de política (e-mail do encarregado, prazos de retenção, validade de token) **não** foram reproduzidos na página.
* Os botões de retorno são `<Link>` (navegação), com estilo de botão, `min-height: 44px` e override do anel de foco (o anel global `#0d47a1` seria invisível sobre o fundo azul).
* O título da aba é atualizado por página (WCAG 2.4.2). O título padrão em `index.html` continua "ZELUS — Zeladoria Urbana".

### 3.3 Pendências Conhecidas
* **Texto provisório:** a página de Privacidade precisa ser substituída pela política oficial.
* **Inconsistência de texto:** o `CookieBanner` ainda afirma o uso de "tokens de sessão e preferências de acessibilidade", que o app **ainda não implementa**, enquanto a página de Privacidade é mais restrita. O texto do banner deve ser revisado.
* **HTTP 404 real:** em SPA, URLs inexistentes respondem 200; um 404 verdadeiro depende do servidor de hospedagem. Em hospedagem estática, também é necessária configuração de fallback para `index.html`.
* **Foco ao trocar de rota:** o foco do teclado não é movido ao navegar entre páginas (apenas `document.title` muda). Pode ser tratado em etapa futura.
* O botão "Ajuda" do Header continua sem ação; logo e ilustrações continuam sendo placeholders.

---

## 4. Verificação

* **Build (`npm run build`):** concluído com sucesso (código de saída 0, "Compiled successfully"), sem erros ou warnings de compilação/lint. Bundle gzip: `main.js` ≈ 74,77 kB (+907 B) e `main.css` ≈ 2,47 kB (+326 B). Houve apenas um aviso de depreciação do Node (`fs.F_OK`), alheio ao projeto. O build valida imports, SCSS e rotas; **não** valida o comportamento em execução.
* **Verificação visual e teste de navegação no navegador:** não realizados.
