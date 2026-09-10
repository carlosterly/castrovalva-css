import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/ds-badge.js";

describe("DSBadge", () => {
  describe("Initialization", () => {
    it("renders with default structure", async () => {
      const el = await fixture(html`<ds-badge></ds-badge>`);
      expect(el).to.exist;
      expect(el.shadowRoot.querySelector(".badge")).to.exist;
    });

    it("registers custom element", async () => {
      await fixture(html`<ds-badge></ds-badge>`);
      expect(customElements.get("ds-badge")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reflects value attribute", async () => {
      const el = await fixture(html`<ds-badge value="5"></ds-badge>`);
      expect(el.getAttribute("value")).to.equal("5");
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("5");
    });

    it("reflects dot attribute", async () => {
      const el = await fixture(html`<ds-badge dot></ds-badge>`);
      expect(el.hasAttribute("dot")).to.equal(true);
      expect(
        el.shadowRoot.querySelector(".badge").classList.contains("dot"),
      ).to.equal(true);
    });

    it("reflects max attribute for overflow formatting", async () => {
      const el = await fixture(
        html`<ds-badge value="150" max="99"></ds-badge>`,
      );
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("99+");
    });

    it("reflects color attribute", async () => {
      const el = await fixture(
        html`<ds-badge value="1" color="error"></ds-badge>`,
      );
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.style.getPropertyValue("--badge-bg")).to.contain(
        "--md-sys-color-error",
      );
    });

    it("reflects overlap position attribute", async () => {
      const el = await fixture(
        html`<ds-badge value="1" position="overlap"></ds-badge>`,
      );
      expect(el.classList.contains("position-overlap")).to.equal(true);
      expect(
        el.shadowRoot.querySelector(".badge").classList.contains("overlap"),
      ).to.equal(true);
    });

    it("falls back to inline position for invalid attribute value", async () => {
      const el = await fixture(html`<ds-badge position="invalid"></ds-badge>`);
      expect(el.position).to.equal("inline");
      expect(el.classList.contains("position-overlap")).to.equal(false);
    });

    it("supports non-numeric value formatting", async () => {
      const el = await fixture(html`<ds-badge value="new"></ds-badge>`);
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("new");
    });
  });

  describe("Properties", () => {
    it("updates value through property", async () => {
      const el = await fixture(html`<ds-badge></ds-badge>`);
      el.value = 12;
      expect(el.getAttribute("value")).to.equal("12");
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("12");
    });

    it("clears value when set to null", async () => {
      const el = await fixture(html`<ds-badge value="9"></ds-badge>`);
      el.value = null;
      expect(el.hasAttribute("value")).to.equal(false);
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("");
    });

    it("toggles dot through property", async () => {
      const el = await fixture(html`<ds-badge></ds-badge>`);
      el.dot = true;
      expect(el.hasAttribute("dot")).to.equal(true);
      el.dot = false;
      expect(el.hasAttribute("dot")).to.equal(false);
    });

    it("updates max through property", async () => {
      const el = await fixture(html`<ds-badge value="25"></ds-badge>`);
      el.max = 9;
      expect(el.getAttribute("max")).to.equal("9");
      expect(el.shadowRoot.querySelector(".badge").textContent).to.equal("9+");
    });

    it("updates position through property", async () => {
      const el = await fixture(html`<ds-badge value="1"></ds-badge>`);
      el.position = "overlap";
      expect(el.getAttribute("position")).to.equal("overlap");
      expect(el.classList.contains("position-overlap")).to.equal(true);

      el.position = "inline";
      expect(el.getAttribute("position")).to.equal("inline");
      expect(el.classList.contains("position-overlap")).to.equal(false);
    });

    it("removes max attribute on invalid max property value", async () => {
      const el = await fixture(html`<ds-badge value="50" max="20"></ds-badge>`);
      el.max = "invalid";
      expect(el.hasAttribute("max")).to.equal(false);
      expect(el.max).to.equal(99);
    });

    it("removes color attribute when color property is empty", async () => {
      const el = await fixture(html`<ds-badge color="error"></ds-badge>`);
      el.color = "";
      expect(el.hasAttribute("color")).to.equal(false);
      expect(el.color).to.equal("error");
    });

    it("removes position attribute on invalid position property value", async () => {
      const el = await fixture(html`<ds-badge position="overlap"></ds-badge>`);
      el.position = "invalid";
      expect(el.hasAttribute("position")).to.equal(false);
      expect(el.position).to.equal("inline");
    });
  });

  describe("Events", () => {
    it("does not emit custom events on update", async () => {
      const el = await fixture(html`<ds-badge value="1"></ds-badge>`);
      let fired = false;
      el.addEventListener("ds-badge:change", () => {
        fired = true;
      });

      el.value = 2;
      expect(fired).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("is not focusable by default", async () => {
      const el = await fixture(html`<ds-badge value="1"></ds-badge>`);
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("uses status role on badge element", async () => {
      const el = await fixture(html`<ds-badge value="1"></ds-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.getAttribute("role")).to.equal("status");
    });

    it("supports text value content for status messaging", async () => {
      const el = await fixture(html`<ds-badge value="new"></ds-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.textContent).to.equal("new");
    });

    it("hides text content in dot mode", async () => {
      const el = await fixture(html`<ds-badge value="4" dot></ds-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.textContent).to.equal("");
    });

    it("resolves named color branches", async () => {
      const primary = await fixture(
        html`<ds-badge value="1" color="primary"></ds-badge>`,
      );
      const secondary = await fixture(
        html`<ds-badge value="1" color="secondary"></ds-badge>`,
      );
      expect(
        primary.shadowRoot
          .querySelector(".badge")
          .style.getPropertyValue("--badge-bg"),
      ).to.contain("--md-sys-color-primary");
      expect(
        secondary.shadowRoot
          .querySelector(".badge")
          .style.getPropertyValue("--badge-bg"),
      ).to.contain("--md-sys-color-secondary");
    });

    it("accepts custom CSS color strings", async () => {
      const el = await fixture(
        html`<ds-badge value="1" color="#009688"></ds-badge>`,
      );
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.style.getPropertyValue("--badge-bg")).to.equal("#009688");
    });
  });
});
