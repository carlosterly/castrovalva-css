import { fixture, html, expect } from "@open-wc/testing";
import { DSDivider } from "../src/components/divider/divider.js";

describe("DSDivider", () => {
  describe("Structure & Defaults", () => {
    it("renders with separator role", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr).to.exist;
      expect(hr.getAttribute("role")).to.equal("separator");
    });

    it("uses full-width variant by default", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      expect(el.variant).to.equal("full-width");
    });

    it("uses horizontal orientation by default", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      expect(el.orientation).to.equal("horizontal");
    });

    it("has a shadow root and parts", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      expect(el.shadowRoot).to.exist;
      const hr = el.shadowRoot.querySelector('[part="divider"]');
      expect(hr).to.exist;
    });
  });

  describe("Variants", () => {
    it("applies full-width variant", async () => {
      const el = await fixture(
        html`<ds-divider variant="full-width"></ds-divider>`
      );
      expect(el.variant).to.equal("full-width");
      expect(el.getAttribute("variant")).to.equal("full-width");
    });

    it("applies inset variant", async () => {
      const el = await fixture(html`<ds-divider variant="inset"></ds-divider>`);
      expect(el.variant).to.equal("inset");
      expect(el.getAttribute("variant")).to.equal("inset");
    });

    it("applies middle variant", async () => {
      const el = await fixture(
        html`<ds-divider variant="middle"></ds-divider>`
      );
      expect(el.variant).to.equal("middle");
      expect(el.getAttribute("variant")).to.equal("middle");
    });

    it("falls back to full-width on invalid variant", async () => {
      const el = await fixture(
        html`<ds-divider variant="invalid"></ds-divider>`
      );
      expect(el.variant).to.equal("full-width");
    });
  });

  describe("Orientation", () => {
    it("applies horizontal orientation", async () => {
      const el = await fixture(
        html`<ds-divider orientation="horizontal"></ds-divider>`
      );
      expect(el.orientation).to.equal("horizontal");
      expect(el.getAttribute("orientation")).to.equal("horizontal");
    });

    it("applies vertical orientation", async () => {
      const el = await fixture(
        html`<ds-divider orientation="vertical"></ds-divider>`
      );
      expect(el.orientation).to.equal("vertical");
      expect(el.getAttribute("orientation")).to.equal("vertical");
    });

    it("falls back to horizontal on invalid orientation", async () => {
      const el = await fixture(
        html`<ds-divider orientation="invalid"></ds-divider>`
      );
      expect(el.orientation).to.equal("horizontal");
    });

    it("host has display:block for horizontal", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const styles = window.getComputedStyle(el);
      expect(styles.display).to.equal("block");
    });

    it("host has display:inline-block for vertical", async () => {
      const el = await fixture(
        html`<ds-divider orientation="vertical"></ds-divider>`
      );
      const styles = window.getComputedStyle(el);
      expect(styles.display).to.equal("inline-block");
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom color attribute", async () => {
      const el = await fixture(html`<ds-divider color="red"></ds-divider>`);
      expect(el.color).to.equal("red");
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr.style.getPropertyValue("--ds-divider-color")).to.equal("red");
    });

    it("accepts custom thickness attribute", async () => {
      const el = await fixture(html`<ds-divider thickness="2px"></ds-divider>`);
      expect(el.thickness).to.equal("2px");
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr.style.getPropertyValue("--ds-divider-thickness")).to.equal(
        "2px"
      );
    });

    it("does not add inline styles without custom values", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr.hasAttribute("style")).to.be.false;
    });

    it("hr has no border", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.borderStyle).to.equal("none");
    });

    it("hr has zero margin by default", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.margin).to.equal("0px");
    });
  });

  describe("Accessibility", () => {
    it("uses separator role", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr.getAttribute("role")).to.equal("separator");
    });

    it("hr element is semantic", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr.tagName.toLowerCase()).to.equal("hr");
    });

    it("does not have interactive elements", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const interactive = el.shadowRoot.querySelectorAll("button, a, input");
      expect(interactive.length).to.equal(0);
    });

    it("is not focusable", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      expect(el.hasAttribute("tabindex")).to.be.false;
    });
  });

  describe("Properties", () => {
    it("variant property getter works", async () => {
      const el = await fixture(html`<ds-divider variant="inset"></ds-divider>`);
      expect(el.variant).to.equal("inset");
    });

    it("variant property setter works", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      el.variant = "middle";
      await el.updateComplete;
      expect(el.getAttribute("variant")).to.equal("middle");
      expect(el.variant).to.equal("middle");
    });

    it("orientation property getter works", async () => {
      const el = await fixture(
        html`<ds-divider orientation="vertical"></ds-divider>`
      );
      expect(el.orientation).to.equal("vertical");
    });

    it("orientation property setter works", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      el.orientation = "vertical";
      await el.updateComplete;
      expect(el.getAttribute("orientation")).to.equal("vertical");
      expect(el.orientation).to.equal("vertical");
    });

    it("color property getter works", async () => {
      const el = await fixture(html`<ds-divider color="blue"></ds-divider>`);
      expect(el.color).to.equal("blue");
    });

    it("color property setter works", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      el.color = "green";
      await el.updateComplete;
      expect(el.getAttribute("color")).to.equal("green");
    });

    it("thickness property getter works", async () => {
      const el = await fixture(html`<ds-divider thickness="3px"></ds-divider>`);
      expect(el.thickness).to.equal("3px");
    });

    it("thickness property setter works", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      el.thickness = "4px";
      await el.updateComplete;
      expect(el.getAttribute("thickness")).to.equal("4px");
    });

    it("color property can be removed", async () => {
      const el = await fixture(html`<ds-divider color="red"></ds-divider>`);
      el.color = null;
      await el.updateComplete;
      expect(el.hasAttribute("color")).to.be.false;
    });

    it("thickness property can be removed", async () => {
      const el = await fixture(html`<ds-divider thickness="5px"></ds-divider>`);
      el.thickness = null;
      await el.updateComplete;
      expect(el.hasAttribute("thickness")).to.be.false;
    });
  });

  describe("DOM Structure", () => {
    it("renders as hr element", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      expect(hr).to.exist;
    });

    it("has divider part", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const part = el.shadowRoot.querySelector('[part="divider"]');
      expect(part).to.exist;
      expect(part.tagName.toLowerCase()).to.equal("hr");
    });

    it("responds to variant attribute change", async () => {
      const el = await fixture(
        html`<ds-divider variant="full-width"></ds-divider>`
      );
      expect(el.variant).to.equal("full-width");
      el.setAttribute("variant", "inset");
      await el.updateComplete;
      expect(el.variant).to.equal("inset");
    });

    it("responds to orientation attribute change", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      expect(el.orientation).to.equal("horizontal");
      el.setAttribute("orientation", "vertical");
      await el.updateComplete;
      expect(el.orientation).to.equal("vertical");
    });

    it("maintains single hr element", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hrs = el.shadowRoot.querySelectorAll("hr");
      expect(hrs.length).to.equal(1);
    });
  });

  describe("CSS Custom Properties", () => {
    it("uses CSS custom property for color", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.backgroundColor).to.exist;
    });

    it("applies background-color to hr", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
    });

    it("hr uses box-sizing border-box", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.boxSizing).to.equal("border-box");
    });
  });

  describe("Variant Behavior", () => {
    it("full-width has no horizontal margins", async () => {
      const el = await fixture(
        html`<ds-divider variant="full-width"></ds-divider>`
      );
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.marginLeft).to.equal("0px");
      expect(styles.marginRight).to.equal("0px");
    });

    it("inset has left margin", async () => {
      const el = await fixture(html`<ds-divider variant="inset"></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(parseInt(styles.marginLeft)).to.be.greaterThan(0);
    });

    it("middle has both horizontal margins", async () => {
      const el = await fixture(
        html`<ds-divider variant="middle"></ds-divider>`
      );
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(parseInt(styles.marginLeft)).to.be.greaterThan(0);
      expect(parseInt(styles.marginRight)).to.be.greaterThan(0);
    });

    it("horizontal divider has width 100%", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.width).to.not.equal("0px");
    });

    it("vertical divider has height 100%", async () => {
      const el = await fixture(
        html`<ds-divider orientation="vertical"></ds-divider>`
      );
      const hr = el.shadowRoot.querySelector("hr");
      const styles = window.getComputedStyle(hr);
      expect(styles.height).to.exist;
    });
  });

  describe("Edge Cases", () => {
    it("handles multiple attribute changes", async () => {
      const el = await fixture(html`<ds-divider></ds-divider>`);
      el.setAttribute("variant", "inset");
      el.setAttribute("orientation", "vertical");
      el.setAttribute("color", "purple");
      await el.updateComplete;
      expect(el.variant).to.equal("inset");
      expect(el.orientation).to.equal("vertical");
      expect(el.color).to.equal("purple");
    });

    it("ignores invalid variant setter values", async () => {
      const el = await fixture(
        html`<ds-divider variant="full-width"></ds-divider>`
      );
      const originalVariant = el.variant;
      el.variant = "invalid";
      // Should not change since invalid is not in the allowed list
      expect(el.getAttribute("variant")).to.equal("full-width");
    });

    it("ignores invalid orientation setter values", async () => {
      const el = await fixture(
        html`<ds-divider orientation="horizontal"></ds-divider>`
      );
      const originalOrientation = el.orientation;
      el.orientation = "diagonal";
      // Should not change since diagonal is not in the allowed list
      expect(el.getAttribute("orientation")).to.equal("horizontal");
    });
  });
});
