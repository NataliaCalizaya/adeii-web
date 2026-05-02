const { Router } = require('express')
const { getDocumentos, getCarreras, getMaterias, aprobarDocumento } = require('../controllers/documentosController')

const router = Router()

router.get('/documentos', getDocumentos)
router.patch('/documentos/:id/aprobar', aprobarDocumento)
router.get('/carreras', getCarreras)
router.get('/materias', getMaterias)

module.exports = router
