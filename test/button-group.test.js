import {
  fixture,
  html,
  expect,
  elementUpdated,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/button-group/button-group.js";

/**
 * Button Group Component Test Suite
 *
 * Focus: behavioral tests per TEST_PLAN.md
 */

describe("ds-button-group", () => {
  let originalResizeObserver;

  const dispatchGroupClick = (button) => {
    button.dispatchEvent(
      new CustomEvent("ds-click", {
        bubbles: true,
        composed: true,
        detail: { originalEvent: new Event("click") },
      }),
    );
  };

  before(() => {
    if (!customElements.get("ds-button")) {
      customElements.define("ds-button", class extends HTMLElement {});
    }

    originalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  after(() => {
    window.ResizeObserver = originalResizeObserver;
  });
  // ============================================
  // Fixtures
  // ============================================
  const horizontalButtonGroupFixture = html`
    <ds-button-group>
      <ds-button>Button 1</ds-button>
      <ds-button>Button 2</ds-button>
      <ds-button>Button 3</ds-button>
    </ds-button-group>
  `;

  const verticalButtonGroupFixture = html`
    <ds-button-group orientation="vertical">
      <ds-button>Button 1</ds-button>
      <ds-button>Button 2</ds-button>
      <ds-button>Button 3</ds-button>
    </ds-button-group>
  `;

  const standardVariantFixture = html`
    <ds-button-group variant="standard">
      <ds-button>Button 1</ds-button>
      <ds-button>Button 2</ds-button>
    </ds-button-group>
  `;

  const disabledButtonGroupFixture = html`
    <ds-button-group disabled>
      <ds-button>Button 1</ds-button>
      <ds-button>Button 2</ds-button>
    </ds-button-group>
  `;

  const singleSelectFixture = html`
    <ds-button-group selection="single">
      <ds-button value="one">One</ds-button>
      <ds-button value="two">Two</ds-button>
      <ds-button value="three">Three</ds-button>
    </ds-button-group>
  `;

  const multiSelectFixture = html`
    <ds-button-group selection="multi">
      <ds-button value="one">One</ds-button>
      <ds-button value="two">Two</ds-button>
      <ds-button value="three">Three</ds-button>
    </ds-button-group>
  `;

  // ============================================
  // Initialization
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(html`<ds-button-group></ds-button-group>`);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal("ds-button-group");
    });

    it("should render a shadow root", async () => {
      const el = await fixture(html`<ds-button-group></ds-button-group>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should set default attributes", async () => {
      const el = await fixture(html`<ds-button-group></ds-button-group>`);
      expect(el.variant).to.equal("connected");
      expect(el.orientation).to.equal("horizontal");
      expect(el.selection).to.equal("none");
      expect(el.value).to.equal(null);
    });

    it("should render a slot in the shadow DOM", async () => {
      const el = await fixture(horizontalButtonGroupFixture);
      const slot = el.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
    });
  });

  // ============================================
  // Attributes & Properties
  // ============================================
  describe("Attributes & Properties", () => {
    it("should reflect variant attribute", async () => {
      const el = await fixture(standardVariantFixture);
      expect(el.variant).to.equal("standard");
      expect(el.getAttribute("variant")).to.equal("standard");
    });

    it("should reflect orientation attribute", async () => {
      const el = await fixture(verticalButtonGroupFixture);
      expect(el.orientation).to.equal("vertical");
      expect(el.getAttribute("orientation")).to.equal("vertical");
    });

    it("should reflect selection attribute", async () => {
      const el = await fixture(singleSelectFixture);
      expect(el.selection).to.equal("single");
      expect(el.getAttribute("selection")).to.equal("single");
    });

    it("should return null value when selection is none", async () => {
      const el = await fixture(horizontalButtonGroupFixture);
      expect(el.value).to.equal(null);
    });

    it("should set value for single selection", async () => {
      const el = await fixture(singleSelectFixture);
      el.value = "two";
      await elementUpdated(el);

      const buttons = el.querySelectorAll("ds-button");
      expect(el.value).to.equal("two");
      expect(buttons[1].hasAttribute("selected")).to.be.true;
      expect(buttons[1].getAttribute("aria-pressed")).to.equal("true");
    });

    it("should set values for multi selection", async () => {
      const el = await fixture(multiSelectFixture);
      el.value = ["one", "three"];
      await elementUpdated(el);

      const buttons = el.querySelectorAll("ds-button");
      expect(el.value).to.include("one");
      expect(el.value).to.include("three");
      expect(buttons[0].hasAttribute("selected")).to.be.true;
      expect(buttons[2].hasAttribute("selected")).to.be.true;
    });

    it("should accept a single value for multi selection", async () => {
      const el = await fixture(multiSelectFixture);
      el.value = "two";
      await elementUpdated(el);

      expect(el.value).to.deep.equal(["two"]);
    });

    it("should clear selection when value is set to null", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      el.value = null;
      await elementUpdated(el);

      expect(el.value).to.equal(null);
      buttons.forEach((button) => {
        expect(button.hasAttribute("selected")).to.be.false;
      });
    });

    it("should clear selection when selection attribute is removed", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      el.removeAttribute("selection");
      await elementUpdated(el);

      expect(el.selection).to.equal("none");
      buttons.forEach((button) => {
        expect(button.hasAttribute("selected")).to.be.false;
        expect(button.hasAttribute("aria-pressed")).to.be.false;
      });
    });
  });

  // ============================================
  // Slots
  // ============================================
  describe("Slots", () => {
    it("should render slotted buttons", async () => {
      const el = await fixture(horizontalButtonGroupFixture);
      const buttons = el.querySelectorAll("ds-button");
      expect(buttons).to.have.lengthOf(3);
    });

    it("should ignore non-button slotted elements", async () => {
      const el = await fixture(html`
        <ds-button-group selection="single">
          <ds-button>Button 1</ds-button>
          <div>Not a button</div>
          <ds-button>Button 2</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      const nonButton = el.querySelector("div");
      expect(nonButton.hasAttribute("selected")).to.be.false;
    });

    it("should derive value from text when no value attribute is set", async () => {
      const el = await fixture(html`
        <ds-button-group selection="single">
          <ds-button>Alpha</ds-button>
          <ds-button>Beta</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(el.value).to.equal("Beta");
    });

    it("should derive value from data-value when provided", async () => {
      const el = await fixture(html`
        <ds-button-group selection="single">
          <ds-button data-value="alpha">Alpha</ds-button>
          <ds-button data-value="beta">Beta</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      expect(el.value).to.equal("alpha");
    });

    it("should fall back to index when no value or text is provided", async () => {
      const el = await fixture(html`
        <ds-button-group selection="single">
          <ds-button></ds-button>
          <ds-button></ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(el.value).to.equal("1");
    });
  });

  // ============================================
  // Selection Behavior
  // ============================================
  describe("Selection Behavior", () => {
    it("should select a single button on click", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(buttons[1].hasAttribute("selected")).to.be.true;
      expect(buttons[0].hasAttribute("selected")).to.be.false;
      expect(el.value).to.equal("two");
    });

    it("should toggle selection in multi-select", async () => {
      const el = await fixture(multiSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[0]);
      dispatchGroupClick(buttons[2]);
      await elementUpdated(el);

      expect(el.value).to.include("one");
      expect(el.value).to.include("three");

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      expect(el.value).to.not.include("one");
      expect(el.value).to.include("three");
    });

    it("should keep a selection when required is set", async () => {
      const el = await fixture(html`
        <ds-button-group selection="required">
          <ds-button value="one">One</ds-button>
          <ds-button value="two">Two</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      expect(el.value).to.equal("one");
      expect(buttons[0].hasAttribute("selected")).to.be.true;
    });

    it("should not select when selection is none", async () => {
      const el = await fixture(horizontalButtonGroupFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      buttons.forEach((button) => {
        expect(button.hasAttribute("selected")).to.be.false;
        expect(button.hasAttribute("aria-pressed")).to.be.false;
      });
    });

    it("should ignore ds-click events that are not from a button", async () => {
      const el = await fixture(singleSelectFixture);

      el.dispatchEvent(
        new CustomEvent("ds-click", {
          bubbles: true,
          composed: true,
          detail: { originalEvent: new Event("click") },
        }),
      );
      await elementUpdated(el);

      expect(el.value).to.equal(null);
    });

    it("should update selection in standard variant", async () => {
      const el = await fixture(html`
        <ds-button-group variant="standard" selection="single">
          <ds-button value="one">One</ds-button>
          <ds-button value="two">Two</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(el.value).to.equal("two");
      expect(buttons[1].hasAttribute("selected")).to.be.true;
    });

    it("should apply segmented marker when segmented", async () => {
      const el = await fixture(html`
        <ds-button-group variant="segmented">
          <ds-button>One</ds-button>
          <ds-button>Two</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      buttons.forEach((button) => {
        expect(button.getAttribute("data-group-variant")).to.equal("segmented");
      });
    });

    it("should remove segmented marker when variant changes", async () => {
      const el = await fixture(html`
        <ds-button-group variant="segmented">
          <ds-button>One</ds-button>
          <ds-button>Two</ds-button>
        </ds-button-group>
      `);

      el.setAttribute("variant", "standard");
      await elementUpdated(el);

      const buttons = el.querySelectorAll("ds-button");
      buttons.forEach((button) => {
        expect(button.hasAttribute("data-group-variant")).to.be.false;
      });
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit change event with detail on selection", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      const changeEvent = oneEvent(el, "change");
      dispatchGroupClick(buttons[2]);
      const event = await changeEvent;

      expect(event.detail.value).to.equal("three");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("should not emit change when selection is none", async () => {
      const el = await fixture(horizontalButtonGroupFixture);
      const buttons = el.querySelectorAll("ds-button");
      let fired = false;

      el.addEventListener("change", () => {
        fired = true;
      });

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      expect(fired).to.be.false;
    });

    it("should emit change event with array detail for multi-select", async () => {
      const el = await fixture(multiSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      const changeEvent = oneEvent(el, "change");
      dispatchGroupClick(buttons[0]);
      const event = await changeEvent;

      expect(event.detail.value).to.deep.equal(["one"]);
    });
  });

  // ============================================
  // Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("should disable all buttons when group is disabled", async () => {
      const el = await fixture(disabledButtonGroupFixture);
      await elementUpdated(el);

      const buttons = el.querySelectorAll("ds-button");
      buttons.forEach((button) => {
        expect(button.hasAttribute("disabled")).to.be.true;
      });
    });

    it("should not change selection when disabled", async () => {
      const el = await fixture(html`
        <ds-button-group selection="single" disabled>
          <ds-button value="one">One</ds-button>
          <ds-button value="two">Two</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(el.value).to.equal(null);
      buttons.forEach((button) => {
        expect(button.hasAttribute("selected")).to.be.false;
      });
    });
  });

  // ============================================
  // Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("should set aria-pressed on selected buttons", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[1]);
      await elementUpdated(el);

      expect(buttons[1].getAttribute("aria-pressed")).to.equal("true");
      expect(buttons[0].getAttribute("aria-pressed")).to.equal("false");
    });

    it("should remove aria-pressed when selection is none", async () => {
      const el = await fixture(singleSelectFixture);
      const buttons = el.querySelectorAll("ds-button");

      dispatchGroupClick(buttons[0]);
      await elementUpdated(el);

      el.removeAttribute("selection");
      await elementUpdated(el);

      buttons.forEach((button) => {
        expect(button.hasAttribute("aria-pressed")).to.be.false;
      });
    });
  });

  // ============================================
  // Integration
  // ============================================
  describe("Integration", () => {
    it("should work with buttons of different variants", async () => {
      const el = await fixture(html`
        <ds-button-group>
          <ds-button variant="filled">Filled</ds-button>
          <ds-button variant="outlined">Outlined</ds-button>
          <ds-button variant="text">Text</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      expect(buttons).to.have.lengthOf(3);
    });

    it("should clear individual disabled state when group is enabled", async () => {
      const el = await fixture(html`
        <ds-button-group>
          <ds-button>Active</ds-button>
          <ds-button disabled>Disabled</ds-button>
          <ds-button>Active</ds-button>
        </ds-button-group>
      `);

      const buttons = el.querySelectorAll("ds-button");
      expect(buttons[1].hasAttribute("disabled")).to.be.false;
    });
  });
});
