import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
}

// persistSession: true → guarda el token en localStorage (sobrevive al reload)
// storageKey: clave única para este proyecto en el navegador
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'adeii-web-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// =========================================================
// EJEMPLOS DE QUERIES — Basados en tablas reales de Supabase
// =========================================================

// SELECT: Obtener datos de la asociación
// const { data, error } = await supabase.from('asociacion').select('*').single()

// SELECT con JOIN: Documentos con carrera y materia
// const { data } = await supabase
//   .from('documentos')
//   .select('*, carreras(nombre), materias(nombre), usuarios(nombre, apellido)')
//   .eq('estado', 'aprobado')

// INSERT: Inscribir usuario a evento
// const { data, error } = await supabase
//   .from('inscripciones_eventos')
//   .insert({ usuario_id: 1, evento_id: 5 })

// UPLOAD PDF a Supabase Storage:
// const { data, error } = await supabase.storage
//   .from('documentos')   // nombre del bucket en Storage
//   .upload(`carreras/${carreraId}/${fileName}`, file, { contentType: 'application/pdf' })
//
// URL pública del PDF:
// const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(path)

export default supabase
