# XTheme Engine

A lightweight Chrome Extension that lets you customize Twitter/X interface colors with ease. Override inline styles and generated CSS classes to apply your own color themes.

## Features

- **6 Prebuilt Themes**: Dark Default, Midnight Blue, Deep Purple, Ocean Cyan, Amber Fire, and Monochrome
- **Custom Color Pickers**: Fine-tune any color (background, borders, text, accents) with an intuitive color picker
- **Persistent Settings**: All customizations sync across your devices via Chrome Storage
- **Instant Application**: Changes apply immediately without page refresh
- **Live Sync**: Theme changes from the popup instantly reflect on the page
- **Lightweight**: No dependencies, minimal overhead

## Installation

### From Chrome Web Store (Coming Soon)
Once published, you can install directly from the Chrome Web Store.

### Manual Installation (Development)

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/yourusername/xtheme-engine.git
   cd xtheme-engine
   ```

2. **Open Chrome Extensions**:
   - Go to `chrome://extensions/` in your browser
   - Enable **Developer Mode** (toggle in the top-right corner)

3. **Load the extension**:
   - Click **"Load unpacked"**
   - Navigate to the `xtheme-engine` folder and select it

4. **Start using it**:
   - Click the **XTheme Engine** icon in your Chrome toolbar
   - Select a theme or customize individual colors
   - Enjoy your personalized Twitter/X experience!

## Usage

### Quick Start
1. Open the extension popup (click the XTheme Engine icon)
2. Select a prebuilt theme from the dropdown
3. Click **"Apply Theme"** or let it apply automatically
4. Colors update on x.com instantly

### Custom Colors
1. Navigate to the **"Custom Colors"** section
2. Use the color pickers to adjust:
   - **Background**: Page background color
   - **Card Background**: Section/card backgrounds
   - **Border Color**: Borders and dividers
   - **Text Primary**: Primary text color
   - **Accent Color**: Links and highlights

3. **Reset to Theme**: Click to clear all custom overrides and return to the active theme

## How It Works

XTheme Engine injects CSS overrides into Twitter/X that target:
- The `<body>` inline style (background color)
- Generated CSS classes (`.r-kemksi`, `.r-5zmot`, `.r-1kqtdi0`, etc.)
- Uses `!important` to override X's inline styles

Settings are stored in `chrome.storage.sync`, which means:
- Changes persist across sessions
- Settings sync across all your devices (when logged into Chrome)
- Real-time updates when switching themes in the popup

## Project Structure

```
xtheme-engine/
├── manifest.json           # Chrome Extension manifest (v3)
├── background.js           # Service worker for initialization
├── content/
│   └── inject.js          # Injects and manages theme CSS
├── popup/
│   ├── popup.html         # Theme selector UI
│   ├── popup.js           # Popup logic and color picker handling
│   └── popup.css          # Popup styling
├── README.md              # This file
└── project-spec.md        # Original project specification
```

## Configuration

### Available Color Keys
Each theme or custom override uses these color keys:
- `bodyBg`: Page background
- `cardBg`: Card/section backgrounds
- `overlayBg`: Overlay/modal backgrounds
- `borderColor`: Border and divider colors
- `textPrimary`: Primary text color
- `accentBlue`: Accent color (links, buttons)

### Chrome Storage Schema
```javascript
{
  "activeTheme": "darkDefault",  // Current theme name
  "customOverrides": {           // Custom color overrides (hex)
    "bodyBg": "#0f172a",
    "cardBg": "#1e293b"
    // ... etc
  }
}
```

## Known Limitations

⚠️ **Class Name Stability**: X uses obfuscated CSS class names (e.g., `.r-kemksi`). While we've identified the main color-related classes, X may change these class names during their update cycles. If this happens, the extension may stop working until class names are remapped.

The extension will be monitored for X updates and maintained accordingly.

## Future Enhancements

- [ ] Dynamic CSS class detection (automatic fallback if X changes class names)
- [ ] Theme import/export (JSON)
- [ ] Additional appearance options (typography, spacing, border-radius)
- [ ] Firefox support
- [ ] Theme marketplace/sharing
- [ ] Time-based theme switching (dark at night, light during day)

## Development

### Adding a New Theme

Edit [content/inject.js](content/inject.js) and [popup/popup.js](popup/popup.js):

1. Add theme to `getThemes()` in `inject.js`:
   ```javascript
   newTheme: {
     name: 'New Theme',
     colors: {
       bodyBg: 'rgb(r, g, b)',
       cardBg: 'rgb(r, g, b)',
       overlayBg: 'rgb(r, g, b / alpha%)',
       borderColor: 'rgb(r, g, b)',
       textPrimary: 'rgb(r, g, b)',
       accentBlue: 'rgb(r, g, b)'
     }
   }
   ```

2. Add theme object to the `themes` constant in `popup.js`

3. Add `<option>` to the select in `popup.html`:
   ```html
   <option value="newTheme">New Theme</option>
   ```

### Adding a New CSS Class Override

If you discover a new X CSS class that should be themed:

1. Edit the `buildThemeCSS()` function in [content/inject.js](content/inject.js)
2. Add a new rule:
   ```javascript
   .your-class-name {
     property: ${colors.colorKey} !important;
   }
   ```

## Contributing

Contributions are welcome! Here's how to help:

1. **Report Issues**: Found a broken class name or theme? Open an issue.
2. **Suggest Themes**: Have a cool color palette? Submit it as an issue or PR.
3. **Code Improvements**: Fork, improve, and submit a pull request.
4. **Testing**: Test on different X pages/devices and report findings.

## License

MIT License – See LICENSE file for details.

## Disclaimer

This extension is not affiliated with Twitter/X. It's a community project to enhance user experience. Use at your own risk. Keep in mind that X's UI changes may temporarily break the extension until class names are updated.

## Support

- Found a bug? [Open an issue](https://github.com/yourusername/xtheme-engine/issues)
- Have a feature request? [Let us know](https://github.com/yourusername/xtheme-engine/discussions)

---

Enjoy your customized Twitter/X experience!