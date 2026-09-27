import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/text-field/text-field.js";
import "../src/components/ds-textarea.js";
import "../src/components/checkbox/checkbox.js";
import "../src/components/ds-radio.js";
import "../src/components/ds-switch.js";
import "../src/components/ds-slider.js";
import "../src/components/combobox/combobox.js";
import "../src/components/date-picker/date-picker.js";
import "../src/components/time-picker/time-picker.js";
import { entriesOf } from "./helpers/forms.js";

// All nine input and selection components in one native <form>: the
// composition each component's own tests can't show.
describe("Native form integration", () => {
  const signup = () =>
    fixture(html`
      <form>
        <ds-text-field name="email" type="email" value="ada@example.com" required></ds-text-field>
        <ds-textarea name="bio" value="Engineer"></ds-textarea>
        <ds-checkbox name="terms" required checked></ds-checkbox>
        <ds-radio name="plan" value="basic"></ds-radio>
        <ds-radio name="plan" value="pro" checked></ds-radio>
        <ds-switch name="newsletter" checked></ds-switch>
        <ds-slider name="seats" value="5"></ds-slider>
        <ds-combobox name="team" value="design">
          <div slot="option" data-value="design">Design</div>
          <div slot="option" data-value="research">Research</div>
        </ds-combobox>
        <ds-date-picker name="start" value="2026-06-15"></ds-date-picker>
        <ds-time-picker name="standup" value="09:30"></ds-time-picker>
        <button type="submit">Sign up</button>
      </form>
    `);

  const expected = [
    ["email", "ada@example.com"],
    ["bio", "Engineer"],
    ["terms", "on"],
    ["plan", "pro"],
    ["newsletter", "on"],
    ["seats", "5"],
    ["team", "design"],
    ["start", "2026-06-15"],
    ["standup", "09:30"],
  ];

  it("should collect every field, in document order", async () => {
    const form = await signup();
    expect(entriesOf(form)).to.deep.equal(expected);
  });

  it("should submit every field through a real submit event", async () => {
    const form = await signup();
    let submitted = null;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted = [...new FormData(form, e.submitter).entries()];
    });
    form.requestSubmit(form.querySelector("button"));
    expect(submitted).to.deep.equal(expected);
  });

  it("should refuse to submit while a required field is invalid", async () => {
    const form = await signup();
    form.querySelector("ds-checkbox").click();
    let submitted = false;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted = true;
    });
    form.requestSubmit();
    expect(submitted).to.be.false;
    expect(form.checkValidity()).to.be.false;
  });

  it("should restore every field when the form resets", async () => {
    const form = await signup();
    form.querySelector("ds-text-field").value = "grace@example.com";
    form.querySelector("ds-textarea").value = "Admiral";
    form.querySelector("ds-checkbox").click();
    form.querySelectorAll("ds-radio")[0].click();
    form.querySelector("ds-switch").click();
    form.querySelector("ds-slider").value = 9;
    form.querySelector("ds-combobox").value = "research";
    form.querySelector("ds-date-picker").value = "2026-07-01";
    form.querySelector("ds-time-picker").value = "10:00";

    form.reset();

    expect(entriesOf(form)).to.deep.equal(expected);
  });
});
