# Registro de Rastreabilidade de Prompt de IA — Criação da Tela de Cadastro do Cidadão

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `11-criacao-cadastrocidadao`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Criação da Tela de Cadastro do Cidadão (`CadastroCidadao.jsx`, `CadastroCidadao.scss`, `CadastroCidadao.test.js`) com Inclusão do Campo E-mail, Semântica HTML5 e Acessibilidade WCAG 2.1 AA  
**Data/Hora do Registro:** 21 de outubro de 2026 - 10:05 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-CADASTRO-CIDADAO-011`
* **Módulo:** Autenticação e Cadastro do Munícipe (Mobile-First / Opção B)
* **Objetivo:** Projetar e implementar a tela de Cadastro do Cidadão (`CadastroCidadao.jsx`) com base no mockup mobile do ZELUS, atendendo ao ajuste crítico de backend com a introdução do campo "E-mail" (totalizando 5 campos: Nome Completo, CPF, E-mail, Telefone e Senha), marcação semântica HTML5 (`<main id="conteudo-principal">`, `<form novalidate>`, `<label htmlFor="...">`, `<button type="submit">`), conformidade WCAG 2.1 AA, Regra de Ouro do ZELUS (`min-height: 100dvh`, `flex-grow: 1`), gerenciamento de estado em React e cobertura por testes automatizados.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior Especialista em Acessibilidade (WCAG)

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior e Especialista em Acessibilidade (WCAG), a tua tarefa é criar a tela de "Cadastro do Cidadão" com base no mockup fornecido, MAS com uma alteração crítica de negócio identificada no Backend.

Esta tela deve seguir rigorosamente os padrões de arquitetura, semântica e estilos globais que já estabelecemos no projeto ZELUS (especialmente na tela LoginCidadao.jsx).

Diretrizes de Implementação:

1. Criação de Ficheiros:
   - Cria o componente CadastroCidadao.jsx na pasta frontend/src/pages/.
   - Cria o arquivo de estilos CadastroCidadao.scss na mesma pasta.
   - Adiciona a rota /cadastro/cidadao no App.js apontando para este novo componente.

2. Ajuste Crítico de Backend (Adição do Campo E-mail):
   - O mockup tem 4 campos, mas o nosso Backend exige 5.
   - Deves adicionar o campo "E-mail" (abaixo do CPF e acima do Telefone), replicando exatamente o mesmo estilo visual (bordas arredondadas, tipografia) dos outros campos mostrados na imagem.
   - Usa um ícone SVG simples de "envelope" para acompanhar o campo de e-mail.

3. Estrutura HTML Semântica e Acessibilidade (Obrigatório):
   - O conteúdo principal deve estar envolto numa tag <main id="conteudo-principal">.
   - Utiliza a tag <form novalidate> para englobar os 5 campos de entrada.
   - Cada campo (Nome, CPF, E-mail, Telefone, Senha) deve ter a sua respetiva tag <label> ligada ao <input> através do atributo htmlFor e id.
   - Usa atributos corretos: inputMode="numeric" para CPF, type="email" para E-mail, e type="tel" para Telefone.
   - O botão "Cadastrar" deve ser um <button type="submit">.
   - Inclui os links semânticos de navegação: "Voltar" (no topo) e "Já tem uma conta? Entrar aqui" (no rodapé, apontando para /login/cidadao).

4. Fidelidade Visual e Responsividade (SCSS Modular):
   - Replica exatamente a paleta de cores (azul escuro e fundo branco), tipografia e ícones.
   - Regra de Ouro do ZELUS: O contentor principal DEVE utilizar min-height: 100dvh para garantir a adaptação móvel perfeita. O layout deve expandir-se usando flexbox (flex-grow: 1) para empurrar o rodapé de acessibilidade para o fundo da tela.

5. Gerenciamento de Estado (React):
   - Cria um único estado formData (ou múltiplos useState) para armazenar os 5 campos.
   - O formulário, ao ser submetido (onSubmit), deve prevenir o comportamento padrão e fazer um console.log do JSON com os dados (preparando para a futura integração com a API).

6. Testes e Governança:
   - Cria o arquivo CadastroCidadao.test.js para garantir que o formulário renderiza todos os 5 campos acessíveis.
   - Regista este prompt no arquivo docs/prompts-ia/frontend/11-criacao-cadastrocidadao.md.

7. Commit:
   - Roda os testes. Se tudo estiver verde, faz o commit: feat(frontend): criacao da tela de Cadastro do Cidadao com campo de email e semantica.
   - Faz o git push origin main e avisa o utilizador.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Criados e Modificados

1. **[`CadastroCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/CadastroCidadao.jsx):**
   - Criação do componente com layout mobile-first e container simulador de smartphone para desktop.
   - Cabeçalho próprio dedicado (`#1a3458`) com link semântico `< Voltar` para `/login/cidadao`, ícone 3D ZELUS, título "ZELUS - Cadastro" e subtítulo "Zeladoria Urbana".
   - Landmark `<main id="conteudo-principal" className="cadastro-main-container">`, servindo de alvo do skip-link global.
   - Título `<h1>` com emoji de bloco de notas: `Crie sua conta 📝`.
   - Elemento semântico `<form className="cadastro-form" onSubmit={handleSubmit} noValidate aria-labelledby="cadastro-heading">`.
   - 5 campos associados a `<label>` via `htmlFor` e `id`:
     1. **Nome Completo:** input `id="cadastro-nome"`, ícone de avatar cartum.
     2. **CPF (apenas números):** input `id="cadastro-cpf"`, `inputMode="numeric"`, máscara `000.000.000-00`, ícone crachá.
     3. **E-mail (Backend Requisite):** input `id="cadastro-email"`, `type="email"`, `inputMode="email"`, ícone de envelope SVG estilizado.
     4. **Telefone:** input `id="cadastro-telefone"`, `type="tel"`, `inputMode="tel"`, máscara `(00) 90000-0000`, ícone de celular SVG estilizado.
     5. **Senha:** input `id="cadastro-senha"`, `type="password"`, alternância de visibilidade com botão acessível (`aria-label`, `aria-controls`, `aria-pressed`), ícone de cadeado.
   - Botão de submissão: `<button type="submit" className="cadastro-submit-button">` no formato pílula com ícone de smartphone.
   - Link de login: `Já tem uma conta? <Link to="/login/cidadao">Entrar aqui</Link>`.
   - Rodapé de acessibilidade: `ZELUS • Acessível e inclusivo para todos`.

