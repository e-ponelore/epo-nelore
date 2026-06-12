'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { obterClienteNavegador } from '@/lib/supabase-navegador'

interface Props {
  nomeCompleto: string
}

export default function MenuPerfil({ nomeCompleto }: Props) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  async function handleSair() {
    const supabase = obterClienteNavegador()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Iniciais do nome para a bolinha
  const iniciais = nomeCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  const itensMenu = [
    { href: '/perfil?aba=anuncios', icone: '🐄', label: 'Meus Anúncios' },
    { href: '/perfil?aba=plano',    icone: '⭐', label: 'Meu Plano' },
    { href: '/perfil?aba=conta',    icone: '⚙️', label: 'Minha Conta' },
    { href: '/perfil?aba=favoritos',icone: '🤍', label: 'Favoritos' },
  ]

  return (
    <div className="relative" ref={ref}>
      {/* Bolinha com iniciais */}
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-2 group"
        aria-label="Menu do perfil"
      >
        <div className="w-9 h-9 rounded-full bg-verde-claro text-verde-escuro font-bold text-sm flex items-center justify-center select-none ring-2 ring-white group-hover:ring-verde-claro transition-all">
          {iniciais || '?'}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-white/70 transition-transform ${aberto ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {aberto && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Nome */}
          <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Logado como</p>
            <p className="text-sm font-semibold text-texto truncate">{nomeCompleto || 'Criador'}</p>
          </div>

          {itensMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-texto hover:bg-verde-claro/40 transition-colors"
            >
              <span className="text-base leading-none">{item.icone}</span>
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={handleSair}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="text-base leading-none">↩️</span>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
