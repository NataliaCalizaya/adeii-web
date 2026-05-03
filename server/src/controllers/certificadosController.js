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

/**
 * GET /api/certificados/drive/buscar?nombre=Juan+Garcia
 * Busca PDFs en la carpeta de Google Drive por nombre de alumno
 */
const buscarEnDrive = async (req, res) => {
  const { nombre } = req.query

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Parámetro "nombre" requerido (mínimo 2 caracteres).' })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1Y_fYBDYvh13ohrESYn1Lb54hOPAu27lm'

  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Falta GOOGLE_API_KEY en las variables de entorno del servidor.' })
  }

  try {
    // Buscar archivos en la carpeta cuyo nombre contenga el texto buscado
    const escapedNombre = nombre.trim().replace(/'/g, "\\'")
    const query = `'${folderId}' in parents and name contains '${escapedNombre}' and trashed = false`
    const fields = 'files(id,name,mimeType,modifiedTime)'
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&orderBy=name&includeItemsFromAllDrives=true&supportsAllDrives=true`

    const response = await fetch(url)

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      return res.status(502).json({
        ok: false,
        error: 'Error consultando Google Drive: ' + (errBody?.error?.message ?? response.statusText),
      })
    }

    const result = await response.json()
    const files = (result.files || []).map((f) => ({
      id: f.id,
      nombre: f.name,
      tipo: f.mimeType,
      modificado: f.modifiedTime,
      verUrl: `https://drive.google.com/file/d/${f.id}/view`,
      descargarUrl: `https://drive.google.com/uc?export=download&id=${f.id}`,
      previewUrl: `https://drive.google.com/file/d/${f.id}/preview`,
    }))

    res.json({ ok: true, total: files.length, data: files })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { validarCertificado, getCertificadosUsuario, getTalleres, buscarEnDrive }
