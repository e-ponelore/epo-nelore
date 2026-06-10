import { createClient } from '@supabase/supabase-js'

let cliente: ReturnType<typeof createClient> | null = null

export function obterClienteNavegador() {
  if (!cliente) {
    cliente = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return cliente
}
