/* =========================================
   FreshMilk — hero exhibition (aurora + stage)
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero--exhibition');
  if (!hero) return;

  hero.classList.add('hero--ready');

  const aurora = hero.querySelector('[data-hero-aurora]');
  const stage = hero.querySelector('[data-hero-stage]');
  const quiz = hero.querySelector('[data-hero-quiz]');

  let mx = 0.5;
  let my = 0.5;
  let tx = 0.5;
  let ty = 0.5;
  let raf = 0;

  function onPointerMove(e) {
    const rect = hero.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width;
    my = (e.clientY - rect.top) / rect.height;
  }

  function onPointerLeave() {
    mx = 0.5;
    my = 0.5;
  }

  function tick() {
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;

    if (aurora) {
      const dx = (tx - 0.5) * 48;
      const dy = (ty - 0.5) * 36;
      aurora.style.setProperty('--aurora-x', `${dx}px`);
      aurora.style.setProperty('--aurora-y', `${dy}px`);
    }

    if (stage && !reduceMotion) {
      const tiltX = (ty - 0.5) * -10;
      const tiltY = (tx - 0.5) * 12;
      stage.style.transform =
        `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;
    }

    raf = requestAnimationFrame(tick);
  }

  if (!reduceMotion) {
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true });
    raf = requestAnimationFrame(tick);
  }

  if (quiz && !reduceMotion) {
    setInterval(() => {
      quiz.classList.remove('is-pop');
      void quiz.offsetWidth;
      quiz.classList.add('is-pop');
    }, 4200);
  }

  document.addEventListener('lang:change', () => {
    if (stage) stage.style.transform = '';
  });
})();
