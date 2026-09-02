/**
 * Material Design 3 Checkbox Component
 *
 * A checkbox component that follows Material Design 3 specifications with
 * support for checked, unchecked, and indeterminate states, along with
 * disabled and error states.
 *
 * @element ds-checkbox
 *
 * @attr {boolean} checked - Whether the checkbox is checked
 * @attr {boolean} indeterminate - Whether the checkbox is in indeterminate state
 * @attr {boolean} disabled - Whether the checkbox is disabled
 * @attr {boolean} error - Whether the checkbox is in error state
 * @attr {string} label - Label text for the checkbox
 * @attr {string} value - Value of the checkbox (for form submission)
 * @attr {string} name - Name of the checkbox (for form submission)
 * @attr {boolean} required - Whether the checkbox is required
 * @attr {string} size - Size of the checkbox (sm, md, lg)
 *
 * @fires ds-checkbox:change - Fired when the checkbox state changes
 *
 * @csspart container - The checkbox container
 * @csspart input - The native checkbox input (hidden)
 * @csspart icon - The checkbox icon
 * @csspart label - The checkbox label
 * @csspart state-layer - The state layer for interaction feedback
 *
 * @cssprop --ds-checkbox-size - Size of the checkbox (default: var(--ds-size-icon-md))
 * @cssprop --ds-checkbox-icon-size - Size of the checkbox icon (default: var(--ds-size-icon-md))
 * @cssprop --ds-checkbox-state-layer-size - Size of the state layer (default: var(--ds-size-hit-area))
 */
class DSCheckbox extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes() {
    return [
      "checked",
      "indeterminate",
      "disabled",
      "error",
      "label",
      "value",
      "name",
      "required",
      "size",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals?.() || null;
    this._checked = false;
    this._indeterminate = false;
  }

