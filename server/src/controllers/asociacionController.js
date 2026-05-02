const { supabase } = require('../database/supabase')

/**
 * GET /api/asociacion
 * Retorna los datos de la asociación con sus redes sociales activas
 */
const getAsociacion = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('asociacion')
      .select('*')
      .single()
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/asociacion/:id/redes
 * Retorna redes sociales activas de la asociación
 */
const getRedesSociales = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('redes_sociales')
      .select('*')
      .eq('asociacion_id', id)
      .eq('activo', true)
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getAsociacion, getRedesSociales }
