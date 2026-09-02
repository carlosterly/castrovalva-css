# Deployment Guide

This guide covers how to deploy and use the Vanilla Design System in production.

## 📦 Distribution Files

After running `npm run build`, you'll have these files in the `dist/` folder:

```
dist/
├── index.js          # Main entry point (0.35 KB / 0.21 KB gzipped)
├── button.js         # Button component (6.89 KB / 1.95 KB gzipped)
├── icon.js           # Icon component (3.62 KB / 1.36 KB gzipped)
└── [sourcemaps]      # .map files for debugging
```

You'll also need these source files for styling:

```
src/
├── tokens/
│   └── tokens.css    # Design tokens (colors, spacing, typography)
├── styles/
│   ├── reset.css     # Modern CSS reset
│   ├── base.css      # Base typography and elements
│   └── utilities.css # Utility classes
└── assets/
    └── icons/
        └── sprite.svg # Icon sprite (required for ds-icon)
```

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended)

Deploy to any static hosting service:

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**vercel.json:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

**package.json:**

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Option 2: CDN

Upload `dist/` folder to a CDN:

#### Using jsDelivr (for GitHub repos)

```html
<!-- From your GitHub repo -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/yourorg/design-system@latest/dist/index.js"></script>
```

#### Using unpkg (for npm packages)

```html
<!-- From npm -->
<script
  type="module"
  src="https://unpkg.com/castrovalva/dist/index.js"></script>
```

### Option 3: NPM Package

Publish as an npm package:

**package.json:**

```json
{
  "name": "castrovalva",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./button": "./dist/button.js",
    "./icon": "./dist/icon.js",
    "./tokens": "./src/tokens/tokens.css",
    "./reset": "./src/styles/reset.css",
    "./base": "./src/styles/base.css",
    "./utilities": "./src/styles/utilities.css"
  },
  "files": ["dist", "src/tokens", "src/styles", "src/assets", "docs"]
}
```

```bash
# Publish to npm
npm login
npm publish --access public
```

### Option 4: Self-Hosted

Copy files to your web server:

```bash
# Copy built files
scp -r dist/ user@yourserver.com:/var/www/design-system/

# Copy source files needed at runtime
scp -r src/tokens user@yourserver.com:/var/www/design-system/src/
scp -r src/styles user@yourserver.com:/var/www/design-system/src/
scp -r src/assets user@yourserver.com:/var/www/design-system/src/
```

## 🔌 Integration Examples

### Vanilla HTML/JS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- Load styles -->
    <link rel="stylesheet" href="/design-system/src/tokens/tokens.css" />
    <link rel="stylesheet" href="/design-system/src/styles/reset.css" />
    <link rel="stylesheet" href="/design-system/src/styles/base.css" />
    <link rel="stylesheet" href="/design-system/src/styles/utilities.css" />
  </head>
  <body>
    <div class="container">
      <ds-button variant="primary">Click Me</ds-button>
      <ds-icon name="check"></ds-icon>
    </div>

    <!-- Load components -->
    <script type="module" src="/design-system/dist/index.js"></script>
  </body>
</html>
```

### React

```jsx
import { useEffect } from "react";

// Import once in your app root
function App() {
  useEffect(() => {
    // Import design system
    import("/design-system/dist/index.js");
  }, []);

  return (
    <div>
      {/* Use components with JSX */}
      <ds-button variant="primary">Click Me</ds-button>
      <ds-icon name="check"></ds-icon>
    </div>
  );
}
```

**Note:** Add to `tsconfig.json` or `vite.config.ts`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["vite/client"]
  }
}
```

### Vue

```vue
<template>
  <div>
    <ds-button variant="primary">Click Me</ds-button>
    <ds-icon name="check"></ds-icon>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  await import("/design-system/dist/index.js");
});
</script>
```

**vite.config.js:**

```js
export default {
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("ds-"),
      },
    },
  },
};
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(async () => {
    await import('/design-system/dist/index.js');
  });
</script>

<ds-button variant="primary">Click Me</ds-button>
<ds-icon name="check"></ds-icon>
```

**svelte.config.js:**

```js
export default {
  compilerOptions: {
    customElement: true,
  },
};
```

### Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {
    import("/design-system/dist/index.js");
  }
}
```

```html
<!-- component.html -->
<ds-button variant="primary">Click Me</ds-button>
<ds-icon name="check"></ds-icon>
```

## 🎨 Styling Integration

### Custom CSS

```css
/* Your app styles */
@import "/design-system/src/tokens/tokens.css";
@import "/design-system/src/styles/reset.css";
@import "/design-system/src/styles/base.css";
@import "/design-system/src/styles/utilities.css";

/* Override tokens if needed */
:root {
  --ds-color-primary: #your-brand-color;
  --ds-font-sans: "Your Font", system-ui, sans-serif;
}
```

### Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--ds-color-primary)",
        secondary: "var(--ds-color-secondary)",
        success: "var(--ds-color-success)",
        error: "var(--ds-color-error)",
      },
      spacing: {
        1: "var(--ds-space-1)",
        2: "var(--ds-space-2)",
        4: "var(--ds-space-4)",
        8: "var(--ds-space-8)",
      },
    },
  },
};
```

## 📊 Performance Optimization

### 1. Lazy Loading

```javascript
// Load components on-demand
async function showModal() {
  const { DSModal } = await import("./dist/modal.js");
  // Use modal
}
```

### 2. Preloading

```html
<!-- Preload critical components -->
<link rel="modulepreload" href="/design-system/dist/index.js" />
<link rel="modulepreload" href="/design-system/dist/button.js" />
```

### 3. Caching Headers

**nginx.conf:**

```nginx
location /design-system/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

**Apache .htaccess:**

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
</IfModule>
```

### 4. Compression

Ensure your server uses gzip/brotli compression:

**nginx:**

```nginx
gzip on;
gzip_types application/javascript text/css;
gzip_min_length 1000;
```

## 🔐 Security Best Practices

### Content Security Policy (CSP)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';" />
```

### Subresource Integrity (SRI)

When using CDN, add integrity hashes:

```html
<script
  type="module"
  src="https://cdn.example.com/design-system/index.js"
  integrity="sha384-..."
  crossorigin="anonymous"></script>
```

## 🔍 Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --mode analyze
```

### Performance Monitoring

```javascript
// Track component load time
const start = performance.now();
await import("./dist/button.js");
const loadTime = performance.now() - start;
console.log(`Button loaded in ${loadTime}ms`);
```

## 🐛 Troubleshooting

### Icons Not Showing

Ensure the sprite.svg file is accessible:

```bash
# Check if sprite is served correctly
curl http://localhost:3000/src/assets/icons/sprite.svg
```

Fix CORS if needed:

```nginx
# nginx
add_header Access-Control-Allow-Origin "*";
```

### Components Not Registering

Check for duplicate registrations:

```javascript
// Only register if not already registered
if (!customElements.get("ds-button")) {
  customElements.define("ds-button", DSButton);
}
```

### Styling Not Applied

Verify CSS is loaded:

```javascript
// Check if tokens are available
const primary = getComputedStyle(document.documentElement).getPropertyValue(
  "--ds-color-primary"
);
console.log("Primary color:", primary);
```

## 📝 Version Management

### Semantic Versioning

Follow [semver](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backward compatible)
- **PATCH** (0.0.1): Bug fixes

### Changelog

Maintain a CHANGELOG.md:

```markdown
# Changelog

## [1.0.0] - 2025-12-08

### Added

- Button component with 4 variants
- Icon component with 50+ icons
- Design tokens system
- Theme support (light/dark/high-contrast)

### Changed

- N/A

### Fixed

- N/A
```

## 🎉 Go Live Checklist

- [ ] Run tests (`npm test`)
- [ ] Build production bundle (`npm run build`)
- [ ] Check bundle size
- [ ] Test in all supported browsers
- [ ] Verify accessibility
- [ ] Test theme switching
- [ ] Verify icons load correctly
- [ ] Check responsive behavior
- [ ] Enable compression on server
- [ ] Set proper cache headers
- [ ] Test CDN/hosting integration
- [ ] Update documentation
- [ ] Create release notes

---

**Ready to deploy? Run `npm run build` and choose your deployment method!**
