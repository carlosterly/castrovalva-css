import {
  fixture,
  html,
  expect,
  elementUpdated,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/text-field/text-field.js";

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
  });
});
