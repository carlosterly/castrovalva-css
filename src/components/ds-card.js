/**
 * Material Design 3 Card Component
 * Surface for displaying content and actions on a single topic
 */
export class DSCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "elevated"; // elevated, filled, outlined
    this._interactive = false;
  }

  static get observedAttributes() {
    return ["variant", "interactive"];
  }

  connectedCallback() {
    this.render();
    if (this._interactive) {
      this.setupInteractive();
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "elevated";
        break;
      case "interactive":
        this._interactive = newValue !== null;
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
      if (this._interactive) {
        this.setupInteractive();
      }
    }
  }

  get variant() {
    return this._variant;
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get interactive() {
    return this._interactive;
  }

  set interactive(value) {
    if (value) {
      this.setAttribute("interactive", "");
    } else {
      this.removeAttribute("interactive");
    }
  }

  setupInteractive() {
    const container = this.shadowRoot.querySelector(".card");
    if (!container) return;

    container.style.cursor = "pointer";
    container.setAttribute("tabindex", "0");
    container.setAttribute("role", "button");

    this._clickHandler = () => {
      this.dispatchEvent(
        new CustomEvent("ds-card:click", {
          bubbles: true,
          composed: true,
        }),
      );
    };

    this._keyHandler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this._clickHandler();
      }
    };

    container.addEventListener("click", this._clickHandler);
    container.addEventListener("keydown", this._keyHandler);
  }

  cleanup() {
    const container = this.shadowRoot.querySelector(".card");
    if (container && this._clickHandler) {
      container.removeEventListener("click", this._clickHandler);
      container.removeEventListener("keydown", this._keyHandler);
    }
  }

  render() {
    const variant = this._variant;
    const isInteractive = this._interactive;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          /* MD3's medium shape (12dp) has no matching --ds-radius-* token —
             the scale jumps from sm (4px) to md (8px) to lg (16px). */
          --ds-card-corner-radius: 12px;
          --ds-card-padding: var(--ds-space-4, 16px);
          --ds-card-action-gap: var(--ds-space-2, 8px);
          --ds-card-touch-target-size: var(--ds-size-hit-area, 40px);
        }

        .card {
          display: flex;
          flex-direction: column;
          background-color: var(--md-sys-color-surface);
          border-radius: var(--ds-card-corner-radius);
          overflow: hidden;
          position: relative;
          transition: box-shadow 200ms var(--md-sys-motion-easing-standard);
        }

        /* Elevated variant. A drop shadow alone is nearly invisible in
           dark mode, so the surface also steps up a tonal container
           level to stay separated from the page background. */
        .card[data-variant="elevated"] {
          background-color: var(--md-sys-color-surface-container-low);
          box-shadow: var(--md-sys-elevation-level1);
        }

        .card[data-variant="elevated"]:hover {
          box-shadow: var(--md-sys-elevation-level2);
        }

        /* Filled variant */
        .card[data-variant="filled"] {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        /* Outlined variant */
        .card[data-variant="outlined"] {
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        /* Interactive states */
        .card[data-interactive="true"] {
          transition: box-shadow 200ms var(--md-sys-motion-easing-standard),
                      background-color 200ms var(--md-sys-motion-easing-standard);
          min-block-size: var(--ds-card-touch-target-size);
        }

        .card[data-interactive="true"]:hover::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-surface);
          opacity: 0.08;
          pointer-events: none;
        }

        .card[data-interactive="true"]:focus {
          outline: none;
        }

        .card[data-interactive="true"]:focus::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: var(--md-sys-color-on-surface);
          opacity: 0.12;
          pointer-events: none;
        }

        .card[data-interactive="true"]:active::before {
          opacity: 0.16;
        }

        .card[data-interactive="true"][data-variant="elevated"]:hover {
          box-shadow: var(--md-sys-elevation-level2);
        }

        /* Media slot */
        .media {
          width: 100%;
          overflow: hidden;
        }

        ::slotted([slot="media"]) {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Header section */
        .header {
          padding: var(--ds-card-padding);
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: var(--ds-card-padding);
        }

        .header-text {
          flex: 1;
          min-width: 0;
        }

        .title {
          margin: 0;
          font-family: var(--md-sys-typescale-title-large-font);
          font-size: var(--md-sys-typescale-title-large-size);
          line-height: var(--md-sys-typescale-title-large-line-height);
          font-weight: var(--md-sys-typescale-title-large-weight);
          color: var(--md-sys-color-on-surface);
        }

        .subhead {
          margin: 4px 0 0 0;
          font-family: var(--md-sys-typescale-body-medium-font);
          font-size: var(--md-sys-typescale-body-medium-size);
          line-height: var(--md-sys-typescale-body-medium-line-height);
          color: var(--md-sys-color-on-surface-variant);
        }

        /* Content section */
        .content {
          padding: 0 var(--ds-card-padding) var(--ds-card-padding)
            var(--ds-card-padding);
          color: var(--md-sys-color-on-surface-variant);
          font-family: var(--md-sys-typescale-body-medium-font);
          font-size: var(--md-sys-typescale-body-medium-size);
          line-height: var(--md-sys-typescale-body-medium-line-height);
        }

        /* Actions section */
        .actions {
          padding: var(--ds-card-action-gap) var(--ds-card-padding)
            var(--ds-card-padding) var(--ds-card-padding);
          display: flex;
          gap: var(--ds-card-action-gap);
          align-items: center;
          min-block-size: var(--ds-card-touch-target-size);
        }

        ::slotted([slot="actions"]) {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* Hide empty sections */
        .header:empty,
        .content:empty,
        .actions:empty {
          display: none;
        }

        /* Accessibility */
        :host(:focus) {
          outline: none;
        }
      </style>

      <div 
        class="card" 
        data-variant="${variant}"
        data-interactive="${isInteractive}">
        
        <div class="media">
          <slot name="media"></slot>
        </div>

        <div class="header">
          <div class="header-content">
            <div class="header-text">
              <h3 class="title">
                <slot name="title"></slot>
              </h3>
              <p class="subhead">
                <slot name="subhead"></slot>
              </p>
            </div>
            <slot name="header-action"></slot>
          </div>
        </div>

        <div class="content">
          <slot></slot>
        </div>

        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-card", DSCard);
