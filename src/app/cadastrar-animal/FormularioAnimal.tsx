'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { obterClienteNavegador } from '@/lib/supabase-navegador'
import { CATEGORIAS, SEXOS } from '@/types'

interface Props {
  criadorId: string
  criadorUserId: string
  nomeFazenda: string
}

const inputCls =
  'w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-verde-claro focus:border-verde-claro transition-all duration-200'

const labelCls = 'block text-[10px] font-bold text-white/50 uppercase tracking-[0.18em] mb-1.5'

function Secao({ titulo }: { titulo: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <span className="text-[10px] font-black text-verde-claro/80 uppercase tracking-[0.18em]">{titulo}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

export default function FormularioAnimal({ criadorId, criadorUserId, nomeFazenda }: Props) {
  const router = useRouter()

  const [nomeAnimal,     setNomeAnimal]     = useState('')
  const [sexo,           setSexo]           = useState('')
  const [categoria,      setCategoria]      = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [pesoKg,         setPesoKg]         = useState('')
  const [registroAbcz,   setRegistroAbcz]   = useState('')
  const [certificacoes,  setCertificacoes]  = useState('')
  const [depDesmama,     setDepDesmama]     = useState('')
  const [depSobreano,    setDepSobreano]    = useState('')
  const [depAcabamento,  setDepAcabamento]  = useState('')
  const [descricao,      setDescricao]      = useState('')

  const [arquivos,  setArquivos]  = useState<File[]>([])
  const [previews,  setPreviews]  = useState<string[]>([])
  const [enviando,  setEnviando]  = useState(false)
  const [progresso, setProgresso] = useState('')
  const [erro,      setErro]      = useState('')

  const inputFotoRef = useRef<HTMLInputElement>(null)

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setArquivos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removerFoto(idx: number) {
    const novos = arquivos.filter((_, i) => i !== idx)
    setArquivos(novos)
    setPreviews(novos.map(f => URL.createObjectURL(f)))
  }

  async function uploadFotos(): Promise<string[]> {
    const supabase = obterClienteNavegador()
    const urls: string[] = []
    for (let i = 0; i < arquivos.length; i++) {
      setProgresso(`Enviando foto ${i + 1} de ${arquivos.length}...`)
      const f = arquivos[i]
      const ext = f.name.split('.').pop() ?? 'jpg'
      const nome = `${criadorUserId}-${Date.now()}-${i}.${ext}`
      const { error } = await supabase.storage
        .from('fotos-animais')
        .upload(nome, f, { cacheControl: '3600', upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('fotos-animais').getPublicUrl(nome)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    setProgresso('Salvando animal...')

    const fotosUrls = arquivos.length ? await uploadFotos() : []

    const supabase = obterClienteNavegador()
    const { error } = await supabase.from('animais').insert([{
      criador_id:    criadorId,
      criador_user_id: criadorUserId,
      nome_animal:   nomeAnimal,
      sexo,
      categoria,
      data_nascimento: dataNascimento,
      peso_kg:       pesoKg       ? Number(pesoKg)      : null,
      registro_abcz: registroAbcz || null,
      certificacoes: certificacoes || null,
      dep_desmama:   depDesmama   ? Number(depDesmama)  : null,
      dep_sobreano:  depSobreano  ? Number(depSobreano) : null,
      dep_acabamento:depAcabamento? Number(depAcabamento): null,
      descricao:     descricao    || null,
      fotos:         fotosUrls.length ? fotosUrls : null,
      ativo:         true,   // ← vai direto para a vitrine
    }])

    setEnviando(false)
    setProgresso('')

    if (error) {
      setErro('Erro ao salvar: ' + error.message)
      return
    }

    router.push('/app/anuncios')
    router.refresh()
  }

  return (
    <form onSubmit={enviar} className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/app/anuncios')}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 border border-white/10 hover:bg-white/12 active:scale-95 transition-all duration-200 flex-shrink-0"
          aria-label="Voltar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-verde-claro/60 uppercase tracking-[0.18em]">
            {nomeFazenda || 'Painel do Criador'}
          </p>
          <h1 className="font-serif text-2xl font-bold text-white leading-tight">
            Novo Animal
          </h1>
        </div>
        <div className="ml-auto w-9 h-9 rounded-lg overflow-hidden opacity-60 ring-1 ring-white/10 flex-shrink-0">
          <Image src="/logo.png.jpeg" alt="e-PO Nelore" width={36} height={36} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Linha lime */}
      <div className="mx-5 h-px bg-gradient-to-r from-verde-claro/50 to-transparent mb-2" />

      {/* Corpo do formulário */}
      <div className="flex-1 px-5 pb-10 space-y-4 pt-4">

        {/* ── FOTOS ── */}
        <Secao titulo="Fotos" />

        <div>
          {/* Preview grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img src={src} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removerFoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white text-[10px] font-black hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <button
                  type="button"
                  onClick={() => inputFotoRef.current?.click()}
                  className="aspect-square rounded-lg border border-dashed border-white/20 bg-white/3 flex flex-col items-center justify-center text-white/30 hover:border-verde-claro/50 hover:text-verde-claro/50 transition-all"
                >
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-[9px] font-bold uppercase mt-1">Adicionar</span>
                </button>
              )}
            </div>
          )}

          {/* Upload inicial */}
          {previews.length === 0 && (
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              className="w-full h-28 rounded-xl border-2 border-dashed border-white/20 bg-white/3 flex flex-col items-center justify-center gap-2 hover:border-verde-claro/50 hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
            >
              <span className="text-3xl opacity-40">📷</span>
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-wide">
                Toque para adicionar fotos
              </span>
              <span className="text-[10px] text-white/25">Até 5 imagens</span>
            </button>
          )}

          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFotos}
          />
          {previews.length > 0 && (
            <p className="text-[10px] text-white/30 mt-1.5 font-bold uppercase tracking-wide">
              {previews.length}/5 foto{previews.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* ── IDENTIFICAÇÃO ── */}
        <Secao titulo="Identificação" />

        <div>
          <label className={labelCls}>Nome do Animal *</label>
          <input
            type="text"
            value={nomeAnimal}
            onChange={(e) => setNomeAnimal(e.target.value)}
            required
            className={inputCls}
            placeholder="Ex: Imperador da Serra"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Sexo *</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} required className={inputCls}>
              <option value="">—</option>
              {SEXOS.map(s => <option key={s} value={s} className="text-texto">{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Categoria *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required className={inputCls}>
              <option value="">—</option>
              {CATEGORIAS.map(c => <option key={c} value={c} className="text-texto">{c}</option>)}
            </select>
          </div>
        </div>

        {/* ── DADOS FÍSICOS ── */}
        <Secao titulo="Dados Físicos" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nascimento *</label>
            <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Peso (kg)</label>
            <input type="number" value={pesoKg} onChange={(e) => setPesoKg(e.target.value)} min="0" step="0.1" placeholder="Ex: 650" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Registro ABCZ</label>
            <input type="text" value={registroAbcz} onChange={(e) => setRegistroAbcz(e.target.value)} placeholder="Nº do registro" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Certificações</label>
            <input type="text" value={certificacoes} onChange={(e) => setCertificacoes(e.target.value)} placeholder="Ex: Nelore Brasil" className={inputCls} />
          </div>
        </div>

        {/* ── DEPs ── */}
        <Secao titulo="DEPs — Genética" />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Desmama</label>
            <input type="number" value={depDesmama} onChange={(e) => setDepDesmama(e.target.value)} step="0.01" placeholder="+4.2" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Sobreano</label>
            <input type="number" value={depSobreano} onChange={(e) => setDepSobreano(e.target.value)} step="0.01" placeholder="+6.8" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Acabamento</label>
            <input type="number" value={depAcabamento} onChange={(e) => setDepAcabamento(e.target.value)} step="0.01" placeholder="+0.15" className={inputCls} />
          </div>
        </div>

        {/* ── DESCRIÇÃO ── */}
        <Secao titulo="Descrição" />

        <div>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className={inputCls + ' resize-none'}
            placeholder="Conte sobre a linhagem, histórico, características marcantes..."
          />
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3">
            <p className="text-red-300 text-sm">{erro}</p>
          </div>
        )}

        {/* Botão submit */}
        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-verde-claro text-verde-escuro font-black uppercase tracking-wider py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-verde-claro/20 mt-2"
        >
          {enviando ? (progresso || 'Publicando...') : 'Publicar na Vitrine →'}
        </button>

        <p className="text-center text-[10px] text-white/25 uppercase tracking-widest pb-4">
          O animal aparece na vitrine imediatamente
        </p>
      </div>
    </form>
  )
}
