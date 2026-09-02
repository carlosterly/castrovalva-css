import { expect, fixture, html } from "@open-wc/testing";
import "../src/components/side-sheet/side-sheet.js";

describe("DSSideSheet", () => {
  describe("Attributes", () => {
    it("reflects variant attribute", async () => {
      const el = await fixture(
        html`<ds-side-sheet variant="modal"></ds-side-sheet>`,
      );
      expect(el.getAttribute("variant")).to.equal("modal");
    });

    it("reflects position attribute", async () => {
      const el = await fixture(
        html`<ds-side-sheet position="right"></ds-side-sheet>`,
      );
      expect(el.getAttribute("position")).to.equal("right");
    });
  });

  describe("Properties", () => {
    it("updates open attribute through property", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.hasAttribute("open")).to.be.true;
    });

    it("updates swipeable attribute through property", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.swipeable = false;
      expect(el.hasAttribute("swipeable")).to.be.false;
    });
  });

  describe("Events", () => {
    it("emits ds-side-sheet:open", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      let fired = false;
      el.addEventListener("ds-side-sheet:open", () => {
        fired = true;
      });
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 120));
      expect(fired).to.be.true;
    });

    it("emits ds-side-sheet:close", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      let fired = false;
      el.addEventListener("ds-side-sheet:close", () => {
        fired = true;
      });
      el.close();
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(fired).to.be.true;
    });
  });

  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el).to.exist;
      expect(el.getAttribute("variant")).to.equal("standard");
      expect(el.getAttribute("position")).to.equal("left");
    });

    it("should have shadow root", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should set initial open state to false", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el.open).to.be.false;
    });

    it("should initialize with standard variant by default", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el.variant).to.equal("standard");
    });

    it("should initialize with left position by default", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el.position).to.equal("left");
    });

    it("should initialize with swipeable enabled by default", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      expect(el.swipeable).to.be.true;
    });
  });

  describe("Variants", () => {
    it("should support standard variant", async () => {
      const el = await fixture(
        html`<ds-side-sheet variant="standard"></ds-side-sheet>`,
      );
      expect(el.getAttribute("variant")).to.equal("standard");
    });

    it("should support modal variant", async () => {
      const el = await fixture(
        html`<ds-side-sheet variant="modal"></ds-side-sheet>`,
      );
      expect(el.getAttribute("variant")).to.equal("modal");
    });

    it("should support left position", async () => {
      const el = await fixture(
        html`<ds-side-sheet position="left"></ds-side-sheet>`,
      );
      expect(el.position).to.equal("left");
    });

    it("should support right position", async () => {
      const el = await fixture(
        html`<ds-side-sheet position="right"></ds-side-sheet>`,
      );
      expect(el.position).to.equal("right");
    });
  });

  describe("Open State", () => {
    it("should emit open event when opening", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      let eventFired = false;
      el.addEventListener("ds-side-sheet:open", () => {
        eventFired = true;
      });

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(eventFired).to.be.true;
    });

    it("should emit close event when closing", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      let eventFired = false;
      el.addEventListener("ds-side-sheet:close", () => {
        eventFired = true;
      });

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(eventFired).to.be.true;
    });

    it("should update open property when attribute changes", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      el.setAttribute("open", "");
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;

      el.removeAttribute("open");
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.false;
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close on Escape key in standard variant", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(el.open).to.be.false;
    });

    it("should not close on Escape key in modal variant", async () => {
      const el = await fixture(
        html`<ds-side-sheet variant="modal" open></ds-side-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 100));

      const initialOpen = el.open;
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(el.open).to.equal(initialOpen);
    });
  });

  describe("Scrim Interaction", () => {
    it("should close on scrim click in standard variant", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const scrim = el.shadowRoot.querySelector(".scrim");
      scrim?.click();
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(el.open).to.be.false;
    });

    it("should not close on scrim click in modal variant", async () => {
      const el = await fixture(
        html`<ds-side-sheet variant="modal" open></ds-side-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 100));

      const scrim = el.shadowRoot.querySelector(".scrim");
      scrim?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(el.open).to.be.true;
    });
  });

  describe("Content Projection", () => {
    it("should render default slot content", async () => {
      const el = await fixture(
        html`<ds-side-sheet>Test Content</ds-side-sheet>`,
      );
      const content = el.shadowRoot.querySelector('[part="content"] slot');
      expect(content).to.exist;
    });

    it("should render header slot", async () => {
      const el = await fixture(html`
        <ds-side-sheet>
          <div slot="header">Header</div>
        </ds-side-sheet>
      `);
      const header = el.shadowRoot.querySelector('[part="header"]');
      expect(header).to.exist;
    });

    it("should render actions slot", async () => {
      const el = await fixture(html`
        <ds-side-sheet>
          <div slot="actions">Action</div>
        </ds-side-sheet>
      `);
      const actions = el.shadowRoot.querySelector('[part="actions"]');
      expect(actions).to.exist;
    });
  });

  describe("Position Variants", () => {
    it("should render from left by default", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      const container = el.shadowRoot.querySelector(".container");
      expect(container).to.have.class("open");
    });

    it("should render from right when position=right", async () => {
      const el = await fixture(
        html`<ds-side-sheet position="right" open></ds-side-sheet>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 100));

      const container = el.shadowRoot.querySelector(".container");
      expect(container).to.have.class("open");
    });

    it("should change position via property", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.position = "right";
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.getAttribute("position")).to.equal("right");
    });
  });

  describe("CSS Parts", () => {
    it("should expose container part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const container = el.shadowRoot.querySelector(".container");
      expect(container).to.exist;
    });

    it("should expose scrim part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const scrim = el.shadowRoot.querySelector('[part="scrim"]');
      expect(scrim).to.exist;
    });

    it("should expose sheet part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
    });

    it("should expose header part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const header = el.shadowRoot.querySelector('[part="header"]');
      expect(header).to.exist;
    });

    it("should expose content part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = el.shadowRoot.querySelector('[part="content"]');
      expect(content).to.exist;
    });

    it("should expose actions part", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const actions = el.shadowRoot.querySelector('[part="actions"]');
      expect(actions).to.exist;
    });
  });

  describe("CSS Custom Properties", () => {
    it("should support width custom property", async () => {
      const el = await fixture(html`
        <ds-side-sheet
          open
          style="--ds-side-sheet-width: 500px;"></ds-side-sheet>
      `);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
      const style = window.getComputedStyle(sheet);
      expect(style.width).to.equal("500px");
    });

    it("should support max-width custom property", async () => {
      const el = await fixture(html`
        <ds-side-sheet
          open
          style="--ds-side-sheet-max-width: 80vw;"></ds-side-sheet>
      `);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet).to.exist;
    });
  });

  describe("Animation & Transitions", () => {
    it("should have open class when open", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const container = el.shadowRoot.querySelector(".container");
      expect(container?.classList.contains("open")).to.be.true;
    });

    it("should remove open class when closed", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));

      const container = el.shadowRoot.querySelector(".container");
      expect(container?.classList.contains("open")).to.be.false;
    });

    it("should have visibility hidden when closed", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const container = el.shadowRoot.querySelector(".container");
      const style = window.getComputedStyle(container);
      expect(style.visibility).to.equal("hidden");
    });

    it("should have visibility visible when open", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const container = el.shadowRoot.querySelector(".container");
      const style = window.getComputedStyle(container);
      expect(style.visibility).to.equal("visible");
    });
  });

  describe("Observed Attributes", () => {
    it("should observe variant attribute", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.setAttribute("variant", "modal");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.variant).to.equal("modal");
    });

    it("should observe position attribute", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.setAttribute("position", "right");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.position).to.equal("right");
    });

    it("should observe open attribute", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.setAttribute("open", "");
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;
    });

    it("should observe swipeable attribute", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.setAttribute("swipeable", "false");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.swipeable).to.be.false;
    });
  });

  describe("Edge Cases", () => {
    it("should handle null variant gracefully", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.variant = null;
      expect(el.variant).to.equal("standard");
    });

    it("should handle null position gracefully", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.position = null;
      expect(el.position).to.equal("left");
    });

    it("should handle invalid variant gracefully", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      el.setAttribute("variant", "invalid");
      expect(el.getAttribute("variant")).to.equal("invalid");
    });

    it("should toggle open state multiple times", async () => {
      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.false;

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.be.true;
    });
  });

  describe("Accessibility", () => {
    it("should have sheet role as complementary", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("role")).to.equal("complementary");
    });

    it("should have aria-modal attribute", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("aria-modal")).to.equal("true");
    });

    it("should be focusable with tabindex", async () => {
      const el = await fixture(html`<ds-side-sheet open></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sheet = el.shadowRoot.querySelector('[part="sheet"]');
      expect(sheet?.getAttribute("tabindex")).to.equal("-1");
    });

    it("should restore focus on close", async () => {
      const button = document.createElement("button");
      document.body.appendChild(button);
      button.focus();

      const el = await fixture(html`<ds-side-sheet></ds-side-sheet>`);
      await new Promise((resolve) => setTimeout(resolve, 100));

      el.open = true;
      await new Promise((resolve) => setTimeout(resolve, 100));

      el.open = false;
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(document.activeElement).to.equal(button);
      document.body.removeChild(button);
    });
  });
});
