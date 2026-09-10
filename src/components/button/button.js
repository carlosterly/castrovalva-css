/**
 * DSButton - A Material Design 3 button component
 * @element ds-button
 *
 * @attr {string} variant - Button style variant: 'filled' | 'filled-tonal' | 'outlined' | 'elevated' | 'text' | 'danger'
 * @attr {string} size - Button size: 'small' | 'medium' | 'large'
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} loading - Shows loading state
 * @attr {string} type - Button type: 'button' | 'submit' | 'reset'
 *
 * @slot - Button content
 * @slot icon-left - Icon before text
 * @slot icon-right - Icon after text
 *
 * @fires {Event} ds-click - Fired when button is clicked
 *
 * @csspart button - The button element
 * @csspart content - The content wrapper
 */
export default class DSButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled", "loading", "type", "ripple"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._contentObserver = null;
    this._contentChangeScheduled = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupContentObserver();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    if (this._contentObserver) {
      this._contentObserver.disconnect();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Getters
  get variant() {
    return this.getAttribute("variant") || "filled";
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get loading() {
    return this.hasAttribute("loading");
  }

  set loading(value) {
    if (value) {
      this.setAttribute("loading", "");
    } else {
      this.removeAttribute("loading");
    }
  }

  get type() {
    return this.getAttribute("type") || "button";
  }

  set type(value) {
    this.setAttribute("type", value);
  }

  get ripple() {
    return this.hasAttribute("ripple");
  }

  set ripple(value) {
    if (value) {
      this.setAttribute("ripple", "");
    } else {
      this.removeAttribute("ripple");
    }
  }

  // Methods
  setupEventListeners() {
    this._button = this.shadowRoot.querySelector("button");
    if (this._button) {
      this._button.addEventListener("click", this.handleClick);

      // Add ripple effect if enabled
      if (this.ripple) {
        this._button.addEventListener("click", this.createRipple);
      }
    }
  }

  removeEventListeners() {
    if (this._button) {
      this._button.removeEventListener("click", this.handleClick);
      this._button.removeEventListener("click", this.createRipple);
    }
  }

  setupContentObserver() {
    if (this._contentObserver) {
      this._contentObserver.disconnect();
    }

    this._contentObserver = new MutationObserver(() => {
      if (this._contentChangeScheduled) return;
      this._contentChangeScheduled = true;
      requestAnimationFrame(() => {
        this._contentChangeScheduled = false;
        this.dispatchEvent(
          new CustomEvent("ds-button-content-change", {
            bubbles: true,
            composed: true,
          }),
        );
      });
    });

    this._contentObserver.observe(this, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  handleClick = (event) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Emit custom event
    this.dispatchEvent(
      new CustomEvent("ds-click", {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event },
      }),
    );
  };

  focus() {
    this._button?.focus();
  }

  blur() {
    this._button?.blur();
  }

  render() {
    const variant = this.variant;
    const size = this.size;
    const disabled = this.disabled;
    const loading = this.loading;
    const type = this.type;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --button-font-family: var(--md-sys-typescale-font-family);
          /* MD3 common buttons are fully rounded (stadium shape). */
          --button-border-radius: var(--ds-radius-full);
          --button-transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button {
          font-family: var(--button-font-family);
          font-weight: var(--ds-font-weight-medium);
          border: none;
          border-radius: var(--button-border-radius);
          cursor: pointer;
          transition: var(--button-transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ds-space-2);
          white-space: nowrap;
          text-decoration: none;
          user-select: none;
          position: relative;
          overflow: hidden;
          width: var(--ds-button-width, auto);
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.3;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* Sizes */
        button.small {
          --ds-button-padding-block-base: var(--ds-space-2);
          --ds-button-padding-inline-base: var(--ds-space-3);
          padding: var(--ds-button-padding-block, var(--ds-button-padding-block-base))
            var(--ds-button-padding-inline, var(--ds-button-padding-inline-base));
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: var(--md-sys-typescale-label-large-weight);
          letter-spacing: var(--md-sys-typescale-label-large-tracking);
          min-height: 32px;
        }

        button.medium {
          --ds-button-padding-block-base: var(--ds-space-3);
          --ds-button-padding-inline-base: var(--ds-space-4);
          padding: var(--ds-button-padding-block, var(--ds-button-padding-block-base))
            var(--ds-button-padding-inline, var(--ds-button-padding-inline-base));
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: var(--md-sys-typescale-label-large-weight);
          letter-spacing: var(--md-sys-typescale-label-large-tracking);
          min-height: 40px;
        }

        button.large {
          --ds-button-padding-block-base: var(--ds-space-4);
          --ds-button-padding-inline-base: var(--ds-space-6);
          padding: var(--ds-button-padding-block, var(--ds-button-padding-block-base))
            var(--ds-button-padding-inline, var(--ds-button-padding-inline-base));
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: var(--md-sys-typescale-label-large-weight);
          letter-spacing: var(--md-sys-typescale-label-large-tracking);
          min-height: 48px;
        }

        /* Variants - Material Design 3 */
        
        /* Filled Button - High emphasis */
        button.filled {
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          box-shadow: var(--md-sys-elevation-level0);
        }

        button.filled::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-primary);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.filled:hover:not(:disabled) {
          box-shadow: var(--md-sys-elevation-level1);
        }

        button.filled:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.filled:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.filled:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        /* Filled Tonal Button - Medium emphasis */
        button.filled-tonal {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          box-shadow: var(--md-sys-elevation-level0);
        }

        button.filled-tonal::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-secondary-container);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.filled-tonal:hover:not(:disabled) {
          box-shadow: var(--md-sys-elevation-level1);
        }

        button.filled-tonal:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.filled-tonal:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.filled-tonal:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        /* Outlined Button - Medium emphasis */
        button.outlined {
          background-color: transparent;
          color: var(--md-sys-color-primary);
          border: 1px solid var(--md-sys-color-outline);
        }

        button.outlined::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-primary);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.outlined:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.outlined:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.outlined:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        button.outlined:disabled {
          border-color: rgba(0, 0, 0, 0.12);
        }

        :host([data-theme="dark"]) button.outlined:disabled {
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* Elevated Button - Medium emphasis with shadow */
        button.elevated {
          background-color: var(--md-sys-color-surface-container-low);
          color: var(--md-sys-color-primary);
          box-shadow: var(--md-sys-elevation-level1);
        }

        button.elevated::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-primary);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.elevated:hover:not(:disabled) {
          box-shadow: var(--md-sys-elevation-level2);
        }

        button.elevated:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.elevated:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.elevated:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        button.elevated:disabled {
          background-color: rgba(0, 0, 0, 0.12);
          box-shadow: var(--md-sys-elevation-level0);
        }

        :host([data-theme="dark"]) button.elevated:disabled {
          background-color: rgba(255, 255, 255, 0.12);
        }

        /* Text Button - Low emphasis */
        button.text {
          background-color: transparent;
          color: var(--md-sys-color-primary);
          padding-inline: var(
            --ds-button-padding-inline,
            var(--ds-button-padding-inline-base, var(--ds-space-3))
          );
        }

        button.text::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-primary);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.text:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.text:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.text:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        /* Filled Button - Error (danger) */
        button.danger {
          background-color: var(--md-sys-color-error);
          color: var(--md-sys-color-on-error);
          box-shadow: var(--md-sys-elevation-level0);
        }

        button.danger::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-error);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        button.danger:hover:not(:disabled)::before {
          opacity: var(--md-sys-state-hover-opacity);
        }

        button.danger:focus-visible:not(:disabled)::before {
          opacity: var(--md-sys-state-focus-opacity);
        }

        button.danger:active:not(:disabled)::before {
          opacity: var(--md-sys-state-pressed-opacity);
        }

        /* States */
        button:disabled {
          cursor: not-allowed;
          opacity: 0.38;
          box-shadow: var(--md-sys-elevation-level0);
        }

        button:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        button.loading {
          color: transparent;
          pointer-events: none;
        }

        :host([selected]) button {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          box-shadow: var(--md-sys-elevation-level0);
        }

        :host([selected]) button.outlined {
          border-color: var(--md-sys-color-secondary);
        }


        /* Loading Spinner */
        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* Slots */
        .content {
          display: inline-flex;
          align-items: center;
          gap: var(--ds-space-2);
        }

        ::slotted([slot="icon-left"]),
        ::slotted([slot="icon-right"]) {
          display: inline-flex;
          flex-shrink: 0;
        }
      </style>

      <button
        part="button"
        class="${variant} ${size} ${loading ? "loading" : ""}"
        type="${type}"
        ${disabled ? "disabled" : ""}
        aria-disabled="${disabled || loading}"
        aria-busy="${loading}"
      >
        ${loading ? '<span class="spinner"></span>' : ""}
        <span class="content" part="content">
          <slot name="icon-left"></slot>
          <slot></slot>
          <slot name="icon-right"></slot>
        </span>
      </button>
    `;
  }
}

// Register the custom element
if (!customElements.get("ds-button")) {
  customElements.define("ds-button", DSButton);
}
