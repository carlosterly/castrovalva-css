/**
 * DSSplitButton - A Material Design 3 split button component
 * Combines a primary action button with a dropdown menu for related actions
 *
 * @element ds-split-button
 *
 * @attr {string} variant - Button style variant: 'filled' | 'filled-tonal' | 'outlined' | 'elevated' | 'text'
 * @attr {boolean} disabled - Disables both buttons
 * @attr {string} position - Menu position: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
 *
 * @slot - Primary button content
 * @slot menu - Menu items (ds-menu-item elements)
 *
 * @fires {CustomEvent} ds-split-button:click - Fired when primary button is clicked
 * @fires {CustomEvent} ds-split-button:menu-select - Fired when menu item is selected
 *
 * @csspart primary-button - The primary action button
 * @csspart menu-button - The dropdown trigger button
 * @csspart menu - The dropdown menu
 */
export class DSSplitButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "disabled", "position"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._menuOpen = false;
    this._initialized = false;

    // Bind methods once to maintain consistent references
    this._boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this._boundHandleMenuToggle = this.handleMenuToggle.bind(this);
    this._boundHandlePrimaryClick = this.handlePrimaryClick.bind(this);
    this._boundHandleMenuItemClick = this.handleMenuItemClick.bind(this);
    this._boundHandlePrimaryKeydown = this.handlePrimaryKeydown.bind(this);
    this._boundHandleMenuButtonKeydown =
      this.handleMenuButtonKeydown.bind(this);
    this._boundHandleMenuKeydown = this.handleMenuKeydown.bind(this);
    this._boundHandleMenuItemKeydown = this.handleMenuItemKeydown.bind(this);
  }

  connectedCallback() {
    this.render();
    if (!this._initialized) {
      // Use setTimeout to ensure DOM is ready after render
      setTimeout(() => {
        this.setupEventListeners();
        this._initialized = true;
      }, 0);
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Getters and Setters
  get variant() {
    return this.getAttribute("variant") || "filled";
  }

  set variant(value) {
    this.setAttribute("variant", value);
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

  get position() {
    return this.getAttribute("position") || "bottom-end";
  }

  set position(value) {
    this.setAttribute("position", value);
  }

  setupEventListeners() {
    const primaryBtn = this.shadowRoot.querySelector(".primary-button");
    const menuBtn = this.shadowRoot.querySelector(".menu-button");
    const menu = this.shadowRoot.querySelector(".menu");

    if (primaryBtn) {
      primaryBtn.addEventListener("click", this._boundHandlePrimaryClick);
      primaryBtn.addEventListener("keydown", this._boundHandlePrimaryKeydown);
    }

    if (menuBtn) {
      menuBtn.addEventListener("click", this._boundHandleMenuToggle);
      menuBtn.addEventListener("keydown", this._boundHandleMenuButtonKeydown);
    }

    if (menu) {
      menu.addEventListener("keydown", this._boundHandleMenuKeydown);
    }

    // Don't add outside click listener here - it will be added when menu opens

    // Handle menu item clicks
    const menuSlot = this.shadowRoot.querySelector('slot[name="menu"]');
    if (menuSlot) {
      // Set up listeners for already-slotted items
      const existingItems = menuSlot.assignedElements();
      existingItems.forEach((item) => {
        item.addEventListener("click", this._boundHandleMenuItemClick);
        item.addEventListener("keydown", this._boundHandleMenuItemKeydown);
        if (!item.hasAttribute("tabindex")) {
          item.setAttribute("tabindex", "0");
        }
      });

      // Also listen for future slot changes
      menuSlot.addEventListener("slotchange", () => {
        const items = menuSlot.assignedElements();
        items.forEach((item) => {
          item.addEventListener("click", this._boundHandleMenuItemClick);
          item.addEventListener("keydown", this._boundHandleMenuItemKeydown);
          if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "0");
          }
        });
      });
    }
  }

  removeEventListeners() {
    const primaryBtn = this.shadowRoot.querySelector(".primary-button");
    const menuBtn = this.shadowRoot.querySelector(".menu-button");
    const menu = this.shadowRoot.querySelector(".menu");

    if (primaryBtn) {
      primaryBtn.removeEventListener("click", this._boundHandlePrimaryClick);
      primaryBtn.removeEventListener(
        "keydown",
        this._boundHandlePrimaryKeydown,
      );
    }

    if (menuBtn) {
      menuBtn.removeEventListener("click", this._boundHandleMenuToggle);
      menuBtn.removeEventListener(
        "keydown",
        this._boundHandleMenuButtonKeydown,
      );
    }

    if (menu) {
      menu.removeEventListener("keydown", this._boundHandleMenuKeydown);
    }

    document.removeEventListener("click", this._boundHandleOutsideClick);
  }

  getMenuItems() {
    const menuSlot = this.shadowRoot.querySelector('slot[name="menu"]');
    if (!menuSlot) return [];
    return menuSlot.assignedElements().filter((item) => item);
  }

  focusFirstMenuItem() {
    const items = this.getMenuItems();
    if (items.length > 0) {
      items[0].focus();
    }
  }

  focusMenuItemByOffset(offset) {
    const items = this.getMenuItems();
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement);
    const startIndex = current === -1 ? 0 : current;
    const nextIndex = (startIndex + offset + items.length) % items.length;
    items[nextIndex].focus();
  }

  handlePrimaryClick(e) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent("ds-split-button:click", {
        bubbles: true,
        composed: true,
        detail: { originalEvent: e },
      }),
    );
  }

  handlePrimaryKeydown(e) {
    if (this.disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handlePrimaryClick(e);
    }
  }

  handleMenuToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.disabled) return;

    this._menuOpen = !this._menuOpen;

    if (this._menuOpen) {
      this.updateMenuState();
      // Add outside click listener on next tick to avoid immediate closure
      setTimeout(() => {
        document.addEventListener("click", this._boundHandleOutsideClick);
      }, 0);
      requestAnimationFrame(() => {
        this.focusFirstMenuItem();
      });
    } else {
      this.updateMenuState();
      document.removeEventListener("click", this._boundHandleOutsideClick);
    }
  }

  handleMenuButtonKeydown(e) {
    if (this.disabled) return;

    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      if (!this._menuOpen) {
        this.openMenu();
      }
      requestAnimationFrame(() => {
        this.focusFirstMenuItem();
      });
    }
  }

  handleMenuKeydown(e) {
    if (e.key === "Escape" && this._menuOpen) {
      e.preventDefault();
      this.closeMenu(true);
    }
  }

  handleMenuItemKeydown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.focusMenuItemByOffset(1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.focusMenuItemByOffset(-1);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  handleMenuItemClick(e) {
    const item = e.target.closest("ds-menu-item") || e.target;

    this.dispatchEvent(
      new CustomEvent("ds-split-button:menu-select", {
        bubbles: true,
        composed: true,
        detail: {
          item: item,
          value: item.getAttribute("value"),
          label: item.textContent.trim(),
        },
      }),
    );

    this.closeMenu();
  }

  handleOutsideClick(e) {
    // Check if click is inside the component (including shadow DOM)
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.closeMenu();
    }
  }

  openMenu() {
    this._menuOpen = true;
    this.updateMenuState();
    requestAnimationFrame(() => {
      this.focusFirstMenuItem();
    });
  }

  closeMenu(returnFocus = false) {
    this._menuOpen = false;
    this.updateMenuState();
    document.removeEventListener("click", this._boundHandleOutsideClick);

    if (returnFocus) {
      const menuBtn = this.shadowRoot.querySelector(".menu-button");
      if (menuBtn) {
        menuBtn.focus();
      }
    }
  }

  updateMenuState() {
    const menu = this.shadowRoot.querySelector(".menu");
    const menuBtn = this.shadowRoot.querySelector(".menu-button");

    if (menu) {
      // Use inline styles to ensure they override everything
      if (this._menuOpen) {
        menu.style.opacity = "1";
        menu.style.visibility = "visible";
        menu.style.transform = "translateY(0)";
      } else {
        menu.style.opacity = "0";
        menu.style.visibility = "hidden";
        menu.style.transform = "translateY(-8px)";
      }
      menu.setAttribute("aria-hidden", !this._menuOpen);
    }

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", this._menuOpen);
    }
  }

  render() {
    const variant = this.variant;
    const disabled = this.disabled;
    const position = this.position;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          position: relative;
        }

        .split-button {
          display: inline-flex;
          border-radius: var(--md-sys-shape-corner-full, 20px);
          overflow: hidden;
        }

        .primary-button,
        .menu-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px;
          font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-label-large-size, 14px);
          font-weight: var(--md-sys-typescale-label-large-weight, 500);
          line-height: var(--md-sys-typescale-label-large-line-height, 20px);
          letter-spacing: var(--md-sys-typescale-label-large-tracking, 0.1px);
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .primary-button {
          padding-right: 20px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .menu-button {
          padding: 10px 12px;
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          min-width: 40px;
        }

        .menu-button-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.2s;
        }

        .menu-button[aria-expanded="true"] .menu-button-icon {
          transform: rotate(180deg);
        }

        /* Variant: Filled */
        .variant-filled .primary-button,
        .variant-filled .menu-button {
          background: var(--md-sys-color-primary, #6750A4);
          color: var(--md-sys-color-on-primary, #FFFFFF);
        }

        .variant-filled .menu-button {
          border-left-color: rgba(255, 255, 255, 0.2);
        }

        .variant-filled .primary-button:hover:not(:disabled),
        .variant-filled .menu-button:hover:not(:disabled) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 92%, var(--md-sys-color-on-primary) 8%);
          box-shadow: var(--md-sys-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.3));
        }

        /* Variant: Filled Tonal */
        .variant-filled-tonal .primary-button,
        .variant-filled-tonal .menu-button {
          background: var(--md-sys-color-secondary-container, #E8DEF8);
          color: var(--md-sys-color-on-secondary-container, #1D192B);
        }

        .variant-filled-tonal .menu-button {
          border-left-color: rgba(0, 0, 0, 0.1);
        }

        .variant-filled-tonal .primary-button:hover:not(:disabled),
        .variant-filled-tonal .menu-button:hover:not(:disabled) {
          background: color-mix(in srgb, var(--md-sys-color-secondary-container) 92%, var(--md-sys-color-on-secondary-container) 8%);
          box-shadow: var(--md-sys-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.3));
        }

        /* Variant: Outlined */
        .variant-outlined {
          border: 1px solid var(--md-sys-color-outline, #79747E);
        }

        .variant-outlined .primary-button,
        .variant-outlined .menu-button {
          background: transparent;
          color: var(--md-sys-color-primary, #6750A4);
          border: none;
        }

        .variant-outlined .menu-button {
          border-left: 1px solid var(--md-sys-color-outline, #79747E);
        }

        .variant-outlined .primary-button:hover:not(:disabled),
        .variant-outlined .menu-button:hover:not(:disabled) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
        }

        /* Variant: Elevated */
        .variant-elevated .primary-button,
        .variant-elevated .menu-button {
          background: var(--md-sys-color-surface-container, #F3EDF7);
          color: var(--md-sys-color-primary, #6750A4);
          box-shadow: var(--md-sys-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .variant-elevated .menu-button {
          border-left-color: rgba(0, 0, 0, 0.2);
        }

        .variant-elevated .primary-button:hover:not(:disabled),
        .variant-elevated .menu-button:hover:not(:disabled) {
          background: color-mix(in srgb, var(--md-sys-color-surface-container-low) 92%, var(--md-sys-color-primary) 8%);
          box-shadow: var(--md-sys-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.3));
        }

        /* Variant: Text */
        .variant-text .primary-button,
        .variant-text .menu-button {
          background: transparent;
          color: var(--md-sys-color-primary, #6750A4);
        }

        .variant-text .menu-button {
          border-left-color: rgba(0, 0, 0, 0.06);
        }

        .variant-text .primary-button:hover:not(:disabled),
        .variant-text .menu-button:hover:not(:disabled) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
        }

        /* Disabled state */
        .primary-button:disabled,
        .menu-button:disabled {
          background: rgba(0, 0, 0, 0.12);
          color: rgba(0, 0, 0, 0.38);
          cursor: not-allowed;
          box-shadow: none;
        }

        .variant-outlined .primary-button:disabled,
        .variant-outlined .menu-button:disabled,
        .variant-text .primary-button:disabled,
        .variant-text .menu-button:disabled {
          background: transparent;
          color: rgba(0, 0, 0, 0.38);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .variant-outlined:has(.primary-button:disabled),
        .variant-outlined:has(.menu-button:disabled) {
          border-color: rgba(0, 0, 0, 0.12);
        }

        /* Menu */
        .menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          min-width: 200px;
          background: var(--md-sys-color-surface-container, #F3EDF7);
          border-radius: var(--md-sys-shape-corner-extra-small, 4px);
          box-shadow: var(--md-sys-elevation-2, 0 2px 6px rgba(0, 0, 0, 0.15));
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
        }

        /* Menu position variants */
        .position-bottom-start .menu {
          right: auto;
          left: 0;
        }

        .position-bottom-end .menu {
          right: 0;
          left: auto;
        }

        .position-top-start .menu {
          top: auto;
          bottom: calc(100% + 4px);
          right: auto;
          left: 0;
          transform: translateY(8px);
        }

        .position-top-end .menu {
          top: auto;
          bottom: calc(100% + 4px);
          right: 0;
          left: auto;
          transform: translateY(8px);
        }

        /* Open state - must come after position variants */
        .menu.open {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }

        /* Focus visible */
        .primary-button:focus-visible,
        .menu-button:focus-visible {
          outline: 2px solid var(--md-sys-color-primary, #6750A4);
          outline-offset: 2px;
        }
      </style>

      <div class="split-button variant-${variant} position-${position}">
        <button 
          class="primary-button" 
          part="primary-button"
          ${disabled ? "disabled" : ""}
          aria-label="Primary action"
        >
          <slot></slot>
        </button>
        <button 
          class="menu-button" 
          part="menu-button"
          ${disabled ? "disabled" : ""}
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="More actions"
        >
          <svg class="menu-button-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        <div class="menu" part="menu" role="menu" aria-hidden="true">
          <slot name="menu"></slot>
        </div>
      </div>
    `;

    // Only setup event listeners on first render
    if (!this._initialized) {
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this.setupEventListeners();
          this._initialized = true;
        }
      });
    }
  }
}

// Auto-register the component
customElements.define("ds-split-button", DSSplitButton);

export default DSSplitButton;
