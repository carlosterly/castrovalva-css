/**
 * Material Design 3 Data Table Component
 *
 * A data table with sorting, filtering, pagination, and selection.
 *
 * @element ds-data-table
 *
 * @attr {string} data - JSON stringified array of data objects
 * @attr {string} columns - JSON stringified array of column definitions
 * @attr {boolean} sortable - Enable column sorting (default: true)
 * @attr {boolean} filterable - Enable filtering (default: true)
 * @attr {boolean} paginated - Enable pagination (default: true)
 * @attr {number} page-size - Items per page (default: 10)
 * @attr {boolean} selectable - Enable row selection (default: false)
 * @attr {string} density - Table density: 'default', 'comfortable', 'compact'
 *
 * @fires ds-data-table:sort - Fired when sort changes {column, direction}
 * @fires ds-data-table:filter - Fired when filter changes {value}
 * @fires ds-data-table:page - Fired when page changes {page, pageSize}
 * @fires ds-data-table:select - Fired when selection changes {selectedRows}
 *
 * @csspart container - The main container
 * @csspart toolbar - The toolbar area
 * @csspart table - The table element
 * @csspart header - Table header
 * @csspart body - Table body
 * @csspart footer - Table footer with pagination
 *
 * @example
 * <ds-data-table
 *   data='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
 *   columns='[{"key":"name","label":"Name"},{"key":"age","label":"Age"}]'>
 * </ds-data-table>
 */
