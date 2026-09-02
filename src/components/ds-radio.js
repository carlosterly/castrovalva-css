/**
 * Material Design 3 Radio Button Component
 * Implements MD3 radio button with state layers and accessibility
 *
 * @attr {string} size - Size of the radio (sm, md, lg)
 *
 * @cssprop --ds-radio-size - Size of the radio (default: var(--ds-size-icon-md))
 * @cssprop --ds-radio-dot-size - Size of the inner dot (default: calc(var(--ds-radio-size) / 2))
 * @cssprop --ds-radio-state-layer-size - Size of the state layer (default: var(--ds-size-hit-area))
 */
export class DSRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._checked = false;
    this._disabled = false;
    this._error = false;
    this._name = "";
    this._value = "";
  }

  static get observedAttributes() {
    return ["checked", "disabled", "error", "name", "value", "size"];
  }

  connectedCallback() {
    this.render();
    this.updateSize();
    this.setupEventListeners();
    this.updateRadioGroup();

    // Set ARIA attributes
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "radio");
    }
    this.setAttribute("tabindex", this.disabled ? "-1" : "0");
    this.setAttribute("aria-checked", this.checked ? "true" : "false");
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "checked":
        this._checked = newValue !== null;
        this.setAttribute("aria-checked", this._checked ? "true" : "false");
        if (this._checked) {
          this.updateRadioGroup();
        }
        break;
      case "disabled":
        this._disabled = newValue !== null;
        this.setAttribute("tabindex", this._disabled ? "-1" : "0");
        this.setAttribute("aria-disabled", this._disabled ? "true" : "false");
        break;
      case "error":
        this._error = newValue !== null;
        break;
      case "name":
        this._name = newValue || "";
        break;
      case "value":
        this._value = newValue || "";
        break;
      case "size":
        this.updateSize();
        break;
    }

    this.render();
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
      this.style.setProperty("--ds-radio-size", sizeMap[size].icon);
      this.style.setProperty(
        "--ds-radio-dot-size",
        `calc(${sizeMap[size].icon} / 2)`,
      );
      this.style.setProperty(
        "--ds-radio-state-layer-size",
        sizeMap[size].control,
      );
      return;
    }

    this.style.removeProperty("--ds-radio-size");
    this.style.removeProperty("--ds-radio-dot-size");
    this.style.removeProperty("--ds-radio-state-layer-size");
  }

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

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get error() {
    return this._error;
  }

  set error(value) {
    const hasError = Boolean(value);
    if (hasError) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this.setAttribute("name", value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  get size() {
    return this.getAttribute("size") || "";
  }

  set size(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("size");
      return;
    }
    this.setAttribute("size", String(value));
  }

  setupEventListeners() {
    // Handle click
    this.addEventListener("click", this.handleClick.bind(this));

    // Handle keyboard
    this.addEventListener("keydown", this.handleKeydown.bind(this));

    // Handle focus for ripple
    this.addEventListener("focus", () => {
      this.shadowRoot.querySelector(".radio").classList.add("focused");
    });

    this.addEventListener("blur", () => {
      this.shadowRoot.querySelector(".radio").classList.remove("focused");
    });
  }

  handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    if (!this.checked) {
      this.checked = true;
      this.dispatchEvent(
        new CustomEvent("ds-radio:change", {
          bubbles: true,
          composed: true,
          detail: {
            checked: true,
            value: this.value,
            name: this.name,
          },
        }),
      );
    }
  }

  handleKeydown(e) {
    if (this.disabled) return;

    // Space or Enter to select
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!this.checked) {
        this.checked = true;
        this.dispatchEvent(
          new CustomEvent("ds-radio:change", {
            bubbles: true,
            composed: true,
            detail: {
              checked: true,
              value: this.value,
              name: this.name,
            },
          }),
        );
      }
      return;
    }

    // Arrow keys to navigate radio group
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      this.navigateRadioGroup(e.key);
    }
  }

  navigateRadioGroup(key) {
    if (!this.name) return;

    // Get all radios with the same name
    const radios = Array.from(
      document.querySelectorAll(`ds-radio[name="${this.name}"]`),
    ).filter((radio) => !radio.disabled);

    const currentIndex = radios.indexOf(this);
    if (currentIndex === -1) return;

    let nextIndex;
    if (key === "ArrowDown" || key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % radios.length;
    } else {
      nextIndex = (currentIndex - 1 + radios.length) % radios.length;
    }

    const nextRadio = radios[nextIndex];
    nextRadio.focus();
    nextRadio.checked = true;
  }

  updateRadioGroup() {
    if (!this.checked || !this.name) return;

    // Uncheck other radios with the same name
    const radios = document.querySelectorAll(`ds-radio[name="${this.name}"]`);
    radios.forEach((radio) => {
      if (radio !== this && radio.checked) {
        radio.checked = false;
      }
    });
  }

  render() {
    const checked = this.checked;
    const disabled = this.disabled;
    const error = this.error;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          height: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          cursor: pointer;
          --ds-radio-dot-size: calc(
            var(--ds-radio-size, var(--ds-size-icon-md, 20px)) / 2
          );
        }

        :host([disabled]) {
          cursor: not-allowed;
          opacity: 0.38;
        }

        .radio {
          position: relative;
          width: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          height: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* State layer container */
        .state-layer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: var(--ds-radio-state-layer-size, var(--ds-size-hit-area, 40px));
          height: var(--ds-radio-state-layer-size, var(--ds-size-hit-area, 40px));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        /* Hover state */
        :host(:not([disabled]):hover) .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.08);
        }

        :host([checked]:not([disabled]):hover) .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.08);
        }

        /* Focus state */
        .radio.focused .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.12);
        }

        :host([checked]) .radio.focused .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.12);
        }

        /* Pressed state */
        :host(:not([disabled]):active) .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.12);
        }

        :host([checked]:not([disabled]):active) .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.12);
        }

        /* Outer circle */
        .outer-circle {
          width: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          height: var(--ds-radio-size, var(--ds-size-icon-md, 20px));
          border-radius: 50%;
          border: 2px solid var(--md-sys-color-on-surface-variant);
          box-sizing: border-box;
          transition: border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          position: relative;
        }

        :host([checked]) .outer-circle {
          border-color: var(--md-sys-color-primary);
          border-width: 2px;
        }

        :host([error]) .outer-circle {
          border-color: var(--md-sys-color-error);
        }

        :host([checked][error]) .outer-circle {
          border-color: var(--md-sys-color-error);
        }

        /* Inner circle (dot) */
        .inner-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: var(--ds-radio-dot-size, 10px);
          height: var(--ds-radio-dot-size, 10px);
          border-radius: 50%;
          background-color: var(--md-sys-color-primary);
          transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        :host([checked]) .inner-circle {
          transform: translate(-50%, -50%) scale(1);
        }

        :host([error]) .inner-circle {
          background-color: var(--md-sys-color-error);
        }

        /* Disabled state */
        :host([disabled]) .outer-circle {
          border-color: var(--md-sys-color-on-surface);
        }

        :host([disabled]) .inner-circle {
          background-color: var(--md-sys-color-on-surface);
        }
      </style>
      
      <div class="radio">
        <div class="state-layer">
          <div class="outer-circle">
            <div class="inner-circle"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-radio", DSRadio);
