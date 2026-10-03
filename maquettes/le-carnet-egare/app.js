const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const bg=$('.burger');if(bg)bg.onclick=()=>$('nav').classList.toggle('open');
const mail=v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const POSTS=[
 {s:'quarante-kilometres-de-brume',t:'Quarante kilomètres de brume dans les Alpes',c:'Randonnée',d:'2026-09-14',m:9,img:'brume',ex:'Trois jours de marche au-dessus d\'une mer de nuages, sans croiser personne.',likes:128,
  b:['Le premier matin, la vallée avait disparu. Sous nos pieds, une mer de nuages s\'étendait jusqu\'à l\'horizon, striée de rose par le soleil levant. Nous avons marché une heure en silence, par peur de rompre quelque chose.','Quarante kilomètres en trois jours, c\'est peu pour les habitués et beaucoup pour des jambes de bureau. Le premier soir, au refuge, j\'ai compris que le plus dur n\'est pas la montée : c\'est d\'accepter de ralentir.','## Ce que nous avons gardé','Un sac léger, un réchaud minuscule, une carte papier que le vent a failli emporter deux fois. Et surtout, l\'habitude de lever les yeux plus souvent que nous ne l\'avions fait en dix ans de week-ends.','> « En montagne, la brume n\'efface pas le paysage : elle le rend à l\'imagination. »','Le dernier jour, la descente nous a rendus au bruit. Au parking, une voiture bloquait la sortie, quelqu\'un klaxonnait. Nous avons ri : il nous fallait quelques minutes pour réapprendre à être pressés.']},
 {s:'un-van-une-route',t:'Un van, une route, trois semaines',c:'Road-trip',d:'2026-08-30',m:11,img:'van',ex:'Le bilan honnête d\'un voyage en van aménagé : les kilomètres, le budget, les surprises.',likes:96,
  b:['Nous avions prévu un itinéraire précis. Il a tenu quatre jours. Le cinquième, une route de terre signalée par un simple panneau en bois nous a fait changer de cap, et le voyage a vraiment commencé.','Vivre à deux dans six mètres carrés oblige à la clarté. Qui cuisine, qui conduit, qui range : tout se dit à voix haute, ce qui évite bien des silences pesants.','## Budget réel','Carburant, aires, courses, une réparation imprévue à 240 €. Trois semaines, deux personnes, 1 870 € au total. Moins qu\'un séjour d\'une semaine dans une station balnéaire.','Si c\'était à refaire ? Mêmes routes, mais plus lentement. Les plus belles journées furent celles où nous n\'avons parcouru que vingt kilomètres.']},
 {s:'le-lac-sans-nom',t:'Le lac qui n\'avait pas de nom',c:'Carnet de route',d:'2026-08-12',m:6,img:'barque',ex:'Une barque, un lac turquoise, et l\'envie de ne rien photographier.',likes:74,
  b:['Sur la carte, il n\'avait qu\'un numéro. Les gens du village l\'appelaient simplement « le lac », comme s\'il n\'y en avait jamais eu d\'autre.','Nous avons loué une barque pour la matinée. L\'eau était d\'un turquoise presque artificiel, si transparente qu\'on voyait les pierres du fond à dix mètres de profondeur.','## Ne rien photographier','Au bout d\'une heure, j\'ai rangé l\'appareil. Certaines choses refusent d\'être rapportées, elles demandent seulement d\'avoir été vues.','Nous sommes revenus à midi, les mains brûlées par les rames, avec le sentiment étrange d\'avoir volé une heure au temps.']},
 {s:'sac-de-dix-kilos',t:'Faire entrer sa vie dans un sac de dix kilos',c:'Matériel',d:'2026-07-21',m:8,img:'randonneuse',ex:'Notre liste complète, ce que nous avons retiré et ce que nous regrettons.',likes:142,
  b:['La règle est simple : tout ce qui n\'est pas utilisé trois fois dans la semaine reste à la maison. Elle est aussi la plus difficile à respecter, parce que chaque objet porte une petite peur.','Le poids se joue sur quatre postes : sac, tente, couchage, cuisine. À eux seuls, ils représentent plus de la moitié de la charge. Le reste est affaire de discipline.','## La liste finale','Un sac de 45 litres, une tente de 1,1 kg, un duvet en plumes, un réchaud à gaz, deux couches chaudes, une veste imperméable, une trousse minimale. Pas de deuxième paire de chaussures.','Ce que nous regrettons ? Une lampe frontale plus puissante. Ce que nous avons enlevé sans regret : tout le reste.']},
 {s:'patagonie-sans-guide',t:'Patagonie sans guide : ce que j\'aurais voulu savoir',c:'Randonnée',d:'2026-06-03',m:12,img:'patagonie',ex:'Vent, permis, refuges complets : le mode d\'emploi que nous n\'avions pas.',likes:211,
  b:['Personne ne vous prévient pour le vent. Il ne s\'agit pas d\'une brise : c\'est une présence qui pousse, qui siffle, qui rend la tente aussi bruyante qu\'un train.','Les refuges se réservent des mois à l\'avance en haute saison. Nous l\'avons appris sur place, devant un guichet fermé et une file de marcheurs aussi déconfits que nous.','## Trois conseils','Réservez tôt. Prévoyez un jour de marge par étape. Emportez moins de nourriture que vous ne le pensez : les haltes sont plus nombreuses qu\'on ne l\'imagine.','Au retour, une vieille guide m\'a dit que la Patagonie ne se visite pas, elle se négocie. Je n\'ai jamais entendu meilleure définition.']},
 {s:'la-cascade-du-matin',t:'La cascade du matin',c:'Carnet de route',d:'2026-05-17',m:5,img:'cascade',ex:'Partir avant l\'aube pour avoir une cascade rien que pour soi.',likes:63,
  b:['À six heures, le parking était vide. À sept heures, nous étions seuls devant la chute, enveloppés de brume et d\'un grondement qui couvrait toute pensée.','Le sentier est facile, mais glissant : prévoyez de bonnes semelles. Les mousses vertes recouvrent tout, et l\'on se surprend à marcher sur la pointe des pieds, comme dans une église.','À neuf heures, les premiers groupes sont arrivés. Nous avions déjà tout vu.']},
 {s:'route-dans-le-canyon',t:'La route droite du canyon',c:'Road-trip',d:'2026-04-02',m:7,img:'route',ex:'Deux cents kilomètres sans virage et la leçon d\'ennui la plus belle du voyage.',likes:88,
  b:['Il y a des routes qui ne mènent nulle part, et c\'est précisément pour cela qu\'on les aime. Celle-ci traversait le canyon sur deux cents kilomètres sans le moindre virage.','Au début, on s\'impatiente. Puis, vers le quarantième kilomètre, quelque chose cède. On regarde enfin la couleur des falaises, qui change à chaque heure.','## L\'ennui comme luxe','Nous avons roulé sans radio, sans téléphone, avec une seule règle : ne s\'arrêter que lorsque l\'un de nous le demandait. Nous nous sommes arrêtés onze fois.']}
];
const fmt=d=>new Date(d+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
const CATS=['Toutes',...new Set(POSTS.map(p=>p.c))];
const card=p=>`<a class="post" href="article.html?s=${p.s}"><div class="im"><img src="img/${p.img}.jpg" alt="" loading="lazy"></div><span class="kicker">${p.c}</span><h3>${p.t}</h3><p>${p.ex}</p><div class="meta"><span>${fmt(p.d)}</span><i></i><span>${p.m} min de lecture</span></div></a>`;
/* accueil */
const home=$('#home');
if(home){const [f,...r]=[...POSTS].sort((a,b)=>b.d.localeCompare(a.d));
 $('#feat').innerHTML=`<figure><img src="img/${f.img}.jpg" alt=""></figure><div><span class="kicker">À la une · ${f.c}</span><h2><a href="article.html?s=${f.s}">${f.t}</a></h2><p style="color:var(--mut);margin-bottom:18px">${f.ex}</p><a class="btn a" href="article.html?s=${f.s}">Lire l'article</a></div>`;
 home.innerHTML=r.slice(0,3).map(card).join('')}
/* liste */
const list=$('#list');
if(list){let cat='Toutes';const q=$('#q'),so=$('#so'),ch=$('#chips');
 ch.innerHTML=CATS.map((c,i)=>`<button class="${i?'':'on'}">${c}</button>`).join('');
 const draw=()=>{const t=q.value.toLowerCase().trim();let r=POSTS.filter(p=>(cat==='Toutes'||p.c===cat)&&(p.t+p.ex+p.c).toLowerCase().includes(t));
  if(so.value==='old')r.sort((a,b)=>a.d.localeCompare(b.d));else if(so.value==='pop')r.sort((a,b)=>b.likes-a.likes);else r.sort((a,b)=>b.d.localeCompare(a.d));
  $('#count').textContent=r.length+' article'+(r.length>1?'s':'');list.innerHTML=r.map(card).join('')||'<p class="empty">Aucun article ne correspond.</p>'};
 ch.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',ch).forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.textContent;draw()};
 q.oninput=so.onchange=draw;draw()}
/* article */
const art=$('#article');
if(art){const p=POSTS.find(x=>x.s===new URLSearchParams(location.search).get('s'))||POSTS[0];
 document.title=p.t+' – Le Carnet Égaré';
 const body=p.b.map(x=>x.startsWith('## ')?`<h2>${x.slice(3)}</h2>`:x.startsWith('> ')?`<blockquote>${x.slice(2)}</blockquote>`:`<p>${x}</p>`).join('');
 art.innerHTML=`<div class="ahead w narrow"><span class="kicker">${p.c}</span><h1>${p.t}</h1><div class="meta"><span>Par Léonie Barthe</span><i></i><span>${fmt(p.d)}</span><i></i><span>${p.m} min de lecture</span></div></div>
 <div class="w"><div class="cover"><img src="img/${p.img}.jpg" alt=""></div></div>
 <div class="w narrow"><div class="prose">${body}</div>
 <div class="actions"><button class="like" id="like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-4.6-9.5-9C.8 8.6 2.6 5 6 5c2.200 0 3.600 1.200 6 3.500C14.400 6.200 15.800 5 18 5c3.400 0 5.200 3.600 3.500 7-2.500 4.400-9.500 9-9.500 9z"/></svg><span id="lc"></span></button><button class="btn o" id="copy">Copier le lien</button><a class="btn o" href="articles.html">← Tous les articles</a></div>
 <div class="comments"><h2 id="ct"></h2><div id="cl"></div>
 <form class="fm" id="cf" novalidate><label>Votre prénom<input name="n"><span class="err" data-e="n"></span></label><label>Votre commentaire<textarea name="m" rows="4"></textarea><span class="err" data-e="m"></span></label><button class="btn a" style="justify-self:start">Publier</button></form></div></div>`;
 const lk=ld('carnet_likes',{}),key=p.s;const draw=()=>{const on=!!lk[key];$('#like').classList.toggle('on',on);$('#lc').textContent=(p.likes+(on?1:0))+' j\'aime'};draw();
 $('#like').onclick=()=>{lk[key]=!lk[key];sv('carnet_likes',lk);draw()};
 $('#copy').onclick=async e=>{try{await navigator.clipboard.writeText(location.href)}catch(x){}e.target.textContent='Lien copié ✓';setTimeout(()=>e.target.textContent='Copier le lien',1800)};
 const cm=()=>ld('carnet_cm_'+key,[{n:'Mathis',m:'Magnifique récit, ça donne envie de partir demain.',d:'2026-09-20'},{n:'Inès',m:'Merci pour les conseils pratiques, très utiles.',d:'2026-09-22'}]);
 const drawC=()=>{const a=cm();$('#ct').textContent=a.length+' commentaire'+(a.length>1?'s':'');$('#cl').innerHTML=a.map(c=>`<div class="cm"><b>${c.n.replace(/</g,'&lt;')}</b><small>${fmt(c.d)}</small><p>${c.m.replace(/</g,'&lt;')}</p></div>`).join('')};drawC();
 $('#cf').onsubmit=e=>{e.preventDefault();const f=e.target,n=f.n.value.trim(),m=f.m.value.trim();$('[data-e=n]').textContent=n.length>1?'':'Indiquez votre prénom.';$('[data-e=m]').textContent=m.length>4?'':'Votre commentaire est trop court.';if(n.length<2||m.length<5)return;
  const a=cm();a.push({n,m,d:new Date().toISOString().slice(0,10)});sv('carnet_cm_'+key,a);f.reset();drawC()};
 const bar=$('#prog');addEventListener('scroll',()=>{const h=document.documentElement,m=h.scrollHeight-innerHeight;bar.style.transform=`scaleX(${m>0?scrollY/m:0})`},{passive:true})}
/* newsletter */
const nf=$('#news');
if(nf)nf.onsubmit=e=>{e.preventDefault();const v=nf.email.value.trim();const er=$('.err',nf);if(!mail(v)){er.textContent='Adresse e-mail invalide.';return}er.textContent='';nf.innerHTML='<p style="width:100%;font-size:1.1rem">Merci ! Vous recevrez le prochain carnet (démonstration).</p>'};
