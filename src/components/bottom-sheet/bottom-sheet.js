/**
 * Material Design 3 Bottom Sheet Component
 *
 * A container that slides in from the bottom of the screen for content
 * and actions. Supports standard and modal variants with drag-to-dismiss.
 *
 * @element ds-bottom-sheet
 *
 * @attr {string} variant - Sheet style: 'standard' (default) or 'modal'
 * @attr {boolean} open - Whether the sheet is visible
 * @attr {boolean} draggable - Allow drag-to-dismiss (default: true)
 * @attr {number} drag-threshold - Pixels to drag before dismissing (default: 100)
 *
 * @slot - Main content area
 * @slot header - Header/title area
 * @slot actions - Footer actions area
 *
 * @fires ds-bottom-sheet:open - Fired when sheet opens
 * @fires ds-bottom-sheet:close - Fired when sheet closes
 * @fires ds-bottom-sheet:drag - Fired during drag with { progress: 0-1 }
 *
 * @csspart container - Outer wrapper
 * @csspart scrim - Background overlay
 * @csspart sheet - Sheet container
 * @csspart header - Header slot wrapper
 * @csspart content - Main content area
 * @csspart actions - Actions slot wrapper
 *
 * @cssprop --ds-bottom-sheet-max-width - Maximum width (default: 640px)
 * @cssprop --ds-bottom-sheet-max-height - Maximum height (default: 90vh)
 */
