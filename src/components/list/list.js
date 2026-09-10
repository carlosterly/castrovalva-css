/**
 * Material Design 3 List Component
 *
 * A continuous vertical list of text or images.
 *
 * @element ds-list
 *
 * @slot - List item elements (ds-list-item)
 *
 * @example
 * <ds-list>
 *   <ds-list-item headline="Item 1"></ds-list-item>
 *   <ds-list-item headline="Item 2" supporting-text="Description"></ds-list-item>
 * </ds-list>
 */
export class DSList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setAttribute("role", "list");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--md-sys-color-surface, #fff);
          color: var(--md-sys-color-on-surface, #000);
          box-sizing: border-box;
        }

        ::slotted(ds-list-item) {
          display: list-item;
          list-style: none;
        }

        slot {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }
}

/**
 * Material Design 3 List Item Component
 *
 * A single item in a list, supporting one, two, or three lines of text.
 *
 * @element ds-list-item
 *
 * @attr {string} variant - The variant: 'one-line' (default), 'two-line', or 'three-line'
 * @attr {string} headline - The primary text
 * @attr {string} supporting-text - The secondary text (for two/three-line variants)
 * @attr {string} trailing-text - Optional trailing text
 * @attr {boolean} selected - Whether the item is selected
 * @attr {boolean} disabled - Whether the item is disabled
 *
 * @slot leading - Leading element (icon, avatar, checkbox)
 * @slot trailing - Trailing element (icon button, switch, checkbox)
 *
 * @cssprop --ds-list-item-height - Height of one-line list items
 * @cssprop --ds-list-item-height-two-line - Height of two-line list items
 * @cssprop --ds-list-item-height-three-line - Height of three-line list items
 * @cssprop --ds-list-item-padding - Padding of the list item
 * @cssprop --ds-list-item-border-color - Divider color between items
 * @cssprop --ds-list-item-leading-size - Size of leading slot content
 *
 * @csspart container - The main item container
 * @csspart leading - The leading slot container
 * @csspart content - The content area
 * @csspart headline - The headline text
 * @csspart supporting-text - The supporting text
 * @csspart trailing - The trailing slot container
 *
 * @example
 * <ds-list-item headline="One line item"></ds-list-item>
 * <ds-list-item
 *   variant="two-line"
 *   headline="Two line item"
 *   supporting-text="Supporting text">
 * </ds-list-item>
 */
export class DSListItem extends HTMLElement {
  static get observedAttributes() {
    return [
      "variant",
      "headline",
      "supporting-text",
      "trailing-text",
      "selected",
      "disabled",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setAttribute("role", "listitem");
    this.updateAccessibility();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.updateAccessibility();
    }
  }

