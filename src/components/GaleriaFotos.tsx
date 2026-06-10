import Image from 'next/image'

interface Props {
  fotos: string[]
  nome: string
}

export default function GaleriaFotos({ fotos, nome }: Props) {
  if (!fotos?.length) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-3"
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
        <p className="text-sm">Sem fotos disponíveis</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory">
      {fotos.map((url, i) => (
        <div
          key={i}
          className="relative flex-none w-full sm:w-[480px] h-72 rounded-2xl overflow-hidden snap-start"
        >
          <Image
            src={url}
            alt={`${nome} — foto ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 480px"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}
