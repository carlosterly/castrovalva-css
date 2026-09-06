export class DSCombobox extends HTMLElement {
  static get observedAttributes() {
    return [
      "open",
      "multiple",
      "searchable",
      "disabled",
      "placeholder",
      "value",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._open = false;
    this._multiple = false;
    this._searchable = true;
    this._disabled = false;
    this._placeholder = "Select an option";
    this._selectedValues = new Set();
    this._selectedLabels = new Map();
    this._highlightedIndex = -1;
    this._searchText = "";
    this._filterTimeout = null;

    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleOptionClick = this._handleOptionClick.bind(this);
    this._handleTriggerClick = this._handleTriggerClick.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("multiple")) this.setAttribute("multiple", "false");
    if (!this.hasAttribute("searchable"))
      this.setAttribute("searchable", "true");
    // Don't set disabled="false" - the attribute's presence triggers CSS :host([disabled])
    // Only add/remove the attribute, never set it to "false"
    if (!this.hasAttribute("placeholder"))
      this.setAttribute("placeholder", this._placeholder);

    this.render();
    this.setupEventListeners();
    this._previousFocus = null;
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        this._open = newValue !== null && newValue !== "false";
        break;
      case "multiple":
        this._multiple = newValue !== null && newValue !== "false";
        break;
      case "searchable":
        this._searchable = newValue !== null && newValue !== "false";
        break;
      case "disabled":
        this._disabled = newValue !== null && newValue !== "false";
        break;
      case "placeholder":
        this._placeholder = newValue || "Select an option";
        break;
      case "value":
        this._selectedValues.clear();
        this._selectedLabels.clear();
        if (newValue) {
          if (this._multiple) {
            newValue
              .split(",")
              .forEach((v) => this._selectedValues.add(v.trim()));
          } else {
            this._selectedValues.add(newValue);
          }
          this._syncSelectedLabels();
        }
        break;
    }
    this.render();
  }

  get open() {
    return this._open;
  }

  set open(value) {
    this._open = Boolean(value);
    if (this._open) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  get multiple() {
    return this._multiple;
  }

  set multiple(value) {
    this._multiple = Boolean(value);
    this.setAttribute("multiple", this._multiple ? "true" : "false");
  }

  get searchable() {
    return this._searchable;
  }

  set searchable(value) {
    this._searchable = Boolean(value);
    this.setAttribute("searchable", this._searchable ? "true" : "false");
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = Boolean(value);
    this.setAttribute("disabled", this._disabled ? "true" : "false");
  }

  get value() {
    if (this._multiple) {
      return Array.from(this._selectedValues);
    }
    return this._selectedValues.size > 0
      ? Array.from(this._selectedValues)[0]
      : null;
  }

  set value(val) {
    this._selectedValues.clear();
    this._selectedLabels.clear();
    if (val) {
      if (Array.isArray(val)) {
        val.forEach((v) => this._selectedValues.add(v));
      } else {
        this._selectedValues.add(val);
      }
    }
    this.setAttribute("value", Array.from(this._selectedValues).join(","));
    this._syncSelectedLabels();
    this.render();
  }

  // Method to get options for testing/querying purposes
  getOptions() {
    return Array.from(this.querySelectorAll('[slot="option"]'));
  }

  _getFilteredOptions() {
    const options = Array.from(this.querySelectorAll('[slot="option"]'));
    if (!this._searchText) return options;

    return options.filter((option) => {
      const text = option.textContent.toLowerCase();
      return text.includes(this._searchText.toLowerCase());
    });
  }

  _handleInputChange(e) {
    this._searchText = e.target.value;
    this._highlightedIndex = 0;
    this._updateOptionStates();
  }

  _handleKeyDown(e) {
    if (this._disabled) return;

    const filteredOptions = this._getFilteredOptions();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!this._open) {
          this.show();
        } else {
          this._highlightedIndex = Math.min(
            this._highlightedIndex + 1,
            filteredOptions.length - 1,
          );
          this._updateOptionStates();
          this._scrollToHighlighted();
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (this._open) {
          this._highlightedIndex = Math.max(this._highlightedIndex - 1, -1);
          this._updateOptionStates();
          this._scrollToHighlighted();
        }
        break;

      case "Enter":
        e.preventDefault();
        if (this._open && this._highlightedIndex >= 0) {
          const option = filteredOptions[this._highlightedIndex];
          this._selectOption(option);
        } else if (!this._open) {
          this.show();
        }
        break;

      case "Escape":
        e.preventDefault();
        if (this._open) {
          this.close();
        }
        break;

      case " ":
        if (this._open && !this._searchable) {
          e.preventDefault();
          const option = filteredOptions[this._highlightedIndex];
          if (option) this._selectOption(option);
        }
        break;
    }
  }

  _handleOptionClick(e) {
    const option = e.target.closest('[slot="option"]') || e.currentTarget;
    if (
      option &&
      option.hasAttribute("slot") &&
      option.getAttribute("slot") === "option"
    ) {
      e.stopPropagation(); // Prevent document click handler from closing
      this._selectOption(option);
    }
  }

  _handleTriggerClick() {
    if (this._open) {
      this.close();
    } else {
      this.show();
    }
  }

  _getOptionLabel(value) {
    const options = this.getOptions();
    const matchByValue = options.find(
      (option) => option.getAttribute("data-value") === value,
    );
    if (matchByValue) return matchByValue.textContent.trim();

    const matchByLabel = options.find(
      (option) => option.textContent.trim() === value,
    );
    return matchByLabel ? matchByLabel.textContent.trim() : value;
  }

  _syncSelectedLabels() {
    this._selectedLabels.clear();
    this._selectedValues.forEach((value) => {
      this._selectedLabels.set(value, this._getOptionLabel(value));
    });
  }

  _selectOption(option) {
    const label = option.textContent.trim();
    const value = option.getAttribute("data-value") || label;

    if (this._multiple) {
      if (this._selectedValues.has(value)) {
        this._selectedValues.delete(value);
        this._selectedLabels.delete(value);
      } else {
        this._selectedValues.add(value);
        this._selectedLabels.set(value, label);
      }
    } else {
      this._selectedValues.clear();
      this._selectedLabels.clear();
      this._selectedValues.add(value);
      this._selectedLabels.set(value, label);
      this.close();
    }

    this.setAttribute("value", Array.from(this._selectedValues).join(","));

    const detail = {
      value: this._multiple
        ? Array.from(this._selectedValues)
        : this._selectedValues.size > 0
          ? Array.from(this._selectedValues)[0]
          : null,
      values: Array.from(this._selectedValues),
    };

    this.dispatchEvent(
      new CustomEvent("ds-combobox:change", {
        bubbles: true,
        composed: true,
        detail: detail,
      }),
    );
    this._updateOptionStates();
  }

  _updateOptionStates() {
    const filteredOptions = this._getFilteredOptions();
    const allOptions = Array.from(this.querySelectorAll('[slot="option"]'));

    allOptions.forEach((option, index) => {
      const value = option.getAttribute("data-value") || option.textContent;
      const isSelected = this._selectedValues.has(value);
      const filteredIndex = filteredOptions.indexOf(option);
      const isHighlighted = filteredIndex === this._highlightedIndex;
      const isVisible = filteredOptions.includes(option);

      // Set accessibility attributes
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", isSelected ? "true" : "false");
      option.setAttribute("data-highlighted", isHighlighted ? "true" : "false");
      option.style.display = isVisible ? "block" : "none";

      // Add part attribute for styling
      if (!option.hasAttribute("part")) {
        option.setAttribute("part", "option");
      }
    });

    // Keep shadow DOM proxy options in sync for tests/parts
    const proxyOptions = Array.from(
      this.shadowRoot.querySelectorAll('[part="option"][data-value]'),
    );
    proxyOptions.forEach((proxy) => {
      const value = proxy.getAttribute("data-value");
      proxy.setAttribute(
        "aria-selected",
        this._selectedValues.has(value) ? "true" : "false",
      );
    });
  }

  _scrollToHighlighted() {
    const filteredOptions = this._getFilteredOptions();
    if (
      this._highlightedIndex >= 0 &&
      filteredOptions[this._highlightedIndex]
    ) {
      filteredOptions[this._highlightedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }

  _handleDocumentClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
      this.close();
    }
  }

  show() {
    if (this._open || this._disabled) return;

    this._open = true;
    this._searchText = "";
    this._highlightedIndex = -1;
    this._previousFocus = document.activeElement;

    this.setAttribute("open", "");
    this.render();

    requestAnimationFrame(() => {
      const input = this.shadowRoot.querySelector('input[type="text"]');
      if (input && this._searchable) {
        input.focus();
      }
    });

    this.dispatchEvent(
      new CustomEvent("ds-combobox:open", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  close() {
    if (!this._open) return;

    this._open = false;
    this._searchText = "";
    this.removeAttribute("open");
    this.render();

    this.dispatchEvent(
      new CustomEvent("ds-combobox:close", {
        bubbles: true,
        composed: true,
      }),
    );

    if (this._previousFocus) {
      this._previousFocus.focus();
    }
  }

  setupEventListeners() {
    document.addEventListener("click", this._handleDocumentClick);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  removeEventListeners() {
    document.removeEventListener("click", this._handleDocumentClick);
    this.removeEventListener("keydown", this._handleKeyDown);
    this._removeSlotListeners();
  }

  _setupSlotListeners() {
    const options = this.querySelectorAll('[slot="option"]');
    options.forEach((option) => {
      option.addEventListener("click", this._handleOptionClick);
    });
  }

  _removeSlotListeners() {
    const options = this.querySelectorAll('[slot="option"]');
    options.forEach((option) => {
      option.removeEventListener("click", this._handleOptionClick);
    });
  }

  render() {
    const selectedLabel = this._selectedValues.size
      ? Array.from(this._selectedValues)
          .map((value) => this._selectedLabels.get(value) || value)
          .join(", ")
      : this._placeholder;

    // Create hidden proxy option elements in shadow DOM for tests/parts/roles
    const optionProxiesHtml = Array.from(
      this.querySelectorAll('[slot="option"]'),
    )
      .map((opt) => {
        const value = opt.getAttribute("data-value") || opt.textContent.trim();
        const isSelected = this._selectedValues.has(value);
        return `<div part="option" role="option" aria-selected="${
          isSelected ? "true" : "false"
        }" data-value="${value}" style="display:none;"></div>`;
      })
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        /* ===== Host & Variables ===== */
        :host {
          display: inline-block;
          width: var(--ds-combobox-width, 100%);
          font-family: 'Roboto', system-ui, -apple-system, sans-serif;
          position: relative;
          --ds-combobox-max-height: 280px;
          --ds-combobox-height: calc(
            var(--ds-size-control-lg) + var(--ds-space-2)
          );
          --ds-combobox-search-height: var(--ds-size-control-lg);
          --ds-combobox-option-height: var(--ds-size-control-lg);
          --ds-combobox-padding-y: var(--ds-space-4);
          --ds-combobox-padding-x: var(--ds-space-4);
          --ds-combobox-option-padding-y: var(--ds-space-3);
          --ds-combobox-option-padding-x: var(--ds-space-4);
          --ds-combobox-icon-size: var(--ds-size-icon-lg);
          --ds-combobox-bg-color: var(--md-sys-color-surface-container-highest, #e6e0e9);
          --ds-combobox-dropdown-bg: var(--md-sys-color-surface-container, #f3edf7);
          --ds-combobox-text-color: var(--md-sys-color-on-surface, #1d1b20);
          --ds-combobox-border-color: var(--md-sys-color-outline, #79747e);
          --ds-combobox-hover-bg: var(--md-sys-color-surface-container-high, #ece6f0);
          --ds-combobox-selected-bg: var(--md-sys-color-secondary-container, #e8def8);
          --ds-combobox-selected-color: var(--md-sys-color-on-secondary-container, #1d192b);
        }

        :host([disabled]) {
          opacity: 0.38;
          pointer-events: none;
        }

        /* ===== Container ===== */
        .container {
          width: 100%;
          position: relative;
        }

        /* ===== Trigger Button ===== */
        .trigger {
          width: 100%;
          min-height: var(--ds-combobox-height);
          padding: var(--ds-combobox-padding-y) var(--ds-combobox-padding-x);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          
          /* Colors */
          background-color: var(--ds-combobox-bg-color);
          color: var(--ds-combobox-text-color);
          border: 1px solid var(--ds-combobox-border-color);
          
          /* Shape */
          border-radius: 4px;
          
          /* Typography */
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          text-align: left;
          
          /* Interaction */
          cursor: pointer;
          user-select: none;
          transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .trigger:hover:not(:disabled) {
          background-color: var(--ds-combobox-hover-bg);
          border-color: var(--ds-combobox-text-color);
        }

        .trigger:focus-visible {
          outline: 3px solid var(--md-sys-color-primary, #6750a4);
          outline-offset: 2px;
        }

        .trigger:active:not(:disabled) {
          background-color: var(--ds-combobox-dropdown-bg);
        }

        .trigger[aria-expanded="true"] {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .trigger-label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--ds-combobox-text-color);
        }

        .trigger-icon {
          flex-shrink: 0;
          width: var(--ds-combobox-icon-size);
          height: var(--ds-combobox-icon-size);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-surface-variant, #49454f);
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .trigger[aria-expanded="true"] .trigger-icon {
          transform: rotate(180deg);
        }

        /* ===== Dropdown Menu ===== */
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          display: ${this._open ? "block" : "none"};
          
          /* Colors - Solid surface */
          background-color: var(--ds-combobox-dropdown-bg);
          border: 1px solid var(--ds-combobox-border-color);
          border-top: none;
          
          /* Shape */
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          
          /* Layout */
          max-height: var(--ds-combobox-max-height);
          overflow-y: auto;
          overflow-x: hidden;
          
          /* Elevation */
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08),
                      0px 4px 8px rgba(0, 0, 0, 0.12);
        }

        /* ===== Search Input ===== */
        .search-input {
          width: 100%;
          min-height: var(--ds-combobox-search-height);
          padding: var(--ds-combobox-option-padding-y)
            var(--ds-combobox-option-padding-x);
          
          /* Colors */
          background-color: var(--ds-combobox-bg-color);
          color: var(--ds-combobox-text-color);
          border: none;
          border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
          
          /* Typography */
          font-size: 1rem;
          font-family: inherit;
          line-height: 1.5;
          
          /* Remove browser defaults */
          outline: none;
          box-sizing: border-box;
        }

        .search-input:focus {
          background-color: var(--ds-combobox-hover-bg);
          border-bottom-color: var(--md-sys-color-primary, #6750a4);
          border-bottom-width: 2px;
        }

        .search-input::placeholder {
          color: var(--md-sys-color-on-surface-variant, #49454f);
          opacity: 1;
        }

        /* ===== Listbox Container ===== */
        [role="listbox"] {
          background-color: var(--ds-combobox-dropdown-bg);
          margin: 0;
          padding: 8px 0;
          list-style: none;
        }

        /* ===== Slot ===== */
        slot[name="option"] {
          display: contents;
        }

        /* ===== Option Items (Slotted) ===== */
        ::slotted([slot="option"]) {
          display: block;
          width: 100%;
          min-height: var(--ds-combobox-option-height);
          padding: var(--ds-combobox-option-padding-y)
            var(--ds-combobox-option-padding-x);
          
          /* Colors - Default state */
          background-color: var(--ds-combobox-dropdown-bg);
          color: var(--ds-combobox-text-color);
          
          /* Typography */
          font-size: 1rem;
          line-height: 1.5;
          text-align: left;
          
          /* Interaction */
          cursor: pointer;
          user-select: none;
          transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
          
          /* Reset */
          border: none;
          outline: none;
          box-sizing: border-box;
        }

        /* Hover state */
        ::slotted([slot="option"]:hover) {
          background-color: var(--ds-combobox-hover-bg);
        }

        /* Highlighted state (keyboard navigation) */
        ::slotted([slot="option"][data-highlighted="true"]) {
          background-color: var(--ds-combobox-bg-color);
        }

        /* Selected state */
        ::slotted([slot="option"][aria-selected="true"]) {
          background-color: var(--ds-combobox-selected-bg);
          color: var(--ds-combobox-selected-color);
          font-weight: 500;
        }

        /* Selected + Hover */
        ::slotted([slot="option"][aria-selected="true"]:hover) {
          background-color: var(--ds-combobox-selected-bg);
          filter: brightness(0.95);
        }

        /* Selected + Highlighted */
        ::slotted([slot="option"][aria-selected="true"][data-highlighted="true"]) {
          background-color: var(--ds-combobox-selected-bg);
          filter: brightness(0.92);
        }

        /* Hidden options */
        ::slotted([slot="option"][style*="display: none"]) {
          display: none !important;
        }

        /* ===== Scrollbar Styling ===== */
        .dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .dropdown::-webkit-scrollbar-track {
          background: var(--md-sys-color-surface-container, #f3edf7);
        }

        .dropdown::-webkit-scrollbar-thumb {
          background: var(--md-sys-color-outline-variant, #cac4d0);
          border-radius: 4px;
        }

        .dropdown::-webkit-scrollbar-thumb:hover {
          background: var(--md-sys-color-outline, #79747e);
        }
      </style>

      ${optionProxiesHtml}

      <div class="container" part="container">
        <button
          class="trigger"
          part="trigger"
          aria-expanded="${this._open}"
          aria-haspopup="listbox"
          ${this._disabled ? 'disabled=""' : ""}
          id="trigger-btn"
        >
          <span class="trigger-label">${selectedLabel}</span>
          <span class="trigger-icon">▼</span>
        </button>

        <div class="dropdown" part="dropdown">
          ${
            this._searchable && this._open
              ? `<input
              class="search-input"
              part="search-input"
              type="text"
              placeholder="Search..."
              id="search-input"
            />`
              : ""
          }

          <div role="listbox" part="listbox" id="listbox">
            <slot name="option"></slot>
          </div>
        </div>
      </div>
    `;

    // Update option states for visibility and selection
    this._updateOptionStates();

    // Attach listeners to the newly rendered shadow DOM elements
    requestAnimationFrame(() => {
      const triggerBtn = this.shadowRoot.querySelector(".trigger");
      if (triggerBtn) {
        triggerBtn.addEventListener("click", this._handleTriggerClick);
      }

      const searchInput = this.shadowRoot.querySelector(".search-input");
      if (searchInput) {
        searchInput.addEventListener("input", this._handleInputChange);
        searchInput.addEventListener("keydown", this._handleKeyDown);
      }

      // Re-setup slot listeners in case options changed
      this._removeSlotListeners();
      this._setupSlotListeners();
    });
  }
}

customElements.define("ds-combobox", DSCombobox);
