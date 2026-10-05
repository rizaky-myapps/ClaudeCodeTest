/* My-Apps — administration : tableau de bord, tickets, services, comptes, journal, réglages */
(()=>{
const {$,$$,esc,toast,STATUS,LOGT,GROUPS}=MA;
const ME=MA.me(),q=new URLSearchParams(location.search);
const ib=$('.ibtn');if(ib)ib.onclick=()=>$('.sd').classList.toggle('open');
const page=document.body.dataset.page;
/* ----- accès réservé ----- */
if(!ME||ME.role!=='admin'){
 document.body.innerHTML=`<div class="lock"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg><h1>Accès réservé</h1><p style="color:var(--mut)">${ME?'Votre compte n\'a pas les droits d\'administration.':'Connectez-vous avec un compte administrateur.'}</p>
 ${ME?'<p style="margin-top:22px"><button class="btn" id="lo">Changer de compte</button> <a class="btn" href="index.html">Retour au site</a></p>':`<form class="f" id="gf" novalidate><label>E-mail<input name="email" type="email" autocomplete="username"></label><label>Mot de passe<input name="pass" type="password" autocomplete="current-password"></label><div class="err" id="ge"></div><button class="btn primary">Se connecter</button></form><div class="demo"><b>Démonstration</b> · <span class="code">admin@my-apps.fr</span> · <span class="code">myapps-admin</span></div><p style="margin-top:18px"><a href="index.html" style="color:var(--mut)">← Retour au site</a></p>`}</div><div id="toast"></div>`;
 const lo=$('#lo');if(lo)lo.onclick=()=>{MA.logout();location.reload()};
 const gf=$('#gf');if(gf)gf.onsubmit=e=>{e.preventDefault();const r=MA.login(gf.email.value,gf.pass.value);if(r.error){$('#ge').textContent=r.error;return}if(r.user.role!=='admin'){MA.logout();$('#ge').textContent='Ce compte n\'a pas les droits d\'administration.';return}location.reload()};
 return;
}
/* ----- utilitaires ----- */
const modal=(html)=>{let m=$('#am');if(!m){m=document.createElement('div');m.id='am';m.className='modal';document.body.appendChild(m)}m.innerHTML=`<div class="box">${html}</div>`;m.classList.add('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};return m};
const closeM=()=>{const m=$('#am');if(m)m.classList.remove('on')};
const download=(name,rows)=>{const b=new Blob(['﻿'+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(';')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
const sp=s=>`<span class="pill ${STATUS[s].c}">${STATUS[s].l}</span>`;
const PRI={low:'Basse',normal:'Normale',high:'Haute'};
const badge=()=>{const n=MA.tickets().filter(t=>t.status==='pending').length,b=$('#bd-tk');if(b){b.hidden=!n;b.textContent=n}};
badge();addEventListener('storage',e=>{if(e.key==='ma_tickets')badge()});
const pager=(el,total,per,page,go)=>{const pages=Math.max(1,Math.ceil(total/per));el.innerHTML=`<span>Page ${page} sur ${pages} · ${total} résultat(s)</span><div><button ${page<2?'disabled':''} data-p="${page-1}" aria-label="Précédent">‹</button>${Array.from({length:pages},(_,i)=>i+1).filter(i=>Math.abs(i-page)<3||i===1||i===pages).map(i=>`<button class="${i===page?'on':''}" data-p="${i}">${i}</button>`).join('')}<button ${page>=pages?'disabled':''} data-p="${page+1}" aria-label="Suivant">›</button></div>`;$$('button[data-p]',el).forEach(b=>b.onclick=()=>go(+b.dataset.p))};

/* ===== tableau de bord ===== */
const dash=$('#dash');
if(dash){
 const draw=()=>{
  const T=MA.tickets(),U=MA.users().filter(u=>u.role==='client'),S=MA.services(),n=Date.now();
  const c=s=>T.filter(t=>t.status===s).length,pot=T.filter(t=>t.status==='pending'||t.status==='progress').reduce((a,t)=>a+(+t.price||0),0);
  $('#kp').innerHTML=[['En attente',c('pending'),'à traiter'],['En cours',c('progress'),'demandes ouvertes'],['Traités',c('done')+c('closed'),'terminés ou fermés'],['Comptes clients',U.length,'inscrits'],['Services actifs',S.filter(s=>s.active).length+' / '+S.length,'visibles sur le site'],['Potentiel',MA.eur(pot),'tickets ouverts, HT']].map(k=>`<div class="kpi"><small>${k[0]}</small><b>${k[1]}</b><span>${k[2]}</span></div>`).join('');
  /* tickets par jour sur 14 jours */
  const days=Array.from({length:14},(_,i)=>{const d=new Date(n-(13-i)*MA.DAY);d.setHours(0,0,0,0);return d.getTime()});
  const vals=days.map(d=>T.filter(t=>t.created>=d&&t.created<d+MA.DAY).length),mx=Math.max(3,...vals),W=560,H=200,bw=W/14;
  $('#ch').innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${[0,.5,1].map(f=>`<line x1="0" x2="${W}" y1="${H-28-f*(H-48)}" y2="${H-28-f*(H-48)}" stroke="var(--line)"/>`).join('')}${vals.map((v,i)=>{const h=v/mx*(H-48);return `<rect x="${i*bw+bw*.2}" y="${H-28-h}" width="${bw*.6}" height="${Math.max(h,2)}" rx="4" fill="var(--a)" opacity="${v?1:.25}"><title>${new Date(days[i]).toLocaleDateString('fr-FR')} : ${v}</title></rect>${i%2===0?`<text x="${i*bw+bw/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mut)">${new Date(days[i]).getDate()}/${new Date(days[i]).getMonth()+1}</text>`:''}`}).join('')}</svg>`;
  const tot=T.length||1,col={pending:'var(--warn)',progress:'var(--a)',done:'var(--ok)',closed:'var(--mut)'};
  $('#st').innerHTML=`<div class="stack">${Object.keys(STATUS).map(s=>`<i style="width:${c(s)/tot*100}%;background:${col[s]}"></i>`).join('')}</div><div class="leg">${Object.keys(STATUS).map(s=>`<span style="--c:${col[s]}">${STATUS[s].l} · ${c(s)}</span>`).join('')}</div>`;
  $('#rt').innerHTML=T.slice(0,6).map(t=>`<div class="li"><div><a href="admin-tickets.html?id=${t.id}"><b>${esc(t.subject)}</b></a><small>${t.ref} · ${esc(t.name)} · ${MA.ago(t.updated)}</small></div>${sp(t.status)}</div>`).join('')||'<p style="color:var(--mut)">Aucun ticket.</p>';
  $('#ra').innerHTML=MA.logs().slice(0,7).map(l=>`<div class="li"><div><b>${LOGT[l.type]?LOGT[l.type][0]:l.type}</b><small>${esc(l.detail)}</small></div><small>${MA.ago(l.t)}</small></div>`).join('');
 };
 draw();addEventListener('storage',draw);
}

/* ===== tickets ===== */
const tkEl=$('#tix');
if(tkEl){
 let sel=q.get('id'),fs='',fp='',fq='';
 const QR=['Bonjour, merci pour votre demande ! Nous revenons vers vous sous 48 h avec une proposition.','Pourriez-vous nous préciser le nombre de pages et les contenus dont vous disposez (textes, photos, logo) ?','Votre maquette est prête : vous recevrez le lien par e-mail dans la journée.','Votre devis vous a été envoyé par e-mail. N\'hésitez pas à nous poser vos questions.','Merci pour votre retour, nous appliquons les modifications et revenons vers vous.'];
 const draw=()=>{
  const all=MA.tickets();
  const T=all.filter(t=>(!fs||t.status===fs)&&(!fp||t.priority===fp)&&(!fq||(t.ref+t.subject+t.name+t.email+t.company).toLowerCase().includes(fq)));
  if(!sel||!all.find(t=>t.id===sel))sel=T[0]?T[0].id:null;
  $('#cnt').textContent=T.length+' ticket(s)';
  $('#tl').innerHTML=T.map(t=>`<button data-id="${t.id}" class="${t.id===sel?'on':''}">${t.unreadStaff?'<i class="dot"></i>':''}<b>${esc(t.subject)}</b><small><span>${t.ref}</span>${sp(t.status)}${t.priority==='high'?'<span class="pri high">Haute</span>':''}<span>${esc(t.name)}</span><span>${MA.ago(t.updated)}</span></small></button>`).join('')||'<div class="empty">Aucun ticket.</div>';
  $$('#tl button').forEach(b=>b.onclick=()=>{sel=b.dataset.id;history.replaceState(null,'','?id='+sel);draw()});
  const t=all.find(x=>x.id===sel),td=$('#td');
  if(!t){td.innerHTML='<div class="thread"><div class="empty">Sélectionnez un ticket.</div></div>';return}
  MA.markRead(t.id,'staff');
  const items=[...t.messages.map(m=>({...m,k:'m'})),...t.notes.map(n=>({...n,k:'n'}))].sort((a,b)=>a.t-b.t);
  const bub=x=>x.k==='n'?`<div class="msg note"><small>Note interne · ${esc(x.author)} · ${MA.dt(x.t)}</small>${esc(x.text)}</div>`:x.from==='system'?`<div class="msg sys">${esc(x.text)} · ${MA.dt(x.t)}</div>`:`<div class="msg ${x.from==='staff'?'me':''}"><small>${esc(x.author)}${x.from==='staff'?' · équipe':''} · ${MA.dt(x.t)}</small>${esc(x.text)}</div>`;
  td.innerHTML=`<div class="thread"><div class="hd"><div><h3>${esc(t.subject)}</h3><small>${t.ref} · ouvert le ${MA.dt(t.created)} · ${t.type==='question'?'Question':'Commande'}</small></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${sp(t.status)}</div></div>
  <div class="ctl"><label>Statut <select id="ss">${Object.keys(STATUS).map(s=>`<option value="${s}" ${s===t.status?'selected':''}>${STATUS[s].l}</option>`).join('')}</select></label><label>Priorité <select id="sp">${Object.keys(PRI).map(p=>`<option value="${p}" ${p===t.priority?'selected':''}>${PRI[p]}</option>`).join('')}</select></label>
  ${t.status!=='done'&&t.status!=='closed'?'<button class="btn sm" id="bdone">Marquer comme traité</button>':''}${t.status!=='closed'?'<button class="btn sm" id="bclose">Fermer</button>':'<button class="btn sm primary" id="breopen">Rouvrir</button>'}<span style="flex:1"></span><button class="btn sm bad" id="bdel">Supprimer</button></div>
  <div class="ctl" style="font-size:.9rem;color:var(--mut)"><span><b style="color:var(--ink)">${esc(t.name)}</b>${t.userId?'':' (invité)'}${t.userDeleted?' (compte supprimé)':''}</span><span><a href="mailto:${esc(t.email)}" style="color:var(--a)">${esc(t.email)}</a></span>${t.phone?`<span>${esc(t.phone)}</span>`:''}${t.company?`<span>${esc(t.company)}</span>`:''}<span>Service : <b style="color:var(--ink)">${esc(t.serviceName)}</b>${+t.price?` (${MA.eur(t.price)})`:''}</span>${t.budget?`<span>Budget : ${esc(t.budget)}</span>`:''}${t.deadline?`<span>Délai : ${esc(t.deadline)}</span>`:''}</div>
  <div class="msgs" id="ms">${items.map(bub).join('')}</div>
  ${t.status==='closed'?'<div class="empty" style="padding:20px">Ticket fermé. Rouvrez-le pour répondre.</div>':`<form id="rf"><select id="qr"><option value="">Réponse rapide…</option>${QR.map((x,i)=>`<option value="${i}">${esc(x.slice(0,70))}…</option>`).join('')}</select><textarea name="x" placeholder="Votre réponse au client…"></textarea><div class="err" id="re"></div><div><button class="btn primary">Envoyer la réponse</button></div></form>`}
  <form id="nf" class="note-box"><textarea name="x" placeholder="Note interne (non visible par le client)…"></textarea><div style="margin-top:8px"><button class="btn sm">Ajouter la note</button></div></form></div>`;
  const ms=$('#ms');ms.scrollTop=ms.scrollHeight;
  $('#ss').onchange=e=>{MA.setStatus(t.id,e.target.value);toast('Statut : '+STATUS[e.target.value].l);draw();badge()};
  $('#sp').onchange=e=>{MA.setPriority(t.id,e.target.value);toast('Priorité modifiée');draw()};
  const bd=$('#bdone');if(bd)bd.onclick=()=>{MA.setStatus(t.id,'done');toast('Ticket marqué comme traité');draw();badge()};
  const bc=$('#bclose');if(bc)bc.onclick=()=>{if(confirm('Fermer ce ticket ?')){MA.setStatus(t.id,'closed');toast('Ticket fermé');draw();badge()}};
  const br=$('#breopen');if(br)br.onclick=()=>{MA.setStatus(t.id,'progress');toast('Ticket rouvert');draw();badge()};
  $('#bdel').onclick=()=>{if(confirm('Supprimer définitivement ce ticket ?')){MA.deleteTicket(t.id);toast('Ticket supprimé');sel=null;history.replaceState(null,'','admin-tickets.html');draw();badge()}};
  const rf=$('#rf');if(rf){$('#qr').onchange=e=>{if(e.target.value!=='')rf.x.value=QR[+e.target.value]};
   rf.onsubmit=e=>{e.preventDefault();const v=rf.x.value.trim();if(v.length<2){$('#re').textContent='Écrivez une réponse.';return}MA.reply(t.id,'staff',v);toast('Réponse envoyée au client');draw();badge()}}
  $('#nf').onsubmit=e=>{e.preventDefault();const v=e.target.x.value.trim();if(!v)return;MA.addNote(t.id,v);toast('Note ajoutée');draw()};
 };
 $('#fs').onchange=e=>{fs=e.target.value;draw()};$('#fp').onchange=e=>{fp=e.target.value;draw()};$('#fq').oninput=e=>{fq=e.target.value.toLowerCase();draw()};
 draw();
 addEventListener('storage',e=>{if(e.key==='ma_tickets'&&!(document.activeElement&&/TEXTAREA|SELECT|INPUT/.test(document.activeElement.tagName)))draw()});
}

/* ===== services ===== */
const svEl=$('#svlist');
if(svEl){
 const draw=()=>{
  const L=MA.services();
  svEl.innerHTML=L.map((s,i)=>`<div class="svc ${s.active?'':'off'} up" style="--i:${i}"><div class="ord"><button data-up="${s.id}" ${i===0?'disabled':''} aria-label="Monter">▲</button><button data-dn="${s.id}" ${i===L.length-1?'disabled':''} aria-label="Descendre">▼</button></div><div><h3>${esc(s.name)} ${s.featured?'<span class="tagline" style="margin:0 0 0 6px">Mis en avant</span>':''}</h3><small>${esc(s.cat||'—')} · <b style="color:var(--ink)">${esc(MA.priceLabel(s))}</b> · ${esc(s.delay||'—')}</small><br><small>${esc(s.desc)}</small></div><label class="sw" title="Visible sur le site"><input type="checkbox" data-act="${s.id}" ${s.active?'checked':''} aria-label="Visible"><span></span></label><div class="acts"><button class="btn sm" data-ed="${s.id}">Modifier</button><button class="btn sm bad" data-del="${s.id}">Supprimer</button></div></div>`).join('')||'<div class="empty">Aucun service. Ajoutez le premier.</div>';
  $$('[data-act]').forEach(c=>c.onchange=()=>{const l=MA.services(),s=l.find(x=>x.id===c.dataset.act);s.active=c.checked;MA.saveServices(l);MA.log('service.visibilite',`${s.name} · ${s.active?'affiché':'masqué'} sur le site`);toast(s.name+(s.active?' affiché':' masqué'));draw()});
  const mv=(id,d)=>{const l=MA.services(),i=l.findIndex(x=>x.id===id),j=i+d;if(j<0||j>=l.length)return;[l[i],l[j]]=[l[j],l[i]];MA.saveServices(l);MA.log('service.ordre',`${l[j].name} déplacé en position ${j+1}`);draw()};
  $$('[data-up]').forEach(b=>b.onclick=()=>mv(b.dataset.up,-1));$$('[data-dn]').forEach(b=>b.onclick=()=>mv(b.dataset.dn,1));
  $$('[data-ed]').forEach(b=>b.onclick=()=>edit(b.dataset.ed));
  $$('[data-del]').forEach(b=>b.onclick=()=>{const l=MA.services(),s=l.find(x=>x.id===b.dataset.del);if(!confirm(`Supprimer le service « ${s.name} » ?`))return;MA.saveServices(l.filter(x=>x.id!==s.id));MA.log('service.suppression',`${s.name} (${MA.priceLabel(s)})`);MA.notify('service_change',{title:s.name,desc:'Service supprimé',fields:[['Par',ME.name]]});toast('Service supprimé');draw()});
 };
 const edit=id=>{
  const l=MA.services(),s=id?l.find(x=>x.id===id):{name:'',cat:'Site',prefix:'à partir de',price:0,unit:'HT',period:'',delay:'',desc:'',features:[],featured:false,active:true};
  const m=modal(`<h2>${id?'Modifier le service':'Nouveau service'}</h2><form class="f" id="sf" novalidate style="margin-top:16px"><div class="row2"><label>Nom<input name="name" value="${esc(s.name)}"><span class="err" data-e="name"></span></label><label>Catégorie<input name="cat" list="cats" value="${esc(s.cat)}"><datalist id="cats"><option>Site</option><option>Abonnement</option><option>Sur mesure</option></datalist></label></div>
  <div class="row2"><label>Préfixe du prix<input name="prefix" value="${esc(s.prefix)}" placeholder="à partir de"></label><label>Prix (0 = sur devis)<input name="price" type="number" min="0" step="1" value="${s.price}"><span class="err" data-e="price"></span></label></div>
  <div class="row2"><label>Unité<input name="unit" value="${esc(s.unit)}" placeholder="HT"></label><label>Périodicité<input name="period" value="${esc(s.period)}" placeholder="/ mois"></label></div>
  <label>Délai indicatif<input name="delay" value="${esc(s.delay)}" placeholder="5 jours"></label>
  <label>Description courte<input name="desc" value="${esc(s.desc)}"><span class="err" data-e="desc"></span></label>
  <label>Points inclus (un par ligne)<textarea name="features" rows="5">${esc((s.features||[]).join('\n'))}</textarea></label>
  <label class="chk"><input type="checkbox" name="featured" ${s.featured?'checked':''}><span>Mettre en avant (« Le plus demandé »)</span></label><label class="chk"><input type="checkbox" name="active" ${s.active?'checked':''}><span>Visible sur le site et dans les commandes</span></label>
  <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn" id="cx">Annuler</button><button class="btn primary">Enregistrer</button></div></form>`);
  $('#cx').onclick=closeM;
  $('#sf').onsubmit=e=>{e.preventDefault();const f=e.target;let ok=true;const E=(k,v)=>{$(`[data-e=${k}]`,f).textContent=v||'';if(v)ok=false};
   E('name',f.name.value.trim().length>=2?'':'Nom requis (2 caractères min.).');E('price',+f.price.value>=0&&f.price.value!==''?'':'Prix invalide.');E('desc',f.desc.value.trim().length>=5?'':'Description requise (5 caractères min.).');if(!ok)return;
   const n={name:f.name.value.trim(),cat:f.cat.value.trim(),prefix:f.prefix.value.trim(),price:+f.price.value,unit:f.unit.value.trim()||'HT',period:f.period.value.trim(),delay:f.delay.value.trim(),desc:f.desc.value.trim(),features:f.features.value.split('\n').map(x=>x.trim()).filter(Boolean),featured:f.featured.checked,active:f.active.checked};
   if(id){const ch=[];const L={name:'nom',cat:'catégorie',prefix:'préfixe',price:'prix',unit:'unité',period:'périodicité',delay:'délai',desc:'description',featured:'mise en avant',active:'visibilité'};Object.keys(L).forEach(k=>{if(s[k]!==n[k])ch.push(k==='price'?`${L[k]} ${s[k]} → ${n[k]}`:L[k])});if(JSON.stringify(s.features)!==JSON.stringify(n.features))ch.push('points inclus');
    Object.assign(l.find(x=>x.id===id),n);MA.saveServices(l);MA.log('service.modification',`${n.name} · ${ch.join(', ')||'aucun changement'}`);MA.notify('service_change',{title:n.name,desc:'Service modifié : '+(ch.join(', ')||'—'),fields:[['Par',ME.name]]})}
   else{const sid=n.name.toLowerCase().normalize('NFD').replace(/[^\w]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36).slice(-3);l.push({id:sid,...n});MA.saveServices(l);MA.log('service.creation',`${n.name} · ${MA.priceLabel(n)}`);MA.notify('service_change',{title:n.name,desc:'Nouveau service : '+MA.priceLabel(n),fields:[['Par',ME.name]]})}
   closeM();toast(id?'Service enregistré':'Service créé');draw()};
 };
 $('#addsv').onclick=()=>edit(null);
 draw();
}

/* ===== comptes ===== */
const acEl=$('#accounts');
if(acEl){
 let fq='';
 const draw=()=>{
  const T=MA.tickets(),U=MA.users().filter(u=>!fq||(u.name+u.email+u.company).toLowerCase().includes(fq));
  $('#cnt').textContent=U.length+' compte(s)';
  acEl.innerHTML=`<table><thead><tr><th>Nom</th><th>E-mail</th><th>Société</th><th>Rôle</th><th>Inscrit</th><th>Tickets</th><th></th></tr></thead><tbody>${U.map(u=>`<tr><td><b>${esc(u.name)}</b>${u.demo?' <span class="pill">démo</span>':''}</td><td>${esc(u.email)}</td><td>${esc(u.company||'—')}</td><td><span class="pill ${u.role==='admin'?'p-progress':''}">${u.role==='admin'?'Administrateur':'Client'}</span></td><td>${MA.date(u.created)}</td><td>${T.filter(t=>t.userId===u.id).length}</td><td style="text-align:right;white-space:nowrap">${u.id===ME.id?'<span style="color:var(--mut)">vous</span>':`<button class="btn sm" data-role="${u.id}">${u.role==='admin'?'Retirer admin':'Passer admin'}</button> <button class="btn sm bad" data-del="${u.id}">Supprimer</button>`}</td></tr>`).join('')}</tbody></table>`;
  $$('[data-role]').forEach(b=>b.onclick=()=>{const us=MA.users(),u=us.find(x=>x.id===b.dataset.role);if(!confirm(`${u.role==='admin'?'Retirer les droits d\'administration à':'Donner les droits d\'administration à'} ${u.name} ?`))return;const o=u.role;u.role=o==='admin'?'client':'admin';MA.saveUsers(us);MA.log('compte.role',`${u.name} <${u.email}> · ${o} → ${u.role}`);toast('Rôle modifié');draw()});
  $$('[data-del]').forEach(b=>b.onclick=()=>{const u=MA.users().find(x=>x.id===b.dataset.del);if(confirm(`Supprimer le compte de ${u.name} ? Ses demandes ouvertes seront fermées.`)){MA.deleteAccount(u.id,'admin');toast('Compte supprimé');draw()}});
 };
 $('#fq').oninput=e=>{fq=e.target.value.toLowerCase();draw()};draw();
 addEventListener('storage',e=>{if(e.key==='ma_users')draw()});
}

/* ===== journal ===== */
const lgEl=$('#logs');
if(lgEl){
 let fq='',fg='',ft='',d1='',d2='',page=1;const PER=20;
 const types=()=>Object.keys(LOGT).filter(k=>!fg||LOGT[k][1]===fg);
 const get=()=>MA.logs().filter(l=>(!fg||(LOGT[l.type]&&LOGT[l.type][1]===fg))&&(!ft||l.type===ft)&&(!fq||(l.detail+l.actor+(LOGT[l.type]?LOGT[l.type][0]:l.type)).toLowerCase().includes(fq))&&(!d1||l.t>=new Date(d1).getTime())&&(!d2||l.t<new Date(d2).getTime()+MA.DAY));
 const draw=()=>{
  const all=get(),pages=Math.max(1,Math.ceil(all.length/PER));page=Math.min(page,pages);
  $('#ft').innerHTML='<option value="">Tous les types</option>'+types().map(k=>`<option value="${k}" ${k===ft?'selected':''}>${LOGT[k][0]}</option>`).join('');
  $('#cnt').textContent=all.length+' entrée(s) sur '+MA.logs().length;
  lgEl.innerHTML=`<table><thead><tr><th>Date</th><th>Événement</th><th>Acteur</th><th>Détail</th></tr></thead><tbody>${all.slice((page-1)*PER,page*PER).map(l=>{const m=LOGT[l.type]||[l.type,'',''];return `<tr><td style="white-space:nowrap">${MA.dt(l.t)}</td><td><span class="pill ${m[2]?'p-'+m[2]:''}">${m[0]}</span></td><td style="white-space:nowrap">${esc(l.actor)}</td><td>${esc(l.detail)}</td></tr>`}).join('')||'<tr><td colspan="4" class="empty">Aucune entrée.</td></tr>'}</tbody></table>`;
  pager($('#pg'),all.length,PER,page,p=>{page=p;draw()});
 };
 $('#fq').oninput=e=>{fq=e.target.value.toLowerCase();page=1;draw()};
 $('#fg').innerHTML='<option value="">Toutes les catégories</option>'+GROUPS.map(g=>`<option>${g}</option>`).join('');
 $('#fg').onchange=e=>{fg=e.target.value;ft='';page=1;draw()};$('#ft').onchange=e=>{ft=e.target.value;page=1;draw()};
 $('#d1').onchange=e=>{d1=e.target.value;page=1;draw()};$('#d2').onchange=e=>{d2=e.target.value;page=1;draw()};
 $('#csv').onclick=()=>{const rows=get();MA.log('admin.export',`Journal exporté (${rows.length} entrées)`);download('journal-my-apps.csv',[['Date','Événement','Acteur','Détail'],...rows.map(l=>[new Date(l.t).toISOString(),(LOGT[l.type]||[l.type])[0],l.actor,l.detail])]);toast('Export CSV téléchargé');draw()};
 $('#purge').onclick=()=>{if(!confirm('Purger tout le journal ? Cette action est irréversible (elle sera elle-même enregistrée).'))return;MA.sv('logs',[]);MA.log('admin.purge','Journal purgé par '+ME.name);toast('Journal purgé');page=1;draw()};
 draw();addEventListener('storage',e=>{if(e.key==='ma_logs')draw()});
}

/* ===== réglages ===== */
const stEl=$('#settings');
if(stEl){
 let tab='discord';
 const save=(s,detail)=>{MA.sv('settings',s);MA.log('admin.parametres',detail);toast('Réglages enregistrés')};
 const EVN={ticket_open:['Nouveau ticket','À chaque ouverture de demande (avec mention)'],ticket_reply:['Nouveau message','Réponses du client et de l\'équipe'],ticket_status:['Changement de statut','En attente, en cours, traité'],ticket_close:['Fermeture de ticket','Quand une demande est fermée'],account_create:['Création de compte','Nouvelle inscription client'],account_delete:['Suppression de compte','Compte supprimé par le client ou un admin'],service_change:['Modification d\'un service','Création, édition, suppression']};
 const draw=()=>{
  const S=MA.settings();$$('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  if(tab==='discord'){const d=S.discord;const ob=MA.ld('outbox',[]);
   stEl.innerHTML=`<div class="panels"><div class="panel"><h3>Webhook Discord</h3><p class="sub">Chaque événement coché est publié dans le salon du webhook, sous l'identité du « bot » ci-dessous.</p><form class="f" id="df" novalidate>
   <div class="row" style="padding-top:0"><div><b>Activer les notifications</b><small>Sans webhook valide, les notifications sont simulées et tracées</small></div><label class="sw"><input type="checkbox" name="enabled" ${d.enabled?'checked':''}><span></span></label></div>
   <label>Webhook par défaut (tous les événements)<input name="webhook" value="${esc(d.webhook)}" placeholder="https://discord.com/api/webhooks/…" autocomplete="off" spellcheck="false"><span class="err" data-e="webhook"></span></label>
   <div class="row2"><label>Nom du bot<input name="botName" value="${esc(d.botName)}"></label><label>Mention (ID de rôle, @here…)<input name="mention" value="${esc(d.mention)}" placeholder="@here"></label></div>
   <label>Avatar du bot (URL de l'image)<input name="avatar" value="${esc(d.avatar)}" placeholder="https://…"></label>
   <h3 style="font-size:1rem;margin-top:6px">Événements notifiés</h3><p class="sub" style="margin:-6px 0 0">Chaque événement utilise le webhook par défaut, sauf si vous renseignez un webhook spécifique.</p>${Object.keys(EVN).map(k=>`<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div class="row" style="padding:0;border:0"><div><b>${EVN[k][0]}</b><small>${EVN[k][1]}</small></div><label class="sw"><input type="checkbox" name="ev_${k}" ${d.events[k]?'checked':''}><span></span></label></div><input name="hk_${k}" value="${esc(d.hooks[k]||'')}" placeholder="Webhook spécifique (facultatif) — sinon : webhook par défaut" autocomplete="off" spellcheck="false" style="margin-top:8px"><span class="err" data-e="hk_${k}"></span></div>`).join('')}
   <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary">Enregistrer</button><button type="button" class="btn" id="tst">Envoyer un message de test</button></div><div id="tr"></div></form></div>
   <div class="panel"><h3>Comment ça marche</h3><ol style="padding-left:18px;color:var(--mut);display:grid;gap:8px"><li>Dans Discord : <b>Paramètres du salon → Intégrations → Webhooks → Nouveau webhook</b>.</li><li>Choisissez le salon, nommez le bot, puis <b>Copier l'URL du webhook</b>.</li><li>Collez l'URL ci-contre, activez les notifications et testez.</li></ol><p class="sub" style="margin-top:16px">Un webhook publie des messages : il n'a pas besoin de jeton de bot. Pour répondre aux clients, utilisez cette administration (un bot interactif nécessiterait un serveur dédié).</p>
   <h3 style="margin-top:26px">Dernières notifications</h3>${ob.length?`<div class="tw"><table style="min-width:0"><tbody>${ob.slice(0,8).map(o=>`<tr><td><b>${esc(o.label)}</b><br><small style="color:var(--mut)">${esc(o.title)} · webhook ${esc(o.hook||'par défaut')}</small></td><td><span class="pill ${o.status==='sent'?'p-ok':o.status==='failed'?'p-bad':''}">${o.status==='sent'?'envoyée':o.status==='failed'?'échec':'simulée'}</span><br><small style="color:var(--mut)">${MA.ago(o.t)}</small></td></tr>`).join('')}</tbody></table></div>`:'<p style="color:var(--mut)">Aucune notification pour le moment.</p>'}</div></div>`;
   $('#df').onsubmit=e=>{e.preventDefault();const f=e.target,en=f.enabled.checked,w=f.webhook.value.trim();
    if(w&&!MA.webhookOk(w)){$('[data-e=webhook]',f).textContent='URL invalide (https://discord.com/api/webhooks/ID/JETON).';return}
    const ev={},hk={};let bad=false;
    Object.keys(EVN).forEach(k=>{ev[k]=f['ev_'+k].checked;const h=f['hk_'+k].value.trim();$('[data-e=hk_'+k+']',f).textContent='';if(h){if(!MA.webhookOk(h)){$('[data-e=hk_'+k+']',f).textContent='URL de webhook invalide.';bad=true}else hk[k]=h}});
    if(bad)return;
    const miss=Object.keys(EVN).filter(k=>ev[k]&&!hk[k]);
    if(en&&!w&&miss.length){$('[data-e=webhook]',f).textContent='Indiquez un webhook par défaut ou un webhook spécifique pour chaque événement activé.';return}
    const s=MA.settings();const was=s.discord;const ch=[];if(was.enabled!==en)ch.push('notifications '+(en?'activées':'désactivées'));if(was.webhook!==w)ch.push('URL du webhook modifiée');if(was.botName!==f.botName.value.trim())ch.push('nom du bot');if(was.mention!==f.mention.value.trim())ch.push('mention');if(was.avatar!==f.avatar.value.trim())ch.push('avatar');if(JSON.stringify(was.events)!==JSON.stringify(ev))ch.push('événements notifiés');if(JSON.stringify(was.hooks||{})!==JSON.stringify(hk))ch.push('webhooks spécifiques ('+Object.keys(hk).length+')');
    s.discord={enabled:en,webhook:w,botName:f.botName.value.trim(),avatar:f.avatar.value.trim(),mention:f.mention.value.trim(),events:ev,hooks:hk};
    save(s,'Discord · '+(ch.join(', ')||'aucun changement'));draw()};
   $('#tst').onclick=async()=>{const b=$('#tst'),r=$('#tr');b.disabled=true;r.innerHTML='<p style="color:var(--mut)">Envoi…</p>';const f=$('#df'),res=await MA.testDiscord({...MA.settings().discord,webhook:f.webhook.value.trim(),botName:f.botName.value.trim(),avatar:f.avatar.value.trim()});MA.log('discord.test',`Test · ${res.info}`);b.disabled=false;r.innerHTML=`<div class="notice ${res.status==='sent'?'ok':'bad'}" style="margin:12px 0 0">${esc(res.info)}</div>`}}
  if(tab==='agency'){const a=S.agency;
   stEl.innerHTML=`<div class="panel" style="max-width:640px"><h3>Informations de l'agence</h3><form class="f" id="af" novalidate style="margin-top:14px"><label>Nom<input name="name" value="${esc(a.name)}"></label><label>E-mail de contact<input name="email" value="${esc(a.email)}"><span class="err" data-e="email"></span></label><label>Préfixe des références de tickets<input name="prefix" value="${esc(a.prefix)}" maxlength="5"><span class="err" data-e="prefix"></span></label><div><button class="btn primary">Enregistrer</button></div></form></div>`;
   $('#af').onsubmit=e=>{e.preventDefault();const f=e.target;let ok=true;const E=(k,v)=>{$(`[data-e=${k}]`,f).textContent=v||'';if(v)ok=false};E('email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())?'':'Adresse invalide.');E('prefix',/^[A-Za-z]{2,5}$/.test(f.prefix.value.trim())?'':'2 à 5 lettres.');if(!ok)return;
    const s=MA.settings();s.agency={name:f.name.value.trim()||'My-Apps',email:f.email.value.trim(),prefix:f.prefix.value.trim().toUpperCase()};save(s,'Agence · informations modifiées');draw()}}
  if(tab==='data'){
   stEl.innerHTML=`<div class="panels"><div class="panel"><h3>Exporter</h3><p class="sub">Télécharge toutes les données (services, comptes, tickets, journal) au format JSON.</p><button class="btn" id="ex">Exporter les données</button></div><div class="panel"><h3>Réinitialiser la démonstration</h3><p class="sub">Efface comptes, tickets, services et journal, puis recharge les données d'exemple.</p><button class="btn bad" id="rs">Réinitialiser</button></div></div>`;
   $('#ex').onclick=()=>{const o={};Object.keys(localStorage).filter(k=>k.startsWith('ma_')&&k!=='ma_session').forEach(k=>o[k]=JSON.parse(localStorage.getItem(k)));o.ma_users=(o.ma_users||[]).map(u=>({...u,pass:'***'}));MA.log('admin.export','Export complet des données (JSON)');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download='my-apps-donnees.json';a.click();toast('Export téléchargé')};
   $('#rs').onclick=()=>{if(!confirm('Réinitialiser toutes les données de démonstration ?'))return;Object.keys(localStorage).filter(k=>k.startsWith('ma_')&&k!=='ma_session').forEach(k=>localStorage.removeItem(k));location.href='admin.html?reset=1'}}
 };
 $$('.seg button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});draw();
}
if(page==='dash'&&q.get('reset')){MA.log('admin.reset','Données de démonstration réinitialisées');history.replaceState(null,'','admin.html')}
})();
