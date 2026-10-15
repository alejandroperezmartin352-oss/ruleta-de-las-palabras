"use strict";
window.addEventListener("error",e=>{if(/^(ResizeObserver|Script error)/.test(e.message||""))return;let b=document.getElementById("err");if(!b){b=document.createElement("div");b.id="err";document.body.append(b)}b.textContent="Error: "+e.message+" ("+String(e.filename||"").split("/").pop()+":"+e.lineno+")"});
if(typeof PANELS==="undefined"||typeof CATEGORIES==="undefined"){window.PANELS=[];window.CATEGORIES=[]}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ALPHA=[..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"],VOW="AEIOU",VCOST=50,FINAL0="RSTLNE";
const SECT=[100,50,200,"QUIEBRA",150,25,500,"PIERDE TURNO",100,200,1000,50];
const norm=s=>String(s).normalize("NFC").toLowerCase().replace(/ñ/g,"\u0001").normalize("NFD").replace(/\p{M}/gu,"").replace(/\u0001/g,"ñ").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const base=c=>{const n=norm(c).toUpperCase();return n.length===1?n:""};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rnd=n=>Math.floor(Math.random()*n);
/* ---------- guardado ---------- */
const KEY="ruleta-palabras-v1";
const makeDef=()=>({vfx:.7,vmus:.25,mute:false,cats:[...CATEGORIES],best:0,stats:{games:0,wins:0,panels:0}});
let sv;try{sv={...makeDef(),...JSON.parse(localStorage.getItem(KEY)||"{}")};sv.stats={...makeDef().stats,...sv.stats}}catch(e){sv=makeDef()}
sv.cats=(Array.isArray(sv.cats)?sv.cats:[]).filter(c=>CATEGORIES.includes(c));if(!sv.cats.length)sv.cats=[...CATEGORIES];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(sv))}catch(e){}};
/* ---------- audio (Web Audio; nada suena antes del primer clic) ---------- */
let ac=null,musT=null;
function initAudio(){try{if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume()}catch(e){ac=null}}
function tone(f,d,t="sine",v=.3,when=0,bus="vfx"){if(!ac||sv.mute)return;const o=ac.createOscillator(),g=ac.createGain(),s=Math.max(.0002,sv[bus]*v),t0=ac.currentTime+when;
 o.type=t;o.frequency.setValueAtTime(f,t0);g.gain.setValueAtTime(s,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(ac.destination);o.start(t0);o.stop(t0+d)}
const SFX={tick:()=>tone(900,.04,"square",.15),reveal:()=>tone(660,.15,"triangle",.4),ok:()=>[523,659,784].forEach((f,i)=>tone(f,.25,"triangle",.4,i*.1)),
 bad:()=>{tone(180,.35,"sawtooth",.3);tone(140,.4,"sawtooth",.3,.12)},warn:()=>tone(1000,.12,"square",.3),stop:()=>tone(300,.2,"square",.3),
 win:()=>[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.3,"triangle",.4,i*.12))};
function music(on){clearInterval(musT);musT=null;if(!on||!ac)return;const n=[220,262,330,392,330,262];let i=0;musT=setInterval(()=>tone(n[i++%n.length],.5,"sine",.5,0,"vmus"),420)}
/* ---------- navegación ---------- */
function go(id){if(id==="setup")buildNames();if(id==="cats")buildCats();if(id==="settings")buildSettings();
 $$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));window.scrollTo(0,0);
 if(["menu","setup","cats","how","settings"].includes(id)){if(!musT)music(true)}else if(id==="end"||id==="splash")music(false)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(!b)return;if(b.id==="enter")initAudio();go(b.dataset.go)});
function modal(html,btns){return new Promise(res=>{const o=$("#overlay"),b=$("#obox");b.innerHTML=html+"<div class=row></div>";
 btns.forEach(([t,v])=>{const x=document.createElement("button");x.className="btn";x.textContent=t;x.onclick=()=>{o.hidden=true;res(v)};b.lastChild.append(x)});o.hidden=false;b.querySelector("button").focus()})}
/* ---------- categorías, ajustes, nombres ---------- */
function buildCats(){const c=$("#catlist");c.innerHTML="";["Todas",...CATEGORIES].forEach(n=>{const b=document.createElement("button");b.textContent=n;
 const on=n==="Todas"?sv.cats.length===CATEGORIES.length:sv.cats.includes(n);b.className=on?"on":"";
 b.onclick=()=>{if(n==="Todas")sv.cats=[...CATEGORIES];else{const i=sv.cats.indexOf(n);i<0?sv.cats.push(n):sv.cats.length>1&&sv.cats.splice(i,1)}save();buildCats()};c.append(b)})}
