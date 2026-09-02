import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "../src/components/ds-tooltip.js";

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const setupFixture = async () => {
  const root = await fixture(html`
    <div>
      <button id="target" type="button">Target</button>
      <button id="target-alt" type="button">Target Alt</button>
      <ds-tooltip for="target" delay="0">Help text</ds-tooltip>
    </div>
  `);

  return {
    tooltip: root.querySelector("ds-tooltip"),
    target: root.querySelector("#target"),
    targetAlt: root.querySelector("#target-alt"),
  };
};

describe("DSTooltip", () => {
  describe("Initialization", () => {
    it("renders with default structure", async () => {
      const root = await fixture(html`
        <div>
          <button id="target" type="button">Target</button>
          <ds-tooltip for="target">Tip</ds-tooltip>
        </div>
      `);

      const tooltip = root.querySelector("ds-tooltip");
      expect(tooltip).to.exist;
      expect(tooltip.shadowRoot.querySelector(".tooltip")).to.exist;
    });

    it("registers custom element", async () => {
      await setupFixture();
      expect(customElements.get("ds-tooltip")).to.exist;
    });
  });

  describe("Attributes", () => {
    it("applies valid position attribute", async () => {
      const { tooltip } = await setupFixture();
      tooltip.setAttribute("position", "bottom");
      await wait();
      expect(tooltip.position).to.equal("bottom");
    });

    it("falls back to auto for invalid position", async () => {
      const { tooltip } = await setupFixture();
      tooltip.setAttribute("position", "invalid");
      await wait();
      expect(tooltip.position).to.equal("auto");
    });

    it("coerces delay attribute to number and defaults invalid values", async () => {
      const { tooltip } = await setupFixture();
      tooltip.setAttribute("delay", "120");
      await wait();
      expect(tooltip.delay).to.equal(120);

      tooltip.setAttribute("delay", "-1");
      await wait();
      expect(tooltip.delay).to.equal(500);
    });

    it("updates target when for attribute changes", async () => {
      const { tooltip, targetAlt } = await setupFixture();
      tooltip.setAttribute("for", "target-alt");
      await wait();
      expect(tooltip._targetElement).to.equal(targetAlt);
    });
  });

  describe("Properties", () => {
    it("reflects position property to attribute", async () => {
      const { tooltip } = await setupFixture();
      tooltip.position = "left";
      expect(tooltip.getAttribute("position")).to.equal("left");
    });

    it("removes position attribute when set to empty", async () => {
      const { tooltip } = await setupFixture();
      tooltip.position = "";
      await wait();
      expect(tooltip.hasAttribute("position")).to.equal(false);
      expect(tooltip.position).to.equal("auto");
    });

    it("reflects delay property to attribute and defaults empty values", async () => {
      const { tooltip } = await setupFixture();
      tooltip.delay = 250;
      expect(tooltip.getAttribute("delay")).to.equal("250");
      expect(tooltip.delay).to.equal(250);

      tooltip.delay = "";
      await wait();
      expect(tooltip.hasAttribute("delay")).to.equal(false);
      expect(tooltip.delay).to.equal(500);
    });

    it("uses previous sibling when for is omitted", async () => {
      const root = await fixture(html`
        <div>
          <button id="sibling" type="button">Sibling target</button>
          <ds-tooltip delay="0">Sibling tooltip</ds-tooltip>
        </div>
      `);

      const tooltip = root.querySelector("ds-tooltip");
      const sibling = root.querySelector("#sibling");
      expect(tooltip._targetElement).to.equal(sibling);
    });
  });

  describe("Events", () => {
    it("emits ds-tooltip:show with detail", async () => {
      const { tooltip } = await setupFixture();
      const showEventPromise = oneEvent(tooltip, "ds-tooltip:show");
      tooltip.show();
      const event = await showEventPromise;

      expect(event.detail.targetId).to.equal("target");
      expect(event.detail.position).to.be.a("string");
    });

    it("emits ds-tooltip:hide with detail when visible", async () => {
      const { tooltip } = await setupFixture();
      tooltip.show();
      await wait();

      const hideEventPromise = oneEvent(tooltip, "ds-tooltip:hide");
      tooltip.hide();
      const event = await hideEventPromise;

      expect(event.detail.targetId).to.equal("target");
    });

    it("does not emit hide event when already hidden", async () => {
      const { tooltip } = await setupFixture();
      let emitted = false;

      tooltip.addEventListener("ds-tooltip:hide", () => {
        emitted = true;
      });

      tooltip.hide();
      await wait();
      expect(emitted).to.equal(false);
    });
  });

  describe("Keyboard", () => {
    it("shows tooltip on focus and hides on blur", async () => {
      const { tooltip, target } = await setupFixture();

      target.dispatchEvent(new FocusEvent("focus"));
      await wait();
      const tooltipEl = tooltip.shadowRoot.querySelector(".tooltip");
      expect(tooltipEl.classList.contains("visible")).to.equal(true);

      target.dispatchEvent(new FocusEvent("blur"));
      await wait();
      expect(tooltipEl.classList.contains("visible")).to.equal(false);
    });
  });

  describe("Accessibility", () => {
    it("renders role tooltip and non-interactive pointer behavior", async () => {
      const { tooltip } = await setupFixture();
      const tooltipEl = tooltip.shadowRoot.querySelector(".tooltip");

      expect(tooltipEl.getAttribute("role")).to.equal("tooltip");
      expect(getComputedStyle(tooltipEl).pointerEvents).to.equal("none");
    });

    it("assigns host id and links target via aria-describedby", async () => {
      const { tooltip, target } = await setupFixture();

      expect(tooltip.id).to.match(/^ds-tooltip-/);
      expect(target.getAttribute("aria-describedby")).to.contain(tooltip.id);
    });

    it("removes aria-describedby linkage on disconnect", async () => {
      const { tooltip, target } = await setupFixture();
      const id = tooltip.id;

      tooltip.remove();
      await wait();
      expect(target.getAttribute("aria-describedby") || "").to.not.contain(id);
    });
  });

  describe("Method Branches", () => {
    it("returns opposite positions including default fallback", async () => {
      const { tooltip } = await setupFixture();

      expect(tooltip.getOppositePosition("top")).to.equal("bottom");
      expect(tooltip.getOppositePosition("bottom")).to.equal("top");
      expect(tooltip.getOppositePosition("left")).to.equal("right");
      expect(tooltip.getOppositePosition("right")).to.equal("left");
      expect(tooltip.getOppositePosition("unknown")).to.equal("top");
    });

    it("calculates positions, clipping, and pixel conversion branches", async () => {
      const { tooltip } = await setupFixture();
      const kTop = "top";
      const kLeft = "left";
      const kRight = "right";
      const kBottom = "bottom";
      const kWidth = "width";
      const kHeight = "height";

      const targetRect = {
        [kTop]: 100,
        [kLeft]: 100,
        [kRight]: 180,
        [kBottom]: 140,
        [kWidth]: 80,
        [kHeight]: 40,
      };
      const tooltipRect = {
        [kWidth]: 60,
        [kHeight]: 20,
      };

      const topPos = tooltip.calculatePosition(
        "top",
        targetRect,
        tooltipRect,
        8,
      );
      const bottomPos = tooltip.calculatePosition(
        "bottom",
        targetRect,
        tooltipRect,
        8,
      );
      const leftPos = tooltip.calculatePosition(
        "left",
        targetRect,
        tooltipRect,
        8,
      );
      const rightPos = tooltip.calculatePosition(
        "right",
        targetRect,
        tooltipRect,
        8,
      );

      expect(topPos.top).to.equal(72);
      expect(bottomPos.top).to.equal(148);
      expect(leftPos.left).to.equal(32);
      expect(rightPos.left).to.equal(188);

      const rectSmall = {
        [kWidth]: 40,
        [kHeight]: 20,
      };
      expect(tooltip.isClippedByViewport(10, 10, rectSmall, 300, 200)).to.equal(
        false,
      );
      expect(tooltip.isClippedByViewport(-1, 10, rectSmall, 300, 200)).to.equal(
        true,
      );

      const lessClipped = tooltip.isLessClipped(
        { [kTop]: 10, [kLeft]: 10 },
        { [kTop]: -10, [kLeft]: 10 },
        rectSmall,
        300,
        200,
      );
      expect(lessClipped).to.equal(true);

      expect(tooltip.lengthToPixels("1rem", 8)).to.be.greaterThan(0);
      expect(tooltip.lengthToPixels("bad-value", 8)).to.equal(8);
    });
  });
});
