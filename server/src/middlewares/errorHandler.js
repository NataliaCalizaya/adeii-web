/**
 * Middleware de manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message)
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Error interno del servidor',
  })
}

/**
 * Middleware para loggear requests entrantes
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
}

module.exports = { errorHandler, requestLogger }