export class DSDataTable extends HTMLElement {
  static get observedAttributes() {
    return [
      "data",
      "columns",
      "sortable",
      "filterable",
      "paginated",
      "page-size",
      "selectable",
      "density",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Internal state
    this._data = [];
    this._columns = [];
    this._filteredData = [];
    this._sortColumn = null;
    this._sortDirection = "asc";
    this._filterValue = "";
    this._currentPage = 1;
    this._selectedRows = new Set();

    // Bind handlers once
    this._boundHandlers = {
      headerClick: this.handleHeaderClick.bind(this),
      filterInput: this.handleFilterInput.bind(this),
      clearFilter: this.handleClearFilter.bind(this),
      pageChange: this.handlePageChange.bind(this),
      selectAll: this.handleSelectAll.bind(this),
      selectRow: this.handleSelectRow.bind(this),
    };
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // Cleanup handled by re-render
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case "data":
          try {
            this._data = JSON.parse(newValue || "[]");
            this._filteredData = [...this._data];
            this._currentPage = 1;
            this._selectedRows.clear();
          } catch (e) {
            console.error("Invalid data JSON:", e);
            this._data = [];
            this._filteredData = [];
          }
          break;
        case "columns":
          try {
            this._columns = JSON.parse(newValue || "[]");
          } catch (e) {
            console.error("Invalid columns JSON:", e);
            this._columns = [];
          }
          break;
      }
      this.render();
    }
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = Array.isArray(value) ? value : [];
    this._filteredData = [...this._data];
    this._currentPage = 1;
    this._selectedRows.clear();
    this.setAttribute("data", JSON.stringify(this._data));
  }

  get columns() {
    return this._columns;
  }

  set columns(value) {
    this._columns = Array.isArray(value) ? value : [];
    this.setAttribute("columns", JSON.stringify(this._columns));
  }

  get sortable() {
    return this.hasAttribute("sortable")
      ? this.getAttribute("sortable") !== "false"
      : true;
  }

  get filterable() {
    return this.hasAttribute("filterable")
      ? this.getAttribute("filterable") !== "false"
      : true;
  }

  get paginated() {
    return this.hasAttribute("paginated")
      ? this.getAttribute("paginated") !== "false"
      : true;
  }

  get pageSize() {
    return parseInt(this.getAttribute("page-size") || "10");
  }

  get selectable() {
    return this.hasAttribute("selectable");
  }

  get density() {
    return this.getAttribute("density") || "default";
  }

  get selectedRows() {
    return Array.from(this._selectedRows);
  }

  handleHeaderClick(e) {
    if (!this.sortable) return;

    const th = e.target.closest("th[data-sortable]");
    if (!th) return;

    const column = th.dataset.column;

    if (this._sortColumn === column) {
      this._sortDirection = this._sortDirection === "asc" ? "desc" : "asc";
    } else {
      this._sortColumn = column;
      this._sortDirection = "asc";
    }

    this.applySort();
    this._currentPage = 1;
    this.updateTableContent();

    this.dispatchEvent(
      new CustomEvent("ds-data-table:sort", {
        bubbles: true,
        composed: true,
        detail: { column: this._sortColumn, direction: this._sortDirection },
      }),
    );
  }

  handleFilterInput(e) {
    this._filterValue = e.target.value.toLowerCase();
    this._currentPage = 1;
    this.applyFilter();

    // Reapply sort if there's an active sort column
    if (this._sortColumn) {
      this.applySort();
    }

    // Update clear button visibility
    const clearBtn = this.shadowRoot.querySelector(".filter-clear-btn");
    if (clearBtn) {
      if (this._filterValue) {
        clearBtn.classList.add("visible");
      } else {
        clearBtn.classList.remove("visible");
      }
    }

    // Update table body and pagination
    this.updateTableContent();

    this.dispatchEvent(
      new CustomEvent("ds-data-table:filter", {
        bubbles: true,
        composed: true,
        detail: { value: this._filterValue },
      }),
    );
  }

  handleClearFilter(e) {
    e.stopPropagation();
    this._filterValue = "";
    this._currentPage = 1;
    this.applyFilter();

    // Reapply sort if there's an active sort column
    if (this._sortColumn) {
      this.applySort();
    }

    // Update filter input and button visibility
    const filterInput = this.shadowRoot.querySelector(".filter-input");
    if (filterInput) {
      filterInput.value = "";
      filterInput.focus();
    }

    const clearBtn = this.shadowRoot.querySelector(".filter-clear-btn");
    if (clearBtn) {
      clearBtn.classList.remove("visible");
    }

    this.updateTableContent();

    this.dispatchEvent(
      new CustomEvent("ds-data-table:filter", {
        bubbles: true,
        composed: true,
        detail: { value: this._filterValue },
      }),
    );
  }

  handlePageChange(e) {
    const button = e.target.closest("button[data-page]");
    if (!button) return;

    const action = button.dataset.page;
    const totalPages = this.getTotalPages();

    switch (action) {
      case "first":
        this._currentPage = 1;
        break;
      case "prev":
        this._currentPage = Math.max(1, this._currentPage - 1);
        break;
      case "next":
        this._currentPage = Math.min(totalPages, this._currentPage + 1);
        break;
      case "last":
        this._currentPage = totalPages;
        break;
    }

    this.updateTableContent();

    this.dispatchEvent(
      new CustomEvent("ds-data-table:page", {
        bubbles: true,
        composed: true,
        detail: { page: this._currentPage, pageSize: this.pageSize },
      }),
    );
  }

  handleSelectAll(e) {
    const checked = e.target.checked;
    const pageData = this.getPageData();

    if (checked) {
      pageData.forEach((_, index) => {
        const globalIndex = (this._currentPage - 1) * this.pageSize + index;
        this._selectedRows.add(globalIndex);
      });
    } else {
      pageData.forEach((_, index) => {
        const globalIndex = (this._currentPage - 1) * this.pageSize + index;
        this._selectedRows.delete(globalIndex);
      });
    }

    this.updateTableContent();
    this.emitSelectEvent();
  }

  handleSelectRow(e) {
    const checkbox = e.target;
    const row = checkbox.closest("tr");
    const rowIndex = parseInt(row.dataset.index);

    if (checkbox.checked) {
      this._selectedRows.add(rowIndex);
    } else {
      this._selectedRows.delete(rowIndex);
    }

    this.updateTableContent();
    this.emitSelectEvent();
  }

  emitSelectEvent() {
    const selectedData = this.selectedRows.map((index) => this._data[index]);

    this.dispatchEvent(
      new CustomEvent("ds-data-table:select", {
        bubbles: true,
        composed: true,
        detail: { selectedRows: selectedData, indices: this.selectedRows },
      }),
    );
  }

  applyFilter() {
    if (!this._filterValue) {
      this._filteredData = [...this._data];
      return;
    }

    this._filteredData = this._data.filter((row) => {
      return this._columns.some((col) => {
        const value = row[col.key];
        return (
          value && value.toString().toLowerCase().includes(this._filterValue)
        );
      });
    });
  }

  applySort() {
    if (!this._sortColumn) return;

    this._filteredData.sort((a, b) => {
      const aVal = a[this._sortColumn];
      const bVal = b[this._sortColumn];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return this._sortDirection === "asc" ? comparison : -comparison;
    });
  }

  getTotalPages() {
    if (!this.paginated) return 1;
    return Math.ceil(this._filteredData.length / this.pageSize);
  }

  getPageData() {
    if (!this.paginated) return this._filteredData;

    const start = (this._currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this._filteredData.slice(start, end);
  }

  render() {
    const densityClass =
      this.density === "compact"
        ? "compact"
        : this.density === "comfortable"
          ? "comfortable"
          : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--md-sys-typescale-font-family);
          background: var(--md-sys-color-surface);
          border-radius: var(--ds-radius-md, 12px);
          overflow: hidden;
          box-shadow: var(--md-sys-elevation-1);
          --ds-data-table-filter-control-height: var(--ds-size-control-md, 40px);
          --ds-data-table-pagination-control-height: var(--ds-size-control-sm, 32px);
          --ds-data-table-hit-area-size: var(--ds-size-hit-area, 40px);
          --ds-data-table-icon-size: var(--ds-size-icon-md, 18px);
        }

        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: auto;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: var(--ds-space-4, 16px);
          padding: var(--ds-space-4, 16px);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          flex-shrink: 0;
        }

        .filter-input-wrapper {
          flex: 1;
          min-width: 0;
          position: relative;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }

        .filter-input {
          flex: 1;
          width: 100%;
          padding: 8px 12px;
          padding-right: var(--ds-data-table-hit-area-size);
          min-height: var(--ds-data-table-filter-control-height);
          border: 1px solid var(--md-sys-color-outline);
          border-radius: var(--ds-radius-sm, 8px);
          background: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          font-family: inherit;
          font-size: var(--md-sys-typescale-body-medium-size);
          box-sizing: border-box;
        }

        .filter-input:focus {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
          border-color: var(--md-sys-color-primary);
        }

        .filter-clear-btn {
          position: absolute;
          right: 0;
          background: none;
          border: none;
          width: var(--ds-data-table-hit-area-size);
          height: var(--ds-data-table-hit-area-size);
          padding: 0;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          color: var(--md-sys-color-on-surface-variant);
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-data-table-icon-size);
          transition: color 0.2s, background-color 0.2s;
          border-radius: 50%;
        }

        .filter-clear-btn.visible {
          display: flex;
        }

        .filter-clear-btn:hover {
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface);
        }

        .filter-clear-btn:active {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        .filter-clear-icon {
          font-variation-settings: 'FILL' 1;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--md-sys-typescale-body-medium-size);
        }

        thead {
          background: var(--md-sys-color-surface-container);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        th {
          padding: 16px;
          text-align: left;
          font-weight: var(--md-sys-typescale-label-large-weight, 500);
          color: var(--md-sys-color-on-surface-variant);
          white-space: nowrap;
          user-select: none;
        }

        th[data-sortable] {
          cursor: pointer;
          position: relative;
          padding-right: 32px;
        }

        th[data-sortable]:hover {
          background: var(--md-sys-color-surface-container-high);
        }

        .sort-icon {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          /* Only the active column, or the one under the pointer, shows an
             arrow — a row of arrows on every column reads as noise. */
          opacity: 0;
          font-family: 'Material Symbols Outlined';
          font-size: var(--ds-data-table-icon-size);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        th[data-sortable]:hover .sort-icon {
          opacity: 0.5;
        }

        th[data-sorted="asc"] .sort-icon,
        th[data-sortable]:hover[data-sorted="asc"] .sort-icon {
          opacity: 1;
          transform: translateY(-50%) rotate(0deg);
        }

        th[data-sorted="desc"] .sort-icon,
        th[data-sortable]:hover[data-sorted="desc"] .sort-icon {
          opacity: 1;
          transform: translateY(-50%) rotate(180deg);
        }

        tbody tr {
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
          transition: background-color 0.15s;
        }

        tbody tr:hover {
          background: var(--md-sys-color-surface-container);
        }

        tbody tr.selected {
          background: var(--md-sys-color-primary-container);
        }

        td {
          padding: 16px;
          color: var(--md-sys-color-on-surface);
        }

        /* Density variants */
        .compact th,
        .compact td {
          padding: 8px;
        }

        .comfortable th,
        .comfortable td {
          padding: 12px;
        }

        /* Checkbox */
        input[type="checkbox"] {
          width: var(--ds-data-table-icon-size);
          height: var(--ds-data-table-icon-size);
          cursor: pointer;
          accent-color: var(--md-sys-color-primary);
        }

        .checkbox-cell {
          width: 48px;
          text-align: center;
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--ds-space-4, 16px);
          border-top: 1px solid var(--md-sys-color-outline-variant);
          font-size: var(--md-sys-typescale-body-small-size);
          color: var(--md-sys-color-on-surface-variant);
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: var(--ds-space-2, 8px);
        }

        .pagination button {
          padding: 8px 12px;
          min-height: var(--ds-data-table-pagination-control-height);
          border: 1px solid var(--md-sys-color-outline);
          border-radius: var(--ds-radius-sm, 8px);
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          font-family: inherit;
          font-size: var(--md-sys-typescale-label-medium-size);
          transition: all 0.15s;
        }

        .pagination button:hover:not(:disabled) {
          background: var(--md-sys-color-surface-container);
          border-color: var(--md-sys-color-outline);
        }

        .pagination button:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .empty-state {
          padding: var(--ds-space-8, 32px);
          text-align: center;
          color: var(--md-sys-color-on-surface-variant);
        }

        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          table {
            font-size: var(--md-sys-typescale-body-small-size);
          }

          th, td {
            padding: 8px;
          }

          .pagination {
            flex-direction: column;
            gap: var(--ds-space-3, 12px);
            align-items: center;
          }
        }
      </style>

      <div class="container ${densityClass}" part="container">
        ${this.filterable ? this.renderToolbar() : ""}
        
        <div class="table-wrapper">
          <table part="table" role="table">
            ${this.renderHeader()}
            ${this.renderBody()}
          </table>
        </div>

        ${this.paginated ? this.renderPagination() : ""}
      </div>
    `;

    this.attachDOMListeners();
  }

  updateTableContent() {
    // Update only table body and pagination without recreating the entire DOM
    const table = this.shadowRoot.querySelector("table");
    if (table) {
      const thead = table.querySelector("thead");
      const oldTbody = table.querySelector("tbody");

      // Update header sort indicators
      if (thead && this.sortable) {
        const sortableHeaders = thead.querySelectorAll("th[data-sortable]");
        sortableHeaders.forEach((th) => {
          const column = th.dataset.column;
          if (this._sortColumn === column) {
            th.setAttribute("data-sorted", this._sortDirection);
          } else {
            th.removeAttribute("data-sorted");
          }
        });
      }

      // Create new tbody - must use a table element to parse tbody correctly
      const tempTable = document.createElement("table");
      const bodyHTML = this.renderBody();
      tempTable.innerHTML = bodyHTML;
      const newTbody = tempTable.querySelector("tbody");

      if (oldTbody && newTbody) {
        table.replaceChild(newTbody, oldTbody);

        // Reattach row checkbox listeners
        if (this.selectable) {
          const rowCheckboxes = newTbody.querySelectorAll(
            'input[type="checkbox"]',
          );
          rowCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", this._boundHandlers.selectRow);
          });
        }
      }
    }

    // Update pagination
    if (this.paginated) {
      const oldPagination = this.shadowRoot.querySelector(".pagination");
      if (oldPagination) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = this.renderPagination();
        const newPagination = tempDiv.firstElementChild;

        if (newPagination) {
          oldPagination.replaceWith(newPagination);
          newPagination.addEventListener(
            "click",
            this._boundHandlers.pageChange,
          );
        }
      }
    }
  }

  renderToolbar() {
    return `
      <div class="toolbar" part="toolbar">
        <div class="filter-input-wrapper">
          <input
            type="text"
            class="filter-input"
            placeholder="Filter table..."
            value="${this._filterValue}"
            aria-label="Filter table"
          />
          <button
            class="filter-clear-btn ${this._filterValue ? "visible" : ""}"
            aria-label="Clear filter"
            title="Clear filter"
          >
            <span class="filter-clear-icon">close</span>
          </button>
        </div>
      </div>
    `;
  }

  renderHeader() {
    const selectAllChecked =
      this.selectable &&
      this.getPageData().every((_, index) => {
        const globalIndex = (this._currentPage - 1) * this.pageSize + index;
        return this._selectedRows.has(globalIndex);
      });

    return `
      <thead part="header">
        <tr>
          ${
            this.selectable
              ? `
            <th class="checkbox-cell">
              <input
                type="checkbox"
                ${selectAllChecked ? "checked" : ""}
                aria-label="Select all rows"
              />
            </th>
          `
              : ""
          }
          ${this._columns
            .map((col) => {
              const isSorted = this._sortColumn === col.key;
              const sortDir = isSorted ? this._sortDirection : "";
              return `
              <th
                ${
                  this.sortable && col.sortable !== false
                    ? `data-sortable data-column="${col.key}"`
                    : ""
                }
                ${isSorted ? `data-sorted="${sortDir}"` : ""}
              >
                ${col.label || col.key}
                ${
                  this.sortable && col.sortable !== false
                    ? "<span class=\"sort-icon\">arrow_upward</span>"
                    : ""
                }
              </th>
            `;
            })
            .join("")}
        </tr>
      </thead>
    `;
  }

  renderBody() {
    const pageData = this.getPageData();

    if (pageData.length === 0) {
      return `
        <tbody part="body">
          <tr>
            <td colspan="${
              this._columns.length + (this.selectable ? 1 : 0)
            }" class="empty-state">
              ${
                this._filterValue
                  ? "No matching results found"
                  : "No data available"
              }
            </td>
          </tr>
        </tbody>
      `;
    }

    const rows = pageData
      .map((row, index) => {
        const globalIndex = (this._currentPage - 1) * this.pageSize + index;
        const isSelected = this._selectedRows.has(globalIndex);

        return `
        <tr data-index="${globalIndex}" ${isSelected ? 'class="selected"' : ""}>
          ${
            this.selectable
              ? `
            <td class="checkbox-cell">
              <input
                type="checkbox"
                ${isSelected ? "checked" : ""}
                aria-label="Select row ${index + 1}"
              />
            </td>
          `
              : ""
          }
          ${this._columns
            .map((col) => {
              const value = row[col.key];
              const formatted = col.format ? col.format(value, row) : value;
              return `<td>${formatted ?? ""}</td>`;
            })
            .join("")}
        </tr>
      `;
      })
      .join("");

    return `
      <tbody part="body">
        ${rows}
      </tbody>
    `;
  }

  renderPagination() {
    const totalPages = this.getTotalPages();
    const start = (this._currentPage - 1) * this.pageSize + 1;
    const end = Math.min(
      this._currentPage * this.pageSize,
      this._filteredData.length,
    );
    const total = this._filteredData.length;

    return `
      <div class="pagination" part="footer">
        <div class="pagination-info">
          ${start}-${end} of ${total} items
        </div>
        <div class="pagination-controls">
          <button
            data-page="first"
            ${this._currentPage === 1 ? "disabled" : ""}
            aria-label="First page"
          >
            First
          </button>
          <button
            data-page="prev"
            ${this._currentPage === 1 ? "disabled" : ""}
            aria-label="Previous page"
          >
            Prev
          </button>
          <span>Page ${this._currentPage} of ${totalPages}</span>
          <button
            data-page="next"
            ${this._currentPage === totalPages ? "disabled" : ""}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            data-page="last"
            ${this._currentPage === totalPages ? "disabled" : ""}
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      </div>
    `;
  }

  attachDOMListeners() {
    const thead = this.shadowRoot.querySelector("thead");
    if (thead) {
      thead.addEventListener("click", this._boundHandlers.headerClick);
    }

    const filterInput = this.shadowRoot.querySelector(".filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", this._boundHandlers.filterInput);
    }

    const filterClearBtn = this.shadowRoot.querySelector(".filter-clear-btn");
    if (filterClearBtn) {
      filterClearBtn.addEventListener("click", this._boundHandlers.clearFilter);
    }

    const pagination = this.shadowRoot.querySelector(".pagination");
    if (pagination) {
      pagination.addEventListener("click", this._boundHandlers.pageChange);
    }

    if (this.selectable) {
      const selectAllCheckbox = this.shadowRoot.querySelector(
        "thead input[type='checkbox']",
      );
      if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener(
          "change",
          this._boundHandlers.selectAll,
        );
      }

      const rowCheckboxes = this.shadowRoot.querySelectorAll(
        "tbody input[type='checkbox']",
      );
      rowCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", this._boundHandlers.selectRow);
      });
    }
  }
}

customElements.define("ds-data-table", DSDataTable);

export default DSDataTable;
