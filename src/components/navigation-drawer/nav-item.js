/**
 * Material Design 3 Navigation List Item Component
 *
 * A navigation list item designed to work with ds-navigation-drawer.
 * Provides proper spacing, states, and accessibility for navigation items.
 *
 * @element ds-nav-item
 *
 * @attr {string} href - Link URL
 * @attr {boolean} active - Whether this item is currently active
 * @attr {string} icon - Optional icon name (Material Symbols)
 * @attr {boolean} disabled - Whether the item is disabled
 *
 * @fires ds-nav-item:click - Fired when item is clicked
 *
 * @slot - Default slot for item label text
 *
 * @csspart container - The item container
 * @csspart icon - The icon element
 * @csspart label - The label text
 * @csspart state-layer - The state layer for interaction feedback
 */
class DSNavItem extends HTMLElement {
  static get observedAttributes() {
    return ["href", "active", "icon", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateAccessibility();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "active":
      case "disabled":
        this.updateAccessibility();
        break;
      case "icon":
        this.updateIcon();
        break;
      case "href":
        this.updateLink();
        break;
    }
  }

  setupEventListeners() {
    this._handleClick = this.handleClick.bind(this);
    this.addEventListener("click", this._handleClick);
  }

  removeEventListeners() {
    this.removeEventListener("click", this._handleClick);
  }

  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    // Prevent default link behavior if no href is set
    if (!this.getAttribute("href")) {
      event.preventDefault();
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("ds-nav-item:click", {
        detail: {
          href: this.href,
          active: this.active,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateIcon() {
    if (!this.shadowRoot) return;
    const iconEl = this.shadowRoot.querySelector(".nav-icon");
    if (!iconEl) return;

    if (this.icon) {
      iconEl.textContent = this.icon;
      iconEl.style.display = "";
    } else {
      iconEl.style.display = "none";
    }
  }

  updateLink() {
    if (!this.shadowRoot) return;
    const link = this.shadowRoot.querySelector("a");
    if (link) {
      link.href = this.href || "#";
    }
  }

  updateAccessibility() {
    if (!this.shadowRoot) return;
    const link = this.shadowRoot.querySelector("a");
    if (!link) return;

    if (this.active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    if (this.disabled) {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
    } else {
      link.removeAttribute("aria-disabled");
      link.setAttribute("tabindex", "0");
    }
  }

  // Public API
  get href() {
    return this.getAttribute("href") || "";
  }

  set href(value) {
    if (value) {
      this.setAttribute("href", value);
    } else {
      this.removeAttribute("href");
    }
  }

  get active() {
    return this.hasAttribute("active");
  }

  set active(value) {
    if (value) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  get icon() {
    return this.getAttribute("icon") || "";
  }

  set icon(value) {
    if (value) {
      this.setAttribute("icon", value);
    } else {
      this.removeAttribute("icon");
    }
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

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        a {
          display: flex;
          align-items: center;
          gap: var(--md-sys-spacing-3, 12px);
          padding: var(--md-sys-spacing-2, 8px) var(--md-sys-spacing-6, 24px);
          min-height: 56px;
          text-decoration: none;
          color: var(--md-sys-color-on-surface-variant, #49454f);
          font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
          font-weight: var(--md-sys-typescale-label-large-weight, 500);
          line-height: var(--md-sys-typescale-label-large-line-height, 1.25rem);
          letter-spacing: var(--md-sys-typescale-label-large-tracking, 0.00625rem);
          border-radius: var(--md-sys-shape-corner-full, 28px);
          margin: 0 var(--md-sys-spacing-3, 12px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: background-color var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
        }

        /* State layer */
        .state-layer {
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-surface, #1d1b20);
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2, 100ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
        }

        a:hover .state-layer {
          opacity: var(--md-sys-state-hover-state-layer-opacity, 0.08);
        }

        a:focus-visible .state-layer {
          opacity: var(--md-sys-state-focus-state-layer-opacity, 0.12);
        }

        a:active .state-layer {
          opacity: var(--md-sys-state-pressed-state-layer-opacity, 0.12);
        }

        /* Active state */
        :host([active]) a {
          background-color: var(--md-sys-color-secondary-container, #e8def8);
          color: var(--md-sys-color-on-secondary-container, #1d192b);
        }

        :host([active]) .state-layer {
          background-color: var(--md-sys-color-on-secondary-container, #1d192b);
        }

        :host([active]) .nav-icon {
          color: var(--md-sys-color-on-secondary-container, #1d192b);
        }

        /* Disabled state */
        :host([disabled]) a {
          opacity: 0.38;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Icon */
        .nav-icon {
          font-family: 'Material Symbols Outlined';
          font-size: 24px;
          width: 24px;
          height: 24px;
          color: var(--md-sys-color-on-surface-variant, #49454f);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        /* Label */
        .nav-label {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        /* Focus indicator */
        a:focus-visible {
          outline: none;
        }

        a:focus-visible::after {
          content: '';
          position: absolute;
          inset: -2px;
          border: 2px solid var(--md-sys-color-primary, #6750a4);
          border-radius: var(--md-sys-shape-corner-full, 28px);
          pointer-events: none;
        }
      </style>

      <a href="#" part="container">
        <div class="state-layer" part="state-layer"></div>
        <span class="nav-icon" part="icon"></span>
        <span class="nav-label" part="label">
          <slot></slot>
        </span>
      </a>
    `;

    // Initialize
    this.updateIcon();
    this.updateLink();
  }
}

// Register the custom element
if (!customElements.get("ds-nav-item")) {
  customElements.define("ds-nav-item", DSNavItem);
}

export default DSNavItem;
