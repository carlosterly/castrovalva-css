/**
 * Shared fixtures for the form-association tests of the input and selection
 * components (see src/utils/form-associated.js).
 */
import { fixture, html } from "@open-wc/testing";

/**
 * Render a field inside a `<form>`.
 *
 * @param {import("lit").TemplateResult} field
 * @returns {Promise<{ form: HTMLFormElement, el: HTMLElement }>} the form
 *   and its first element child
 */
export async function inForm(field) {
  const form = await fixture(html`<form>${field}</form>`);
  return { form, el: form.firstElementChild };
}

/**
 * Render a field inside a disabled `<fieldset>` inside a `<form>`.
 *
 * @param {import("lit").TemplateResult} field
 */
export async function inDisabledFieldset(field) {
  const form = await fixture(
    html`<form><fieldset disabled>${field}</fieldset></form>`,
  );
  return { form, fieldset: form.firstElementChild, el: form.querySelector("fieldset > *") };
}

/** The form's submission entries, as `[name, value]` pairs. */
export const entriesOf = (form) => [...new FormData(form).entries()];
