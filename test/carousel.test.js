import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import { DSCarousel } from "../src/components/carousel/carousel.js";

const twoSlides = html`
  <ds-carousel>
    <div>Slide 1</div>
    <div>Slide 2</div>
  </ds-carousel>
`;

describe("DSCarousel", () => {
  describe("Initialization", () => {
    it("renders custom element with shadow root", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("defines ds-carousel custom element", async () => {
      await fixture(html`<ds-carousel></ds-carousel>`);
      expect(customElements.get("ds-carousel")).to.equal(DSCarousel);
    });

    it("uses contained as default variant", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el.variant).to.equal("contained");
    });

    it("starts with currentIndex zero", async () => {
      const el = await fixture(twoSlides);
      expect(el.currentIndex).to.equal(0);
    });

    it("declares expected observed attributes", async () => {
      await fixture(html`<ds-carousel></ds-carousel>`);
      expect(DSCarousel.observedAttributes).to.deep.equal([
        "variant",
        "show-navigation",
        "show-indicators",
        "auto-play",
        "auto-play-interval",
        "loop",
      ]);
    });

    it("renders main structural parts", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el.shadowRoot.querySelector('[part="container"]')).to.exist;
      expect(el.shadowRoot.querySelector('[part="viewport"]')).to.exist;
      expect(el.shadowRoot.querySelector('[part="navigation"]')).to.exist;
      expect(el.shadowRoot.querySelector('[part="indicators"]')).to.exist;
    });

    it("renders default slot", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el.shadowRoot.querySelector("slot")).to.exist;
    });

    it("updates item count from light DOM children on connect", async () => {
      const el = await fixture(twoSlides);
      expect(el._itemCount).to.equal(2);
    });
  });

  describe("Attributes & Properties", () => {
    it("accepts uncontained variant", async () => {
      const el = await fixture(
        html`<ds-carousel variant="uncontained"></ds-carousel>`,
      );
      expect(el.variant).to.equal("uncontained");
    });

    it("accepts hero variant", async () => {
      const el = await fixture(
        html`<ds-carousel variant="hero"></ds-carousel>`,
      );
      expect(el.variant).to.equal("hero");
    });

    it("falls back to contained for invalid variant", async () => {
      const el = await fixture(
        html`<ds-carousel variant="invalid"></ds-carousel>`,
      );
      expect(el.variant).to.equal("contained");
    });

    it("reflects showNavigation property to attribute", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      el.showNavigation = true;
      expect(el.hasAttribute("show-navigation")).to.equal(true);
      el.showNavigation = false;
      expect(el.hasAttribute("show-navigation")).to.equal(false);
    });

    it("reflects showIndicators property to attribute", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      el.showIndicators = true;
      expect(el.hasAttribute("show-indicators")).to.equal(true);
      el.showIndicators = false;
      expect(el.hasAttribute("show-indicators")).to.equal(false);
    });

    it("reflects autoPlay property to attribute", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      el.autoPlay = true;
      expect(el.hasAttribute("auto-play")).to.equal(true);
      el.autoPlay = false;
      expect(el.hasAttribute("auto-play")).to.equal(false);
    });

    it("uses default autoPlayInterval of 5000", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el.autoPlayInterval).to.equal(5000);
    });

    it("reads autoPlayInterval attribute value", async () => {
      const el = await fixture(
        html`<ds-carousel auto-play-interval="3000"></ds-carousel>`,
      );
      expect(el.autoPlayInterval).to.equal(3000);
    });

    it("reflects loop property to attribute", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      el.loop = true;
      expect(el.hasAttribute("loop")).to.equal(true);
      el.loop = false;
      expect(el.hasAttribute("loop")).to.equal(false);
    });

    it("shows navigation controls only when enabled", async () => {
      const el = await fixture(
        html`<ds-carousel show-navigation></ds-carousel>`,
      );
      const nav = el.shadowRoot.querySelector('[part="navigation"]');
      expect(getComputedStyle(nav).display).to.not.equal("none");
    });

    it("shows indicators only when enabled", async () => {
      const el = await fixture(html`
        <ds-carousel show-indicators>
          <div>1</div>
          <div>2</div>
        </ds-carousel>
      `);
      const indicators = el.shadowRoot.querySelector('[part="indicators"]');
      expect(getComputedStyle(indicators).display).to.not.equal("none");
    });
  });

  describe("Navigation & Methods", () => {
    it("exposes next, previous, and goToSlide methods", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(el.next).to.be.a("function");
      expect(el.previous).to.be.a("function");
      expect(el.goToSlide).to.be.a("function");
    });

    it("goToSlide changes currentIndex within range", async () => {
      const el = await fixture(html`
        <ds-carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </ds-carousel>
      `);
      el.goToSlide(2);
      expect(el.currentIndex).to.equal(2);
    });

    it("goToSlide ignores out-of-range indexes", async () => {
      const el = await fixture(twoSlides);
      el.goToSlide(20);
      expect(el.currentIndex).to.equal(0);
      el.goToSlide(-1);
      expect(el.currentIndex).to.equal(0);
    });

    it("next moves to following slide", async () => {
      const el = await fixture(twoSlides);
      el.next();
      expect(el.currentIndex).to.equal(1);
    });

    it("previous moves to prior slide", async () => {
      const el = await fixture(twoSlides);
      el.goToSlide(1);
      el.previous();
      expect(el.currentIndex).to.equal(0);
    });

    it("next loops to start when at end and loop enabled", async () => {
      const el = await fixture(html`
        <ds-carousel loop>
          <div>1</div>
          <div>2</div>
        </ds-carousel>
      `);
      el.goToSlide(1);
      el.next();
      expect(el.currentIndex).to.equal(0);
    });

    it("previous loops to end when at start and loop enabled", async () => {
      const el = await fixture(html`
        <ds-carousel loop>
          <div>1</div>
          <div>2</div>
        </ds-carousel>
      `);
      el.previous();
      expect(el.currentIndex).to.equal(1);
    });

    it("disables previous button at start when loop disabled", async () => {
      const el = await fixture(
        html`<ds-carousel show-navigation
          >${html`<div>1</div>
            <div>2</div>`}</ds-carousel
        >`,
      );
      const prevBtn = el.shadowRoot.querySelector(
        '[part="nav-button"][data-direction="prev"]',
      );
      expect(prevBtn.disabled).to.equal(true);
    });

    it("disables next button at end when loop disabled", async () => {
      const el = await fixture(twoSlides);
      el.goToSlide(1);
      const nextBtn = el.shadowRoot.querySelector(
        '[part="nav-button"][data-direction="next"]',
      );
      expect(nextBtn.disabled).to.equal(true);
    });

    it("single next click advances exactly one slide", async () => {
      const el = await fixture(html`
        <ds-carousel show-navigation>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </ds-carousel>
      `);

      el.setupEventListeners();
      el.setupEventListeners();

      const nextBtn = el.shadowRoot.querySelector(
        '[part="nav-button"][data-direction="next"]',
      );
      nextBtn.click();

      expect(el.currentIndex).to.equal(1);
    });
  });

  describe("Events", () => {
    it("fires ds-carousel:change when goToSlide changes slide", async () => {
      const el = await fixture(twoSlides);
      setTimeout(() => el.goToSlide(1));
      const event = await oneEvent(el, "ds-carousel:change");
      expect(event.detail.index).to.equal(1);
      expect(event.detail.total).to.equal(2);
    });

    it("change event bubbles and is composed", async () => {
      const el = await fixture(twoSlides);
      setTimeout(() => el.goToSlide(1));
      const event = await oneEvent(el, "ds-carousel:change");
      expect(event.bubbles).to.equal(true);
      expect(event.composed).to.equal(true);
    });

    it("fires ds-carousel:scroll during scroll index updates", async () => {
      const el = await fixture(html`
        <ds-carousel>
          <div style="width: 300px;">1</div>
          <div style="width: 300px;">2</div>
        </ds-carousel>
      `);

      const viewport = el.shadowRoot.querySelector('[part="viewport"]');
      Object.defineProperty(viewport, "scrollLeft", {
        value: 300,
        configurable: true,
      });
      const slot = el.shadowRoot.querySelector("slot");
      const items = slot.assignedElements();
      Object.defineProperty(items[0], "offsetWidth", {
        value: 300,
        configurable: true,
      });

      setTimeout(() => el._handleScroll());
      const event = await oneEvent(el, "ds-carousel:scroll");
      expect(event.detail.index).to.equal(1);
      expect(event.detail.total).to.equal(2);
    });

    it("uses nearest slide offset for scroll index detection", async () => {
      const el = await fixture(html`
        <ds-carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </ds-carousel>
      `);

      const viewport = el.shadowRoot.querySelector('[part="viewport"]');
      Object.defineProperty(viewport, "scrollLeft", {
        value: 260,
        configurable: true,
      });

      const items = el.shadowRoot.querySelector("slot").assignedElements();
      Object.defineProperty(items[0], "offsetLeft", {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(items[1], "offsetLeft", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(items[2], "offsetLeft", {
        value: 400,
        configurable: true,
      });

      setTimeout(() => el._handleScroll());
      const event = await oneEvent(el, "ds-carousel:scroll");
      expect(event.detail.index).to.equal(1);
    });

    it("updates indicator active state after goToSlide", async () => {
      const el = await fixture(html`
        <ds-carousel show-indicators>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </ds-carousel>
      `);

      await waitUntil(
        () => el.shadowRoot.querySelectorAll('[part="indicator"]').length === 3,
      );
      el.goToSlide(2);

      const active = el.shadowRoot.querySelector('[part="indicator"][active]');
      expect(active.dataset.index).to.equal("2");
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowRight key moves to next slide", async () => {
      const el = await fixture(twoSlides);
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      expect(el.currentIndex).to.equal(1);
    });

    it("ArrowLeft key moves to previous slide", async () => {
      const el = await fixture(twoSlides);
      el.goToSlide(1);
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      expect(el.currentIndex).to.equal(0);
    });

    it("non-navigation key does not change slide", async () => {
      const el = await fixture(twoSlides);
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      expect(el.currentIndex).to.equal(0);
    });
  });

  describe("Accessibility", () => {
    it("container uses region role with label", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container.getAttribute("role")).to.equal("region");
      expect(container.getAttribute("aria-label")).to.equal("Carousel");
    });

    it("viewport uses list role", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      const viewport = el.shadowRoot.querySelector('[part="viewport"]');
      expect(viewport.getAttribute("role")).to.equal("list");
    });

    it("navigation buttons have aria labels", async () => {
      const el = await fixture(
        html`<ds-carousel show-navigation></ds-carousel>`,
      );
      const prev = el.shadowRoot.querySelector(
        '[part="nav-button"][data-direction="prev"]',
      );
      const next = el.shadowRoot.querySelector(
        '[part="nav-button"][data-direction="next"]',
      );
      expect(prev.getAttribute("aria-label")).to.equal("Previous slide");
      expect(next.getAttribute("aria-label")).to.equal("Next slide");
    });

    it("indicators container uses tablist semantics", async () => {
      const el = await fixture(
        html`<ds-carousel show-indicators
          ><div>1</div>
          <div>2</div></ds-carousel
        >`,
      );
      const indicatorContainer = el.shadowRoot.querySelector(
        '[part="indicators"]',
      );
      expect(indicatorContainer.getAttribute("role")).to.equal("tablist");
      expect(indicatorContainer.getAttribute("aria-label")).to.equal(
        "Carousel position",
      );
    });

    it("indicator buttons expose tab role and selected state", async () => {
      const el = await fixture(html`
        <ds-carousel show-indicators>
          <div>1</div>
          <div>2</div>
        </ds-carousel>
      `);

      await waitUntil(
        () => el.shadowRoot.querySelectorAll('[part="indicator"]').length === 2,
      );

      const first = el.shadowRoot.querySelector(
        '[part="indicator"][data-index="0"]',
      );
      const second = el.shadowRoot.querySelector(
        '[part="indicator"][data-index="1"]',
      );

      expect(first.getAttribute("role")).to.equal("tab");
      expect(first.getAttribute("aria-selected")).to.equal("true");
      expect(second.getAttribute("aria-selected")).to.equal("false");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty carousel without throwing on next/previous", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      expect(() => el.next()).to.not.throw();
      expect(() => el.previous()).to.not.throw();
      expect(el.currentIndex).to.equal(0);
    });

    it("handles single-slide carousel bounds", async () => {
      const el = await fixture(
        html`<ds-carousel><div>only</div></ds-carousel>`,
      );
      el.next();
      expect(el.currentIndex).to.equal(0);
      el.previous();
      expect(el.currentIndex).to.equal(0);
    });

    it("starts and stops autoplay timer from attribute changes", async () => {
      const el = await fixture(html`<ds-carousel></ds-carousel>`);
      el.setAttribute("auto-play", "");
      expect(el._autoPlayTimer).to.not.equal(null);
      el.removeAttribute("auto-play");
      expect(el._autoPlayTimer).to.equal(null);
    });
  });
});
