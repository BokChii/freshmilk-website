/* =========================================
   FreshMilk — cursor.js
   - Sparse particles in a slow ring around the cursor (polar orbit)
   - Desktop + fine pointer + min-width 961px (matches main.css)
   - Respects prefers-reduced-motion
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFine = matchMedia('(pointer: fine)').matches;
  const isWide = matchMedia('(min-width: 961px)').matches;
  if (reduceMotion || !isFine || !isWide) return;

  const HOVER_SEL =
    'a, button, [role="button"], .value-card, .principle, .project-card, .project-main, .team-card, .exp-row';

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-fx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /** Small count: loose halo close to the pointer */
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

  function spawnParticle() {
    const theta = Math.random() * Math.PI * 2;
    const r = R_MIN + Math.random() * (R_MAX - R_MIN);
    return {
      theta,
      r,
      rT: R_MIN + Math.random() * (R_MAX - R_MIN),
      spd: (Math.random() < 0.5 ? -1 : 1) * (0.0045 + Math.random() * 0.0045),
      phase: Math.random() * Math.PI * 2,
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

  window.addEventListener(
    'resize',
    () => {
      resize();
    },
    { passive: true }
  );

  window.addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      const el = document.elementFromPoint(mx, my);
      isHover = !!(el && el.closest && el.closest(HOVER_SEL));
    },
    { passive: true }
  );

  window.addEventListener('pointerleave', () => {
    active = false;
    isHover = false;
  });

  function isDarkScheme() {
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function step() {
    cx += (mx - cx) * LERP_CORE;
    cy += (my - cy) * LERP_CORE;

    const hoverMul = isHover ? 1.28 : 1;

    const t = performance.now() * 0.00035;
    for (const p of particles) {
      p.theta += p.spd * hoverMul + Math.sin(t + p.phase) * 0.00012;
      p.r += (p.rT - p.r) * 0.028;
    }
    if (Math.random() < 0.002) {
      const p = particles[(Math.random() * particles.length) | 0];
      p.rT = R_MIN + Math.random() * (R_MAX - R_MIN);
    }

    ctx.clearRect(0, 0, w, h);

    const dark = isDarkScheme();
    for (const p of particles) {
      const x = cx + Math.cos(p.theta) * p.r;
      const y = cy + Math.sin(p.theta) * p.r;
      const r = dark ? 0.9 : 0.75;
      const a = dark ? 0.22 : 0.18;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = dark ? `rgba(255,255,255,${a})` : `rgba(37,112,242,${a})`;
      ctx.fill();
    }

    if (active) {
      const coreR = isHover ? 4.2 : 3.2;
      const ringR = isHover ? 18 : 14;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = isHover ? 'rgba(255,45,135,0.12)' : 'rgba(37,112,242,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 1.6, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? 'rgba(255,45,135,0.18)' : 'rgba(37,112,242,0.16)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? 'rgba(255,45,135,0.9)' : 'rgba(37,112,242,0.92)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
