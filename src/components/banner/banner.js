/**
 * Material Design 3 Banner Component
 * Prominent, persistent messaging for important information and optional actions
 */

export class DSBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._message = "";
    this._variant = "default"; // default, info, warning, error, success
    this._dismissible = true;
    this._open = false;
    this._boundClickHandler = this.handleRootClick.bind(this);
  }

  static get observedAttributes() {
    return ["message", "variant", "dismissible", "open"];
  }

  connectedCallback() {
    this._message = this.getAttribute("message") || "";
    this._variant = this.normalizeVariant(this.getAttribute("variant"));
    this._open = this.hasAttribute("open");

    this.render();
    this.setupEventListeners();

    // Set ARIA attributes
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", "Banner notification");
    if (!this._open) {
      this.setAttribute("aria-hidden", "true");
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "message":
        this._message = newValue || "";
        break;
      case "variant":
        this._variant = this.normalizeVariant(newValue);
        break;
      case "dismissible":
        this._dismissible = newValue !== "false" && newValue !== null;
        break;
      case "open":
        this._open = newValue !== null && newValue !== "false";
        this.setAttribute("aria-hidden", this._open ? "false" : "true");
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this.setAttribute("message", value);
  }

  get variant() {
    return this._variant;
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get dismissible() {
    return this._dismissible;
  }

  set dismissible(value) {
    if (value) {
      this.setAttribute("dismissible", "");
    } else {
      this.setAttribute("dismissible", "false");
    }
  }

  get open() {
    return this._open;
  }

  set open(value) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  /**
   * Show the banner
   * @param {Object} options - Configuration options
   * @param {string} options.message - Message to display
   * @param {string} options.variant - Visual variant (default, info, warning, error, success)
   */
  show(options = {}) {
    if (options.message) this._message = options.message;
    if (options.variant) this._variant = this.normalizeVariant(options.variant);

    this.open = true;
    this.render();

    // Announce to screen readers
    const liveRegion = this.shadowRoot.querySelector('[role="status"]');
    if (liveRegion) {
      liveRegion.textContent = this._message;
    }

    // Dispatch show event
    this.dispatchEvent(
      new CustomEvent("ds-banner:show", {
        bubbles: true,
        composed: true,
        detail: {
          message: this._message,
          variant: this._variant,
        },
      }),
    );
  }

  /**
   * Hide/dismiss the banner
   */
  hide() {
    this.open = false;

    // Dispatch dismiss event
    this.dispatchEvent(
      new CustomEvent("ds-banner:dismiss", {
        bubbles: true,
        composed: true,
        detail: {
          message: this._message,
        },
      }),
    );
  }

  setupEventListeners() {
    this.shadowRoot.removeEventListener("click", this._boundClickHandler);
    this.shadowRoot.addEventListener("click", this._boundClickHandler);
  }

  removeEventListeners() {
    this.shadowRoot.removeEventListener("click", this._boundClickHandler);
  }

  handleRootClick(e) {
    const dismissBtn = e.target.closest(".dismiss-button");
    if (dismissBtn) {
      this.hide();
      return;
    }

    const actionBtn = e.target.closest(".action-button");
    if (!actionBtn) {
      return;
    }

    const actionIndex = Number.parseInt(actionBtn.dataset.index || "0", 10);
    this.dispatchEvent(
      new CustomEvent("ds-banner:action", {
        bubbles: true,
        composed: true,
        detail: {
          actionIndex,
          message: this._message,
        },
      }),
    );
  }

  normalizeVariant(value) {
    const validVariants = ["default", "info", "warning", "error", "success"];
    return validVariants.includes(value) ? value : "default";
  }

  getVariantIcon() {
    const icons = {
      info: "info",
      warning: "warning",
      error: "error",
      success: "check_circle",
      default: "campaign",
    };
    return icons[this._variant] || icons.default;
  }

  getVariantColor() {
    const colors = {
      info: "var(--md-sys-color-primary)",
      warning: "var(--md-sys-color-tertiary)",
      error: "var(--md-sys-color-error)",
      success: "var(--md-sys-color-tertiary)",
      default: "var(--md-sys-color-primary)",
    };
    return colors[this._variant] || colors.default;
  }

  render() {
    const icon = this.getVariantIcon();
    const iconColor = this.getVariantColor();
    const hasIcon = this.querySelector('[slot="icon"]') !== null;
    const hasSupporting =
      this.querySelector('[slot="supporting-text"]') !== null;
    const hasActions = this.querySelector('[slot="actions"]') !== null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          inline-size: 100%;
          box-sizing: border-box;
          --ds-banner-max-block-size: 31.25rem;
          --ds-banner-padding-inline: var(--ds-space-4);
          --ds-banner-padding-block: var(--ds-space-4);
          --ds-banner-gap: var(--ds-space-4);
          --ds-banner-icon-size: var(--ds-size-icon-lg);
          --ds-banner-action-gap: var(--ds-space-2);
          --ds-banner-dismiss-size: var(--ds-size-control-md);
          /* Hidden by default */
          max-block-size: 0;
          overflow: hidden;
          transition: max-block-size var(--md-sys-motion-duration-medium2, 300ms) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
        }

        :host([open]) {
          max-block-size: var(--ds-banner-max-block-size);
        }

        .banner {
          display: flex;
          align-items: center;
          gap: var(--ds-banner-gap);
          padding-inline: var(--ds-banner-padding-inline);
          padding-block: var(--ds-banner-padding-block);
          background-color: var(--md-sys-color-surface-container-low);
          border-block-end: 1px solid var(--md-sys-color-outline-variant);
          box-sizing: border-box;
        }

        /* Icon area */
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: ${iconColor};
        }

        .icon-container ::slotted(*) {
          inline-size: var(--ds-banner-icon-size);
          block-size: var(--ds-banner-icon-size);
        }

        .default-icon {
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-banner-icon-size);
          font-weight: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'liga';
        }

        /* Content area */
        .content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-inline-size: 0;
        }

        .content.has-supporting {
          flex-direction: column;
        }

        .message {
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-medium-font, Roboto, sans-serif);
          font-size: var(--md-sys-typescale-body-medium-size, 0.875rem);
          font-weight: var(--md-sys-typescale-body-medium-weight, 400);
          line-height: var(--md-sys-typescale-body-medium-line-height, 1.43);
          letter-spacing: var(--md-sys-typescale-body-medium-tracking, 0.0178571429em);
          margin: 0;
        }

        .supporting-text {
          color: var(--md-sys-color-on-surface-variant);
          font-family: var(--md-sys-typescale-body-small-font, Roboto, sans-serif);
          font-size: var(--md-sys-typescale-body-small-size, 0.75rem);
          font-weight: var(--md-sys-typescale-body-small-weight, 400);
          line-height: var(--md-sys-typescale-body-small-line-height, 1.33);
          margin: 0;
          display: none;
        }

        .supporting-text.has-content {
          display: block;
          margin-block-start: var(--ds-space-2);
        }

        /* Actions area */
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ds-banner-action-gap);
          flex-wrap: wrap;
          margin-block-start: var(--ds-space-2);
          margin-inline-start: auto;
        }

        .actions ::slotted(ds-button) {
          margin: 0;
        }

        /* Dismiss button */
        .dismiss-button {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          inline-size: var(--ds-banner-dismiss-size);
          block-size: var(--ds-banner-dismiss-size);
          border: none;
          background: transparent;
          color: var(--md-sys-color-on-surface-variant);
          border-radius: var(--md-sys-shape-corner-full, 50%);
          cursor: pointer;
          position: relative;
          transition: background-color var(--md-sys-motion-duration-short4, 200ms);
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-banner-icon-size);
          padding: 0;
        }

        .dismiss-button:hover {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        .dismiss-button:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        .dismiss-button:active {
          background-color: var(--md-sys-color-surface-container-high);
        }

        .dismiss-button::before {
          content: 'close';
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Responsive - Stack on mobile */
        @media (max-inline-size: 640px) {
          .banner {
            flex-direction: column;
            gap: var(--ds-space-3);
          }

          .actions {
            inline-size: 100%;
          }
        }
      </style>

      <div class="banner" part="container">
        <!-- Icon -->
        <div class="icon-container" part="icon">
          ${
            hasIcon
              ? '<slot name="icon"></slot>'
              : `<span class="default-icon" aria-hidden="true">${icon}</span>`
          }
        </div>

        <!-- Content -->
        <div class="content ${hasSupporting ? "has-supporting" : ""}" part="content">
          <div class="message" part="message">
            ${this._message || "<slot></slot>"}
          </div>
          <div class="supporting-text ${hasSupporting ? "has-content" : ""}" part="supporting-text">
            <slot name="supporting-text"></slot>
          </div>
        </div>

        ${
          hasActions
            ? '<div class="actions" part="actions"><slot name="actions"></slot></div>'
            : ""
        }

        <!-- Dismiss button -->
        ${
          this._dismissible
            ? `
          <button 
            class="dismiss-button" 
            part="dismiss-button"
            aria-label="Dismiss banner"
            type="button">
          </button>
        `
            : ""
        }
      </div>

      <!-- Live region for screen readers -->
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
    `;
  }
}

// Auto-register the component
if (!customElements.get("ds-banner")) {
  customElements.define("ds-banner", DSBanner);
}

export default DSBanner;
