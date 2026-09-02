# Component Testing Standard

**Design System Test Strategy & Reference**  
Version 1.0 | Last Updated: February 3, 2026

This document defines the comprehensive testing strategy for all components in the Castrovalva Design System. It serves as a reference for developing test suites for new and existing components.

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Coverage Requirements](#coverage-requirements)
4. [Test Organization](#test-organization)
5. [Test Categories](#test-categories)
6. [Best Practices](#best-practices)
7. [Component Test Structure](#component-test-structure)
8. [Accessibility Testing](#accessibility-testing)
9. [Component-Specific Guidelines](#component-specific-guidelines)
10. [Tools & Setup](#tools--setup)
11. [Quality Checklist](#quality-checklist)

---

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how it does it
2. **User-Centric Testing** - Write tests that reflect actual user interactions
3. **Comprehensive Coverage** - Cover critical paths, edge cases, and accessibility requirements
4. **Maintainability** - Keep tests clear, organized, and easy to update
5. **Performance** - Minimize test suite runtime while maximizing coverage

### Testing Goals

- Prevent regressions in core functionality
- Ensure consistent behavior across browsers
- Validate accessibility compliance (WCAG 2.2 AA)
- Document expected component behavior
- Enable confident refactoring and updates

---

## Testing Pyramid

The recommended distribution of test types across your component test suite:

```
         E2E Tests (10%)
         5-15 tests per component
         Real browser, complete workflows

       Integration Tests (30%)
       20-35 tests per component
       Multi-component interaction, state management

     Unit Tests (60%)
     40-60 tests per component
     Single functions, attribute binding, event emission
```

**Total target: 65-110 tests per component**

### Test Type Definitions

**Unit Tests (60%)**

- Test individual methods and functions in isolation
- Test attribute binding and property getters/setters
- Test event emission with correct detail objects
- Test internal state changes
- Test slot rendering and DOM structure
- Mock external dependencies
- Fast execution (<1ms per test)

**Integration Tests (30%)**

- Test component interactions with DOM
- Test keyboard navigation and focus management
- Test ARIA attribute management
- Test state changes across user interactions
- Test event propagation
- Test with realistic DOM structures
- Moderate execution (5-20ms per test)

**E2E Tests (10%)**

- Test complete user workflows
- Test browser compatibility
- Test with actual rendered components
- Test cross-component interactions
- Slower execution (100-500ms per test)

---

## Coverage Requirements

### Minimum Standards

- **Statement Coverage:** 85% minimum (aim for 90%)
- **Branch Coverage:** 80% minimum
- **Function Coverage:** 85% minimum
- **Line Coverage:** 85% minimum

### Coverage Targets by Component Type

| Component Type              | Statement | Branch | Function | Notes                    |
| --------------------------- | --------- | ------ | -------- | ------------------------ |
| Action (Button, FAB)        | 90%       | 85%    | 90%      | High user interaction    |
| Selection (Checkbox, Radio) | 88%       | 82%    | 88%      | State management complex |
| Input (TextField, Select)   | 85%       | 78%    | 85%      | Validation logic         |
| Display (Card, Chip)        | 82%       | 75%    | 82%      | Limited interaction      |
| Navigation (Tabs, Drawer)   | 88%       | 85%    | 88%      | Keyboard nav critical    |
| Container (Dialog, Sheet)   | 85%       | 80%    | 85%      | State & event driven     |

### What NOT to Test

❌ Don't test browser APIs (they're tested by browser vendors)  
❌ Don't test third-party libraries exhaustively  
❌ Don't aim for 100% coverage (diminishing returns)  
❌ Don't test trivial code (simple getters, one-liners)  
❌ Don't test CSS/styling (use visual regression instead)

### What TO Test

✅ Component behavior and user interactions  
✅ Attribute binding and property changes  
✅ Event emission and detail accuracy  
✅ ARIA attributes and accessibility  
✅ Keyboard navigation  
✅ Focus management  
✅ State persistence  
✅ Edge cases and error states  
✅ Integration with other components

---

## Test Organization

### File Structure

```
src/components/
├── {component-name}/
│   ├── {component-name}.js
│   ├── README.md
│   └── (no tests here - keep separate)

test/
├── {component-name}.test.js          # Main unit/integration tests
├── {component-name}.a11y.test.js     # Accessibility-specific tests
├── unit/
│   └── {component-name}.test.js      # Unit-only tests (see placement rules)
└── fixtures/
    └── {component-name}.html         # Test HTML fixtures
```

### Test Placement Decision Matrix

Use this matrix to decide where a new test file belongs. When in doubt, default to the main test folder.

**Place tests in test/{component}.test.js when the component:**

- Handles user interactions (click, input, drag, touch)
- Requires keyboard navigation or focus management
- Manages ARIA roles/attributes or accessibility behavior
- Emits custom events used by other components
- Coordinates with other components or the DOM

**Place tests in test/unit/{component}.test.js when the component:**

- Is a utility or helper with no DOM rendering
- Is a purely presentational element with no interactions
- Has no keyboard/focus behavior and minimal state
- Does not coordinate with other components

**Notes:**

- Utilities in src/utils should always use test/unit
- If the component has both unit-only and integration scenarios, keep the primary suite in test/ and optionally add a focused unit file in test/unit

### Pre-Test Planning Checklist

Capture these details before writing tests:

- Component name and tag (for describe block and fixtures)
- Source file path (for imports)
- Component type (Action, Input, Selection, Display, Navigation, Container)
- Attributes and properties (including defaults and type coercion)
- Public methods and expected behaviors
- Events emitted and their detail payloads
- Slots and fallback content rules
- States (disabled, error, loading, selected, etc.)
- Accessibility requirements (roles, aria-\*, keyboard support)

### Test File Organization

Each component test file should be organized into describe blocks:

```javascript
describe('ds-{component-name}', () => {
  // Lifecycle
  describe('Initialization', () => { ... })

  // Attributes & Properties
  describe('Attributes', () => { ... })
  describe('Properties', () => { ... })

  // Methods
  describe('Methods', () => { ... })

  // Events
  describe('Events', () => { ... })

  // Slots (if applicable)
  describe('Slots', () => { ... })

  // User Interactions
  describe('Click Interaction', () => { ... })
  describe('Keyboard Navigation', () => { ... })
  describe('Focus Management', () => { ... })

  // States
  describe('Disabled State', () => { ... })
  describe('Error State', () => { ... })
  describe('Loading State', () => { ... })

  // ARIA & Accessibility
  describe('ARIA Attributes', () => { ... })
  describe('Screen Reader Support', () => { ... })
  describe('Keyboard-Only Navigation', () => { ... })

  // Integration
  describe('Integration', () => { ... })
})
```

---

## Test Categories

### 1. Initialization & Lifecycle

**What to test:**

- Component creates successfully
- Default attributes are set
- Initial DOM structure is correct
- Shadow DOM is properly initialized
- Styles are applied

**Example:**

```javascript
it("should create with default attributes", async () => {
  const el = await fixture("<ds-button>Click me</ds-button>");
  expect(el).to.exist;
  expect(el.variant).to.equal("filled");
  expect(el.disabled).to.be.false;
});
```

### 2. Attributes & Properties

**What to test:**

- All attributes are settable
- Properties reflect attribute changes
- Type coercion works correctly
- Invalid values are handled
- Defaults are applied

**Example:**

```javascript
it("should set variant attribute", async () => {
  const el = await fixture("<ds-button></ds-button>");
  el.variant = "outlined";
  expect(el.getAttribute("variant")).to.equal("outlined");
  expect(el.variant).to.equal("outlined");
});

it("should coerce disabled to boolean", async () => {
  const el = await fixture('<ds-button disabled="false"></ds-button>');
  expect(el.disabled).to.be.false;
});
```

### 3. Methods

**What to test:**

- All public methods work correctly
- Methods return expected values
- Methods update state properly
- Methods handle edge cases
- Methods work with various inputs

**Example:**

```javascript
it("should select tab by index", async () => {
  const el = await fixture(tabsFixture);
  await el.selectTabByIndex(2);
  expect(el.selectedIndex).to.equal(2);
});
```

### 4. Events

**What to test:**

- Events are emitted at correct times
- Events have correct detail objects
- Events bubble/don't bubble appropriately
- Multiple listeners receive events
- Events can be prevented

**Example:**

```javascript
it('should emit "change" event when value changes', async () => {
  const el = await fixture("<ds-input></ds-input>");
  let changed = false;
  let detail = null;

  el.addEventListener("change", (e) => {
    changed = true;
    detail = e.detail;
  });

  el.value = "new value";
  await elementUpdated(el);

  expect(changed).to.be.true;
  expect(detail.value).to.equal("new value");
});
```

### 5. Slots

**What to test:**

- Slot content renders correctly
- Multiple slots work independently
- Named slots function properly
- Slotted content receives correct styling
- Fallback content displays when slot is empty

**Example:**

```javascript
it("should render slotted content", async () => {
  const el = await fixture(`
    <ds-card>
      <span slot="title">Card Title</span>
      <span>Card content</span>
    </ds-card>
  `);
  const slotted = el.querySelector('[slot="title"]');
  expect(slotted.textContent).to.equal("Card Title");
});
```

### 6. User Interactions

**What to test:**

- Click handlers work
- Double-click is handled (if applicable)
- Form submission works
- Input changes are captured
- Touch events work (if applicable)

**Example:**

```javascript
it("should handle click event", async () => {
  const el = await fixture("<ds-button>Click</ds-button>");
  let clicked = false;

  el.addEventListener("click", () => {
    clicked = true;
  });

  el.click();
  expect(clicked).to.be.true;
});
```

### 7. Keyboard Navigation

**What to test:**

- All documented keyboard shortcuts work
- Focus movement is correct
- Disabled items are skipped
- Home/End keys work (navigation components)
- Escape key closes modals/menus
- Arrow keys navigate lists

**Example:**

```javascript
it("should move to next tab with ArrowRight", async () => {
  const el = await fixture(tabsFixture);
  const firstTab = el.querySelector('[role="tab"]');

  firstTab.focus();
  firstTab.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    }),
  );

  await elementUpdated(el);
  const focusedTab = el.shadowRoot.activeElement;
  expect(focusedTab).to.not.equal(firstTab);
});
```

### 8. Focus Management

**What to test:**

- Components are focusable (if interactive)
- Focus indicator is visible
- Focus trapping works (modals)
- Focus is restored (after modal close)
- Tab order is correct
- Focus doesn't leak to shadow DOM

**Example:**

```javascript
it("should receive focus", async () => {
  const el = await fixture("<ds-button>Click</ds-button>");
  el.focus();
  expect(document.activeElement).to.equal(el);
});
```

### 9. State Management

**What to test:**

- State changes persist
- State reflects in UI
- State can be reset
- State changes trigger events
- Initial state is correct

**Example:**

```javascript
it("should maintain selected state", async () => {
  const el = await fixture(checkboxFixture);
  el.checked = true;
  await elementUpdated(el);

  expect(el.checked).to.be.true;
  expect(el.hasAttribute("aria-checked")).to.be.true;
});
```

### 10. ARIA & Accessibility

**What to test:**

- Correct ARIA roles are set
- ARIA attributes are managed
- aria-disabled reflects disabled state
- aria-selected reflects selection
- aria-label provides accessible names
- aria-describedby connects descriptions

**Example:**

```javascript
it("should have proper ARIA attributes", async () => {
  const el = await fixture(buttonFixture);
  expect(el.getAttribute("role")).to.equal("button");
  expect(el.hasAttribute("aria-disabled")).to.be.true;
});
```

### 11. Disabled State

**What to test:**

- Disabled components don't respond to interaction
- Disabled is visually distinct
- Disabled attribute works
- ARIA reflects disabled state
- Disabled programmatically works

**Example:**

```javascript
it("should not emit click event when disabled", async () => {
  const el = await fixture("<ds-button disabled>Click</ds-button>");
  let clicked = false;

  el.addEventListener("click", () => {
    clicked = true;
  });

  el.click();
  expect(clicked).to.be.false;
});
```

### 12. Error/Validation States

**What to test:**

- Error state displays
- Error messages show
- Validation runs
- Invalid states are communicated
- Error recovery works

**Example:**

```javascript
it("should show error state", async () => {
  const el = await fixture("<ds-input error></ds-input>");
  expect(el.hasAttribute("error")).to.be.true;
  expect(el.classList.contains("error")).to.be.true;
});
```

### 13. Edge Cases

**What to test:**

- Rapid interactions
- Dynamic DOM changes (add/remove elements)
- Memory leaks (listeners are cleaned up)
- Very long content
- Empty/null values
- Extreme sizes

**Example:**

```javascript
it("should handle rapid clicks", async () => {
  const el = await fixture("<ds-button>Click</ds-button>");
  let clickCount = 0;
  el.addEventListener("click", () => clickCount++);

  el.click();
  el.click();
  el.click();

  expect(clickCount).to.equal(3);
});
```

### 14. Integration Tests

**What to test:**

- Component works with other components
- Component works in forms
- Component works in data-binding scenarios
- Event propagation with parent components
- Nested components work correctly

**Example:**

```javascript
it("should work in a form", async () => {
  const el = await fixture(`
    <form>
      <ds-input name="username"></ds-input>
      <ds-button type="submit">Submit</ds-button>
    </form>
  `);
  // Test form submission handling
});
```

---

## Best Practices

### 1. Test Naming

✅ **Good:**

```javascript
it("should select next tab when ArrowRight is pressed", () => {});
it('should set aria-selected="true" on selected tab', () => {});
it("should not emit click event when disabled", () => {});
```

❌ **Bad:**

```javascript
it("works", () => {});
it("test arrow key", () => {});
it("disabled button", () => {});
```

**Formula:** `it('should [expected behavior] when [action]', () => { })`

### 2. Test Isolation

Each test must be independent:

```javascript
// ✅ GOOD - Each test sets up its own fixture
describe("Button", () => {
  it("test 1", async () => {
    const el = await fixture(buttonFixture);
    // test
  });

  it("test 2", async () => {
    const el = await fixture(buttonFixture);
    // test
  });
});

// ❌ BAD - Tests depend on shared state
let button;
describe("Button", () => {
  before(() => {
    button = fixture(buttonFixture);
  });

  it("test 1", () => {
    button.click(); // Depends on previous test
  });
});
```

### 3. Use beforeEach for Repeated Setup

```javascript
describe("Tabs", () => {
  let el;

  beforeEach(async () => {
    el = await fixture(tabsFixture);
  });

  it("should select first tab by default", () => {
    expect(el.selectedIndex).to.equal(0);
  });

  it("should allow selecting another tab", () => {
    el.selectTabByIndex(1);
    expect(el.selectedIndex).to.equal(1);
  });
});
```

### 4. Clear Assertions

```javascript
// ✅ GOOD - Clear what's being tested
expect(el.disabled).to.be.false;
expect(el.getAttribute("aria-selected")).to.equal("true");
expect(eventFired).to.be.true;

// ❌ BAD - Ambiguous
expect(el).to.exist;
expect(el).to.be.ok;
```

### 5. Use Descriptive Variables

```javascript
// ✅ GOOD
const firstTab = el.querySelector('[role="tab"]');
const selectedTab = el.querySelector('[role="tab"][aria-selected="true"]');

// ❌ BAD
const a = el.querySelector('[role="tab"]');
const b = el.querySelector('[role="tab"][aria-selected="true"]');
```

### 6. Mock External Dependencies

```javascript
// ✅ GOOD - Only test component logic
it('should validate email format', () => {
  const el = await fixture('<ds-input type="email">')
  el.value = 'invalid'
  expect(el.validate()).to.be.false
})

// ❌ BAD - Tests browser API instead of component
it('should validate', () => {
  // Testing the browser's email validation, not your component
})
```

### 7. Use Fixtures for Complex HTML

```javascript
// ✅ GOOD - Readable, reusable
const tabsFixture = html`
  <ds-tabs>
    <button slot="tab">Tab 1</button>
    <button slot="tab">Tab 2</button>
    <div slot="panel">Panel 1</div>
    <div slot="panel">Panel 2</div>
  </ds-tabs>
`;

// In test
const el = await fixture(tabsFixture);

// ❌ BAD - Hard to read
const el = await fixture(`
  <ds-tabs>
    <button slot="tab">Tab 1</button>...
  </ds-tabs>
`);
```

### 8. Wait for Updates

```javascript
// ✅ GOOD - Wait for DOM update
el.property = "newValue";
await elementUpdated(el);
expect(el.textContent).to.include("newValue");

// ❌ BAD - Assertion before update completes
el.property = "newValue";
expect(el.textContent).to.include("newValue"); // May fail
```

### 9. Comment Why, Not What

```javascript
// ✅ GOOD - Explains reasoning
it("should skip disabled items during navigation", () => {
  // Disabled items should not receive focus during keyboard navigation
  // per WCAG guidelines and user expectations
  el.disabledIndex = 1;
  navigateDown();
  expect(el.selectedIndex).to.equal(2); // Skipped disabled item
});

// ❌ BAD - Comments just describe code
it("should skip disabled items", () => {
  // Set disabledIndex to 1
  el.disabledIndex = 1;
  // Navigate down
  navigateDown();
  // Check selectedIndex is 2
  expect(el.selectedIndex).to.equal(2);
});
```

---

## Component Test Structure

### Template for New Component Tests

```javascript
import { fixture, html, expect } from "@open-wc/testing";
import { elementUpdated } from "@open-wc/testing";
import "../../src/components/{component}/{component}.js";

describe("ds-{component}", () => {
  // ============================================
  // Initialization
  // ============================================
  describe("Initialization", () => {
    it("should create successfully", async () => {
      const el = await fixture(html`<ds-{component}></ds-{component}>`);
      expect(el).to.exist;
    });

    it("should set default attributes", async () => {
      const el = await fixture(html`<ds-{component}></ds-{component}>`);
      expect(el.getAttribute("role")).to.equal("button");
      expect(el.disabled).to.be.false;
    });
  });

  // ============================================
  // Attributes
  // ============================================
  describe("Attributes", () => {
    it("should set variant attribute", async () => {
      const el = await fixture(html`
        <ds-{component} variant="outlined"></ds-{component}>
      `);
      expect(el.variant).to.equal("outlined");
    });
  });

  // ============================================
  // Events
  // ============================================
  describe("Events", () => {
    it("should emit custom event", async () => {
      const el = await fixture(html`<ds-{component}></ds-{component}>`);
      let eventFired = false;

      el.addEventListener("custom-event", () => {
        eventFired = true;
      });

      el.triggerEvent();
      await elementUpdated(el);

      expect(eventFired).to.be.true;
    });
  });

  // ============================================
  // ARIA & Accessibility
  // ============================================
  describe("Accessibility", () => {
    it("should have accessible name", async () => {
      const el = await fixture(html`
        <ds-{component}>Click me</ds-{component}>
      `);
      expect(el.textContent).to.include("Click me");
    });

    it("should manage aria-disabled state", async () => {
      const el = await fixture(html`
        <ds-{component} disabled></ds-{component}>
      `);
      expect(el.getAttribute("aria-disabled")).to.equal("true");
    });
  });

  // ============================================
  // User Interactions
  // ============================================
  describe("Interactions", () => {
    it("should respond to click", async () => {
      const el = await fixture(html`<ds-{component}></ds-{component}>`);
      let clicked = false;

      el.addEventListener("click", () => {
        clicked = true;
      });

      el.click();
      expect(clicked).to.be.true;
    });
  });

  // ============================================
  // States
  // ============================================
  describe("Disabled State", () => {
    it("should not respond to clicks when disabled", async () => {
      const el = await fixture(html`
        <ds-{component} disabled></ds-{component}>
      `);
      let clicked = false;

      el.addEventListener("click", () => {
        clicked = true;
      });

      el.click();
      expect(clicked).to.be.false;
    });
  });
});
```

---

## Accessibility Testing

### Required Accessibility Tests

For every component, test:

```javascript
describe("Accessibility", () => {
  // 1. Semantic HTML & ARIA Roles
  it("should have correct ARIA role", async () => {
    const el = await fixture(componentFixture);
    expect(el.getAttribute("role")).to.equal("expected-role");
  });

  // 2. Keyboard Navigation
  it("should be keyboard navigable", async () => {
    const el = await fixture(componentFixture);
    el.focus();
    expect(document.activeElement).to.equal(el);
  });

  // 3. Focus Indicators
  it("should have visible focus indicator", async () => {
    const el = await fixture(componentFixture);
    el.focus();
    const styles = window.getComputedStyle(el, ":focus-visible");
    expect(styles.outline).to.not.be.empty;
  });

  // 4. ARIA Labels
  it("should have accessible name", async () => {
    const el = await fixture(html`
      <ds-component aria-label="Accessible Name"></ds-component>
    `);
    expect(el.getAttribute("aria-label")).to.equal("Accessible Name");
  });

  // 5. Color Contrast (use axe-core)
  it("should have sufficient color contrast", async () => {
    const el = await fixture(componentFixture);
    const results = await axe.run(el);
    expect(results.violations).to.be.empty;
  });

  // 6. Screen Reader Support
  it("should announce state changes", async () => {
    const el = await fixture(componentFixture);
    el.disabled = true;
    await elementUpdated(el);
    expect(el.getAttribute("aria-disabled")).to.equal("true");
  });
});
```

### Keyboard Navigation Matrix

Document expected behavior:

| Key         | Action   | Expected Result                    |
| ----------- | -------- | ---------------------------------- |
| `Enter`     | Activate | Trigger action                     |
| `Space`     | Activate | Trigger action                     |
| `Tab`       | Navigate | Move to next focusable element     |
| `Shift+Tab` | Navigate | Move to previous focusable element |
| `Escape`    | Close    | Close menu/modal (if applicable)   |
| `↑ ↓ ← →`   | Navigate | Specific navigation (list/grid)    |
| `Home`      | Navigate | Go to first item (list/grid)       |
| `End`       | Navigate | Go to last item (list/grid)        |

---

## Component-Specific Guidelines

### Action Components (Button, FAB, Icon Button)

**Minimum Tests: 35**

```javascript
describe("Action Component", () => {
  describe("States", () => {
    // Default, Hover, Active, Focused, Disabled, Loading
  });

  describe("Variants", () => {
    // Filled, Outlined, Text, Tonal (if applicable)
  });

  describe("Sizes", () => {
    // Small, Medium, Large (if applicable)
  });

  describe("With Icons", () => {
    // Icon + Label, Icon Only, Label Only
  });

  describe("Click Handling", () => {
    // Emit click, Handle double-click, Prevent default
  });
});
```

### Selection Components (Checkbox, Radio, Switch, Segmented Button)

**Minimum Tests: 40**

```javascript
describe("Selection Component", () => {
  describe("Selection", () => {
    // Select/Deselect, Toggle, Multiple selection
  });

  describe("Group Behavior", () => {
    // Radio groups, Multi-select groups
  });

  describe("Value Tracking", () => {
    // Get/Set value, Array values, Default values
  });

  describe("Validation", () => {
    // Required, Valid, Invalid states
  });

  describe("Change Events", () => {
    // Emit change, Detail accuracy, Event bubbling
  });
});
```

### Input Components (TextField, Select, Date Picker)

**Minimum Tests: 50**

```javascript
describe("Input Component", () => {
  describe("Value Management", () => {
    // Get/Set, Placeholder, Type
  });

  describe("Validation", () => {
    // Required, Pattern, Min/Max length
  });

  describe("States", () => {
    // Focus, Filled, Error, Success, Warning
  });

  describe("Input Events", () => {
    // Input, Change, Focus, Blur
  });

  describe("Helper Text", () => {
    // Display, Update, Error messages
  });
});
```

### Navigation Components (Tabs, Drawer, Breadcrumb)

**Minimum Tests: 45**

```javascript
describe("Navigation Component", () => {
  describe("Navigation", () => {
    // Select item, Change active, Keyboard navigation
  });

  describe("Keyboard Navigation", () => {
    // Arrow keys, Home/End, Tab order
  });

  describe("Active State", () => {
    // Set active, Reflect in ARIA, Visual indication
  });

  describe("Dynamic Updates", () => {
    // Add/Remove items, Disable items
  });

  describe("Events", () => {
    // Navigation event, Detail accuracy
  });
});
```

### Container Components (Card, Dialog, Sheet, List)

**Minimum Tests: 35**

```javascript
describe("Container Component", () => {
  describe("Content", () => {
    // Slot content, Multiple slots, Dynamic content
  });

  describe("Layout", () => {
    // Sizing, Spacing, Responsiveness
  });

  describe("Interactions", () => {
    // Click handling, Focus management
  });

  describe("States", () => {
    // Loading, Empty, Error states (if applicable)
  });

  describe("Integration", () => {
    // Nested content, External components
  });
});
```

---

## Tools & Setup

### Recommended Test Framework

**Web Components Testing Library + Mocha**

```javascript
// Installation
npm install --save-dev @open-wc/testing mocha chai
```

### Test Utilities

```javascript
import {
  fixture, // Create DOM element from HTML
  html, // HTML template tag
  expect, // Assertion library
  elementUpdated, // Wait for Web Component update
} from "@open-wc/testing";

// Example usage
const el = await fixture(html`<ds-button>Click</ds-button>`);
el.property = "value";
await elementUpdated(el);
expect(el.property).to.equal("value");
```

### Accessibility Testing

```javascript
// Installation
npm install --save-dev axe-core

// Usage
import { axe, toHaveNoViolations } from 'jasmine-axe'

it('should have no accessibility violations', async () => {
  const el = await fixture(componentFixture)
  const results = await axe.run(el)
  expect(results.violations).to.be.empty
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/button.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Quality Checklist

Before considering a component test suite complete:

### Test Coverage

- [ ] Unit tests for all public methods
- [ ] Event tests for all emitted events
- [ ] Attribute/property tests for all settable properties
- [ ] Keyboard navigation tests for all shortcuts
- [ ] ARIA tests for all accessibility features
- [ ] Edge case tests for common failure scenarios
- [ ] Integration tests with related components
- [ ] At least 85% code coverage

### Test Quality

- [ ] All test names follow "should [behavior] when [action]" pattern
- [ ] Tests are isolated (can run in any order)
- [ ] Tests use fixtures for complex HTML
- [ ] Tests use `elementUpdated()` where needed
- [ ] Tests have clear, single purpose
- [ ] Comments explain "why" not "what"
- [ ] No duplicate tests
- [ ] No hardcoded timeouts (use promises)

### Accessibility

- [ ] ARIA roles tested
- [ ] ARIA attributes tested
- [ ] Keyboard navigation tested
- [ ] Focus management tested
- [ ] Screen reader support tested (aria-labels)
- [ ] Tab order is correct
- [ ] Color contrast verified
- [ ] Used axe-core for accessibility checks

### Documentation

- [ ] Test file has header comment explaining purpose
- [ ] Complex tests have inline comments
- [ ] README.md includes testing approach
- [ ] Contributing guide mentions test requirements
- [ ] Fixtures are well-organized

### Performance

- [ ] Test suite completes in <5 seconds
- [ ] No console warnings or errors
- [ ] No memory leaks
- [ ] No flaky tests (consistent passes)
- [ ] Tests work in CI/CD environment

### Browser Compatibility

- [ ] Tests run in Chrome
- [ ] Tests run in Firefox
- [ ] Tests run in Safari
- [ ] Tests run in Edge
- [ ] Cross-browser behavior is consistent

---

## Maintenance & Updates

### When to Update Tests

Update tests when:

- ✅ Adding new features to components
- ✅ Changing component API
- ✅ Fixing bugs (add regression test)
- ✅ Updating accessibility requirements
- ✅ Browser support changes

Do NOT update tests when:

- ❌ Refactoring internal implementation (tests shouldn't change)
- ❌ Styling changes (test behavior, not CSS)
- ❌ Performance optimizations (unless API changes)

### Updating This Standard

When proposing updates to this testing standard:

1. **Discuss first** - Propose in team discussion
2. **Update examples** - Apply changes to at least 2 existing components
3. **Version bump** - Increment version at top of document
4. **Document changes** - Update changelog below

### Version History

- **1.0** (February 3, 2026) - Initial testing standard

### Changelog

_To be updated as standard evolves_

---

## Quick Reference

### Test Template

```javascript
import { fixture, html, expect, elementUpdated } from "@open-wc/testing";
import "../../src/components/{name}/{name}.js";

describe("ds-{name}", () => {
  it("should [expected behavior]", async () => {
    const el = await fixture(html`<ds-{name}></ds-{name}>`);
    // Arrange
    // Act
    el.property = value;
    await elementUpdated(el);
    // Assert
    expect(el.property).to.equal(value);
  });
});
```

### Coverage Targets

- **Unit Tests:** 60% of suite (40-60 tests)
- **Integration Tests:** 30% of suite (20-35 tests)
- **E2E Tests:** 10% of suite (5-15 tests)
- **Minimum Coverage:** 85% statements, 80% branches

### Accessibility Checklist

- [ ] ARIA roles ✅
- [ ] ARIA attributes ✅
- [ ] Keyboard navigation ✅
- [ ] Focus management ✅
- [ ] Screen reader support ✅

---

## Additional Resources

- [Web Components Testing Library Docs](https://github.com/open-wc/testing)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Material Design 3 Components](https://m3.material.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)

---

**Questions or suggestions?** Update this document or discuss with the team.
