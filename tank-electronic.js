'use strict';
// Two views of one simulation: parameters, time, level and history are shared.
const mechanicalView=document.getElementById('mechanical');
const electricTankView=mechanicalView.cloneNode(true);
electricTankView.id='electronic-tank';
electricTankView.querySelectorAll('[id]').forEach(el=>el.id='et-'+el.id);
electricTankView.querySelectorAll('[for]').forEach(el=>el.htmlFor='et-'+el.htmlFor);
electricTankView.querySelector('#et-water-ripple').setAttribute('fill','url(#et-water-pattern)');
electricTankView.querySelector('h2').textContent='Dasselbe Becken. Elektronisch geregelt.';
electricTankView.querySelector('.eyebrow').textContent='FÜLLSTANDSSENSOR + P-REGLER + ELEKTRISCHES VENTIL';
electricTankView.querySelector('.visual h3').textContent='Elektronische Füllstandsregelung';
electricTankView.querySelector('#et-tank').setAttribute('aria-label','Wasserbehälter mit elektronischem Füllstandssensor, P-Regler und elektrisch betätigtem Zulaufventil');
for(const id of ['lever','float-rod','float'])electricTankView.querySelector('#et-'+id).remove();
const svg=electricTankView.querySelector('#et-tank');
svg.querySelectorAll('text').forEach(el=>{if(/Hebel|Schwimmer|= Sensor/.test(el.textContent))el.remove();});
svg.querySelectorAll('path,circle').forEach(el=>{if(el.getAttribute('d')==='M347 110L360 91L373 110Z'||(el.tagName==='circle'&&el.getAttribute('cx')==='360'))el.remove();});
svg.insertAdjacentHTML('beforeend',`<rect x="338" y="12" width="174" height="60" rx="8" fill="#e8f2ef" stroke="#21645e" stroke-width="2"/><text x="425" y="36" text-anchor="middle" class="tiny">Vergleich + P-Regler</text><text id="et-voltage" x="425" y="59" text-anchor="middle" class="tiny y">Uᵧ = 5,00 V</text><path d="M338 42H230V50" class="signal-y"/><text x="251" y="30" class="tiny y">0–10 V</text><rect x="214" y="30" width="32" height="21" rx="3" fill="#fff6e8" stroke="#a45e06"/><text x="230" y="46" text-anchor="middle" style="font-size:14px">M</text><rect x="520" y="102" width="28" height="30" rx="4" fill="#dceeed" stroke="#087f7c" stroke-width="2"/><path id="et-sensing" d="M534 132V210" fill="none" stroke="#087f7c" stroke-width="2" stroke-dasharray="4 5"/><path d="M534 102V42H512" class="signal-x"/><text x="565" y="84" class="tiny x">Sensor 0–10 V</text><text id="et-sensor" x="565" y="108" class="tiny x">Uₓ = 5,20 V</text><text id="et-reference" x="338" y="92" class="tiny w">U𝓌 = 6,00 V</text>`);
electricTankView.querySelector('.controls .hint').textContent='K ist dieselbe effektive Reglerwirkung wie beim Hebelmodell. Sensor: 0–100 cm → 0–10 V. Ventil: 0–10 V → 0–8 L/s.';
electricTankView.querySelector('.reasoning>p:not(.eyebrow)').textContent='Bei h = w beträgt die Stellspannung 0 V und das Ventil ist geschlossen. Ein dauerhafter Abfluss erfordert eine positive Stellspannung und damit eine positive Regelabweichung.';
electricTankView.querySelector('details p').textContent='Dasselbe Beckenmodell wie in der mechanischen Ansicht: A = 1 L/cm; qzu = begrenzt(K · (w − h), 0, 8 L/s). Idealer linearer Sensor: Ux = 0,1 V/cm · h; Sollwertspannung Uw = 0,1 V/cm · w. P-Verstärkung KPR = K / (0,08 L/(s·cm)); Uy = begrenzt(KPR · (Uw − Ux), 0, 10 V). Ventil: qzu = 0,8 L/(s·V) · Uy. Sensor, Regler und Ventil arbeiten ohne Verzögerung. Deshalb ist die Dynamik beider Varianten identisch. Reale Sensorfehler, Totzeiten und Stellzeiten sind nicht modelliert. Keine Voröffnung und kein I-Anteil.';
electricTankView.querySelector('.reasoning').insertAdjacentHTML('beforeend','<p id="et-conversion" class="hint"></p>');
mechanicalView.after(electricTankView);
const compareTab=document.querySelector('[data-view="compare"]');
compareTab.insertAdjacentHTML('beforebegin','<button class="tab" data-view="electronic-tank" aria-pressed="false">03 <span>Becken elektronisch</span></button>');
compareTab.firstChild.textContent='04 ';
document.querySelector('[data-view="mechanical"] span').textContent='Becken mechanisch';
document.querySelector('[data-view="electronic"] span').textContent='OPV-Regler einzeln';

