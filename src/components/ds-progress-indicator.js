/**
 * Material Design 3 Progress Indicator Web Components
 * Implements MD3 specifications for linear and circular progress indicators
 */

const DEFAULT_MAX = 100;

const COLOR_MAP = {
  primary: "var(--md-sys-color-primary)",
  secondary: "var(--md-sys-color-secondary)",
  tertiary: "var(--md-sys-color-tertiary)",
  error: "var(--md-sys-color-error)",
};

function parseNonNegativeNumber(value, fallback) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

function normalizeMax(value) {
  const parsed = parseNonNegativeNumber(value, DEFAULT_MAX);
  return parsed <= 0 ? DEFAULT_MAX : parsed;
}

function normalizeColor(color) {
  return COLOR_MAP[color] ? color : "primary";
}

/**
 * Linear Progress Indicator Component
 */
export class DSLinearProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["value", "max", "indeterminate", "color"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "color") {
        const normalized = normalizeColor(newValue || "primary");
        if (normalized !== newValue) {
          this.setAttribute("color", normalized);
          return;
        }
      }
      this.render();
    }
  }

  get value() {
    return parseNonNegativeNumber(this.getAttribute("value"), 0);
  }

  set value(val) {
    this.setAttribute("value", String(val));
  }

  get max() {
    return normalizeMax(this.getAttribute("max"));
  }

  set max(val) {
    this.setAttribute("max", String(val));
  }

  get indeterminate() {
    return this.hasAttribute("indeterminate");
  }

  set indeterminate(val) {
    if (val) {
      this.setAttribute("indeterminate", "");
    } else {
      this.removeAttribute("indeterminate");
    }
  }

  get color() {
    return normalizeColor(this.getAttribute("color") || "primary");
  }

  set color(val) {
    this.setAttribute("color", normalizeColor(val));
  }

  getProgress() {
    const percentage = (this.value / this.max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  render() {
    const progress = this.getProgress();
    const isIndeterminate = this.indeterminate;
    const color = this.color;

    const indicatorColor = COLOR_MAP[color];
    const trackColor =
      color === "error"
        ? "var(--md-sys-color-error-container)"
        : "var(--md-sys-color-surface-container-highest)";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          inline-size: 100%;
          --ds-linear-progress-track-size: var(--ds-space-1);
          --ds-linear-progress-radius: calc(var(--ds-space-1) / 2);
          --ds-linear-progress-transition-duration: var(--md-sys-motion-duration-medium2, 300ms);
        }

        .progress-container {
          inline-size: 100%;
          block-size: var(--ds-linear-progress-track-size);
          background: ${trackColor};
          border-radius: var(--ds-linear-progress-radius);
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          block-size: 100%;
          background: ${indicatorColor};
          transition: inline-size var(--ds-linear-progress-transition-duration)
            var(--md-sys-motion-easing-standard);
          border-radius: var(--ds-linear-progress-radius);
        }

        .progress-bar.indeterminate {
          inline-size: 100%;
          animation: indeterminate-linear 2s infinite var(--md-sys-motion-easing-emphasized);
          transform-origin: inline-start;
        }

        @keyframes indeterminate-linear {
          0% {
            transform: translateX(-100%) scaleX(0.3);
          }
          40% {
            transform: translateX(-100%) scaleX(0.3);
          }
          60% {
            transform: translateX(0%) scaleX(0.6);
          }
          100% {
            transform: translateX(100%) scaleX(0.3);
          }
        }
      </style>

      <div class="progress-container" role="progressbar"
           aria-valuemin="0"
           aria-valuemax="${this.max}"
           ${isIndeterminate ? "" : `aria-valuenow="${this.value}"`}>
        <div class="progress-bar ${isIndeterminate ? "indeterminate" : ""}"
             style="${isIndeterminate ? "" : `inline-size: ${progress}%`}">
        </div>
      </div>
    `;
  }
}

/**
 * Circular Progress Indicator Component
 */
export class DSCircularProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["value", "max", "indeterminate", "size", "color"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "color") {
        const normalized = normalizeColor(newValue || "primary");
        if (normalized !== newValue) {
          this.setAttribute("color", normalized);
          return;
        }
      }
      this.render();
    }
  }

  get value() {
    return parseNonNegativeNumber(this.getAttribute("value"), 0);
  }

  set value(val) {
    this.setAttribute("value", String(val));
  }

  get max() {
    return normalizeMax(this.getAttribute("max"));
  }

  set max(val) {
    this.setAttribute("max", String(val));
  }

  get indeterminate() {
    return this.hasAttribute("indeterminate");
  }

  set indeterminate(val) {
    if (val) {
      this.setAttribute("indeterminate", "");
    } else {
      this.removeAttribute("indeterminate");
    }
  }

  get size() {
    return this.getAttribute("size") || "md";
  }

  set size(val) {
    this.setAttribute("size", String(val));
  }

  get color() {
    return normalizeColor(this.getAttribute("color") || "primary");
  }

  set color(val) {
    this.setAttribute("color", normalizeColor(val));
  }

  getProgress() {
    const percentage = (this.value / this.max) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  getSizeValue() {
    const size = this.size;
    const sizeMap = {
      sm: 24,
      md: 48,
      lg: 64,
      small: 24,
      medium: 48,
      large: 64,
    };

    if (sizeMap[size]) {
      return sizeMap[size];
    }

    const parsed = Number.parseFloat(size);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 48;
  }

  render() {
    const progress = this.getProgress();
    const isIndeterminate = this.indeterminate;
    const sizeValue = this.getSizeValue();
    const color = this.color;

    const indicatorColor = COLOR_MAP[color];
    const trackColor =
      color === "error"
        ? "var(--md-sys-color-error-container)"
        : "var(--md-sys-color-surface-container-highest)";

    const strokeWidth = Math.max(3, sizeValue / 12);
    const radius = (sizeValue - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const center = sizeValue / 2;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --ds-circular-progress-size-sm: var(--ds-size-icon-lg);
          --ds-circular-progress-size-md: var(--ds-size-control-lg);
          --ds-circular-progress-size-lg: calc(var(--ds-size-control-lg) + var(--ds-space-4));
          inline-size: ${sizeValue}px;
          block-size: ${sizeValue}px;
        }

        svg {
          inline-size: 100%;
          block-size: 100%;
          transform: rotate(-90deg);
        }

        svg.indeterminate {
          animation: indeterminate-rotate 1.4s linear infinite;
        }

        .track {
          fill: none;
          stroke: ${trackColor};
          stroke-width: ${strokeWidth}px;
        }

        .indicator {
          fill: none;
          stroke: ${indicatorColor};
          stroke-width: ${strokeWidth}px;
          stroke-linecap: round;
          transition: stroke-dashoffset var(--md-sys-motion-duration-medium2, 300ms)
            var(--md-sys-motion-easing-standard);
        }

        .indicator.indeterminate {
          stroke-dasharray: ${circumference * 0.25} ${circumference * 0.75};
          animation: indeterminate-dash 1.4s ease-in-out infinite;
        }

        @keyframes indeterminate-rotate {
          0% {
            transform: rotate(-90deg);
          }
          100% {
            transform: rotate(270deg);
          }
        }

        @keyframes indeterminate-dash {
          0% {
            stroke-dashoffset: ${circumference * 0.25};
          }
          50% {
            stroke-dashoffset: ${circumference * 0.75};
          }
          100% {
            stroke-dashoffset: ${circumference * 0.25};
          }
        }
      </style>

      <svg class="${isIndeterminate ? "indeterminate" : ""}"
           role="progressbar"
           aria-valuemin="0"
           aria-valuemax="${this.max}"
           ${isIndeterminate ? "" : `aria-valuenow="${this.value}"`}>
        <circle
          class="track"
          cx="${center}"
          cy="${center}"
          r="${radius}">
        </circle>
        <circle
          class="indicator ${isIndeterminate ? "indeterminate" : ""}"
          cx="${center}"
          cy="${center}"
          r="${radius}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${isIndeterminate ? 0 : strokeDashoffset}">
        </circle>
      </svg>
    `;
  }
}

if (!customElements.get("ds-linear-progress")) {
  customElements.define("ds-linear-progress", DSLinearProgress);
}

if (!customElements.get("ds-circular-progress")) {
  customElements.define("ds-circular-progress", DSCircularProgress);
}
