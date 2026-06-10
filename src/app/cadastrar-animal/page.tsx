import type { Metadata } from 'next'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import FormularioAnimal from './FormularioAnimal'
import type { Criador } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cadastrar Animal — e-PO Nelore',
  description: 'Cadastre seus bovinos Nelore P.O. na vitrine.',
}

export default async function PaginaCadastrarAnimal() {
  const supabase = criarClienteServidor()
  const { data: criadores } = await supabase
    .from('criadores')
    .select('id, nome_fazenda, nome_completo')
    .order('nome_fazenda')

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
        </div>
        <FormularioAnimal criadores={(criadores as Criador[]) ?? []} />
      </div>
    </div>
  )
}
