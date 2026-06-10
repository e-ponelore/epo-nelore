'use client'

import { useState } from 'react'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { ESTADOS_BR } from '@/types'

interface Campos {
  nome_completo: string
  nome_fazenda: string
  estado: string
  cidade: string
  telefone: string
  whatsapp: string
  email: string
}

const camposVazios: Campos = {
  nome_completo: '',
  nome_fazenda: '',
  estado: '',
  cidade: '',
  telefone: '',
  whatsapp: '',
  email: '',
}

export default function FormularioCriador() {
  const [campos, setCampos] = useState<Campos>(camposVazios)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  function atualizar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setCampos((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')

    const supabase = obterClienteNavegador()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('criadores').insert([campos])

    setEnviando(false)

    if (error) {
      setErro('Ocorreu um erro ao salvar. Tente novamente.')
      return
    }

    setSucesso(true)
    setCampos(camposVazios)
  }

  if (sucesso) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-verde-claro rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-verde-escuro"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-texto mb-2">
          Cadastro enviado!
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Recebemos seus dados. Em breve entraremos em contato pelo WhatsApp
          informado para ativar seu anúncio e orientar o próximo passo.
        </p>
        <button
          onClick={() => setSucesso(false)}
          className="mt-6 text-sm text-verde-escuro underline hover:opacity-70"
        >
          Fazer outro cadastro
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={enviar}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-texto mb-1">
            Nome completo *
          </label>
          <input
            type="text"
            name="nome_completo"
            value={campos.nome_completo}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="João da Silva"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-texto mb-1">
            Nome da fazenda *
          </label>
          <input
            type="text"
            name="nome_fazenda"
            value={campos.nome_fazenda}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="Fazenda Santa Genética"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-1">
            Estado *
          </label>
          <select
            name="estado"
            value={campos.estado}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
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
          <label className="block text-sm font-medium text-texto mb-1">
            Cidade *
          </label>
          <input
            type="text"
            name="cidade"
            value={campos.cidade}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="Uberlândia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="telefone"
            value={campos.telefone}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="(34) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-1">
            WhatsApp *
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={campos.whatsapp}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="(34) 99999-9999"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-texto mb-1">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={campos.email}
            onChange={atualizar}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30"
            placeholder="contato@fazenda.com.br"
          />
        </div>
      </div>

      {erro && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-verde-escuro text-white font-semibold py-3 rounded-xl hover:bg-verde-escuro/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enviando ? 'Enviando...' : 'Enviar cadastro'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Após o envio, entraremos em contato pelo WhatsApp para ativar seu anúncio.
      </p>
    </form>
  )
}
