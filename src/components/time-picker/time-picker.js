/**
 * DSTimePicker - A Material Design 3 time picker component
 * Clock interface for selecting time with 12/24 hour format support
 *
 * @element ds-time-picker
 *
 * @attr {string} value - Selected time in HH:mm format (24-hour)
 * @attr {string} label - Label text for the input field
 * @attr {boolean} disabled - Disables the time picker
 * @attr {boolean} required - Marks the field as required
 * @attr {boolean} hour12 - Use 12-hour format (default: true)
 * @attr {string} locale - Locale for time formatting (default: 'en-US')
 *
 * @fires {CustomEvent} ds-time-picker:change - Fired when time selection changes
 * @fires {CustomEvent} ds-time-picker:open - Fired when clock opens
 * @fires {CustomEvent} ds-time-picker:close - Fired when clock closes
 *
 * @csspart input - The input field
 * @csspart clock - The clock dropdown
 */
export class DSTimePicker extends HTMLElement {
  static get observedAttributes() {
    return ["value", "label", "disabled", "required", "hour12", "locale"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._mode = "hours"; // 'hours' or 'minutes'
    this._selectedHour = null;
    this._selectedMinute = null;
    this._period = "AM"; // AM or PM for 12-hour format

    // Bind methods
    this._boundHandleInputClick = this.handleInputClick.bind(this);
    this._boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this._boundHandleKeyDown = this.handleKeyDown.bind(this);
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
      if (name === "value" && newValue) {
        this.parseValue(newValue);
      }
      this.render();
    }
  }

  // Getters and Setters
  get value() {
    return this.getAttribute("value") || "";
  }

  set value(val) {
    if (val) {
      this.setAttribute("value", val);
    } else {
      this.removeAttribute("value");
    }
  }

  get label() {
    return this.getAttribute("label") || "Select time";
  }

