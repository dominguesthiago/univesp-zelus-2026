const express = require('express');
const router = express.Router();
const {
  loginFuncionario,
  registrarFuncionario,
  redefinirSenhaFuncionario
} = require('../controllers/authFuncionarioController');

// POST /api/auth/funcionario/login
router.post('/login', loginFuncionario);

// POST /api/auth/funcionario/registro
router.post('/registro', registrarFuncionario);

// PUT /api/auth/funcionario/nova-senha
router.put('/nova-senha', redefinirSenhaFuncionario);

// POST /api/auth/funcionario/esqueci-senha (alias flexível)
router.post('/esqueci-senha', redefinirSenhaFuncionario);

module.exports = router;

