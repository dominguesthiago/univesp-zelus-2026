const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin, supabaseClient } = require('../config/supabase');

function sanitizeCpf(cpf) {
  return cpf ? String(cpf).replace(/\D/g, '') : '';
}

function generateGhostEmail(cleanCpf) {
  const domain = process.env.PREFEITURA_EMAIL_DOMAIN || 'prefeitura.local';
  return `${cleanCpf}@${domain}`;
}

class PrefeituraAuthController {
  async cadastro(req, res) {
    try {
      const { nomeCompleto, nome_completo, cpf, senha, chaveAdministrativa, chave_acesso } = req.body;
      const nomeFinal = (nomeCompleto || nome_completo || '').trim();
      const chaveFinal = chaveAdministrativa || chave_acesso;

      if (!nomeFinal || !cpf || !senha) {
        return res.status(400).json({
          sucesso: false,
          error: 'Campos obrigatórios ausentes: nomeCompleto, cpf e senha são obrigatórios.',
          mensagem: 'Campos obrigatórios ausentes: nomeCompleto, cpf e senha são obrigatórios.'
        });
      }

      const cleanCpf = sanitizeCpf(cpf);
      if (cleanCpf.length !== 11) {
        return res.status(400).json({
          sucesso: false,
          error: 'CPF inválido. O CPF deve conter 11 dígitos numéricos.',
          mensagem: 'CPF inválido. O CPF deve conter 11 dígitos numéricos.'
        });
      }

      // 1. Validação da Chave Administrativa
      const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_ACCESS_KEY;
      if (!adminSecret || String(chaveFinal).trim() !== String(adminSecret).trim()) {
        return res.status(403).json({
          sucesso: false,
          error: 'Chave administrativa incorreta. Cadastro restrito a servidores autorizados.',
          mensagem: 'Chave administrativa incorreta. Cadastro restrito a servidores autorizados.'
        });
      }

      // 2. Verificar duplicidade na tabela 'funcionarios'
      const { data: funcionarioExistente, error: searchError } = await supabaseAdmin
        .from('funcionarios')
        .select('id, matricula_cpf')
        .eq('matricula_cpf', cleanCpf)
        .maybeSingle();

      if (searchError) {
        console.error('Erro ao verificar funcionário existente:', searchError);
        return res.status(500).json({
          sucesso: false,
          error: 'Erro ao consultar base de funcionários.',
          details: searchError.message
        });
      }

      if (funcionarioExistente) {
        return res.status(409).json({
          sucesso: false,
          error: 'Este CPF já está cadastrado no sistema municipal.',
          mensagem: 'Este CPF já está cadastrado no sistema municipal.'
        });
      }

      // 3. Gerar o e-mail em background para o Supabase Auth
      const ghostEmail = generateGhostEmail(cleanCpf);

      // 4. Hash da senha para persistência na tabela funcionarios
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      // 5. Cadastrar no Supabase Auth
      let authUserId = null;
      try {
        if (supabaseAdmin?.auth?.admin?.createUser) {
          const { data: authCreated, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
            email: ghostEmail,
            password: senha,
            email_confirm: true,
            user_metadata: {
              nome_completo: nomeFinal,
              cpf: cleanCpf,
              tipo_usuario: 'funcionario_prefeitura'
            }
          });
          if (authCreated?.user?.id) {
            authUserId = authCreated.user.id;
          } else if (createAuthError) {
            console.warn('Aviso ao criar usuário via admin.createUser:', createAuthError.message);
          }
        }
      } catch (authErr) {
        console.warn('Falha na criação de usuário no Supabase Auth:', authErr.message);
      }

      // 6. Inserção na tabela 'funcionarios'
      const registro = {
        nome_completo: nomeFinal,
        matricula_cpf: cleanCpf,
        email: ghostEmail,
        senha: senhaHash
      };

      if (authUserId) {
        registro.id = authUserId;
      }

      const { data: novoFuncionario, error: insertError } = await supabaseAdmin
        .from('funcionarios')
        .insert([registro])
        .select('id, nome_completo, matricula_cpf, email, created_at')
        .single();

      if (insertError) {
        console.error('Erro ao salvar funcionário:', insertError);
        return res.status(500).json({
          sucesso: false,
          error: 'Falha ao salvar dados funcionais.',
          details: insertError.message
        });
      }

      return res.status(201).json({
        sucesso: true,
        message: 'Servidor municipal cadastrado com sucesso!',
        mensagem: 'Servidor municipal cadastrado com sucesso!',
        funcionario: {
          id: novoFuncionario.id,
          nomeCompleto: novoFuncionario.nome_completo,
          cpf: novoFuncionario.matricula_cpf,
          email: novoFuncionario.email
        }
      });
    } catch (err) {
      console.error('Erro inesperado no cadastro de servidor:', err);
      return res.status(500).json({
        sucesso: false,
        error: 'Erro interno no servidor.',
        details: err.message
      });
    }
  }

  async login(req, res) {
    try {
      const { cpf, senha } = req.body;

      if (!cpf || !senha) {
        return res.status(400).json({
          sucesso: false,
          error: 'CPF e senha são obrigatórios.',
          mensagem: 'O CPF e a senha são obrigatórios.'
        });
      }

      const cleanCpf = sanitizeCpf(cpf);
      if (cleanCpf.length !== 11) {
        return res.status(400).json({
          sucesso: false,
          error: 'CPF inválido. O CPF deve conter 11 dígitos numéricos.',
          mensagem: 'O CPF informado deve conter exatamente 11 dígitos numéricos.'
        });
      }

      // 1. Verificar se o funcionário existe na tabela 'funcionarios'
      const { data: funcionario, error: funcionarioError } = await supabaseAdmin
        .from('funcionarios')
        .select('*')
        .eq('matricula_cpf', cleanCpf)
        .maybeSingle();

      if (funcionarioError) {
        console.error('Erro ao consultar tabela de funcionários:', funcionarioError);
        return res.status(500).json({
          sucesso: false,
          error: 'Erro ao validar credenciais.',
          details: funcionarioError.message
        });
      }

      if (!funcionario) {
        return res.status(403).json({
          sucesso: false,
          error: 'Acesso negado. Este usuário não possui cadastro ativo como funcionário da prefeitura.',
          mensagem: 'Acesso restrito. Usuário não localizado na base de servidores municipais.'
        });
      }

      // 2. Validação da Senha
      let senhaCorreta = false;
      if (funcionario.senha) {
        senhaCorreta = await bcrypt.compare(senha, funcionario.senha);
      }

      // Fallback para autenticação no Supabase Auth caso a senha não bata diretamente
      const ghostEmail = generateGhostEmail(cleanCpf);
      let authSession = null;
      if (!senhaCorreta && supabaseClient?.auth?.signInWithPassword) {
        try {
          const { data: authData } = await supabaseClient.auth.signInWithPassword({
            email: ghostEmail,
            password: senha
          });
          if (authData?.session) {
            senhaCorreta = true;
            authSession = authData.session;
          }
        } catch (_) {}
      }

      if (!senhaCorreta) {
        return res.status(401).json({
          sucesso: false,
          error: 'Credenciais inválidas. Verifique o CPF e a senha informados.',
          mensagem: 'Credenciais inválidas.'
        });
      }

      // 3. Emissão do token JWT do sistema (12 horas de validade)
      const jwtSecret = process.env.JWT_SECRET || 'zelus-secret-token-key-2026';
      const token = jwt.sign(
        {
          id: funcionario.id,
          tipo: 'funcionario'
        },
        jwtSecret,
        { expiresIn: '12h' }
      );

      return res.status(200).json({
        sucesso: true,
        message: 'Login realizado com sucesso.',
        mensagem: 'Login realizado com sucesso.',
        token,
        refreshToken: authSession?.refresh_token || null,
        funcionario: {
          id: funcionario.id,
          nomeCompleto: funcionario.nome_completo,
          cpf: funcionario.matricula_cpf,
          email: funcionario.email
        },
        dados: {
          id: funcionario.id,
          nome_completo: funcionario.nome_completo,
          matricula_cpf: funcionario.matricula_cpf,
          email: funcionario.email
        }
      });
    } catch (err) {
      console.error('Erro inesperado no login do funcionário:', err);
      return res.status(500).json({
        sucesso: false,
        error: 'Erro interno no servidor.',
        details: err.message
      });
    }
  }
}

module.exports = { PrefeituraAuthController };
