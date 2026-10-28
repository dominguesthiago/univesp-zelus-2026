# Registro de Rastreabilidade de IA — Backend: Autenticação e Chave Administrativa da Prefeitura

**Documento:** Registro de Governança de Backend  
**ID do Registro:** `28-autenticacao-funcionario-prefeitura`  
**Fase do Projeto:** Épico do Painel da Prefeitura (Back-office)  
**Etapa:** Endpoints de Login, Registro e Redefinição de Senha de Funcionários com Validação de Chave Administrativa  
**Data/Hora:** 27 de outubro de 2026 - 19:20 (UTC-03:00)  
**Status:** Implementado e Integrado.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-BE-PREFEITURA-AUTH-028`
* **Módulos Criados/Atualizados:**
  * Controlador: `backend/src/controllers/authFuncionarioController.js`
  * Rotas: `backend/src/routes/authFuncionarioRoutes.js`
  * Variáveis de Ambiente: `backend/.env` e `backend/.env.example` (`ADMIN_ACCESS_KEY`)

---

## 2. Decisões Técnicas e Endpoints

### 2.1 Validação de Chave de Acesso Administrativa
* Constante configurável no ambiente `ADMIN_ACCESS_KEY` com fallback seguro de desenvolvimento (`ZELUS-ADM-2026`).
* Qualquer requisição de registro ou redefinição de senha sem a chave correspondente é imediatamente rejeitada com status HTTP `403 Forbidden` (`sucesso: false, mensagem: "Chave de Acesso Administrativa inválida. Acesso restrito a servidores autorizados."`).

### 2.2 Endpoints Implementados
1. **POST /api/auth/funcionario/login:**
   * Sanitização estrita do CPF (remoção de pontos e traços para casar com `matricula_cpf`).
   * Validação de hash bcrypt.
   * Geração de JWT assinado com perfil `{ id: funcionario.id, tipo: 'funcionario' }` e validade de 12 horas.
2. **POST /api/auth/funcionario/registro:**
   * Verificação obrigatória dos campos: `nome_completo`, `cpf`, `senha` e `chave_acesso`.
   * Verificação de duplicidade de `matricula_cpf`.
   * Geração de e-mail institucional associado para respeitar a constraint de banco de dados (`email VARCHAR NOT NULL`).
   * Criptografia segura da senha com `bcrypt.genSalt(10)`.
3. **PUT /api/auth/funcionario/nova-senha:**
   * Validação da Chave Administrativa.
   * Busca de funcionário pelo CPF sanitizado.
   * Atualização segura da senha com hash bcrypt.
