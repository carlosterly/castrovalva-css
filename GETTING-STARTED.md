# Getting Started with Vanilla Design System

This guide walks you through setting up and building your vanilla Web Components design system based on **Material Design 3** principles.

> **Built with [Material Design 3](https://m3.material.io)** - Google's latest open-source design system

## Prerequisites

- Node.js 20+ installed
- PowerShell (Windows) or terminal access
- Code editor (VS Code recommended)
- Git (optional but recommended)

---

## Phase 1: Project Initialization (Day 1)

### Step 1: Create Project Structure

```powershell
# Navigate to project directory
cd c:\Work\Sites\castrovalva-css

# Initialize npm project
npm init -y

# Create complete folder structure
New-Item -ItemType Directory -Force -Path `
  src\tokens, `
  src\styles, `
  src\components\button, `
  src\components\icon, `
  src\components\input, `
  src\components\card, `
  src\components\modal, `
  src\assets\icons, `
  src\utils, `
  test\unit, `
  test\accessibility, `
  test\visual, `
  docs\components, `
  docs\usage, `
  build
```

### Step 2: Install Dependencies

```powershell
# Install Vite and build tools
npm install --save-dev vite@^5.0.0 terser@^5.24.0

# Install testing framework
npm install --save-dev `
  @web/test-runner@^0.18.0 `
  @web/test-runner-playwright@^0.11.0 `
  @open-wc/testing@^4.0.0

# Install accessibility testing
npm install --save-dev `
  @axe-core/playwright@^4.8.2 `
  playwright@^1.40.0

# Install linting
npm install --save-dev `
  eslint@^8.55.0 `
  eslint-plugin-wc@^2.0.4

# Install Playwright browsers
npx playwright install
```

### Step 3: Update package.json

Edit your `package.json` and add/update these fields:

```json
{
  "name": "castrovalva",
  "version": "0.1.0",
  "type": "module",
  "description": "Vanilla Design System with Web Components",
  "author": "Carl",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "web-test-runner \"test/**/*.test.js\" --node-resolve",
    "test:watch": "npm run test -- --watch",
    "test:a11y": "playwright test test/accessibility",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  }
}
```

### Step 4: Create Configuration Files

#### vite.config.js

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.js"),
        button: resolve(__dirname, "src/components/button/button.js"),
        input: resolve(__dirname, "src/components/input/input.js"),
        card: resolve(__dirname, "src/components/card/card.js"),
        modal: resolve(__dirname, "src/components/modal/modal.js"),
        icon: resolve(__dirname, "src/components/icon/icon.js"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "design-system.css";
          }
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          if (assetInfo.name.endsWith(".svg")) {
            return "assets/icons/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    target: "es2020",
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 8080,
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@tokens": resolve(__dirname, "src/tokens"),
      "@utils": resolve(__dirname, "src/utils"),
    },
  },
  plugins: [],
});
```

#### .eslintrc.json

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "plugins": ["wc"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "wc/guard-super-call": "error",
    "wc/no-closed-shadow-root": "error",
    "wc/no-constructor-attributes": "error",
    "wc/no-invalid-element-name": "error",
    "wc/no-self-class": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### web-test-runner.config.js

```javascript
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "test/**/*.test.js",
  nodeResolve: true,

  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  ],

  coverage: true,
  coverageConfig: {
    threshold: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },

  testFramework: {
    config: {
      timeout: 3000,
    },
  },
};
```

#### .gitignore

```
node_modules/
dist/
coverage/
.vscode/
.DS_Store
*.log
.env
```

---

## Phase 2: Foundation Layer (Days 2-3)

### Step 5: Create Design Tokens

Create `src/tokens/tokens.css`:

```css
:root {
  /* Color Primitives */
  --ds-blue-50: #e3f2fd;
  --ds-blue-100: #bbdefb;
  --ds-blue-200: #90caf9;
  --ds-blue-300: #64b5f6;
  --ds-blue-400: #42a5f5;
  --ds-blue-500: #2196f3;
  --ds-blue-600: #1e88e5;
  --ds-blue-700: #1976d2;
  --ds-blue-800: #1565c0;
  --ds-blue-900: #0d47a1;

  --ds-gray-50: #fafafa;
  --ds-gray-100: #f5f5f5;
  --ds-gray-200: #eeeeee;
  --ds-gray-300: #e0e0e0;
  --ds-gray-400: #bdbdbd;
  --ds-gray-500: #9e9e9e;
  --ds-gray-600: #757575;
  --ds-gray-700: #616161;
  --ds-gray-800: #424242;
  --ds-gray-900: #212121;

  --ds-red-500: #f44336;
  --ds-green-500: #4caf50;
  --ds-yellow-500: #ffeb3b;

  /* Semantic Tokens (Light Theme) */
  --ds-color-primary: var(--ds-blue-500);
  --ds-color-primary-hover: var(--ds-blue-600);
  --ds-color-secondary: var(--ds-gray-600);
  --ds-color-surface: white;
  --ds-color-background: var(--ds-gray-50);
  --ds-color-text-primary: var(--ds-gray-900);
  --ds-color-text-secondary: var(--ds-gray-600);
  --ds-color-border: var(--ds-gray-300);
  --ds-color-success: var(--ds-green-500);
  --ds-color-error: var(--ds-red-500);
  --ds-color-warning: var(--ds-yellow-500);
  --ds-color-focus: var(--ds-blue-500);

  /* Spacing Scale (4px base unit) */
  --ds-space-0: 0;
  --ds-space-1: 0.25rem; /* 4px */
  --ds-space-2: 0.5rem; /* 8px */
  --ds-space-3: 0.75rem; /* 12px */
  --ds-space-4: 1rem; /* 16px */
  --ds-space-5: 1.25rem; /* 20px */
  --ds-space-6: 1.5rem; /* 24px */
  --ds-space-8: 2rem; /* 32px */
  --ds-space-10: 2.5rem; /* 40px */
  --ds-space-12: 3rem; /* 48px */
  --ds-space-16: 4rem; /* 64px */

  /* Typography */
  --ds-font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --ds-font-mono: "Courier New", monospace;

  --ds-text-xs: 0.75rem; /* 12px */
  --ds-text-sm: 0.875rem; /* 14px */
  --ds-text-base: 1rem; /* 16px */
  --ds-text-lg: 1.125rem; /* 18px */
  --ds-text-xl: 1.25rem; /* 20px */
  --ds-text-2xl: 1.5rem; /* 24px */
  --ds-text-3xl: 1.875rem; /* 30px */
  --ds-text-4xl: 2.25rem; /* 36px */

  --ds-font-weight-regular: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-bold: 700;

  --ds-line-height-tight: 1.2;
  --ds-line-height-normal: 1.5;
  --ds-line-height-loose: 1.8;

  /* Border Radius */
  --ds-radius-none: 0;
  --ds-radius-sm: 0.25rem;
  --ds-radius-md: 0.5rem;
  --ds-radius-lg: 1rem;
  --ds-radius-full: 9999px;

  /* Shadows */
  --ds-shadow-1: 0 1px 3px rgba(0, 0, 0, 0.12);
  --ds-shadow-2: 0 4px 6px rgba(0, 0, 0, 0.16);
  --ds-shadow-3: 0 10px 20px rgba(0, 0, 0, 0.19);

  /* Transitions */
  --ds-duration-fast: 150ms;
  --ds-duration-normal: 250ms;
  --ds-duration-slow: 400ms;

  --ds-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ds-ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
}

