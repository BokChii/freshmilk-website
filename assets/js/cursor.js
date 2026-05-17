/* =========================================
   FreshMilk — cursor.js
   - Few tiny dots in a tight ring at the real pointer (no cross-screen drift)
   - Only draws while pointer is over the document
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

  const COUNT = 6;
  const R_MIN = 7;
  const R_MAX = 16;
  const LERP_CORE = 0.22;

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
      spd: (Math.random() < 0.5 ? -1 : 1) * (0.0012 + Math.random() * 0.0011),
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

  window.addEventListener('resize', () => resize(), { passive: true });

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
    ctx.clearRect(0, 0, w, h);

    if (!active) {
      requestAnimationFrame(step);
      return;
    }

    cx += (mx - cx) * LERP_CORE;
    cy += (my - cy) * LERP_CORE;

    const ax = mx;
    const ay = my;
    const hoverMul = isHover ? 1.12 : 1;
    const t = performance.now() * 0.00012;

    for (const p of particles) {
      p.theta += p.spd * hoverMul + Math.sin(t + p.phase) * 0.00004;
      p.r += (p.rT - p.r) * 0.022;
    }
    if (Math.random() < 0.001) {
      const p = particles[(Math.random() * particles.length) | 0];
      p.rT = R_MIN + Math.random() * (R_MAX - R_MIN);
    }

    const dark = isDarkScheme();
    for (const p of particles) {
      const x = ax + Math.cos(p.theta) * p.r;
      const y = ay + Math.sin(p.theta) * p.r;
      const pr = dark ? 0.65 : 0.55;
      const a = dark ? 0.2 : 0.16;
      ctx.beginPath();
      ctx.arc(x, y, pr, 0, Math.PI * 2);
      ctx.fillStyle = dark ? `rgba(255,255,255,${a})` : `rgba(37,112,242,${a})`;
      ctx.fill();
    }

    const coreR = isHover ? 3.4 : 2.6;
    const ringR = isHover ? 14 : 11;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = isHover ? 'rgba(255,45,135,0.1)' : 'rgba(37,112,242,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, coreR + 1.2, 0, Math.PI * 2);
    ctx.fillStyle = isHover ? 'rgba(255,45,135,0.14)' : 'rgba(37,112,242,0.12)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = isHover ? 'rgba(255,45,135,0.85)' : 'rgba(37,112,242,0.88)';
    ctx.fill();

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
