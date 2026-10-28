const { supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave mestra administrativa para autorização de servidores públicos
const getChaveAdminEsperada = () => process.env.ADMIN_ACCESS_KEY || 'ZELUS-ADM-2026';

/**
 * Autenticação (Login) de Funcionário / Servidor da Prefeitura
 * POST /api/auth/funcionario/login
 */
const loginFuncionario = async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'O CPF e a senha são obrigatórios.' });
    }

    // Sanitizar CPF para comparar com a matrícula salva
    const cpfLimpo = String(cpf).replace(/\D/g, '');

    // Procurar funcionário pelo CPF ignorando RLS
    const { data: funcionario, error } = await supabaseAdmin
      .from('funcionarios')
      .select('*')
      .eq('matricula_cpf', cpfLimpo)
      .maybeSingle();

    if (error || !funcionario) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
    }

    // Gerar token JWT (expiração de 12 horas)
    const token = jwt.sign(
      { 
        id: funcionario.id, 
        tipo: 'funcionario' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Omitir a senha nos dados retornados
    const { senha: senhaOmitida, ...dadosFuncionario } = funcionario;

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      token,
      dados: dadosFuncionario
    });

  } catch (err) {
    console.error('Erro no login do funcionário:', err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor.' });
  }
};

/**
 * Cadastro de Novo Funcionário / Servidor da Prefeitura
 * Exige Chave de Acesso Administrativa para barrar cidadãos comuns
 * POST /api/auth/funcionario/registro
 */
const registrarFuncionario = async (req, res) => {
  try {
    const { nome, nome_completo, cpf, senha, chave_acesso, email } = req.body;
    const nomeFinal = (nome_completo || nome || '').trim();

    // 1. Validação de campos obrigatórios
    if (!nomeFinal || !cpf || !senha || !chave_acesso) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios (Nome, CPF, Senha e Chave de Acesso Administrativa).'
      });
    }

    // 2. Validação da Chave de Acesso Administrativa
    const chaveEsperada = getChaveAdminEsperada();
    if (chave_acesso.trim() !== chaveEsperada) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Chave de Acesso Administrativa inválida. Acesso restrito a servidores autorizados.'
      });
    }

    // 3. Sanitização e validação de CPF
    const cpfLimpo = String(cpf).replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O CPF informado deve conter exatamente 11 dígitos numéricos.'
      });
    }

    // 4. Verificação de duplicidade de funcionário
    const { data: funcionarioExistente, error: erroBusca } = await supabaseAdmin
      .from('funcionarios')
      .select('id, matricula_cpf')
      .eq('matricula_cpf', cpfLimpo)
      .maybeSingle();

    if (erroBusca) {
      console.error('Erro ao verificar funcionário existente:', erroBusca);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao validar dados.' });
    }

    if (funcionarioExistente) {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'CPF já cadastrado no sistema da Prefeitura.'
      });
    }

    // 5. Criptografia da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 6. E-mail institucional (garante integridade do esquema do banco)
    const emailFinal = (email && email.trim()) || `${cpfLimpo}@prefeitura.zelus.gov.br`;

    // 7. Inserção no banco de dados
    const { data: novoFuncionario, error: erroInsert } = await supabaseAdmin
      .from('funcionarios')
      .insert([
        {
          nome_completo: nomeFinal,
          matricula_cpf: cpfLimpo,
          email: emailFinal,
          senha: senhaHash
        }
      ])
      .select('id, nome_completo, matricula_cpf, email, created_at')
      .single();

    if (erroInsert) {
      console.error('Erro ao inserir servidor público:', erroInsert);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno ao registrar servidor.'
      });
    }

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Servidor cadastrado com sucesso!',
      dados: novoFuncionario
    });

  } catch (err) {
    console.error('Erro inesperado no registro do funcionário:', err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

/**
 * Recuperação / Redefinição de Senha do Funcionário
 * Exige Chave de Acesso Administrativa para autorizar a alteração
 * PUT /api/auth/funcionario/nova-senha
 */
const redefinirSenhaFuncionario = async (req, res) => {
  try {
    const { cpf, nova_senha, senha, chave_acesso } = req.body;
    const senhaFinal = nova_senha || senha;

    // 1. Validação de campos obrigatórios
    if (!cpf || !senhaFinal || !chave_acesso) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'CPF, Nova Senha e Chave de Acesso Administrativa são obrigatórios.'
      });
    }

    // 2. Validação da Chave de Acesso Administrativa
    const chaveEsperada = getChaveAdminEsperada();
    if (chave_acesso.trim() !== chaveEsperada) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Chave de Acesso Administrativa inválida. Redefinição não autorizada.'
      });
    }

    // 3. Sanitização de CPF
    const cpfLimpo = String(cpf).replace(/\D/g, '');

    // 4. Localização do servidor
    const { data: funcionario, error: erroBusca } = await supabaseAdmin
      .from('funcionarios')
      .select('id, matricula_cpf')
      .eq('matricula_cpf', cpfLimpo)
      .maybeSingle();

    if (erroBusca) {
      console.error('Erro ao buscar servidor para redefinição:', erroBusca);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao validar dados.' });
    }

    if (!funcionario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Servidor não localizado com o CPF informado.'
      });
    }

    // 5. Criptografia da nova senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaFinal, salt);

    // 6. Atualização no banco
    const { error: erroUpdate } = await supabaseAdmin
      .from('funcionarios')
      .update({ senha: senhaHash })
      .eq('id', funcionario.id);

    if (erroUpdate) {
      console.error('Erro ao atualizar senha do servidor:', erroUpdate);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao atualizar a senha.' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Senha redefinida com sucesso!'
    });

  } catch (err) {
    console.error('Erro inesperado na redefinição de senha do funcionário:', err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = {
  loginFuncionario,
  registrarFuncionario,
  redefinirSenhaFuncionario
};

