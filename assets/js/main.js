/* =========================================
   FreshMilk — main.js
   - Header scroll state
   - Reveal animations (IntersectionObserver)
   - Number counters
   - Marquee track duplication
   - Smooth in-page anchor scroll (CSS handles base)
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Prevent restored scroll from landing mid-page on fresh loads
  if (!window.location.hash && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  // -------- Header scroll state --------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -------- Reveal --------
  const revealEls = document.querySelectorAll('.reveal');

  function revealIfAboveFold(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
  }

  revealEls.forEach((el) => {
    if (el.closest('.hero')) {
      el.classList.add('is-in');
    }
  });

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px 0px 0px' });

    revealEls.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      if (revealIfAboveFold(el)) {
        el.classList.add('is-in');
        return;
      }
      const groupSiblings = Array.from(el.parentElement?.children || []);
      const idx = groupSiblings.indexOf(el);
      const delay = Math.min(idx, 6) * 60;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  // -------- Counters --------
  function animateCounter(el) {
    const target = el.getAttribute('data-counter');
    const duration = parseInt(el.getAttribute('data-counter-duration') || '1100', 10);
    const isYearMonth = /^\d{4}\.\d{2}$/.test(target);

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    const startTs = performance.now();

    if (isYearMonth) {
      const [year, month] = target.split('.').map(n => parseInt(n, 10));
      const startMonth = 1;
      const tick = (now) => {
        const t = Math.min((now - startTs) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = Math.round(startMonth + (month - startMonth) * eased);
        el.textContent = `${year}.${String(cur).padStart(2, '0')}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return;
    }

    const targetNum = parseFloat(target);
    if (Number.isNaN(targetNum)) {
      el.textContent = target;
      return;
    }
    const pad = (() => {
      const m = target.match(/^0+\d*/);
      return m ? target.length : 0;
    })();

    const tick = (now) => {
      const t = Math.min((now - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = targetNum * eased;
      const out = pad
        ? String(Math.round(cur)).padStart(pad, '0')
        : (Number.isInteger(targetNum) ? String(Math.round(cur)) : cur.toFixed(1));
      el.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  // -------- Marquee: duplicate track for seamless loop --------
  document.querySelectorAll('.marquee').forEach(m => {
    const viewport = m.querySelector('.marquee__viewport');
    if (!viewport) return;
    const track = viewport.querySelector('.marquee__track');
    if (!track) return;
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    viewport.appendChild(clone);
  });

  // -------- Year for "© 2026" — leave for content authoring --------
})();
