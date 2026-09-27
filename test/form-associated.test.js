import { fixture, html, expect } from "@open-wc/testing";
import { FormAssociated } from "../src/utils/form-associated.js";
import { inForm, inDisabledFieldset, entriesOf } from "./helpers/forms.js";

// A minimal field: submits its `value` attribute, required when empty.
class TestField extends FormAssociated(HTMLElement) {
  static get observedAttributes() {
    return ["value", "required"];
  }

  constructor() {
    super();
    this.disabledChanges = 0;
  }

  connectedCallback() {
    this.sync();
  }

  attributeChangedCallback() {
    this.sync();
  }

  sync() {
    const value = this.getAttribute("value");
    this._setFormState(value, {
      valueMissing: this.hasAttribute("required") && !value,
    });
  }

  _onDisabledChange() {
    this.disabledChanges++;
  }
}
customElements.define("test-form-field", TestField);

describe("FormAssociated", () => {
  it("should declare the element form-associated", () => {
    expect(TestField.formAssociated).to.be.true;
  });

  it("should submit the reported value under the element's name", async () => {
    const { form } = await inForm(
      html`<test-form-field name="size" value="large"></test-form-field>`,
    );
    expect(entriesOf(form)).to.deep.equal([["size", "large"]]);
  });

  it("should leave a null value out of the submission", async () => {
    const { form } = await inForm(html`<test-form-field name="size"></test-form-field>`);
    expect(entriesOf(form)).to.deep.equal([]);
  });

  it("should reflect name through the property", async () => {
    const { form, el } = await inForm(html`<test-form-field value="a"></test-form-field>`);
    expect(el.name).to.equal("");
    el.name = "letter";
    expect(el.getAttribute("name")).to.equal("letter");
    expect(entriesOf(form)).to.deep.equal([["letter", "a"]]);
  });

  it("should expose the form it belongs to", async () => {
    const { form, el } = await inForm(html`<test-form-field></test-form-field>`);
    expect(el.form === form).to.be.true;
  });

  it("should have no form outside one", async () => {
    const el = await fixture(html`<test-form-field></test-form-field>`);
    expect(el.form === null).to.be.true;
  });

  it("should report valueMissing with a message while required and empty", async () => {
    const { form, el } = await inForm(
      html`<test-form-field name="size" required></test-form-field>`,
    );
    expect(el.willValidate).to.be.true;
    expect(el.validity.valueMissing).to.be.true;
    expect(el.validationMessage).to.not.equal("");
    expect(el.checkValidity()).to.be.false;
    expect(el.reportValidity()).to.be.false;
    expect(form.checkValidity()).to.be.false;

    el.setAttribute("value", "large");
    expect(el.validity.valid).to.be.true;
    expect(el.validationMessage).to.equal("");
    expect(el.checkValidity()).to.be.true;
  });

  it("should mirror another control's validity when given one", async () => {
    const { el } = await inForm(html`<test-form-field></test-form-field>`);
    const email = document.createElement("input");
    email.type = "email";
    email.value = "not-an-email";

    el._setFormState(email.value, {
      from: email.validity,
      message: email.validationMessage,
    });
    expect(el.validity.typeMismatch).to.be.true;

    email.value = "ada@example.com";
    el._setFormState(email.value, { from: email.validity });
    expect(el.validity.valid).to.be.true;
  });

  it("should expose associated labels", async () => {
    const form = await fixture(html`
      <form>
        <label for="size-field">Size</label>
        <test-form-field id="size-field"></test-form-field>
      </form>
    `);
    const el = form.querySelector("test-form-field");
    expect(el.labels.length).to.equal(1);
    expect(el.labels[0].textContent).to.equal("Size");
  });

  it("should reflect disabled through the property", async () => {
    const { form, el } = await inForm(
      html`<test-form-field name="size" value="large"></test-form-field>`,
    );
    el.disabled = true;
    expect(el.hasAttribute("disabled")).to.be.true;
    expect(entriesOf(form)).to.deep.equal([]);
    el.disabled = false;
    expect(el.hasAttribute("disabled")).to.be.false;
    expect(entriesOf(form)).to.deep.equal([["size", "large"]]);
  });

  it("should count as disabled inside a disabled fieldset, and notify", async () => {
    const { fieldset, el } = await inDisabledFieldset(
      html`<test-form-field></test-form-field>`,
    );
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute("disabled")).to.be.false;
    const before = el.disabledChanges;

    fieldset.disabled = false;
    expect(el.disabled).to.be.false;
    expect(el.disabledChanges).to.equal(before + 1);
  });
});
