const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
/* ---------- contenu de l'encyclopédie ---------- */
const P={
 'orbelune':{t:'Orbelune',cat:['Lieux'],img:'brume',date:'2026-02-11',info:{Type:'Archipel',Capitale:'[[havreroc|Havreroc]]',Population:'2,4 millions',Langue:'Orbélien',Fondation:'An 0 du Pacte'},
  x:`'''Orbelune''' est un archipel de sept îles baigné par la Mer Pâle, au nord du continent connu. Sa capitale est [[havreroc|Havreroc]].\n\n== Géographie ==\nLes sept îles forment un arc de cercle autour d'une mer intérieure, la Lunière. Un brouillard épais, la ''brume d'Orbe'', recouvre les côtes plus de deux cents jours par an. Au sud s'étend la [[sylphea|forêt de Sylphéa]].\n\n== Histoire ==\nL'archipel est unifié par le [[pacte-des-marees|Pacte des Marées]], signé entre les sept maisons marchandes. Depuis, la [[maison-valdrane|maison Valdrane]] préside le Conseil des Sept.\n\n== Économie ==\nLa richesse d'Orbelune repose sur le commerce maritime et l'extraction de la [[pierre-lune]], un minéral luminescent.\n\n== Voir aussi ==\n* [[havreroc]]\n* [[cartographes-de-brume]]`},
 'havreroc':{t:'Havreroc',cat:['Lieux','Villes'],img:'alpes',date:'2026-03-02',info:{Type:'Capitale',Île:'Grande Orbe',Population:'310 000',Fondation:'An 12',Dirigeant:'[[maelis-de-valdrane|Maëlis de Valdrane]]'},
  x:`'''Havreroc''' est la capitale de l'archipel d'[[orbelune|Orbelune]]. Bâtie à flanc de falaise, elle domine le port le plus actif de la Mer Pâle.\n\n== Quartiers ==\nLa ville haute abrite le palais du Conseil et la guilde des [[cartographes-de-brume]]. La ville basse, plus populaire, vit au rythme du port et des marchés de nuit.\n\n== Curiosités ==\nLes escaliers de pierre-lune, qui s'illuminent à la tombée du jour, sont le symbole de la cité. On dit qu'ils guident les navires jusqu'au port, même par temps de brume.\n\n== Gouvernement ==\nHavreroc est dirigée par la [[maison-valdrane|maison Valdrane]] depuis l'An 87.`},
 'sylphea':{t:'Sylphéa',cat:['Lieux','Nature'],img:'foret',date:'2026-03-18',info:{Type:'Forêt ancienne',Superficie:'4 800 km²',Habitants:'[[veilleurs|Les Veilleurs]]',Climat:'Tempéré humide'},
  x:`La '''forêt de Sylphéa''' couvre le sud de la Grande Orbe. Ses arbres, hauts de plus de cent mètres, filtrent la lumière en un crépuscule perpétuel.\n\n== Faune et flore ==\nOn y trouve des cerfs à bois d'argent et des mousses luminescentes qui poussent uniquement au contact de la [[pierre-lune]].\n\n== Les Veilleurs ==\nLe peuple des [[veilleurs]] y vit depuis des siècles, en harmonie avec la forêt dont il protège les sentiers.\n\n== Accès ==\nSeul le Chemin des Cerfs, depuis [[havreroc]], permet de la traverser en toute sécurité.`},
 'maison-valdrane':{t:'Maison Valdrane',cat:['Histoire','Maisons nobles'],img:'collines',date:'2026-04-05',info:{Type:'Maison marchande',Fondée:'An 3',Devise:'« Toujours le cap »',Chef:'[[maelis-de-valdrane|Maëlis de Valdrane]]'},
  x:`La '''maison Valdrane''' est la plus ancienne des sept maisons marchandes d'[[orbelune|Orbelune]].\n\n== Origines ==\nFondée par des armateurs de la côte nord, elle signe le [[pacte-des-marees|Pacte des Marées]] et obtient en échange la présidence du Conseil.\n\n== Armoiries ==\nD'azur à la boussole d'argent, soutenue par deux sirènes. Sa devise, « Toujours le cap », est gravée au fronton du palais de [[havreroc]].\n\n== Héritage ==\nLa maison contrôle aujourd'hui le tiers du commerce maritime de l'archipel.`},
 'maelis-de-valdrane':{t:'Maëlis de Valdrane',cat:['Personnages'],img:'prairie',date:'2026-05-14',info:{Naissance:'An 412',Fonction:'Présidente du Conseil',Maison:'[[maison-valdrane|Valdrane]]',Résidence:'[[havreroc|Havreroc]]'},
  x:`'''Maëlis de Valdrane''' est l'actuelle présidente du Conseil des Sept et cheffe de la [[maison-valdrane|maison Valdrane]].\n\n== Biographie ==\nNée à [[havreroc]], elle navigue dès l'âge de douze ans avant d'entrer au Conseil à vingt-neuf ans.\n\n== Politique ==\nElle défend l'ouverture des routes maritimes et l'alliance avec les [[cartographes-de-brume]], dont elle finance les expéditions.\n\n== Citations ==\n* « Une carte est une promesse que l'on se fait. »`},
 'pacte-des-marees':{t:'Pacte des Marées',cat:['Histoire'],img:'lac',date:'2026-05-30',info:{Type:'Traité',Signé:'An 0',Parties:'Les sept maisons marchandes',Lieu:'[[havreroc]]'},
  x:`Le '''Pacte des Marées''' est le traité fondateur d'[[orbelune|Orbelune]], signé à l'An 0 par les sept maisons marchandes.\n\n== Contexte ==\nAprès un siècle de guerres de ports, les maisons, épuisées, acceptent de mettre fin aux hostilités.\n\n== Contenu ==\nLe texte établit la libre circulation maritime, un tribunal commun et le partage des revenus de la [[pierre-lune]].\n\n== Postérité ==\nLe Pacte est renouvelé tous les cent ans. La [[maison-valdrane|maison Valdrane]] en conserve l'original.`},
 'pierre-lune':{t:'Pierre-lune',cat:['Magie','Minéraux'],img:'plage',date:'2026-06-09',info:{Type:'Minéral luminescent',Couleur:'Bleu pâle',Gisement:'Îles du nord',Usage:'Éclairage, navigation'},
  x:`La '''pierre-lune''' est un minéral qui émet une faible lueur bleue la nuit. Elle est extraite dans les îles du nord d'[[orbelune|Orbelune]].\n\n== Propriétés ==\nElle absorbe la lumière du jour et la restitue après la tombée de la nuit, sans jamais s'épuiser.\n\n== Usages ==\nOn l'emploie pour éclairer les escaliers de [[havreroc]] et les phares de l'archipel. Les [[cartographes-de-brume]] en broient la poudre pour encrer leurs cartes nocturnes.\n\n== Controverse ==\nSon extraction menace les mousses de [[sylphea|Sylphéa]], ce que dénoncent les [[veilleurs]].`},
 'cartographes-de-brume':{t:'Cartographes de Brume',cat:['Histoire','Guildes'],img:'crete',date:'2026-06-27',info:{Type:'Guilde',Siège:'[[havreroc|Havreroc]]',Fondée:'An 41',Devise:'« Dessiner l\'invisible »'},
  x:`Les '''Cartographes de Brume''' sont une guilde savante dont la mission est de cartographier les côtes d'[[orbelune|Orbelune]] malgré le brouillard permanent.\n\n== Méthodes ==\nIls travaillent la nuit, à la lueur de la [[pierre-lune]], et recoupent les relevés de centaines de marins.\n\n== Membres célèbres ==\n* Ysaure Delmarre, auteure de la première carte complète de la Lunière\n* Torben Hallis, explorateur des îles du nord\n\n== Financement ==\nLa guilde est soutenue par la [[maison-valdrane|maison Valdrane]].`},
 'veilleurs':{t:'Veilleurs',cat:['Peuples'],img:'foret',date:'2026-07-12',info:{Type:'Peuple',Territoire:'[[sylphea|Sylphéa]]',Population:'18 000',Langue:'Sylvain'},
  x:`Les '''Veilleurs''' sont un peuple de gardiens vivant dans la forêt de [[sylphea|Sylphéa]].\n\n== Mode de vie ==\nIls habitent des villages suspendus dans les arbres et pratiquent une agriculture sans labour.\n\n== Rôle ==\nLeur charge est de surveiller les sentiers et les mousses luminescentes, que la [[pierre-lune]] attire et menace à la fois.\n\n== Relations ==\nLes Veilleurs entretiennent un commerce prudent avec [[havreroc]], dont ils n'acceptent que le sel et le fer.`}
};
const CATS=['Lieux','Personnages','Peuples','Histoire','Magie'];
const edits=()=>ld('orbelune_edits',{});
const hist=s=>{const e=edits()[s]||[];return [{t:P[s]?P[s].date+'T09:00:00':new Date().toISOString(),text:P[s]?P[s].x:'',sum:'Création de la page',user:'Archiviste'},...e].filter(r=>P[s]||r.text||true)};
const cur=s=>{const h=hist(s);return h[h.length-1]};
const exists=s=>!!P[s]||(edits()[s]&&edits()[s].length);
const titleOf=s=>P[s]?P[s].t:s.replace(/-/g,' ').replace(/^./,c=>c.toUpperCase());
/* ---------- rendu du balisage ---------- */
function inline(t){return esc(t).replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,(m,s,x)=>link(s,x)).replace(/\[\[([^\]]+)\]\]/g,(m,s)=>link(s,titleOf(s))).replace(/'''(.+?)'''/g,'<b>$1</b>').replace(/''(.+?)''/g,'<i>$1</i>')}
function link(s,x){return `<a class="wl${exists(s)?'':' new'}" href="article.html?p=${s}" title="${exists(s)?'':'Page inexistante : cliquez pour la créer'}">${x}</a>`}
function render(src){
 let html='',toc=[],list=false,para=[];
 const flush=()=>{if(para.length){html+=`<p>${inline(para.join(' '))}</p>`;para=[]}};
 const closeList=()=>{if(list){html+='</ul>';list=false}};
 src.split('\n').forEach(l=>{
  let m;
  if(m=l.match(/^(={2,3})\s*(.+?)\s*\1\s*$/)){flush();closeList();const id='s'+toc.length;toc.push({id,t:m[2],lv:m[1].length});html+=`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`}
  else if(m=l.match(/^\*\s+(.+)/)){flush();if(!list){html+='<ul>';list=true}html+=`<li>${inline(m[1])}</li>`}
  else if(!l.trim()){flush();closeList()}
  else{closeList();para.push(l)}
 });flush();closeList();return{html,toc}}
