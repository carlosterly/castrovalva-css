/**
 * Material Design 3 Elevation Utility
 *
 * Provides programmatic control over elevation levels for components.
 * Elevation is represented through shadow depth (0-5 levels).
 *
 * @module elevation
 */

/**
 * Elevation levels with corresponding box-shadow values
 * Based on Material Design 3 specification
 */
export const ELEVATION_LEVELS = {
  0: "none",
  1: "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
  2: "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
  3: "0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
  4: "0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)",
  5: "0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)",
};

/**
 * CSS Custom Property names for elevation levels
 */
export const ELEVATION_CSS_VARS = {
  0: "--md-sys-elevation-level0",
  1: "--md-sys-elevation-level1",
  2: "--md-sys-elevation-level2",
  3: "--md-sys-elevation-level3",
  4: "--md-sys-elevation-level4",
  5: "--md-sys-elevation-level5",
};

/**
 * Get the box-shadow value for a given elevation level
 *
 * @param {number} level - Elevation level (0-5)
 * @returns {string} Box-shadow value or 'none' for level 0
 * @throws {Error} If level is not between 0 and 5
 *
 * @example
 * getElevation(2); // Returns the shadow for level 2
 * const shadow = getElevation(4);
 * element.style.boxShadow = shadow;
 */
export function getElevation(level) {
  if (
    typeof level !== "number" ||
    level < 0 ||
    level > 5 ||
    !Number.isInteger(level)
  ) {
    throw new Error(
      `Elevation level must be an integer between 0 and 5, got ${level}`,
    );
  }

  return ELEVATION_LEVELS[level];
}

/**
 * Get the CSS custom property name for a given elevation level
 *
 * @param {number} level - Elevation level (0-5)
 * @returns {string} CSS custom property name (e.g., '--md-sys-elevation-level2')
 * @throws {Error} If level is not between 0 and 5
 *
 * @example
 * getCSSVariable(3); // Returns '--md-sys-elevation-level3'
 * element.style.boxShadow = `var(${getCSSVariable(3)})`;
 */
export function getCSSVariable(level) {
  if (
    typeof level !== "number" ||
    level < 0 ||
    level > 5 ||
    !Number.isInteger(level)
  ) {
    throw new Error(
      `Elevation level must be an integer between 0 and 5, got ${level}`,
    );
  }

  return ELEVATION_CSS_VARS[level];
}

/**
 * Apply elevation to an element via box-shadow
 *
 * @param {HTMLElement} element - The element to apply elevation to
 * @param {number} level - Elevation level (0-5)
 * @throws {Error} If element is not an HTMLElement
 * @throws {Error} If level is not between 0 and 5
 *
 * @example
 * const card = document.querySelector('.my-card');
 * applyElevation(card, 2);
 *
 * // Later, update elevation
 * applyElevation(card, 4);
 */
export function applyElevation(element, level) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("First argument must be an HTMLElement");
  }

  const shadow = getElevation(level);
  element.style.boxShadow = shadow;
}

/**
 * Apply elevation using CSS custom property (uses design token)
 *
 * @param {HTMLElement} element - The element to apply elevation to
 * @param {number} level - Elevation level (0-5)
 * @throws {Error} If element is not an HTMLElement
 * @throws {Error} If level is not between 0 and 5
 *
 * @example
 * const card = document.querySelector('.my-card');
 * applyElevationVar(card, 2);
 *
 * // Uses the design token, so changes to the token affect all elements
 */
export function applyElevationVar(element, level) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("First argument must be an HTMLElement");
  }

  const cssVar = getCSSVariable(level);
  element.style.boxShadow = `var(${cssVar})`;
}

/**
 * Remove elevation from an element (resets box-shadow to default)
 *
 * @param {HTMLElement} element - The element to remove elevation from
 * @throws {Error} If element is not an HTMLElement
 *
 * @example
 * const card = document.querySelector('.my-card');
 * removeElevation(card);
 */
export function removeElevation(element) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("First argument must be an HTMLElement");
  }

  element.style.boxShadow = "";
}

/**
 * Get the current elevation level from an element
 *
 * @param {HTMLElement} element - The element to check
 * @returns {number|null} Elevation level (0-5) or null if not found
 * @throws {Error} If element is not an HTMLElement
 *
 * @example
 * const card = document.querySelector('.my-card');
 * const level = getElementElevation(card); // Returns 2 if at level 2
 *
 * // Note: This checks against the static shadow values, not CSS variables
 * // If the shadow was set via CSS variable, may return null
 */
export function getElementElevation(element) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("First argument must be an HTMLElement");
  }

  const shadow = element.style.boxShadow;
  if (!shadow) return null;

  const normalizeShadow = (value) => {
    const temp = document.createElement("div");
    temp.style.boxShadow = value;
    return temp.style.boxShadow;
  };

  const normalizedCurrent = normalizeShadow(shadow);

  // Find matching elevation level
  for (const [level, shadowValue] of Object.entries(ELEVATION_LEVELS)) {
    if (normalizeShadow(shadowValue) === normalizedCurrent) {
      return parseInt(level);
    }
  }

  return null;
}

/**
 * Apply elevation with smooth transition
 *
 * @param {HTMLElement} element - The element to apply elevation to
 * @param {number} fromLevel - Starting elevation level (0-5)
 * @param {number} toLevel - Target elevation level (0-5)
 * @param {number} duration - Transition duration in milliseconds (default: 300)
 * @throws {Error} If element is not an HTMLElement
 * @throws {Error} If levels are not between 0 and 5
 *
 * @example
 * const card = document.querySelector('.my-card');
 * // Animate elevation on hover
 * card.addEventListener('mouseenter', () => {
 *   applyElevationWithTransition(card, 0, 2, 200);
 * });
 */
