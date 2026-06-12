export default function CarregandoVitrine() {
  return (
    <div className="min-h-full">
      {/* Header skeleton */}
      <div className="px-5 pt-12 pb-5">
        <div className="skeleton h-3 w-20 rounded mb-2" />
        <div className="skeleton h-8 w-28 rounded-lg mb-2" />
        <div className="skeleton h-4 w-52 rounded" />
        <div className="linha-lime mt-4" />
      </div>

      <div className="px-4 pt-2 pb-5">
        {/* Filtros skeleton */}
        <div className="skeleton h-11 w-full rounded-lg mb-2.5" />
        <div className="flex gap-2 mb-5">
          <div className="skeleton h-8 w-20 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-8 w-14 rounded-lg" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="skeleton h-40" />
              <div className="p-3 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-8 w-full rounded-lg mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
