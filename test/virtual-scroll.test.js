import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import DSVirtualScroll from "../src/components/virtual-scroll/virtual-scroll.js";

const waitForTick = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const buildItems = (count = 20) =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    label: `Item ${index + 1}`,
  }));

describe("DSVirtualScroll", () => {
  describe("Initialization", () => {
    it("renders custom element with shadow root", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("defines the custom element", async () => {
      await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(customElements.get("ds-virtual-scroll")).to.equal(DSVirtualScroll);
    });

    it("declares observed attributes", async () => {
      await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(DSVirtualScroll.observedAttributes).to.deep.equal([
        "item-height",
        "buffer",
        "scroll-offset",
      ]);
    });

    it("renders required internal elements", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(el.shadowRoot.querySelector(".virtual-scroller")).to.exist;
      expect(el.shadowRoot.querySelector(".scroll-viewport")).to.exist;
      expect(el.shadowRoot.querySelector(".items-container")).to.exist;
      expect(el.shadowRoot.querySelector(".spacer-top")).to.exist;
      expect(el.shadowRoot.querySelector(".spacer-bottom")).to.exist;
    });

    it("uses default item-height of 48 without override", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(el._itemHeight).to.equal(48);
    });

    it("uses default buffer of 5", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(el._buffer).to.equal(5);
    });

    it("initializes with empty items array", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(el._items).to.deep.equal([]);
    });

    it("can disconnect cleanly", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      expect(() => el.remove()).to.not.throw();
      expect(el.isConnected).to.equal(false);
    });
  });

  describe("Attributes & Properties", () => {
    it("applies item-height attribute after connect", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll item-height="56"></ds-virtual-scroll>`,
      );
      el.attributeChangedCallback("item-height", "48", "56");
      expect(el._itemHeight).to.equal(56);
    });

    it("falls back item-height to 48 on invalid value", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll item-height="bad"></ds-virtual-scroll>`,
      );
      el.attributeChangedCallback("item-height", "48", "bad");
      expect(el._itemHeight).to.equal(48);
    });

    it("applies buffer attribute after connect", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll buffer="8"></ds-virtual-scroll>`,
      );
      el.attributeChangedCallback("buffer", "5", "8");
      expect(el._buffer).to.equal(8);
    });

    it("falls back buffer to 5 on invalid value", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll buffer="bad"></ds-virtual-scroll>`,
      );
      el.attributeChangedCallback("buffer", "5", "bad");
      expect(el._buffer).to.equal(5);
    });

    it("applies initial scroll-offset on connect", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll scroll-offset="120"></ds-virtual-scroll>`,
      );
      expect(el._scrollTop).to.equal(120);
    });

    it("updates scroll offset through attribute change", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.attributeChangedCallback("scroll-offset", "0", "140");
      expect(el._scrollTop).to.equal(140);
    });

    it("clamps negative scroll-offset to zero", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.attributeChangedCallback("scroll-offset", "0", "-50");
      expect(el._scroller.scrollTop).to.equal(0);
      expect(el._scrollTop).to.equal(0);
    });

    it("setItems stores provided objects", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const items = buildItems(10);
      el.setItems(items);
      expect(el._items).to.deep.equal(items);
    });

    it("setItems resets scrollTop to zero", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el._scroller.scrollTop = 200;
      el._scrollTop = 200;

      el.setItems(buildItems(10));
      expect(el._scroller.scrollTop).to.equal(0);
      expect(el._scrollTop).to.equal(0);
    });

    it("getVisibleItems returns rendered slice", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const items = buildItems(30);
      el.setItems(items);
      expect(el.getVisibleItems().length).to.be.greaterThan(0);
      expect(el.getVisibleItems().length).to.be.at.most(items.length);
    });

    it("updates range indexes when items are set", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(25));
      expect(el._startIdx).to.equal(0);
      expect(el._endIdx).to.be.greaterThan(0);
    });

    it("reads item height from CSS variable override", async () => {
      const el = await fixture(
        html`<ds-virtual-scroll
          style="--ds-virtual-scroll-item-height: 64px"></ds-virtual-scroll>`,
      );
      expect(el._itemHeight).to.equal(64);
    });
  });

  describe("Rendering & Methods", () => {
    it("renders items from string data", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(["A", "B", "C", "D", "E", "F"]);
      await waitForTick();

      const rendered = el.shadowRoot.querySelectorAll(".virtual-item");
      expect(rendered.length).to.be.greaterThan(0);
      expect(rendered[0].textContent).to.include("A");
    });

    it("renders object label text when provided", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems([{ label: "Label A" }, { text: "Text B" }]);
      await waitForTick();

      const first = el.shadowRoot.querySelector(".virtual-item .item-content");
      expect(first.textContent).to.include("Label A");
    });

    it("renders object text fallback when label is absent", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems([{ text: "Fallback Text" }]);
      await waitForTick();

      const first = el.shadowRoot.querySelector(".virtual-item .item-content");
      expect(first.textContent).to.include("Fallback Text");
    });

    it("renders HTMLElement item via clone", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const node = document.createElement("span");
      node.textContent = "Node Item";
      el.setItems([node]);
      await waitForTick();

      const rendered = el.shadowRoot.querySelector(
        ".virtual-item .item-content span",
      );
      expect(rendered).to.exist;
      expect(rendered.textContent).to.equal("Node Item");
      expect(rendered).to.not.equal(node);
    });

    it("scrollToIndex start aligns to expected top", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(200));
      el._scroller = {
        scrollTop: 0,
        clientHeight: 300,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      el.scrollToIndex(10, "start");
      expect(el._scroller.scrollTop).to.equal(10 * el._itemHeight);
    });

    it("scrollToIndex center keeps scrollTop in range", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(200));
      el._scroller = {
        scrollTop: 0,
        clientHeight: 300,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      el.scrollToIndex(60, "center");
      expect(el._scroller.scrollTop).to.be.at.least(0);
      expect(el._scroller.scrollTop).to.be.at.most(200 * el._itemHeight);
    });

    it("scrollToIndex end keeps scrollTop in range", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(200));
      el._scroller = {
        scrollTop: 0,
        clientHeight: 300,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      el.scrollToIndex(150, "end");
      expect(el._scroller.scrollTop).to.be.at.least(0);
      expect(el._scroller.scrollTop).to.be.at.most(200 * el._itemHeight);
    });

    it("scrollToIndex clamps negative index to zero", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(30));
      el._scroller = {
        scrollTop: 0,
        clientHeight: 300,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      el.scrollToIndex(-5);
      expect(el._scroller.scrollTop).to.equal(0);
    });

    it("scrollToIndex clamps over-large index to last item", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(30));
      el._scroller = {
        scrollTop: 0,
        clientHeight: 300,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      el.scrollToIndex(999);
      const maxScroll = Math.max(0, 30 * el._itemHeight - 300);
      expect(el._scroller.scrollTop).to.equal(maxScroll);
    });
  });

  describe("Events", () => {
    it("emits scroll-change event when items are set", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      setTimeout(() => el.setItems(buildItems(40)));
      const event = await oneEvent(el, "scroll-change");
      expect(event).to.exist;
    });

    it("scroll-change includes required detail keys", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      setTimeout(() => el.setItems(buildItems(40)));
      const event = await oneEvent(el, "scroll-change");

      expect(event.detail).to.have.property("startIdx");
      expect(event.detail).to.have.property("endIdx");
      expect(event.detail).to.have.property("scrollTop");
      expect(event.detail).to.have.property("visibleCount");
      expect(event.detail).to.have.property("viewportCount");
      expect(event.detail).to.have.property("totalCount");
    });

    it("scroll-change event bubbles and is composed", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      setTimeout(() => el.setItems(buildItems(40)));
      const event = await oneEvent(el, "scroll-change");
      expect(event.bubbles).to.equal(true);
      expect(event.composed).to.equal(true);
    });

    it("updates scrollTop in emitted detail after scroll", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(100));
      el._scrollTop = 120;
      el._updateContainerHeight = () => {};
      el._containerHeight = 240;
      setTimeout(() => {
        el._updateVirtualRange();
      });
      const event = await oneEvent(el, "scroll-change");
      expect(event.detail.scrollTop).to.equal(120);
    });

    it("sets totalCount in component state from item count", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const items = buildItems(77);
      el.setItems(items);
      expect(el._items.length).to.equal(77);
    });

    it("reports visibleCount as end-start", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      setTimeout(() => {
        el.setItems(buildItems(50));
      });
      const event = await oneEvent(el, "scroll-change");
      expect(event.detail.visibleCount).to.equal(
        event.detail.endIdx - event.detail.startIdx,
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowDown triggers focusItem with next index", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(10));
      const calls = [];
      el.focusItem = (index) => calls.push(index);

      el._onKeydown({
        key: "ArrowDown",
        preventDefault: () => {},
      });

      expect(calls[0]).to.equal(1);
    });

    it("ArrowUp triggers focusItem with previous index clamp", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const calls = [];
      el.focusItem = (index) => calls.push(index);

      el._onKeydown({
        key: "ArrowUp",
        preventDefault: () => {},
      });

      expect(calls[0]).to.equal(0);
    });

    it("Home triggers focus on first item", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const calls = [];
      el.focusItem = (index) => calls.push(index);

      el._onKeydown({
        key: "Home",
        preventDefault: () => {},
      });

      expect(calls[0]).to.equal(0);
    });

    it("End triggers focus on last item", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(11));
      const calls = [];
      el.focusItem = (index) => calls.push(index);

      el._onKeydown({
        key: "End",
        preventDefault: () => {},
      });

      expect(calls[0]).to.equal(10);
    });

    it("PageDown and PageUp use viewport row size", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(30));
      el._containerHeight = 240;
      el._itemHeight = 48;

      const calls = [];
      el.focusItem = (index) => calls.push(index);

      el._onKeydown({
        key: "PageDown",
        preventDefault: () => {},
      });
      el._onKeydown({
        key: "PageUp",
        preventDefault: () => {},
      });

      expect(calls[0]).to.equal(5);
      expect(calls[1]).to.equal(0);
    });
  });

  describe("Accessibility", () => {
    it("items container has listbox role", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      const container = el.shadowRoot.querySelector(".items-container");
      expect(container.getAttribute("role")).to.equal("listbox");
    });

    it("rendered items are focusable with tabindex 0", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(8));
      await waitForTick();

      const item = el.shadowRoot.querySelector(".virtual-item");
      expect(item.getAttribute("tabindex")).to.equal("0");
    });

    it("rendered items expose data-index attributes", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(8));
      await waitForTick();

      const item = el.shadowRoot.querySelector(".virtual-item");
      expect(item.getAttribute("data-index")).to.equal("0");
    });

    it("supports focusItem for in-range item", async () => {
      const el = await fixture(html`<ds-virtual-scroll></ds-virtual-scroll>`);
      el.setItems(buildItems(12));
      el._containerHeight = 300;
      el.focusItem(2);
      await waitForTick();

      const focused = el.shadowRoot.activeElement;
      expect(focused).to.exist;
    });
  });
});
