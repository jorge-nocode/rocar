// ===================================================================
// ELÉTRICA ROCAR — chatbot.js
// Widget "Técnico Rocar": chat com IA generativa (Google Gemini).
// A chave da API é lida da tabela public.site_config (chave
// 'chatbot_gemini_key') no Supabase, gerenciável pelo painel admin.
// Sem chave configurada (ou modo offline), o widget avisa o visitante
// e direciona para o WhatsApp. Injeta o próprio HTML — basta um
// <script type="module"> em cada página.
// ===================================================================
import { fetchConfig } from './supabase-client.js';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Você é o Técnico Rocar, um assistente virtual e técnico especializado da Elétrica Rocar (oficina de manutenção e retífica de motores elétricos, ferramentas elétricas, bombas e eletrodomésticos).

Seu tom de voz é profissional, prestativo, direto e amigável.

Endereço: Rua Soldado Francisco de Almeida, 40 — Vila Yaya, Guarulhos.
Atendimento: Todos os dias, das 9h às 22h.

Seu objetivo é tirar dúvidas sobre consertos, orçamento, serviços de enrolamento/retífica e incentivar o cliente a clicar no botão de direcionamento para o WhatsApp para fechar o orçamento direto com a equipe.

Responda sempre em português do Brasil, de forma curta e objetiva (no máximo 3-4 frases). Nunca invente preços exatos fechados — sempre diga que o valor final depende de avaliação técnica e incentive o cliente a mandar mensagem no WhatsApp para receber um orçamento preciso.`;

let geminiKeyCache;
let historico = [];

async function getGeminiKey() {
  if (geminiKeyCache !== undefined) return geminiKeyCache;
  try {
    geminiKeyCache = await fetchConfig('chatbot_gemini_key');
  } catch (e) {
    console.error(e);
    geminiKeyCache = null;
  }
  return geminiKeyCache;
}

function injectMarkup() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="chat-label" id="chat-label">Técnico Rocar</div>
    <button class="chat-float" id="chat-toggle" aria-label="Falar com o Técnico Rocar">
      <img src="assets/tecnico-rocar-avatar.png" alt="Técnico Rocar">
    </button>
    <div class="chat-window" id="chat-window">
      <div class="chat-header">
        <img src="assets/tecnico-rocar-avatar.png" alt="Técnico Rocar">
        <div>
          <strong>Técnico Rocar</strong>
          <span>Online agora</span>
        </div>
        <button class="chat-close" id="chat-close" aria-label="Fechar">&times;</button>
      </div>
      <div class="chat-body" id="chat-body">
        <div class="chat-messages" id="chat-messages">
          <div class="chat-bubble bot">Olá! Eu sou o Técnico Rocar 👋 Me conta o que aconteceu com seu equipamento que eu te ajudo.</div>
        </div>
      </div>
      <form class="chat-input-row" id="chat-form">
        <input type="text" id="chat-input" placeholder="Digite sua mensagem..." autocomplete="off" maxlength="500">
        <button type="submit" class="chat-send" id="chat-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>
      <div class="chat-footer">
        <a href="https://wa.me/551134353809" target="_blank" class="btn btn-whats btn-sm btn-block">Falar direto no WhatsApp</a>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
}

function addBubble(text, fromUser) {
  const messages = document.getElementById('chat-messages');
  const body = document.getElementById('chat-body');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble' + (fromUser ? ' user' : ' bot');
  bubble.textContent = text;
  messages.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

function showTyping(show) {
  const messages = document.getElementById('chat-messages');
  const body = document.getElementById('chat-body');
  let indicator = document.getElementById('chat-typing');
  if (show) {
    if (indicator) return;
    indicator = document.createElement('div');
    indicator.className = 'chat-bubble bot chat-typing';
    indicator.id = 'chat-typing';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(indicator);
    body.scrollTop = body.scrollHeight;
  } else if (indicator) {
    indicator.remove();
  }
}

function toggleInput(disabled) {
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  if (input) input.disabled = disabled;
  if (send) send.disabled = disabled;
}

async function responderComGemini(mensagemUsuario) {
  historico.push({ role: 'user', parts: [{ text: mensagemUsuario }] });
  // mantém só as últimas mensagens para não deixar o payload gigante
  if (historico.length > 20) historico = historico.slice(-20);

  showTyping(true);
  toggleInput(true);

  const key = await getGeminiKey();
  if (!key) {
    showTyping(false);
    toggleInput(false);
    addBubble('No momento o chat automático não está disponível, mas te atendemos rapidinho pelo WhatsApp. Clica no botão abaixo!', false);
    return;
  }

  try {
    const resp = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: historico,
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
      })
    });

    if (!resp.ok) throw new Error(`Gemini respondeu ${resp.status}`);

    const data = await resp.json();
    const textoResposta = (data?.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '')
      .join('')
      .trim() || 'Desculpa, não consegui entender direito. Pode reformular ou chamar a gente no WhatsApp?';

    historico.push({ role: 'model', parts: [{ text: textoResposta }] });
    showTyping(false);
    addBubble(textoResposta, false);
  } catch (e) {
    console.error(e);
    showTyping(false);
    addBubble('Tive um problema para responder agora. Chama a gente no WhatsApp que resolvemos rapidinho!', false);
  } finally {
    toggleInput(false);
    document.getElementById('chat-input')?.focus();
  }
}

function wireForm() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';
    addBubble(texto, true);
    responderComGemini(texto);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectMarkup();
  wireForm();
  const toggle = document.getElementById('chat-toggle');
  const label = document.getElementById('chat-label');
  const win = document.getElementById('chat-window');
  const close = document.getElementById('chat-close');
  toggle.addEventListener('click', () => win.classList.toggle('open'));
  label.addEventListener('click', () => win.classList.toggle('open'));
  close.addEventListener('click', () => win.classList.remove('open'));
});
