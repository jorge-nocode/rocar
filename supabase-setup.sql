-- ===================================================================
-- ELÉTRICA ROCAR — supabase-setup.sql
-- Rode este script UMA VEZ no SQL Editor do seu projeto Supabase.
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
  imagem_url text,                   -- URL pública da foto do produto
  status text not null default 'ativo',  -- ativo | inativo
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Configuração chave/valor (uso geral, ex: chave de API de chat)
-- ---------------------------------------------------------------
create table if not exists public.site_config (
  chave text primary key,
  valor text
);

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
-- Sugestão: eletricarocar@gmail.com

-- Leitura pública: só serviços ativos
create policy "publico le servicos ativos" on public.servicos
  for select using (status = 'ativo');

-- Gestão total: só o e-mail autorizado
create policy "admin gerencia servicos" on public.servicos
  for all using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com')
  with check (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

-- Qualquer visitante pode enviar mensagens/solicitações (insert público)
create policy "publico envia contato" on public.mensagens_contato
  for insert with check (true);
create policy "admin le contato" on public.mensagens_contato
  for select using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');
create policy "admin atualiza contato" on public.mensagens_contato
  for update using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "publico envia orcamento" on public.solicitacoes_orcamento
  for insert with check (true);
create policy "admin le orcamento" on public.solicitacoes_orcamento
  for select using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');
create policy "admin atualiza orcamento" on public.solicitacoes_orcamento
  for update using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "publico envia empresa" on public.solicitacoes_empresa
  for insert with check (true);
create policy "admin le empresa" on public.solicitacoes_empresa
  for select using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');
create policy "admin atualiza empresa" on public.solicitacoes_empresa
  for update using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "publico assina newsletter" on public.newsletter
  for insert with check (true);
create policy "admin le newsletter" on public.newsletter
  for select using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "admin gerencia config" on public.site_config
  for all using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com')
  with check (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

-- Leitura pública apenas da chave do chatbot (o widget roda no navegador
-- do visitante e precisa ler essa chave para chamar a API do Gemini).
-- ATENÇÃO: como o site é 100% estático (sem backend próprio), essa chave
-- fica visível no tráfego de rede do navegador de qualquer visitante,
-- assim como aconteceria com qualquer chamada direta client-side a uma
-- API de IA. Para reduzir o risco, use uma chave do Gemini com cota/uso
-- limitado e restrição por domínio (HTTP referrer) no Google AI Studio.
create policy "publico le chave do chatbot" on public.site_config
  for select using (chave = 'chatbot_gemini_key');

-- Leitura pública: só materiais ativos
create policy "publico le materiais ativos" on public.materiais
  for select using (status = 'ativo');

-- Gestão total: só o e-mail autorizado
create policy "admin gerencia materiais" on public.materiais
  for all using (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com')
  with check (auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

-- ===================================================================
-- Storage: bucket de fotos dos serviços
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('servicos-fotos', 'servicos-fotos', true)
on conflict (id) do nothing;

create policy "leitura publica fotos" on storage.objects
  for select using (bucket_id = 'servicos-fotos');

create policy "admin upload fotos" on storage.objects
  for insert with check (bucket_id = 'servicos-fotos' and auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "admin remove fotos" on storage.objects
  for delete using (bucket_id = 'servicos-fotos' and auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

-- ===================================================================
-- Storage: bucket de fotos dos materiais/produtos
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('materiais-fotos', 'materiais-fotos', true)
on conflict (id) do nothing;

create policy "leitura publica fotos materiais" on storage.objects
  for select using (bucket_id = 'materiais-fotos');

create policy "admin upload fotos materiais" on storage.objects
  for insert with check (bucket_id = 'materiais-fotos' and auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');

create policy "admin remove fotos materiais" on storage.objects
  for delete using (bucket_id = 'materiais-fotos' and auth.jwt() ->> 'email' = 'eletricarocar@gmail.com');
