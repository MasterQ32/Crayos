let canvas;
let paletteElem;

// CONSTANTS
const width = 1920;
const height = 1080;
const lineWidth = 20;
const distanceThreshold = 5; // minimum distance between points to add a new point
const eraserRadius = 40;

let selectedTool = "pencil";

const palette = [
  "#FFF",
  "#e42932", // red
  "#ff8652", // orange
  "#552cb7", // purple
  "#00995e", // green**
  "#058cd7", // blue
  "#fff243", // yellow
  "#000",
];
let selectedColor = 7;

const paths = [];
let mx = -100;
let my = -100;

const backgroundUrls = ["img/graveyard.png"];
const backgrounds = [];

function loadBackgrounds() {
  for (let i = 0; i < backgroundUrls.length; i++) {
    const img = new Image();
    img.src = backgroundUrls[i];
    img.onload = () => {
      drawCanvas();
    };
    backgrounds.push(img);
  }
}

function initPainter() {
  document.getElementById("painter").style.display = "block";
  canvas = document.getElementById("canvas");

  loadBackgrounds();

  canvas.onmousedown = (e) => {
    mx = e.offsetX;
    my = e.offsetY;
    const point = { x: mx, y: my };
    if (selectedTool == "pencil") {
      pencilBeginPath(point);
    } else if (selectedTool == "eraser") {
      eraserDeleteAt(point);
    }
    drawCanvas();
  };
  canvas.onmousemove = (e) => {
    mx = e.offsetX;
    my = e.offsetY;
    if (e.buttons & 1) {
      const point = { x: mx, y: my };
      if (selectedTool == "pencil") {
        pencilContinuePath(point);
      } else if (selectedTool == "eraser") {
        eraserDeleteAt(point);
      }
    }
    drawCanvas();
  };
  canvas.onmouseup = (e) => {
    // TODO: send paths to server
    console.log(JSON.stringify(paths));
  };
  canvas.onmouseenter = (e) => {
    if (e.buttons & 1) {
      mx = e.offsetX;
      my = e.offsetY;
      const point = { x: mx, y: my };
      if (selectedTool == "pencil") {
        pencilBeginPath(point);
      } else if (selectedTool == "eraser") {
        eraserDeleteAt(point);
      }
    }
  };
  canvas.onmouseleave = (e) => {
    mx = -100;
    my = -100;
    drawCanvas();
  };

  const resize = (event) => {
    const wrapper = document.getElementById("wrapper");
    const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
    wrapper.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  };
  resize();
  window.addEventListener("resize", resize);

  initPalette();
  selectTool("pencil");
  paths.splice(0, paths.length);
}

function drawCanvas() {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(backgrounds[0], 0, 0, canvas.width, canvas.height);

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    ctx.beginPath();
    if (path.points.length == 1 && !path.points[0].erased) {
      ctx.arc(path.points[0].x, path.points[0].y, lineWidth / 2, 0, 2 * Math.PI);
      ctx.fillStyle = path.color;
      ctx.fill();
    } else {
      let moved = false;
      for (let j = 0; j < path.points.length; j++) {
        if (path.points[j].erased) {
          moved = false;
          continue;
        }
        if (!moved) {
          ctx.moveTo(path.points[j].x, path.points[j].y);
          moved = true;
        } else {
          ctx.lineTo(path.points[j].x, path.points[j].y);
        }
      }
      ctx.strokeStyle = path.color;
      ctx.stroke();
    }
  }

  // preview tool
  if (selectedTool == "pencil") {
    ctx.fillStyle = palette[selectedColor];
    ctx.beginPath();
    ctx.arc(mx, my, lineWidth / 2, 0, 2 * Math.PI);
    ctx.fill();
  } else if (selectedTool == "eraser") {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mx, my, eraserRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

// TOOLS

function selectTool(tool) {
  selectedTool = tool;
  if (tool == "pencil") {
    document.getElementById("pencil").classList.add("selected");
    document.getElementById("eraser").classList.remove("selected");
  } else if (tool == "eraser") {
    document.getElementById("eraser").classList.add("selected");
    document.getElementById("pencil").classList.remove("selected");
  }
}

function pencilBeginPath(point) {
  paths.push({ color: palette[selectedColor], points: [point] });
}

function pencilContinuePath(point) {
  const currentPath = paths[paths.length - 1];
  const lastPoint = currentPath.points[currentPath.points.length - 1];
  if (distanceSquared(lastPoint, point) > distanceThreshold * distanceThreshold) {
    currentPath.points.push(point);
  }
}

function eraserDeleteAt(point) {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    for (let j = 0; j < path.points.length; j++) {
      const p = path.points[j];
      if (distanceSquared(p, point) < eraserRadius * eraserRadius) {
        p.erased = true;
      }
    }
  }
}

// PALETTE

const colorw = 122;
const colorh = 80;

const makeColorRect = (i) => {
  return {
    x: 2 + (i % 2) * (colorw + 16),
    y: 2 + Math.floor(i / 2) * (colorh + 12),
    w: colorw,
    h: colorh,
  };
};

function initPalette() {
  paletteElem = document.getElementById("palette");

  paletteElem.onclick = (e) => {
    for (let i = 0; i < palette.length; i++) {
      const rect = makeColorRect(i);
      if (e.offsetX >= rect.x && e.offsetY >= rect.y && e.offsetX <= rect.x + rect.w && e.offsetY <= rect.y + rect.h) {
        selectedColor = i;
        drawPalette();
        break;
      }
    }
  };

  drawPalette();
}

function drawPalette() {
  pctx = paletteElem.getContext("2d");
  pctx.clearRect(0, 0, paletteElem.width, paletteElem.height);
  for (let i = 0; i < palette.length; i++) {
    pctx.beginPath();
    const rect = makeColorRect(i);
    pctx.rect(rect.x, rect.y, rect.w, rect.h);
    pctx.fillStyle = palette[i];
    pctx.fill();
    if (i == selectedColor) {
      pctx.strokeStyle = "#000";
      pctx.lineWidth = 4;
      pctx.stroke();
    }
  }
}

function distanceSquared(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}