const when=t=>new Date(t).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
/* ---------- recherche (en-tête) ---------- */
const sq=$('#sq');
if(sq){const box=$('#sug');
 const find=t=>{t=t.toLowerCase().trim();if(!t)return[];return Object.keys(P).filter(s=>(P[s].t+' '+cur(s).text).toLowerCase().includes(t)).sort((a,b)=>(P[b].t.toLowerCase().startsWith(t)?1:0)-(P[a].t.toLowerCase().startsWith(t)?1:0)).slice(0,6)};
 sq.oninput=()=>{const r=find(sq.value);box.style.display=r.length?'block':'none';box.innerHTML=r.map(s=>`<a href="article.html?p=${s}">${P[s].t}<small>${P[s].cat[0]}</small></a>`).join('')};
 sq.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();location.href='recherche.html?q='+encodeURIComponent(sq.value)}if(e.key==='Escape')box.style.display='none'};
 document.addEventListener('click',e=>{if(!e.target.closest('.search'))box.style.display='none'})}
/* ---------- accueil ---------- */
const hm=$('#home');
if(hm){const keys=Object.keys(P),f=P[keys[Math.floor((new Date().getDate())%keys.length)]],fs=keys[Math.floor((new Date().getDate())%keys.length)];
 $('#feat').innerHTML=`<img src="img/${f.img}.jpg" alt=""><h2>Article à la une</h2><h3 style="font-size:1.6rem;margin-bottom:6px"><a href="article.html?p=${fs}">${f.t}</a></h3><p style="color:var(--mut);font-size:.95rem">${render(cur(fs).text.split('\n\n')[0]).html.replace(/<[^>]+>/g,'').slice(0,190)}…</p>`;
 $('#cats').innerHTML=CATS.map(c=>`<a class="tile" href="recherche.html?cat=${encodeURIComponent(c)}"><h3>${c}</h3><p>${Object.values(P).filter(p=>p.cat.includes(c)).length} article(s)</p></a>`).join('');
 recents($('#rc'),6);
 $('#rand').onclick=()=>location.href='article.html?p='+keys[Math.floor(Math.random()*keys.length)]}
