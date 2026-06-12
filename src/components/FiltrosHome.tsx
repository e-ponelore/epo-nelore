'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { ESTADOS_BR } from '@/types'

interface Props {
  sexoAtual: string
  categoriaAtual: string
  estadoAtual: string
  buscaAtual: string
}

const selectCls =
  'bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-xs font-semibold text-white/80 focus:outline-none focus:ring-1 focus:ring-verde-claro focus:border-verde-claro transition-all duration-200 [&>option]:text-texto'

export default function FiltrosHome({ sexoAtual, categoriaAtual, estadoAtual, buscaAtual }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [busca, setBusca] = useState(buscaAtual)

  function aplicarFiltro(chave: string, valor: string) {
    const params = new URLSearchParams(window.location.search)
    if (valor) params.set(chave, valor)
    else params.delete(chave)
    router.push(`${pathname}?${params.toString()}`)
  }

  function submeterBusca(e: React.FormEvent) {
    e.preventDefault()
    aplicarFiltro('busca', busca)
  }

  const temFiltro = sexoAtual || categoriaAtual || estadoAtual || buscaAtual

  return (
    <form onSubmit={submeterBusca} className="flex flex-col gap-2.5">
      {/* Busca */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nome ou fazenda..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 bg-white/5 border border-white/12 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-verde-claro focus:border-verde-claro transition-all duration-200"
        />
        <button
          type="submit"
          className="bg-verde-claro text-verde-escuro px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          Buscar
        </button>
      </div>

      {/* Chips de filtro */}
      <div className="flex gap-2 flex-wrap">
        <select value={sexoAtual} onChange={(e) => aplicarFiltro('sexo', e.target.value)} className={selectCls}>
          <option value="">Sexo</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>

        <select value={categoriaAtual} onChange={(e) => aplicarFiltro('categoria', e.target.value)} className={selectCls}>
          <option value="">Categoria</option>
          <option value="Reprodutor">Reprodutor</option>
          <option value="Matriz">Matriz</option>
          <option value="Bezerro">Bezerro</option>
          <option value="Novilha">Novilha</option>
        </select>

        <select value={estadoAtual} onChange={(e) => aplicarFiltro('estado', e.target.value)} className={selectCls}>
          <option value="">UF</option>
          {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
        </select>

        {temFiltro && (
          <button
            type="button"
            onClick={() => { setBusca(''); router.push(pathname) }}
            className="text-[11px] text-white/40 hover:text-verde-claro underline underline-offset-2 transition-colors px-1 font-semibold"
          >
            Limpar
          </button>
        )}
      </div>
    </form>
  )
}
