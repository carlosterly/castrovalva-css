/**
 * Material Design 3 Text Field Component
 *
 * Variants: filled (default), outlined
 * Types: text, email, password, number, tel, url
 * States: default, hover, focus, disabled, error
 *
 * @element ds-text-field
 *
 * @attr {string} variant - filled | outlined (default: filled)
 * @attr {string} type - text | email | password | number | tel | url (default: text)
 * @attr {string} label - Input label text
 * @attr {string} value - Input value
 * @attr {string} placeholder - Placeholder text
 * @attr {string} supporting-text - Helper text below input
 * @attr {string} error-text - Error message (shown when error attribute present)
 * @attr {boolean} disabled - Disabled state
 * @attr {boolean} error - Error state
 * @attr {boolean} required - Required field
 * @attr {number} maxlength - Maximum character length
 * @attr {boolean} show-counter - Show character counter
 *
 * @slot leading-icon - Icon before input
 * @slot trailing-icon - Icon after input
 *
 * @fires ds-text-field:change - Fired when value changes
 * @fires ds-text-field:input - Fired on input event
 * @fires ds-text-field:focus - Fired when input receives focus
 * @fires ds-text-field:blur - Fired when input loses focus
 *
 * @cssprop --ds-text-field-width - Width of text field (default: 100%)
 */
import { FormAssociated } from "../../utils/form-associated.js";

class DSTextField extends FormAssociated(HTMLElement) {
  static get observedAttributes() {
    return [
      "variant",
      "type",
      "label",
      "value",
      "placeholder",
      "supporting-text",
      "error-text",
      "disabled",
      "error",
      "required",
      "maxlength",
      "show-counter",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // The current value, kept across re-renders; null until first connect.
    this._value = null;
    this._handleSlotChange = () => this._updateIconState();
    this._onInput = this._handleInput.bind(this);
    this._onChange = this._handleChange.bind(this);
    this._onFocus = this._handleFocus.bind(this);
    this._onBlur = this._handleBlur.bind(this);
  }

  connectedCallback() {
    this._value ??= this.getAttribute("value") || "";
    this.render();
  }

  disconnectedCallback() {
    this._removeEventListeners();
    this._teardownSlotListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "value") this._value = newValue || "";
    if (this.isConnected) this.render();
  }

  formResetCallback() {
    this.value = this.getAttribute("value") || "";
  }

  _onDisabledChange() {
    this.render();
  }

  // Properties
  get variant() {
    return this.getAttribute("variant") || "filled";
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get type() {
    return this.getAttribute("type") || "text";
  }

  set type(value) {
    this.setAttribute("type", value);
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get value() {
    return this._value ?? this.getAttribute("value") ?? "";
  }

  set value(value) {
    this._value = value == null ? "" : String(value);
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = this._value;
      this._updateFloatingLabel();
      this._updateCharacterCounter();
      this._syncFormState();
    }
  }

  get error() {
    return this.hasAttribute("error");
  }

  set error(value) {
    if (value) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value) {
    if (value) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  }

  // Methods
  focus() {
    const input = this.shadowRoot?.querySelector("input");
    input?.focus();
  }

  blur() {
    const input = this.shadowRoot?.querySelector("input");
    input?.blur();
  }

  select() {
    const input = this.shadowRoot?.querySelector("input");
    input?.select();
  }

  // Submits like a native input, and mirrors its validity (required, type,
  // maxlength) so an invalid field blocks the enclosing form.
  _syncFormState() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;
    this._setFormState(this._value, {
      from: input.validity,
      message: input.validationMessage,
      anchor: input,
    });
  }

  // render() replaces the input, so listeners go on the new one each time.
  _setupEventListeners() {
    const input = this.shadowRoot.querySelector("input");
    if (input) {
      input.addEventListener("input", this._onInput);
      input.addEventListener("change", this._onChange);
      input.addEventListener("focus", this._onFocus);
      input.addEventListener("blur", this._onBlur);
    }
  }

  _setupSlotListeners() {
    const leadingSlot = this.shadowRoot?.querySelector(
      'slot[name="leading-icon"]',
    );
    const trailingSlot = this.shadowRoot?.querySelector(
      'slot[name="trailing-icon"]',
    );

    leadingSlot?.addEventListener("slotchange", this._handleSlotChange);
    trailingSlot?.addEventListener("slotchange", this._handleSlotChange);

    this._updateIconState();
  }

  _teardownSlotListeners() {
    const leadingSlot = this.shadowRoot?.querySelector(
      'slot[name="leading-icon"]',
    );
    const trailingSlot = this.shadowRoot?.querySelector(
      'slot[name="trailing-icon"]',
    );

    leadingSlot?.removeEventListener("slotchange", this._handleSlotChange);
    trailingSlot?.removeEventListener("slotchange", this._handleSlotChange);
  }

