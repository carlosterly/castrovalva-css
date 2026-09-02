import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "../src/components/responsive-image/responsive-image.js";

const SVG_DATA =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg==";

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe("DSResponsiveImage", () => {
  describe("Initialization", () => {
    it("renders with default structure", async () => {
      const el = await fixture(
        html`<ds-responsive-image></ds-responsive-image>`,
      );
      expect(el).to.exist;
      expect(el.shadowRoot.querySelector("img")).to.exist;
    });

    it("registers custom element", async () => {
      await fixture(html`<ds-responsive-image></ds-responsive-image>`);
      expect(customElements.get("ds-responsive-image")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reads src, alt, aspect-ratio, and fit attributes", async () => {
      const el = await fixture(html`
        <ds-responsive-image
          src="${SVG_DATA}"
          alt="Example"
          aspect-ratio="16/9"
          fit="contain"></ds-responsive-image>
      `);

      expect(el.src).to.equal(SVG_DATA);
      expect(el.alt).to.equal("Example");
      expect(el.aspectRatio).to.equal("16/9");
      expect(el.fit).to.equal("contain");
    });

    it("normalizes invalid fit to cover", async () => {
      const el = await fixture(
        html`<ds-responsive-image
          src="${SVG_DATA}"
          fit="invalid"></ds-responsive-image>`,
      );

      expect(el.fit).to.equal("cover");
    });

    it("supports lazy attribute and srcset/sizes", async () => {
      const el = await fixture(html`
        <ds-responsive-image
          srcset="${SVG_DATA} 400w, ${SVG_DATA} 800w"
          sizes="(max-inline-size: 600px) 100vw, 50vw"
          lazy></ds-responsive-image>
      `);

      expect(el.lazy).to.equal(true);
      expect(el.srcset).to.contain("400w");
      expect(el.sizes).to.contain("100vw");
    });
  });

  describe("Properties", () => {
    it("sets and clears src property", async () => {
      const el = await fixture(
        html`<ds-responsive-image></ds-responsive-image>`,
      );
      el.src = SVG_DATA;
      expect(el.getAttribute("src")).to.equal(SVG_DATA);

      el.src = "";
      expect(el.hasAttribute("src")).to.equal(false);
    });

    it("sets and clears alt property", async () => {
      const el = await fixture(
        html`<ds-responsive-image></ds-responsive-image>`,
      );
      el.alt = "Alt text";
      expect(el.getAttribute("alt")).to.equal("Alt text");

      el.alt = "";
      expect(el.hasAttribute("alt")).to.equal(false);
    });

    it("updates aspectRatio and fit properties", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );

      el.aspectRatio = "4/3";
      el.fit = "fill";
      await wait();

      expect(el.aspectRatio).to.equal("4/3");
      expect(el.fit).to.equal("fill");
    });

    it("exposes loaded/error read-only states", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );

      expect(typeof el.loaded).to.equal("boolean");
      expect(typeof el.error).to.equal("boolean");
    });
  });

  describe("Events", () => {
    it("emits image-loading during load", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );

      const eventPromise = oneEvent(el, "image-loading");
      el.reload();
      const event = await eventPromise;

      expect(event.detail.src).to.equal(SVG_DATA);
    });

    it("emits image-loaded when onload is triggered", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );

      const eventPromise = oneEvent(el, "image-loaded");
      el.imageEl.onload();
      const event = await eventPromise;

      expect(event.detail.src).to.be.a("string");
      expect(el.loaded).to.equal(true);
    });

    it("emits image-error when onerror is triggered", async () => {
      const el = await fixture(
        html`<ds-responsive-image
          src="data:image/svg+xml;base64,INVALID_DATA"></ds-responsive-image>`,
      );

      const eventPromise = oneEvent(el, "image-error");
      el.imageEl.onerror();
      const event = await eventPromise;

      expect(event.detail.src).to.equal(
        "data:image/svg+xml;base64,INVALID_DATA",
      );
      expect(el.error).to.equal(true);
    });
  });

  describe("Keyboard", () => {
    it("host is not focusable by default", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );

      expect(el.hasAttribute("tabindex")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("applies alt text to shadow img", async () => {
      const el = await fixture(html`
        <ds-responsive-image
          src="${SVG_DATA}"
          alt="Photo description"></ds-responsive-image>
      `);
      const img = el.shadowRoot.querySelector("img");

      expect(img.getAttribute("alt")).to.equal("Photo description");
      expect(img.getAttribute("role")).to.equal("img");
    });

    it("keeps empty alt when alt not provided", async () => {
      const el = await fixture(
        html`<ds-responsive-image src="${SVG_DATA}"></ds-responsive-image>`,
      );
      const img = el.shadowRoot.querySelector("img");

      expect(img.getAttribute("alt")).to.equal("");
    });

    it("supports art direction source elements", async () => {
      const el = await fixture(html`
        <ds-responsive-image src="${SVG_DATA}" alt="Art directed">
          <source media="(max-inline-size: 600px)" srcset="${SVG_DATA} 1x" />
          <source media="(min-inline-size: 601px)" srcset="${SVG_DATA} 1x" />
        </ds-responsive-image>
      `);

      const sources = el.shadowRoot.querySelectorAll("picture source");
      expect(sources.length).to.equal(2);
    });
  });
});
