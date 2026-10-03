const MAQUETTES=[
 {slug:'chez-marthe',nom:'Chez Marthe',cat:'Restaurant',desc:'Bistrot lyonnais : ardoise du jour, horaires et réservation.'},
 {slug:'helene-voss',nom:'Hélène Voss',cat:'Photographe',desc:'Portfolio sobre, séries plein format et tarifs mariage.'},
 {slug:'nord-athletique',nom:'Nord Athlétique',cat:'Salle de sport',desc:'Abonnements, planning des cours et essai gratuit.'},
 {slug:'maison-verdure',nom:'Maison Verdure',cat:'Boutique en ligne',desc:'Catalogue de plantes avec filtre et panier fonctionnel.'}
];
/* thème clair / sombre */
const root=document.documentElement;
const saved=(()=>{try{return localStorage.getItem('theme')}catch(e){}})();
root.dataset.theme=saved||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
document.querySelectorAll('.theme').forEach(b=>b.onclick=()=>{
 const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;
 try{localStorage.setItem('theme',t)}catch(e){}
});
/* galerie */
const grid=document.getElementById('galerie-grid');
if(grid){
 const f=document.getElementById('filters');
 const cats=['Toutes',...new Set(MAQUETTES.map(m=>m.cat))];
 const fit=()=>grid.querySelectorAll('.thumb').forEach(t=>t.firstElementChild.style.transform=`scale(${t.clientWidth/1280})`);
 const draw=c=>{
  grid.innerHTML=MAQUETTES.filter(m=>c==='Toutes'||m.cat===c).map(m=>`
  <a class="mock" href="maquette.html?m=${m.slug}">
   <div class="thumb"><iframe src="maquettes/${m.slug}.html" loading="lazy" tabindex="-1" title="Aperçu ${m.nom}"></iframe></div>
   <div class="meta"><h3>${m.nom}</h3><span class="cat">${m.cat}</span></div>
   <p>${m.desc}</p><span class="go">Ouvrir la maquette →</span></a>`).join('');
  fit();
 };
 f.innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 f.onclick=e=>{if(e.target.tagName!=='BUTTON')return;[...f.children].forEach(b=>b.classList.remove('on'));e.target.classList.add('on');draw(e.target.textContent)};
 addEventListener('resize',fit);draw('Toutes');
}
const form=document.getElementById('contact-form');
if(form)form.onsubmit=e=>{
 e.preventDefault();const d=new FormData(form);
 location.href='mailto:contact@my-apps.fr?subject='+encodeURIComponent('Projet web – '+d.get('nom'))+'&body='+encodeURIComponent(d.get('message')+'\n\n'+d.get('nom')+' – '+d.get('email'));
};
/* visionneuse */
const stage=document.getElementById('frame');
if(stage){
 const p=new URLSearchParams(location.search).get('m');
 const i=Math.max(0,MAQUETTES.findIndex(m=>m.slug===p)),m=MAQUETTES[i];
 document.title=m.nom+' – Maquette | My-Apps';
 document.getElementById('vt').innerHTML=`${m.nom}<small>${m.cat}</small>`;
 stage.src=`maquettes/${m.slug}.html`;
 document.getElementById('full').href=stage.src;
 document.getElementById('next').href='maquette.html?m='+MAQUETTES[(i+1)%MAQUETTES.length].slug;
 document.getElementById('devs').onclick=e=>{
  if(e.target.tagName!=='BUTTON')return;
  [...e.currentTarget.children].forEach(b=>b.classList.remove('on'));e.target.classList.add('on');
  stage.style.width=e.target.dataset.w;
 };
}
