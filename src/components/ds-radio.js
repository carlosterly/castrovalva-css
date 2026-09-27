import { FormAssociated } from "../utils/form-associated.js";

/**
 * Material Design 3 Radio Button Component
 * Implements MD3 radio button with state layers and accessibility
 *
 * @attr {string} size - Size of the radio (sm, md, lg)
 * @attr {string} label - Label text for the radio, rendered next to the
 *   control and mirrored into aria-label so its accessible name doesn't
 *   depend on an external, unassociated label element.
 *
 * @cssprop --ds-radio-size - Size of the radio (default: 20px, the MD3 spec size)
 * @cssprop --ds-radio-dot-size - Size of the inner dot (default: calc(var(--ds-radio-size) / 2))
 * @cssprop --ds-radio-state-layer-size - Size of the state layer (default: var(--ds-size-hit-area))
 *
 * @attr {string} name - Group name; radios sharing a name within the same
 *   form (or the same document, outside a form) form one group
 * @attr {string} value - Value submitted when checked (default: "on")
 * @attr {boolean} required - One radio in the group must be checked
 */
export class DSRadio extends FormAssociated(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._checked = false;
    this._error = false;
    this._value = "";
    // What a form reset restores. The checked attribute also reflects
    // selection, so it can't serve as the default once the user has clicked.
    this._defaultChecked = null;
    this._reflecting = false;
    this._onClick = this.handleClick.bind(this);
    this._onKeydown = this.handleKeydown.bind(this);
    this._onFocus = () =>
      this.shadowRoot.querySelector(".radio")?.classList.add("focused");
    this._onBlur = () =>
      this.shadowRoot.querySelector(".radio")?.classList.remove("focused");
  }

  static get observedAttributes() {
    return [
      "checked",
      "disabled",
      "error",
      "name",
      "value",
      "size",
      "label",
      "required",
    ];
  }

  connectedCallback() {
    this._defaultChecked ??= this.hasAttribute("checked");
    this._root = this.getRootNode();
    this.render();
    this.updateSize();
    this.setupEventListeners();
    this.updateRadioGroup();

    // Set ARIA attributes
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "radio");
    }
    this.setAttribute("aria-checked", this.checked ? "true" : "false");
    this._updateDisabledState();
    if (this.label) {
      this.setAttribute("aria-label", this.label);
    }
    this._syncGroupFormState();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("focus", this._onFocus);
    this.removeEventListener("blur", this._onBlur);
    // The rest of the group may have lost its checked radio.
    const peer = Array.from(
      this._root?.querySelectorAll("ds-radio") ?? [],
    ).find((radio) => radio.name === this.name && radio.isConnected);
    peer?._syncGroupFormState();
  }

  /**
   * The radios this one is grouped with, itself included: same name, same
   * form owner, same DOM tree, as native radios group. An unnamed radio is
   * a group of one.
   */
  _groupMembers(name = this.name) {
    if (!name || !this.isConnected) return [this];
    const form = this.form;
    return Array.from(this.getRootNode().querySelectorAll("ds-radio")).filter(
      (radio) => radio.name === name && radio.form === form,
    );
  }

  // Each checked radio submits its value (default "on"). Required belongs
  // to the group: every member is invalid until one of them is checked.
  _syncGroupFormState(name = this.name) {
    const members = this._groupMembers(name);
    const required = members.some((radio) => radio.required);
    const anyChecked = members.some((radio) => radio.checked);
    members.forEach((radio) => {
      radio._setFormState(radio.checked ? radio.value || "on" : null, {
        valueMissing: required && !anyChecked,
      });
    });
  }

  formResetCallback() {
    this.checked = this._defaultChecked ?? false;
  }

  _onDisabledChange() {
    this._updateDisabledState();
  }

  _updateDisabledState() {
    this.setAttribute("tabindex", this.disabled ? "-1" : "0");
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }

  _select() {
    this.checked = true;
    this.dispatchEvent(
      new CustomEvent("ds-radio:change", {
        bubbles: true,
        composed: true,
        detail: {
          checked: true,
          value: this.value,
          name: this.name,
        },
      }),
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "checked":
        this._checked = newValue !== null;
        if (!this._reflecting) this._defaultChecked = this._checked;
        this.setAttribute("aria-checked", this._checked ? "true" : "false");
        if (this._checked) {
          this.updateRadioGroup();
        }
        this._syncGroupFormState();
        break;
      case "disabled":
        this._updateDisabledState();
        break;
      case "error":
        this._error = newValue !== null;
        break;
      case "name":
        // Both the group it left and the group it joined may change validity.
        if (this.isConnected) {
          if (oldValue) this._syncGroupFormState(oldValue);
          this._syncGroupFormState();
        }
        break;
      case "value":
        this._value = newValue || "";
        this._syncGroupFormState();
        break;
      case "required":
        if (newValue !== null) this.setAttribute("aria-required", "true");
        else this.removeAttribute("aria-required");
        this._syncGroupFormState();
        break;
      case "size":
        this.updateSize();
        break;
      case "label":
        if (this.label) {
          this.setAttribute("aria-label", this.label);
        } else {
          this.removeAttribute("aria-label");
        }
        break;
    }

    this.render();
  }

  updateSize() {
    const size = (this.getAttribute("size") || "").toLowerCase();
    const sizeMap = {
      sm: {
        icon: "var(--ds-size-icon-sm)",
        control: "var(--ds-size-control-sm)",
      },
      md: {
        icon: "var(--ds-size-icon-md)",
        control: "var(--ds-size-control-md)",
      },
      lg: {
        icon: "var(--ds-size-icon-lg)",
        control: "var(--ds-size-control-lg)",
      },
    };

    if (sizeMap[size]) {
      this.style.setProperty("--ds-radio-size", sizeMap[size].icon);
      this.style.setProperty(
        "--ds-radio-dot-size",
        `calc(${sizeMap[size].icon} / 2)`,
      );
      this.style.setProperty(
        "--ds-radio-state-layer-size",
        sizeMap[size].control,
      );
      return;
    }

    this.style.removeProperty("--ds-radio-size");
    this.style.removeProperty("--ds-radio-dot-size");
    this.style.removeProperty("--ds-radio-state-layer-size");
  }

  get checked() {
    return this._checked;
  }

  set checked(value) {
    this._reflecting = true;
    this.toggleAttribute("checked", Boolean(value));
    this._reflecting = false;
  }

  get required() {
    return this.hasAttribute("required");
  }

  set required(value) {
    this.toggleAttribute("required", Boolean(value));
  }

  get error() {
    return this._error;
  }

  set error(value) {
    const hasError = Boolean(value);
    if (hasError) {
      this.setAttribute("error", "");
    } else {
      this.removeAttribute("error");
    }
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("label");
      return;
    }
    this.setAttribute("label", String(value));
  }

  get size() {
    return this.getAttribute("size") || "";
  }

  set size(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("size");
      return;
    }
    this.setAttribute("size", String(value));
  }

  // Bound once in the constructor, so reconnecting doesn't stack handlers.
  setupEventListeners() {
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    this.addEventListener("focus", this._onFocus);
    this.addEventListener("blur", this._onBlur);
  }

  handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    if (!this.checked) {
      this._select();
    }
  }

  handleKeydown(e) {
    if (this.disabled) return;

    // Space or Enter to select
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!this.checked) {
        this._select();
      }
      return;
    }

    // Arrow keys to navigate radio group
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      this.navigateRadioGroup(e.key);
    }
  }

  navigateRadioGroup(key) {
    if (!this.name) return;

    const radios = this._groupMembers().filter((radio) => !radio.disabled);

    const currentIndex = radios.indexOf(this);
    if (currentIndex === -1) return;

    let nextIndex;
    if (key === "ArrowDown" || key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % radios.length;
    } else {
      nextIndex = (currentIndex - 1 + radios.length) % radios.length;
    }

    const nextRadio = radios[nextIndex];
    nextRadio.focus();
    // Arrow selection changes the group's value, so it announces the change
    // as a click does.
    if (!nextRadio.checked) nextRadio._select();
  }

  updateRadioGroup() {
    if (!this.checked || !this.name) return;

    // Uncheck the rest of the group
    this._groupMembers().forEach((radio) => {
      if (radio !== this && radio.checked) {
        radio.checked = false;
      }
    });
  }

  render() {
    const label = this.label;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ds-space-2, 8px);
          position: relative;
          cursor: pointer;
          --ds-radio-dot-size: calc(
            var(--ds-radio-size, 20px) / 2
          );
        }

        .radio-label {
          font: var(--md-sys-typescale-body-medium-font, 400 14px/20px Roboto, sans-serif);
          color: var(--md-sys-color-on-surface);
          user-select: none;
        }

        :host([error]) .radio-label {
          color: var(--md-sys-color-error);
        }

        :host(:disabled) {
          cursor: not-allowed;
          opacity: 0.38;
        }

        .radio {
          flex-shrink: 0;
          position: relative;
          width: var(--ds-radio-size, 20px);
          height: var(--ds-radio-size, 20px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* State layer container */
        .state-layer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: var(--ds-radio-state-layer-size, var(--ds-size-hit-area, 40px));
          height: var(--ds-radio-state-layer-size, var(--ds-size-hit-area, 40px));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        /* Hover state */
        :host(:not(:disabled):hover) .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--md-sys-state-hover-opacity) * 100%), transparent);
        }

        :host([checked]:not(:disabled):hover) .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-primary) calc(var(--md-sys-state-hover-opacity) * 100%), transparent);
        }

        /* Focus state */
        .radio.focused .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--md-sys-state-focus-opacity) * 100%), transparent);
        }

        :host([checked]) .radio.focused .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-primary) calc(var(--md-sys-state-focus-opacity) * 100%), transparent);
        }

        /* Pressed state */
        :host(:not(:disabled):active) .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--md-sys-state-pressed-opacity) * 100%), transparent);
        }

        :host([checked]:not(:disabled):active) .state-layer {
          background-color: color-mix(in srgb, var(--md-sys-color-primary) calc(var(--md-sys-state-pressed-opacity) * 100%), transparent);
        }

        /* Outer circle */
        .outer-circle {
          width: var(--ds-radio-size, 20px);
          height: var(--ds-radio-size, 20px);
          border-radius: 50%;
          border: 2px solid var(--md-sys-color-on-surface-variant);
          box-sizing: border-box;
          transition: border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
          position: relative;
        }

        :host([checked]) .outer-circle {
          border-color: var(--md-sys-color-primary);
          border-width: 2px;
        }

        :host([error]) .outer-circle {
          border-color: var(--md-sys-color-error);
        }

        :host([checked][error]) .outer-circle {
          border-color: var(--md-sys-color-error);
        }

        /* Inner circle (dot) */
        .inner-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: var(--ds-radio-dot-size, 10px);
          height: var(--ds-radio-dot-size, 10px);
          border-radius: 50%;
          background-color: var(--md-sys-color-primary);
          transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
        }

        :host([checked]) .inner-circle {
          transform: translate(-50%, -50%) scale(1);
        }

        :host([error]) .inner-circle {
          background-color: var(--md-sys-color-error);
        }

        /* Disabled state */
        :host(:disabled) .outer-circle {
          border-color: var(--md-sys-color-on-surface);
        }

        :host(:disabled) .inner-circle {
          background-color: var(--md-sys-color-on-surface);
        }
      </style>
      
      <div class="radio">
        <div class="state-layer">
          <div class="outer-circle">
            <div class="inner-circle"></div>
          </div>
        </div>
      </div>
      ${label ? `<span class="radio-label" part="label">${label}</span>` : ""}
    `;
  }
}

customElements.define("ds-radio", DSRadio);
