/**
 * Material Design 3 Dialog Component
 * Modal dialogs for confirmations, alerts, and forms
 */
export class DSDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "basic";
    this._open = false;
    this._dismissOnBackdropClick = true;
    this._dismissOnEsc = true;
    this._previousFocus = null;
    this._syncingAttribute = false;
    this._bodyScrollLocked = false;

    this._onDialogCancel = (event) => {
      event.preventDefault();
      if (this._dismissOnEsc) {
        this.close();
      }
    };

    this._onDialogClick = (event) => {
      if (!this._dismissOnBackdropClick) {
        return;
      }

      if (event.target === this._dialogEl) {
        this.close();
      }
    };
    this._onDocumentKeydown = (event) => {
      if (event.key === "Escape" && this._open && this._dismissOnEsc) {
        this.close();
      }
    };
  }

  static get observedAttributes() {
    return ["variant", "open", "dismiss-on-backdrop-click", "dismiss-on-esc"];
  }

  connectedCallback() {
    this.render();
    document.addEventListener("keydown", this._onDocumentKeydown);

    if (this.hasAttribute("open")) {
      this._open = false;
      this.show();
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "basic";
        if (this._dialogEl) {
          this._dialogEl.dataset.variant = this._variant;
        }
        break;
      case "open":
        if (this._syncingAttribute) {
          return;
        }

        if (
          !this.isConnected ||
          !this.shadowRoot.innerHTML ||
          !this._dialogEl
        ) {
          this._open = newValue !== null;
          return;
        }

        if (newValue !== null && !this._open) {
          this.show();
        } else if (newValue === null && this._open) {
          this.close();
        }
        return;
      case "dismiss-on-backdrop-click":
        this._dismissOnBackdropClick = newValue !== "false";
        break;
      case "dismiss-on-esc":
        this._dismissOnEsc = newValue !== "false";
        break;
    }
  }

  get variant() {
    return this._variant;
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get open() {
    return this._open;
  }

  set open(value) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  show() {
    if (this._open || !this._dialogEl) return;

    const otherOpenDialogs = Array.from(
      document.querySelectorAll("ds-dialog[open]"),
    ).filter((dialog) => dialog !== this);
    otherOpenDialogs.forEach((dialog) => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });

    if (!this.hasAttribute("open")) {
      this._syncingAttribute = true;
      this.setAttribute("open", "");
      this._syncingAttribute = false;
    }

    this._previousFocus = document.activeElement;

    if (!this._dialogEl.open) {
      this._dialogEl.showModal();
    }

    this._open = true;
    this._lockBodyScroll();

    setTimeout(() => {
      this.focusFirstElement();
    }, 0);

    this.dispatchEvent(
      new CustomEvent("ds-dialog:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  close() {
    if ((!this._open && !this._dialogEl?.open) || !this._dialogEl) return;

    if (this._dialogEl.open) {
      this._dialogEl.close();
    }

    this._open = false;
    this._unlockBodyScroll();

    if (this.hasAttribute("open")) {
      this._syncingAttribute = true;
      this.removeAttribute("open");
      this._syncingAttribute = false;
    }

    if (this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }

    this.dispatchEvent(
      new CustomEvent("ds-dialog:close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  focusFirstElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  getFocusableElements() {
    const dialog = this._dialogEl;
    if (!dialog) {
      return [];
    }

    const selectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    return Array.from(dialog.querySelectorAll(selectors.join(",")));
  }

  cleanup() {
    if (this._dialogEl) {
      this._dialogEl.removeEventListener("cancel", this._onDialogCancel);
      this._dialogEl.removeEventListener("click", this._onDialogClick);
      if (this._dialogEl.open) {
        this._dialogEl.close();
      }
    }
    document.removeEventListener("keydown", this._onDocumentKeydown);
    this._unlockBodyScroll();
  }

  _lockBodyScroll() {
    if (this._bodyScrollLocked) {
      return;
    }

    this._bodyScrollLocked = true;
    DSDialog._openDialogCount = (DSDialog._openDialogCount || 0) + 1;
    document.body.style.overflow = "hidden";
  }

  _unlockBodyScroll() {
    if (!this._bodyScrollLocked) {
      return;
    }

    this._bodyScrollLocked = false;
    DSDialog._openDialogCount = Math.max(
      (DSDialog._openDialogCount || 1) - 1,
      0,
    );

    if (DSDialog._openDialogCount === 0) {
      document.body.style.overflow = "";
    }
  }

  render() {
    if (this._dialogEl) {
      this._dialogEl.removeEventListener("cancel", this._onDialogCancel);
      this._dialogEl.removeEventListener("click", this._onDialogClick);
    }

    const variant = this._variant;
    const isFullScreen = variant === "full-screen";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: contents;
          --ds-dialog-close-button-size: var(--ds-size-control-md, 40px);
          --ds-dialog-icon-size: var(--ds-size-icon-lg, 24px);
          --ds-dialog-action-gap: var(--ds-space-2, 8px);
          --ds-dialog-header-gap: var(--ds-space-4, 16px);
          --ds-dialog-padding: var(--ds-space-6, 24px);
          --ds-dialog-fullscreen-header-padding-block: var(--ds-space-4, 16px);
          --ds-dialog-fullscreen-header-padding-inline: var(--ds-space-6, 24px);
        }

        dialog {
          border: none;
          padding: 0;
          margin: auto;
          background: transparent;
          max-inline-size: none;
          max-block-size: none;
          overflow: visible;
        }

        dialog::backdrop {
          background-color: transparent;
        }

        .surface {
          background-color: var(
            --ds-dialog-surface-color,
            var(--md-sys-color-surface-container-high, var(--md-sys-color-surface, #fef7ff))
          );
          border: 1px solid
            var(
              --md-sys-color-outline-variant,
              var(--md-sys-color-outline, #79747e)
            );
          border-radius: 28px;
          box-shadow: var(--md-sys-elevation-level3);
          max-block-size: 90vh;
          overflow-y: auto;
        }

        .surface[data-variant="basic"] {
          min-inline-size: 280px;
          max-inline-size: 560px;
          padding: var(--ds-dialog-padding);
        }

        .surface[data-variant="alert"] {
          min-inline-size: 280px;
          max-inline-size: 312px;
          padding: var(--ds-dialog-padding);
        }

        .surface[data-variant="full-screen"] {
          border-radius: 0;
          max-inline-size: 100%;
          max-block-size: 100%;
          inline-size: 100%;
          block-size: 100%;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        dialog[data-variant="full-screen"] {
          inline-size: 100vw;
          block-size: 100vh;
        }

        .header {
          display: flex;
          align-items: center;
          gap: var(--ds-dialog-header-gap);
          margin-block-end: var(--ds-dialog-header-gap);
        }

        .surface[data-variant="full-screen"] .header {
          padding: var(--ds-dialog-fullscreen-header-padding-block)
            var(--ds-dialog-fullscreen-header-padding-inline);
          border-block-end: 1px solid var(--md-sys-color-outline-variant);
          margin-block-end: 0;
        }

        .icon {
          font-size: var(--ds-dialog-icon-size);
          color: var(--md-sys-color-secondary);
        }

        .title {
          flex: 1;
          margin: 0;
          font-family: var(--md-sys-typescale-headline-small-font);
          font-size: var(--md-sys-typescale-headline-small-size);
          line-height: var(--md-sys-typescale-headline-small-line-height);
          font-weight: var(--md-sys-typescale-headline-small-weight);
          color: var(--md-sys-color-on-surface);
        }

        .close-button {
          background: transparent;
          border: none;
          inline-size: var(--ds-dialog-close-button-size);
          block-size: var(--ds-dialog-close-button-size);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-surface);
          font-size: 24px;
          transition: background-color 200ms;
        }

        .close-button:hover {
          background-color: var(--md-sys-color-surface-variant);
        }

        .close-button:focus {
          outline: none;
          background-color: var(--md-sys-color-surface-variant);
        }

        .content {
          color: var(--md-sys-color-on-surface-variant);
          font-family: var(--md-sys-typescale-body-medium-font);
          font-size: var(--md-sys-typescale-body-medium-size);
          line-height: var(--md-sys-typescale-body-medium-line-height);
          margin: 0 0 24px 0;
        }

        .surface[data-variant="full-screen"] .content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          margin: 0;
        }

        .actions {
          display: flex;
          gap: var(--ds-dialog-action-gap);
          justify-content: flex-end;
        }

        .surface[data-variant="full-screen"] .actions {
          padding: 16px 24px;
          border-block-start: 1px solid var(--md-sys-color-outline-variant);
        }

        .surface[data-variant="alert"] .actions {
          flex-direction: row-reverse;
        }

        ::slotted([slot="actions"]) {
          display: flex;
          gap: var(--ds-dialog-action-gap);
        }

        @media (max-inline-size: 600px) {
          .surface[data-variant="basic"],
          .surface[data-variant="alert"] {
            inline-size: calc(100% - 32px);
            max-inline-size: calc(100% - 32px);
          }
        }
      </style>

      <dialog class="dialog" role="dialog" aria-modal="true" data-variant="${variant}">
        <div class="surface" data-variant="${variant}">
          <div class="header">
            ${isFullScreen ? '<slot name="icon"></slot>' : ""}
            <h2 class="title">
              <slot name="title">Dialog Title</slot>
            </h2>
            ${
              isFullScreen
                ? '<button class="close-button" type="button" aria-label="Close">✕</button>'
                : ""
            }
          </div>
          <div class="content">
            <slot>Dialog content goes here.</slot>
          </div>
          <div class="actions">
            <slot name="actions">
              <button type="button" class="default-cancel">Cancel</button>
              <button type="button" class="default-confirm">OK</button>
            </slot>
          </div>
        </div>
      </dialog>
    `;

    this._dialogEl = this.shadowRoot.querySelector("dialog");
    this._dialogEl?.addEventListener("cancel", this._onDialogCancel);
    this._dialogEl?.addEventListener("click", this._onDialogClick);

    const cancelBtn = this.shadowRoot.querySelector(".default-cancel");
    const confirmBtn = this.shadowRoot.querySelector(".default-confirm");
    const closeBtn = this.shadowRoot.querySelector(".close-button");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.close());
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("ds-dialog:confirm", {
            bubbles: true,
            composed: true,
          }),
        );
        this.close();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }
  }
}

if (!customElements.get("ds-dialog")) {
  customElements.define("ds-dialog", DSDialog);
}
