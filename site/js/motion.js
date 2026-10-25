/* Motion layer for the Paint & Paper pages.
   Adds .motion-ready only when motion is allowed, so without this script (or with
   reduced motion) every element is already in its final, readable state. */
(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- reveal on scroll ----
  const REVEAL = '.sec-head, .board, .ledger-row, .board-sheet, .stat, .finale-stage';
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  function prepare() {
    document.querySelectorAll(REVEAL).forEach((el) => {
      el.dataset.reveal = '';
      if (el.classList.contains('finale-stage')) el.querySelector('.finale').dataset.reveal = '';
      io.observe(el);
    });
    // stagger indexes: receipt lines, ledger rows, stats
    document.querySelectorAll('.board .receipt').forEach((r) => {
      r.querySelectorAll('.line, .r-total, .r-foot, .barcode').forEach((el, i) => el.style.setProperty('--n', i));
    });
    document.querySelectorAll('.stats .stat').forEach((el, i) => el.style.setProperty('--n', i));
  }

  // paid board rows are rendered by board.js; number them when the sheet arrives
  function numberStamps() {
    document.querySelectorAll('.board-sheet .nf-row').forEach((row, i) => row.style.setProperty('--n', Math.min(i, 10)));
  }

  // ---- scroll-linked: ledger coin + slogan strip lean ----
  const ledger = document.querySelector('.ledger');
  const bandTrack = document.querySelector('.band-track');
  const band = document.querySelector('.band');
  let lastY = window.scrollY;
  let lean = 0;
  let ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY;
    const v = y - lastY;
    lastY = y;

    if (ledger) {
      const r = ledger.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / r.height));
      ledger.style.setProperty('--p', p.toFixed(3));
      ledger.style.setProperty('--h', r.height + 'px');
    }

    if (band) {
      lean += (Math.max(-7, Math.min(7, v * 0.25)) - lean) * 0.25;
      band.style.transform = `skewX(${(-lean).toFixed(2)}deg)`;
      if (Math.abs(lean) > 0.05) request();
      else band.style.transform = '';
    }
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  // pause the marquee while it is off-screen
  const bandIO = band && new IntersectionObserver(([e]) => {
    bandTrack.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
  });

  // ---- "try am": one nudge on the hero deck if nobody has touched it ----
  let hintTimer = null;
  function scheduleHint() {
    const deck = document.querySelector('.stage .nf-demo');
    if (!deck) return;
    const cancel = () => clearTimeout(hintTimer);
    deck.addEventListener('pointerdown', cancel, { once: true });
    deck.addEventListener('keydown', cancel, { once: true });
    hintTimer = setTimeout(() => {
      const card = deck.querySelector('.nf-card[data-top]');
      if (!card || !root.classList.contains('motion-ready')) return;
      card.classList.add('is-hint');
      card.addEventListener('animationend', () => card.classList.remove('is-hint'), { once: true });
    }, 2600);
  }

  function enable() {
    root.classList.add('motion-ready');
    prepare();
    numberStamps();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    if (bandIO) bandIO.observe(band);
    request();
    scheduleHint();
  }

  function disable() {
    root.classList.remove('motion-ready');
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', request);
    if (bandIO) bandIO.disconnect();
    if (band) band.style.transform = '';
    clearTimeout(hintTimer);
  }

  window.addEventListener('nokofio:paid', numberStamps);
  reduce.addEventListener('change', () => (reduce.matches ? disable() : enable()));
  // start after the inline page script has mounted the hero deck
  const start = () => (reduce.matches ? disable() : enable());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
