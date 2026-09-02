/**
 * Material Design 3 Divider Component
 *
 * A divider is a thin line that groups content in lists and layouts.
 *
 * @element ds-divider
 *
 * @attr {string} variant - The divider variant: 'full-width' (default), 'inset', or 'middle'
 * @attr {string} orientation - The orientation: 'horizontal' (default) or 'vertical'
 * @attr {string} color - Custom color for the divider (CSS color value)
 * @attr {string} thickness - Custom thickness for the divider (CSS length value)
 *
 * @cssprop --ds-divider-color - Color of the divider line (default: outline-variant)
 * @cssprop --ds-divider-thickness - Thickness of the divider line (default: 1px)
 * @cssprop --ds-divider-inset - Inset spacing from edges (default: 16px)
 * @cssprop --ds-divider-middle-inset - Spacing for middle variant (default: 16px)
 *
 * @csspart divider - The divider line element
 *
 * @example
 * <ds-divider></ds-divider>
 * <ds-divider variant="inset"></ds-divider>
 * <ds-divider variant="middle"></ds-divider>
 * <ds-divider orientation="vertical"></ds-divider>
 */
export class DSDivider extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "orientation", "color", "thickness"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * Get the divider variant
   * @returns {string} The variant: 'full-width', 'inset', or 'middle'
   */
  get variant() {
    const variant = this.getAttribute("variant");
    return ["full-width", "inset", "middle"].includes(variant)
      ? variant
      : "full-width";
  }

  /**
   * Set the divider variant
   * @param {string} value - The variant: 'full-width', 'inset', or 'middle'
   */
  set variant(value) {
    if (["full-width", "inset", "middle"].includes(value)) {
      this.setAttribute("variant", value);
    }
  }

  /**
   * Get the divider orientation
   * @returns {string} The orientation: 'horizontal' or 'vertical'
   */
  get orientation() {
    const orientation = this.getAttribute("orientation");
    return ["horizontal", "vertical"].includes(orientation)
      ? orientation
      : "horizontal";
  }

  /**
   * Set the divider orientation
   * @param {string} value - The orientation: 'horizontal' or 'vertical'
   */
  set orientation(value) {
    if (["horizontal", "vertical"].includes(value)) {
      this.setAttribute("orientation", value);
    }
  }

  /**
   * Get the divider color
   * @returns {string|null} The custom color value
   */
  get color() {
    return this.getAttribute("color");
  }

  /**
   * Set the divider color
   * @param {string|null} value - The custom color value
   */
  set color(value) {
    if (value) {
      this.setAttribute("color", value);
    } else {
      this.removeAttribute("color");
    }
  }

  /**
   * Get the divider thickness
   * @returns {string|null} The custom thickness value
   */
  get thickness() {
    return this.getAttribute("thickness");
  }

  /**
   * Set the divider thickness
   * @param {string|null} value - The custom thickness value
   */
  set thickness(value) {
    if (value) {
      this.setAttribute("thickness", value);
    } else {
      this.removeAttribute("thickness");
    }
  }

  render() {
    const variant = this.variant;
    const orientation = this.orientation;
    const customColor = this.color;
    const customThickness = this.thickness;

    const colorStyle = customColor ? `--ds-divider-color: ${customColor};` : "";
    const thicknessStyle = customThickness
      ? `--ds-divider-thickness: ${customThickness};`
      : "";
    const inlineStyles =
      colorStyle || thicknessStyle
        ? `style="${colorStyle}${thicknessStyle}"`
        : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        :host([orientation="vertical"]) {
          display: inline-block;
          height: 100%;
          width: auto;
        }

        hr {
          margin: 0;
          border: none;
          background-color: var(--ds-divider-color, var(--md-sys-color-outline-variant, #cac4d0));
          box-sizing: border-box;
        }

        /* Horizontal dividers */
        :host([orientation="horizontal"]) hr,
        :host(:not([orientation])) hr {
          width: 100%;
          height: var(--ds-divider-thickness, 1px);
        }

        /* Vertical dividers */
        :host([orientation="vertical"]) hr {
          width: var(--ds-divider-thickness, 1px);
          height: 100%;
          display: inline-block;
        }

        /* Full-width variant (default) */
        :host([variant="full-width"]) hr,
        :host(:not([variant])) hr {
          margin-left: 0;
          margin-right: 0;
        }

        /* Inset variant - indent from start */
        :host([variant="inset"]) hr {
          margin-left: var(--ds-divider-inset, 16px);
          margin-right: 0;
        }

        :host([variant="inset"][orientation="vertical"]) hr {
          margin-left: 0;
          margin-top: var(--ds-divider-inset, 16px);
          margin-bottom: 0;
        }

        /* Middle variant - indent from both sides */
        :host([variant="middle"]) hr {
          margin-left: var(--ds-divider-middle-inset, 16px);
          margin-right: var(--ds-divider-middle-inset, 16px);
        }

        :host([variant="middle"][orientation="vertical"]) hr {
          margin-left: 0;
          margin-right: 0;
          margin-top: var(--ds-divider-middle-inset, 16px);
          margin-bottom: var(--ds-divider-middle-inset, 16px);
        }
      </style>
      <hr part="divider" role="separator" ${inlineStyles} />
    `;
  }
}

// Register the custom element
customElements.define("ds-divider", DSDivider);

export default DSDivider;
