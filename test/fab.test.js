import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/ds-fab.js";

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe("ds-fab", () => {
  describe("Initialization", () => {
    it("renders a button with default aria-label", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");

      expect(button).to.exist;
      expect(button.getAttribute("aria-label")).to.equal(
        "Floating action button",
      );
    });

    it("reflects label in aria-label", async () => {
      const el = await fixture(html`<ds-fab label="Compose"></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");

      expect(button.getAttribute("aria-label")).to.equal("Compose");
    });

    it("renders a FAB menu backdrop when enabled", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      const backdrop = el.shadowRoot.querySelector(".speed-dial-backdrop");

      expect(backdrop).to.exist;
    });
  });

  describe("Attributes and properties", () => {
    it("defaults size and color", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);

      expect(el.size).to.equal("default");
      expect(el.color).to.equal("primary");
    });

    it("updates size and color attributes", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);
      el.size = "small";
      el.color = "secondary";

      expect(el.getAttribute("size")).to.equal("small");
      expect(el.getAttribute("color")).to.equal("secondary");
    });

    it("toggles lowered and disabled states", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);
      el.lowered = true;
      el.disabled = true;

      expect(el.hasAttribute("lowered")).to.be.true;
      expect(el.hasAttribute("disabled")).to.be.true;

      el.lowered = false;
      el.disabled = false;

      expect(el.hasAttribute("lowered")).to.be.false;
      expect(el.hasAttribute("disabled")).to.be.false;
    });

    it("defaults to position none", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);
      expect(el.position).to.equal("none");
    });

    it("does not use fixed positioning for FAB button", async () => {
      const el = await fixture(html`<ds-fab position="none"></ds-fab>`);
      const styleText = el.shadowRoot.querySelector("style").textContent;
      const buttonRule = styleText.match(/button\s*\{[^}]*\}/)?.[0] || "";

      expect(buttonRule.includes("position: fixed")).to.be.false;
    });
  });

  describe("Methods", () => {
    it("adds FAB menu actions", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });
      el.addAction({ icon: "share", label: "Share" });

      const actions = el.shadowRoot.querySelectorAll(
        ".speed-dial-action-button",
      );
      expect(actions.length).to.equal(2);
    });

    it("clears FAB menu actions", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });
      el.clearActions();

      const actions = el.shadowRoot.querySelectorAll(
        ".speed-dial-action-button",
      );
      expect(actions.length).to.equal(0);
    });

    it("opens and closes FAB menu", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });

      el.open();
      await wait(20);
      expect(el.isOpen).to.be.true;

      el.close();
      expect(el.isOpen).to.be.false;
    });

    it("toggles FAB menu state", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });

      el.toggle();
      await wait(20);
      expect(el.isOpen).to.be.true;

      el.toggle();
      expect(el.isOpen).to.be.false;
    });
  });

  describe("Events", () => {
    it("emits ds-fab:click for standard FABs", async () => {
      const el = await fixture(html`<ds-fab></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");

      setTimeout(() => button.click());
      const event = await oneEvent(el, "ds-fab:click");

      expect(event.detail.size).to.equal("default");
      expect(event.detail.color).to.equal("primary");
    });

    it("emits open and close events for FAB menu", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });

      setTimeout(() => el.open());
      const openEvent = await oneEvent(el, "ds-fab:open");
      expect(openEvent).to.exist;

      setTimeout(() => el.close());
      const closeEvent = await oneEvent(el, "ds-fab:close");
      expect(closeEvent).to.exist;
    });

    it("emits action click events", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });

      const actionButton = el.shadowRoot.querySelector(
        ".speed-dial-action-button",
      );
      const eventPromise = oneEvent(el, "ds-fab-action:click");
      actionButton.click();

      const event = await eventPromise;
      expect(event.detail.action.label).to.equal("Edit");
      expect(event.detail.index).to.equal(0);
    });
  });

  describe("States", () => {
    it("prevents click events when disabled", async () => {
      const el = await fixture(html`<ds-fab disabled></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");
      let fired = false;

      el.addEventListener("ds-fab:click", () => {
        fired = true;
      });

      button.click();
      await wait();
      expect(fired).to.be.false;
    });

    it("closes when clicking the FAB menu backdrop", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      el.addAction({ icon: "edit", label: "Edit" });
      el.open();
      await wait(20);

      const backdrop = el.shadowRoot.querySelector(".speed-dial-backdrop");
      backdrop.click();
      expect(el.isOpen).to.be.false;
    });
  });

  describe("Accessibility", () => {
    it("marks the button as disabled", async () => {
      const el = await fixture(html`<ds-fab disabled></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");

      expect(button.hasAttribute("disabled")).to.be.true;
    });

    it("adds aria-haspopup when FAB menu is enabled", async () => {
      const el = await fixture(html`<ds-fab speed-dial></ds-fab>`);
      const button = el.shadowRoot.querySelector("button");

      expect(button.getAttribute("aria-haspopup")).to.equal("menu");
    });
  });
});
