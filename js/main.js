const MAQUETTES=[
 {slug:'restaurant',nom:'Le Petit Bistrot',cat:'Restauration',desc:'Site vitrine gourmand avec menu et réservation.'},
 {slug:'photographe',nom:'Atelier Lumen',cat:'Portfolio',desc:'Portfolio photo minimaliste et immersif.'},
 {slug:'coach',nom:'FitPulse',cat:'Sport & bien-être',desc:'Page de conversion pour coach sportif.'},
 {slug:'boutique',nom:'Verdura',cat:'E-commerce',desc:'Boutique de plantes avec fiches produits.'}
];
const grid=document.getElementById('maquettes');
if(grid){
 const cats=['Tous',...new Set(MAQUETTES.map(m=>m.cat))];
 const f=document.getElementById('filters');
 const draw=c=>{
  grid.innerHTML=MAQUETTES.filter(m=>c==='Tous'||m.cat===c).map(m=>`
  <article class="card mock">
   <div class="thumb"><iframe src="maquettes/${m.slug}.html" loading="lazy" tabindex="-1" title="Aperçu ${m.nom}"></iframe></div>
   <div class="body"><span class="tag">${m.cat}</span><h3>${m.nom}</h3><p>${m.desc}</p>
   <div class="row"><a class="btn primary" href="maquette.html?m=${m.slug}">Voir la maquette</a>
   <a class="btn" href="maquettes/${m.slug}.html" target="_blank" rel="noopener">Plein écran ↗</a></div></div>
  </article>`).join('');
 };
 f.innerHTML=cats.map((c,i)=>`<button class="btn${i?'':' on'}">${c}</button>`).join('');
 f.onclick=e=>{if(e.target.tagName!=='BUTTON')return;[...f.children].forEach(b=>b.classList.remove('on'));e.target.classList.add('on');draw(e.target.textContent)};
 draw('Tous');
}
const form=document.getElementById('contact');
if(form)form.onsubmit=e=>{
 e.preventDefault();const d=new FormData(form);
 location.href='mailto:contact@my-apps.fr?subject='+encodeURIComponent('Projet web – '+d.get('nom'))+'&body='+encodeURIComponent(d.get('message')+'\n\n'+d.get('nom')+' – '+d.get('email'));
};
const stage=document.getElementById('frame');
if(stage){
 const p=new URLSearchParams(location.search).get('m');
 const i=Math.max(0,MAQUETTES.findIndex(m=>m.slug===p)),m=MAQUETTES[i];
 document.title=m.nom+' – Maquette | My-Apps';
 document.getElementById('vt').innerHTML=`${m.nom}<small>${m.cat}</small>`;
 stage.src=`maquettes/${m.slug}.html`;
 document.getElementById('full').href=stage.src;
 const n=MAQUETTES[(i+1)%MAQUETTES.length];
 document.getElementById('next').href='maquette.html?m='+n.slug;
 document.getElementById('devs').onclick=e=>{
  if(e.target.tagName!=='BUTTON')return;
  [...e.currentTarget.children].forEach(b=>b.classList.remove('on'));e.target.classList.add('on');
  stage.style.width=e.target.dataset.w;
 };
}
