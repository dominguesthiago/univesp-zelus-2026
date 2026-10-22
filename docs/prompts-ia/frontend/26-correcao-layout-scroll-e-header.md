# Registro de Rastreabilidade de Prompt de IA — Correção do Scroll Global, Alinhamento do Botão Voltar (SVG) e Altura do Header

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `26-correcao-layout-scroll-e-header`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Correção de falhas de QA visual pós-commit f7f6a30: trava definitiva de rolagem no `html`/`body` para cabeçalho e rodapé fixos em todas as telas, unificação do botão "Voltar" com ícone vetorial SVG `ChevronLeft` e aumento de altura/padding do Header com subtítulo branco blindado via inline style  
**Data/Hora do Registro:** 22 de outubro de 2026 - 12:45 (UTC-03:00)  
**Status:** Implementado Localmente e Aprovado nos Testes (Aguardando Homologação Visual Local antes de Commit/Push)  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HEADER-SCROLL-QA-FIX-026`
* **Módulo:** Estilos Globais (`global.scss`), Cabeçalho Global (`Header.jsx`, `Header.scss`), Telas de Autenticação (`LoginCidadao.jsx`, `LoginCidadao.scss`, `CadastroCidadao.jsx`, `CadastroCidadao.scss`, `RecuperarSenhaCidadao.jsx`, `RecuperarSenhaCidadao.scss`), Área Logada (`PainelCidadao.jsx`, `PainelCidadao.scss`)
* **Objetivo:**
  1. **Trava Definitiva de Scroll Global:** Eliminar a rolagem do `body`/`html` que ocorria em páginas com textos longos (ex: Política de Privacidade) ou quando validações expandiam os formulários (ex: Cadastro e Login), garantindo que Header e Footer permaneçam rigorosamente fixos no topo e na base.
  2. **Alinhamento e Padronização do Botão Voltar:** Substituir o caractere unicode `&lsaquo;` (que apresentava variações de alinhamento vertical e inconsistências entre browsers) pelo componente vetorial SVG `<ChevronLeft size={18} />` da biblioteca `lucide-react`, aplicando posicionamento absoluto idêntico ao botão "Sair" do Painel.
  3. **Correção de Altura e Fidelidade Cromática do Header:** Ampliar o padding do cabeçalho institucional para `16px 16px` com `min-height: 72px` no mobile (`18px 24px` e `min-height: 76px` no desktop), eliminando a aparência espremida, e blindar o subtítulo "Zeladoria Urbana" com `style={{ color: '#ffffff' }}` inline para eliminar em definitivo qualquer tonalidade amarela.
  4. **Proteção de Escopo:** Preservar 100% intacta a estrutura e o design do Painel do Cidadão (ilustrações cartum, botão CTA verde `#aaebd3`, scroll isolado na lista).
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Tech Lead e Especialista em UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Tech Lead, o seu último commit de padronização (f7f6a30) falhou nos testes visuais de QA do cliente. A implementação não refletiu o seu plano de ação e a interface apresenta quebras graves de layout e inconsistências.

Relatório de QA (Bugs a Corrigir):
1. Scroll Global Falhou (Quebra de Header/Footer Fixos): Quando os formulários acionam erros de validação (ex: tela de Cadastro) ou quando páginas textuais longas são abertas (ex: Política de Privacidade), a tela INTEIRA rola. O Header e o Footer não estão fixos.
2. Alinhamento do Botão Voltar Falhou: O link "< Voltar" nas telas de Autenticação não está alinhado como o botão "Sair" do Painel. A estrutura do DOM ou a classe aplicada está errada.
3. Cabeçalho Espremido e Amarelo (CSS Falso): O subtítulo "Zeladoria Urbana" CONTINUA AMARELO em todas as páginas, e a altura do <Header> está demasiado curta (espremida).

