import { fixture, html, expect } from "@open-wc/testing";
import { placeFixed } from "../src/utils/fixed-position.js";

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
