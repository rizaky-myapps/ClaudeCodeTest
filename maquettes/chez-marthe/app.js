const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const JOURS=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
/* horaires : services par jour (0=dimanche) */
const H={0:[],1:[],2:[['12:00','14:00'],['19:00','22:00']],3:[['12:00','14:00'],['19:00','22:00']],4:[['12:00','14:00'],['19:00','22:00']],5:[['12:00','14:00'],['19:00','22:30']],6:[['19:00','22:30']]};
const mins=t=>{const[a,b]=t.split(':');return+a*60+ +b};
function openNow(){const n=new Date(),m=n.getHours()*60+n.getMinutes();return H[n.getDay()].some(([a,b])=>m>=mins(a)&&m<mins(b))}
const badge=$('#open');if(badge){const o=openNow();badge.classList.toggle('on',o);badge.textContent=o?'Ouvert maintenant':'Fermé actuellement'}
const hrow=$('#hours tr[data-d="'+new Date().getDay()+'"]');if(hrow)hrow.classList.add('today');
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
/* carte */
const CARTE=[
 {c:'Entrées',n:'Saucisson chaud, pommes à l\'huile',d:'Saucisson de Lyon pistaché, pommes tièdes',p:11},
 {c:'Entrées',n:'Cervelle de canut',d:'Fromage blanc, ciboulette, échalote, huile de noix',p:8,v:1},
 {c:'Entrées',n:'Salade lyonnaise',d:'Frisée, lardons, croûtons, œuf poché',p:12},
 {c:'Entrées',n:'Soupe à l\'oignon gratinée',d:'Comté 24 mois, croûtons',p:9,v:1},
 {c:'Plats',n:'Quenelle de brochet, sauce Nantua',d:'Gratinée, riz pilaf',p:21},
 {c:'Plats',n:'Tablier de sapeur',d:'Panure dorée, sauce gribiche, pommes vapeur',p:18},
 {c:'Plats',n:'Andouillette AAAAA',d:'Moutarde à l\'ancienne, gratin dauphinois',p:19},
 {c:'Plats',n:'Poulet de Bresse aux morilles',d:'Crème, riz pilaf',p:27},
 {c:'Plats',n:'Gratin de cardons',d:'Cardons du Lyonnais, moelle, chapelure',p:16,v:1},
 {c:'Fromages & desserts',n:'Saint-Marcellin rôti',d:'Salade verte, noix',p:9,v:1},
 {c:'Fromages & desserts',n:'Tarte aux pralines roses',d:'Crème fraîche d\'Isigny',p:8,v:1},
 {c:'Fromages & desserts',n:'Île flottante',d:'Crème anglaise, caramel',p:7,v:1},
 {c:'Fromages & desserts',n:'Bugnes lyonnaises',d:'Sucre glace, par 6',p:7,v:1},
 {c:'Boissons',n:'Pot de Beaujolais 46 cl',d:'Rouge ou blanc',p:13,v:1},
 {c:'Boissons',n:'Côtes du Rhône, bouteille',d:'Domaine de la Fontaine',p:26,v:1},
 {c:'Boissons',n:'Eau, carafe',d:'',p:0,v:1}
];
const list=$('#carte');
if(list){
 const cats=['Tout',...new Set(CARTE.map(x=>x.c))];let cat='Tout';
 const tabs=$('#tabs'),q=$('#q'),veg=$('#veg');
 const draw=()=>{
  const t=q.value.toLowerCase();let last='',h='';
  const items=CARTE.filter(x=>(cat==='Tout'||x.c===cat)&&(!veg.checked||x.v)&&(x.n+x.d).toLowerCase().includes(t));
  items.forEach(x=>{if(cat==='Tout'&&x.c!==last){h+=`<h3>${x.c}</h3>`;last=x.c}
   h+=`<div class="plat"><div>${x.n}${x.v?'<span class="v">végétarien</span>':''}${x.d?`<em>${x.d}</em>`:''}</div><span class="d"></span><b>${x.p?x.p+' €':'offerte'}</b></div>`});
  list.innerHTML=h||'<p class="msg">Aucun plat ne correspond à votre recherche.</p>';
 };
 tabs.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 tabs.onclick=e=>{if(e.target.tagName!=='BUTTON')return;$$('button',tabs).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');cat=e.target.textContent;draw()};
 q.oninput=veg.onchange=draw;draw();
}
/* ardoise du jour (accueil) */
const ard=$('#ardoise-jour');
if(ard){
 const A=[['Dimanche',null],['Lundi',null],
  ['Mardi',[['Salade de lentilles tièdes','lard fumé, œuf mollet',9],['Quenelle de brochet','sauce Nantua, riz pilaf',21],['Tarte aux pralines roses','crème fraîche',8]]],
  ['Mercredi',[['Velouté de potimarron','châtaignes grillées',9],['Tablier de sapeur','sauce gribiche',18],['Île flottante','caramel',7]]],
  ['Jeudi',[['Cervelle de canut','toasts de pain de campagne',8],['Gratin de cardons','moelle, chapelure',16],['Bugnes','sucre glace',7]]],
  ['Vendredi',[['Salade lyonnaise','œuf poché',12],['Quenelle de brochet','sauce Nantua',21],['Saint-Marcellin rôti','salade',9]]],
  ['Samedi',[['Soupe à l\'oignon','comté gratiné',9],['Poulet de Bresse','morilles, riz pilaf',27],['Tarte aux pralines','crème fraîche',8]]]];
 let d=new Date(),i=d.getDay();
 if(!A[i][1]){const next=(i===0?2:2);i=next;var closed=true}
 const[jour,pl]=A[i];
 ard.innerHTML=`<h3>${closed?'Réouverture mardi':jour}</h3>`+pl.map(([n,e,p])=>`<div class="plat"><div>${n}<em>${e}</em></div><span class="d"></span>${p} €</div>`).join('')+'<p style="text-align:center;margin-top:12px;color:#f4d98a">Formule midi : plat + dessert 19 €</p>'+(closed?'<p style="text-align:center;font-size:.85rem;opacity:.7">Nous sommes fermés le dimanche et le lundi.</p>':'');
}
/* stockage */
const KEY='marthe_res';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
const save=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
/* réservation */
const rf=$('#resa');
if(rf){
 const dt=rf.date,tel=rf.tel;const today=new Date();const iso=d=>d.toISOString().slice(0,10);
 const lt=new Date(today.getTime()-today.getTimezoneOffset()*60000);dt.min=iso(lt);
 const mx=new Date(lt);mx.setMonth(mx.getMonth()+3);dt.max=iso(mx);
 let slot='';const slotsEl=$('#slots'),info=$('#slotinfo');
 const taken=(date,t)=>{let h=0;for(const c of date+t)h=(h*31+c.charCodeAt(0))%97;return h%5===0}; // créneaux « complets » simulés
 const mine=()=>load().map(r=>r.date+r.time);
 const drawSlots=()=>{
  slot='';slotsEl.innerHTML='';info.textContent='';
  if(!dt.value)return info.textContent='Choisissez d\'abord une date.';
  const day=new Date(dt.value+'T12:00').getDay(),svc=H[day];
  if(!svc.length)return info.innerHTML='<span class="msg no" style="display:block">Nous sommes fermés le dimanche et le lundi.</span>';
  const out=[];svc.forEach(([a,b])=>{for(let m=mins(a);m<=mins(b)-45;m+=30){const t=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');out.push(t)}});
  const now=new Date(),isToday=dt.value===iso(lt);
  slotsEl.innerHTML=out.map(t=>{const past=isToday&&mins(t)<=now.getHours()*60+now.getMinutes()+30;return `<button type="button" data-t="${t}" ${taken(dt.value,t)||past?'disabled':''}>${t.replace(':','h')}</button>`}).join('');
 };
 dt.onchange=drawSlots;
 slotsEl.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;$$('button',slotsEl).forEach(x=>x.classList.remove('on'));b.classList.add('on');slot=b.dataset.t;$('[data-e=slot]').textContent=''};
 const V={nom:v=>v.trim().length>1||'Indiquez votre nom.',tel:v=>/^(\+33|0)[1-9]([ .-]?\d{2}){4}$/.test(v.trim())||'Numéro de téléphone invalide (ex. 06 12 34 56 78).',email:v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)||'Adresse e-mail invalide.',date:v=>!!v||'Choisissez une date.'};
 rf.onsubmit=e=>{
  e.preventDefault();let ok=true;
  for(const k in V){const r=V[k](rf[k].value),el=$('[data-e='+k+']');el.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!slot){$('[data-e=slot]').textContent='Choisissez un horaire.';ok=false}
  if(!ok)return;
  if(mine().includes(dt.value+slot)){$('[data-e=slot]').textContent='Vous avez déjà une réservation sur ce créneau.';return}
  const r={ref:'MR-'+Math.random().toString(36).slice(2,6).toUpperCase(),nom:rf.nom.value.trim(),date:dt.value,time:slot,pers:rf.pers.value,note:rf.note.value.trim()};
  const all=load();all.push(r);save(all);rf.hidden=true;showTicket(r);drawMine();window.scrollTo({top:0,behavior:'smooth'});
 };
 const fmt=d=>new Date(d+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
 function showTicket(r){const t=$('#ticket');t.hidden=false;t.innerHTML=`<div class="ticket"><p>Réservation confirmée</p><b class="ref">${r.ref}</b><p style="margin-top:10px">${r.nom} · ${r.pers} pers.<br>${fmt(r.date)} à ${r.time.replace(':','h')}</p><p style="margin-top:14px;font-size:.88rem;opacity:.75">Un SMS de confirmation vous serait envoyé sur un site réel. Au-delà de 15 minutes de retard, la table peut être remise en jeu.</p><p style="margin-top:16px"><button class="btn w2" id="again" type="button">Nouvelle réservation</button></p></div>`;$('#again').onclick=()=>{t.hidden=true;rf.hidden=false;rf.reset();drawSlots()}}
 function drawMine(){
  const box=$('#mine'),all=load().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  box.innerHTML=all.length?all.map(r=>`<div class="res-item"><span><b>${r.ref}</b> · ${fmt(r.date)} à ${r.time.replace(':','h')} · ${r.pers} pers.</span><button data-r="${r.ref}">Annuler</button></div>`).join(''):'<p style="opacity:.7">Aucune réservation enregistrée sur cet appareil.</p>';
 }
 $('#mine').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(confirm('Annuler la réservation '+b.dataset.r+' ?')){save(load().filter(r=>r.ref!==b.dataset.r));drawMine()}};
 drawMine();drawSlots();
}
/* contact */
const cf=$('#contactf');
if(cf)cf.onsubmit=e=>{e.preventDefault();let ok=true;
 const V={nom:v=>v.trim().length>1||'Indiquez votre nom.',email:v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)||'Adresse e-mail invalide.',message:v=>v.trim().length>9||'Votre message est trop court.'};
 for(const k in V){const r=V[k](cf[k].value),el=$('[data-e='+k+']',cf);el.textContent=r===true?'':r;if(r!==true)ok=false}
 if(!ok)return;cf.hidden=true;$('#cok').hidden=false};
