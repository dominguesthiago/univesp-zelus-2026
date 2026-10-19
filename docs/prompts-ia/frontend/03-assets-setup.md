# Registro de Rastreabilidade de Prompt de IA — Configuração de Mídias e Assets

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `03-assets-setup`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Data/Hora do Registro:** 19 de outubro de 2026 - 17:43 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-ASSETS-SETUP-003`
* **Módulo:** Organização de Diretórios de Recursos Estáticos, Assets e Imagens
* **Objetivo:** Estabelecer a arquitetura de pastas para mídias (`images/` e `icons/`), garantindo que o time de design e a equipe de frontend possuam um contrato técnico unificado de nomenclatura, formatos eficientes (WebP/SVG), metas de performance e diretrizes de acessibilidade para a tela inicial.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior
* **Responsabilidade:** Arquitetar a infraestrutura de assets estáticos do React, prevenir inconsistências de importação e assegurar a observância de boas práticas de Core Web Vitals e WCAG 2.1 AA.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt Submetido pelo Usuário

Abaixo encontra-se a transcrição literal do comando submetido para a preparação da estrutura de assets:

```text
Atuando como Engenheiro de Frontend Sênior, nossa próxima tarefa é configurar a estrutura de Mídias e Assets do projeto ZELUS, preparando o terreno para as imagens (logo e ilustrações) que serão inseridas futuramente pelo time de design.

Sua Tarefa Agora:
NÃO crie nenhum diretório ou arquivo final ainda. Elabore apenas um Plano de Ação estruturado detalhando o que será criado.

Mapeamento para o Plano de Ação:

Estrutura de pastas: Liste a criação de frontend/src/assets/images/ e frontend/src/assets/icons/. Inclua um arquivo .gitkeep na pasta icons/ para garantir que ela suba no versionamento.

Documentação de Assets: Liste a criação do arquivo frontend/src/assets/images/LEIA-ME-ASSETS.md. Este documento deverá listar os nomes exatos dos arquivos que o código React irá procurar no futuro (ex: logo-zelus.png, ilustracao-cidadao.png, ilustracao-prefeitura.png) e recomendar formatos (ex: WebP/SVG) e propósitos baseados na tela inicial.

Rastreabilidade: Confirme no plano que criará o arquivo docs/prompts-ia/frontend/03-assets-setup-plan.md contendo o registro deste prompt.

Devolva estritamente o Plano de Ação detalhado. Termine sua resposta perguntando se o plano está aprovado para a execução.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados
1. [.gitkeep](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/icons/.gitkeep)
   * Garante a persistência e o rastreamento da pasta `frontend/src/assets/icons/` no repositório Git, preparando o espaço para os futuros ícones vetoriais SVG da plataforma.
2. [LEIA-ME-ASSETS.md](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/LEIA-ME-ASSETS.md)
   * Guia normativo detalhando a tabela de arquivos esperados (`logo-zelus.png`, `logo-zelus.svg`, `ilustracao-cidadao.png`, `ilustracao-prefeitura.png`, `hero-zeladoria.png`), recomendações de formato WebP/SVG, limites de peso (Performance Budget) e regras de acessibilidade WCAG AA (uso correto de `alt` e `aria-hidden`).
3. [03-assets-setup.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/03-assets-setup.md)
   * Registro formal de governança e rastreabilidade da decisão de engenharia de software com auxílio de IA.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critério de Sucesso 1.1.1 (Conteúdo Não-Textual) e Critério 1.4.5 (Imagens de Texto).
2. **Google Web Vitals**: Otimização de LCP (*Largest Contentful Paint*) e prevenção de CLS (*Cumulative Layout Shift*) através de dimensionamento explícito e compressão WebP.
