# Registro de Rastreabilidade de Prompt de IA — Arquitetura do Componente Header

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `07-header-component-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Componente 02 — Cabeçalho Global (Header)  
**Data/Hora do Registro:** 19 de outubro de 2026 - 18:31 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-HEADER-007`
* **Módulo:** Componentes Reutilizáveis de Frontend / Layout Global
* **Objetivo:** Projetar e implementar o cabeçalho do ZELUS com semântica HTML5, logotipo acessível e botão de ajuda/acessibilidade com ícone `HelpCircle`.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior
* **Responsabilidade:** Estruturar o cabeçalho com landmarks (`<header>`, `<nav>`), garantir contraste AAA sobre o azul institucional e foco visível em fundo escuro (WCAG 2.1 AA).

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt de Planejamento

```text
Atuando como Engenheiro de Frontend Sênior, nosso próximo passo é construir o Cabeçalho (Header) da aplicação ZELUS.

Sua Tarefa Agora:
NÃO gere o código final do componente ainda. Elabore apenas um Plano de Ação detalhando a arquitetura.

Mapeamento para o Plano de Ação:

frontend/src/components/Header.jsx: Detalhe a estrutura semântica (<header>, <nav>). Mostre como importará a logo de ../assets/images/logo-zelus.png (com atributo alt acessível) e o ícone HelpCircle da lucide-react para o botão de acessibilidade.

frontend/src/components/Header.scss: Detalhe as regras visuais. Uso de Flexbox para alinhamento (justify-content: space-between), aplicação do fundo $color-primary e texto $color-text-inverse, garantindo contraste e responsividade.

docs/prompts-ia/frontend/07-header-component-plan.md: Confirme a criação deste arquivo para registro.

Devolva estritamente o Plano de Ação. Termine sua resposta perguntando se o plano está aprovado para a geração do código.
```

### 2.2 Transcrição do Prompt de Execução (Aprovação com Opção A)

```text
O Plano de Ação do Header está 100% aprovado. Vamos seguir com a Opção A para resolver a pendência da imagem.

Sua Tarefa Agora:
Execute fisicamente as seguintes ações na ordem:

Gere um arquivo PNG placeholder simples (pode ser uma imagem base64 convertida em arquivo ou gerada por script) e salve-o exatamente como frontend/src/assets/images/logo-zelus.png.

Crie o arquivo frontend/src/components/Header.jsx importando a imagem e utilizando a tag semântica e o ícone HelpCircle conforme o plano.

Crie o arquivo frontend/src/components/Header.scss aplicando o Flexbox, a cor institucional e o override do anel de foco.

Crie fisicamente o arquivo docs/prompts-ia/frontend/07-header-component-plan.md contendo o registro deste planejamento.

Gere os códigos completos e crie todos os quatro arquivos. Me avise apenas quando a criação for concluída com sucesso.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados
1. [logo-zelus.png](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/logo-zelus.png)
   * **PLACEHOLDER TEMPORÁRIO** (400×120 px, fundo transparente, gerado por script PowerShell/System.Drawing). Deve ser **substituído pela versão oficial do time de design, mantendo exatamente o mesmo nome de arquivo**.
2. [Header.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Header.jsx)
   * `<header role="banner">` + `<nav aria-label="Navegação principal">`; logo com `alt="ZELUS - Zeladoria Urbana"`, `width`/`height` explícitos (anti-CLS); botão com ícone `HelpCircle` (`aria-hidden`) e `aria-label` descritivo. Botão ainda sem ação (painel de acessibilidade será passo futuro).
3. [Header.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Header.scss)
   * Flexbox com `justify-content: space-between`, fundo `$color-primary`, texto `$color-text-inverse`, `position: sticky` com `z-index: 900` (abaixo do CookieBanner).
   * **Override do foco:** o anel global (`#0d47a1`) é idêntico ao fundo do header; foi aplicado anel `$color-accent-light` local.
   * Responsivo: rótulo "Ajuda" ocultado visualmente no mobile (mantido para leitores de tela).
4. [07-header-component-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/07-header-component-plan.md)
   * Este registro.

### 3.2 Pendências Registradas
* Substituir `logo-zelus.png` pelo asset oficial.
* O `Header` ainda **não foi integrado ao `App.js`** (passo futuro).
* O botão de ajuda ainda não possui ação associada.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critérios 1.1.1 (Conteúdo Não-Textual), 1.4.3 (Contraste), 2.4.4 (Finalidade do Link), 2.4.7 (Foco Visível) e 2.5.5 (Tamanho do Alvo).
2. [LEIA-ME-ASSETS.md](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/LEIA-ME-ASSETS.md): contrato de nomenclatura de assets.
