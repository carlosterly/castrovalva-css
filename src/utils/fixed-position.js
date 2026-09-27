/**
 * Fixed-position placement utility
 *
 * Places a `position: fixed` element at viewport coordinates taken from
 * `getBoundingClientRect()`.
 *
 * Setting `left`/`top` directly is not enough: a fixed element is laid out
 * against its containing block, which is not always the viewport origin. A
 * transformed or filtered ancestor moves it, as does a left scrollbar gutter
 * (`scrollbar-gutter: stable both-edges`, which this site used to set).
 *
 * The containing block's origin is measured with a zero-size fixed probe
 * inserted beside the element, rather than by measuring the element itself —
 * the element may still be `display: none`, or mid-way through a transform
 * animation, when it is positioned.
 *
 * @module fixed-position
 */

/**
 * Position a fixed element so its layout box starts at the given viewport
 * coordinates.
 *
 * @param {HTMLElement} el - Element with `position: fixed`
 * @param {number} left - Target viewport x, as from getBoundingClientRect()
 * @param {number} top - Target viewport y, as from getBoundingClientRect()
 */
export function placeFixed(el, left, top) {
  let originX = 0;
  let originY = 0;

  const parent = el.parentNode;
  if (parent) {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;";
    parent.insertBefore(probe, el);
    const origin = probe.getBoundingClientRect();
    probe.remove();
    originX = origin.left;
    originY = origin.top;
  }

  el.style.left = `${left - originX}px`;
  el.style.top = `${top - originY}px`;
}

/**
 * Place a fixed popup against its anchor — below or above it, aligned to
 * one edge — flipping to the other side when it doesn't fit and keeping it
 * inside the viewport. The popup must be rendered (not `display: none`) so
 * it can be measured.
 *
 * Popups anchored this way escape any clipping or scrolling ancestor, which
 * a `position: absolute` popup can't.
 *
 * @param {HTMLElement} el - Popup with `position: fixed`
 * @param {DOMRect} anchor - The anchor's getBoundingClientRect()
 * @param {object} [options]
 * @param {"bottom"|"top"} [options.side="bottom"] - Preferred side
 * @param {"start"|"end"} [options.align="start"] - Anchor edge to align to
 * @param {number} [options.gap=0] - Space between anchor and popup
 * @param {number} [options.margin=8] - Minimum distance from viewport edges
 * @param {boolean} [options.matchWidth=false] - Size the popup to the anchor
 * @returns {"bottom"|"top"} The side actually used
 */
export function placeAnchored(el, anchor, options = {}) {
  const {
    side = "bottom",
    align = "start",
    gap = 0,
    margin = 8,
    matchWidth = false,
  } = options;

  if (matchWidth) {
    el.style.boxSizing = "border-box";
    el.style.width = `${anchor.width}px`;
  }

  const { clientWidth, clientHeight } = document.documentElement;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const below = anchor.bottom + gap;
  const above = anchor.top - gap - height;
  const fitsBelow = below + height <= clientHeight - margin;
  const fitsAbove = above >= margin;

  let used = side;
  if (side === "bottom" && !fitsBelow && fitsAbove) used = "top";
  if (side === "top" && !fitsAbove && fitsBelow) used = "bottom";

  let left = align === "end" ? anchor.right - width : anchor.left;
  let top = used === "top" ? above : below;
  left = Math.max(margin, Math.min(left, clientWidth - width - margin));
  top = Math.max(margin, Math.min(top, clientHeight - height - margin));

  placeFixed(el, left, top);
  return used;
}

/**
 * Call `update` whenever the page or any nested scroller scrolls, or the
 * viewport resizes — what an open anchored popup needs to follow its anchor.
 *
 * @param {() => void} update
 * @returns {() => void} Stops tracking
 */
export function trackViewportChanges(update) {
  window.addEventListener("scroll", update, true);
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update, true);
    window.removeEventListener("resize", update);
  };
}
