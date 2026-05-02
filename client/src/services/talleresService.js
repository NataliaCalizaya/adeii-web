import { supabase, isDemoMode } from './supabaseClient'

export const talleresService = {
  getTalleres: async () => {
    if (isDemoMode) return []
    const { data, error } = await supabase
      .from('talleres')
      .select('*')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: false })
    if (error) throw error
    return data
  },

  inscribirUsuario: async () => {
    if (isDemoMode) return { id: 'demo' }
    // (modo real — no usado en branch-1)
  },
}

export default talleresService
