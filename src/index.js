// CSS is loaded separately via <link> tags in HTML for better separation
// This allows users to load CSS independently of JS components

// Import utilities
import "./utils/ripple.js";
import { initFocusRings } from "./utils/focus-ring.js";
import { initDragDrop } from "./utils/drag-drop.js";
import { initAnimationPresets } from "./utils/animation-presets.js";

// Export all components
export { default as DSButton } from "./components/button/button.js";
export { default as DSIcon } from "./components/icon/icon.js";
export { default as DSTextField } from "./components/text-field/text-field.js";
export { default as DSCheckbox } from "./components/checkbox/checkbox.js";
export { default as DSNavigationDrawer } from "./components/navigation-drawer/navigation-drawer.js";
export { default as DSNavItem } from "./components/navigation-drawer/nav-item.js";
export { DSRadio } from "./components/ds-radio.js";
export { DSSwitch } from "./components/ds-switch.js";
export { DSTextarea } from "./components/ds-textarea.js";
export { DSChip } from "./components/ds-chip.js";
export { DSTooltip } from "./components/ds-tooltip.js";
export { DSSnackbar } from "./components/ds-snackbar.js";
export { DSDialog } from "./components/ds-dialog.js";
export { DSCard } from "./components/ds-card.js";
export { DSFab } from "./components/ds-fab.js";
export { DSMenu, DSMenuItem } from "./components/ds-menu.js";
export {
  DSLinearProgress,
  DSCircularProgress,
} from "./components/ds-progress-indicator.js";
export { DSSlider } from "./components/ds-slider.js";
export { DSTabs, DSTab, DSTabPanel } from "./components/ds-tabs.js";
export { DSBadge } from "./components/ds-badge.js";
export { DSSplitButton } from "./components/split-button/split-button.js";
export { DSDatePicker } from "./components/date-picker/date-picker.js";
export { DSTimePicker } from "./components/time-picker/time-picker.js";
export {
  DSNavigationBar,
  DSNavigationBarItem,
} from "./components/navigation-bar/navigation-bar.js";
export {
  DSNavigationRail,
  DSNavigationRailItem,
} from "./components/navigation-rail/navigation-rail.js";
export { DSAppBarTop } from "./components/app-bar-top/app-bar-top.js";
export { DSAppBarBottom } from "./components/app-bar-bottom/app-bar-bottom.js";
export { DSDivider } from "./components/divider/divider.js";
export { DSList, DSListItem } from "./components/list/list.js";
export { default as DSButtonGroup } from "./components/button-group/button-group.js";
export { DSSearch } from "./components/search/search.js";
export { DSCarousel } from "./components/carousel/carousel.js";
export { DSBottomSheet } from "./components/bottom-sheet/bottom-sheet.js";
export { DSSideSheet } from "./components/side-sheet/side-sheet.js";
export { DSCombobox } from "./components/combobox/combobox.js";
export { DSBanner } from "./components/banner/banner.js";
export { DSDataTable } from "./components/data-table/data-table.js";
export { DSForm } from "./components/form/form.js";
export { DSTextWrapper } from "./components/text-wrapper/text-wrapper.js";
export { DSScrollbar } from "./components/scrollbar/scrollbar.js";
export { DSSearchView } from "./components/search-view/search-view.js";
export { DSAdvancedMenu } from "./components/advanced-menu.js";
export { DSResponsiveImage } from "./components/responsive-image/responsive-image.js";
export { default as DSVirtualScroll } from "./components/virtual-scroll/virtual-scroll.js";
export {
  applyFocusRing,
  initFocusRings,
  removeFocusRing,
} from "./utils/focus-ring.js";
export {
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
} from "./utils/elevation.js";
export {
  makeDraggable,
  makeDropZone,
  removeDraggable,
  removeDropZone,
  getDragState,
  initDragDrop,
} from "./utils/drag-drop.js";
export {
  initAnimationPresets,
  animate,
  animateWithClass,
  animateSequence,
  animateSequenceOnElement,
  getPresets,
  getPreset,
  getDuration,
  getEasing,
  createPreset,
  DURATIONS,
  EASINGS,
  PRESETS,
  KEYFRAMES,
} from "./utils/animation-presets.js";

// Auto-register all components (optional convenience)
export function registerComponents() {
  // Components are auto-registered when imported
  import("./components/button/button.js");
  import("./components/icon/icon.js");
  import("./components/text-field/text-field.js");
  import("./components/checkbox/checkbox.js");
  import("./components/navigation-drawer/navigation-drawer.js");
  import("./components/navigation-drawer/nav-item.js");
  import("./components/ds-radio.js");
  import("./components/ds-switch.js");
  import("./components/ds-textarea.js");
  import("./components/ds-chip.js");
  import("./components/ds-tooltip.js");
  import("./components/ds-snackbar.js");
  import("./components/ds-dialog.js");
  import("./components/ds-card.js");
  import("./components/ds-fab.js");
  import("./components/ds-menu.js");
  import("./components/ds-progress-indicator.js");
  import("./components/ds-slider.js");
  import("./components/ds-tabs.js");
  import("./components/ds-badge.js");
  import("./components/split-button/split-button.js");
  import("./components/date-picker/date-picker.js");
  import("./components/time-picker/time-picker.js");
  import("./components/navigation-bar/navigation-bar.js");
  import("./components/navigation-rail/navigation-rail.js");
  import("./components/app-bar-top/app-bar-top.js");
  import("./components/app-bar-bottom/app-bar-bottom.js");
  import("./components/divider/divider.js");
  import("./components/list/list.js");
  import("./components/button-group/button-group.js");
  import("./components/search/search.js");
  import("./components/carousel/carousel.js");
  import("./components/bottom-sheet/bottom-sheet.js");
  import("./components/side-sheet/side-sheet.js");
  import("./components/combobox/combobox.js");
  import("./components/banner/banner.js");
  import("./components/data-table/data-table.js");
  import("./components/form/form.js");
  import("./components/text-wrapper/text-wrapper.js");
  import("./components/scrollbar/scrollbar.js");
  import("./components/search-view/search-view.js");
  import("./components/advanced-menu.js");
  import("./components/virtual-scroll/virtual-scroll.js");
  import("./utils/focus-ring.js");
  // Initialize drag-drop for any elements marked in the page
  initDragDrop();
  // Initialize animation presets
  initAnimationPresets();
}

// Auto-register on import
registerComponents();

// Initialize focus rings for any elements marked in the page
initFocusRings();
