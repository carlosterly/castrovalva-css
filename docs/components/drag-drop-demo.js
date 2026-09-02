import { makeDraggable, makeDropZone } from "../../src/utils/drag-drop.js";

const basicTarget = document.querySelector("#basic-target");
const basicTargetHint = document.querySelector("#basic-target-hint");

if (basicTarget) {
  makeDropZone(basicTarget, {
    onDrop: ({ element }) => {
      basicTarget.appendChild(element);
      if (basicTargetHint) {
        basicTargetHint.hidden = true;
      }
    },
  });
}

const log = document.querySelector("#event-log");
const item = document.querySelector("#interactive-item");
const zone = document.querySelector("#interactive-zone");

if (log && item && zone) {
  const appendLog = (line) => {
    log.textContent += `\n${line}`;
  };

  makeDraggable(item, {
    onDragStart: () => appendLog("drag start"),
    onDragEnd: (data) => appendLog(`drag end (dropped=${data.dropped})`),
  });

  makeDropZone(zone, {
    onDragEnter: () => appendLog("drag enter zone"),
    onDragLeave: () => appendLog("drag leave zone"),
    onDrop: () => appendLog("drop"),
  });
}
