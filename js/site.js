const MAQUETTES=[
 {slug:'le-tablier-bavard',nom:'Le Tablier Bavard',cat:'Restaurant',desc:'Bistrot lyonnais : carte filtrable, réservation en ligne avec créneaux et gestion de vos réservations.',tags:['Réservation','Carte','Horaires en direct']},
 {slug:'helene-voss',nom:'Hélène Voss',cat:'Photographe',desc:'Portfolio avec galeries filtrables et visionneuse plein écran, estimateur de devis et formulaire de contact.',tags:['Galerie','Lightbox','Devis']},
 {slug:'rouille-fonte',nom:'Rouille & Fonte',cat:'Salle de sport',desc:'Abonnements, planning des cours avec places limitées, réservation de séance et inscription.',tags:['Planning','Réservation','Inscription']},
 {slug:'oyat-mousse',nom:'Oyat & Mousse',cat:'Boutique en ligne',desc:'Catalogue, recherche, fiches produit, panier, code promo et tunnel de commande complet.',tags:['Panier','Fiches produit','Commande']},
 {slug:'le-carnet-egare',nom:'Le Carnet Égaré',cat:'Blog',desc:'Blog de voyage : articles filtrables, recherche, commentaires, « j\'aime » et inscription à la lettre.',tags:['Articles','Commentaires','Newsletter']},
 {slug:'orbelune-wiki',nom:'Orbelune Wiki',cat:'Wiki',desc:'Encyclopédie collaborative : sommaire, infobox, modification en ligne avec historique et restauration.',tags:['Édition','Historique','Recherche']},
 {slug:'comptoir-des-curieux',nom:'Le Comptoir des Curieux',cat:'Forum',desc:'Forum de discussion : catégories, sujets, réponses, citations, « j\'aime » et profils de membres.',tags:['Sujets','Réponses','Membres']},
 {slug:'pilotis-admin',nom:'Pilotis Admin',cat:'Administration',desc:'Panneau d\'administration : tableau de bord avec graphiques, gestion des utilisateurs, paramètres et journal.',tags:['Graphiques','Utilisateurs','Export CSV']},
 {slug:'tribord-gestion',nom:'Tribord Gestion',cat:'Comptabilité & paie',desc:'Factures avec TVA, clients, salariés et bulletins de paie imprimables.',tags:['Factures','Paie','Export']},
 {slug:'cendrelune-serveur',nom:'Cendrelune',cat:'Jeu vidéo',desc:'Serveur de jeu complet : comptes avec liaison Discord, carte interactive, clans, événements, boutique, vote et panneau d\'administration (console, sanctions, tickets).',tags:['Liaison Discord','Panneau admin','Carte en direct']}
];

/* My-Apps — interface commune : thème, menu, compte, services, réalisations, visionneuse */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
/* thème : suit le réglage du système tant que le visiteur n'a pas choisi lui-même */
const mq=matchMedia('(prefers-color-scheme:dark)');
const userTheme=()=>{try{return localStorage.getItem('theme')}catch(e){return null}};
if(!root.dataset.theme)root.dataset.theme=userTheme()||(mq.matches?'dark':'light');
(mq.addEventListener?mq.addEventListener.bind(mq,'change'):mq.addListener.bind(mq))(e=>{if(!userTheme())root.dataset.theme=e.matches?'dark':'light'});
$$('.theme').forEach(b=>b.onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}});
const burger=$('.burger');
if(burger)burger.onclick=()=>{const o=$('.menu').classList.toggle('open');burger.setAttribute('aria-expanded',o)};
/* compte dans l'en-tête */
(()=>{const el=$('#acct');if(!el||!window.MA)return;const m=MA.me();
 if(!m){el.innerHTML='<a class="btn sm" href="connexion.html">Connexion</a>';return}
 el.innerHTML=`<button class="who" aria-haspopup="true" aria-expanded="false"><span class="av">${MA.esc(m.name[0]||'?').toUpperCase()}</span><span>${MA.esc(m.name.split(' ')[0])}</span></button><div class="dd" role="menu"><a href="espace.html">Mes demandes</a><a href="commande.html">Commander un site</a>${m.role==='admin'?'<a href="admin.html">Administration</a>':''}<hr><button id="out">Se déconnecter</button></div>`;
 const b=$('.who',el),d=$('.dd',el);b.onclick=e=>{e.stopPropagation();const o=d.classList.toggle('on');b.setAttribute('aria-expanded',o)};
 document.addEventListener('click',()=>d.classList.remove('on'));
 $('#out',el).onclick=()=>{MA.logout();location.href='index.html'};
})();
/* services (gérés depuis l'administration) */
const svcCard=(s,i)=>`<div class="card up ${s.featured?'hl':''}" style="--i:${i}">${s.featured?'<span class="tagline">Le plus demandé</span>':s.cat?`<span class="tagline" style="background:var(--bg2);color:var(--mut)">${MA.esc(s.cat)}</span>`:''}<h3>${MA.esc(s.name)}</h3><div class="price">${+s.price?`${s.prefix?`<small class="pre">${MA.esc(s.prefix)}</small>`:''}${MA.eur(s.price)}<small> ${MA.esc(s.unit||'HT')}${s.period?' '+MA.esc(s.period):''}</small>`:'Sur devis'}</div><p>${MA.esc(s.desc)}</p><ul class="check">${(s.features||[]).map(f=>`<li>${MA.esc(f)}</li>`).join('')}</ul><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:auto"><a class="btn ${s.featured?'primary':''}" href="commande.html?s=${encodeURIComponent(s.id)}">Commander</a>${s.delay?`<small style="color:var(--mut)">Délai : ${MA.esc(s.delay)}</small>`:''}</div></div>`;
const sg=$('#svc-grid');if(sg&&window.MA){const l=MA.services().filter(s=>s.active);sg.innerHTML=l.length?l.map(svcCard).join(''):'<p class="lead">Les services seront bientôt disponibles.</p>';sg.querySelectorAll('.card').forEach(c=>{c.style.display='flex';c.style.flexDirection='column'})}
const hs=$('#home-svc');if(hs&&window.MA){const l=MA.services().filter(s=>s.active).slice(0,3);hs.innerHTML=l.map(svcCard).join('')}

