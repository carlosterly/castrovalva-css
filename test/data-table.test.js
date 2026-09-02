import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { DSDataTable } from "../src/components/data-table/data-table.js";

const waitForDom = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const sampleData = [
  { id: 1, name: "Alice", age: 30, city: "New York" },
  { id: 2, name: "Bob", age: 25, city: "Los Angeles" },
  { id: 3, name: "Charlie", age: 35, city: "Chicago" },
  { id: 4, name: "Diana", age: 28, city: "Houston" },
  { id: 5, name: "Eve", age: 32, city: "Phoenix" },
];

const sampleColumns = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "city", label: "City" },
];

const buildLargeData = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    age: 20 + index,
    city: `City ${index + 1}`,
  }));

describe("DSDataTable", () => {
  describe("Initialization", () => {
    it("renders as custom element with shadow root", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it("has expected default property values", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      expect(el.sortable).to.be.true;
      expect(el.filterable).to.be.true;
      expect(el.paginated).to.be.true;
      expect(el.pageSize).to.equal(10);
      expect(el.selectable).to.be.false;
      expect(el.density).to.equal("default");
    });

    it("declares expected observed attributes", async () => {
      await fixture(html`<ds-data-table></ds-data-table>`);
      expect(DSDataTable.observedAttributes).to.deep.equal([
        "data",
        "columns",
        "sortable",
        "filterable",
        "paginated",
        "page-size",
        "selectable",
        "density",
      ]);
    });

    it("renders semantic table structure", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      const table = el.shadowRoot.querySelector("table");
      const thead = el.shadowRoot.querySelector("thead");
      const tbody = el.shadowRoot.querySelector("tbody");

      expect(table).to.exist;
      expect(thead).to.exist;
      expect(tbody).to.exist;
    });

    it("handles disconnect without throwing", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      expect(() => el.remove()).to.not.throw();
      expect(el.isConnected).to.be.false;
    });
  });

  describe("Attributes & Properties", () => {
    it("parses data attribute JSON", async () => {
      const el = await fixture(html`
        <ds-data-table data='[{"name":"Alice"}]'></ds-data-table>
      `);

      expect(el.data).to.have.length(1);
      expect(el.data[0].name).to.equal("Alice");
    });

    it("parses columns attribute JSON", async () => {
      const el = await fixture(html`
        <ds-data-table
          columns='[{"key":"name","label":"Name"}]'></ds-data-table>
      `);

      expect(el.columns).to.have.length(1);
      expect(el.columns[0].key).to.equal("name");
    });

    it("falls back to empty data on invalid JSON", async () => {
      const el = await fixture(
        html`<ds-data-table data="not-json"></ds-data-table>`,
      );
      expect(el.data).to.deep.equal([]);
    });

    it("falls back to empty columns on invalid JSON", async () => {
      const el = await fixture(
        html`<ds-data-table columns="not-json"></ds-data-table>`,
      );
      expect(el.columns).to.deep.equal([]);
    });

    it("treats sortable='false' as disabled", async () => {
      const el = await fixture(
        html`<ds-data-table sortable="false"></ds-data-table>`,
      );
      expect(el.sortable).to.be.false;
    });

    it("treats filterable='false' as disabled", async () => {
      const el = await fixture(
        html`<ds-data-table filterable="false"></ds-data-table>`,
      );
      expect(el.filterable).to.be.false;
    });

    it("treats paginated='false' as disabled", async () => {
      const el = await fixture(
        html`<ds-data-table paginated="false"></ds-data-table>`,
      );
      expect(el.paginated).to.be.false;
    });

    it("reads page-size attribute", async () => {
      const el = await fixture(
        html`<ds-data-table page-size="25"></ds-data-table>`,
      );
      expect(el.pageSize).to.equal(25);
    });

    it("uses default page size when missing", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      expect(el.pageSize).to.equal(10);
    });

    it("exposes selectable as boolean by presence", async () => {
      const el = await fixture(
        html`<ds-data-table selectable></ds-data-table>`,
      );
      expect(el.selectable).to.be.true;
    });

    it("reads density attribute", async () => {
      const el = await fixture(
        html`<ds-data-table density="compact"></ds-data-table>`,
      );
      expect(el.density).to.equal("compact");
    });

    it("sets data via property and reflects attribute", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      el.data = sampleData;
      await waitForDom();

      expect(el.data).to.have.length(5);
      expect(el.getAttribute("data")).to.equal(JSON.stringify(sampleData));
    });

    it("sets columns via property and reflects attribute", async () => {
      const el = await fixture(html`<ds-data-table></ds-data-table>`);
      el.columns = sampleColumns;
      await waitForDom();

      expect(el.columns).to.have.length(3);
      expect(el.getAttribute("columns")).to.equal(
        JSON.stringify(sampleColumns),
      );
    });

    it("resets selectedRows when data property is set", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const firstCheckbox = el.shadowRoot.querySelector(
        'tbody input[type="checkbox"]',
      );
      firstCheckbox.checked = true;
      firstCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
      await waitForDom();
      expect(el.selectedRows.length).to.equal(1);

      el.data = sampleData.slice(0, 2);
      await waitForDom();
      expect(el.selectedRows).to.deep.equal([]);
    });
  });

  describe("Rendering & States", () => {
    it("renders table headers and rows from data and columns", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const headers = el.shadowRoot.querySelectorAll("th[data-column]");
      const rows = el.shadowRoot.querySelectorAll("tbody tr");

      expect(headers.length).to.equal(3);
      expect(rows.length).to.equal(5);
    });

    it("shows filter input when filterable", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          filterable>
        </ds-data-table>
      `);

      expect(el.shadowRoot.querySelector(".filter-input")).to.exist;
    });

    it("hides filter input when filterable is false", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          filterable="false">
        </ds-data-table>
      `);

      expect(el.shadowRoot.querySelector(".filter-input")).to.not.exist;
    });

    it("shows pagination when paginated", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          paginated>
        </ds-data-table>
      `);

      expect(el.shadowRoot.querySelector(".pagination")).to.exist;
    });

    it("hides pagination when paginated is false", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          paginated="false">
        </ds-data-table>
      `);

      expect(el.shadowRoot.querySelector(".pagination")).to.not.exist;
    });

    it("renders selection checkboxes when selectable", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const checkboxes = el.shadowRoot.querySelectorAll(
        'input[type="checkbox"]',
      );
      expect(checkboxes.length).to.be.greaterThan(1);
    });

    it("applies compact density class", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          density="compact">
        </ds-data-table>
      `);

      const container = el.shadowRoot.querySelector(".container");
      expect(container.classList.contains("compact")).to.be.true;
    });

    it("applies comfortable density class", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          density="comfortable">
        </ds-data-table>
      `);

      const container = el.shadowRoot.querySelector(".container");
      expect(container.classList.contains("comfortable")).to.be.true;
    });

    it("shows empty-state for no table data", async () => {
      const el = await fixture(html`
        <ds-data-table data="[]" columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const emptyState = el.shadowRoot.querySelector(".empty-state");
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include("No data available");
    });

    it("shows empty-state for unmatched filter results", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const input = el.shadowRoot.querySelector(".filter-input");
      input.value = "NoMatchValue";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await waitForDom();

      const emptyState = el.shadowRoot.querySelector(".empty-state");
      expect(emptyState).to.exist;
      expect(emptyState.textContent).to.include("No matching results found");
    });
  });

  describe("Events", () => {
    it("emits sort event with asc direction on first click", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const header = el.shadowRoot.querySelector('th[data-column="name"]');
      setTimeout(() => header.click());

      const event = await oneEvent(el, "ds-data-table:sort");
      expect(event.detail.column).to.equal("name");
      expect(event.detail.direction).to.equal("asc");
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it("emits sort event with desc direction on second click", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const header = el.shadowRoot.querySelector('th[data-column="name"]');
      header.click();
      setTimeout(() => header.click());

      const event = await oneEvent(el, "ds-data-table:sort");
      expect(event.detail.direction).to.equal("desc");
    });

    it("emits filter event with normalized lowercase value", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const filterInput = el.shadowRoot.querySelector(".filter-input");
      filterInput.value = "ALICE";
      setTimeout(() =>
        filterInput.dispatchEvent(new Event("input", { bubbles: true })),
      );

      const event = await oneEvent(el, "ds-data-table:filter");
      expect(event.detail.value).to.equal("alice");
    });

    it("emits filter event with empty value when clear button is used", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const filterInput = el.shadowRoot.querySelector(".filter-input");
      filterInput.value = "alice";
      filterInput.dispatchEvent(new Event("input", { bubbles: true }));
      await waitForDom();

      const clearButton = el.shadowRoot.querySelector(".filter-clear-btn");
      setTimeout(() => clearButton.click());

      const event = await oneEvent(el, "ds-data-table:filter");
      expect(event.detail.value).to.equal("");
      expect(filterInput.value).to.equal("");
    });

    it("emits page event when navigating to next page", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(buildLargeData(25))}"
          columns="${JSON.stringify(sampleColumns)}"
          page-size="10">
        </ds-data-table>
      `);

      const nextButton = el.shadowRoot.querySelector(
        'button[data-page="next"]',
      );
      setTimeout(() => nextButton.click());

      const event = await oneEvent(el, "ds-data-table:page");
      expect(event.detail.page).to.equal(2);
      expect(event.detail.pageSize).to.equal(10);
    });

    it("updates pagination info after page change", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(buildLargeData(25))}"
          columns="${JSON.stringify(sampleColumns)}"
          page-size="10">
        </ds-data-table>
      `);

      const nextButton = el.shadowRoot.querySelector(
        'button[data-page="next"]',
      );
      nextButton.click();
      await waitForDom();

      const paginationInfo = el.shadowRoot.querySelector(".pagination-info");
      expect(paginationInfo.textContent).to.include("11-20 of 25 items");
    });

    it("emits select event for a row checkbox", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const firstCheckbox = el.shadowRoot.querySelector(
        'tbody input[type="checkbox"]',
      );
      setTimeout(() => firstCheckbox.click());

      const event = await oneEvent(el, "ds-data-table:select");
      expect(event.detail.selectedRows.length).to.equal(1);
      expect(event.detail.indices.length).to.equal(1);
    });

    it("emits select event for select-all checkbox", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const selectAll = el.shadowRoot.querySelector(
        'thead input[type="checkbox"]',
      );
      setTimeout(() => selectAll.click());

      const event = await oneEvent(el, "ds-data-table:select");
      expect(event.detail.selectedRows.length).to.equal(5);
      expect(event.detail.indices).to.deep.equal([0, 1, 2, 3, 4]);
    });
  });

  describe("Keyboard Navigation", () => {
    it("keeps filter input keyboard focusable", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const filterInput = el.shadowRoot.querySelector(".filter-input");
      filterInput.focus();
      expect(el.shadowRoot.activeElement).to.equal(filterInput);
    });

    it("supports keyboard-style filter input updates", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const filterInput = el.shadowRoot.querySelector(".filter-input");
      filterInput.value = "bob";
      setTimeout(() =>
        filterInput.dispatchEvent(new InputEvent("input", { bubbles: true })),
      );

      const event = await oneEvent(el, "ds-data-table:filter");
      expect(event.detail.value).to.equal("bob");
    });

    it("keeps pagination controls keyboard focusable", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(buildLargeData(25))}"
          columns="${JSON.stringify(sampleColumns)}"
          page-size="10">
        </ds-data-table>
      `);

      const nextButton = el.shadowRoot.querySelector(
        'button[data-page="next"]',
      );
      nextButton.focus();
      expect(el.shadowRoot.activeElement).to.equal(nextButton);
      expect(nextButton.disabled).to.be.false;
    });

    it("supports checkbox change via keyboard-like interaction", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const rowCheckbox = el.shadowRoot.querySelector(
        'tbody input[type="checkbox"]',
      );
      rowCheckbox.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      rowCheckbox.checked = true;
      rowCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
      await waitForDom();

      expect(el.selectedRows).to.deep.equal([0]);
    });
  });

  describe("Accessibility", () => {
    it("sets table role", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const table = el.shadowRoot.querySelector("table");
      expect(table.getAttribute("role")).to.equal("table");
    });

    it("sets ARIA label on filter input", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const filterInput = el.shadowRoot.querySelector(".filter-input");
      expect(filterInput.getAttribute("aria-label")).to.equal("Filter table");
    });

    it("sets ARIA label on clear filter button", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}">
        </ds-data-table>
      `);

      const clearButton = el.shadowRoot.querySelector(".filter-clear-btn");
      expect(clearButton.getAttribute("aria-label")).to.equal("Clear filter");
    });

    it("sets ARIA labels on pagination buttons", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(buildLargeData(20))}"
          columns="${JSON.stringify(sampleColumns)}"
          page-size="10">
        </ds-data-table>
      `);

      expect(
        el.shadowRoot
          .querySelector('button[data-page="first"]')
          .getAttribute("aria-label"),
      ).to.equal("First page");
      expect(
        el.shadowRoot
          .querySelector('button[data-page="prev"]')
          .getAttribute("aria-label"),
      ).to.equal("Previous page");
      expect(
        el.shadowRoot
          .querySelector('button[data-page="next"]')
          .getAttribute("aria-label"),
      ).to.equal("Next page");
      expect(
        el.shadowRoot
          .querySelector('button[data-page="last"]')
          .getAttribute("aria-label"),
      ).to.equal("Last page");
    });

    it("sets ARIA labels on row and select-all checkboxes", async () => {
      const el = await fixture(html`
        <ds-data-table
          data="${JSON.stringify(sampleData)}"
          columns="${JSON.stringify(sampleColumns)}"
          selectable>
        </ds-data-table>
      `);

      const selectAll = el.shadowRoot.querySelector(
        'thead input[type="checkbox"]',
      );
      const firstRow = el.shadowRoot.querySelector(
        'tbody input[type="checkbox"]',
      );

      expect(selectAll.getAttribute("aria-label")).to.equal("Select all rows");
      expect(firstRow.getAttribute("aria-label")).to.equal("Select row 1");
    });
  });
});
