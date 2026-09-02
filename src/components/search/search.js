/**
 * Material Design 3 Search Component
 *
 * A search input with autocomplete suggestions and filtering.
 *
 * @element ds-search
 *
 * @attr {string} variant - The variant: 'bar' (default), 'view', or 'full-screen'
 * @attr {string} placeholder - Placeholder text for the search input
 * @attr {string} value - The current search value
 * @attr {boolean} active - Whether the search is active/expanded
 * @attr {boolean} disabled - Whether the search is disabled
 *
 * @slot leading - Leading icon (typically search icon)
 * @slot trailing - Trailing actions (clear, voice, etc.)
 *
 * @cssprop --ds-search-height - Height of the search bar
 * @cssprop --ds-search-background - Background color
 *
 * @csspart container - The main search container
 * @csspart input-container - The input field container
 * @csspart input - The input element
 * @csspart suggestions - The suggestions dropdown
 *
 * @fires ds-search:input - Fired when the input value changes
 * @fires ds-search:clear - Fired when the clear button is clicked
 * @fires ds-search:submit - Fired when the search is submitted
 * @fires ds-search:suggestion-select - Fired when a suggestion is selected
 *
 * @example
 * <ds-search placeholder="Search..."></ds-search>
 */
export class DSSearch extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "placeholder", "value", "active", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._suggestions = [];
    this._filteredSuggestions = [];
    this._selectedIndex = -1;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // Clean up event listeners if needed
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Preserve focus across re-renders
      const hadFocus =
        this.shadowRoot?.querySelector("input") ===
        this.shadowRoot?.activeElement;
      this.render();
      if (hadFocus) {
        requestAnimationFrame(() => {
          this.shadowRoot?.querySelector("input")?.focus();
        });
      }
    }
  }

  /**
   * Get the search variant
   * @returns {string} The variant: 'bar', 'view', or 'full-screen'
   */
  get variant() {
    const variant = this.getAttribute("variant");
    return ["bar", "view", "full-screen"].includes(variant) ? variant : "bar";
  }

  /**
   * Set the search variant
   * @param {string} value - The variant
   */
  set variant(value) {
    this.setAttribute("variant", value);
  }

  /**
   * Get the placeholder text
   * @returns {string} The placeholder text
   */
  get placeholder() {
    return this.getAttribute("placeholder") || "Search";
  }

  /**
   * Set the placeholder text
   * @param {string} value - The placeholder text
   */
  set placeholder(value) {
    this.setAttribute("placeholder", value);
  }

  /**
   * Get the search value
   * @returns {string} The current value
   */
  get value() {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.value : this.getAttribute("value") || "";
  }

  /**
   * Set the search value
   * @param {string} value - The search value
   */
  set value(value) {
    const stringValue =
      value !== undefined && value !== null ? String(value) : "";
    this.setAttribute("value", stringValue);
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = stringValue;
    }
  }

  /**
   * Get the active state
   * @returns {boolean} Whether the search is active
   */
  get active() {
    return this.hasAttribute("active");
  }

  /**
   * Set the active state
   * @param {boolean} value - Whether the search is active
   */
  set active(value) {
    if (value) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }

  /**
   * Get the disabled state
   * @returns {boolean} Whether the search is disabled
   */
  get disabled() {
    return this.hasAttribute("disabled");
  }

  /**
   * Set the disabled state
   * @param {boolean} value - Whether the search is disabled
   */
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  /**
   * Get the suggestions array
   * @returns {Array<string|Object>} The suggestions
   */
  get suggestions() {
    return this._suggestions;
  }

  /**
   * Set the suggestions array
   * @param {Array<string|Object>} value - The suggestions
   */
  set suggestions(value) {
    this._suggestions = Array.isArray(value) ? value : [];
    this.filterSuggestions();
  }

  /**
   * Filter suggestions based on current input value
   */
  filterSuggestions() {
    const query = this.value.toLowerCase().trim();

    if (!query) {
      this._filteredSuggestions = [];
    } else {
      this._filteredSuggestions = this._suggestions.filter((item) => {
        const text = typeof item === "string" ? item : item.text || item.label;
        return text.toLowerCase().includes(query);
      });
    }

    this._selectedIndex = -1;
    this.renderSuggestions();

    // Update aria-expanded on the input
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.setAttribute(
        "aria-expanded",
        String(this._filteredSuggestions.length > 0),
      );
    }
  }

  /**
   * Clear the search input
   */
  clear() {
    this.value = "";
    this._filteredSuggestions = [];
    this._selectedIndex = -1;
    this.renderSuggestions();

    this.dispatchEvent(
      new CustomEvent("ds-search:clear", {
        bubbles: true,
        composed: true,
      }),
    );

    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.focus();
    }
  }

  /**
   * Select a suggestion
   * @param {number} index - The index of the suggestion to select
   */
  selectSuggestion(index) {
    if (index >= 0 && index < this._filteredSuggestions.length) {
      const suggestion = this._filteredSuggestions[index];
      const text =
        typeof suggestion === "string"
          ? suggestion
          : suggestion.text || suggestion.label;

      this.value = text;
      this._filteredSuggestions = [];
      this._selectedIndex = -1;
      this.renderSuggestions();

      this.dispatchEvent(
        new CustomEvent("ds-search:suggestion-select", {
          detail: { suggestion, index },
          bubbles: true,
          composed: true,
        }),
      );

      const input = this.shadowRoot?.querySelector("input");
      if (input) {
        input.blur();
      }
    }
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector("input");
    const clearBtn = this.shadowRoot.querySelector(".clear-btn");
    const suggestionsContainer = this.shadowRoot.querySelector(
      "[part='suggestions']",
    );

    // Click on input to ensure focus
    input?.addEventListener("click", () => {
      input.focus();
    });

    // Input event
    input?.addEventListener("input", (e) => {
      this.filterSuggestions();

      this.dispatchEvent(
        new CustomEvent("ds-search:input", {
          detail: { value: e.target.value },
          bubbles: true,
          composed: true,
        }),
      );
    });

    // Focus event
    input?.addEventListener("focus", () => {
      this.active = true;
      if (this.value) {
        this.filterSuggestions();
      }
    });

    // Keyboard navigation
    input?.addEventListener("keydown", (e) => {
      if (this._filteredSuggestions.length === 0) {
        if (e.key === "Enter") {
          this.dispatchEvent(
            new CustomEvent("ds-search:submit", {
              detail: { value: this.value },
              bubbles: true,
              composed: true,
            }),
          );
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          this._selectedIndex = Math.min(
            this._selectedIndex + 1,
            this._filteredSuggestions.length - 1,
          );
          this.renderSuggestions();
          break;

        case "ArrowUp":
          e.preventDefault();
          this._selectedIndex = Math.max(this._selectedIndex - 1, -1);
          this.renderSuggestions();
          break;

        case "Enter":
          e.preventDefault();
          if (this._selectedIndex >= 0) {
            this.selectSuggestion(this._selectedIndex);
          } else {
            this.dispatchEvent(
              new CustomEvent("ds-search:submit", {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
              }),
            );
          }
          break;

        case "Escape":
          e.preventDefault();
          this._filteredSuggestions = [];
          this._selectedIndex = -1;
          this.renderSuggestions();
          input.blur();
          break;
      }
    });

    // Clear button
    clearBtn?.addEventListener("click", () => {
      this.clear();
    });

    // Suggestion clicks
    suggestionsContainer?.addEventListener("click", (e) => {
      const item = e.target.closest(".suggestion-item");
      if (item) {
        const index = parseInt(item.dataset.index, 10);
        this.selectSuggestion(index);
      }
    });
  }

  renderSuggestions() {
    const container = this.shadowRoot.querySelector("[part='suggestions']");
    if (!container) return;

    if (this._filteredSuggestions.length === 0) {
      container.innerHTML = "";
      container.style.display = "none";
      return;
    }

    container.style.display = "block";
    container.innerHTML = this._filteredSuggestions
      .map((suggestion, index) => {
        const text =
          typeof suggestion === "string"
            ? suggestion
            : suggestion.text || suggestion.label;
        const isSelected = index === this._selectedIndex;

        return `
          <div 
            class="suggestion-item ${isSelected ? "selected" : ""}"
            data-index="${index}"
            role="option"
            aria-selected="${isSelected}">
            ${this.escapeHtml(text)}
          </div>
        `;
      })
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    const variant = this.variant;
    const placeholder = this.placeholder;
    const value = this.getAttribute("value") || "";
    const isActive = this.active;
    const isDisabled = this.disabled;
    const showClear = value.length > 0;
    const hasSuggestions = this._filteredSuggestions.length > 0;

    const isFullScreen = variant === "full-screen";
    const isView = variant === "view";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          box-sizing: border-box;
          --ds-search-gap: var(--ds-space-2, 8px);
          --ds-search-padding-block: var(--ds-space-2, 8px);
          --ds-search-padding-inline: var(--ds-space-4, 16px);
          --ds-search-height: var(--ds-size-control-lg, 56px);
          --ds-search-fullscreen-height: calc(
            var(--ds-size-control-lg, 56px) + var(--ds-space-2, 8px)
          );
          --ds-search-icon-size: var(--ds-size-icon-md, 24px);
          --ds-search-clear-icon-size: var(--ds-size-icon-sm, 20px);
          --ds-search-border-radius: 28px;
          --ds-search-suggestions-max-block-size: 400px;
        }

        :host([variant="full-screen"]) {
          position: fixed;
          inset-block: 0;
          inset-inline: 0;
          z-index: 1000;
          background-color: var(--md-sys-color-surface, #fff);
        }

        [part="container"] {
          display: flex;
          flex-direction: column;
          inline-size: 100%;
          block-size: ${isFullScreen ? "100%" : "auto"};
        }

        [part="input-container"] {
          display: flex;
          align-items: center;
          gap: var(--ds-search-gap);
          padding-block: var(--ds-search-padding-block);
          padding-inline: var(--ds-search-padding-inline);
          background-color: var(--md-sys-color-surface-container-high, #f5f5f5);
          border-radius: ${
            isFullScreen
              ? "0"
              : hasSuggestions
                ? "var(--ds-search-border-radius) var(--ds-search-border-radius) 0 0"
                : "var(--ds-search-border-radius)"
          };
          block-size: ${
            isFullScreen
              ? "var(--ds-search-fullscreen-height)"
              : "var(--ds-search-height)"
          };
          box-sizing: border-box;
          transition: background-color 0.2s;
        }

        :host([variant="view"]) [part="input-container"],
        :host([active]) [part="input-container"] {
          background-color: var(--md-sys-color-surface-container-highest, #e8e8e8);
        }

        [part="input-container"]:focus-within {
          outline: 2px solid var(--md-sys-color-primary, #6750a4);
          outline-offset: 2px;
        }

        .leading-icon,
        .trailing-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: var(--ds-search-icon-size);
          block-size: var(--ds-search-icon-size);
          color: var(--md-sys-color-on-surface-variant, #666);
          pointer-events: none;
        }

        [part="input"] {
          flex: 1;
          min-inline-size: 0;
          block-size: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 16px;
          line-height: 24px;
          color: var(--md-sys-color-on-surface, #000);
          font-family: inherit;
          caret-color: var(--md-sys-color-primary, #6750a4);
          cursor: text;
          padding: 0;
          pointer-events: auto;
        }

        [part="input"]::placeholder {
          color: var(--md-sys-color-on-surface-variant, #666);
        }

        [part="input"]:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .clear-btn {
          display: ${showClear ? "flex" : "none"};
          align-items: center;
          justify-content: center;
          inline-size: var(--ds-search-icon-size);
          block-size: var(--ds-search-icon-size);
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          color: var(--md-sys-color-on-surface-variant, #666);
          padding: 0;
        }

        .clear-btn:hover {
          background-color: var(--md-sys-color-surface-container-highest, #e8e8e8);
        }

        .clear-btn svg {
          inline-size: var(--ds-search-clear-icon-size);
          block-size: var(--ds-search-clear-icon-size);
          fill: currentColor;
        }

        [part="suggestions"] {
          display: none;
          flex-direction: column;
          background-color: var(--md-sys-color-surface-container-high, #f5f5f5);
          border-radius: 0 0 var(--ds-search-border-radius) var(--ds-search-border-radius);
          overflow: hidden;
          max-block-size: ${
            isFullScreen
              ? "calc(100vh - var(--ds-search-fullscreen-height))"
              : "var(--ds-search-suggestions-max-block-size)"
          };
          overflow-y: auto;
          box-shadow: var(--md-sys-elevation-2, 0 2px 4px rgba(0,0,0,0.1));
        }

        .suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          font-size: 16px;
          line-height: 24px;
          color: var(--md-sys-color-on-surface, #000);
          transition: background-color 0.2s;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background-color: var(--md-sys-color-surface-container-highest, #e8e8e8);
        }

        .suggestion-item.selected {
          font-weight: 500;
        }

        ::slotted([slot="leading"]) {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        ::slotted([slot="trailing"]) {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>

      <div part="container" role="search">
        <div part="input-container">
          <div class="leading-icon">
            <slot name="leading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </slot>
          </div>
          
          <input
            part="input"
            type="text"
            placeholder="${placeholder}"
            value="${value}"
            ${isDisabled ? "disabled" : ""}
            tabindex="0"
            aria-label="${placeholder}"
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            role="combobox"
            aria-expanded="${this._filteredSuggestions.length > 0}">
          
          <button
            class="clear-btn"
            aria-label="Clear search"
            type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          <div class="trailing-icon">
            <slot name="trailing"></slot>
          </div>
        </div>
        
        <div part="suggestions" id="suggestions-list" role="listbox"></div>
      </div>
    `;

    // Re-setup event listeners after render
    requestAnimationFrame(() => {
      this.setupEventListeners();
    });
  }
}

if (!customElements.get("ds-search")) {
  customElements.define("ds-search", DSSearch);
}

export default DSSearch;
