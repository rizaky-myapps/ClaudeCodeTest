const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
const CATS=[{id:'gen',n:'Discussions générales',c:'#D2562B'},{id:'cui',n:'Cuisine & recettes',c:'#C99A1A'},{id:'voy',n:'Voyages',c:'#1F7A78'},{id:'bri',n:'Bricolage & jardin',c:'#6B8E3A'},{id:'lec',n:'Livres & cinéma',c:'#7A4EA3'},{id:'hob',n:'Jeux & hobbies',c:'#C0392B'}];
const cat=id=>CATS.find(c=>c.id===id)||CATS[0];
const H=3600e3,NOW=Date.now();
const SEED=[
 {id:'t1',t:'Votre pain maison ne lève pas ? Mes erreurs de débutant',c:'cui',a:'Hortense',views:1284,age:5*H,posts:[['Hortense',5*H,'Après six mois d\'échecs, j\'ai enfin compris : mon eau était trop chaude et ma cuisine trop froide. Mon pain ressemblait à une brique. Qui d\'autre est passé par là ?'],['Basile',4*H,'Température de l\'eau à 25 °C maximum, et un levain nourri la veille. Ça a tout changé pour moi.'],['Odile',3*H,'Le four chaud, c\'est 250 °C avec une cocotte préchauffée. Sans vapeur, pas de croûte.'],['Hortense',2*H,'Merci à tous ! Essai demain matin, je vous tiens au courant.']]},
 {id:'t2',t:'Quel sac pour un mois en Asie du Sud-Est ?',c:'voy',a:'Maxence',views:932,age:9*H,posts:[['Maxence',9*H,'Je pars en janvier pour quatre semaines : Thaïlande, Laos, Vietnam. Sac de 40 L ou 55 L ? J\'hésite entre légèreté et confort.'],['Inès',8*H,'40 L sans hésiter. Vous achèterez ce qui manque sur place, et vous porterez moins.'],['Bastien',6*H,'J\'ai pris 55 L et je l\'ai regretté dès le premier bus. Voyagez léger.']]},
 {id:'t3',t:'Étagère murale : vis, chevilles ou tasseaux ?',c:'bri',a:'Gaspard',views:671,age:26*H,posts:[['Gaspard',26*H,'Mur en placoplâtre, étagère de 80 cm pour des livres. Qu\'est-ce qui tient vraiment sans percer dans un montant ?'],['Odile',24*H,'Chevilles à expansion métalliques pour cloison creuse, pas les chevilles plastique. Et si possible, visez un montant.'],['Gaspard',20*H,'J\'ai suivi votre conseil : ça ne bouge pas, même avec vingt kilos de poche.']]},
 {id:'t4',t:'Le dernier roman qui vous a empêchés de dormir',c:'lec',a:'Capucine',views:2210,age:30*H,posts:[['Capucine',30*H,'Je cherche ma prochaine lecture. Un roman dont on ne peut pas décrocher, peu importe le genre. Vos recommandations ?'],['Léandre',29*H,'« Les Heures creuses » m\'a coûté deux nuits blanches. Intrigue très sobre, mais impossible à lâcher.'],['Inès',27*H,'Je plussoie. Dans un autre genre, le recueil de nouvelles d\'Anselme Rey.'],['Basile',22*H,'Pour moi : tout ce qui se passe sur un seul huis clos, ça marche à chaque fois.'],['Capucine',18*H,'Merci, ma pile à lire explose.']]},
 {id:'t5',t:'Présentez-vous : qui êtes-vous, que faites-vous ici ?',c:'gen',a:'Équipe du Comptoir',views:3540,age:80*H,posts:[['Équipe du Comptoir',80*H,'Bienvenue au Comptoir des Curieux ! Prenez une chaise virtuelle, dites-nous qui vous êtes et ce qui vous amène.'],['Léandre',70*H,'Prof de physique à la retraite, je viens ici pour les discussions qui n\'ont pas d\'utilité immédiate.'],['Odile',60*H,'Menuisière, passionnée de cuisine. Je lis plus que je n\'écris.']]},
 {id:'t6',t:'Meilleur jeu de société pour six joueurs ?',c:'hob',a:'Basile',views:845,age:50*H,posts:[['Basile',50*H,'Noël approche et nous serons six autour de la table. Un jeu qui fonctionne bien à six et qui ne dure pas quatre heures ?'],['Capucine',48*H,'Les jeux d\'ambiance en équipes : très bien à six, règles en cinq minutes.']]},
 {id:'t7',t:'Jardin en pot sur un balcon nord : que planter ?',c:'bri',a:'Inès',views:412,age:100*H,posts:[['Inès',100*H,'Balcon exposé au nord, peu de soleil direct. Quelles plantes ou aromatiques survivent dans ces conditions ?'],['Odile',96*H,'Menthe, persil, ciboulette, fougères et hostas. Oubliez le basilic et la lavande.'],['Gaspard',90*H,'Les fraisiers des bois se plaisent aussi à mi-ombre, et ils ressèment tout seuls.']]},
 {id:'t8',t:'Une semaine en Écosse sans voiture : faisable ?',c:'voy',a:'Léandre',views:589,age:120*H,posts:[['Léandre',120*H,'Je rêve des Highlands mais je ne conduis pas. Bus, trains, ferries : jusqu\'où peut-on aller ?'],['Maxence',110*H,'Très faisable jusqu\'à Skye, avec les bus de Citylink. Prévoyez les horaires à l\'avance, ils sont rares.']]}
];
const MEM=['Hortense','Basile','Odile','Maxence','Inès','Bastien','Gaspard','Capucine','Léandre','Équipe du Comptoir'];
const color=n=>{let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))%360;return `hsl(${h} 45% 42%)`};
const av=(n,c='')=>`<span class="av ${c}" style="background:${color(n)}">${esc(n[0].toUpperCase())}</span>`;
const user=()=>ld('comptoir_user',null);
const threads=()=>[...ld('comptoir_threads',[]),...SEED.map(s=>({...s}))];
const extra=id=>ld('comptoir_re_'+id,[]);
const ago=ms=>{const m=Math.round(ms/60000);if(m<2)return 'à l\'instant';if(m<60)return m+' min';const h=Math.round(m/60);if(h<48)return h+' h';return Math.round(h/24)+' j'};
const full=t=>{const p=t.posts.map(x=>({a:x[0],t:NOW-x[1],m:x[2],l:x[3]}));return p};
const allPosts=t=>[...t.posts.map((x,i)=>({a:x[0],at:t.created?x[1]:NOW-x[1],m:x[2],k:t.id+':'+i})),...extra(t.id).map((x,i)=>({a:x.a,at:x.at,m:x.m,k:t.id+':e'+i,q:x.q}))];
const last=t=>Math.max(...allPosts(t).map(p=>p.at));
const likes=()=>ld('comptoir_likes',{});
/* ---------- connexion ---------- */
function head(){const u=user(),el=$('#acct');if(!el)return;
 el.innerHTML=u?`<span class="who">${av(u,'s')}${esc(u)}</span><button class="btn o s" id="out">Quitter</button>`:'<button class="btn o s" id="in">Se connecter</button>';
 const i=$('#in'),o=$('#out');if(i)i.onclick=()=>login();if(o)o.onclick=()=>{try{localStorage.removeItem('comptoir_user')}catch(e){}location.reload()}}
