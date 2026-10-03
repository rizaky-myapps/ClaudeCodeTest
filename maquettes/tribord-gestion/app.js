const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
const bg=$('.burger');if(bg)bg.onclick=()=>$('header nav').classList.toggle('open');
const toast=m=>{let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2200)};
const eur=n=>(Math.round(n*100)/100).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const DAY=86400000,iso=d=>new Date(d).toISOString().slice(0,10),off=n=>iso(Date.now()+n*DAY);
const fd=d=>new Date(d+'T12:00').toLocaleDateString('fr-FR');
const color=n=>{let h=0;for(const c of n)h=(h*37+c.charCodeAt(0))%360;return `hsl(${h} 45% 42%)`};
const av=n=>`<span class="av" style="background:${color(n)}">${esc(n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</span>`;
/* ----- données ----- */
const CL0=[{id:1,n:'Atelier Mirabelle',siret:'812 345 678 00019',email:'compta@atelier-mirabelle.example',adr:'12 rue des Tanneurs, 54000 Nancy'},{id:2,n:'Brasserie du Port',siret:'790 112 334 00027',email:'gestion@brasserie-port.example',adr:'5 quai Lamartine, 76600 Le Havre'},{id:3,n:'Studio Tramontane',siret:'884 220 119 00033',email:'admin@tramontane.example',adr:'48 cours Mirabeau, 13100 Aix-en-Provence'},{id:4,n:'Maison Pivoine',siret:'901 663 207 00014',email:'factures@pivoine.example',adr:'3 place du Marché, 37000 Tours'},{id:5,n:'Cabinet Delorme',siret:'752 981 440 00041',email:'secretariat@delorme.example',adr:'27 avenue Foch, 69006 Lyon'}];
const L=(d,q,pu,t=20)=>({d,q,pu,tva:t});
const IN0=[{id:1,cid:1,date:off(-95),due:off(-65),paid:off(-60),lines:[L('Refonte du site vitrine',1,2400),L('Hébergement annuel',1,240)]},{id:2,cid:2,date:off(-70),due:off(-40),paid:off(-38),lines:[L('Maintenance mensuelle',3,180),L('Développement module réservation',1,1850)]},{id:3,cid:3,date:off(-48),due:off(-18),paid:null,lines:[L('Identité visuelle',1,1600),L('Déclinaisons réseaux sociaux',4,120)]},{id:4,cid:4,date:off(-30),due:off(0),paid:off(-3),lines:[L('Boutique en ligne',1,3200),L('Formation (demi-journée)',2,350)]},{id:5,cid:5,date:off(-16),due:off(14),paid:null,lines:[L('Audit de sécurité',1,950),L('Rapport et recommandations',1,400)]},{id:6,cid:1,date:off(-8),due:off(22),paid:null,lines:[L('Maintenance mensuelle',2,180)]},{id:7,cid:2,date:off(-3),due:off(27),paid:null,lines:[L('Évolution du site',1,1200,20)],draft:true}];
const EM0=[{id:1,n:'Julien Marchetti',poste:'Développeur senior',brut:3850,date:'2021-03-01',pas:9.8},{id:2,n:'Aurélie Pinson',poste:'Cheffe de projet',brut:3400,date:'2022-09-12',pas:8.0},{id:3,n:'Sofiane Haddad',poste:'Designer UI',brut:2950,date:'2023-01-16',pas:5.4},{id:4,n:'Pauline Vasseur',poste:'Comptable',brut:2780,date:'2020-06-01',pas:4.6},{id:5,n:'Mathieu Corre',poste:'Développeur',brut:2650,date:'2024-02-05',pas:3.2}];
const clients=()=>{let c=ld('tribord_cl',null);if(!c){c=CL0;sv('tribord_cl',c)}return c};
const invs=()=>{let i=ld('tribord_in',null);if(!i){i=IN0;sv('tribord_in',i)}return i};
const emps=()=>{let e=ld('tribord_em',null);if(!e){e=EM0;sv('tribord_em',e)}return e};
const tot=i=>{const ht=i.lines.reduce((a,l)=>a+l.q*l.pu,0),rem=ht*(i.rem||0)/100,net=ht-rem,tva=i.lines.reduce((a,l)=>a+l.q*l.pu*(1-(i.rem||0)/100)*l.tva/100,0);return{ht,rem,net,tva,ttc:net+tva}};
const num=i=>'FA-2026-'+String(i.id).padStart(3,'0');
const status=i=>i.draft?['Brouillon','s-draft']:i.paid?['Payée','s-paid']:i.due<iso(Date.now())?['En retard','s-late']:['En attente','s-wait'];
const cname=id=>(clients().find(c=>c.id===id)||{n:'—'}).n;
/* ----- graphique ----- */
function bars(el,vals,labels){const W=620,H=230,P={l:50,b:26,t:10},max=Math.max(...vals)*1.15,bw=(W-P.l)/vals.length;
 el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${[0,.5,1].map(f=>{const y=H-P.b-f*(H-P.b-P.t);return `<line x1="${P.l}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${P.l-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--mut)">${Math.round(max*f/1000)} k€</text>`}).join('')}${vals.map((v,i)=>{const h=v/max*(H-P.b-P.t);return `<rect x="${P.l+i*bw+bw*.2}" y="${H-P.b-h}" width="${bw*.6}" height="${h}" rx="4" fill="var(--a)" opacity=".9"><title>${labels[i]} : ${eur(v)}</title><animate attributeName="height" from="0" to="${h}" dur=".6s" fill="freeze"/><animate attributeName="y" from="${H-P.b}" to="${H-P.b-h}" dur=".6s" fill="freeze"/></rect><text x="${P.l+i*bw+bw/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mut)">${labels[i]}</text>`}).join('')}</svg>`}
/* ----- tableau de bord ----- */
const dash=$('#dash');
if(dash){const I=invs().filter(i=>!i.draft),T=i=>tot(i).ttc;const paid=I.filter(i=>i.paid),unp=I.filter(i=>!i.paid),late=unp.filter(i=>i.due<iso(Date.now()));
 const since=off(-30),ca=I.filter(i=>i.date>=since).reduce((a,i)=>a+tot(i).net,0);
 const tvaDue=I.reduce((a,i)=>a+tot(i).tva,0)-I.reduce((a,i)=>a+tot(i).tva,0)*0.3;
 $('#kp').innerHTML=[['CA facturé (30 jours)',eur(ca),'hors brouillons','up'],['Encaissé (90 j)',eur(paid.reduce((a,i)=>a+T(i),0)),paid.length+' factures payées','up'],['En attente',eur(unp.reduce((a,i)=>a+T(i),0)),unp.length+' facture(s)','dn'],['En retard',eur(late.reduce((a,i)=>a+T(i),0)),late.length+' facture(s) à relancer',late.length?'dn':'up']].map(k=>`<div class="card kpi"><small>${k[0]}</small><b class="n">${k[1]}</b><span class="d ${k[3]}">${k[2]}</span></div>`).join('');
 const MS=['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'],now=new Date(),lab=[],val=[];
 for(let k=5;k>=0;k--){const d=new Date(now.getFullYear(),now.getMonth()-k,1),key=iso(d).slice(0,7);lab.push(MS[d.getMonth()]);val.push(I.filter(i=>i.date.slice(0,7)===key).reduce((a,i)=>a+tot(i).net,0)||1800+k*210)}
 bars($('#ch'),val,lab);
 $('#due').innerHTML=unp.sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5).map(i=>{const s=status(i);return `<tr><td><a href="facture.html?id=${i.id}"><b>${num(i)}</b></a><br><small style="color:var(--mut)">${esc(cname(i.cid))}</small></td><td class="r n">${eur(T(i))}</td><td class="r"><span class="pill ${s[1]}">${s[0]}</span><br><small style="color:var(--mut)">${fd(i.due)}</small></td></tr>`}).join('')||'<tr><td colspan="3" style="color:var(--mut)">Aucune facture en attente.</td></tr>'}
/* ----- liste des factures ----- */
const fl=$('#flist');
if(fl){let q='',f='all';const chips=$('#chips');
 const draw=()=>{const r=invs().filter(i=>{const s=status(i)[0];return(f==='all'||s===f)&&(!q||(num(i)+cname(i.cid)).toLowerCase().includes(q))}).sort((a,b)=>b.date.localeCompare(a.date));
  const sum=r.reduce((a,i)=>a+tot(i).ttc,0);$('#sum').textContent=r.length+' facture(s) · '+eur(sum);
  fl.innerHTML=`<table><thead><tr><th>N°</th><th>Client</th><th>Émission</th><th>Échéance</th><th class="r">Montant TTC</th><th>Statut</th><th></th></tr></thead><tbody>${r.map(i=>{const s=status(i);return `<tr><td><a href="facture.html?id=${i.id}"><b>${num(i)}</b></a></td><td>${esc(cname(i.cid))}</td><td>${fd(i.date)}</td><td>${fd(i.due)}</td><td class="r n"><b>${eur(tot(i).ttc)}</b></td><td><span class="pill ${s[1]}">${s[0]}</span></td><td style="white-space:nowrap;text-align:right"><a class="btn o s" href="facture.html?id=${i.id}">Voir</a> ${!i.paid&&!i.draft?`<button class="btn s" data-p="${i.id}">Marquer payée</button>`:''}${i.draft?`<button class="btn s" data-s="${i.id}">Émettre</button>`:''} <button class="btn o s" style="color:var(--bad)" data-x="${i.id}">✕</button></td></tr>`}).join('')||'<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--mut)">Aucune facture.</td></tr>'}</tbody></table>`;
  $$('[data-p]').forEach(b=>b.onclick=()=>{const a=invs();a.find(x=>x.id===+b.dataset.p).paid=iso(Date.now());sv('tribord_in',a);toast('Facture marquée comme payée');draw()});
  $$('[data-s]').forEach(b=>b.onclick=()=>{const a=invs();delete a.find(x=>x.id===+b.dataset.s).draft;sv('tribord_in',a);toast('Facture émise');draw()});
  $$('[data-x]').forEach(b=>b.onclick=()=>{if(confirm('Supprimer cette facture ?')){sv('tribord_in',invs().filter(x=>x.id!==+b.dataset.x));toast('Facture supprimée');draw()}})};
 chips.innerHTML=['all','En attente','En retard','Payée','Brouillon'].map((c,i)=>`<button data-f="${c}" class="${i?'':'on'}">${c==='all'?'Toutes':c}</button>`).join('');
 chips.onclick=e=>{const b=e.target.closest('button');if(!b)return;f=b.dataset.f;$$('button',chips).forEach(x=>x.classList.toggle('on',x===b));draw()};
 $('#q').oninput=e=>{q=e.target.value.toLowerCase();draw()};
 $('#csv').onclick=()=>{const rows=[['Numéro','Client','Date','Échéance','HT','TVA','TTC','Statut'],...invs().map(i=>{const t=tot(i);return[num(i),cname(i.cid),i.date,i.due,t.net.toFixed(2),t.tva.toFixed(2),t.ttc.toFixed(2),status(i)[0]]})];const b=new Blob(['﻿'+rows.map(r=>r.join(';')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='factures.csv';a.click();toast('Export CSV téléchargé')};
 draw()}
/* ----- nouvelle facture ----- */
const nf=$('#nf');
if(nf){nf.c.innerHTML=clients().map(c=>`<option value="${c.id}">${esc(c.n)}</option>`).join('');nf.d.value=off(0);nf.e.value=off(30);
 const tb=$('#lb');const row=(l={d:'',q:1,pu:'',tva:20})=>`<tr><td><input data-k="d" value="${esc(l.d)}" placeholder="Désignation"></td><td style="width:80px"><input data-k="q" type="number" min="1" step="1" value="${l.q}"></td><td style="width:120px"><input data-k="pu" type="number" min="0" step="0.01" value="${l.pu}" placeholder="0,00"></td><td style="width:100px"><select data-k="tva"><option ${l.tva===20?'selected':''}>20</option><option ${l.tva===10?'selected':''}>10</option><option ${l.tva===5.5?'selected':''}>5.5</option><option ${l.tva===0?'selected':''}>0</option></select></td><td style="width:44px"><button type="button" class="x" aria-label="Supprimer">×</button></td></tr>`;
 tb.innerHTML=row();
 const get=()=>$$('tr',tb).map(tr=>({d:$('[data-k=d]',tr).value.trim(),q:+$('[data-k=q]',tr).value||0,pu:+$('[data-k=pu]',tr).value||0,tva:+$('[data-k=tva]',tr).value}));
 const calc=()=>{const t=tot({lines:get(),rem:+nf.r.value||0});$('#tht').textContent=eur(t.ht);$('#trem').textContent='−'+eur(t.rem);$('#ttva').textContent=eur(t.tva);$('#tttc').textContent=eur(t.ttc)};
 nf.addEventListener('input',calc);$('#addl').onclick=()=>{tb.insertAdjacentHTML('beforeend',row());calc()};
 tb.onclick=e=>{if(e.target.classList.contains('x')&&$$('tr',tb).length>1){e.target.closest('tr').remove();calc()}};
 const save=draft=>{const lines=get().filter(l=>l.d);let ok=true;$('#el').textContent=lines.length?'':(ok=false,'Ajoutez au moins une ligne avec une désignation.');const bad=lines.some(l=>l.q<1||l.pu<=0);if(lines.length&&bad){$('#el').textContent='Quantité et prix doivent être positifs.';ok=false}
  const rem=+nf.r.value||0;if(rem<0||rem>100){$('#er').textContent='Remise entre 0 et 100 %.';ok=false}else $('#er').textContent='';
  if(nf.e.value<nf.d.value){$('#ee').textContent='L\'échéance précède la date d\'émission.';ok=false}else $('#ee').textContent='';
  if(!ok)return;const a=invs();const id=Math.max(0,...a.map(x=>x.id))+1;a.push({id,cid:+nf.c.value,date:nf.d.value,due:nf.e.value,paid:null,rem,lines,draft:draft||undefined});sv('tribord_in',a);location.href='facture.html?id='+id};
 nf.onsubmit=e=>{e.preventDefault();save(false)};$('#draft').onclick=()=>save(true);calc()}
/* ----- facture imprimable ----- */
const iv=$('#invoice');
if(iv){const id=+new URLSearchParams(location.search).get('id'),i=invs().find(x=>x.id===id)||invs()[0],c=clients().find(x=>x.id===i.cid)||{n:'—',adr:'',siret:''},t=tot(i),s=status(i);document.title=num(i)+' – Tribord Gestion';
 iv.innerHTML=`<div class="inv"><div class="hd"><div><h1>Facture ${num(i)}</h1><div class="meta">Émise le ${fd(i.date)} · Échéance le ${fd(i.due)}</div><p style="margin-top:8px"><span class="pill ${s[1]}">${s[0]}${i.paid?' le '+fd(i.paid):''}</span></p></div><div style="text-align:right"><b style="font-size:1.2rem">Tribord Gestion</b><br><span class="meta">8 quai des Chartreux<br>44000 Nantes<br>SIRET 123 456 789 00012</span></div></div>
 <div class="parties"><div><b>Facturé à</b>${esc(c.n)}<br>${esc(c.adr)}<br>SIRET ${esc(c.siret)}</div><div><b>Conditions</b>Paiement à 30 jours<br>Virement bancaire<br>IBAN FR76 0000 0000 0000 0000 0000 000</div></div>
 <table><thead><tr><th>Désignation</th><th class="r">Qté</th><th class="r">PU HT</th><th class="r">TVA</th><th class="r">Total HT</th></tr></thead><tbody>${i.lines.map(l=>`<tr><td>${esc(l.d)}</td><td class="r n">${l.q}</td><td class="r n">${eur(l.pu)}</td><td class="r n">${l.tva} %</td><td class="r n">${eur(l.q*l.pu)}</td></tr>`).join('')}</tbody></table>
 <div class="tot" style="margin-top:20px"><div><span>Total HT</span><span class="n">${eur(t.ht)}</span></div>${i.rem?`<div><span>Remise ${i.rem} %</span><span class="n">−${eur(t.rem)}</span></div>`:''}<div><span>TVA</span><span class="n">${eur(t.tva)}</span></div><div class="g"><span>Total TTC</span><span class="n">${eur(t.ttc)}</span></div></div>
 <div class="foot">En cas de retard de paiement, une pénalité de trois fois le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de recouvrement de 40 €. Pas d'escompte pour paiement anticipé. Document fictif à des fins de démonstration.</div></div>`;
 const act=$('#acts');act.innerHTML=`<button class="btn" id="pr">Imprimer / PDF</button>${!i.paid&&!i.draft?'<button class="btn o" id="pd">Marquer payée</button>':''}<a class="btn o" href="factures.html">← Factures</a>`;
 $('#pr').onclick=()=>print();const pd=$('#pd');if(pd)pd.onclick=()=>{const a=invs();a.find(x=>x.id===i.id).paid=iso(Date.now());sv('tribord_in',a);location.reload()}}
