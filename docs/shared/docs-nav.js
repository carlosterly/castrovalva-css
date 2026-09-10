/**
 * Shared documentation navigation shell.
 *
 * Every demo page under docs/components/ includes this with a single
 * <script src="../shared/docs-nav.js"></script> line (after theme-init.js).
 * It injects a fixed sidebar with a live filter and keyboard support, and
 * shifts the page content to make room. The component list below is the one
 * source of truth for the nav.
 *
 * Keyboard:
 *   /        focus the filter
 *   Esc      clear the filter (and close the drawer on mobile)
 *   ArrowUp / ArrowDown   move between visible links while focus is in the nav
 */
(() => {
  if (window.__docsNavLoaded) return;
  window.__docsNavLoaded = true;

  const GROUPS = [
    {
      name: "Foundations",
      items: [
        ["design-tokens", "Design Tokens"],
        ["state-layers", "State Layers"],
        ["motion-animation", "Motion & Animation"],
        ["elevation", "Elevation"],
      ],
    },
    {
      name: "Navigation & Structure",
      items: [
        ["app-bar-top", "Top App Bar"],
        ["app-bar-bottom", "Bottom App Bar"],
        ["navigation-bar", "Navigation Bar"],
        ["navigation-rail", "Navigation Rail"],
        ["navigation-drawer", "Navigation Drawer"],
        ["advanced-menu", "Advanced Menus"],
        ["tabs", "Tabs"],
        ["divider", "Divider"],
      ],
    },
    {
      name: "Inputs & Forms",
      items: [
        ["button", "Button"],
        ["button-group", "Button Group"],
        ["split-button", "Split Button"],
        ["text-field", "Text Field"],
        ["textarea", "Textarea"],
        ["checkbox", "Checkbox"],
        ["radio", "Radio"],
        ["switch", "Switch"],
        ["slider", "Slider"],
        ["chip", "Chip"],
        ["combobox", "Combobox"],
        ["date-picker", "Date Picker"],
        ["time-picker", "Time Picker"],
        ["form", "Form"],
        ["fab", "FAB"],
      ],
    },
    {
      name: "Lists & Data",
      items: [
        ["list", "List"],
        ["data-table", "Data Table"],
        ["virtual-scroll", "Virtual Scroll"],
      ],
    },
    {
      name: "Surfaces & Layout",
      items: [
        ["card", "Card"],
        ["carousel", "Carousel"],
      ],
    },
    {
      name: "Overlays & Dialogs",
      items: [
        ["dialog", "Dialog"],
        ["menu", "Menu"],
        ["bottom-sheet", "Bottom Sheet"],
        ["side-sheet", "Side Sheet"],
      ],
    },
    {
      name: "Feedback & Status",
      items: [
        ["badge", "Badge"],
        ["tooltip", "Tooltip"],
        ["snackbar", "Snackbar"],
        ["banner", "Banner"],
        ["progress-indicator", "Progress Indicators"],
      ],
    },
    {
      name: "Media & Imagery",
      items: [
        ["icon", "Icon"],
        ["responsive-image", "Responsive Image"],
      ],
    },
    {
      name: "Search",
      items: [
        ["search", "Search"],
        ["search-view", "Search View"],
      ],
    },
    {
      name: "Utilities",
      items: [
        ["text-wrapper", "Text Wrapper"],
        ["scrollbar", "Scrollbar"],
        ["focus-ring", "Focus Ring"],
        ["drag-drop", "Drag & Drop"],
        ["animation-presets", "Animation Presets"],
      ],
    },
  ];

  const BREAKPOINT = 900;
  const currentSlug = (location.pathname.split("/").pop() || "").replace(
    /\.html$/,
    "",
  );

  // ---- styles -------------------------------------------------------------
  const style = document.createElement("style");
  style.textContent = `
    :root { --dnav-w: 264px; }
    body.dnav-on { }
    @media (min-width: ${BREAKPOINT}px) {
      body.dnav-on { padding-inline-start: var(--dnav-w); }
    }
    .dnav {
      position: fixed;
      inset-block: 0;
      inset-inline-start: 0;
      inline-size: var(--dnav-w);
      display: flex;
      flex-direction: column;
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      border-inline-end: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
      z-index: 900;
      transition: transform .22s ease;
    }
    .dnav__head {
      padding: 16px;
      border-block-end: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
    }
    .dnav__home {
      font: 600 1rem/1.3 "Roboto", sans-serif;
      color: var(--md-sys-color-primary, #6750a4);
      text-decoration: none;
      display: block;
    }
    .dnav__filter {
      inline-size: 100%;
      margin-block-start: 12px;
      padding: 8px 12px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: 8px;
      background: var(--md-sys-color-surface, #fffbfe);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 0.875rem;
    }
    .dnav__filter:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 1px;
    }
    .dnav__scroll { overflow-y: auto; padding: 8px 0 24px; flex: 1; }
    .dnav__group {
      padding: 14px 16px 4px;
      font: 500 0.6875rem/1 "Roboto", sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
    .dnav__link {
      display: block;
      padding: 8px 16px;
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface, #1d1b20);
      text-decoration: none;
    }
    .dnav__link:hover {
      background: var(--md-sys-color-surface-container-high, #ece6f0);
    }
    .dnav__link:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: -2px;
    }
    .dnav__link[aria-current="page"] {
      background: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
      font-weight: 600;
    }
    .dnav__link--content::after {
      content: "in page";
      float: inline-end;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.6;
      margin-block-start: 3px;
    }
    .dnav__empty {
      padding: 16px;
      font-size: 0.8125rem;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
    .dnav__toggle {
      position: fixed;
      inset-block-start: 12px;
      inset-inline-start: 12px;
      z-index: 901;
      inline-size: 44px;
      block-size: 44px;
      border: 1px solid var(--md-sys-color-outline-variant, #c9c5ca);
      border-radius: 12px;
      background: var(--md-sys-color-surface-container, #f3edf7);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 22px;
      cursor: pointer;
      display: none;
    }
    .dnav__backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.4);
      z-index: 899;
      opacity: 0;
      pointer-events: none;
      transition: opacity .22s ease;
    }
    @media (max-width: ${BREAKPOINT - 1}px) {
      .dnav { transform: translateX(-100%); box-shadow: 0 0 24px rgba(0,0,0,.25); }
      .dnav.is-open { transform: none; }
      .dnav__toggle { display: flex; align-items: center; justify-content: center; }
      .dnav.is-open ~ .dnav__toggle { display: none; }
      .dnav.is-open ~ .dnav__backdrop { opacity: 1; pointer-events: auto; }
      /* Clear the 44px toggle at inset-block-start:12px, plus breathing room
         so the hamburger never crowds the page <h1>. */
      body.dnav-on .content-area,
      body.dnav-on .page-container > .content-area { padding-block-start: 72px; }
    }
  `;
  document.head.appendChild(style);

  // ---- markup ------------------------------------------------------------
  const home = "../../index.html";
  const nav = document.createElement("nav");
  nav.className = "dnav";
  nav.setAttribute("aria-label", "Components");
  nav.innerHTML = `
    <div class="dnav__head">
      <a class="dnav__home" href="${home}">Castrovalva Design System</a>
      <input class="dnav__filter" type="search" placeholder="Filter components  ( / )"
             aria-label="Filter components" autocomplete="off" />
    </div>
    <div class="dnav__scroll">
      ${GROUPS.map(
        (g) => `
        <div class="dnav__grouprow" data-group="${g.name}">
          <div class="dnav__group">${g.name}</div>
          ${g.items
            .map(
              ([slug, label]) =>
                `<a class="dnav__link" href="${slug}.html" data-slug="${slug}"${
                  slug === currentSlug ? ' aria-current="page"' : ""
                }>${label}</a>`,
            )
            .join("")}
        </div>`,
      ).join("")}
      <div class="dnav__empty" hidden>No components match.</div>
    </div>`;

  const toggle = document.createElement("button");
  toggle.className = "dnav__toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Open navigation");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';

  const backdrop = document.createElement("div");
  backdrop.className = "dnav__backdrop";

  document.body.prepend(nav, toggle, backdrop);
  document.body.classList.add("dnav-on");

  // ---- behaviour -------------------------------------------------------
  const filter = nav.querySelector(".dnav__filter");
  const links = [...nav.querySelectorAll(".dnav__link")];
  const groups = [...nav.querySelectorAll(".dnav__grouprow")];
  const empty = nav.querySelector(".dnav__empty");

  // Content search: slug -> lowercased "heading heading api-name …" string.
  // Lets the filter match page content (variants, states, attribute names),
  // not just component titles. Degrades to title-only if the fetch fails.
  const contentIndex = new Map();
  fetch("../search-index.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((rows) => {
      for (const row of rows) {
        contentIndex.set(row.slug, (row.keywords || []).join(" ").toLowerCase());
      }
      if (filter.value) applyFilter(filter.value);
    })
    .catch(() => {});

  function applyFilter(q) {
    const term = q.trim().toLowerCase();
    let anyVisible = false;
    for (const g of groups) {
      let groupVisible = false;
      for (const a of g.querySelectorAll(".dnav__link")) {
        const inTitle = a.dataset.title.includes(term);
        const inContent =
          !inTitle && (contentIndex.get(a.dataset.slug) || "").includes(term);
        const match = !term || inTitle || inContent;
        a.hidden = !match;
        a.classList.toggle("dnav__link--content", !!term && inContent);
        if (match) groupVisible = anyVisible = true;
      }
      g.hidden = !groupVisible;
    }
    empty.hidden = anyVisible;
  }

  links.forEach((a) => (a.dataset.title = a.textContent.toLowerCase()));
  filter.addEventListener("input", () => applyFilter(filter.value));

  function openDrawer() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () =>
    nav.classList.contains("is-open") ? closeDrawer() : openDrawer(),
  );
  backdrop.addEventListener("click", closeDrawer);
  links.forEach((a) => a.addEventListener("click", closeDrawer));

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== filter) {
      e.preventDefault();
      filter.focus();
      filter.select();
    } else if (e.key === "Escape") {
      if (filter.value) {
        filter.value = "";
        applyFilter("");
      }
      closeDrawer();
    } else if (
      (e.key === "ArrowDown" || e.key === "ArrowUp") &&
      nav.contains(document.activeElement)
    ) {
      e.preventDefault();
      const visible = links.filter((a) => !a.hidden && a.offsetParent !== null);
      const i = visible.indexOf(document.activeElement);
      const next =
        e.key === "ArrowDown"
          ? visible[Math.min(i + 1, visible.length - 1)] || visible[0]
          : visible[Math.max(i - 1, 0)] ||
            visible[visible.length - 1];
      next && next.focus();
    }
  });

  // keep the active link in view
  const active = nav.querySelector('.dnav__link[aria-current="page"]');
  if (active) active.scrollIntoView({ block: "center" });
})();
