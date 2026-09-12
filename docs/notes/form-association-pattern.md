# The form-association pattern

Native HTML forms only know how to collect values from native form control
elements. When a `<form>` submits, it walks its descendants looking for
`<input>`, `<select>`, `<textarea>`, and a handful of others, and builds a
`FormData` object out of whatever it finds. A Custom Element wrapping an
`<input>` inside its Shadow DOM doesn't show up in that walk — the Shadow DOM
boundary that keeps a component's internals private also keeps them private
from the enclosing form's collection logic. Wrap a perfectly normal
`<input>` in a Custom Element with no further work, give it a `name` and a
`value`, drop it in a `<form>`, and the form submits without it.

## The common workaround, and why it wasn't used here

A lot of custom-element libraries solve this by mirroring a hidden native
`<input>` in the *light* DOM, kept in sync with the component's real state
via JavaScript. It works, but it's a proxy: two sources of truth to keep
aligned, extra DOM nodes that exist purely to satisfy `FormData`, and still
no real hook into the browser's Constraint Validation API — validity has to
be faked too.

## What's actually used: Form-Associated Custom Elements

The browser has a real answer to this, and it's what `ds-checkbox` is built
on:

```js
static formAssociated = true;
// ...
this._internals = this.attachInternals?.() || null;
// ...
this._internals.setFormValue(this.checked ? this.value || "on" : null);
```

`static formAssociated = true` tells the browser this Custom Element itself
— not a hidden proxy — is a form participant. `attachInternals()` returns an
`ElementInternals` handle that connects the element to browser-native form
machinery. `setFormValue()` is what actually makes the element show up in
`FormData` when the form submits, with whatever value the component decides
is current. Notice the `this.value || "on"` fallback — that's `ds-checkbox`
deliberately matching a native `<input type="checkbox">`'s default submitted
value when no `value` attribute is set, so a form built with `ds-checkbox`
behaves exactly like one built with the native element it replaces.

Consumers who want to react to changes directly, rather than wait for form
submission, get an event on top: `ds-checkbox:change` with `{ value, checked,
indeterminate }` in `detail`, `bubbles: true, composed: true` so it escapes
the shadow boundary like every event in this system.

## The honest part: the pattern isn't applied consistently yet

Here's where this note stops describing the intended architecture and
starts describing what's actually in the repository, because those turned
out to be different things.

CLAUDE.md documents `formAssociated` as the convention for the entire
"Input & selection" category — text-field, combobox, checkbox, radio,
switch, slider. Grepping the actual source for `formAssociated` turns up
exactly one component that implements it: `ds-checkbox`.

`ds-text-field` calls `this.attachInternals()` — the handle is sitting right
there — but never sets `static formAssociated = true` and never calls
`setFormValue()`. Tested it directly: build a `<form>` containing a named,
valued `ds-text-field`, call `new FormData(form)`, and the field's entry is
just missing. `checkValidity()` and `reportValidity()` still work, because
those are implemented by delegating to the field's internal native
`<input>` directly — but that only helps a consumer who calls those methods
by hand. The *form* doesn't know the field exists.

`ds-radio`, `ds-switch`, `ds-slider`, `ds-select`, `ds-combobox`,
`ds-textarea`, and `ds-data-table` use neither `formAssociated` nor
`attachInternals` at all. Every one of them can be operated, styled, and
tested in isolation — and the existing test suites do exactly that, which is
part of why this went unnoticed — but drop any of them into a real `<form>`
expecting a native-style submission, and only `ds-checkbox` actually
participates.

## Why this note says this instead of just fixing it

It would be easy to quietly patch `ds-text-field` before publishing this and
let the note describe an aspirational state instead of the real one. That's
the failure mode these notes exist to avoid. The pattern is correct, it's
proven out completely in one component, and extending it to the rest is
mechanical once you've done it once — but "the architecture is right" and
"the architecture is finished being applied" are different claims, and only
one of them is currently true. This is tracked as an open defect rather than
silently fixed, for the same reason the accessibility note describes real
gaps instead of a clean bill of health: a note that only shows the finished
parts isn't an engineering note, it's marketing with extra syntax
highlighting.
