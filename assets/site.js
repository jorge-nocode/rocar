// ===================================================================
// ELÉTRICA ROCAR — site.js
// Menu mobile, toast global, newsletter, comportamento comum a todas
// as páginas. Vanilla JS, sem dependências.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNewsletter();
  markActiveNav();
  initThemeToggle();
});

// ---------------------------------------------------------------
// Tema escuro (dark mode) global. A classe 'dark-mode' já é aplicada
// ao <body> assim que a página começa a carregar por um script inline
// no topo do <body> (evita o "flash" de tela clara antes do JS rodar).
// Aqui só ficamos responsáveis por: alternar a classe ao clicar no
// botão do topbar e salvar a escolha no localStorage, para persistir
// entre todas as páginas do site.
// ---------------------------------------------------------------
const THEME_STORAGE_KEY = 'rocarTheme';

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const ativo = document.body.classList.toggle('dark-mode');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, ativo ? 'dark' : 'light');
    } catch (e) { /* localStorage indisponível (modo privado etc.) — ignora */ }
    btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  });

  btn.setAttribute('aria-pressed', document.body.classList.contains('dark-mode') ? 'true' : 'false');
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  if (!hamburger || !drawer || !overlay) return;

  const open = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); };

  hamburger.addEventListener('click', open);
  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a, .mobile-drawer nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

export function showToast(msg, ms = 1800) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), ms);
}
window.showToast = showToast;

function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input.value) return;
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    try {
      const { submitNewsletter } = await import('./supabase-client.js');
      await submitNewsletter(input.value);
      btn.textContent = 'Inscrito ✓';
      input.value = '';
      setTimeout(() => { btn.textContent = original; }, 2500);
    } catch (err) {
      console.error(err);
      btn.textContent = original;
    }
  });
}
