# e-PO Nelore

Vitrine digital exclusiva de bovinos **Nelore Puro de Origem (P.O.)**.

Criadores pagam para anunciar seus animais. Compradores acessam gratuitamente e entram em contato direto com o criador via WhatsApp ou telefone — sem chat interno, sem carrinho, sem pagamento dentro da plataforma.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Supabase** (Banco de dados PostgreSQL + Storage para fotos)
- **Tailwind CSS 4**
- **TypeScript**

## Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx               # Layout raiz (fontes, header, footer)
│   ├── page.tsx                 # / — Vitrine pública com filtros
│   ├── animal/[id]/page.tsx     # /animal/[id] — Ficha completa
│   ├── anunciar/page.tsx        # /anunciar — Tabela de preços e CTA
│   ├── cadastrar-criador/       # /cadastrar-criador — Formulário
│   ├── cadastrar-animal/        # /cadastrar-animal — Formulário + upload
│   └── admin/page.tsx           # /admin — Painel de gestão
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CardAnimal.tsx           # Card usado na vitrine
│   ├── FiltrosHome.tsx          # Filtros + busca (Client Component)
│   ├── GaleriaFotos.tsx         # Scroll horizontal de fotos
│   ├── BlocoContato.tsx         # WhatsApp + telefone do criador
│   └── TooltipDEP.tsx           # Tooltip explicativo das DEPs
├── lib/
│   ├── supabase-servidor.ts     # Cliente Supabase para Server Components
│   └── supabase-navegador.ts    # Cliente Supabase singleton para Client Components
└── types/
    └── index.ts                 # Tipos Animal, Criador, constantes
```

## Configuração

1. Clone o repositório
2. Copie `.env.example` para `.env.local` e preencha as variáveis
3. Execute o SQL em `supabase/schema.sql` no painel do Supabase
4. Crie o bucket de Storage: **Storage → New bucket → nome: `fotos-animais` → Public: ON**
5. Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## Deploy (Vercel)

1. Conecte o repositório no Vercel
2. Adicione as variáveis de ambiente no painel do Vercel
3. O deploy é automático a cada push na branch principal

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Vitrine pública — grid de cards com filtros |
| `/animal/[id]` | Ficha completa do animal com DEPs e contato |
| `/anunciar` | Explicação do modelo + tabela de preços |
| `/cadastrar-criador` | Formulário de cadastro do criador |
| `/cadastrar-animal` | Formulário de cadastro do animal + upload de fotos |
| `/admin` | Painel administrativo — ativar/desativar e destacar animais |

## Modelo de negócio

A receita vem do anúncio publicado, não da venda do animal. O comprador entra em contato direto com o criador — sem intermediação de pagamento.
