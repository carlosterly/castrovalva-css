/**
 * Material Design 3 Drag and Drop Utility
 *
 * Provides comprehensive drag-and-drop functionality with Material Design 3 styling,
 * accessibility features, and flexible configuration options.
 *
 * Features:
 * - Touch and mouse support
 * - Keyboard accessibility (grab/move with Space/Enter)
 * - Drop zones with visual feedback
 * - Drag previews and ghost images
 * - Nested sortable lists
 * - Custom constraints (axis lock, containment)
 * - Events for all lifecycle stages
 * - Accessible ARIA announcements
 *
 * @example
 * ```js
 * import { makeDraggable, makeDropZone } from './utils/drag-drop.js';
 *
 * // Make elements draggable
 * makeDraggable(element, {
 *   handle: '.drag-handle',
 *   onDragStart: (data) => console.log('Started', data),
 *   onDragEnd: (data) => console.log('Ended', data)
 * });
 *
 * // Create drop zones
 * makeDropZone(container, {
 *   accept: '.draggable-item',
 *   onDrop: (data) => console.log('Dropped', data)
 * });
 * ```
 */

// Global state
const dragState = {
  isDragging: false,
  draggedElement: null,
  dragData: null,
  sourceContainer: null,
  currentDropZone: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  ghost: null,
  placeholder: null,
  keyboardMode: false,
};

// Registries
const draggableRegistry = new WeakMap();
const dropZoneRegistry = new WeakMap();

// Default configurations
const defaultDraggableConfig = {
  handle: null, // Selector for drag handle
  axis: null, // 'x', 'y', or null for both
  containment: null, // Selector or 'parent' to constrain drag area
  grid: null, // [x, y] to snap to grid
  disabled: false,
  cursor: "grab",
  opacity: 0.5,
  zIndex: 1000,
  revert: false, // Return to original position on failed drop
  revertDuration: 300,
  helper: "clone", // 'clone' or 'original'
  appendTo: "body", // Where to append the helper
  scroll: true, // Auto-scroll when near edges
  scrollSensitivity: 20,
  scrollSpeed: 10,
  dragClass: "ds-dragging",
  dragHandleClass: "ds-drag-handle",
  data: {}, // Custom data to pass with drag
  // Callbacks
  onDragStart: null,
  onDrag: null,
  onDragEnd: null,
};

const defaultDropZoneConfig = {
  accept: "*", // Selector for acceptable draggables
  activeClass: "ds-drop-active",
  hoverClass: "ds-drop-hover",
  disabled: false,
  tolerance: "pointer", // 'pointer', 'intersect', or 'touch'
  sortable: false, // Enable sortable list behavior
  direction: "vertical", // 'vertical' or 'horizontal' for sortable
  placeholder: true, // Show placeholder in sortable lists
  // Callbacks
  onDragEnter: null,
  onDragOver: null,
  onDragLeave: null,
  onDrop: null,
};

/**
 * Make an element draggable
 * @param {HTMLElement} element - Element to make draggable
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function
 */
export function makeDraggable(element, options = {}) {
  if (!element) {
    return () => {};
  }

  // If already registered, remove old handlers first
  if (draggableRegistry.has(element)) {
    removeDraggable(element);
  }

  const config = { ...defaultDraggableConfig, ...options };

  // Set up element
  if (config.handle) {
    // When using handles, don't make the whole element draggable
    // Only the handles should be draggable
    const handles = element.querySelectorAll(config.handle);
    handles.forEach((h) => {
      h.setAttribute("draggable", "true");
      h.classList.add(config.dragHandleClass);
      h.style.cursor = config.cursor;
    });
  } else {
    // No handle - make entire element draggable
    element.setAttribute("draggable", "true");
    element.style.cursor = config.cursor;
  }

  element.setAttribute("role", "button");
  element.setAttribute("aria-grabbed", "false");
  element.setAttribute("tabindex", "0");

  // Event handlers
  const handlers = {
    dragstart: (e) => handleDragStart(e, element, config),
    drag: (e) => handleDrag(e, element, config),
    dragend: (e) => handleDragEnd(e, element, config),
    keydown: (e) => handleKeyDown(e, element, config),
    touchstart: (e) => handleTouchStart(e, element, config),
    touchmove: (e) => handleTouchMove(e, element, config),
    touchend: (e) => handleTouchEnd(e, element, config),
  };

  // Attach listeners
  Object.entries(handlers).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });

  // Store config and handlers
  draggableRegistry.set(element, { config, handlers });

  // Return cleanup function
  return () => removeDraggable(element);
}

