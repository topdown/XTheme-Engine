// Background service worker for XTheme Engine

// Initialize default theme on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['activeTheme'], (data) => {
    if (!data.activeTheme) {
      chrome.storage.sync.set({
        activeTheme: 'darkDefault',
        customOverrides: {}
      });
    }
  });
});
