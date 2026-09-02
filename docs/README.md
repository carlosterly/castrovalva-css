# Design System Documentation

This is the multi-page documentation for the Material Design 3 Web Components library.

## Information Architecture

This documentation follows a Material-style hierarchy for discoverability and maintenance.

### Foundations

Core design guidance and system primitives:

- [MD3 Token Reference](./tokens.md) — Token taxonomy, roles, naming hierarchy, and usage guidance
- [Motion & Animation System](./motion.md) — Duration tokens, easing curves, animation utility patterns
- [State Layers & Ripple Effects](./state-layers.md) — Interaction state feedback and ripple effects

### Components

Component reference pages live in [docs/components](./components/) — each page documents:

- Basic usage and intent
- Variants and size options
- Interactive states
- Complete API (attributes, events, methods)
- Accessibility (keyboard interaction, semantic roles, ARIA support)
- Usage guidelines (when to use, best practices, common mistakes)

### Patterns

Cross-component usage patterns and workflows embedded in:

- Component utility demos (data display, navigation, input workflows)
- [Component Content Model](./COMPONENT_CONTENT_MODEL.md) (recommended section patterns)

### Resources & Governance

**Core references:**

- [Documentation Standard](./DOCUMENTATION_STANDARD.md) — Page structure rules, contribution workflow, and validation guidance
- [Component Content Model](./COMPONENT_CONTENT_MODEL.md) — Canonical section intent and quality criteria for component pages
- [MD3 Component Plan](./md3-component-plan.md) — Component inventory, implementation status, roadmap, and change policy
- [Notes Index](./notes/README.md) — archived research, design decisions, and deep-dives

## Structure

```
docs/
├── ../index.html           # Home page with overview and component grid
├── shared/
│   ├── pattern-library.css # Shared documentation styles
│   └── theme-init.js       # Theme switching and persistence
└── components/
    ├── shared-nav.html     # Shared navigation drawer component
    ├── animation-presets.html  # Animation utilities documentation
    ├── responsive-image.html   # Responsive Image component
    ├── button.html         # Button component documentation
    ├── icon.html           # Icon component documentation
    ├── text-field.html     # Text Field component documentation
    ├── checkbox.html       # Checkbox component documentation
    ├── navigation-drawer.html  # Navigation Drawer documentation
    └── [50+ additional components]  # All MD3 components
```

## Features

- **Multi-page structure**: Each component has its own dedicated page
- **Responsive navigation drawer**: Automatically switches between modal and standard variants based on viewport width
- **Shared navigation**: Consistent navigation across all pages using shared-nav.html
- **Theme switching**: Light/dark mode with localStorage persistence
- **Component demos**: Live, interactive examples of each component
- **API documentation**: Comprehensive attribute, event, and method reference
- **Accessibility information**: WCAG compliance notes for each component
- **Code examples**: Copy-paste ready code snippets
- **HTML validation**: All pages validated and error-free

## Source of Truth

- Documentation overview, information architecture, and navigation intent: this file.
- Component page structure and contribution workflow: [docs/DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md).
- Component implementation status and change policy: [docs/md3-component-plan.md](./md3-component-plan.md).
- Foundation guidance and token migration policy: [docs/tokens.md](./tokens.md), [docs/motion.md](./motion.md), [docs/state-layers.md](./state-layers.md).

## Development

To view the documentation locally:

```bash
cd sandbox-v2
npm run dev
```

Then navigate to `http://localhost:5173/docs/` in your browser.

## Technical Implementation

All documentation pages include:

1. **Module Script**: `<script type="module" src="../../src/index.js"></script>` - Loads all components and utilities
2. **Theme Script**: `<script src="../shared/theme-init.js"></script>` - Handles theme persistence and switching
3. **Design Tokens**: Material Design 3 color system with automatic light/dark mode
4. **Pattern Library CSS**: Shared documentation styling for consistent presentation
5. **No HTML Entity Errors**: All JavaScript operators properly encoded (`&&` not `&amp;&amp;`)

## Navigation Structure

The navigation drawer includes:

- **Home**: Overview and getting started
- **Components section**:
  - Animation Presets
  - Responsive Image
  - Button
  - Icon
  - Text Field
  - Checkbox
  - Navigation Drawer
  - [50+ additional components]

The navigation automatically highlights the active page and adjusts its variant based on screen size:

- Desktop (≥840px): Standard variant (persistent side panel)
- Mobile (<840px): Modal variant (overlay with toggle button)

## Adding New Components

When adding a new component to the design system:

1. Create a new page in `docs/components/[component-name].html`
2. Copy the structure from an existing component page
3. Update the `data-page` attribute in the body tag
4. Add a new `<ds-nav-item>` to `shared-nav.html`
5. Add a component card to `index.html` (workspace root)
6. Update the version and component count in the footer

## Page Template

Each component page includes:

1. **Header**: Title and description
2. **Basic usage**: Simple examples
3. **Variants/states**: Different visual styles
4. **API documentation**: Attributes, events, methods, CSS custom properties
5. **Accessibility**: WCAG compliance information
6. **Code examples**: Syntax-highlighted code blocks

## Responsive Behavior

The documentation is fully responsive:

- **Desktop (≥840px)**: Standard drawer with persistent navigation
- **Mobile (<840px)**: Modal drawer with hamburger menu toggle
- **Content area**: Automatically adjusts max-width for readability
- **Component demos**: Stack vertically on narrow screens

## Accessibility

The documentation follows WCAG 2.1 AA guidelines:

- Keyboard navigation throughout
- Proper focus management
- Semantic HTML structure
- ARIA labels where appropriate
- Color contrast compliance
- Screen reader friendly

## Future Enhancements

- Search functionality across all components
- Theme switcher (light/dark mode)
- Code playground with live editing
- Version history and changelog
- Print-friendly styles
- Component playground/sandbox
