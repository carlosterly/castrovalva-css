import { expect } from "@open-wc/testing";
import {
  initAnimationPresets,
  animate,
  animateWithClass,
  animateSequence,
  animateSequenceOnElement,
  getPresets,
  getPreset,
  getDuration,
  getEasing,
  createPreset,
  DURATIONS,
  EASINGS,
  PRESETS,
  KEYFRAMES,
} from "../src/utils/animation-presets.js";

describe("Animation Presets Library", () => {
  let testElement;

  before(() => {
    // Initialize once for all tests
    initAnimationPresets();
  });

  beforeEach(() => {
    testElement = document.createElement("div");
    testElement.id = "test-element";
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe("Attributes", () => {
    it("applies animation styles without requiring element attributes", async () => {
      await animate(testElement, "fadeIn", { duration: 50 });
      expect(testElement.style.animation).to.equal("");
    });
  });

  describe("Properties", () => {
    it("exposes preset configuration properties", () => {
      const preset = getPreset("fadeIn");
      expect(preset).to.have.property("name");
      expect(preset).to.have.property("animation");
      expect(preset).to.have.property("duration");
      expect(preset).to.have.property("easing");
    });
  });

  describe("Events", () => {
    it("resolves animation promise when animationend fires", async () => {
      const promise = animate(testElement, "fadeIn", { duration: 50 });
      testElement.dispatchEvent(new Event("animationend"));
      await promise;
      expect(testElement.style.animation).to.equal("");
    });
  });

  describe("Keyboard", () => {
    it("does not block native keyboard events while animating", async () => {
      let pressed = false;
      testElement.tabIndex = 0;
      testElement.addEventListener("keydown", () => {
        pressed = true;
      });

      const animationPromise = animate(testElement, "fadeIn", { duration: 50 });
      testElement.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        }),
      );

      await animationPromise;
      expect(pressed).to.equal(true);
    });
  });

  describe("Accessibility", () => {
    it("allows reduced motion override via custom duration", async () => {
      await animate(testElement, "fadeIn", { duration: 0 });
      expect(testElement.style.animation).to.equal("");
    });
  });

  describe("Initialization", () => {
    it("should initialize animation presets", () => {
      const styleEl = document.getElementById("ds-animation-presets-style");
      expect(styleEl).to.exist;
    });

    it("should inject keyframes into CSS", () => {
      const styleEl = document.getElementById("ds-animation-presets-style");
      expect(styleEl.textContent).to.include("ds-fade-in");
      expect(styleEl.textContent).to.include("ds-slide-in-up");
      expect(styleEl.textContent).to.include("ds-scale-in");
    });

    it("should inject CSS variables for durations", () => {
      const styleEl = document.getElementById("ds-animation-presets-style");
      expect(styleEl.textContent).to.include(
        "--md-sys-motion-duration-medium2",
      );
      expect(styleEl.textContent).to.include("250ms");
    });

    it("should inject CSS variables for easings", () => {
      const styleEl = document.getElementById("ds-animation-presets-style");
      expect(styleEl.textContent).to.include("--md-sys-motion-easing-standard");
      expect(styleEl.textContent).to.include("cubic-bezier");
    });

    it("should create utility classes for presets", () => {
      const styleEl = document.getElementById("ds-animation-presets-style");
      expect(styleEl.textContent).to.include(".ds-animate-fadeIn");
      expect(styleEl.textContent).to.include(".ds-animate-slideInUp");
    });
  });

  describe("DURATIONS", () => {
    it("should export duration constants", () => {
      expect(DURATIONS).to.exist;
      expect(DURATIONS.short1).to.equal(50);
      expect(DURATIONS.short2).to.equal(100);
      expect(DURATIONS.medium2).to.equal(300);
    });

    it("should have 16 duration tokens", () => {
      expect(Object.keys(DURATIONS).length).to.equal(16);
    });

    it("should progressively increase from short to extra-long", () => {
      expect(DURATIONS.short1 < DURATIONS.short2).to.be.true;
      expect(DURATIONS.medium1 < DURATIONS.long1).to.be.true;
      expect(DURATIONS.long4 < DURATIONS.extraLong1).to.be.true;
    });
  });

  describe("EASINGS", () => {
    it("should export easing constants", () => {
      expect(EASINGS).to.exist;
      expect(EASINGS.standard).to.exist;
      expect(EASINGS.emphasized).to.exist;
      expect(EASINGS.emphasizedDecelerate).to.exist;
    });

    it("should have valid cubic-bezier values", () => {
      expect(EASINGS.standard).to.include("cubic-bezier");
      expect(EASINGS.emphasizedDecelerate).to.include("cubic-bezier");
    });
  });

  describe("KEYFRAMES", () => {
    it("should export keyframe definitions", () => {
      expect(KEYFRAMES).to.exist;
      expect(KEYFRAMES.fadeIn).to.exist;
      expect(KEYFRAMES.slideInUp).to.exist;
    });

    it("should have valid CSS keyframe syntax", () => {
      expect(KEYFRAMES.fadeIn).to.include("@keyframes");
      expect(KEYFRAMES.fadeIn).to.include("ds-fade-in");
      expect(KEYFRAMES.fadeIn).to.include("from");
      expect(KEYFRAMES.fadeIn).to.include("to");
    });

    it("should include fade animations", () => {
      expect(KEYFRAMES.fadeIn).to.exist;
      expect(KEYFRAMES.fadeOut).to.exist;
    });

    it("should include slide animations", () => {
      expect(KEYFRAMES.slideInUp).to.exist;
      expect(KEYFRAMES.slideInDown).to.exist;
      expect(KEYFRAMES.slideInLeft).to.exist;
      expect(KEYFRAMES.slideInRight).to.exist;
    });

    it("should include scale animations", () => {
      expect(KEYFRAMES.scaleIn).to.exist;
      expect(KEYFRAMES.scaleOut).to.exist;
    });

    it("should include special animations", () => {
      expect(KEYFRAMES.shake).to.exist;
      expect(KEYFRAMES.pulse).to.exist;
      expect(KEYFRAMES.glow).to.exist;
      expect(KEYFRAMES.shimmer).to.exist;
    });
  });

  describe("PRESETS", () => {
    it("should export preset configurations", () => {
      expect(PRESETS).to.exist;
      expect(Object.keys(PRESETS).length).to.be.greaterThan(20);
    });

    it("each preset should have required properties", () => {
      // Test a sample of presets rather than all to reduce memory usage
      const samplePresets = [
        PRESETS.fadeIn,
        PRESETS.slideInUp,
        PRESETS.scaleIn,
        PRESETS.bounceIn,
        PRESETS.pulse,
      ];
      for (const preset of samplePresets) {
        expect(preset.name).to.exist;
        expect(preset.animation).to.exist;
        expect(preset.duration).to.be.a("number");
        expect(preset.easing).to.exist;
        expect(preset.delay).to.be.a("number");
      }
    });

    it("should have enter and exit animation pairs", () => {
      expect(PRESETS.fadeIn).to.exist;
      expect(PRESETS.fadeOut).to.exist;
      expect(PRESETS.slideInUp).to.exist;
      expect(PRESETS.slideOutDown).to.exist;
    });

    it("should have emphasis animations", () => {
      expect(PRESETS.shake).to.exist;
      expect(PRESETS.pulse).to.exist;
      expect(PRESETS.glow).to.exist;
    });
  });

  describe("animate() function", () => {
    it("should apply animation by preset name", async () => {
      const promise = animate(testElement, "fadeIn");
      expect(testElement.style.animation).to.include("ds-fade-in");
      await promise;
    });

    it("should apply animation with custom options", async () => {
      const promise = animate(testElement, "fadeIn", { duration: 500 });
      expect(testElement.style.animation).to.include("500ms");
      await promise;
    });

    it("should apply animation with custom preset object", async () => {
      const customPreset = {
        animation: "ds-fade-in",
        duration: 400,
        easing: EASINGS.standard,
        delay: 50,
      };
      const promise = animate(testElement, customPreset);
      expect(testElement.style.animation).to.include("400ms");
      expect(testElement.style.animation).to.include("50ms");
      await promise;
    });

    it("should reject if element is missing", async () => {
      try {
        await animate(null, "fadeIn");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("Element is required");
      }
    });

    it("should reject if preset not found", async () => {
      try {
        await animate(testElement, "nonexistentPreset");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("not found");
      }
    });

    it("should support different easing curves", async () => {
      const promise1 = animate(testElement, "fadeIn", {
        easing: EASINGS.standard,
      });
      expect(testElement.style.animation).to.include("cubic-bezier");
      await promise1;

      const promise2 = animate(testElement, "slideInUp", {
        easing: EASINGS.emphasizedDecelerate,
      });
      expect(testElement.style.animation).to.include("cubic-bezier");
      await promise2;
    });

    it("should clear animation after completion", async () => {
      await animate(testElement, "fadeIn", { duration: 50 });
      // Animation style should be cleared after completion
      expect(testElement.style.animation).to.equal("");
    });

    it("should resolve promises in sequence", async () => {
      let counter = 0;
      const increment = () => counter++;

      await animate(testElement, "fadeIn", { duration: 50 }).then(increment);
      expect(counter).to.equal(1);

      await animate(testElement, "slideInUp", { duration: 50 }).then(increment);
      expect(counter).to.equal(2);
    });
  });

  describe("animateWithClass() function", () => {
    it("should add CSS animation class", () => {
      const controller = animateWithClass(testElement, "fadeIn");
      expect(testElement.classList.contains("ds-animate-fadeIn")).to.be.true;
      controller.remove();
    });

    it("should return controller object", () => {
      const controller = animateWithClass(testElement, "fadeIn");
      expect(controller.remove).to.be.a("function");
      expect(controller.pause).to.be.a("function");
      expect(controller.resume).to.be.a("function");
      controller.remove();
    });

    it("should remove animation class", () => {
      const controller = animateWithClass(testElement, "fadeIn");
      controller.remove();
      expect(testElement.classList.contains("ds-animate-fadeIn")).to.be.false;
    });

    it("should pause animation", () => {
      const controller = animateWithClass(testElement, "pulse");
      controller.pause();
      expect(testElement.style.animationPlayState).to.equal("paused");
      controller.remove();
    });

    it("should resume animation", () => {
      const controller = animateWithClass(testElement, "pulse");
      controller.pause();
      controller.resume();
      expect(testElement.style.animationPlayState).to.equal("running");
      controller.remove();
    });

    it("should support infinite animations", () => {
      const controller = animateWithClass(testElement, "pulse");
      expect(testElement.classList.contains("ds-animate-pulse")).to.be.true;
      expect(PRESETS.pulse.fillMode).to.equal("infinite");
      controller.remove();
    });

    it("should throw if element is missing", () => {
      expect(() => {
        animateWithClass(null, "fadeIn");
      }).to.throw();
    });

    it("should throw if preset not found", () => {
      expect(() => {
        animateWithClass(testElement, "nonexistentPreset");
      }).to.throw();
    });
  });

  describe("animateSequence() function", () => {
    it("should animate multiple elements with stagger", async () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
      ];
      elements.forEach((el) => document.body.appendChild(el));

      await animateSequence(elements, "fadeIn", {
        staggerDelay: 50,
        duration: 50,
      });

      elements.forEach((el) => el.remove());
    });

    it("should reject if elements array is empty", async () => {
      try {
        await animateSequence([], "fadeIn");
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("Elements array is required");
      }
    });

    it("should accept custom stagger delay", async () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
      ];
      elements.forEach((el) => document.body.appendChild(el));

      await animateSequence(elements, "fadeIn", {
        staggerDelay: 100,
        duration: 50,
      });

      elements.forEach((el) => el.remove());
    });
  });

  describe("animateSequenceOnElement() function", () => {
    it("should animate element through sequence of presets", async () => {
      const sequence = [{ preset: "fadeIn", duration: 50 }];
      await animateSequenceOnElement(testElement, sequence);
    });

    it("should handle multiple presets in sequence", async () => {
      const sequence = [
        { preset: "fadeIn", duration: 50 },
        { preset: "slideInUp", duration: 50 },
        { preset: "scaleIn", duration: 50 },
      ];
      await animateSequenceOnElement(testElement, sequence);
    });

    it("should reject if element is missing", async () => {
      try {
        await animateSequenceOnElement(null, [{ preset: "fadeIn" }]);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("Element is required");
      }
    });

    it("should reject if sequence is empty", async () => {
      try {
        await animateSequenceOnElement(testElement, []);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("Preset sequence is required");
      }
    });
  });

  describe("getPresets() function", () => {
    it("should return array of preset names", () => {
      const presets = getPresets();
      expect(presets).to.be.an("array");
      expect(presets.length).to.be.greaterThan(20);
    });

    it("should include common presets", () => {
      const presets = getPresets();
      expect(presets).to.include("fadeIn");
      expect(presets).to.include("slideInUp");
      expect(presets).to.include("scaleIn");
    });
  });

  describe("getPreset() function", () => {
    it("should return preset configuration", () => {
      const preset = getPreset("fadeIn");
      expect(preset).to.exist;
      expect(preset.name).to.equal("fadeIn");
      expect(preset.animation).to.equal("ds-fade-in");
    });

    it("should return null for nonexistent preset", () => {
      const preset = getPreset("nonexistent");
      expect(preset).to.be.null;
    });
  });

  describe("getDuration() function", () => {
    it("should return duration in milliseconds", () => {
      expect(getDuration("medium2")).to.equal(300);
      expect(getDuration("short1")).to.equal(50);
    });

    it("should return null for nonexistent duration", () => {
      expect(getDuration("nonexistent")).to.be.null;
    });
  });

  describe("getEasing() function", () => {
    it("should return easing curve", () => {
      const easing = getEasing("standard");
      expect(easing).to.include("cubic-bezier");
    });

    it("should return null for nonexistent easing", () => {
      expect(getEasing("nonexistent")).to.be.null;
    });
  });

  describe("createPreset() function", () => {
    it("should create custom preset", () => {
      const custom = createPreset({
        name: "customAnimation",
        animation: "custom-keyframe",
        duration: 250,
      });
      expect(custom.name).to.equal("customAnimation");
      expect(custom.animation).to.equal("custom-keyframe");
      expect(custom.duration).to.equal(250);
    });

    it("should use default values", () => {
      const custom = createPreset({
        name: "test",
        animation: "test-animation",
      });
      expect(custom.duration).to.equal(DURATIONS.medium2);
      expect(custom.easing).to.equal(EASINGS.standard);
      expect(custom.delay).to.equal(0);
    });

    it("should throw if name is missing", () => {
      expect(() => {
        createPreset({ animation: "test" });
      }).to.throw();
    });

    it("should throw if animation is missing", () => {
      expect(() => {
        createPreset({ name: "test" });
      }).to.throw();
    });
  });

  describe("Animation Types", () => {
    it("should have fade animations", () => {
      expect(PRESETS.fadeIn).to.exist;
      expect(PRESETS.fadeOut).to.exist;
      expect(PRESETS.fadeInQuick).to.exist;
    });

    it("should have slide animations in all directions", () => {
      expect(PRESETS.slideInUp).to.exist;
      expect(PRESETS.slideInDown).to.exist;
      expect(PRESETS.slideInLeft).to.exist;
      expect(PRESETS.slideInRight).to.exist;
    });

    it("should have scale animations", () => {
      expect(PRESETS.scaleIn).to.exist;
      expect(PRESETS.scaleOut).to.exist;
      expect(PRESETS.scaleInFast).to.exist;
    });

    it("should have bounce animations", () => {
      expect(PRESETS.bounceIn).to.exist;
      expect(PRESETS.bounceOut).to.exist;
    });

    it("should have flip animations", () => {
      expect(PRESETS.flipIn).to.exist;
      expect(PRESETS.flipOut).to.exist;
    });

    it("should have rotate animations", () => {
      expect(PRESETS.rotateIn).to.exist;
      expect(PRESETS.rotateOut).to.exist;
    });

    it("should have emphasis animations", () => {
      expect(PRESETS.shake).to.exist;
      expect(PRESETS.pulse).to.exist;
      expect(PRESETS.glow).to.exist;
    });

    it("should have expand/collapse animations", () => {
      expect(PRESETS.expandHeight).to.exist;
      expect(PRESETS.collapseHeight).to.exist;
    });

    it("should have shimmer animation", () => {
      expect(PRESETS.shimmer).to.exist;
    });
  });

  describe("Animation Properties", () => {
    it("should use appropriate durations for entry animations", () => {
      expect(PRESETS.slideInUp.duration).to.equal(DURATIONS.medium3);
      expect(PRESETS.slideInDown.duration).to.equal(DURATIONS.medium3);
    });

    it("should use shorter durations for exit animations", () => {
      expect(PRESETS.slideOutUp.duration).to.be.lessThan(
        PRESETS.slideInUp.duration,
      );
    });

    it("should use emphasized-decelerate for entry animations", () => {
      expect(PRESETS.slideInUp.easing).to.equal(EASINGS.emphasizedDecelerate);
      expect(PRESETS.scaleIn.easing).to.equal(EASINGS.emphasizedDecelerate);
    });

    it("should use emphasized-accelerate for exit animations", () => {
      expect(PRESETS.slideOutUp.easing).to.equal(EASINGS.emphasizedAccelerate);
      expect(PRESETS.scaleOut.easing).to.equal(EASINGS.emphasizedAccelerate);
    });

    it("infinite animations should have proper fillMode", () => {
      expect(PRESETS.pulse.fillMode).to.equal("infinite");
      expect(PRESETS.glow.fillMode).to.equal("infinite");
      expect(PRESETS.shimmer.fillMode).to.equal("infinite");
    });
  });

  describe("Real-world scenarios", () => {
    it("should animate modal entrance", async () => {
      await animate(testElement, "slideInUp", { duration: 50 });
      expect(testElement.style.animation).to.equal("");
    });

    it("should animate loading state", () => {
      const controller = animateWithClass(testElement, "pulse");
      expect(testElement.classList.contains("ds-animate-pulse")).to.be.true;
      controller.remove();
    });

    it("should animate error state", async () => {
      await animate(testElement, "shake", { duration: 50 });
      expect(testElement.style.animation).to.equal("");
    });

    it("should animate list item entrance", async () => {
      const items = Array.from({ length: 3 }, () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        return div;
      });

      await animateSequence(items, "slideInLeft", {
        staggerDelay: 100,
        duration: 50,
      });

      items.forEach((item) => item.remove());
    });

    it("should animate collapsible section", async () => {
      await animate(testElement, "expandHeight", { duration: 50 });
      expect(testElement.style.animation).to.equal("");

      await animate(testElement, "collapseHeight", { duration: 50 });
      expect(testElement.style.animation).to.equal("");
    });
  });
});
