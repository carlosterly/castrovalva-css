import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/search-view/search-view.js";

describe("DSSearchView", () => {
  describe("Rendering", () => {
    it("should render closed by default", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);

      expect(el).to.exist;
      expect(el.open).to.be.false;
    });

    it("should render open when open attribute is set", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      expect(el.open).to.be.true;
    });

    it("should render with initial search value", async () => {
      const el = await fixture(
        html`<ds-search-view open value="test"></ds-search-view>`,
      );

      expect(el.value).to.equal("test");
    });

    it("should have shadow DOM elements", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const header = el.shadowRoot.querySelector(".search-header");
      const content = el.shadowRoot.querySelector(".search-content");
      const input = el.shadowRoot.querySelector(".search-input");

      expect(header).to.exist;
      expect(content).to.exist;
      expect(input).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reflects open attribute to open property", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);
      el.setAttribute("open", "");
      expect(el.open).to.equal(true);
    });

    it("reflects value attribute to value property", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);
      el.setAttribute("value", "camera");
      expect(el.value).to.equal("camera");
    });
  });

  describe("Properties", () => {
    it("should get and set open property", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);

      el.open = true;

      expect(el.open).to.be.true;
      expect(el.hasAttribute("open")).to.be.true;
    });

    it("should get and set value property", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);

      el.value = "search term";

      expect(el.value).to.equal("search term");
      expect(el.getAttribute("value")).to.equal("search term");
    });

    it("should get and set suggestions", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const suggestions = ["apple", "banana", "cherry"];
      el.suggestions = suggestions;

      expect(el.suggestions).to.deep.equal(suggestions);
    });

    it("should get and set filters", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const filters = ["Images", "Videos", "News"];
      el.filters = filters;

      expect(el.filters).to.deep.equal(filters);
    });

    it("should get and set recent searches", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const recent = ["recent 1", "recent 2"];
      el.recentSearches = recent;

      expect(el.recentSearches).to.deep.equal(recent);
    });
  });

  describe("Search Functionality", () => {
    it("should perform search and emit event", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let eventData = null;
      el.addEventListener("ds-search-view:search", (e) => {
        eventData = e.detail;
      });

      el.performSearch("test query");

      expect(eventData).to.exist;
      expect(eventData.query).to.equal("test query");
    });

    it("should not perform empty search", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let eventFired = false;
      el.addEventListener("ds-search-view:search", () => {
        eventFired = true;
      });

      el.performSearch("");
      el.performSearch("   ");

      expect(eventFired).to.be.false;
    });

    it("should add search to recent searches", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.performSearch("first search");
      el.performSearch("second search");

      expect(el.recentSearches[0]).to.equal("second search");
      expect(el.recentSearches[1]).to.equal("first search");
    });

    it("should not duplicate recent searches", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.performSearch("query");
      el.performSearch("other");
      el.performSearch("query");

      expect(el.recentSearches[0]).to.equal("query");
      expect(el.recentSearches.filter((s) => s === "query").length).to.equal(1);
    });

    it("should limit recent searches to 10", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      for (let i = 1; i <= 15; i++) {
        el.performSearch(`search ${i}`);
      }

      expect(el.recentSearches.length).to.equal(10);
      expect(el.recentSearches[0]).to.equal("search 15");
    });
  });

  describe("Recent Searches", () => {
    it("should clear recent searches", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.performSearch("search 1");
      el.performSearch("search 2");
      expect(el.recentSearches.length).to.be.greaterThan(0);

      el.clearRecentSearches();

      expect(el.recentSearches.length).to.equal(0);
    });

    it("should persist recent searches to localStorage", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.performSearch("persistent search");

      const stored = localStorage.getItem("ds-search-view-recent");
      expect(stored).to.exist;
      expect(JSON.parse(stored)).to.include("persistent search");
    });

    it("should load recent searches from localStorage", async () => {
      localStorage.setItem(
        "ds-search-view-recent",
        JSON.stringify(["loaded search"]),
      );

      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      expect(el.recentSearches).to.include("loaded search");
    });
  });

  describe("Filtered Suggestions", () => {
    it("should return empty array when no suggestions", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const filtered = el.getFilteredSuggestions();

      expect(filtered).to.be.an("array");
    });

    it("should filter suggestions based on search value", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.suggestions = ["apple", "apricot", "banana", "blueberry"];
      el.value = "ap";

      const filtered = el.getFilteredSuggestions();

      expect(filtered).to.include("apple");
      expect(filtered).to.include("apricot");
      expect(filtered).to.not.include("banana");
    });

    it("should show recent searches when no search value", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.recentSearches = ["recent 1", "recent 2", "recent 3"];
      el.value = "";

      const filtered = el.getFilteredSuggestions();

      expect(filtered).to.include("recent 1");
      expect(filtered).to.include("recent 2");
    });

    it("should limit suggestions to 10", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const suggestions = Array.from(
        { length: 20 },
        (_, i) => `suggestion ${i}`,
      );
      el.suggestions = suggestions;
      el.value = "suggestion";

      const filtered = el.getFilteredSuggestions();

      expect(filtered.length).to.equal(10);
    });
  });

  describe("Filters", () => {
    it("should toggle filter on and off", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = ["Images", "Videos"];

      el.toggleFilter("Images");
      expect(el.getAppliedFilters()).to.include("Images");

      el.toggleFilter("Images");
      expect(el.getAppliedFilters()).to.not.include("Images");
    });

    it("should apply multiple filters", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = ["Images", "Videos", "News"];

      el.toggleFilter("Images");
      el.toggleFilter("Videos");

      const applied = el.getAppliedFilters();
      expect(applied).to.include("Images");
      expect(applied).to.include("Videos");
      expect(applied).to.not.include("News");
    });

    it("should emit search with filters applied", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = ["Images", "Videos"];
      el.toggleFilter("Images");

      let eventData = null;
      el.addEventListener("ds-search-view:search", (e) => {
        eventData = e.detail;
      });

      el.performSearch("test");

      expect(eventData.filters).to.include("Images");
    });
  });

  describe("Close Functionality", () => {
    it("should close the search view", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      expect(el.open).to.be.true;

      el.close();

      expect(el.open).to.be.false;
    });

    it("should close on Escape key", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const input = el.shadowRoot.querySelector(".search-input");
      input.focus();
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      expect(el.open).to.be.false;
    });
  });

  describe("Input Events", () => {
    it("should emit input event on value change", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let eventData = null;
      el.addEventListener("ds-search-view:input", (e) => {
        eventData = e.detail;
      });

      const input = el.shadowRoot.querySelector(".search-input");
      input.value = "typing";
      input.dispatchEvent(new Event("input"));

      expect(eventData).to.exist;
      expect(eventData.value).to.equal("typing");
    });

    it("should submit search on Enter key", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let eventFired = false;
      el.addEventListener("ds-search-view:search", () => {
        eventFired = true;
      });

      const input = el.shadowRoot.querySelector(".search-input");
      input.value = "search term";
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      expect(eventFired).to.be.true;
    });

    it("should clear input on clear button click", async () => {
      const el = await fixture(
        html`<ds-search-view open value="test"></ds-search-view>`,
      );

      el.value = "test value";
      await Promise.resolve();

      const clearBtn = el.shadowRoot.querySelector(".clear-button");
      if (clearBtn) {
        clearBtn.click();
        expect(el.value).to.equal("");
      }
    });
  });

  describe("Events", () => {
    it("emits ds-search-view:search with query detail", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let detail = null;
      el.addEventListener("ds-search-view:search", (event) => {
        detail = event.detail;
      });

      el.performSearch("camera");
      expect(detail).to.exist;
      expect(detail.query).to.equal("camera");
    });

    it("emits ds-search-view:input with value detail", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      let detail = null;
      el.addEventListener("ds-search-view:input", (event) => {
        detail = event.detail;
      });

      const input = el.shadowRoot.querySelector(".search-input");
      input.value = "lens";
      input.dispatchEvent(new Event("input"));

      expect(detail).to.exist;
      expect(detail.value).to.equal("lens");
    });
  });

  describe("Keyboard", () => {
    it("should navigate suggestions with arrow keys", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.suggestions = ["result 1", "result 2", "result 3"];
      el.value = "result";
      await Promise.resolve();

      const input = el.shadowRoot.querySelector(".search-input");

      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(0);

      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(1);

      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      expect(el._selectedIndex).to.equal(0);
    });
  });

  describe("CSS Parts", () => {
    it("should have input part", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const input = el.shadowRoot.querySelector('[part="input"]');
      expect(input).to.exist;
    });

    it("should have filter part", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = ["Images"];
      await Promise.resolve();

      const filter = el.shadowRoot.querySelector('[part="filter"]');
      expect(filter).to.exist;
    });

    it("should have suggestion part", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.suggestions = ["result"];
      el.value = "result";
      await Promise.resolve();

      const suggestion = el.shadowRoot.querySelector('[part="suggestion"]');
      expect(suggestion).to.exist;
    });
  });

  describe("Attribute Changes", () => {
    it("should update when open attribute changes", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);

      expect(el.open).to.be.false;

      el.setAttribute("open", "");

      expect(el.open).to.be.true;
    });

    it("should update when value attribute changes", async () => {
      const el = await fixture(html`<ds-search-view></ds-search-view>`);

      el.setAttribute("value", "new value");

      expect(el.value).to.equal("new value");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on close button", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const closeBtn = el.shadowRoot.querySelector(".close-button");
      expect(closeBtn.getAttribute("aria-label")).to.equal("Close search");
    });

    it("should have aria-label on input", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const input = el.shadowRoot.querySelector(".search-input");
      expect(input.getAttribute("aria-label")).to.equal("Search");
    });

    it("should have aria-label on clear button", async () => {
      const el = await fixture(
        html`<ds-search-view open value="test"></ds-search-view>`,
      );

      const clearBtn = el.shadowRoot.querySelector(".clear-button");
      if (clearBtn) {
        expect(clearBtn.getAttribute("aria-label")).to.equal("Clear search");
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle non-array suggestions", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.suggestions = "not an array";

      expect(Array.isArray(el.suggestions)).to.be.true;
      expect(el.suggestions.length).to.equal(0);
    });

    it("should handle non-array filters", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = "not an array";

      expect(Array.isArray(el.filters)).to.be.true;
      expect(el.filters.length).to.equal(0);
    });

    it("should handle special characters in search", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const specialChars = "!@#$%^&*()";
      el.performSearch(specialChars);

      expect(el.recentSearches[0]).to.equal(specialChars);
    });

    it("should handle very long search terms", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      const longTerm = "a".repeat(500);
      el.performSearch(longTerm);

      expect(el.recentSearches[0]).to.equal(longTerm);
    });

    it("should handle rapid filter toggling", async () => {
      const el = await fixture(html`<ds-search-view open></ds-search-view>`);

      el.filters = ["Filter1", "Filter2"];

      el.toggleFilter("Filter1");
      el.toggleFilter("Filter1");
      el.toggleFilter("Filter1");

      expect(el.getAppliedFilters()).to.include("Filter1");
    });
  });
});
