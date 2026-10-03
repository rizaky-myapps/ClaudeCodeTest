const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const bg=$('.burger');if(bg)bg.onclick=()=>$('nav').classList.toggle('open');
const PH=[
 {t:'Mer de nuages, Alpes',c:'Paysage',src:'img/brume.jpg',w:1400,h:933},
 {t:'Le bouquet, Saint-Émilion',c:'Mariage',src:'img/bouquet.jpg',w:1200,h:800},
 {t:'Portrait de Camille',c:'Portrait',src:'img/portrait-1.jpg',w:1000,h:1500},
 {t:'Lac de Braies',c:'Paysage',src:'img/lac.jpg',w:1400,h:933},
 {t:'Lâcher de ballons',c:'Mariage',src:'img/ballons.jpg',w:1400,h:935},
 {t:'Portrait en bord de lac',c:'Portrait',src:'img/portrait-3.jpg',w:1000,h:667},
 {t:'Café-atelier, Bordeaux',c:'Reportage',src:'img/cafe.jpg',w:1400,h:1050},
 {t:'Sentier en forêt',c:'Paysage',src:'img/foret.jpg',w:1400,h:932},
 {t:'Les alliances',c:'Mariage',src:'img/alliances.jpg',w:1200,h:801},
 {t:'Portrait de Marc',c:'Portrait',src:'img/portrait-2.jpg',w:1000,h:1500},
 {t:'Brume sur les collines',c:'Paysage',src:'img/collines.jpg',w:1400,h:834},
 {t:'Entraînement en plein air',c:'Reportage',src:'img/cordes.jpg',w:1200,h:802},
 {t:'Lumière de fin d\'été',c:'Portrait',src:'img/portrait-5.jpg',w:1000,h:1498},
 {t:'Prairie au coucher du soleil',c:'Paysage',src:'img/prairie.jpg',w:1400,h:934},
 {t:'La tablée',c:'Reportage',src:'img/tablee.jpg',w:1200,h:800},
 {t:'Portrait de Thomas',c:'Portrait',src:'img/portrait-4.jpg',w:1000,h:1500},
 {t:'Vallée alpine',c:'Paysage',src:'img/alpes.jpg',w:1400,h:933},
 {t:'Le cuisinier',c:'Reportage',src:'img/cuisinier.jpg',w:1200,h:1800},
 {t:'Plage au lever du jour',c:'Paysage',src:'img/plage.jpg',w:1400,h:931},
 {t:'La crête',c:'Paysage',src:'img/crete.jpg',w:1400,h:930}
];
const mason=$('#mason');let cur=[],idx=0;
function open(i){idx=i;const p=cur[i],lb=$('#lb');lb.classList.add('on');const im=$('img',lb);im.classList.remove('sw');void im.offsetWidth;im.src=p.src;im.alt=p.t;im.classList.add('sw');$('#cap').textContent=`${p.t} — ${p.c}  (${i+1}/${cur.length})`;document.body.style.overflow='hidden'}
function close(){$('#lb').classList.remove('on');document.body.style.overflow=''}
const step=d=>open((idx+d+cur.length)%cur.length);
function tile(p,i){return `<button class="ph" data-i="${i}" aria-label="Agrandir : ${p.t}"><div class="im"><img src="${p.src}" width="${p.w}" height="${p.h}" alt="${p.t}" loading="lazy"></div><span>${p.t}</span></button>`}
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
