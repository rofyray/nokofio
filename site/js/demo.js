/* Nokofio concept demo engine, shared by every concept page.
   Renders the bill deck, swipe gestures, details/pay sheets and the scripted walkthrough.
   Concepts only style the nf-* class names; behaviour stays identical so parts can be mixed. */
(function () {
  const BILLS = [
    {
      id: 'NF-0412', who: 'Ama', age: 27, where: 'Dansoman, Accra', cat: 'light', label: 'Light bill',
      biller: 'ECG Prepaid', account: 'Meter 0412 •••• 8831', amount: 180, due: 'Fri 30 Oct',
      line: 'Lights went off during the Black Stars match. Never again.',
      story: 'Prepaid units finished on Tuesday. I sell kenkey from home and the freezer is the whole business. GH₵180 takes us to month end.',
      done: 'Lights back on in Dansoman. The freezer says thank you.'
    },
    {
      id: 'NF-0388', who: 'Nii Armah', age: 34, where: 'Jamestown, Accra', cat: 'water', label: 'Water bill',
      biller: 'Ghana Water', account: 'Acct 7710 •••• 204', amount: 95, due: 'Mon 2 Nov',
      line: 'Three months of carrying buckets. My arms are too strong now.',
      story: 'The compound meter is in my name and two tenants travelled without paying their share. We have been fetching from the neighbour since August.',
      done: 'Taps flowing in Jamestown. Nii can finally rest his arms.'
    },
    {
      id: 'NF-0451', who: 'Kwame', age: 22, where: 'Asokwa, Kumasi', cat: 'school', label: 'School fees',
      biller: 'Bright Star Academy', account: 'Student 22-0918', amount: 1450, due: 'Wed 4 Nov',
      line: 'Term 2 fees for my sister. She wants to be a doctor. I want her to stop calling me.',
      story: 'Abena is in Form 2. Our mother passed last year and I am doing Bolt to cover everything. Term 2 fees are the one thing I cannot stretch.',
      done: 'Abena is back in class. Kwame can answer his phone again.'
    },
    {
      id: 'NF-0397', who: 'Efua', age: 41, where: 'Cape Coast', cat: 'health', label: 'Hospital bill',
      biller: 'Mercy Clinic, Cape Coast', account: 'Invoice MC-55102', amount: 620, due: 'Today',
      line: 'Malaria came, saw, and sent an invoice.',
      story: 'Three nights on admission. The clinic will not release my discharge papers until the bill is settled, so I am still here eating their jollof.',
      done: 'Bill cleared. Efua is home and resting.'
    },
    {
      id: 'NF-0420', who: 'Naa Adjeley', age: 30, where: 'Teshie, Accra', cat: 'rent', label: 'Rent',
      biller: 'Landlord (verified MoMo)', account: 'Room 4, Teshie', amount: 900, due: 'Sun 1 Nov',
      line: 'My landlord has started greeting me formally.',
      story: 'Salary is two months late at work. I have paid everything else; this is the last one. He is a good man but his patience is not.',
      done: 'Rent paid. The landlord is back to calling her "my daughter".'
    }
  ];

  const ICONS = {
    light: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5a14 14 0 0 0-8 25.5c1.5 1.1 2.5 2.8 2.5 4.6V36h11v-.9c0-1.8 1-3.5 2.5-4.6A14 14 0 0 0 24 5z"/><rect x="18.5" y="38.5" width="11" height="3" rx="1.5"/><rect x="20.5" y="43" width="7" height="3" rx="1.5"/></svg>',
    water: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4C18 13.5 10 21.5 10 30a14 14 0 0 0 28 0c0-8.5-8-16.5-14-26z"/></svg>',
    school: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7 2 18l22 11 22-11z"/><path d="M10 23.5V33c0 3.3 6.3 7.5 14 7.5S38 36.3 38 33v-9.5L24 30.5z"/><rect x="41.5" y="18" width="3" height="14" rx="1.5"/></svg>',
    health: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 5h12v13h13v12H30v13H18V30H5V18h13z"/></svg>',
    rent: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 3 21h6v22h12V31h6v12h12V21h6z"/></svg>'
  };

  const NETWORKS = [
    { id: 'mtn', name: 'MTN MoMo' },
    { id: 'telecel', name: 'Telecel Cash' },
    { id: 'at', name: 'AT Money' }
  ];

  // Nicknames for donors who stay anonymous on the Paid Board.
  const ALIASES = [
    'Chairman',
    'Secret Santa from East Legon',
    'Somebody’s uncle in Abrokyire',
    'Big Man',
    'A Rich Somebody',
    'Probably your boss'
  ];
  const DONOR_NAME = 'Kwesi A.';
  const LABELS = { light: 'Light bill', water: 'Water bill', school: 'School fees', health: 'Hospital bill', rent: 'Rent' };

  // Example Paid Board entries (fictional), newest first.
  const BOARD = [
    { when: '12 min ago', who: 'Yaw', where: 'Tamale', cat: 'school', biller: 'Savanna Heights SHS', amount: 980, by: 'Akosua D.', anon: false, ref: 'NF-0447' },
    { when: '40 min ago', who: 'Esi', where: 'Takoradi', cat: 'light', biller: 'ECG Prepaid', amount: 150, by: 'Chairman', anon: true, ref: 'NF-0445' },
    { when: '1 hr ago', who: 'Kojo', where: 'Ho', cat: 'health', biller: 'Volta Care Clinic', amount: 430, by: 'Big Man', anon: true, ref: 'NF-0441' },
    { when: '2 hrs ago', who: 'Adwoa', where: 'Madina, Accra', cat: 'water', biller: 'Ghana Water', amount: 120, by: 'Kwesi A.', anon: false, ref: 'NF-0438' },
    { when: '3 hrs ago', who: 'Nii', where: 'La, Accra', cat: 'rent', biller: 'Landlord (verified MoMo)', amount: 750, by: 'Somebody’s uncle in Abrokyire', anon: true, ref: 'NF-0436' },
    { when: 'Yesterday', who: 'Afia', where: 'Bantama, Kumasi', cat: 'light', biller: 'ECG Prepaid', amount: 200, by: 'Selorm & friends', anon: false, ref: 'NF-0431' },
    { when: 'Yesterday', who: 'Kwabena', where: 'Sunyani', cat: 'school', biller: 'Peace Academy', amount: 1200, by: 'A Rich Somebody', anon: true, ref: 'NF-0429' },
    { when: 'Yesterday', who: 'Dzifa', where: 'Keta', cat: 'health', biller: 'Keta Lagoon Clinic', amount: 310, by: 'Mawuli K.', anon: false, ref: 'NF-0426' },
    { when: '2 days ago', who: 'Ekow', where: 'Cape Coast', cat: 'water', biller: 'Ghana Water', amount: 85, by: 'Secret Santa from East Legon', anon: true, ref: 'NF-0420' },
    { when: '2 days ago', who: 'Akua', where: 'Koforidua', cat: 'rent', biller: 'Landlord (verified MoMo)', amount: 600, by: 'Abena O.', anon: false, ref: 'NF-0417' },
    { when: '3 days ago', who: 'Fuseini', where: 'Bolgatanga', cat: 'light', biller: 'ECG Prepaid', amount: 90, by: 'Probably your boss', anon: true, ref: 'NF-0412' },
    { when: '3 days ago', who: 'Naa', where: 'Osu, Accra', cat: 'health', biller: 'Osu Family Clinic', amount: 540, by: 'Chairman', anon: true, ref: 'NF-0409' }
  ];

  const DEFAULT_COPY = {
    stampPay: 'I GO PAY',
    stampSkip: 'NEXT TIME',
    skip: 'Pass',
    info: 'Details',
    pay: 'Pay',
    payCta: 'Pay {amount} in full',
    processing: 'Approve the prompt on your phone…',
    nextBill: 'Next bill',
    fine: 'Demo only. No money moves. Real payments will run through Paystack.',
    captions: [
      'Every card is a real bill. Swipe left to pass.',
      'Tap a card to read the story and see the bill.',
      'Swipe right to pay it. Full amount only.',
      'Pick your mobile money wallet.',
      'Show your name on the Paid Board, or stay anonymous.',
      'Money goes straight to the biller, not the person.',
      'Every payment goes on the public Paid Board.',
      'Done. On to the next bill.',
      'Your turn. Swipe away.'
    ]
  };

  const money = (n) => 'GH₵' + n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = (n) => n.toLocaleString('en-GH');
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let aliasTurn = 0;
  const byHTML = (e) => e.anon ? `${e.by}<em class="nf-anon-tag">anonymous</em>` : e.by;

  // One Paid Board row; used inside the demo phone and on the board pages.
  function boardRowHTML(e, extraClass = '') {
    return `<li class="nf-row ${e.anon ? 'is-anon' : ''} ${extraClass}" data-cat="${e.cat}" data-anon="${e.anon ? 1 : 0}">
      <span class="nf-row-when">${e.when}</span>
      <span class="nf-row-bill"><i class="nf-row-icon">${ICONS[e.cat]}</i>${LABELS[e.cat]}</span>
      <span class="nf-row-for">${e.who}, ${e.where}</span>
      <span class="nf-row-to">${e.biller}<small>#${e.ref}</small></span>
      <span class="nf-row-amt">${money(e.amount)}</span>
      <span class="nf-row-by"><small>Paid by</small>${byHTML(e)}</span>
      <span class="nf-row-stamp" aria-hidden="true">PAID</span>
    </li>`;
  }

  function mount(root, options = {}) {
    const copy = Object.assign({}, DEFAULT_COPY, options.copy);
    const extra = options.cardExtra || (() => '');
    const THRESHOLD = 100;
    let order = BILLS.map((_, i) => i);
    let busy = false;
    let runId = 0;

    root.classList.add('nf-demo');
    root.innerHTML = `
      <p class="nf-caption" aria-live="polite"></p>
      <div class="nf-deck"></div>
      <div class="nf-actions">
        <button type="button" class="nf-btn nf-btn-skip" data-act="skip" aria-label="Pass on this bill"><span>✕</span><em>${copy.skip}</em></button>
        <button type="button" class="nf-btn nf-btn-info" data-act="info" aria-label="See bill details"><span>i</span><em>${copy.info}</em></button>
        <button type="button" class="nf-btn nf-btn-pay" data-act="pay" aria-label="Pay this bill"><span>₵</span><em>${copy.pay}</em></button>
      </div>
      <div class="nf-sheet" hidden><div class="nf-sheet-panel" role="dialog" aria-modal="true"></div></div>`;

    const deck = root.querySelector('.nf-deck');
    const caption = root.querySelector('.nf-caption');
    const sheet = root.querySelector('.nf-sheet');
    const panel = root.querySelector('.nf-sheet-panel');

    const current = () => BILLS[order[0]];
    const topCard = () => deck.querySelector('.nf-card[data-top]');

    function cardHTML(b, i) {
      return `<article class="nf-card" data-cat="${b.cat}" ${i === 0 ? 'data-top' : ''} style="--i:${i}" aria-label="${b.label} for ${b.who}, ${money(b.amount)}">
        <header class="nf-card-top"><span class="nf-cat">${b.label}</span><span class="nf-ref">#${b.id}</span></header>
        <div class="nf-art"><span class="nf-icon">${ICONS[b.cat]}</span></div>
        <div class="nf-body">
          <h3 class="nf-who">${b.who}, ${b.age}</h3>
          <p class="nf-where">${b.where}</p>
          <p class="nf-line">“${b.line}”</p>
        </div>
        <footer class="nf-card-foot">
          <div class="nf-amt"><span class="nf-cur">GH₵</span>${num(b.amount)}</div>
          <div class="nf-biller">Pays <b>${b.biller}</b> directly</div>
        </footer>
        ${extra(b)}
        <span class="nf-stamp nf-stamp-pay" aria-hidden="true">${copy.stampPay}</span>
        <span class="nf-stamp nf-stamp-skip" aria-hidden="true">${copy.stampSkip}</span>
      </article>`;
    }

    function render() {
      deck.innerHTML = order.slice(0, 3).map((idx, i) => cardHTML(BILLS[idx], i)).reverse().join('');
    }

    function setDrag(card, dx, dy) {
      card.style.transform = `translate(${dx}px, ${dy * 0.35}px) rotate(${dx * 0.06}deg)`;
      card.style.setProperty('--pay', clamp(dx / THRESHOLD));
      card.style.setProperty('--skip', clamp(-dx / THRESHOLD));
    }

    function resetDrag(card) {
      card.style.transform = '';
      card.style.setProperty('--pay', 0);
      card.style.setProperty('--skip', 0);
    }

    function commit(dir) {
      const card = topCard();
      if (!card || busy) return Promise.resolve();
      busy = true;
      const sign = dir === 'pay' ? 1 : -1;
      card.classList.add('is-leaving');
      card.style.setProperty(dir === 'pay' ? '--pay' : '--skip', 1);
      card.style.transform = `translate(${sign * 140}%, 20px) rotate(${sign * 24}deg)`;
      return wait(reduceMotion ? 60 : 380).then(() => {
        busy = false;
        if (dir === 'skip') advance();
        else openPay();
      });
    }

    function advance() {
      order.push(order.shift());
      render();
    }

    // ---- gestures ----
    let drag = null;
    deck.addEventListener('pointerdown', (e) => {
      const card = topCard();
      if (!card || busy || !card.contains(e.target)) return;
      stopWalkthrough();
      drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, card };
      card.setPointerCapture(e.pointerId);
      card.classList.add('is-dragging');
    });
    deck.addEventListener('pointermove', (e) => {
      if (!drag) return;
      drag.dx = e.clientX - drag.x;
      drag.dy = e.clientY - drag.y;
      setDrag(drag.card, drag.dx, drag.dy);
    });
    const endDrag = () => {
      if (!drag) return;
      const { card, dx, dy } = drag;
      drag = null;
      card.classList.remove('is-dragging');
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) { resetDrag(card); openDetails(); return; }
      if (dx > THRESHOLD) commit('pay');
      else if (dx < -THRESHOLD) commit('skip');
      else resetDrag(card);
    };
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);

    root.querySelector('.nf-actions').addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act) return;
      stopWalkthrough();
      if (act === 'info') openDetails();
      else commit(act);
    });

    root.addEventListener('keydown', (e) => {
      if (!sheet.hidden) { if (e.key === 'Escape') cancelSheet(); return; }
      if (e.key === 'ArrowLeft') commit('skip');
      if (e.key === 'ArrowRight') commit('pay');
    });

    // ---- sheets ----
    let sheetMode = null;
    function openSheet(mode, html) {
      sheetMode = mode;
      panel.dataset.mode = mode;
      panel.innerHTML = html;
      sheet.hidden = false;
      requestAnimationFrame(() => sheet.classList.add('is-open'));
    }
    function closeSheet() {
      sheet.classList.remove('is-open');
      sheetMode = null;
      return wait(reduceMotion ? 0 : 260).then(() => { if (!sheetMode) sheet.hidden = true; });
    }
    function cancelSheet() {
      if (sheetMode === 'pay') { closeSheet(); render(); }
      else if (sheetMode === 'done' || sheetMode === 'board') finishDone();
      else closeSheet();
    }

    function openDetails() {
      const b = current();
      openSheet('details', `
        <header class="nf-sh-head"><span class="nf-cat">${b.label}</span><button type="button" class="nf-close" data-sheet="close" aria-label="Close">✕</button></header>
        <h3 class="nf-sh-title">${b.who}, ${b.age} <small>${b.where}</small></h3>
        <p class="nf-story">${b.story}</p>
        <figure class="nf-doc" aria-label="Attached bill">
          <div class="nf-doc-head"><b>${b.biller}</b><span>${b.account}</span></div>
          <div class="nf-doc-lines"><i></i><i></i><i></i><i></i></div>
          <div class="nf-doc-total"><span>Amount due</span><b>${money(b.amount)}</b></div>
          <figcaption>Attached bill · 1 of 1</figcaption>
        </figure>
        <dl class="nf-facts">
          <div><dt>Money goes to</dt><dd>${b.biller}</dd></div>
          <div><dt>Due</dt><dd>${b.due}</dd></div>
          <div><dt>Check</dt><dd>Bill confirmed with biller</dd></div>
        </dl>
        <div class="nf-sh-actions">
          <button type="button" class="nf-ghost" data-sheet="skip">Not today</button>
          <button type="button" class="nf-primary" data-sheet="pay">${copy.payCta.replace('{amount}', money(b.amount))}</button>
        </div>`);
    }

    let alias = ALIASES[0];
    let lastEntry = null;

    function openPay() {
      const b = current();
      alias = ALIASES[aliasTurn++ % ALIASES.length];
      openSheet('pay', `
        <header class="nf-sh-head"><span class="nf-cat">Pay in full</span><button type="button" class="nf-close" data-sheet="close" aria-label="Cancel">✕</button></header>
        <h3 class="nf-sh-title">Pay ${b.biller} <small>for ${b.who} · ${b.account}</small></h3>
        <div class="nf-total"><span>Total</span><b>${money(b.amount)}</b></div>
        <fieldset class="nf-nets"><legend>Pay with</legend>
          ${NETWORKS.map((n) => `<label class="nf-net" data-net="${n.id}"><input type="radio" name="net-${root.dataset.nfId}" value="${n.id}"><span>${n.name}</span></label>`).join('')}
        </fieldset>
        <label class="nf-field"><span>MoMo number</span><input type="tel" value="024 555 0182" readonly></label>
        <fieldset class="nf-nets nf-anon"><legend>On the Paid Board</legend>
          <label class="nf-net" data-show="anon"><input type="radio" name="show-${root.dataset.nfId}" value="anon" checked><span>Stay anonymous<small>You’ll show as “${alias}”</small></span></label>
          <label class="nf-net" data-show="name"><input type="radio" name="show-${root.dataset.nfId}" value="name"><span>Show my name<small>As “${DONOR_NAME}”</small></span></label>
        </fieldset>
        <button type="button" class="nf-primary" data-sheet="confirm" disabled>${copy.payCta.replace('{amount}', money(b.amount))}</button>
        <p class="nf-fine">${copy.fine}</p>`);
    }

    function selectNet(id) {
      const input = panel.querySelector(`.nf-net[data-net="${id}"] input`);
      if (input) { input.checked = true; onNetChange(); }
    }
    function onNetChange() {
      const btn = panel.querySelector('[data-sheet="confirm"]');
      if (btn) btn.disabled = !panel.querySelector('.nf-net[data-net] input:checked');
    }

    function confirmPay() {
      const b = current();
      const net = NETWORKS.find((n) => n.id === panel.querySelector('.nf-net[data-net] input:checked')?.value) || NETWORKS[0];
      const anon = panel.querySelector('.nf-net[data-show] input:checked')?.value !== 'name';
      lastEntry = { when: 'Just now', who: b.who, where: b.where, cat: b.cat, biller: b.biller, amount: b.amount, by: anon ? alias : DONOR_NAME, anon, ref: b.id };
      panel.dataset.mode = sheetMode = 'processing';
      panel.innerHTML = `<div class="nf-processing"><div class="nf-spinner" aria-hidden="true"></div><p>${copy.processing}</p><small>${net.name} · ${money(b.amount)}</small></div>`;
      return wait(reduceMotion ? 300 : 1700).then(() => {
        if (sheetMode !== 'processing') return;
        panel.dataset.mode = sheetMode = 'done';
        panel.innerHTML = `
          <div class="nf-done">
            <div class="nf-receipt">
              <span class="nf-receipt-stamp">PAID</span>
              <dl>
                <div><dt>To</dt><dd>${b.biller}</dd></div>
                <div><dt>For</dt><dd>${b.who} · ${b.account}</dd></div>
                <div><dt>From</dt><dd>${net.name}</dd></div>
                <div><dt>Ref</dt><dd>${b.id}</dd></div>
                <div><dt>Paid Board</dt><dd>${byHTML(lastEntry)}</dd></div>
              </dl>
              <div class="nf-receipt-total"><span>Paid in full</span><b>${money(b.amount)}</b></div>
            </div>
            <p class="nf-done-line">${b.done}</p>
            <div class="nf-sh-actions">
              <button type="button" class="nf-ghost" data-sheet="board">See the Paid Board</button>
              <button type="button" class="nf-primary" data-sheet="next">${copy.nextBill}</button>
            </div>
          </div>`;
        window.dispatchEvent(new CustomEvent('nokofio:paid', { detail: lastEntry }));
      });
    }

    function openBoard() {
      const rows = [lastEntry, ...BOARD.slice(0, 4)].filter(Boolean);
      openSheet('board', `
        <header class="nf-sh-head"><span class="nf-cat">The Paid Board</span><button type="button" class="nf-close" data-sheet="close" aria-label="Close">✕</button></header>
        <h3 class="nf-sh-title">Paid, in public <small>Every bill paid on Nokofio</small></h3>
        <ol class="nf-board">${rows.map((e, i) => boardRowHTML(e, i === 0 && e === lastEntry ? 'is-new' : '')).join('')}</ol>
        <button type="button" class="nf-primary" data-sheet="next">${copy.nextBill}</button>`);
    }

    function finishDone() {
      closeSheet();
      advance();
    }

    panel.addEventListener('change', onNetChange);
    panel.addEventListener('click', (e) => {
      const act = e.target.closest('[data-sheet]')?.dataset.sheet;
      if (!act) return;
      if (e.isTrusted) stopWalkthrough();
      if (act === 'close') cancelSheet();
      if (act === 'skip') closeSheet().then(() => commit('skip'));
      if (act === 'pay') closeSheet().then(() => commit('pay'));
      if (act === 'confirm') confirmPay();
      if (act === 'board') openBoard();
      if (act === 'next') finishDone();
    });
    sheet.addEventListener('click', (e) => { if (e.target === sheet) cancelSheet(); });

    // ---- scripted walkthrough (used by the demo popup) ----
    function say(text) {
      caption.textContent = text;
      caption.classList.toggle('is-on', !!text);
      if (options.onCaption) options.onCaption(text);
    }
    function stopWalkthrough() { if (root.classList.contains('is-auto')) { runId++; root.classList.remove('is-auto'); say(''); } }

    async function nudge(dir) {
      const card = topCard();
      if (!card) return;
      card.classList.add('is-nudging');
      setDrag(card, dir * 70, 0);
      await wait(650);
      card.classList.remove('is-nudging');
    }

    async function walkthrough() {
      const id = ++runId;
      const step = async (ms) => { await wait(ms); if (id !== runId) throw new Error('stopped'); };
      const c = copy.captions;
      root.classList.add('is-auto');
      try {
        if (!sheet.hidden) { await closeSheet(); }
        say(c[0]);
        await step(1600); await nudge(-1); await step(100); await commit('skip');
        say(c[1]);
        await step(1500); openDetails();
        await step(3000); await closeSheet();
        say(c[2]);
        await step(1400); await nudge(1); await step(100); await commit('pay');
        say(c[3]);
        await step(1300); selectNet('mtn');
        await step(900); say(c[4]);
        panel.querySelector('.nf-anon')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        await step(2200); say(c[5]); confirmPay();
        await step(4000); say(c[6]); openBoard();
        await step(3800); say(c[7]);
        await step(1400); finishDone();
        await step(1200); say(c[8]);
        root.classList.remove('is-auto');
      } catch (_) { /* user took over */ }
    }

    root.dataset.nfId = Math.random().toString(36).slice(2, 8);
    root.tabIndex = 0;
    render();
    return { walkthrough, stop: stopWalkthrough, next: () => commit('skip'), pay: () => commit('pay') };
  }

  // ---- page helpers: demo popup + waitlist popup (Tally placeholder) ----
  function initPage(options = {}) {
    document.querySelectorAll('[data-nf-demo]').forEach((el) => mount(el, options));

    const modal = document.createElement('div');
    modal.className = 'nf-modal';
    modal.hidden = true;
    modal.innerHTML = `<div class="nf-modal-box" role="dialog" aria-modal="true"><button type="button" class="nf-modal-close" aria-label="Close">✕</button><div class="nf-modal-body"></div></div>`;
    document.body.appendChild(modal);
    const body = modal.querySelector('.nf-modal-body');
    let active = null;

    function open(kind, html) {
      body.innerHTML = html;
      modal.dataset.kind = kind;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => modal.classList.add('is-open'));
      modal.querySelector('.nf-modal-close').focus();
    }
    function close() {
      if (active) active.stop();
      active = null;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { modal.hidden = true; body.innerHTML = ''; }, 250);
    }
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.nf-modal-close, [data-modal-close]')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

    document.addEventListener('click', (e) => {
      const demoBtn = e.target.closest('[data-open-demo]');
      const wlBtn = e.target.closest('[data-waitlist]');
      if (demoBtn) {
        e.preventDefault();
        open('demo', `<div class="nf-phone nf-phone-modal"><div class="nf-screen"><div class="nf-modal-demo"></div></div></div><p class="nf-modal-caption" aria-live="polite"></p>`);
        const cap = body.querySelector('.nf-modal-caption');
        active = mount(body.querySelector('.nf-modal-demo'), Object.assign({}, options, {
          onCaption: (t) => { cap.textContent = t; cap.classList.toggle('is-on', !!t); }
        }));
        setTimeout(() => active && active.walkthrough(), 500);
      }
      if (wlBtn) {
        e.preventDefault();
        const role = wlBtn.dataset.waitlist;
        const rich = role === 'rich';
        // Real Tally popup when the page configures a form and the widget script loaded.
        const tally = options.tally;
        if (tally && window.Tally) {
          const ref = new URLSearchParams(location.search).get('ref') || tally.ref || 'site';
          window.Tally.openPopup(tally.formId, {
            layout: 'modal',
            width: 560,
            overlay: true,
            hiddenFields: { role: tally.roles?.[role] || role, ref },
            onSubmit: (payload) => window.dispatchEvent(new CustomEvent('nokofio:waitlist', { detail: payload }))
          });
          return;
        }
        open('waitlist', `
          <div class="nf-wl">
            <p class="nf-wl-kicker">Join the waitlist</p>
            <h3>${rich ? (options.copy?.wlRich || 'You’re rich. We believe you.') : (options.copy?.wlHelp || 'Help is a swipe away.')}</h3>
            <p>The Tally form opens here as a popup, with <code>role=${role}</code> already filled in.</p>
            <ol>
              <li>Full name</li>
              <li>WhatsApp number (+233)</li>
              <li>Email (optional)</li>
              ${rich ? '<li>How much you’d swipe away a month</li><li>Which wallet you use</li>' : '<li>What kind of bill</li><li>Roughly how much</li><li>Your town</li>'}
            </ol>
            <button type="button" class="nf-primary" data-modal-close>Okay</button>
          </div>`);
      }
    });
  }

  window.Nokofio = { mount, initPage, bills: BILLS, board: BOARD, boardRowHTML, money };
})();