/* ----- clients ----- */
const cl=$('#clients');
if(cl){const draw=()=>{const I=invs();cl.innerHTML=`<table><thead><tr><th>Client</th><th>Contact</th><th class="r">Factures</th><th class="r">CA TTC</th></tr></thead><tbody>${clients().map(c=>{const m=I.filter(i=>i.cid===c.id&&!i.draft);return `<tr><td><div class="emp">${av(c.n)}<div><b>${esc(c.n)}</b><br><small style="color:var(--mut)">${esc(c.adr)}</small></div></div></td><td>${esc(c.email)}</td><td class="r n">${m.length}</td><td class="r n"><b>${eur(m.reduce((a,i)=>a+tot(i).ttc,0))}</b></td></tr>`}).join('')}</tbody></table>`};draw();
 const m=$('#modal'),f=$('#cf');$('#add').onclick=()=>{f.reset();$$('.err',f).forEach(x=>x.textContent='');m.classList.add('on');f.n.focus()};$('#mc').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};
 f.onsubmit=e=>{e.preventDefault();let ok=true;const n=f.n.value.trim(),em=f.email.value.trim(),sr=f.siret.value.replace(/\s/g,'');$('[data-e=n]').textContent=n.length>1?'':(ok=false,'Raison sociale requise.');$('[data-e=email]').textContent=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?'':(ok=false,'E-mail invalide.');$('[data-e=siret]').textContent=/^\d{14}$/.test(sr)?'':(ok=false,'Le SIRET comporte 14 chiffres.');if(!ok)return;
  const a=clients();a.push({id:Math.max(0,...a.map(x=>x.id))+1,n,siret:sr.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/,'$1 $2 $3 $4'),email:em,adr:f.adr.value.trim()});sv('tribord_cl',a);m.classList.remove('on');toast('Client ajouté');draw()}}
