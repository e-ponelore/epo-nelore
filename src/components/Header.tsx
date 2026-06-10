import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-verde-escuro text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight hover:text-verde-claro transition-colors"
        >
          e-PO Nelore
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-verde-claro transition-colors"
          >
            Vitrine
          </Link>
          <Link
            href="/anunciar"
            className="hover:text-verde-claro transition-colors"
          >
            Como Anunciar
          </Link>
        </nav>

        <Link
          href="/anunciar"
          className="bg-white text-verde-escuro font-semibold text-sm px-4 py-2 rounded-lg hover:bg-verde-claro transition-colors"
        >
          Anunciar meu animal
        </Link>
      </div>
    </header>
  )
}
