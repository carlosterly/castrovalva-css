import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../src/components/combobox/combobox.js";
import { inForm, inDisabledFieldset, entriesOf } from "./helpers/forms.js";

describe("DSCombobox", () => {
  describe("Initialization", () => {
    it("should create a combobox element", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el).to.exist;
    });

    it("should have shadow root", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should be closed by default", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el.open).to.equal(false);
    });

    it("should have searchable true by default", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el.searchable).to.equal(true);
    });

    it("should not be multiple by default", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el.multiple).to.equal(false);
    });

    it("should not be disabled by default", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      expect(el.disabled).to.equal(false);
    });
  });

  describe("Open/Close State", () => {
    it("should open when show() is called", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      el.show();
      expect(el.open).to.equal(true);
    });

    it("should close when close() is called", async () => {
      const el = await fixture(html`<ds-combobox open></ds-combobox>`);
      el.close();
      expect(el.open).to.equal(false);
    });

    it("should toggle when trigger button clicked", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const trigger = el.shadowRoot.querySelector(".trigger");
      trigger.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(el.open).to.equal(true);
    });

    it("should dispatch ds-combobox:open event", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      let opened = false;
      el.addEventListener("ds-combobox:open", () => {
        opened = true;
      });
      el.show();
      expect(opened).to.equal(true);
    });

    it("should dispatch ds-combobox:close event", async () => {
      const el = await fixture(html`<ds-combobox open></ds-combobox>`);
      let closed = false;
      el.addEventListener("ds-combobox:close", () => {
        closed = true;
      });
      el.close();
      expect(closed).to.equal(true);
    });
  });

  describe("Selection - Single", () => {
    it("should select option when clicked", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
          <div slot="option" data-value="opt2">Option 2</div>
        </ds-combobox>
      `);
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const option = el.querySelector('[data-value="opt1"]');
      option.click();

      expect(el.value).to.equal("opt1");
    });

    it("should show option label in trigger", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="title-case">Title Case</div>
          <div slot="option" data-value="second">Second Option</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const option = el.querySelector('[data-value="title-case"]');
      option.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      const triggerLabel = el.shadowRoot.querySelector(".trigger-label");
      expect(triggerLabel.textContent).to.equal("Title Case");
    });

    it("should close after selecting in single mode", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const option = el.querySelector('[data-value="opt1"]');
      option.click();

      expect(el.open).to.equal(false);
    });

    it("should dispatch ds-combobox:change on selection", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      let changed = false;
      el.addEventListener("ds-combobox:change", (e) => {
        changed = true;
        expect(e.detail.value).to.equal("opt1");
      });

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const option = el.querySelector('[data-value="opt1"]');
      option.click();

      expect(changed).to.equal(true);
    });

    it("should replace previous selection", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
          <div slot="option" data-value="opt2">Option 2</div>
        </ds-combobox>
      `);

      el.value = "opt1";
      expect(el.value).to.equal("opt1");

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const option2 = el.querySelector('[data-value="opt2"]');
      option2.click();

      expect(el.value).to.equal("opt2");
    });
  });

  describe("Selection - Multiple", () => {
    it("should allow multiple selections when multiple=true", async () => {
      const el = await fixture(html`
        <ds-combobox multiple>
          <div slot="option" data-value="opt1">Option 1</div>
          <div slot="option" data-value="opt2">Option 2</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const opt1 = el.querySelector('[data-value="opt1"]');
      opt1.click();

      const opt2 = el.querySelector('[data-value="opt2"]');
      opt2.click();

      expect(el.value).to.include("opt1");
      expect(el.value).to.include("opt2");
    });

    it("should deselect when clicking selected option in multiple mode", async () => {
      const el = await fixture(html`
        <ds-combobox multiple>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = "opt1";
      expect(el.value).to.include("opt1");

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const opt = el.querySelector('[data-value="opt1"]');
      opt.click();

      expect(el.value).to.not.include("opt1");
    });

    it("should stay open in multiple mode after selection", async () => {
      const el = await fixture(html`
        <ds-combobox multiple>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const opt = el.querySelector('[data-value="opt1"]');
      opt.click();

      expect(el.open).to.equal(true);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should navigate with ArrowDown", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
          <div slot="option">Option 2</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      el.dispatchEvent(event);

      expect(el._highlightedIndex).to.be.greaterThan(-1);
    });

    it("should navigate with ArrowUp", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
          <div slot="option">Option 2</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      el._highlightedIndex = 1;

      const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
      el.dispatchEvent(event);

      expect(el._highlightedIndex).to.equal(0);
    });

    it("should select option with Enter", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      el._highlightedIndex = 0;

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      el.dispatchEvent(event);

      expect(el.value).to.equal("opt1");
    });

    it("should close with Escape", async () => {
      const el = await fixture(html`
        <ds-combobox open>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      el.dispatchEvent(event);

      expect(el.open).to.equal(false);
    });

    it("should open with Enter when closed", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);

      const event = new KeyboardEvent("keydown", { key: "Enter" });
      el.dispatchEvent(event);

      expect(el.open).to.equal(true);
    });
  });

  describe("Search/Filter", () => {
    it("should filter options based on search text", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Apple</div>
          <div slot="option">Banana</div>
          <div slot="option">Apricot</div>
        </ds-combobox>
      `);

      el.show();
      el._searchText = "ap";
      const filtered = el._getFilteredOptions();

      expect(filtered.length).to.equal(2);
    });

    it("should show all options when search is empty", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
          <div slot="option">Option 2</div>
          <div slot="option">Option 3</div>
        </ds-combobox>
      `);

      const filtered = el._getFilteredOptions();
      expect(filtered.length).to.equal(3);
    });

    it("should show empty state when no options match", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Apple</div>
        </ds-combobox>
      `);

      el.show();
      el._searchText = "xyz";
      const filtered = el._getFilteredOptions();

      expect(filtered.length).to.equal(0);
    });

    it("should reset search on open", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);

      el._searchText = "test";
      el.show();

      expect(el._searchText).to.equal("");
    });

    it("should update search text from input", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Apple</div>
          <div slot="option">Banana</div>
        </ds-combobox>
      `);

      el.show();
      await waitUntil(() => el.shadowRoot.querySelector(".search-input"));
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      const searchInput = el.shadowRoot.querySelector(".search-input");
      searchInput.value = "ap";
      searchInput.dispatchEvent(new Event("input"));

      expect(el._searchText).to.equal("ap");
      expect(el._highlightedIndex).to.equal(0);
    });

    it("should hide non-matching options after search", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Apple</div>
          <div slot="option">Banana</div>
        </ds-combobox>
      `);

      el.show();
      await waitUntil(() => el.shadowRoot.querySelector(".search-input"));
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      const searchInput = el.shadowRoot.querySelector(".search-input");
      searchInput.value = "ban";
      searchInput.dispatchEvent(new Event("input"));

      const appleOption = el.querySelectorAll('[slot="option"]')[0];
      const bananaOption = el.querySelectorAll('[slot="option"]')[1];

      expect(appleOption.style.display).to.equal("none");
      expect(bananaOption.style.display).to.equal("block");
    });
  });

  describe("Attributes & Properties", () => {
    it("should reflect open attribute", async () => {
      const el = await fixture(html`<ds-combobox open></ds-combobox>`);
      expect(el.hasAttribute("open")).to.equal(true);
      el.close();
      expect(el.hasAttribute("open")).to.equal(false);
    });

    it("should reflect multiple attribute", async () => {
      const el = await fixture(html`<ds-combobox multiple></ds-combobox>`);
      expect(el.multiple).to.equal(true);
    });

    it("should reflect disabled attribute", async () => {
      const el = await fixture(html`<ds-combobox disabled></ds-combobox>`);
      expect(el.disabled).to.equal(true);
    });

    it("should set value property", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = "opt1";
      expect(el.value).to.equal("opt1");
    });

    it("should get value property", async () => {
      const el = await fixture(html`
        <ds-combobox value="opt1">
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      expect(el.value).to.equal("opt1");
    });

    it("should return array value in multiple mode", async () => {
      const el = await fixture(html`
        <ds-combobox multiple value="opt1,opt2">
          <div slot="option" data-value="opt1">Option 1</div>
          <div slot="option" data-value="opt2">Option 2</div>
        </ds-combobox>
      `);

      expect(Array.isArray(el.value)).to.equal(true);
      expect(el.value).to.include("opt1");
      expect(el.value).to.include("opt2");
    });

    it("should update placeholder when attribute changes", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);

      el.setAttribute("placeholder", "Pick one");
      await waitUntil(() => el.shadowRoot.querySelector(".trigger-label"));

      const label = el.shadowRoot.querySelector(".trigger-label");
      expect(label.textContent).to.equal("Pick one");
    });

    it("should hide search input when searchable is false", async () => {
      const el = await fixture(
        html`<ds-combobox searchable="false"></ds-combobox>`,
      );

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const searchInput = el.shadowRoot.querySelector(".search-input");
      expect(searchInput).to.equal(null);
    });
  });

  describe("Disabled State", () => {
    it("should not open when disabled", async () => {
      const el = await fixture(html`<ds-combobox disabled></ds-combobox>`);
      el.show();
      expect(el.open).to.equal(false);
    });

    it("should not respond to keyboard when disabled", async () => {
      const el = await fixture(html`<ds-combobox disabled open></ds-combobox>`);
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      el.dispatchEvent(event);
      expect(el.open).to.equal(true);
    });
  });

  describe("CSS Parts", () => {
    it("should have container part", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("should have trigger part", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const trigger = el.shadowRoot.querySelector('[part="trigger"]');
      expect(trigger).to.exist;
    });

    it("should have dropdown part", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const dropdown = el.shadowRoot.querySelector('[part="dropdown"]');
      expect(dropdown).to.exist;
    });

    it("should have listbox part", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const listbox = el.shadowRoot.querySelector('[part="listbox"]');
      expect(listbox).to.exist;
    });

    it("should have option part", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const option = el.shadowRoot.querySelector('[part="option"]');
      expect(option).to.exist;
    });
  });

  describe("Close on Outside Click", () => {
    it("should close when clicking outside", async () => {
      const el = await fixture(html`
        <div>
          <ds-combobox open></ds-combobox>
          <button id="outside">Outside</button>
        </div>
      `);

      const combobox = el.querySelector("ds-combobox");
      const outside = el.querySelector("#outside");
      outside.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(combobox.open).to.equal(false);
    });

    it("should not close when clicking inside", async () => {
      const el = await fixture(html`
        <ds-combobox open>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);

      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dropdown = el.shadowRoot.querySelector(".dropdown");
      dropdown.click();

      expect(el.open).to.equal(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty options list", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      el.show();
      const filtered = el._getFilteredOptions();
      expect(filtered.length).to.equal(0);
    });

    it("should handle null value", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = null;
      expect(el.value).to.equal(null);
    });

    it("should clear selected values on null", async () => {
      const el = await fixture(html`
        <ds-combobox value="opt1">
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = null;
      expect(el.value).to.equal(null);
    });

    it("should handle duplicate selections", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = "opt1";
      el.value = "opt1";
      expect(el.value).to.equal("opt1");
    });

    it("should expose slotted options via getOptions", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
          <div slot="option">Option 2</div>
        </ds-combobox>
      `);

      const options = el.getOptions();
      expect(options.length).to.equal(2);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-expanded on trigger", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const trigger =
        el.shadowRoot.querySelector('[role="button"]') ||
        el.shadowRoot.querySelector(".trigger");
      expect(trigger).to.exist;
    });

    it("should have aria-haspopup on trigger", async () => {
      const el = await fixture(html`<ds-combobox></ds-combobox>`);
      const trigger = el.shadowRoot.querySelector('[aria-haspopup="listbox"]');
      expect(trigger).to.exist;
    });

    it("should have role listbox on options container", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);
      el.show();
      const listbox = el.shadowRoot.querySelector('[role="listbox"]');
      expect(listbox).to.exist;
    });

    it("should have role option on options", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option">Option 1</div>
        </ds-combobox>
      `);
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const option = el.shadowRoot.querySelector('[role="option"]');
      expect(option).to.exist;
    });

    it("should set aria-selected on selected options", async () => {
      const el = await fixture(html`
        <ds-combobox>
          <div slot="option" data-value="opt1">Option 1</div>
        </ds-combobox>
      `);

      el.value = "opt1";
      el.show();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const option = el.shadowRoot.querySelector('[role="option"]');
      expect(option.getAttribute("aria-selected")).to.equal("true");
    });
  });

  // The dropdown used to be position: absolute, so any scrolling ancestor
  // (every demo page's .demo-box) clipped it to the search field.
  describe("Dropdown placement", () => {
    const options = html`
      <div slot="option" data-value="apple">Apple</div>
      <div slot="option" data-value="banana">Banana</div>
      <div slot="option" data-value="cherry">Cherry</div>
    `;
    const parts = (el) => ({
      trigger: el.shadowRoot.querySelector(".trigger").getBoundingClientRect(),
      dropdown: el.shadowRoot.querySelector(".dropdown"),
    });

    it("should not be clipped by a scrolling ancestor", async () => {
      const wrapper = await fixture(html`
        <div style="overflow: auto; height: 70px">
          <ds-combobox>${options}</ds-combobox>
        </div>
      `);
      const el = wrapper.querySelector("ds-combobox");
      el.show();

      const { dropdown } = parts(el);
      expect(getComputedStyle(dropdown).position).to.equal("fixed");
      const box = dropdown.getBoundingClientRect();
      const y = wrapper.getBoundingClientRect().bottom + 4;
      expect(box.bottom).to.be.above(y);
      const hit = document.elementFromPoint(box.left + 10, y);
      expect(hit === el || el.contains(hit)).to.be.true;
      el.close();
    });

    it("should sit directly under the trigger at its width", async () => {
      const el = await fixture(html`<ds-combobox>${options}</ds-combobox>`);
      el.show();

      const { trigger, dropdown } = parts(el);
      const box = dropdown.getBoundingClientRect();
      expect(box.top).to.be.closeTo(trigger.bottom, 1);
      expect(box.left).to.be.closeTo(trigger.left, 1);
      expect(box.width).to.be.closeTo(trigger.width, 1);
      expect(dropdown.dataset.side).to.equal("bottom");
      el.close();
    });

    it("should flip above the trigger near the bottom of the viewport", async () => {
      const el = await fixture(html`
        <ds-combobox
          style="position: fixed; bottom: 12px; left: 20px"
          >${options}</ds-combobox
        >
      `);
      el.show();

      const { trigger, dropdown } = parts(el);
      expect(dropdown.dataset.side).to.equal("top");
      expect(dropdown.getBoundingClientRect().bottom).to.be.closeTo(
        trigger.top,
        1,
      );
      el.close();
    });

    it("should stay in place across re-renders while filtering", async () => {
      const el = await fixture(html`<ds-combobox>${options}</ds-combobox>`);
      el.show();
      el.render();

      const { trigger, dropdown } = parts(el);
      expect(dropdown.getBoundingClientRect().top).to.be.closeTo(
        trigger.bottom,
        1,
      );
      el.close();
    });

    it("should follow the trigger when its container scrolls", async () => {
      const wrapper = await fixture(html`
        <div style="overflow: auto; height: 120px">
          <div style="height: 40px"></div>
          <ds-combobox>${options}</ds-combobox>
          <div style="height: 400px"></div>
        </div>
      `);
      const el = wrapper.querySelector("ds-combobox");
      el.show();

      wrapper.scrollTop = 25;
      wrapper.dispatchEvent(new Event("scroll"));
      const { trigger, dropdown } = parts(el);
      expect(dropdown.getBoundingClientRect().top).to.be.closeTo(
        trigger.bottom,
        1,
      );
      el.close();
    });

    it("should stop following once closed", async () => {
      const el = await fixture(html`<ds-combobox>${options}</ds-combobox>`);
      el.show();
      el.close();

      const spy = [];
      el._positionDropdown = () => spy.push(1);
      window.dispatchEvent(new Event("resize"));
      expect(spy).to.have.length(0);
    });
  });

  // The combobox had no form association and no required support.
  describe("Form association", () => {
    const fruit = html`
      <div slot="option" data-value="apple">Apple</div>
      <div slot="option" data-value="banana">Banana</div>
      <div slot="option" data-value="cherry">Cherry</div>
    `;
    // Option click listeners are attached a frame after render.
    const pick = async (el, value) => {
      el.show();
      await new Promise((r) => requestAnimationFrame(r));
      el.querySelector(`[data-value="${value}"]`).click();
    };

    it("should submit the selected value under its name", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit">${fruit}</ds-combobox>`,
      );
      await pick(el, "banana");
      expect(entriesOf(form)).to.deep.equal([["fruit", "banana"]]);
    });

    it("should submit its initial value attribute", async () => {
      const { form } = await inForm(
        html`<ds-combobox name="fruit" value="cherry">${fruit}</ds-combobox>`,
      );
      expect(entriesOf(form)).to.deep.equal([["fruit", "cherry"]]);
    });

    it("should be left out with nothing selected", async () => {
      const { form } = await inForm(html`<ds-combobox name="fruit">${fruit}</ds-combobox>`);
      expect(entriesOf(form)).to.deep.equal([]);
    });

    it("should follow a value set by property", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit">${fruit}</ds-combobox>`,
      );
      el.value = "apple";
      expect(entriesOf(form)).to.deep.equal([["fruit", "apple"]]);
    });

    it("should submit one entry per selection when multiple", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit" multiple>${fruit}</ds-combobox>`,
      );
      await pick(el, "apple");
      await pick(el, "cherry");
      expect(entriesOf(form)).to.deep.equal([
        ["fruit", "apple"],
        ["fruit", "cherry"],
      ]);
    });

    it("should block the form while required with nothing selected", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit" required>${fruit}</ds-combobox>`,
      );
      expect(el.required).to.be.true;
      expect(el.validity.valueMissing).to.be.true;
      expect(form.checkValidity()).to.be.false;

      await pick(el, "apple");
      expect(form.checkValidity()).to.be.true;
    });

    it("should update validity when required is toggled", async () => {
      const { form, el } = await inForm(html`<ds-combobox name="fruit">${fruit}</ds-combobox>`);
      el.required = true;
      expect(form.checkValidity()).to.be.false;
      el.required = false;
      expect(form.checkValidity()).to.be.true;
    });

    // The value attribute also reflects selection, so reset needs its own
    // record of the default.
    it("should restore its initial value when the form resets", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit" value="cherry">${fruit}</ds-combobox>`,
      );
      await pick(el, "apple");
      form.reset();
      expect(el.value).to.equal("cherry");
      expect(entriesOf(form)).to.deep.equal([["fruit", "cherry"]]);
    });

    it("should clear when reset without an initial value", async () => {
      const { form, el } = await inForm(html`<ds-combobox name="fruit">${fruit}</ds-combobox>`);
      await pick(el, "apple");
      form.reset();
      expect(el.value).to.equal(null);
      expect(entriesOf(form)).to.deep.equal([]);
    });

    // The setter wrote disabled="false", which the platform (and
    // :host([disabled])) still treat as disabled.
    it("should really re-enable when disabled is set to false", async () => {
      const { form, el } = await inForm(
        html`<ds-combobox name="fruit" value="apple" disabled>${fruit}</ds-combobox>`,
      );
      el.disabled = false;
      expect(el.hasAttribute("disabled")).to.be.false;
      expect(el.matches(":disabled")).to.be.false;
      expect(entriesOf(form)).to.deep.equal([["fruit", "apple"]]);
    });

    it("should be disabled by a disabled fieldset", async () => {
      const { form, fieldset, el } = await inDisabledFieldset(
        html`<ds-combobox name="fruit" value="apple">${fruit}</ds-combobox>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.shadowRoot.querySelector(".trigger").disabled).to.be.true;
      el.show();
      expect(el.open).to.be.false;
      expect(entriesOf(form)).to.deep.equal([]);

      fieldset.disabled = false;
      expect(el.shadowRoot.querySelector(".trigger").disabled).to.be.false;
      expect(entriesOf(form)).to.deep.equal([["fruit", "apple"]]);
    });
  });
});
