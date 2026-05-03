const { Router } = require('express')
const { login, register } = require('../controllers/authController')

const router = Router()

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', login)

/**
 * POST /api/auth/register
 * Body: { nombre, apellido, email, password, lu?, fecha_inscripcion?,
 *         carrera_principal_id?, carrera_secundaria_id?, foto_perfil? }
 */
router.post('/register', register)

module.exports = router
