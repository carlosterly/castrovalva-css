# What accessibility actually cost

This project's test suite has over 2,000 unit tests, and a good number of
them assert things like "the ARIA role is set," "the disabled attribute
reflects," "the keyboard handler fires." Passing all of them felt like
evidence of an accessible library. It wasn't — or rather, it was evidence of
something necessary and much smaller than it looked. This note is about the
gap between those two things, because closing it this week was more
instructive than anything that went smoothly.

## What a unit test can't tell you

A test that asserts `el.getAttribute("role")` equals `"progressbar"` proves
the attribute is present. It says nothing about whether that progressbar has
an accessible *name* — whether a screen reader announces "45 percent,
upload progress" or just "45 percent, progress bar, unlabeled." A test that
asserts a checkbox's internal `<input>` exists says nothing about whether
its accessible structure is valid ARIA, or whether it's an interactive
control invalidly nested inside another one. These aren't edge cases; they're
the actual substance of "is this accessible," and no amount of asserting
that attributes exist gets you there. You need something that understands
the accessibility tree the way a screen reader does.

## Building the thing that actually checks

`npm run test:a11y` existed as a script in `package.json` for a while,
pointing at `@axe-core/playwright` — a real dependency, already installed —
running against `test/accessibility/`, a directory that was completely
empty. The command didn't fail; it printed "no tests found" and exited
clean, which is a worse failure mode than an error, because it looks like
success in a CI log.

Building the actual harness — `playwright.config.js`, one spec file running
axe-core against all 51 demo pages in both themes — took about as long as
writing this note took. Running it for the first time took ten minutes and
found more than a script that size had any right to.

## What it actually found

45 of 102 automated checks failed on the first run. Two turned out to be one
shared bug each, not per-component bugs:

- Every bare `<select>`/`<input>` in a demo page's interactive control panel
  inherited the page's dark-theme text color but kept the browser's native
  — usually white — widget background. Light text on a white box: about
  1.3:1 contrast, against a 4.5:1 minimum. One missing CSS rule, silently
  broken on every single demo page for as long as dark theme has existed.
- Every horizontally-scrolling code snippet on every demo page had no way
  into the keyboard tab order. Also one shared rule, also present on every
  page that had a long enough code example to overflow.

Both were quick, low-risk fixes to shared infrastructure, not component
code, so they got fixed immediately rather than filed away.

The other 38 failures were real, per-component bugs, and they're the more
useful part of this story because of *which* components they were on.
`ds-radio` and `ds-switch` — both already reviewed and marked clean in an
earlier manual QA pass — render with no accessible name in most of their
demo configurations. The visible label text is right there on screen,
completely normal-looking, and never wired to the control as its accessible
name. `ds-checkbox` and `ds-chip` nest one interactive ARIA role inside
another, which is invalid per the ARIA spec and can make a screen reader's
interaction model break in ways that are hard to predict from reading the
markup. None of this is visible by looking at the rendered page. All of it
is invisible to a test that only checks whether an attribute exists.

## The actual lesson

A manual QA pass — even a careful one, even one done by someone paying
attention — checks whether a component *looks* right. Broken accessibility
semantics don't look like anything. A checkbox with an invalidly nested
interactive role renders as a completely normal-looking checkbox. A radio
button with no accessible name renders as a completely normal-looking radio
button. The only way to find either is to ask something that actually
builds and inspects the accessibility tree, which is what axe does and a
visual review, however careful, structurally cannot.

The honest cost isn't the four hours it took to wire up the harness. It's
that the previous state — 2,000+ tests green, a README claiming "WCAG 2.1
AA," a QA pass that had signed off on `ds-radio` as clean — was actively
misleading about where the library stood, and would have kept being
misleading indefinitely, because nothing in the existing process would ever
have caught it. The harness doesn't make the library accessible. It's the
thing that makes it possible to find out it wasn't, which turns out to be
the harder and more valuable half of the problem.

## What's still open

38 findings across 19 components are logged individually in
[DEFECTS.md](../DEFECTS.md), not fixed in the same pass that found them —
fixing component internals and re-running each component's own test suite
is a different, larger piece of work than building the tool that found the
problem. The CI step that runs this harness is currently non-blocking for
the same reason: making it blocking before the backlog is clear would just
mean turning off a check that's telling the truth. Two likely shared root
causes span most of those 19 components — the label-to-control wiring gap
behind the `radio`/`switch`/`text-field`/`textarea` failures, and the nested-
interactive markup pattern behind `checkbox`/`chip`/`form` — so the real
number of underlying bugs is probably smaller than 38, but that's still a
claim to verify, not assume.
