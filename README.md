# Castrovalva Design System

[![CI](https://github.com/carlosterly/castrovalva-css/actions/workflows/ci.yml/badge.svg)](https://github.com/carlosterly/castrovalva-css/actions/workflows/ci.yml)

Material Design 3 implemented as vanilla Web Components. Zero runtime
dependencies, Shadow DOM encapsulation, and a complete MD3 token system.

**43 components** · **~2,060 tests** · **~92% coverage** · **~11 KB total (~3.5 KB gzipped)**

---

## Features

- **Material Design 3** — complete token system: semantic colour roles, type scale, motion, elevation, state layers
- **Zero dependencies** — pure vanilla JavaScript, no framework required
- **Standard Web Components** — Custom Elements v1 with Shadow DOM
- **250+ design tokens** — CSS custom properties throughout, themeable at runtime
- **2,500+ icons** — Material Symbols with variable font axes (weight, grade, fill, optical size)
- **Accessible** — WCAG 2.1 AA, full keyboard support, managed focus
- **Tree-shakeable** — import only the components you use
- **Light, dark and dynamic themes** — MD3 tonal palettes with persistence
- **Cross-browser** — tested on Chromium, Firefox and WebKit

## Quick start

```bash
npm install                 # install dependencies
npx playwright install      # one-time: download test browsers
npm run dev                 # dev server on http://localhost:3000
```

The dev server opens the component index. Individual demo pages are at
`http://localhost:3000/docs/components/{name}.html` — for example
[`/docs/components/button.html`](docs/components/button.html). Demo pages import
from `src/` directly, so edits hot-reload without a build.

### Everyday commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR, port 3000 |
| `npm test` | All tests, Chromium only |
| `npm test test/button.test.js` | One component — the fast dev loop |
| `npm run test:all` | All tests across Chromium, Firefox and WebKit |
| `npm run test:a11y` | Accessibility pass (axe + Playwright) |
| `npm run lint` | ESLint |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build on port 8080 |

## Usage

```javascript
// Everything
import "castrovalva";

// Or individual components, for tree-shaking
import "castrovalva/button";
import "castrovalva/icon";
```

```html
<link rel="stylesheet" href="dist/design-system.css" />

<ds-button variant="filled">Save</ds-button>
<ds-icon name="check"></ds-icon>
```

### Theming

Themes are driven entirely by CSS custom properties. Switch by setting
`data-theme` on the root element:

```javascript
document.documentElement.setAttribute("data-theme", "dark");
```

Token reference: [docs/tokens.md](docs/tokens.md) ·
[docs/motion.md](docs/motion.md) · [docs/state-layers.md](docs/state-layers.md)

## Project structure

```
src/
├── components/{name}/{name}.js   Web Components
├── tokens/tokens.css             250+ MD3 design tokens
├── styles/                       reset, base, utilities
├── assets/icons/                 SVG sprite
└── index.js                      main entry
test/                             unit + accessibility tests
docs/
├── components/{name}.html        live component documentation
├── shared/                       pattern library CSS + theme init
└── ROADMAP.md                    direction and non-goals
index.html                        component index / playground
```

## Documentation

| Where | What |
| --- | --- |
| `docs/components/{name}.html` | Live, interactive documentation for every component — the authoritative API reference |
| [CLAUDE.md](CLAUDE.md) | Build conventions: component patterns, demo page rules, testing standards |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Where the project is heading, and what it is deliberately not doing |

## Browser support

Chrome/Edge 90+ · Firefox 88+ · Safari 14+ · Opera 76+

Requires Custom Elements v1 and Shadow DOM v1.

## Accessibility

Every component targets WCAG 2.1 AA: semantic HTML, correct ARIA roles and
labels, full keyboard navigation, managed focus with visible indicators, screen
reader announcements, and disabled states that genuinely prevent interaction.

Verify with `npm run test:a11y`.

## Contributing

See [CLAUDE.md](CLAUDE.md) for component patterns, demo page requirements and
testing standards. In short: three deliverables per component (source, tests,
demo page), `npm run lint` must exit 0, and `npm test` must pass.

## License

MIT © Carl Osterly

Material Design 3 is a design system by Google. This is an independent
implementation and is not affiliated with or endorsed by Google.
