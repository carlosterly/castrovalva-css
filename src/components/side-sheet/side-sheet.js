/**
 * Material Design 3 Side Sheet Component
 *
 * A panel that slides in from the side (left or right) for navigation
 * or additional content. Supports standard and modal variants with
 * swipe-to-dismiss on mobile.
 *
 * @element ds-side-sheet
 *
 * @attr {string} variant - Sheet style: 'standard' (default) or 'modal'
 * @attr {string} position - Position: 'left' (default) or 'right'
 * @attr {boolean} open - Whether the sheet is visible
 * @attr {boolean} swipeable - Allow swipe-to-dismiss (default: true on mobile)
 *
 * @slot - Main content area
 * @slot header - Header/title area
 * @slot actions - Footer actions area
 *
 * @fires ds-side-sheet:open - Fired when sheet opens
 * @fires ds-side-sheet:close - Fired when sheet closes
 * @fires ds-side-sheet:swipe - Fired during swipe with { progress: 0-1 }
 *
 * @csspart container - Outer wrapper
 * @csspart scrim - Background overlay
 * @csspart sheet - Sheet container
 * @csspart header - Header slot wrapper
 * @csspart content - Main content area
 * @csspart actions - Actions slot wrapper
 *
 * @cssprop --ds-side-sheet-width - Sheet width (default: 360px)
 * @cssprop --ds-side-sheet-max-width - Maximum width (default: 100vw)
 */
