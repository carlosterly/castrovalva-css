class DSButtonGroup extends HTMLElement {
  static get observedAttributes() {
    return ["orientation", "disabled", "variant", "selection"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._slotChangeHandler = () => this.updateSlottedButtons();
    this._handleButtonClick = this.handleButtonClick.bind(this);
    this._resizeObserver = null;
    this._slottedButtons = [];
    this._selectedValues = new Set();
  }

  connectedCallback() {
    this.render();
    this.updateSlottedButtons();
    this.addEventListener("ds-button-content-change", this._slotChangeHandler);
    this.addEventListener("ds-click", this._handleButtonClick);
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this.removeEventListener(
      "ds-button-content-change",
      this._slotChangeHandler,
    );
    this.removeEventListener("ds-click", this._handleButtonClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.updateSlottedButtons();
    }
  }

  get variant() {
    return this.getAttribute("variant") || "connected";
  }

  get orientation() {
    return this.getAttribute("orientation") || "horizontal";
  }

  get selection() {
    return this.getAttribute("selection") || "none";
  }

  get value() {
    if (this.selection === "single" || this.selection === "required") {
      return Array.from(this._selectedValues)[0] || null;
    }
    if (this.selection === "multi") {
      return Array.from(this._selectedValues);
    }
    return null;
  }

  set value(val) {
    this._selectedValues.clear();
    if (this.selection === "multi" && Array.isArray(val)) {
      val.forEach((v) => this._selectedValues.add(v));
    } else if (val !== null && val !== undefined && val !== "") {
      this._selectedValues.add(val);
    }
    this.updateSlottedButtons();
  }

  getButtonValue(button, index) {
    return (
      button.getAttribute("value") ||
      button.getAttribute("data-value") ||
      button.textContent.trim() ||
      index.toString()
    );
  }

  getButtonSize(button) {
    return (button.getAttribute("size") || "medium").toLowerCase();
  }

  getLargestButtonSize(buttons) {
    const sizeRank = { small: 1, medium: 2, large: 3 };
    return buttons.reduce((largest, button) => {
      const size = this.getButtonSize(button);
      return (sizeRank[size] || 2) > (sizeRank[largest] || 2) ? size : largest;
    }, "medium");
  }

  getStandardGapForSize(size) {
    const gapBySize = { small: "12px", medium: "8px", large: "8px" };
    return gapBySize[size] || "8px";
  }

  getInnerCornerRadiusForSize(size) {
    const radiusBySize = { small: "8px", medium: "8px", large: "16px" };
    return radiusBySize[size] || radiusBySize.medium;
  }

  handleButtonClick(e) {
    if (this.hasAttribute("disabled")) return;
    if (this.selection === "none") return;

    const target = e.target instanceof Element ? e.target : null;
    const button = target ? target.closest("ds-button") : null;
    if (!button) return;

    const buttons = this._slottedButtons;
    const index = buttons.indexOf(button);
    if (index === -1) return;

    const value = this.getButtonValue(button, index);
    const isSelected = this._selectedValues.has(value);

    if (this.selection === "single" || this.selection === "required") {
      if (this.selection === "required" && isSelected) {
        return;
      }
      this._selectedValues.clear();
      if (!isSelected) {
        this._selectedValues.add(value);
      }
    } else if (this.selection === "multi") {
      if (isSelected) {
        this._selectedValues.delete(value);
      } else {
        this._selectedValues.add(value);
      }
    }

    this.updateSlottedButtons();
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  updateSlottedButtons() {
    // Get slotted buttons
    const slot = this.shadowRoot.querySelector("slot");
    if (!slot) return;

    const buttons = slot
      .assignedElements()
      .filter((el) => el.tagName.toLowerCase() === "ds-button");

    this._slottedButtons = buttons;

    if (buttons.length === 0) return;

    const isHorizontal = this.orientation === "horizontal";
    const isConnected = this.variant === "connected";
    const isSegmented = this.variant === "segmented";
    const isVertical = this.orientation === "vertical";
    const isDisabled = this.hasAttribute("disabled");
    const dividerColor = "var(--md-sys-color-outline-variant, #CAC4D0)";
    const isSelectable = this.selection !== "none";

    const groupSize = this.getLargestButtonSize(buttons);
    const groupGap = isSegmented
      ? "0"
      : isConnected
        ? "2px"
        : this.getStandardGapForSize(groupSize);
    this.style.setProperty("--ds-button-group-gap", groupGap);

    // Reset width overrides when not vertical
    if (!isVertical) {
      buttons.forEach((button) => {
        button.style.width = "";
        button.style.removeProperty("--ds-button-width");
      });
    }

    buttons.forEach((button, index) => {
      button.style.borderRadius = "";
      button.style.borderTopLeftRadius = "";
      button.style.borderTopRightRadius = "";
      button.style.borderBottomLeftRadius = "";
      button.style.borderBottomRightRadius = "";

      if (isDisabled) {
        button.setAttribute("disabled", "");
      } else {
        button.removeAttribute("disabled");
      }

      if (isSegmented) {
        button.setAttribute("data-group-variant", "segmented");
      } else {
        button.removeAttribute("data-group-variant");
      }

      if (isSelectable) {
        const value = this.getButtonValue(button, index);
        const selected = this._selectedValues.has(value);
        if (selected) {
          button.setAttribute("selected", "");
        } else {
          button.removeAttribute("selected");
        }
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      } else {
        button.removeAttribute("selected");
        button.removeAttribute("aria-pressed");
      }

      const isFirst = index === 0;
      const isLast = index === buttons.length - 1;
      const isMiddle = !isFirst && !isLast;
      const buttonSize = this.getButtonSize(button);
      const innerRadius = this.getInnerCornerRadiusForSize(buttonSize);

      if (isConnected || isSegmented) {
        if (isHorizontal) {
          if (isFirst) {
            button.style.borderTopRightRadius = innerRadius;
            button.style.borderBottomRightRadius = innerRadius;
          } else if (isLast) {
            button.style.borderTopLeftRadius = innerRadius;
            button.style.borderBottomLeftRadius = innerRadius;
          } else if (isMiddle) {
            button.style.borderRadius = innerRadius;
          }

          if (isSegmented) {
            button.style.borderLeft = isFirst
              ? ""
              : `1px solid ${dividerColor}`;
          } else {
            button.style.borderLeft = "";
          }
        } else {
          // Vertical orientation
          if (isFirst) {
            button.style.borderBottomLeftRadius = innerRadius;
            button.style.borderBottomRightRadius = innerRadius;
          } else if (isLast) {
            button.style.borderTopLeftRadius = innerRadius;
            button.style.borderTopRightRadius = innerRadius;
          } else if (isMiddle) {
            button.style.borderRadius = innerRadius;
          }

          if (isSegmented) {
            button.style.borderTop = isFirst ? "" : `1px solid ${dividerColor}`;
          } else {
            button.style.borderTop = "";
          }
        }
      } else {
        button.style.borderLeft = "";
        button.style.borderTop = "";
      }
    });

    this.applyStandardSelectionStyling(
      buttons,
      isSelectable,
      isSegmented,
      isConnected,
    );

    if (isVertical) {
      this.equalizeVerticalWidths();
    }
  }

  equalizeVerticalWidths() {
    if (this._slottedButtons.length === 0) return;

    const measure = () => {
      let maxWidth = 0;
      this._slottedButtons.forEach((button) => {
        button.style.removeProperty("--ds-button-width");
        const innerButton = button.shadowRoot?.querySelector("button");
        const rect = (innerButton || button).getBoundingClientRect();
        maxWidth = Math.max(maxWidth, rect.width);
      });

      if (maxWidth > 0) {
        this._slottedButtons.forEach((button) => {
          button.style.setProperty(
            "--ds-button-width",
            `${Math.ceil(maxWidth)}px`,
          );
        });
      }
    };

    customElements.whenDefined("ds-button").then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(measure);
      });
    });

    if (!this._resizeObserver && "ResizeObserver" in window) {
      this._resizeObserver = new ResizeObserver(() => measure());
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._slottedButtons.forEach((button) =>
        this._resizeObserver.observe(button),
      );
    }
  }

  applyStandardSelectionStyling(
    buttons,
    isSelectable,
    isSegmented,
    isConnected,
  ) {
    buttons.forEach((button) => {
      button.style.removeProperty("--button-border-radius");
      button.style.removeProperty("--ds-button-padding-inline");
    });

    if (!isSelectable || isSegmented || isConnected) return;

    const selectedIndex = buttons.findIndex((button) =>
      button.hasAttribute("selected"),
    );
    if (selectedIndex === -1) return;

    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        button.style.setProperty(
          "--button-border-radius",
          "var(--md-sys-shape-corner-full, 999px)",
        );
        button.style.setProperty(
          "--ds-button-padding-inline",
          "calc(var(--ds-button-padding-inline-base) + 2px)",
        );
        return;
      }

      if (Math.abs(index - selectedIndex) === 1) {
        button.style.setProperty(
          "--button-border-radius",
          "var(--md-sys-shape-corner-small, 4px)",
        );
        button.style.setProperty(
          "--ds-button-padding-inline",
          "calc(var(--ds-button-padding-inline-base) - 2px)",
        );
      }
    });
  }

  render() {
    const isConnected = this.variant === "connected";
    const isSegmented = this.variant === "segmented";
    const isVertical = this.orientation === "vertical";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          flex-direction: ${isVertical ? "column" : "row"};
          gap: var(--ds-button-group-gap, 8px);
          ${
            isSegmented
              ? "border-radius: var(--md-sys-shape-corner-full, 20px); overflow: hidden;"
              : ""
          }
        }

        ::slotted(ds-button) {
          margin: 0;
        }
      </style>
      <slot></slot>
    `;

    const slot = this.shadowRoot.querySelector("slot");
    if (slot) {
      slot.removeEventListener("slotchange", this._slotChangeHandler);
      slot.addEventListener("slotchange", this._slotChangeHandler, {
        passive: true,
      });
    }
  }
}

customElements.define("ds-button-group", DSButtonGroup);

export default DSButtonGroup;
