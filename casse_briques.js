const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 20;
let dx = 1;
let dy = -1;
const ballRadius = 5;
const paddleHeight = 5;
const paddleWidth = 90;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let interval = setInterval(draw, 2);
const brickRowCount = 15;
const brickColumnCount = 22;
const brickPadding = 20;
let brickHeight =
  (canvas.height / 1.5 - brickPadding * (brickRowCount + 1)) / brickRowCount;
let brickWidth =
  (canvas.width - brickPadding * brickColumnCount) / brickColumnCount;
const brickOffsetTop = 10;
const brickOffsetLeft = 10;
const bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
let brickBrake = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function drawBall() {
  context.beginPath();
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();
  context.closePath();
}

function drawPaddle() {
  context.beginPath();
  context.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  context.fillStyle = "red";
  context.fill();
  context.closePath();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  x += dx;
  y += dy;

  if (brickBrake == brickColumnCount * brickRowCount) {
    alert("You Win!");
    document.location.reload();
    clearInterval(interval);
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("You Loose!");
      document.location.reload();
      clearInterval(interval);
    }
  }
  if (x + dx < ballRadius) {
    dx = -dx;
  }
  if (x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }

  if (rightPressed) {
    paddleX += 3;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 3;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let bricksX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let bricksY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = bricksX;
        bricks[c][r].y = bricksY;
        context.beginPath();
        context.rect(bricksX, bricksY, brickWidth, brickHeight);
        context.fillStyle = "yellowgreen";
        context.fill();
        context.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          brickBrake++;
        }
      }
    }
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
interval;
