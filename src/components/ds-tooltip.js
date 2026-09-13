/**
 * Material Design 3 Tooltip Component
 * Brief floating labels that provide descriptions on hover/focus
 */
export class DSTooltip extends HTMLElement {
  static _instanceCount = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._position = "auto"; // auto, top, bottom, left, right
    this._delay = 500; // ms
    this._visible = false;
    this._showTimeout = null;
    this._targetElement = null;
    this._targetListenersBound = false;
    this._generatedId = "";

    this._boundHandlers = {
      mouseenter: this.handleMouseEnter.bind(this),
      mouseleave: this.handleMouseLeave.bind(this),
      focus: this.handleFocus.bind(this),
      blur: this.handleBlur.bind(this),
    };
  }

  static get observedAttributes() {
    return ["position", "delay", "for"];
  }

  connectedCallback() {
    if (!this.id) {
      DSTooltip._instanceCount += 1;
      this._generatedId = `ds-tooltip-${DSTooltip._instanceCount}`;
      this.id = this._generatedId;
    }

    this._position = this.validatePosition(this.getAttribute("position"));
    this._delay = this.coerceDelay(this.getAttribute("delay"));
    this.render();
    this.setupTarget();
  }

  disconnectedCallback() {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    }
    this.cleanupTarget();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "position":
        this._position = this.validatePosition(newValue);
        break;
      case "delay":
        this._delay = this.coerceDelay(newValue);
        break;
      case "for":
        this.cleanupTarget();
        this.setupTarget();
        return; // Don't re-render for this
    }

    this.render();
  }

  get position() {
    return this._position;
  }

  set position(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("position");
      return;
    }
    this.setAttribute("position", value);
  }

  get delay() {
    return this._delay;
  }

  set delay(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("delay");
      return;
    }
    this.setAttribute("delay", value.toString());
  }

  validatePosition(value) {
    const next = value || "auto";
    const validPositions = ["auto", "top", "bottom", "left", "right"];
    return validPositions.includes(next) ? next : "auto";
  }

  coerceDelay(value) {
    if (value === null || value === undefined || value === "") {
      return 500;
    }

    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 500;
    }

    return parsed;
  }

  addAriaDescribedBy(target) {
    const hostId = this.id;
    if (!hostId || !target) {
      return;
    }

    const ids = (target.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean);

    if (!ids.includes(hostId)) {
      ids.push(hostId);
      target.setAttribute("aria-describedby", ids.join(" "));
    }
  }

  removeAriaDescribedBy(target) {
    const hostId = this.id;
    if (!hostId || !target) {
      return;
    }

    const ids = (target.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => token !== hostId);

    if (ids.length > 0) {
      target.setAttribute("aria-describedby", ids.join(" "));
      return;
    }

    target.removeAttribute("aria-describedby");
  }

  setupTarget() {
    const forId = this.getAttribute("for");

    if (forId) {
      // Find target by ID
      this._targetElement = document.getElementById(forId);
    } else {
      // Use previous sibling element
      this._targetElement = this.previousElementSibling;
    }

    if (this._targetElement) {
      this.addAriaDescribedBy(this._targetElement);

      if (!this._targetListenersBound) {
        this._targetElement.addEventListener(
          "mouseenter",
          this._boundHandlers.mouseenter,
        );
        this._targetElement.addEventListener(
          "mouseleave",
          this._boundHandlers.mouseleave,
        );
        this._targetElement.addEventListener(
          "focus",
          this._boundHandlers.focus,
        );
        this._targetElement.addEventListener("blur", this._boundHandlers.blur);
        this._targetListenersBound = true;
      }
    }
  }

  cleanupTarget() {
    if (this._targetElement) {
      this.removeAriaDescribedBy(this._targetElement);

      this._targetElement.removeEventListener(
        "mouseenter",
        this._boundHandlers.mouseenter,
      );
      this._targetElement.removeEventListener(
        "mouseleave",
        this._boundHandlers.mouseleave,
      );
      this._targetElement.removeEventListener(
        "focus",
        this._boundHandlers.focus,
      );
      this._targetElement.removeEventListener("blur", this._boundHandlers.blur);
      this._targetListenersBound = false;
      this._targetElement = null;
    }
  }

  handleMouseEnter() {
    this.show();
  }

  handleMouseLeave() {
    this.hide();
  }

  handleFocus() {
    this.show();
  }

  handleBlur() {
    this.hide();
  }

  show() {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
    }

    this._showTimeout = setTimeout(() => {
      this._showTimeout = null;
      this._visible = true;
      this.updatePosition();
      const tooltip = this.shadowRoot.querySelector(".tooltip");
      tooltip?.classList.add("visible");
      this.dispatchEvent(
        new CustomEvent("ds-tooltip:show", {
          bubbles: true,
          composed: true,
          detail: {
            position: tooltip?.getAttribute("data-position") || this._position,
            targetId: this._targetElement?.id || null,
          },
        }),
      );
    }, this._delay);
  }

  hide() {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    }

    if (!this._visible) {
      this.shadowRoot.querySelector(".tooltip")?.classList.remove("visible");
      return;
    }

    this._visible = false;
    this.shadowRoot.querySelector(".tooltip")?.classList.remove("visible");
    this.dispatchEvent(
      new CustomEvent("ds-tooltip:hide", {
        bubbles: true,
        composed: true,
        detail: {
          targetId: this._targetElement?.id || null,
        },
      }),
    );
  }

  lengthToPixels(length, fallback) {
    if (!length) {
      return fallback;
    }

    const trimmed = length.trim();
    if (trimmed.endsWith("rem")) {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const value = Number.parseFloat(trimmed);
      if (Number.isFinite(rootFontSize) && Number.isFinite(value)) {
        return value * rootFontSize;
      }
      return fallback;
    }

    const value = Number.parseFloat(trimmed);
    return Number.isFinite(value) ? value : fallback;
  }

  updatePosition() {
    if (!this._targetElement) return;

    const tooltip = this.shadowRoot.querySelector(".tooltip");
    if (!tooltip) return;

    const targetRect = this._targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const offset = this.lengthToPixels(
      getComputedStyle(tooltip).getPropertyValue("--ds-tooltip-offset"),
      8,
    );
    let position = this._position;

    let top, left;

    // For 'auto' position, use smart positioning logic
    if (position === "auto") {
      // Start with 'top' as default
      let preferredPosition = "top";

      // Calculate initial position
      const positions = this.calculatePosition(
        preferredPosition,
        targetRect,
        tooltipRect,
        offset,
      );
      top = positions.top;
      left = positions.left;

      // Check if tooltip is clipped by viewport and flip if needed
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isClipped = this.isClippedByViewport(
        top,
        left,
        tooltipRect,
        viewportWidth,
        viewportHeight,
      );

      if (isClipped) {
        // Flip to opposite position
        const flippedPosition = this.getOppositePosition(preferredPosition);
        const flippedPositions = this.calculatePosition(
          flippedPosition,
          targetRect,
          tooltipRect,
          offset,
        );

        // Check if flipped position is better
        const isFlippedClipped = this.isClippedByViewport(
          flippedPositions.top,
          flippedPositions.left,
          tooltipRect,
          viewportWidth,
          viewportHeight,
        );

        // Use flipped position if it's not clipped or less clipped
        if (
          !isFlippedClipped ||
          this.isLessClipped(
            flippedPositions,
            positions,
            tooltipRect,
            viewportWidth,
            viewportHeight,
          )
        ) {
          top = flippedPositions.top;
          left = flippedPositions.left;
          position = flippedPosition;
        } else {
          position = preferredPosition;
        }
      } else {
        position = preferredPosition;
      }
    } else {
      // Fixed position - use as specified
      const positions = this.calculatePosition(
        position,
        targetRect,
        tooltipRect,
        offset,
      );
      top = positions.top;
      left = positions.left;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.setAttribute("data-position", position);
  }

  calculatePosition(position, targetRect, tooltipRect, offset = 8) {
    let top, left;

    switch (position) {
      case "auto":
      case "top":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + offset;
        break;
    }

    return { top, left };
  }

  isClippedByViewport(top, left, tooltipRect, viewportWidth, viewportHeight) {
    const right = left + tooltipRect.width;
    const bottom = top + tooltipRect.height;

    return (
      top < 0 || left < 0 || right > viewportWidth || bottom > viewportHeight
    );
  }

  getOppositePosition(position) {
    switch (position) {
      case "top":
        return "bottom";
      case "bottom":
        return "top";
      case "left":
        return "right";
      case "right":
        return "left";
      default:
        return "top";
    }
  }

  isLessClipped(newPos, oldPos, tooltipRect, viewportWidth, viewportHeight) {
    const getClipAmount = (pos) => {
      const right = pos.left + tooltipRect.width;
      const bottom = pos.top + tooltipRect.height;

      const clipTop = Math.max(0, -pos.top);
      const clipLeft = Math.max(0, -pos.left);
      const clipRight = Math.max(0, right - viewportWidth);
      const clipBottom = Math.max(0, bottom - viewportHeight);

      return clipTop + clipLeft + clipRight + clipBottom;
    };

    return getClipAmount(newPos) < getClipAmount(oldPos);
  }

  render() {
    const position = this._position;
    const text = (this.textContent || "").trim();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: contents;
          --ds-tooltip-max-inline-size: 12.5rem;
          --ds-tooltip-padding-block: var(--ds-space-1);
          --ds-tooltip-padding-inline: var(--ds-space-2);
          --ds-tooltip-border-radius: var(--ds-space-1);
          --ds-tooltip-offset: var(--ds-space-2);
          --ds-tooltip-arrow-size: var(--ds-space-1);
          --ds-tooltip-z-index: 1000;
        }

        .tooltip {
          position: fixed;
          max-inline-size: var(--ds-tooltip-max-inline-size);
          padding-block: var(--ds-tooltip-padding-block);
          padding-inline: var(--ds-tooltip-padding-inline);
          background-color: var(--md-sys-color-inverse-surface);
          color: var(--md-sys-color-inverse-on-surface);
          font-family: var(--md-sys-typescale-body-small-font);
          font-size: var(--md-sys-typescale-body-small-size);
          line-height: var(--md-sys-typescale-body-small-line-height);
          border-radius: var(--ds-tooltip-border-radius);
          z-index: var(--ds-tooltip-z-index);
          pointer-events: none;
          opacity: 0;
          transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tooltip.visible {
          opacity: 1;
        }

        /* Arrow/pointer */
        .tooltip::before {
          content: "";
          position: absolute;
          inline-size: 0;
          block-size: 0;
          border-style: solid;
        }

        /* Top position - arrow on bottom */
        .tooltip[data-position="top"]::before {
          inset-block-end: calc(var(--ds-tooltip-arrow-size) * -1);
          inset-inline-start: 50%;
          transform: translateX(-50%);
          border-width: var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size) 0 var(--ds-tooltip-arrow-size);
          border-color: var(--md-sys-color-inverse-surface) transparent transparent transparent;
        }

        /* Bottom position - arrow on top */
        .tooltip[data-position="bottom"]::before {
          inset-block-start: calc(var(--ds-tooltip-arrow-size) * -1);
          inset-inline-start: 50%;
          transform: translateX(-50%);
          border-width: 0 var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size);
          border-color: transparent transparent var(--md-sys-color-inverse-surface) transparent;
        }

        /* Left position - arrow on right */
        .tooltip[data-position="left"]::before {
          inset-inline-end: calc(var(--ds-tooltip-arrow-size) * -1);
          inset-block-start: 50%;
          transform: translateY(-50%);
          border-width: var(--ds-tooltip-arrow-size) 0 var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size);
          border-color: transparent transparent transparent var(--md-sys-color-inverse-surface);
        }

        /* Right position - arrow on left */
        .tooltip[data-position="right"]::before {
          inset-inline-start: calc(var(--ds-tooltip-arrow-size) * -1);
          inset-block-start: 50%;
          transform: translateY(-50%);
          border-width: var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size) var(--ds-tooltip-arrow-size) 0;
          border-color: transparent var(--md-sys-color-inverse-surface) transparent transparent;
        }
      </style>

      <div class="tooltip" role="tooltip" data-position="${position}">
        ${text}
      </div>
    `;
  }
}

if (!customElements.get("ds-tooltip")) {
  customElements.define("ds-tooltip", DSTooltip);
}
