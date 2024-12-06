import './style.css'

const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');

let W = canvas.width;
let H = canvas.height;

const platforms = [];
const platformPool = [];

const cam = {
  x: 0,
  y: 0,
  sx: 1,
  sy: 1,
  r: 0
}

const ball = {
  x: 0,
  y: 0,
  sx: 1,
  sy: 1,
  rad: 20,
  rot: 0,
  vel: {x: 0, y: 0},
  speed: 1,
  gravity: 10,
  dive: false,
  diveSpeed: 15,
  update: function(dt){
    if (input.KeyS) this.dive = true;

    this.vel.y += this.gravity * dt;
    if (this.vel.y > this.gravity) this.vel.y = this.gravity;

    if (this.dive)
    {
      this.vel.y = this.diveSpeed; 
      this.dive = false;
    }

    checkCollision();

    this.vel.x = this.speed;

    this.x += this.vel.x;
    this.y += this.vel.y;

  },
  onCollide: function(){
    this.vel.y = -10;
  }
}

const mouse = {
  x: 0,
  y: 0
}

const input = {};

window.onload = () => {
  onResize();
  requestAnimationFrame(firstFrame);
};
window.onresize = onResize;

document.body.addEventListener('mousemove', e => {
  [mouse.x, mouse.y] = worldToScreen(e.clientX, e.clientY);
});

document.addEventListener('keydown', e => {
  input[e.code] = true;
  
});

document.addEventListener('keyup', e => {
  input[e.code] = false;
});


function firstFrame()
{
  requestAnimationFrame(loopCallback);

  for (let i = 0; i < 4; i++) generatePlatform();

}

let acc = 0;
let lastTime = 0;
const step = 1 / 60;
function loopCallback(elapsedTime)
{
  requestAnimationFrame(loopCallback);
  const dt = (elapsedTime - lastTime) / 1000;
  acc += dt;
  while(acc > step)
  {
    update(step);
    acc -= step;
  }
  draw();
  lastTime = elapsedTime;
}

let animTime = 0;
let lerpDur = 50;
function update(dt)
{
  ball.update(dt);

  cam.x = lerp(cam.x, ball.x - W / 2, animTime / lerpDur);
  cam.y = lerp(cam.y, ball.y - H / 2, animTime / lerpDur);

  animTime += 0.01;
  
  if (animTime > lerpDur) animTime = 0;
} 

function draw()
{
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#efefef";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#212121";
  for(let i = 0; i < platforms.length; i++)
  {
    const p = platforms[i];
    const [x, y] = worldToScreen(p.x, p.y);
    ctx.fillRect(x, y, p.w * cam.sx, p.h * cam.sy);
  }

  // draw ball
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  const [x, y] = worldToScreen(ball.x, ball.y);
  ctx.arc(x, y, ball.rad * ball.sx * cam.sx, 0, 6.28);
  ctx.fill();

}

function generatePlatform()
{
  const y = (H / 2) + Math.random() * 200
  const platform = {
    x: platforms.length > 0 ? platforms[platforms.length - 1].x + platforms[platforms.length - 1].w + Math.random() * 100 + 50 : 100,
    y: y,
    w: 50 + Math.random() * 200,
    h: H - y
  };

  platforms.push(platform);
}

function onResize()
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  W = canvas.width;
  H = canvas.height;

}

function worldToScreen(wx, wy)
{
  return [(wx - cam.x) * cam.sx, (wy - cam.y) * cam.sy];
}

function screenToWorld(sx, sy)
{
  return[(sx / cam.sx) + cam.x, (sy / cam.sy) + cam.y];
}

function zoomIn(zx, zy, zf) // zoom focus x, y pos and factor
{
  const [preZX, preZY] = screenToWorld(zx, zy);

  cam.sx += zf;
  cam.sx = Math.max(0.1, cam.sx);
  cam.sy = cam.sx;

  const [postZX, postZY] = screenToWorld(zx, zy);

  cam.x += (preZX - postZX) / cam.sx;
  cam.y += (preZY - postZY) / cam.sy;
}

function zoomOut(zx, zy, zf)
{
  const [preZX, preZY] = screenToWorld(zx, zy);

  cam.sx -= zf;
  cam.sx = Math.max(0.1, cam.sx);
  cam.sy = cam.sx;

  const [postZX, postZY] = screenToWorld(zx, zy);

  cam.x += (preZX - postZX) / cam.sx;
  cam.y += (preZY - postZY) / cam.sy;
}

function checkCollision()
{

  const maxY = H / 2 + 200;
  for (let i = 0; i < platforms.length; i++)
  {
    const p = platforms[i];
    
    let testX = ball.x;
    let testY = ball.y;

    if (ball.x < p.x) testX = p.x;
    else if (ball.x > p.x + p.w) testX = p.x + p.w;
    if (ball.y < p.y) testY = p.y;
    else if (ball.y > p.y + p.h) testY = p.y + p.h;

    const dx = testX - ball.x;
    const dy = testY - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist <= ball.rad * ball.sx)
    {
      ball.onCollide();
      console.log("collision");
      return;
    }
  }

  if (ball.y > maxY)
  {
    console.log("fall")
  }
}

function lerp(a, b, t)
{
  return a + (b - a) * t;
}