Nova Ordem de Execução (TESTE LOCAL ANTES DO COMMIT):
1. Aplique todas as refatorações de CSS global, local e JSX rigorosamente como descrito no seu plano.
2. Certifique-se de que o Painel do Cidadão continue intacto.
3. Crie e salve o documento de rastreabilidade docs/prompts-ia/frontend/26-correcao-layout-scroll-e-header.md contendo todos os detalhes do seu plano e a sugestão de título/descrição para o commit futuro.
4. Rode a suíte de testes (npm test) para garantir que os links e atributos aria-label continuam a passar.
5. TRAVA DE SEGURANÇA: NÃO faça nenhum commit e NÃO faça push. Apenas modifique e salve os arquivos na sua área de trabalho.
```

---

## 3. Diagnóstico Técnico das Causas-Raiz

1. **Causa do Scroll Global da Janela:**
   * O `html` e `body` possuíam `overflow-x: hidden` e `min-height: 100dvh`, mas o `overflow-y` padrão permanecia livre (`visible`), permitindo que a janela do browser rolasse quando qualquer contêiner filho expandisse além de 100vh.
   * Nos contêineres de autenticação (`.cadastro-main-container`, `.login-main-container`), faltava a propriedade `min-height: 0` do Flexbox, o que impedia o encolhimento do item flex e propagava a expansão de altura para a raiz do documento.
2. **Causa do Desalinhamento do Botão Voltar:**
   * O caractere tipográfico `&lsaquo;` possui métricas de linha e baseline inconsistentes entre fontes do sistema operacional (Android vs. iOS vs. Windows), criando espaçamento vertical torto em relação ao texto "Voltar".
   * A solução robusta é utilizar o ícone SVG `<ChevronLeft size={18} />` com `display: inline-flex; align-items: center; gap: 4px;` e posicionamento absoluto idêntico ao botão "Sair".
3. **Causa do Cabeçalho Espremido e Subtítulo Amarelo:**
   * O padding anterior de `10px 16px` sem `min-height` resultava em uma altura total de ~52px, espremendo o logo e o título.
   * A cor amarela vinha de regras herdadas e especificidade CSS; a inserção direta do style inline `style={{ color: '#ffffff' }}` no JSX combinada com `!important` nos arquivos SCSS anula qualquer possibilidade de sobreposição indesejada.

---

## 4. Soluções Implementadas

### 4.1 Trava Universal de Scroll no `global.scss`
* `html` e `body` foram travados estritamente com `height: 100dvh !important; max-height: 100dvh !important; overflow: hidden !important;`.
* No bloco `@media (max-width: 767px)`, reforçado `height: 100dvh !important; overflow: hidden !important;` tanto para a raiz quanto para `.app-layout--auth`, `.login-card-mobile`, `.cadastro-card-mobile` e `.recuperar-card-mobile`.
* Os contêineres principais (`.app-main`, `.login-main-container`, `.cadastro-main-container`, `.recuperar-main-container`) receberam `flex: 1; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;`.

### 4.2 Proporções, Altura e Blindagem de Cor no Header Institucional
* Nos arquivos `Header.scss`, `LoginCidadao.scss`, `CadastroCidadao.scss` e `RecuperarSenhaCidadao.scss`:
  - `padding: 16px 16px; min-height: 72px; box-sizing: border-box; flex-shrink: 0;` (mobile).
  - `padding: 18px 24px; min-height: 76px;` (desktop).
* Em `Header.jsx`, `LoginCidadao.jsx`, `CadastroCidadao.jsx` e `RecuperarSenhaCidadao.jsx`:
  - Subtítulo atualizado com: `<span className="...__subtitle auth-header__subtitle" style={{ color: '#ffffff' }}>Zeladoria Urbana</span>`.

### 4.3 Unificação do Botão "Voltar" com `<ChevronLeft />`
* Substituído o unicode `&lsaquo;` pelo componente SVG `<ChevronLeft size={18} aria-hidden="true" />` da biblioteca `lucide-react`.
* Mantidos todos os atributos de acessibilidade originais (`aria-label="Voltar para a página inicial"` e `aria-label="Voltar para a página de login"`).
* Posicionamento absoluto refinado: `position: absolute; left: 16px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; gap: 4px;`.

### 4.4 Blindagem e Proteção de Escopo do Painel do Cidadão
* O arquivo `PainelCidadao.jsx` e `PainelCidadao.scss` mantiveram intactos:
  - Botão CTA "+ NOVA SOLICITAÇÃO 📱" na cor `#aaebd3` com borda preta cartum e sombra deslocada.
  - As 3 ilustrações cartum geradas por IA.
  - Scroll isolado exclusivamente na lista de solicitações recentes (`.painel-cidadao__lista`).

