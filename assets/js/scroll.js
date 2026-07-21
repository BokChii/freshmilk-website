/* =========================================
   FreshMilk — scroll choreography (Phase 2)
   Storit scale · About pin · polaroid drop · Lenis
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  const mobile = () => window.innerWidth < 960;

  let lenis = null;
  const updaters = [];

  function onScrollFrame() {
    updaters.forEach((fn) => fn());
  }

  function bindScroll(fn) {
    updaters.push(fn);
    fn();
  }

  // -------- Lenis smooth scroll (desktop, fine pointer) --------
  function initLenis() {
    if (reduceMotion || coarsePointer || mobile() || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    lenis.on('scroll', () => {
      onScrollFrame();
      window.dispatchEvent(new Event('scroll'));
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // -------- Storit scroll scale --------
  function initStoritScale() {
    const wrap = document.querySelector('[data-scroll-scale]');
    if (!wrap || reduceMotion) return;

    bindScroll(() => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.92;
      const end = vh * 0.18;
      const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const scale = 0.9 + t * 0.1;
      wrap.style.setProperty('--scroll-scale', scale.toFixed(4));
      wrap.classList.toggle('is-scaled-in', t > 0.55);
    });
  }

  // -------- About horizontal pin --------
  function initAboutPin() {
    const pin = document.querySelector('[data-about-pin]');
    if (!pin) return;

    const track = pin.querySelector('.about-pin__track');
    const panels = track ? [...track.children] : [];
    const dots = pin.querySelectorAll('.about-pin__dot');
    if (!track || !panels.length) return;

    function layout() {
      if (mobile() || reduceMotion) {
        pin.style.height = '';
        track.style.transform = '';
        pin.classList.add('about-pin--static');
        return;
      }

      pin.classList.remove('about-pin--static');
      pin.style.height = `${panels.length * 100}vh`;
    }

    function update() {
      if (mobile() || reduceMotion || pin.classList.contains('about-pin--static')) return;

      const rect = pin.getBoundingClientRect();
      const max = pin.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = max > 0 ? Math.min(scrolled / max, 1) : 0;

      const trackWidth = track.scrollWidth - window.innerWidth + 48;
      const x = -progress * Math.max(trackWidth, 0);
      track.style.transform = `translate3d(${x}px, 0, 0)`;

      const active = Math.min(
        panels.length - 1,
        Math.floor(progress * panels.length + 0.001)
      );
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
      pin.style.setProperty('--pin-progress', progress.toFixed(4));
    }

    layout();
    bindScroll(update);
    window.addEventListener('resize', layout, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  // -------- Team polaroid drop --------
  function initPolaroidDrop() {
    const cards = document.querySelectorAll('[data-polaroid-drop]');
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const tilt = ((i % 2 === 0 ? -1 : 1) * (1.5 + Math.random() * 2)).toFixed(2);
      card.style.setProperty('--polaroid-tilt', `${tilt}deg`);
      card.style.setProperty('--drop-delay', `${i * 140}ms`);
    });

    if (reduceMotion) {
      cards.forEach((c) => c.classList.add('is-dropped'));
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-dropped');
          io.unobserve(e.target);
        });
      }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });

      cards.forEach((c) => io.observe(c));
    } else {
      cards.forEach((c) => c.classList.add('is-dropped'));
    }
  }

  initLenis();
  initStoritScale();
  initAboutPin();
  initPolaroidDrop();

  if (!lenis) {
    window.addEventListener('scroll', onScrollFrame, { passive: true });
    window.addEventListener('resize', onScrollFrame, { passive: true });
  }
})();
