import { fixture, expect, html } from "@open-wc/testing";
import {
  applyFocusRing,
  initFocusRings,
  removeFocusRing,
} from "../src/utils/focus-ring.js";

describe("Focus ring utility", () => {
  describe("Attributes", () => {
    it("initializes data-focus-ring targets", async () => {
      const el = await fixture(html`<button data-focus-ring>Init me</button>`);

      initFocusRings();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      el.focus();

      expect(el.classList.contains("ds-focus-visible")).to.equal(true);
    });
  });

  describe("Properties", () => {
    it("applies data attribute CSS custom properties", async () => {
      const el = await fixture(html`
        <button
          data-focus-ring
          data-focus-ring-color="red"
          data-focus-ring-width="3px"
          data-focus-ring-offset="4px"
          data-focus-ring-radius="12px">
          Custom ring
        </button>
      `);

      applyFocusRing(el);

      expect(
        el.style.getPropertyValue("--ds-focus-ring-color").trim(),
      ).to.equal("red");
      expect(
        el.style.getPropertyValue("--ds-focus-ring-width").trim(),
      ).to.equal("3px");
      expect(
        el.style.getPropertyValue("--ds-focus-ring-offset").trim(),
      ).to.equal("4px");
      expect(
        el.style.getPropertyValue("--ds-focus-ring-radius").trim(),
      ).to.equal("12px");
    });

    it("supports ringSize option and legacy width option", async () => {
      const ringSizeEl = await fixture(html`<button>Ring size</button>`);
      applyFocusRing(ringSizeEl, { ringSize: "5px" });
      expect(
        ringSizeEl.style.getPropertyValue("--ds-focus-ring-width").trim(),
      ).to.equal("5px");

      const legacyEl = await fixture(html`<button>Legacy width</button>`);
      const legacyOptions = {};
      legacyOptions["width"] = "6px";
      applyFocusRing(legacyEl, legacyOptions);
      expect(
        legacyEl.style.getPropertyValue("--ds-focus-ring-width").trim(),
      ).to.equal("6px");
    });
  });

  describe("Events", () => {
    it("does not emit custom events during apply/remove", async () => {
      const el = await fixture(
        html`<button data-focus-ring>No events</button>`,
      );
      let fired = false;

      el.addEventListener("ds-focus-ring:change", () => {
        fired = true;
      });

      applyFocusRing(el);
      removeFocusRing(el);

      expect(fired).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("shows ring on keyboard focus and hides on blur", async () => {
      const el = await fixture(html`<button data-focus-ring>Click me</button>`);

      applyFocusRing(el);
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      el.focus();

      expect(el.classList.contains("ds-focus-visible")).to.equal(true);

      el.blur();
      expect(el.classList.contains("ds-focus-visible")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("removes focus ring handlers and classes", async () => {
      const el = await fixture(
        html`<button data-focus-ring>Remove me</button>`,
      );

      const teardown = applyFocusRing(el);
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      el.focus();
      expect(el.classList.contains("ds-focus-visible")).to.equal(true);

      removeFocusRing(el);
      el.classList.remove("ds-focus-visible");
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      el.focus();

      expect(el.classList.contains("ds-focus-visible")).to.equal(false);
      teardown();
    });
  });
});
