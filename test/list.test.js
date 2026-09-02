import { fixture, html, expect } from "@open-wc/testing";
import { DSList, DSListItem } from "../src/components/list/list.js";

describe("DSList", () => {
  describe("Structure & Defaults", () => {
    it("renders list with role", async () => {
      const el = await fixture(html`<ds-list></ds-list>`);
      expect(el.getAttribute("role")).to.equal("list");
    });

    it("renders as block element", async () => {
      const el = await fixture(html`<ds-list></ds-list>`);
      const styles = window.getComputedStyle(el);
      expect(styles.display).to.equal("block");
    });

    it("accepts list items as children", async () => {
      const el = await fixture(html`
        <ds-list>
          <ds-list-item headline="Item 1"></ds-list-item>
          <ds-list-item headline="Item 2"></ds-list-item>
        </ds-list>
      `);
      const items = el.querySelectorAll("ds-list-item");
      expect(items.length).to.equal(2);
    });

    it("has shadow root", async () => {
      const el = await fixture(html`<ds-list></ds-list>`);
      expect(el.shadowRoot).to.exist;
    });
  });
});

describe("DSListItem", () => {
  describe("Structure & Defaults", () => {
    it("renders with listitem role", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.getAttribute("role")).to.equal("listitem");
    });

    it("uses one-line variant by default", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.variant).to.equal("one-line");
    });

    it("renders headline text", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test Item"></ds-list-item>`,
      );
      const headline = el.shadowRoot.querySelector('[part="headline"]');
      expect(headline.textContent).to.equal("Test Item");
    });

    it("has a shadow root and parts", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.shadowRoot).to.exist;
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("renders container part", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container).to.exist;
    });

    it("renders leading part", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const leading = el.shadowRoot.querySelector('[part="leading"]');
      expect(leading).to.exist;
    });

    it("renders content part", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const content = el.shadowRoot.querySelector('[part="content"]');
      expect(content).to.exist;
    });

    it("renders trailing part", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const trailing = el.shadowRoot.querySelector('[part="trailing"]');
      expect(trailing).to.exist;
    });
  });

  describe("Variants", () => {
    it("applies one-line variant", async () => {
      const el = await fixture(
        html`<ds-list-item variant="one-line" headline="Test"></ds-list-item>`,
      );
      expect(el.variant).to.equal("one-line");
    });

    it("applies two-line variant", async () => {
      const el = await fixture(
        html`<ds-list-item
          variant="two-line"
          headline="Test"
          supporting-text="Details"></ds-list-item>`,
      );
      expect(el.variant).to.equal("two-line");
    });

    it("applies three-line variant", async () => {
      const el = await fixture(
        html`<ds-list-item
          variant="three-line"
          headline="Test"
          supporting-text="More details"></ds-list-item>`,
      );
      expect(el.variant).to.equal("three-line");
    });

    it("falls back to one-line on invalid variant", async () => {
      const el = await fixture(
        html`<ds-list-item variant="invalid" headline="Test"></ds-list-item>`,
      );
      expect(el.variant).to.equal("one-line");
    });

    it("one-line variant has correct height", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.height).to.equal("56px");
    });

    it("two-line variant has correct height", async () => {
      const el = await fixture(
        html`<ds-list-item
          variant="two-line"
          headline="Test"
          supporting-text="Details"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.height).to.equal("72px");
    });

    it("three-line variant has correct height", async () => {
      const el = await fixture(
        html`<ds-list-item
          variant="three-line"
          headline="Test"
          supporting-text="Details"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.height).to.equal("88px");
    });
  });

  describe("Text Content", () => {
    it("displays headline", async () => {
      const el = await fixture(
        html`<ds-list-item headline="My Headline"></ds-list-item>`,
      );
      const headline = el.shadowRoot.querySelector('[part="headline"]');
      expect(headline.textContent).to.equal("My Headline");
    });

    it("displays supporting text when provided", async () => {
      const el = await fixture(
        html`<ds-list-item
          headline="Title"
          supporting-text="Description"></ds-list-item>`,
      );
      const supporting = el.shadowRoot.querySelector(
        '[part="supporting-text"]',
      );
      expect(supporting).to.exist;
      expect(supporting.textContent).to.equal("Description");
    });

    it("does not display supporting text when not provided", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Title"></ds-list-item>`,
      );
      const supporting = el.shadowRoot.querySelector(
        '[part="supporting-text"]',
      );
      expect(supporting).to.not.exist;
    });

    it("displays trailing text when provided", async () => {
      const el = await fixture(
        html`<ds-list-item
          headline="Title"
          trailing-text="Meta"></ds-list-item>`,
      );
      const trailing = el.shadowRoot.querySelector('[part="trailing-text"]');
      expect(trailing).to.exist;
      expect(trailing.textContent).to.equal("Meta");
    });

    it("does not display trailing text when not provided", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Title"></ds-list-item>`,
      );
      const trailing = el.shadowRoot.querySelector('[part="trailing-text"]');
      expect(trailing).to.not.exist;
    });
  });

  describe("Slots", () => {
    it("has leading slot", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"
          ><div slot="leading">Icon</div></ds-list-item
        >`,
      );
      const slot = el.shadowRoot.querySelector('slot[name="leading"]');
      expect(slot).to.exist;
    });

    it("has trailing slot", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"
          ><div slot="trailing">Action</div></ds-list-item
        >`,
      );
      const slot = el.shadowRoot.querySelector('slot[name="trailing"]');
      expect(slot).to.exist;
    });

    it("renders leading slot content", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"
          ><div slot="leading">Icon</div></ds-list-item
        >`,
      );
      const leading = el.querySelector('[slot="leading"]');
      expect(leading).to.exist;
      expect(leading.textContent).to.equal("Icon");
    });

    it("renders trailing slot content", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"
          ><div slot="trailing">Action</div></ds-list-item
        >`,
      );
      const trailing = el.querySelector('[slot="trailing"]');
      expect(trailing).to.exist;
      expect(trailing.textContent).to.equal("Action");
    });
  });

  describe("Selection & States", () => {
    it("is not selected by default", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.selected).to.be.false;
    });

    it("can be selected", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" selected></ds-list-item>`,
      );
      expect(el.selected).to.be.true;
      expect(el.hasAttribute("selected")).to.be.true;
    });

    it("is not disabled by default", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.disabled).to.be.false;
    });

    it("can be disabled", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("disabled state sets aria-disabled", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("enabled state removes aria-disabled", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.hasAttribute("aria-disabled")).to.be.false;
    });
  });

  describe("Properties", () => {
    it("variant property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item
          variant="two-line"
          headline="Test"
          supporting-text="Details"></ds-list-item>`,
      );
      expect(el.variant).to.equal("two-line");
    });

    it("variant property setter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.variant = "two-line";
      await el.updateComplete;
      expect(el.getAttribute("variant")).to.equal("two-line");
    });

    it("headline property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="My Item"></ds-list-item>`,
      );
      expect(el.headline).to.equal("My Item");
    });

    it("headline property setter works", async () => {
      const el = await fixture(html`<ds-list-item></ds-list-item>`);
      el.headline = "New Headline";
      await el.updateComplete;
      expect(el.getAttribute("headline")).to.equal("New Headline");
    });

    it("supportingText property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item
          headline="Test"
          supporting-text="Description"></ds-list-item>`,
      );
      expect(el.supportingText).to.equal("Description");
    });

    it("supportingText property setter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.supportingText = "New Description";
      await el.updateComplete;
      expect(el.getAttribute("supporting-text")).to.equal("New Description");
    });

    it("trailingText property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item
          headline="Test"
          trailing-text="Meta"></ds-list-item>`,
      );
      expect(el.trailingText).to.equal("Meta");
    });

    it("trailingText property setter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.trailingText = "New Meta";
      await el.updateComplete;
      expect(el.getAttribute("trailing-text")).to.equal("New Meta");
    });

    it("selected property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" selected></ds-list-item>`,
      );
      expect(el.selected).to.be.true;
    });

    it("selected property setter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.selected = true;
      await el.updateComplete;
      expect(el.hasAttribute("selected")).to.be.true;
    });

    it("disabled property getter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      expect(el.disabled).to.be.true;
    });

    it("disabled property setter works", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.disabled = true;
      await el.updateComplete;
      expect(el.hasAttribute("disabled")).to.be.true;
    });
  });

  describe("Accessibility", () => {
    it("has listitem role", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.getAttribute("role")).to.equal("listitem");
    });

    it("is focusable when enabled", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.hasAttribute("tabindex")).to.be.false;
    });

    it("has headline part for styling", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const headline = el.shadowRoot.querySelector('[part="headline"]');
      expect(headline).to.exist;
    });

    it("has supporting-text part for styling", async () => {
      const el = await fixture(
        html`<ds-list-item
          headline="Test"
          supporting-text="Details"></ds-list-item>`,
      );
      const supporting = el.shadowRoot.querySelector(
        '[part="supporting-text"]',
      );
      expect(supporting).to.exist;
    });
  });

  describe("Events", () => {
    it("fires click event", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      let eventFired = false;
      el.addEventListener("ds-list-item:click", () => {
        eventFired = true;
      });
      el.click();
      expect(eventFired).to.be.true;
    });

    it("does not fire click event when disabled", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      let eventFired = false;
      el.addEventListener("ds-list-item:click", () => {
        eventFired = true;
      });
      el.click();
      expect(eventFired).to.be.false;
    });

    it("click event has correct detail", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      let eventDetail = null;
      el.addEventListener("ds-list-item:click", (e) => {
        eventDetail = e.detail;
      });
      el.click();
      expect(eventDetail.item).to.equal(el);
    });
  });

  describe("DOM Structure", () => {
    it("responds to variant attribute change", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.variant).to.equal("one-line");
      el.setAttribute("variant", "two-line");
      await el.updateComplete;
      expect(el.variant).to.equal("two-line");
    });

    it("responds to headline attribute change", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Original"></ds-list-item>`,
      );
      el.setAttribute("headline", "Updated");
      await el.updateComplete;
      const headline = el.shadowRoot.querySelector('[part="headline"]');
      expect(headline.textContent).to.equal("Updated");
    });

    it("responds to selected attribute change", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.selected).to.be.false;
      el.setAttribute("selected", "");
      await el.updateComplete;
      expect(el.selected).to.be.true;
    });

    it("responds to disabled attribute change", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      expect(el.disabled).to.be.false;
      el.setAttribute("disabled", "");
      await el.updateComplete;
      expect(el.disabled).to.be.true;
      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });
  });

  describe("Styling", () => {
    it("has flexbox layout", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.display).to.equal("flex");
    });

    it("items are center aligned", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.alignItems).to.equal("center");
    });

    it("has padding", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const container = el.shadowRoot.querySelector('[part="container"]');
      const styles = window.getComputedStyle(container);
      expect(parseInt(styles.paddingLeft)).to.be.greaterThan(0);
    });

    it("has bottom border", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(styles.borderBottomStyle).to.equal("solid");
    });

    it("disabled item has reduced opacity", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      const styles = window.getComputedStyle(el);
      expect(parseFloat(styles.opacity)).to.be.lessThan(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty headline", async () => {
      const el = await fixture(html`<ds-list-item headline=""></ds-list-item>`);
      const headline = el.shadowRoot.querySelector('[part="headline"]');
      expect(headline).to.exist;
      expect(headline.textContent).to.equal("");
    });

    it("handles multiple attribute changes", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test"></ds-list-item>`,
      );
      el.setAttribute("variant", "two-line");
      el.setAttribute("supporting-text", "Details");
      el.setAttribute("selected", "");
      await el.updateComplete;
      expect(el.variant).to.equal("two-line");
      expect(el.supportingText).to.equal("Details");
      expect(el.selected).to.be.true;
    });

    it("ignores invalid variant setter values", async () => {
      const el = await fixture(
        html`<ds-list-item variant="one-line" headline="Test"></ds-list-item>`,
      );
      el.variant = "invalid";
      expect(el.getAttribute("variant")).to.equal("one-line");
    });

    it("removes selected when set to false", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" selected></ds-list-item>`,
      );
      el.selected = false;
      await el.updateComplete;
      expect(el.hasAttribute("selected")).to.be.false;
    });

    it("removes disabled when set to false", async () => {
      const el = await fixture(
        html`<ds-list-item headline="Test" disabled></ds-list-item>`,
      );
      el.disabled = false;
      await el.updateComplete;
      expect(el.hasAttribute("disabled")).to.be.false;
    });
  });
});
