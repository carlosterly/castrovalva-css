import {
  getElevation,
  applyElevation,
  applyElevationVar,
  removeElevation,
  getElementElevation,
  applyElevationWithTransition,
  ElevationManager,
} from '../../src/utils/elevation.js';

// Example 1: Apply elevation to boxes and show on click
document.querySelectorAll('.elevation-box').forEach((box) => {
  const level = Number.parseInt(box.dataset.level, 10);
  applyElevation(box, level);

  box.addEventListener('click', () => {
    const shadow = getElevation(level);
    document.getElementById('elevation-output').innerHTML =
      `<strong>Level ${level}:</strong><br>${shadow || 'none'}`;
  });
});

// Example 2: Hover card with elevation
const hoverCard = document.getElementById('hover-card');
const hoverLevel = document.getElementById('hover-level');
applyElevation(hoverCard, 0);

hoverCard.addEventListener('mouseenter', () => {
  applyElevationWithTransition(hoverCard, 0, 2, 200);
  hoverLevel.textContent = '2';
});

hoverCard.addEventListener('mouseleave', () => {
  applyElevationWithTransition(hoverCard, 2, 0, 200);
  hoverLevel.textContent = '0';
});

// Example 3: Elevation controller
const slider = document.getElementById('elevation-slider');
const sliderValue = document.getElementById('slider-value');
const controllerCard = document.getElementById('controller-card');
const controllerOutput = document.getElementById('controller-output');
const applyBtn = document.getElementById('apply-elevation-btn');
const applyVarBtn = document.getElementById('apply-var-btn');
const animateBtn = document.getElementById('animate-btn');
const removeBtn = document.getElementById('remove-btn');

applyElevation(controllerCard, 0);

slider.addEventListener('input', (e) => {
  sliderValue.textContent = e.target.value;
});

applyBtn.addEventListener('click', () => {
  const level = Number.parseInt(slider.value, 10);
  applyElevation(controllerCard, level);
  const shadow = getElevation(level);
  controllerOutput.innerHTML = `Applied Level ${level}:<br><code>${shadow}</code>`;
});

applyVarBtn.addEventListener('click', () => {
  const level = Number.parseInt(slider.value, 10);
  applyElevationVar(controllerCard, level);
  controllerOutput.innerHTML = `Applied Level ${level} via CSS variable:<br><code>var(--md-sys-elevation-level${level})</code>`;
});

animateBtn.addEventListener('click', () => {
  const fromLevel = getElementElevation(controllerCard) || 0;
  const toLevel = Number.parseInt(slider.value, 10);
  applyElevationWithTransition(controllerCard, fromLevel, toLevel, 300);
  controllerOutput.innerHTML = `Animating from Level ${fromLevel} to Level ${toLevel}`;
});

removeBtn.addEventListener('click', () => {
  removeElevation(controllerCard);
  controllerOutput.innerHTML = 'Elevation removed';
});

// Example 4: ElevationManager
const managerCard = document.getElementById('manager-card');
const managerLevel = document.getElementById('manager-level');
const managerHoverSlider = document.getElementById('manager-hover');
const managerHoverValue = document.getElementById('manager-hover-value');
const managerActiveSlider = document.getElementById('manager-active');
const managerActiveValue = document.getElementById('manager-active-value');
const updateManagerBtn = document.getElementById('update-manager-btn');

const manager = new ElevationManager(managerCard, {
  defaultLevel: 0,
  hoverLevel: 2,
  activeLevel: 3,
  focusLevel: 2,
  duration: 200,
});

const originalSetElevation = manager.setElevation.bind(manager);
manager.setElevation = function (level) {
  originalSetElevation(level);
  managerLevel.textContent = level;
};

managerHoverSlider.addEventListener('input', (e) => {
  managerHoverValue.textContent = e.target.value;
});

managerActiveSlider.addEventListener('input', (e) => {
  managerActiveValue.textContent = e.target.value;
});

updateManagerBtn.addEventListener('click', () => {
  manager.updateOptions({
    hoverLevel: Number.parseInt(managerHoverSlider.value, 10),
    activeLevel: Number.parseInt(managerActiveSlider.value, 10),
  });
});

