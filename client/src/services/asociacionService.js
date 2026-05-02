import { supabase, isDemoMode } from './supabaseClient'
import { MOCK_ASOCIACION } from '../data/mockData'

export const asociacionService = {
  getAsociacion: async () => {
    if (isDemoMode) return MOCK_ASOCIACION
    const { data, error } = await supabase.from('asociacion').select('*').single()
    if (error) throw error
    return data
  },

  getRedesSociales: async () => {
    if (isDemoMode) return []
    const { data, error } = await supabase
      .from('redes_sociales').select('*').eq('activo', true)
    if (error) throw error
    return data
  },
}

export default asociacionService
