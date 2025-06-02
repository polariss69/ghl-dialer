(function () {
  /* ---------- 1. CONFIG ---------- */
  const N8N_URL =
    'https://n8n.polariss.tech/webhook/c1b52f94-800a-4934-87fa-796bb15f42f7';

  /* ---------- 2. DEVICE ID ---------- */
  const DEVICE_KEY = 'polarissDeviceId';
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = 'dev-' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(DEVICE_KEY, deviceId);
  }

  /* ---------- 3. WAIT FOR HEADER ---------- */
  const poll = setInterval(() => {
    const header = document.querySelector('header.hl_header .container-fluid');
    if (!header) return;

    /* Stop polling once header is found */
    clearInterval(poll);

    /* Avoid duplicate injection */
    if (document.querySelector('#customDialerIcon')) return;

    /* ---------- 4. CREATE ICON ---------- */
    const icon = document.createElement('div');
    icon.id = 'customDialerIcon';
    icon.innerHTML = '📞';
    icon.title = 'Open dialer';

    /* Place icon immediately AFTER the "Ask AI" button */
    const askAi = document.querySelector(
      '#hl_header--copilot-icon, [title="Ask AI"]'
    );
    if (askAi && askAi.parentElement) {
      askAi.insertAdjacentElement('afterend', icon);
    } else {
      header.appendChild(icon); // fallback
    }

    /* ---------- 5. CREATE POPUP ---------- */
    const popup = document.createElement('div');
    popup.id = 'dialerPopup';
    popup.innerHTML = `
      <input type="tel" id="dialNumber" placeholder="Enter phone number" />
      <button id="triggerCall">Call</button>
    `;
    document.body.appendChild(popup);

    /* ---------- 6. TOGGLE POPUP ---------- */
    icon.addEventListener('click', () => {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      document.getElementById('dialNumber').focus();
    });

    /* ---------- 7. AUTO-PREFIX +91 WHILE TYPING ---------- */
    const phoneInput = document.getElementById('dialNumber');
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.trim();
      if (!v) return;

      if (v.startsWith('+')) return;            // already has a country code
      if (v.startsWith('91')) {                // starts with 91 but no "+"
        phoneInput.value = '+' + v;
      } else {                                 // no prefix at all
        phoneInput.value = '+91' + v.replace(/^\+?91/, '');
      }
    });

    /* ---------- 8. SEND GET TO n8n ---------- */
    document
      .getElementById('triggerCall')
      .addEventListener('click', () => {
        let number = phoneInput.value.trim();
        if (!number) return alert('Please enter a phone number');

        const url =
          `${N8N_URL}?phone=${encodeURIComponent(number)}&deviceId=` +
          encodeURIComponent(deviceId);

        fetch(url, { method: 'GET', mode: 'no-cors' })
          .then(() => {
            alert('Call triggered!');
            popup.style.display = 'none';
            phoneInput.value = '';
          })
          .catch((err) => alert('Error: ' + err.message));
      });
  }, 400);
})();
