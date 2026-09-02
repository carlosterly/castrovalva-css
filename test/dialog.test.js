import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../src/components/ds-dialog.js";

describe("DSDialog", () => {
  const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

  describe("Initialization", () => {
    it("renders with shadow root", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      expect(el.shadowRoot).to.exist;
    });

    it("defines ds-dialog custom element", async () => {
      await fixture(html`<ds-dialog></ds-dialog>`);
      expect(customElements.get("ds-dialog")).to.equal(
        window.customElements.get("ds-dialog"),
      );
    });

    it("defaults to basic variant", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      expect(el.variant).to.equal("basic");
    });

    it("starts closed by default", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      expect(el.open).to.equal(false);
      expect(el.hasAttribute("open")).to.equal(false);
    });

    it("declares expected observed attributes", async () => {
      await fixture(html`<ds-dialog></ds-dialog>`);
      expect(customElements.get("ds-dialog").observedAttributes).to.deep.equal([
        "variant",
        "open",
        "dismiss-on-backdrop-click",
        "dismiss-on-esc",
      ]);
    });
  });

  describe("Attributes & Properties", () => {
    it("reflects variant property to attribute", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.variant = "alert";
      expect(el.getAttribute("variant")).to.equal("alert");
    });

    it("reflects open property to attribute", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.open = true;
      await wait(10);
      expect(el.hasAttribute("open")).to.equal(true);

      el.open = false;
      await wait(10);
      expect(el.hasAttribute("open")).to.equal(false);
    });

    it("opens when open attribute is added", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.setAttribute("open", "");
      await wait(20);
      expect(el.open).to.equal(true);
      expect(el.shadowRoot.querySelector("dialog").open).to.equal(true);
    });

    it("closes when open attribute is removed", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      el.removeAttribute("open");
      await wait(20);
      expect(el.open).to.equal(false);
    });

    it("updates dismiss-on-backdrop-click from attribute", async () => {
      const el = await fixture(
        html`<ds-dialog dismiss-on-backdrop-click="false"></ds-dialog>`,
      );
      expect(el._dismissOnBackdropClick).to.equal(false);
    });

    it("updates dismiss-on-esc from attribute", async () => {
      const el = await fixture(
        html`<ds-dialog dismiss-on-esc="false"></ds-dialog>`,
      );
      expect(el._dismissOnEsc).to.equal(false);
    });
  });

  describe("Methods & Events", () => {
    it("show() opens dialog and emits ds-dialog:open", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      setTimeout(() => el.show(), 0);
      const event = await oneEvent(el, "ds-dialog:open");
      expect(event).to.exist;
      expect(el.open).to.equal(true);
    });

    it("close() closes dialog and emits ds-dialog:close", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      setTimeout(() => el.close(), 0);
      const event = await oneEvent(el, "ds-dialog:close");
      expect(event).to.exist;
      expect(el.open).to.equal(false);
    });

    it("locks and restores body scroll on show/close", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.show();
      await wait(10);
      expect(document.body.style.overflow).to.equal("hidden");

      el.close();
      await wait(240);
      expect(document.body.style.overflow).to.equal("");
    });

    it("fires ds-dialog:confirm when default confirm is clicked", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      const confirmButton = el.shadowRoot.querySelector(".default-confirm");
      setTimeout(() => confirmButton.click(), 0);
      const event = await oneEvent(el, "ds-dialog:confirm");
      expect(event).to.exist;
    });

    it("closes on default cancel click", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      const cancelButton = el.shadowRoot.querySelector(".default-cancel");
      cancelButton.click();
      await wait(20);
      expect(el.open).to.equal(false);
    });
  });

  describe("States", () => {
    it("opens native dialog while open", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.show();
      await wait(20);
      expect(el.shadowRoot.querySelector("dialog").open).to.equal(true);
    });

    it("closes native dialog on close", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      el.close();
      await wait(20);
      expect(el.shadowRoot.querySelector("dialog").open).to.equal(false);
    });

    it("renders full-screen variant styles", async () => {
      const el = await fixture(
        html`<ds-dialog variant="full-screen"></ds-dialog>`,
      );
      const dialog = el.shadowRoot.querySelector("dialog");
      expect(dialog.getAttribute("data-variant")).to.equal("full-screen");
    });

    it("renders alert variant styles", async () => {
      const el = await fixture(html`<ds-dialog variant="alert"></ds-dialog>`);
      const dialog = el.shadowRoot.querySelector("dialog");
      expect(dialog.getAttribute("data-variant")).to.equal("alert");
    });
  });

  describe("Keyboard & Interaction", () => {
    it("closes on Escape when enabled", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      await wait(20);
      expect(el.open).to.equal(false);
    });

    it("does not close on Escape when dismiss-on-esc is false", async () => {
      const el = await fixture(
        html`<ds-dialog open dismiss-on-esc="false"></ds-dialog>`,
      );
      await wait(20);
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      await wait(20);
      expect(el.open).to.equal(true);
      el.close();
      await wait(20);
    });

    it("closes on backdrop click when enabled", async () => {
      const el = await fixture(html`<ds-dialog open></ds-dialog>`);
      await wait(20);
      const dialogEl = el.shadowRoot.querySelector("dialog");
      dialogEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await wait(20);
      expect(el.open).to.equal(false);
    });

    it("does not close on backdrop click when disabled", async () => {
      const el = await fixture(
        html`<ds-dialog open dismiss-on-backdrop-click="false"></ds-dialog>`,
      );
      await wait(20);
      const dialogEl = el.shadowRoot.querySelector("dialog");
      dialogEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await wait(20);
      expect(el.open).to.equal(true);
      el.close();
      await wait(20);
    });
  });

  describe("Accessibility", () => {
    it("uses dialog semantics", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      const dialog = el.shadowRoot.querySelector("dialog");
      expect(dialog.getAttribute("role")).to.equal("dialog");
      expect(dialog.getAttribute("aria-modal")).to.equal("true");
    });

    it("contains keyboard-focusable default actions", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      const focusable = el.getFocusableElements();
      expect(focusable.length).to.be.greaterThan(0);
    });

    it("focuses first focusable element on open", async () => {
      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.show();
      await wait(140);
      const first = el.getFocusableElements()[0];
      expect(el.shadowRoot.activeElement).to.equal(first);
      el.close();
    });

    it("restores focus to previous element on close", async () => {
      const hostButton = document.createElement("button");
      hostButton.textContent = "trigger";
      document.body.appendChild(hostButton);
      hostButton.focus();

      const el = await fixture(html`<ds-dialog></ds-dialog>`);
      el.show();
      await wait(140);
      el.close();
      await wait(240);

      expect(document.activeElement).to.equal(hostButton);
      hostButton.remove();
    });
  });
});
