/**
 * DSAppBarTop - A Material Design 3 top app bar component
 * Supports small, center-aligned, medium, and large variants with scroll collapse.
 *
 * @element ds-app-bar-top
 *
 * @fires {CustomEvent} ds-app-bar:navigation - Fired when the navigation button is clicked (fallback button)
 *
 * @slot navigation - Leading slot for navigation icon/button (drawer, back, menu)
 * @slot actions - Trailing slot for action icons/buttons
 * @slot title - Title content (fallbacks to `title` attribute)
 * @slot subtitle - Subtitle content (medium/large variants; fallbacks to `subtitle` attribute)
 *
 * @csspart container - The app bar container
 * @csspart navigation - Leading navigation region
 * @csspart title - Title wrapper
 * @csspart subtitle - Subtitle text
 * @csspart actions - Trailing actions region
 * @csspart nav-button - Fallback navigation button
 */
export class DSAppBarTop extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "title", "subtitle", "nav-icon", "scrolled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._boundOnNavClick = this.onNavClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    const value = this.getAttribute("variant") || "small";
    const valid = ["small", "center", "medium", "large"];
    return valid.includes(value) ? value : "small";
  }

  set variant(val) {
    this.setAttribute("variant", val);
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  set title(val) {
    this.setAttribute("title", val);
  }

  get subtitle() {
    return this.getAttribute("subtitle") || "";
  }

  set subtitle(val) {
    this.setAttribute("subtitle", val);
  }

  get navIcon() {
    return this.getAttribute("nav-icon") || "";
  }

  set navIcon(val) {
    this.setAttribute("nav-icon", val);
  }

  get scrolled() {
    return this.hasAttribute("scrolled");
  }

  set scrolled(val) {
    if (val) {
      this.setAttribute("scrolled", "");
    } else {
      this.removeAttribute("scrolled");
    }
  }

  setupEventListeners() {
    const navButton = this.shadowRoot.querySelector(".nav-button");
    if (navButton) {
      navButton.addEventListener("click", this._boundOnNavClick);
    }
  }

  removeEventListeners() {
    const navButton = this.shadowRoot.querySelector(".nav-button");
    if (navButton) {
      navButton.removeEventListener("click", this._boundOnNavClick);
    }
  }

  onNavClick() {
    this.dispatchEvent(
      new CustomEvent("ds-app-bar:navigation", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const variant = this.variant;
    const title = this.title;
    const subtitle = this.subtitle;
    const navIcon = this.navIcon;
    const scrolled = this.scrolled;

    const heights = {
      small: 64,
      center: 64,
      medium: 112,
      large: 152,
    };
    const barHeight = scrolled ? heights.small : heights[variant];

    const showSubtitle =
      !scrolled && (variant === "medium" || variant === "large");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: var(--md-sys-color-on-surface, #1d1b20);
        }

        .app-bar {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          width: 100%;
          height: ${barHeight}px;
          box-sizing: border-box;
          background: var(--ds-app-bar-bg, var(--md-sys-color-surface, #fffbfe));
          color: var(--ds-app-bar-color, var(--md-sys-color-on-surface, #1d1b20));
          box-shadow: ${
            scrolled
              ? "var(--ds-app-bar-shadow, 0 4px 12px rgba(0,0,0,0.12))"
              : "var(--ds-app-bar-shadow, none)"
          };
          transition: box-shadow 0.2s ease, height 0.25s ease;
        }

        :host([variant="center"]) .app-bar {
          grid-template-columns: 1fr auto 1fr;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 48px;
        }

        .nav-button {
          width: 40px;
          height: 40px;
          border: none;
          background: none;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: inherit;
          position: relative;
          font-family: "Material Symbols Outlined";
          font-size: 24px;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav-button:focus-visible {
          outline: none;
        }

        .nav-button:focus-visible::before {
          content: "";
          position: absolute;
          inset: 2px;
          border: 2px solid var(--md-sys-color-primary, #6750a4);
          border-radius: 999px;
          pointer-events: none;
        }

        .nav-button .state-layer,
        ::slotted([slot="navigation"]) .state-layer {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          opacity: 0;
          background: var(--ds-app-bar-hover-color, var(--md-sys-color-on-surface, #1d1b20));
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        .nav-button:hover .state-layer,
        ::slotted([slot="navigation"]:hover) .state-layer {
          opacity: var(--ds-app-bar-hover-opacity, 0.08);
        }

        .nav-button:active .state-layer,
        ::slotted([slot="navigation"]:active) .state-layer {
          opacity: var(--ds-app-bar-pressed-opacity, 0.12);
        }

        .title-area {
          display: flex;
          flex-direction: column;
          align-items: ${variant === "center" ? "center" : "flex-start"};
          justify-content: center;
          gap: 2px;
          min-width: 0;
        }

        .title {
          margin: 0;
          font-size: ${scrolled ? "18px" : "20px"};
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subtitle {
          margin: 0;
          font-size: 14px;
          font-weight: 400;
          color: var(--md-sys-color-on-surface-variant, #49454f);
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .actions {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        ::slotted([slot="actions"]) {
          display: inline-flex;
        }
      </style>

      <header class="app-bar" part="container" role="banner" data-variant="${variant}" data-scrolled="${
      scrolled ? "true" : "false"
    }">
        <div class="nav" part="navigation">
          <slot name="navigation">
            ${
              navIcon
                ? `<button class="nav-button" part="nav-button" aria-label="Navigation">
              <span class="state-layer"></span>
              <span aria-hidden="true">${navIcon}</span>
            </button>`
                : ""
            }
          </slot>
        </div>

        <div class="title-area" part="title">
          <div class="title"><slot name="title">${title}</slot></div>
          ${
            showSubtitle
              ? `<div class="subtitle" part="subtitle"><slot name="subtitle">${subtitle}</slot></div>`
              : ""
          }
        </div>

        <div class="actions" part="actions">
          <slot name="actions"></slot>
        </div>
      </header>
    `;

    this.removeEventListeners();
    this.setupEventListeners();
  }
}

customElements.define("ds-app-bar-top", DSAppBarTop);

export default DSAppBarTop;
