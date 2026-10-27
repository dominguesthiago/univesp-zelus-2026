# Backlog de Melhorias e Evolução da Plataforma ZELUS
# Documento de Especificação de Requisitos e Sprints Futuras
# ==============================================================

# BACKLOG DE MELHORIAS — ROADMAP ECOLUTIVO ZELUS

## 1. Visão Geral e Governança do Backlog

Este documento formaliza as demandas funcionais, arquiteturais e regulatórias mapeadas para as próximas iterações e ciclos de desenvolvimento da plataforma **ZELUS**. O objetivo é garantir a continuidade sustentável da solução de zeladoria urbana, estabelecendo especificações técnicas e critérios de aceite detalhados para cada funcionalidade planejada.

### 1.1 Matriz de Priorização (Esforço vs. Impacto)

| Identificador | Funcionalidade / Épico | Camada Principal | Impacto | Esforço | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-EVO-01** | Menu de Contexto e Cancelamento de Chamados | Frontend & Backend | Alto | Médio | **Sprint I** |
| **REQ-EVO-02** | Direito ao Esquecimento e Exclusão de Conta (LGPD) | Frontend & Backend | Crítico | Alto | **Sprint I** |
| **REQ-EVO-03** | Textos Legais Definitivos e Termos de Consentimento | Frontend | Alto | Baixo | **Sprint I** |
| **REQ-EVO-04** | Disparo Transacional de E-mail com Protocolo | Backend | Médio | Médio | **Sprint II** |
| **REQ-EVO-05** | Sistema de Apoiadores (*Upvote* Anti-Duplicidade) | Frontend & Backend | Alto | Alto | **Sprint II** |

---

## 2. Especificação Detalhada dos Requisitos

---

### ÉPICO 1: Autonomia e Ciclo de Vida da Ocorrência

#### REQ-EVO-01 — Menu de Contexto do Cidadão (Cancelamento de Solicitação Pendente)

* **Status:** Mapeado para Próxima Sprint  
* **Camadas Envolvidas:** Interface do Munícipe (`PainelCidadao.jsx`) e Controlador de Solicitações (`solicitacaoController.js`)

##### 1. Descrição do Problema
Atualmente, quando um cidadão abre uma solicitação com equívoco de endereço, categoria incorreta ou quando o problema urbano já foi resolvido por terceiros logo após o registro, não há mecanismo para que o próprio munícipe desista ou cancele o chamado. Isso gera sobrecarga desnecessária na triagem da equipe operacional do município.

##### 2. Solução Proposta e Comportamento Esperado
1. **Ponto de Interação no Card:**  
   Em cada cartão de solicitação com status `"Pendente"` exibido no painel do cidadão, adicionar um botão de menu de contexto representado visualmente por "três pontos verticais" (ícone `MoreVertical` da biblioteca `lucide-react`).
2. **Modal de Detalhes e Ações:**  
   Ao clicar no botão de contexto, deve ser exibido um modal acessível contendo o resumo da ocorrência e a opção explícita: `"Cancelar Solicitação"`.
3. **Lógica de Descarte (*Soft-Delete*):**  
   O cancelamento não deve excluir fisicamente o registro do banco de dados (preservando o histórico e a auditoria). O sistema deve realizar uma atualização de status:
   * `status = 'Descartada'`
   * `justificativa_status = 'Cancelado pelo próprio cidadão'`
4. **Registro de Auditoria:**  
   Inserção compulsória na tabela `public.audit_logs`, registrando o ID do cidadão, data/hora e a ação executada.
5. **Atualização Reativa de UI:**  
   O card no painel do cidadão é atualizado instantaneamente para o badge visual de descarte (`.badge--descartada`), e o menu de contexto é desabilitado/ocultado para impedir novas alterações.

##### 3. Arquitetura Técnica e Contratos de API
* **Endpoint:** `PATCH /api/solicitacoes/:id/cancelar` (ou `PUT /api/solicitacoes/:id/status`)
* **Autenticação:** Obrigatória via cabeçalho `Authorization: Bearer <JWT>`
* **Validações de Segurança:**
  * O `cidadao_id` da solicitação deve ser rigorosamente idêntico ao `req.usuario.id` extraído criptograficamente do token JWT.
  * A solicitação deve estar estritamente no status `"Pendente"`. Caso o chamado já esteja `"Em Andamento"` ou `"Concluído"`, a API deve retornar `HTTP 422 Unprocessable Entity` informando que ordens de serviço já iniciadas não podem ser canceladas pelo aplicativo.
* **Payload de Resposta (Sucesso):**
  ```json
  {
    "sucesso": true,
    "mensagem": "Solicitação cancelada pelo cidadão com sucesso.",
    "dados": {
      "id": "uuid-da-solicitacao",
      "status": "Descartada",
      "justificativa_status": "Cancelado pelo próprio cidadão",
      "updated_at": "2026-10-27T10:00:00Z"
    }
  }
  ```

