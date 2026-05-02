const { supabase } = require('../database/supabase')

/**
 * GET /api/documentos
 * Lista documentos aprobados. Filtros opcionales: carrera_id, materia_id
 */
const getDocumentos = async (req, res) => {
  try {
    const { carrera_id, materia_id } = req.query
    let query = supabase
      .from('documentos')
      .select(`
        id, titulo, descripcion, archivo_url, estado, fecha_subida,
        carreras ( id, nombre ),
        materias ( id, nombre, anio, cuatrimestre ),
        usuarios!documentos_subido_por_fkey ( id, nombre, apellido )
      `)
      .eq('estado', 'aprobado')
      .order('fecha_subida', { ascending: false })
    if (carrera_id) query = query.eq('carrera_id', carrera_id)
    if (materia_id) query = query.eq('materia_id', materia_id)
    const { data, error } = await query
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/carreras
 * Lista todas las carreras
 */
const getCarreras = async (req, res) => {
  try {
    const { data, error } = await supabase.from('carreras').select('*').order('nombre')
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/materias?carrera_id=X
 * Lista materias por carrera
 */
const getMaterias = async (req, res) => {
  try {
    const { carrera_id } = req.query
    let query = supabase.from('materias').select('*').order('anio').order('cuatrimestre')
    if (carrera_id) query = query.eq('carrera_id', carrera_id)
    const { data, error } = await query
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * PATCH /api/documentos/:id/aprobar
 * Aprueba un documento (solo admins)
 * Body: { aprobadoPor }
 */
const aprobarDocumento = async (req, res) => {
  try {
    const { id } = req.params
    const { aprobadoPor } = req.body
    const { data, error } = await supabase
      .from('documentos')
      .update({
        estado: 'aprobado',
        aprobado_por: aprobadoPor,
        fecha_aprobacion: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getDocumentos, getCarreras, getMaterias, aprobarDocumento }
