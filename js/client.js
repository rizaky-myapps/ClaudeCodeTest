/* My-Apps — espace client : connexion, inscription, commande, suivi des demandes, contact */
(()=>{
const {$,$$,esc,toast,STATUS}=MA;
const EMAIL=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const q=new URLSearchParams(location.search);
const setErr=(f,k,v)=>{const e=$(`[data-e=${k}]`,f);if(e)e.textContent=v||'';return !v};
const nextUrl=u=>{const n=q.get('next');return n&&/^[\w-]+\.html/.test(n)?n:(u.role==='admin'?'admin.html':'espace.html')};

/* ----- connexion / inscription ----- */
const au=$('#auth');
if(au){
 const m0=MA.me();if(m0&&!q.get('stay'))location.replace(nextUrl(m0));
 const tabs=$$('.seg button'),pl=$('#pane-login'),pr=$('#pane-reg');
 const show=t=>{tabs.forEach(b=>b.classList.toggle('on',b.dataset.t===t));pl.hidden=t!=='login';pr.hidden=t!=='reg'};
 tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));if(location.hash==='#inscription')show('reg');
 $('#lf').onsubmit=e=>{e.preventDefault();const f=e.target,r=MA.login(f.email.value,f.pass.value);if(r.error){$('#le').textContent=r.error;return}location.href=nextUrl(r.user)};
 const score=p=>(p.length>=8)+/[A-Z]/.test(p)+/[0-9]/.test(p)+/[^A-Za-z0-9]/.test(p)+(p.length>=12);
 const rf=$('#rf');
 rf.pass.oninput=()=>{const s=score(rf.pass.value),b=$('#meter i');b.style.width=s*20+'%';b.style.background=['#D6332F','#D6332F','#C97A06','#C97A06','#14935B','#14935B'][s]};
 rf.onsubmit=e=>{e.preventDefault();let ok=true;
  ok&=setErr(rf,'name',rf.name.value.trim().length>=2?'':'Indiquez votre nom.');
  ok&=setErr(rf,'email',EMAIL.test(rf.email.value.trim())?'':'Adresse e-mail invalide.');
  ok&=setErr(rf,'pass',rf.pass.value.length>=8&&score(rf.pass.value)>=3?'':'8 caractères minimum, avec une majuscule et un chiffre.');
  ok&=setErr(rf,'pass2',rf.pass2.value===rf.pass.value?'':'Les mots de passe diffèrent.');
  ok&=setErr(rf,'cgv',rf.cgv.checked?'':'Veuillez accepter les conditions.');
  if(!ok)return;
  const r=MA.register({name:rf.name.value,email:rf.email.value,phone:rf.phone.value,company:rf.company.value,pass:rf.pass.value});
  if(r.error){setErr(rf,'email',r.error);return}
  location.href=q.get('next')&&/^[\w-]+\.html/.test(q.get('next'))?q.get('next'):'espace.html?welcome=1';
 };
}

/* ----- commande d'un site ----- */
const od=$('#order');
if(od){
 const m=MA.me();
 if(!m){od.innerHTML=`<div class="notice info"><b>Un compte est nécessaire pour suivre votre commande.</b><p style="color:var(--mut);margin:6px 0 16px">Créez-le en une minute : vous pourrez échanger avec nous et suivre l'avancement de votre demande.</p><a class="btn primary" href="connexion.html?next=${encodeURIComponent('commande.html'+location.search)}#inscription">Créer un compte</a> <a class="btn" href="connexion.html?next=${encodeURIComponent('commande.html'+location.search)}">Me connecter</a></div>`}
 else{
  const sv=MA.services().filter(s=>s.active);
  const f=$('#of');f.hidden=false;
  f.service.innerHTML=sv.map(s=>`<option value="${esc(s.id)}">${esc(s.name)} — ${esc(MA.priceLabel(s))}</option>`).join('')+'<option value="">Autre / à préciser</option>';
  if(q.get('s')&&sv.some(s=>s.id===q.get('s')))f.service.value=q.get('s');
  f.phone.value=m.phone||'';f.company.value=m.company||'';
  const info=()=>{const s=sv.find(x=>x.id===f.service.value);$('#svc-info').innerHTML=s?`<b>${esc(s.name)}</b> · ${esc(s.desc)}<br><small style="color:var(--mut)">Délai indicatif : ${esc(s.delay||'—')} · ${esc(MA.priceLabel(s))}</small>`:'Décrivez votre besoin ci-dessous.'};
  f.service.onchange=info;info();
  f.onsubmit=e=>{e.preventDefault();let ok=true;
   ok&=setErr(f,'subject',f.subject.value.trim().length>=5?'':'Donnez un titre à votre projet (5 caractères min.).');
   ok&=setErr(f,'message',f.message.value.trim().length>=30?'':'Décrivez votre projet en quelques lignes (30 caractères min.).');
   ok&=setErr(f,'rgpd',f.rgpd.checked?'':'Veuillez accepter le traitement de vos données.');
   if(!ok)return;
   const t=MA.createTicket({type:'commande',serviceId:f.service.value,subject:f.subject.value.trim(),message:f.message.value.trim(),budget:f.budget.value,deadline:f.deadline.value,phone:f.phone.value,company:f.company.value,name:m.name,email:m.email});
   if(f.phone.value!==m.phone||f.company.value!==m.company)MA.updateProfile({phone:f.phone.value,company:f.company.value});
   f.hidden=true;const d=$('#done');d.hidden=false;$('#ref',d).textContent=t.ref;$('#seeit',d).href='espace.html?t='+t.id;
  };
 }
}

