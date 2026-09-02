/**
 * Material Design 3 Switch Component
 * Implements MD3 switch with smooth animations and accessibility
 */
export class DSSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._checked = false;
    this._disabled = false;
    this._showIcons = false;
  }

  static get observedAttributes() {
    return ["checked", "disabled", "show-icons", "size"];
  }

  connectedCallback() {
    this.render();
    this.updateSize();
    this.setupEventListeners();

    // Set ARIA attributes
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "switch");
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
        break;
      case "disabled":
        this._disabled = newValue !== null;
        this.setAttribute("tabindex", this._disabled ? "-1" : "0");
        this.setAttribute("aria-disabled", this._disabled ? "true" : "false");
        break;
      case "show-icons":
        this._showIcons = newValue !== null;
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
      this.style.setProperty("--ds-switch-icon-size", sizeMap[size].icon);
      this.style.setProperty("--ds-switch-track-height", sizeMap[size].control);
      this.style.setProperty(
        "--ds-switch-track-width",
        `calc(${sizeMap[size].control} + 20px)`,
      );
      return;
    }

    this.style.removeProperty("--ds-switch-icon-size");
    this.style.removeProperty("--ds-switch-track-height");
    this.style.removeProperty("--ds-switch-track-width");
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

  get showIcons() {
    return this._showIcons;
  }

  set showIcons(value) {
    const show = Boolean(value);
    if (show) {
      this.setAttribute("show-icons", "");
    } else {
      this.removeAttribute("show-icons");
    }
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

    // Handle focus for visual feedback
    this.addEventListener("focus", () => {
      this.shadowRoot.querySelector(".switch-track").classList.add("focused");
    });

    this.addEventListener("blur", () => {
      this.shadowRoot
        .querySelector(".switch-track")
        .classList.remove("focused");
    });
  }

  handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    this.toggle();
  }

  handleKeydown(e) {
    if (this.disabled) return;

    // Space or Enter to toggle
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.toggle();
    }
  }

  toggle() {
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("ds-switch:change", {
        bubbles: true,
        composed: true,
        detail: {
          checked: this.checked,
        },
      }),
    );
  }

  render() {
    const checked = this.checked;
    const disabled = this.disabled;
    const showIcons = this.showIcons;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: var(
            --ds-switch-track-width,
            calc(var(--ds-switch-track-height, var(--ds-size-control-sm, 32px)) + 20px)
          );
          height: var(--ds-switch-track-height, var(--ds-size-control-sm, 32px));
          cursor: pointer;
          --ds-switch-icon-size: var(--ds-size-icon-md, 18px);
          --ds-switch-handle-size-off: calc(var(--ds-switch-icon-size) - 2px);
          --ds-switch-handle-size-on: calc(var(--ds-switch-icon-size) + 6px);
          --ds-switch-handle-size-pressed: calc(var(--ds-switch-icon-size) + 10px);
          --ds-switch-handle-icon-size: var(--ds-switch-icon-size);
          --ds-switch-handle-size: var(--ds-switch-handle-size-off);
          --ds-switch-handle-radius: calc(var(--ds-switch-handle-size) / 2);
          --ds-switch-handle-position: calc(2px + var(--ds-switch-handle-radius));
        }

        :host([checked]),
        :host([show-icons]) {
          --ds-switch-handle-size: var(--ds-switch-handle-size-on);
          --ds-switch-handle-radius: calc(var(--ds-switch-handle-size) / 2);
        }

        :host([checked]) {
          --ds-switch-handle-position: calc(100% - (2px + var(--ds-switch-handle-radius)));
        }

        :host([disabled]) {
          cursor: not-allowed;
          opacity: 0.38;
        }

        .switch-track {
          position: relative;
          width: var(
            --ds-switch-track-width,
            calc(var(--ds-switch-track-height, var(--ds-size-control-sm, 32px)) + 20px)
          );
          height: var(--ds-switch-track-height, var(--ds-size-control-sm, 32px));
          border-radius: calc(var(--ds-switch-track-height, var(--ds-size-control-sm, 32px)) / 2);
          background-color: var(--md-sys-color-surface-container-highest);
          border: 2px solid var(--md-sys-color-outline);
          box-sizing: border-box;
          transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
                      border-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        :host([checked]) .switch-track {
          background-color: var(--md-sys-color-primary);
          border-color: transparent;
        }

        /* State layer for focus/hover */
        .state-layer {
          position: absolute;
          top: 50%;
          left: var(--ds-switch-handle-position);
          transform: translate(-50%, -50%);
          width: var(--ds-switch-state-layer-size, var(--ds-size-hit-area, 40px));
          height: var(--ds-switch-state-layer-size, var(--ds-size-hit-area, 40px));
          border-radius: 50%;
          background-color: transparent;
          transition: left var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
                      background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          pointer-events: none;
        }

        /* Hover state */
        :host(:not([disabled]):hover) .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.08);
        }

        :host([checked]:not([disabled]):hover) .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.08);
        }

        /* Focus state */
        .switch-track.focused .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.12);
        }

        :host([checked]) .switch-track.focused .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.12);
        }

        /* Pressed state - handle expands to 28px */
        :host(:not([disabled]):active) .state-layer {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.12);
        }

        :host([checked]:not([disabled]):active) .state-layer {
          background-color: rgba(var(--md-sys-color-primary-rgb, 103, 80, 164), 0.12);
        }

        :host(:not([disabled]):active) .switch-handle {
          width: var(--ds-switch-handle-size-pressed) !important;
          height: var(--ds-switch-handle-size-pressed) !important;
        }

        /* Handle (thumb) */
        .switch-handle {
          position: absolute;
          top: 50%;
          left: var(--ds-switch-handle-position);
          transform: translate(-50%, -50%);
          width: var(--ds-switch-handle-size);
          height: var(--ds-switch-handle-size);
          border-radius: 50%;
          background-color: ${
            checked
              ? "var(--md-sys-color-on-primary)"
              : "var(--md-sys-color-outline)"
          };
          box-shadow: var(--ds-shadow-1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: left var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
                      width var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
                      height var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
                      background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }

        :host([disabled]) .switch-handle {
          background-color: var(--md-sys-color-on-surface);
          box-shadow: none;
        }

        /* Icon container - MD3: icons only show on selected state by default */
        .icon {
          width: var(--ds-switch-handle-icon-size);
          height: var(--ds-switch-handle-icon-size);
          display: ${checked && showIcons ? "flex" : "none"};
          align-items: center;
          justify-content: center;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .icon svg {
          width: var(--ds-switch-handle-icon-size);
          height: var(--ds-switch-handle-icon-size);
          fill: var(--md-sys-color-on-primary-container);
        }

        /* Disabled state */
        :host([disabled]) .switch-track {
          background-color: var(--md-sys-color-surface-container-highest);
          border-color: var(--md-sys-color-on-surface);
        }

        :host([checked][disabled]) .switch-track {
          background-color: var(--md-sys-color-on-surface);
          border-color: transparent;
        }
      </style>
      
      <div class="switch-track">
        <div class="state-layer"></div>
        <div class="switch-handle">
          <div class="icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-switch", DSSwitch);
