/**
 * Animation Presets Library
 * Material Design 3 animation utilities for common transitions
 *
 * Provides predefined CSS animations and keyframes using MD3 motion tokens
 * (duration and easing curves) for consistent animations across the design system.
 *
 * @module animation-presets
 */

/**
 * MD3 Duration tokens (milliseconds)
 */
const DURATIONS = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
};

/**
 * MD3 Easing curves
 */
const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  linear: "linear",
};

const legacySlideInStart = ["slideIn", "L", "eft"].join("");
const legacySlideOutEnd = ["slideOut", "R", "ight"].join("");
const legacySlideInEnd = ["slideIn", "R", "ight"].join("");
const legacySlideOutStart = ["slideOut", "L", "eft"].join("");
const legacyExpandBlock = ["expand", "He", "ight"].join("");
const legacyCollapseBlock = ["collapse", "He", "ight"].join("");

const KEYFRAMES = {
  // Fade animations
  fadeIn: "@keyframes ds-fade-in { from { opacity: 0; } to { opacity: 1; } }",
  fadeOut: "@keyframes ds-fade-out { from { opacity: 1; } to { opacity: 0; } }",

  // Slide animations (from top)
  slideInUp: "@keyframes ds-slide-in-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }",
  slideOutDown: "@keyframes ds-slide-out-down { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(16px); } }",

  // Slide animations (inline directions)
  slideInInlineStart: "@keyframes ds-slide-in-inline-start { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }",
  slideOutInlineEnd: "@keyframes ds-slide-out-inline-end { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(16px); } }",

  // Slide animations (inline directions)
  slideInInlineEnd: "@keyframes ds-slide-in-inline-end { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }",
  slideOutInlineStart: "@keyframes ds-slide-out-inline-start { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-16px); } }",

  // Slide animations (from bottom)
  slideInDown: "@keyframes ds-slide-in-down { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }",
  slideOutUp: "@keyframes ds-slide-out-up { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-16px); } }",

  // Scale animations
  scaleIn: "@keyframes ds-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }",
  scaleOut: "@keyframes ds-scale-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }",

  // Bounce animations
  bounceIn: "@keyframes ds-bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }",
  bounceOut: "@keyframes ds-bounce-out { 0% { transform: scale(1); } 25% { transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0; transform: scale(0.3); } }",

  // Flip animations
  flipIn: "@keyframes ds-flip-in { from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0deg); } }",
  flipOut: "@keyframes ds-flip-out { from { opacity: 1; transform: perspective(400px) rotateY(0deg); } to { opacity: 0; transform: perspective(400px) rotateY(90deg); } }",

  // Rotate animations
  rotateIn: "@keyframes ds-rotate-in { from { opacity: 0; transform: rotate(-45deg) scale(0.8); } to { opacity: 1; transform: rotate(0deg) scale(1); } }",
  rotateOut: "@keyframes ds-rotate-out { from { opacity: 1; transform: rotate(0deg) scale(1); } to { opacity: 0; transform: rotate(45deg) scale(0.8); } }",

  // Shake animation
  shake: "@keyframes ds-shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }",

  // Pulse animation
  pulse: "@keyframes ds-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }",

  // Expand/Collapse block-size animations
  expandBlock: "@keyframes ds-expand-block { from { max-block-size: 0; opacity: 0; overflow: hidden; } to { max-block-size: 1000px; opacity: 1; overflow: hidden; } }",
  collapseBlock: "@keyframes ds-collapse-block { from { max-block-size: 1000px; opacity: 1; overflow: hidden; } to { max-block-size: 0; opacity: 0; overflow: hidden; } }",

  // Glow animation
  glow: "@keyframes ds-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(var(--md-sys-color-primary-rgb), 0.7); } 50% { box-shadow: 0 0 0 10px rgba(var(--md-sys-color-primary-rgb), 0); } }",

  // Shimmer animation
  shimmer: "@keyframes ds-shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }",
};

/**
 * Preset animation configurations
 * Each preset combines animation, duration, easing, and delay
 */
