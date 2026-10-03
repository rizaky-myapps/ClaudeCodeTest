const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const eur=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+' €';
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
/* ---------- catalogue ---------- */
const P=[
 {id:'monstera',n:'Monstera deliciosa',p:29,l:'Facile',c:'Grandes plantes',bg:'#dfe6cd',f:'#2f5a3b',s:'60 cm',lum:'Mi-ombre',eau:'1 fois par semaine',st:12,v:0,d:'La plante iconique aux feuilles découpées. Pousse vite, pardonne les oublis et dépollue l\'air. Livrée en pot de 19 cm avec tuteur en mousse.'},
 {id:'ficus-lyrata',n:'Ficus lyrata',p:49,l:'Moyen',c:'Grandes plantes',bg:'#e6dccb',f:'#3d6b3a',s:'90 cm',lum:'Lumière vive',eau:'Tous les 10 jours',st:5,v:0,d:'Le figuier lyre impressionne par ses grandes feuilles nervurées. Il aime la lumière et déteste les courants d\'air : ne le déplacez pas trop.'},
 {id:'strelitzia',n:'Strelitzia nicolai',p:59,l:'Moyen',c:'Grandes plantes',bg:'#dde6df',f:'#4a7a55',s:'110 cm',lum:'Lumière vive',eau:'Toutes les 2 semaines',st:0,v:0,d:'L\'oiseau de paradis géant, pour une ambiance tropicale. Un grand sujet qui demande de la place et du soleil.'},
 {id:'pothos',n:'Pothos doré',p:14,l:'Facile',c:'Suspensions',bg:'#f1dfc4',f:'#5d8a3e',s:'30 cm',lum:'Tolère l\'ombre',eau:'Tous les 10 jours',st:30,v:1,d:'Retombant ou grimpant, le pothos s\'adapte partout. L\'idéal pour une première plante ou un bureau sans fenêtre.'},
 {id:'tradescantia',n:'Tradescantia',p:12,l:'Facile',c:'Suspensions',bg:'#ead9de',f:'#7a4f7e',s:'25 cm',lum:'Lumière vive',eau:'1 fois par semaine',st:18,v:1,d:'Feuillage pourpre et argenté, croissance rapide. Bouturez-la pour en offrir à vos amis.'},
 {id:'string-of-pearls',n:'Senecio rowleyanus',p:16,l:'Moyen',c:'Suspensions',bg:'#dfe7dc',f:'#6c9a5a',s:'20 cm',lum:'Lumière vive',eau:'Toutes les 2 semaines',st:7,v:0,d:'Le collier de perles : des tiges garnies de billes vertes. Succulente, elle craint l\'excès d\'eau.'},
 {id:'sansevieria',n:'Sansevieria',p:19,l:'Facile',c:'Petites plantes',bg:'#d6e4dc',f:'#4a7a55',s:'40 cm',lum:'Tout type de lumière',eau:'Toutes les 3 semaines',st:22,v:0,d:'Presque indestructible. Elle purifie l\'air la nuit, ce qui en fait une compagne idéale pour la chambre.'},
 {id:'calathea',n:'Calathea orbifolia',p:24,l:'Exigeant',c:'Petites plantes',bg:'#e9e1d6',f:'#58845a',s:'45 cm',lum:'Mi-ombre',eau:'1 fois par semaine, eau non calcaire',st:3,v:0,d:'Large feuillage rayé d\'argent. Elle apprécie l\'air humide : brumisez-la ou placez-la dans la salle de bain.'},
 {id:'zamioculcas',n:'Zamioculcas',p:22,l:'Facile',c:'Petites plantes',bg:'#d9e3d4',f:'#2c5a3e',s:'50 cm',lum:'Tout type de lumière',eau:'Toutes les 3 semaines',st:14,v:0,d:'Feuilles brillantes, rhizomes qui stockent l\'eau. Elle se contente de très peu.'},
 {id:'pot-terracotta',n:'Cache-pot terracotta',p:15,l:'Pot',c:'Pots',bg:'#f0e3d4',pot:'#c8643c',s:'Ø 17 cm',lum:'—',eau:'—',st:40,v:0,d:'Terre cuite artisanale de l\'Anjou, non émaillée : elle laisse respirer les racines. Fond percé et soucoupe fournie.'},
 {id:'pot-gres',n:'Pot en grès crème',p:21,l:'Pot',c:'Pots',bg:'#ece7da',pot:'#e3d6b8',s:'Ø 21 cm',lum:'—',eau:'—',st:15,v:0,d:'Grès émaillé à la main, finition crème satinée. Parfait pour une plante de taille moyenne.'},
 {id:'pot-anthracite',n:'Pot anthracite',p:19,l:'Pot',c:'Pots',bg:'#dfe3dc',pot:'#3a4238',s:'Ø 19 cm',lum:'—',eau:'—',st:2,v:0,d:'Un pot sobre et graphique qui met le vert en valeur. Béton léger, très résistant.'}
];
const find=id=>P.find(x=>x.id===id);
function svg(x){
 if(x.pot)return `<svg viewBox="0 0 200 220"><path d="M50 90h100l-12 110H62z" fill="${x.pot}"/><rect x="42" y="80" width="116" height="18" rx="4" fill="${x.pot}" style="filter:brightness(.88)"/><ellipse cx="100" cy="90" rx="52" ry="6" fill="#3b2a1d" opacity=".6"/></svg>`;
 const k=[...x.id].reduce((a,c)=>a+c.charCodeAt(0),0)%3,f=x.f;
 const l=k===0?`<ellipse cx="70" cy="110" rx="26" ry="50" transform="rotate(-25 70 110)" fill="${f}"/><ellipse cx="132" cy="106" rx="26" ry="52" transform="rotate(22 132 106)" fill="${f}" opacity=".85"/><ellipse cx="100" cy="90" rx="22" ry="60" fill="${f}" opacity=".95"/>`
 :k===1?`<path d="M100 150C60 140 30 110 28 70c40 6 66 30 72 80z" fill="${f}"/><path d="M100 150c40-10 70-40 72-80-40 6-66 30-72 80z" fill="${f}" opacity=".8"/><path d="M100 150C94 110 96 70 100 40c8 30 8 70 0 110z" fill="${f}" opacity=".9"/>`
 :`<path d="M100 150C84 120 60 108 34 112c10 26 34 40 66 38z" fill="${f}"/><path d="M100 150c16-30 40-42 66-38-10 26-34 40-66 38z" fill="${f}" opacity=".85"/><path d="M100 150c-18-36-12-70 0-104 12 34 18 68 0 104z" fill="${f}" opacity=".95"/>`;
 return `<svg viewBox="0 0 200 220">${l}<path d="M64 150h72l-8 62H72z" fill="#c8643c"/><rect x="58" y="144" width="84" height="13" rx="3" fill="#b4552f"/></svg>`;
}
/* ---------- panier ---------- */
const cart=()=>ld('verdure_cart',[]);
function setCart(c){sv('verdure_cart',c);badge()}
function badge(){const n=cart().reduce((a,x)=>a+x.q,0);$$('.cart i').forEach(e=>e.textContent=n)}
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2000)}
function add(id,q=1){const x=find(id),c=cart(),l=c.find(i=>i.id===id),have=l?l.q:0;
 if(have+q>x.st){toast(x.st?`Stock limité : ${x.st} disponible(s)`:'Produit indisponible');return false}
 l?l.q+=q:c.push({id,q});setCart(c);toast(`${x.n} ajouté au panier`);return true}
