function validateAdminSecret(req, res, next) {
  const chave = req.body?.chaveAdministrativa || req.body?.chave_acesso;
  const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_ACCESS_KEY;

  if (!adminSecret) {
    return res.status(500).json({
      sucesso: false,
      error: 'ADMIN_SECRET_KEY não configurada nas variáveis de ambiente do servidor.'
    });
  }

  if (!chave || String(chave).trim() !== String(adminSecret).trim()) {
    return res.status(403).json({
      sucesso: false,
      error: 'Chave administrativa incorreta. Cadastro restrito a servidores autorizados.'
    });
  }

  return next();
}

module.exports = { validateAdminSecret };
