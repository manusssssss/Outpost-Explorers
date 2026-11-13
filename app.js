import {missions,checked,sources} from './missions.js';
import {mountMissionDemo} from './mission-demo.js?v=10';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Learning remains available when storage is disabled. */}}
const validIds=new Set(missions.map(m=>m.id));
const initial=read('outpost-saved',[]);
const saved=new Set(Array.isArray(initial)?initial.filter(id=>validIds.has(id)):[]);
const seenInitial=read('outpost-stations',[]);
const seen=new Set(Array.isArray(seenInitial)?seenInitial.filter(x=>typeof x==='string'):[]);
let world='Moon',station='habitat',filterWorld='All',limit=9;
const stations={
 habitat:{icon:'⌂',name:'The living habitat',tag:'A HOME WITH AN IMPORTANT JOB',text:'Astronauts need a sealed home with air pressure, oxygen, water, sleeping spaces and a place to eat. An airlock lets them go outside without emptying the whole habitat of air.',Moon:'Lunar dust is sharp and clingy. An outpost would need ways to keep it away from spacesuits, seals and lungs.',Mars:'Mars has an atmosphere, but it is far too thin and mostly carbon dioxide. Astronauts would still need a pressurised home and spacesuits.',think:'Why does an astronaut need an airlock, even when there is a door?'},
 garden:{icon:'♧',name:'A garden far from Earth',tag:'GROWING, RECYCLING & LEARNING',text:'A carefully controlled greenhouse could grow fresh food and let scientists study plants away from Earth. Lights, water, nutrients and temperature all need attention.',Moon:'Ordinary lunar regolith is not garden soil. A greenhouse would need a protected growing system and reliable power.',Mars:'Martian soil contains salts that can be harmful. Future farmers would need tested, controlled growing methods, not simply seeds in the ground.',think:'If sunlight becomes unreliable, how could your plants keep growing?'},
 power:{icon:'☼',name:'The power station',tag:'EVERY SYSTEM NEEDS ENERGY',text:'Power runs lights, heaters, air systems, instruments and communication equipment. Solar panels can help, but energy storage and backup sources matter too.',Moon:'Away from some polar locations, lunar nights last roughly two Earth weeks. Batteries and other power sources become important.',Mars:'Dust can cover solar panels and reduce sunlight. Some Mars rovers use a radioisotope power source instead of solar panels.',think:'Would you spend your last battery charge on a bright screen or an air pump? Why?'},
 rover:{icon:'⚙',name:'The exploration rover',tag:'WHEELS, CAMERAS & CLEVER TOOLS',text:'A rover carries cameras, instruments and sometimes a drill. Robotic rovers explore without astronauts. Future crewed rovers could transport people, equipment and samples.',Moon:'Low gravity does not make steep slopes safe. Craters, rocks and soft regolith still make route planning essential.',Mars:'Commands can take several minutes to travel between Earth and Mars. Rovers need onboard software to help avoid hazards.',think:'Why can’t someone on Earth drive a Mars rover exactly like a remote-control car?'},
 lab:{icon:'⚗',name:'The science laboratory',tag:'SMALL SAMPLES. BIG QUESTIONS.',text:'Scientists study rocks, dust, ice and gases to understand how a world formed and changed. Clean tools and reference samples help them trust the results.',Moon:'Lunar rocks record impacts and ancient volcanic activity. Studying polar material could help us understand water and other frozen substances.',Mars:'Scientists investigate ancient water, climate and whether past environments could have supported microbes. Life on Mars has not been confirmed.',think:'What could happen if dust from your glove gets into an important sample?'},
 relay:{icon:'⌁',name:'A connection to home',tag:'SENDING DISCOVERIES ACROSS SPACE',text:'Antennas turn information into radio signals. Orbiters can relay messages between a surface mission and Earth. Hills, craters and a planet itself can block the path.',Moon:'The far side cannot directly face Earth. A relay spacecraft can provide a communication link around the Moon.',Mars:'Messages cannot arrive instantly. At times, the Sun also gets in the way of communication between Earth and Mars.',think:'If a crater blocks your radio signal, could an orbiter help?'}
};
const facts={
 Moon:[['Gravity','About ⅙ of Earth','You would weigh less, but your mass would stay the same.'],['Sky','Almost no atmosphere','There is no breathable air and no ordinary wind.'],['Surface','Craters & regolith','Fine rock fragments cover much of the ground.']],
 Mars:[['Gravity','About ⅜ of Earth','Moving and lifting would feel different from Earth.'],['A day','About 24 h 39 min','A Martian solar day is called a sol.'],['Atmosphere','Thin & mostly CO₂','A spacesuit is still essential for going outside.']]
};
function renderStation(){
 seen.add(world+':'+station);persist('outpost-stations',[...seen]);
 const s=stations[station],index=Object.keys(stations).indexOf(station);
 $('#station-card').innerHTML='<div class="station-tag"><span>STATION '+(index+1)+' / 6</span><b>'+world.toUpperCase()+'</b></div><div class="station-icon" aria-hidden="true">'+s.icon+'</div><h3>'+s.name+'</h3><p>'+s.text+'</p><p><strong>On '+(world==='Moon'?'the Moon':'Mars')+'</strong> · '+s[world]+'</p><div class="think-box"><b>Think like an explorer</b><p>'+s.think+'</p></div><button class="next-station">Next station →</button>';
 $('#station-card .next-station').addEventListener('click',()=>{station=Object.keys(stations)[(index+1)%6];renderStation();});
 $$('.hotspot').forEach(b=>{const active=b.dataset.station===station;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 $$('.world-switch button').forEach(b=>{const active=b.dataset.world===world;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});
 $('#map-wrap').classList.toggle('mars-map',world==='Mars');
 $('#map-caption').textContent=(world==='Moon'?'LUNAR SOUTH POLE':'MARTIAN LANDING ZONE')+' · FUTURE CONCEPT';
 $('#station-progress').textContent=[...seen].filter(x=>x.startsWith(world+':')).length+' of 6 stations explored';
 $('#world-facts').innerHTML=facts[world].map(([a,b,c])=>'<div class="fact"><small>'+a+'</small><b>'+b+'</b><p>'+c+'</p></div>').join('');
}
$$('.hotspot').forEach(b=>b.addEventListener('click',()=>{station=b.dataset.station;renderStation();}));
$$('.world-switch button').forEach(b=>b.addEventListener('click',()=>{world=b.dataset.world;renderStation();}));
const agencies=[...new Set(missions.map(m=>m.agency))].sort();
$('#agency-filter').innerHTML+='<option>'+agencies.map(escape).join('</option><option>')+'</option>';
function filterMissions(){
 const q=$('#mission-search').value.toLowerCase().trim(),status=$('#status-filter').value,agency=$('#agency-filter').value;
 return missions.filter(m=>(filterWorld==='All'||m.world===filterWorld)&&(status==='All'||m.status===status)&&(agency==='All'||m.agency===agency)&&[m.name,m.agency,m.summary,m.fact,m.type,String(m.year??'')].join(' ').toLowerCase().includes(q)).sort((a,b)=>$('#sort-filter').value==='name'?a.name.localeCompare(b.name):$('#sort-filter').value==='old'?(a.year??9999)-(b.year??9999):(b.year??9999)-(a.year??9999));
}
function dateLine(m){if(m.launchDate){const grouped=m.launchDate.includes(' · '),series=/programme|program|series/i.test(m.type);return (grouped?'Launch dates':series?'First launch':'Launch date')+' · '+m.launchDate;}if(m.status==='Planned')return 'Target · '+(m.year??'date')+'; exact day not announced';return m.year?'Launch date not listed · '+m.year:'Date not announced';}
function card(m){
 return '<article class="mission-card"><div class="card-visual '+m.world.toLowerCase()+'"><img src="assets/'+m.world.toLowerCase()+'.jpg" alt="" loading="lazy"><span class="year">'+(m.year??'AHEAD')+'</span><button class="bookmark '+(saved.has(m.id)?'saved':'')+'" data-save="'+m.id+'" aria-pressed="'+saved.has(m.id)+'" aria-label="'+(saved.has(m.id)?'Unsave':'Save')+' '+escape(m.name)+'">'+(saved.has(m.id)?'◆':'◇')+'</button></div><div class="card-body"><div class="mission-meta"><span>'+(m.name==='Apollo 9'?'Earth orbit · Crewed test':m.world+' · '+escape(m.type))+'</span><span class="status '+m.status+'">'+m.status+'</span>'+(m.featured?'<span class="featured-study">Enhanced 3D</span>':'')+'</div><h3>'+escape(m.name)+'</h3><p class="agency mission-agency-line"><span>'+escape(m.agency.toLowerCase())+'</span><span class="mission-date">'+escape(dateLine(m))+'</span></p><p class="card-description">'+escape(m.summary)+'</p><button class="mission-open" data-open="'+m.id+'">Review mission <span>↗</span></button></div></article>';
}
function bindCards(scope){scope.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openMission(b.dataset.open)));scope.querySelectorAll('[data-save]').forEach(b=>b.addEventListener('click',()=>toggleSave(b.dataset.save)));}
function renderMissions(){
 const list=filterMissions();
 $('#results').textContent=list.length+' '+(list.length===1?'mission':'missions')+' found';
 $('#mission-grid').innerHTML=list.length?list.slice(0,limit).map(card).join(''):'<p class="empty">No missions found. Try another word or choose “Every chapter”.</p>';
 $('#load-more').hidden=list.length<=limit;
 bindCards($('#mission-grid'));
}
$$('[data-filter-world]').forEach(b=>b.addEventListener('click',()=>{filterWorld=b.dataset.filterWorld;limit=9;$$('[data-filter-world]').forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',on);});renderMissions();}));
['mission-search','status-filter','agency-filter','sort-filter'].forEach(id=>$('#'+id).addEventListener(id==='mission-search'?'input':'change',()=>{limit=9;renderMissions();}));
$('#load-more').addEventListener('click',()=>{limit+=9;renderMissions();});
const dialog=$('#mission-dialog');
let stopMissionDemo=null;
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{stopMissionDemo?.();stopMissionDemo=null;});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function openMission(id){
 const m=missions.find(x=>x.id===id);if(!m)return;
 dialog.classList.remove('mission-dialog-expanded');
 stopMissionDemo?.();stopMissionDemo=null;
 $('#dialog-content').innerHTML='<p class="dialog-world">'+(m.name==='Apollo 9'?'EARTH-ORBIT TEST FLIGHT':m.world.toUpperCase()+' EXPLORATION')+'</p><h2>'+escape(m.name)+'</h2><p class="mission-agency-line"><span>'+escape(m.agency.toLowerCase())+'</span><span class="mission-date">'+escape(dateLine(m))+'</span></p><div class="detail-facts"><div><small>'+(m.status==='Planned'?'TARGET / TIMING':'FIRST LAUNCH YEAR')+'</small>'+(m.year??'To be confirmed')+'</div><div><small>CHAPTER</small>'+m.status+'</div><div><small>EXPLORER TYPE</small>'+escape(m.type)+'</div></div><section class="mission-study-summary"><p class="mission-study-kicker">'+(m.status==='Planned'?'WHAT THE MISSION PLANS TO DO':m.status==='Unsuccessful'?'WHAT THE MISSION ATTEMPTED':'MISSION SUMMARY')+'</p><p>'+escape(m.summary)+'</p></section><div class="think-box"><b>A discovery to remember</b><p>'+escape(m.fact)+'</p></div><div class="mission-demo-invite"><div><b>See the mission in 3D</b><p>'+(m.status==='Planned'?'Illustrative preview of the planned mission goals.':'Explore a simple 3D mission sequence.')+'</p></div><button class="button primary" data-open-mission-demo="'+m.id+'">Open 3D mission view <span>↗</span></button></div><div class="dialog-actions"><a class="button secondary" href="'+m.source+'" target="_blank" rel="noopener">Read the agency source ↗</a><button class="button secondary" data-dialog-save="'+m.id+'">'+(saved.has(id)?'Saved ◆':'Save to notebook ◇')+'</button></div><p class="detail-note">Reviewed '+checked+'. Programme entries group several spacecraft and use their first launch year. “Past” records historic work, not a judgement that every objective succeeded. Planned dates are targets. This is a reviewed guide, not live spacecraft telemetry.</p>';
 $('[data-open-mission-demo]').addEventListener('click',()=>openMissionDemo(id));
 $('[data-dialog-save]').addEventListener('click',()=>{toggleSave(id);$('[data-dialog-save]').textContent=saved.has(id)?'Saved ◆':'Save to notebook ◇';});
 if(!dialog.open)dialog.showModal();
}
function openMissionDemo(id){
 const m=missions.find(x=>x.id===id);if(!m)return;
 dialog.classList.add('mission-dialog-expanded');
 stopMissionDemo?.();stopMissionDemo=null;
 $('#dialog-content').innerHTML='<button class="mission-demo-back" data-back-to-summary="'+m.id+'">← Back to mission summary</button><p class="dialog-world">'+(m.name==='Apollo 9'?'EARTH ORBIT · TEST FLIGHT':escape(m.world.toUpperCase())+' · '+(m.status==='Planned'?'PLANNED GOALS · CONCEPT':'MISSION STUDY'))+'</p><h2>'+escape(m.name)+'</h2><p class="mission-agency-line mission-demo-agency"><span>'+escape(m.agency.toLowerCase())+'</span><span class="mission-date">'+escape(dateLine(m))+'</span></p><p class="mission-demo-disclaimer">'+(m.status==='Planned'?'Illustrative concept based on announced goals. This is not a final design or a live mission.':'Illustrative 3D study based on the mission summary. This is not live spacecraft telemetry.')+'</p><div class="mission-demo" data-mission-demo></div><div class="mission-demo-caption"><span class="mission-demo-step-label"></span><p class="mission-demo-step-copy"></p></div><div class="mission-demo-controls"><button class="button secondary" data-demo-prev>← Previous step</button><span class="mission-demo-progress" aria-live="polite"></span><button class="button primary" data-demo-next>Next step →</button></div><div class="mission-demo-summary"><b>Mission summary</b><p>'+escape(m.summary)+'</p><a href="'+m.source+'" target="_blank" rel="noopener">Read the agency source ↗</a></div><p class="detail-note">Reviewed '+checked+'. Educational 3D illustration: models are not to scale; paths compress time and distance, and motion does not simulate real gravity, orbital mechanics, or vehicle physics.</p>';
 $('[data-back-to-summary]').addEventListener('click',()=>openMission(id));
 stopMissionDemo=mountMissionDemo($('[data-mission-demo]'),m,{
  label:$('.mission-demo-step-label'),copy:$('.mission-demo-step-copy'),progress:$('.mission-demo-progress'),
  previous:$('[data-demo-prev]'),next:$('[data-demo-next]')
 });
}
$('#about-data').addEventListener('click',()=>{
 $('#dialog-content').innerHTML='<p class="dialog-world">HOW WE LEARN</p><h2>Follow the evidence.</h2><p>Our atlas covers '+missions.length+' major mission and programme entries. It is not an exhaustive launch register. Entries include NASA, Soviet missions, Roscosmos, ISRO, CNSA, ESA, JAXA, Korean and UAE teams, international partners and commercial lunar missions.</p><p><strong>Past</strong> means historic work. <strong>Exploring</strong> is used where the reviewed source describes ongoing work. <strong>Travelling</strong> means a launched journey is underway. <strong>Launched</strong> records that a mission flew; its current health has not been independently confirmed here. <strong>Planned</strong> means a future goal. <strong>Unsuccessful</strong> records an attempt that did not achieve its central goal.</p><p>Some programmes group spacecraft. For individual launches and fuller histories, use the official archives. Launch years and future targets are labelled separately in each entry.</p><p>Reviewed '+checked+'. This is a static educational snapshot. It does not update itself.</p><div class="source-links"><a href="'+sources.moon+'" target="_blank" rel="noopener">Full Moon archive ↗</a><a href="'+sources.mars+'" target="_blank" rel="noopener">Mars history ↗</a></div>';
 dialog.showModal();
});
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}
function toggleSave(id){if(!validIds.has(id))return;if(saved.has(id)){saved.delete(id);toast('Removed from your notebook');}else{saved.add(id);toast('A new discovery saved');}persist('outpost-saved',[...saved]);renderMissions();renderSaved();}
function renderSaved(){
 $('#save-count').textContent=saved.size;
 $('#saved-missions').innerHTML=saved.size?'<div class="saved-list">'+missions.filter(m=>saved.has(m.id)).map(m=>'<div class="saved-item"><button data-open="'+m.id+'">'+escape(m.name)+'<small>'+m.world+' · '+escape(m.agency)+'</small></button><button data-save="'+m.id+'" aria-label="Remove '+escape(m.name)+' from notebook">×</button></div>').join('')+'</div>':'<div class="empty">Your notebook is ready for its first discovery. Tap ◇ on any mission to save it here.</div>';
 bindCards($('#saved-missions'));
}
const questions=[
 {q:'What does an airlock help astronauts do?',a:['Go outside without losing all the habitat’s air','Make the Moon’s gravity stronger','Turn dust into drinking water'],right:0,why:'An airlock is a small sealed chamber. Its pressure can change without emptying the main habitat.'},
 {q:'Which mission first put people on the Moon?',a:['Chandrayaan-3','Apollo 11','Mariner 4'],right:1,why:'Apollo 11 landed in 1969. Chandrayaan-3 was robotic, and Mariner 4 flew past Mars.'},
 {q:'Why do Mars rovers need help from onboard software?',a:['They cannot send any pictures','Mars has too much oxygen','Radio messages take minutes to cross space'],right:2,why:'Signals travel at the speed of light, but the distance is huge. A rover cannot wait for Earth to steer around every rock.'},
 {q:'Does a water-related measurement prove that life exists?',a:['Yes, always','No. Scientists need more evidence','Only when a rover takes the measurement'],right:1,why:'Water can be important for life, but detecting water or a water-related mineral is not the same as detecting life.'},
 {q:'Which pair is working together on Chandrayaan-5 / LUPEX?',a:['ISRO and JAXA','Apollo and Viking','Sojourner and the Sun'],right:0,why:'India and Japan are collaborating on a mission to investigate the Moon’s polar resources.'}
];
let qi=0,score=0,answered=false;
function renderQuiz(){
 if(qi===questions.length){
  persist('outpost-quiz-best',Math.max(Number(read('outpost-quiz-best',0))||0,score));
  $('#quiz-card').innerHTML='<div class="quiz-top"><span>EXPEDITION COMPLETE</span><span>✦</span></div><h3>You found '+score+' out of '+questions.length+' answers!</h3><p class="quiz-feedback">Every question is a chance to learn. Try the outpost stations and mission atlas, then give it another go.</p><p class="quiz-feedback">Best in this browser: '+read('outpost-quiz-best',score)+' / 5</p><button class="button primary" id="quiz-restart">Explore again ↻</button>';
  $('#quiz-restart').addEventListener('click',()=>{qi=0;score=0;renderQuiz();});return;
 }
 answered=false;const q=questions[qi];
 $('#quiz-card').innerHTML='<div class="quiz-top"><span>QUESTION '+(qi+1)+' OF '+questions.length+'</span><span>'+score+' discoveries ✧</span></div><h3>'+q.q+'</h3><div class="answers">'+q.a.map((a,i)=>'<button class="answer" data-answer="'+i+'">'+a+'</button>').join('')+'</div><p class="quiz-feedback" aria-live="polite"></p><button class="button primary quiz-next" hidden>Next question →</button>';
 $$('.answer').forEach(b=>b.addEventListener('click',()=>{if(answered)return;answered=true;const chosen=Number(b.dataset.answer);if(chosen===q.right)score++;$$('.answer').forEach(x=>{x.disabled=true;if(Number(x.dataset.answer)===q.right)x.classList.add('correct');});if(chosen!==q.right)b.classList.add('wrong');$('.quiz-feedback').textContent=(chosen===q.right?'You got it! ':'A new thing to learn! ')+q.why;$('.quiz-next').hidden=false;}));
 $('.quiz-next').addEventListener('click',()=>{qi++;renderQuiz();});
}
renderStation();renderMissions();renderSaved();renderQuiz();

