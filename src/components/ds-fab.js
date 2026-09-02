/**
 * Material Design 3 Floating Action Button (FAB) Web Component
 * Implements MD3 specifications for primary action buttons and Speed Dial
 */
export class DSFab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._actions = [];
  }

  static get observedAttributes() {
    return [
      "size",
      "color",
      "lowered",
      "disabled",
      "label",
      "position",
      "speed-dial",
    ];
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
      this.render();
      this.setupEventListeners();
    }
  }

  /**
   * Get FAB size variant
   * @returns {string} - small, default, large, or extended
   */
  get size() {
    return this.getAttribute("size") || "default";
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  /**
   * Get FAB color scheme
   * @returns {string} - primary, secondary, tertiary, or surface
   */
  get color() {
    return this.getAttribute("color") || "primary";
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  /**
   * Get lowered state (reduced elevation)
   * @returns {boolean}
   */
  get lowered() {
    return this.hasAttribute("lowered");
  }

  set lowered(value) {
    if (value) {
      this.setAttribute("lowered", "");
    } else {
      this.removeAttribute("lowered");
    }
  }

  /**
   * Get disabled state
   * @returns {boolean}
   */
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

  /**
   * Get label for extended FAB
   * @returns {string|null}
   */
  get label() {
    return this.getAttribute("label");
  }

  set label(value) {
    if (value) {
      this.setAttribute("label", value);
    } else {
      this.removeAttribute("label");
    }
  }

  /**
   * Get position (for fixed positioning)
   * @returns {string} - Position value or 'none'
   */
  get position() {
    return this.getAttribute("position") || "none";
  }

  set position(value) {
    this.setAttribute("position", value);
  }

  /**
   * Get speed-dial mode
   * @returns {boolean}
   */
  get speedDial() {
    return this.hasAttribute("speed-dial");
  }

  set speedDial(value) {
    if (value) {
      this.setAttribute("speed-dial", "");
    } else {
      this.removeAttribute("speed-dial");
    }
  }

  /**
   * Get open state (for speed dial)
   * @returns {boolean}
   */
  get isOpen() {
    return this._isOpen;
  }

  /**
   * Add a speed dial action
   * @param {Object} action - { icon, label, color }
   */
  addAction(action) {
    this._actions.push(action);
    if (this.speedDial) {
      this.render();
      this.setupEventListeners();
    }
  }

  /**
   * Clear all speed dial actions
   */
  clearActions() {
    this._actions = [];
    if (this.speedDial) {
      this.render();
      this.setupEventListeners();
    }
  }

  /**
   * Toggle speed dial open/closed
   */
  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open speed dial
   */
  open() {
    if (!this.speedDial || this._isOpen) return;

    this._isOpen = true;
    const actionsContainer = this.shadowRoot.querySelector(
      ".speed-dial-actions",
    );
    const mainButton = this.shadowRoot.querySelector("button");
    const backdrop = this.shadowRoot.querySelector(".speed-dial-backdrop");

    if (actionsContainer) {
      actionsContainer.style.display = "flex";
      backdrop.style.display = "block";

      // Trigger animation
      setTimeout(() => {
        actionsContainer.classList.add("open");
        backdrop.classList.add("open");
        mainButton.classList.add("rotated");
      }, 10);
    }

    this.dispatchEvent(
      new CustomEvent("ds-fab:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Close speed dial
   */
  close() {
    if (!this.speedDial || !this._isOpen) return;

    this._isOpen = false;
    const actionsContainer = this.shadowRoot.querySelector(
      ".speed-dial-actions",
    );
    const mainButton = this.shadowRoot.querySelector("button");
    const backdrop = this.shadowRoot.querySelector(".speed-dial-backdrop");

    if (actionsContainer) {
      actionsContainer.classList.remove("open");
      backdrop.classList.remove("open");
      mainButton.classList.remove("rotated");

      // Wait for animation to finish
      setTimeout(() => {
        actionsContainer.style.display = "none";
        backdrop.style.display = "none";
      }, 200);
    }

    this.dispatchEvent(
      new CustomEvent("ds-fab:close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    const button = this.shadowRoot.querySelector("button");
    if (!button) return;

    // Click handler
    this._handleClick = (e) => {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Speed dial mode: toggle actions
      if (this.speedDial) {
        this.toggle();
        return;
      }

      // Dispatch custom event for regular FAB
      this.dispatchEvent(
        new CustomEvent("ds-fab:click", {
          bubbles: true,
          composed: true,
          detail: { size: this.size, color: this.color },
        }),
      );
    };

    button.addEventListener("click", this._handleClick);

    // Speed dial backdrop click
    if (this.speedDial) {
      this._handleBackdropClick = (e) => {
        if (e.target.classList.contains("speed-dial-backdrop")) {
          this.close();
        }
      };

      this.shadowRoot.addEventListener("click", this._handleBackdropClick);
    }
  }

  /**
   * Clean up event listeners
   */
  cleanup() {
    const button = this.shadowRoot.querySelector("button");
    if (button && this._handleClick) {
      button.removeEventListener("click", this._handleClick);
    }

    if (this._handleBackdropClick) {
      this.shadowRoot.removeEventListener("click", this._handleBackdropClick);
    }

    // Clean up action button listeners
    const actionButtons = this.shadowRoot.querySelectorAll(
      ".speed-dial-action-button",
    );
    actionButtons.forEach((btn) => {
      const clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
    });
  }

  /**
   * Render the component
   */
  render() {
    const size = this.size;
    const color = this.color;
    const lowered = this.lowered;
    const disabled = this.disabled;
    const label = this.label;
    const position = this.position;
    const isExtended = size === "extended";

    // Get container dimensions based on size
    const getDimensions = () => {
      const sizeSm = "var(--ds-fab-size-sm, var(--ds-size-control-md, 40px))";
      const sizeMd = "var(--ds-fab-size-md, 56px)";
      const sizeLg = "var(--ds-fab-size-lg, 96px)";
      const iconSm = "var(--ds-fab-icon-size-sm, var(--ds-size-icon-lg, 24px))";
      const iconMd = "var(--ds-fab-icon-size-md, var(--ds-size-icon-lg, 24px))";
      const iconLg = "var(--ds-fab-icon-size-lg, 36px)";
      const extendedPadding = "var(--ds-fab-extended-padding, 20px)";
      const extendedGap = "var(--ds-fab-extended-gap, 12px)";

      switch (size) {
        case "small":
          return { width: sizeSm, height: sizeSm, iconSize: iconSm };
        case "large":
          return { width: sizeLg, height: sizeLg, iconSize: iconLg };
        case "extended":
          return {
            height: sizeMd,
            padding: `0 ${extendedPadding}`,
            gap: extendedGap,
            iconSize: iconMd,
          };
        default: // default FAB
          return { width: sizeMd, height: sizeMd, iconSize: iconMd };
      }
    };

    const dimensions = getDimensions();

    // Get color tokens based on color scheme
    const getColorTokens = () => {
      switch (color) {
        case "secondary":
          return {
            container: "var(--md-sys-color-secondary-container)",
            onContainer: "var(--md-sys-color-on-secondary-container)",
          };
        case "tertiary":
          return {
            container: "var(--md-sys-color-tertiary-container)",
            onContainer: "var(--md-sys-color-on-tertiary-container)",
          };
        case "surface":
          return {
            container: "var(--md-sys-color-surface-container-high)",
            onContainer: "var(--md-sys-color-primary)",
          };
        default: // primary
          return {
            container: "var(--md-sys-color-primary-container)",
            onContainer: "var(--md-sys-color-on-primary-container)",
          };
      }
    };

    const colors = getColorTokens();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        button {
          ${
            isExtended
              ? `display: inline-flex; align-items: center; justify-content: center; gap: ${dimensions.gap}; padding: ${dimensions.padding}; height: ${dimensions.height};`
              : `display: flex; align-items: center; justify-content: center; width: ${dimensions.width}; height: ${dimensions.height};`
          }
          background: ${colors.container};
          color: ${colors.onContainer};
          border: none;
          border-radius: ${isExtended ? "16px" : "16px"};
          cursor: ${disabled ? "not-allowed" : "pointer"};
          font-family: var(--md-sys-typescale-label-large-font);
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: var(--md-sys-typescale-label-large-weight);
          line-height: var(--md-sys-typescale-label-large-line-height);
          letter-spacing: var(--md-sys-typescale-label-large-tracking);
          box-shadow: ${
            lowered
              ? "var(--md-sys-elevation-level1)"
              : "var(--md-sys-elevation-level3)"
          };
          transition: box-shadow 200ms var(--md-sys-motion-easing-standard);
          position: relative;
          overflow: hidden;
          outline: none;
          opacity: ${disabled ? "0.38" : "1"};
          pointer-events: ${disabled ? "none" : "auto"};
        }

        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 200ms var(--md-sys-motion-easing-standard);
        }

        /* Hover state */
        button:hover::before {
          opacity: 0.08;
        }

        /* Hover elevation */
        button:hover {
          box-shadow: ${
            lowered
              ? "var(--md-sys-elevation-level2)"
              : "var(--md-sys-elevation-level4)"
          };
        }

        /* Focus state */
        button:focus-visible {
          outline: 2px solid ${colors.onContainer};
          outline-offset: 2px;
        }

        button:focus-visible::before {
          opacity: 0.12;
        }

        /* Active/pressed state */
        button:active::before {
          opacity: 0.12;
        }

        button:active {
          box-shadow: ${
            lowered
              ? "var(--md-sys-elevation-level1)"
              : "var(--md-sys-elevation-level3)"
          };
        }

        /* Icon slot */
        ::slotted(*) {
          font-size: ${dimensions.iconSize};
          width: ${dimensions.iconSize};
          height: ${dimensions.iconSize};
          flex-shrink: 0;
        }

        .label {
          white-space: nowrap;
        }

        /* Speed Dial Styles */
        .speed-dial-backdrop {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0);
          z-index: 5;
          transition: background 200ms var(--md-sys-motion-easing-standard);
        }

        .speed-dial-backdrop.open {
          background: rgba(0, 0, 0, 0.32);
        }

        .speed-dial-actions {
          display: none;
          position: absolute;
          bottom: var(--ds-fab-action-offset, 72px);
          left: 0;
          flex-direction: column;
          gap: 16px;
          z-index: 6;
        }

        /* When labels are on left (right-positioned FABs), anchor to right instead */
        .speed-dial-actions.labels-left {
          left: auto;
          right: 0;
        }

        .speed-dial-action {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
          opacity: 0;
          transform: scale(0) translateY(20px);
          transition: all 200ms var(--md-sys-motion-easing-emphasized);
          white-space: nowrap;
        }

        /* Reverse order for labels on left */
        .speed-dial-actions.labels-left .speed-dial-action {
          flex-direction: row-reverse;
        }

        .speed-dial-actions.open .speed-dial-action {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        /* Stagger animation delays */
        .speed-dial-action:nth-child(1) { transition-delay: 0ms; }
        .speed-dial-action:nth-child(2) { transition-delay: 30ms; }
        .speed-dial-action:nth-child(3) { transition-delay: 60ms; }
        .speed-dial-action:nth-child(4) { transition-delay: 90ms; }
        .speed-dial-action:nth-child(5) { transition-delay: 120ms; }
        .speed-dial-action:nth-child(6) { transition-delay: 150ms; }

        .speed-dial-action-label {
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: var(--md-sys-elevation-level1);
        }

        .speed-dial-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          background: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-primary);
          border: none;
          border-radius: var(--ds-fab-action-radius, 12px);
          cursor: pointer;
          box-shadow: var(--md-sys-elevation-level2);
          transition: all 200ms var(--md-sys-motion-easing-standard);
          position: relative;
        }

        .speed-dial-action-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 200ms var(--md-sys-motion-easing-standard);
        }

        .speed-dial-action-button:hover::before {
          opacity: 0.08;
        }

        .speed-dial-action-button:hover {
          box-shadow: var(--md-sys-elevation-level3);
        }

        .speed-dial-action-button:active::before {
          opacity: 0.12;
        }

        /* Main FAB rotation when open */
        button.rotated ::slotted(*) {
          transform: rotate(45deg);
          transition: transform 200ms var(--md-sys-motion-easing-emphasized);
        }

        ::slotted(*) {
          transition: transform 200ms var(--md-sys-motion-easing-emphasized);
        }
      </style>

      ${this.speedDial ? '<div class="speed-dial-backdrop"></div>' : ""}

      <button
        type="button"
        ${disabled ? "disabled" : ""}
        aria-label="${label || "Floating action button"}"
        ${this.speedDial ? 'aria-expanded="false" aria-haspopup="menu"' : ""}>
        <slot></slot>
        ${isExtended && label ? `<span class="label">${label}</span>` : ""}
      </button>

      ${
        this.speedDial
          ? `<div class="speed-dial-actions" role="menu"></div>`
          : ""
      }
    `;

    // Setup action buttons for speed dial
    if (this.speedDial && this._actions.length > 0) {
      const actionsContainer = this.shadowRoot.querySelector(
        ".speed-dial-actions",
      );

      this._actions.forEach((action, index) => {
        const actionWrapper = document.createElement("div");
        actionWrapper.className = "speed-dial-action";

        if (action.label) {
          const labelSpan = document.createElement("span");
          labelSpan.className = "speed-dial-action-label";
          labelSpan.textContent = action.label;
          actionWrapper.appendChild(labelSpan);
        }

        const actionButton = document.createElement("button");
        actionButton.className = "speed-dial-action-button";
        actionButton.setAttribute("data-action-index", index);
        actionButton.setAttribute("aria-label", action.label || "Action");
        actionButton.setAttribute("type", "button");

        const icon = document.createElement("ds-icon");
        icon.textContent = action.icon;
        actionButton.appendChild(icon);

        actionWrapper.appendChild(actionButton);
        actionsContainer.appendChild(actionWrapper);

        // Add click listener
        actionButton.addEventListener("click", (e) => {
          e.stopPropagation();

          this.dispatchEvent(
            new CustomEvent("ds-fab-action:click", {
              bubbles: true,
              composed: true,
              detail: { action, index },
            }),
          );

          this.close();
        });
      });
    }
  }
}

// Register the custom element
if (!customElements.get("ds-fab")) {
  customElements.define("ds-fab", DSFab);
}
