const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
const toast=m=>{let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2200)};
const col=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;return `hsl(${h} 85% 62%)`};
const sk=n=>`<span class="sk" style="background:${col(n)}">${esc(n[0].toUpperCase())}</span>`;
const NAMES=['PixelRenard','Ombrelune','KayoTheBold','Zéphyrion','MiaCraft','Brasero42','Nox_Alba','TartineQuest','LoupDeCendre','Vanille89','Aeris','GrosBill','Fennec_','CapitaineBrume','Lutin_Rouge','Mordoré','SirChoco','Tempête','Nébuleuse','Ragnarok_FR','Pomme_Verte','Cobalt','Yuki_Neko','Glaçon','Archimède','Soleil_Noir','Dragonnet','Mistral','Biscotte','Quasar'];
/* ---------- état du serveur (simulé) ---------- */
const MAX=120;let online=64+Math.floor(Math.random()*30);
const tick=()=>{online=Math.max(30,Math.min(MAX-4,online+Math.floor(Math.random()*7)-3))};
const pn=$('#pn');
function paint(){if(pn){$('#pn').textContent=online;$('#pb').style.width=(online/MAX*100)+'%';const pg=$('#ping');if(pg)pg.textContent=(18+Math.floor(Math.random()*14))+' ms'}}
if(pn){paint();setInterval(()=>{tick();paint();pl()},3500)}
function pl(){const el=$('#plist');if(!el)return;const s=NAMES.slice().sort(()=>Math.random()-.5).slice(0,12);el.innerHTML=s.map(n=>`<span class="pl">${sk(n)}${esc(n)}</span>`).join('')}
pl();
const cp=$('#copy');if(cp)cp.onclick=async()=>{try{await navigator.clipboard.writeText('play.cendrelune.example')}catch(e){}toast('Adresse copiée ! Collez-la dans votre jeu.')};
/* ---------- classement ---------- */
const lb=$('#lb');
if(lb){const PL=NAMES.map((n,i)=>{const r=(i*7919+13)%97;return{n,lvl:12+(r*3+i*5)%88,h:40+(r*29+i*11)%1900,k:(r*53+i*17)%1400,m:(r*1777+i*9181)%250000,j:'202'+(4+i%2)+'-'+String(1+i%12).padStart(2,'0')+'-'+String(1+(i*3)%27).padStart(2,'0')}});
 let key='lvl',asc=false,q='';
 const draw=()=>{const r=PL.filter(p=>p.n.toLowerCase().includes(q)).sort((a,b)=>(a[key]-b[key])*(asc?1:-1));
  $$('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
  lb.innerHTML=`<table><thead><tr><th>#</th><th>Joueur</th>${[['lvl','Niveau'],['h','Heures'],['k','Victoires'],['m','Pièces']].map(([k,l])=>`<th data-k="${k}" class="${key===k?'s':''}">${l}${key===k?(asc?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody>${r.map((p,i)=>`<tr data-n="${esc(p.n)}"><td><span class="rk ${i<3&&!q?'t'+(i?i+1:''):''}">${i+1}</span></td><td><div class="pn">${sk(p.n)}${esc(p.n)}</div></td><td>${p.lvl}</td><td>${p.h} h</td><td>${p.k}</td><td>${p.m.toLocaleString('fr-FR')}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--mut)">Aucun joueur trouvé.</td></tr>'}</tbody></table>`;
  $$('th[data-k]').forEach(h=>h.onclick=()=>{if(key===h.dataset.k)asc=!asc;else{key=h.dataset.k;asc=false}draw()});
  $$('tbody tr[data-n]').forEach(t=>t.onclick=()=>prof(PL.find(p=>p.n===t.dataset.n)))};
 $$('.tabs button').forEach(b=>b.onclick=()=>{key=b.dataset.k;asc=false;draw()});$('#q').oninput=e=>{q=e.target.value.toLowerCase();draw()};
 const m=$('#modal');function prof(p){$('#pc').innerHTML=`<div style="display:flex;gap:16px;align-items:center;margin-bottom:18px"><span class="sk" style="background:${col(p.n)};width:64px;height:64px;font-size:1.6rem;border-radius:8px">${esc(p.n[0].toUpperCase())}</span><div><h2 style="font-size:1rem;margin:0">${esc(p.n)}</h2><small style="color:var(--mut)">Inscrit depuis le ${new Date(p.j+'T12:00').toLocaleDateString('fr-FR')}</small></div></div>${[['Niveau',p.lvl,p.lvl],['Heures de jeu',p.h+' h',p.h/20],['Victoires',p.k,p.k/14],['Pièces',p.m.toLocaleString('fr-FR'),p.m/2500]].map(([l,v,pc])=>`<div style="margin:12px 0"><div style="display:flex;justify-content:space-between"><span style="color:var(--mut)">${l}</span><b>${v}</b></div><div class="bar"><i style="width:${Math.min(100,pc)}%"></i></div></div>`).join('')}<div style="margin-top:18px;text-align:right"><button class="btn o s" id="pcl">Fermer</button></div>`;m.classList.add('on');$('#pcl').onclick=()=>m.classList.remove('on')}
 m.onclick=e=>{if(e.target===m)m.classList.remove('on')};draw()}
/* ---------- boutique ---------- */
const RK=[{id:'av',n:'AVENTURIER',p:4.99,l:['Préfixe [Aventurier] en jeu','2 maisons','Couleur de pseudo','Coffre de départ']},{id:'he',n:'HÉROS',p:9.99,pop:1,l:['Tout Aventurier','5 maisons','Familier exclusif','Accès aux mini-jeux VIP','File d\'attente prioritaire']},{id:'le',n:'LÉGENDE',p:19.99,l:['Tout Héros','10 maisons','Cosmétiques animés','Salon privé sur Discord','Place réservée garantie']}];
const cart=()=>ld('cendre_cart',[]),eur=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const sh=$('#shop');
if(sh){sh.innerHTML=RK.map(r=>`<div class="rank ${r.pop?'pop':''}">${r.pop?'<span class="ribbon">Populaire</span>':''}<h3>${r.n}</h3><div class="pr">${eur(r.p)}<small> /mois</small></div><ul>${r.l.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn ${r.pop?'':'c'}" data-a="${r.id}">Ajouter au panier</button></div>`).join('');
 const refresh=()=>{const c=cart();$('#cn').textContent=c.length;$('#cartbtn').hidden=!c.length};refresh();
 sh.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const c=cart();if(c.includes(b.dataset.a)){toast('Déjà dans le panier');return}c.push(b.dataset.a);sv('cendre_cart',c);refresh();toast(RK.find(r=>r.id===b.dataset.a).n+' ajouté')};
 const m=$('#modal');const draw=()=>{const c=cart().map(i=>RK.find(r=>r.id===i));$('#items').innerHTML=c.map(r=>`<div class="ci"><span>${r.n} <small style="color:var(--mut)">1 mois</small></span><span>${eur(r.p)} <button data-x="${r.id}" aria-label="Retirer">×</button></span></div>`).join('')||'<p style="color:var(--mut)">Votre panier est vide.</p>';$('#tt').textContent=eur(c.reduce((a,r)=>a+r.p,0));$$('[data-x]').forEach(b=>b.onclick=()=>{sv('cendre_cart',cart().filter(i=>i!==b.dataset.x));refresh();draw()});$('#ck').disabled=!c.length};
 $('#cartbtn').onclick=()=>{draw();$('#step1').hidden=false;$('#done').hidden=true;m.classList.add('on')};$('#mx').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};
 $('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,p=f.pseudo.value.trim(),em=f.email.value.trim();let ok=true;$('[data-e=pseudo]').textContent=/^[A-Za-z0-9_]{3,16}$/.test(p)?'':(ok=false,'Pseudo de 3 à 16 caractères (lettres, chiffres, _).');$('[data-e=email]').textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':(ok=false,'Adresse e-mail invalide.');$('[data-e=cgv]').textContent=f.cgv.checked?'':(ok=false,'Veuillez accepter les conditions.');if(!ok||!cart().length)return;
  const code='CL-'+Math.random().toString(36).slice(2,8).toUpperCase(),o=ld('cendre_orders',[]);o.unshift({code,p,items:cart(),t:Date.now()});sv('cendre_orders',o);sv('cendre_cart',[]);refresh();$('#step1').hidden=true;$('#done').hidden=false;$('#dc').textContent=code;$('#dp').textContent=p}}
/* ---------- statut ---------- */
const gr=$('#graph');
if(gr){const data=Array.from({length:24},(_,i)=>Math.round(55+30*Math.sin(i/3.2)+Math.random()*10));
 const draw=()=>{const W=720,H=240,P={l:40,r:10,t:10,b:26},max=MAX,x=i=>P.l+i*(W-P.l-P.r)/(data.length-1),y=v=>H-P.b-v/max*(H-P.t-P.b);const pts=data.map((v,i)=>[x(i),y(v)]),path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  gr.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${[0,30,60,90,120].map(v=>`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${P.l-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="var(--mut)">${v}</text>`).join('')}${[0,6,12,18,23].map(i=>`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mut)">${i===23?'maint.':'−'+(23-i)+' h'}</text>`).join('')}<path d="${path} L${x(23)} ${H-P.b} L${P.l} ${H-P.b}Z" fill="rgba(53,224,255,.14)"/><path d="${path}" fill="none" stroke="var(--cy)" stroke-width="3" stroke-linejoin="round"/><circle cx="${pts[23][0]}" cy="${pts[23][1]}" r="5" fill="var(--pink)"/></svg>`};
 draw();setInterval(()=>{tick();data.shift();data.push(online);draw();paint()},3500);
 $('#pn').textContent=online;$('#pb').style.width=(online/MAX*100)+'%'}
/* ---------- règlement ---------- */
const ag=$('#agree');
if(ag){ag.checked=ld('cendre_rules',false);ag.onchange=()=>{sv('cendre_rules',ag.checked);toast(ag.checked?'Merci, règlement accepté !':'Acceptation retirée')}}
