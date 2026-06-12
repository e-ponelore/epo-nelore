import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import FormularioAnimal from './FormularioAnimal'
import type { Perfil } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cadastrar Animal — e-PO Nelore',
  description: 'Cadastre seus bovinos Nelore P.O. na vitrine.',
}

export default async function PaginaCadastrarAnimal() {
  const supabase = await criarClienteServidor()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirecionar=/cadastrar-animal')

  // Buscar criador_id do perfil do usuário logado
  const { data: perfilBruto } = await supabase
    .from('perfis')
    .select('criador_id, nome_fazenda')
    .eq('id', user.id)
    .single()

  const perfil = perfilBruto as Pick<Perfil, 'criador_id' | 'nome_fazenda'> | null

  if (!perfil?.criador_id) {
    redirect('/perfil?aba=conta&aviso=complete-perfil')
  }

  return (
    <div className="bg-bege min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-texto mb-2">
            Cadastrar Animal
          </h1>
          <p className="text-gray-600">
            Preencha os dados do animal. Campos marcados com * são obrigatórios.
          </p>
          {perfil.nome_fazenda && (
            <p className="text-sm text-verde-escuro font-medium mt-1">
              Fazenda: {perfil.nome_fazenda}
            </p>
          )}
        </div>
        <FormularioAnimal
          criadorId={perfil.criador_id}
          criadorUserId={user.id}
        />
      </div>
    </div>
  )
}
