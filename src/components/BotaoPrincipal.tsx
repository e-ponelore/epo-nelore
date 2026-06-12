'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BotaoPrincipal() {
  const [jaCadastrado, setJaCadastrado] = useState<boolean | null>(null)

  useEffect(() => {
    const flag = localStorage.getItem('epo_ja_cadastrado')
    setJaCadastrado(flag === 'true')
  }, [])

  // Enquanto lê o localStorage, não renderiza nada (evita flash)
  if (jaCadastrado === null) {
    return <div className="h-32" />
  }

  if (jaCadastrado) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <Link
          href="/login"
          className="w-full bg-verde-claro text-verde-escuro font-black uppercase tracking-wider py-4 rounded-lg text-sm text-center hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-verde-claro/30"
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
        >
          Não tem conta? <span className="underline underline-offset-2">Cadastre-se</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Link
        href="/cadastro"
        className="w-full bg-verde-claro text-verde-escuro font-black uppercase tracking-wider py-4 rounded-lg text-sm text-center hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-verde-claro/30"
      >
        Criar conta grátis
      </Link>
      <Link
        href="/login"
        className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
      >
        Já tem conta? <span className="underline underline-offset-2">Entrar</span>
      </Link>
    </div>
  )
}
