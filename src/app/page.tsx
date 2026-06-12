import Image from 'next/image'
import BotaoPrincipal from '@/components/BotaoPrincipal'

export default function PaginaEntrada() {
  return (
    <div className="min-h-screen flex flex-col bg-verde-escuro overflow-hidden">

      {/* Grade técnica + glow de fundo */}
      <div className="tech-grid pointer-events-none fixed inset-0 z-0" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,255,77,0.08) 0%, transparent 70%)',
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-14 gap-10">

        {/* ── LOGO com glow ── */}
        <div className="flex flex-col items-center gap-4">
          <div className="logo-glow relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-verde-claro/20 shadow-2xl">
            <Image
              src="/logo.png.jpeg"
              alt="e-PO Nelore"
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
              e-PO Nelore
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="inline-block w-1 h-1 rounded-full bg-verde-claro/60" />
              <span className="text-verde-claro/70 text-xs font-semibold uppercase tracking-widest">
                Puro de Origem Certificado
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-verde-claro/60" />
            </div>
          </div>
        </div>

        {/* ── HEADLINE ── */}
        <div className="text-center max-w-xs">
          <h1 className="font-serif text-3xl font-bold text-white leading-tight">
            A genética que vale milhões,{' '}
            <span className="text-verde-claro">visível em segundos.</span>
          </h1>
          <p className="text-white/45 text-sm mt-3 leading-relaxed">
            Feito por quem entende de boi,<br />
            pra quem entende de boi.
          </p>
        </div>

        {/* ── MOCKUP FLUTUANTE ── */}
        <div
          className="w-full max-w-xs"
          style={{ transform: 'rotate(2deg)' }}
        >
          <div className="bg-white rounded-xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10">
            {/* Foto placeholder */}
            <div className="h-28 bg-gradient-to-br from-verde-escuro/80 to-verde-escuro flex items-end p-3 relative">
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #C8FF4D 0, #C8FF4D 1px, transparent 0, transparent 50%)',
                  backgroundSize: '8px 8px',
                }}
              />
              <div className="relative z-10 flex items-center gap-1.5">
                <span className="bg-verde-claro text-verde-escuro text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide">
                  ✦ P.O. CERTIFICADO
                </span>
                <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide">
                  ★ DESTAQUE
                </span>
              </div>
            </div>
            {/* Info */}
            <div className="p-3.5">
              <p className="font-serif font-bold text-texto text-sm">Nelore Mangabeira FIV</p>
              <p className="text-gray-400 text-xs mt-0.5">Reprodutor · Macho · <span className="font-black text-gray-500">680</span><span className="text-[10px] uppercase font-bold"> kg</span></p>
              <p className="text-gray-300 text-[10px] uppercase tracking-wide mt-0.5">Fazenda São João · MS</p>
              <div className="mt-3 bg-verde-escuro text-verde-claro text-[11px] font-black uppercase tracking-wider py-2 rounded-lg text-center">
                Ver ficha completa →
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="w-full max-w-xs">
          <BotaoPrincipal />
        </div>

        {/* ── Trust bar ── */}
        <div className="flex items-center gap-4 text-white/30 text-[11px] font-medium">
          <span>🇧🇷 Brasil</span>
          <span>·</span>
          <span>100% Nelore P.O.</span>
          <span>·</span>
          <span>ABCZ</span>
        </div>

      </main>
    </div>
  )
}