##### 4. Critérios de Aceite (BDD)
* **Cenário 1:** Cidadão cancela solicitação pendente própria com sucesso.
  * *Dado* que o cidadão está autenticado e possui uma solicitação com status "Pendente";
  * *Quando* clica no menu de 3 pontos do card e confirma a ação "Cancelar Solicitação";
  * *Então* o status deve mudar para "Descartada", a justificativa deve ser gravada como "Cancelado pelo próprio cidadão" e a interface deve refletir a alteração sem necessidade de recarregar a página.
* **Cenário 2:** Tentativa de cancelamento de chamado em andamento.
  * *Dado* que uma solicitação já foi acolhida pela prefeitura ("Em Andamento");
  * *Quando* o usuário tenta acionar o cancelamento;
  * *Então* o botão não deve estar visível e qualquer chamada forçada de API deve retornar erro 422.

---

### ÉPICO 2: Privacidade, Governança e Conformidade Regulatória (LGPD)

#### REQ-EVO-02 — Direito ao Esquecimento e Exclusão Definitiva de Conta

* **Status:** Mapeado para Próxima Sprint  
* **Camadas Envolvidas:** Cabeçalho Institucional (`Header.jsx`), Rota de Autenticação (`authCidadaoController.js`), Banco de Dados Supabase (PostgreSQL)  
* **Fundamentação Jurídica:** Artigo 18, Inciso VI da Lei Geral de Proteção de Dados (Lei Federal nº 13.709/2018 — Revogação do consentimento e eliminação de dados pessoais).

##### 1. Descrição do Problema
Para total conformidade com os princípios de autodeterminação informativa da LGPD, o cidadão deve dispor de mecanismo simplificado, direto e autônomo para solicitar a eliminação definitiva de sua conta cadastral, sem depender de atendimento presencial ou intermediação burocrática.

##### 2. Solução Proposta e Comportamento Esperado
1. **Acesso à Funcionalidade:**  
   Adicionar um ícone de Perfil de Usuário no cabeçalho institucional (`Header.jsx`). Ao clicar, o cidadão acessa a gaveta/modal de configurações da conta, onde localiza a opção em destaque vermelho neobrutalista: `"Excluir Minha Conta / Direito ao Esquecimento"`.
2. **Confirmação Crítica em Dois Fatores (Double Check):**  
   Exibição de um modal de segurança com aviso transparente de irreversibilidade. Para confirmar, o cidadão deve digitar explicitamente sua senha de acesso atual e a palavra `"EXCLUIR"`.
3. **Regra de Negócio Transacional no Banco de Dados (PostgreSQL):**  
   A exclusão deve ser processada em uma transação atômica (`BEGIN ... COMMIT`):
   * **Chamados Pendentes (`status = 'Pendente'`):** Devem ser removidos fisicamente do banco de dados, visto que ainda não geraram despesas nem ordens de serviço executadas.
   * **Chamados Históricos (`status = 'Concluído'` ou `'Em Andamento'`):** Não podem ser excluídos fisicamente, em estrito cumprimento às normas de prestação de contas, transparência pública e guarda probatória municipal. No entanto, devem ser **rigorosamente anonimizados**:
     * O campo `cidadao_id` é desvinculado (definido como `NULL` ou associado a um identificador genérico anônimo do sistema).
     * O histórico mantém as coordenadas geodésicas, endereço, categoria e fotos da via pública, eliminando qualquer elo com a pessoa física titular dos dados.
   * **Tabela `cidadaos`:** Exclusão definitiva do registro cadastral (nome completo, CPF, e-mail, telefone WhatsApp e hash de senha).
4. **Encerramento de Sessão no Frontend:**  
   Após o retorno positivo da API, o cliente executa a limpeza compulsória de todas as credenciais do `localStorage` (`zelus_token`, `zelus_cidadao`, `zelus_rascunho_solicitacao`), emitindo feedback acessível e redirecionando o usuário para a página inicial pública (`/`).

##### 3. Arquitetura Técnica
* **Endpoint:** `DELETE /api/auth/cidadao/conta`
* **Autenticação:** `Authorization: Bearer <JWT>`
* **Payload de Envio:**
  ```json
  {
    "senha_atual": "SenhaDoCidadao@123",
    "confirmacao": "EXCLUIR"
  }
  ```
* **Códigos de Resposta:**
  * `200 OK`: Conta excluída e chamados anonimizados com sucesso.
  * `401 Unauthorized`: Senha incorreta ou token expirado.
  * `400 Bad Request`: Palavra de confirmação inválida.

##### 4. Critérios de Aceite (BDD)
* **Cenário 1:** Exclusão bem-sucedida com histórico anonimizado.
  * *Dado* que um cidadão autenticado solicita a exclusão com a senha correta;
  * *Quando* a transação é confirmada;
  * *Então* o cadastro do cidadão deixa de existir na tabela `cidadaos`, suas solicitações pendentes são expurgadas, suas ocorrências concluídas perdem a identificação de autoria e o munícipe é desconectado imediatamente.

---

#### REQ-EVO-03 — Textos Legais Definitivos e Termos de Consentimento

