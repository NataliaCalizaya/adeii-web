/**
 * Componente de carga de skeleton (shimmer)
 * Usado mientras se obtienen datos de Supabase
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="skeleton h-4 w-3/4 rounded mb-3" />
      <div className="skeleton h-3 w-full rounded mb-2" />
      <div className="skeleton h-3 w-5/6 rounded mb-2" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export default SkeletonCard
