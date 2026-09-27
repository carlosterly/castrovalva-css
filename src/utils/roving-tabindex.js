/**
 * Roving tabindex for a group of destination items (navigation bar and
 * rail), where each item is a custom element whose focusable control lives
 * in its own shadow root.
 *
 * Only one item is in the tab order: the focused one while focus is inside
 * the group, otherwise the active one (or the first enabled one). Arrow keys,
 * Home and End move focus and skip disabled items; they do not select.
 * Selection stays with Enter/Space - manual activation, because selecting a
 * destination navigates, and arrowing past three destinations shouldn't
 * navigate three times.
 *
 * An item must provide a `tabStop` setter and a `focus()` that reaches its
 * inner control.
 *
 * @example
 * this._roving = new RovingTabindex(this, {
 *   itemTag: "ds-navigation-rail-item",
 *   orientation: "vertical",
 * });
 * // connectedCallback: this._roving.connect();
 * // disconnectedCallback: this._roving.disconnect();
 */
export class RovingTabindex {
  /**
   * @param {HTMLElement} host - The element whose light-DOM children are the items
   * @param {{ itemTag: string, orientation: "horizontal" | "vertical" }} options
   */
  constructor(host, { itemTag, orientation }) {
    this.host = host;
    this.itemTag = itemTag;
    this.orientation = orientation;
    this._onKeydown = this._onKeydown.bind(this);
    this._onFocusin = this._onFocusin.bind(this);
    this._onFocusout = this._onFocusout.bind(this);
    this._observer = new MutationObserver(() => this.sync(this._focusedItem()));
  }

  connect() {
    this.host.addEventListener("keydown", this._onKeydown);
    this.host.addEventListener("focusin", this._onFocusin);
    this.host.addEventListener("focusout", this._onFocusout);
    this._observer.observe(this.host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["active", "disabled"],
    });
    // Items may not be upgraded yet, and upgrading isn't a mutation
    customElements.whenDefined(this.itemTag).then(() => {
      if (this.host.isConnected) this.sync(this._focusedItem());
    });
    this.sync();
  }

  disconnect() {
    this.host.removeEventListener("keydown", this._onKeydown);
    this.host.removeEventListener("focusin", this._onFocusin);
    this.host.removeEventListener("focusout", this._onFocusout);
    this._observer.disconnect();
  }

  /** Upgraded items, in document order */
  items() {
    const ctor = customElements.get(this.itemTag);
    if (!ctor) return [];
    return [...this.host.querySelectorAll(this.itemTag)].filter(
      (item) => item instanceof ctor,
    );
  }

  /**
   * Put exactly one item in the tab order.
   * @param {HTMLElement} [focused] - The item holding focus, if any
   */
  sync(focused) {
    const items = this.items();
    const enabled = items.filter((item) => !item.disabled);
    const stop =
      focused ?? enabled.find((item) => item.active) ?? enabled[0];
    items.forEach((item) => {
      item.tabStop = item === stop;
    });
  }

  _focusedItem() {
    return this.items().find((item) => item.matches(":focus-within"));
  }

  _onFocusin(e) {
    const item = e.target.closest?.(this.itemTag);
    if (item) this.sync(item);
  }

  _onFocusout(e) {
    // Leaving the group: the next Tab back in lands on the active item
    if (!e.relatedTarget || !this.host.contains(e.relatedTarget)) {
      this.sync();
    }
  }

  _onKeydown(e) {
    const current = e.target.closest?.(this.itemTag);
    if (!current) return;

    const enabled = this.items().filter((item) => !item.disabled);
    const index = enabled.indexOf(current);
    if (index === -1 || enabled.length === 0) return;

    const rtl = getComputedStyle(this.host).direction === "rtl";
    const [prevKey, nextKey] =
      this.orientation === "vertical"
        ? ["ArrowUp", "ArrowDown"]
        : rtl
          ? ["ArrowRight", "ArrowLeft"]
          : ["ArrowLeft", "ArrowRight"];

    let next;
    switch (e.key) {
      case prevKey:
        next = enabled[(index - 1 + enabled.length) % enabled.length];
        break;
      case nextKey:
        next = enabled[(index + 1) % enabled.length];
        break;
      case "Home":
        next = enabled[0];
        break;
      case "End":
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }

    e.preventDefault();
    this.sync(next);
    next.focus();
  }
}