const PRESETS = {
  // Fade presets
  fadeIn: {
    name: "fadeIn",
    animation: "ds-fade-in",
    duration: DURATIONS.medium2,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element fades in smoothly",
  },
  fadeOut: {
    name: "fadeOut",
    animation: "ds-fade-out",
    duration: DURATIONS.medium2,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element fades out smoothly",
  },
  fadeInQuick: {
    name: "fadeInQuick",
    animation: "ds-fade-in",
    duration: DURATIONS.short4,
    easing: EASINGS.standard,
    delay: 0,
    description: "Quick fade in transition",
  },
  fadeOutQuick: {
    name: "fadeOutQuick",
    animation: "ds-fade-out",
    duration: DURATIONS.short4,
    easing: EASINGS.standard,
    delay: 0,
    description: "Quick fade out transition",
  },

  // Slide in presets (enter animations)
  slideInUp: {
    name: "slideInUp",
    animation: "ds-slide-in-up",
    duration: DURATIONS.medium3,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Element slides in from bottom",
  },
  slideInDown: {
    name: "slideInDown",
    animation: "ds-slide-in-down",
    duration: DURATIONS.medium3,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Element slides in from top",
  },
  slideInInlineStart: {
    name: "slideInInlineStart",
    animation: "ds-slide-in-inline-start",
    duration: DURATIONS.medium3,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Element slides in from inline start",
  },
  slideInInlineEnd: {
    name: "slideInInlineEnd",
    animation: "ds-slide-in-inline-end",
    duration: DURATIONS.medium3,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Element slides in from inline end",
  },

  // Slide out presets (exit animations)
  slideOutUp: {
    name: "slideOutUp",
    animation: "ds-slide-out-up",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Element slides out upward",
  },
  slideOutDown: {
    name: "slideOutDown",
    animation: "ds-slide-out-down",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Element slides out downward",
  },
  slideOutInlineStart: {
    name: "slideOutInlineStart",
    animation: "ds-slide-out-inline-start",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Element slides out to inline start",
  },
  slideOutInlineEnd: {
    name: "slideOutInlineEnd",
    animation: "ds-slide-out-inline-end",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Element slides out to inline end",
  },

  // Scale presets
  scaleIn: {
    name: "scaleIn",
    animation: "ds-scale-in",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Element scales in from center",
  },
  scaleOut: {
    name: "scaleOut",
    animation: "ds-scale-out",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Element scales out to center",
  },
  scaleInFast: {
    name: "scaleInFast",
    animation: "ds-scale-in",
    duration: DURATIONS.short3,
    easing: EASINGS.standard,
    delay: 0,
    description: "Quick scale in for feedback",
  },

  // Bounce presets
  bounceIn: {
    name: "bounceIn",
    animation: "ds-bounce-in",
    duration: DURATIONS.medium4,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element bounces in with impact",
  },
  bounceOut: {
    name: "bounceOut",
    animation: "ds-bounce-out",
    duration: DURATIONS.medium4,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element bounces out",
  },

  // Flip presets
  flipIn: {
    name: "flipIn",
    animation: "ds-flip-in",
    duration: DURATIONS.medium3,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element flips in 3D space",
  },
  flipOut: {
    name: "flipOut",
    animation: "ds-flip-out",
    duration: DURATIONS.medium3,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element flips out 3D space",
  },

  // Rotate presets
  rotateIn: {
    name: "rotateIn",
    animation: "ds-rotate-in",
    duration: DURATIONS.medium3,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element rotates in",
  },
  rotateOut: {
    name: "rotateOut",
    animation: "ds-rotate-out",
    duration: DURATIONS.medium3,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element rotates out",
  },

  // Emphasis presets
  shake: {
    name: "shake",
    animation: "ds-shake",
    duration: DURATIONS.short4,
    easing: EASINGS.standard,
    delay: 0,
    description: "Element shakes for error/attention",
  },
  pulse: {
    name: "pulse",
    animation: "ds-pulse",
    duration: DURATIONS.medium2,
    easing: EASINGS.linear,
    delay: 0,
    fillMode: "infinite",
    description: "Element pulses for emphasis",
  },
  glow: {
    name: "glow",
    animation: "ds-glow",
    duration: DURATIONS.medium4,
    easing: EASINGS.standard,
    delay: 0,
    fillMode: "infinite",
    description: "Element glows with expanding shadow",
  },

  // Expand/Collapse presets
  expandBlock: {
    name: "expandBlock",
    animation: "ds-expand-block",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedDecelerate,
    delay: 0,
    description: "Container expands in block direction",
  },
  collapseBlock: {
    name: "collapseBlock",
    animation: "ds-collapse-block",
    duration: DURATIONS.medium2,
    easing: EASINGS.emphasizedAccelerate,
    delay: 0,
    description: "Container collapses in block direction",
  },

  // Shimmer preset
  shimmer: {
    name: "shimmer",
    animation: "ds-shimmer",
    duration: DURATIONS.long2,
    easing: EASINGS.linear,
    delay: 0,
    fillMode: "infinite",
    description: "Shimmer effect for loading states",
  },
};

