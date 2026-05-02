import { supabase, isDemoMode } from './supabaseClient'
import { MOCK_DOCUMENTOS, MOCK_CARRERAS } from '../data/mockData'

export const documentosService = {
  getDocumentos: async ({ carreraId, materiaId } = {}) => {
    if (isDemoMode) {
      let docs = MOCK_DOCUMENTOS
      if (carreraId) docs = docs.filter(d => d.carreras?.id === Number(carreraId))
      if (materiaId) docs = docs.filter(d => d.materias?.id === Number(materiaId))
      return docs
    }
    let query = supabase
      .from('documentos')
      .select(`id, titulo, descripcion, archivo_url, estado, fecha_subida,
        carreras ( id, nombre, codigo ),
        materias ( id, nombre, codigo, anio, cuatrimestre ),
        usuarios!documentos_subido_por_fkey ( id, nombre, apellido )`)
      .eq('estado', 'aprobado')
      .order('fecha_subida', { ascending: false })
    if (carreraId) query = query.eq('carrera_id', carreraId)
    if (materiaId) query = query.eq('materia_id', materiaId)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  subirDocumento: async () => {
    if (isDemoMode) throw new Error('La subida de archivos no está disponible en el modo demo.')
  },

  getCarreras: async () => {
    if (isDemoMode) return MOCK_CARRERAS
    const { data, error } = await supabase.from('carreras').select('*').order('nombre')
    if (error) throw error
    return data
  },

  getMateriasPorCarrera: async (carreraId) => {
    if (isDemoMode) return []
    const { data, error } = await supabase
      .from('materias').select('*').eq('carrera_id', carreraId)
      .order('anio').order('cuatrimestre')
    if (error) throw error
    return data
  },
}

export default documentosService
