'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { ESTADOS_BR } from '@/types'

const inputCls =
  'w-full bg-white border border-black/10 rounded-lg px-4 py-3.5 text-sm text-texto placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-verde-claro focus:border-verde-claro transition-all duration-200'
const labelCls = 'block text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-2'

export default function PaginaCadastro() {
  const router = useRouter()

  const [nomeCompleto, setNomeCompleto]     = useState('')
  const [nomeFazenda, setNomeFazenda]       = useState('')
  const [estado, setEstado]                 = useState('')
  const [cidade, setCidade]                 = useState('')
  const [telefone, setTelefone]             = useState('')
  const [whatsapp, setWhatsapp]             = useState('')
  const [email, setEmail]                   = useState('')
  const [senha, setSenha]                   = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando]         = useState(false)
  const [erro, setErro]                     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)
    const supabase = obterClienteNavegador()

    const { data: authData, error: authErro } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (authErro) {
      setErro(
        authErro.message.includes('already registered')
          ? 'Este e-mail já está cadastrado. Tente fazer login.'
          : 'Erro ao criar conta: ' + authErro.message,
      )
      setCarregando(false)
      return
    }

    const userId = authData.user?.id
    if (!userId) {
      setErro('Erro inesperado. Tente novamente.')
      setCarregando(false)
      return
    }

    const { data: criador, error: criadorErro } = await supabase
      .from('criadores')
      .insert({ nome_completo: nomeCompleto, nome_fazenda: nomeFazenda, estado, cidade, telefone, whatsapp, email })
      .select('id')
      .single()

    if (criadorErro) {
      setErro('Erro ao salvar dados da fazenda: ' + criadorErro.message)
      setCarregando(false)
      return
    }

    await supabase
      .from('perfis')
      .insert({ id: userId, criador_id: criador.id, nome_completo: nomeCompleto, nome_fazenda: nomeFazenda, estado, cidade, telefone, whatsapp })

    // Marca que este navegador já tem uma conta
    localStorage.setItem('epo_ja_cadastrado', 'true')

    router.push('/app/anuncios')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-verde-escuro flex flex-col items-center justify-center px-6 py-12 relative">
      <div className="tech-grid pointer-events-none fixed inset-0" />
      <div className="relative w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-8">
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
          <h2 className="font-serif text-2xl font-bold text-texto mb-1">Criar conta</h2>
          <p className="text-gray-400 text-sm mb-6">Cadastre sua fazenda e comece a anunciar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Nome completo *</label>
              <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required className={inputCls} placeholder="João da Silva" />
            </div>

            <div>
              <label className={labelCls}>Nome da fazenda *</label>
              <input type="text" value={nomeFazenda} onChange={(e) => setNomeFazenda(e.target.value)} required className={inputCls} placeholder="Fazenda Boa Vista" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Estado *</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} required className={inputCls}>
                  <option value="">UF</option>
                  {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cidade *</label>
                <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required className={inputCls} placeholder="Uberaba" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Telefone</label>
                <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputCls} placeholder="(34) 99999-9999" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp *</label>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className={inputCls} placeholder="(34) 99999-9999" />
              </div>
            </div>

            <hr className="border-black/5 my-1" />

            <div>
              <label className={labelCls}>E-mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="seu@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Senha *</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="new-password" className={inputCls} placeholder="Mín. 6 chars" />
              </div>
              <div>
                <label className={labelCls}>Confirmar *</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required autoComplete="new-password" className={inputCls} placeholder="••••••••" />
              </div>
            </div>

            {erro && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{erro}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-verde-escuro text-verde-claro font-black uppercase tracking-wider text-sm py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-2 shadow-lg shadow-verde-escuro/20"
            >
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="font-bold text-verde-escuro hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        <Link href="/" className="block text-center text-white/30 hover:text-white/60 text-xs mt-6 transition-colors duration-200">
          ← Voltar
        </Link>
      </div>
    </div>
  )
}
