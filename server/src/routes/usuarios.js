const { Router } = require('express')
const { getUsuarios, getComision, getPlanEstudio } = require('../controllers/usuariosController')

const router = Router()

router.get('/', getUsuarios)
router.get('/comision', getComision)
router.get('/:id/plan-estudio', getPlanEstudio)

module.exports = router
