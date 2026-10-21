# Registro de Rastreabilidade de Prompt de IA — Criação da Tela de Recuperação de Senha com Design System Integrado

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `22-criacao-recuperar-senha`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Criação da Tela de Recuperação de Senha do Cidadão, Integração com a API de Redefinição e Fechamento do Ciclo de Autenticação  
**Data/Hora do Registro:** 21 de outubro de 2026 - 12:15 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-RECUPERAR-SENHA-022`
* **Módulo:** Autenticação, Design System, Recuperação de Acesso e Experiência do Usuário (UX)
* **Objetivo:**
  1. Criar o componente `RecuperarSenhaCidadao.jsx` e o arquivo de estilos `RecuperarSenhaCidadao.scss` na pasta `frontend/src/pages/`, reproduzindo fielmente o Design System estabelecido em `LoginCidadao.jsx` e `CadastroCidadao.jsx`.
  2. Adicionar o aviso de contexto com `role="note"` contextualizando o ambiente acadêmico da UNIVESP ("Ambiente Acadêmico: Como não há envio real de e-mails, confirme seus dados abaixo para redefinir sua senha de forma segura.").
  3. Adicionar o formulário semântico com 3 campos: CPF (máscara e ícone), E-mail (validação de formato e ícone) e Nova Senha (mínimo 8 caracteres com letras e números, ícone e controle de alternância de visibilidade).
  4. Adicionar e exportar no serviço `frontend/src/services/api.js` a função `redefinirSenhaCidadao(dados)` apontando para `PUT /api/auth/cidadao/nova-senha`.
  5. Implementar no backend a rota e controlador correspondentes (`authCidadaoRoutes.js` e `authCidadaoController.js`) para garantir interoperabilidade real em produção.
  6. Configurar a rota `/recuperar-senha/cidadao` em `App.js` com layout `.app-layout--auth` e atualizar o link em `LoginCidadao.jsx`.
  7. Criar a suíte de testes unitários e de integração `RecuperarSenhaCidadao.test.js`, atualizando os relatórios consolidados em `docs/testes-frontend/`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior e Especialista UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior e Especialista UI/UX, precisamos criar a tela de "Recuperar Senha" para fechar o ciclo de autenticação do ZELUS.

Como não temos um mockup específico para esta tela, a tua diretriz principal é a Reutilização do Design System. Esta tela deve ser visualmente idêntica à estrutura do LoginCidadao.jsx e CadastroCidadao.jsx.

Diretrizes de Implementação:

1. Criação de Arquivos e Rotas:
   - Cria o componente RecuperarSenhaCidadao.jsx e o arquivo RecuperarSenhaCidadao.scss na pasta pages/.
   - Adiciona a rota /recuperar-senha/cidadao no App.js.
   - O link "Esqueci minha senha" no LoginCidadao.jsx deve apontar para esta nova rota.

2. Estrutura Visual e Semântica (Design System ZELUS):
   - Usa a mesma estrutura base: <main id="conteudo-principal"> e o layout .app-layout--auth.
   - Aviso Acadêmico: Logo abaixo do título ("Recuperar Senha"), adiciona uma caixa de aviso amigável (com fundo suave, ex: azul claro ou amarelo pálido) e role="note". O texto deve ser: "Ambiente Acadêmico: Como não há envio real de e-mails, confirme seus dados abaixo para redefinir sua senha de forma segura."
   - Formulário (<form>):
     * Input 1: CPF (com ícone, máscara, inputMode="numeric").
     * Input 2: E-mail (com ícone, type="email").
     * Input 3: Nova Senha (com ícone, botão de mostrar/esconder senha, validação de segurança).
   - O botão principal deve dizer "Redefinir Senha".
   - O link de rodapé deve ser "Lembrou a senha? Voltar ao Login".

3. Validações e Serviço de API (services/api.js):
   - Adiciona e exporta a função redefinirSenhaCidadao(dados) apontando para PUT /api/auth/cidadao/nova-senha.
   - No frontend, aplica as mesmas validações rigorosas de regex (CPF 14 chars, E-mail válido, Senha com letras/números e mín. 8 chars).
   - Gere os estados carregando, erroApi e sucesso.
   - Em caso de sucesso, exibe uma mensagem verde e redireciona para /login/cidadao passando a mensagem via location.state.

4. Testes e Governança:
   - Cria RecuperarSenhaCidadao.test.js garantindo 100% de cobertura desta tela.
   - Atualiza os relatórios de testes.
   - Regista este prompt em docs/prompts-ia/frontend/22-criacao-recuperar-senha.md.

5. Commit:
   - Roda a suíte completa de testes e o build.
   - Faz o commit: feat(frontend): criacao da tela de recuperacao de senha com design system integrado
   - Faz o git push origin main e avisa o utilizador.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Reutilização do Design System ZELUS (`RecuperarSenhaCidadao.jsx` e `.scss`)
* **Consistência Visual:** Aplicação estrita da paleta de cores institucional (azul marinho `#1a3458`, amarelo acento `#fbd362`, fundo gelo `#f4f6f9`), bordas estilo cartum pop (`3.5px solid #1a1a24` com sombra sólida `6px 6px 0 #1a1a24`) e cantos arredondados (`border-radius: 28px`).
* **Conformidade Mobile (Regra de Ouro `100dvh`):** O container utiliza `min-height: 100dvh`, prevenindo scroll e saltos de layout em navegadores móveis com barras de navegação dinâmicas.
* **Aviso Acadêmico Transparente (`role="note"`):** Card explicativo com fundo azul suave (`#f0f7ff`), borda de destaque institucional e ícone acessível `Info` da biblioteca Lucide.
* **Ícones Vetoriais Integrados:** Reutilização dos ícones SVG estilizados de Identidade (`IdCardIcon`), Correio Eletrônico (`MailIcon`) e Cadeado (`LockIcon`), combinados com o controle de visibilidade da senha (`Eye` / `EyeOff`).

