# Vanilla Template

Minimal vanilla JS frontend template. No framework, no build tool — just Live Sass Compiler + Live Server.

## Requirements

- **[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass)** — compiles SCSS to `assets/css/style.min.css` (compressed, autoprefixed)
- **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** — local dev server with auto-reload

## Getting Started

1. Open the folder in VS Code
2. Click **"Watch Sass"** in the status bar
3. Click **"Go Live"** in the status bar

## Project Structure

```
├── assets/
│   ├── css/style.min.css          # Auto-generated — do not edit
│   ├── fonts/fonts.css            # @font-face declarations
│   ├── js/
│   │   ├── libs.js                # Bundled libs (LazyLoad, Lenis)
│   │   └── main.js                # App logic
│   └── scss/
│       ├── style.scss             # Entry point
│       └── imports/
│           ├── core/              # variables, mixins, reset, layouts, ...
│           └── pages/             # Per-page styles
├── .vscode/settings.json          # Live Sass config
├── index.html
└── @common.js                     # Dev snippets
```

## SCSS

Edit files inside `assets/scss/imports/`. Never touch `style.min.css` directly.

**Available mixins:** `mid`, `midimg`, `dominantColor`, `text`, `overtext`, `customscroll`, `maxW`, `minW`

**CSS variables** (defined in `_variables.scss`): `--main-bg-cl`, `--main-text-cl`, `--main-fonts`, `--app-height`, `--menu-height`

## JavaScript

| Feature | Notes |
|---|---|
| Smooth scroll | Lenis, duration 1.2s |
| Lazy load | Add class `lazy` + use `data-src` instead of `src` |
| Page transition | Fade in/out on navigation, handled automatically |
| Mobile height fix | `--app-height` / `--menu-height` corrected on resize |

Mobile breakpoint: `1024px`

## Adding a New Page

1. Create `page-name.html`
2. Create `assets/scss/imports/pages/_page-name.scss`
3. Import it in `style.scss`
