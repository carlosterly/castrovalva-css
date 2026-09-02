import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import {
  DSNavigationRail,
  DSNavigationRailItem,
} from "../src/components/navigation-rail/navigation-rail.js";

describe("DSNavigationRail", () => {
  describe("Initialization", () => {
    it("renders with default structure and navigation role", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" active
            >Home</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      expect(el).to.exist;
      const nav = el.shadowRoot.querySelector('[role="navigation"]');
      expect(nav).to.exist;
    });

    it("supports 3-7 destinations", async () => {
      const el3 = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="search"
            >Search</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="person"
            >Profile</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);
      expect(el3.querySelectorAll("ds-navigation-rail-item").length).to.equal(
        3,
      );

      const el6 = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="search"
            >Search</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="work">Work</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="event">Events</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="chat">Chat</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="person"
            >Profile</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);
      expect(el6.querySelectorAll("ds-navigation-rail-item").length).to.equal(
        6,
      );
    });
  });

  describe("Selection", () => {
    it("activates clicked item", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" active
            >Home</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="search"
            >Search</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const items = el.querySelectorAll("ds-navigation-rail-item");
      const searchItem = items[1];

      searchItem.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(searchItem.active).to.be.true;
    });

    it("deactivates other items when one is selected", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" active
            >Home</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="search"
            >Search</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="person"
            >Profile</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const items = el.querySelectorAll("ds-navigation-rail-item");
      const homeItem = items[0];
      const searchItem = items[1];

      expect(homeItem.active).to.be.true;

      searchItem.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(homeItem.active).to.be.false;
      expect(searchItem.active).to.be.true;
    });

    it("fires selection event with detail when item clicked", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" value="home"
            >Home</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="search" value="search"
            >Search</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const items = el.querySelectorAll("ds-navigation-rail-item");
      const searchItem = items[1];

      const selectPromise = oneEvent(el, "ds-navigation-rail:select");
      searchItem.click();
      const event = await selectPromise;

      expect(event.detail.value).to.equal("search");
      expect(event.detail.label).to.equal("Search");
    });

    it("does not activate disabled items", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" active
            >Home</ds-navigation-rail-item
          >
          <ds-navigation-rail-item icon="person" disabled
            >Profile</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const disabledItem = el.querySelectorAll("ds-navigation-rail-item")[1];
      disabledItem.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(disabledItem.active).to.be.false;
    });
  });

  describe("Badges and slots", () => {
    it("renders badge content when provided", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="chat" badge="7"
            >Messages</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const item = el.querySelector("ds-navigation-rail-item");
      const badge = item.shadowRoot.querySelector(".badge");
      expect(badge).to.exist;
      expect(badge.textContent.trim()).to.equal("7");
    });

    it("renders header and fab slots", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <div slot="header">HDR</div>
          <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="person"
            >Profile</ds-navigation-rail-item
          >
          <ds-fab slot="fab" icon="add"></ds-fab>
        </ds-navigation-rail>
      `);

      const header = el.querySelector('[slot="header"]');
      const fab = el.querySelector('[slot="fab"]');
      expect(header).to.exist;
      expect(fab).to.exist;
    });
  });

  describe("Lifecycle and cleanup", () => {
    it("cleans up event listeners on disconnect", async () => {
      const el = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
        </ds-navigation-rail>
      `);

      const item = el.querySelector("ds-navigation-rail-item");
      expect(el.isConnected).to.be.true;
      expect(item.isConnected).to.be.true;

      el.remove();
      expect(el.isConnected).to.be.false;
    });
  });

  describe("Programmatic attribute changes", () => {
    it("updates value dynamically", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="home" value="home"
          >Home</ds-navigation-rail-item
        >
      `);

      expect(el.value).to.equal("home");
      el.value = "homepage";
      expect(el.value).to.equal("homepage");
      expect(el.getAttribute("value")).to.equal("homepage");
    });

    it("updates icon dynamically", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
      `);

      expect(el.icon).to.equal("home");
      el.icon = "search";
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(el.icon).to.equal("search");
      const iconEl = el.shadowRoot.querySelector(".icon");
      expect(iconEl.textContent).to.equal("search");
    });

    it("updates label dynamically", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="home" label="Home Page"
          >Home</ds-navigation-rail-item
        >
      `);

      expect(el.label).to.equal("Home Page");
      el.label = "Homepage";
      expect(el.label).to.equal("Homepage");
    });

    it("toggles active state", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
      `);

      expect(el.active).to.be.false;
      el.active = true;
      expect(el.active).to.be.true;
      expect(el.hasAttribute("active")).to.be.true;

      el.active = false;
      expect(el.active).to.be.false;
      expect(el.hasAttribute("active")).to.be.false;
    });

    it("toggles disabled state", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
      `);

      expect(el.disabled).to.be.false;
      el.disabled = true;
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;

      el.disabled = false;
      expect(el.disabled).to.be.false;
      expect(el.hasAttribute("disabled")).to.be.false;
    });

    it("updates badge dynamically", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="chat">Chat</ds-navigation-rail-item>
      `);

      expect(el.badge).to.equal("");
      let badge = el.shadowRoot.querySelector(".badge");
      expect(badge).to.not.exist;

      el.badge = "5";
      await new Promise((resolve) => setTimeout(resolve, 10));

      badge = el.shadowRoot.querySelector(".badge");
      expect(badge).to.exist;
      expect(badge.textContent).to.equal("5");

      el.badge = "";
      await new Promise((resolve) => setTimeout(resolve, 10));

      badge = el.shadowRoot.querySelector(".badge");
      expect(badge).to.not.exist;
    });

    it("does not render badge for 0 value", async () => {
      const el = await fixture(html`
        <ds-navigation-rail-item icon="chat" badge="0"
          >Chat</ds-navigation-rail-item
        >
      `);

      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge).to.not.exist;
    });
  });

  describe("Edge cases", () => {
    it("uses textContent as fallback when value is not provided", async () => {
      const rail = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home">Home</ds-navigation-rail-item>
          <ds-navigation-rail-item icon="search"
            >Search</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const item = rail.querySelector("ds-navigation-rail-item");
      const selectPromise = oneEvent(rail, "ds-navigation-rail:select");
      item.click();
      const event = await selectPromise;

      expect(event.detail.value).to.equal("Home");
      expect(event.detail.label).to.equal("Home");
    });

    it("uses label attribute over textContent", async () => {
      const rail = await fixture(html`
        <ds-navigation-rail>
          <ds-navigation-rail-item icon="home" label="Home Page"
            >Home</ds-navigation-rail-item
          >
        </ds-navigation-rail>
      `);

      const item = rail.querySelector("ds-navigation-rail-item");
      const selectPromise = oneEvent(rail, "ds-navigation-rail:select");
      item.click();
      const event = await selectPromise;

      expect(event.detail.label).to.equal("Home Page");
    });
  });
});
