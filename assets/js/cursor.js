/* =========================================
   FreshMilk — cursor.js
   Sparse orbit particles · hero aurora sync
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFine = matchMedia('(pointer: fine)').matches;
  const isWide = matchMedia('(min-width: 961px)').matches;
  if (reduceMotion || !isFine || !isWide) return;

  const HOVER_SEL =
    'a, button, [role="button"], .value-card, .principle, .project-card, .project-main, .team-card, .exp-row';

  const hero = document.querySelector('.hero--exhibition');
  const heroAurora = hero?.querySelector('[data-hero-aurora]');

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-fx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const COUNT = 14;
  const R_MIN = 12;
  const R_MAX = 38;
  const LERP_CORE = 0.12;

  const particles = [];

  let dpr = 1;
  let w = 0;
  let h = 0;
  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;
  let active = false;
  let isHover = false;
  let inHero = false;
  let auroraX = 0;
  let auroraY = 0;

  function spawnParticle() {
    const theta = Math.random() * Math.PI * 2;
    const r = R_MIN + Math.random() * (R_MAX - R_MIN);
    return {
      theta,
      r,
      rT: R_MIN + Math.random() * (R_MAX - R_MIN),
      spd: (Math.random() < 0.5 ? -1 : 1) * (0.0052 + Math.random() * 0.0052),
      phase: Math.random() * Math.PI * 2,
      tone: Math.random(),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) particles.push(spawnParticle());
  }

  resize();
  initParticles();
  mx = cx = w * 0.5;
  my = cy = h * 0.5;

  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      const el = document.elementFromPoint(mx, my);
      isHover = !!(el && el.closest && el.closest(HOVER_SEL));

      if (hero) {
        const rect = hero.getBoundingClientRect();
        inHero = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
      }
    },
    { passive: true }
  );

  window.addEventListener('pointerleave', () => {
    active = false;
    isHover = false;
    inHero = false;
  });

  function isDarkScheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function readAuroraOffset() {
    if (!heroAurora) return;
    const styles = getComputedStyle(heroAurora);
    auroraX = parseFloat(styles.getPropertyValue('--aurora-x')) || 0;
    auroraY = parseFloat(styles.getPropertyValue('--aurora-y')) || 0;
  }

  function step() {
    readAuroraOffset();

    const lerp = inHero ? 0.16 : LERP_CORE;
    const ox = inHero ? auroraX * 0.35 : 0;
    const oy = inHero ? auroraY * 0.35 : 0;
    cx += (mx + ox - cx) * lerp;
    cy += (my + oy - cy) * lerp;

    const hoverMul = isHover ? 1.22 : 1;
    const heroMul = inHero ? 1.45 : 1;
    const speedMul = hoverMul * heroMul;

    const t = performance.now() * 0.00035;
    for (const p of particles) {
      p.theta += p.spd * speedMul + Math.sin(t + p.phase) * 0.00012;
      p.r += (p.rT - p.r) * 0.028;
    }
    if (Math.random() < (inHero ? 0.004 : 0.002)) {
      const p = particles[(Math.random() * particles.length) | 0];
      p.rT = R_MIN + Math.random() * (R_MAX - R_MIN);
    }

    ctx.clearRect(0, 0, w, h);

    const dark = isDarkScheme();
    for (const p of particles) {
      const x = cx + Math.cos(p.theta) * p.r;
      const y = cy + Math.sin(p.theta) * p.r;
      const r = dark ? 0.95 : 0.8;
      let a = dark ? 0.24 : 0.2;
      if (inHero) a += 0.08;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (inHero && p.tone > 0.55) {
        ctx.fillStyle = dark ? `rgba(110,207,246,${a})` : `rgba(110,207,246,${a * 0.85})`;
      } else if (isHover) {
        ctx.fillStyle = dark ? `rgba(185,28,28,${a * 0.9})` : `rgba(37,112,242,${a * 1.1})`;
      } else {
        ctx.fillStyle = dark ? `rgba(255,255,255,${a * 0.85})` : `rgba(37,112,242,${a})`;
      }
      ctx.fill();
    }

    if (active) {
      const coreR = isHover ? 4.2 : inHero ? 3.8 : 3.2;
      const ringR = isHover ? 18 : inHero ? 17 : 14;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = isHover
        ? 'rgba(185,28,28,0.14)'
        : inHero
          ? 'rgba(110,207,246,0.16)'
          : 'rgba(37,112,242,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 1.6, 0, Math.PI * 2);
      ctx.fillStyle = isHover
        ? 'rgba(185,28,28,0.2)'
        : inHero
          ? 'rgba(110,207,246,0.2)'
          : 'rgba(37,112,242,0.16)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = isHover
        ? 'rgba(185,28,28,0.92)'
        : inHero
          ? 'rgba(37,112,242,0.95)'
          : 'rgba(37,112,242,0.92)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
