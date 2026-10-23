/* =========================================================
   FRINGE — shop.js (the boutique)
   a shelf that rearranges itself; every card opens its product page
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const D = window.FRINGE_DATA;
  if (window.Flip) gsap.registerPlugin(Flip);

  const hairLabel = (id) => (D.hair.find((h) => h.id === id) || {}).label || id;
  const forText = (p) => (p.for.includes('all') ? ['every hair'] : p.for.map(hairLabel));

  /* ================= THE WORDS ================= */
  const bqW = S.weights($('#bqWord'), { base: 150, max: 860 });
  $('#bqCount').textContent = D.products.length;
  const ftW = S.weights($('#ftWord'));

  /* ================= THE SHELF ================= */
  const grid = $('#grid'), shelf = $('#shelf');
  const cards = D.products.map((p, i) => {
    const el = document.createElement('article');
    el.className = 'pc';
    el.dataset.id = p.id;
    el.dataset.cursor = 'look closer';
    el.innerHTML = `
      <div class="pc__stage">
        <img class="pc__img" src="${p.img}" alt="${p.name}, ${p.kind}" loading="lazy" draggable="false" />
        <span class="pc__n mono">${S.pad(i + 1)}</span>
        ${p.best ? '<span class="pc__badge">bestseller</span>' : ''}
      </div>
      <h2 class="pc__name"><a href="product.html?id=${p.id}" data-cursor="the whole page">${p.name}</a></h2>
      <p class="pc__meta mono">${p.kind} · ${p.vol}</p>
      <p class="pc__for">${forText(p).map((t) => `<span>${t}</span>`).join('')}</p>
      <p class="pc__buy"><span>€${p.price}</span><button class="add" type="button">add +</button></p>
      <a class="btn-view pc__view" href="product.html?id=${p.id}">view product <i>→</i></a>`;
    el._p = p; el._i = i;
    grid.append(el);
    return el;
  });
  const tiles = $$('.tile', grid);

  // pills
  const st = { cat: 'all', hair: 'any', sort: 'featured' };
  const q = new URLSearchParams(location.search);
  if (D.cats.some((c) => c.id === q.get('cat'))) st.cat = q.get('cat');
  if (D.hair.some((h) => h.id === q.get('hair'))) st.hair = q.get('hair');
  const pill = (group, item, n) => `<button type="button" class="pill${st[group] === item.id ? ' is-on' : ''}" data-g="${group}" data-v="${item.id}">${item.label}${n != null ? `<sup>${n}</sup>` : ''}</button>`;
  $('#fCat').innerHTML = D.cats.map((c) => pill('cat', c, c.id === 'all' ? D.products.length : D.products.filter((p) => p.cat === c.id).length)).join('');
  $('#fHair').insertAdjacentHTML('beforeend', D.hair.map((h) => pill('hair', h)).join(''));

  const matches = (p) => (st.cat === 'all' || p.cat === st.cat) && (st.hair === 'any' || p.for.includes(st.hair) || p.for.includes('all'));
  const SORT = {
    featured: (a, b) => a._i - b._i,
    low: (a, b) => a._p.price - b._p.price,
    high: (a, b) => b._p.price - a._p.price,
    az: (a, b) => a._p.name.localeCompare(b._p.name),
  };
  let visible = [];
  const layout = () => {
    visible = cards.filter((c) => matches(c._p)).sort(SORT[st.sort]);
    cards.forEach((c) => { c.style.display = visible.includes(c) ? '' : 'none'; });
    visible.forEach((c, k) => { c.style.order = k * 10; });
    // the editorial tiles only live on the full, unsorted shelf
    const full = st.cat === 'all' && st.hair === 'any' && st.sort === 'featured';
    tiles.forEach((t) => { t.style.display = full ? '' : 'none'; t.style.order = +t.dataset.tile * 10 - 5; });
    shelf.classList.toggle('is-empty', !visible.length);
    $('#bqCount').textContent = visible.length;
  };

  // the shelf rearranges itself. two things keep it smooth when lots of cards come back at once:
  // the grid keeps its height while the cards fly (absolute positioning would collapse it and jump the page),
  // and any half-finished tween from the last click is killed before the new one starts
  let flip = null;
  const apply = () => {
    if (!M || !window.Flip) { layout(); return; }
    const all = [...cards, ...tiles];
    flip?.progress(1); flip = null;
    gsap.killTweensOf(all);
    gsap.set(all, { clearProps: 'opacity,scale,transform' });
    grid.style.minHeight = `${grid.offsetHeight}px`;
    const state = Flip.getState(all);
    layout();
    flip = Flip.from(state, {
      duration: .75, ease: 'power3.inOut', absolute: true, stagger: .015,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .6, ease: 'power3.out', delay: .3, stagger: .03, clearProps: 'opacity,scale,transform' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: .85, duration: .3, ease: 'power2.in' }),
      onComplete: () => { grid.style.minHeight = ''; flip = null; ScrollTrigger.refresh(); },
    });
  };
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('.pill'); if (!b) return;
    const g = b.dataset.g;
    if (st[g] === b.dataset.v && g === 'hair') st.hair = 'any'; // click again to clear the hair filter
    else st[g] = b.dataset.v;
    $$(`.pill[data-g="${g}"]`).forEach((x) => x.classList.toggle('is-on', x.dataset.v === st[g]));
    apply();
    const top = $('#filters').getBoundingClientRect().top + scrollY - 10;
    if (scrollY > top + 400 && (st.cat !== 'all' || st.hair !== 'any')) S.scrollTo(top);
  });
  $('#fSort').addEventListener('change', (e) => { st.sort = e.target.value; apply(); });
  $('#reset').addEventListener('click', () => {
    st.cat = 'all'; st.hair = 'any';
    $$('.pill').forEach((x) => x.classList.toggle('is-on', x.dataset.v === 'all' || x.dataset.v === 'any'));
    apply();
  });
  layout();

  /* ================= ADD TO BAG ================= */
  const flyToBag = (fromEl) => {
    if (!M) return;
    const from = fromEl.getBoundingClientRect(), to = $('#bag').getBoundingClientRect();
    const dot = document.createElement('i');
    dot.className = 'cursor__dot';
    Object.assign(dot.style, { position: 'fixed', left: from.left + from.width / 2 + 'px', top: from.top + 'px', zIndex: 97, margin: 0, width: '18px', height: '18px' });
    document.body.append(dot);
    gsap.to(dot, { x: to.left + to.width / 2 - from.left - from.width / 2, duration: .9, ease: 'power1.inOut' });
    gsap.to(dot, { y: to.top - from.top, duration: .9, ease: 'back.in(2.2)', scale: .5, onComplete: () => dot.remove() });
  };
  const add = (p, n = 1) => {
    for (let k = 0; k < n; k++) S.addToBag({ id: p.id, name: p.name, price: p.price, img: p.img, meta: `${p.kind} · ${p.vol}` });
  };
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.pc'); if (!card || e.target.closest('a')) return;
    const btn = e.target.closest('.add');
    if (btn) {
      add(card._p); flyToBag(btn);
      btn.classList.add('is-in'); btn.textContent = 'added ✓';
      setTimeout(() => { btn.classList.remove('is-in'); btn.textContent = 'add +'; }, 1800);
      S.toast(`${card._p.name} — in the bag ✶`);
      return;
    }
    // the card opens the product's own page
    location.href = `product.html?id=${card._p.id}`;
  });

  /* ================= ENTRANCE + SCROLL ================= */
  S.reveal.then(() => {
    if (M) {
      gsap.from(bqW.chars, { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .05 });
      gsap.timeline({ delay: .5, onUpdate: bqW.wake }).to(bqW.f, { boost: .9, duration: .5 }).to(bqW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.from('.bq-hero__row > *, .bq-hero__k', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .3 });
      gsap.from('.filters .pill, .filters__sort', { y: 16, opacity: 0, duration: .8, ease: 'expo.out', stagger: .025, delay: .5 });
      gsap.from([...visible.slice(0, 4), ...tiles.slice(0, 1)], { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, delay: .6 });
      // the word thins out as you scroll into the shelf
      const thin = { v: 0 };
      gsap.to(thin, { v: 1, ease: 'none', scrollTrigger: { trigger: '#bqHero', start: 'top top', end: 'bottom top', scrub: true }, onUpdate: () => bqW.setBase(150 - thin.v * 50) });
      S.onReach('#ftLogo', 'top 90%', () => {
        gsap.from(ftW.chars, { yPercent: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .06 });
        gsap.timeline({ delay: .4, onUpdate: ftW.wake }).to(ftW.f, { boost: 1, duration: .5 }).to(ftW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      });
      // the cards further down rise in as they come
      visible.slice(4).forEach((c) => S.onReach(c, 'top 92%', () => gsap.from(c, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out' })));
      tiles.slice(1).forEach((t) => S.onReach(t, 'top 92%', () => gsap.from(t, { clipPath: 'inset(30% 10% 30% 10%)', duration: 1.4, ease: 'expo.out' })));
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
