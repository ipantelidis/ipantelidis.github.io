/* Entry point. Motion is added in Phase 4. */
(function () {
  'use strict';
  function init() {
    if (window.SiteRender) window.SiteRender.run();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
