/**
 * Material Design 3 Carousel Component
 *
 * A horizontally scrolling container for browsing groups of content.
 * Uses CSS scroll snap for smooth native scrolling performance.
 *
 * @element ds-carousel
 *
 * @attr {string} variant - The carousel style: 'contained' (default), 'uncontained', 'hero'
 * @attr {boolean} show-navigation - Whether to show prev/next buttons
 * @attr {boolean} show-indicators - Whether to show position indicators
 * @attr {boolean} auto-play - Whether to auto-advance slides
 * @attr {number} auto-play-interval - Interval in ms for auto-play (default: 5000)
 * @attr {boolean} loop - Whether to loop back to start after last slide
 *
 * @slot - Carousel items (typically images or cards)
 *
 * @cssprop --ds-carousel-height - Height of the carousel
 * @cssprop --ds-carousel-gap - Gap between items
 *
 * @csspart container - The main carousel container
 * @csspart viewport - The scrollable viewport
 * @csspart navigation - Navigation button container
 * @csspart nav-button - Individual navigation button
 * @csspart indicators - Indicator dots container
 * @csspart indicator - Individual indicator dot
 *
 * @fires ds-carousel:change - Fired when the active slide changes
 * @fires ds-carousel:scroll - Fired during scrolling
 *
 * @example
 * <ds-carousel variant="contained" show-navigation show-indicators>
 *   <img src="slide1.jpg" alt="Slide 1">
 *   <img src="slide2.jpg" alt="Slide 2">
 *   <img src="slide3.jpg" alt="Slide 3">
 * </ds-carousel>
 */
export class DSCarousel extends HTMLElement {
  static get observedAttributes() {
    return [
      "variant",
      "show-navigation",
      "show-indicators",
      "auto-play",
      "auto-play-interval",
      "loop",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._currentIndex = 0;
    this._itemCount = 0;
    this._autoPlayTimer = null;
    this._isUserScrolling = false;
    this._scrollTimeout = null;
    this._renderRaf = null;
    this._slotEl = null;
    this._viewportEl = null;
    this._prevBtnEl = null;
    this._nextBtnEl = null;
    this._indicatorsEl = null;

    this._onPrevClick = () => {
      this._isUserScrolling = true;
      this.previous();
      this._resetAutoPlay();
    };

    this._onNextClick = () => {
      this._isUserScrolling = true;
      this.next();
      this._resetAutoPlay();
    };

    this._onKeydown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this._isUserScrolling = true;
        this.previous();
        this._resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this._isUserScrolling = true;
        this.next();
        this._resetAutoPlay();
      }
    };

    this._onViewportScroll = () => {
      this._isUserScrolling = true;
      this._handleScroll();
      this._resetAutoPlay();
    };

    this._onIndicatorsClick = (e) => {
      const indicator = e.target.closest("[part='indicator']");
      if (indicator) {
        const index = parseInt(indicator.dataset.index, 10);
        this._isUserScrolling = true;
        this.goToSlide(index);
        this._resetAutoPlay();
      }
    };

