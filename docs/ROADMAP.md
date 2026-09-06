# Castrovalva Roadmap

**Horizon:** September 2026 – August 2027
**Last reviewed:** 6 September 2026

---

## What this document is

This is a **roadmap**: direction and intent, deliberately coarse. It says where the project is heading and, just as importantly, where it is not.

It is not a task tracker. Current status lives in the table below, and the authoritative answer to "what exists" is the filesystem — `src/components/` and `docs/components/`. Build conventions live in [CLAUDE.md](../CLAUDE.md).

**Keeping it current:** when work finishes, *delete* the row and add a clause to that quarter's "Done" line. Do not accumulate ticked or struck-through items — a roadmap that grows a completion log becomes the status tracker this project deliberately removed. Each quarter's table should only ever list work not yet done. Review at quarter boundaries, not per session.

## Context this roadmap is built on

Three constraints drive every decision below. If any of them change, re-read this document from the top — most of it stops making sense.

| Constraint | Value | Consequence |
| --- | --- | --- |
| **Purpose** | Portfolio / craft showcase | Optimise for what a visitor sees in 30 seconds, not for API surface |
| **Time budget** | ~5 hours/week, inconsistent | ~50h per quarter; assume months with zero progress |
| **Distribution** | Hosted docs site only | No npm publishing, no package consumers, no semver obligations |

### The honest starting position

The component library is **done enough**. Adding component #44 does nothing for a portfolio.

| Current status | |
| --- | --- |
| Components | 43 — 36/36 official MD3, plus enhancements (combobox, banner, responsive image) and 10 utilities |
| Tests | 49 files, 2,060 passing, 92.19% coverage |
| Lint | Clean — 0 errors |
| Deployed | Not yet; see Q1 |

Public component APIs are stable. Token prefixes in [tokens.md](./tokens.md) are the canonical naming scheme, and deprecations should be announced here before removal. Shadow DOM internals and undocumented details carry no stability guarantee.

What does not exist yet is the thing a portfolio actually needs: **a URL someone can open.** Everything in Q1 exists to produce that URL, and everything after it exists to make what sits behind the URL worth looking at.

---

## Guiding principles

1. **Visible beats complete.** A polished landing page for 43 components is worth more than 50 components nobody can see.
2. **Every quarter ends shippable.** Given the time budget, assume any quarter might be the last one you touch this. Nothing should be left half-migrated.
3. **The repo is part of the portfolio.** A visitor who clicks through to GitHub reads the README, notices failing checks, and forms a judgement. Repo hygiene is portfolio work, not chores.
4. **Depth over breadth.** One genuinely excellent interactive demo says more about craft than ten more components.

## Non-goals

Explicitly not doing these in this horizon. Recorded so the decision does not get silently relitigated every few months.

- **Publishing to npm.** `package.json` stays `private: true`. No semver discipline, no changelog obligations, no consumer support burden.
- **New components**, unless a gap is visible on the docs site itself.
- **Developer tooling** — the component generator CLI, theme builder, and profiling tools listed as "Phase 10D" in the component plan. Invisible to portfolio viewers, expensive to build.
- **Token pipeline work** — no migration to `md.ref`/`md.sys`/`md.comp` naming layers, no Style Dictionary or W3C Design Tokens pipeline, no dynamic colour generation, no multi-mode expansion. `src/tokens/tokens.css` is the source of truth and [tokens.md](./tokens.md) is the guidance. Prefer additive token changes over renames; add contrast or density modes only for a concrete product need. Revisit only if one of these becomes real: token export to multiple platforms, high-contrast or density modes, formal token governance, or token drift that CSS conventions can no longer manage.
- **Contribution infrastructure** — issue templates, RFC process, governance. There are no contributors and none are being sought.

---

## Q1 · Sep–Nov 2026 — Make it credible and visible

**Theme:** Get a working, honest public URL.

**At the end of this quarter:** you can put a link on a CV and nothing on it embarrasses you.

**Done so far:** repo initialised with LF normalisation and `.editorconfig`; lint fixed (28,609 problems to 0 errors, plus two genuine bugs found on the way); documentation consolidated from 16,263 lines to 2,229; README rewritten.

