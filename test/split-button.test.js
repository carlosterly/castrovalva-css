/**
 * Split Button Component Test Suite
 * Tests for ds-split-button action component
 * Following Castrovalva Design System testing standards (CLAUDE.md)
 *
 * Component Type: Action (Split Button)
 * Minimum Tests: 35
 * Coverage Target: 90% statements, 85% branches, 90% functions
 */

import { fixture, expect, html, elementUpdated } from "@open-wc/testing";
import "../src/components/split-button/split-button.js";

describe("ds-split-button", () => {
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

  const basicFixture = html`
    <ds-split-button>
      Save
      <ds-menu-item slot="menu" value="save-as">Save As...</ds-menu-item>
      <ds-menu-item slot="menu" value="save-all">Save All</ds-menu-item>
    </ds-split-button>
  `;

  const positionedFixture = html`
    <ds-split-button position="top-start">
      More
      <ds-menu-item slot="menu" value="edit">Edit</ds-menu-item>
    </ds-split-button>
  `;

  // ============================================
  // Initialization
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el).to.exist;
      expect(el.tagName.toLowerCase()).to.equal("ds-split-button");
    });

    it("should render shadow DOM", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el.shadowRoot).to.exist;
    });

    it("should set default variant to filled", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el.variant).to.equal("filled");
    });

    it("should set default position to bottom-end", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el.position).to.equal("bottom-end");
    });

    it("should not be disabled by default", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el.disabled).to.be.false;
    });

    it("should render buttons and menu container", async () => {
      const el = await fixture(basicFixture);
      const primary = el.shadowRoot.querySelector(".primary-button");
      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      expect(primary).to.exist;
      expect(menuBtn).to.exist;
      expect(menu).to.exist;
    });

    it("should default menu state to closed", async () => {
      const el = await fixture(basicFixture);
      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      expect(menuBtn.getAttribute("aria-expanded")).to.equal("false");
      expect(menu.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  // ============================================
  // Attributes
  // ============================================
  describe("Attributes", () => {
    it("should accept variant attribute", async () => {
      const el = await fixture(
        html`<ds-split-button variant="outlined"></ds-split-button>`,
      );
      expect(el.variant).to.equal("outlined");
    });

    it("should accept position attribute", async () => {
      const el = await fixture(
        html`<ds-split-button position="top-end"></ds-split-button>`,
      );
      expect(el.position).to.equal("top-end");
    });

    it("should accept disabled attribute", async () => {
      const el = await fixture(
        html`<ds-split-button disabled></ds-split-button>`,
      );
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should update variant when attribute changes", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      el.setAttribute("variant", "text");
      await elementUpdated(el);
      expect(el.variant).to.equal("text");
    });

    it("should update position when attribute changes", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      el.setAttribute("position", "bottom-start");
      await elementUpdated(el);
      expect(el.position).to.equal("bottom-start");
    });
  });

  // ============================================
  // Properties
  // ============================================
  describe("Properties", () => {
    it("should reflect variant property to attribute", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      el.variant = "filled-tonal";
      await elementUpdated(el);
      expect(el.getAttribute("variant")).to.equal("filled-tonal");
    });

    it("should reflect position property to attribute", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      el.position = "top-start";
      await elementUpdated(el);
      expect(el.getAttribute("position")).to.equal("top-start");
    });

    it("should reflect disabled property to attribute", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      el.disabled = true;
      await elementUpdated(el);
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("should remove disabled attribute when set to false", async () => {
      const el = await fixture(
        html`<ds-split-button disabled></ds-split-button>`,
      );
      el.disabled = false;
      await elementUpdated(el);
      expect(el.hasAttribute("disabled")).to.be.false;
    });
  });

  // ============================================
  // Methods
  // ============================================
  describe("Methods", () => {
    it("should expose openMenu and closeMenu methods", async () => {
      const el = await fixture(html`<ds-split-button></ds-split-button>`);
      expect(el.openMenu).to.be.a("function");
      expect(el.closeMenu).to.be.a("function");
    });

    it("should open menu via openMenu()", async () => {
      const el = await fixture(basicFixture);
      el.openMenu();
      await tick();
      await tick();

      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      expect(menuBtn.getAttribute("aria-expanded")).to.equal("true");
      expect(menu.getAttribute("aria-hidden")).to.equal("false");

      el.closeMenu();
    });

    it("should close menu via closeMenu()", async () => {
      const el = await fixture(basicFixture);
      el.openMenu();
      el.closeMenu();
      await tick();

      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      expect(menuBtn.getAttribute("aria-expanded")).to.equal("false");
      expect(menu.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  // ============================================
  // Slots
  // ============================================
  describe("Slots", () => {
    it("should render default slot content", async () => {
      const el = await fixture(basicFixture);
      const defaultSlot = el.shadowRoot.querySelector("slot");
      const assigned = defaultSlot.assignedNodes({ flatten: true });

      expect(assigned.some((node) => node.textContent.includes("Save"))).to.be
        .true;
    });

    it("should render menu slot content", async () => {
      const el = await fixture(basicFixture);
      const menuSlot = el.shadowRoot.querySelector('slot[name="menu"]');
      const assigned = menuSlot.assignedElements();

      expect(assigned.length).to.equal(2);
    });

    it("should update menu slot when items are added", async () => {
      const el = await fixture(basicFixture);
      const menuSlot = el.shadowRoot.querySelector('slot[name="menu"]');

      const newItem = document.createElement("ds-menu-item");
      newItem.setAttribute("slot", "menu");
      newItem.textContent = "Save Copy";
      el.appendChild(newItem);

      await elementUpdated(el);
      const assigned = menuSlot.assignedElements();
      expect(assigned.length).to.equal(3);
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit ds-split-button:click on primary button click", async () => {
      const el = await fixture(basicFixture);
      await tick();

      let detail = null;
      el.addEventListener("ds-split-button:click", (e) => {
        detail = e.detail;
      });

      const primary = el.shadowRoot.querySelector(".primary-button");
      primary.click();
      await tick();

      expect(detail).to.exist;
      expect(detail).to.have.property("originalEvent");
    });

    it("should emit ds-split-button:menu-select on menu item click", async () => {
      const el = await fixture(basicFixture);
      await tick();

      let detail = null;
      el.addEventListener("ds-split-button:menu-select", (e) => {
        detail = e.detail;
      });

      const menuItem = el.querySelector('ds-menu-item[value="save-as"]');
      menuItem.click();
      await tick();

      expect(detail.value).to.equal("save-as");
      expect(detail.label).to.equal("Save As...");
      expect(detail.item).to.equal(menuItem);
    });
  });

  // ============================================
  // Interactions
  // ============================================
  describe("Interactions", () => {
    it("should toggle menu open and closed via menu button", async () => {
      const el = await fixture(basicFixture);
      await tick();

      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      menuBtn.click();
      await tick();
      await tick();
      expect(menuBtn.getAttribute("aria-expanded")).to.equal("true");
      expect(menu.getAttribute("aria-hidden")).to.equal("false");

      menuBtn.click();
      await tick();
      expect(menuBtn.getAttribute("aria-expanded")).to.equal("false");
      expect(menu.getAttribute("aria-hidden")).to.equal("true");
    });

    it("should close menu when clicking outside", async () => {
      const el = await fixture(basicFixture);
      await tick();

      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      menuBtn.click();
      await tick();
      await tick();
      expect(menu.getAttribute("aria-hidden")).to.equal("false");

      document.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await tick();

      expect(menu.getAttribute("aria-hidden")).to.equal("true");
    });

    it("should not open menu when disabled", async () => {
      const el = await fixture(
        html`<ds-split-button disabled></ds-split-button>`,
      );
      await tick();

      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      const menu = el.shadowRoot.querySelector(".menu");

      menuBtn.click();
      await tick();

      expect(menuBtn.getAttribute("aria-expanded")).to.equal("false");
      expect(menu.getAttribute("aria-hidden")).to.equal("true");
    });

    it("should not emit click event when disabled", async () => {
      const el = await fixture(
        html`<ds-split-button disabled>Save</ds-split-button>`,
      );
      await tick();

      let fired = false;
      el.addEventListener("ds-split-button:click", () => {
        fired = true;
      });

      const primary = el.shadowRoot.querySelector(".primary-button");
      primary.click();
      await tick();

      expect(fired).to.be.false;
    });
  });

  // ============================================
  // ARIA & Accessibility
  // ============================================
  describe("ARIA Attributes", () => {
    it("should set aria-haspopup on menu button", async () => {
      const el = await fixture(basicFixture);
      const menuBtn = el.shadowRoot.querySelector(".menu-button");
      expect(menuBtn.getAttribute("aria-haspopup")).to.equal("true");
    });

    it("should set role=menu on menu container", async () => {
      const el = await fixture(basicFixture);
      const menu = el.shadowRoot.querySelector(".menu");
      expect(menu.getAttribute("role")).to.equal("menu");
    });

    it("should expose aria-labels for both buttons", async () => {
      const el = await fixture(basicFixture);
      const primary = el.shadowRoot.querySelector(".primary-button");
      const menuBtn = el.shadowRoot.querySelector(".menu-button");

      expect(primary.getAttribute("aria-label")).to.equal("Primary action");
      expect(menuBtn.getAttribute("aria-label")).to.equal("More actions");
    });
  });

  // ============================================
  // Rendering & Classes
  // ============================================
  describe("Rendering", () => {
    it("should apply variant and position classes", async () => {
      const el = await fixture(positionedFixture);
      const container = el.shadowRoot.querySelector(".split-button");

      expect(container.classList.contains("variant-filled")).to.be.true;
      expect(container.classList.contains("position-top-start")).to.be.true;
    });

    it("should apply outlined variant class", async () => {
      const el = await fixture(
        html`<ds-split-button variant="outlined"></ds-split-button>`,
      );
      const container = el.shadowRoot.querySelector(".split-button");

      expect(container.classList.contains("variant-outlined")).to.be.true;
    });
  });
});
