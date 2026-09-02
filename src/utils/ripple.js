/**
 * Material Design 3 Ripple Effect
 * Creates a ripple animation at the click position
 */

function createRipple(event) {
  const button = event.currentTarget;

  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add("ripple");

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Auto-initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("[data-ripple], .ripple-container")
    .forEach((element) => {
      element.addEventListener("click", createRipple);
    });
});

export { createRipple };
