import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../src/components/checkbox/checkbox.js";

// Test suite for ds-checkbox behavior and accessibility.

describe("DSCheckbox", () => {
  describe("Initialization", () => {
    it("should set default attributes", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.checked).to.be.false;
      expect(el.indeterminate).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.getAttribute("tabindex")).to.equal("0");
    });

    it("should set role on connect", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.getAttribute("role")).to.equal("checkbox");
    });
  });

  describe("Rendering", () => {
    it("should render with default unchecked state", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el).to.exist;
      expect(el.checked).to.be.false;
      expect(el.indeterminate).to.be.false;

      const icon = el.shadowRoot.querySelector(".checkbox-icon");
      expect(icon.textContent).to.equal("check_box_outline_blank");
    });

    it("should render with label", async () => {
      const el = await fixture(
        html`<ds-checkbox label="Accept terms"></ds-checkbox>`,
      );

      const label = el.shadowRoot.querySelector(".checkbox-label");
      expect(label.textContent).to.equal("Accept terms");
      expect(label.style.display).to.not.equal("none");
    });

    it("should hide label when not provided", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const label = el.shadowRoot.querySelector(".checkbox-label");
      expect(label.style.display).to.equal("none");
    });

    it("should render state layer", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const stateLayer = el.shadowRoot.querySelector(".state-layer");
      expect(stateLayer).to.exist;
    });

    it("should render hidden native input", async () => {
      const el = await fixture(
        html`<ds-checkbox name="terms" value="agreed"></ds-checkbox>`,
      );

      const input = el.shadowRoot.querySelector('input[type="checkbox"]');
      expect(input).to.exist;
      expect(input.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  describe("Attributes", () => {
    it("should treat checked attribute as true when present", async () => {
      const el = await fixture(
        html`<ds-checkbox checked="false"></ds-checkbox>`,
      );

      expect(el.checked).to.be.true;
    });

    it("should reflect checked state when attribute is removed", async () => {
      const el = await fixture(html`<ds-checkbox checked></ds-checkbox>`);

      el.removeAttribute("checked");
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should update size styles when size attribute changes", async () => {
      const el = await fixture(html`<ds-checkbox size="sm"></ds-checkbox>`);

      expect(el.style.getPropertyValue("--ds-checkbox-size")).to.equal(
        "var(--ds-size-icon-sm)",
      );

      el.setAttribute("size", "lg");
      await el.updateComplete;

      expect(el.style.getPropertyValue("--ds-checkbox-size")).to.equal(
        "var(--ds-size-icon-lg)",
      );
    });
  });

  describe("States", () => {
    it("should be checked when checked attribute is set", async () => {
      const el = await fixture(html`<ds-checkbox checked></ds-checkbox>`);

      expect(el.checked).to.be.true;

      const icon = el.shadowRoot.querySelector(".checkbox-icon");
      expect(icon.textContent).to.equal("check_box");

      const container = el.shadowRoot.querySelector(".checkbox-container");
      expect(container.classList.contains("checked")).to.be.true;
    });

    it("should be indeterminate when indeterminate attribute is set", async () => {
      const el = await fixture(html`<ds-checkbox indeterminate></ds-checkbox>`);

      expect(el.indeterminate).to.be.true;

      const icon = el.shadowRoot.querySelector(".checkbox-icon");
      expect(icon.textContent).to.equal("indeterminate_check_box");

      const container = el.shadowRoot.querySelector(".checkbox-container");
      expect(container.classList.contains("indeterminate")).to.be.true;
    });

    it("should be disabled when disabled attribute is set", async () => {
      const el = await fixture(html`<ds-checkbox disabled></ds-checkbox>`);

      expect(el.disabled).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should be in error state when error attribute is set", async () => {
      const el = await fixture(html`<ds-checkbox error></ds-checkbox>`);

      expect(el.error).to.be.true;
      expect(el.getAttribute("aria-invalid")).to.equal("true");
    });

    it("should be required when required attribute is set", async () => {
      const el = await fixture(html`<ds-checkbox required></ds-checkbox>`);

      expect(el.required).to.be.true;
      expect(el.getAttribute("aria-required")).to.equal("true");
    });
  });

  describe("Interaction", () => {
    it("should toggle checked state on click", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.checked).to.be.false;

      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;

      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should toggle checked state on Space key", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.checked).to.be.false;

      const event = new KeyboardEvent("keydown", { key: " " });
      el.dispatchEvent(event);
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it("should toggle checked state on Spacebar key", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const event = new KeyboardEvent("keydown", { key: "Spacebar" });
      el.dispatchEvent(event);
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });

    it("should not toggle on Enter key", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      el.dispatchEvent(event);
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should not toggle when disabled", async () => {
      const el = await fixture(html`<ds-checkbox disabled></ds-checkbox>`);

      expect(el.checked).to.be.false;

      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should change from indeterminate to checked on click", async () => {
      const el = await fixture(html`<ds-checkbox indeterminate></ds-checkbox>`);

      expect(el.indeterminate).to.be.true;
      expect(el.checked).to.be.false;

      el.click();
      await el.updateComplete;

      expect(el.indeterminate).to.be.false;
      expect(el.checked).to.be.true;
    });
  });

  describe("Events", () => {
    it("should emit ds-checkbox:change event on toggle", async () => {
      const el = await fixture(html`<ds-checkbox value="test"></ds-checkbox>`);

      setTimeout(() => el.click());
      const { detail } = await oneEvent(el, "ds-checkbox:change");

      expect(detail.checked).to.be.true;
      expect(detail.indeterminate).to.be.false;
      expect(detail.value).to.equal("test");
    });

    it("should emit native change event", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      setTimeout(() => el.click());
      await oneEvent(el, "change");

      expect(el.checked).to.be.true;
    });

    it("should include indeterminate state in event detail", async () => {
      const el = await fixture(html`<ds-checkbox indeterminate></ds-checkbox>`);

      setTimeout(() => el.click());
      const { detail } = await oneEvent(el, "ds-checkbox:change");

      expect(detail.checked).to.be.true;
      expect(detail.indeterminate).to.be.false;
    });
  });

  describe("Sizing", () => {
    it("should apply small size tokens", async () => {
      const el = await fixture(html`<ds-checkbox size="sm"></ds-checkbox>`);

      expect(el.style.getPropertyValue("--ds-checkbox-size")).to.equal(
        "var(--ds-size-icon-sm)",
      );
      expect(el.style.getPropertyValue("--ds-checkbox-icon-size")).to.equal(
        "var(--ds-size-icon-sm)",
      );
      expect(
        el.style.getPropertyValue("--ds-checkbox-state-layer-size"),
      ).to.equal("var(--ds-size-control-sm)");
    });

    it("should apply large size tokens", async () => {
      const el = await fixture(html`<ds-checkbox size="lg"></ds-checkbox>`);

      expect(el.style.getPropertyValue("--ds-checkbox-size")).to.equal(
        "var(--ds-size-icon-lg)",
      );
      expect(el.style.getPropertyValue("--ds-checkbox-icon-size")).to.equal(
        "var(--ds-size-icon-lg)",
      );
      expect(
        el.style.getPropertyValue("--ds-checkbox-state-layer-size"),
      ).to.equal("var(--ds-size-control-lg)");
    });

    it("should clear custom size when size is invalid", async () => {
      const el = await fixture(html`<ds-checkbox size="xl"></ds-checkbox>`);

      expect(el.style.getPropertyValue("--ds-checkbox-size")).to.equal("");
      expect(el.style.getPropertyValue("--ds-checkbox-icon-size")).to.equal("");
      expect(
        el.style.getPropertyValue("--ds-checkbox-state-layer-size"),
      ).to.equal("");
    });
  });

  describe("Properties", () => {
    it("should update checked property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.checked).to.be.false;

      el.checked = true;
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el.hasAttribute("checked")).to.be.true;

      const icon = el.shadowRoot.querySelector(".checkbox-icon");
      expect(icon.textContent).to.equal("check_box");
    });

    it("should update indeterminate property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.indeterminate).to.be.false;

      el.indeterminate = true;
      await el.updateComplete;

      expect(el.indeterminate).to.be.true;
      expect(el.hasAttribute("indeterminate")).to.be.true;

      const icon = el.shadowRoot.querySelector(".checkbox-icon");
      expect(icon.textContent).to.equal("indeterminate_check_box");
    });

    it("should update disabled property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.disabled).to.be.false;

      el.disabled = true;
      await el.updateComplete;

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should update error property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.error).to.be.false;

      el.error = true;
      await el.updateComplete;

      expect(el.error).to.be.true;
      expect(el.hasAttribute("error")).to.be.true;
      expect(el.getAttribute("aria-invalid")).to.equal("true");
    });

    it("should update required property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.required).to.be.false;

      el.required = true;
      await el.updateComplete;

      expect(el.required).to.be.true;
      expect(el.hasAttribute("required")).to.be.true;
      expect(el.getAttribute("aria-required")).to.equal("true");
    });

    it("should update label property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      el.label = "New label";
      await el.updateComplete;

      expect(el.label).to.equal("New label");

      const label = el.shadowRoot.querySelector(".checkbox-label");
      expect(label.textContent).to.equal("New label");
    });

    it("should update value property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      el.value = "test-value";
      await el.updateComplete;

      expect(el.value).to.equal("test-value");

      const input = el.shadowRoot.querySelector("input");
      expect(input.value).to.equal("test-value");
    });

    it("should update name property", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      el.name = "test-name";
      await el.updateComplete;

      expect(el.name).to.equal("test-name");

      const input = el.shadowRoot.querySelector("input");
      expect(input.name).to.equal("test-name");
    });
  });

  describe("Accessibility", () => {
    it('should have role="checkbox"', async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.getAttribute("role")).to.equal("checkbox");
    });

    it('should have aria-checked="false" when unchecked', async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.getAttribute("aria-checked")).to.equal("false");
    });

    it('should have aria-checked="true" when checked', async () => {
      const el = await fixture(html`<ds-checkbox checked></ds-checkbox>`);

      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it('should have aria-checked="mixed" when indeterminate', async () => {
      const el = await fixture(html`<ds-checkbox indeterminate></ds-checkbox>`);

      expect(el.getAttribute("aria-checked")).to.equal("mixed");
    });

    it("should have aria-disabled when disabled", async () => {
      const el = await fixture(html`<ds-checkbox disabled></ds-checkbox>`);

      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should have aria-invalid when error", async () => {
      const el = await fixture(html`<ds-checkbox error></ds-checkbox>`);

      expect(el.getAttribute("aria-invalid")).to.equal("true");
    });

    it("should have aria-required when required", async () => {
      const el = await fixture(html`<ds-checkbox required></ds-checkbox>`);

      expect(el.getAttribute("aria-required")).to.equal("true");
    });

    it("should have aria-label from label attribute", async () => {
      const el = await fixture(
        html`<ds-checkbox label="Accept terms"></ds-checkbox>`,
      );

      expect(el.getAttribute("aria-label")).to.equal("Accept terms");
    });

    it('should have tabindex="0" when not disabled', async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.getAttribute("tabindex")).to.equal("0");
    });

    it('should have tabindex="-1" when disabled', async () => {
      const el = await fixture(html`<ds-checkbox disabled></ds-checkbox>`);

      expect(el.getAttribute("tabindex")).to.equal("-1");
    });

    it("should be focusable", async () => {
      const el = await fixture(html`<ds-checkbox label="Test"></ds-checkbox>`);

      el.focus();
      expect(document.activeElement).to.equal(el);
    });

    it("should match focus-visible after keyboard interaction", async () => {
      const el = await fixture(html`<ds-checkbox label="Test"></ds-checkbox>`);

      const event = new KeyboardEvent("keydown", { key: "Tab" });
      el.dispatchEvent(event);
      el.focus();

      expect(el.matches(":focus-visible") || document.activeElement === el).to
        .be.true;
    });
  });

  describe("Methods", () => {
    it("should support focus() method", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      el.focus();
      expect(document.activeElement).to.equal(el);
    });

    it("should support blur() method", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      el.focus();
      expect(document.activeElement).to.equal(el);

      el.blur();
      expect(document.activeElement).to.not.equal(el);
    });

    it("should support toggle() method", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      expect(el.checked).to.be.false;

      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.be.true;

      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should not toggle when disabled via toggle() method", async () => {
      const el = await fixture(html`<ds-checkbox disabled></ds-checkbox>`);

      expect(el.checked).to.be.false;

      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it("should set form value via internals when checked", async () => {
      const el = await fixture(html`<ds-checkbox value="yes"></ds-checkbox>`);

      let setValue = null;
      el._internals = {
        setFormValue: (value) => {
          setValue = value;
        },
      };

      el.checked = true;
      el.updateCheckState();

      expect(setValue).to.equal("yes");
    });
  });

  describe("Integration", () => {
    it("should contribute to form data when checked", async () => {
      const form = document.createElement("form");
      const el = document.createElement("ds-checkbox");

      el.setAttribute("name", "subscribe");
      el.setAttribute("value", "yes");
      el.checked = true;

      form.appendChild(el);
      document.body.appendChild(form);

      const data = new FormData(form);
      expect(data.get("subscribe")).to.equal("yes");

      document.body.removeChild(form);
    });
  });

  describe("CSS Parts", () => {
    it("should expose container part", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("should expose input part", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const input = el.shadowRoot.querySelector('[part="input"]');
      expect(input).to.exist;
    });

    it("should expose icon part", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const icon = el.shadowRoot.querySelector('[part="icon"]');
      expect(icon).to.exist;
    });

    it("should expose label part", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const label = el.shadowRoot.querySelector('[part="label"]');
      expect(label).to.exist;
    });

    it("should expose state-layer part", async () => {
      const el = await fixture(html`<ds-checkbox></ds-checkbox>`);

      const stateLayer = el.shadowRoot.querySelector('[part="state-layer"]');
      expect(stateLayer).to.exist;
    });
  });
});
