import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/icon/icon.js";

describe("DSIcon", () => {
  describe("Initialization", () => {
    it("renders with default structure", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      expect(el).to.exist;
      expect(el.shadowRoot.querySelector(".icon")).to.exist;
    });

    it("registers custom element", async () => {
      await fixture(html`<ds-icon></ds-icon>`);
      expect(customElements.get("ds-icon")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reads name and variant attributes", async () => {
      const el = await fixture(
        html`<ds-icon name="home" variant="rounded"></ds-icon>`,
      );

      expect(el.name).to.equal("home");
      expect(el.variant).to.equal("rounded");
    });

    it("normalizes invalid variant to outlined", async () => {
      const el = await fixture(html`<ds-icon variant="bad"></ds-icon>`);

      expect(el.variant).to.equal("outlined");
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("supports named size tokens and numeric size values", async () => {
      const named = await fixture(html`<ds-icon size="large"></ds-icon>`);
      const custom = await fixture(html`<ds-icon size="32"></ds-icon>`);

      expect(named.getSizeConfig().px).to.equal(40);
      expect(custom.getSizeConfig().px).to.equal(32);
    });

    it("clamps weight, grade, fill, and optical size", async () => {
      const el = await fixture(html`
        <ds-icon
          weight="900"
          grade="-100"
          fill="10"
          optical-size="100"></ds-icon>
      `);

      expect(el.weight).to.equal(700);
      expect(el.grade).to.equal(-25);
      expect(el.fill).to.equal(1);
      expect(el.opticalSize).to.equal(48);
    });
  });

  describe("Properties", () => {
    it("sets and clears name property", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      el.name = "check";
      expect(el.getAttribute("name")).to.equal("check");

      el.name = null;
      expect(el.hasAttribute("name")).to.equal(false);
    });

    it("sets variant and color properties", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      el.variant = "sharp";
      el.color = "rgb(255, 0, 0)";

      expect(el.variant).to.equal("sharp");
      expect(el.color).to.equal("rgb(255, 0, 0)");
    });

    it("sets numeric properties through setters", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      el.weight = 200;
      el.grade = 50;
      el.fill = 1;
      el.opticalSize = 40;

      expect(el.weight).to.equal(200);
      expect(el.grade).to.equal(50);
      expect(el.fill).to.equal(1);
      expect(el.opticalSize).to.equal(40);
    });

    it("clears optional label property", async () => {
      const el = await fixture(html`<ds-icon label="Menu"></ds-icon>`);
      el.label = "";

      expect(el.hasAttribute("label")).to.equal(false);
    });
  });

  describe("Events", () => {
    it("does not emit custom events during property updates", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      let emitted = false;

      el.addEventListener("ds-icon:change", () => {
        emitted = true;
      });

      el.name = "settings";
      el.variant = "filled";
      expect(emitted).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("host is not focusable by default", async () => {
      const el = await fixture(html`<ds-icon></ds-icon>`);
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("renders decorative icon with presentation role", async () => {
      const el = await fixture(html`<ds-icon name="home"></ds-icon>`);
      const icon = el.shadowRoot.querySelector(".icon");

      expect(icon.getAttribute("role")).to.equal("presentation");
      expect(icon.getAttribute("aria-hidden")).to.equal("true");
    });

    it("renders meaningful icon with img role and aria-label", async () => {
      const el = await fixture(
        html`<ds-icon name="home" label="Home"></ds-icon>`,
      );
      const icon = el.shadowRoot.querySelector(".icon");

      expect(icon.getAttribute("role")).to.equal("img");
      expect(icon.getAttribute("aria-label")).to.equal("Home");
    });

    it("exposes icon part and variant class", async () => {
      const el = await fixture(
        html`<ds-icon name="star" variant="rounded"></ds-icon>`,
      );
      const icon = el.shadowRoot.querySelector('[part="icon"]');

      expect(icon).to.exist;
      expect(icon.className).to.contain("material-symbols-rounded");
    });
  });
});