  set label(val) {
    this.setAttribute("label", val);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(val) {
    if (val) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(val) {
    if (val) {
      this.setAttribute("required", "");
    } else {
      this.removeAttribute("required");
    }
  }

  get hour12() {
    return this.hasAttribute("hour12")
      ? this.getAttribute("hour12") !== "false"
      : true;
  }

  set hour12(val) {
    if (val) {
      this.setAttribute("hour12", "true");
    } else {
      this.setAttribute("hour12", "false");
    }
  }

  get locale() {
    return this.getAttribute("locale") || "en-US";
  }

  set locale(val) {
    this.setAttribute("locale", val);
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector(".input-field");
    if (input) {
      input.addEventListener("click", this._boundHandleInputClick);
    }
  }

  removeEventListeners() {
    const input = this.shadowRoot.querySelector(".input-field");
    if (input) {
      input.removeEventListener("click", this._boundHandleInputClick);
    }
    document.removeEventListener("click", this._boundHandleOutsideClick);
    document.removeEventListener("keydown", this._boundHandleKeyDown);
  }

  handleInputClick(e) {
    if (this.disabled) return;
    e.stopPropagation();
    this.toggleClock();
  }

  handleOutsideClick(e) {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.closeClock();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      this.closeClock();
    }
  }

  toggleClock() {
    if (this._isOpen) {
      this.closeClock();
    } else {
      this.openClock();
    }
  }

  openClock() {
    this._isOpen = true;
    this._mode = "hours";
    this.updateClockVisibility();
    this.renderClock();

    setTimeout(() => {
      document.addEventListener("click", this._boundHandleOutsideClick);
      document.addEventListener("keydown", this._boundHandleKeyDown);
    }, 0);

    this.dispatchEvent(
      new CustomEvent("ds-time-picker:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  closeClock() {
    this._isOpen = false;
    this.updateClockVisibility();
    document.removeEventListener("click", this._boundHandleOutsideClick);
    document.removeEventListener("keydown", this._boundHandleKeyDown);

    this.dispatchEvent(
      new CustomEvent("ds-time-picker:close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateClockVisibility() {
    const clock = this.shadowRoot.querySelector(".clock");
    if (clock) {
      if (this._isOpen) {
        clock.style.display = "block";
        clock.style.opacity = "1";
        clock.style.visibility = "visible";
      } else {
        clock.style.display = "none";
        clock.style.opacity = "0";
        clock.style.visibility = "hidden";
      }
    }
  }

  parseValue(value) {
    // Parse HH:mm format
    const parts = value.split(":");
    if (parts.length === 2) {
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);

      if (this.hour12) {
        this._period = hour >= 12 ? "PM" : "AM";
        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;
      }

      this._selectedHour = hour;
      this._selectedMinute = minute;
    }
  }

  formatValue() {
    if (this._selectedHour === null || this._selectedMinute === null) {
      return "";
    }

    let hour = this._selectedHour;

    if (this.hour12) {
      // Convert to 24-hour for storage
      if (this._period === "PM" && hour !== 12) {
        hour += 12;
      } else if (this._period === "AM" && hour === 12) {
        hour = 0;
      }
    }

    const hourStr = String(hour).padStart(2, "0");
    const minuteStr = String(this._selectedMinute).padStart(2, "0");

    return `${hourStr}:${minuteStr}`;
  }

  formatDisplayValue() {
    if (this._selectedHour === null || this._selectedMinute === null) {
      return "";
    }

    const hour = String(this._selectedHour).padStart(2, "0");
    const minute = String(this._selectedMinute).padStart(2, "0");

    if (this.hour12) {
      return `${hour}:${minute} ${this._period}`;
    }

    return `${hour}:${minute}`;
  }

  selectHour(hour) {
    this._selectedHour = hour;
    this._mode = "minutes";
    this.renderClock();
  }

  selectMinute(minute) {
    this._selectedMinute = minute;
    this.value = this.formatValue();

    this.dispatchEvent(
      new CustomEvent("ds-time-picker:change", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          hour: this._selectedHour,
          minute: this._selectedMinute,
          period: this.hour12 ? this._period : null,
        },
      }),
    );

    this.render();
    this.closeClock();
  }

  togglePeriod() {
    this._period = this._period === "AM" ? "PM" : "AM";
    if (this._selectedHour !== null && this._selectedMinute !== null) {
      this.value = this.formatValue();
      this.render();
    }
    this.renderClock();
  }

  renderClock() {
    const clockFace = this.shadowRoot.querySelector(".clock-face");
    const modeSelector = this.shadowRoot.querySelector(".mode-selector");

    if (!clockFace || !modeSelector) return;

    // Update mode selector
    const hoursBtn = modeSelector.querySelector(".hours-btn");
    const minutesBtn = modeSelector.querySelector(".minutes-btn");

    if (hoursBtn && minutesBtn) {
      if (this._mode === "hours") {
        hoursBtn.classList.add("active");
        minutesBtn.classList.remove("active");
      } else {
        hoursBtn.classList.remove("active");
        minutesBtn.classList.add("active");
      }
    }

    // Render clock face
    if (this._mode === "hours") {
      this.renderHours(clockFace);
    } else {
      this.renderMinutes(clockFace);
    }
  }

  renderHours(clockFace) {
    const maxHour = this.hour12 ? 12 : 23;
    const startHour = this.hour12 ? 1 : 0;
    let html = "";

    for (let i = startHour; i <= maxHour; i++) {
      const angle = this.hour12 ? (i % 12) * 30 - 90 : i * 15 - 90;
      const radius = 40;
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

      const isSelected = this._selectedHour === i;

      html += `
        <button 
          class="clock-number ${isSelected ? "selected" : ""}" 
          style="left: ${x}%; top: ${y}%;"
          data-value="${i}"
          aria-label="${i} ${this._mode}"
        >${i}</button>
      `;
    }

    clockFace.innerHTML = html;

    // Attach click listeners
    clockFace.querySelectorAll(".clock-number").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectHour(parseInt(btn.dataset.value, 10));
      });
    });
  }

  renderMinutes(clockFace) {
    let html = "";

    for (let i = 0; i < 60; i += 5) {
      const angle = i * 6 - 90;
      const radius = 40;
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

      const isSelected = this._selectedMinute === i;

      html += `
        <button 
          class="clock-number ${isSelected ? "selected" : ""}" 
          style="left: ${x}%; top: ${y}%;"
          data-value="${i}"
          aria-label="${String(i).padStart(2, "0")} minutes"
        >${String(i).padStart(2, "0")}</button>
      `;
    }

    clockFace.innerHTML = html;

    // Attach click listeners
    clockFace.querySelectorAll(".clock-number").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectMinute(parseInt(btn.dataset.value, 10));
      });
    });
  }

  render() {
    const displayValue = this.formatDisplayValue();
    const disabled = this.disabled;
    const required = this.required;
    const label = this.label;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: var(--ds-time-picker-width, 280px);
          --ds-time-picker-input-padding-y: var(--ds-space-4);
          --ds-time-picker-input-padding-x: var(--ds-space-4);
          --ds-time-picker-input-icon-padding: var(--ds-space-12);
          --ds-time-picker-label-offset-x: var(--ds-space-4);
          --ds-time-picker-label-padding-x: var(--ds-space-1);
          --ds-time-picker-label-bg: var(--md-sys-color-surface, #FEF7FF);
          --ds-time-picker-icon-offset-x: var(--ds-space-3);
          --ds-time-picker-icon-size: var(--ds-size-icon-lg);
          --ds-time-picker-clock-padding: var(--ds-space-6);
          --ds-time-picker-clock-width: 320px;
          --ds-time-picker-clock-header-gap: var(--ds-space-6);
          --ds-time-picker-mode-gap: var(--ds-space-2);
          --ds-time-picker-period-gap: var(--ds-space-1);
          --ds-time-picker-period-padding-y: var(--ds-space-2);
          --ds-time-picker-period-padding-x: var(--ds-space-3);
          --ds-time-picker-clock-face-size: 256px;
          --ds-time-picker-number-size: var(--ds-size-hit-area);
          --ds-time-picker-number-font-size: var(--ds-size-icon-sm);
        }

        .time-picker-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-container {
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: var(--ds-time-picker-input-padding-y)
            var(--ds-time-picker-input-padding-x);
          padding-right: var(--ds-time-picker-input-icon-padding);
          font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-body-large-size, 16px);
          border: 1px solid var(--md-sys-color-outline, #79747E);
          border-radius: var(--md-sys-shape-corner-extra-small, 4px);
          background: var(--md-sys-color-surface, #FEF7FF);
          color: var(--md-sys-color-on-surface, #1D1B20);
          cursor: pointer;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .input-field:hover:not(:disabled) {
          border-color: var(--md-sys-color-on-surface, #1D1B20);
        }

        .input-field:focus {
          outline: 2px solid var(--md-sys-color-primary, #6750A4);
          outline-offset: 2px;
        }

        .input-field:disabled {
          background: rgba(0, 0, 0, 0.04);
          color: rgba(0, 0, 0, 0.38);
          border-color: rgba(0, 0, 0, 0.12);
          cursor: not-allowed;
        }

        .label {
          position: absolute;
          left: var(--ds-time-picker-label-offset-x);
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          pointer-events: none;
          transition: all 0.2s;
          background: var(--ds-time-picker-label-bg);
          padding: 0 var(--ds-time-picker-label-padding-x);
        }

        .input-field:focus ~ .label,
        .input-field:not(:placeholder-shown) ~ .label,
        .has-value ~ .label {
          top: 0;
          font-size: 12px;
          color: var(--md-sys-color-primary, #6750A4);
        }

        .clock-icon {
          position: absolute;
          right: var(--ds-time-picker-icon-offset-x);
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          width: var(--ds-time-picker-icon-size);
          height: var(--ds-time-picker-icon-size);
        }

        .clock {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 1000;
          background: var(--md-sys-color-surface-container, #F3EDF7);
          border-radius: var(--md-sys-shape-corner-large, 16px);
          box-shadow: var(--md-sys-elevation-3, 0 4px 12px rgba(0, 0, 0, 0.15));
          padding: var(--ds-time-picker-clock-padding);
          min-width: var(--ds-time-picker-clock-width);
          display: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s;
        }

        .clock-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ds-time-picker-clock-header-gap);
          margin-bottom: var(--ds-time-picker-clock-header-gap);
        }

        .mode-selector {
          display: flex;
          gap: var(--ds-time-picker-mode-gap);
          align-items: baseline;
        }

        .mode-btn {
          background: transparent;
          border: none;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          font-family: var(--md-sys-typescale-display-medium-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-display-medium-size, 45px);
          font-weight: var(--md-sys-typescale-display-medium-weight, 400);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: all 0.2s;
          min-width: 96px;
          text-align: center;
        }

        .mode-btn:hover {
          background: var(--md-sys-color-surface-variant, #E7E0EC);
        }

        .mode-btn.active {
          color: var(--md-sys-color-primary, #6750A4);
          background: var(--md-sys-color-primary-container, #EADDFF);
        }

        .separator {
          font-size: 45px;
          color: var(--md-sys-color-on-surface-variant, #49454F);
        }

        .period-selector {
          display: flex;
          flex-direction: column;
          gap: var(--ds-time-picker-period-gap);
        }

        .period-btn {
          background: transparent;
          border: 1px solid var(--md-sys-color-outline, #79747E);
          color: var(--md-sys-color-on-surface, #1D1B20);
          font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-label-large-size, 14px);
          padding: var(--ds-time-picker-period-padding-y)
            var(--ds-time-picker-period-padding-x);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 52px;
        }

        .period-btn:hover {
          background: var(--md-sys-color-surface-variant, #E7E0EC);
        }

        .period-btn.active {
          background: var(--md-sys-color-tertiary-container, #FFD8E4);
          color: var(--md-sys-color-on-tertiary-container, #31111D);
          border-color: var(--md-sys-color-tertiary, #7D5260);
        }

        .clock-face-container {
          position: relative;
          width: var(--ds-time-picker-clock-face-size);
          height: var(--ds-time-picker-clock-face-size);
          margin: 0 auto;
        }

        .clock-face {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--md-sys-color-surface-variant, #E7E0EC);
        }

        .clock-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: var(--md-sys-color-primary, #6750A4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        .clock-number {
          position: absolute;
          width: var(--ds-time-picker-number-size);
          height: var(--ds-time-picker-number-size);
          border: none;
          background: transparent;
          color: var(--md-sys-color-on-surface, #1D1B20);
          border-radius: 50%;
          cursor: pointer;
          font-size: var(--ds-time-picker-number-font-size);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          transition: all 0.2s;
        }

        .clock-number:hover {
          background: var(--md-sys-color-on-surface, #1D1B20);
          opacity: 0.08;
        }

        .clock-number.selected {
          background: var(--md-sys-color-primary, #6750A4);
          color: var(--md-sys-color-on-primary, #FFFFFF);
        }

        .clock-number:focus-visible {
          outline: 2px solid var(--md-sys-color-primary, #6750A4);
          outline-offset: 2px;
        }
      </style>

      <div class="time-picker-container">
        <div class="input-container">
          <input
            type="text"
            class="input-field ${displayValue ? "has-value" : ""}"
            part="input"
            value="${displayValue}"
            placeholder=" "
            readonly
            ${disabled ? "disabled" : ""}
            ${required ? "required" : ""}
            aria-label="${label}"
          />
          <label class="label">${label}${required ? " *" : ""}</label>
          <svg class="clock-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </div>
        
        <div class="clock" part="clock" role="dialog" aria-label="Clock">
          <div class="clock-header">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="mode-selector">
                <button class="mode-btn hours-btn" aria-label="Select hours">
                  ${
                    this._selectedHour !== null
                      ? String(this._selectedHour).padStart(2, "0")
                      : "--"
                  }
                </button>
                <span class="separator">:</span>
                <button class="mode-btn minutes-btn" aria-label="Select minutes">
                  ${
                    this._selectedMinute !== null
                      ? String(this._selectedMinute).padStart(2, "0")
                      : "--"
                  }
                </button>
              </div>
              ${
                this.hour12
                  ? `
                <div class="period-selector">
                  <button class="period-btn ${
                    this._period === "AM" ? "active" : ""
                  }" data-period="AM">AM</button>
                  <button class="period-btn ${
                    this._period === "PM" ? "active" : ""
                  }" data-period="PM">PM</button>
                </div>
              `
                  : ""
              }
            </div>
          </div>
          <div class="clock-face-container">
            <div class="clock-face"></div>
            <div class="clock-center"></div>
          </div>
        </div>
      </div>
    `;

    // Setup mode selector buttons
    const hoursBtn = this.shadowRoot.querySelector(".hours-btn");
    const minutesBtn = this.shadowRoot.querySelector(".minutes-btn");

    if (hoursBtn) {
      hoursBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._mode = "hours";
        this.renderClock();
      });
    }

    if (minutesBtn) {
      minutesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._mode = "minutes";
        this.renderClock();
      });
    }

    // Setup period buttons
    if (this.hour12) {
      const periodBtns = this.shadowRoot.querySelectorAll(".period-btn");
      periodBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this._period = btn.dataset.period;
          this.togglePeriod();
        });
      });
    }

    this.renderClock();
    this.setupEventListeners();
  }
}

// Auto-register the component
customElements.define("ds-time-picker", DSTimePicker);

export default DSTimePicker;
