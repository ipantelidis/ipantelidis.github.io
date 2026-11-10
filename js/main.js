/* Entry point: content rendering and the Work / Life toggle.
   Motion (scroll reveal, toggle crossfade) is added in Phase 4. */
(function () {
  'use strict';

  var MODES = ['work', 'life'];

  function setMode(mode, opts) {
    opts = opts || {};
    if (MODES.indexOf(mode) < 0) mode = 'work';
    document.documentElement.setAttribute('data-mode', mode);

    document.querySelectorAll('[data-mode-panel]').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-mode-panel') !== mode;
    });
    document.querySelectorAll('[data-mode-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-mode-btn') === mode));
    });
    document.querySelectorAll('.site-nav a[data-mode]').forEach(function (a) {
      a.hidden = a.getAttribute('data-mode') !== mode;
    });

    if (opts.updateHash) {
      var hash = mode === 'life' ? '#life' : '';
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search + hash);
    }
    if (opts.focusHeading) {
      var h = document.querySelector('[data-mode-panel="' + mode + '"] h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  function initToggle() {
    var toggle = document.querySelector('[data-mode-toggle]');
    if (!toggle) return;
    toggle.hidden = false; /* only shown when JS runs; without JS the Work content is the page */
    toggle.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mode-btn]');
      if (!btn) return;
      setMode(btn.getAttribute('data-mode-btn'), { updateHash: true, focusHeading: true });
    });
    /* Deep link: #life opens the Life side. */
    setMode(location.hash === '#life' ? 'life' : 'work');
    window.addEventListener('hashchange', function () {
      if (location.hash === '#life') setMode('life');
    });
    /* Nav anchors into the other side switch the side first. */
    document.querySelectorAll('.site-nav a[data-mode]').forEach(function (a) {
      a.addEventListener('click', function () { setMode(a.getAttribute('data-mode')); });
    });
  }

  function init() {
    initToggle();
    if (window.SiteRender) window.SiteRender.run();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
