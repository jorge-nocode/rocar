// ===================================================================
// ELÉTRICA ROCAR — supabase/functions/gemini-proxy/index.ts
// Edge Function que faz a ponte com a API do Google Gemini.
// A chave (GEMINI_API_KEY) fica guardada como "secret" no ambiente do
// Supabase — NUNCA trafega para o navegador do admin nem fica salva em
// nenhuma tabela do banco. Só usuários autenticados e cujo e-mail esteja
// na lista de admins autorizados podem chamar esta function.
//
// COMO IMPLANTAR (passo manual — precisa ser feito pelo dono do projeto,
// pois exige a Supabase CLI/token que não está disponível neste ambiente):
//   1. Instale a Supabase CLI (https://supabase.com/docs/guides/cli) e
//      rode `supabase login` + `supabase link --project-ref <seu-ref>`.
//   2. Configure o secret com a chave do Google AI Studio:
//        supabase secrets set GEMINI_API_KEY=SUA_CHAVE_AQUI
//   3. Implante a function:
//        supabase functions deploy gemini-proxy
//   (Alternativa sem CLI: cole este arquivo direto no editor de Edge
//   Functions do Dashboard do Supabase e cadastre o secret em
//   Project Settings > Edge Functions > Secrets.)
// ===================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_MODEL_CANDIDATES = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-3.6-flash'];

// Só estes e-mails podem usar o botão "Gerar com IA" no painel admin —
// mesma lista usada nas políticas RLS do supabase-setup.sql.
const ADMINS_PERMITIDOS = ['santanadds92@gmail.com', 'eletricarocar@gmail.com'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// Mesma lógica/estrutura de chamada usada antes no front-end (admin.js),
// só que agora rodando no servidor com a chave real do ambiente.
async function callGemini(apiKey: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of GEMINI_MODEL_CANDIDATES) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.5,
              maxOutputTokens: 4096,
            },
          }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        const msg = (data.error?.message || '').toLowerCase();
        lastError = new Error(data.error?.message || `Erro na API do Gemini (modelo ${model})`);
        if (
          msg.includes('not found') ||
          msg.includes('not supported') ||
          msg.includes('no longer available') ||
          msg.includes('deprecated')
        ) {
          continue;
        }
        throw lastError;
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = new Error('A IA não retornou nenhum conteúdo.');
        continue;
      }
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError || new Error('Nenhum modelo do Gemini respondeu.');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido.' }, 405);
  }

  try {
    // Valida que quem está chamando é um admin autenticado (mesmo JWT que
    // o painel admin.html usa para logar no Supabase).
    const authHeader = req.headers.get('Authorization') || '';
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user || !ADMINS_PERMITIDOS.includes(user.email || '')) {
      return jsonResponse({ error: 'Não autorizado.' }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return jsonResponse({ error: 'Parâmetro "prompt" ausente ou inválido.' }, 400);
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'GEMINI_API_KEY não configurada nos secrets desta Edge Function.' }, 500);
    }

    const text = await callGemini(apiKey, prompt);
    return jsonResponse({ text });
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Erro inesperado.' }, 500);
  }
});
