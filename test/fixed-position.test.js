import { fixture, html, expect } from "@open-wc/testing";
import {
  placeFixed,
  placeAnchored,
  trackViewportChanges,
} from "../src/utils/fixed-position.js";

// Guards the tooltip/menu bug where fixed overlays landed 15px right of their
// target: `scrollbar-gutter: stable both-edges` offsets the fixed containing
// block from the viewport origin. A transformed ancestor reproduces the same
// offset deterministically, without depending on the platform's scrollbars.
describe("placeFixed", () => {
  const box = "position: fixed; width: 40px; height: 20px;";

  it("places the element at the given viewport coordinates", async () => {
    const wrap = await fixture(html`<div><div style=${box}></div></div>`);
    const el = wrap.firstElementChild;

    placeFixed(el, 120, 80);

    const rect = el.getBoundingClientRect();
    expect(rect.left).to.be.closeTo(120, 0.5);
    expect(rect.top).to.be.closeTo(80, 0.5);
  });

  it("compensates for a containing block offset from the viewport", async () => {
    const wrap = await fixture(html`
      <div style="position: absolute; left: 37px; top: 23px; transform: translateZ(0);">
        <div style=${box}></div>
      </div>
    `);
    const el = wrap.firstElementChild;

    placeFixed(el, 120, 80);

    const rect = el.getBoundingClientRect();
    expect(rect.left).to.be.closeTo(120, 0.5);
    expect(rect.top).to.be.closeTo(80, 0.5);
  });

  it("positions an element that is still display: none", async () => {
    const wrap = await fixture(html`
      <div style="position: absolute; left: 37px; top: 23px; transform: translateZ(0);">
        <div style="${box} display: none;"></div>
      </div>
    `);
    const el = wrap.firstElementChild;

    placeFixed(el, 120, 80);
    el.style.display = "block";

    const rect = el.getBoundingClientRect();
    expect(rect.left).to.be.closeTo(120, 0.5);
    expect(rect.top).to.be.closeTo(80, 0.5);
  });

  it("ignores the element's own transform", async () => {
    const wrap = await fixture(html`
      <div><div style="${box} transform: translateX(-8px);"></div></div>
    `);
    const el = wrap.firstElementChild;

    placeFixed(el, 120, 80);

    expect(el.style.left).to.equal("120px");
    expect(el.style.top).to.equal("80px");
  });

  it("works inside a shadow root", async () => {
    const host = await fixture(html`<div></div>`);
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<div style="${box}"></div>`;
    const el = root.firstElementChild;

    placeFixed(el, 50, 60);

    const rect = el.getBoundingClientRect();
    expect(rect.left).to.be.closeTo(50, 0.5);
    expect(rect.top).to.be.closeTo(60, 0.5);
    expect(root.children.length).to.equal(1);
  });

  it("leaves no probe element behind", async () => {
    const wrap = await fixture(html`<div><div style=${box}></div></div>`);

    placeFixed(wrap.firstElementChild, 10, 10);

    expect(wrap.children.length).to.equal(1);
  });

  it("falls back to raw coordinates when the element is detached", () => {
    const el = document.createElement("div");

    placeFixed(el, 30, 40);

    expect(el.style.left).to.equal("30px");
    expect(el.style.top).to.equal("40px");
  });
});

describe("placeAnchored", () => {
  const popup = "position: fixed; width: 100px; height: 50px; border: 2px solid;";
  const anchorAt = (left, top, width, height) =>
    new DOMRect(left, top, width, height);
  let el;

  beforeEach(async () => {
    const wrap = await fixture(html`<div><div style=${popup}></div></div>`);
    el = wrap.firstElementChild;
  });

  it("places below the anchor, start-aligned, by default", () => {
    const used = placeAnchored(el, anchorAt(200, 100, 80, 40), { gap: 4 });
    const r = el.getBoundingClientRect();
    expect(used).to.equal("bottom");
    expect(r.left).to.be.closeTo(200, 0.5);
    expect(r.top).to.be.closeTo(144, 0.5);
  });

  it("aligns the popup's right edge to the anchor's with align: end", () => {
    placeAnchored(el, anchorAt(300, 100, 80, 40), { align: "end" });
    expect(el.getBoundingClientRect().right).to.be.closeTo(380, 0.5);
  });

  it("places above with side: top", () => {
    const used = placeAnchored(el, anchorAt(200, 300, 80, 40), {
      side: "top",
      gap: 4,
    });
    expect(used).to.equal("top");
    expect(el.getBoundingClientRect().bottom).to.be.closeTo(296, 0.5);
  });

  it("flips above when there's no room below", () => {
    const h = document.documentElement.clientHeight;
    const used = placeAnchored(el, anchorAt(200, h - 60, 80, 40));
    expect(used).to.equal("top");
    expect(el.getBoundingClientRect().bottom).to.be.closeTo(h - 60, 0.5);
  });

  it("flips below when there's no room above", () => {
    const used = placeAnchored(el, anchorAt(200, 20, 80, 40), { side: "top" });
    expect(used).to.equal("bottom");
    expect(el.getBoundingClientRect().top).to.be.closeTo(60, 0.5);
  });

  it("keeps the popup inside the viewport horizontally", () => {
    placeAnchored(el, anchorAt(10, 100, 40, 40), { align: "end" });
    expect(el.getBoundingClientRect().left).to.be.closeTo(8, 0.5);

    const w = document.documentElement.clientWidth;
    placeAnchored(el, anchorAt(w - 20, 100, 40, 40));
    expect(el.getBoundingClientRect().right).to.be.closeTo(w - 8, 0.5);
  });

  it("matches the anchor's outer width with matchWidth", () => {
    placeAnchored(el, anchorAt(100, 100, 240, 40), { matchWidth: true });
    expect(el.getBoundingClientRect().width).to.be.closeTo(240, 0.5);
  });
});

describe("trackViewportChanges", () => {
  it("calls update on resize and nested scrolls until stopped", async () => {
    const scroller = await fixture(html`
      <div style="overflow: auto; height: 50px"><div style="height: 200px"></div></div>
    `);
    let calls = 0;
    const stop = trackViewportChanges(() => calls++);

    window.dispatchEvent(new Event("resize"));
    scroller.dispatchEvent(new Event("scroll"));
    expect(calls).to.equal(2);

    stop();
    window.dispatchEvent(new Event("resize"));
    scroller.dispatchEvent(new Event("scroll"));
    expect(calls).to.equal(2);
  });
});
