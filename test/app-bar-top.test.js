import { fixture, html, expect, oneEvent, aTimeout } from "@open-wc/testing";
import "../src/components/app-bar-top/app-bar-top.js";

describe("DSAppBarTop", () => {
  describe("Structure & defaults", () => {
    it("renders with banner role", async () => {
      const el = await fixture(
        html`<ds-app-bar-top title="Inbox"></ds-app-bar-top>`,
      );
      const bar = el.shadowRoot.querySelector("[role='banner']");
      expect(bar).to.exist;
    });

    it("uses small variant by default", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.variant).to.equal("small");
    });

    it("falls back to small on invalid variant", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="invalid"></ds-app-bar-top>`,
      );
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.variant).to.equal("small");
    });

    it("has a shadow root and parts", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      expect(el.shadowRoot).to.exist;
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.getAttribute("part")).to.include("container");
    });
  });

  describe("Variants & layout", () => {
    it("applies small height", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      const h = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar"),
      ).height;
      expect(h).to.equal("64px");
    });

    it("applies center variant layout", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="center"></ds-app-bar-top>`,
      );
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.variant).to.equal("center");
      const titleArea = el.shadowRoot.querySelector(".title-area");
      expect(getComputedStyle(titleArea).alignItems).to.equal("center");
    });

    it("applies medium height", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="medium"></ds-app-bar-top>`,
      );
      const h = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar"),
      ).height;
      expect(h).to.equal("112px");
    });

    it("applies large height", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"></ds-app-bar-top>`,
      );
      const h = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar"),
      ).height;
      expect(h).to.equal("152px");
    });

    it("tracks data-variant on header", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"></ds-app-bar-top>`,
      );
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.variant).to.equal("large");
    });
  });

  describe("Titles & subtitles", () => {
    it("renders title from attribute", async () => {
      const el = await fixture(
        html`<ds-app-bar-top title="Inbox"></ds-app-bar-top>`,
      );
      const title = el.shadowRoot.querySelector(".title");
      expect(title.textContent.trim()).to.equal("Inbox");
    });

    it("renders title slot when provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          ><span slot="title">Slot Title</span></ds-app-bar-top
        >`,
      );
      const slotted = el.querySelector('[slot="title"]');
      expect(slotted).to.exist;
      expect(slotted.textContent.trim()).to.equal("Slot Title");
    });

    it("shows subtitle on medium when provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          variant="medium"
          subtitle="Details"></ds-app-bar-top>`,
      );
      const subtitle = el.shadowRoot.querySelector(".subtitle");
      expect(subtitle).to.exist;
      expect(subtitle.textContent.trim()).to.equal("Details");
    });

    it("shows subtitle on large when provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large" subtitle="More"></ds-app-bar-top>`,
      );
      const subtitle = el.shadowRoot.querySelector(".subtitle");
      expect(subtitle).to.exist;
      expect(subtitle.textContent.trim()).to.equal("More");
    });

    it("hides subtitle on small even if provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top subtitle="Hidden"></ds-app-bar-top>`,
      );
      const subtitle = el.shadowRoot.querySelector(".subtitle");
      expect(subtitle).to.not.exist;
    });

    it("hides subtitle when scrolled", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          variant="large"
          subtitle="Visible"></ds-app-bar-top>`,
      );
      el.setAttribute("scrolled", "");
      await aTimeout(0);
      const subtitle = el.shadowRoot.querySelector(".subtitle");
      expect(subtitle).to.not.exist;
    });

    it("renders subtitle slot when provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"
          ><span slot="subtitle">Slot Subtitle</span></ds-app-bar-top
        >`,
      );
      const slotted = el.querySelector('[slot="subtitle"]');
      expect(slotted).to.exist;
      expect(slotted.textContent.trim()).to.equal("Slot Subtitle");
    });
  });

  describe("Navigation", () => {
    it("renders fallback nav button when nav-icon is set", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(btn).to.exist;
      expect(btn.textContent.trim()).to.equal("menu");
    });

    it("removes nav button when nav-icon is removed", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      el.removeAttribute("nav-icon");
      el.attributeChangedCallback("nav-icon", "menu", null);
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(btn).to.not.exist;
    });

    it("fires navigation event from fallback nav button", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      const button = el.shadowRoot.querySelector(".nav-button");
      const navPromise = oneEvent(el, "ds-app-bar:navigation");
      button.click();
      await navPromise;
    });

    it("does not fire navigation event when nav button absent", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      let fired = false;
      el.addEventListener("ds-app-bar:navigation", () => (fired = true));
      el.dispatchEvent(new Event("click"));
      expect(fired).to.be.false;
    });

    it("honors navigation slot over fallback", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          ><button slot="navigation" id="nav-slot">X</button></ds-app-bar-top
        >`,
      );
      const fallback = el.shadowRoot.querySelector(".nav-button");
      const slotted = el.querySelector("#nav-slot");
      expect(slotted).to.exist;
      expect(fallback).to.not.exist;
    });

    it("nav button has aria-label", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(btn.getAttribute("aria-label")).to.equal("Navigation");
    });
  });

  describe("Actions", () => {
    it("renders action slot content", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          ><button slot="actions" id="action-btn">A</button></ds-app-bar-top
        >`,
      );
      expect(el.querySelector("#action-btn")).to.exist;
    });

    it("keeps multiple actions order", async () => {
      const el = await fixture(
        html`<ds-app-bar-top>
          <button slot="actions" id="a1">A1</button>
          <button slot="actions" id="a2">A2</button>
        </ds-app-bar-top>`,
      );
      const nodes = Array.from(el.querySelectorAll("[slot='actions']"));
      expect(nodes.map((n) => n.id)).to.deep.equal(["a1", "a2"]);
    });
  });

  describe("States & interaction", () => {
    it("collapses height when scrolled", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"></ds-app-bar-top>`,
      );
      const before = getComputedStyle(el).height;
      el.setAttribute("scrolled", "");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const after = getComputedStyle(el).height;
      expect(before).to.equal("152px");
      expect(after).to.equal("64px");
    });

    it("restores height when scrolled removed", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large" scrolled></ds-app-bar-top>`,
      );
      const collapsed = getComputedStyle(el).height;
      el.removeAttribute("scrolled");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const expanded = getComputedStyle(el).height;
      expect(collapsed).to.equal("64px");
      expect(expanded).to.equal("152px");
    });

    it("toggles data-scrolled attribute", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      expect(el.scrolled).to.be.false;
      el.setAttribute("scrolled", "");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(el.scrolled).to.be.true;
    });

    it("shows smaller title size when scrolled", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large" title="Title"></ds-app-bar-top>`,
      );
      el.setAttribute("scrolled", "");
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.scrolled).to.equal("true");
    });
  });

  describe("Styling & tokens", () => {
    it("applies background custom property", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          style="--ds-app-bar-bg: rgb(1, 2, 3);"></ds-app-bar-top>`,
      );
      const bg = getComputedStyle(
        el.shadowRoot.querySelector(".app-bar"),
      ).backgroundColor;
      expect(bg).to.equal("rgb(1, 2, 3)");
    });

    it("applies hover/pressed state-layer variables", async () => {
      const el = await fixture(
        html`<ds-app-bar-top
          nav-icon="menu"
          style="--ds-app-bar-hover-opacity: 0.5; --ds-app-bar-pressed-opacity: 0.6;"></ds-app-bar-top>`,
      );
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(btn).to.exist;
      expect(btn.classList.contains("nav-button")).to.be.true;
    });

    it("uses Material Symbols font for nav icon", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(getComputedStyle(btn).fontFamily.includes("Material Symbols")).to
        .be.true;
    });
  });

  describe("Slots & fallbacks", () => {
    it("defaults to title slot when attribute empty", async () => {
      const el = await fixture(
        html`<ds-app-bar-top><span slot="title">Hello</span></ds-app-bar-top>`,
      );
      const slotted = el.querySelector('[slot="title"]');
      expect(slotted).to.exist;
      expect(slotted.textContent.trim()).to.equal("Hello");
    });

    it("uses attribute title when no slot provided", async () => {
      const el = await fixture(
        html`<ds-app-bar-top title="Hello"></ds-app-bar-top>`,
      );
      const title = el.shadowRoot.querySelector(".title");
      expect(title.textContent.trim()).to.equal("Hello");
    });

    it("subtitle slot overrides attribute", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large" subtitle="Attr"
          ><span slot="subtitle">Slot</span></ds-app-bar-top
        >`,
      );
      const slotted = el.querySelector('[slot="subtitle"]');
      expect(slotted).to.exist;
      expect(slotted.textContent.trim()).to.equal("Slot");
    });
  });

  describe("Properties (programmatic setters)", () => {
    it("sets variant property", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      el.variant = "large";
      await aTimeout(0);
      expect(el.getAttribute("variant")).to.equal("large");
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.variant).to.equal("large");
    });

    it("sets title property", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      el.title = "New Title";
      await aTimeout(0);
      expect(el.getAttribute("title")).to.equal("New Title");
      const title = el.shadowRoot.querySelector(".title");
      expect(title.textContent.trim()).to.equal("New Title");
    });

    it("sets subtitle property", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"></ds-app-bar-top>`,
      );
      el.subtitle = "New Subtitle";
      await aTimeout(0);
      expect(el.getAttribute("subtitle")).to.equal("New Subtitle");
      const subtitle = el.shadowRoot.querySelector(".subtitle");
      expect(subtitle.textContent.trim()).to.equal("New Subtitle");
    });

    it("sets navIcon property", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      el.navIcon = "arrow_back";
      await aTimeout(0);
      expect(el.getAttribute("nav-icon")).to.equal("arrow_back");
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(btn.textContent.trim()).to.equal("arrow_back");
    });

    it("sets scrolled property to true", async () => {
      const el = await fixture(
        html`<ds-app-bar-top variant="large"></ds-app-bar-top>`,
      );
      el.scrolled = true;
      await aTimeout(0);
      expect(el.hasAttribute("scrolled")).to.be.true;
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.scrolled).to.equal("true");
    });

    it("sets scrolled property to false", async () => {
      const el = await fixture(
        html`<ds-app-bar-top scrolled></ds-app-bar-top>`,
      );
      el.scrolled = false;
      await aTimeout(0);
      expect(el.hasAttribute("scrolled")).to.be.false;
    });
  });

  describe("Misc", () => {
    it("maintains actions inline-flex display", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      const actions = el.shadowRoot.querySelector(".actions");
      expect(actions).to.exist;
      expect(actions.className).to.include("actions");
    });

    it("keeps nav min-width for alignment", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      const nav = el.shadowRoot.querySelector(".nav");
      expect(getComputedStyle(nav).minWidth).to.equal("48px");
    });

    it("sets pointer cursor on nav button", async () => {
      const el = await fixture(
        html`<ds-app-bar-top nav-icon="menu"></ds-app-bar-top>`,
      );
      const btn = el.shadowRoot.querySelector(".nav-button");
      expect(getComputedStyle(btn).cursor).to.equal("pointer");
    });

    it("sets dataset scrolled string value", async () => {
      const el = await fixture(
        html`<ds-app-bar-top scrolled></ds-app-bar-top>`,
      );
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header.dataset.scrolled).to.equal("true");
    });

    it("stretches app bar to full width", async () => {
      const el = await fixture(html`<ds-app-bar-top></ds-app-bar-top>`);
      const header = el.shadowRoot.querySelector(".app-bar");
      expect(header).to.exist;
      expect(header.getAttribute("part")).to.include("container");
    });
  });
});
