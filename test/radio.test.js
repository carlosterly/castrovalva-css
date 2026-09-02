import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/ds-radio.js";

// Test suite for ds-radio behavior and accessibility.

describe("DSRadio", () => {
  describe("Initialization", () => {
    it("should create with defaults", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      expect(el).to.exist;
      expect(el.checked).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.error).to.be.false;
      expect(el.name).to.equal("");
      expect(el.value).to.equal("");
    });

    it("should set base ARIA attributes on connect", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      expect(el.getAttribute("role")).to.equal("radio");
      expect(el.getAttribute("aria-checked")).to.equal("false");
      expect(el.getAttribute("aria-disabled")).to.equal("false");
      expect(el.getAttribute("tabindex")).to.equal("0");
    });
  });

  describe("Rendering", () => {
    it("should render shadow DOM structure", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      const radio = el.shadowRoot.querySelector(".radio");
      const stateLayer = el.shadowRoot.querySelector(".state-layer");
      const outerCircle = el.shadowRoot.querySelector(".outer-circle");
      const innerCircle = el.shadowRoot.querySelector(".inner-circle");

      expect(radio).to.exist;
      expect(stateLayer).to.exist;
      expect(outerCircle).to.exist;
      expect(innerCircle).to.exist;
    });

    it("should render checked state when attribute is set", async () => {
      const el = await fixture(html`<ds-radio checked></ds-radio>`);

      expect(el.checked).to.be.true;
      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should render disabled state when attribute is set", async () => {
      const el = await fixture(html`<ds-radio disabled></ds-radio>`);

      expect(el.disabled).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should render error state when attribute is set", async () => {
      const el = await fixture(html`<ds-radio error></ds-radio>`);

      expect(el.error).to.be.true;
    });
  });

  describe("Attributes", () => {
    it("should treat checked attribute as true when present", async () => {
      const el = await fixture(html`<ds-radio checked="false"></ds-radio>`);

      expect(el.checked).to.be.true;
    });

    it("should reflect checked state when attribute is removed", async () => {
      const el = await fixture(html`<ds-radio checked></ds-radio>`);

      el.removeAttribute("checked");
      await elementUpdated(el);

      expect(el.checked).to.be.false;
      expect(el.getAttribute("aria-checked")).to.equal("false");
    });

    it("should update name when attribute changes", async () => {
      const el = await fixture(html`<ds-radio name="alpha"></ds-radio>`);

      expect(el.name).to.equal("alpha");

      el.setAttribute("name", "beta");
      await elementUpdated(el);

      expect(el.name).to.equal("beta");
    });

    it("should update value when attribute changes", async () => {
      const el = await fixture(html`<ds-radio value="one"></ds-radio>`);

      expect(el.value).to.equal("one");

      el.setAttribute("value", "two");
      await elementUpdated(el);

      expect(el.value).to.equal("two");
    });

    it("should update disabled aria and tabindex when disabled changes", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.setAttribute("disabled", "");
      await elementUpdated(el);

      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should apply size styles when size is set", async () => {
      const el = await fixture(html`<ds-radio size="sm"></ds-radio>`);

      expect(el.style.getPropertyValue("--ds-radio-size")).to.equal(
        "var(--ds-size-icon-sm)",
      );
      expect(el.style.getPropertyValue("--ds-radio-dot-size")).to.equal(
        "calc(var(--ds-size-icon-sm) / 2)",
      );
      expect(el.style.getPropertyValue("--ds-radio-state-layer-size")).to.equal(
        "var(--ds-size-control-sm)",
      );
    });

    it("should clear size styles for unsupported size values", async () => {
      const el = await fixture(html`<ds-radio size="sm"></ds-radio>`);

      el.setAttribute("size", "xl");
      await elementUpdated(el);

      expect(el.style.getPropertyValue("--ds-radio-size")).to.equal("");
      expect(el.style.getPropertyValue("--ds-radio-dot-size")).to.equal("");
      expect(el.style.getPropertyValue("--ds-radio-state-layer-size")).to.equal(
        "",
      );
    });
  });

  describe("Properties", () => {
    it("should update checked property", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.checked = true;
      await elementUpdated(el);

      expect(el.hasAttribute("checked")).to.be.true;
      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should update disabled property", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.disabled = true;
      await elementUpdated(el);

      expect(el.hasAttribute("disabled")).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should update error property", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.error = true;
      await elementUpdated(el);

      expect(el.hasAttribute("error")).to.be.true;
    });

    it("should update name property", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.name = "group-1";
      await elementUpdated(el);

      expect(el.getAttribute("name")).to.equal("group-1");
    });

    it("should update value property", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.value = "value-1";
      await elementUpdated(el);

      expect(el.getAttribute("value")).to.equal("value-1");
    });
  });

  describe("Events", () => {
    it("should emit ds-radio:change on click", async () => {
      const el = await fixture(html`<ds-radio name="g" value="a"></ds-radio>`);

      setTimeout(() => el.click());
      const { detail } = await oneEvent(el, "ds-radio:change");

      expect(detail.checked).to.be.true;
      expect(detail.value).to.equal("a");
      expect(detail.name).to.equal("g");
    });

    it("should not emit ds-radio:change when already checked", async () => {
      const el = await fixture(html`<ds-radio checked></ds-radio>`);

      let fired = false;
      el.addEventListener("ds-radio:change", () => {
        fired = true;
      });

      el.click();
      await elementUpdated(el);

      expect(fired).to.be.false;
    });

    it("should emit ds-radio:change on Space key", async () => {
      const el = await fixture(html`<ds-radio name="g" value="b"></ds-radio>`);

      const eventPromise = oneEvent(el, "ds-radio:change");
      const event = new KeyboardEvent("keydown", { key: " " });
      el.dispatchEvent(event);

      const { detail } = await eventPromise;

      expect(detail.checked).to.be.true;
      expect(detail.value).to.equal("b");
    });

    it("should emit ds-radio:change on Enter key", async () => {
      const el = await fixture(html`<ds-radio name="g" value="c"></ds-radio>`);

      const eventPromise = oneEvent(el, "ds-radio:change");
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      el.dispatchEvent(event);

      const { detail } = await eventPromise;

      expect(detail.checked).to.be.true;
      expect(detail.value).to.equal("c");
    });
  });

  describe("Interaction", () => {
    it("should toggle to checked on click", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      expect(el.checked).to.be.false;

      el.click();
      await elementUpdated(el);

      expect(el.checked).to.be.true;
    });

    it("should not toggle when disabled", async () => {
      const el = await fixture(html`<ds-radio disabled></ds-radio>`);

      el.click();
      await elementUpdated(el);

      expect(el.checked).to.be.false;
    });

    it("should update radio group when checked", async () => {
      const el = await fixture(html`
        <div>
          <ds-radio name="group" value="a"></ds-radio>
          <ds-radio name="group" value="b" checked></ds-radio>
        </div>
      `);

      const radios = el.querySelectorAll("ds-radio");
      radios[0].checked = true;
      await elementUpdated(radios[0]);

      expect(radios[0].checked).to.be.true;
      expect(radios[1].checked).to.be.false;
    });
  });

  describe("Keyboard Navigation", () => {
    it("should move to next radio with ArrowRight", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio name="nav" value="one" checked></ds-radio>
          <ds-radio name="nav" value="two"></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      radios[0].dispatchEvent(event);
      await elementUpdated(radios[1]);

      expect(radios[1].checked).to.be.true;
    });

    it("should move to previous radio with ArrowLeft", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio name="nav" value="one"></ds-radio>
          <ds-radio name="nav" value="two" checked></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      radios[1].dispatchEvent(event);
      await elementUpdated(radios[0]);

      expect(radios[0].checked).to.be.true;
    });

    it("should wrap to first radio with ArrowRight", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio name="wrap" value="one"></ds-radio>
          <ds-radio name="wrap" value="two" checked></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      radios[1].dispatchEvent(event);
      await elementUpdated(radios[0]);

      expect(radios[0].checked).to.be.true;
    });

    it("should skip disabled radios during navigation", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio name="skip" value="one" checked></ds-radio>
          <ds-radio name="skip" value="two" disabled></ds-radio>
          <ds-radio name="skip" value="three"></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      radios[0].dispatchEvent(event);
      await elementUpdated(radios[2]);

      expect(radios[2].checked).to.be.true;
    });

    it("should do nothing when no name is set", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio value="one" checked></ds-radio>
          <ds-radio value="two"></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      radios[0].dispatchEvent(event);
      await elementUpdated(radios[1]);

      expect(radios[1].checked).to.be.false;
    });
  });

  describe("Focus Management", () => {
    it("should apply focused class on focus", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.focus();
      await elementUpdated(el);

      const radio = el.shadowRoot.querySelector(".radio");
      expect(radio.classList.contains("focused")).to.be.true;
    });

    it("should remove focused class on blur", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.focus();
      await elementUpdated(el);

      el.blur();
      await elementUpdated(el);

      const radio = el.shadowRoot.querySelector(".radio");
      expect(radio.classList.contains("focused")).to.be.false;
    });
  });

  describe("Accessibility", () => {
    it("should be focusable when enabled", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.focus();
      expect(document.activeElement).to.equal(el);
    });

    it("should not be focusable when disabled", async () => {
      const el = await fixture(html`<ds-radio disabled></ds-radio>`);

      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should update aria-checked when checked changes", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.checked = true;
      await elementUpdated(el);

      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should update aria-disabled when disabled changes", async () => {
      const el = await fixture(html`<ds-radio></ds-radio>`);

      el.disabled = true;
      await elementUpdated(el);

      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });
  });

  describe("Integration", () => {
    it("should keep only one radio checked in a group", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-radio name="group" value="one" checked></ds-radio>
          <ds-radio name="group" value="two"></ds-radio>
        </div>
      `);

      const radios = wrapper.querySelectorAll("ds-radio");
      radios[1].click();
      await elementUpdated(radios[1]);

      expect(radios[0].checked).to.be.false;
      expect(radios[1].checked).to.be.true;
    });
  });
});
