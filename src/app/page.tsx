import { criarClienteServidor } from '@/lib/supabase-servidor'
import CardAnimal from '@/components/CardAnimal'
import FiltrosHome from '@/components/FiltrosHome'
import type { Animal } from '@/types'

export const dynamic = 'force-dynamic'

export default async function PaginaHome({
  searchParams,
}: {
  searchParams: Promise<{
    sexo?: string
    categoria?: string
    estado?: string
    busca?: string
  }>
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

  return (
    <div className="bg-bege min-h-screen">
      <section className="bg-verde-escuro text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
            Vitrine de Nelore Puro de Origem
          </h1>
          <p className="text-verde-claro text-base sm:text-lg">
            Genética de excelência direto dos melhores criadores do Brasil
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FiltrosHome
          sexoAtual={sexo}
          categoriaAtual={categoria}
          estadoAtual={estado}
          buscaAtual={busca}
        />

        <div className="mt-6">
          <p className="text-gray-500 text-sm">
            {animais.length === 0
              ? 'Nenhum animal encontrado'
              : `${animais.length} ${animais.length === 1 ? 'animal' : 'animais'} encontrado${animais.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {animais.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-lg">
              Nenhum animal corresponde aos filtros selecionados.
            </p>
            <a href="/" className="mt-4 inline-block text-verde-escuro underline text-sm">
              Ver todos os animais
            </a>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animais.map((animal) => (
              <CardAnimal key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
