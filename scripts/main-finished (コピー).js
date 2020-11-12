// setup canvas

var cnt = document.getElementById('cnt');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};

// define Shape constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
};

// define Ball constructor

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
};

// define evil circle constructor

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
};

// define evlCircle draw method

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// define evilCircle bounds check method

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x = this.x - this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x = this.x + this.size;
  }

  if((this.y + this.size) >= height) {
    this.y = this.y - this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y = this.y + this.size;
  }
};

// define evilCircle control set method

EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {  //Key'A'
      _this.x -= _this.velX;  //move left
    } else if (e.keyCode === 68) {  //Key'D'
      _this.x += _this.velX;  //move right
    } else if (e.keyCode === 87) {  //Key'W'
      _this.y -= _this.velY;  //move up
    } else if (e.keyCode === 83) {  //Key'S'
      _this.y += _this.velY;  //move down
    }
  }
};

// define evilCircle collision direction

EvilCircle.prototype.collisionDetect = function() {
  let ballCount = 0;
  cnt.innerHTML = balls.length - ballCount;
  for(let j = 0; j < balls.length; j++) {
    if(!(this.exsits === false)) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = this.exists = false;
      }
    }
  }
};

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}

// define array to store evilCircle and populate it

let evilCircle = new EvilCircle(
  // ball position always drawn at least one ball width
  // away from the adge of the canvas, to avoid drawing errors
  random(0 + random(10,20),width - random(10,20)),
  random(0 + random(10,20),height - random(10,20)),
  true
);

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  evilCircle.setControls();

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists === true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
  }

  requestAnimationFrame(loop);
};

loop();