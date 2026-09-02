import { fixture, expect, html } from "@open-wc/testing";
import {
  makeDraggable,
  makeDropZone,
  removeDraggable,
  removeDropZone,
  getDragState,
  initDragDrop,
} from "../src/utils/drag-drop.js";

function resetDragRuntime() {
  const state = getDragState();

  if (state.draggedElement) {
    state.draggedElement.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );

    state.draggedElement.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  const announcer = document.getElementById("ds-drag-drop-announcer");
  announcer?.remove();
}

describe("Drag and Drop Utility", () => {
  beforeEach(() => {
    resetDragRuntime();
  });

  afterEach(() => {
    resetDragRuntime();
  });

  describe("Attributes", () => {
    it("sets draggable accessibility attributes", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      expect(el.getAttribute("role")).to.equal("button");
      expect(el.getAttribute("aria-grabbed")).to.equal("false");
      expect(el.getAttribute("tabindex")).to.equal("0");
    });

    it("sets drop zone accessibility attributes", async () => {
      const el = await fixture(html`<div>Drop here</div>`);
      makeDropZone(el);

      expect(el.getAttribute("role")).to.equal("region");
      expect(el.getAttribute("aria-dropeffect")).to.equal("move");
    });
  });

  describe("Properties", () => {
    it("reports drag state properties", () => {
      const state = getDragState();

      expect(state).to.have.property("isDragging");
      expect(state).to.have.property("draggedElement");
      expect(state).to.have.property("currentDropZone");
    });
  });

  describe("Events", () => {
    it("invokes drag lifecycle callbacks", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let started = false;
      let ended = false;

      makeDraggable(el, {
        onDragStart: () => {
          started = true;
        },
        onDragEnd: () => {
          ended = true;
        },
      });

      el.dispatchEvent(
        new DragEvent("dragstart", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        }),
      );

      el.dispatchEvent(
        new DragEvent("dragend", {
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(started).to.equal(true);
      expect(ended).to.equal(true);
    });
  });

  describe("Keyboard", () => {
    it("starts keyboard drag on Space key", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let started = false;

      makeDraggable(el, {
        onDragStart: () => {
          started = true;
        },
      });

      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: " ",
          bubbles: true,
          cancelable: true,
        }),
      );

      expect(started).to.equal(true);
    });
  });

  describe("makeDraggable", () => {
    it("makes an element draggable", async () => {
      const el = await fixture(html`<div id="drag-1">Drag me</div>`);
      makeDraggable(el);

      expect(el.getAttribute("draggable")).to.equal("true");
      expect(el.getAttribute("role")).to.equal("button");
      expect(el.getAttribute("aria-grabbed")).to.equal("false");
      expect(el.getAttribute("tabindex")).to.equal("0");
      expect(el.style.cursor).to.equal("grab");
    });

    it("applies custom cursor from config", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el, { cursor: "move" });

      expect(el.style.cursor).to.equal("move");
    });

    it("adds drag handle class when handle is specified", async () => {
      const el = await fixture(html`
        <div>
          <div class="handle">Handle</div>
          <div>Content</div>
        </div>
      `);
      makeDraggable(el, { handle: ".handle" });

      const handle = el.querySelector(".handle");
      expect(handle.classList.contains("ds-drag-handle")).to.be.true;
      expect(handle.getAttribute("draggable")).to.equal("true");
      expect(el.getAttribute("draggable")).to.be.null;
    });

    it("returns cleanup function", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      const cleanup = makeDraggable(el);

      expect(typeof cleanup).to.equal("function");
      cleanup();

      expect(el.getAttribute("draggable")).to.be.null;
      expect(el.getAttribute("role")).to.be.null;
    });

    it("allows re-registration with new config", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el, { opacity: 0.5 });

      // Re-register with different config
      const cleanup = makeDraggable(el, { opacity: 0.8 });

      expect(typeof cleanup).to.equal("function");

      // Test that new config is used
      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      el.dispatchEvent(event);
      expect(el.style.opacity).to.equal("0.8");
    });

    it("sets aria-grabbed on drag start", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(el.getAttribute("aria-grabbed")).to.equal("true");
    });

    it("fires onDragStart callback", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let startCalled = false;
      let startData = null;

      makeDraggable(el, {
        onDragStart: (data) => {
          startCalled = true;
          startData = data;
        },
      });

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(startCalled).to.be.true;
      expect(startData).to.not.be.null;
      expect(startData.element).to.equal(el);
    });

    it("passes custom data through drag lifecycle", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      const customData = { id: 123, name: "Test Item" };
      let receivedData = null;

      makeDraggable(el, {
        data: customData,
        onDragStart: (data) => {
          receivedData = data.data;
        },
      });

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(receivedData).to.deep.equal(customData);
    });

    it("prevents drag when disabled", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el, { disabled: true });

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it("adds drag class on drag start", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      const dragClass = "my-dragging";
      makeDraggable(el, { dragClass });

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(el.classList.contains(dragClass)).to.be.true;
    });

    it("applies opacity on drag start", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el, { opacity: 0.3 });

      const event = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });

      el.dispatchEvent(event);
      expect(el.style.opacity).to.equal("0.3");
    });

    it("fires onDragEnd callback", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let endCalled = false;
      let endData = null;

      makeDraggable(el, {
        onDragEnd: (data) => {
          endCalled = true;
          endData = data;
        },
      });

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      el.dispatchEvent(startEvent);

      // End drag
      const endEvent = new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(endEvent);

      expect(endCalled).to.be.true;
      expect(endData).to.not.be.null;
      expect(endData.dropped).to.be.false;
    });

    it("resets aria-grabbed on drag end", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      el.dispatchEvent(startEvent);
      expect(el.getAttribute("aria-grabbed")).to.equal("true");

      // End drag
      const endEvent = new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(endEvent);
      expect(el.getAttribute("aria-grabbed")).to.equal("false");
    });

    it("supports keyboard drag with Space key", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let startCalled = false;

      makeDraggable(el, {
        onDragStart: () => {
          startCalled = true;
        },
      });

      // Press Space to start drag
      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(spaceEvent);

      expect(startCalled).to.be.true;
      expect(el.getAttribute("aria-grabbed")).to.equal("true");
    });

    it("supports keyboard drag with Enter key", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      let startCalled = false;

      makeDraggable(el, {
        onDragStart: () => {
          startCalled = true;
        },
      });

      // Press Enter to start drag
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(enterEvent);

      expect(startCalled).to.be.true;
    });
  });

  describe("removeDraggable", () => {
    it("removes draggable functionality", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);
      removeDraggable(el);

      expect(el.getAttribute("draggable")).to.be.null;
      expect(el.getAttribute("role")).to.be.null;
      expect(el.getAttribute("aria-grabbed")).to.be.null;
    });

    it("handles removing non-draggable element gracefully", async () => {
      const el = await fixture(html`<div>Not draggable</div>`);
      expect(() => removeDraggable(el)).to.not.throw();
    });
  });

  describe("makeDropZone", () => {
    it("makes an element a drop zone", async () => {
      const el = await fixture(html`<div>Drop here</div>`);
      makeDropZone(el);

      expect(el.getAttribute("role")).to.equal("region");
      expect(el.getAttribute("aria-dropeffect")).to.equal("move");
    });

    it("allows re-registration with new config", async () => {
      const el = await fixture(html`<div>Drop here</div>`);
      let firstCalled = false;
      let secondCalled = false;

      makeDropZone(el, {
        onDrop: () => {
          firstCalled = true;
        },
      });

      // Re-register with different callback
      const cleanup = makeDropZone(el, {
        onDrop: () => {
          secondCalled = true;
        },
      });

      expect(typeof cleanup).to.equal("function");
      cleanup();

      expect(el.getAttribute("aria-dropeffect")).to.be.null;
    });

    it("does not make already registered drop zone again", async () => {
      const el = await fixture(html`<div>Drop here</div>`);
      const cleanup1 = makeDropZone(el);
      const cleanup2 = makeDropZone(el);

      expect(typeof cleanup2).to.equal("function");
      cleanup1();
    });

    it("adds active class on drag enter", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(html`<div>Drag me</div>`);

      makeDropZone(dropZone, { activeClass: "drop-active" });
      makeDraggable(draggable);

      // Start drag on draggable
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Enter drop zone
      const enterEvent = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
      });
      dropZone.dispatchEvent(enterEvent);

      expect(dropZone.classList.contains("drop-active")).to.be.true;
    });

    it("adds hover class on drag over", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(html`<div>Drag me</div>`);

      makeDropZone(dropZone, { hoverClass: "drop-hover" });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Drag over
      const overEvent = new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(overEvent);

      expect(dropZone.classList.contains("drop-hover")).to.be.true;
    });

    it("fires onDragEnter callback", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(html`<div>Drag me</div>`);

      let enterCalled = false;
      let enterData = null;

      makeDropZone(dropZone, {
        onDragEnter: (data) => {
          enterCalled = true;
          enterData = data;
        },
      });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Enter drop zone
      const enterEvent = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
      });
      dropZone.dispatchEvent(enterEvent);

      expect(enterCalled).to.be.true;
      expect(enterData).to.not.be.null;
      expect(enterData.dropZone).to.equal(dropZone);
    });

    it("fires onDrop callback", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(html`<div>Drag me</div>`);

      let dropCalled = false;
      let dropData = null;

      makeDropZone(dropZone, {
        onDrop: (data) => {
          dropCalled = true;
          dropData = data;
        },
      });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);

      expect(dropCalled).to.be.true;
      expect(dropData).to.not.be.null;
      expect(dropData.dropZone).to.equal(dropZone);
    });

    it("respects accept selector", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(
        html`<div class="accepted">Drag me</div>`,
      );

      let dropCalled = false;

      makeDropZone(dropZone, {
        accept: ".accepted",
        onDrop: () => {
          dropCalled = true;
        },
      });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);

      expect(dropCalled).to.be.true;
    });

    it("rejects draggable not matching accept selector", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(
        html`<div class="rejected">Drag me</div>`,
      );

      let dropCalled = false;

      makeDropZone(dropZone, {
        accept: ".accepted",
        onDrop: () => {
          dropCalled = true;
        },
      });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);

      expect(dropCalled).to.be.false;
    });

    it("prevents drop when disabled", async () => {
      const dropZone = await fixture(html`<div>Drop here</div>`);
      const draggable = await fixture(html`<div>Drag me</div>`);

      let dropCalled = false;

      makeDropZone(dropZone, {
        disabled: true,
        onDrop: () => {
          dropCalled = true;
        },
      });
      makeDraggable(draggable);

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Try to drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);

      expect(dropCalled).to.be.false;
    });
  });

  describe("removeDropZone", () => {
    it("removes drop zone functionality", async () => {
      const el = await fixture(html`<div>Drop here</div>`);
      makeDropZone(el);
      removeDropZone(el);

      expect(el.getAttribute("aria-dropeffect")).to.be.null;
    });

    it("handles removing non-drop-zone element gracefully", async () => {
      const el = await fixture(html`<div>Not a drop zone</div>`);
      expect(() => removeDropZone(el)).to.not.throw();
    });
  });

  describe("getDragState", () => {
    it("returns drag state object", () => {
      const state = getDragState();

      expect(state).to.be.an("object");
      expect(state).to.have.property("isDragging");
      expect(state).to.have.property("draggedElement");
      expect(state).to.have.property("currentDropZone");
    });

    it("reflects active drag state", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      // Before drag
      let state = getDragState();
      expect(state.isDragging).to.be.false;

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      el.dispatchEvent(startEvent);

      // During drag
      state = getDragState();
      expect(state.isDragging).to.be.true;
      expect(state.draggedElement).to.equal(el);
    });
  });

  describe("initDragDrop", () => {
    it("initializes elements with data-draggable attribute", async () => {
      const container = await fixture(html`
        <div>
          <div data-draggable id="item-1">Item 1</div>
          <div data-draggable id="item-2">Item 2</div>
        </div>
      `);

      const count = initDragDrop(container);
      expect(count).to.equal(2);

      const item1 = container.querySelector("#item-1");
      const item2 = container.querySelector("#item-2");

      expect(item1.getAttribute("draggable")).to.equal("true");
      expect(item2.getAttribute("draggable")).to.equal("true");
    });

    it("initializes elements with data-drop-zone attribute", async () => {
      const container = await fixture(html`
        <div>
          <div data-drop-zone id="zone-1">Zone 1</div>
          <div data-drop-zone id="zone-2">Zone 2</div>
        </div>
      `);

      const count = initDragDrop(container);
      expect(count).to.equal(2);

      const zone1 = container.querySelector("#zone-1");
      const zone2 = container.querySelector("#zone-2");

      expect(zone1.getAttribute("aria-dropeffect")).to.equal("move");
      expect(zone2.getAttribute("aria-dropeffect")).to.equal("move");
    });

    it("handles multiple initialization calls", async () => {
      const container = await fixture(html`
        <div>
          <div data-draggable id="item">Item</div>
        </div>
      `);

      const count1 = initDragDrop(container);
      const count2 = initDragDrop(container);

      expect(count1).to.be.greaterThan(0);
      // Already initialized elements are skipped on subsequent runs.
      expect(count2).to.equal(0);
    });

    it("initializes data-drag-handle attribute", async () => {
      const container = await fixture(html`
        <div>
          <div data-draggable data-drag-handle=".handle" id="item">
            <span class="handle">Handle</span>
            <span>Item</span>
          </div>
        </div>
      `);

      initDragDrop(container);

      const item = container.querySelector("#item");
      expect(item.getAttribute("draggable")).to.be.null;
    });

    it("does not initialize already initialized elements", async () => {
      const container = await fixture(html`
        <div>
          <div data-draggable id="item">Item</div>
        </div>
      `);

      const count1 = initDragDrop(container);
      const count2 = initDragDrop(container);

      expect(count1).to.equal(1);
      expect(count2).to.equal(0);
    });
  });

  describe("Integration", () => {
    it("completes full drag and drop cycle", async () => {
      const container = await fixture(html`
        <div>
          <div id="draggable">Drag me</div>
          <div id="dropzone">Drop here</div>
        </div>
      `);

      const draggable = container.querySelector("#draggable");
      const dropZone = container.querySelector("#dropzone");

      let dragStarted = false;
      let dragEntered = false;
      let dropped = false;
      let dragEnded = false;

      makeDraggable(draggable, {
        onDragStart: () => {
          dragStarted = true;
        },
        onDragEnd: (data) => {
          dragEnded = true;
        },
      });

      makeDropZone(dropZone, {
        onDragEnter: () => {
          dragEntered = true;
        },
        onDrop: () => {
          dropped = true;
        },
      });

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);
      expect(dragStarted).to.be.true;

      // Enter drop zone
      const enterEvent = new DragEvent("dragenter", {
        bubbles: true,
        cancelable: true,
      });
      dropZone.dispatchEvent(enterEvent);
      expect(dragEntered).to.be.true;

      // Drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);
      expect(dropped).to.be.true;

      // End drag
      const endEvent = new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
      });
      draggable.dispatchEvent(endEvent);
      expect(dragEnded).to.be.true;
    });

    it("transfers custom data through drag cycle", async () => {
      const container = await fixture(html`
        <div>
          <div id="draggable">Drag me</div>
          <div id="dropzone">Drop here</div>
        </div>
      `);

      const draggable = container.querySelector("#draggable");
      const dropZone = container.querySelector("#dropzone");

      const customData = { id: 42, name: "Test" };
      let receivedData = null;

      makeDraggable(draggable, {
        data: customData,
      });

      makeDropZone(dropZone, {
        onDrop: (data) => {
          receivedData = data.data;
        },
      });

      // Start drag
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      draggable.dispatchEvent(startEvent);

      // Drop
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      dropZone.dispatchEvent(dropEvent);

      expect(receivedData).to.deep.equal(customData);
    });
  });

  describe("Accessibility", () => {
    it("creates ARIA live region for announcements", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      // Start drag to trigger announcement
      const startEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      });
      el.dispatchEvent(startEvent);

      const announcer = document.getElementById("ds-drag-drop-announcer");
      expect(announcer).to.exist;
      expect(announcer.getAttribute("role")).to.equal("status");
      expect(announcer.getAttribute("aria-live")).to.equal("polite");
    });

    it("is keyboard accessible with tabindex", async () => {
      const el = await fixture(html`<div>Drag me</div>`);
      makeDraggable(el);

      expect(el.getAttribute("tabindex")).to.equal("0");
    });

    it("has proper ARIA roles and attributes", async () => {
      const draggable = await fixture(html`<div>Drag me</div>`);
      const dropZone = await fixture(html`<div>Drop here</div>`);

      makeDraggable(draggable);
      makeDropZone(dropZone);

      expect(draggable.getAttribute("role")).to.equal("button");
      expect(draggable.getAttribute("aria-grabbed")).to.equal("false");
      expect(dropZone.getAttribute("role")).to.equal("region");
      expect(dropZone.getAttribute("aria-dropeffect")).to.equal("move");
    });
  });
});
