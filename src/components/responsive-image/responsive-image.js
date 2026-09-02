/**
 * Responsive Image Component
 * Material Design 3 responsive image with lazy loading, aspect ratio preservation, and error handling
 */

const FIT_VALUES = ["cover", "contain", "fill", "scale-down", "none"];

export class DSResponsiveImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isLoaded = false;
    this.hasError = false;
    this.intersectionObserver = null;

    this.imageEl = null;
    this.placeholderEl = null;
    this.shimmerEl = null;
    this.pictureEl = null;
  }

  static get observedAttributes() {
    return ["src", "srcset", "sizes", "alt", "lazy", "aspect-ratio", "fit"];
  }

  connectedCallback() {
    this.render();
    this.setupImageHandling();
  }

  disconnectedCallback() {
    this.cleanupObserver();
    if (this.imageEl) {
      this.imageEl.onload = null;
      this.imageEl.onerror = null;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "aspect-ratio" || name === "fit" || name === "alt") {
      this.updateStyles();
      this.updateImageAttributes();
      return;
    }

    this.isLoaded = false;
    this.hasError = false;
    this.setupImageHandling();
  }

  get src() {
    return this.getAttribute("src") || "";
  }

  set src(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("src");
      return;
    }
    this.setAttribute("src", String(value));
  }

  get srcset() {
    return this.getAttribute("srcset") || "";
  }

  set srcset(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("srcset");
      return;
    }
    this.setAttribute("srcset", String(value));
  }

  get sizes() {
    return this.getAttribute("sizes") || "";
  }

  set sizes(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("sizes");
      return;
    }
    this.setAttribute("sizes", String(value));
  }

  get alt() {
    return this.getAttribute("alt") || "";
  }

  set alt(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("alt");
      return;
    }
    this.setAttribute("alt", String(value));
  }

  get lazy() {
    return this.hasAttribute("lazy");
  }

  set lazy(value) {
    if (value) this.setAttribute("lazy", "");
    else this.removeAttribute("lazy");
  }

  get aspectRatio() {
    return this.getAttribute("aspect-ratio") || "auto";
  }

  set aspectRatio(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "auto"
    ) {
      this.removeAttribute("aspect-ratio");
      return;
    }
    this.setAttribute("aspect-ratio", String(value));
  }

  get fit() {
    const fit = this.getAttribute("fit") || "cover";
    return FIT_VALUES.includes(fit) ? fit : "cover";
  }

  set fit(value) {
    if (value === null || value === undefined || value === "") {
      this.removeAttribute("fit");
      return;
    }

    this.setAttribute("fit", FIT_VALUES.includes(value) ? value : "cover");
  }

  get loaded() {
    return this.isLoaded;
  }

  get error() {
    return this.hasError;
  }

  cleanupObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
          --ds-responsive-image-loading-padding: var(--ds-space-4);
          --ds-responsive-image-loading-gap: var(--ds-space-2);
          --ds-responsive-image-icon-size: var(--ds-size-icon-lg);
          --ds-responsive-image-error-title-margin: var(--ds-space-2);
          --ds-responsive-image-error-message-margin: var(--ds-space-1);
        }

        .container {
          position: relative;
          inline-size: 100%;
          block-size: 100%;
          background: var(--md-sys-color-surface-container);
        }

        picture {
          display: block;
          inline-size: 100%;
          block-size: 100%;
        }

        img {
          display: block;
          inline-size: 100%;
          block-size: 100%;
          object-position: center;
          opacity: 0;
          transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1);
        }

        img.loaded {
          opacity: 1;
        }

        .placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-size: var(--md-sys-typescale-body-medium-size);
          transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1);
        }

        .placeholder.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .placeholder-content {
          text-align: center;
          display: grid;
          gap: var(--ds-responsive-image-loading-gap);
        }

        .placeholder-icon {
          font-size: var(--ds-responsive-image-icon-size);
          line-height: 1;
        }

        .shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .shimmer.hidden {
          display: none;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          inline-size: 100%;
          block-size: 100%;
          background: var(--md-sys-color-error-container);
          color: var(--md-sys-color-on-error-container);
          padding: var(--ds-responsive-image-loading-padding);
          text-align: center;
        }

        .error-icon {
          font-size: var(--ds-responsive-image-icon-size);
          line-height: 1;
        }

        .error-title {
          font-weight: 500;
          margin-block-start: var(--ds-responsive-image-error-title-margin);
        }

        .error-message {
          font-size: var(--md-sys-typescale-body-small-size);
          margin-block-start: var(--ds-responsive-image-error-message-margin);
          opacity: 0.8;
        }
      </style>

      <div class="container" id="container">
        <picture id="picture">
          <img id="image" role="img" />
        </picture>
        <div class="placeholder" id="placeholder">
          <div class="shimmer" id="shimmer"></div>
          <div class="placeholder-content">
            <div class="placeholder-icon">📷</div>
            <div>Loading image...</div>
          </div>
        </div>
      </div>
    `;

    this.imageEl = this.shadowRoot.getElementById("image");
    this.placeholderEl = this.shadowRoot.getElementById("placeholder");
    this.shimmerEl = this.shadowRoot.getElementById("shimmer");
    this.pictureEl = this.shadowRoot.getElementById("picture");

    this.updateStyles();
    this.updateImageAttributes();
  }

  updateStyles() {
    const container = this.shadowRoot.getElementById("container");
    if (!container || !this.imageEl) return;

    const aspectRatio = this.aspectRatio;
    const fit = this.fit;

    if (aspectRatio !== "auto") {
      container.style.aspectRatio = aspectRatio;
    } else {
      container.style.removeProperty("aspect-ratio");
    }

    this.imageEl.style.objectFit = fit;
  }

  updateImageAttributes() {
    if (!this.imageEl) return;

    if (this.alt) {
      this.imageEl.setAttribute("alt", this.alt);
    } else {
      this.imageEl.setAttribute("alt", "");
    }
  }

  setupImageHandling() {
    if (!this.imageEl || !this.pictureEl) {
      this.render();
    }

    if (this.lazy && "IntersectionObserver" in window) {
      this.setupLazyLoading();
    } else {
      this.loadImage();
    }
  }

  setupLazyLoading() {
    this.cleanupObserver();

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.intersectionObserver?.unobserve(this);
          }
        });
      },
      { rootMargin: "50px" },
    );

    this.intersectionObserver.observe(this);
  }

  loadImage() {
    if (!this.imageEl || !this.pictureEl) return;

    const src = this.src;
    const srcset = this.srcset;
    const sizes = this.sizes;

    if (!src && !srcset && !this.hasChildElements("source")) {
      this.showError("No image source provided");
      this.dispatchEvent(
        new CustomEvent("image-error", {
          bubbles: true,
          composed: true,
          detail: { src: "" },
        }),
      );
      return;
    }

    this.setupPictureElement();

    if (srcset) {
      this.imageEl.srcset = srcset;
    } else {
      this.imageEl.removeAttribute("srcset");
    }

    if (sizes) {
      this.imageEl.sizes = sizes;
    } else {
      this.imageEl.removeAttribute("sizes");
    }

    if (src) {
      this.imageEl.src = src;
    }

    this.imageEl.onload = () => this.handleImageLoad();
    this.imageEl.onerror = () => this.handleImageError();

    this.dispatchEvent(
      new CustomEvent("image-loading", {
        bubbles: true,
        composed: true,
        detail: { src },
      }),
    );
  }

  setupPictureElement() {
    const existingImage = this.imageEl;
    this.pictureEl.innerHTML = "";

    const sources = this.querySelectorAll("source");
    sources.forEach((source) => {
      this.pictureEl.appendChild(source.cloneNode(true));
    });

    if (existingImage) {
      this.pictureEl.appendChild(existingImage);
      this.imageEl = existingImage;
    }
  }

  hasChildElements(tagName) {
    return this.querySelector(tagName) !== null;
  }

  handleImageLoad() {
    this.isLoaded = true;
    this.hasError = false;

    if (this.placeholderEl) {
      this.placeholderEl.classList.add("hidden");
    }
    if (this.shimmerEl) {
      this.shimmerEl.classList.add("hidden");
    }
    if (this.imageEl) {
      this.imageEl.classList.add("loaded");
    }

    this.dispatchEvent(
      new CustomEvent("image-loaded", {
        bubbles: true,
        composed: true,
        detail: {
          src: this.imageEl?.currentSrc || this.imageEl?.src || this.src,
        },
      }),
    );
  }

  handleImageError() {
    this.hasError = true;
    this.showError("Failed to load image");

    this.dispatchEvent(
      new CustomEvent("image-error", {
        bubbles: true,
        composed: true,
        detail: { src: this.src },
      }),
    );
  }

  showError(message) {
    if (this.placeholderEl) {
      this.placeholderEl.innerHTML = `
        <div class="error-container">
          <span class="error-icon">⚠️</span>
          <div class="error-title">Image Error</div>
          <div class="error-message">${message}</div>
        </div>
      `;
      this.placeholderEl.classList.remove("hidden");
    }
    if (this.shimmerEl) {
      this.shimmerEl.classList.add("hidden");
    }
    if (this.imageEl) {
      this.imageEl.classList.remove("loaded");
    }
  }

  reload() {
    this.isLoaded = false;
    this.hasError = false;
    this.loadImage();
  }
}

if (!customElements.get("ds-responsive-image")) {
  customElements.define("ds-responsive-image", DSResponsiveImage);
}
