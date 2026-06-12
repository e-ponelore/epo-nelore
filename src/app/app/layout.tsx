import { redirect } from 'next/navigation'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import BottomNav from '@/components/BottomNav'

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const supabase = await criarClienteServidor()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="relative flex flex-col min-h-screen bg-verde-escuro">
      {/* Grade técnica de fundo */}
      <div className="tech-grid pointer-events-none fixed inset-0 z-0" />
      {/* Glow radial sutil no topo */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 40% at 50% -5%, rgba(200,255,77,0.06) 0%, transparent 60%)',
        }}
      />

      <main className="relative z-10 flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
