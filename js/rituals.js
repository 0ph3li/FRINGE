/* =========================================================
   FRINGE — rituals.js
   four acts, step by step, a timer for each, and your week
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const P = Object.fromEntries(window.FRINGE_DATA.products.map((p) => [p.id, p]));

  /* ================= THE FOUR ACTS ================= */
  const R = [
    {
      id: 'scalp', roman: 'i.', name: 'scalp', title: 'start at the <em class="script">roots</em>', img: 'img/HOME/r-scalp.jpg',
      time: '5 min', when: 'every wash',
      intro: 'Everything good starts at the scalp. Clean roots, a little pressure, and the lengths get what runs off.',
      steps: [
        { t: 'brush it out, dry', secs: 45, how: 'Before the water. Ends first, then work up to the roots: it loosens everything the shampoo needs to reach.', p: 'the-comb' },
        { t: 'wash the roots only', secs: 60, how: 'A coin of Clean Slate on wet roots. Not on the lengths: they get what runs off when you rinse.', p: 'clean-slate' },
        { t: 'massage, don\'t scrub', secs: 90, how: 'Small circles with Head Rush, light pressure, eyes closed. Two minutes is a long time, that\'s the point.', p: 'head-rush' },
        { t: 'once a week: oil the night before', secs: 30, how: 'Camellia oil on the scalp before bed, cleanser in the morning. A sunday, but on a wednesday.', p: 'green-room' },
      ],
    },
    {
      id: 'treatment', roman: 'ii.', name: 'deep treatment', title: 'ten minutes, <em class="script">a towel</em>', img: 'img/HOME/r-treatment.jpg',
      time: '15 min', when: 'once a week',
      intro: 'Once a week your hair gets a night in. A mask, a bond serum, and something to sleep on.',
      steps: [
        { t: 'squeeze, don\'t rub', secs: 30, how: 'After shampoo, press the water out with a towel. Rubbing is how the frizz starts.', p: null },
        { t: 'mask, mid-lengths to ends', secs: 120, how: 'A generous handful of Bad Hair Day, combed through with your fingers. Ten minutes under a towel (we\'ll do two).', p: 'bad-hair-day' },
        { t: 'rinse cold, then bonds', secs: 60, how: 'Cold water to close it all, then four drops of Bleach Recovery on towel-dried hair. Do not rinse.', p: 'bleach-recovery' },
        { t: 'sleep on satin', secs: 20, how: 'Hair loose, Beauty Sleep on. It wakes up the way you left it.', p: 'beauty-sleep' },
      ],
    },
    {
      id: 'lengths', roman: 'iii.', name: 'lengths', title: 'two drops, <em class="script">no more</em>', img: 'img/HOME/r-lengths.jpg',
      time: '3 min', when: 'every day',
      intro: 'The ends are the oldest part of your hair. They want very little, very often.',
      steps: [
        { t: 'shield before the heat', secs: 40, how: 'Glass Veil on damp hair, from 20 cm, before any dryer or straightener. The heat finishes the job.', p: 'glass-veil' },
        { t: 'curls: leave a little in', secs: 50, how: 'Curl Harmony through the lengths, then rinse only half of it out. Scrunch, don\'t touch again.', p: 'curl-harmony' },
        { t: 'two drops on the ends', secs: 25, how: 'Gloss Bomb, warmed in the palms, on the last ten centimetres. Two drops. Fine, three.', p: 'gloss-bomb' },
      ],
    },
    {
      id: 'brushing', roman: 'iv.', name: 'brushing', title: 'the last <em class="script">look</em>', img: 'img/HOME/face-oil.jpg',
      time: '2 min', when: 'before you go out',
      intro: 'The part everyone sees. A comb, a little lift at the roots, and something shiny to hold the fringe back.',
      steps: [
        { t: 'small sections', secs: 40, how: 'Sweetheart Comb, dry hair, small sections, mirror. Fringe last, straight down, then flick it.', p: 'sweetheart-comb' },
        { t: 'lift the roots', secs: 30, how: 'Backcomb at the crown from 20 cm, tease with the comb, smooth the top layer over it.', p: 'backcomb' },
        { t: 'pin it back', secs: 15, how: 'Angel Clips above the ear. One each side, or both on one side, we don\'t judge.', p: 'angel-clips' },
      ],
    },
  ];

  /* ================= BUILD THE PAGE ================= */
  const isCut = (src) => src.endsWith('.webp');
  $('#rtIndex').innerHTML = R.map((r) => `
    <li><a href="#ch-${r.id}" data-jump data-cursor="${r.name}">
      <div class="slot${isCut(r.img) ? ' slot--cut' : ''}" data-img="${r.img}" data-label="${r.img.split('/').pop()}"></div>
      <p>${r.roman} ${r.name}<span>${r.time}</span></p>
    </a></li>`).join('');
  $('#rail').innerHTML = R.map((r) => `<a href="#ch-${r.id}" data-jump data-rail="${r.id}"><i></i><span>${r.roman} ${r.name}</span></a>`).join('');

  const chip = (id) => {
    const p = P[id]; if (!p) return '';
    return `<button type="button" class="chip" data-add="${p.id}" data-cursor="add to bag"><img src="${p.img}" alt="" />${p.name}<small>${p.vol}</small><b>€${p.price} +</b></button>`;
  };
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  $('#chapters').innerHTML = R.map((r) => `
    <section class="chap" id="ch-${r.id}" data-ch="${r.id}">
      <div class="chap__pic">
        <div class="slot${isCut(r.img) ? ' slot--cut' : ''}" data-img="${r.img}" data-label="${r.img.split('/').pop()}"></div>
        <p class="chap__roman">${r.roman}</p>
        <p class="chap__meta mono">${r.time} · ${r.when}</p>
      </div>
      <div class="chap__body">
        <p class="chap__k mono"><span>${r.roman} ${r.name}</span><span>${r.steps.length} steps</span><span>${r.time}</span></p>
        <h2 class="chap__title" data-split>${r.title}</h2>
        <p class="chap__intro">${r.intro}</p>
        <button class="btn chap__start" type="button" data-start="${r.id}" data-magnet><span>start the ritual</span><i>▶</i></button>
        <ol class="steps">
          ${r.steps.map((s, k) => `
            <li class="st">
              <span class="st__n">${S.pad(k + 1)}</span>
              <p class="st__t">${s.t}<span>${mmss(s.secs)}</span></p>
              <p class="st__how">${s.how}</p>
              ${s.p ? chip(s.p) : ''}
            </li>`).join('')}
        </ol>
      </div>
    </section>`).join('');
  S.slots();

  /* ================= ADD TO BAG FROM A STEP ================= */
  const add = (p) => S.addToBag({ id: p.id, name: p.name, price: p.price, img: p.img, meta: `${p.kind} · ${p.vol}` });
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-add]'); if (!c) return;
    const p = P[c.dataset.add]; add(p);
    c.classList.add('is-in'); setTimeout(() => c.classList.remove('is-in'), 1500);
    S.toast(`${p.name} — in the bag ✶`);
  });

  /* ================= SCROLL: photos open, steps light up, the rail follows ================= */
  const rail = $('#rail');
  if (S.hasGsap) {
    ScrollTrigger.create({ trigger: '#chapters', start: 'top 60%', end: 'bottom 40%', onToggle: (s) => rail.classList.toggle('is-on', s.isActive) });
    $$('.chap').forEach((ch) => {
      const id = ch.dataset.ch;
      ScrollTrigger.create({ trigger: ch, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => { if (s.isActive) $$('a', rail).forEach((a) => a.classList.toggle('is-here', a.dataset.rail === id)); } });
      $$('.st', ch).forEach((st) => ScrollTrigger.create({ trigger: st, start: 'top 70%', end: 'bottom 35%', toggleClass: 'is-on' }));
      if (!M) return;
      const pic = $('.chap__pic', ch), slot = $('.slot', pic);
      S.onReach(ch, 'top 80%', () => {
        gsap.fromTo(pic, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
        gsap.from($('.chap__roman', ch), { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', delay: .6 });
      });
      gsap.fromTo(slot, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  } else $$('.st').forEach((st) => st.classList.add('is-on'));

  /* ================= THE TIMER ================= */
  const tm = $('#timer'), ring = $('#tmRing'), clock = $('#tmClock'), stepEl = $('#tmStep'), how = $('#tmHow'), img = $('#tmImg'), dots = $('#tmDots');
  let cur = null, k = 0, left = 0, total = 0, last = 0, playing = false, raf = 0;
  const tick = (now) => {
    raf = 0;
    if (!playing) return;
    left = Math.max(0, left - (now - last) / 1000); last = now;
    clock.textContent = mmss(Math.ceil(left));
    ring.style.strokeDashoffset = String(left / total);
    if (left <= 0) { nextStep(); return; }
    raf = requestAnimationFrame(tick);
  };
  const play = (on) => {
    playing = on;
    $('#tmPlay').innerHTML = on ? '<span>pause</span><i>❙❙</i>' : '<span>play</span><i>▶</i>';
    if (on) { last = performance.now(); if (!raf) raf = requestAnimationFrame(tick); }
  };
  const showStep = () => {
    const s = cur.steps[k], p = s.p ? P[s.p] : null;
    total = left = s.secs;
    $('#tmCount').textContent = `step ${k + 1} of ${cur.steps.length}${p ? ` · ${p.name}` : ''}`;
    stepEl.textContent = s.t; delete stepEl._words;
    how.textContent = s.how;
    img.src = p ? p.img : 'img/HOME/swatch.jpg';
    img.style.borderRadius = p ? '0' : '50%';
    clock.textContent = mmss(left);
    ring.style.strokeDashoffset = '1';
    dots.innerHTML = cur.steps.map((_, j) => `<li class="${j < k ? 'is-done' : j === k ? 'is-now' : ''}"></li>`).join('');
    $('#tmNext span').textContent = k < cur.steps.length - 1 ? 'next step' : 'finish';
    if (M) {
      gsap.fromTo(S.words(stepEl), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .05 });
      gsap.fromTo(img, { scale: .5, rotation: -20, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'back.out(1.6)' });
      gsap.fromTo(how, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', delay: .2 });
    }
    play(true);
  };
  const nextStep = () => {
    if (k < cur.steps.length - 1) { k++; showStep(); } else done();
  };
  const done = () => {
    play(false);
    tm.classList.add('is-finished');
    const d = $('#tmDone'); d.hidden = false;
    const w = $('#tmDoneWord'); delete w._chars;
    const ch = S.chars(w);
    if (M) {
      gsap.from(ch, { yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06 });
      gsap.to(ch, { fontWeight: 900, duration: .4, ease: 'sine.inOut', stagger: { each: .07, yoyo: true, repeat: 1 }, delay: .6 });
      gsap.from('.timer__donetxt, .timer__done .timer__ctrl', { y: 30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .1, delay: .5 });
    }
  };
  const open = (id) => {
    cur = R.find((r) => r.id === id); k = 0;
    tm.classList.remove('is-finished'); $('#tmDone').hidden = true;
    $('#tmAct').textContent = `${cur.roman} ${cur.name} · ${cur.time}`;
    tm.classList.add('is-open'); tm.setAttribute('aria-hidden', 'false');
    S.lenis?.stop();
    showStep();
  };
  const close = () => {
    play(false);
    tm.classList.remove('is-open'); tm.setAttribute('aria-hidden', 'true');
    S.lenis?.start();
  };
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-start]'); if (b) open(b.dataset.start); });
  $('#tmPlay').addEventListener('click', () => play(!playing));
  $('#tmNext').addEventListener('click', nextStep);
  $('#tmClose').addEventListener('click', close);
  $('#tmBack').addEventListener('click', close);
  $('#tmBuy').addEventListener('click', () => {
    const ps = cur.steps.filter((s) => s.p).map((s) => P[s.p]);
    ps.forEach(add);
    S.toast(`${cur.name}: ${ps.length} things in the bag ✶`);
    close(); setTimeout(() => S.openBag(true), 800);
  });
  addEventListener('keydown', (e) => {
    if (!tm.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === ' ') { e.preventDefault(); play(!playing); }
    if (e.key === 'ArrowRight') nextStep();
  });

  /* ================= THE WEEK ================= */
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  let week; try { week = JSON.parse(S.store.get('week') || 'null'); } catch (e) {}
  if (!Array.isArray(week) || week.length !== 7) week = [null, 'scalp', null, 'lengths', 'brushing', null, 'treatment'];
  const today = (new Date().getDay() + 6) % 7;
  const grid = $('#weekGrid');
  const minutes = (id) => parseInt((R.find((r) => r.id === id) || {}).time, 10) || 0;
  const renderWeek = () => {
    grid.innerHTML = DAYS.map((d, j) => {
      const r = R.find((x) => x.id === week[j]);
      return `<button type="button" class="day${r ? ' is-set' : ''}${j === today ? ' is-today' : ''}" data-day="${j}">
        <span class="day__bg">${r ? `<img src="${r.img}" alt="" />` : ''}</span>
        <span class="day__d">${d}</span>
        <span class="day__r">${r ? `${r.roman}<br />${r.name}` : 'rest'}</span>
        <span class="day__t">${r ? `${r.time} · ${r.when}` : 'let it be'}</span>
      </button>`;
    }).join('');
    const set = week.filter(Boolean);
    $('#weekSum').textContent = set.length
      ? `this week: ${set.length} ritual${set.length > 1 ? 's' : ''} · ${set.reduce((t, id) => t + minutes(id), 0)} minutes · ${7 - set.length} days of letting it be`
      : 'a whole week off. your hair is thrilled.';
  };
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.day'); if (!b) return;
    const j = +b.dataset.day, order = [null, ...R.map((r) => r.id)];
    week[j] = order[(order.indexOf(week[j]) + 1) % order.length];
    S.store.set('week', JSON.stringify(week));
    renderWeek();
    const nb = $(`.day[data-day="${j}"]`, grid);
    if (M) gsap.fromTo(nb, { rotationY: -90 }, { rotationY: 0, duration: .7, ease: 'back.out(1.7)', transformPerspective: 600 });
  });
  renderWeek();
  if (M) S.onReach(grid, 'top 85%', () => gsap.from('.day', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06 }));

  /* ================= ENTRANCE ================= */
  const rtW = S.weights($('#rtWord'), { base: 150, max: 860 });
  const ftW = S.weights($('#ftWord'));
  S.reveal.then(() => {
    if (M) {
      gsap.from(rtW.chars, { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .06 });
      gsap.timeline({ delay: .5, onUpdate: rtW.wake }).to(rtW.f, { boost: .9, duration: .5 }).to(rtW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.from('.rt-hero__k, .rt-hero__lead', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .3 });
      gsap.from('.rt-index li', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, delay: .5 });
      const thin = { v: 0 };
      gsap.to(thin, { v: 1, ease: 'none', scrollTrigger: { trigger: '#rtHero', start: 'top top', end: 'bottom top', scrub: true }, onUpdate: () => rtW.setBase(150 - thin.v * 50) });
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