* **Status:** Mapeado para Próxima Sprint  
* **Camadas Envolvidas:** Banner de Consentimento (`CookieBanner.jsx`), Página de Privacidade (`Privacidade.jsx`) e Modais de Aceite  
* **Fundamentação:** Diretrizes de Transparência da Autoridade Nacional de Proteção de Dados (ANPD).

##### 1. Descrição do Problema
A página `/privacidade` e o banner inicial de cookies possuem avisos transitórios e marcadores provisórios (`"Texto Provisório / Resumo Inicial"`). Embora a arquitetura de armazenamento já esteja documentada nos dossiês, a camada de apresentação precisa exibir o texto final aprovado, eliminando qualquer percepção de incompletude.

##### 2. Solução Proposta e Conteúdo Final
1. **Substituição dos Textos no Frontend:**  
   Atualizar [Privacidade.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Privacidade.jsx) incorporando o conteúdo integral dos documentos normativos oficiais já redigidos no repositório:
   * [politica-privacidade.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/politica-privacidade/politica-privacidade.md)
   * [politica-cookies.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/politica-cookies/politica-cookies.md)
2. **Clareza sobre Tecnologias de Armazenamento Utilizadas:**
   * **Inexistência de Cookies de Terceiros:** Esclarecer ostensivamente que o ZELUS não utiliza cookies de rastreamento, publicidade ou analytics comercial.
   * **Armazenamento Técnico Estrito (`localStorage`):** Declarar as três únicas chaves mantidas no dispositivo:
     * `zelus_termo_aceito`: Registro booleano de consentimento para supressão do banner.
     * `zelus_token`: Token de sessão JWT estritamente funcional para autenticação da API.
     * `zelus_rascunho_solicitacao`: Dados temporários de preenchimento da solicitação em andamento, descartados após o envio.
   * **Armazenamento de Imagens:** Explicar que fotografias de vias públicas são salvas no Supabase Storage unicamente com o propósito de instruir a equipe de manutenção municipal na identificação do reparo físico.
3. **Modal de Leitura Rápida:**  
   Disponibilizar no [CookieBanner.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/CookieBanner.jsx) um modal de leitura instantânea dos termos ("Visualizar Termo Completo"), permitindo a consulta sem forçar o redirecionamento para outra página durante o fluxo inicial.

---

### ÉPICO 3: Comunicação e Inteligência Coletiva (Roadmap Complementar)

#### REQ-EVO-04 — Disparo Transacional de E-mails com Protocolo Oficial

* **Status:** Mapeado para Sprint II  
* **Camada:** Backend (`solicitacaoController.js` e serviço SMTP)
* **Objetivo:** Enviar cópia do comprovante de abertura com número de protocolo (`ZELUS-YYYYMMDD-XXXX`), data, categoria e resumo do endereço diretamente para a caixa postal cadastrada do cidadão (`cidadao.email`).
* **Arquitetura:** Integração com provedor transacional via SMTP (SendGrid, Resend ou Nodemailer assíncrono não-bloqueante no Event Loop).

---

#### REQ-EVO-05 — Sistema de Apoio a Chamados Existentes (*Social Heatmap*)

* **Status:** Mapeado para Sprint II  
* **Camada:** Frontend e Backend (Módulo Geoespacial)
* **Objetivo:** Transformar o bloqueio de duplicidade de 10 metros (Haversine) em canal colaborativo.
* **Comportamento:** Quando a API retornar HTTP 409 (*Conflict*), a resposta incluirá o ID da ocorrência preexistente. O munícipe receberá a opção: *"Já existe um chamado aberto neste local. Deseja apoiar esta solicitação para aumentar sua prioridade?"*.
* **Tabela Necessária:** `public.solicitacoes_apoios` (`id`, `solicitacao_id`, `cidadao_id`, `created_at`), impedindo votos múltiplos e gerando priorização automática por demanda popular na triagem administrativa.

---

## 3. Diretrizes de Implementação e Não-Regressão

1. **Aderência ao Design System:** Todos os modais, botões e alertas das novas funcionalidades devem herdar rigorosamente a estética neobrutalista (bordas pretas sólidas de 2px a 3px, sombras duras `box-shadow: 4px 4px 0px #000000`, cores semânticas vibrantes e tipografia de alto contraste).
2. **Acessibilidade Digital (WCAG 2.1 AA):**
   * Diálogos modais com gerenciamento de foco (`focus trap`), tecla `Esc` para fechamento e atributo `aria-modal="true"`.
   * Alertas informativos e de erro com atributos `role="alert"` e `aria-live="assertive"`.
3. **Cobertura Automatizada de Testes:**
   * Toda nova rota de backend deve ser acompanhada de testes de integração via Jest/Supertest validando respostas 200, 400, 401, 404 e 409/422.
   * Todos os novos fluxos de interface devem ser validados via React Testing Library preservando 100% de sucesso nas suítes globais.

---

*Documento técnico de planejamento evolutivo mantido pela equipe de desenvolvimento ZELUS — 2026*
