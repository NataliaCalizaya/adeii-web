const { supabase } = require('../database/supabase')

/**
 * GET /api/certificados/validar/:codigo
 * Valida un certificado por código único
 */
const validarCertificado = async (req, res) => {
  try {
    const { codigo } = req.params
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        id, codigo_validacion, fecha_emision, archivo_url,
        usuarios!certificados_usuario_id_fkey ( nombre, apellido ),
        talleres ( nombre )
      `)
      .eq('codigo_validacion', codigo)
      .maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ ok: false, error: 'Certificado no encontrado' })
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/certificados/usuario/:usuarioId
 * Lista certificados de un usuario
 */
const getCertificadosUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params
    const { data, error } = await supabase
      .from('certificados')
      .select('id, codigo_validacion, fecha_emision, archivo_url, talleres(nombre)')
      .eq('usuario_id', usuarioId)
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * GET /api/talleres
 * Lista talleres activos
 */
const getTalleres = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('talleres')
      .select('*')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: false })
    if (error) throw error
    res.json({ ok: true, data })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { validarCertificado, getCertificadosUsuario, getTalleres }
