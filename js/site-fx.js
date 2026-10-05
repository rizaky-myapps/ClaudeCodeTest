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
 /* apparition au défilement des blocs marqués .rv ; sans observateur, tout reste visible */
 const els=$$('.rv');
 if(!('IntersectionObserver' in window)||reduce){els.forEach(e=>e.classList.add('in'));return}
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 els.forEach((e,i)=>{e.style.setProperty('--d',(i%4)*.07+'s');io.observe(e)});
 setTimeout(()=>els.forEach(e=>e.classList.add('in')),4000);
})();
