/* =========================================
   FreshMilk — Phase 3 personality micro-interactions
   Section settle bounce · exhibit annotations reveal
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sections = document.querySelectorAll('.section--exhibit');
  if (sections.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-settled');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    sections.forEach((s) => io.observe(s));
  } else {
    sections.forEach((s) => s.classList.add('is-settled'));
  }

  document.querySelectorAll('[data-exhibit-pop]').forEach((el, i) => {
    el.style.setProperty('--exhibit-delay', `${i * 90}ms`);
    if (reduceMotion) {
      el.classList.add('is-visible');
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        });
      }, { threshold: 0.2 });
      io.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  });
})();
