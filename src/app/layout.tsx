import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'e-PO Nelore — Vitrine de Nelore Puro de Origem',
  description:
    'Vitrine digital exclusiva de bovinos Nelore Puro de Origem. Reprodutores, matrizes, bezerros e novilhas de alta genética.',
  icons: {
    icon: '/logo.png.jpeg',
    apple: '/logo.png.jpeg',
  },
}

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-bege font-sans text-texto antialiased">
        {children}
      </body>
    </html>
  )
}