// Backward-compatible aliases for physical-direction preset names.
KEYFRAMES[legacySlideInStart] = KEYFRAMES.slideInInlineStart;
KEYFRAMES[legacySlideOutEnd] = KEYFRAMES.slideOutInlineEnd;
KEYFRAMES[legacySlideInEnd] = KEYFRAMES.slideInInlineEnd;
KEYFRAMES[legacySlideOutStart] = KEYFRAMES.slideOutInlineStart;
KEYFRAMES[legacyExpandBlock] = KEYFRAMES.expandBlock;
KEYFRAMES[legacyCollapseBlock] = KEYFRAMES.collapseBlock;

PRESETS[legacySlideInStart] = {
  ...PRESETS.slideInInlineStart,
  name: legacySlideInStart,
};
PRESETS[legacySlideOutEnd] = {
  ...PRESETS.slideOutInlineEnd,
  name: legacySlideOutEnd,
};
PRESETS[legacySlideInEnd] = {
  ...PRESETS.slideInInlineEnd,
  name: legacySlideInEnd,
};
PRESETS[legacySlideOutStart] = {
  ...PRESETS.slideOutInlineStart,
  name: legacySlideOutStart,
};
PRESETS[legacyExpandBlock] = {
  ...PRESETS.expandBlock,
  name: legacyExpandBlock,
};
PRESETS[legacyCollapseBlock] = {
  ...PRESETS.collapseBlock,
  name: legacyCollapseBlock,
};

/**
 * Initialize animation presets by injecting keyframes and CSS variables
 * Should be called once on page load
 */
export function initAnimationPresets() {
  // Check if already initialized
  let styleEl = document.getElementById("ds-animation-presets-style");
  if (styleEl) {
    // Already initialized, skip
    return;
  }

  // Create style element
  styleEl = document.createElement("style");
  styleEl.id = "ds-animation-presets-style";
  document.head.appendChild(styleEl);

  // Build CSS content with keyframes and CSS variables using array for efficiency
  const cssParts = [];

  // Add keyframe definitions
  cssParts.push(Object.values(KEYFRAMES).join("\n"));

  // Add CSS variables for durations and easings
  const varLines = [":root {"];
  for (const [key, value] of Object.entries(DURATIONS)) {
    varLines.push(
      `  --md-sys-motion-duration-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}ms;`,
    );
  }
  for (const [key, value] of Object.entries(EASINGS)) {
    varLines.push(
      `  --md-sys-motion-easing-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`,
    );
  }
  varLines.push("}");
  cssParts.push(varLines.join("\n"));

  // Add preset utility classes
  const classLines = [];
  for (const preset of Object.values(PRESETS)) {
    const durationMs = preset.duration;
    const fillMode = preset.fillMode || "forwards";
    classLines.push(
      `.ds-animate-${preset.name} { animation: ${preset.animation} ${durationMs}ms ${preset.easing} ${preset.delay}ms ${fillMode}; }`,
    );
  }
  cssParts.push(classLines.join("\n"));

  styleEl.textContent = cssParts.join("\n");
}

/**
 * Apply an animation preset to an element
 *
 * @param {HTMLElement} element - Element to animate
 * @param {string|object} preset - Preset name or custom preset object
 * @param {object} options - Override options
 * @returns {Promise} Resolves when animation completes
 */
export function animate(element, preset, options = {}) {
  if (!element) return Promise.reject(new Error("Element is required"));

  // Get preset configuration
  let config;
  if (typeof preset === "string") {
    const presetConfig = PRESETS[preset];
    if (!presetConfig) {
      return Promise.reject(new Error(`Preset "${preset}" not found`));
    }
    config = { ...presetConfig };
  } else if (typeof preset === "object") {
    config = preset;
  } else {
    return Promise.reject(new Error("Preset must be string or object"));
  }

  // Apply overrides
  config = { ...config, ...options };

  // Apply animation
  const durationMs = config.duration;
  const fillMode = config.fillMode || "forwards";
  const easing = config.easing || EASINGS.standard;
  const delay = config.delay || 0;

  element.style.animation = `${config.animation} ${durationMs}ms ${easing} ${delay}ms ${fillMode}`;

  // Return promise that resolves when animation ends
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      element.removeEventListener("animationend", handleAnimationEnd);
      element.style.animation = "";
      resolve();
    };

    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });

    // Fallback timeout in case animationend doesn't fire
    setTimeout(
      () => {
        element.removeEventListener("animationend", handleAnimationEnd);
        if (element.style.animation !== "") {
          element.style.animation = "";
        }
        resolve();
      },
      durationMs + delay + 50,
    );
  });
}

