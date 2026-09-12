# Why vanilla Web Components over a framework

Castrovalva implements 43 Material Design 3 components with zero runtime
dependencies — no React, no Lit, no framework of any kind in `src/`. That's
not a purity test. It's a consequence of what this project actually is: a
design system meant to be dropped into whatever a consumer is already
running, not a product that dictates the stack underneath it.

## The actual constraint

A React component library only works in React. A Vue component library only
works in Vue. If the goal is "a button that looks and behaves consistently
everywhere," building it on top of any framework means every consumer who
isn't on that framework is locked out, and every major version bump of that
framework is a forced migration for 43 components before it's a migration for
anyone downstream.

Custom Elements don't have that problem, because they're not a library
abstraction — they're a browser primitive. `customElements.define("ds-button",
DSButton)` and `<ds-button>` works in React, Vue, Angular, a static HTML file,
or nothing at all. No adapter package, no wrapper component, no version
matrix to maintain.

## What that costs, honestly

None of this is free, and pretending otherwise would undercut the point of
these notes. Frameworks earn their weight:

- **No reactivity system.** There's no virtual DOM, no dependency-tracked
  signals. Every component hand-manages its own targeted DOM updates in
  `attributeChangedCallback` and property setters. Get the update logic
  wrong and you re-render too much, or too little, and nothing catches it
  for you — there's no framework runtime to fall back on.
- **No component-tree tooling.** No React DevTools equivalent, no built-in
  prop-drilling diagnostics. Debugging is `$0.shadowRoot`, breakpoints, and
  reading the actual DOM.
- **Testing needs a real browser.** No jsdom shortcuts — Shadow DOM,
  `ElementInternals`, and slot projection aren't fully faked. This repo runs
  `@web/test-runner` against real Chromium (Firefox and WebKit for the full
  pre-release pass), which is slower than an in-memory jsdom suite but tests
  what actually ships.
- **State management is bespoke.** Every stateful component (`ds-checkbox`,
  `ds-combobox`, `ds-data-table`) owns its state by hand. There's no Redux,
  no context API — cross-component coordination is either an event
  (`ds-{component}:{action}`, always `bubbles: true, composed: true`) or a
  shared attribute, decided per component rather than handed down by a
  framework convention.

## What it buys back

- **True interoperability.** The same `<ds-text-field>` works unmodified
  inside a React form, a Vue template, or a hand-written HTML page. This
  isn't a claim that needs a compatibility shim to be true — it's the
  baseline behavior of a Custom Element.
- **No transitive dependency risk.** `npm ls` under `src/` comes back empty.
  There's no framework version to track, no breaking change in an upstream
  package that ripples through 43 components on someone else's schedule.
  (Lit shows up in `package-lock.json` — but only as a transitive dependency
  of a *test* tool. Nothing shipped imports it.)
- **Tree-shaking that's actually granular.** `vite.config.js` defines a
  build entry per component, so `import "castrovalva/button"` pulls in
  17 KB raw / 3.2 KB gzipped — just the button and what it needs — instead
  of the whole library. Importing everything (`import "castrovalva"`) is
  honestly heavier: ~604 KB raw / ~97 KB gzipped for all 43 components plus
  the full icon set, a number this project hadn't actually measured until
  writing this note turned up how stale the "~11 KB gzipped" figure on the
  home page and in the README had become. That's the kind of drift that
  happens when a number gets written down once, early, and never
  re-measured as the library grows — fixing it is on the roadmap, and this
  note is what surfaced it.
- **Real encapsulation.** Shadow DOM means a component's internal markup and
  styles can't leak into the page, and the page's styles mostly can't leak
  in either — see the next note for the one deliberate exception that makes
  theming possible anyway.

## The honest summary

Vanilla Web Components were the right call for *this* project because the
thing being sold is portability, not developer ergonomics. If this were an
internal component library for one React app, none of this would be worth
it — you'd take the framework's reactivity system and its dev tools and not
look back. The trade only makes sense when "works everywhere, forever, with
nothing to upgrade" is actually the point.
