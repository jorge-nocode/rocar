# Elétrica Rocar

Site institucional e catálogo de serviços da **Elétrica Rocar** — assistência técnica de motores
elétricos, eletrodomésticos e ferramentas elétricas em Guarulhos - SP.

## Stack

HTML5 + CSS3 + JavaScript puro (vanilla), sem framework, sem build step. Supabase é chamado
diretamente do navegador via `<script type="module">`. Deploy estático (Vercel, GitHub Pages ou
similar) direto a partir deste repositório.

## Estrutura

```
index.html          → Home
servicos.html        → Catálogo de serviços com filtros
servico.html          → Página de um serviço específico
orcamento.html        → Solicitar orçamento (formulário + tabela de preços)
contato.html           → Fale Conosco
quem-somos.html         → Institucional
empresas.html            → Atendimento B2B / manutenção recorrente
admin.html                → Painel administrativo (login + CRUD)
assets/
  style.css              → CSS único do site
  supabase-client.js      → Client Supabase + funções de dados
  site.js                  → Menu mobile, newsletter, toast
  forms.js                  → Envio dos formulários públicos
  admin.js                   → Lógica do painel admin
  fotos-oficina/               → Fotos reais da oficina
supabase-setup.sql       → Script único de criação de tabelas + RLS
seed-servicos.sql          → Dados de exemplo para o catálogo
```

## Como conectar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, rode `supabase-setup.sql` (cria tabelas e permissões).
   Opcionalmente rode também `seed-servicos.sql` para já ver o catálogo populado.
3. Em **Authentication > Users**, crie o usuário com o e-mail que vai logar no painel admin
   (ajuste o e-mail usado nas políticas RLS do `supabase-setup.sql` se for diferente de
   `eletricarocar@gmail.com`).
4. Em **Project Settings > API**, copie a **URL** e a **anon public key**.
5. Cole os dois valores em `assets/supabase-client.js`, nas constantes `SUPABASE_URL` e
   `SUPABASE_ANON_KEY`.

Até essas credenciais serem preenchidas, o site funciona em **modo offline**: o catálogo mostra
dados de exemplo e os formulários apenas registram no console do navegador (nada é perdido, mas
nada é salvo de fato).

## Cadastro de serviços

Depois do Supabase conectado, todo o cadastro de serviços (título, categoria, preço, fotos etc.)
é feito pelo `admin.html` — não é necessário editar HTML para adicionar novos serviços.

## WhatsApp

O número usado em todos os CTAs do site é **(11) 3435-3809**, configurado em
`assets/supabase-client.js` (`WHATSAPP_NUMERO`).
