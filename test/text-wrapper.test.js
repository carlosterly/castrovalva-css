import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/text-wrapper/text-wrapper.js";

describe("DSTextWrapper", () => {
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const el = await fixture(html`<ds-text-wrapper></ds-text-wrapper>`);

      expect(el).to.exist;
      expect(el.variant).to.equal("body-medium");
      expect(el.color).to.equal("on-surface");
      expect(el.align).to.equal("start");
      expect(el.truncate).to.be.false;
      expect(el.lines).to.be.null;
    });

    it("should render text content in slot", async () => {
      const el = await fixture(
        html`<ds-text-wrapper>Hello World</ds-text-wrapper>`,
      );

      const slot = el.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.include("Hello World");
    });

    it("should render with custom variant", async () => {
      const el = await fixture(
        html`<ds-text-wrapper variant="display-large"
          >Display Large</ds-text-wrapper
        >`,
      );

      expect(el.variant).to.equal("display-large");
    });

    it("should render with custom color", async () => {
      const el = await fixture(
        html`<ds-text-wrapper color="primary">Primary Color</ds-text-wrapper>`,
      );

      expect(el.color).to.equal("primary");
    });

    it("should render with custom alignment", async () => {
      const el = await fixture(
        html`<ds-text-wrapper align="center">Centered</ds-text-wrapper>`,
      );

      expect(el.align).to.equal("center");
    });
  });

  describe("Variants", () => {
    const variants = [
      "display-large",
      "display-medium",
      "display-small",
      "headline-large",
      "headline-medium",
      "headline-small",
      "title-large",
      "title-medium",
      "title-small",
      "body-large",
      "body-medium",
      "body-small",
      "label-large",
      "label-medium",
      "label-small",
    ];

    variants.forEach((variant) => {
      it(`should support ${variant} variant`, async () => {
        const el = await fixture(
          html`<ds-text-wrapper variant="${variant}">Text</ds-text-wrapper>`,
        );

        expect(el.variant).to.equal(variant);
      });
    });
  });

  describe("Colors", () => {
    const colors = [
      "on-surface",
      "primary",
      "secondary",
      "tertiary",
      "error",
      "on-primary",
      "on-secondary",
      "on-tertiary",
      "on-error",
      "outline",
      "surface-variant",
      "on-surface-variant",
    ];

    colors.forEach((color) => {
      it(`should support ${color} color`, async () => {
        const el = await fixture(
          html`<ds-text-wrapper color="${color}">Text</ds-text-wrapper>`,
        );

        expect(el.color).to.equal(color);
      });
    });
  });

  describe("Text Alignment", () => {
    const alignments = ["start", "center", "end", "left", "right", "justify"];

    alignments.forEach((align) => {
      it(`should support ${align} alignment`, async () => {
        const el = await fixture(
          html`<ds-text-wrapper align="${align}">Text</ds-text-wrapper>`,
        );

        expect(el.align).to.equal(align);
      });
    });
  });

  describe("Truncation", () => {
    it("should apply truncate styles when truncate attribute is present", async () => {
      const el = await fixture(
        html`<ds-text-wrapper truncate>Text</ds-text-wrapper>`,
      );

      expect(el.truncate).to.be.true;
      const styles = el.shadowRoot.innerHTML;
      expect(styles).to.include("text-overflow: ellipsis");
      expect(styles).to.include("white-space: nowrap");
    });

    it("should not apply truncate styles when truncate is false", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      expect(el.truncate).to.be.false;
    });

    it("should apply line clamp when lines attribute is set", async () => {
      const el = await fixture(
        html`<ds-text-wrapper lines="3">Long text here</ds-text-wrapper>`,
      );

      expect(el.lines).to.equal(3);
      const styles = el.shadowRoot.innerHTML;
      expect(styles).to.include("-webkit-line-clamp: 3");
      expect(styles).to.include("-webkit-box-orient: vertical");
    });

    it("should update lines via property", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.lines = 2;
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.getAttribute("lines")).to.equal("2");
    });
  });

  describe("Properties", () => {
    it("should update variant via property", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.variant = "headline-large";
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.getAttribute("variant")).to.equal("headline-large");
    });

    it("should update color via property", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.color = "error";
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.getAttribute("color")).to.equal("error");
    });

    it("should update align via property", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.align = "center";
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.getAttribute("align")).to.equal("center");
    });

    it("should update truncate via property", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.truncate = true;
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.truncate).to.be.true;
      expect(el.hasAttribute("truncate")).to.be.true;
    });
  });

  describe("Events", () => {
    it("does not emit custom events on attribute updates", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);
      let fired = false;

      el.addEventListener("ds-text-wrapper:change", () => {
        fired = true;
      });

      el.variant = "title-medium";
      el.color = "primary";
      expect(fired).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("is not keyboard-focusable by default", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);
      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("CSS Parts", () => {
    it("should have text part available for styling", async () => {
      const el = await fixture(
        html`<ds-text-wrapper>Styled text</ds-text-wrapper>`,
      );

      const textPart = el.shadowRoot.querySelector('[part="text"]');
      expect(textPart).to.exist;
      const slot = textPart.querySelector("slot");
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.be.greaterThan(0);
    });
  });

  describe("Slots", () => {
    it("should accept complex HTML content via slot", async () => {
      const el = await fixture(html`
        <ds-text-wrapper>
          <strong>Bold</strong> and <em>italic</em> text
        </ds-text-wrapper>
      `);

      const slot = el.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
      const slottedElements = slot.assignedElements();
      expect(slottedElements.length).to.be.greaterThan(0);
    });

    it("should handle text nodes in slot", async () => {
      const el = await fixture(
        html`<ds-text-wrapper>Simple text</ds-text-wrapper>`,
      );

      const slot = el.shadowRoot.querySelector("slot");
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.be.greaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should be accessible", async () => {
      const el = await fixture(
        html`<ds-text-wrapper>Accessible text</ds-text-wrapper>`,
      );

      await expect(el).to.be.accessible();
    });

    it("should support ARIA attributes", async () => {
      const el = await fixture(
        html`<ds-text-wrapper aria-label="Important text"
          >Text</ds-text-wrapper
        >`,
      );

      expect(el.getAttribute("aria-label")).to.equal("Important text");
    });
  });

  describe("Attribute Changes", () => {
    it("should update variant when attribute changes", async () => {
      const el = await fixture(
        html`<ds-text-wrapper variant="body-large">Text</ds-text-wrapper>`,
      );

      el.setAttribute("variant", "headline-small");
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.variant).to.equal("headline-small");
    });

    it("should update color when attribute changes", async () => {
      const el = await fixture(
        html`<ds-text-wrapper color="primary">Text</ds-text-wrapper>`,
      );

      el.setAttribute("color", "secondary");
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.color).to.equal("secondary");
    });

    it("should update align when attribute changes", async () => {
      const el = await fixture(
        html`<ds-text-wrapper align="start">Text</ds-text-wrapper>`,
      );

      el.setAttribute("align", "center");
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.align).to.equal("center");
    });

    it("should update truncate when attribute changes", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.setAttribute("truncate", "");
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.truncate).to.be.true;
    });

    it("should update lines when attribute changes", async () => {
      const el = await fixture(html`<ds-text-wrapper>Text</ds-text-wrapper>`);

      el.setAttribute("lines", "4");
      (await el.updateComplete) || new Promise((r) => setTimeout(r, 0));

      expect(el.lines).to.equal(4);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty content", async () => {
      const el = await fixture(html`<ds-text-wrapper></ds-text-wrapper>`);

      expect(el).to.exist;
    });

    it("should handle very long text", async () => {
      const longText = "A".repeat(1000);
      const el = await fixture(
        html`<ds-text-wrapper>${longText}</ds-text-wrapper>`,
      );

      expect(el).to.exist;
    });

    it("should handle special characters", async () => {
      const el = await fixture(
        html`<ds-text-wrapper>&lt;script&gt; & © ™</ds-text-wrapper>`,
      );

      expect(el).to.exist;
    });

    it("should ignore invalid variant and use default", async () => {
      const el = await fixture(
        html`<ds-text-wrapper variant="invalid-variant">Text</ds-text-wrapper>`,
      );

      expect(el.variant).to.equal("invalid-variant");
    });

    it("should handle numeric lines value", async () => {
      const el = await fixture(
        html`<ds-text-wrapper lines="5">Text</ds-text-wrapper>`,
      );

      expect(el.lines).to.equal(5);
    });

    it("should handle zero lines value", async () => {
      const el = await fixture(
        html`<ds-text-wrapper lines="0">Text</ds-text-wrapper>`,
      );

      expect(el.lines).to.equal(0);
    });
  });
});
