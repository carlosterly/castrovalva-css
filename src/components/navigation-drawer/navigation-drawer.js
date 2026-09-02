/**
 * Material Design 3 Navigation Drawer Component
 *
 * A navigation drawer component that follows Material Design 3 specifications.
 * Provides side navigation with modal and standard variants, supporting both
 * mobile and desktop experiences.
 *
 * @element ds-navigation-drawer
 *
 * @attr {string} variant - Drawer variant: 'modal' (default) or 'standard'
 * @attr {boolean} open - Whether the drawer is open
 * @attr {string} position - Position of drawer: 'left' (default) or 'right'
 * @attr {boolean} persistent - Whether to persist drawer state across page loads
 * @attr {string} storage-key - Custom localStorage key for persistent state (default: 'ds-navigation-drawer-state')
 *
 * @fires ds-navigation-drawer:open - Fired when drawer opens
 * @fires ds-navigation-drawer:close - Fired when drawer closes
 *
 * @slot - Default slot for drawer content (typically navigation items)
 * @slot header - Optional header content
 *
 * @csspart container - The drawer container
 * @csspart scrim - The overlay/scrim (modal variant only)
 * @csspart content - The drawer content area
 *
 * @cssprop --ds-navigation-drawer-width - Width of the drawer (default: 360px)
 */
