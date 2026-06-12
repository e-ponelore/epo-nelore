import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import FormularioAnimal from './FormularioAnimal'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Novo Animal — e-PO Nelore',
}

export default async function PaginaCadastrarAnimal() {
  const supabase = await criarClienteServidor()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirecionar=/cadastrar-animal')

  // Buscar perfil completo
  const { data: perfil } = await supabase
    .from('perfis')
    .select('criador_id, nome_completo, nome_fazenda, estado, cidade, telefone, whatsapp')
    .eq('id', user.id)
    .single()

  let criadorId = perfil?.criador_id ?? null

  // Se não tem criador_id, cria o registro agora usando os dados do perfil
  if (!criadorId && perfil?.nome_fazenda) {
    const { data: novoCriador } = await supabase
      .from('criadores')
      .insert({
        nome_completo: perfil.nome_completo || '',
        nome_fazenda:  perfil.nome_fazenda  || '',
        estado:        perfil.estado        || '',
        cidade:        perfil.cidade        || '',
        telefone:      perfil.telefone      || '',
        whatsapp:      perfil.whatsapp      || '',
        email:         user.email           || '',
      })
      .select('id')
      .single()

    if (novoCriador) {
      criadorId = novoCriador.id
      await supabase.from('perfis').update({ criador_id: criadorId }).eq('id', user.id)
    }
  }

  // Se mesmo assim não tem dados suficientes, manda completar o cadastro
  if (!criadorId) {
    redirect('/cadastro?aviso=complete-perfil')
  }

  return (
    <div className="relative min-h-screen bg-verde-escuro">
      <div className="tech-grid pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10">
        <FormularioAnimal
          criadorId={criadorId}
          criadorUserId={user.id}
          nomeFazenda={perfil?.nome_fazenda ?? ''}
        />
      </div>
    </div>
  )
}
