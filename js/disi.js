const canvas_four = document.querySelector('#yo');
//console.log(canvas_four);
const ctx_four = canvas_four.getContext('2d');
//console.log(ctx);
//console.log('-----------------');

const canvas_four_four_2 = document.querySelector('#wo');
const ctx2 = canvas_four_four_2.getContext('2d');

const dim = Math.min(window.innerWidth, window.innerHeight) * 0.95;
const w = dim;
const h = dim;
const midX = w >> 1;
const midY = h >> 1;

const PI = Math.PI;
const TO_RADIAN = PI / 180;

const maxDepth = 5;
const maxSpread = 90 * TO_RADIAN;

let autoAnimate = true;
let divergeAt = 0.5;
let spread = 45 * TO_RADIAN;
let tick = 0;

let autoSpeed = 0.004;
let autoTick = 0;

canvas_four.width = canvas_four_four_2.width = w;
canvas_four.height = canvas_four_four_2.height = h;

class Branch {
  constructor(position = {x : 0, y: 0}, length = 100, divergeAt = 0.5, angle = 0, depth = 0, spread = 45 * TO_RADIAN) {
    this.position = position;
    this.length = length;
    this.divergeAt = divergeAt;
    this.angle = angle;
    this.depth = depth;

    this.color = '#000';
    this.spread = spread;
    this.branches = [];

    this.grow();
  }

  grow() {
    if (!this.canBranch) {
      return;
    }

    this.branches = [];

    const nextLength = this.length * 0.75;
    const nextDepth = this.depth + 1;

    this.branches.push(
      new Branch(
        this.growPosition,
        nextLength,
        this.divergeAt,
        this.angle + this.spread,
        nextDepth,
        this.spread
      ),
      new Branch(
        this.growPosition,
        nextLength,
        this.divergeAt,
        this.angle - this.spread,
        nextDepth,
        this.spread
      )
    );
  }

  update(spread, divergeAt) {
    this.spread = spread;
    this.divergeAt = divergeAt;

    this.grow();
  }

  get growPosition() {
    const dl = this.length * this.divergeAt;

    return {
      x: this.position.x + (Math.cos(this.angle) * dl),
      y: this.position.y + (Math.sin(this.angle) * dl),
    };
  }

  get canBranch() {
    return this.depth < maxDepth;
  }
}

const rootBranch = new Branch(
  { x: midX, y: midY },
  midY * 0.5,
  divergeAt,
  -90 * TO_RADIAN,
  0,
  spread
);

const drawBranch = (branch, phase) => {
  const h = ~~(200 + (160 * phase));
  const l = 50 + ~~(((branch.depth / (maxDepth + 1))) * 50);

  const endX = branch.length;
  const endY = 0;
  const r = 2;

  ctx_four.save();

  ctx_four.strokeStyle = `hsl(${h}, 100%, ${l}%)`;
  ctx_four.translate(branch.position.x, branch.position.y);
  ctx_four.rotate(branch.angle);

  ctx_four.beginPath();
  ctx_four.moveTo(0, 0);
  ctx_four.lineTo(endX, endY);
  ctx_four.stroke();
  ctx_four.closePath();

  ctx_four.beginPath();
  ctx_four.fillStyle = `hsl(${h}, 100%, 50%)`;
  ctx_four.arc(endX, endY, r, 0, PI * 2, false);
  ctx_four.fill();
  ctx_four.closePath();

  ctx_four.restore();

  branch.branches.forEach((b) => {
    drawBranch(b, phase);
  });
};

const map = (value, start1, stop1, start2, stop2) => ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
//console.log(canvas_four.width);
//console.log('-------');

const clear = () => {
  ctx_four.clearRect(0, 0, canvas_four.width,canvas_four.height);
  ctx2.clearRect(0, 0, canvas_four.width, canvas_four.height);
};

const loop = () => {
  let phase = rootBranch.spread / maxSpread;

  clear(phase);

  if (autoAnimate) {
    phase = map(Math.sin(autoTick), -1, 1, 0, 1);

    spread = phase * maxSpread;
    divergeAt = map(Math.sin(autoTick), -1, 1, 0, 0.5);

    autoTick += autoSpeed;
  }

  rootBranch.update(spread, divergeAt);

  drawBranch(rootBranch, phase);

  const numSegments = 12;
  const angleInc = PI * 2 / numSegments;
  let angle = tick;

  for (let i = 0; i < numSegments; i++) {
    ctx2.save();
    ctx2.translate(midX, midY);
    ctx2.rotate(angle);
    ctx2.drawImage(canvas_four, -w / 2, -h / 2);
    ctx2.restore();
    angle += angleInc;
  }

  tick += 0.002;

  requestAnimationFrame(loop);
};

const onPointerMove = (e) => {
  if (autoAnimate) {
    return;
  }

  const target = (e.touches && e.touches.length) ? e.touches[0] : e;
  const { clientX: x, clientY: y } = target;

  const width = window.innerWidth;
  const height = window.innerHeight;

  spread = (x / width) * maxSpread;
  divergeAt = y / height;
};

document.body.addEventListener('mousemove', onPointerMove);
document.body.addEventListener('touchmove', onPointerMove);

document.addEventListener('mouseenter', () => {
  autoAnimate = false;
});

document.addEventListener('mouseleave', () => {
  autoAnimate = true;
});

loop();