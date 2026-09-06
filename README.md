# Vanilla Design System

A lightweight, accessible, vanilla JavaScript Web Components design system built with **Material Design 3** principles and modern web standards.

> **Built on [Material Design 3](https://m3.material.io)** - Google's latest design system featuring dynamic color, enhanced accessibility, and modern interaction patterns.

## 📚 Documentation

- **[Component Reference](./docs/README.md)** - Complete component library guide
- **[Documentation Standard](./docs/DOCUMENTATION_STANDARD.md)** - Writing and structure guidelines
- **[Component Plan](./docs/md3-component-plan.md)** - Implementation status and roadmap
- **[MD3 Token Reference](./docs/tokens.md)** - Complete MD3 token library and usage patterns
- **[Token Architecture Roadmap](./docs/notes/md3-tokens-architecture-roadmap.md)** - Token system design, modes, and tooling plan
- **[Utilities](./src/utils/README.md)** - Animation, drag-drop, elevation, focus-ring utilities

## 🎯 Features

- ✅ **Material Design 3** - Complete MD3 token system with semantic color roles, typography scale, and motion guidelines
- ✅ **Zero Dependencies** - Pure vanilla JavaScript, no framework required
- ✅ **Web Components** - Standard Custom Elements with Shadow DOM encapsulation
- ✅ **Design Tokens** - 250+ MD3 tokens via CSS Custom Properties for consistent theming
- ✅ **Material Symbols** - Access to 2,500+ icons with variable font features (weight, grade, fill, optical size)
- ✅ **Accessibility First** - WCAG 2.1 AA compliant with full keyboard support and MD3 accessibility patterns
- ✅ **Tree-Shakeable** - Import only what you need
- ✅ **TypeScript Ready** - JSDoc types for excellent IDE support
- ✅ **Multi-Browser** - Tested on Chromium, Firefox, and Webkit
- ✅ **Small Footprint** - ~11 KB total (~3.5 KB gzipped)
- ✅ **Dynamic Theming** - Light, dark, and high-contrast modes with MD3 tonal palettes
- ✅ **Responsive Images** - Built-in lazy loading, aspect ratio preservation, and error handling

## 📦 Installation

### Option 1: NPM Package (when published)

```bash
npm install castrovalva
```

### Option 2: Copy Built Files

Copy the `dist/` folder from this repository to your project.

### Option 3: Use from CDN (when deployed)

```html
<script
  type="module"
  src="https://cdn.example.com/design-system/index.js"></script>
```

## 🚀 Quick Start

### Import Everything

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- Import design tokens and base styles -->
    <link rel="stylesheet" href="./dist/tokens/tokens.css" />
    <link rel="stylesheet" href="./dist/styles/reset.css" />
    <link rel="stylesheet" href="./dist/styles/base.css" />
    <link rel="stylesheet" href="./dist/styles/utilities.css" />
  </head>
  <body>
    <div class="container">
      <h1>Welcome</h1>

      <!-- Use components -->
      <ds-button variant="primary">
        <ds-icon slot="icon-left" name="check"></ds-icon>
        Get Started
      </ds-button>
    </div>

    <!-- Import components -->
    <script type="module" src="./dist/index.js"></script>
  </body>
</html>
```

### Import Individual Components (Tree-Shaking)

```javascript
// Import only what you need
import DSButton from "./dist/button.js";
import DSIcon from "./dist/icon.js";

// Components are auto-registered
// Or register manually:
customElements.define("ds-button", DSButton);
```

## 📚 Components

### Recent Additions & Updates

- **Responsive Image (`ds-responsive-image`)** — High-performance image component with lazy loading via IntersectionObserver, aspect ratio preservation, object-fit modes (cover, contain, fill, scale-down), picture element support for art direction, error handling with visual feedback, and loading animations. Fully tested with 44 unit tests (92.21% coverage). See [docs/components/responsive-image.html](./docs/components/responsive-image.html).
- **Advanced Menus (`ds-advanced-menu`)** — Mega and cascading menus with hover intent, keyboard navigation, fixed-position collision handling, and outside-click/escape close. See [docs/components/advanced-menu.html](./docs/components/advanced-menu.html).
- **Virtual Scroll (`ds-virtual-scroll`)** — High-performance list virtualization with top/bottom spacers, keyboard navigation, and programmatic `scrollToIndex()`/`focusItem()`. Emits `scroll-change` with `{ startIdx, endIdx, scrollTop, visibleCount (buffered), viewportCount, totalCount }`. See [docs/components/virtual-scroll.html](./docs/components/virtual-scroll.html).
- **Animation Presets** — 31 animation presets (fade, slide, scale, bounce, flip, rotate, shake, pulse, glow) with Material Design 3 motion tokens and customizable duration/easing. See [docs/components/animation-presets.html](./docs/components/animation-presets.html).
- **Theme System** — Automatic light/dark theme detection with localStorage persistence and smooth transitions. All 52 demo pages now include proper theme initialization.

### Button (`<ds-button>`)

MD3-compliant button component with 5 variants following Material Design 3 emphasis hierarchy.

```html
<!-- MD3 Variants -->
<ds-button variant="filled">High emphasis</ds-button>
<ds-button variant="filled-tonal">Medium emphasis</ds-button>
<ds-button variant="outlined">Medium emphasis</ds-button>
<ds-button variant="elevated">Medium emphasis</ds-button>
<ds-button variant="text">Low emphasis</ds-button>

<!-- Sizes -->
<ds-button size="small">Small</ds-button>
<ds-button size="medium">Medium</ds-button>
<ds-button size="large">Large</ds-button>

<!-- States -->
<ds-button disabled>Disabled</ds-button>

<!-- With icons (Material Symbols) -->
<ds-button variant="filled">
  <ds-icon slot="icon-left" name="save"></ds-icon>
  Save Changes
</ds-button>
```

> **MD3 Spec:** [Material Design Buttons](https://m3.material.io/components/buttons)

**[Full Button Documentation](./docs/components/button.html)**

### Icon (`<ds-icon>`)

Material Symbols icon component with 2,500+ icons and variable font features.

```html
<!-- Basic usage -->
<ds-icon name="check"></ds-icon>

<!-- Variants (outlined, filled, rounded, sharp) -->
<ds-icon name="star" variant="outlined"></ds-icon>
<ds-icon name="star" variant="filled"></ds-icon>
<ds-icon name="star" variant="rounded"></ds-icon>
<ds-icon name="star" variant="sharp"></ds-icon>

<!-- Sizes -->
<ds-icon name="settings" size="small"></ds-icon>
<!-- 20px -->
<ds-icon name="settings" size="medium"></ds-icon>
<!-- 24px -->
<ds-icon name="settings" size="large"></ds-icon>
<!-- 40px -->
<ds-icon name="settings" size="xlarge"></ds-icon>
<!-- 48px -->

<!-- Variable font features -->
<ds-icon name="favorite" weight="300"></ds-icon>
<!-- Light -->
<ds-icon name="favorite" grade="200"></ds-icon>
<!-- High emphasis -->
<ds-icon name="favorite" fill="1"></ds-icon>
<!-- Filled -->
<ds-icon name="favorite" optical-size="48"></ds-icon>
<!-- Optical sizing -->

<!-- Accessibility -->
<ds-icon name="close" label="Close dialog"></ds-icon>
```

> **MD3 Spec:** [Material Symbols](https://fonts.google.com/icons)

**[Full Icon Documentation](./docs/components/icon.html)**

**Available Icons:** 2,500+ Material Symbols including home, settings, search, favorite, delete, add, close, check, arrow_forward, menu, person, notifications, calendar_today, and many more. [Browse all icons](https://fonts.google.com/icons)

## 🎨 Material Design 3 Tokens

The system uses 250+ MD3 tokens via CSS Custom Properties for comprehensive theming:

### Color System (78 tonal palette + 40 semantic roles)

```css
/* Primary tonal palette */
--md-ref-palette-primary0 through --md-ref-palette-primary100

/* Semantic color roles */
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container
--md-sys-color-secondary
--md-sys-color-tertiary
--md-sys-color-error
--md-sys-color-surface
--md-sys-color-surface-variant
--md-sys-color-outline
/* + 30 more semantic roles */
```

### Typography Scale (15 type styles)

```css
/* Display - Large expressive text */
--md-sys-typescale-display-large-size      /* 57px */
--md-sys-typescale-display-medium-size     /* 45px */
--md-sys-typescale-display-small-size      /* 36px */

/* Headline - High-emphasis text */
--md-sys-typescale-headline-large-size     /* 32px */
--md-sys-typescale-headline-medium-size    /* 28px */
--md-sys-typescale-headline-small-size     /* 24px */

/* Title - Medium-emphasis text */
--md-sys-typescale-title-large-size        /* 22px */
--md-sys-typescale-title-medium-size       /* 16px */
--md-sys-typescale-title-small-size        /* 14px */

/* Body - Main content */
--md-sys-typescale-body-large-size         /* 16px */
--md-sys-typescale-body-medium-size        /* 14px */
--md-sys-typescale-body-small-size         /* 12px */

/* Label - UI text */
--md-sys-typescale-label-large-size        /* 14px */
--md-sys-typescale-label-medium-size       /* 12px */
--md-sys-typescale-label-small-size        /* 11px */
```

### Elevation System (6 levels)

```css
--md-sys-elevation-level0  /* No shadow */
--md-sys-elevation-level1  /* 1dp elevation */
--md-sys-elevation-level2  /* 3dp elevation */
--md-sys-elevation-level3  /* 6dp elevation */
--md-sys-elevation-level4  /* 8dp elevation */
--md-sys-elevation-level5  /* 12dp elevation */
```

### Motion System (16 durations + 4 easing curves)

```css
/* Duration tokens */
--md-sys-motion-duration-short1    /* 50ms - Icon transforms */
--md-sys-motion-duration-short2    /* 100ms - Small UI changes */
--md-sys-motion-duration-medium1   /* 250ms - Dialogs enter */
--md-sys-motion-duration-long1     /* 450ms - Large dialogs */
/* + 12 more duration tokens */

/* Easing curves */
--md-sys-motion-easing-standard               /* General transitions */
--md-sys-motion-easing-emphasized             /* Important transitions */
--md-sys-motion-easing-emphasized-decelerate  /* Entering elements */
--md-sys-motion-easing-emphasized-accelerate  /* Exiting elements */
```

### State Layers

```css
--md-sys-state-hover-opacity    /* 0.08 */
--md-sys-state-focus-opacity    /* 0.12 */
--md-sys-state-pressed-opacity  /* 0.12 */
--md-sys-state-dragged-opacity  /* 0.16 */
```

> **Learn More:** [Material Design 3 Tokens](https://m3.material.io/foundations/design-tokens/overview)

### Theme Switching

```html
<!-- Set theme via data attribute -->
<html data-theme="dark">
  <script>
    // Toggle theme
    function setTheme(theme) {
      if (theme === "light") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
      localStorage.setItem("theme", theme);
    }

    // Options: 'light', 'dark', 'high-contrast'
    setTheme("dark");
  </script>
</html>
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check accessibility
npm run test:a11y

# Lint code
npm run lint
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
sandbox-v2/
├── src/
│   ├── components/       # Web Components
│   │   ├── button/
│   │   │   └── button.js
│   │   └── icon/
│   │       └── icon.js
│   ├── tokens/          # Design tokens (CSS)
│   │   └── tokens.css
│   ├── styles/          # Base styles
│   │   ├── reset.css
│   │   ├── base.css
│   │   └── utilities.css
│   ├── assets/
│   │   └── icons/       # SVG sprite
│   └── index.js         # Main entry
├── test/
│   ├── unit/            # Component tests
│   └── accessibility/   # A11y tests
├── docs/
│   └── components/      # Component documentation
├── dist/                # Production build
└── index.html          # Development playground
```

## 📖 Documentation

### Getting Started

- [Getting Started Guide](./GETTING-STARTED.md) - Setup and development workflow

### Component Documentation

- [Button Component](./docs/components/button.html) - MD3 button variants
- [Icon Component](./docs/components/icon.html) - Material Symbols implementation
- [State Layers](./docs/state-layers.md) - Interaction states and ripples
- [Motion System](./docs/motion.md) - Animation and transitions

### Token Reference

- [MD3 Token Reference](./docs/tokens.md) - Complete token documentation (250+ tokens)

### Architecture

- [Design System Plan](./copilot-plan.yaml) - Architecture and roadmap

## 🧪 Testing

Test suite runs on Chromium, Firefox, and Webkit using @web/test-runner.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Accessibility tests
npm run test:a11y
```

**Current Coverage:** 97.41%

- 60 tests passing
- All components tested
- Cross-browser compatible

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- ✅ Keyboard navigation support
- ✅ Proper ARIA attributes
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Color contrast compliant
- ✅ Reduced motion support

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires Web Components support (Custom Elements v1, Shadow DOM v1).

## 📦 Bundle Size

| File      | Size         | Gzipped     |
| --------- | ------------ | ----------- |
| index.js  | 0.35 KB      | 0.21 KB     |
| button.js | 6.89 KB      | 1.95 KB     |
| icon.js   | 3.62 KB      | 1.36 KB     |
| **Total** | **10.86 KB** | **~3.5 KB** |

## 📚 Material Design 3 Resources

### Official Documentation

- **[Material Design 3](https://m3.material.io)** - Complete MD3 design system documentation
- **[Foundations](https://m3.material.io/foundations)** - Design tokens, color, typography, elevation
- **[Components](https://m3.material.io/components)** - Component specifications and guidelines
- **[Styles](https://m3.material.io/styles)** - Color, typography, elevation, shape, motion

### Tools & Assets

- **[Material Symbols](https://fonts.google.com/icons)** - Browse 2,500+ icons with live preview
- **[Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)** - Generate custom color schemes
- **[Color Palette Generator](https://m3.material.io/styles/color/dynamic-color/overview)** - Create dynamic color palettes
- **[Figma Design Kit](https://www.figma.com/community/file/1035203688168086460)** - Official MD3 Figma components

### Design Token Reference

- **[Design Tokens Overview](https://m3.material.io/foundations/design-tokens/overview)** - Understanding MD3 tokens
- **[Color Tokens](https://m3.material.io/styles/color/system/overview)** - Semantic color roles
- **[Typography Tokens](https://m3.material.io/styles/typography/type-scale-tokens)** - Type scale and tokens
- **[Motion Tokens](https://m3.material.io/styles/motion/overview)** - Duration and easing guidelines

## 🎯 Roadmap

See **[docs/ROADMAP.md](./docs/ROADMAP.md)** for the current 12-month direction (September 2026 – August 2027), including quarterly themes and explicit non-goals.

For detailed implementation status — which components exist and what shipped when — see **[docs/md3-component-plan.md](./docs/md3-component-plan.md)**.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Check linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use ES modules
- Follow JSDoc conventions
- Write accessible code
- Include tests for new features
- Update documentation

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 👥 Authors

Created as part of the Castrovalva project.

## 🙏 Acknowledgments

- **[Material Design 3](https://m3.material.io)** - Design system foundation by Google
- **[Material Symbols](https://fonts.google.com/icons)** - Icon system by Google Fonts
- Built with Web Components standards
- Testing powered by @web/test-runner and @open-wc
- Built with Vite

## 📞 Support

- **Documentation:** [/docs](./docs)
- **Issues:** [GitHub Issues](https://github.com/yourorg/design-system/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourorg/design-system/discussions)

---

**Built with ❤️ using vanilla JavaScript and Web Components**
