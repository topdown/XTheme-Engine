// Wrap entire script to allow early exit if context is invalidated
(function () {
	'use strict';

	// Early check: If extension context is invalidated, exit silently
	try {
		if (!chrome?.runtime?.id) return;
	} catch {
		// Extension context is invalidated, exit silently
		return;
	}

	// Check if extension context is still valid
	function isContextValid() {
		try {
			// Accessing chrome.runtime.id will throw if context is invalid
			if (!chrome?.runtime?.id) return false;
			return true;
		} catch {
			return false;
		}
	}

	// Inject theme CSS into page
	function injectTheme() {
		if (!isContextValid()) return;

		try {
			chrome.storage.sync.get(['extensionEnabled', 'activeTheme', 'customOverrides'], (data) => {
				try {
					applyThemeData(data || {});
				} catch (err) {
					// Silently fail if context is invalid
				}
			});
		} catch (err) {
			// Context might be invalidated, skip silently
		}
	}

	// Apply theme data to the page
	function applyThemeData(data) {
		const extensionEnabled = data.extensionEnabled !== false;

		if (!extensionEnabled) {
			const existingStyle = document.getElementById('xtheme-inject');
			if (existingStyle) {
				existingStyle.remove();
			}
			return;
		}

		const activeTheme = data.activeTheme || 'darkDefault';
		const customOverrides = data.customOverrides || {};

		const themes = getThemes();
		const theme = themes[activeTheme] || themes.darkDefault;
		const colors = { ...theme.colors, ...customOverrides };

		let existingStyle = document.getElementById('xtheme-inject');
		if (!existingStyle) {
			existingStyle = document.createElement('style');
			existingStyle.id = 'xtheme-inject';
			existingStyle.setAttribute('data-source', 'xtheme-engine');
		}

		const css = buildThemeCSS(colors);
		existingStyle.textContent = css;

		if (!existingStyle.parentElement) {
			if (document.head) {
				document.head.appendChild(existingStyle);
			} else {
				document.addEventListener('readystatechange', () => {
					if (document.head && !existingStyle.parentElement) {
						document.head.appendChild(existingStyle);
					}
				});
			}
		}

		// Style Post buttons after theme is applied
		stylePostButtons();
	}

	// Watch for route changes (React navigation) - only observe when necessary
	let mutationObserver = null;
	let debounceTimer = null;

	function setupMutationObserver() {
		if (mutationObserver) return; // Already set up

		mutationObserver = new MutationObserver(() => {
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				injectTheme();
				stylePostButtons(); // Re-style Post buttons when DOM changes
			}, 100);
		});

		mutationObserver.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});
	}

	function cleanupMutationObserver() {
		if (mutationObserver) {
			mutationObserver.disconnect();
			mutationObserver = null;
		}
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
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
    
    /* Text primary - .css-1jxf684 maps to color text */
    .css-1jxf684 {
      color: ${colors.textPrimary} !important;
    }
    
    /* Accent icons - .r-yyyyoo maps to fill for SVG icons */
    .r-yyyyoo {
      fill: ${colors.accentBlue} !important;
    }
    
    /* Accent blue accent colors */
    a {
      color:  ${colors.accentBlue} !important;
    }

	.r-kemksi {	
    	border-radius: 16px;
	}

	/* Post button specific styles */
	.xtheme-post-button {
		color: ${colors.textPrimary} !important;
		background-color: ${colors.accentBlue} !important;
	}

	.xtheme-post-button span,
	.xtheme-post-button div {
		color: ${colors.textPrimary} !important;
	}

	/* Reply button specific styles */
	.xtheme-reply-button {
		color: ${colors.textPrimary} !important;
		background-color: ${colors.accentBlue} !important;
	}

	.xtheme-reply-button span,
	.xtheme-reply-button div {
		color: ${colors.textPrimary} !important;
	}
  `;
	}

	// Style Post buttons specifically by finding them by text content or aria-label
	function stylePostButtons() {
		if (!isContextValid()) return;

		// Find all buttons and button-like elements (including links)
		const allButtons = document.querySelectorAll('button, div[role="button"], a[role="button"], a[role="link"], a[aria-label="Post"]');
		
		allButtons.forEach(button => {
			// Check if button contains the text "Post" (case-insensitive)
			const buttonText = button.textContent.trim();
			const ariaLabel = button.getAttribute('aria-label');
			
			if (buttonText === 'Post' || buttonText === 'POST' || ariaLabel === 'Post') {
				// Add our custom class for styling
				button.classList.add('xtheme-post-button');
			} else if (buttonText === 'Reply' || buttonText === 'REPLY' || ariaLabel === 'Reply') {
				// Add our custom class for styling Reply buttons
				button.classList.add('xtheme-reply-button');
			}
		});
	}

	// Start injection when DOM is ready or immediately
	// Wrap everything in a try-catch to handle context invalidation gracefully
	(function initXTheme() {
		try {
			// Early exit if chrome APIs are not available
			if (!chrome?.runtime?.id) return;

			// Set up listener ONCE at the top level (only if context is valid)
			if (isContextValid()) {
				try {
					chrome.storage.onChanged.addListener((changes, areaName) => {
						if (!isContextValid()) return;

						try {
							if ((areaName === 'sync' || areaName === 'local') &&
								(changes.extensionEnabled || changes.activeTheme || changes.customOverrides)) {
								injectTheme();
							}
						} catch (err) {
							// Silently ignore errors (context invalidation, etc)
						}
					});
				} catch (err) {
					// Failed to set up listener - context may be invalid
				}
			}

			// Initial injection
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => {
					injectTheme();
					setupMutationObserver();
				});
			} else {
				injectTheme();
				setupMutationObserver();
			}
		} catch (err) {
			// Extension context invalidated or other error - fail silently
		}
	})();

})(); // End of main wrapper IIFE
