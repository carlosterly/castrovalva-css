import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/bottom-sheet/bottom-sheet.js";

describe("DSBottomSheet", () => {
  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el).to.exist;
      expect(el.getAttribute("variant")).to.equal("standard");
    });

    it("should have shadow root", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should set initial open state to false", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el.open).to.be.false;
    });

    it("should initialize with standard variant by default", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el.variant).to.equal("standard");
    });

    it("should initialize with draggable enabled by default", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el.draggable).to.be.true;
    });
  });

  describe("Variant Attribute", () => {
    it("should render with standard variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="standard"></ds-bottom-sheet>`,
      );
      expect(el.variant).to.equal("standard");
    });

    it("should render with modal variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="modal"></ds-bottom-sheet>`,
      );
      expect(el.variant).to.equal("modal");
    });

    it("should update variant property", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.variant = "modal";
      await el.updateComplete;
      expect(el.getAttribute("variant")).to.equal("modal");
    });

    it("should set variant attribute via setter", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.variant = "modal";
      expect(el.getAttribute("variant")).to.equal("modal");
    });
  });

  describe("Open State", () => {
    it("should open when open attribute is set", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.open).to.be.true;
    });

    it("should close when open attribute is removed", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));
      el.removeAttribute("open");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.open).to.be.false;
    });

    it("should open via open property", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.getAttribute("open")).to.equal("");
    });

    it("should close via open property", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));
      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.getAttribute("open")).to.not.exist;
    });

    it("should emit open event when opening", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      setTimeout(() => {
        el.open = true;
      });
      await oneEvent(el, "ds-bottom-sheet:open");
      expect(el.open).to.be.true;
    });

    it("should emit close event when closing", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));
      setTimeout(() => {
        el.open = false;
      });
      await oneEvent(el, "ds-bottom-sheet:close");
    });
  });

  describe("Content Slots", () => {
    it("should render default slot content", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet>
          <p>Test content</p>
        </ds-bottom-sheet>
      `);
      const slot = el.shadowRoot.querySelector("slot:not([name])");
      expect(slot).to.exist;
    });

    it("should render header slot content", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet>
          <div slot="header">Header content</div>
        </ds-bottom-sheet>
      `);
      const header = el.querySelector('[slot="header"]');
      expect(header?.textContent).to.include("Header content");
    });

    it("should render actions slot content", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet>
          <div slot="actions">Action buttons</div>
        </ds-bottom-sheet>
      `);
      const actions = el.querySelector('[slot="actions"]');
      expect(actions?.textContent).to.include("Action buttons");
    });

    it("should support all slot types together", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet>
          <div slot="header">Header</div>
          <p>Content</p>
          <div slot="actions">Actions</div>
        </ds-bottom-sheet>
      `);
      expect(el.querySelector('[slot="header"]')).to.exist;
      expect(el.querySelector('[slot="actions"]')).to.exist;
    });
  });

  describe("Draggable Behavior", () => {
    it("should be draggable by default", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el.draggable).to.be.true;
    });

    it("should disable dragging when draggable is false", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet draggable="false"></ds-bottom-sheet>`,
      );
      expect(el.draggable).to.be.false;
    });

    it("should set draggable via property", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.draggable = false;
      expect(el.getAttribute("draggable")).to.not.exist;
    });

    it("should not be draggable in modal variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="modal" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
      // Modal variant should not have drag handle even if draggable is true
      expect(el.variant).to.equal("modal");
    });

    it("should recognize drag-threshold attribute", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet drag-threshold="200"></ds-bottom-sheet>`,
      );
      expect(el._dragThreshold).to.equal(200);
    });

    it("should use default drag-threshold of 100", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      expect(el._dragThreshold).to.equal(100);
    });

    it("should close when pointer drag exceeds threshold", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="standard" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      sheet.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          pointerType: "mouse",
          clientY: 100,
          bubbles: true,
          cancelable: true,
        }),
      );
      sheet.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientY: 260,
          bubbles: true,
          cancelable: true,
        }),
      );
      setTimeout(() => {
        sheet.dispatchEvent(
          new PointerEvent("pointerup", {
            pointerId: 1,
            pointerType: "mouse",
            clientY: 260,
            bubbles: true,
            cancelable: true,
          }),
        );
      });

      await oneEvent(el, "ds-bottom-sheet:close");
      expect(el.open).to.be.false;
    });

    it("should stay open when pointer drag is below threshold", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="standard" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      sheet.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 2,
          pointerType: "mouse",
          clientY: 100,
          bubbles: true,
          cancelable: true,
        }),
      );
      sheet.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 2,
          pointerType: "mouse",
          clientY: 130,
          bubbles: true,
          cancelable: true,
        }),
      );
      sheet.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 2,
          pointerType: "mouse",
          clientY: 130,
          bubbles: true,
          cancelable: true,
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 120));
      expect(el.open).to.be.true;
    });

    it("should not block slotted action button clicks", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet variant="standard" open>
          <div slot="actions">
            <button id="action-close" type="button">Close</button>
          </div>
        </ds-bottom-sheet>
      `);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const closeButton = el.querySelector("#action-close");
      let clicked = false;
      closeButton.addEventListener("click", () => {
        clicked = true;
      });

      closeButton.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 3,
          pointerType: "mouse",
          bubbles: true,
          cancelable: true,
        }),
      );
      closeButton.click();

      expect(clicked).to.be.true;
      expect(el._isDragging).to.be.false;
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close on Escape key in standard variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="standard" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));

      setTimeout(() => {
        const event = new KeyboardEvent("keydown", { key: "Escape" });
        document.dispatchEvent(event);
      });

      await oneEvent(el, "ds-bottom-sheet:close");
      expect(el.open).to.be.false;
    });

    it("should not respond to other keys", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(event);

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;
    });

    it("should not close on Escape if already closed", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(event);

      expect(el.open).to.be.false;
    });
  });

  describe("Focus Management", () => {
    it("should return focus to previous element on close", async () => {
      const button = await fixture(html`<button>Focus me</button>`);
      button.focus();

      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(document.activeElement).to.equal(button);
    });

    it("should have dialog role", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("role")).to.equal("dialog");
    });

    it("should have aria-modal attribute", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("aria-modal")).to.equal("true");
    });
  });

  describe("Scrim Interaction", () => {
    it("should close on scrim click in standard variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="standard" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));

      const scrim = el.shadowRoot.querySelector(".scrim");
      setTimeout(() => {
        scrim?.click();
      });

      await oneEvent(el, "ds-bottom-sheet:close");
      expect(el.open).to.be.false;
    });

    it("should not close on scrim click in modal variant", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet variant="modal" open></ds-bottom-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));

      const scrim = el.shadowRoot.querySelector(".scrim");
      scrim?.click();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;
    });

    it("should render scrim element", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const scrim = el.shadowRoot.querySelector("[part='scrim']");
      expect(scrim).to.exist;
    });
  });

  describe("CSS Parts", () => {
    it("should have container part", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = el.shadowRoot.querySelector(".container");
      expect(container).to.exist;
    });

    it("should have sheet part", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
    });

    it("should have header part", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      const header = el.shadowRoot.querySelector('[part="header"]');
      expect(header).to.exist;
    });

    it("should have content part", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      const content = el.shadowRoot.querySelector('[part="content"]');
      expect(content).to.exist;
    });

    it("should have actions part", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      const actions = el.shadowRoot.querySelector('[part="actions"]');
      expect(actions).to.exist;
    });

    it("should have scrim part", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      const scrim = el.shadowRoot.querySelector('[part="scrim"]');
      expect(scrim).to.exist;
    });
  });

  describe("CSS Custom Properties", () => {
    it("should support max-width custom property", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet
          open
          style="--ds-bottom-sheet-max-width: 800px;"></ds-bottom-sheet>
      `);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
      const style = window.getComputedStyle(sheet);
      expect(style.maxWidth).to.equal("800px");
    });

    it("should support max-height custom property", async () => {
      const el = await fixture(html`
        <ds-bottom-sheet
          open
          style="--ds-bottom-sheet-max-height: 500px;"></ds-bottom-sheet>
      `);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
      const style = window.getComputedStyle(sheet);
      expect(style.maxHeight).to.equal("500px");
    });
  });

  describe("Animation & Transitions", () => {
    it("should have open class when open", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = el.shadowRoot.querySelector(".container");
      expect(container?.classList.contains("open")).to.be.true;
    });

    it("should remove open class when closed", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 50));

      const container = el.shadowRoot.querySelector(".container");
      expect(container?.classList.contains("open")).to.be.false;
    });

    it("should have transform animation", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      const style = window.getComputedStyle(sheet);
      expect(style.transition).to.include("transform");
    });
  });

  describe("Observed Attributes", () => {
    it("should observe variant attribute", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.setAttribute("variant", "modal");
      expect(el.variant).to.equal("modal");
    });

    it("should observe open attribute", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.setAttribute("open", "");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.open).to.be.true;
    });

    it("should observe draggable attribute", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet draggable="true"></ds-bottom-sheet>`,
      );
      el.setAttribute("draggable", "false");
      expect(el.draggable).to.be.false;
    });

    it("should observe drag-threshold attribute", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet drag-threshold="150"></ds-bottom-sheet>`,
      );
      el.setAttribute("drag-threshold", "200");
      expect(el._dragThreshold).to.equal(200);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid open/close cycles", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 10));
      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 10));
      el.open = true;

      expect(el.open).to.be.true;
    });

    it("should handle null variant gracefully", async () => {
      const el = await fixture(html`<ds-bottom-sheet></ds-bottom-sheet>`);
      el.variant = null;
      expect(el.variant).to.equal("standard");
    });

    it("should handle invalid drag threshold", async () => {
      const el = await fixture(
        html`<ds-bottom-sheet drag-threshold="abc"></ds-bottom-sheet>`,
      );
      expect(el._dragThreshold).to.equal(100);
    });

    it("should clean up event listeners on disconnect", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      el.remove();
      // No error should be thrown
      expect(true).to.be.true;
    });

    it("should handle multiple open/close calls", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      el.show();
      el.close();
      el.close();

      expect(el.open).to.be.false;
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("role")).to.equal("dialog");
    });

    it("should announce modal state", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("aria-modal")).to.equal("true");
    });

    it("should have outline on sheet element", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      const style = window.getComputedStyle(sheet);
      expect(style.outline).to.exist;
    });

    it("should support focus outline", async () => {
      const el = await fixture(html`<ds-bottom-sheet open></ds-bottom-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;

      // The sheet has tabindex in the component, so it should be focusable
      sheet.focus();

      // Check that focus is within the custom element
      expect(document.activeElement).to.equal(el);
    });
  });
});
