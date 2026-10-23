/* =========================================================
   FRINGE — home.js
   the word, the poster, the spread, the store
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const wideMQ = matchMedia('(min-width: 961px)');

  /* ================= 1 · HERO: a thin word that thickens near you ================= */
  const hero = $('#hero');
  const heroW = S.weights($('#heroWord'));

  S.reveal.then(() => {
    if (!M) { S.reveals(); return; }
    // the letters rise thin, then a wave of weight runs through them once
    gsap.from(heroW.chars, { yPercent: 70, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .06 });
    gsap.timeline({ delay: .5, onUpdate: heroW.wake }).to(heroW.f, { boost: .9, duration: .5, ease: 'power2.out' }).to(heroW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
    gsap.from('#heroSlot', { scale: 1.25, duration: 2.4, ease: 'expo.out' });
    gsap.from('.hero__tag', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', delay: .5 });
    gsap.from('.hero__foot > *', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, delay: .7 });

    // leaving the hero: the photo drifts, the word goes hairline-thin and opens up
    const thin = { v: 0 };
    gsap.to(thin, {
      v: 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      onUpdate: () => heroW.setBase(200 - thin.v * 100),
    });
    gsap.to('#heroWord', { letterSpacing: '.06em', yPercent: 30, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__photo', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    S.reveals();
  });

  addEventListener('fringe:swag', () => {
    const s = $('.hero__tag .script'); const was = s.textContent;
    s.textContent = 'swag'; setTimeout(() => { s.textContent = was; }, 3000);
  });

  /* ================= STRIP ================= */
  if (M) $$('[data-marquee]').forEach((tr) => {
    const tw = gsap.to(tr, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    gsap.ticker.add(() => tw.timeScale(gsap.utils.interpolate(tw.timeScale(), 1 + Math.min(6, Math.abs(S.vel) * .4), .1)));
  });

  /* ================= 2 · RITUALS: the four photos open like curtains ================= */
  if (M) S.onReach('#acts', 'top 80%', () => {
    gsap.fromTo('.act', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: .12 });
    gsap.from('.act .slot', { scale: 1.35, duration: 2, ease: 'expo.out', stagger: .12 });
    gsap.from('.act__txt', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, delay: .8 });
  });

  /* ================= 3 · THE POSTER: one product in front of its own name ================= */
  const P = [
    { name: 'Clean Slate', vol: 300, face: 'face.jpg', swatch: 'swatch.jpg', copy: 'Hair changes every day. It reacts to the weather, the party, the pillow and the bleach.', for: "for every hair that's been through it", tags: ['rice protein', 'lactic acid', 'rosemary leaf'] },
    { name: 'Bad Hair Day', vol: 200, face: 'face-mask.jpg', swatch: 'swatch-mask.webp', copy: 'Ten minutes under a towel. The drama stays, the frizz leaves without saying goodbye.', for: 'for hair that had a night', tags: ['shea butter', 'ceramides', 'pink clay'] },
    { name: 'Gloss Bomb', vol: 30, face: 'face-oil.jpg', swatch: 'swatch-oil.webp', copy: 'Two drops on the ends and your hair reflects the room like a 2003 music video.', for: 'for ends that want attention', tags: ['camellia oil', 'squalane', 'silk amino acids'] },
  ];
  const poster = $('#poster'), pName = $('#posterName'), pProds = $$('#posterProduct .slot');
  const pFace = $('#posterFace'), pSwatch = $('#posterSwatch');
  const swapImg = (slot, file) => {
    // cut-outs (.webp) float on the poster, photos (.jpg) keep their frame
    const go = () => { slot.dataset.img = `img/HOME/${file}`; slot.dataset.label = file; slot.classList.toggle('slot--cut', file.endsWith('.webp')); S.slot(slot); };
    if (!M) return go();
    gsap.timeline().to(slot, { clipPath: 'inset(0% 0% 100% 0%)', duration: .45, ease: 'power3.in', onComplete: go })
      .to(slot, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'expo.out', delay: .1 });
  };
  // preload the other faces and swatches so the swap never shows an empty frame
  addEventListener('load', () => ['face-mask.jpg', 'face-oil.jpg', 'swatch-mask.webp', 'swatch-oil.webp'].forEach((f) => { new Image().src = `img/HOME/${f}`; }));
  const pCopy = $('#posterCopy'), pVol = $('#posterVol'), pFor = $('#posterFor'), pTags = $('#posterTags'), pDots = $$('#posterDots i');
  let cur = 0, pinST = null;
  pProds[0].classList.add('is-on');
  const splitName = () => { delete pName._chars; return S.chars(pName); };
  splitName();

  const show = (i) => {
    if (i === cur) return;
    const dir = i > cur ? 1 : -1, d = P[i], old = pProds[cur], nu = pProds[i];
    cur = i;
    pDots.forEach((x, k) => x.classList.toggle('is-on', k === i));
    swapImg(pFace, d.face); swapImg(pSwatch, d.swatch);
    if (!M) {
      pName.textContent = d.name; pCopy.textContent = d.copy; pVol.textContent = d.vol; pFor.textContent = d.for;
      pTags.innerHTML = d.tags.map((t) => `<li>${t}</li>`).join('');
      old.classList.remove('is-on'); nu.classList.add('is-on');
      return;
    }
    // the name: old letters fly out, new ones come up from under the line
    gsap.killTweensOf(pName._chars || []);
    gsap.to(pName._chars, {
      yPercent: -105 * dir, opacity: 0, duration: .35, ease: 'power2.in', stagger: .015,
      onComplete: () => {
        if (P[cur] !== d) return;
        pName.textContent = d.name;
        gsap.from(splitName(), { yPercent: 105 * dir, opacity: 0, duration: .9, ease: 'expo.out', stagger: .03 });
      },
    });
    // the product spins out, the next one drops in
    pProds.forEach((p) => gsap.killTweensOf(p));
    pProds.forEach((p) => { if (p !== old && p !== nu) { p.classList.remove('is-on'); gsap.set(p, { clearProps: 'all' }); } });
    // the old one sinks and fades, the new one rises into the same centred spot (no spinning, no drifting)
    gsap.to(old, { yPercent: 12 * dir, autoAlpha: 0, duration: .4, ease: 'power2.in', onComplete: () => { if (old !== pProds[cur]) { old.classList.remove('is-on'); gsap.set(old, { clearProps: 'all' }); } } });
    nu.classList.add('is-on');
    gsap.fromTo(nu, { yPercent: -10 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', delay: .25, clearProps: 'transform' });
    S.settle(nu, 1600, () => pProds[cur] === nu);
    // the small things
    gsap.to(pCopy, { opacity: 0, y: -10, duration: .25, overwrite: true, onComplete: () => { pCopy.textContent = P[cur].copy; gsap.fromTo(pCopy, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' }); } });
    pFor.dataset.final = d.for; pFor.textContent = d.for; S.scramble(pFor, .6);
    const v = { n: +pVol.textContent };
    gsap.to(v, { n: d.vol, duration: .9, ease: 'power2.out', onUpdate: () => { pVol.textContent = Math.round(v.n); } });
    pTags.innerHTML = d.tags.map((t) => `<li>${t}</li>`).join('');
    gsap.from($$('li', pTags), { rotationX: -90, transformOrigin: '50% 0%', opacity: 0, duration: .8, ease: 'back.out(1.8)', stagger: .08, delay: .2 });
  };

  if (M && wideMQ.matches) {
    pinST = ScrollTrigger.create({
      trigger: poster, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => show(Math.min(P.length - 1, Math.floor(s.progress * P.length * .999))),
    });
      // only the big name drifts with the mouse: the product stays centred
    if (S.fine) {
      const nx = gsap.quickTo(pName, 'x', { duration: 1.2, ease: 'power3.out' });
      $('#posterPin').addEventListener('pointermove', (e) => { const k = e.clientX / innerWidth - .5; nx(k * -60); });
    }
  }
  $('#posterNext').addEventListener('click', () => {
    const n = (cur + 1) % P.length;
    if (pinST) S.scrollTo(pinST.start + (pinST.end - pinST.start) * ((n + .5) / P.length));
    else show(n);
  });
  if (M) S.onReach(poster, 'top 70%', () => {
    gsap.from(pName._chars, { yPercent: 105, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .04 });
    gsap.from('#posterProduct', { yPercent: 12, opacity: 0, duration: 1.4, ease: 'expo.out', delay: .2, clearProps: 'transform,opacity' });
    S.settle($('#posterProduct'), 2000);
    gsap.from('.poster__l > *, .poster__r > *', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06, delay: .4 });
  });

  /* ================= 4 · THE METHOD: halftone, gothic title, rhinestones ================= */
  const pic = $('#methodPic'), title = $('#methodTitle'), rhine = $('#rhine');
  // rhinestones write themselves: a clip opens left to right, then the stones keep twinkling along the line
  const rt = $('text', rhine);
  const clipR = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clipR.id = 'rhineClip';
  clipR.innerHTML = `<rect x="0" y="-40" width="${M ? 0 : 900}" height="260" />`;
  rhine.prepend(clipR);
  rt.setAttribute('clip-path', 'url(#rhineClip)');
  if (M) {
    gsap.set(pic, { '--r': '0px' });
    S.onReach(pic, 'top 75%', () => gsap.to(pic, { '--r': '9px', duration: 2.4, ease: 'power2.inOut' }));
    S.onReach(title, 'top 88%', () => gsap.from(title, { scale: .9, opacity: 0, filter: 'blur(14px)', duration: 1.6, ease: 'expo.out', clearProps: 'filter' }));
    S.onReach(rhine, 'top 88%', () => gsap.to($('rect', clipR), { attr: { width: 900 }, duration: 2.6, ease: 'power2.inOut' }));
    gsap.to(rt, { strokeDashoffset: -21, duration: 1.4, ease: 'none', repeat: -1 });
    S.onReach('.method__cols', 'top 90%', () => gsap.from('.method__cols p', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12 }));
  }

  /* ================= 5 · STOREFRONT: the bands open to full bleed ================= */
  if (M) {
    $$('.band__photo').forEach((b) => {
      gsap.fromTo(b, { clipPath: 'inset(9% 7% 9% 7% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'top 25%', scrub: .6 } });
      gsap.fromTo($('.slot', b), { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.row').forEach((r) => S.onReach(r, 'top 88%', () => gsap.from($$('.item', r), { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08 })));
  }

  // add to bag: a dot flies to the bag
  const THANKS = ['your hair says thank you', 'good choice. your ends agree', 'in the bag ✶', 'added. the fringe approves'];
  $$('.add').forEach((b) => b.addEventListener('click', () => {
    const it = b.closest('.item');
    S.addToBag({ id: it.dataset.id, name: it.dataset.name, price: +it.dataset.price, img: $('.slot', it).dataset.img, meta: $('.item__meta', it).textContent });
    b.classList.add('is-in'); b.textContent = 'added ✓';
    setTimeout(() => { b.classList.remove('is-in'); b.textContent = 'add +'; }, 2000);
    S.toast(`${it.dataset.name} — ${S.pick(THANKS)}`);
    if (!M) return;
    const from = b.getBoundingClientRect(), to = $('#bag').getBoundingClientRect();
    const drop = document.createElement('i');
    drop.className = 'cursor__dot';
    Object.assign(drop.style, { position: 'fixed', left: from.left + from.width / 2 + 'px', top: from.top + 'px', zIndex: 97, margin: 0, width: '18px', height: '18px' });
    document.body.append(drop);
    gsap.to(drop, { x: to.left + to.width / 2 - from.left - from.width / 2, duration: .9, ease: 'power1.inOut' });
    gsap.to(drop, { y: to.top - from.top, duration: .9, ease: 'back.in(2.2)', scale: .5, onComplete: () => drop.remove() });
  }));

  /* ================= FOOTER: the word again ================= */
  const ftW = S.weights($('#ftWord'));
  if (M) S.onReach('#ftLogo', 'top 90%', () => {
    gsap.from(ftW.chars, { yPercent: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .06 });
    gsap.timeline({ delay: .4, onUpdate: ftW.wake }).to(ftW.f, { boost: 1, duration: .5 }).to(ftW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
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
