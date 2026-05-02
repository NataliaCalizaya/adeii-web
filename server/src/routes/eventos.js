const { Router } = require('express')
const { getEventos, getEventoById, inscribirEvento } = require('../controllers/eventosController')

const router = Router()

router.get('/', getEventos)
router.get('/:id', getEventoById)
router.post('/:id/inscribir', inscribirEvento)

module.exports = router
