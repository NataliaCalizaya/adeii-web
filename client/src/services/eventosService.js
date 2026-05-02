// Servicios para las tablas `eventos` e `inscripciones_eventos`
import { supabase } from './supabaseClient'

export const eventosService = {
  /**
   * Lista todos los eventos publicados ordenados por fecha
   */
  getEventos: async () => {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('publicado', true)
      .order('fecha_inicio', { ascending: false })
    if (error) throw error
    return data
  },

  /**
   * Obtiene un evento por ID
   */
  getEventoById: async (id) => {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  /**
   * Inscribe a un usuario en un evento
   */
  inscribirUsuario: async (usuarioId, eventoId) => {
    const { data, error } = await supabase
      .from('inscripciones_eventos')
      .insert({ usuario_id: usuarioId, evento_id: eventoId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  /**
   * Verifica si un usuario ya está inscripto en un evento
   */
  verificarInscripcion: async (usuarioId, eventoId) => {
    const { data, error } = await supabase
      .from('inscripciones_eventos')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('evento_id', eventoId)
      .maybeSingle()
    if (error) throw error
    return !!data
  },
}

export default eventosService
