# Registro de Rastreabilidade de Prompt de IA — Padronização Global do Header e Footer (Fonte Única da Verdade)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `25-padronizacao-header-footer`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Padronização visual e arquitetural de `<Header>` e `<Footer>` em todas as rotas (Home, Login, Cadastro, Recuperar Senha e Painel), unificação dos botões de navegação e comportamento fixo (topo/base)  
**Data/Hora do Registro:** 22 de outubro de 2026 - 12:15 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HEADER-FOOTER-GLOBAL-STANDARDIZATION-025`
* **Módulo:** Cabeçalho Global (`Header`), Rodapé Global (`Footer`), Telas de Autenticação (`LoginCidadao`, `CadastroCidadao`, `RecuperarSenhaCidadao`), Painel do Cidadão (`PainelCidadao`), Casca de Layout (`App.js`, `global.scss`)
* **Objetivo:**
  1. Estabelecer o padrão absoluto (fonte única da verdade) para Header e Footer em 100% das rotas do sistema ZELUS, em estrita fidelidade às proporções, cores e alinhamentos do mockup oficial.
  2. Padronizar o subtítulo institucional "Zeladoria Urbana" como **rigorosamente branco** (`#ffffff`), eliminando qualquer resquício de cor amarela em todos os cabeçalhos.
  3. Unificar a estrutura de navegação do canto superior esquerdo: o botão "Voltar" (Login, Cadastro, Recuperar Senha) passa a usar o mesmo alinhamento absoluto (`left: 16px; top: 50%; transform: translateY(-50%)`), mesmo comportamento e proporção do botão "Sair", preservando a centralização simétrica do logo ZELUS.
  4. Implementar comportamento fixo de tela cheia: Header fixo no topo (`flex-shrink: 0`) e Footer fixo na base (`flex-shrink: 0`) em todas as telas via Flexbox vertical em `.app-layout` (`height: 100dvh; overflow: hidden;`), isolando a rolagem exclusivamente no miolo da aplicação (`.app-main` / formulários).
  5. **Proteção estrita de escopo:** Preservar intactas as estilizações aprovadas do Painel do Cidadão (botão CTA verde suave `#aaebd3`, ilustrações cartum e scroll isolado da lista).
  6. Realizar a limpeza completa de regras CSS redundantes e conflitantes nos arquivos SCSS locais.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Tech Lead e Especialista em UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Tech Lead e UI/UX Designer, estou enviando novamente a imagem do mockup oficial para definirmos o padrão absoluto (única fonte da verdade) para o <Header> e o <Footer> em TODAS as telas (Login, Cadastro, Recuperar Senha e Painel).

O Objetivo:
Quero que o Header e o Footer tenham EXATAMENTE as mesmas proporções, cores e margens que você vê na imagem anexada, padronizando-os globalmente.

Diretrizes Visuais e Estruturais:
1. Cores e Altura (Fidelidade à Imagem): O subtítulo "Zeladoria Urbana" deve ser rigorosamente BRANCO (remova qualquer amarelo). A altura e o padding do cabeçalho devem ser unificados globalmente para bater com a proporção da imagem anexada.
2. A Exceção (Botão Sair/Voltar): MANTENHA o botão "Sair" (com o ícone vetorial LogOut) EXATAMENTE como você configurou no último commit (não use o emoji da imagem). Nas telas onde existe o botão "Voltar" (Login, Cadastro, Recuperar), ele deve adotar EXATAMENTE o mesmo alinhamento, comportamento e classe CSS estrutural que criamos para o botão "Sair".
3. Comportamento Fixo (Sticky/Fixed): O Header deve ficar fixo no topo e o Footer fixo na base da tela em TODAS as rotas (em telas curtas ou longas). Se a página tiver conteúdo longo (scroll), o cabeçalho e rodapé não devem rolar junto.
4. Limpeza de Lixo CSS: Remova propriedades CSS locais (LoginCidadao.scss, CadastroCidadao.scss, RecuperarSenhaCidadao.scss) que estejam tentando sobrescrever os tamanhos do cabeçalho ou do rodapé.