---

## 6. Refinamento de QA Local (Fase 2 — Ajuste de Casca, Footer Fixo e Respiro no Header)

### 6.1 Diagnóstico de QA no Ambiente Local
Durante a validação em `http://localhost:3000`, foram identificadas três regressões pontuais nas telas de Autenticação (`/login/cidadao`, `/cadastro/cidadao` e `/recuperar-senha/cidadao`):
1. **Footer Flutuante (Login):** No formulário de login curto, a tag `<footer>` estava localizada dentro do `<main>`. Devido ao `justify-content: flex-start`, o rodapé subia colado no formulário, deixando espaço vazio abaixo.
2. **Footer Rolante (Cadastro):** Com o crescimento do formulário e das mensagens de validação, a tag `<footer>` dentro do `<main>` e o card esticavam a casca externa `.app-main--auth` (que possuía `overflow-y: auto`), fazendo a tela inteira rolar e empurrando o footer para fora do viewport.
3. **Header Asfixiado (Auth):** O título longo ("ZELUS - Cadastro") com logo de 28px colidia visualmente com o botão lateral `< Voltar`, sem a mesma elegância simétrica do Painel.

### 6.2 Soluções Implementadas na Fase 2
1. **Arquitetura Estrita de 3 Camadas no Card:**
   - Em `LoginCidadao.jsx`, `CadastroCidadao.jsx` e `RecuperarSenhaCidadao.jsx`, a tag `<footer className="...-footer-tagline">` foi extraída do `<main>` e movida para o mesmo nível, tornando-se o terceiro filho direto de `...-card-mobile`.
   - No CSS:
     - `header`: `flex-shrink: 0;` (fixo no topo).
     - `main`: `flex: 1 1 0; min-height: 0; overflow-y: auto;` (único contêiner que expande e rola internamente se necessário).
     - `footer`: `flex-shrink: 0; width: 100%;` (ancorado estritamente na base do card).
2. **Bloqueio Definitivo de Rolagem na Casca de Auth:**
   - Em `global.scss`, `.app-main--auth` recebeu `height: 100%; max-height: 100%; min-height: 0; overflow: hidden !important; display: flex; flex-direction: column;`.
   - Nos wrappers de autenticação (`.login-cidadao-wrapper`, etc.) e cards (`.login-card-mobile`, etc.), o `height: auto` do desktop foi substituído por `height: 100%; max-height: min(720px/780px, calc(100dvh - 32px)); overflow: hidden;`.
3. **Respiro e Redimensionamento no Header de Autenticação:**
   - Logo institucional redimensionada para `22px` x `22px` (contra 32px do Painel).
   - Título reduzido para `1.02rem` (`font-weight: 700; white-space: nowrap;`).
   - Subtítulo reduzido para `0.70rem` (`letter-spacing: 0.4px;`).
   - Botão "Voltar" ajustado para `<ChevronLeft size={16} />` com `font-size: 0.82rem; left: 12px;`.
   - Bloco `.login-header__brand` / `.cadastro-header__brand` recebeu `padding: 0 54px; box-sizing: border-box;`, garantindo matematicamente mais de 30px de respiro livre contra qualquer colisão lateral.
4. **Painel do Cidadão:** 100% preservado e inalterado.

---

## 7. Sugestão de Mensagem de Commit para Execução Futura

```text
fix(frontend): correcao estrutural do scroll, footer fixo na base e respiro no header de auth

- Extracao da tag footer para fora do main em Login, Cadastro e Recuperar Senha, consolidando arquitetura estrita de 3 camadas
- Travamento de overflow hidden no app-main--auth e limites max-height no card mobile desktop, isolando o scroll exclusivamente no miolo
- Header e Footer 100% fixos no topo e base em todas as rotas (incluindo formulários longos com erros de validacao e textos longos)
- Respiro lateral de 54px, reducao da logo para 22px e tipografia proporcional no header de telas com botao Voltar
- Manutencao integral das ilustracoes, cores e layout do Painel do Cidadao
- Registro de prompt 26 atualizado com ciclo de QA local
```

