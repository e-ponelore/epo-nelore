export default function CarregandoAnuncios() {
  return (
    <div className="min-h-full">
      {/* Header skeleton */}
      <div className="px-5 pt-12 pb-5">
        <div className="skeleton h-3 w-28 rounded mb-2" />
        <div className="skeleton h-8 w-44 rounded-lg mb-2" />
        <div className="skeleton h-4 w-40 rounded" />
        <div className="linha-lime mt-4" />
      </div>

      <div className="px-4 pt-2 pb-5 space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="skeleton w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
            <div className="skeleton h-6 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
