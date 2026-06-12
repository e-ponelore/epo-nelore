import Image from 'next/image'

interface Props {
  eyebrow?: string
  titulo: string
  subtitulo?: string
}

export default function AppHeader({ eyebrow = 'e-PO Nelore', titulo, subtitulo }: Props) {
  return (
    <div className="px-5 pt-12 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-verde-claro/60">{eyebrow}</p>
          <h1 className="font-serif text-3xl font-bold text-white leading-tight mt-1">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-white/40 text-sm mt-1.5">{subtitulo}</p>
          )}
        </div>

        {/* Logo chip */}
        <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/10 opacity-70 flex-shrink-0">
          <Image
            src="/logo.png.jpeg"
            alt="e-PO Nelore"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Linha de acento */}
      <div className="linha-lime mt-4" />
    </div>
  )
}
