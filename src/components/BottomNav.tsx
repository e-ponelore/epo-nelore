'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const abas = [
  {
    href: '/app/vitrine',
    label: 'Vitrine',
    icone: (ativo: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ativo ? 2.4 : 1.8} className="w-[22px] h-[22px]">
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/app/anuncios',
    label: 'Anúncios',
    icone: (ativo: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ativo ? 2.4 : 1.8} className="w-[22px] h-[22px]">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/app/mais',
    label: 'Mais',
    icone: (ativo: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ativo ? 2.4 : 1.8} className="w-[22px] h-[22px]">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-verde-escuro/90 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-lg mx-auto flex items-stretch">
        {abas.map((aba) => {
          const ativo = pathname.startsWith(aba.href)
          return (
            <Link
              key={aba.href}
              href={aba.href}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3.5 transition-colors duration-200 ${
                ativo ? 'text-verde-claro' : 'text-white/35 hover:text-white/60'
              }`}
            >
              {/* Indicador superior */}
              <span
                className={`absolute top-0 h-0.5 rounded-full bg-verde-claro transition-all duration-300 ${
                  ativo ? 'w-8 opacity-100' : 'w-0 opacity-0'
                }`}
              />
              {aba.icone(ativo)}
              <span className={`eyebrow tracking-wider ${ativo ? 'text-verde-claro' : 'text-white/35'}`}>
                {aba.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