/**
 * Remove draggable functionality
 * @param {HTMLElement} element - Element to remove draggable from
 */
export function removeDraggable(element) {
  const data = draggableRegistry.get(element);
  if (!data) return;

  const { handlers } = data;

  // Remove listeners
  Object.entries(handlers).forEach(([event, handler]) => {
    element.removeEventListener(event, handler);
  });

  // Clean up attributes
  element.removeAttribute("draggable");
  element.removeAttribute("aria-grabbed");
  element.removeAttribute("role");
  element.style.cursor = "";

  draggableRegistry.delete(element);
}

/**
 * Make an element a drop zone
 * @param {HTMLElement} element - Element to make a drop zone
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function
 */
export function makeDropZone(element, options = {}) {
  if (!element) {
    return () => {};
  }

  // If already registered, remove old handlers first
  if (dropZoneRegistry.has(element)) {
    removeDropZone(element);
  }

  const config = { ...defaultDropZoneConfig, ...options };

  // Set up element
  element.setAttribute("role", "region");
  element.setAttribute("aria-dropeffect", "move");

  // Event handlers
  const handlers = {
    dragenter: (e) => handleDragEnter(e, element, config),
    dragover: (e) => handleDragOver(e, element, config),
    dragleave: (e) => handleDragLeave(e, element, config),
    drop: (e) => handleDrop(e, element, config),
  };

  // Attach listeners
  Object.entries(handlers).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });

  // Store config and handlers
  dropZoneRegistry.set(element, { config, handlers });

  // Return cleanup function
  return () => removeDropZone(element);
}

/**
 * Remove drop zone functionality
 * @param {HTMLElement} element - Element to remove drop zone from
 */
export function removeDropZone(element) {
  const data = dropZoneRegistry.get(element);
  if (!data) return;

  const { handlers } = data;

  // Remove listeners
  Object.entries(handlers).forEach(([event, handler]) => {
    element.removeEventListener(event, handler);
  });

  // Clean up attributes
  element.removeAttribute("aria-dropeffect");

  dropZoneRegistry.delete(element);
}

// ============================================================================
// Event Handlers
// ============================================================================

function handleDragStart(e, element, config) {
  if (config.disabled) {
    e.preventDefault();
    return;
  }

  // Check if drag started from handle
  if (config.handle) {
    const dragTarget = e.target;
    // Check if the drag target is the handle or inside the handle
    if (
      !dragTarget.matches(config.handle) &&
      !dragTarget.closest(config.handle)
    ) {
      e.preventDefault();
      return;
    }
  }

  dragState.isDragging = true;
  dragState.draggedElement = element;
  dragState.sourceContainer = element.parentElement;
  dragState.keyboardMode = false;

  // Store position
  const rect = element.getBoundingClientRect();
  dragState.startX = rect.left;
  dragState.startY = rect.top;
  dragState.offsetX = e.clientX - rect.left;
  dragState.offsetY = e.clientY - rect.top;

  // Store drag data
  dragState.dragData = {
    element,
    data: config.data,
    source: dragState.sourceContainer,
  };

  // Set drag image
  if (config.helper === "clone") {
    createGhost(element, config);
    e.dataTransfer.setDragImage(
      dragState.ghost,
      dragState.offsetX,
      dragState.offsetY,
    );
  }

  // Set visual feedback
  element.classList.add(config.dragClass);
  element.setAttribute("aria-grabbed", "true");
  element.style.opacity = config.opacity;

  // Set allowed effects
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", element.id || "");

  // Create placeholder for sortable lists
  if (shouldShowPlaceholder(element)) {
    createPlaceholder(element);
  }

  // Announce to screen readers
  announce(`Started dragging ${getElementLabel(element)}`);

  // Fire callback
  if (config.onDragStart) {
    config.onDragStart(dragState.dragData);
  }
}

