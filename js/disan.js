const canvas_five = document.getElementById('ma');
const ctx_five = canvas_five.getContext('2d');
var w_five = canvas_five.width = window.innerWidth;
var h_five = canvas_five.height = window.innerHeight;
  li = 217;
  starst = [];
  counts = 0;
  maxStarst = 1400;

// Thanks @jackrugile for the performance tip! http://codepen.io/jackrugile/pen/BjBGoM
// Cache gradient
var canvas2_five = document.createElement('canvas');
const ctx2_five = canvas2_five.getContext('2d');
    canvas2_five.width = 100;
    canvas2_five.height = 100;
var half_dive = canvas2_five.width/2;
    gradient2_five = ctx2_five.createRadialGradient(half_dive,half_dive, 0, half_dive, half_dive, half_dive);
     gradient2_five.addColorStop(0.025, '#fff');
     gradient2_five.addColorStop(0.1, 'hsl(' + li + ', 61%, 33%)');
     gradient2_five.addColorStop(0.25, 'hsl(' + li + ', 64%, 6%)');
     gradient2_five.addColorStop(1, 'transparent');

    ctx2_five.fillStyle =  gradient2_five;
    ctx2_five.beginPath();
    ctx2_five.arc( half_dive, half_dive, half_dive, 0, Math.PI * 2);
    ctx2_five.fill();

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

var Star = function() {

  this.orbitRadius = random(w_five / 2 - 50);
  this.radius = random(100, this.orbitRadius) / 10;
  this.orbitX = w_five / 2;
  this.orbitY = h_five / 2;
  this.timePassed = random(0, maxStarst);
  this.speed = random(this.orbitRadius) / 900000;
  this.alpha = random(2, 10) / 10;

  counts++;
  starst[counts] = this;
}

Star.prototype.draw = function() {
  var x = Math.sin(this.timePassed + 1) * this.orbitRadius + this.orbitX;
      y = Math.cos(this.timePassed) * this.orbitRadius/2 + this.orbitY;
      twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctx_five.globalAlpha = this.alpha;
    ctx_five.drawImage(canvas2_five, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStarst; i++) {
  new Star();
}

function animation() {
    ctx_five.globalCompositeOperation = 'source-over';
    ctx_five.globalAlpha = 0.8;
    ctx_five.fillStyle = 'hsla(' + li + ', 64%, 6%, 1)';
    ctx_five.fillRect(0, 0, w_five, h_five);
  
  ctx_five.globalCompositeOperation = 'lighter';
  for (var i = 1, l = starst.length; i < l; i++) {
    starst[i].draw();
  };  
  
  window.requestAnimationFrame(animation);
}

animation();