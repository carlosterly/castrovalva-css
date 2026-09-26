/**
 * Fixed-position placement utility
 *
 * Places a `position: fixed` element at viewport coordinates taken from
 * `getBoundingClientRect()`.
 *
 * Setting `left`/`top` directly is not enough: a fixed element is laid out
 * against its containing block, which is not always the viewport origin. The
 * site's `scrollbar-gutter: stable both-edges` (src/styles/base.css) reserves
 * a gutter on the left edge too, shifting that containing block right by the
 * scrollbar width wherever scrollbars take up space (Windows desktop, 15px).
 * A transformed or filtered ancestor does the same.
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
