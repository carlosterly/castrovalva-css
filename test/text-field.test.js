import {
  fixture,
  html,
  expect,
  elementUpdated,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/text-field/text-field.js";
import { inForm, inDisabledFieldset, entriesOf } from "./helpers/forms.js";

/**
 * Text Field Component Test Suite
 *
 * Focus: behavioral tests per CLAUDE.md testing standards
 */

describe("ds-text-field", () => {
  // ============================================
  // Fixtures
  // ============================================
  const defaultFixture = html`<ds-text-field></ds-text-field>`;

  const labeledFixture = html` <ds-text-field label="Email"></ds-text-field> `;

  const outlinedFixture = html`
    <ds-text-field variant="outlined" label="Name"></ds-text-field>
  `;

  const supportingTextFixture = html`
    <ds-text-field supporting-text="Helper text"></ds-text-field>
  `;

  const errorFixture = html`
    <ds-text-field error error-text="Invalid input"></ds-text-field>
  `;

  // ============================================
  // Initialization
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(defaultFixture);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal("ds-text-field");
    });

    it("should render shadow root", async () => {
      const el = await fixture(defaultFixture);
      expect(el.shadowRoot).to.exist;
    });

    it("should set default attributes", async () => {
      const el = await fixture(defaultFixture);
      expect(el.variant).to.equal("filled");
      expect(el.type).to.equal("text");
      expect(el.label).to.equal("");
      expect(el.value).to.equal("");
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

    it("should reflect type attribute", async () => {
      const el = await fixture(html`
        <ds-text-field type="email"></ds-text-field>
      `);
      expect(el.type).to.equal("email");
      const input = el.shadowRoot.querySelector("input");
      expect(input.type).to.equal("email");
    });

    it("should reflect label attribute", async () => {
      const el = await fixture(labeledFixture);
      expect(el.label).to.equal("Email");
      const label = el.shadowRoot.querySelector(".label");
      expect(label.textContent).to.equal("Email");
    });

    it("should reflect value attribute to input", async () => {
      const el = await fixture(html`
        <ds-text-field value="initial"></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      expect(el.value).to.equal("initial");
      expect(input.value).to.equal("initial");
    });

    it("should update value property and input", async () => {
      const el = await fixture(defaultFixture);
      el.value = "new value";
      await elementUpdated(el);

      const input = el.shadowRoot.querySelector("input");
      expect(el.value).to.equal("new value");
      expect(input.value).to.equal("new value");
    });

    it("should reflect disabled attribute", async () => {
      const el = await fixture(html`
        <ds-text-field disabled></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;
    });

    it("should reflect required attribute", async () => {
      const el = await fixture(html`
        <ds-text-field label="Name" required></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      const label = el.shadowRoot.querySelector(".label");
      expect(el.required).to.be.true;
      expect(input.required).to.be.true;
      expect(label.textContent).to.include("*");
    });

    it("should set placeholder on input", async () => {
      const el = await fixture(html`
        <ds-text-field placeholder="Enter text"></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      expect(input.placeholder).to.equal("Enter text");
    });
  });

  // ============================================
  // Slots
  // ============================================
  describe("Slots", () => {
    it("should render leading icon slot content", async () => {
      const el = await fixture(html`
        <ds-text-field>
          <span slot="leading-icon">🔍</span>
        </ds-text-field>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="leading-icon"]');
      const assigned = slot.assignedElements({ flatten: true });
      expect(assigned).to.have.lengthOf(1);
    });

    it("should render trailing icon slot content", async () => {
      const el = await fixture(html`
        <ds-text-field>
          <span slot="trailing-icon">✓</span>
        </ds-text-field>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="trailing-icon"]');
      const assigned = slot.assignedElements({ flatten: true });
      expect(assigned).to.have.lengthOf(1);
    });
  });

  // ============================================
  // States & Validation
  // ============================================
  describe("States & Validation", () => {
    it("should show error text when error is set", async () => {
      const el = await fixture(errorFixture);
      const supportingText = el.shadowRoot.querySelector(".supporting-text");
      expect(supportingText.textContent.trim()).to.equal("Invalid input");
    });

    it("should mark aria-invalid when error is set", async () => {
      const el = await fixture(errorFixture);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-invalid")).to.equal("true");
    });

    it("should set aria-describedby when supporting text exists", async () => {
      const el = await fixture(supportingTextFixture);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-describedby")).to.equal(
        "supporting-text",
      );
    });

    it("should show character counter when enabled", async () => {
      const el = await fixture(html`
        <ds-text-field maxlength="50" show-counter></ds-text-field>
      `);
      const counter = el.shadowRoot.querySelector(".character-counter");
      expect(counter).to.exist;
      expect(counter.textContent).to.equal("0 / 50");
    });

    it("should update character counter on input", async () => {
      const el = await fixture(html`
        <ds-text-field maxlength="50" show-counter></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      const counter = el.shadowRoot.querySelector(".character-counter");

      input.value = "Hello";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(counter.textContent).to.equal("5 / 50");
    });

    it("should validate required fields", async () => {
      const el = await fixture(html`
        <ds-text-field required></ds-text-field>
      `);
      expect(el.checkValidity()).to.be.false;

      el.value = "value";
      await elementUpdated(el);
      expect(el.checkValidity()).to.be.true;
    });

    it("should validate email fields", async () => {
      const el = await fixture(html`
        <ds-text-field type="email" required></ds-text-field>
      `);

      el.value = "notanemail";
      await elementUpdated(el);
      expect(el.checkValidity()).to.be.false;

      el.value = "test@example.com";
      await elementUpdated(el);
      expect(el.checkValidity()).to.be.true;
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit ds-text-field:input with detail", async () => {
      const el = await fixture(defaultFixture);
      const input = el.shadowRoot.querySelector("input");

      const eventPromise = oneEvent(el, "ds-text-field:input");
      input.value = "test";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      const event = await eventPromise;

      expect(event.detail.value).to.equal("test");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should emit ds-text-field:change with detail", async () => {
      const el = await fixture(defaultFixture);
      const input = el.shadowRoot.querySelector("input");

      const eventPromise = oneEvent(el, "ds-text-field:change");
      input.value = "changed";
      input.dispatchEvent(new Event("change", { bubbles: true }));
      const event = await eventPromise;

      expect(event.detail.value).to.equal("changed");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should emit ds-text-field:focus with detail", async () => {
      const el = await fixture(defaultFixture);
      const input = el.shadowRoot.querySelector("input");

      const eventPromise = oneEvent(el, "ds-text-field:focus");
      input.focus();
      const event = await eventPromise;

      expect(event.detail.value).to.equal("");
    });

    it("should emit ds-text-field:blur with detail", async () => {
      const el = await fixture(defaultFixture);
      const input = el.shadowRoot.querySelector("input");

      const eventPromise = oneEvent(el, "ds-text-field:blur");
      input.focus();
      input.blur();
      const event = await eventPromise;

      expect(event.detail.value).to.equal("");
    });
  });

  // ============================================
  // Methods
  // ============================================
  describe("Methods", () => {
    it("focus() should focus the input", async () => {
      const el = await fixture(defaultFixture);
      el.focus();
      const input = el.shadowRoot.querySelector("input");
      expect(el.shadowRoot.activeElement).to.equal(input);
    });

    it("blur() should remove focus from the input", async () => {
      const el = await fixture(defaultFixture);
      el.focus();
      el.blur();
      expect(el.shadowRoot.activeElement).to.equal(null);
    });

    it("select() should select input text", async () => {
      const el = await fixture(html`
        <ds-text-field value="test"></ds-text-field>
      `);
      el.select();
      const input = el.shadowRoot.querySelector("input");
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(4);
    });

    it("checkValidity() should return validation state", async () => {
      const el = await fixture(html`
        <ds-text-field type="email" required></ds-text-field>
      `);

      expect(el.checkValidity()).to.be.false;
      el.value = "test@example.com";
      await elementUpdated(el);
      expect(el.checkValidity()).to.be.true;
    });

    it("reportValidity() should return validation state", async () => {
      const el = await fixture(html`
        <ds-text-field type="email" required></ds-text-field>
      `);

      expect(el.reportValidity()).to.be.false;
      el.value = "test@example.com";
      await elementUpdated(el);
      expect(el.reportValidity()).to.be.true;
    });
  });

  // ============================================
  // Interactions
  // ============================================
  describe("Interactions", () => {
    it("should update value on input event", async () => {
      const el = await fixture(defaultFixture);
      const input = el.shadowRoot.querySelector("input");

      input.value = "hello";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await elementUpdated(el);

      expect(el.value).to.equal("hello");
    });

    it("should respect maxlength on the native input", async () => {
      const el = await fixture(html`
        <ds-text-field maxlength="10"></ds-text-field>
      `);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("maxlength")).to.equal("10");
    });
  });

  // ============================================
  // Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("should allow keyboard focus", async () => {
      const el = await fixture(labeledFixture);
      el.focus();
      const input = el.shadowRoot.querySelector("input");
      expect(el.shadowRoot.activeElement).to.equal(input);
    });

    it("should expose the label as the input's accessible name", async () => {
      const el = await fixture(labeledFixture);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-label")).to.equal("Email");
    });

    it("should not set aria-label when no label is provided", async () => {
      const el = await fixture(html`<ds-text-field></ds-text-field>`);
      const input = el.shadowRoot.querySelector("input");
      expect(input.hasAttribute("aria-label")).to.be.false;
    });
  });

  // ============================================
  // Form association
  // ============================================
  // Guards the A-severity defect: the field called attachInternals() but
  // never declared formAssociated or set a form value, so FormData silently
  // omitted it.
  describe("Form association", () => {
    const type = (el, text) => {
      const input = el.shadowRoot.querySelector("input");
      input.value = text;
      input.dispatchEvent(new Event("input"));
    };

    it("should submit the typed value under its name", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="email"></ds-text-field>`,
      );
      type(el, "ada@example.com");
      expect(entriesOf(form)).to.deep.equal([["email", "ada@example.com"]]);
    });

    it("should submit its initial value attribute", async () => {
      const { form } = await inForm(
        html`<ds-text-field name="city" value="Lisbon"></ds-text-field>`,
      );
      expect(entriesOf(form)).to.deep.equal([["city", "Lisbon"]]);
    });

    it("should submit an empty string when empty, like a native input", async () => {
      const { form } = await inForm(html`<ds-text-field name="note"></ds-text-field>`);
      expect(entriesOf(form)).to.deep.equal([["note", ""]]);
    });

    it("should submit a value set by property", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="city"></ds-text-field>`,
      );
      el.value = "Porto";
      expect(entriesOf(form)).to.deep.equal([["city", "Porto"]]);
    });

    it("should be left out without a name", async () => {
      const { form, el } = await inForm(html`<ds-text-field></ds-text-field>`);
      type(el, "anything");
      expect(entriesOf(form)).to.deep.equal([]);
    });

    it("should expose its form", async () => {
      const { form, el } = await inForm(html`<ds-text-field></ds-text-field>`);
      // Identity, not .equal(form): chai hangs formatting a <form> element
      // into a failure message, so a failing .equal would stall the file.
      expect(el.form === form).to.be.true;
    });

    it("should block the form while required and empty", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="email" required></ds-text-field>`,
      );
      expect(el.validity.valueMissing).to.be.true;
      expect(el.checkValidity()).to.be.false;
      expect(form.checkValidity()).to.be.false;

      type(el, "ada@example.com");
      expect(el.validity.valid).to.be.true;
      expect(form.checkValidity()).to.be.true;
    });

    it("should mirror the native input's type validation", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="email" type="email"></ds-text-field>`,
      );
      type(el, "not-an-email");
      expect(el.validity.typeMismatch).to.be.true;
      expect(el.validationMessage).to.not.equal("");
      expect(form.checkValidity()).to.be.false;
    });

    it("should restore its initial value when the form resets", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="city" value="Lisbon"></ds-text-field>`,
      );
      type(el, "Porto");
      form.reset();
      expect(el.value).to.equal("Lisbon");
      expect(el.shadowRoot.querySelector("input").value).to.equal("Lisbon");
      expect(entriesOf(form)).to.deep.equal([["city", "Lisbon"]]);
    });

    it("should be left out while disabled", async () => {
      const { form } = await inForm(
        html`<ds-text-field name="city" value="Lisbon" disabled></ds-text-field>`,
      );
      expect(entriesOf(form)).to.deep.equal([]);
    });

    it("should be disabled by a disabled fieldset", async () => {
      const { form, fieldset, el } = await inDisabledFieldset(
        html`<ds-text-field name="city" value="Lisbon"></ds-text-field>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.shadowRoot.querySelector("input").disabled).to.be.true;
      expect(entriesOf(form)).to.deep.equal([]);

      fieldset.disabled = false;
      expect(el.disabled).to.be.false;
      expect(el.shadowRoot.querySelector("input").disabled).to.be.false;
      expect(entriesOf(form)).to.deep.equal([["city", "Lisbon"]]);
    });

    // render() used to rebuild the input from the value attribute and never
    // re-attach its listeners: setting error after validation wiped what the
    // user typed and silenced every later event.
    it("should keep the typed value when an attribute changes", async () => {
      const { form, el } = await inForm(
        html`<ds-text-field name="email"></ds-text-field>`,
      );
      type(el, "ada@example.com");
      el.setAttribute("error", "");
      expect(el.value).to.equal("ada@example.com");
      expect(el.shadowRoot.querySelector("input").value).to.equal("ada@example.com");
      expect(entriesOf(form)).to.deep.equal([["email", "ada@example.com"]]);
    });

    it("should keep firing input events after an attribute changes", async () => {
      const el = await fixture(html`<ds-text-field></ds-text-field>`);
      el.setAttribute("error", "");
      // Counted synchronously rather than awaited: a missing event should
      // fail the test, not hang the file.
      const values = [];
      el.addEventListener("ds-text-field:input", (e) => values.push(e.detail.value));
      type(el, "x");
      expect(values).to.deep.equal(["x"]);
    });

    it("should keep a value containing quotes intact", async () => {
      const el = await fixture(html`<ds-text-field></ds-text-field>`);
      el.value = 'He said "hi"';
      el.setAttribute("label", "Quote");
      expect(el.shadowRoot.querySelector("input").value).to.equal('He said "hi"');
    });
  });
});
