Perfect.
We’ll treat this like a real product — not just a hacky CSS injector.

Below is a clean, structured project-spec.md you can drop into the repo and build from.

⸻

XTheme Engine

Custom Twitter/X Interface Customization Extension

⸻

1. Overview

XTheme Engine is a Chrome Extension (Manifest v3) that restores advanced theme customization to Twitter/X by overriding CSS variables and selectively adjusting UI elements.

The extension allows users to:
	•	Customize background colors (light / dark / custom)
	•	Override accent colors
	•	Adjust typography
	•	Enable minimal / distraction-free mode
	•	Apply curated theme packs
	•	Persist preferences across sessions

This project is designed to be:
	•	Stable against DOM churn
	•	Lightweight
	•	Cleanly architected
	•	Extensible for future UI tweaks

⸻

2. Goals

Primary Goals
	•	Override Twitter/X color system using CSS variables
	•	Avoid reliance on unstable class names
	•	Persist theme preferences
	•	Support route changes in React SPA environment

Secondary Goals
	•	Provide prebuilt theme packs
	•	Allow custom hex/RGB entry
	•	Minimal UI control panel
	•	Optional UI cleanup features

⸻

3. Non-Goals (Phase 1)
	•	DOM restructuring
	•	API modification
	•	Ad removal (risky)
	•	Data scraping
	•	Behavior modification

⸻

4. Architecture

4.1 Extension Structure

x-theme-engine/
│
├── manifest.json
├── background.js
├── content/
│   ├── inject.js
│   ├── observer.js
│   └── themes.js
│
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
├── styles/
│   └── base.css
│
└── utils/
    └── storage.js


⸻

5. Technical Strategy

5.1 Target Strategy

We will prioritize:
	1.	CSS variable overrides (preferred)
	2.	Data attributes (if stable)
	3.	Structural selectors
	4.	MutationObserver fallback

We will avoid:
	•	Obfuscated class selectors
	•	Deep DOM traversal
	•	Inline style mutation (unless required)

⸻

6. Twitter/X Theme Surface Mapping (To Be Filled)

You will extract:
	•	Root CSS variables
	•	Stable attributes
	•	Key layout containers
	•	Color token definitions

We will document them here:

6.1 Root Variables (Example)

--twitter-blue
--color-background-primary
--color-background-secondary
--color-text-primary
--color-text-secondary
--color-border-default
--color-hover

(Add real variables after extraction.)

⸻

6.2 Major Layout Containers

Area	Selector	Notes
Timeline	TBD	
Sidebar	TBD	
Tweet Card	TBD	
Navigation	TBD	
Buttons	TBD	


⸻

7. Theme Engine Design

7.1 Theme Object Structure

Themes will be defined in themes.js:

export const themes = {
  midnightBlue: {
    name: "Midnight Blue",
    variables: {
      "--color-background-primary": "#0f172a",
      "--color-background-secondary": "#1e293b",
      "--color-text-primary": "#f1f5f9",
      "--twitter-blue": "#3b82f6"
    }
  }
}


⸻

7.2 Application Logic

Flow:
	1.	Load saved theme from chrome.storage
	2.	Apply CSS variables to document.documentElement
	3.	Observe DOM changes
	4.	Reapply theme if necessary

⸻

8. UI Customization Modules

Each module will be independently toggleable.

8.1 Color Module
	•	Accent color override
	•	Background override
	•	Text color override

8.2 Typography Module (Phase 2)
	•	Font family override
	•	Font weight adjustments

8.3 Layout Module (Phase 2)
	•	Reduce border radius
	•	Increase spacing
	•	Minimal mode

8.4 Clean Mode (Optional)
	•	Hide “For You”
	•	Reduce sidebar clutter
	•	Hide promoted labels

⸻

9. Persistence Strategy

Use:

chrome.storage.sync

Stored structure:

{
  "activeTheme": "midnightBlue",
  "customOverrides": {},
  "modules": {
    "minimalMode": true
  }
}


⸻

10. Mutation Handling

Twitter/X is a React SPA.

We will:
	•	Use a lightweight MutationObserver
	•	Detect route changes
	•	Reapply theme safely

Avoid performance-heavy observers.

⸻

11. Performance Considerations
	•	Apply CSS variables only once
	•	Avoid repeated DOM writes
	•	Debounce observer triggers
	•	Avoid style recalculation loops

⸻

12. Security & Compliance
	•	No API interception
	•	No tracking
	•	No user data storage outside browser
	•	No external servers (Phase 1)

⸻

13. Future Expansion
	•	Theme marketplace
	•	Export/import theme JSON
	•	Shareable theme codes
	•	Firefox support
	•	AI-generated themes
	•	Per-user schedule themes (dark at night)

⸻

14. Development Phases

Phase 1 – Core Engine
	•	Manifest v3
	•	Variable injection
	•	Popup theme selector
	•	Persistence

Phase 2 – Advanced Overrides
	•	Custom hex input
	•	Typography override
	•	Minimal mode

Phase 3 – Power User
	•	Modular feature toggles
	•	JSON import/export
	•	Performance optimization

⸻

15. Open Questions
	•	How stable are root CSS variables?
	•	Are there stable data attributes we can rely on?
	•	Does X dynamically reassign variables per theme?
	•	Does route change require reapplication?