/* Dark Theme */
[data-theme="dark"] {
  --ds-color-primary: var(--ds-blue-400);
  --ds-color-primary-hover: var(--ds-blue-300);
  --ds-color-surface: var(--ds-gray-800);
  --ds-color-background: var(--ds-gray-900);
  --ds-color-text-primary: var(--ds-gray-50);
  --ds-color-text-secondary: var(--ds-gray-400);
  --ds-color-border: var(--ds-gray-700);
}
```

### Step 6: Create Base Styles

Create `src/styles/reset.css`:

```css
/* Modern CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}

body {
  font-family: var(--ds-font-sans);
  line-height: var(--ds-line-height-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}
```

Create `src/styles/base.css`:

```css
body {
  background-color: var(--ds-color-background);
  color: var(--ds-color-text-primary);
}

h1 {
  font-size: var(--ds-text-4xl);
  font-weight: var(--ds-font-weight-bold);
}
h2 {
  font-size: var(--ds-text-3xl);
  font-weight: var(--ds-font-weight-bold);
}
h3 {
  font-size: var(--ds-text-2xl);
  font-weight: var(--ds-font-weight-bold);
}
h4 {
  font-size: var(--ds-text-xl);
  font-weight: var(--ds-font-weight-medium);
}
h5 {
  font-size: var(--ds-text-lg);
  font-weight: var(--ds-font-weight-medium);
}
h6 {
  font-size: var(--ds-text-base);
  font-weight: var(--ds-font-weight-medium);
}

a {
  color: var(--ds-color-primary);
  text-decoration: underline;
}

a:hover {
  color: var(--ds-color-primary-hover);
}

:focus-visible {
  outline: 2px solid var(--ds-color-focus);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

Create `src/styles/utilities.css`:

```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--ds-space-4);
}

/* Flexbox utilities */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.gap-2 {
  gap: var(--ds-space-2);
}
.gap-4 {
  gap: var(--ds-space-4);
}
```

### Step 7: Create Development HTML

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Design System Development</title>
    <link rel="stylesheet" href="/src/tokens/tokens.css" />
    <link rel="stylesheet" href="/src/styles/reset.css" />
    <link rel="stylesheet" href="/src/styles/base.css" />
    <link rel="stylesheet" href="/src/styles/utilities.css" />
    <style>
      .demo-section {
        margin-block: var(--ds-space-8);
        padding: var(--ds-space-6);
        background: var(--ds-color-surface);
        border-radius: var(--ds-radius-md);
      }

      .demo-section h2 {
        margin-block-end: var(--ds-space-4);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header style="padding-block: var(--ds-space-8);">
        <h1>Vanilla Design System</h1>
        <p>Development Playground</p>
      </header>

      <main>
        <section class="demo-section">
          <h2>Buttons</h2>
          <div class="flex gap-4">
            <ds-button>Primary Button</ds-button>
            <ds-button variant="secondary">Secondary</ds-button>
            <ds-button disabled>Disabled</ds-button>
          </div>
        </section>

        <section class="demo-section">
          <h2>Icons</h2>
          <div class="flex gap-4 items-center">
            <ds-icon name="check"></ds-icon>
            <ds-icon name="close" size="large"></ds-icon>
            <ds-icon
              name="arrow-left"
              color="var(--ds-color-primary)"></ds-icon>
          </div>
        </section>
      </main>
    </div>

    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

### Step 8: Create Entry Point

Create `src/index.js`:

```javascript
// Export all components
export { default as DSButton } from "./components/button/button.js";
export { default as DSIcon } from "./components/icon/icon.js";

