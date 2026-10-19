# Registro de Rastreabilidade de Prompt de IA — Compliance e Acessibilidade

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `01-docs-compliance`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Data/Hora do Registro:** 19 de outubro de 2026 - 17:15 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-COMPLIANCE-001`
* **Módulo:** Governança Regulatória, LGPD e Acessibilidade Universal Frontend
* **Objetivo:** Estabelecer o arcabouço normativo, de conformidade com a LGPD e de acessibilidade (WCAG 2.1 AA / eMAG) antes de qualquer desenvolvimento de interface com o usuário no sistema ZELUS.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Especialista em Compliance e Acessibilidade Digital
* **Responsabilidade:** Mapear requisitos legais da Lei nº 13.709/2018 (LGPD), Lei nº 13.146/2015 (LBI), diretrizes da ANPD sobre cookies/armazenamento local e critérios de acessibilidade W3C/WAI WCAG 2.1 AA e eMAG v3.1 aplicáveis ao sistema ZELUS.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt Submetido pelo Usuário

Abaixo encontra-se a transcrição fidedigna do comando submetido para abertura da fase de governança documental:

```text
Atuando como Especialista em Compliance e Acessibilidade Digital, nossa primeira tarefa na nova fase do projeto ZELUS é definir as diretrizes legais e de inclusão que regerão o sistema.

Sua Tarefa Agora:
NÃO crie nenhum arquivo ainda. Gere apenas um Plano de Ação detalhado contendo a estrutura dos tópicos que você abordará em cada um dos documentos abaixo.

Mapeamento de Pastas e Arquivos a serem criados (para o seu Plano de Ação):

docs/documentacao/diretrizes-acessibilidade/diretrizes-acessibilidade.md: Baseado no WCAG 2.1 (nível AA) e eMAG. Focado em contraste, navegação por teclado e leitores de tela.

docs/documentacao/politica-privacidade/politica-privacidade.md: Baseado na LGPD. Focado na coleta de geolocalização exata (para o Haversine) e retenção de dados dos cidadãos.

docs/documentacao/politica-cookies/politica-cookies.md: Focado no uso exclusivo de armazenamento local (localStorage/sessionStorage) para tokens JWT, dispensando banners de marketing.

docs/prompts-ia/frontend/01-docs-compliance.md: Arquivo onde você salvará este exato prompt para manter a nossa rastreabilidade.

Elabore o Plano de Ação detalhando os cabeçalhos (H2, H3) que você usará em cada documento e as bibliografias reais que serão citadas. Termine sua resposta perguntando se o plano está aprovado para a geração dos arquivos.
```

---

## 3. Decisões Arquiteturais e Diretrizes Vinculadas

### 3.1 Artefatos Planejados e Mapeamento de Dependências Técnicas
Em conformidade com a aprovação formal do Plano de Ação, foram gerados e estruturados os seguintes artefatos na árvore de documentação do repositório:

1. [diretrizes-acessibilidade.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/diretrizes-acessibilidade/diretrizes-acessibilidade.md)
   * **Propósito:** Guia normativo de desenvolvimento para os componentes de UI (contraste mínimo 4.5:1/3:1, semântica WAI-ARIA, `:focus-visible`, navegação 100% por teclado, alternativas textuais para componentes de mapas).
2. [politica-privacidade.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/politica-privacidade/politica-privacidade.md)
   * **Propósito:** Política de privacidade pautada na LGPD (Lei nº 13.709/2018), fundamentando a coleta de geolocalização exata (GPS) para a fórmula de Haversine (roteirização e agrupamento inteligente de zeladoria) e definindo o ciclo de desassociação/anonimização dos dados do cidadão após a conclusão do serviço.
3. [politica-cookies.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/politica-cookies/politica-cookies.md)
   * **Propósito:** Diretriz de armazenamento em Web Storage (`localStorage` e `sessionStorage`) para tokens JWT (RFC 7519), demonstrando a ausência de rastreadores e justificando tecnicamente, à luz da ANPD, a dispensa de banners intrusivos de cookies.
4. [01-docs-compliance.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/01-docs-compliance.md)
   * **Propósito:** Registro e governança da rastreabilidade do processo de engenharia de software com apoio de inteligência artificial.

### 3.2 Registro de Versionamento e Rastreabilidade de Mudanças
* **Versão 1.0 (19/10/2026):** Criação inicial e estabelecimento do baseline de compliance documental e acessibilidade do projeto ZELUS.

---

## 4. Referências Normativas e Governança

1. **ISO/IEC 42001:2023**. *Information technology — Artificial intelligence — Management system (AIMS)*. Diretrizes para governança, auditabilidade e rastreabilidade de ciclos assistidos por IA.
2. **BRASIL. Lei Federal nº 13.709/2018 (LGPD)**. Princípio da prestação de contas e responsabilização (*accountability* - art. 6º, X).
