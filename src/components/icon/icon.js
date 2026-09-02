/**
 * DSIcon - Material Symbols icon component
 * @element ds-icon
 */

const VARIANT_MAP = {
  outlined: "material-symbols-outlined",
  filled: "material-symbols-outlined",
  rounded: "material-symbols-rounded",
  sharp: "material-symbols-sharp",
};

const SIZE_MAP = {
  small: {
    css: "var(--ds-icon-size-small, calc(var(--ds-size-icon-md) + (var(--ds-space-1) / 2)))",
    px: 20,
  },
  medium: {
    css: "var(--ds-icon-size-medium, var(--ds-size-icon-lg))",
    px: 24,
  },
  large: {
    css: "var(--ds-icon-size-large, var(--ds-size-control-md))",
    px: 40,
  },
  xlarge: {
    css: "var(--ds-icon-size-xlarge, var(--ds-size-control-lg))",
    px: 48,
  },
};

function clampNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function parseSizeToken(size) {
  const sizeValue = (size || "medium").toLowerCase();

  if (SIZE_MAP[sizeValue]) {
    return SIZE_MAP[sizeValue];
  }

  const numeric = Number.parseFloat(sizeValue);
  if (Number.isFinite(numeric) && numeric > 0) {
    return {
      css: `${numeric}px`,
      px: numeric,
    };
  }

  return SIZE_MAP.medium;
}

export default class DSIcon extends HTMLElement {
  static get observedAttributes() {
    return [
      "name",
      "variant",
      "size",
      "color",
      "weight",
      "grade",
      "fill",
      "optical-size",
      "label",
    ];
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
      if (name === "variant") {
        const normalized = this.normalizeVariant(newValue);
        if (normalized !== newValue) {
          this.setAttribute("variant", normalized);
          return;
        }
      }
      this.render();
    }
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  set name(value) {
    if (value === null || value === undefined) {
      this.removeAttribute("name");
      return;
    }
    this.setAttribute("name", String(value));
  }

  get variant() {
    return this.normalizeVariant(this.getAttribute("variant"));
  }

  set variant(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("variant");
      return;
    }
    this.setAttribute("variant", this.normalizeVariant(value));
  }

  get size() {
    return this.getAttribute("size") || "medium";
  }

  set size(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("size");
      return;
    }
    this.setAttribute("size", String(value));
  }

  get color() {
    return this.getAttribute("color") || "currentColor";
  }

  set color(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("color");
      return;
    }
    this.setAttribute("color", String(value));
  }

  get weight() {
    return clampNumber(this.getAttribute("weight"), 400, 100, 700);
  }

  set weight(value) {
    this.setAttribute("weight", String(clampNumber(value, 400, 100, 700)));
  }

  get grade() {
    return clampNumber(this.getAttribute("grade"), 0, -25, 200);
  }

  set grade(value) {
    this.setAttribute("grade", String(clampNumber(value, 0, -25, 200)));
  }

  get fill() {
    return clampNumber(this.getAttribute("fill"), 0, 0, 1);
  }

  set fill(value) {
    this.setAttribute("fill", String(clampNumber(value, 0, 0, 1)));
  }

  get opticalSize() {
    const sizeConfig = this.getSizeConfig();
    return clampNumber(
      this.getAttribute("optical-size"),
      sizeConfig.px,
      20,
      48,
    );
  }

  set opticalSize(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("optical-size");
      return;
    }
    this.setAttribute("optical-size", String(clampNumber(value, 24, 20, 48)));
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("label");
      return;
    }
    this.setAttribute("label", String(value));
  }

  normalizeVariant(value) {
    return VARIANT_MAP[value] ? value : "outlined";
  }

  getSizeConfig() {
    return parseSizeToken(this.size);
  }

  getVariantClass() {
    return VARIANT_MAP[this.variant];
  }

  getFontVariationSettings() {
    const size = this.opticalSize;
    const weight = this.weight;
    const grade = this.grade;
    const fill = this.variant === "filled" ? 1 : this.fill;

    return `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`;
  }

  render() {
    const sizeConfig = this.getSizeConfig();
    const color = this.color;
    const label = this.label;
    const variantClass = this.getVariantClass();
    const fontVariationSettings = this.getFontVariationSettings();

    const role = label ? "img" : "presentation";
    const ariaLabel = label ? `aria-label="${label}"` : 'aria-hidden="true"';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          line-height: 1;
          font-size: ${sizeConfig.css};
          inline-size: ${sizeConfig.css};
          block-size: ${sizeConfig.css};
        }

        .icon {
          font-family: var(--icon-font-family, 'Material Symbols Outlined');
          font-size: inherit;
          color: ${color};
          font-variation-settings: ${fontVariationSettings};
          user-select: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'liga';
        }

        :host([spin]) .icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        :host([pulse]) .icon {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      </style>

      <span
        part="icon"
        class="icon ${variantClass}"
        role="${role}"
        ${ariaLabel}
      >${this.name}</span>
    `;
  }
}

if (!customElements.get("ds-icon")) {
  customElements.define("ds-icon", DSIcon);
}