function loopDiagram(electronic){
 const key=electronic?'el':'me',reg=electronic?'P-Verstärker':'Hebelwirkung',sensor=electronic?'Füllstandssensor':'Schwimmer',act=electronic?'E-Ventil':'Zulaufventil';
 return `<div class="card loop-card"><p class="eyebrow">REGELKREIS · FUNKTIONEN ZUORDNEN</p><h3>${electronic?'Elektronik':'Mechanik'}: derselbe geschlossene Wirkungsablauf</h3><div class="loop-scroll"><svg viewBox="0 0 1000 280" role="img" aria-label="Sollwert zur Vergleichsstelle, P-Regler, Ventil, Wasserbecken, Wasserstand; negative Rückführung über ${sensor}; Abflussstörung am Becken"><defs><marker id="${key}-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#456371"/></marker></defs><g fill="none" stroke="#456371" stroke-width="2" marker-end="url(#${key}-head)"><path d="M25 105H145"/><path d="M195 105H265"/><path d="M405 105H480"/><path d="M620 105H695"/><path d="M835 105H965"/><path d="M900 105V225H630"/><path d="M470 225H170V130"/><path d="M765 22V75"/></g><circle cx="170" cy="105" r="25" fill="white" stroke="#456371" stroke-width="2"/><text x="158" y="112">+</text><text x="175" y="147">−</text><rect x="265" y="75" width="140" height="60" rx="6" fill="#e8f2ef" stroke="#719e94"/><rect x="480" y="75" width="140" height="60" rx="6" fill="#faf0dd" stroke="#b19159"/><rect x="695" y="75" width="140" height="60" rx="6" fill="#e8f2ef" stroke="#719e94"/><rect x="470" y="195" width="160" height="60" rx="6" fill="#dceeed" stroke="#719e94"/><g text-anchor="middle" class="loop-labels"><text x="335" y="111">${reg}</text><text x="550" y="111">${act}</text><text x="765" y="111">Wasserbecken</text><text x="550" y="231">${sensor}</text><text x="335" y="164">Regler</text><text x="550" y="164">Stellglied</text><text x="765" y="164">Strecke</text></g><text x="30" y="87" class="w tiny">${electronic?'Uw = 0,1 · w':'Sollwert w'}</text><text x="207" y="62" class="tiny">${electronic?'eᵤ':'e = w − h'}</text><text x="417" y="87" class="y tiny">${electronic?'Uy':'Öffnung'}</text><text x="636" y="87" class="y tiny">qzu</text><text x="907" y="87" class="x tiny">x = h</text><text x="790" y="30" class="tiny">z = Abfluss</text><text x="250" y="213" class="x tiny">${electronic?'Ux = 0,1 · h':'Rückmeldung h'}</text><g class="loop-live"><text id="${key}-live-w" x="30" y="62" class="w"></text><text id="${key}-live-e" x="207" y="40"></text><text id="${key}-live-y" x="417" y="62" class="y"></text><text id="${key}-live-q" x="636" y="62" class="y"></text><text id="${key}-live-h" x="900" y="62" class="x"></text><text id="${key}-live-z" x="790" y="54"></text><text id="${key}-live-feedback" x="250" y="250" class="x"></text><text id="${key}-live-k" x="335" y="128" text-anchor="middle" class="block-live"></text><text id="${key}-live-opening" x="550" y="128" text-anchor="middle" class="block-live y"></text></g></svg></div><p class="hint">${electronic?'Spannungsvergleich: eᵤ = Uw − Ux. Sensor und Sollwert verwenden dieselbe Skalierung in V/cm.':'Vergleichsstelle und P-Regler sind Funktionen desselben mechanischen Aufbaus; sie sind hier zum Erklären getrennt dargestellt.'} Farbige Zahlen zeigen die aktuellen Simulationswerte. Die mechanische Stellbewegung wird als relative Ventilöffnung in Prozent dargestellt. Pfeile zeigen Wirkungsrichtungen, keine Rohrleitungen.</p></div>`;
}
mechanicalView.querySelector('.lab-grid').insertAdjacentHTML('afterend',loopDiagram(false));
electricTankView.querySelector('.lab-grid').insertAdjacentHTML('afterend',loopDiagram(true));
for(const id of ['mw','mk','mq'])document.getElementById('et-'+id).addEventListener('input',event=>{document.getElementById(id).value=event.target.value;document.getElementById(id).dispatchEvent(new Event('input'));});
for(const id of ['play','reset-tank','disturb'])document.getElementById('et-'+id).addEventListener('click',()=>document.getElementById(id).click());
window.renderElectronicTank=function(){
 for(const id of ['mw','mk','mq'])document.getElementById('et-'+id).value=document.getElementById(id).value;
 for(const id of ['mw-value','mk-value','mq-value','sim-time','m-error','m-valve','m-flow','equilibrium','height-text','in-text','out-text','setpoint-text','play'])document.getElementById('et-'+id).textContent=document.getElementById(id).textContent;
 for(const id of ['water','water-ripple','setpoint-line','setpoint-text','valve','in-stream','out-stream']){
  const source=document.getElementById(id),dest=document.getElementById('et-'+id);
  for(const attr of ['y','height','d','style'])if(source.hasAttribute(attr))dest.setAttribute(attr,source.getAttribute(attr));
 }
 document.getElementById('et-m-chart').innerHTML=document.getElementById('m-chart').innerHTML;
 document.getElementById('et-tank').classList.toggle('running',running);
 const k=n('mk'),q=Regler.tankFlow(h,n('mw'),k),v=q/.8;
 for(const key of ['me','el']){
  const electronic=key==='el';
  text(key+'-live-w',fmt(n('mw')*(electronic?.1:1),electronic?2:1)+(electronic?' V':' cm'));
  text(key+'-live-e',fmt((n('mw')-h)*(electronic?.1:1),2)+(electronic?' V':' cm'));
  text(key+'-live-y',electronic?fmt(v)+' V':fmt(q/8*100,1)+' %');
  text(key+'-live-q',fmt(q,2)+' L/s');
  text(key+'-live-h',fmt(h,1)+' cm');
  text(key+'-live-z',fmt(n('mq'),2)+' L/s');
  text(key+'-live-feedback',fmt(h*(electronic?.1:1),electronic?2:1)+(electronic?' V':' cm'));
  text(key+'-live-k',electronic?'KPR = '+fmt(k/.08):'K = '+fmt(k));
  text(key+'-live-opening',fmt(q/8*100,1)+' % offen');
 }

 text('et-voltage','Uᵧ = '+fmt(v)+' V');text('et-sensor','Uₓ = '+fmt(h*.1)+' V');text('et-reference','Uw = '+fmt(n('mw')*.1)+' V');
 document.getElementById('et-sensing').setAttribute('d',`M534 132V${Math.max(132,335-h*2.25)}`);
 text('et-conversion',`KPR = ${fmt(k/.08)}; Uw − Ux = ${fmt((n('mw')-h)*.1)} V; Stellspannung Uy = ${fmt(v)} V → Ventilöffnung ${fmt(q/8*100,0)} %.`);
 text('et-m-message',document.getElementById('m-message').textContent.replace('Der Schwimmer schließt','Der elektronische Regler schließt').replace('Der Schwimmer öffnet','Der elektronische Regler öffnet'));
};
const compare=document.getElementById('compare');
compare.querySelector('.compare-hero').innerHTML='<div><span>ELEKTRONISCHES BECKEN</span><strong>Sensor → P-Regler → E-Ventil</strong><p>Elektrische Signale übertragen die Regelwirkung.</p></div><b>P</b><div><span>MECHANISCHES BECKEN</span><strong>Schwimmer → Hebel → Ventil</strong><p>Mechanische Bewegung überträgt die Regelwirkung.</p></div>';
compare.querySelector('tbody').innerHTML=[['Aufgabe','Wasserstand trotz Abfluss halten','Wasserstand trotz Abfluss halten'],['Sollwert w','Gewünschter Wasserstand, als Uw vorgegeben','Gewünschter Wasserstand, mechanisch eingestellt'],['Messglied','Elektronischer Füllstandssensor: Ux = 0,1 V/cm · h','Schwimmer: Bewegung durch den Wasserstand'],['Vergleich und P-Regler','Spannungsdifferenz Uw − Ux; P-Verstärker','Sollwerteinstellung und Hebelwirkung'],['Stellglied','Elektrisch betätigtes Zulaufventil','Mechanisch betätigtes Zulaufventil'],['Strecke / Störung','Dasselbe Becken / derselbe Abfluss','Dasselbe Becken / derselbe Abfluss'],['Effektive Reglerwirkung','K = 0,08 · KPR in L/(s·cm)','K fasst Hebel- und Ventilwirkung zusammen'],['Gleichgewicht bei Abfluss','Zufluss = Abfluss; bleibende Abweichung','Zufluss = Abfluss; dieselbe bleibende Abweichung']].map(row=>'<tr><th>'+row[0]+'</th><td>'+row[1]+'</td><td>'+row[2]+'</td></tr>').join('');
compare.querySelector('.table-wrap').insertAdjacentHTML('beforebegin','<p class="shared-note">Fairer Vergleich: Beide Beckenansichten teilen Sollwert, Reglerwirkung, Abfluss, Wasserstand und Zeitverlauf. Beim Wechsel pausiert die Simulation. Gleiche ideale Reglerwirkung ergibt denselben Verlauf – Elektronik allein beseitigt die bleibende Abweichichung nicht.</p>'.replace('Abweichichung','Abweichung'));

