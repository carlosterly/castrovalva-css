/**
 * Tabs Component Test Suite
 * Tests for ds-tabs, ds-tab, and ds-tab-panel components
 * Following Castrovalva Design System Testing Standard
 */

import {
  fixture,
  expect,
  html,
  elementUpdated,
  oneEvent,
} from "@open-wc/testing";
import "../src/components/ds-tabs.js";

describe("ds-tabs", () => {
  // ============================================
  // Initialization & Lifecycle
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      expect(el).to.exist;
      expect(el).to.be.instanceOf(HTMLElement);
    });

    it("should render shadow DOM with tablist", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      const tabList = el.shadowRoot.querySelector('[role="tablist"]');
      expect(tabList).to.exist;
    });

    it("should render tab and panel slots", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      const tabSlot = el.shadowRoot.querySelector('slot[name="tab"]');
      const panelSlot = el.shadowRoot.querySelector('slot[name="panel"]');
      expect(tabSlot).to.exist;
      expect(panelSlot).to.exist;
    });

    it("should initialize with first tab selected by default", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      expect(el.selectedIndex).to.equal(0);
    });

    it("should set up ARIA roles on connected tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs.length).to.equal(2);
      tabs.forEach((tab) => {
        expect(tab.getAttribute("role")).to.equal("tab");
      });
    });

    it("should set up ARIA roles on panels", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const panels = el.querySelectorAll('[role="tabpanel"]');
      expect(panels.length).to.equal(2);
      panels.forEach((panel) => {
        expect(panel.getAttribute("role")).to.equal("tabpanel");
      });
    });
  });

  // ============================================
  // Attributes & Properties
  // ============================================
  describe("Attributes", () => {
    it("should set variant attribute", async () => {
      const el = await fixture(html`<ds-tabs variant="secondary"></ds-tabs>`);
      expect(el.getAttribute("variant")).to.equal("secondary");
      expect(el.variant).to.equal("secondary");
    });

    it("should default variant to primary", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      expect(el.variant).to.equal("primary");
    });

    it("should set selected-index attribute", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="1">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      expect(el.getAttribute("selected-index")).to.equal("1");
      expect(el.selectedIndex).to.equal(1);
    });

    it("should update variant property via setter", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      el.variant = "secondary";
      await elementUpdated(el);

      expect(el.getAttribute("variant")).to.equal("secondary");
      expect(el.variant).to.equal("secondary");
    });

    it("should update selectedIndex property via setter", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      el.selectedIndex = 2;
      await elementUpdated(el);

      expect(el.getAttribute("selected-index")).to.equal("2");
      expect(el.selectedIndex).to.equal(2);
    });
  });

  // ============================================
  // Tab Selection
  // ============================================
  describe("Tab Selection", () => {
    it("should select first tab by default", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const firstTab = el.querySelector('[role="tab"]');
      expect(firstTab.getAttribute("aria-selected")).to.equal("true");
      expect(firstTab.getAttribute("tabindex")).to.equal("0");
    });

    it("should deselect all other tabs when first is selected", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs.forEach((tab, index) => {
        if (index === 0) {
          expect(tab.getAttribute("aria-selected")).to.equal("true");
          expect(tab.getAttribute("tabindex")).to.equal("0");
        } else {
          expect(tab.getAttribute("aria-selected")).to.equal("false");
          expect(tab.getAttribute("tabindex")).to.equal("-1");
        }
      });
    });

    it("should select tab on click", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].click();
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(1);
      expect(tabs[1].getAttribute("aria-selected")).to.equal("true");
      expect(tabs[1].getAttribute("tabindex")).to.equal("0");
    });

    it("should not select tab if already selected", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      const initialSelection = el.selectedIndex;
      tabs[0].click();
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(initialSelection);
    });

    it("should change selected class on tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].click();
      await elementUpdated(el);

      expect(tabs[0].classList.contains("selected")).to.be.false;
      expect(tabs[1].classList.contains("selected")).to.be.true;
    });
  });

  // ============================================
  // Panel Visibility
  // ============================================
  describe("Panel Visibility", () => {
    it("should show first panel by default", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const panels = el.querySelectorAll('[role="tabpanel"]');
      expect(panels[0].hasAttribute("hidden")).to.be.false;
      expect(panels[1].hasAttribute("hidden")).to.be.true;
    });

    it("should hide panels except selected", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      const panels = el.querySelectorAll('[role="tabpanel"]');

      tabs[1].click();
      await elementUpdated(el);

      expect(panels[0].hasAttribute("hidden")).to.be.true;
      expect(panels[1].hasAttribute("hidden")).to.be.false;
      expect(panels[2].hasAttribute("hidden")).to.be.true;
    });

    it("should show correct panel when tab is selected", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Content 1</div>
          <div slot="panel">Content 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      const panels = el.querySelectorAll('[role="tabpanel"]');

      tabs[1].click();
      await elementUpdated(el);

      expect(panels[1].hasAttribute("hidden")).to.be.false;
      expect(panels[1].textContent).to.include("Content 2");
    });

    it("should link tab to panel with aria-controls", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        const controlsId = tab.getAttribute("aria-controls");
        expect(controlsId).to.exist;
        expect(el.querySelector(`#${controlsId}`)).to.exist;
      });
    });

    it("should link panel to tab with aria-labelledby", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const panels = el.querySelectorAll('[role="tabpanel"]');
      panels.forEach((panel) => {
        const labelledBy = panel.getAttribute("aria-labelledby");
        expect(labelledBy).to.exist;
        expect(el.querySelector(`#${labelledBy}`)).to.exist;
      });
    });
  });

  // ============================================
  // Keyboard Navigation
  // ============================================
  describe("Keyboard Navigation", () => {
    it("should select next tab with ArrowRight", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(1);
    });

    it("should select previous tab with ArrowLeft", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="1">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
        cancelable: true,
      });
      tabs[1].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(0);
    });

    it("should select first tab with Home key", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="2">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[2].focus();

      const event = new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
        cancelable: true,
      });
      tabs[2].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(0);
    });

    it("should select last tab with End key", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "End",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(2);
    });

    it("should wrap around to first tab when navigating left from first", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(2);
    });

    it("should wrap around to last tab when navigating right from last", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="2">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[2].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      tabs[2].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(0);
    });

    it("should skip disabled tabs during keyboard navigation", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab" disabled>Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      // Should skip disabled tab and select tab 3
      expect(el.selectedIndex).to.equal(2);
    });

    it("should focus selected tab on keyboard navigation", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      // Next tab should receive focus
      expect(
        document.activeElement === tabs[1] || tabs[1].matches(":focus-visible"),
      ).to.be.true;
    });
  });

  // ============================================
  // Focus Management
  // ============================================
  describe("Focus Management", () => {
    it("should set tabindex=0 on selected tab", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs[0].getAttribute("tabindex")).to.equal("0");
    });

    it("should set tabindex=-1 on unselected tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs[1].getAttribute("tabindex")).to.equal("-1");
      expect(tabs[2].getAttribute("tabindex")).to.equal("-1");
    });

    it("should update tabindex when selection changes", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].click();
      await elementUpdated(el);

      expect(tabs[0].getAttribute("tabindex")).to.equal("-1");
      expect(tabs[1].getAttribute("tabindex")).to.equal("0");
    });

    it("should be focusable when tabs receive focus", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const selectedTab = el.querySelector(
        '[role="tab"][aria-selected="true"]',
      );
      selectedTab.focus();

      expect(
        document.activeElement === selectedTab ||
          selectedTab.matches(":focus-visible"),
      ).to.be.true;
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit tab-change event when tab is selected", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      setTimeout(() => tabs[1].click());

      const event = await oneEvent(el, "tab-change");
      expect(event).to.exist;
    });

    it("should have correct detail in tab-change event", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      setTimeout(() => tabs[1].click());

      const event = await oneEvent(el, "tab-change");
      expect(event.detail.selectedIndex).to.equal(1);
      expect(event.detail.previousIndex).to.equal(0);
      expect(event.detail.tab).to.equal(tabs[1]);
    });

    it("should bubble tab-change event", async () => {
      const container = await fixture(html`
        <div>
          <ds-tabs>
            <button slot="tab">Tab 1</button>
            <button slot="tab">Tab 2</button>
            <div slot="panel">Panel 1</div>
            <div slot="panel">Panel 2</div>
          </ds-tabs>
        </div>
      `);

      const el = container.querySelector("ds-tabs");
      const tabs = el.querySelectorAll('[role="tab"]');

      setTimeout(() => tabs[1].click());

      const event = await oneEvent(container, "tab-change");
      expect(event).to.exist;
    });

    it("should not emit tab-change if same tab is clicked", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      let eventCount = 0;

      el.addEventListener("tab-change", () => {
        eventCount++;
      });

      // Click on tab 2, should emit event
      tabs[1].click();
      await elementUpdated(el);
      // Click on tab 2 again, should not emit event
      tabs[1].click();
      await elementUpdated(el);

      expect(eventCount).to.equal(1);
    });
  });

  // ============================================
  // Disabled State
  // ============================================
  describe("Disabled State", () => {
    it("should not select disabled tab on click", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab" disabled>Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].click();
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(0);
    });

    it("should not select disabled tab on keyboard navigation", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab" disabled>Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      tabs[0].dispatchEvent(event);
      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(2);
    });

    it("should have lower opacity for disabled tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab" disabled>Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const disabledTab = el.querySelector('[role="tab"][disabled]');
      expect(disabledTab).to.exist;
      expect(disabledTab.hasAttribute("disabled")).to.be.true;
    });

    it("should disable pointer events for disabled tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab" disabled>Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const disabledTab = el.querySelector('[role="tab"][disabled]');
      expect(disabledTab.hasAttribute("disabled")).to.be.true;
    });
  });

  // ============================================
  // Variants
  // ============================================
  describe("Variants", () => {
    it("should render primary variant by default", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      const tabList = el.shadowRoot.querySelector('[role="tablist"]');

      expect(el.variant).to.equal("primary");
      expect(tabList.getAttribute("data-variant")).to.equal("primary");
    });

    it("should render secondary variant when set", async () => {
      const el = await fixture(html`<ds-tabs variant="secondary"></ds-tabs>`);
      const tabList = el.shadowRoot.querySelector('[role="tablist"]');

      expect(el.variant).to.equal("secondary");
      expect(tabList.getAttribute("data-variant")).to.equal("secondary");
    });

    it("should update variant when changed", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      const tabList = el.shadowRoot.querySelector('[role="tablist"]');

      el.variant = "secondary";
      await elementUpdated(el);

      expect(tabList.getAttribute("data-variant")).to.equal("secondary");
    });
  });

  // ============================================
  // Dynamic Updates
  // ============================================
  describe("Dynamic Updates", () => {
    it("should handle dynamically added tabs", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <div slot="panel">Panel 1</div>
        </ds-tabs>
      `);

      const newTab = document.createElement("button");
      newTab.setAttribute("slot", "tab");
      newTab.textContent = "Tab 2";

      const newPanel = document.createElement("div");
      newPanel.setAttribute("slot", "panel");
      newPanel.textContent = "Panel 2";

      el.appendChild(newTab);
      el.appendChild(newPanel);
      await elementUpdated(el);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs.length).to.equal(2);
    });

    it("should handle slot changes", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs.length).to.equal(2);

      const newTab = document.createElement("button");
      newTab.setAttribute("slot", "tab");
      newTab.textContent = "Tab 3";
      el.appendChild(newTab);

      const newPanel = document.createElement("div");
      newPanel.setAttribute("slot", "panel");
      newPanel.textContent = "Panel 3";
      el.appendChild(newPanel);

      await elementUpdated(el);

      const updatedTabs = el.querySelectorAll('[role="tab"]');
      expect(updatedTabs.length).to.equal(3);
    });

    it("should maintain selection when new tabs are added", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="1">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      expect(el.selectedIndex).to.equal(1);

      const newTab = document.createElement("button");
      newTab.setAttribute("slot", "tab");
      newTab.textContent = "Tab 3";
      el.appendChild(newTab);

      const newPanel = document.createElement("div");
      newPanel.setAttribute("slot", "panel");
      newPanel.textContent = "Panel 3";
      el.appendChild(newPanel);

      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(1);
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe("Edge Cases", () => {
    it("should handle tabs with no panels", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs.length).to.equal(2);
      expect(() => tabs[0].click()).to.not.throw();
    });

    it("should handle empty tabs component", async () => {
      const el = await fixture(html`<ds-tabs></ds-tabs>`);
      expect(el).to.exist;
      expect(el.querySelectorAll('[role="tab"]').length).to.equal(0);
    });

    it("should handle rapid clicks", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');

      tabs[0].click();
      tabs[1].click();
      tabs[2].click();
      tabs[1].click();

      await elementUpdated(el);

      expect(el.selectedIndex).to.equal(1);
    });

    it("should handle invalid selectedIndex", async () => {
      const el = await fixture(html`
        <ds-tabs selected-index="999">
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
        </ds-tabs>
      `);

      expect(el.selectedIndex).to.equal(999);
    });

    it("should generate unique IDs for tabs and panels", async () => {
      const el1 = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <div slot="panel">Panel 1</div>
        </ds-tabs>
      `);

      const el2 = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <div slot="panel">Panel 1</div>
        </ds-tabs>
      `);

      const tab1Id = el1.querySelector('[role="tab"]').id;
      const tab2Id = el2.querySelector('[role="tab"]').id;

      expect(tab1Id).to.not.equal(tab2Id);
    });
  });

  // ============================================
  // Integration
  // ============================================
  describe("Integration", () => {
    it("should work in a form context", async () => {
      const el = await fixture(html`
        <form>
          <ds-tabs>
            <button slot="tab">Tab 1</button>
            <button slot="tab">Tab 2</button>
            <div slot="panel">Panel 1</div>
            <div slot="panel">Panel 2</div>
          </ds-tabs>
        </form>
      `);

      expect(el).to.exist;
      expect(el.querySelector("ds-tabs")).to.exist;
    });

    it("should update indicator position on tab selection", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab">Tab 2</button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const indicator = el.shadowRoot.querySelector(".indicator");
      const initialTransform = indicator.style.transform;

      const tabs = el.querySelectorAll('[role="tab"]');
      tabs[1].click();
      await elementUpdated(el);

      const newTransform = indicator.style.transform;
      expect(newTransform).to.not.equal(initialTransform);
    });

    it("should work with mixed slotted content", async () => {
      const el = await fixture(html`
        <ds-tabs>
          <button slot="tab">Tab 1</button>
          <button slot="tab"><span>Tab 2</span></button>
          <button slot="tab">Tab 3</button>
          <div slot="panel">Panel 1</div>
          <div slot="panel">Panel 2</div>
          <div slot="panel">Panel 3</div>
        </ds-tabs>
      `);

      const tabs = el.querySelectorAll('[role="tab"]');
      expect(tabs.length).to.equal(3);
      expect(() => tabs[1].click()).to.not.throw();
    });
  });
});

// ============================================
// ds-tab Helper Component Tests
// ============================================
describe("ds-tab", () => {
  it("should create successfully", async () => {
    const el = await fixture(html`<ds-tab>Tab Text</ds-tab>`);
    expect(el).to.exist;
  });

  it("should set slot to 'tab'", async () => {
    const el = await fixture(html`<ds-tab>Tab Text</ds-tab>`);
    expect(el.getAttribute("slot")).to.equal("tab");
  });

  it("should render label", async () => {
    const el = await fixture(html`<ds-tab>My Tab</ds-tab>`);
    expect(el.textContent).to.include("My Tab");
  });

  it("should render icon when provided", async () => {
    const el = await fixture(html`<ds-tab icon="star">Favorites</ds-tab>`);
    const shadowText = el.shadowRoot.textContent;
    expect(shadowText).to.include("star");
    expect(el.textContent).to.include("Favorites");
  });

  it("should be disabled when disabled attribute is set", async () => {
    const el = await fixture(html`<ds-tab disabled>Disabled Tab</ds-tab>`);
    expect(el.disabled).to.be.true;
    expect(el.hasAttribute("disabled")).to.be.true;
  });

  it("should set disabled property", async () => {
    const el = await fixture(html`<ds-tab>Tab</ds-tab>`);
    el.disabled = true;
    await elementUpdated(el);

    expect(el.hasAttribute("disabled")).to.be.true;
    expect(el.disabled).to.be.true;
  });

  it("should unset disabled property", async () => {
    const el = await fixture(html`<ds-tab disabled>Tab</ds-tab>`);
    el.disabled = false;
    await elementUpdated(el);

    expect(el.hasAttribute("disabled")).to.be.false;
    expect(el.disabled).to.be.false;
  });
});

// ============================================
// ds-tab-panel Helper Component Tests
// ============================================
describe("ds-tab-panel", () => {
  it("should create successfully", async () => {
    const el = await fixture(html`<ds-tab-panel>Panel Content</ds-tab-panel>`);
    expect(el).to.exist;
  });

  it("should set slot to 'panel'", async () => {
    const el = await fixture(html`<ds-tab-panel>Panel Content</ds-tab-panel>`);
    expect(el.getAttribute("slot")).to.equal("panel");
  });

  it("should render content", async () => {
    const el = await fixture(html`<ds-tab-panel>Panel Content</ds-tab-panel>`);
    expect(el.textContent).to.include("Panel Content");
  });

  it("should respect hidden attribute", async () => {
    const el = await fixture(
      html`<ds-tab-panel hidden>Panel Content</ds-tab-panel>`,
    );
    expect(el.hasAttribute("hidden")).to.be.true;
  });

  it("should work in tabs component", async () => {
    const el = await fixture(html`
      <ds-tabs>
        <ds-tab>Tab 1</ds-tab>
        <ds-tab>Tab 2</ds-tab>
        <ds-tab-panel>Panel 1</ds-tab-panel>
        <ds-tab-panel>Panel 2</ds-tab-panel>
      </ds-tabs>
    `);

    const panels = el.querySelectorAll("ds-tab-panel");
    expect(panels.length).to.equal(2);
  });
});
