/**
 * Material Design 3 Menu Web Component
 * Implements MD3 specifications for dropdown and context menus
 */
export class DSMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._anchorElement = null;
    this._focusedIndex = -1;
    this._scrollListener = null;
  }

  static get observedAttributes() {
    return ["open", "anchor"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "open") {
        if (newValue !== null) {
          this.open();
        } else {
          this.close();
        }
      }
    }
  }

  /**
   * Get open state
   * @returns {boolean}
   */
  get isOpen() {
    return this._isOpen;
  }

  /**
   * Get anchor element ID
   * @returns {string|null}
   */
  get anchor() {
    return this.getAttribute("anchor");
  }

  set anchor(value) {
    if (value) {
      this.setAttribute("anchor", value);
    } else {
      this.removeAttribute("anchor");
    }
  }

  /**
   * Open the menu
   */
  open() {
    if (this._isOpen) return;

    this._isOpen = true;
    const container = this.shadowRoot.querySelector(".menu-container");
    const backdrop = this.shadowRoot.querySelector(".menu-backdrop");

    if (!container) return;

    // Find anchor element
    if (this.anchor) {
      this._anchorElement = document.getElementById(this.anchor);
    }

    // Position menu relative to anchor
    this.positionMenu();

    container.style.display = "block";
    backdrop.style.display = "block";

    // Trigger animation
    setTimeout(() => {
      container.classList.add("open");
      backdrop.classList.add("open");
    }, 10);

    // Reset focus index
    this._focusedIndex = -1;

    // Add scroll listener to reposition menu or close if anchor scrolls out of view
    this._scrollListener = () => {
      if (!this._anchorElement) {
        this.close();
        return;
      }

      const anchorRect = this._anchorElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Close menu if anchor is completely out of viewport
      if (anchorRect.bottom < 0 || anchorRect.top > viewportHeight) {
        this.close();
        return;
      }

      // Reposition if still in view
      this.positionMenu();
    };
    window.addEventListener("scroll", this._scrollListener, true);
    window.addEventListener("resize", this._scrollListener);

    this.dispatchEvent(
      new CustomEvent("ds-menu:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Close the menu
   */
  close() {
    if (!this._isOpen) return;

    this._isOpen = false;
    const container = this.shadowRoot.querySelector(".menu-container");
    const backdrop = this.shadowRoot.querySelector(".menu-backdrop");

    if (!container) return;

    container.classList.remove("open");
    backdrop.classList.remove("open");

    setTimeout(() => {
      container.style.display = "none";
      backdrop.style.display = "none";
    }, 200);

    // Reset focus
    this._focusedIndex = -1;
    this.clearFocus();

    // Remove scroll listener
    if (this._scrollListener) {
      window.removeEventListener("scroll", this._scrollListener, true);
      window.removeEventListener("resize", this._scrollListener);
      this._scrollListener = null;
    }

    this.dispatchEvent(
      new CustomEvent("ds-menu:close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Toggle menu open/closed
   */
  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Position menu relative to anchor element
   */
  positionMenu() {
    if (!this._anchorElement) return;

    const container = this.shadowRoot.querySelector(".menu-container");
    const anchorRect = this._anchorElement.getBoundingClientRect();
    const menuRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available space
    const spaceBelow = viewportHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    const spaceRight = viewportWidth - anchorRect.left;
    const spaceLeft = anchorRect.right;

    // Default: position below and aligned to left edge of anchor
    let top = anchorRect.bottom + 8;
    let left = anchorRect.left;

    // Vertical positioning
    if (spaceBelow < menuRect.height + 16 && spaceAbove > spaceBelow) {
      // Position above
      top = anchorRect.top - menuRect.height - 8;
      container.classList.add("position-above");
    } else {
      container.classList.remove("position-above");
    }

    // Horizontal positioning
    if (spaceRight < menuRect.width && spaceLeft > spaceRight) {
      // Align to right edge
      left = anchorRect.right - menuRect.width;
      container.classList.add("position-left");
    } else {
      container.classList.remove("position-left");
    }

    // Ensure menu stays within viewport
    top = Math.max(8, Math.min(top, viewportHeight - menuRect.height - 8));
    left = Math.max(8, Math.min(left, viewportWidth - menuRect.width - 8));

    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
  }

  /**
   * Get all menu items
   */
  getMenuItems() {
    return Array.from(this.querySelectorAll("ds-menu-item")).filter(
      (item) => !item.hasAttribute("disabled") && !item.hasAttribute("divider"),
    );
  }

  /**
   * Focus next menu item
   */
  focusNext() {
    const items = this.getMenuItems();
    if (items.length === 0) return;

    this._focusedIndex = (this._focusedIndex + 1) % items.length;
    this.updateFocus(items);
  }

  /**
   * Focus previous menu item
   */
  focusPrevious() {
    const items = this.getMenuItems();
    if (items.length === 0) return;

    this._focusedIndex =
      this._focusedIndex <= 0 ? items.length - 1 : this._focusedIndex - 1;
    this.updateFocus(items);
  }

  /**
   * Update focus state on menu items
   */
  updateFocus(items) {
    items.forEach((item, index) => {
      if (index === this._focusedIndex) {
        item.setAttribute("focused", "");
      } else {
        item.removeAttribute("focused");
      }
    });
  }

  /**
   * Clear focus from all items
   */
  clearFocus() {
    const items = this.getMenuItems();
    items.forEach((item) => item.removeAttribute("focused"));
  }

  /**
   * Select focused item
   */
  selectFocusedItem() {
    const items = this.getMenuItems();
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      items[this._focusedIndex].click();
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Backdrop click
    this._handleBackdropClick = (e) => {
      if (e.target.classList.contains("menu-backdrop")) {
        this.close();
      }
    };

    this.shadowRoot.addEventListener("click", this._handleBackdropClick);

    // Keyboard navigation
    this._handleKeydown = (e) => {
      if (!this._isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          this.focusNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          this.focusPrevious();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          this.selectFocusedItem();
          break;
        case "Escape":
          e.preventDefault();
          this.close();
          break;
        case "Tab":
          e.preventDefault();
          this.close();
          break;
      }
    };

    document.addEventListener("keydown", this._handleKeydown);

    // Menu item clicks
    this._handleSlotChange = () => {
      const items = this.getMenuItems();
      items.forEach((item) => {
        item.addEventListener("click", () => {
          if (!item.hasAttribute("disabled")) {
            this.dispatchEvent(
              new CustomEvent("ds-menu:select", {
                bubbles: true,
                composed: true,
                detail: { item },
              }),
            );

            // Close menu unless item has keep-open attribute
            if (!item.hasAttribute("keep-open")) {
              this.close();
            }
          }
        });
      });
    };

    const slot = this.shadowRoot.querySelector("slot");
    if (slot) {
      slot.addEventListener("slotchange", this._handleSlotChange);
      this._handleSlotChange(); // Initial setup
    }
  }

  /**
   * Clean up event listeners
   */
  cleanup() {
    this.shadowRoot.removeEventListener("click", this._handleBackdropClick);
    document.removeEventListener("keydown", this._handleKeydown);

    const slot = this.shadowRoot.querySelector("slot");
    if (slot) {
      slot.removeEventListener("slotchange", this._handleSlotChange);
    }
  }

  /**
   * Render the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --ds-menu-min-width: 112px;
          --ds-menu-max-width: 280px;
          --ds-menu-container-padding-block: var(--ds-space-2, 8px);
          --ds-menu-item-min-height: var(--ds-size-control-lg, 48px);
          --ds-menu-item-padding-inline: var(--ds-space-4, 16px);
          --ds-menu-item-padding-block: 0;
          --ds-menu-item-gap: var(--ds-space-3, 12px);
          --ds-menu-item-leading-size: var(--ds-size-icon-lg, 24px);
          --ds-menu-item-trailing-gap: var(--ds-space-2, 8px);
          --ds-menu-item-trailing-size: 14px;
          --ds-menu-divider-margin-inline: var(--ds-space-3, 12px);
          --ds-menu-divider-margin-block: var(--ds-space-2, 8px);
        }

        .menu-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 999;
        }

        .menu-container {
          display: none;
          position: fixed;
          min-inline-size: var(--ds-menu-min-width);
          max-inline-size: var(--ds-menu-max-width);
          background: var(--md-sys-color-surface-container);
          border-radius: 4px;
          box-shadow: var(--md-sys-elevation-level2);
          padding: var(--ds-menu-container-padding-block) 0;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.9) translateY(-8px);
          transform-origin: top left;
          transition: opacity 200ms var(--md-sys-motion-easing-standard),
                      transform 200ms var(--md-sys-motion-easing-emphasized);
        }

        .menu-container.open {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .menu-container.position-above {
          transform-origin: bottom left;
        }

        .menu-container.position-above:not(.open) {
          transform: scale(0.9) translateY(8px);
        }

        .menu-container.position-left {
          transform-origin: top right;
        }

        ::slotted(ds-menu-item) {
          display: block;
        }
      </style>

      <div class="menu-backdrop"></div>
      <div class="menu-container" role="menu">
        <slot></slot>
      </div>
    `;
  }
}

/**
 * Material Design 3 Menu Item Web Component
 */
export class DSMenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["disabled", "selected", "focused", "divider"];
  }

  connectedCallback() {
    this.render();
    this.setAttribute("role", "menuitem");
    if (this.hasAttribute("disabled")) {
      this.setAttribute("aria-disabled", "true");
    }
  }

  attributeChangedCallback() {
    this.render();
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

  get selected() {
    return this.hasAttribute("selected");
  }

  set selected(value) {
    if (value) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  }

  render() {
    const disabled = this.hasAttribute("disabled");
    const selected = this.hasAttribute("selected");
    const focused = this.hasAttribute("focused");
    const divider = this.hasAttribute("divider");

    if (divider) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            margin: var(--ds-menu-divider-margin-block, var(--ds-space-2, 8px)) 0;
          }

          .divider {
            block-size: 1px;
            background: var(--md-sys-color-outline-variant);
            margin: 0 var(--ds-menu-divider-margin-inline, var(--ds-space-3, 12px));
          }
        </style>
        <div class="divider"></div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: var(--ds-menu-item-gap, var(--ds-space-3, 12px));
          padding: var(--ds-menu-item-padding-block, 0)
            var(--ds-menu-item-padding-inline, var(--ds-space-4, 16px));
          min-block-size: var(--ds-menu-item-min-height, var(--ds-size-control-lg, 48px));
          cursor: ${disabled ? "not-allowed" : "pointer"};
          position: relative;
          user-select: none;
          color: ${
            disabled
              ? "var(--md-sys-color-on-surface)"
              : "var(--md-sys-color-on-surface)"
          };
          opacity: ${disabled ? "0.38" : "1"};
          font-family: var(--md-sys-typescale-body-large-font);
          font-size: var(--md-sys-typescale-body-large-size);
          font-weight: var(--md-sys-typescale-body-large-weight);
          line-height: var(--md-sys-typescale-body-large-line-height);
        }

        .menu-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--md-sys-color-on-surface);
          opacity: 0;
          transition: opacity 200ms var(--md-sys-motion-easing-standard);
        }

        .menu-item:hover::before {
          opacity: ${disabled ? "0" : "0.08"};
        }

        :host([focused]) .menu-item::before {
          opacity: ${disabled ? "0" : "0.12"};
        }

        :host([selected]) .menu-item {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        .leading {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: var(--ds-menu-item-leading-size, var(--ds-size-icon-lg, 24px));
          block-size: var(--ds-menu-item-leading-size, var(--ds-size-icon-lg, 24px));
          flex-shrink: 0;
        }

        .text {
          flex: 1;
        }

        .trailing {
          display: flex;
          align-items: center;
          gap: var(--ds-menu-item-trailing-gap, var(--ds-space-2, 8px));
          color: var(--md-sys-color-on-surface-variant);
          font-size: var(--ds-menu-item-trailing-size, 14px);
        }

        ::slotted([slot="leading"]) {
          font-size: var(--ds-menu-item-leading-size, var(--ds-size-icon-lg, 24px));
          inline-size: var(--ds-menu-item-leading-size, var(--ds-size-icon-lg, 24px));
          block-size: var(--ds-menu-item-leading-size, var(--ds-size-icon-lg, 24px));
        }
      </style>

      <div class="menu-item">
        <span class="leading">
          <slot name="leading"></slot>
        </span>
        <span class="text">
          <slot></slot>
        </span>
        <span class="trailing">
          <slot name="trailing"></slot>
        </span>
      </div>
    `;
  }
}

// Register custom elements
if (!customElements.get("ds-menu")) {
  customElements.define("ds-menu", DSMenu);
}

if (!customElements.get("ds-menu-item")) {
  customElements.define("ds-menu-item", DSMenuItem);
}
