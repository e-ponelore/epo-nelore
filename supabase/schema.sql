-- =====================
-- e-PO Nelore — Schema
-- =====================

-- Tabela: criadores
create table criadores (
  id             uuid        primary key default gen_random_uuid(),
  nome_completo  text        not null,
  nome_fazenda   text        not null,
  estado         text        not null,
  cidade         text        not null,
  telefone       text        not null,
  whatsapp       text        not null,
  email          text        not null,
  criado_em      timestamptz default now()
);

-- Tabela: animais
create table animais (
  id               uuid        primary key default gen_random_uuid(),
  criador_id       uuid        references criadores(id) on delete cascade,
  nome_animal      text        not null,
  sexo             text        not null check (sexo in ('Macho', 'Fêmea')),
  categoria        text        not null check (categoria in ('Reprodutor', 'Matriz', 'Bezerro', 'Novilha')),
  data_nascimento  date        not null,
  peso_kg          numeric,
  registro_abcz    text,
  certificacoes    text,
  dep_desmama      numeric,
  dep_sobreano     numeric,
  dep_acabamento   numeric,
  descricao        text,
  fotos            text[],
  destaque         boolean     default false,
  ativo            boolean     default true,
  criado_em        timestamptz default now()
);

-- ========================
-- Row Level Security (RLS)
-- ========================
alter table criadores enable row level security;
alter table animais    enable row level security;

-- Leitura pública: animais ativos
create policy "animais_leitura_publica"
  on animais for select
  using (ativo = true);

-- Leitura irrestrita (admin, join para criadores)
create policy "animais_leitura_admin"
  on animais for select
  using (true);

-- Leitura pública: criadores (necessário para joins e formulário)
create policy "criadores_leitura_publica"
  on criadores for select
  using (true);

-- Inserção pública: cadastro sem autenticação (MVP)
create policy "criadores_insercao_publica"
  on criadores for insert
  with check (true);

create policy "animais_insercao_publica"
  on animais for insert
  with check (true);

-- Atualização pública: admin sem autenticação (MVP)
create policy "animais_atualizacao_admin"
  on animais for update
  using (true);

-- ========================
-- Storage: bucket público
-- ========================
-- Criar via Dashboard: Storage → New bucket → "fotos-animais" → Public: ON
-- Ou via SQL (requer extensão storage habilitada):

insert into storage.buckets (id, name, public)
values ('fotos-animais', 'fotos-animais', true)
on conflict do nothing;

create policy "fotos_upload_publico"
  on storage.objects for insert
  with check (bucket_id = 'fotos-animais');

create policy "fotos_leitura_publica"
  on storage.objects for select
  using (bucket_id = 'fotos-animais');
