/* Renders content/site.json and content/publications.json into the page.
   The HTML already contains the essential content statically, so this
   script only overwrites and extends it. Needs an http server (fetch
   does not work on file://). */
(function () {
  'use strict';

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  function renderFields(site) {
    document.querySelectorAll('[data-field]').forEach(function (node) {
      var v = get(site, node.getAttribute('data-field'));
      if (v !== undefined && v !== null) node.textContent = v;
    });
    document.querySelectorAll('[data-field-href]').forEach(function (node) {
      var v = get(site, node.getAttribute('data-field-href'));
      if (v) node.setAttribute('href', v);
    });
  }

  function renderLinks(site) {
    var L = site.links || {};
    var items = [];
    if (L.email) items.push(['Email', 'mailto:' + L.email]);
    if (L.cv_pdf) items.push(['CV', L.cv_pdf]);
    if (L.scholar) items.push(['Google Scholar', L.scholar]);
    if (L.github) items.push(['GitHub', L.github]);
    if (L.linkedin) items.push(['LinkedIn', L.linkedin]);
    if (L.x) items.push(['X', L.x]);
    if (L.orcid) items.push(['ORCID', L.orcid]);
    document.querySelectorAll('[data-links]').forEach(function (row) {
      row.textContent = '';
      items.forEach(function (it, i) {
        if (i > 0) row.appendChild(document.createTextNode(' / '));
        row.appendChild(el('a', { href: it[1], text: it[0] }));
      });
    });
  }

  function renderPortrait(site) {
    var box = document.querySelector('.hero-portrait');
    if (!box || !site.files || !site.files.portrait) return;
    box.textContent = '';
    box.appendChild(el('img', {
      src: 'assets/img/' + site.files.portrait,
      alt: 'Portrait of ' + site.name,
      width: '160', height: '160', loading: 'eager', decoding: 'async'
    }));
  }

  /* Section renderers are filled in during Phase 3. */
  var renderers = {
    publications: function (site, pubs) { return null; },
    experience: function (site) { return null; },
    education: function (site) { return null; },
    life: function (site) { return null; },
    email: function (site) { return null; }
  };

  function renderSections(site, pubs) {
    document.querySelectorAll('[data-render]').forEach(function (node) {
      var fn = renderers[node.getAttribute('data-render')];
      var out = fn && fn(site, pubs);
      if (out) { node.textContent = ''; node.appendChild(out); }
    });
  }

  function load(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  window.SiteRender = {
    renderers: renderers,
    el: el,
    run: function () {
      return Promise.all([load('content/site.json'), load('content/publications.json')])
        .then(function (res) {
          var site = res[0], pubs = res[1];
          renderFields(site);
          renderLinks(site);
          renderPortrait(site);
          renderSections(site, pubs);
          document.documentElement.setAttribute('data-rendered', '');
          return site;
        })
        .catch(function (err) { console.warn('Content not loaded, static HTML kept:', err.message); });
    }
  };
})();
