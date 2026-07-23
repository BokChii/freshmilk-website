/* =========================================
   FreshMilk — i18n loader
   - Loads /i18n/{lang}.json
   - Applies to elements with data-i18n / data-i18n-html / data-i18n-attr
   - Persists choice in localStorage
   ========================================= */
(() => {
  const SUPPORTED = ['ko', 'en'];
  const STORAGE_KEY = 'fm-lang';

  const cache = {};

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj);
  }

  async function loadDict(lang) {
    if (cache[lang]) return cache[lang];
    const res = await fetch(`/i18n/${lang}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
    const data = await res.json();
    cache[lang] = data;
    return data;
  }

  function applyHighlightLinks() {
    document.querySelectorAll('[data-highlight-item]').forEach(item => {
      const url = item.getAttribute('data-url');
      let link = item.querySelector('a.highlights__item-link');
      let textEl = item.querySelector('span');

      if (url) {
        item.classList.add('highlights__item--link');
        if (!link) {
          link = document.createElement('a');
          link.className = 'highlights__item-link';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          if (textEl) link.appendChild(textEl);
          item.appendChild(link);
        }
        link.href = url;
      } else {
        item.classList.remove('highlights__item--link');
        if (link && textEl && textEl.parentElement === link) {
          item.insertBefore(textEl, link);
          link.remove();
        }
      }
    });
  }

  function applyTeamSocialLinks(dict) {
    document.querySelectorAll('[data-i18n-attr*="LinkedInUrl"]').forEach(anchor => {
      const spec = anchor.getAttribute('data-i18n-attr');
      const urlKey = spec.match(/href:([^\s,]+)/)?.[1];
      const url = urlKey ? get(dict, urlKey) : '';
      const line = anchor.closest('.team-card__line');
      if (url) {
        anchor.href = url;
        if (line) line.hidden = false;
      } else if (line) {
        line.hidden = true;
      }
    });
  }

  function applyPressLinks() {
    document.querySelectorAll('[data-press-link]').forEach(anchor => {
      const href = anchor.getAttribute('href');
      const hasUrl = href && href !== '#';
      anchor.hidden = !hasUrl;
    });
  }

  function apply(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = get(dict, key);
      if (typeof val === 'string') el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = get(dict, key);
      if (typeof val === 'string') el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        const val = get(dict, key);
        if (typeof val === 'string') {
          if (val) el.setAttribute(attr, val);
          else el.removeAttribute(attr);
        }
      });
    });

    applyHighlightLinks();
    applyTeamSocialLinks(dict);
    applyPressLinks();

    // <title> + <meta description>
    const meta = dict.meta || {};
    const privacy = dict.privacy || {};
    const isPrivacy = /privacy/.test(location.pathname);
    if (isPrivacy && privacy.title) {
      document.title = privacy.title;
    } else if (meta.title) {
      document.title = meta.title;
    }
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl && meta.description) descEl.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.title) ogTitle.setAttribute('content', meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && meta.description) ogDesc.setAttribute('content', meta.description);
  }

  function syncButtons(lang) {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const active = btn.dataset.langBtn === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'ko';
    try {
      const dict = await loadDict(lang);
      apply(dict);
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      syncButtons(lang);
      document.dispatchEvent(new CustomEvent('lang:change', { detail: { lang } }));
    } catch (e) {
      console.error('[i18n]', e);
    }
  }

  function initialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || 'ko').toLowerCase();
    if (nav.startsWith('ko')) return 'ko';
    return 'ko'; // default ko per product decision
  }

  function bind() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
    });
  }

  function init() {
    bind();
    setLang(initialLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose minimal API
  window.FMI18N = { setLang, getLang: () => localStorage.getItem(STORAGE_KEY) || 'ko' };
})();
