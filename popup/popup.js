// Popup script for theme selection

const themeSelect = document.getElementById('theme-select');
const applyBtn = document.getElementById('apply-btn');
const statusMessage = document.getElementById('status-message');

// Load current theme on popup open
function loadCurrentTheme() {
  chrome.storage.sync.get(['activeTheme'], (data) => {
    const activeTheme = data.activeTheme || 'darkDefault';
    themeSelect.value = activeTheme;
  });
}

// Apply theme when button clicked
applyBtn.addEventListener('click', () => {
  const selectedTheme = themeSelect.value;
  chrome.storage.sync.set({ activeTheme: selectedTheme }, () => {
    statusMessage.textContent = `✓ Theme applied: ${selectedTheme}`;
    statusMessage.classList.add('success');
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.classList.remove('success');
    }, 2000);
  });
});

// Also apply when theme is changed (optional - auto-apply on select)
themeSelect.addEventListener('change', () => {
  applyBtn.click();
});

// Initialize on popup load
loadCurrentTheme();
