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
    var box = document.querySelector('[data-portrait]');
    if (!box || !site.files || !site.files.portrait) return;
    var src = 'assets/img/' + site.files.portrait;
    var img = box.querySelector('img');
    if (img && img.getAttribute('src') === src) return; /* static copy already in place */
    box.textContent = '';
    box.appendChild(el('img', { src: src, alt: 'Portrait of ' + site.name, width: '160', height: '160', decoding: 'async' }));
  }

  function emailNode(site) {
    var email = site.links && site.links.email;
    if (!email) return null;
    var frag = document.createDocumentFragment();
    frag.appendChild(el('a', { href: 'mailto:' + email, text: email }));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      var btn = el('button', { type: 'button', 'class': 'copy-btn', text: 'Copy', 'aria-label': 'Copy email address' });
      var status = el('span', { 'class': 'copy-status small muted', role: 'status', 'aria-live': 'polite' });
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(email).then(function () {
          status.textContent = 'Copied';
          setTimeout(function () { status.textContent = ''; }, 2000);
        });
      });
      frag.appendChild(document.createTextNode(' '));
      frag.appendChild(btn);
      frag.appendChild(status);
    }
    return frag;
  }

  /* ---------- Section renderers ---------- */

  function authorsNode(pub) {
    var frag = document.createDocumentFragment();
    var eq = pub.equal_contribution || [];
    pub.authors.forEach(function (name, i) {
      if (i > 0) frag.appendChild(document.createTextNode(', '));
      var txt = name + (eq.indexOf(i) >= 0 ? '*' : '');
      frag.appendChild(i === pub.me ? el('strong', { text: txt }) : document.createTextNode(txt));
    });
    return frag;
  }

  var LINK_LABELS = [['paper', 'Paper'], ['code', 'Code'], ['project', 'Project page'],
                     ['bibtex', 'BibTeX'], ['video', 'Video'], ['poster', 'Poster']];

  function bracket(row, node, first) {
    if (!first) row.appendChild(document.createTextNode(' '));
    row.appendChild(document.createTextNode('['));
    row.appendChild(node);
    row.appendChild(document.createTextNode(']'));
  }

  function pubLinks(pub, bibBox) {
    var L = pub.links || {};
    var row = el('p', { 'class': 'pub-links small' });
    var any = false;
    LINK_LABELS.forEach(function (pair) {
      if (pair[0] === 'bibtex' && pub.bibtex && bibBox) {
        var btn = el('button', { type: 'button', 'class': 'link-btn', text: 'BibTeX', 'aria-expanded': 'false', 'aria-controls': bibBox.getAttribute('id') });
        btn.addEventListener('click', function () {
          var open = bibBox.hidden;
          bibBox.hidden = !open;
          btn.setAttribute('aria-expanded', String(open));
        });
        bracket(row, btn, !any); any = true;
        return;
      }
      if (!L[pair[0]]) return;
      bracket(row, el('a', { href: L[pair[0]], text: pair[1] }), !any); any = true;
    });
    return any ? row : null;
  }

  function pubRow(pub) {
    var row = el('li', { 'class': 'pub' + (pub.highlight ? ' pub-highlight' : '') });
    var thumb = el('div', { 'class': 'pub-thumb' });
    if (pub.thumbnail) {
      thumb.appendChild(el('img', { src: 'assets/img/' + pub.thumbnail, alt: '', loading: 'lazy', decoding: 'async', width: '120', height: '90' }));
    }
    row.appendChild(thumb);
    var body = el('div', { 'class': 'pub-body' });
    var title = el('h3', { 'class': 'pub-title' });
    var L = pub.links || {};
    title.appendChild(L.paper ? el('a', { href: L.paper, text: pub.title }) : document.createTextNode(pub.title));
    body.appendChild(title);
    body.appendChild(el('p', { 'class': 'pub-authors' }, [authorsNode(pub)]));
    body.appendChild(el('p', { 'class': 'pub-venue' }, [el('em', { text: pub.venue }), document.createTextNode(', ' + pub.year)]));
    var bibBox = null;
    if (pub.bibtex) {
      bibBox = el('pre', { 'class': 'pub-bibtex small', id: 'bib-' + pub.id, tabindex: '0', text: pub.bibtex });
      bibBox.hidden = true;
    }
    var links = pubLinks(pub, bibBox);
    if (links) body.appendChild(links);
    if (pub.summary) body.appendChild(el('p', { 'class': 'pub-summary', text: pub.summary }));
    if (bibBox) body.appendChild(bibBox);
    row.appendChild(body);
    return row;
  }

  function renderPublications(site, pubs) {
    if (!pubs || !pubs.length) return el('p', { 'class': 'muted', text: 'No publications listed yet.' });
    var sorted = pubs.slice().sort(function (a, b) { return b.year - a.year; });
    var wrap = document.createDocumentFragment();
    var hasEq = sorted.some(function (p) { return (p.equal_contribution || []).length; });
    var year = null, list = null;
    sorted.forEach(function (pub) {
      if (pub.year !== year) {
        year = pub.year;
        wrap.appendChild(el('h3', { 'class': 'pub-year', text: String(year) }));
        list = el('ul', { 'class': 'pub-list' });
        wrap.appendChild(list);
      }
      list.appendChild(pubRow(pub));
    });
    if (hasEq) wrap.appendChild(el('p', { 'class': 'small muted', text: '* equal contribution' }));
    return wrap;
  }

  function entryRow(e) {
    var li = el('li', { 'class': 'entry' });
    var when = el('div', { 'class': 'entry-when small muted', text: e.start + ' to ' + e.end });
    var body = el('div', { 'class': 'entry-body' });
    var head = el('h3', { 'class': 'entry-title' });
    head.appendChild(document.createTextNode(e.position || e.degree));
    body.appendChild(head);
    var org = el('p', { 'class': 'entry-org' });
    var orgName = e.organisation || e.institution;
    org.appendChild(e.url ? el('a', { href: e.url, text: orgName }) : document.createTextNode(orgName));
    if (e.location) org.appendChild(el('span', { 'class': 'muted', text: ' · ' + e.location }));
    body.appendChild(org);
    if (e.description) body.appendChild(el('p', { 'class': 'entry-desc', text: e.description }));
    if (e.focus) body.appendChild(el('p', { 'class': 'entry-desc', text: e.focus }));
    if (e.honours) body.appendChild(el('p', { 'class': 'entry-desc small muted', text: e.honours }));
    li.appendChild(when);
    li.appendChild(body);
    return li;
  }

  function renderEntries(entries) {
    if (!entries || !entries.length) return el('p', { 'class': 'muted', text: 'Nothing listed yet.' });
    var ul = el('ul', { 'class': 'entry-list' });
    entries.forEach(function (e) { ul.appendChild(entryRow(e)); });
    return ul;
  }

  var renderers = {
    publications: function (site, pubs) { return renderPublications(site, pubs); },
    experience: function (site) { return renderEntries(site.experience && site.experience.entries); },
    education: function (site) { return renderEntries(site.education); },
    email: function (site) { return emailNode(site); }
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
