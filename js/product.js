/* =========================================================
   FRINGE — product.js (one product, poster-size)
   product.html?id=clean-slate — everything comes from js/data.js
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const D = window.FRINGE_DATA;
  const list = D.products;
  const id = new URLSearchParams(location.search).get('id');
  const i = Math.max(0, list.findIndex((p) => p.id === id));
  const p = list[i];
  const hairLabel = (h) => (D.hair.find((x) => x.id === h) || {}).label || h;
  const catLabel = (c) => (D.cats.find((x) => x.id === c) || {}).label || c;
  const CAT_ORDER = ['wash', 'treat', 'finish', 'tools', 'sets'];

  /* ================= FILL ================= */
  document.title = `${p.name} — FRINGE`;
  $('#pdImg').src = p.img; $('#pdImg').alt = `${p.name}, ${p.kind}`;
  $('#pdBig').textContent = p.name.split(' ')[0];
  $('#pdN').textContent = `${S.pad(i + 1)} / ${S.pad(list.length)}`;
  const cat = $('#pdCat'); cat.textContent = catLabel(p.cat); cat.href = `shop.html?cat=${p.cat}`;
  $('#pdName').textContent = p.name;
  $('#pdKind').textContent = `${p.kind} · ${p.vol}`;
  $('#pdDesc').textContent = p.desc;
  $('#pdFor').innerHTML = (p.for.includes('all') ? ['<span>made for every hair</span>'] : p.for.map((h) => `<a href="shop.html?hair=${h}"><span>${hairLabel(h)}</span></a>`)).join('');
  $('#pdVol').textContent = p.vol;
  $('#pdPrice').textContent = `€${p.price}`;
  $('#tags').innerHTML = p.tags.map((t) => `<li>${t}</li>`).join('');
  $('#howQ').textContent = p.use;
  $('#sbImg').src = p.img; $('#sbName').textContent = p.name; $('#sbMeta').textContent = `${p.vol} · €${p.price}`;
  const ship = () => {
    const total = S.bag.reduce((a, b) => a + (+b.price || 0), 0);
    $('#pdShip').textContent = total >= 60 ? 'free shipping on this order ✶' : `free shipping from €60 · €${60 - total} to go`;
  };
  ship();

  /* ================= ADD TO BAG ================= */
  let qty = 1;
  $('#minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); $('#qty').textContent = qty; });
  $('#plus').addEventListener('click', () => { qty = Math.min(9, qty + 1); $('#qty').textContent = qty; });
  const add = (btn, n) => {
    for (let k = 0; k < n; k++) S.addToBag({ id: p.id, name: p.name, price: p.price, img: p.img, meta: `${p.kind} · ${p.vol}` });
    S.toast(`${n} × ${p.name} — in the bag ✶`);
    ship();
    if (!M) return;
    // a dot flies to the bag (the bottle stays where it is)
    const from = btn.getBoundingClientRect(), to = $('#bag').getBoundingClientRect();
    const dot = document.createElement('i');
    dot.className = 'cursor__dot';
    Object.assign(dot.style, { position: 'fixed', left: `${from.left + from.width / 2}px`, top: `${from.top}px`, zIndex: 97, margin: 0, width: '18px', height: '18px' });
    document.body.append(dot);
    gsap.to(dot, { x: to.left + to.width / 2 - from.left - from.width / 2, duration: .9, ease: 'power1.inOut' });
    gsap.to(dot, { y: to.top - from.top, scale: .5, duration: .9, ease: 'back.in(2.2)', onComplete: () => dot.remove() });
    gsap.fromTo(btn, { scale: .94 }, { scale: 1, duration: .6, ease: 'elastic.out(1, .4)' });
  };
  $('#add').addEventListener('click', (e) => add(e.currentTarget, qty));
  $('#sbAdd').addEventListener('click', (e) => add(e.currentTarget, 1));

  /* ================= LOOK CLOSER: a lens over the bottle ================= */
  const stage = $('#stage'), lens = $('#lens'), img = $('#pdImg');
  const Z = 2.4;
  lens.style.backgroundImage = `url(${p.img})`;
  const content = () => {
    // where the picture really is inside its box (object-fit: contain, sitting at the bottom)
    const b = img.getBoundingClientRect(), nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
    const k = Math.min(b.width / nw, b.height / nh), w = nw * k, h = nh * k;
    return { left: b.left + (b.width - w) / 2, top: b.bottom - h, w, h };
  };
  if (S.fine) {
    stage.addEventListener('pointermove', (e) => {
      const c = content(), s = stage.getBoundingClientRect();
      const inside = e.clientX > c.left && e.clientX < c.left + c.w && e.clientY > c.top && e.clientY < c.top + c.h;
      stage.classList.toggle('is-looking', inside);
      lens.style.left = `${e.clientX - s.left}px`; lens.style.top = `${e.clientY - s.top}px`;
      lens.style.backgroundSize = `${c.w * Z}px ${c.h * Z}px`;
      lens.style.backgroundPosition = `${-((e.clientX - c.left) * Z - 110)}px ${-((e.clientY - c.top) * Z - 110)}px`;
    });
    stage.addEventListener('pointerleave', () => stage.classList.remove('is-looking'));
    if (M) {
      const bx = gsap.quickTo('#pdBig', 'x', { duration: 1.2, ease: 'power3.out' });
      stage.addEventListener('pointermove', (e) => { const r = stage.getBoundingClientRect(), k = (e.clientX - r.left) / r.width - .5; bx(k * -60); });
    }
  }

  /* ================= GOES WITH ================= */
  const fits = (q) => q.for.includes('all') || p.for.includes('all') || q.for.some((h) => p.for.includes(h));
  const pool = list.filter((q) => q.id !== p.id && q.cat !== p.cat && fits(q))
    .sort((a, b) => CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat));
  const picks = [];
  pool.forEach((q) => { if (picks.length < 3 && !picks.some((x) => x.cat === q.cat)) picks.push(q); });
  list.filter((q) => q.best && q.id !== p.id).forEach((q) => { if (picks.length < 3 && !picks.includes(q)) picks.push(q); });
  $('#pairRow').innerHTML = picks.map((q) => `
    <a class="pr" href="product.html?id=${q.id}" data-cursor="see it">
      <div class="pr__stage"><span class="pr__why">${catLabel(q.cat)}</span><img src="${q.img}" alt="${q.name}" loading="lazy" /></div>
      <p class="pr__name">${q.name}</p>
      <p class="pr__meta mono">${q.kind} · €${q.price}</p>
    </a>`).join('');

  /* ================= PREVIOUS / NEXT ================= */
  const nav = (el, q, label) => {
    el.href = `product.html?id=${q.id}`;
    el.innerHTML = label === 'prev'
      ? `<img src="${q.img}" alt="" /><span><small>← previous</small><b>${q.name}</b></span>`
      : `<span><small>next →</small><b>${q.name}</b></span><img src="${q.img}" alt="" />`;
  };
  nav($('#prev'), list[(i - 1 + list.length) % list.length], 'prev');
  nav($('#next'), list[(i + 1) % list.length], 'next');

  /* ================= STICKY BAR ================= */
  const sbar = $('#sbar');
  if (S.hasGsap) ScrollTrigger.create({ trigger: '#buy', start: 'bottom top', endTrigger: '#ft', end: 'top bottom', onToggle: (st) => { sbar.classList.toggle('is-on', st.isActive); sbar.setAttribute('aria-hidden', String(!st.isActive)); } });

  /* ================= ENTRANCE + SCROLL ================= */
  const bigChars = S.chars($('#pdBig'));
  const ftW = S.weights($('#ftWord'));
  S.reveal.then(() => {
    if (M) {
      gsap.from(bigChars, { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .05 });
      gsap.fromTo('#pdImg', { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: .2, clearProps: 'transform' });
      const nameW = S.words($('#pdName'));
      gsap.from(nameW, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .06, delay: .3 });
      gsap.from('.pd__crumbs, .pd__kind, .pd__desc, .pd__for, .pd__buy > *, .pd__ship', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: .05, delay: .45 });
      S.settle([bigChars, $('#pdImg'), nameW, $$('.pd__crumbs, .pd__kind, .pd__desc, .pd__for, .pd__buy > *, .pd__ship')], 2600);
      // scrolling away: the bottle leans back, the name drifts
      gsap.fromTo('#pdObj', { yPercent: 0 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '#pd', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('#pdBig', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '#pd', start: 'top top', end: 'bottom top', scrub: true } });
      S.onReach('#tags', 'top 85%', () => gsap.from('#tags li', { xPercent: -30, opacity: 0, rotationX: -60, transformOrigin: '50% 0%', duration: 1.1, ease: 'expo.out', stagger: .12 }));
      S.onReach('#howQ', 'top 85%', () => { const w = S.words($('#howQ')); gsap.from(w, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .03 }); });
      S.onReach('#pairRow', 'top 88%', () => gsap.from('.pr', { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1 }));
      S.onReach('#ftLogo', 'top 90%', () => {
        gsap.from(ftW.chars, { yPercent: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .06 });
        gsap.timeline({ delay: .4, onUpdate: ftW.wake }).to(ftW.f, { boost: 1, duration: .5 }).to(ftW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      });
    }
    S.reveals();
  });

  // remember what was looked at (the boutique could show it one day)
  try {
    const seen = JSON.parse(S.store.get('seen') || '[]').filter((x) => x !== p.id);
    seen.unshift(p.id); S.store.set('seen', JSON.stringify(seen.slice(0, 8)));
  } catch (e) {}

  $('#ftForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const m = $('#ftMail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { S.toast('that email has split ends. try again'); return; }
    S.store.set('club', m);
    S.toast("you're in the fringe club now ✶");
    $('#ftMail').value = '';
  });
})();
