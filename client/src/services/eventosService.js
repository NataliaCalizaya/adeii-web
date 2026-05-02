import { supabase, isDemoMode } from './supabaseClient'
import { MOCK_EVENTOS } from '../data/mockData'

export const eventosService = {
  getEventos: async () => {
    if (isDemoMode) return MOCK_EVENTOS
    const { data, error } = await supabase
      .from('eventos').select('*').eq('publicado', true)
      .order('fecha_inicio', { ascending: false })
    if (error) throw error
    return data
  },

  getEventoById: async (id) => {
    if (isDemoMode) return MOCK_EVENTOS.find(e => e.id === Number(id)) ?? null
    const { data, error } = await supabase.from('eventos').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  inscribirUsuario: async () => {
    if (isDemoMode) return { id: 'demo' }
  },

  verificarInscripcion: async () => {
    if (isDemoMode) return false
    return false
  },
}

export default eventosService
