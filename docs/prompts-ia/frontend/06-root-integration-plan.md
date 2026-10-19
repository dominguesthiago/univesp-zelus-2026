# Registro de Rastreabilidade de Prompt de IA — Limpeza de Boilerplate e Integração Raiz

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `06-root-integration-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Passo 3 — Limpeza de Boilerplate e Integração Raiz da Aplicação  
**Data/Hora do Registro:** 19 de outubro de 2026 - 18:24 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-ROOT-INTEGRATION-006`
* **Módulo:** Inicialização e Estrutura Raiz do Frontend
* **Objetivo:** Limpar os arquivos de ponto de entrada (`index.js` e `App.js`), conectar a folha de estilos global do Design System (`global.scss`) e instanciar os primeiros componentes globais de acessibilidade (`.skip-link`) e conformidade (`<CookieBanner />`).
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior
* **Responsabilidade:** Eliminar ruídos e código legado de template, garantindo que o ponto de entrada da aplicação React seja semântico, performático e compatível com as diretrizes de acessibilidade WCAG 2.1 AA e eMAG v3.1.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt Submetido pelo Usuário

Abaixo encontra-se a transcrição literal do comando executado:

```text
Atuando como Engenheiro de Frontend Sênior, nosso próximo passo é limpar o boilerplate padrão do React e integrar os componentes que já criamos na raiz da aplicação.

Sua Tarefa Agora:
NÃO gere o código final ainda. Elabore apenas um Plano de Ação detalhando as alterações.

Mapeamento para o Plano de Ação:

frontend/src/index.js: Detalhe como você limpará as importações de CSS padrão do React (como index.css) e fará a importação do nosso ./styles/global.scss.

frontend/src/App.js: Detalhe a remoção total do código padrão (logo girando, App.css). Explique que o componente retornará apenas uma div vazia ou um <main> básico, renderizando o <CookieBanner/> importado de ./components/CookieBanner.

docs/prompts-ia/frontend/06-root-integration-plan.md: Confirme a criação deste arquivo para registro deste planejamento.

Devolva estritamente o Plano de Ação. Termine sua resposta perguntando se o plano está aprovado para a alteração dos códigos.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Modificados e Criados
1. [index.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/index.js)
   * Ativação funcional do `ReactDOM.createRoot` com `React.StrictMode`.
   * Importação exclusiva da folha de estilos do Design System: `import './styles/global.scss';`.
   * Eliminação de quaisquer dependências ou estilos genéricos (`index.css`).
2. [App.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js)
   * Limpeza de código morto e remoção de qualquer dependência visual legada (`App.css`).
   * Inclusão do *Skip Link* (`<a href="#conteudo-principal" className="skip-link">`) para conformidade com o critério WCAG 2.4.1.
   * Definição da área semântica `<main id="conteudo-principal" className="app-main" tabIndex="-1">`.
   * Injeção do componente `<CookieBanner />` no nível raiz da aplicação.
3. [06-root-integration-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/06-root-integration-plan.md)
   * Registro formal de governança, rastreabilidade e justificativa técnica da integração.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critério 2.4.1 (Ignorar Blocos via Skip Link) e Critério 1.3.1 (Informações e Relações Semânticas).
2. **React 18 Architecture**: Uso da API moderna `createRoot` para renderização concorrente estável.
