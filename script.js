// Typing Effect
let text = ["Web Developer", "Creative Thinker", "Problem Solver"];
let i = 0, j = 0;
let currentText = "", isDeleting = false;

function type() {
  currentText = text[i];
  if (!isDeleting) {
    document.getElementById("typing").innerHTML = currentText.substring(0, j++);
  } else {
    document.getElementById("typing").innerHTML = currentText.substring(0, j--);
  }
  if (j == currentText.length) isDeleting = true;
  if (j == 0) { isDeleting = false; i = (i + 1) % text.length; }
  setTimeout(type, 100);
}
type();

// Scroll Progress Bar
window.onscroll = function () {
  let winScroll = document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
};

// Show Projects
function showProjects() {
  document.getElementById("projects").classList.remove("hidden");
}

// Network Animation
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const MAX_DIST = 140;
const NODE_COUNT = 60;
const ANIMATE_DURATION = 4000;

let nodes = [];
let animating = false;
let frozen = false;
let animStart = null;
let rafId = null;

function initCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createNodes() {
  nodes = Array.from({ length: NODE_COUNT }, () => {
    const tx = Math.random() * canvas.width;
    const ty = Math.random() * canvas.height;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 300 + 200;
    return {
      tx, ty,
      x: tx + Math.cos(angle) * dist,
      y: ty + Math.sin(angle) * dist,
      r: Math.random() * 2 + 1.5
    };
  });
}

function drawFrame(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const ease = 1 - Math.pow(1 - progress, 3);

  const positions = nodes.map(n => ({
    x: n.x + (n.tx - n.x) * ease,
    y: n.y + (n.ty - n.y) * ease,
    r: n.r
  }));

  for (let a = 0; a < positions.length; a++) {
    for (let b = a + 1; b < positions.length; b++) {
      const dx = positions[a].x - positions[b].x;
      const dy = positions[a].y - positions[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.45 * progress;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,204,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(positions[a].x, positions[a].y);
        ctx.lineTo(positions[b].x, positions[b].y);
        ctx.stroke();
      }
    }
  }

  for (let p of positions) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,204,${0.85 * progress})`;
    ctx.fill();
  }
}

function drawFrozen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const dx = nodes[a].tx - nodes[b].tx;
      const dy = nodes[a].ty - nodes[b].ty;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.45;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,204,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(nodes[a].tx, nodes[a].ty);
        ctx.lineTo(nodes[b].tx, nodes[b].ty);
        ctx.stroke();
      }
    }
  }
  for (let n of nodes) {
    ctx.beginPath();
    ctx.arc(n.tx, n.ty, n.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,204,0.85)";
    ctx.fill();
  }
}

function animate(ts) {
  if (!animStart) animStart = ts;
  const progress = Math.min((ts - animStart) / ANIMATE_DURATION, 1);
  drawFrame(progress);
  if (progress < 1) {
    rafId = requestAnimationFrame(animate);
  } else {
    frozen = true;
    drawFrozen();
  }
}

function startNetwork() {
  if (rafId) cancelAnimationFrame(rafId);
  frozen = false;
  animStart = null;
  initCanvas();
  createNodes();
  rafId = requestAnimationFrame(animate);
}

function clearNetwork() {
  if (rafId) cancelAnimationFrame(rafId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frozen = false;
}

// Dark/Light Mode Toggle
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  document.querySelector(".theme-btn").textContent = isLight ? "🌙" : "☀️";
  if (!isLight) {
    startNetwork();
  } else {
    clearNetwork();
  }
}