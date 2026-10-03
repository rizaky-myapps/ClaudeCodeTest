/* Animations partagées : transition entre pages, révélation au scroll, ondulation des boutons */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const de=document.documentElement;
 /* --- transition de sortie entre deux pages --- */
 addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('fx-out')});
 document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  if(a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
  const u=new URL(a.href,location.href);
  if(u.origin!==location.origin)return;
  if(u.pathname===location.pathname&&u.search===location.search){ // ancre sur la même page : défilement doux
   if(u.hash){const t=document.getElementById(decodeURIComponent(u.hash.slice(1)));if(t){e.preventDefault();t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});history.replaceState(null,'',u.hash)}}
   return;
  }
  if(reduce)return;
  e.preventDefault();document.body.classList.add('fx-out');
  setTimeout(()=>{location.href=a.href},260);
 });
 /* --- ondulation au clic --- */
 const RIP='button,.btn,.b,.add,a.cart';
 document.addEventListener('pointerdown',e=>{
  if(reduce)return;const el=e.target.closest&&e.target.closest(RIP);
  if(!el||el.disabled)return;
  if(getComputedStyle(el).position!=='static'&&!el.classList.contains('fx-rip'))return;
  el.classList.add('fx-rip');
  const r=el.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,w=document.createElement('span');
  w.className='fx-wave';w.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
  el.appendChild(w);setTimeout(()=>w.remove(),650);
 },{passive:true});
 /* --- révélation au défilement --- */
 const SEL='section h2,section .lead,.page-h>.w>*,.ph>.w>*,.ph-head>*,.card,.p,.c,.pack,.post,.line,.cl,.ph,.plat,.gal>*,.infos>*,.cols>*,.about>*,.prod>*,.lay>*,.est>*,.cgrid>*,.chiffres>*,.facts>*,.art,.garanties,.conseil>*,.mason>*,.coachs>*,.ardoise,.quote,.res-item,.it,.req,.ticket';
 if(reduce||!('IntersectionObserver'in window))return;
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
 const seen=new WeakSet();
 function scan(root){
  const list=[...(root.matches&&root.matches(SEL)?[root]:[]),...root.querySelectorAll(SEL)];
  let i=0;
  list.forEach(el=>{
   if(seen.has(el)||el.closest('.fx-r:not(.in)')&&el.parentElement.closest('.fx-r:not(.in)'))return;
   if(el.closest('.lb,dialog,#toast,header,.top'))return;
   seen.add(el);
   const r=el.getBoundingClientRect();
   el.style.setProperty('--fx-d',(Math.min(i++,8)*.07)+'s');
   el.classList.add('fx-r');
   requestAnimationFrame(()=>io.observe(el));
  });
 }
 const start=()=>{scan(document.body);
  let t;new MutationObserver(ms=>{clearTimeout(t);t=setTimeout(()=>ms.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&scan(n))),20)}).observe(document.body,{childList:true,subtree:true})};
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