function buildSettings(){$("#vfx").value=sv.vfx;$("#vmus").value=sv.vmus;$("#mute").checked=sv.mute;
 $("#stats").textContent=`Mejor puntuación: ${sv.best} € · Partidas: ${sv.stats.games} · Victorias: ${sv.stats.wins} · Paneles resueltos: ${sv.stats.panels}`}
$("#vfx").oninput=e=>{sv.vfx=+e.target.value;save()};$("#vfx").onchange=()=>SFX.ok();$("#vmus").oninput=e=>{sv.vmus=+e.target.value;save()};
$("#mute").onchange=e=>{sv.mute=e.target.checked;save()};
$("#wipe").onclick=async()=>{if(await modal("<p>¿Borrar preferencias, estadísticas y mejor puntuación?</p>",[["Borrar",1],["Cancelar",0]])){try{localStorage.removeItem(KEY)}catch(e){}sv=makeDef();buildSettings()}};
function buildNames(){const n=+$("#np").value,d=$("#names"),old=$$("#names input").map(i=>i.value);d.innerHTML="";
 for(let i=0;i<n;i++){const t=document.createElement("input");t.type="text";t.maxLength=14;t.value=old[i]||"Jugador "+(i+1);t.setAttribute("aria-label","Nombre del jugador "+(i+1));d.append(t)}}
$("#np").onchange=buildNames;
/* ---------- partida ---------- */
let G=null;
$("#start").onclick=()=>{if(!PANELS.length)return;initAudio();
 G={pl:$$("#names input").map((i,k)=>({name:i.value.trim().slice(0,14)||"Jugador "+(k+1),round:0,total:0})),turn:0,round:0,rounds:+$("#nr").value,timed:+$("#timed").value,used:[],pend:null,busy:false,paused:false,over:false,seen:[],hist:[]};
 music(false);sv.stats.games++;save();newPanel()};
function pickPanel(){const pool=PANELS.filter(p=>sv.cats.includes(p.c)&&!G.seen.includes(p.id));const all=PANELS.filter(p=>sv.cats.includes(p.c)),l=pool.length?pool:(all.length?all:PANELS);const p=l[rnd(l.length)];G.seen.push(p.id);return p}
function newPanel(){G.panel=pickPanel();G.used=[];G.pend=null;G.over=false;G.busy=false;G.paused=false;G.pl.forEach(p=>p.round=0);G.round++;$("#pause").textContent="Pausa";
 $("#cat").textContent=`Ronda ${G.round}/${G.rounds} · ${G.panel.c}: ${G.panel.h}`;buildKb("#kb",onLetter);drawBoard();render();go("game");setMsg("Gira la ruleta para empezar.");startTimer(G.timed)}
function buildKb(sel,fn){const k=$(sel);k.innerHTML="";ALPHA.forEach(l=>{const b=document.createElement("button");b.className="k"+(VOW.includes(l)?" v":"");b.textContent=l;b.dataset.l=l;b.onclick=()=>fn(l);k.append(b)})}
function boardHTML(el,sol,shown,all,newL){el.innerHTML="";sol.split(" ").forEach(w=>{const d=document.createElement("div");d.className="w";[...w].forEach(ch=>{const b=base(ch),t=document.createElement("div");
 if(!ALPHA.includes(b)){t.className="t f";t.textContent=ch}else{t.className="t";if(all||shown.includes(b)){t.classList.add("show");if(b===newL)t.classList.add("anim");t.textContent=ch.toUpperCase()}}d.append(t)});el.append(d)})}
const drawBoard=(all,newL)=>boardHTML($("#board"),G.panel.s,G.used,all,newL);
function render(){$("#players").innerHTML=G.pl.map((p,i)=>`<div class="pl${i===G.turn?" me":""}"><b>${esc(p.name)}</b>Ronda ${p.round} € · Total ${p.total} €</div>`).join("");
 $$("#kb .k").forEach(k=>k.classList.toggle("u",G.used.includes(k.dataset.l)));$("#spin").disabled=G.busy||G.paused||G.over||G.pend!==null}
function setMsg(t){$("#msg").textContent=t}
function nextTurn(){G.turn=(G.turn+1)%G.pl.length;G.pend=null;render()}
/* ---------- ruleta ---------- */
const cv=$("#wheel"),cx=cv.getContext("2d"),TAU=2*Math.PI;let ang=0;
function drawWheel(){const R=170,n=SECT.length,a=TAU/n;cx.clearRect(0,0,360,360);cx.save();cx.translate(180,180);cx.rotate(ang);
 SECT.forEach((s,i)=>{cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,R,i*a,(i+1)*a);cx.closePath();cx.fillStyle=s==="QUIEBRA"?"#111":s==="PIERDE TURNO"?"#ffffff":i%2?"#1f6bff":"#0b2a8f";cx.fill();cx.strokeStyle="#9cc4ff";cx.stroke();
  cx.save();cx.rotate(i*a+a/2);cx.fillStyle=s==="PIERDE TURNO"?"#0a1f6b":"#fff";cx.font="bold 15px Verdana";cx.textAlign="right";cx.fillText(typeof s==="number"?s+" €":s,R-12,5);cx.restore()});cx.restore();
 cx.beginPath();cx.moveTo(166,0);cx.lineTo(194,0);cx.lineTo(180,26);cx.closePath();cx.fillStyle="#ffd34d";cx.fill()}
