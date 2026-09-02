# Search Component

A search input with autocomplete suggestions, keyboard navigation, and filtering capabilities. Supports bar, view, and full-screen variants following Material Design 3 guidelines.

## Installation

```javascript
import { DSSearch } from "castrovalva";
```

## Basic Usage

```html
<ds-search placeholder="Search..."></ds-search>
```

## Variants

### Bar (Default)

Compact search bar for toolbars and headers.

```html
<ds-search variant="bar" placeholder="Search..."></ds-search>
```

### View

Search view with expanded results area, ideal for prominent search experiences.

```html
<ds-search variant="view" placeholder="Search items..."></ds-search>
```

### Full-Screen

Full-screen search overlay that covers the entire viewport.

```html
<ds-search variant="full-screen" placeholder="Search everything..."></ds-search>
```

## With Suggestions

Provide autocomplete suggestions that filter as the user types.

```html
<ds-search id="my-search" placeholder="Search fruits..."></ds-search>

<script>
  const search = document.getElementById("my-search");
  search.suggestions = [
    "Apple",
    "Banana",
    "Cherry",
    "Dragon Fruit",
    "Elderberry",
  ];
</script>
```

### Object Suggestions

Suggestions can be objects with `text` or `label` properties:

```javascript
search.suggestions = [
  { text: "Apple", id: 1, category: "Fruit" },
  { text: "Banana", id: 2, category: "Fruit" },
  { text: "Carrot", id: 3, category: "Vegetable" },
];
```

## Keyboard Navigation

The search component supports full keyboard navigation:

- **↓ (Arrow Down)** - Navigate to next suggestion
- **↑ (Arrow Up)** - Navigate to previous suggestion
- **Enter** - Select highlighted suggestion or submit search
- **Escape** - Close suggestions and blur input

```javascript
const search = document.querySelector("ds-search");

// Listen for Enter key submission
search.addEventListener("ds-search:submit", (event) => {
  console.log("Search submitted:", event.detail.value);
  performSearch(event.detail.value);
});
```

## Events

### Input Event

Fired whenever the input value changes.

```javascript
search.addEventListener("ds-search:input", (event) => {
  console.log("Input changed:", event.detail.value);
  // Optionally fetch suggestions from API
});
```

### Clear Event

Fired when the clear button is clicked.

```javascript
search.addEventListener("ds-search:clear", () => {
  console.log("Search cleared");
  // Reset your search results
});
```

### Submit Event

Fired when Enter is pressed without a selected suggestion.

```javascript
search.addEventListener("ds-search:submit", (event) => {
  console.log("Search submitted:", event.detail.value);
  // Perform search with the value
});
```

### Suggestion Select Event

Fired when a suggestion is selected (by click or Enter key).

```javascript
search.addEventListener("ds-search:suggestion-select", (event) => {
  console.log("Selected:", event.detail.suggestion);
  console.log("Index:", event.detail.index);
  // Navigate to the selected item or perform action
});
```

## Methods

### clear()

Clears the search input and suggestions.

```javascript
const search = document.querySelector("ds-search");
search.clear();
```

### filterSuggestions()

Manually trigger suggestion filtering based on current value.

```javascript
search.value = "app";
search.filterSuggestions();
```

### selectSuggestion(index)

Programmatically select a suggestion by index.

```javascript
search.selectSuggestion(0); // Select first suggestion
```

## Slots

### Leading Slot

Customize the leading icon (default is search icon).

```html
<ds-search>
  <svg slot="leading" width="24" height="24" viewBox="0 0 24 24">
    <!-- Custom icon -->
  </svg>
</ds-search>
```

### Trailing Slot

Add trailing actions like voice search or filters.

```html
<ds-search>
  <button slot="trailing" aria-label="Voice search">🎤</button>
</ds-search>
```

## CSS Custom Properties

Customize the search appearance:

```css
ds-search {
  --ds-search-height: 56px;
  --ds-search-background: var(--md-sys-color-surface-container-high);
}
```

## CSS Parts

Style specific parts using `::part()`:

```css
/* Style the input container */
ds-search::part(input-container) {
  border-radius: 16px;
  padding: 12px 20px;
}

/* Style the input */
ds-search::part(input) {
  font-size: 18px;
}

/* Style the suggestions dropdown */
ds-search::part(suggestions) {
  max-block-size: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

## API Reference

### Attributes

| Attribute     | Type    | Default  | Description                                     |
| ------------- | ------- | -------- | ----------------------------------------------- |
| `variant`     | String  | "bar"    | Search variant: "bar", "view", or "full-screen" |
| `placeholder` | String  | "Search" | Placeholder text                                |
| `value`       | String  | ""       | Current search value                            |
| `active`      | Boolean | false    | Whether search is active/expanded               |
| `disabled`    | Boolean | false    | Whether search is disabled                      |

### Properties (JavaScript)

```javascript
const search = document.querySelector("ds-search");

// Get/set variant
search.variant; // "bar" | "view" | "full-screen"
search.variant = "view";

// Get/set placeholder
search.placeholder; // string
search.placeholder = "Search products...";

// Get/set value
search.value; // string
search.value = "apple";

// Get/set suggestions
search.suggestions; // Array<string | Object>
search.suggestions = ["Apple", "Banana"];

// Get/set active state
search.active; // boolean
search.active = true;

// Get/set disabled state
search.disabled; // boolean
search.disabled = true;
```

## Accessibility

- Search container has `role="search"`
- Input has `role="combobox"` for autocomplete functionality
- `aria-autocomplete="list"` indicates suggestions available
- `aria-controls` associates input with suggestions list
- `aria-expanded` reflects suggestions dropdown visibility
- `aria-label` provides accessible name from placeholder
- Suggestions list has `role="listbox"`
- Each suggestion has `role="option"` and `aria-selected`
- Full keyboard navigation support
- Clear button has accessible label

## Examples

### Search with API

```javascript
const search = document.querySelector("ds-search");
let debounceTimer;

search.addEventListener("ds-search:input", (event) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const results = await fetchSearchResults(event.detail.value);
    search.suggestions = results;
  }, 300);
});
```

### Search with Categories

```javascript
const search = document.querySelector("ds-search");

search.suggestions = [
  { text: "Apple MacBook", category: "Laptops" },
  { text: "Apple AirPods", category: "Audio" },
  { text: "Samsung Galaxy", category: "Phones" },
];

search.addEventListener("ds-search:suggestion-select", (event) => {
  const { suggestion } = event.detail;
  console.log(`Selected ${suggestion.text} from ${suggestion.category}`);
  window.location.href = `/products/${suggestion.id}`;
});
```

### Full-Screen Search Modal

```javascript
function openSearch() {
  const search = document.createElement("ds-search");
  search.variant = "full-screen";
  search.placeholder = "What are you looking for?";
  search.suggestions = getAllProducts();
  document.body.appendChild(search);

  // Auto-focus
  setTimeout(() => {
    const input = search.shadowRoot.querySelector("input");
    input?.focus();
  }, 100);

  // Close on escape or submit
  search.addEventListener("ds-search:submit", () => {
    search.remove();
  });
}
```

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
