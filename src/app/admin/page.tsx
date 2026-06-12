import { revalidatePath } from 'next/cache'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import type { Animal, Criador } from '@/types'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

async function alternarAtivo(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const ativoAtual = formData.get('ativo') === 'true'
  const supabase = await criarClienteServidor()
  await supabase.from('animais').update({ ativo: !ativoAtual }).eq('id', id)
  revalidatePath('/admin')
}

async function alternarDestaque(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const destaqueAtual = formData.get('destaque') === 'true'
  const supabase = await criarClienteServidor()
  await supabase.from('animais').update({ destaque: !destaqueAtual }).eq('id', id)
  revalidatePath('/admin')
}

export default async function PaginaAdmin() {
  const supabase = await criarClienteServidor()

  // Proteção: somente o email admin tem acesso
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (ADMIN_EMAIL && user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen bg-bege flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-sm">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="font-serif text-xl font-bold text-texto mb-2">Acesso restrito</h1>
          <p className="text-gray-500 text-sm">Esta área é exclusiva para administradores.</p>
        </div>
      </div>
    )
  }

  const [{ data: animaisBrutos }, { data: criadoresBrutos }] = await Promise.all([
    supabase
      .from('animais')
      .select('*, criadores(nome_fazenda, estado)')
      .order('criado_em', { ascending: false }),
    supabase
      .from('criadores')
      .select('*')
      .order('criado_em', { ascending: false }),
  ])

  const animais = (animaisBrutos as (Animal & { criadores: { nome_fazenda: string; estado: string } | null })[]) ?? []
  const criadores = (criadoresBrutos as Criador[]) ?? []

  return (
    <div className="bg-bege min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-texto">
            Painel Administrativo
          </h1>
          <p className="text-gray-500 text-sm mt-1">e-PO Nelore</p>
        </div>

        <section className="mb-10">
          <h2 className="font-serif text-xl font-bold text-texto mb-4">
            Animais ({animais.length})
          </h2>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Animal</th>
                    <th className="px-4 py-3 font-medium">Criador</th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 font-medium">Cadastro</th>
                    <th className="px-4 py-3 font-medium text-center">Ativo</th>
                    <th className="px-4 py-3 font-medium text-center">Destaque</th>
                  </tr>
                </thead>
                <tbody>
                  {animais.map((animal, i) => (
                    <tr
                      key={animal.id}
                      className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`/animal/${animal.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-texto hover:text-verde-escuro transition-colors"
                        >
                          {animal.nome_animal}
                        </a>
                        <p className="text-xs text-gray-400">{animal.sexo}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {animal.criadores?.nome_fazenda ?? '—'}
                        <p className="text-xs text-gray-400">
                          {animal.criadores?.estado}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {animal.categoria}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(animal.criado_em).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <form action={alternarAtivo}>
                          <input type="hidden" name="id" value={animal.id} />
                          <input
                            type="hidden"
                            name="ativo"
                            value={String(animal.ativo)}
                          />
                          <button
                            type="submit"
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              animal.ativo
                                ? 'bg-verde-claro text-verde-escuro hover:bg-red-50 hover:text-red-600'
                                : 'bg-gray-100 text-gray-500 hover:bg-verde-claro hover:text-verde-escuro'
                            }`}
                          >
                            {animal.ativo ? 'Ativo' : 'Inativo'}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <form action={alternarDestaque}>
                          <input type="hidden" name="id" value={animal.id} />
                          <input
                            type="hidden"
                            name="destaque"
                            value={String(animal.destaque)}
                          />
                          <button
                            type="submit"
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              animal.destaque
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-gray-100 hover:text-gray-500'
                                : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-700'
                            }`}
                          >
                            {animal.destaque ? 'Destaque' : 'Normal'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {animais.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        Nenhum animal cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-texto mb-4">
            Criadores ({criadores.length})
          </h2>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Fazenda</th>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Localização</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {criadores.map((criador, i) => (
                    <tr
                      key={criador.id}
                      className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-4 py-3 font-medium text-texto">
                        {criador.nome_fazenda}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {criador.nome_completo}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {criador.cidade} — {criador.estado}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/55${criador.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-verde-escuro hover:underline"
                        >
                          {criador.whatsapp}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {criador.email}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(criador.criado_em).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                  {criadores.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        Nenhum criador cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