const sectorAt=a=>Math.floor((((-Math.PI/2-a)%TAU)+TAU)%TAU/(TAU/SECT.length));
function endAngle(start,idx,turns){const a=TAU/SECT.length,tgt=-Math.PI/2-(idx+.5)*a;return start+turns*TAU+((((tgt-start)%TAU)+TAU)%TAU)}
function spinTo(idx){return new Promise(res=>{const start=ang,end=endAngle(start,idx,5+rnd(3)),dur=4200,t0=performance.now();let last=-1;
 (function f(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);ang=start+(end-start)*e;const sec=sectorAt(ang);if(sec!==last){last=sec;SFX.tick()}drawWheel();p<1?requestAnimationFrame(f):res()})(t0)})}
$("#spin").onclick=async()=>{if(!G||G.busy||G.paused||G.over||G.pend!==null)return;const g=G;g.busy=true;render();const idx=rnd(SECT.length);await spinTo(idx);SFX.stop();
 if(G!==g||g.over)return;g.busy=false;const s=SECT[idx],p=g.pl[g.turn];
 if(s==="QUIEBRA"){p.round=0;SFX.bad();setMsg(`¡QUIEBRA! ${p.name} pierde el dinero de la ronda.`);nextTurn()}
 else if(s==="PIERDE TURNO"){SFX.bad();setMsg(`${p.name} pierde el turno.`);nextTurn()}
 else{g.pend=s;setMsg(`${s} €: elige una consonante.`);render()}};
/* ---------- letras ---------- */
function onLetter(l){if(!G||G.busy||G.paused||G.over)return;const p=G.pl[G.turn],v=VOW.includes(l);
 if(G.used.includes(l))return setMsg(`La ${l} ya se ha elegido.`);
 if(v){if(p.round<VCOST)return setMsg(`Una vocal cuesta ${VCOST} € y tienes ${p.round} €.`);p.round-=VCOST}
 else if(G.pend===null)return setMsg("Primero gira la ruleta.");
 G.used.push(l);const c=[...G.panel.s].filter(ch=>base(ch)===l).length;
 if(c){if(!v){p.round+=G.pend*c;G.pend=null}drawBoard(false,l);SFX.reveal();setMsg(`¡Hay ${c} ${l}! ${p.name} sigue.`)}
 else{SFX.bad();setMsg(`No hay ninguna ${l}.`);nextTurn()}render()}
$("#solve").onclick=async()=>{if(!G||G.over||G.busy||G.paused)return;const g=G;g.paused=true;stopT();const a=await ask("Escribe la solución");g.paused=false;if(G!==g||g.over)return;startT();
 if(a===null)return render();const p=g.pl[g.turn];
 if(norm(a)===norm(g.panel.s)){endPanel(p)}else{SFX.bad();setMsg(`${p.name} falla.`);nextTurn()}};
function ask(t){return new Promise(res=>{const o=$("#overlay"),b=$("#obox");b.innerHTML=`<p>${t}</p><input id=ai autocomplete=off><div class=row><button class=btn id=ay>Enviar</button><button class=btn id=an>Cancelar</button></div>`;o.hidden=false;
 const ai=$("#ai");ai.focus();const done=v=>{o.hidden=true;res(v)};$("#ay").onclick=()=>done(ai.value);$("#an").onclick=()=>done(null);ai.onkeydown=e=>{if(e.key==="Enter")done(ai.value)}})}
async function endPanel(winner){const g=G;g.over=true;stopT();drawBoard(true);render();
 if(winner){winner.total+=winner.round;sv.stats.panels++;g.hist.push(`Ronda ${g.round}: ${winner.name} (+${winner.round} €)`);SFX.ok();$("#board").classList.add("pop")}
 else{g.hist.push(`Ronda ${g.round}: sin resolver`);SFX.bad()}
 g.pl.forEach(p=>p.round=0);const last=g.round>=g.rounds;
 await modal(winner?`<h3>¡${esc(winner.name)} resuelve!</h3><p>${esc(g.panel.s)}</p>`:`<h3>Se acabó el tiempo</h3><p>La solución era: ${esc(g.panel.s)}</p>`,[[last?"Continuar":"Siguiente panel",1]]);
 $("#board").classList.remove("pop");if(G!==g)return;last?toFinal():newPanel()}
