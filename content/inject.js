// Inject theme CSS into page
function injectTheme() {
  // Create style element
  const styleElement = document.createElement('style');
  styleElement.id = 'xtheme-inject';
  styleElement.setAttribute('data-source', 'xtheme-engine');

  // Load theme from storage
  chrome.storage.sync.get(['activeTheme', 'customOverrides'], (data) => {
    const activeTheme = data.activeTheme || 'darkDefault';
    const customOverrides = data.customOverrides || {};

    // Import themes
    const themes = getThemes();
    const theme = themes[activeTheme] || themes.darkDefault;

    // Merge with custom overrides
    const colors = { ...theme.colors, ...customOverrides };

    // Build CSS
    let css = buildThemeCSS(colors);
    styleElement.textContent = css;

    // Inject into head
    if (document.head) {
      document.head.appendChild(styleElement);
    } else {
      // If head isn't ready, wait and retry
      document.addEventListener('readystatechange', () => {
        if (document.head && !styleElement.parentElement) {
          document.head.appendChild(styleElement);
        }
      });
    }
  });

  // Listen for storage changes (theme switched in popup)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && (changes.activeTheme || changes.customOverrides)) {
      const existingStyle = document.getElementById('xtheme-inject');
      if (existingStyle) {
        existingStyle.remove();
      }
      injectTheme();
    }
  });
}

// Get all theme definitions
function getThemes() {
  return {
    darkDefault: {
      name: 'Dark Default',
      colors: {
        bodyBg: 'rgb(15, 23, 42)',
        cardBg: 'rgb(30, 41, 59)',
        overlayBg: 'rgb(18, 27, 35 / 65%)',
        borderColor: 'rgb(51, 65, 85)',
        textPrimary: 'rgb(241, 245, 249)',
        accentBlue: 'rgb(59, 130, 246)'
      }
    },
    midnightBlue: {
      name: 'Midnight Blue',
      colors: {
        bodyBg: 'rgb(10, 20, 40)',
        cardBg: 'rgb(20, 35, 50)',
        overlayBg: 'rgb(10, 15, 25 / 70%)',
        borderColor: 'rgb(40, 60, 100)',
        textPrimary: 'rgb(200, 220, 255)',
        accentBlue: 'rgb(100, 150, 255)'
      }
    },
    deepPurple: {
      name: 'Deep Purple',
      colors: {
        bodyBg: 'rgb(25, 15, 40)',
        cardBg: 'rgb(40, 25, 60)',
        overlayBg: 'rgb(20, 10, 35 / 70%)',
        borderColor: 'rgb(60, 40, 100)',
        textPrimary: 'rgb(230, 200, 255)',
        accentBlue: 'rgb(180, 100, 255)'
      }
    },
    oceanCyan: {
      name: 'Ocean Cyan',
      colors: {
        bodyBg: 'rgb(8, 30, 45)',
        cardBg: 'rgb(15, 50, 75)',
        overlayBg: 'rgb(10, 35, 55 / 70%)',
        borderColor: 'rgb(30, 80, 120)',
        textPrimary: 'rgb(180, 240, 255)',
        accentBlue: 'rgb(0, 200, 255)'
      }
    },
    amberfireSoft: {
      name: 'Amber Fire',
      colors: {
        bodyBg: 'rgb(45, 30, 15)',
        cardBg: 'rgb(65, 45, 25)',
        overlayBg: 'rgb(50, 35, 20 / 70%)',
        borderColor: 'rgb(100, 75, 40)',
        textPrimary: 'rgb(255, 235, 180)',
        accentBlue: 'rgb(255, 165, 0)'
      }
    },
    monochrome: {
      name: 'Monochrome',
      colors: {
        bodyBg: 'rgb(20, 20, 20)',
        cardBg: 'rgb(35, 35, 35)',
        overlayBg: 'rgb(25, 25, 25 / 70%)',
        borderColor: 'rgb(60, 60, 60)',
        textPrimary: 'rgb(220, 220, 220)',
        accentBlue: 'rgb(180, 180, 180)'
      }
    }
  };
}

// Build CSS overrides from theme colors
function buildThemeCSS(colors) {
  return `
    /* XTheme Engine - Color Overrides */
    
    /* Body background (inline style override) */
    body {
      background-color: ${colors.bodyBg} !important;
    }
    
    /* Card/section backgrounds - .r-kemksi maps to background-color rgb(20 35 50) */
    .r-kemksi {
      background-color: ${colors.cardBg} !important;
    }
    
    /* Overlay backgrounds (modals, tooltips) - .r-5zmot maps to rgb(18 27 35 / 65%) */
    .r-5zmot {
      background-color: ${colors.overlayBg} !important;
    }
    
    /* Border colors - .r-1kqtdi0 maps to border-color rgb(47, 51, 54) */
    .r-1kqtdi0 {
      border-color: ${colors.borderColor} !important;
    }
    
    /* Accent blue accent colors */
    a, button {
      color: ${colors.accentBlue} !important;
    }

	.r-kemksi {	
    	border-radius: 16px;
	}
  `;
}

// Start injection when DOM is ready or immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectTheme);
} else {
  injectTheme();
}
