const { supabase } = require('../database/supabase')

/**
 * GET /api/eventos
 * Lista eventos publicados con filtro opcional por tipo
 */
const getEventos = async (req, res) => {
  try {
    const { tipo } = req.query
    let query = supabase
      .from('eventos')
      .select('*')
      .eq('publicado', true)
      .order('fecha_inicio', { ascending: false })
    if (tipo) query = query.eq('tipo', tipo)
    const { data, error } = await query
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/eventos/:id
 * Obtiene un evento por ID
 */
const getEventoById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    if (!data) return res.status(404).json({ ok: false, error: 'Evento no encontrado' })
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * POST /api/eventos/:id/inscribir
 * Inscribe un usuario a un evento
 * Body: { usuarioId }
 */
const inscribirEvento = async (req, res) => {
  try {
    const { id } = req.params
    const { usuarioId } = req.body
    if (!usuarioId) return res.status(400).json({ ok: false, error: 'usuarioId requerido' })
    const { data, error } = await supabase
      .from('inscripciones_eventos')
      .insert({ usuario_id: usuarioId, evento_id: Number(id) })
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ ok: true, data })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ ok: false, error: 'El usuario ya está inscripto en este evento' })
    }
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { getEventos, getEventoById, inscribirEvento }
