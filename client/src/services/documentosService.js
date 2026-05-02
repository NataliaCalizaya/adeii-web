// Servicios para las tablas `documentos`, `carreras`, `materias`
import { supabase } from './supabaseClient'

export const documentosService = {
  /**
   * Lista documentos aprobados con carrera y materia (JOIN)
   */
  getDocumentos: async ({ carreraId, materiaId } = {}) => {
    let query = supabase
      .from('documentos')
      .select(`
        id, titulo, descripcion, archivo_url, estado, fecha_subida,
        carreras ( id, nombre, codigo ),
        materias ( id, nombre, codigo, anio, cuatrimestre ),
        usuarios!documentos_subido_por_fkey ( id, nombre, apellido )
      `)
      .eq('estado', 'aprobado')
      .order('fecha_subida', { ascending: false })

    if (carreraId) query = query.eq('carrera_id', carreraId)
    if (materiaId) query = query.eq('materia_id', materiaId)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  /**
   * Sube un PDF a Supabase Storage y registra en la tabla documentos
   */
  subirDocumento: async ({ titulo, descripcion, file, carreraId, materiaId, usuarioId }) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const storagePath = `carreras/${carreraId || 'general'}/${fileName}`

    // 1. Subir archivo al bucket 'documentos'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })

    if (uploadError) throw uploadError

    // 2. Obtener URL pública del PDF
    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(storagePath)

    // 3. Insertar registro en la tabla documentos
    const { data, error } = await supabase
      .from('documentos')
      .insert({
        titulo,
        descripcion,
        archivo_url: publicUrl,
        carrera_id: carreraId || null,
        materia_id: materiaId || null,
        subido_por: usuarioId,
        estado: 'pendiente',
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Lista todas las carreras disponibles
   */
  getCarreras: async () => {
    const { data, error } = await supabase
      .from('carreras')
      .select('*')
      .order('nombre')
    if (error) throw error
    return data
  },

  /**
   * Lista materias filtradas por carrera
   */
  getMateriasPorCarrera: async (carreraId) => {
    const { data, error } = await supabase
      .from('materias')
      .select('*')
      .eq('carrera_id', carreraId)
      .order('anio', { ascending: true })
      .order('cuatrimestre', { ascending: true })
    if (error) throw error
    return data
  },
}

export default documentosService
