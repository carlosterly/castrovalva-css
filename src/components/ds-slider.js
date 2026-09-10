export class DSSlider extends HTMLElement {
  static get observedAttributes() {
    return [
      "value",
      "min",
      "max",
      "step",
      "disabled",
      "label",
      "range",
      "value-start",
      "value-end",
      "color",
      "size",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Internal state
    this._value = 50;
    this._min = 0;
    this._max = 100;
    this._step = 1;
    this._disabled = false;
    this._isDragging = false;

    // Range support
    this._isRange = false;
    this._valueStart = 25;
    this._valueEnd = 75;
    this._activeThumb = null; // 'start' or 'end' or null

    // Color support
    this._color = "primary";
  }

  connectedCallback() {
    this.render();
    this._cacheElements();
    this._attachListeners();
    this._updateVisuals();
    this._updateDisabledState();
    this._updateLabel();
    this._updateColor();
    this._updateSize();
    this._updateAria();
  }

  disconnectedCallback() {
    this._detachListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "value":
        this._value = parseFloat(newValue);
        if (!this._isDragging) this._updateVisuals();
        break;
      case "min":
        this._min = parseFloat(newValue);
        this._updateVisuals();
        break;
      case "max":
        this._max = parseFloat(newValue);
        this._updateVisuals();
        break;
      case "step":
        this._step = parseFloat(newValue);
        break;
      case "disabled":
        this._disabled = newValue !== null;
        this._updateDisabledState();
        break;
      case "label":
        this._updateLabel();
        break;
      case "range":
        this._isRange = newValue !== null;
        this._updateVisuals();
        break;
      case "value-start":
        this._valueStart = parseFloat(newValue);
        if (!this._isDragging) this._updateVisuals();
        break;
      case "value-end":
        this._valueEnd = parseFloat(newValue);
        if (!this._isDragging) this._updateVisuals();
        break;
      case "color":
        this._color = newValue || "primary";
        this._updateColor();
        break;
      case "size":
        this._updateSize();
        break;
    }
  }

  get value() {
    return this._value;
  }
  set value(val) {
    this.setAttribute("value", val);
  }

  get min() {
    return this._min;
  }
  set min(val) {
    this.setAttribute("min", val);
  }

  get max() {
    return this._max;
  }
  set max(val) {
    this.setAttribute("max", val);
  }

  get step() {
    return this._step;
  }
  set step(val) {
    this.setAttribute("step", val);
  }

  get disabled() {
    return this._disabled;
  }
  set disabled(val) {
    if (val) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }

  get range() {
    return this._isRange;
  }
  set range(val) {
    if (val) this.setAttribute("range", "");
    else this.removeAttribute("range");
  }

  get valueStart() {
    return this._valueStart;
  }
  set valueStart(val) {
    this.setAttribute("value-start", val);
  }

  get valueEnd() {
    return this._valueEnd;
  }
  set valueEnd(val) {
    this.setAttribute("value-end", val);
  }

  get color() {
    return this._color;
  }
  set color(val) {
    this.setAttribute("color", val);
  }

  get size() {
    return this.getAttribute("size") || "";
  }

  set size(val) {
    if (val === null || val === undefined || val === "") {
      this.removeAttribute("size");
      return;
    }
    this.setAttribute("size", String(val));
  }

  _cacheElements() {
    this._container = this.shadowRoot.querySelector(".slider-container");
    this._track = this.shadowRoot.querySelector(".track");
    this._trackActive = this.shadowRoot.querySelector(".track-active");
    this._thumb = this.shadowRoot.querySelector(".thumb-end"); // Main thumb (or end thumb in range)
    this._thumbStart = this.shadowRoot.querySelector(".thumb-start"); // Start thumb for range
    this._labelEl = this.shadowRoot.querySelector(".label");
    this._valueEl = this.shadowRoot.querySelector(".value-display");
  }

  _attachListeners() {
    this._container.addEventListener(
      "pointerdown",
      this._handlePointerDown.bind(this),
    );

    this._handlePointerMoveBound = this._handlePointerMove.bind(this);
    this._handlePointerUpBound = this._handlePointerUp.bind(this);

    this._handleKeyDownBound = this._handleKeyDown.bind(this);
    this._thumb.addEventListener("keydown", this._handleKeyDownBound);
    this._thumbStart.addEventListener("keydown", this._handleKeyDownBound);
  }

  _detachListeners() {
    this._container.removeEventListener(
      "pointerdown",
      this._handlePointerDown.bind(this),
    );

    if (this._handleKeyDownBound) {
      this._thumb.removeEventListener("keydown", this._handleKeyDownBound);
      this._thumbStart.removeEventListener("keydown", this._handleKeyDownBound);
    }
  }

  _handlePointerDown(e) {
    if (this._disabled) return;

    e.preventDefault();

    this._isDragging = true;
    this._container.setPointerCapture(e.pointerId);
    this._container.classList.add("dragging");

    // Determine which thumb to drag
    if (this._isRange) {
      const rect = this._track.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const range = this._max - this._min;
      const clickValue = this._min + percentage * range;

      const distStart = Math.abs(clickValue - this._valueStart);
      const distEnd = Math.abs(clickValue - this._valueEnd);

      if (distStart < distEnd) {
        this._activeThumb = "start";
      } else {
        this._activeThumb = "end";
      }
    } else {
      this._activeThumb = "end"; // Standard single thumb
    }

    this._updateValueFromPointer(e);

    this._container.addEventListener(
      "pointermove",
      this._handlePointerMoveBound,
    );
    this._container.addEventListener("pointerup", this._handlePointerUpBound);
    this._container.addEventListener(
      "pointercancel",
      this._handlePointerUpBound,
    );
  }

  _handlePointerMove(e) {
    if (!this._isDragging) return;
    e.preventDefault();
    this._updateValueFromPointer(e);
  }

  _handlePointerUp(e) {
    if (!this._isDragging) return;

    this._isDragging = false;
    this._activeThumb = null;
    this._container.releasePointerCapture(e.pointerId);
    this._container.classList.remove("dragging");

    this._container.removeEventListener(
      "pointermove",
      this._handlePointerMoveBound,
    );
    this._container.removeEventListener(
      "pointerup",
      this._handlePointerUpBound,
    );
    this._container.removeEventListener(
      "pointercancel",
      this._handlePointerUpBound,
    );

    const detail = this._isRange
      ? { valueStart: this._valueStart, valueEnd: this._valueEnd }
      : { value: this._value };

    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  _updateValueFromPointer(e) {
    const rect = this._track.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    let rawValue = this._min + clampedPercentage * (this._max - this._min);

    if (this._step > 0) {
      const steps = Math.round((rawValue - this._min) / this._step);
      rawValue = this._min + steps * this._step;
    }

    rawValue = Math.max(this._min, Math.min(this._max, rawValue));

    let changed = false;

    if (this._isRange) {
      if (this._activeThumb === "start") {
        // Clamp to max of valueEnd
        const newValue = Math.min(rawValue, this._valueEnd);
        if (this._valueStart !== newValue) {
          this._valueStart = newValue;
          changed = true;
        }
      } else {
        // Clamp to min of valueStart
        const newValue = Math.max(rawValue, this._valueStart);
        if (this._valueEnd !== newValue) {
          this._valueEnd = newValue;
          changed = true;
        }
      }
    } else {
      if (this._value !== rawValue) {
        this._value = rawValue;
        changed = true;
      }
    }

    if (changed) {
      this._updateVisuals();
      this._updateValueText();

      const detail = this._isRange
        ? { valueStart: this._valueStart, valueEnd: this._valueEnd }
        : { value: this._value };

      this.dispatchEvent(
        new CustomEvent("input", {
          detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  _snap(val) {
    if (this._step > 0) {
      const steps = Math.round((val - this._min) / this._step);
      const snapped = this._min + steps * this._step;
      // Guard against binary-floating-point drift for fractional steps
      // (e.g. 0.1 + 0.2). Round to the precision implied by the step.
      const decimals = (String(this._step).split(".")[1] || "").length;
      return decimals ? parseFloat(snapped.toFixed(decimals)) : snapped;
    }
    return val;
  }

  _handleKeyDown(e) {
    if (this._disabled) return;

    const step = this._step > 0 ? this._step : 1;
    const bigStep = Math.max(step, (this._max - this._min) / 10);
    let delta = 0;
    let absolute = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        delta = step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        delta = -step;
        break;
      case "PageUp":
        delta = bigStep;
        break;
      case "PageDown":
        delta = -bigStep;
        break;
      case "Home":
        absolute = "min";
        break;
      case "End":
        absolute = "max";
        break;
      default:
        return;
    }

    e.preventDefault();

    const resolve = (current, lo, hi) => {
      let next =
        absolute === "min"
          ? lo
          : absolute === "max"
            ? hi
            : current + delta;
      next = this._snap(next);
      return Math.max(lo, Math.min(hi, next));
    };

    let changed = false;

    if (this._isRange) {
      const onStart = e.currentTarget === this._thumbStart;
      if (onStart) {
        const next = resolve(this._valueStart, this._min, this._valueEnd);
        if (next !== this._valueStart) {
          this._valueStart = next;
          changed = true;
        }
      } else {
        const next = resolve(this._valueEnd, this._valueStart, this._max);
        if (next !== this._valueEnd) {
          this._valueEnd = next;
          changed = true;
        }
      }
    } else {
      const next = resolve(this._value, this._min, this._max);
      if (next !== this._value) {
        this._value = next;
        changed = true;
      }
    }

    if (!changed) return;

    this._updateVisuals();
    this._updateValueText();

    const detail = this._isRange
      ? { valueStart: this._valueStart, valueEnd: this._valueEnd }
      : { value: this._value };

    // A keyboard change is committed immediately, so — like a native
    // range input — emit both `input` and `change`.
    this.dispatchEvent(
      new CustomEvent("input", { detail, bubbles: true, composed: true }),
    );
    this.dispatchEvent(
      new CustomEvent("change", { detail, bubbles: true, composed: true }),
    );
  }

  _updateAria() {
    if (!this._thumb) return;

    const base = this.getAttribute("label") || "Slider";

    const applyThumb = (elm, label, now, min, max) => {
      if (!elm) return;
      elm.setAttribute("role", "slider");
      elm.setAttribute("aria-orientation", "horizontal");
      elm.setAttribute("aria-label", label);
      elm.setAttribute("aria-valuemin", String(min));
      elm.setAttribute("aria-valuemax", String(max));
      elm.setAttribute("aria-valuenow", String(now));
      elm.setAttribute("aria-valuetext", String(now));
      if (this._disabled) {
        elm.setAttribute("aria-disabled", "true");
        elm.setAttribute("tabindex", "-1");
      } else {
        elm.removeAttribute("aria-disabled");
        elm.setAttribute("tabindex", "0");
      }
    };

    if (this._isRange) {
      applyThumb(
        this._thumbStart,
        `${base} minimum`,
        Math.round(this._valueStart * 100) / 100,
        this._min,
        Math.round(this._valueEnd * 100) / 100,
      );
      applyThumb(
        this._thumb,
        `${base} maximum`,
        Math.round(this._valueEnd * 100) / 100,
        Math.round(this._valueStart * 100) / 100,
        this._max,
      );
    } else {
      applyThumb(
        this._thumb,
        base,
        Math.round(this._value * 100) / 100,
        this._min,
        this._max,
      );
    }
  }

  _updateVisuals() {
    if (!this._track) return;

    const range = this._max - this._min;

    if (this._isRange) {
      // Range Mode
      this._thumbStart.style.display = "block";
      this._thumb.classList.add("range-end"); // Optional styling

      const startPct = (this._valueStart - this._min) / range;
      const endPct = (this._valueEnd - this._min) / range;

      const clampedStart = Math.max(0, Math.min(1, startPct));
      const clampedEnd = Math.max(0, Math.min(1, endPct));

      // Track position and width
      // We use transform to position and scale the track
      // TranslateX moves the start, ScaleX sets the width
      // Width factor = end - start
      const widthFactor = clampedEnd - clampedStart;

      // Important: scaleX scales from the center by default, so we need transform-origin: left
      // translateX is relative to the element width (100%), so translateX(50%) moves it 50% of the track width
      this._trackActive.style.transform = `translateX(${
        clampedStart * 100
      }%) scaleX(${widthFactor})`;

      // Thumbs
      this._thumbStart.style.left = `${clampedStart * 100}%`;
      this._thumb.style.left = `${clampedEnd * 100}%`;
    } else {
      // Single Mode
      this._thumbStart.style.display = "none";
      this._thumb.classList.remove("range-end");

      const percentage = (this._value - this._min) / range;
      const clampedPercentage = Math.max(0, Math.min(1, percentage));

      this._trackActive.style.transform = `scaleX(${clampedPercentage})`;
      this._trackActive.style.transformOrigin = "left"; // Ensure origin is left
      this._thumb.style.left = `${clampedPercentage * 100}%`;
    }

    this._updateAria();
  }

  _updateValueText() {
    if (!this._valueEl) return;

    if (this._isRange) {
      this._valueEl.textContent = `${Math.round(
        this._valueStart,
      )} - ${Math.round(this._valueEnd)}`;
    } else {
      this._valueEl.textContent = Math.round(this._value * 100) / 100;
    }
  }

  _updateLabel() {
    if (this._labelEl) {
      this._labelEl.textContent = this.getAttribute("label") || "";
    }
    this._updateAria();
  }

  _updateDisabledState() {
    if (!this._container) return;

    if (this._disabled) {
      this._container.classList.add("disabled");
    } else {
      this._container.classList.remove("disabled");
    }
    this._updateAria();
  }

  _updateColor() {
    if (!this._container) return;

    // Map color names to CSS variables if needed, or just set the variable
    // Assuming standard MD3 tokens or custom tokens
    let colorVar = "#3b82f6"; // Default blue

    if (this._color === "primary") colorVar = "var(--md-sys-color-primary)";
    else if (this._color === "secondary")
      colorVar = "var(--md-sys-color-secondary)";
    else if (this._color === "tertiary")
      colorVar = "var(--md-sys-color-tertiary)";
    else if (this._color === "error") colorVar = "var(--md-sys-color-error)";
    else if (this._color.startsWith("#") || this._color.startsWith("rgb"))
      colorVar = this._color;

    this.style.setProperty("--slider-color", colorVar);
  }

  _updateSize() {
    const size = (this.getAttribute("size") || "").toLowerCase();
    const sizeMap = {
      sm: "var(--ds-size-icon-sm)",
      md: "var(--ds-size-icon-md)",
      lg: "var(--ds-size-icon-lg)",
    };

    if (sizeMap[size]) {
      this.style.setProperty(
        "--ds-slider-thumb-size",
        `calc(${sizeMap[size]} - 2px)`,
      );
      this.style.setProperty(
        "--ds-slider-height",
        `calc(${sizeMap[size]} / 4.5)`,
      );
      return;
    }

    this.style.removeProperty("--ds-slider-thumb-size");
    this.style.removeProperty("--ds-slider-height");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: sans-serif;
          --slider-height: var(
            --ds-slider-height,
            calc(var(--ds-size-icon-sm, 14px) / 3.5)
          );
          --slider-thumb-size: var(
            --ds-slider-thumb-size,
            calc(var(--ds-size-icon-md, 18px) - 2px)
          );
          --slider-color: var(--md-sys-color-primary, #3b82f6);
          --slider-track-color: var(--md-sys-color-surface-variant, #e5e7eb);
        }

        :host([color="primary"]) {
          --slider-color: var(--md-sys-color-primary, #3b82f6);
        }

        :host([color="secondary"]) {
          --slider-color: var(--md-sys-color-secondary, #4f6367);
        }

        :host([color="tertiary"]) {
          --slider-color: var(--md-sys-color-tertiary, #645d74);
        }

        :host([color="error"]) {
          --slider-color: var(--md-sys-color-error, #ba1a1a);
        }

        .slider-container {
          position: relative;
          width: 100%;
          padding: 10px 0;
          cursor: pointer;
          touch-action: none;
          user-select: none;
        }

        .slider-container.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #374151;
        }

        .track-wrapper {
          position: relative;
          height: var(--slider-height);
          width: 100%;
          background: var(--slider-track-color);
          border-radius: 999px;
        }

        .track-active {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: var(--slider-color);
          border-radius: 999px;
          transform-origin: left;
          transform: scaleX(0.5);
          will-change: transform;
        }

        .thumb {
          position: absolute;
          top: 50%;
          left: 0;
          width: var(--slider-thumb-size);
          height: var(--slider-thumb-size);
          background: #fff;
          border: 2px solid var(--slider-color);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          z-index: 10;
          will-change: left;
        }

        .thumb-start {
          display: none; /* Hidden by default */
          z-index: 10;
        }

        .slider-container:hover .thumb,
        .slider-container.dragging .thumb {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .slider-container.dragging .thumb {
           cursor: grabbing;
        }

        .thumb:focus-visible {
          outline: none;
        }

        /* Higher specificity than the :hover rule so the focus ring wins. */
        .slider-container .thumb:focus-visible {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow:
            0 0 0 var(--ds-focus-ring-offset, 2px)
              var(--md-sys-color-surface, #fff),
            0 0 0
              calc(
                var(--ds-focus-ring-offset, 2px) +
                  var(--ds-focus-ring-width, 3px)
              )
              var(--ds-focus-ring-color, var(--slider-color));
        }

      </style>

      <div class="slider-container">
        <div class="header">
          <span class="label">${this.getAttribute("label") || ""}</span>
          <span class="value-display">${this._value}</span>
        </div>
        
        <div class="track-wrapper track">
          <div class="track-active"></div>
          <div
            class="thumb thumb-start"
            role="slider"
            aria-orientation="horizontal"
            tabindex="-1"
          ></div>
          <div
            class="thumb thumb-end"
            role="slider"
            aria-orientation="horizontal"
            tabindex="0"
          ></div>
        </div>
      </div>
    `;
  }
}

customElements.define("ds-slider", DSSlider);
