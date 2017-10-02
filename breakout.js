// Arun Paramanathan
// CIS 580 Fall 2017
// breakout.js

// The Mozilla web doc on creating a breakout game
// was used for more complex concepts such as
// collision detection and brick array creation.
//
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

// Canvas.
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

// Game state.
var gameOver = false;
var score = 0;

// Ball.
var ballX = 375;
var ballY = 450;
var changeX = 0.65;
var changeY = -1;
var ballRadius = 10;

// Player.
var playerHeight = 15;
var playerWidth = 80;
var playerX = 333; // Close enough to center.
var playerDirection = 'none'; // Start out stationary.

// Bricks.
var bricks = [];
var brickRows = 5;
var brickCols = 5;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 10;
var brickOffset = 10;

// Create canvas and context.
function setup()
{
  canvas.width = 750;
  canvas.height = 500;
  document.body.appendChild(canvas);

  // Create bricks array with x,y variables.
  for(col = 0; col < brickCols; col++)
  {
    bricks[col] = [];
    for(row = 0; row < brickRows; row++)
    {
      bricks[col][row] = { x: 0, y: 0, visible: true};
    }
  }
}

// Draw ball (will be used each frame).
function drawBall()
{
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

// Draw player (will be used each frame).
function drawPlayer()
{
  ctx.beginPath();
  ctx.rect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

// Draw bricks.
function drawBricks()
{
  for(col = 0; col < brickCols; col++)
  {
    for(row = 0; row < brickRows; row++)
    {
      var b = bricks[col][row];
      if (b.visible)
      {
        var x = (col * (brickWidth + brickPadding)) + brickOffset;
        var y = (row * (brickHeight + brickPadding)) + brickOffset;
        b.x = x;
        b.y = y;
        ctx.beginPath();
        ctx.rect(x, y, brickWidth, brickHeight);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function checkBrickCollisions()
{
  for(col = 0; col < brickCols; col++)
  {
    for(row = 0; row < brickRows; row++)
    {
      var b = bricks[col][row];
      if(b.visible && (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight))
      {
        changeY *= -1;
        score += 10;
        b.visible = false;

        if(score === (brickRows * brickCols) * 10)
        {
          gameOver = true;
          handleWin();
        }
      }
    }
  }
}

function showScore()
{

}

// Clear old frame and draw new frame.
function refreshFrame()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver)
  {
    drawBall();
    drawPlayer();
    checkBrickCollisions();
    drawBricks();

    // Collision detection with edge of ball and canvas.
    if(ballX + changeX > canvas.width - ballRadius || ballX + changeX < ballRadius) { changeX *= -1; }

    // If ball hits player.
    if (ballY + changeY > canvas.height - ballRadius - playerHeight &&
        ballX >= playerX && ballX <= playerX + playerWidth)
    {
      // Change direction with random added force if player is moving.
      if (changeY > 1.5) { changeY = -1 }
      else if (playerDirection != 'none') { changeY *= -(Math.random() * (1.1 - 0.98) + 0.98); }
      else { changeY *= -1; }
    }
    // Otherwise, if ball hit an edge.
    if(ballY + changeY < ballRadius)
    {
      changeY *= -1;
    }
    // If ball falls off the edge, game over.
    else if (ballY + changeY > canvas.height + ballRadius)
    {
      gameOver = true;
      handleGameLost();
    }

    ballX += changeX;
    ballY += changeY;

    // Collision detection with player and edge of canvas.
    // Also set player direction.
    if(playerDirection === 'right' && playerX < canvas.width - playerWidth) { playerX += 2; }
    else if(playerDirection === 'left' && playerX > 0) { playerX -= 2; }
  }
}

function handleWin()
{
  alert('winner');
}

function handleGameLost()
{
  alert('you lost');
}

// Listen for key press events and handle them.
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Handle key down by changing direction if arrow keys are pressed.
function keyDownHandler(e)
{
  if(e.keyCode === 39) { playerDirection = 'right'; }
  else if(e.keyCode === 37) { playerDirection = 'left'; }
}

// If arrow keys are no longer pressed, stop player's motion.
function keyUpHandler(e)
{
  if(e.keyCode === 39 || e.keyCode === 37) { playerDirection = 'none'; }
}

setup();
// Default interval.
setInterval(refreshFrame);
