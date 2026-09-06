# Castrovalva Roadmap

**Horizon:** September 2026 – August 2027
**Last reviewed:** 6 September 2026

---

## What this document is

This is a **roadmap**: direction and intent, deliberately coarse. It says where the project is heading and, just as importantly, where it is not.

It is not a task tracker. Current status lives in the table below, and the authoritative answer to "what exists" is the filesystem — `src/components/` and `docs/components/`. Build conventions live in [CLAUDE.md](../CLAUDE.md).

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

| Work | Est. |
| --- | --- |
| Fix `npm run lint` — currently 28,609 errors (CRLF working copy, plus a `quotes` rule the codebase has never satisfied). Decide single vs double quotes, renormalise line endings, get to zero. | 3h |
| Add `LICENSE` (MIT, matching `package.json`). | 15m |
| Rewrite the stale Roadmap section in `README.md` — it currently lists Card, Dialog and TextField as "next" when all three shipped months ago. Replace with a pointer to this file. | 1h |
| GitHub Actions CI: lint + `npm test` on push. Proof the tests pass, visible as a badge. | 4h |
| Deploy `docs/` publicly (GitHub Pages via Actions). The pattern library becomes browsable without cloning. | 6h |
| Fix whatever the deploy exposes — broken relative paths, missing assets, dev-only `src/` imports that do not survive a static build. | 8h |
| README rewrite: lead with the live URL and a screenshot. It is the shop window. | 4h |

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
| Mobile pass over every demo page. Currently unverified at small widths. | 8h |
| Accessibility audit of the **docs site itself** — the components are WCAG AA, the pages around them are untested. Extend `test:a11y` to cover demo pages. | 8h |
| Performance: font loading strategy, defer non-critical JS, Lighthouse ≥ 95. | 6h |

**Minimum viable stop:** landing page plus working navigation. The rest is refinement.

---

## Q3 · Mar–May 2027 — Make it distinctive

**Theme:** The part that separates this from every other MD3 clone.

**At the end of this quarter:** there is one thing on the site people remember.

| Work | Est. |
| --- | --- |
| **Interactive theme playground** — live-edit the MD3 source colour, watch all 78 tonal palette values and every component re-theme in real time. The single highest-leverage portfolio artefact available from what already exists: 250+ tokens and a working theme system. | 20h |
| Token explorer: browse colour, type, elevation and motion tokens with live values and copy-to-clipboard. | 10h |
| Visual regression tests (Playwright screenshots) to protect the polish accumulated in Q2. | 10h |
| One realistic composed demo — a settings page or dashboard built entirely from the library, proving the components work together rather than only in isolation. | 10h |

**Minimum viable stop:** the theme playground alone justifies the quarter.

---

## Q4 · Jun–Aug 2027 — Narrative and consolidation

**Theme:** Explain the craft, then stop.

**At the end of this quarter:** the project explains its own decisions, and is in a state you can leave alone indefinitely.

| Work | Est. |
| --- | --- |
| Write 3–4 short engineering notes: why vanilla web components over a framework, the Shadow DOM and theming tension and how it was resolved, the form-association pattern, what accessibility actually cost. This is the portfolio content most people skip and hiring managers actually read. | 12h |
| Publish real numbers: bundle size, coverage, Lighthouse, browser support — measured, not claimed. | 4h |
| ~~Documentation consolidation~~ — **done September 2026.** 58 files / 16,263 lines reduced to 3 maintained docs plus token reference and per-component stubs (2,229 lines total). | ✅ |
| Fill component gaps only if Q2–Q3 surfaced real ones. | 10h |
| Dependency refresh, final accessibility pass, roadmap review. | 6h |

**Minimum viable stop:** the engineering notes. Everything else is maintenance.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| **Long gaps between sessions.** The most likely failure mode at 5h/week. | Every quarter has a minimum viable stop. Nothing is left half-migrated across a gap. |
| **Scope creep into new components.** The most tempting and least valuable work — it feels productive and moves no needle. | Listed as an explicit non-goal. Requires a visible gap on the site to justify. |
| **The static deploy exposes hidden coupling.** Demo pages import from `src/` directly; a built deploy may not resolve those paths. | Q1 budgets 8h specifically for this. Discover it in month 1, not month 11. |
| **Docs drift from reality.** Already happening — the README roadmap was roughly nine months stale. | Q1 fixes it; Q4 consolidates the overlapping docs that make drift likely. |

## Revisit triggers

Re-plan from scratch if any of these become true:

- The purpose changes — someone wants to actually *use* this, or it becomes a product foundation
- The time budget changes materially in either direction
- You decide to publish to npm after all, which invalidates most of the non-goals
- The site ships and feedback points somewhere this roadmap does not go
