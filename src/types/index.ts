export interface Criador {
  id: string
  nome_completo: string
  nome_fazenda: string
  estado: string
  cidade: string
  telefone: string
  whatsapp: string
  email: string
  criado_em: string
}

export interface Animal {
  id: string
  criador_id: string
  criadores?: Criador
  nome_animal: string
  sexo: 'Macho' | 'Fêmea'
  categoria: 'Reprodutor' | 'Matriz' | 'Bezerro' | 'Novilha'
  data_nascimento: string
  peso_kg: number | null
  registro_abcz: string | null
  certificacoes: string | null
  dep_desmama: number | null
  dep_sobreano: number | null
  dep_acabamento: number | null
  descricao: string | null
  fotos: string[] | null
  destaque: boolean
  ativo: boolean
  criado_em: string
}

export const CATEGORIAS = ['Reprodutor', 'Matriz', 'Bezerro', 'Novilha'] as const
export const SEXOS = ['Macho', 'Fêmea'] as const

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const