// Auto-register components
import "./components/button/button.js";
import "./components/icon/icon.js";
```

### Step 9: Start Development Server

```powershell
npm run dev
```

Your browser should open to `http://localhost:3000`.

---

## Phase 3: First Component - Button (Days 4-5)

### Step 10: Build ds-button Component

Create `src/components/button/button.js`:

```javascript
class DSButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this._button = this.shadowRoot.querySelector("button");
    this._updateButtonState();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot.innerHTML) {
      this._updateButtonState();
    }
  }

  get variant() {
    return this.getAttribute("variant") || "primary";
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  _updateButtonState() {
    if (this._button) {
      this._button.disabled = this.disabled;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ds-space-2);
          padding: var(--ds-space-2) var(--ds-space-4);
          border: none;
          border-radius: var(--ds-radius-sm);
          font-family: var(--ds-font-sans);
          font-size: var(--ds-text-base);
          font-weight: var(--ds-font-weight-medium);
          line-height: var(--ds-line-height-tight);
          cursor: pointer;
          transition: all var(--ds-duration-fast) var(--ds-ease-standard);
          background: var(--ds-color-primary);
          color: white;
        }

        button:hover:not(:disabled) {
          background: var(--ds-color-primary-hover);
          transform: translateY(-1px);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        button:focus-visible {
          outline: 2px solid var(--ds-color-focus);
          outline-offset: 2px;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Variants */
        :host([variant="secondary"]) button {
          background: var(--ds-color-secondary);
        }

        :host([variant="tertiary"]) button {
          background: transparent;
          color: var(--ds-color-primary);
          border: 1px solid var(--ds-color-border);
        }

        /* Sizes */
        :host([size="small"]) button {
          padding: var(--ds-space-1) var(--ds-space-3);
          font-size: var(--ds-text-sm);
        }

        :host([size="large"]) button {
          padding: var(--ds-space-3) var(--ds-space-6);
          font-size: var(--ds-text-lg);
        }
      </style>
      <button part="button">
        <slot name="icon-start"></slot>
        <span part="label">
          <slot></slot>
        </span>
        <slot name="icon-end"></slot>
      </button>
    `;
  }
}

customElements.define("ds-button", DSButton);

export default DSButton;
```

### Step 11: Test the Button Component

Create `test/unit/button.test.js`:

```javascript
import { expect, fixture, html } from "@open-wc/testing";
import "../../src/components/button/button.js";

