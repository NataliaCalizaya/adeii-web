import { supabase, isDemoMode } from './supabaseClient'
import { MOCK_USUARIOS, MOCK_PLAN_ESTUDIO } from '../data/mockData'

const MOCK_COMISION = [
  { id: '1', nombre: 'Valeria', apellido: 'Torres', cargo: 'Presidenta', periodo: '2024', foto_perfil: null },
  { id: '2', nombre: 'Diego', apellido: 'Martínez', cargo: 'Secretario', periodo: '2024', foto_perfil: null },
  { id: '3', nombre: 'Camila', apellido: 'Ruiz', cargo: 'Tesorera', periodo: '2024', foto_perfil: null },
]

export const usuariosService = {
  getUsuario: async (id) => {
    if (isDemoMode) return MOCK_USUARIOS.find(u => u.id === id) ?? MOCK_USUARIOS[1]
    const { data, error } = await supabase
      .from('usuarios')
      .select(`id, nombre, apellido, email, lu, fecha_inscripcion, foto_perfil, rol,
        cargo, periodo, en_comision, estado, activo,
        carrera_principal:carreras!usuarios_carrera_principal_id_fkey ( id, nombre, codigo ),
        carrera_secundaria:carreras!usuarios_carrera_secundaria_id_fkey ( id, nombre, codigo )`)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  getPlanEstudio: async (usuarioId) => {
    if (isDemoMode) return MOCK_PLAN_ESTUDIO
    const { data, error } = await supabase
      .from('plan_estudio')
      .select('*, materia:materias(*)')
      .eq('usuario_id', usuarioId)
    if (error) throw error
    return data
  },

  getAllUsuarios: async () => {
    if (isDemoMode) return MOCK_USUARIOS
    const { data, error } = await supabase
      .from('usuarios').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  getComision: async () => {
    if (isDemoMode) return MOCK_COMISION
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, cargo, periodo, foto_perfil')
      .eq('en_comision', true)
      .eq('activo', true)
      .order('orden', { ascending: true })
    if (error) throw error
    return data ?? []
  },
}

export default usuariosService
