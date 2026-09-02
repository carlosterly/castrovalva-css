---
description: Update a component's docs, sizing, tests, and validation per project standards.
argument-hint: <component name> [paths to its docs, source, and tests]
---

You are working in a design system repo. See [CLAUDE.md](../../CLAUDE.md) for the
documentation, sizing, and test standards referenced below.

Target component: $ARGUMENTS

Goal: Update this component's docs, sizing, tests, and validation with minimal,
standards-compliant changes.

For the specified component (by folder or files):

1. Update docs HTML to match the documentation standard (required structure/sections, HTML rules, script placement, escaped code blocks).
2. Run required validators for all created or modified HTML, CSS, and JavaScript; fix issues until clean.
3. Apply sizing rollout updates per the sizing plan (map defaults to global tokens; add `size` only when the plan explicitly allows it); update docs/README as needed.
4. Create or update the component test file to match the test plan (required describe blocks and coverage areas: attributes/properties/events/keyboard/accessibility).
5. Run the component's test file and report results.

Constraints:

- Use the project's documentation, sizing, and test standards.
- Don't introduce imports in inline HTML demo scripts.
- Keep theme-init script included once at the end of the body.
- Keep changes minimal and focused on the requested component.

Resolution order (if standards conflict): documentation standard → sizing plan → test plan.

Output format:

- Changed files (with brief purpose)
- Validation results (HTML/CSS/JS)
- Test results (component test file)
