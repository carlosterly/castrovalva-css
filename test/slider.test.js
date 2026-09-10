import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/ds-slider.js";

const setupSlider = async (template) => {
  const el = await fixture(template);
  const track = el.shadowRoot.querySelector(".track");
  const container = el.shadowRoot.querySelector(".slider-container");

  track.getBoundingClientRect = () => ({ left: 0, width: 100 });

  if (!container.setPointerCapture) {
    container.setPointerCapture = () => {};
  }
  if (!container.releasePointerCapture) {
    container.releasePointerCapture = () => {};
  }

  return { el, track, container };
};

describe("DSSlider", () => {
  describe("Initialization", () => {
    it("should create with defaults", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      expect(el).to.exist;
      expect(el.value).to.equal(50);
      expect(el.min).to.equal(0);
      expect(el.max).to.equal(100);
      expect(el.step).to.equal(1);
      expect(el.range).to.be.false;
    });

    it("should render core elements", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      expect(el.shadowRoot.querySelector(".slider-container")).to.exist;
      expect(el.shadowRoot.querySelector(".track")).to.exist;
      expect(el.shadowRoot.querySelector(".track-active")).to.exist;
      expect(el.shadowRoot.querySelector(".thumb-end")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("should update value when attribute changes", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="25"></ds-slider>`,
      );

      expect(el.value).to.equal(25);

      el.setAttribute("value", "60");
      await elementUpdated(el);

      expect(el.value).to.equal(60);
    });

    it("should update min and max from attributes", async () => {
      const { el } = await setupSlider(
        html`<ds-slider min="10" max="90"></ds-slider>`,
      );

      expect(el.min).to.equal(10);
      expect(el.max).to.equal(90);
    });

    it("should update step from attribute", async () => {
      const { el } = await setupSlider(html`<ds-slider step="5"></ds-slider>`);

      expect(el.step).to.equal(5);
    });

    it("should enable range mode when range is set", async () => {
      const { el } = await setupSlider(html`<ds-slider range></ds-slider>`);

      expect(el.range).to.be.true;
    });

    it("should update range values from attributes", async () => {
      const { el } = await setupSlider(
        html`<ds-slider range value-start="15" value-end="85"></ds-slider>`,
      );

      expect(el.valueStart).to.equal(15);
      expect(el.valueEnd).to.equal(85);
    });

    it("should update disabled state when attribute is set", async () => {
      const { el } = await setupSlider(html`<ds-slider disabled></ds-slider>`);

      expect(el.disabled).to.be.true;
    });

    it("should remove range mode when attribute is removed", async () => {
      const { el } = await setupSlider(html`<ds-slider range></ds-slider>`);

      el.removeAttribute("range");
      await elementUpdated(el);

      expect(el.range).to.be.false;
    });

    it("should update label when attribute changes", async () => {
      const { el } = await setupSlider(
        html`<ds-slider label="Volume"></ds-slider>`,
      );
      const label = el.shadowRoot.querySelector(".label");

      expect(label.textContent).to.equal("Volume");

      el.setAttribute("label", "Brightness");
      await elementUpdated(el);

      expect(label.textContent).to.equal("Brightness");
    });

    it("should update color when attribute changes", async () => {
      const { el } = await setupSlider(
        html`<ds-slider color="secondary"></ds-slider>`,
      );

      expect(el.style.getPropertyValue("--slider-color")).to.equal(
        "var(--md-sys-color-secondary)",
      );
    });

    it("should accept custom color values", async () => {
      const { el } = await setupSlider(
        html`<ds-slider color="#ff0000"></ds-slider>`,
      );

      expect(el.style.getPropertyValue("--slider-color")).to.equal("#ff0000");
    });

    it("should apply error color token", async () => {
      const { el } = await setupSlider(
        html`<ds-slider color="error"></ds-slider>`,
      );

      expect(el.style.getPropertyValue("--slider-color")).to.equal(
        "var(--md-sys-color-error)",
      );
    });

    it("should apply size styles when size is set", async () => {
      const { el } = await setupSlider(html`<ds-slider size="sm"></ds-slider>`);

      expect(el.style.getPropertyValue("--ds-slider-thumb-size")).to.equal(
        "calc(var(--ds-size-icon-sm) - 2px)",
      );
      expect(el.style.getPropertyValue("--ds-slider-height")).to.equal(
        "calc(var(--ds-size-icon-sm) / 4.5)",
      );
    });

    it("should clear size styles for unsupported size values", async () => {
      const { el } = await setupSlider(html`<ds-slider size="sm"></ds-slider>`);

      el.setAttribute("size", "xl");
      await elementUpdated(el);

      expect(el.style.getPropertyValue("--ds-slider-thumb-size")).to.equal("");
      expect(el.style.getPropertyValue("--ds-slider-height")).to.equal("");
    });
  });

  describe("Properties", () => {
    it("should reflect value property to attribute", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      el.value = 70;
      await elementUpdated(el);

      expect(el.getAttribute("value")).to.equal("70");
    });

    it("should reflect range property to attribute", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      el.range = true;
      await elementUpdated(el);

      expect(el.hasAttribute("range")).to.be.true;
    });

    it("should reflect valueStart and valueEnd properties", async () => {
      const { el } = await setupSlider(html`<ds-slider range></ds-slider>`);

      el.valueStart = 10;
      el.valueEnd = 90;
      await elementUpdated(el);

      expect(el.getAttribute("value-start")).to.equal("10");
      expect(el.getAttribute("value-end")).to.equal("90");
    });

    it("should reflect size property to attribute", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      el.size = "md";
      await elementUpdated(el);

      expect(el.getAttribute("size")).to.equal("md");
    });

    it("should remove size attribute when size is cleared", async () => {
      const { el } = await setupSlider(html`<ds-slider size="sm"></ds-slider>`);

      el.size = "";
      await elementUpdated(el);

      expect(el.hasAttribute("size")).to.be.false;
    });

    it("should reflect step property to attribute", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);

      el.step = 5;
      await elementUpdated(el);

      expect(el.getAttribute("step")).to.equal("5");
    });
  });

  describe("Events", () => {
    it("should emit input event on pointer interaction", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider></ds-slider>`,
      );

      const eventPromise = oneEvent(el, "input");
      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 80,
          bubbles: true,
        }),
      );

      const { detail } = await eventPromise;
      expect(detail.value).to.equal(80);
    });

    it("should emit change event on pointer release", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider></ds-slider>`,
      );

      const eventPromise = oneEvent(el, "change");
      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 40,
          bubbles: true,
        }),
      );
      container.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          clientX: 40,
          bubbles: true,
        }),
      );

      const { detail } = await eventPromise;
      expect(detail.value).to.equal(40);
    });

    it("should emit range details in input event when range", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range value-start="20" value-end="80"></ds-slider>`,
      );

      const eventPromise = oneEvent(el, "input");
      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 10,
          bubbles: true,
        }),
      );

      const { detail } = await eventPromise;
      expect(detail.valueStart).to.equal(10);
    });

    it("should emit range details in change event when range", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range value-start="30" value-end="70"></ds-slider>`,
      );

      const eventPromise = oneEvent(el, "change");
      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 90,
          bubbles: true,
        }),
      );
      container.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 1,
          clientX: 90,
          bubbles: true,
        }),
      );

      const { detail } = await eventPromise;
      expect(detail.valueEnd).to.equal(90);
    });
  });

  describe("Visual Updates", () => {
    it("should show range thumb when range is enabled", async () => {
      const { el } = await setupSlider(html`<ds-slider range></ds-slider>`);
      const thumbStart = el.shadowRoot.querySelector(".thumb-start");

      expect(thumbStart.style.display).to.equal("block");
    });

    it("should hide range thumb when range is disabled", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);
      const thumbStart = el.shadowRoot.querySelector(".thumb-start");

      expect(thumbStart.style.display).to.equal("none");
    });

    it("should update value display for single slider", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider></ds-slider>`,
      );
      const valueDisplay = el.shadowRoot.querySelector(".value-display");

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 33,
          bubbles: true,
        }),
      );

      expect(valueDisplay.textContent).to.equal("33");
    });

    it("should update value display for range slider", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range value-start="20" value-end="80"></ds-slider>`,
      );
      const valueDisplay = el.shadowRoot.querySelector(".value-display");

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 10,
          bubbles: true,
        }),
      );

      expect(valueDisplay.textContent).to.equal("10 - 80");
    });

    it("should update track active transform for single mode", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider></ds-slider>`,
      );
      const trackActive = el.shadowRoot.querySelector(".track-active");

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 50,
          bubbles: true,
        }),
      );

      expect(trackActive.style.transform).to.contain("scaleX");
    });
  });

  describe("Interaction", () => {
    it("should update value when dragged", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 30,
          bubbles: true,
        }),
      );
      container.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 1,
          clientX: 70,
          bubbles: true,
        }),
      );

      expect(el.value).to.equal(70);
    });

    it("should not update when disabled", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider disabled value="50"></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 80,
          bubbles: true,
        }),
      );

      expect(el.value).to.equal(50);
    });

    it("should add disabled class when disabled", async () => {
      const { el } = await setupSlider(html`<ds-slider disabled></ds-slider>`);
      const container = el.shadowRoot.querySelector(".slider-container");

      expect(container.classList.contains("disabled")).to.be.true;
    });

    it("should remove disabled class when enabled", async () => {
      const { el } = await setupSlider(html`<ds-slider disabled></ds-slider>`);
      const container = el.shadowRoot.querySelector(".slider-container");

      el.removeAttribute("disabled");
      await elementUpdated(el);

      expect(container.classList.contains("disabled")).to.be.false;
    });

    it("should snap values to step", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider min="0" max="100" step="10"></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 27,
          bubbles: true,
        }),
      );

      expect(el.value).to.equal(30);
    });

    it("should snap range start to step increments", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range min="0" max="100" step="10"></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 23,
          bubbles: true,
        }),
      );

      expect(el.valueStart).to.equal(20);
    });

    it("should keep range start below end", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range value-start="40" value-end="60"></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 90,
          bubbles: true,
        }),
      );

      expect(el.valueEnd).to.equal(90);
      expect(el.valueStart).to.equal(40);
    });

    it("should update range start when dragging near start", async () => {
      const { el, container } = await setupSlider(
        html`<ds-slider range value-start="30" value-end="70"></ds-slider>`,
      );

      container.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 1,
          clientX: 10,
          bubbles: true,
        }),
      );

      expect(el.valueStart).to.equal(10);
      expect(el.valueEnd).to.equal(70);
    });
  });

  describe("Keyboard", () => {
    const key = (target, k) =>
      target.dispatchEvent(
        new KeyboardEvent("keydown", { key: k, bubbles: true }),
      );

    it("should increase the value on ArrowRight by one step", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" step="1"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowRight");

      expect(el.value).to.equal(51);
    });

    it("should decrease the value on ArrowLeft by one step", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" step="1"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowLeft");

      expect(el.value).to.equal(49);
    });

    it("should treat ArrowUp / ArrowDown like ArrowRight / ArrowLeft", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" step="5"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowUp");
      expect(el.value).to.equal(55);

      key(thumb, "ArrowDown");
      expect(el.value).to.equal(50);
    });

    it("should honour the step increment", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="20" min="0" max="100" step="10"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowRight");

      expect(el.value).to.equal(30);
    });

    it("should jump to min on Home and max on End", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" min="10" max="90"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "Home");
      expect(el.value).to.equal(10);

      key(thumb, "End");
      expect(el.value).to.equal(90);
    });

    it("should move by a larger increment on PageUp / PageDown", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" min="0" max="100" step="1"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "PageUp");
      expect(el.value).to.equal(60);

      key(thumb, "PageDown");
      expect(el.value).to.equal(50);
    });

    it("should clamp at the maximum", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="100" min="0" max="100"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowRight");

      expect(el.value).to.equal(100);
    });

    it("should not respond to keys when disabled", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" disabled></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      key(thumb, "ArrowRight");

      expect(el.value).to.equal(50);
    });

    it("should emit input and change on a keyboard change", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      const inputEvent = oneEvent(el, "input");
      key(thumb, "ArrowRight");
      const { detail: inputDetail } = await inputEvent;
      expect(inputDetail.value).to.equal(51);

      const changeEvent = oneEvent(el, "change");
      key(thumb, "ArrowRight");
      const { detail: changeDetail } = await changeEvent;
      expect(changeDetail.value).to.equal(52);
    });

    it("should keep the range start thumb from crossing the end thumb", async () => {
      const { el } = await setupSlider(
        html`<ds-slider range value-start="70" value-end="75"></ds-slider>`,
      );
      const thumbStart = el.shadowRoot.querySelector(".thumb-start");

      key(thumbStart, "End");

      expect(el.valueStart).to.equal(75);
      expect(el.valueEnd).to.equal(75);
    });

    it("should keep the range end thumb from crossing the start thumb", async () => {
      const { el } = await setupSlider(
        html`<ds-slider range value-start="25" value-end="30"></ds-slider>`,
      );
      const thumbEnd = el.shadowRoot.querySelector(".thumb-end");

      key(thumbEnd, "Home");

      expect(el.valueEnd).to.equal(25);
      expect(el.valueStart).to.equal(25);
    });
  });

  describe("Accessibility", () => {
    it("should render a label element", async () => {
      const { el } = await setupSlider(
        html`<ds-slider label="Label"></ds-slider>`,
      );
      const label = el.shadowRoot.querySelector(".label");

      expect(label).to.exist;
      expect(label.textContent).to.equal("Label");
    });

    it("should render a value display element", async () => {
      const { el } = await setupSlider(html`<ds-slider></ds-slider>`);
      const valueDisplay = el.shadowRoot.querySelector(".value-display");

      expect(valueDisplay).to.exist;
    });

    it("should expose the thumb as a focusable slider to assistive tech", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="40" min="0" max="100"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      expect(thumb.getAttribute("role")).to.equal("slider");
      expect(thumb.getAttribute("tabindex")).to.equal("0");
      expect(thumb.getAttribute("aria-orientation")).to.equal("horizontal");
      expect(thumb.getAttribute("aria-valuemin")).to.equal("0");
      expect(thumb.getAttribute("aria-valuemax")).to.equal("100");
      expect(thumb.getAttribute("aria-valuenow")).to.equal("40");
    });

    it("should use the label attribute as the thumb's accessible name", async () => {
      const { el } = await setupSlider(
        html`<ds-slider label="Volume"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      expect(thumb.getAttribute("aria-label")).to.equal("Volume");
    });

    it("should update aria-valuenow after a keyboard change", async () => {
      const { el } = await setupSlider(
        html`<ds-slider value="50" step="1"></ds-slider>`,
      );
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );

      expect(thumb.getAttribute("aria-valuenow")).to.equal("51");
    });

    it("should remove the thumb from the tab order when disabled", async () => {
      const { el } = await setupSlider(html`<ds-slider disabled></ds-slider>`);
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      expect(thumb.getAttribute("tabindex")).to.equal("-1");
      expect(thumb.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should restore the thumb to the tab order when re-enabled", async () => {
      const { el } = await setupSlider(html`<ds-slider disabled></ds-slider>`);
      const thumb = el.shadowRoot.querySelector(".thumb-end");

      el.removeAttribute("disabled");
      await elementUpdated(el);

      expect(thumb.getAttribute("tabindex")).to.equal("0");
      expect(thumb.hasAttribute("aria-disabled")).to.be.false;
    });

    it("should expose two sliders with bounded ranges in range mode", async () => {
      const { el } = await setupSlider(
        html`<ds-slider range value-start="20" value-end="80"></ds-slider>`,
      );
      const thumbStart = el.shadowRoot.querySelector(".thumb-start");
      const thumbEnd = el.shadowRoot.querySelector(".thumb-end");

      expect(thumbStart.getAttribute("role")).to.equal("slider");
      expect(thumbStart.getAttribute("tabindex")).to.equal("0");
      expect(thumbStart.getAttribute("aria-valuenow")).to.equal("20");
      expect(thumbStart.getAttribute("aria-valuemax")).to.equal("80");

      expect(thumbEnd.getAttribute("aria-valuenow")).to.equal("80");
      expect(thumbEnd.getAttribute("aria-valuemin")).to.equal("20");
    });
  });
});
