const { supabase } = require('../database/supabase')

/**
 * GET /api/usuarios
 * Lista todos los usuarios (solo admin)
 */
const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, lu, rol, estado, activo, en_comision, cargo, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/usuarios/comision
 * Lista los miembros de la comisión directiva
 */
const getComision = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, cargo, periodo, foto_perfil, orden')
      .eq('en_comision', true)
      .eq('activo', true)
      .order('orden', { ascending: true, nullsFirst: false })
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/usuarios/:id/plan-estudio
 * Obtiene el plan de estudio de un usuario
 */
const getPlanEstudio = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('plan_estudio')
      .select('id, estado, nota_final, fecha_aprobacion, porcentaje_avance, materias(id, nombre, codigo, anio, cuatrimestre)')
      .eq('usuario_id', id)
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getUsuarios, getComision, getPlanEstudio }