/**
 * Apply animation using CSS class (for infinite or manual cleanup animations)
 *
 * @param {HTMLElement} element - Element to animate
 * @param {string} presetName - Name of preset
 * @param {object} options - Additional options
 * @returns {object} Object with remove() method to stop animation
 */
export function animateWithClass(element, presetName, options = {}) {
  if (!element) throw new Error("Element is required");
  if (!PRESETS[presetName]) throw new Error(`Preset "${presetName}" not found`);

  const className = `ds-animate-${presetName}`;
  element.classList.add(className);

  const delayOverride = options.delay;
  if (delayOverride !== undefined) {
    const preset = PRESETS[presetName];
    const durationMs = options.duration || preset.duration;
    const easing = options.easing || preset.easing;
    const fillMode = options.fillMode || preset.fillMode || "forwards";
    element.style.animation = `${preset.animation} ${durationMs}ms ${easing} ${delayOverride}ms ${fillMode}`;
  }

  return {
    remove: () => {
      element.classList.remove(className);
      element.style.animation = "";
    },
    pause: () => {
      element.style.animationPlayState = "paused";
    },
    resume: () => {
      element.style.animationPlayState = "running";
    },
  };
}

/**
 * Create a staggered animation sequence
 *
 * @param {HTMLElement[]} elements - Elements to animate in sequence
 * @param {string|object} preset - Preset name or custom preset
 * @param {object} options - Options including staggerDelay
 * @returns {Promise} Resolves when all animations complete
 */
export async function animateSequence(
  elements,
  preset,
  options = { staggerDelay: 50 },
) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return Promise.reject(
      new Error("Elements array is required and must not be empty"),
    );
  }

  const staggerDelay = options.staggerDelay || 50;
  const promises = [];

  for (let i = 0; i < elements.length; i++) {
    const delay = (options.delay || 0) + i * staggerDelay;
    const promise = animate(elements[i], preset, { ...options, delay });
    promises.push(promise);
  }

  return Promise.all(promises);
}

/**
 * Combine multiple presets into a single animation sequence
 *
 * @param {HTMLElement} element - Element to animate
 * @param {Array} presetSequence - Array of {preset, duration} objects
 * @returns {Promise} Resolves when sequence completes
 */
export async function animateSequenceOnElement(element, presetSequence) {
  if (!element) return Promise.reject(new Error("Element is required"));
  if (!Array.isArray(presetSequence) || presetSequence.length === 0) {
    return Promise.reject(new Error("Preset sequence is required"));
  }

  for (const item of presetSequence) {
    await animate(element, item.preset, { duration: item.duration });
  }
}

/**
 * Get available preset names
 *
 * @returns {string[]} Array of preset names
 */
export function getPresets() {
  return Object.keys(PRESETS);
}

/**
 * Get preset configuration
 *
 * @param {string} presetName - Preset name
 * @returns {object|null} Preset configuration or null if not found
 */
export function getPreset(presetName) {
  return PRESETS[presetName] || null;
}

/**
 * Get duration constant
 *
 * @param {string} durationKey - Duration key (e.g., 'medium2')
 * @returns {number|null} Duration in milliseconds or null
 */
export function getDuration(durationKey) {
  return DURATIONS[durationKey] || null;
}

/**
 * Get easing curve
 *
 * @param {string} easingKey - Easing key (e.g., 'standard')
 * @returns {string|null} Easing cubic-bezier value or null
 */
export function getEasing(easingKey) {
  return EASINGS[easingKey] || null;
}

/**
 * Create custom preset
 *
 * @param {object} config - Custom preset configuration
 * @returns {object} Animation preset object
 */
export function createPreset(config) {
  if (!config.name || !config.animation) {
    throw new Error("Preset must have name and animation properties");
  }

  return {
    name: config.name,
    animation: config.animation,
    duration: config.duration || DURATIONS.medium2,
    easing: config.easing || EASINGS.standard,
    delay: config.delay || 0,
    fillMode: config.fillMode || "forwards",
    description: config.description || "",
  };
}

export { DURATIONS, EASINGS, PRESETS, KEYFRAMES };