export class DSSideSheet extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "position", "open", "swipeable"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "standard";
    this._position = "left";
    this._open = false;
    this._swipeable = true;
    this._startX = 0;
    this._currentX = 0;
    this._isScrubbbing = false;
    this._previousFocus = null;
    this._swipeStartTime = 0;
  }

  connectedCallback() {
    // Ensure variant attribute is set to default if not provided
    if (!this.hasAttribute("variant")) {
      this.setAttribute("variant", "standard");
    }
    if (!this.hasAttribute("position")) {
      this.setAttribute("position", "left");
    }
    this.render();
    this.setupEventListeners();

    // Handle initial open state if attribute is present
    if (this.hasAttribute("open")) {
      requestAnimationFrame(() => this.show());
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "standard";
        break;
      case "position":
        this._position = newValue || "left";
        break;
      case "open":
        const shouldOpen = newValue !== null;
        if (this.shadowRoot.innerHTML) {
          if (shouldOpen && !this._open) {
            this.show();
          } else if (!shouldOpen && this._open) {
            this.close();
          }
        }
        return;
      case "swipeable":
        this._swipeable = newValue !== "false";
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  // Getters
  get variant() {
    return this._variant;
  }

  set variant(value) {
    if (value === null || value === undefined) {
      this.setAttribute("variant", "standard");
    } else {
      this.setAttribute("variant", value);
    }
  }

  get position() {
    return this._position;
  }

  set position(value) {
    if (value === null || value === undefined) {
      this.setAttribute("position", "left");
    } else {
      this.setAttribute("position", value);
    }
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

  get swipeable() {
    return this._swipeable;
  }

  set swipeable(value) {
    if (value) {
      this.setAttribute("swipeable", "");
    } else {
      this.removeAttribute("swipeable");
    }
  }

  setupEventListeners() {
    this._handleScrimClick = (e) => {
      if (
        e.target.classList.contains("scrim") &&
        this._variant === "standard"
      ) {
        this.close();
      }
    };

    this._handleEscapeKey = (e) => {
      if (e.key === "Escape" && this._open && this._variant === "standard") {
        this.close();
      }
    };

    this._handleTouchStart = (e) => {
      if (!this._swipeable || this._variant !== "standard") return;

      const touch = e.touches[0];
      this._startX = touch.clientX;
      this._isScrubbbing = true;
      this._swipeStartTime = Date.now();
    };

    this._handleTouchMove = (e) => {
      if (!this._isScrubbbing) return;

      const touch = e.touches[0];
      this._currentX = touch.clientX - this._startX;

      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (!sheet) return;

      // Only allow swipe in the direction the sheet came from
      if (this._position === "left" && this._currentX < 0) {
        const progress = Math.min(Math.abs(this._currentX) / 360, 1);
        sheet.style.transform = `translateX(${this._currentX}px)`;
        sheet.style.opacity = 1 - progress * 0.1;

        this.dispatchEvent(
          new CustomEvent("ds-side-sheet:swipe", {
            detail: { progress },
            bubbles: true,
            composed: true,
          }),
        );
      } else if (this._position === "right" && this._currentX > 0) {
        const progress = Math.min(this._currentX / 360, 1);
        sheet.style.transform = `translateX(${this._currentX}px)`;
        sheet.style.opacity = 1 - progress * 0.1;

        this.dispatchEvent(
          new CustomEvent("ds-side-sheet:swipe", {
            detail: { progress },
            bubbles: true,
            composed: true,
          }),
        );
      }
    };

    this._handleTouchEnd = (e) => {
      if (!this._isScrubbbing) return;
      this._isScrubbbing = false;

      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (!sheet) return;

      const elapsed = Date.now() - this._swipeStartTime;
      const velocity = Math.abs(this._currentX) / elapsed;
      const threshold = 50;
      const velocityThreshold = 0.5;

      const shouldDismiss =
        (this._position === "left" && this._currentX < -threshold) ||
        (this._position === "right" && this._currentX > threshold) ||
        velocity > velocityThreshold;

      if (shouldDismiss) {
        this.close();
      } else {
        sheet.style.transform = "";
        sheet.style.opacity = "";
      }
    };
  }

  removeEventListeners() {
    const sheet = this.shadowRoot?.querySelector('[part="sheet"]');
    if (sheet) {
      sheet.removeEventListener("touchstart", this._handleTouchStart);
      sheet.removeEventListener("touchmove", this._handleTouchMove);
      sheet.removeEventListener("touchend", this._handleTouchEnd);
    }

    document.removeEventListener("keydown", this._handleEscapeKey);
    this.shadowRoot
      ?.querySelector(".scrim")
      ?.removeEventListener("click", this._handleScrimClick);
  }

  show() {
    if (this._open) return;

    this._open = true;
    this._previousFocus = document.activeElement;

    // Add event listeners to sheet
    const sheet = this.shadowRoot.querySelector('[part="sheet"]');
    const container = this.shadowRoot.querySelector(".container");

    if (sheet) {
      sheet.addEventListener("touchstart", this._handleTouchStart, false);
      sheet.addEventListener("touchmove", this._handleTouchMove, {
        passive: true,
      });
      sheet.addEventListener("touchend", this._handleTouchEnd, false);
    }

    document.addEventListener("keydown", this._handleEscapeKey);
    this.shadowRoot
      .querySelector(".scrim")
      ?.addEventListener("click", this._handleScrimClick);

    // Trigger animation by adding open class to container
    requestAnimationFrame(() => {
      if (container) {
        container.classList.add("open");
      }
    });

    this.dispatchEvent(
      new CustomEvent("ds-side-sheet:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  close() {
    if (!this._open) return;

    this._open = false;

    const sheet = this.shadowRoot.querySelector('[part="sheet"]');
    const container = this.shadowRoot.querySelector(".container");

    // Remove open class from container to trigger exit animation
    if (container) {
      container.classList.remove("open");
    }

    // Reset any swipe transforms
    if (sheet) {
      sheet.style.transform = "";
      sheet.style.opacity = "";
    }

    setTimeout(() => {
      this.removeAttribute("open");
      this.removeEventListeners();

      if (this._previousFocus) {
        this._previousFocus.focus();
        this._previousFocus = null;
      }

      this.dispatchEvent(
        new CustomEvent("ds-side-sheet:close", {
          bubbles: true,
          composed: true,
        }),
      );
    }, 300);
  }

  render() {
    const isModal = this._variant === "modal";
    const isLeft = this._position === "left";
    const isSwipeable = this._swipeable && !isModal;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --ds-side-sheet-width: 360px;
          --ds-side-sheet-max-width: 100vw;
          --ds-side-sheet-header-padding: var(--ds-space-6, 24px);
          --ds-side-sheet-content-padding: var(--ds-space-6, 24px);
          --ds-side-sheet-actions-padding: var(--ds-space-6, 24px);
          --ds-side-sheet-actions-gap: var(--ds-space-3, 12px);
        }

        .container {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: ${isLeft ? "row" : "row-reverse"};
          pointer-events: none;
          visibility: hidden;
        }

        .container.open {
          visibility: visible;
        }

        .scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: -1;
        }

        .container.open .scrim {
          background: rgba(0, 0, 0, 0.32);
          pointer-events: auto;
        }

        [part="sheet"] {
          position: relative;
          inline-size: var(--ds-side-sheet-width);
          max-inline-size: var(--ds-side-sheet-max-width);
          block-size: 100vh;
          background: var(--md-sys-color-surface);
          display: flex;
          flex-direction: column;
          pointer-events: auto;
          box-shadow: var(--md-sys-elevation-level1);
          outline: none;
          overflow: hidden;
          transform: translateX(${isLeft ? "-100%" : "100%"});
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          touch-action: none;
        }

        .container.open [part="sheet"] {
          transform: translateX(0);
        }

        [part="header"] {
          padding: var(--ds-side-sheet-header-padding);
          border-block-end: 1px solid var(--md-sys-color-outline-variant);
          flex-shrink: 0;
        }

        [part="header"]:empty {
          display: none;
          border: none;
          padding: 0;
        }

        [part="content"] {
          flex: 1;
          overflow-y: auto;
          padding: var(--ds-side-sheet-content-padding);
          color: var(--md-sys-color-on-surface);
        }

        [part="actions"] {
          padding: var(--ds-side-sheet-actions-padding);
          border-block-start: 1px solid var(--md-sys-color-outline-variant);
          display: flex;
          gap: var(--ds-side-sheet-actions-gap);
          justify-content: flex-end;
          flex-shrink: 0;
        }

        [part="actions"]:empty {
          display: none;
          border: none;
          padding: 0;
        }

        @media (max-inline-size: 600px) {
          :host {
            --ds-side-sheet-width: 100vw;
          }

          [part="sheet"] {
            max-inline-size: 100vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [part="sheet"],
          .scrim {
            transition: none;
          }
        }
      </style>

      <div class="container ${this._open ? "open" : ""}">
        <div class="scrim" part="scrim"></div>
        <div part="sheet" role="complementary" aria-modal="true" tabindex="-1">
          <div part="header">
            <slot name="header"></slot>
          </div>
          <div part="content">
            <slot></slot>
          </div>
          <div part="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-side-sheet", DSSideSheet);
