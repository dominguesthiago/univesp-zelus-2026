# Registro de Rastreabilidade de Prompt de IA — Arquitetura do Componente CookieBanner

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `05-cookie-banner-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Componente 01 — Banner Global de Privacidade e Consentimento  
**Data/Hora do Registro:** 19 de outubro de 2026 - 18:17 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-COOKIE-BANNER-005`
* **Módulo:** Componentes Reutilizáveis de Frontend / Compliance Visual
* **Objetivo:** Projetar e implementar o componente React `CookieBanner` para atender às diretrizes da LGPD e da Política de Cookies do ZELUS, persistindo a confirmação do usuário no `localStorage`.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior
* **Responsabilidade:** Estruturar o componente funcional com hooks idiomáticos (`useState` e `useEffect`), iconografia vetorial (`lucide-react`), layout responsivo fixado no rodapé com SCSS e rigorosa acessibilidade WCAG 2.1 AA.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt Submetido pelo Usuário

Abaixo encontra-se a transcrição literal do comando submetido:

```text
Atuando como Engenheiro de Frontend Sênior, vamos construir o nosso primeiro componente React do ZELUS: o Pop-up de Consentimento Global (Cookies e Privacidade).

Sua Tarefa Agora:
NÃO gere o código final do componente ainda. Elabore apenas um Plano de Ação detalhando a arquitetura deste componente.

Mapeamento para o Plano de Ação:

frontend/src/components/CookieBanner.jsx: Detalhe no plano a estrutura do componente funcional. Explique como ele usará o Hook useState e o useEffect para ler/escrever a variável zelus_termo_aceito no localStorage. Confirme o uso de um ícone do lucide-react.

frontend/src/components/CookieBanner.scss: Detalhe as regras de estilo. O componente deve ser fixado no rodapé (position: fixed), ser responsivo (empilhar texto e botão no celular) e respeitar as variáveis de cores ($color-bg-ice ou $color-primary) criadas no nosso Design System.

docs/prompts-ia/frontend/05-cookie-banner-plan.md: Confirme a criação deste arquivo para registro deste planejamento.

Devolva estritamente o Plano de Ação. Termine sua resposta perguntando se o plano está aprovado para a geração do código.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados
1. [CookieBanner.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/CookieBanner.jsx)
   * **Estado Reativo:** Inicializa oculto (`useState(false)`) e avalia `localStorage.getItem('zelus_termo_aceito')` dentro do ciclo `useEffect`.
   * **Persistência:** Grava `'zelus_termo_aceito' = 'true'` via `handleAceitar()` ao acionar o botão de confirmação.
   * **Iconografia:** Ícone `ShieldCheck` da biblioteca `lucide-react`.
   * **Acessibilidade:** Elemento `<aside role="region" aria-label="...">` com foco semântico e links acessíveis.
2. [CookieBanner.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/CookieBanner.scss)
   * **Posicionamento Fixo:** `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;`.
   * **Tokens do Design System:** Consome `vars.$color-surface`, `vars.$color-border`, `vars.$color-primary`, `vars.$color-primary-hover` e `vars.$shadow-lg`.
   * **Responsividade:** Layout `flex` em linha para desktop e empilhamento em coluna (`width: 100%`) para telas móveis (`breakpoint-md`).
   * **Área de Toque:** Botão com altura mínima de `44px` (WCAG 2.5.5) e animação com suporte a `prefers-reduced-motion`.
3. [05-cookie-banner-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/05-cookie-banner-plan.md)
   * Registro formal de governança e rastreabilidade da decisão técnica.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critério 1.4.3 (Contraste Mínimo), Critério 2.4.7 (Foco Visível) e Critério 2.5.5 (Tamanho do Alvo de Toque).
2. **Guia Orientativo de Cookies da ANPD (2022)**: Comunicação transparente e objetiva de armazenamento estritamente necessário.
