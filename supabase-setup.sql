-- ===================================================================
-- ELÉTRICA ROCAR — supabase-setup.sql
-- Rode este script no SQL Editor do seu projeto Supabase. Pode rodar
-- quantas vezes precisar (é seguro/idempotente): tabelas usam
-- "if not exists", buckets usam "on conflict do nothing" e as políticas
-- são recriadas com "drop policy if exists" antes de cada "create policy".
-- Depois cole a URL do projeto e a chave anon em assets/supabase-client.js
-- ===================================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Serviços / itens de manutenção
-- ---------------------------------------------------------------
create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  titulo text not null,
  categoria text not null,           -- motores-monofasicos | motores-trifasicos | eletrodomesticos | bombas | ferramentas | ventilacao | climatizacao
  marca text,                        -- marca/fabricante do equipamento
  descricao text,
  preco numeric,                     -- preço "a partir de" (pode ficar nulo = "sob orçamento")
  preco_promocional numeric,
  estoque_status text not null default 'disponivel', -- disponivel | sob_encomenda | esgotado
  fotos text[] default '{}',
  destaque boolean default false,
  status text not null default 'ativo',  -- ativo | inativo | arquivado
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Mensagens de contato (Fale Conosco)
-- ---------------------------------------------------------------
create table if not exists public.mensagens_contato (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  mensagem text not null,
  lida boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Solicitações de orçamento (formulário principal do site)
-- ---------------------------------------------------------------
create table if not exists public.solicitacoes_orcamento (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  tipo_equipamento text,
  marca_equipamento text,
  problema text,
  observacoes text,
  status text not null default 'novo',  -- novo | em_analise | orcado | concluido
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Solicitações de atendimento para empresas/indústrias (B2B)
-- ---------------------------------------------------------------
create table if not exists public.solicitacoes_empresa (
  id uuid primary key default gen_random_uuid(),
  empresa text not null,
  responsavel text,
  telefone text not null,
  segmento text,
  observacoes text,
  status text not null default 'novo',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Materiais / peças à venda (loja de materiais.html)
-- ---------------------------------------------------------------
create table if not exists public.materiais (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  titulo text not null,
  categoria text not null,           -- slug livre, ex: isolacao | fios-de-cobre | microondas-seminovos ...
  aplicacao text,                    -- motores | bombas | ferramentas | eletrodomesticos | geral
  descricao text,
  preco numeric not null,            -- preço "a partir de"
  imagem text,                       -- URL pública da 1ª foto (coluna principal usada pelo admin)
  imagem_url text,                   -- alias/compatibilidade — mesmo valor de "imagem"
  fotos text[] default '{}',         -- galeria completa (página de produto com miniaturas/zoom)
  status text not null default 'ativo',  -- ativo | inativo
  created_at timestamptz default now()
);

-- Caso a tabela já existisse (criada antes dessas colunas existirem),
-- garante que elas sejam adicionadas sem apagar nada.
alter table public.materiais add column if not exists imagem text;
alter table public.materiais add column if not exists imagem_url text;
alter table public.materiais add column if not exists fotos text[] default '{}';

-- ---------------------------------------------------------------
-- Configuração chave/valor (uso geral, ex: chave de API de chat)
-- ---------------------------------------------------------------
create table if not exists public.site_config (
  chave text primary key,
  valor text
);

-- Limpeza: remove a chave do Gemini que porventura já esteja salva em
-- texto puro na tabela (versões antigas do admin salvavam aqui). A partir
-- de agora a chave só existe como secret da Edge Function "gemini-proxy"
-- (configurada via `supabase secrets set GEMINI_API_KEY=...`).
delete from public.site_config where chave = 'chatbot_gemini_key';

-- ===================================================================
-- RLS (Row Level Security)
-- ===================================================================
alter table public.servicos enable row level security;
alter table public.mensagens_contato enable row level security;
alter table public.solicitacoes_orcamento enable row level security;
alter table public.solicitacoes_empresa enable row level security;
alter table public.newsletter enable row level security;
alter table public.site_config enable row level security;
alter table public.materiais enable row level security;

-- >>> TROQUE pelo e-mail que você vai usar para logar no painel admin <<<
-- (mesmo e-mail cadastrado em Supabase Authentication > Users)
-- Sugestão: santanadds92@gmail.com

-- Leitura pública: só serviços ativos
drop policy if exists "publico le servicos ativos" on public.servicos;
create policy "publico le servicos ativos" on public.servicos
  for select using (status = 'ativo');

-- Gestão total: só o e-mail autorizado
drop policy if exists "admin gerencia servicos" on public.servicos;
create policy "admin gerencia servicos" on public.servicos
  for all using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

-- Qualquer visitante pode enviar mensagens/solicitações (insert público)
drop policy if exists "publico envia contato" on public.mensagens_contato;
create policy "publico envia contato" on public.mensagens_contato
  for insert with check (true);
drop policy if exists "admin le contato" on public.mensagens_contato;
create policy "admin le contato" on public.mensagens_contato
  for select using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin atualiza contato" on public.mensagens_contato;
create policy "admin atualiza contato" on public.mensagens_contato
  for update using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin remove contato" on public.mensagens_contato;
create policy "admin remove contato" on public.mensagens_contato
  for delete using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

drop policy if exists "publico envia orcamento" on public.solicitacoes_orcamento;
create policy "publico envia orcamento" on public.solicitacoes_orcamento
  for insert with check (true);
drop policy if exists "admin le orcamento" on public.solicitacoes_orcamento;
create policy "admin le orcamento" on public.solicitacoes_orcamento
  for select using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin atualiza orcamento" on public.solicitacoes_orcamento;
create policy "admin atualiza orcamento" on public.solicitacoes_orcamento
  for update using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin remove orcamento" on public.solicitacoes_orcamento;
create policy "admin remove orcamento" on public.solicitacoes_orcamento
  for delete using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

drop policy if exists "publico envia empresa" on public.solicitacoes_empresa;
create policy "publico envia empresa" on public.solicitacoes_empresa
  for insert with check (true);
drop policy if exists "admin le empresa" on public.solicitacoes_empresa;
create policy "admin le empresa" on public.solicitacoes_empresa
  for select using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin atualiza empresa" on public.solicitacoes_empresa;
create policy "admin atualiza empresa" on public.solicitacoes_empresa
  for update using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin remove empresa" on public.solicitacoes_empresa;
create policy "admin remove empresa" on public.solicitacoes_empresa
  for delete using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

drop policy if exists "publico assina newsletter" on public.newsletter;
create policy "publico assina newsletter" on public.newsletter
  for insert with check (true);
drop policy if exists "admin le newsletter" on public.newsletter;
create policy "admin le newsletter" on public.newsletter
  for select using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
drop policy if exists "admin remove newsletter" on public.newsletter;
create policy "admin remove newsletter" on public.newsletter
  for delete using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

-- site_config: 100% restrita a admins (select/insert/update/delete).
-- A chave do Gemini (chatbot_gemini_key) NÃO é mais lida pelo navegador:
-- a chamada à API do Gemini agora passa pela Edge Function "gemini-proxy",
-- que lê a chave como secret do próprio ambiente do Supabase (nunca do
-- banco). Por isso não existe mais nenhuma policy de leitura pública
-- aqui — nem para essa chave nem para qualquer outra futura entrada
-- desta tabela.
drop policy if exists "publico le chave do chatbot" on public.site_config;
drop policy if exists "admin gerencia config" on public.site_config;
create policy "admin gerencia config" on public.site_config
  for all using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

-- Leitura pública: só materiais ativos
drop policy if exists "publico le materiais ativos" on public.materiais;
create policy "publico le materiais ativos" on public.materiais
  for select using (status = 'ativo');

-- Gestão total: só o e-mail autorizado
drop policy if exists "admin gerencia materiais" on public.materiais;
create policy "admin gerencia materiais" on public.materiais
  for all using (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'))
  with check (auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

-- ===================================================================
-- Storage: bucket de fotos dos serviços
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('servicos-fotos', 'servicos-fotos', true)
on conflict (id) do nothing;

drop policy if exists "leitura publica fotos" on storage.objects;
create policy "leitura publica fotos" on storage.objects
  for select using (bucket_id = 'servicos-fotos');

drop policy if exists "admin upload fotos" on storage.objects;
create policy "admin upload fotos" on storage.objects
  for insert with check (bucket_id = 'servicos-fotos' and auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

drop policy if exists "admin remove fotos" on storage.objects;
create policy "admin remove fotos" on storage.objects
  for delete using (bucket_id = 'servicos-fotos' and auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

-- ===================================================================
-- Storage: bucket de fotos dos materiais/produtos
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('materiais-fotos', 'materiais-fotos', true)
on conflict (id) do nothing;

drop policy if exists "leitura publica fotos materiais" on storage.objects;
create policy "leitura publica fotos materiais" on storage.objects
  for select using (bucket_id = 'materiais-fotos');

drop policy if exists "admin upload fotos materiais" on storage.objects;
create policy "admin upload fotos materiais" on storage.objects
  for insert with check (bucket_id = 'materiais-fotos' and auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));

drop policy if exists "admin remove fotos materiais" on storage.objects;
create policy "admin remove fotos materiais" on storage.objects
  for delete using (bucket_id = 'materiais-fotos' and auth.jwt() ->> 'email' in ('santanadds92@gmail.com', 'eletricarocar@gmail.com'));
