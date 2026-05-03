const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY en el servidor')
}

// Cliente público para autenticación de usuarios (sin persistir sesión globalmente)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

// Cliente administrador para operaciones que requieren saltar RLS (crear usuarios, admin.deleteUser, etc.)
const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    })
  : null

module.exports = { supabase, supabaseAdmin }
