'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { ESTADOS_BR } from '@/types'

export default function PaginaCadastro() {
  const router = useRouter()

  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeFazenda, setNomeFazenda] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30 focus:border-verde-escuro transition-colors'
  const labelCls =
    'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

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

    // 1. Criar conta no Supabase Auth
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

    // 2. Criar registro na tabela criadores
    const { data: criador, error: criadorErro } = await supabase
      .from('criadores')
      .insert({
        nome_completo: nomeCompleto,
        nome_fazenda: nomeFazenda,
        estado,
        cidade,
        telefone,
        whatsapp,
        email,
      })
      .select('id')
      .single()

    if (criadorErro) {
      setErro('Erro ao salvar dados da fazenda: ' + criadorErro.message)
      setCarregando(false)
      return
    }

    // 3. Inserir perfil diretamente (sem depender de trigger)
    await supabase
      .from('perfis')
      .insert({
        id: userId,
        criador_id: criador.id,
        nome_completo: nomeCompleto,
        nome_fazenda: nomeFazenda,
        estado,
        cidade,
        telefone,
        whatsapp,
      })

    router.push('/perfil')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bege flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
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
            Criar conta de criador
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Cadastre sua fazenda e comece a anunciar seus animais
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados pessoais */}
            <div>
              <label className={labelCls}>Nome completo *</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
                className={inputCls}
                placeholder="João da Silva"
              />
            </div>

            <div>
              <label className={labelCls}>Nome da fazenda *</label>
              <input
                type="text"
                value={nomeFazenda}
                onChange={(e) => setNomeFazenda(e.target.value)}
                required
                className={inputCls}
                placeholder="Fazenda Boa Vista"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Estado *</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                  className={inputCls}
                >
                  <option value="">Selecione</option>
                  {ESTADOS_BR.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cidade *</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Uberaba"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Telefone *</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="(34) 99999-9999"
                />
              </div>
              <div>
                <label className={labelCls}>WhatsApp *</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="(34) 99999-9999"
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Acesso */}
            <div>
              <label className={labelCls}>E-mail *</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Senha *</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputCls}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className={labelCls}>Confirmar senha *</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputCls}
                  placeholder="••••••••"
                />
              </div>
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
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link
              href="/login"
              className="text-verde-escuro font-semibold hover:underline"
            >
              Entrar
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
