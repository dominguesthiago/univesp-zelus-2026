# Especificação de Integração - Autenticação do Painel da Prefeitura

## 1. Visão Geral
Este documento define as especificações técnicas para a integração entre o frontend do **Painel da Prefeitura** e a API backend da plataforma **ZELUS** (Node.js/Express e Supabase).

O fluxo elimina a necessidade de digitação de e-mail por parte do servidor público na interface web. O único identificador utilizado pelo funcionário municipal é o **CPF**.

---

## 2. Decisões Arquiteturais

1. **Reaproveitamento da Tabela Existente:**
   * Utilização exclusiva da tabela `public.funcionarios` já estruturada no Supabase (`id`, `nome_completo`, `matricula_cpf`, `email`, `senha`, `created_at`).
   * Nenhuma tabela intermediária adicional é necessária.

2. **Geração de E-mail Institucional em Background (E-mail Fantasma):**
   * O frontend envia apenas o CPF.
   * O backend sanitiza o CPF (mantendo apenas os 11 dígitos numéricos) e sintetiza o endereço:
     ```
     email = `${cpfLimpo}@prefeitura.local`
     ```
   * Esse endereço satisfaz os requisitos de unicidade e compatibilidade com o serviço de autenticação do Supabase.

3. **Validação de Chave Administrativa Mestra (`ADMIN_SECRET_KEY`):**
   * Para impedir o auto-registro não autorizado e a redefinição de senhas por pessoas não autorizadas, as rotas de cadastro e recuperação de senha exigem o envio da `chaveAdministrativa`.
   * O backend valida o valor contra a variável `process.env.ADMIN_SECRET_KEY` (com fallback para `ADMIN_ACCESS_KEY`).
   * Chave ausente ou divergente resulta imediatamente em `403 Forbidden`.

4. **Sincronização Dupla de Credenciais (Dupla Atualização):**
   * Toda criação ou redefinição de credenciais de servidores municipais é persistida de forma sincronizada em duas camadas:
     1. **Supabase Auth (Identity Layer):** Atualização via Admin Client (`supabaseAdmin.auth.admin.updateUserById(id, { password: novaSenha })`), garantindo autenticidade e emissão de tokens.
     2. **Tabela `funcionarios` (Application Layer):** Criptografia da senha utilizando `bcrypt.hash(novaSenha, 10)` e gravação na coluna `senha` do registro do funcionário, mantendo integridade com as regras locais e compatibilidade com o esquema relacional.

---

## 3. Endpoints da API

### 3.1. Cadastro de Servidor Municipal

* **Método:** `POST`
* **Rota:** `/api/prefeitura/auth/cadastro` (ou `/api/auth/prefeitura/cadastro`)
* **Headers:** `Content-Type: application/json`
* **Middleware Aplicado:** `validateAdminSecret`

#### Payload de Envio (Request Body)
```json
{
  "nomeCompleto": "Carlos Eduardo da Silva",
  "cpf": "123.456.789-01",
  "senha": "SenhaForte@2026",
  "chaveAdministrativa": "CHAVE_CONFIGURADA_NO_ENV"
}
```

#### Respostas
* **`201 Created`**
  ```json
  {
    "sucesso": true,
    "mensagem": "Servidor municipal cadastrado com sucesso!",
    "funcionario": {
      "id": "e4b3c9a1-5d2f-4e6a-8b1c-9d0e1f2a3b4c",
      "nomeCompleto": "Carlos Eduardo da Silva",
      "cpf": "12345678901",
      "email": "12345678901@prefeitura.local"
    }
  }
  ```
* **`400 Bad Request`**: Campos obrigatórios ausentes ou CPF com formato inválido (diferente de 11 dígitos).
* **`403 Forbidden`**: Chave administrativa incorreta ou ausente.
* **`409 Conflict`**: CPF já cadastrado no sistema municipal.

---

### 3.2. Login do Servidor Municipal

* **Método:** `POST`
* **Rota:** `/api/prefeitura/auth/login` (ou `/api/auth/prefeitura/login`)
* **Headers:** `Content-Type: application/json`

#### Payload de Envio (Request Body)
```json
{
  "cpf": "123.456.789-01",
  "senha": "SenhaForte@2026"
}
```

#### Respostas
* **`200 OK`**
  ```json
  {
    "sucesso": true,
    "mensagem": "Login realizado com sucesso.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": null,
    "funcionario": {
      "id": "e4b3c9a1-5d2f-4e6a-8b1c-9d0e1f2a3b4c",
      "nomeCompleto": "Carlos Eduardo da Silva",
      "cpf": "12345678901",
      "email": "12345678901@prefeitura.local"
    }
  }
  ```
* **`400 Bad Request`**: CPF ou senha não informados, ou formato de CPF inválido.
* **`401 Unauthorized`**: Senha incorreta.
* **`403 Forbidden`**: CPF não localizado na base de servidores autorizados da prefeitura.

---

### 3.3. Recuperação / Redefinição de Senha do Servidor Municipal

* **Método:** `POST`
* **Rota:** `/api/prefeitura/auth/recuperar-senha` (ou `/api/auth/prefeitura/recuperar-senha`)
* **Headers:** `Content-Type: application/json`
* **Middleware Aplicado:** `validateAdminSecret`

#### Payload de Envio (Request Body)
```json
{
  "cpf": "123.456.789-01",
  "novaSenha": "NovaSenhaForte@2026",
  "chaveAdministrativa": "CHAVE_CONFIGURADA_NO_ENV"
}
```

#### Regra de Negócio (Dupla Atualização)
1. Higieniza o CPF (apenas 11 dígitos numéricos).
2. Localiza o servidor na tabela `funcionarios` pelo `matricula_cpf` e obtém seu `id` (UUID). Retorna `404 Not Found` caso não exista.
3. Atualiza a credencial no **Supabase Auth** via `supabaseAdmin.auth.admin.updateUserById(id, { password: novaSenha })`.
4. Criptografa a nova senha com `bcrypt` (10 rounds de salt) e atualiza a coluna `senha` na tabela **`funcionarios`**.

#### Respostas
* **`200 OK`**
  ```json
  {
    "sucesso": true,
    "mensagem": "Senha redefinida com sucesso!"
  }
  ```
* **`400 Bad Request`**: CPF ou nova senha ausentes, senha com menos de 6 caracteres ou formato de CPF inválido.
* **`403 Forbidden`**: Chave administrativa incorreta ou não fornecida.
* **`404 Not Found`**: Servidor não localizado com o CPF informado.

---

## 4. Variáveis de Ambiente Requeridas

Certifique-se de que o arquivo `backend/.env` contenha as seguintes definições:

```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
SUPABASE_ANON_KEY=sua-anon-key
JWT_SECRET=seu-jwt-secret-de-12-horas
ADMIN_SECRET_KEY=sua-chave-mestra-administrativa
PREFEITURA_EMAIL_DOMAIN=prefeitura.local
```

---

## 5. Testes Automatizados

A suíte de testes de integração cobre 100% dos cenários de sucesso e falha (status 200, 201, 400, 401, 403, 404 e 409).
Para executar a suíte no terminal:

```bash
cd backend
npm test
```
