const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const eur=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+' €';
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
/* ---------- catalogue ---------- */
const P=[
 {id:'monstera',n:'Monstera deliciosa',p:29,l:'Facile',c:'Grandes plantes',s:'60 cm',lum:'Mi-ombre',eau:'1 fois par semaine',st:12,d:'La plante iconique aux feuilles découpées. Pousse vite, pardonne les oublis et dépollue l\'air. Livrée en pot de 19 cm.'},
 {id:'ficus-lyrata',n:'Ficus lyrata',p:49,l:'Moyen',c:'Grandes plantes',s:'90 cm',lum:'Lumière vive',eau:'Tous les 10 jours',st:3,d:'Le figuier lyre impressionne par ses grandes feuilles nervurées. Il aime la lumière et déteste les courants d\'air : ne le déplacez pas trop.'},
 {id:'buis',n:'Buis en boule',p:39,l:'Facile',c:'Grandes plantes',s:'70 cm',lum:'Lumière vive',eau:'Toutes les 2 semaines',st:0,d:'Un feuillage dense et sculptural, très graphique dans un pot sombre. Se taille facilement pour garder sa forme.'},
 {id:'pothos',n:'Pothos doré en suspension',p:24,l:'Facile',c:'Suspensions',s:'60 cm',lum:'Tolère l\'ombre',eau:'Tous les 10 jours',st:20,d:'Retombant ou grimpant, le pothos s\'adapte partout. Livré avec son support suspendu en bois et corde.'},
 {id:'chlorophytum',n:'Chlorophytum',p:16,l:'Facile',c:'Suspensions',s:'35 cm',lum:'Lumière vive',eau:'1 fois par semaine',st:18,d:'La plante araignée : feuilles rubanées, production de nombreux rejets à bouturer et à offrir.'},
 {id:'aloe',n:'Aloe variegata',p:19,l:'Facile',c:'Petites plantes',s:'25 cm',lum:'Lumière vive',eau:'Toutes les 3 semaines',st:22,d:'Une succulente graphique aux feuilles tigrées. Livrée dans un pot en béton clair.'},
 {id:'cactus',n:'Cereus bleu',p:15,l:'Facile',c:'Petites plantes',s:'30 cm',lum:'Plein soleil',eau:'Tous les mois',st:14,d:'Un cactus colonnaire à la teinte bleutée, livré dans un pot orange. Il adore le plein soleil.'},
 {id:'bonsai',n:'Ficus ginseng (bonsaï)',p:34,l:'Moyen',c:'Petites plantes',s:'30 cm',lum:'Lumière vive',eau:'1 fois par semaine',st:7,d:'Un tronc noueux et un feuillage luisant : le bonsaï d\'intérieur le plus facile à vivre.'},
 {id:'pothos-citron',n:'Pothos citron',p:12,l:'Facile',c:'Petites plantes',s:'20 cm',lum:'Tolère l\'ombre',eau:'Tous les 10 jours',st:30,d:'Jeune pousse au vert acidulé, idéale pour une première plante ou un bureau.'},
 {id:'mini-pots',n:'Mini pots terracotta (lot de 6)',p:18,l:'Pot',c:'Pots',s:'Ø 6 cm',lum:'—',eau:'—',st:40,d:'Terre cuite non émaillée, parfaite pour les succulentes et les boutures. Soucoupes fournies.'},
 {id:'tasse-pot',n:'Tasse-pot en céramique',p:14,l:'Pot',c:'Pots',s:'Ø 10 cm',lum:'—',eau:'—',st:25,d:'Une tasse détournée en cache-pot pour une petite plante. Céramique blanche, finition brillante.'},
 {id:'pot-menthe',n:'Pot céramique menthe',p:21,l:'Pot',c:'Pots',s:'Ø 14 cm',lum:'—',eau:'—',st:15,d:'Céramique émaillée à la main, teinte menthe. Fond percé pour le drainage.'}
];
const find=id=>P.find(x=>x.id===id);
const img=(x,c='')=>`<img src="img/${x.id}.jpg" alt="${x.n}" loading="lazy" class="${c}">`;
/* ---------- panier ---------- */
const cart=()=>ld('oyat_cart',[]);
function setCart(c){sv('oyat_cart',c);badge()}
let lastN=null;function badge(){const n=cart().reduce((a,x)=>a+x.q,0);$$('.cart i').forEach(e=>{e.textContent=n;if(lastN!==null&&n!==lastN){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}});lastN=n}
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2000)}
function add(id,q=1){const x=find(id),c=cart(),l=c.find(i=>i.id===id),have=l?l.q:0;
 if(have+q>x.st){toast(x.st?`Stock limité : ${x.st} disponible(s)`:'Produit indisponible');return false}
 l?l.q+=q:c.push({id,q});setCart(c);toast(`${x.n} ajouté au panier`);return true}
