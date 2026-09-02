# Search View (ds-search-view)

A Material Design 3 full-screen search experience component with filtering, suggestions, and recent searches.

## Overview

The Search View component provides an immersive, full-screen search interface following Material Design 3 patterns. It includes support for filtering, search suggestions, recent search history, and keyboard navigation.

**Data flow:** The component owns the search UI (input, suggestions, filters, recent searches) and emits events. It does not render results; you handle `ds-search-view:search` to display your own results list or route to a results page.

## Features

- **Full-Screen Interface**: Immersive search experience that overlays the entire viewport
- **Search Suggestions**: Display autocomplete suggestions as the user types
- **Recent Searches**: Persist and display user's recent searches
- **Filter Support**: Apply multiple filters to narrow search results
- **Keyboard Navigation**: Full keyboard support (arrow keys, Enter, Escape)
- **Local Storage**: Automatically saves recent searches to browser storage
- **MD3 Styling**: Complete Material Design 3 color and typography integration
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **CSS Parts**: Customizable via `::part()` pseudo-elements
- **Events**: Comprehensive event system for search actions

## Installation

```html
<script type="module" src="src/components/search-view/search-view.js"></script>
```

## Basic Usage

```html
<!-- Closed by default -->
<ds-search-view id="search"></ds-search-view>

<script>
  const search = document.querySelector("#search");

  // Open the search view
  search.open = true;

  // Set suggestions
  search.suggestions = ["apple", "apricot", "avocado"];

  // Set filters
  search.filters = ["Images", "Videos", "News"];

  // Listen for searches
  search.addEventListener("ds-search-view:search", (e) => {
    const { query, filters } = e.detail;
    console.log(`Searching for "${query}" with filters:`, filters);
  });
</script>
```

## Attributes

### `open`

Opens or closes the search view. When open, the component displays as a full-screen overlay.

```html
<ds-search-view open></ds-search-view>
```

### `value`

The current search input value.

```html
<ds-search-view value="initial search"></ds-search-view>
```

## Properties

All attributes are available as properties:

```javascript
const search = document.querySelector("ds-search-view");

// Get properties
console.log(search.open); // boolean
console.log(search.value); // string
console.log(search.suggestions); // array
console.log(search.filters); // array
console.log(search.recentSearches); // array

// Set properties
search.open = true;
search.value = "search term";
search.suggestions = ["apple", "banana"];
search.filters = ["Images", "Videos"];
search.recentSearches = ["previous search 1", "previous search 2"];
```

## Methods

### `performSearch(query)`

Execute a search with the given query term. Adds the query to recent searches and emits a search event.

```javascript
const search = document.querySelector("ds-search-view");
search.performSearch("user query");
```

### `close()`

Close the search view overlay.

```javascript
const search = document.querySelector("ds-search-view");
search.close();
```

### `clearRecentSearches()`

Clear all stored recent searches from localStorage.

```javascript
const search = document.querySelector("ds-search-view");
search.clearRecentSearches();
```

### `toggleFilter(filter)`

Toggle a filter on or off.

```javascript
const search = document.querySelector("ds-search-view");
search.toggleFilter("Images");
```

### `getAppliedFilters()`

Get array of currently applied filters.

```javascript
const search = document.querySelector("ds-search-view");
const applied = search.getAppliedFilters();
console.log(applied); // ["Images", "Videos"]
```

### `getFilteredSuggestions()`

Get suggestions filtered by current search value.

```javascript
const search = document.querySelector("ds-search-view");
const filtered = search.getFilteredSuggestions();
```

## Events

### `ds-search-view:search`

Fired when a search is performed (Enter key or suggestion clicked).

```javascript
search.addEventListener("ds-search-view:search", (e) => {
  const { query, filters } = e.detail;
  console.log("Query:", query);
  console.log("Filters:", filters);
});
```

### `ds-search-view:input`

Fired when the search input value changes.

```javascript
search.addEventListener("ds-search-view:input", (e) => {
  const { value } = e.detail;
  console.log("Input value:", value);
});
```

## CSS Parts

Customize component styling using CSS parts:

