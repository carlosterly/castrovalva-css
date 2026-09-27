import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/date-picker/date-picker.js";
import { inForm, inDisabledFieldset, entriesOf } from "./helpers/forms.js";

describe("DSDatePicker", () => {
  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("should have default label", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      expect(el.label).to.equal("Select date");
    });

    it("should have default locale", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      expect(el.locale).to.equal("en-US");
    });

    it("should set custom label", async () => {
      const el = await fixture(
        html`<ds-date-picker label="Choose a date"></ds-date-picker>`,
      );
      expect(el.label).to.equal("Choose a date");
    });
  });

  describe("Value Management", () => {
    it("should set and get value", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.value = "2024-12-25";
      expect(el.value).to.equal("2024-12-25");
    });

    it("should render with initial value", async () => {
      const el = await fixture(
        html`<ds-date-picker value="2024-12-25"></ds-date-picker>`,
      );
      expect(el.value).to.equal("2024-12-25");
      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.value).to.not.be.empty;
    });

    it("should clear value when set to empty", async () => {
      const el = await fixture(
        html`<ds-date-picker value="2024-12-25"></ds-date-picker>`,
      );
      el.value = "";
      expect(el.value).to.equal("");
    });

    it("should format date for display", async () => {
      const el = await fixture(
        html`<ds-date-picker value="2024-12-25"></ds-date-picker>`,
      );
      const date = new Date("2024-12-25");
      const formatted = el.formatDateDisplay(date);
      expect(formatted).to.include("Dec");
      expect(formatted).to.include("25");
      expect(formatted).to.include("2024");
    });
  });

  describe("Min/Max Constraints", () => {
    it("should set min date", async () => {
      const el = await fixture(
        html`<ds-date-picker min="2024-01-01"></ds-date-picker>`,
      );
      expect(el.min).to.equal("2024-01-01");
    });

    it("should set max date", async () => {
      const el = await fixture(
        html`<ds-date-picker max="2024-12-31"></ds-date-picker>`,
      );
      expect(el.max).to.equal("2024-12-31");
    });

    it("should disable dates before min", async () => {
      const el = await fixture(
        html`<ds-date-picker min="2024-06-15"></ds-date-picker>`,
      );
      const dateBeforeMin = new Date("2024-06-10");
      expect(el.isDateDisabled(dateBeforeMin)).to.be.true;
    });

    it("should disable dates after max", async () => {
      const el = await fixture(
        html`<ds-date-picker max="2024-06-15"></ds-date-picker>`,
      );
      const dateAfterMax = new Date("2024-06-20");
      expect(el.isDateDisabled(dateAfterMax)).to.be.true;
    });

    it("should not disable dates within range", async () => {
      const el = await fixture(
        html`<ds-date-picker
          min="2024-06-01"
          max="2024-06-30"></ds-date-picker>`,
      );
      const dateInRange = new Date("2024-06-15");
      expect(el.isDateDisabled(dateInRange)).to.be.false;
    });
  });

  describe("Calendar Operations", () => {
    it("should open calendar on input click", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const input = el.shadowRoot.querySelector(".input-field");

      setTimeout(() => input.click());
      const { detail } = await oneEvent(el, "ds-date-picker:open");

      expect(el._isOpen).to.be.true;
    });

    it("should close calendar on outside click", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();
      expect(el._isOpen).to.be.true;

      el.closeCalendar();
      expect(el._isOpen).to.be.false;
    });

    it("should navigate to previous month", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const currentMonth = el._currentMonth.getMonth();
      el.previousMonth();
      const newMonth = el._currentMonth.getMonth();

      expect(newMonth).to.equal(currentMonth === 0 ? 11 : currentMonth - 1);
    });

    it("should navigate to next month", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const currentMonth = el._currentMonth.getMonth();
      el.nextMonth();
      const newMonth = el._currentMonth.getMonth();

      expect(newMonth).to.equal(currentMonth === 11 ? 0 : currentMonth + 1);
    });

    it("should render calendar grid", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      const grid = el.shadowRoot.querySelector(".calendar-grid");
      expect(grid).to.exist;
      expect(grid.innerHTML).to.not.be.empty;
    });

    it("should toggle calendar open and closed", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);

      el.toggleCalendar();
      expect(el._isOpen).to.be.true;

      el.toggleCalendar();
      expect(el._isOpen).to.be.false;
    });

    it("should close via outside click handler", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      el.handleOutsideClick({ composedPath: () => [] });
      expect(el._isOpen).to.be.false;
    });

    it("should remain open for inside clicks", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      el.handleOutsideClick({ composedPath: () => [el] });
      expect(el._isOpen).to.be.true;
    });

    it("should open calendar on input handler", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);

      el.handleInputClick({ stopPropagation: () => {} });
      expect(el._isOpen).to.be.true;
    });
  });

  describe("Date Selection", () => {
    it("should select a date", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const testDate = new Date("2024-12-25");

      el.selectDate(testDate);

      expect(el.value).to.equal("2024-12-25");
      expect(el._selectedDate.toDateString()).to.equal(testDate.toDateString());
    });

    it("should fire change event on date selection", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const testDate = new Date("2024-12-25");

      setTimeout(() => el.selectDate(testDate));
      const { detail } = await oneEvent(el, "ds-date-picker:change");

      expect(detail.value).to.equal("2024-12-25");
      expect(detail.date.toDateString()).to.equal(testDate.toDateString());
    });

    it("should not select disabled date", async () => {
      const el = await fixture(
        html`<ds-date-picker min="2024-12-20"></ds-date-picker>`,
      );
      const disabledDate = new Date("2024-12-15");

      el.selectDate(disabledDate);

      expect(el.value).to.equal("");
    });

    it("should close calendar after selection", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();
      const testDate = new Date("2024-12-25");

      el.selectDate(testDate);

      expect(el._isOpen).to.be.false;
    });
  });

  describe("States", () => {
    it("should be disabled when disabled attribute is set", async () => {
      const el = await fixture(
        html`<ds-date-picker disabled></ds-date-picker>`,
      );
      expect(el.disabled).to.be.true;

      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.disabled).to.be.true;
    });

    it("should not open calendar when disabled", async () => {
      const el = await fixture(
        html`<ds-date-picker disabled></ds-date-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");

      input.click();

      expect(el._isOpen).to.be.false;
    });

    it("should be required when required attribute is set", async () => {
      const el = await fixture(
        html`<ds-date-picker required></ds-date-picker>`,
      );
      expect(el.required).to.be.true;

      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.required).to.be.true;
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", async () => {
      const el = await fixture(
        html`<ds-date-picker label="Birth date"></ds-date-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.getAttribute("aria-label")).to.equal("Birth date");
    });

    it("should have calendar role", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const calendar = el.shadowRoot.querySelector(".calendar");
      expect(calendar.getAttribute("role")).to.equal("dialog");
    });

    it("should have navigation button labels", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const prevBtn = el.shadowRoot.querySelector(".prev-month");
      const nextBtn = el.shadowRoot.querySelector(".next-month");

      expect(prevBtn.getAttribute("aria-label")).to.equal("Previous month");
      expect(nextBtn.getAttribute("aria-label")).to.equal("Next month");
    });

    it("should close calendar on Escape key", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      await new Promise((resolve) => setTimeout(resolve, 0));

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(event);

      // Give it a tick to process
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(el._isOpen).to.be.false;
    });
  });

  describe("Date Formatting", () => {
    it("should format date as ISO string", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const date = new Date("2024-12-25");
      const formatted = el.formatDateISO(date);
      expect(formatted).to.equal("2024-12-25");
    });

    it("should format single digit months and days with leading zeros", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const date = new Date("2024-01-05");
      const formatted = el.formatDateISO(date);
      expect(formatted).to.equal("2024-01-05");
    });

    it("should use custom locale", async () => {
      const el = await fixture(
        html`<ds-date-picker locale="en-GB"></ds-date-picker>`,
      );
      expect(el.locale).to.equal("en-GB");
    });
  });

  describe("Events", () => {
    it("should fire open event", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);

      setTimeout(() => el.openCalendar());
      const event = await oneEvent(el, "ds-date-picker:open");

      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should fire close event", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      setTimeout(() => el.closeCalendar());
      const event = await oneEvent(el, "ds-date-picker:close");

      expect(event).to.exist;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should fire change event with correct detail", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const testDate = new Date("2024-12-25");

      setTimeout(() => el.selectDate(testDate));
      const { detail } = await oneEvent(el, "ds-date-picker:change");

      expect(detail).to.have.property("value");
      expect(detail).to.have.property("date");
      expect(detail.value).to.equal("2024-12-25");
    });
  });

  describe("CSS Parts", () => {
    it("should expose input part", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const input = el.shadowRoot.querySelector('[part="input"]');
      expect(input).to.exist;
    });

    it("should expose calendar part", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      const calendar = el.shadowRoot.querySelector('[part="calendar"]');
      expect(calendar).to.exist;
    });

    it("should expose day parts", async () => {
      const el = await fixture(html`<ds-date-picker></ds-date-picker>`);
      el.openCalendar();

      const day = el.shadowRoot.querySelector('[part="day"]');
      expect(day).to.exist;
    });
  });

  // The calendar used to be position: absolute, so any scrolling ancestor
  // (every demo page's .demo-box) clipped it to a sliver.
  describe("Calendar placement", () => {
    const popupOf = (el) => el.shadowRoot.querySelector(".calendar");
    const inputOf = (el) =>
      el.shadowRoot.querySelector(".input-container").getBoundingClientRect();

    it("should not be clipped by a scrolling ancestor", async () => {
      const wrapper = await fixture(html`
        <div style="overflow: auto; height: 70px">
          <ds-date-picker label="When"></ds-date-picker>
        </div>
      `);
      const el = wrapper.querySelector("ds-date-picker");
      el.openCalendar();

      const popup = popupOf(el);
      expect(getComputedStyle(popup).position).to.equal("fixed");
      const box = popup.getBoundingClientRect();
      const y = wrapper.getBoundingClientRect().bottom + 4;
      expect(box.bottom).to.be.above(y);
      const hit = document.elementFromPoint(box.left + 10, y);
      expect(hit === el || el.contains(hit)).to.be.true;
      el.closeCalendar();
    });

    it("should open 4px below the input, left-aligned", async () => {
      const el = await fixture(html`<ds-date-picker label="When"></ds-date-picker>`);
      el.openCalendar();

      const box = popupOf(el).getBoundingClientRect();
      expect(box.top).to.be.closeTo(inputOf(el).bottom + 4, 1);
      expect(box.left).to.be.closeTo(inputOf(el).left, 1);
      el.closeCalendar();
    });

    it("should flip above the input near the bottom of the viewport", async () => {
      const el = await fixture(html`
        <ds-date-picker
          label="When"
          style="position: fixed; bottom: 12px; left: 20px"
        ></ds-date-picker>
      `);
      el.openCalendar();

      const box = popupOf(el).getBoundingClientRect();
      expect(box.bottom).to.be.closeTo(inputOf(el).top - 4, 1);
      el.closeCalendar();
    });

    // render() rebuilt the calendar hidden while _isOpen stayed true.
    it("should stay open and placed across a re-render", async () => {
      const el = await fixture(html`<ds-date-picker label="When"></ds-date-picker>`);
      el.openCalendar();
      el.render();

      const popup = popupOf(el);
      expect(popup.style.display).to.equal("block");
      expect(popup.getBoundingClientRect().top).to.be.closeTo(
        inputOf(el).bottom + 4,
        1,
      );
      el.closeCalendar();
    });

    it("should follow the input when its container scrolls", async () => {
      const wrapper = await fixture(html`
        <div style="overflow: auto; height: 120px">
          <div style="height: 40px"></div>
          <ds-date-picker label="When"></ds-date-picker>
          <div style="height: 600px"></div>
        </div>
      `);
      const el = wrapper.querySelector("ds-date-picker");
      el.openCalendar();

      wrapper.scrollTop = 25;
      wrapper.dispatchEvent(new Event("scroll"));
      expect(popupOf(el).getBoundingClientRect().top).to.be.closeTo(
        inputOf(el).bottom + 4,
        1,
      );
      el.closeCalendar();
    });
  });

  // The date picker had no form association.
  describe("Form association", () => {
    const clickDay = (el, iso) => {
      el.openCalendar();
      el.shadowRoot.querySelector(`.calendar-day[data-date="${iso}"]`).click();
    };

    it("should submit its ISO value under its name", async () => {
      const { form } = await inForm(
        html`<ds-date-picker name="start" value="2026-06-15"></ds-date-picker>`,
      );
      expect(entriesOf(form)).to.deep.equal([["start", "2026-06-15"]]);
    });

    it("should submit an empty string when empty, like a native date input", async () => {
      const { form } = await inForm(html`<ds-date-picker name="start"></ds-date-picker>`);
      expect(entriesOf(form)).to.deep.equal([["start", ""]]);
    });

    // Clicking a day parsed its ISO date as UTC midnight, so anywhere west of
    // UTC the stored value was the day before. Only fails on the old code in
    // such a timezone; verified separately under America/New_York.
    it("should submit exactly the day that was clicked", async () => {
      const { form, el } = await inForm(
        html`<ds-date-picker name="start" value="2026-06-01"></ds-date-picker>`,
      );
      clickDay(el, "2026-06-15");
      expect(el.value).to.equal("2026-06-15");
      expect(entriesOf(form)).to.deep.equal([["start", "2026-06-15"]]);
    });

    it("should read its value as a local date", async () => {
      const el = await fixture(html`<ds-date-picker value="2024-12-25"></ds-date-picker>`);
      expect(el._selectedDate.getDate()).to.equal(25);
      expect(el.parseDateISO("2024-12-25").getMonth()).to.equal(11);
    });

    it("should block the form while required and empty", async () => {
      const { form, el } = await inForm(
        html`<ds-date-picker name="start" value="2026-06-01" required></ds-date-picker>`,
      );
      expect(form.checkValidity()).to.be.true;
      el.value = "";
      expect(el.validity.valueMissing).to.be.true;
      expect(form.checkValidity()).to.be.false;
    });

    it("should clear its selection when the value is removed", async () => {
      const el = await fixture(html`<ds-date-picker value="2026-06-15"></ds-date-picker>`);
      el.removeAttribute("value");
      expect(el._selectedDate).to.equal(null);
      expect(el.shadowRoot.querySelector(".input-field").value).to.equal("");
    });

    it("should restore its initial value when the form resets", async () => {
      const { form, el } = await inForm(
        html`<ds-date-picker name="start" value="2026-06-01"></ds-date-picker>`,
      );
      clickDay(el, "2026-06-20");
      form.reset();
      expect(el.value).to.equal("2026-06-01");
      expect(entriesOf(form)).to.deep.equal([["start", "2026-06-01"]]);
    });

    it("should be disabled by a disabled fieldset", async () => {
      const { form, fieldset, el } = await inDisabledFieldset(
        html`<ds-date-picker name="start" value="2026-06-01"></ds-date-picker>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.shadowRoot.querySelector(".input-field").disabled).to.be.true;
      expect(entriesOf(form)).to.deep.equal([]);

      fieldset.disabled = false;
      expect(el.shadowRoot.querySelector(".input-field").disabled).to.be.false;
      expect(entriesOf(form)).to.deep.equal([["start", "2026-06-01"]]);
    });
  });
});
