import { cityRuins } from './maps.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
const map = cityRuins;
const ui = Object.fromEntries(['health','ammo','jetpack','quality','fps','message','pause','overlay','start','mapName','mapDescription','weather','time'].map(id => [id, document.getElementById(id)]));
const coarse = matchMedia('(pointer: coarse)').matches;
const keys = new Set();
const world = { camera: 0, time: 0, rain: [], particles: [], bullets: [], shake: 0, lightning: 0, quality: 'High', paused: true, firing: false, move: 0, aim: 1, elapsed: 0, fps: 60, fpsFrames: 0, fpsTime: 0 };
const player = { x: map.spawn.x, y: map.spawn.y, vx: 0, vy: 0, w: 36, h: 58, grounded: false, health: 100, ammo: 90, jet: 100, facing: 1, invulnerable: 0, anim: 0, shoot: 0, recoil: 0, dead: false };
const qualityScale = { Low: 0.68, Medium: 0.82, High: 1, Ultra: 1 };
const maxParticles = { Low: 45, Medium: 95, High: 180, Ultra: 280 };

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, qualityScale[world.quality] * (coarse ? 1.15 : 1.5));
  canvas.width = Math.max(1, Math.floor(innerWidth * dpr));
  canvas.height = Math.max(1, Math.floor(innerHeight * dpr));
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize, { passive: true });
ui.quality.addEventListener('change', () => { world.quality = ui.quality.value; resize(); });

function collide(dt) {
  player.x += player.vx * dt;
  player.x = Math.max(0, Math.min(map.width - player.w, player.x));
  player.grounded = false;
  for (const p of map.platforms) {
    if (player.x + player.w <= p.x || player.x >= p.x + p.w) continue;
    const oldBottom = player.y + player.h - player.vy * dt;
    const nextBottom = player.y + player.h;
    if (player.vy >= 0 && oldBottom <= p.y + 8 && nextBottom >= p.y) {
      player.y = p.y - player.h; player.vy = 0; player.grounded = true;
    }
  }
  if (player.y > map.height) { player.y = map.spawn.y; player.vy = 0; player.health = Math.max(30, player.health - 20); }
}
function jump() { if (world.paused || player.dead) return; if (player.grounded) player.vy = -690; else if (player.jet > 0) { player.vy = Math.max(player.vy - 520, -640); player.jet = Math.max(0, player.jet - 1.2); puff(player.x + player.w / 2, player.y + player.h, '#ffa64a', 2); } }
function shoot() {
  if (world.paused || player.dead || player.ammo <= 0 || player.shoot > 0) return;
  const direction = player.facing;
  const x = player.x + (direction > 0 ? player.w : 0), y = player.y + 27;
  world.bullets.push({ x, y, vx: direction * 920, life: 0.85 });
  player.ammo--; player.shoot = 0.15; player.recoil = 5;
  puff(x, y, '#ffd66b', 5); world.shake = Math.max(world.shake, 1.4);
}
function puff(x, y, color, count) { if (world.particles.length >= maxParticles[world.quality]) return; for (let i=0;i<count && world.particles.length<maxParticles[world.quality];i++) world.particles.push({x,y,vx:(Math.random()-.5)*95,vy:(Math.random()-.8)*90,life:.25+Math.random()*.4,size:2+Math.random()*4,color}); }
function inputDown(action) { if (action === 'left') world.move = -1; if (action === 'right') world.move = 1; if (action === 'jump') jump(); if (action === 'fire') { world.firing = true; shoot(); } }
function inputUp(action) { if (action === 'left' && world.move < 0 || action === 'right' && world.move > 0) world.move = 0; if (action === 'fire') world.firing = false; }
document.querySelectorAll('[data-control]').forEach(button => {
  const action = button.dataset.control;
  button.addEventListener('pointerdown', e => { e.preventDefault(); button.setPointerCapture?.(e.pointerId); inputDown(action); });
  button.addEventListener('pointerup', e => { e.preventDefault(); inputUp(action); });
  button.addEventListener('pointercancel', () => inputUp(action));
  button.addEventListener('contextmenu', e => e.preventDefault());
});
addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code)) e.preventDefault(); keys.add(e.code); if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') jump(); if (e.code === 'KeyF') { world.firing = true; shoot(); } if (e.code === 'Escape') togglePause(); });
addEventListener('keyup', e => { keys.delete(e.code); if (e.code === 'KeyF') world.firing = false; });
canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && !world.paused) { world.aim = e.clientX > innerWidth / 2 ? 1 : -1; player.facing = world.aim; world.firing = true; shoot(); } });
addEventListener('pointerup', e => { if (e.pointerType === 'mouse') world.firing = false; });
function togglePause() { world.paused = !world.paused; ui.overlay.classList.toggle('hidden', !world.paused); ui.pause.textContent = world.paused ? 'RESUME' : 'Ⅱ'; }
ui.pause.addEventListener('click', togglePause);
ui.start.addEventListener('click', () => { world.paused = false; ui.overlay.classList.add('hidden'); });
document.querySelector('#back').addEventListener('click', () => { location.href = 'lobby.html'; });

