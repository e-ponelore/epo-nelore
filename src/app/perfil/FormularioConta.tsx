'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { ESTADOS_BR, type Perfil } from '@/types'

interface Props {
  perfil: Perfil
}

export default function FormularioConta({ perfil }: Props) {
  const router = useRouter()
  const [nomeCompleto, setNomeCompleto] = useState(perfil.nome_completo)
  const [nomeFazenda, setNomeFazenda] = useState(perfil.nome_fazenda)
  const [estado, setEstado]           = useState(perfil.estado)
  const [cidade, setCidade]           = useState(perfil.cidade)
  const [telefone, setTelefone]       = useState(perfil.telefone)
  const [whatsapp, setWhatsapp]       = useState(perfil.whatsapp)
  const [salvando, setSalvando]       = useState(false)
  const [mensagem, setMensagem]       = useState('')
  const [erro, setErro]               = useState('')

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30 focus:border-verde-escuro transition-colors'
  const labelCls =
    'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    setMensagem('')

    const supabase = obterClienteNavegador()
    const { error } = await supabase
      .from('perfis')
      .update({ nome_completo: nomeCompleto, nome_fazenda: nomeFazenda, estado, cidade, telefone, whatsapp })
      .eq('id', perfil.id)

    // Atualizar também na tabela criadores se tiver criador_id
    if (!error && perfil.criador_id) {
      await supabase
        .from('criadores')
        .update({ nome_completo: nomeCompleto, nome_fazenda: nomeFazenda, estado, cidade, telefone, whatsapp })
        .eq('id', perfil.criador_id)
    }

    setSalvando(false)
    if (error) {
      setErro('Erro ao salvar: ' + error.message)
    } else {
      setMensagem('Dados atualizados com sucesso!')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className={labelCls}>Nome completo *</label>
        <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Nome da fazenda *</label>
        <input type="text" value={nomeFazenda} onChange={(e) => setNomeFazenda(e.target.value)} required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Estado *</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} required className={inputCls}>
            <option value="">Selecione</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Cidade *</label>
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Telefone</label>
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>WhatsApp</label>
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} />
        </div>
      </div>

      {mensagem && (
        <p className="text-verde-escuro text-sm bg-verde-claro/60 rounded-lg px-4 py-3">
          ✓ {mensagem}
        </p>
      )}
      {erro && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3 border border-red-100">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={salvando}
        className="bg-verde-escuro text-white font-semibold px-6 py-3 rounded-xl hover:bg-verde-escuro/90 transition-colors disabled:opacity-60"
      >
        {salvando ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  )
}
