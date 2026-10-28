const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const bcrypt = require('bcryptjs');

// Configuração do ambiente para testes
process.env.ADMIN_SECRET_KEY = 'CHAVE_SEGURA_TESTE_2026';
process.env.ADMIN_ACCESS_KEY = 'CHAVE_SEGURA_TESTE_2026';
process.env.JWT_SECRET = 'segredo-jwt-teste-2026';
process.env.PREFEITURA_EMAIL_DOMAIN = 'prefeitura.local';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'mock-service-key';

const { supabaseAdmin } = require('../config/supabase');
const prefeituraAuthRoutes = require('../routes/prefeituraAuth.routes');

const app = express();
app.use(express.json());
app.use('/api/prefeitura/auth', prefeituraAuthRoutes);

let server;
let baseUrl;

describe('Suíte de Testes da API de Autenticação da Prefeitura', () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api/prefeitura/auth`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('Fluxo de Cadastro (POST /cadastro)', () => {
    it('1. Deve retornar 400 quando campos obrigatórios estiverem ausentes', async () => {
      const res = await fetch(`${baseUrl}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: 'Servidor Teste',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.sucesso, false);
      assert.match(data.error, /obrigatórios/i);
    });

    it('2. Deve retornar 400 quando o CPF for inválido (diferente de 11 dígitos)', async () => {
      const res = await fetch(`${baseUrl}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: 'Servidor Teste',
          cpf: '12345',
          senha: 'senhaForte@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /CPF inválido/i);
    });

    it('3. Deve retornar 403 quando a chaveAdministrativa for incorreta', async () => {
      const res = await fetch(`${baseUrl}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: 'Servidor Teste',
          cpf: '123.456.789-01',
          senha: 'senhaForte@2026',
          chaveAdministrativa: 'CHAVE_ERRADA'
        })
      });

      assert.strictEqual(res.status, 403);
      const data = await res.json();
      assert.match(data.error, /Chave administrativa incorreta/i);
    });

    it('4. Deve retornar 409 quando o CPF já estiver cadastrado na tabela de funcionários', async () => {
      // Mock do supabaseAdmin para simular funcionário já existente
      const originalFrom = supabaseAdmin.from;
      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { id: 'uuid-existente', matricula_cpf: '12345678901' },
                  error: null
                })
              })
            })
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: 'Servidor Teste',
          cpf: '123.456.789-01',
          senha: 'senhaForte@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 409);
      const data = await res.json();
      assert.match(data.error, /já está cadastrado/i);
    });

    it('5. Deve cadastrar o servidor com sucesso (201) e salvar na tabela funcionarios', async () => {
      const originalFrom = supabaseAdmin.from;
      let insertedRecord = null;

      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null, error: null })
              })
            }),
            insert: (records) => {
              insertedRecord = records[0];
              return {
                select: () => ({
                  single: async () => ({
                    data: {
                      id: 'uuid-novo-servidor',
                      nome_completo: insertedRecord.nome_completo,
                      matricula_cpf: insertedRecord.matricula_cpf,
                      email: insertedRecord.email
                    },
                    error: null
                  })
                })
              };
            }
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: 'Carlos Eduardo Oliveira',
          cpf: '123.456.789-01',
          senha: 'senhaForte@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.sucesso, true);
      assert.strictEqual(data.funcionario.cpf, '12345678901');
      assert.strictEqual(insertedRecord.matricula_cpf, '12345678901');
      assert.strictEqual(insertedRecord.email, '12345678901@prefeitura.local');
    });
  });

  describe('Fluxo de Login (POST /login)', () => {
    it('1. Deve retornar 400 se CPF ou senha não forem informados', async () => {
      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: '12345678901' })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /obrigatórios/i);
    });

    it('2. Deve retornar 400 se o CPF informado for inválido', async () => {
      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: '123', senha: '123' })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /CPF inválido/i);
    });

    it('3. Deve retornar 403 se o usuário não constar na tabela de funcionários', async () => {
      const originalFrom = supabaseAdmin.from;
      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null, error: null })
              })
            })
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '123.456.789-01',
          senha: 'senhaForte@2026'
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 403);
      const data = await res.json();
      assert.match(data.error, /não possui cadastro ativo como funcionário/i);
    });

    it('4. Deve retornar 401 se a senha informada estiver incorreta', async () => {
      const hashSenhaCorreta = await bcrypt.hash('senhaCorreta123', 10);
      const originalFrom = supabaseAdmin.from;

      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    id: 'uuid-servidor',
                    nome_completo: 'Mariana Costa',
                    matricula_cpf: '98765432100',
                    email: '98765432100@prefeitura.local',
                    senha: hashSenhaCorreta
                  },
                  error: null
                })
              })
            })
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '987.654.321-00',
          senha: 'senhaErrada'
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /Credenciais inválidas/i);
    });

    it('5. Deve autenticar com sucesso (200), retornar token JWT e dados do funcionário', async () => {
      const senhaPlana = 'senhaServidor@2026';
      const hashSenhaCorreta = await bcrypt.hash(senhaPlana, 10);
      const originalFrom = supabaseAdmin.from;

      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    id: 'uuid-servidor-777',
                    nome_completo: 'Mariana Costa',
                    matricula_cpf: '98765432100',
                    email: '98765432100@prefeitura.local',
                    senha: hashSenhaCorreta
                  },
                  error: null
                })
              })
            })
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '987.654.321-00',
          senha: senhaPlana
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.sucesso, true);
      assert.ok(data.token, 'Token JWT deve ser retornado');
      assert.strictEqual(data.funcionario.cpf, '98765432100');
      assert.strictEqual(data.funcionario.nomeCompleto, 'Mariana Costa');
    });
  });

  describe('Fluxo de Recuperação de Senha (POST /recuperar-senha)', () => {
    it('1. Deve retornar 403 se a chaveAdministrativa for incorreta ou ausente', async () => {
      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '12345678901',
          novaSenha: 'NovaSenhaForte@2026',
          chaveAdministrativa: 'CHAVE_ERRADA'
        })
      });

      assert.strictEqual(res.status, 403);
      const data = await res.json();
      assert.match(data.error, /Chave administrativa incorreta/i);
    });

    it('2. Deve retornar 400 se campos obrigatórios estiverem ausentes', async () => {
      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '12345678901',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /obrigatórios/i);
    });

    it('3. Deve retornar 400 se o CPF informado for inválido', async () => {
      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '12345',
          novaSenha: 'NovaSenhaForte@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /CPF inválido/i);
    });

    it('4. Deve retornar 400 se a nova senha tiver menos de 6 caracteres', async () => {
      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '123.456.789-01',
          novaSenha: '123',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /no mínimo 6 caracteres/i);
    });

    it('5. Deve retornar 404 se o servidor não constar na tabela de funcionários', async () => {
      const originalFrom = supabaseAdmin.from;
      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null, error: null })
              })
            })
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '123.456.789-01',
          novaSenha: 'NovaSenhaForte@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      supabaseAdmin.from = originalFrom;

      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.match(data.error, /Servidor não localizado/i);
    });

    it('6. Deve redefinir a senha com sucesso (200) com dupla atualização (Supabase Auth e tabela funcionarios)', async () => {
      const originalFrom = supabaseAdmin.from;
      let updatedData = null;
      let authUpdated = null;

      // Mock da função do Supabase Auth Admin
      if (!supabaseAdmin.auth) supabaseAdmin.auth = {};
      if (!supabaseAdmin.auth.admin) supabaseAdmin.auth.admin = {};
      const originalUpdateUserById = supabaseAdmin.auth.admin.updateUserById;
      supabaseAdmin.auth.admin.updateUserById = async (id, params) => {
        authUpdated = { id, params };
        return { data: { id }, error: null };
      };

      supabaseAdmin.from = (table) => {
        if (table === 'funcionarios') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    id: 'uuid-servidor-recuperacao',
                    nome_completo: 'Rodrigo Antunes',
                    matricula_cpf: '12345678901',
                    email: '12345678901@prefeitura.local'
                  },
                  error: null
                })
              })
            }),
            update: (fields) => {
              updatedData = fields;
              return {
                eq: async () => ({ error: null })
              };
            }
          };
        }
        return originalFrom.call(supabaseAdmin, table);
      };

      const res = await fetch(`${baseUrl}/recuperar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: '123.456.789-01',
          novaSenha: 'NovaSenhaSuperSegura@2026',
          chaveAdministrativa: 'CHAVE_SEGURA_TESTE_2026'
        })
      });

      supabaseAdmin.from = originalFrom;
      supabaseAdmin.auth.admin.updateUserById = originalUpdateUserById;

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.sucesso, true);
      assert.match(data.mensagem, /sucesso/i);

      // Verificação da Dupla Atualização:
      // 1. Supabase Auth
      assert.ok(authUpdated, 'Supabase Auth admin.updateUserById deve ter sido invocado');
      assert.strictEqual(authUpdated.id, 'uuid-servidor-recuperacao');
      assert.strictEqual(authUpdated.params.password, 'NovaSenhaSuperSegura@2026');

      // 2. Tabela funcionarios com hash bcrypt
      assert.ok(updatedData?.senha, 'Coluna senha deve ter sido atualizada');
      const hashValido = await bcrypt.compare('NovaSenhaSuperSegura@2026', updatedData.senha);
      assert.strictEqual(hashValido, true, 'Senha gravada deve ser o hash bcrypt correto da nova senha');
    });
  });
});