2. **[`CadastroCidadao.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/CadastroCidadao.scss):**
   - Aplicação da Regra de Ouro do ZELUS com `min-height: 100vh; min-height: 100dvh;`.
   - Flexbox com `flex-grow: 1` no contêiner e formulário para acomodar os 5 campos e manter o rodapé empurrado para a base.
   - Bordas grossas cartum (`2px solid #1a1a24; border-radius: 12px;`) nos campos e pílula (`2.5px solid #1a1a24; border-radius: 9999px;`) no botão.
   - Enquadramento desktop simulador de smartphone (`max-width: 385px; min-height: 720px; border: 5px solid #1a1a24; border-radius: 40px;`).

3. **[`App.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js):**
   - Importação de `CadastroCidadao`.
   - Extensão de `isAuthRoute` para abranger `/cadastro` (`location.pathname.startsWith('/login') || location.pathname.startsWith('/cadastro')`), garantindo isolamento harmônico dos cabeçalhos globais e estilização `.app-layout--auth`.
   - Registro da rota `<Route path="/cadastro/cidadao" element={<CadastroCidadao />} />`.

4. **[`CadastroCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CadastroCidadao.test.js):**
   - Suíte com 8 testes automatizados cobrindo landmark `<main>`, associação de labels e inputs, atributos de tipo e acessibilidade, máscaras de CPF e telefone, alternância de senha, validação de campos obrigatórios, disparo de `console.log` com payload JSON estruturado e links de navegação.

---

## 4. Verificação Técnica

- **Suíte de Testes Automatizados:** 100% de aprovação em todos os testes unitários (`npm test` — 4 suites, 26 testes aprovados).
- **Build de Produção:** Concluído com sucesso via `npm run build`.
- **Governança de Código:** Commit registrado conforme convenção `feat(frontend): criacao da tela de Cadastro do Cidadao com campo de email e semantica`.
- **Deploy:** Sincronizado via `git push origin main`.
