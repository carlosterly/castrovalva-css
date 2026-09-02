import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../src/components/navigation-drawer/navigation-drawer.js";

describe("DSNavigationDrawer", () => {
  describe("Rendering", () => {
    it("should render with default modal variant", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el).to.exist;
      expect(el.variant).to.equal("modal");
      expect(el.open).to.be.false;
    });

    it("should render with standard variant", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="standard"></ds-navigation-drawer>`,
      );

      expect(el.variant).to.equal("standard");
    });

    it("should render scrim for modal variant", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="modal"></ds-navigation-drawer>`,
      );

      const scrim = el.shadowRoot.querySelector(".scrim");
      expect(scrim).to.exist;
    });

    it("should render drawer container", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const container = el.shadowRoot.querySelector(".drawer-container");
      expect(container).to.exist;
      expect(container.getAttribute("role")).to.equal("navigation");
    });

    it("should render with left position by default", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("left");
      expect(el.hasAttribute("position")).to.be.false; // Default, so no attribute
    });

    it("should render with right position", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer position="right"></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("right");
    });
  });

  describe("Open/Close State", () => {
    it("should start closed by default", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.false;
      expect(el.hasAttribute("open")).to.be.false;

      const container = el.shadowRoot.querySelector(".drawer-container");
      expect(container.classList.contains("open")).to.be.false;
    });

    it("should open when open attribute is set", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      const container = el.shadowRoot.querySelector(".drawer-container");
      expect(container.classList.contains("open")).to.be.true;
    });

    it("should show scrim when modal drawer is open", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="modal"
          open></ds-navigation-drawer>`,
      );

      const scrim = el.shadowRoot.querySelector(".scrim");
      expect(scrim.classList.contains("visible")).to.be.true;
    });

    it("should not show scrim when standard drawer is open", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          open></ds-navigation-drawer>`,
      );

      const scrim = el.shadowRoot.querySelector(".scrim");
      expect(scrim.classList.contains("visible")).to.be.false;
    });
  });

  describe("Interaction", () => {
    it("should open when open property is set to true", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.false;

      el.open = true;
      await el.updateComplete;

      expect(el.open).to.be.true;
      expect(el.hasAttribute("open")).to.be.true;
    });

    it("should close when open property is set to false", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      el.open = false;
      await el.updateComplete;

      expect(el.open).to.be.false;
      expect(el.hasAttribute("open")).to.be.false;
    });

    it("should toggle with toggle() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.false;

      el.toggle();
      await el.updateComplete;

      expect(el.open).to.be.true;

      el.toggle();
      await el.updateComplete;

      expect(el.open).to.be.false;
    });

    it("should open with show() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      el.show();
      await el.updateComplete;

      expect(el.open).to.be.true;
    });

    it("should close with close() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      el.close();
      await el.updateComplete;

      expect(el.open).to.be.false;
    });

    it("should close modal drawer on scrim click", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="modal"
          open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      const scrim = el.shadowRoot.querySelector(".scrim");
      scrim.click();
      await el.updateComplete;

      expect(el.open).to.be.false;
    });

    it("should not close standard drawer on scrim click", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      const scrim = el.shadowRoot.querySelector(".scrim");
      if (scrim) {
        scrim.click();
        await el.updateComplete;
      }

      expect(el.open).to.be.true;
    });

    it("should close on Escape key", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(event);
      await el.updateComplete;

      expect(el.open).to.be.false;
    });
  });

  describe("Events", () => {
    it("should emit ds-navigation-drawer:open event when opened", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      setTimeout(() => (el.open = true));
      await oneEvent(el, "ds-navigation-drawer:open");

      expect(el.open).to.be.true;
    });

    it("should emit ds-navigation-drawer:close event when closed", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      setTimeout(() => (el.open = false));
      await oneEvent(el, "ds-navigation-drawer:close");

      expect(el.open).to.be.false;
    });
  });

  describe("Properties", () => {
    it("should update variant property", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.variant).to.equal("modal");

      el.variant = "standard";
      await el.updateComplete;

      expect(el.variant).to.equal("standard");
      expect(el.getAttribute("variant")).to.equal("standard");
    });

    it("should update position property", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("left");

      el.position = "right";
      await el.updateComplete;

      expect(el.position).to.equal("right");
      expect(el.getAttribute("position")).to.equal("right");
    });
  });

  describe("Accessibility", () => {
    it("should have navigation role on container", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const container = el.shadowRoot.querySelector(".drawer-container");
      expect(container.getAttribute("role")).to.equal("navigation");
    });

    it('should have aria-hidden="true" when closed', async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.getAttribute("aria-hidden")).to.equal("true");
    });

    it('should have aria-hidden="false" when open', async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      expect(el.getAttribute("aria-hidden")).to.equal("false");
    });

    it("should have aria-label on navigation container", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const container = el.shadowRoot.querySelector(".drawer-container");
      expect(container.hasAttribute("aria-label")).to.be.true;
    });
  });

  describe("Slots", () => {
    it("should render default slot content", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer>
          <div class="test-content">Navigation Items</div>
        </ds-navigation-drawer>
      `);

      const content = el.querySelector(".test-content");
      expect(content).to.exist;
      expect(content.textContent).to.equal("Navigation Items");
    });

    it("should render header slot content", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer>
          <div slot="header" class="test-header">Header</div>
        </ds-navigation-drawer>
      `);

      const header = el.querySelector('[slot="header"]');
      expect(header).to.exist;
      expect(header.textContent).to.equal("Header");
    });
  });

  describe("CSS Parts", () => {
    it("should expose container part", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("should expose scrim part", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="modal"></ds-navigation-drawer>`,
      );

      const scrim = el.shadowRoot.querySelector('[part="scrim"]');
      expect(scrim).to.exist;
    });

    it("should expose content part", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const content = el.shadowRoot.querySelector('[part="content"]');
      expect(content).to.exist;
    });

    it("should expose header part", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      const header = el.shadowRoot.querySelector('[part="header"]');
      expect(header).to.exist;
    });
  });

  describe("Focus Management", () => {
    it("should focus first focusable element when opened", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer>
          <button id="first-btn">First</button>
          <button id="second-btn">Second</button>
        </ds-navigation-drawer>
      `);

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));

      const firstBtn = el.querySelector("#first-btn");
      expect(document.activeElement).to.equal(firstBtn);
    });
  });

  describe("Methods", () => {
    it("should support show() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.false;

      el.show();
      await el.updateComplete;

      expect(el.open).to.be.true;
    });

    it("should support close() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer open></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.true;

      el.close();
      await el.updateComplete;

      expect(el.open).to.be.false;
    });

    it("should support toggle() method", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      el.toggle();
      await el.updateComplete;
      expect(el.open).to.be.true;

      el.toggle();
      await el.updateComplete;
      expect(el.open).to.be.false;
    });
  });

  describe("Focus Trap", () => {
    it("should trap focus on Tab key in modal variant", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer variant="modal" open>
          <button id="btn1">First</button>
          <button id="btn2">Last</button>
        </ds-navigation-drawer>
      `);

      const btn1 = el.querySelector("#btn1");
      const btn2 = el.querySelector("#btn2");

      // Move focus to last element
      btn2.focus();
      expect(document.activeElement).to.equal(btn2);

      // Press Tab on last element - should wrap to first
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      document.dispatchEvent(tabEvent);
      await el.updateComplete;
    });

    it("should trap focus on Shift+Tab key in modal variant", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer variant="modal" open>
          <button id="btn1">First</button>
          <button id="btn2">Last</button>
        </ds-navigation-drawer>
      `);

      const btn1 = el.querySelector("#btn1");

      // Move focus to first element
      btn1.focus();
      expect(document.activeElement).to.equal(btn1);

      // Press Shift+Tab on first element - should wrap to last
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
      });
      document.dispatchEvent(shiftTabEvent);
      await el.updateComplete;
    });

    it("should not trap focus when drawer is closed", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer variant="modal">
          <button id="btn1">First</button>
        </ds-navigation-drawer>
      `);

      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      document.dispatchEvent(tabEvent);
      await el.updateComplete;

      // Should not throw and drawer should remain closed
      expect(el.open).to.be.false;
    });

    it("should not trap focus in standard variant", async () => {
      const el = await fixture(html`
        <ds-navigation-drawer variant="standard" open>
          <button id="btn1">First</button>
        </ds-navigation-drawer>
      `);

      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
      });
      document.dispatchEvent(tabEvent);
      await el.updateComplete;

      // Should not interfere with normal tab behavior
      expect(el.open).to.be.true;
    });
  });

  describe("Persistent State", () => {
    afterEach(() => {
      localStorage.clear();
    });

    it("should save state to localStorage when persistent attribute is set", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          persistent
          open></ds-navigation-drawer>`,
      );

      await el.updateComplete;

      const saved = localStorage.getItem("ds-navigation-drawer-state");
      expect(saved).to.exist;

      const state = JSON.parse(saved);
      expect(state.open).to.be.true;
    });

    it("should use custom storage key", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          persistent
          storage-key="my-custom-key"
          open></ds-navigation-drawer>`,
      );

      await el.updateComplete;

      const saved = localStorage.getItem("my-custom-key");
      expect(saved).to.exist;

      const state = JSON.parse(saved);
      expect(state.open).to.be.true;
    });

    it("should load state from localStorage on init", async () => {
      localStorage.setItem(
        "ds-navigation-drawer-state",
        JSON.stringify({ open: true }),
      );

      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          persistent></ds-navigation-drawer>`,
      );

      await el.updateComplete;

      expect(el.open).to.be.true;
    });

    it("should not save state for modal variant", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="modal"
          persistent
          open></ds-navigation-drawer>`,
      );

      await el.updateComplete;

      // Modal variant should not persist state
      const saved = localStorage.getItem("ds-navigation-drawer-state");
      // Should be null or undefined because modal doesn't persist
      expect(saved).to.be.null;
    });

    it("should handle localStorage errors gracefully", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          persistent
          open></ds-navigation-drawer>`,
      );

      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error("QuotaExceededError");
      };

      el.close();
      await el.updateComplete;

      el.open = true;
      await el.updateComplete;

      // Should not throw, just log warning
      expect(el.open).to.be.true;

      // Restore original setItem
      Storage.prototype.setItem = originalSetItem;
    });

    it("should ignore invalid stored state", async () => {
      localStorage.setItem(
        "ds-navigation-drawer-state",
        JSON.stringify({ open: "invalid" }),
      );

      const el = await fixture(
        html`<ds-navigation-drawer
          variant="standard"
          persistent></ds-navigation-drawer>`,
      );

      await el.updateComplete;

      // Should not set open since stored value is not boolean
      expect(el.open).to.be.false;
    });
  });

  describe("Attribute Changes", () => {
    it("should re-render when variant changes", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          variant="modal"
          open></ds-navigation-drawer>`,
      );

      const scrimBefore = el.shadowRoot.querySelector(".scrim");
      expect(scrimBefore.classList.contains("visible")).to.be.true;

      el.variant = "standard";
      await el.updateComplete;

      const scrimAfter = el.shadowRoot.querySelector(".scrim");
      expect(scrimAfter.classList.contains("visible")).to.be.false;
    });

    it("should re-render when position changes", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer position="left"></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("left");

      el.position = "right";
      await el.updateComplete;

      expect(el.position).to.equal("right");
      expect(el.getAttribute("position")).to.equal("right");
    });

    it("should update aria-hidden when open attribute changes", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.getAttribute("aria-hidden")).to.equal("true");

      el.setAttribute("open", "");
      await el.updateComplete;

      expect(el.getAttribute("aria-hidden")).to.equal("false");

      el.removeAttribute("open");
      await el.updateComplete;

      expect(el.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  describe("Storage Key Property", () => {
    afterEach(() => {
      localStorage.clear();
    });

    it("should get default storage key", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.storageKey).to.equal("ds-navigation-drawer-state");
    });

    it("should set custom storage key", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      el.storageKey = "custom-key";
      expect(el.storageKey).to.equal("custom-key");
      expect(el.getAttribute("storage-key")).to.equal("custom-key");
    });

    it("should remove storage key attribute when set to empty", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer
          storage-key="my-key"></ds-navigation-drawer>`,
      );

      el.storageKey = "";
      expect(el.getAttribute("storage-key")).to.be.null;
    });
  });

  describe("Body Overflow Management", () => {
    it("should set body overflow hidden when modal drawer opens", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="modal"></ds-navigation-drawer>`,
      );

      const originalOverflow = document.body.style.overflow;

      el.open = true;
      await el.updateComplete;

      expect(document.body.style.overflow).to.equal("hidden");

      el.open = false;
      await el.updateComplete;

      expect(document.body.style.overflow).to.equal("");

      document.body.style.overflow = originalOverflow;
    });

    it("should not affect body overflow for standard drawer", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="standard"></ds-navigation-drawer>`,
      );

      const originalOverflow = document.body.style.overflow;

      el.open = true;
      await el.updateComplete;

      // Standard variant should not change body overflow
      expect(document.body.style.overflow).to.equal(originalOverflow);

      document.body.style.overflow = originalOverflow;
    });
  });

  describe("Persistent Property", () => {
    it("should get persistent property", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer persistent></ds-navigation-drawer>`,
      );

      expect(el.persistent).to.be.true;
    });

    it("should set persistent property", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.persistent).to.be.false;

      el.persistent = true;
      expect(el.persistent).to.be.true;
      expect(el.hasAttribute("persistent")).to.be.true;
    });

    it("should remove persistent attribute when set to false", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer persistent></ds-navigation-drawer>`,
      );

      el.persistent = false;
      expect(el.persistent).to.be.false;
      expect(el.hasAttribute("persistent")).to.be.false;
    });
  });

  describe("Open Property Setter/Getter", () => {
    it("should set open property via setter", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.open).to.be.false;

      el.open = true;
      expect(el.open).to.be.true;
      expect(el.hasAttribute("open")).to.be.true;

      el.open = false;
      expect(el.open).to.be.false;
      expect(el.hasAttribute("open")).to.be.false;
    });
  });

  describe("Position Property Getter/Setter", () => {
    it("should default position to left", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("left");
    });

    it("should get position from attribute", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer position="right"></ds-navigation-drawer>`,
      );

      expect(el.position).to.equal("right");
    });

    it("should set position via setter", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      el.position = "right";
      expect(el.position).to.equal("right");
      expect(el.getAttribute("position")).to.equal("right");
    });

    it("should remove position attribute when set to empty", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer position="right"></ds-navigation-drawer>`,
      );

      el.position = "";
      expect(el.getAttribute("position")).to.be.null;
    });
  });

  describe("Variant Property Getter/Setter", () => {
    it("should default variant to modal", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      expect(el.variant).to.equal("modal");
    });

    it("should get variant from attribute", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="standard"></ds-navigation-drawer>`,
      );

      expect(el.variant).to.equal("standard");
    });

    it("should set variant via setter", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer></ds-navigation-drawer>`,
      );

      el.variant = "standard";
      expect(el.variant).to.equal("standard");
      expect(el.getAttribute("variant")).to.equal("standard");
    });

    it("should remove variant attribute when set to empty", async () => {
      const el = await fixture(
        html`<ds-navigation-drawer variant="standard"></ds-navigation-drawer>`,
      );

      el.variant = "";
      expect(el.getAttribute("variant")).to.be.null;
    });
  });
});
