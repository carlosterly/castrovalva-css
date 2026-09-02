import {
  animate,
  animateWithClass,
  animateSequence,
  getEasing,
} from "../../src/utils/animation-presets.js";

const basicItem = document.querySelector("#basic-demo-item");
const basicButtons = document.querySelectorAll("[data-basic-preset]");

basicButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!basicItem) {
      return;
    }

    const preset = button.getAttribute("data-basic-preset");
    if (preset) {
      await animate(basicItem, preset, { duration: 300 });
    }
  });
});

const durationSlider = document.querySelector("#duration-slider");
const durationValue = document.querySelector("#duration-value");
const easingSelect = document.querySelector("#easing-select");
const configRun = document.querySelector("#config-run");
const configItem = document.querySelector("#config-demo-item");

if (durationSlider && durationValue) {
  durationSlider.addEventListener("input", () => {
    durationValue.textContent = durationSlider.value;
  });
}

if (durationSlider && easingSelect && configRun && configItem) {
  configRun.addEventListener("click", async () => {
    const duration = Number.parseInt(durationSlider.value, 10);
    const easingKey = easingSelect.value;
    const easing = getEasing(easingKey);

    await animate(configItem, "fadeIn", {
      duration,
      easing,
    });
  });
}

const variantItems = document.querySelectorAll("[data-variant-preset]");
variantItems.forEach((item) => {
  item.addEventListener("click", async () => {
    const preset = item.getAttribute("data-variant-preset");
    if (preset) {
      await animate(item, preset, { duration: 300 });
    }
  });
});

const stateItem = document.querySelector("#state-demo-item");
const stateStart = document.querySelector("#state-start");
const statePause = document.querySelector("#state-pause");
const stateResume = document.querySelector("#state-resume");
const stateStop = document.querySelector("#state-stop");
let stateController = null;

if (stateItem && stateStart && statePause && stateResume && stateStop) {
  stateStart.addEventListener("click", () => {
    if (stateController) {
      stateController.remove();
    }
    stateController = animateWithClass(stateItem, "pulse");
  });

  statePause.addEventListener("click", () => {
    stateController?.pause();
  });

  stateResume.addEventListener("click", () => {
    stateController?.resume();
  });

  stateStop.addEventListener("click", () => {
    stateController?.remove();
    stateController = null;
  });
}

const sequenceButton = document.querySelector("#run-sequence");
const clearLogButton = document.querySelector("#clear-log");
const sequenceItems = Array.from(
  document.querySelectorAll(".js-sequence-item"),
);
const eventLog = document.querySelector("#event-log");

const appendLog = (line) => {
  if (!eventLog) {
    return;
  }

  eventLog.textContent += `\n${line}`;
};

if (sequenceButton) {
  sequenceButton.addEventListener("click", async () => {
    if (sequenceItems.length === 0) {
      return;
    }

    appendLog("Running sequence...");
    await animateSequence(sequenceItems, "slideInUp", {
      staggerDelay: 75,
      duration: 220,
    });
    appendLog("Sequence complete");
  });
}

if (clearLogButton) {
  clearLogButton.addEventListener("click", () => {
    if (eventLog) {
      eventLog.textContent = "Event log:";
    }
  });
}
