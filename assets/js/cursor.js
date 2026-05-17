/* =========================================
   FreshMilk — cursor.js
   - Mouse trailer (desktop, non-touch, motion OK)
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFine = matchMedia('(pointer: fine)').matches;
  const isWide = matchMedia('(min-width: 1025px)').matches;
  if (reduceMotion || !isFine || !isWide) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mx = -100, my = -100;
  let cx = mx, cy = my;
  const LERP = 0.18;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!dot.classList.contains('is-active')) dot.classList.add('is-active');
  }, { passive: true });

  window.addEventListener('pointerleave', () => dot.classList.remove('is-active'));

  const hoverSel = 'a, button, [role="button"], .value-card, .principle, .project-card, .project-main, .team-card, .stat, .exp-row';
  document.addEventListener('pointerover', e => {
    if (e.target.closest && e.target.closest(hoverSel)) {
      dot.classList.add('is-hover');
    }
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest && e.target.closest(hoverSel)) {
      dot.classList.remove('is-hover');
    }
  });

  function tick() {
    cx += (mx - cx) * LERP;
    cy += (my - cy) * LERP;
    dot.style.transform = `translate3d(${cx - 6}px, ${cy - 6}px, 0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
