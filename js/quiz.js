/* =========================================================
   FRINGE — quiz.js (the hair quiz)
   six questions, one routine from the shelf
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.FRINGE;
  const { $, $$ } = S;
  const M = S.motion;
  const D = window.FRINGE_DATA;
  const P = Object.fromEntries(D.products.map((p) => [p.id, p]));

  /* ================= THE QUESTIONS ================= */
  const Q = [
    {
      id: 'type', ask: 'what is your hair like today?', hint: 'today. not in the photo from 2019.',
      opts: [
        { v: 'straight', t: 'straight', s: 'falls flat on its own', img: 'img/HOME/face-oil.jpg' },
        { v: 'curly', t: 'wavy or curly', s: 'has opinions', img: 'img/HOME/r-treatment.jpg' },
        { v: 'coily', t: 'coily, braided', s: 'protective mode', img: 'img/HOME/face-mask.jpg' },
        { v: 'changes', t: 'it changes', s: 'every month, every colour', img: 'img/HOME/method.jpg' },
      ],
    },
    {
      id: 'history', ask: 'what has it been through?', hint: 'the last three months. be honest, we are.',
      opts: [
        { v: 'bleach', t: 'bleach', s: 'platinum, highlights, the lot' },
        { v: 'dye', t: 'box dye', s: 'bathroom, 11pm' },
        { v: 'heat', t: 'heat, daily', s: 'straightener at 230°' },
        { v: 'nothing', t: 'nothing, honestly', s: 'virgin hair, who knew' },
      ],
    },
    {
      id: 'feel', ask: 'how does it feel?', hint: 'run your fingers through it. go on.',
      opts: [
        { v: 'dry', t: 'dry', s: 'like straw at the ends' },
        { v: 'flat', t: 'flat, fine', s: 'no volume after noon' },
        { v: 'frizz', t: 'frizzy', s: 'one cloud, it\'s over' },
        { v: 'oily', t: 'oily roots', s: 'day two is a lie' },
      ],
    },
    {
      id: 'wash', ask: 'how often do you wash it?', hint: 'there are no wrong answers. there are a few.',
      opts: [
        { v: 'daily', t: 'every day', s: 'can\'t not' },
        { v: 'few', t: 'every 2–3 days', s: 'the sweet spot' },
        { v: 'weekly', t: 'once a week', s: 'wash day is an event' },
        { v: 'whenever', t: 'when I remember', s: 'dry shampoo era' },
      ],
    },
    {
      id: 'time', ask: 'how long will you really spend on it?', hint: 'the routine you\'ll do, not the one you\'ll save.',
      opts: [
        { v: 'quick', t: '2 minutes', s: 'in, out, gone' },
        { v: 'mid', t: '10 minutes', s: 'a mask while the kettle boils' },
        { v: 'sunday', t: 'a whole sunday', s: 'candles, towel turban' },
        { v: 'travel', t: 'I\'m always travelling', s: 'carry-on only' },
      ],
    },
    {
      id: 'word', ask: 'one word for your hair?', hint: 'the last one. this goes on your card.',
      opts: [
        { v: 'messy', t: 'messy', s: 'on purpose' },
        { v: 'glossy', t: 'glossy', s: 'like a 2003 video' },
        { v: 'loud', t: 'loud', s: 'enters the room first' },
        { v: 'soft', t: 'soft', s: 'cloud-adjacent' },
      ],
    },
  ];

  const LABEL = {
    straight: 'straight', curly: 'wavy / curly', coily: 'coily, braided', changes: 'it changes',
    bleach: 'bleached', dye: 'box dye', heat: 'heat, daily', nothing: 'nothing',
    dry: 'dry', flat: 'flat & fine', frizz: 'frizzy', oily: 'oily roots',
    daily: 'every day', few: 'every 2–3 days', weekly: 'once a week', whenever: 'when it remembers',
    quick: '2 minutes', mid: '10 minutes', sunday: 'a whole sunday', travel: 'carry-on',
  };

  /* ================= THE ROUTINE: answers → products ================= */
  const routine = (a) => {
    const curly = a.type === 'curly' || a.type === 'coily';
    const bleached = a.history === 'bleach';
    const steps = [];
    const add = (step, id, why) => { if (P[id] && !steps.some((s) => s.p.id === id)) steps.push({ step, p: P[id], why }); };

    // wash
    if (a.time === 'travel' && a.type === 'straight') add('wash', 'travel-set', 'everything for straight hair, in carry-on sizes. one less thing at security.');
    else if (bleached) add('wash', 'blonde-duo', 'purple to take the brass out, keratin to put the strength back.');
    else if (curly) add('wash', 'curl-theory', 'cleans without undoing the curl.');
    else add('wash', 'clean-slate', a.feel === 'oily' ? 'low-foam, so the roots get clean and the lengths don\'t dry out.' : 'a wash that forgets last night without stripping it.');

    // treat
    if (a.time !== 'quick') {
      if (bleached || a.history === 'dye') add('treat', 'bleach-recovery', 'rebuilds what the colour broke. four drops, no rinse.');
      else if (a.feel === 'flat') add('treat', 'strength-repair', 'strength without weight, for hair that snaps.');
      else if (curly) add('treat', 'curl-harmony', 'slip for the detangle, weight for the definition.');
      else add('treat', 'bad-hair-day', 'ten minutes under a towel and the frizz leaves.');
    }

    // finish
    if (a.feel === 'frizz' || a.history === 'heat') add('finish', 'glass-veil', 'a humidity shield you can\'t feel. the straightener finishes the job.');
    else if (a.feel === 'flat') add('finish', 'backcomb', 'volume like a Nokia ad, gone by morning.');
    else add('finish', 'gloss-bomb', a.word === 'glossy' ? 'you said glossy. two drops on the ends.' : 'two drops on the ends, nothing more.');

    // extra
    if (a.time === 'sunday') add('extra', 'green-room', 'a whole sunday for your scalp.');
    else if (a.feel === 'oily' || a.wash === 'daily') add('extra', 'head-rush', 'two minutes of scalp massage spread the shampoo where it counts.');
    else if (curly) add('extra', 'beauty-sleep', 'satin, so your hair wakes up the way you left it.');
    else if (a.type === 'changes' || a.word === 'loud') add('extra', 'angel-clips', 'for the days it wants to be looked at.');
    else add('extra', 'sweetheart-comb', 'for the fringe, in the bathroom of a club.');
    return steps;
  };

  /* ================= THE FLOW ================= */
  const start = $('#qzStart'), qBox = $('#qzQ'), read = $('#qzRead'), res = $('#qzRes');
  const ask = $('#qzAsk'), hint = $('#qzHint'), opts = $('#qzOpts'), bar = $('#qzBar'), num = $('#qzN');
  bar.innerHTML = Q.map(() => '<i></i>').join('');
  let i = 0, busy = false;
  const ans = {};

  const startW = S.weights($('#qzWord'), { base: 150, max: 860 });
  const ftW = S.weights($('#ftWord'));

  const show = (el) => [start, qBox, read, res].forEach((x) => { x.hidden = x !== el; });

  const render = (dir = 1) => {
    const q = Q[i];
    num.textContent = S.pad(i + 1);
    $$('i', bar).forEach((b, k) => { b.classList.toggle('is-done', k < i); b.classList.toggle('is-now', k === i); });
    ask.textContent = q.ask; delete ask._words; delete ask._chars;
    hint.textContent = q.hint;
    opts.innerHTML = q.opts.map((o, k) => o.img
      ? `<button type="button" class="opt opt--pic${ans[q.id] === o.v ? ' is-picked' : ''}" data-v="${o.v}" data-cursor="${o.t}">
           <span class="slot" data-img="${o.img}" data-label="${o.img.split('/').pop()}"></span>
           <span class="opt__cap"><span class="opt__t">${o.t}</span><span class="opt__k">${k + 1}</span></span>
           <span class="opt__s">${o.s}</span>
         </button>`
      : `<button type="button" class="opt${ans[q.id] === o.v ? ' is-picked' : ''}" data-v="${o.v}">
           <span class="opt__k">${String.fromCharCode(65 + k)} · ${k + 1}</span>
           <span><span class="opt__t">${o.t}</span><br /><span class="opt__s">${o.s}</span></span>
         </button>`).join('');
    S.slots(opts);
    $('#qzBack').style.visibility = i ? 'visible' : 'hidden';
    if (!M) return;
    const w = S.words(ask);
    gsap.fromTo(w, { yPercent: 110 * dir, rotate: 3 * dir }, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: .05 });
    gsap.fromTo('.opt', { y: 70 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .06, delay: .15 });
    gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: .6, delay: .4 });
    const at = i;
    S.settle([w, $$('.opt', opts), hint], 1700, () => at === i && !busy && !qBox.hidden);
  };

  // the old question leaves before the new one comes in
  const leave = (dir, then) => {
    if (!M) { then(); return; }
    busy = true;
    const tl = gsap.timeline({ onComplete: () => { busy = false; then(); } });
    tl.to(ask._words || ask, { yPercent: -110 * dir, duration: .4, ease: 'power3.in', stagger: .02 }, 0)
      .to('.opt', { y: -40 * dir, opacity: 0, duration: .35, ease: 'power2.in', stagger: .03 }, 0)
      .to(hint, { opacity: 0, duration: .2 }, 0);
  };

  const pick = (v) => {
    if (busy) return;
    const q = Q[i];
    ans[q.id] = v;
    $$('.opt', opts).forEach((o) => o.classList.toggle('is-picked', o.dataset.v === v));
    const go = () => {
      if (i < Q.length - 1) { i++; leave(1, () => render(1)); }
      else leave(1, finish);
    };
    if (M) { busy = true; gsap.to('.opt.is-picked', { scale: .97, duration: .12, yoyo: true, repeat: 1, onComplete: () => { busy = false; go(); } }); }
    else go();
  };
  opts.addEventListener('click', (e) => { const o = e.target.closest('.opt'); if (o) pick(o.dataset.v); });
  $('#qzBack').addEventListener('click', () => { if (i > 0 && !busy) { i--; leave(-1, () => render(-1)); } });
  addEventListener('keydown', (e) => {
    if (qBox.hidden || e.target.closest('input')) return;
    const k = +e.key;
    if (k >= 1 && k <= 4) pick(Q[i].opts[k - 1].v);
    if (e.key === 'Backspace' || e.key === 'ArrowLeft') $('#qzBack').click();
  });

  $('#qzGo').addEventListener('click', () => {
    i = 0;
    const go = () => { show(qBox); gsap?.set?.(qBox, { clearProps: 'all' }); render(1); S.scrollTo(0); };
    if (!M) return go();
    gsap.to(startW.chars, { yPercent: -110, opacity: 0, duration: .5, ease: 'power3.in', stagger: .015 });
    gsap.to('.qz__startrow, .qz__k', { opacity: 0, y: -20, duration: .4, onComplete: go });
  });

  /* ================= THE RESULT ================= */
  const finish = () => {
    S.store.set('quiz', JSON.stringify(ans));
    if (!M) return result();
    show(read);
    const rw = $('#qzReadWord'); delete rw._chars;
    const ch = S.chars(rw);
    gsap.timeline({ onComplete: result })
      .from(ch, { yPercent: 100, opacity: 0, duration: .6, ease: 'expo.out', stagger: .02 })
      .to(ch, { fontWeight: 900, duration: .3, ease: 'sine.inOut', stagger: { each: .04, yoyo: true, repeat: 1 } }, .3)
      .to(ch, { yPercent: -100, opacity: 0, duration: .4, ease: 'power3.in', stagger: .01 }, '+=.1');
  };

  const result = () => {
    const steps = routine(ans);
    show(res);
    $('#resWord').textContent = ans.word || 'yours';
    $('#resDate').textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
    $('#resDl').innerHTML = [['hair', LABEL[ans.type]], ['been through', LABEL[ans.history]], ['feels', LABEL[ans.feel]], ['washed', LABEL[ans.wash]], ['time', LABEL[ans.time]]]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v || '—'}</dd></div>`).join('');
    $('#resNote').textContent = ans.history === 'bleach' ? 'Be gentle for six weeks after every bleach. Your hair will thank you in gloss.' : ans.time === 'quick' ? 'Two steps, two minutes. The rest is attitude.' : 'Four steps, in this order. Skip one on lazy days, never the last one.';
    $('#resSteps').innerHTML = steps.map((s, k) => `
      <li class="step">
        <span class="step__n"><b>${S.pad(k + 1)}</b>${s.step}</span>
        <span class="step__img"><img src="${s.p.img}" alt="${s.p.name}" /></span>
        <div><p class="step__name"><a href="product.html?id=${s.p.id}">${s.p.name}</a></p><p class="step__kind mono">${s.p.kind} · ${s.p.vol}</p><p class="step__why">${s.why}</p></div>
        <span class="step__price">€${s.p.price}</span>
      </li>`).join('');
    const total = steps.reduce((t, s) => t + s.p.price, 0);
    $('#resTotal').textContent = `€${total}`;
    res._steps = steps;
    S.scrollTo(0);
    if (!M) return;
    gsap.from('.res__title span, .res__title em', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .12 });
    gsap.from('#resCard', { y: 120, rotation: -8, opacity: 0, duration: 1.4, ease: 'expo.out', delay: .2 });
    gsap.from('.step', { x: 80, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, delay: .35 });
    gsap.from('.step__img img', { scale: .4, rotation: -20, duration: 1.2, ease: 'back.out(1.6)', stagger: .1, delay: .45 });
    gsap.from('.res__buy > *', { y: 30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .06, delay: .7 });
    S.settle('.res__title span, .res__title em, #resCard, .step, .step__img img, .res__buy > *', 2400, () => !res.hidden);
  };

  $('#resAdd').addEventListener('click', (e) => {
    (res._steps || []).forEach((s) => S.addToBag({ id: s.p.id, name: s.p.name, price: s.p.price, img: s.p.img, meta: `${s.p.kind} · ${s.p.vol}` }));
    S.toast('your whole routine is in the bag ✶');
    const b = e.currentTarget; b.querySelector('span').textContent = 'added ✓';
    setTimeout(() => S.openBag(true), 700);
  });
  $('#resAgain').addEventListener('click', () => {
    Object.keys(ans).forEach((k) => delete ans[k]);
    i = 0; show(qBox); render(1);
  });

  /* ================= ENTRANCE ================= */
  S.reveal.then(() => {
    if (M) {
      gsap.from(startW.chars, { yPercent: 100, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .03 });
      gsap.timeline({ delay: .5, onUpdate: startW.wake }).to(startW.f, { boost: .9, duration: .5 }).to(startW.f, { boost: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.from('.qz__k, .qz__startrow > *', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, delay: .3 });
      S.settle([startW.chars, $$('.qz__k, .qz__startrow > *')], 2200, () => !start.hidden);
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
