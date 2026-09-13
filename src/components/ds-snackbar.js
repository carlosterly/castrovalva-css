/**
 * Material Design 3 Snackbar Component
 * Brief messages that appear at the bottom of the screen to provide feedback
 */

// Global queue for managing multiple snackbars
const snackbarQueue = [];
let currentSnackbar = null;
const DEFAULT_DURATION = 4000;
const DISMISS_ANIMATION_DURATION = 200;

export class DSSnackbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._message = "";
    this._actionLabel = "";
    this._duration = DEFAULT_DURATION; // 4 seconds default (MD3 recommends 4-10 seconds)
    this._dismissTimeout = null;
    this._dismissAnimationTimeout = null;
    this._isVisible = false;
    this._onAction = null;
    this._onDismiss = null;
    this._boundActionClick = this.handleActionClick.bind(this);
    this._boundCloseClick = this.handleCloseClick.bind(this);
  }

  static get observedAttributes() {
    return ["message", "action-label", "duration"];
  }

  connectedCallback() {
    this._message = this.getAttribute("message") || "";
    this._actionLabel = this.getAttribute("action-label") || "";
    this._duration = this.coerceDuration(this.getAttribute("duration"));
    this.render();
  }

  disconnectedCallback() {
    if (this._dismissTimeout) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }

    if (this._dismissAnimationTimeout) {
      clearTimeout(this._dismissAnimationTimeout);
      this._dismissAnimationTimeout = null;
    }

    this.removeFromQueue();
    if (currentSnackbar === this) {
      currentSnackbar = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "message":
        this._message = newValue || "";
        break;
      case "action-label":
        this._actionLabel = newValue || "";
        break;
      case "duration":
        this._duration = this.coerceDuration(newValue);
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get message() {
    return this._message;
  }

  set message(value) {
    if (value === null || value === undefined) {
      this.removeAttribute("message");
      return;
    }
    this.setAttribute("message", value);
  }

  get actionLabel() {
    return this._actionLabel;
  }

  set actionLabel(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("action-label");
      return;
    }
    this.setAttribute("action-label", value);
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("duration");
      return;
    }
    this.setAttribute("duration", value.toString());
  }

  coerceDuration(value) {
    if (value === null || value === undefined || value === "") {
      return DEFAULT_DURATION;
    }

    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return DEFAULT_DURATION;
    }

    return parsed;
  }

  removeFromQueue() {
    const index = snackbarQueue.indexOf(this);
    if (index > -1) {
      snackbarQueue.splice(index, 1);
    }
  }

  /**
   * Show the snackbar with optional message and action
   * @param {Object} options - Configuration options
   * @param {string} options.message - Message to display
   * @param {string} options.actionLabel - Label for action button
   * @param {Function} options.onAction - Callback when action is clicked
   * @param {Function} options.onDismiss - Callback when snackbar is dismissed
   * @param {number} options.duration - Duration in milliseconds (0 = no auto-dismiss)
   */
  show(options = {}) {
    if ("message" in options) this._message = options.message || "";
    if ("actionLabel" in options) this._actionLabel = options.actionLabel || "";
    if ("onAction" in options) this._onAction = options.onAction || null;
    if ("onDismiss" in options) this._onDismiss = options.onDismiss || null;
    if ("duration" in options)
      this._duration = this.coerceDuration(options.duration);

    if (!snackbarQueue.includes(this) && !this._isVisible) {
      snackbarQueue.push(this);
    }
    this.processQueue();
  }

  processQueue() {
    // If there's already a snackbar showing, wait
    if (currentSnackbar && currentSnackbar !== this) {
      return;
    }

    // If this snackbar is already showing, don't show again
    if (this._isVisible) {
      return;
    }

    // Show this snackbar
    currentSnackbar = this;
    this.render();
    this.showSnackbar();
  }

  showSnackbar() {
    if (this._dismissTimeout) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }

    this._isVisible = true;
    const container = this.shadowRoot.querySelector(".snackbar");
    if (!container) {
      return;
    }

    // Trigger reflow to enable animation
    container.offsetHeight;

    container.classList.add("visible");

    // Announce to screen readers
    const liveRegion = this.shadowRoot.querySelector('[role="status"]');
    if (liveRegion) {
      liveRegion.textContent = this._message;
    }

    this.dispatchEvent(
      new CustomEvent("ds-snackbar:show", {
        bubbles: true,
        composed: true,
        detail: {
          message: this._message,
          duration: this._duration,
          hasAction: Boolean(this._actionLabel),
        },
      }),
    );

    // Auto-dismiss after duration (unless duration is 0)
    if (this._duration > 0) {
      this._dismissTimeout = setTimeout(() => {
        this.dismiss();
      }, this._duration);
    }
  }

  dismiss() {
    if (!this._isVisible) {
      this.removeFromQueue();
      return;
    }

    const container = this.shadowRoot.querySelector(".snackbar");
    if (container) {
      container.classList.remove("visible");
    }

    if (this._dismissTimeout) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }

    // Wait for animation to complete
    this._dismissAnimationTimeout = setTimeout(() => {
      this._dismissAnimationTimeout = null;
      this._isVisible = false;

      // Remove from queue
      this.removeFromQueue();

      if (currentSnackbar === this) {
        currentSnackbar = null;
      }

      // Call onDismiss callback
      if (this._onDismiss) {
        this._onDismiss();
        this._onDismiss = null;
      }

      // Process next in queue
      if (snackbarQueue.length > 0) {
        snackbarQueue[0].processQueue();
      }
    }, DISMISS_ANIMATION_DURATION); // Match animation duration

    this.dispatchEvent(
      new CustomEvent("ds-snackbar:dismiss", {
        bubbles: true,
        composed: true,
        detail: { message: this._message },
      }),
    );
  }

  handleActionClick() {
    // Call action callback
    if (this._onAction) {
      this._onAction();
      this._onAction = null;
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("ds-snackbar:action", {
        bubbles: true,
        composed: true,
        detail: {
          message: this._message,
          actionLabel: this._actionLabel,
        },
      }),
    );

    this.dismiss();
  }

  handleCloseClick() {
    this.dismiss();
  }

  render() {
    const hasAction = this._actionLabel && this._actionLabel.length > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset-block-end: 0;
          inset-inline: 0;
          --ds-snackbar-min-inline-size: 21.5rem;
          --ds-snackbar-max-inline-size: 42rem;
          --ds-snackbar-min-block-size: var(--ds-size-control-lg);
          --ds-snackbar-gap: var(--ds-space-2);
          --ds-snackbar-padding-inline: var(--ds-space-4);
          --ds-snackbar-padding-block: var(--ds-space-3);
          --ds-snackbar-offset-inline: var(--ds-space-4);
          --ds-snackbar-offset-block-end: var(--ds-space-4);
          --ds-snackbar-radius: var(--ds-space-1);
          --ds-snackbar-action-padding-inline: var(--ds-space-3);
          --ds-snackbar-action-padding-block: var(--ds-space-2);
          --ds-snackbar-close-size: var(--ds-size-icon-lg);
          z-index: 1000;
          pointer-events: none;
          display: flex;
          justify-content: center;
          padding-inline: var(--ds-snackbar-offset-inline);
          padding-block: 0 var(--ds-snackbar-offset-block-end);
        }

        .snackbar {
          display: flex;
          align-items: center;
          gap: var(--ds-snackbar-gap);
          min-inline-size: var(--ds-snackbar-min-inline-size);
          max-inline-size: var(--ds-snackbar-max-inline-size);
          min-block-size: var(--ds-snackbar-min-block-size);
          padding-inline: var(--ds-snackbar-padding-inline);
          padding-block: var(--ds-snackbar-padding-block);
          background-color: var(--md-sys-color-inverse-surface);
          color: var(--md-sys-color-inverse-on-surface);
          border-radius: var(--ds-snackbar-radius);
          box-shadow: var(--md-sys-elevation-level3);
          pointer-events: auto;
          transform: translateY(100px);
          opacity: 0;
          transition: transform 200ms var(--md-sys-motion-easing-standard),
                      opacity 200ms var(--md-sys-motion-easing-standard);
        }

        .snackbar.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .message {
          flex: 1;
          font-family: var(--md-sys-typescale-body-medium-font);
          font-size: var(--md-sys-typescale-body-medium-size);
          line-height: var(--md-sys-typescale-body-medium-line-height);
          font-weight: var(--md-sys-typescale-body-medium-weight);
        }

        .action-button {
          background: transparent;
          border: none;
          color: var(--md-sys-color-inverse-primary);
          font-family: var(--md-sys-typescale-label-large-font);
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: var(--md-sys-typescale-label-large-weight);
          line-height: var(--md-sys-typescale-label-large-line-height);
          letter-spacing: var(--md-sys-typescale-label-large-tracking);
          text-transform: uppercase;
          padding-inline: var(--ds-snackbar-action-padding-inline);
          padding-block: var(--ds-snackbar-action-padding-block);
          border-radius: var(--ds-snackbar-radius);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background-color 200ms;
        }

        .action-button:hover {
          background-color: rgba(var(--md-sys-color-inverse-primary-rgb, 208, 188, 255), 0.08);
        }

        .action-button:focus {
          outline: none;
          background-color: rgba(var(--md-sys-color-inverse-primary-rgb, 208, 188, 255), 0.12);
        }

        .action-button:active {
          background-color: rgba(var(--md-sys-color-inverse-primary-rgb, 208, 188, 255), 0.16);
        }

        .close-button {
          background: transparent;
          border: none;
          color: var(--md-sys-color-inverse-on-surface);
          inline-size: var(--ds-snackbar-close-size);
          block-size: var(--ds-snackbar-close-size);
          padding: 0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: background-color 200ms;
          font-size: 18px;
        }

        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .close-button:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.12);
        }

        .close-button:active {
          background-color: rgba(255, 255, 255, 0.16);
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        @media (max-inline-size: 600px) {
          :host {
            padding-inline: var(--ds-space-2);
            padding-block: 0 var(--ds-space-2);
          }

          .snackbar {
            min-inline-size: 100%;
          }
        }
      </style>

      <div class="snackbar" role="alert" aria-live="polite">
        <div class="message">${this._message}</div>
        ${
          hasAction
            ? `<button class="action-button" type="button">${this._actionLabel}</button>`
            : ""
        }
        <button class="close-button" type="button" aria-label="Close">
          ✕
        </button>
      </div>

      <!-- ARIA live region for announcements -->
      <div role="status" aria-live="polite" class="sr-only"></div>
    `;

    // Add event listeners
    if (hasAction) {
      const actionButton = this.shadowRoot.querySelector(".action-button");
      actionButton?.addEventListener("click", this._boundActionClick);
    }

    const closeButton = this.shadowRoot.querySelector(".close-button");
    closeButton?.addEventListener("click", this._boundCloseClick);
  }
}

if (!customElements.get("ds-snackbar")) {
  customElements.define("ds-snackbar", DSSnackbar);
}