function handleDrag(e, element, config) {
  if (!dragState.isDragging) return;

  // Skip if no movement data
  if (e.clientX === 0 && e.clientY === 0) return;

  // Calculate movement
  let deltaX = e.clientX - dragState.startX - dragState.offsetX;
  let deltaY = e.clientY - dragState.startY - dragState.offsetY;

  // Apply axis constraints
  if (config.axis === "x") {
    deltaY = 0;
  } else if (config.axis === "y") {
    deltaX = 0;
  }

  // Apply grid snapping
  if (config.grid) {
    const [gridX, gridY] = config.grid;
    deltaX = Math.round(deltaX / gridX) * gridX;
    deltaY = Math.round(deltaY / gridY) * gridY;
  }

  // Apply visual transform for constraints
  if (config.axis) {
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    element.style.pointerEvents = "none";
  }

  // Update drag data
  const x = dragState.startX + deltaX;
  const y = dragState.startY + deltaY;

  dragState.dragData = {
    ...dragState.dragData,
    x,
    y,
    deltaX,
    deltaY,
  };

  // Auto-scroll
  if (config.scroll) {
    autoScroll(e.clientX, e.clientY, config);
  }

  // Fire callback
  if (config.onDrag) {
    config.onDrag(dragState.dragData);
  }
}

function handleDragEnd(e, element, config) {
  if (!dragState.isDragging) return;

  const wasDropped = dragState.currentDropZone !== null;

  // Revert if needed
  if (config.revert && !wasDropped) {
    revertToPosition(
      element,
      dragState.startX,
      dragState.startY,
      config.revertDuration,
    );
  }

  // Clean up visual feedback
  element.classList.remove(config.dragClass);
  element.setAttribute("aria-grabbed", "false");
  element.style.opacity = "";
  element.style.transform = "";
  element.style.pointerEvents = "";

  // Remove ghost and placeholder
  cleanupDragElements();

  // Announce to screen readers
  const result = wasDropped ? "dropped" : "cancelled";
  announce(`Drag ${result} for ${getElementLabel(element)}`);

  // Fire callback
  if (config.onDragEnd) {
    const endData = {
      ...dragState.dragData,
      dropped: wasDropped,
      dropZone: dragState.currentDropZone,
    };
    config.onDragEnd(endData);
  }

  // Reset state
  resetDragState();
}

function handleDragEnter(e, dropZone, config) {
  if (config.disabled || !dragState.isDragging) return;

  e.preventDefault();

  const draggable = dragState.draggedElement;

  // Check if draggable is accepted
  if (!isAccepted(draggable, config.accept)) {
    return;
  }

  dragState.currentDropZone = dropZone;
  dropZone.classList.add(config.activeClass);

  // Announce to screen readers
  announce(`Entered drop zone ${getElementLabel(dropZone)}`);

  // Fire callback
  if (config.onDragEnter) {
    config.onDragEnter({
      ...dragState.dragData,
      dropZone,
    });
  }
}

