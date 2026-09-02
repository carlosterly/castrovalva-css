import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../src/components/ds-chip.js";

describe("DSChip", () => {
  describe("Initialization", () => {
    it("should set default state and accessibility", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      expect(el.variant).to.equal("assist");
      expect(el.selected).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.elevated).to.be.false;
      expect(el.getAttribute("role")).to.equal("button");
      expect(el.getAttribute("tabindex")).to.equal("0");
      expect(el.getAttribute("aria-disabled")).to.equal("false");
    });

    it("should use checkbox role for filter chips", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Filter"></ds-chip>`,
      );

      expect(el.getAttribute("role")).to.equal("checkbox");
      expect(el.getAttribute("aria-checked")).to.equal("false");
    });

    it("should keep an author-defined role", async () => {
      const el = await fixture(
        html`<ds-chip role="menuitem" label="Chip"></ds-chip>`,
      );

      expect(el.getAttribute("role")).to.equal("menuitem");
    });
  });

  describe("Rendering", () => {
    it("should render the label text", async () => {
      const el = await fixture(html`<ds-chip label="Label"></ds-chip>`);
      const label = el.shadowRoot.querySelector(".label");

      expect(label).to.exist;
      expect(label.textContent).to.equal("Label");
    });

    it("should render a leading icon when provided", async () => {
      const el = await fixture(
        html`<ds-chip label="Add" icon="add"></ds-chip>`,
      );
      const icon = el.shadowRoot.querySelector(".leading-icon");

      expect(icon).to.exist;
      expect(icon.textContent).to.equal("add");
    });

    it("should render an avatar when provided", async () => {
      const el = await fixture(
        html`<ds-chip
          label="Avatar"
          avatar="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></ds-chip>`,
      );
      const avatar = el.shadowRoot.querySelector(".avatar");

      expect(avatar).to.exist;
      expect(avatar.getAttribute("src")).to.contain("data:image/gif");
    });

    it("should render a checkmark for selected filter chips", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Filter" selected></ds-chip>`,
      );
      const checkmark = el.shadowRoot.querySelector(".checkmark");

      expect(checkmark).to.exist;
    });

    it("should render a remove button for input chips", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag"></ds-chip>`,
      );
      const removeButton = el.shadowRoot.querySelector(".remove-btn");

      expect(removeButton).to.exist;
      expect(removeButton.getAttribute("aria-label")).to.equal("Remove Tag");
      expect(removeButton.getAttribute("tabindex")).to.equal("-1");
    });
  });

  describe("Attributes", () => {
    it("should update role when variant changes", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      el.setAttribute("variant", "filter");
      expect(el.getAttribute("role")).to.equal("checkbox");
      expect(el.getAttribute("aria-checked")).to.equal("false");

      el.setAttribute("variant", "assist");
      expect(el.getAttribute("role")).to.equal("button");
      expect(el.hasAttribute("aria-checked")).to.be.false;
    });

    it("should update aria-checked when selected changes", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Chip"></ds-chip>`,
      );

      el.setAttribute("selected", "");
      expect(el.getAttribute("aria-checked")).to.equal("true");

      el.removeAttribute("selected");
      expect(el.getAttribute("aria-checked")).to.equal("false");
    });

    it("should update aria-disabled and tabindex when disabled", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      el.setAttribute("disabled", "");
      expect(el.getAttribute("aria-disabled")).to.equal("true");
      expect(el.getAttribute("tabindex")).to.equal("-1");
    });
  });

  describe("Properties", () => {
    it("should reflect selected property changes", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Chip"></ds-chip>`,
      );

      el.selected = true;
      expect(el.hasAttribute("selected")).to.be.true;

      el.selected = false;
      expect(el.hasAttribute("selected")).to.be.false;
    });

    it("should reflect disabled property changes", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      el.disabled = true;
      expect(el.hasAttribute("disabled")).to.be.true;

      el.disabled = false;
      expect(el.hasAttribute("disabled")).to.be.false;
    });

    it("should reflect elevated property changes", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      el.elevated = true;
      expect(el.hasAttribute("elevated")).to.be.true;

      el.elevated = false;
      expect(el.hasAttribute("elevated")).to.be.false;
    });

    it("should reflect variant property changes", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      el.variant = "filter";
      expect(el.getAttribute("variant")).to.equal("filter");
    });
  });

  describe("States", () => {
    it("should toggle selected state for filter chips on click", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Chip"></ds-chip>`,
      );

      expect(el.selected).to.be.false;
      el.click();
      expect(el.selected).to.be.true;
      expect(el.getAttribute("aria-checked")).to.equal("true");
    });

    it("should ignore interactions when disabled", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Chip" disabled></ds-chip>`,
      );

      let clickCount = 0;
      el.addEventListener("ds-chip:click", () => {
        clickCount += 1;
      });

      el.click();
      expect(el.selected).to.be.false;
      expect(clickCount).to.equal(0);
    });
  });

  describe("Events", () => {
    it("should emit ds-chip:click with detail", async () => {
      const el = await fixture(
        html`<ds-chip variant="filter" label="Chip"></ds-chip>`,
      );

      const eventPromise = oneEvent(el, "ds-chip:click");
      el.click();
      const event = await eventPromise;

      expect(event.detail.variant).to.equal("filter");
      expect(event.detail.selected).to.be.true;
      expect(event.detail.label).to.equal("Chip");
    });

    it("should emit ds-chip:remove from remove button", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag"></ds-chip>`,
      );
      const removeButton = el.shadowRoot.querySelector(".remove-btn");

      const eventPromise = oneEvent(el, "ds-chip:remove");
      removeButton.click();
      const event = await eventPromise;

      expect(event.detail.label).to.equal("Tag");
    });

    it("should not emit ds-chip:click when remove button is used", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag"></ds-chip>`,
      );
      const removeButton = el.shadowRoot.querySelector(".remove-btn");

      let clickFired = false;
      el.addEventListener("ds-chip:click", () => {
        clickFired = true;
      });

      removeButton.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(clickFired).to.be.false;
    });
  });

  describe("Keyboard", () => {
    it("should activate on Space key", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      const eventPromise = oneEvent(el, "ds-chip:click");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      const event = await eventPromise;

      expect(event.detail.label).to.equal("Chip");
    });

    it("should activate on Enter key", async () => {
      const el = await fixture(html`<ds-chip label="Chip"></ds-chip>`);

      const eventPromise = oneEvent(el, "ds-chip:click");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      const event = await eventPromise;

      expect(event.detail.label).to.equal("Chip");
    });

    it("should emit remove event on Delete for input chips", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag"></ds-chip>`,
      );

      const eventPromise = oneEvent(el, "ds-chip:remove");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
      const event = await eventPromise;

      expect(event.detail.label).to.equal("Tag");
    });

    it("should emit remove event on Backspace for input chips", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag"></ds-chip>`,
      );

      const eventPromise = oneEvent(el, "ds-chip:remove");
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
      const event = await eventPromise;

      expect(event.detail.label).to.equal("Tag");
    });

    it("should ignore keyboard events when disabled", async () => {
      const el = await fixture(
        html`<ds-chip variant="input" label="Tag" disabled></ds-chip>`,
      );

      let removeFired = false;
      el.addEventListener("ds-chip:remove", () => {
        removeFired = true;
      });

      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(removeFired).to.be.false;
    });
  });

  describe("Accessibility", () => {
    it("should set aria-disabled to true when disabled", async () => {
      const el = await fixture(html`<ds-chip label="Chip" disabled></ds-chip>`);

      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should only set aria-checked for filter chips", async () => {
      const assist = await fixture(html`<ds-chip label="Chip"></ds-chip>`);
      const filter = await fixture(
        html`<ds-chip variant="filter" label="Filter"></ds-chip>`,
      );

      expect(assist.hasAttribute("aria-checked")).to.be.false;
      expect(filter.getAttribute("aria-checked")).to.equal("false");
    });
  });
});