PROTEÇÃO DE ESCOPO (MUITO IMPORTANTE):
Sob nenhuma circunstância você deve alterar ou quebrar as estilizações que já validamos no Painel do Cidadão (o botão CTA verde claro, os cartões com as ilustrações, o scroll isolado da lista, etc.). O seu foco é ESTRITAMENTE o Header, o Footer e os wrappers/containers gerais de layout.
```

---

## 3. Decisões Arquiteturais e Execução Técnica

### 3.1 Subtítulo Rigorosamente Branco (`#ffffff`)
* Em `global.scss`, atualizada a regra unificada das classes de subtítulo (`.auth-header__subtitle`, `.header__brand-subtitle`, `.login-header__subtitle`, `.cadastro-header__subtitle`, `.recuperar-header__subtitle`) para `color: #ffffff !important;`.
* Nos arquivos SCSS individuais (`Header.scss`, `LoginCidadao.scss`, `CadastroCidadao.scss`, `RecuperarSenhaCidadao.scss`), foram removidas todas as tentativas de aplicação da variável `$color-accent` (amarelo) no subtítulo, consolidando a fidelidade cromática com o mockup.

### 3.2 Unificação dos Botões de Ação no Canto Superior Esquerdo (Sair e Voltar)
* O botão "Sair" foi mantido no `Header.jsx` utilizando o ícone vetorial `LogOut` (tamanho 16) da biblioteca `lucide-react`.
* Nos componentes `LoginCidadao.jsx`, `CadastroCidadao.jsx` e `RecuperarSenhaCidadao.jsx`, foram eliminados os blocos intermediários `*__top` que geravam quebra de linha.
* Os links de retorno (`&__back-link`) passaram a adotar a mesma estratégia de posicionamento absoluto:
  - `position: absolute; left: 16px; top: 50%; transform: translateY(-50%);` (mobile) e `left: 24px;` (desktop).
  - O container do cabeçalho (`.login-header`, `.cadastro-header`, `.recuperar-header`, `.header__container`) passou a ter `position: relative; display: flex; align-items: center; justify-content: center;`.
  - Essa abordagem assegura que o logo ZELUS e seu texto permaneçam rigorosamente centralizados na barra azul marinho `#1a3458`, com padding unificado de `10px 16px` no mobile e `12px 24px` no desktop.

### 3.3 Arquitetura de Casca com Topo e Base Fixos (`.app-layout`)
* `.app-layout` configurado com `height: 100dvh; max-height: 100dvh; overflow: hidden; display: flex; flex-direction: column;`.
* Os cabeçalhos institucionais (`.header`, `.login-header`, etc.) possuem `flex-shrink: 0;`, garantindo fixação estrita no topo.
* Os rodapés institucionais (`.footer`, `.login-footer-tagline`, etc.) possuem `flex-shrink: 0;`, garantindo fixação estrita na base.
* O conteúdo dinâmico (`.app-main`, `.login-main-container`, `.cadastro-main-container`, `.recuperar-main-container`) assume `flex: 1; min-height: 0; overflow-y: auto;`, permitindo que apenas os formulários rolem internamente caso ultrapassem a altura disponível da viewport.
* **Proteção de Escopo do Painel:** Na rota `/cidadao/painel`, a classe `.app-layout--painel` mantém `.app-main { overflow: hidden; }` e delega a rolagem exclusivamente para `.painel-cidadao__lista`, preservando 100% da regra de ouro do Painel do Cidadão (cartões, badges no canto superior direito, ilustrações IA e botão CTA verde suave `#aaebd3`).

### 3.4 Limpeza de Código CSS Morto
* Eliminadas compensações manuais de margem negativa (`margin-top: -6px;`) e seletores redundantes nos SCSS locais de autenticação.
* Removidas sobrescritas anômalas de altura e padding dos cabeçalhos.

---

## 4. Evidências de Execução dos Testes e Compilação

* Execução da suíte completa de testes: **8 suítes e 66 testes aprovados (100%)**.
* Todas as asserções de acessibilidade (`aria-label`, foco, landmarks) e integridade navegacional foram plenamente satisfeitas.