function handleDragOver(e, dropZone, config) {
  if (config.disabled || !dragState.isDragging) return;

  e.preventDefault();

  const draggable = dragState.draggedElement;

  // Check if draggable is accepted
  if (!isAccepted(draggable, config.accept)) {
    e.dataTransfer.dropEffect = "none";
    return;
  }

  e.dataTransfer.dropEffect = "move";
  dropZone.classList.add(config.hoverClass);

  // Handle sortable behavior
  if (config.sortable) {
    handleSortableOver(e, dropZone, config);
  }

  // Fire callback
  if (config.onDragOver) {
    config.onDragOver({
      ...dragState.dragData,
      dropZone,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }
}

function handleDragLeave(e, dropZone, config) {
  if (config.disabled || !dragState.isDragging) return;

  // Only process if actually leaving (not entering a child)
  if (!dropZone.contains(e.relatedTarget)) {
    dropZone.classList.remove(config.activeClass, config.hoverClass);

    if (dragState.currentDropZone === dropZone) {
      dragState.currentDropZone = null;
    }

    // Fire callback
    if (config.onDragLeave) {
      config.onDragLeave({
        ...dragState.dragData,
        dropZone,
      });
    }
  }
}

function handleDrop(e, dropZone, config) {
  if (config.disabled || !dragState.isDragging) return;

  e.preventDefault();
  e.stopPropagation();

  const draggable = dragState.draggedElement;

  // Check if draggable is accepted
  if (!isAccepted(draggable, config.accept)) {
    return;
  }

  // Clean up classes
  dropZone.classList.remove(config.activeClass, config.hoverClass);

  // Handle sortable drop
  if (config.sortable) {
    handleSortableDrop(draggable, dropZone, config);
  }

  // Create drop data
  const dropData = {
    ...dragState.dragData,
    dropZone,
    clientX: e.clientX,
    clientY: e.clientY,
    target: e.target,
  };

  // Announce to screen readers
  announce(
    `Dropped ${getElementLabel(draggable)} in ${getElementLabel(dropZone)}`,
  );

  // Fire callback
  if (config.onDrop) {
    config.onDrop(dropData);
  }
}

// ============================================================================
// Keyboard Support
// ============================================================================

function handleKeyDown(e, element, config) {
  if (config.disabled) return;

  // Space or Enter to grab/drop
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();

    if (!dragState.keyboardMode) {
      // Start keyboard drag
      startKeyboardDrag(element, config);
    } else {
      // Drop
      endKeyboardDrag(element, config);
    }
  }

  // Arrow keys to move
  if (dragState.keyboardMode && dragState.draggedElement === element) {
    let handled = false;
    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case "ArrowUp":
        moveElement(element, 0, -step);
        handled = true;
        break;
      case "ArrowDown":
        moveElement(element, 0, step);
        handled = true;
        break;
      case "ArrowLeft":
        moveElement(element, -step, 0);
        handled = true;
        break;
      case "ArrowRight":
        moveElement(element, step, 0);
        handled = true;
        break;
      case "Escape":
        cancelKeyboardDrag(element, config);
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
    }
  }
}

function startKeyboardDrag(element, config) {
  dragState.isDragging = true;
  dragState.draggedElement = element;
  dragState.sourceContainer = element.parentElement;
  dragState.keyboardMode = true;
  dragState.offsetX = 0;
  dragState.offsetY = 0;

  const rect = element.getBoundingClientRect();
  dragState.startX = rect.left;
  dragState.startY = rect.top;

  dragState.dragData = {
    element,
    data: config.data,
    source: dragState.sourceContainer,
  };

  element.classList.add(config.dragClass);
  element.setAttribute("aria-grabbed", "true");

  announce(
    `Grabbed ${getElementLabel(
      element,
    )}. Use arrow keys to move, Enter to drop, Escape to cancel.`,
  );

  if (config.onDragStart) {
    config.onDragStart(dragState.dragData);
  }
}

function endKeyboardDrag(element, config) {
  // Find drop zone under element
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  element.style.display = "none";
  const targetElement = document.elementFromPoint(centerX, centerY);
  element.style.display = "";

  const dropZone = findDropZone(targetElement);

  if (dropZone) {
    const dropConfig = dropZoneRegistry.get(dropZone)?.config;
    if (dropConfig && isAccepted(element, dropConfig.accept)) {
      dragState.currentDropZone = dropZone;

      if (dropConfig.onDrop) {
        dropConfig.onDrop({
          ...dragState.dragData,
          dropZone,
          clientX: centerX,
          clientY: centerY,
        });
      }
    }
  }

  element.classList.remove(config.dragClass);
  element.setAttribute("aria-grabbed", "false");

  const result = dropZone ? "dropped" : "cancelled";
  announce(`Drag ${result} for ${getElementLabel(element)}`);

  if (config.onDragEnd) {
    config.onDragEnd({
      ...dragState.dragData,
      dropped: !!dropZone,
      dropZone,
    });
  }

  resetDragState();
}