/* ----- paie ----- */
function paie(e){const b=e.brut,sec=b*.073,ret=b*.0315,csg=b*.9825*.097,mut=18,cot=sec+ret+csg+mut,net=b-cot,pas=net*e.pas/100,pay=net-pas,pat=b*.42;return{b,sec,ret,csg,mut,cot,net,pas,pay,pat,cout:b+pat}}
const el=$('#emps');
if(el){const draw=()=>{el.innerHTML=`<table><thead><tr><th>Salarié</th><th>Poste</th><th>Entrée</th><th class="r">Brut mensuel</th><th class="r">Net à payer</th><th></th></tr></thead><tbody>${emps().map(e=>{const p=paie(e);return `<tr><td><div class="emp">${av(e.n)}<b>${esc(e.n)}</b></div></td><td>${esc(e.poste)}</td><td>${fd(e.date)}</td><td class="r n">${eur(e.brut)}</td><td class="r n"><b>${eur(p.pay)}</b></td><td style="text-align:right;white-space:nowrap"><a class="btn o s" href="bulletin.html?id=${e.id}">Bulletin de paie</a> <button class="btn o s" style="color:var(--bad)" data-x="${e.id}">✕</button></td></tr>`}).join('')}</tbody></table>`;
  const t=emps().reduce((a,e)=>({b:a.b+e.brut,c:a.c+paie(e).cout}),{b:0,c:0});$('#mass').textContent=eur(t.b);$('#cout').textContent=eur(t.c);$('#eff').textContent=emps().length;
  $$('[data-x]').forEach(b=>b.onclick=()=>{if(confirm('Supprimer ce salarié ?')){sv('tribord_em',emps().filter(x=>x.id!==+b.dataset.x));toast('Salarié supprimé');draw()}})};draw();
 const m=$('#modal'),f=$('#ef');$('#add').onclick=()=>{f.reset();$$('.err',f).forEach(x=>x.textContent='');f.date.value=off(0);m.classList.add('on');f.n.focus()};$('#mc').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};
 f.onsubmit=e=>{e.preventDefault();let ok=true;const n=f.n.value.trim(),p=f.poste.value.trim(),b=+f.brut.value,pas=+f.pas.value;$('[data-e=n]').textContent=n.length>3?'':(ok=false,'Nom complet requis.');$('[data-e=poste]').textContent=p.length>2?'':(ok=false,'Poste requis.');$('[data-e=brut]').textContent=b>=1801?'':(ok=false,'Brut mensuel minimum : 1 801 € (SMIC).');$('[data-e=pas]').textContent=pas>=0&&pas<=43?'':(ok=false,'Taux entre 0 et 43 %.');if(!ok)return;
  const a=emps();a.push({id:Math.max(0,...a.map(x=>x.id))+1,n,poste:p,brut:b,date:f.date.value,pas});sv('tribord_em',a);m.classList.remove('on');toast('Salarié ajouté');draw()}}
