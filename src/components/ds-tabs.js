/**
 * Material Design 3 Tabs Component
 * Organize content into separate views that users can switch between
 */

export class DSTabs extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "selected-index"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "primary"; // primary, secondary
    this._selectedIndex = 0;
    this._tabs = [];
    this._panels = [];
  }

  connectedCallback() {
    this.render();
    this._cacheElements();
    this._setupTabs();
    this._attachListeners();
    this._updateSelection();
  }

  disconnectedCallback() {
    this._detachListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "primary";
        this._updateVariant();
        break;
      case "selected-index":
        this._selectedIndex = parseInt(newValue) || 0;
        this._updateSelection();
        break;
    }
  }

  get variant() {
    return this._variant;
  }
  set variant(val) {
    this.setAttribute("variant", val);
  }

  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(val) {
    this.setAttribute("selected-index", val);
  }

  _cacheElements() {
    this._tabList = this.shadowRoot.querySelector('[role="tablist"]');
    this._indicator = this.shadowRoot.querySelector(".indicator");
  }

  _setupTabs() {
    // Get tab items from slot
    const slot = this.shadowRoot.querySelector('slot[name="tab"]');
    if (!slot) return;

    this._tabs = slot.assignedElements();

    // Get panel items from panel slot
    const panelSlot = this.shadowRoot.querySelector('slot[name="panel"]');
    if (panelSlot) {
      this._panels = panelSlot.assignedElements();
    }

    // Setup each tab
    this._tabs.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("tabindex", index === this._selectedIndex ? "0" : "-1");
      tab.setAttribute(
        "aria-selected",
        index === this._selectedIndex ? "true" : "false"
      );
      tab.id = tab.id || `tab-${this._generateId()}-${index}`;

      // Link to panel if exists
      if (this._panels[index]) {
        const panel = this._panels[index];
        panel.setAttribute("role", "tabpanel");
        panel.id = panel.id || `panel-${this._generateId()}-${index}`;
        tab.setAttribute("aria-controls", panel.id);
        panel.setAttribute("aria-labelledby", tab.id);
        panel.hidden = index !== this._selectedIndex;
      }
    });
  }

  _attachListeners() {
    // Use event delegation on the tab list
    this._handleClickBound = this._handleClick.bind(this);
    this._handleKeydownBound = this._handleKeydown.bind(this);
    this._handleSlotChangeBound = this._handleSlotChange.bind(this);

    this._tabList.addEventListener("click", this._handleClickBound);
    this._tabList.addEventListener("keydown", this._handleKeydownBound);

    const slot = this.shadowRoot.querySelector('slot[name="tab"]');
    if (slot) {
      slot.addEventListener("slotchange", this._handleSlotChangeBound);
    }
  }

  _detachListeners() {
    if (this._tabList) {
      this._tabList.removeEventListener("click", this._handleClickBound);
      this._tabList.removeEventListener("keydown", this._handleKeydownBound);
    }
  }

  _handleClick(e) {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;

    const index = this._tabs.indexOf(tab);
    if (index !== -1 && index !== this._selectedIndex) {
      this._selectTab(index);
    }
  }

  _handleKeydown(e) {
    const currentTab = e.target.closest('[role="tab"]');
    if (!currentTab) return;

    let newIndex = this._selectedIndex;
    const isRTL = getComputedStyle(this).direction === "rtl";

    switch (e.key) {
      case "ArrowLeft":
        newIndex = isRTL ? this._selectedIndex + 1 : this._selectedIndex - 1;
        break;
      case "ArrowRight":
        newIndex = isRTL ? this._selectedIndex - 1 : this._selectedIndex + 1;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = this._tabs.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        this._selectTab(this._selectedIndex);
        return;
      default:
        return;
    }

    e.preventDefault();

    // Wrap around
    if (newIndex < 0) newIndex = this._tabs.length - 1;
    if (newIndex >= this._tabs.length) newIndex = 0;

    // Skip disabled tabs
    while (this._tabs[newIndex]?.hasAttribute("disabled")) {
      newIndex =
        e.key === "ArrowLeft" || e.key === "Home" ? newIndex - 1 : newIndex + 1;
      if (newIndex < 0) newIndex = this._tabs.length - 1;
      if (newIndex >= this._tabs.length) newIndex = 0;
    }

    this._selectTab(newIndex);
    this._tabs[newIndex]?.focus();
  }

  _handleSlotChange() {
    this._setupTabs();
    this._updateSelection();
  }

  _selectTab(index) {
    if (index === this._selectedIndex) return;
    if (this._tabs[index]?.hasAttribute("disabled")) return;

    const oldIndex = this._selectedIndex;
    this._selectedIndex = index;

    // Update attribute (will trigger attributeChangedCallback but we guard against same value)
    this.setAttribute("selected-index", index);

    this._updateSelection();

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent("tab-change", {
        detail: {
          selectedIndex: index,
          previousIndex: oldIndex,
          tab: this._tabs[index],
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _updateSelection() {
    if (!this._tabs.length) return;

    // Update tabs
    this._tabs.forEach((tab, index) => {
      const isSelected = index === this._selectedIndex;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
      tab.classList.toggle("selected", isSelected);
    });

    // Update panels
    this._panels.forEach((panel, index) => {
      panel.hidden = index !== this._selectedIndex;
    });

    // Update indicator position
    this._updateIndicator();
  }

  _updateIndicator() {
    if (!this._indicator || !this._tabs[this._selectedIndex]) return;

    const selectedTab = this._tabs[this._selectedIndex];
    const tabRect = selectedTab.getBoundingClientRect();
    const listRect = this._tabList.getBoundingClientRect();

    const left = tabRect.left - listRect.left + this._tabList.scrollLeft;
    const width = tabRect.width;

    this._indicator.style.transform = `translateX(${left}px)`;
    this._indicator.style.width = `${width}px`;
  }

  _updateVariant() {
    if (!this._tabList) return;
    this._tabList.dataset.variant = this._variant;
  }

  _generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--md-sys-typescale-label-large-font, system-ui, sans-serif);
          --tab-height: 48px;
          --tab-horizontal-padding: 24px;
          --indicator-height: 3px;
          --indicator-color: var(--md-sys-color-primary, #6750a4);
          --tab-text-color: var(--md-sys-color-on-surface-variant, #49454f);
          --tab-text-color-selected: var(--md-sys-color-primary, #6750a4);
          --tab-bg-hover: var(--md-sys-color-on-surface, #1d1b20);
          --divider-color: var(--md-sys-color-surface-variant, #e7e0ec);
        }

        .tabs-container {
          position: relative;
          overflow: hidden;
        }

        [role="tablist"] {
          display: flex;
          position: relative;
          border-bottom: 1px solid var(--divider-color);
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        [role="tablist"]::-webkit-scrollbar {
          display: none;
        }

        .indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: var(--indicator-height);
          background: var(--indicator-color);
          border-radius: var(--indicator-height) var(--indicator-height) 0 0;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                      width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, width;
        }

        /* Secondary variant has indicator at top */
        [role="tablist"][data-variant="secondary"] .indicator {
          top: 0;
          bottom: auto;
          border-radius: 0 0 var(--indicator-height) var(--indicator-height);
        }

        /* Slotted tab styles */
        ::slotted([role="tab"]) {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: var(--tab-height);
          padding: 0 var(--tab-horizontal-padding) !important;
          border: none !important;
          background: transparent !important;
          color: var(--tab-text-color) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          letter-spacing: 0.1px;
          text-transform: none !important;
          cursor: pointer !important;
          position: relative;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        ::slotted([role="tab"]:hover) {
          background: color-mix(in srgb, var(--tab-bg-hover) 8%, transparent);
        }

        ::slotted([role="tab"]:focus-visible) {
          outline: 2px solid var(--indicator-color);
          outline-offset: -2px;
          border-radius: 4px;
        }

        ::slotted([role="tab"][aria-selected="true"]) {
          color: var(--tab-text-color-selected);
        }

        ::slotted([role="tab"][disabled]) {
          opacity: 0.38;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Panel container */
        .panels {
          position: relative;
        }

        ::slotted([role="tabpanel"]) {
          padding: 16px 0;
        }

        ::slotted([role="tabpanel"][hidden]) {
          display: none;
        }

        /* Scrollable variant */
        :host([scrollable]) [role="tablist"] {
          justify-content: flex-start;
        }

        /* Fixed variant - tabs fill available space */
        :host([fixed]) ::slotted([role="tab"]) {
          flex: 1;
        }
      </style>

      <div class="tabs-container">
        <div role="tablist" data-variant="${this._variant}">
          <slot name="tab"></slot>
          <div class="indicator"></div>
        </div>
      </div>
      <div class="panels">
        <slot name="panel"></slot>
      </div>
    `;
  }
}

/**
 * Individual Tab Item (optional helper component)
 */
export class DSTab extends HTMLElement {
  static get observedAttributes() {
    return ["disabled", "icon"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setAttribute("slot", "tab");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }
  set disabled(val) {
    if (val) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
  }

  render() {
    const icon = this.getAttribute("icon");
    const hasIcon = icon && icon.length > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .icon {
          font-family: 'Material Symbols Outlined';
          font-size: 24px;
          line-height: 1;
        }

        .label {
          font-size: 14px;
          font-weight: 500;
        }
      </style>

      ${hasIcon ? `<span class="icon">${icon}</span>` : ""}
      <span class="label"><slot></slot></span>
    `;
  }
}

/**
 * Tab Panel (optional helper component)
 */
export class DSTabPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setAttribute("slot", "panel");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
    `;
  }
}

// Register all components
customElements.define("ds-tabs", DSTabs);
customElements.define("ds-tab", DSTab);
customElements.define("ds-tab-panel", DSTabPanel);