  connectedCallback() {
    this.render();
    this.updateSize();
    this.setupEventListeners();
    this.updateAccessibility();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "checked":
        this._checked = this.hasAttribute("checked");
        this.updateCheckState();
        this.updateAccessibility();
        break;
      case "indeterminate":
        this._indeterminate = this.hasAttribute("indeterminate");
        this.updateCheckState();
        this.updateAccessibility();
        break;
      case "disabled":
      case "error":
      case "required":
        this.updateAccessibility();
        break;
      case "label":
        this.updateLabel();
        break;
      case "value":
      case "name":
        this.updateInput();
        break;
      case "size":
        this.updateSize();
        break;
    }
  }

  setupEventListeners() {
    this._handleClick = this.handleClick.bind(this);
    this._handleKeyDown = this.handleKeyDown.bind(this);

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  removeEventListeners() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    // Don't toggle if clicking on the label text (it will trigger click again)
    if (event.target === this) {
      this.toggle();
    }
  }

  handleKeyDown(event) {
    if (this.disabled) return;

    // Space key toggles the checkbox
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      this.toggle();
    }
  }

  toggle() {
    if (this.disabled) return;

    // Indeterminate state goes to checked when toggled
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }

    this.dispatchChangeEvent();
  }

  dispatchChangeEvent() {
    const event = new CustomEvent("ds-checkbox:change", {
      detail: {
        checked: this.checked,
        indeterminate: this.indeterminate,
        value: this.value,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    // Also dispatch native change event for form compatibility
    const nativeEvent = new Event("change", { bubbles: true });
    this.dispatchEvent(nativeEvent);
  }

  updateCheckState() {
    const icon = this.shadowRoot.querySelector(".checkbox-icon");
    if (!icon) return;

    const container = this.shadowRoot.querySelector(".checkbox-container");

    if (this.indeterminate) {
      icon.textContent = "indeterminate_check_box";
      container?.classList.add("indeterminate");
      container?.classList.remove("checked");
    } else if (this.checked) {
      icon.textContent = "check_box";
      container?.classList.add("checked");
      container?.classList.remove("indeterminate");
    } else {
      icon.textContent = "check_box_outline_blank";
      container?.classList.remove("checked", "indeterminate");
    }

    // Update form internals if available
    if (this._internals) {
      this._internals.setFormValue(this.checked ? this.value || "on" : null);
    }
  }

  updateLabel() {
    const label = this.shadowRoot.querySelector(".checkbox-label");
    if (label) {
      label.textContent = this.label || "";
      label.style.display = this.label ? "" : "none";
    }
  }

  updateInput() {
    const input = this.shadowRoot.querySelector("input");
    if (input) {
      input.value = this.value || "";
      input.name = this.name || "";
    }
  }

  updateAccessibility() {
    // Update ARIA attributes
    this.setAttribute("role", "checkbox");
    this.setAttribute(
      "aria-checked",
      this.indeterminate ? "mixed" : String(this.checked),
    );

    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
      this.setAttribute("tabindex", "-1");
    } else {
      this.removeAttribute("aria-disabled");
      this.setAttribute("tabindex", "0");
    }

    if (this.error) {
      this.setAttribute("aria-invalid", "true");
    } else {
      this.removeAttribute("aria-invalid");
    }

    if (this.required) {
      this.setAttribute("aria-required", "true");
    } else {
      this.removeAttribute("aria-required");
    }

    if (this.label) {
      this.setAttribute("aria-label", this.label);
    }
  }

  updateSize() {
    const size = (this.getAttribute("size") || "").toLowerCase();
    const sizeMap = {
      sm: {
        icon: "var(--ds-size-icon-sm)",
        control: "var(--ds-size-control-sm)",
      },
      md: {
        icon: "var(--ds-size-icon-md)",
        control: "var(--ds-size-control-md)",
      },
      lg: {
        icon: "var(--ds-size-icon-lg)",
        control: "var(--ds-size-control-lg)",
      },
    };

    if (sizeMap[size]) {
      this.style.setProperty("--ds-checkbox-size", sizeMap[size].icon);
      this.style.setProperty("--ds-checkbox-icon-size", sizeMap[size].icon);
      this.style.setProperty(
        "--ds-checkbox-state-layer-size",
        sizeMap[size].control,
      );
      return;
    }

    this.style.removeProperty("--ds-checkbox-size");
    this.style.removeProperty("--ds-checkbox-icon-size");
    this.style.removeProperty("--ds-checkbox-state-layer-size");
  }

  // Public API
  get checked() {
    return this._checked;
  }

  set checked(value) {
    const isChecked = Boolean(value);
    if (isChecked) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }

  get indeterminate() {
    return this._indeterminate;
  }

  set indeterminate(value) {
    const isIndeterminate = Boolean(value);
    if (isIndeterminate) {
      this.setAttribute("indeterminate", "");
    } else {
      this.removeAttribute("indeterminate");
    }
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (Boolean(value)) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get error() {
    return this.hasAttribute("error");
  }

  set error(value) {
    if (Boolean(value)) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value) {
    if (Boolean(value)) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(value) {
    this.setAttribute("label", String(value));
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(val) {
    this.setAttribute("value", String(val));
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  set name(val) {
    this.setAttribute("name", String(val));
  }

  get size() {
    return this.getAttribute("size") || "";
  }

  set size(val) {
    if (val === null || val === undefined || val === "") {
      this.removeAttribute("size");
      return;
    }
    this.setAttribute("size", String(val));
  }

  focus() {
    super.focus();
  }

  blur() {
    super.blur();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--md-sys-spacing-3, 12px);
          cursor: pointer;
          user-select: none;
          outline: none;
          position: relative;
        }

        :host(:focus-visible) {
          outline: none;
        }

        :host([error]) {
          --ds-focus-ring-color: var(--md-sys-color-error, #ba1a1a);
        }

        :host([disabled]) {
          cursor: not-allowed;
          opacity: 0.38;
        }

        /* Hidden native input for form integration */
        input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 0;
          height: 0;
        }

        .checkbox-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ds-checkbox-state-layer-size, var(--ds-size-hit-area, 40px));
          height: var(--ds-checkbox-state-layer-size, var(--ds-size-hit-area, 40px));
          flex-shrink: 0;
        }

        /* State layer */
        .state-layer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0;
          background-color: var(--md-sys-color-on-surface, #1d1b20);
          transition: opacity var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
        }

        :host(:hover) .state-layer {
          opacity: var(--md-sys-state-hover-state-layer-opacity, 0.08);
        }

        :host(:focus-visible) .state-layer {
          opacity: var(--md-sys-state-focus-state-layer-opacity, 0.12);
        }

        :host(:active) .state-layer {
          opacity: var(--md-sys-state-pressed-state-layer-opacity, 0.12);
        }

        .checkbox-container.checked .state-layer,
        .checkbox-container.indeterminate .state-layer {
          background-color: var(--md-sys-color-primary, #6750a4);
        }

        :host([error]) .state-layer {
          background-color: var(--md-sys-color-error, #ba1a1a);
        }

        :host([disabled]) .state-layer {
          display: none;
        }

        /* Checkbox icon */
        .checkbox-icon {
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-checkbox-icon-size, var(--ds-size-icon-md, 18px));
          width: var(--ds-checkbox-size, var(--ds-size-icon-md, 18px));
          height: var(--ds-checkbox-size, var(--ds-size-icon-md, 18px));
          color: var(--md-sys-color-on-surface-variant, #49454f);
          transition: color var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox-container.checked .checkbox-icon,
        .checkbox-container.indeterminate .checkbox-icon {
          color: var(--md-sys-color-primary, #6750a4);
        }

        :host([error]) .checkbox-icon {
          color: var(--md-sys-color-error, #ba1a1a);
        }

        :host([error]) .checkbox-container.checked .checkbox-icon,
        :host([error]) .checkbox-container.indeterminate .checkbox-icon {
          color: var(--md-sys-color-error, #ba1a1a);
        }

        /* Label */
        .checkbox-label {
          font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-body-large-size, 1rem);
          font-weight: var(--md-sys-typescale-body-large-weight, 400);
          line-height: var(--md-sys-typescale-body-large-line-height, 1.5rem);
          letter-spacing: var(--md-sys-typescale-body-large-tracking, 0.03125rem);
          color: var(--md-sys-color-on-surface, #1d1b20);
        }

        :host([disabled]) .checkbox-label {
          color: var(--md-sys-color-on-surface, #1d1b20);
        }

        :host([error]) .checkbox-label {
          color: var(--md-sys-color-error, #ba1a1a);
        }

        /* Focus indicator */
        :host(:focus-visible) .checkbox-container::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            0 0 0 var(--ds-focus-ring-offset, 2px) transparent,
            0 0 0 calc(var(--ds-focus-ring-offset, 2px) + var(--ds-focus-ring-width, 2px))
              var(--ds-focus-ring-color, var(--md-sys-color-primary, #6750a4));
          pointer-events: none;
        }
      </style>

      <input
        type="checkbox"
        part="input"
        tabindex="-1"
        aria-hidden="true"
      />
      
      <div class="checkbox-container" part="container">
        <div class="state-layer" part="state-layer"></div>
        <span class="checkbox-icon" part="icon">check_box_outline_blank</span>
      </div>
      
      <span class="checkbox-label" part="label"></span>
    `;

    // Initialize state
    this.updateCheckState();
    this.updateLabel();
    this.updateInput();
  }
}

// Register the custom element
if (!customElements.get("ds-checkbox")) {
  customElements.define("ds-checkbox", DSCheckbox);
}

export default DSCheckbox;
