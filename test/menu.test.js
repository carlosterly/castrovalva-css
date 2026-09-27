import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "../src/components/ds-menu.js";

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe("DSMenu", () => {
  describe("Initialization", () => {
    it("renders menu and item elements", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item>One</ds-menu-item>
        </ds-menu>
      `);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("starts closed by default", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      expect(el.isOpen).to.equal(false);
    });

    it("renders menu container with role menu", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      const container = el.shadowRoot.querySelector(".menu-container");
      expect(container).to.exist;
      expect(container.getAttribute("role")).to.equal("menu");
    });

    it("renders transparent backdrop element", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      const backdrop = el.shadowRoot.querySelector(".menu-backdrop");
      expect(backdrop).to.exist;
    });
  });

  describe("Attributes & Properties", () => {
    it("reads anchor attribute", async () => {
      const el = await fixture(
        html`<ds-menu anchor="anchor-button"></ds-menu>`,
      );
      expect(el.anchor).to.equal("anchor-button");
    });

    it("sets and removes anchor through property", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.anchor = "menu-anchor";
      expect(el.getAttribute("anchor")).to.equal("menu-anchor");
      el.anchor = null;
      expect(el.hasAttribute("anchor")).to.equal(false);
    });

    it("opens when open attribute is added", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.setAttribute("open", "");
      await wait(20);
      expect(el.isOpen).to.equal(true);
    });

    it("closes when open attribute is removed", async () => {
      const el = await fixture(html`<ds-menu open></ds-menu>`);
      await wait(20);
      expect(el.isOpen).to.equal(true);
      el.removeAttribute("open");
      await wait(20);
      expect(el.isOpen).to.equal(false);
    });

    it("exposes isOpen as readonly state getter", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      expect(el.isOpen).to.equal(false);
      el.open();
      expect(el.isOpen).to.equal(true);
    });
  });

  describe("Methods", () => {
    it("open() shows container and backdrop", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.open();
      await wait(20);

      const container = el.shadowRoot.querySelector(".menu-container");
      const backdrop = el.shadowRoot.querySelector(".menu-backdrop");

      expect(container.style.display).to.equal("block");
      expect(backdrop.style.display).to.equal("block");
      expect(container.classList.contains("open")).to.equal(true);
      expect(backdrop.classList.contains("open")).to.equal(true);
    });

    it("close() hides container and backdrop", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.open();
      await wait(20);
      el.close();
      await wait(220);

      const container = el.shadowRoot.querySelector(".menu-container");
      const backdrop = el.shadowRoot.querySelector(".menu-backdrop");

      expect(container.style.display).to.equal("none");
      expect(backdrop.style.display).to.equal("none");
    });

    it("toggle() opens and closes the menu", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.toggle();
      expect(el.isOpen).to.equal(true);
      el.toggle();
      expect(el.isOpen).to.equal(false);
    });

    it("getMenuItems excludes disabled and divider items", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item>One</ds-menu-item>
          <ds-menu-item disabled>Two</ds-menu-item>
          <ds-menu-item divider></ds-menu-item>
          <ds-menu-item>Three</ds-menu-item>
        </ds-menu>
      `);
      const items = el.getMenuItems();
      expect(items).to.have.lengthOf(2);
      expect(items[0].textContent.trim()).to.equal("One");
      expect(items[1].textContent.trim()).to.equal("Three");
    });

    it("selectFocusedItem clicks focused entry", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item id="item-a">One</ds-menu-item>
          <ds-menu-item id="item-b">Two</ds-menu-item>
        </ds-menu>
      `);
      let clicked = false;
      el.querySelector("#item-b").addEventListener("click", () => {
        clicked = true;
      });

      el._focusedIndex = 1;
      el.selectFocusedItem();
      expect(clicked).to.equal(true);
    });
  });

  describe("Positioning", () => {
    // Guards the bug where positionMenu() measured the container while it was
    // still display: none (0x0), so a menu near an edge never flipped.
    const cornerFixture = (style) =>
      fixture(html`
        <div>
          <button id="corner-anchor" style="position: fixed; ${style}; width: 40px; height: 40px">
            Open
          </button>
          <ds-menu anchor="corner-anchor">
            <ds-menu-item>Rename</ds-menu-item>
            <ds-menu-item>Duplicate</ds-menu-item>
            <ds-menu-item>Move to folder</ds-menu-item>
            <ds-menu-item>Delete</ds-menu-item>
          </ds-menu>
        </div>
      `);

    it("flips above an anchor at the bottom of the viewport", async () => {
      const wrapper = await cornerFixture("bottom: 8px; left: 8px");
      const menu = wrapper.querySelector("ds-menu");
      const anchor = wrapper.querySelector("#corner-anchor");
      menu.open();
      await wait(250);

      const container = menu.shadowRoot.querySelector(".menu-container");
      const menuRect = container.getBoundingClientRect();
      expect(container.classList.contains("position-above")).to.equal(true);
      expect(menuRect.bottom).to.be.at.most(anchor.getBoundingClientRect().top);
      expect(menuRect.top).to.be.at.least(0);
    });

    it("aligns to the anchor's right edge at the right of the viewport", async () => {
      const wrapper = await cornerFixture("top: 8px; right: 8px");
      const menu = wrapper.querySelector("ds-menu");
      menu.open();
      await wait(250);

      const container = menu.shadowRoot.querySelector(".menu-container");
      expect(container.classList.contains("position-left")).to.equal(true);
      expect(container.getBoundingClientRect().right).to.be.at.most(
        window.innerWidth,
      );
    });

    it("opens below an anchor with room beneath it", async () => {
      const wrapper = await cornerFixture("top: 8px; left: 8px");
      const menu = wrapper.querySelector("ds-menu");
      const anchor = wrapper.querySelector("#corner-anchor");
      menu.open();
      await wait(250);

      const container = menu.shadowRoot.querySelector(".menu-container");
      expect(container.classList.contains("position-above")).to.equal(false);
      expect(container.getBoundingClientRect().top).to.be.at.least(
        anchor.getBoundingClientRect().bottom,
      );
    });

    it("stays visible when reopened during the close transition", async () => {
      const el = await fixture(html`<ds-menu><ds-menu-item>One</ds-menu-item></ds-menu>`);
      el.open();
      await wait(20);
      el.close();
      el.open();
      await wait(250);

      const container = el.shadowRoot.querySelector(".menu-container");
      expect(el.isOpen).to.equal(true);
      expect(container.style.display).to.equal("block");
    });
  });

  describe("Events", () => {
    it("emits ds-menu:open when opened", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      setTimeout(() => el.open(), 0);
      const event = await oneEvent(el, "ds-menu:open");
      expect(event).to.exist;
    });

    it("emits ds-menu:close when closed", async () => {
      const el = await fixture(html`<ds-menu open></ds-menu>`);
      await wait(20);
      setTimeout(() => el.close(), 0);
      const event = await oneEvent(el, "ds-menu:close");
      expect(event).to.exist;
    });

    it("emits ds-menu:select with clicked item detail", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item id="pick">Pick</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);

      const item = el.querySelector("#pick");
      setTimeout(() => item.click(), 0);
      const event = await oneEvent(el, "ds-menu:select");
      expect(event.detail.item).to.equal(item);
    });

    it("does not emit select for disabled item", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item id="disabled-item" disabled>Disabled</ds-menu-item>
        </ds-menu>
      `);
      let fired = false;
      el.addEventListener("ds-menu:select", () => {
        fired = true;
      });

      el.querySelector("#disabled-item").click();
      await wait(20);
      expect(fired).to.equal(false);
    });

    it("keeps menu open for keep-open item", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item keep-open id="stay-open">Stay Open</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);
      el.querySelector("#stay-open").click();
      await wait(20);
      expect(el.isOpen).to.equal(true);
    });
  });

  describe("Keyboard", () => {
    it("ArrowDown focuses next item", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item>One</ds-menu-item>
          <ds-menu-item>Two</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
      expect(el._focusedIndex).to.equal(0);

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
      expect(el._focusedIndex).to.equal(1);
    });

    it("ArrowUp focuses previous item and wraps", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item>One</ds-menu-item>
          <ds-menu-item>Two</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
      );
      expect(el._focusedIndex).to.equal(1);
    });

    it("Enter activates focused item", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item id="keyboard-target">Run</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);
      el._focusedIndex = 0;

      let clicked = false;
      el.querySelector("#keyboard-target").addEventListener("click", () => {
        clicked = true;
      });

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      expect(clicked).to.equal(true);
    });

    it("Space activates focused item", async () => {
      const el = await fixture(html`
        <ds-menu>
          <ds-menu-item id="space-target">Run</ds-menu-item>
        </ds-menu>
      `);
      el.open();
      await wait(20);
      el._focusedIndex = 0;

      let clicked = false;
      el.querySelector("#space-target").addEventListener("click", () => {
        clicked = true;
      });

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      );
      expect(clicked).to.equal(true);
    });

    it("Escape closes open menu", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.open();
      await wait(20);
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      expect(el.isOpen).to.equal(false);
    });

    it("Tab closes open menu", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      el.open();
      await wait(20);
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
      expect(el.isOpen).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("has menu role on container", async () => {
      const el = await fixture(html`<ds-menu></ds-menu>`);
      const container = el.shadowRoot.querySelector(".menu-container");
      expect(container.getAttribute("role")).to.equal("menu");
    });

    it("sets menuitem role on ds-menu-item", async () => {
      const el = await fixture(html`<ds-menu-item>Item</ds-menu-item>`);
      expect(el.getAttribute("role")).to.equal("menuitem");
    });

    it("sets aria-disabled on disabled item", async () => {
      const el = await fixture(
        html`<ds-menu-item disabled>Item</ds-menu-item>`,
      );
      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });

    it("renders divider mode for divider attribute", async () => {
      const el = await fixture(html`<ds-menu-item divider></ds-menu-item>`);
      const divider = el.shadowRoot.querySelector(".divider");
      expect(divider).to.exist;
    });

    it("reflects selected state", async () => {
      const el = await fixture(
        html`<ds-menu-item selected>Item</ds-menu-item>`,
      );
      expect(el.hasAttribute("selected")).to.equal(true);
      const menuItem = el.shadowRoot.querySelector(".menu-item");
      expect(menuItem).to.exist;
    });
  });
});
