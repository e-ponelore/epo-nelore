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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      <div className="relative h-52 bg-gray-100">
        {fotoUrl ? (
          <Image
            src={fotoUrl}
            alt={animal.nome_animal}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Sem foto</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-1.5">
          {animal.destaque && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              Destaque
            </span>
          )}
          <span className="bg-verde-claro text-verde-escuro text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            P.O.
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-lg text-texto leading-tight">
          {animal.nome_animal}
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          {animal.categoria} · {animal.sexo}
          {animal.peso_kg ? ` · ${animal.peso_kg} kg` : ''}
        </p>

        {animal.criadores?.estado && (
          <p className="text-gray-400 text-xs mt-0.5">
            {animal.criadores.nome_fazenda} — {animal.criadores.estado}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            href={`/animal/${animal.id}`}
            className="block text-center bg-verde-escuro text-white text-sm font-semibold py-2 rounded-lg hover:bg-verde-escuro/90 transition-colors"
          >
            Ver ficha completa
          </Link>
        </div>
      </div>
    </div>
  )
}
