// ===================================================================
// ELÉTRICA ROCAR — hero-sparks.js
// Faíscas de esmeril/lixadeira como plano de fundo GLOBAL de toda a
// página (fixo na viewport, atrás de todo o conteúdo). Rajadas com
// trajetória em arco/diagonal, gravidade e traço brilhante, nascendo
// da base e das laterais da tela inteira. Canvas leve, sem imagens,
// pausa quando a aba fica invisível, e respeita prefers-reduced-motion.
// Vanilla JS, sem dependências.
// ===================================================================
(function () {
  const canvas = document.getElementById('hero-sparks');
  if (!canvas || !canvas.getContext) {
    console.warn('[Faíscas Rocar] canvas #hero-sparks não encontrado no DOM — animação não iniciada.');
    return;
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[Faíscas Rocar] prefers-reduced-motion ativo — animação desativada por acessibilidade.');
    return;
  }

  const ctx = canvas.getContext('2d');
  const CORES = ['#FFD23F', '#FFAA00', '#FF9F1C', '#FF4500', '#FF6B35'];
  const GRAVIDADE = 0.045;
  console.log('Faíscas Rocar Iniciadas');

  let w = 0, h = 0, dpr = 1;
  let particles = [];
  let rafId = null;
  let rodando = false;
  let maxParticulas = 55;

  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Menos partículas em telas pequenas, para não pesar no mobile.
    maxParticulas = w < 640 ? 26 : (w < 1024 ? 40 : 60);
  }

  // Cada faísca nasce como uma "rajada" com velocidade inicial rápida
  // (para cima e para um dos lados), e a gravidade vai curvando a
  // trajetória em arco até ela cair/apagar — igual a uma faísca real
  // de esmeril. Nasce da base da tela inteira, ou ocasionalmente das
  // laterais (esquerda/direita), reforçando a sensação de "oficina".
  function novaParticula() {
    const origem = Math.random();
    let x, y, velX, velY;

    if (origem < 0.72) {
      // base da tela inteira
      x = Math.random() * w;
      y = h + Math.random() * 12;
      velX = (Math.random() - 0.5) * 3.2;
      velY = -(2.4 + Math.random() * 3.4);
    } else if (origem < 0.86) {
      // lateral esquerda
      x = -6;
      y = h * (0.35 + Math.random() * 0.65);
      velX = 1.6 + Math.random() * 2.4;
      velY = -(1.2 + Math.random() * 2.4);
    } else {
      // lateral direita
      x = w + 6;
      y = h * (0.35 + Math.random() * 0.65);
      velX = -(1.6 + Math.random() * 2.4);
      velY = -(1.2 + Math.random() * 2.4);
    }

    const tamanho = 1 + Math.random() * 2.2;
    return {
      x, y, prevX: x, prevY: y,
      tamanho,
      velX, velY,
      vida: 0,
      vidaMax: 45 + Math.random() * 55,
      cor: CORES[(Math.random() * CORES.length) | 0]
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

      p.prevX = p.x;
      p.prevY = p.y;
      p.velY += GRAVIDADE; // gravidade puxando a trajetória em arco
      p.velX *= 0.985; // leve resistência do ar
      p.x += p.velX;
      p.y += p.velY;

      const razao = p.vida / p.vidaMax;
      const alpha = razao < 0.08 ? razao / 0.08 : Math.max(0, 1 - (razao - 0.08) / 0.92);

      const foraDaTela = p.x < -30 || p.x > w + 30 || p.y > h + 30;
      if (p.vida >= p.vidaMax || foraDaTela || alpha <= 0) {
        particles[i] = novaParticula();
        continue;
      }

      // Traço brilhante: linha curta entre a posição anterior e a
      // atual, simulando o rastro da faísca em movimento rápido.
      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = Math.max(0.8, p.tamanho * 0.7);
      ctx.lineCap = 'round';
      ctx.shadowColor = p.cor;
      ctx.shadowBlur = 8 + p.tamanho * 2.4;
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();

      // Ponta brilhante da faísca.
      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha * 1.15);
      ctx.fillStyle = p.cor;
      ctx.shadowColor = p.cor;
      ctx.shadowBlur = 10 + p.tamanho * 3.2;
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

  // Este script roda uma única vez por carregamento de página (é uma
  // IIFE, não uma função reutilizável/instanciável), então o listener de
  // resize abaixo é registrado exatamente uma vez por página — não há
  // risco de acúmulo de listeners mesmo em navegação single-page, já que
  // este site não faz SPA routing (cada página é um load completo, que
  // descarta todo o estado de JS anterior, incluindo listeners antigos).
  window.addEventListener('resize', redimensionar);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else iniciar();
  });
})();
