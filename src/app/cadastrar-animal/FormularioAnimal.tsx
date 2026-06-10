'use client'

import { useState } from 'react'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { CATEGORIAS, SEXOS, type Criador } from '@/types'

interface Props {
  criadores: Pick<Criador, 'id' | 'nome_fazenda' | 'nome_completo'>[]
}

export default function FormularioAnimal({ criadores }: Props) {
  const [criadorId, setCriadorId] = useState('')
  const [nomeAnimal, setNomeAnimal] = useState('')
  const [sexo, setSexo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [registroAbcz, setRegistroAbcz] = useState('')
  const [certificacoes, setCertificacoes] = useState('')
  const [depDesmama, setDepDesmama] = useState('')
  const [depSobreano, setDepSobreano] = useState('')
  const [depAcabamento, setDepAcabamento] = useState('')
  const [descricao, setDescricao] = useState('')
  const [arquivos, setArquivos] = useState<FileList | null>(null)

  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  async function uploadFotos(files: FileList): Promise<string[]> {
    const supabase = obterClienteNavegador()
    const urls: string[] = []

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()
      const nomeArquivo = `${Date.now()}-${i}.${ext}`

      const { error } = await supabase.storage
        .from('fotos-animais')
        .upload(nomeArquivo, file, { cacheControl: '3600', upsert: false })

      if (error) continue

      const { data: urlData } = supabase.storage
        .from('fotos-animais')
        .getPublicUrl(nomeArquivo)

      urls.push(urlData.publicUrl)
    }

    return urls
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')

    let fotosUrls: string[] = []
    if (arquivos?.length) {
      fotosUrls = await uploadFotos(arquivos)
    }

    const supabase = obterClienteNavegador()
    const payload = {
      criador_id: criadorId,
      nome_animal: nomeAnimal,
      sexo,
      categoria,
      data_nascimento: dataNascimento,
      peso_kg: pesoKg ? Number(pesoKg) : null,
      registro_abcz: registroAbcz || null,
      certificacoes: certificacoes || null,
      dep_desmama: depDesmama ? Number(depDesmama) : null,
      dep_sobreano: depSobreano ? Number(depSobreano) : null,
      dep_acabamento: depAcabamento ? Number(depAcabamento) : null,
      descricao: descricao || null,
      fotos: fotosUrls.length ? fotosUrls : null,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('animais').insert([payload])

    setEnviando(false)

    if (error) {
      setErro('Erro ao salvar o animal. Verifique os dados e tente novamente.')
      return
    }

    setSucesso(true)
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
          Animal cadastrado!
        </h2>
        <p className="text-gray-600">
          O animal foi salvo com sucesso. Ele será ativado pelo administrador
          antes de aparecer na vitrine.
        </p>
        <button
          onClick={() => setSucesso(false)}
          className="mt-6 text-sm text-verde-escuro underline hover:opacity-70"
        >
          Cadastrar outro animal
        </button>
      </div>
    )
  }

  const inputCls =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/30'
  const labelCls = 'block text-sm font-medium text-texto mb-1'

  return (
    <form onSubmit={enviar} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
      <div>
        <label className={labelCls}>Criador *</label>
        <select
          value={criadorId}
          onChange={(e) => setCriadorId(e.target.value)}
          required
          className={inputCls}
        >
          <option value="">Selecione o criador</option>
          {criadores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome_fazenda} — {c.nome_completo}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nome do animal *</label>
          <input
            type="text"
            value={nomeAnimal}
            onChange={(e) => setNomeAnimal(e.target.value)}
            required
            className={inputCls}
            placeholder="Ex: Imperador da Serra"
          />
        </div>

        <div>
          <label className={labelCls}>Sexo *</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Selecione</option>
            {SEXOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Categoria *</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Selecione</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Data de nascimento *</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Peso (kg)</label>
          <input
            type="number"
            value={pesoKg}
            onChange={(e) => setPesoKg(e.target.value)}
            className={inputCls}
            placeholder="Ex: 650"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className={labelCls}>Registro ABCZ</label>
          <input
            type="text"
            value={registroAbcz}
            onChange={(e) => setRegistroAbcz(e.target.value)}
            className={inputCls}
            placeholder="Número do registro"
          />
        </div>

        <div>
          <label className={labelCls}>Certificações</label>
          <input
            type="text"
            value={certificacoes}
            onChange={(e) => setCertificacoes(e.target.value)}
            className={inputCls}
            placeholder="Ex: Nelore Brasil, Pedigree ABCZ"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-texto text-sm mb-3">
          DEPs — Diferenças Esperadas na Progênie
          <span className="font-normal text-gray-400 ml-1">(opcional)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>DEP Desmama</label>
            <input
              type="number"
              value={depDesmama}
              onChange={(e) => setDepDesmama(e.target.value)}
              className={inputCls}
              placeholder="Ex: +4.2"
              step="0.01"
            />
          </div>
          <div>
            <label className={labelCls}>DEP Sobreano</label>
            <input
              type="number"
              value={depSobreano}
              onChange={(e) => setDepSobreano(e.target.value)}
              className={inputCls}
              placeholder="Ex: +6.8"
              step="0.01"
            />
          </div>
          <div>
            <label className={labelCls}>DEP Acabamento</label>
            <input
              type="number"
              value={depAcabamento}
              onChange={(e) => setDepAcabamento(e.target.value)}
              className={inputCls}
              placeholder="Ex: +0.15"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className={inputCls}
          placeholder="Informações adicionais sobre o animal, linhagem, histórico..."
        />
      </div>

      <div>
        <label className={labelCls}>
          Fotos{' '}
          <span className="text-gray-400 font-normal">(máximo 5 imagens)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setArquivos(e.target.files)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm file:mr-3 file:border-0 file:bg-verde-claro file:text-verde-escuro file:font-medium file:py-1 file:px-3 file:rounded-md file:cursor-pointer focus:outline-none"
        />
        {arquivos && arquivos.length > 5 && (
          <p className="text-amber-500 text-xs mt-1">
            Apenas as 5 primeiras fotos serão enviadas.
          </p>
        )}
      </div>

      {erro && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{erro}</p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-verde-escuro text-white font-semibold py-3 rounded-xl hover:bg-verde-escuro/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enviando ? 'Salvando...' : 'Cadastrar animal'}
      </button>
    </form>
  )
}
