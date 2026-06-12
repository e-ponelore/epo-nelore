import Image from 'next/image'
import Link from 'next/link'
import type { Animal } from '@/types'

interface Props {
  animal: Animal & {
    criadores?: { nome_fazenda: string; estado: string } | null
  }
}

export default function CardAnimal({ animal }: Props) {
  const fotoUrl = animal.fotos?.[0]

  return (
    <Link
      href={`/animal/${animal.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-black/5 shadow-lg shadow-black/25 hover:shadow-xl hover:-translate-y-1 active:scale-[0.97] transition-all duration-300 flex flex-col"
    >
      {/* Foto */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={animal.nome_animal}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-verde-escuro/5 to-verde-escuro/10">
            <span className="text-3xl mb-1">🐄</span>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Sem foto</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {animal.destaque && (
            <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide">
              ★ DESTAQUE
            </span>
          )}
          <span className="bg-verde-escuro text-verde-claro text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide flex items-center gap-1">
            ✦ P.O. CERTIFICADO
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-sm text-texto leading-tight line-clamp-1">
          {animal.nome_animal}
        </h3>

        <p className="text-gray-400 text-[11px] mt-1 flex items-center gap-1.5 flex-wrap">
          <span>{animal.categoria}</span>
          <span className="text-gray-200">·</span>
          <span>{animal.sexo}</span>
        </p>

        {animal.peso_kg ? (
          <p className="mt-1.5 text-texto">
            <span className="font-black text-base tabular-nums">{animal.peso_kg}</span>
            <span className="text-gray-400 text-[10px] font-bold ml-0.5 uppercase">kg</span>
          </p>
        ) : null}

        {animal.criadores?.estado && (
          <p className="text-gray-300 text-[10px] mt-0.5 truncate uppercase tracking-wide">
            {animal.criadores.nome_fazenda} · {animal.criadores.estado}
          </p>
        )}

        <div className="mt-auto pt-3">
          <div className="text-center bg-verde-escuro text-verde-claro text-[11px] font-black uppercase tracking-wider py-2 rounded-lg group-hover:brightness-110 transition-all duration-200">
            Ver ficha →
          </div>
        </div>
      </div>
    </Link>
  )
}
