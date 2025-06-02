(function() {
  const N8N_URL = 'https://n8n.polariss.tech/webhook/c1b52f94-800a-4934-87fa-796bb15f42f7';

  const waitForHeader = setInterval(() => {
    // 1. Update selector if your header’s class is different
    const header = document.querySelector('.top-nav');
    if (header && !document.querySelector('#customDialerIcon')) {
      clearInterval(waitForHeader);

      // 2. Create and style the phone icon
      const callButton = document.createElement('div');
      callButton.id = 'customDialerIcon';
      callButton.innerHTML = '📞';
      callButton.style.cursor = 'pointer';
      callButton.style.fontSize = '20px';
      callButton.style.marginLeft = '20px';
      header.appendChild(callButton);

      // 3. Create the hidden dialer popup
      const dialerPopup = document.createElement('div');
      dialerPopup.id = 'dialerPopup';
      dialerPopup.style.position = 'fixed';
      dialerPopup.style.top = '70px';
      dialerPopup.style.right = '20px';
      dialerPopup.style.padding = '15px';
      dialerPopup.style.background = '#fff';
      dialerPopup.style.border = '1px solid #ccc';
      dialerPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      dialerPopup.style.borderRadius = '8px';
      dialerPopup.style.zIndex = 9999;
      dialerPopup.style.display = 'none';

      dialerPopup.innerHTML = `
        <input type="tel" id="dialNumber" placeholder="Enter phone number"
               style="width: 180px; padding: 8px; margin-bottom: 8px; border-radius: 5px; border: 1px solid #ccc;"><br>
        <button id="triggerCall"
                style="background: #008f4c; color: white; padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer;">
          Call
        </button>
      `;
      document.body.appendChild(dialerPopup);

      // 4. Toggle popup visibility
      callButton.onclick = () => {
        dialerPopup.style.display =
          dialerPopup.style.display === 'none' ? 'block' : 'none';
      };

      // 5. Handle the Call button click
      document.getElementById('triggerCall').onclick = () => {
        const number = document.getElementById('dialNumber').value.trim();
        if (!number) {
          alert('Please enter a phone number');
          return;
        }
        fetch(N8N_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: number, triggeredBy: 'GHL-Dialer' })
        })
        .then(res => {
          if (res.ok) alert('Call triggered!');
          else alert('Failed to trigger call');
        })
        .catch(err => alert('Error: ' + err.message));
      };
    }
  }, 1000);
})();
