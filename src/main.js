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

window.onload = () => {
  onResize();
  requestAnimationFrame(firstFrame);
};
window.onresize = onResize;


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

function update(dt)
{
  
  
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