```css
/* Style the search input */
ds-search-view::part(input) {
  font-size: 18px;
  font-weight: 500;
}

/* Style filter chips */
ds-search-view::part(filter) {
  border-radius: 24px;
  padding: 10px 16px;
}

/* Style suggestion items */
ds-search-view::part(suggestion) {
  padding: 16px;
  margin-block-end: 4px;
}
```

## Examples

### Basic Search with Suggestions

```html
<ds-search-view id="search" open></ds-search-view>

<script>
  const search = document.querySelector("#search");

  // Provide suggestions
  search.suggestions = [
    "javascript tutorial",
    "javascript array methods",
    "javascript event handling",
    "javascript async await",
  ];

  search.addEventListener("ds-search-view:search", (e) => {
    const { query } = e.detail;
    // Perform your search logic
    console.log("Searching for:", query);
  });
</script>
```

### Search with Filters

```html
<ds-search-view id="search" open></ds-search-view>

<script>
  const search = document.querySelector("#search");

  search.filters = ["Images", "Videos", "News", "Shopping"];

  search.addEventListener("ds-search-view:search", (e) => {
    const { query, filters } = e.detail;
    console.log(`${query} in ${filters.join(", ")}`);
  });
</script>
```

### Integration with Search Button

```html
<button id="search-btn" aria-label="Open search">
  <span class="material-symbols-outlined">search</span>
</button>

<ds-search-view id="search"></ds-search-view>

<script>
  const btn = document.querySelector("#search-btn");
  const search = document.querySelector("#search");

  btn.addEventListener("click", () => {
    search.open = true;
  });

  search.addEventListener("ds-search-view:search", (e) => {
    const { query } = e.detail;
    // Navigate to results page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  });
</script>
```

### Custom Styling with CSS Parts

```html
<style>
  ds-search-view::part(input) {
    font-size: 18px;
    font-weight: 500;
    background: var(--custom-input-bg);
  }

  ds-search-view::part(filter) {
    background: var(--custom-filter-bg);
    border: 2px solid var(--custom-filter-border);
  }

  ds-search-view::part(suggestion) {
    border-radius: 8px;
    background: var(--custom-suggestion-bg);
  }
</style>

<ds-search-view id="search" open></ds-search-view>
```

## Recent Searches

Recent searches are automatically saved to localStorage under the key `ds-search-view-recent`.

```javascript
const search = document.querySelector("ds-search-view");

// Recent searches are automatically populated from storage
console.log(search.recentSearches);

// Clear all recent searches
search.clearRecentSearches();
```

## Keyboard Navigation

- **Escape**: Close the search view
- **Enter**: Submit the search
- **Arrow Down**: Navigate to next suggestion
- **Arrow Up**: Navigate to previous suggestion

## Accessibility

The component provides full keyboard navigation and screen reader support:

- All interactive elements have `aria-label` attributes
- Keyboard shortcuts follow MD3 patterns
- High contrast focus indicators
- Proper semantic HTML structure
- WCAG 2.1 AA compliant

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Full support with touch gestures

## Design Tokens Used

- `--md-sys-color-surface`
- `--md-sys-color-on-surface`
- `--md-sys-color-on-surface-variant`
- `--md-sys-color-outline-variant`
- `--md-sys-color-primary`
- `--md-sys-color-primary-container`
- `--md-sys-color-on-primary-container`

## Related Components

- **Search**: Inline search input component
- **Combobox**: Dropdown select with search
- **List**: Display search results
- **Scrollbar**: Scrollable results area

## Tips & Best Practices

1. **Provide Suggestions**: Load suggestions from API for better UX
2. **Handle Empty States**: Show helpful message when no results found
3. **Debounce Input**: Debounce suggestion API calls on rapid typing
4. **Recent Searches**: Let users click recent searches for quick re-search
5. **Keyboard Support**: Ensure all actions work with keyboard
6. **Mobile Friendly**: Test full-screen behavior on mobile devices
7. **Loading States**: Show loading indicator while fetching suggestions
8. **Accessibility**: Always include proper ARIA labels and descriptions
