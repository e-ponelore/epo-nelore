import { redirect } from 'next/navigation'

// Esta rota foi substituída pelo fluxo de /cadastro com autenticação
export default function PaginaCadastrarCriador() {
  redirect('/cadastro')
}
