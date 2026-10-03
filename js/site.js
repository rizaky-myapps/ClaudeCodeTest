const MAQUETTES=[
 {slug:'chez-marthe',nom:'Chez Marthe',cat:'Restaurant',desc:'Bistrot lyonnais : carte filtrable, réservation en ligne avec créneaux et gestion de vos réservations.',tags:['Réservation','Carte','Horaires en direct']},
 {slug:'helene-voss',nom:'Hélène Voss',cat:'Photographe',desc:'Portfolio avec galeries filtrables et visionneuse plein écran, estimateur de devis et formulaire de contact.',tags:['Galerie','Lightbox','Devis']},
 {slug:'nord-athletique',nom:'Nord Athlétique',cat:'Salle de sport',desc:'Abonnements, planning des cours avec places limitées, réservation de séance et inscription.',tags:['Planning','Réservation','Inscription']},
 {slug:'maison-verdure',nom:'Maison Verdure',cat:'Boutique en ligne',desc:'Catalogue, recherche, fiches produit, panier, code promo et tunnel de commande complet.',tags:['Panier','Fiches produit','Commande']}
];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
$$('.theme').forEach(b=>b.onclick=()=>{
 const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;
 try{localStorage.setItem('theme',t)}catch(e){}
});
const burger=$('.burger');
if(burger)burger.onclick=()=>{const o=$('.menu').classList.toggle('open');burger.setAttribute('aria-expanded',o)};
const card=m=>`<a class="work" href="maquette.html?m=${m.slug}">
 <div class="thumb"><iframe src="maquettes/${m.slug}/index.html" loading="lazy" tabindex="-1" title="Aperçu de ${m.nom}"></iframe></div>
 <div class="meta"><h3>${m.nom}</h3><span class="cat">${m.cat}</span></div>
 <p>${m.desc}</p><div class="tags">${m.tags.map(t=>`<span>${t}</span>`).join('')}</div></a>`;
const fit=g=>$$('.thumb',g).forEach(t=>t.firstElementChild.style.transform=`scale(${t.clientWidth/1280})`);
const home=$('#home-works');
if(home){home.innerHTML=MAQUETTES.slice(0,2).map(card).join('');fit(home);addEventListener('resize',()=>fit(home))}
const grid=$('#works');
if(grid){
 const f=$('#filters'),cats=['Toutes',...new Set(MAQUETTES.map(m=>m.cat))];
 const draw=c=>{grid.innerHTML=MAQUETTES.filter(m=>c==='Toutes'||m.cat===c).map(card).join('');fit(grid)};
 f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 f.onclick=e=>{if(e.target.tagName!=='BUTTON')return;$$('button',f).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');draw(e.target.textContent)};
 addEventListener('resize',()=>fit(grid));draw('Toutes');
}
/* formulaire de contact : validation + ouverture du client mail */
const form=$('#contact-form');
if(form){
 const rules={nom:v=>v.trim().length>1||'Indiquez votre nom.',email:v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)||'Adresse e-mail invalide.',message:v=>v.trim().length>=15||'Décrivez votre projet en quelques lignes (15 caractères min.).',rgpd:(v,el)=>el.checked||'Veuillez accepter le traitement de votre demande.'};
 form.onsubmit=e=>{
  e.preventDefault();let ok=true;
  for(const k in rules){const el=form.elements[k],r=rules[k](el.value,el),err=$('.err[data-for='+k+']',form);err.textContent=r===true?'':r;if(r!==true)ok=false}
  if(!ok)return;
  const d=new FormData(form);
  const body=`${d.get('message')}\n\nType de projet : ${d.get('type')}\nBudget : ${d.get('budget')}\n\n${d.get('nom')} — ${d.get('email')}`;
  $('#sent').hidden=false;form.hidden=true;
  location.href='mailto:contact@my-apps.fr?subject='+encodeURIComponent('Projet web – '+d.get('nom'))+'&body='+encodeURIComponent(body);
 };
}
/* visionneuse */
const frame=$('#frame');
if(frame){
 const p=new URLSearchParams(location.search).get('m');
 const i=Math.max(0,MAQUETTES.findIndex(m=>m.slug===p)),m=MAQUETTES[i];
 document.title=m.nom+' – Maquette | My-Apps';
 $('#vt').innerHTML=`${m.nom}<small>${m.cat}</small>`;
 frame.src=`maquettes/${m.slug}/index.html`;
 $('#full').href=frame.src;
 $('#next').href='maquette.html?m='+MAQUETTES[(i+1)%MAQUETTES.length].slug;
 $('#devs').onclick=e=>{if(e.target.tagName!=='BUTTON')return;$$('button',e.currentTarget).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');frame.style.width=e.target.dataset.w};
}
