'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { obterClienteNavegador } from '@/lib/supabase-navegador'

function FormularioLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirecionar = searchParams.get('redirecionar') ?? '/perfil'

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
        setErro('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.')
      } else if (error.message.includes('Invalid login credentials')) {
        setErro('E-mail ou senha incorretos.')
      } else {
        setErro(error.message)
      }
      setCarregando(false)
      return
    }

    router.push(redirecionar)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bege flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-verde-escuro">
              e-PO Nelore
            </h1>
            <p className="text-sm text-gray-500 mt-1">Vitrine de Nelore Puro de Origem</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-serif text-2xl font-bold text-texto mb-1">
            Entrar na conta
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Acesse seu painel de criador
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30 focus:border-verde-escuro transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30 focus:border-verde-escuro transition-colors"
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3 border border-red-100">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-verde-escuro text-white font-semibold py-3 rounded-xl hover:bg-verde-escuro/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link
              href="/cadastro"
              className="text-verde-escuro font-semibold hover:underline"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-verde-escuro transition-colors">
            ← Voltar para a vitrine
          </Link>
        </p>
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