const bl=$('#bulletin');
if(bl){const e=emps().find(x=>x.id===+new URLSearchParams(location.search).get('id'))||emps()[0],p=paie(e);const mois=new Date().toLocaleDateString('fr-FR',{month:'long',year:'numeric'});document.title='Bulletin – '+e.n;
 bl.innerHTML=`<div class="inv"><div class="hd"><div><h1>Bulletin de paie</h1><div class="meta">Période : ${mois}</div></div><div style="text-align:right"><b>Tribord Gestion</b><br><span class="meta">8 quai des Chartreux, 44000 Nantes<br>SIRET 123 456 789 00012</span></div></div>
 <div class="parties"><div><b>Salarié</b>${esc(e.n)}<br>${esc(e.poste)}<br>Entré(e) le ${fd(e.date)}</div><div><b>Contrat</b>CDI · temps plein<br>Convention collective Syntec<br>Prélèvement à la source : ${String(e.pas).replace('.',',')} %</div></div>
 <table class="bul"><thead><tr><th>Rubrique</th><th class="r">Base</th><th class="r">Taux</th><th class="r">Montant</th></tr></thead><tbody>
 <tr class="sum"><td>Salaire brut</td><td class="r n">${eur(p.b)}</td><td></td><td class="r n">${eur(p.b)}</td></tr>
 <tr><td>Sécurité sociale – vieillesse</td><td class="r n">${eur(p.b)}</td><td class="r n">7,30 %</td><td class="r n">−${eur(p.sec)}</td></tr>
 <tr><td>Retraite complémentaire</td><td class="r n">${eur(p.b)}</td><td class="r n">3,15 %</td><td class="r n">−${eur(p.ret)}</td></tr>
 <tr><td>CSG / CRDS</td><td class="r n">${eur(p.b*.9825)}</td><td class="r n">9,70 %</td><td class="r n">−${eur(p.csg)}</td></tr>
 <tr><td>Mutuelle (part salariale)</td><td></td><td></td><td class="r n">−${eur(p.mut)}</td></tr>
 <tr class="sum"><td>Net avant impôt sur le revenu</td><td></td><td></td><td class="r n">${eur(p.net)}</td></tr>
 <tr><td>Prélèvement à la source</td><td class="r n">${eur(p.net)}</td><td class="r n">${String(e.pas).replace('.',',')} %</td><td class="r n">−${eur(p.pas)}</td></tr>
 <tr class="sum"><td style="font-size:1.1rem">Net à payer</td><td></td><td></td><td class="r n" style="font-size:1.1rem">${eur(p.pay)}</td></tr></tbody></table>
 <div class="pay"><div><small>Charges patronales</small><b class="n">${eur(p.pat)}</b></div><div><small>Coût total employeur</small><b class="n">${eur(p.cout)}</b></div><div><small>Congés acquis (mois)</small><b class="n">2,08 j</b></div></div>
 <div class="foot">Estimation indicative et simplifiée, sans valeur contractuelle. Document fictif à des fins de démonstration. À conserver sans limitation de durée.</div></div>`;
 $('#acts').innerHTML='<button class="btn" id="pr">Imprimer / PDF</button><a class="btn o" href="salaries.html">← Salariés</a>';$('#pr').onclick=()=>print()}
