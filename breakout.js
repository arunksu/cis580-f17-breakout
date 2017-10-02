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
var gameState = 'play';
var score = 0;
var brickValue = 10;
var winningScore = 0;

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
var brickCols = 10;
var brickWidth = 55;
var brickHeight = 20;
var brickPadding = 20;
var brickOffset = 10;

// Create canvas and context.
function setup()
{
  canvas.width = 750;
  canvas.height = 500;
  document.body.appendChild(canvas);

  // Create bricks array with x,y variables.
  // Randomly turn bricks on and off
  // for a more varied layout each time.
  for(col = 0; col < brickCols; col++)
  {
    bricks[col] = [];

    for(row = 0; row < brickRows; row++)
    {
      // Randomize for brick color.
      var brickColor = '';
      var r = Math.random();

      if (r < 0.33) { brickColor = '#0081cc'; }
      else if (r < 0.66) { brickColor = '#ff0066'; }
      else { brickColor = '#00ad4b'; }

      // Randomize for brick visibility.
      r = Math.random();
      if (r < 0.5)
      {
        bricks[col][row] = { x: 0, y: 0, color: brickColor, visible: true };
        winningScore += brickValue;
      }
      else
      {
        bricks[col][row] = { x: 0, y: 0, color: brickColor, visible: false };
      }
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
        ctx.fillStyle = b.color;
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

        if(score === winningScore)
        {
          gameState = 'won';
        }
      }
    }
  }
}

function showScore()
{
  ctx.fillStyle = 'black';
  ctx.font= '20px Arial';
  ctx.fillText('Score: ' + score, 20, canvas.height - 20);
}

// Clear old frame and draw new frame.
function refreshFrame()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'play')
  {
    drawBall();
    drawPlayer();
    checkBrickCollisions();
    drawBricks();
    showScore();

    // Collision detection with edge of ball and canvas.
    if(ballX + changeX > canvas.width - ballRadius || ballX + changeX < ballRadius) { changeX *= -1; }

    // If ball hits player.
    if (ballY + changeY > canvas.height - ballRadius - playerHeight &&
        ballX >= playerX && ballX <= playerX + playerWidth)
    {
      // Change direction with random added force if player is moving.
      if (changeY > 1.8) { changeY = -1 }
      else if (playerDirection != 'none') { changeY *= -(Math.random() * (1.5 - 1.0) + 1.0); }
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
      gameState = 'lost';
    }

    ballX += changeX;
    ballY += changeY;

    // Collision detection with player and edge of canvas.
    // Also set player direction.
    if(playerDirection === 'right' && playerX < canvas.width - playerWidth) { playerX += 2.5; }
    else if(playerDirection === 'left' && playerX > 0) { playerX -= 2.5; }
  }
  else if (gameState === 'lost') { handleGameLost(); }
  else if (gameState === 'won') { handleGameWon(); }
}

function handleGameWon()
{
  ctx.fillStyle = 'black';
  ctx.font= '20px Arial';
  ctx.fillText('You won! Score: ' + score, 20, canvas.height - 20);
}

function handleGameLost()
{
  ctx.fillStyle = 'black';
  ctx.font= '20px Arial';
  ctx.fillText('Game over. Score: ' + score, 20, canvas.height - 20);
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