export function applyElevationWithTransition(
  element,
  fromLevel,
  toLevel,
  duration = 300,
) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("First argument must be an HTMLElement");
  }

  // Validate levels
  getElevation(fromLevel);
  getElevation(toLevel);

  // Set initial elevation
  applyElevation(element, fromLevel);

  // Add transition
  const originalTransition = element.style.transition;
  element.style.transition = `box-shadow ${duration}ms cubic-bezier(0.2, 0, 0, 1)`;

  // Schedule elevation change
  requestAnimationFrame(() => {
    applyElevation(element, toLevel);
  });

  // Clean up transition after animation completes
  setTimeout(() => {
    element.style.transition = originalTransition;
  }, duration);
}

/**
 * Create a class-based elevation system for managing elevation on interactive elements
 *
 * @class ElevationManager
 * @example
 * const card = document.querySelector('.my-card');
 * const manager = new ElevationManager(card, {
 *   defaultLevel: 0,
 *   hoverLevel: 2,
 *   activeLevel: 3,
 *   duration: 200
 * });
 */
export class ElevationManager {
  /**
   * Create an ElevationManager instance
   *
   * @param {HTMLElement} element - The element to manage elevation for
   * @param {Object} options - Configuration options
   * @param {number} options.defaultLevel - Default elevation level (default: 0)
   * @param {number} options.hoverLevel - Elevation level on hover (default: 2)
   * @param {number} options.activeLevel - Elevation level when active (default: 3)
   * @param {number} options.focusLevel - Elevation level on focus (default: 2)
   * @param {number} options.duration - Transition duration in ms (default: 300)
   * @throws {Error} If element is not an HTMLElement
   */
  constructor(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("First argument must be an HTMLElement");
    }

    this.element = element;
    this.defaultLevel = options.defaultLevel ?? 0;
    this.hoverLevel = options.hoverLevel ?? 2;
    this.activeLevel = options.activeLevel ?? 3;
    this.focusLevel = options.focusLevel ?? 2;
    this.duration = options.duration ?? 300;
    this.currentLevel = this.defaultLevel;

    // Validate levels
    getElevation(this.defaultLevel);
    getElevation(this.hoverLevel);
    getElevation(this.activeLevel);
    getElevation(this.focusLevel);

    // Apply initial elevation
    applyElevation(this.element, this.defaultLevel);

    // Bind methods
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.attach();
  }

  /**
   * Attach event listeners to the element
   * @private
   */
  attach() {
    this.element.addEventListener("mouseenter", this.handleMouseEnter);
    this.element.addEventListener("mouseleave", this.handleMouseLeave);
    this.element.addEventListener("mousedown", this.handleMouseDown);
    this.element.addEventListener("mouseup", this.handleMouseUp);
    this.element.addEventListener("focus", this.handleFocus);
    this.element.addEventListener("blur", this.handleBlur);
  }

  /**
   * Detach event listeners from the element
   */
  detach() {
    this.element.removeEventListener("mouseenter", this.handleMouseEnter);
    this.element.removeEventListener("mouseleave", this.handleMouseLeave);
    this.element.removeEventListener("mousedown", this.handleMouseDown);
    this.element.removeEventListener("mouseup", this.handleMouseUp);
    this.element.removeEventListener("focus", this.handleFocus);
    this.element.removeEventListener("blur", this.handleBlur);
  }

  /**
   * Handle mouse enter event
   * @private
   */
  handleMouseEnter() {
    this.setElevation(this.hoverLevel);
  }

  /**
   * Handle mouse leave event
   * @private
   */
  handleMouseLeave() {
    this.setElevation(this.defaultLevel);
  }

  /**
   * Handle mouse down event
   * @private
   */
  handleMouseDown() {
    this.setElevation(this.activeLevel);
  }

  /**
   * Handle mouse up event
   * @private
   */
  handleMouseUp() {
    if (this.element.matches(":hover")) {
      this.setElevation(this.hoverLevel);
    } else {
      this.setElevation(this.defaultLevel);
    }
  }

  /**
   * Handle focus event
   * @private
   */
  handleFocus() {
    this.setElevation(this.focusLevel);
  }

  /**
   * Handle blur event
   * @private
   */
  handleBlur() {
    this.setElevation(this.defaultLevel);
  }

  /**
   * Set elevation level with transition
   *
   * @param {number} level - Target elevation level (0-5)
   */
  setElevation(level) {
    if (this.currentLevel !== level) {
      applyElevationWithTransition(
        this.element,
        this.currentLevel,
        level,
        this.duration,
      );
      this.currentLevel = level;
    }
  }

  /**
   * Get current elevation level
   *
   * @returns {number} Current elevation level
   */
  getElevation() {
    return this.currentLevel;
  }

  /**
   * Reset to default elevation level
   */
  reset() {
    this.setElevation(this.defaultLevel);
  }

  /**
   * Update configuration options
   *
   * @param {Object} options - New options to merge with existing
   */
  updateOptions(options = {}) {
    if ("defaultLevel" in options) {
      getElevation(options.defaultLevel);
      this.defaultLevel = options.defaultLevel;
    }
    if ("hoverLevel" in options) {
      getElevation(options.hoverLevel);
      this.hoverLevel = options.hoverLevel;
    }
    if ("activeLevel" in options) {
      getElevation(options.activeLevel);
      this.activeLevel = options.activeLevel;
    }
    if ("focusLevel" in options) {
      getElevation(options.focusLevel);
      this.focusLevel = options.focusLevel;
    }
    if ("duration" in options) {
      this.duration = options.duration;
    }
  }
}

export default {
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
};
