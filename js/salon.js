/* =========================================================
   FRINGE — salon.js
   the menu, the waiting times, the chairs, a ticket that prints as you book
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const P = Object.fromEntries(window.FRINGE_DATA.products.map((p) => [p.id, p]));

  /* ================= DATA ================= */
  const MENU = [
    { id: 'cut', t: 'the cut', s: 'wash, cut, blow-dry. we talk first, then we cut.', d: '60 min', p: 55, from: true, img: 'img/SALON/the-cut.jpg' },
    { id: 'fringe', t: 'the fringe', s: 'a trim between cuts, or a rescue after the kitchen scissors.', d: '15 min', p: 12, club: true, img: 'img/SALON/the-fringe.jpg' },
    { id: 'colour', t: 'colour', s: 'permanent, roots or all over. glossed before you leave.', d: '90 min', p: 70, from: true, img: 'img/SALON/the-color.jpg' },
    { id: 'bleach', t: 'bleach & tone', s: 'platinum, highlights, the full drama. bonds protected all the way.', d: '3–4 h', p: 160, from: true, img: 'img/SALON/bleach.jpg' },
    { id: 'toner', t: 'toner refresh', s: 'when the yellow comes back to say hi.', d: '45 min', p: 45, img: 'img/SALON/toner-refresher.jpg' },
    { id: 'treatment', t: 'deep treatment', s: 'Bad Hair Day, Bleach Recovery and steam. you leave lighter.', d: '30 min', p: 35, img: 'img/SALON/deep-treat.jpg' },
    { id: 'curls', t: 'curls', s: 'cut dry, curl by curl, the way they fall.', d: '75 min', p: 65, from: true, img: 'img/SALON/curls.jpg' },
    { id: 'style', t: 'blow-dry & style', s: 'for the night out, the wedding, the ex\'s party.', d: '40 min', p: 35, img: 'img/SALON/blow-dry.jpg' },
  ];
  const TEAM = [
    { id: 'nadia', name: 'Nadia', role: 'colour & bleach · 12 years', quote: 'If it\'s yellow, <em class="script">it\'s not finished.</em>', img: 'img/SALON/nadia.jpg', fav: 'blonde-duo' },
    { id: 'kiki', name: 'Kiki', role: 'cuts & fringes · 8 years', quote: 'Bring me the photo. <em class="script">Then let me ignore it.</em>', img: 'img/SALON/kiki.jpg', fav: 'sweetheart-comb' },
    { id: 'mo', name: 'Mo', role: 'curls & braids · 10 years', quote: 'Curls don\'t need fixing. <em class="script">They need listening.</em>', img: 'img/SALON/mo.jpg', fav: 'curl-harmony' },
  ];
  // milano opening hours: [open, close] in hours, null = closed. index 0 = sunday
  const HOURS = [null, null, [10, 20], [10, 20], [10, 20], [10, 21], [9, 19]];
  const DN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const MN = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  // add days on the calendar, not in milliseconds: 24h jumps get lost when the clocks change
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmt = (d) => `${DN[d.getDay()]} ${d.getDate()} ${MN[d.getMonth()]}`;
  const price = (m) => `${m.from ? 'from ' : ''}€${m.p}`;

  /* ================= OPEN NOW? (milano time) ================= */
  const milano = () => { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' })); } catch (e) { return new Date(); } };
  const status = () => {
    const now = milano(), h = HOURS[now.getDay()], t = now.getHours() + now.getMinutes() / 60;
    const open = h && t >= h[0] && t < h[1];
    const el = $('#slOpen');
    el.classList.toggle('is-open', !!open);
    el.textContent = open ? `open now · until ${h[1]}:00` : 'closed now · walk in tomorrow';
  };
  status(); setInterval(status, 60000);
  $('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `<li class="${d === milano().getDay() ? 'is-today' : ''}"><span>${DN[d]}</span><span>${HOURS[d] ? `${HOURS[d][0]}:00 — ${HOURS[d][1]}:00` : 'closed, washing the towels'}</span></li>`).join('');

  /* ================= THE MENU ================= */
  $('#menuList').innerHTML = MENU.map((m, k) => `
    <li class="mi" data-svc="${m.id}" data-peek="${m.img}" data-cursor="book this">
      <span class="mi__n">${S.pad(k + 1)}</span>
      <span class="mi__t">${m.t}<small>${m.s}</small></span>
      <span class="mi__d">${m.d}</span>
      <span class="mi__p">${m.club ? '<span class="script">free</span> for the club · ' : ''}${price(m)}</span>
    </li>`).join('');
  const peek = $('#peek');
  if (S.fine && M) {
    const qx = gsap.quickTo(peek, 'x', { duration: .55, ease: 'power3.out' });
    const qy = gsap.quickTo(peek, 'y', { duration: .55, ease: 'power3.out' });
    const qr = gsap.quickTo(peek, 'rotation', { duration: .8, ease: 'power3.out' });
    let lx = 0;
    $$('.mi').forEach((r) => {
      r.addEventListener('pointerenter', () => {
        peek.dataset.img = r.dataset.peek; peek.dataset.label = '';
        S.slot(peek);
        gsap.to(peek, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' });
      });
      r.addEventListener('pointerleave', () => gsap.to(peek, { opacity: 0, scale: .6, duration: .35, ease: 'power2.in' }));
    });
    let px = -1, py = -1;
    const hide = () => gsap.to(peek, { opacity: 0, scale: .6, duration: .35, ease: 'power2.in', overwrite: 'auto' });
    $('#menuList').addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; qx(e.clientX + 30); qy(e.clientY - 160); qr(S.clamp((e.clientX - lx) * .6, -14, 14)); lx = e.clientX; });
    $('#menuList').addEventListener('pointerleave', hide);
    // scrolling with the wheel moves the rows away without a pointerleave: check what's under the mouse now
    addEventListener('scroll', () => { if (+getComputedStyle(peek).opacity > 0 && !document.elementFromPoint(px, py)?.closest('.mi')) hide(); }, { passive: true });
  }
  // a menu line books that service
  $('#menuList').addEventListener('click', (e) => {
    const r = e.target.closest('.mi'); if (!r) return;
    pickService(r.dataset.svc);
    S.scrollTo('#book');
  });
  if (M) S.onReach('#menuList', 'top 85%', () => gsap.from('.mi', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06 }));

  /* ================= BETWEEN APPOINTMENTS ================= */
  const WAIT = [
    { id: 'bleach', label: 'bleach', cls: 'plat', weeks: 6, k: 'minimum 6 weeks', note: 'recovery is not optional. Bleach Recovery every wash.' },
    { id: 'toner', label: 'toner', cls: 'ink', weeks: 2, k: 'every 2–3 weeks', note: 'when the yellow comes back to say hi.' },
    { id: 'colour', label: 'colour', cls: 'choc', weeks: 4, k: '4–6 weeks', note: 'for permanent colour. the roots will text you.' },
  ];
  $('#waitMap').innerHTML = WAIT.map((w) => `
    <div class="wc" data-w="${w.id}">
      <span class="wc__dot wc__dot--${w.cls}">${w.label}</span>
      <div><p class="wc__k">${w.k}</p><p class="wc__when" data-when></p><p class="wc__note">${w.note}</p></div>
    </div>`).join('');
  const dateIn = $('#waitDate');
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const saved = S.store.get('last-appointment');
  dateIn.value = saved || iso(addDays(today, -21));
  dateIn.max = iso(today);
  const updateWait = (anim) => {
    const base = new Date(`${dateIn.value}T00:00:00`);
    if (isNaN(base)) return;
    WAIT.forEach((w) => {
      const next = addDays(base, w.weeks * 7);
      const row = $(`.wc[data-w="${w.id}"]`), el = $('[data-when]', row);
      const ready = next <= today;
      row.classList.toggle('is-ready', ready);
      const txt = ready ? 'ready now' : `from ${fmt(next)}`;
      el.dataset.final = txt; el.textContent = txt;
      if (anim) S.scramble(el, .6);
    });
  };
  dateIn.addEventListener('change', () => { S.store.set('last-appointment', dateIn.value); updateWait(true); });
  updateWait(false);
  if (M) S.onReach('#waitMap', 'top 80%', () => {
    gsap.from('.wc__dot', { scale: 0, rotate: -90, duration: 1.2, ease: 'elastic.out(1, .55)', stagger: .15 });
    gsap.from('.wc > div', { x: (i) => (i % 2 ? -50 : 50), opacity: 0, duration: 1, ease: 'expo.out', stagger: .15, delay: .15 });
  });

  /* ================= THE CHAIRS ================= */
  $('#teamRow').innerHTML = TEAM.map((t) => {
    const f = P[t.fav];
    return `<article class="mate" data-cursor="${t.name}'s favourite">
      <div class="mate__pic"><div class="slot" data-img="${t.img}" data-ratio="4/5" data-label="${t.img.split('/').pop()}"></div>
        <span class="mate__fav">${f ? `<img src="${f.img}" alt="${f.name}" />` : ''}</span></div>
      <h3 class="mate__name">${t.name}</h3>
      <p class="mate__role mono">${t.role}${f ? ` · loves ${f.name}` : ''}</p>
      <p class="mate__quote">${t.quote}</p>
    </article>`;
  }).join('');
  S.slots();
  if (M) S.onReach('#teamRow', 'top 85%', () => {
    gsap.fromTo('.mate__pic', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: .12 });
    gsap.from('.mate__name, .mate__role, .mate__quote', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .05, delay: .6 });
  });

  /* ================= BOOK A CHAIR: the ticket prints as you choose ================= */
  const bk = { svc: null, who: 'anyone', day: null, time: null };
  const tk = $('#ticket');
  const no = S.pad(S.rand(1, 9999), 4);
  $('#tkNo').textContent = `n° ${no}`;
  $('#bkService').innerHTML = MENU.map((m) => `<button type="button" class="pill" data-svc="${m.id}">${m.t}<small>${price(m)}</small></button>`).join('');
  $('#bkWho').innerHTML = [{ id: 'anyone', name: 'whoever\'s free' }, ...TEAM].map((t) => `<button type="button" class="pill${t.id === 'anyone' ? ' is-on' : ''}" data-who="${t.id}">${t.name}</button>`).join('');
  const days = Array.from({ length: 7 }, (_, k) => addDays(today, k + 1));
  $('#bkDay').innerHTML = days.map((d, k) => `<button type="button" class="day-b" data-day="${k}" ${HOURS[d.getDay()] ? '' : 'disabled'}><span>${DN[d.getDay()]}</span><b>${d.getDate()}</b><span>${MN[d.getMonth()]}</span></button>`).join('');
  // some slots are already taken (always the same ones for the same day)
  const taken = (d, h) => ((d.getDate() * 7 + h * 13) % 5) === 0;
  const renderTimes = () => {
    const d = bk.day != null ? days[bk.day] : null;
    const h = d && HOURS[d.getDay()];
    if (!h) { $('#bkTime').innerHTML = '<span class="mono">pick a day first</span>'; return; }
    const slots = [];
    for (let t = h[0]; t <= h[1] - 1.5; t += 1.5) slots.push(t);
    $('#bkTime').innerHTML = slots.map((t) => {
      const lab = `${Math.floor(t)}:${t % 1 ? '30' : '00'}`;
      return `<button type="button" class="pill${bk.time === lab ? ' is-on' : ''}" data-time="${lab}" ${taken(d, t) ? 'disabled' : ''}>${lab}</button>`;
    }).join('');
    if (M) gsap.from('#bkTime .pill', { y: 14, opacity: 0, duration: .5, ease: 'expo.out', stagger: .03 });
  };
  const paint = (key) => {
    const m = MENU.find((x) => x.id === bk.svc);
    const t = TEAM.find((x) => x.id === bk.who);
    const vals = {
      tkService: m ? m.t : '—',
      tkWho: t ? t.name : 'whoever\'s free',
      tkWhen: bk.day != null ? `${fmt(days[bk.day])}${bk.time ? ` · ${bk.time}` : ''}` : '—',
      tkName: $('#bkName').value.trim() || 'your name',
    };
    Object.entries(vals).forEach(([id, v]) => {
      const el = $(`#${id}`);
      if (el.textContent === v) return;
      el.textContent = v;
      if (M && key) gsap.fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    });
    $('#tkPrice').textContent = m ? `€${m.p}` : '€0';
    $('#tkTime').textContent = m ? m.d : '';
    tk.classList.remove('is-booked');
  };
  const pickService = (id) => {
    bk.svc = id;
    $$('#bkService .pill').forEach((x) => x.classList.toggle('is-on', x.dataset.svc === id));
    paint(true);
  };
  $('#bkService').addEventListener('click', (e) => { const b = e.target.closest('.pill'); if (b) pickService(b.dataset.svc); });
  $('#bkWho').addEventListener('click', (e) => {
    const b = e.target.closest('.pill'); if (!b) return;
    bk.who = b.dataset.who;
    $$('#bkWho .pill').forEach((x) => x.classList.toggle('is-on', x === b));
    paint(true);
  });
  $('#bkDay').addEventListener('click', (e) => {
    const b = e.target.closest('.day-b'); if (!b) return;
    bk.day = +b.dataset.day; bk.time = null;
    $$('#bkDay .day-b').forEach((x) => x.classList.toggle('is-on', x === b));
    renderTimes(); paint(true);
  });
  $('#bkTime').addEventListener('click', (e) => {
    const b = e.target.closest('.pill'); if (!b) return;
    bk.time = b.dataset.time;
    $$('#bkTime .pill').forEach((x) => x.classList.toggle('is-on', x === b));
    paint(true);
  });
  $('#bkName').addEventListener('input', () => paint(false));
  renderTimes();

  $('#bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const miss = !bk.svc ? 'pick a service first' : bk.day == null ? 'pick a day' : !bk.time ? 'pick a time' : !$('#bkName').value.trim() ? 'tell us your name' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#bkMail').value.trim()) ? 'that email has split ends. try again' : '';
    if (miss) { S.toast(miss); return; }
    const m = MENU.find((x) => x.id === bk.svc);
    S.store.set('booking', JSON.stringify({ ...bk, service: m.t, date: iso(days[bk.day]), name: $('#bkName').value.trim(), no }));
    tk.classList.add('is-booked');
    if (M) gsap.fromTo(tk, { rotationY: 0 }, { rotationY: 360, duration: 1.2, ease: 'expo.inOut' });
    S.toast(`booked: ${m.t}, ${fmt(days[bk.day])} at ${bk.time}. see you, ${$('#bkName').value.trim()} ✶`, 4800);
  });
  // a booking from a previous visit comes back on the ticket
  try {
    const b = JSON.parse(S.store.get('booking') || 'null');
    if (b && new Date(`${b.date}T00:00:00`) >= today) {
      $('#tkService').textContent = b.service; $('#tkWhen').textContent = `${fmt(new Date(`${b.date}T00:00:00`))} · ${b.time}`;
      $('#tkName').textContent = b.name; $('#tkWho').textContent = (TEAM.find((t) => t.id === b.who) || {}).name || 'whoever\'s free';
      $('#tkNo').textContent = `n° ${b.no}`; tk.classList.add('is-booked');
      const m = MENU.find((x) => x.id === b.svc); if (m) { $('#tkPrice').textContent = `€${m.p}`; $('#tkTime').textContent = m.d; }
    }
  } catch (e) {}
  // the ticket tilts toward the mouse
  if (M && S.fine) {
    const rx = gsap.quickTo(tk, 'rotationX', { duration: .7, ease: 'power3.out' });
    const ry = gsap.quickTo(tk, 'rotationY', { duration: .7, ease: 'power3.out' });
    $('.ticket-wrap').addEventListener('pointermove', (e) => { const r = tk.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 14); rx(-((e.clientY - r.top) / r.height - .5) * 10); });
    $('.ticket-wrap').addEventListener('pointerleave', () => { rx(0); ry(0); });
  }
  if (M) S.onReach('#book', 'top 70%', () => gsap.from(tk, { y: 120, rotation: 8, opacity: 0, duration: 1.4, ease: 'expo.out' }));

  /* ================= ENTRANCE ================= */
  const slW = S.weights($('#slWord'), { base: 150, max: 860 });
  const ftW = S.weights($('#ftWord'));
  S.reveal.then(() => {
    if (M) {
      gsap.from(slW.chars, { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .07 });
      gsap.timeline({ delay: .5, onUpdate: slW.wake }).to(slW.f, { boost: .9, duration: .5 }).to(slW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.from('.sl-hero__k, .sl-hero__txt > *', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .3 });
      gsap.fromTo('.sl-hero__pic', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', stagger: .15, delay: .3 });
      gsap.to('.sl-hero__pic--sm', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '#slHero', start: 'top top', end: 'bottom top', scrub: true } });
      const thin = { v: 0 };
      gsap.to(thin, { v: 1, ease: 'none', scrollTrigger: { trigger: '#slHero', start: 'top top', end: 'bottom top', scrub: true }, onUpdate: () => slW.setBase(150 - thin.v * 50) });
      S.onReach('.visit', 'top 80%', () => gsap.fromTo('.visit__pic', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }));
      S.onReach('#ftLogo', 'top 90%', () => {
        gsap.from(ftW.chars, { yPercent: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .06 });
        gsap.timeline({ delay: .4, onUpdate: ftW.wake }).to(ftW.f, { boost: 1, duration: .5 }).to(ftW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      });
    }
    S.reveals();
  });

  $('#ftForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const m = $('#ftMail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { S.toast('that email has split ends. try again'); return; }
    S.store.set('club', m);
    S.toast("you're in the fringe club now ✶");
    $('#ftMail').value = '';
  });
})();
