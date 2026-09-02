/**
 * Material Design 3 Search View Component
 * Full-screen search experience with filtering, suggestions, and recent searches
 * Provides an immersive search interface following MD3 patterns
 */

export class DSSearchView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._searchValue = "";
    this._suggestions = [];
    this._recentSearches = [];
    this._selectedIndex = -1;
    this._filterType = "all"; // all, recent, filters
    this._filters = [];
    this._appliedFilters = new Set();
  }

  static get observedAttributes() {
    return ["open", "value"];
  }

  connectedCallback() {
    this._loadRecentSearches();
    this.render();
    this._setupEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "open":
        this._isOpen = newValue !== null && newValue !== "false";
        break;
      case "value":
        this._searchValue = newValue || "";
        break;
    }

    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get open() {
    return this._isOpen;
  }

  set open(value) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  get value() {
    return this._searchValue;
  }

  set value(val) {
    this.setAttribute("value", val);
  }

  get suggestions() {
    return this._suggestions;
  }

  set suggestions(value) {
    this._suggestions = Array.isArray(value) ? value : [];
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get recentSearches() {
    return this._recentSearches;
  }

  set recentSearches(value) {
    this._recentSearches = Array.isArray(value) ? value : [];
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  get filters() {
    return this._filters;
  }

  set filters(value) {
    this._filters = Array.isArray(value) ? value : [];
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  /**
   * Get filtered suggestions based on current search value and filters
   * @returns {Array} Filtered suggestions
   */
  getFilteredSuggestions() {
    if (!this._searchValue.trim()) {
      return this._recentSearches.slice(0, 8);
    }

    const query = this._searchValue.toLowerCase();
    let filtered = this._suggestions.filter((s) =>
      s.toLowerCase().includes(query),
    );

    // Apply filters if any are selected
    if (this._appliedFilters.size > 0) {
      // Filter would be applied based on suggestion metadata
      // This is a basic implementation
    }

    return filtered.slice(0, 10);
  }

  /**
   * Add a search to recent searches
   * @param {string} search - The search term
   */
  addRecentSearch(search) {
    if (!search.trim()) return;

    // Remove if exists, then add to front
    this._recentSearches = this._recentSearches.filter((s) => s !== search);
    this._recentSearches.unshift(search);

    // Keep only last 10
    this._recentSearches = this._recentSearches.slice(0, 10);
    this._saveRecentSearches();
    this.render();
  }

  /**
   * Clear all recent searches
   */
  clearRecentSearches() {
    this._recentSearches = [];
    localStorage.removeItem("ds-search-view-recent");
    this.render();
  }

  /**
   * Toggle a filter
   * @param {string} filter - The filter to toggle
   */
  toggleFilter(filter) {
    if (this._appliedFilters.has(filter)) {
      this._appliedFilters.delete(filter);
    } else {
      this._appliedFilters.add(filter);
    }
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  /**
   * Get applied filters
   * @returns {Array} Applied filters
   */
  getAppliedFilters() {
    return Array.from(this._appliedFilters);
  }

  /**
   * Perform search
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!query.trim()) return;

    this.addRecentSearch(query);
    this.dispatchEvent(
      new CustomEvent("ds-search-view:search", {
        detail: { query, filters: this.getAppliedFilters() },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Close the search view
   */
  close() {
    this.open = false;
  }

  // Private methods

  _loadRecentSearches() {
    const stored = localStorage.getItem("ds-search-view-recent");
    if (stored) {
      try {
        this._recentSearches = JSON.parse(stored);
      } catch (e) {
        this._recentSearches = [];
      }
    }
  }

  _saveRecentSearches() {
    localStorage.setItem(
      "ds-search-view-recent",
      JSON.stringify(this._recentSearches),
    );
  }

  _setupEventListeners() {
    // Will be set up in render()
  }

  _removeEventListeners() {
    // Clean up listeners
  }

  render() {
    const filteredSuggestions = this.getFilteredSuggestions();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --search-view-background: var(--md-sys-color-surface);
          --search-view-text: var(--md-sys-color-on-surface);
          --search-view-hint: var(--md-sys-color-on-surface-variant);
          --search-view-divider: var(--md-sys-color-outline-variant);
          --search-view-header-padding: var(--ds-space-4, 16px);
          --search-view-chip-gap: var(--ds-space-2, 8px);
          --search-view-close-size: var(--ds-size-control-sm, 40px);
          --search-view-clear-size: var(--ds-size-icon-md, 24px);
          --search-view-section-gap: var(--ds-space-6, 24px);
          --search-view-section-title-gap: var(--ds-space-2, 8px);
          --search-view-empty-min-block-size: 300px;
          --search-view-scrollbar-inline-size: var(--ds-space-2, 8px);
        }

        :host([open]) {
          display: flex;
        }

        :host {
          display: none;
          position: fixed;
          inset-block: 0;
          inset-inline: 0;
          z-index: 1000;
          flex-direction: column;
          background: var(--search-view-background);
        }

        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
          font-size: 24px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: normal;
          text-transform: none;
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: var(--search-view-header-padding);
          border-block-end: 1px solid var(--search-view-divider);
          background: var(--md-sys-color-surface);
        }

        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: var(--search-view-close-size);
          block-size: var(--search-view-close-size);
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          font-size: 24px;
          transition: background 0.2s;
        }

        .close-button:hover {
          background: var(--md-sys-color-on-surface-variant, rgba(0, 0, 0, 0.05));
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--md-sys-color-surface-variant);
          border-radius: 8px;
          padding: 8px 12px;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--search-view-text);
          font-size: 16px;
          outline: none;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: var(--search-view-hint);
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: var(--search-view-clear-size);
          block-size: var(--search-view-clear-size);
          border: none;
          background: transparent;
          color: var(--md-sys-color-on-surface-variant);
          cursor: pointer;
          font-size: 18px;
          transition: color 0.2s;
        }

        .clear-button:hover {
          color: var(--md-sys-color-on-surface);
        }

        .search-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .filters-section {
          margin-block-end: var(--search-view-section-gap);
        }

        .filters-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--search-view-hint);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-block-end: var(--search-view-section-title-gap);
          padding: 0 12px;
        }

        .filters-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--search-view-chip-gap);
          padding: 0 12px;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid var(--search-view-divider);
          background: transparent;
          color: var(--search-view-text);
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .filter-chip:hover {
          border-color: var(--md-sys-color-outline);
          background: var(--md-sys-color-on-surface, rgba(0, 0, 0, 0.05));
        }

        .filter-chip[aria-pressed="true"] {
          background: var(--md-sys-color-primary-container);
          border-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary-container);
        }

        .suggestions-section {
          margin-block-end: var(--search-view-section-gap);
        }

        .suggestions-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--search-view-hint);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-block-end: var(--search-view-section-title-gap);
          padding: 0 12px;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .suggestion-item:hover {
          background: var(--md-sys-color-on-surface, rgba(0, 0, 0, 0.05));
        }

        .suggestion-item[aria-selected="true"] {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .suggestion-icon {
          font-size: 18px;
          color: var(--search-view-hint);
        }

        .suggestion-text {
          flex: 1;
          font-size: 14px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
          min-block-size: var(--search-view-empty-min-block-size);
          color: var(--search-view-hint);
        }

        .empty-state-icon {
          font-size: 48px;
          margin-block-end: var(--search-view-header-padding);
          opacity: 0.5;
        }

        .empty-state-text {
          font-size: 14px;
          line-height: 1.5;
        }

        /* Scrollbar styling */
        .search-content::-webkit-scrollbar {
          inline-size: var(--search-view-scrollbar-inline-size);
        }

        .search-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .search-content::-webkit-scrollbar-thumb {
          background: var(--md-sys-color-outline-variant);
          border-radius: 4px;
        }

        .search-content::-webkit-scrollbar-thumb:hover {
          background: var(--md-sys-color-outline);
        }
      </style>

      <div class="search-header">
        <button class="close-button" aria-label="Close search">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            placeholder="Search..."
            value="${this._searchValue}"
            aria-label="Search"
            part="input" />
          ${
            this._searchValue
              ? '<button class="clear-button" aria-label="Clear search"><span class="material-symbols-outlined">close</span></button>'
              : ""
          }
        </div>
      </div>

      <div class="search-content">
        ${
          this._filters.length > 0
            ? `
          <div class="filters-section">
            <div class="filters-title">Filters</div>
            <div class="filters-list">
              ${this._filters
                .map(
                  (filter) => `
                <button
                  class="filter-chip"
                  data-filter="${filter}"
                  aria-pressed="${this._appliedFilters.has(filter)}"
                  part="filter">
                  ${filter}
                </button>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          filteredSuggestions.length > 0
            ? `
          <div class="suggestions-section">
            <div class="suggestions-title">
              ${this._searchValue ? "Results" : "Recent Searches"}
            </div>
            <div class="suggestions-list">
              ${filteredSuggestions
                .map(
                  (suggestion, index) => `
                <div
                  class="suggestion-item"
                  data-index="${index}"
                  aria-selected="${index === this._selectedIndex}"
                  part="suggestion">
                  <span class="suggestion-icon material-symbols-outlined">
                    ${this._searchValue ? "search" : "history"}
                  </span>
                  <span class="suggestion-text">${suggestion}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : `
          <div class="empty-state">
            <div class="empty-state-icon material-symbols-outlined">search</div>
            <div class="empty-state-text">
              ${
                this._searchValue
                  ? "No results found"
                  : "Try searching for something"
              }
            </div>
          </div>
        `
        }
      </div>
    `;

    this._attachEventListeners();
  }

  _attachEventListeners() {
    const closeBtn = this.shadowRoot.querySelector(".close-button");
    const input = this.shadowRoot.querySelector(".search-input");
    const clearBtn = this.shadowRoot.querySelector(".clear-button");
    const filterChips = this.shadowRoot.querySelectorAll(".filter-chip");
    const suggestionItems =
      this.shadowRoot.querySelectorAll(".suggestion-item");

    closeBtn?.addEventListener("click", () => this.close());

    input?.addEventListener("input", (e) => {
      // Preserve caret/focus while updating value
      const caretPos = input.selectionStart ?? this._searchValue.length;
      this._searchValue = e.target.value;
      this.render();

      // Restore focus/caret so typing doesn't stop after first character
      const newInput = this.shadowRoot.querySelector(".search-input");
      if (newInput) {
        newInput.focus();
        try {
          newInput.setSelectionRange(caretPos, caretPos);
        } catch (err) {
          // Some browsers may not support setSelectionRange on certain inputs; ignore
        }
      }

      this.dispatchEvent(
        new CustomEvent("ds-search-view:input", {
          detail: { value: this._searchValue },
          bubbles: true,
          composed: true,
        }),
      );
    });

    input?.addEventListener("keydown", (e) => {
      const key = e.key || e.code;
      if (key === "Enter") {
        e.preventDefault();
        const searchTerm = input.value || this._searchValue;
        this.performSearch(searchTerm);
      } else if (key === "Escape") {
        this.close();
      } else if (key === "ArrowDown") {
        e.preventDefault();
        this._selectedIndex = Math.min(
          this._selectedIndex + 1,
          this.getFilteredSuggestions().length - 1,
        );
        this.render();
      } else if (key === "ArrowUp") {
        e.preventDefault();
        this._selectedIndex = Math.max(this._selectedIndex - 1, -1);
        this.render();
      }
    });

    clearBtn?.addEventListener("click", () => {
      this._searchValue = "";
      this.render();
      input?.focus();
    });

    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.dataset.filter;
        this.toggleFilter(filter);
      });
    });

    suggestionItems.forEach((item) => {
      item.addEventListener("click", () => {
        const suggestion = item.querySelector(".suggestion-text")?.textContent;
        if (suggestion) {
          this.performSearch(suggestion);
        }
      });
    });
  }
}

if (!customElements.get("ds-search-view")) {
  customElements.define("ds-search-view", DSSearchView);
}