export class DSBottomSheet extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "open", "draggable", "drag-threshold"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "standard";
    this._open = false;
    this._draggable = true;
    this._dragThreshold = 100;
    this._startY = 0;
    this._currentY = 0;
    this._isDragging = false;
    this._previousFocus = null;
    this._dragStartTime = 0;
    this._activePointerId = null;
  }

  connectedCallback() {
    // Ensure variant attribute is set to default if not provided
    if (!this.hasAttribute("variant")) {
      this.setAttribute("variant", "standard");
    }
    this.render();
    this.setupEventListeners();

    // Handle initial open state if attribute is present
    if (this.hasAttribute("open")) {
      // Don't set _open here - let show() handle it
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
      case "open":
        const shouldOpen = newValue !== null;
        // Only trigger show/close if already connected and state actually changed
        if (this.shadowRoot.innerHTML) {
          if (shouldOpen && !this._open) {
            this.show();
          } else if (!shouldOpen && this._open) {
            this.close();
          }
        }
        return;
      case "draggable":
        this._draggable = newValue !== "false";
        break;
      case "drag-threshold":
        this._dragThreshold = parseInt(newValue) || 100;
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

  get draggable() {
    return this._draggable;
  }

  set draggable(value) {
    if (value) {
      this.setAttribute("draggable", "");
    } else {
      this.removeAttribute("draggable");
    }
  }

  setupEventListeners() {
    this._isInteractiveEventTarget = (event) => {
      const interactiveSelector =
        "button, a, input, select, textarea, summary, [role='button'], [role='link'], [contenteditable='true'], [tabindex]:not([tabindex='-1'])";

      const path =
        typeof event.composedPath === "function" ? event.composedPath() : [];
      return path.some(
        (node) =>
          node instanceof Element &&
          typeof node.matches === "function" &&
          node.matches(interactiveSelector),
      );
    };

    this._handleScrimClick = (e) => {
      if (
        e.target.classList.contains("scrim") &&
        this._variant === "standard"
      ) {
        this.close();
      }
    };

    this._handleEscapeKey = (e) => {
      if (e.key === "Escape" && this._open) {
        this.close();
      }
    };

    this._beginDrag = (startY) => {
      if (!this._draggable || this._variant !== "standard") {
        return false;
      }

      this._startY = startY;
      this._currentY = 0;
      this._isDragging = true;
      this._dragStartTime = Date.now();
      return true;
    };

    this._updateDrag = (currentY) => {
      if (!this._isDragging) return;

      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (!sheet) return;

      this._currentY = currentY - this._startY;

      if (this._currentY > 0) {
        const progress = Math.min(this._currentY / this._dragThreshold, 1);
        sheet.style.transform = `translateY(${this._currentY}px)`;
        sheet.style.opacity = `${1 - progress * 0.1}`;

        this.dispatchEvent(
          new CustomEvent("ds-bottom-sheet:drag", {
            detail: { progress },
            bubbles: true,
            composed: true,
          }),
        );
      }
    };

    this._endDrag = () => {
      if (!this._isDragging) return;

      this._isDragging = false;
      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (!sheet) return;

      const elapsed = Math.max(Date.now() - this._dragStartTime, 1);
      const velocity = this._currentY / elapsed;
      const shouldClose =
        this._currentY > this._dragThreshold ||
        (velocity > 0.5 && this._currentY > 50);

      sheet.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      if (shouldClose) {
        this.close();
      } else {
        sheet.style.transform = "";
        sheet.style.opacity = "";
      }

      setTimeout(() => {
        if (sheet) {
          sheet.style.transition = "";
        }
      }, 300);
    };

    this._handleTouchStart = (e) => {
      if (this._isInteractiveEventTarget(e)) {
        return;
      }
      this._beginDrag(e.touches[0].clientY);
    };

    this._handleTouchMove = (e) => {
      this._updateDrag(e.touches[0].clientY);
    };

    this._handleTouchEnd = () => {
      this._endDrag();
    };

    this._handlePointerDown = (e) => {
      if (e.pointerType === "touch") {
        return;
      }

      if (this._isInteractiveEventTarget(e)) {
        return;
      }

      const started = this._beginDrag(e.clientY);
      if (!started) {
        return;
      }

      this._activePointerId = e.pointerId;
      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (sheet && typeof sheet.setPointerCapture === "function") {
        try {
          sheet.setPointerCapture(e.pointerId);
        } catch {
          // Ignore for synthetic events/tests where no active pointer exists.
        }
      }
      e.preventDefault();
    };

    this._handlePointerMove = (e) => {
      if (e.pointerType === "touch") {
        return;
      }
      if (this._activePointerId !== e.pointerId) {
        return;
      }

      this._updateDrag(e.clientY);
    };

    this._handlePointerUp = (e) => {
      if (e.pointerType === "touch") {
        return;
      }
      if (this._activePointerId !== e.pointerId) {
        return;
      }

      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (sheet && typeof sheet.releasePointerCapture === "function") {
        try {
          sheet.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore for synthetic events/tests where pointer was not captured.
        }
      }

      this._activePointerId = null;
      this._endDrag();
    };

    this._handlePointerCancel = (e) => {
      if (e.pointerType === "touch") {
        return;
      }
      if (this._activePointerId !== e.pointerId) {
        return;
      }

      const sheet = this.shadowRoot.querySelector('[part="sheet"]');
      if (sheet && typeof sheet.releasePointerCapture === "function") {
        try {
          sheet.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore for synthetic events/tests where pointer was not captured.
        }
      }

      this._activePointerId = null;
      this._endDrag();
    };
  }

  removeEventListeners() {
    const sheet = this.shadowRoot?.querySelector('[part="sheet"]');
    if (sheet) {
      sheet.removeEventListener("touchstart", this._handleTouchStart);
      sheet.removeEventListener("touchmove", this._handleTouchMove);
      sheet.removeEventListener("touchend", this._handleTouchEnd);
      sheet.removeEventListener("pointerdown", this._handlePointerDown);
      sheet.removeEventListener("pointermove", this._handlePointerMove);
      sheet.removeEventListener("pointerup", this._handlePointerUp);
      sheet.removeEventListener("pointercancel", this._handlePointerCancel);
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
      sheet.addEventListener("pointerdown", this._handlePointerDown, false);
      sheet.addEventListener("pointermove", this._handlePointerMove, false);
      sheet.addEventListener("pointerup", this._handlePointerUp, false);
      sheet.addEventListener("pointercancel", this._handlePointerCancel, false);
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
      new CustomEvent("ds-bottom-sheet:open", {
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

    // Reset any drag transforms
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
        new CustomEvent("ds-bottom-sheet:close", {
          bubbles: true,
          composed: true,
        }),
      );
    }, 300);
  }

  render() {
    const isModal = this._variant === "modal";
    const isDraggableStandard = this._draggable && !isModal;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --ds-bottom-sheet-max-width: 640px;
          --ds-bottom-sheet-max-height: 90vh;
          --ds-bottom-sheet-header-padding: var(--ds-space-6, 24px);
          --ds-bottom-sheet-content-padding: var(--ds-space-6, 24px);
          --ds-bottom-sheet-actions-padding: var(--ds-space-6, 24px);
          --ds-bottom-sheet-actions-gap: var(--ds-space-3, 12px);
          --ds-bottom-sheet-drag-handle-width: var(--ds-size-control-sm, 32px);
          --ds-bottom-sheet-drag-handle-height: 4px;
          --ds-bottom-sheet-drag-handle-margin-block: var(--ds-space-3, 12px);
        }

        .container {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-end;
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
          background: rgba(0, 0, 0, ${isModal ? "0.32" : "0.32"});
          pointer-events: auto;
        }

        [part="sheet"] {
          position: relative;
          inline-size: 100%;
          max-inline-size: var(--ds-bottom-sheet-max-width);
          max-block-size: var(--ds-bottom-sheet-max-height);
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-large, 28px) var(--md-sys-shape-corner-large, 28px) 0 0;
          display: flex;
          flex-direction: column;
          pointer-events: auto;
          box-shadow: var(--md-sys-elevation-level3);
          outline: none;
          overflow: hidden;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
        }

        .container.open [part="sheet"] {
          transform: translateY(0);
        }

        /* Drag handle for standard variant */
        ${
          isDraggableStandard
            ? `
          [part="sheet"]::before {
            content: "";
            inline-size: var(--ds-bottom-sheet-drag-handle-width);
            block-size: var(--ds-bottom-sheet-drag-handle-height);
            background: var(--md-sys-color-outline-variant);
            border-radius: 2px;
            margin: var(--ds-bottom-sheet-drag-handle-margin-block) auto;
            flex-shrink: 0;
            cursor: grab;
          }

          [part="sheet"]:active::before {
            cursor: grabbing;
          }
        `
            : ""
        }

        [part="header"] {
          padding: var(--ds-bottom-sheet-header-padding);
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
          padding: var(--ds-bottom-sheet-content-padding);
          color: var(--md-sys-color-on-surface);
        }

        [part="actions"] {
          padding: var(--ds-bottom-sheet-actions-padding);
          border-block-start: 1px solid var(--md-sys-color-outline-variant);
          display: flex;
          gap: var(--ds-bottom-sheet-actions-gap);
          justify-content: flex-end;
          flex-shrink: 0;
        }

        [part="actions"]:empty {
          display: none;
          border: none;
          padding: 0;
        }

        @media (max-inline-size: 600px) {
          [part="sheet"] {
            border-radius: var(--md-sys-shape-corner-large, 28px) var(--md-sys-shape-corner-large, 28px) 0 0;
            max-block-size: 100vh;
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
        <div part="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">
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

customElements.define("ds-bottom-sheet", DSBottomSheet);
