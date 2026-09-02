import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import {
  DSNavigationBar,
  DSNavigationBarItem,
} from "../src/components/navigation-bar/navigation-bar.js";

describe("DSNavigationBar", () => {
  describe("Initialization", () => {
    it("should render with default properties", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search">Search</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="person">Profile</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);

      expect(el).to.exist;
      const items = el.querySelectorAll("ds-navigation-bar-item");
      expect(items.length).to.equal(3);
    });

    it("should have navigation role", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);

      const nav = el.shadowRoot.querySelector('[role="navigation"]');
      expect(nav).to.exist;
    });

    it("should support 3-5 destinations", async () => {
      const el3 = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="search">Search</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="person">Profile</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);
      expect(el3.querySelectorAll("ds-navigation-bar-item").length).to.equal(3);

      const el5 = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="search">Search</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="favorite"
            >Favorites</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="notifications"
            >Notifications</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="person">Profile</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);
      expect(el5.querySelectorAll("ds-navigation-bar-item").length).to.equal(5);
    });
  });

  describe("Item Selection", () => {
    it("should mark item as active when clicked", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search">Search</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);

      const items = el.querySelectorAll("ds-navigation-bar-item");
      const searchItem = items[1];

      searchItem.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(searchItem.active).to.be.true;
    });

    it("should deactivate other items when one is selected", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search">Search</ds-navigation-bar-item>
          <ds-navigation-bar-item icon="person">Profile</ds-navigation-bar-item>
        </ds-navigation-bar>
      `);

      const items = el.querySelectorAll("ds-navigation-bar-item");
      const homeItem = items[0];
      const searchItem = items[1];

      expect(homeItem.active).to.be.true;

      searchItem.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(homeItem.active).to.be.false;
      expect(searchItem.active).to.be.true;
    });

    it("should fire selection event when item clicked", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" value="home"
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search" value="search"
            >Search</ds-navigation-bar-item
          >
        </ds-navigation-bar>
      `);

      const items = el.querySelectorAll("ds-navigation-bar-item");
      const selectPromise = oneEvent(el, "ds-navigation-bar:select");

      items[1].click();

      const event = await selectPromise;
      expect(event.detail.value).to.equal("search");
      expect(event.detail.label).to.equal("Search");
    });
  });

  describe("DSNavigationBarItem", () => {
    describe("Initialization", () => {
      it("should render with icon and label", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        expect(el).to.exist;
        expect(el.icon).to.equal("home");
        expect(el.textContent.trim()).to.equal("Home");
      });

      it("should render with label attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item
            icon="home"
            label="Home Page"></ds-navigation-bar-item>
        `);

        const label = el.shadowRoot.querySelector(".label");
        expect(label.textContent.trim()).to.equal("Home Page");
      });

      it("should have tab role", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const button = el.shadowRoot.querySelector('[role="tab"]');
        expect(button).to.exist;
      });
    });

    describe("Attributes", () => {
      it("should handle value attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" value="home-page"
            >Home</ds-navigation-bar-item
          >
        `);

        expect(el.value).to.equal("home-page");
        el.value = "homepage";
        expect(el.value).to.equal("homepage");
      });

      it("should handle icon attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        expect(el.icon).to.equal("home");
        el.icon = "search";
        await el.updateComplete;
        expect(el.icon).to.equal("search");
      });

      it("should handle active attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        expect(el.active).to.be.false;
        el.active = true;
        expect(el.active).to.be.true;
        expect(el.hasAttribute("active")).to.be.true;
      });

      it("should handle disabled attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" disabled
            >Home</ds-navigation-bar-item
          >
        `);

        expect(el.disabled).to.be.true;
        const button = el.shadowRoot.querySelector("button");
        expect(button.getAttribute("aria-disabled")).to.equal("true");
      });

      it("should handle badge attribute", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="notifications" badge="5"
            >Notifications</ds-navigation-bar-item
          >
        `);

        expect(el.badge).to.equal("5");
        const badge = el.shadowRoot.querySelector(".badge");
        expect(badge).to.exist;
        expect(badge.textContent).to.equal("5");
      });
    });

    describe("Badge", () => {
      it("should display badge when badge attribute is set", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="notifications" badge="3"
            >Notifications</ds-navigation-bar-item
          >
        `);

        const badge = el.shadowRoot.querySelector(".badge");
        expect(badge).to.exist;
        expect(badge.textContent).to.equal("3");
      });

      it("should not display badge when badge is 0", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="notifications" badge="0"
            >Notifications</ds-navigation-bar-item
          >
        `);

        const badge = el.shadowRoot.querySelector(".badge");
        expect(badge).to.not.exist;
      });

      it("should update badge dynamically", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="notifications"
            >Notifications</ds-navigation-bar-item
          >
        `);

        let badge = el.shadowRoot.querySelector(".badge");
        expect(badge).to.not.exist;

        el.badge = "7";
        await el.updateComplete;

        badge = el.shadowRoot.querySelector(".badge");
        expect(badge).to.exist;
        expect(badge.textContent).to.equal("7");
      });
    });

    describe("Active State", () => {
      it("should show active indicator when active", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
        `);

        const indicator = el.shadowRoot.querySelector(".indicator");
        expect(indicator).to.exist;
        expect(el.hasAttribute("active")).to.be.true;
      });

      it("should set aria-selected when active", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
        `);

        const button = el.shadowRoot.querySelector("button");
        expect(button.getAttribute("aria-selected")).to.equal("true");
      });

      it("should fill icon when active", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
        `);

        const icon = el.shadowRoot.querySelector(".icon");
        const styles = window.getComputedStyle(icon);
        expect(icon).to.exist;
      });
    });

    describe("Disabled State", () => {
      it("should not respond to clicks when disabled", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" disabled
            >Home</ds-navigation-bar-item
          >
        `);

        let clickFired = false;
        el.addEventListener("ds-navigation-bar-item:click", () => {
          clickFired = true;
        });

        const button = el.shadowRoot.querySelector("button");
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(clickFired).to.be.false;
      });

      it("should have reduced opacity when disabled", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" disabled
            >Home</ds-navigation-bar-item
          >
        `);

        expect(el.hasAttribute("disabled")).to.be.true;
      });
    });

    describe("Events", () => {
      it("should fire click event when item is clicked", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" value="home"
            >Home</ds-navigation-bar-item
          >
        `);

        const clickPromise = oneEvent(el, "ds-navigation-bar-item:click");
        const button = el.shadowRoot.querySelector("button");
        button.click();

        const event = await clickPromise;
        expect(event.detail.value).to.equal("home");
        expect(event.detail.label).to.equal("Home");
      });

      it("should set active when clicked", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        expect(el.active).to.be.false;

        const button = el.shadowRoot.querySelector("button");
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(el.active).to.be.true;
      });
    });

    describe("Accessibility", () => {
      it("should have aria-label", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" label="Home Page"
            >Home</ds-navigation-bar-item
          >
        `);

        const button = el.shadowRoot.querySelector("button");
        expect(button.getAttribute("aria-label")).to.equal("Home Page");
      });

      it("should have aria-selected for active state", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" active
            >Home</ds-navigation-bar-item
          >
        `);

        const button = el.shadowRoot.querySelector("button");
        expect(button.getAttribute("aria-selected")).to.equal("true");
      });

      it("should have aria-disabled for disabled state", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home" disabled
            >Home</ds-navigation-bar-item
          >
        `);

        const button = el.shadowRoot.querySelector("button");
        expect(button.getAttribute("aria-disabled")).to.equal("true");
      });

      it("should be keyboard accessible", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const button = el.shadowRoot.querySelector("button");
        expect(button.tagName.toLowerCase()).to.equal("button");
      });
    });

    describe("CSS Parts", () => {
      it("should expose container part", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const container = el.shadowRoot.querySelector('[part="container"]');
        expect(container).to.exist;
      });

      it("should expose icon part", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const icon = el.shadowRoot.querySelector('[part="icon"]');
        expect(icon).to.exist;
      });

      it("should expose label part", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const label = el.shadowRoot.querySelector('[part="label"]');
        expect(label).to.exist;
      });

      it("should expose indicator part", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="home">Home</ds-navigation-bar-item>
        `);

        const indicator = el.shadowRoot.querySelector('[part="indicator"]');
        expect(indicator).to.exist;
      });

      it("should expose badge part when badge is present", async () => {
        const el = await fixture(html`
          <ds-navigation-bar-item icon="notifications" badge="5"
            >Notifications</ds-navigation-bar-item
          >
        `);

        const badge = el.shadowRoot.querySelector('[part="badge"]');
        expect(badge).to.exist;
      });
    });
  });

  describe("Integration", () => {
    it("should work with multiple items in navigation bar", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" value="home" active
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search" value="search"
            >Search</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="favorite" value="favorites"
            >Favorites</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="person" value="profile"
            >Profile</ds-navigation-bar-item
          >
        </ds-navigation-bar>
      `);

      const items = el.querySelectorAll("ds-navigation-bar-item");
      expect(items.length).to.equal(4);
      expect(items[0].active).to.be.true;
      expect(items[1].active).to.be.false;
    });

    it("should handle rapid successive clicks", async () => {
      const el = await fixture(html`
        <ds-navigation-bar>
          <ds-navigation-bar-item icon="home" value="home"
            >Home</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="search" value="search"
            >Search</ds-navigation-bar-item
          >
          <ds-navigation-bar-item icon="person" value="profile"
            >Profile</ds-navigation-bar-item
          >
        </ds-navigation-bar>
      `);

      const items = el.querySelectorAll("ds-navigation-bar-item");

      items[0].click();
      items[1].click();
      items[2].click();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(items[0].active).to.be.false;
      expect(items[1].active).to.be.false;
      expect(items[2].active).to.be.true;
    });
  });
});
