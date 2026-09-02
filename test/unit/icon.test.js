import { fixture, expect, html } from "@open-wc/testing";
import "../../src/components/icon/icon.js";

describe("DSIcon", () => {
  describe("Rendering", () => {
    it("renders with default properties", async () => {
      const el = await fixture(html`<ds-icon name="check"></ds-icon>`);
      expect(el).to.exist;
      expect(el.name).to.equal("check");
      expect(el.size).to.equal("medium");
      expect(el.color).to.equal("currentColor");
    });

    it("renders material symbols text node", async () => {
      const el = await fixture(html`<ds-icon name="arrow_left"></ds-icon>`);
      const icon = el.shadowRoot.querySelector(".icon");
      expect(icon).to.exist;
      expect(icon.textContent.trim()).to.equal("arrow_left");
    });

    it("renders size variants using token mapping", async () => {
      const sizes = ["small", "medium", "large", "xlarge"];
      for (const size of sizes) {
        const el = await fixture(
          html`<ds-icon name="check" size="${size}"></ds-icon>`,
        );
        expect(el.size).to.equal(size);
        expect(el.getSizeConfig().px).to.be.a("number");
      }
    });
  });

  describe("Attributes and Properties", () => {
    it("reflects core properties to attributes", async () => {
      const el = await fixture(html`<ds-icon name="check"></ds-icon>`);

      el.name = "close";
      el.size = "large";
      el.color = "blue";
      el.label = "Close icon";

      expect(el.getAttribute("name")).to.equal("close");
      expect(el.getAttribute("size")).to.equal("large");
      expect(el.getAttribute("color")).to.equal("blue");
      expect(el.getAttribute("label")).to.equal("Close icon");
    });

    it("normalizes invalid variant to outlined", async () => {
      const el = await fixture(html`<ds-icon variant="invalid"></ds-icon>`);
      expect(el.variant).to.equal("outlined");
      expect(el.getAttribute("variant")).to.equal("outlined");
    });
  });

  describe("Accessibility", () => {
    it("has presentation role when no label provided", async () => {
      const el = await fixture(html`<ds-icon name="check"></ds-icon>`);
      const icon = el.shadowRoot.querySelector(".icon");

      expect(icon.getAttribute("role")).to.equal("presentation");
      expect(icon.getAttribute("aria-hidden")).to.equal("true");
    });

    it("has img role and aria-label when label provided", async () => {
      const el = await fixture(
        html`<ds-icon name="check" label="Success"></ds-icon>`,
      );
      const icon = el.shadowRoot.querySelector(".icon");

      expect(icon.getAttribute("role")).to.equal("img");
      expect(icon.getAttribute("aria-label")).to.equal("Success");
      expect(icon.hasAttribute("aria-hidden")).to.be.false;
    });
  });

  describe("Animations", () => {
    it("supports spin and pulse attributes", async () => {
      const spin = await fixture(html`<ds-icon name="refresh" spin></ds-icon>`);
      const pulse = await fixture(
        html`<ds-icon name="favorite" pulse></ds-icon>`,
      );

      expect(spin.hasAttribute("spin")).to.be.true;
      expect(pulse.hasAttribute("pulse")).to.be.true;
    });
  });

  describe("Sizing", () => {
    it("computes numeric size values", async () => {
      const el = await fixture(
        html`<ds-icon name="check" size="32"></ds-icon>`,
      );
      expect(el.getSizeConfig().px).to.equal(32);
    });

    it("falls back to medium size for invalid values", async () => {
      const el = await fixture(
        html`<ds-icon name="check" size="invalid"></ds-icon>`,
      );
      expect(el.getSizeConfig().px).to.equal(24);
    });
  });
});
