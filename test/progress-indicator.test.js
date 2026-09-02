import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/ds-progress-indicator.js";

describe("ProgressIndicators", () => {
  describe("Initialization", () => {
    it("registers progress custom elements", async () => {
      await fixture(html`<ds-linear-progress></ds-linear-progress>`);
      expect(customElements.get("ds-linear-progress")).to.exist;
      expect(customElements.get("ds-circular-progress")).to.exist;
    });

    it("renders linear and circular defaults", async () => {
      const linear = await fixture(
        html`<ds-linear-progress></ds-linear-progress>`,
      );
      const circular = await fixture(
        html`<ds-circular-progress></ds-circular-progress>`,
      );

      expect(linear).to.exist;
      expect(circular).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reads linear value/max attributes", async () => {
      const el = await fixture(
        html`<ds-linear-progress value="25" max="50"></ds-linear-progress>`,
      );

      expect(el.value).to.equal(25);
      expect(el.max).to.equal(50);
    });

    it("normalizes invalid linear color to primary", async () => {
      const el = await fixture(
        html`<ds-linear-progress color="invalid"></ds-linear-progress>`,
      );

      expect(el.color).to.equal("primary");
      expect(el.getAttribute("color")).to.equal("primary");
    });

    it("supports circular size aliases", async () => {
      const el = await fixture(
        html`<ds-circular-progress size="small"></ds-circular-progress>`,
      );

      expect(el.getSizeValue()).to.equal(24);
    });

    it("falls back to defaults for invalid numeric attributes", async () => {
      const el = await fixture(
        html`<ds-circular-progress value="-10" max="0"></ds-circular-progress>`,
      );

      expect(el.value).to.equal(0);
      expect(el.max).to.equal(100);
    });
  });

  describe("Properties", () => {
    it("updates linear value via property", async () => {
      const el = await fixture(html`<ds-linear-progress></ds-linear-progress>`);
      el.value = 75;

      expect(el.getAttribute("value")).to.equal("75");
      expect(el.getProgress()).to.equal(75);
    });

    it("toggles indeterminate property on linear", async () => {
      const el = await fixture(html`<ds-linear-progress></ds-linear-progress>`);
      el.indeterminate = true;
      expect(el.hasAttribute("indeterminate")).to.equal(true);

      el.indeterminate = false;
      expect(el.hasAttribute("indeterminate")).to.equal(false);
    });

    it("updates circular size and color via property", async () => {
      const el = await fixture(
        html`<ds-circular-progress></ds-circular-progress>`,
      );
      el.size = "lg";
      el.color = "secondary";

      expect(el.getAttribute("size")).to.equal("lg");
      expect(el.color).to.equal("secondary");
    });

    it("clamps progress between 0 and 100", async () => {
      const el = await fixture(
        html`<ds-linear-progress value="999" max="100"></ds-linear-progress>`,
      );
      expect(el.getProgress()).to.equal(100);
    });
  });

  describe("Events", () => {
    it("does not emit custom events on value updates (linear)", async () => {
      const el = await fixture(html`<ds-linear-progress></ds-linear-progress>`);
      let emitted = false;

      el.addEventListener("ds-progress:change", () => {
        emitted = true;
      });

      el.value = 30;
      expect(emitted).to.equal(false);
    });

    it("does not emit custom events on value updates (circular)", async () => {
      const el = await fixture(
        html`<ds-circular-progress></ds-circular-progress>`,
      );
      let emitted = false;

      el.addEventListener("ds-progress:change", () => {
        emitted = true;
      });

      el.value = 30;
      expect(emitted).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("linear host is not focusable by default", async () => {
      const el = await fixture(html`<ds-linear-progress></ds-linear-progress>`);
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });

    it("circular host is not focusable by default", async () => {
      const el = await fixture(
        html`<ds-circular-progress></ds-circular-progress>`,
      );
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("renders linear role and aria values in determinate mode", async () => {
      const el = await fixture(
        html`<ds-linear-progress value="40" max="80"></ds-linear-progress>`,
      );
      const node = el.shadowRoot.querySelector(".progress-container");

      expect(node.getAttribute("role")).to.equal("progressbar");
      expect(node.getAttribute("aria-valuemin")).to.equal("0");
      expect(node.getAttribute("aria-valuemax")).to.equal("80");
      expect(node.getAttribute("aria-valuenow")).to.equal("40");
    });

    it("omits linear aria-valuenow in indeterminate mode", async () => {
      const el = await fixture(
        html`<ds-linear-progress indeterminate></ds-linear-progress>`,
      );
      const node = el.shadowRoot.querySelector(".progress-container");

      expect(node.hasAttribute("aria-valuenow")).to.equal(false);
    });

    it("renders circular role and aria values in determinate mode", async () => {
      const el = await fixture(
        html`<ds-circular-progress value="20" max="50"></ds-circular-progress>`,
      );
      const svg = el.shadowRoot.querySelector("svg");

      expect(svg.getAttribute("role")).to.equal("progressbar");
      expect(svg.getAttribute("aria-valuemin")).to.equal("0");
      expect(svg.getAttribute("aria-valuemax")).to.equal("50");
      expect(svg.getAttribute("aria-valuenow")).to.equal("20");
    });

    it("omits circular aria-valuenow in indeterminate mode", async () => {
      const el = await fixture(
        html`<ds-circular-progress indeterminate></ds-circular-progress>`,
      );
      const svg = el.shadowRoot.querySelector("svg");

      expect(svg.hasAttribute("aria-valuenow")).to.equal(false);
    });
  });
});
