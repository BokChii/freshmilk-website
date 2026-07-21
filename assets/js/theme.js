/* =========================================
   FreshMilk — theme toggle (light / dark / system)
   ========================================= */
(() => {
  const STORAGE_KEY = 'fm-theme';
  const VALID = new Set(['light', 'dark', 'system']);

  function getStored() {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      return VALID.has(t) ? t : 'system';
    } catch {
      return 'system';
    }
  }

  function updateMetaThemeColor(theme) {
    const resolved =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? '#12151C'
        : '#FFFFFF';
    let meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = resolved;
  }

  function syncButtons(theme) {
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      const active = btn.dataset.themeBtn === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function applyTheme(theme, persist = true) {
    if (!VALID.has(theme)) theme = 'system';
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* ignore */
      }
    }
    syncButtons(theme);
    updateMetaThemeColor(theme);
  }

  function bind() {
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.themeBtn));
    });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
      if (getStored() === 'system') updateMetaThemeColor('system');
    });
  }

  function init() {
    applyTheme(getStored(), false);
    bind();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.FMTheme = { setTheme: applyTheme, getTheme: getStored };
})();
