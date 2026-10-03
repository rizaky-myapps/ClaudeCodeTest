const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const bg=$('.burger');if(bg)bg.onclick=()=>$('nav').classList.toggle('open');
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const mail=v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const tel=v=>/^(\+33|0)[1-9]([ .-]?\d{2}){4}$/.test(v.trim());
/* ---------- abonnements ---------- */
const PLANS={libre:{n:'Libre',m:29,y:290,l:['Accès salle 6h – 23h','Vestiaires et douches','Sans engagement']},complet:{n:'Complet',m:39,y:390,l:['Salle + tous les cours','1 bilan avec un coach','Engagement 6 mois (mensuel)']},duo:{n:'Duo',m:65,y:650,l:['2 abonnements Complet','Invités le week-end','Engagement 6 mois (mensuel)']}};
let per=ld('rouille_per','m');
const pl=$('#plans');
if(pl){
 const draw=()=>{pl.innerHTML=Object.entries(PLANS).map(([k,p])=>`<div class="p${k==='complet'?' star':''}"><h3>${p.n}</h3><div class="pr">${per==='m'?p.m:p.y}€<small> /${per==='m'?'mois':'an'}</small></div>${per==='y'?`<small style="margin-top:-6px;margin-bottom:6px;display:block">soit ${(p.y/12).toFixed(1).replace('.',',')} €/mois — 2 mois offerts</small>`:''}<ul>${p.l.map(x=>`<li>${x}</li>`).join('')}</ul><a class="b" href="inscription.html?plan=${k}&per=${per}"><span>Choisir</span></a></div>`).join('');$$('#tg button').forEach(b=>b.classList.toggle('on',b.dataset.p===per))};
 $('#tg').onclick=e=>{const b=e.target.closest('button');if(!b)return;per=b.dataset.p;sv('rouille_per',per);draw()};draw();
}
/* ---------- inscription ---------- */
const inf=$('#inscr');
if(inf){
 const q=new URLSearchParams(location.search);const sel=inf.plan,pe=inf.per;
 sel.innerHTML=Object.entries(PLANS).map(([k,p])=>`<option value="${k}">${p.n}</option>`).join('');
 if(PLANS[q.get('plan')])sel.value=q.get('plan');if(q.get('per')==='y')pe.value='y';
 const recap=()=>{const p=PLANS[sel.value],pr=pe.value==='m'?p.m:p.y;$('#recap').innerHTML=`<b>${p.n}</b> — ${pr} € ${pe.value==='m'?'par mois':'par an'}<br><small>Frais d'inscription : 0 € · Premier prélèvement à la date de début</small>`};
 sel.onchange=pe.onchange=recap;recap();
 const d=new Date();inf.start.min=new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);inf.start.value=inf.start.min;
 const V={nom:v=>v.trim().length>1||'Indiquez votre nom.',prenom:v=>v.trim().length>1||'Indiquez votre prénom.',email:v=>mail(v)||'E-mail invalide.',tel:v=>tel(v)||'Téléphone invalide (ex. 06 12 34 56 78).',naiss:v=>{if(!v)return'Date requise.';const a=(Date.now()-new Date(v))/31557600000;return a>=16||'Inscription réservée aux 16 ans et plus.'},cgv:(v,e)=>e.checked||'Vous devez accepter le règlement.'};
 inf.onsubmit=e=>{e.preventDefault();let ok=true;for(const k in V){const el=inf.elements[k],r=V[k](el.value,el),er=$('[data-e='+k+']');er.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!ok)return;const m={no:'NA-'+Math.floor(10000+Math.random()*89999),nom:inf.prenom.value+' '+inf.nom.value,email:inf.email.value,plan:sel.value,per:pe.value,start:inf.start.value};sv('rouille_member',m);
  inf.hidden=true;$('#recap').hidden=true;const p=PLANS[m.plan];$('#done').hidden=false;$('#done').innerHTML=`<p>Bienvenue ${inf.prenom.value} !</p><div class="badge">${m.no}</div><p>Abonnement <b>${p.n}</b> à partir du ${new Date(m.start+'T12:00').toLocaleDateString('fr-FR')}.</p><p style="margin-top:12px;color:var(--m);font-size:.9rem">Présentez ce numéro à l'accueil pour retirer votre badge. (Démonstration : aucun paiement ni e-mail réel.)</p><p style="margin-top:18px"><a class="b" href="planning.html"><span>Réserver un cours</span></a></p>`;scrollTo({top:0,behavior:'smooth'})};
}
/* ---------- planning ---------- */
const JOURS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];
const CL=[
 [0,'07:00','Cross',14,'Léa'],[0,'12:30','HIIT 30',16,'Léa'],[0,'18:30','Force',12,'Karim'],[0,'19:45','Cardio',20,'Thomas'],
 [1,'07:00','Mobilité',16,'Léa'],[1,'12:30','Gainage',16,'Thomas'],[1,'18:30','Cross',14,'Léa'],[1,'19:45','Boxe',14,'Thomas'],
 [2,'07:00','Cross',14,'Karim'],[2,'12:30','HIIT 30',16,'Léa'],[2,'18:30','Force',12,'Karim'],[2,'19:45','Cardio',20,'Thomas'],
 [3,'07:00','Mobilité',16,'Léa'],[3,'12:30','Gainage',16,'Thomas'],[3,'18:30','Cross',14,'Léa'],[3,'19:45','Boxe',14,'Thomas'],
 [4,'07:00','Cross',14,'Karim'],[4,'12:30','HIIT 30',16,'Léa'],[4,'18:30','Haltéro',10,'Karim'],[4,'19:45','Cardio',20,'Thomas']
].map((c,i)=>({id:'c'+i,d:c[0],t:c[1],n:c[2],cap:c[3],by:c[4],pre:(i*7)%c[3]>c[3]-4?c[3]-(i%3===0?0:1):(i*5)%(c[3]-5)+3}));
const dayEl=$('#days');
if(dayEl){
 let type='Tous',coach='Tous';const bk=()=>ld('rouille_book',[]);
 const tf=$('#tf'),cf=$('#cf');
 tf.innerHTML=['Tous',...new Set(CL.map(c=>c.n))].map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 cf.innerHTML=['Tous',...new Set(CL.map(c=>c.by))].map(c=>`<option>${c==='Tous'?'Tous les coachs':c}</option>`).join('');
 const dow=(new Date().getDay()+6)%7;
 const draw=()=>{
  const b=bk();
  dayEl.innerHTML=JOURS.map((j,d)=>`<div class="day${d===dow?' today':''}"><h3>${j}</h3>${CL.filter(c=>c.d===d&&(type==='Tous'||c.n===type)&&(coach==='Tous'||c.by===coach)).map(c=>{const mine=b.some(x=>x.id===c.id),left=c.cap-c.pre-(mine?1:0),full=left<=0&&!mine;
   return `<div class="cl"><time>${c.t.replace(':','h')}</time><b>${c.n}</b><small>avec ${c.by} · 50 min</small><div class="bar"><i style="width:${Math.min(100,(c.pre+(mine?1:0))/c.cap*100)}%"></i></div><small>${full?'Complet':left+' place'+(left>1?'s':'')+' restante'+(left>1?'s':'')}</small><p style="margin-top:8px"><button data-id="${c.id}" class="${mine?'me':''}" ${full?'disabled':''}>${mine?'Réservé ✓ · annuler':full?'Complet':'Réserver'}</button></p></div>`}).join('')||'<p style="color:var(--m);font-size:.9rem">Aucun cours.</p>'}</div>`).join('');
  const mine=b.map(x=>({...x,c:CL.find(c=>c.id===x.id)})).filter(x=>x.c).sort((a,b)=>a.c.d-b.c.d||a.c.t.localeCompare(b.c.t));
  $('#mine').innerHTML=mine.length?mine.map(x=>`<div class="it"><span><b>${JOURS[x.c.d]} ${x.c.t.replace(':','h')}</b> · ${x.c.n} avec ${x.c.by}</span><button data-id="${x.id}">Annuler</button></div>`).join(''):'<p style="color:var(--m)">Aucune réservation. Choisissez un cours ci-dessus.</p>';
 };
 tf.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',tf).forEach(x=>x.classList.remove('on'));b.classList.add('on');type=b.textContent;draw()};
 cf.onchange=()=>{coach=cf.value.startsWith('Tous')?'Tous':cf.value;draw()};
 const dlg=$('#dlg');let pend=null;
 const toggle=id=>{let b=bk();if(b.some(x=>x.id===id)){sv('rouille_book',b.filter(x=>x.id!==id));return draw()}
  const c=CL.find(x=>x.id===id),clash=b.find(x=>{const o=CL.find(y=>y.id===x.id);return o&&o.d===c.d&&o.t===c.t});
  if(clash){alert('Vous avez déjà un cours à cet horaire.');return}
  const who=ld('rouille_who',null);if(!who){pend=id;dlg.showModal();return}
  b.push({id,who:who.email});sv('rouille_book',b);draw()};
 dayEl.onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled)toggle(b.dataset.id)};
 $('#mine').onclick=e=>{const b=e.target.closest('button');if(b)toggle(b.dataset.id)};
 $('#who').onsubmit=e=>{e.preventDefault();const f=e.target,n=f.n.value.trim(),m=f.m.value.trim();$('[data-e=n]').textContent=n.length>1?'':'Nom requis.';$('[data-e=m]').textContent=mail(m)?'':'E-mail invalide.';if(n.length<2||!mail(m))return;sv('rouille_who',{n,email:m});dlg.close();toggle(pend)};
 $('#cancel').onclick=()=>dlg.close();
 draw();
}
/* ---------- essai ---------- */
const ef=$('#essai');
if(ef){
 const d=new Date();ef.date.min=new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
 ef.onsubmit=e=>{e.preventDefault();const V={nom:v=>v.trim().length>1||'Nom requis.',email:v=>mail(v)||'E-mail invalide.',tel:v=>tel(v)||'Téléphone invalide.',date:v=>!!v||'Choisissez une date.',cgv:(v,e)=>e.checked||'Case à cocher.'};let ok=true;
  for(const k in V){const el=ef.elements[k],r=V[k](el.value,el),er=$('[data-e='+k+']');er.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!ok)return;ef.hidden=true;const o=$('#ok');o.hidden=false;o.innerHTML=`<div class="badge">Séance offerte confirmée</div><p>${ef.nom.value}, on vous attend le ${new Date(ef.date.value+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})} à ${ef.heure.value}. Apportez une serviette et des baskets propres.</p>`};
}
