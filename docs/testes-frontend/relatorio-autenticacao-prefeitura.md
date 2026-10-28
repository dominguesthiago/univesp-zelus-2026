# Relatório de Testes Automatizados — Autenticação do Back-office da Prefeitura

**Arquivos de Teste:**
* [`frontend/src/tests/AdminDeviceGuard.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/AdminDeviceGuard.test.js)
* [`frontend/src/tests/LoginPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/LoginPrefeitura.test.js)
* [`frontend/src/tests/CadastroPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CadastroPrefeitura.test.js)
* [`frontend/src/tests/RecuperarSenhaPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/RecuperarSenhaPrefeitura.test.js)

**Componentes e Páginas Alvo:**
* [`AdminDeviceGuard.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/AdminDeviceGuard.jsx)
* [`LoginPrefeitura.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/LoginPrefeitura.jsx)
* [`CadastroPrefeitura.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/CadastroPrefeitura.jsx)
* [`RecuperarSenhaPrefeitura.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/RecuperarSenhaPrefeitura.jsx)

**Data da Execução:** 27 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 20 executados / 20 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo deste conjunto de suítes de testes é assegurar a robustez, acessibilidade e integridade visual do fluxo de autenticação do servidor municipal no Back-office:
1. **Guarda de Dispositivo (`AdminDeviceGuard`):** Assegurar que telas menores que 1024px são bloqueadas com mensagem explicativa e navegação alternativa, liberando o acesso em telas Desktop.
2. **Layout Neobrutalista Padronizado de Duas Colunas:** Garantir a consistência da divisão entre o banner institucional amarelo à esquerda e o formulário à direita em Login, Cadastro e Recuperação de Senha.
3. **Ausência de Elementos Redundantes:** Validar que nenhum botão ou link redundante de "Voltar" é exibido dentro da área amarela do cartão institucional.
4. **Segurança de Borda e Chave Administrativa:** Validar a exigência da chave de acesso para criação de contas e redefinição de senhas, além da alternância de visibilidade do campo (`password` e `text`).
5. **Acessibilidade Digital (WCAG 2.1 AA):** Verificar contraste, foco visível, rótulos associados a campos (`htmlFor` e `id`), alertas acessíveis com `role="alert"` e feedback de envio assíncrono.

---

## 2. Relação Detalhada dos Casos de Teste

| Suíte / Arquivo | Cenário de Teste Validado | Requisito de Acessibilidade / Negócio | Status |
|---|---|---|:---:|
| `AdminDeviceGuard` | Bloqueio de dispositivos móveis (< 1024px) com alerta informativo | WCAG 1.3.1 (Avisos Semânticos) / Regra de Negócio | ✅ Aprovado |
| `AdminDeviceGuard` | Liberação e renderização de children em resoluções Desktop (>= 1024px) | Resiliência de Layout e Responsividade | ✅ Aprovado |
| `AdminDeviceGuard` | Navegação de retorno para a Home e Portal do Munícipe | WCAG 2.1.1 (Navegação por Teclado) | ✅ Aprovado |
| `LoginPrefeitura` | Estrutura de grid neobrutalista de duas colunas (banner e formulário) | Consistência Visual do Design System | ✅ Aprovado |
| `LoginPrefeitura` | Ausência de botões redundantes de navegação na coluna amarela | Limpeza e Simetria de Layout | ✅ Aprovado |
| `LoginPrefeitura` | Submissão com CPF e senha institucional e tratamento de loading | Feedback Transacional e Anti-Double Submit | ✅ Aprovado |
| `LoginPrefeitura` | Exibição de alertas de erro acessíveis (`role="alert"`) em credenciais inválidas | WCAG 4.1.3 (Mensagens de Status e Erro) | ✅ Aprovado |
| `CadastroPrefeitura` | Estrutura de grid de duas colunas e formulário completo de servidor | Consistência Visual do Design System | ✅ Aprovado |
| `CadastroPrefeitura` | Alternância de visibilidade da Chave Administrativa com ícones `Eye`/`EyeOff` | WCAG 4.1.2 (Controles Acessíveis) | ✅ Aprovado |
| `CadastroPrefeitura` | Alternância de visibilidade do campo de senha institucional | WCAG 4.1.2 (Controles Acessíveis) | ✅ Aprovado |
| `CadastroPrefeitura` | Ausência de botões redundantes de voltar na coluna amarela | Limpeza e Simetria de Layout | ✅ Aprovado |
| `CadastroPrefeitura` | Envio de formulário com sucesso via serviço `registrarFuncionario` | Integridade de Dados e Contrato de API | ✅ Aprovado |
| `CadastroPrefeitura` | Exibição de mensagens de validação e alertas de erro da API | WCAG 4.1.3 (Mensagens de Status e Erro) | ✅ Aprovado |
| `RecuperarSenhaPrefeitura` | Estrutura de duas colunas com banner institucional e formulário | Consistência Visual do Design System | ✅ Aprovado |
| `RecuperarSenhaPrefeitura` | Ausência de botões redundantes de voltar na coluna amarela | Limpeza e Simetria de Layout | ✅ Aprovado |
| `RecuperarSenhaPrefeitura` | Alternância de visibilidade da Chave Administrativa e Nova Senha | WCAG 4.1.2 (Controles Acessíveis) | ✅ Aprovado |
| `RecuperarSenhaPrefeitura` | Submissão e redefinição de credenciais via `redefinirSenhaFuncionario` | Integridade Transacional | ✅ Aprovado |
| `RecuperarSenhaPrefeitura` | Tratamento de alertas acessíveis de erro e confirmação de sucesso | WCAG 4.1.3 (Mensagens de Status e Erro) | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Controles Nativos e Acessíveis:** Todos os botões de alternância de visibilidade utilizam `<button type="button">` com rótulos `aria-label` descritivos ("Ocultar senha", "Mostrar senha", "Ocultar chave", "Mostrar chave").
* **Estrutura sem Rolagem (100vh):** O design simétrico de duas colunas associado à trava de viewport impede qualquer estouro vertical indesejado nos navegadores de back-office.
* **Resiliência Flexbox com `minWidth: 0`:** Os campos de entrada garantem flexibilidade dentro dos containers de grid sem empurrar botões de ação ou quebrar alinhamentos.
