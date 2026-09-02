import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "../src/components/ds-snackbar.js";

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe("DSSnackbar", () => {
  describe("Initialization", () => {
    it("renders with default structure", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      expect(el).to.exist;
      expect(el.shadowRoot.querySelector(".snackbar")).to.exist;
    });

    it("registers custom element", async () => {
      await fixture(html`<ds-snackbar></ds-snackbar>`);
      expect(customElements.get("ds-snackbar")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("reflects message attribute to property", async () => {
      const el = await fixture(
        html`<ds-snackbar message="Saved"></ds-snackbar>`,
      );
      expect(el.message).to.equal("Saved");
    });

    it("reflects action-label attribute to property", async () => {
      const el = await fixture(
        html`<ds-snackbar action-label="Undo"></ds-snackbar>`,
      );
      expect(el.actionLabel).to.equal("Undo");
    });

    it("coerces duration attribute and defaults invalid values", async () => {
      const el = await fixture(
        html`<ds-snackbar duration="1200"></ds-snackbar>`,
      );
      expect(el.duration).to.equal(1200);

      el.setAttribute("duration", "-1");
      await wait();
      expect(el.duration).to.equal(4000);
    });
  });

  describe("Properties", () => {
    it("sets and removes message property", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.message = "Updated";
      expect(el.getAttribute("message")).to.equal("Updated");

      el.message = null;
      await wait();
      expect(el.hasAttribute("message")).to.equal(false);
    });

    it("sets and removes actionLabel property", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.actionLabel = "Retry";
      expect(el.getAttribute("action-label")).to.equal("Retry");

      el.actionLabel = "";
      await wait();
      expect(el.hasAttribute("action-label")).to.equal(false);
    });

    it("sets and removes duration property", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.duration = 1500;
      expect(el.getAttribute("duration")).to.equal("1500");

      el.duration = "";
      await wait();
      expect(el.hasAttribute("duration")).to.equal(false);
      expect(el.duration).to.equal(4000);
    });
  });

  describe("Events", () => {
    it("emits ds-snackbar:show event", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      const eventPromise = oneEvent(el, "ds-snackbar:show");

      el.show({ message: "Shown", duration: 0 });
      const event = await eventPromise;

      expect(event.detail.message).to.equal("Shown");
      expect(event.detail.duration).to.equal(0);
    });

    it("emits ds-snackbar:action when action button clicked", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      const eventPromise = oneEvent(el, "ds-snackbar:action");

      el.show({ message: "Deleted", actionLabel: "Undo", duration: 0 });
      await wait();

      const actionButton = el.shadowRoot.querySelector(".action-button");
      actionButton.click();

      const event = await eventPromise;
      expect(event.detail.message).to.equal("Deleted");
      expect(event.detail.actionLabel).to.equal("Undo");
    });

    it("emits ds-snackbar:dismiss when dismissed", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      const eventPromise = oneEvent(el, "ds-snackbar:dismiss");

      el.show({ message: "Dismiss me", duration: 0 });
      await wait();
      el.dismiss();

      const event = await eventPromise;
      expect(event.detail.message).to.equal("Dismiss me");
    });
  });

  describe("Keyboard", () => {
    it("action button is keyboard focusable when present", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.show({ message: "Focusable", actionLabel: "Undo", duration: 0 });
      await wait();

      const actionButton = el.shadowRoot.querySelector(".action-button");
      expect(actionButton.getAttribute("type")).to.equal("button");
      actionButton.focus();
      expect(el.shadowRoot.activeElement).to.equal(actionButton);
    });

    it("close button is keyboard focusable", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.show({ message: "Closable", duration: 0 });
      await wait();

      const closeButton = el.shadowRoot.querySelector(".close-button");
      expect(closeButton.getAttribute("type")).to.equal("button");
      closeButton.focus();
      expect(el.shadowRoot.activeElement).to.equal(closeButton);
    });
  });

  describe("Accessibility", () => {
    it("renders alert and status live regions", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      const surface = el.shadowRoot.querySelector(".snackbar");
      const liveRegion = el.shadowRoot.querySelector(".sr-only");

      expect(surface.getAttribute("role")).to.equal("alert");
      expect(surface.getAttribute("aria-live")).to.equal("polite");
      expect(liveRegion.getAttribute("role")).to.equal("status");
      expect(liveRegion.getAttribute("aria-live")).to.equal("polite");
    });

    it("updates status live region text on show", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      el.show({ message: "Announcement", duration: 0 });
      await wait();

      const liveRegion = el.shadowRoot.querySelector(".sr-only");
      expect(liveRegion.textContent).to.equal("Announcement");
    });

    it("uses pointer-events none on host and auto on snackbar", async () => {
      const el = await fixture(html`<ds-snackbar></ds-snackbar>`);
      const hostStyles = getComputedStyle(el);
      const surfaceStyles = getComputedStyle(
        el.shadowRoot.querySelector(".snackbar"),
      );

      expect(hostStyles.pointerEvents).to.equal("none");
      expect(surfaceStyles.pointerEvents).to.equal("auto");
    });
  });

  describe("Queue behavior", () => {
    it("queues multiple snackbars and shows sequentially", async () => {
      const wrapper = await fixture(html`
        <div>
          <ds-snackbar id="s1"></ds-snackbar>
          <ds-snackbar id="s2"></ds-snackbar>
        </div>
      `);

      const s1 = wrapper.querySelector("#s1");
      const s2 = wrapper.querySelector("#s2");

      s1.show({ message: "First", duration: 0 });
      await wait();
      s2.show({ message: "Second", duration: 0 });
      await wait();

      expect(
        s1.shadowRoot.querySelector(".snackbar").classList.contains("visible"),
      ).to.equal(true);
      expect(
        s2.shadowRoot.querySelector(".snackbar").classList.contains("visible"),
      ).to.equal(false);

      s1.dismiss();
      await wait(240);

      expect(
        s2.shadowRoot.querySelector(".snackbar").classList.contains("visible"),
      ).to.equal(true);

      s2.dismiss();
      await wait(240);
    });
  });
});
