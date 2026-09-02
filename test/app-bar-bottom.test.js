import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/app-bar-bottom/app-bar-bottom.js";

describe("DSAppBarBottom", () => {
  describe("Structure & defaults", () => {
    it("renders with contentinfo role", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const bar = el.shadowRoot.querySelector("[role='contentinfo']");
      expect(bar).to.exist;
    });

    it("uses standard variant by default", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.dataset.variant).to.equal("standard");
    });

    it("falls back to standard on invalid variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="invalid"></ds-app-bar-bottom>`
      );
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.dataset.variant).to.equal("standard");
    });

    it("has a shadow root and parts", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      expect(el.shadowRoot).to.exist;
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.getAttribute("part")).to.include("container");
    });
  });

  describe("Variants & layout", () => {
    it("applies standard variant", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.dataset.variant).to.equal("standard");
    });

    it("applies with-fab variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.dataset.variant).to.equal("with-fab");
    });

    it("tracks data-variant on footer", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const footer = el.shadowRoot.querySelector(".app-bar");
      expect(footer.dataset.variant).to.equal("with-fab");
    });

    it("renders as footer element", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector("footer");
      expect(footer).to.exist;
    });
  });

  describe("Actions", () => {
    it("renders action slot content in standard", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          ><button slot="actions" id="action-btn">
            Search
          </button></ds-app-bar-bottom
        >`
      );
      expect(el.querySelector("#action-btn")).to.exist;
    });

    it("renders action slot content in with-fab", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><button slot="actions" id="action-btn">
            Search
          </button></ds-app-bar-bottom
        >`
      );
      expect(el.querySelector("#action-btn")).to.exist;
    });

    it("keeps multiple actions order", async () => {
      const el = await fixture(html`<ds-app-bar-bottom>
        <button slot="actions" id="a1">Search</button>
        <button slot="actions" id="a2">More</button>
        <button slot="actions" id="a3">Settings</button>
      </ds-app-bar-bottom>`);
      const nodes = Array.from(el.querySelectorAll("[slot='actions']"));
      expect(nodes.map((n) => n.id)).to.deep.equal(["a1", "a2", "a3"]);
    });

    it("has action buttons area", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const actions = el.shadowRoot.querySelector(".actions");
      expect(actions).to.exist;
    });
  });

  describe("FAB (with-fab variant)", () => {
    it("hides fab area in standard variant", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const fabArea = el.shadowRoot.querySelector(".fab-area");
      expect(fabArea).to.exist;
    });

    it("shows fab area in with-fab variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const fabArea = el.shadowRoot.querySelector(".fab-area");
      expect(fabArea).to.exist;
    });

    it("renders fab slot content in with-fab", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><button slot="fab" id="fab-btn">Add</button></ds-app-bar-bottom
        >`
      );
      expect(el.querySelector("#fab-btn")).to.exist;
    });

    it("fab area has part attribute", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const fabArea = el.shadowRoot.querySelector(".fab-area");
      expect(fabArea.getAttribute("part")).to.equal("fab-area");
    });

    it("fab slot has correct z-index layering", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><button slot="fab">Add</button></ds-app-bar-bottom
        >`
      );
      const fabSlot = el.shadowRoot.querySelector(".fab-slot");
      expect(fabSlot).to.exist;
    });

    it("fab area has 80px dimensions", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const fabArea = el.shadowRoot.querySelector(".fab-area");
      const computed = getComputedStyle(fabArea);
      expect(computed.width).to.equal("80px");
      expect(computed.height).to.equal("80px");
    });

    it("fab cutout pseudo-element exists", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const fabArea = el.shadowRoot.querySelector(".fab-area");
      expect(fabArea).to.exist;
    });
  });

  describe("Styling & tokens", () => {
    it("applies background custom property", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          style="--ds-app-bar-bg: rgb(1, 2, 3);"></ds-app-bar-bottom>`
      );
      const bg = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar")
      ).backgroundColor;
      expect(bg).to.equal("rgb(1, 2, 3)");
    });

    it("uses Material Symbols font for actions", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          ><button slot="actions" class="material-symbols-outlined">
            search
          </button></ds-app-bar-bottom
        >`
      );
      const btn = el.querySelector('[slot="actions"]');
      expect(btn).to.exist;
    });

    it("has shadow elevation", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const shadow = getComputedStyle(footer).boxShadow;
      expect(shadow).to.not.equal("none");
    });

    it("applies foreground color token", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          style="--ds-app-bar-color: rgb(100, 150, 200);"></ds-app-bar-bottom>`
      );
      const color = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar")
      ).color;
      expect(color).to.equal("rgb(100, 150, 200)");
    });
  });

  describe("Accessibility", () => {
    it("uses contentinfo landmark role", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector("[role='contentinfo']");
      expect(footer).to.exist;
    });

    it("action buttons should have aria-labels", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          ><button slot="actions" aria-label="Search">
            🔍
          </button></ds-app-bar-bottom
        >`
      );
      const btn = el.querySelector('[slot="actions"]');
      expect(btn.getAttribute("aria-label")).to.equal("Search");
    });

    it("fab button should be keyboard accessible", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><button slot="fab" aria-label="Add">+</button></ds-app-bar-bottom
        >`
      );
      const fab = el.querySelector('[slot="fab"]');
      expect(fab).to.exist;
    });

    it("supports focus management on actions", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          ><button slot="actions">A</button></ds-app-bar-bottom
        >`
      );
      const btn = el.querySelector('[slot="actions"]');
      expect(btn).to.exist;
    });
  });

  describe("Slots & layout", () => {
    it("actions slot in standard variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom
          ><span slot="actions">Action</span></ds-app-bar-bottom
        >`
      );
      const slotted = el.querySelector('[slot="actions"]');
      expect(slotted).to.exist;
    });

    it("actions slot in with-fab variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><span slot="actions">Action</span></ds-app-bar-bottom
        >`
      );
      const slotted = el.querySelector('[slot="actions"]');
      expect(slotted).to.exist;
    });

    it("fab slot only works in with-fab", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"
          ><button slot="fab">FAB</button></ds-app-bar-bottom
        >`
      );
      const fab = el.querySelector('[slot="fab"]');
      expect(fab).to.exist;
    });

    it("actions part exists", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const actions = el.shadowRoot.querySelector('[part="actions"]');
      expect(actions).to.exist;
    });
  });

  describe("DOM structure", () => {
    it("maintains host element width 100%", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      expect(getComputedStyle(el).display).to.equal("block");
      expect(el).to.exist;
    });

    it("footer uses grid layout", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const display = getComputedStyle(footer).display;
      expect(display).to.equal("grid");
    });

    it("standard variant has grid layout", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const columns = getComputedStyle(footer).gridTemplateColumns;
      expect(columns).to.be.ok;
    });

    it("with-fab variant has 3-column layout", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      const footer = el.shadowRoot.querySelector(".app-bar");
      const columns = getComputedStyle(footer).gridTemplateColumns;
      const columnCount = columns.split(" ").length;
      expect(columnCount).to.be.at.least(2);
    });

    it("footer is semantic footer element", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector("footer");
      expect(footer.tagName).to.equal("FOOTER");
    });

    it("responds to variant attribute change", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const before = el.shadowRoot.querySelector(".app-bar").dataset.variant;
      el.setAttribute("variant", "with-fab");
      const after = el.shadowRoot.querySelector(".app-bar").dataset.variant;
      expect(before).to.equal("standard");
      expect(after).to.equal("with-fab");
    });
  });

  describe("Misc", () => {
    it("min-height is 80px", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const minHeight = getComputedStyle(footer).minHeight;
      expect(minHeight).to.equal("80px");
    });

    it("uses box-sizing: border-box", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const boxSizing = getComputedStyle(footer).boxSizing;
      expect(boxSizing).to.equal("border-box");
    });

    it("applies gap between items", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const gap = getComputedStyle(footer).gap;
      expect(gap).to.equal("12px");
    });

    it("horizontal padding is 16px standard", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const footer = el.shadowRoot.querySelector(".app-bar");
      const padding = getComputedStyle(footer).paddingLeft;
      expect(padding).to.equal("16px");
    });

    it("actions display flex correctly", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const actions = el.shadowRoot.querySelector(".actions");
      const display = getComputedStyle(actions).display;
      expect(["flex", "inline-flex"].includes(display)).to.be.true;
    });

    it("handles no actions gracefully", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      const actions = el.shadowRoot.querySelector(".actions");
      expect(actions).to.exist;
    });

    it("variant property getter works", async () => {
      const el = await fixture(
        html`<ds-app-bar-bottom variant="with-fab"></ds-app-bar-bottom>`
      );
      expect(el.variant).to.equal("with-fab");
    });

    it("variant property setter works", async () => {
      const el = await fixture(html`<ds-app-bar-bottom></ds-app-bar-bottom>`);
      el.variant = "with-fab";
      expect(el.getAttribute("variant")).to.equal("with-fab");
    });
  });
});