const card=m=>`<a class="work" href="maquette.html?m=${m.slug}">
 <div class="thumb"><iframe src="maquettes/${m.slug}/index.html" loading="lazy" tabindex="-1" title="Aperçu de ${m.nom}"></iframe></div>
 <div class="meta"><h3>${m.nom}</h3><span class="cat">${m.cat}</span></div>
 <p>${m.desc}</p><div class="tags">${m.tags.map(t=>`<span>${t}</span>`).join('')}</div></a>`;
const fit=g=>$$('.thumb',g).forEach(t=>t.firstElementChild.style.transform=`scale(${t.clientWidth/1280})`);
const home=$('#home-works');
if(home){home.innerHTML=MAQUETTES.slice(0,3).map(card).join('');fit(home);addEventListener('resize',()=>fit(home))}
const grid=$('#works');
if(grid){
 const f=$('#filters'),cats=['Toutes',...new Set(MAQUETTES.map(m=>m.cat))];
 const draw=c=>{grid.innerHTML=MAQUETTES.filter(m=>c==='Toutes'||m.cat===c).map(card).join('');fit(grid)};
 f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 f.onclick=e=>{if(e.target.tagName!=='BUTTON')return;$$('button',f).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');draw(e.target.textContent)};
 addEventListener('resize',()=>fit(grid));draw('Toutes');
}
/* visionneuse : appareils (ordinateur, tablette, téléphone) */
const frame=$('#frame');
if(frame){
 const p=new URLSearchParams(location.search).get('m');
 const i=Math.max(0,MAQUETTES.findIndex(m=>m.slug===p)),m=MAQUETTES[i];
 document.title=m.nom+' – Maquette | My-Apps';
 $('#vt').innerHTML=`${m.nom}<small>${m.cat}</small>`;
 $('#url').textContent=m.slug+'.fr';
 frame.src=`maquettes/${m.slug}/index.html`;
 $('#full').href=frame.src;
 $('#next').href='maquette.html?m='+MAQUETTES[(i+1)%MAQUETTES.length].slug;
 /* taille de l'écran (px CSS) et épaisseur de la bordure de chaque appareil */
 const DEV={desktop:{w:1280,h:800,pad:0,top:38},tablet:{w:820,h:1180,pad:16,top:0},mobile:{w:390,h:844,pad:13,top:0}};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const dev=$('#dev'),fit=$('#fit'),stage=$('#stage'),rot=$('#rot'),scr=$('#frame');
 let mode='desktop',land=false,busy=false;
 const area=()=>{const cs=getComputedStyle(stage);return{aw:stage.clientWidth-parseFloat(cs.paddingLeft)*2,ah:stage.clientHeight-parseFloat(cs.paddingTop)*2}};
 /* dimensions de l'appareil pour une orientation donnée */
 function dims(m,l){
  const {aw,ah}=area(),d=DEV[m],o=l&&m!=='desktop';
  let sw=o?d.h:d.w,sh=o?d.w:d.h;
  if(m==='desktop'){sw=clamp(aw,1100,1700);sh=Math.max(560,Math.round((ah-d.top)*Math.max(1,sw/aw)))}
  const top=m==='mobile'&&l?0:d.top,W=sw+d.pad*2,H=sh+d.pad*2+top;
  return{W,H,s:Math.min(1,aw/W,ah/H)};
 }
 function layout(){
  const {W,H,s}=dims(mode,land);
  dev.style.width=W+'px';dev.style.height=H+'px';dev.style.transform=`translate(-50%,-50%) scale(${s})`;
  fit.style.width=W*s+'px';fit.style.height=H*s+'px';
  dev.dataset.m=mode;dev.dataset.o=land?'l':'p';
  rot.classList.toggle('show',mode!=='desktop');rot.classList.toggle('on',land);
 }
 $('#devs').onclick=e=>{const b=e.target.closest('button');if(!b||busy)return;$$('button',e.currentTarget).forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.m;land=false;layout()};
 /* rotation : l'appareil pivote physiquement, l'écran s'éteint, se redessine dans la nouvelle orientation puis se rallume */
 rot.onclick=()=>{
  if(busy||mode==='desktop')return;busy=true;
  const to=dims(mode,!land),dir=land?90:-90;
  rot.classList.toggle('on',!land);
  dev.classList.add('rot-out');
  fit.style.width=to.W*to.s+'px';fit.style.height=to.H*to.s+'px';
  dev.style.transform=`translate(-50%,-50%) scale(${to.s}) rotate(${dir}deg)`;
  setTimeout(()=>{
   dev.style.transition='none';fit.style.transition='none';
   land=!land;layout();void dev.offsetWidth;
   dev.classList.remove('rot-out');dev.classList.add('rot-in');
   dev.style.transition='';fit.style.transition='';
   setTimeout(()=>{dev.classList.remove('rot-in');busy=false},480);
  },720);
 };
 addEventListener('resize',layout);
 dev.style.transition='none';layout();requestAnimationFrame(()=>requestAnimationFrame(()=>dev.style.transition=''));
}
