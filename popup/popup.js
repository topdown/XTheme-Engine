// Popup script for theme selection

const themeSelect = document.getElementById('theme-select');
const applyBtn = document.getElementById('apply-btn');
const statusMessage = document.getElementById('status-message');
const colorPickers = document.querySelectorAll('.color-picker');
const resetColorsBtn = document.getElementById('reset-colors-btn');

// Theme definitions (must match inject.js)
const themes = {
  darkDefault: { bodyBg: 'rgb(15, 23, 42)', cardBg: 'rgb(30, 41, 59)', overlayBg: 'rgb(18, 27, 35 / 65%)', borderColor: 'rgb(51, 65, 85)', textPrimary: 'rgb(241, 245, 249)', accentBlue: 'rgb(59, 130, 246)' },
  midnightBlue: { bodyBg: 'rgb(10, 20, 40)', cardBg: 'rgb(20, 35, 50)', overlayBg: 'rgb(10, 15, 25 / 70%)', borderColor: 'rgb(40, 60, 100)', textPrimary: 'rgb(200, 220, 255)', accentBlue: 'rgb(100, 150, 255)' },
  deepPurple: { bodyBg: 'rgb(25, 15, 40)', cardBg: 'rgb(40, 25, 60)', overlayBg: 'rgb(20, 10, 35 / 70%)', borderColor: 'rgb(60, 40, 100)', textPrimary: 'rgb(230, 200, 255)', accentBlue: 'rgb(180, 100, 255)' },
  oceanCyan: { bodyBg: 'rgb(8, 30, 45)', cardBg: 'rgb(15, 50, 75)', overlayBg: 'rgb(10, 35, 55 / 70%)', borderColor: 'rgb(30, 80, 120)', textPrimary: 'rgb(180, 240, 255)', accentBlue: 'rgb(0, 200, 255)' },
  amberfireSoft: { bodyBg: 'rgb(45, 30, 15)', cardBg: 'rgb(65, 45, 25)', overlayBg: 'rgb(50, 35, 20 / 70%)', borderColor: 'rgb(100, 75, 40)', textPrimary: 'rgb(255, 235, 180)', accentBlue: 'rgb(255, 165, 0)' },
  monochrome: { bodyBg: 'rgb(20, 20, 20)', cardBg: 'rgb(35, 35, 35)', overlayBg: 'rgb(25, 25, 25 / 70%)', borderColor: 'rgb(60, 60, 60)', textPrimary: 'rgb(220, 220, 220)', accentBlue: 'rgb(180, 180, 180)' }
};

// Convert RGB to hex
function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return '#000000';
  
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Load current theme and custom colors on popup open
function loadCurrentSettings() {
  chrome.storage.sync.get(['activeTheme', 'customOverrides'], (data) => {
    const activeTheme = data.activeTheme || 'darkDefault';
    const customOverrides = data.customOverrides || {};
    
    themeSelect.value = activeTheme;
    
    // Load theme colors into pickers
    const themeColors = themes[activeTheme] || themes.darkDefault;
    
    // Remove rgb() wrapper for color input (use only the color part)
    colorPickers.forEach((picker) => {
      const colorKey = picker.dataset.color;
      const customColor = customOverrides[colorKey];
      const themeColor = themeColors[colorKey];
      
      if (customColor) {
        picker.value = customColor;
      } else if (themeColor) {
        picker.value = rgbToHex(themeColor);
      }
    });
  });
}

// Apply theme when button clicked
applyBtn.addEventListener('click', () => {
  const selectedTheme = themeSelect.value;
  chrome.storage.sync.set({ activeTheme: selectedTheme }, () => {
    showStatus(`✓ Theme applied: ${selectedTheme}`);
  });
});

// Handle color picker changes
colorPickers.forEach((picker) => {
  picker.addEventListener('change', () => {
    const colorKey = picker.dataset.color;
    const hexColor = picker.value;
    
    // Get current overrides
    chrome.storage.sync.get(['customOverrides'], (data) => {
      const customOverrides = data.customOverrides || {};
      customOverrides[colorKey] = hexColor;
      chrome.storage.sync.set({ customOverrides }, () => {
        showStatus('✓ Color updated');
      });
    });
  });
});

// Reset custom colors
resetColorsBtn.addEventListener('click', () => {
  chrome.storage.sync.set({ customOverrides: {} }, () => {
    loadCurrentSettings();
    showStatus('✓ Reset to theme colors');
  });
});

// Show status message
function showStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add('success');
  setTimeout(() => {
    statusMessage.textContent = '';
    statusMessage.classList.remove('success');
  }, 2000);
}

// Also apply when theme is changed (optional - auto-apply on select)
themeSelect.addEventListener('change', () => {
  applyBtn.click();
  // Reload color pickers with new theme colors
  setTimeout(loadCurrentSettings, 100);
});

// Initialize on popup load
loadCurrentSettings();
