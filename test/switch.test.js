import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/ds-switch.js";

describe("DSSwitch", () => {
  describe("Initialization", () => {
    it("should create with defaults", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      expect(el).to.exist;
      expect(el.checked).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.showIcons).to.be.false;
    });

    it("should set base ARIA attributes on connect", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      expect(el.getAttribute("role")).to.equal("switch");
      expect(el.getAttribute("aria-checked")).to.equal("false");
      expect(el.getAttribute("aria-disabled")).to.equal("false");
      expect(el.getAttribute("tabindex")).to.equal("0");
    });
  });

  describe("Rendering", () => {
    it("should render shadow DOM structure", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      expect(el.shadowRoot.querySelector(".switch-track")).to.exist;
      expect(el.shadowRoot.querySelector(".state-layer")).to.exist;
      expect(el.shadowRoot.querySelector(".switch-handle")).to.exist;
      expect(el.shadowRoot.querySelector(".icon")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("should treat checked attribute as true when present", async () => {
      const el = await fixture(html`<ds-switch checked></ds-switch>`);

      expect(el.checked).to.be.true;
    });

    it('should treat checked="false" as true', async () => {
      const el = await fixture(html`<ds-switch checked="false"></ds-switch>`);

      expect(el.checked).to.be.true;
    });

    it("should update aria-checked when checked changes", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.setAttribute("checked", "");
      await elementUpdated(el);

      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should update aria-checked when checked is removed", async () => {
      const el = await fixture(html`<ds-switch checked></ds-switch>`);

      el.removeAttribute("checked");
      await elementUpdated(el);

      expect(el.getAttribute("aria-checked")).to.equal("false");
    });

    it("should update disabled state when attribute is set", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.setAttribute("disabled", "");
      await elementUpdated(el);

      expect(el.disabled).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it('should treat disabled="false" as true', async () => {
      const el = await fixture(html`<ds-switch disabled="false"></ds-switch>`);

      expect(el.disabled).to.be.true;
    });

    it("should update disabled state when attribute is removed", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);

      el.removeAttribute("disabled");
      await elementUpdated(el);

      expect(el.disabled).to.be.false;
      expect(el.getAttribute("aria-disabled")).to.equal("false");
      expect(el.getAttribute("tabindex")).to.equal("0");
    });

    it("should set showIcons when show-icons attribute is present", async () => {
      const el = await fixture(html`<ds-switch show-icons></ds-switch>`);

      expect(el.showIcons).to.be.true;
    });

    it('should treat show-icons="false" as true', async () => {
      const el = await fixture(
        html`<ds-switch show-icons="false"></ds-switch>`,
      );

      expect(el.showIcons).to.be.true;
    });

    it("should unset showIcons when show-icons attribute is removed", async () => {
      const el = await fixture(html`<ds-switch show-icons></ds-switch>`);

      el.removeAttribute("show-icons");
      await elementUpdated(el);

      expect(el.showIcons).to.be.false;
    });

    it("should apply size styles when size is set", async () => {
      const el = await fixture(html`<ds-switch size="sm"></ds-switch>`);

      expect(el.style.getPropertyValue("--ds-switch-icon-size")).to.equal(
        "var(--ds-size-icon-sm)",
      );
      expect(el.style.getPropertyValue("--ds-switch-track-height")).to.equal(
        "var(--ds-size-control-sm)",
      );
      expect(el.style.getPropertyValue("--ds-switch-track-width")).to.equal(
        "calc(var(--ds-size-control-sm) + 20px)",
      );
    });

    it("should clear size styles for unsupported size values", async () => {
      const el = await fixture(html`<ds-switch size="sm"></ds-switch>`);

      el.setAttribute("size", "xl");
      await elementUpdated(el);

      expect(el.style.getPropertyValue("--ds-switch-icon-size")).to.equal("");
      expect(el.style.getPropertyValue("--ds-switch-track-height")).to.equal(
        "",
      );
      expect(el.style.getPropertyValue("--ds-switch-track-width")).to.equal("");
    });
  });

  describe("Properties", () => {
    it("should reflect checked property to attribute", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.checked = true;
      await elementUpdated(el);

      expect(el.hasAttribute("checked")).to.be.true;
    });

    it("should remove checked attribute when property is false", async () => {
      const el = await fixture(html`<ds-switch checked></ds-switch>`);

      el.checked = false;
      await elementUpdated(el);

      expect(el.hasAttribute("checked")).to.be.false;
    });

    it("should reflect disabled property to attribute", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.disabled = true;
      await elementUpdated(el);

      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should remove disabled attribute when property is false", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);

      el.disabled = false;
      await elementUpdated(el);

      expect(el.hasAttribute("disabled")).to.be.false;
    });

    it("should reflect showIcons property to attribute", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.showIcons = true;
      await elementUpdated(el);

      expect(el.hasAttribute("show-icons")).to.be.true;
    });

    it("should remove show-icons attribute when property is false", async () => {
      const el = await fixture(html`<ds-switch show-icons></ds-switch>`);

      el.showIcons = false;
      await elementUpdated(el);

      expect(el.hasAttribute("show-icons")).to.be.false;
    });

    it("should reflect size property to attribute", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.size = "md";
      await elementUpdated(el);

      expect(el.getAttribute("size")).to.equal("md");
    });
  });

  describe("Methods", () => {
    it("should toggle on when calling toggle", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.toggle();
      await elementUpdated(el);

      expect(el.checked).to.be.true;
    });

    it("should toggle off when calling toggle again", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.toggle();
      el.toggle();
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });

    it("should emit ds-switch:change when calling toggle", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      const eventPromise = oneEvent(el, "ds-switch:change");
      el.toggle();

      const { detail } = await eventPromise;
      expect(detail.checked).to.be.true;
    });
  });

  describe("Events", () => {
    it("should emit ds-switch:change on click", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      setTimeout(() => el.click());
      const { detail } = await oneEvent(el, "ds-switch:change");

      expect(detail.checked).to.be.true;
    });

    it("should toggle off on second click", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.click();
      await elementUpdated(el);

      el.click();
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });

    it("should emit ds-switch:change with false when toggling off", async () => {
      const el = await fixture(html`<ds-switch checked></ds-switch>`);

      const eventPromise = oneEvent(el, "ds-switch:change");
      el.click();

      const { detail } = await eventPromise;
      expect(detail.checked).to.be.false;
    });

    it("should not emit ds-switch:change when disabled", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);
      let fired = false;

      el.addEventListener("ds-switch:change", () => {
        fired = true;
      });

      el.click();
      await elementUpdated(el);

      expect(fired).to.be.false;
      expect(el.checked).to.be.false;
    });

    it("should emit ds-switch:change on Space key", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      const eventPromise = oneEvent(el, "ds-switch:change");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

      const { detail } = await eventPromise;
      expect(detail.checked).to.be.true;
    });

    it("should emit ds-switch:change on Enter key", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      const eventPromise = oneEvent(el, "ds-switch:change");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      const { detail } = await eventPromise;
      expect(detail.checked).to.be.true;
    });

    it("should bubble ds-switch:change events", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-switch></ds-switch>
        </div>
      `);
      const el = wrapper.querySelector("ds-switch");

      const eventPromise = oneEvent(wrapper, "ds-switch:change");
      el.click();

      const { detail } = await eventPromise;
      expect(detail.checked).to.be.true;
    });
  });

  describe("Keyboard Navigation", () => {
    it("should ignore unrelated keys", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });
    it("should not toggle on Space when disabled", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);

      el.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });

    it("should not toggle on Enter when disabled", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);

      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });
  });

  describe("Focus Management", () => {
    it("should apply focused class on focus", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.focus();
      await elementUpdated(el);

      const track = el.shadowRoot.querySelector(".switch-track");
      expect(track.classList.contains("focused")).to.be.true;
    });

    it("should remove focused class on blur", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.focus();
      await elementUpdated(el);

      el.blur();
      await elementUpdated(el);

      const track = el.shadowRoot.querySelector(".switch-track");
      expect(track.classList.contains("focused")).to.be.false;
    });

    it("should be focusable when enabled", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.focus();
      expect(document.activeElement).to.equal(el);
    });
  });

  describe("Accessibility", () => {
    it("should expose switch role", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      expect(el.getAttribute("role")).to.equal("switch");
    });

    it("should update aria-checked when checked changes", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.checked = true;
      await elementUpdated(el);

      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should update aria-disabled when disabled changes", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      el.disabled = true;
      await elementUpdated(el);

      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should set tabindex to -1 when disabled", async () => {
      const el = await fixture(html`<ds-switch disabled></ds-switch>`);

      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should set tabindex to 0 when enabled", async () => {
      const el = await fixture(html`<ds-switch></ds-switch>`);

      expect(el.getAttribute("tabindex")).to.equal("0");
    });
  });
});