| Remaining | Est. |
| --- | --- |
| Add `LICENSE` (MIT, matching `package.json`). | 15m |
| GitHub Actions CI: lint + `npm test` on push. Proof the tests pass, visible as a badge. | 4h |
| Deploy `docs/` publicly (GitHub Pages via Actions). The pattern library becomes browsable without cloning. | 6h |
| Fix whatever the deploy exposes — broken relative paths, missing assets, dev-only `src/` imports that do not survive a static build. | 8h |
| Add the live URL and a screenshot to the README once the site is up. | 1h |
| **Component QA triage.** Sweep all 43 demo pages at two viewports in both themes. Fix nothing — log everything to [DEFECTS.md](./DEFECTS.md). The output is not a fix list, it is the *size* of the problem, which is currently unknown and which Q2–Q3 cannot be planned honestly without. | 5h |

**Minimum viable stop:** lint green, CI passing, site deployed. Even if nothing below this line ever happens, the project reads as finished rather than abandoned.

---

## Q2 · Dec 2026 – Feb 2027 — Make the site worth browsing

**Theme:** Turn 60-odd demo pages into a coherent product.

**At the end of this quarter:** the site navigates like something designed, not like a directory listing.

| Work | Est. |
| --- | --- |
| Landing page: what this is, why vanilla web components, live component previews above the fold. Replaces the current card grid. | 10h |
| Consistent shell across all demo pages — the `shared-nav` drawer exists; make it complete, searchable, and keyboard-navigable. | 8h |
| Client-side search across components and tokens. | 6h |
| Performance: font loading strategy, defer non-critical JS, Lighthouse ≥ 95. | 6h |
| **Component QA, first half** — see the workstream below. Roughly half the 43 components, prioritised by how likely a visitor is to land on them. | 25h |

**Minimum viable stop:** landing page plus working navigation. The rest is refinement.

> The separate "mobile pass over every demo page" line that used to sit here has
> been folded into the QA workstream — responsive behaviour is one dimension of
> the per-component check, not a separate activity. The docs-site accessibility
> audit moved to Q4, where the axe harness that supports it is built.

---

## Q3 · Mar–May 2027 — Make it distinctive

**Theme:** The part that separates this from every other MD3 clone.

**At the end of this quarter:** there is one thing on the site people remember.

| Work | Est. |
| --- | --- |
| **Interactive theme playground** — live-edit the MD3 source colour, watch all 78 tonal palette values and every component re-theme in real time, with token values and copy-to-clipboard built into the same surface. The single highest-leverage portfolio artefact available from what already exists: 250+ tokens and a working theme system. | 20h |
| Visual regression tests (Playwright screenshots) — run **after** the QA workstream completes, so the baselines capture a fixed state rather than an unstable one. | 10h |
| One realistic composed demo — a settings page or dashboard built entirely from the library, proving the components work together rather than only in isolation. This is also the cheapest way to surface composition defects that per-component review cannot see. | 10h |
| **Component QA, second half** — see the workstream below. | 15h |

**Minimum viable stop:** the theme playground alone justifies the quarter.

> The standalone token explorer has been merged into the theme playground. A
> playground that shows token values as you edit them is the same build and the
> better single artefact.

---

## Q4 · Jun–Aug 2027 — Narrative and consolidation

**Theme:** Explain the craft, then stop.

**At the end of this quarter:** the project explains its own decisions, and is in a state you can leave alone indefinitely.

**Done early:** documentation consolidation, completed September 2026 — nine months ahead of schedule, freeing ~10h.

| Remaining | Est. |
| --- | --- |
| Write 3–4 short engineering notes: why vanilla web components over a framework, the Shadow DOM and theming tension and how it was resolved, the form-association pattern, what accessibility actually cost. This is the portfolio content most people skip and hiring managers actually read. | 12h |
| Publish real numbers: bundle size, coverage, Lighthouse, browser support — measured, not claimed. | 4h |
| **Build the accessibility harness.** `playwright.config.js` plus axe run across every demo page, wired into CI. `@axe-core/playwright` is already a dependency and `npm run test:a11y` currently finds zero tests — this is what makes the WCAG 2.1 AA claim in the README true rather than aspirational. | 4h |
| Accessibility audit of the **docs site itself** — the components carry a11y assertions, the pages around them have none. Runs on the harness above. | 8h |
| Clear whatever remains in [DEFECTS.md](./DEFECTS.md), and fill component gaps only if Q2–Q3 surfaced real ones. | 10h |
| Dependency refresh, final accessibility pass, roadmap review. | 6h |

