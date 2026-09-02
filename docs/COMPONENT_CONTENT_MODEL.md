# Component Content Model

This document defines content-quality requirements for component documentation pages.

It complements, and does not replace, the structural rules in `docs/DOCUMENTATION_STANDARD.md`.

## Purpose

- Improve decision usefulness of docs, not only structural consistency.
- Ensure each section answers the practical questions developers have.
- Create a repeatable quality bar across all component categories.

## Relationship to Documentation Standard

- `docs/DOCUMENTATION_STANDARD.md` remains the source of truth for page structure, HTML rules, and required base sections.
- This content model defines what each section must communicate.
- If conflicts occur, resolve in this order:
  1. Documentation Standard
  2. Component Content Model
  3. Component-specific exceptions (documented in-page)

## Audience and Primary Questions

Each component page should quickly answer:

1. What problem does this component solve?
2. Which variant/state should I choose?
3. What is the minimal safe implementation?
4. What accessibility behavior should I expect?
5. What are known limitations and integration risks?

## Required Section Intent Matrix

The sections below match required sections from the documentation standard and add content expectations.

### 1. Title and Description

Must include:

- Component name and role in UI.
- One-sentence use case.
- One-sentence boundary statement (what it is not for).

Good example pattern:

- "Material Design 3 {component} for {primary task}. Not intended for {common misuse}."

### 2. Basic Usage

Must include:

- Smallest valid implementation.
- Default behavior expectations.
- One sentence on why this is the default recommended pattern.

Must avoid:

- Overloaded first example with optional features.

### 3. Variants

Must include:

- Variant list with when-to-use guidance.
- Trade-off notes if variants differ in emphasis, density, or discoverability.
- At least one anti-pattern warning when misuse is common.

Recommended format:

- "Use when" and "Avoid when" bullets per variant.

### 4. States

Must include:

- Supported interactive and validation states.
- Behavior differences by state (not only visual appearance).
- Any state transitions that emit events or block interaction.

Must include at least:

- Default
- Disabled
- Error/invalid (if applicable)
- Loading/busy (if applicable)

### 5. API

Must include:

- Attributes/properties with defaults and valid values.
- Events with detail payload and trigger conditions.
- Methods (if present) with side effects.
- CSS custom properties and parts only if actually supported.

Quality requirements:

- Explicitly note nullable/optional values.
- Document invalid value fallback behavior.
- Avoid listing unsupported items as placeholders.

### 6. Accessibility

Must include:

- Keyboard interaction map (key -> behavior).
- ARIA/role semantics and announcement behavior.
- Focus behavior and visible indicator expectations.
- Known accessibility caveats or consumer responsibilities.

Recommended minimum table:

- Key
- Context
- Expected result

### 7. Usage Guidelines

Must include:

- When to use.
- When not to use.
- Composition guidance with related components.
- Common implementation mistakes and fixes.

## Recommended Advanced Sections

Add these when component complexity requires them.

### Anatomy

Use for multi-part components where slots/parts are not self-evident.

### Behavior Model

Use for components with non-trivial interaction flow (dialogs, menus, search, drag/drop).

### Related Components

Use when multiple components are likely alternatives.

### Known Limitations

Use when constraints affect integration decisions.

## Component Category Profiles

Apply these profiles in addition to base required sections.

### Action Components

Examples: button, fab, split-button.

Must emphasize:

- Action hierarchy and emphasis selection.
- Disabled/loading semantics and event behavior.

### Input and Selection Components

Examples: text-field, combobox, checkbox, radio, switch, slider.

Must emphasize:

- Validation lifecycle.
- Value model and event timing.
- Keyboard interaction details.

### Navigation Components

Examples: tabs, navigation bar, navigation rail, drawers.

Must emphasize:

- Selection model.
- Orientation/responsive behavior.
- Focus order and roving tabindex (if used).

### Container and Overlay Components

Examples: card, dialog, bottom sheet, side sheet, menu.

Must emphasize:

- Open/close behavior.
- Focus management and dismissal behavior.
- Scrim/background interaction rules.

### Utility Components and Helpers

Examples: focus-ring, scrollbar, elevation, animation-presets, drag-drop.

Must emphasize:

- Integration contract with host elements.
- Side effects and initialization requirements.
- Performance and accessibility implications.

## Example Quality Bar

Every page should include:

- One minimal baseline example.
- One realistic production-like example.
- One interactive example with observable output.

Examples should:

- Avoid placeholder-only prose.
- Use meaningful labels and values.
- Prefer realistic data shape and event logging.

## Content Review Checklist

Use this checklist for audits and PR review.

- Does each required section answer a developer decision question?
- Are variant recommendations explicit (use/avoid)?
- Are state behavior differences documented clearly?
- Is API documentation accurate and non-placeholder?
- Is keyboard behavior documented as a map, not generic bullet text?
- Are limitations and common pitfalls described where relevant?
- Are examples realistic and not only cosmetic?

## Rollout Plan for Adoption

1. Pilot on 3 component pages (one simple, one complex, one utility).
2. Calibrate wording and checklist from pilot feedback.
3. Apply to all high-traffic component docs.
4. Apply to remaining component docs.
5. Add periodic content audit cadence.

## Suggested Pilot Candidates

- `docs/components/button.html` (simple action component)
- `docs/components/dialog.html` (complex overlay component)
- `docs/components/drag-drop.html` (utility with behavioral complexity)

## Maintenance

- Update this model when recurring doc quality issues appear in reviews.
- Keep this file concise and actionable.
- Reflect major model changes in `docs/README.md` and `docs/DOCUMENTATION_STANDARD.md`.
