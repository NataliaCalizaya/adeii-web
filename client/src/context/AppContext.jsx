import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isDemoMode } from '../services/supabaseClient'
import { MOCK_ASOCIACION, MOCK_USUARIOS } from '../data/mockData'

const AppContext = createContext(null)

// Credenciales demo para GitHub Pages (sin Supabase)
const DEMO_PROFILES = {
  'admin@adeii.com':      { ...MOCK_USUARIOS[0], password: 'admin123' },
  'estudiante@adeii.com': { ...MOCK_USUARIOS[1], password: 'est123' },
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [asociacion, setAsociacion] = useState(null)

  useEffect(() => {
    if (isDemoMode) {
      // Restaurar sesión demo desde sessionStorage
      const saved = sessionStorage.getItem('adeii-demo-user')
      if (saved) {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        setProfile(parsed.profile)
      }
      setAsociacion(MOCK_ASOCIACION)
      setLoading(false)
      return
    }

    // Modo real (Supabase)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      loadProfile(session?.user ?? null)
    })

    loadAsociacionReal()
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (authUser) => {
    if (!authUser) { setProfile(null); return null }
    setProfileLoading(true)
    try {
      const { data } = await supabase
        .from('usuarios').select('*').eq('email', authUser.email).maybeSingle()
      setProfile(data ?? null)
      return data ?? null
    } catch {
      setProfile(null)
      return null
    } finally {
      setProfileLoading(false)
    }
  }

  const loadAsociacionReal = async () => {
    try {
      const { data } = await supabase.from('asociacion').select('*').single()
      setAsociacion(data)
    } catch {
      setAsociacion(MOCK_ASOCIACION)
    }
  }

  const login = async (email, password) => {
    if (isDemoMode) {
      const demoProfile = DEMO_PROFILES[email.toLowerCase()]
      if (!demoProfile || demoProfile.password !== password) {
        throw new Error('Invalid login credentials')
      }
      const demoUser = { id: demoProfile.id, email: demoProfile.email }
      setUser(demoUser)
      setProfile(demoProfile)
      sessionStorage.setItem('adeii-demo-user', JSON.stringify({ user: demoUser, profile: demoProfile }))
      return { authData: { user: demoUser }, profile: demoProfile }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUser(data.user)
    const profileData = await loadProfile(data.user)
    return { authData: data, profile: profileData }
  }

  const logout = async () => {
    if (isDemoMode) {
      sessionStorage.removeItem('adeii-demo-user')
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.rol === 'admin'
  const isStudent = profile?.rol === 'estudiante'

  const value = {
    user, profile, asociacion,
    loading, profileLoading,
    isAdmin, isStudent,
    login, logout, loadProfile,
    isDemoMode,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}

export default AppContext
