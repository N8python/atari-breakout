var paddle, intervalId, ball, blocks = [], score = 0;
const blockWidth = 50;
const blockHeight = 10;
window.onload = function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function drawEllipse(x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  function touching(thing, thing2) {
    if (thing.x >= thing2.x && thing.y >= thing2.y && thing.x <= thing2.x + thing2.width &&
      thing.y <= thing2.y + thing2.height) {
      return true;
    }
    return false;
  }
  setInterval(() => {
    $("#canvas").css("margin-left", window.innerWidth / 2 - canvas.width / 2)
  }, 1)
  class Block {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = blockWidth - 2;
      this.height = blockHeight - 2;
      this.toRemove = false;
    }
    draw() {
      ctx.fillStyle = "White"
      ctx.fillRect(this.x + 2, this.y + 2, blockWidth - 2, blockHeight - 2);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < Math.floor(canvas.width / blockWidth); x++) {
      blocks.push(new Block(x * blockWidth, y * blockHeight + canvas.height/3))
    }
  }
  paddle = {
    width: 50,
    height: 10,
    x: 0,
    y: 0,
    draw: function() {
      ctx.fillStyle = "White";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  ball = {
    x: canvas.width / 2,
    y: canvas.height * 0.55,
    xVel: 3,
    yVel: 3,
    rad: 6,
    draw: function() {
      ctx.fillStyle = "White";
      drawEllipse(this.x, this.y, this.rad, this.rad);
    },
    move: function() {
      if(this.xVel < -9) this.xVel = -9;
      if(this.xVel > 9) this.xVel = 9;
      if(this.xVel < 3 && this.xVel >= 0) this.xVel = 3;
      if(this.xVel > -3 && this.xVel < 0) this.xVel = -3;
      if(this.yVel < -9) this.yVel = -9;
      if(this.yVel > 9) this.yVel = 9;
      if(this.yVel < 3 && this.yVel >= 0) this.yVel = 3;
      if(this.yVel > -3 && this.yVel < 0) this.yVel = -3;
      this.x += this.xVel;
      this.y += this.yVel;
      if (this.x < this.rad || this.x > canvas.width - this.rad) {
        this.xVel *= -1;
        this.x += this.xVel;
      }
      if (this.y < this.rad || this.y > canvas.height - this.rad) {
        this.yVel *= -1;
        this.y += this.yVel;
      }
      if (touching(this, paddle)) {
        /*this.xVel *= getRandomFloat(-1.5, -0.5);
        this.x += this.xVel;*/
        this.yVel *= getRandomFloat(-1.5, -0.5);
        this.y += this.yVel;
      }
      blocks.forEach(block => {
        if (touching(this, block)) {
          /*this.xVel *= getRandomFloat(-1.5, -0.5);
          this.x += this.xVel;*/
          if (Math.abs(this.x - block.x) < 3 || Math.abs(this.x - block.x + blockWidth) < 3) {
            this.xVel *= getRandomFloat(-1.5, -0.5);
            this.x += this.xVel;
          } else {
            this.yVel *= getRandomFloat(-1.5, -0.5);
            this.y += this.yVel;
          }
          block.toRemove = true;
        }
      })
    }
  }
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height * 0.9 - paddle.height / 2;
  intervalId = setInterval(() => {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    paddle.draw();
    ball.draw();
    ball.move();
    blocks.forEach(block => {
      block.draw();
    });
    ctx.font = "20px Monospace";
    ctx.fillText("Score: " + score, 10, 25);
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].toRemove) {
        score++;
        blocks.splice(i, 1);
      }
    }
  }, 16)
}
document.getElementById("canvas").addEventListener("mousemove", event => {
  paddle.x = event.x - (window.innerWidth / 2 - canvas.width / 2);
})
document.getElementById("canvas").addEventListener("mousedown", event => {
  paddle.x = event.x - (window.innerWidth / 2 - canvas.width / 2);
})
