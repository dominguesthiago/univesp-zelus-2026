const express = require('express');
const { PrefeituraAuthController } = require('../controllers/PrefeituraAuthController');
const { validateAdminSecret } = require('../middlewares/validateAdminSecret');

const router = express.Router();
const prefeituraAuthController = new PrefeituraAuthController();

// POST /api/prefeitura/auth/cadastro
router.post('/cadastro', validateAdminSecret, (req, res) => prefeituraAuthController.cadastro(req, res));

// POST /api/prefeitura/auth/login
router.post('/login', (req, res) => prefeituraAuthController.login(req, res));

// POST /api/prefeitura/auth/recuperar-senha (protegido por validateAdminSecret)
router.post('/recuperar-senha', validateAdminSecret, (req, res) => prefeituraAuthController.recuperarSenha(req, res));
router.post('/esqueci-senha', validateAdminSecret, (req, res) => prefeituraAuthController.recuperarSenha(req, res));
router.put('/nova-senha', validateAdminSecret, (req, res) => prefeituraAuthController.recuperarSenha(req, res));

module.exports = router;