function login(cb){const m=$('#modal');m.classList.add('on');const f=$('#lf');f.p.focus();
 f.onsubmit=e=>{e.preventDefault();const p=f.p.value.trim();if(!/^[\p{L}0-9_ -]{3,20}$/u.test(p)){$('#le').textContent='Pseudo de 3 à 20 caractères (lettres, chiffres, - _).';return}sv('comptoir_user',p);m.classList.remove('on');head();if(cb)cb();else location.reload()};
 $('#lc').onclick=()=>m.classList.remove('on')}
head();
const gs=$('#gs');if(gs)gs.onkeydown=e=>{if(e.key==='Enter'){location.href='index.html?q='+encodeURIComponent(gs.value)}};
/* ---------- accueil ---------- */
const lst=$('#threads');
if(lst){const u=new URLSearchParams(location.search);let c=u.get('c')||'all',q=(u.get('q')||'').toLowerCase();
 if(gs&&u.get('q'))gs.value=u.get('q');
 $('#catg').innerHTML=CATS.map(x=>`<a class="cat" style="--c:${x.c}" href="index.html?c=${x.id}"><b>${x.n}</b><small>${threads().filter(t=>t.c===x.id).length} sujet(s)</small></a>`).join('');
 const ch=$('#chips');ch.innerHTML=`<button data-c="all" class="${c==='all'?'on':''}">Tous</button>`+CATS.map(x=>`<button data-c="${x.id}" class="${c===x.id?'on':''}">${x.n}</button>`).join('');
 const draw=()=>{let r=threads().filter(t=>(c==='all'||t.c===c)&&(!q||(t.t+' '+allPosts(t).map(p=>p.m).join(' ')).toLowerCase().includes(q)));
  const so=$('#so').value;if(so==='pop')r.sort((a,b)=>(b.views+allPosts(b).length*50)-(a.views+allPosts(a).length*50));else if(so==='un')r=r.filter(t=>allPosts(t).length<2).sort((a,b)=>last(b)-last(a));else r.sort((a,b)=>last(b)-last(a));
  lst.innerHTML=`<div class="row hd"><span>Sujet</span><span class="num">Réponses</span><span class="num">Vues</span><span style="text-align:right">Activité</span></div>`+(r.map(t=>{const p=allPosts(t),k=cat(t.c),lp=p[p.length-1];return `<a class="row" href="sujet.html?id=${t.id}"><div><h3>${esc(t.t)}</h3><span class="tag" style="--c:${k.c}">${k.n}</span><small>par ${esc(t.a)}</small></div><span class="num">${p.length-1}</span><span class="num">${t.views+(ld('comptoir_v_'+t.id,0))}</span><span class="when">${ago(NOW-last(t))}<br>${av(lp.a,'s')}</span></a>`}).join('')||'<div class="empty">Aucun sujet ne correspond. <a href="nouveau.html" style="color:var(--a);font-weight:800">Lancez la discussion !</a></div>')};
 ch.onclick=e=>{const b=e.target.closest('button');if(!b)return;c=b.dataset.c;$$('button',ch).forEach(x=>x.classList.toggle('on',x===b));draw()};
 $('#so').onchange=draw;draw()}
