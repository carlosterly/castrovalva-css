# The Shadow DOM and theming tension, and how it was resolved

Shadow DOM's entire job is encapsulation: a component's internal markup and
styles are sealed off from the page, and the page's styles are (mostly)
sealed off from the component. That's exactly what you want to stop one
component's CSS from colliding with another's. It also looks, at first
glance, like it makes site-wide theming impossible — if 43 components each
seal their styles into their own Shadow DOM, how does one theme switch
change the color of all of them at once?

## The one deliberate leak

CSS custom properties are the specified exception to Shadow DOM
encapsulation: they inherit through shadow boundaries like any other
inherited CSS property. A `<style>` block inside a component's Shadow DOM
can read `var(--md-sys-color-primary)`, and that value resolves from
wherever it was last set in the ancestor chain — including all the way up
at `:root`, outside every shadow root in the document.

That's the entire mechanism this design system's theming is built on. No
component ever hardcodes a color, a radius, a duration, or an elevation
shadow. It reads a `--md-sys-color-*` / `--md-sys-shape-*` /
`--md-sys-motion-*` role token, and the token's *value* lives entirely
outside any component's Shadow DOM.

## The two-layer token architecture this enables

`src/tokens/` splits into two files with very different jobs:

- **`palette.css`** — 91 raw reference tones (`--md-ref-palette-primary40`,
  `--md-ref-palette-neutral90`, and so on across six tonal ramps). This is
  the *only* file a theme changes.
- **`tokens.css`** — maps semantic roles onto specific palette tones, and
  does it differently per `[data-theme]`. `--md-sys-color-primary` resolves
  to `primary40` in the default (light) theme, `primary80` under
  `[data-theme="dark"]`, and the same `primary80` again — but now paired
  with a pure-black surface and brighter outlines — under
  `[data-theme="high-contrast"]`.

Components only ever consume the second layer. They have no idea whether
`--md-sys-color-primary` currently resolves to a teal, a purple, or
whatever a visitor picked in the theme playground — and they don't need to.
Retheming the entire library means overriding ~90 values in one file; every
one of the 43 components picks up the change automatically, because none of
them were ever touched.

The proof this actually holds up isn't theoretical: the theme playground
(`docs/components/theme-playground.html`) regenerates all 91 palette values
and every semantic role mapping live, per keystroke on a color picker, and
re-themes a 12-component preview block in real time with zero
component-level code involved in that update path. If the custom-property
inheritance model didn't actually pierce every shadow root the same way, that
demo would visibly break — some components would update and others
wouldn't. They all do.

## Where the leak doesn't reach

Custom properties solve color, shape, spacing, motion, and elevation because
those are all things a component reads as a *value*. Two categories don't
fit that model and needed their own answer:

- **Icon fills.** An `<svg>` painted with `fill="currentColor"` inside a
  component's Shadow DOM picks up `color` the normal inherited-CSS way, so
  icon tinting rides the same mechanism as everything else — but it only
  works because the SVGs were authored to use `currentColor` rather than a
  hardcoded fill in the first place. That's a discipline, not something
  Shadow DOM gives you automatically.
- **Letting the *consumer* style specific internals.** Custom properties
  flow one direction — values in. When a consumer needs to reach a specific
  internal element (not just override a token), that's what `::part()` is
  for, exposed deliberately per component rather than by accident.

## The rule that closes the loop the other way

There's a second, less obvious leak risk: a component reaching *out* of its
own Shadow DOM to mutate the host element's class list for styling purposes.
It's tempting — `this.classList.add("is-open")` and then style off that
class — but the host's class list belongs to whatever page embedded the
component, not to the component itself. Two libraries both doing this on
the same element is exactly the collision Shadow DOM was supposed to
prevent, just relocated from CSS to `classList`. This project's rule is
flat: never mutate classes on `this`. State that needs to affect appearance
either lives in an attribute the component owns (`aria-expanded`,
`data-state`) or in Shadow DOM-internal classes on elements the component
actually controls.

## The honest summary

The tension is real — Shadow DOM's isolation and a shared theming system
pull in opposite directions on paper. The resolution isn't a workaround
bolted on top; it's that CSS custom properties were designed as the one
place encapsulation deliberately steps aside, and building the entire token
system around that one seam means theming and encapsulation stop competing
and start being the same mechanism.