/* ----- espace client ----- */
const sp=$('#space');
if(sp){
 const m=MA.me();
 if(!m)sp.innerHTML=`<div class="notice info" style="max-width:560px"><b>Connexion requise</b><p style="color:var(--mut);margin:6px 0 16px">Connectez-vous pour consulter vos demandes.</p><a class="btn primary" href="connexion.html?next=espace.html">Se connecter</a></div>`;
 else{
  let tab=q.get('tab')||'tickets',sel=q.get('t');
  const my=()=>MA.mine(MA.me());
  const bubble=(x,side)=>x.from==='system'?`<div class="msg sys">${esc(x.text)} · ${MA.dt(x.t)}</div>`:`<div class="msg ${x.from===side?'me':''}"><small>${esc(x.author)}${x.from==='staff'?' · équipe':''} · ${MA.dt(x.t)}</small>${esc(x.text)}</div>`;
  const draw=()=>{
   const me=MA.me();if(!me){location.href='index.html';return}
   const T=my();if(!sel||!T.find(t=>t.id===sel))sel=T[0]?T[0].id:null;
   sp.innerHTML=`<div class="tabs seg" style="margin-bottom:22px"><button data-t="tickets" class="${tab==='tickets'?'on':''}">Mes demandes${T.some(t=>t.unreadClient)?' •':''}</button><button data-t="account" class="${tab==='account'?'on':''}">Mon compte</button></div><div id="pane"></div>`;
   $$('.seg button',sp).forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
   const pane=$('#pane');
   if(tab==='tickets'){
    if(!T.length){pane.innerHTML=`<div class="notice">Vous n'avez pas encore de demande. <a href="commande.html" style="color:var(--a);font-weight:600">Commander un site →</a></div>`;return}
    pane.innerHTML=`<div class="tk"><div class="tlist" id="tl">${T.map(t=>`<button data-id="${t.id}" class="${t.id===sel?'on':''}">${t.unreadClient?'<i class="dot"></i>':''}<b>${esc(t.subject)}</b><small><span>${t.ref}</span><span class="pill ${STATUS[t.status].c}">${STATUS[t.status].l}</span><span>${MA.ago(t.updated)}</span></small></button>`).join('')}</div><div id="td"></div></div>`;
    $$('#tl button').forEach(b=>b.onclick=()=>{sel=b.dataset.id;draw()});
    const t=T.find(x=>x.id===sel);MA.markRead(t.id,'client');
    $('#td').innerHTML=`<div class="thread"><div class="hd"><div><h3>${esc(t.subject)}</h3><small>${t.ref} · ${esc(t.serviceName)} · ouvert le ${MA.date(t.created)}</small></div><div style="display:flex;gap:10px;align-items:center"><span class="pill ${STATUS[t.status].c}">${STATUS[t.status].l}</span>${t.status!=='closed'?'<button class="btn sm" id="cl">Clôturer ma demande</button>':''}</div></div><div class="msgs" id="ms">${t.messages.map(x=>bubble(x,'client')).join('')}</div>${t.status==='closed'?'<div class="empty" style="padding:22px">Cette demande est fermée. <a href="commande.html" style="color:var(--a);font-weight:600">Ouvrir une nouvelle demande</a></div>':`<form id="rf2"><textarea name="x" placeholder="Votre message…"></textarea><div class="err" id="re"></div><div><button class="btn primary">Envoyer</button></div></form>`}</div>`;
    const ms=$('#ms');ms.scrollTop=ms.scrollHeight;
    const rf=$('#rf2');if(rf)rf.onsubmit=e=>{e.preventDefault();const v=rf.x.value.trim();if(v.length<2){$('#re').textContent='Écrivez votre message.';return}MA.reply(t.id,'client',v);toast('Message envoyé');draw()};
    const cl=$('#cl');if(cl)cl.onclick=()=>{if(confirm('Clôturer cette demande ? Vous ne pourrez plus y répondre.')){MA.setStatus(t.id,'closed');toast('Demande clôturée');draw()}};
   }else{
    pane.innerHTML=`<div class="panels" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:20px"><div class="card"><h3>Mes informations</h3><form class="f" id="pf" novalidate style="margin-top:14px"><label>Nom<input name="name" value="${esc(me.name)}"><span class="err" data-e="name"></span></label><label>E-mail<input value="${esc(me.email)}" disabled></label><div class="row2"><label>Téléphone<input name="phone" value="${esc(me.phone)}"></label><label>Société<input name="company" value="${esc(me.company)}"></label></div><div><button class="btn primary">Enregistrer</button></div></form></div>
    <div class="card"><h3>Mot de passe</h3><form class="f" id="pw" novalidate style="margin-top:14px"><label>Mot de passe actuel<input type="password" name="a" autocomplete="current-password"><span class="err" data-e="a"></span></label><label>Nouveau mot de passe<input type="password" name="n" autocomplete="new-password"><span class="err" data-e="n"></span></label><div><button class="btn">Mettre à jour</button></div></form>
    <h3 style="margin-top:34px">Zone sensible</h3><p style="margin:8px 0 14px">La suppression est définitive : vos demandes en cours sont fermées.</p><button class="btn bad" id="del">Supprimer mon compte</button></div></div>`;
    $('#pf').onsubmit=e=>{e.preventDefault();const f=e.target;if(!setErr(f,'name',f.name.value.trim().length>=2?'':'Indiquez votre nom.'))return;MA.updateProfile({name:f.name.value.trim(),phone:f.phone.value.trim(),company:f.company.value.trim()});toast('Informations enregistrées');draw()};
    $('#pw').onsubmit=e=>{e.preventDefault();const f=e.target,bad=MA.hash(f.a.value)!==me.pass;let ok=setErr(f,'a',bad?'Mot de passe actuel incorrect.':'');ok&=setErr(f,'n',f.n.value.length>=8&&/[A-Z]/.test(f.n.value)&&/[0-9]/.test(f.n.value)?'':'8 caractères minimum, avec une majuscule et un chiffre.');if(!ok)return;MA.updateProfile({pass:MA.hash(f.n.value)});toast('Mot de passe mis à jour');f.reset()};
    $('#del').onclick=()=>{if(confirm('Supprimer définitivement votre compte ?')){MA.deleteAccount(me.id,'client');location.href='index.html'}};
   }
  };
  draw();if(q.get('welcome'))toast('Bienvenue chez My-Apps !');
  addEventListener('storage',e=>{if(e.key==='ma_tickets'&&tab==='tickets'&&!(document.activeElement&&document.activeElement.tagName==='TEXTAREA'))draw()});
 }
}

/* ----- formulaire de contact : crée un ticket « question » ----- */
const cf=$('#contact-form');
if(cf){
 const m=MA.me();if(m){cf.nom.value=m.name;cf.email.value=m.email}
 cf.onsubmit=e=>{e.preventDefault();let ok=true;
  ok&=setErr(cf,'nom',cf.nom.value.trim().length>1?'':'Indiquez votre nom.');
  ok&=setErr(cf,'email',EMAIL.test(cf.email.value.trim())?'':'Adresse e-mail invalide.');
  ok&=setErr(cf,'message',cf.message.value.trim().length>=15?'':'Écrivez votre message (15 caractères min.).');
  ok&=setErr(cf,'rgpd',cf.rgpd.checked?'':'Veuillez accepter le traitement de vos données.');
  if(!ok)return;
  const t=MA.createTicket({type:'question',serviceId:'',subject:cf.sujet.value,message:cf.message.value.trim(),name:cf.nom.value.trim(),email:cf.email.value});
  cf.hidden=true;const s=$('#sent');s.hidden=false;$('#ref',s).textContent=t.ref;
  if(MA.me())$('#guest',s).hidden=true;else $('#guest',s).hidden=false;
 };
}
})();
