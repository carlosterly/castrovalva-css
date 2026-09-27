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

## What's used: Form-Associated Custom Elements

The browser has a real answer to this. `static formAssociated = true` tells
the browser the Custom Element itself — not a hidden proxy — is a form
participant, and `attachInternals()` returns an `ElementInternals` handle
wired into the browser's own form machinery. Through it, the element reports
its submitted value (`setFormValue()`) and its validity (`setValidity()`),
and the browser calls it back when its form resets
(`formResetCallback()`) or an ancestor `<fieldset>` is disabled
(`formDisabledCallback()`).

All nine input and selection components — text-field, textarea, checkbox,
radio, switch, slider, combobox, date-picker and time-picker — get that
contract from one mixin, [`src/utils/form-associated.js`](../../src/utils/form-associated.js):

```js
export class DSSwitch extends FormAssociated(HTMLElement) {
  _syncFormState() {
    // A native checkbox's rules: its value (default "on") when on, nothing
    // when off; required means it must be on.
    this._setFormState(this.checked ? this.value || "on" : null, {
      valueMissing: this.required && !this.checked,
    });
  }

  formResetCallback() {
    this.checked = this._defaultChecked ?? false;
  }
}
```

The mixin supplies everything that's identical across components — the
`form`, `validity`, `validationMessage` and `labels` getters,
`checkValidity()` and `reportValidity()`, and a `disabled` getter that's
true for the attribute *or* a disabled fieldset. Each component supplies
only the two things that genuinely differ: what it submits, and what
"reset" means for it. Where a component wraps a native control, it mirrors
that control's validity instead of re-implementing it, so `ds-text-field`
gets `type="email"` and `maxlength` validation from its inner `<input>` for
free.

Each one submits what the native element it replaces would. Text fields
submit `""` when empty. Checkboxes and switches submit nothing when
unchecked. A multiple combobox submits one entry per selection, like a
multi-select. Date and time pickers submit ISO strings. A form built from
these components produces the same `FormData` as one built from native
controls, which is the point.

## What applying it everywhere actually took

This note used to end differently. `ds-checkbox` was the only component
that implemented the pattern; CLAUDE.md documented it as the convention for
the whole category, and eight components ignored it. `ds-text-field`
already called `attachInternals()` but never declared itself
form-associated, so `new FormData(form)` silently left it out. Every
component passed its own test suite, because every suite tested the
component in isolation.

Extending the pattern turned out not to be the mechanical job it looked
like. Real form behaviour exercises paths isolated tests never reach, and
doing it properly surfaced bugs that had nothing to do with forms on the
surface:

- **Reset needs a record of the default.** Most components reflected the
  user's input back into the `value` or `checked` attribute, which is also
  where the default lived. Once the user typed or clicked, there was
  nothing left to reset to. Each now tracks its default separately, and
  only an author changing the attribute moves it, as with native controls.
- **Re-rendering destroyed state.** `ds-text-field` and `ds-textarea`
  rebuilt their inner control on any attribute change. That wiped what the
  user had typed and dropped the event listeners, so the ordinary
  validate-then-set-`error` flow erased the field and silenced it.
  `ds-textarea` also interpolated its value into the markup, so a value
  containing `</textarea>` was parsed as HTML.
- **Radio groups were document-wide.** Groups were found with a global
  attribute selector, so same-name radios in two different forms unchecked
  each other. They now group the way native radios do: same name, same
  form, same tree. `required` is a group property, as it is natively.
- **The date picker was off by a day.** `new Date("2026-06-15")` is UTC
  midnight. Verified with Chromium's timezone override: in New York,
  clicking the 15th stored `2026-06-14`. In Tokyo, `min="2026-06-10"`
  disabled the 10th itself.
- **`disabled="false"` is disabled.** The combobox's setter wrote the
  string `"false"` instead of removing the attribute. The platform treats
  the attribute's presence as disabled, whatever its value.

A final test puts all nine components in one `<form>` and submits it for
real. It caught one more bug on its first run: the slider's value setter
wrote the attribute that reset read back as the default, so a value set
from code survived a reset.

## The lesson

"The architecture is right" and "the architecture is applied" were
different claims, and the gap between them held about a dozen real bugs.
The pattern was never the hard part. The hard part is that a component
only proves it works in a form by being tested in a form. That's why every
one of these components now has tests that check what a `<form>` actually
submits, not only what the component does on its own.
