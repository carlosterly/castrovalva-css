/**
 * DSNavigationRail - A Material Design 3 navigation rail component
 * Vertical navigation for switching between top-level app destinations
 *
 * @element ds-navigation-rail
 *
 * @fires {CustomEvent} ds-navigation-rail:select - Fired when a destination is selected
 *
 * @slot header - Optional content above the destinations (e.g., app logo/title)
 * @slot fab - Optional floating action button slot below destinations
 * @slot - Default slot for ds-navigation-rail-item elements
 *
 * @csspart container - The navigation rail container
 * @csspart destinations - The destinations wrapper
 */
export class DSNavigationRail extends HTMLElement {
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
    this.addEventListener(
      "ds-navigation-rail-item:click",
      this._boundHandleItemClick,
    );
  }

  removeEventListeners() {
    this.removeEventListener(
      "ds-navigation-rail-item:click",
      this._boundHandleItemClick,
    );
  }

  handleItemClick(e) {
    const clickedItem = e.target;

    // Deactivate other items
    const items = this.querySelectorAll("ds-navigation-rail-item");
    items.forEach((item) => {
      if (item !== clickedItem) {
        item.removeAttribute("active");
      }
    });

    // Dispatch selection event
    this.dispatchEvent(
      new CustomEvent("ds-navigation-rail:select", {
        bubbles: true,
        composed: true,
        detail: {
          value:
            clickedItem.getAttribute("value") || clickedItem.textContent.trim(),
          label:
            clickedItem.getAttribute("label") || clickedItem.textContent.trim(),
        },
      }),
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          height: 100%;
          min-height: 320px;
          width: 80px;
          background: var(--md-sys-color-surface, #FFFBFE);
          border-right: 1px solid var(--md-sys-color-outline-variant, #CAC4D0);
        }

        nav.navigation-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px 12px;
          box-sizing: border-box;
          position: relative;
        }

        .destinations {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          align-items: center;
        }

        ::slotted(ds-navigation-rail-item) {
          width: 56px;
        }
      </style>

      <nav class="navigation-rail" part="container" role="navigation" aria-label="Primary navigation">
        <slot name="header"></slot>
        <div class="destinations" part="destinations">
          <slot></slot>
        </div>
        <slot name="fab"></slot>
      </nav>
    `;
  }
}

/**
 * DSNavigationRailItem - A navigation rail destination item
 *
 * @element ds-navigation-rail-item
 *
 * @attr {string} value - Value identifying this destination
 * @attr {string} icon - Material Symbol icon name
 * @attr {string} label - Optional label (can also use slot)
 * @attr {boolean} active - Whether this destination is currently active
 * @attr {boolean} disabled - Whether this destination is disabled
 * @attr {number} badge - Optional badge count
 *
 * @fires {CustomEvent} ds-navigation-rail-item:click - Fired when item is clicked
 *
 * @slot - Default slot for label text
 *
 * @csspart container - The item container
 * @csspart icon - The icon element
 * @csspart label - The label text
 * @csspart badge - The badge element
 * @csspart indicator - The active indicator
 */
export class DSNavigationRailItem extends HTMLElement {
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
    const button = this.shadowRoot.querySelector(".rail-item");
    if (button) {
      button.addEventListener("click", this._boundHandleClick);
    }

    // Also listen for clicks on the host element itself (for programmatic clicks)
    this.addEventListener("click", this._boundHandleClick);
  }

  removeEventListeners() {
    const button = this.shadowRoot.querySelector(".rail-item");
    if (button) {
      button.removeEventListener("click", this._boundHandleClick);
    }

    this.removeEventListener("click", this._boundHandleClick);
  }

  handleClick() {
    if (this.disabled) return;

    this.active = true;

    this.dispatchEvent(
      new CustomEvent("ds-navigation-rail-item:click", {
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
          justify-content: center;
        }

        .rail-item {
          position: relative;
          width: 72px;
          min-height: 72px;
          padding: 12px 8px;
          border: none;
          background: none;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: color 0.2s ease, transform 0.2s ease;
          font-family: var(--md-sys-typescale-label-medium-font, 'Roboto', sans-serif);
        }

        .rail-item:focus-visible {
          outline: none;
        }

        .rail-item:focus-visible::before {
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
          transition: opacity 0.2s ease;
          pointer-events: none;
          background: var(--ds-navigation-rail-hover-color, var(--md-sys-color-on-surface, #1D1B20));
        }

        .rail-item:hover .state-layer {
          opacity: var(--ds-navigation-rail-hover-opacity, 0.08);
        }

        .rail-item:active .state-layer {
          opacity: var(--ds-navigation-rail-pressed-opacity, 0.12);
        }

        /* Active indicator */
        .indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          width: 56px;
          height: 56px;
          background: var(--ds-navigation-rail-active-bg, var(--md-sys-color-secondary-container, #E8DEF8));
          border-radius: 16px;
          transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
          opacity: 0;
        }

        :host([active]) .indicator {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        /* Icon */
        .icon-container {
          position: relative;
          width: 24px;
          height: 24px;
          z-index: 1;
        }

        .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: inherit;
          transition: color 0.2s ease, font-variation-settings 0.2s ease;
        }

        :host([active]) .icon {
          color: var(--md-sys-color-on-secondary-container, #1D192B);
          font-variation-settings: 'FILL' 1;
        }

        /* Badge */
        .badge {
          position: absolute;
          top: -6px;
          right: -10px;
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
          transition: color 0.2s ease, opacity 0.2s ease;
          z-index: 1;
          padding: 0 6px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: ${active ? 1 : 0};
          height: ${active ? "auto" : 0};
        }

        :host([active]) .label {
          color: var(--md-sys-color-on-surface, #1D1B20);
          opacity: 1;
        }

        /* Disabled state */
        :host([disabled]) .rail-item {
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
        class="rail-item"
        part="container"
        type="button"
        role="tab"
        aria-selected="${active}"
        aria-disabled="${disabled}"
        aria-label="${label || this.textContent?.trim() || icon}">
        <div class="indicator" part="indicator"></div>
        <div class="state-layer"></div>

        <div class="icon-container">
          ${icon ? "<span class=\"icon\" part=\"icon\"></span>" : ""}
          ${hasBadge ? `<span class="badge" part="badge">${badge}</span>` : ""}
        </div>

        <span class="label" part="label">
          ${label || "<slot></slot>"}
        </span>
      </button>
    `;

    if (icon) {
      const iconEl = this.shadowRoot.querySelector(".icon");
      if (iconEl) {
        iconEl.textContent = icon;
      }
    }

    this.setupEventListeners();
  }
}

customElements.define("ds-navigation-rail", DSNavigationRail);
customElements.define("ds-navigation-rail-item", DSNavigationRailItem);

export default DSNavigationRail;
