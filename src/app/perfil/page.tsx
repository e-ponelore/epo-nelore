import { redirect } from 'next/navigation'
import Link from 'next/link'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import FormularioConta from './FormularioConta'
import type { Animal, Perfil, Favorito } from '@/types'

export const dynamic = 'force-dynamic'

const ABAS = [
  { id: 'anuncios',  label: '🐄 Meus Anúncios' },
  { id: 'conta',     label: '⚙️ Minha Conta'   },
  { id: 'plano',     label: '⭐ Meu Plano'      },
  { id: 'favoritos', label: '🤍 Favoritos'      },
]

const PLANOS_INFO: Record<string, { nome: string; descricao: string; cor: string }> = {
  gratuito: { nome: 'Gratuito',         descricao: 'Sem anúncios ativos',          cor: 'gray'    },
  avulso:   { nome: 'Avulso',           descricao: '1 animal — R$ 49,90/animal',   cor: 'blue'    },
  pequeno:  { nome: 'Pequeno Criador',  descricao: 'Até 5 animais — R$ 39,90/mês', cor: 'green'   },
  medio:    { nome: 'Médio Criador',    descricao: 'Até 15 animais — R$ 29,90/mês', cor: 'emerald'},
  grande:   { nome: 'Grande Criador',   descricao: '30+ animais — R$ 22,90/mês',   cor: 'yellow'  },
}

