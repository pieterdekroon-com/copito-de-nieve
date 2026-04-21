// Gorilla Pop — 2% kans per page load op een random gorilla.
//
// Handmatig forceren tijdens het bouwen:
// - Keyboard: ⌥⇧G (Alt+Shift+G) op elke http(s)-pagina
// - Console: switch in devtools naar context "Copito de Nieve" → __copito()

(() => {
  // Alleen in het top-level frame — geen gorilla's in ad-iframes.
  if (window.top !== window.self) return;

  // Alleen op echte http(s) pagina's, niet op chrome://, extension:// of file://
  if (!/^https?:$/.test(location.protocol)) return;

  const CHANCE = 0.02;
  const DELAY_MS = 600;
  const ENTRY_MS = 400;
  const STARE_MS = 1800;

  // De pool aan gorilla's. Wil je er later meer? Zet een nieuwe PNG in /assets
  // en voeg de bestandsnaam toe aan deze lijst.
  const GORILLAS = [
    'gorilla1.png',
    'gorilla2.png',
    'gorilla3.png',
    'gorilla4.png',
    'gorilla5.png'
  ];

  function summonGorilla() {
    const pick = GORILLAS[Math.floor(Math.random() * GORILLAS.length)];

    const container = document.createElement('div');
    container.className = 'gorilla-pop__container';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('assets/' + pick);
    img.className = 'gorilla-pop__img';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    container.appendChild(img);

    document.body.appendChild(container);

    // Trigger de entry-animatie in de volgende frame — anders pakt de
    // CSS transition niet omdat het element "al" zichtbaar is.
    requestAnimationFrame(() => {
      container.classList.add('gorilla-pop__container--visible');
    });

    setTimeout(() => {
      container.classList.remove('gorilla-pop__container--visible');
      container.classList.add('gorilla-pop__container--leaving');

      // Ruim de DOM op zodra de exit-animatie klaar is.
      setTimeout(() => container.remove(), 500);
    }, ENTRY_MS + STARE_MS);
  }

  // Dev hook: forceer een gorilla via ⌥⇧G, ongeacht CHANCE.
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyG') {
      e.preventDefault();
      summonGorilla();
    }
  });

  // Ook bereikbaar vanuit devtools console (context-switch naar "Copito de Nieve").
  window.__copito = summonGorilla;

  // Normale page load: kleine delay zodat de pagina eerst rustig laadt.
  if (Math.random() < CHANCE) {
    setTimeout(summonGorilla, DELAY_MS);
  }
})();
