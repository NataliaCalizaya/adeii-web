/**
 * Componente para mostrar un error de carga de datos
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2 font-public-sans">
        Error al cargar datos
      </h3>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
        {message ?? 'Ocurrió un error inesperado. Por favor, intentá de nuevo.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Reintentar
        </button>
      )}
    </div>
  )
}
