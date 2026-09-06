/**
 * DSAdvancedMenu - Mega & Cascading menu patterns built atop ds-menu content
 * Provides positioning, hover intent, and open/close orchestration.
 * Supports hierarchical submenus with breadcrumb navigation and smart positioning.
 */
export class DSAdvancedMenu extends HTMLElement {
  static get observedAttributes() {
    return ["open", "variant", "placement", "offset", "hover-open"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._open = false;
    // Defaults only. Attributes are read in connectedCallback - the custom
    // element spec does not guarantee they are present in the constructor.
    this._variant = "menu"; // menu | mega
    this._placement = "bottom-start";
    this._offset = 8;
    this._hoverOpen = false;
    this._openDelay = 120;
    this._closeDelay = 180;
    this._submenuOpenDelay = 120;
    this._submenuCloseDelay = 200;
    this._collisionPadding = 12;
    this._openTimer = null;
    this._closeTimer = null;
    this._boundOutside = null;
    this._triggerEl = null;
    this._panel = null;

    // Cascading menu state
    this._currentLevel = 0; // 0 = root, 1+ = submenu depth
    this._breadcrumb = []; // path through menu hierarchy
    this._submenus = new Map(); // parent item -> submenu panel mapping
    this._activeSubmenus = []; // currently visible submenus in order
    this._supportsAnchorPositioning =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("anchor-name: --ds-advanced-menu-trigger");
  }

  /**
   * Read configuration from attributes. Called on connect rather than in the
   * constructor, where the spec does not guarantee attributes are present.
   */
  _readAttributes() {
    this._variant = this.getAttribute("variant") || "menu"; // menu | mega
    this._placement = this.getAttribute("placement") || "bottom-start";
    this._offset = Number(this.getAttribute("offset")) || 8;
    this._hoverOpen = this.hasAttribute("hover-open");
    this._openDelay = Number(this.getAttribute("open-delay")) || 120;
    this._closeDelay = Number(this.getAttribute("close-delay")) || 180;
    this._submenuOpenDelay =
      Number(this.getAttribute("submenu-open-delay")) || 120;
    this._submenuCloseDelay =
      Number(this.getAttribute("submenu-close-delay")) || 200;
    this._collisionPadding = Number(
      this.getAttribute("collision-padding") || 12,
    );
  }

  connectedCallback() {
    this._readAttributes();
    this.render();
    this._cache();
    this._wire();
  }

  disconnectedCallback() {
    this._teardown();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    switch (name) {
      case "open":
        this.hasAttribute("open") ? this.open() : this.close();
        break;
      case "variant":
        this._variant = newVal || "menu";
        this._updateVariant();
        break;
      case "placement":
        this._placement = newVal || "bottom-start";
        this._updatePlacement();
        break;
      case "offset":
        this._offset = Number(newVal) || 8;
        this._updateOffset();
        break;
      case "hover-open":
        this._hoverOpen = this.hasAttribute("hover-open");
        break;
    }
  }

  get openState() {
    return this._open;
  }

  open() {
    if (this._open) return;
    this._clearTimers();
    this._open = true;
    this.setAttribute("open", "");
    this._panel?.classList.add("open");
    this._backdrop?.classList.add("open");
    this._panel?.style.setProperty("display", "block");
    this._backdrop?.style.setProperty("display", "block");
    this._panel?.setAttribute("aria-hidden", "false");
    this._updateOffset();
    this._updatePlacement();
    this._position();
    if (this._triggerEl) {
      this._triggerEl.setAttribute("aria-expanded", "true");
    }
    this._bindOutside();
    this.dispatchEvent(
      new CustomEvent("menu-open", {
        bubbles: true,
        composed: true,
        detail: { placement: this._placement },
      }),
    );
  }

  close(reason = "") {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute("open");
    this._panel?.classList.remove("open");
    this._backdrop?.classList.remove("open");
    if (this._triggerEl) {
      this._triggerEl.setAttribute("aria-expanded", "false");
    }

    // Reset all submenu state before closing
    this._resetSubmenus();

    setTimeout(() => {
      this._panel?.style.removeProperty("display");
      this._backdrop?.style.removeProperty("display");
    }, 150);
    this._unbindOutside();
    this._returnFocus();
    this.dispatchEvent(
      new CustomEvent("menu-close", {
        bubbles: true,
        composed: true,
        detail: { reason },
      }),
    );
  }

  toggle() {
    this._open ? this.close("toggle") : this.open();
  }

  _cache() {
    this._triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
    this._menuSlot = this.shadowRoot.querySelector('slot[name="menu"]');
    this._panel = this.shadowRoot.querySelector(".menu-panel");
    this._backdrop = this.shadowRoot.querySelector(".menu-backdrop");
    this._triggerEl = this._triggerSlot?.assignedElements({ flatten: true })[0];
  }

  _wire() {
    if (this._triggerSlot) {
      this._triggerSlot.addEventListener("slotchange", () => {
        this._triggerEl = this._triggerSlot.assignedElements({
          flatten: true,
        })[0];
        this._bindTrigger();
      });
    }
    this._bindTrigger();

    this._panel?.addEventListener("keydown", (e) => this._onKeydown(e));
    this._panel?.addEventListener("click", (e) => this._onAction(e));

    if (this._hoverOpen) {
      this._setupHoverIntent();
    }
  }

  _teardown() {
    this._unbindOutside();
    this._clearTimers();
    this._panel?.removeEventListener("keydown", this._onKeydown);
  }

  _bindTrigger() {
    if (!this._triggerEl) return;
    this._triggerEl.setAttribute("aria-haspopup", "true");
    this._triggerEl.setAttribute(
      "aria-expanded",
      this._open ? "true" : "false",
    );
    this._triggerEl.addEventListener("click", this._handleTriggerClick);
    this._triggerEl.addEventListener("keydown", this._handleTriggerKeydown);
  }

  _handleTriggerClick = (e) => {
    e.preventDefault();
    this._open ? this.close("trigger") : this.open();
  };

  _handleTriggerKeydown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.open();
      this._focusFirstItem();
    }
  };

  _setupHoverIntent() {
    if (!this._triggerEl || !this._panel) return;
    let lastPointer = null;
    const pointerMove = (e) => {
      lastPointer = { x: e.clientX, y: e.clientY };
    };
    const enter = () => {
      this._clearTimers();
      document.addEventListener("mousemove", pointerMove);
      this._openTimer = setTimeout(() => this.open(), this._openDelay);
    };
    const isNearElement = (x, y, el) => {
      const rect = el.getBoundingClientRect();
      const pad = 10;
      return (
        x >= rect.left - pad &&
        x <= rect.right + pad &&
        y >= rect.top - pad &&
        y <= rect.bottom + pad
      );
    };
    const leave = () => {
      this._clearTimers();
      this._closeTimer = setTimeout(() => {
        if (
          lastPointer &&
          (isNearElement(lastPointer.x, lastPointer.y, this._triggerEl) ||
            isNearElement(lastPointer.x, lastPointer.y, this._panel))
        ) {
          return;
        }
        document.removeEventListener("mousemove", pointerMove);
        this.close("hover-exit");
      }, this._closeDelay);
    };
    this._triggerEl.addEventListener("mouseenter", enter);
    this._triggerEl.addEventListener("mouseleave", leave);
    this._panel.addEventListener("mouseenter", () => this._clearTimers());
    this._panel.addEventListener("mouseleave", leave);
  }

  _clearTimers() {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  _resetSubmenus() {
    // Close all open submenus and reset state
    while (this._activeSubmenus.length > 0) {
      const submenu = this._activeSubmenus.pop();
      submenu.classList.remove("submenu-visible");
      submenu.setAttribute("aria-hidden", "true");
      submenu.style.display = "none";

      // Find and reset the parent item styling
      const parentItem = Array.from(this._submenus.entries()).find(
        ([_, sm]) => sm === submenu,
      )?.[0];

      if (parentItem) {
        parentItem.setAttribute("aria-expanded", "false");
        parentItem.classList.remove("submenu-open");
      }
    }

    // Reset breadcrumb
    this._breadcrumb = [];
    this._updateBreadcrumb();
  }

  _bindOutside() {
    if (this._boundOutside) return;
    this._boundOutside = (e) => {
      if (!this.contains(e.target)) {
        this.close("outside-click");
      }
    };
    document.addEventListener("mousedown", this._boundOutside);
    document.addEventListener("touchstart", this._boundOutside, {
      passive: true,
    });
    window.addEventListener("resize", this._position);
    window.addEventListener("scroll", this._position, true);
  }

  _unbindOutside() {
    if (!this._boundOutside) return;
    document.removeEventListener("mousedown", this._boundOutside);
    document.removeEventListener("touchstart", this._boundOutside);
    window.removeEventListener("resize", this._position);
    window.removeEventListener("scroll", this._position, true);
    this._boundOutside = null;
  }

  _onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (this._activeSubmenus.length > 0) {
        // Close the most recent submenu instead of whole menu
        this._closeSubmenu();
      } else {
        this.close("escape");
      }
      return;
    }
    // basic roving focus within menu items
    const items = this._getItems();
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[(currentIndex + 1 + items.length) % items.length];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const currentItem = document.activeElement;
      if (currentItem?.getAttribute("aria-haspopup") === "menu") {
        this._openSubmenu(currentItem);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (this._activeSubmenus.length > 0) {
        this._closeSubmenu();
      }
    }
  }

  _onAction(e) {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const item = path.find(
      (node) =>
        node?.getAttribute &&
        (node.getAttribute("role") === "menuitem" ||
          node.hasAttribute("data-menu-action") ||
          node.hasAttribute("data-back")),
    );
    if (!item) return;

    // Handle back button in submenu
    if (item.hasAttribute("data-back")) {
      e.preventDefault();
      this._createRipple(e, item);
      setTimeout(() => this._closeSubmenu(), 150);
      return;
    }

    // Handle submenu parent items
    if (
      item.getAttribute("aria-haspopup") === "menu" &&
      !item.hasAttribute("data-menu-action")
    ) {
      e.preventDefault();
      this._createRipple(e, item);
      setTimeout(() => this._openSubmenu(item), 150);
      return;
    }

    // Create ripple effect at click location
    this._createRipple(e, item);

    const value =
      item.getAttribute("data-menu-action") || item.textContent?.trim();
    this.dispatchEvent(
      new CustomEvent("menu-action", {
        bubbles: true,
        composed: true,
        detail: { value, breadcrumb: this._breadcrumb },
      }),
    );

    // Delay close to allow ripple animation to complete
    setTimeout(() => this.close("action"), 150);
  }

  _focusFirstItem() {
    const items = this._getItems();
    items[0]?.focus();
  }

  _getItems() {
    const menuNodes = this._menuSlot?.assignedElements({ flatten: true }) || [];
    const items = [];
    menuNodes.forEach((node) => {
      if (node.getAttribute && node.getAttribute("role") === "menuitem") {
        items.push(node);
      }
      node
        .querySelectorAll?.("[role='menuitem']")
        .forEach((child) => items.push(child));
    });
    return items;
  }

  _returnFocus() {
    if (this._triggerEl?.focus) {
      this._triggerEl.focus();
      this._triggerEl.setAttribute("aria-expanded", "false");
    }
  }

  _createRipple(event, item) {
    const ripple = document.createElement("span");
    const rect = item.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");
    ripple.style.position = "absolute";

    // Ensure item has position: relative for ripple positioning
    const originalPosition = item.style.position;
    if (!originalPosition || originalPosition === "static") {
      item.style.position = "relative";
      item.style.overflow = "hidden";
    }

    item.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  _openSubmenu(parentItem) {
    if (!parentItem) return;

    // Find or create the submenu panel for this item
    let submenu = this._submenus.get(parentItem);
    if (!submenu) {
      // Find the submenu in the DOM (next sibling .submenu or role=menu div)
      let container = parentItem.closest("div");
      submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        this._submenus.set(parentItem, submenu);
      }
    }

    if (!submenu) return;

    // Check if submenu is already open to prevent duplicate breadcrumb entries
    const isAlreadyOpen = this._activeSubmenus.includes(submenu);

    // Close any sibling submenus (same level) before opening this one
    if (!isAlreadyOpen) {
      // Find the parent menu that contains this submenu's parent item
      const parentMenu = parentItem.closest('[role="menu"]');

      if (parentMenu) {
        // Find all sibling divs within the same parent menu that contain submenus
        const siblingWrappers = Array.from(
          parentMenu.querySelectorAll(":scope > div"),
        );

        siblingWrappers.forEach((wrapper) => {
          // Skip the current item's wrapper
          if (wrapper === parentItem.closest("div")) return;

          // Find submenu within this wrapper
          const siblingSubmenu = wrapper.querySelector(
            ':scope > [role="menu"]',
          );

          if (siblingSubmenu && this._activeSubmenus.includes(siblingSubmenu)) {
            // Close this sibling submenu
            const idx = this._activeSubmenus.indexOf(siblingSubmenu);
            if (idx > -1) {
              this._activeSubmenus.splice(idx, 1);
            }

            siblingSubmenu.classList.remove("submenu-visible");
            siblingSubmenu.setAttribute("aria-hidden", "true");
            siblingSubmenu.style.display = "none";

            // Update parent item styling for the sibling
            const siblingParent = Array.from(this._submenus.entries()).find(
              ([_, sm]) => sm === siblingSubmenu,
            )?.[0];

            if (siblingParent) {
              siblingParent.setAttribute("aria-expanded", "false");
              siblingParent.classList.remove("submenu-open");
            }

            // Remove from breadcrumb if present
            const siblingLabel = siblingParent
              ? this._extractMenuLabel(siblingParent)
              : null;
            const breadcrumbIdx = this._breadcrumb.indexOf(siblingLabel);
            if (breadcrumbIdx > -1) {
              this._breadcrumb.splice(breadcrumbIdx, 1);
            }
          }
        });
      }
    }

    // Generate unique anchor name for this parent item
    const anchorId = `submenu-anchor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    parentItem.style.anchorName = `--${anchorId}`;
    submenu.dataset.anchorId = anchorId;

    // Update parent item styling
    parentItem.setAttribute("aria-expanded", "true");
    parentItem.classList.add("submenu-open");

    // Show submenu
    submenu.classList.add("submenu-visible");
    submenu.setAttribute("aria-hidden", "false");

    // Add to active list
    if (!isAlreadyOpen) {
      this._activeSubmenus.push(submenu);
    }

    // Add back button if not already present
    if (!submenu.querySelector("[data-back]")) {
      this._addBackButton(submenu);
    }

    // Update breadcrumb only if submenu wasn't already open
    if (!isAlreadyOpen) {
      const label = this._extractMenuLabel(parentItem);
      this._breadcrumb.push(label);
      this._updateBreadcrumb();
    }

    // Position submenu relative to parent
    this._positionSubmenu(parentItem, submenu);

    this.dispatchEvent(
      new CustomEvent("submenu-open", {
        bubbles: true,
        composed: true,
        detail: { item: parentItem, breadcrumb: this._breadcrumb },
      }),
    );
  }

  _closeSubmenu() {
    if (this._activeSubmenus.length === 0) return;

    const submenu = this._activeSubmenus.pop();
    submenu.classList.remove("submenu-visible");
    submenu.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      submenu.style.display = "none";
    }, 150);

    // Update parent item styling
    const parentItem = Array.from(this._submenus.entries()).find(
      ([_, sm]) => sm === submenu,
    )?.[0];

    if (parentItem) {
      parentItem.setAttribute("aria-expanded", "false");
      parentItem.classList.remove("submenu-open");
    }

    // Update breadcrumb
    this._breadcrumb.pop();
    this._updateBreadcrumb();

    this.dispatchEvent(
      new CustomEvent("submenu-close", {
        bubbles: true,
        composed: true,
        detail: { breadcrumb: this._breadcrumb },
      }),
    );
  }

  _addBackButton(submenu) {
    if (submenu.querySelector("[data-back]")) {
      return;
    }

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.role = "menuitem";
    backBtn.setAttribute("data-back", "");
    backBtn.innerHTML = "<span class=\"material-symbols-outlined\" style=\"font-size: 18px;\">arrow_back</span> Back";
    backBtn.style.cssText = `
      display: flex;
      align-items: center;
      gap: var(--ds-space-2);
      padding: 8px 12px;
      width: 100%;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      border-radius: var(--ds-radius-sm);
      font-family: inherit;
      font-size: inherit;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      margin-bottom: var(--ds-space-2);
    `;

    submenu.insertBefore(backBtn, submenu.firstChild);
  }

  _updateBreadcrumb() {
    if (this._breadcrumb.length === 0) {
      this._updateBreadcrumbDisplay(null);
      return;
    }
    this._updateBreadcrumbDisplay(this._breadcrumb);
  }

  _updateBreadcrumbDisplay(breadcrumb) {
    let breadcrumbEl = this._panel?.querySelector(".menu-breadcrumb");
    if (!breadcrumbEl && breadcrumb && breadcrumb.length > 0) {
      breadcrumbEl = document.createElement("div");
      breadcrumbEl.className = "menu-breadcrumb";
      this._panel?.insertBefore(breadcrumbEl, this._panel.firstChild);
    }

    if (breadcrumbEl) {
      if (breadcrumb && breadcrumb.length > 0) {
        breadcrumbEl.innerHTML = breadcrumb
          .map((item, idx) => `<span class="breadcrumb-item">${item}</span>`)
          .join('<span class="breadcrumb-sep"> / </span>');
        breadcrumbEl.style.display = "block";
      } else {
        breadcrumbEl.style.display = "none";
      }
    }
  }

  _extractMenuLabel(item) {
    // Extract only the text label, excluding Material Symbols icon names
    // Look for text nodes and text elements that aren't icons
    let label = "";

    for (const node of item.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text && !text.match(/^[▸→]$/)) {
          label += text;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip Material Symbols icons
        if (!node.classList.contains("material-symbols-outlined")) {
          const text = node.textContent?.trim() || "";
          // Filter out Material Symbols icon names (they're usually single lowercase words in span)
          if (node.tagName === "SPAN" && text.match(/^[a-z_]+$/)) {
            continue;
          }
          label += text;
        }
      }
    }

    return (
      label
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\s*[▸→]\s*$/g, "") || "Menu"
    );
  }

  _positionSubmenu(parentItem, submenu) {
    const anchorId = submenu.dataset.anchorId;

    // Always remove any existing inline display:none from HTML
    submenu.style.removeProperty("display");

    if (this._supportsAnchorPositioning && anchorId) {
      // Use CSS anchor positioning with 8px gaps
      submenu.style.cssText = `
        display: grid;
        gap: 6px;
        position: absolute;
        position-anchor: --${anchorId};
        inset-inline-start: calc(anchor(right) + 8px);
        inset-block-start: calc(anchor(top) + 8px);
        min-width: 220px;
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: var(--ds-radius-md);
        box-shadow: var(--ds-shadow-3, 0px 8px 24px rgba(0,0,0,0.18));
        z-index: 1001;
        animation: submenu-slide-in 150ms ease-out;
      `;
    } else {
      // Fallback: fixed positioning with 8px gaps
      const rect = parentItem.getBoundingClientRect();

      const horizontalGap = 8;
      const verticalGap = 8;

      const submenuLeft = rect.right + horizontalGap;
      const submenuTop = rect.top + verticalGap;

      // Check for viewport collision on right side
      const vw = window.innerWidth;
      let left = submenuLeft;

      if (left + 240 > vw) {
        // Position to the left instead (with gap)
        left = rect.left - 240 - horizontalGap;
      }

      submenu.style.cssText = `
        display: grid;
        gap: 6px;
        position: fixed;
        left: ${left}px;
        top: ${submenuTop}px;
        min-width: 220px;
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: var(--ds-radius-md);
        box-shadow: var(--ds-shadow-3, 0px 8px 24px rgba(0,0,0,0.18));
        z-index: 1001;
        animation: submenu-slide-in 150ms ease-out;
      `;
    }
  }

  _updateVariant() {
    if (this._panel) {
      this._panel.dataset.variant = this._variant;
    }
  }

  _updatePlacement() {
    if (this._panel) {
      this._panel.dataset.placement = this._placement;
    }
  }

  _updateOffset() {
    if (this._panel) {
      this._panel.style.setProperty(
        "--ds-advanced-menu-offset",
        `${this._offset}px`,
      );
    }
  }

  _position = () => {
    if (this._supportsAnchorPositioning) return;
    if (!this._panel || !this._triggerEl) return;
    const rect = this._triggerEl.getBoundingClientRect();
    const panelRect = this._panel.getBoundingClientRect();
    const hostRect = this.getBoundingClientRect();
    const pad = this._collisionPadding;
    const offset = this._offset;

    let top = rect.bottom + offset;
    let left = rect.left;

    if (this._placement.startsWith("top")) {
      top = rect.top - panelRect.height - offset;
    }
    if (this._placement.endsWith("end")) {
      left = rect.right - panelRect.width;
    }

    // collision adjust
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (left + panelRect.width + pad > vw) {
      left = vw - panelRect.width - pad;
    }
    if (left < pad) left = pad;
    if (top + panelRect.height + pad > vh) {
      top = vh - panelRect.height - pad;
    }
    if (top < pad) top = pad;

    Object.assign(this._panel.style, {
      top: `${top - hostRect.top}px`,
      left: `${left - hostRect.left}px`,
    });
  };

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }
        .menu-backdrop {
          position: fixed;
          inset: 0;
          background: transparent;
          pointer-events: none;
          display: none;
          z-index: 999;
        }
        .menu-panel {
          position: absolute;
          position-anchor: --ds-advanced-menu-trigger;
          width: max-content;
          max-width: min(90vw, 720px);
          border-radius: var(--ds-radius-md);
          border: 1px solid var(--md-sys-color-outline-variant);
          box-shadow: var(--ds-shadow-3, 0px 8px 24px rgba(0,0,0,0.18));
          background: var(--md-sys-color-surface);
          padding: var(--ds-space-3);
          display: none;
          z-index: 1000;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 120ms ease, transform 120ms ease;
        }
        .menu-breadcrumb {
          display: none;
          font-size: 0.85rem;
          color: var(--md-sys-color-on-surface-variant);
          padding: 0 12px 12px 12px;
          margin: -8px -12px 8px -12px;
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .breadcrumb-item {
          display: inline-flex;
          align-items: center;
        }
        .breadcrumb-sep {
          color: var(--md-sys-color-outline-variant);
        }
        .menu-panel[data-placement="bottom-start"] {
          top: calc(anchor(bottom) + var(--ds-advanced-menu-offset, 8px));
          left: anchor(left);
        }
        .menu-panel[data-placement="bottom-end"] {
          top: calc(anchor(bottom) + var(--ds-advanced-menu-offset, 8px));
          left: calc(anchor(right) - 100%);
        }
        .menu-panel[data-placement="top-start"] {
          top: calc(anchor(top) - var(--ds-advanced-menu-offset, 8px));
          left: anchor(left);
          transform: translateY(-4px);
        }
        .menu-panel[data-placement="top-end"] {
          top: calc(anchor(top) - var(--ds-advanced-menu-offset, 8px));
          left: calc(anchor(right) - 100%);
          transform: translateY(-4px);
        }
        .menu-panel.open {
          opacity: 1;
          transform: translateY(0);
        }
        .menu-panel[data-variant="mega"] {
          padding: var(--ds-space-4);
        }
        ::slotted([slot="trigger"]) {
          cursor: pointer;
          anchor-name: --ds-advanced-menu-trigger;
        }
        ::slotted([role="menuitem"]) {
          display: flex;
          align-items: center;
          gap: var(--ds-space-2);
          padding: 8px 12px;
          border-radius: var(--ds-radius-sm);
          cursor: pointer;
          user-select: none;
          transition: background-color 120ms ease;
          position: relative;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
          width: 100%;
          text-align: left;
        }
        ::slotted([role="menuitem"][aria-haspopup="menu"]) {
          justify-content: space-between;
        }
        ::slotted([role="menuitem"]:hover) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
        }
        ::slotted([role="menuitem"]:active) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
        }
        ::slotted([role="menuitem"].submenu-open) {
          background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
          border-right: 3px solid var(--md-sys-color-primary);
          padding-right: 9px;
        }
        .ripple {
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.3;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes submenu-slide-in {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes menu-item-stagger {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
      <div class="menu-backdrop"></div>
      <slot name="trigger"></slot>
      <div class="menu-panel" role="menu" aria-hidden="true" data-variant="${this._variant}" data-placement="${this._placement}">
        <slot name="menu"></slot>
      </div>
    `;
  }
}

if (!customElements.get("ds-advanced-menu")) {
  customElements.define("ds-advanced-menu", DSAdvancedMenu);
}