function sky(w,h) {
  const grad=ctx.createLinearGradient(0,0,0,h); grad.addColorStop(0,'#101d36');grad.addColorStop(.48,'#49394b');grad.addColorStop(1,'#e27d55');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w*.72,h*.42,5,w*.72,h*.42,h*.55);glow.addColorStop(0,'rgba(255,173,104,.4)');glow.addColorStop(1,'rgba(255,173,104,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='rgba(236,230,209,.72)';ctx.beginPath();ctx.arc(w*.72,h*.44,26,0,Math.PI*2);ctx.fill();
  for(let layer=0;layer<3;layer++){const factor=.12+layer*.13;ctx.fillStyle=['#283347','#202b3d','#172332'][layer];for(let i=-1;i<Math.ceil(w/150)+2;i++){let x=i*150-(world.camera*factor%150),height=95+((i*71+layer*39+800)%145);ctx.fillRect(x,h*.71-height,110,height);ctx.fillStyle='rgba(255,194,116,.22)';for(let wy=0;wy<height-18;wy+=19)for(let wx=10;wx<95;wx+=21)if(((i+wx+wy+layer)%4)!==0)ctx.fillRect(x+wx,h*.71-height+wy,5,8);ctx.fillStyle=['#283347','#202b3d','#172332'][layer];}}
}
function drawBuildings(h) {
  ctx.save();ctx.translate(-world.camera,0);
  for(const b of map.buildings){const top=h*.78-b.h*.48;const grad=ctx.createLinearGradient(b.x,top,b.x+b.w,h*.83);grad.addColorStop(0,'#364354');grad.addColorStop(.48,'#202b39');grad.addColorStop(1,'#121d29');ctx.fillStyle=grad;ctx.fillRect(b.x,top,b.w,b.h);ctx.fillStyle='#667384';ctx.fillRect(b.x,top,b.w,8);ctx.fillStyle='rgba(5,12,22,.55)';ctx.fillRect(b.x+b.w*.12,top+24,b.w*.76,b.h-24);
    for(let y=top+44;y<h*.86;y+=45)for(let x=b.x+18;x<b.x+b.w-18;x+=38){const n=Math.sin(x*12.23+y*3.1+b.seed);if(n>.18){ctx.fillStyle=n>.65?'#eeb87a':'#6b8c91';ctx.globalAlpha=.25+(n+1)*.25;ctx.fillRect(x,y,13,22);}}
    ctx.globalAlpha=1;ctx.fillStyle='rgba(237,235,222,.7)';ctx.font='800 12px Inter, sans-serif';ctx.fillText(b.label,b.x+18,top+27);
    if(b.label==='METRO'){ctx.fillStyle='#ee5968';ctx.shadowColor='#f33';ctx.shadowBlur=15;ctx.fillRect(b.x+80,top+90,98,4);ctx.shadowBlur=0;}
  }
  ctx.restore();
}
function drawPlatforms(h) {
 ctx.save();ctx.translate(-world.camera,0);
 for(const p of map.platforms){const y=h*.86+(p.y-890)*.75;ctx.fillStyle=p.kind==='ground'?'#252d35':p.kind==='tunnel'?'#141c25':'#515d68';ctx.fillRect(p.x,y,p.w,Math.max(14,p.h*.7));ctx.fillStyle=p.kind==='ground'?'#8a6e5e':'#c3a17a';ctx.fillRect(p.x,y,p.w,4);if(p.kind==='ground'){for(let x=p.x;x<p.x+p.w;x+=85){ctx.fillStyle='rgba(20,25,32,.45)';ctx.fillRect(x,y+20,50,5);}}}
 for(const c of map.cover){const y=h*.86+(c.y-890)*.75;ctx.fillStyle=c.kind==='car'?'#424f59':c.kind==='crate'?'#866746':'#666766';ctx.fillRect(c.x,y-c.h*.75,c.w,c.h*.75);ctx.fillStyle='rgba(250,220,170,.28)';ctx.fillRect(c.x+5,y-c.h*.75+5,c.w-10,4);}
 for(const p of map.pickups){const py=h*.86+(p.y-890)*.75+Math.sin(world.time*3+p.x)*5;ctx.save();ctx.shadowBlur=16;ctx.shadowColor=p.kind==='health'?'#79f0a1':p.kind==='ammo'?'#ffe178':'#64dcff';ctx.fillStyle=ctx.shadowColor;ctx.beginPath();ctx.arc(p.x,py,11,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#17222a';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText(p.kind==='health'?'+':p.kind==='ammo'?'•':'↟',p.x,py+5);ctx.restore();}
 ctx.restore();
}
function drawPlayer(h){const x=player.x-world.camera,y=h*.86+(player.y-890)*.75, bob=player.grounded?Math.sin(player.anim*13)*2:0;ctx.save();ctx.translate(x+player.w/2,y+player.h*.37+bob);ctx.scale(player.facing,1);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,player.h*.45,23,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d5a26b';ctx.beginPath();ctx.arc(0,-16,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d8dfe5';ctx.fillRect(-10,-5,20,26);ctx.fillStyle='#90b7a4';ctx.fillRect(-9,0,18,14);ctx.fillStyle='#657280';ctx.fillRect(-19,-8,8,19);ctx.fillStyle='#252d36';ctx.fillRect(-9,19,7,17);ctx.fillRect(3,19,7,17);ctx.fillStyle='#d0d5d9';ctx.fillRect(4,-3,25,5);ctx.fillStyle='#161b22';ctx.fillRect(22,-5,13,4);ctx.fillStyle='#8de4ff';ctx.fillRect(1,-19,8,3);if(player.shoot>0){ctx.fillStyle='#fff0a6';ctx.shadowColor='#ffb23f';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(36,-5);ctx.lineTo(55,0);ctx.lineTo(36,4);ctx.fill();}ctx.restore();}
function render() {
 const w=innerWidth,h=innerHeight;ctx.save();const shake=world.shake;ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);sky(w,h);drawBuildings(h);drawPlatforms(h);
 for(const b of world.bullets){ctx.fillStyle='#fff0a4';ctx.shadowColor='#ffa33e';ctx.shadowBlur=12;ctx.fillRect(b.x-world.camera,b.y+(h*.86-890*.75),14,3);ctx.shadowBlur=0;}drawPlayer(h);
 const light=ctx.createRadialGradient(w*.5,h*.5,40,w*.5,h*.5,Math.max(w,h)*.8);light.addColorStop(0,'rgba(5,11,20,0)');light.addColorStop(1,'rgba(5,11,20,.43)');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
 for(const p of world.particles){ctx.globalAlpha=Math.max(0,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x-world.camera,p.y+h*.15,p.size,p.size);}ctx.globalAlpha=1;
 if(world.lightning>0){ctx.fillStyle=`rgba(210,230,255,${world.lightning*.25})`;ctx.fillRect(0,0,w,h);}ctx.restore();
}
let last=performance.now();
function frame(now){const dt=Math.min(.034,(now-last)/1000);last=now;world.time+=dt;world.fpsFrames++;world.fpsTime+=dt;if(world.fpsTime>.5){world.fps=Math.round(world.fpsFrames/world.fpsTime);world.fpsFrames=0;world.fpsTime=0;ui.fps.textContent=`${world.fps} FPS`;}
 if(!world.paused){const left=keys.has('ArrowLeft')||keys.has('KeyA'),right=keys.has('ArrowRight')||keys.has('KeyD');const move=world.move||((right?1:0)-(left?1:0));player.vx+=(move*280-player.vx)*Math.min(1,dt*11);if(move)player.facing=move;player.vy=Math.min(980,player.vy+1650*dt);collide(dt);player.anim+=dt;player.shoot=Math.max(0,player.shoot-dt);player.recoil=Math.max(0,player.recoil-dt*28);player.invulnerable=Math.max(0,player.invulnerable-dt);world.shake=Math.max(0,world.shake-dt*8);world.lightning=Math.max(0,world.lightning-dt*4);if(Math.random()<dt*.035)world.lightning=.8;if(world.firing)shoot();
   world.camera=Math.max(0,Math.min(map.width-innerWidth,player.x-innerWidth*.42));for(const b of world.bullets){b.x+=b.vx*dt;b.life-=dt;}world.bullets=world.bullets.filter(b=>b.life>0&&b.x>=0&&b.x<=map.width);for(const p of world.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}world.particles=world.particles.filter(p=>p.life>0);
   for(let i=map.pickups.length-1;i>=0;i--){const p=map.pickups[i];if(Math.abs(player.x-p.x)<30&&Math.abs(player.y-p.y)<75){if(p.kind==='health')player.health=Math.min(100,player.health+35);if(p.kind==='ammo')player.ammo+=30;if(p.kind==='jetpack')player.jet=100;map.pickups.splice(i,1);}}
   if(player.health<=0){player.health=100;player.x=map.spawn.x;player.y=map.spawn.y;player.vx=player.vy=0;world.paused=true;ui.overlay.classList.remove('hidden');ui.message.textContent='REDEPLOYED · KEEP MOVING';}
   for(const p of world.rain){p.x-=65*dt;p.y+=480*dt;if(p.y>innerHeight){p.y=-20;p.x=Math.random()*innerWidth;}}
 }
 ui.health.style.width=`${player.health}%`;ui.ammo.textContent=player.ammo;ui.jetpack.style.width=`${player.jet}%`;render();requestAnimationFrame(frame);
}
for(let i=0;i<90;i++)world.rain.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight});
const rainCanvas=document.querySelector('#rain');const rainCtx=rainCanvas.getContext('2d');
function rainFrame(){rainCanvas.width=innerWidth;rainCanvas.height=innerHeight;rainCtx.clearRect(0,0,innerWidth,innerHeight);rainCtx.strokeStyle='rgba(184,216,238,.18)';rainCtx.lineWidth=1;for(const p of world.rain){rainCtx.beginPath();rainCtx.moveTo(p.x,p.y);rainCtx.lineTo(p.x-4,p.y+13);rainCtx.stroke();}requestAnimationFrame(rainFrame);}
ui.mapName.textContent=map.name;ui.mapDescription.textContent=map.description;ui.weather.textContent=map.weather;ui.time.textContent=map.time;resize();requestAnimationFrame(frame);requestAnimationFrame(rainFrame);
