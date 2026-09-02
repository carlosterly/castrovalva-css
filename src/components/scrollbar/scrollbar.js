/**
 * Material Design 3 Scrollbar Component
 * Utility component for custom-styled scrollbars following MD3 design tokens
 * Provides consistent scrollbar appearance across the design system
 */

export class DSScrollbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._size = "medium"; // thin, medium, thick
    this._color = "primary"; // primary, secondary, tertiary, surface-variant
    this._hover = true; // Show on hover or always visible
    this._direction = "vertical"; // vertical, horizontal, both
  }

  static get observedAttributes() {
    return ["size", "color", "hover", "direction"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "size":
        this._size = newValue || "medium";
        break;
      case "color":
        this._color = newValue || "primary";
        break;
      case "hover":
        // When attribute is removed (newValue === null), set to false
        // When attribute exists but empty or "false", set to false
        this._hover = newValue !== null && newValue !== "false";
        break;
      case "direction":
        this._direction = newValue || "vertical";
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  get hover() {
    return this._hover;
  }

  set hover(value) {
    if (value) {
      this.setAttribute("hover", "");
    } else {
      this.removeAttribute("hover");
    }
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this.setAttribute("direction", value);
  }

  /**
   * Get scrollbar width based on size
   * @returns {string} Scrollbar width in pixels
   */
  getScrollbarSize() {
    const sizeMap = {
      thin: "var(--ds-scrollbar-size-thin, calc(var(--ds-space-2, 8px) - 2px))",
      medium:
        "var(--ds-scrollbar-size-medium, calc(var(--ds-space-2, 8px) + 2px))",
      thick:
        "var(--ds-scrollbar-size-thick, calc(var(--ds-space-3, 12px) + 2px))",
    };
    return sizeMap[this._size] || sizeMap.medium;
  }

  /**
   * Get CSS variable for the selected color
   * @returns {string} CSS color variable
   */
  getColorVariable() {
    const colorMap = {
      primary: "--md-sys-color-primary",
      secondary: "--md-sys-color-secondary",
      tertiary: "--md-sys-color-tertiary",
      "surface-variant": "--md-sys-color-surface-variant",
      "on-surface": "--md-sys-color-on-surface",
      outline: "--md-sys-color-outline",
    };
    return colorMap[this._color] || colorMap.primary;
  }

  /**
   * Get hover opacity based on hover setting
   * @returns {string} Opacity value
   */
  getHoverOpacity() {
    return this._hover ? "0.3" : "0.6";
  }

  render() {
    const scrollbarSize = this.getScrollbarSize();
    const colorVariable = this.getColorVariable();
    const hoverOpacity = this.getHoverOpacity();
    const activeOpacity = "0.8";

    // Determine which scrollbars to show
    const showVertical =
      this._direction === "vertical" || this._direction === "both";
    const showHorizontal =
      this._direction === "horizontal" || this._direction === "both";

    // Build overflow properties
    const overflowX = showHorizontal ? "auto" : "hidden";
    const overflowY = showVertical ? "auto" : "hidden";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          inline-size: 100%;
          block-size: 100%;
          overflow-x: ${overflowX};
          overflow-y: ${overflowY};
          position: relative;
        }

        /* Container styles */
        .scrollbar-container {
          inline-size: 100%;
          block-size: 100%;
          overflow: inherit;
          position: relative;
        }

        /* Webkit browsers (Chrome, Safari, Edge) */
        .scrollbar-container::-webkit-scrollbar {
          inline-size: ${showVertical ? scrollbarSize : "0"};
          block-size: ${showHorizontal ? scrollbarSize : "0"};
        }

        .scrollbar-container::-webkit-scrollbar-track {
          background: transparent;
          border-radius: calc(${scrollbarSize} / 2);
        }

        .scrollbar-container::-webkit-scrollbar-thumb {
          background: var(${colorVariable});
          opacity: ${hoverOpacity};
          border-radius: calc(${scrollbarSize} / 2);
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .scrollbar-container::-webkit-scrollbar-thumb:hover {
          opacity: ${activeOpacity};
        }

        .scrollbar-container::-webkit-scrollbar-thumb:active {
          opacity: 1;
        }

        /* Firefox */
        .scrollbar-container {
          scrollbar-width: ${this._size === "thin" ? "thin" : "auto"};
          scrollbar-color: var(${colorVariable}) transparent;
        }

        /* Additional styling for hover effect */
        ${
          this._hover
            ? `
        :host(:not(:hover)) .scrollbar-container::-webkit-scrollbar-thumb {
          opacity: 0;
        }
        `
            : ""
        }

        /* Smooth scrolling */
        .scrollbar-container {
          scroll-behavior: smooth;
        }

        /* CSS Parts for external styling */
        ::part(container) {
          inline-size: 100%;
          block-size: 100%;
        }
      </style>

      <div part="container" class="scrollbar-container">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("ds-scrollbar")) {
  customElements.define("ds-scrollbar", DSScrollbar);
}
