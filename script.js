const root = document.documentElement;

let interval,
  coordinate = "0101",
  bait,
  length = 1,
  speed = 500;
let stateRows,
  stateColumns,
  r = 1,
  c = 0,
  rd = 0,
  cd = 1;
const tails = [];
const inputRowsValue = document.querySelector(".inputRowsValue");
const inputColumnsValue = document.querySelector(".inputColumnsValue");
const inputSpeedValue = document.querySelector(".inputSpeedValue");

document.querySelector(".inputRows").addEventListener("change", function () {
  inputRowsValue.textContent = this.value;
});

document.querySelector(".inputColumns").addEventListener("change", function () {
  inputColumnsValue.textContent = this.value;
});

document.querySelector(".inputSpeed").addEventListener("change", function () {
  inputSpeedValue.textContent = this.value;
});

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  makeDirection(e.keyCode);
});

function createCanvas(divID) {
  const rows = +document.querySelector(".inputRows").value;
  const columns = +document.querySelector(".inputColumns").value;
  const canvas = document.querySelector("#canvas");
  let x = 0,
    y = 0,
    touchStartX,
    touchStartY;
  // Touch event handlers
  canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Threshold to consider touch movement as an arrow key press
    const threshold = 50;

    if (Math.abs(dx) > threshold) {
      // Horizontal movement
      makeDirection(dx > 0 ? 39 : 37);
    } else if (Math.abs(dy) > threshold) {
      // Vertical movement
      makeDirection(0, dy > 0 ? 38 : 40);
    }
  });

  canvas.addEventListener("touchend", function (event) {
    event.preventDefault();
    // Reset touchStartX and touchStartY
    touchStartX = null;
    touchStartY = null;
  });

  root.style.setProperty("--grid-columns", columns);
  stateRows = rows;
  stateColumns = columns;

  for (let r = 1; r <= rows; r++) {
    const row = document.createElement("div");
    row.className = "row r" + r.toString().padStart(2, 0);
    for (let c = 1; c <= columns; c++) {
      const rc = (r - 1) * columns + c;
      const column = document.createElement("div");
      column.className =
        "column c" +
        c.toString().padStart(2, 0) +
        " rc" +
        rc.toString().padStart(5, 0) +
        " rc";
      row.append(column);
    }
    canvas.append(row);
  }
  dropBait();
}

function move() {
  r += rd;
  c += cd;
  c = c % stateColumns || stateColumns;
  r = r % stateRows || stateRows;
  coordinate = (r - 1) * stateColumns + c;
  if (coordinate === bait) {
    if (tails.length + 1 === stateRows * stateColumns) {
      alert("you win");
      stop();
      return;
    }
    dropBait();
    length++;
  }
  if (tails.find((t) => t === coordinate)) {
    alert("die");
    stop();
    return;
  }
  tails.unshift(coordinate);
  tails.length = length;
  document.querySelectorAll(".rc").forEach((rc) => rc.classList.remove("tail"));
  tails.forEach((t) => {
    const tail = document.querySelector(".rc" + t.toString().padStart(5, 0));
    tail.classList.add("tail");
  });
}

function dropBait() {
  if (bait) {
    document
      .querySelector(".rc" + bait.toString().padStart(5, 0))
      .classList.remove("bait");
  }
  const availableRC = new Set(
    [...Array(stateRows * stateColumns - 1)].map((_, i) => i + 2)
  );
  tails.forEach((t) => availableRC.delete(t));
  availableRC.delete(bait);
  const availableRCarr = Array.from(availableRC);
  const randomIndex = Math.floor(Math.random() * availableRCarr.length);
  bait = availableRCarr[randomIndex];
  document
    .querySelector(".rc" + bait.toString().padStart(5, 0))
    .classList.add("bait");
}

function makeDirection(keyCode) {
  switch (keyCode) {
    case 37:
      cd = -1;
      rd = 0;
      break;
    case 38:
      cd = 0;
      rd = -1;
      break;
    case 39:
      cd = 1;
      rd = 0;
      break;
    case 40:
      cd = 0;
      rd = 1;
      break;
  }
}
function start() {
  if (interval) return;
  if (!document.querySelector("#canvas")?.children.length) {
    createCanvas("#canvas");
  }
  interval = setInterval(
    move,
    1000 / +document.querySelector(".inputSpeed").value
  );
  console.log(inputSpeedValue);
}
function stop() {
  clearInterval(interval);
  interval = null;
}
function reset() {
  stop();
  document.querySelector("#canvas").textContent = "";
  (r = 1),
    (c = 0),
    (rd = 0),
    (cd = 1),
    (length = 1),
    (tails.length = 0),
    (bait = null);
  createCanvas("#canvas");

  // start();
}
