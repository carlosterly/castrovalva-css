import { expect } from "@open-wc/testing";
import {
  ELEVATION_LEVELS,
  ELEVATION_CSS_VARS,
  getElevation,
  getCSSVariable,
  applyElevation,
  applyElevationVar,
  removeElevation,
  getElementElevation,
  applyElevationWithTransition,
  ElevationManager,
} from "../src/utils/elevation.js";

const normalizeShadow = (shadow) => {
  const temp = document.createElement("div");
  temp.style.boxShadow = shadow;
  return temp.style.boxShadow;
};

describe("Elevation Utility", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("Constants", () => {
    it("exports all 6 elevation levels (0-5)", () => {
      expect(Object.keys(ELEVATION_LEVELS)).to.have.lengthOf(6);
      for (let i = 0; i <= 5; i++) {
        expect(ELEVATION_LEVELS[i]).to.exist;
      }
    });

    it("exports CSS variable names for all levels", () => {
      expect(Object.keys(ELEVATION_CSS_VARS)).to.have.lengthOf(6);
      for (let i = 0; i <= 5; i++) {
        expect(ELEVATION_CSS_VARS[i]).to.equal(`--md-sys-elevation-level${i}`);
      }
    });

    it("elevation level 0 is none", () => {
      expect(ELEVATION_LEVELS[0]).to.equal("none");
    });

    it("elevation levels have box-shadow values", () => {
      for (let i = 1; i <= 5; i++) {
        expect(ELEVATION_LEVELS[i]).to.include("rgba(0, 0, 0,");
        expect(ELEVATION_LEVELS[i]).to.include("0px");
      }
    });
  });

  describe("getElevation()", () => {
    it("returns correct shadow value for each level", () => {
      expect(getElevation(0)).to.equal(ELEVATION_LEVELS[0]);
      expect(getElevation(1)).to.equal(ELEVATION_LEVELS[1]);
      expect(getElevation(2)).to.equal(ELEVATION_LEVELS[2]);
      expect(getElevation(3)).to.equal(ELEVATION_LEVELS[3]);
      expect(getElevation(4)).to.equal(ELEVATION_LEVELS[4]);
      expect(getElevation(5)).to.equal(ELEVATION_LEVELS[5]);
    });

    it("throws error for negative level", () => {
      expect(() => getElevation(-1)).to.throw();
    });

    it("throws error for level > 5", () => {
      expect(() => getElevation(6)).to.throw();
    });

    it("throws error for non-integer level", () => {
      expect(() => getElevation(2.5)).to.throw();
      expect(() => getElevation(NaN)).to.throw();
    });

    it("throws error for non-number level", () => {
      expect(() => getElevation("2")).to.throw();
      expect(() => getElevation(null)).to.throw();
      expect(() => getElevation(undefined)).to.throw();
    });
  });

  describe("getCSSVariable()", () => {
    it("returns correct CSS variable for each level", () => {
      expect(getCSSVariable(0)).to.equal("--md-sys-elevation-level0");
      expect(getCSSVariable(1)).to.equal("--md-sys-elevation-level1");
      expect(getCSSVariable(2)).to.equal("--md-sys-elevation-level2");
      expect(getCSSVariable(3)).to.equal("--md-sys-elevation-level3");
      expect(getCSSVariable(4)).to.equal("--md-sys-elevation-level4");
      expect(getCSSVariable(5)).to.equal("--md-sys-elevation-level5");
    });

    it("throws error for invalid levels", () => {
      expect(() => getCSSVariable(-1)).to.throw();
      expect(() => getCSSVariable(6)).to.throw();
      expect(() => getCSSVariable("2")).to.throw();
    });
  });

  describe("applyElevation()", () => {
    it("applies box-shadow to element", () => {
      applyElevation(element, 2);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[2]),
      );
    });

    it("updates elevation on multiple calls", () => {
      applyElevation(element, 1);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[1]),
      );

      applyElevation(element, 4);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[4]),
      );
    });

    it("applies level 0 (no shadow)", () => {
      applyElevation(element, 2);
      applyElevation(element, 0);
      expect(element.style.boxShadow).to.equal("none");
    });

    it("throws error if element is not HTMLElement", () => {
      expect(() => applyElevation({}, 2)).to.throw();
      expect(() => applyElevation(null, 2)).to.throw();
      expect(() => applyElevation("div", 2)).to.throw();
    });

    it("throws error for invalid elevation level", () => {
      expect(() => applyElevation(element, 6)).to.throw();
      expect(() => applyElevation(element, -1)).to.throw();
    });
  });

  describe("applyElevationVar()", () => {
    it("applies CSS variable to element", () => {
      applyElevationVar(element, 2);
      expect(element.style.boxShadow).to.equal(
        "var(--md-sys-elevation-level2)",
      );
    });

    it("uses design token for elevation", () => {
      applyElevationVar(element, 3);
      expect(element.style.boxShadow).to.include("var(");
      expect(element.style.boxShadow).to.include("--md-sys-elevation-level3");
    });

    it("updates elevation via CSS variable", () => {
      applyElevationVar(element, 1);
      expect(element.style.boxShadow).to.equal(
        "var(--md-sys-elevation-level1)",
      );

      applyElevationVar(element, 5);
      expect(element.style.boxShadow).to.equal(
        "var(--md-sys-elevation-level5)",
      );
    });

    it("throws error for invalid element", () => {
      expect(() => applyElevationVar({}, 2)).to.throw();
    });

    it("throws error for invalid level", () => {
      expect(() => applyElevationVar(element, 6)).to.throw();
    });
  });

  describe("removeElevation()", () => {
    it("removes elevation by clearing box-shadow", () => {
      applyElevation(element, 2);
      removeElevation(element);
      expect(element.style.boxShadow).to.equal("");
    });

    it("is idempotent", () => {
      removeElevation(element);
      removeElevation(element);
      expect(element.style.boxShadow).to.equal("");
    });

    it("throws error for invalid element", () => {
      expect(() => removeElevation(null)).to.throw();
    });
  });

  describe("getElementElevation()", () => {
    it("returns elevation level from element", () => {
      applyElevation(element, 2);
      expect(getElementElevation(element)).to.equal(2);
    });

    it("returns correct level for all levels 0-5", () => {
      for (let i = 0; i <= 5; i++) {
        applyElevation(element, i);
        expect(getElementElevation(element)).to.equal(i);
      }
    });

    it("returns null when element has no elevation", () => {
      expect(getElementElevation(element)).to.equal(null);
    });

    it("returns null for custom shadow values", () => {
      element.style.boxShadow = "0px 0px 10px blue";
      expect(getElementElevation(element)).to.equal(null);
    });

    it("throws error for invalid element", () => {
      expect(() => getElementElevation(null)).to.throw();
    });
  });

  describe("applyElevationWithTransition()", () => {
    it("applies initial elevation", () => {
      applyElevationWithTransition(element, 0, 2, 100);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[0]),
      );
    });

    it("applies target elevation after delay", async () => {
      applyElevationWithTransition(element, 0, 2, 100);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[2]),
      );
    });

    it("adds transition style", () => {
      applyElevationWithTransition(element, 0, 2, 200);
      expect(element.style.transition).to.include("box-shadow");
      expect(element.style.transition).to.include("200ms");
    });

    it("removes transition after animation completes", async () => {
      const originalTransition = "color 300ms";
      element.style.transition = originalTransition;
      applyElevationWithTransition(element, 0, 2, 100);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(element.style.transition).to.equal(originalTransition);
    });

    it("throws error for invalid element", () => {
      expect(() => applyElevationWithTransition(null, 0, 2)).to.throw();
    });

    it("throws error for invalid levels", () => {
      expect(() => applyElevationWithTransition(element, -1, 2)).to.throw();
      expect(() => applyElevationWithTransition(element, 0, 6)).to.throw();
    });
  });

  describe("ElevationManager", () => {
    it("creates manager instance with default options", () => {
      const manager = new ElevationManager(element);
      expect(manager.element).to.equal(element);
      expect(manager.defaultLevel).to.equal(0);
      expect(manager.hoverLevel).to.equal(2);
      expect(manager.activeLevel).to.equal(3);
      expect(manager.focusLevel).to.equal(2);
      expect(manager.duration).to.equal(300);
      manager.detach();
    });

    it("applies custom options", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 1,
        hoverLevel: 3,
        activeLevel: 4,
        focusLevel: 3,
        duration: 200,
      });
      expect(manager.defaultLevel).to.equal(1);
      expect(manager.hoverLevel).to.equal(3);
      expect(manager.activeLevel).to.equal(4);
      expect(manager.focusLevel).to.equal(3);
      expect(manager.duration).to.equal(200);
      manager.detach();
    });

    it("applies initial elevation", () => {
      const manager = new ElevationManager(element, { defaultLevel: 1 });
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[1]),
      );
      manager.detach();
    });

    it("raises elevation on mouseenter", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        hoverLevel: 2,
      });
      element.dispatchEvent(new MouseEvent("mouseenter"));
      expect(manager.currentLevel).to.equal(2);
      manager.detach();
    });

    it("restores elevation on mouseleave", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        hoverLevel: 2,
      });
      element.dispatchEvent(new MouseEvent("mouseenter"));
      element.dispatchEvent(new MouseEvent("mouseleave"));
      expect(manager.currentLevel).to.equal(0);
      manager.detach();
    });

    it("raises elevation on mousedown", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        activeLevel: 4,
      });
      element.dispatchEvent(new MouseEvent("mousedown"));
      expect(manager.currentLevel).to.equal(4);
      manager.detach();
    });

    it("restores elevation on mouseup", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        hoverLevel: 2,
        activeLevel: 4,
      });
      element.dispatchEvent(new MouseEvent("mousedown"));
      expect(manager.currentLevel).to.equal(4);
      element.dispatchEvent(new MouseEvent("mouseup"));
      // After mouseup and not hovering, should return to default
      expect(manager.currentLevel).to.equal(0);
      manager.detach();
    });

    it("raises elevation on focus", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        focusLevel: 2,
      });
      element.dispatchEvent(new FocusEvent("focus"));
      expect(manager.currentLevel).to.equal(2);
      manager.detach();
    });

    it("restores elevation on blur", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        focusLevel: 2,
      });
      element.dispatchEvent(new FocusEvent("focus"));
      element.dispatchEvent(new FocusEvent("blur"));
      expect(manager.currentLevel).to.equal(0);
      manager.detach();
    });

    it("setElevation() changes elevation with transition", () => {
      const manager = new ElevationManager(element, { defaultLevel: 0 });
      manager.setElevation(3);
      expect(manager.currentLevel).to.equal(3);
      manager.detach();
    });

    it("getElevation() returns current level", () => {
      const manager = new ElevationManager(element, { defaultLevel: 1 });
      expect(manager.getElevation()).to.equal(1);
      manager.setElevation(3);
      expect(manager.getElevation()).to.equal(3);
      manager.detach();
    });

    it("reset() restores default elevation", () => {
      const manager = new ElevationManager(element, { defaultLevel: 1 });
      manager.setElevation(4);
      manager.reset();
      expect(manager.currentLevel).to.equal(1);
      manager.detach();
    });

    it("updateOptions() merges new options", () => {
      const manager = new ElevationManager(element, {
        defaultLevel: 0,
        hoverLevel: 2,
      });
      manager.updateOptions({ hoverLevel: 4, duration: 150 });
      expect(manager.hoverLevel).to.equal(4);
      expect(manager.duration).to.equal(150);
      expect(manager.defaultLevel).to.equal(0);
      manager.detach();
    });

    it("detach() removes event listeners", () => {
      const manager = new ElevationManager(element);
      manager.detach();
      element.dispatchEvent(new MouseEvent("mouseenter"));
      expect(manager.currentLevel).to.equal(manager.defaultLevel);
    });

    it("throws error for invalid element", () => {
      expect(() => new ElevationManager(null)).to.throw();
      expect(() => new ElevationManager("div")).to.throw();
    });

    it("throws error for invalid options", () => {
      expect(
        () => new ElevationManager(element, { defaultLevel: 6 }),
      ).to.throw();
      expect(
        () => new ElevationManager(element, { hoverLevel: -1 }),
      ).to.throw();
    });
  });

  describe("Integration Tests", () => {
    it("allows switching between methods (direct vs variable)", () => {
      applyElevation(element, 2);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[2]),
      );

      applyElevationVar(element, 3);
      expect(element.style.boxShadow).to.equal(
        "var(--md-sys-elevation-level3)",
      );

      applyElevation(element, 1);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[1]),
      );
    });

    it("works with ElevationManager and manual elevation changes", async () => {
      const manager = new ElevationManager(element, { defaultLevel: 0 });
      manager.setElevation(2);

      applyElevation(element, 4);
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[4]),
      );

      manager.reset();
      await new Promise((resolve) =>
        setTimeout(resolve, manager.duration + 40),
      );
      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[0]),
      );
      manager.detach();
    });

    it("handles multiple elements independently", () => {
      const element2 = document.createElement("div");
      document.body.appendChild(element2);

      applyElevation(element, 2);
      applyElevation(element2, 4);

      expect(element.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[2]),
      );
      expect(element2.style.boxShadow).to.equal(
        normalizeShadow(ELEVATION_LEVELS[4]),
      );

      element2.remove();
    });
  });
});
