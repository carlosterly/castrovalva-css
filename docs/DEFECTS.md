# Defects

Open UI/UX defects found during component QA. See the
[component QA workstream](./ROADMAP.md#workstream-component-qa) for the checklist
this is populated from.

## How to use this file

**It lists open defects only.** When something is fixed, **delete the entry** —
do not tick it, do not strike it through, do not move it to a "Fixed" section.
A file that accumulates resolved items becomes a status tracker, drifts, and
stops being read. Git history is the record of what was fixed.

**Absence means nothing.** A component with no entries here has either been
reviewed and found clean, or not reviewed at all. This file does not track
review coverage — the roadmap's quarter descriptions do.

**One line per defect where possible.** If a defect needs three paragraphs, it
is probably a design decision rather than a defect, and belongs in the roadmap.

### Severity

| | Meaning |
| --- | --- |
| **A** | Visibly broken. A visitor would notice. Fix before the site is shown to anyone. |
| **B** | Wrong but not obviously so — off-spec spacing, a missing state, an inconsistency. |
| **C** | Polish. Nobody but you will ever notice. |

### Format

```markdown
### component-name

- **A** — What is wrong, at which viewport/theme if relevant.
- **B** — Another one.
```

---

## Open defects

### home page (index.html)

- **B** — The six links in the "Documentation & Tools" section point at raw `.md` files (`README.md`, `CLAUDE.md`, `docs/ROADMAP.md`, `docs/tokens.md`, `docs/state-layers.md`, `docs/motion.md`). On the deployed Pages site these render as plain text or download rather than as formatted pages. Accepted for the serve-as-is deploy; proper fix (render to HTML, or link to the GitHub blob view) is Q2 site work.

_The Q1 triage sweep populates the rest._

---

## Known gaps in tooling

Not component defects, but things that limit what QA can catch. Delete each when
resolved.

- **No accessibility harness.** `npm run test:a11y` finds zero tests — `test/accessibility/` is empty and there is no `playwright.config.js`, despite `@axe-core/playwright` being installed and the README claiming WCAG 2.1 AA. Scheduled for Q4.
- **No visual regression.** Nothing catches a CSS change that breaks an unrelated component. Scheduled for Q3.
- **No responsive testing.** No automated check at any viewport. Covered manually by the QA workstream.
