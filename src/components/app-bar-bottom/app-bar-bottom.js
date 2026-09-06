/**
 * DSAppBarBottom - A Material Design 3 bottom app bar component
 * Supports standard and with-FAB variants with action buttons.
 *
 * @element ds-app-bar-bottom
 *
 * @fires {CustomEvent} ds-app-bar-bottom:action - Fired when an action button is clicked
 *
 * @slot actions - Trailing slot for action icons/buttons
 * @slot fab - Optional FAB slot for center cutout (with-fab variant only)
 *
 * @csspart container - The app bar container
 * @csspart fab-area - FAB cutout container
 * @csspart actions - Trailing actions region
 */
export class DSAppBarBottom extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
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

  get variant() {
    const value = this.getAttribute("variant") || "standard";
    const valid = ["standard", "with-fab"];
    return valid.includes(value) ? value : "standard";
  }

  set variant(val) {
    this.setAttribute("variant", val);
  }

  render() {
    const variant = this.variant;
    const hasFab = variant === "with-fab";

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
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          min-height: 80px;
          box-sizing: border-box;
          background: var(--ds-app-bar-bg, var(--md-sys-color-surface, #fffbfe));
          color: var(--ds-app-bar-color, var(--md-sys-color-on-surface, #1d1b20));
          box-shadow: var(--ds-app-bar-shadow, 0 4px 12px rgba(0,0,0,0.12));
          transition: box-shadow 0.2s ease;
        }

        ${
          hasFab
            ? `
        .app-bar {
          padding: 0;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
        }

        .spacer {
          grid-column: 1;
          flex: 1;
          padding: 0 16px;
        }

        .fab-area {
          grid-column: 2;
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .fab-area::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 48px;
          background: var(--ds-app-bar-bg, var(--md-sys-color-surface, #fffbfe));
          border-radius: 24px 24px 0 0;
        }

        .fab-slot {
          position: relative;
          z-index: 11;
        }

        .actions {
          grid-column: 3;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 0 16px;
          min-height: 80px;
        }
        `
            : `
        .fab-area {
          display: none;
        }

        .actions {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 0 16px;
          min-height: 80px;
        }
        `
        }

        ::slotted([slot="actions"]) {
          display: inline-flex;
          position: relative;
          width: 40px;
          height: 40px;
          border: none;
          background: none;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: inherit;
          font-family: "Material Symbols Outlined";
          font-size: 24px;
          transition: background 0.2s ease;
        }

        ::slotted([slot="actions"]:hover) {
          background: var(--md-sys-color-on-surface, rgba(29, 27, 32, 0.08));
        }

        ::slotted([slot="actions"]:focus-visible) {
          outline: none;
          background: var(--md-sys-color-on-surface, rgba(29, 27, 32, 0.12));
        }

        ::slotted([slot="fab"]) {
          position: relative;
          z-index: 11;
        }
      </style>

      <footer class="app-bar" part="container" role="contentinfo" data-variant="${variant}">
        ${hasFab ? "<div class=\"spacer\"></div>" : ""}
        <div class="fab-area" part="fab-area">
          <slot name="fab" class="fab-slot"></slot>
        </div>
        <div class="actions" part="actions">
          <slot name="actions"></slot>
        </div>
      </footer>
    `;
  }
}

customElements.define("ds-app-bar-bottom", DSAppBarBottom);

export default DSAppBarBottom;
