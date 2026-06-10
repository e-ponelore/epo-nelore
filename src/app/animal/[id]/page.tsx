import { notFound } from 'next/navigation'
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

  const supabase = criarClienteServidor()
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
    <div className="bg-bege min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <a href="/" className="hover:text-verde-escuro transition-colors">
            Vitrine
          </a>
          <span>/</span>
          <span className="text-texto">{animal.nome_animal}</span>
        </div>

        <GaleriaFotos fotos={animal.fotos ?? []} nome={animal.nome_animal} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {animal.destaque && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      Destaque
                    </span>
                  )}
                  <span className="bg-verde-claro text-verde-escuro text-xs font-bold px-2 py-1 rounded-full">
                    P.O.
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
              <div className="bg-white rounded-2xl p-6">
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
              <div className="bg-white rounded-2xl p-6">
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

              <div className="mt-4 bg-white rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400">
                  O contato é direto com o criador. Não há intermediação de
                  pagamento pela plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
