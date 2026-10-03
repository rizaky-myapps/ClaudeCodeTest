const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const root=document.documentElement;
root.dataset.t=ld('pilotis_theme','light');
const toast=m=>{let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2200)};
const side=$('.side'),bgb=$('.burger');if(bgb)bgb.onclick=()=>side.classList.toggle('open');
document.addEventListener('click',e=>{if(side&&side.classList.contains('open')&&!e.target.closest('.side,.burger'))side.classList.remove('open')});
const th=$('#theme');if(th)th.onclick=()=>{const v=root.dataset.t==='dark'?'light':'dark';root.dataset.t=v;sv('pilotis_theme',v);const d=$('#dk');if(d)d.checked=v==='dark';if(window.redraw)redraw()};
const color=n=>{let h=0;for(const c of n)h=(h*37+c.charCodeAt(0))%360;return `hsl(${h} 50% 45%)`};
const initials=n=>n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
const av=n=>`<span class="av" style="background:${color(n)}">${esc(initials(n))}</span>`;
/* journal d'audit */
const logs=()=>ld('pilotis_log',[]);
function audit(action,detail){const a=logs();a.unshift({t:new Date().toISOString(),u:'Camille Roux',a:action,d:detail});sv('pilotis_log',a.slice(0,80))}
/* données utilisateurs */
const NAMES=['Léa Marchand','Hugo Bernard','Inès Dupuis','Noah Garnier','Jade Lambert','Louis Fabre','Manon Girard','Tom Rousseau','Chloé Mercier','Adam Blanc','Lucie Faure','Nathan Roy','Sarah Vidal','Enzo Perrin','Camille Roux','Julie Morel','Ethan Andre','Clara Lopez','Maxime Simon','Zoé Colin','Paul Henry','Alice Meyer','Théo Bonnet','Anaïs Chevalier'];
const ROLES=['Administrateur','Éditeur','Support','Lecteur'],STAT=['Actif','Invité','Suspendu'];
const seedUsers=()=>NAMES.map((n,i)=>({id:i+1,n,e:n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'.')+'@pilotis.example',r:i===14?'Administrateur':ROLES[(i*3+1)%4],s:i%9===4?'Suspendu':i%7===3?'Invité':'Actif',d:`2025-${String(1+(i*5)%12).padStart(2,'0')}-${String(1+(i*7)%27).padStart(2,'0')}`}));
const users=()=>{let u=ld('pilotis_users',null);if(!u){u=seedUsers();sv('pilotis_users',u)}return u};
/* générateur pseudo-aléatoire */
const rng=seed=>()=>(seed=(seed*16807)%2147483647)/2147483647;
/* ---------- graphiques SVG ---------- */
function line(el,vals,labels,fmt){const W=640,H=240,P={l:44,r:12,t:12,b:28},max=Math.max(...vals)*1.15,x=i=>P.l+i*(W-P.l-P.r)/(vals.length-1),y=v=>H-P.b-v/max*(H-P.t-P.b);
 const pts=vals.map((v,i)=>[x(i),y(v)]);const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 const grid=[0,.25,.5,.75,1].map(f=>{const v=max*f,yy=y(v);return `<line x1="${P.l}" x2="${W-P.r}" y1="${yy}" y2="${yy}" stroke="var(--line)"/><text x="${P.l-8}" y="${yy+4}" text-anchor="end" font-size="11" fill="var(--mut)">${fmt?fmt(v,1):Math.round(v)}</text>`}).join('');
 const lab=labels.map((l,i)=>i%Math.ceil(labels.length/8)===0?`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mut)">${l}</text>`:'').join('');
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--a)" stop-opacity=".28"/><stop offset="1" stop-color="var(--a)" stop-opacity="0"/></linearGradient></defs>${grid}${lab}<path d="${path} L${x(vals.length-1)} ${H-P.b} L${P.l} ${H-P.b}Z" fill="url(#g)"/><path class="ln" d="${path}" fill="none" stroke="var(--a)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur=".9s" fill="freeze"/></path>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="14" fill="transparent" data-i="${i}"/>`).join('')}</svg><div class="tip"></div>`;
 const tip=$('.tip',el);$$('circle',el).forEach(c=>{c.onmouseenter=()=>{const i=+c.dataset.i,r=el.getBoundingClientRect(),s=$('svg',el).getBoundingClientRect();tip.textContent=labels[i]+' · '+(fmt?fmt(vals[i]):vals[i]);tip.style.left=(+c.getAttribute('cx')/W*s.width)+'px';tip.style.top=(+c.getAttribute('cy')/H*s.height)+'px';tip.style.opacity=1};c.onmouseleave=()=>tip.style.opacity=0})}
