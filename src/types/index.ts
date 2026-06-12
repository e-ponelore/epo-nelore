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
  criador_user_id: string | null
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

export interface Perfil {
  id: string
  criador_id: string | null
  nome_completo: string
  nome_fazenda: string
  estado: string
  cidade: string
  telefone: string
  whatsapp: string
  plano_atual: 'gratuito' | 'avulso' | 'pequeno' | 'medio' | 'grande'
  criado_em: string
}

export interface Favorito {
  id: string
  usuario_id: string
  animal_id: string
  criado_em: string
  animais?: Animal
}

export const CATEGORIAS = ['Reprodutor', 'Matriz', 'Bezerro', 'Novilha'] as const
export const SEXOS = ['Macho', 'Fêmea'] as const

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

export const PLANOS = {
  gratuito: { nome: 'Gratuito', cor: 'gray' },
  avulso:   { nome: 'Avulso',   cor: 'blue'  },
  pequeno:  { nome: 'Pequeno Criador', cor: 'green' },
  medio:    { nome: 'Médio Criador',   cor: 'emerald' },
  grande:   { nome: 'Grande Criador',  cor: 'yellow' },
} as const
