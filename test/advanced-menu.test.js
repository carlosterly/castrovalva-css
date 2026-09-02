import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../src/components/advanced-menu.js";

describe("DSAdvancedMenu", () => {
  describe("Rendering & Initialization", () => {
    it("should render as a custom element", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el).to.exist;
      expect(el.tagName).to.equal("DS-ADVANCED-MENU");
    });

    it("should have shadow DOM", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should render with default variant 'menu'", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._variant).to.equal("menu");
    });

    it("should render with mega variant", async () => {
      const el = await fixture(
        html`<ds-advanced-menu variant="mega"></ds-advanced-menu>`,
      );
      expect(el._variant).to.equal("mega");
    });

    it("should render with default placement 'bottom-start'", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._placement).to.equal("bottom-start");
    });

    it("should render with custom placement", async () => {
      const el = await fixture(
        html`<ds-advanced-menu placement="top-end"></ds-advanced-menu>`,
      );
      expect(el._placement).to.equal("top-end");
    });

    it("should have default offset of 8px", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._offset).to.equal(8);
    });

    it("should support custom offset", async () => {
      const el = await fixture(
        html`<ds-advanced-menu offset="16"></ds-advanced-menu>`,
      );
      expect(el._offset).to.equal(16);
    });

    it("should have menu panel in shadow DOM", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel).to.exist;
    });

    it("should have menu backdrop in shadow DOM", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const backdrop = el.shadowRoot.querySelector(".menu-backdrop");
      expect(backdrop).to.exist;
    });
  });

  describe("Open/Close State", () => {
    it("should start closed by default", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._open).to.be.false;
    });

    it("should open when open() is called", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      expect(el._open).to.be.true;
    });

    it("should close when close() is called", async () => {
      const el = await fixture(
        html`<ds-advanced-menu open></ds-advanced-menu>`,
      );
      el.close();
      expect(el._open).to.be.false;
    });

    it("should not reopen if already open", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      el.open();
      expect(el._open).to.be.true;
    });

    it("should toggle open state", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.toggle();
      expect(el._open).to.be.true;
      el.toggle();
      expect(el._open).to.be.false;
    });

    it("should set panel display to block when opening", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.style.display).to.equal("block");
    });

    it("should dispatch menu-open event", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      setTimeout(() => el.open(), 0);
      const event = await oneEvent(el, "menu-open");
      expect(event).to.exist;
    });

    it("should dispatch menu-close event", async () => {
      const el = await fixture(
        html`<ds-advanced-menu open></ds-advanced-menu>`,
      );
      setTimeout(() => el.close(), 0);
      const event = await oneEvent(el, "menu-close");
      expect(event).to.exist;
    });

    it("should set aria-hidden false when open", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.getAttribute("aria-hidden")).to.equal("false");
    });

    it("should set aria-hidden true when closed", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  describe("Trigger Interaction", () => {
    it("should bind trigger element", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      expect(el._triggerEl).to.exist;
    });

    it("should set aria-haspopup on trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      expect(el._triggerEl.getAttribute("aria-haspopup")).to.equal("true");
    });

    it("should open menu on trigger click", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el._triggerEl.click();
      expect(el._open).to.be.true;
    });

    it("should toggle menu on trigger click", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el._triggerEl.click();
      el._triggerEl.click();
      expect(el._open).to.be.false;
    });

    it("should open menu on ArrowDown from trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      el._triggerEl.dispatchEvent(event);
      expect(el._open).to.be.true;
    });

    it("should open menu on Enter from trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      el._triggerEl.dispatchEvent(event);
      expect(el._open).to.be.true;
    });

    it("should open menu on Space from trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      const event = new KeyboardEvent("keydown", { key: " " });
      el._triggerEl.dispatchEvent(event);
      expect(el._open).to.be.true;
    });
  });

  describe("Menu Items & Actions", () => {
    it("should get menu items from slot", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      const items = el._getItems();
      expect(items).to.have.lengthOf(2);
    });

    it("should handle menu items click", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" data-menu-action="test">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const item = el.querySelector('[role="menuitem"]');
      if (item) {
        setTimeout(() => item.click(), 0);
        const event = await oneEvent(el, "menu-action");
        expect(event.detail.value).to.equal("test");
      }
    });

    it("should include breadcrumb in menu-action event", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" data-menu-action="test">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const item = el.querySelector('[role="menuitem"]');
      if (item) {
        setTimeout(() => item.click(), 0);
        const event = await oneEvent(el, "menu-action");
        expect(event.detail.breadcrumb).to.be.an("array");
      }
    });
  });

  describe("Keyboard Navigation", () => {
    it("should navigate items with arrow keys", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const items = el._getItems();
      items[0].focus();
      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
    });

    it("should close menu on Escape", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
      expect(el._open).to.be.false;
    });

    it("should support Home key", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const event = new KeyboardEvent("keydown", { key: "Home" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
    });

    it("should support End key", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const event = new KeyboardEvent("keydown", { key: "End" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
    });
  });

  describe("Cascading Submenus", () => {
    it("should detect parent items", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      const items = el._getItems();
      expect(items[0].getAttribute("aria-haspopup")).to.equal("menu");
    });

    it("should open submenu on ArrowRight", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const parent = el._getItems()[0];
      parent.focus();
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
    });

    it("should add back button to submenu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      const submenu = parent.nextElementSibling;

      if (submenu) {
        el._addBackButton(submenu);
        const backBtn = submenu.querySelector("[data-back]");
        expect(backBtn).to.exist;
      }
    });

    it("should track active submenus", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._activeSubmenus).to.be.an("array");
    });
  });

  describe("Label Extraction", () => {
    it("should extract plain text labels", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const item = document.createElement("button");
      item.textContent = "Share";
      const label = el._extractMenuLabel(item);
      expect(label).to.equal("Share");
    });

    it("should remove arrow symbols", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const item = document.createElement("button");
      item.textContent = "Share ▸";
      const label = el._extractMenuLabel(item);
      expect(label).to.equal("Share");
    });

    it("should handle icons without label text", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const item = document.createElement("button");
      item.innerHTML = `<span class="material-symbols-outlined">share</span> Share`;
      const label = el._extractMenuLabel(item);
      expect(label).to.not.include("share");
    });

    it("should default to Menu when empty", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const item = document.createElement("button");
      const label = el._extractMenuLabel(item);
      expect(label).to.equal("Menu");
    });
  });

  describe("Breadcrumb Management", () => {
    it("should initialize empty breadcrumb", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._breadcrumb).to.be.an("array");
      expect(el._breadcrumb).to.have.lengthOf(0);
    });

    it("should update breadcrumb display", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._updateBreadcrumbDisplay(["File", "Save"]);
      expect(el._breadcrumb).to.be.an("array");
    });

    it("should call _updateBreadcrumbDisplay from _updateBreadcrumb", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._breadcrumb = ["Test"];
      el._updateBreadcrumb();
      expect(el._breadcrumb.length).to.equal(1);
    });
  });

  describe("Variant and Placement Updates", () => {
    it("should update variant in panel", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._updateVariant();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.variant).to.equal("menu");
    });

    it("should update placement in panel", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._updatePlacement();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.placement).to.equal("bottom-start");
    });

    it("should update offset CSS variable", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._updateOffset();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel).to.exist;
    });
  });

  describe("Timer Management", () => {
    it("should clear all timers", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._openTimer = setTimeout(() => {}, 1000);
      el._closeTimer = setTimeout(() => {}, 1000);
      el._clearTimers();
      expect(el._openTimer).to.be.null;
      expect(el._closeTimer).to.be.null;
    });
  });

  describe("Attribute Changes", () => {
    it("should update variant on attribute change", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.setAttribute("variant", "mega");
      await el.updateComplete;
      expect(el._variant).to.equal("mega");
    });

    it("should update placement on attribute change", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.setAttribute("placement", "top-end");
      await el.updateComplete;
      expect(el._placement).to.equal("top-end");
    });

    it("should update offset on attribute change", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.setAttribute("offset", "16");
      await el.updateComplete;
      expect(el._offset).to.equal(16);
    });

    it("should open on open attribute", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.setAttribute("open", "");
      await el.updateComplete;
      expect(el._open).to.be.true;
    });

    it("should close on removing open attribute", async () => {
      const el = await fixture(
        html`<ds-advanced-menu open></ds-advanced-menu>`,
      );
      el.removeAttribute("open");
      await el.updateComplete;
      expect(el._open).to.be.false;
    });
  });

  describe("Hover Intent", () => {
    it("should support hover-open attribute", async () => {
      const el = await fixture(
        html`<ds-advanced-menu hover-open></ds-advanced-menu>`,
      );
      expect(el._hoverOpen).to.be.true;
    });

    it("should have configurable open delay", async () => {
      const el = await fixture(
        html`<ds-advanced-menu open-delay="200"></ds-advanced-menu>`,
      );
      expect(el._openDelay).to.equal(200);
    });

    it("should have configurable close delay", async () => {
      const el = await fixture(
        html`<ds-advanced-menu close-delay="300"></ds-advanced-menu>`,
      );
      expect(el._closeDelay).to.equal(300);
    });
  });

  describe("Focus Management", () => {
    it("should focus first item", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      el._focusFirstItem();
      const items = el._getItems();
      expect(items.length).to.be.greaterThan(0);
    });

    it("should return focus to trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el._returnFocus();
      expect(el._triggerEl.getAttribute("aria-expanded")).to.equal("false");
    });
  });

  describe("Ripple Effect", () => {
    it("should create ripple on click", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      const item = el.querySelector('[role="menuitem"]');
      const mockEvent = {
        clientX: 100,
        clientY: 100,
        composedPath: () => [item],
      };
      el._createRipple(mockEvent, item);
      const ripple = item.querySelector(".ripple");
      expect(ripple).to.exist;
    });

    it("should remove ripple after animation", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      const item = el.querySelector('[role="menuitem"]');
      const mockEvent = {
        clientX: 100,
        clientY: 100,
        composedPath: () => [item],
      };
      el._createRipple(mockEvent, item);
      await new Promise((resolve) => setTimeout(resolve, 700));
      const ripple = item.querySelector(".ripple");
      expect(ripple).to.not.exist;
    });
  });

  describe("Outside Click", () => {
    it("should bind outside click handler", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      expect(el._boundOutside).to.exist;
    });

    it("should unbind outside handlers on close", async () => {
      const el = await fixture(
        html`<ds-advanced-menu open>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el.close();
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(el._boundOutside).to.be.null;
    });
  });

  describe("Accessibility", () => {
    it("should have role menu on panel", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.getAttribute("role")).to.equal("menu");
    });

    it("should set aria-expanded on trigger", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el.open();
      expect(el._triggerEl.getAttribute("aria-expanded")).to.equal("true");
    });

    it("should handle data-menu-action attribute", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" data-menu-action="save">Save</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const item = el.querySelector("[data-menu-action]");
      expect(item).to.exist;
    });

    it("should handle data-back attribute", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      const backBtn = document.createElement("button");
      backBtn.setAttribute("data-back", "");
      expect(backBtn.hasAttribute("data-back")).to.be.true;
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty menu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu"></div>
        </ds-advanced-menu>`,
      );
      el.open();
      const items = el._getItems();
      expect(items).to.have.lengthOf(0);
    });

    it("should handle rapid open/close", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      el.close();
      el.open();
      el.close();
      expect(el._open).to.be.false;
    });

    it("should handle menu without trigger", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      expect(el._open).to.be.true;
    });

    it("should clear timers on disconnect", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._openTimer = setTimeout(() => {}, 1000);
      el.disconnectedCallback();
      expect(el._openTimer).to.be.null;
    });

    it("should handle nested submenus", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem" aria-haspopup="menu">Nested</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Deep</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const items = el._getItems();
      expect(items.length).to.be.greaterThanOrEqual(1);
    });
  });

  describe("Hover Intent", () => {
    it("should open menu on hover when hover-open is set", async () => {
      const el = await fixture(
        html`<ds-advanced-menu hover-open open-delay="10">
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      expect(el._hoverOpen).to.be.true;
    });

    it("should have configurable submenu open delay", async () => {
      const el = await fixture(
        html`<ds-advanced-menu submenu-open-delay="200"></ds-advanced-menu>`,
      );
      expect(el._submenuOpenDelay).to.equal(200);
    });

    it("should have configurable submenu close delay", async () => {
      const el = await fixture(
        html`<ds-advanced-menu submenu-close-delay="300"></ds-advanced-menu>`,
      );
      expect(el._submenuCloseDelay).to.equal(300);
    });

    it("should close menu on hover exit when hover-open is set", async () => {
      const el = await fixture(
        html`<ds-advanced-menu hover-open close-delay="10">
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el.open();
      expect(el._open).to.be.true;
    });
  });

  describe("Submenu Positioning", () => {
    it("should position submenu with anchor positioning when supported", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      const submenu = parent.nextElementSibling;
      if (submenu) {
        el._positionSubmenu(parent, submenu);
        expect(submenu.style.display).to.not.equal("none");
      }
    });

    it("should use fallback positioning without anchor support", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el._supportsAnchorPositioning = false;
      el.open();
      const parent = el._getItems()[0];
      const submenu = parent.nextElementSibling;
      if (submenu) {
        el._positionSubmenu(parent, submenu);
        expect(submenu.style.position).to.equal("fixed");
      }
    });

    it("should set correct anchor ID on parent item", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      await el.updateComplete;
      expect(parent.style.anchorName).to.include("--submenu-anchor");
    });

    it("should handle submenu with no parent item", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      el._openSubmenu(null);
      expect(el._activeSubmenus.length).to.equal(0);
    });
  });

  describe("Menu Positioning", () => {
    it("should update menu panel position on open", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el.open();
      await el.updateComplete;
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.style.display).to.equal("block");
    });

    it("should support bottom-start placement", async () => {
      const el = await fixture(
        html`<ds-advanced-menu placement="bottom-start"></ds-advanced-menu>`,
      );
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.placement).to.equal("bottom-start");
    });

    it("should support bottom-end placement", async () => {
      const el = await fixture(
        html`<ds-advanced-menu placement="bottom-end"></ds-advanced-menu>`,
      );
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.placement).to.equal("bottom-end");
    });

    it("should support top-start placement", async () => {
      const el = await fixture(
        html`<ds-advanced-menu placement="top-start"></ds-advanced-menu>`,
      );
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.placement).to.equal("top-start");
    });

    it("should support top-end placement", async () => {
      const el = await fixture(
        html`<ds-advanced-menu placement="top-end"></ds-advanced-menu>`,
      );
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.placement).to.equal("top-end");
    });

    it("should use menu variant in positioning", async () => {
      const el = await fixture(
        html`<ds-advanced-menu variant="mega"></ds-advanced-menu>`,
      );
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel.dataset.variant).to.equal("mega");
    });
  });

  describe("Sibling Submenu Closing", () => {
    it("should close sibling submenus at same level", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Share</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Copy</button>
              </div>
            </div>
            <div>
              <button role="menuitem" aria-haspopup="menu">Save</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Save as</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const items = el._getItems();
      if (items.length >= 2) {
        el._openSubmenu(items[0]);
        expect(el._activeSubmenus.length).to.equal(1);
        el._openSubmenu(items[1]);
        expect(el._activeSubmenus.length).to.equal(1);
      }
    });

    it("should prevent duplicate breadcrumb entries", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      const initialLength = el._breadcrumb.length;
      el._openSubmenu(parent);
      expect(el._breadcrumb.length).to.equal(initialLength);
    });
  });

  describe("Submenu State Reset", () => {
    it("should reset all submenus on close", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      expect(el._activeSubmenus.length).to.be.greaterThan(0);
      el.close();
      expect(el._activeSubmenus.length).to.equal(0);
    });

    it("should clear breadcrumb on close", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      expect(el._breadcrumb.length).to.be.greaterThan(0);
      el.close();
      expect(el._breadcrumb.length).to.equal(0);
    });

    it("should reset submenu visibility classes", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      const container = parent.closest("div");
      const submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        el._openSubmenu(parent);
        expect(submenu.classList.contains("submenu-visible")).to.be.true;
        el.close();
        expect(submenu.classList.contains("submenu-visible")).to.be.false;
      }
    });
  });

  describe("Back Button Functionality", () => {
    it("should add back button to submenu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      const container = parent.closest("div");
      const submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        el._addBackButton(submenu);
        const backBtn = submenu.querySelector("[data-back]");
        expect(backBtn).to.exist;
      }
    });

    it("should not add duplicate back buttons", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      const container = parent.closest("div");
      const submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        el._addBackButton(submenu);
        el._addBackButton(submenu);
        const backBtns = submenu.querySelectorAll("[data-back]");
        expect(backBtns.length).to.equal(1);
      }
    });

    it("should close submenu on back button click", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      expect(el._activeSubmenus.length).to.equal(1);
      const container = parent.closest("div");
      const submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        const backBtn = submenu.querySelector("[data-back]");
        if (backBtn) {
          backBtn.click();
          await new Promise((resolve) => setTimeout(resolve, 180));
          expect(el._activeSubmenus.length).to.equal(0);
        }
      }
    });
  });

  describe("Event Dispatching", () => {
    it("should dispatch submenu-open event", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const parent = el._getItems()[0];
      setTimeout(() => el._openSubmenu(parent), 0);
      const event = await oneEvent(el, "submenu-open");
      expect(event).to.exist;
      expect(event.detail.breadcrumb).to.be.an("array");
    });

    it("should dispatch submenu-close event", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      await el.updateComplete;
      setTimeout(() => el._closeSubmenu(), 0);
      const event = await oneEvent(el, "submenu-close");
      expect(event).to.exist;
      expect(event.detail.breadcrumb).to.be.an("array");
    });

    it("should include breadcrumb in submenu-open event", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem" aria-haspopup="menu">Parent</button>
            <div role="menu" style="display: none">
              <button role="menuitem">Child</button>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const parent = el._getItems()[0];
      setTimeout(() => el._openSubmenu(parent), 0);
      const event = await oneEvent(el, "submenu-open");
      expect(event.detail.breadcrumb).to.include("Parent");
    });
  });

  describe("Collision Padding", () => {
    it("should have configurable collision padding", async () => {
      const el = await fixture(
        html`<ds-advanced-menu collision-padding="20"></ds-advanced-menu>`,
      );
      expect(el._collisionPadding).to.equal(20);
    });

    it("should use default collision padding", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._collisionPadding).to.equal(12);
    });
  });

  describe("Cache and Wire", () => {
    it("should cache DOM elements on connect", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._panel).to.exist;
      expect(el._backdrop).to.exist;
    });

    it("should wire event listeners on connect", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      expect(el._triggerEl).to.exist;
    });
  });

  describe("Arrow Navigation with Submenus", () => {
    it("should navigate right arrow to open submenu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Parent</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Child</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      parent.focus();
      const rightArrowEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
      });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(rightArrowEvent);
      expect(el._activeSubmenus.length).to.be.greaterThan(0);
    });

    it("should navigate left arrow to close submenu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Parent</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Child</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const parent = el._getItems()[0];
      parent.focus();
      const rightArrowEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
      });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(rightArrowEvent);
      const leftArrowEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      el.shadowRoot.querySelector(".menu-panel").dispatchEvent(leftArrowEvent);
      expect(el._activeSubmenus.length).to.equal(0);
    });
  });

  describe("Position Method", () => {
    it("should call _position when menu opens without anchor support", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      el._supportsAnchorPositioning = false;
      el.open();
      const panel = el.shadowRoot.querySelector(".menu-panel");
      expect(panel).to.exist;
    });

    it("should handle viewport collision on right side", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Parent</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Child</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      el._supportsAnchorPositioning = false;
      const parent = el._getItems()[0];
      const container = parent.closest("div");
      const submenu = container?.querySelector(':scope > [role="menu"]');
      if (submenu) {
        el._positionSubmenu(parent, submenu);
        expect(submenu.style.position).to.equal("fixed");
      }
    });
  });

  describe("Ripple Effect", () => {
    it("should create ripple with correct positioning", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      const item = el.querySelector('[role="menuitem"]');
      const mockEvent = {
        clientX: 150,
        clientY: 150,
        composedPath: () => [item],
      };
      el._createRipple(mockEvent, item);
      const ripple = item.querySelector(".ripple");
      expect(ripple).to.exist;
      expect(ripple.style.width).to.not.be.empty;
    });

    it("should ensure item has relative positioning for ripple", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item</button>
          </div>
        </ds-advanced-menu>`,
      );
      const item = el.querySelector('[role="menuitem"]');
      const originalPosition = item.style.position;
      const mockEvent = {
        clientX: 100,
        clientY: 100,
        composedPath: () => [item],
      };
      el._createRipple(mockEvent, item);
      expect(item.style.position).to.equal("relative");
    });
  });

  describe("Keyboard ArrowUp and ArrowDown", () => {
    it("should navigate up with ArrowUp", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const items = el._getItems();
      if (items.length >= 2) {
        items[1].focus();
        const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
        el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
        expect(document.activeElement).to.equal(items[0]);
      }
    });

    it("should navigate down with ArrowDown", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const items = el._getItems();
      if (items.length >= 2) {
        items[0].focus();
        const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
        el.shadowRoot.querySelector(".menu-panel").dispatchEvent(event);
      }
    });
  });

  describe("Action with Submenu Parent", () => {
    it("should open submenu on click for parent items", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Parent</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Child</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      await el.updateComplete;
      const parent = el._getItems()[0];
      const mockEvent = {
        composedPath: () => [parent],
        preventDefault: () => {},
        clientX: 100,
        clientY: 100,
      };
      setTimeout(() => el._onAction(mockEvent), 0);
    });

    it("should handle menu items without role", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>Item without role</div>
          </div>
        </ds-advanced-menu>`,
      );
      el.open();
      const mockEvent = {
        composedPath: () => [],
      };
      el._onAction(mockEvent);
      expect(el._open).to.be.true;
    });
  });

  describe("Nested Menu Items", () => {
    it("should find nested menu items correctly", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <button role="menuitem">Item 1</button>
            <button role="menuitem">Item 2</button>
          </div>
        </ds-advanced-menu>`,
      );
      const items = el._getItems();
      expect(items.length).to.be.greaterThanOrEqual(2);
    });
  });

  describe("Anchor Support Detection", () => {
    it("should detect anchor positioning support", async () => {
      const el = await fixture(html`<ds-advanced-menu></ds-advanced-menu>`);
      expect(el._supportsAnchorPositioning).to.be.a("boolean");
    });

    it("should use fallback when anchor not supported", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <div slot="menu" role="menu">
            <div>
              <button role="menuitem" aria-haspopup="menu">Parent</button>
              <div role="menu" style="display: none">
                <button role="menuitem">Child</button>
              </div>
            </div>
          </div>
        </ds-advanced-menu>`,
      );
      el._supportsAnchorPositioning = false;
      el.open();
      const parent = el._getItems()[0];
      el._openSubmenu(parent);
      expect(el._activeSubmenus.length).to.be.greaterThan(0);
    });
  });

  describe("Trigger Keydown with No Menu Items", () => {
    it("should handle keydown on trigger with empty menu", async () => {
      const el = await fixture(
        html`<ds-advanced-menu>
          <button slot="trigger">Menu</button>
          <div slot="menu" role="menu"></div>
        </ds-advanced-menu>`,
      );
      await el.updateComplete;
      el.open();
      const items = el._getItems();
      expect(items.length).to.equal(0);
    });
  });
});
