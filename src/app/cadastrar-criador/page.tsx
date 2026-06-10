import type { Metadata } from 'next'
import FormularioCriador from './FormularioCriador'

export const metadata: Metadata = {
  title: 'Cadastrar Criador — e-PO Nelore',
  description: 'Cadastre-se como criador e anuncie seus Nelore Puro de Origem.',
}

export default function PaginaCadastrarCriador() {
  return (
    <div className="bg-bege min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-texto mb-2">
            Cadastro de Criador
          </h1>
          <p className="text-gray-600">
            Preencha seus dados. Entraremos em contato para ativar seu anúncio.
          </p>
        </div>
        <FormularioCriador />
      </div>
    </div>
  )
}
