/* Animations du site principal : transitions de page, héros, révélation, compteurs, boutons */
(()=>{
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 /* barre de progression + en-tête compact */
 const prog=document.createElement('div');prog.id='prog';document.body.appendChild(prog);
 const nav=$('.nav');
 const onScroll=()=>{const h=document.documentElement,m=h.scrollHeight-innerHeight;prog.style.transform=`scaleX(${m>0?scrollY/m:0})`;nav&&nav.classList.toggle('scrolled',scrollY>12)};
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 /* thème : petite rotation de l'icône */
 $$('.theme').forEach(b=>b.addEventListener('click',()=>{b.classList.remove('spin');void b.offsetWidth;b.classList.add('spin')}));
 /* transition entre pages */
 addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('pg-out')});
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduce)return;
  if(a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
  const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;
  if(u.pathname===location.pathname&&u.search===location.search){
   if(u.hash){const t=document.getElementById(decodeURIComponent(u.hash.slice(1)));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});history.replaceState(null,'',u.hash)}}
   return;
  }
  e.preventDefault();document.body.classList.add('pg-out');setTimeout(()=>{location.href=a.href},260);
 });
 /* ondulation au clic */
 document.addEventListener('pointerdown',e=>{
  const b=e.target.closest('.btn');if(!b||reduce)return;
  const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,w=document.createElement('span');
  w.className='wave';w.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
  b.appendChild(w);setTimeout(()=>w.remove(),650);
 },{passive:true});
 if(reduce)return;
 /* héros : titre mot par mot + halos qui suivent la souris */
 const hero=$('.hero');
 if(hero){
  const h1=$('h1',hero);let i=0;
  if(h1){
   const wrap=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return}const w=document.createElement('span');w.className='wd';const k=document.createElement('i');k.textContent=t;k.style.setProperty('--i',i++);w.appendChild(k);f.appendChild(w)});c.replaceWith(f)}
    else if(c.nodeType===1&&c.tagName!=='BR')wrap(c)})};
   wrap(h1);
  }
  const o1=document.createElement('div'),o2=document.createElement('div');o1.className='orb o1';o2.className='orb o2';hero.prepend(o1,o2);
  if(fine)addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);o1.style.translate=`${x*-50}px ${y*-40}px`;o2.style.translate=`${x*60}px ${y*40}px`},{passive:true});
 }
 /* compteurs */
 const counters=$$('.stats b').map(b=>{const m=b.textContent.match(/^(\d+)(.*)$/);return m?{b,n:+m[1],rest:m[2]}:null}).filter(Boolean);
 const count=c=>{const t0=performance.now(),d=1400;const step=t=>{const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,4);c.b.textContent=Math.round(c.n*e)+c.rest;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
 counters.forEach(c=>c.b.textContent='0'+c.rest);
 setTimeout(()=>counters.forEach(count),1000);
 /* révélation au défilement */
 const SEL='section .sec-head,.page-head>.wrap>*,.grid>.card,.grid>.work,.list>*,.faq details,.row2,.f>*,.contact-grid>*,.legal>*,footer .fgrid>*,section>.wrap>p,section>.wrap>.btn,.filters';
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const el=en.target;el.classList.add('rv-in');io.unobserve(el);setTimeout(()=>{el.classList.remove('rv','rv-in','l','r');el.style.removeProperty('--d')},1300)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
 const seen=new WeakSet();
 function scan(root){
  const groups=new Map();
  [...(root.matches&&root.matches(SEL)?[root]:[]),...$$(SEL,root)].forEach(el=>{
   if(seen.has(el)||el.closest('.hero,.nav'))return;seen.add(el);
   const p=el.parentElement,k=groups.get(p)||0;groups.set(p,k+1);
   el.style.setProperty('--d',Math.min(k,6)*.09+'s');
   if(el.closest('.contact-grid')&&el.parentElement.classList.contains('contact-grid'))el.classList.add(k?'r':'l');
   el.classList.add('rv');requestAnimationFrame(()=>io.observe(el));
  });
 }
 scan(document.body);
 /* contenu injecté (galerie) : même révélation */
 const g=$('#works'),h=$('#home-works');
 if(fine){
  /* boutons « magnétiques » */
  $$('.hero .btn,.btn.primary').forEach(b=>{if(b.closest('form,.menu'))return;
   b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.28}px`});
   b.addEventListener('pointerleave',()=>{b.style.translate=''})});
 }
})();
