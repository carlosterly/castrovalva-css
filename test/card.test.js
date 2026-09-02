import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { DSCard } from "../src/components/ds-card.js";

describe("DSCard", () => {
  describe("Initialization", () => {
    it("renders custom element with shadow root", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("defines ds-card custom element", async () => {
      await fixture(html`<ds-card></ds-card>`);
      expect(customElements.get("ds-card")).to.equal(DSCard);
    });

    it("has expected default internal state", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(el._variant).to.equal("elevated");
      expect(el._interactive).to.equal(false);
    });

    it("observes expected attributes", async () => {
      await fixture(html`<ds-card></ds-card>`);
      expect(DSCard.observedAttributes).to.deep.equal([
        "variant",
        "interactive",
      ]);
    });

    it("renders card container", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(el.shadowRoot.querySelector(".card")).to.exist;
    });

    it("renders expected slot structure", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(el.shadowRoot.querySelector('slot[name="media"]')).to.exist;
      expect(el.shadowRoot.querySelector('slot[name="title"]')).to.exist;
      expect(el.shadowRoot.querySelector('slot[name="subhead"]')).to.exist;
      expect(el.shadowRoot.querySelector('slot[name="header-action"]')).to
        .exist;
      expect(el.shadowRoot.querySelector('slot[name="actions"]')).to.exist;
      expect(el.shadowRoot.querySelector("slot:not([name])")).to.exist;
    });

    it("sets default variant data attribute", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("data-variant")).to.equal("elevated");
    });

    it("sets default interactive data attribute as false", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("data-interactive")).to.equal("false");
    });
  });

  describe("Attributes & Properties", () => {
    it("applies variant attribute on initial render", async () => {
      const el = await fixture(html`<ds-card variant="filled"></ds-card>`);
      expect(el.variant).to.equal("filled");
      expect(el._variant).to.equal("filled");
    });

    it("falls back to elevated when variant removed", async () => {
      const el = await fixture(html`<ds-card variant="outlined"></ds-card>`);
      el.removeAttribute("variant");
      expect(el.variant).to.equal("elevated");
    });

    it("accepts custom variant strings as provided", async () => {
      const el = await fixture(html`<ds-card variant="custom"></ds-card>`);
      expect(el.variant).to.equal("custom");
      expect(el.shadowRoot.querySelector(".card").dataset.variant).to.equal(
        "custom",
      );
    });

    it("reflects variant property to attribute", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      el.variant = "outlined";
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("reflects interactive property true to attribute", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      el.interactive = true;
      expect(el.hasAttribute("interactive")).to.equal(true);
    });

    it("reflects interactive property false by removing attribute", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      el.interactive = false;
      expect(el.hasAttribute("interactive")).to.equal(false);
    });

    it("sets internal interactive state when attribute present", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      expect(el.interactive).to.equal(true);
      expect(el._interactive).to.equal(true);
    });

    it("keeps internal interactive state false when attribute absent", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(el.interactive).to.equal(false);
    });

    it("re-renders card data-variant on attribute change", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      el.setAttribute("variant", "filled");
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("data-variant")).to.equal("filled");
    });

    it("re-renders card data-interactive on attribute change", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      el.setAttribute("interactive", "");
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("data-interactive")).to.equal("true");
    });

    it("sets keyboard semantics when interactive", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("tabindex")).to.equal("0");
      expect(card.getAttribute("role")).to.equal("button");
    });

    it("does not set keyboard semantics when non-interactive", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.hasAttribute("tabindex")).to.equal(false);
      expect(card.hasAttribute("role")).to.equal(false);
    });
  });

  describe("Rendering & Slots", () => {
    it("renders title slot content", async () => {
      const el = await fixture(html`
        <ds-card>
          <span slot="title">My Title</span>
        </ds-card>
      `);
      const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
      expect(titleSlot.assignedElements()[0].textContent).to.equal("My Title");
    });

    it("renders subhead slot content", async () => {
      const el = await fixture(html`
        <ds-card>
          <span slot="subhead">My Subhead</span>
        </ds-card>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="subhead"]');
      expect(slot.assignedElements()[0].textContent).to.equal("My Subhead");
    });

    it("renders media slot content", async () => {
      const el = await fixture(html`
        <ds-card>
          <img slot="media" alt="media" src="https://placehold.co/100x80" />
        </ds-card>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="media"]');
      expect(slot.assignedElements()).to.have.length(1);
    });

    it("renders header action slot content", async () => {
      const el = await fixture(html`
        <ds-card>
          <button slot="header-action" type="button">More</button>
        </ds-card>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="header-action"]');
      expect(slot.assignedElements()).to.have.length(1);
    });

    it("renders actions slot content", async () => {
      const el = await fixture(html`
        <ds-card>
          <div slot="actions"><button type="button">Action</button></div>
        </ds-card>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="actions"]');
      expect(slot.assignedElements()).to.have.length(1);
    });

    it("renders default slot content", async () => {
      const el = await fixture(html`<ds-card><p>Body text</p></ds-card>`);
      const slot = el.shadowRoot.querySelector("slot:not([name])");
      expect(slot.assignedElements()[0].textContent).to.equal("Body text");
    });

    it("applies elevated variant dataset", async () => {
      const el = await fixture(html`<ds-card variant="elevated"></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.dataset.variant).to.equal("elevated");
    });

    it("applies filled variant dataset", async () => {
      const el = await fixture(html`<ds-card variant="filled"></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.dataset.variant).to.equal("filled");
    });

    it("applies outlined variant dataset", async () => {
      const el = await fixture(html`<ds-card variant="outlined"></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      expect(card.dataset.variant).to.equal("outlined");
    });

    it("injects sizing token defaults into host styles", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      const style = el.shadowRoot.querySelector("style").textContent;
      expect(style).to.include(
        "--ds-card-touch-target-size: var(--ds-size-hit-area, 40px);",
      );
    });
  });

  describe("Events", () => {
    it("emits ds-card:click on click for interactive card", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      setTimeout(() => card.click());
      const event = await oneEvent(el, "ds-card:click");
      expect(event).to.exist;
    });

    it("does not emit ds-card:click on non-interactive card click", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      let fired = false;
      el.addEventListener("ds-card:click", () => {
        fired = true;
      });
      el.shadowRoot.querySelector(".card").click();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(fired).to.equal(false);
    });

    it("emits bubbling click event", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      setTimeout(() => card.click());
      const event = await oneEvent(el, "ds-card:click");
      expect(event.bubbles).to.equal(true);
    });

    it("emits composed click event", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      setTimeout(() => card.click());
      const event = await oneEvent(el, "ds-card:click");
      expect(event.composed).to.equal(true);
    });

    it("fires click event repeatedly for repeated activations", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      let count = 0;
      el.addEventListener("ds-card:click", () => {
        count += 1;
      });

      const card = el.shadowRoot.querySelector(".card");
      card.click();
      card.click();

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(count).to.equal(2);
    });
  });

  describe("Keyboard Navigation", () => {
    it("emits ds-card:click on Enter key for interactive card", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      setTimeout(() =>
        card.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" })),
      );
      const event = await oneEvent(el, "ds-card:click");
      expect(event).to.exist;
    });

    it("emits ds-card:click on Space key for interactive card", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      setTimeout(() =>
        card.dispatchEvent(new KeyboardEvent("keydown", { key: " " })),
      );
      const event = await oneEvent(el, "ds-card:click");
      expect(event).to.exist;
    });

    it("ignores non-activation keys", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      let fired = false;
      el.addEventListener("ds-card:click", () => {
        fired = true;
      });

      const card = el.shadowRoot.querySelector(".card");
      card.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(fired).to.equal(false);
    });

    it("interactive card can receive focus", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      card.focus();
      expect(el.shadowRoot.activeElement).to.equal(card);
    });

    it("retains keyboard semantics after variant change", async () => {
      const el = await fixture(
        html`<ds-card interactive variant="filled"></ds-card>`,
      );
      el.setAttribute("variant", "outlined");
      const card = el.shadowRoot.querySelector(".card");
      expect(card.getAttribute("tabindex")).to.equal("0");
      expect(card.getAttribute("role")).to.equal("button");
    });
  });

  describe("Accessibility", () => {
    it("uses role button for interactive cards", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      expect(
        el.shadowRoot.querySelector(".card").getAttribute("role"),
      ).to.equal("button");
    });

    it("uses tabindex 0 for interactive cards", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      expect(
        el.shadowRoot.querySelector(".card").getAttribute("tabindex"),
      ).to.equal("0");
    });

    it("does not assign role button to non-interactive cards", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(
        el.shadowRoot.querySelector(".card").hasAttribute("role"),
      ).to.equal(false);
    });

    it("does not assign tabindex to non-interactive cards", async () => {
      const el = await fixture(html`<ds-card></ds-card>`);
      expect(
        el.shadowRoot.querySelector(".card").hasAttribute("tabindex"),
      ).to.equal(false);
    });

    it("keeps media slot element attributes intact", async () => {
      const el = await fixture(html`
        <ds-card>
          <img
            slot="media"
            alt="Descriptive media"
            src="https://placehold.co/120x80" />
        </ds-card>
      `);
      const media = el.querySelector('[slot="media"]');
      expect(media.getAttribute("alt")).to.equal("Descriptive media");
    });

    it("cleanup removes click handler from interactive cards", async () => {
      const el = await fixture(html`<ds-card interactive></ds-card>`);
      const card = el.shadowRoot.querySelector(".card");
      const previousHandler = el._clickHandler;
      el.cleanup();
      card.click();
      expect(el._clickHandler).to.equal(previousHandler);
    });
  });
});
