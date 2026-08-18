// ===================================================================
// ELÉTRICA ROCAR — site.js
// Menu mobile, toast global, newsletter, comportamento comum a todas
// as páginas. Vanilla JS, sem dependências.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  markActiveNav();
  initThemeToggle();
  initCookieBanner();
  initLazyVideos();
});

// ---------------------------------------------------------------
// Vídeos abaixo da dobra (ex: banner promocional de micro-ondas
// seminovos) só carregam de fato quando entram na viewport — evita
// baixar megabytes de vídeo em conexões 3G/4G para quem nem chega a
// rolar até aquele trecho da página. Os <source> desses vídeos usam
// "data-src" em vez de "src"; aqui a gente troca para o atributo real
// e chama load()+play() só quando o <video class="lazy-video"> aparece
// na tela.
// ---------------------------------------------------------------
function initLazyVideos() {
  const videos = document.querySelectorAll('video.lazy-video');
  if (!videos.length) return;

  const carregar = (video) => {
    if (video.dataset.carregado) return;
    video.dataset.carregado = '1';
    video.querySelectorAll('source[data-src]').forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
    video.setAttribute('autoplay', '');
    video.play().catch(() => { /* autoplay pode ser bloqueado — sem problema, fica no poster */ });
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(carregar); // navegador antigo: carrega direto
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        carregar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });

  videos.forEach(v => observer.observe(v));
}

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

// ---------------------------------------------------------------
// Banner de cookies (LGPD). Simples e não invasivo: some assim que o
// visitante clica em "Entendi" e a escolha fica salva no localStorage
// para não aparecer de novo nas próximas visitas/páginas.
// ---------------------------------------------------------------
const COOKIE_CONSENT_KEY = 'rocarCookieConsent';

function initCookieBanner() {
  let jaAceitou = true;
  try {
    jaAceitou = !!localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (e) {
    return; // localStorage indisponível — não força o banner.
  }
  if (jaAceitou) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <p>Este site usa cookies e armazenamento local para melhorar sua navegação. Ao continuar, você concorda com nossa <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>
    <button type="button" class="btn btn-primary btn-sm" id="cookie-banner-aceitar">Entendi</button>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('show'));

  banner.querySelector('#cookie-banner-aceitar').addEventListener('click', () => {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, '1'); } catch (e) { /* ignora */ }
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
  });
}
