/**
 * Material Design 3 Form Wrapper Component
 *
 * A container component for managing form state, validation, and submission.
 * Groups form inputs and provides unified validation, error handling, and data collection.
 *
 * @element ds-form
 *
 * @attr {string} name - Form name for submission
 * @attr {boolean} novalidate - Disable built-in validation
 *
 * @fires ds-form:submit - Fired on form submission with collected data
 * @fires ds-form:reset - Fired when form is reset
 * @fires ds-form:change - Fired when any field changes
 * @fires ds-form:validity-change - Fired when overall form validity changes
 *
 * @slot - Form fields and content
 *
 * @csspart container - Main form container
 * @csspart error-summary - Error summary area
 *
 * @example
 * <ds-form name="signup">
 *   <ds-text-field name="email" type="email" required></ds-text-field>
 *   <ds-text-field name="password" type="password" required></ds-text-field>
 *   <ds-checkbox name="agree" required></ds-checkbox>
 *   <ds-button type="submit">Sign Up</ds-button>
 * </ds-form>
 */
export class DSForm extends HTMLElement {
  static get observedAttributes() {
    return ["name", "novalidate"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Form state
    this._fields = new Map();
    this._values = {};
    this._errors = {};
    this._touched = new Set();
    this._dirty = new Set();
    this._isValid = true;

    // Bind handlers
    this._boundHandlers = {
      fieldChange: this.handleFieldChange.bind(this),
      fieldBlur: this.handleFieldBlur.bind(this),
      submit: this.handleSubmit.bind(this),
      reset: this.handleReset.bind(this),
    };
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot) {
      if (name === "name" || name === "novalidate") {
        // Update form attributes if needed
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: var(--ds-space-4, 16px);
        }

        .error-summary {
          display: none;
          padding: var(--ds-space-4, 16px);
          background: var(--md-sys-color-error-container);
          color: var(--md-sys-color-on-error-container);
          border-radius: var(--ds-radius-sm, 8px);
          font-size: var(--md-sys-typescale-body-medium-size);
        }

        .error-summary.visible {
          display: block;
        }

        .error-summary-title {
          font-weight: 500;
          margin-bottom: var(--ds-space-2, 8px);
        }

        .error-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .error-list li {
          margin-bottom: var(--ds-space-2, 8px);
        }

        .error-list li:last-child {
          margin-bottom: 0;
        }
      </style>

      <div part="container" class="container">
        <div part="error-summary" class="error-summary">
          <div class="error-summary-title">Please fix the following errors:</div>
          <ul class="error-list"></ul>
        </div>
        <slot></slot>
      </div>
    `;
  }

  attachEventListeners() {
    // Find all form elements
    this.updateFieldRegistry();

    // Listen to slot changes for dynamic field additions
    const slot = this.shadowRoot.querySelector("slot");
    if (slot) {
      slot.addEventListener("slotchange", () => {
        this.updateFieldRegistry();
      });
    }

    // Listen to form submission (from submit button)
    this.addEventListener("submit", this._boundHandlers.submit);
  }

  removeEventListeners() {
    this.removeEventListener("submit", this._boundHandlers.submit);
  }

  updateFieldRegistry() {
    const slot = this.shadowRoot.querySelector("slot");
    const elements = slot.assignedElements({ flatten: true });

    // Find all form field elements
    const formFields = elements.filter((el) => {
      return el.tagName.startsWith("DS-") && this.isFormField(el);
    });

    // Add new fields and event listeners
    formFields.forEach((field) => {
      const name = field.getAttribute("name");
      if (name && !this._fields.has(name)) {
        this._fields.set(name, field);
        field.addEventListener("change", this._boundHandlers.fieldChange);
        field.addEventListener("blur", this._boundHandlers.fieldBlur);

        // Initialize field value
        const value = this.getFieldValue(field);
        this._values[name] = value;
      }
    });

    // Remove fields that no longer exist
    for (const [name, field] of this._fields) {
      if (!formFields.includes(field)) {
        field.removeEventListener("change", this._boundHandlers.fieldChange);
        field.removeEventListener("blur", this._boundHandlers.fieldBlur);
        this._fields.delete(name);
        delete this._values[name];
      }
    }
  }

  isFormField(element) {
    const fieldTypes = [
      "ds-text-field",
      "ds-textarea",
      "ds-checkbox",
      "ds-radio",
      "ds-switch",
      "ds-slider",
      "ds-select",
      "ds-date-picker",
      "ds-time-picker",
    ];
    return fieldTypes.includes(element.tagName.toLowerCase());
  }

  getFieldValue(field) {
    const tagName = field.tagName.toLowerCase();

    switch (tagName) {
      case "ds-checkbox":
        return field.checked;
      case "ds-radio":
        return field.checked ? field.value : null;
      case "ds-switch":
        return field.checked;
      case "ds-slider":
        return field.value;
      case "ds-text-field":
      case "ds-textarea":
      case "ds-date-picker":
      case "ds-time-picker":
        return field.value || "";
      default:
        return field.value || "";
    }
  }

  getFieldError(field) {
    return field.hasAttribute("error") ? field.getAttribute("error") : null;
  }

  handleFieldChange(event) {
    const field = event.target.closest("[name]");
    if (!field) return;

    const name = field.getAttribute("name");
    if (!name) return;

    // Update value
    this._values[name] = this.getFieldValue(field);
    this._dirty.add(name);

    // Validate field
    this.validateField(field);

    // Emit change event
    this.dispatchEvent(
      new CustomEvent("ds-form:change", {
        bubbles: true,
        composed: true,
        detail: {
          name,
          value: this._values[name],
          values: { ...this._values },
        },
      }),
    );
  }

  handleFieldBlur(event) {
    const field = event.target.closest("[name]");
    if (!field) return;

    const name = field.getAttribute("name");
    if (!name) return;

    this._touched.add(name);
    this.validateField(field);
  }

  handleSubmit(event) {
    // Prevent form submission to parent form
    event.preventDefault();

    // Validate all fields
    const isValid = this.validate();

    if (!isValid) {
      this.showErrorSummary();
      return;
    }

    // Emit submit event with form data
    this.dispatchEvent(
      new CustomEvent("ds-form:submit", {
        bubbles: true,
        composed: true,
        detail: {
          values: { ...this._values },
          isValid,
        },
      }),
    );
  }

  handleReset(event) {
    if (event.target === this) {
      event.preventDefault();
      this.reset();
    }
  }

  validateField(field) {
    const name = field.getAttribute("name");
    if (!name) return true;

    if (this.hasAttribute("novalidate")) {
      field.removeAttribute("error");
      delete this._errors[name];
      return true;
    }

    const isTouched = this._touched.has(name);
    const isDirty = this._dirty.has(name);

    // Only show errors for touched or dirty fields
    if (!isTouched && !isDirty) {
      field.removeAttribute("error");
      delete this._errors[name];
      return true;
    }

    // Check required
    if (field.hasAttribute("required")) {
      const value = this.getFieldValue(field);
      const isEmpty =
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        const requiredValue = field.getAttribute("required");
        const errorMsg =
          requiredValue === null ||
          requiredValue === "" ||
          requiredValue === "true"
            ? "This field is required"
            : requiredValue;
        field.setAttribute("error", errorMsg);
        this._errors[name] = errorMsg;
        return false;
      }
    }

    // Check field-specific validation (pattern, minlength, etc.)
    const fieldValid = this.validateFieldType(field);
    if (!fieldValid) {
      return false;
    }

    // Field is valid
    field.removeAttribute("error");
    delete this._errors[name];
    return true;
  }

  validateFieldType(field) {
    const tagName = field.tagName.toLowerCase();
    const value = this.getFieldValue(field);
    const name = field.getAttribute("name");

    if (tagName === "ds-text-field") {
      const type = field.getAttribute("type") || "text";
      const pattern = field.getAttribute("pattern");
      const minlength = field.getAttribute("minlength");
      const maxlength = field.getAttribute("maxlength");

      // Email validation
      if (type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          field.setAttribute("error", "Invalid email address");
          this._errors[name] = "Invalid email address";
          return false;
        }
      }

      // URL validation
      if (type === "url") {
        try {
          new URL(value);
        } catch {
          if (value) {
            field.setAttribute("error", "Invalid URL");
            this._errors[name] = "Invalid URL";
            return false;
          }
        }
      }

      // Pattern validation
      if (pattern && value) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          field.setAttribute("error", "Invalid format");
          this._errors[name] = "Invalid format";
          return false;
        }
      }

      // Length validation
      if (minlength && value.length < parseInt(minlength)) {
        field.setAttribute("error", `Minimum ${minlength} characters`);
        this._errors[name] = `Minimum ${minlength} characters`;
        return false;
      }

      if (maxlength && value.length > parseInt(maxlength)) {
        field.setAttribute("error", `Maximum ${maxlength} characters`);
        this._errors[name] = `Maximum ${maxlength} characters`;
        return false;
      }
    }

    field.removeAttribute("error");
    delete this._errors[name];
    return true;
  }

  validate() {
    if (this.hasAttribute("novalidate")) {
      for (const field of this._fields.values()) {
        field.removeAttribute("error");
      }
      this._errors = {};
      this.hideErrorSummary();
      this.updateValidity(true);
      return true;
    }

    let isValid = true;

    for (const [name, field] of this._fields) {
      // Mark all fields as touched for validation
      this._touched.add(name);
      const fieldValid = this.validateField(field);
      if (!fieldValid) {
        isValid = false;
      }
    }

    this.updateValidity(isValid);
    return isValid;
  }

  updateValidity(isValid) {
    if (this._isValid !== isValid) {
      this._isValid = isValid;
      this.dispatchEvent(
        new CustomEvent("ds-form:validity-change", {
          bubbles: true,
          composed: true,
          detail: { isValid },
        }),
      );
    }
  }

  showErrorSummary() {
    const errorSummary = this.shadowRoot.querySelector(".error-summary");
    const errorList = errorSummary.querySelector(".error-list");

    // Clear existing errors
    errorList.innerHTML = "";

    // Add field errors
    for (const [name, error] of Object.entries(this._errors)) {
      const li = document.createElement("li");
      li.textContent = `${name}: ${error}`;
      errorList.appendChild(li);
    }

    errorSummary.classList.add("visible");

    // Scroll to error summary
    setTimeout(() => {
      errorSummary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  }

  hideErrorSummary() {
    const errorSummary = this.shadowRoot.querySelector(".error-summary");
    errorSummary.classList.remove("visible");
  }

  reset() {
    // Reset all field values
    for (const [name, field] of this._fields) {
      const initialValue = field.hasAttribute("value")
        ? field.getAttribute("value")
        : field.tagName.toLowerCase() === "ds-checkbox" ||
            field.tagName.toLowerCase() === "ds-switch"
          ? false
          : "";

      if (
        field.tagName.toLowerCase() === "ds-checkbox" ||
        field.tagName.toLowerCase() === "ds-switch"
      ) {
        field.checked = initialValue;
      } else {
        field.value = initialValue;
      }

      this._values[name] = this.getFieldValue(field);
      field.removeAttribute("error");
    }

    // Reset state
    this._touched.clear();
    this._dirty.clear();
    this._errors = {};
    this._isValid = true;

    this.hideErrorSummary();

    // Emit reset event
    this.dispatchEvent(
      new CustomEvent("ds-form:reset", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Public API methods

  /**
   * Get all form values
   * @returns {Object} Object with field names as keys and field values as values
   */
  getValues() {
    return { ...this._values };
  }

  /**
   * Get specific field value
   * @param {string} name - Field name
   * @returns {*} Field value
   */
  getValue(name) {
    return this._values[name];
  }

  /**
   * Set field value
   * @param {string} name - Field name
   * @param {*} value - New value
   */
  setValue(name, value) {
    const field = this._fields.get(name);
    if (!field) return;

    if (
      field.tagName.toLowerCase() === "ds-checkbox" ||
      field.tagName.toLowerCase() === "ds-switch"
    ) {
      field.checked = value;
    } else {
      field.value = value;
    }

    this._values[name] = value;
    this._dirty.add(name);
  }

  /**
   * Get form validity status
   * @returns {boolean} True if form is valid
   */
  isValid() {
    return this._isValid;
  }

  /**
   * Get all form errors
   * @returns {Object} Object with field names as keys and error messages as values
   */
  getErrors() {
    return { ...this._errors };
  }

  /**
   * Get fields that have been touched
   * @returns {Set} Set of field names that have been touched
   */
  getTouched() {
    return new Set(this._touched);
  }

  /**
   * Get fields that have been modified
   * @returns {Set} Set of field names that have been modified
   */
  getDirty() {
    return new Set(this._dirty);
  }

  /**
   * Mark field as touched
   * @param {string} name - Field name
   */
  markTouched(name) {
    this._touched.add(name);
    const field = this._fields.get(name);
    if (field) {
      this.validateField(field);
    }
  }

  /**
   * Mark all fields as touched
   */
  markAllTouched() {
    for (const name of this._fields.keys()) {
      this._touched.add(name);
    }
    this.validate();
  }

  /**
   * Validate the entire form
   * @returns {boolean} True if form is valid
   */
  submit() {
    return this.validate();
  }
}

customElements.define("ds-form", DSForm);
