'use client'

import { useState } from 'react'

interface Props {
  nome: string
  valor: number
  descricao: string
}

export default function TooltipDEP({ nome, valor, descricao }: Props) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="relative inline-flex items-center gap-1">
      <div>
        <span className="text-gray-500 text-sm">{nome}</span>
        <span className="font-semibold text-texto ml-2">{valor > 0 ? `+${valor}` : valor}</span>
      </div>
      <button
        type="button"
        onMouseEnter={() => setAberto(true)}
        onMouseLeave={() => setAberto(false)}
        onFocus={() => setAberto(true)}
        onBlur={() => setAberto(false)}
        onClick={() => setAberto(!aberto)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-verde-claro hover:text-verde-escuro transition-colors"
        aria-label={`O que é ${nome}?`}
      >
        ?
      </button>
      {aberto && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-texto text-white text-xs rounded-lg p-3 shadow-lg z-10">
          <p className="font-semibold mb-1">{nome}</p>
          <p className="text-white/80 leading-relaxed">{descricao}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-texto" />
        </div>
      )}
    </div>
  )
}
