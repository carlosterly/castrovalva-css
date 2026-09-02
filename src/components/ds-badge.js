/**
 * Lightweight Badge component
 * Supports numeric count, dot mode, status color, and max display with overflow
 */
export class DSBadge extends HTMLElement {
  static get observedAttributes() {
    return ["value", "dot", "max", "color", "position"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._value = null;
    this._dot = false;
    this._max = 99;
    this._color = "primary"; // maps to css token
    this._position = "inline"; // inline or overlap
  }

  connectedCallback() {
    this._readAttributes();
    this.render();
  }

  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV) return;
    this._readAttributes();
    this._update();
  }

  _readAttributes() {
    this._value = this.hasAttribute("value")
      ? this.getAttribute("value")
      : null;
    this._dot = this.hasAttribute("dot");
    this._max = this.hasAttribute("max")
      ? parseInt(this.getAttribute("max"), 10)
      : 99;
    this._color = this.getAttribute("color") || "primary";
    this._position = this.getAttribute("position") || "inline";
    if (this._position !== "inline" && this._position !== "overlap") {
      this._position = "inline";
    }
  }

  get value() {
    return this._value;
  }

  set value(v) {
    if (v === null || v === undefined || v === "") {
      this.removeAttribute("value");
      return;
    }
    this.setAttribute("value", String(v));
  }

  get dot() {
    return this._dot;
  }

  set dot(v) {
    if (v) {
      this.setAttribute("dot", "");
    } else {
      this.removeAttribute("dot");
    }
  }

  get max() {
    return this._max;
  }

  set max(v) {
    const parsed = Number.parseInt(v, 10);
    if (Number.isNaN(parsed)) {
      this.removeAttribute("max");
      return;
    }
    this.setAttribute("max", String(parsed));
  }

  get color() {
    return this._color;
  }

  set color(v) {
    if (!v) {
      this.removeAttribute("color");
      return;
    }
    this.setAttribute("color", String(v));
  }

  get position() {
    return this._position;
  }

  set position(v) {
    if (v !== "inline" && v !== "overlap") {
      this.removeAttribute("position");
      return;
    }
    this.setAttribute("position", v);
  }

  _formatValue() {
    if (this._dot) return "";
    if (this._value === null) return "";
    const n = Number(this._value);
    if (Number.isNaN(n)) return this._value;
    if (n > this._max) return `${this._max}+`;
    return String(n);
  }

  _update() {
    const badge = this.shadowRoot.querySelector(".badge");
    if (!badge) return;
    const text = this._formatValue();
    badge.textContent = text;

    badge.classList.toggle("dot", this._dot);
    badge.classList.toggle("overlap", this._position === "overlap");
    this.classList.toggle("position-overlap", this._position === "overlap");
    badge.style.setProperty("--badge-bg", this._resolveColor(this._color));
  }

  _resolveColor(name) {
    if (!name) return "var(--md-sys-color-primary, #6750a4)";
    if (name === "primary") return "var(--md-sys-color-primary, #6750a4)";
    if (name === "secondary") return "var(--md-sys-color-secondary, #7a5268)";
    if (name === "error") return "var(--md-sys-color-error, #b00020)";
    // allow CSS color strings
    return name;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --ds-badge-size: var(--ds-size-icon-md, 18px);
          --ds-badge-dot-size: var(--ds-size-icon-sm, 14px);
          --ds-badge-padding-inline: var(--ds-space-1, 4px);
          --ds-badge-font-size: 12px;
          display: inline-block;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-inline-size: var(--ds-badge-size);
          block-size: var(--ds-badge-size);
          padding: 0 var(--ds-badge-padding-inline);
          font-size: var(--ds-badge-font-size);
          line-height: 1;
          border-radius: 999px;
          background: var(--badge-bg, var(--md-sys-color-primary, #6750a4));
          color: var(--md-sys-color-on-primary, #fff);
          box-sizing: border-box;
          vertical-align: middle;
          white-space: nowrap;
        }
        .badge.dot {
          inline-size: var(--ds-badge-dot-size);
          min-inline-size: var(--ds-badge-dot-size);
          block-size: var(--ds-badge-dot-size);
          padding: 0;
          border-radius: 50%;
        }
        .badge.overlap {
          position: absolute;
          transform: translate(50%, -50%);
        }
        :host(.position-overlap) {
          position: relative;
          display: inline-flex;
        }
      </style>
      <span class="badge" role="status" aria-hidden="false"></span>
    `;

    this._update();
  }
}

if (!customElements.get("ds-badge")) {
  customElements.define("ds-badge", DSBadge);
}
