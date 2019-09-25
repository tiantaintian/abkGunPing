var canvas_six = document.getElementById('po');
const  ctx_six = canvas_six.getContext('2d');
var w_six = canvas_six.width = window.innerWidth;
var h_six = canvas_six.height = window.innerHeight;

  hue = 217,
  stars = [],
  count = 0,
  maxStars = 1300;//星星数量

var canvas2 = document.createElement('canvas');
const ctx2_six = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2;
		gradient2 = ctx2_six.createRadialGradient(half, half, 0, half, half, half);
		gradient2.addColorStop(0.025, '#CCC');
		gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
		gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
		gradient2.addColorStop(1, 'transparent');

ctx2_six.fillStyle = gradient2;
ctx2_six.beginPath();
ctx2_six.arc(half, half, half, 0, Math.PI * 2);
ctx2_six.fill();

// End cache

function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }

  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x, y) {
  var max = Math.max(x, y);
    diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
  //星星移动范围，值越大范围越小，
}

var Star = function() {

  this.orbitRadius = random(maxOrbit(w_six, h_six));
  this.radius = random(60, this.orbitRadius) / 8; 
  //星星大小
  this.orbitX = w_six / 2;
  this.orbitY = h_six / 2;
  this.timePassed = random(0, maxStars);
  this.speed = random(this.orbitRadius) / 50000; 
  //星星移动速度
  this.alpha = random(2, 10) / 10;

  count++;
  stars[count] = this;
}

Star.prototype.draw = function() {
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
    twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctx_six.globalAlpha = this.alpha;
  ctx_six.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
  new Star();
}

function animationt() {
  ctx_six.globalCompositeOperation = 'source-over';
  ctx_six.globalAlpha = 0.5; //尾巴
  ctx_six.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
  ctx_six.fillRect(0, 0, w_six, h_six)

  ctx_six.globalCompositeOperation = 'lighter';
  for (var i = 1, l = stars.length; i < l; i++) {
    stars[i].draw();
  };

  window.requestAnimationFrame(animationt);
}

animationt();