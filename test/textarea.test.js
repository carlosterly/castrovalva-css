import {
  fixture,
  html,
  expect,
  elementUpdated,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/ds-textarea.js";
import { inForm, inDisabledFieldset, entriesOf } from "./helpers/forms.js";

/**
 * Textarea Component Test Suite
 *
 * Focus: behavioral tests per CLAUDE.md testing standards
 */

describe("ds-textarea", () => {
  // ============================================
  // Fixtures
  // ============================================
  const defaultFixture = html`<ds-textarea></ds-textarea>`;

  const labeledFixture = html` <ds-textarea label="Message"></ds-textarea> `;

  const outlinedFixture = html`
    <ds-textarea variant="outlined" label="Message"></ds-textarea>
  `;

  const helperFixture = html`
    <ds-textarea helper-text="Helpful info"></ds-textarea>
  `;

  const errorFixture = html`
    <ds-textarea error error-text="Invalid input"></ds-textarea>
  `;

  // ============================================
  // Initialization
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(defaultFixture);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal("ds-textarea");
    });

    it("should render a shadow root", async () => {
      const el = await fixture(defaultFixture);
      expect(el.shadowRoot).to.exist;
    });

    it("should set default properties", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(el.variant).to.equal("filled");
      expect(el.value).to.equal("");
      expect(textarea.getAttribute("rows")).to.equal("3");
    });
  });

  // ============================================
  // Attributes & Properties
  // ============================================
  describe("Attributes & Properties", () => {
    it("should reflect variant attribute", async () => {
      const el = await fixture(outlinedFixture);
      expect(el.variant).to.equal("outlined");
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("should reflect label attribute", async () => {
      const el = await fixture(labeledFixture);
      const label = el.shadowRoot.querySelector(".label");

      expect(el.getAttribute("label")).to.equal("Message");
      expect(label.textContent).to.equal("Message");
    });

    it("should reflect helper-text attribute", async () => {
      const el = await fixture(helperFixture);
      const helper = el.shadowRoot.querySelector(".helper-text");

      expect(el.getAttribute("helper-text")).to.equal("Helpful info");
      expect(helper.textContent).to.equal("Helpful info");
    });

    it("should reflect error-text attribute", async () => {
      const el = await fixture(errorFixture);
      const errorText = el.shadowRoot.querySelector(".error-text");

      expect(el.getAttribute("error-text")).to.equal("Invalid input");
      expect(errorText.textContent).to.equal("Invalid input");
    });

    it("should reflect rows attribute on textarea", async () => {
      const el = await fixture(html` <ds-textarea rows="5"></ds-textarea> `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(textarea.getAttribute("rows")).to.equal("5");
    });

    it("should reflect maxlength attribute on textarea", async () => {
      const el = await fixture(html`
        <ds-textarea maxlength="120"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(textarea.getAttribute("maxlength")).to.equal("120");
    });

    it("should reflect disabled attribute", async () => {
      const el = await fixture(html` <ds-textarea disabled></ds-textarea> `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(el.disabled).to.be.true;
      expect(textarea.disabled).to.be.true;
    });

    it("should reflect error attribute", async () => {
      const el = await fixture(errorFixture);
      expect(el.error).to.be.true;
      expect(el.hasAttribute("error")).to.be.true;
    });

    it("should apply placeholder when no label is set", async () => {
      const el = await fixture(html`
        <ds-textarea placeholder="Enter details"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(textarea.placeholder).to.equal("Enter details");
    });

    it("should clear placeholder when label is set", async () => {
      const el = await fixture(html`
        <ds-textarea label="Notes" placeholder="Enter details"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(textarea.placeholder).to.equal("");
    });

    it("should toggle auto-resize attribute", async () => {
      const el = await fixture(html` <ds-textarea auto-resize></ds-textarea> `);

      expect(el.hasAttribute("auto-resize")).to.be.true;
      el.removeAttribute("auto-resize");
      await elementUpdated(el);
      expect(el.hasAttribute("auto-resize")).to.be.false;
    });
  });

  // ============================================
  // Value Management
  // ============================================
  describe("Value Management", () => {
    it("should return empty value by default", async () => {
      const el = await fixture(defaultFixture);
      expect(el.value).to.equal("");
    });

    it("should update value property and textarea", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      el.value = "Hello world";
      await elementUpdated(el);

      expect(el.value).to.equal("Hello world");
      expect(textarea.value).to.equal("Hello world");
    });

    it("should reflect value attribute to textarea", async () => {
      const el = await fixture(html`
        <ds-textarea value="Initial value"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");

      expect(el.value).to.equal("Initial value");
      expect(textarea.value).to.equal("Initial value");
    });

    it("should update attribute when user types", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      textarea.value = "Typed";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(el.getAttribute("value")).to.equal("Typed");
      expect(el.value).to.equal("Typed");
    });

    it("should preserve value when variant changes", async () => {
      const el = await fixture(html`
        <ds-textarea value="Persist"></ds-textarea>
      `);

      el.setAttribute("variant", "outlined");
      await elementUpdated(el);

      expect(el.value).to.equal("Persist");
      const textarea = el.shadowRoot.querySelector("textarea");
      expect(textarea.value).to.equal("Persist");
    });

    it("should not emit input event when value is set programmatically", async () => {
      const el = await fixture(defaultFixture);
      let fired = false;

      el.addEventListener("ds-textarea:input", () => {
        fired = true;
      });

      el.value = "Programmatic";
      await elementUpdated(el);

      expect(fired).to.be.false;
    });
  });

  // ============================================
  // States & Validation
  // ============================================
  describe("States & Validation", () => {
    it("should show character counter when maxlength is set", async () => {
      const el = await fixture(html`
        <ds-textarea maxlength="20"></ds-textarea>
      `);
      const counter = el.shadowRoot.querySelector(".character-counter");

      expect(counter).to.exist;
      expect(counter.textContent).to.equal("0 / 20");
    });

    it("should update character counter on input", async () => {
      const el = await fixture(html`
        <ds-textarea maxlength="10"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");
      const counter = el.shadowRoot.querySelector(".character-counter");

      textarea.value = "Hello";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(counter.textContent).to.equal("5 / 10");
    });

    it("should hide character counter when maxlength is not set", async () => {
      const el = await fixture(defaultFixture);
      const counter = el.shadowRoot.querySelector(".character-counter");
      expect(counter).to.not.exist;
    });

    it("should auto-resize when enabled", async () => {
      const el = await fixture(html`
        <ds-textarea auto-resize rows="2"></ds-textarea>
      `);
      const textarea = el.shadowRoot.querySelector("textarea");

      textarea.value = "Line 1\nLine 2\nLine 3";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(textarea.style.height).to.not.equal("");
    });

    it("should not auto-resize when disabled", async () => {
      const el = await fixture(html` <ds-textarea rows="2"></ds-textarea> `);
      el.setAttribute("auto-resize", "");
      await elementUpdated(el);
      el.removeAttribute("auto-resize");
      await elementUpdated(el);

      const textarea = el.shadowRoot.querySelector("textarea");
      textarea.value = "Line 1\nLine 2\nLine 3";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(textarea.style.height).to.equal("");
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit ds-textarea:input with detail", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      const eventPromise = oneEvent(el, "ds-textarea:input");
      textarea.value = "Input value";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      const event = await eventPromise;

      expect(event.detail.value).to.equal("Input value");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should emit ds-textarea:blur with detail", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      const eventPromise = oneEvent(el, "ds-textarea:blur");
      textarea.focus();
      textarea.blur();
      const event = await eventPromise;

      expect(event.detail.value).to.equal("");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  // ============================================
  // Interactions
  // ============================================
  describe("Interactions", () => {
    it("should allow keyboard focus", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      textarea.focus();
      expect(el.shadowRoot.activeElement).to.equal(textarea);
    });

    it("should allow blur after focus", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");

      textarea.focus();
      textarea.blur();
      expect(el.shadowRoot.activeElement).to.equal(null);
    });
  });

  // ============================================
  // Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("should expose native textarea element", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");
      expect(textarea).to.exist;
    });

    it("should keep helper text in the DOM for screen readers", async () => {
      const el = await fixture(helperFixture);
      const helper = el.shadowRoot.querySelector(".helper-text");
      expect(helper).to.exist;
      expect(helper.textContent).to.equal("Helpful info");
    });

    it("should expose the label as the textarea's accessible name", async () => {
      const el = await fixture(labeledFixture);
      const textarea = el.shadowRoot.querySelector("textarea");
      expect(textarea.getAttribute("aria-label")).to.equal("Message");
    });

    it("should not set aria-label when no label is provided", async () => {
      const el = await fixture(defaultFixture);
      const textarea = el.shadowRoot.querySelector("textarea");
      expect(textarea.hasAttribute("aria-label")).to.be.false;
    });
  });

  // Textarea wasn't form-associated at all: FormData omitted it and it
  // had no required support.
  describe("Form association", () => {
    const type = (el, text) => {
      const textarea = el.shadowRoot.querySelector("textarea");
      textarea.value = text;
      textarea.dispatchEvent(new Event("input"));
    };

    it("should submit the typed value under its name", async () => {
      const { form, el } = await inForm(
        html`<ds-textarea name="bio"></ds-textarea>`,
      );
      type(el, "Line one\nLine two");
      expect(entriesOf(form)).to.deep.equal([["bio", "Line one\nLine two"]]);
    });

    it("should submit its initial value attribute", async () => {
      const { form } = await inForm(
        html`<ds-textarea name="bio" value="Hello"></ds-textarea>`,
      );
      expect(entriesOf(form)).to.deep.equal([["bio", "Hello"]]);
    });

    it("should expose its form", async () => {
      const { form, el } = await inForm(html`<ds-textarea></ds-textarea>`);
      expect(el.form === form).to.be.true;
    });

    it("should block the form while required and empty", async () => {
      const { form, el } = await inForm(
        html`<ds-textarea name="bio" required></ds-textarea>`,
      );
      expect(el.required).to.be.true;
      expect(el.shadowRoot.querySelector("textarea").required).to.be.true;
      expect(el.validity.valueMissing).to.be.true;
      expect(form.checkValidity()).to.be.false;

      type(el, "Something");
      expect(form.checkValidity()).to.be.true;
    });

    it("should toggle required by property", async () => {
      const { form, el } = await inForm(html`<ds-textarea name="bio"></ds-textarea>`);
      el.required = true;
      expect(form.checkValidity()).to.be.false;
      el.required = false;
      expect(form.checkValidity()).to.be.true;
    });

    // The value attribute also reflects typing, so reset needs its own record
    // of the default.
    it("should restore its initial value when the form resets", async () => {
      const { form, el } = await inForm(
        html`<ds-textarea name="bio" value="Hello"></ds-textarea>`,
      );
      type(el, "Changed");
      expect(el.getAttribute("value")).to.equal("Changed");
      form.reset();
      expect(el.value).to.equal("Hello");
      expect(el.shadowRoot.querySelector("textarea").value).to.equal("Hello");
      expect(entriesOf(form)).to.deep.equal([["bio", "Hello"]]);
    });

    it("should take a value attribute set later as the new default", async () => {
      const { form, el } = await inForm(html`<ds-textarea name="bio"></ds-textarea>`);
      el.setAttribute("value", "Loaded");
      type(el, "Edited");
      form.reset();
      expect(el.value).to.equal("Loaded");
    });

    it("should be disabled by a disabled fieldset", async () => {
      const { form, fieldset, el } = await inDisabledFieldset(
        html`<ds-textarea name="bio" value="Hello"></ds-textarea>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.shadowRoot.querySelector("textarea").disabled).to.be.true;
      expect(entriesOf(form)).to.deep.equal([]);

      fieldset.disabled = false;
      expect(el.shadowRoot.querySelector("textarea").disabled).to.be.false;
      expect(entriesOf(form)).to.deep.equal([["bio", "Hello"]]);
    });

    // render() interpolated the value into the markup, so a value containing
    // </textarea> broke out of the element and was parsed as HTML.
    it("should treat markup in the value as text", async () => {
      const payload = "</textarea><img id=injected src=x>";
      const el = await fixture(html`<ds-textarea value=${payload}></ds-textarea>`);
      // Checked by identity: a failing assertion on a DOM element can hang
      // chai while it formats the message.
      expect(el.shadowRoot.querySelector("#injected") === null).to.be.true;
      expect(el.shadowRoot.querySelector("textarea").value).to.equal(payload);
    });

    // Listeners were attached once, on connect; any attribute change rebuilt
    // the textarea without them.
    it("should keep firing input events after an attribute changes", async () => {
      const el = await fixture(html`<ds-textarea></ds-textarea>`);
      el.setAttribute("error", "");
      const values = [];
      el.addEventListener("ds-textarea:input", (e) => values.push(e.detail.value));
      type(el, "x");
      expect(values).to.deep.equal(["x"]);
    });
  });
});
