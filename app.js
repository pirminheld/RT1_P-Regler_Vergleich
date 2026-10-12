'use strict';
const $=id=>document.getElementById(id), n=id=>Number($(id).value), fmt=(v,d=2)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).format(Math.abs(v)<1e-9?0:v);
const text=(id,value)=>$(id).textContent=value;
function chartFrame(xLabel,yLabel,xMin,xMax,yMin,yMax){
 const X=x=>60+(x-xMin)/(xMax-xMin)*535,Y=y=>240-(y-yMin)/(yMax-yMin)*200;
 let s='';for(let i=0;i<=4;i++){const y=yMin+(yMax-yMin)*i/4;s+=`<path class="grid" d="M60 ${Y(y)}H595"/><text x="48" y="${Y(y)+5}" text-anchor="end">${fmt(y,0)}</text>`;}
 for(let i=0;i<=4;i++){const x=xMin+(xMax-xMin)*i/4;s+=`<text x="${X(x)}" y="263" text-anchor="middle">${fmt(x,0)}</text>`;}
 s+=`<path class="axis" d="M60 36V240H598"/><text x="60" y="23">${yLabel}</text><text x="595" y="285" text-anchor="end">${xLabel}</text>`;
 return {s,X,Y};
}
function renderElectronic(){
 const r=Regler.electronic(n('ew'),n('ex'),n('r2'));
 for(const id of ['ew','ex'])text(id+'-value',fmt(n(id))+' V');text('r2-value',fmt(n('r2'),0)+' kΩ');
 text('r2-label','R₂ = '+fmt(n('r2'),0)+' kΩ');text('diff-label',fmt(-r.error)+' V');text('out-label',fmt(r.output)+' V');
 text('e-error',fmt(r.error)+' V');text('e-gain',fmt(r.gain,1));text('e-output',fmt(r.output)+' V');
 text('e-message',r.limited?'Ausgang begrenzt: Rechnerisch wären '+fmt(r.ideal)+' V nötig. Der OPV kann hier nur ±12 V ausgeben.':r.error>0?'Istwert unter Sollwert: Der Regler liefert eine positive Stellspannung.':r.error<0?'Istwert über Sollwert: Der Regler liefert eine negative Stellspannung.':'Sollwert und Istwert sind gleich: Die Stellspannung beträgt 0 V.');
 text('e-calculation',`${fmt(r.gain,1)} · (${fmt(n('ew'))} V − ${fmt(n('ex'))} V) = ${fmt(r.ideal)} V${r.limited?' → begrenzt auf '+fmt(r.output)+' V':''}`);
 const c=chartFrame('e = Uw − Uₓ / V','Uᵧ / V',-5,5,-12,12);let path='';for(let e=-5;e<=5.001;e+=.05)path+=(path?'L':'M')+c.X(e).toFixed(2)+' '+c.Y(Regler.clamp(r.gain*e,-12,12)).toFixed(2)+' ';
 $('e-chart').innerHTML=c.s+`<path class="axis" d="M${c.X(0)} 40V240M60 ${c.Y(0)}H595"/><path d="${path}" fill="none" stroke="#a45e06" stroke-width="3"/><circle cx="${c.X(r.error)}" cy="${c.Y(r.output)}" r="7" fill="#a45e06" stroke="white" stroke-width="2"/>`;
}
for(const id of ['ew','ex','r2'])$(id).addEventListener('input',renderElectronic);
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{$('ew').value=b.dataset.preset==='soll'?2.2:2;$('ex').value=b.dataset.preset==='ist'?2.2:2;$('r2').value=50;renderElectronic();}));
let h=52,t=0,running=false,history=[{t:0,h:52,w:60}],last=0,acc=0,sample=0;
function renderTank(){
 const w=n('mw'),k=n('mk'),out=n('mq'),inflow=Regler.tankFlow(h,w,k),opening=inflow/8;
 text('mw-value',fmt(w,0)+' cm');text('mk-value',fmt(k)+' L/(s·cm)');text('mq-value',fmt(out,1)+' L/s');
 text('sim-time','t = '+fmt(t,1)+' s · '+(running?'läuft':'pausiert'));
 const surface=335-h*2.25,setpoint=335-w*2.25;
 for(const id of ['water','water-ripple']){$(id).setAttribute('y',surface);$(id).setAttribute('height',Math.max(0,335-surface));}
 $('setpoint-line').setAttribute('d',`M145 ${setpoint}H585`);$('setpoint-text').setAttribute('y',setpoint-8);text('setpoint-text','w = '+fmt(w,0)+' cm');
 const shift=30*Math.tanh((w-h)/24),right=91+shift,left=91-shift*130/85;
 $('lever').setAttribute('d',`M230 ${left}L360 91L445 ${right}`);$('float-rod').setAttribute('d',`M445 ${right}V${surface+5}`);$('float').setAttribute('y',surface-8);
 $('valve').setAttribute('y',69-opening*18);$('in-stream').setAttribute('d',`M230 112V${Math.max(112,surface)}`);$('in-stream').style.opacity=inflow<.01?0:1;$('in-stream').style.strokeWidth=2+opening*8;
 $('out-stream').style.opacity=out<.01?0:1;$('out-stream').style.strokeWidth=2+out; text('height-text','h = '+fmt(h,1)+' cm');text('in-text','Zufluss '+fmt(inflow,1)+' L/s');text('out-text','Abfluss '+fmt(out,1)+' L/s');
 text('m-error',fmt(w-h,1)+' cm');text('m-valve',fmt(opening*100,0)+' %');text('m-flow',fmt(inflow,1)+' / '+fmt(out,1)+' L/s');
 const delta=inflow-out;
 text('m-message',Math.abs(delta)<.015?'Gleichgewicht: Zufluss = Abfluss. Der Wasserstand bleibt konstant'+(out>0?' – unterhalb des Sollwerts.':'.'):delta>0?'Zufluss größer als Abfluss: Der Wasserstand steigt. Der Schwimmer schließt das Ventil weiter.':'Abfluss größer als Zufluss: Der Wasserstand sinkt. Der Schwimmer öffnet das Ventil weiter.');
 const eq=Regler.equilibrium(w,k,out);text('equilibrium',out===0?'Ohne Abfluss genügt ein geschlossenes Ventil. Ein Wasserstand oberhalb des Sollwerts kann hier nicht aktiv abgesenkt werden.':`Im Gleichgewicht: e = qₐᵦ / K = ${fmt(out,1)} / ${fmt(k)} = ${fmt(out/k,1)} cm. Erwarteter Wasserstand: ${fmt(eq,1)} cm.`);
 const start=Math.max(0,t-60),end=Math.max(60,t),c=chartFrame('Zeit t / s','Wasserstand / cm',start,end,0,100),points=history.filter(p=>p.t>=start);
 function line(key){return points.map((p,i)=>(i?'L':'M')+c.X(p.t).toFixed(2)+' '+c.Y(p[key]).toFixed(2)).join(' ');}
 $('m-chart').innerHTML=c.s+`<path d="${line('w')}" fill="none" stroke="#2c60b0" stroke-width="2" stroke-dasharray="7 4"/><path d="${line('h')}" fill="none" stroke="#087f7c" stroke-width="3"/><circle cx="${c.X(t)}" cy="${c.Y(h)}" r="4" fill="#087f7c"/>`;
}
function setRunning(value){running=value;last=0;acc=0;$('tank').classList.toggle('running',running);text('play',running?'Pause':'Simulation starten');renderTank();}
function resetTank(disturb=false){$('mw').value=60;$('mk').value=.5;$('mq').value=4;h=disturb?56:52;t=0;history=[{t:0,h,w:60}];sample=0;setRunning(disturb);}
for(const id of ['mw','mk','mq'])$(id).addEventListener('input',()=>{history.push({t,h,w:n('mw')});renderTank();});
$('play').addEventListener('click',()=>setRunning(!running));$('reset-tank').addEventListener('click',()=>resetTank());$('disturb').addEventListener('click',()=>resetTank(true));
function animate(now){if(running){if(last){acc+=Math.min((now-last)/1000,.1);while(acc>=.02){h=Regler.tankStep(h,n('mw'),n('mk'),n('mq'),.02);t+=.02;acc-=.02;sample+=.02;if(sample>=.1){history.push({t,h,w:n('mw')});sample=0;}}history=history.filter(p=>p.t>=t-61);renderTank();}last=now;}requestAnimationFrame(animate);}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!==b.dataset.view);document.querySelectorAll('[data-view]').forEach(tab=>{tab.classList.toggle('active',tab===b);tab.setAttribute('aria-pressed',tab===b?'true':'false');});if(b.dataset.view!=='mechanical')setRunning(false);}));
$('projector').addEventListener('click',()=>{const active=document.body.classList.toggle('projector');$('projector').setAttribute('aria-pressed',String(active));text('projector',active?'Standardansicht':'Beameransicht');});
renderElectronic();renderTank();requestAnimationFrame(animate);



