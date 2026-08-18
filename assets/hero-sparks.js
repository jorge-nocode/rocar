// ===================================================================
// ELÉTRICA ROCAR — hero-sparks.js
// Camada de faíscas de esmeril/lixadeira animadas no fundo do hero da
// home. Canvas leve, partículas simples (sem imagens), pausa quando a
// aba fica invisível ou o hero sai da viewport, e respeita
// prefers-reduced-motion. Vanilla JS, sem dependências.
// ===================================================================
(function () {
  const canvas = document.getElementById('hero-sparks');
  if (!canvas || !canvas.getContext) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const wrap = canvas.parentElement;
  const ctx = canvas.getContext('2d');

  const CORES = ['#FFD23F', '#FF9F1C', '#FF4B1F', '#FFEA00', '#FF6B35'];

  let w = 0, h = 0, dpr = 1;
  let particles = [];
  let rafId = null;
  let rodando = false;
  let maxParticulas = 40;

  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = wrap.clientWidth;
    h = wrap.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Menos partículas em telas pequenas, para não pesar no mobile.
    maxParticulas = w < 640 ? 18 : (w < 1024 ? 28 : 42);
  }

  function novaParticula() {
    const tamanho = 1 + Math.random() * 2.4;
    return {
      x: Math.random() * w,
      y: h + Math.random() * 14,
      tamanho,
      velY: 0.55 + Math.random() * 1.5,
      velX: (Math.random() - 0.5) * 0.9,
      vida: 0,
      vidaMax: 55 + Math.random() * 75,
      cor: CORES[(Math.random() * CORES.length) | 0],
      flicker: Math.random() * Math.PI * 2
    };
  }

  function garantirParticulas() {
    while (particles.length < maxParticulas) particles.push(novaParticula());
  }

  function desenhar() {
    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vida++;
      p.x += p.velX + Math.sin((p.vida + p.flicker) * 0.12) * 0.35;
      p.y -= p.velY;
      p.velY *= 0.995;

      const razao = p.vida / p.vidaMax;
      const alpha = razao < 0.12 ? razao / 0.12 : Math.max(0, 1 - (razao - 0.12) / 0.88);

      if (p.vida >= p.vidaMax || p.y < -12 || alpha <= 0) {
        particles[i] = novaParticula();
        continue;
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.cor;
      ctx.shadowColor = p.cor;
      ctx.shadowBlur = 5 + p.tamanho * 2.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function loop() {
    if (!rodando) return;
    garantirParticulas();
    desenhar();
    rafId = requestAnimationFrame(loop);
  }

  function iniciar() {
    if (rodando) return;
    rodando = true;
    loop();
  }

  function parar() {
    rodando = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  redimensionar();
  garantirParticulas();
  iniciar();

  window.addEventListener('resize', redimensionar);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else iniciar();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? iniciar() : parar()));
    }, { threshold: 0.05 });
    io.observe(wrap);
  }
})();
