const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { errorHandler, requestLogger } = require('./src/middlewares/errorHandler')
const asociacionRoutes = require('./src/routes/asociacion')
const eventosRoutes = require('./src/routes/eventos')
const documentosRoutes = require('./src/routes/documentos')
const talleresRoutes = require('./src/routes/talleres')
const usuariosRoutes = require('./src/routes/usuarios')

const app = express()

// ============================
// Middlewares globales
// ============================
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(requestLogger)

// ============================
// Health check
// ============================
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'ADEII API corriendo', timestamp: new Date().toISOString() })
})

// ============================
// Rutas de la API
// ============================
app.use('/api/asociacion', asociacionRoutes)
app.use('/api/eventos', eventosRoutes)
app.use('/api', documentosRoutes)         // /api/documentos, /api/carreras, /api/materias
app.use('/api', talleresRoutes)           // /api/talleres, /api/certificados
app.use('/api/usuarios', usuariosRoutes)

// ============================
// 404 handler
// ============================
app.use((req, res) => {
  res.status(404).json({ ok: false, error: `Ruta no encontrada: ${req.method} ${req.path}` })
})

// ============================
// Error handler
// ============================
app.use(errorHandler)

module.exports = app
