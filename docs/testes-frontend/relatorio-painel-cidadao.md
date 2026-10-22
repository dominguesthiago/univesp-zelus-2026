# Relatório de Testes Automatizados — Painel do Cidadão

**Arquivo de Teste:** [`frontend/src/tests/PainelCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/PainelCidadao.test.js)  
**Componente Alvo:** [`frontend/src/pages/PainelCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/PainelCidadao.jsx)  
**Data da Execução:** 22 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 9 executados / 9 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar que o Dashboard do Cidadão do ZELUS:
1. Exibe a saudação personalizada (`Olá, [Nome]! 👋`) com o primeiro nome lido do `localStorage` (`zelus_cidadao`), usando "Cidadão" como valor padrão.
2. Apresenta o subtítulo colaborativo e o botão principal de chamada para ação (`+ NOVA SOLICITAÇÃO 📱`).
3. Renderiza o título "Minhas Solicitações Recentes" e a lista estática de cartões de solicitação (`.solicitacao-card`) com tipo, protocolo e data.
4. Exibe as badges de status (`.badge--pendente` e `.badge--concluido`) alinhadas à linha do título e uma ilustração em cada cartão.
5. Mantém o botão "Sair" exclusivamente no `<Header>` (não duplicado no corpo da página).
6. Garante a remoção dos blocos obsoletos ("Pontuação de Cidadania" e "Serviços Disponíveis").
7. Aplica e libera a trava de rolagem do documento, sustentando a arquitetura de scroll isolado (apenas a lista rola).

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Saudação em `<h1>` com o primeiro nome do `localStorage` ("Olá, Maria! 👋") e subtítulo "Acompanhe suas solicitações ou abra uma nova." | WCAG 1.3.1 (Hierarquia de Cabeçalhos) / WCAG 2.4.6 (Headings and Labels) | ✅ Aprovado |
| 2 | Nome padrão "Cidadão" quando não há dados salvos no `localStorage` | WCAG 3.3.2 (Labels or Instructions) / Degradação Graciosa | ✅ Aprovado |
| 3 | Botão principal "+ NOVA SOLICITAÇÃO 📱" com papel `button` e classe `.painel-cidadao__cta` | WCAG 4.1.2 (Name, Role, Value) / WCAG 2.1.1 (Teclado) | ✅ Aprovado |
| 4 | Título `<h2>` "Minhas Solicitações Recentes" e lista estática de cartões (`.solicitacao-card`, mínimo de 2) com tipo, protocolo (`#3842`) e data (`10/11/2026`) | WCAG 1.3.1 (Lista Semântica `<ul>/<li>`) | ✅ Aprovado |
| 5 | Badges `.badge--pendente` e `.badge--concluido` renderizadas dentro da linha superior do cartão (`.solicitacao-card__topo`), ao lado do título | WCAG 1.4.1 (Uso de Cor — status também expresso em texto) | ✅ Aprovado |
| 6 | Presença de uma ilustração (`img.solicitacao-card__imagem`) em cada cartão de solicitação | WCAG 1.1.1 (Conteúdo Não Textual — imagens decorativas com `alt=""` e `aria-hidden`) | ✅ Aprovado |
| 7 | Ausência do link "Sair" no corpo da página (responsabilidade do `<Header>`) | Consistência de Navegação (WCAG 3.2.3 / 3.2.4) | ✅ Aprovado |
| 8 | Remoção definitiva dos blocos "Pontuação de Cidadania" e "Serviços Disponíveis" | Aderência ao novo escopo funcional / Identidade ZELUS | ✅ Aprovado |
| 9 | Aplicação da classe `painel-cidadao-ativo` em `<html>` e `<body>` ao montar e remoção ao desmontar (scroll isolado) | WCAG 1.4.10 (Reflow) / Prevenção de efeitos colaterais em outras rotas | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Scroll Isolado:** a trava de rolagem é aplicada por classe somente enquanto o painel está montado e é removida no *cleanup* do `useEffect`, evitando vazamento de estilos para as demais rotas. A rolagem fica restrita ao contêiner `.painel-cidadao__lista`.
* **Semântica:** o painel usa `<main id="conteudo-principal">` (destino do skip-link), `<h1>` único, `<h2>` para a seção de solicitações, `<ul>/<li>` para a lista e `<h3>` para o tipo de cada solicitação.
* **Imagens Decorativas:** as ilustrações geradas por IA possuem `alt=""` e `aria-hidden="true"`, pois o conteúdo é transmitido integralmente pelo texto do cartão.
* **Cobertura de Regressão:** os testes 7 e 8 protegem contra o retorno de elementos removidos nas refatorações do painel.
