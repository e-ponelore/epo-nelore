import Link from 'next/link'
import Image from 'next/image'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import AppHeader from '@/components/AppHeader'
import type { Animal } from '@/types'

export const dynamic = 'force-dynamic'

const badgeStatus: Record<string, { cls: string; label: string; dot: string }> = {
  ativo:   { cls: 'bg-verde-claro/15 text-verde-claro border border-verde-claro/30', label: 'Ativo',      dot: 'bg-verde-claro' },
  inativo: { cls: 'bg-amber-400/10 text-amber-300 border border-amber-400/25',       label: 'Em análise', dot: 'bg-amber-400' },
}

export default async function PaginaAnuncios() {
  const supabase = await criarClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: animaisBrutos } = await supabase
    .from('animais')
    .select('id, nome_animal, categoria, sexo, fotos, ativo, criado_em')
    .eq('criador_user_id', user!.id)
    .order('criado_em', { ascending: false })

  const animais = (animaisBrutos as Animal[]) ?? []

  return (
    <div className="min-h-full">
      <AppHeader
        eyebrow="Painel do criador"
        titulo="Meus Anúncios"
        subtitulo={
          animais.length === 0
            ? 'Nenhum animal na vitrine ainda'
            : `${animais.length} ${animais.length === 1 ? 'animal cadastrado' : 'animais cadastrados'}`
        }
      />

      <div className="px-4 pt-2 pb-5">
        {animais.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="relative flex flex-col items-center justify-center py-14 text-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-48 opacity-[0.05]">
                <Image src="/logo.png.jpeg" alt="" fill className="object-contain" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
                🐄
              </div>
              <div>
                <p className="font-serif font-bold text-white text-lg leading-snug">
                  Seu plantel ainda não<br />está na vitrine.
                </p>
                <p className="text-white/40 text-sm mt-2 leading-relaxed">
                  Vamos colocar seu primeiro animal?<br />
                  É rápido e gratuito para começar.
                </p>
              </div>
              <Link
                href="/cadastrar-animal"
                className="bg-verde-claro text-verde-escuro font-black uppercase tracking-wider text-sm px-8 py-3.5 rounded-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg shadow-verde-claro/20"
              >
                Cadastrar primeiro animal
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {animais.map((animal, i) => {
              const s = badgeStatus[animal.ativo ? 'ativo' : 'inativo']
              return (
                <Link
                  key={animal.id}
                  href={`/animal/${animal.id}`}
                  className="fade-up flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 hover:border-white/20 active:scale-[0.98] transition-all duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                    {animal.fotos?.[0] ? (
                      <img src={animal.fotos[0]} alt={animal.nome_animal} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🐄</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{animal.nome_animal}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wide">{animal.categoria} · {animal.sexo}</p>
                  </div>

                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex-shrink-0 ${s.cls}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* FAB + com anel de pulso */}
      <Link
        href="/cadastrar-animal"
        className="ring-pulse relative fixed bottom-24 right-5 w-14 h-14 bg-verde-claro text-verde-escuro rounded-full shadow-xl shadow-verde-claro/30 flex items-center justify-center text-2xl font-black hover:brightness-110 active:scale-95 transition-all duration-200 z-40"
        aria-label="Cadastrar novo animal"
      >
        +
      </Link>
    </div>
  )
}
