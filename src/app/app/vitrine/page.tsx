import { criarClienteServidor } from '@/lib/supabase-servidor'
import CardAnimal from '@/components/CardAnimal'
import FiltrosHome from '@/components/FiltrosHome'
import AppHeader from '@/components/AppHeader'
import type { Animal } from '@/types'

export const dynamic = 'force-dynamic'

export default async function PaginaVitrine({
  searchParams,
}: {
  searchParams: Promise<{ sexo?: string; categoria?: string; estado?: string; busca?: string }>
}) {
  const filtros = await searchParams
  const { sexo = '', categoria = '', estado = '', busca = '' } = filtros

  const supabase = await criarClienteServidor()
  const { data: animaisBrutos } = await supabase
    .from('animais')
    .select('*, criadores(nome_fazenda, estado, cidade, telefone, whatsapp, email, nome_completo)')
    .eq('ativo', true)
    .order('destaque', { ascending: false })
    .order('criado_em', { ascending: false })

  let animais: Animal[] = (animaisBrutos as Animal[]) ?? []

  if (sexo) animais = animais.filter((a) => a.sexo === sexo)
  if (categoria) animais = animais.filter((a) => a.categoria === categoria)
  if (estado) animais = animais.filter((a) => a.criadores?.estado === estado)
  if (busca) {
    const termo = busca.toLowerCase()
    animais = animais.filter(
      (a) =>
        a.nome_animal.toLowerCase().includes(termo) ||
        a.criadores?.nome_fazenda?.toLowerCase().includes(termo),
    )
  }

  const totalAtivos = animaisBrutos?.length ?? 0

  return (
    <div className="min-h-full">
      <AppHeader
        eyebrow="Marketplace"
        titulo="Vitrine"
        subtitulo={`${totalAtivos} ${totalAtivos === 1 ? 'animal' : 'animais'} Nelore P.O. na plataforma`}
      />

      <div className="px-4 pt-2 pb-5">
        {/* Trust signal */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-verde-claro/8 rounded-lg border border-verde-claro/20">
          <span className="text-sm">✦</span>
          <p className="text-[11px] font-bold text-verde-claro/90 uppercase tracking-wide">
            100% Nelore Puro de Origem certificado
          </p>
        </div>

        <FiltrosHome
          sexoAtual={sexo}
          categoriaAtual={categoria}
          estadoAtual={estado}
          buscaAtual={busca}
        />

        <p className="text-white/35 text-[11px] font-bold uppercase tracking-widest mt-5 mb-3">
          {animais.length === 0
            ? 'Nenhum resultado'
            : `${animais.length} ${animais.length === 1 ? 'resultado' : 'resultados'}`}
        </p>

        {animais.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <p className="text-white/20 text-4xl mb-3">🔍</p>
            <p className="text-white/40 text-sm">Nenhum animal corresponde aos filtros.</p>
            <a href="/app/vitrine" className="mt-3 text-verde-claro text-sm font-bold underline underline-offset-2">
              Limpar filtros
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {animais.map((animal, i) => (
              <div
                key={animal.id}
                className="fade-up"
                style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
              >
                <CardAnimal animal={animal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
