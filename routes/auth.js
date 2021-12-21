const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    validateFields
], login );

module.exports = router;