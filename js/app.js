/* My-Apps — couche de données partagée (démonstration : tout est stocké dans le navigateur, préfixe « ma_ ») */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const DAY=864e5,HOUR=36e5,MIN=6e4;
const ld=(k,d)=>{try{const v=localStorage.getItem('ma_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem('ma_'+k,JSON.stringify(v))}catch(e){}};
const rm=k=>{try{localStorage.removeItem('ma_'+k)}catch(e){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const hash=s=>{let h=5381;for(const c of 'ma|'+s)h=((h<<5)+h+c.charCodeAt(0))>>>0;return h.toString(16)};

/* statuts et types de journal */
const STATUS={pending:{l:'En attente',c:'p-pending'},progress:{l:'En cours',c:'p-progress'},done:{l:'Traité',c:'p-done'},closed:{l:'Fermé',c:'p-closed'}};
const LOGT={
 'compte.creation':['Création de compte','Comptes','ok'],'compte.suppression':['Suppression de compte','Comptes','bad'],'compte.connexion':['Connexion','Comptes',''],
 'compte.deconnexion':['Déconnexion','Comptes',''],'compte.echec':['Échec de connexion','Comptes','bad'],'compte.modification':['Modification du compte','Comptes',''],'compte.role':['Changement de rôle','Comptes','warn'],
 'ticket.ouverture':['Ouverture de ticket','Tickets','ok'],'ticket.reponse':['Réponse','Tickets',''],'ticket.statut':['Changement de statut','Tickets','warn'],
 'ticket.fermeture':['Fermeture de ticket','Tickets','bad'],'ticket.reouverture':['Réouverture de ticket','Tickets','warn'],'ticket.note':['Note interne','Tickets',''],
 'ticket.priorite':['Changement de priorité','Tickets',''],'ticket.suppression':['Suppression de ticket','Tickets','bad'],
 'service.creation':['Création de service','Services','ok'],'service.modification':['Modification de service','Services',''],'service.suppression':['Suppression de service','Services','bad'],
 'service.visibilite':['Visibilité d\'un service','Services','warn'],'service.ordre':['Ordre des services','Services',''],
 'discord.envoi':['Notification Discord','Discord',''],'discord.test':['Test Discord','Discord',''],
 'admin.parametres':['Paramètres modifiés','Administration','warn'],'admin.export':['Export de données','Administration',''],'admin.purge':['Purge du journal','Administration','bad'],'admin.reset':['Réinitialisation','Administration','bad'],
 'contact.message':['Message de contact','Tickets','ok']
};
const GROUPS=['Comptes','Tickets','Services','Discord','Administration'];

/* mise en forme */
const p2=n=>String(n).padStart(2,'0');
const date=t=>{const d=new Date(t);return `${p2(d.getDate())}/${p2(d.getMonth()+1)}/${d.getFullYear()}`};
const dt=t=>{const d=new Date(t);return `${date(t)} ${p2(d.getHours())}:${p2(d.getMinutes())}`};
const ago=t=>{const m=Math.round((Date.now()-t)/MIN);if(m<1)return 'à l\'instant';if(m<60)return `il y a ${m} min`;const h=Math.round(m/60);if(h<48)return `il y a ${h} h`;return `il y a ${Math.round(h/24)} j`};
const eur=n=>Number(n).toLocaleString('fr-FR',{minimumFractionDigits:Number.isInteger(+n)?0:2,maximumFractionDigits:2})+' €';
const toast=m=>{let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),3200)};

/* ---------- données de démonstration ---------- */
const SERVICES0=[
 {id:'vitrine',name:'Vitrine',cat:'Site',prefix:'à partir de',price:890,unit:'HT',period:'',delay:'5 jours',desc:'Pour présenter votre activité.',features:['Jusqu\'à 5 pages','Adapté mobile','Formulaire de contact','Référencement de base','Mentions légales fournies'],featured:false,active:true},
 {id:'reservation',name:'Réservation',cat:'Site',prefix:'à partir de',price:1490,unit:'HT',period:'',delay:'10 jours',desc:'Pour recevoir des réservations en ligne.',features:['Tout de la formule Vitrine','Réservation tables, séances ou rendez-vous','Notifications par e-mail','Tableau de gestion'],featured:true,active:true},
 {id:'boutique',name:'Boutique',cat:'Site',prefix:'à partir de',price:2490,unit:'HT',period:'',delay:'3 semaines',desc:'Pour vendre en ligne.',features:['Catalogue et fiches produit','Panier et paiement sécurisé','Codes promo, livraison','CGV et conformité fournies'],featured:false,active:true},
 {id:'refonte',name:'Refonte de site',cat:'Site',prefix:'à partir de',price:690,unit:'HT',period:'',delay:'1 semaine',desc:'Pour moderniser un site existant.',features:['Audit de l\'existant','Nouveau design','Reprise des contenus','Redirections conservées'],featured:false,active:true},
 {id:'maintenance',name:'Hébergement & maintenance',cat:'Abonnement',prefix:'',price:19,unit:'HT',period:'/ mois',delay:'Immédiat',desc:'Pour être serein après la mise en ligne.',features:['Hébergement sécurisé','Mises à jour et sauvegardes','Support par e-mail'],featured:false,active:true},
 {id:'admin',name:'Panneau d\'administration',cat:'Sur mesure',prefix:'',price:0,unit:'HT',period:'',delay:'Selon projet',desc:'Gestion de contenus, de clients ou de commandes.',features:['Comptes et permissions','Tableaux de bord','Exports et journal d\'activité'],featured:false,active:true}
];
const CLIENTS0=[
 {id:'u-camille',name:'Camille Dupuis',email:'camille@boulangerie-dupuis.example',phone:'06 12 34 56 78',company:'Boulangerie Dupuis',role:'client',pass:null,demo:true},
 {id:'u-hugo',name:'Hugo Marchand',email:'hugo@marchand-velos.example',phone:'',company:'Marchand Vélos',role:'client',pass:null,demo:true},
 {id:'u-ines',name:'Inès Rolland',email:'ines@studio-rolland.example',phone:'07 98 76 54 32',company:'Studio Rolland',role:'client',pass:null,demo:true}
];
function seed(){
 if(ld('init'))return;
 const n=Date.now();
 sv('services',SERVICES0.map((s,i)=>({...s,order:i})));
 sv('users',[{id:'u-admin',name:'Administrateur',email:'admin@my-apps.fr',phone:'',company:'My-Apps',role:'admin',pass:hash('myapps-admin'),created:n-60*DAY},...CLIENTS0.map((u,i)=>({...u,created:n-(40-i*9)*DAY}))]);
 const T=(i,ref,u,sid,subject,msg,status,age,extra={})=>({id:'t-'+i,ref,type:'commande',userId:u.id,name:u.name,email:u.email,phone:u.phone,company:u.company,serviceId:sid,serviceName:SERVICES0.find(s=>s.id===sid).name,price:SERVICES0.find(s=>s.id===sid).price,subject,budget:'1 000 – 2 500 €',deadline:'Dans le mois',status,priority:'normal',created:n-age,updated:n-age,unreadStaff:false,unreadClient:false,notes:[],messages:[{id:'m'+i,from:'client',author:u.name,text:msg,t:n-age}],...extra});
 const t1=T(1,'MA-0001',CLIENTS0[0],'vitrine','Site pour ma boulangerie','Bonjour, je souhaite un site simple avec nos horaires, la carte des pains et un moyen de commander pour le lendemain.','done',9*DAY);
 t1.messages.push({id:'m1b',from:'staff',author:'Équipe My-Apps',text:'Bonjour Camille, merci pour votre demande ! Nous vous avons envoyé la maquette par e-mail. Dites-nous ce que vous en pensez.',t:n-8*DAY},{id:'m1c',from:'client',author:CLIENTS0[0].name,text:'Elle est parfaite, merci !',t:n-7*DAY},{id:'m1d',from:'system',author:'Système',text:'Statut modifié : Traité',t:n-6*DAY});t1.updated=n-6*DAY;
 const t2=T(2,'MA-0002',CLIENTS0[1],'boutique','Boutique de vélos reconditionnés','Nous vendons des vélos d\'occasion et aimerions une boutique avec fiches détaillées (cadre, taille, état) et paiement en ligne.','progress',3*DAY,{priority:'high',unreadStaff:true});
 t2.messages.push({id:'m2b',from:'staff',author:'Équipe My-Apps',text:'Bonjour Hugo, pouvez-vous nous indiquer le nombre de vélos à mettre en ligne au lancement ?',t:n-2*DAY},{id:'m2c',from:'client',author:CLIENTS0[1].name,text:'Environ 40 pour commencer, avec 5 à 10 nouveaux chaque mois.',t:n-5*HOUR});t2.updated=n-5*HOUR;
 const t3=T(3,'MA-0003',CLIENTS0[2],'reservation','Réservation de séances photo','Je suis photographe et je voudrais que mes clients réservent leur séance en ligne avec un acompte.','pending',4*HOUR,{unreadStaff:true});
 sv('tickets',[t3,t2,t1]);sv('seq',3);
 sv('logs',[
  [n-60*DAY,'u-admin','Administrateur','compte.creation','Compte administrateur créé'],
  [n-40*DAY,'u-camille','Camille Dupuis','compte.creation','Camille Dupuis <camille@boulangerie-dupuis.example>'],
  [n-9*DAY,'u-camille','Camille Dupuis','ticket.ouverture','MA-0001 · Vitrine · « Site pour ma boulangerie »'],
  [n-8*DAY,'u-admin','Équipe My-Apps','ticket.reponse','MA-0001 · réponse envoyée'],
  [n-6*DAY,'u-admin','Équipe My-Apps','ticket.statut','MA-0001 · En attente → Traité'],
  [n-3*DAY,'u-hugo','Hugo Marchand','ticket.ouverture','MA-0002 · Boutique · « Boutique de vélos reconditionnés »'],
  [n-2*DAY,'u-admin','Équipe My-Apps','ticket.statut','MA-0002 · En attente → En cours'],
  [n-4*HOUR,'u-ines','Inès Rolland','ticket.ouverture','MA-0003 · Réservation · « Réservation de séances photo »']
 ].map((l,i)=>({id:'l'+i,t:l[0],uid:l[1],actor:l[2],type:l[3],detail:l[4]})).reverse());
 sv('init',1);
}
seed();

/* ---------- réglages ---------- */
const SET0={agency:{name:'My-Apps',email:'contact@my-apps.fr',prefix:'MA'},discord:{enabled:false,webhook:'',hooks:{},botName:'My-Apps · Tickets',avatar:'',mention:'',events:{ticket_open:true,ticket_reply:true,ticket_status:true,ticket_close:true,account_create:true,account_delete:true,service_change:false}}};
const settings=()=>{const s=ld('settings',{});return {agency:{...SET0.agency,...s.agency},discord:{...SET0.discord,...s.discord,events:{...SET0.discord.events,...(s.discord||{}).events},hooks:{...((s.discord||{}).hooks||{})}}}};

/* ---------- accès ---------- */
const users=()=>ld('users',[]);
const saveUsers=u=>sv('users',u);
const me=()=>{const id=ld('session',null);return id?users().find(u=>u.id===id)||null:null};
const isAdmin=()=>{const m=me();return !!m&&m.role==='admin'};

/* ---------- journal ---------- */
function log(type,detail,o={}){
 const m=o.actor!==undefined?null:me(),l=ld('logs',[]);
 l.unshift({id:uid(),t:Date.now(),uid:o.uid??(m?m.id:null),actor:o.actor??(m?(m.role==='admin'?'Admin · '+m.name:m.name):'Visiteur'),type,detail});
 sv('logs',l.slice(0,1500));
}
const logs=()=>ld('logs',[]);

/* ---------- Discord (webhook) ---------- */
const webhookOk=u=>/^https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(u||'');
const EVT={ticket_open:['Nouveau ticket',0x2B59FF],ticket_reply:['Nouveau message',0x7A97FF],ticket_status:['Statut modifié',0xC97A06],ticket_close:['Ticket fermé',0x63636B],account_create:['Compte créé',0x14935B],account_delete:['Compte supprimé',0xD6332F],service_change:['Service modifié',0x7A97FF]};
async function notify(evt,e){
 const d=settings().discord;if(!d.events[evt])return;d.hooks=d.hooks||{};
 const meta=EVT[evt]||[evt,0x2B59FF];
 const base=location.href.replace(/[^/]*([?#].*)?$/,'');
 const embed={title:`${meta[0]} · ${e.title}`,description:e.desc||'',color:meta[1],fields:(e.fields||[]).map(f=>({name:f[0],value:String(f[1]||'—').slice(0,300),inline:f[2]!==false})),timestamp:new Date().toISOString(),footer:{text:settings().agency.name+' · démonstration'}};
 if(e.link)embed.url=base+e.link;
 const content=evt==='ticket_open'&&d.mention?(/^\d+$/.test(d.mention)?`<@&${d.mention}>`:d.mention):undefined;
 const body={username:d.botName||'My-Apps',embeds:[embed]};if(d.avatar)body.avatar_url=d.avatar;if(content)body.content=content;
 const rec={id:uid(),t:Date.now(),evt,label:meta[0],title:e.title,status:'simulated',info:'Webhook non configuré : notification simulée'};
 const own=d.hooks[evt],url=own||d.webhook;rec.hook=own?'spécifique':'par défaut';
 if(d.enabled&&webhookOk(url)){
  try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});rec.status=r.ok?'sent':'failed';rec.info=(own?'Webhook spécifique · ':'Webhook par défaut · ')+(r.ok?'envoyée (HTTP '+r.status+')':'refusée par Discord (HTTP '+r.status+')')}
  catch(err){rec.status='failed';rec.info='Réseau : '+(err.message||'erreur')}
 }else if(d.enabled)rec.info=url?'URL du webhook invalide : notification simulée':'Aucun webhook défini pour cet événement : notification simulée';
 const o=ld('outbox',[]);o.unshift(rec);sv('outbox',o.slice(0,60));
 log('discord.envoi',`${meta[0]} · ${e.title} · ${rec.status==='sent'?'envoyée':rec.status==='failed'?'échec ('+rec.info+')':'simulée'}`,{actor:'Système',uid:null});
 return rec;
}
async function testDiscord(cfg){
 const d=cfg||settings().discord;if(!webhookOk(d.webhook))return{status:'failed',info:'URL du webhook invalide'};
 const body={username:d.botName||'My-Apps',embeds:[{title:'Test de connexion',description:'Le webhook est correctement configuré.',color:0x14935B,timestamp:new Date().toISOString()}]};if(d.avatar)body.avatar_url=d.avatar;
 try{const r=await fetch(d.webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.ok?{status:'sent',info:'Message de test envoyé (HTTP '+r.status+')'}:{status:'failed',info:'Refusé par Discord (HTTP '+r.status+')'}}
 catch(err){return{status:'failed',info:'Réseau : '+(err.message||'erreur')}}
}

/* ---------- services ---------- */
const services=()=>ld('services',[]).slice().sort((a,b)=>a.order-b.order);
const saveServices=l=>sv('services',l.map((s,i)=>({...s,order:i})));
const priceLabel=s=>!+s.price?'Sur devis':`${s.prefix?s.prefix+' ':''}${eur(s.price)} ${s.unit||'HT'}${s.period?' '+s.period:''}`;

/* ---------- comptes ---------- */
function register(d){
 const us=users(),email=d.email.trim().toLowerCase();
 if(us.some(u=>u.email===email))return{error:'Cette adresse e-mail est déjà utilisée.'};
 const u={id:'u-'+uid(),name:d.name.trim(),email,phone:(d.phone||'').trim(),company:(d.company||'').trim(),role:'client',pass:hash(d.pass),created:Date.now()};
 us.push(u);saveUsers(us);sv('session',u.id);
 const ts=ld('tickets',[]);let n=0;ts.forEach(t=>{if(t.email===email&&!t.userId){t.userId=u.id;n++}});if(n)sv('tickets',ts);
 log('compte.creation',`${u.name} <${u.email}>`+(n?` · ${n} ticket(s) rattaché(s)`:''),{actor:u.name,uid:u.id});
 notify('account_create',{title:u.name,desc:u.email,fields:[['Société',u.company],['Téléphone',u.phone]]});
 return{ok:true,user:u};
}
let fails=0,lockUntil=0;
function login(email,pass){
 if(Date.now()<lockUntil)return{error:`Trop de tentatives. Réessayez dans ${Math.ceil((lockUntil-Date.now())/1000)} s.`};
 email=email.trim().toLowerCase();const u=users().find(x=>x.email===email);
 if(!u||!u.pass||u.pass!==hash(pass)){fails++;log('compte.echec',`Tentative pour ${email||'(vide)'}`,{actor:'Visiteur',uid:null});if(fails>=5){fails=0;lockUntil=Date.now()+30000;return{error:'Trop de tentatives. Compte verrouillé 30 secondes.'}}return{error:'E-mail ou mot de passe incorrect.'}}
 fails=0;sv('session',u.id);log('compte.connexion',u.email,{actor:(u.role==='admin'?'Admin · ':'')+u.name,uid:u.id});return{ok:true,user:u};
}
function logout(){const m=me();if(m)log('compte.deconnexion',m.email);rm('session')}
function updateProfile(patch){const us=users(),m=me(),u=us.find(x=>x.id===m.id);const ch=Object.keys(patch).filter(k=>k!=='pass'&&u[k]!==patch[k]).map(k=>k);Object.assign(u,patch);saveUsers(us);log('compte.modification',patch.pass?'Mot de passe modifié':'Champs : '+(ch.join(', ')||'aucun'));return u}
function deleteAccount(id,by){
 const us=users(),u=us.find(x=>x.id===id);if(!u)return false;
 saveUsers(us.filter(x=>x.id!==id));
 const ts=ld('tickets',[]);let n=0;
 ts.forEach(t=>{if(t.userId===id){t.userId=null;t.userDeleted=true;if(t.status!=='closed'){t.status='closed';t.messages.push({id:uid(),from:'system',author:'Système',text:'Compte supprimé : demande fermée.',t:Date.now()});n++}t.updated=Date.now()}});
 sv('tickets',ts);
 const m=me();if(m&&m.id===id)rm('session');
 log('compte.suppression',`${u.name} <${u.email}> · supprimé par ${by==='admin'?'un administrateur':'le titulaire'}${n?` · ${n} ticket(s) fermé(s)`:''}`,by==='admin'?{}:{actor:u.name,uid:u.id});
 notify('account_delete',{title:u.name,desc:u.email,fields:[['Supprimé par',by==='admin'?'Administrateur':'Titulaire']]});
 return true;
}

/* ---------- tickets ---------- */
const tickets=()=>ld('tickets',[]);
const saveTickets=t=>sv('tickets',t);
const ticket=id=>tickets().find(t=>t.id===id);
const mine=m=>tickets().filter(t=>t.userId===m.id||(!t.userId&&t.email===m.email));
const nextRef=()=>{const n=ld('seq',0)+1;sv('seq',n);return settings().agency.prefix+'-'+String(n).padStart(4,'0')};
function createTicket(d){
 const m=me(),svc=services().concat(ld('services',[])).find(s=>s.id===d.serviceId);
 const t={id:'t-'+uid(),ref:nextRef(),type:d.type||'commande',userId:m?m.id:null,name:d.name,email:d.email.trim().toLowerCase(),phone:d.phone||'',company:d.company||'',serviceId:d.serviceId||null,serviceName:svc?svc.name:(d.type==='question'?'Question générale':'—'),price:svc?svc.price:0,subject:d.subject,budget:d.budget||'',deadline:d.deadline||'',status:'pending',priority:'normal',created:Date.now(),updated:Date.now(),unreadStaff:true,unreadClient:false,notes:[],messages:[{id:uid(),from:'client',author:d.name,text:d.message,t:Date.now()}]};
 const l=tickets();l.unshift(t);saveTickets(l);
 log(t.type==='question'?'contact.message':'ticket.ouverture',`${t.ref} · ${t.serviceName} · « ${t.subject} »`,{actor:t.name,uid:t.userId});
 notify('ticket_open',{title:`${t.ref} — ${t.subject}`,desc:t.messages[0].text.slice(0,350),fields:[['Client',`${t.name} (${t.email})`],['Service',t.serviceName],['Budget',t.budget],['Délai',t.deadline]],link:'admin-tickets.html?id='+t.id});
 return t;
}
function reply(id,from,text){
 const l=tickets(),t=l.find(x=>x.id===id),m=me();if(!t)return null;
 const author=from==='staff'?(m?'Équipe My-Apps':'Équipe My-Apps'):(m?m.name:t.name);
 t.messages.push({id:uid(),from,author,text,t:Date.now()});t.updated=Date.now();
 let auto='';
 if(from==='client'){t.unreadStaff=true;if(t.status==='done'){t.status='pending';auto=' · statut : En attente'}}
 else{t.unreadClient=true;if(t.status==='pending'){t.status='progress';t.messages.push({id:uid(),from:'system',author:'Système',text:'Statut modifié : En cours',t:Date.now()});auto=' · statut : En cours'}}
 saveTickets(l);
 log('ticket.reponse',`${t.ref} · ${from==='staff'?'équipe':'client'}${auto}`);
 notify('ticket_reply',{title:`${t.ref} — ${t.subject}`,desc:text.slice(0,350),fields:[['De',from==='staff'?'Équipe':t.name]],link:'admin-tickets.html?id='+t.id});
 return t;
}
function setStatus(id,status){
 const l=tickets(),t=l.find(x=>x.id===id);if(!t||t.status===status)return t;
 const from=t.status,m=me();t.status=status;t.updated=Date.now();t.unreadClient=m&&m.role==='admin';
 t.messages.push({id:uid(),from:'system',author:'Système',text:'Statut modifié : '+STATUS[status].l,t:Date.now()});saveTickets(l);
 const type=status==='closed'?'ticket.fermeture':from==='closed'?'ticket.reouverture':'ticket.statut';
 log(type,`${t.ref} · ${STATUS[from].l} → ${STATUS[status].l}`);
 notify(status==='closed'?'ticket_close':'ticket_status',{title:`${t.ref} — ${t.subject}`,desc:`${STATUS[from].l} → ${STATUS[status].l}`,fields:[['Client',t.name],['Par',m?m.name:'—']],link:'admin-tickets.html?id='+t.id});
 return t;
}
function addNote(id,text){const l=tickets(),t=l.find(x=>x.id===id),m=me();t.notes.push({id:uid(),author:m?m.name:'Admin',text,t:Date.now()});saveTickets(l);log('ticket.note',`${t.ref} · note interne ajoutée`)}
function setPriority(id,p){const l=tickets(),t=l.find(x=>x.id===id);if(t.priority===p)return;const L={low:'Basse',normal:'Normale',high:'Haute'};log('ticket.priorite',`${t.ref} · ${L[t.priority]} → ${L[p]}`);t.priority=p;saveTickets(l)}
function markRead(id,side){const l=tickets(),t=l.find(x=>x.id===id);if(!t)return;const k=side==='staff'?'unreadStaff':'unreadClient';if(t[k]){t[k]=false;saveTickets(l)}}
function deleteTicket(id){const l=tickets(),t=l.find(x=>x.id===id);if(!t)return;saveTickets(l.filter(x=>x.id!==id));log('ticket.suppression',`${t.ref} · « ${t.subject} » · ${t.name}`)}

/* ---------- notifications entre onglets ---------- */
addEventListener('storage',e=>{
 if(e.key==='ma_tickets'&&isAdmin()){
  try{const o=JSON.parse(e.oldValue||'[]'),n=JSON.parse(e.newValue||'[]');
   if(n.length>o.length)toast('Nouveau ticket : '+n[0].ref+' — '+n[0].subject);
   else{const a=n.find(t=>{const p=o.find(x=>x.id===t.id);return p&&t.messages.length>p.messages.length&&t.messages[t.messages.length-1].from==='client'});if(a)toast('Nouveau message sur '+a.ref)}}catch(err){}
 }
});

window.$=$;window.$$=$$;
window.MA={$,$$,esc,DAY,HOUR,ld,sv,rm,uid,hash,date,dt,ago,eur,toast,STATUS,LOGT,GROUPS,settings,users,saveUsers,me,isAdmin,log,logs,notify,testDiscord,webhookOk,services,saveServices,priceLabel,register,login,logout,updateProfile,deleteAccount,tickets,saveTickets,ticket,mine,createTicket,reply,setStatus,addNote,setPriority,markRead,deleteTicket,SERVICES0,SET0};
})();
