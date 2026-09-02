import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../../src/components/button/button.js";

describe("DSButton", () => {
  describe("Rendering", () => {
    it("renders with default properties", async () => {
      const el = await fixture(html`<ds-button>Click me</ds-button>`);
      expect(el).to.exist;
      expect(el.variant).to.equal("filled");
      expect(el.size).to.equal("medium");
      expect(el.disabled).to.be.false;
      expect(el.loading).to.be.false;
    });

    it("renders supported variants", async () => {
      const variants = [
        "filled",
        "filled-tonal",
        "outlined",
        "elevated",
        "text",
        "danger",
      ];

      for (const variant of variants) {
        const el = await fixture(
          html`<ds-button variant="${variant}">Button</ds-button>`,
        );
        expect(el.variant).to.equal(variant);
        expect(
          el.shadowRoot.querySelector("button").classList.contains(variant),
        ).to.be.true;
      }
    });

    it("renders all size variants", async () => {
      for (const size of ["small", "medium", "large"]) {
        const el = await fixture(
          html`<ds-button size="${size}">Button</ds-button>`,
        );
        expect(el.size).to.equal(size);
        expect(el.shadowRoot.querySelector("button").classList.contains(size))
          .to.be.true;
      }
    });
  });

  describe("Attributes and Properties", () => {
    it("reflects variant, size and type attributes", async () => {
      const el = await fixture(html`<ds-button>Button</ds-button>`);
      el.variant = "outlined";
      el.size = "large";
      el.type = "submit";

      expect(el.getAttribute("variant")).to.equal("outlined");
      expect(el.getAttribute("size")).to.equal("large");
      expect(el.getAttribute("type")).to.equal("submit");
      expect(el.shadowRoot.querySelector("button").type).to.equal("submit");
    });

    it("reflects disabled and loading state", async () => {
      const el = await fixture(html`<ds-button>Button</ds-button>`);
      el.disabled = true;
      el.loading = true;

      const button = el.shadowRoot.querySelector("button");
      expect(button.disabled).to.be.true;
      expect(button.getAttribute("aria-disabled")).to.equal("true");
      expect(button.getAttribute("aria-busy")).to.equal("true");
    });
  });

  describe("Interaction", () => {
    it("emits ds-click event on click", async () => {
      const el = await fixture(html`<ds-button>Click me</ds-button>`);
      setTimeout(() => el.shadowRoot.querySelector("button").click());
      const event = await oneEvent(el, "ds-click");

      expect(event).to.exist;
      expect(event.detail.originalEvent).to.exist;
    });

    it("does not emit ds-click when disabled or loading", async () => {
      const disabled = await fixture(
        html`<ds-button disabled>Click me</ds-button>`,
      );
      const loading = await fixture(
        html`<ds-button loading>Click me</ds-button>`,
      );

      let disabledFired = false;
      let loadingFired = false;

      disabled.addEventListener("ds-click", () => {
        disabledFired = true;
      });
      loading.addEventListener("ds-click", () => {
        loadingFired = true;
      });

      disabled.shadowRoot.querySelector("button").click();
      loading.shadowRoot.querySelector("button").click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(disabledFired).to.be.false;
      expect(loadingFired).to.be.false;
    });
  });

  describe("Shadow Parts", () => {
    it("exposes button and content parts", async () => {
      const el = await fixture(html`<ds-button>Button</ds-button>`);
      expect(el.shadowRoot.querySelector('[part="button"]')).to.exist;
      expect(el.shadowRoot.querySelector('[part="content"]')).to.exist;
    });
  });
});