class DSNavigationDrawer extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "open", "position", "persistent", "storage-key"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._previousFocus = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    // Set initial ARIA state
    this.setAttribute("aria-hidden", "true");

    // Load persistent state if enabled (only for standard variant)
    if (this.persistent && this.variant === "standard") {
      this.loadPersistedState();
    } else if (this.hasAttribute("open")) {
      // Check initial open state
      this._isOpen = true;
      this.updateOpenState();
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
      case "position":
        this.render();
        this.setupEventListeners();
        if (this._isOpen) {
          this.updateOpenState();
        }
        break;
      case "open":
        this._isOpen = this.hasAttribute("open");
        this.updateOpenState();
        break;
    }
  }

  setupEventListeners() {
    this._handleScrimClick = this.handleScrimClick.bind(this);
    this._handleKeyDown = this.handleKeyDown.bind(this);
    this._handleFocusTrap = this.handleFocusTrap.bind(this);

    const scrim = this.shadowRoot.querySelector(".scrim");
    if (scrim) {
      scrim.addEventListener("click", this._handleScrimClick);
    }

    document.addEventListener("keydown", this._handleKeyDown);
  }

  removeEventListeners() {
    const scrim = this.shadowRoot.querySelector(".scrim");
    if (scrim) {
      scrim.removeEventListener("click", this._handleScrimClick);
    }

    document.removeEventListener("keydown", this._handleKeyDown);
  }

  handleScrimClick(event) {
    if (this.variant === "modal" && this.open) {
      this.close();
    }
  }

  handleKeyDown(event) {
    if (!this.open) return;

    // Close on Escape key
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      this.close();
    }

    // Tab key focus trap for modal variant
    if (event.key === "Tab" && this.variant === "modal") {
      this.handleFocusTrap(event);
    }
  }

  handleFocusTrap(event) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (
        document.activeElement === firstElement ||
        !this.contains(document.activeElement)
      ) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  getFocusableElements() {
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    return Array.from(this.querySelectorAll(selectors.join(", "))).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
    );
  }

  updateOpenState() {
    const container = this.shadowRoot.querySelector(".drawer-container");
    const scrim = this.shadowRoot.querySelector(".scrim");

    if (this._isOpen) {
      // Store previous focus
      this._previousFocus = document.activeElement;

      // Update classes
      container?.classList.add("open");

      // Only show scrim for modal variant
      if (this.variant === "modal") {
        scrim?.classList.add("visible");
      }

      // Prevent body scroll for modal variant
      if (this.variant === "modal") {
        document.body.style.overflow = "hidden";
      }

      // Focus first focusable element
      setTimeout(() => {
        const focusableElements = this.getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50); // Wait for animation to start

      // Update ARIA
      this.setAttribute("aria-hidden", "false");

      // Dispatch open event
      this.dispatchEvent(
        new CustomEvent("ds-navigation-drawer:open", {
          bubbles: true,
          composed: true,
        }),
      );

      // Save state if persistent
      if (this.persistent && this.variant === "standard") {
        this.savePersistedState();
      }
    } else {
      // Update classes
      container?.classList.remove("open");
      scrim?.classList.remove("visible");

      // Restore body scroll
      if (this.variant === "modal") {
        document.body.style.overflow = "";
      }

      // Restore previous focus
      if (this._previousFocus && this._previousFocus.focus) {
        this._previousFocus.focus();
        this._previousFocus = null;
      }

      // Update ARIA
      this.setAttribute("aria-hidden", "true");

      // Dispatch close event
      this.dispatchEvent(
        new CustomEvent("ds-navigation-drawer:close", {
          bubbles: true,
          composed: true,
        }),
      );

      // Save state if persistent
      if (this.persistent && this.variant === "standard") {
        this.savePersistedState();
      }
    }
  }

  updateStyles() {
    const container = this.shadowRoot.querySelector(".drawer-container");
    if (!container) return;

    // Position updates are handled by CSS based on attribute
  }

  // Public API
  get variant() {
    return this.getAttribute("variant") || "modal";
  }

  set variant(value) {
    if (value) {
      this.setAttribute("variant", value);
    } else {
      this.removeAttribute("variant");
    }
  }

  get open() {
    return this._isOpen;
  }

  set open(value) {
    const isOpen = Boolean(value);
    if (isOpen) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  get position() {
    return this.getAttribute("position") || "left";
  }

  set position(value) {
    if (value) {
      this.setAttribute("position", value);
    } else {
      this.removeAttribute("position");
    }
  }

  get persistent() {
    return this.hasAttribute("persistent");
  }

  set persistent(value) {
    const isPersistent = Boolean(value);
    if (isPersistent) {
      this.setAttribute("persistent", "");
    } else {
      this.removeAttribute("persistent");
    }
  }

  get storageKey() {
    return this.getAttribute("storage-key") || "ds-navigation-drawer-state";
  }

  set storageKey(value) {
    if (value) {
      this.setAttribute("storage-key", value);
    } else {
      this.removeAttribute("storage-key");
    }
  }

  // Persistent state methods
  savePersistedState() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          open: this._isOpen,
        }),
      );
    } catch (error) {
      // localStorage might not be available (private browsing, etc.)
      console.warn("Failed to save navigation drawer state:", error);
    }
  }

  loadPersistedState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        if (typeof state.open === "boolean") {
          this._isOpen = state.open;
          this.updateOpenState();
          return;
        }
      }
    } catch (error) {
      console.warn("Failed to load navigation drawer state:", error);
    }

    // Fallback to open attribute if no saved state
    if (this.hasAttribute("open")) {
      this._isOpen = true;
      this.updateOpenState();
    }
  }

  toggle() {
    this.open = !this.open;
  }

  show() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          pointer-events: none;
        }

        :host([variant="modal"]) {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: var(--md-sys-z-index-drawer, 100);
          pointer-events: auto;
        }

        :host([variant="standard"]) {
          position: static;
          width: var(--ds-navigation-drawer-width, 360px);
          height: auto;
          min-height: 100vh;
          pointer-events: auto;
        }

        /* Scrim/Overlay */
        .scrim {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--md-sys-color-scrim, rgba(0, 0, 0, 0.32));
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-medium2, 300ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
          pointer-events: none;
          z-index: calc(var(--md-sys-z-index-drawer, 100) - 1);
        }

        .scrim.visible {
          opacity: 1;
          pointer-events: auto;
        }

        :host([variant="standard"]) .scrim {
          display: none;
        }

        /* Drawer Container */
        .drawer-container {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: var(--ds-navigation-drawer-width, 360px);
          background-color: var(--md-sys-color-surface, #fffbfe);
          color: var(--md-sys-color-on-surface, #1d1b20);
          box-shadow: var(--md-sys-elevation-1, 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15));
          transform: translateX(-100%);
          transition: transform var(--md-sys-motion-duration-medium2, 300ms) var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
          pointer-events: auto;
          z-index: var(--md-sys-z-index-drawer, 100);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        :host([position="left"]) .drawer-container {
          left: 0;
          right: auto;
          transform: translateX(-100%);
        }

        :host([position="left"]) .drawer-container.open {
          transform: translateX(0);
        }

        :host([position="right"]) .drawer-container {
          right: 0;
          left: auto;
          transform: translateX(100%);
        }

        :host([position="right"]) .drawer-container.open {
          transform: translateX(0);
        }

        .drawer-container.open {
          transform: translateX(0);
        }

        :host([variant="standard"]) .drawer-container {
          position: static;
          transform: none;
          box-shadow: none;
          border-right: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
          height: 100%;
        }

        :host([variant="standard"][position="right"]) .drawer-container {
          border-right: none;
          border-left: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
        }

        /* Header */
        .drawer-header {
          padding: var(--md-sys-spacing-4, 16px) var(--md-sys-spacing-3, 12px);
          border-bottom: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
        }

        .drawer-header:empty,
        .drawer-header:not(:has(*)) {
          display: none;
        }

        .drawer-header ::slotted(*) {
          margin: 0;
          font-family: var(--md-sys-typescale-title-small-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-title-small-size, 0.875rem);
          font-weight: var(--md-sys-typescale-title-small-weight, 500);
          line-height: var(--md-sys-typescale-title-small-line-height, 1.25rem);
          letter-spacing: var(--md-sys-typescale-title-small-tracking, 0.00625rem);
        }

        /* Content */
        .drawer-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--md-sys-spacing-2, 8px) 0;
        }

        /* Scrollbar styling */
        .drawer-content::-webkit-scrollbar {
          width: 8px;
        }

        .drawer-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-content::-webkit-scrollbar-thumb {
          background: var(--md-sys-color-outline-variant, #c9c5ca);
          border-radius: 4px;
        }

        .drawer-content::-webkit-scrollbar-thumb:hover {
          background: var(--md-sys-color-outline, #79747e);
        }

        /* Accessibility */
        :host([aria-hidden="true"]) {
          pointer-events: none;
        }

        /* Focus visible styles */
        :host(:focus-visible) {
          outline: none;
        }
      </style>

      <div class="scrim" part="scrim"></div>
      
      <div class="drawer-container" part="container" role="navigation" aria-label="Navigation drawer">
        <div class="drawer-header" part="header">
          <slot name="header"></slot>
        </div>
        
        <div class="drawer-content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get("ds-navigation-drawer")) {
  customElements.define("ds-navigation-drawer", DSNavigationDrawer);
}

export default DSNavigationDrawer;
