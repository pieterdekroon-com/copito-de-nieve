(() => {
  const enabledInput = document.getElementById('enabled');
  const testButton = document.getElementById('test');
  const shortcutEl = document.getElementById('shortcut');
  const sightingsEl = document.getElementById('sightings');

  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  const keys = isMac ? ['⌥', '⇧', 'G'] : ['Alt', 'Shift', 'G'];
  shortcutEl.innerHTML = keys.map((k) => `<kbd>${k}</kbd>`).join('');

  chrome.storage.sync.get({ enabled: true, sightings: 0 }, ({ enabled, sightings }) => {
    enabledInput.checked = enabled;
    sightingsEl.textContent = sightings.toLocaleString();
  });

  // Bijwerken als hij langskomt terwijl de popup openstaat.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.sightings) {
      sightingsEl.textContent = changes.sightings.newValue.toLocaleString();
    }
  });

  enabledInput.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enabledInput.checked });
  });

  testButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      testButton.textContent = 'Not available here';
      testButton.disabled = true;
      return;
    }
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'copito:test' });
      window.close();
    } catch {
      testButton.textContent = 'Reload the page first';
      testButton.disabled = true;
    }
  });
})();
