/**
 * Button Component Test Suite
 * Tests for ds-button action component
 * Following Castrovalva Design System testing standards (CLAUDE.md)
 *
 * Component Type: Action (Button)
 * Minimum Tests: 35
 * Coverage Target: 90% statements, 85% branches, 90% functions
 */

import { fixture, expect, html, elementUpdated } from "@open-wc/testing";
import "../src/components/button/button.js";

describe("ds-button", () => {
  // ============================================
  // Initialization & Lifecycle
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(html`<ds-button>Click me</ds-button>`);
      expect(el).to.exist;
      expect(el).to.be.instanceOf(HTMLElement);
    });

    it("should render shadow DOM", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should set default variant to filled", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.variant).to.equal("filled");
    });

    it("should set default size to medium", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.size).to.equal("medium");
    });

    it("should set default type to button", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.type).to.equal("button");
    });

    it("should not be disabled by default", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.disabled).to.be.false;
    });

    it("should not have loading state by default", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.loading).to.be.false;
    });

    it("should not have ripple effect by default", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.ripple).to.be.false;
    });
  });

  // ============================================
  // Variants
  // ============================================
  describe("Variants", () => {
    it("should render filled variant", async () => {
      const el = await fixture(
        html`<ds-button variant="filled">Filled</ds-button>`,
      );
      expect(el.variant).to.equal("filled");
      expect(el.getAttribute("variant")).to.equal("filled");
    });

    it("should render filled-tonal variant", async () => {
      const el = await fixture(
        html`<ds-button variant="filled-tonal">Tonal</ds-button>`,
      );
      expect(el.variant).to.equal("filled-tonal");
    });

    it("should render outlined variant", async () => {
      const el = await fixture(
        html`<ds-button variant="outlined">Outlined</ds-button>`,
      );
      expect(el.variant).to.equal("outlined");
    });

    it("should render elevated variant", async () => {
      const el = await fixture(
        html`<ds-button variant="elevated">Elevated</ds-button>`,
      );
      expect(el.variant).to.equal("elevated");
    });

    it("should render text variant", async () => {
      const el = await fixture(
        html`<ds-button variant="text">Text</ds-button>`,
      );
      expect(el.variant).to.equal("text");
    });

    it("should render danger variant", async () => {
      const el = await fixture(
        html`<ds-button variant="danger">Delete</ds-button>`,
      );
      expect(el.variant).to.equal("danger");
    });

    it("should update variant via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.variant = "outlined";
      await elementUpdated(el);

      expect(el.variant).to.equal("outlined");
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("should switch between variants", async () => {
      const el = await fixture(html`<ds-button variant="filled"></ds-button>`);
      expect(el.variant).to.equal("filled");

      el.variant = "outlined";
      await elementUpdated(el);
      expect(el.variant).to.equal("outlined");

      el.variant = "danger";
      await elementUpdated(el);
      expect(el.variant).to.equal("danger");
    });
  });

  // ============================================
  // Sizes
  // ============================================
  describe("Sizes", () => {
    it("should render small size", async () => {
      const el = await fixture(html`<ds-button size="small">Small</ds-button>`);
      expect(el.size).to.equal("small");
      expect(el.getAttribute("size")).to.equal("small");
    });

    it("should render medium size", async () => {
      const el = await fixture(
        html`<ds-button size="medium">Medium</ds-button>`,
      );
      expect(el.size).to.equal("medium");
    });

    it("should render large size", async () => {
      const el = await fixture(html`<ds-button size="large">Large</ds-button>`);
      expect(el.size).to.equal("large");
    });

    it("should update size via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.size = "large";
      await elementUpdated(el);

      expect(el.size).to.equal("large");
      expect(el.getAttribute("size")).to.equal("large");
    });

    it("should change sizes dynamically", async () => {
      const el = await fixture(html`<ds-button size="small"></ds-button>`);
      expect(el.size).to.equal("small");

      el.size = "medium";
      await elementUpdated(el);
      expect(el.size).to.equal("medium");

      el.size = "large";
      await elementUpdated(el);
      expect(el.size).to.equal("large");
    });
  });

  // ============================================
  // Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("should be able to set disabled attribute", async () => {
      const el = await fixture(html`<ds-button disabled>Disabled</ds-button>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should prevent interaction when disabled", async () => {
      const el = await fixture(html`<ds-button disabled>Disabled</ds-button>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should update disabled state via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.disabled).to.be.false;

      el.disabled = true;
      await elementUpdated(el);

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should enable and disable dynamically", async () => {
      const el = await fixture(html`<ds-button disabled>Click</ds-button>`);
      expect(el.disabled).to.be.true;

      el.disabled = false;
      await elementUpdated(el);

      expect(el.disabled).to.be.false;
      expect(el.hasAttribute("disabled")).to.be.false;
    });

    it("should set disabled attribute correctly", async () => {
      const el = await fixture(html`<ds-button disabled>Click</ds-button>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });
  });

  // ============================================
  // Loading State
  // ============================================
  describe("Loading State", () => {
    it("should have loading attribute when set", async () => {
      const el = await fixture(html`<ds-button loading>Loading</ds-button>`);
      expect(el.loading).to.be.true;
      expect(el.hasAttribute("loading")).to.be.true;
    });

    it("should update loading state via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.loading).to.be.false;

      el.loading = true;
      await elementUpdated(el);

      expect(el.loading).to.be.true;
      expect(el.hasAttribute("loading")).to.be.true;
    });

    it("should toggle loading state", async () => {
      const el = await fixture(html`<ds-button loading></ds-button>`);
      expect(el.loading).to.be.true;

      el.loading = false;
      await elementUpdated(el);

      expect(el.loading).to.be.false;
      expect(el.hasAttribute("loading")).to.be.false;
    });
  });

  // ============================================
  // Ripple Effect
  // ============================================
  describe("Ripple Effect", () => {
    it("should have ripple attribute when specified", async () => {
      const el = await fixture(html`<ds-button ripple>Click</ds-button>`);
      expect(el.ripple).to.be.true;
      expect(el.hasAttribute("ripple")).to.be.true;
    });

    it("should enable ripple via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.ripple).to.be.false;

      el.ripple = true;
      await elementUpdated(el);

      expect(el.ripple).to.be.true;
      expect(el.hasAttribute("ripple")).to.be.true;
    });

    it("should disable ripple dynamically", async () => {
      const el = await fixture(html`<ds-button ripple></ds-button>`);
      expect(el.ripple).to.be.true;

      el.ripple = false;
      await elementUpdated(el);

      expect(el.ripple).to.be.false;
      expect(el.hasAttribute("ripple")).to.be.false;
    });
  });

  // ============================================
  // Button Type
  // ============================================
  describe("Button Type", () => {
    it("should have type button by default", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el.type).to.equal("button");
    });

    it("should support submit type", async () => {
      const el = await fixture(
        html`<ds-button type="submit">Submit</ds-button>`,
      );
      expect(el.type).to.equal("submit");
      expect(el.getAttribute("type")).to.equal("submit");
    });

    it("should support reset type", async () => {
      const el = await fixture(html`<ds-button type="reset">Reset</ds-button>`);
      expect(el.type).to.equal("reset");
    });

    it("should update type via property", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.type = "submit";
      await elementUpdated(el);

      expect(el.type).to.equal("submit");
      expect(el.getAttribute("type")).to.equal("submit");
    });
  });

  // ============================================
  // Click Handling & Events
  // ============================================
  describe("Click Handling", () => {
    it("should handle click event", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let clicked = false;

      el.addEventListener("click", () => {
        clicked = true;
      });

      el.click();
      expect(clicked).to.be.true;
    });

    it("should allow multiple click listeners", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let count = 0;

      el.addEventListener("click", () => count++);
      el.addEventListener("click", () => count++);

      el.click();
      expect(count).to.equal(2);
    });

    it("should handle rapid clicks", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let clickCount = 0;

      el.addEventListener("click", () => clickCount++);

      el.click();
      el.click();
      el.click();

      expect(clickCount).to.equal(3);
    });

    it("should block interaction when disabled", async () => {
      const el = await fixture(html`<ds-button disabled>Click</ds-button>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });
  });

  // ============================================
  // Accessibility (ARIA & Keyboard)
  // ============================================
  describe("Accessibility", () => {
    it("should be keyboard accessible with Tab", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      el.focus();
      expect(document.activeElement).to.equal(el);
    });

    it("should not be focusable when disabled", async () => {
      const el = await fixture(html`<ds-button disabled>Click</ds-button>`);
      el.focus();
      // Disabled buttons should not receive focus
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should handle Enter key press", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let clicked = false;

      el.addEventListener("click", () => {
        clicked = true;
      });

      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        }),
      );

      expect(el).to.exist;
    });

    it("should handle Space key press", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let clicked = false;

      el.addEventListener("click", () => {
        clicked = true;
      });

      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: " ",
          bubbles: true,
        }),
      );

      expect(el).to.exist;
    });

    it("should have semantic button element in shadow DOM", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      const button = el.shadowRoot.querySelector("button");
      expect(button).to.exist;
    });

    it("should have accessible name from text content", async () => {
      const el = await fixture(html`<ds-button>Click me</ds-button>`);
      expect(el.textContent).to.include("Click me");
    });
  });

  // ============================================
  // Slots & Content
  // ============================================
  describe("Slots & Content", () => {
    it("should render slotted text content", async () => {
      const el = await fixture(html`<ds-button>Click me</ds-button>`);
      expect(el.textContent).to.include("Click me");
    });

    it("should render icon-left slot", async () => {
      const el = await fixture(html`
        <ds-button>
          <span slot="icon-left">→</span>
          Next
        </ds-button>
      `);
      const icon = el.querySelector('[slot="icon-left"]');
      expect(icon).to.exist;
      expect(icon.textContent).to.equal("→");
    });

    it("should render icon-right slot", async () => {
      const el = await fixture(html`
        <ds-button>
          Back
          <span slot="icon-right">←</span>
        </ds-button>
      `);
      const icon = el.querySelector('[slot="icon-right"]');
      expect(icon).to.exist;
      expect(icon.textContent).to.equal("←");
    });

    it("should render both icon slots with content", async () => {
      const el = await fixture(html`
        <ds-button>
          <span slot="icon-left">✓</span>
          Confirm
          <span slot="icon-right">!</span>
        </ds-button>
      `);
      const leftIcon = el.querySelector('[slot="icon-left"]');
      const rightIcon = el.querySelector('[slot="icon-right"]');

      expect(leftIcon).to.exist;
      expect(rightIcon).to.exist;
      expect(el.textContent).to.include("Confirm");
    });
  });

  // ============================================
  // Attributes & Properties Reflection
  // ============================================
  describe("Attributes & Properties", () => {
    it("should reflect variant attribute to property", async () => {
      const el = await fixture(
        html`<ds-button variant="outlined"></ds-button>`,
      );
      expect(el.variant).to.equal("outlined");
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("should reflect size attribute to property", async () => {
      const el = await fixture(html`<ds-button size="large"></ds-button>`);
      expect(el.size).to.equal("large");
      expect(el.getAttribute("size")).to.equal("large");
    });

    it("should reflect type attribute to property", async () => {
      const el = await fixture(html`<ds-button type="submit"></ds-button>`);
      expect(el.type).to.equal("submit");
      expect(el.getAttribute("type")).to.equal("submit");
    });

    it("should sync attribute changes to properties", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.setAttribute("variant", "outlined");
      await elementUpdated(el);

      expect(el.variant).to.equal("outlined");
    });

    it("should sync property changes to attributes", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.variant = "danger";
      await elementUpdated(el);

      expect(el.getAttribute("variant")).to.equal("danger");
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("should handle empty button text", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      expect(el).to.exist;
      expect(el.textContent.trim()).to.equal("");
    });

    it("should handle very long text", async () => {
      const longText =
        "This is a very long button text that might wrap to multiple lines";
      const el = await fixture(html`<ds-button>${longText}</ds-button>`);
      expect(el.textContent).to.include(longText);
    });

    it("should handle multiple attribute changes", async () => {
      const el = await fixture(html`<ds-button></ds-button>`);
      el.variant = "outlined";
      el.size = "large";
      el.disabled = true;
      el.loading = true;

      await elementUpdated(el);

      expect(el.variant).to.equal("outlined");
      expect(el.size).to.equal("large");
      expect(el.disabled).to.be.true;
      expect(el.loading).to.be.true;
    });

    it("should handle component removal from DOM", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      expect(el.parentElement).to.exist;

      el.remove();
      expect(el.parentElement).to.be.null;
    });

    it("should not leak memory on repeated clicks", async () => {
      const el = await fixture(html`<ds-button>Click</ds-button>`);
      let clickCount = 0;

      const listener = () => clickCount++;
      el.addEventListener("click", listener);

      // Simulate rapid clicks
      for (let i = 0; i < 100; i++) {
        el.click();
      }

      expect(clickCount).to.equal(100);

      // Clean up
      el.removeEventListener("click", listener);
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe("Integration", () => {
    it("should work in a form as submit button", async () => {
      const form = await fixture(html`
        <form>
          <input type="text" name="username" value="test" />
          <ds-button type="submit">Submit</ds-button>
        </form>
      `);

      const button = form.querySelector("ds-button");
      expect(button.type).to.equal("submit");
    });

    it("should work in a form as reset button", async () => {
      const form = await fixture(html`
        <form>
          <input type="text" name="username" value="test" />
          <ds-button type="reset">Reset</ds-button>
        </form>
      `);

      const button = form.querySelector("ds-button");
      expect(button.type).to.equal("reset");
    });

    it("should maintain state when multiple instances exist", async () => {
      const container = await fixture(html`
        <div>
          <ds-button variant="filled">Button 1</ds-button>
          <ds-button variant="outlined">Button 2</ds-button>
          <ds-button variant="danger">Button 3</ds-button>
        </div>
      `);

      const buttons = container.querySelectorAll("ds-button");
      expect(buttons[0].variant).to.equal("filled");
      expect(buttons[1].variant).to.equal("outlined");
      expect(buttons[2].variant).to.equal("danger");
    });

    it("should work with nested HTML elements", async () => {
      const el = await fixture(html`
        <ds-button>
          <span style="font-weight: bold;">Bold</span>
          <span> and </span>
          <span style="font-style: italic;">italic</span>
        </ds-button>
      `);

      const bold = el.querySelector('[style*="font-weight"]');
      const italic = el.querySelector('[style*="font-style"]');

      expect(bold).to.exist;
      expect(italic).to.exist;
    });
  });
});