**Minimum viable stop:** the engineering notes. Everything else is maintenance.

---

## Workstream: component QA

Spans Q1–Q4, ~45h total. The largest single block of work in this roadmap, and
the one most likely to overrun, so it is defined here rather than buried in a
quarter.

### Why it exists

2,060 passing unit tests prove **behaviour**: attributes reflect, events fire
with the right `detail`, keyboard handlers respond, ARIA attributes get set.

They prove nothing about whether a component *looks* right, whether its ARIA is
*correct* rather than merely present, whether it survives a 360px viewport, or
whether it still works inside a dialog inside a data table. Passing tests on an
unreviewed component is false confidence, and that is the gap this closes.

### Per-component checklist

A component is done when all of these hold, at 360px and 1280px, in light and
dark:

- [ ] Matches the MD3 spec visually — elevation, corner radius, state-layer opacity, type scale
- [ ] Every documented variant and state renders correctly
- [ ] Interactive states behave — hover, focus-visible, pressed, disabled
- [ ] Focus indicator is visible and not doubled
- [ ] Keyboard path works end to end, not just the handlers the tests assert
- [ ] No layout break, overflow or clipping at either viewport
- [ ] No console errors or warnings on the demo page
- [ ] Demo page examples all actually work — it is now the sole API reference
- [ ] Composes correctly with at least one container (dialog, sheet or card)

### Rules of engagement

**Triage first, fix second.** The Q1 sweep logs and fixes nothing. Reviewing all
43 before fixing any prevents the classic failure: rabbit-holing on component
three and never reaching component forty.

**Log to [DEFECTS.md](./DEFECTS.md), fix by visibility.** Order fixes by how
likely a visitor is to land on the component, not alphabetically or by how
interesting the bug is.

**Visual regression comes last.** Screenshot baselines taken mid-QA capture
broken state and entrench it. Q3's regression suite runs once the fixing is done.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| **Long gaps between sessions.** The most likely failure mode at 5h/week. | Every quarter has a minimum viable stop. Nothing is left half-migrated across a gap. |
| **Scope creep into new components.** The most tempting and least valuable work — it feels productive and moves no needle. | Listed as an explicit non-goal. Requires a visible gap on the site to justify. |
| **The static deploy exposes hidden coupling.** Demo pages import from `src/` directly; a built deploy may not resolve those paths. | Q1 budgets 8h specifically for this. Discover it in month 1, not month 11. |
| **Docs drift from reality.** Was already happening — the README roadmap sat nine months stale. | Largely structural now: the September 2026 consolidation removed the duplication that caused it. Three maintained docs, and component API lives in exactly one place. |
| **A wrong demo page has nothing to catch it.** Consolidation made `docs/components/{name}.html` the sole source of API truth; there is no second copy to disagree with it. | Tests cover the behaviour the page describes. The QA workstream checks every page's examples actually work, and Q3's visual regression suite locks that in. |
| **The QA workstream overruns.** ~45h estimated against 43 components nobody has systematically reviewed. If the Q1 triage finds the average component needs more than an hour, the estimate is wrong and so is the rest of the plan. | The triage exists precisely to produce this number early. If it comes back high, cut scope at that point — drop to the top 15 components — rather than discovering the overrun in month nine. |
| **Slack has thinned.** Adding the QA workstream took planned work from ~147h to ~178h against a realistic ~200h year. Buffer is down from roughly 26% to 11%, and Q2, Q3 and Q4 all now exceed the ~50h/quarter guide. | Accept that Q4's narrative work is the designated casualty — it has the least dependency on anything else and the highest tolerance for slipping into the following year. If the Q1 triage comes back worse than expected, cut QA scope rather than letting every quarter slip. |

## Revisit triggers

Re-plan from scratch if any of these become true:

- The purpose changes — someone wants to actually *use* this, or it becomes a product foundation
- The time budget changes materially in either direction
- You decide to publish to npm after all, which invalidates most of the non-goals
- The site ships and feedback points somewhere this roadmap does not go
