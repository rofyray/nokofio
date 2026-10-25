/* Paid Board rendering for the merged concept: landing preview + full board page.
   Bills paid in the demo during this browser session are added to the top. */
(function () {
  const KEY = 'nokofio-paid';
  const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (_) { return []; } };
  const save = (list) => { try { sessionStorage.setItem(KEY, JSON.stringify(list.slice(0, 20))); } catch (_) { /* storage blocked */ } };

  let paid = load();
  const entries = () => [...paid, ...Nokofio.board];

  function render(list) {
    const limit = list.dataset.boardRows === 'all' ? Infinity : Number(list.dataset.boardRows);
    list.innerHTML = entries().slice(0, limit).map((e) => Nokofio.boardRowHTML(e)).join('');
  }

  function renderStats() {
    const all = entries();
    const set = (k, v) => document.querySelectorAll(`[data-stat="${k}"]`).forEach((el) => { el.textContent = v; });
    set('total', Nokofio.money(all.reduce((sum, e) => sum + e.amount, 0)));
    set('count', all.length);
    set('anon', Math.round((all.filter((e) => e.anon).length / all.length) * 100) + '%');
  }

  // filters on the full board page
  const state = { cat: 'all', donor: 'all' };
  function applyFilters() {
    document.querySelectorAll('[data-board-rows] .nf-row').forEach((row) => {
      const catOk = state.cat === 'all' || row.dataset.cat === state.cat;
      const donorOk = state.donor === 'all' || (state.donor === 'anon') === (row.dataset.anon === '1');
      row.classList.toggle('is-hidden', !(catOk && donorOk));
    });
    const empty = document.querySelector('.bs-empty');
    if (empty) empty.hidden = !!document.querySelector('[data-board-rows] .nf-row:not(.is-hidden)');
  }
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    const [group, value] = chip.dataset.filter.split(':');
    state[group] = value;
    document.querySelectorAll(`[data-filter^="${group}:"]`).forEach((c) => c.setAttribute('aria-pressed', c === chip));
    applyFilters();
  });

  window.addEventListener('nokofio:paid', (e) => {
    paid = [e.detail, ...paid];
    save(paid);
    document.querySelectorAll('[data-board-rows]').forEach((list) => {
      render(list);
      list.querySelector('.nf-row')?.classList.add('is-new');
    });
    renderStats();
    applyFilters();
  });

  document.querySelectorAll('[data-board-rows]').forEach(render);
  renderStats();
})();
