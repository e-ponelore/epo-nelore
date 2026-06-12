import { notFound } from 'next/navigation'
import Image from 'next/image'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import GaleriaFotos from '@/components/GaleriaFotos'
import BlocoContato from '@/components/BlocoContato'
import TooltipDEP from '@/components/TooltipDEP'
import type { Animal, Criador } from '@/types'

export const dynamic = 'force-dynamic'

const descricoesDEP: Record<string, string> = {
  'DEP Desmama':
    'Diferença Esperada na Progênie para peso à desmama (~205 dias). Estima quanto os filhos serão mais pesados em kg em relação à média da raça.',
  'DEP Sobreano':
    'Diferença Esperada na Progênie para peso ao sobreano (~365 dias). Indica o potencial de ganho de peso dos filhos até um ano.',
  'DEP Acabamento':
    'Diferença Esperada na Progênie para espessura de gordura subcutânea (mm). Avalia o acabamento de carcaça dos filhos.',
}

export default async function PaginaAnimal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await criarClienteServidor()
  const { data } = await supabase
    .from('animais')
    .select('*, criadores(*)')
    .eq('id', id)
    .eq('ativo', true)
    .single()

  if (!data) notFound()

  const animal = data as Animal & { criadores: Criador }
  const criador = animal.criadores

  const deps = [
    { chave: 'DEP Desmama', valor: animal.dep_desmama },
    { chave: 'DEP Sobreano', valor: animal.dep_sobreano },
    { chave: 'DEP Acabamento', valor: animal.dep_acabamento },
  ].filter((d) => d.valor !== null && d.valor !== undefined)

  const dataNasc = new Date(animal.data_nascimento)
  const dataFormatada = dataNasc.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const idadeAnos = Math.floor(
    (Date.now() - dataNasc.getTime()) / (1000 * 60 * 60 * 24 * 365),
  )

  return (
    <div className="bg-verde-escuro min-h-screen relative">
      <div className="tech-grid pointer-events-none fixed inset-0 z-0" />
      {/* Mini header com voltar e logo */}
      <div className="relative z-40 bg-verde-escuro/90 backdrop-blur-xl px-4 py-3.5 flex items-center gap-3 sticky top-0 border-b border-white/10">
        <a
          href="/app/vitrine"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-verde-claro/20 active:scale-95 transition-all duration-200 flex-shrink-0"
          aria-label="Voltar para a vitrine"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <span className="font-serif font-bold text-white truncate flex-1">{animal.nome_animal}</span>
        <div className="w-7 h-7 rounded-lg overflow-hidden opacity-50 ring-1 ring-white/10 flex-shrink-0">
          <Image src="/logo.png.jpeg" alt="e-PO Nelore" width={28} height={28} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div>

        <GaleriaFotos fotos={animal.fotos ?? []} nome={animal.nome_animal} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {animal.destaque && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded">
                      ★ Destaque
                    </span>
                  )}
                  <span className="bg-verde-escuro text-verde-claro text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded">
                    ✦ P.O. Certificado
                  </span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-texto mt-3">
                {animal.nome_animal}
              </h1>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Sexo
                  </p>
                  <p className="font-semibold text-texto">{animal.sexo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Categoria
                  </p>
                  <p className="font-semibold text-texto">{animal.categoria}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Nascimento
                  </p>
                  <p className="font-semibold text-texto">
                    {dataFormatada}
                    <span className="text-gray-400 text-xs ml-1">
                      ({idadeAnos} {idadeAnos === 1 ? 'ano' : 'anos'})
                    </span>
                  </p>
                </div>
                {animal.peso_kg && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Peso
                    </p>
                    <p className="font-semibold text-texto">{animal.peso_kg} kg</p>
                  </div>
                )}
                {animal.registro_abcz && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Registro ABCZ
                    </p>
                    <p className="font-semibold text-texto font-mono text-sm">
                      {animal.registro_abcz}
                    </p>
                  </div>
                )}
              </div>

              {animal.certificacoes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Certificações
                  </p>
                  <p className="text-texto text-sm">{animal.certificacoes}</p>
                </div>
              )}
            </div>

            {deps.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-xl shadow-black/20">
                <h2 className="font-serif font-bold text-lg text-texto mb-4">
                  DEPs — Diferenças Esperadas na Progênie
                </h2>
                <div className="space-y-3">
                  {deps.map((dep) => (
                    <TooltipDEP
                      key={dep.chave}
                      nome={dep.chave}
                      valor={dep.valor!}
                      descricao={descricoesDEP[dep.chave]}
                    />
                  ))}
                </div>
              </div>
            )}

            {animal.descricao && (
              <div className="bg-white rounded-xl p-6 shadow-xl shadow-black/20">
                <h2 className="font-serif font-bold text-lg text-texto mb-3">
                  Descrição
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {animal.descricao}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BlocoContato criador={criador} />

              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-xs text-white/40">
                  O contato é direto com o criador. Não há intermediação de
                  pagamento pela plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
