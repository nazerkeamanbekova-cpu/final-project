/* Qoldau AI — interactive story. Vanilla JS, no dependencies.
   All statistics come from the project paper (see references). Demo data are fictional and labelled. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var fmt = function (n) { return n.toLocaleString('en-US'); };

  /* ---------- tooltip ---------- */
  var tip = $('#tip');
  function bindTips(root) {
    $$('[data-tip]', root).forEach(function (el) {
      var show = function (e) {
        tip.innerHTML = el.getAttribute('data-tip');
        tip.style.opacity = 1;
        var r = el.getBoundingClientRect();
        var x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top;
        tip.style.left = Math.min(window.innerWidth - 270, Math.max(8, x + 14)) + 'px';
        tip.style.top = Math.max(8, y - 50) + 'px';
      };
      el.addEventListener('mousemove', show);
      el.addEventListener('focus', show);
      el.addEventListener('mouseleave', function () { tip.style.opacity = 0; });
      el.addEventListener('blur', function () { tip.style.opacity = 0; });
    });
  }

  /* ---------- progress, nav highlight, reveal, count-up ---------- */
  var prog = $('#progress');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    prog.style.transform = 'scaleX(' + Math.min(1, p) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- pages (hash router) ---------- */
  var links = $$('.navlinks a'), NP = 7;
  var NAMES = ['Try it', 'The problem', 'Follow a request', 'Evidence', 'Solution & risks', 'Cost', 'Verdict & sources'];
  var pagerEl = document.createElement('div'); pagerEl.className = 'pager';
  document.body.insertBefore(pagerEl, $('footer'));
  var curPage = -1;
  function showPage(n, targetEl) {
    n = Math.max(0, Math.min(NP - 1, n));
    var changed = n !== curPage; curPage = n;
    document.body.setAttribute('data-pg', n);
    links.forEach(function (a) { var on = a.getAttribute('href') === '#/' + n; a.classList.toggle('on', on); a.setAttribute('aria-current', on ? 'page' : 'false'); if (on) { var nl = a.parentNode; nl.scrollLeft = a.offsetLeft - nl.clientWidth / 2 + a.clientWidth / 2; } });
    pagerEl.innerHTML = '<div class="wrap">' + (n > 0 ? '<a class="btn ghost" href="#/' + (n - 1) + '">← ' + NAMES[n - 1] + '</a>' : '<span></span>') + '<span class="pn">PAGE ' + (n + 1) + ' OF ' + NP + '</span>' + (n < NP - 1 ? '<a class="btn pri" href="#/' + (n + 1) + '">' + NAMES[n + 1] + ' →</a>' : '<a class="btn ghost" href="#/0">Start again ↻</a>') + '</div>';
    document.title = NAMES[n] + ' · Qoldau AI';
    if (targetEl) { setTimeout(function () { targetEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 30); }
    else if (changed) { window.scrollTo(0, 0); }
    onScroll();
  }
  function route() {
    var h = decodeURIComponent(location.hash || ''), m = /^#\/(\d)$/.exec(h);
    if (m) { showPage(+m[1]); return; }
    if (h.length > 1) {
      var el = document.getElementById(h.slice(1));
      if (el) { var sec = el.closest('section[data-page]'); if (sec) { showPage(+sec.getAttribute('data-page'), el); return; } }
    }
    showPage(curPage < 0 ? 0 : curPage);
  }
  window.addEventListener('hashchange', route);

  function countUp(el) {
    var t = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    if (reduce) { return; }
    var t0 = performance.now(), dur = 1300;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), v = t * (1 - Math.pow(1 - k, 3));
      el.textContent = (dec ? v.toFixed(dec) : fmt(Math.round(v))) + (k < 1 ? '' : suf);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var rvObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        rvObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.stats,.three,.cls,.conds,.two,.risks,.sg').forEach(function (g) { $$('.rv,.stat,.card,.cond', g).forEach(function (el, i) { el.style.setProperty('--d', (i % 6) * 90 + 'ms'); }); });
  $$('.rv').forEach(function (el) { rvObs.observe(el); });

  /* ---------- hero animation ---------- */
  (function hero() {
    var svg = $('#heroSvg'), cnt = $('#heroCount');
    var P = [
      { x: 70, y: 220, l: 'Citizen', c: '#e8eef6' },
      { x: 250, y: 85, l: 'Local executive body', c: '#7d8fa8' },
      { x: 270, y: 350, l: 'Housing inspectorate', c: '#7d8fa8' },
      { x: 440, y: 150, l: 'Specialist agency', c: '#7d8fa8' },
      { x: 520, y: 330, l: 'Competent department', c: '#c7e1d5' }
    ];
    var h = '<defs><radialGradient id="g"><stop offset="0" stop-color="#c7e1d5" stop-opacity=".25"/><stop offset="1" stop-color="#c7e1d5" stop-opacity="0"/></radialGradient></defs>';
    h += '<circle cx="520" cy="330" r="90" fill="url(#g)"/>';
    var d = 'M' + P.map(function (p) { return p.x + ' ' + p.y; }).join(' L');
    h += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1.5" stroke-dasharray="4 6"/>';
    h += '<polyline id="trail" fill="none" stroke="#ff7a4d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points=""/>';
    P.forEach(function (p, i) {
      var w = i === 0 ? 0 : 150;
      h += '<g><circle cx="' + p.x + '" cy="' + p.y + '" r="' + (i === 0 ? 16 : 11) + '" fill="#0c1d33" stroke="' + p.c + '" stroke-width="2"/>';
      h += '<text x="' + p.x + '" y="' + (p.y + (i === 0 ? 38 : (p.y < 200 ? -22 : 34))) + '" text-anchor="middle" fill="' + p.c + '" font-size="13" font-family="Inter,sans-serif">' + p.l + '</text></g>';
    });
    h += '<circle id="dot" r="8" fill="#ff7a4d" cx="70" cy="220"/><circle id="dotR" r="16" fill="none" stroke="#ff7a4d" opacity=".5" cx="70" cy="220"/>';
    svg.innerHTML = h;
    var dot = $('#dot'), ring = $('#dotR'), trail = $('#trail');
    if (reduce) {
      trail.setAttribute('points', P.map(function (p) { return p.x + ',' + p.y; }).join(' '));
      dot.setAttribute('cx', 520); dot.setAttribute('cy', 330); dot.setAttribute('fill', '#c7e1d5');
      ring.setAttribute('cx', 520); ring.setAttribute('cy', 330); cnt.textContent = 'transfers: 3';
      return;
    }
    var SEG = 1200, PAUSE = 650, t0 = performance.now(), seg = 0, pts = [P[0].x + ',' + P[0].y];
    function frame(now) {
      var el = Math.max(0, now - t0), per = SEG + PAUSE, i = Math.floor(el / per);
      if (i >= P.length - 1 + 3) { t0 = now; i = 0; pts = [P[0].x + ',' + P[0].y]; seg = 0; trail.setAttribute('points', pts[0]); dot.setAttribute('fill', '#ff7a4d'); ring.setAttribute('stroke', '#ff7a4d'); }
      var k = Math.min(1, (el % per) / SEG);
      if (i < P.length - 1) {
        var a = P[i], b = P[i + 1], e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e;
        dot.setAttribute('cx', x); dot.setAttribute('cy', y); ring.setAttribute('cx', x); ring.setAttribute('cy', y);
        ring.setAttribute('r', 16 + 4 * Math.sin(now / 160));
        if (seg !== i) { seg = i; pts = P.slice(0, i + 1).map(function (p) { return p.x + ',' + p.y; }); }
        trail.setAttribute('points', pts.concat(x + ',' + y).join(' '));
        cnt.textContent = 'transfers: ' + Math.max(0, (k >= 0.98 ? i + 1 : i) - 1);
        if (i === P.length - 2 && k >= 1) { dot.setAttribute('fill', '#c7e1d5'); ring.setAttribute('stroke', '#c7e1d5'); }
      } else { cnt.textContent = 'transfers: 3'; dot.setAttribute('fill', '#c7e1d5'); ring.setAttribute('stroke', '#c7e1d5'); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- chart helpers ---------- */
  function mk(w, h, inner, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '"><defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--friction)" opacity=".35"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--friction)" stroke-width="3"/></pattern></defs>' + inner + '</svg>';
  }
  function vbars(el, o) { // simple vertical bars
    var W = 520, H = 340, L = 20, R = 10, T = 50, B = 56, ph = H - T - B, n = o.data.length, gw = (W - L - R) / n, bw = Math.min(110, gw * .6);
    var s = '';
    for (var g = 0; g <= 4; g++) { var yy = T + ph - ph * g / 4; s += '<line class="axis" x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '"/>'; }
    o.data.forEach(function (d, i) {
      var h = ph * d.value / o.max, x = L + gw * i + (gw - bw) / 2, y = T + ph - h;
      s += '<rect class="bar" tabindex="0" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="5" style="fill:' + (d.partial ? 'url(#hatch)' : d.fill) + ';stroke:' + (d.partial ? 'var(--friction)' : 'none') + '" data-tip="' + d.tip + '" aria-label="' + d.tip.replace(/<[^>]+>/g, ' ') + '"/>';
      s += '<text class="val" x="' + (x + bw / 2) + '" y="' + (y - 9) + '" text-anchor="middle">' + d.display + '</text>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - B + 22) + '" text-anchor="middle">' + d.label + '</text>';
      if (d.sub) s += '<text x="' + (x + bw / 2) + '" y="' + (H - B + 38) + '" text-anchor="middle" style="font-size:11px">' + d.sub + '</text>';
    });
    if (o.annot) s += o.annot;
    el.innerHTML = mk(W, H, s, o.label); bindTips(el);
  }

  /* ---------- redirected requests chart (section 01) ---------- */
  (function () {
    var el = $('#chartRedir'), srcEl = $('#srcRedir');
    var views = {
      gov: function () {
        vbars(el, { max: 2, label: 'Redirected requests 2024 vs 2025: about 1.1 million to over 1.7 million, plus 54.5 percent', data: [
          { label: '2024', display: '≈ 1.1M', value: 1.1, fill: 'var(--friction)', tip: '<b>2024</b>about 1.1 million redirected requests' },
          { label: '2025', display: '> 1.7M', value: 1.7, fill: 'var(--friction)', tip: '<b>2025</b>over 1.7 million redirected requests' }],
          annot: '<text x="260" y="34" text-anchor="middle" style="fill:var(--friction);font-size:22px;font-weight:600;font-family:Fraunces,serif">+54.5%</text>' });
        srcEl.innerHTML = '<b>Source:</b> Index of Openness of Central State and Local Executive Bodies for 2025 (Government of the Republic of Kazakhstan, 2026, p. 12). Figures as rounded in the report text.';
      },
      beis: function () {
        vbars(el, { max: 1600000, label: 'Redirected requests: 128,846 in 2021, 1,147,902 in 2024, 1,404,068 in first ten months of 2025', data: [
          { label: '2021', display: fmt(128846), value: 128846, fill: 'var(--friction)', tip: '<b>2021</b>128,846 redirected requests' },
          { label: '2024', display: fmt(1147902), value: 1147902, fill: 'var(--friction)', tip: '<b>2024</b>1,147,902 redirected requests' },
          { label: '2025', sub: 'Jan–Oct only', display: fmt(1404068), value: 1404068, partial: true, tip: '<b>2025 (first 10 months)</b>1,404,068 redirected requests. Partial year.' }] });
        srcEl.innerHTML = '<b>Source:</b> Beisenov (2025), p. 67, administrative statistics. 2022–2023 are not reported in the source paper; 2025 is a partial year (hatched).';
      },
      share: function () {
        vbars(el, { max: 40, label: 'Redirected requests as share of all requests: 18.1 percent in 2021, 25.8 percent in 2024, 29.1 percent in first ten months of 2025', data: [
          { label: '2021', display: '18.1%', value: 18.1, fill: 'var(--friction)', tip: '<b>2021</b>128,846 / 711,538 = 18.1%' },
          { label: '2024', sub: 'calculated', display: '25.8%', value: 25.8, fill: 'var(--friction)', tip: '<b>2024</b>1,147,902 / 4,451,179 = 25.8% (calculated here from Beisenov’s figures)' },
          { label: '2025', sub: 'Jan–Oct only', display: '29.1%', value: 29.1, partial: true, tip: '<b>2025 (first 10 months)</b>1,404,068 / 4,819,417 = 29.1%' }] });
        srcEl.innerHTML = '<b>Source:</b> Beisenov (2025), p. 67 (2021 and 2025 shares as reported). The 2024 share is calculated here from his totals and redirects (pp. 39–40, 67).';
      }
    };
    views.gov();
    $$('#segRedir button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#segRedir button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        views[b.dataset.v]();
      });
    });
  })();

  /* ---------- Follow the request simulation ---------- */
  (function () {
    var mode = 'today', chain = $('#simChain'), xf = $('#xfers'), timers = [];
    var DEPT = ['Local executive body (intake)', 'Housing inspectorate', 'Another specialist agency', 'Another department', 'Yet another body'];
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function build() {
      clear();
      var n = +xf.value, h = '';
      $('#xfersVal').textContent = n;
      if (mode === 'today') {
        $('#simTodayCtl').style.display = '';
        h += li('1', 'Request received', 'Filed with ' + DEPT[0] + '. Reviewer must decide who is competent.', '');
        for (var k = 1; k <= n; k++) {
          h += li('↪', 'Transfer #' + k + ' → ' + DEPT[k], 'Applicant is informed. Legal limit for each transfer: 3 working days (Art. 65).', 'xfer');
        }
        h += li('✓', n ? 'Substantive review finally begins' : 'Reaches the competent body first time', n ? 'Only now does the actual problem get assessed.' : 'No avoidable transfer — the ideal case.', '');
        $('#mT').textContent = n; $('#mD').textContent = n ? '≤ ' + 3 * n : '0'; $('#mC').textContent = n + 1;
        $('#simMeter').innerHTML = '<div><b id="mT">' + n + '</b><span>transfers</span></div><div><b id="mD">' + (n ? '≤ ' + 3 * n : '0') + '</b><span>working days allowed for transfers alone (3 per transfer, Art. 65)</span></div><div><b id="mC">' + (n + 1) + '</b><span>institutions that handle the file</span></div>';
        $('#simNote').textContent = 'Illustrative path. The slider is not a measured average: public data do not say how many transfers a typical request undergoes, nor which are legitimate. Some transfers are legally necessary.';
      } else {
        $('#simTodayCtl').style.display = 'none';
        [['1', 'Citizen request', 'Arrives through the existing channel (e.g. iKOMEK109).', ''],
         ['2', 'Text analysis', 'Language detected (Kazakh/Russian); text prepared for classification.', 'ai'],
         ['3', 'Classification', 'Predicted topic, e.g. “housing & utilities”.', 'ai'],
         ['4', 'Department recommendation', 'Topic matched against the responsibility directory; confidence shown.', 'ai'],
         ['5', 'Human review', 'Operator confirms or corrects. Low-confidence, ambiguous or urgent cases are flagged.', 'human'],
         ['6', 'Final routing', 'Transferred under human responsibility; correction (if any) is logged.', '']
        ].forEach(function (s) { h += li(s[0], s[1], s[2], s[3]); });
        $('#simMeter').innerHTML = '<div><b style="color:var(--cyan)">0</b><span>final decisions made by the AI</span></div><div><b style="color:var(--gold)">1</b><span>human confirmation before routing</span></div><div><b style="color:var(--fg)">?</b><span>effect on transfers: to be measured in a pilot</span></div>';
        $('#simNote').textContent = 'Conceptual workflow of the proposal. Qoldau AI cannot remove legitimate transfers; whether it reduces avoidable ones is exactly what the pilot would test.';
      }
      chain.innerHTML = h;
      tiers(mode === 'today' ? n : 0);
    }
    function tiers(n) {
      var T = [['Very high', 1, 'up to 24 hours'], ['High', 3, 'up to 72 hours'], ['Medium', 7, '7 calendar days'], ['Low', 10, 'up to 10 days']], used = 3 * n;
      $('#tierBox').innerHTML = T.map(function (t) {
        var hit = n > 0 && used >= t[1], w = Math.min(100, used / 10 * 100);
        return '<div class="scr"><span>' + t[0] + ' <small>(' + t[2] + ')</small></span><div class="bar" style="position:relative"><i style="width:' + t[1] * 10 + '%;background:rgba(255,255,255,.18)"></i><i style="position:absolute;left:0;top:0;height:100%;width:' + w + '%;background:' + (hit ? 'var(--warn)' : 'var(--cyan)') + ';opacity:.85"></i></div></div>' +
          '<div class="src" style="margin:-4px 0 6px">' + (n === 0 ? 'No transfers: no transfer allowance used.' : n + ' transfer' + (n > 1 ? 's' : '') + ' could use up to ' + used + ' working days (at least ' + used + ' calendar days) — ' + (hit ? '<b style="color:var(--warn)">reaches or exceeds this deadline</b>' : 'within this deadline')) + '</div>';
      }).join('');
    }
    function li(d, t, s, c) { return '<li class="' + c + '"><div class="dot">' + d + '</div><div><b>' + t + '</b><span>' + s + '</span></div></li>'; }
    function play() {
      build();
      $$('li', chain).forEach(function (l, i) { timers.push(setTimeout(function () { l.classList.add('on'); }, reduce ? 0 : 150 + i * 650)); });
    }
    $('#simPlay').addEventListener('click', play);
    xf.addEventListener('input', function () { build(); $$('li', chain).forEach(function (l) { l.classList.add('on'); }); });
    $$('#segSim button').forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.dataset.m;
        $$('#segSim button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        play();
      });
    });
    build(); $$('li', chain).forEach(function (l) { l.classList.add('on'); });
  })();

  /* ---------- Evidence tabs + charts ---------- */
  (function () {
    $$('#evTabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#evTabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        $$('.evp').forEach(function (p) { p.hidden = p.id !== 'ev' + b.dataset.t; });
      });
    });

    // A: grouped growth chart
    var W = 560, H = 360, L = 52, B = 60, T = 40, ph = H - T - B, MAX = 5000000;
    var cats = [
      { l: '2021', all: 711538, red: 128846, sh: '18.1%' },
      { l: '2024', all: 4451179, red: 1147902, sh: '25.8%*' },
      { l: '2025', sub: 'Jan–Oct only', all: 4819417, red: 1404068, sh: '29.1%', part: true }];
    var s = '';
    for (var g = 0; g <= 5; g++) {
      var yy = T + ph - ph * g / 5;
      s += '<line class="axis" x1="' + L + '" x2="' + (W - 8) + '" y1="' + yy + '" y2="' + yy + '"/><text x="' + (L - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + g + 'M</text>';
    }
    var gw = (W - L - 8) / cats.length, bw = 56;
    cats.forEach(function (c, i) {
      var cx = L + gw * i + gw / 2;
      [['all', cx - bw - 3, '#1c2d5c', 'All requests'], ['red', cx + 3, null, 'Redirected']].forEach(function (b) {
        var v = c[b[0]], h = ph * v / MAX, y = T + ph - h;
        var fill = b[0] === 'red' ? (c.part ? 'url(#hatch)' : 'var(--friction)') : (c.part ? '#1c2d5c' : '#1c2d5c');
        s += '<rect class="bar" tabindex="0" x="' + b[1] + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="4" style="fill:' + fill + ';' + (b[0] === 'red' && c.part ? 'stroke:var(--friction)' : '') + '" data-tip="<b>' + c.l + (c.part ? ' (Jan–Oct)' : '') + ' · ' + b[3] + '</b>' + fmt(v) + '" aria-label="' + c.l + ' ' + b[3] + ' ' + fmt(v) + '"/>';
      });
      s += '<text x="' + (cx + 3 + bw / 2) + '" y="' + (T + ph - ph * c.red / MAX - 8) + '" text-anchor="middle" class="val" style="fill:var(--friction)">' + c.sh + '</text>';
      s += '<text x="' + cx + '" y="' + (H - B + 22) + '" text-anchor="middle">' + c.l + '</text>';
      if (c.sub) s += '<text x="' + cx + '" y="' + (H - B + 38) + '" text-anchor="middle" style="font-size:11px">' + c.sub + '</text>';
    });
    var el = $('#chartGrowth'); el.innerHTML = mk(W, H, s, 'Total requests and redirected requests in 2021, 2024 and first ten months of 2025'); bindTips(el);

    // B: digital access (horizontal grouped)
    var rows = [
      ['Internet access at home', 95.2, 94.2, '1.0'],
      ['Computer, laptop or tablet', 57.9, 44.8, '13.1'],
      ['Smartphone ownership', 94.2, 93.6, '0.6']];
    var W2 = 560, rh = 100, H2 = rows.length * rh + 44, L2 = 14, pw = W2 - L2 - 20, o = '';
    for (var t = 0; t <= 100; t += 25) { var xx = L2 + pw * t / 100; o += '<line class="axis" x1="' + xx + '" x2="' + xx + '" y1="8" y2="' + (H2 - 30) + '"/><text x="' + xx + '" y="' + (H2 - 12) + '" text-anchor="middle">' + t + '%</text>'; }
    rows.forEach(function (r, i) {
      var y = 14 + i * rh;
      o += '<text x="' + L2 + '" y="' + (y + 8) + '" style="fill:var(--fg);font-weight:600;font-size:13px">' + r[0] + '</text>';
      [[r[1], '#1c2d5c', 'Urban'], [r[2], 'var(--accent)', 'Rural']].forEach(function (v, j) {
        var yy2 = y + 18 + j * 28;
        o += '<rect class="bar" tabindex="0" x="' + L2 + '" y="' + yy2 + '" width="' + (pw * v[0] / 100) + '" height="22" rx="4" style="fill:' + v[1] + '" data-tip="<b>' + r[0] + ' · ' + v[2] + '</b>' + v[0] + '% of households" aria-label="' + r[0] + ' ' + v[2] + ' ' + v[0] + ' percent"/>';
        o += '<text class="val" x="' + (L2 + pw * v[0] / 100 - 8) + '" y="' + (yy2 + 16) + '" text-anchor="end" style="fill:#fff">' + v[0] + '%</text>';
      });
      o += '<text x="' + (W2 - 20) + '" y="' + (y + 8) + '" text-anchor="end" style="fill:' + (r[3] > 5 ? 'var(--friction)' : 'var(--fg2)') + ';font-weight:600">gap ' + r[3] + ' pp</text>';
    });
    var el2 = $('#chartAccess'); el2.innerHTML = mk(W2, H2, o, 'Urban versus rural household digital access'); bindTips(el2);

    // D: F1
    var f = '', W3 = 520, H3 = 340, T3 = 50, B3 = 56, p3 = H3 - T3 - B3;
    for (var q = 0; q <= 5; q++) { var y3 = T3 + p3 - p3 * q / 5; f += '<line class="axis" x1="44" x2="510" y1="' + y3 + '" y2="' + y3 + '"/><text x="36" y="' + (y3 + 4) + '" text-anchor="end">' + (q / 5).toFixed(1) + '</text>'; }
    [['Text-only baseline', .722, '#1c2d5c', 100], ['Hybrid: text + linked entity info', .781, 'var(--accent)', 300]].forEach(function (b) {
      var h = p3 * b[1], y = T3 + p3 - h;
      f += '<rect class="bar" tabindex="0" x="' + b[3] + '" y="' + y + '" width="110" height="' + h + '" rx="6" style="fill:' + b[2] + '" data-tip="<b>' + b[0] + '</b>Macro F1 = ' + b[1] + '"/>';
      f += '<text class="val" x="' + (b[3] + 55) + '" y="' + (y - 10) + '" text-anchor="middle" style="font-size:20px;font-family:Fraunces,serif">' + b[1].toFixed(3) + '</text>';
      f += '<text x="' + (b[3] + 55) + '" y="' + (H3 - B3 + 22) + '" text-anchor="middle">' + b[0].split(':')[0] + '</text>';
      if (b[0].indexOf(':') > 0) f += '<text x="' + (b[3] + 55) + '" y="' + (H3 - B3 + 38) + '" text-anchor="middle" style="font-size:11px">' + b[0].split(':')[1].trim() + '</text>';
    });
    f += '<text x="280" y="26" text-anchor="middle" style="font-size:13px">Macro F1-score (higher is better, max 1.0)</text>';
    var el3 = $('#chartF1'); el3.innerHTML = mk(W3, H3, f, 'Macro F1 of 0.722 for the text-only baseline and 0.781 for the hybrid model'); bindTips(el3);
  })();

  /* ---------- Dashboard mockup ---------- */
  (function () {
    var DEPTS = ['Housing & utilities dept.', 'Waste management & sanitation dept.', 'Roads & street-lighting dept.', 'Public transport dept.', 'Education dept.'];
    var S = [
      { t: 'Үйіміздегі жылу екі аптадан бері жұмыс істемейді, басқару компаниясы жауап бермейді.', lang: 'Kazakh', lc: 'kk', topic: 'Housing & utilities', d: 0, c: 88, f: [] },
      { t: 'Во дворе нашего дома уже неделю не вывозят мусор, контейнеры переполнены.', lang: 'Russian', lc: 'ru', topic: 'Waste management', d: 1, c: 94, f: [] },
      { t: 'На дороге возле школы нет освещения и разбит асфальт, дети идут в темноте.', lang: 'Russian', lc: 'ru', topic: 'Roads / lighting (possibly also education)', d: 2, c: 52, f: ['low confidence', 'ambiguous responsibility', 'potentially urgent (children’s safety)'] },
      { t: 'Подъезд №3 суық, батареялар жұмыс істемейді, помогите пожалуйста.', lang: 'Mixed Kazakh–Russian (uncertain)', lc: 'ru', topic: 'Housing & utilities', d: 0, c: 61, f: ['low confidence', 'mixed-language text'] }
    ];
    var sel = $('#sample'), bs = $('#bSel'), ok = 0, fx = 0, cur = 0;
    sel.innerHTML = S.map(function (s, i) { return '<option value="' + i + '">Sample ' + (i + 1) + ' — ' + s.lang + '</option>'; }).join('');
    bs.innerHTML = DEPTS.map(function (d, i) { return '<option value="' + i + '">' + d + '</option>'; }).join('');
    var why = document.createElement('select'); why.id = 'bWhy'; why.setAttribute('aria-label', 'Reason for correction');
    why.innerHTML = ['Reason: different legal competence', 'Reason: wrong topic', 'Reason: urgency / priority', 'Reason: other'].map(function (r) { return '<option>' + r + '</option>'; }).join('');
    $('#bFix').parentNode.insertBefore(why, $('#bFix'));
    function log(m) { $('#dlog').innerHTML = 'Operator action log: ' + m + '<br><span style="opacity:.75">Session: ' + ok + ' confirmed · ' + fx + ' corrected (disagreements recorded)</span>'; }
    function show() {
      var s = S[cur];
      var r = $('#reqText'); r.textContent = '“' + s.t + '”'; r.lang = s.lc;
      $('#dLang').textContent = s.lang; $('#dTopic').textContent = s.topic; $('#dDept').textContent = DEPTS[s.d];
      $('#dConf').textContent = s.c + '%'; var b = $('#dBar'); b.style.width = '0'; b.style.background = s.c < 70 ? 'var(--warn)' : 'var(--cyan)';
      setTimeout(function () { b.style.width = s.c + '%'; }, 40);
      var fl = $('#dFlag'); fl.classList.toggle('show', !!s.f.length);
      fl.innerHTML = s.f.length ? '⚑ <b>Flagged for additional human review:</b> ' + s.f.join(' · ') : '';
      bs.value = s.d; log('<b>—</b> awaiting operator decision.');
    }
    sel.addEventListener('change', function () { cur = +sel.value; show(); });
    $('#bOk').addEventListener('click', function () { ok++; log('<b>Confirmed</b> → routed to “' + DEPTS[S[cur].d] + '”. Logged.'); });
    $('#bFix').addEventListener('click', function () {
      var d = +bs.value;
      if (d === S[cur].d) { log('<b>No change.</b> Pick a different department to record a correction.'); return; }
      fx++; log('<b>Corrected</b> → AI suggested “' + DEPTS[S[cur].d] + '”, operator chose “' + DEPTS[d] + '”. ' + why.value + '. Logged.');
    });
    show();

    // architecture
    var A = [
      ['Citizen request', 'A request arrives through the existing channel (e.g. iKOMEK109). Citizens do not get a new platform to learn.'],
      ['Multilingual text processing', 'Analyses the request in Kazakh or Russian. Must cope with dialects, slang, spelling errors and mixed-language text. Only information needed for classification is processed (data minimisation).'],
      ['Classification model', 'Assigns a predefined category such as housing, public transport, waste management or infrastructure. Proposed: a relatively small multilingual model fine-tuned on existing labelled requests, not a large model trained from scratch.'],
      ['Responsibility database', 'A regularly updated directory of institutional responsibilities, maintained locally by city and regional akimats, so that categories map to the correct body.'],
      ['Department recommendation', 'Compares the predicted category with the directory and recommends a department, displaying category and confidence. Low-confidence, ambiguous or potentially urgent cases are flagged.'],
      ['Human operator review', 'The operator confirms or corrects the recommendation BEFORE transfer. Reasons for corrections are recorded; disagreements between humans and AI are logged and audited.', 1],
      ['Final routing', 'The request is transferred under human responsibility. Citizens are informed that AI assists, and keep ordinary appeal and complaint procedures.']
    ];
    var ar = $('#arch');
    ar.innerHTML = A.map(function (a, i) { return '<button type="button" class="' + (a[2] ? 'human' : '') + '" data-i="' + i + '" aria-pressed="' + (i === 5) + '"><span class="n">' + (i + 1) + '</span><b>' + a[0] + '</b></button>'; }).join('');
    function sa(i) {
      $$('button', ar).forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.i === i); });
      $('#archDetail').innerHTML = '<b>' + (i + 1) + '. ' + A[i][0] + '</b>' + (A[i][2] ? ' <span class="tag prop" style="margin-left:6px">the decisive step</span>' : '') + '<br>' + A[i][1];
    }
    $$('button', ar).forEach(function (b) { b.addEventListener('click', function () { sa(+b.dataset.i); }); });
    sa(5);
  })();

  /* ---------- Risks ---------- */
  (function () {
    var R = [
      ['01', 'Kazakh vs Russian performance', 'Open question', 'Public statistics do not show whether automated classification works equally for Kazakh- and Russian-language submissions. Rakhimzhanov et al. (2025) note a model cannot be assumed to perform equally across languages or institutions. Hence: evaluate each language separately.'],
      ['02', 'Dialects, typos, mixed language', 'Documented elsewhere', 'In Bağcılar, slang, dialects, spelling errors and colloquial expressions made data preparation a major hurdle. Kazakhstani requests may be in Kazakh, Russian or a mix. Representative training data and bilingual annotators are required.'],
      ['03', 'Automation bias', 'Evidence from other settings', 'Operators may gradually accept recommendations without questioning them. Dutch police officers trusted AI advice more when it confirmed their own view (Selten et al., 2023). Mitigation: show confidence, allow override, log reasons, audit regularly.'],
      ['04', 'Incorrect recommendations', 'Identified risk', 'A wrong suggestion could add a transfer instead of removing one. Technically accurate classification does not automatically guarantee better administrative outcomes. Low-confidence, ambiguous and urgent cases go to extra review.'],
      ['05', 'Privacy & cybersecurity', 'Identified risk', 'Requests can contain names, addresses, health details, family circumstances and political complaints: risks of disclosure, surveillance and secondary use. Process only what is needed, restrict access, prohibit profiling, store data in Kazakhstan, avoid unapproved foreign AI services; an external penetration test is budgeted.'],
      ['06', 'Unequal digital access', 'Open question', 'Household internet access is high, but computer ownership differs between urban (57.9%) and rural (44.8%) homes. Whether older, disabled or less digitally literate people are more affected by redirection is a hypothesis; no systematic statistics exist yet.'],
      ['07', 'Institutional fragmentation', 'Identified risk', 'Automating classification may speed one task but will not necessarily improve service delivery if responsibilities remain fragmented (Mergel et al., 2019). The tool is only as good as the responsibility directory behind it.'],
      ['08', 'Human accountability', 'Design requirement', 'AI must not blur who is responsible, nor justify cutting public-sector staff. Qualified officials stay responsible for final decisions (Ministry guidelines, 2026); the system does not reject appeals or decide eligibility.']
    ];
    $('#riskGrid').innerHTML = R.map(function (r) {
      return '<button class="risk" type="button" aria-expanded="false"><span class="ico">' + r[0] + ' · ' + r[2].toUpperCase() + '</span><h3>' + r[1] + '</h3><span class="more">' + r[3] + '</span></button>';
    }).join('');
    $$('.risk').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); }); });
    var boxes = $$('#sgBox input');
    boxes.forEach(function (c) {
      c.addEventListener('change', function () {
        var n = boxes.filter(function (x) { return x.checked; }).length;
        $('#ovBar').style.width = n * 20 + '%';
        $('#ovTxt').textContent = n + ' of 5 safeguards active — ' + (n < 3 ? 'oversight would risk being symbolic.' : n < 5 ? 'getting stronger, but incomplete.' : 'oversight is designed to be meaningful (the effect still has to be tested).');
      });
    });
  })();

  /* ---------- Budget ---------- */
  (function () {
    var B = [
      { n: 'Personnel (incl. 15% allowance)', v: 51.98, c: '#7fb69a', items: [['Project Manager · 0.5 FTE × 1.5M × 9 mo', 6.75], ['Business/System Analyst · 0.5 × 1.2M × 5', 3.00], ['ML Engineer · 1 × 2.0M × 6', 12.00], ['Backend/Integration Developer · 1 × 1.4M × 6', 8.40], ['Data Engineer · 0.5 × 1.3M × 4', 2.60], ['QA Engineer · 0.5 × 1.1M × 4', 2.20], ['DevOps Engineer · 0.25 × 1.5M × 6', 2.25], ['Data Annotators · 4 × 0.35M × 3', 4.20], ['Language/Domain Experts · 2 × 0.5M × 3', 3.00], ['Cybersecurity Consultant · 0.25 × 1.6M × 2', 0.80], ['Subtotal 45.20 × 1.15 allowance', 51.98]], note: 'The paper labels the 15% as “contingency” in the table and as an allowance for employer-related costs in the text.' },
      { n: 'Infrastructure', v: 6.0, c: '#8f9fd0', items: [['Server hardware (purchase or rental)', 4.0], ['Hosting / colocation, 9 months', 0.5], ['Backup & monitoring setup', 1.5]], note: 'Assumes existing data-centre facilities; no new construction.' },
      { n: 'Data preparation', v: 4.0, c: '#c7e1d5', items: [['Data cleaning and anonymisation', 1.5], ['Tools and dataset preparation', 1.0], ['Annotation quality assurance', 1.5]] },
      { n: 'Integration, security & training', v: 11.5, c: '#e3e08a', items: [['Additional API and integration testing', 3.0], ['External cybersecurity audit & penetration testing', 5.0], ['iKOMEK109 operator training', 2.0], ['Legal and data protection assessment', 1.5]] },
      { n: 'Contingency reserve (10%)', v: 7.35, c: '#e59a85', items: [['10% of the KZT 73.5M subtotal', 7.35]], note: 'For unforeseen expenses.' }
    ];
    var TOT = 80.85, stack = $('#stack'), rowsEl = $('#budgetRows');
    stack.innerHTML = B.map(function (b, i) { return '<button type="button" data-i="' + i + '" style="flex:' + b.v + ';background:' + b.c + '" data-tip="<b>' + b.n + '</b>KZT ' + b.v.toFixed(2) + ' million (' + (b.v / TOT * 100).toFixed(1) + '%)" aria-label="' + b.n + ' ' + b.v + ' million tenge">' + (b.v > 9 ? (b.v / TOT * 100).toFixed(0) + '%' : '') + '</button>'; }).join('');
    rowsEl.innerHTML = B.map(function (b, i) {
      return '<div class="brow" id="br' + i + '"><button type="button" aria-expanded="false"><span class="sw" style="background:' + b.c + '"></span><span>' + b.n + '</span><span class="amt">' + b.v.toFixed(2) + 'M</span><span class="pct">' + (b.v / TOT * 100).toFixed(1) + '%</span></button><div class="det"><table>' + b.items.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1].toFixed(2) + '</td></tr>'; }).join('') + '</table>' + (b.note ? '<p class="src">' + b.note + '</p>' : '') + '</div></div>';
    }).join('');
    function tog(i, force) {
      $$('.brow').forEach(function (r, j) {
        var open = j === i ? (force !== undefined ? force : !r.classList.contains('open')) : false;
        r.classList.toggle('open', open); $('button', r).setAttribute('aria-expanded', open);
      });
      $$('#stack button').forEach(function (s, j) { s.classList.toggle('dim', $$('.brow.open').length && !$('#br' + j).classList.contains('open')); });
    }
    $$('.brow>button').forEach(function (b, i) { b.addEventListener('click', function () { tog(i); }); });
    $$('#stack button').forEach(function (b, i) { b.addEventListener('click', function () { tog(i); $('#br' + i).scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }); });
    bindTips(stack);

  })();

  /* ---------- Simple break-even calculator (inputs 1-3 are guesses; costs from the paper) ---------- */
  (function () {
    if (!$('#beCalc')) return;
    var PILOT = 80.85e6, UPKEEP = 33.4e6, FTE_H = 1920, RED = 70192, APP = 2200000;
    var ids = ['Stop', 'Min', 'Sec', 'Rate', 'H'];
    var M = function (v) { return (v / 1e6).toFixed(1) + ' million'; };
    function g(k) { return +$('#be' + k).value; }
    function run() {
      var stop = g('Stop'), mn = g('Min'), sec = g('Sec'), rate = g('Rate'), H = g('H');
      $('#beStopV').textContent = stop; $('#beMinV').textContent = mn; $('#beSecV').textContent = sec; $('#beRateV').textContent = fmt(rate); $('#beHV').textContent = H;
      var hrs = RED * stop / 100 * mn / 60 + APP * sec / 3600, val = hrs * rate, net = val - UPKEEP, be = net > 0 ? PILOT / net : null;
      var cum = []; for (var t = 0; t <= H; t++) cum.push(-PILOT + t * net);
      var ok = be && be <= H;
      var out = [
        ['≈ ' + (hrs / FTE_H).toFixed(1) + ' workers’ time', fmt(Math.round(hrs)) + ' staff hours freed per year, to be moved to harder cases and helping citizens, not to cut jobs'],
        ['' + M(val), 'tenge of staff time freed per year, against ' + M(UPKEEP) + ' yearly cost'],
        [ok ? 'Pays back in ' + be.toFixed(1) + ' years' : 'Does not pay back within ' + H + ' years', 'under the guesses you chose']
      ];
      $('#beOut').innerHTML = out.map(function (o, i) { return '<div class="stat"><b style="font-size:' + (i === 2 ? 24 : 32) + 'px;color:' + (i === 2 ? (ok ? 'var(--cyan)' : 'var(--warn)') : 'var(--accent)') + '">' + o[0] + '</b><span>' + o[1] + '</span></div>'; }).join('');
      var W = 560, Ht = 260, L = 70, R = 14, T = 16, B = 38, mx = Math.max.apply(null, cum.concat([0])), mi = Math.min.apply(null, cum.concat([0]));
      if (mx === mi) { mx += 1; }
      var X = function (t) { return L + (W - L - R) * t / H; }, Y = function (v) { return T + (Ht - T - B) * (mx - v) / (mx - mi); };
      var sv = '<line class="axis" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" style="stroke:var(--fg2)"/><text x="' + (L - 8) + '" y="' + (Y(0) + 4) + '" text-anchor="end">0</text>';
      [mi, mx].forEach(function (v) { if (Math.abs(Y(v) - Y(0)) > 14) sv += '<text x="' + (L - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + (v / 1e6).toFixed(0) + 'M</text>'; });
      for (var t2 = 0; t2 <= H; t2++) sv += '<text x="' + X(t2) + '" y="' + (Ht - 18) + '" text-anchor="middle">' + t2 + '</text>';
      sv += '<text x="' + (L + (W - L - R) / 2) + '" y="' + (Ht - 2) + '" text-anchor="middle" style="font-size:11px">years from the start · line above 0 = money recovered</text>';
      sv += '<polyline fill="none" stroke="' + (cum[H] >= 0 ? 'var(--cyan)' : 'var(--warn)') + '" stroke-width="3" points="' + cum.map(function (v, t3) { return X(t3) + ',' + Y(v); }).join(' ') + '"/>';
      cum.forEach(function (v, t4) { sv += '<circle cx="' + X(t4) + '" cy="' + Y(v) + '" r="4" fill="var(--cyan)" tabindex="0" data-tip="<b>Year ' + t4 + '</b>total so far: ' + (v < 0 ? '−' : '+') + 'KZT ' + M(Math.abs(v)) + '" aria-label="Year ' + t4 + ' total ' + M(v) + ' tenge"/>'; });
      var el = $('#chartNet'); el.innerHTML = mk(W, Ht, sv, 'Total gain or loss of the pilot over the chosen number of years, under the chosen guesses'); bindTips(el);
      $('#beSrc').innerHTML = '<b>In short:</b> to cover the yearly cost, staff time worth ' + M(UPKEEP) + ' tenge would have to be freed, about <b>' + fmt(Math.round(UPKEEP / rate)) + ' hours a year</b> (' + (UPKEEP / rate / FTE_H).toFixed(1) + ' full-time workers) at your hourly cost.';
      var hA = RED * stop / 100 * mn / 60, hB = APP * sec / 3600;
      $('#beWork').innerHTML = 'With your numbers:<br>1. ' + fmt(RED) + ' × ' + stop + '% × ' + mn + ' ÷ 60 = <em>' + fmt(Math.round(hA)) + ' h</em>; ' + fmt(APP) + ' × ' + sec + ' ÷ 3,600 = <em>' + fmt(Math.round(hB)) + ' h</em>; total <em>' + fmt(Math.round(hrs)) + ' hours</em><br>2. ' + fmt(Math.round(hrs)) + ' × ' + fmt(rate) + ' = <em>' + (val / 1e6).toFixed(1) + ' million</em><br>3. ' + (val / 1e6).toFixed(1) + ' − 33.4 = <em>' + (net / 1e6).toFixed(1) + ' million per year</em><br>4. ' + (net > 0 ? '80.85 ÷ ' + (net / 1e6).toFixed(1) + ' = <em>' + be.toFixed(1) + ' years</em>' : 'net gain is not above zero, so the trial cost is never recovered') + '<br>5. After ' + H + ' years: −80.85 + ' + H + ' × ' + (net / 1e6).toFixed(1) + ' = <em>' + (cum[H] / 1e6).toFixed(1) + ' million</em><br>6. ' + fmt(Math.round(hrs)) + ' ÷ 1,920 = <em>' + (hrs / FTE_H).toFixed(1) + ' workers’ time</em>';
    }
    ids.forEach(function (k) { $('#be' + k).addEventListener('input', function () { $$('#ratePre button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.r === $('#beRate').value); }); run(); }); });
    $$('#ratePre button').forEach(function (b) { b.addEventListener('click', function () { $('#beRate').value = b.dataset.r; $$('#ratePre button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); run(); }); });
    run();
  })();

  /* ---------- Page 0: send-a-request activity ---------- */
  (function () {
    if (!$('#topics')) return;
    var SHARE = 0.258;
    var T = [
      { k: 'heat', t: 'No heating for two weeks', q: 'Heating in our apartment block has been off for two weeks.', ok: 'Housing & utilities office', lv: 'very high', due: 'within 24 hours' },
      { k: 'clinic', t: 'Cannot get a clinic appointment', q: 'I cannot get an appointment at my local clinic for a month.', ok: 'Health department', lv: 'high', due: 'within 72 hours' },
      { k: 'road', t: 'Pothole on my street', q: 'There is a deep pothole in the road in front of our school.', ok: 'Roads & transport office', lv: 'medium', due: 'within 7 calendar days' },
      { k: 'light', t: 'Street light is broken', q: 'The street light on our courtyard path has not worked for weeks.', ok: 'City lighting service', lv: 'low', due: 'within 10 days' }
    ];
    var WRONG = ['District office (intake)', 'Housing inspectorate', 'Social welfare department', 'Education department', 'Transport department', 'Land & construction office'];
    var cur = null, timers = [], tries = 0, redir = 0, tb = $('#topics');
    tb.innerHTML = T.map(function (x, i) { return '<button type="button" role="radio" aria-checked="false" data-i="' + i + '">' + x.t + '<small>Urgency: ' + x.lv + ' (illustrative)</small></button>'; }).join('');
    $$('button', tb).forEach(function (b) { b.addEventListener('click', function () { cur = T[+b.dataset.i]; $$('button', tb).forEach(function (x) { x.setAttribute('aria-checked', x === b); }); $('#tryHint').textContent = ''; $('#trySend').classList.add('pulse'); }); });
    function pick(a, n, not) { var p = a.filter(function (x) { return x !== not; }), o = []; while (o.length < n) { var i = Math.floor(Math.random() * p.length); o.push(p.splice(i, 1)[0]); } return o; }
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function meter(c, k, mode) {
      var col = c ? 'var(--warn)' : 'var(--green)';
      $('#tryMeter').innerHTML = '<div class="stat"><b style="color:' + col + '">' + c + '</b><span>transfers so far</span></div><div class="stat"><b style="color:' + col + '">' + (mode === 'ai' ? '?' : (c ? '≤ ' + 3 * c : '0')) + '</b><span>working days the law allows for transfers alone</span></div>';
    }
    function render(steps, k, mode) {
      clear();
      var ch = $('#tryChain'), vb = $('#tryVerdict');
      vb.hidden = true;
      ch.innerHTML = '<div class="env" id="env" aria-hidden="true">✉</div>' + steps.map(function (s) { return '<li class="' + s.c + '"><div class="dot">' + s.d + '</div><div><b>' + s.b + '</b><span>' + s.s + '</span></div></li>'; }).join('');
      var lis = $$('li', ch), env = $('#env'), c = 0;
      meter(0, k, mode);
      lis.forEach(function (l, i) {
        timers.push(setTimeout(function () {
          l.classList.add('on');
          env.style.transform = 'translateY(' + (l.offsetTop + 2) + 'px)';
          env.classList.toggle('bad', l.classList.contains('xfer'));
          if (l.classList.contains('xfer')) { c++; meter(c, k, mode); l.classList.add('hit'); }
        }, reduce ? 0 : 300 + i * 950));
      });
      timers.push(setTimeout(function () { env.classList.add('done'); vb.hidden = false; vb.classList.remove('pop'); void vb.offsetWidth; vb.classList.add('pop'); }, reduce ? 0 : 300 + lis.length * 950));
    }
    var typeT = 0;
    function typeQ(t) {
      var q = $('#tryQ'); if (reduce) { q.textContent = t; return; }
      var i = 0; q.textContent = ''; clearTimeout(typeT);
      (function step() { q.textContent = t.slice(0, ++i); if (i < t.length) typeT = setTimeout(step, 22); })();
    }
    function send() {
      if (!cur) { $('#tryHint').textContent = 'Please choose a problem first.'; return; }
      var moved = Math.random() < SHARE, k = moved ? 1 + Math.floor(Math.random() * 3) : 0;
      tries++; if (moved) redir++; $('#trySend').classList.remove('pulse');
      $('#tryRun').hidden = false; typeQ('“' + cur.q + '”'); $('#tryDue').textContent = cur.lv + ' urgency: ' + cur.due + ' (per Inform.kz)';
      var wr = pick(WRONG, k + (k ? 0 : 0), null), st = [{ c: '', d: '1', b: 'You submit it', s: 'Via eOtinish or the 109 call centre.' }];
      if (!moved) {
        st.push({ c: 'win', d: '2', b: cur.ok, s: 'Lucky: the first office was the right one.' });
        st.push({ c: 'win', d: '✓', b: 'Handled', s: 'No transfer needed.' });
      } else {
        wr.forEach(function (w, i) { st.push({ c: 'xfer', d: String(i + 2), b: w, s: 'Not our area: transferred onward (transfer ' + (i + 1) + ').' }); });
        st.push({ c: 'win', d: String(k + 2), b: cur.ok, s: 'Finally, the office that can act.' });
      }
      render(st, k, 'today');
      $('#tryVerdict').className = 'note ' + (moved ? 'red' : 'cy');
      $('#tryVerdict').innerHTML = moved ? '<b>Your request was passed on ' + k + (k > 1 ? ' times' : ' time') + '.</b> That is what happens to about 1 in 4 requests (25.8% in 2024). The law allows up to 3 working days for each transfer, so the transfers alone could use up to ' + 3 * k + ' working days. Some transfers are necessary; others are avoidable. <b>Telling them apart is where the question begins.</b>' : '<b>You were lucky this time.</b> About 3 in 4 requests were not redirected in 2024. Try again to see what the unlucky 1 in 4 looks like.';
      $('#tryTally').textContent = 'Your tries so far: ' + tries + ' · redirected: ' + redir + (tries > 1 ? ' (' + Math.round(100 * redir / tries) + '%; the real 2024 figure is 25.8%, a handful of tries will not match it)' : '');
      $('#tryRun').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }
    $('#trySend').addEventListener('click', send);
    $('#tryAgain').addEventListener('click', send);
    $('#tryAI').addEventListener('click', function () {
      if (!cur) return;
      render([
        { c: '', d: '1', b: 'You submit it', s: 'Same request, same channel.' },
        { c: 'ai', d: 'AI', b: 'Qoldau AI suggests: ' + cur.ok, s: 'A suggestion with its reason. Not a decision.' },
        { c: 'human', d: '👤', b: 'A public servant checks', s: 'Confirms or corrects the suggested office.' },
        { c: 'win', d: '✓', b: cur.ok, s: 'Sent to the office that is expected to handle it.' }
      ], 0, 'ai');
      $('#tryVerdict').className = 'note cy';
      $('#tryVerdict').innerHTML = '<b>Concept only.</b> Qoldau AI is a proposal and has not been built or tested. It could not remove transfers that are legally necessary, and whether it reduces avoidable ones is exactly what a pilot would measure. No result is claimed.';
    });
  })();

  route();
})();