badge();
const tt=(c)=>c.reduce((a,i)=>a+find(i.id).p*i.q,0);
const promo=()=>ld('verdure_promo',null);
function totals(){const c=cart(),sub=tt(c),pr=promo(),rem=pr?Math.round(sub*pr.pct)/100:0,after=sub-rem,ship=!c.length?0:after>=50?0:4.9;return{c,sub,rem,ship,total:after+ship,after}}
/* ---------- boutique ---------- */
const grid=$('#grid');
if(grid){
 const q=new URLSearchParams(location.search);let cat=q.get('c')||'Tout';
 const f=$('#f'),s=$('#s'),o=$('#o');
 const cats=['Tout',...new Set(P.map(x=>x.c))];
 f.innerHTML=cats.map(c=>`<button class="${c===cat?'on':''}">${c}</button>`).join('');
 const draw=()=>{
  const t=s.value.toLowerCase().trim();let r=P.filter(x=>(cat==='Tout'||x.c===cat)&&(x.n+x.d+x.c).toLowerCase().includes(t));
  const so=o.value;if(so==='p+')r.sort((a,b)=>a.p-b.p);if(so==='p-')r.sort((a,b)=>b.p-a.p);if(so==='az')r.sort((a,b)=>a.n.localeCompare(b.n));
  $('#count').textContent=r.length+' produit'+(r.length>1?'s':'');
  grid.innerHTML=r.map(x=>`<div class="card"><a class="im" href="produit.html?id=${x.id}" style="background:${x.bg}"><span class="lvl">${x.l}</span>${!x.st?'<span class="rup">Rupture</span>':x.st<5?'<span class="rup">Dernières pièces</span>':''}${svg(x)}</a><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${x.c} · ${x.s}</small><div class="r"><b>${eur(x.p)}</b><button class="add" data-id="${x.id}" ${x.st?'':'disabled'}>${x.st?'Ajouter':'Indisponible'}</button></div></div>`).join('')||'<div class="empty" style="grid-column:1/-1">Aucun produit ne correspond à votre recherche.</div>';
 };
 f.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',f).forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.textContent;draw()};
 s.oninput=o.onchange=draw;
 grid.onclick=e=>{const b=e.target.closest('.add');if(b&&!b.disabled)add(b.dataset.id)};draw();
}
/* ---------- accueil : sélection ---------- */
const fav=$('#fav');
if(fav){fav.innerHTML=['monstera','pothos','sansevieria','pot-terracotta'].map(find).map(x=>`<div class="card"><a class="im" href="produit.html?id=${x.id}" style="background:${x.bg}"><span class="lvl">${x.l}</span>${svg(x)}</a><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${x.c}</small><div class="r"><b>${eur(x.p)}</b><button class="add" data-id="${x.id}">Ajouter</button></div></div>`).join('');fav.onclick=e=>{const b=e.target.closest('.add');if(b)add(b.dataset.id)}}
/* ---------- fiche produit ---------- */
const pv=$('#prod');
if(pv){
 const x=find(new URLSearchParams(location.search).get('id'));
 if(!x){pv.innerHTML='<div class="empty">Produit introuvable. <a href="boutique.html" style="text-decoration:underline">Retour à la boutique</a></div>'}
 else{document.title=x.n+' – Maison Verdure';let q=1;
  const draw=()=>{const l=cart().find(i=>i.id===x.id),have=l?l.q:0,left=x.st-have;
  pv.innerHTML=`<div class="crumbs"><a href="index.html">Accueil</a> / <a href="boutique.html">Boutique</a> / <a href="boutique.html?c=${encodeURIComponent(x.c)}">${x.c}</a> / ${x.n}</div>
  <div class="prod"><div class="im" style="background:${x.bg}">${svg(x)}</div><div><small style="color:var(--c);font-weight:700;letter-spacing:.08em;text-transform:uppercase">${x.c}</small><h1>${x.n}</h1><div class="pr">${eur(x.p)}</div><p>${x.d}</p>
  <dl class="spec"><dt>Taille</dt><dd>${x.s}</dd><dt>Difficulté</dt><dd>${x.l}</dd><dt>Lumière</dt><dd>${x.lum}</dd><dt>Arrosage</dt><dd>${x.eau}</dd></dl>
  <div class="buy"><div class="qty"><button id="m" aria-label="Moins">−</button><span>${q}</span><button id="pl" aria-label="Plus">+</button></div><button class="btn g" id="ad" ${left<1?'disabled':''}>${left<1?(x.st?'Maximum dans le panier':'Indisponible'):'Ajouter au panier'}</button></div>
  <p class="stock ${x.st===0?'out':x.st<5?'low':''}">${x.st===0?'Rupture de stock':x.st<5?'Plus que '+x.st+' en stock':'En stock — expédié sous 48 h'}</p></div></div>`;
  $('#m').onclick=()=>{q=Math.max(1,q-1);draw()};$('#pl').onclick=()=>{q=Math.min(Math.max(left,1),q+1);draw()};
  $('#ad').onclick=()=>{if(add(x.id,Math.min(q,left))){q=1;draw()}};};
  draw();
 }
 const rel=$('#rel');if(rel&&x)rel.innerHTML=P.filter(y=>y.c===x.c&&y.id!==x.id).slice(0,4).map(y=>`<div class="card"><a class="im" href="produit.html?id=${y.id}" style="background:${y.bg}">${svg(y)}</a><h3><a href="produit.html?id=${y.id}">${y.n}</a></h3><div class="r"><b>${eur(y.p)}</b></div></div>`).join('');
}
/* ---------- récap panier / commande ---------- */
function summary(el,withCta){
 const t=totals(),left=Math.max(0,50-t.after);
 el.innerHTML=`<h3>Récapitulatif</h3><div class="row"><span>Sous-total</span><span>${eur(t.sub)}</span></div>${t.rem?`<div class="row" style="color:#2e7d4f"><span>Code ${promo().code}</span><span>−${eur(t.rem)}</span></div>`:''}<div class="row"><span>Livraison</span><span>${t.ship?eur(t.ship):'Offerte'}</span></div>
 ${t.c.length&&left>0?`<div class="ship"><i style="width:${Math.min(100,t.after/50*100)}%"></i></div><p class="hint">Plus que ${eur(left)} pour la livraison offerte</p>`:''}
 <div class="row t"><span>Total</span><span>${eur(t.total)}</span></div>
 ${withCta?`<div class="promo"><input id="code" placeholder="Code promo" aria-label="Code promo" value="${promo()?promo().code:''}"><button class="btn o" id="apply" style="padding:10px 18px">OK</button></div><p class="hint" id="pm"></p><a class="btn g" style="display:block;margin-top:16px;${t.c.length?'':'pointer-events:none;opacity:.4'}" href="commande.html">Passer la commande</a>`:''}`;
 const a=$('#apply',el);if(a)a.onclick=()=>{const v=$('#code',el).value.trim().toUpperCase(),pm=$('#pm',el);if(!v){sv('verdure_promo',null);summary(el,withCta);return}
  if(v==='VERDURE10'){sv('verdure_promo',{code:v,pct:10});summary(el,withCta);$('#pm',el).textContent='Code appliqué : −10 %.';$('#pm',el).className='hint ok'}else{pm.textContent='Code invalide. Essayez VERDURE10.';pm.className='hint no'}};
}
const cl=$('#lines');
if(cl){
 const draw=()=>{const c=cart();
  $('#cartwrap').hidden=!c.length;$('#emptycart').hidden=!!c.length;
  cl.innerHTML=c.map(i=>{const x=find(i.id);return `<div class="line"><a class="th" href="produit.html?id=${x.id}" style="background:${x.bg}">${svg(x)}</a><div><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${eur(x.p)} l'unité</small><br><button class="rm" data-id="${x.id}">Retirer</button></div><div style="text-align:right"><div class="qty"><button data-id="${x.id}" data-d="-1" aria-label="Moins">−</button><span>${i.q}</span><button data-id="${x.id}" data-d="1" aria-label="Plus">+</button></div><div style="margin-top:6px;font-weight:700">${eur(x.p*i.q)}</div></div></div>`}).join('');
  summary($('#sum'),true)};
 cl.onclick=e=>{const b=e.target.closest('button');if(!b)return;const c=cart(),i=c.find(x=>x.id===b.dataset.id);
  if(b.classList.contains('rm'))setCart(c.filter(x=>x!==i));
  else{const n=i.q+ +b.dataset.d;if(n<1)setCart(c.filter(x=>x!==i));else if(n>find(i.id).st)toast('Stock maximum atteint');else{i.q=n;setCart(c)}}
  draw()};
 draw();
}
/* ---------- commande ---------- */
const co=$('#checkout');
if(co){
 const draw=()=>{const c=cart();if(!c.length&&!$('#done').innerHTML){co.hidden=true;$('#emptyco').hidden=false;$('#sum').hidden=true}
  summary($('#sum'),false);$('#mini').innerHTML=c.map(i=>`<div class="row" style="font-size:.9rem"><span>${i.q} × ${find(i.id).n}</span><span>${eur(find(i.id).p*i.q)}</span></div>`).join('')};
 draw();
 const mail=v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
 const V={prenom:v=>v.trim().length>1||'Prénom requis.',nom:v=>v.trim().length>1||'Nom requis.',email:v=>mail(v)||'E-mail invalide.',adr:v=>v.trim().length>5||'Adresse requise.',cp:v=>/^\d{5}$/.test(v.trim())||'Code postal à 5 chiffres.',ville:v=>v.trim().length>1||'Ville requise.',cgv:(v,e)=>e.checked||'Vous devez accepter les CGV.'};
 co.onsubmit=e=>{e.preventDefault();let ok=true;for(const k in V){const el=co.elements[k],r=V[k](el.value,el),er=$('[data-e='+k+']');er.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!ok){const first=$('.err:not(:empty)');first&&first.scrollIntoView({block:'center',behavior:'smooth'});return}
  const t=totals();if(!t.c.length)return;
  const o={ref:'MV-'+Date.now().toString(36).toUpperCase().slice(-6),date:new Date().toLocaleDateString('fr-FR'),total:t.total,mode:co.pay.value,items:t.c.map(i=>({n:find(i.id).n,q:i.q,p:find(i.id).p})),nom:co.prenom.value+' '+co.nom.value,adr:`${co.adr.value}, ${co.cp.value} ${co.ville.value}`};
  const all=ld('verdure_orders',[]);all.unshift(o);sv('verdure_orders',all);setCart([]);sv('verdure_promo',null);
  co.hidden=true;$('#sum').closest('aside').hidden=true;
  $('#done').innerHTML=`<div class="ok-box"><h2>Merci ${co.prenom.value} !</h2><p>Votre commande est enregistrée.</p><p class="ref">${o.ref}</p><p style="margin:14px 0;color:var(--mut)">${o.items.map(i=>i.q+' × '+i.n).join('<br>')}<br><br>Total : <b>${eur(o.total)}</b> · ${o.mode==='cb'?'Carte bancaire':o.mode==='paypal'?'PayPal':'Virement'}<br>Livraison à : ${o.adr}</p><p class="hint">Démonstration : aucun paiement n'est effectué et aucun e-mail n'est envoyé.</p><p style="margin-top:20px"><a class="btn g" href="boutique.html">Continuer mes achats</a></p></div>`;scrollTo({top:0,behavior:'smooth'})};
}
/* ---------- journal ---------- */
const nl=$('#news');
if(nl)nl.onsubmit=e=>{e.preventDefault();const v=nl.email.value;$('#nm').textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)?'Merci ! Vous êtes inscrit(e) (démo).':'Adresse e-mail invalide.';if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))nl.reset()};
