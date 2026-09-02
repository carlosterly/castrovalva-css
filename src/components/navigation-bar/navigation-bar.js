/**
 * DSNavigationBar - A Material Design 3 navigation bar component
 * Bottom navigation for switching between top-level app destinations
 *
 * @element ds-navigation-bar
 *
 * @fires {CustomEvent} ds-navigation-bar:select - Fired when a destination is selected
 *
 * @slot - Default slot for ds-navigation-bar-item elements
 *
 * @csspart container - The navigation bar container
 */
export class DSNavigationBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._boundHandleItemClick = this.handleItemClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    // Listen for item click events from child items
    this.addEventListener(
      "ds-navigation-bar-item:click",
      this._boundHandleItemClick,
    );
  }

  removeEventListeners() {
    this.removeEventListener(
      "ds-navigation-bar-item:click",
      this._boundHandleItemClick,
    );
  }

  handleItemClick(e) {
    const clickedItem = e.target;

    // Deactivate all items
    const items = this.querySelectorAll("ds-navigation-bar-item");
    items.forEach((item) => {
      if (item !== clickedItem) {
        item.removeAttribute("active");
      }
    });

    // Dispatch selection event
    this.dispatchEvent(
      new CustomEvent("ds-navigation-bar:select", {
        bubbles: true,
        composed: true,
        detail: {
          value:
            clickedItem.getAttribute("value") || clickedItem.textContent.trim(),
          label: clickedItem.textContent.trim(),
        },
      }),
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .navigation-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 80px;
          background: var(--md-sys-color-surface-container, #F3EDF7);
          border-top: 1px solid var(--md-sys-color-outline-variant, #CAC4D0);
          position: relative;
        }

        ::slotted(ds-navigation-bar-item) {
          flex: 1;
          max-width: 168px;
        }
      </style>

      <nav class="navigation-bar" part="container" role="navigation" aria-label="Main navigation">
        <slot></slot>
      </nav>
    `;
  }
}

/**
 * DSNavigationBarItem - A navigation bar destination item
 * Individual destination in the navigation bar
 *
 * @element ds-navigation-bar-item
 *
 * @attr {string} value - Value identifying this destination
 * @attr {string} icon - Material Symbol icon name
 * @attr {string} label - Optional label (can also use slot)
 * @attr {boolean} active - Whether this destination is currently active
 * @attr {boolean} disabled - Whether this destination is disabled
 * @attr {number} badge - Optional badge count
 *
 * @fires {CustomEvent} ds-navigation-bar-item:click - Fired when item is clicked
 *
 * @slot - Default slot for label text
 *
 * @csspart container - The item container
 * @csspart icon - The icon element
 * @csspart label - The label text
 * @csspart badge - The badge element
 * @csspart indicator - The active indicator
 */
export class DSNavigationBarItem extends HTMLElement {
  static get observedAttributes() {
    return ["value", "icon", "label", "active", "disabled", "badge"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._boundHandleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(val) {
    this.setAttribute("value", val);
  }

  get icon() {
    return this.getAttribute("icon") || "";
  }

  set icon(val) {
    this.setAttribute("icon", val);
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(val) {
    this.setAttribute("label", val);
  }

  get active() {
    return this.hasAttribute("active");
  }

  set active(val) {
    if (val) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(val) {
    if (val) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get badge() {
    return this.getAttribute("badge") || "";
  }

  set badge(val) {
    if (val) {
      this.setAttribute("badge", val);
    } else {
      this.removeAttribute("badge");
    }
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector(".nav-item");
    if (button) {
      button.addEventListener("click", this._boundHandleClick);
    }

    // Also listen for clicks on the host element itself (for programmatic clicks)
    this.addEventListener("click", this._boundHandleClick);
  }

  removeEventListeners() {
    const button = this.shadowRoot.querySelector(".nav-item");
    if (button) {
      button.removeEventListener("click", this._boundHandleClick);
    }

    this.removeEventListener("click", this._boundHandleClick);
  }

  handleClick(e) {
    if (this.disabled) return;

    // Set active on this item FIRST
    this.active = true;

    // Dispatch event (don't stop propagation - let it bubble to parent)
    this.dispatchEvent(
      new CustomEvent("ds-navigation-bar-item:click", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          label: this.label || this.textContent.trim(),
        },
      }),
    );
  }

  render() {
    const icon = this.icon;
    const label = this.label || "";
    const active = this.active;
    const disabled = this.disabled;
    const badge = this.badge;
    const hasBadge = badge && parseInt(badge, 10) > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 80px;
          padding: 12px 0 16px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          font-family: var(--md-sys-typescale-label-medium-font, 'Roboto', sans-serif);
        }

        .nav-item:focus-visible {
          outline: none;
        }

        .nav-item:focus-visible::before {
          content: '';
          position: absolute;
          inset: 4px;
          border: 2px solid var(--md-sys-color-primary, #6750A4);
          border-radius: 16px;
          pointer-events: none;
        }

        /* State layer */
        .state-layer {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          background: var(--ds-navigation-bar-hover-color, var(--md-sys-color-on-surface, #1D1B20));
        }

        .nav-item:hover .state-layer {
          opacity: var(--ds-navigation-bar-hover-opacity, 0.08);
        }

        .nav-item:active .state-layer {
          opacity: var(--ds-navigation-bar-pressed-opacity, 0.12);
        }

        /* Active indicator */
        .indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 56px;
          background: var(--ds-navigation-bar-active-bg, var(--md-sys-color-secondary-container, #E8DEF8));
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
          opacity: 0;
          transform: translate(-50%, -50%) scaleX(0);
        }

        :host([active]) .indicator {
          opacity: 1;
          transform: translate(-50%, -50%) scaleX(1);
        }

        /* Icon container */
        .icon-container {
          position: relative;
          width: 24px;
          height: 24px;
          margin-bottom: 4px;
          z-index: 1;
        }

        .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: inherit;
          transition: color 0.2s;
        }

        :host([active]) .icon {
          color: var(--md-sys-color-on-secondary-container, #1D192B);
          font-variation-settings: 'FILL' 1;
        }

        /* Badge */
        .badge {
          position: absolute;
          top: -4px;
          right: -8px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background: var(--md-sys-color-error, #BA1A1A);
          color: var(--md-sys-color-on-error, #FFFFFF);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Label */
        .label {
          font-size: var(--md-sys-typescale-label-medium-size, 12px);
          font-weight: var(--md-sys-typescale-label-medium-weight, 500);
          line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
          letter-spacing: 0.5px;
          text-align: center;
          transition: color 0.2s;
          z-index: 1;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 8px;
        }

        :host([active]) .label {
          color: var(--md-sys-color-on-surface, #1D1B20);
        }

        /* Disabled state */
        :host([disabled]) .nav-item {
          opacity: 0.38;
          cursor: not-allowed;
          pointer-events: none;
        }

        :host([disabled]) .state-layer,
        :host([disabled]) .indicator {
          display: none;
        }
      </style>

      <button
        class="nav-item"
        part="container"
        role="tab"
        aria-selected="${active}"
        aria-disabled="${disabled}"
        aria-label="${label || this.textContent?.trim() || icon}">
        <div class="indicator" part="indicator"></div>
        <div class="state-layer"></div>
        
        <div class="icon-container">
          ${icon ? `<span class="icon" part="icon"></span>` : ""}
          ${hasBadge ? `<span class="badge" part="badge">${badge}</span>` : ""}
        </div>
        
        <span class="label" part="label">
          ${label || "<slot></slot>"}
        </span>
      </button>
    `;

    // Update icon text content
    if (icon) {
      const iconEl = this.shadowRoot.querySelector(".icon");
      if (iconEl) {
        iconEl.textContent = icon;
      }
    }

    this.setupEventListeners();
  }
}

// Auto-register components
customElements.define("ds-navigation-bar", DSNavigationBar);
customElements.define("ds-navigation-bar-item", DSNavigationBarItem);

export default DSNavigationBar;