  _updateIconState() {
    const container = this.shadowRoot?.querySelector(".text-field");
    const leadingSlot = this.shadowRoot?.querySelector(
      'slot[name="leading-icon"]',
    );
    const trailingSlot = this.shadowRoot?.querySelector(
      'slot[name="trailing-icon"]',
    );

    if (!container || !leadingSlot || !trailingSlot) return;

    const hasLeading =
      leadingSlot.assignedElements({ flatten: true }).length > 0;
    const hasTrailing =
      trailingSlot.assignedElements({ flatten: true }).length > 0;

    container.classList.toggle("has-leading-icon", hasLeading);
    container.classList.toggle("has-trailing-icon", hasTrailing);
  }

  _removeEventListeners() {
    const input = this.shadowRoot.querySelector("input");
    if (input) {
      input.removeEventListener("input", this._onInput);
      input.removeEventListener("change", this._onChange);
      input.removeEventListener("focus", this._onFocus);
      input.removeEventListener("blur", this._onBlur);
    }
  }

  _handleInput(e) {
    this._value = e.target.value;
    this._syncFormState();
    this._updateFloatingLabel();
    this._updateCharacterCounter();

    this.dispatchEvent(
      new CustomEvent("ds-text-field:input", {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value,
        },
      }),
    );
  }

  _handleChange(e) {
    this.dispatchEvent(
      new CustomEvent("ds-text-field:change", {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value,
        },
      }),
    );
  }

  _handleFocus(e) {
    const container = this.shadowRoot.querySelector(".text-field");
    container?.classList.add("focused");

    this.dispatchEvent(
      new CustomEvent("ds-text-field:focus", {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value,
        },
      }),
    );
  }

  _handleBlur(e) {
    const container = this.shadowRoot.querySelector(".text-field");
    container?.classList.remove("focused");
    this._updateFloatingLabel();

    this.dispatchEvent(
      new CustomEvent("ds-text-field:blur", {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value,
        },
      }),
    );
  }

  _updateFloatingLabel() {
    const input = this.shadowRoot.querySelector("input");
    const container = this.shadowRoot.querySelector(".text-field");

    if (input && container) {
      if (input.value || document.activeElement === input) {
        container.classList.add("populated");
      } else {
        container.classList.remove("populated");
      }
    }
  }

  _updateCharacterCounter() {
    if (!this.hasAttribute("show-counter")) return;

    const counter = this.shadowRoot.querySelector(".character-counter");
    const input = this.shadowRoot.querySelector("input");
    const maxLength = this.getAttribute("maxlength");

    if (counter && input && maxLength) {
      counter.textContent = `${input.value.length} / ${maxLength}`;
    }
  }

  render() {
    const variant = this.variant;
    const type = this.type;
    const label = this.label;
    const placeholder = this.getAttribute("placeholder") || "";
    const supportingText = this.getAttribute("supporting-text") || "";
    const errorText = this.getAttribute("error-text") || "";
    const maxLength = this.getAttribute("maxlength") || "";
    const showCounter = this.hasAttribute("show-counter");
    const disabled = this.disabled;
    const error = this.error;
    const required = this.required;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          inline-size: var(--ds-text-field-width, 100%);
          font-family: var(--md-sys-typescale-body-large-font);
        }

        .text-field {
          position: relative;
          display: flex;
          align-items: center;
          min-block-size: 56px;
          box-sizing: border-box;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        /* Filled variant */
        .text-field.filled {
          background-color: var(--md-sys-color-surface-container-highest);
          border-start-start-radius: var(--ds-radius-sm);
          border-start-end-radius: var(--ds-radius-sm);
        }

        .text-field.filled::after {
          content: '';
          position: absolute;
          inset-block-end: 0;
          inset-inline: 0;
          block-size: 1px;
          background-color: var(--md-sys-color-on-surface-variant);
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .text-field.filled.focused::after,
        .text-field.filled:hover::after {
          block-size: 2px;
          background-color: var(--md-sys-color-primary);
        }

        /* Outlined variant */
        .text-field.outlined {
          border: 1px solid var(--md-sys-color-outline);
          border-radius: var(--ds-radius-sm);
          background-color: transparent;
        }

        .text-field.outlined.focused,
        .text-field.outlined:hover {
          border-color: var(--md-sys-color-primary);
          box-shadow: inset 0 0 0 1px var(--md-sys-color-primary);
        }

        /* Error state */
        .text-field.error.filled::after {
          background-color: var(--md-sys-color-error);
        }

        .text-field.error.outlined {
          border-color: var(--md-sys-color-error);
        }

        /* Disabled state */
        .text-field.disabled {
          opacity: 0.38;
          pointer-events: none;
        }

        /* Input container */
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          inline-size: 100%;
          padding-inline: 16px;
          padding-block: 8px;
        }

        /* Label */
        .label {
          position: absolute;
          inset-inline-start: 16px;
          inset-block-start: 50%;
          transform: translateY(-50%);
          color: var(--md-sys-color-on-surface-variant);
          font-size: var(--md-sys-typescale-body-large-size);
          font-weight: var(--md-sys-typescale-body-large-weight);
          line-height: var(--md-sys-typescale-body-large-line-height);
          pointer-events: none;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          transform-origin: left center;
        }

        .text-field.populated .label,
        .text-field.focused .label {
          inset-block-start: 1px;
          transform: translateY(0) scale(0.75);
          color: var(--md-sys-color-primary);
        }

        .text-field.has-leading-icon .label {
          inset-inline-start: 52px;
        }

        .text-field.error .label {
          color: var(--md-sys-color-error);
        }

        /* Input */
        input {
          inline-size: 100%;
          block-size: 100%;
          border: none;
          background: transparent;
          outline: none;
          padding-block-start: 20px;
          padding-block-end: 4px;
          box-sizing: border-box;
          color: var(--md-sys-color-on-surface);
          font-size: var(--md-sys-typescale-body-large-size);
          font-weight: var(--md-sys-typescale-body-large-weight);
          line-height: var(--md-sys-typescale-body-large-line-height);
          font-family: inherit;
        }

        input::placeholder {
          color: var(--md-sys-color-on-surface-variant);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .text-field.populated input::placeholder,
        .text-field.focused input::placeholder {
          opacity: 1;
        }


        /* Icons */
        .leading-icon,
        .trailing-icon {
          display: flex;
          align-items: center;
          color: var(--md-sys-color-on-surface-variant);
          min-inline-size: 24px;
        }

        .leading-icon {
          margin-inline-end: 12px;
        }

        .trailing-icon {
          margin-inline-start: 12px;
        }

        /* Supporting text */
        .supporting-text-container {
          display: flex;
          justify-content: space-between;
          padding-inline: 16px;
          padding-block-start: 4px;
          min-block-size: 16px;
        }

        .supporting-text {
          font-size: var(--md-sys-typescale-body-small-size);
          font-weight: var(--md-sys-typescale-body-small-weight);
          line-height: var(--md-sys-typescale-body-small-line-height);
          color: var(--md-sys-color-on-surface-variant);
        }

        .text-field.error .supporting-text {
          color: var(--md-sys-color-error);
        }

        .character-counter {
          font-size: var(--md-sys-typescale-body-small-size);
          color: var(--md-sys-color-on-surface-variant);
          margin-inline-start: auto;
        }

        /* State layers */
        .text-field::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: currentColor;
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          pointer-events: none;
          border-radius: inherit;
        }

        .text-field:hover::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        .text-field.focused::before {
          opacity: var(--md-sys-state-focus-opacity);
        }
      </style>

      <div class="text-field ${variant} ${disabled ? "disabled" : ""} ${
        error ? "error" : ""
      }">
        <div class="input-container">
          <div class="leading-icon" part="leading-icon">
            <slot name="leading-icon"></slot>
          </div>
          
          ${
            label
              ? `<label class="label" part="label">${label}${
                  required ? " *" : ""
                }</label>`
              : ""
          }
          
          <input
            part="input"
            type="${type}"
            placeholder="${placeholder}"
            ${disabled ? "disabled" : ""}
            ${required ? "required" : ""}
            ${maxLength ? `maxlength="${maxLength}"` : ""}
            aria-invalid="${error}"
            aria-describedby="supporting-text"
            ${label ? `aria-label="${label}"` : ""}
          />
          
          <div class="trailing-icon" part="trailing-icon">
            <slot name="trailing-icon"></slot>
          </div>
        </div>
      </div>

      ${
        supportingText || errorText || showCounter
          ? `
        <div class="supporting-text-container" part="supporting-text-container">
          <div id="supporting-text" class="supporting-text" part="supporting-text">
            ${error && errorText ? errorText : supportingText}
          </div>
          ${
            showCounter
              ? `<div class="character-counter" part="character-counter">0 / ${maxLength}</div>`
              : ""
          }
        </div>
      `
          : ""
      }
    `;

    // Set through the DOM, not the template: a quote in the value would
    // otherwise end the attribute.
    this.shadowRoot.querySelector("input").value = this.value;
    this._setupEventListeners();
    this._syncFormState();

    this._teardownSlotListeners();
    this._setupSlotListeners();

    // Update floating label state if input has value
    requestAnimationFrame(() => {
      this._updateFloatingLabel();
      this._updateCharacterCounter();
    });
  }
}

customElements.define("ds-text-field", DSTextField);

export default DSTextField;
