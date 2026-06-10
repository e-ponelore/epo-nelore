import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Como Anunciar — e-PO Nelore',
  description:
    'Anuncie seus bovinos Nelore Puro de Origem na maior vitrine digital especializada. Planos a partir de R$ 22,90 por animal.',
}

const planos = [
  {
    nome: 'Avulso',
    preco: '49,90',
    descricao: '1 animal',
    detalhe: 'Ideal para quem quer testar ou anunciar pontualmente',
    destaque: false,
  },
  {
    nome: 'Pequeno Criador',
    preco: '39,90',
    descricao: 'até 5 animais/mês',
    detalhe: 'Perfeito para criadores com plantel pequeno',
    destaque: false,
  },
  {
    nome: 'Médio Criador',
    preco: '29,90',
    descricao: 'até 15 animais/mês',
    detalhe: 'Melhor custo-benefício para criadores em crescimento',
    destaque: true,
  },
  {
    nome: 'Grande Criador',
    preco: '22,90',
    descricao: '30+ animais/mês',
    detalhe: 'Para criadores com alto volume de anúncios',
    destaque: false,
  },
]

const WHATSAPP_CONTATO = '5531999999999'

export default function PaginaAnunciar() {
  return (
    <div className="bg-bege min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-texto mb-4">
            Anuncie seu Nelore P.O.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conecte-se a compradores qualificados em todo o Brasil. Sua genética
            merece visibilidade.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-texto mb-4">
            Como funciona
          </h2>
          <ol className="space-y-4">
            {[
              {
                n: 1,
                texto:
                  'Você entra em contato conosco pelo WhatsApp para fechar o plano desejado.',
              },
              {
                n: 2,
                texto:
                  'Após a confirmação, cadastramos seu perfil e você cadastra seus animais diretamente na plataforma.',
              },
              {
                n: 3,
                texto:
                  'Sua ficha fica visível para compradores de todo o Brasil com fotos, dados zootécnicos e DEPs.',
              },
              {
                n: 4,
                texto:
                  'O comprador entra em contato direto com você via WhatsApp ou telefone — sem intermediação, sem comissão.',
              },
            ].map(({ n, texto }) => (
              <li key={n} className="flex gap-4 items-start">
                <span className="flex-none w-8 h-8 rounded-full bg-verde-claro text-verde-escuro font-bold text-sm flex items-center justify-center">
                  {n}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed pt-1">
                  {texto}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 p-4 bg-bege rounded-xl text-sm text-gray-600">
            <strong className="text-texto">Importante:</strong> a receita da
            plataforma vem do anúncio publicado, não da venda do animal. Você
            nunca paga comissão sobre a negociação.
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-texto text-center mb-6">
          Planos e preços
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className={`rounded-2xl p-6 border-2 transition-shadow ${
                plano.destaque
                  ? 'border-verde-escuro bg-verde-escuro text-white shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plano.destaque && (
                <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  Mais popular
                </span>
              )}
              <h3
                className={`font-serif font-bold text-lg mb-1 ${
                  plano.destaque ? 'text-white' : 'text-texto'
                }`}
              >
                {plano.nome}
              </h3>
              <p
                className={`text-sm mb-3 ${
                  plano.destaque ? 'text-verde-claro' : 'text-gray-500'
                }`}
              >
                {plano.descricao}
              </p>
              <p
                className={`text-3xl font-bold ${
                  plano.destaque ? 'text-white' : 'text-verde-escuro'
                }`}
              >
                R$ {plano.preco}
                <span
                  className={`text-sm font-normal ml-1 ${
                    plano.destaque ? 'text-verde-claro' : 'text-gray-400'
                  }`}
                >
                  / animal
                </span>
              </p>
              <p
                className={`text-xs mt-2 ${
                  plano.destaque ? 'text-verde-claro/80' : 'text-gray-400'
                }`}
              >
                {plano.detalhe}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Escolheu o plano ideal? Fale com a gente agora:
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_CONTATO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#1da851] transition-colors text-base shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Quero anunciar no WhatsApp
          </a>
          <p className="text-xs text-gray-400">
            Ou{' '}
            <Link
              href="/cadastrar-criador"
              className="underline hover:text-verde-escuro"
            >
              preencha o cadastro
            </Link>{' '}
            e aguarde nosso contato.
          </p>
        </div>
      </div>
    </div>
  )
}