/* ---------- sujet ---------- */
const th=$('#thread');
if(th){const id=new URLSearchParams(location.search).get('id')||'t1',t=threads().find(x=>x.id===id)||threads()[0];
 const vk='comptoir_v_'+t.id;sv(vk,ld(vk,0)+1);document.title=t.t+' – Le Comptoir des Curieux';
 let quote='';
 const draw=()=>{const k=cat(t.c),L=likes(),ps=allPosts(t);
  th.innerHTML=`<div class="crumb"><a href="index.html">Accueil</a> › <a href="index.html?c=${t.c}">${k.n}</a></div><div class="th"><span class="tag" style="--c:${k.c}">${k.n}</span><h1>${esc(t.t)}</h1><small style="color:var(--mut)">${ps.length-1} réponse(s) · ${t.views+ld(vk,0)} vues</small></div>
  ${ps.map((p,i)=>`<article class="post">${av(p.a,'l')}<div><div class="hd2"><b>${esc(p.a)}</b>${p.a.startsWith('Équipe')?'<span class="badge">Équipe</span>':''}${i===0?'<span class="badge" style="background:var(--a)">Auteur</span>':''}<small>${ago(NOW-p.at)}</small></div>${p.q?`<blockquote>${esc(p.q)}</blockquote>`:''}<p>${esc(p.m)}</p><div class="acts"><button class="lk ${L[p.k]?'on':''}" data-k="${p.k}">♥ <span>${[...p.k].reduce((a,c)=>(a*7+c.charCodeAt(0))%9,3)+(L[p.k]?1:0)}</span></button><button class="lk" data-q="${i}">Citer</button></div></div></article>`).join('')}
  <div class="box" style="margin-top:20px"><h2 style="font-size:1.5rem;margin-bottom:12px">Répondre</h2><form class="fm" id="rf" novalidate>${quote?`<blockquote style="border-left:4px solid var(--a);background:var(--soft);padding:8px 14px;border-radius:0 10px 10px 0;color:var(--mut)">${esc(quote)} <button type="button" id="nq" class="lk" style="margin-left:8px">retirer</button></blockquote>`:''}<label>Votre message<textarea name="m" rows="5" placeholder="${user()?'Écrivez votre réponse…':'Connectez-vous pour répondre'}"></textarea><span class="err" id="re"></span></label><div><button class="btn">Publier la réponse</button></div></form></div>`;
  $$('[data-k]',th).forEach(b=>b.onclick=()=>{const L2=likes();L2[b.dataset.k]=!L2[b.dataset.k];sv('comptoir_likes',L2);draw()});
  $$('[data-q]',th).forEach(b=>b.onclick=()=>{const p=allPosts(t)[+b.dataset.q];quote=p.m.slice(0,160);draw();$('#rf textarea').focus()});
  const nq=$('#nq');if(nq)nq.onclick=()=>{quote='';draw()};
  $('#rf').onsubmit=e=>{e.preventDefault();const m=e.target.m.value.trim();if(m.length<3){$('#re').textContent='Votre réponse est trop courte.';return}
   const go=()=>{const u=user();const a=extra(t.id);a.push({a:u,at:Date.now(),m,q:quote});sv('comptoir_re_'+t.id,a);quote='';draw();window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})};
   if(!user())login(go);else go()}};
 draw()}
/* ---------- nouveau sujet ---------- */
const nf=$('#nf');
if(nf){nf.c.innerHTML=CATS.map(c=>`<option value="${c.id}">${c.n}</option>`).join('');
 nf.onsubmit=e=>{e.preventDefault();const t=nf.t.value.trim(),m=nf.m.value.trim();$('#et').textContent=t.length>=8?'':'Le titre doit contenir au moins 8 caractères.';$('#em').textContent=m.length>=20?'':'Le message doit contenir au moins 20 caractères.';if(t.length<8||m.length<20)return;
  const go=()=>{const u=user(),id='n'+Date.now().toString(36),a=ld('comptoir_threads',[]);a.unshift({id,t,c:nf.c.value,a:u,views:1,created:1,posts:[[u,Date.now(),m]]});sv('comptoir_threads',a);location.href='sujet.html?id='+id};
  if(!user())login(go);else go()}}
/* ---------- membres ---------- */
const mb=$('#members');
if(mb){const cnt={};threads().forEach(t=>allPosts(t).forEach(p=>cnt[p.a]=(cnt[p.a]||0)+1));const u=user();if(u&&!cnt[u])cnt[u]=0;
 mb.innerHTML=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([n,c])=>`<div class="mb">${av(n,'l')}<div><b>${esc(n)}${n===u?' (vous)':''}</b><small>${c} message(s)</small></div></div>`).join('')}
