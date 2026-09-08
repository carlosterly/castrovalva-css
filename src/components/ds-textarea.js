/**
 * Material Design 3 Textarea Component
 * Multi-line text input with auto-resize and character counter
 */
export class DSTextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = "";
    this._disabled = false;
    this._error = false;
    this._variant = "filled"; // filled or outlined
    this._maxlength = null;
    this._rows = 3;
    this._autoResize = true;
  }

  static get observedAttributes() {
    return [
      "value",
      "disabled",
      "error",
      "variant",
      "label",
      "helper-text",
      "error-text",
      "maxlength",
      "rows",
      "auto-resize",
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "value": {
        this._value = newValue || "";
        // Don't re-render on value change from input event
        // Just update the textarea value if it exists
        const textarea = this.shadowRoot?.querySelector("textarea");
        if (textarea && textarea.value !== this._value) {
          textarea.value = this._value;
        }
        this.updateCounter();
        return; // Don't call render() for value changes
      }
      case "disabled":
        this._disabled = newValue !== null;
        break;
      case "error":
        this._error = newValue !== null;
        break;
      case "variant":
        this._variant = newValue || "filled";
        break;
      case "maxlength":
        this._maxlength = newValue ? parseInt(newValue) : null;
        break;
      case "rows":
        this._rows = newValue ? parseInt(newValue) : 3;
        break;
      case "auto-resize":
        this._autoResize = newValue !== null;
        break;
    }

    this.render();
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val || "";
    this.setAttribute("value", this._value);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    if (val) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get error() {
    return this._error;
  }

  set error(val) {
    if (val) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }

  get variant() {
    return this._variant;
  }

  set variant(val) {
    this.setAttribute("variant", val);
  }

  setupEventListeners() {
    const textarea = this.shadowRoot.querySelector("textarea");

    // Handle input
    textarea.addEventListener("input", (e) => {
      this._value = e.target.value;
      this.setAttribute("value", this._value);

      // Auto-resize
      if (this._autoResize) {
        this.autoResize(textarea);
      }

      // Update character counter
      this.updateCounter();

      // Dispatch custom event
      this.dispatchEvent(
        new CustomEvent("ds-textarea:input", {
          bubbles: true,
          composed: true,
          detail: {
            value: this._value,
          },
        }),
      );
    });

    // Handle focus
    textarea.addEventListener("focus", () => {
      this.shadowRoot
        .querySelector(".textarea-container")
        .classList.add("focused");
    });

    // Handle blur
    textarea.addEventListener("blur", () => {
      this.shadowRoot
        .querySelector(".textarea-container")
        .classList.remove("focused");

      this.dispatchEvent(
        new CustomEvent("ds-textarea:blur", {
          bubbles: true,
          composed: true,
          detail: {
            value: this._value,
          },
        }),
      );
    });
  }

  autoResize(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set height to scrollHeight
    textarea.style.height = textarea.scrollHeight + "px";
  }

  updateCounter() {
    const counter = this.shadowRoot.querySelector(".character-counter");
    if (counter && this._maxlength) {
      const current = this._value.length;
      const max = this._maxlength;
      counter.textContent = `${current} / ${max}`;
    }
  }

  render() {
    const label = this.getAttribute("label") || "";
    const helperText = this.getAttribute("helper-text") || "";
    const errorText = this.getAttribute("error-text") || "";
    const variant = this._variant;
    const disabled = this._disabled;
    const error = this._error;
    const showCounter = this._maxlength !== null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .textarea-container {
          position: relative;
          width: 100%;
          font-family: var(--md-sys-typescale-body-large-font-family-name);
        }

        /* Label */
        .label {
          position: absolute;
          left: 16px;
          top: 8px;
          font-size: var(--md-sys-typescale-body-large-font-size);
          color: var(--md-sys-color-on-surface-variant);
          pointer-events: none;
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
          background-color: transparent;
          padding: 0 4px;
          transform-origin: left center;
        }

        .textarea-container.focused .label,
        .textarea-container.has-value .label {
          top: -1px;
          font-size: var(--md-sys-typescale-body-small-font-size);
          color: var(--md-sys-color-primary);
        }

        .textarea-container[data-variant="outlined"] .label {
          background-color: transparent;
        }

        .textarea-container.error .label {
          color: var(--md-sys-color-error);
        }

        .textarea-container.focused.error .label {
          color: var(--md-sys-color-error);
        }

        /* Textarea - Filled variant */
        textarea {
          width: 100%;
          min-height: ${this._rows * 24}px;
          padding: 24px 16px 8px 16px;
          border: none;
          border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
          border-radius: 4px 4px 0 0;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-large-font-family-name);
          font-size: var(--md-sys-typescale-body-large-font-size);
          line-height: var(--md-sys-typescale-body-large-line-height);
          resize: ${this._autoResize ? "none" : "vertical"};
          box-sizing: border-box;
          outline: none;
          transition: border-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        .textarea-container[data-variant="outlined"] textarea {
          background-color: transparent;
          border: 1px solid var(--md-sys-color-outline);
          border-radius: 4px;
          padding: 16px;
        }

        /* Focus state */
        .textarea-container.focused textarea {
          border-bottom-color: var(--md-sys-color-primary);
          border-bottom-width: 2px;
          padding-bottom: 7px;
        }

        .textarea-container[data-variant="outlined"].focused textarea {
          border-color: var(--md-sys-color-primary);
          border-width: 2px;
          padding: 15px;
        }

        /* Error state */
        .textarea-container.error textarea {
          border-bottom-color: var(--md-sys-color-error);
        }

        .textarea-container[data-variant="outlined"].error textarea {
          border-color: var(--md-sys-color-error);
        }

        .textarea-container.error.focused textarea {
          border-bottom-width: 2px;
          padding-bottom: 7px;
        }

        .textarea-container[data-variant="outlined"].error.focused textarea {
          border-width: 2px;
          padding: 15px;
        }

        /* Disabled state */
        textarea:disabled {
          opacity: 0.38;
          cursor: not-allowed;
          background-color: var(--md-sys-color-surface-variant);
        }

        .textarea-container[data-variant="outlined"] textarea:disabled {
          background-color: transparent;
        }

        /* Supporting text container */
        .supporting-text {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 4px 16px 0 16px;
          min-height: 16px;
        }

        .helper-text,
        .error-text {
          font-size: var(--md-sys-typescale-body-small-font-size);
          line-height: var(--md-sys-typescale-body-small-line-height);
          color: var(--md-sys-color-on-surface-variant);
          flex: 1;
        }

        .error-text {
          color: var(--md-sys-color-error);
        }

        .character-counter {
          font-size: var(--md-sys-typescale-body-small-font-size);
          color: var(--md-sys-color-on-surface-variant);
          white-space: nowrap;
        }

        /* Hide helper text when error is shown */
        .textarea-container.error .helper-text {
          display: none;
        }

        .textarea-container:not(.error) .error-text {
          display: none;
        }
      </style>

      <div class="textarea-container ${this._value ? "has-value" : ""} ${
        error ? "error" : ""
      }" 
           data-variant="${variant}">
        ${label ? `<label class="label">${label}</label>` : ""}
        <textarea
          ${disabled ? "disabled" : ""}
          ${this._maxlength ? `maxlength="${this._maxlength}"` : ""}
          rows="${this._rows}"
          placeholder="${!label ? this.getAttribute("placeholder") || "" : ""}"
        >${this._value}</textarea>
      </div>

      ${
        helperText || errorText || showCounter
          ? `
        <div class="supporting-text">
          <span class="helper-text">${helperText}</span>
          <span class="error-text">${errorText}</span>
          ${
            showCounter
              ? `<span class="character-counter">${this._value.length} / ${this._maxlength}</span>`
              : ""
          }
        </div>
      `
          : ""
      }
    `;

    // Initial auto-resize
    if (this._autoResize && this._value) {
      setTimeout(() => {
        const textarea = this.shadowRoot.querySelector("textarea");
        if (textarea) {
          this.autoResize(textarea);
        }
      }, 0);
    }
  }
}

customElements.define("ds-textarea", DSTextarea);
