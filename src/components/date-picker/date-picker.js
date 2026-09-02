/**
 * DSDatePicker - A Material Design 3 date picker component
 * Calendar-based date selection with input field
 *
 * @element ds-date-picker
 *
 * @attr {string} value - Selected date in YYYY-MM-DD format
 * @attr {string} min - Minimum selectable date in YYYY-MM-DD format
 * @attr {string} max - Maximum selectable date in YYYY-MM-DD format
 * @attr {string} label - Label text for the input field
 * @attr {boolean} disabled - Disables the date picker
 * @attr {boolean} required - Marks the field as required
 * @attr {string} locale - Locale for date formatting (default: 'en-US')
 *
 * @fires {CustomEvent} ds-date-picker:change - Fired when date selection changes
 * @fires {CustomEvent} ds-date-picker:open - Fired when calendar opens
 * @fires {CustomEvent} ds-date-picker:close - Fired when calendar closes
 *
 * @csspart input - The input field
 * @csspart calendar - The calendar dropdown
 * @csspart day - Calendar day cells
 */
export class DSDatePicker extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "label", "disabled", "required", "locale"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._currentMonth = new Date();
    this._selectedDate = null;

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
        this._selectedDate = new Date(newValue);
        this._currentMonth = new Date(this._selectedDate);
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

  get min() {
    return this.getAttribute("min") || "";
  }

  set min(val) {
    if (val) {
      this.setAttribute("min", val);
    } else {
      this.removeAttribute("min");
    }
  }

  get max() {
    return this.getAttribute("max") || "";
  }

  set max(val) {
    if (val) {
      this.setAttribute("max", val);
    } else {
      this.removeAttribute("max");
    }
  }

  get label() {
    return this.getAttribute("label") || "Select date";
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
    this.toggleCalendar();
  }

  handleOutsideClick(e) {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.closeCalendar();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      this.closeCalendar();
    }
  }

  toggleCalendar() {
    if (this._isOpen) {
      this.closeCalendar();
    } else {
      this.openCalendar();
    }
  }

  openCalendar() {
    this._isOpen = true;
    this.updateCalendarVisibility();

    setTimeout(() => {
      document.addEventListener("click", this._boundHandleOutsideClick);
      document.addEventListener("keydown", this._boundHandleKeyDown);
    }, 0);

    this.dispatchEvent(
      new CustomEvent("ds-date-picker:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  closeCalendar() {
    this._isOpen = false;
    this.updateCalendarVisibility();
    document.removeEventListener("click", this._boundHandleOutsideClick);
    document.removeEventListener("keydown", this._boundHandleKeyDown);

    this.dispatchEvent(
      new CustomEvent("ds-date-picker:close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateCalendarVisibility() {
    const calendar = this.shadowRoot.querySelector(".calendar");
    if (calendar) {
      if (this._isOpen) {
        calendar.style.display = "block";
        calendar.style.opacity = "1";
        calendar.style.visibility = "visible";
      } else {
        calendar.style.display = "none";
        calendar.style.opacity = "0";
        calendar.style.visibility = "hidden";
      }
    }
  }

  previousMonth() {
    this._currentMonth = new Date(
      this._currentMonth.getFullYear(),
      this._currentMonth.getMonth() - 1,
      1,
    );
    this.renderCalendar();
  }

  nextMonth() {
    this._currentMonth = new Date(
      this._currentMonth.getFullYear(),
      this._currentMonth.getMonth() + 1,
      1,
    );
    this.renderCalendar();
  }

  selectDate(date) {
    if (this.isDateDisabled(date)) return;

    this._selectedDate = date;
    this.value = this.formatDateISO(date);

    this.dispatchEvent(
      new CustomEvent("ds-date-picker:change", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          date: date,
        },
      }),
    );

    this.render();
    this.closeCalendar();
  }

  isDateDisabled(date) {
    const minDate = this.min ? new Date(this.min) : null;
    const maxDate = this.max ? new Date(this.max) : null;

    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    return false;
  }

  formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  formatDateDisplay(date) {
    if (!date) return "";
    return date.toLocaleDateString(this.locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  renderCalendar() {
    const calendar = this.shadowRoot.querySelector(".calendar-grid");
    if (!calendar) return;

    const year = this._currentMonth.getFullYear();
    const month = this._currentMonth.getMonth();

    // Update header
    const header = this.shadowRoot.querySelector(".calendar-header-text");
    if (header) {
      header.textContent = this._currentMonth.toLocaleDateString(this.locale, {
        year: "numeric",
        month: "long",
      });
    }

    // Generate calendar days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    let html = "";

    // Day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach((day) => {
      html += `<div class="calendar-day-header">${day}</div>`;
    });

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.getTime() === today.getTime();
      const isSelected =
        this._selectedDate && date.getTime() === this._selectedDate.getTime();
      const isDisabled = this.isDateDisabled(date);

      let classes = "calendar-day";
      if (isToday) classes += " today";
      if (isSelected) classes += " selected";
      if (isDisabled) classes += " disabled";

      html += `<button 
        class="${classes}" 
        part="day"
        data-date="${this.formatDateISO(date)}"
        ${isDisabled ? "disabled" : ""}
        aria-label="${date.toLocaleDateString(this.locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}"
      >${day}</button>`;
    }

    calendar.innerHTML = html;

    // Attach day click listeners
    calendar
      .querySelectorAll(".calendar-day:not(.empty):not(.disabled)")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const dateStr = button.dataset.date;
          this.selectDate(new Date(dateStr));
        });
      });
  }

  render() {
    const value =
      this._selectedDate || (this.value ? new Date(this.value) : null);
    const displayValue = value ? this.formatDateDisplay(value) : "";
    const disabled = this.disabled;
    const required = this.required;
    const label = this.label;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: var(--ds-date-picker-width, 280px);
          --ds-date-picker-input-padding-y: var(--ds-space-4);
          --ds-date-picker-input-padding-x: var(--ds-space-4);
          --ds-date-picker-input-icon-padding: var(--ds-space-12);
          --ds-date-picker-label-offset-x: var(--ds-space-4);
          --ds-date-picker-label-padding-x: var(--ds-space-1);
          --ds-date-picker-label-bg: var(--md-sys-color-surface, #FEF7FF);
          --ds-date-picker-icon-offset-x: var(--ds-space-3);
          --ds-date-picker-calendar-padding: var(--ds-space-4);
          --ds-date-picker-calendar-width: 320px;
          --ds-date-picker-calendar-gap: var(--ds-space-1);
          --ds-date-picker-header-gap: var(--ds-space-4);
          --ds-date-picker-nav-size: var(--ds-size-hit-area);
          --ds-date-picker-day-header-padding: var(--ds-space-2);
          --ds-date-picker-day-font-size: var(--ds-size-icon-sm);
          --ds-date-picker-icon-size: var(--ds-size-icon-lg);
        }

        .date-picker-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-container {
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: var(--ds-date-picker-input-padding-y)
            var(--ds-date-picker-input-padding-x);
          padding-right: var(--ds-date-picker-input-icon-padding);
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
          left: var(--ds-date-picker-label-offset-x);
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          pointer-events: none;
          transition: all 0.2s;
          background: var(--ds-date-picker-label-bg);
          padding: 0 var(--ds-date-picker-label-padding-x);
        }

        .input-field:focus ~ .label,
        .input-field:not(:placeholder-shown) ~ .label,
        .has-value ~ .label {
          top: 0;
          font-size: 12px;
          color: var(--md-sys-color-primary, #6750A4);
        }

        .calendar-icon {
          position: absolute;
          right: var(--ds-date-picker-icon-offset-x);
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--md-sys-color-on-surface-variant, #49454F);
          width: var(--ds-date-picker-icon-size);
          height: var(--ds-date-picker-icon-size);
        }

        .calendar {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 1000;
          background: var(--md-sys-color-surface-container, #F3EDF7);
          border-radius: var(--md-sys-shape-corner-medium, 12px);
          box-shadow: var(--md-sys-elevation-2, 0 2px 6px rgba(0, 0, 0, 0.15));
          padding: var(--ds-date-picker-calendar-padding);
          min-width: var(--ds-date-picker-calendar-width);
          display: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--ds-date-picker-header-gap);
        }

        .calendar-header-text {
          font-family: var(--md-sys-typescale-title-medium-font, 'Roboto', sans-serif);
          font-size: var(--md-sys-typescale-title-medium-size, 16px);
          font-weight: var(--md-sys-typescale-title-medium-weight, 500);
          color: var(--md-sys-color-on-surface, #1D1B20);
        }

        .nav-button {
          width: var(--ds-date-picker-nav-size);
          height: var(--ds-date-picker-nav-size);
          border: none;
          background: transparent;
          color: var(--md-sys-color-on-surface, #1D1B20);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .nav-button:hover {
          background: var(--md-sys-color-on-surface, #1D1B20);
          opacity: 0.08;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: var(--ds-date-picker-calendar-gap);
        }

        .calendar-day-header {
          padding: var(--ds-date-picker-day-header-padding);
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: var(--md-sys-color-on-surface-variant, #49454F);
        }

        .calendar-day {
          aspect-ratio: 1;
          border: none;
          background: transparent;
          color: var(--md-sys-color-on-surface, #1D1B20);
          border-radius: 50%;
          cursor: pointer;
          font-size: var(--ds-date-picker-day-font-size);
          transition: all 0.2s;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calendar-day.empty {
          cursor: default;
        }

        .calendar-day:not(.empty):not(.disabled):hover {
          background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
        }

        .calendar-day.today {
          border: 1px solid var(--md-sys-color-primary, #6750A4);
        }

        .calendar-day.selected {
          background: var(--md-sys-color-primary, #6750A4);
          color: var(--md-sys-color-on-primary, #FFFFFF);
        }

        .calendar-day.disabled {
          color: rgba(0, 0, 0, 0.38);
          cursor: not-allowed;
        }

        .calendar-day:focus-visible {
          outline: 2px solid var(--md-sys-color-primary, #6750A4);
          outline-offset: 2px;
        }
      </style>

      <div class="date-picker-container">
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
          <svg class="calendar-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z"/>
          </svg>
        </div>
        
        <div class="calendar" part="calendar" role="dialog" aria-label="Calendar">
          <div class="calendar-header">
            <button class="nav-button prev-month" aria-label="Previous month">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <div class="calendar-header-text"></div>
            <button class="nav-button next-month" aria-label="Next month">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
          <div class="calendar-grid"></div>
        </div>
      </div>
    `;

    // Setup navigation buttons
    const prevBtn = this.shadowRoot.querySelector(".prev-month");
    const nextBtn = this.shadowRoot.querySelector(".next-month");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.previousMonth();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.nextMonth();
      });
    }

    this.renderCalendar();
    this.setupEventListeners();
  }
}

// Auto-register the component
customElements.define("ds-date-picker", DSDatePicker);

export default DSDatePicker;
