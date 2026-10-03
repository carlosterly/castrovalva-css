import { fixture, html, expect } from "@open-wc/testing";
import "../src/components/search/search.js";

describe("DSSearch", () => {
  describe("Structure & Defaults", () => {
    it("renders with default properties", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      expect(el).to.exist;
      expect(el.variant).to.equal("bar");
      expect(el.placeholder).to.equal("Search");
      expect(el.value).to.equal("");
      expect(el.active).to.be.false;
      expect(el.disabled).to.be.false;
    });

    it("renders shadow DOM structure", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const container = el.shadowRoot.querySelector('[part="container"]');
      const inputContainer = el.shadowRoot.querySelector(
        '[part="input-container"]',
      );
      const input = el.shadowRoot.querySelector('[part="input"]');
      const suggestions = el.shadowRoot.querySelector('[part="suggestions"]');

      expect(container).to.exist;
      expect(inputContainer).to.exist;
      expect(input).to.exist;
      expect(suggestions).to.exist;
    });

    it("has search role", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const container = el.shadowRoot.querySelector('[part="container"]');
      expect(container.getAttribute("role")).to.equal("search");
    });

    it("renders default search icon", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const leadingIcon = el.shadowRoot.querySelector(".leading-icon svg");
      expect(leadingIcon).to.exist;
    });
  });

  describe("Variants", () => {
    it("defaults to bar variant", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      expect(el.variant).to.equal("bar");
    });

    it("renders view variant", async () => {
      const el = await fixture(html`<ds-search variant="view"></ds-search>`);
      expect(el.variant).to.equal("view");
    });

    it("renders full-screen variant", async () => {
      const el = await fixture(
        html`<ds-search variant="full-screen"></ds-search>`,
      );
      expect(el.variant).to.equal("full-screen");
      expect(el.hasAttribute("variant")).to.be.true;
    });

    it("rejects invalid variant", async () => {
      const el = await fixture(html`<ds-search variant="invalid"></ds-search>`);
      expect(el.variant).to.equal("bar");
    });
  });

  describe("Placeholder", () => {
    it("renders custom placeholder", async () => {
      const el = await fixture(
        html`<ds-search placeholder="Search products..."></ds-search>`,
      );
      expect(el.placeholder).to.equal("Search products...");
      const input = el.shadowRoot.querySelector("input");
      expect(input.placeholder).to.equal("Search products...");
    });

    it("updates placeholder dynamically", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.placeholder = "Find items";
      await el.updateComplete;
      expect(el.placeholder).to.equal("Find items");
    });
  });

  describe("Value", () => {
    it("sets initial value", async () => {
      const el = await fixture(
        html`<ds-search value="test query"></ds-search>`,
      );
      expect(el.value).to.equal("test query");
      const input = el.shadowRoot.querySelector("input");
      expect(input.value).to.equal("test query");
    });

    it("updates value via property", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.value = "new search";
      expect(el.value).to.equal("new search");
      const input = el.shadowRoot.querySelector("input");
      expect(input.value).to.equal("new search");
    });

    it("reads value from input", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const input = el.shadowRoot.querySelector("input");
      input.value = "typed value";
      input.dispatchEvent(new Event("input"));
      expect(el.value).to.equal("typed value");
    });
  });

  describe("Active State", () => {
    it("is not active by default", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      expect(el.active).to.be.false;
    });

    it("sets active via attribute", async () => {
      const el = await fixture(html`<ds-search active></ds-search>`);
      expect(el.active).to.be.true;
    });

    it("sets active via property", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.active = true;
      expect(el.active).to.be.true;
      expect(el.hasAttribute("active")).to.be.true;
    });

    it("becomes active on focus", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const input = el.shadowRoot.querySelector("input");
      input.focus();
      expect(el.active).to.be.true;
    });
  });

  describe("Disabled State", () => {
    it("is not disabled by default", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      expect(el.disabled).to.be.false;
    });

    it("sets disabled via attribute", async () => {
      const el = await fixture(html`<ds-search disabled></ds-search>`);
      expect(el.disabled).to.be.true;
      const input = el.shadowRoot.querySelector("input");
      expect(input.disabled).to.be.true;
    });

    it("sets disabled via property", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.disabled = true;
      await el.updateComplete;
      expect(el.disabled).to.be.true;
    });
  });

  describe("Attributes", () => {
    it("reflects variant attribute", async () => {
      const el = await fixture(html`<ds-search variant="view"></ds-search>`);
      expect(el.getAttribute("variant")).to.equal("view");
      expect(el.variant).to.equal("view");
    });

    it("reflects disabled attribute", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.setAttribute("disabled", "");
      expect(el.disabled).to.equal(true);
    });
  });

  describe("Properties", () => {
    it("updates placeholder property", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.placeholder = "Search docs";
      expect(el.placeholder).to.equal("Search docs");
    });

    it("coerces null value property to empty string", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.value = null;
      expect(el.value).to.equal("");
    });
  });

  describe("Suggestions", () => {
    it("initializes with empty suggestions", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      expect(el.suggestions).to.deep.equal([]);
    });

    it("sets suggestions as array", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple", "Banana", "Cherry"];
      expect(el.suggestions).to.deep.equal(["Apple", "Banana", "Cherry"]);
    });

    it("filters suggestions based on input", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple", "Banana", "Cherry", "Apricot"];
      el.value = "ap";
      el.filterSuggestions();
      expect(el._filteredSuggestions).to.have.lengthOf(2);
    });

    it("shows no suggestions when input is empty", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple", "Banana", "Cherry"];
      el.value = "";
      el.filterSuggestions();
      expect(el._filteredSuggestions).to.have.lengthOf(0);
    });

    it("filters case-insensitively", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple", "Banana"];
      el.value = "APPLE";
      el.filterSuggestions();
      expect(el._filteredSuggestions).to.have.lengthOf(1);
    });

    it("handles object suggestions", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = [
        { text: "Apple", id: 1 },
        { text: "Banana", id: 2 },
      ];
      el.value = "ban";
      el.filterSuggestions();
      expect(el._filteredSuggestions).to.have.lengthOf(1);
    });
  });

  describe("Clear Functionality", () => {
    it("shows clear button when value exists", async () => {
      const el = await fixture(html`<ds-search value="test"></ds-search>`);
      const clearBtn = el.shadowRoot.querySelector(".clear-btn");
      const styles = window.getComputedStyle(clearBtn);
      expect(styles.display).to.not.equal("none");
    });

    it("hides clear button when value is empty", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const clearBtn = el.shadowRoot.querySelector(".clear-btn");
      const styles = window.getComputedStyle(clearBtn);
      expect(styles.display).to.equal("none");
    });

    it("clears value when clear button clicked", async () => {
      const el = await fixture(html`<ds-search value="test"></ds-search>`);
      const clearBtn = el.shadowRoot.querySelector(".clear-btn");
      clearBtn.click();
      expect(el.value).to.equal("");
    });

    it("fires clear event", async () => {
      const el = await fixture(html`<ds-search value="test"></ds-search>`);
      let eventFired = false;
      el.addEventListener("ds-search:clear", () => {
        eventFired = true;
      });
      el.clear();
      expect(eventFired).to.be.true;
    });
  });

  describe("Keyboard", () => {
    const frames = async () => {
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
    };

    // Guards listeners re-bound in a requestAnimationFrame after every
    // render: two renders in one frame stacked a second keydown listener, so
    // each ArrowDown skipped a suggestion once the page had settled. That
    // race was also the WebKit-only flake in the two tests below.
    it("moves one suggestion per key press after re-renders settle", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.placeholder = "Search fruit";
      el.value = "ap";
      el.suggestions = ["Apple", "Apricot", "Grape"];
      await frames();
      el.filterSuggestions();

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(0);
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(1);
    });

    it("fires one input event per keystroke after re-renders settle", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.value = "b";
      await frames();
      let inputs = 0;
      el.addEventListener("ds-search:input", () => inputs++);

      el.shadowRoot
        .querySelector("input")
        .dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      expect(inputs).to.equal(1);
    });

    it("responds to keys immediately after a re-render", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.placeholder = "Search fruit";
      el.filterSuggestions();

      el.shadowRoot
        .querySelector("input")
        .dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(0);
    });

    it("navigates down with ArrowDown", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot", "Avocado"];
      el.filterSuggestions();

      expect(el._selectedIndex).to.equal(-1);

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
      expect(el._selectedIndex).to.equal(0);
    });

    it("navigates up with ArrowUp", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();
      el._selectedIndex = 1;

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
      );
      expect(el._selectedIndex).to.equal(0);
    });

    it("stops at first item when navigating up", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();
      el._selectedIndex = 0;

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      expect(el._selectedIndex).to.equal(-1);
    });

    it("stops at last item when navigating down", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();
      el._selectedIndex = 1;

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(el._selectedIndex).to.equal(1);
    });

    it("selects suggestion with Enter", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();
      el._selectedIndex = 0;

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      expect(el.value).to.equal("Apple");
    });

    it("closes suggestions with Escape", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(el._filteredSuggestions).to.have.lengthOf(0);
    });

    // Escape used to blur the input, stranding keyboard focus on <body>
    it("keeps focus in the input when Escape closes suggestions", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();
      await frames();

      const input = el.shadowRoot.querySelector("input");
      input.focus();
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(el.shadowRoot.activeElement === input).to.be.true;
      expect(input.getAttribute("aria-expanded")).to.equal("false");
    });
  });

  describe("Combobox semantics", () => {
    // Focus stays in the input while arrows move the highlight, so without
    // aria-activedescendant a screen reader announces nothing.
    it("points aria-activedescendant at the highlighted option", async () => {
      const el = await fixture(html`<ds-search value="ap"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();

      const input = el.shadowRoot.querySelector("input");
      expect(input.hasAttribute("aria-activedescendant")).to.be.false;

      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      const id = input.getAttribute("aria-activedescendant");
      const option = el.shadowRoot.getElementById(id);
      expect(option.getAttribute("role")).to.equal("option");
      expect(option.getAttribute("aria-selected")).to.equal("true");
      expect(option.textContent.trim()).to.equal("Apricot");
    });

    it("drops aria-activedescendant when the highlight leaves the list", async () => {
      const el = await fixture(html`<ds-search value="ap"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      expect(input.hasAttribute("aria-activedescendant")).to.be.false;
    });

    it("reflects whether the list is open in aria-expanded", async () => {
      const el = await fixture(html`<ds-search value="ap"></ds-search>`);
      el.suggestions = ["Apple"];
      el.filterSuggestions();
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-expanded")).to.equal("true");

      el.suggestions = [];
      expect(input.getAttribute("aria-expanded")).to.equal("false");
    });

    it("gives the listbox an accessible name", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const listbox = el.shadowRoot.querySelector("[role='listbox']");
      expect(listbox.getAttribute("aria-label")).to.equal("Suggestions");
    });
  });

  describe("Events", () => {
    it("fires input event on typing", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      let eventDetail = null;
      el.addEventListener("ds-search:input", (e) => {
        eventDetail = e.detail;
      });

      const input = el.shadowRoot.querySelector("input");
      input.value = "test";
      input.dispatchEvent(new Event("input"));

      expect(eventDetail).to.exist;
      expect(eventDetail.value).to.equal("test");
    });

    it("fires submit event on Enter without selection", async () => {
      const el = await fixture(html`<ds-search value="query"></ds-search>`);
      let eventDetail = null;
      el.addEventListener("ds-search:submit", (e) => {
        eventDetail = e.detail;
      });

      const input = el.shadowRoot.querySelector("input");
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      expect(eventDetail).to.exist;
      expect(eventDetail.value).to.equal("query");
    });

    it("fires suggestion-select event", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple", "Apricot"];
      el.filterSuggestions();

      let eventDetail = null;
      el.addEventListener("ds-search:suggestion-select", (e) => {
        eventDetail = e.detail;
      });

      el.selectSuggestion(0);

      expect(eventDetail).to.exist;
      expect(eventDetail.suggestion).to.equal("Apple");
      expect(eventDetail.index).to.equal(0);
    });
  });

  describe("Slots", () => {
    it("renders leading slot content", async () => {
      const el = await fixture(html`
        <ds-search>
          <span slot="leading" class="custom-icon">🔍</span>
        </ds-search>
      `);
      const slotted = el.querySelector('[slot="leading"]');
      expect(slotted).to.exist;
      expect(slotted.textContent).to.equal("🔍");
    });

    it("renders trailing slot content", async () => {
      const el = await fixture(html`
        <ds-search>
          <button slot="trailing" class="voice-btn">🎤</button>
        </ds-search>
      `);
      const slotted = el.querySelector('[slot="trailing"]');
      expect(slotted).to.exist;
      expect(slotted.textContent).to.equal("🎤");
    });
  });

  describe("CSS Parts", () => {
    it("exposes container part", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const part = el.shadowRoot.querySelector('[part="container"]');
      expect(part).to.exist;
    });

    it("exposes input-container part", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const part = el.shadowRoot.querySelector('[part="input-container"]');
      expect(part).to.exist;
    });

    it("exposes input part", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const part = el.shadowRoot.querySelector('[part="input"]');
      expect(part).to.exist;
    });

    it("exposes suggestions part", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const part = el.shadowRoot.querySelector('[part="suggestions"]');
      expect(part).to.exist;
    });
  });

  describe("Accessibility", () => {
    it("has combobox role on input", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("role")).to.equal("combobox");
    });

    it("has aria-autocomplete attribute", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-autocomplete")).to.equal("list");
    });

    it("has aria-controls pointing to suggestions", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-controls")).to.equal("suggestions-list");
    });

    it("updates aria-expanded based on suggestions", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple"];
      el.filterSuggestions();
      await el.updateComplete;

      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-expanded")).to.equal("true");
    });

    it("has aria-label on input", async () => {
      const el = await fixture(
        html`<ds-search placeholder="Search items"></ds-search>`,
      );
      const input = el.shadowRoot.querySelector("input");
      expect(input.getAttribute("aria-label")).to.equal("Search items");
    });

    it("has listbox role on suggestions", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      const suggestions = el.shadowRoot.querySelector('[part="suggestions"]');
      expect(suggestions.getAttribute("role")).to.equal("listbox");
    });
  });

  describe("Edge Cases", () => {
    it("handles null suggestions gracefully", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = null;
      expect(el.suggestions).to.deep.equal([]);
    });

    it("handles undefined value", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.value = undefined;
      expect(el.value).to.equal("");
    });

    it("escapes HTML in suggestions", async () => {
      const el = await fixture(html`<ds-search value="test"></ds-search>`);
      el.suggestions = ["<script>alert('xss')</script>"];
      el.filterSuggestions();

      const suggestionsContainer = el.shadowRoot.querySelector(
        '[part="suggestions"]',
      );
      expect(suggestionsContainer.innerHTML).to.not.include("<script>");
    });

    it("handles rapid suggestion changes", async () => {
      const el = await fixture(html`<ds-search value="a"></ds-search>`);
      el.suggestions = ["Apple"];
      el.filterSuggestions();
      el.suggestions = ["Banana"];
      el.filterSuggestions();
      el.suggestions = ["Cherry"];
      el.filterSuggestions();
      expect(el._filteredSuggestions).to.have.lengthOf(0);
    });

    it("handles selecting out of bounds index", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple"];
      el.selectSuggestion(10);
      expect(el.value).to.equal("");
    });

    it("handles selecting negative index", async () => {
      const el = await fixture(html`<ds-search></ds-search>`);
      el.suggestions = ["Apple"];
      el.selectSuggestion(-1);
      expect(el.value).to.equal("");
    });
  });
});
