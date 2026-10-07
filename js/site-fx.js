/* My-Apps — animations : transition de page, ondulation des boutons, apparition au défilement, barre de progression */
(()=>{
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const prog=document.createElement('div');prog.id='prog';document.body.appendChild(prog);
 const onScroll=()=>{const h=document.documentElement,m=h.scrollHeight-innerHeight;prog.style.transform=`scaleX(${m>0?scrollY/m:0})`};
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('pg-out')});
 document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduce)return;
  if(a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
  const u=new URL(a.href,location.href);if(u.origin!==location.origin||!/\.html$|\/$/.test(u.pathname))return;
  if(u.pathname===location.pathname&&u.search===location.search){
   if(u.hash){const t=document.getElementById(decodeURIComponent(u.hash.slice(1)));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}
   return;
  }
  e.preventDefault();document.body.classList.add('pg-out');setTimeout(()=>{location.href=a.href},240);
 });
 document.addEventListener('pointerdown',e=>{
  const b=e.target.closest&&e.target.closest('.btn');if(!b||reduce||b.disabled)return;
  const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,w=document.createElement('span');
  w.className='wave';w.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
  b.appendChild(w);setTimeout(()=>w.remove(),650);
 },{passive:true});
 /* fond animé : points reliés qui dérivent et réagissent au curseur */
 if(!reduce){
  const cv=document.createElement('canvas');cv.id='bg';document.body.prepend(cv);
  const cx=cv.getContext('2d');let W,H,P=[],mx=-999,my=-999,col='#2F6BFF',ink='#111418',tick=0,run=true;
  const init=()=>{const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);const n=Math.min(110,Math.round(W*H/15000));P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1+Math.random()*1.6}))};
  const colors=()=>{const s=getComputedStyle(document.documentElement);col=s.getPropertyValue('--a').trim()||col;ink=s.getPropertyValue('--ink').trim()||ink};
  addEventListener('resize',init);addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run)loop()});
  const loop=()=>{if(!run)return;if(tick++%90===0)colors();cx.clearRect(0,0,W,H);
   for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-mx,dy=p.y-my,d=dx*dx+dy*dy;if(d<14000){const f=(1-d/14000)*.6;p.x+=dx*f*.03;p.y+=dy*f*.03}}
   cx.fillStyle=ink;cx.globalAlpha=.3;for(const p of P){cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}
   cx.strokeStyle=col;cx.lineWidth=1;
   for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<16900){cx.globalAlpha=(1-d/16900)*.38;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
   cx.globalAlpha=1;requestAnimationFrame(loop)};
  colors();init();loop();
 }
 /* halo qui suit le curseur + légère inclinaison de l'image du héros */
 if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce)document.addEventListener('pointermove',e=>{
  const t=e.target.closest&&e.target.closest('.card,.work,.panel,.kpi,.svc');
  if(t){const r=t.getBoundingClientRect();t.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');t.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')}
  const h=document.querySelector('.hero-pic');
  if(h){const r=h.getBoundingClientRect(),inside=e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom;h.style.transform=inside?`perspective(1000px) rotateY(${((e.clientX-r.left)/r.width-.5)*7}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*7}deg)`:''}
 },{passive:true});
 /* apparition au défilement des blocs marqués .rv ; sans observateur, tout reste visible */
 const els=$$('.rv');
 if(!('IntersectionObserver' in window)||reduce){els.forEach(e=>e.classList.add('in'));return}
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 els.forEach((e,i)=>{e.style.setProperty('--d',(i%4)*.07+'s');io.observe(e)});
 setTimeout(()=>els.forEach(e=>e.classList.add('in')),4000);
})();
