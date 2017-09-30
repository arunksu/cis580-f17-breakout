// Arun Paramanathan
// CIS 580 Fall 2017
// breakout.js

// The Mozilla web doc on creating a breakout game
// was used for more complex concepts such as
// collision detection.
//
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

// Canvas.
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

// Ball.
var x = 375;
var y = 450;
var changeX = 0;
var changeY = -1;
var ballRadius = 10;

// Player.
var playerHeight = 15;
var playerWidth = 80;
var playerX = 333; // Close enough to center.
var playerDirection = 'none'; // Start out stationary.

// Create canvas and context.
function setup()
{
  canvas.width = 750;
  canvas.height = 500;
  document.body.appendChild(canvas);
}

// Draw ball (will be used each frame).
function drawBall()
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

// Draw player (will be used each frame).
function drawPlayer()
{
    ctx.beginPath();
    ctx.rect(playerX, canvas.height-playerHeight, playerWidth, playerHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// Clear old frame and draw new frame.
function refreshFrame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayer();

    // Collision detection with edge of ball and canvas.
    if(x + changeX > canvas.width - ballRadius || x + changeX < ballRadius) { changeX *= -1; }
    if(y + changeY > canvas.height - ballRadius || y + changeY < ballRadius) { changeY *= -1; }

    x += changeX;
    y += changeY;

    // Collision detection with player and edge of canvas.
    // Also set player direction.
    if(playerDirection === 'right' && playerX < canvas.width - playerWidth) { playerX += 2; }
    else if(playerDirection === 'left' && playerX > 0) { playerX -= 2; }
}

// Listen for key press events and handle them.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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