$("#pause").onclick=()=>{if(!G||G.over||G.busy)return;G.paused=!G.paused;$("#pause").textContent=G.paused?"Reanudar":"Pausa";G.paused?stopT():startT();setMsg(G.paused?"Partida en pausa.":"");render()};
$("#quit").onclick=async()=>{if(await modal("<p>¿Salir de la partida?</p>",[["Salir",1],["Seguir",0]])){stopT();stopF();if(G)G.over=true;music(false);go("menu")}};
/* ---------- temporizador ---------- */
let tI=null,left=0;
function startTimer(s){stopT();left=s;$("#timer").textContent=s?left+" s":"";$("#timer").classList.remove("low");if(s)startT()}
function startT(){if(!G||!G.timed||tI||G.over)return;tI=setInterval(()=>{left--;$("#timer").textContent=left+" s";$("#timer").classList.toggle("low",left<=10);if(left<=10&&left>0)SFX.warn();if(left<=0){stopT();endPanel(null)}},1000)}
function stopT(){clearInterval(tI);tI=null}
/* ---------- panel final ---------- */
let F=null,fI=null;
function stopF(){clearInterval(fI);fI=null}
function toFinal(){const w=[...G.pl].sort((a,b)=>b.total-a.total)[0],pool=PANELS.filter(p=>p.s.length>=22&&sv.cats.includes(p.c)),l=pool.length?pool:PANELS;
 F={who:w,panel:l[rnd(l.length)],picks:[],phase:"pick",won:false,letters:[...FINAL0]};$("#fwho").textContent=w.name;$("#fform").hidden=true;$("#ftimer").textContent="";$("#ftimer").classList.remove("low");
 buildKb("#fkb",onFinalPick);$$("#fkb .k").forEach(k=>{if(FINAL0.includes(k.dataset.l))k.classList.add("u")});fBoard();
 $("#fmsg").textContent=`Pista: ${F.panel.h}. Ya se ven ${FINAL0.split("").join(" ")}. Elige 10 letras más (0/10).`;go("final")}
const fBoard=(all,newL)=>boardHTML($("#fboard"),F.panel.s,[...F.letters,...F.picks],all,newL);
function onFinalPick(l){if(!F||F.phase!=="pick"||F.letters.includes(l)||F.picks.includes(l))return;F.picks.push(l);$$("#fkb .k").find(k=>k.dataset.l===l).classList.add("u");
 $("#fmsg").textContent=`Elige 10 letras más (${F.picks.length}/10).`;if(F.picks.length<10)return;
 F.phase="play";fBoard(false,"*");SFX.reveal();$("#fmsg").textContent="¡Letras reveladas! Tienes 45 segundos.";$("#fform").hidden=false;$("#fans").value="";$("#fans").focus();music(true);
 let t=45;$("#ftimer").textContent=t;fI=setInterval(()=>{t--;$("#ftimer").textContent=t;$("#ftimer").classList.toggle("low",t<=10);if(t<=10&&t>0)SFX.warn();if(t<=0)finalEnd(false)},1000)}
$("#fform").onsubmit=e=>{e.preventDefault();if(!F||F.phase!=="play")return;finalEnd(norm($("#fans").value)===norm(F.panel.s))};
function finalEnd(ok){if(F.phase!=="play")return;F.phase="done";stopF();music(false);$("#fform").hidden=true;fBoard(true);F.won=ok;
 $("#fmsg").textContent=ok?"¡Correcto! Panel final resuelto.":`No ha podido ser. La solución era: ${F.panel.s}`;ok?SFX.win():SFX.bad();
 setTimeout(showResults,2500)}
function showResults(){const s=[...G.pl].sort((a,b)=>b.total-a.total);if(s[0].total>sv.best)sv.best=s[0].total;if(F&&F.won)sv.stats.wins++;save();
 $("#results").innerHTML=s.map((p,i)=>`<div>${i+1}. ${esc(p.name)}: ${p.total} €</div>`).join("")+`<div>Panel final: ${F&&F.won?"acertado":"fallado"}</div>`+G.hist.map(h=>`<div class=note>${esc(h)}</div>`).join("");go("end")}
$("#credits").onclick=()=>modal("<h3>Créditos</h3><p>Diseño y desarrollo: <b>Aledev Studios</b></p><p>Música y efectos generados con Web Audio API.</p><p>Proyecto independiente, sin relación con ningún programa de televisión.</p>",[["Cerrar",0]]);
if(!PANELS.length){const b=document.createElement("div");b.id="err";b.textContent="No se han cargado los paneles (data/panels.js). Descomprime el ZIP completo y abre index.html desde la carpeta extraída.";document.body.append(b)}
drawWheel();buildNames();
