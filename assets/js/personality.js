/* =========================================
   FreshMilk — Phase 3 section settle motion
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.section--exhibit');

  if (!sections.length) return;

  if ('IntersectionObserver' in window && !reduceMotion) {
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
})();
