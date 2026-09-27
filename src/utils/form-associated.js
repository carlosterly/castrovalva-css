/**
 * Form association for the input and selection components
 *
 * Makes a custom element a real participant in an enclosing `<form>`: its
 * value appears in `FormData` and submission, `required` blocks submission,
 * the form's reset restores it, and a disabled `<fieldset>` disables it.
 *
 *   class DSSwitch extends FormAssociated(HTMLElement) {
 *     // Call whenever the value, checked state or required-ness changes:
 *     //   this._setFormState(this.checked ? this.value || "on" : null, {
 *     //     valueMissing: this.required && !this.checked,
 *     //   });
 *     // Implement formResetCallback() to restore the initial state.
 *     // Read this.disabled — it includes a disabled <fieldset>.
 *   }
 *
 * `ds-form` doesn't depend on any of this: it reads `.value` / `.checked`
 * from its fields directly.
 *
 * @module form-associated
 */

const VALUE_MISSING = "Please fill out this field.";

/**
 * @template {typeof HTMLElement} T
 * @param {T} Base
 */
export const FormAssociated = (Base) =>
  class extends Base {
    static formAssociated = true;

    constructor() {
      super();
      this._internals = this.attachInternals();
      this._formDisabled = false;
    }

    /** The `<form>` this element belongs to, or null. */
    get form() {
      return this._internals.form;
    }

    get name() {
      return this.getAttribute("name") || "";
    }

    set name(value) {
      this.setAttribute("name", String(value));
    }

    /**
     * True when the `disabled` attribute is set or an ancestor `<fieldset>`
     * is disabled. Components read this rather than the attribute.
     */
    get disabled() {
      return this.hasAttribute("disabled") || this._formDisabled;
    }

    set disabled(value) {
      this.toggleAttribute("disabled", Boolean(value));
    }

    get validity() {
      return this._internals.validity;
    }

    get validationMessage() {
      return this._internals.validationMessage;
    }

    get willValidate() {
      return this._internals.willValidate;
    }

    get labels() {
      return this._internals.labels;
    }

    checkValidity() {
      return this._internals.checkValidity();
    }

    reportValidity() {
      return this._internals.reportValidity();
    }

    /** Called by the platform when an ancestor `<fieldset>` toggles. */
    formDisabledCallback(disabled) {
      this._formDisabled = disabled;
      this._onDisabledChange?.();
    }

    /**
     * Report the submitted value and validity to the form.
     *
     * @param {string|FormData|null} value - null leaves the field out of the
     *   submission (an unchecked box, an empty picker)
     * @param {object} [validity]
     * @param {boolean} [validity.valueMissing] - The field is required and empty
     * @param {ValidityState} [validity.from] - Mirror a native control's
     *   validity (type, pattern, min/max…) instead
     * @param {string} [validity.message] - Message for `from`
     * @param {HTMLElement} [validity.anchor] - Where the browser points its
     *   validation bubble; defaults to the host
     */
    _setFormState(value, { valueMissing = false, from, message, anchor } = {}) {
      this._internals.setFormValue(value);

      if (from && !from.valid) {
        this._internals.setValidity(from, message, anchor);
      } else if (valueMissing) {
        this._internals.setValidity({ valueMissing: true }, VALUE_MISSING, anchor);
      } else {
        this._internals.setValidity({});
      }
    }
  };