### 3.2 Validações Estritas de Frontend e Service Layer
* **Validação Pré-Submit:**
  - *CPF:* Verificação de preenchimento completo de 14 caracteres com máscara (`/^\d{3}\.\d{3}\.\d{3}-\d{2}$/`).
  - *E-mail:* Validação formal através da regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - *Nova Senha:* Mínimo de 8 caracteres contendo ao menos uma letra e um número.
* **Sanitização de Dados:** Remoção de pontuação de CPF (`replace(/\D/g, '')`) e normalização do e-mail antes do envio à API.
* **Service Layer (`api.js`):** Exportação da função `redefinirSenhaCidadao(dados)` com requisição `PUT /api/auth/cidadao/nova-senha`.
* **Disponibilidade no Backend:** Criação da rota `PUT /nova-senha` no Express (`authCidadaoRoutes.js`) e método correspondente `redefinirSenhaCidadao` no Supabase (`authCidadaoController.js`), validando a existência simultânea de CPF e E-mail antes de atualizar o hash bcrypt.

### 3.3 Qualidade de Software e Governança de Testes
* **Criação de [`RecuperarSenhaCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/RecuperarSenhaCidadao.test.js):**
  - 13 casos de teste cobrindo landmark `<main>`, aviso `role="note"`, rotulagem acessível de formulário, máscaras, alternância de senha, validações de erro locais, payload de API sanitizado, estados de loading e captura de erro.
* **Atualização em [`LoginCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/LoginCidadao.test.js):**
  - Atualização do link de destino para `/recuperar-senha/cidadao`.
* **Painel Consolidado de Testes:**
  - 6 suítes executadas e 54 testes aprovados (100% de sucesso).
  - Documentação atualizada em [`relatorio-recuperar-senha.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-recuperar-senha.md) e [`LEIA-ME-TESTES.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/LEIA-ME-TESTES.md).

---

## 4. Evidências de Execução dos Testes e Compilação

```
PASS  src/tests/Home.test.js (5 testes)
PASS  src/tests/LoginCidadao.test.js (14 testes)
PASS  src/tests/CadastroCidadao.test.js (14 testes)
PASS  src/tests/RecuperarSenhaCidadao.test.js (13 testes)
PASS  src/tests/ActionCard.test.js (4 testes)
PASS  src/tests/CookieBanner.test.js (4 testes)

Test Suites: 6 passed, 6 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Ran all test suites.

Creating an optimized production build...
Compiled successfully.
```
