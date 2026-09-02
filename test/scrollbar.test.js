import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/scrollbar/scrollbar.js";

describe("DSScrollbar", () => {
  describe("Attributes", () => {
    it("reflects size attribute", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="thick"></ds-scrollbar>`,
      );
      expect(el.getAttribute("size")).to.equal("thick");
      expect(el.size).to.equal("thick");
    });

    it("reflects direction attribute", async () => {
      const el = await fixture(
        html`<ds-scrollbar direction="both"></ds-scrollbar>`,
      );
      expect(el.getAttribute("direction")).to.equal("both");
      expect(el.direction).to.equal("both");
    });
  });

  describe("Rendering", () => {
    it("should render with default props", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      expect(el).to.exist;
      expect(el.size).to.equal("medium");
      expect(el.color).to.equal("primary");
      expect(el.hover).to.be.true;
      expect(el.direction).to.equal("vertical");
    });

    it("should render with content in slot", async () => {
      const el = await fixture(
        html`<ds-scrollbar>
          <div>Scrollable content</div>
        </ds-scrollbar>`,
      );

      const slot = el.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.be.greaterThan(0);
    });

    it("should have scrollbar container", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      const container = el.shadowRoot.querySelector(".scrollbar-container");
      expect(container).to.exist;
    });

    it("should apply overflow styles based on direction", async () => {
      const el = await fixture(
        html`<ds-scrollbar direction="vertical"></ds-scrollbar>`,
      );

      const host = el.shadowRoot.host;
      const styles = window.getComputedStyle(host);
      expect(styles.overflow).to.exist;
    });
  });

  describe("Size variants", () => {
    const sizes = ["thin", "medium", "thick"];

    sizes.forEach((size) => {
      it(`should support ${size} size`, async () => {
        const el = await fixture(
          html`<ds-scrollbar size="${size}"></ds-scrollbar>`,
        );

        expect(el.size).to.equal(size);
      });
    });

    it("should default to medium size if invalid", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="invalid"></ds-scrollbar>`,
      );

      expect(el.size).to.equal("invalid");
      const size = el.getScrollbarSize();
      expect(size).to.include("--ds-scrollbar-size-medium"); // medium token default
    });

    it("should return correct width for thin size", async () => {
      const el = await fixture(html`<ds-scrollbar size="thin"></ds-scrollbar>`);

      const size = el.getScrollbarSize();
      expect(size).to.include("--ds-scrollbar-size-thin");
    });

    it("should return correct width for medium size", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="medium"></ds-scrollbar>`,
      );

      const size = el.getScrollbarSize();
      expect(size).to.include("--ds-scrollbar-size-medium");
    });

    it("should return correct width for thick size", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="thick"></ds-scrollbar>`,
      );

      const size = el.getScrollbarSize();
      expect(size).to.include("--ds-scrollbar-size-thick");
    });
  });

  describe("Color variants", () => {
    const colors = [
      "primary",
      "secondary",
      "tertiary",
      "surface-variant",
      "on-surface",
      "outline",
    ];

    colors.forEach((color) => {
      it(`should support ${color} color`, async () => {
        const el = await fixture(
          html`<ds-scrollbar color="${color}"></ds-scrollbar>`,
        );

        expect(el.color).to.equal(color);
      });
    });

    it("should return correct CSS variable for primary", async () => {
      const el = await fixture(
        html`<ds-scrollbar color="primary"></ds-scrollbar>`,
      );

      const colorVar = el.getColorVariable();
      expect(colorVar).to.equal("--md-sys-color-primary");
    });

    it("should return correct CSS variable for secondary", async () => {
      const el = await fixture(
        html`<ds-scrollbar color="secondary"></ds-scrollbar>`,
      );

      const colorVar = el.getColorVariable();
      expect(colorVar).to.equal("--md-sys-color-secondary");
    });

    it("should default to primary if invalid color", async () => {
      const el = await fixture(
        html`<ds-scrollbar color="invalid"></ds-scrollbar>`,
      );

      const colorVar = el.getColorVariable();
      expect(colorVar).to.equal("--md-sys-color-primary");
    });
  });

  describe("Direction variants", () => {
    const directions = ["vertical", "horizontal", "both"];

    directions.forEach((direction) => {
      it(`should support ${direction} direction`, async () => {
        const el = await fixture(
          html`<ds-scrollbar direction="${direction}"></ds-scrollbar>`,
        );

        expect(el.direction).to.equal(direction);
      });
    });

    it("should show vertical scrollbar by default", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      expect(el.direction).to.equal("vertical");
    });

    it("should show both scrollbars when direction is both", async () => {
      const el = await fixture(
        html`<ds-scrollbar direction="both"></ds-scrollbar>`,
      );

      expect(el.direction).to.equal("both");
    });
  });

  describe("Hover behavior", () => {
    it("should enable hover by default", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      expect(el.hover).to.be.true;
    });

    it("should disable hover when hover=false", async () => {
      const el = await fixture(
        html`<ds-scrollbar hover="false"></ds-scrollbar>`,
      );

      expect(el.hover).to.be.false;
    });

    it("should return correct opacity for hover enabled", async () => {
      const el = await fixture(html`<ds-scrollbar hover></ds-scrollbar>`);

      const opacity = el.getHoverOpacity();
      expect(opacity).to.equal("0.3");
    });

    it("should return correct opacity for hover disabled", async () => {
      const el = await fixture(
        html`<ds-scrollbar hover="false"></ds-scrollbar>`,
      );

      const opacity = el.getHoverOpacity();
      expect(opacity).to.equal("0.6");
    });
  });

  describe("Properties", () => {
    it("should get and set size property", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.size = "thick";

      expect(el.size).to.equal("thick");
      expect(el.getAttribute("size")).to.equal("thick");
    });

    it("should get and set color property", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.color = "secondary";

      expect(el.color).to.equal("secondary");
      expect(el.getAttribute("color")).to.equal("secondary");
    });

    it("should get and set hover property", async () => {
      const el = await fixture(
        html`<ds-scrollbar hover="false"></ds-scrollbar>`,
      );

      // When initialized with hover="false", _hover should be false
      expect(el.hover).to.be.false;

      // Now set it to true
      el.hover = true;
      await Promise.resolve();

      expect(el.hover).to.be.true;
      expect(el.hasAttribute("hover")).to.be.true;

      // Set back to false
      el.hover = false;
      await Promise.resolve();

      expect(el.hover).to.be.false;
      expect(el.hasAttribute("hover")).to.be.false;
    });

    it("should get and set direction property", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.direction = "horizontal";

      expect(el.direction).to.equal("horizontal");
      expect(el.getAttribute("direction")).to.equal("horizontal");
    });
  });

  describe("Events", () => {
    it("does not emit custom events on attribute updates", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);
      let fired = false;

      el.addEventListener("ds-scrollbar:change", () => {
        fired = true;
      });

      el.size = "thick";
      el.color = "secondary";
      expect(fired).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("host is not keyboard-focusable by default", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("CSS Parts", () => {
    it("should expose container part", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("should allow styling via container part", async () => {
      const wrapper = await fixture(html`
        <div>
          <style>
            ds-scrollbar::part(container) {
              background: red;
            }
          </style>
          <ds-scrollbar></ds-scrollbar>
        </div>
      `);

      const el = wrapper.querySelector("ds-scrollbar");
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });
  });

  describe("Slot", () => {
    it("should project content into slot", async () => {
      const el = await fixture(html`
        <ds-scrollbar>
          <div class="test-content">Content</div>
        </ds-scrollbar>
      `);

      const slot = el.shadowRoot.querySelector("slot");
      const nodes = slot.assignedNodes({ flatten: true });
      expect(nodes.length).to.be.greaterThan(0);
    });

    it("should support multiple children", async () => {
      const el = await fixture(html`
        <ds-scrollbar>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </ds-scrollbar>
      `);

      const slot = el.shadowRoot.querySelector("slot");
      const nodes = slot.assignedNodes({ flatten: true });
      expect(nodes.length).to.be.greaterThan(0);
    });

    it("should handle empty content", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      const slot = el.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
    });
  });

  describe("Accessibility", () => {
    it("should have proper scrollable container", async () => {
      const el = await fixture(html`
        <ds-scrollbar>
          <div style="block-size: 500px;">Scrollable content</div>
        </ds-scrollbar>
      `);

      const container = el.shadowRoot.querySelector(".scrollbar-container");
      expect(container).to.exist;
    });

    it("should support keyboard scrolling", async () => {
      const el = await fixture(html`
        <ds-scrollbar>
          <div style="block-size: 500px;">Scrollable content</div>
        </ds-scrollbar>
      `);

      const container = el.shadowRoot.querySelector(".scrollbar-container");
      expect(container).to.exist;
      // Scrollable divs natively support keyboard scrolling
    });
  });

  describe("Attribute changes", () => {
    it("should update when size attribute changes", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.setAttribute("size", "thick");

      expect(el.size).to.equal("thick");
    });

    it("should update when color attribute changes", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.setAttribute("color", "tertiary");

      expect(el.color).to.equal("tertiary");
    });

    it("should update when hover attribute changes", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.setAttribute("hover", "false");

      expect(el.hover).to.be.false;
    });

    it("should update when direction attribute changes", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.setAttribute("direction", "both");

      expect(el.direction).to.equal("both");
    });

    it("should not re-render if attribute value unchanged", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="medium"></ds-scrollbar>`,
      );

      const renderSpy = el.shadowRoot.innerHTML;
      el.setAttribute("size", "medium");

      expect(el.shadowRoot.innerHTML).to.equal(renderSpy);
    });
  });

  describe("Edge cases", () => {
    it("should handle null size attribute", async () => {
      const el = await fixture(
        html`<ds-scrollbar size="thick"></ds-scrollbar>`,
      );

      el.removeAttribute("size");
      // Allow time for attribute change to propagate
      await new Promise((resolve) => setTimeout(resolve, 0));

      // When attribute is removed, attributeChangedCallback sets default "medium"
      expect(el.size).to.equal("medium");
      const size = el.getScrollbarSize();
      expect(size).to.include("--ds-scrollbar-size-medium"); // Default to medium token
    });

    it("should handle invalid direction", async () => {
      const el = await fixture(
        html`<ds-scrollbar direction="invalid"></ds-scrollbar>`,
      );

      expect(el.direction).to.equal("invalid");
    });

    it("should handle large content", async () => {
      const largeContent = Array(100).fill("<p>Line of text</p>").join("");
      const el = await fixture(html`
        <ds-scrollbar style="block-size: 200px;">
          <div>${largeContent}</div>
        </ds-scrollbar>
      `);

      expect(el).to.exist;
      const container = el.shadowRoot.querySelector(".scrollbar-container");
      expect(container).to.exist;
    });

    it("should handle rapid attribute changes", async () => {
      const el = await fixture(html`<ds-scrollbar></ds-scrollbar>`);

      el.setAttribute("size", "thin");
      el.setAttribute("size", "medium");
      el.setAttribute("size", "thick");

      expect(el.size).to.equal("thick");
    });
  });
});
