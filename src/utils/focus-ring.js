// Material Design 3 focus ring utility
// Applies a consistent, keyboard-friendly focus ring using :focus-visible

const teardownMap = new WeakMap();
let hadKeyboardEvent = false;
let globalListenersAdded = false;

const defaultConfig = {
  color: "var(--ds-focus-ring-color)",
  ringSize: "var(--ds-focus-ring-width)",
  offset: "var(--ds-focus-ring-offset)",
  radius: "var(--ds-focus-ring-radius)",
};

function handleKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) return;
  hadKeyboardEvent = true;
}

function handlePointerDown() {
  hadKeyboardEvent = false;
}

function ensureGlobalListeners() {
  if (globalListenersAdded) return;
  globalListenersAdded = true;

  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("mousedown", handlePointerDown, true);
  window.addEventListener("pointerdown", handlePointerDown, true);
  window.addEventListener("touchstart", handlePointerDown, true);
}

function setCustomProperties(target, options) {
  const legacyWidth = options["width"];
  const legacyRingWidth = options["ringWidth"];

  const merged = {
    color:
      options.color ?? target.dataset.focusRingColor ?? defaultConfig.color,
    ringSize:
      options.ringSize ??
      legacyRingWidth ??
      legacyWidth ??
      target.dataset.focusRingWidth ??
      defaultConfig.ringSize,
    offset:
      options.offset ?? target.dataset.focusRingOffset ?? defaultConfig.offset,
    radius:
      options.radius ?? target.dataset.focusRingRadius ?? defaultConfig.radius,
  };

  target.style.setProperty("--ds-focus-ring-color", merged.color);
  target.style.setProperty("--ds-focus-ring-width", merged.ringSize);
  target.style.setProperty("--ds-focus-ring-offset", merged.offset);
  target.style.setProperty("--ds-focus-ring-radius", merged.radius);
}

function applyFocusRing(target, options = {}) {
  if (!target) return () => {};

  ensureGlobalListeners();
  setCustomProperties(target, options);

  const showRing = () => {
    const shouldShow = target.matches(":focus-visible") || hadKeyboardEvent;

    if (shouldShow) {
      target.classList.add("ds-focus-visible");
    }
  };

  const hideRing = () => {
    target.classList.remove("ds-focus-visible");
  };

  target.classList.add("ds-focus-ring-target");
  target.addEventListener("focus", showRing);
  target.addEventListener("blur", hideRing);

  const teardown = () => {
    target.classList.remove("ds-focus-ring-target", "ds-focus-visible");
    target.removeEventListener("focus", showRing);
    target.removeEventListener("blur", hideRing);
    teardownMap.delete(target);
  };

  teardownMap.set(target, teardown);
  return teardown;
}

function removeFocusRing(target) {
  const teardown = teardownMap.get(target);
  if (teardown) teardown();
}

function initFocusRings(root = document) {
  ensureGlobalListeners();

  const elements = root.querySelectorAll("[data-focus-ring]");
  elements.forEach((element) => {
    if (!teardownMap.has(element)) {
      applyFocusRing(element);
    }
  });

  return elements.length;
}

if (typeof document !== "undefined") {
  const bootstrap = () => initFocusRings();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
}

export { applyFocusRing, initFocusRings, removeFocusRing };