    this._onSlotChange = () => {
      const changed = this._updateItemCount();

      if (changed) {
        this.render();
      } else {
        this._updateIndicators();
        this._updateNavigationState();
      }
    };
  }

  connectedCallback() {
    // Prime item count from light DOM children so indicators render on first paint
    this._updateItemCount();
    this.render();
    this._startAutoPlay();
  }

  disconnectedCallback() {
    this._stopAutoPlay();
    this._teardownEventListeners();
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }
    if (this._renderRaf) {
      cancelAnimationFrame(this._renderRaf);
      this._renderRaf = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      if (name === "auto-play" || name === "auto-play-interval") {
        if (this.autoPlay) {
          this._startAutoPlay();
        } else {
          this._stopAutoPlay();
        }
      }
    }
  }

  /**
   * Get the carousel variant
   * @returns {string} The variant: 'contained', 'uncontained', or 'hero'
   */
  get variant() {
    const variant = this.getAttribute("variant");
    return ["contained", "uncontained", "hero"].includes(variant)
      ? variant
      : "contained";
  }

  /**
   * Set the carousel variant
   * @param {string} value - The variant
   */
  set variant(value) {
    this.setAttribute("variant", value);
  }

  /**
   * Get whether navigation buttons are shown
   * @returns {boolean}
   */
  get showNavigation() {
    return this.hasAttribute("show-navigation");
  }

  /**
   * Set whether navigation buttons are shown
   * @param {boolean} value
   */
  set showNavigation(value) {
    if (value) {
      this.setAttribute("show-navigation", "");
    } else {
      this.removeAttribute("show-navigation");
    }
  }

  /**
   * Get whether indicators are shown
   * @returns {boolean}
   */
  get showIndicators() {
    return this.hasAttribute("show-indicators");
  }

  /**
   * Set whether indicators are shown
   * @param {boolean} value
   */
  set showIndicators(value) {
    if (value) {
      this.setAttribute("show-indicators", "");
    } else {
      this.removeAttribute("show-indicators");
    }
  }

  /**
   * Get whether auto-play is enabled
   * @returns {boolean}
   */
  get autoPlay() {
    return this.hasAttribute("auto-play");
  }

  /**
   * Set whether auto-play is enabled
   * @param {boolean} value
   */
  set autoPlay(value) {
    if (value) {
      this.setAttribute("auto-play", "");
    } else {
      this.removeAttribute("auto-play");
    }
  }

  /**
   * Get the auto-play interval in milliseconds
   * @returns {number}
   */
  get autoPlayInterval() {
    return parseInt(this.getAttribute("auto-play-interval")) || 5000;
  }

  /**
   * Set the auto-play interval in milliseconds
   * @param {number} value
   */
  set autoPlayInterval(value) {
    this.setAttribute("auto-play-interval", value);
  }

  /**
   * Get whether looping is enabled
   * @returns {boolean}
   */
  get loop() {
    return this.hasAttribute("loop");
  }

  /**
   * Set whether looping is enabled
   * @param {boolean} value
   */
  set loop(value) {
    if (value) {
      this.setAttribute("loop", "");
    } else {
      this.removeAttribute("loop");
    }
  }

  /**
   * Get the current slide index
   * @returns {number}
   */
  get currentIndex() {
    return this._currentIndex;
  }

  /**
   * Navigate to the next slide
   */
  next() {
    if (this._currentIndex < this._itemCount - 1) {
      this.goToSlide(this._currentIndex + 1);
    } else if (this.loop) {
      this.goToSlide(0);
    }
  }

  /**
   * Navigate to the previous slide
   */
  previous() {
    if (this._currentIndex > 0) {
      this.goToSlide(this._currentIndex - 1);
    } else if (this.loop) {
      this.goToSlide(this._itemCount - 1);
    }
  }

  /**
   * Navigate to a specific slide
   * @param {number} index - The slide index
   */
  goToSlide(index) {
    if (index < 0 || index >= this._itemCount) return;

    const viewport = this.shadowRoot.querySelector("[part='viewport']");
    const slot = this.shadowRoot.querySelector("slot");
    const items = slot.assignedElements();

    if (items[index] && viewport) {
      const target = items[index];
      const left = target.offsetLeft;
      viewport.scrollTo({ left, behavior: "smooth" });

      this._currentIndex = index;
      this._updateIndicators();
      this._updateNavigationState();
      this._dispatchChangeEvent();
    }
  }

  /**
   * Start auto-play
   */
  _startAutoPlay() {
    this._stopAutoPlay();
    if (this.autoPlay) {
      this._autoPlayTimer = setInterval(() => {
        if (!this._isUserScrolling) {
          this.next();
        }
      }, this.autoPlayInterval);
    }
  }

  /**
   * Stop auto-play
   */
  _stopAutoPlay() {
    if (this._autoPlayTimer) {
      clearInterval(this._autoPlayTimer);
      this._autoPlayTimer = null;
    }
  }

  /**
   * Observe slot changes to update item count
   */
  _observeSlotChanges() {
    const slot = this.shadowRoot.querySelector("slot");
    if (!slot) {
      return;
    }

    if (this._slotEl && this._slotEl !== slot) {
      this._slotEl.removeEventListener("slotchange", this._onSlotChange);
    }

    this._slotEl = slot;
    this._slotEl.removeEventListener("slotchange", this._onSlotChange);
    this._slotEl.addEventListener("slotchange", this._onSlotChange);
  }

  _teardownEventListeners() {
    if (this._prevBtnEl) {
      this._prevBtnEl.removeEventListener("click", this._onPrevClick);
    }
    if (this._nextBtnEl) {
      this._nextBtnEl.removeEventListener("click", this._onNextClick);
    }

    this.removeEventListener("keydown", this._onKeydown);

    if (this._viewportEl) {
      this._viewportEl.removeEventListener("scroll", this._onViewportScroll);
    }

    if (this._indicatorsEl) {
      this._indicatorsEl.removeEventListener("click", this._onIndicatorsClick);
    }

    if (this._slotEl) {
      this._slotEl.removeEventListener("slotchange", this._onSlotChange);
    }
  }

  /**
   * Update the count of carousel items
   */
  _updateItemCount() {
    // Prefer assigned elements when a slot exists; otherwise fall back to light DOM children
    const slot = this.shadowRoot?.querySelector("slot");
    const items = slot?.assignedElements();
    const newCount =
      items && items.length > 0 ? items.length : this.children.length;

    const changed = newCount !== this._itemCount;
    this._itemCount = newCount;
    return changed;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this._teardownEventListeners();

    const viewport = this.shadowRoot.querySelector("[part='viewport']");
    const prevBtn = this.shadowRoot.querySelector(
      "[part='nav-button'][data-direction='prev']",
    );
    const nextBtn = this.shadowRoot.querySelector(
      "[part='nav-button'][data-direction='next']",
    );
    const indicatorsContainer = this.shadowRoot.querySelector(
      "[part='indicators']",
    );

    this._viewportEl = viewport;
    this._prevBtnEl = prevBtn;
    this._nextBtnEl = nextBtn;
    this._indicatorsEl = indicatorsContainer;

    prevBtn?.addEventListener("click", this._onPrevClick);
    nextBtn?.addEventListener("click", this._onNextClick);
    this.addEventListener("keydown", this._onKeydown);
    viewport?.addEventListener("scroll", this._onViewportScroll);
    indicatorsContainer?.addEventListener("click", this._onIndicatorsClick);
  }

  /**
   * Reset auto-play after user interaction
   */
  _resetAutoPlay() {
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }
    this._scrollTimeout = setTimeout(() => {
      this._isUserScrolling = false;
    }, 1000);
  }

  /**
   * Handle scroll events
   */
  _handleScroll() {
    const viewport = this.shadowRoot.querySelector("[part='viewport']");
    const slot = this.shadowRoot.querySelector("slot");
    const items = slot?.assignedElements() || [];

    if (items.length === 0) return;

    // Calculate the nearest slide using actual offsets (robust with gap/padding)
    const scrollLeft = viewport.scrollLeft;
    const nearest = items.reduce(
      (closest, item, index) => {
        const distance = Math.abs(item.offsetLeft - scrollLeft);
        if (distance < closest.distance) {
          return { index, distance };
        }
        return closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    const newIndex = nearest.index;

    if (
      newIndex !== this._currentIndex &&
      newIndex >= 0 &&
      newIndex < this._itemCount
    ) {
      this._currentIndex = newIndex;
      this._updateIndicators();
      this._updateNavigationState();
      this._dispatchScrollEvent();
    }
  }

  /**
   * Update indicator states
   */
  _updateIndicators() {
    const indicators = this.shadowRoot.querySelectorAll("[part='indicator']");
    indicators.forEach((indicator, index) => {
      if (index === this._currentIndex) {
        indicator.setAttribute("active", "");
      } else {
        indicator.removeAttribute("active");
      }
    });
  }

  /**
   * Update navigation button states
   */
  _updateNavigationState() {
    const prevBtn = this.shadowRoot.querySelector(
      "[part='nav-button'][data-direction='prev']",
    );
    const nextBtn = this.shadowRoot.querySelector(
      "[part='nav-button'][data-direction='next']",
    );

    if (prevBtn && nextBtn) {
      // Disable buttons at boundaries unless looping
      if (!this.loop) {
        prevBtn.disabled = this._currentIndex === 0;
        nextBtn.disabled = this._currentIndex === this._itemCount - 1;
      }
    }
  }

  /**
   * Dispatch change event
   */
  _dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("ds-carousel:change", {
        detail: {
          index: this._currentIndex,
          total: this._itemCount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Dispatch scroll event
   */
  _dispatchScrollEvent() {
    this.dispatchEvent(
      new CustomEvent("ds-carousel:scroll", {
        detail: {
          index: this._currentIndex,
          total: this._itemCount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  render() {
    const variant = this.variant;
    const showNav = this.showNavigation;
    const showIndicators = this.showIndicators;
    const disableManualScroll = this.autoPlay;

    const isContained = variant === "contained";
    const isUncontained = variant === "uncontained";
    const isHero = variant === "hero";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          inline-size: 100%;
          box-sizing: border-box;
          --ds-carousel-gap-contained: var(--ds-space-4, 16px);
          --ds-carousel-gap-uncontained: var(--ds-space-2, 8px);
          --ds-carousel-padding-contained: var(--ds-space-4, 16px);
          --ds-carousel-nav-button-size: var(--ds-size-control-lg, 48px);
          --ds-carousel-nav-icon-size: var(--ds-size-icon-lg, 24px);
          --ds-carousel-indicator-size: calc(var(--ds-size-control-sm, 32px) / 4);
          --ds-carousel-indicator-active-size: calc(
            var(--ds-carousel-indicator-size) * 3
          );
          --ds-carousel-indicators-offset: var(--ds-space-6, 24px);
        }

        [part="container"] {
          display: flex;
          flex-direction: column;
          inline-size: 100%;
          block-size: ${isHero ? "100vh" : "auto"};
          position: relative;
        }

        [part="viewport"] {
          display: flex;
          gap: var(
            --ds-carousel-gap,
            ${
              isContained
                ? "var(--ds-carousel-gap-contained)"
                : isUncontained
                  ? "var(--ds-carousel-gap-uncontained)"
                  : "0"
            }
          );
          overflow-x: ${disableManualScroll ? "hidden" : "auto"};
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: ${isContained ? "var(--ds-carousel-padding-contained)" : "0"};
          block-size: var(--ds-carousel-height, ${isHero ? "100vh" : "400px"});
          pointer-events: auto;
          touch-action: ${disableManualScroll ? "pan-y" : "pan-y pan-x"};
          overscroll-behavior-x: contain;
        }

        [part="viewport"]::-webkit-scrollbar {
          display: none;
        }

        ::slotted(*) {
          flex-shrink: 0;
          scroll-snap-align: ${isHero ? "center" : "start"};
          inline-size: ${
            isContained ? "calc(100% - 32px)" : isUncontained ? "80%" : "100%"
          };
          max-inline-size: ${isContained ? "600px" : "none"};
          block-size: 100%;
          object-fit: cover;
          border-radius: ${isContained ? "var(--ds-radius-lg, 16px)" : "0"};
          user-select: none;
        }

        [part="navigation"] {
          position: absolute;
          inset-block-start: 50%;
          transform: translateY(-50%);
          inline-size: 100%;
          display: ${showNav ? "flex" : "none"};
          justify-content: space-between;
          padding: 0 var(--ds-carousel-padding-contained);
          pointer-events: none;
          z-index: 10;
        }

        [part="nav-button"] {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: var(--ds-carousel-nav-button-size);
          block-size: var(--ds-carousel-nav-button-size);
          border: none;
          border-radius: 50%;
          background-color: var(--md-sys-color-surface-container-highest, rgba(255, 255, 255, 0.95));
          color: var(--md-sys-color-on-surface, #000);
          cursor: pointer;
          pointer-events: auto;
          box-shadow: var(--md-sys-elevation-level2, 0 2px 4px rgba(0, 0, 0, 0.2));
          transition: background-color 0.2s, box-shadow 0.2s, opacity 0.2s;
          opacity: 1;
        }

        [part="nav-button"]:hover:not(:disabled) {
          background-color: var(--md-sys-color-surface-container-high, rgba(255, 255, 255, 1));
          box-shadow: var(--md-sys-elevation-level3, 0 4px 8px rgba(0, 0, 0, 0.25));
        }

        [part="nav-button"]:active:not(:disabled) {
          box-shadow: var(--md-sys-elevation-level1, 0 1px 2px rgba(0, 0, 0, 0.15));
        }

        [part="nav-button"]:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        [part="nav-button"] svg {
          inline-size: var(--ds-carousel-nav-icon-size);
          block-size: var(--ds-carousel-nav-icon-size);
          fill: currentColor;
        }

        [part="indicators"] {
          display: ${showIndicators ? "flex" : "none"};
          justify-content: center;
          gap: var(--ds-carousel-gap-uncontained);
          padding: var(--ds-carousel-padding-contained);
          position: ${isHero ? "absolute" : "relative"};
          inset-block-end: ${isHero ? "var(--ds-carousel-indicators-offset)" : "0"};
          inline-size: 100%;
          box-sizing: border-box;
          z-index: 10;
        }

        [part="indicator"] {
          inline-size: var(--ds-carousel-indicator-size);
          block-size: var(--ds-carousel-indicator-size);
          border-radius: 999px;
          background-color: var(--md-sys-color-on-surface-variant, rgba(0, 0, 0, 0.38));
          cursor: pointer;
          transition: background-color 0.18s ease, width 0.18s ease, height 0.18s ease;
        }

        [part="indicator"]:hover {
          background-color: var(--md-sys-color-on-surface, rgba(0, 0, 0, 0.6));
        }

        [part="indicator"][active] {
          inline-size: var(--ds-carousel-indicator-active-size);
          block-size: var(--ds-carousel-indicator-size);
          background-color: var(--md-sys-color-primary, #6750a4);
        }

        /* Focus styles for accessibility */
        [part="nav-button"]:focus-visible {
          outline: 2px solid var(--md-sys-color-primary, #6750a4);
          outline-offset: 2px;
        }

        [part="indicator"]:focus-visible {
          outline: 2px solid var(--md-sys-color-primary, #6750a4);
          outline-offset: 2px;
        }

        :host(:focus-visible) {
          outline: 2px solid var(--md-sys-color-primary, #6750a4);
          outline-offset: 2px;
        }
      </style>

      <div part="container" role="region" aria-label="Carousel">
        <div part="viewport" role="list">
          <slot></slot>
        </div>

        <div part="navigation" aria-label="Carousel navigation">
          <button
            part="nav-button"
            data-direction="prev"
            aria-label="Previous slide"
            type="button">
            <svg viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button
            part="nav-button"
            data-direction="next"
            aria-label="Next slide"
            type="button">
            <svg viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>

        <div part="indicators" role="tablist" aria-label="Carousel position">
          ${Array.from(
            { length: this._itemCount },
            (_, i) => `
            <button
              part="indicator"
              data-index="${i}"
              role="tab"
              aria-label="Go to slide ${i + 1}"
              aria-selected="${i === this._currentIndex}"
              ${i === this._currentIndex ? "active" : ""}
              type="button">
            </button>
          `,
          ).join("")}
        </div>
      </div>
    `;

    // Re-setup event listeners after render
    if (this._renderRaf) {
      cancelAnimationFrame(this._renderRaf);
    }
    this._renderRaf = requestAnimationFrame(() => {
      this._renderRaf = null;
      this.setupEventListeners();
      this._updateItemCount();
      this._updateIndicators();
      this._updateNavigationState();
      this._observeSlotChanges();
    });
  }
}

customElements.define("ds-carousel", DSCarousel);