function allChanges(){const out=[];Object.keys(P).forEach(s=>out.push({s,t:P[s].date+'T09:00:00',sum:'Création de la page',user:'Archiviste'}));const e=edits();Object.keys(e).forEach(s=>e[s].forEach(r=>out.push({s,t:r.t,sum:r.sum||'Modification',user:r.user})));return out.sort((a,b)=>b.t.localeCompare(a.t))}
function recents(el,n){el.innerHTML=allChanges().slice(0,n).map(c=>`<li><span><a href="article.html?p=${c.s}">${titleOf(c.s)}</a> · ${esc(c.sum)} <small>— ${esc(c.user)}</small></span><small>${when(c.t)}</small></li>`).join('')}
const rcp=$('#recents');if(rcp)recents(rcp,50);
/* ---------- article ---------- */
const art=$('#article');
if(art){const slug=new URLSearchParams(location.search).get('p')||'orbelune';let mode=new URLSearchParams(location.search).get('m')||'read';
 const draw=()=>{
  const p=P[slug],h=hist(slug),c=h[h.length-1];document.title=titleOf(slug)+' – Orbelune Wiki';
  const tabs=`<div class="tabs"><button class="${mode==='read'?'cur':''}" data-m="read">Lire</button><button class="${mode==='edit'?'cur':''}" data-m="edit">${exists(slug)?'Modifier':'Créer'}</button><button class="${mode==='hist'?'cur':''}" data-m="hist">Historique (${h.length})</button></div>`;
  let body='';
  if(mode==='edit'){body=`<div class="edit"><div class="hint">Balisage : <code>== Titre ==</code> · <code>[[page]]</code> ou <code>[[page|texte]]</code> · <code>'''gras'''</code> · <code>''italique''</code> · <code>* liste</code>. Un lien rouge pointe vers une page à créer.</div><textarea id="tx">${esc(exists(slug)?c.text:`'''${titleOf(slug)}''' est ...\n\n== Section ==\n`)}</textarea><input id="sm" placeholder="Résumé de la modification" maxlength="80"><p style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="save">Publier</button><button class="btn o" data-m="read">Annuler</button></p></div>`}
  else if(mode==='hist'){body=`<table class="hist"><tr><th>Version</th><th>Date</th><th>Auteur</th><th>Résumé</th><th></th></tr>${[...h].reverse().map((r,i)=>`<tr><td>#${h.length-i}</td><td>${when(r.t)}</td><td>${esc(r.user||'Visiteur')}</td><td>${esc(r.sum||'')}</td><td>${i?`<button class="btn o" data-r="${h.length-i-1}" style="padding:5px 12px">Restaurer</button>`:'<em>actuelle</em>'}</td></tr>`).join('')}</table>`}
  else if(!exists(slug)){body=`<div class="msg">Cette page n'existe pas encore dans l'encyclopédie.</div><p><button class="btn" data-m="edit">Créer la page « ${esc(titleOf(slug))} »</button></p>`}
  else{const r=render(c.text);
   const info=p?`<aside class="info"><div class="t">${p.t}</div><img src="img/${p.img}.jpg" alt=""><dl>${Object.entries(p.info).map(([k,v])=>`<dt>${k}</dt><dd>${inline(v)}</dd>`).join('')}</dl></aside>`:'';
   const toc=r.toc.length>2?`<nav class="toc"><b>Sommaire</b><ol>${r.toc.filter(t=>t.lv===2).map(t=>`<li><a href="#${t.id}">${esc(t.t)}</a></li>`).join('')}</ol></nav>`:'';
   body=`${info}${toc}<div class="body">${r.html}</div><div class="cats">Catégories :${(p?p.cat:['Pages ajoutées']).map(x=>`<a href="recherche.html?cat=${encodeURIComponent(x)}">${x}</a>`).join('')}</div>`}
  art.innerHTML=`<div class="page">${tabs}<h1>${esc(titleOf(slug))}</h1><div class="sub">${exists(slug)?`Dernière modification le ${when(c.t)} par ${esc(c.user||'Visiteur')}`:'Page inexistante'}</div>${body}</div>`;
  $$('[data-m]',art).forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw();scrollTo({top:0,behavior:'smooth'})});
  const sv2=$('#save');if(sv2)sv2.onclick=()=>{const text=$('#tx').value.trim();if(text.length<10){alert('Le contenu est trop court.');return}const e=edits();(e[slug]=e[slug]||[]).push({t:new Date().toISOString(),text,sum:$('#sm').value.trim()||'Modification',user:'Visiteur'});sv('orbelune_edits',e);mode='read';draw()};
  $$('[data-r]',art).forEach(b=>b.onclick=()=>{const old=hist(slug)[+b.dataset.r],e=edits();(e[slug]=e[slug]||[]).push({t:new Date().toISOString(),text:old.text,sum:'Restauration de la version #'+(+b.dataset.r+1),user:'Visiteur'});sv('orbelune_edits',e);mode='read';draw()})};
 draw()}