export default async function PaginaPerfil({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>
}) {
  const { aba = 'anuncios' } = await searchParams
  const supabase = await criarClienteServidor()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Buscar perfil
  const { data: perfilBruto } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', user.id)
    .single()

  const perfil = (perfilBruto as Perfil | null) ?? {
    id: user.id,
    criador_id: null,
    nome_completo: '',
    nome_fazenda: '',
    estado: '',
    cidade: '',
    telefone: '',
    whatsapp: '',
    plano_atual: 'gratuito',
    criado_em: '',
  }

  // Buscar animais do criador
  const { data: animaisBrutos } = await supabase
    .from('animais')
    .select('*')
    .eq('criador_user_id', user.id)
    .order('criado_em', { ascending: false })

  const animais = (animaisBrutos as Animal[]) ?? []

  // Buscar favoritos com dados do animal
  const { data: favoritosBrutos } = await supabase
    .from('favoritos')
    .select('*, animais(id, nome_animal, categoria, sexo, fotos, ativo, criadores(nome_fazenda, estado))')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false })

  const favoritos = (favoritosBrutos as Favorito[]) ?? []

  const planoInfo = PLANOS_INFO[perfil.plano_atual] ?? PLANOS_INFO.gratuito

  return (
    <div className="bg-bege min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Cabeçalho do perfil */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-verde-claro text-verde-escuro font-bold text-2xl flex items-center justify-center select-none flex-shrink-0">
            {perfil.nome_completo
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((p) => p[0].toUpperCase())
              .join('') || '?'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-texto">
              {perfil.nome_completo || 'Meu Perfil'}
            </h1>
            {perfil.nome_fazenda && (
              <p className="text-gray-500 text-sm">{perfil.nome_fazenda} — {perfil.estado}</p>
            )}
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-verde-claro text-verde-escuro">
              {planoInfo.nome}
            </span>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm mb-6 overflow-x-auto">
          {ABAS.map((a) => (
            <Link
              key={a.id}
              href={`/perfil?aba=${a.id}`}
              className={`flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                aba === a.id
                  ? 'bg-verde-escuro text-white'
                  : 'text-gray-500 hover:text-texto hover:bg-gray-50'
              }`}
            >
              {a.label}
            </Link>
          ))}
        </div>

        {/* Conteúdo da aba */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* ABA: Meus Anúncios */}
          {aba === 'anuncios' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-bold text-texto">
                  Meus Anúncios
                </h2>
                <Link
                  href="/cadastrar-animal"
                  className="bg-verde-escuro text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-verde-escuro/90 transition-colors"
                >
                  + Novo animal
                </Link>
              </div>

              {animais.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🐄</p>
                  <p className="text-gray-500 mb-4">Você ainda não cadastrou nenhum animal.</p>
                  <Link
                    href="/cadastrar-animal"
                    className="inline-block bg-verde-escuro text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-verde-escuro/90 transition-colors"
                  >
                    Cadastrar primeiro animal
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {animais.map((animal) => (
                    <div
                      key={animal.id}
                      className="flex items-center gap-4 py-4"
                    >
                      {/* Foto */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {animal.fotos?.[0] ? (
                          <img
                            src={animal.fotos[0]}
                            alt={animal.nome_animal}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🐄</div>
                        )}
                      </div>

                      {/* Dados */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-texto truncate">{animal.nome_animal}</p>
                        <p className="text-xs text-gray-400">{animal.categoria} · {animal.sexo}</p>
                      </div>

                      {/* Status */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          animal.ativo
                            ? 'bg-verde-claro text-verde-escuro'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {animal.ativo ? 'Ativo' : 'Inativo'}
                      </span>

                      {/* Link */}
                      <Link
                        href={`/animal/${animal.id}`}
                        className="text-xs text-verde-escuro font-semibold hover:underline"
                      >
                        Ver →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA: Minha Conta */}
          {aba === 'conta' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-texto mb-5">
                Minha Conta
              </h2>
              <FormularioConta perfil={perfil as Perfil} />
            </div>
          )}

          {/* ABA: Meu Plano */}
          {aba === 'plano' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-texto mb-5">
                Meu Plano
              </h2>

              {/* Plano atual */}
              <div className="bg-verde-claro/40 border border-verde-claro rounded-2xl p-5 mb-6">
                <p className="text-xs font-semibold text-verde-escuro uppercase tracking-wide mb-1">
                  Plano atual
                </p>
                <p className="text-2xl font-bold text-texto">{planoInfo.nome}</p>
                <p className="text-gray-500 text-sm">{planoInfo.descricao}</p>
              </div>

              {/* Planos disponíveis */}
              <p className="font-semibold text-texto mb-4">Fazer upgrade</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'avulso',  nome: 'Avulso',          valor: 'R$ 49,90', desc: 'Por animal anunciado', destaque: false },
                  { id: 'pequeno', nome: 'Pequeno Criador',  valor: 'R$ 39,90', desc: 'Até 5 animais / mês',   destaque: false },
                  { id: 'medio',   nome: 'Médio Criador',    valor: 'R$ 29,90', desc: 'Até 15 animais / mês',  destaque: true  },
                  { id: 'grande',  nome: 'Grande Criador',   valor: 'R$ 22,90', desc: '30+ animais / mês',     destaque: false },
                ].map((plano) => (
                  <div
                    key={plano.id}
                    className={`border rounded-2xl p-4 relative ${
                      plano.destaque
                        ? 'border-verde-escuro ring-2 ring-verde-escuro/20'
                        : 'border-gray-200'
                    }`}
                  >
                    {plano.destaque && (
                      <span className="absolute -top-2.5 left-4 bg-verde-escuro text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Mais popular
                      </span>
                    )}
                    <p className="font-bold text-texto">{plano.nome}</p>
                    <p className="text-verde-escuro font-bold text-lg">{plano.valor}<span className="text-gray-400 font-normal text-sm">/mês</span></p>
                    <p className="text-gray-400 text-xs">{plano.desc}</p>
                    <Link
                      href="/anunciar"
                      className="mt-3 block text-center bg-verde-escuro text-white text-xs font-semibold py-2 rounded-lg hover:bg-verde-escuro/90 transition-colors"
                    >
                      Contratar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA: Favoritos */}
          {aba === 'favoritos' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-texto mb-5">
                Favoritos
              </h2>

              {favoritos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🤍</p>
                  <p className="text-gray-500 mb-4">Você ainda não salvou nenhum animal.</p>
                  <Link
                    href="/"
                    className="inline-block bg-verde-escuro text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-verde-escuro/90 transition-colors"
                  >
                    Explorar vitrine
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoritos.map((fav) => {
                    const animal = fav.animais
                    if (!animal) return null
                    return (
                      <Link
                        key={fav.id}
                        href={`/animal/${animal.id}`}
                        className="flex gap-3 p-3 border border-gray-100 rounded-2xl hover:border-verde-claro hover:bg-verde-claro/10 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {animal.fotos?.[0] ? (
                            <img src={animal.fotos[0]} alt={animal.nome_animal} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🐄</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-texto truncate">{animal.nome_animal}</p>
                          <p className="text-xs text-gray-400">{animal.categoria} · {animal.sexo}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {(animal as Animal & { criadores?: { nome_fazenda: string; estado: string } }).criadores?.nome_fazenda}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
