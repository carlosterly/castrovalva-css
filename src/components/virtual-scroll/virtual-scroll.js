/**
 * Virtual Scroll Component
 *
 * High-performance list rendering using virtual scrolling.
 * Only visible items are rendered to the DOM, dramatically improving performance
 * for large datasets.
 *
 * @tag ds-virtual-scroll
 * @slot default - Items to virtualize; should contain a template or list structure
 *
 * @example
 * ```html
 * <ds-virtual-scroll item-height="48">
 *   <template slot="item" let:item let:index>
 *     <div class="list-item" role="option">Item {{ index }}: {{ item.label }}</div>
 *   </template>
 *   <div slot="container"></div>
 * </ds-virtual-scroll>
 * ```
 */

export default class DSVirtualScroll extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._items = [];
    this._itemHeight = 48;
    this._scrollTop = 0;
    this._containerHeight = 0;
    this._startIdx = 0;
    this._endIdx = 0;
    this._renderQueue = [];
    this._scrollTimer = null;
    this._resizeObserver = null;
    this._mutationObserver = null;
    this._buffer = 5;
    this._rowTemplate = null;
    // rAF-coalesced scroll handling
    this._scrollRaf = null;
    this._pendingScrollTop = 0;
    // Suppress natural scroll handling briefly after programmatic scrolls
    this._suppressUntil = 0;
  }

  static get observedAttributes() {
    return ["item-height", "buffer", "scroll-offset"];
  }

  connectedCallback() {
    this._initializeSizingDefaults();
    this.render();
    this._cache();
    this._wire();
    this._applyInitialScrollOffset();
    this._updateVirtualRange();
  }

  disconnectedCallback() {
    this._teardown();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "item-height" && this._container) {
      this._itemHeight = parseInt(newVal, 10) || 48;
      this._updateVirtualRange();
    } else if (name === "buffer" && this._container) {
      this._buffer = parseInt(newVal, 10) || 5;
      this._updateVirtualRange();
    } else if (name === "scroll-offset" && this._scroller) {
      const offset = Math.max(0, parseInt(newVal, 10) || 0);
      this._scrollTop = offset;
      this._scroller.scrollTop = offset;
      this._updateVirtualRange();
    }
  }

  _initializeSizingDefaults() {
    const styles = getComputedStyle(this);
    const tokenHeight = parseInt(
      styles
        .getPropertyValue("--ds-virtual-scroll-item-height")
        .trim()
        .replace("px", ""),
      10,
    );

    this._itemHeight =
      Number.isFinite(tokenHeight) && tokenHeight > 0 ? tokenHeight : 48;
  }

  _applyInitialScrollOffset() {
    if (!this._scroller) return;
    const initialOffset = Math.max(
      0,
      parseInt(this.getAttribute("scroll-offset") || "0", 10) || 0,
    );
    this._scrollTop = initialOffset;
    this._scroller.scrollTop = initialOffset;
  }

  /**
   * Set items to render
   * @param {Array} items - Array of data items
   */
  setItems(items = []) {
    this._items = items;
    this._scrollTop = 0;
    if (this._scroller) {
      this._scroller.scrollTop = 0;
    }
    this._updateVirtualRange();
  }

  /**
   * Get currently visible items
   * @returns {Array} Items in the current viewport
   */
  getVisibleItems() {
    return this._items.slice(this._startIdx, this._endIdx);
  }

  /**
   * Scroll to a specific index
   * @param {number} index - Item index to scroll to
   * @param {string} align - 'start', 'center', 'end' (default: 'start')
   */
  scrollToIndex(index, align = "start") {
    if (!this._scroller || this._items.length === 0) return;

    const clampedIdx = Math.max(0, Math.min(index, this._items.length - 1));

    // Ensure container height is updated first
    this._updateContainerHeight();

    // If container height is still 0, component not ready
    if (this._containerHeight <= 0) {
      setTimeout(() => this.scrollToIndex(index, align), 100);
      return;
    }

    // Calculate scroll position: top of the item
    let scrollTop = clampedIdx * this._itemHeight;

    // Adjust based on alignment
    if (align === "center") {
      // Center the item in viewport
      scrollTop -= Math.max(
        0,
        this._containerHeight / 2 - this._itemHeight / 2,
      );
    } else if (align === "end") {
      // Position item at bottom of viewport
      scrollTop -= Math.max(0, this._containerHeight - this._itemHeight);
    }

    // Clamp to valid scroll range
    scrollTop = Math.max(0, scrollTop);
    const maxScroll = Math.max(
      0,
      this._items.length * this._itemHeight - this._containerHeight,
    );
    scrollTop = Math.min(scrollTop, maxScroll);

    // Set scroll position and let the natural scroll event fire
    this._scroller.scrollTop = scrollTop;
    // Suppress handling of immediate subsequent scroll events
    this._suppressUntil = performance.now() + 120;
  }

  /**
   * Focus an item by index
   * @param {number} index - Item index to focus
   */
  focusItem(index) {
    const targetIndex = Math.max(0, Math.min(index, this._items.length - 1));
    this.scrollToIndex(targetIndex, "center");

    // Focus immediately after scroll, since we already called _onScroll in scrollToIndex
    setTimeout(() => {
      if (targetIndex >= this._startIdx && targetIndex < this._endIdx) {
        const item = this._container?.children[targetIndex - this._startIdx];
        if (item instanceof HTMLElement) {
          item.focus();
        }
      }
    }, 0);
  }

  _cache() {
    this._scroller = this.shadowRoot.querySelector(".virtual-scroller");
    this._topSpacer = this.shadowRoot.querySelector(".spacer-top");
    this._bottomSpacer = this.shadowRoot.querySelector(".spacer-bottom");
    this._container = this.shadowRoot.querySelector(".items-container");
  }

  _wire() {
    if (!this._scroller) return;

    // Scroll event
    this._scroller.addEventListener("scroll", () => this._onScroll());

    // Resize observer for container
    this._resizeObserver = new ResizeObserver(() => {
      this._updateContainerHeight();
      this._updateVirtualRange();
    });
    this._resizeObserver.observe(this._scroller);

    // Keyboard navigation
    this._container.addEventListener("keydown", (e) => this._onKeydown(e));

    // Mutation observer for items slot
    const itemsSlot = this.shadowRoot.querySelector('slot[name="items"]');
    if (itemsSlot) {
      itemsSlot.addEventListener("slotchange", () => {
        const nodes = itemsSlot.assignedElements({ flatten: true });
        if (nodes.length > 0) {
          this._items = nodes;
          this._updateVirtualRange();
        }
      });
    }
  }

  _teardown() {
    if (this._scrollTimer) clearTimeout(this._scrollTimer);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._mutationObserver) this._mutationObserver.disconnect();
    if (this._scroller) {
      this._scroller.removeEventListener("scroll", this._onScroll);
    }
  }

  _updateContainerHeight() {
    if (this._scroller) {
      this._containerHeight = this._scroller.clientHeight;
    }
  }

  _onScroll() {
    if (!this._scroller) return;
    // Ignore scrolls that occur immediately after programmatic jumps
    if (performance.now() < this._suppressUntil) return;
    // Coalesce multiple scroll events into one per animation frame
    this._pendingScrollTop = this._scroller.scrollTop;
    if (this._scrollRaf) return;
    this._scrollRaf = requestAnimationFrame(() => {
      this._scrollTop = this._pendingScrollTop;
      this._updateVirtualRange();
      this._scrollRaf = null;
    });
  }

  _updateVirtualRange() {
    this._updateContainerHeight();

    // Calculate visible range
    this._startIdx = Math.max(
      0,
      Math.floor(this._scrollTop / this._itemHeight) - this._buffer,
    );
    this._endIdx = Math.min(
      this._items.length,
      Math.ceil((this._scrollTop + this._containerHeight) / this._itemHeight) +
        this._buffer,
    );

    // Update spacers and container
    const topOffsetY = this._startIdx * this._itemHeight;
    const bottomOffsetY = Math.max(
      0,
      (this._items.length - this._endIdx) * this._itemHeight,
    );

    if (this._topSpacer) {
      this._topSpacer.style.height = `${topOffsetY}px`;
    }
    if (this._bottomSpacer) {
      this._bottomSpacer.style.height = `${bottomOffsetY}px`;
    }
    if (this._container) {
      this._container.style.height = `${
        (this._endIdx - this._startIdx) * this._itemHeight
      }px`;
    }

    this._renderItems();

    this.dispatchEvent(
      new CustomEvent("scroll-change", {
        bubbles: true,
        composed: true,
        detail: {
          startIdx: this._startIdx,
          endIdx: this._endIdx,
          scrollTop: this._scrollTop,
          // Number of items actually rendered (includes buffer/overscan)
          visibleCount: this._endIdx - this._startIdx,
          // Number of fully visible rows within the viewport (excludes buffer)
          viewportCount: Math.floor(
            (this._containerHeight || 0) / this._itemHeight,
          ),
          totalCount: this._items.length,
        },
      }),
    );
  }

  _renderItems() {
    if (!this._container) return;

    // Clear container (keep only rendered items)
    const visibleRange = this._endIdx - this._startIdx;
    while (this._container.children.length > visibleRange) {
      this._container.removeChild(this._container.lastChild);
    }
    while (this._container.children.length < visibleRange) {
      const div = document.createElement("div");
      div.className = "virtual-item";
      this._container.appendChild(div);
    }

    // Update rendered items
    for (let i = 0; i < visibleRange; i++) {
      const globalIdx = this._startIdx + i;
      const itemEl = this._container.children[i];
      const item = this._items[globalIdx];

      if (!itemEl) continue;

      // Update item content
      itemEl.textContent = "";
      itemEl.setAttribute("data-index", globalIdx);
      itemEl.setAttribute("tabindex", "0");
      itemEl.style.height = `${this._itemHeight}px`;
      itemEl.style.overflow = "hidden";

      // Create item content
      const content = document.createElement("div");
      content.className = "item-content";
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.style.height = "100%";
      content.style.padding = "var(--ds-space-2)";

      if (typeof item === "string") {
        content.textContent = item;
      } else if (item instanceof HTMLElement) {
        content.appendChild(item.cloneNode(true));
      } else if (typeof item === "object") {
        const text = item.label || item.text || JSON.stringify(item);
        content.textContent = text;
      }

      itemEl.appendChild(content);
    }
  }

  _onKeydown(e) {
    const activeEl = this.shadowRoot.activeElement || document.activeElement;
    const currentIdx =
      parseInt(activeEl?.getAttribute?.("data-index"), 10) || 0;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.focusItem(Math.min(currentIdx + 1, this._items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        this.focusItem(Math.max(currentIdx - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        this.focusItem(0);
        break;
      case "End":
        e.preventDefault();
        this.focusItem(this._items.length - 1);
        break;
      case "PageDown": {
        e.preventDefault();
        const pageSize = Math.floor(this._containerHeight / this._itemHeight);
        this.focusItem(Math.min(currentIdx + pageSize, this._items.length - 1));
        break;
      }
      case "PageUp": {
        e.preventDefault();
        const pageUp = Math.floor(this._containerHeight / this._itemHeight);
        this.focusItem(Math.max(currentIdx - pageUp, 0));
        break;
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          --ds-virtual-scroll-item-height: var(--ds-size-control-lg, 48px);
          --ds-virtual-scroll-focus-width: var(--ds-focus-ring-width, 2px);
          --ds-virtual-scroll-focus-color: var(
            --ds-focus-ring-color,
            var(--md-sys-color-primary, #06f)
          );
        }

        .virtual-scroller {
          width: 100%;
          height: 100%;
          overflow: auto;
          position: relative;
          background: var(--md-sys-color-surface, #fff);
          border: 1px solid var(--md-sys-color-outline-variant, #ddd);
          border-radius: var(--ds-radius-md, 8px);
          overscroll-behavior: contain;
          overflow-anchor: none;
          scrollbar-gutter: stable both-edges;
        }

        .scroll-viewport {
          width: 100%;
          position: relative;
          overflow-anchor: none;
        }

        .spacer-top,
        .spacer-bottom {
          width: 100%;
          height: 0;
          flex-shrink: 0;
          pointer-events: none;
        }

        .items-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-anchor: none;
        }

        .virtual-item {
          width: 100%;
          border-bottom: 1px solid var(--md-sys-color-outline-variant, #eee);
          box-sizing: border-box;
          transition: background-color 150ms ease;
        }

        .virtual-item:hover {
          background: var(--md-sys-color-surface-variant, #f5f5f5);
        }

        .virtual-item:focus {
          outline: var(--ds-virtual-scroll-focus-width)
            solid var(--ds-virtual-scroll-focus-color);
          outline-offset: -2px;
          background: var(--md-sys-color-primary-container, #e8f0ff);
        }

        .virtual-item:last-child {
          border-bottom: none;
        }

        .item-content {
          width: 100%;
          box-sizing: border-box;
          font-family: var(--md-sys-typescale-body-medium-font-family, Roboto);
          font-size: var(--md-sys-typescale-body-medium-size, 14px);
          color: var(--md-sys-color-on-surface, #000);
        }

        ::slotted(*) {
          width: 100%;
        }
      </style>

      <div class="virtual-scroller">
        <div class="scroll-viewport">
          <div class="spacer-top"></div>
          <div class="items-container" role="listbox"></div>
          <div class="spacer-bottom"></div>
        </div>
      </div>
      <slot name="items" style="display: none;"></slot>
    `;
  }
}

customElements.define("ds-virtual-scroll", DSVirtualScroll);
