import Link from 'next/link'
import { criarClienteServidor } from '@/lib/supabase-servidor'
import MenuPerfil from './MenuPerfil'

export default async function Header() {
  const supabase = await criarClienteServidor()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let nomeCompleto = ''
  if (user) {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('nome_completo')
      .eq('id', user.id)
      .single()
    nomeCompleto = perfil?.nome_completo ?? user.email ?? ''
  }

  return (
    <header className="bg-verde-escuro text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight hover:text-verde-claro transition-colors"
        >
          e-PO Nelore
        </Link>

        {/* Nav central */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-verde-claro transition-colors">
            Vitrine
          </Link>
          <Link href="/anunciar" className="hover:text-verde-claro transition-colors">
            Como Anunciar
          </Link>
        </nav>

        {/* Ações à direita */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/cadastrar-animal"
                className="hidden sm:inline-flex bg-white text-verde-escuro font-semibold text-sm px-4 py-2 rounded-lg hover:bg-verde-claro transition-colors"
              >
                + Anunciar animal
              </Link>
              <MenuPerfil nomeCompleto={nomeCompleto} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-white text-verde-escuro font-semibold text-sm px-4 py-2 rounded-lg hover:bg-verde-claro transition-colors"
              >
                Anunciar meu animal
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
