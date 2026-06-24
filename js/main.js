/* =======================================================================
   SAIL — main.js
   - sticky nav state + mobile toggle
   - animated neural-network canvas (hero background)
   - floating TRUST words
   - scroll reveal
   ==================================================================== */
(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- typewriter lab name ---------- */
  const title = document.getElementById('heroTitle');
  if (title && !reduceMotion) {
    // [text, highlightClass] segments — '' means normal text
    const segs = [
      ['S', 'grad'], ['ociotechnical ', ''],
      ['AI', 'grad'], [' ', ''],
      ['L', 'grad'], ['ab ', ''],
      ['(SAIL)', 'hero__abbr']
    ];
    const chars = [];
    segs.forEach(([txt, cls]) => { for (const ch of txt) chars.push([ch, cls]); });

    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const render = (n) => {
      let html = '', i = 0;
      while (i < n) {
        const cls = chars[i][1]; let seg = '';
        while (i < n && chars[i][1] === cls) { seg += chars[i][0]; i++; }
        html += cls ? '<span class="' + cls + '">' + esc(seg) + '</span>' : esc(seg);
      }
      return html + '<span class="type-caret" aria-hidden="true"></span>';
    };

    title.setAttribute('aria-label', chars.map(c => c[0]).join(''));
    title.classList.add('is-typing');
    title.innerHTML = render(0);
    let n = 0;
    const tick = () => {
      n++;
      title.innerHTML = render(n);
      if (n < chars.length) {
        // brief pause before the parenthetical abbreviation
        const next = chars[n] && chars[n][0] === '(' ? 480 : 60 + Math.random() * 55;
        setTimeout(tick, next);
      } else {
        // typing done — drop the caret entirely
        title.classList.remove('is-typing');
        title.innerHTML = render(chars.length).replace(
          '<span class="type-caret" aria-hidden="true"></span>', ''
        );
      }
    };
    setTimeout(tick, 450);
  }

  /* ---------- sticky nav ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.section-head, .node, .overview__desc, .value, .join__inner'
  );
  revealEls.forEach(el => el.classList.add('reveal'));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const sibs = Array.from(e.target.parentElement.children).filter(c =>
              c.classList.contains('reveal')
            );
            const idx = sibs.indexOf(e.target);
            e.target.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- floating TRUST words ---------- */
  const cloud = document.getElementById('wordCloud');
  if (cloud && !reduceMotion) {
    const words = [
      'Timely', 'Responsible', 'Understandable', 'Scalable', 'Transparent',
      'Trust', 'Agents', 'Reasoning', 'Human-AI', 'Resilience', 'Health', 'Equity'
    ];
    const make = () => {
      const w = document.createElement('span');
      w.className = 'floatword';
      const txt = words[(Math.random() * words.length) | 0];
      w.innerHTML = '<b>' + txt.charAt(0) + '</b>' + txt.slice(1);
      const size = 14 + Math.random() * 46;
      w.style.fontSize = size + 'px';
      w.style.left = Math.random() * 100 + '%';
      w.style.top = 60 + Math.random() * 45 + '%';
      const dur = 9 + Math.random() * 10;
      w.style.animationDuration = dur + 's';
      cloud.appendChild(w);
      setTimeout(() => w.remove(), dur * 1000);
    };
    for (let i = 0; i < 6; i++) setTimeout(make, i * 700);
    setInterval(make, 1900);
  }

  /* ---------- neural network canvas ---------- */
  const canvas = document.getElementById('netCanvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [], raf;
  const COLORS = ['rgba(37,99,235,', 'rgba(96,165,250,', 'rgba(226,59,59,'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(72, Math.round((w * h) / 17000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.3 + Math.random() * 2.1,
      c: COLORS[(Math.random() * (Math.random() < 0.12 ? 3 : 2)) | 0]
    }));
  }

  const mouse = { x: -9999, y: -9999 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const LINK = 132;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      // mouse attraction
      const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 150) { n.x += (mdx / md) * 0.5; n.y += (mdy / md) * 0.5; }

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          const a = (1 - d / LINK) * 0.38;
          ctx.strokeStyle = 'rgba(37,99,235,' + a.toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      ctx.fillStyle = n.c + '0.7)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 180); });
  resize();
  draw();

  // pause when hero off-screen
  const host = canvas.closest('.hero, .page__hero') || canvas.parentElement;
  if (host && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) { if (!raf) draw(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 }).observe(host);
  }
})();
