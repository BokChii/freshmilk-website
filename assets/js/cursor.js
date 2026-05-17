/* =========================================
   FreshMilk — cursor.js
   - Canvas particle field: soft attractor + swirl ("vacuum / orbit" feel)
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

  const COUNT = 72;
  const LERP_CORE = 0.2;
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
    const W = window.innerWidth;
    const H = window.innerHeight;
    const margin = 60;
    const side = Math.floor(Math.random() * 4);
    let x;
    let y;
    if (side === 0) {
      x = Math.random() * W;
      y = -margin;
    } else if (side === 1) {
      x = W + margin;
      y = Math.random() * H;
    } else if (side === 2) {
      x = Math.random() * W;
      y = H + margin;
    } else {
      x = -margin;
      y = Math.random() * H;
    }
    const ang = Math.random() * Math.PI * 2;
    const s = Math.random() * 0.35;
    return { x, y, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s };
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

    const pull = isHover ? 1.05 : 0.68;
    const swirl = isHover ? 0.026 : 0.016;
    const damp = isHover ? 0.972 : 0.978;

    for (const p of particles) {
      const dx = cx - p.x;
      const dy = cy - p.y;
      const dist = Math.hypot(dx, dy) + 10;
      const inv = (pull * 5200) / (dist * dist);
      p.vx += dx * inv;
      p.vy += dy * inv;
      p.vx += -dy * swirl;
      p.vy += dx * swirl;
      p.vx *= damp;
      p.vy *= damp;
      p.x += p.vx;
      p.y += p.vy;

      if (dist < 11 + Math.random() * 7) {
        Object.assign(p, spawnParticle());
      }
      if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100) {
        Object.assign(p, spawnParticle());
      }
    }

    ctx.clearRect(0, 0, w, h);

    const dark = isDarkScheme();
    for (const p of particles) {
      const speed = Math.hypot(p.vx, p.vy);
      const r = 0.55 + Math.min(2.1, speed * 1.8);
      const a = dark
        ? 0.12 + Math.min(0.38, speed * 0.045)
        : 0.08 + Math.min(0.22, speed * 0.035);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = dark ? `rgba(255,255,255,${a})` : `rgba(37,112,242,${a})`;
      ctx.fill();
    }

    if (active) {
      const coreR = isHover ? 5.5 : 3.8;
      const ringR = isHover ? 22 : 16;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = isHover ? 'rgba(255,45,135,0.14)' : 'rgba(37,112,242,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? 'rgba(255,45,135,0.22)' : 'rgba(37,112,242,0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? 'rgba(255,45,135,0.92)' : 'rgba(37,112,242,0.95)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
