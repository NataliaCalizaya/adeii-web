import { supabase, isDemoMode } from './supabaseClient'
import { MOCK_CERTIFICADO } from '../data/mockData'

export const certificadosService = {
  validarCertificado: async (codigo) => {
    if (isDemoMode) {
      if (codigo.trim().toUpperCase() === 'DEMO-2024-001') return MOCK_CERTIFICADO
      return null
    }
    const { data, error } = await supabase
      .from('certificados')
      .select('*, eventos(titulo), usuarios(nombre, apellido)')
      .eq('codigo_validacion', codigo)
      .maybeSingle()
    if (error) throw error
    return data
  },

  getCertificadosUsuario: async (usuarioId) => {
    if (isDemoMode) return []
    const { data, error } = await supabase
      .from('certificados')
      .select('*, talleres(nombre)')
      .eq('usuario_id', usuarioId)
      .order('fecha_emision', { ascending: false })
    if (error) throw error
    return data ?? []
  },
}

export default certificadosService

