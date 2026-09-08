/**
 * Material Design 3 Chip Component
 * Compact elements representing input, attribute, or action
 * Supports: assist, filter, input, and suggestion variants
 */
export class DSChip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._variant = "assist"; // assist, filter, input, suggestion
    this._selected = false;
    this._disabled = false;
    this._elevated = false;
  }

  static get observedAttributes() {
    return [
      "variant",
      "selected",
      "disabled",
      "elevated",
      "label",
      "icon",
      "avatar",
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    // Set ARIA attributes
    if (!this.hasAttribute("role")) {
      this.setAttribute(
        "role",
        this._variant === "filter" ? "checkbox" : "button",
      );
    }
    this.setAttribute("tabindex", this.disabled ? "-1" : "0");

    if (this._variant === "filter") {
      this.setAttribute("aria-checked", this.selected ? "true" : "false");
    }
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "variant":
        this._variant = newValue || "assist";
        if (this._variant === "filter") {
          this.setAttribute("role", "checkbox");
          this.setAttribute("aria-checked", this.selected ? "true" : "false");
        } else {
          this.setAttribute("role", "button");
          this.removeAttribute("aria-checked");
        }
        break;
      case "selected":
        this._selected = newValue !== null;
        if (this._variant === "filter") {
          this.setAttribute("aria-checked", this._selected ? "true" : "false");
        }
        break;
      case "disabled":
        this._disabled = newValue !== null;
        this.setAttribute("tabindex", this._disabled ? "-1" : "0");
        this.setAttribute("aria-disabled", this._disabled ? "true" : "false");
        break;
      case "elevated":
        this._elevated = newValue !== null;
        break;
    }

    this.render();
  }

  get variant() {
    return this._variant;
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    if (value) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get elevated() {
    return this._elevated;
  }

  set elevated(value) {
    if (value) {
      this.setAttribute("elevated", "");
    } else {
      this.removeAttribute("elevated");
    }
  }

  setupEventListeners() {
    // Handle click
    this.addEventListener("click", this.handleClick.bind(this));

    // Handle keyboard
    this.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    // Check if click was on remove button
    const removeBtn = e
      .composedPath()
      .find((el) => el.classList?.contains("remove-btn"));
    if (removeBtn) {
      this.handleRemove();
      return;
    }

    // Filter chips toggle selection
    if (this._variant === "filter") {
      this.selected = !this.selected;
    }

    // Dispatch click event
    this.dispatchEvent(
      new CustomEvent("ds-chip:click", {
        bubbles: true,
        composed: true,
        detail: {
          variant: this._variant,
          selected: this._selected,
          label: this.getAttribute("label"),
        },
      }),
    );
  }

  handleKeydown(e) {
    if (this.disabled) return;

    // Space or Enter to activate
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.click();
    }

    // Delete/Backspace for input chips
    if (
      this._variant === "input" &&
      (e.key === "Delete" || e.key === "Backspace")
    ) {
      this.handleRemove();
    }
  }

  handleRemove() {
    this.dispatchEvent(
      new CustomEvent("ds-chip:remove", {
        bubbles: true,
        composed: true,
        detail: {
          label: this.getAttribute("label"),
        },
      }),
    );
  }

  render() {
    const label = this.getAttribute("label") || "";
    const icon = this.getAttribute("icon") || "";
    const avatar = this.getAttribute("avatar") || "";
    const variant = this._variant;
    const selected = this._selected;

    const showLeadingIcon =
      (variant === "filter" && selected) || icon || avatar;
    const showRemoveButton = variant === "input";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          position: relative;
          --ds-chip-height: var(--ds-size-control-sm);
          --ds-chip-icon-size: var(--ds-size-icon-md);
          --ds-chip-avatar-size: var(--ds-size-icon-lg);
          --ds-chip-remove-size: var(--ds-size-icon-md);
          --ds-chip-padding-x: 16px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: var(--ds-chip-height);
          padding: 0 var(--ds-chip-padding-x);
          border-radius: 8px;
          border: 1px solid var(--md-sys-color-outline);
          background-color: transparent;
          color: var(--md-sys-color-on-surface-variant);
          font-family: var(--md-sys-typescale-label-large-font-family-name);
          font-size: var(--md-sys-typescale-label-large-font-size);
          font-weight: var(--md-sys-typescale-label-large-font-weight);
          line-height: var(--md-sys-typescale-label-large-line-height);
          cursor: pointer;
          user-select: none;
          transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          box-sizing: border-box;
        }

        /* Elevated variant */
        :host([elevated]) .chip {
          border: none;
          background-color: var(--md-sys-color-surface-container-low);
          box-shadow: var(--ds-shadow-1);
        }

        /* Selected state (filter chips) */
        :host([selected]) .chip {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          border-color: transparent;
        }

        :host([selected][elevated]) .chip {
          background-color: var(--md-sys-color-secondary-container);
        }

        /* Disabled state */
        :host([disabled]) .chip {
          opacity: 0.38;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Hover state */
        :host(:not([disabled]):hover) .chip {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.08);
        }

        :host([selected]:not([disabled]):hover) .chip {
          background-color: var(--md-sys-color-secondary-container);
          box-shadow: var(--ds-shadow-1);
        }

        :host([elevated]:not([disabled]):hover) .chip {
          box-shadow: var(--ds-shadow-2);
        }

        /* Focus state */
        :host(:focus-visible) {
          outline: none;
        }

        :host(:focus-visible) .chip {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        /* Active/pressed state */
        :host(:not([disabled]):active) .chip {
          background-color: rgba(var(--md-sys-color-on-surface-rgb, 29, 27, 32), 0.12);
        }

        :host([selected]:not([disabled]):active) .chip {
          background-color: var(--md-sys-color-secondary-container);
        }

        /* Leading icon/avatar */
        .leading-icon {
          width: var(--ds-chip-icon-size);
          height: var(--ds-chip-icon-size);
          margin-left: -4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .leading-icon.material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-chip-icon-size);
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
        }

        .avatar {
          width: var(--ds-chip-avatar-size);
          height: var(--ds-chip-avatar-size);
          border-radius: 50%;
          margin-left: -8px;
          object-fit: cover;
        }

        /* Checkmark for selected filter chips */
        .checkmark {
          width: var(--ds-chip-icon-size);
          height: var(--ds-chip-icon-size);
          margin-left: -4px;
        }

        .checkmark svg {
          width: var(--ds-chip-icon-size);
          height: var(--ds-chip-icon-size);
          fill: var(--md-sys-color-on-secondary-container);
        }

        /* Label */
        .label {
          white-space: nowrap;
        }

        /* Remove button for input chips */
        .remove-btn {
          width: var(--ds-chip-remove-size);
          height: var(--ds-chip-remove-size);
          margin-right: -4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        .remove-btn:hover {
          background-color: rgba(var(--md-sys-color-on-surface-variant-rgb, 73, 69, 79), 0.12);
        }

        .remove-btn svg {
          width: var(--ds-chip-remove-size);
          height: var(--ds-chip-remove-size);
          fill: var(--md-sys-color-on-surface-variant);
        }

        :host([selected]) .remove-btn svg {
          fill: var(--md-sys-color-on-secondary-container);
        }
      </style>

      <div class="chip">
        ${
          showLeadingIcon
            ? avatar
              ? `<img src="${avatar}" alt="" class="avatar">`
              : variant === "filter" && selected
                ? `<span class="checkmark">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>`
                : icon
                  ? `<span class="leading-icon material-symbols-outlined">${icon}</span>`
                  : ""
            : ""
        }
        <span class="label">${label}</span>
        ${
          showRemoveButton
            ? `
          <button class="remove-btn" aria-label="Remove ${label}" tabindex="-1">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        `
            : ""
        }
      </div>
    `;
  }
}

customElements.define("ds-chip", DSChip);
