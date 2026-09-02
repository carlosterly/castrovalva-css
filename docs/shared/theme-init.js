(() => {
  if (window.__dsThemeInitLoaded) {
    return;
  }
  window.__dsThemeInitLoaded = true;

  // Apply saved theme immediately to prevent flash
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Theme switcher button functionality (if buttons exist on page)
  const themeBtns = document.querySelectorAll(".theme-btn");
  if (themeBtns.length === 0) {
    return;
  }

  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme") || "light";
  updateActiveButton(currentTheme);

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      html.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      updateActiveButton(theme);
    });
  });

  function updateActiveButton(theme) {
    themeBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });
  }
})();