function cancelKeyboardDrag(element, config) {
  element.classList.remove(config.dragClass);
  element.setAttribute("aria-grabbed", "false");

  announce(`Drag cancelled for ${getElementLabel(element)}`);

  if (config.onDragEnd) {
    config.onDragEnd({
      ...dragState.dragData,
      dropped: false,
      dropZone: null,
    });
  }

  resetDragState();
}

function moveElement(element, deltaX, deltaY) {
  // Accumulate total offset for keyboard movement
  dragState.offsetX += deltaX;
  dragState.offsetY += deltaY;

  const rect = element.getBoundingClientRect();
  const newX = rect.left + dragState.offsetX;
  const newY = rect.top + dragState.offsetY;

  element.style.transform = `translate(${dragState.offsetX}px, ${dragState.offsetY}px)`;

  // Check for drop zones
  element.style.display = "none";
  const targetElement = document.elementFromPoint(newX, newY);
  element.style.display = "";

  const dropZone = findDropZone(targetElement);
  if (dropZone && dropZone !== dragState.currentDropZone) {
    dragState.currentDropZone = dropZone;
    announce(`Over drop zone ${getElementLabel(dropZone)}`);
  }
}

// ============================================================================
// Touch Support
// ============================================================================

let touchState = {
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
};

function handleTouchStart(e, element, config) {
  if (config.disabled) return;

  // Check if touch started on handle
  if (config.handle && !e.target.closest(config.handle)) {
    return;
  }

  const touch = e.touches[0];
  touchState = {
    active: true,
    startX: touch.clientX,
    startY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY,
  };

  // Don't start drag immediately - wait for movement
}

