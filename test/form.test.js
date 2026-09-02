import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/form/form.js";

const defineStub = (tag, init) => {
  if (customElements.get(tag)) return;
  customElements.define(
    tag,
    class extends HTMLElement {
      constructor() {
        super();
        if (init) {
          init(this);
        }
      }
    },
  );
};

defineStub("ds-text-field", (el) => {
  el.value = "";
});
defineStub("ds-checkbox", (el) => {
  el.checked = false;
});
defineStub("ds-switch", (el) => {
  el.checked = false;
});
defineStub("ds-radio", (el) => {
  el.checked = false;
  el.value = "";
});
defineStub("ds-slider", (el) => {
  el.value = 0;
});

const wait = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("ds-form", () => {
  describe("Initialization", () => {
    it("renders a custom element with Shadow DOM", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      expect(el).to.exist;
      expect(el.tagName).to.equal("DS-FORM");
      expect(el.shadowRoot).to.exist;
    });

    it("renders container, slot, and error summary", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      expect(el.shadowRoot.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot.querySelector("slot")).to.exist;
      expect(el.shadowRoot.querySelector(".error-summary")).to.exist;
    });

    it("hides the error summary by default", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      const summary = el.shadowRoot.querySelector(".error-summary");
      expect(summary.classList.contains("visible")).to.be.false;
    });

    it("handles disconnection cleanly", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      el.remove();
      expect(el.isConnected).to.be.false;
    });
  });

  describe("Field registration", () => {
    it("registers text fields by name", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      expect(el._fields.has("email")).to.be.true;
    });

    it("registers checkbox fields", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-checkbox name="agree"></ds-checkbox>
        </ds-form>
      `);
      expect(el._fields.has("agree")).to.be.true;
    });

    it("ignores fields without a name", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field></ds-text-field>
        </ds-form>
      `);
      expect(el._fields.size).to.equal(0);
    });

    it("updates when fields are added dynamically", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      expect(el._fields.size).to.equal(0);

      const field = document.createElement("ds-text-field");
      field.setAttribute("name", "email");
      el.appendChild(field);

      await wait();
      expect(el._fields.has("email")).to.be.true;
    });

    it("removes fields that are detached", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.remove();

      el.updateFieldRegistry();
      expect(el._fields.has("email")).to.be.false;
    });
  });

  describe("Attributes", () => {
    it("bypasses validation when novalidate is set", async () => {
      const el = await fixture(html`
        <ds-form novalidate>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      const isValid = el.validate();

      expect(isValid).to.be.true;
      expect(field.hasAttribute("error")).to.be.false;
    });

    it("enforces validation when novalidate is removed", async () => {
      const el = await fixture(html`
        <ds-form novalidate>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      el.removeAttribute("novalidate");
      const isValid = el.validate();

      expect(isValid).to.be.false;
    });

    it("clears existing errors when novalidate is set", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");

      el.validate();
      expect(field.hasAttribute("error")).to.be.true;

      el.setAttribute("novalidate", "");
      el.validate();
      expect(field.hasAttribute("error")).to.be.false;
    });

    it("reacts to attribute changes", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      el.setAttribute("name", "signup");
      el.setAttribute("novalidate", "");

      expect(el.getAttribute("name")).to.equal("signup");
      expect(el.hasAttribute("novalidate")).to.be.true;
    });
  });

  describe("Value management", () => {
    it("captures text field values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });

      expect(el.getValue("email")).to.equal("test@example.com");
    });

    it("captures checkbox values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-checkbox name="agree"></ds-checkbox>
        </ds-form>
      `);
      const field = el._fields.get("agree");
      field.checked = true;
      el.handleFieldChange({ target: field });

      expect(el.getValue("agree")).to.be.true;
    });

    it("captures switch values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-switch name="notify"></ds-switch>
        </ds-form>
      `);
      const field = el._fields.get("notify");
      field.checked = true;
      el.handleFieldChange({ target: field });

      expect(el.getValue("notify")).to.be.true;
    });

    it("captures radio values when checked", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-radio name="choice" value="a"></ds-radio>
        </ds-form>
      `);
      const field = el._fields.get("choice");
      field.value = "a";
      field.checked = true;
      el.handleFieldChange({ target: field });

      expect(el.getValue("choice")).to.equal("a");
    });

    it("returns null for unchecked radios", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-radio name="choice" value="a"></ds-radio>
        </ds-form>
      `);
      const field = el._fields.get("choice");
      field.checked = false;
      el.handleFieldChange({ target: field });

      expect(el.getValue("choice")).to.equal(null);
    });

    it("captures slider values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-slider name="volume"></ds-slider>
        </ds-form>
      `);
      const field = el._fields.get("volume");
      field.value = 42;
      el.handleFieldChange({ target: field });

      expect(el.getValue("volume")).to.equal(42);
    });

    it("setValue updates text fields and marks dirty", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      el.setValue("email", "new@example.com");

      expect(el.getValue("email")).to.equal("new@example.com");
      expect(el.getDirty().has("email")).to.be.true;
    });

    it("setValue updates checkbox checked state", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-checkbox name="agree"></ds-checkbox>
        </ds-form>
      `);
      el.setValue("agree", true);
      const field = el._fields.get("agree");

      expect(field.checked).to.be.true;
      expect(el.getValue("agree")).to.be.true;
    });
  });

  describe("Validation", () => {
    it("returns false when required fields are empty", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);

      const isValid = el.validate();
      expect(isValid).to.be.false;
    });

    it("adds a default required message", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      el.validate();
      const field = el._fields.get("email");

      expect(field.getAttribute("error")).to.equal("This field is required");
    });

    it("uses a custom required message", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required="Custom error"></ds-text-field>
        </ds-form>
      `);
      el.validate();
      const field = el._fields.get("email");

      expect(field.getAttribute("error")).to.equal("Custom error");
    });

    it("does not surface errors before touch or dirty", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      const fieldValid = el.validateField(field);

      expect(fieldValid).to.be.true;
      expect(field.hasAttribute("error")).to.be.false;
    });

    it("validates email format", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" type="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "invalid-email";
      el.handleFieldChange({ target: field });
      el.markTouched("email");

      expect(el.validateField(field)).to.be.false;
    });

    it("accepts valid email values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" type="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });
      el.markTouched("email");

      expect(el.validateField(field)).to.be.true;
    });

    it("validates URL format", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="url" type="url" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("url");
      field.value = "not-a-url";
      el.handleFieldChange({ target: field });
      el.markTouched("url");

      expect(el.validateField(field)).to.be.false;
    });

    it("accepts valid URL values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="url" type="url" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("url");
      field.value = "https://example.com";
      el.handleFieldChange({ target: field });
      el.markTouched("url");

      expect(el.validateField(field)).to.be.true;
    });

    it("validates minlength", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="password" minlength="8" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("password");
      field.value = "short";
      el.handleFieldChange({ target: field });
      el.markTouched("password");

      expect(el.validateField(field)).to.be.false;
    });

    it("validates maxlength", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="code" maxlength="5" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("code");
      field.value = "toolong";
      el.handleFieldChange({ target: field });
      el.markTouched("code");

      expect(el.validateField(field)).to.be.false;
    });

    it("validates patterns", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field
            name="code"
            pattern="^[A-Z]{3}$"
            required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("code");
      field.value = "abc";
      el.handleFieldChange({ target: field });
      el.markTouched("code");

      expect(el.validateField(field)).to.be.false;
    });

    it("accepts valid patterns", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field
            name="code"
            pattern="^[A-Z]{3}$"
            required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("code");
      field.value = "ABC";
      el.handleFieldChange({ target: field });
      el.markTouched("code");

      expect(el.validateField(field)).to.be.true;
    });
  });

  describe("Methods", () => {
    it("getValues returns all values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
          <ds-text-field name="password"></ds-text-field>
        </ds-form>
      `);
      const emailField = el._fields.get("email");
      const passwordField = el._fields.get("password");
      emailField.value = "test@example.com";
      passwordField.value = "secret123";
      el.handleFieldChange({ target: emailField });
      el.handleFieldChange({ target: passwordField });

      const values = el.getValues();
      expect(values.email).to.equal("test@example.com");
      expect(values.password).to.equal("secret123");
    });

    it("getErrors returns the error map", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" type="email" required></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "invalid";
      el.handleFieldChange({ target: field });
      el.markTouched("email");
      el.validateField(field);

      expect(el.getErrors()).to.have.property("email");
    });

    it("getTouched returns touched fields", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      el.markTouched("email");

      expect(el.getTouched().has("email")).to.be.true;
    });

    it("markAllTouched marks each field", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
          <ds-text-field name="password"></ds-text-field>
        </ds-form>
      `);
      el.markAllTouched();

      expect(el.getTouched().size).to.equal(2);
    });

    it("submit returns validation result", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      const result = el.submit();

      expect(result).to.be.false;
    });

    it("getFieldError reads the error attribute", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.setAttribute("error", "Invalid");

      expect(el.getFieldError(field)).to.equal("Invalid");
    });

    it("updateValidity does not emit when unchanged", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      el.updateValidity(true);
      expect(el.isValid()).to.be.true;
    });

    it("handleReset delegates to reset when target matches", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });

      el.handleReset({ target: el, preventDefault: () => {} });
      expect(field.value).to.equal("");
    });
  });

  describe("Events", () => {
    it("emits change with name and value", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";

      setTimeout(() => el.handleFieldChange({ target: field }));
      const event = await oneEvent(el, "ds-form:change");

      expect(event.detail.name).to.equal("email");
      expect(event.detail.value).to.equal("test@example.com");
      expect(event.detail.values.email).to.equal("test@example.com");
    });

    it("emits submit with form values", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });

      setTimeout(() => el.handleSubmit({ preventDefault: () => {} }));
      const event = await oneEvent(el, "ds-form:submit");

      expect(event.detail.values.email).to.equal("test@example.com");
    });

    it("does not emit submit when invalid", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      let submitted = false;
      el.addEventListener("ds-form:submit", () => {
        submitted = true;
      });

      el.handleSubmit({ preventDefault: () => {} });
      expect(submitted).to.be.false;
    });

    it("emits reset events", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);

      setTimeout(() => el.reset());
      const event = await oneEvent(el, "ds-form:reset");

      expect(event).to.exist;
    });

    it("emits validity-change when validity changes", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);

      setTimeout(() => el.validate());
      const event = await oneEvent(el, "ds-form:validity-change");

      expect(event.detail.isValid).to.be.false;
    });
  });

  describe("Error summary", () => {
    it("shows error summary with errors", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      el.validate();
      el.showErrorSummary();

      const summary = el.shadowRoot.querySelector(".error-summary");
      const items = summary.querySelectorAll("li");
      expect(summary.classList.contains("visible")).to.be.true;
      expect(items.length).to.equal(1);
    });

    it("hides error summary", async () => {
      const el = await fixture(html`<ds-form></ds-form>`);
      const summary = el.shadowRoot.querySelector(".error-summary");
      summary.classList.add("visible");

      el.hideErrorSummary();
      expect(summary.classList.contains("visible")).to.be.false;
    });

    it("shows summary on invalid submit", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email" required></ds-text-field>
        </ds-form>
      `);
      el.handleSubmit({ preventDefault: () => {} });

      const summary = el.shadowRoot.querySelector(".error-summary");
      expect(summary.classList.contains("visible")).to.be.true;
    });
  });

  describe("State tracking", () => {
    it("tracks touched fields on blur", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      el.handleFieldBlur({ target: field });

      expect(el.getTouched().has("email")).to.be.true;
    });

    it("tracks dirty fields on change", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });

      expect(el.getDirty().has("email")).to.be.true;
    });

    it("clears touched and dirty on reset", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el._fields.get("email");
      field.value = "test@example.com";
      el.handleFieldChange({ target: field });
      el.handleFieldBlur({ target: field });

      el.reset();
      expect(el.getTouched().size).to.equal(0);
      expect(el.getDirty().size).to.equal(0);
    });
  });

  describe("Accessibility", () => {
    it("keeps light DOM fields available for keyboard navigation", async () => {
      const el = await fixture(html`
        <ds-form>
          <ds-text-field name="email"></ds-text-field>
        </ds-form>
      `);
      const field = el.querySelector("ds-text-field");
      expect(field).to.exist;
    });
  });
});
