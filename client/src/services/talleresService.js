// Servicios para `talleres`, `inscripciones_talleres` y `certificados`
import { supabase } from './supabaseClient'

export const talleresService = {
  /**
   * Lista talleres activos
   */
  getTalleres: async () => {
    const { data, error } = await supabase
      .from('talleres')
      .select('*')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: false })
    if (error) throw error
    return data
  },

  /**
   * Inscribe usuario a un taller
   */
  inscribirUsuario: async (usuarioId, tallerId) => {
    const { data, error } = await supabase
      .from('inscripciones_talleres')
      .insert({ usuario_id: usuarioId, taller_id: tallerId })
      .select()
      .single()
    if (error) throw error
    return data
  },
}

export const certificadosService = {
  /**
   * Valida un certificado por código único
   */
  validarCertificado: async (codigoValidacion) => {
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        id, codigo_validacion, fecha_emision, archivo_url,
        usuarios!certificados_usuario_id_fkey ( nombre, apellido ),
        talleres ( nombre )
      `)
      .eq('codigo_validacion', codigoValidacion)
      .maybeSingle()
    if (error) throw error
    return data
  },

  /**
   * Obtiene los certificados de un usuario
   */
  getCertificadosUsuario: async (usuarioId) => {
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        id, codigo_validacion, fecha_emision, archivo_url,
        talleres ( nombre, descripcion )
      `)
      .eq('usuario_id', usuarioId)
    if (error) throw error
    return data
  },
}
