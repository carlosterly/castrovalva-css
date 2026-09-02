import {
  fixture,
  expect,
  html,
  oneEvent,
  elementUpdated,
} from "@open-wc/testing";
import "../src/components/banner/banner.js";

describe("DSBanner", () => {
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      expect(el).to.exist;
      expect(el.open).to.be.false;
      expect(el.variant).to.equal("default");
      expect(el.dismissible).to.be.true;
    });

    it("should render with message", async () => {
      const el = await fixture(
        html`<ds-banner message="Test message"></ds-banner>`,
      );

      const message = el.shadowRoot.querySelector(".message");
      expect(message.textContent.trim()).to.equal("Test message");
    });

    it("should render with default icon for default variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="default"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon).to.exist;
      expect(icon.textContent).to.equal("campaign");
    });

    it("should render with info icon for info variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="info"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("info");
    });

    it("should render with warning icon for warning variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="warning"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("warning");
    });

    it("should render with error icon for error variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="error"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("error");
    });

    it("should render with success icon for success variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="success"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("check_circle");
    });

    it("should render dismiss button when dismissible", async () => {
      const el = await fixture(html`<ds-banner open dismissible></ds-banner>`);

      const dismissBtn = el.shadowRoot.querySelector(".dismiss-button");
      expect(dismissBtn).to.exist;
    });

    it("should not render dismiss button when not dismissible", async () => {
      const el = await fixture(
        html`<ds-banner open dismissible="false"></ds-banner>`,
      );

      const dismissBtn = el.shadowRoot.querySelector(".dismiss-button");
      expect(dismissBtn).to.not.exist;
    });

    it("should render slot content for message", async () => {
      const el = await fixture(
        html`<ds-banner open>Slot message content</ds-banner>`,
      );

      const slot = el.shadowRoot.querySelector("slot:not([name])");
      expect(slot).to.exist;
    });

    it("should render custom icon via slot", async () => {
      const el = await fixture(html`
        <ds-banner open>
          <span slot="icon">★</span>
        </ds-banner>
      `);

      const iconSlot = el.shadowRoot.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;

      const defaultIcon = el.shadowRoot.querySelector(".default-icon");
      expect(defaultIcon).to.not.exist;
    });

    it("should render supporting text via slot", async () => {
      const el = await fixture(html`
        <ds-banner open>
          <span slot="supporting-text">Additional info</span>
        </ds-banner>
      `);

      const supportingSlot = el.shadowRoot.querySelector(
        'slot[name="supporting-text"]',
      );
      expect(supportingSlot).to.exist;
    });

    it("should render actions via slot", async () => {
      const el = await fixture(html`
        <ds-banner open>
          <div slot="actions">
            <button>Action 1</button>
          </div>
        </ds-banner>
      `);

      const actionsSlot = el.shadowRoot.querySelector('slot[name="actions"]');
      expect(actionsSlot).to.exist;
    });
  });

  describe("Attributes", () => {
    it("should set message attribute", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.setAttribute("message", "New message");
      await elementUpdated(el);

      expect(el.message).to.equal("New message");
    });

    it("should set variant attribute", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.setAttribute("variant", "warning");
      await elementUpdated(el);

      expect(el.variant).to.equal("warning");
    });

    it("should set open attribute", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.setAttribute("open", "");
      await elementUpdated(el);

      expect(el.open).to.be.true;
    });

    it("should set dismissible attribute", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.setAttribute("dismissible", "false");
      await elementUpdated(el);

      expect(el.dismissible).to.be.false;
    });

    it("should handle dismissible attribute removal", async () => {
      const el = await fixture(html`<ds-banner dismissible></ds-banner>`);

      el.removeAttribute("dismissible");
      await elementUpdated(el);

      expect(el.dismissible).to.be.false;
    });
  });

  describe("Properties", () => {
    it("should set message property", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.message = "Property message";
      await elementUpdated(el);

      expect(el.getAttribute("message")).to.equal("Property message");
    });

    it("should set variant property", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.variant = "error";
      await elementUpdated(el);

      expect(el.getAttribute("variant")).to.equal("error");
    });

    it("should set open property", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.open = true;
      await elementUpdated(el);

      expect(el.hasAttribute("open")).to.be.true;
    });

    it("should set dismissible property", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.dismissible = false;
      await elementUpdated(el);

      expect(el.getAttribute("dismissible")).to.equal("false");
    });

    it("should set dismissible property to true", async () => {
      const el = await fixture(
        html`<ds-banner dismissible="false"></ds-banner>`,
      );

      el.dismissible = true;
      await elementUpdated(el);

      expect(el.hasAttribute("dismissible")).to.be.true;
      expect(el.getAttribute("dismissible")).to.equal("");
    });
  });

  describe("Methods", () => {
    it("should show banner with show() method", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.show({ message: "Method message", variant: "info" });
      await elementUpdated(el);

      expect(el.open).to.be.true;
      expect(el.message).to.equal("Method message");
      expect(el.variant).to.equal("info");
    });

    it("should hide banner with hide() method", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      el.hide();
      await elementUpdated(el);

      expect(el.open).to.be.false;
    });
  });

  describe("Events", () => {
    it("should emit ds-banner:show event when shown", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      setTimeout(() => el.show({ message: "Test", variant: "info" }));
      const event = await oneEvent(el, "ds-banner:show");

      expect(event.detail.message).to.equal("Test");
      expect(event.detail.variant).to.equal("info");
    });

    it("should emit ds-banner:dismiss event when dismissed", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      setTimeout(() => el.hide());
      const event = await oneEvent(el, "ds-banner:dismiss");

      expect(event.detail).to.exist;
    });

    it("should dismiss banner when dismiss button is clicked", async () => {
      const el = await fixture(
        html`<ds-banner open message="Test"></ds-banner>`,
      );

      const dismissBtn = el.shadowRoot.querySelector(".dismiss-button");

      setTimeout(() => dismissBtn.click());
      const event = await oneEvent(el, "ds-banner:dismiss");

      expect(event).to.exist;
      expect(el.open).to.be.false;
    });

    it("should emit ds-banner:action event when action is clicked", async () => {
      const el = await fixture(html`
        <ds-banner open>
          <div slot="actions">
            <button class="action-button" data-index="0">Action 1</button>
          </div>
        </ds-banner>
      `);

      const actionBtn = el.querySelector(".action-button");

      setTimeout(() => actionBtn.click());
      const event = await oneEvent(el, "ds-banner:action");

      expect(event.detail.actionIndex).to.equal(0);
    });
  });

  describe("Keyboard", () => {
    it("should allow dismiss button to receive focus", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const dismissBtn = el.shadowRoot.querySelector(".dismiss-button");
      dismissBtn.focus();

      expect(el.shadowRoot.activeElement).to.equal(dismissBtn);
    });

    it("should allow action button to receive focus", async () => {
      const el = await fixture(html`
        <ds-banner open>
          <div slot="actions">
            <button class="action-button" data-index="0">Action 1</button>
          </div>
        </ds-banner>
      `);

      const actionBtn = el.querySelector(".action-button");
      actionBtn.focus();

      expect(document.activeElement).to.equal(actionBtn);
    });
  });

  describe("Accessibility", () => {
    it("should have role=region", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      expect(el.getAttribute("role")).to.equal("region");
    });

    it("should have aria-label", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      expect(el.getAttribute("aria-label")).to.equal("Banner notification");
    });

    it("should set aria-hidden based on open state", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      expect(el.getAttribute("aria-hidden")).to.equal("true");

      el.open = true;
      await elementUpdated(el);

      expect(el.getAttribute("aria-hidden")).to.equal("false");
    });

    it("should have live region for announcements", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const liveRegion = el.shadowRoot.querySelector('[role="status"]');
      expect(liveRegion).to.exist;
      expect(liveRegion.getAttribute("aria-live")).to.equal("polite");
      expect(liveRegion.getAttribute("aria-atomic")).to.equal("true");
    });

    it("should have aria-label on dismiss button", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const dismissBtn = el.shadowRoot.querySelector(".dismiss-button");
      expect(dismissBtn.getAttribute("aria-label")).to.equal("Dismiss banner");
    });
  });

  describe("CSS Parts", () => {
    it("should expose container part", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("should expose icon part", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const icon = el.shadowRoot.querySelector('[part="icon"]');
      expect(icon).to.exist;
    });

    it("should expose content part", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const content = el.shadowRoot.querySelector('[part="content"]');
      expect(content).to.exist;
    });

    it("should expose message part", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const message = el.shadowRoot.querySelector('[part="message"]');
      expect(message).to.exist;
    });

    it("should expose dismiss-button part", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      const dismissBtn = el.shadowRoot.querySelector('[part="dismiss-button"]');
      expect(dismissBtn).to.exist;
    });
  });

  describe("Variants", () => {
    it("should handle all variant types", async () => {
      const variants = ["default", "info", "warning", "error", "success"];

      for (const variant of variants) {
        const el = await fixture(
          html`<ds-banner variant=${variant} open></ds-banner>`,
        );

        expect(el.variant).to.equal(variant);
        const icon = el.shadowRoot.querySelector(".default-icon");
        expect(icon).to.exist;
      }
    });
    it("should fallback to default icon for invalid variant", async () => {
      const el = await fixture(
        html`<ds-banner open variant="invalid"></ds-banner>`,
      );

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("campaign"); // default icon
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty message", async () => {
      const el = await fixture(html`<ds-banner open message=""></ds-banner>`);

      const message = el.shadowRoot.querySelector(".message");
      expect(message).to.exist;
    });

    it("should handle multiple show() calls", async () => {
      const el = await fixture(html`<ds-banner></ds-banner>`);

      el.show({ message: "First" });
      el.show({ message: "Second" });
      await elementUpdated(el);

      expect(el.message).to.equal("Second");
      expect(el.open).to.be.true;
    });

    it("should handle multiple hide() calls", async () => {
      const el = await fixture(html`<ds-banner open></ds-banner>`);

      el.hide();
      el.hide();
      await elementUpdated(el);

      expect(el.open).to.be.false;
    });

    it("should handle variant change while open", async () => {
      const el = await fixture(
        html`<ds-banner open variant="info"></ds-banner>`,
      );

      el.variant = "error";
      await elementUpdated(el);

      const icon = el.shadowRoot.querySelector(".default-icon");
      expect(icon.textContent).to.equal("error");
    });
  });
});