describe("DSButton", () => {
  it("renders with default properties", async () => {
    const el = await fixture(html` <ds-button>Click me</ds-button> `);

    expect(el.variant).to.equal("primary");
    expect(el.size).to.equal("medium");
    expect(el.disabled).to.be.false;
  });

  it("renders button element in shadow DOM", async () => {
    const el = await fixture(html` <ds-button>Click me</ds-button> `);

    const button = el.shadowRoot.querySelector("button");
    expect(button).to.exist;
    expect(button.textContent.trim()).to.equal("Click me");
  });

  it("applies variant attribute", async () => {
    const el = await fixture(html`
      <ds-button variant="secondary">Click me</ds-button>
    `);

    expect(el.variant).to.equal("secondary");
    expect(el.hasAttribute("variant")).to.be.true;
  });

  it("applies size attribute", async () => {
    const el = await fixture(html`
      <ds-button size="large">Click me</ds-button>
    `);

    expect(el.size).to.equal("large");
  });

  it("disables button when disabled attribute is set", async () => {
    const el = await fixture(html` <ds-button disabled>Click me</ds-button> `);

    const button = el.shadowRoot.querySelector("button");
    expect(el.disabled).to.be.true;
    expect(button.disabled).to.be.true;
  });

  it("is accessible", async () => {
    const el = await fixture(html` <ds-button>Accessible Button</ds-button> `);

    await expect(el).to.be.accessible();
  });
});
```

Run tests:

```powershell
npm run test
```

---

## Phase 4: Icon System (Day 6)

### Step 12: Create Icon Sprite

Create `src/assets/icons/sprite.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <!-- Navigation Icons -->
  <symbol id="icon-arrow-left" viewBox="0 0 24 24">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-arrow-right" viewBox="0 0 24 24">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-chevron-down" viewBox="0 0 24 24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
  </symbol>

  <!-- Action Icons -->
  <symbol id="icon-check" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-add" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-search" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
  </symbol>

  <!-- Status Icons -->
  <symbol id="icon-info" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-warning" viewBox="0 0 24 24">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-error" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
  </symbol>
</svg>
```

### Step 13: Build ds-icon Component

Create `src/components/icon/icon.js`:

```javascript
class DSIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "color"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  get color() {
    return this.getAttribute("color") || "currentColor";
  }

  render() {
    const sizeMap = {
      small: "16",
      medium: "24",
      large: "32",
    };

    const size = sizeMap[this.size] || this.size;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        svg {
          width: ${size}px;
          height: ${size}px;
          fill: ${this.color};
        }
      </style>
      <svg aria-hidden="true" focusable="false">
        <use href="/src/assets/icons/sprite.svg#icon-${this.name}"></use>
      </svg>
    `;
  }
}

customElements.define("ds-icon", DSIcon);

export default DSIcon;
```

---

## Phase 5: Continue Building Components

### Recommended Order

1. **Week 1**: Foundation + Button + Icon
2. **Week 2**: Input, Textarea, Checkbox, Radio
3. **Week 3**: Card, Alert, Badge
4. **Week 4**: Modal, Dropdown, Tooltip
5. **Week 5**: Tabs, Accordion, Pagination
6. **Week 6**: Table, Form validation
7. **Week 7**: Documentation site
8. **Week 8**: Testing, accessibility audits, polish

### Daily Workflow

```powershell
# Start your day
npm run dev

# In separate terminal, run tests in watch mode
npm run test:watch

# Make changes to components, tests auto-run

# Before committing
npm run lint
npm run test
npm run build

# Commit your work
git add .
git commit -m "feat: add button component"
```

---

## Production Build

When ready to build for production:

```powershell
# Create production build
npm run build

# Test production build locally
npm run preview

# Check bundle size
ls -lh dist/

# Run all tests
npm run test
npm run test:a11y
```

---

## Next Steps

1. **Documentation**: Create component documentation as you build
2. **Storybook (Optional)**: Consider adding Storybook for component showcase
3. **CI/CD**: Set up GitHub Actions for automated testing
4. **NPM Publishing**: Publish to npm when ready
5. **Changelog**: Maintain CHANGELOG.md for version history

---

## Troubleshooting

### Port Already in Use

```powershell
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### Module Not Found

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Tests Failing

```powershell
# Reinstall Playwright browsers
npx playwright install
```

### HMR Not Working

- Check if firewall is blocking localhost:3000
- Try restarting dev server
- Clear browser cache

---

## Resources

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Vite Documentation](https://vitejs.dev/)
- [Open Web Components Testing](https://open-wc.org/docs/testing/testing-package/)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)

---

## Support

For questions about this setup, refer to:

- `copilot-plan.yaml` - Complete design system specification
- Project documentation in `docs/`
- Component examples in `index.html`

Happy coding! 🚀