function handleTouchMove(e, element, config) {
  if (!touchState.active || config.disabled) return;

  e.preventDefault();

  const touch = e.touches[0];
  touchState.currentX = touch.clientX;
  touchState.currentY = touch.clientY;

  const deltaX = touchState.currentX - touchState.startX;
  const deltaY = touchState.currentY - touchState.startY;

  // Start drag after threshold
  if (!dragState.isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
    startTouchDrag(e, element, config);
  }

  if (dragState.isDragging) {
    // Move element
    if (config.axis !== "y") {
      element.style.transform = `translateX(${deltaX}px)`;
    }
    if (config.axis !== "x") {
      element.style.transform = `translateY(${deltaY}px)`;
    }
    if (!config.axis) {
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    // Check drop zones
    checkTouchDropZones(touch, element, config);
  }
}

function handleTouchEnd(e, element, config) {
  if (!touchState.active) return;

  if (dragState.isDragging) {
    endTouchDrag(e, element, config);
  }

  touchState.active = false;
}

function startTouchDrag(e, element, config) {
  dragState.isDragging = true;
  dragState.draggedElement = element;
  dragState.sourceContainer = element.parentElement;

  const rect = element.getBoundingClientRect();
  dragState.startX = rect.left;
  dragState.startY = rect.top;

  dragState.dragData = {
    element,
    data: config.data,
    source: dragState.sourceContainer,
  };

  element.classList.add(config.dragClass);
  element.style.opacity = config.opacity;
  element.style.zIndex = config.zIndex;

  if (config.onDragStart) {
    config.onDragStart(dragState.dragData);
  }
}

function endTouchDrag(e, element, config) {
  const wasDropped = dragState.currentDropZone !== null;

  // Revert if needed
  if (config.revert && !wasDropped) {
    revertToPosition(
      element,
      dragState.startX,
      dragState.startY,
      config.revertDuration,
    );
  }

  element.classList.remove(config.dragClass);
  element.style.opacity = "";
  element.style.zIndex = "";
  element.style.transform = "";

  if (config.onDragEnd) {
    config.onDragEnd({
      ...dragState.dragData,
      dropped: wasDropped,
      dropZone: dragState.currentDropZone,
    });
  }

  resetDragState();
}

function checkTouchDropZones(touch, element, config) {
  element.style.display = "none";
  const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
  element.style.display = "";

  const dropZone = findDropZone(targetElement);

  if (dropZone !== dragState.currentDropZone) {
    // Left previous zone
    if (dragState.currentDropZone) {
      const prevConfig = dropZoneRegistry.get(
        dragState.currentDropZone,
      )?.config;
      if (prevConfig) {
        dragState.currentDropZone.classList.remove(prevConfig.hoverClass);
      }
    }

    // Entered new zone
    if (dropZone) {
      const dropConfig = dropZoneRegistry.get(dropZone)?.config;
      if (dropConfig && isAccepted(element, dropConfig.accept)) {
        dropZone.classList.add(dropConfig.hoverClass);
        dragState.currentDropZone = dropZone;

        if (dropConfig.onDragEnter) {
          dropConfig.onDragEnter({
            ...dragState.dragData,
            dropZone,
          });
        }
      }
    } else {
      dragState.currentDropZone = null;
    }
  }
}

// ============================================================================
// Sortable List Support
// ============================================================================

function handleSortableOver(e, dropZone, config) {
  const draggable = dragState.draggedElement;
  const children = Array.from(dropZone.children).filter(
    (child) => child !== draggable && child !== dragState.placeholder,
  );

  if (children.length === 0) {
    return;
  }

  // Find insertion point
  const afterElement = getDragAfterElement(
    dropZone,
    e.clientX,
    e.clientY,
    config.direction,
  );

  if (dragState.placeholder && config.placeholder) {
    if (afterElement) {
      dropZone.insertBefore(dragState.placeholder, afterElement);
    } else {
      dropZone.appendChild(dragState.placeholder);
    }
  }
}

function handleSortableDrop(draggable, dropZone, config) {
  if (dragState.placeholder) {
    // Insert draggable at placeholder position
    dropZone.insertBefore(draggable, dragState.placeholder);
    dragState.placeholder.remove();
    dragState.placeholder = null;
  } else {
    // Just append to end
    dropZone.appendChild(draggable);
  }
}

function getDragAfterElement(container, x, y, direction) {
  const draggableElements = Array.from(container.children).filter(
    (child) =>
      child !== dragState.draggedElement && child !== dragState.placeholder,
  );

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset =
        direction === "vertical"
          ? y - box.top - box.height / 2
          : x - box.left - box.width / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

// ============================================================================
// Helper Functions
// ============================================================================

function createGhost(element, config) {
  const ghost = element.cloneNode(true);
  ghost.style.position = "absolute";
  ghost.style.top = "-9999px";
  ghost.style.left = "-9999px";
  ghost.style.opacity = config.opacity;
  ghost.style.pointerEvents = "none";

  const appendTarget =
    config.appendTo === "body"
      ? document.body
      : document.querySelector(config.appendTo);
  appendTarget.appendChild(ghost);

  dragState.ghost = ghost;
}

function createPlaceholder(element) {
  const placeholder = document.createElement("div");
  placeholder.className = "ds-drag-placeholder";
  placeholder.style.height = `${element.offsetHeight}px`;
  placeholder.style.width = `${element.offsetWidth}px`;
  placeholder.style.border = "2px dashed var(--md-sys-color-outline)";
  placeholder.style.borderRadius = "4px";
  placeholder.style.opacity = "0.5";
  placeholder.style.margin = window.getComputedStyle(element).margin;

  element.parentElement.insertBefore(placeholder, element.nextSibling);
  dragState.placeholder = placeholder;
}

function shouldShowPlaceholder(element) {
  const parent = element.parentElement;
  const parentData = dropZoneRegistry.get(parent);
  return parentData?.config.sortable && parentData?.config.placeholder;
}

function cleanupDragElements() {
  if (dragState.ghost) {
    dragState.ghost.remove();
    dragState.ghost = null;
  }

  if (dragState.placeholder) {
    dragState.placeholder.remove();
    dragState.placeholder = null;
  }
}

function revertToPosition(element, x, y, duration) {
  const currentRect = element.getBoundingClientRect();
  const deltaX = x - currentRect.left;
  const deltaY = y - currentRect.top;

  element.style.transition = `transform ${duration}ms ease-out`;
  element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  setTimeout(() => {
    element.style.transition = "";
    element.style.transform = "";
  }, duration);
}

function isAccepted(element, accept) {
  if (accept === "*") return true;
  return element.matches(accept);
}

function findDropZone(element) {
  if (!element) return null;

  let current = element;
  while (current && current !== document.body) {
    if (dropZoneRegistry.has(current)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function autoScroll(x, y, config) {
  const { scrollSensitivity, scrollSpeed } = config;
  const { innerWidth, innerHeight } = window;

  let scrollX = 0;
  let scrollY = 0;

  if (x < scrollSensitivity) {
    scrollX = -scrollSpeed;
  } else if (x > innerWidth - scrollSensitivity) {
    scrollX = scrollSpeed;
  }

  if (y < scrollSensitivity) {
    scrollY = -scrollSpeed;
  } else if (y > innerHeight - scrollSensitivity) {
    scrollY = scrollSpeed;
  }

  if (scrollX !== 0 || scrollY !== 0) {
    window.scrollBy(scrollX, scrollY);
  }
}

function getElementLabel(element) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent?.trim() ||
    element.id ||
    "item"
  );
}

function announce(message) {
  let announcer = document.getElementById("ds-drag-drop-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "ds-drag-drop-announcer";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
  }

  announcer.textContent = message;
}

function resetDragState() {
  dragState.isDragging = false;
  dragState.draggedElement = null;
  dragState.dragData = null;
  dragState.sourceContainer = null;
  dragState.currentDropZone = null;
  dragState.startX = 0;
  dragState.startY = 0;
  dragState.offsetX = 0;
  dragState.offsetY = 0;
  dragState.keyboardMode = false;
}

/**
 * Get current drag state (for debugging/monitoring)
 * @returns {Object} Current drag state
 */
export function getDragState() {
  return { ...dragState };
}

/**
 * Initialize drag-drop on elements with data attributes
 * @param {Element} root - Root element to search within
 * @returns {number} Number of elements initialized
 */
export function initDragDrop(root = document) {
  let count = 0;

  // Initialize draggables
  const draggables = root.querySelectorAll("[data-draggable]");
  draggables.forEach((element) => {
    if (!draggableRegistry.has(element)) {
      const options = {};

      // Parse data attributes
      if (element.dataset.dragHandle)
        options.handle = element.dataset.dragHandle;
      if (element.dataset.dragAxis) options.axis = element.dataset.dragAxis;
      if (element.dataset.dragCursor)
        options.cursor = element.dataset.dragCursor;
      if (element.dataset.dragOpacity)
        options.opacity = parseFloat(element.dataset.dragOpacity);
      if (element.dataset.dragRevert)
        options.revert = element.dataset.dragRevert === "true";

      makeDraggable(element, options);
      count++;
    }
  });

  // Initialize drop zones
  const dropZones = root.querySelectorAll("[data-drop-zone]");
  dropZones.forEach((element) => {
    if (!dropZoneRegistry.has(element)) {
      const options = {};

      // Parse data attributes
      if (element.dataset.dropAccept)
        options.accept = element.dataset.dropAccept;
      if (element.dataset.dropSortable)
        options.sortable = element.dataset.dropSortable === "true";
      if (element.dataset.dropDirection)
        options.direction = element.dataset.dropDirection;

      makeDropZone(element, options);
      count++;
    }
  });

  return count;
}

// Auto-initialize on page load
if (typeof document !== "undefined") {
  const bootstrap = () => initDragDrop();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
}
