/* =========================================
   FreshMilk — main.js
   - Header scroll state
   - Reveal animations
   - Scroll progress + parallax + nav spy
   ========================================= */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!window.location.hash && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  // -------- Header scroll state --------
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress__bar');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.width = `${pct * 100}%`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // -------- Reveal --------
  const revealEls = document.querySelectorAll('.reveal');

  function revealIfAboveFold(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
  }

  revealEls.forEach((el) => {
    if (el.closest('.hero')) el.classList.add('is-in');
  });

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    revealEls.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      if (revealIfAboveFold(el)) {
        el.classList.add('is-in');
        return;
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  // -------- Timeline draw --------
  const timeline = document.querySelector('[data-timeline]');
  if (timeline && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-active');
          tio.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    tio.observe(timeline);
  } else if (timeline) {
    timeline.classList.add('is-active');
  }

  // -------- Nav section spy --------
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = [...navLinks].map((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const el = id ? document.getElementById(id) : null;
    return el ? { link, el } : null;
  }).filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const match = sections.find((s) => s.el === e.target);
        if (!match) return;
        navLinks.forEach((l) => l.classList.remove('is-active'));
        match.link.classList.add('is-active');
      });
    }, { rootMargin: '-42% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => spy.observe(s.el));
  }

  // -------- Parallax on project art --------
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];

  function updateParallax() {
    if (reduceMotion || !parallaxEls.length) return;
    const vh = window.innerHeight;
    parallaxEls.forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (!img) return;
      const strength = parseFloat(wrap.dataset.parallax || '0.05');
      const rect = wrap.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const delta = (center - vh * 0.5) / vh;
      const y = delta * strength * -120;
      const scale = 1 + Math.abs(delta) * strength * 0.15;
      img.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    });
  }

  // -------- Card tilt (pointer devices) --------
  function initCardTilt() {
    if (reduceMotion || matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const max = parseFloat(card.dataset.tiltMax || '5');

      card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });

      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
      });
    });
  }

  // -------- Primary button micro-lift --------
  function initButtonMotion() {
    if (reduceMotion) return;
    document.querySelectorAll('.btn--primary').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const onParallaxScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    };
    updateParallax();
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    window.addEventListener('resize', onParallaxScroll, { passive: true });
  }

  // -------- Counters (legacy) --------
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

  // -------- Photo slots (auto-swap when files exist in /assets/img/photos/) --------
  function initMediaSlots() {
    document.querySelectorAll('.media-slot').forEach((slot) => {
      const photo = slot.querySelector('.media-slot__photo');
      if (!photo?.getAttribute('src')) return;

      const markLoaded = () => {
        if (photo.naturalWidth > 0) slot.classList.add('has-photo');
      };

      if (photo.complete) {
        markLoaded();
        if (slot.classList.contains('has-photo')) return;
      }

      photo.addEventListener('load', markLoaded, { once: true });
      photo.addEventListener('error', () => photo.remove(), { once: true });

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (photo.loading === 'lazy') photo.loading = 'eager';
            if (photo.complete) markLoaded();
            io.unobserve(slot);
          });
        }, { rootMargin: '240px 0px' });
        io.observe(slot);
      }
    });
  }

  initMediaSlots();
  initCardTilt();
  initButtonMotion();
})();
