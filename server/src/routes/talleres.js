const { Router } = require('express')
const { validarCertificado, getCertificadosUsuario, getTalleres } = require('../controllers/certificadosController')

const router = Router()

router.get('/talleres', getTalleres)
router.get('/certificados/validar/:codigo', validarCertificado)
router.get('/certificados/usuario/:usuarioId', getCertificadosUsuario)

module.exports = router
