// Background service worker for XTheme Engine

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['extensionEnabled', 'activeTheme'], (data) => {
    if (data.extensionEnabled === undefined || !data.activeTheme) {
      chrome.storage.sync.set({
        extensionEnabled: true,
        activeTheme: 'darkDefault',
        customOverrides: {}
      });
    }
  });
});