/* ---------- recherche / catégories ---------- */
const rs=$('#results');
if(rs){const u=new URLSearchParams(location.search),q=(u.get('q')||'').toLowerCase().trim(),cat=u.get('cat');
 let keys=Object.keys(P);
 if(cat)keys=keys.filter(s=>P[s].cat.includes(cat));if(q)keys=keys.filter(s=>(P[s].t+' '+cur(s).text).toLowerCase().includes(q));
 $('#rt').textContent=cat?'Catégorie : '+cat:q?'Résultats pour « '+u.get('q')+' »':'Toutes les pages';
 $('#rn').textContent=keys.length+' page'+(keys.length>1?'s':'');
 const snip=s=>{const t=render(cur(s).text).html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replace(/ ([.,;:])/g,'$1').replace(/' /g,'\'');const i=q?Math.max(0,t.toLowerCase().indexOf(q)-40):0;return esc(t.slice(i,i+170)).trim()+'…'};
 rs.innerHTML=keys.map(s=>`<a class="tile" href="article.html?p=${s}"><h3>${P[s].t}</h3><p>${snip(s)}</p></a>`).join('')||`<div class="msg">Aucune page ne correspond.${q?` <a href="article.html?p=${encodeURIComponent(q.replace(/\s+/g,'-'))}&m=edit">Créer la page « ${esc(u.get('q'))} »</a>`:''}</div>`}
