// ===================================================================
// ELÉTRICA ROCAR — chatbot.js
// Widget "Técnico Rocar": atendente com respostas rápidas pré-definidas
// que direcionam para o WhatsApp. Não usa IA generativa (sem custo de
// API) — pode ser trocado por integração com Gemini/OpenAI depois,
// seguindo o mesmo padrão do chatbot.js do blueprint original (QRV).
// Injeta o próprio HTML, então basta um <script> em cada página.
// ===================================================================
import { whatsappLink } from './supabase-client.js';

const RESPOSTAS = [
  {
    label: 'Quero orçamento de motor elétrico',
    resposta: 'Rebobinamento de motor monofásico a partir de R$180 e trifásico a partir de R$350. O valor final depende da avaliação. Quer que eu já te leve pro WhatsApp com isso?',
    whats: 'Olá, Técnico Rocar! Preciso de um orçamento para motor elétrico.'
  },
  {
    label: 'Conserto de eletrodoméstico',
    resposta: 'Consertamos micro-ondas, air fryer, liquidificador, ventilador e outros eletrodomésticos. Diagnóstico é gratuito na maioria dos casos.',
    whats: 'Olá, Técnico Rocar! Tenho um eletrodoméstico com defeito.'
  },
  {
    label: 'Bomba de piscina ou de poço',
    resposta: 'Fazemos manutenção completa de bombas de piscina e de poço, com revisão de vedação e rolamento.',
    whats: 'Olá, Técnico Rocar! Preciso de manutenção em uma bomba d\'água.'
  },
  {
    label: 'Horário de funcionamento',
    resposta: 'Estamos abertos todos os dias, das 9h às 22h, na Rua Soldado Francisco de Almeida, 40 — Vila Yaya, Guarulhos.',
  },
  {
    label: 'Falar direto com um técnico',
    resposta: 'Perfeito, vou te levar pro WhatsApp agora.',
    whats: 'Olá! Vim pelo site e quero falar com um técnico.'
  },
];

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
        <div class="chat-bubble">Olá! Eu sou o Técnico Rocar 👋 Como posso te ajudar hoje?</div>
        <div class="chat-quick" id="chat-quick"></div>
      </div>
      <div class="chat-footer">
        <a href="https://wa.me/551134353809" target="_blank" class="btn btn-whats btn-sm btn-block">Falar direto no WhatsApp</a>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
}

function renderQuickReplies() {
  const quick = document.getElementById('chat-quick');
  quick.innerHTML = RESPOSTAS.map((r, i) => `<button data-i="${i}">${r.label}</button>`).join('');
  quick.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = RESPOSTAS[btn.dataset.i];
      addBubble(item.label, true);
      setTimeout(() => {
        addBubble(item.resposta, false);
        if (item.whats) {
          const link = document.createElement('a');
          link.href = whatsappLink(item.whats);
          link.target = '_blank';
          link.className = 'btn btn-whats btn-sm';
          link.style.marginTop = '8px';
          link.style.display = 'inline-flex';
          link.textContent = 'Continuar no WhatsApp';
          document.getElementById('chat-body').appendChild(link);
          document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
        }
      }, 400);
    });
  });
}

function addBubble(text, fromUser) {
  const body = document.getElementById('chat-body');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  if (fromUser) {
    bubble.style.marginLeft = 'auto';
    bubble.style.background = 'var(--red)';
    bubble.style.color = '#fff';
  }
  bubble.textContent = text;
  body.insertBefore(bubble, document.getElementById('chat-quick'));
  body.scrollTop = body.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  injectMarkup();
  renderQuickReplies();
  const toggle = document.getElementById('chat-toggle');
  const label = document.getElementById('chat-label');
  const win = document.getElementById('chat-window');
  const close = document.getElementById('chat-close');
  toggle.addEventListener('click', () => win.classList.toggle('open'));
  label.addEventListener('click', () => win.classList.toggle('open'));
  close.addEventListener('click', () => win.classList.remove('open'));
});
