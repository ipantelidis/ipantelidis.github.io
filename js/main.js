/* Entry point: content rendering, then the motion layer.
   Motion rules:
   - everything is off under prefers-reduced-motion (CSS zeroes durations, JS skips the observer);
   - sections already on screen at load are shown at once, nothing animates on first paint;
   - sections below the fold fade and rise once, as they enter the viewport. */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    if (reduced || !('IntersectionObserver' in window)) return;
    var targets = Array.prototype.slice.call(document.querySelectorAll('.section:not(.hero)'));
    var fold = window.innerHeight || document.documentElement.clientHeight;
    var pending = targets.filter(function (s) { return s.getBoundingClientRect().top > fold; });
    if (!pending.length) return;
    pending.forEach(function (s) { s.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    pending.forEach(function (s) { io.observe(s); });
  }

  function init() {
    var done = window.SiteRender ? window.SiteRender.run() : Promise.resolve();
    done.then(initReveal, initReveal);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
