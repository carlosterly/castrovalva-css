import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/date-picker/date-picker.js";

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
});
