/* Cendrelune — données partagées (localStorage), compte, en-tête, utilitaires */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const DAY=864e5,HOUR=36e5;
const CL={
 ld(k,d){try{const v=localStorage.getItem('cl_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
 sv(k,v){try{localStorage.setItem('cl_'+k,JSON.stringify(v))}catch(e){}},
 hash(s){let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))>>>0;return h.toString(16)},
 col(n){let h=0;for(const c of String(n))h=(h*31+c.charCodeAt(0))%360;return `hsl(${h} 80% 62%)`},
 av(n,c=''){return `<span class="av ${c}" style="background:${CL.col(n)}">${esc(String(n)[0]||'?').toUpperCase()}</span>`},
 sk(n){return `<span class="sk" style="background:${CL.col(n)}">${esc(String(n)[0]||'?').toUpperCase()}</span>`},
 ago(t){const m=Math.round((Date.now()-t)/60000);if(m<1)return 'à l\'instant';if(m<60)return 'il y a '+m+' min';const h=Math.round(m/60);if(h<48)return 'il y a '+h+' h';return 'il y a '+Math.round(h/24)+' j'},
 date(t,o){return new Date(t).toLocaleDateString('fr-FR',o||{day:'numeric',month:'short',year:'numeric'})},
 eur(n){return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'},
 toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2400)},
 /* paramètres du serveur */
 settings(){return{maintenance:false,whitelist:false,motd:'§6Bienvenue sur §cCendrelune §7— saison 4 en cours !',max:120,pvp:true,difficulty:'Difficile',...CL.ld('settings',{})}},
 /* comptes */
 users(){let u=CL.ld('users',null);if(!u){u=[{id:1,pseudo:'Archiviste',email:'admin@cendrelune.example',pass:CL.hash('cendre-admin'),role:'admin',coins:5000,hours:812,created:Date.now()-400*DAY,discord:null,lastDaily:0,inv:[],votes:{},clan:null,streak:0}];CL.sv('users',u)}return u},
 saveUsers(u){CL.sv('users',u)},
 me(){const id=CL.ld('session',null);return id?CL.users().find(u=>u.id===id)||null:null},
 update(fn){const us=CL.users(),m=CL.me();if(!m)return;const u=us.find(x=>x.id===m.id);fn(u);CL.saveUsers(us);return u},
 login(u){CL.sv('session',u.id)},logout(){CL.sv('session',null)},
 /* joueurs (jeu) */
 NAMES:['PixelRenard','Ombrelune','KayoTheBold','Zéphyrion','MiaCraft','Brasero42','Nox_Alba','TartineQuest','LoupDeCendre','Vanille89','Aeris','GrosBill','Fennec_','CapitaineBrume','Lutin_Rouge','Mordoré','SirChoco','Tempête','Nébuleuse','Ragnarok_FR','Pomme_Verte','Cobalt','Yuki_Neko','Glaçon','Archimède','Soleil_Noir','Dragonnet','Mistral','Biscotte','Quasar'],
 RANKS:['Joueur','Aventurier','Héros','Légende','Modérateur','Administrateur'],
 pmod(){return CL.ld('pmod',{})},
 players(){const mod=CL.pmod();const seeds=CL.NAMES.map((n,i)=>{const r=(i*7919+13)%97;return{n,lvl:12+(r*3+i*5)%88,h:40+(r*29+i*11)%1900,k:(r*53+i*17)%1400,m:(r*1777+i*9181)%250000,j:Date.now()-((r*7+i*13)%700+30)*DAY,rank:i%11===0?'Légende':i%5===0?'Héros':i%3===0?'Aventurier':'Joueur',clan:['Les Cendres','Garde Écarlate','Nocturnes','Brume Vive','Forge Noire','Aurore'][i%6],seed:1}});
  const reg=CL.users().filter(u=>u.role!=='x').map(u=>({n:u.pseudo,lvl:1+Math.floor(u.hours/12),h:u.hours,k:0,m:u.coins,j:u.created,rank:u.role==='admin'?'Administrateur':u.rank||'Joueur',clan:u.clan,discord:u.discord,reg:1}));
  return [...seeds,...reg].map(p=>({...p,...(mod[p.n]||{})}))},
 setMod(n,patch){const m=CL.pmod();m[n]={...(m[n]||{}),...patch};CL.sv('pmod',m)},
 banned(n){const m=CL.pmod()[n];return m&&m.ban&&(!m.ban.until||m.ban.until>Date.now())?m.ban:null},
 muted(n){const m=CL.pmod()[n];return m&&m.mute&&(!m.mute.until||m.mute.until>Date.now())?m.mute:null},
 /* en ligne (simulé) */
 online:64+Math.floor(Math.random()*30),
 tick(){const s=CL.settings();CL.online=s.maintenance?0:Math.max(30,Math.min(s.max-4,CL.online+Math.floor(Math.random()*7)-3));return CL.online},
 onlineList(n=12){return CL.NAMES.slice().sort(()=>Math.random()-.5).slice(0,n)},
 /* contenus */
 news(){let n=CL.ld('news',null);if(!n){n=[{id:1,t:'Saison 4 : le Gouffre de Cendre',b:'Une nouvelle dimension, sept boss et un tout nouveau système de clans. Rendez-vous ce week-end !',d:Date.now()-2*DAY,pin:true},{id:2,t:'Maintenance du mardi',b:'Une courte maintenance (20 minutes) est prévue mardi à 6 h pour déployer les correctifs.',d:Date.now()-6*DAY},{id:3,t:'Résultats du concours de constructions',b:'Bravo aux 214 participants ! Les vainqueurs recevront leur récompense en jeu dans la journée.',d:Date.now()-12*DAY}];CL.sv('news',n)}return n},
 orders(){return CL.ld('orders',[])},
 tickets(){let t=CL.ld('tickets',null);if(!t){t=[{id:1,u:'PixelRenard',s:'Grade non reçu après achat',st:'ouvert',c:Date.now()-5*HOUR,m:[{a:'PixelRenard',t:Date.now()-5*HOUR,x:'Bonjour, j\'ai acheté le grade Héros il y a une heure et je ne l\'ai toujours pas en jeu.'}]},{id:2,u:'Ombrelune',s:'Signalement d\'un joueur',st:'ouvert',c:Date.now()-26*HOUR,m:[{a:'Ombrelune',t:Date.now()-26*HOUR,x:'Un joueur exploite un bug de duplication près du marché. Coordonnées : 120, 64, -340.'}]},{id:3,u:'Aeris',s:'Demande de levée de sanction',st:'résolu',c:Date.now()-3*DAY,m:[{a:'Aeris',t:Date.now()-3*DAY,x:'Mon mute est-il toujours justifié ?'},{a:'Archiviste',t:Date.now()-2*DAY,x:'Après vérification, votre mute est levé. Bon jeu !',staff:1}]}];CL.sv('tickets',t)}return t},
 sanctions(){let s=CL.ld('sanctions',null);if(!s){s=[{id:1,type:'ban',p:'Ragnarok_FR',r:'Utilisation de logiciel de triche',by:'Archiviste',t:Date.now()-9*DAY,until:null,active:true},{id:2,type:'mute',p:'GrosBill',r:'Spam dans le chat',by:'Archiviste',t:Date.now()-4*DAY,until:Date.now()+3*DAY,active:true},{id:3,type:'kick',p:'Fennec_',r:'Inactivité prolongée',by:'Système',t:Date.now()-2*DAY,until:null,active:false}];CL.sv('sanctions',s);CL.sv('pmod',{...CL.pmod(),Ragnarok_FR:{ban:{reason:'Utilisation de logiciel de triche',until:null,by:'Archiviste',t:Date.now()-9*DAY}},GrosBill:{mute:{reason:'Spam dans le chat',until:Date.now()+3*DAY,by:'Archiviste',t:Date.now()-4*DAY}}})}return s},
 audit(a,d){const l=CL.ld('audit',[]);const m=CL.me();l.unshift({t:Date.now(),u:m?m.pseudo:'Système',a,d});CL.sv('audit',l.slice(0,150))},
 /* texte Minecraft § */
 mc(t){const C={0:'#000',1:'#0000AA',2:'#00AA00',3:'#00AAAA',4:'#AA0000',5:'#AA00AA',6:'#FFAA00',7:'#AAAAAA',8:'#555555',9:'#5555FF',a:'#55FF55',b:'#55FFFF',c:'#FF5555',d:'#FF55FF',e:'#FFFF55',f:'#FFFFFF'};let out='',open=false;String(t).split(/(§[0-9a-fr])/).forEach(p=>{const m=p.match(/^§([0-9a-fr])$/);if(m){if(open)out+='</span>';out+=m[1]==='r'?'':`<span style="color:${C[m[1]]}">`;open=m[1]!=='r'}else out+=esc(p)});return out+(open?'</span>':'')}
};
/* ---------- en-tête commun ---------- */
(function(){
 const bg=$('.burger');if(bg)bg.onclick=()=>$('header.top nav').classList.toggle('open');
 const el=$('#acct');
 if(el){const m=CL.me();
  if(m){el.innerHTML=`<button class="who" id="who">${CL.av(m.pseudo)}<span>${esc(m.pseudo)}</span></button><div class="menu" id="menu"><a href="compte.html">Mon compte</a><a href="joueur.html?n=${encodeURIComponent(m.pseudo)}">Mon profil public</a>${m.role==='admin'?'<a href="admin.html">Panneau d\'administration</a>':''}<hr><button id="out">Se déconnecter</button></div>`;
   $('#who').onclick=e=>{e.stopPropagation();$('#menu').classList.toggle('on')};document.addEventListener('click',()=>$('#menu')&&$('#menu').classList.remove('on'));
   $('#out').onclick=()=>{CL.logout();location.href='index.html'}}
  else el.innerHTML='<a class="btn s" href="connexion.html">Connexion</a>'}
 const s=CL.settings(),m=CL.me();
 if(s.maintenance&&!(m&&m.role==='admin')&&!document.body.classList.contains('adm-page')){const b=document.createElement('div');b.id='mtb';b.textContent='Maintenance en cours — le serveur est temporairement fermé aux joueurs';document.body.prepend(b)}
})();
