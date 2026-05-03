const { supabase, supabaseAdmin } = require('../database/supabase')

/**
 * POST /api/auth/login
 * Autentica con Supabase Auth y devuelve el perfil con rol
 */
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email y contraseña son requeridos.' })
  }

  try {
    // 1. Autenticar contra Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' })
    }

    const authUser = authData.user

    // 2. Buscar el perfil en la tabla usuarios para obtener el rol
    // Usamos supabaseAdmin para garantizar la lectura saltando políticas RLS si aplican
    if (!supabaseAdmin) {
      return res.status(500).json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.' })
    }

    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre, apellido, email, lu, rol, estado, activo, foto_perfil, carrera_principal_id, carrera_secundaria_id')
      .eq('email', authUser.email)
      .maybeSingle()

    if (perfilError) {
      return res.status(500).json({ ok: false, error: 'Error al buscar el perfil del usuario.' })
    }

    if (!perfil) {
      return res.status(404).json({
        ok: false,
        error: 'Usuario autenticado pero sin perfil en la base de datos. Contactá al administrador.',
      })
    }

    // 3. Verificar que el usuario esté activo
    if (!perfil.activo || perfil.estado !== 'activo') {
      return res.status(403).json({
        ok: false,
        error: 'Tu cuenta está suspendida. Contactá al administrador.',
      })
    }

    // 4. Verificar que el rol sea válido
    const rolesValidos = ['admin', 'estudiante']
    if (!rolesValidos.includes(perfil.rol)) {
      return res.status(403).json({ ok: false, error: 'Rol de usuario no reconocido.' })
    }

    // 5. Responder con el session token y el perfil completo
    return res.json({
      ok: true,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
      user: {
        id: authUser.id,
        email: authUser.email,
      },
      perfil: {
        ...perfil,
        // rol puede ser 'admin' o 'estudiante' — el frontend redirige según esto
        esAdmin: perfil.rol === 'admin',
        esEstudiante: perfil.rol === 'estudiante',
      },
    })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

/**
 * POST /api/auth/register
 * Crea un nuevo usuario en Supabase Auth + inserta el perfil en la tabla usuarios
 * Rol por defecto: 'estudiante'
 */
const register = async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    password,
    lu,
    fecha_inscripcion,
    carrera_principal_id,
    carrera_secundaria_id,
    foto_perfil,
  } = req.body

  // Validaciones básicas
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({
      ok: false,
      error: 'Nombre, apellido, email y contraseña son obligatorios.',
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      ok: false,
      error: 'La contraseña debe tener al menos 6 caracteres.',
    })
  }

  try {
    // 1. Crear usuario en Supabase Auth
    if (!supabaseAdmin) {
      return res.status(500).json({ ok: false, error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.' })
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirmar automáticamente sin necesitar email
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ ok: false, error: 'Ya existe una cuenta con ese email.' })
      }
      return res.status(400).json({ ok: false, error: authError.message })
    }

    const authUserId = authData.user.id

    // 2. Actualizar perfil en la tabla usuarios (el trigger de la DB ya creó la fila vacía)
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .update({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        lu: lu?.trim() || null,
        fecha_inscripcion: fecha_inscripcion || null,
        carrera_principal_id: carrera_principal_id || null,
        carrera_secundaria_id: carrera_secundaria_id || null,
        foto_perfil: foto_perfil || null,
        rol: 'estudiante',        // siempre estudiante en registro público
        estado: 'activo',
        activo: true
      })
      .eq('id', authUserId)
      .select()
      .single()

    if (perfilError) {
      // Si falla la inserción del perfil, eliminar el usuario de Auth para no dejar inconsistencias
      await supabaseAdmin.auth.admin.deleteUser(authUserId)
      return res.status(500).json({ ok: false, error: 'Error al crear el perfil: ' + perfilError.message })
    }

    return res.status(201).json({
      ok: true,
      message: 'Cuenta creada exitosamente.',
      perfil,
    })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}

module.exports = { login, register }
