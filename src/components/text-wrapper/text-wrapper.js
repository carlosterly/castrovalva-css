/**
 * Material Design 3 Text Wrapper Component
 * Typography utility component for consistent text styling across the application
 * Provides MD3 typescale styles (display, headline, title, body, label)
 */

export class DSTextWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "body-medium"; // Default MD3 typescale
    this._color = "on-surface"; // Default semantic color
    this._align = "start"; // text-align value
    this._truncate = false; // Truncate with ellipsis
    this._lines = null; // Max lines (null = unlimited)
  }

  static get observedAttributes() {
    return ["variant", "color", "align", "truncate", "lines"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "body-medium";
        break;
      case "color":
        this._color = newValue || "on-surface";
        break;
      case "align":
        this._align = newValue || "start";
        break;
      case "truncate":
        this._truncate = newValue !== null && newValue !== "false";
        break;
      case "lines":
        this._lines = newValue ? parseInt(newValue, 10) : null;
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get variant() {
    return this._variant;
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  get align() {
    return this._align;
  }

  set align(value) {
    this.setAttribute("align", value);
  }

  get truncate() {
    return this._truncate;
  }

  set truncate(value) {
    if (value) {
      this.setAttribute("truncate", "");
    } else {
      this.removeAttribute("truncate");
    }
  }

  get lines() {
    return this._lines;
  }

  set lines(value) {
    if (value) {
      this.setAttribute("lines", value);
    } else {
      this.removeAttribute("lines");
    }
  }

  /**
   * Get CSS variable values for the selected variant
   * @returns {Object} CSS variables object
   */
  getVariantStyles() {
    const variantMap = {
      "display-large": {
        font: "--md-sys-typescale-display-large-font",
        size: "--md-sys-typescale-display-large-size",
        lineMetric: "--md-sys-typescale-display-large-line-height",
        weight: "--md-sys-typescale-display-large-weight",
        tracking: "--md-sys-typescale-display-large-tracking",
      },
      "display-medium": {
        font: "--md-sys-typescale-display-medium-font",
        size: "--md-sys-typescale-display-medium-size",
        lineMetric: "--md-sys-typescale-display-medium-line-height",
        weight: "--md-sys-typescale-display-medium-weight",
        tracking: "--md-sys-typescale-display-medium-tracking",
      },
      "display-small": {
        font: "--md-sys-typescale-display-small-font",
        size: "--md-sys-typescale-display-small-size",
        lineMetric: "--md-sys-typescale-display-small-line-height",
        weight: "--md-sys-typescale-display-small-weight",
        tracking: "--md-sys-typescale-display-small-tracking",
      },
      "headline-large": {
        font: "--md-sys-typescale-headline-large-font",
        size: "--md-sys-typescale-headline-large-size",
        lineMetric: "--md-sys-typescale-headline-large-line-height",
        weight: "--md-sys-typescale-headline-large-weight",
        tracking: "--md-sys-typescale-headline-large-tracking",
      },
      "headline-medium": {
        font: "--md-sys-typescale-headline-medium-font",
        size: "--md-sys-typescale-headline-medium-size",
        lineMetric: "--md-sys-typescale-headline-medium-line-height",
        weight: "--md-sys-typescale-headline-medium-weight",
        tracking: "--md-sys-typescale-headline-medium-tracking",
      },
      "headline-small": {
        font: "--md-sys-typescale-headline-small-font",
        size: "--md-sys-typescale-headline-small-size",
        lineMetric: "--md-sys-typescale-headline-small-line-height",
        weight: "--md-sys-typescale-headline-small-weight",
        tracking: "--md-sys-typescale-headline-small-tracking",
      },
      "title-large": {
        font: "--md-sys-typescale-title-large-font",
        size: "--md-sys-typescale-title-large-size",
        lineMetric: "--md-sys-typescale-title-large-line-height",
        weight: "--md-sys-typescale-title-large-weight",
        tracking: "--md-sys-typescale-title-large-tracking",
      },
      "title-medium": {
        font: "--md-sys-typescale-title-medium-font",
        size: "--md-sys-typescale-title-medium-size",
        lineMetric: "--md-sys-typescale-title-medium-line-height",
        weight: "--md-sys-typescale-title-medium-weight",
        tracking: "--md-sys-typescale-title-medium-tracking",
      },
      "title-small": {
        font: "--md-sys-typescale-title-small-font",
        size: "--md-sys-typescale-title-small-size",
        lineMetric: "--md-sys-typescale-title-small-line-height",
        weight: "--md-sys-typescale-title-small-weight",
        tracking: "--md-sys-typescale-title-small-tracking",
      },
      "body-large": {
        font: "--md-sys-typescale-body-large-font",
        size: "--md-sys-typescale-body-large-size",
        lineMetric: "--md-sys-typescale-body-large-line-height",
        weight: "--md-sys-typescale-body-large-weight",
        tracking: "--md-sys-typescale-body-large-tracking",
      },
      "body-medium": {
        font: "--md-sys-typescale-body-medium-font",
        size: "--md-sys-typescale-body-medium-size",
        lineMetric: "--md-sys-typescale-body-medium-line-height",
        weight: "--md-sys-typescale-body-medium-weight",
        tracking: "--md-sys-typescale-body-medium-tracking",
      },
      "body-small": {
        font: "--md-sys-typescale-body-small-font",
        size: "--md-sys-typescale-body-small-size",
        lineMetric: "--md-sys-typescale-body-small-line-height",
        weight: "--md-sys-typescale-body-small-weight",
        tracking: "--md-sys-typescale-body-small-tracking",
      },
      "label-large": {
        font: "--md-sys-typescale-label-large-font",
        size: "--md-sys-typescale-label-large-size",
        lineMetric: "--md-sys-typescale-label-large-line-height",
        weight: "--md-sys-typescale-label-large-weight",
        tracking: "--md-sys-typescale-label-large-tracking",
      },
      "label-medium": {
        font: "--md-sys-typescale-label-medium-font",
        size: "--md-sys-typescale-label-medium-size",
        lineMetric: "--md-sys-typescale-label-medium-line-height",
        weight: "--md-sys-typescale-label-medium-weight",
        tracking: "--md-sys-typescale-label-medium-tracking",
      },
      "label-small": {
        font: "--md-sys-typescale-label-small-font",
        size: "--md-sys-typescale-label-small-size",
        lineMetric: "--md-sys-typescale-label-small-line-height",
        weight: "--md-sys-typescale-label-small-weight",
        tracking: "--md-sys-typescale-label-small-tracking",
      },
    };

    return variantMap[this._variant] || variantMap["body-medium"];
  }

  /**
   * Get CSS variable for the selected color
   * @returns {string} CSS color variable
   */
  getColorVariable() {
    const colorMap = {
      "on-surface": "--md-sys-color-on-surface",
      primary: "--md-sys-color-primary",
      secondary: "--md-sys-color-secondary",
      tertiary: "--md-sys-color-tertiary",
      error: "--md-sys-color-error",
      "on-primary": "--md-sys-color-on-primary",
      "on-secondary": "--md-sys-color-on-secondary",
      "on-tertiary": "--md-sys-color-on-tertiary",
      "on-error": "--md-sys-color-on-error",
      outline: "--md-sys-color-outline",
      "surface-variant": "--md-sys-color-surface-variant",
      "on-surface-variant": "--md-sys-color-on-surface-variant",
    };

    return colorMap[this._color] || colorMap["on-surface"];
  }

  render() {
    const variantStyles = this.getVariantStyles();
    const colorVariable = this.getColorVariable();

    // Build truncate styles
    let truncateStyles = "";
    if (this._truncate && !this._lines) {
      truncateStyles = `
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
    } else if (this._lines) {
      truncateStyles = `
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: ${this._lines};
        overflow: hidden;
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: var(${variantStyles.font});
          font-size: var(${variantStyles.size});
          line-height: var(${variantStyles.lineMetric});
          font-weight: var(${variantStyles.weight});
          letter-spacing: var(${variantStyles.tracking});
          color: var(${colorVariable});
          text-align: ${this._align};
          display: block;
          margin: 0;
          padding: 0;
        }

        :host(p),
        :host(span),
        :host(div) {
          display: contents;
        }

        .text-wrapper {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          color: inherit;
          text-align: inherit;
          ${truncateStyles}
        }

        /* CSS Parts for external styling */
        ::part(text) {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          color: inherit;
          text-align: inherit;
          ${truncateStyles}
        }
      </style>

      <span part="text" class="text-wrapper">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get("ds-text-wrapper")) {
  customElements.define("ds-text-wrapper", DSTextWrapper);
}