badge();
const tt=(c)=>c.reduce((a,i)=>a+find(i.id).p*i.q,0);
const promo=()=>ld('oyat_promo',null);
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
  grid.innerHTML=r.map(x=>`<div class="card"><a class="im" href="produit.html?id=${x.id}"><span class="lvl">${x.l}</span>${!x.st?'<span class="rup">Rupture</span>':x.st<5?'<span class="rup">Dernières pièces</span>':''}${img(x)}</a><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${x.c} · ${x.s}</small><div class="r"><b>${eur(x.p)}</b><button class="add" data-id="${x.id}" ${x.st?'':'disabled'}>${x.st?'Ajouter':'Indisponible'}</button></div></div>`).join('')||'<div class="empty" style="grid-column:1/-1">Aucun produit ne correspond à votre recherche.</div>';
 };
 f.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',f).forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.textContent;draw()};
 s.oninput=o.onchange=draw;
 grid.onclick=e=>{const b=e.target.closest('.add');if(b&&!b.disabled)add(b.dataset.id)};draw();
}
/* ---------- accueil : sélection ---------- */
const fav=$('#fav');
if(fav){fav.innerHTML=['monstera','pothos','aloe','mini-pots'].map(find).map(x=>`<div class="card"><a class="im" href="produit.html?id=${x.id}"><span class="lvl">${x.l}</span>${img(x)}</a><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${x.c}</small><div class="r"><b>${eur(x.p)}</b><button class="add" data-id="${x.id}">Ajouter</button></div></div>`).join('');fav.onclick=e=>{const b=e.target.closest('.add');if(b)add(b.dataset.id)}}
/* ---------- fiche produit ---------- */
const pv=$('#prod');
if(pv){
 const x=find(new URLSearchParams(location.search).get('id'));
 if(!x){pv.innerHTML='<div class="empty">Produit introuvable. <a href="boutique.html" style="text-decoration:underline">Retour à la boutique</a></div>'}
 else{document.title=x.n+' – Oyat & Mousse';let q=1;
  const draw=()=>{const l=cart().find(i=>i.id===x.id),have=l?l.q:0,left=x.st-have;
  pv.innerHTML=`<div class="crumbs"><a href="index.html">Accueil</a> / <a href="boutique.html">Boutique</a> / <a href="boutique.html?c=${encodeURIComponent(x.c)}">${x.c}</a> / ${x.n}</div>
  <div class="prod"><div class="im">${img(x)}</div><div><small style="color:var(--c);font-weight:700;letter-spacing:.08em;text-transform:uppercase">${x.c}</small><h1>${x.n}</h1><div class="pr">${eur(x.p)}</div><p>${x.d}</p>
  <dl class="spec"><dt>Taille</dt><dd>${x.s}</dd><dt>Difficulté</dt><dd>${x.l}</dd><dt>Lumière</dt><dd>${x.lum}</dd><dt>Arrosage</dt><dd>${x.eau}</dd></dl>
  <div class="buy"><div class="qty"><button id="m" aria-label="Moins">−</button><span>${q}</span><button id="pl" aria-label="Plus">+</button></div><button class="btn g" id="ad" ${left<1?'disabled':''}>${left<1?(x.st?'Maximum dans le panier':'Indisponible'):'Ajouter au panier'}</button></div>
  <p class="stock ${x.st===0?'out':x.st<5?'low':''}">${x.st===0?'Rupture de stock':x.st<5?'Plus que '+x.st+' en stock':'En stock — expédié sous 48 h'}</p></div></div>`;
  $('#m').onclick=()=>{q=Math.max(1,q-1);draw()};$('#pl').onclick=()=>{q=Math.min(Math.max(left,1),q+1);draw()};
  $('#ad').onclick=()=>{if(add(x.id,Math.min(q,left))){q=1;draw()}};};
  draw();
 }
 const rel=$('#rel');if(rel&&x)rel.innerHTML=P.filter(y=>y.c===x.c&&y.id!==x.id).slice(0,4).map(y=>`<div class="card"><a class="im" href="produit.html?id=${y.id}">${img(y)}</a><h3><a href="produit.html?id=${y.id}">${y.n}</a></h3><div class="r"><b>${eur(y.p)}</b></div></div>`).join('');
}
/* ---------- récap panier / commande ---------- */
function summary(el,withCta){
 const t=totals(),left=Math.max(0,50-t.after);
 el.innerHTML=`<h3>Récapitulatif</h3><div class="row"><span>Sous-total</span><span>${eur(t.sub)}</span></div>${t.rem?`<div class="row" style="color:#2e7d4f"><span>Code ${promo().code}</span><span>−${eur(t.rem)}</span></div>`:''}<div class="row"><span>Livraison</span><span>${t.ship?eur(t.ship):'Offerte'}</span></div>
 ${t.c.length&&left>0?`<div class="ship"><i style="width:${Math.min(100,t.after/50*100)}%"></i></div><p class="hint">Plus que ${eur(left)} pour la livraison offerte</p>`:''}
 <div class="row t"><span>Total</span><span>${eur(t.total)}</span></div>
 ${withCta?`<div class="promo"><input id="code" placeholder="Code promo" aria-label="Code promo" value="${promo()?promo().code:''}"><button class="btn o" id="apply" style="padding:10px 18px">OK</button></div><p class="hint" id="pm"></p><a class="btn g" style="display:block;margin-top:16px;${t.c.length?'':'pointer-events:none;opacity:.4'}" href="commande.html">Passer la commande</a>`:''}`;
 const a=$('#apply',el);if(a)a.onclick=()=>{const v=$('#code',el).value.trim().toUpperCase(),pm=$('#pm',el);if(!v){sv('oyat_promo',null);summary(el,withCta);return}
  if(v==='OYAT10'){sv('oyat_promo',{code:v,pct:10});summary(el,withCta);$('#pm',el).textContent='Code appliqué : −10 %.';$('#pm',el).className='hint ok'}else{pm.textContent='Code invalide. Essayez OYAT10.';pm.className='hint no'}};
}
const cl=$('#lines');
if(cl){
 const draw=()=>{const c=cart();
  $('#cartwrap').hidden=!c.length;$('#emptycart').hidden=!!c.length;
  cl.innerHTML=c.map(i=>{const x=find(i.id);return `<div class="line"><a class="th" href="produit.html?id=${x.id}">${img(x)}</a><div><h3><a href="produit.html?id=${x.id}">${x.n}</a></h3><small>${eur(x.p)} l'unité</small><br><button class="rm" data-id="${x.id}">Retirer</button></div><div style="text-align:right"><div class="qty"><button data-id="${x.id}" data-d="-1" aria-label="Moins">−</button><span>${i.q}</span><button data-id="${x.id}" data-d="1" aria-label="Plus">+</button></div><div style="margin-top:6px;font-weight:700">${eur(x.p*i.q)}</div></div></div>`}).join('');
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
  const all=ld('oyat_orders',[]);all.unshift(o);sv('oyat_orders',all);setCart([]);sv('oyat_promo',null);
  co.hidden=true;$('#sum').closest('aside').hidden=true;
  $('#done').innerHTML=`<div class="ok-box"><h2>Merci ${co.prenom.value} !</h2><p>Votre commande est enregistrée.</p><p class="ref">${o.ref}</p><p style="margin:14px 0;color:var(--mut)">${o.items.map(i=>i.q+' × '+i.n).join('<br>')}<br><br>Total : <b>${eur(o.total)}</b> · ${o.mode==='cb'?'Carte bancaire':o.mode==='paypal'?'PayPal':'Virement'}<br>Livraison à : ${o.adr}</p><p class="hint">Démonstration : aucun paiement n'est effectué et aucun e-mail n'est envoyé.</p><p style="margin-top:20px"><a class="btn g" href="boutique.html">Continuer mes achats</a></p></div>`;scrollTo({top:0,behavior:'smooth'})};
}
/* ---------- journal ---------- */
const nl=$('#news');
if(nl)nl.onsubmit=e=>{e.preventDefault();const v=nl.email.value;$('#nm').textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)?'Merci ! Vous êtes inscrit(e) (démo).':'Adresse e-mail invalide.';if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))nl.reset()};