  setupEventListeners() {
    this.addEventListener("click", (_e) => {
      if (!this.disabled) {
        this.dispatchEvent(
          new CustomEvent("ds-list-item:click", {
            detail: { item: this },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });
  }

  updateAccessibility() {
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  /**
   * Get the list item variant
   * @returns {string} The variant: 'one-line', 'two-line', or 'three-line'
   */
  get variant() {
    const variant = this.getAttribute("variant");
    return ["one-line", "two-line", "three-line"].includes(variant)
      ? variant
      : "one-line";
  }

  /**
   * Set the list item variant
   * @param {string} value - The variant
   */
  set variant(value) {
    if (["one-line", "two-line", "three-line"].includes(value)) {
      this.setAttribute("variant", value);
    }
  }

  /**
   * Get the headline text
   * @returns {string|null} The headline
   */
  get headline() {
    return this.getAttribute("headline");
  }

  /**
   * Set the headline text
   * @param {string} value - The headline
   */
  set headline(value) {
    this.setAttribute("headline", value);
  }

  /**
   * Get the supporting text
   * @returns {string|null} The supporting text
   */
  get supportingText() {
    return this.getAttribute("supporting-text");
  }

  /**
   * Set the supporting text
   * @param {string} value - The supporting text
   */
  set supportingText(value) {
    this.setAttribute("supporting-text", value);
  }

  /**
   * Get the trailing text
   * @returns {string|null} The trailing text
   */
  get trailingText() {
    return this.getAttribute("trailing-text");
  }

  /**
   * Set the trailing text
   * @param {string} value - The trailing text
   */
  set trailingText(value) {
    this.setAttribute("trailing-text", value);
  }

  /**
   * Get the selected state
   * @returns {boolean} Whether the item is selected
   */
  get selected() {
    return this.hasAttribute("selected");
  }

  /**
   * Set the selected state
   * @param {boolean} value - Whether the item is selected
   */
  set selected(value) {
    if (value) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  }

  /**
   * Get the disabled state
   * @returns {boolean} Whether the item is disabled
   */
  get disabled() {
    return this.hasAttribute("disabled");
  }

  /**
   * Set the disabled state
   * @param {boolean} value - Whether the item is disabled
   */
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  render() {
    const variant = this.variant;
    const headline = this.headline || "";
    const supportingText = this.supportingText || "";
    const trailingText = this.trailingText || "";
    const isDisabled = this.disabled;
    // MD3 list items indent to 16px when there is no leading element; the
    // leading box + row gap otherwise reserve ~32px of empty space.
    const hasLeading = this.querySelector('[slot="leading"]') !== null;

    let contentClass = "one-line-content";

    if (variant === "two-line") {
      contentClass = "two-line-content";
    } else if (variant === "three-line") {
      contentClass = "three-line-content";
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          height: var(
            --ds-list-item-height,
            calc(var(--ds-size-control-lg, 48px) + 8px)
          );
          box-sizing: border-box;
          cursor: ${isDisabled ? "not-allowed" : "pointer"};
          background-color: var(--md-sys-color-surface, #fff);
          color: var(--md-sys-color-on-surface, #000);
          position: relative;
          border-bottom: 1px solid
            var(
              --ds-list-item-border-color,
              var(--md-sys-color-outline-variant, #e0e0e0)
            );
          opacity: ${isDisabled ? "0.38" : "1"};
        }

        :host([variant="two-line"]) {
          height: var(
            --ds-list-item-height-two-line,
            calc(var(--ds-size-control-lg, 48px) + 24px)
          );
        }

        :host([variant="three-line"]) {
          height: var(
            --ds-list-item-height-three-line,
            calc(var(--ds-size-control-lg, 48px) + 40px)
          );
        }

        :host(:hover:not([disabled])) {
          background-color: var(--md-sys-color-surface-variant, #f5f5f5);
        }

        :host([selected]) {
          background-color: var(--md-sys-color-surface-variant, #f5f5f5);
        }

        :host(:focus-within) {
          outline: none;
        }

        [part="container"] {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 16px;
          box-sizing: border-box;
          padding: var(--ds-list-item-padding, 8px 16px);
        }

        [part="leading"] {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        [part="container"].no-leading [part="leading"] {
          display: none;
        }

        [part="content"] {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .one-line-content {
          height: 24px;
        }

        .two-line-content {
          height: 40px;
          gap: 4px;
        }

        .three-line-content {
          height: 56px;
          gap: 4px;
        }

        [part="headline"] {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: var(--md-sys-color-on-surface, #000);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }

        [part="supporting-text"] {
          font-size: 12px;
          line-height: 16px;
          color: var(--md-sys-color-on-surface-variant, #666);
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .three-line-content [part="supporting-text"] {
          max-height: 32px;
          -webkit-line-clamp: 2;
        }

        [part="trailing"] {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 8px;
        }

        [part="trailing-text"] {
          font-size: 12px;
          color: var(--md-sys-color-on-surface-variant, #666);
          white-space: nowrap;
        }

        ::slotted([slot="leading"]) {
          width: var(--ds-list-item-leading-size, var(--ds-size-hit-area, 40px));
          height: var(
            --ds-list-item-leading-size,
            var(--ds-size-hit-area, 40px)
          );
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

      <div part="container" class="${hasLeading ? "" : "no-leading"}">
        <div part="leading">
          <slot name="leading"></slot>
        </div>

        <div part="content" class="${contentClass}">
          <span part="headline">${headline}</span>
          ${
            supportingText
              ? `<span part="supporting-text">${supportingText}</span>`
              : ""
          }
        </div>

        <div part="trailing">
          ${
            trailingText
              ? `<span part="trailing-text">${trailingText}</span>`
              : ""
          }
          <slot name="trailing"></slot>
        </div>
      </div>
    `;
  }
}

// Register the custom elements
customElements.define("ds-list", DSList);
customElements.define("ds-list-item", DSListItem);

export default DSList;
