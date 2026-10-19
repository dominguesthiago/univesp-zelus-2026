# Registro de Rastreabilidade de Prompt de IA — Design System e Estilos Base

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `02-design-system`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Data/Hora do Registro:** 19 de outubro de 2026 - 17:28 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-DESIGN-SYSTEM-002`
* **Módulo:** Design System, Variáveis SCSS e Estilos Globais Acessíveis
* **Objetivo:** Estabelecer a fundação do Design System do frontend (cores municipais, tipografia modular, reset CSS, `:focus-visible` mandatório e classes para leitores de tela), traduzindo as diretrizes de acessibilidade WCAG 2.1 AA / eMAG para código SCSS reutilizável.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior especializado em UI/UX e Acessibilidade
* **Responsabilidade:** Criar uma arquitetura de estilos escalável, performática e inclusiva, garantindo contraste cromático rigoroso (≥ 4.5:1 para texto e ≥ 3.0:1 para elementos de UI), navegação por teclado sem barreiras e suporte pleno a tecnologias assistivas.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt Submetido pelo Usuário

Abaixo encontra-se a transcrição fidedigna do comando submetido para a estruturação do Design System:

```text
Atuando como Engenheiro de Frontend Sênior especializado em UI/UX e Acessibilidade, nossa tarefa agora é planejar o Design System (estilos base) do frontend do ZELUS, baseando-se nos mockups da tela inicial e nas diretrizes de acessibilidade recém-criadas.

Sua Tarefa Agora:
NÃO gere nenhum código final ou arquivo SCSS/MD ainda. Elabore apenas um Plano de Ação estruturado detalhando o que será criado.

Mapeamento para o Plano de Ação:

frontend/src/styles/_variables.scss: Liste no plano quais variáveis exatas de cores SCSS (primárias, secundárias, background, texto) e tipografia você planeja criar para refletir a identidade visual do ZELUS (Azul institucional, Verde Cidadão, Amarelo Prefeitura, branco gelo).

frontend/src/styles/global.scss: Liste as regras globais que serão incluídas (Reset de CSS, font-family padrão no body e a obrigatoriedade da regra de acessibilidade :focus-visible para navegação por teclado).

docs/prompts-ia/frontend/02-design-system-plan.md: Confirme no plano que criará este arquivo para registrar este prompt e manter a nossa rastreabilidade.

Devolva estritamente o Plano de Ação detalhado. Termine sua resposta perguntando se o plano está aprovado para a geração dos códigos reais.
```

---

## 3. Decisões Arquiteturais e Diretrizes Vinculadas

### 3.1 Artefatos Gerados
1. [_variables.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/_variables.scss)
   * **Cores Institucionais:** Azul institucional (`$color-primary: #0d47a1`), Verde Cidadão (`$color-secondary: #1b5e20`), Amarelo Prefeitura calibrado para contraste WCAG AA (`$color-accent: #b26a00`) e Branco Gelo (`$color-bg-ice: #f4f6f9`).
   * **Tipografia:** Fonte `'Inter'` com escala modular em unidades relativas (`rem`) e altura de linha de `1.5` para textos de parágrafo.
   * **Tokens Auxiliares:** Breakpoints responsivos, grid modular de 4px/8px, sombras com elevação suave e anel de foco acessível.
2. [global.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/global.scss)
   * **Reset CSS:** Box-sizing universal, reset de margens/paddings e normalização de inputs/botões.
   * **Acessibilidade Mandatória:** Estilo `:focus-visible` com anel de alto contraste para navegação por teclado, utilitário `.skip-link` para atalhos diretos ao conteúdo e `.sr-only` para leitores de tela.
   * **Inclusão Vestibular:** Diretiva `@media (prefers-reduced-motion: reduce)` para eliminação de animações involuntárias.
3. [02-design-system.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/02-design-system.md)
   * **Governança:** Arquivamento deste registro com os metadados técnicos e rastreabilidade da decisão.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critérios 1.4.3 (Contraste Mínimo), 1.4.11 (Contraste Não-Textual), 2.4.1 (Ignorar Blocos) e 2.4.7 (Foco Visível).
2. **eMAG v3.1**: Modelo de Acessibilidade em Governo Eletrônico (Brasil).
3. **Sass Modules**: Uso moderno de `@use` para evitar poluição do escopo global.
