import { fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";

/**
 * Keyboard suite shared by ds-navigation-bar and ds-navigation-rail: a
 * roving tabindex with manual activation (arrows move focus, Enter/Space
 * select). Real key presses via sendKeys, so Tab order is the browser's.
 *
 * @param {object} o
 * @param {string} o.parent - Parent tag, e.g. "ds-navigation-bar"
 * @param {string} o.item - Item tag
 * @param {string} o.next - Key that moves to the next item
 * @param {string} o.prev - Key that moves to the previous item
 * @param {string[]} o.ignored - Arrow keys for the other orientation
 */
export function rovingTabindexSuite({ parent, item, next, prev, ignored }) {
  const destinations = ["Home", "Search", "Library", "Settings"];

  const build = async ({ active = "Search", disabled = [], dir = "" } = {}) => {
    const items = destinations
      .map((label) => {
        const attrs = [
          `value="${label.toLowerCase()}"`,
          label === active ? "active" : "",
          disabled.includes(label) ? "disabled" : "",
        ].join(" ");
        return `<${item} ${attrs}>${label}</${item}>`;
      })
      .join("");
    const wrapper = await fixture(`
      <div ${dir ? `dir="${dir}"` : ""}>
        <button id="before">Before</button>
        <${parent}>${items}</${parent}>
        <button id="after">After</button>
      </div>
    `);
    await Promise.resolve();
    const nav = wrapper.querySelector(parent);
    const byLabel = (label) =>
      [...nav.querySelectorAll(item)].find(
        (el) => el.textContent.trim() === label,
      );
    return { wrapper, nav, byLabel };
  };

  const tabindexOf = (el) =>
    el.shadowRoot.querySelector('[role="tab"]').getAttribute("tabindex");

  // Label of the focused item, or the focused element's id outside the group
  const focused = () => {
    const el = document.activeElement;
    return el?.localName === item ? el.textContent.trim() : el?.id;
  };

  const tabStops = (nav) =>
    [...nav.querySelectorAll(item)]
      .filter((el) => tabindexOf(el) === "0")
      .map((el) => el.textContent.trim());

  const focusBefore = (wrapper) => wrapper.querySelector("#before").focus();

  describe("Keyboard (roving tabindex)", () => {
    it("puts only the active item in the tab order", async () => {
      const { nav } = await build();
      expect(tabStops(nav)).to.deep.equal(["Search"]);
    });

    it("makes the first item the tab stop when none is active", async () => {
      const { nav } = await build({ active: null });
      expect(tabStops(nav)).to.deep.equal(["Home"]);
    });

    it("skips a disabled item when choosing the tab stop", async () => {
      const { nav } = await build({ active: "Home", disabled: ["Home"] });
      expect(tabStops(nav)).to.deep.equal(["Search"]);
    });

    it("tabs into the group on the active item and out in one step", async () => {
      const { wrapper } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      expect(focused()).to.equal("Search");
      await sendKeys({ press: "Tab" });
      expect(focused()).to.equal("after");
    });

    it(`moves focus to the next item with ${next}`, async () => {
      const { wrapper } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });
      expect(focused()).to.equal("Library");
    });

    it(`moves focus to the previous item with ${prev}`, async () => {
      const { wrapper } = await build({ active: "Library" });
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: prev });
      expect(focused()).to.equal("Search");
    });

    it("wraps from the last item to the first and back", async () => {
      const { wrapper } = await build({ active: "Settings" });
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });
      expect(focused()).to.equal("Home");
      await sendKeys({ press: prev });
      expect(focused()).to.equal("Settings");
    });

    it("moves focus without selecting (manual activation)", async () => {
      const { wrapper, nav, byLabel } = await build();
      let selects = 0;
      nav.addEventListener(`${parent}:select`, () => selects++);
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });

      expect(selects).to.equal(0);
      expect(byLabel("Search").active).to.equal(true);
      expect(byLabel("Library").active).to.equal(false);
    });

    it("moves the tab stop with focus", async () => {
      const { wrapper, nav } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });
      expect(tabStops(nav)).to.deep.equal(["Library"]);
    });

    it("returns the tab stop to the active item when focus leaves", async () => {
      const { wrapper, nav } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });
      await sendKeys({ press: "Tab" });
      expect(focused()).to.equal("after");
      expect(tabStops(nav)).to.deep.equal(["Search"]);

      await sendKeys({ press: "Shift+Tab" });
      expect(focused()).to.equal("Search");
    });

    it("skips disabled items", async () => {
      const { wrapper } = await build({ disabled: ["Library"] });
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: next });
      expect(focused()).to.equal("Settings");
    });

    it("moves to the first and last items with Home and End", async () => {
      const { wrapper } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      await sendKeys({ press: "End" });
      expect(focused()).to.equal("Settings");
      await sendKeys({ press: "Home" });
      expect(focused()).to.equal("Home");
    });

    it("ignores arrow keys for the other orientation", async () => {
      const { wrapper } = await build();
      focusBefore(wrapper);
      await sendKeys({ press: "Tab" });
      for (const key of ignored) {
        await sendKeys({ press: key });
        expect(focused()).to.equal("Search");
      }
    });

    for (const key of ["Enter", "Space"]) {
      it(`selects the focused item with ${key} and keeps focus on it`, async () => {
        const { wrapper, nav, byLabel } = await build();
        const values = [];
        nav.addEventListener(`${parent}:select`, (e) =>
          values.push(e.detail.value),
        );
        focusBefore(wrapper);
        await sendKeys({ press: "Tab" });
        await sendKeys({ press: next });
        await sendKeys({ press: key });

        expect(values).to.deep.equal(["library"]);
        expect(byLabel("Library").active).to.equal(true);
        expect(byLabel("Search").active).to.equal(false);
        // Selecting re-renders the item; focus used to drop to <body>
        expect(focused()).to.equal("Library");
        expect(tabStops(nav)).to.deep.equal(["Library"]);
      });
    }

    it("moves the tab stop when the active item changes programmatically", async () => {
      const { nav, byLabel } = await build();
      byLabel("Search").active = false;
      byLabel("Settings").active = true;
      await Promise.resolve();
      expect(tabStops(nav)).to.deep.equal(["Settings"]);
    });

    it("keeps one tab stop when items are added later", async () => {
      const { nav } = await build();
      const extra = document.createElement(item);
      extra.textContent = "Downloads";
      nav.append(extra);
      await Promise.resolve();
      expect(tabStops(nav)).to.deep.equal(["Search"]);
      expect(tabindexOf(extra)).to.equal("-1");
    });

    it("leaves a standalone item tabbable", async () => {
      const el = await fixture(`<${item}>Home</${item}>`);
      expect(tabindexOf(el)).to.equal("0");
    });

    // Guards a listener on both the button and the host, which fired every
    // selection twice
    it("fires one select event per click", async () => {
      const { nav, byLabel } = await build();
      let selects = 0;
      nav.addEventListener(`${parent}:select`, () => selects++);
      byLabel("Library").shadowRoot.querySelector('[role="tab"]').click();
      expect(selects).to.equal(1);
    });
  });

  if (next === "ArrowRight") {
    describe("Keyboard in right-to-left layouts", () => {
      it("moves to the next item with ArrowLeft", async () => {
        const { wrapper } = await build({ dir: "rtl" });
        focusBefore(wrapper);
        await sendKeys({ press: "Tab" });
        await sendKeys({ press: "ArrowLeft" });
        expect(focused()).to.equal("Library");
      });
    });
  }
}
