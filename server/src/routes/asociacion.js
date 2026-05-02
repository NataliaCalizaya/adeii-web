const { Router } = require('express')
const { getAsociacion, getRedesSociales } = require('../controllers/asociacionController')

const router = Router()

router.get('/', getAsociacion)
router.get('/:id/redes', getRedesSociales)

module.exports = router