function bars(el,vals,labels){const W=420,H=240,P={l:30,b:26,t:10},max=Math.max(...vals)*1.15,bw=(W-P.l)/vals.length;
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${vals.map((v,i)=>{const h=v/max*(H-P.b-P.t);return `<rect x="${P.l+i*bw+bw*.18}" y="${H-P.b-h}" width="${bw*.64}" height="${h}" rx="5" fill="var(--a)" opacity="${.45+.55*v/max}" data-i="${i}"><animate attributeName="height" from="0" to="${h}" dur=".6s" fill="freeze"/><animate attributeName="y" from="${H-P.b}" to="${H-P.b-h}" dur=".6s" fill="freeze"/></rect><text x="${P.l+i*bw+bw/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mut)">${labels[i]}</text>`}).join('')}</svg><div class="tip"></div>`;
 const tip=$('.tip',el);$$('rect',el).forEach(r=>{r.onmouseenter=()=>{const i=+r.dataset.i,s=$('svg',el).getBoundingClientRect();tip.textContent=labels[i]+' : '+vals[i]+' inscriptions';tip.style.left=((+r.getAttribute('x')+bw*.32)/W*s.width)+'px';tip.style.top=((+r.getAttribute('y'))/H*s.height)+'px';tip.style.opacity=1};r.onmouseleave=()=>tip.style.opacity=0})}
function donut(el,parts){const tot=parts.reduce((a,p)=>a+p.v,0);let a=-Math.PI/2;const R=70,r=46;
 el.innerHTML=`<svg viewBox="-90 -90 180 180" style="height:190px">${parts.map(p=>{const b=a+p.v/tot*Math.PI*2,x1=R*Math.cos(a),y1=R*Math.sin(a),x2=R*Math.cos(b),y2=R*Math.sin(b),x3=r*Math.cos(b),y3=r*Math.sin(b),x4=r*Math.cos(a),y4=r*Math.sin(a),l=b-a>Math.PI?1:0;const d=`M${x1} ${y1}A${R} ${R} 0 ${l} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${l} 0 ${x4} ${y4}Z`;a=b;return `<path d="${d}" fill="${p.c}"><title>${p.n} : ${p.v}</title></path>`}).join('')}<text text-anchor="middle" y="6" font-size="20" font-weight="800" fill="var(--ink)">${tot}</text></svg><div class="legend">${parts.map(p=>`<span><i style="background:${p.c}"></i>${p.n}<b>${Math.round(p.v/tot*100)}%</b></span>`).join('')}</div>`}
function spark(vals){const W=120,H=40,max=Math.max(...vals),min=Math.min(...vals);const pts=vals.map((v,i)=>[i*W/(vals.length-1),H-4-(v-min)/(max-min||1)*(H-8)]);return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')}" fill="none" stroke="var(--a)" stroke-width="2" stroke-linecap="round"/></svg>`}
/* ---------- tableau de bord ---------- */
const dash=$('#dash');
if(dash){const eur=v=>v>=1000?(v/1000).toFixed(v>=10000?0:1).replace('.',',')+' k€':Math.round(v)+' €';
 const MOIS=['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
 const build=range=>{const n=range==='12'?12:range==='30'?10:7,r=rng(range==='12'?7:range==='30'?11:3);const lab=range==='12'?MOIS:range==='30'?Array.from({length:10},(_,i)=>(i*3+1)+' sep'):['lun','mar','mer','jeu','ven','sam','dim'];
  let v=range==='12'?32000:range==='30'?1100:1000;const rev=lab.map(()=>v=v*(0.94+r()*.16));
  return{lab,rev:rev.map(Math.round),ins:Array.from({length:8},(_,i)=>Math.round(40+r()*60)),act:Math.round(rev[n-1]/9.2)}};
 window.redraw=()=>{const range=$('#range').value,d=build(range),mult=range==='12'?1:range==='30'?1:1;
  const tot=d.rev.reduce((a,b)=>a+b,0);
  $('#kp').innerHTML=[['Revenu',eur(tot),'+8,2 %','up',d.rev],['Utilisateurs actifs',d.act.toLocaleString('fr-FR'),'+3,1 %','up',d.rev.map(x=>x*0.7+d.act)],['Tickets ouverts',String(24+d.ins[0]%17),'−12 %','up',d.ins],['Conversion','3,'+(4+d.ins[1]%5)+' %','−0,3 pt','dn',d.rev.slice().reverse()]].map(k=>`<div class="card kpi"><small>${k[0]}</small><b>${k[1]}</b><span class="d ${k[3]}">${k[2]}</span>${spark(k[4])}</div>`).join('');
  line($('#ch1'),d.rev,d.lab,(v,s)=>s?(v>=1000?Math.round(v/1000)+'k':Math.round(v)):eur(v));bars($('#ch2'),d.ins,['S1','S2','S3','S4','S5','S6','S7','S8']);
  donut($('#ch3'),[{n:'Essentiel',v:420+d.ins[2],c:'#4F5BFF'},{n:'Pro',v:260+d.ins[3],c:'#14935F'},{n:'Équipe',v:140+d.ins[4],c:'#C77700'},{n:'Gratuit',v:210+d.ins[5],c:'#9AA3C4'}])};
 $('#range').onchange=redraw;redraw();
 const ev=[['Hugo Bernard','a créé un espace « Studio Nord »','il y a 4 min'],['Inès Dupuis','a changé son offre en Pro','il y a 22 min'],['Support','ticket #4821 résolu','il y a 1 h'],['Noah Garnier','a invité 3 collaborateurs','il y a 2 h'],['Système','sauvegarde quotidienne terminée','il y a 5 h'],['Jade Lambert','a exporté un rapport','hier']];
 $('#feed').innerHTML=ev.map(e=>`<li>${av(e[0])}<div><b>${e[0]}</b> ${e[1]}<small>${e[2]}</small></div></li>`).join('')}
/* ---------- utilisateurs ---------- */
const ut=$('#utab');
if(ut){let q='',rf='',sf='',sk='n',asc=true,page=1,sel=new Set;const PER=8;
 const get=()=>users().filter(u=>(!q||(u.n+u.e).toLowerCase().includes(q))&&(!rf||u.r===rf)&&(!sf||u.s===sf)).sort((a,b)=>(a[sk]>b[sk]?1:-1)*(asc?1:-1));
 const draw=()=>{const all=get(),pages=Math.max(1,Math.ceil(all.length/PER));page=Math.min(page,pages);const rows=all.slice((page-1)*PER,page*PER);
  const cl={Actif:'p-ok',Invité:'p-warn',Suspendu:'p-bad'};
  $('#cnt').textContent=all.length+' utilisateur'+(all.length>1?'s':'');
  $('#utab').innerHTML=`<div class="scroll"><table><thead><tr><th style="width:36px"><input type="checkbox" id="all"></th>${[['n','Utilisateur'],['r','Rôle'],['s','Statut'],['d','Inscription']].map(([k,l])=>`<th data-k="${k}" class="${sk===k?'s'+(asc?' asc':''):''}">${l}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(u=>`<tr><td><input type="checkbox" data-s="${u.id}" ${sel.has(u.id)?'checked':''}></td><td><div class="us">${av(u.n)}<div><b>${esc(u.n)}</b><small>${esc(u.e)}</small></div></div></td><td><span class="pill p-a">${u.r}</span></td><td><span class="pill ${cl[u.s]}">${u.s}</span></td><td>${new Date(u.d).toLocaleDateString('fr-FR')}</td><td style="white-space:nowrap"><button class="btn o" style="padding:6px 12px" data-e="${u.id}">Modifier</button> <button class="btn o" style="padding:6px 12px;color:var(--bad)" data-x="${u.id}">Supprimer</button></td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--mut)">Aucun utilisateur ne correspond.</td></tr>'}</tbody></table></div><div class="pg"><span>Page ${page} sur ${pages}</span><div><button id="pv" ${page<2?'disabled':''}>‹</button>${Array.from({length:pages},(_,i)=>`<button data-p="${i+1}" class="${i+1===page?'on':''}">${i+1}</button>`).join('')}<button id="nx" ${page>=pages?'disabled':''}>›</button></div></div>`;
  $('#bulk').hidden=!sel.size;$('#bn').textContent=sel.size;
  $$('th[data-k]').forEach(h=>h.onclick=()=>{if(sk===h.dataset.k)asc=!asc;else{sk=h.dataset.k;asc=true}draw()});
  $$('[data-p]').forEach(b=>b.onclick=()=>{page=+b.dataset.p;draw()});$('#pv').onclick=()=>{page--;draw()};$('#nx').onclick=()=>{page++;draw()};
  $$('[data-s]').forEach(c=>c.onchange=()=>{c.checked?sel.add(+c.dataset.s):sel.delete(+c.dataset.s);$('#bulk').hidden=!sel.size;$('#bn').textContent=sel.size});
  $('#all').onchange=e=>{rows.forEach(u=>e.target.checked?sel.add(u.id):sel.delete(u.id));draw()};
  $$('[data-e]').forEach(b=>b.onclick=()=>openM(+b.dataset.e));$$('[data-x]').forEach(b=>b.onclick=()=>{const u=users().find(x=>x.id===+b.dataset.x);if(confirm('Supprimer '+u.n+' ?')){sv('pilotis_users',users().filter(x=>x.id!==u.id));audit('Suppression','Utilisateur '+u.n);toast('Utilisateur supprimé');draw()}})};
 $('#q').oninput=e=>{q=e.target.value.toLowerCase();page=1;draw()};$('#rf').onchange=e=>{rf=e.target.value;page=1;draw()};$('#sf').onchange=e=>{sf=e.target.value;page=1;draw()};
 $('#bulk-s').onclick=()=>{const u=users().map(x=>sel.has(x.id)?{...x,s:'Suspendu'}:x);sv('pilotis_users',u);audit('Suspension',sel.size+' utilisateur(s)');toast(sel.size+' utilisateur(s) suspendu(s)');sel.clear();draw()};
 $('#bulk-d').onclick=()=>{if(confirm('Supprimer '+sel.size+' utilisateur(s) ?')){sv('pilotis_users',users().filter(x=>!sel.has(x.id)));audit('Suppression',sel.size+' utilisateur(s)');toast('Utilisateurs supprimés');sel.clear();draw()}};
 $('#csv').onclick=()=>{const rows=[['Nom','E-mail','Rôle','Statut','Inscription'],...get().map(u=>[u.n,u.e,u.r,u.s,u.d])];const b=new Blob([rows.map(r=>r.join(';')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='utilisateurs.csv';a.click();audit('Export','CSV des utilisateurs');toast('Export CSV téléchargé')};
 const m=$('#modal'),f=$('#uf');f.r.innerHTML=ROLES.map(r=>`<option>${r}</option>`).join('');f.s.innerHTML=STAT.map(r=>`<option>${r}</option>`).join('');let editing=null;
 function openM(id){editing=id||null;const u=id?users().find(x=>x.id===id):{n:'',e:'',r:'Lecteur',s:'Invité'};$('#mt').textContent=id?'Modifier l\'utilisateur':'Ajouter un utilisateur';f.n.value=u.n;f.e.value=u.e;f.r.value=u.r;f.s.value=u.s;$$('.err',f).forEach(x=>x.textContent='');m.classList.add('on');f.n.focus()}
 $('#add').onclick=()=>openM();$('#mc').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};
 f.onsubmit=e=>{e.preventDefault();const n=f.n.value.trim(),em=f.e.value.trim();let ok=true;$('[data-e=n]',f).textContent=n.length>1?'':(ok=false,'Nom requis.');const dup=users().some(x=>x.e===em&&x.id!==editing);$('[data-e=e]',f).textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?(dup?(ok=false,'Cette adresse est déjà utilisée.'):''):(ok=false,'Adresse e-mail invalide.');if(!ok)return;
  const a=users();if(editing){const u=a.find(x=>x.id===editing);Object.assign(u,{n,e:em,r:f.r.value,s:f.s.value});audit('Modification','Utilisateur '+n)}else{a.unshift({id:Date.now(),n,e:em,r:f.r.value,s:f.s.value,d:new Date().toISOString().slice(0,10)});audit('Création','Utilisateur '+n)}
  sv('pilotis_users',a);m.classList.remove('on');toast(editing?'Modifications enregistrées':'Utilisateur ajouté');draw()};
 draw()}
/* ---------- paramètres ---------- */
const st=$('#settings');
if(st){const S=ld('pilotis_settings',{name:'Camille Roux',email:'camille.roux@pilotis.example',lang:'fr',n1:true,n2:true,n3:false,n4:true,tfa:true,key:'pk_live_8f3a91c2d7e04b6a'});
 const tabs=$$('.tabs button'),panes=$$('[data-pane]');tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.toggle('on',x===b));panes.forEach(p=>p.hidden=p.dataset.pane!==b.dataset.t)});
 const f=$('#pf');f.name.value=S.name;f.email.value=S.email;f.lang.value=S.lang;
 f.onsubmit=e=>{e.preventDefault();const n=f.name.value.trim(),em=f.email.value.trim();$('[data-e=name]').textContent=n.length>1?'':'Nom requis.';$('[data-e=email]').textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':'Adresse e-mail invalide.';if(n.length<2||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return;Object.assign(S,{name:n,email:em,lang:f.lang.value});sv('pilotis_settings',S);audit('Paramètres','Profil mis à jour');toast('Profil enregistré')};
 ['n1','n2','n3','n4','tfa'].forEach(k=>{const c=$('#'+k);c.checked=S[k];c.onchange=()=>{S[k]=c.checked;sv('pilotis_settings',S);audit('Paramètres',k+' → '+(c.checked?'activé':'désactivé'));toast('Préférence enregistrée')}});
 const dk=$('#dk');dk.checked=root.dataset.t==='dark';dk.onchange=()=>$('#theme').click();
 const show=()=>$('#key').textContent=S.key;show();
 $('#regen').onclick=()=>{if(confirm('Régénérer la clé ? L\'ancienne cessera de fonctionner.')){S.key='pk_live_'+Array.from({length:16},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join('');sv('pilotis_settings',S);show();audit('Sécurité','Clé API régénérée');toast('Nouvelle clé générée')}};
 $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(S.key)}catch(e){}toast('Clé copiée')}}
/* ---------- journal ---------- */
const lg=$('#log');
if(lg){const base=[['Camille Roux','Connexion','Depuis 82.12.4.18 (Lille)'],['Camille Roux','Modification','Rôle de Hugo Bernard → Éditeur'],['Système','Sauvegarde','Sauvegarde quotidienne terminée'],['Léa Marchand','Connexion','Depuis 90.45.1.22 (Lyon)'],['Camille Roux','Export','Rapport mensuel PDF']];
 const draw=()=>{const f=$('#lf').value,items=[...logs().map(x=>[x.u,x.a,x.d,x.t]),...base.map((b,i)=>[...b,new Date(Date.now()-(i+1)*86400000/3).toISOString()])].filter(x=>!f||x[1]===f);
  lg.innerHTML=items.map(x=>`<li><time>${new Date(x[3]).toLocaleString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</time><span><span class="pill p-a">${x[1]}</span></span><span><b>${esc(x[0])}</b> — ${esc(x[2])}</span></li>`).join('')||'<li>Aucune entrée.</li>'};
 $('#lf').onchange=draw;draw()}
