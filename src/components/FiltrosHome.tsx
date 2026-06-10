'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ESTADOS_BR } from '@/types'

interface Props {
  sexoAtual: string
  categoriaAtual: string
  estadoAtual: string
  buscaAtual: string
}

export default function FiltrosHome({
  sexoAtual,
  categoriaAtual,
  estadoAtual,
  buscaAtual,
}: Props) {
  const router = useRouter()
  const [busca, setBusca] = useState(buscaAtual)

  function aplicarFiltro(chave: string, valor: string) {
    const params = new URLSearchParams(window.location.search)
    if (valor) params.set(chave, valor)
    else params.delete(chave)
    router.push(`/?${params.toString()}`)
  }

  function submeterBusca(e: React.FormEvent) {
    e.preventDefault()
    aplicarFiltro('busca', busca)
  }

  return (
    <form
      onSubmit={submeterBusca}
      className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 flex-wrap"
    >
      <div className="flex flex-1 min-w-56 gap-2">
        <input
          type="text"
          placeholder="Buscar por nome ou fazenda..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
        />
        <button
          type="submit"
          className="bg-verde-escuro text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-verde-escuro/90 transition-colors"
        >
          Buscar
        </button>
      </div>

      <select
        value={sexoAtual}
        onChange={(e) => aplicarFiltro('sexo', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-texto focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
      >
        <option value="">Todos os sexos</option>
        <option value="Macho">Macho</option>
        <option value="Fêmea">Fêmea</option>
      </select>

      <select
        value={categoriaAtual}
        onChange={(e) => aplicarFiltro('categoria', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-texto focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
      >
        <option value="">Todas as categorias</option>
        <option value="Reprodutor">Reprodutor</option>
        <option value="Matriz">Matriz</option>
        <option value="Bezerro">Bezerro</option>
        <option value="Novilha">Novilha</option>
      </select>

      <select
        value={estadoAtual}
        onChange={(e) => aplicarFiltro('estado', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-texto focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
      >
        <option value="">Todos os estados</option>
        {ESTADOS_BR.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </select>

      {(sexoAtual || categoriaAtual || estadoAtual || buscaAtual) && (
        <button
          type="button"
          onClick={() => {
            setBusca('')
            router.push('/')
          }}
          className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </form>
  )
}
