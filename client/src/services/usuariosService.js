// Servicios para `usuarios` y `plan_estudio`
import { supabase } from './supabaseClient'

export const usuariosService = {
  /**
   * Obtiene el perfil de un usuario por ID con carreras
   */
  getUsuario: async (id) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id, nombre, apellido, email, lu, fecha_inscripcion, foto_perfil, rol,
        cargo, periodo, en_comision, estado, activo,
        carrera_principal:carreras!usuarios_carrera_principal_id_fkey ( id, nombre, codigo ),
        carrera_secundaria:carreras!usuarios_carrera_secundaria_id_fkey ( id, nombre, codigo )
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  /**
   * Lista los miembros de la comisión directiva
   */
  getComision: async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, cargo, periodo, foto_perfil, orden')
      .eq('en_comision', true)
      .eq('activo', true)
      .order('orden', { ascending: true, nullsFirst: false })
    if (error) throw error
    return data
  },

  /**
   * Registra un nuevo usuario
   */
  registrarUsuario: async ({ nombre, apellido, email, passwordHash, lu, carreraPrincipalId }) => {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre,
        apellido,
        email,
        password_hash: passwordHash,
        lu,
        carrera_principal_id: carreraPrincipalId || null,
        rol: 'estudiante',
      })
      .select()
      .single()
    if (error) throw error
    return data
  },
}

export const planEstudioService = {
  /**
   * Obtiene el plan de estudio de un usuario con materias
   */
  getPlanEstudio: async (usuarioId) => {
    const { data, error } = await supabase
      .from('plan_estudio')
      .select(`
        id, estado, nota_final, fecha_aprobacion, porcentaje_avance,
        materias ( id, nombre, codigo, anio, cuatrimestre )
      `)
      .eq('usuario_id', usuarioId)
      .order('materias(anio)', { ascending: true })
    if (error) throw error
    return data
  },

  /**
   * Actualiza el estado de una materia en el plan de estudio
   */
  actualizarEstadoMateria: async (planId, estado, notaFinal = null) => {
    const updates = { estado }
    if (estado === 'aprobada') {
      updates.nota_final = notaFinal
      updates.fecha_aprobacion = new Date().toISOString().split('T')[0]
      updates.porcentaje_avance = 100
    }
    const { data, error } = await supabase
      .from('plan_estudio')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
