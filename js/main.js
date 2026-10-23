/* =========================================================
   FRINGE — main.js (shared engine, every page)
   haircare for the ones on the fringe
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = (window.FRINGE = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  S.$ = $; S.$$ = $$;
  S.page = document.body.dataset.page || 'home';
  S.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  S.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  S.motion = S.hasGsap && !S.reduced;
  document.documentElement.classList.toggle('motion', S.motion);
  S.rand = (a, b) => a + Math.random() * (b - a);
  S.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  S.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  S.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';


  // storage that never throws
  S.store = {
    get(k) { try { return localStorage.getItem('fringe-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('fringe-' + k, v); } catch (e) {} },
  };

  if (S.hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- onReach: run something once when a section is reached ----------
     fires even if you fly past it or land below it, so nothing stays hidden */
  S.onReach = (trigger, start, fn) => {
    if (!S.hasGsap) { fn(); return; }
    let done = false, st;
    const go = () => { if (!done) { done = true; fn(); requestAnimationFrame(() => st?.kill()); } };
    st = ScrollTrigger.create({ trigger, start, end: 'max', onEnter: go, onRefresh: (self) => { if (self.progress > 0) go(); }, onUpdate: (self) => { if (self.progress > 0) go(); } });
    return st;
  };

  /* ---------- grain: generated once, no image file ---------- */
  (() => {
    const g = $('.grain'); if (!g) return;
    const c = document.createElement('canvas'); c.width = c.height = 220;
    const x = c.getContext('2d'), d = x.createImageData(220, 220);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 38; }
    x.putImageData(d, 0, 0);
    g.style.backgroundImage = `url(${c.toDataURL()})`;
  })();

  /* ---------- smooth scroll + velocity ---------- */
  S.vel = 0;
  if (window.Lenis && !S.reduced) {
    S.lenis = new Lenis({ lerp: .09, smoothWheel: true });
    S.lenis.on('scroll', (l) => { S.vel = l.velocity || 0; });
    if (S.hasGsap) {
      S.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => S.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { S.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    S.lenis.stop();
  }
  S.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (S.lenis) S.lenis.scrollTo(el ?? 0, { duration: 1.8 });
    else (el || document.body).scrollIntoView({ behavior: 'smooth' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-jump]'); if (!a) return;
    const id = a.getAttribute('href'); if (!id?.startsWith('#')) return;
    e.preventDefault(); S.scrollTo(id === '#top' ? 0 : id);
  });

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  S.toast = (msg, ms = 3200) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('is-on'); void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
  const SOON = ['this page is still at the hairdresser ✂', 'still under the dryer. back soon ♥', 'that page is waiting for its toner ✶', 'not ready — the colour needs 20 more minutes'];
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-soon]'); if (!a) return;
    e.preventDefault(); S.toast(S.pick(SOON));
  });

  /* ---------- progress + header ---------- */
  const bar = $('#progress'), hdr = $('#hdr');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (hdr) {
      hdr.classList.toggle('is-solid', y > 40);
      hdr.classList.toggle('is-hidden', y > lastY && y > innerHeight * .6);
    }
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- image slots: drop a file at data-img and it shows up ----------
     tries the exact name first, then the same name as .png / .webp / .jpg */
  S.slot = (slot) => {
    if (slot.dataset.ratio) slot.style.setProperty('--ratio', slot.dataset.ratio.replace('/', ' / '));
    if (slot.dataset.label && !$('.slot-label', slot)) {
      const [file, ...rest] = slot.dataset.label.split(' · ');
      const lab = document.createElement('span');
      lab.className = 'slot-label';
      lab.innerHTML = `${file}<small>${rest.join(' · ')}</small>`;
      slot.append(lab);
    }
    const src = slot.dataset.img; if (!src || slot.dataset.loaded === src) return;
    slot.dataset.loaded = src;
    const base = src.replace(/\.[a-z]+$/i, '');
    const tries = [src, ...['.png', '.webp', '.jpg', '.jpeg'].map((x) => base + x).filter((x) => x !== src)];
    const img = new Image();
    img.decoding = 'async'; img.draggable = false; img.alt = slot.dataset.alt || '';
    if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
    let n = 0;
    img.onload = () => {
      if (slot.dataset.loaded !== src) return;
      slot.classList.remove('is-empty');
      $(':scope > img', slot)?.remove();
      slot.prepend(img);
      slot.classList.add('has-img');
    };
    img.onerror = () => { if (++n < tries.length) img.src = tries[n]; else slot.classList.add('is-empty'); };
    slot.classList.add('is-empty');
    img.src = tries[0];
  };
  S.slots = (root = document) => $$('.slot', root).forEach(S.slot);
  S.slots();
  S.missing = () => console.table($$('.slot:not(.has-img)').map((s) => ({ put_your_photo_here: s.dataset.img })));

  /* ---------- text: words in masks, letters, scramble ---------- */
  S.words = (el) => {
    if (el._words) return el._words;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            const i = document.createElement('span'); i.className = 'wi'; i.textContent = word;
            w.append(i); frag.append(w); out.push(i);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return (el._words = out);
  };
  S.chars = (el) => {
    if (el._chars) return el._chars;
    const txt = el.textContent;
    el.setAttribute('aria-label', txt);
    el.innerHTML = [...txt].map((c) => `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    return (el._chars = $$('.ch', el));
  };
  const GLYPHS = '✶♥✂~/\\|abcdefghijklmnopqrstuvwxyz0123456789';
  S.scramble = (el, dur = .8) => {
    if (!S.motion) return;
    const final = el.dataset.final || (el.dataset.final = el.textContent);
    const o = { p: 0 };
    gsap.killTweensOf(o);
    gsap.to(o, {
      p: 1, duration: dur, ease: 'none',
      onUpdate: () => {
        const k = Math.floor(o.p * final.length);
        el.textContent = final.slice(0, k) + [...final.slice(k)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      },
      onComplete: () => { el.textContent = final; },
    });
  };
  S.reveals = () => {
    $$('[data-split]').forEach((el) => {
      const w = S.words(el);
      if (S.motion) S.onReach(el, 'top 92%', () => gsap.from(w, { yPercent: 115, rotate: 4, duration: 1.15, ease: 'expo.out', stagger: .06 }));
    });
    $$('[data-scr]').forEach((el) => S.onReach(el, 'top 95%', () => S.scramble(el)));
  };
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest('[data-scr-hover]');
    if (el && !el.contains(e.relatedTarget)) S.scramble(el, .45);
  });

  /* ---------- cursor: a pink dot with a label ---------- */
  if (S.fine) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('#cursor'), lab = $('#cursorLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    const loop = () => {
      cx += (mx - cx) * .28; cy += (my - cy) * .28;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { lab.textContent = t.dataset.cursor; cur.classList.add('is-label'); }
      else cur.classList.remove('is-label');
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (S.motion && S.fine) {
    $$('[data-magnet]').forEach((b) => {
      const qx = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1, .5)' });
      const qy = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1, .5)' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .3); qy((e.clientY - r.top - r.height / 2) * .4);
      });
      b.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  /* ---------- the bag: a drawer that slides in from the right, on every page ---------- */
  S.bag = (() => { try { return JSON.parse(S.store.get('bag') || '[]'); } catch (e) { return []; } })();
  const bagBtn = $('#bag'), bagN = $('#bagN');
  const drawer = document.createElement('aside');
  drawer.className = 'drawer'; drawer.id = 'drawer'; drawer.setAttribute('aria-label', 'your bag'); drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="drawer__veil" data-close></div>
    <div class="drawer__panel">
      <header class="drawer__head"><p class="drawer__t">your bag <b id="drawerN">0</b></p><button class="drawer__x" type="button" data-close aria-label="close">close ✕</button></header>
      <ul class="drawer__list" id="drawerList"></ul>
      <p class="drawer__empty" id="drawerEmpty">your bag is empty.<br /><span class="script">your hair is not.</span></p>
      <footer class="drawer__foot">
        <p class="drawer__ship mono" id="drawerShip"></p>
        <p class="drawer__total"><span>total</span><b id="drawerTotal">€0</b></p>
        <button class="btn drawer__go" type="button" id="drawerGo"><span>checkout</span><i>→</i></button>
      </footer>
    </div>`;
  document.body.append(drawer);
  const save = () => S.store.set('bag', JSON.stringify(S.bag));
  const grouped = () => {
    const m = new Map();
    S.bag.forEach((it) => { const g = m.get(it.id) || { ...it, qty: 0 }; g.qty++; m.set(it.id, g); });
    return [...m.values()];
  };
  S.renderBag = () => {
    const n = S.bag.length, total = S.bag.reduce((a, b) => a + (+b.price || 0), 0);
    if (bagN) bagN.textContent = n;
    $('#drawerN').textContent = n;
    $('#drawerTotal').textContent = `€${total}`;
    $('#drawerShip').textContent = total >= 60 ? 'free shipping ✶ you made it' : `€${60 - total} away from free shipping`;
    drawer.classList.toggle('is-empty', !n);
    $('#drawerList').innerHTML = grouped().map((g) => `
      <li class="drawer__it" data-id="${g.id}">
        <span class="drawer__img">${g.img ? `<img src="${g.img}" alt="" />` : ''}</span>
        <span class="drawer__name">${g.name}<small class="mono">${g.meta || ''}</small></span>
        <span class="drawer__qty"><button type="button" data-q="-1" aria-label="one less">−</button><b>${g.qty}</b><button type="button" data-q="1" aria-label="one more">+</button></span>
        <span class="drawer__price">€${g.price * g.qty}</span>
      </li>`).join('');
  };
  S.addToBag = (item) => {
    S.bag.push(item); save(); S.renderBag();
    if (bagBtn) { bagBtn.classList.remove('is-bump'); void bagBtn.offsetWidth; bagBtn.classList.add('is-bump'); }
  };
  S.openBag = (open = true) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (S.lenis) open ? S.lenis.stop() : S.lenis.start();
    if (open && S.motion) gsap.from('.drawer__it', { x: 60, opacity: 0, duration: .7, ease: 'expo.out', stagger: .05, delay: .15 });
  };
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) return S.openBag(false);
    const q = e.target.closest('[data-q]');
    if (q) {
      const id = q.closest('[data-id]').dataset.id;
      if (+q.dataset.q > 0) { S.bag.push({ ...S.bag.find((b) => b.id === id) }); }
      else { const i = S.bag.findIndex((b) => b.id === id); if (i > -1) S.bag.splice(i, 1); }
      save(); S.renderBag();
    }
  });
  $('#drawerGo').addEventListener('click', () => S.toast(S.bag.length ? 'checkout is still under the dryer. 5 more minutes ♥' : 'add something first ✶'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) S.openBag(false); });
  bagBtn?.addEventListener('click', () => S.openBag(true));
  S.renderBag();

  /* ---------- milano clock ---------- */
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const tick = () => {
      let t; try { t = new Date().toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' }); } catch (e) { t = new Date().toTimeString().slice(0, 5); }
      clocks.forEach((c) => (c.textContent = t));
    };
    tick(); setInterval(tick, 10000);
  }

  /* ---------- the big word: every letter gets bolder as the mouse comes close ----------
     (Hanken Grotesk is variable, 100 → 900). press and every letter goes heavy for a second */
  S.weights = (el, { base = 200, max = 820, reach = .28 } = {}) => {
    const chars = S.chars(el);
    const st = chars.map(() => ({ w: base, t: base }));
    const set = () => chars.forEach((c, i) => { c.style.fontWeight = Math.round(st[i].w); });
    const f = { base, boost: 0 };
    let mx = -1e4, my = -1e4, on = false, raf = 0;
    const tick = () => {
      raf = 0;
      let moving = false;
      const R = innerWidth * reach;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const near = on ? Math.max(0, 1 - d / R) : 0;
        st[i].t = f.base + (max - f.base) * Math.max(near * near * (3 - 2 * near), f.boost);
        st[i].w += (st[i].t - st[i].w) * .14;
        if (Math.abs(st[i].t - st[i].w) > .5) moving = true;
      });
      set();
      if (moving || on) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (S.motion) {
      const zone = el.parentElement;
      zone.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; on = true; wake(); });
      zone.addEventListener('pointerleave', () => { on = false; wake(); });
      zone.addEventListener('pointerdown', () => gsap.timeline({ onUpdate: wake }).to(f, { boost: 1, duration: .18, ease: 'power2.out' }).to(f, { boost: 0, duration: 1.2, ease: 'elastic.out(1, .4)' }));
    }
    set();
    return { chars, f, wake, setBase(v) { f.base = v; wake(); } };
  };

  /* ---------- loader: the word breathes from thin to bold ----------
     S.reveal resolves as the loader starts lifting (start intros here), S.ready when it's gone */
  let revealNow;
  S.reveal = new Promise((r) => { revealNow = r; });
  S.ready = new Promise((resolve) => {
    const L = $('#loader');
    const done = () => {
      revealNow();
      document.body.classList.remove('is-loading');
      S.lenis?.start();
      scrollTo(0, 0);
      resolve();
      if (S.hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    if (!L || !S.motion || document.hidden) { done(); return; }
    const chars = S.chars($('#ldWord'));
    const num = $('#ldNum'), msg = $('#ldMsg');
    const MSG = ['washing', 'conditioning', 'blow-drying', 'almost there'];
    const k = { v: 0 };
    const tl = gsap.timeline({ onComplete: done });
    if (L.classList.contains('loader--quick')) tl.timeScale(1.8); // inner pages: same loader, faster
    // a wave of weight runs through the letters, thin → bold → thin, faster each time
    tl.from(chars, { yPercent: 100, opacity: 0, duration: .9, ease: 'expo.out', stagger: .05 }, 0)
      .to(chars, { fontWeight: 900, duration: .45, ease: 'sine.inOut', stagger: { each: .08, yoyo: true, repeat: 3 } }, .3)
      .to(k, { v: 100, duration: 2.4, ease: 'power1.inOut', onUpdate: () => { num.textContent = S.pad(k.v); msg.textContent = MSG[Math.min(MSG.length - 1, Math.floor(k.v / 26))]; } }, .1)
      .to(chars, { fontWeight: 100, letterSpacing: '.1em', duration: .6, ease: 'power3.inOut' }, 2.5)
      .to([num, msg, '.ld-top'], { opacity: 0, duration: .3 }, 2.8)
      .to(L, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 2.9)
      .add(() => revealNow(), 3.1);
    L.addEventListener('click', () => tl.progress(1));
    // safety net: if the browser stalls the timeline (background tab, low power mode…) the page never stays behind the loader
    setTimeout(() => { if (document.body.classList.contains('is-loading')) tl.progress(1); }, 6000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && document.body.classList.contains('is-loading') && tl.time() > 0) tl.progress(1); });
  });

  /* ---------- S.settle: entrance tweens can't leave things invisible ----------
     timers still fire when a browser stalls animation frames, so after the tween should be over we snap to the end state */
  S.settle = (targets, ms = 1600, still = () => true) => {
    if (!S.hasGsap) return;
    setTimeout(() => {
      if (!still()) return; // the screen moved on (e.g. the next question is already leaving): leave it alone
      const els = typeof targets === 'string' ? $$(targets) : [].concat(targets || []).flatMap((t) => (t && t.length != null && !t.nodeType ? [...t] : [t]));
      els.forEach((el) => { if (!el || !el.isConnected) return; gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform,opacity,visibility' }); });
    }, ms);
  };

  /* ---------- safety net for intros ----------
     3 seconds after the page is revealed, anything in the first screen still hidden by an intro tween is shown */
  S.reveal.then(() => setTimeout(() => {
    if (!S.hasGsap) return;
    $$('main .ch, main .wi, main h1, main h2, main p, main .btn').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0 || el.closest('[hidden], .qv, .timer, .drawer')) return;
      if (+getComputedStyle(el).opacity < .05) gsap.set(el, { clearProps: 'transform,opacity,visibility' });
    });
  }, 3000));

  /* ---------- easter eggs ---------- */
  let typed = '', pinked = false;
  S.pink = (on = !pinked) => { pinked = on; document.documentElement.classList.toggle('is-pink', on); };
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);
    if (typed.endsWith('pink')) { S.pink(); S.toast(pinked ? 'pink. living my brat life ♥' : 'back to black.'); }
    if (typed.endsWith('swag')) { S.toast('S W A G — written on your fringe in eyeliner ✶', 3600); window.dispatchEvent(new CustomEvent('fringe:swag')); }
  });

  /* ---------- console ---------- */
  const SIG = `
   *    /\\_/\\      +
       ( o.o )   <3  ghostly.grl
   +    > ^ <          *
`;
  console.log(`%c${SIG}`, 'color:#ff4fa3;font-family:monospace');
  console.log('%cFRINGE — haircare for the ones on the fringe. type help() ✂', 'color:#4b2b1d;font-family:monospace');
  window.help = () => {
    console.log([
      'fringe.missing()  — the photos still waiting in img/',
      'fringe.bag        — what you put in the bag',
      'fringe.empty()    — empty the bag',
      'fringe.pink()     — pink logo on / off',
      'secret words (just type them on the page): pink · swag',
    ].join('\n'));
    return '♥';
  };
  window.fringe = {
    missing: S.missing,
    get bag() { return S.bag; },
    empty() { S.bag.length = 0; S.store.set('bag', '[]'); S.renderBag(); return 'bag emptied'; },
    open() { S.openBag(true); return 'bag open'; },
    pink() { S.pink(); return 'pink'; },
  };
})();
