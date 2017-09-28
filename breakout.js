// Arun Paramanathan
// CIS 580 Fall 2017
// breakout.js

// The Mozilla web doc on creating a breakout game
// was used for more complex concepts such as
// collision detection.
//
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

// Variables.
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var x = 375;
var y = 500;
var changeX = 0;
var changeY = -1;

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
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Clear and draw new frame.
function refreshFrame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += changeX;
    y += changeY;
}

setup();
// Default interval.
setInterval(refreshFrame);
