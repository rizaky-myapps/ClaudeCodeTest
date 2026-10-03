const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const bg=$('.burger');if(bg)bg.onclick=()=>$('nav').classList.toggle('open');
const PH=[
 {t:'Mariage à Saint-Émilion',c:'Mariage',ar:'3/2',g:'radial-gradient(circle at 70% 35%,#f2c58b,#b4623a 40%,#2a1b22 85%)',o:'linear-gradient(0deg,rgba(0,0,0,.45),transparent 40%)'},
 {t:'Dune du Pilat, brume',c:'Paysage',ar:'3/2',g:'linear-gradient(180deg,#cfd6dc 0,#8a98a4 45%,#c9a97a 46%,#6b5239)',o:'radial-gradient(ellipse at 50% 100%,rgba(0,0,0,.4),transparent 70%)'},
 {t:'Portrait de Camille',c:'Portrait',ar:'4/5',g:'radial-gradient(circle at 50% 38%,#d9b595 0,#9c7458 22%,#3b2a22 55%,#14100e)',o:'linear-gradient(0deg,rgba(0,0,0,.5),transparent 50%)'},
 {t:'Forêt des Landes',c:'Paysage',ar:'4/5',g:'linear-gradient(170deg,#6f8a6a,#2c4630 55%,#101a13)',o:'repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 6px,transparent 6px 40px)'},
 {t:'Lumière de fin d\'été',c:'Portrait',ar:'1/1',g:'radial-gradient(circle at 50% 30%,#fff3dc,#d49a74 45%,#4a2c28)',o:'linear-gradient(0deg,rgba(0,0,0,.35),transparent 50%)'},
 {t:'Les mains de Louise',c:'Mariage',ar:'1/1',g:'radial-gradient(circle at 30% 60%,#e7e0d0,#a89c82 50%,#3a342a)',o:'linear-gradient(180deg,rgba(0,0,0,.25),transparent 40%)'},
 {t:'Bassin d\'Arcachon, 6 h',c:'Paysage',ar:'3/2',g:'linear-gradient(180deg,#f4b693 0,#e08a7c 30%,#5a6b87 55%,#27364d)',o:'linear-gradient(0deg,rgba(0,0,0,.4),transparent 45%)'},
 {t:'Atelier du tonnelier',c:'Reportage',ar:'4/5',g:'radial-gradient(circle at 60% 40%,#d8a35f,#7b4a24 45%,#1d130c)',o:'linear-gradient(90deg,rgba(0,0,0,.4),transparent 60%)'},
 {t:'Cérémonie laïque',c:'Mariage',ar:'3/2',g:'linear-gradient(180deg,#e9eef0,#aab8bd 50%,#57655f)',o:'radial-gradient(circle at 50% 55%,rgba(255,255,255,.25),transparent 50%)'},
 {t:'Boulangerie Dupin',c:'Reportage',ar:'3/2',g:'radial-gradient(circle at 40% 50%,#f1d9a8,#b5803f 45%,#33210f)',o:'linear-gradient(0deg,rgba(0,0,0,.4),transparent 50%)'},
 {t:'Autoportrait, miroir',c:'Portrait',ar:'4/5',g:'linear-gradient(135deg,#2c3340,#10131a 60%,#4a3a2a)',o:'radial-gradient(circle at 70% 25%,rgba(255,220,170,.35),transparent 40%)'},
 {t:'Vignes en octobre',c:'Paysage',ar:'3/2',g:'linear-gradient(180deg,#e7c27a 0,#c4783a 40%,#6e2f1f 60%,#2b1510)',o:'repeating-linear-gradient(100deg,rgba(0,0,0,.15) 0 4px,transparent 4px 30px)'}
];
const mason=$('#mason');let cur=[],idx=0;
function open(i){idx=i;const p=cur[i],lb=$('#lb');lb.classList.add('on');const b=$('.big',lb);b.style.setProperty('--g',p.g);b.style.setProperty('--o',p.o);b.style.setProperty('--ar',p.ar);$('#cap').textContent=`${p.t} — ${p.c}  (${i+1}/${cur.length})`;document.body.style.overflow='hidden'}
function close(){$('#lb').classList.remove('on');document.body.style.overflow=''}
const step=d=>open((idx+d+cur.length)%cur.length);
function tile(p,i){return `<button class="ph" data-i="${i}" aria-label="Agrandir : ${p.t}"><div class="im" style="--g:${p.g};--o:${p.o};aspect-ratio:${p.ar}"></div><span>${p.t}</span></button>`}
function draw(c,limit){cur=PH.filter(p=>c==='Toutes'||p.c===c).slice(0,limit||99);mason.innerHTML=cur.map(tile).join('')}
if(mason){
 const f=$('#filters');
 if(f){const cats=['Toutes',...new Set(PH.map(p=>p.c))];f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');f.onclick=e=>{if(e.target.tagName!=='BUTTON')return;$$('button',f).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');draw(e.target.textContent)}}
 draw('Toutes',mason.dataset.limit?+mason.dataset.limit:0);
 mason.onclick=e=>{const b=e.target.closest('.ph');if(b)open(+b.dataset.i)};
 $('#lb .x').onclick=close;$('#lb .pv').onclick=()=>step(-1);$('#lb .nx').onclick=()=>step(1);
 $('#lb').onclick=e=>{if(e.target.id==='lb')close()};
 addEventListener('keydown',e=>{if(!$('#lb').classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
}
/* estimateur de devis */
const est=$('#est');
if(est){
 const PR={portrait:{n:'Portrait',base:180,per:0,unit:'séance de 1 h',opts:{galerie:['Galerie privée 40 photos',60],tirages:['5 tirages 20×30',45]}},
  mariage:{n:'Mariage',base:1200,per:150,unit:'demi-journée + 150 € / heure supplémentaire',opts:{second:['Second photographe',350],album:['Album papier 30 pages',280],drone:['Prises de vue par drone',200]}},
  pro:{n:'Professionnel',base:350,per:90,unit:'demi-journée + 90 € / heure supplémentaire',opts:{produits:['Photos produits (20 articles)',220],equipe:['Portraits d\'équipe',150]}}};
 const type=est.type,extra=est.extra,km=est.km,opts=$('#opts');
 function calc(){
  const p=PR[type.value];$('#unit').textContent=p.unit;
  if(opts.dataset.t!==type.value){opts.dataset.t=type.value;opts.innerHTML=Object.entries(p.opts).map(([k,[l,pr]])=>`<label class="opt"><input type="checkbox" name="o_${k}" data-p="${pr}" data-l="${l}"> ${l} <span style="color:var(--mut)">+${pr} €</span></label>`).join('');$$('input',opts).forEach(i=>i.onchange=calc)}
  extra.disabled=!p.per;if(!p.per)extra.value=0;
  const lines=[[p.n,p.base]];
  if(p.per&&+extra.value)lines.push([`${extra.value} h supplémentaire(s)`,p.per*extra.value]);
  $$('input:checked',opts).forEach(i=>lines.push([i.dataset.l,+i.dataset.p]));
  const k=Math.max(0,+km.value||0),dep=Math.max(0,k-30)*0.6*2;if(dep>0)lines.push([`Déplacement (${k} km, au-delà de 30)`,Math.round(dep)]);
  const tot=lines.reduce((a,l)=>a+l[1],0);
  $('#lines').innerHTML=lines.map(l=>`<dt>${l[0]}</dt><dd>${l[1]} €</dd>`).join('');$('#tot').textContent=tot.toLocaleString('fr-FR')+' €';
  const sel=$$('input:checked',opts).map(i=>i.dataset.l).join(', ');
  $('#goto').href=`contact.html?type=${type.value}&est=${tot}&opts=${encodeURIComponent(sel)}`;
 }
 [type,extra,km].forEach(e=>e.oninput=calc);calc();
}
/* contact / demande de devis */
const KEY='voss_req';const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
const cf=$('#cf');
if(cf){
 const q=new URLSearchParams(location.search);
 if(q.get('type'))cf.type.value=q.get('type');
 if(q.get('est'))cf.message.value=`Bonjour, j'ai utilisé l'estimateur : ${q.get('est')} €${q.get('opts')?' ('+q.get('opts')+')':''}.\n\n`;
 const t=new Date();cf.date.min=new Date(t-t.getTimezoneOffset()*6e4).toISOString().slice(0,10);
 const V={nom:v=>v.trim().length>1||'Indiquez votre nom.',email:v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)||'Adresse e-mail invalide.',message:v=>v.trim().length>14||'Racontez-moi votre projet en quelques mots.'};
 const draw=()=>{const a=load();$('#reqs').innerHTML=a.length?a.map(r=>`<div class="req"><span>${r.type} ${r.date?'· '+new Date(r.date+'T12:00').toLocaleDateString('fr-FR'):''}</span><span style="color:var(--mut)">envoyée le ${r.sent}</span></div>`).join(''):'<p style="color:var(--mut)">Aucune demande envoyée depuis cet appareil.</p>'};
 cf.onsubmit=e=>{e.preventDefault();let ok=true;for(const k in V){const r=V[k](cf[k].value),el=$('[data-e='+k+']');el.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!ok)return;const a=load();a.unshift({type:cf.type.options[cf.type.selectedIndex].text,date:cf.date.value,sent:new Date().toLocaleDateString('fr-FR')});try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}
  cf.hidden=true;$('#ok').hidden=false;draw();scrollTo({top:0,behavior:'smooth'})};
 draw();
}
