import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { DSTimePicker } from "../src/components/time-picker/time-picker.js";

describe("DSTimePicker", () => {
  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      expect(el).to.exist;
      expect(el.value).to.equal("");
      expect(el.label).to.equal("Select time");
      expect(el.disabled).to.be.false;
      expect(el.required).to.be.false;
      expect(el.hour12).to.be.true;
    });

    it("should render with custom label", async () => {
      const el = await fixture(
        html`<ds-time-picker label="Appointment Time"></ds-time-picker>`,
      );
      const label = el.shadowRoot.querySelector(".label");
      expect(label.textContent).to.include("Appointment Time");
    });

    it("should render with initial value", async () => {
      const el = await fixture(
        html`<ds-time-picker value="14:30"></ds-time-picker>`,
      );
      expect(el.value).to.equal("14:30");
      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.value).to.include("02:30 PM");
    });

    it("should render in 24-hour format", async () => {
      const el = await fixture(
        html`<ds-time-picker value="14:30" hour12="false"></ds-time-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.value).to.equal("14:30");
    });
  });

  describe("Value Management", () => {
    it("should parse 24-hour value correctly in 12-hour mode", async () => {
      const el = await fixture(
        html`<ds-time-picker value="14:30"></ds-time-picker>`,
      );
      expect(el._selectedHour).to.equal(2);
      expect(el._selectedMinute).to.equal(30);
      expect(el._period).to.equal("PM");
    });

    it("should parse morning time correctly", async () => {
      const el = await fixture(
        html`<ds-time-picker value="09:15"></ds-time-picker>`,
      );
      expect(el._selectedHour).to.equal(9);
      expect(el._selectedMinute).to.equal(15);
      expect(el._period).to.equal("AM");
    });

    it("should parse midnight correctly", async () => {
      const el = await fixture(
        html`<ds-time-picker value="00:00"></ds-time-picker>`,
      );
      expect(el._selectedHour).to.equal(12);
      expect(el._selectedMinute).to.equal(0);
      expect(el._period).to.equal("AM");
    });

    it("should parse noon correctly", async () => {
      const el = await fixture(
        html`<ds-time-picker value="12:00"></ds-time-picker>`,
      );
      expect(el._selectedHour).to.equal(12);
      expect(el._selectedMinute).to.equal(0);
      expect(el._period).to.equal("PM");
    });

    it("should update value when time is selected", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 3;
      el._selectedMinute = 45;
      el._period = "PM";

      const value = el.formatValue();
      expect(value).to.equal("15:45");
    });

    it("should format display value with AM/PM in 12-hour mode", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 2;
      el._selectedMinute = 30;
      el._period = "PM";

      const display = el.formatDisplayValue();
      expect(display).to.equal("02:30 PM");
    });

    it("should format display value without AM/PM in 24-hour mode", async () => {
      const el = await fixture(
        html`<ds-time-picker hour12="false"></ds-time-picker>`,
      );
      el._selectedHour = 14;
      el._selectedMinute = 30;

      const display = el.formatDisplayValue();
      expect(display).to.equal("14:30");
    });
  });

  describe("12/24 Hour Format", () => {
    it("should show period selector in 12-hour mode", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      await el.updateComplete;

      const periodSelector = el.shadowRoot.querySelector(".period-selector");
      expect(periodSelector).to.exist;
    });

    it("should not show period selector in 24-hour mode", async () => {
      const el = await fixture(
        html`<ds-time-picker hour12="false"></ds-time-picker>`,
      );
      el.openClock();
      await el.updateComplete;

      const periodSelector = el.shadowRoot.querySelector(".period-selector");
      expect(periodSelector).to.not.exist;
    });

    it("should display 1-12 hours in 12-hour mode", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "hours";
      el.renderClock();
      await el.updateComplete;

      const numbers = el.shadowRoot.querySelectorAll(".clock-number");
      expect(numbers.length).to.equal(12);
      expect(numbers[0].textContent).to.equal("1");
      expect(numbers[11].textContent).to.equal("12");
    });

    it("should display 0-23 hours in 24-hour mode", async () => {
      const el = await fixture(
        html`<ds-time-picker hour12="false"></ds-time-picker>`,
      );
      el.openClock();
      el._mode = "hours";
      el.renderClock();
      await el.updateComplete;

      const numbers = el.shadowRoot.querySelectorAll(".clock-number");
      expect(numbers.length).to.equal(24);
    });
  });

  describe("Time Selection", () => {
    it("should select hour when clicked", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "hours";
      el.renderClock();

      el.selectHour(3);
      expect(el._selectedHour).to.equal(3);
      expect(el._mode).to.equal("minutes");
    });

    it("should select minute when clicked and close clock", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 3;
      el._period = "PM";
      el.openClock();
      el._mode = "minutes";
      el.renderClock();

      const changePromise = oneEvent(el, "ds-time-picker:change");
      el.selectMinute(30);

      const event = await changePromise;
      expect(event.detail.value).to.equal("15:30");
      expect(event.detail.hour).to.equal(3);
      expect(event.detail.minute).to.equal(30);
      expect(event.detail.period).to.equal("PM");
    });

    it("should switch mode when mode button clicked", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "minutes";
      el.renderClock();

      const hoursBtn = el.shadowRoot.querySelector(".hours-btn");
      hoursBtn.click();

      expect(el._mode).to.equal("hours");
    });

    it("should toggle period when period button clicked", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._period = "AM";
      el.openClock();

      el.togglePeriod();
      expect(el._period).to.equal("PM");

      el.togglePeriod();
      expect(el._period).to.equal("AM");
    });

    it("should display minutes in 5-minute intervals", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "minutes";
      el.renderClock();

      const numbers = el.shadowRoot.querySelectorAll(".clock-number");
      expect(numbers.length).to.equal(12); // 0, 5, 10, ..., 55
      expect(numbers[0].textContent).to.equal("00");
      expect(numbers[1].textContent).to.equal("05");
      expect(numbers[11].textContent).to.equal("55");
    });
  });

  describe("Clock Open/Close", () => {
    it("should open clock when input is clicked", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      const input = el.shadowRoot.querySelector(".input-field");

      const openPromise = oneEvent(el, "ds-time-picker:open");
      input.click();
      await openPromise;

      expect(el._isOpen).to.be.true;
      const clock = el.shadowRoot.querySelector(".clock");
      expect(clock.style.display).to.equal("block");
    });

    it("should close clock when clicked outside", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      expect(el._isOpen).to.be.true;

      await new Promise((resolve) => setTimeout(resolve, 0));

      const closePromise = oneEvent(el, "ds-time-picker:close");
      document.body.click();
      await closePromise;

      expect(el._isOpen).to.be.false;
    });

    it("should close clock when Escape is pressed", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      expect(el._isOpen).to.be.true;

      await new Promise((resolve) => setTimeout(resolve, 0));

      const closePromise = oneEvent(el, "ds-time-picker:close");
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(event);
      await closePromise;

      expect(el._isOpen).to.be.false;
    });

    it("should toggle clock on multiple clicks", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      const input = el.shadowRoot.querySelector(".input-field");

      input.click();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(el._isOpen).to.be.true;

      input.click();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(el._isOpen).to.be.false;
    });

    it("should toggle clock via toggleClock", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);

      el.toggleClock();
      expect(el._isOpen).to.be.true;

      el.toggleClock();
      expect(el._isOpen).to.be.false;
    });

    it("should close via outside click handler", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();

      el.handleOutsideClick({ composedPath: () => [] });
      expect(el._isOpen).to.be.false;
    });

    it("should remain open for inside clicks", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();

      el.handleOutsideClick({ composedPath: () => [el] });
      expect(el._isOpen).to.be.true;
    });

    it("should ignore input clicks when disabled", async () => {
      const el = await fixture(
        html`<ds-time-picker disabled></ds-time-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");

      input.click();
      expect(el._isOpen).to.be.false;
    });
  });

  describe("States", () => {
    it("should render disabled state", async () => {
      const el = await fixture(
        html`<ds-time-picker disabled></ds-time-picker>`,
      );
      expect(el.disabled).to.be.true;

      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.disabled).to.be.true;
    });

    it("should not open clock when disabled", async () => {
      const el = await fixture(
        html`<ds-time-picker disabled></ds-time-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");

      input.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(el._isOpen).to.be.false;
    });

    it("should render required state", async () => {
      const el = await fixture(
        html`<ds-time-picker required></ds-time-picker>`,
      );
      expect(el.required).to.be.true;

      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.required).to.be.true;

      const label = el.shadowRoot.querySelector(".label");
      expect(label.textContent).to.include("*");
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels on input", async () => {
      const el = await fixture(
        html`<ds-time-picker label="Meeting Time"></ds-time-picker>`,
      );
      const input = el.shadowRoot.querySelector(".input-field");
      expect(input.getAttribute("aria-label")).to.equal("Meeting Time");
    });

    it("should have role dialog on clock", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      const clock = el.shadowRoot.querySelector(".clock");
      expect(clock.getAttribute("role")).to.equal("dialog");
    });

    it("should have aria labels on hour buttons", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "hours";
      el.renderClock();

      const numbers = el.shadowRoot.querySelectorAll(".clock-number");
      numbers.forEach((btn) => {
        expect(btn.getAttribute("aria-label")).to.include("hours");
      });
    });

    it("should have aria labels on minute buttons", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();
      el._mode = "minutes";
      el.renderClock();

      const numbers = el.shadowRoot.querySelectorAll(".clock-number");
      numbers.forEach((btn) => {
        expect(btn.getAttribute("aria-label")).to.include("minutes");
      });
    });
  });

  describe("Events", () => {
    it("should fire change event when time is selected", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 3;
      el._period = "PM";

      const changePromise = oneEvent(el, "ds-time-picker:change");
      el.selectMinute(30);

      const event = await changePromise;
      expect(event.type).to.equal("ds-time-picker:change");
      expect(event.detail.value).to.equal("15:30");
      expect(event.detail.hour).to.equal(3);
      expect(event.detail.minute).to.equal(30);
      expect(event.detail.period).to.equal("PM");
    });

    it("should fire open event when clock opens", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);

      const openPromise = oneEvent(el, "ds-time-picker:open");
      el.openClock();

      const event = await openPromise;
      expect(event.type).to.equal("ds-time-picker:open");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should fire close event when clock closes", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el.openClock();

      const closePromise = oneEvent(el, "ds-time-picker:close");
      el.closeClock();

      const event = await closePromise;
      expect(event.type).to.equal("ds-time-picker:close");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe("CSS Parts", () => {
    it("should expose input part", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      const input = el.shadowRoot.querySelector('[part="input"]');
      expect(input).to.exist;
    });

    it("should expose clock part", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      const clock = el.shadowRoot.querySelector('[part="clock"]');
      expect(clock).to.exist;
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty value", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      expect(el.formatDisplayValue()).to.equal("");
    });

    it("should handle invalid value format", async () => {
      const el = await fixture(
        html`<ds-time-picker value="invalid"></ds-time-picker>`,
      );
      expect(el._selectedHour).to.be.null;
      expect(el._selectedMinute).to.be.null;
    });

    it("should handle partial time selection (hour only)", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 3;
      expect(el.formatValue()).to.equal("");
    });

    it("should convert 12 AM to 00:00", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 12;
      el._selectedMinute = 0;
      el._period = "AM";

      expect(el.formatValue()).to.equal("00:00");
    });

    it("should convert 12 PM to 12:00", async () => {
      const el = await fixture(html`<ds-time-picker></ds-time-picker>`);
      el._selectedHour = 12;
      el._selectedMinute = 0;
      el._period = "PM";

      expect(el.formatValue()).to.equal("12:00");
    });

    it("should handle 24-hour format with no period", async () => {
      const el = await fixture(
        html`<ds-time-picker hour12="false" value="23:59"></ds-time-picker>`,
      );
      const changePromise = oneEvent(el, "ds-time-picker:change");
      el.selectMinute(59);

      const event = await changePromise;
      expect(event.detail.period).to.be.null;
    });
  });
});
