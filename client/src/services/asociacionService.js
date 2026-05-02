// Servicios para la tabla `asociacion`
import { supabase } from './supabaseClient'

export const asociacionService = {
  /**
   * Obtiene los datos principales de la asociación (único registro)
   */
  getAsociacion: async () => {
    const { data, error } = await supabase
      .from('asociacion')
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  /**
   * Obtiene las redes sociales activas de la asociación
   */
  getRedesSociales: async (asociacionId) => {
    const { data, error } = await supabase
      .from('redes_sociales')
      .select('*')
      .eq('asociacion_id', asociacionId)
      .eq('activo', true)
    if (error) throw error
    return data
  },
}

export default asociacionService
