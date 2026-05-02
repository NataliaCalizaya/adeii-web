import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { usuariosService } from '../services/usuariosService'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)          // usuario autenticado
  const [profile, setProfile] = useState(null)    // perfil extendido de la tabla usuarios
  const [loading, setLoading] = useState(true)    // carga inicial de sesión
  const [profileLoading, setProfileLoading] = useState(false) // carga del perfil
  const [asociacion, setAsociacion] = useState(null)

  // Carga el perfil extendido desde la tabla usuarios — retorna el dato
  const loadProfile = async (authUser) => {
    if (!authUser) { setProfile(null); return null }
    setProfileLoading(true)
    try {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle()
      setProfile(data ?? null)
      return data ?? null
    } catch {
      setProfile(null)
      return null
    } finally {
      setProfileLoading(false)
    }
  }

  // Carga datos globales de la asociación
  const loadAsociacion = async () => {
    try {
      const { data } = await supabase.from('asociacion').select('*').single()
      setAsociacion(data)
    } catch {
      setAsociacion(null)
    }
  }

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user ?? null)
      setLoading(false)
    })

    // Listener de cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      loadProfile(session?.user ?? null)
    })

    loadAsociacion()

    return () => subscription.unsubscribe()
  }, [])

  // Login — retorna { authData, profile } para que la página pueda redirigir por rol
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUser(data.user)
    const profileData = await loadProfile(data.user)
    return { authData: data, profile: profileData }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.rol === 'admin'
  const isStudent = profile?.rol === 'estudiante'

  const value = {
    user,
    profile,
    asociacion,
    loading,
    profileLoading,
    isAdmin,
    isStudent,
    login,
    logout,
    loadProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}

export default AppContext
