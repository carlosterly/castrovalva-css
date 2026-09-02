# Data Table

Material Design 3 data table component for sorting, filtering, pagination, and row selection.

## Import

```javascript
import "../src/components/data-table/data-table.js";
```

## Basic Usage

```html
<ds-data-table
  data='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
  columns='[{"key":"name","label":"Name"},{"key":"age","label":"Age"}]'>
</ds-data-table>
```

## Attributes

| Attribute    | Type          | Default   | Description                            |
| ------------ | ------------- | --------- | -------------------------------------- |
| `data`       | string (JSON) | `[]`      | JSON array of row objects              |
| `columns`    | string (JSON) | `[]`      | JSON array of column definitions       |
| `sortable`   | boolean       | `true`    | Enables sortable headers               |
| `filterable` | boolean       | `true`    | Shows filter input                     |
| `paginated`  | boolean       | `true`    | Shows pagination footer                |
| `page-size`  | number        | `10`      | Rows shown per page                    |
| `selectable` | boolean       | `false`   | Enables row selection checkboxes       |
| `density`    | string        | `default` | `default`, `comfortable`, or `compact` |

## Properties

| Property       | Type          | Description                  |
| -------------- | ------------- | ---------------------------- |
| `data`         | Array         | Gets/sets row data           |
| `columns`      | Array         | Gets/sets column definitions |
| `selectedRows` | Array<number> | Selected row indices         |
| `sortable`     | boolean       | Sort toggle state            |
| `filterable`   | boolean       | Filter toggle state          |
| `paginated`    | boolean       | Pagination toggle state      |
| `pageSize`     | number        | Current page size            |
| `selectable`   | boolean       | Selection toggle state       |
| `density`      | string        | Current density              |

## Events

| Event                  | Detail                      | Description                   |
| ---------------------- | --------------------------- | ----------------------------- |
| `ds-data-table:sort`   | `{ column, direction }`     | Fired after sort changes      |
| `ds-data-table:filter` | `{ value }`                 | Fired after filter changes    |
| `ds-data-table:page`   | `{ page, pageSize }`        | Fired after page changes      |
| `ds-data-table:select` | `{ selectedRows, indices }` | Fired after selection changes |

## CSS Parts

- `container` - Outer container
- `toolbar` - Filter toolbar
- `table` - Table element
- `header` - Table head
- `body` - Table body
- `footer` - Pagination footer

## Sizing Defaults

The component maps internal control defaults to global size tokens:

- `--ds-data-table-filter-control-height: var(--ds-size-control-md)`
- `--ds-data-table-pagination-control-height: var(--ds-size-control-sm)`
- `--ds-data-table-hit-area-size: var(--ds-size-hit-area)`
- `--ds-data-table-icon-size: var(--ds-size-icon-md)`

No `size` attribute is added for this component; use `density` and CSS custom properties to tune layout.

## Methods

- `getTotalPages()` - Returns total pages based on current filtered data
- `getPageData()` - Returns the current page slice

## Accessibility

- Native `button` and `input` controls support keyboard interaction.
- Filter and pagination controls provide `aria-label` values.
- Semantic table structure is preserved with explicit `role="table"`.

## Demo

See `docs/components/data-table.html`.
