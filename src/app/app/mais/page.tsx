'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { obterClienteNavegador } from '@/lib/supabase-navegador'

export default function PaginaMais() {
  const router = useRouter()
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeFazenda, setNomeFazenda] = useState('')
  const [email, setEmail] = useState('')
  const [plano, setPlano] = useState('gratuito')
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    async function carregarPerfil() {
      const supabase = obterClienteNavegador()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('perfis')
        .select('nome_completo, nome_fazenda, plano_atual')
        .eq('id', user.id)
        .single()

      if (data) {
        setNomeCompleto(data.nome_completo)
        setNomeFazenda(data.nome_fazenda)
        setPlano(data.plano_atual)
      }
    }
    carregarPerfil()
  }, [])

  async function handleSair() {
    setSaindo(true)
    const supabase = obterClienteNavegador()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const iniciais = nomeCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?'

  const planosLabel: Record<string, string> = {
    gratuito: 'Gratuito',
    avulso:   'Avulso',
    pequeno:  'Pequeno Criador',
    medio:    'Médio Criador',
    grande:   'Grande Criador',
  }

  const itens = [
    { href: '/cadastrar-animal', icone: '🐄', label: 'Cadastrar Animal' },
    { href: '/perfil?aba=conta', icone: '⚙️', label: 'Editar Perfil' },
    { href: '/anunciar',         icone: '⭐', label: 'Ver Planos' },
  ]

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-5">
          <p className="eyebrow text-verde-claro/60">Conta</p>
          <div className="w-9 h-9 rounded-lg overflow-hidden opacity-70 ring-1 ring-white/10">
            <Image src="/logo.png.jpeg" alt="e-PO Nelore" width={36} height={36} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-xl bg-verde-claro text-verde-escuro font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-verde-claro/20">
            {iniciais}
          </div>
          <div className="min-w-0">
            <p className="font-serif font-bold text-xl leading-tight truncate text-white">
              {nomeCompleto || 'Minha Conta'}
            </p>
            {nomeFazenda && (
              <p className="text-verde-claro/70 text-sm truncate">{nomeFazenda}</p>
            )}
            <p className="text-white/35 text-xs mt-0.5 truncate">{email}</p>
          </div>
        </div>
        <div className="linha-lime mt-5" />
      </div>

      <div className="px-4 pt-1 pb-5 space-y-2.5">
        {/* Plano */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="eyebrow text-white/35 mb-1">Plano atual</p>
            <p className="font-bold text-white text-lg">{planosLabel[plano] ?? plano}</p>
          </div>
          <Link
            href="/anunciar"
            className="text-[11px] font-black uppercase tracking-wider text-verde-escuro bg-verde-claro px-3.5 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Upgrade
          </Link>
        </div>

        {/* Links */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/8">
          {itens.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icone}</span>
                <span className="font-semibold text-white/90 text-sm">{item.label}</span>
              </div>
              <span className="text-white/25 text-lg">›</span>
            </Link>
          ))}
        </div>

        {/* Sair */}
        <button
          onClick={handleSair}
          disabled={saindo}
          className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-4 flex items-center gap-3 text-red-300 hover:bg-red-500/15 transition-colors disabled:opacity-60"
        >
          <span className="text-lg">↩️</span>
          <span className="font-bold text-sm uppercase tracking-wide">
            {saindo ? 'Saindo...' : 'Sair da conta'}
          </span>
        </button>

        <p className="text-center text-white/20 text-[10px] uppercase tracking-widest pt-4">
          e-PO Nelore · Puro de Origem
        </p>
      </div>
    </div>
  )
}
