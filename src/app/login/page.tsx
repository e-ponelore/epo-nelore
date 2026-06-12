'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { obterClienteNavegador } from '@/lib/supabase-navegador'

const inputCls =
  'w-full bg-white border border-black/10 rounded-lg px-4 py-3.5 text-sm text-texto placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-verde-claro focus:border-verde-claro transition-all duration-200'

const labelCls = 'block text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-2'

function FormularioLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirecionar = searchParams.get('redirecionar') ?? '/app/anuncios'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = obterClienteNavegador()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setErro('Confirme seu e-mail antes de entrar.')
      } else if (error.message.includes('Invalid login credentials')) {
        setErro('E-mail ou senha incorretos.')
      } else {
        setErro(error.message)
      }
      setCarregando(false)
      return
    }

    // Marca que este navegador já teve uma conta
    localStorage.setItem('epo_ja_cadastrado', 'true')

    router.push(redirecionar)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-verde-escuro flex flex-col items-center justify-center px-6 py-12 relative">
      <div className="tech-grid pointer-events-none fixed inset-0" />
      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-10">
          <div className="logo-glow w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-verde-claro/20">
            <Image
              src="/logo.png.jpeg"
              alt="e-PO Nelore"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-serif text-xl font-bold text-white tracking-tight">
            e-PO Nelore
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <h2 className="font-serif text-2xl font-bold text-texto mb-1">
            Acessar minha conta
          </h2>
          <p className="text-gray-400 text-sm mb-7">
            Bem-vindo de volta ao seu painel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputCls}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className={labelCls}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className={inputCls}
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-verde-escuro text-verde-claro font-black uppercase tracking-wider text-sm py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-verde-escuro/20"
            >
              {carregando ? 'Verificando...' : 'Acessar minha conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Não tem conta?{' '}
            <Link href="/cadastro" className="font-bold text-verde-escuro hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-white/30 hover:text-white/60 text-xs mt-6 transition-colors duration-200"
        >
          ← Voltar
        </Link>
      </div>
    </div>
  )
}

export default function PaginaLogin() {
  return (
    <Suspense>
      <FormularioLogin />
    </Suspense>
  )
}
